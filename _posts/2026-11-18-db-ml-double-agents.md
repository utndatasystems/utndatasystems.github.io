---
layout: post
title: "From SIGMOD to NeurIPS: Are Database Researchers Switching Sides?"
date: 2026-11-18 09:17:00 +0100
description: Machine learning is becoming an increasingly important part of database research, but are we simply adopting ML techniques, or are we slowly becoming ML researchers ourselves? We take a look at publication trends across major ML conferences to see how the two communities are evolving and who might be taking over whom.
slug: db-ml-double-agents
toc:
  sidebar: right
author: '<a href="https://andi-zimmerer.com/">Andi Zimmerer</a>, <a href="https://www.linkedin.com/in/claudius-k%C3%BChn-609b3b418/">Claudius Kühn</a>'
---

## Introduction

Machine learning (ML) is everywhere these days, and database research is no exception. From learned query optimizers and indexes to automated database tuning, text-to-SQL interfaces, and ML-powered semantic query operators, ML has found its way into almost every corner of our field.

Unsurprisingly, this is also reflected in the research we publish. ML-related papers have become an increasingly common sight at major database venues such as SIGMOD and VLDB. But this raises a few interesting questions: Are we simply adding ML to our toolbox, or are we slowly becoming ML researchers ourselves? And as ML systems increasingly run into classic data management problems, who is actually moving into whose territory? Are databases becoming part of ML systems, or is ML itself becoming a database problem?

As database researchers, we naturally decided to approach these questions the way we know best: by looking at the data. We collected and analyzed publication statistics across major DB and ML venues, tracked how research topics and communities have evolved, and looked for patterns that might tell us where things are heading.

And the numbers tell an interesting story. ML is no longer just another technique that database researchers occasionally borrow. It is increasingly becoming a core part of our research toolbox, and we may still be in the middle of this transition. If current trends continue, it might not be long before finding a database researcher who has never worked with ML becomes the exception rather than the rule.

But perhaps even more interesting is what happens beyond traditional database venues. We observe that established DB researchers are increasingly publishing at major ML conferences, suggesting that the relationship between the two communities is becoming much more than a one-way exchange of ideas.

So, are we witnessing the gradual transformation of database researchers into ML researchers, or are the boundaries between the two fields simply disappearing? Let's see what the data have to say.

<div class="research-links">
  <a href="https://utndatasystems.github.io/db-ml-double-agents/">
    <img class="research-link-icon" src="{{ '/assets/img/posts/db-ml-favicon.svg' | relative_url }}" alt="" width="48" height="48">
    <span>
      <strong>Explore the interactive findings</strong>
      See the full results and take an in-depth look at our analysis.
    </span>
  </a>
  <a href="https://github.com/utndatasystems/db-ml-double-agents">
    <i class="research-link-icon fa-brands fa-github" aria-hidden="true"></i>
    <span>
      <strong>View the source code on GitHub</strong>
      Browse the code for crawling, cleaning, analysis, and the website.
    </span>
  </a>
</div>

## Methodology

In order to answer those questions, we first need to define who counts as an “established” database researcher. We settled on “people who served on the program committee (PC) of a major DB conference”. We therefore ingested committee rosters from the official websites of SIGMOD/PODS, VLDB, ICDE, EDBT, and CIDR between 2022 and 2025, matched the researchers to their DBLP profiles, and collected their publication histories. For DB publications, we considered full papers from major venues, including the journals PVLDB and PACMMOD, while excluding workshops, non-research contributions, and papers we couldn’t match to a venue. To enhance our entity resolution, we combined affiliation evidence from Crossref, institution matching via ROR, and publication-version evidence from arXiv. For more ambiguous cases, we employed agentic source verification and preserved the supporting evidence and data provenance behind reviewed decisions.

But then we noticed something interesting: some DB committee members already had surprisingly high ML publication shares, with up to around 40% of their recorded publications appearing at major ML venues (NeurIPS, ICML, and ICLR). With such a large share of their work appearing at ML venues, calling them established DB researchers just because they had served on a DB committee, potentially only once, seemed like a bit of a stretch. Clearly, our original PC-only approach wasn't going to cut it.

We therefore decided to set the bar higher and introduced a classification heuristic. Besides serving on a qualifying DB committee, researchers needed at least twice as many qualifying DB papers as main-conference ML papers. But that alone wasn't enough: they also needed to demonstrate an established research track record. For this, we accepted two alternatives: either at least five qualifying DB and ML papers across three distinct publication years, or at least two DB papers published in two different years combined with committee service in two different years. Applying these criteria left us with 907 senior DB researchers, i.e., people who review for major DB conferences and have a good track record of DB publications, and 71,948 distinct works in their publication histories (November 14, 2026).

The historical trends below follow this fixed cohort of 907 established DB researchers, selected using committee service from 2022–2025 and the publication records available at the time of analysis. We trace their publication histories backward rather than identify a separate cohort for each year. The curves therefore describe the history of this selected group, not the composition of the entire DB community in each year.

The figure below shows our selection and entity resolution process for established DB researchers.

{% include figure.liquid path="assets/img/posts/db-ml-cohort-selection.png" width="100%" zoomable=true alt="Flow diagram tracing database program committee rosters through name matching and publication criteria to the final cohort of 907 researchers." %}

## Results

Have you already published a full paper at a major ML conference? If so, you're certainly not alone. In fact, 28.2% of established DB researchers have already managed to sneak at least one paper into NeurIPS, ICML, or ICLR. That's quite a substantial fraction!

{% include figure.liquid path="assets/img/posts/db-ml-author-share.png" width="50%" alt="Share of DB researchers who already had at least one full paper accepted to an ML conference." %}

Some of these are familiar faces, but there are also more and more first-timers every year, as shown in the next plot. As a result, the total number of established DB researchers who have published at least once at a major ML venue has grown roughly exponentially. Have you already jumped on the bandwagon, or are you still a late adopter?

{% include figure.liquid path="assets/img/posts/db-ml-first-time-authors.png" width="50%" alt="The annual number of researchers publishing at NeurIPS, ICML, or ICLR for the first time rose to 57 in 2025." %}

One of the more interesting findings comes from looking at the share of accepted papers at major ML conferences that have at least one established DB researcher as a co-author. In 2025, around 1.4–1.5% of accepted full papers at major ML venues (depending on the conference) fell into this category.

What's interesting is that this share is still growing, even though the total number of accepted papers at these conferences has increased dramatically over the past few years. The figure below shows this trend, plotting the share of papers co-authored by established DB researchers at major ML venues, smoothed using sliding 5-year windows.

{% include figure.liquid path="assets/img/posts/db-ml-publication-share.png" width="50%" alt="Five-year trends show a growing share of NeurIPS, ICML, and ICLR papers co-authored by established database researchers." %}

Of course, we're still talking about rather small percentages. But if we naively extrapolate the trend, it looks like established DB researchers are slowly but steadily gaining ground at traditional ML venues. Are we eventually going to take over ML conferences? Can we be stopped?

We can also reverse the question: Which senior database researchers are most likely to publish at major ML venues? Interestingly, ICDE reviewers lead the way. Among researchers who have served as an ICDE reviewer at least once, 31.3% have also had at least one full paper accepted at a major ML conference. This is a somewhat surprising finding.

{% include figure.liquid path="assets/img/posts/db-ml-review-venue-breakdown.png" width="90%" alt="Breakdown of what share of DB reviewers already have published at ML conferences." %}

## Takeaway

So, are we switching sides? Our results show that publishing at major ML conferences has become an increasingly common part of the publication histories of the established DB researchers in our cohort. With 28.2% having published at least one full paper at NeurIPS, ICML, or ICLR, this participation extends well beyond a handful of familiar names. Conference participation alone does not tell us whether researchers are changing their research identity or bringing database questions to a broader audience. But it does suggest that, for a growing part of this cohort, the conversation increasingly spans both communities. Perhaps the next step is to look at what they publish there. Are the supposed traitors actually ambassadors?
