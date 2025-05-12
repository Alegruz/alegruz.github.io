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

* Conferences
  * SIGGRAPH
  * SIGGRAPH Asia
  * Eurographics
  * Eurographics Symposium on Rendering
  * I3D
  * HPG
* Journals
  * ACM Transactions on Graphics
  * Computer Graphics Forum
  * Proceedings of the ACM on Computer Graphics and Interactive Techniques 

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
        * [ReSTIR PT with MCMC Decoupled Shading](https://dl.acm.org/doi/10.1145/3722564.3728381)
        * [Stochastic Lightcuts for Reflective Shadow Maps](https://dl.acm.org/doi/10.1145/3722564.3728375)
        * ReSTIR: Traveling the Path of Reuse
    * HPG
        * Hallucinating the Future of Real-Time Rendering
    * GDC
        * [Advanced Graphics Summit: Path Tracing Deep Dive: 'Indiana Jones and the Great Circle](https://schedule.gdconf.com/session/advanced-graphics-summit-path-tracing-deep-dive-indiana-jones-and-the-great-circle/910009)
        * [Advanced Graphics Summit: From Myth to Reality: Full Ray Tracing Inside 'Black Myth: Wukong'](https://schedule.gdconf.com/session/advanced-graphics-summit-from-myth-to-reality-full-ray-tracing-inside-black-myth-wukong/909932)
        * [Advanced Graphics Summit: GPU Work Graphs: Towards GPU-Driven Games](https://schedule.gdconf.com/session/advanced-graphics-summit-gpu-work-graphs-towards-gpu-driven-games/909736)
        * [Tencent Games Developer Summit: The Inline RayTracing Practice for Shadow and AO on Mobile](https://schedule.gdconf.com/session/tencent-games-developer-summit-the-inline-raytracing-practice-for-shadow-and-ao-on-mobile-presented-by-tencent-games/911678)
        * [Advanced Graphics Summit: Revolutionizing Texture Pipelines: EA's Journey with Texture Sets](https://schedule.gdconf.com/session/advanced-graphics-summit-revolutionizing-texture-pipelines-eas-journey-with-texture-sets/909461)
        * [Advanced Graphics Summit: 'Marvel Rivals': Creating a Real-Time Interactive Dr. Strange's Portal](https://schedule.gdconf.com/session/advanced-graphics-summit-marvel-rivals-creating-a-real-time-interactive-dr-stranges-portal/909448)
        * [Path Tracing Nanite in NVIDIA Zorah](https://www.nvidia.com/en-us/on-demand/session/gdc25-gdc1002/)
        * [Design and Rendering Strategies for Blockbuster VR Games - 'Batman: Arkham Shadow'](https://youtu.be/mz_SZe6i6WA?si=lBWJGX62lIFDRuyE)
        * [The Ultimate Guide to Optimize Vulkan & Ray Tracing Android Games](https://gdcvault.com/play/1035418/The-Ultimate-Guide-to-Optimize)
        * [Global Illumination in 'Once Human': A Hybrid Approach for 16km Open World](https://schedule.gdconf.com/session/global-illumination-in-once-human-a-hybrid-approach-for-16km-open-world/907269)
        * [The Magic Behind Ray-Traced Lighting in Star Wars Outlaws](https://youtu.be/HldfxfTYDoA?si=E2KD1oOYPXC0Vkt6)
        * [Scale Up Ray Tracing in Games With RTX Mega Geometry](https://youtu.be/KblmxDkaUfc?si=9EgSGs9Gw3S35_6D)
        * [DirectX State of the Union: Raytracing and PIX Workflows](https://youtu.be/CR-5FhfF5kQ?si=n1-HmXARdLa9wZUZ)
        * [Rendering 'Assassin's Creed Shadows'](https://schedule.gdconf.com/session/rendering-assassins-creed-shadows/907526)
        * [Glitter, Fur and Shadows: Character Rendering Technology of 'Sky: Children of the Light'](https://schedule.gdconf.com/session/glitter-fur-and-shadows-character-rendering-technology-of-sky-children-of-the-light/907475)
        * [Flex and Fun: Graphics Magic in 'ASTRO BOT'](https://schedule.gdconf.com/session/flex-and-fun-graphics-magic-in-astro-bot/910489)
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
        * [An Introduction to Creating Real-time Interactive Computer Graphics Applications](https://www.interactivecomputergraphics.com/SIGGRAPH/2024/)
        * Mathematical Optimization in Computer Graphics
        * [Introduction to Real-Time Ray Tracing](https://introtorealtimeraytracing.com/)
        * [Seamless Rendering on Mobile: The Magic of Adaptive LOD Pipeline](https://advances.realtimerendering.com/s2024/index.html#tencent)
        * [Flexible and Extensible Shader Authoring in Frostbite with Serac](https://advances.realtimerendering.com/s2024/index.html#serac)
        * [Variable Rate Shading with Visibility Buffer Rendering](https://advances.realtimerendering.com/s2024/index.html#hable)
        * [Shipping Dynamic Global Illumination in Frostbite](https://advances.realtimerendering.com/s2024/index.html#gibs2)
        * [Hemispherical Lighting Insights from the Call of Duty Production Lessons](https://advances.realtimerendering.com/s2024/index.html#roughton)
        * [Achieving scalable performances for large scale components with CBTs](https://advances.realtimerendering.com/s2024/index.html#cbt2)
        * [Moving Mobile Graphics](https://community.arm.com/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/moving-mobile-graphics)
    * SIGGRAPH Asia
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
        * A Visual Profiling System for Direct Volume Rendering
    * Eurographics Symposium on Rendering
        * [Robust Cone Step Mapping](https://diglib.eg.org/items/72110813-71ae-4cb3-b438-c9b0f7fc5b7f)
        * [Sobol Sampling: Faster, Neater, and Compact](https://youtu.be/ZubSTnxPFZc?si=OvgOLfoSF5illB_G)
        * [Residual Path Integrals for Re-rendering](https://arxiv.org/abs/2406.16302)
        * [ReSTIR FG: Real-Time Reservoir Resampled Photon Final Gathering](https://diglib.eg.org/items/df98f89d-a0ca-4800-9bc4-74528feaf872)
        * [Computing Manifold Next-Event Estimation without Derivatives](https://diglib.eg.org/items/7be3bf17-f5e0-42e1-abe5-660352a64b8b)
        * [Bridge Sampling for Connections via Multiple Scattering Events](https://cg.ivd.kit.edu/english/vertex-bridges.php)
        * [Real-Time Pixel-Perfect Hard Shadows with Leak Tracing](https://diglib.eg.org/items/d3b40fa5-bbd1-4cf1-8b4f-378e30c9d74f)
        * [Ray Traced Stochastic Depth Map for Ambient Occlusion](https://diglib.eg.org/items/f260354b-12b1-41f7-8fb3-7732e9bb489c)
    * I3D
        * [Bounded VNDF Sampling for the Smith–GGX BRDF](https://dl.acm.org/doi/10.1145/3651291)
        * [ZH3: Quadratic Zonal Harmonics](https://research.activision.com/publications/2024/05/ZH3_QUADRATIC_ZONAL_HARMONICS)
        * [Interactive Rendering of Caustics using Dimension Reduction for Manifold Next-Event Estimation](https://theses.hal.science/INRIA2/hal-04561024v1)
        * Improved G-buffer for Denoising Path Traced Rendering
        * [The Gates of Graphics: a deep dive into making your own Computer Graphics hardware](https://youtu.be/XycwTFPDZ6w?si=YuowundARX9Bgm8t)
        * [Triangle Visibility Buffer 2.0](https://youtu.be/kWLev9CoQdg?si=vQ9c2GfHx0oN7HXC)
    * HPG
        * [H-PLOC Hierarchical Parallel Locally-Ordered Clustering for Bounding Volume Hierarchy Construction](https://dl.acm.org/doi/10.1145/3675377)
        * [Concurrent Binary Trees for Large-Scale Game Components](https://arxiv.org/abs/2407.02215)
        * [SAH-Optimized k-DOP Hierarchies for Ray Tracing](https://dl.acm.org/doi/10.1145/3675391)
        * [Hybrid Voxel Formats for Efficient Ray Tracing](https://arxiv.org/abs/2410.14128)
        * [Optimizing Path Termination for Radiance Caching Through Explicit Variance Trading](https://cg.ivd.kit.edu/english/variance-trading.php)
        * [Photon-Driven Manifold Sampling](https://dl.acm.org/doi/10.1145/3675375)
        * [ReSTIR Subsurface Scattering for Real-Time Path Tracing](https://cg.ivd.kit.edu/english/restir-sss.php)
        * [Light Path Guided Culling for Hybrid Real-Time Path Tracing](https://dl.acm.org/doi/10.1145/3675387)
        * [Radiance Caching with On-Surface Caches for Real-Time Global Illumination](https://dl.acm.org/doi/10.1145/3675382)
        * [Real-Time Procedural Generation with GPU Work Graphs](https://dl.acm.org/doi/10.1145/3675376)
        * [Real-Time Decompression and Rasterization of Massive Point Clouds](https://rahul-goel.github.io/pcrhpg24/)
        * [Portable and Scalable 3D Rendering Using ANARI](https://www.highperformancegraphics.org/2024/program/index.html#hot3d2detail1)
    * GPC
        * [Harnessing Wave Intrinsics For Good (And Evil)](https://youtu.be/U6t33RLa0XM?si=0wZlq6UAg0nsYNN1)
        * [Realtime Global Illumination in Enshrouded](https://youtu.be/57F1ezwH7Mk?si=n_RQ0AVcVtd0nbeW)
        * [DirectX 12 Memory Management](https://youtu.be/aefKzUd6AQo?si=ka1qZ5oTj14s1C2v)
        * [Pondering Orbs: The Rendering and Art Tools of 'COCOON'](https://youtu.be/8kS17jt38XQ?si=aEiXcl0BOM0qU9px)
        * [Intro to GPU Occlusion](https://youtu.be/gCPgpvF1rUA?si=z2GWlndV6xDf4FA7)
        * [Gigi: A Platform for Rapid Graphics Development and Code Generation](https://youtu.be/MgCR-Kky628?si=BgUzhjaQ6c8gpskc)
        * [From Gates to Pixels: Making your own Graphics Hardware](https://youtu.be/SV-n2FzAHYI?si=TG2kKCQa1FYpe-AR)
        * [Boon or Curse: Custom Rendering Engine for Hades and Hades II](https://youtu.be/Vj9elQc0ix4?si=F_ohd_tPRVnWLdFp)
        * [Rendering Tiny Glades With Entirely Too Much Ray Marching](https://youtu.be/jusWW2pPnA0?si=MjTzWTzU5Zm0CDEz)
        * [Occupancy Explained Through the AMD RDNA™ Architecture](https://youtu.be/sHFb5Xfwl9M?si=KK0XLe50FeScQlWO)
    * GDC
        * [3D Toon Rendering in 'Hi-Fi RUSH'](https://youtu.be/gdBACyIOCtc?si=meNz_KG_BSxG1Zsl)
        * ADVANCED GRAPHICS SUMMIT: ALL YOU CAN ASK!
        * [Advanced Graphics Summit: DX12 Memory Management in Snowdrop on PC](https://gdcvault.com/play/1034334/Advanced-Graphics-Summit-DX12-Memory)
        * Advanced Graphics Summit: Generalized Decoupled Shading: Enhancing Rendering Efficiency and Quality
        * [Advanced Graphics Summit: GPU Work Graphics: Welcome to the Future of GPU Programming](https://youtu.be/QQP6-JF64DQ?si=tt-NZHQs5ptIt1GP)
        * [Advanced Graphics Summit: Making Connections: Real-Time Path-Traced Light Transport in Game Engines](https://youtu.be/lxRgmZTEBHM?si=d9vxCpJNj8CB3JiC)
        * [Advanced Graphics Summit: Raytracing in Snowdrop: An Optimized Lighting Pipeline for Consoles](https://gdcvault.com/play/1034763/Advanced-Graphics-Summit-Raytracing-in)
        * [Anatomy of a Frame in 'Cyberpunk 2077: Phantom Liberty'](https://gdcvault.com/play/1034333/Anatomy-of-a-Frame-in)
        * [Bringing Frostbite to New Rendering Tech and Platforms (While Nobody Noticed)](https://www.bilibili.com/video/BV14x4y1n7AY/)
        * [Bringing Maximum Reality to Vulkan Games](https://gdcvault.com/play/1034725/Bringing-Maximum-Reality-to-Vulkan)
        * [DirectX State of the Union Ft. Work Graphs and Introducing DirectSR](https://youtu.be/0S8qymwcHIc?si=Tgoby1pzXOgjPQiB)
        * [FP16 Shaders in Frostbite](https://gdcvault.com/play/1034306/FP16-Shaders-in)
        * [Maximizing Graphics Performance with Flexible Virtualized Geometry](https://gdcvault.com/play/1034621/Maximizing-Graphics-Performance-with-Flexible)
        * [Mecha BREAK's Virtual Geometry](https://gdcvault.com/play/1034911/Mecha-BREAK-s-Virtual-Geometry)
        * [Nanite GPU-Driven Materials](https://gdcvault.com/play/1034407/Nanite-GPU-Driven)
        * [Next Level of Mobile Graphics: Ray Tracing in 'Arena Breakout'](https://gdcvault.com/play/1034690/Next-Level-of-Mobile-Graphics)
        * [Open World Rendering Techniques in 'Hogwarts Legacy'](https://gdcvault.com/play/1034811/Open-World-Rendering-Techniques-in)
        * [Pondering Orbs: The Rendering and Art Tools of 'COCOON'](https://youtu.be/_xbGK_5wlfs?si=R4DitMw3h619cVKM)
        * [Ray Tracing in Snowdrop: Scene Representation and Custom BVH](https://gdcvault.com/play/1034404/Ray-Tracing-in-Snowdrop-Scene)
        * [UIPainter: Tile-Based UI Rendering In One Draw Call](https://www.guerrilla-games.com/read/uipainter-tile-based-ui-rendering-in-one-draw-call) [[Video]](https://youtu.be/U_MnhTuT_l8?si=DxwFk3QwLLSoGJl_)
    * ACM ToG
        * [Texture Size Reduction Through Symmetric Overlap and Texture Carving](https://dl.acm.org/doi/10.1145/3714408)
    * CGF
        * [Ray Tracing Animated Displaced Micro-Meshes](https://onlinelibrary.wiley.com/doi/10.1111/cgf.15225)
        * [Faster Ray Tracing through Hierarchy Cut Code](https://onlinelibrary.wiley.com/doi/10.1111/cgf.15226)
        * [Anisotropic Specular Image-Based Lighting Based on BRDF Major Axis Sampling](https://onlinelibrary.wiley.com/doi/10.1111/cgf.15233)
        * [Real-Time Polygonal Lighting of Iridescence Effect using Precomputed Monomial-Gaussians](https://onlinelibrary.wiley.com/doi/10.1111/cgf.14991)
        * [Real-Time Underwater Spectral Rendering](https://onlinelibrary.wiley.com/doi/10.1111/cgf.15009)
        * [Physically Based Real-Time Rendering of Atmospheres using Mie Theory](https://onlinelibrary.wiley.com/doi/10.1111/cgf.15010)
        * [Enhancing Spatiotemporal Resampling with a Novel MIS Weight](https://onlinelibrary.wiley.com/doi/10.1111/cgf.15049)
        * [State of the Art in Efficient Translucent Material Rendering with BSSRDF](https://onlinelibrary.wiley.com/doi/10.1111/cgf.14998)
* 2023
    * ACM CGaIT
        * [Efficient Spatial Resampling Using the PDF Similarity](https://dl.acm.org/doi/10.1145/3585501)
        * [Subspace Culling for Ray-Box Intersection](https://dl.acm.org/doi/10.1145/3585503)
        * [Importance-Based Ray Strategies for Dynamic Diffuse Global Illumination](https://dl.acm.org/doi/10.1145/3585500)
