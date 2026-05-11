---
layout: post
title: Text Compression Through the Looking Glass
date: 2026-05-11
description: Cold and unstructured text has long been a storage burden, driving costs for data that is unlikely to ever be accessed again. The rise of accessible large language models (LLMs) has intensified this challenge by dramatically increasing the volume of generated content that still needs to be retained, e.g. for compliance reasons. This post explores a new class of LLM-based compression methods that can significantly reduce the storage footprint of text-heavy data, and explains why LLMs are particularly well-suited to text compression.
related_publications: true
og_image: assets/img/posts/text-compression-coding-pipeline.png
toc:
  sidebar: right

author: "<a href=\"https://www.linkedin.com/in/luisa-neubauer/\">Luisa Neubauer</a>"
---


Data generation feels cheap nowadays. Every prompt that we send to a large language model, every auto-generated email, every chat history with an AI, every machine-generated web article quietly piles onto a heap of artificially generated text. In many cases, if we like it or not, we are required to store this data — be it for compliance, auditing, reproducibility reasons, or simply because we want to retrieve a chat history from three years ago. 

While generation feels cheap, storing this growing body of data is not. Like digital hoarders, we hold onto our data and want to store it indefinitely, ideally at no cost. At scale, however, this quickly becomes prohibitively expensive.

But there is a catch: most of this data will never be read in its lifetime, it just has to sit there for e.g. compliance reasons. According to the _IDC Worldwide Global Storage Sphere Forecast_, a large fraction of enterprise data (estimates suggest on the order of 60%) is already "cold" at the moment of creation. To add insult to injury, 80-90% of this business data is un-structured in nature, most of it documents, logs, chats, and other text-heavy formats, which unlike structured data lacks inherent organization. It therefore does not benefit from schema-aware storage. 

In other words, the world is generating increasingly vast amounts of string-like data, which it will never access again in its lifetime. At scale, the storage of this data indefinitely into the future becomes prohibitively and unnecessarily expensive.

This raises one central question: how do we store all this cold, unstructured  data as efficiently as possible?

Today, we visit the topic of data compression — specifically compressing strings. Besides the myriad of deterministic, hardcoded string compression schemes, there is a new kid on the block — we can now compress using LLMs!

To cut to the chase: it turns out that the models that are best at producing this content are also, by mathematical principles, the same ones that are best at compressing it. Thanks to the paper "Language Modeling Is Compression" [(Delétang et al., 2024)](https://proceedings.iclr.cc/paper_files/paper/2024/file/3cbf627fa24fb6cb576e04e689b9428b-Paper-Conference.pdf), we know that this isn’t a convenient coincidence but a fundamental equivalence. In fact, compression and next-token prediction are two sides of the same coin.

In this blog post, we explore how and why.


## What is Compression? 

At its core, compression is all about exploiting patterns. Put differently, compression is possible because the world is not random. Wherever we look, there are patterns. Language in particular brims with structure. There are grammar rules, word stems, and idioms. If language were completely random, it would be highly incompressible. 

Patterns bring predictability and this is where LLMs come into play. LLMs are excellent prediction machines for language. Give an LLM an incomplete sentence, and it will produce a very plausible continuation of said sentence.


<p class="text-center font-italic">
The more predictable something is, the easier it is to compress.
</p>

The idea of predictability is formalized as the concept of "entropy" in mathematics, which we will revisit later in this post. 


## An Example From Written English

Consider English as one such example of text to compressed code. Each letter in the Roman alphabet occurs with a certain probably in a large enough sample. 

A naive way to encode letters would be to assign each one a fixed-length code. 

- "a" → `00000`
- "b" → `00001`
- …
- "z" → `11001`

This works — but it’s inefficient. It treats all letters as equally likely, but they aren’t in reality. There is an average probability for each letter to occur. 

So let’s not stop here! We have a better idea: exploiting our knowledge about probabilities, we come up with a smarter code — one that assigns the shortest symbols to the most common letters and longer ones to the rarest letters. Huffman coding [(Huffman, 1952)](https://ieeexplore.ieee.org/document/4051119) formalizes this idea: a classic algorithm that, given a distribution over letters, provides a prefix-free encoding that minimizes the average number of bits per character — essentially squeezing out redundancy wherever the language allows it.

For our example, we propose a new code in which: 
 - "e" (the most frequent letter) might be encoded as `0`
 - "t" as `10`
 - "z" (the rarest letter) as `111010`


{% include figure.liquid loading="eager" path="assets/img/posts/text-compression-letter-frequencies-english.png" class="img-fluid rounded d-block mx-auto my-5" width="80%" %}

The key takeaway here is that a good compression scheme assigns _short codes_ to frequent symbols and _longer codes_ to rare ones — exploiting the information about patterns at our disposal. Over large amounts of text, this method will reduce the number of bits needed to store it (mind that we have to guarantee that _no code is the prefix of another code_<sup><a href="#footnote1">1</a></sup>).

There are other compression algorithms around who take this idea of exploiting repetition one step further by handling larger units of text than letters: 

FSST (Fast Static Symbol Table compression) [(Boncz et al., 2020)](https://www.vldb.org/pvldb/vol13/p2649-boncz.pdf) is one such popular string compression algorithm. FSST builds a dictionary of 255 frequently occurring substrings and assigns these substrings shorter codes. With FSST, the parts of input text that are not in the dictionary are escaped as the original input string / bytes. 

Another prominent example is [Snappy](https://github.com/google/snappy) (developed by Google). It finds repeated sequences within the data and replaces later occurrences of said sequences with references to the earlier one. In this way, repetition is exploited directly through a simple reference to a location earlier in the data. This is advantageous because it comes at a much lower cost than writing it out again. 


## From Letters to Language Models

We see how our rudimentary "letter-dictionary" could help us rewrite a message using fewer bits, how Snappy replaces data with references to data, how FSST comes up with clever chunks of data that it replaces with shorter code — all to the end of reducing code length. 

Now let’s extend these ideas to highly complex patterns, ones that go beyond mere repetition. Instead of focusing on repetitions of the individual letters or substring combinations, we would like to progress to using more complex, information-rich, harder-to-guess patterns, such as those between words and entire sentences. That even includes semantic relationships! 

Lucky us, we nowadays, have excellent language modelling machines (large language models), that do precisely that. Rather than predicting single characters, they think in 'tokens' (word, subwords, …) and predict the next token, word, or even an entire phrase with an almost eerie sense of accuracy — given a sufficiently long context (a "window" of past words in a sentence that the models sees) that is. A model will have an easy time inferring the end of these phrases. In fact, they are trivially easy for a language model. 

 - "peanut butter and …" → almost always "jelly"
 - "once upon a …" → "time"

The neat thing is that as language models improve at modeling human language, they also become better at compression. We can drop our knowledge about how often the letter "y" appears in the English language and — lazy researchers that we are — we outsource this task to a model trained on the task. 

{% include figure.liquid loading="eager" path="assets/img/posts/text-compression-coding-pipeline.png" class="img-fluid rounded d-block mx-auto my-5" width="80%" %}


The recipe for how it all plays together, is as follows:

 1. The language model predicts a probability distribution over the next token: for every token in the model’s vocabulary — broken pieces of text that the model "knows" — it tells us how likely it is that this token will appear next. This process is autoregressive over the tokens: every prediction depends on all previous tokens in the context. 
 2. We encode the next actual token using an entropy coding method (e.g., arithmetic coding). This is the process of assigning "code" to "symbols" based on probabilities (remember the example of letters in the English language for before). For the sake of brevity, we will treat entropy coding as a black box in the context of this post. Tokens with high probability require fewer bits to encode, whereas tokens with low probability require more bits.

We investigated how well this works in practice: on a standard text dataset like text8, which is an extract from Wikipedia, we can compress 100 MB down to 49.11 MB using the aforementioned FSST, to 35.05 MB using zstd, another widespread compression algorithm, and to just 12.10 MB using an LLM-compressor (based on the Qwen2 0.5B model with arithmetic coding)! 


## Shannon’s Comeback and the Optimal Compression Ratio — Mathematical Deep Dive 

We have seen that an LLM<sup><a href="#footnote2">2</a></sup> works by assigning probabilities to the next token in a sequence. Given a sequence of text, the model assigns probabilities to every possible continuation within its vocabulary. For example:

_"The capital of France is …"_

An LLM might reason that the possible answers are, in order of likelihood: 

 - "Paris" → 95%
 - "Lyon" → 3%
 - others → 2%

When the model is confident, we can encode the plausible next token using very few bits using entropy coding methods like arithmetic coding. These coding schemes translate probabilities into a compact binary code — and they do this almost with mathematical optimality. (Which can be proven.)

In 1948 Claude Shannon, the father of information theory, provided us with a mathematical law of nature from which flows/derives that the optimal compression ratio of any data source is determined by its **entropy $H(q,X)$ — the average certainty of the next symbol**: 

$$H(p,X)=\sum_{x\in X}p(x)\log_2p(x)$$

In other words, entropy is a measure of surprise. The lower the entropy, the better the ability to compress. 

In practice, the precise distribution $p(x)$ with which a data source emits text eludes us most of the time. Instead, we work with an approximate $q(x)$ of said distortion that we learn using a model and measure its performance via the so-called cross-entropy $H(p,q,X)$, a measure of how well our model predicts the real data $q(x)$ (a sample of the true data source). 

$$H(p,q,X) = \sum_{x\in X}p(x)\log_2q(x) = H(p,X)+D_{KL}(p|q)$$

The gap $D_{KL}(p\|q)$ between $q(x)$ and $p(x)$ is where inefficiency originates and where extra bits creep into the compressed code. 

<p class="text-center font-italic">
The better a model’s predictions, the better the compression, the fewer bits needed.
</p>

Putting it all together: the secret behind LLM-based compression is almost of tautological nature: we discovered that using the same probability distribution that was used for generation is also the optimal one for encoding. The closer these two are, the closer we approach towards Shannons’ theoretical lower limit given by the data entropy. Therefore, for LLM-generated text, the most apt model for compression is the one that created the text in the first place because their probability estimates given the same context align perfectly with the data. 

In conclusion, advancements in language modelling, like scaling laws, improved architectures, larger-context windows, are therefore not just improvements for the sake of realistic language or fluency of LLMs but improvements for the twin objective of compression as well! 


## Research Roadmap

Recent work including our own research at UTN’s Data Systems Lab, shows that there is great potential for LLM-based compressors as these outperform most classical text compression schemes in terms of compression ratios. However, they are not economically viable yet {% cite kipf2025llmcompress %} due to the significant computational costs involved. We speculate that the efficiency of future language models is set to increase still, reducing compute cost in the long run. 

Our current research focuses on three key directions to make LLM-based compression workable in production environments by addressing: 

 1. ***Improving compression ratio by adapting to the dataset***  
    Providing custom adapters or specialized models tailored to your dataset will further improve compression ratios. 

 2. ***Reducing cost of model inference by effective downsizing***  
    Using SOTA _PEFT_ (parameter-efficient fine tuning) methods such as LoRa, VeRa, _quantization_ techniques, or _early-exit networks_ (using only part of a model for prediction) to downsize the models.

 3. ***Increasing robustness by bullet-proofing against model loss***  
    And finally, what happens if we lose the original model that the data was compressed with? Can we use a substitute model to reconstruct the code?

Stay tuned…

----

<ol>
    <li id="footnote1"><a href="https://en.wikipedia.org/wiki/Prefix_code">https://en.wikipedia.org/wiki/Prefix_code</a></li>
    <li id="footnote2">most LLMs — to be extra precise, those that are causal language models.</li>
</ol>
