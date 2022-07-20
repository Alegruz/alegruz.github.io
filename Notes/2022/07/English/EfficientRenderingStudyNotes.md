# Efficient Rendering Study Notes (2022.06.03)
[Home](/README.md)

# History Overiew

|Year|Name|G-Buffer|Lighting|
|----|----|--------|--------|
|2003|Beyond3D<sup>[Calver03](#Calver03)</sup>|Position/Normal/etc.|Fullscreen quad for global lights, local quads for local lights based on attenuation|

# Forward Rendering

* Issues:
  * Computing which lights affecdt each body consumes CPU time, and in the worst cast, it becomes an O(n &times; m) operation<sup>[Koonce07](#Koonce07)</sup>
  * Shaders often require more than one render pass to perform lighting, with complicated shaders requiring worst-case O(n) render passes for n lights<sup>[Koonce07](#Koonce07)</sup>
  * Adding new lighting models or light types requires changing all effect source files<sup>[Koonce07](#Koonce07)</sup>
  * ~~Shaders quickly encounter the instruction count limit of Shader Model 2.0<sup>[Koonce07](#Koonce07)</sup>~~

## Lighting Pass

### Single Pass Lighting

```
For each object:
  Render mesh, applying all lights in one shader
```
<sup>[Hargreaves04](#Hargreaves04)</sup>

```
For each object:
  Find all lights affecting object
  Render all lighting and material in a single shader
```
<sup>[Valient07](#Valient07)</sup>

* Good for scenes with small number of lights (e.g. outdoor sunlight)<sup>[Hargreaves04](#Hargreaves04)</sup>
* Difficult to organize if there are many lights<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Valient07](#Valient07)</sup>
  * Code generation can result in thousands of combiations for a single template shader<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Valient07](#Valient07)</sup>
  * Shader for each material vs. light setup combination<sup>[Valient07](#Valient07)</sup>
* Easy to overflow shader length limitations<sup>[Hargreaves04](#Hargreaves04)</sup>
* Hidden surfaces can cause wasted shading<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Valient07](#Valient07)</sup>
* Hard to integrate with shadows<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
  * Stencil = No Go
  * Shadow Maps = Easy to overflow VRAM
    * All shadow maps have to be in memory<sup>[Valient07](#Valient07)</sup>

### Multipass Lighting

```
For each light:
  For each object affected by the light:
    framebuffer += object * light
```
<sup>[Hargreaves04](#Hargreaves04)</sup>

```
For each light:
  For each object:
    Add lighting from single light to frame buffer
```
<sup>[Valient07](#Valient07)</sup>

* Worst case complexity is num_objects * num_lights<sup>[Hargreaves04](#Hargreaves04)</sup>
* Sorting by light or by object are mutually exclusive<sup>[Hargreaves04](#Hargreaves04)</sup>
  * Hard to maintain good batching
* Ideally the scene should be split exactly along light boundaries, but getting this right for dynamic lights can be a lot of CPU work<sup>[Hargreaves04](#Hargreaves04)</sup>
* Hidden surfaces can cause wasted shading<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Valient07](#Valient07)</sup>
* High batch cound (1/object/light)<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
  * Even higher if shadow-casting
* Lots of repeated work each pass:<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Valient07](#Valient07)</sup>
  * Vertex transform & setup
  * Anisotropic filtering
* Can only be justified when targeting graphics that generally consist of low- and medium-poly-count scenes with no complex materials, a very small number of light types, and where illumination comes from a few lights spread all over the scene<sup>[Placeres06](#Placeres06)</sup>
* Shader for each material and light type<sup>[Valient07](#Valient07)</sup>

# Deferred Rendering

Q: Why deferred rendering?<br>
A: Combine conventional rendering techniques with the advantages of image space techniques<sup>[Calver03](#Calver03)</sup>

* Advantages:
  * Lights major cost is based on the screen area covered<sup>[Calver03](#Calver03)</sup>, Predictable performance proportional to the lights' screen-space areas<sup>[Shishkovtsov05](#Shishkovtsov05)</sup><sup>[Valient07](#Valient07)</sup>
  * All lighting is per-pixel and all surfaces are lit equally<sup>[Calver03](#Calver03)</sup><sup>[Thibieroz04](#Thibieroz04)</sup>
  * Lights can be occluded like other objects, this allows fast hardware Z-Reject<sup>[Calver03](#Calver03)</sup>
  * Shadow mapping is fairly cheap<sup>[Calver03](#Calver03)</sup>
  * Easily integrates with popular shadow techniques<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Placeres06](#Placeres06)</sup>
  * Excellent batching<sup>[Hargreaves04](#Hargreaves04)</sup>, Greatly simplifies batching<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>, Cuts down on large numbers of batches<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
  * Render each triangle exactly once<sup>[Hargreaves04](#Hargreaves04)</sup>, Only a single geometry pass is required<sup>[Thibieroz04](#Thibieroz04)</sup>
  * Shade each visible pixel exactly once<sup>[Hargreaves04](#Hargreaves04)</sup>, "Perfect" O(1) depth complexity for lighting<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Thibieroz04](#Thibieroz04)</sup><sup>[Placeres06](#Placeres06)</sup>
  * Easy to add new types of lighting shader<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[Koonce07](#Koonce07)</sup>
  * Other kinds of postprocessing(blur, heathaze) are just special lights, and fit neatly into the existing framework<sup>[Hargreaves04](#Hargreaves04)</sup>, Simplifies rendering of multiple special effects<sup>[Placeres06](#Placeres06)</sup>
  * Simple engine management<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
  * Lots of small lights ~ one big light<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
  * Perfect depth complexity for lighting<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
  * Reduces CPU usage<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
  * Lighting costs are independent of scene complexity<sup>[Koonce07](#Koonce07)</sup>, Adding more layers of effects generally results in a linear, fixed cost per frame for additional full-screen post-processing passes regardless of the number of models on screen<sup>[FilionMcNaughton08](#FilionMcNaughton08)</sup>
  * No additional render passes on geometry for lighting, resulting in fewer draw calls and fewer state changes required to render the scene<sup>[Koonce07](#Koonce07)</sup>
  * Material shaders do not perform lighting, freeing up instructions for additional geometry processing<sup>[Koonce07](#Koonce07)</sup>
  * Simpler shaders<sup>[Valient07](#Valient07)</sup>
* Disadvantages:
  * Large frame-buffer size<sup>[Calver03](#Calver03)</sup>, Framebuffer bandwidth can easily get out of hand<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[Placeres06](#Placeres06)</sup>
  * Potentially high fill-rate<sup>[Calver03](#Calver03)</sup><sup>[Placeres06](#Placeres06)</sup>
  * Multiple light equations difficult<sup>[Calver03](#Calver03)</sup>, Forces a single lighting model across the entire scene (everything has to be 100% per-pixel)<sup>[Hargreaves04](#Hargreaves04)</sup>
  * High hardware specifications<sup>[Calver03](#Calver03)</sup>
  * Transparency is very hard<sup>[Calver03](#Calver03)</sup>, Alpha blending is a nightmare!<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[Placeres06](#Placeres06)</sup><sup>[Valient07](#Valient07)</sup>
  * Can't take advantage of hardware multisampling<sup>[Hargreaves04](#Hargreaves04)</sup> AA is problematic<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Placeres06](#Placeres06)</sup>
    * MYTH!! MSAA did not prove to be an issue!!<sup>[Valient07](#Valient07)</sup>
  * ~~Not good approach for older hardware<sup>[Hargreaves04](#Hargreaves04)</sup>~~
  * ~~Not good when you have many directional lights<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>~~
    * ~~Shading complexity will be O(R * L) (R = screen resolution, L = lights)~~
    * MYTH!!<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>

```
For each object:
  Render to multiple targets

For each light:
  Apply light as a 2D postprocess
```
<sup>[Hargreaves04](#Hargreaves04)</sup>

```
For each object:
  Render surface properties into the G-Buffer
For each light and lit pixel
  Use G-Buffer to compute lighting
  Add result to frame buffer
```
<sup>[Valient07](#Valient07)</sup>

* Traditional deferred shading<sup>[Andersson09](#Andersson09)</sup>
  1. Graphics pipeline rasterizes gbuffer for opaque surfaces
     * Normal, albedos, roughness, etc. 
  2. Light sources are rendered & accumulate lighting to a texture
     * Light volume or screen-space tile rendering 
  3. Combine shading & lighting for final output

* Worst case complexity is num_objects + num_lights<sup>[Hargreaves04](#Hargreaves04)</sup>
* Perfect batching<sup>[Hargreaves04](#Hargreaves04)</sup>
* Many small lights are just as cheap as a few big ones<sup>[Hargreaves04](#Hargreaves04)</sup>
* On MMO, given the lack of control of the game environment and the poort scalability of lighting costs within a forward renderer, deferred-shading renderer is preferable<sup>[Koonce07](#Koonce07)</sup>

# G-Buffers

G-Buffers are 2D images that store geometric details in a texture, storing positions, normals and other details at every pixel. The key ingredient to hardware acceleration of G-Buffers is having the precision to store and process data such as position on a per-pixel basis. The higher precision we have to store the G-Buffer at, the slower the hardware renders.<sup>[Calver03](#Calver03)</sup>

## What to Store?

|Attribute|Format|Comment|Optimization|
|---------|------|-------|------------|
|Depth<sup>[Calver03](#Calver03)</sup><br><sup>[Hargreaves04](#Hargreaves04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Thibieroz04](#Thibieroz04)</sup><br><sup>[Placeres06](#Placeres06)</sup>| | |In GBuffer, `G_Buffer.z = length(Input.PosInViewSpace);`, In VS, `out.vEyeToScreen = float3(Input.ScreenPos.x * ViewAspect, Input.ScreenPos.y, invTanHalfFOV);`, In PS, `float3 PixelPos = normalize(Input.vEyeToScreen) * G_Buffer.z;`<sup>[Placeres06](#Placeres06)</sup><br>`float3 vViewPos.xy = INTERPOLANT VPOS * half2(2.0f, -2.0f) + half2(-1.0f, 1.0f)) * 0.5 * p vCameraNearSize * p vRecipRenderTargetSize;`<br>`vViewPos.zw = half2(1.0f, 1.0f);`<br>`vViewPos.xyz = vViewPos.xyz * fSampledDepth;`<br>`float3 vWorldPos = mul(p_mInvViewTransform, vViewPos).xyz;`|
|Normal<sup>[Calver03](#Calver03)</sup><br><sup>[Hargreaves04](#Hargreaves04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Thibieroz04](#Thibieroz04)</sup><br><sup>[Placeres06](#Placeres06)</sup><br><sup>[Andersson09](#Andersson09)</sup>|`R10G10B10A2_FLOAT`<sup>[Hargreaves04](#Hargreaves04)</sup><br>`U10V10W10A2`<sup>[Thibieroz04](#Thibieroz04)</sup>, `U8V8W8Q8`<sup>[Thibieroz04](#Thibieroz04)</sup>|Model space vs Tangent space<sup>[Thibieroz04](#Thibieroz04)</sup>|Reconstruct z from xy(z = sqrt(1 - x<sup>2</sup> - y<sup>2</sup>))<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Placeres06](#Placeres06)</sup><br>If all the lighting is performed in view space, then the front-faced polygons are always gonig to have negative or positive Z components<sup>[Placeres06](#Placeres06)</sup>|
|Diffuse Albedo<sup>[Calver03](#Calver03)</sup><br><sup>[Hargreaves04](#Hargreaves04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Thibieroz04](#Thibieroz04)</sup><br><sup>[Andersson09](#Andersson09)</sup>|`R8G8B8A8`<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[Thibieroz04](#Thibieroz04)</sup>| | |
|Specular/Exponent Map<sup>[Calver03](#Calver03)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup>| | | |
|Emissive<sup>[Calver03](#Calver03)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup>| | | |
|Light Map<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>| | |
|Material ID<sup>[Calver03](#Calver03)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup>| | | |
|Roughness<sup>[Andersson09](#Andersson09)</sup>| | | |

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

### Example 2: Climax Studios GDC 2004 <sup>[Hargreaves04](#Hargreaves04)</sup>

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
<td>DS</td>
<td colspan="4" style="background-color:rgba(127, 127, 127, 0.5); color:white">Depth R32F</td>
</tr>
<tr>
<td>RT 0</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Norm.X R10F</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Norm.Y G10F</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Norm.Z B10F</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">Scattering A2F</td>
</tr>
<tr>
<td>RT 1</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Diffuse Albedo.R R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Diffuse Albedo.G G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Diffuse Albedo.B B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">Emissive Term A8</td>
</tr>
<tr>
<td>RT 2 (could be palettized)</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Material Parameters R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Material Parameters G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Material Parameters B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">
Material Parameters A8</td>
</tr>
</tbody>
</table>

### Example 3: ShaderX2<sup>[Thibieroz04](#Thibieroz04)</sup>

<table>
<thead>
<tr>
<td>MRTs</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">A8</td>
</tr>
</thead>
<tbody>
<tr>
<td>RT 0</td>
<td colspan="2" style="background-color:rgba(255, 0, 0, 0.5); color:white">Pos.X R16F</td>
<td colspan="2" style="background-color:rgba(0, 255, 0, 0.5); color:white">Pos.Y G16F</td>
</tr>
<tr>
<td>RT 1</td>
<td colspan="4" style="background-color:rgba(255, 0, 0, 0.5); color:white">Pos.Z R16F</td>
</tr>
<tr>
<td>RT 2</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Diffuse Albedo.R R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Diffuse Albedo.G G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Diffuse Albedo.B B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">
Normal.Z A8</td>
</tr>
<tr>
<td>RT 3</td>
<td colspan="2" style="background-color:rgba(255, 255, 255, 0.5); color:white">Normal.X A8</td>
<td colspan="2" style="background-color:rgba(127, 255, 255, 0.5); color:black">
Normal.Y L8</td>
</tr>
</tbody>
</table>

### Example 4: Killzone 2<sup>[Valient07](#Valient07)</sup>

<table>
<thead>
<tr>
<td>MRTs</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:black">A8</td>
</tr>
</thead>
<tbody>
<tr>
<td>DS</td>
<td colspan="3" style="background-color:rgba(127, 127, 127, 0.5); color:white">Depth 24bpp</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Stencil</td>
</tr>
<tr>
<td>RT 0</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Lighting Accumulation.R</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Lighting Accumulation.G</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Lighting Accumulation.B</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Intensity</td>
</tr>
<tr>
<td>RT 1</td>
<td colspan="2" style="background-color:rgba(255, 255, 0, 0.5); color:white">Normal.X FP16</td>
<td colspan="2" style="background-color:rgba(127, 127, 255, 0.5); color:white">
Normal.Y FP16</td>
</tr>
<tr>
<td>RT 2</td>
<td colspan="2" style="background-color:rgba(255, 255, 0, 0.5); color:white">Motion Vectors XY</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Spec-Power</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Spec-Intensity</td>
</tr>
<tr>
<td>RT 3</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Diffuse Albedo.R R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Diffuse Albedo.G G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Diffuse Albedo.B B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">
Sun-Occlusion A8</td>
</tr>
</tbody>
</table>

* Position computed from depth buffer and pixel coordinates
* Lighting accumulation - output buffer
* Intensity - luminance of Lighting accumulation
  * Scaled to range [0&hellip;2]
* Normal.z = sqrt(1.0f - Normal.x<sup>2</sup> - Normal.y<sup>2</sup>)
* Motion vectors - screen space
* Specular power - stored as log<sub>2</sub>(original)/10.5
  * High range and still high precision for low shininess
* Sun Occlusion - pre-rendered static sun shadows
  * Mixed with real-time sun shadow for higher quality

Analysis:
* Pros:
  * Highly packed data structure
  * Many extra attributes
  * Allows MSAA with hardware support
* Cons:
  * Limited output precision and dynamic range
    * Lighting accumulation in gamma space
    * Can use different color space (LogLuv)
  * Attribute packing and unpacking overhead

### Example 5: StarCraft II<sup>[FilionMcNaughton08](#FilionMcNaughton08)</sup>

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
<td colspan="3" style="background-color:rgba(127, 127, 127, 0.5); color:white">Unlit & Emissive R16G16B16F</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Unused</td>
</tr>
<tr>
<td>RT 1</td>
<td colspan="3" style="background-color:rgba(127, 127, 127, 0.5); color:white">Normal R16G16B16F</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Depth</td>
</tr>
<tr>
<td>RT 2</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Diffuse Albedo.R</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Diffuse Albedo.G</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Diffuse Albedo.B</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">AO</td>
</tr>
<tr>
<td>RT 3</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Specular Albedo.R</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Specular Albedo.G</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Specular Albedo.B</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Unused</td>
</tr>
</tbody>
</table>

* Depth values for lighting, fog volumes, dynamic AO, smart displacement, DoF, projections, edge detection, thickness measurement
* Normals for dynamic AO
* Diffuse and specular for lighting

# Overview

* Don't bother with any lighting while drawing scene geometry<sup>[Hargreaves04](#Hargreaves04)</sup>
* Render to a "fat" framebuffer format, using MRT to store data<sup>[Hargreaves04](#Hargreaves04)</sup>
  * Drawback of fat-format encoding is the reading speed<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
* Apply lighting as a 2D postprocess, using these buffers as input<sup>[Hargreaves04](#Hargreaves04)</sup>

## Geometry Phase

Each geometry shader is responsible for filling the G-Buffers with correct parameters.<sup>[Calver03](#Calver03)</sup>

The major advantage over the conventional real-time approach to Renderman style procedural textures is that the entire shader is devoted to generating output parameters and that it is run only once regardless of the number or types of lights affecting this surface (generating depth maps also requires the geometry shaders to be run but usually with much simpler functions).<sup>[Calver03](#Calver03)</sup>

Another advantage is that after this phase how the G-Buffer was filled is irrelevant, this allows for impostors and particles to be mixed in with normal surfaces and be treated in the same manner (lighting, fog, etc.).<sup>[Calver03](#Calver03)</sup>

Some portions of the light equation that stay constant can be computed here and stored in the G-Buffer if necessary, this can be used if you light model uses Fresnel (which are usually only based on surface normal and view directional).<sup>[Calver03](#Calver03)</sup>

### Killzone 2<sup>[Valient07](#Valient07)</sup>

```
Fill the G-Buffer with all geometry (static, skinned, etc.)
  Write depth, motion, specular, etc. properties
Initialize light accumulation buffer with pre-baked light
  Ambient, Incandescence, Constant specular
  Lightmaps on static geometry
    YUV color space, S3TC5 with Y in Alpha
    Sun occlusion in B channel
    Dynamic range [0...2]
  Image based lighting on dynamic geometry
```

#### Light Accumulation Pass<sup>[Valient07](#Valient07)</sup>

* Light is rendered as convex geometry
  * Point light - sphere
  * Spot light - cone
  * Sun - full-screen quad

```
For each light:
  Find and mark visible lit pixels
  If light contributes to screen
    Render shadow map
    Shade lit pixels and add to framebuffer
```

## Lighting Phase

The real power of deferred lighting is that lights are first class citizens, this complete separation of lighting and geometry allows lights to be treated in a totally different way from standard rendering. This makes the artist’s job easier as there is less restrictions on how lights affect surfaces, this allows for easy customizable lighting rigs.<sup>[Calver03](#Calver03)</sup>

Light shaders have access to the parameters stored in the G-Buffer at each pixel they light.<sup>[Calver03](#Calver03)</sup>

```
Render convex bounding geometry
Read G-Buffer
Compute radiance
Blend into frame buffer
```
<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>

* Keep diffuse and specular separate

```
For each light:
  diffuse += diffuse(GBuffer.N, L)
  specular += GBuffer.spec * specular(GBuffer.N, GBuffer.P, L)
```
<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>

* Final full-screen pass modulates diffuse color:

```
framebuffer = diffuse * GBuffer.diffuse + specular
```
<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>

### Pre-Tiled Shading

#### Full screen lights

For lights that are truly global and have no position and size (ambient and directional are the traditional types), we create a full screen quad that executes the pixel shader at every pixel.<sup>[Calver03](#Calver03)</sup><sup>[Hargreaves04](#Hargreaves04)</sup>

Global directional lights has little benefit in using deferred rendering methods on them, and it would actually be slower to resample the deferred buffers again for the entire screen.<sup>[FilionMcNaughton08](#FilionMcNaughton08)</sup>

#### Shaped lights

Shaped lights can be implemented via a full screen quad in exactly the same way of directional lights just with a different algorithm computing the lights direction and attenuation, but the attenuation allows us to pre-calculate where the light no longer makes any contribution.<sup>[Calver03](#Calver03)</sup>

> #### Optimization<sup>[Calver03](#Calver03)</sup><br>
> The attenuation model I use is a simple texture lookup based on distance. The distance is divided by the maximum distance that the light can possible effect and then this is used to lookup a 1D texture. The last texel should be 0, (no constant term) if the following optimisations are to be used.

> #### Optimization<sup>[Placeres06](#Placeres06)</sup><br>
> Shade only the pixels influenced by the bounding object involves rendering a full screen quad, but enabling clipping and rejection features to discard many noninfluenced pixels. This requires dynamic branching.

#### Light Volumes

We create a mesh that encloses the light affecting volume with any pixels found to be in the interior of the volume executing the light shader.<sup>[Calver03](#Calver03)</sup><sup>[Hargreaves04](#Hargreaves04)</sup>

1. Each pixel most be hit once and once only. If the light volume causes the light shader to be executed more than once it will be equivalent to having n lights affecting this pixel.<sup>[Calver03](#Calver03)</sup>
2. The near and far clip planes must not effect the projected shape. We need the projected geometry not to be clipped at the near and far plane as this will cause holes in our lights.<sup>[Calver03](#Calver03)</sup>

* Spot Light<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
  * Cone
* Point Light<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
  * Sphere
* Direction Light<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
  * Quad or Box

For convex volumes the first problem is completely removed by just using back or front face culling.<sup>[Calver03](#Calver03)</sup><sup>[Hargreaves04](#Hargreaves04)</sup>

We can’t remove the near plane, but we can effectively remove the far plane by placing it at infinity.<sup>[Calver03](#Calver03)</sup>

Convex volumes cover the vast majority of lights shaders (e.g. spheres for point lights, cones for spotlights, etc.) and we can adapt them to use the fast z-reject hardware that is usually available.<sup>[Calver03](#Calver03)</sup>

Dealing with the light volume rendering:<sup>[Hargreaves04](#Hargreaves04)</sup>

1. Camera is outside the light bounding mesh
   * Simple back face culling (each pixel most be hit once and once only)
2. Camera is inside the light bounding mesh
   * Draw backfaces
3. Light volume intersects the far clip plane
   * Draw frontfaces 
4. Light volume intersects both near and far clip planes
   * Light is too big

#### Optimizations

S.T.A.L.K.E.R case:<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
* Hierarchical occlusion culling system
  * Coarsest test: Sector-portal culling followed by CPU-based occlusion culling
  * DX9's occlusion query to eliminate the completely occluded lights
  * Stencil mask to tag affected pixels for each light
* [Sun optimization](#sun-rendering)

```
Pass 0: Render full-screen quad only where 0x03==stencil count
        (where attributes are stored)
  If ((N dot L) * ambient_occlusion_term > 0)
    discard fragment
  Else
    color = 0, stencil = 0x01
Pass 1: Render full-screen quad only where 0x03==stencil count
  Perform light accumulation / shading 
```
<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>

1. Social Stage:<sup>[Placeres06](#Placeres06)</sup>
   * Filter the lights and effects on the scene to produce a smaller list of sources to be processed
   1. Execute visiblity and occlusion algorithms to discard lights whose influence is not appreciable
   2. Project visible sources bounding objects into screen space
   3. Combine similar sources that are too close in screen space or influence almost the same screen area
   4. Discard sources with a tiny contribution because of their projected bounding object being too small or too far
   5. Check that more than a predefined number of sources do not affect each screen region. Choose the biggest, strongest, and closer sources.
2. Individual Stage:<sup>[Placeres06](#Placeres06)</sup>
   * Global Sources
     * Most fill-rate expensive
     1. Enable the appropriate shaders
     2. Render a quad covering the screen 
   * Local Sources
   1. Select the appropriate [level of detail](#PlaceresLoD).
   2. Enable and configure the source shaders
   3. Compute the minimum and maximum screen cord values of the projected bounding object
   4. Enable the scissor test
   5. Enable the clipping planes
   6. Render a screen quad or the bounding object

* Only shade the area where the light volume intersects scene geometry<sup>[Hargreaves04](#Hargreaves04)</sup> Only shade surfaces inside light volume!!<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
  * Light volume Z Tests
    1. Drawing light volume backfaces
       * Use `D3DCMP_GREATER` to reject "floating in the air" portions of the light
    2. Drawing frontfaces
       * Use `D3DCMP_LESS` to reject "buried underground" light regions
  * Tabula Rasa uses "greater" depth test and "clockwise" winding(inverted winding)<sup>[Koonce07](#Koonce07)</sup>
    * Light volumes in Tabula Rasa never get clipped by the far clip plane
* StarCraft II case:<sup>[FilionMcNaughton08](#FilionMcNaughton08)</sup>
  * Early-Z to reduce cost of hidden lights
  * Early stencil to reduce cost of objects behind light that are not lit by it

Other optimizations:

* Clipping<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
* Occlusion query<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
* Z-Cull<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>

##### Stencil Cull

1. Render light volume with color write disabled<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
   * Depth Func = LESS, Stencil Func = ALWAYS
   * Stencil Z-FAIL = REPLACE (with value X)
   * Rest of stencil ops set to KEEP 
2. Render with lighting shader<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
   * Depth Func = ALWAYS, Stencil Func = EQUAL, all ops = KEEP, Stencil Ref = X
   * Unlit pixels will be culled because stencil will not match the reference value
* Only regions that fail depth test represent objects within the light volume<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>

Killzone 2 case:<sup>[Valient07](#Valient07)</sup>
* Marks pixels in front of the far light boundary
  * Render back-faces of light volume
  * Depth test GREATER-EQUAL
  * Write to stencil on depth pass
  * Skipped for very small distant lights
* Find amount of lit pixels inside the volume
  * Start pixel query
  * Render front faces of light volume
  * Depth test LESS-EQUAL
  * Don't write anything - only EQUAL stencil test
* Rendering:
  * Render front-faces of light volume
    * Depth test - LESS-EQUAL
    * Stencil test - EQUAL
    * Runs only on marked pixels inside light
* If light is "very small"
  * Don't do any stencil marking

##### Light Shader Occlusion Optimisations

The basis of using occlusion culling with light shaders is that the depth buffer used for the creation of the G-Buffer is available at no cost (this is only true if the resolution of the G-Buffer is the same as destination colour buffer and that we are using the same projection matrix for the geometry shaders and light shaders).<sup>[Calver03](#Calver03)</sup>

I simply turn off the occlusion culling if the light shader hits the near plane and just render the back faces without depth testing. Its means some pixels run the pixel shader unnecessarily but it’s very cheap on the CPU and the actual difference is usually only a few pixels.<sup>[Calver03](#Calver03)</sup>

### Tiled Shading

1. Divide the screen into a grid<sup>[BalestraEngstad08](#BalestraEngstad08)</sup>
2. Find which lights intersect each cell<sup>[BalestraEngstad08](#BalestraEngstad08)</sup>
   * +How many lights<sup>[Andersson09](#Andersson09)</sup> 
3. Render quads over each cell calculating up to 8 lights per pass<sup>[BalestraEngstad08](#BalestraEngstad08)</sup>
  * Results in a light buffer
  * Only apply the visible light sources on pixels in each tile<sup>[Andersson09](#Andersson09)</sup>

Computer Shader Steps:<sup>[Andersson09](#Andersson09)</sup>
<ul>
  <li>
    Requiresments & setup
    <ul>
      <li>Input data is gbuffers, depth buffer & light constants</li>
      <li>Output is fully composited & lit HDR texture</li>
      <li>1 thread per pixel, 16 x 16 thread groups (aka tile)</li>
      <li><pre><code>Texture2D&lt;float4&gt; gbufferTexture1 : register(<span class="hljs-built_in">t0</span>);
Texture2D&lt;float4&gt; gbufferTexture2 : register(<span class="hljs-built_in">t1</span>);
Texture2D&lt;float4&gt; gbufferTexture3 : register(<span class="hljs-built_in">t2</span>);
Texture2D&lt;float4&gt; depthTexture : register(<span class="hljs-built_in">t3</span>);<br><br>RWTexture2D&lt;float4&gt; outputTexture : register(u0)<span class="hljs-comment">;</span><br><br>#define BLOCK_SIZE (16)<br><br>[numthreads(<span class="hljs-keyword">BLOCK_SIZE, </span><span class="hljs-keyword">BLOCK_SIZE, </span><span class="hljs-number">1</span>)]
void csMain(<br>  uint3 groupId : SV_GroupID,<br>  uint3 groupThreadId : SV_GroupThreadID,<br>  uint groupIndex : SV_GroupIndex,<br>  uint3 <span class="hljs-keyword">dispatchThreadId </span>: SV_DispatchThreadID
)
{<br>  &hellip;
}
</code></pre></li>
    </ul>
  </li>
</ul>
<ol>
<li>Load gbuffers & depth</li>
<li>
Calculate min & max z in threadgroup / tile
  <ul>
  <li>Using <code>InterlockedMin</code>/<code>Max</code> on <code>groupshared</code> variable</li>
  <li>Atomics only work on ints</li>
  <li>But casting works (z is always +) </li>
  <li><strong>Can skip if we could resolve out min & max z to a texture directly using HiZ / Z Culling</strong></li>
  <li><pre><code class="lang-c">groupshared uint minDepthInt;
  groupshared uint maxDepthInt;

  // --- globals above, function below -------

  float depth = depthTexture.Load(uint3(texCoord, 0)).r;
  uint depthInt = asuint(depth);

  minDepthInt = 0xFFFFFFFF</span>;
  maxDepthInt = 0;
  GroupMemoryBarrierWithGroupSync();

  InterlockedMin(minDepthInt, depthInt);
  InterlockedMax(maxDepthInt, depthInt);

  GroupMemoryBarrierWithGroupSync();

  float minGroupDepth = asfloat(minDepthInt);
  float maxGroupDepth = asfloat(maxDepthInt);
  </code></pre>
  </li>
  </ul>
</li>
<li>
  Determine visible light sources for each tile
  <ul>
    <li>
      Cull all light sources against tile "frustum"
      <ul>
        <li>Light sources can either naively be all light sources in the scene, or CPU frustum culled potentially visible light sources</li>
      </ul>
    </li>
    <li>
      Output for each tile is:
      <ul>
        <li># of visible light sources</li>
        <li>Index list of visible light sources</li>
        <li>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Lights</th>
                <th>Indices</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Global list</th>
                <td>1000+</td>
                <td>0 1 2 3 4 5 6 7 8 &hellip;</td>
              </tr>
              <tr>
                <th>Tile visible list</th>
                <td>~0-40+</td>
                <td>0 2 5 6 8 &hellip;</td>
              </tr>
            </tbody>
          </table>
        </li>
        <li>Key part of the algorithm and compute shader</li>
        <li>
        Each thread switches to process light sources instead of a pixel
        <ul>
          <li>Wow, parallelism switcheroo!</li>
          <li>256 light sources in parallel per tile</li>
          <li>Multiple iterations for >256 lights</li>
        </ul>
        </li>
        <li>
        Intersect light source & tile
        <ul>
          <li>Many variants dep. on accuracy requirements & performance</li>
          <li>Tile min & max z is used as a shader "depth bounds" test</li>
        </ul>
        </li>
        <li>
        For visible lights, append light index to index list
        <ul>
          <li>Atomic add to threadgroup shared memory. "inlined stream compaction"</li>
          <li>Prefix sum + stream compaction should be faster than atomics, but more limiting</li>
        </ul>
        </li>
        <li>
        Synchronize group & switch back to processing pixels
        <ul>
          <li>We now know which light sources affect the tile</li>
        </ul>
        </li>
      </ul>
    </li>
    <li><pre><code class="lang-c">struct Light
{
    <span class="hljs-type">float3</span> pos;
    <span class="hljs-type">float</span> sqrRadius;
    <span class="hljs-type">float3</span> color;
    <span class="hljs-type">float</span> invSqrRadius;
};
<span class="hljs-type">int</span> lightCount;
StructuredBuffer&lt;Light&gt; lights;

groupshared <span class="hljs-type">uint</span> visibleLightCount = <span class="hljs-number">0</span>;
groupshared <span class="hljs-type">uint</span> visibleLightIndices[<span class="hljs-number">1024</span>];

<span class="hljs-comment">// ----- globals above, cont. function below ---------</span>

<span class="hljs-type">uint</span> threadCount = BLOCK_SIZE * BLOCK_SIZE;
<span class="hljs-type">uint</span> passCount = (lightCount + threadCount - <span class="hljs-number">1</span>) / threadCount;

<span class="hljs-keyword">for</span> (<span class="hljs-type">uint</span> passIt = <span class="hljs-number">0</span>; passIt &lt; passCount; ++passIt)
{
    <span class="hljs-type">uint</span> lightIndex = passIt * threadCount + groupIndex;

    <span class="hljs-comment">// prevent overrun by clmaping to a last "null" light</span>
    lightIndex = <span class="hljs-built_in">min</span>(lightIndex, lightCount);

    <span class="hljs-keyword">if</span> (intersects(lights[lightIndex], tile))
    {
        <span class="hljs-type">uint</span> <span class="hljs-keyword">offset</span>;
        InterlockedAdd(visibleLightCount, <span class="hljs-number">1</span>, <span class="hljs-keyword">offset</span>);
        visibleLightIndices[<span class="hljs-keyword">offset</span>] = lightIndex;
    }
}

GroupMemoryBarrierWithGroupSync();
</code></pre>
</li>
  </ul>
</li>
<li>
For each pixel, accumulate lighting from visible lights
  <ul>
    <li>Read from tile visible light index list in threadgroup shared memory</li>
    <li><pre><code class="lang-c">float3 <span class="hljs-keyword">diffuseLight </span>= <span class="hljs-number">0</span>;
float3 specularLight = <span class="hljs-number">0</span>;

for (uint lightIt = <span class="hljs-number">0</span>; lightIt &lt; visibleLightCount; ++lightIt)
{<br>  uint lightIndex = visibleLightIndices[lightIt]<span class="hljs-comment">;</span><br>  Light light = lights[lightIndex]<span class="hljs-comment">;</span><br><br>  evaluateAndAccumulateLight(<br>    light,<br>    gbufferParameters,<br>    diffuseLight,<br>    specularLight<br>  );
}
</code></pre>
</li>
  </ul>
</li>
<li>
  Combine lighting & shading albedos / parameters
  <ul>
    <li>Output is non-MSAA HDR texture</li>
    <li>Render transparent surfaces on top</li>
  </ul>
</li>
</ol>

* Advantages:<sup>[Andersson09](#Andersson09)</sup>
  * Constant & absolute minimal bandwith
    * Read gbuffers & depth once!
  * Doens't need intermediate light buffers
    * Can take a lot of memory with HDR, MSAA & color specular
  * Scales up to huge amount of big overlapping light sources
    * Fine-grained culling (16 &times; 16)
    * Only ALU cost, good future scaling
    * Could be useful for accumulating VPLs
* Disadvantages:<sup>[Andersson09](#Andersson09)</sup>
  * ~~Requires DX 11 HW~~
    * ~~CS 4.0 / 4.1 difficult due to atomics & scattered `groupshared` writes~~
  * Culling overhead for small light sources
    * Can accumulate them using standard light volume rendering
    * Or separate CS for tile-classific
  * Potentially performance
    * MSAA texture loads / UAV writing might be slower then standard PS
  * Can't output to MSAA texture
    * DX11 CS UAV limitation

### Optimizations

The most important optimization for the lighting pass is to render only those lights that actually affect the final image, and for those lights, render only the affected pixels.<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>

1. Social Stage:
   * Filter the lights and effects on the scene to produce a smaller list of sources to be processed
   1. Execute visiblity and occlusion algorithms to discard lights whose influence is not appreciable
   2. ~~Project visible sources bounding objects into screen space~~
   3. ~~Combine similar sources that are too close in screen space or influence almost the same screen area~~
   4. Discard sources with a tiny contribution because of their projected bounding object being too small or too far
   5. ~~Check that more than a predefined number of sources do not affect each screen region. Choose the biggest, strongest, and closer sources.~~
2. Individual Stage:
   1. Select the appropriate [level of detail](#PlaceresLoD).
   2. Enable and configure the source shaders
   3. ~~Compute the minimum and maximum screen cord values of the projected bounding object~~
   4. ~~Enable the scissor test~~
   5. ~~Enable the clipping planes~~
   6. ~~Render a screen quad or the bounding object~~

#### Sun Rendering

S.T.A.L.K.E.R case:<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
* Skybox doesn't need to be shaded
* Pixels facing away from the sun don't need to have complex shading applied
* Pixels with AO term of 0 can also be excluded from processing

Killzone 2 case:<sup>[Valient07](#Valient07)</sup>
* Stencil mark potentially lit pixels
  * Use only sun occlusion from G-Buffer

#### Level of Detail Lighting

<div id="PlaceresLoD">
* LoD to decide how many instructions per pixel:<sup>[Placeres06](#Placeres06)</sup>
  * Closest: Perform both diffuse and specular
  * Normal: Diffuse + Specular * t
  * Far: Diffuse
</div>

## Shadows

### Shadow Maps

The key is using the little used variant known as forward shadow mapping. With forward shadow mapping the objects position is projected into shadow map space and then depths compared there.<sup>[Calver03](#Calver03)</sup><sup>[Thibieroz04](#Thibieroz04)</sup>

The first step is to calculate the shadow map; this is exactly the same as a conventional renderer.<sup>[Calver03](#Calver03)</sup>

When the light that generated the shadow map is rendered, the shadow map is attached to the light shader in the standard fashion (a cube map for the point light case).<sup>[Calver03](#Calver03)</sup>

* Point Light Shadow Maps
  * Cube maps<sup>[Koonce07](#Koonce07)</sup>
* Else
  * 2D textures<sup>[Koonce07](#Koonce07)</sup>
* All textures are floating-point textures, multisample jitter sampling to smooth out the shadows.<sup>[Koonce07](#Koonce07)</sup>

* Static shadow lights are built only once and reused each frame<sup>[Koonce07](#Koonce07)</sup>
* Dynamic shadow maps are rebuilt each frame<sup>[Koonce07](#Koonce07)</sup>
* By flagging geometry as static or dynamic, static shadow maps can cull out dynamic geometries<sup>[Koonce07](#Koonce07)</sup>

### Efficient Omni Lights

Three major options:<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
* Using a cube map for storing distance from the light center, R32F or R8G8B8A8 packed
* Using a 2D surface with "unrolled" cube-map faces, with reindexing done through a small cube map (called *virtual shadow depth* cube texture)
* Treating the point light as six spotlights and rendering each separately

| |Cube Map|Virtual Shadow Depth Cube Texture|Six Spotlights|
|---|------|---------------------------------|--------------|
|Scalability and Continuity|Low<br>Few Fixed sizes<br>All faces are the same|Moderate<br>Faces can be of different sizes, but only from a few fixed sets|Excellent<br>Any variation of sizes is possible|
|Hardware Filtering Support|No|Yes|Yes|
|Cost of Filtering|Moderate|Excellent for bilinear<br>Moderate for arbitrary percentage-closer filtering|Excellent|
|Render Target Switches|Six|One|One|
|Packing Support|No|Yes|Yes|
|Cost of Screen Space Stencil Masking|Low|Low|Moderate<br>Some stencil overdraw|
|Memory Cost and Bandwidth Usage|High<br>Surface is almost unusuable for everything else|Moderate<br>Few fixed sizes limits packing ability|Excellent|
<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>

## Post Processing Phase

* Glow
* Auto-Exposure
* Distortion
* Edge-smoothing
* Fog

### HDR

Render your scene to multiple 32 bit buffers, then use a 64 bit accumulation buffer during the light phase.<sup>[Hargreaves04](#Hargreaves04)</sup>

# Issues

## Transparency

The best (in speed terms) we can do currently is to fall-back to a non-deferred lighting system for transparent surfaces and blend them in post-processing.<sup>[Calver03](#Calver03)</sup><sup>[Hargreaves04](#Hargreaves04)</sup>

Depth peeling is the ultimate solution, but is prohibitively expensive at least for the time being.<sup>[Hargreaves04](#Hargreaves04)</sup>

StarCraft II uses multipass forward approach:<sup>[FilionMcNaughton08](#FilionMcNaughton08)</sup>
* Proved to be more scalable
* No need for more than a single shadow map buffer for the local lighting

StarCraft II's simple layered system:
1. Opaque Pass
   1. Create depth map from opaque objects
   2. Render opaque objects
   3. Apply depth-dependent post-processing effects
2. Transparency Pass
   1. Render transparent objects back to front
   2. Key transparencies are allowed to perform pre-pass where they overwrite the g-buffer
      * Since all post-processing on previous g-buffer data has been applied, that information is no longer needed
   3. Update AO deferred buffer
   4. Render the transparency
   5. Perform DoF pass on the areas covered by the transparency

## Memory

No solutions but a warning that deferred lighting has a number of large render-targets.<sup>[Calver03](#Calver03)</sup>

## Anti-Aliasing

* Super sampling lighting is a costly option<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
* Filter object edges<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>

Antialiasing becomes solely the responsibility of the application and the shader; we cannot rely on the GPU alone.<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>

### Edge Detection

Edge-smoothing filter by [Fabio05](https://www.gamedevs.org/uploads/deferred-shading-tutorial.pdf).<sup>[Placeres06](#Placeres06)</sup>:

1. Edge-detection scan is applied to the screen. The filter uses discontinuities in the positions and normal stored in the GBuffer. The results can be stored in the stencil buffer as a mask for the next step.
2. The screen is blurred using only the pixels that are edges
   * These pixels are masked in the stencil buffer
   * However, color bleeding can occur (e.g., background color bleeding into the character) 
   * Thus, a kernel is applied to the edge pixels, but only the closest to the camera are combined
   * [Cloor bleeding reduction](https://developer.amd.com/wordpress/media/2012/10/Scheuermann_DepthOfField.pdf)

#### S.T.A.L.K.E.R.<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>

Our solution was to trade some signal frequency at the discontinuities for smoothness, and to leave other parts of the image intact. We detect discontinuities in both depth and normal direction by taking 8+1 samples of depth and finding how depth at the current pixel differs from the ideal line passed through opposite corner points. The normals were used to fix issues such as a wall perpendicular to the floor, where the depth forms a perfect line (or will be similar at all samples) but an aliased edge exists. The normals were processed in a similar cross-filter manner, and the dot product between normals was used to determine the presence of an edge.

```
struct v2p  
{    
  float4 tc0: TEXCOORD0; // Center    
  float4 tc1: TEXCOORD1; // Left Top      
  float4 tc2: TEXCOORD2; // Right Bottom    
  float4 tc3: TEXCOORD3; // Right Top    
  float4 tc4: TEXCOORD4; // Left Bottom      
  float4 tc5: TEXCOORD5; // Left / Right    
  float4 tc6: TEXCOORD6; // Top /Bottom  
};      

/////////////////////////////////////////////////////////////////////  
uniform sampler2D s_distort;  
uniform half4 e_barrier;  // x=norm(~.8f), y=depth(~.5f)  
uniform half4 e_weights;  // x=norm, y=depth  
uniform half4 e_kernel;   // x=norm, y=depth    
/////////////////////////////////////////////////////////////////////  

half4 main(v2p I) : COLOR  
{   
  // Normal discontinuity filter   
  half3 nc = tex2D(s_normal, I.tc0);   
  half4 nd;   
  nd.x = dot(nc, (half3)tex2D(s_normal, I.tc1));   
  nd.y = dot(nc, (half3)tex2D(s_normal, I.tc2));   
  nd.z = dot(nc, (half3)tex2D(s_normal, I.tc3));   
  nd.w = dot(nc, (half3)tex2D(s_normal, I.tc4));   
  nd -= e_barrier.x;   
  nd = step(0, nd);   
  half ne = saturate(dot(nd, e_weights.x));     

  // Opposite coords     
  float4 tc5r = I.tc5.wzyx;   
  float4 tc6r = I.tc6.wzyx;     
  
  // Depth filter : compute gradiental difference:   
  // (c-sample1)+(c-sample1_opposite)   
  half4 dc = tex2D(s_position, I.tc0);   
  half4 dd;   
  dd.x = (half)tex2D(s_position, I.tc1).z +          
    (half)tex2D(s_position, I.tc2).z;   
  dd.y = (half)tex2D(s_position, I.tc3).z +          
    (half)tex2D(s_position, I.tc4).z;   
  dd.z = (half)tex2D(s_position, I.tc5).z +          
    (half)tex2D(s_position, tc5r).z;   
  dd.w = (half)tex2D(s_position, I.tc6).z +          
    (half)tex2D(s_position, tc6r).z;   
  dd = abs(2 * dc.z - dd)- e_barrier.y;   
  dd = step(dd, 0);   
  half de = saturate(dot(dd, e_weights.y));     
  
  // Weight     
  half w = (1 - de * ne) * e_kernel.x; 
  // 0 - no aa, 1=full aa     
  // Smoothed color   
  // (a-c)*w + c = a*w + c(1-w)   
  float2 offset = I.tc0 * (1-w);   
  half4 s0 = tex2D(s_image, offset + I.tc1 * w);   
  half4 s1 = tex2D(s_image, offset + I.tc2 * w);   
  half4 s2 = tex2D(s_image, offset + I.tc3 * w);   
  half4 s3 = tex2D(s_image, offset + I.tc4 * w);   
  return (s0 + s1 + s2 + s3)/4.h;  
} 
```

#### Tabula Rasa<sup>[Koonce07](#Koonce07)</sup>

Modified S.T.A.L.K.E.R.'s algorithm to be resolution independent.

We looked at changes in depth gradients and changes in normal angles by sampling all eight neighbors surrounding a pixel. We compare the maximum change in depth to the minimum change in depth to determine how much of an edge is present. By comparing relative changes in this gradient instead of comparing the gradient to fixed values, we are able to make the logic resolution independent.

We compare the changes in the cosine of the angle between the center pixel and its neighboring pixels along the same edges at which we test depth gradients.

The output of the edge detection is a per-pixel weight between zero and one. The weight reflects how much of an edge the pixel is on. We use this weight to do four bilinear samples when computing the final pixel color. The four samples we take are at the pixel center for a weight of zero and at the four corners of the pixel for a weight of one. This results in a weighted average of the target pixel with all eight of its neighbors.

```
////////////////////////////    // Neighbor offset table    ////////////////////////////    
const static float2 offsets[9] = 
{   
  float2( 0.0,  0.0), //Center       0    
  float2(-1.0, -1.0), //Top Left     1    
  float2( 0.0, -1.0), //Top          2    
  float2( 1.0, -1.0), //Top Right    3    
  float2( 1.0,  0.0), //Right        4    
  float2( 1.0,  1.0), //Bottom Right 5    
  float2( 0.0,  1.0), //Bottom       6    
  float2(-1.0,  1.0), //Bottom Left  7    
  float2(-1.0,  0.0)  //Left         8 
}; 

float DL_GetEdgeWeight(in float2 screenPos) 
{   
  float Depth[9];   
  float3 Normal[9];   
  
  //Retrieve normal and depth data for all neighbors.    
  for (int i=0; i<9; ++i)   
  {     
    float2 uv = screenPos + offsets[i] * PixelSize;     
    Depth[i] = DL_GetDepth(uv);   //Retrieves depth from MRTs

    Normal[i]= DL_GetNormal(uv);  //Retrieves normal from MRTs 
  }   
  
  //Compute Deltas in Depth.    
  float4 Deltas1;   
  float4 Deltas2;   
  Deltas1.x = Depth[1];   
  Deltas1.y = Depth[2];   
  Deltas1.z = Depth[3];   
  Deltas1.w = Depth[4];   
  Deltas2.x = Depth[5];   
  Deltas2.y = Depth[6];   
  Deltas2.z = Depth[7];   
  Deltas2.w = Depth[8];   
  
  //Compute absolute gradients from center.   
  Deltas1 = abs(Deltas1 - Depth[0]);   
  Deltas2 = abs(Depth[0] - Deltas2);   
  
  //Find min and max gradient, ensuring min != 0    
  float4 maxDeltas = max(Deltas1, Deltas2);   
  float4 minDeltas = max(min(Deltas1, Deltas2), 0.00001);   
  
  // Compare change in gradients, flagging ones that change    
  // significantly.    
  // How severe the change must be to get flagged is a function of the    
  // minimum gradient. It is not resolution dependent. The constant    
  // number here would change based on how the depth values are stored    
  // and how sensitive the edge detection should be.    
  float4 depthResults = step(minDeltas * 25.0, maxDeltas);   
  
  //Compute change in the cosine of the angle between normals.   
  Deltas1.x = dot(Normal[1], Normal[0]);   
  Deltas1.y = dot(Normal[2], Normal[0]);   
  Deltas1.z = dot(Normal[3], Normal[0]);   
  Deltas1.w = dot(Normal[4], Normal[0]);   
  Deltas2.x = dot(Normal[5], Normal[0]);   
  Deltas2.y = dot(Normal[6], Normal[0]);   
  Deltas2.z = dot(Normal[7], Normal[0]);   
  Deltas2.w = dot(Normal[8], Normal[0]);   
  Deltas1 = abs(Deltas1 - Deltas2);   
  
  // Compare change in the cosine of the angles, flagging changes   
  // above some constant threshold. The cosine of the angle is not a    
  // linear function of the angle, so to have the flagging be    
  // independent of the angles involved, an arccos function would be    
  // required.    
  float4 normalResults = step(0.4, Deltas1);   
  normalResults = max(normalResults, depthResults);   
  
  return (normalResults.x + normalResults.y +           
    normalResults.z + normalResults.w) * 0.25; 
} 
```

### MSAA

* Run light shader at pixel resolution<sup>[Valient07](#Valient07)</sup>
  * Read G-Buffer for both pixel samples
  * Compute lighting for both samples
  * Average results and add to frame buffer

---

# References

## 2003

<a id="Calver03" href="https://www.beyond3d.com/content/articles/19/1">Photo-realistic Deferred Lighting</a>. [Dean Calver](https://www.linkedin.com/in/deanoc/details/experience/), [Climax](https://www.climaxstudios.com/). [Beyond3D](https://www.beyond3d.com/).

## 2004

<a id="Hargreaves04" href="https://my.eng.utah.edu/~cs5600/slides/Wk%209%20D3DTutorial_DeferredShading.pdf">Deferred Shading</a>. [Shawn Hargreaves](https://shawnhargreaves.com/), [Climax](https://www.climaxstudios.com/). [GDC 2004](https://www.gdcvault.com/free/gdc-04/)<BR>
<a id="HargreavesHarris04" href="http://download.nvidia.com/developer/presentations/2004/6800_Leagues/6800_Leagues_Deferred_Shading.pdf">Deferred Shading</a>. [Shawn Hargreaves](https://shawnhargreaves.com/), [Climax](https://www.climaxstudios.com/). [Mark Harris](https://www.linkedin.com/in/themarkharris/), [NVIDIA](https://www.nvidia.com/en-us/). NVIDIA Developers Conference 2004.<br>
<a id="Thibieroz04" href="https://gitea.yiem.net/QianMo/Real-Time-Rendering-4th-Bibliography-Collection/raw/branch/main/Chapter%201-24/[1762]%20[ShaderX2%202004]%20Deferred%20Shading%20with%20Multiple%20Render%20Targets.pdf">Deferred Shading with Multiple Render Targets</a>. [Nicolas Thibieroz](https://www.linkedin.com/in/nicolas-thibieroz-a4353739/), [PowerVR Technologies](https://www.imaginationtech.com/products/gpu/). [ShaderX2](http://www.shaderx2.com/).

## 2005

<a id="Shishkovtsov05" href="https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows/chapter-9-deferred-shading-stalker">Deferred Shading in S.T.A.L.K.E.R.</a>. [Oleksandr Shyshkovtsov](https://www.linkedin.com/in/olesshishkovtsov/), [GSC Game World](https://www.gsc-game.com/). [GPU Gems 2](https://developer.nvidia.com/gpugems/gpugems2/inside-front-cover).

## 2006

<a id="Placeres06" href="https://gitea.yiem.net/QianMo/Real-Time-Rendering-4th-Bibliography-Collection/raw/branch/main/Chapter%201-24/[1420]%20[ShaderX5%202006]%20Overcoming%20Deferred%20Shading%20Drawbacks.pdf">Overcoming Deferred Shading Drawbacks</a>. [Frank Puig Placeres](https://www.linkedin.com/in/frank-puig-placeres-454b1633/), [University of Informatic Sciences](https://www.uci.cu/en). [ShaderX5](http://www.shaderx5.com/).

## 2007

<a id="Koonce07" href="https://developer.nvidia.com/gpugems/gpugems3/part-iii-rendering/chapter-19-deferred-shading-tabula-rasa">Deferred Shading in Tabula Rasa</a>. [Rusty Koonce](https://www.linkedin.com/in/rusty-koonce-9654819/), [NCSoft Corporation](https://kr.ncsoft.com/en/index.do). [GPU Gems 3](https://developer.nvidia.com/gpugems/gpugems3/foreword).<br>
<a id="Valient07" href="https://www.guerrilla-games.com/read/deferred-rendering-in-killzone-2">Deferred Rendering in Killzone 2</a>. [Michal Valient](https://www.linkedin.com/in/valient/), [Guerilla Games](https://www.guerrilla-games.com/). Developer Conference 2007.

## 2008

<a id="BalestraEngstad08" href="https://www.gdcvault.com/play/325/The-Technology-of-UNCHARTED-DRAKE">The Technology of Uncharted: Drake's Fortune</a>. [Christophe Balestra](https://www.linkedin.com/in/christophe-balestra-37bb41/), [Naughty Dog](https://www.naughtydog.com/). [Pål-Kristian Engstad](https://www.linkedin.com/in/p%C3%A5l-kristian-engstad-08a22a1/), [Naughty Dog](https://www.naughtydog.com/). [GDC 2008](https://www.gdcvault.com/free/gdc-08/).<br>
<a id="FilionMcNaughton08" href="https://developer.amd.com/wordpress/media/2013/01/Chapter05-Filion-StarCraftII.pdf">StarCraft II: Effects & Techniques</a>. [Dominic Filion](https://www.linkedin.com/in/%E2%80%8Edominic-filion-guay-258202/), [Blizzard Entertainment](https://www.blizzard.com/en-us/). [Rob McNaughton](https://www.linkedin.com/in/rob-mcnaughton-4872453/), [Blizzard Entertainment](https://www.blizzard.com/en-us/). [SIGGRAPH 2008: Advances in Real-Time Rendering in 3D Graphics and Games Course](https://advances.realtimerendering.com/)

## 2009

<a id="Andersson09" href="https://www.ea.com/frostbite/news/parallel-graphics-in-frostbite-current-future">Parallel Graphics in Frostbite - Current Future</a>. [Johan Andersson](https://www.linkedin.com/in/repii/), [DICE](https://www.dice.se/). 
SIGGRAPH 2009: Beyond Programmable Shading Course