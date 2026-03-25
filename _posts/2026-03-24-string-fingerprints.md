---
layout: post
title: String Fingerprints
date: 2026-03-24
description: Cloud data warehouses are text-heavy. As the amount of text data to scan increases, queries become slower, therefore query engines require fast pre-filters to accelerate them. We present string fingerprints, a lightweight secondary index structure designed to approximate LIKE predicates, albeit with false positives. Fingerprints can be optimized for specific workloads using mixed-integer optimization and even generalize to unseen table filters.
related_publications: true
toc:
  sidebar: right

author: "<a href=\"https://stoianmihail.github.io/\">Mihail Stoian</a>, <a href=\"https://www.linkedin.com/in/carl-david-reese/\">Carl-David Reese</a>"
---

Strings. This is the data type that Amazon Redshift reports account for more than 50% of its fleet data ([van Renen et al., 2024](https://www.vldb.org/pvldb/vol17/p3694-saxena.pdf)). As the amount of string data to scan increases, queries become slower, therefore query engines require fast pre-filters to accelerate them.

However, when it comes to query execution on string-valued columns, systems provide only limited solutions. To see an example, note that modern file formats such as Parquet, while they have the celebrated min/max zonemaps to skip non-matching row groups, they lack  zonemaps to skip infix `LIKE` predicates such as {% ihighlight sql %}WHERE comment LIKE '%fox%'{% endihighlight %}. Indeed, min/max zonemaps can only help in the case of prefix `LIKE` predicates, as in ([Zimmerer et al., 2025](https://arxiv.org/pdf/2504.11540)). Other zonemap structures, like bloom filters, as in [Postgres](https://www.postgresql.org/docs/current/bloom.html) or [Parquet](https://parquet.apache.org/docs/file-format/bloomfilter/), also don’t help here, as we’d have to insert all possible substrings of a row group’s strings.

This is where string fingerprints {% cite stoian2025stringfingerprints %} come into play. In this blog post, we only outline how they can help to skip non-matching rows. Extending them to row groups is an (exciting) work in progress.


## String Fingerprints

The original idea of string fingerprints came to us last year on a train trip from Nuremberg to Munich. We wanted to have a way to skip as many non-matching tuples as possible for a `LIKE` predicate. Our first idea was pretty simple: If a string does not contain all letters of a pattern, then it can’t contain it.

Now, you don’t want to store a bitmap for all possible letters – this would be too much overhead. Instead, we can cluster the letters into some *bins*, and mark the bins that have the letters contained in the to-be-fingerprinted string. Let’s do our favorite example – how to fingerprint the string "nutella", given the following partitioning of the alphabet:


{% include figure.liquid loading="eager" path="assets/img/posts/nutella-1.png" class="img-fluid rounded z-depth-1 d-block mx-auto" width="50%" %}



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
