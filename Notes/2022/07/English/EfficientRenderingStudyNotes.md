# Rendering Pipeline Study Notes (2022.06.03)
[Home](/README.md)

# History Overiew

|Year|Name|G-Buffer|Lighting|
|----|----|--------|--------|
|2003|Beyond3D<sup>[Calver03](#Calver03)</sup>|Position/Normal/etc.|Fullscreen quad for global lights, local quads for local lights based on attenuation|

# Deferred Rendering

Q: Why deferred rendering?<br>
A: Combine conventional rendering techniques with the advantages of image space techniques<sup>[Calver03](#Calver03)</sup>

* Advantages:
  * Lights major cost is based on the screen area covered<sup>[Calver03](#Calver03)</sup>
  * All lighting is per-pixel and all surfaces are lit equally<sup>[Calver03](#Calver03)</sup>
  * Lights can be occluded like other objects, this allows fast hardware Z-Reject<sup>[Calver03](#Calver03)</sup>
  * Shadow mapping is fairly cheap<sup>[Calver03](#Calver03)</sup>
* Disadvantages:
  * Large frame-buffer size<sup>[Calver03](#Calver03)</sup>
  * Potentially high fill-rate<sup>[Calver03](#Calver03)</sup>
  * Multiple light equations difficult<sup>[Calver03](#Calver03)</sup>
  * High hardware specifications<sup>[Calver03](#Calver03)</sup>
  * Transparency is very hard<sup>[Calver03](#Calver03)</sup>

# G-Buffers

G-Buffers are 2D images that store geometric details in a texture, storing positions, normals and other details at every pixel. The key ingredient to hardware acceleration of G-Buffers is having the precision to store and process data such as position on a per-pixel basis. The higher precision we have to store the G-Buffer at, the slower the hardware renders.<sup>[Calver03](#Calver03)</sup>

## Examples

### Example 1: Beyond3D<sup>[Calver03](#Calver03)</sup>

<table>
<thead>
<tr>
<td>MRTs</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">R</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">G</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">B</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">A</td>
</tr>
</thead>
<tbody>
<tr>
<td>RT 0</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Pos.X</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Pos.Y</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Pos.Z</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">ID</td>
</tr>
<tr>
<td>RT 1</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Norm.X</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Norm.Y</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Norm.Z</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">Material ID</td>
</tr>
<tr>
<td>RT 2</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Diffuse Albedo.R</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Diffuse Albedo.G</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Diffuse Albedo.B</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">Diffuse Term</td>
</tr>
<tr>
<td>RT 3</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Specular Emissive.R</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Specular Emissive.G</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Specular Emissive.B</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">
Specular Term</td>
</tr>
</tbody>
</table>

|Material Lookup texture|
|---|
|Kspecblend|
|KAmb|
|KEmm|
|&hellip;|

# Overview

* Don't bother with any lighting while drawing scene geometry<sup>[Hargreaves04](#Hargreaves04)</sup>
* Render to a "fat" framebuffer format, using MRT to store data<sup>[Hargreaves04](#Hargreaves04)</sup>
* Apply lighting as a 2D postprocess, using these buffers as input<sup>[Hargreaves04](#Hargreaves04)</sup>

## Geometry Phase

Each geometry shader is responsible for filling the G-Buffers with correct parameters.<sup>[Calver03](#Calver03)</sup>

The major advantage over the conventional real-time approach to Renderman style procedural textures is that the entire shader is devoted to generating output parameters and that it is run only once regardless of the number or types of lights affecting this surface (generating depth maps also requires the geometry shaders to be run but usually with much simpler functions).<sup>[Calver03](#Calver03)</sup>

Another advantage is that after this phase how the G-Buffer was filled is irrelevant, this allows for impostors and particles to be mixed in with normal surfaces and be treated in the same manner (lighting, fog, etc.).<sup>[Calver03](#Calver03)</sup>

Some portions of the light equation that stay constant can be computed here and stored in the G-Buffer if necessary, this can be used if you light model uses Fresnel (which are usually only based on surface normal and view directional).<sup>[Calver03](#Calver03)</sup>

## Lighting Pass

### Single Pass Lighting



## Lighting Phase

The real power of deferred lighting is that lights are first class citizens, this complete separation of lighting and geometry allows lights to be treated in a totally different way from standard rendering. This makes the artist’s job easier as there is less restrictions on how lights affect surfaces, this allows for easy customizable lighting rigs.<sup>[Calver03](#Calver03)</sup>

Light shaders have access to the parameters stored in the G-Buffer at each pixel they light.<sup>[Calver03](#Calver03)</sup>

### Full screen lights

For lights that are truly global and have no position and size (ambient and directional are the traditional types), we create a full screen quad that executes the pixel shader at every pixel.<sup>[Calver03](#Calver03)</sup>

### Shaped lights

Shaped lights can be implemented via a full screen quad in exactly the same way of directional lights just with a different algorithm computing the lights direction and attenuation, but the attenuation allows us to pre-calculate where the light no longer makes any contribution.<sup>[Calver03](#Calver03)</sup>

> ### Optimization<br>
> The attenuation model I use is a simple texture lookup based on distance. The distance is divided by the maximum distance that the light can possible effect and then this is used to lookup a 1D texture. The last texel should be 0, (no constant term) if the following optimisations are to be used.<sup>[Calver03](#Calver03)</sup>

### Improving Efficiency

We create a mesh that encloses the light affecting volume with any pixels found to be in the interior of the volume executing the light shader.<sup>[Calver03](#Calver03)</sup>

1. Each pixel most be hit once and once only. If the light volume causes the light shader to be executed more than once it will be equivalent to having n lights affecting this pixel.<sup>[Calver03](#Calver03)</sup>
2. The near and far clip planes must not effect the projected shape. We need the projected geometry not to be clipped at the near and far plane as this will cause holes in our lights.<sup>[Calver03](#Calver03)</sup>

#### Convex Light Volumes

For convex volumes the first problem is completely removed by just using back or front face culling.<sup>[Calver03](#Calver03)</sup>

We can’t remove the near plane, but we can effectively remove the far plane by placing it at infinity.<sup>[Calver03](#Calver03)</sup>

Convex volumes cover the vast majority of lights shaders (e.g. spheres for point lights, cones for spotlights, etc.) and we can adapt them to use the fast z-reject hardware that is usually available.<sup>[Calver03](#Calver03)</sup>

#### Light Shader Occlusion Optimisations

The basis of using occlusion culling with light shaders is that the depth buffer used for the creation of the G-Buffer is available at no cost (this is only true if the resolution of the G-Buffer is the same as destination colour buffer and that we are using the same projection matrix for the geometry shaders and light shaders).<sup>[Calver03](#Calver03)</sup>

I simply turn off the occlusion culling if the light shader hits the near plane and just render the back faces without depth testing. Its means some pixels run the pixel shader unnecessarily but it’s very cheap on the CPU and the actual difference is usually only a few pixels.<sup>[Calver03](#Calver03)</sup>

## Shadows

### Shadow Maps

The key is using the little used variant known as forward shadow mapping. With forward shadow mapping the objects position is projected into shadow map space and then depths compared there.<sup>[Calver03](#Calver03)</sup>

The first step is to calculate the shadow map; this is exactly the same as a conventional renderer.<sup>[Calver03](#Calver03)</sup>

When the light that generated the shadow map is rendered, the shadow map is attached to the light shader in the standard fashion (a cube map for the point light case).<sup>[Calver03](#Calver03)</sup>

# Issues

## Transparency

The best (in speed terms) we can do currently is to fall-back to a non-deferred lighting system for transparent surfaces and blend them in post-processing.<sup>[Calver03](#Calver03)</sup>

## Memory

No solutions but a warning that deferred lighting has a number of large render-targets.<sup>[Calver03](#Calver03)</sup>

---

# References

## 2003

<a id="Calver03" href="https://www.beyond3d.com/content/articles/19/1">Photo-realistic Deferred Lighting</a>. [Dean Calver](https://www.linkedin.com/in/deanoc/details/experience/), [Climax](https://www.climaxstudios.com/).

## 2004

<a id="Hargreaves04" href="https://my.eng.utah.edu/~cs5600/slides/Wk%209%20D3DTutorial_DeferredShading.pdf">Deferred Shading</a>. [Shawn Hargreaves](https://shawnhargreaves.com/), [Climax](https://www.climaxstudios.com/).