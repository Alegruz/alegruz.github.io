---
layout: post
title:  Understanding BRDF
date:   2025-04-22 21:16:00 +0900
categories: graphics
lang: "en"
---

This is my first note on studying ReSTIR: Understanding BRDF.

# Material Models

Rendering approximates how light interacts with matter to produce visual perception. Light propagates through space, interacts with media and surfaces, and ultimately reaches our eyes. In the real world, light propagates through space, reflects off surfaces, and scatters through participating media, eventually reaching our eyes. These interactions happen at microscopic and atomic levels, and modeling them precisely is computationally intractable for real-time graphics.

Surface roughness plays a key role in how light is reflected. At the microscopic level, the surface consists of many tiny facets (‘microfacets’) that each reflect light. When the surface is rough, their orientations vary randomly, leading to scattered, diffuse reflection. Conversely, a smooth surface reflects light in a more uniform, directionally consistent way — resulting in specular or glossy appearance.

One way to approximate this complex scattering behavior is through stochastic sampling. Since light can scatter in many directions at a surface point, we can model the distribution of scattered directions using a function. This leads to the definition of the Bidirectional Scattering Distribution Function (BSDF). The BSDF takes two directions — the incident light direction (ωᵢ) and the outgoing (view) direction (ωₒ) — and returns a value representing the scattering efficiency — the amount of radiance reflected or transmitted per unit incoming irradiance and per unit projected solid angle, since it must account for the angle at which light strikes the surface (via cosine weighting). This is not a probability, but a radiometric quantity used to compute reflected radiance.

In real-time rendering, simulating both reflection and transmission (as in full BSDFs) is often too expensive. For most opaque surfaces, we ignore transmission and use a simpler model: the Bidirectional Reflectance Distribution Function (BRDF), which only considers the upper hemisphere of directions (i.e., those above the surface). The BRDF is defined only over the hemisphere above the surface normal, since transmission into the material is excluded. The BRDF expresses how much of the incoming light from direction ωᵢ is reflected toward ωₒ, per unit solid angle, and is typically used in computing shading for opaque materials in rasterized pipelines.

Let's use simple words to understand this mathematical burden. The only thing you care about is the light that actually lands on your eyes from a point in space. The point should have received all the lights from every direction on the hemisphere, and we are choosing a single incident light among them. The total amount of lights that comes into a single point is called irradiance. To calculate this, we must integrate every lights than comes into the point weighted by the cosine term:

$$E = \int_{H^2}{L_i{\left(\omega_i\right)}\cos{\theta_i}d\omega_i}$$

This represents the total incoming power per unit area at a surface point, accumulated over all directions in the upper hemisphere.

We have to choose a single incoming light from the direction ωᵢ, so we simply get the differential of the power *dE*. So given this tiny amount of directional incoming energy, we are curious of how much energy is scattered in a specific outgoing direction? We could rephrase this into "given an incoming direction, I would like to know how efficiently energy is scattered into the outgoing direction."

$$\begin{align*}f_r{\left(\omega_i, \omega_o\right)} &= \frac{dL_o{\left(\omega_o\right)}}{dE\left(\omega_i\right)}\newline & =\frac{dL_o{\left(\omega_o\right)}}{L_i\left(\omega_i\right)\cos{\theta_i}d\omega_i} \end{align*}$$

This definition holds for opaque materials that reflect but do not transmit energy. The resulting BRDF has units of sr⁻¹.