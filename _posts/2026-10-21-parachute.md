---
layout: post
title: The Case for Single-Pass Instance-Optimal Join Algorithms (When Storage Is Cheap)
date: 2026-10-22
description: With the rise of worst-case optimal joins, the database community has witnessed an increasing (re-)interest in optimizing the execution of join queries, both from research and industry, with a special attention to instance-optimal join algorithms, which require multiple passes over the data. In 🪂 Parachute, we show that it's possible to offload one such pass to data loading time by statically analyzing between which tables the information flow is blocked and leveraging precomputed join-induced fingerprint columns on FK-tables.
related_publications: true
toc:
  sidebar: right

author: "<a href=\"https://stoianmihail.github.io/\">Mihail Stoian</a>"
---

With the rise of [worst-case optimal joins](https://arxiv.org/abs/1203.1952) in 2012, the database community has witnessed an increasing (re-)interest in optimizing the execution of join queries, both from research ([Umbra](https://dl.acm.org/doi/abs/10.14778/3407790.3407797), [Predicate Transfer](https://arxiv.org/abs/2307.15255), [Robust Predicate Transfer](https://arxiv.org/abs/2502.15181), [Yannakakis+](https://dl.acm.org/doi/10.1145/3725423), [Lookup & Expand](https://db.in.tum.de/people/sites/birler/papers/diamond.pdf), [RPT++](https://dl.acm.org/doi/abs/10.14778/3797919.3797934)) and industry systems (e.g., [SQL Server](https://www.vldb.org/cidrdb/papers/2026/p29-zhao.pdf)'s dissection). These algorithms are commonly referred to as instance-optimal algorithms. The field itself is not new, having originated with [Yannakakis’ algorithm](https://dl.acm.org/doi/10.5555/1286831.1286840) in 1981. 

## Why Yannakakis’ Was Not Enough

While the theoretical results are very promising, there is one recurrent issue that seems to dominate the community discussions: even today, the default Yannakakis’ algorithm hasn’t seen adoption in production. Instead, a rather more primitive form has seen wide adoption, even in production systems: the Bloom join - others refer to it as [sideways information passing](https://repository.upenn.edu/server/api/core/bitstreams/7c57fb82-79e4-42d5-9753-f67599418e65/content) (SIP) or [semi-join filtering](https://cdn.amazon.science/11/0e/3a9288554485b616fa0c99fe4067/predicate-caching-query-driven-secondary-indexing-for-cloud-data-warehouses.pdf). Upon closer inspection, it’s somehow clear that the Bloom join has made it into production, as it preserves the single-pass behavior of query execution, i.e., it doesn’t require additional passes over the tables: (i) construct hash tables on the build sides of the joins, and (ii) probe into these hash tables. Concretely, the Bloom filter pushed down to the probe side removes dangling tuples, i.e., tuples that will anyway not survive later joins. We decided to refer throughout the paper to this technique as _probe-side filtering_ (PSF), as it’s always the probe side which is filtered (and the way it's filtered doesn't have to be through an _exact_ semi-join).

Unlike PSF, Yannakakis’ algorithm requires multiple passes over the data, making query execution rather intricate. That is the reason why DuckDB refused to merge RPT’s pull request – an Yannakakis-inspired (instance-optimal) algorithm that removes the dangling tuples so that the final pass is executed on tables whose tuples will survive all joins in the plan. What PSF is essentially missing is the backward information flow present in instance-optimal algorithms. Namely, PSF induces only an upwards information flow (we formalize the information flow in [Sec. 2.4](https://arxiv.org/abs/2506.13670)).

## 🪂 Parachute

In Parachute {% cite stoian2025parachute %}, we propose to enable the downwards information flow by pre-processing join-induced fingerprints, which are stored on foreign-key (FK) tables and are used during query execution to filter out dangling tuples. Doing this naively, however, results in overhead in both space and runtime. That’s why our fingerprints are lightweight, allowing for blazingly fast checks of whether a tuple is dangling or not. We support both numeric columns and, more importantly, string columns. For instance, for numeric data, we use histograms. On the [JOB](https://www.vldb.org/pvldb/vol9/p204-leis.pdf) benchmark, this results in a 1.24x speedup over PSF-enabled DuckDB.

Let’s see how Parachute works at query execution time. Assume our system supports PSF by default. In the query $Q$, there is a filter predicate on table $T$. There are three steps to enable the information flow’s upwards direction: (A) We take the query plan of query $Q$, as output by the system’s query optimizer. (B) We run an information-flow analysis which identifies the pairs of tables between which information flow is blocked. Since PSF induces an upwards flow, we see that there’s no flow from $T$ to $S$, i.e., ᄀ ($T$ ⇝ $S$). This is where Parachute comes in. In (C), using the already pre-computed fingerprint columns in the database, it drops the parachute predicate on $S$, unblocking the downwards information flow, and, along with the already available upwards flow, it enables a bi-directional flow, similar to instance-optimal algorithms.

{% include figure.liquid loading="eager" path="assets/img/posts/parachute-1.jpg" %}

## Fingerprints

How to build the fingerprint columns? In the current version, these are built during a pre-processing step, e.g., at data loading time. The next figure visualizes this step. Given the FK-table cast_info  we consider the non-key column year from table title. We attach the fingerprint column corresponding to year by performing the join with title and storing a lightweight representation (lossy) representation of the column. To this end, we use a histogram – for instance, the year value 2025 is mapped to histogram bin 3. That’s why both tuples with `cast_info.movie_id` = 789 have the value of 3 in the attached fingerprint column. 

{% include figure.liquid loading="eager" path="assets/img/posts/parachute-2.jpg" %}

We can see that attaching a parachute of a column is equivalent to denormalizing a table, yet with a _lossy_ representation of the FK-induced columns. The loading phase is surely the most expensive, yet we show that for large workloads, this overhead amortizes.

## Results

We evaluated Parachute on the JOB and CEB benchmarks. On JOB, the speedup on the vanilla DuckDB is 1.54x (`parachute[duckdb + psf]`), whereas if we enable PSF only, the speedup is 1.24x (`duckdb + psf`). We can also inspect the number of dangling tuples left on the base tables, namely we achieve a reduction of 8.79x and 2.38x in the total number of dangling tuples over vanilla DuckDB and DuckDB with PSF, respectively. (On the 13k-query CEB, the speedup is similar.) Note that these results are using 16-bit fingerprints, which take up to +15% storage overhead over the original database size. We evaluated with multiple bitwidths, namely `{2, 4, 8, 16}`, whose additional footprint can be observed in the figure below, along with the achieved number of dangling tuples and normalized execution time.

{% include figure.liquid loading="eager" path="assets/img/posts/parachute-3.png" %}

## Podcast

We’re delighted that we could take about Parachute on the [Disseminate: The Computer Science Research Podcast](https://www.youtube.com/watch?v=HfZuVtY5lZg). Given its framework-like style, Parachute is a lightweight mechanism to boost one’s join-heavy workloads, without having to modify the query engine.

## Future Work

Motivated by the rather intriguing property of string fingerprints to act as a false-positive {% ihighlight sql %}LIKE{% endihighlight %} evaluation, we optimized them to the workload – this resulted in [Instance-Optimized String Fingerprints](https://arxiv.org/pdf/2507.10391) {% cite stoian2025stringfingerprints %}. We plan to bring this workload optimization into all column types. A great feature of fingerprint columns is that they can be (implicitly) used for file skipping, resulting in join pruning! We’re preparing a DuckDB extension that can be used by database practitioners to boost their query workloads without changing DuckDB’s internals.
