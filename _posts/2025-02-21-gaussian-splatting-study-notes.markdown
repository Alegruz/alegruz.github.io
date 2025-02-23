---
layout: post
title:  "Gaussian Splatting Study Notes"
date:   2025-02-21 09:26:00 +0900
categories: graphics
lang: "en"
---

## Reads

* [3D Gaussian Splatting for Real-Time Radiance Field Rendering](https://arxiv.org/pdf/2308.04079)
    1. Introduction
        * [Plenoxels: Radiance Fields without Neural Networks](https://alexyu.net/plenoxels/)
        * [Instant Neural Graphics Primitives with a Multiresolution Hash Encoding](https://nvlabs.github.io/instant-ngp/)
        * [Point-NeRF: Point-based Neural Radiance Fields](https://xharlie.github.io/projects/project_sites/pointnerf/)
        * Datasets
            * [Mip-NeRF 360: Unbounded Anti-Aliased Neural Radiance Fields](https://paperswithcode.com/dataset/mip-nerf-360)
            * [Deep Blending for Free-Viewpoint Image-Based Rendering](https://github.com/Phog/DeepBlending)
            * [Tanks and Temples: Benchmarking Large-Scale Scene Reconstruction](https://paperswithcode.com/dataset/tanks-and-temples)
        * [Photo tourism: Exploring photo collections in 3D](https://phototour.cs.washington.edu/)
        * [Neural Point-Based Graphics](https://saic-violet.github.io/npbg/)
        * [PointBased Neural Rendering with Per-View Optimization](https://repo-sam.inria.fr/fungraph/differentiable-multi-view/)
        * [ADOP: Approximate Differentiable One-Pixel Point Rendering](https://arxiv.org/abs/2110.06635)
        * [Pulsar: Efficient Sphere-Based Neural Rendering](https://arxiv.org/abs/2004.07484)
    2. Related Work
        * [Advances in neural rendering](https://arxiv.org/abs/2111.05849)
        * [Neural fields in visual computing and beyond](https://neuralfields.cs.brown.edu/eg22.html)
        1. Traditional Scene Reconstruction and Rendering
                * [The Lumigraph](https://www.microsoft.com/en-us/research/publication/the-lumigraph/)
                * [Light Field Rendering](https://graphics.stanford.edu/papers/light/)
                * [Unstructured Lumigraph Rendering](https://cs.harvard.edu/~sjg/papers/ulr.pdf)
                * [Multi-View Stereo for Community Photo Collections](https://grail.cs.washington.edu/projects/mvscpc/download/Goesele-2007-MVS.pdf)
                * [Depth synthesis and local warps for plausible image-based navigation](https://dl.acm.org/doi/10.1145/2487228.2487238)
                * [Floating Textures](https://graphics.tu-bs.de/publications/Eisemann08FT)
                * [Deep Blending for Free-Viewpoint Image-Based Rendering](https://github.com/Phog/DeepBlending)
                * [PointBased Neural Rendering with Per-View Optimization](https://repo-sam.inria.fr/fungraph/differentiable-multi-view/)
        2. Neural Rendering and Radiance Fields
                * [Deepstereo: Learning to predict new views from the world’s imagery](https://arxiv.org/abs/1506.06825)
                * [View Synthesis by Appearance Flow](https://arxiv.org/abs/1605.03557)
                * [Deep Blending for Free-Viewpoint Image-Based Rendering](https://github.com/Phog/DeepBlending)
                * [Free View Synthesis](https://arxiv.org/abs/2008.05511)
                * [Deferred Neural Rendering: Image Synthesis using Neural Textures](https://arxiv.org/abs/1904.12356)
                * [Soft 3D Reconstruction for View Synthesis](https://ericpenner.github.io/soft3d/)
                * [Escaping Plato's Cave: 3D Shape From Adversarial Rendering](https://geometry.cs.ucl.ac.uk/projects/2019/platonicgan/)
                * [DeepVoxels: Learning Persistent 3D Feature Embeddings](https://www.vincentsitzmann.com/deepvoxels/)
                * [NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis](https://www.matthewtancik.com/nerf)
                * [TensoRF: Tensorial Radiance Fields](https://apchenstu.github.io/TensoRF/)
                * [FastNeRF: High-Fidelity Neural Rendering at 200FPS](https://arxiv.org/abs/2103.10380)
                * [Baking Neural Radiance Fields for Real-Time View Synthesis](https://phog.github.io/snerg/)
                * [KiloNeRF: Speeding up Neural Radiance Fields with Thousands of Tiny MLPs](https://arxiv.org/abs/2103.13744)
                * [Neural Geometric Level of Detail: Real-time Rendering with Implicit 3D Shapes](https://arxiv.org/abs/2101.10994)
                * [Scalable Neural Indoor Scene Rendering](https://xchaowu.github.io/papers/scalable-nisr/)
                * [PlenOctrees for Real-time Rendering of Neural Radiance Fields](https://alexyu.net/plenoctrees/)
                * [Variable Bitrate Neural Fields](https://nv-tlabs.github.io/vqad/)
                * [Direct Voxel Grid Optimization: Super-fast Convergence for Radiance Fields Reconstruction](https://arxiv.org/abs/2111.11215)
        3. Point-Based Rendering and Radiance Fields
                * [Point-Based Graphics](https://www.sciencedirect.com/book/9780123706041/point-based-graphics)
                * [Point Sample Rendering](https://cgl.ethz.ch/Downloads/Seminar_Arbeiten/1999/adesboeufs.pdf)
                * [Point-based rendering techniques](https://www.sciencedirect.com/science/article/abs/pii/S0097849304001530)
                * [High-Performance Software Rasterization on GPUs](https://research.nvidia.com/publication/2011-08_high-performance-software-rasterization-gpus)
                * [Software Rasterization of 2 Billion Points in Real Time](https://arxiv.org/abs/2204.01287)
                * [High Quality Surface Splatting on Today’s GPUs](https://www.graphics.rwth-aachen.de/media/papers/splatting1.pdf)
                * [Surfels: Surface Elements as Rendering Primitives](https://www.cs.umd.edu/~zwicker/projectpages/Surfels-SIG00.html)
                * [Object Space EWA Surface Splatting: A Hardware Accelerated Approach to High Quality Point Rendering](http://graphics.cs.cmu.edu/projects/objewa/)
                * [Surface Splatting](https://cgl.ethz.ch/research/past_projects/surfels/surfacesplatting/index.html)
                * [SynSin: End-to-end View Synthesis from a Single Image](https://arxiv.org/abs/1912.08804)
                * [Differentiable Surface Splatting for Point-based Geometry Processing](https://yifita.netlify.app/publication/dss/)
                * [Neural Point-Based Graphics](https://saic-violet.github.io/npbg/)
                * [ADOP: Approximate Differentiable One-Pixel Point Rendering](https://arxiv.org/abs/2110.06635)
                * [Neural Point Catacaustics for Novel-View Synthesis of Reflections](https://repo-sam.inria.fr/fungraph/neural_catacaustics/)
                * [PointBased Neural Rendering with Per-View Optimization](https://repo-sam.inria.fr/fungraph/differentiable-multi-view/)
                * [Pulsar: Efficient Sphere-Based Neural Rendering](https://arxiv.org/abs/2004.07484)
                * [Differentiable Point-Based Radiance Fields for Efficient View Synthesis](https://light.princeton.edu/publication/point-based-radiance-fields/)
                * [Point-NeRF: Point-based Neural Radiance Fields](https://xharlie.github.io/projects/project_sites/pointnerf/)
                * [A Versatile Scene Model with Differentiable Visibility Applied to Generative Pose Estimation](https://vcai.mpi-inf.mpg.de/projects/DiffVis/)
                * [Fast Articulated Motion Tracking using a Sums of Gaussians Body Model](https://mindlink.industries/assets/pdf/2011_iccv_sum_of_gaussians.pdf)
                * [VoGE: A Differentiable Volume Renderer using Neural Gaussian Ellipsoids for Analysis-by-Synthesis](https://github.com/Angtian/VoGE)
                * [Mixture of Volumetric Primitives for Efficient Neural Rendering](https://stephenlombardi.github.io/projects/mvp/)
    3. Overview
        * Input: Images of a static scene (SfM)
            * [Structure-from-Motion Revisited](https://openaccess.thecvf.com/content_cvpr_2016/papers/Schonberger_Structure-From-Motion_Revisited_CVPR_2016_paper.pdf)
        * Output: Set of 3D Gaussians
            * position (mean)
            * covariance matrix
            * opacity &alpha;
            * spherical harmonics (color)
                * [Plenoxels: Radiance Fields without Neural Networks](https://alexyu.net/plenoxels/)
                * [Instant Neural Graphics Primitives with a Multiresolution Hash Encoding](https://nvlabs.github.io/instant-ngp/)
        * Algorithm: Sequentially optimize the 3D Gaussian parameters + adaptively control the Gaussian density
        * Rasterization:
            * Tile-based (mobile-style)
            * &alpha;-blending
            * sorting
    4. Differentiable 3D Gaussian Splatting
        * Goal: optimize a scene representation from a sparse set of SfMs
        * Solution:
            * 3D Gaussians
                * Differentiable
                * Can be easily projected to 2D splats
                    * Allows fast &alpha;-blending
                * prev methods assume each point is a small planar circle with a normal
                    * normals are noisy (sparsity of SfM points)
                    * [PointBased Neural Rendering with Per-View Optimization](https://repo-sam.inria.fr/fungraph/differentiable-multi-view/)
                    * [Differentiable Surface Splatting for Point-based Geometry Processing](https://yifita.netlify.app/publication/dss/)
                * Defined by a full 3D convariance matrix &Sigma; in world space centered at point (mean)
                    * $$ G(x) = e^{-{{1}\over{2}}\left(x \right)^{T}\sum^{-1}{\left(x\right)}} $$
                    * [EWA Volume Splatting](https://cgl.ethz.ch/research/past_projects/surfels/ewavolumesplatting/index.html)