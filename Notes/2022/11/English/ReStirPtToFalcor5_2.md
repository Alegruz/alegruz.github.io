# ReSTIR PT to Falcor 5.2 (2022.11.04)
[Home](/README.md)

# ReSTIR PT

## Signature

* `static SharedPtr create(RenderContext* pRenderContext, const Dictionary& dict)`
* ~~`virtual std::string getDesc() override`~~
  * Not included in Path Tracer
* `virtual Dictionary getScriptingDictionary() override`
* `Dictionary getSpecializedScriptingDictionary()`
  * Not included in Path Tracer
* `virtual RenderPassReflection reflect(const CompileData& compileData) override`
* ~~`virtual void compile(RenderContext* pContext, const CompileData& compileData) override`~~
  * Not included in Path Tracer
  * Performs frame dimension / screen tiles initialization
  * Path Tracer performs this in `setFrameDim`
* `virtual void setScene(RenderContext* pRenderContext, const Scene::SharedPtr& pScene) override`
* `virtual void execute(RenderContext* pRenderContext, const RenderData& renderData) override`
* `virtual void renderUI(Gui::Widgets& widget) override`
* `virtual bool onMouseEvent(const MouseEvent& mouseEvent) override`
* `virtual bool onKeyEvent(const KeyboardEvent& keyEvent) override`
* `void updateDict(const Dictionary& dict) override`
  * Not included in Path Tracer
  * Can be excluded, include this into the constructor
* `void initDict() override`
  * Not included in Path Tracer
  * Can be excluded, include this into the constructor
* `static void registerBindings(pybind11::module& m)`
* `ReSTIRPTPass(const Dictionary& dict)`
* `bool parseDictionary(const Dictionary& dict)`
* `void validateOptions()`
* `void updatePrograms()`
* `void prepareResources(RenderContext* pRenderContext, const RenderData& renderData)`
* `void setNRDData(const ShaderVar& var, const RenderData& renderData) const`
* `void preparePathTracer(const RenderData& renderData)`
* `void resetLighting()`
* `void prepareMaterials(RenderContext* pRenderContext)`
* `bool prepareLighting(RenderContext* pRenderContext)`
* `void setShaderData(const ShaderVar& var, const RenderData& renderData, bool isPathTracer, bool isPathGenerator) const`
* `bool beginFrame(RenderContext* pRenderContext, const RenderData& renderData)`
* `void endFrame(RenderContext* pRenderContext, const RenderData& renderData)`
* `void generatePaths(RenderContext* pRenderContext, const RenderData& renderData, int sampleId = 0)`
* `void tracePass(RenderContext* pRenderContext, const RenderData& renderData, const ComputePass::SharedPtr& pass, const std::string& passName, int sampleId)`
* `void PathReusePass(RenderContext* pRenderContext, uint32_t restir_i, const RenderData& renderData, bool temporalReuse = false, int spatialRoundId = 0, bool isLastRound = false)`
  * Not included in Path Tracer
* `void PathRetracePass(RenderContext* pRenderContext, uint32_t restir_i, const RenderData& renderData, bool temporalReuse = false, int spatialRoundId = 0)`
  * Not included in Path Tracer
* `Texture::SharedPtr createNeighborOffsetTexture(uint32_t sampleCount)`
  * Not included in Path Tracer

### `beginFrame`

1. Clear outputs
2. Update env map / emissive sampler
3. Update refresh flag
4. Check if GBuffer has adjusted shading normals enabled
5. Check if NRD data should be generated
6. Check if time data should be generated
7. Enable pixel stats if rayCount or pathLength outputs are connected
8. `mpPixelStats->beginFrame`
9. `mpPixelDebug->beginFrame`
10. Update the random seed

### `compile`

1. Initialize
   * frame dimension
   * screen tiles

> removed. frame dimension and screen tiles are updated in `setFrameDim` of Path Tracer

### Constructor

1. Check if ray tracing is supported
2. `parseDictionary`
3. `validateOptions`
4. Load N-Rook patterns (for Bekaert-style path reuse)
5. Create sample generator
6. Create neighbor offset texture
7. Create programs
   1. Generate paths
   2. Reflect Types
   3. Trace pass
   4. Spatial path retrace pass
   5. temporal path retrace pass
   6. spatial reuse pass
   7. tepmoral reuse pass
   8. compute path reuse MIS weights pass
   * Path Tracer creates these lazily in `updatePrograms` 
8. Allocate resources that don't change in size
   1. Counters
   2. Counters readback
   3. Pixel stats/debug
   4. Readback fence

### `createNeighborOffsetTexture`

* Create texture

### `endFrame`

1. End frame for pixel stats / debug
2. Get pixel stats
3. Copy pixel stats to outputs if available

### `execute`

1. `beginFrame`
2. Initialize parameters
   * temporal reuse
   * number of candidate samples
   * shift strategy
   * MIS kind
3. Main loop
   1. `updatePrograms`
   2. `prepareResources`
   3. `preparePathTracer`
   4. Clear output time UAV texture
   5. Clear counter UAV texture
   6. spp = number of ReSTIR reservoir textures
   7. `generatePaths`
   8. `tracePass`
   9. ReSTIR Merge Pass
      1.  `PathRetracePass` for hybrid shift mappings
      2.  `PathRetracePass` for hybrid shift/random number replay
   10. For number of spatial reuse rounds
      1.  `PathRetracePass` for hybrid shift mappings
      2.  `PathRetracePass` for hybrid shift/random number replay
   11. Mark as at least one temporally reused frame
   12. Copy temporal v buffer to input v buffer for temporal reuse
   13. Increment seed
4.  Increment frame count
5.  `endFrame`

### `generatePaths`

1. Check shader assumptions
2. Additional specialization
3. Bind resources
   * path generation `setShaderData` 
4. Set `gScene` for path generation
5. Set `gSampleId`
6. Launch one thread per pixel of path generation

### `parseDictionary`

* Parse:
  * samples per pixel
  * max surface/diffuse/specular/transmission bounces
  * adjust shading normals
  * LOD bias
  * sample generator
  * fixed seed
  * use BSDF sampling
  * use NEE
  * use MIS
  * use russian roulette
  * use alpha test
  * max nested materials
  * use lights in dielectric volumes
  * limit transimission
  * max transmission reflection/refraction depth
  * disable caustics
  * specular roughness threshold
  * disable DI
  * primary LOD mode
  * Denoising parameters:
    * use NRD demodulation
  * color format
  * MIS heuristic
  * MIS power exponent
  * emissive sampler
  * light BVH options
  * spatial MIS kind
  * temporal MIS kind
  * shift strategy
  * reject shift based on jacobian
  * jacobian rejection threshold
  * near field distance
  * temporal history length
  * use max history
  * seed offset
  * enable temporal reuse
  * enable spatial reuse
  * num spatial rounds
  * path sampling mode
  * local strategy type
  * enable temporal reprojection
  * no resampling for temporal reuse
  * spatial neighbor count
  * feature based rejection
  * spatial reuse pattern
  * small window ReSTIR window radius
  * spatial reuse radius
  * use DI
  * separate path BSDF
  * candidate samples
  * temporal update for dynamic scene
  * enable ray stats

### `PathRetracePass`

1. Check shader assumptions
2. Additional specialization
3. Bind resources
   1. `setShaderData`
4. `prepareProgram` for pixel stats / debug
5. Launch one thread per pixel

### `PathReusePass`

1. Check shader assumptions
2. Additional specialization
3. Bind resources
4. `setShaderData`
5. `prepareProgram` for pixel stats/debug
6. Execute pass

### `prepareLighting`

1. Check render settings changes
2. Check env map changes
3. Create env map sampler if env light is used
4. Request the light collection if emissive lights are enabled
5. Create emissive sampler if emissive lights are used
6. If emissive sampler is created, then:
   1. Update the emissive sampler
   2. Add defines to programs: 
      1. trace pass
      2. spatial path retrace pass
      3. temporal path retrace pass
      4. spatial reuse pass
      5. temporal reuse pass
      6. compute path reuse MIS weights pass

### `prepareMaterials`

* Checks for material changes and performs any necessary updates

### `preparePathTracer`

1. Create path tracer parameter block if needed
2. Bind resources
   * `setShaderData`
   * output reservoirs
   * direct lighting 

### `prepareResources`

1. Compute allocation requirements for paths and output samples
   * tile count
   * reservoir count
   * screen pixel count
   * sample count 
2. Create reconnection data buffer if hybrid shift map is used
3. Create/resize output reservoirs
4. Allocate path buffers
   1. Create output reservoirs
   2. Create temporal reservoirs
5. Create temporal v buffer

### `static void registerBindings(pybind11::module& m)`

* Register:
  * Enums:
    * shift mapping
    * ReSTIR MIS kind
    * path sampling mode
    * spatial reuse pattern
  * Class:
    * ReSTIR PT pass
  * Property
    * use fixed seed
    * fixed seed

### `renderUI`

1. `renderRenderingUI`
2. `renderStatsUI`
3. `renderDebugUI`
4. If dirty,
   1. `validateOptions`

### `resetLighting`

* Retain the options for the emissive sampler

### `setNRDData`

* Set:
  * primary hit emission
  * primary hit diffuse reflectance
  * primary hit specular reflectance

### `setScene`

1. Initialize variables
   * scene
   * frame count
2. `resetLighting`
3. Check if the scene is dynamic
   * checked for temporal reuse 
4. Prepare programs for the scene
   * add defines to each shader programs
     * generate paths
     * trace pass
     * reflect types
     * spatial path retrace pass
     * temporal path retrace pass
     * spatial reuse pass
     * temporal reuse pass
     * compute path reuse MIS weights pass
     * Path Tracer does this in `updatePrograms`
5. `validateOptions`

> no. 4 removed. program preparations are performed in `updatePrograms`. 

### `setShaderData`

1. Bind static resources that don't change per frame
   *  if path tracer, set shader data for env map sampler
2. Bind runtime data
   * parameters
   * v buffer
   * output color 
3. `setNRDData`
4. If path tracer,
   * Set variables:
     * isLastRound
     * useDirectLighting
     * kUseEnvLight
     * kUseEmissiveLights
     * kUseAnalyticLights 
5. If path generator,
   * kUseEnvBackground 
6. Set output debug and time
7. Set shader data for emissive sampler if path tracer

### `tracePass`

1. Additional specialization
2. Bind global resources
3. Set shader data of sample generator
4. Prepare pixel stats / debug program
5. Bind the path tracer
   * path tracer
   * sample ID 
6. Launch the threads for the trace pass

### `updatePrograms`

1. Update program specialization
2. Recreate program vars

### `validateOptions`

1. Validate:
   * specular roughness threshold
   * samples per pixel
2. Range validation:
   * Clamp:
      * max surface/diffuse/specular/transmission bounces
   * min/max surface bounces
   * max transmission reflection/refraction depth
3. Validate:
   * primary lod mode

## Shaders

### `GeneratePaths.cs.slang`

#### `PathGenerator::execute(const uint2 tileID, const uint threadIdx)`

1. Map thread to pixel based on Morton order within tile
2. Process the pixel to determine which queue to use
3. Compute the primary ray
4. Load the primary hit from the V-buffer
5. If hit, use the general queue
6. Append paths to queues
7. If not general queue and global sample id is 0, write background pixels `writeBackground`
8. Only one path per pixel needed

#### `writeBackground(const uint2 pixel, const float3 dir)`

1. Evaluate background color for the current pixel
2. Write color for all samples in pixel

### `LoadShadingData.slang`

Only the functions that clashes with Path Tracer are checked here

#### `VertexData loadVertexData(const HitInfo hit, const float3 viewDir, out uint materialID, out float curveSphereRadius)`

1. Get hit data according to the primitive type
2. Get vertex data according to the primitive type
3. Get material ID from hit info
4. Return the vertex data, material id, and `curveSphereRadius` if curve primitive type is set

#### `ShadingData loadShadingDataWithPrevVertexPosition(const HitInfo hit, const float3 prevVertexPosition, const bool isPrimary, const float lod = 0.f)`

Only in ReSTIR PT

1. load vertex data `loadVertexData`
2. get view direction from world-space position to prev vertex position
3. prepare shading data `prepareShadingData`
4. adjust shading data `adjustShadingData`

### `Params.slang`

* enums
  * Counters
  * Color format
  * MIS heuristic
  * Shift mapping
  * Local strategy
  * ReSTIR MIS kind
  * Spatial reuse pattern
  * Path sampling mode
  * Path reuse pattern
* Static constant variables
  * Screen tile dimension
  * Screen tile bits
  * Max samples per pixel
  * Max frame dimension
  * Max bounces
  * Max light samples per vertex
* structs
  * ReSTIR path tracer params
    * use fixed seed
    * seed
    * fixed seed
    * LoD bias
    * Runtime values
      * frame dimension
      * screen tiles
    * frame count
    * local strategy type
    * reject shift based on jacobian
    * jacobian rejection threshold
    * specular roughness threshold
    * near field distance

### `PathBuilder.slang`

Only in ReSTIR PT

* `struct PathBuilder`
  * Member variables:
    * `TriMeshHitInfo rcVertexHit`
    * `float3 rcVertexWi[kRcWiCount]`
    * `uint cachedRandomSeed`
    * `TinyUniformSampleGenerator sg`
    * `int rcVertexLength`
    * `ReSTIRPathFlags pathFlags`
    * `float3 cachedJacobian`
  * Member functions:
    * `void init<S : ISampleGenerator>(inout S sg)` 
    * `void finalize(inout PathReservoir pathReservoir)`
    * `bool addEscapeVertex(RestirPathTracerParams params, uint pathLength, float3 wi, float3 pathWeight, float3 postfixWeight, bool useHybridShift, float russianroulettePDF, float misWeight, float lightPdf, int lightType, inout PathReservoir pathReservoir, bool forceAdd = false)`
    * `bool addNeeVertex(RestirPathTracerParams params, uint pathLength, float3 wi, float3 pathWeight, float3 postfixWeight, bool useHybridShift, float russianroulettePDF, float misWeight, float lightPdf, int lightType, inout PathReservoir pathReservoir, bool forceAdd = false)`
    * `void markEscapeVertexAsRcVertex(RestirPathTracerParams params, uint pathLength, inout PathReservoir pathReservoir, HitInfo hit, bool isDelta, bool isTransmission, bool isSpecularBounce, float lightPdf, uint lightType, float3 rcVertexIrradiance, float3 rcVertexWi, float prevScatterPdf, float geometryFactor)`

### `PathReservoir.slang`

Only in ReSTIR PT

* `struct ReSTIRPathFlags`
  * Member variables
    * `int flags`
  * Member functions
    * `void insertIsDeltaEvent(bool isDeltaEvent, bool beforeRcVertex)`
    * `void insertIsTransmissionEvent(bool isTransmissionEvent, bool beforeRcVertex)`
    * `void insertIsSpecularBounce(bool isSpecularBounce, bool beforeRcVertex)`
    * `void transferDeltaInformation(ReSTIRPathFlags srcPathFlags)`
    * `void transferTransmissionInformation(ReSTIRPathFlags srcPathFlags)`
    * `void transferSpecularBounceInformation(ReSTIRPathFlags srcPathFlags)`
    * `bool decodeIsDeltaEvent(bool beforeRcVertex)`
    * `bool decodeIsTransmissionEvent(bool beforeRcVertex)`
    * `bool decodeIsSpecularBounce(bool beforeRcVertex)`
    * `void insertPathLength(int pathLength)`
    * `void insertRcVertexLength(int rcVertexLength)`
    * `int pathLength()`
    * `int rcVertexLength()`
    * `void insertLastVertexNEE(bool isNEE)`
    * `bool lastVertexNEE()`
    * `void insertLightType(uint lightType)`
    * `uint lightType()`
* `struct ReconnectionData`
  * Member variables
    * `HitInfo rcPrevHit`
    * `float3 rcPrevWo`
    * `float3 pathThroughput`
  * Member functions
    * Constructor
    * `void Init()`
* `struct PixelReconnectionData`
  * `ReconnectionData data[RCDATA_PATH_NUM]`
  * `float4 padding[RCDATA_PAD_SIZE]`
* `struct TriMeshHitInfo`
  * Member variables
    * `uint instanceID`
    * `uint primitiveIndex`
    * `float2 barycentrics`
  * Member functions
    * `HitInfo getHitInfo()`
    * `void initFromHitInfo(HitInfo hitInfo)`
* `struct PathReuseMISWeight`
  * `float rcBSDFMISWeight`
  * `float rcNEEMISWeight`
* `struct PathReservoir`
  * Member variables
    * `float M`
    * `float weight`
    * `ReSTIRPathFlags pathFlags`
    * `uint rcRandomSeed`
    * `float3 F = 0.f`
    * `float lightPdf`
    * `float3 cachedJacobian`
    * `uint initRandomSeed`
    * `TriMeshHitInfo rcVertexHit`
    * `float3 rcVertexWi[kRcAttrCount]`
    * `float3 rcVertexIrradiance[kRcAttrCount]`
    * `float rcLightPdf`
      * If Bekaert-style Path Reuse is used
    * `float3 rcVertexBSDFLightSamplingIrradiance`
      * If Bekaert-style Path Reuse is used
  * `Member functions
    * `uint rcLightType()`3

### `PathState.slang`

* enums
  * `PathFlags`
  * `BounceType`
* structs
  * `PackedPathState`
    * Only in ReSTIR PT
  * `PathState`
    * Member variables
      * id
      * flags
      * length
      * rejected hits
      * scene length
      * bound counters
      * scatter ray parameters
        * origin
        * direction
        * PDF
        * normal
        * hit
      * throughput
      * prefix throughput
        * used for computing rcVertexIrradiance[1]
      * rc vertex path tree irradiance
      * accumulated path contribution L
      * direct lighting on delta surfaces
      * russian roulette PDF
      * shared scatter direction
      * previous scttter PDF
      * rc previous vertex hit
      * rc previous vertex outgoing direction
      * hit distance
      * path builder
      * path reservoir
      * enable random replay
      * random replay is NEE
      * random replay is escaped
      * random replay length
      * use hybrid shift
      * is replay for hybrid shift
      * is last vertex classified as rough
    * Member functions
      * Accessors
        * get current throughput
        * record prefix throughput
      * is terminated / active / hit / transmission / specular / delta / specular bounce / volume / inside dielectric volume / light sampled / light sampled upper / light sampled lower / diffuse primary hit / specular primary hit / free path / light samplable
      * terminate
      * set active / hit
      * clear hit
      * clear event flags
      * set transmission / specular / delta / specular bounce / volume / inside dielectric volume / light sampled / diffuse primary hit / specular primary hit / free path
      * has flag
      * get / set / increment bounces
      * get pixel / sample index / length / scatter ray
      * encode
      * decode

### `Falcor/Scene/Shading.slang`

#### `ShadingData prepareShadingData(VertexData v, uint materialID, MaterialData md, MaterialResources mr, float3 viewDir)`

* Call `_prepareShadingData` with default `ImplicitLodTextureSampler`

#### `ShadingData _prepareShadingData<L:ITextureSampler>(VertexData v, uint materialID, MaterialData md, MaterialResources mr, float3 viewDir, L lod, bool useNormalMap)`

1. Load base color and opacity
2. Set:
   1. From vertex data
      1. world-space position
      2. uv
      3. view direction
      4. world-space normal
      5. world-space face normal
   2. is front facing
   3. material ID
   4. From material data
      1. set material type
      2. set active lobes to `LobeType::All`
      3. set double sided according to material data flags
      4. set thin surface according to material data flags
      5. IoR
      6. diffuse / specular transmission
      7. eta
3. Setup tangent space
4. Sample the specular texture
5. Calculate the specular reflectance for dielectrics from the IoR
6. Set based on material type:
   1. diffuse / specular / linear roughness / metallic
7. Sample the emissive texture
8. Apply normal mapping only if we have a valid tangent space
9. Flip the shading normal for back-facing hits on double-sided materials

# Path Tracer

## Signature

* `static const Info kInfo;`
  * Not included in ReSTIR PT
* **`static SharedPtr create(RenderContext* pRenderContext, const Dictionary& dict)`**
* **`virtual Dictionary getScriptingDictionary() override`**
* **`virtual RenderPassReflection reflect(const CompileData& compileData) override`**
* **`virtual void setScene(RenderContext* pRenderContext, const Scene::SharedPtr& pScene) override`**
* **`virtual void execute(RenderContext* pRenderContext, const RenderData& renderData) override`**
* **`virtual void renderUI(Gui::Widgets& widget) override`**
* **`virtual bool onMouseEvent(const MouseEvent& mouseEvent) override`**
* **`virtual bool onKeyEvent(const KeyboardEvent& keyEvent) override`**
* **`static void registerBindings(pybind11::module& m)`**
* **`PathTracer(const Dictionary& dict)`**
* **`void parseDictionary(const Dictionary& dict)`**
* **`void validateOptions()`**
* **`void updatePrograms()`**
* `void setFrameDim(const uint2 frameDim)`
* **`void prepareResources(RenderContext* pRenderContext, const RenderData& renderData)`**
* **`void preparePathTracer(const RenderData& renderData)`**
* **`void resetLighting()`**
* **`void prepareMaterials(RenderContext* pRenderContext)`**
* **`bool prepareLighting(RenderContext* pRenderContext)`**
* ~~`void prepareRTXDI(RenderContext* pRenderContext)`~~
* **`void setNRDData(const ShaderVar& var, const RenderData& renderData) const`**
* *`void setShaderData(const ShaderVar& var, const RenderData& renderData, bool useLightSampling = true) const`*
* **`bool beginFrame(RenderContext* pRenderContext, const RenderData& renderData)`**
* **`void endFrame(RenderContext* pRenderContext, const RenderData& renderData)`**
* *`void generatePaths(RenderContext* pRenderContext, const RenderData& renderData)`*
* *`void tracePass(RenderContext* pRenderContext, const RenderData& renderData, TracePass& tracePass)`*
* `void resolvePass(RenderContext* pRenderContext, const RenderData& renderData);`

### `beginFrame`

1. `setFrameDim`
2. Validate all I/O sizes match the expected size
3. If scene is invalid
   1. Clear output color
   2. Set refresh flag if changes that affect the output have occured
4. Update materials
5. **Update env map / emissive sampler**
6. ~~Prepare RTXDI~~
7. **Update refresh flag**
8. **Check if GBuffer has adjusted shading normals enabled**
9. Check if fixed sample count should be used
10. Check if guide data should be generated
11. **Check if NRD data should be generated**
12. Check if additional NRD data should be generated
13. **Enable pixel stats if rayCount or pathLength outputs are connected**
14. **`mpPixelStats->beginFrame`**
15. **`mpPixelDebug->beginFrame`**
16. **Update the random seed**

### Constructor

1. Check if shader model 6.5 is supported
2. **Check if ray tracing is supported**
3. **`parseDictionary`**
4. **`validateOptions`**
5. **Create sample generator**
6. **Allocate resources that don't change in size**
   1. Create resolve pass
   2. **Pixel stats/debug**

### `endFrame`

1. **End frame for pixel stats / debug**
2. **Copy pixel stats to outputs if available**
3. ~~End frame for RTXDI~~
4. Increment frame count

### `execute`

1. **`beginFrame`**
2. **`updatePrograms`**
3. **`prepareResources`**
4. **`preparePathTracer`**
5. **`generatePaths`**
6. ~~Update `RTXDI`~~
7. **`tracePass`**
8. Launch separate passes to trace delta reflection and transmission paths to generate respective guide buffers
9. `resolvePass`
10. **`endFrame`**

### `generatePaths`

1. **Check shader assumptions**
2. **Additional specialization**
3. **Bind resources**
   * **path generation `setShaderData`**
4. **Set `gScene` for path generation**
5. ~~RTXDI `setShaderData`~~
6. **Launch one thread per pixel of path generation**

### `parseDictionary`

* Parse:
  * Rendering parameters
    * **samples per pixel**
    * **max surface/diffuse/specular/transmission bounces**
  * Sampling parameters
    * **sample generator**
    * **fixed seed**
    * **use BSDF sampling**
    * **use russian roulette**
    * **use NEE**
    * **use MIS**
    * **MIS heuristic**
    * **MIS power exponent**
    * **emissive sampler**
    * **light BVH options**
    * use RTXDI
    * RTXDI options
  * Material parameters
    * **use alpha test**
    * **adjust shading normals**
    * **max nested materials**
    * **use lights in dielectric volumes**
    * **disable caustics**
    * **specular roughness threshold**
    * **primary LOD mode**
    * **LOD bias**
  * Denoising parameters:
    * **use NRD demodulation**
  * Output parameters:
    * output size
    * fixed output size
    * **color format**

### `prepareLighting`

1. **Check render settings changes**
2. Check SDF grid config changes
3. **Check env map changes**
4. **Create env map sampler if env light is used**
5. **Request the light collection if emissive lights are enabled**
6. **Create emissive sampler if emissive lights are used**
7. **If emissive sampler is created, then:**
   1. **Update the emissive sampler**
   2. **Add defines to programs:**
      1. **trace pass**

### `prepareMaterials`

* **Checks for material changes and performs any necessary updates**

### `preparePathTracer`

1. **Create path tracer parameter block if needed**
2. **Bind resources**
   * **`setShaderData`**

### `prepareResources`

1. **Compute allocation requirements for paths and output samples**
   * spp
   * **tile count**
   * **screen pixel count**
   * **sample count**
   * path count
2. Allocate output sample offset buffer if needed
3. Allocate per-sample buffers
   * sample color
   * sample guide data 
   * sample nrd radiance
   * sample nrd hit distance
   * sample nrd emission
   * sample nrd reflectance

### `static void registerBindings(pybind11::module& m)`

* **Register:**
  * **Enums:**
    * color format
    * MIS heuristic
  * **Class:**
    * Path Tracer
  * **Property**
    * **use fixed seed**
    * **fixed seed**

### `renderUI`

1. **`renderRenderingUI`**
2. **`renderStatsUI`**
3. **`renderDebugUI`**
4. **If dirty,**
   1. **`validateOptions`**

### `resetLighting`

* **Retain the options for the emissive sampler**

### `resolvePass`

This pass is executed when multiple samples per pixel are used

1. Additional specialization
2. Bind resources
3. Launch one thread per pixel

### `setFrameDim`

* Set frame dimesion and screen tiles

### `setNRDData`

* Set:
  * sample radiance
  * sample hit dist
  * sample emission
  * sample reflectance
  * **primary hit emission**
  * **primary hit diffuse reflectance**
  * **primary hit specular reflectance**
  * delta reflection reflectance / emission / norm w rough material ID / path length / hit dist
  * delta transmission reflectance / emission / norm w rough material ID / path length / pos w

### `setScene`

1. **Initialize variables**
   * **scene**
   * **frame count**
   * frame dimension
     * ReSTIR PT initializes frame dimension in `compile` method
     * Path Tracer assignes frame dimension in `setFrameDim` method
   * screen tiles
     * ReSTIR PT initializes screen tiles in `compile` method
     * Path Tracer assignes screen dimension in `setFrameDim` method
   * direct illumination (RTXDI)
     * Not included in ReSTIR PT
   * trace pass to nullptr
     * Not included in ReSTIR PT
   * trace delta reflection/transmission pass to nullptr
     * Not included in ReSTIR PT
   * generate paths to nullptr
     * Not included in ReSTIR PT
   * reflect types to nullptr
     * Not included in ReSTIR PT
2. **`resetLighting`**
3. **`validateOptions`**

### `setShaderData`

1. **Bind static resources that don't change per frame**
   *  **if path tracer, set shader data for env map sampler**
   *  Set variables:
      *  sample offset
      *  sample color
      *  sample guide data
2. **Bind runtime data**
   * `setNRDData`
   * view direction
   * sample count
   * **parameters**
   * **v buffer**
   * **output color**
3. **Set shader data for emissive sampler if path tracer**

### `tracePass`

1. **Additional specialization**
2. **Bind global resources**
3. **Set shader data of sample generator**
4. ~~Set shader data of RTXDI~~
5. **Prepare pixel stats / debug program**
6. **Bind the path tracer**
   * **path tracer**
7. Full screen dispatch

### `updatePrograms`

1. Create trace passes lazily
2. Create program vars for trace programs
3. Create compute passes
4. **Perform program specialization**
5. Re**create program vars**

### `validateOptions`

1. **Validate:**
   * **specular roughness threshold**
   * **samples per pixel**
2. **Range validation**:
   * **Clamp**:
      * **max surface/diffuse/specular/transmission bounces**
   * **min/max surface bounces**
3. **Validate**:
   * **primary lod mode**

## Shaders

### `GeneratePaths.cs.slang`

#### `PathGenerator::execute(const uint2 tileID, const uint threadIdx)`

1. **Map thread to pixel based on Morton order within tile**
2. Process each pixel
3. Determine number of samples at the current pixel
4. **Compute the primary ray**
5. **Load the primary hit from the V-buffer**
6. ~~Prepare per-pixel surface data for RTXDI~~
7. ~~Perform a reduction over the tile to determine the number of samples required~~
8. ~~Calculate the sample counts over the warp~~
9. ~~Compute the prefix sum over the warp totals in shared memory~~
10. Compute the output sample index
11. If not hit, write background pixels `writeBackground`

#### `writeBackground(const uint2 pixel, const float3 dir)`

1. **Evaluate background color for the current pixel**
2. **Write color** and denoising guide **for all samples in pixel**

### `LoadShadingData.slang`

Only the functions that clashes with ReSTIR PT are checked here

#### `VertexData loadVertexData(const HitInfo hit, const float3 rayOrigin, const float3 rayDir, out uint materialID, out bool modifyNormals)`

1. **Get hit data according to the primitive type**
2. **Get vertex data according to the primitive type**
3. **Get material ID from hit info**
4. **Return the vertex data and material id**

### `Params.slang`

* enums
  * **Color format**
  * **MIS Heuristic**
* Static constant variables
  * **Screen tile dimension**
  * **Screen tile bits**
  * **Max samples per pixel**
  * **Max frame dimension**
  * **Max bounces**
  * **Max light samples per vertex**
* structs
  * Path tracer params
    * **use fixed seed**
    * **fixed seed**
    * **LoD bias**
    * **specular roughness threshold**
    * **Runtime values**
      * **frame dimension**
      * **screen tiles**
    * **frame count**
    * **seed**

### `Falcor/Scene/Material/MaterialFactory.slang`

#### `ShadingData prepareShadingData<L:ITextureSampler>(const VertexData v, const uint materialID, const float3 viewDir, L lod, const bool modifyNormal = true)`

Compared with `_prepareShadingData` in `Falcor/Scene/Shading.slang` of ReSTIR PT

1. **Set**:
   1. **From vertex data**
      1. **world-space position**
      2. **uv**
      3. **view direction**
      4. **world-space normal**
      5. Primitive data
         1. **world-space face normal**
         2. **is front facing**
         3. curve radius
   2. Get material data blob from `materialData` according to the material ID
   3. **From material data**
      1. Material header `mtl`
      2. **material ID**
      3. **IoR**
      4. Create IMaterial instance
      5. Query material to evaluate **opacity**
      6. **Apply normal mapping only if we have a valid tangent space**
      7. Finalize the normal
      8. **Flip the shading normal for back-facing hits on double-sided materials**

# New ReSTIR PT

## Signature

* `static const Info kInfo;`
* `static SharedPtr create(RenderContext* pRenderContext, const Dictionary& dict)`
* `virtual Dictionary getScriptingDictionary() override`
* `Dictionary getSpecializedScriptingDictionary()`
* `virtual RenderPassReflection reflect(const CompileData& compileData) override`
* `virtual void setScene(RenderContext* pRenderContext, const Scene::SharedPtr& pScene) override`
* `virtual void execute(RenderContext* pRenderContext, const RenderData& renderData) override`
* `virtual void renderUI(Gui::Widgets& widget) override`
* `virtual bool onMouseEvent(const MouseEvent& mouseEvent) override`
* `virtual bool onKeyEvent(const KeyboardEvent& keyEvent) override`
* `static void registerBindings(pybind11::module& m)`
* `ReSTIRPTPass(const Dictionary& dict)`
* `bool beginFrame(RenderContext* pRenderContext, const RenderData& renderData)`
* `void updatePrograms()`
* `void setFrameDim(const uint2 frameDim)`
* `void prepareResources(RenderContext* pRenderContext, const RenderData& renderData)`**
* `void preparePathTracer(const RenderData& renderData)`
* `void resetLighting()`
* `void prepareMaterials(RenderContext* pRenderContext)`
* `bool prepareLighting(RenderContext* pRenderContext)`
* `void setShaderData(const ShaderVar& var, const RenderData& renderData, bool useLightSampling = true) const`
* `void generatePaths(RenderContext* pRenderContext, const RenderData& renderData, int sampleId = 0)`
* `void PathReusePass(RenderContext* pRenderContext, uint32_t restir_i, const RenderData& renderData, bool temporalReuse = false, int spatialRoundId = 0, bool isLastRound = false)`
* `void PathRetracePass(RenderContext* pRenderContext, uint32_t restir_i, const RenderData& renderData, bool temporalReuse = false, int spatialRoundId = 0)`
* `Texture::SharedPtr createNeighborOffsetTexture(uint32_t sampleCount)`

### `beginFrame`

1. `setFrameDim`
2. Validate all I/O sizes match the expected size
3. If scene is invalid
   1. Clear output color
   2. Set refresh flag if changes that affect the output have occured
4. Update materials
5. Update env map / emissive sampler
6. Update refresh flag
7. Check if GBuffer has adjusted shading normals enabled
8.  Check if time data should be generated
9.  Enable pixel stats if rayCount or pathLength outputs are connected
10. `mpPixelStats->beginFrame`
11. `mpPixelDebug->beginFrame`
12. Update the random seed

### Constructor

1. Check if shader model 6.5 is supported
2. Check if ray tracing is supported
3. `Init` dictionaries and variables
4. `parseDictionary`
5. `validateOptions`
6. Create sample generator
7. Create neighbor offset texture
8. Allocate resources that don't change in size
   1. Counters          <!-- TODO: do we need readback data?  -->
   2. Counters readback <!-- TODO: do we need readback data?  -->
   3. Pixel stats/debug
   4. Readback fence    <!-- TODO: do we need readback data?  -->

### `createNeighborOffsetTexture`

* Create texture

### `endFrame`

1. End frame for pixel stats / debug
2. Get pixel stats
3. Copy pixel stats to outputs if available
4. Increment frame count

### `execute`

1. `beginFrame`
2. Initialize parameters
   * temporal reuse
   * number of candidate samples
   * shift strategy
   * MIS kind
3. Main loop
   1. `updatePrograms`
   2. `prepareResources`
   3. `preparePathTracer`
   4. Clear output time UAV texture
   5. Clear counter UAV texture
   6. spp = number of ReSTIR reservoir textures
   7. `generatePaths`
   8. `tracePass`
   9. ReSTIR Merge Pass
      1.  `PathRetracePass` for hybrid shift mappings
      2.  `PathRetracePass` for hybrid shift/random number replay
   10. For number of spatial reuse rounds
      1.  `PathRetracePass` for hybrid shift mappings
      2.  `PathRetracePass` for hybrid shift/random number replay
   11. Mark as at least one temporally reused frame
   12. Copy temporal v buffer to input v buffer for temporal reuse
   13. Increment seed
4.  `endFrame`

### `generatePaths`

1. Check shader assumptions
2. Additional specialization
3. Bind resources**
   * path generation `setShaderData`
4. Set `gScene` for path generation
5. Set `gSampleId`
6. Launch one thread per pixel of path generation

### `parseDictionary`

* Parse:
  * Rendering parameters
    * samples per pixel
    * max surface/diffuse/specular/transmission bounces
  * Sampling parameters
    * sample generator
    * fixed seed
    * use BSDF sampling
    * use russian roulette
    * use NEE
    * use MIS
    * MIS heuristic
    * MIS power exponent
    * emissive sampler
    * light BVH options
  * Material parameters
    * use alpha test
    * adjust shading normals
    * max nested materials
    * use lights in dielectric volumes
    * disable caustics
    * specular roughness threshold
    * primary LOD mode
    * LOD bias
  * Denoising parameters:
    * use NRD demodulation
  * Output parameters:
    * output size
    * fixed output size
    * color format
  * ReSTIR paramters:
    * limit transimission
    * max transmission reflection/refraction depth
    * disable DI
    * spatial MIS kind
    * temporal MIS kind
    * shift strategy
    * reject shift based on jacobian
    * jacobian rejection threshold
    * near field distance
    * temporal history length
    * use max history
    * seed offset
    * enable temporal reuse
    * enable spatial reuse
    * num spatial rounds
    * path sampling mode
    * local strategy type
    * enable temporal reprojection
    * no resampling for temporal reuse
    * spatial neighbor count
    * feature based rejection
    * spatial reuse pattern
    * small window ReSTIR window radius
    * spatial reuse radius
    * use DI
    * separate path BSDF
    * candidate samples
    * temporal update for dynamic scene
    * enable ray stats

### `PathRetracePass`

1. Check shader assumptions
2. Additional specialization
3. Bind resources
   1. `setShaderData`
4. `prepareProgram` for pixel stats / debug
5. Launch one thread per pixel

### `PathReusePass`

1. Check shader assumptions
2. Additional specialization
3. Bind resources
4. `setShaderData`
5. `prepareProgram` for pixel stats/debug
6. Execute pass

### `prepareLighting`

1. Check render settings changes
2. Check SDF grid config changes
3. Check env map changes
4. Create env map sampler if env light is used
5. Request the light collection if emissive lights are enabled
6. Create emissive sampler if emissive lights are used
7. If emissive sampler is created, then:
   1. Update the emissive sampler
   2. Add defines to programs: 
      1. trace pass
      2. spatial path retrace pass
      3. temporal path retrace pass
      4. spatial reuse pass
      5. temporal reuse pass

### `prepareMaterials`

* Checks for material changes and performs any necessary updates

### `preparePathTracer`

1. Create path tracer parameter block if needed
2. Bind resources
   * `setShaderData`
   * output reservoirs
   * direct lighting 

### `prepareResources`

1. Compute allocation requirements for paths and output samples
   * tile count
   * screen pixel count
   * sample count
2. Create reconnection data buffer if hybrid shift map is used
3. Create/resize output reservoirs
4. Allocate path buffers
   1. Create output reservoirs
   2. Create temporal reservoirs
5. Create temporal v buffer

### `static void registerBindings(pybind11::module& m)`

* Register:
  * Enums:
    * shift mapping
    * ReSTIR MIS kind
    * path sampling mode
    * spatial reuse pattern
  * Class:
    * ReSTIR PT pass
  * Property
    * use fixed seed
    * fixed seed

### `renderUI`

1. `renderRenderingUI`
2. `renderStatsUI`
3. `renderDebugUI`
4. If dirty,
   1. `validateOptions`

### `resetLighting`

* Retain the options for the emissive sampler

### `setFrameDim`

* Set frame dimesion and screen tiles

### `setNRDData`

* Set:
  * primary hit emission
  * primary hit diffuse reflectance
  * primary hit specular reflectance

### `setScene`

1. Initialize variables
   * scene
   * frame count to 0
   * frame dimension to `{}`
   * screen tiles to `{}`
   * trace pass to nullptr
   * generate paths to nullptr
   * reflect types to nullptr
2. `resetLighting`
3. Check if the scene is dynamic
   * checked for temporal reuse 
4. `validateOptions`

### `setShaderData`

1. Bind static resources that don't change per frame
   *  if path tracer, set shader data for env map sampler
2. Bind runtime data
   * `setNRDData`
   * parameters
   * v buffer
   * output color
3. If path tracer,
   * Set variables:
     * isLastRound
     * useDirectLighting
     * kUseEnvLight
     * kUseEmissiveLights
     * kUseAnalyticLights 
4. If path generator,
   * kUseEnvBackground 
5. Set output debug and time
6. Set shader data for emissive sampler if path tracer

### `tracePass`

1. **Additional specialization**
2. **Bind global resources**
3. **Set shader data of sample generator**
4. ~~Set shader data of RTXDI~~
5. **Prepare pixel stats / debug program**
6. **Bind the path tracer**
   * **path tracer**
   * sample ID
7. Full screen dispatch vs Launch the threads for the trace pass<!-- TODO -->

### `updatePrograms`

1. Create trace passes lazily
2. Create program vars for trace programs
3. Create compute passes
4. Perform program specialization
5. Create program vars

### `validateOptions`

1. Validate:
   * specular roughness threshold
   * samples per pixel
2. Range validation:
   * Clamp:
      * max surface/diffuse/specular/transmission bounces
   * min/max surface bounces
   * max transmission reflection/refraction depth
3. Validate:
   * primary lod mode

## Shaders

### `GeneratePaths.cs.slang`

#### `PathGenerator::execute(const uint2 tileID, const uint threadIdx)`

1. Map thread to pixel based on Morton order within tile
2. Process each pixel
3. Compute the primary ray
4. Load the primary hit from the V-buffer
5. If not hit, write background pixels `writeBackground`

#### `writeBackground(const uint2 pixel, const float3 dir)`

1. Evaluate background color for the current pixel
2. Write color for all samples in pixel

### `LoadShadingData.slang`

#### `VertexData loadVertexData(const HitInfo hit, const float3 rayOrigin, const float3 rayDir, out uint materialID, out bool modifyNormals)`

1. Get hit data according to the primitive type
2. Get vertex data according to the primitive type
3. Get material ID from hit info
4. Return the vertex data and material id

#### `ShadingData loadShadingDataWithPrevVertexPosition(const HitInfo hit, const float3 prevVertexPosition, const bool isPrimary, const float lod = 0.f)`

<!-- TODO: Check if used -->

1. load vertex data `loadVertexData`
2. get view direction from world-space position to prev vertex position
3. prepare shading data `prepareShadingData`
4. adjust shading data `adjustShadingData`

### `Params.slang`

* enums
  * Counters
  * Color format
  * MIS heuristic
  * Shift mapping
  * Local strategy
  * ReSTIR MIS kind
  * Spatial reuse pattern
  * Path reuse pattern  <!-- TODO: do we need this? -->
* Static constant variables
  * Screen tile dimension
  * Screen tile bits
  * Max samples per pixel
  * Max frame dimension
  * Max bounces
  * Max light samples per vertex
* structs
  * ReSTIR path tracer params
    * use fixed seed
    * fixed seed
    * LoD bias
    * specular roughness threshold
    * Runtime values
      * frame dimension
      * screen tiles
    * frame count
    * seed
    * local strategy type
    * reject shift based on jacobian
    * jacobian rejection threshold
    * near field distance

### `PathBuilder.slang`

* `struct PathBuilder`
  * Member variables:
    * `TriMeshHitInfo rcVertexHit`
    * `float3 rcVertexWi[kRcWiCount]`
    * `uint cachedRandomSeed`
    * `TinyUniformSampleGenerator sg`
    * `int rcVertexLength`
    * `ReSTIRPathFlags pathFlags`
    * `float3 cachedJacobian`
  * Member functions:
    * `void init<S : ISampleGenerator>(inout S sg)` 
    * `void finalize(inout PathReservoir pathReservoir)`
    * `bool addEscapeVertex(RestirPathTracerParams params, uint pathLength, float3 wi, float3 pathWeight, float3 postfixWeight, bool useHybridShift, float russianroulettePDF, float misWeight, float lightPdf, int lightType, inout PathReservoir pathReservoir, bool forceAdd = false)`
    * `bool addNeeVertex(RestirPathTracerParams params, uint pathLength, float3 wi, float3 pathWeight, float3 postfixWeight, bool useHybridShift, float russianroulettePDF, float misWeight, float lightPdf, int lightType, inout PathReservoir pathReservoir, bool forceAdd = false)`
    * `void markEscapeVertexAsRcVertex(RestirPathTracerParams params, uint pathLength, inout PathReservoir pathReservoir, HitInfo hit, bool isDelta, bool isTransmission, bool isSpecularBounce, float lightPdf, uint lightType, float3 rcVertexIrradiance, float3 rcVertexWi, float prevScatterPdf, float geometryFactor)`

### `PathState.slang`

* enums
  * `PathFlags`
  * `BounceType`
* structs
  * `PackedPathState`
    * Only in ReSTIR PT
  * `PathState`
    * Member variables
      * id
      * flags and vertex index
      * rejected hits
      * scene length
      * bound counters
      * scatter ray parameters
        * origin
        * direction
        * PDF
        * normal
        * hit
      * throughput
      * prefix throughput
        * used for computing rcVertexIrradiance[1]
      * rc vertex path tree irradiance
      * accumulated path contribution L
      * direct lighting on delta surfaces
      * russian roulette PDF
      * shared scatter direction
      * previous scttter PDF
      * rc previous vertex hit
      * rc previous vertex outgoing direction
      * path builder
      * path reservoir
      * enable random replay
      * random replay is NEE
      * random replay is escaped
      * random replay length
      * use hybrid shift
      * is replay for hybrid shift
      * is last vertex classified as rough
    * Member functions
      * Accessors
        * get current throughput
        * record prefix throughput
      * is terminated / active / hit / transmission / specular / delta / specular bounce / inside dielectric volume / light sampled / light sampled upper / light sampled lower / diffuse primary hit / specular primary hit / light samplable
      * terminate
      * set active / hit
      * clear hit
      * clear event flags
      * set transmission / specular / delta / specular bounce / volume / inside dielectric volume / light sampled / diffuse primary hit / specular primary hit / free path
      * has flag
      * get / set / increment bounces
      * get pixel / sample index / length / scatter ray
      * encode
      * decode

# Falcor

## `gScene`

* `materials`
  * indexed by material ID
* `materialResources`
  * indexed by material ID

# 4.4 to 5.2

## ShadingData

* `sd.linearRoughness` -> `bsdfProperties.roughness`
* `path.length`  -> `path.getVertexIndex()`
  * length == 0 (origin) -> `path.getVertexIndex() == 1`
  * length == 1 (first secondary hit) -> `path.getVertexIndex() == 2`
  * `path.length > 0` -> `path.getVertexIndex() > 1`
  * `path.length--` -> `path.decrementVertexIndex()`

```bool hasRoughComponent(const ShadingData sd, float roughnessThreshold)
{
    return pDiffuseReflection > 0 || sd.linearRoughness > roughnessThreshold;
}
```

```
let lod = ExplicitLodTextureSampler(0.f);
let bsdf = gScene.materials.getBSDF(sd, lod);
let bsdfProperties = bsdf.getProperties(sd);
```