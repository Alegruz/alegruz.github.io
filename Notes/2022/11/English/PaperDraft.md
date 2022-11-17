# World-Space Clustered GRIS (2022.11.17)
[Home](/README.md)

# 1. Introduction

One of the main goal of computer graphics is to render a photorealistic virtual world in consumer-level hardwares. Monte carlo path tracing is widely used in modern offline renderers due to its generality and flexibity. With the advent of hardware-accelerated ray tracing, real-time path tracing was made feasible however with strict per-pixel ray budget. Although real-time denoising algorithms(e.g. SVGF) alleviates the low-sampled image to increase the image quality, denoisers perform well with higher quality samples. This makes importance sampling particularly vital in order to sample the most meaningful samples to generate photorealistic imagery.

Virtual scenes especially in games often contains dynamic geometry, light sources which results in complex integrand for Monte carlo path tracing. Recent studies in resampled importance sampling (RIS) and weighted reservoir sampling (WRS) to perform spatiotemporal RIS (ReSTIR) showed its effectiveness and efficiency on real-time monte carlo path tracing.

[Bitterli et al. 2020] interactively sampled direct illumination on many lights situation, which [Wyman et al. 2021] later optimized and productized. [Ouyang et al. 2021]'s ReSTIR extension ReSTIR GI samples path vertices to interactively render global illumination using ReSTIR. [Lin et al. 2021] generalized RIS and ReSTIR to apply ReSTIR on participating media. [Lin and Kettunen et al. 2022] introduced generalized RIS (GRIS), a theoretical foundation of resampled importance sampling on Monte carlo path tracing by providing convergence conditions.

However successful ReSTIR or GRIS were, these methods guarantees interactive framerates rather than real-time frame rates. Because ReSTIR too successful at keeping important samples spatiotemporally, duplicate candidate samples exists in various reservoirs. In order to address this issue, this paper introduces world-space clustered GRIS where path vertices samples are stored in spatial clusters serving as reservoirs and spatial hash used to link each pixel to the cluster. Cluster data structure provides consistent access to samples with higher importance in the neighborhood.

# 2. Related Work

