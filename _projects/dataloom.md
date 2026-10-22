---
layout: page
title: Dataloom
description: Using the Power of AI to Democratize Data Science through Agentic Data Pipelines.
img: assets/img/projects/dataloom2.png
importance: 1
category: work
related_publications: true
related_publications_title: Publications
related_publications_heading_level: 4
related_publications_group_by: none
published: true
---

**Project Lead:** [Alexander van Renen](https://dblp.org/pid/219/9679.html)

#### Description

**Dataloom** is a research project by the **[Data Systems Lab](https://utndatasystems.github.io/)** at the **[University of Technology Nuremberg (UTN)](https://www.utn.de/)** that explores how large language models (LLMs) and database technology can be combined to make **data preparation and analysis accessible to everyone**. Our goal is to enable users to turn messy, heterogeneous data into meaningful insights without requiring extensive programming or data engineering expertise.

By combining the flexible reasoning capabilities of LLMs with the efficiency and reliability of traditional data systems, **Dataloom** orchestrates agentic data pipelines for discovering, cleaning, transforming, loading, and analyzing data. LLMs handle ambiguous, "soft" tasks, while established database techniques are used whenever deterministic and efficient processing is possible.

**Dataloom** provides a transparent and interactive environment in which users can inspect, refine, and re-execute every step of their data pipeline, minimizing the time from raw data to actionable insights.

#### Collaborators

- [Luca Heller](https://www.linkedin.com/in/luca-sophia-heller-b8909b250/)
- [Macallyster Edmondson](https://www.linkedin.com/in/macallyster-edmondson-094049334/)

#### Code

{% include repository/repo.liquid repository='utndatasystems/data-loom-vldb-demo' %}

<div class="d-none">
  {% cite vanrenen2024dataloom vanrenen2026csvprepllms %}
</div>
