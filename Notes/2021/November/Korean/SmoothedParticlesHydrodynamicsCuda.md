# CUDA로 완화입자근사법(Smoothed Particle Hydrodynamics. SPH) 구현해보기 (2021.11.27)
[Home](../README.md)

## 원화입자근사법

In order to understand the SPH method, we must understand how can we simulate liquid. The idea is that liquid is essentially a group of small molecules, also known as H2O's. All the microinteractions between these molecules, the "particles" creates the entire physical simulation of the liquid. Thus by approximating a liquid body into a group of particles could simulate the liquid efficiently. This is a particle-based simulation of a liquid.

To understand how a particle-based simulation works, the best way is to see this paiting of Georges-Pierre Seurat, a French neo-impressionist painter famous for his pointillistic paintings.

![A Sunday on La Grande Jatte](https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1280px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg)

Each particle is merely an approximation of the light rays coming to our human eyes. The particle-based methods are often classified as a Lagrangian framework—a framework that solves the fluid motion by following the fluid parcel, such as particles.<sup>[1](#footnote_1)</sup>

### 역사

The SPH method was originally introduced in astrophysics community by Monaghan<sup>[2](#footnote_2)</sup> and actively studied in computational fluid dynamics field as well<sup>[3](#footnote_3)</sup>. Soon after, computer animation started to adopt the idea of SPH<sup>[4](#footnote_4), [5](#footnote_5)</sup> and also became one of the core frameworks for commercial products like RealFlow<sup>[6](#footnote_6)</sup>.<sup>[1](#footnote_1)</sup>

### 기초

**SPH is an interpolation method for particle systems**. This is probably the single most important sentence regarding SPH. This means that SPH is **not** a specific algorithm on determining the behavior of a liquid body. To understand how we use this interpolation method to simulate liquid particles, we must start from the *real basics*: physics and mathematics.

#### 고전역학: 운동학<sup>[7](#footnote_7)</sup>

Kinematics is a subfield of physics, developed in classical mechanics, that describes the motion of points, bodies (objects), and systems of bodies (groups of objects) without considering the forces that cause them to move.

Before proceeding to the next chapter, I should mandate all the readers to read the [Velocity and speed](https://en.wikipedia.org/wiki/Kinematics#Velocity_and_speed) chapter of the wikipedia page on kinematics. The core concepts to understand are: *position*, *velocity*, *acceleration*, *relative position*, *relative velocity*, *relative acceleration*.

The reason we went back to the physics class is to introduce these simple concepts that will soon run the entire SPH simulation. The SPH algorithm is basically finding out the acceleration of each particles, which we can multiply by delta time to get the velocity, which would finally lead us to the position of the particles.

The basic structure of the algorithm:

1. Find the relative acceleration of the particle *i*, **a**<sub>i, current</sub>
2. Calculate the new velocity of the particle **v**<sub>i, current</sub> = **v**<sub>i, previous</sub> + **a**<sub>i, current</sub> * &Delta;t<sub>current</sub>
3. Calculate the new position of the particle **r**<sub>i, current</sub> = **r**<sub>i, previous</sub> + **v**<sub>i, current</sub> * &Delta;t<sub>current</sub>

#### 고전장이론: 유동장의 라그랑지언 표기법<sup>[8](#footnote_8)</sup>

From now on, when we talk about velocities and accelerations, we are talking about the velocities and accelerations of each particles in a space through time. In the Lagrangian description, the flow is described by a function:

![lagrangian_description_of_the_flow](https://wikimedia.org/api/rest_v1/media/math/render/svg/325c42def30a6edd2cebea1ea5cc1616acd6f8af)

giving the position of the particle labeled **x**<sub>0</sub> at time *t*.

Within a chosen coordinate system, **x**<sub>0</sub> is referred to as the Lagrangian coordinates of the flow.

Further references to help you understand the concept of Lagrangian coordinate system:

<iframe width="560" height="315" src="https://www.youtube.com/embed/hQ4UNu1P2kw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/plkDAEx80bQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

<ol>
<li id="footnote_1">Doyup Kim. 2016. <a href="https://fluidenginedevelopment.org/">Fluid Engine Development (1st. ed.)</a>. A K Peters/CRC Press, Natikc, MA.</li>
<li id="footnote_2">J. J. Monaghan. <a href="https://www.annualreviews.org/doi/abs/10.1146/annurev.aa.30.090192.002551">Smoothed particle hydrodynamics</a>. Annual Review of Astronomy and Astrophysics 30:543-574, 1992.</li>
<li id="footnote_3">J. J. Monaghan. <a href="https://www.sciencedirect.com/science/article/pii/S0021999184710345">Simulating free surface flows with SPH</a>. Journal of Computational Physics, 110(2):399–406, 1994.</li>
<li id="footnote_4"> M. Desbrun, and M-P. Gascuel. <a href="https://hal.inria.fr/inria-00537534/document">Smoothed particles: A new paradigm for animating highly deformable bodies</a>. In Computer Animation and Simulation’96, pages 61–76. Springer Vienna, 1996.</li>
<li id="footnote_5">M. Müller, D. Charypar, and M. Gross. <a href="https://matthias-research.github.io/pages/publications/sca03.pdf">Particle-based fluid simulation for interactive applications</a>. In Proceedings of the 2003 ACM SIGGRAPH/Eurographics Symposium on Computer Animation, pages 154–159, 2003.</li>
<li id="footnote_6">RealFlow 10 documentation. Available at <a href="https://nextlimitsupport.atlassian.net/wiki/spaces/rf2016docs/overview">https://nextlimitsupport.atlassian.net/wiki/spaces/rf2016docs/overview</a>. Accessed on 27 NOV 2021.</li>
<li id="footnote_7"><a href="https://en.wikipedia.org/wiki/Kinematics">Kinematics</a> - Wikipedia<li>
<li id="footnote_8"><a href="https://en.wikipedia.org/wiki/Lagrangian_and_Eulerian_specification_of_the_flow_field">Lagrangian and Eulerian specification of the flow field</a> - Wikipedia<li>
<li id="footnote_9"><li>
<li id="footnote_10"><li>
<li id="footnote_11"><li>
<li id="footnote_12"><li>
<li id="footnote_13"><li>
</ol>