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
1. [A Gentle Introduction to ReSTIR Path Reuse in Real-Time](https://intro-to-restir.cwyman.org/)
1. [How to add thousands of lights to your renderer and not die in the process](http://www.zyanidelab.com/how-to-add-thousands-of-lights-to-your-renderer/)
1. [Spatiotemporal Reservoir Resampling (ReSTIR) - Theory and Basic Implementation](https://gamehacker1999.github.io/posts/restir/)
1. [Spatiotemporal reservoir resampling for real-time ray tracing with dynamic direct lighting](https://cs.dartmouth.edu/~wjarosz/publications/bitterli20spatiotemporal.html)
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