---
# Sources: PLAN.md §3.4B, Q3; resume (5 Nov 2026): STFT and the three NMF
# variants were implemented from scratch in C++. Results, data provenance and
# links are still open (O4).
title: Dechorder
slug: dechorder
summary: >-
  My B.Sc. thesis: splitting a mixed music recording back into its parts,
  tuned to the sound of African music, using mathematics (matrix
  factorisation) instead of a black-box model.
visibility: public
status: completed
threads: [research, creation]
featured: true
order: 2
updated: 2026-11-05
affiliation: University of Lagos
stack: [C++20, Linear algebra, Digital signal processing]
publications:
  - title: Dechorder
    kind: thesis
    venue: B.Sc. thesis, University of Lagos
    date: "2026"
    visibility: public
---
## The problem

A recording of a song is a mixture: the voices and instruments are added together into one signal. **Source separation** tries to undo that, recovering the individual parts from the mixture. My thesis studied it for African music.

## Why it's interesting

It sits exactly where mathematics, signal processing and music meet. Instead of a black-box model, it uses matrix factorisation, so every step can be understood and inspected. African music brings its own instrumentation, rhythmic patterns and recording characteristics, which may pose different challenges from the music separation methods are usually tested on.

## The mathematics

**From sound to a spectrogram.** The Short-Time Fourier Transform (STFT) cuts a recording into short, overlapping frames and measures which frequencies are present in each. Taking the magnitude gives a spectrogram: a matrix $V$ of frequencies against time, in which every entry is zero or positive.

**Non-negative Matrix Factorisation (NMF)** approximates that matrix as a product of two smaller non-negative matrices:

$$
V \approx WH, \qquad W \geq 0,\ H \geq 0
$$

Each column of $W$ is a spectral template (roughly, what one sound looks like across frequencies), and each row of $H$ says how strongly that template is active over time.

**Why non-negativity matters.** Because nothing can be negative, components can only add up, never cancel out. That matches, approximately, how sounds combine in a magnitude spectrogram, and it makes the components easier to interpret as parts of the music.

**Measuring the fit.** NMF chooses $W$ and $H$ to minimise a divergence between $V$ and $WH$, entry by entry. I compared three:

$$
\begin{aligned}
d_{\text{Euc}}(x \mid y) &= \tfrac{1}{2}(x - y)^2 \\
d_{\text{KL}}(x \mid y) &= x \log\frac{x}{y} - x + y \\
d_{\text{IS}}(x \mid y) &= \frac{x}{y} - \log\frac{x}{y} - 1
\end{aligned}
$$

The Euclidean distance is dominated by the loudest parts of the spectrogram. The Itakura–Saito (IS) divergence depends only on the ratio $x/y$, so quiet and loud parts count equally. The Kullback–Leibler (KL) divergence sits in between.

**Back to audio.** To hear a separated part, its spectrogram estimate has to be turned back into a waveform with the inverse STFT. Typically the estimate is applied as a mask to the mixture's spectrogram, so that the original phase can be reused.

## Approach

I used NMF-based source separation and compared the Euclidean, KL and IS divergences, testing on Afrobeat material and on the MUSDB18 benchmark.

## Implementation

I wrote Dechorder in C++20 and implemented the signal processing from scratch, including the Short-Time Fourier Transform and all three NMF variants (Euclidean, Kullback–Leibler and Itakura–Saito). The tool separates individual instruments from mixed recordings.

## Results and findings

I completed and defended the thesis in 2026. I have not published its results here yet.

## Future directions

- **Music recommendation** built on the separated components.
- Further optimisation for traditional African instrumentation and recording conditions.

Music is a big part of my life outside research too: see [About](/about#music).
