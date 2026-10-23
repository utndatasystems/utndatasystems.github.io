---
layout: page
title: ILIKE Data Skipping
description: Data Skipping for Expensive Operators.
img: assets/img/projects/ilike-parrots.png
card_image_class: card-img-top project-card-image--jungle-vignette
importance: 5
category: work
published: true
related_publications: true
related_publications_title: Publications
related_publications_heading_level: 4
related_publications_group_by: none
---

**Project Leads:** [Mihail Stoian](https://stoianmihail.github.io/) and [Andi Zimmerer](https://andi-zimmerer.com/)

#### Description

**ILIKE Data Skipping** is a research project by the **[Data Systems Lab](https://utndatasystems.github.io/)** at the **[University of Technology Nuremberg (UTN)](https://www.utn.de/)** that explores lightweight metadata and indexing techniques for accelerating expensive operators in analytical database systems.

The project studies data skipping for expensive database operations, among them joins and substring searches, at both the row and partition levels. By identifying data that cannot contribute to a query result, database systems can avoid unnecessary scans and expensive computation while preserving exact query results.

{% include figure.liquid loading="eager" path="assets/img/projects/ilike-parrots.png" class="mx-auto d-block col-3" %}

<p class="project-mascot-caption">“A parrot is much like an approximate membership structure for substrings: give it sentences, and every so often it gives you a few pieces back.”</p>

#### Collaborators

- [Ryan Marcus](https://rmarcus.info) — Assistant Professor of Computer Science, University of Pennsylvania
- [Johannes Thürauf](https://scholar.google.com/citations?user=kmz2AFoAAAAJ) — Professor for Discrete Optimization, UTN
- [Carl-David Reese](https://www.linkedin.com/in/carl-david-reese/) — Student Researcher

<div class="d-none">
  {% cite stoian2026mlskip stoian2025stringfingerprints stoian2025parachute zimmerer2025pruning %}
</div>
