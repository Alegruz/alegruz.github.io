---
layout: post
title:  Implementing ReSTIR and ReSTIR-GI on D3D12
date:   2025-11-06 00:13:00 +0900
categories: graphics
lang: "en"
---

# Introduction

My computer graphics journey started in the winter of 2022. I was a junior in university. At first, I wanted to study procedural content generation techniques and their real-time usage in games. However, as I delved deeper into the subject, I found out that such field had no significant research going on, and was far from what I really wanted to do, which was creating an immersive world. Thus, I shifted my focus to real-time rendering techniques. I started with learning Direct3D 11 and the legendary book, "Real-Time Rendering". After finishing the book, I implemented a Direct3D 11 based renderer as a side project, which I used as the lab project for my Game Graphics Programming course. This naturally led me to do a research project on implementing ReSTIR GI as my capstone design project, and my graduation project. Due to lack of concrete background on the subject and technological stack, I struggled a lot, but I managed to create a basic implementation of ReSTIR GI using Falcor.

Since then, implementing ReSTIR and ReSTIR GI has been my main goal in computer graphics. First thing I did was to study the basics of ReSTIR and ReSTIR GI. I studied the physics of light transport, Monte Carlo integration, and many other fundamental topics. I also read the original papers multiple times to fully understand the concepts. After that, I started to implement ReSTIR and ReSTIR GI on Direct3D 12, which is the main graphics API used in the industry. This was a challenging task, as there were no existing resources or tutorials on how to implement these techniques on D3D12. However, I persevered and managed to create a basic implementation of ReSTIR and ReSTIR GI on D3D12.

# Overview

I am not a genius who can understand a concept in one go. The best method for me to understand a complex concept is start from the bottom, and carefully build up my knowledge step by step. Thus, I started with implementing basic CPU renderer starting with a simple rasterization, with the Cornell box as the demo scene. But because the goal was to implement ReSTIR, I quickly moved on to implementing a basic path tracer. After finishing the path tracer, I implemented a basic version of importance sampling and multiple importance sampling. After that, I implemented it again using DirectX Raytracing (DXR). After finishing the DXR implementation, I started to implement ReSTIR. I first implemented a basic version of MIS. After finishing the basic version, I implemented the RIS. After finishing the RIS, I implemented the temporal reuse, which required me to use compute shaders to store and reuse the samples from the previous frame. After finishing the ReSTIR implementation, I started to implement ReSTIR GI. I first implemented a basic version of ReSTIR GI, which only used direct illumination on the area light of the scene. After finishing the basic version, I implemented the indirect illumination.

# Challenges

There were many challenges I faced during the implementation process. Examples of these challenges include understanding the view projection matrix, DXR API, slang API, physics of light transport, and many more. However, the biggest challenge was to deal with the problem that arose from spatial neighbor resampling. The temporal reuse worked well, but the spatial reuse caused many artifacts in the scene. The results clearly hinted that there were spatial issues because errors propagated from neighboring pixels. After spending a lot of time debugging, I found out that the main issue was that reusing PDFs from neighboring pixels caused NaN values in the MIS weight calculation, which caused the artifacts. Of course this could be prevented by clamping the PDFs, but that would cause bias in the results. I am still researching on how to properly solve this issue without introducing bias.

# Implementation Details

[GitHub Repository](https://github.com/Alegruz/ComputerGraphicsStudies/)

The implementation was done using Direct3D 12 and slang. The renderer was built from scratch, with minimal use of standard libraries. The main focus of the implementation was to create a test bed for ReSTIR and ReSTIR GI, thus the renderer was not optimized for performance. The scene used for the demo was a simple Cornell box with an area light. The implementation used DXR for ray tracing, and compute shaders for spatiotemporal reuse. There are total three types of light sources: the area light, randomly generated moving point lights, and environment light. The area light and indirect lights used ReSTIR GI for sampling, while the point lights used ReSTIR for sampling. The implementation also used multiple importance sampling for combining the samples from different light sources. The implementation also used temporal reuse for reusing the samples from the previous frame, and spatial reuse for reusing the samples from neighboring pixels. Maximum trace depth was set to 5, and 16 initial samples were generated per pixel. For temporal reuse, 1 sample from the previous frame was reused, and for spatial reuse, 4 samples from neighboring pixels were reused. One sample was given to area light, another one to point lights, and the last two to environment light.

# Results

▶️ [YouTube Demo – Temporal Reuse (Sept 21, 2025)](https://youtu.be/T5tYhoAHzLU?si=QjRvoQsYwbGVvsPR)  
▶️ [YouTube Demo – Indirect Light (Sept 26, 2025)](https://youtu.be/OTc1I7WVSt0?si=H8-nFEEiRDQ9RRfz)

# Future Work

There are still many things to improve in my implementation. Ultimate goal for this project is to be a test bed for modern or state-of-the-art real-time rendering techniques. Thus, I plan to implement more advanced techniques such as GRIS, stratified sampling, adaptive sampling, and many more. I also plan to optimize the performance of the implementation, as the current implementation is not optimized at all. I also plan to create a more complex scene to better showcase the capabilities of ReSTIR and ReSTIR GI. Also, I plan to expand the render device to support Vulkan and Metal as well. Of course, I should put some denoising techniques to further improve the visual quality. Lastly, I plan to write a detailed blog post on my implementation process and the challenges I faced during the implementation.