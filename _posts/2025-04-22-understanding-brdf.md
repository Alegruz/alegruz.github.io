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

This equation represents the total incoming power (irradiance 𝐸) per unit area at a surface point. It is computed by integrating the incoming radiance 𝐿<sub>𝑖</sub>(𝜔<sub>𝑖</sub>), weighted by the cosine of the angle between the incoming direction 𝜔<sub>𝑖</sub> and the surface normal 𝜃<sub>𝑖</sub>, over the upper hemisphere 𝐻<sup>2</sup> of directions.

To isolate the contribution from a single incoming direction 𝜔<sub>𝑖</sub>, we consider a differential amount of irradiance 𝑑𝐸(𝜔<sub>𝑖</sub>), which is:

$$dE\left(\omega_i\right) = L_i{\left(\omega_i\right)}\cos{\theta_i}d\omega_i$$

Now, we ask:

Given this infinitesimally small amount of incoming energy from direction 𝜔<sub>𝑖</sub>, how much energy is scattered into a specific outgoing direction 𝜔<sub>𝑜</sub>?

This leads us to define the Bidirectional Reflectance Distribution Function (BRDF):

$$\begin{align*}f_r{\left(\omega_i, \omega_o\right)} &= \frac{dL_o{\left(\omega_o\right)}}{dE\left(\omega_i\right)}\newline & =\frac{dL_o{\left(\omega_o\right)}}{L_i\left(\omega_i\right)\cos{\theta_i}d\omega_i} \end{align*}$$

This function describes the scattering efficiency of a surface:

It quantifies how effectively light arriving from direction 𝜔<sub>𝑖</sub> is reflected toward direction 𝜔<sub>𝑜</sub>, per unit irradiance, per unit solid angle.

The reason incoming and outgoing radiances use different function is to abstract the fact that incoming lights could be from anything like environment mapping, direct illumination, indirect illuminations, etc., and the outgoing radiance is what the current context(material, etc.) is computing.