---
layout: post
title:  ReSTIR Study Notes
date:   2025-04-22 20:49:00 +0900
categories: graphics
lang: "en"
---

ReSTIR was the theme for my graduation project. I wanted to understand the state-of-the-art real-time/interactive global illumination technique, but I have failed to do so. This is largely due to the lack of background knowledges. Now, I am starting again to study ReSTIR, but this time properly, to the level where I can try to come up with my own research ideas.

Before I start the journey, I have aggregated notable ReSTIR papers and articles I could find:

* [Spatiotemporal reservoir resampling for real-time ray tracing with dynamic direct lighting](https://cs.dartmouth.edu/~wjarosz/publications/bitterli20spatiotemporal.html). The first ever paper that invented ReSTIR.
* [Reframing Light Transport for Real-Time](https://www.highperformancegraphics.org/2020/program/#reframing_light_transport_for_realtime)
* [RTXDI: Details on Achieving Real-Time Performance](https://www.nvidia.com/en-us/on-demand/session/gtcspring21-s32639/)
* [ReSTIR GI: Path Resampling for Real-Time Path Tracing](https://research.nvidia.com/publication/2021-06_restir-gi-path-resampling-real-time-path-tracing)
* [Rearchitecting Spatiotemporal Resampling for Production](https://research.nvidia.com/publication/2021-07_rearchitecting-spatiotemporal-resampling-production)
* [World-Space Spatiotemporal Reservoir Reuse for Ray-traced Global Illumination](https://gpuopen.com/download/publications/SA2021_WorldSpace_ReSTIR.pdf)
* [Fast Volume Rendering with Spatiotemporal Reservoir Resampling](https://dqlin.xyz/pubs/2021-sa-VOR/)
* [How to add thousands of lights to your renderer and not die in the process](http://www.zyanidelab.com/how-to-add-thousands-of-lights-to-your-renderer/)
* [Spatiotemporal Reservoir Resampling (ReSTIR) - Theory and Basic Implementation](https://gamehacker1999.github.io/posts/restir/)
* [Conditional Resampled Importance Sampling and ReSTIR](https://research.nvidia.com/labs/rtr/publication/kettunen2023conditional/)
* [A Gentle Introduction to ReSTIR Path Reuse in Real-Time](https://intro-to-restir.cwyman.org/)
* [A gentler introduction to ReSTIR](https://interplayoflight.wordpress.com/2023/12/17/a-gentler-introduction-to-restir/)
* [Area ReSTIR: Resampling for Real-Time Defocus and Antialiasing](https://graphics.cs.utah.edu/research/projects/area-restir/)
* [Efficient Visibility Reuse for Real-time ReSTIR](https://dl.acm.org/doi/10.1145/3641233.3664320)
* [Generalized Resampled Importance Sampling (GRIS)](https://graphics.cs.utah.edu/research/projects/gris/)

This is the order I will read these:

1. [A gentler introduction to ReSTIR](https://interplayoflight.wordpress.com/2023/12/17/a-gentler-introduction-to-restir/)
1. [Spatiotemporal reservoir resampling for real-time ray tracing with dynamic direct lighting](https://cs.dartmouth.edu/~wjarosz/publications/bitterli20spatiotemporal.html)
1. [A Gentle Introduction to ReSTIR Path Reuse in Real-Time](https://intro-to-restir.cwyman.org/)
1. [How to add thousands of lights to your renderer and not die in the process](http://www.zyanidelab.com/how-to-add-thousands-of-lights-to-your-renderer/)
1. [Spatiotemporal Reservoir Resampling (ReSTIR) - Theory and Basic Implementation](https://gamehacker1999.github.io/posts/restir/)
1. [Reframing Light Transport for Real-Time](https://www.highperformancegraphics.org/2020/program/#reframing_light_transport_for_realtime)
1. [RTXDI: Details on Achieving Real-Time Performance](https://www.nvidia.com/en-us/on-demand/session/gtcspring21-s32639/)
1. [Rearchitecting Spatiotemporal Resampling for Production](https://research.nvidia.com/publication/2021-07_rearchitecting-spatiotemporal-resampling-production)
1. [ReSTIR GI: Path Resampling for Real-Time Path Tracing](https://research.nvidia.com/publication/2021-06_restir-gi-path-resampling-real-time-path-tracing)
1. [Conditional Resampled Importance Sampling and ReSTIR](https://research.nvidia.com/labs/rtr/publication/kettunen2023conditional/)
1. [Fast Volume Rendering with Spatiotemporal Reservoir Resampling](https://dqlin.xyz/pubs/2021-sa-VOR/)
1. [Generalized Resampled Importance Sampling (GRIS)](https://graphics.cs.utah.edu/research/projects/gris/)
1. [World-Space Spatiotemporal Reservoir Reuse for Ray-traced Global Illumination](https://gpuopen.com/download/publications/SA2021_WorldSpace_ReSTIR.pdf)
1. [Area ReSTIR: Resampling for Real-Time Defocus and Antialiasing](https://graphics.cs.utah.edu/research/projects/area-restir/)
1. [Efficient Visibility Reuse for Real-time ReSTIR](https://dl.acm.org/doi/10.1145/3641233.3664320)

During studying each materials, I will be diving into concepts that I don't fully understand.

## Concepts to Study

1. BRDF
1. Reprojection
1. Rejection

## Other Papers on Real-Time Rendering

* 2025
    * Eurographics
        * [Linearly Transformed Spherical Distributions for Interactive Single Scattering with Area Lights](https://onlinelibrary.wiley.com/doi/10.1111/cgf.70049?af=R)
        * [Adaptive Multi-view Radiance Caching for Heterogeneous Participating Media](https://onlinelibrary.wiley.com/doi/10.1111/cgf.70051?af=R)
        * [Many-Light Rendering Using ReSTIR-Sampled Shadow Maps](https://onlinelibrary.wiley.com/doi/10.1111/cgf.70059?af=R)
        * [Neural Two-Level Monte Carlo Real-Time Rendering](https://arxiv.org/abs/2412.04634)
        * [Real-time Procedural Resurfacing Using GPU Mesh Shader](https://onlinelibrary.wiley.com/doi/10.1111/cgf.70075?af=R)
        * [Dynamic Voxel-Based Global Illumination](https://onlinelibrary.wiley.com/doi/10.1111/cgf.15262)
        * [SOBB: Skewed Oriented Bounding Boxes for Ray Tracing](https://onlinelibrary.wiley.com/doi/10.1111/cgf.70062?af=R)
        * [Axis-Normalized Ray-Box Intersection](https://graphics.tu-bs.de/publications/friederichs2025axis-normalized)
        * [FastAtlas: Real-Time Compact Atlases for Texture Space Shading](https://arxiv.org/abs/2502.17712)
    * I3D
        * [Real-Time Markov Chain Path Guiding for Global Illumination and Single Scattering](https://www.lalber.org/2025/04/markov-chain-path-guiding/)
        * [A Stack-Free Traversal Algorithm for Left-Balanced k-d Trees](https://arxiv.org/abs/2210.12859)
    * CGF
        * [Efficient Environment Map Rendering Based on Decomposition](https://onlinelibrary.wiley.com/doi/10.1111/cgf.15264)
* 2024
    * SIGGRAPH
        * [Real-Time Path Guiding Using Bounding Voxel Sampling](https://dl.acm.org/doi/10.1145/3658203)
        * [Area ReSTIR: Resampling for Real-Time Defocus and Antialiasing](https://graphics.cs.utah.edu/research/projects/area-restir/)
        * [Ray Tracing Harmonic Functions](https://markjgillespie.com/Research/harnack-tracing/index.html)
        * [Real-time Physically Guided Hair Interpolation](https://kuiwuchn.github.io/hairInterp.html)
        * [Real-time Hair Rendering With Hair Meshes](https://dl.acm.org/doi/10.1145/3641519.3657521)
        * [Modeling Hair Strands With Roving Capsules](https://research.nvidia.com/publication/2024-07_modeling-hair-strands-roving-capsules)
        * [Real-time Neural Woven Fabric Rendering](https://arxiv.org/abs/2406.17782)
        * [Proxy Tracing: Unbiased Reciprocal Estimation for Optimized Sampling in BDPT](https://arxiv.org/abs/2503.23412)
        * [Decorrelating ReSTIR Samplers via MCMC Mutations](https://arxiv.org/abs/2211.00166)
        * [Quad-optimized Low-discrepancy Sequences](https://dl.acm.org/doi/10.1145/3641519.3657431)
        * [Specular Polynomials](https://arxiv.org/abs/2405.13409)
        * [MARS: Multi-sample Allocation through Russian roulette and Splitting](https://arxiv.org/abs/2410.20429)
        * [Volume Scattering Probability Guiding](https://kehanxuuu.github.io/vspg-website/)
        * [Efficient Image-Space Shape Splatting for Monte Carlo Rendering](https://uwspace.uwaterloo.ca/items/693b8789-cdc9-442e-9c3c-de58ffa8227f)
        * [Hierarchical Light Sampling with Accurate Spherical Gaussian Lighting](https://dl.acm.org/doi/10.1145/3680528.3687647)
        * [A Generalized Ray Formulation For Wave-Optical Light Transport](https://arxiv.org/abs/2303.15762)
        * [Appearance-Preserving Scene Aggregation for Level-of-Detail Rendering](https://mangosister.github.io/scene_agn_site/)
    * Eurographics
        * [Real-time Polygonal Lighting of Iridescence Effect using Precomputed  Monomial-Gaussians](https://onlinelibrary.wiley.com/doi/abs/10.1111/cgf.14991)
        * [Real-time Seamless Object Space Shading](https://diglib.eg.org/items/538ea8c6-183c-4c07-bf4c-73dd852a411a)
        * [A Highly Adaptable and Flexible Rendering Engine by Minimum API Bindings](https://ksp.etri.re.kr/ksp/article/read?id=69224)
    * Eurographics Symposium on Rendering
        * [Robust Cone Step Mapping](https://diglib.eg.org/items/72110813-71ae-4cb3-b438-c9b0f7fc5b7f)
        * [Sobol Sampling: Faster, Neater, and Compact](https://youtu.be/ZubSTnxPFZc?si=OvgOLfoSF5illB_G)
        * [Residual Path Integrals for Re-rendering](https://arxiv.org/abs/2406.16302)
        * [ReSTIR FG: Real-Time Reservoir Resampled Photon Final Gathering](https://diglib.eg.org/items/df98f89d-a0ca-4800-9bc4-74528feaf872)
        * [Computing Manifold Next-Event Estimation without Derivatives](https://diglib.eg.org/items/7be3bf17-f5e0-42e1-abe5-660352a64b8b)
        * [Bridge Sampling for Connections via Multiple Scattering Events](https://cg.ivd.kit.edu/english/vertex-bridges.php)
        * [Real-Time Pixel-Perfect Hard Shadows with Leak Tracing](https://diglib.eg.org/items/d3b40fa5-bbd1-4cf1-8b4f-378e30c9d74f)
        * [Ray Traced Stochastic Depth Map for Ambient Occlusion](https://diglib.eg.org/items/f260354b-12b1-41f7-8fb3-7732e9bb489c)