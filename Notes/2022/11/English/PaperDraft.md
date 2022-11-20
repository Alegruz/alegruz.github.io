# World-Space Clustered GRIS (2022.11.17)
[Home](/README.md)

# 1. Introduction

One of the main goal of computer graphics is to render a photorealistic virtual world in consumer-level hardwares. Monte carlo path tracing is widely used in modern offline renderers due to its generality and flexibity. With the advent of hardware-accelerated ray tracing [[Kilgariff et al. 2018](#kilgariffetal2018)], real-time path tracing was made feasible however with strict per-pixel ray budget [[Halen et al. 2021](#halenetal2021)]. Although real-time denoising algorithms(e.g. SVGF [[Schied et al. 2018](#schiedetal2018)]) alleviates the low-sampled image to increase the image quality, denoisers perform well with higher quality samples. This makes importance sampling particularly vital in order to sample the most meaningful samples to generate photorealistic imagery.

Virtual scenes especially in games often contains dynamic geometry, light sources which results in complex integrand for Monte carlo path tracing. Recent studies in resampled importance sampling (RIS) [[Talbot 2005](#talbot2005)] and weighted reservoir sampling (WRS) [[Chao 1982](#chao1982); [Vitter 1985](#vitter1985)] to perform spatiotemporal RIS (ReSTIR) [[Bitterli et al. 2020](#bitterli2020)] showed its effectiveness and efficiency on real-time monte carlo path tracing.

[[Bitterli et al. 2020](#bitterli2020)] interactively sampled direct illumination on many lights situation, which [[Wyman and Panteleev 2021](#wymanandpanteleev2021)] later optimized and productized. [[Ouyang et al. 2021](#ouyangetal2021)]'s ReSTIR extension ReSTIR GI samples path vertices to interactively render global illumination using ReSTIR. [[Lin et al. 2021](#linetal2021)] generalized RIS and ReSTIR to apply ReSTIR on participating media. [[Lin and Kettunen et al. 2022](#linandkettunenetal2022)] introduced generalized RIS (GRIS), a theoretical foundation of resampled importance sampling on Monte carlo path tracing by providing convergence conditions.

However successful ReSTIR or GRIS were, these methods guarantees interactive framerates rather than real-time frame rates. Because ReSTIR too successful at keeping important samples spatiotemporally, duplicate candidate samples exists in various reservoirs. In order to address this issue, this paper introduces world-space clustered GRIS where path vertices samples are stored in spatial clusters serving as reservoirs and spatial hash used to link each pixel to the cluster. Cluster data structure provides consistent access to samples with higher importance in the neighborhood.

# 2. Background

The fundamental problem of modern rendering is the rendering equation [[Kajiya 1986](#kajiya1986)] which gives the outgoing radiance **L**<sub>o</sub> from a point **x** to direction **&omega;**<sub>o</sub> as

<div id="eq_1">
 <p style="float: left; width:10%; text-align:left;"></p>
 <p style="float: left; width:80%; text-align:center;"><img src="/Images/WorldSpaceClusteredGris/Equation01.png" alt="RenderingEquation"/></p>
 <p style="float: left; width:10%; text-align:right;">(1)</p>
</div>
<div style="clear: both;"></div>

where **L**<sub>e</sub> is the emitted radiance, **L**<sub>i</sub> is the incoming radiance, &Omega; is the unit hemisphere of directions centered around the surface normal **n**<sub>**x**</sub>, f is the BSDF, and **&omega;**<sub>i</sub> is the incoming direction, with d**&omega;**<sub>i</sub> as the solid angle measure. In this paper, our interest is on global illumination rather than emission, thus we will simply remove the emitted radiance term to solve the rendering equation.

<div id="eq_2">
 <p style="float: left; width:10%; text-align:left;"></p>
 <p style="float: left; width:80%; text-align:center;"><img src="/Images/WorldSpaceClusteredGris/Equation02.png" alt="RenderingEquationWithoutEmission"/></p>
 <p style="float: left; width:10%; text-align:right;">(2)</p>
</div>
<div style="clear: both;"></div>

Monte carlo estimator allows the equation to be used in real-time applications by estimating the integrand stochastically as

<div id="eq_3">
 <p style="float: left; width:10%; text-align:left;"></p>
 <p style="float: left; width:80%; text-align:center;"><img src="/Images/WorldSpaceClusteredGris/Equation03.png" alt="MonteCarloEstimator"/></p>
 <p style="float: left; width:10%; text-align:right;">(3)</p>
</div>
<div style="clear: both;"></div>

where N is the number of independent samples and p(·) is some arbitrary PDF where samples are drawn from. In order to reduce the error of the estimator, we must perform variance reduction, and importance sampling is a powerful variance reduction technique due to the fact that the estimator converges quickly if the PDF p matches closely to the integrand [[Pharr, Jakob and Humphreys 2016](#pharrjakobandhumphreys2016)]. For readability, we will simplify the integrand function as **F**(·).

[[Talbot 2005](#talbot2005)] introduces resampled importance sampling (RIS) which uses a sub-optimal, but easy-to-sample source PDF p for M ≥ 1 initial candidates **x** = {x<sub>1</sub>, &hellip;, x<sub>M</sub>}, and a target PDF ![TargetPdf](/Images/WorldSpaceClusteredGris/TargetPdf.png) which is optimal, but has no existing practical sampling algorithm to approximate. Based on the target PDF, weight function w is given to each candidates, and by using the normalized values of the weights as the PDF, we randomly select an index z = {1, &hellip;, M} with probabilities:

<div id="eq_4">
 <p style="float: left; width:10%; text-align:left;"></p>
 <p style="float: left; width:40%; text-align:center;"><img src="/Images/WorldSpaceClusteredGris/Equation0401.png" alt="RisResampleProbability"/></p>
 <p style="float: left; width:40%; text-align:center;"><img src="/Images/WorldSpaceClusteredGris/Equation0402.png" alt="RisWeightFunction"/></p>
 <p style="float: left; width:10%; text-align:right;">(4)</p>
</div>
<div style="clear: both;"></div>

The target PDF in the weight function drives the resulting samples to approximate the target PDF. Now final sample y = x<sub>z</sub> is selected to be used in the RIS Monte carlo estimator:

<div id="eq_5">
 <p style="float: left; width:10%; text-align:left;"></p>
 <p style="float: left; width:80%; text-align:center;"><img src="/Images/WorldSpaceClusteredGris/Equation05.png" alt="MNSampleRisEstimator"/></p>
 <p style="float: left; width:10%; text-align:right;">(5)</p>
</div>
<div style="clear: both;"></div>

From now on, due to the strict ray budget of real-time rendering, we will assume N = 1:

<div id="eq_6">
 <p style="float: left; width:10%; text-align:left;"></p>
 <p style="float: left; width:80%; text-align:center;"><img src="/Images/WorldSpaceClusteredGris/Equation06.png" alt="M1SampleRisEstimator"/></p>
 <p style="float: left; width:10%; text-align:right;">(5)</p>
</div>
<div style="clear: both;"></div>

Weighted reservoir sampling (WRS) [[Chao 1982](#chao1982); [Vitter 1985](#vitter1985)] introduces a streaming algorithm which makes implementation on highly parallel harwares such as GPU particularly convenient. WRS takes in N samples from a stream and updates the reservoir by selecting appropriate samples to be stored in the reservoir based on the weight function.

Reservoir-based spatiotemporal importance resampling (ReSTIR) [[Bitterli et al. 2020](#bitterli2020)] combines RIS and WRS, and performs spatiotemporal resampling to create more candidate samples to better approximate the target PDF, resulting in a higher-quality image. ReSTIR only samples direct illuminations, however, this paper samples path vertices for global illumination.

Generalized RIS (GRIS) provides theoretical framework for ReSTIR by addressing its challenges and proving its assumptions. By using shift mapping to resolve the domain issue original ReSTIR had with initial candidates, reservoir combination, GRIS guarantees convergence of the estimator.

# References

<p id="bitterlietal2020">
Benedikt Bitterli, Chris Wyman, Matt Pharr, Peter Shirley, Aaron Lefohn, and Wojciech Jarosz. 2020. Spatiotemporal reservoir resampling for real-time ray tracing with dynamic direct lighting. ACM Trans. Graph. 39, 4, Article 148 (August 2020), 17 pages. [https://doi.org/10.1145/3386569.3392481](https://doi.org/10.1145/3386569.3392481)
</p>
<p id="chao1982">
M. T. Chao. 1982. A general purpose unequal probability sampling plan. Biometrika. Volume 69, Issue 3. (Dec. 1982), Pages 653–656. [https://doi.org/10.1093/biomet/69.3.653](https://doi.org/10.1093/biomet/69.3.653)
</id>
<p id="halenetal2021">
Henrik Halen, Andreas Brinck, Kyle Hayward, and Xiangshun Bei. 2021. Global Illumination Based on Surfels. In SIGGRAPH Courses; Advances in Real-Time Rendering
</p>
<p id="kajiya2005">
James T. Kajiya. 1986. The rendering equation. SIGGRAPH Comput. Graph. 20, 4 (Aug. 1986), 143–150. [https://doi.org/10.1145/15886.15902](https://doi.org/10.1145/15886.15902)
</p>
<p id="kilgariffetal2018">
Emmett Kilgariff, Henry Moreton, Nick Stam, and Brandon Bell. 2018. NVIDIA Turing Architecture In-Depth. [https://developer.nvidia.com/blog/nvidia-turing-architecture-in-depth/](https://developer.nvidia.com/blog/nvidia-turing-architecture-in-depth/). [Online; accessed 20-November-2022]
</p>
<p id="linetal2021">
Daqi Lin, Chris Wyman, and Cem Yuksel. 2021. Fast volume rendering with spatiotemporal reservoir resampling. ACM Trans. Graph. 40, 6, Article 279 (December 2021), 18 pages. [https://doi.org/10.1145/3478513.3480499](https://doi.org/10.1145/3478513.3480499)
</p>
<p id="linandkettunenetal2022">
Daqi Lin, Markus Kettunen, Benedikt Bitterli, Jacopo Pantaleoni, Cem Yuksel, and Chris Wyman. 2022. Generalized resampled importance sampling: foundations of ReSTIR. ACM Trans. Graph. 41, 4, Article 75 (July 2022), 23 pages. [https://doi.org/10.1145/3528223.3530158](https://doi.org/10.1145/3528223.3530158)
</p>
<p id="pharrjakobandhumphreys2016">
Matt Pharr, Wenzel Jakob, Greg Humphreys. 2016. Physically Based Rendering: From Theory to Practice, 3rd ed. Morgan Kaufmann, 2016. [http://www.pbr-book.org/](http://www.pbr-book.org/)
</p>
<p id="ouyangetal2021">
Yaobin Ouyang, Shiqiu Liu, Markus Kettunen, Matt Pharr, and Jacopo Pantaleoni. 2021. ReSTIR GI: Path Resampling for Real-Time Path Tracing. Computer Graphics Forum 40, 8 (2021), 17–29. [https://doi.org/10.1111/cgf.14378](https://doi.org/10.1111/cgf.14378)
</p>
<p id="schiedetal2018">
Christoph Schied, Christoph Peters, and Carsten Dachsbacher. 2018. Gradient Estimation for Real-time Adaptive Temporal Filtering. Proc. ACM Comput. Graph. Interact. Tech. 1, 2, Article 24 (August 2018), 16 pages. [https://doi.org/10.1145/3233301](https://doi.org/10.1145/3233301)
</p>
<p id="talbot2005">
Justin F. Talbot. 2005. Importance Resampling for Global Illumination. Masters Thesis. Brigham Young University. [https://scholarsarchive.byu.edu/etd/663](https://scholarsarchive.byu.edu/etd/663)
</p>
<p id="vitter1985">
Jeffrey S. Vitter. 1985. Random sampling with a reservoir. ACM Trans. Math. Softw. 11, 1 (March 1985), 37–57. [https://doi.org/10.1145/3147.3165](https://doi.org/10.1145/3147.3165)
</p>
<p id="wymanandpanteleev2021">
Chris Wyman and Alexey Panteleev. 2022. Rearchitecting spatiotemporal resampling for production. In Proceedings of the Conference on High-Performance Graphics (HPG '21). Eurographics Association, Goslar, DEU, 23–41. [https://doi.org/10.2312/hpg.20211281](https://doi.org/10.2312/hpg.20211281)
</p>

# Latex

Rendering Equation

```
\textbf{L}_{o}\left(\textbf{x}, \mathbf{\omega}_{o} \right ) = \textbf{L}_{e}\left(\textbf{x}, \mathbf{\omega}_{o} \right ) + \int_{\Omega}{f{\left(\textbf{x}, \mathbf{\omega}_{i}, \mathbf{\omega}_{o}  \right )}\textbf{L}_{i}\left(\textbf{x}, \mathbf{\omega}_{i} \right )\left | \mathbf{\omega}_{i}, \textbf{n}_{\textbf{x}} \right |\textrm{d}\mathbf{\omega}_{i}}
```

Rendering Equation without Emission

```
\textbf{L}_{o}\left(\textbf{x}, \mathbf{\omega}_{o} \right ) = \int_{\Omega}{f{\left(\textbf{x}, \mathbf{\omega}_{i}, \mathbf{\omega}_{o}  \right )}\textbf{L}_{i}\left(\textbf{x}, \mathbf{\omega}_{i} \right )\left | \mathbf{\omega}_{i}, \textbf{n}_{\textbf{x}} \right |\textrm{d}\mathbf{\omega}_{i}}
```

Monte Carlo Estimator

```
\textbf{L}_{o}\left(\textbf{x}, \mathbf{\omega}_{o} \right ) = \frac{1}{N} \sum_{s=1}^{N}\frac{f{\left(\textbf{x}, \mathbf{\omega}_{s}, \mathbf{\omega}_{o}  \right )}\textbf{L}_{i}\left(\textbf{x}, \mathbf{\omega}_{s} \right )\left | \mathbf{\omega}_{s}, \textbf{n}_{\textbf{x}} \right |}{p{\left(\mathbf{\omega}_{s} \right )}}
```

Target PDF

```
\hat{p}
```

RIS Resample Probability

```
p\left(z \mid \textbf{x} \right ) = \frac{\textrm{w}\left(x_{z} \right )}{\sum_{s=1}^{M}\textrm{w}\left(x_{s} \right )}
```

RIS Weight Function

```
\textrm{w}\left(x \right ) = \frac{\hat{p}\left(x \right )}{p\left(x \right )}
```

M, N Sample RIS Estimator

```
\left \langle \textbf{L}_{o} \right \rangle^{M, N}_{\textrm{ris}} = \frac{1}{N} \sum^{N}_{i=1} \left( \frac{\textbf{F}{\left(y_{i} \right )}}{\hat{p}{\left(y_{i} \right )}} \cdot \left(\frac{1}{M} \sum^{M}_{j=1}{\frac{\hat{p}\left(x_{ij} \right )}{p\left(x_{ij}\right)}} \right ) \right)
```

M, 1 Sample RIS Estimator

```
\left \langle \textbf{L}_{o} \right \rangle^{M, 1}_{\textrm{ris}} = \frac{\textbf{F}{\left(y_{i} \right )}}{\hat{p}{\left(y_{i} \right )}} \cdot \left(\frac{1}{M} \sum^{M}_{j=1}{\frac{\hat{p}\left(x_{ij} \right )}{p\left(x_{ij}\right)}} \right )
```