---
layout: post
title: The Case for Synthesized Data Compression
date: 2026-10-28
description: Today's compression schemes are generally designed by hand to apply to many different types of data, leading to a zoo of general-purpose algorithms which work well for many datasets, but may not be optimal for any specific dataset. Inspired by recent advancements in agentic coding, we propose synthesizing custom-tailored data compression algorithms on a per-dataset basis. We show that our synthesis agent can expand the compression-factor/decompression-speed Pareto front, outperforming general-purpose methods by nearly 2× in compression factor.
related_publications: true
toc:
 sidebar: right
_styles: |
 .astra-label {
   font-weight: 450;
 }
 .astra-a1 {
   color: #0072b2;
 }
 .astra-a2 {
   color: #d55e00;
 }
 .astra-a3 {
   color: #009e73;
 }
 .astra-a4 {
   color: #cc79a7;
 }


author: "<a href=\"https://www.linkedin.com/in/ivan-iachnyk-658607312/\">Ivan Iachnyk</a>, <a href=\"https://stoianmihail.github.io/\">Mihail Stoian</a>"
---


LZ4, Zstandard, Brotli, bzip2, XZ, zlib, FSST, OnPair, etc. Our community's answer to compression has long been a *zoo*: a remarkably diverse collection of general-purpose algorithms, each occupying its own place along the speed-versus-compression-ratio trade-off, and all designed to compress more or less anything we give them.


This is a fine state of affairs, and these codecs are marvels of engineering. Yet a codec that compresses everything reasonably well is, by the same token, rarely optimal for any particular dataset. Your logs are not "any data"; neither are your JSON files or your UUID columns. Every dataset has structure that a general-purpose codec cannot fully exploit. And that is where the idea of dataset-specific codecs comes in.

The idea of synthesizing a compressor for an individual file is [hardly new](https://ieeexplore.ieee.org/document/7877101). What has changed, rather dramatically, we should say, is the machinery available to pursue it. Coding models have become more capable and less expensive in a remarkably short time. OpenAI's GPT-6 Astra was our favorite when we wrote the paper, and by the time we sat down to write this post, Claude Opus 5.5 had already arrived, beating previous models on multiple benchmarks yet again. This seemed like a good reason to revisit an old idea: why painstakingly engineer a codec for a specific dataset, whatever kind of data it may contain, when an agent might discover and implement one for us? Better still, compression offers an unusually reliable way to check its correctness. Whatever the agent invents, we can compress the data, decompress it, and compare the result with the original, byte for byte.

## An Example

Here is an example of a compression codec that our agent came up with by itself:

{% include figure.liquid loading="eager" path="assets/img/posts/synthesized-compression-1.jpg" %}

The agent examined the [OpenStack](https://github.com/logpai/loghub/tree/master/OpenStack) logs and recognized a pattern that seems obvious in retrospect: the lines consist largely of timestamps, instance IDs, and recurring boilerplate. It therefore kept the constant characters in templates, packed the changing digits of timestamps and IDs into four-bit nibbles, and wrote an AVX-512 decoder that expands the nibbles and shuffles them back into place. The resulting codec decodes at 13 GB/s, compared with `LZ4`'s 8 GB/s, while achieving an 11× compression factor instead of 9×, respectively.

To be clear, there is nothing fundamentally novel about the individual techniques involved. Template-based log compression has been explored before ([CLP](https://www.usenix.org/conference/osdi21/presentation/rodrigues)), and an experienced engineer could certainly have designed a similar codec. That, however, is not what makes the result interesting. The remarkable part is that *nobody had to design it*. The agent discovered the structure and implemented the codec independently, simply because we allowed it to do something that general-purpose algorithm design ordinarily discourages: *overfit*.

Also, rather conveniently, part of the necessary infrastructure already exists. Modern file formats such as [AnyBlox](https://doi.org/10.14778/3749646.3749672), [Vortex](https://docs.vortex.dev/specs/file-format), and [F3](https://doi.org/10.1145/3749163) can carry executable code alongside the data, a capability originally intended for backwards compatibility that turns out to be remarkably well suited to storing bespoke codecs.

## The Synthesis Loop

The pipeline itself is almost embarrassingly simple, and we rather like it that way. After all, the intelligence is supposed to come from the agent, not from an elaborate system surrounding it.

A user provides a dataset and a performance goal, which may be absolute ("_achieve the best compression factor possible_") or relative ("_surpass this decompression throughput at a comparable compression factor_"). Within the optimization loop (see figure below), the agent proposes codecs, while a testing environment evaluates their compression factor, throughput, and byte-exactness. Armed with this feedback, the agent revises its approach and repeats the process until either it is satisfied with the result or the user's budget is exhausted. The best surviving codec then undergoes full byte-for-byte validation before being packaged into a container alongside the data.

{% include figure.liquid loading="eager" path="assets/img/posts/synthesized-compression-2.jpg" %}

One particularly important lesson from the weeks we spent refining our prompts was to provide reference performance numbers _without revealing_ which algorithms produced them. Naming the algorithm behind those numbers can bias the agent's search toward an existing approach, whereas an anonymous numerical target leaves it free to explore alternatives and encourages it to work until the given result is beaten. (Giving the agent numerical performance targets to beat works particularly well with GPT models!)

## Does It Beat the Zoo?

All of this sounds promising, but there is an inconvenient question left: Can an agent-written codec really beat compressors that have spent decades being optimized by people who know exactly what they are doing?

To find out, we gave our agents four rather different datasets to work with: OpenStack logs, Python source code from [PyTorrent](https://arxiv.org/abs/2110.01710), [Yelp](https://business.yelp.com/data/resources/open-dataset/) reviews, and [SQLStorm](https://doi.org/10.14778/3749646.3749683)'s TPC-DS queries. For each dataset, we gave the agents four distinct challenges, labeled <span class="astra-label astra-a1">A1</span> through <span class="astra-label astra-a4">A4</span> in the figure below. <span class="astra-label astra-a1">A1</span> chased the fastest decompression possible, while <span class="astra-label astra-a2">A2</span> tried to squeeze the data down as far as it would go. For <span class="astra-label astra-a3">A3</span>, the agent was told to aim for a moderate compression factor and then push for speed, whereas <span class="astra-label astra-a4">A4</span> reversed the priorities, settling for moderate decompression speed in pursuit of tighter compression.

A Pareto plot captures the results particularly well. Across all four datasets, the synthesized codecs managed to push beyond the trade-offs offered by traditional algorithms, improving the observed Pareto front at both ends. The fastest ones were faster *and* smaller, while the smallest ones managed to compress even further without sacrificing decompression speed. On OpenStack, for instance, one codec achieved an 87% higher compression factor than `Brotli` while decoding almost twice as fast. On some of these datasets, synthesized codecs did particularly well, even better than we had hoped.

{% include figure.liquid loading="eager" path="assets/img/posts/synthesized-compression-3.jpg" %}

Next came [`dbtext`](https://dl.acm.org/doi/10.14778/3407790.3407851), a collection of 23 columns containing everything from Hamlet and Chinese text to UUIDs, hardly a group of strings with much in common. Yet the agents found their way around this assortment as well (see figure below), with some implementations reusing the same general compression algorithms for multiple columns. One synthesized codec decoded roughly 30% faster than [OnPair+](https://doi.org/10.14778/3836663.3836714) and compressed slightly better, while another surpassed `bzip2`'s compression factor and still decoded more than eight times as fast. Better yet, all these compression factors include the size of the generated codec itself, since, after all, the agents do produce specialized decoders, and that space should be charged accordingly.

{% include figure.liquid loading="eager" path="assets/img/posts/synthesized-compression-4.jpg" %}

This plot also includes results for the open [GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash) model, following the same "protocol"; we label the variants G1-G4.

## What About Random Access?

A database column, however, is not just a file. We rarely want to decompress an entire block just to retrieve a single value. Sometimes we need row 4,001,400, and we need it now.

Thus, it is no longer enough for the codec to reconstruct the complete dataset. It must also be able to retrieve individual rows without decompressing everything that comes before them, while ensuring that every possible row position gives us exactly the right bytes.

As a natural reference for row access, we chose [FSST](https://doi.org/10.14778/3407790.3407851) because its interface natively supports batch compression and decoding individual strings, and gave the agents only its performance numbers to beat. We also added [OnPair+](https://doi.org/10.14778/3836663.3836714), another string compressor, as a further baseline for evaluating the results. Among the designs the agents produced, the fastest codec retrieved selected rows almost twice as quickly as `FSST` while occupying roughly a third less space. Other designs favored compression instead, including one that achieved a 94% higher compression factor than `FSST` while still retrieving rows faster. And the most compact design went further still, reducing the stored package to just 10.25 MB, though its decoder was noticeably slower.

{% include figure.liquid loading="eager" path="assets/img/posts/synthesized-compression-5.jpg" %}

That last trade-off is worth emphasizing. Not every codec the agent discovers will be the right choice for every workload, nor should it be. The beauty of synthesis lies in setting the terms of the bargain ourselves, whether that means faster access, smaller storage, or a compromise between the two, and letting the agent work out how to achieve it.

Which naturally brings us to another question. We have seen what these codecs can do, but what exactly did the agents come up with to make it possible?

## What the Agents Came Up With

This is, without a doubt, our favorite part of the project: examining the generated codecs after the experiments and discovering what the agents actually invented.

Unfortunately, time is one of the few things we still do not know how to compress, and even a blog post about compression has its limits of space. We could happily devote several more pages to the curious tricks our agents devised, but we shall leave most of those stories to the paper {% cite iachnyk2026synthesizedcompression %}. Here, we will indulge in just one.

Consider the UUID column of `dbtext`. At first glance, it hardly seems a promising place to look for clever compression. The column contained row after row of hexadecimal identifiers, apparently unrelated to one another, with little to suggest that anything interesting might be hiding beneath the surface. Yet the agent, evidently unimpressed by appearances, discovered that these strings were considerably less mysterious than they pretended to be.

As the figure below illustrates, the middle field remained identical across the column, while even parts of the suffix never changed. More surprisingly still, the leading field followed a simple arithmetic progression. Instead of storing every UUID in full, the agent kept the shared starting point and step just once, leaving each row to carry only its step count and the few suffix bits that actually varied. These were packed so tightly that even a changing hexadecimal character could occupy fewer than four bits.

{% include figure.liquid loading="eager" path="assets/img/posts/synthesized-compression-6.jpg" %}

Perhaps the deeper lesson of our story is that compression affords coding agents a rare luxury: the freedom to pursue even their strangest ideas without asking us to take the results on faith. A synthesized codec may exploit the most peculiar regularities, bend conventional techniques to its own purposes, or overfit shamelessly, provided that every byte of the original data gets reconstructed. There is something rather appealing about this bargain between invention and certainty, and if we can establish it elsewhere in a DBMS, compression may turn out to be only the beginning.

*Our story continues. There is more to unpack.*

Our code, along with the codecs synthesized by the agents, is open source: [https://github.com/utndatasystems/synthesized-data-compression](https://github.com/utndatasystems/synthesized-data-compression).
