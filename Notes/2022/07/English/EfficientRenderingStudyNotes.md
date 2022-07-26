# Efficient Rendering Study Notes (2022.06.03)
[Home](/README.md)

# Forward Rendering

* Do everything we need to shade a pixel<sup>[Lauritzen10](#Lauritzen10)</sup>
* For each light
  * Shadow attenuation (sampling shadow maps)
  * Distance attenuation
  * Evaluate lighting and accumulate
* Object rendering pass does everything<sup>[KimBarrero11](#KimBarrero11)</sup>
* Single pass over geometry generates "final" image<sup>[Pesce14](#Pesce14)</sup>
* Lights are bound to draw calls (via uniforms)<sup>[Pesce14](#Pesce14)</sup>
* Accurate culling of light influence on geometry requires CSG splits<sup>[Pesce14](#Pesce14)</sup>
* Multiple lights require either loops / branches in the shaders or shader permutations<sup>[Pesce14](#Pesce14)</sup>

Characteristics:
* Advantages:
  * Transparency via alpha blending<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup><sup>[Olsson15](#Olsson15)</sup>
  * MSAA and related techniques through hardware features (much less memory storage is required)<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup><sup>[Olsson15](#Olsson15)</sup>
  * Fastest in its baseline case (single light per pixel, "simple" shaders or even baked lighting)<sup>[Pesce14](#Pesce14)</sup>
    * Doesn't have a "constant" up-front investment, you pay as you go (more lights, more textures&hellip;)
  * Least memory necessary (least bandwidth, at least in theory). Makes MSAA possible<sup>[Pesce14](#Pesce14)</sup><sup>[Olsson15](#Olsson15)</sup><sup>[Olsson15](#Olsson15)</sup>
    * Single frame buffer<sup>[Olsson15](#Olsson15)</sup>
  * Easy to integrate with shadowmaps (can render them one-at-atime, or almost)<sup>[Pesce14](#Pesce14)</sup>
  * No extra pass over geometry<sup>[Pesce14](#Pesce14)</sup>
  * Any material, except ones that require screen-space passes like Jimenez's SS-SSS<sup>[Pesce14](#Pesce14)</sup>
  * Single pass<sup>[Olsson15](#Olsson15)</sup>
  * Simple if only few lights<sup>[Olsson15](#Olsson15)</sup>
    * e.g., the sun
  * Varying shading models is easy
  * Flexible<sup>[Olsson15](#Olsson15)</sup>
    * Forward or Deferred
* Issues:
  * Computing which lights affect each body consumes CPU time, and in the worst cast, it becomes an O(n &times; m) operation<sup>[Koonce07](#Koonce07)</sup>, Ineffective light culling<sup>[Lauritzen10](#Lauritzen10)</sup>, Light culling not efficient<sup>[Andersson11](#Andersson11)</sup><sup>[Pesce14](#Pesce14)</sup>
    * Object space at best
  * Shaders often require more than one render pass to perform lighting, with complicated shaders requiring worst-case O(n) render passes for n lights<sup>[Koonce07](#Koonce07)</sup><sup>[Lauritzen10](#Lauritzen10)</sup>
  * Adding new lighting models or light types requires changing all effect source files<sup>[Koonce07](#Koonce07)</sup>
    * Lighting / texturing variations have to be dealt with dynamic branches which are often problematic for the shader compiler (must allocate registers for the worst case &hellip;), conditional moves(wasted work and registers) or shader permutations(combinatorial explosion)<sup>[Pesce14](#Pesce14)</sup>
  * ~~Shaders quickly encounter the instruction count limit of Shader Model 2.0<sup>[Koonce07](#Koonce07)</sup>~~
  * Memory footprint of all inputs<sup>[Lauritzen10](#Lauritzen10)</sup>
    * Everything must be resident at the same time
  * Shading small triangles is inefficient<sup>[Lauritzen10](#Lauritzen10)</sup>
  * Shader permutations not efficient<sup>[Andersson11](#Andersson11)</sup><sup>[Pesce14](#Pesce14)</sup><sup>[Olsson15](#Olsson15)</sup>
  * Expensive & more difficult decaling / destruction masking<sup>[Andersson11](#Andersson11)</sup>, Decals needs to be multiplass, lit twice.<sup>[Pesce14](#Pesce14)</sup>
    * Alternatively, for static decals mesh can be cut and texture layering used (more shader variations)<sup>[Pesce14](#Pesce14)</sup>
    * or for dynamic decals color can be splatted before main pass (but that costs an access to the offscreen buffer regardless or not a decal is there)<sup>[Pesce14](#Pesce14)</sup>
  * Complex shaders might not run optimally<sup>[Pesce14](#Pesce14)</sup><sup>[Olsson15](#Olsson15)</sup>
    * Texturing and lighting (and shadowing) is done in the same pass, thus shaders can require a lot of registeres and yield limited occupancy
    * Accessing many textures in sequence might create more trashing than accessing them in separate passes
  * Many "modern" rendering effecs require a depth/normal pre-pass anyways (i.e. SSAO, screen-space shadwos, reflections, and so on)<sup>[Pesce14](#Pesce14)</sup>
  * All shading is done on geometry, which means we pay all the eventual inefficiencies (e.g. partial quads, overdraw) on all shaders<sup>[Pesce14](#Pesce14)</sup><sup>[Olsson15](#Olsson15)</sup>
  * No shadow map reuse<sup>[Olsson15](#Olsson15)</sup>

Classic forward rendering:<sup>[StewartThomas13](#StewartThomas13)</sup>
* Depth pre-pass
  * Prevents overdraw when shading
* Forward shading
  * Pixel Shader
    * Iterates through light list *set for each object*
    * Evaluates material
      * Diffuse texture, spec mask, bump map, etc.

Modern Forward Shading:<sup>[Olsson15](#Olsson15)</sup>
1. Optional Pre-Z / Geometry Pass
2. Light Assignment
   * Build Light Acceleration Structure (Grid) 
3. Geometry Pass
   * Just your normal shading pass
   * For each fragment
     * Look up light list in acceleration structure
     * Loop over lights and accumulate shading
     * Write shading to frame buffer 

## Z Pre-Pass rendering

Construct depth-only pass (Z pre-pass) first to fill the z buffer with depth data, and at the same time fill the z culling. Then render the scene using this occlusion data to prevent pixel overdraw.<sup>[EngelShaderX709](#EngelShaderX709)</sup>

![ZPrePassRenderer](/Images/DeferredShading/ZPrePassRenderer.png)<sup>[EngelShaderX709](#EngelShaderX709)</sup>

A naïve multi-light solution that accompanies a Z pre-pass renderer design pattern would just render a limited number of lights in the pixel shader.<sup>[EngelShaderX709](#EngelShaderX709)</sup>

A more advanced approach stores light source properties such as position, light color, and other light properties in texture following a 2D grid that is laid out in the game world.<sup>[EngelShaderX709](#EngelShaderX709)</sup>

In order to render many lights:<sup>[EngelSiggraph09](#EngelSiggraph09)</sup>

* Re-render geometry for each light<sup>[EngelSiggraph09](#EngelSiggraph09)</sup>
  * Lots of geometry throughput
* Write pixel shader with four or eight lights<sup>[EngelSiggraph09](#EngelSiggraph09)</sup>
  * Draw lights per-object
  * Need to split up geometry following light distribution
* Store light properties in textures and index into this texture<sup>[EngelSiggraph09](#EngelSiggraph09)</sup>
  * Dependent texture look-up and lights are not fully dynamic

Space Marine:<sup>[KimBarrero11](#KimBarrero11)</sup>
* Reject occluded objects early in G-Buffer
  * Hi-Z to reject beofre ROP(Raster Operation)
* Front-to-back
* Only draw:
  * maximum 75 objects
  * Big enough objects in project space
* Other objects will be drawn to Z-buffer in Gbuffer pass

Unreal:<sup>[Anagnostou17](#Anagnostou17)</sup>
* Uses reverse-Z

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

* Worst case complexity is num_objects * num_lights<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[Lee09](#Lee09)</sup>
* Sorting by light or by object are mutually exclusive<sup>[Hargreaves04](#Hargreaves04)</sup>
  * Hard to maintain good batching
* Ideally the scene should be split exactly along light boundaries, but getting this right for dynamic lights can be a lot of CPU work<sup>[Hargreaves04](#Hargreaves04)</sup>
* Hidden surfaces can cause wasted shading<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Valient07](#Valient07)</sup>
* High batch cound (1/object/light)<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
  * Even higher if shadow-casting
* Lots of repeated work each pass:<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Valient07](#Valient07)</sup><sup>[Lee09](#Lee09)</sup><sup>[Lauritzen10](#Lauritzen10)</sup>
  * Vertex transform & setup
  * Anisotropic filtering
  * Not a scalable solution<sup>[Lauritzen10](#Lauritzen10)</sup>
* Can only be justified when targeting graphics that generally consist of low- and medium-poly-count scenes with no complex materials, a very small number of light types, and where illumination comes from a few lights spread all over the scene<sup>[Placeres06](#Placeres06)</sup>
* Shader for each material and light type<sup>[Valient07](#Valient07)</sup>
* Hard to optimize, we were often vertex bound<sup>[Lee09](#Lee09)</sup>
* High vertex processing cost<sup>[Trebilco09](#Trebilco09)</sup>

## Tiled Forward Shading

* Advantages:
  * Light management is decoupled from geometry<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
  * Light data can be uploaded to the GPU once per scene<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
  * FSAA works as expected<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
  * Common terms in the rendering equation can be factored out<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
  * Light accumulation is done in register, at full floating point precision<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
  * Same shading function as Tiled Deferred<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
* Disadvantages:
  * Each fragment may be shaded more than once<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
    * Can be addressed by using a pre-z pass

### Basic Algorithm<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>

1. Subdivide screen into tiles
2. (Optional): pre-Z pass
3. (Optional): find min / max z-bounds for each tile
4. Assign lights to each tile
5. Render geometry and compute shading for each generated fragment

```c
// 1D texture holding per-tile light lists
uniform isampleBuffer tex_tileLightLists;

// uniform buffer holding each tile's light count and
// start offset of the tile's light list (in
// tex_tileLightIndices
uniform TileLightListRanges
{
  ivec2 u_lightListRange[MAX_NUM_TILES];
}

void shading_function(inout FragmentData aFragData)
{
  // ...

  // find fragment's tile using gl_FragCoord
  ivec2 tileCoord = ivec2(gl_FragCoord.xy) / ivec2(TILE_SIZE_X, TILE_SIZE_Y);
  int tileIdx = tileCoord.x + tileCoord.y * LIGHT_GRID_SIZE_X;

  // fetch tile's light data start offset (.y) and 
  // number of lights (.x)
  ivec2 lightListRange = u_lightListRange[tileIdx].xy;

  // iterate over lights affecting this tile
  for (int i = 0; i < lightListRange.x; ++i)
  {
    int lightIndex = lightListRange.y + i;

    // fetch global light ID
    int globalLightId = texelFetch(tex_tileLightLists, lightIndex).x;

    // get the light's data (position, colors, ...)
    LightData lightData;
    light_get_data(lightData, globalLightId);

    // compute shading from the light
    shade(aFragData, lightData);
  }
  // ...
}
```

#### Subdivision of Screen

* Regular N &times; N pixel tiles

#### Optional pre-Z Pass

1. Required if we wish to find the Z-bounds for each tile
2. In the final rendering pass, it can reduce the number of samples that need to be shaded through early-Z tests and similar hardware features
* Should only include opaque geometry

#### Optional Min / Max Z-Bounds

* Yields a further significant improvement
* Yields smaller per-tile bounding volumes
  * Reduces the number of lights that affect a tile

#### Light Assignment

* CPU variant:
  * Find the screen-space axis-aligned bounding boxes (AABBs) for each light source and loop over all the tiles that are contained in the 2D region of the AABB
    * If min / max depth is available, perform additional test to discard lights that are outside of the tile in the Z-direction
* GPU variant:
  * Each tile gets its own thread group

#### Rendering and Shading

* For each generated sample,
  * Look up which lights affect that sample by checking what lights are assigned to the sample's tile

#### Transparency Support

```c
// assign lights to 2D tiles
tilesD = build_2d_tiles();
lightLists2D = assign_lights_to_2d_tiles(tiles2D);

// draw opaque geometry in pre-Z pass and find tiles'
// extents in the Z-direction
depthBuffer = render_preZ_pass();
tileZBounds = reduce_z_bounds(tiles2D, depthBuffer);

// for transparent geometry, prune lights against maximum Z-direction
lightListsTrans = prune_lights_max(lightLists2D, tileZBounds);

// for opaque geometry additionally prune lights against 
// minimum Z-direction
lightListsOpaque = prune_lights_min(lightListsTrans, tileZBounds);

// ...

// later: rendering
draw(opaque geometry, lightListsOpaque);
draw(transparent geometry, lightListsTrans);
```

## Forward+ Rendering

* Goal:<sup>[HaradaMcKeeYang13](#HaradaMcKeeYang13)</sup>
  * Materials may need to be both physically and nonphysically based
  * Artists want complete freedom regarding the number of lights that can be placed in a scene at once
  * Rendering data should be decoupled from the underlying rendering engine

Forward+:<sup>[StewartThomas13](#StewartThomas13)</sup>
* Depth pre-pass
  * Prevents overdraw when shading
  * *Provides tile depth bounds*
  * Separate depth prepass + depth buffer for transparents<sup>[NeubeltPettineo14](#NeubeltPettineo14)</sup>
  * May include vertex normal and velocity<sup>[Pettineo15](#Pettineo15)</sup>
* *Tiled light culling*
  * *Compute shader*
  * *Generates per-tile light list*
  * Transparent light list generated per-tile<sup>[NeubeltPettineo14](#NeubeltPettineo14)</sup><sup>[Pettineo15](#Pettineo15)</sup>
    * TileMinDepth = TileMin(transparentDepth)
    * TileMaxDepth = TileMax(opaqueDepth)
    * Culled using depth buffer<sup>[Pettineo15](#Pettineo15)</sup>
  * Async compute -> mostly free<sup>[Pettineo15](#Pettineo15)</sup>
* Forward shading
  * Pixel Shader
    * Iterates through light list *calculated by tiled light culling*
    * Evaluates material
      * Diffuse texture, spec mask, bump map, etc.

* Forward+ Light-culling stage before final shading<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>
* Stages:<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>
  * Depth Pre-Pass (Z prepass<sup>[HaradaMcKeeYang13](#HaradaMcKeeYang13)</sup>)
  * Light Culling<sup>[HaradaMcKeeYang13](#HaradaMcKeeYang13)</sup> 
  * Final Shading<sup>[HaradaMcKeeYang13](#HaradaMcKeeYang13)</sup>

* Advantages:
  * Requires less memory traffic than compute-based deferred lighting<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>
    * Same memory as forward, more bandwidth, enables MSAA<sup>[Pesce14](#Pesce14)</sup>
  * Any material (same as forward)<sup>[Pesce14](#Pesce14)</sup>
  * Compared to forward, no mesh splitting is necessary, much less shader permutations, less draw calls<sup>[Pesce14](#Pesce14)</sup>
  * Compared to forward it handels dynamic lights with good culling<sup>[Pesce14](#Pesce14)</sup>
* Disadvantages:
  * Geometry submitted twice<sup>[StewartThomas13](#StewartThomas13)</sup>
  * Small triangles<sup>[StewartThomas13](#StewartThomas13)</sup>
  * Light occlusion culling requires a full depth pre-pass for a total of two geometrical passes<sup>[Pesce14](#Pesce14)</sup>
    * Can be sidestepped with a clustered light grid
  * All shadowmaps need to be generated upfront (more memory) or splatted in screen-space in a pre-pass
  * All lighting permutations need to be addressed as dynamic branches in the shader<sup>[Pesce14](#Pesce14)</sup>
    * Not good if we need to support mnay kinds of light/shadow types
  * Compared to forward, seems a steep price to pay to just get rid of geometry cutting<sup>[Pesce14](#Pesce14)</sup>
    * Even if this "solved" shader permutations, its solution is the same as doing forward with shaders that dynamic branch over light types/number of ligts and setting these parameters per draw call

### Light Culling

* Similar to the light-accumulation step of deferred lighting<sup>[HaradaMcKeeYang13](#HaradaMcKeeYang13)</sup>
* Calculates a list of light indices overlapping a pixel<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup> instead of lighting components<sup>[HaradaMcKeeYang13](#HaradaMcKeeYang13)</sup>
  * However, per-pixel calculation has some issues:
    * Memory footprint
    * Efficiency of computation at light-culling stage
* Split the screen into tiles and light indices are calculated on a per-tile basis<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>
* Implemented using a single compute shader<sup>[StewartThomas13](#StewartThomas13)</sup>
* How to reduce false positives?
  * Lights are too far away!
  * 3D implementation uses too much memory
  * [2.5 Culling](#25-culling)!

#### Implementation

##### Gather Approach

* Thread group per tile<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup><sup>[StewartThomas13](#StewartThomas13)</sup>
  * e.g. `[numthreads(16, 16, 1)]` for 16 &times; 16 tile size
* Frustum of the tile is calculated using the range of the screen space of the tile and max/min depth values of the pixels<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup><sup>[StewartThomas13](#StewartThomas13)</sup>
* Kernel first uses all the threads in a thread group to read a light to the local register<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>
  * Overlap of the lights to the frustum of the tile is checked in parallel
  * If overlaps, thread accumulates the light to TLS using local atomic operations
    * `groupshared uint ldsLightIdx[MAX_NUM_LIGHTS_PER_TILE]`<sup>[StewartThomas13](#StewartThomas13)</sup>
  * Flushes lights to the global memory using all threads<sup>[StewartThomas13](#StewartThomas13)</sup>
    * `RWBuffer<uint> g_PerTileLightIndexBufferOut : register(u0);`<sup>[StewartThomas13](#StewartThomas13)</sup>
  * 256 lights are culled in parallel (for 16 &times; 16 tile size)<sup>[StewartThomas13](#StewartThomas13)</sup>
* Simple and effective if the number of lights is not too large<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>

```c
// GET_GROUP_IDX: thread group index in X direction (SV_GroupID)
// GET_GROUP_IDY: thread group index in Y direction (SV_GroupID)
// GET_GLOBAL_IDX: global thread index in X direction (SV_DispatchThreadID)
// GET_GLOBAL_IDY: global thread index in Y direction (SV_DispatchThreadID)
// GET_LOCAL_IDX: local thread index in X direction (SV_GroupThreadID)
// GET_LOCAL_IDY: local thread index in Y direction (SV_GroupThreadID)

// No global memory write is necessary until all lights are tested
groupshared u32 ldsLightIdx[LIGHT_CAPACITY];  // Light index storage
groupshared u32 ldsLightIdxCounter; // Light index counter for the storage

void appendLightToList(int i)
{
  u32 dstIdx = 0;
  InterlockedAdd(ldsLightIdxCounter, 1, dstIdx);
  if (dstIdx < LIGHT_CAPACITY)
  {
    ldsLightIdx[dstIdx] = i;
  }
}

...

  // 1: computation of the frustum of a tile in view space
  float4 frustum[4];
  { // construct frustum
    float4 v[4];
    // projToView: 
    //   takes screen-space pixel indices and depth value
    //   returns coordinates in view space
    v[0] = projToView(8 * GET_GROUP_IDX,        8 * GET_GROUP_IDY,        1.f);
    v[1] = projToView(8 * (GET_GROUP_IDX + 1),  8 * GET_GROUP_IDY,        1.f);
    v[2] = projToView(8 * (GET_GROUP_IDX + 1),  8 * (GET_GROUP_IDY + 1),  1.f);
    v[3] = projToView(8 * GET_GROUP_IDX,        8 * (GET_GROUP_IDY + 1),  1.f);
    float4 o = make_float4(0.f, 0.f, 0.f, 0.f);
    for (int i = 0; i < 4; ++i)
    {
      // createEquation:
      //   Creates a plane equation from three vertex positions
      frustum[i] = createEquation(o, v[i], v[(i + 1) & 3]);
    }
  }

  ...

  // 2: clip the frustum by using the max / min depth values of the pixels in the tile
  float depth = depthIn.Load(uint3(GET_GLOBAL_IDX, GET_GLOBAL_IDY, 0));
  float4 viewPos = projToView(GET_GLOBAL_IDX, GET_GLOBAL_IDY, depth);

  int lIdx = GET_LOCAL_IDX + GET_LOCAL_IDY * 8;
  { // calculate bound
    if (lIdx == 0)  // initialize
    {
      ldsZMax = 0;  // max z coordinates
      ldsZMin = 0xffffffff; // min z coordinates
    }
    GroupMemoryBarrierWithGroupSync();
    u32 z = asuint(viewPos.z);
    if (depth != 1.f)
    {
      AtomMax(ldsZMax, z);
      AtomMin(ldsZMin, z);
    }
    GroupMemoryBarrierWithGroupSync();
    maxZ = asfloat(ldsZMax);
    minZ = asfloat(ldsZMin);
  }

  ...

  // 3: cull lights
  // 8 x 8 thread group is used, thus 64 lights are processed in parallel
  for (int i = 0; i < nBodies; i += 64)
  {
    int il = lIdx + i;
    if (il < nBodies)
    {
      // overlaps:
      //   light-geometry overlap check using separating axis theorem
      if (overlaps(frustum, gLightGeometry[i]))
      {
        // appendLightToList
        //   Store light index to the lsit of the overlapping lights
        appendLightToList(il);
      }
    }
  }

  ...

  // 4: fill the light indices to the assigned contiguous memory of gLightIdx using all the threads in a thread group
  { // write back
    u32 startOffset = 0;

    if (lIdx == 0)
    { // reserve memory
      if (ldsLightIdxCounter != 0)
      {
        InterlockedAdd(gLightIdxCounter, ldsLightIdxCounter, startOffset);

        ptLowerBound[tileIdx] = startOffset;
        ldsLightIdxStart = startOffset;
      }
      GroupMemoryBarrierWithGroupSync();
      startOffset = ldsLightIdxStart;

      for (int i = lIdx; i < ldsLightIdxCounter; i += 64)
      {
        gLightIdx[startOffset + i] = ldsLightIdx[i];
      }
    }
  }
```
<sup>[HaradaMcKeeYang13](#HaradaMcKeeYang13)</sup>

##### Scatter Approach

* Computes which tile a light overlaps and writes the light-and tile-index data to a buffer<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>
* Thread per light<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>
* The data of the buffer (ordered by light index at this point) needs to be sorted by tile index<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>
  * We want a list of light indices per tile
  * Radix sort
  * Run kernels to find the start and end offsets of each tile in the buffer

#### 2.5 Culling<sup>[Harada12](#Harada12)</sup>

* Additional memory usage
  * 0B global memory
  * 4B local memory per work group
* Additional computation complexity
  * A few bit and arithmetic instructions
  * A few lines of codes for light culling
  * No changes for other stages
* Additional runtime overhead
  * < 10% compared to the original light culling

IDEA:
* Split frustum in z direction
  * Uniform split for a frustum
  * Varying split among frustums

FRUSTUM CONSTRUCTION:
* Calculate depth bound
  * max/min values of depth
* Split depth direction into 32 cells
  * min value and cell size
* Flag occupied cell
  * 32 bit depth mask per work group

LIGHT CULLING:
* If a light overlaps to the frustum
  * Calculate depth mask for the light
  * Check overlap using the depth mask of the frustum
* Depth mask & Depth mask

```
 1: frustum[0-4] ← Compute 4 planes at the boundary of a tile
 2: z ← Fetch depth value of the pixel
 3: ldsMinZ ← atomMin(z)
 4: ldsMaxZ ← atomMax(z)
 5: frustum[5, 6] ← Compute 2 planes using ldsMinZ, ldsMaxZ
 6: depthMaskT ← atomOr(1 << getCellIndex(z))
 7: for all the lights do
 8:   iLight ← lights[i]
 9:   if overlaps(iLight, frustum) then
10:     depthMaskL ← Compute mask using light extent
11:     overlapping ← depthMaskT ∧ depthMaskL
12:     if overlapping then
13:       appendLight(i)
14:     end if
15:   end if
16: end for
17: flushLightIndices()
```

### Shading

* Goes through the list of lights and evaluates materials using information stored for each light<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>
* High pixel overdraw can kill performance<sup>[HaradaMcKeeYang12](#HaradaMcKeeYang12)</sup>
  * Depth Pre-Pass is critical

```c
#define LIGHT_LOOP_BEGIN
  int tileIndex = GetTileIndex(screenPos);
  uint startIndex;
  uint endIndex;
  GetTileOffsets(tileIndex, startIndex, endIndex);

  for (uint lightListIdx = startIdx; lightListIdx < endIdx; ++lightListIdx)
  {
    int lightIdx = LightIndexBuffer[lightListIdx];
    LightParams directLight;
    LightParams indirectLight;

    if (isIndirectLight(lightIdx))
    {
      FetchIndirectLight(lightIdx, indirectLight);
    }
    else
    {
      FetchDirectLight(lightIndex, directLight);
    }
#define LIGHT_LOOP_END
  }

...

float4 PS( PSInput i ) : SV_TARGET
{
  float3 colorOut = 0;
#LIGHT_LOOP_BEGIN
  colorOut += EvaluateMicrofacet(directLight, indirectLight);
#LIGHT_LOOP_END
  return float4(colorOut, 1.f);
}
```
<sup>[HaradaMcKeeYang13](#HaradaMcKeeYang13)</sup>

### Render Passes<sup>[HaradaMcKeeYang13](#HaradaMcKeeYang13)</sup>

![Forward+RenderPasses](/Images/DeferredShading/Forward%2BRenderPasses.png)

#### One-Bounce Indirect Illumination<sup>[HaradaMcKeeYang13](#HaradaMcKeeYang13)</sup>

* Generate a reflective shadow map(RSM) of the scene from the point of view of the light
  * Normal buffer, color buffer, world-space buffers are generated
* CS is executed to create spotlights at the location captured in the RSM
  * Generated spotlights are appended to the main light list

## Forward++ Rendering<sup>[StewartThomas13](#StewartThomas13)</sup>

* Alpha Blended Geometry
* Shadow Casting Lights
* Global Illumination using VPLs
* Optimizations for depth discontinuities

### Alpha Blended Geometry

* Can't use the opaque scene's light lists
  * Frustum's z extent was based on the opaque z-buffer
* Render blended geometry to new z-buffer
* Compute new set of tiled light lists
  * minZ calculated from blended z-buffer
  * maxZ calculated from opaque z-buffer
* Render blended scene using new light lists
* Geometry rendered using two-sided lighting
  * Suitable for window glass & game objects
  * Particle systems are better off using a custom method
    * Calculating list of lights per emitter
    * Lighting in vertex shader
* Two-sided lighting:
  * Lighting func that accumulates lighting for front and back faces

### Shadow Casting Lights

* Render shadow maps
  * 2D Texture Atlas or Texture Array
* For each shadow casting lights, store shadow map index in alpha channel of light color
* Use dynamic branch in forward lighting pass to compute shadow term

```c
// global list of lights (shadow casting + non-shadow casting)
uint shadowIndex = uint(g_PointLightColor[lightIndex].a * 255.0);
if (shadowIndex < 255)  // is it shadow casting?
{
  // Point light
  int face = DirectionToCubeMapFace(lightDirection);

  // pixel position to light space where the cube map faces
  float4 texCoord = mul(float4(position, 1), g_ShadowViewProj[shadowIndex][face]);
  texCoord.xyz /= texCoord.w;
  texCoord.xy = 0.5 * texCoord.xy + 0.5;

  // undersample per face
  texCoord.xy *= g_ShadowScaleAndBias.xx;
  texCoord.xy *= g_ShadowScaleAndBias.yy;

  // set texture coordinates in the atlas
  texCoord.xy += float2(face, shadowIndex);
  texCoord.xy *= rcp(float2(6, MAX_POINT_LIGHT_SHADOWS));

  texCoord.z -= g_ShadowZBias;

  // hardware PCF
  shadowTerm = FilterShadow(g_PointLightShadowAtlas, texCoord.xyz);
}
```

* Only update shadow maps if necessary
  * If geometry has changed
  * If lighting position has changed
  * Spread cost of update over multiple frames
  * Be mindful of multi GPU scenarios
* Index into projected texture in similar manner to shadow maps
  * Bit pack the index along with the shadow map index

#### Depth Discontinuities

* Reduce false positives at depth discontinuities
* Two methods presented
  1. Split depth range in two at halfway point
     * Keep two light lists per tile (one for each depth region)
     * In the forward shading pass, each pixel determines which list to use 
  2. 2.5D, partition depth range into 32 cells
     * Determine the cell for each pixel in the tile
     * Make a bit mask representing which cells are occupied in that tile
     * Each light gets a similar bit mask (easy for spheres)
     * Logical AND the light bit mask with the tile bit mask 

## Clustered Forward+<sup>[Leadbetter14](#Leadbetter14)</sup>

* Avoids the need for a depth pre-pass by calculating light lists at multiple depths for each sub-rectangle and using the most appropriate cluster during surface shading.

# Deferred Rendering

Goal:
* Decouple shading from geometric complexity<sup>[Olsson15](#Olsson15)</sup>
* Solve overdraw (shade once / sample)<sup>[Olsson15](#Olsson15)</sup>

Q: Why deferred rendering?<br>
A: Combine conventional rendering techniques with the advantages of image space techniques<sup>[Calver03](#Calver03)</sup>

* Advantages:
  * Lights major cost is based on the screen area covered<sup>[Calver03](#Calver03)</sup>, Predictable performance proportional to the lights' screen-space areas<sup>[Shishkovtsov05](#Shishkovtsov05)</sup><sup>[Valient07](#Valient07)</sup>
  * All lighting is per-pixel and all surfaces are lit equally<sup>[Calver03](#Calver03)</sup><sup>[Thibieroz04](#Thibieroz04)</sup>
  * Lights can be occluded like other objects, this allows fast hardware Z-Reject<sup>[Calver03](#Calver03)</sup>
  * Shadow mapping is fairly cheap<sup>[Calver03](#Calver03)</sup>
  * Easily integrates with popular shadow techniques<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Placeres06](#Placeres06)</sup>
  * Excellent batching<sup>[Hargreaves04](#Hargreaves04)</sup>, Greatly simplifies batching<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>, Cuts down on large numbers of batches<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
  * Render each triangle exactly once<sup>[Hargreaves04](#Hargreaves04)</sup>, Only a single geometry pass is required<sup>[Thibieroz04](#Thibieroz04)</sup><sup>[Lee09](#Lee09)</sup><sup>[Thibieroz11](#Thibieroz11)</sup>, Executes only texturing on geometry so it suffers less from partial quads, overdraw<sup>[Pesce14](#Pesce14)</sup><sup>[Olsson15](#Olsson15)</sup>
  * Shade each visible pixel exactly once<sup>[Hargreaves04](#Hargreaves04)</sup>, "Perfect" O(1) depth complexity for lighting<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Thibieroz04](#Thibieroz04)</sup>, Perfect depth complexity for lighting<sup>[Shishkovtsov05](#Shishkovtsov05)</sup><sup>[Placeres06](#Placeres06)</sup><sup>[KnightRitchieParrish11](#KnightRitchieParrish11)</sup><sup>[Olsson15](#Olsson15)</sup>
  * Easy to add new types of lighting shader<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[Koonce07](#Koonce07)</sup>
  * Other kinds of postprocessing(blur, heathaze) are just special lights, and fit neatly into the existing framework<sup>[Hargreaves04](#Hargreaves04)</sup>, Simplifies rendering of multiple special effects<sup>[Placeres06](#Placeres06)</sup>, G-Buffer already produces data required for post-processing<sup>[Thibieroz11](#Thibieroz11)</sup>
  * Simple engine management<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
  * Lots of small lights ~ one big light<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
    * Forward can do it too!<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>
  * Reduces CPU usage<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
  * Lighting costs are independent of scene complexity<sup>[Koonce07](#Koonce07)</sup>, Adding more layers of effects generally results in a linear, fixed cost per frame for additional full-screen post-processing passes regardless of the number of models on screen<sup>[FilionMcNaughton08](#FilionMcNaughton08)</sup><sup>[EngelShaderX709](#EngelShaderX709)</sup><sup>[EngelSiggraph09](#EngelSiggraph09)</sup><sup>[Kaplanyan10](#Kaplanyan10)</sup><sup>[KnightRitchieParrish11](#KnightRitchieParrish11)</sup><sup>[Thibieroz11](#Thibieroz11)</sup>
  * No additional render passes on geometry for lighting, resulting in fewer draw calls and fewer state changes required to render the scene<sup>[Koonce07](#Koonce07)</sup><sup>[EngelSiggraph09](#EngelSiggraph09)</sup><sup>[Thibieroz11](#Thibieroz11)</sup>, Less draw calls, less shader permutations, one or few lighting shaders that can be hand-optimized well<sup>[Pesce14](#Pesce14)</sup><sup>[Schulz14](#Schulz14)</sup>
  * Material shaders do not perform lighting, freeing up instructions for additional geometry processing<sup>[Koonce07](#Koonce07)</sup>
  * Simpler shaders<sup>[Valient07](#Valient07)</sup>
  * More complex materials can be implemented<sup>[Lee09](#Lee09)</sup>
  * Not all buffers need to be updated with matching data, e.g., decal tricks
  * Faster lighting<sup>[KnightRitchieParrish11](#KnightRitchieParrish11)</sup>
  * Decouples texturing from lighting<sup>[Pesce14](#Pesce14)</sup>
  * Potentially can be faster on complex shaders<sup>[Pesce14](#Pesce14)</sup>
  * Allows volumetric or multipass decals (and special effects) on the G-Buffer (without computing the lighting twice)<sup>[Pesce14](#Pesce14)</sup>
  * Allows full-screen material passes like analytic geometric specular antialiasing (pre-filtering), which really works only done on the G-Buffer<sup>[Pesce14](#Pesce14)</sup>
  * Fails in forward on all hard edges (split normals), and screen-space subsurface scattering<sup>[Pesce14](#Pesce14)</sup>
  * Trivial light management<sup>[Olsson15](#Olsson15)</sup>
    * Enables many lights
  * Simple (light) shader management<sup>[Olsson15](#Olsson15)</sup>
  * Shadow map reuse<sup>[Olsson15](#Olsson15)</sup>
* Disadvantages:
  * Large frame-buffer size<sup>[Calver03](#Calver03)</sup>, Framebuffer bandwidth can easily get out of hand<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[Placeres06](#Placeres06)</sup><sup>[EngelSiggraph09](#EngelSiggraph09)</sup><sup>[Kaplanyan10](#Kaplanyan10)</sup><sup>[Thibieroz11](#Thibieroz11)</sup><sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup><sup>[Pesce14](#Pesce14)</sup><sup>[Olsson15](#Olsson15)</sup>
  * Potentially high fill-rate<sup>[Calver03](#Calver03)</sup><sup>[Placeres06](#Placeres06)</sup><sup>[Kaplanyan10](#Kaplanyan10)</sup><sup>[Lauritzen10](#Lauritzen10)</sup><sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup><sup>[StewartThomas13](#StewartThomas13)</sup><sup>[Pesce14](#Pesce14)</sup><sup>[Olsson15](#Olsson15)</sup>
    * Reading lighting inputs from G-Buffer is an overhead<sup>[Lauritzen10](#Lauritzen10)</sup>
    * Accumulating ligthing with additive blending is an overhead<sup>[Lauritzen10](#Lauritzen10)</sup>
      * Requires high precision<sup>[Olsson15](#Olsson15)</sup>
  * Multiple light equations difficult<sup>[Calver03](#Calver03)</sup>, Forces a single lighting model across the entire scene (everything has to be 100% per-pixel)<sup>[Hargreaves04](#Hargreaves04)</sup>
  * ~~High hardware specifications<sup>[Calver03](#Calver03)</sup>~~
  * Transparency is very hard<sup>[Calver03](#Calver03)</sup>, Alpha blending is a nightmare!<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[Placeres06](#Placeres06)</sup><sup>[Valient07](#Valient07)</sup><sup>[Kaplanyan10](#Kaplanyan10)</sup><sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>, Forward rendering required for translucent objects<sup>[Thibieroz11](#Thibieroz11)</sup><sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup><sup>[Pesce14](#Pesce14)</sup><sup>[Olsson15](#Olsson15)</sup>
    * If a tiled or clustered deferred is used, the light information can be passed to a forward+ pass for transparencies
  * Can't take advantage of hardware multisampling<sup>[Hargreaves04](#Hargreaves04)</sup> AA is problematic<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Placeres06](#Placeres06)</sup> MSAA difficult compared to Forward Renderer<sup>[EngelSiggraph09](#EngelSiggraph09)</sup><sup>[Kaplanyan10](#Kaplanyan10)</sup><sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>, Costly and complex MSAA<sup>[Thibieroz11](#Thibieroz11)</sup><sup>[StewartThomas13](#StewartThomas13)</sup>
    * MYTH!! MSAA did not prove to be an issue!!<sup>[Valient07](#Valient07)</sup>
    * Existing multi-sampling techniques are too heavy for deferred pipeline<sup>[Kaplanyan10](#Kaplanyan10)</sup>
    * Post-process antialiasing doesn't remove aliasing completely<sup>[Kaplanyan10](#Kaplanyan10)</sup>
      * Need to super-sample in most cases
  * ~~Not good approach for older hardware<sup>[Hargreaves04](#Hargreaves04)</sup>~~
  * ~~Not good when you have many directional lights<sup>[HargreavesHarris04](#HargreavesHarris04)</sup>~~
    * ~~Shading complexity will be O(R * L) (R = screen resolution, L = lights)~~
    * MYTH!!<sup>[Shishkovtsov05](#Shishkovtsov05)</sup>
  * Recalculate full lighting equation for every light<sup>[EngelSiggraph09](#EngelSiggraph09)</sup>
  * Limited material representation in G-Buffer<sup>[EngelSiggraph09](#EngelSiggraph09)</sup>, Limited materials variations<sup>[Kaplanyan10](#Kaplanyan10)</sup><sup>[Pesce14](#Pesce14)</sup>
    * MYTH?<sup>[Lee09](#Lee09)</sup>
    * Only Phong BRDF (normal + glossiness)<sup>[Kaplanyan10](#Kaplanyan10)</sup>
      * No aniso materials<sup>[Kaplanyan10](#Kaplanyan10)</sup>
  * Can't do lighting computations per object/vertex (i.e. GI), needs to pass everything per pixel in the G-Buffer<sup>[Pesce14](#Pesce14)</sup>
    * Alternative: store baked data in a voxel structured
  * Accessing lighting related textures (gobos, cubemaps) might be less cache-coherent<sup>[Pesce14](#Pesce14)</sup>
  * All lights (that cast shadows) must have their shadow maps built before the shading pass<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
  * Significant engine rework<sup>[Thibieroz11](#Thibieroz11)</sup>
  * In general it has lots of enticing benefits over forward, and it -might- be faster in complex lighting / material / decal scenarios, but the baseline simple lighting/shading case is much more expensive<sup>[Pesce14](#Pesce14)</sup>
  * Difficult to do multiple shading models<sup>[Olsson15](#Olsson15)</sup>
    * Custom shaders

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

Traditional deferred shading:<sup>[Andersson09](#Andersson09)</sup>
1. Graphics pipeline rasterizes gbuffer for opaque surfaces
   * Normal, albedos, roughness, etc. 
   * Render scene geometry into G-Buffer MRT<sup>[StewartThomas13](#StewartThomas13)</sup>
     * Store material properties (albedo, specular, normal, etc.)
     * Write to depth buffer as normal
2. Light sources are rendered & accumulate lighting to a texture (accumulation buffer)<sup>[StewartThomas13](#StewartThomas13)</sup>
   * Light volume or screen-space tile rendering 
   * Use G-Buffer RTs as inputs<sup>[StewartThomas13](#StewartThomas13)</sup>
   * Render geometries enclosing light area<sup>[StewartThomas13](#StewartThomas13)</sup>
3. Combine shading & lighting for final output

Modern Deferred Shading:<sup>[Olsson15](#Olsson15)</sup>
1. Render Scene to G-Buffers
2. Light Assignment
   * Build Light Acceleration Structure (Grid) 
3. Full Screen Pass
   * Quad (or CUDA, or Compute Shaders, or SPUs)
   * For each pixel
     * Fetch G-Buffer Data
     * Look up light list in acceleration structure
     * Loop over lights and accumulate shading
     * Write shading

* Worst case complexity is num_objects + num_lights<sup>[Hargreaves04](#Hargreaves04)</sup>
* Perfect batching<sup>[Hargreaves04](#Hargreaves04)</sup>
* Many small lights are just as cheap as a few big ones<sup>[Hargreaves04](#Hargreaves04)</sup>
* On MMO, given the lack of control of the game environment and the poort scalability of lighting costs within a forward renderer, deferred-shading renderer is preferable<sup>[Koonce07](#Koonce07)</sup>
* Object rendering pass saves all surface parameters<sup>[KimBarrero11](#KimBarrero11)</sup>
* Lighting pass saves lighting result<sup>[KimBarrero11](#KimBarrero11)</sup>
* Combiner pass combines lighting result + surface material in screen space<sup>[KimBarrero11](#KimBarrero11)</sup>

# G-Buffers

G-Buffers are 2D images that store geometric details in a texture, storing positions, normals and other details at every pixel. The key ingredient to hardware acceleration of G-Buffers is having the precision to store and process data such as position on a per-pixel basis. The higher precision we have to store the G-Buffer at, the slower the hardware renders.<sup>[Calver03](#Calver03)</sup>

## Thin G-Buffer

The smaller the better!<sup>[Kaplanyan10](#Kaplanyan10)</sup>

* Crysis 3:<sup>[SousaWenzelRaine13](#SousaWenzelRaine13)</sup>
  * Minimize redundant drawcalls
  * AB details on G-Buffer with proper glossiness
  * Tons of vegetation &rarr; Deferred translucency
  * Multiplatform friendly

* Advantages:
  * Unified solution across all platforms<sup>[SousaWenzelRaine13](#SousaWenzelRaine13)</sup>
  * Deferred Rendering for less BW/Memory than vanilla<sup>[SousaWenzelRaine13](#SousaWenzelRaine13)</sup>
    * Good for MSAA + avoiding tiled rendering on Xbox360
  * Tackle glossiness for transparent geometry on G-Buffer
    * Alpha blended cases, e.g. Decals, Deferred Decals, Terrain Layers
    * Can composite all such cases directly into G-Buffer
    * Avoid need for multipass
  * Deferred sub-surface scattering
    * Visual + performance win, in particular for vegetation rendering

## What to Store?

### Depth

<sup>[Calver03](#Calver03)</sup><sup>[Hargreaves04](#Hargreaves04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Thibieroz04](#Thibieroz04)</sup><sup>[Placeres06](#Placeres06)</sup><sup>[FilionMcNaughton08](#FilionMcNaughton08)</sup><sup>[EngelShaderX709](#EngelShaderX709)</sup><sup>[EngelSiggraph09](#EngelSiggraph09)</sup><sup>[Lee09](#Lee09)</sup><sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup><sup>[Kaplanyan10](#Kaplanyan10)</sup><sup>[KnightRitchieParrish11](#KnightRitchieParrish11)</sup><sup>[Thibieroz11](#Thibieroz11)</sup>

Use depth data to reconstruct position data. Provided by the depth buffer.

Format Suggestion:
24bpp<sup>[Kaplanyan10](#Kaplanyan10)</sup>

* In GBuffer, `G_Buffer.z = length(Input.PosInViewSpace);`
* In VS, `out.vEyeToScreen = float3(Input.ScreenPos.x * ViewAspect, Input.ScreenPos.y, invTanHalfFOV);`
* In PS, `float3 PixelPos = normalize(Input.vEyeToScreen) * G_Buffer.z;`<sup>[Placeres06](#Placeres06)</sup>


```
float3 vViewPos.xy = INTERPOLANT VPOS * half2(2.0f, -2.0f) + half2(-1.0f, 1.0f)) * 0.5 * p vCameraNearSize * p vRecipRenderTargetSize;
vViewPos.zw = half2(1.0f, 1.0f);
vViewPos.xyz = vViewPos.xyz * fSampledDepth;
float3 vWorldPos = mul(p_mInvViewTransform, vViewPos).xyz;
```
<sup>[FilionMcNaughton08](#FilionMcNaughton08)</sup>

```
// input SV_POSITION as pos2d
New_pos2d = ((pos2d.xy) * (2 / screenres.xy)) - float2(1, 1);
viewSpacePos.x = gbuffer_depth * tan(90 - HORZFOV/2) * New_pos2d.x;
viewSpacePos.y = gbuffer_depth * tan(90 - VERTFOV/2) * New_pos2d.y;
viewSpacePos.z = gbuffer_depth;
```
<sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup>

### Stencil

<sup>[Kaplanyan10](#Kaplanyan10)</sup>

Format Suggestion:
* 8bpp

Stencil to mark objects in lighting groups<sup>[Kaplanyan10](#Kaplanyan10)</sup>
* Portals / indoors
* Custom environment reflections
* Different ambient and indirect lighting

### Normal

<sup>[Calver03](#Calver03)</sup><sup>[Hargreaves04](#Hargreaves04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Thibieroz04](#Thibieroz04)</sup><sup>[Placeres06](#Placeres06)</sup><sup>[Andersson09](#Andersson09)</sup><sup>[EngelShaderX709](#EngelShaderX709)</sup><sup>[EngelSiggraph09](#EngelSiggraph09)</sup><sup>[Lee09](#Lee09)</sup><sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup><sup>[Kaplanyan10](#Kaplanyan10)</sup><sup>[KnightRitchieParrish11](#KnightRitchieParrish11)</sup><sup>[Thibieroz11](#Thibieroz11)</sup>

Format Suggestions:
* `R10G10B10A2_FLOAT`<sup>[Hargreaves04](#Hargreaves04)</sup>
* `U10V10W10A2`<sup>[Thibieroz04](#Thibieroz04)</sup>, `U8V8W8Q8`<sup>[Thibieroz04](#Thibieroz04)</sup>
* 24bpp<sup>[Kaplanyan10](#Kaplanyan10)</sup>
  * Too quantized
  * Lighting is banded / of low quality

Considerations:
* Model space vs Tangent space<sup>[Thibieroz04](#Thibieroz04)</sup>

Optimizations:
* Reconstruct z from xy(z = sqrt(1 - x<sup>2</sup> - y<sup>2</sup>))<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Placeres06](#Placeres06)</sup>
* If all the lighting is performed in view space, then the front-faced polygons are always gonig to have negative or positive Z components<sup>[Placeres06](#Placeres06)</sup>

Packing:
```
float2 pack_normal(float3 norm)
{
  float2 res;
  res = 0.5 * (norm.xy + float2(1, 1));
  res.x *= (norm.z < 0 ? -1.0 : 1.0);
  return res;
}
```

Unpacking:
```
float3 unpack_normal(float2 norm)
{
  float3 res;
  res.xy = (2.0 * abs(norm)) - float2(1, 1);
  res.z = (norm.x < 0 ? -1.0 : 1.0) * sqrt(abs(1 - res.x * res.x - res.y * res.y));
  return res;
}
```

* Because we are storing normalized normals, we are wasting 24bpp.<sup>[Kaplanyan10](#Kaplanyan10)</sup>
* Create a cube of 256<sup>3</sup> values, and find the quantized value with the minimal error for a ray. Bake this into a cubemap of results.<sup>[Kaplanyan10](#Kaplanyan10)</sup>
* Extract the most meaningful and unique part of this symmetric cubemap
* Save into 2D texture
* Look it up during G-Buffer generation
* Scale the normal
* Output the adjusted normal into G-Buffer

### Diffuse Albedo

<sup>[Calver03](#Calver03)</sup><sup>[Hargreaves04](#Hargreaves04)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Thibieroz04](#Thibieroz04)</sup><sup>[Andersson09](#Andersson09)</sup><sup>[EngelShaderX709](#EngelShaderX709)</sup><sup>[EngelSiggraph09](#EngelSiggraph09)</sup><sup>[Lee09](#Lee09)</sup><sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup><sup>[KnightRitchieParrish11](#KnightRitchieParrish11)</sup><sup>[Thibieroz11](#Thibieroz11)</sup>

Format Suggestions:
`R8G8B8A8`<sup>[Hargreaves04](#Hargreaves04)</sup><sup>[Thibieroz04](#Thibieroz04)</sup>

### Etc.

* Specular / Exponent Map<sup>[Calver03](#Calver03)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
* Emissive<sup>[Calver03](#Calver03)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup>
* Light Map<sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[Lee09](#Lee09)</sup>
* Material ID<sup>[Calver03](#Calver03)</sup><sup>[HargreavesHarris04](#HargreavesHarris04)</sup><sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup>
* Roughness<sup>[Andersson09](#Andersson09)</sup>
* AO<sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup>
* Glossiness<sup>[Lee09](#Lee09)</sup><sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup><sup>[Kaplanyan10](#Kaplanyan10)</sup>
  * 8bpp<sup>[Kaplanyan10](#Kaplanyan10)</sup>
  * Non deferrable<sup>[Kaplanyan10](#Kaplanyan10)</sup>
    * Required at lighting accumulation pass
    * Specular is non-accumulative otherwise
* Specular Power<sup>[EngelShaderX709](#EngelShaderX709)</sup><sup>[EngelSiggraph09](#EngelSiggraph09)</sup><sup>[Lee09](#Lee09)</sup>
* Motion Vector<sup>[EngelShaderX709](#EngelShaderX709)</sup><sup>[EngelSiggraph09](#EngelSiggraph09)</sup>
* Shadow<sup>[EngelShaderX709](#EngelShaderX709)</sup><sup>[EngelSiggraph09](#EngelSiggraph09)</sup>
* Specular Terms<sup>[Thibieroz11](#Thibieroz11)</sup>

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

### Example 6: S.T.A.L.E.R: Clear Skies<sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup>

S.T.A.L.K.E.R. originally used a 3-RT G-Buffer:
* 3D Pos + material ID (RGBA16F RT0)
* Normal + AO (RGBA16F RT1)
* Color + Gloss (RGBA8 RT2)

S.T.A.L.E.R: Clear Skies:
* Normal + Depth + Material ID + AO (RGBA16F RT0)
  * Pack AO and material ID into the usable bits of the last 16 bit fp channel of RT0
    * Pack data into a 32bit `uint` as a bit pattern that is a valid 16bit fp number
    * Cast the `uint` to float using `asfloat()`
    * Cast back for unpacking using `asuint()`
    * Extract bits
* Color + Gloss (RGBA8 RT1)
* Trade packing math vs. Less G-Buffer texture ops

### Example 7: Split/Second<sup>[KnightRitchieParrish11](#KnightRitchieParrish11)</sup>

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
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Diffuse Albedo.R</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Diffuse Albedo.G</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Diffuse Albedo.B</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Specular amount</td>
</tr>
<tr>
<td>RT 1</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Normal.X</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Normal.Y</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Normal.Z</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Motion ID + MSAA edge</td>
</tr>
<tr>
<td>RT 3</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Prelit.R</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Prelit.G</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Prelit.B</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Specular power</td>
</tr>
</tbody>
</table>

### Example 8: Crysis 3<sup>[SousaWenzelRaine13](#SousaWenzelRaine13)</sup>

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
<td colspan="3" style="background-color:rgba(127, 127, 127, 0.5); color:white">Depth D24</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">AmbID, Decals S8</td>
</tr>
<tr>
<td>RT 0</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Normal.X R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Normal.Y G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Gloss, Z Sign B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Translucency A8</td>
</tr>
<tr>
<td>RT 1</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Diffuse Albedo.Y R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Diffuse Albedo.Cb, .Cr G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Specular Y B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Per-Project A8</td>
</tr>
</tbody>
</table>

* WS Normal packed into 2 components
  * Stereographic projection worked ok in practice (also cheap)
  * (X, Y) = (x / (1 - z), y / (1 - z))
  * (x, y, z) = (2X / (1 + X<sup>2</sup> + Y<sup>2</sup>), 2Y / (1 + X<sup>2</sup> + Y<sup>2</sup>), (-1 + X<sup>2</sup> + Y<sup>2</sup>) / (1 + X<sup>2</sup> + Y<sup>2</sup>))
* Glossiness + Normal Z Sign packed together
  * GlossZsign = (Gloss * Zsign) * 0.5 + 0.5
* Albedo in Y'CbCr color space
  * Y' = 0.299 &times; R + 0.587 &times; G + 0.114 &times; B
  * C<sub>B</sub> = 0.5 + (-0.168 &times; R - 0.331 &times; G + 0.5 &times; B)
  * C<sub>R</sub> = 0.5 + (0.5 &times; R - 0.418 &times; G - 0.081 &times; B)
  * R = Y' + 1.402 &times; (C<sub>R</sub> - 0.5)
  * G = Y' - 0.344 &times; (C<sub>B</sub> - 0.5) - 0.714 &times; (C<sub>R</sub> - 0.5)
  * B = Y' - 1.772 &times; (C<sub>B</sub> - 0.5)

### Example 9: Destiny<sup>[TatarchukTchouVenzon13](#TatarchukTchouVenzon13)</sup>

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
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Diffuse Albedo.R R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Diffuse Albedo.G G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Diffuse Albedo.B B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">AO A8</td>
</tr>
<tr>
<td>RT 1</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Normal.X * (Biased Specular Smoothness) R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Normal.Y * (Biased Specular Smoothness) G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Normal.Z * (Biased Specular Smoothness) B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Material ID A8</td>
</tr>
<tr>
<td>DS</td>
<td colspan="3" style="background-color:rgba(127, 127, 127, 0.5); color:white">Depth D24</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Stencil S8</td>
</tr>
</tbody>
</table>

### Example 10: inFAMOUS: Second Son<sup>[Bentley14](#Bentley14)</sup>

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
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Diffuse Albedo.R R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Diffuse Albedo.G G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Diffuse Albedo.B B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Shadow Refr A8</td>
</tr>
<tr>
<td>RT 1</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Normal.&alpha; R16</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Normal.&beta; G16</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Vertex Normal.&alpha; B16</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Vertex Normal.&beta; A16</td>
</tr>
<tr>
<td>RT 2</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Sun Shadow R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">AO G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Spec Occl B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Gloss A8</td>
</tr>
<tr>
<td>RT 3</td>
<td colspan="4" style="background-color:rgba(255, 255, 255, 0.5); color:white">Wetness Params RGBA8</td>
</tr>
<td>RT 4</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Ambient Diffuse.R R16F</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Ambient Diffuse.G G16F</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Ambient Diffuse.B B16F</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Amb Atten A16F</td>
</tr>
<td>RT 5</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Emissive.R R16F</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Emissive.G G16F</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Emissive.B B16F</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Alpha A16F</td>
</tr>
<tr>
<td>D32f</td>
<td colspan="4" style="background-color:rgba(127, 127, 127, 0.5); color:white">Depth D24</td>
</tr>
<tr>
<td>S8</td>
<td colspan="4" style="background-color:rgba(255, 255, 255, 0.5); color:white">Stencil S8</td>
</tr>
</tbody>
</table>

### Example 11: Ryze<sup>[Schulz14](#Schulz14)</sup>

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
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Normal.X R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Normal.Y G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Normal.Z B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Translucency Luminance / Prebaked AO Term A8</td>
</tr>
<tr>
<td>RT 1</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Diffuse Albedo.R R8</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">Diffuse Albedo.G G8</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">Diffuse Albedo.B B8</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">Subsurface Scatering Profile A8</td>
</tr>
<tr>
<td>RT 2</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">Roughness R8</td>
<td colspan="3"style="background-color:rgba(127, 255, 255, 0.5); color:white">Specular YCbCr / Transmittance CbCr GBA8</td>
</tr>
</tbody>
</table>

* Normals encoded using BFN approach to avoid 8 bit precision issues
* Specular color stored as YCbCr to better support blending to GBuffer (e.g. decals)
  * Allow blending of non-metal decals despite not being able to write alpha during blend ops
  * Can still break when blending colored specular (rare case that was avoided on art side)
* Specular chrominance aliased with transmittance luminance
  * Exploiting mutual exclusivity: colored specular just for metal, translucency just for dielectrics
* Support for prebaked AO value but was just used rarely in the end

### Example 12: Uncharted 4<sup>[ElGarawany16](#ElGarawany16)</sup>

* 16 bits-per-pixel unsigned buffers
* Constantly moving bits around between features during production
  * Lots of visual tests to determine exactly how many bits were needed for the various features
* Heavy use of GCN parameter packing intrinsics

<table>
<thead>
<tr>
<th>Channels</th>
<th>G-Buffer 0</th>
<th>Channels</th>
<th>G-Buffer 1</th>
</tr>
</thead>
<tbody>
<tr>
<td>R</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">r g</td>
<td>R</td>
<td style="background-color:rgba(255, 0, 0, 0.5); color:white">ambientTranslucency sunShadowHigh specOcclusion</td>
</tr>
<tr>
<td>G</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">b spec</td>
<td>G</td>
<td style="background-color:rgba(0, 255, 0, 0.5); color:white">heightmapShadowing sunShadowLow metallic</td>
</tr>
<tr>
<td>B</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">normalx normaly</td>
<td>B</td>
<td style="background-color:rgba(0, 0, 255, 0.5); color:white">dominantDirectionX dominantDirectionY</td>
</tr>
<tr>
<td>A</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">iblUseParent normalExtra roughness</td>
<td>A</td>
<td style="background-color:rgba(255, 255, 255, 0.5); color:white">ao extraMaterialMask sheen thinWallTranslucency</td>
</tr>
</tbody>
</table>

* A third optional G-Buffer is used by more complicated materials
  * Interpreted differently based on the type of the material
  * Fabric, hair, skin, silk, etc.

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

### Optimizations

#### Export Cost

* Render objects in front-to-back order<sup>[Thibieroz11](#Thibieroz11)</sup>
* Use fewer render targets in your MRT config<sup>[Thibieroz11](#Thibieroz11)</sup>
  * Less fetches during shading passes
  * Less memory usage
* Avoid slow formats<sup>[Thibieroz11](#Thibieroz11)</sup>
* Data Packing<sup>[Thibieroz11](#Thibieroz11)</sup>
  * Trade render target storage for a few extra ALU instructions

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

Add lighting contributions into accumulation buffer<sup>[Thibieroz11](#Thibieroz11)</sup>
* Use G-Buffer RTs as inputs
* Render geometries enclosing light area

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


Per-Sample Pixel Shader Execution:<sup>[Thibieroz09](#Thibieroz09)</sup>

```c
struct PS_INPUT_EDGE_SAMPLE
{
  float4 Pos : SV_POSITION;
  uint uSample : SV_SAMPLEINDEX;
};

// Multisampled G-Buffer textures declaration
Texture2DMS <float4, NUM_SAMPLES> txMRT0;
Texture2DMS <float4, NUM_SAMPLES> txMRT1;
Texture2DMS <float4, NUM_SAMPLES> txMRT2;
// Pixel shader for shading pass of edge samples in DX10.1
// This shader is run at sample frequency
// Used with the following depth-stencil state values so that only
// samples belonging to edge pixels are rendered, as detected in
// the previous stencil pass.
// StencilEnable = TRUE
// StencilReadMask = 0x80
// Front/BackFaceStencilFail = Keep
// Front/BackfaceStencilDepthFail = Keep
// Front/BackfaceStencilPass = Keep;
// Front/BackfaceStencilFunc = Equal;
// The stencil reference value is set to 0x80

float4 PSLightPass_EdgeSampleOnly( PS_INPUT_EDGE_SAMPLE input ) : SV_TARGET
{
  // Convert screen coordinates to integer
  int3 nScreenCoordinates = int3(input.Pos.xy, 0);
  
  // Sample G-Buffer textures for current sample
  float4 MRT0 = txMRT0.Load( nScreenCoordinates, input.uSample);
  float4 MRT1 = txMRT1.Load( nScreenCoordinates, input.uSample);
  float4 MRT2 = txMRT2.Load( nScreenCoordinates, input.uSample);
  
  // Apply light equation to this sample
  float4 vColor = LightEquation(MRT0, MRT1, MRT2);
  
  // Return calculated sample color
  return vColor;
}
```

Conventional Deferred Shading<sup>[Lauritzen10](#Lauritzen10)</sup>:
* For each light
  * Use rasterizer to scatter light volume and cull
  * Read lighting inputs from G-Buffer
  * Compute lighting
  * Accumulate lighting with additive blending
* Reorders computation to extract coherence

Modern Implementation<sup>[Lauritzen10](#Lauritzen10)</sup>:
* Cull with screen-aligned quads
  * Cover light extents with axis-aligned bounding box
    * Full light meshes(spheres, cones) are generally overkill
    * Can use oriented bounding box for narrow spot lights
  * Use conservative single-direction depth test
    * Two-pass stencil is more expensive than it is worth
    * Depth bounds test on some hardware, but not batch-friendly

```c
for each G-Buffer sample
{
  sampleAttr = load attributes from G-Buffer

  for each light
  {
    color += shade(sampleAttr, light)
  }

  output pixel color;
}
```
<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>

```c
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform float lightRange;

void main()
{
  vec3 color = texelFetch(colorTex, gl_FragCoord.xy);
  vec3 specular = texelFetch(specularTEx, gl_FragCoord.xy);
  vec3 normal = texelFetch(normalTex, gl_FragCoord.xy);
  vec3 position = fetchPosition(gl_FragCoord.xy);

  vec3 shading = doLight(position, normal, color,
                         specular, lightPosition,
                         lightColor, lightRange);

  resultColor = vec4(shading, 1.0);
}
```
<sup>[Olsson15](#Olsson15)</sup>

### Bandwidth Problem<sup>[Olsson15](#Olsson15)</sup>

* New type of overdraw
  * Light overdraw
* N lights cover a certain pixel
  * N reads from the same G-Buffer location

```
for each light
  for each covered pixel
    read G-Buffer // repeated reads
    compute shading
    read + write frame buffer // repeated reads and writes
```

* Re-write loop!

```
for each pixel
  read G-Buffer
  for each affecting light
    compute shading
  write frame buffer
```

* Modern shading solution:

```
for each pixel
  read G-Buffer
  for each possibly affecting light
    if affecting
      compute shading
  write frame buffer
```

* Share between groups of similar pixels
  * Lots of coherency between samples
  * Coherent access
  * Little storage
  * Conservatice lists

### Pre-Tiled Shading

Weaknesses:<sup>[Andersson11](#Andersson11)</sup>
* Massive overdraw & ROP cost when having lots of big light sources
* Expensive to have multiple per-pixel materials in light shaders
* MSAA lighting can be slow (non-coherent, extra bandwidth)

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

##### Accessing Light Properties

* Avoid using dynamic constant buffer indexing in pixel shader<sup>[Thibieroz11](#Thibieroz11)</sup>
  * Generates redundant memory operations repeated for every pixel

ex)

```c
struct LIGHT_STRUCT
{
  float4 vColor;
  float4 vPos;
};
cbuffer cbPointLightArray
{
  LIGHT_STRUCT g_Light[NUM_LIGHTS];
};

float4 PS_PointLight(PS_INPUT i) : SV_TARGET
{
  // ...
  uint uIndex = i.uPrimIndex / 2;
  float4 vColor = g_Light[uIndex].vColor;   // NO!
  float4 vLightPos = g_Light[uIndex].vPos;  // NO!
}
```

* Instead fetch light properties from CB in VS (or GS)
* And pass them to PS as interpolants
  * No actual interpolation needed
  * Use `noninterpolation` to reduce number of shader instruction

```c
PS_QUAD_INPUT VS_PointLight(VS_INPUT i)
{
  PS_QUAD_INPUT Out = (PS_QUAD_INPUT)0;

  // Pass position
  Out.vPosition = float4(i.vNDCPosition, 1.0);

  // Pass light properties to PS
  uint uIndex = i.uVertexIndex / 4;
  Out.vLightColor = g_Light[uIndex].vColor;
  Out.vLightPos = g_Light[uLightIndex].vPos;

  return Out;
}

struct PS_QUAD_INPUT
{
  nointerpolation float4 vLightColor : LCOLOR;
  nointerpolation float4 vLightPos : LPOS;
  float4 vPosition : SV_POSITION;
};
```
<sup>[Thibieroz11](#Thibieroz11)</sup>

### Tiled Shading

Amortizes overhead<sup>[Lauritzen10](#Lauritzen10)</sup>.

* Advantages:
  * Fastest and most flexible<sup>[Lauritzen10](#Lauritzen10)</sup><sup>[Olsson15](#Olsson15)</sup>
  * Enable efficient MSAA<sup>[Lauritzen10](#Lauritzen10)</sup><sup>[Olsson15](#Olsson15)</sup>
  * G-Buffers are read only once for each lit sample<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>
  * Framebuffer is written to once<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>
  * Common terms of the rendering equation can be factored out and computed once instead of recomputing them for each light<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>
  * Work becomes coherent within each tile<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>
    * Each sample in a tile requires the same amount of work
      * Allows for efficient implementation on SIMD-like architectures
  * Low bandwidth<sup>[Olsson15](#Olsson15)</sup>
  * Simple light assignment<sup>[Olsson15](#Olsson15)</sup>
  * Trivial light list lookup<sup>[Olsson15](#Olsson15)</sup>
  * High performance<sup>[Olsson15](#Olsson15)</sup>
  * Transparency<sup>[Olsson15](#Olsson15)</sup>
* Disadvantages:
  * Still tricky to afford many shadowed lights per pixel<sup>[Pesce14](#Pesce14)</sup><sup>[Olsson15](#Olsson15)</sup>, Makes dynamic shadows harder<sup>[Pesce14](#Pesce14)</sup>
    * No shadow map reuse<sup>[Olsson15](#Olsson15)</sup>
  * Complex light shader<sup>[Olsson15](#Olsson15)</sup>
  * View dependence<sup>[Olsson15](#Olsson15)</sup>
    * 2D light assignment
    * Depth discontinuities
* Challenges:
  * Frustum primitive culling not accurate, creates false positives<sup>[Schulz14](#Schulz14)</sup>
    * Often considerably more pixels shaded than with stencil tested light volumes
  * Handling light resources (all resources need to be accessible from CS)<sup>[Schulz14](#Schulz14)</sup>
    * Shadow maps stored in large atlas
    * Diffuse and specular probe cubemaps stored in texture arrays
    * Projector textures stored in texture array (have to use standardized dimensions and format)
  * Keeping GPRs under control<sup>[Schulz14](#Schulz14)</sup>
    * Dynamic branching for different light types
    * Deep branching requires additional GPRs and lower occupancy
    * Had to manually rearrange code to stay within desired GPR limit

1. Divide the screen into a grid<sup>[BalestraEngstad08](#BalestraEngstad08)</sup><sup>[Andersson11](#Andersson11)</sup><sup>[WhiteBarreBrisebois11](#WhiteBarreBrisebois11)</sup><sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>
    * (Optional) Find min / max Z-bounds for each tile<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>
2. Find which lights intersect each cell<sup>[BalestraEngstad08](#BalestraEngstad08)</sup><sup>[Andersson11](#Andersson11)</sup><sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>
   * +How many lights<sup>[Andersson09](#Andersson09)</sup> 
3. Render quads over each cell calculating up to 8 lights per pass<sup>[BalestraEngstad08](#BalestraEngstad08)</sup>
  * Results in a light buffer
  * Only apply the visible light sources on pixels in each tile<sup>[Andersson09](#Andersson09)</sup><sup>[Andersson11](#Andersson11)</sup><sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>

Algorithm:<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
1. Render the (opaque) geometry into the G-Buffers<sup>[StewartThomas13](#StewartThomas13)</sup>
   * Ordinary deferred geometry pass 
   * Store material properties<sup>[StewartThomas13](#StewartThomas13)</sup>
   * Provides tile depth bounds<sup>[StewartThomas13](#StewartThomas13)</sup>
2. Construct a screen space grid, covering the frame buffer, with some fixed tile size, t = (x, y), e.g. 32 &times; 32 pixels<sup>[WhiteBarreBrisebois11](#WhiteBarreBrisebois11)</sup><sup>[StewartThomas13](#StewartThomas13)</sup>
    * (Optional) Find min / max Z-bounds for each tile<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>
3. For each light: find the screen space extents of the light volume and append the light ID to each affected grid cell<sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup><sup>[StewartThomas13](#StewartThomas13)</sup>
   * Find the screen space extents of the light bounding sphere and then insert the light into the covered grid cells<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
     * Store the culling results in a texture:<sup>[WhiteBarreBrisebois11](#WhiteBarreBrisebois11)</sup>
       * Column == Light ID
       * Row == Tile ID
   * Cull analytical lights (point, cone, line), per tile<sup>[WhiteBarreBrisebois11](#WhiteBarreBrisebois11)</sup><sup>[StewartThomas13](#StewartThomas13)</sup>
   * Compute shader<sup>[StewartThomas13](#StewartThomas13)</sup>
   * Generates per-tile light list<sup>[StewartThomas13](#StewartThomas13)</sup>
   * Same compute shader then can use per-tile list to do shading<sup>[StewartThomas13](#StewartThomas13)</sup>
   * Can sort lights by kind to reduce branching<sup>[Bentley14](#Bentley14)</sup>
4. For each fragment in the frame buffer, with location f = (x, y)
   1. Sample the G-Buffers at f
   2. Accumulate light contributions from all lights in tile at &lfloor;f /t&rfloor;
   3. Output total light contributions to frame buffer at f
   * Compute lighting for all contributing lights, per tile<sup>[WhiteBarreBrisebois11](#WhiteBarreBrisebois11)</sup> <sup>[OlssonBilleterAssarsson13](#OlssonBilleterAssarsson13)</sup>

Pseudocode:<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
```c
vec3 computeLight(vec3 position, vec3 normal, vec3 albedo,
                  vec3 specular, vec3 viewDir, float shininess,
                  ivec2 fragPos)
{
  ivec2 l = ivec2(fragPos.x / LIGHT_GRID_CELL_DIM_X,
                  fragPos.y / LIGHT_GRID_CELL_DIM_Y);
  int count = lightGrid[l.x + l.y * gridDim.x].x;
  int offset = lightGrid[l.x + l.y * gridDim.x].y;

  vec3 shading = vec3(0.0);

  for (int i = 0; i < count; ++i)
  {
    ivec2 dataInd = ivec2((offset + i) % TILE_DATA_TEX_WIDTH,
                          (offset + i) / TILE_DATA_TEX_WIDTH);
    int lightId = texelFetch(tileDataTex, dataInd, 0).x;
    shading += applyLight(position, normal, albedo, specular,
                          shininess, viewDir, lightId);
  }  

  return shading;
}

void main()
{
  ivec2 fragPos = ivec2(gl_FragCoord.xy);
  vec3 albedo = texelFetch(albedoTex, fragPos).xyz;
  vec4 specShine = texelFetch(specularShininessTex, fragPos);
  vec3 position = unProject(gl_FragCoord.xy, texelFetch(depthTex, fragPos));
  vec3 normal = texelFetch(normalTex, fragPos).xyz;
  vec3 viewDir = -normalize(position);

  gl_fragColor = computeLight(position, normal, albedo, 
                              specShine.xyz, viewDir, specShine.w, 
                              fragPos);
}
```

* Advantages:
  * Constant & absolute minimal bandwith<sup>[Andersson09](#Andersson09)</sup><sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
    * Read gbuffers & depth once!
  * Doens't need intermediate light buffers<sup>[Andersson09](#Andersson09)</sup>
    * Can take a lot of memory with HDR, MSAA & color specular
  * Scales up to huge amount of big overlapping light sources<sup>[Andersson09](#Andersson09)</sup>
    * Fine-grained culling (16 &times; 16)
    * Only ALU cost, good future scaling
    * Could be useful for accumulating VPLs
  * Common terms in the rendering equation can be factored out<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
  * The frame buffer is written exactly once<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
  * Light accumulatino is done in register, at full floating point precision<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
  * Fragments (in the same tile) coherently process the same lights
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

PhyreEngine Implementation:<sup>[Swoboda09](#Swoboda09)</sup>

1. Calculate affecing lights per tile
   * Build a frustum around the tile using the min and max depth values in that tile
   *  Perform frustum check with each light's bounding volume
   *  Compare light direction with tile average normal value
2. Choose fast paths based on tile contents
   * No lights affect the tile? Use fast path
   * Check material values to see if any pixels are marked as lit 

Screen tile classification is a powerful technique with many applications:<sup>[Swoboda09](#Swoboda09)</sup>
* Full screen effect optimization - DoF, SSAO
* Soft particles
* Affecting lights
* Occluder information
* We can also choose whether to process MSAA per tile

To facilitate look up from shaders, we must store the data structure in a suitable format:<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>
1. Light Grid contains an offset to and size of the light list for each tile
2. Tile Light Index Lists contains light indices, referring to the lights in the Global Light Lists

<table>
<thead>
<tr>
<th colspan="8">Global Light List
</th>
</tr>
</thead>
<tbody>
<tr style="background-color:rgba(255, 99, 71, 1); color:white">
<td>L<sub>0</sub></td>
<td>L<sub>1</sub></td>
<td>L<sub>2</sub></td>
<td>L<sub>3</sub></td>
<td>L<sub>4</sub></td>
<td>L<sub>5</sub></td>
<td>L<sub>6</sub></td>
<td>L<sub>7</sub></td>
<td>&hellip;</td>
</tr>
</tbody>
</table>

<table>
<thead>
<tr>
<th colspan="8">Tile Light Index Lists
</th>
</tr>
</thead>
<tbody>
<tr>
<td style="background-color:rgba(53, 90, 255, 1); color:white">0</td>
<td style="background-color:rgba(255, 205, 10, 1); color:white">0</td>
<td style="background-color:rgba(255, 205, 10, 1); color:white">6</td>
<td style="background-color:rgba(255, 205, 10, 1); color:white">3</td>
<td style="background-color:rgba(255, 105, 10, 1); color:white">0</td>
<td style="background-color:rgba(255, 105, 10, 1); color:white">6</td>
<td style="background-color:rgba(255, 105, 10, 1); color:white">4</td>
<td style="background-color:rgba(30, 205, 10, 1); color:white">4</td>
<td>&hellip;</td>
</tr>
</tbody>
</table>

<table>
<thead>
<tr>
<th colspan="5">Tile Light Index Lists
</th>
</tr>
</thead>
<tbody>
<tr>
<td style="background-color:rgba(53, 90, 255, 1); color:white">0</td>
<td style="background-color:rgba(255, 205, 10, 1); color:white">1</td>
<td style="background-color:rgba(255, 105, 10, 1); color:white">4</td>
<td style="background-color:rgba(30, 205, 10, 1); color:white">7</td>
<td>&hellip;</td>
</tr>
<tr>
<td style="background-color:rgba(53, 90, 255, 1); color:white">1</td>
<td style="background-color:rgba(255, 205, 10, 1); color:white">3</td>
<td style="background-color:rgba(255, 105, 10, 1); color:white">3</td>
<td style="background-color:rgba(30, 205, 10, 1); color:white">1</td>
<td>&hellip;</td>
</tr>
<tr>
<td>66</td>
<td>67</td>
<td>69</td>
<td>&hellip;</td>
<td>&hellip;</td>
</tr>
<tr>
<td>1</td>
<td>2</td>
<td>2</td>
<td>&hellip;</td>
<td>&hellip;</td>
</tr>
</tbody>
</table>

#### Computer Shader Implementation

* Primarily for analytical light sources<sup>[Andersson11](#Andersson11)</sup>
  * Point lights, cone lights, line lights
  * No shadows
  * Requires compute shader 5.0
* Hybrid Graphics / Compute shading pipeline:<sup>[Andersson11](#Andersson11)</sup>
  * Graphics pipeline rasterizes gbuffers for opaque surfaces
  * Compute pipeline uses gbuffers, culls lights, computes lighting & combines with shading
  * Graphics pipeline renders transparent surfaces on top
* MSAA is simpler<sup>[Sousa13](#Sousa13)</sup>

<sup>[Andersson09](#Andersson09)</sup>
<ul>
  <li>
    Requiresments & setup
    <ul>
      <li>
        Input data: 
        <ul>
          <li>gbuffers, depth buffer</li>
          <li>light constants</li>
          <li>list of lights<sup><a href="#Andersson11">Andersson11</a></sup></li>
        </ul>
      </li>
      <li>
        Output data:<sup><a href="#Andersson11">Andersson11</a></sup> 
        <ul>
          <li>Fully composited & lit HDR texture</li>
        </ul>
      </li>
      <li>Output is fully composited & lit HDR texture</li>
      <li>1 thread per pixel, 16 x 16 thread groups (aka tile)<sup><a href="#Andersson11">Andersson11</a></sup></li>
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
  <li><pre><code class="lang-c">groupshared uint minDepthInt;<br>groupshared uint maxDepthInt;<br><br>// --- globals above, function below -------<br><br><span style="background-color:rgba(255, 0, 0, 0.5);">float depth = depthTexture.Load(uint3(texCoord, 0)).r;<br>uint depthInt = asuint(depth);</span>

  minDepthInt = 0xFFFFFFFF</span>;
  maxDepthInt = 0;
  GroupMemoryBarrierWithGroupSync();

  <span style="background-color:rgba(255, 0, 0, 0.5);">InterlockedMin(minDepthInt, depthInt);
  InterlockedMax(maxDepthInt, depthInt);</span>

  GroupMemoryBarrierWithGroupSync();

  <strong>float minGroupDepth = asfloat(minDepthInt);
  float maxGroupDepth = asfloat(maxDepthInt);</strong>
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
      Input (global):<sup><a href="#Andersson11">Andersson11</a></sup>
      <ul>
        <li>Light list, frustum & SW occlusion culled</li>
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
      </ul>
      <ol>
        <li>Each thread switches to process light sources instead of a pixel
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
        Switch back to processing pixels
        <ul>
          <li>Synchronize the thread group</li>
          <li>We now know which light sources affect the tile</li>
        </ul>
        </li>
      </ol>
    </li>
    <li><pre><code class="lang-c"><span style="background-color:rgba(255, 0, 0, 0.5);">struct Light
{
    <span class="hljs-type">float3</span> pos;
    <span class="hljs-type">float</span> sqrRadius;
    <span class="hljs-type">float3</span> color;
    <span class="hljs-type">float</span> invSqrRadius;
};
<span class="hljs-type">int</span> lightCount;
StructuredBuffer&lt;Light&gt; lights;<br><br>groupshared <span class="hljs-type">uint</span> visibleLightCount = <span class="hljs-number">0</span>;
groupshared <span class="hljs-type">uint</span> visibleLightIndices[<span class="hljs-number">1024</span>];</span>

<span class="hljs-comment">// ----- globals above, cont. function below ---------</span>

<span style="background-color:rgba(255, 0, 0, 0.5);"><span class="hljs-type">uint</span> threadCount = BLOCK_SIZE * BLOCK_SIZE;
<span class="hljs-type">uint</span> passCount = (lightCount + threadCount - <span class="hljs-number">1</span>) / threadCount;<br>
<span class="hljs-keyword">for</span> (<span class="hljs-type">uint</span> passIt = <span class="hljs-number">0</span>; passIt &lt; passCount; ++passIt)
{<br>    <span class="hljs-type">uint</span> lightIndex = passIt * threadCount + groupIndex;</span><br><br>    <span class="hljs-comment">// prevent overrun by clmaping to a last "null" light</span><br>    lightIndex = <span class="hljs-built_in">min</span>(lightIndex, lightCount);<br><br><span style="background-color:rgba(255, 0, 0, 0.5);">    <span class="hljs-keyword">if</span> (intersects(lights[lightIndex], tile))<br>    {<br>        <span class="hljs-type">uint</span> <span class="hljs-keyword">offset</span>;<br>        InterlockedAdd(visibleLightCount, <span class="hljs-number">1</span>, <span class="hljs-keyword">offset</span>);<br>        visibleLightIndices[<span class="hljs-keyword">offset</span>] = lightIndex;</span><br>    }<br>}<br><br><span style="background-color:rgba(255, 0, 0, 0.5);">GroupMemoryBarrierWithGroupSync();</span></code></pre>
</li>
  </ul>
</li>
<li>
For each pixel, accumulate lighting from visible lights
  <ul>
    <li>Read from tile visible light index list in threadgroup shared memory</li>
    <li><pre><code class="lang-c">float3 <span class="hljs-keyword">diffuseLight </span>= <span class="hljs-number">0</span>;
float3 specularLight = <span class="hljs-number">0</span>;<br><br>for (uint lightIt = <span class="hljs-number">0</span>; lightIt &lt; visibleLightCount; ++lightIt)
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
    <li><pre><code class="lang-c">float3 color = <span class="hljs-number">0</span>;<br><br>for (uint lightIt = <span class="hljs-number">0</span>; lightIt &lt; visibleLightCount; ++lightIt)
{<br>  uint lightIndex = visibleLightIndices[lightIt]<span class="hljs-comment">;</span><br>  Light light = lights[lightIndex]<span class="hljs-comment">;</span><br><br>  color += diffuseAlbedo * evaluateLightDiffuse(light, gbuffer);<br>  color += specularAlbedo * evaluateLightSpecular(light, gbuffer);<br>  );
}
</code></pre><sup><a href="#Andersson11">Andersson11</a></sup>
</li>
  </ul>
</li>
</ol>

#### Optimizations

##### Depth range optimization<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>

Compute min and max Z value for each tile. This requires access to the z buffer.

### Light Pre-Pass Renderer

This is the second rendering pass where we store light properties of all lights in a light buffer(aka L-Buffer).<sup>[EngelShaderX709](#EngelShaderX709)</sup>

![LightPrePassRenderer](/Images/DeferredShading/LightPrePassRenderer.png)
<sup>[EngelShaderX709](#EngelShaderX709)</sup>

Compared to a deferred renderer, the light pre-pass renderer offers more flexibility regarding material implementations. Compared to a Z pre-pass renderer, it offers less flexibility but a flexible and fast multi-light solution.<sup>[EngelShaderX709](#EngelShaderX709)</sup>

Because the light buffer only has to hold light properties, the cost of rendering one light source is lower than for a similar setup in a deferred renderer.<sup>[EngelShaderX709](#EngelShaderX709)</sup>

* Advantages:
  * Easier to retrofit into "traditional" rendering pipelines<sup>[Lee09](#Lee09)</sup>
  * Lower memory and bandwidth usage<sup>[Lee09](#Lee09)</sup>
  * Can reuse your primary shaders for forward rendering of alpha<sup>[Lee09](#Lee09)</sup>
  * One material fetch per pixel regardless of number of lights<sup>[Thibieroz11](#Thibieroz11)</sup>
* Disadvantages:
  * Alpha blending is problematic<sup>[Lee09](#Lee09)</sup>
    * MSAA and alpha to coverage can help
  * Encoding different material types is not elegant<sup>[Lee09](#Lee09)</sup>
    * Coherent fragment program dynamic branching can help
  * 2x geometry pass too expensive on both CPU & GPU<sup>[Andersson11](#Andersson11)</sup>
  * Tile-based deferred shading has major potential<sup>[Andersson11](#Andersson11)</sup>
  * Two geometry passes required<sup>[Thibieroz11](#Thibieroz11)</sup>
  * Unique lighting model<sup>[Thibieroz11](#Thibieroz11)</sup>

#### Version A<sup>[EngelSiggraph09](#EngelSiggraph09)</sup>

* Geometry Pass
  * Fill up normal and depth buffer
* Lighting Pass
  * Store light properties in light buffer
* 2. Geometry Pass
  * Fetch light buffer and apply different material terms per surface by reconstructing the lighting equation

#### Version B<sup>[EngelSiggraph09](#EngelSiggraph09)</sup>

Similar to S.T.A.L.K.E.R: Clear Skies

* Geometry Pass
  * Fill up normal + spec. power and depth buffer and a color buffer for the ambient pass
* Lighting Pass
  * Store light properties in light buffer
* Ambient + Resolve (MSAA) Pass
  * Fetch light buffer use its content as diffuse and specular content and add the ambient term while resolving into the main buffer

#### Dragon Age II<sup>[Papathanasis11](#Papathanasis11)</sup>

* Extra pass to render scene normals
* Render all dynamic light spheres to a light buffer
* Allows for hundres of lights

### Clustered Shading

Clustered shading explore higher dimensional tiles, which we collectively call clusters. Each cluster has a fixed maximum 3D extent.<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>

Deferred Algorithm:<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>
1. Render scene to G-Buffers
2. Cluster assignment
3. Find unique clusters
4. Assign lights to clusters
5. Shade samples

#### Cluster Assignment

* Goal: compute an integer cluster key for a given view sample from the information available in the G-Buffer<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>
  * Use position, normal (optional)
* Regular subdivision / quantization of the sample positions<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>
  * Fast, predictable cluster sizes
* Uniform screen space tiling used in tiled deferred shading + extend this by also subdividing along the z-axis in view space (or NDC)<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>
* Due to non-linear nature of NDC, subdivide the z-axis in view space by spacing the divisions exponentially<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>
* Subdivision:<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>
  * near<sub>k</sub>: near plane for a division k
  * h<sub>k</sub>: depth of a division k
    * near<sub>k</sub> = near<sub>k - 1</sub> + h<sub>k - 1</sub>
  * near<sub>0</sub> = near
  * h<sub>0</sub> = 2 near tan &theta; / S<sub>y</sub>
    * 2&theta;: field of view
    * S<sub>y</sub>: number of subdivisions in the Y direction
  * near<sub>k</sub> = near ( 1 + 2 tan &theta; / S<sub>y</sub>)<sup>k</sup>
  * ![ClusterK](/Images/DeferredShading/ClusterK.png)
* Cluster key tuple (i, j, k):<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>
  * ![ClusterKey](/Images/DeferredShading/ClusterKey.png)
  * Can be extended with a number of bits that encode a quantized normal direction
  * i, j = 2D tile id - `gl_FragCoord.xy`<sup>[Olsson15](#Olsson15)</sup>
  * k = &approx;log(view space z)<sup>[Olsson15](#Olsson15)</sup>

##### Sparse vs Dense Cluster Grid<sup>[Olsson15](#Olsson15)</sup>

* Sparse Cluster Grid
  * Only store cells that contain samples
  * Requires pre-z pass / deferred
  * No redundant light assignment
  * Geometry info useful for other things
* Dense Cluster Grid
  * Must assign lights to all clusters
  * Can be done on CPU / Asynchronously
  * Can access any point in view volume
  * SAME shading cost as for sparse

##### Explicit vs Implicit Cluster<sup>[Olsson15](#Olsson15)</sup>

* Explicit cluster bounds
  * Actual bounding box of samples
  * Some storage
  * Some cost to build
  * Tight bounds
  * Extra geometry pass for forward shading
* Implicit cluster bounds
  * Implied by grid coordinate
  * No storage
  * Can have large empty space

#### Finding Unique Clusters

* Local Sorting<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>
  * Sort samples in each screen space tile locally
    * Allows us to:
      * Perform the sorting operation in on-chip shared memory
      * Use local indices to link back to the source pixel
  * Extract unique clusters from each tile using a parallel compaction
    * Compute and store a link from each sample to its associated cluster
  * Globally unique list of clusters
* Cluster key defines implicit 3D bounds, and optionally an implicit normal cone<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>
* Compute the explicit bounds by performing a reduction over the samples in each cluster<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>
  * e.g., Perform a min/max reduction to find the AABB enclosing each cluster
* Results of the reduction are stored separately in memory<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>

#### Light Assignment<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>

* Goal: calculate the list of lights influencing each cluster
* Fully hierarchical approach based on a spatial tree over the lights is better than tiled shading's brute force approach
* Bounding Volume Hierarchy (BVH)
  * Sort the lights according to the Z-order (Morton Code) based on the discretized centre position of each light
  * Leaves of the search tree is get directly from the sorted data
  * 32 consecutive leaves are grouped into a bounding volume (AABB) to form the first level above the leaves
  * Next level is constructed by again combining 32 consecutive elements
    * Continue until a single root element remains
  * To construct upper levels of the tree, we launch a CUDA warp (32 threads) for each node to be constructed
* For each cluster, we traverse this BVH using depth-first traversal (warp is allocated)
  * At each level, the bounding box of the cluster is tested against the bounding volumes of the child nodes
  * For the leaf nodes, the sphere bounding the light source is used
  * The branching factor of 32 allows efficient SIMD-traversal on the GPU and keeps the search tree relatively shallow (up to 5 levels)
    * Avoid expensive recursion
    * Support up to 32 million lights

#### Shading<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>

To match the pixel and the clusters, we need a direct mapping between the cluster key and the index into the list of unique clusters.

In the sorting approach, we explicitly store this index for each pixel. When the unique cluster is established, store the index to the correct pixel in a full screen buffer.

#### Cluster Key Packing<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>

Allocate 8 bits to each i and j components, which allows up to 8192 &times; 8192 size RTs. Depth index k is determined from settings for the near and far planes and ![ClusterK](/Images/DeferredShading/ClusterK.png). 

The paper uses 10 bits, 4 bits for the actually depth data, and 6 bits for the optional normal clustering.

#### Tile Sorting<sup>[OlssonBilleterAssarssonHpg12](#OlssonBilleterAssarssonHpg12)</sup>

To the cluster ke we attach an additional 10 bits of meta-data, which identifies the sample's original position relative to its tile. We perfrom a tile-local sort of the cluster keys and the associated meta-data. The sort only considers the up-to 16 bits of the cluster key; the meta-data is used as a link back to the original sample after sorting. In each tile, we count the number of unique cluster keys. Using a prefix operation over the counts from each tile, we find the total number of unique cluster keys and assign each cluster a unique ID in the range [0...numClusters). We write the unique ID back to each pixel that is a member of the cluster. The unique ID also serves as an offset in
memory to where the cluster’s data is stored.

#### Conservative Rasterization<sup>[OrtegrenPersson16](#OrtegrenPersson16)</sup>

* If any part of a primitive overlaps a pixel, that pixel is considered covered and is then rasterized

Algorithm:
* For each light type:
  1. Shell pass
     * Find min / max depths in every tile for every light 
  2. Fill pass 
     * Use the min / max depths and fill indices into the light linked list 
  * When all light types have been processed, light assignment is complete, and the light linked list can be used when shading geometry

Light Shape Representation:
* Meshes are created as unit shapes, where vertices are constrained to -1 to 1 in the x-, y-, and z-directions
  * To allow arbitrary scaling of the shape depending on the actual light size

##### Shell Pass

* Responsible for finding the clusters for a light shape that encompasses it in cluster space
* Finds the near / far clusters for each tile for each light and stores them in an R8G8 RT
  * Number of RTs == Maximum number of visible lights for each light type
  * All RTs have the same size and format and are set up in a `Texture2DArray` for each light type
  * Sizes of the RTs are the same as the x- and y-dimensions of the cluster structure (*tile dimension*)
* Set `D3D12_CONSERVATIVE_RASTERIZATION_MODE_ON` flag when creating a PSO.

Vertex Shader:
* Each light type has its own custom vertex shader for translating, rotating, and scaling the light mesh to fit the actual light
* `SV_InstanceID` is used to extract the position, scale, and other properties to transform each vertex to the correct location in world space
* Sent to GS containing the view-space position and its light ID

Geometry Shader:
* 

##### Source Code Analysis

Root Signature:
* Default
  * 1 CBV
    * Camera information
  * 1 SRV
    * Point / spot lights

`Draw`:
* PSO Point
  * Input Layout: `POSITION`, `R8G8B8A8_SNORM`
  * Root Signature: Default
  * VS: `LAPointLight.vertex`
  * GS: `LA.geometry`
  * PS: `LAfront.pixel`
* 

### Per-Pixel Linked List<sup>[Bezrati14](#Bezrati14)</sup>

```c
struct LightFragmentLink
{
  float m_LightDepthMax;
  float m_LightDepthMin;
  
  uint m_LightIndex;
  uint m_Next;
};
```

* Compressed version:

```c
struct LightFragmentLink
{
  uint m_DepthInfo;
  uint m_IndexNetx;
}
```

* G-Buffer
* Fill Linked List
* Light G-Buffer
* Custom Materials
* Alpha

#### Light Linked List (LLL)

* Generate down-sized depth buffer
* Use conservative depth selection
* Use GatherRed
* Shader steps
  * Software depth test
    * Software test front faces
  * Acquire min / max depth
  * Allocate a LLL fragment

Depth Test:

```c
// If Z test fails for the front face, skip all fragments
if ((pFace == true) & (light_depth > depth_buffer))
{
  return;
}
```

* Depth Bounds `RWByteAddressBuffer`
* Encode Depth + ID
  * 16 bits ID
  * 16 bits Depth
  * `uint new_bounds_info = (light_index << 16) | f32tof16(light_depth);`
* Use `InterlockedExchange`
* Fragment Links
  * Use a `RWStructuredBuffer` for storage

```c
struct LightFragmentLink
{
  uint m_DepthInfo; // High bits min depth, low bits max depth
  uint m_IndexNext; // Light index and link to the next fragment
};
RWStructuredBuffer<LightFragmentLink> g_LightFragmentLinkedBuffer;
```

* Allocate LLL Fragment
  * Increment current count

```c
// Allocate
uint new_lll_idx = g_LightFragmentLinkedBuffer.IncrementCounter();

// Don't overflow
if (new_lll_idx >= g_VP_LLLMaxCount)
{
  return;
}
```

* Track last entry
  * StartOffset `RWByteAddressBuffer`
    * `InterlockedExchange`
* Light fragment encoding
  * Fill the linked light fragment and store it

```c
// Final output
LightFragmentLink element;

// Pack the light depth
element.m_DepthInfo = (light_depth_min << 16)  light_depth_max;

// Index / Link
element.m_IndexNext = (light_index << 24) | (prev_lll_idx & 0xFFFFFFFF);

// Store the element
g_LightFragmentLinkedBuffer[new_lll_idx] = element;
```

#### Lighting the G-Buffer

* Draw full-screen quad
* Access the LLL
* Apply the light

Accessing the SRVs:
* Fetch the first linked element offset
  * The first linked element is encoded in the lower 24 bits

```c
uint src_index = LLLIndexFromScreenUVs(screen_uvs);
uint first_offset = g_LightStartOffsetView[src_index];

// Decode the first element index
uint element_index = (first_offset & 0xFFFFFF);
```

Light Loop:
* Start the lighting loop
  * An element index equal `to 0xFFFFFF` is invalid

```c
// Iterate over the light linked list
while (element_index != 0xFFFFFF)
{
  // Fetch
  LightFragmentLink element = g_LightFragmentLinkedView[element_index];

  // Update the next element index
  element_index = (element.m_IndexNext & 0xFFFFFF);
}
```

Decoding light depth:
* Decode the light min / max depth
* Compare the light depth

```c
// Decode the light bounds
float light_depth_max = f16tof32(element.m_DepthInfo >> 0);
float light_depth_min = f16tof32(element.m_DepthInfo >> 16);

// Do depth bounds check
if ((l_depth > light_depth_max) || (l_depth < light_depth_min))
{
  continue;
}
```

Access light info:
* Fetch the full light information

```c
// Decode the light index
uint light_index = (element.m_IndexNext >> 24);

// Access
GPULightEnv light_env = g_LinkedLightsEnvs[light_index];

// Detect the light type
switch (light_env.m_LightType)
{
  ...
```

### 3D Light Grid<sup>[Anagnostou17](#Anagnostou17)</sup>

* View space light grid of dimensions 29 x 16 x 32
* Screen space tile of 64 x 64 pixels and 32 z-partitions
  * Partitioning is exponential
* Assign 9 lights and 2 reflection probes
* Axis-aligned box of each cell to perform light bounding volume intersections
* To store the light indices, a linked list is used which is then converted to a contiguous array during the "compact" pass

### Optimizations

The most important optimization for the lighting pass is to render only those lights that actually affect the final image, and for those lights, render only the affected pixels.<sup>[Shishkovtsov05](#Shishkovtsov05)</sup><sup>[Thibieroz11](#Thibieroz11)</sup>

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

* Constant Waterfall sucks!<sup>[WhiteBarreBrisebois11](#WhiteBarreBrisebois11)</sup>
  * Kills performance
  * Use the aL register when iterating over lights
  * If set properly, ALU / lighting will run at 100% efficiency

```c
int lightCounter[4] = { count, start, step, 0 };
pDevice->SetPixelShaderConstantI(0, lightCounter, 1);
// NO

int tileLightCount : register(i0);
float4 lightParams[NUM_LIGHT_PARAMS] : register(c0);

[loop]
for (int iLight = 0;  // start
     iLight < tileLightCount; // count * step
     ++iLight)  // step
{
  float4 params1 = lightParams[iLight + 0]; // mov r0 c0[0 + aL]
  float4 params2 = lightParams[iLight + 1]; // mov r1 c0[1 + aL]
  float4 params3 = lightParams[iLight + 2]; // mov r2 c0[2 + aL]
}
```
<sup>[WhiteBarreBrisebois11](#WhiteBarreBrisebois11)</sup>

* These shaders are ALU bound<sup>[WhiteBarreBrisebois11](#WhiteBarreBrisebois11)</sup>
  * Simplify math especially in the loops
  * Get rid of complicated non 1:1 instructions (e.g. smoothstep)
  * Play with microcode: -normalize(v) is faster than normalize(-v)
  * Move code around to help with dual-issuing
  * Use shader predicates to help the compiler
    * `[flatten]`, `[branch]`, `[isolate]`, `[ifAny]`, `[ifAll]`, etc.
    * Tweak GPRs
* Use GPU freebies<sup>[WhiteBarreBrisebois11](#WhiteBarreBrisebois11)</sup>
  * Texture sampler scale / bias (* 2 - 1)
* Simply / remove unnedded code via permutations
* Upload constants via the constnat buffer pointers

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

#### Blending Cost

* Use `Discard()` to get rid of pixels not contributing any light
  * Use this regardless of the light processing method used
  * Can result in a significant increase in performance

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

# Minor Architectures

## The X-Ray Rendering Architecture<sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup>

1. G-Stage
2. Light Stage
3. Light Combine
4. Transparent Objects
5. Bloom/Exposition
6. Final Combine-2
7. Post-Effects

### G-Stage

* Output geometry attributes (albedo, specular, position, normal, AO, material)
* MSAA output (subsample geometry data)

### Light Stage

* Calculate lighting (diffuse light-RGB, specular light - intensity only)
* Interleaved rendering with shadowmap
* Draw emissive objects
* MSAA output (subsample lighting)
* Read from MSAA source (use G-Stage data)

### Light Combine

* Deferred lighting is applied here
* Hemisphere lighting is calculated here (both using OA light-map and SSAO)
* Perform tone-mapping here
* Output Hi and Lo part of tone-mapped image into 2 RTs
* MSAA output (subsample data combination)
* Read from MSAA source (use G-Stage data and Light Stage data)

### Transparent Objects

* Basic forward rendering
* MSAA output

### Bloom / exposition

* Use Hi RT as a source for bloom / luminance estimation

### Final combine-2

* Apply DoF, distortion, bloom

### Post-Effects

* Apply black-outs, film grain, etc.

## Light Indexed Deferred Rendering

Three basic render passes:<sup>[Trebilco09](#Trebilco09)</sup>
1. Render depth only pre-pass
2. Disable depth writes (depth testing only) and render light volumes into a light index texture
   * Standard deferred lighting / shadow volume techniques can be used to find what fragments are hit by each light volume
3. Render geometry using standard forward rendering
   * Lighting is done using the light index texture to access lighting properties in each shader 

In order to support multiple light indexes per-fragment, it would be ideal to store the first light index in the texture's red channel, second light index in the blue index, etc.<sup>[Trebilco09](#Trebilco09)</sup>

### Matt Pettineo's approach<sup>[Pettineo12](#Pettineo12)</sup>

* Depth-only Prepass
* Depth buffer used by a compute shader to compute the list of intersecting lights per-tile
  * List is stored in either an `R8_UINT` or `R16_UINT` typed buffer (8-bit for < 255 lights)

## Space Marine<sup>[KimBarrero11](#KimBarrero11)</sup>

|Pass|Budget (ms)|
|----|-----------|
|Depth-Pre|0.50|
|G-Buffer + Linear Depth|5.05|
|AO|2.25|
|Lighting|8.00|
|Combiner Pass|5.00|
|Blend|0.15|
|Gamma Conversion|1.30|
|FX|2.75|
|Post Processing|3.70|
|UI|0.50|
|Total|29.20|

## Screen-Space Classification<sup>[KnightRitchieParrish11](#KnightRitchieParrish11)</sup>

Divided the screen into 4 &times; 4 pixel tiles. Each tile is classified according to the minimum global light properties it requires:

1. Sky
   * Fastest pixels because no lighting calculations required
   * Sky color is simply copied directly from the G-Buffer 
2. Sun light
   * Pixels facing the sun requires sun and specular lighting calculations (unless they're fully in shadow) 
3. Solid shadow
   * Pixels fully in shadow don't require any shadow or sun light calculations 
4. Soft shadow
   * Pixels at the edge of shadows require expensive eight-tap percentage closer filtering (PCF) unless they face away from the sun 
5. Shadow fade
   * Pixels near the end of the dynamic shadow draw distance fade from full shadow to no shadow to avoid pops as geometry moves out of the shadow range 
6. Light scattering
   * All but the nearest pixels 
7. Antialiasing
   * Pixels at the edges of polygons require lighting calculations for both 2X MSAA fragments 

Classify four during our screen-space shadow mask generation, the other three in a per-pixel pass.

## Inferred Lighting
<sup>[Kircher12](#Kircher12)</sup>

* Developed by Volition, Inc.
* Low-res MRT Geometry Pass
  * Normals, DSF ID, Depth
* Low-res Lighting Pass
  * Normals, Depth used
* Full-res Material Pass
  * DSF ID and Low-res Lighting Pass used

Features:
* Lots of fully dynamic lights
* Integrated alpha lighting (no forward rendering)
* Hardware MSAA support
* Lit rain (IL required)
* Better foliage support (applies only to IL)
* Screen-space decals (enhanced by IL)
* Radial AO (RAO) (optimized by IL)

## Hybrid Deferred Rendering<sup>[SousaWenzelRaine13](#SousaWenzelRaine13)</sup>

* Deferred lighting still processed as usual
  * L-Buffers now using BW friendlier R11G11B10F formats
  * Precision was sufficient, since material properties not applied yet
* Deferred shading composited via fullscreen pass
  * For more complex shading such as Hair or Skin, process forward passes
* Allowed us to drop almost all opaque forward passes
  * Less drawcalls, but G-Buffer passes now with higher cost
    * Fast Double-Z prepass for some of the closest geometry helps slightly
  * Overwall was nice win, on all platforms*

## Destiny Engine Deferred Rendering<sup>[TatarchukTchouVenzon13](#TatarchukTchouVenzon13)</sup>

1. G-Buffers (96 bits)
   * Depth, normal, material ids
   * Opaque geometries + Decals 
   * Highly-compressed
2. L-Buffers
   * Lighting accumulation
   * Light Geometry
   * Lights 
3. Lit Result
   * Full-screen shading 

* Advantages:
  * Memory footprint fits in EDRAM (96 bpp)
  * Single pass over geometry (especially important for decoratos / foliage)
  * Unified lighting + materials (no matrix of lights vs. geometry types like in Halo)
  * Allows cheap deferred decals
  * Complex material appearance
  * Separate lighting / shading / geometry shaders simplifies shaders
* Disadvantages:

## Rainbow Six Siege<sup>[ElMansouri16](#ElMansouri16)</sup>

### Opaque Rendering

* First person rendering
* 400 best occluders to depth buffer
* Generate Hi-Z
* Opaque culling & rendering

### Shadow Rendering

* All shadows are cache based
  * Used cached Hi-Z for culling
* Sunlight shadow done in full resolution
  * Separate pass to relieve lighting resolve VGPR pressure
  * Uses Hi-Z representation of the cached shadow map to reduce the work per pixel
* Local lights are resolved in a quarter resolution
  * Resolved results stored in a texture array
  * Lower VGPR usage on light accumulation
  * Bilateral upscale

### Lighting

* Clustered structure on the frustum
  * 32 x 32 pixels based tile
  * Z exponential distribution
* Hierarchical culling of light volume to fill the structure
* Local cubemaps regarded as lights
* Shadows, cubemaps, and gobos reside in texture arrays
  * Deferred uses pre-resolved shadow texture array
  * Forward uses shadows depth buffer array

### Checkerboard Rendering

* Rendering to a 1/4 size (1/2 width by 1/2 height) resolution with MSAA 2X:
  * We end up with half the samples of the full resolution image
* D3D MSAA 2X standard pattern
  * 2 Color and Z samples
* Sample modifier or SV_SampleIndex input to enforce rendering all sample
* Each sample falls on the exact pixel center of full screen render target

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

Pixel Edge Detection (Pixel Shader):<sup>[Thibieroz09](#Thibieroz09)</sup>

```c
// Pixel shader to detect pixel edges
// Used with the following depth-stencil state values:
// DepthEnable = TRUE
// DepthFunc = Always
// DepthWriteMask = ZERO
// StencilEnable = TRUE
// Front/BackFaceStencilFail = Keep
// Front/BackfaceStencilDepthFail = Keep
// Front/BackfaceStencilPass = Replace;
// Front/BackfaceStencilFunc = Always;
// The stencil reference value is set to 0x80

float4 PSMarkStencilWithEdgePixels( PS_INPUT input ) : SV_TARGET
{
  // Fetch and compare samples from GBuffer to determine if pixel
  // is an edge pixel or not
  bool bIsEdge = DetectEdgePixel(input);

  // Discard pixel if non-edge (only mark stencil for edge pixels)
  if (!bIsEdge) discard;
  
  // Return color (will have no effect since no color buffer bound) return
  float4(1,1,1,1);
}
```

#### Centroid-Based Edge Detection

An optimized way to detect edges is to leverage the GPU’s fixed function resolve feature. Centroid sampling is used to adjust the sample position of an interpolated pixel shader input so that it is contained within the area defined by the multisamples covered by the triangle.<sup>[Thibieroz09](#Thibieroz09)</sup>

Centroid sampling can be used to determine whether a sample belongs to an edge pixel or not.<sup>[Thibieroz09](#Thibieroz09)</sup>

This MSAA edge detection technique is quite fast, especially compared to a custom method of comparing every G-Buffer normal and depth samples. It only requires a few bits of storage in a G-Buffer render target.<sup>[Thibieroz09](#Thibieroz09)</sup>

* This is a neat trick, but is not that useful<sup>[Thibieroz11](#Thibieroz11)</sup>
  * Produces too many edges that don't need to be shaded per sample
  * Especially when tessellation is used!!
  * Doesn't detect edges from transparent textures

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

MSAA allows a scene to be rendered at a higher resolution without having to pay the cost of shading more pixels.<sup>[Thibieroz09](#Thibieroz09)</sup>
* To support MSAA, the MRTs must be rendered with MSAA.
* Forward shading
  * Each object is shaded and rendered directly into a multisampled surface
  * Once all objects have been rendered, a resolve operation is required to convert the multi-sampled render target into a final, anti-aliased image
* Deferred shading
  * G-Buffer's multisampled RTs are simply intermediate storage buffers leading to the construction of the final image
  * Once all shading contributions to the scene have been rendered onto the multisampled accumulation buffer, then the resolve operation can take place on this buffer to produce the final, anti-aliased image
* Multisampled resources:
  * G-Buffer RTs
  * Accumulation buffer receiving the contribution of shading passes and further rendering
  * Depth-stencil buffer
* In order to produce accurate results for MSAA, it is essential that the pixel shaders used during the shading passes are executed at per-sample frequency
  * However, this has a significant impact on performance
  * A sensible optimization is to detect pixels whose samples have different values and only perform per-sample pixel shader execution on those "edge" pixels

~~Run light shader at pixel resolution~~<sup>[Valient07](#Valient07)</sup>
  * ~~Read G-Buffer for both pixel samples~~
  * ~~Compute lighting for both samples~~
  * ~~Average results and add to frame buffer~~

S.T.A.K.E.R: Clear Skies:<sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup>
* Render to MSAA G-Buffer
* Mask edge pixels
* Process only subsample #0 for plain pixels
  * Output to all subsamples
* Process each subsample for edge pixels independently
* Early stencil hardware minimizes PS overhead

```
For each shader
  Plain pixel: run shader at pixel frequency
  Edge pixel: run at subpixel frequency
```
<sup>[LobanchikovGruen09](#LobanchikovGruen09)</sup>

#### MSAA Compute Shader Lighting

* Only edge pixels need full per-sample lighting<sup>[Andersson11](#Andersson11)</sup>
  * But edges have bad screen-space coherency! Inefficient<sup>[StewartThomas13](#StewartThomas13)</sup>
    * Bad for branching<sup>[StewartThomas13](#StewartThomas13)</sup>
* Compute Shader can build efficient coherent pixel list<sup>[Andersson11](#Andersson11)</sup>
  * Evaluate lighting for each pixel (sample 0)
  * Determine if pixel requires per-sample lighting
  * If so, add to atomic list in shared memory
  * When all pixels are done, synchronize
  * Go through and light sample 1-3 for pixels in list

# Comparisons

|                         |Deferred  |Tiled Deferred            |Tiled Forward|
|-------------------------|----------|--------------------------|-------------|
|Innermost loop           |Pixels    |Lights                    |Lights       |
|Light data access pattern|Sequential|Random                    |Random       |
|Pixel data access pattern|Random    |Sequential                |Sequential   |
|Re-use Shadow Maps       |Yes       |No                        |No           |
|Shading Pass             |Deferred  |Deferred<sup>[a](#a)</sup>|Geometry     |
|G-Buffers                |Yes       |Yes                       |No           |
|Overdraw of shading      |No        |No                        |Yes          |
|Transparency             |Difficult |Simple                    |Simple       |
|Supporting FSAA          |Difficult |Difficult                 |Trivial      |
|Bandwidth Usage          |High      |Low                       |Low          |
|Light volume intersection|Per Pixel |Per Tile                  |Per Tile     |
<sup>[OlssonAssarsson11](#OlssonAssarsson11)</sup>

<div id="a"><sup>a</sup>Apply Tiled Forward for transparent objects</div>

EA. SIGGRAPH. 2011.

|Light Type<br>(8 lights/tile, every tile)|Performance|
|-----------------------------------------|-----------|
|Point                                    |4.0 ms     |
|Point (with Spec)                        |7.8 ms     |
|Cone                                     |5.1 ms     |
|Cone (with Spec)                         |5.3 ms     |
|Line                                     |5.8 ms     |

* Classification: 1.35ms (with resolves)

<sup>[WhiteBarreBrisebois11](#WhiteBarreBrisebois11)</sup>

---

# References

## 2003

<a id="Calver03" href="https://www.beyond3d.com/content/articles/19/1">Photo-realistic Deferred Lighting</a>. [Dean Calver](https://www.linkedin.com/in/deanoc/), [Climax](https://www.climaxstudios.com/) / [Snapshot Games](https://www.snapshotgames.com/). [Beyond3D](https://www.beyond3d.com/).

## 2004

<a id="Hargreaves04" href="https://my.eng.utah.edu/~cs5600/slides/Wk%209%20D3DTutorial_DeferredShading.pdf">Deferred Shading</a>. [Shawn Hargreaves](https://shawnhargreaves.com/), [Climax](https://www.climaxstudios.com/) / [Microsoft](https://www.microsoft.com/ko-kr/). [GDC 2004](https://www.gdcvault.com/free/gdc-04/)<BR>
<a id="HargreavesHarris04" href="http://download.nvidia.com/developer/presentations/2004/6800_Leagues/6800_Leagues_Deferred_Shading.pdf">Deferred Shading</a>. [Shawn Hargreaves](https://shawnhargreaves.com/), [Climax](https://www.climaxstudios.com/) / [Microsoft](https://www.microsoft.com/ko-kr/). [Mark Harris](https://www.linkedin.com/in/themarkharris/), [NVIDIA](https://www.nvidia.com/en-us/). NVIDIA Developers Conference 2004.<br>
<a id="Thibieroz04" href="https://gitea.yiem.net/QianMo/Real-Time-Rendering-4th-Bibliography-Collection/raw/branch/main/Chapter%201-24/[1762]%20[ShaderX2%202004]%20Deferred%20Shading%20with%20Multiple%20Render%20Targets.pdf">Deferred Shading with Multiple Render Targets</a>. [Nicolas Thibieroz](https://www.linkedin.com/in/nicolas-thibieroz-a4353739/), [PowerVR Technologies](https://www.imaginationtech.com/products/gpu/) / [AMD](https://www.amd.com/en). [ShaderX2](http://www.shaderx2.com/).

## 2005

<a id="Shishkovtsov05" href="https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows/chapter-9-deferred-shading-stalker">Deferred Shading in S.T.A.L.K.E.R.</a>. [Oleksandr Shyshkovtsov](https://www.linkedin.com/in/olesshishkovtsov/), [GSC Game World](https://www.gsc-game.com/) / [4A Games](https://www.4a-games.com.mt/). [GPU Gems 2](https://developer.nvidia.com/gpugems/gpugems2/inside-front-cover).

## 2006

<a id="Placeres06" href="https://gitea.yiem.net/QianMo/Real-Time-Rendering-4th-Bibliography-Collection/raw/branch/main/Chapter%201-24/[1420]%20[ShaderX5%202006]%20Overcoming%20Deferred%20Shading%20Drawbacks.pdf">Overcoming Deferred Shading Drawbacks</a>. [Frank Puig Placeres](https://www.linkedin.com/in/frank-puig-placeres-454b1633/), [University of Informatic Sciences](https://www.uci.cu/en) / [Amazon](https://www.amazon.com/). [ShaderX5](http://www.shaderx5.com/).

## 2007

<a id="Koonce07" href="https://developer.nvidia.com/gpugems/gpugems3/part-iii-rendering/chapter-19-deferred-shading-tabula-rasa">Deferred Shading in Tabula Rasa</a>. [Rusty Koonce](https://www.linkedin.com/in/rusty-koonce-9654819/), [NCSoft Corporation](https://kr.ncsoft.com/en/index.do) / [Facebook](https://about.facebook.com/). [GPU Gems 3](https://developer.nvidia.com/gpugems/gpugems3/foreword).<br>
<a id="Valient07" href="https://www.guerrilla-games.com/read/deferred-rendering-in-killzone-2">Deferred Rendering in Killzone 2</a>. [Michal Valient](https://www.linkedin.com/in/valient/), [Guerilla Games](https://www.guerrilla-games.com/) / [Epic Games](https://www.epicgames.com/site/en-US/home). Developer Conference 2007.

## 2008

<a id="BalestraEngstad08" href="https://www.gdcvault.com/play/325/The-Technology-of-UNCHARTED-DRAKE">The Technology of Uncharted: Drake's Fortune</a>. [Christophe Balestra](https://www.linkedin.com/in/christophe-balestra-37bb41/), [Naughty Dog](https://www.naughtydog.com/) / Retired. [Pål-Kristian Engstad](https://www.linkedin.com/in/p%C3%A5l-kristian-engstad-08a22a1/), [Naughty Dog](https://www.naughtydog.com/) / [Apple](https://www.apple.com/). [GDC 2008](https://www.gdcvault.com/free/gdc-08/).<br>
<a id="FilionMcNaughton08" href="https://developer.amd.com/wordpress/media/2013/01/Chapter05-Filion-StarCraftII.pdf">StarCraft II: Effects & Techniques</a>. [Dominic Filion](https://www.linkedin.com/in/%E2%80%8Edominic-filion-guay-258202/), [Blizzard Entertainment](https://www.blizzard.com/en-us/) / [Snap Inc.](https://www.snap.com/en-US). [Rob McNaughton](https://www.linkedin.com/in/rob-mcnaughton-4872453/), [Blizzard Entertainment](https://www.blizzard.com/en-us/). [SIGGRAPH 2008: Advances in Real-Time Rendering in 3D Graphics and Games Course](https://advances.realtimerendering.com/)

## 2009

<a id="Andersson09" href="https://www.ea.com/frostbite/news/parallel-graphics-in-frostbite-current-future">Parallel Graphics in Frostbite - Current Future</a>. [Johan Andersson](https://www.linkedin.com/in/repii/), [DICE](https://www.dice.se/) / [Embark Studios](https://www.embark-studios.com/). 
SIGGRAPH 2009: Beyond Programmable Shading Course.<br>
<a id="EngelShaderX709" href="https://gitea.yiem.net/QianMo/Real-Time-Rendering-4th-Bibliography-Collection/raw/branch/main/Chapter%201-24/[0431]%20[ShaderX7%202009]%20Designing%20a%20Renderer%20for%20Multiple%20Lights-%20The%20Light%20Pre-Pass%20Renderer.pdf">Designing a Renderer for Multiple Lights: The Light Pre-Pass Renderer</a>. [Wolfgang Engel](http://diaryofagraphicsprogrammer.blogspot.com/), [Rockstar Games](https://www.rockstargames.com/) / [The Forge](https://theforge.dev/). [ShaderX7](http://www.shaderx7.com/).<br>
<a id="EngelSiggraph09" href="https://www.slideshare.net/cagetu/light-prepass">Light Pre-Pass; Deferred Lighting: Latest Development</a>. [Wolfgang Engel](http://diaryofagraphicsprogrammer.blogspot.com/), [Rockstar Games](https://www.rockstargames.com/) / [The Forge](https://theforge.dev/). [SIGGRAPH 2009: Advances in Real-Time Rendering in Games Course](https://advances.realtimerendering.com/s2009/index.html).<br>
<a id="Lee09" href="https://d3cw3dd2w32x2b.cloudfront.net/wp-content/uploads/2011/06/GDC09_Lee_Prelighting.pdf">Pre-lighting in Resistance 2</a>. [Mark Lee](http://rgba32.blogspot.com/), [Insomniac Games](https://insomniac.games/) / [Walt Disney Animation Studios](https://disneyanimation.com/). [GDC 2009](https://www.gdcvault.com/free/gdc-09/).<br>
<a id="LobanchikovGruen09" href="https://view.officeapps.live.com/op/view.aspx?src=http%3A%2F%2Fdeveloper.amd.com%2Fwordpress%2Fmedia%2F2012%2F10%2F01GDC09AD3DDStalkerClearSky210309.ppt&wdOrigin=BROWSELINK">GSC Game World’s S.T.A.L.K.E.R: Clear Sky—A Showcase for Direct3D 10.0/1</a>. [Igor A. Lobanchikov](https://www.linkedin.com/in/igorlobanchikov/), [GSC Game World](https://www.gsc-game.com/) / Retired. [Holger Gruen](https://www.linkedin.com/in/holger-gruen-b456791/), [AMD](https://www.amd.com/en). [GDC 2009](https://www.gdcvault.com/free/gdc-09/).<br>
<a id="Swoboda09" href="https://slideplayer.com/slide/1511906/">Deferred Lighting and Post Processing on PLAYSTATION 3</a>. [Matt Swoboda](https://www.linkedin.com/in/matt-swoboda-b820872/), [Sony Computer Entertainment](https://www.sie.com/en/index.html) / [Notch](https://www.notch.one/). [GDC 2009](https://www.gdcvault.com/free/gdc-09/).<br>
<a id="Thibieroz09" href="https://gitea.yiem.net/QianMo/Real-Time-Rendering-4th-Bibliography-Collection/raw/branch/main/Chapter%201-24/[1764]%20[ShaderX7%202009]%20Deferred%20Shading%20with%20Multisampling%20Anti-Aliasing%20in%20DirectX%2010.pdf">Deferred Shading with Multisampling Anti-Aliasing in DirectX 10</a>. [Nicolas Thibieroz](https://www.linkedin.com/in/nicolas-thibieroz-a4353739/), [AMD](https://www.amd.com/en). [GDC 2009](https://www.gdcvault.com/free/gdc-09/). [ShaderX7](http://www.shaderx7.com/).<br>
<a id="Trebilco09" href="https://github.com/dtrebilco/lightindexed-deferredrender/blob/master/LightIndexedDeferredLighting1.1.pdf">Light-Indexed Deferred Rendering</a>. [Damian Trebilco](https://www.linkedin.com/in/damian-trebilco-93a95213/), [THQ](https://www.thqnordic.com/) / [Situ Systems](https://situsystems.com/). [ShaderX7](http://www.shaderx7.com/).

## 2010

<a id="Kaplanyan10" href="http://advances.realtimerendering.com/s2010/Kaplanyan-CryEngine3%28SIGGRAPH%202010%20Advanced%20RealTime%20Rendering%20Course%29.pdf">CryENGINE 3: Reaching the Speed of Light</a>. [Anton Kaplanyan](https://kaplanyan.com/), [Crytek](https://www.crytek.com/) / [Intel Corporation](https://www.intel.com/content/www/us/en/homepage.html). [SIGGRAPH 2010: Advances in Real-Time Rendering in Games Course](https://advances.realtimerendering.com/s2010/index.html).<br>
<a id="Lauritzen10" href="https://www.intel.com/content/www/us/en/developer/articles/technical/deferred-rendering-for-current-and-future-rendering-pipelines.html">Deferred Rendering for Current and Future Rendering Pipelines</a>. [Andrew Lauritzen](https://dl.acm.org/profile/81310499387), [Intel Corporation](https://www.intel.com/content/www/us/en/homepage.html). SIGGRAPH 2010: Beyond Programmable Shader Course.

## 2011

<a id="Andersson11" href="https://www.ea.com/frostbite/news/directx-11-rendering-in-battlefield-3">DirectX 11 Rendering in Battlefield 3</a>. [Johan Andersson](https://www.linkedin.com/in/repii/), [DICE](https://www.dice.se/) / [Embark Studios](https://www.embark-studios.com/). [GDC 2011](https://www.gdcvault.com/free/gdc-11/)<br>
<a id="KimBarrero11" href="https://blog.popekim.com/en/2011/11/15/slides-rendering-tech-of-space-marine.html">Rendering Tech of Space Marine</a>. [Pope Kim](https://blog.popekim.com/en/), [Relic Entertainment](https://www.relic.com/) / [POCU](https://pocu.academy/ko). [Daniel Barrero](https://www.linkedin.com/in/danielbarrero/), [Relic Entertainment](https://www.relic.com/). [KGC 2011](https://www.khronos.org/events/korea-games-conference-2011).<br>
<a id="KnightRitchieParrish11" href="https://gameenginegems.com/gemsdb/article.php?id=32">Screen-Space Classification for Efficient Deferred Shading</a>. [Balor Knight](https://twitter.com/kernigit), [Black Rock Studio](https://en.wikipedia.org/wiki/Black_Rock_Studio). Matthew Ritchie, [Black Rock Studio](https://en.wikipedia.org/wiki/Black_Rock_Studio). [George Parrish](https://sites.google.com/view/georgeparrish/), [Black Rock Studio](https://en.wikipedia.org/wiki/Black_Rock_Studio). [Game Engine Gems 2](https://gameenginegems.com/gemsdb/book.php?id=2).<br>
<a id="OlssonAssarsson11" href="https://efficientshading.com/2011/01/01/tiled-shading/">Tiled Shading</a>. [Ola Olsson](https://efficientshading.com/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx)  / [Epic Games](https://www.epicgames.com/site/en-US/home). [Ulf Assarsson](http://www.cse.chalmers.se/~uffe/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx). [Journal of Graphics, GPU, and Game Tools](https://www.tandfonline.com/doi/abs/10.1080/2151237X.2011.632611?tab=permissions&scroll=top).<br>
<a id="Papathanasis11" href="https://cupdf.com/document/dragon-age-ii-dx11-technology.html?page=2">Dragon Age II DX11 Technology</a>. [Andreas Papathanasis](https://andreas-papathanasis.medium.com/), [BioWare](https://www.bioware.com/) / [Parallel Space Inc.](http://www.hadesstar.com/). [GDC 2011](https://www.gdcvault.com/free/gdc-11/).<br>
<a id="Thibieroz11" href="https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fdeveloper.amd.com%2Fwordpress%2Fmedia%2F2012%2F10%2FDeferred%2520Shading%2520Optimizations.pps&wdOrigin=BROWSELINK">Deferred Shading Optimizations</a>. [Nicolas Thibieroz](https://www.linkedin.com/in/nicolas-thibieroz-a4353739/), [AMD](https://www.amd.com/en). [GDC 2011](https://www.gdcvault.com/free/gdc-11/).<br>
<a id="WhiteBarreBrisebois11" href="https://www.ea.com/frostbite/news/more-performance-five-rendering-ideas-from-battlefield-3-and-need-for-speed-the-run">More Performance! Five Rendering Ideas from Battlefield 3 and Need For Speed: The Run</a>. [John White](https://www.linkedin.com/in/john-white-4090591/), [EA Black Box](https://en.wikipedia.org/wiki/EA_Black_Box) / [Roblox](https://www.roblox.com/). [Colin Barré-Brisebois](https://colinbarrebrisebois.com/), [DICE](https://www.dice.se/) / [SEED](https://www.ea.com/seed). [SIGGRAPH 2011: Advances in Real-Time Rendering in Games Course](http://advances.realtimerendering.com/s2011/index.html).<br>

## 2012

<a id="HaradaMcKeeYang12" href="https://diglib.eg.org/handle/10.2312/conf.EG2012.short.005-008">Forward+: Bringing Deferred Lighting to the Next Level</a>. [Takahiro Harada](https://sites.google.com/site/takahiroharada/), [AMD](https://www.amd.com/en). Jay McKee, [AMD](https://www.amd.com/en). [Jason C. Yang](https://www.linkedin.com/in/jasoncyang/), [AMD](https://www.amd.com/en) / [DGene](https://www.linkedin.com/company/dgene/). [Eurographics 2012](http://www.eurographics2012.it/).<br>
<a id="Harada12" href="https://e8040b55-a-62cb3a1a-s-sites.googlegroups.com/site/takahiroharada/storage/2012SA_2.5DCulling.pdf?attachauth=ANoY7crz6LiGa4Pg6UUy3BMrqNfxng8akXQbQQmX6zfKc8so5lMDSGuVO7d6jpoWN5pr1vFTndtY8qGT_4VgMc5_ikexCrof0i9-4cYxoUCrbtswcuGC2w_0ymMqZ3x-WVQ-4XRkD1hMLi1KO3tNpXSf-TnE-o4R1rxKxAFzeK5RS6kXj5yAje2yHKcNQf8ugsHc0ZVZYyyqWNM9WY9rBjcnx37CgAArVwe1pHr9cDHeHe4rFWYXz_w%3D&attredirects=0">A 2.5D Culling for Forward+</a>. [Takahiro Harada](https://sites.google.com/site/takahiroharada/), [AMD](https://www.amd.com/en). [SIGGRAPH ASIA 2012](https://www.siggraph.org/asia2012/).<br>
<a id="Kircher12" href="https://www.gdcvault.com/play/1015345/Lighting-and-Simplifying-Saints-Row">Lighting & Simplifying Saints Row: The Third</a>. [Scott Kircher](https://www.linkedin.com/in/scott-kircher-74332b49/), [Volition](https://www.dsvolition.com/). [GDC 2012](https://www.gdcvault.com/free/gdc-12).<br>
<a id="OlssonBilleterAssarssonHpg12" href="https://efficientshading.com/2012/01/01/clustered-deferred-and-forward-shading/">Clustered Deferred and Forward Shading</a>. [Ola Olsson](https://efficientshading.com/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx) / [Epic Games](https://www.epicgames.com/site/en-US/home). [Markus Billeter](https://www.linkedin.com/in/markus-billeter-92b89a107/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx). [Ulf Assarsson](http://www.cse.chalmers.se/~uffe/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx). [HPG 2012](https://kesen.realtimerendering.com/hpg2012-Changelog.htm).<br>
<a id="OlssonBilleterAssarssonSiggraph12" href="">Tiled and Clustered Forward Shading: Supporting Transparency and MSAA</a>. [Ola Olsson](https://efficientshading.com/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx) / [Epic Games](https://www.epicgames.com/site/en-US/home). [Markus Billeter](https://www.linkedin.com/in/markus-billeter-92b89a107/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx). [Ulf Assarsson](http://www.cse.chalmers.se/~uffe/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx). [SIGGRAPH 2012: Talks](https://dl.acm.org/doi/proceedings/10.1145/2343045).<br>
<a id="Pettineo12" href="https://therealmjp.github.io/posts/light-indexed-deferred-rendering/">Light Indexed Deferred Rendering</a>. [Matt Pettineo](https://therealmjp.github.io/), [Ready at Dawn](http://www.readyatdawn.com/). [The Danger Zone Blog](https://therealmjp.github.io/).

## 2013

<a id="OlssonBilleterAssarsson13" href="https://efficientshading.com/2013/01/01/tiled-forward-shading/">Tiled Forward Shading</a>. [Ola Olsson](https://efficientshading.com/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx) / [Epic Games](https://www.epicgames.com/site/en-US/home). [Markus Billeter](https://www.linkedin.com/in/markus-billeter-92b89a107/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx) / [University of Leeds](https://www.leeds.ac.uk/). [Ulf Assarsson](http://www.cse.chalmers.se/~uffe/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx). [GPU Pro 4](http://gpupro.blogspot.com/2012/11/gpu-pro-4-book-cover.html).<br>
<a id="HaradaMcKeeYang13" href="https://www.taylorfrancis.com/chapters/edit/10.1201/9781351261524-18/forward-step-toward-film-style-shading-real-time-takahiro-harada-jay-mckee-jason-yang">Forward+: A Step Toward Film-Style Shading in Real Time</a>. [Takahiro Harada](https://sites.google.com/site/takahiroharada/), [AMD](https://www.amd.com/en). Jay McKee, [AMD](https://www.amd.com/en). [Jason C. Yang](https://www.linkedin.com/in/jasoncyang/), [AMD](https://www.amd.com/en) / [DGene](https://www.linkedin.com/company/dgene/). [GPU Pro 4](http://gpupro.blogspot.com/2012/11/gpu-pro-4-book-cover.html).<br>
<a id="SousaWenzelRaine13" href="https://www.crytek-hq.com/crytek/crytek-news/1509-the-rendering-technologies-of-crysis-3">The Rendering Technologies of Crysis 3</a>. [Tiago Sousa](https://www.linkedin.com/in/tsousa/), [Crytek](https://www.crytek.com/) / [id Software](https://www.idsoftware.com/). [Carsten Wenzel](https://www.linkedin.com/in/cwenzel/), [Crytek](https://www.crytek.com/) / [Cloud Imperium Games](https://cloudimperiumgames.com/). [Chris Raine](https://www.linkedin.com/in/christopher-raine-46a9654/), [Crytek](https://www.crytek.com/). [GDC 2013](https://www.gdcvault.com/free/gdc-13/).<br>
<a id="Sousa13" href="https://advances.realtimerendering.com/s2013/Sousa_Graphics_Gems_CryENGINE3.pptx">CryENGINE 3: Graphics Gems</a>. [Tiago Sousa](https://www.linkedin.com/in/tsousa/), [Crytek](https://www.crytek.com/) / [id Software](https://www.idsoftware.com/). [Nickolay Kasyan](https://www.linkedin.com/in/nikolaskasyan/), [Crytek](https://www.crytek.com/) / [AMD](https://www.amd.com/en). Nicolas Schulz, [Crytek](https://www.crytek.com/). [SIGGRAPH 2013: Advances in Real-Time Rendering in 3D Graphics and Games Course](https://advances.realtimerendering.com/s2013/index.html).<br>
<a id="StewartThomas13" href="https://www.gdcvault.com/play/1017627/Advanced-Visual-Effects-with-DirectX">Tiled Rendering Showdown: Forward++ vs. Deferred Rendering</a>. [Jason Stewart](https://www.linkedin.com/in/jasonestewart/), [AMD](https://www.amd.com/en). [Gareth Thomas](https://www.linkedin.com/in/gareth-thomas-032654b/), [AMD](https://www.amd.com/en). [GDC 2013](https://www.gdcvault.com/free/gdc-13/).<br>
<a id="TatarchukTchouVenzon13" href="https://advances.realtimerendering.com/s2013/Tatarchuk-Destiny-SIGGRAPH2013.pdf">Destiny: From Mythic Science Fiction to Rendering in Real-Time</a>. [Natalya Tatarchuk](https://www.linkedin.com/in/natalyatatarchuk/), [Bungie](https://www.bungie.net/) / [Unity Technologies](https://unity.com/). [Chris Tchou](https://mobile.twitter.com/cdxntchou), [Bungie](https://www.bungie.net/). [Joe Venzon](https://www.linkedin.com/in/joe-venzon-8a411710/), [Bungie](https://www.bungie.net/). [SIGGRAPH 2013: Advances in Real-Time Rendering in 3D Graphics and Games Course](https://advances.realtimerendering.com/s2013/index.html).<br>

## 2014

<a id="Bentley14" href="https://www.gdcvault.com/play/1020399/Engine-Postmortem-of-inFAMOUS-Second">inFAMOUS Second Son Engine Postmortem</a>. [Adrian Bentley](https://twitter.com/adrianb3000), [Sucker Punch Productions](https://www.suckerpunch.com/). [GDC 2014](https://www.gdcvault.com/free/gdc-14).<br>
<a id="Bezrati14" href="http://advances.realtimerendering.com/s2014/#_REAL-TIME_LIGHTING_VIA">Real-Time Lighting via Light Linked List</a>. [Abdul Bezrati](https://www.linkedin.com/in/abdulbezrati/), [Insomniac Games](https://insomniac.games/). [SIGGRAPH 2014: Advances in Real-Time Rendering in 3D Graphics and Games Course](http://advances.realtimerendering.com/s2014/).<br>
<a id="Dufresne14" href="https://www.intel.com/content/www/us/en/developer/articles/technical/forward-clustered-shading.html">Forward Clustered Shading</a>. Marc Fauconneau Dufresne, [Intel Corporation](https://www.intel.com/content/www/us/en/homepage.html). [Intel Software Developer Zone](https://www.intel.com/content/www/us/en/developer/overview.html).<br>
<a id="Leadbetter14" href="https://www.eurogamer.net/digitalfoundry-2014-the-making-of-forza-horizon-2">The Making of Forza Horizon 2</a>. [Richard Leadbetter](Richard Leadbetter), [Digital Foundary](https://www.eurogamer.net/digital-foundry). [Eurogamer.net](https://www.eurogamer.net/).<br>
<a id="NeubeltPettineo14" href="https://www.gdcvault.com/play/1020162/Crafting-a-Next-Gen-Material">Crafting a Next-Gen Material Pipeline for The Order: 1886</a>. [David Neubelt](https://www.linkedin.com/in/coderdave/), [Ready at Dawn](http://www.readyatdawn.com/). [Matt Pettineo](https://therealmjp.github.io/), [Ready at Dawn](http://www.readyatdawn.com/). [GDC 2014](https://www.gdcvault.com/free/gdc-14).<br>
<a id="Pesce14" href="http://c0de517e.blogspot.com/2014/09/notes-on-real-time-renderers.html">Notes on Real-Time Renderers</a>. [Angelo Pesce](http://c0de517e.blogspot.com/), [Activision](https://www.activision.com/) / [Roblox](https://www.roblox.com/). [C0DE517E Blog](http://c0de517e.blogspot.com/).<br>
<a id="Schulz14" href="https://www.gdcvault.com/play/1020432/Moving-to-the-Next-Generation">Moving to the Next Generation—The Rendering Technology of Ryse</a>. Nicolas Schulz, [Crytek](https://www.crytek.com/). [GDC 2014](https://www.gdcvault.com/free/gdc-14).<br>

## 2015

<a id="Bezrati15" href="https://www.taylorfrancis.com/chapters/edit/10.1201/b18805-16/1-real-time-lighting-via-light-linked-list-abdul-bezrati">Real-Time Lighting via Light Linked List</a>. [Abdul Bezrati](https://www.linkedin.com/in/abdulbezrati/), [Insomniac Games](https://insomniac.games/). [GPU Pro 6](http://gpupro.blogspot.com/2014/12/gpu-pro-6-table-of-contents.html).<br>
<a id="OlssonBilleterSintorn15" href="https://efficientshading.com/2015/06/01/more-efficient-virtual-shadow-maps-for-many-lights/">More Efficient Virtual Shadow Maps for Many Lights</a>. [Ola Olsson](https://efficientshading.com/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx) / [Epic Games](https://www.epicgames.com/site/en-US/home). [Markus Billeter](https://www.linkedin.com/in/markus-billeter-92b89a107/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx). [Erik Sintorn](https://www.chalmers.se/en/staff/Pages/erik-sintorn.aspx), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx). [IEEE Transactions on Visualization and Computer Graphics](https://www.computer.org/csdl/journal/tg).<br>
<a id="Olsson15" href="https://efficientshading.com/wp-content/uploads/s2015_introduction.pdf">Introduction to Real-Time Shading with Many Lights</a>. [Ola Olsson](https://efficientshading.com/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx) / [Epic Games](https://www.epicgames.com/site/en-US/home). [SIGGRAPH 2015: Real-Time Many-Light Management and Shadows with Clustered Shading Course](http://s2015.siggraph.org/attendees/courses/sessions/real-time-many-light-management-and-shadows-clustered-shading.html)
<a id="Pettineo15" href="http://advances.realtimerendering.com/s2015/index.html#_REFLECTION_SYSTEM_IN">Rendering the Alternate History of The Order: 1886</a>. [Matt Pettineo](https://therealmjp.github.io/), [Ready at Dawn](http://www.readyatdawn.com/). [SIGGRAPH 2015: Advances in Real-Time Rendering in Games Course](http://advances.realtimerendering.com/s2015/).<br>

## 2016

<a id="ElGarawany16" href="http://advances.realtimerendering.com/s2016/#_HIGH-QUALITY_TEMPORAL_SUPERSAMPLING">Deferred Lighting in Uncharted 4</a>. [Ramy El Garawany](https://www.linkedin.com/in/ramy-el-garawany-7a805820/), [Naughty Dog](https://www.naughtydog.com/) / [Google](https://careers.google.com/). [SIGGRAPH 2016: Advances in Real-Time Rendering in Games Course](http://advances.realtimerendering.com/s2016/).
<a id="ElMansouri16" href="https://youtu.be/RAy8UoO2blc">Rendering Tom Clancy’s Rainbow Six Siege</a>. [Jalal El Mansouri](https://www.linkedin.com/in/jalal-el-mansouri-60a73423/), [Ubisoft Montréal](https://montreal.ubisoft.com/en/) / [Haven Studios Inc.](https://www.havenstudios.com/en). [GDC 2016](https://www.gdcvault.com/free/gdc-16/)
<a id="OrtegrenPersson16" href="https://github.com/kevinortegren/ClusteredShadingConservative">Clustered Shading: Assigning Lights Using Conservative Rasterization in DirectX 12</a>. [Kevin Örtegren](https://www.linkedin.com/in/kevinortegren/), [Avalanche Studios](https://avalanchestudios.com/) / [Epic Games](https://www.epicgames.com/site/en-US/home). [Emil Persson](http://www.humus.name/), [Avalanche Studios](https://avalanchestudios.com/) / [Elemental Games](https://elemental.games/). [GPU Pro 7](http://gpupro.blogspot.com/2016/01/gpu-pro-7-table-of-content.html).

## 2017

<a id="Anagnostou17" href="https://interplayoflight.wordpress.com/2017/10/25/how-unreal-renders-a-frame/">How Unreal Renders a Frame</a>. [Kostas Anagnostou](https://interplayoflight.wordpress.com/), [Radiant Worlds](https://en.wikipedia.org/wiki/Rebellion_Warwick) / [Playground Games](https://playground-games.com/). [Interplay of Light Blog](https://interplayoflight.wordpress.com/)

## People by Company

<table>
  <thead>
    <tr>
      <th>Company</th>
      <th>People</th>
      <th>Referene</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Snapshot Games</td>
      <td>Dean Calver</td>
      <td><a href="#Calver03">Photo-realistic Deferred Lighting</a></td>
    </tr>
    <tr>
      <td rowspan="2">Microsoft</td>
      <td rowspan="2">Shawn Hargreaves</td>
      <td><a href="#Hargreaves04">Deferred Shading</a></td>
    </tr>
    <tr>
      <td><a href="#HargreavesHarris04">Deferred Shading</a></td>
    </tr>
    <tr>
      <td>NVIDIA</td>
      <td>Mark Harris</td>
      <td><a href="#HargreavesHarris04">Deferred Shading</a></td>
    </tr>
    <tr>
      <td rowspan="11">AMD</td>
      <td rowspan="3">Nicolas Thibieroz</td>
      <td><a href="#Thibieroz04">Deferred Shading with Multiple Render Targets</a></td>
    </tr>
      <tr>
        <td><a href="#Thibieroz09">Deferred Shading with Multisampling Anti-Aliasing in DirectX 10</a></td>
      </tr>
      <tr>
        <td><a href="#Thibieroz11">Deferred Shading Optimizations</a></td>
      </tr>
      <tr>
        <td>Holger Gruen</td>
        <td><a href="#LobanchikovGruen09">GSC Game World’s S.T.A.L.K.E.R: Clear Sky—A Showcase for Direct3D 10.0/1</a></td>
      </tr>
      <tr>
        <td rowspan="3">Takahiro Harada</td>
        <td><a href="#HaradaMcKeeYang12">Forward+: Bringing Deferred Lighting to the Next Level</a></td>
      </tr>
        <tr>
          <td><a href="#Harada12">A 2.5D Culling for Forward+</a></td>
        </tr>
        <tr>
          <td><a href="#HaradaMcKeeYang13">Forward+: A Step Toward Film-Style Shading in Real Time</a></td>
        </tr>
      <tr>
        <td rowspan="2">Jay McKee</td>
        <td><a href="#HaradaMcKeeYang12">Forward+: Bringing Deferred Lighting to the Next Level</a></td>
      </tr>
        <tr>
          <td><a href="#HaradaMcKeeYang13">Forward+: A Step Toward Film-Style Shading in Real Time</a></td>
        </tr>
      <tr>
        <td>Jason Stewart</td>
        <td><a href="#StewartThomas13">Tiled Rendering Showdown: Forward++ vs. Deferred Rendering</a></td>
      </tr>
      <tr>
        <td>Gareth Thomas</td>
        <td><a href="#StewartThomas13">Tiled Rendering Showdown: Forward++ vs. Deferred Rendering</a></td>
      </tr>
    <tr>
      <td>4A Games</td>
      <td>Oleksandr Shyshkovtsov</td>
      <td><a href="#Shishkovtsov05">Deferred Shading in S.T.A.L.K.E.R.</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Frank Puig Placeres</td>
      <td><a href="#Placeres06">Overcoming Deferred Shading Drawbacks</a></td>
    </tr>
    <tr>
      <td>Facebook</td>
      <td>Rusty Koonce</td>
      <td><a href="#Koonce07">Deferred Shading in Tabula Rasa</a></td>
    </tr>
    <tr>
      <td rowspan="8">Epic Games</td>
      <td>Michal Valient</td>
      <td><a href="#Valient07">Deferred Rendering in Killzone 2</a></td>
    </tr>
      <tr>
        <td rowspan="6">Ola Olsson</td>
        <td><a href="#OlssonAssarsson11">Tiled Shading</a></td>
      </tr>
        <tr>
          <td><a href="#OlssonBilleterAssarssonHpg12">Clustered Deferred and Forward Shading</a></td>
        </tr>
        <tr>
          <td><a href="#OlssonBilleterAssarssonSiggraph12">Tiled and Clustered Forward Shading: Supporting Transparency and MSAA</a></td>
        </tr>
        <tr>
          <td><a href="#OlssonBilleterAssarsson13">Tiled Forward Shading</a></td>
        </tr>
        <tr>
          <td><a href="#OlssonBilleterSintorn15">More Efficient Virtual Shadow Maps for Many Lights</a></td>
        </tr>
        <tr>
          <td><a href="#Olsson15">Introduction to Real-Time Shading with Many Lights</a></td>
        </tr>
      <tr>
        <td>Kevin Örtegren</td>
        <td><a href="#OrtegrenPersson16">Clustered Shading: Assigning Lights Using Conservative Rasterization in DirectX 12</a></td>
      </tr>
    <tr>
      <td>Apple</td>
      <td>Pål-Kristian Engstad</td>
      <td><a href="#BalestraEngstad08">The Technology of Uncharted: Drake's Fortune</a></td>
    </tr>
    <tr>
      <td>Snap Inc.</td>
      <td>Dominic Filion</td>
      <td><a href="#FilionMcNaughton08">StarCraft II: Effects & Techniques</a></td>
    </tr>
    <tr>
      <td>Blizzard Entertainment</td>
      <td>Rob McNaughton</td>
      <td><a href="#FilionMcNaughton08">StarCraft II: Effects & Techniques</a></td>
    </tr>
    <tr>
      <td rowspan="2">Embark Studios</td>
      <td rowspan="2">Johan Andersson</td>
      <td><a href="#Andersson09">Parallel Graphics in Frostbite - Current Future</a></td>
    </tr>
    <tr>
      <td><a href="#Andersson11">DirectX 11 Rendering in Battlefield 3</a></td>
    </tr>
    <tr>
      <td rowspan="2">The Forge</td>
      <td rowspan="2">Wolfgang Engel</td>
      <td><a href="#EngelShaderX709">Designing a Renderer for Multiple Lights: The Light Pre-Pass Renderer</a></td>
    </tr>
    <tr>
      <td><a href="#EngelSiggraph09">Light Pre-Pass; Deferred Lighting: Latest Development</a></td>
    </tr>
    <tr>
      <td>Walt Disney Animation Studios</td>
      <td>Mark Lee</td>
      <td><a href="#Lee09">Pre-lighting in Resistance 2</a></td>
    </tr>
    <tr>
      <td rowspan="2">Retired</td>
      <td>Christophe Balestra</td>
      <td><a href="#BalestraEngstad08">The Technology of Uncharted: Drake's Fortune</a></td>
    </tr>
    <tr>
      <td>Igor A. Lobanchikov</td>
      <td><a href="#LobanchikovGruen09">GSC Game World’s S.T.A.L.K.E.R: Clear Sky—A Showcase for Direct3D 10.0/1</a></td>
    </tr>
    <tr>
      <td>Notch</td>
      <td>Matt Swoboda</td>
      <td><a href="#Swoboda09">Deferred Lighting and Post Processing on PLAYSTATION 3</a></td>
    </tr>
    <tr>
      <td>Situ Systems</td>
      <td>Damian Trebilco</td>
      <td><a href="#Trebilco09">Light-Indexed Deferred Rendering</a></td>
    </tr>
    <tr>
      <td rowspan="3">Intel Corporation</td>
      <td>Anton Kaplanyan</td>
      <td><a href="#Kaplanyan10">CryENGINE 3: Reaching the Speed of Light</a></td>
    </tr>
      <tr>
        <td>Andrew Lauritzen</td>
        <td><a href="#Lauritzen10">Deferred Rendering for Current and Future Rendering Pipelines</a></td>
      </tr>
      <tr>
        <td>Marc Fauconneau Dufresne</td>
        <td><a href="#Dufresne14">Forward Clustered Shading</a></td>
      </tr>
    <tr>
      <td>POCU</td>
      <td>Pope Kim</td>
      <td><a href="#KimBarrero11">Rendering Tech of Space Marine</a></td>
    </tr>
    <tr>
      <td>Relic Entertainment</td>
      <td>Daniel Barrero</td>
      <td><a href="#KimBarrero11">Rendering Tech of Space Marine</a></td>
    </tr>
    <tr>
      <td rowspan="3">Black Rock Studio</td>
      <td>Balor Knight</td>
      <td><a href="#KnightRitchieParrish11">Screen-Space Classification for Efficient Deferred Shading</a></td>
    </tr>
    <tr>
      <td>Matthew Ritchie</td>
      <td><a href="#KnightRitchieParrish11">Screen-Space Classification for Efficient Deferred Shading</a></td>
    </tr>
    <tr>
      <td>George Parrish</td>
      <td><a href="#KnightRitchieParrish11">Screen-Space Classification for Efficient Deferred Shading</a></td>
    </tr>
    <tr>
      <td rowspan="9">Chalmers University of Technology</td>
      <td rowspan="4">Ulf Assarsson</td>
      <td><a href="#OlssonAssarsson11">Tiled Shading</a></td>
    </tr>
      <tr>
        <td><a href="#OlssonBilleterAssarssonHpg12">Clustered Deferred and Forward Shading</a></td>
      </tr>
      <tr>
        <td><a href="#OlssonBilleterAssarssonSiggraph12">Tiled and Clustered Forward Shading: Supporting Transparency and MSAA</a></td>
      </tr>
      <tr>
        <td><a href="#OlssonBilleterAssarsson13">Tiled Forward Shading</a></td>
      </tr>
      <tr>
        <td rowspan="4">Markus Billeter</td>
        <td><a href="#OlssonBilleterAssarssonHpg12">Clustered Deferred and Forward Shading</a></td>
      </tr>
        <tr>
          <td><a href="#OlssonBilleterAssarssonSiggraph12">Tiled and Clustered Forward Shading: Supporting Transparency and MSAA</a></td>
        </tr>
        <tr>
          <td><a href="#OlssonBilleterAssarsson13">Tiled Forward Shading</a></td>
        </tr>
        <tr>
          <td><a href="#OlssonBilleterSintorn15">More Efficient Virtual Shadow Maps for Many Lights</a></td>
        </tr>
      <tr>
        <td>Erik Sintorn</td>
        <td><a href="#OlssonBilleterSintorn15">More Efficient Virtual Shadow Maps for Many Lights</a></td>
      </tr>
    <tr>
      <td>Parallel Space Inc.</td>
      <td>Andreas Papathanasis</td>
      <td><a href="#Papathanasis11">Dragon Age II DX11 Technology</a></td>
    </tr>
    <tr>
      <td rowspan="2">Roblox</td>
      <td>John White</td>
      <td><a href="#WhiteBarreBrisebois11">More Performance! Five Rendering Ideas from Battlefield 3 and Need For Speed: The Run</a></td>
    </tr>
      <tr>
        <td>Angelo Pesce</td>
        <td><a href="#Pesce14">Notes on Real-Time Renderers</a></td>
      </tr>
    <tr>
      <td>SEED</td>
      <td>Colin Barré-Brisebois</td>
      <td><a href="#WhiteBarreBrisebois11">More Performance! Five Rendering Ideas from Battlefield 3 and Need For Speed: The Run</a></td>
    </tr>
    <tr>
      <td rowspan="2">DGene</td>
      <td rowspan="2">Jason C. Yang</td>
      <td><a href="#HaradaMcKeeYang12">Forward+: Bringing Deferred Lighting to the Next Level</a></td>
    </tr>
      <tr>
        <td><a href="#HaradaMcKeeYang13">Forward+: A Step Toward Film-Style Shading in Real Time</a></td>
      </tr>
    <tr>
      <td>Volition</td>
      <td>Scott Kircher</td>
      <td><a href="#Kircher12">Lighting & Simplifying Saints Row: The Third</a></td>
    </tr>
    <tr>
      <td rowspan="4">Ready at Dawn</td>
      <td rowspan="3">Matt Pettineo</td>
      <td><a href="#Pettineo12">Light Indexed Deferred Rendering</a></td>
    </tr>
      <tr>
        <td><a href="#NeubeltPettineo14">Crafting a Next-Gen Material Pipeline for The Order: 1886</a></td>
      </tr>
      <tr>
        <td><a href="#Pettineo15">Rendering the Alternate History of The Order: 1886</a></td>
      </tr>
      <tr>
        <td>David Neubelt</td>
        <td><a href="#NeubeltPettineo14">Crafting a Next-Gen Material Pipeline for The Order: 1886</a></td>
      </tr>
    <tr>
      <td rowspan="2">id Software</td>
      <td rowspan="2">Tiago Sousa</td>
      <td><a href="#SousaWenzelRaine13">The Rendering Technologies of Crysis 3</a></td>
    </tr>
      <tr>
        <td><a href="#Sousa13">CryENGINE 3: Graphics Gems</a></td>
      </tr>
    <tr>
      <td>Cloud Imperium Games</td>
      <td>Carsten Wenzel</td>
      <td><a href="#SousaWenzelRaine13">The Rendering Technologies of Crysis 3</a></td>
    </tr>
    <tr>
      <td rowspan="2">Crytek</td>
      <td>Chris Raine</td>
      <td><a href="#SousaWenzelRaine13">The Rendering Technologies of Crysis 3</a></td>
    </tr>
      <tr>
        <td>Nicolas Schulz</td>
        <td><a href="#Schulz14">Moving to the Next Generation—The Rendering Technology of Ryse</a></td>
      </tr>
    <tr>
      <td>Unity Technologies</td>
      <td>Natalya Tatarchuk</td>
      <td><a href="#TatarchukTchouVenzon13">Destiny: From Mythic Science Fiction to Rendering in Real-Time</a></td>
    </tr>
    <tr>
      <td rowspan="2">Bungie</td>
      <td>Chris Tchou</td>
      <td><a href="#TatarchukTchouVenzon13">Destiny: From Mythic Science Fiction to Rendering in Real-Time</a></td>
    </tr>
      <tr>
        <td>Joe Venzon</td>
        <td><a href="#TatarchukTchouVenzon13">Destiny: From Mythic Science Fiction to Rendering in Real-Time</a></td>
      </tr>
    <tr>
      <td>Sucker Punch Productions</td>
      <td>Adrian Bentley</td>
      <td><a href="#Bentley14">inFAMOUS Second Son Engine Postmortem</a></td>
    </tr>
    <tr>
      <td>Insomniac Games</td>
      <td>Abdul Bezrati</td>
      <td><a href="#Bezrati14">Real-Time Lighting via Light Linked List</a></td>
    </tr>
    <tr>
      <td>Digital Foundary</td>
      <td>Richard Leadbetter</td>
      <td><a href="#Leadbetter14">The Making of Forza Horizon 2</a></td>
    </tr>
    <tr>
      <td>Google</td>
      <td>Ramy El Garawany</td>
      <td><a href="#ElGarawany16">Deferred Lighting in Uncharted 4</a></td>
    </tr>
    <tr>
      <td>Haven Studios Inc.</td>
      <td>Jalal El Mansouri</td>
      <td><a href="#ElMansouri16">Rendering Tom Clancy’s Rainbow Six Siege</a></td>
    </tr>
    <tr>
      <td>Elemental Games</td>
      <td>Emil Persson</td>
      <td><a href="#OrtegrenPersson16">Clustered Shading: Assigning Lights Using Conservative Rasterization in DirectX 12</a></td>
    </tr>
    <tr>
      <td>Playground Games</td>
      <td>Kostas Anagnostou</td>
      <td><a href="#Anagnostou17">How Unreal Renders a Frame</a></td>
    </tr>
  </tbody>
</table>

---

* Z Pre-Pass
  
```
@startuml
start
split
group Render Opaque Objects
    :Depth Buffer;
floating note left: Z Pre-Pass
floating note right: Sort Front-To-Back
    :Switch Off Depth Write;
    :Forward Rendering;
floating note left: Sort Front-To-Back
end group
split again
group Transparent Objects
    :Switch Off Depth Write;
    :Forward Rendering;
    floating note right: Sort Back-To-Front
end group
end split
stop
@enduml
```
