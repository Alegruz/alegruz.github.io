---
layout: post
title: Implementing ReSTIR Variants in a Direct3D 12 Path Tracer: A Practical Study in Spatio-Temporal Resampling
date: 2025-12-05 18:40:00 +0900
categories: graphics
lang: "en"
---

My informal report on implementing ReSTIR variants in a Direct3D 12 path tracer is [here](/_posts/2025-11-06-implementing-restir-and-restir-gi-on-d3d12.md).

## Overview

Real-time path tracing is difficult because the number of rays we can use per frame is very limited. Recent work such as ReSTIR shows that sample reuse in time and space can reduce noise without increasing the ray count. In this report, I describe how I implemented a ReSTIR style global illumination system inside a Direct3D 12 and DXR path tracer that I wrote by myself. The system uses reservoirs for area lights, point lights, and indirect directions. It also performs temporal reuse and a simple form of spatial reuse.

I tested the system in a Cornell box scene that contains one area light and sixty-four point lights that revolve around the center. At 1920×1080 resolution and three bounces, the implementation reaches around sixty to seventy frames per second on an RTX 3060 Laptop GPU. Temporal reuse produced stable results, but spatial reuse caused over-brightening with indirect samples and instability near geometric edges. I also describe a numerical problem with PDFs and reservoir accumulation that produced NaNs and how I corrected it. This project helped me understand both the theory behind ReSTIR and the practical issues that appear when building a system like this in a real codebase.

---

## 1. Introduction

I built this project because I wanted to study real-time global illumination more deeply and understand how ideas from papers behave in practice. Path tracing is conceptually simple, but it is too noisy when the sample count is very low. Real-time rendering cannot use many samples, so variance reduction is important.

ReSTIR is a recent method that uses reservoir sampling to reuse lighting samples over frames and between pixels. It can improve the visual quality of a frame even when the number of rays per pixel is very limited. I wanted to implement a basic version of this idea and test it in a simple environment. I worked on this project from August 18, 2025 to September 29, 2025.

The goal of this report is to describe my implementation, the system around it, and the observations I made. The project is fully my own work.

---

## 2. Background

### 2.1 Monte Carlo Path Tracing

For more details on path tracing, see my previous report [here](/_posts/2025-06-28-study-notes-on-monte-carlo-integration.md).

Path tracing estimates incoming radiance by tracing random paths from the camera. Each sample contributes

$$L \approx \frac{f(x)}{p(x)},$$

where f(x) is the integrand and p(x) is the sampling PDF. When the number of samples is small, the result becomes noisy. Better sampling strategies such as importance sampling and multiple importance sampling help reduce variance.

### 2.2 Resampled Importance Sampling and ReSTIR

ReSTIR builds on the idea of reservoir sampling. Instead of storing many samples, a reservoir keeps one representative sample and a weight that accounts for all candidates it has seen. This allows the renderer to reuse samples from previous frames and from nearby pixels. The estimator can stay unbiased, or slightly biased depending on design choices.

The main idea is simple, but many details affect the final image. My project focuses on a basic form of ReSTIR and ReSTIR GI. It reuses one area light sample, one point light sample, and one indirect direction per pixel.

---

## 3. Renderer Architecture

Before implementing ReSTIR, I did a simple Web-based path tracer using WebGPU and WGSL to explain how to implement path tracing on the GPU. The blog post is [here](/_posts/2025-07-13-study-notes-on-raytracing-implementations.md).

The source code for this Direct3D 12 path tracer is available [here](https://github.com/Alegruz/ComputerGraphicsStudies/).

### 3.1 Overview

My renderer uses Direct3D 12 with DXR. All shaders are written in Slang. The main files are:

* `Common.slang` for shared utilities, sample generation, reservoir structs, and camera ray generation.
* `SimpleRaytracing.slang` for the main path tracing pass.
* `TemporalResampling.slang` for temporal reuse.
* `SpatialResampling.slang` for spatial reuse.
* `Renderer.cpp` for pipeline setup, acceleration structure creation, and buffer management.

The renderer is ray tracing oriented. There is no normal forward or deferred rendering pipeline. The ray generation shader directly handles camera rays and shading.

### 3.2 Acceleration Structures

The scene uses BLAS and a TLAS created through DXR. The Cornell box model and lights are static in terms of geometry. Only the point light positions change over time.

### 3.3 Scene Setup

I used a Cornell box. It has one parallelogram area light on the ceiling and sixty-four point lights that rotate around the center. The geometry itself does not move. This scene is simple but it creates many-light conditions.

### 3.4 Ray Generation and G Buffers

Primary rays are generated by transforming pixel coordinates using a projection-to-world matrix. The closest hit shader writes a primitive index and barycentric coordinates to a small G buffer. This helps temporal and spatial reuse identify valid pixels.

---

## 4. ReSTIR Implementation

### 4.1 Reservoirs

Each reservoir stores:

* a sample (position, index, or direction),
* the PDF used for sampling,
* the accumulated weight sum,
* the final weight,
* the number of samples seen.

There are separate reservoirs for area lights, point lights, and indirect samples.

### 4.2 Sampling Strategies

For each pixel, I generate:

* one area light sample,
* one point light sample,
* one indirect cosine-weighted hemisphere sample.

Then I generate eight proposed samples per strategy to update the reservoir. The constants are:

* `PARALLELOGRAM_AREA_LIGHT_SAMPLES_COUNT = 1`
* `POINT_LIGHT_SAMPLES_COUNT = 1`
* `HEMISPHERE_SAMPLES_COUNT = 1`
* `RESAMPLE_COUNT = 8`

### 4.3 Reservoir Update

For each candidate I compute a weight

$$w = \frac{\text{desiredPdf}}{\text{proposalPdf}}$$

and update the reservoir by adding to `WeightSum` and `SamplesCount`. With probability ( w / \text{WeightSum} ), the reservoir replaces the stored sample.

After all candidates are processed, the final weight used in shading is

$$\text{Weight} = \frac{\text{WeightSum}}{\text{Pdf} \cdot \text{SamplesCount}}$$

### 4.4 Multiple Importance Sampling

I use a simple power heuristic to mix the area light, point light, and hemisphere sampling strategies. The effective contribution includes BRDF terms, geometry terms, MIS weights, and the reservoir weight.

### 4.5 Temporal Reuse

The temporal pass combines each pixel’s current frame reservoir with the previous frame’s reservoir. The only validation is checking if the G buffer has a valid hit and if the previous reservoir has samples. There is no motion vector or depth threshold. This works well for static geometry and slowly changing lighting.

### 4.6 Spatial Reuse

The spatial pass picks one neighbor within a radius based on the screen resolution. It checks if the neighbor has valid data and then combines the two reservoirs. This method is simple and can cause bias near edges or when the neighbor comes from a different surface.

### 4.7 Path Depth

I use a bounce depth of three. Each bounce decreases the counter. There is no Russian Roulette, so the path always terminates when the counter reaches zero.

---

## 5. Experimental Setup

### 5.1 Hardware

* GPU: RTX 3060 Laptop GPU with 6 GB memory
* CPU: Intel i5 11300H
* RAM: 16 GB
* OS: Windows 11 or Ubuntu
* Tools: VS Code, MSVC or Clang, Slang, PIX debugger

### 5.2 Settings

* Resolution: 1920×1080
* Bounce depth: 3
* Scene: Cornell box with 1 area light and 64 moving point lights

### 5.3 Tested Configurations

I tested:

* (A) Naive path tracing
* (B) RIS only
* (C) ReSTIR with temporal reuse
* (D) ReSTIR with spatial reuse only
* (E) ReSTIR with temporal and spatial reuse

The main performance measurement I have is for (E), which reaches about 60–72 FPS.

---

## 6. Observations

### 6.1 Temporal Reuse

Temporal reuse reduces noise clearly compared to RIS only and naive path tracing. It also stays stable even when the 64 point lights rotate. I did not see visible bias from temporal reuse alone.

### 6.2 Spatial Reuse

Spatial reuse caused many problems. The brightness became too strong overall when indirect spatial reuse is enabled. There were NaN issues or visual artifacts especially when neighbors came from different geometry. Edges of walls and corners showed blotchy patterns. When using spatial reuse alone, the result was very unstable.

### 6.3 Comparison with Naive Path Tracing

Naive path tracing had strong noise at the same frame time. RIS helped a little, but still showed noise. Temporal reuse (C) produced the best overall balance. Temporal plus spatial (E) reduced noise further, but at the cost of visible artifacts.

---

## 7. Numerical Issue and Debugging

During development, I saw NaNs in the output. These appeared as extremely bright pixels. The cause was a mistake in how I computed PDFs and how I merged reservoirs. The sample count also grew incorrectly in some cases.

To find the problem, I used PIX and checked intermediate values. I also forced the reuse logic to always use a specific reservoir so I could track how values changed between pixels.

The fix was to correct the PDF equation, make the reservoir merging logic consistent, and make sure that `SamplesCount` only reflects the number of candidates seen by the reservoir itself. After the fix, NaNs disappeared.

---

## 8. Limitations

The current implementation has several limitations.

1. There is no motion vector based reprojection for temporal reuse.
2. The spatial reuse is too simple and causes over-brightening.
3. There is no denoiser.
4. The scene is simple and does not include complex materials or large geometry.

---

## 9. Future Work

If I continue this project, I want to improve the spatial reuse step. I want to add checks for depth, normal, and surface similarity. This should reduce bias near edges. I also want to try more advanced ideas from recent ReSTIR papers, such as Area ReSTIR, world space ReSTIR, and ReSTIR PT.

I also want to support more dynamic scenes, better BVH updates, and a denoiser to improve image quality with fewer samples.

---

## 10. Conclusion

This project was my first complete implementation of ReSTIR style GI in a path tracer that I wrote myself. Through this work, I learned how reservoir sampling interacts with real shader code, GPU memory, and numerical stability. I reached real time performance in a Cornell box scene with many point lights and three bounces. Temporal reuse worked well, and spatial reuse highlighted the challenges of using simple heuristics for neighbor selection.

This experience helped me understand both the theoretical ideas and the practical issues that appear when building a modern real time GI system.

---

## Author’s Contribution

I implemented the entire renderer, all shaders, the ReSTIR GI system, and all experiments by myself between August 18, 2025 and September 29, 2025.
