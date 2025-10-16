---
layout: page
title: Spectra
description: Taking LLM-Based Semantic SQL Operators to the Limit With Our Own Multi-Modal Data Engine
img: assets/img/projects/spectra3.png
importance: 3
category: work
related_publications: true
---


**Spectra** is a research project by the [Data Systems Group](https://utndatasystems.github.io/) at the [University of Technology Nuremberg (UTN)](https://www.utn.de/) that explores how multi-modal large language models (LLMs) can be utilized for flexible query processing inside traditional database systems as **semantic operators**.
Our goal is to push the limits of these semantic operators - making them **faster**, more **robust**, **cost-efficient**, and **scalable**, while preserving **result accuracy guarantees**.

By integrating the powerful and flexible data processing capabilities of multi-modal LLMs into query pipelines, **Spectra** enables entirely new ways of interacting with data and generating insights in analytical query processing.

**Spectra** is implemented as a DuckDB extension and enriches DuckDB's declarative SQL interface with additional semantic operators.

{% include repository/repo.liquid repository='utndatasystems/spectra-duckdb-extension' %}
