---
layout: page
title: LLM-Based Compression
description: Making ML-powered compression fast, robust, and practical for data systems.
img: assets/img/projects/llm-compression-lobster-mascot.png
card_image_class: card-img-top project-card-image--spectra-ratio
importance: 4
category: work
related_publications: true
related_publications_title: Publications
related_publications_heading_level: 4
related_publications_group_by: none
---

**Project Leads:** [Luisa Neubauer](https://www.linkedin.com/in/luisa-neubauer/) and [Mihail Stoian](https://stoianmihail.github.io/)

#### Description

**LLM-Based Compression** is a research project by the **[Data Systems Lab](https://utndatasystems.github.io/)** at the **[University of Technology Nuremberg (UTN)](https://www.utn.de/)** that explores two lossless approaches: compressing text with LLM predictions and entropy coding, and using coding agents to create codecs for specific datasets.

We study when storage savings justify compression and decompression costs, how to improve throughput, and how LLM-based compression handles adversarial inputs. Synthesized codecs are verified by reconstructing data byte for byte, then run without model inference while targeting fast decompression and random access.

{% include figure.liquid loading="eager" path="assets/img/projects/llm-compression-lobster-mascot.png" class="mx-auto d-block col-2" %}

#### Collaborators

- [David Adams](https://www.linkedin.com/in/david-b-adams/) — Doctoral Researcher, University of Melbourne
- [Robin Sternberg](https://www.linkedin.com/in/robin-sternberg/) — Student Researcher
- [Ivan Iachnyk](https://www.linkedin.com/in/ivan-iachnyk-658607312/) — Student Researcher

<!-- cite papers so they show up in references, but keep them hidden -->
<div class="d-none">
  {% cite kipf2025llmcompress adams2026fastllmcompression neubauer2026adversarial iachnyk2026synthesizedcompression %}
</div>
