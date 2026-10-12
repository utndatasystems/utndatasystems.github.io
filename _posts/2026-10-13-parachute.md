---
layout: post
title: The Case for Single-Pass Instance-Optimal Join Algorithms (When Storage Is Cheap)
date: 2026-10-12
description: With the rise of worst-case optimal joins, the database community has witnessed an increasing (re-)interest in optimizing the execution of join queries, both from research and industry, with a special attention to instance-optimal join algorithms, which require multiple passes over the data. In Parachute, we show that it is possible to offload one such pass to data loading time, by statically analyzing between which tables the information flow is blocked and by leveraging precomputed join-induced fingerprint columns on FK-tables.
related_publications: true
toc:
  sidebar: right

author: "<a href=\"https://stoianmihail.github.io/\">Mihail Stoian</a>"
---

With the rise of [worst-case optimal joins](https://arxiv.org/abs/1203.1952) in 2012, the database community has witnessed an increasing (re-)interest in optimizing the execution of join queries, both from research ([Umbra](https://dl.acm.org/doi/abs/10.14778/3407790.3407797), [Predicate Transfer](https://arxiv.org/abs/2307.15255), [Robust Predicate Transfer](https://arxiv.org/abs/2502.15181), [Yannakakis+](https://dl.acm.org/doi/10.1145/3725423), [Lookup & Expand](https://db.in.tum.de/people/sites/birler/papers/diamond.pdf), [RPT++](https://dl.acm.org/doi/abs/10.14778/3797919.3797934)) and industry systems ([SQL Server](https://www.vldb.org/cidrdb/papers/2026/p29-zhao.pdf)). These algorithms are commonly referred to as instance-optimal algorithms. The field itself is not new, having originated with [Yannakakis’ algorithm](https://dl.acm.org/doi/10.5555/1286831.1286840) in 1981. 

## Why Yannakakis’ Was Not Enough

While the theoretical results are very promising, there is one recurrent issue that seems to dominate the community discussions: even today, the default Yannakakis’ algorithm hasn’t seen adoption in production. Instead, a rather more primitive form has seen wide adoption, even in production systems: the Bloom join - others refer to it as [sideways information passing](https://repository.upenn.edu/server/api/core/bitstreams/7c57fb82-79e4-42d5-9753-f67599418e65/content) (SIP) [2] or [semi-join filtering](https://cdn.amazon.science/11/0e/3a9288554485b616fa0c99fe4067/predicate-caching-query-driven-secondary-indexing-for-cloud-data-warehouses.pdf) [3]. Upon closer inspection, it’s somehow clear that the Bloom join has made it into production, as it preserves the single-pass behavior of query execution, i.e., it doesn’t require additional passes over the tables: (i) construct hash tables on the build sides of the joins, and (ii) probe into these hash tables. Concretely, the Bloom filter pushed down to the probe side removes dangling tuples, i.e., tuples that will anyway not survive later joins. We decided to refer throughout the paper to this technique as probe-side filtering (PSF), as it’s always the probe side which is filtered.

Unlike PSF, Yannakakis’ algorithm requires multiple passes over the data, making query execution rather intricate. That is the reason why DuckDB refused to merge RPT’s pull request – an (instance-optimal) algorithm that removes the dangling tuples so that the final pass is executed on tables whose tuples will survive all joins in the plan. What PSF is essentially missing is the backward information flow present in instance-optimal algorithms. Namely, PSF induces only an upwards information flow (we formalize the information flow in Sec. 2.4 of our [paper](https://arxiv.org/abs/2506.13670)).

## Parachute

In [Parachute](https://arxiv.org/abs/2506.13670), we propose to enable the downwards information flow by pre-processing join-induced fingerprints, which are stored on foreign-key (FK) tables that are used during query execution to filter out dangling tuples. Doing this naively, however, results in overhead in both space and runtime. That’s why our fingerprints are lightweight, allowing for blazingly fast checks of whether a tuple is dangling or not. We support both numeric columns and, more importantly, string columns. For instance, for numeric data, we use histograms. On the [JOB](https://www.vldb.org/pvldb/vol9/p204-leis.pdf) benchmark, this results in a 1.24x speedup over PSF-enabled DuckDB.

Let’s see how Parachute works at query execution time. Assume our system supports PSF by default. In the query Q, there is a filter predicate on table T. There are three steps to enable the information flow’s upwards direction: (A) We take the query plan of the query, as output by the system’s query optimizer. (B) We run an information-flow analysis which identifies the pairs of tables between which information flow is blocked. Since PSF induces an upwards flow, we see that there’s no flow from T to S, i.e., ᄀ (T ⇝ S). This is where Parachute comes in. In (C), using the already pre-computed fingerprint columns in the database, it drops the parachute predicate on S, unblocking the downwards information flow, and, along with the already available upwards flow, it enables a bi-directional flow, similar to instance-optimal algorithms.

{% include figure.liquid loading="eager" path="assets/img/posts/parachute-1.png" class="img-fluid rounded z-depth-1 d-block mx-auto" width="100%" %}

## Fingerprints

How to build the fingerprint columns? In the current version, these are built during a pre-processing step, e.g., at data loading time. The next figure visualizes this step. Given the FK-table cast_info  we consider the non-key column year from table title. We attach the fingerprint column corresponding to year by performing the join with title and storing a lightweight representation (lossy) representation of the column. To this end, we use a histogram – for instance, the year value 2025 is mapped to histogram bin 3. That’s why both tuples with movie_id = 789 have the value of 3 in the attached fingerprint column. 

{% include figure.liquid loading="eager" path="assets/img/posts/parachute-1.png" class="img-fluid rounded z-depth-1 d-block mx-auto" width="100%" %}

We can see that attaching a parachute of a column is equivalent to denormalizing a table, yet with a lossy representation on the FK-induced columns. The loading phase is surely the most expensive, yet we show that for large workloads, this overhead amortizes.

## Results

We evaluated Parachute on the JOB and CEB benchmarks.  On JOB, the speedup on the vanilla DuckDB is 1.54x (parachute[duckdb + psf]), whereas if we enable PSF only, the speedup is 1.24x (duckdb + psf). We can also inspect the number of dangling tuples left on the base tables, namely we achieve a reduction of 8.79x and 2.38x in the total number of dangling tuples over vanilla DuckDB and DuckDB with PSF, respectively. (On the 13k-query CEB, the speedup is similar.) Note that these results are using 16-bit fingerprints, which take up to +15% storage overhead over the original database size. We evaluated with multiple bitwidths, namely {2, 4, 8, 16}, whose additional footprint can be observed in the figure below, along with the achieved number of dangling tuples and normalized execution time.


## Community Adoption

We’re happy to see that Parachute has been featured on the Disseminate: The Computer Science Research Podcast – given its framework-like style, Parachute is a lightweight mechanism to boost one’s join-heavy workloads, without having to modify the query engine. Also, we’re glad to see that our PSF implementation in DuckDB v1.2 (before v1.5 introduced it) was used in RPT+, which is a highly-optimized RPT in DuckDB.

## Future Work

Motivated by the rather intriguing property of string fingerprints to act as a false-positive LIKE evaluation, we optimized them to the workload – this resulted in our AIDB’25 paper (blog). We plan to bring this workload optimization into all column types. A great feature of fingerprint columns is that they can be (implicitly) used for file skipping, resulting in join pruning! We’re preparing a DuckDB extension that can be used by database practitioners to boost their query workloads without changing DuckDB’s internals.


Strings. This is the data type that Amazon Redshift reports account for more than 50% of its fleet data ([van Renen et al., 2024](https://www.vldb.org/pvldb/vol17/p3694-saxena.pdf)). As the amount of string data to scan increases, queries become slower, therefore query engines require fast pre-filters to accelerate them.

However, when it comes to query execution on string-valued columns, systems provide only limited solutions. To see an example, note that modern file formats such as Parquet, while they have the celebrated min/max zonemaps to skip non-matching row groups, they lack  zonemaps to skip infix `LIKE` predicates such as {% ihighlight sql %}WHERE comment LIKE '%fox%'{% endihighlight %}. Indeed, min/max zonemaps can only help in the case of prefix `LIKE` predicates, as in ([Zimmerer et al., 2025](https://arxiv.org/pdf/2504.11540)). Other zonemap structures, like bloom filters, as in [Postgres](https://www.postgresql.org/docs/current/bloom.html) or [Parquet](https://parquet.apache.org/docs/file-format/bloomfilter/), also don’t help here, as we’d have to insert all possible substrings of a row group’s strings.

This is where string fingerprints {% cite stoian2025stringfingerprints %} come into play. In this blog post, we only outline how they can help to skip non-matching rows. Extending them to row groups is an (exciting) work in progress.


## String Fingerprints

The original idea of string fingerprints came to us last year on a train trip from Nuremberg to Munich. We wanted to have a way to skip as many non-matching tuples as possible for a `LIKE` predicate. Our first idea was pretty simple: If a string does not contain all letters of a pattern, then it can’t contain it.

Now, you don’t want to store a bitmap for all possible letters – this would be too much overhead. Instead, we can cluster the letters into some *bins*, and mark the bins that have the letters contained in the to-be-fingerprinted string. Let’s do our favorite example – how to fingerprint the string "nutella", given the following partitioning of the alphabet:


You can see that the <span style="color:blue;">blue</span> letters (n, t, e) are mapped to the 3rd bin, while the <span style="color:brown;">brown</span> letters are mapped to the 1st bin. Therefore, the fingerprint reads: `1010`.

Let’s now fingerprint more strings. To this end, consider the column `spelling` of the following table and its fingerprints in `str_fp`. The first row is "nutella" (we already did it above). Now we come to "unt", which gets the same fingerprint. Finally, "thon" is mapped to `0111`.

{% include figure.liquid loading="eager" path="assets/img/posts/nutella-2.png" class="img-fluid rounded z-depth-1 d-block mx-auto" width="50%" %}


Assume now you’re performing a filter {% ihighlight sql %}WHERE spelling LIKE '%utn%'{% endihighlight %}. We simply have to fingerprint the pattern, in this case `1010`, and check which table fingerprints _don’t_ contain it, i.e., there exists at least one bin where the pattern has a 1 while the considered row fingerprint does not. We see that `1010` is _not_ contained in 0111 – there’s a mismatch already at the first bin. This means, the `LIKE` predicate would anyway evaluate to false for this row, so we can skip it.



## Optimizing the Partition

Whenever I present string fingerprints, the first question I get is: *"But how do you optimize the partition?"*. If you have no information about your query workload, taking a random mapping is enough (we just chose a round-robin placement; basically each letter is mapped to {% ihighlight sql %}ASCII(letter) % 4{% endihighlight %}). But let’s say you have the workload; say your customer provides you with that. In that case, you can do better.

At UTN, we strive to be interdisciplinary. As the last slide of my PhD proposal deck, I pitched the idea of having string zonemaps to Johannes Thürauf, our professor for Discrete Optimization. He liked it, so we decided, given his expertise, that it’d be a promising idea to optimize the partition. Two weeks later, we had the mixed-integer program (MIP) and could then test it. The idea is to optimize the false positive rate of your string fingerprints using the column data and the query workload. You can read more about the MIP in the 2nd section of our paper.


## Community Adoption

I was very happy to see that string fingerprints got adopted very quickly. For instance, [SqueezeCache](https://xiangpeng.systems/_app/immutable/assets/squeeze-cache.CgwfvKO-.pdf) (coming from its parent project, [LiquidCache](https://dl.acm.org/doi/10.14778/3773731.3773741)) uses 32-bit string fingerprints in their cache data structure to skip scanning the mapped Parquet rows.

Our code, along with Johannes’ MIP implementation, are open source on our GitHub page: [Instance-Optimized String Fingerprints (AIDB @VLDB'25)](https://github.com/utndatasystems/string-fingerprints).
