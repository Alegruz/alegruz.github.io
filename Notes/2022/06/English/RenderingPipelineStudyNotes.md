# Rendering Pipeline Study Notes (2022.06.03)
[Home](../../../../README.md)

# References

## SIGGRAPH: Advances in Real-Time Rendering in Games

* 2008
    * [Starcraft II: Effects and Techniques](https://developer.amd.com/wordpress/media/2013/01/Chapter05-Filion-StarCraftII.pdf). Dominic Filion, Blizzard. Rob McNaughton, Blizzard Entertainment.
* 2015
    * [GPU-Driven Rendering Pipelines](https://advances.realtimerendering.com/s2015/aaltonenhaar_siggraph2015_combined_final_footer_220dpi.pdf). Ulrich Haar, Lead Programmer 3D, Ubisoft Montreal. Sebastian Aaltonen, Senior Lead Programmer, RedLynx a Ubisoft Studio
* 2020
    * [Software-Based Variable Rate Shading in Call of Duty: Modern Warfare](https://research.activision.com/publications/2020-09/software-based-variable-rate-shading-in-call-of-duty--modern-war). Michal Drobot, Infinity Ward / Activision.
* 2021
    * [Geometry Rendering Pipeline Architecture](http://enginearchitecture.realtimerendering.com/2021_course/). Michal Drobot, Infinity Ward / Activision.
    * [Rendering Engine Architecture at Activision](http://enginearchitecture.realtimerendering.com/2021_course/). Michael Vance, Activision.
    * [Roblox (Rendering) Engine Architecture](http://enginearchitecture.realtimerendering.com/2021_course/). Angelo Pesce, Roblox.
    * [Unity Rendering Architecture](http://enginearchitecture.realtimerendering.com/2021_course/). Natalya Tatarchuk, Unity.

## JCGT

* 2013
    * [The Visibility Buffer: A Cache-Friendly Approach to Deferred Shading](https://jcgt.org/published/0002/02/04/). Christopher A. Burns, Intel Labs. Warren A. Hunt, Intel Labs.
* 2017
    * [Triangle Reordering for Efficient Rendering in Complex Scenes](https://jcgt.org/published/0006/03/03/). Songfang Han, Hong Kong UST. Pedro Sander, Hong Kong UST.


## HPG

* 2015
    * [Deferred attribute interpolation for memory-efficient deferred shading](https://dl.acm.org/doi/abs/10.1145/2790060.2790066). Christoph Schied, Karlsruhe Institute of Technology. Carsten Dachsbacher, Karlsruhe Institute of Technology.

## GDC

* 2011
    * [Deferred Shading Optimizations](https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fdeveloper.amd.com%2Fwordpress%2Fmedia%2F2012%2F10%2FDeferred%2520Shading%2520Optimizations.pps&wdOrigin=BROWSELINK). Nicolas Thibieroz.
* 2016
    * [Optimizing the Graphics Pipeline with Compute](https://www.gdcvault.com/play/1023109/Optimizing-the-Graphics-Pipeline-With). Graham Wihlidal, Frostbite Engine / Electronic Arts.
* 2020
    * [Lima Oscar Delta!: Scaling Content in 'Call of Duty: Modern Warfare'](https://www.gdcvault.com/play/1026892/Lima-Oscar-Delta-Scaling-Content). Rulon Raymond, Infinity Ward / Activision.

## Digital Dragons

* 2017
    * [Rendering of Call of Duty: Infinite Warfare](https://research.activision.com/publications/archives/rendering-of-call-of-dutyinfinite-warfare). Michal Drobot, Infinity Ward / Activision.

## Books

* ShaderX2
    * Deferred Shading with Multiple Render Targets. Nicolas Thibieroz.
* ShaderX5
    * Overcoming Deferred Shading Drawbacks. Frank Puig Placeres.
* GPU Gems 1
    * Graphics Pipeline Performance
* GPU Pro 4
    * Decoupled Deferred Shading on the GPU
    * Tile Forward Shading
    * Forward+: A Step Toward Film-Style Shading in Real-Time
* GPU Zen
    * [Deferred+](https://www.eidosmontreal.com/news/deferred-next-gen-culling-and-rendering-for-dawn-engine/). Hawar Doghramachi, Eidos-Montreal. Jean-Normand Bucci, Eidos-Montreal.
    * Optimizing the Graphics Pipeline with Compute
* Ray Tracing Gems
    * Hybrid Rendering for Real-Time Ray Tracing
    * Deferred Hybrid Path Tracing

## Blog

* 2003
    * [Photo-Realistic Deferred Lighting](https://www.beyond3d.com/content/articles/19/3). Dean Calver.
* 2016
    * [Triangle Visibility Buffer](http://diaryofagraphicsprogrammer.blogspot.com/2018/03/triangle-visibility-buffer.html). Wolfgang Engel.

# Study Notes

## Deferred Shading

* Advantages
    1. Uses single geometry pass
    2. Performs all shading calculations per-pixel
    3. Reduces pixel overdraw
    4. Lights major cost is based on the screen area covered (shading / lighting only applied to visible fragments)
    5. Lights can be occluded like other objects, this allows fast hardware Z-Reject
    6. Shadow mapping is fairly cheap
    7. Adding more layers of effects generally results in a linear, fixed cost per frame for additional full-screen post-processing passes regardless of the number of models on screen
    8. Scene geometry decoupled from lighting
    9. Reduction in render states
    10. G-Buffer already produces data required for post-processing
* Considerations
    1. Memory footprint (Large frame-buffer size)
    2. Bandwidth requirements (Potentially high fill-rate)
    3. Multiple light equations difficult
    4. Transparency is very hard. Forward rendering required for translucent objects
    5. Comparatively expensive to have multiple light models
    6. Antialiasing. Costly and complex MSAA
    7. Significant engine rework
    8. 

Builds an attribute buffer, also known as the G-Buffer.

### Geometry Phase

* The only phase that actually uses an objects mesh data
* Output is G-Buffer
* Some portions of the light equation that stay constant can be computed here and stored in the G-Buffer if necessary (ex. Fresnel)
* Precision is important when creating G-Buffers

#### What to Store?

* Position
    * World Space?
    * Screen Space?
        * Costs a few extra instructions to undo, but the advantages in bandwidth and visual fidelity make it worthwhile
* Distance
    * Instead of storing positions, store the distance of the position in view space
        * `G_Buffer.z = length(Input.PosInViewSpace)`
    * Retrieval:
        * VS
            * `out.vEyeToScreen = float3(Input.ScreenPos.x * ViewAspect, Input.ScreenPos.y, invTanHalfFOV);`
        * PS
            * `float3 PixelPos = normalize(Input.vEyeToScreen) * G_Buffer.z;`
* Normal
    * Because normal vectors are unit length vectors, z = &plusmn; &radic; (1 - x<sup>2</sup> - y<sup>2</sup>)
        * If all the lighting is performed in view space, then the front-faced polygons are always going to have negative / positive Z components depending on the frame of reference used
    * Single byte is commonly used for a normal component when dealing with normal maps or other precomputed textures
* Color
* Material Atrributes
    * Specular power, glow factor, occlusion term, etc.
    * Such values normally differs by material, and often could be constrained to specific values
        * If the specular power term can be constrained into [1, 4, 10, 20], then only two bits can be used to store the specular term
    * If a scene contains few materials, then a G-Buffer can hold a material id value to be used as an index to the material look-up table

#### Examples

##### Example 1

<table>
<thead>
<tr>
<td colspan="4">GBuffer</td>
</tr>
</thead>
<tbody>
<tr>
<td>Pos.X</td>
<td>Pos.Y</td>
<td>Pos.Z</td>
<td>ID</td>
</tr>
<tr>
<td>Norm.X</td>
<td>Norm.Y</td>
<td>Norm.Z</td>
<td>MaterialIndex</td>
</tr>
<tr>
<td>Albedo.R</td>
<td>Albedo.G</td>
<td>Albedo.B</td>
<td>DiffuseTerm</td>
</tr>
<tr>
<td>SpecularEmissive.R</td>
<td>SpecularEmissive.G</td>
<td>SpecularEmissive.B</td>
<td>SpecularTerm</td>
</tr>
</tbody>
</table>

|Material Lookup Texture|
|-----------------------|
|Kspecblend|
|KAmb|
|KEmm|
|&hellip;|

##### Example 2 : StarCraft II

* Only opaque objects with some notable exceptions
* Only local lights
    * Point and spot lights with a defined extent in space
    * Global directional lights are forward rendered normally
* Color components not affected by local lighting (emissive, environment maps, forward-lit color components)
* Depth
    * Lighting, fog volumes, dynamic AO, smart displacement, DoF, projections, edge detection, thickness measurement
* Per-pixel normal
    * Dynamic AO
* Ambient occlusion term, if using static AO. Baked AO textures are ignored if screen-space AO is enabled
* Unlit diffuse material color
    * Lighting
* Unlit specular material color
    * Lighting
* Due to heavy use of HDR, all these buffers will normally be four-channel 16-bit floating point formats

<table>
<thead>
<tr>
<td>MRTs</td>
<td colspan="4">GBuffer</td>
</tr>
</thead>
<tbody>
<tr>
<td>MRT 0</td>
<td>UnlitAndEmissive.R</td>
<td>UnlitAndEmissive.G</td>
<td>UnlitAndEmissive.B</td>
<td>Unused</td>
</tr>
<tr>
<td>MRT 1</td>
<td>Normal.X</td>
<td>Normal.Y</td>
<td>Normal.Z</td>
<td>Depth</td>
</tr>
<tr>
<td>MRT 2</td>
<td>Albedo.R</td>
<td>Albedo.G</td>
<td>Albedo.B</td>
<td>AO</td>
</tr>
<tr>
<td>MRT 3 (optional)</td>
<td>Specular.R</td>
<td>Specular.G</td>
<td>Specular.B</td>
<td>Unused</td>
</tr>
</tbody>
</table>

### Lighting Phase

* Full screen lights
    * Use full screen quad
    * Ambient lighting, hemispherical lighting, sun directional lighting etc.
* Shaped Lights
    * Using attenuations, we can cull the lights that no longer makes any contribution per-pixel
    * Based on the attenuation model, calculate which pixels are beyond the ranges and try not to run the pixel shaders
    * We can project the light volumes where the lighting contribution isn't zero
        * Each pixel most be hit once and once only
        * Projected geometry must not be clipped by the near/far planes
            * Remove the far plane by setting it into infinity

Full screen lighting is actually slower than forward rendering.

* Stenciling allows us to discard pixels that are covered by the light shapes but whose depth is too far behind the light to be affected by it
* Early-Z will reduce cost of hidden lights
* Early stencil reduces cost of objects behind light that are not lit by it
    * Light shapes must be rendered again with color writes off before its normal lighting pass
    * Stencil operation is slightly different depending on whether the viewing camera sits inside the light shape (this has to be tested on the CPU)
    * If the camera is outside the light shape, only pass front facing parts
    * Else, color any of the light shape's back facing pixels that failed the z-test

* High-Level Manager
    * Only sends the sources that influence the final image to the pipeline and executes the shaders only on the pixels that are influenced by the effect or light
    * Receives the list of all sources that should modulate the resulting render and all the information about them
        * One such piece of information: Bounding object that contains information on how strong the source effect should be applied to the rendering equation
    1. Social Stage
       1. Execute visibility and occlusion algorithms to discard lights whose influence is not appreciable
          * Using the source-bounding object, the manager finds which lights and effects are not occluded by the scene geometry and are inside the view frustum
       2. Project visible sources bouding objects into screen space
       3. Combine similar sources that are too close in screen space or influence almost the same screen area
       4. Discard sources with a tiny contribution because of their projected bounding object being too small or too far
       5. Check that more than a predefined number of sources do not affect each screen region. Choose the biggest, strongest, and closer sources
    2. Individual Phase
       * Lights and special effects in general can be classified in two main groups: global sources, local sources 
       * Global Sources
          * Sun, DoF, fog, etc. 
          * For each global sources:
            * Enable the appropriate shaders
            * Render a quad covering the screen
       * Local Sources
          * Only affect regions of the scene
          * Volumetric fog, heat haze, etc.
          * Pixels inside the source bounding-object have to be processed
       1. Select the appropriate level of detail
          * Farther and smaller sources don't have to be computed with the same quality than closer sources
       2. If dynamic branching is not supported, render a mask in the stencil buffer
          * If dynamic branching is supported, if the pixel position is not found to be in the influence area of the bounding object, then the pixel is discarded 
       3. Enable and configure the source shaders
       4. Compute the minimum and maximum screen cord values of the projected bounding object
       5. Enable the scissor test
          * Using the rectangle that surrounds the screen projection of the source bounding object 
          * Quickly rejects pixels at the fragment level
       6. Enable the clipping planes
          * Further restrain the pixels that get into the fragment stage from the transform level
       7. Render a screen quad or the bounding object

---

**G-Buffer Building Pass**

How to reduce export cost (PS to MRT)?

* Render objects in front-to-back order
* Use fewer RTs
  * Each RT adds to export cost
* Avoid slow formats
  * NVIDIA
    * RT export cost proportional to bit depth except 32bpp same speed as 32bpp sRGB formats are slower
    * Total export cost = Cost(RT0) + Cost(RT1) + &hellip;
  * AMD
    * R32G32B32A32, R32G32, R32, R32G32B32A32f, R32G32f, R16G16B16A16 (+ R32F, R16G16, R16 on older GPUs)
    * Total export cost = (Num RTs) * (Slowest RT)
* Depth Buffer as Texture Input
  * No need to store depth into a color RT
* Data Packing
  * Trade render target storage for a few extra ALU instructions
  * ALU cost is typically negligible compared to the performance saving of writing and fetching to/from fewer textures

---

**Shading Passes**

* Add light contributions to accumulation buffer
* Light Volumes vs Screen-aligned quads
* Cull lights as needed before sending them to the GPU
* Don't render lights on skybox area

#### Light Volume Rendering

* Render light volumes corresponding to light's range
    * Fullscreen tri/quad (ambient or directional light)
    * Sphere (point light)
    * Cone / pyramid (spot light)
    * Custom shapes (level editor)
* Tight fit between light coverage and processed area
* 2D projection of volume define shaded area
* Additively blend each light contribution to the accumulation buffer
* Use early depth / stencil culling optimizations

### Examples

#### Example 1: Phong model

G-Buffer structure:
1. Pixel position
   * World space position of the pixel 
   * R16G16B16A16 FLOAT
2. Pixel Normal vector
   * World space normalized normal vector 
   * Choice:
       * Model space: Simplest.
       * Tangent space
   * R10G10B10A2 / R8G8B8A8 INT / FLOAT
3. Pixel diffuse color
   * R8G8B8A8 FLOAT

* References:

* `m4x4 dst, src0, src1`: multiplies a 4-component vector by a 4x4 matrix. `src0` is a 4-component vector, `src1` is a 4x4 matrix (`dst = mul(src1, src0)` (if `src0` is column vector))
* `mov dst, src`: move floating-point data between registers

`PreLightPass.vs`

```hlsl
;-------------------------------------------------------------------
; Constants specified by the app
; c0-c3 = Global transformation matrix (World*View*Projection)
; c4-c7 = World transformation matrix
;
; Vertex components
; v0 = Vertex Position
; v1, v2, v3 = Inverse of tangent space vectors
; v4 = 2D texture coordinates (model coordinates)
;-------------------------------------------------------------------
vs_2_0

dcl_position v0 ; Vertex position
dcl_binormal v1 ; Transposed binormal
dcl_tangent v2 ; Transposed tangent
dcl_normal v3 ; Transposed normal
dcl_texcoord v4 ; Texture coordinates for diffuse and normal map

; Vertex transformation
m4x4 oPos, v0, c0 ; Transform vertices by WVP matrix

; Model texture coordinates
mov oT0.xy, v4.xy ; Simply copy texture coordinates

; World space coordinates
m4x3 oT1.xyz, v0, c4 ; Transform vertices by world matrix (no w
; needed)

; Inverse (transpose) of tangent space vectors
mov oT2.xyz, v1
mov oT3.xyz, v2
mov oT4.xyz, v3 ; Pass in transposed tangent space vectors
```

```hlsl
cbuffer ConstantBuffer : register(b0)
{
    float4x4 WVP;   // Global transformation matrix
    float4x4 World; // World transformation matrix
}

struct VSInput
{
    float4 Position : POSITION;     // Vertex position
    float3 Binormal : BINORMAL;     // Inverse of tangent space vectors >> Transposed binormal
    float3 Tangent : TANGENT;       // Inverse of tangent space vectors >> Transposed tangent
    float4 Normal : NORMAL;         // Inverse of tangent space vectors >> Transposed normal
    float2 TexCoord : TEXCOORD0;    // 2D texture coordinates for diffuse and normal map (model coordinates)
};

struct VSOutput
{
    float4 Position : SV_Position;
    float3 WorldPos : WorldPos;
    float3 Binormal : Binormal;
    float3 Tangent : Tangent;
    float3 Normal : Normal;
    float2 TexCoord : TexCoord0;
};

VSOutput main(VSInput vsInput)
{
    VSOutput vsOutput;

    // Vertex transformation
    vsOutput.Position = mul(WVP, vsInput.Position); // Transform vertices by WVP matrix

    // Model texture coordinates
    vsOutput.TexCoord = vsInput.TexCoord;   // Simply copy texture coordinates

    // World space coordinates
    vsOutput.WorldPos = mul(float3x3(World), vsInput.Position.xyz);   // Transform vertices by world matrix (no w needed)

    // Inverse(transpose) of tangent space vectors
    vsOutput.Binormal = vsInput.Binormal;
    vsOutput.Tangent = vsInput.Tangent;
    vsOutput.Normal = vsInput.Normal;   // Pass in transposed tangent space vectors

    return vsOutput;
}
```

* `def dst, fValue1, fValue2, fValue3, fValue4`: Defines pixel shader floating-point constants. `fValue1` to `fValue4` are floating=point values
* `texld dst, src0, src1`: Sample a texture at a particular sampler, using provided texture coordinates. `src0` is a source register that provides the texture coordinates for the texture sample. `src1` identifies the Sampler where # specifies which texture sampler number to sample.
* `mad dst, src0, src1, src2`: Multiply and add instruction. Sets the destination register to `(src0 * src1) + src2`.
* `dp3 dst, src0, src1`: Computes the three-component dot product of the source registers.

`PreLightPass.ps`

```hlsl
;-------------------------------------------------------------------
; Constants specified by the app
; c0-c3 = World transformation matrix for model
;-------------------------------------------------------------------
ps_2_0

; Samplers
dcl_2d s0 ; Diffuse map
dcl_2d s1 ; Normal map

; Texture coordinates
dcl t0.xy ; Texture coordinates for diffuse and normal map
dcl t1.xyz ; World-space position
dcl t2.xyz ; Binormal
dcl t3.xyz ; Tangent
dcl t4.xyz ; Normal (Transposed tangent space vectors)

; Constants
def c30, 1.0, 2.0, 0.0, 0.0
def c31, 0.2, 0.5, 1.0, 1.0

; Texture sampling
texld r2, t0, s1 ; r2 = Normal vector from normal map
texld r3, t0, s0 ; r3 = Color from diffuse map

; Store world-space coordinates into MRT#0
mov oC0, t1 ; Store pixel position in MRT#0

; Convert normal to signed vector
mad r2, r2, c30.g, -c30.r ; r2 = 2*(r2 - 0.5)

; Transform normal vector from tangent space to model space
dp3 r4.x, r2, t2
dp3 r4.y, r2, t3
dp3 r4.z, r2, t4 ; r4.xyz = model space normal

; Transform model space normal vector to world space. Note that only
; the rotation part of the world matrix is needed.
; This step is not required for static models if their
; original model space orientation matches their orientation
; in world space. This would save 3 instructions.
m4x3 r1.xyz, r4, c0

; Convert normal vector to fixed point
; This is not required if the destination MRT is float or signed
mad r1, r1, c31.g, c31.g ; r1 = 0.5*(r1 + 0.5)

; Store world-space normal into MRT#1
mov oC1, r1

; Store diffuse color into MRT#2
mov oC2, r3
```

```hlsl
cbuffer ConstantBuffer : register(b0)
{
    float4x4 World;
}

// Samplers
Texture2D<float3> g_DiffuseMap  : register(t0); // Diffuse map
Texture2D<float3> g_NormalMap   : register(t1);  // Normal map
SamplerState g_Sampler          : register(s0);

struct PSInput
{
    float4 Position : SV_Position;
    float3 WorldPos : WorldPos;     // World-space position
    float3 Binormal : Binormal;     // Binormal
    float3 Tangent : Tangent;       // Tangent
    float3 Normal : Normal;         // Normal (Transposed tangent space vectors)
    float2 TexCoord : TexCoord0;    // Texture Coordinates for diffuse and normal map
};

struct Mrt
{
    float3 WorldPos;
    float3 WorldNormal;
    float3 Albedo;
}

Mrt main(PSInput psInput)
{
    Mrt mrt;

    // Texture sampling
    float3 normal = g_NormalMap.Sample(g_Sampler, psInput.TexCoord);    // Normal vector from normal map
    float3 albedo = g_DiffuseMap.Sample(g_Sampler, psInput.TexCoord);   // Color from diffuse map

    // Store world-space coordinates into MRT#0
    mrt.WorldPos = psInput.WorldPos;

    // Convert normal to signed vector if needed
    // normal = 2.0 * (normal - 0.5);

    // Transform normal vector from tangent space to model space
    float3 modelNormal = float3(dot(normal, psInput.Binormal), dot(normal, psInput.Tangent), dot(normal, psInput.Normal));

    // Transform model space normal vector to world space. Note that only the rotation part of the world matrix is needed.
    // This step is not required for static models if their original model space orientation matches their orientation in world space.
    // This would save 3 instructions.
    float3 worldNormal = mul(float3x3(World), modelWorld);

    // Convert normal vector to fixed point
    // This is not required if the destination MRT is float or signed
    // worldNormal = 0.5 * (worldNormal + 0.5)

    // Store world-space normal into MRT#1
    mrt.WorldNormal = worldNormal;

    // Store diffuse color into MRT#2
    mrt.Albedo = albedo;

    return mrt;
}
```

* `rcp dst, src`: Computes the reciprocal of the source scalar

`LightPass.ps`

```hlsl
;-------------------------------------------------------------------
; Constants specified by the app
; c0 : light position in world space
; c8 : camera position in world space
; c22: c22.a = 1/(light max range), c22.rgb = 1.0f
;-------------------------------------------------------------------
ps_2_0

; Samplers
dcl_2d s0 ; MRT#0 = Pixel position in world space
dcl_2d s1 ; MRT#1 = Pixel normal vector
dcl_2d s2 ; MRT#2 = Pixel diffuse color
dcl_2d s3 ; Falloff texture
dcl_cube s4 ; Cube normalization texture map

; Texture coordinates
dcl t0.xy ; Quad screen-space texture coordinates

; Constants
def c20, 0.5, 2.0, -2.0, 1.0
def c21, 8.0, -0.75, 4.0, 0.0

; Retrieve property buffer data from MRT textures
texld r0, t0, s0 ; r0.xyz = Pixel world space position
texld r2, t0, s1 ; r2.xyz = Pixel normal vector
texld r3, t0, s2 ; r3.rgb = Pixel color

; Convert normal to signed vector
; This is not required if the normal vector was stored in a signed
; or float format
mad r2, r2, c20.y, -c20.w ; r2 = 2*(r2 - 1)

; Calculate pixel-to-light vector
sub r1.xyz, c0, r0 ; r1 = Lpos - Vpos
mov r1.w, c20.w ; Set r1.w to 1.0
nrm r4, r1 ; Normalize vector (r4.w = 1.0/distance)

; Compute diffuse intensity
dp3 r5.w, r4, r2 ; r5.w = (N.L)

; FallOff
rcp r6, r4.w ; r6 = 1/(1/distance) = distance
mul r6, r6, c22.a ; Divide by light max range
texld r6, r6, s3 ; Sample falloff texture

; Compute halfway vector
sub r1.xyz, c8, r0 ; Compute view vector V (pixel to camera)
texld r1, r1, s4 ; Normalized vector with cube map
mad r1, r1, c20.y, -c20.w ; Convert vector to signed format
add r1, r1, r4 ; Add view and light vector
texld r1, r1, s4 ; Normalize half angle vector with cube map
mad r1, r1, c20.y, -c20.w ; Convert to signed format

; Compute specular intensity
dp3_sat r1.w, r1, r2 ; r1.w = sat(H.N)
pow r1.w, r1.w, c21.r ; r1.w = (H.N)^8
; Set specular to 0 if pixel normal is not facing the light
cmp r1.w, r5.w, r1.w, c21.w ; r1.w = ( (N.L)>=0 ) ? (H.N)^8 : 0

; Output final color
mad r0, r3, r5.w, r1.w ; Modulate diffuse color and diffuse

; intensity and add specular
mul r0, r0, r6 ; Modulate with falloff
mov oC0, r0 ; Output final color
```

```hlsl
cbuffer ConstantBuffer : register(b0)
{
    float4 LightPos;        // Light position in world space
    float4 CameraPos;       // Camera position in world space
    float LightAttenuation; // 1.0 / (light max range)
}

// Samplers
Texture2D<float3> g_WorldPos            : register(t0);
Texture2D<float3> g_WorldNormal         : register(t1);
Texture2D<float3> g_Albedo              : register(t2);
Texture2D<float3> g_Falloff             : register(t3);
TextureCube<float4> g_Normalization     : register(t4);
SamplerState g_DefaultSampler           : register(s0);
SamplerState g_CubeSampler              : register(s1);

// Texture coordinates
struct PSInput
{
    float4 Position : SV_Position;
    float2 TexCoord : TexCoord0;    // Quad screen-space texture coordinates
};

float4 main(PSInput psInput) : SV_Target
{
    // Retrieve property buffer data from MRT textures
    float3 worldPos = g_WorldPos.Sample(g_DefaultSampler, psInput.TexCoord);        // pixel world space position
    float3 worldNormal = g_WorldNormal.Sample(g_DefaultSampler, psInput.TexCoord);  // pixel normal vector
    float3 albedo = g_Albedo.Sample(g_DefaultSampler, psInput.TexCoord);            // pixel color

    // Convert normal to signed vector
    // This is not required if the normal was stored in a signed or float format
    // worldNormal = 2.0 * (worldNormal - 1.0)

    // Calculate pixel-to-light vector
    float4 lightDir = normalize(float4(LightPos - worldPos, 1.0));   // lightDir.w = 1.0 / distance

    // Compute diffuse intensity
    float diffuseIntensity = dot(lightDir, worldNormal);    // diffuse intensity = (N dot L)

    // Fall off
    float fallOff = 1.0 / lightDir.w;   // 1.0 / (1.0 / distance) = distance
    fallOff *= LightAttenuation;        // Divide by light max range
    fallOff = g_Falloff.Sample(g_DefaultSampler, float2(fallOff, fallOff)); // Sample falloff texture

    // Compute halfway vector
    float4 viewDir = CameraPos - worldPos;  // Compute view vector V (pixel to camera)
    viewDir = g_Normalization.Sample(g_CubeSampler, viewDir.xyz);   // Normalized vector with cube map
    // Convert vector to signed format
    // viewDir = 2.0 * (viewDir - 1.0);

    // Compute specular intensity
    float specularIntensity = pow(saturate(dot(viewDir, worldNormal)), 8.0);    // (H dot N)^8

    // Set specular to 0 if pixel normal is not facing the light
    specularIntensity = (diffuseIntensity >= 0.0) ? specularIntensity : 0.0;

    // Output final color
    float4 color = albedo * diffuseIntensity + specularIntensity; // modulate diffuse color and diffuse intensity and add specular
    color *= fallOff;   // Modulate with falloff

    return color;   // Output final color
}
```

#### Example 2: AMD GDC 2011

1. Light Pre-pass
   1. Render Normals
      * 1st geometry pass results in normal(and depth) buffer
        * Uses a single color RT
        * No MRT required 
   2. Lighting Accumulation
      * Perform all lighting calculation into light buffer
        * Use normal and depth buffer as input textures
        * Render geometries enclosing light area
        * Write (LightColor * N.L * Attenuation) in RGB, specular in A 
   3. Combine lighting with materials
      * 2nd geometry pass using light buffer as input
        * Fetch geometry material
        * Combine with light data
   * Advantages
     * One material fetch per pixel regardless of number of lights
   * Disadvantages
     * Two scene geometry passes required
     * Unique lighting model