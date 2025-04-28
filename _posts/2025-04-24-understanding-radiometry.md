---
layout: post
title:  Understanding Radiometry
date:   2025-04-24 20:55:00 +0900
categories: graphics
lang: "en"
---

This is my second note on studying ReSTIR: Understanding Radiometry.

# Introduction

Ultimately, all you need is a four-component RGBA color as the result of the rendering process. Whatever happens inside the renderer blackbox is just details. But in order to really understand how a color is produced in rendering, one must understand two topics: **colorimetry** and **radiometry**. The former deals with colors; how we perceive, define, and process color. The latter deals with lights; how light travel, scatter, and transmit energy. ReSTIR is about illumination, and is not a paper on spectral rendering, so it is okay for us to just learn radiometry for now.

According to physics, a light could be either an aggregation of particles called **photons**, or a **wave**. It is beneficial for us to think of lights as a photons in radiometry. A photon carries an energy which is often translated into heat when it hits atoms. In the rendering world, this energy represents the intensity of the light: how bright is the light?

# Physics

## Energy

Now let's talk some physics. We said that a photon carries an energy which is measured in joules(J). Say that we have a closed space with **total energy of Q**. This energy has no context on the color. The closed space could be filled with redder lights, causing more energy near a specific **wavelength**. Say that we want to know how much "red" energy is in the space to compute the redness of the space. We can define an interval of wavelengths that defines "redness" and check how much energy does that specific wavelength interval has. Thus:

$$Q = \int{q\left(\lambda\right)d\lambda}$$

Where q stands for an energy in a given differential wavelength, and &lambda; stands for the wavelength.

The value of q would be almost zero in the most delta &lambda;'s. Think of this as a population test. To tell how crowded a country is, Just as population density tells us people per unit area — rather than total population — energy density tells us how much light energy exists per unit wavelength, giving us more useful insight into the spectral distribution of light. We can define the density of the energy as:

$$\begin{align*}Q_{\lambda}&=\frac{\int_{\lambda-\frac{\Delta\lambda}{2}}^{\lambda+\frac{\Delta\lambda}{2}}{q\left(\lambda\right)d\lambda}}{\Delta\lambda}\newline&=\frac{\Delta q}{\Delta \lambda}\end{align*}$$

This energy considers the wavelength, thus we call this **spectral energy**, and is the density of how much energy is in a given wavelength interval.

## Power

We need one more physical dimension to consider: **the time**. The amount of energy transferred/converted per unit time is called **power**, and is measured in watts(W). So, in theory, a 100W light bulb is emitting 100J of light energy per second. Of course, to be physically correct(no pun intended), due to some heat loss the resulting omission would be less than 100J, but say that it does emit 100J for simplicity. Let's say that we are using a light that emits &lambda; = 500 nm photons. According to the equation between photon energy and its wavelength:

$$Q = \frac{hc}{\lambda}$$

We can calculate that the resulting photon energy is:

$$
\begin{align*}
Q &= \frac{hc}{\lambda}\newline
&= \frac{hc}{500\textrm{nm}}\newline
&= \frac{hc}{500 \times 10^{-9}\textrm{m}}\newline
&\approx \frac{h\times3\times10^8\textrm{ms}^{-1}}{500 \times 10^{-9}\textrm{m}}\newline
&= h \times 6\times10^{14}\textrm{s}^{-1}\newline
&\approx 4 \times 10^{-19} \textrm{J}
\end{align*}
$$

This means that approximately 10<sup>20</sup> photons are produced each second. Even modern computers cannot afford to calculate this massive amount of photons albeit short the intervals are.

In computer graphics, we call this power [**Radiant flux**](https://en.wikipedia.org/wiki/Radiant_flux) or **Radiant power**.

Again, we are interested in the **spectral power** or **spectral flux**, measured in W(nm)<sup>-1</sup>. The standard symbol used to represent the power is &Phi;, and use &Phi;<sub>&lambda;</sub> to represent the spectral power.

If the light bulb distributed photons uniformly across the wavelength from 300 nm to 800 nm, then the spectral power(the density of the power across a given wavelength) is 100W/500 nm = 0.2 W(nm)<sup>-1</sup>.

$$
\begin{align*}
\Phi &= \frac{\Delta q}{\Delta t}\newline
\Phi_{\lambda} &= \frac{\Delta q}{\Delta t\Delta \lambda}\newline
\end{align*}
$$

## Irradiance

When we perform rendering, we want to know what color each pixel has. The color of each pixels, or the points in view are determined by the incoming lights and the material property of the point. Even if the point has the whitest material in the world, if there are no incoming lights, the surface couldn't scatter any photons, thus the point would be rendered black. On the other hand, even if you shed the brightest light in the world, if the material property of the given point is to absorb every photons' energy, the point would be rendered black.

Let's focus first on the incoming lights. When defining the amount of photons traveling into a specific point per time, we should again use the density. Given a finite area A, we can define the density of power over the area as E = &Phi; / A. This could be both [**irradiance**](https://en.wikipedia.org/wiki/Irradiance) (E), the density of lights comining into the area A, and **radiance exitance** or [**radiometry**](https://en.wikipedia.org/wiki/Radiosity_(radiometry)) (M), the density of lights exiting the area A. Beware, radiance exitance and radiance are totally different concepts!!

For example, say that there is a light bulb emitting lights to every spherical direction uniformly. If we put the radius of the sphere as r, then the area is 4&pi;r<sup>2</sup>, making the radiance exitance of a point p:

$$
\begin{align*}
M{\left(\textbf{p}\right)} = \frac{\Phi}{4\pi r^2}
\end{align*}
$$

Now, let's generalize this into a differential area:

$$
\begin{align*}
E{\left(\textbf{p}\right)} = \frac{\Delta \Phi{\left(\textbf{p}\right)}}{\Delta A}
\end{align*}
$$

Thus, if we sum every irradiance over an entire area, we get the power:

$$
\begin{align*}
\Phi = \int_{A}{E{\left(\textbf{p}\right)}dA}
\end{align*}
$$

Because this quanity is with respect to an area, we must consider the direction of the lights. For example, the brightest way we can shed a light on a surface is to send the lights directly at the area. If we tilt the light source to the surface, the lights become weaker. This is due to the fact that the area where the light comes from becomes larger when the light hits the surface. The same beam of light covers a larger projected area when it hits a surface at an oblique angle. Thus, the energy per unit area decreases proportionally to the cosine of the incident angle θ — which leads to the cosine factor in irradiance and the rendering equation.

## Radiance

Now we can focus on the outgoing light. When discussing irradiance, we only considered time and area(and wavelength for spectral irradiance). An outgoing light adds one more parameter to the equation: "direction". In computer graphics, we parameterize direction by using a concept called [**solid angle**](https://en.wikipedia.org/wiki/Solid_angle). A solid angle is basically a measurement of the amount of field of view from the center to the outer edge of the sphere. Think of a toy globe and a marker. Draw a random point on the globe, then slice the outer edge of the point to the center of the globe. This will create a cone with oval bottom. Just like an angle, if the sphere is a unit sphere, then the area of this oval bottom is the solid angle.

$$
\begin{align*}
L = \frac{\Delta^2 \Phi{\left(\textbf{p}\right)}}{\Delta A\Delta \omega\cos{\theta}}
\end{align*}
$$

&omega; is the solid angle, and &theta; is the angle that the outgoing direction &omega; makes with the surface A. This value is what we need. This is often used as "intensity" or "brightness". If we are not dealing with spectral renderers, then we simply multiply this with the desired color.

The spectral radiance would be:

$$
\begin{align*}
L_{\lambda} = \frac{\Delta^2 \Phi{\left(\textbf{p}\right)}}{\Delta A\Delta \omega\cos{\theta} \Delta \lambda}
\end{align*}
$$

Finally, we can compute the energy with:

$$
\begin{align*}
Q = \int_{t}\int_{A}\int_{\omega \in \Omega}\int_{\lambda}{L_{\lambda}\cos{\theta_\omega}}{d\lambda d\omega dA dt}
\end{align*}
$$

where &Omega; is the space of directions.

Radiance is conserved along straight paths (assuming no scattering or absorption), making it a key quantity in rendering equations.


$$
\begin{align*}
\end{align*}
$$