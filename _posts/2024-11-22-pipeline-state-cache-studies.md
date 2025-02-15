---
layout: post
title:  Pipeline State Cache Studies
date:   2024-11-22 00:00:00 +0000
categories: graphics
lang: "en"
---

# Introduction

The most efficient way to render using modern GPU is to utilize it's hardware's architecture. Modern GPUs uses the concept of pipelines to maximize performance. A pipeline consists of various information GPU requires to render, which includes shader cache blobs, root signatures/layouts, and additional data per stages in the pipeline. An object actually contains these info is called PSO(Pipeline State Object) in DirectX's jargon. In order to create this object, one has to ask the graphics API to create one. The API then goes to the graphics driver to request compilation of the given shader cache blob. I know that that sounds rather strange. Shader cache blobs are supposted be **compiled** data, no? Well if we are talking about general purpose hosts such as PC or Android which has no idea what GPU the system uses, how can the compiler know to which instruction set it should compile? Due to this, most shaders are compiled into intermediate languages(IL) such as DXIL(DirectX IL) or SPIR-V(The Standard IR for Parallel Compute and Graphics V(roman numeral for five)). The moment these intermediate languages compiled into actual executable instruction sets are when PSOs are created.

As everyone knows, compilation can take a chunk of runtime budget. Modern AAA games uses hundreds of shaders which are combined into tens of thousands of PSOs. Due to the rich environment these games have, the PSOs should be loaded on runtime, and the compilation becomes the major hotspot. Deploying the application with IL shader caches might make sense, but making the users keep the IL shader caches which are to be compiled into the actual instruction sets is a inefficient process. Caching the compiled PSOs into the secondary memory to be used later would definitely help improving overall performance. Users rarely alter their environment, and even if they do so, the application only has to update the first time of its launching.

Now I will give my studies on how to implement this system based on the Microsoft's sample and other game engines such as Unreal.

# Previous Works

## DirectX

### Microsoft Sample

There are two methods to implement pipeline caching. You can either cache the pipelines into a single pipeline library, or cache them per pipeline. The former requires you to initialize a pipeline library instance, and the latter requires you to call `ID3D12PipelineState::GetCachedBlob(ID3DBlob**)`.

![MicrosoftDirectX12Sample](/Images/PipelineStateCache/MicrosoftDirectX12Sample.png)

#### Pipeline Library Method

1. `MemoryMappedPipelineLibrary::Init(ID3D12Device*, std::wstring)`
   1. `MemoryMappedFile::Init(wstring, UINT)`
      1. Creates an empty `pipelineLibrary.cache` file
      2. Create a file mapping to `pipelineLibrary.cache`
   2. Create a pipeline library based on its contents  (`ID3D12Device1::CreatePipelineLibrary(const void*, SIZE_T, REFIID, void**)`)
2. For each pipelines,
   1. `CompilePSO(CompilePSOThreadData*)`
      1. Try to load the pipeline cache from pipeline library (should fail on initial launch) (`ID3D12PipelineLibrary::LoadGraphicsPipeline(LPCWSTR, const D3D12_GRAPHICS_PIPELINE_STATE_DESC*, REFIID, void**`)
      2. If pipeline cache does not exist,
         1. Create the PSO
         2. Store the PSO (`ID3D12PipelineLibrary::StorePipeline(LPCWSTR, ID3D12PipelineState*`)
3. On application termination
   1. Write pipeline cache to file `MemoryMappedPipelineLibrary::Destroy(bool)`

#### Cached Blob Method

1. For each pipelines,
   1. `MemoryMappedFile::Init(wstring, UINT)`
   2. `CompilePSO(CompilePSOThreadData*)`
      1. Try to get the cached blobs from the disk memory (should fail on initial launch) (`D3D12_CACHED_PIPELINE_STATE`)
      2. If pipeline's cache blob does not exist,
         1. Create the PSO
         2. Get the cached blob (`ID3D12PipelineState::GetCachedBlob(ID3DBlob**)`)
         3. Write the cached blob into the memory
2. On application termination
   1. Unmap the views to the cached blobs (`UnmapViewOfFile(LPCVOID)`)

### BGFX

BGFX only uses the cached blob method.

![Bgfx](/Images/PipelineStateCache/Bgfx.png)

1. `RendererContextD3D12::getPipelineState(ProgramHandle): ID3D12PipelineState*`
   1. Try to get the PSO from main memory (`RendererContextD3D12::m_pipelineStateCache: StateCacheT<ID3D12PipelineState>`)
   2. Fallback to disk memory for cached blobs if failed (`CallbackC99::cacheRead(uint64_t, void*, uint32_t): bool`)
      1. Create PSO based on the retrieved cached blob
   3. If either memory has no cached blob, create PSO manually
   4. If PSO has been created, write it back to disk memory and main memory (`ID3D12PipelineState::GetCachedBlob(ID3DBlob**)`)

### LLGL

BGFX only uses the cached blob method.

![Llgl](/Images/PipelineStateCache/Llgl.png)

1. `D3D12GraphicsPSO::CreateNativePSO(D3D12Device&, const D3D12PipelineLayout&, const D3D12RenderPass*, const GraphicsPipelineDescriptor&, D3D12PipelineCache*)` / `D3D12ComputePSO::CreateNativePSO(D3D12Device&, const D3D12_SHADER_BYTECODE&, D3D12PipelineCache*)`
   1. Create PSO (use cached blob if given `D3D12PipelineCache*` is not null)
   2. `D3D12PipelineState::SetNativeAndUpdateCache(ComPtr<ID3D12PipelineState>&&, D3D12PipelineCache*)`
      1. If the given `D3D12PipelineCache*` is not null but an empty one, set its blob as the cached blob (`ID3D12PipelineState::GetCachedBlob(ID3DBlob**)`)

Loading of pre-cached pipeline and saving current pipeline cache is not managed by the system. If pre-cached pipeline cache exists, then the user has to load the data and call `RenderSystem::CreatePipelineCache`. Using the created `PipelineCache` instance, user can create a pipeline with the call `RenderSystem::CreatePipelineState`. Calling `PipelineCache::GetBlob` returns the cached blob which the user can save.

### O3DE

O3DE only uses the pipeline library method. According to O3DE, if RenderDoc or PIX is enabled, CreatePipelineLibrary API does not function properly.

![O3de](/Images/PipelineStateCache/O3de.png)

When a render pass / dispatch item etc. needs a PSO, it will acquire it from the `Shader` that uses it. In O3DE, shaders don't refer to specific shaders like VS, PS. A shader has some shader variants that contains "shader stage functions" which corresponds to VS, PS, and etc. Shaders are more like a complete set of shaders that consists a pipeline. This is the reason O3DE retrieves pipeline state from `Shader::AcquirePipelineState`. This means that each Shader "family" has a `ID3D12PipelineLibrary` object. A `Shader` object has a `m_pipelineLibraryPath` member variable that stores the pipeline library. When a `Shader` object is destroyed by the `Shader::Shutdown` call, the shader saves its pipeline library.

`Shader` caches PSOs into a global libraries and thread libraries. Both libraries manage PSOs with the class `PipelineStateSet`. Global library has two sets with the first one being the read-only cache `m_readOnlyCache: PipelineStateSet` and a locked cache `m_pendingCache: PipelineStateSet`. `PipelineStateCache::Compact` method merges the in-coming pending caches into the read-only cache.

Every `Shader` objects shares the same `m_pipelineStateCache: PipelineStateCache` from the `RHISystem`'s `m_pipelineStateCache: PipelineStateCache`. When an application requests the PSO from the `Shader`, it actually redirects the request to `m_pipelineStateCache`. `m_pipelineStateCache` first checks if the PSO is already cached in the global library's read-only cache `m_readOnlyCache`. If the PSO is not cached, then it next checks if the thread-local thread library has the PSO cached in `m_threadLocalCache: PipelineStateSet`. Of course if one is requesting the PSO for the first time, either caches would not return any valid PSO. In this case, the thread-local library creates a `PipelineLibrary` object that creates the `ID3D12PipelineLibrary` object for the `Shader`(Which means that there are maximum (Number of Threads &times; Number of `Shader`s) amount of `ID3D12PipelineLibrary`s). Afterwards we have to actually create the PSO by the `PipelineStateCache::CompilePipelineState` call.

When compiling a PSO, we must first check if the PSO has already been compiled, but is yet to be merged with the global library's read-only cache. If not, then we finally allocate a `PipelineState` object(which is basically a wrapper for the PSO) and add it to the pending cache of the global library. When creating the PSO, `PipelineState` loades the pipeline from the library(`LoadGraphicsPipeline`/`LoadComputePipeline`). If loading fails for whatever reason, we store the created PSO into the pipeline library(`StorePipeline`).

### The Forge

The Forge uses the pipeline library method.

![TheForge](/Images/PipelineStateCache/TheForge.png)

The Forge creates pipeline library for every pipeline caches. It seems like The Forge doesn't really use it.

### Wicked Engine

Wicked Engine uses the pipeline library method. Just like the sample, Wicked Engine uses one pipeline library cache.

![WickedEngine](/Images/PipelineStateCache/WickedEngine.png)

According to Turánszki János, the main contributer, pipeline library method is slower than driver-side caching which is why he disabled it.

# PUML

```puml
@startuml Microsoft DirectX 12 Sample
class MemoryMappedFile {
    -m_mapFile: HANDLE
    -m_file: HANDLE
    -m_mapAddress: LPVOID
    -m_filename: std::wstring
    -m_currentFileSize: UINT
    +Init(std::wstring, UINT)
    +Destroy(bool)
    +GrowMapping(UINT)
}

class MemoryMappedPipelineLibrary {
    -m_pipelineLibrary: Microsoft::WRL::ComPtr<ID3D12PipelineLibrary>
    +Init(ID3D12Device*, std::wstring): bool
    +Destroy(bool)
}

MemoryMappedFile <|-- MemoryMappedPipelineLibrary

class MemoryMappedPSOCache {
    +Init(std::wstring): bool
    +Destroy(bool)
}

MemoryMappedFile <|-- MemoryMappedPSOCache

struct CompilePSOThreadData {
    +pLibrary: PSOLibrary*
    +pDevice: ID3D12Device*
    +pRootSignature: ID3D12RootSignature*
    +type: EffectPipelineType
    +threadHandle: HANDLE
}

class PSOLibrary {
    +{static} CompilePSO(CompilePSOThreadData*)
    -m_pipelineStates: ComPtr<ID3D12PipelineState>[EffectPipelineTypeCount]
    -m_diskCaches: MemoryMappedPSOCache[EffectPipelineTypeCount]
    -m_pipelineLibrary: MemoryMappedPipelineLibrary
    -m_workerThreads: CompilePSOThreadData[EffectPipelineTypeCount]
}

PSOLibrary "1" *-- "n" MemoryMappedPSOCache
PSOLibrary "1" *-- "1" MemoryMappedPipelineLibrary
PSOLibrary "1" *-- "n" CompilePSOThreadData
@enduml
```
```puml
@startuml BGFX Pipeline Cache Blob
struct RendererContextI
struct RendererContextD3D12 {
    +m_device: ID3D12Device*
    +m_pipelineStateCache: StateCacheT<ID3D12PipelineState>
    +getPipelineState(ProgramHandle): ID3D12PipelineState*
    +getPipelineState(uint64_t, uint64_t, uint8_t, const VertexLayout**, ProgramHandle, uint8_t): ID3D12PipelineState*
}

RendererContextI <|-- RendererContextD3D12

struct CallbackI {
    +{abstract}cacheReadSize(uint64_t): uint32_t
    +{abstract}cacheRead(uint64_t, void*, uint32_t): bool
    +{abstract}cacheWrite(uint64_t, const void*, uint32_t)
}

struct CallbackC99 {
    +cacheReadSize(uint64_t): uint32_t
    +cacheRead(uint64_t, void*, uint32_t): bool
    +cacheWrite(uint64_t, const void*, uint32_t)
    +m_interface: bgfx_callback_interface_t*
}

CallbackI <|-- CallbackC99

struct bgfx_callback_interface_t {
    +vtbl: bgfx_callback_vtbl_s*
}

CallbackC99 o-- bgfx_callback_interface_t

struct bgfx_callback_vtbl_t {
    +cache_read_size: uint32_t (*)(bgfx_callback_interface_t*, uint64_t)
    +cache_read: bool (*)(bgfx_callback_interface_t*, uint64_t, void*, uint32_t);
    +cache_write: void (*)(bgfx_callback_interface_t*, uint64_t, const void*, uint32_t);
}
bgfx_callback_interface_t o-- bgfx_callback_vtbl_t
@enduml
```
```puml
@startuml LLGL Pipeline Cache Blob
class NonCopyable
class Interface
NonCopyable <|-- Interface
class RenderSystemChild
Interface <|-- RenderSystemChild
class PipelineCache {
    +{abstract}GetBlob(): Blob
}
RenderSystemChild <|-- PipelineCache
class D3D12PipelineCache {
    +GetBlob(): Blob
    -initialBlob_: Blob
    -nativeBlob_: ComPtr<ID3DBlob>
}
PipelineCache <|-- D3D12PipelineCache

class PipelineState
RenderSystemChild <|-- PipelineState
class D3D12PipelineState {
    #SetNativeAndUpdateCache(ComPtr<ID3D12PipelineState>&&, D3D12PipelineCache*);
}
PipelineState <|-- D3D12PipelineState
class D3D12ComputePSO {
    +D3D12ComputePSO(D3D12Device&, D3D12PipelineLayout&, const ComputePipelineDescriptor&, PipelineCache*)
    -CreateNativePSO(D3D12Device&, const D3D12_SHADER_BYTECODE&, D3D12PipelineCache*)
}
D3D12PipelineState <|-- D3D12ComputePSO
class D3D12GraphicsPSO {
    +D3D12GraphicsPSO(D3D12Device&, D3D12PipelineLayout&, const GraphicsPipelineDescriptor&, const D3D12RenderPass*, PipelineCache*)
    -CreateNativePSO(D3D12Device&, const D3D12PipelineLayout&, const D3D12RenderPass*, const GraphicsPipelineDescriptor&, D3D12PipelineCache*)
}
D3D12PipelineState <|-- D3D12GraphicsPSO
class RenderSystem {
    +{static}Load(const RenderSystemDescriptor&, Report*): RenderSystemPtr
    +{abstract}CreatePipelineCache(const Blob& initialBlob): PipelineCache*
    +{abstract}CreatePipelineState(const GraphicsPipelineDescriptor&, PipelineCache*): PipelineState*
    +{abstract}CreatePipelineState(const ComputePipelineDescriptor&, PipelineCache*): PipelineState*
}
Interface <|-- RenderSystem
class D3D12RenderSystem {
    +CreatePipelineCache(const Blob& initialBlob): PipelineCache*
    +CreatePipelineState(const GraphicsPipelineDescriptor&, PipelineCache*): PipelineState*
    +CreatePipelineState(const ComputePipelineDescriptor&, PipelineCache*): PipelineState*
    -pipelineCaches_: HWObjectContainer<D3D12PipelineCache>
    -pipelineStates_: HWObjectContainer<D3D12PipelineState>
}
RenderSystem <|-- D3D12RenderSystem
D3D12RenderSystem *-- D3D12PipelineCache
D3D12RenderSystem *-- D3D12PipelineState
class Blob {
    +{static}CreateFromFile(const char*): Blob
    +{static}CreateFromFile(const std::string&): Blob
}
NonCopyable <|-- Blob
D3D12PipelineCache *-- Blob
@enduml
```
```puml
@startuml O3DE
class "AZ::Dom::Object"
class "AZ::RHI::DeviceObject"

"AZ::Dom::Object" <|-- "AZ::RHI::DeviceObject"

class "AZ::RHI::PipelineLibrary" {
    -{abstract}InitInternal(Device&, const PipelineLibraryDescriptor&): ResultCode
}

"AZ::RHI::DeviceObject" <|-- "AZ::RHI::PipelineLibrary"

class "AZ::DX12::PipelineLibrary" {
    -m_serializedData: RHI::ConstPtr<RHI::PipelineLibraryData>
    -m_library: RHI::Ptr<ID3D12PipelineLibraryX>
    -m_pipelineStates: AZStd::unordered_map<AZStd::wstring, RHI::Ptr<ID3D12PipelineState>>
    +CreateGraphicsPipelineState(uint64_t, const D3D12_GRAPHICS_PIPELINE_STATE_DESC&): RHI::Ptr<ID3D12PipelineState>
    +CreateComputePipelineState(uint64_t, const D3D12_COMPUTE_PIPELINE_STATE_DESC&): RHI::Ptr<ID3D12PipelineState>
    -InitInternal(RHI::Device&, const RHI::PipelineLibraryDescriptor&): RHI::ResultCode
}

"AZ::RHI::PipelineLibrary" <|-- "AZ::DX12::PipelineLibrary"

struct "AZ::RHI::PipelineLibraryDescriptor" {
    +m_serializedData: ConstPtr<PipelineLibraryData>
    +m_filePath: AZStd::string
}

struct "AZ::RHI::PipelineStateCache::ThreadLibraryEntry" {
    +m_threadLocalCache: PipelineStateSet
    +m_library: Ptr<AZ::RHI::PipelineLibrary>
}

"AZ::RHI::PipelineStateCache::ThreadLibraryEntry" *-- "AZ::RHI::PipelineLibrary"

struct "AZ::RHI::PipelineStateCache::GlobalLibraryEntry" {
    +m_readOnlyCache: PipelineStateSet
    +m_pendingCache: PipelineStateSet
    +m_pipelineLibraryDescriptor: PipelineLibraryDescriptor
}

"AZ::RHI::PipelineStateCache::GlobalLibraryEntry" *-- "AZ::RHI::PipelineLibraryDescriptor"

class "AZ::RHI::PipelineStateCache" {
    -m_threadLibrarySet: ThreadLocalContext<ThreadLibrarySet>
    -m_globalLibrarySet: GlobalLibrarySet
    +AcquirePipelineState(PipelineLibraryHandle, const PipelineStateDescriptor&, const AZ::Name&): const PipelineState*
    +Compact()
}

"AZ::RHI::PipelineStateCache" *-- "AZ::RHI::PipelineStateCache::GlobalLibraryEntry"
"AZ::RHI::PipelineStateCache" *-- "AZ::RHI::PipelineStateCache::ThreadLibraryEntry"

class "AZ::RHI:RHISystem" {
    -m_pipelineStateCache: RHI::Ptr<RHI::PipelineStateCache>
}

"AZ::RHI:RHISystem" *-- "AZ::RHI::PipelineStateCache"

class "AZ::RPI::RPISystem" {
    -m_rhiSystem: RHI::RHISystem
}

"AZ::RPI::RPISystem" *-- "AZ::RHI:RHISystem"

class "AZ::RPI::RPISystemComponent" {
    -m_rpiSystem: RPISystem
}

"AZ::RPI::RPISystemComponent" *-- "AZ::RPI::RPISystem"

class "AZ::DX12::PipelineState" {
    -m_pipelineState: RHI::Ptr<ID3D12PipelineState>
    -InitInternal(RHI::Device&, const RHI::PipelineStateDescriptorForDraw&, RHI::PipelineLibrary*): RHI::ResultCode
    -InitInternal(RHI::Device&, const RHI::PipelineStateDescriptorForDispatch&, RHI::PipelineLibrary*): RHI::ResultCode
}

class "AZ::RHI::PipelineState"

"AZ::RHI::PipelineState" <|-- "AZ::DX12::PipelineState"
"AZ::RHI::DeviceObject" <|-- "AZ::RHI::PipelineState"

class "AZ::RPI::Shader" {
    -m_pipelineStateCache: RHI::PipelineStateCache*
    -m_pipelineLibraryHandle: RHI::PipelineLibraryHandle
    -m_pipelineLibraryPath: char[AZ_MAX_PATH_LEN]
    -Init(ShaderAsset&): RHI::ResultCode
    -LoadPipelineLibrary(): ConstPtr<RHI::PipelineLibraryData>
    -SavePipelineLibrary()
}

"AZ::RPI::Shader" o-- "AZ::RHI::PipelineStateCache"

struct "AZ::RHI::PipelineStateCache::PipelineStateEntry" {
    +m_pipelineState: ConstPtr<PipelineState>
}

"AZ::RHI::PipelineStateCache::PipelineStateEntry" *-- "AZ::RHI::PipelineState"

"AZ::RHI::PipelineStateCache::ThreadLibraryEntry" *-- "AZ::RHI::PipelineStateCache::PipelineStateEntry"
"AZ::RHI::PipelineStateCache::GlobalLibraryEntry" *-- "AZ::RHI::PipelineStateCache::PipelineStateEntry"
@enduml
```

```puml
@startuml The Forge
struct PipelineCache {
    +pLibrary: ID3D12PipelineLibrary*
    +pData: void*
}

struct PipelineCacheDesc {
    +pData: void*
    +mSize: size_t
    +mFlags: PipelineCacheFlags
}

struct PipelineCacheLoadDesc {
    +pFileName: const char*
    +mFlags: PipelineCacheFlags
}
@enduml
```
```puml
@startuml Wicked Engine
class GraphicsDevice {
    +{abstract}CreateShader(ShaderStage, const void*, size_t, Shader*): bool
    +{abstract}CreatePipelineState(const PipelineStateDesc*, PipelineState*, const RenderPassInfo*): bool
}

class GraphicsDevice_DX12 {
    #pipelineLibrary: Microsoft::WRL::ComPtr<ID3D12PipelineLibrary1>
    #commandlists: wi::vector<std::unique_ptr<CommandList_DX12>>
    #pipelines_global: wi::unordered_map<size_t, Microsoft::WRL::ComPtr<ID3D12PipelineState>>
    +~GraphicsDevice_DX12()
    +CreateShader(ShaderStage, const void*, size_t, Shader*): bool
    +CreatePipelineState(const PipelineStateDesc*, PipelineState*, const RenderPassInfo*): bool
    #pso_validate(CommandList)
}

GraphicsDevice <|-- GraphicsDevice_DX12

struct CommandList_DX12 {
    +pipelines_worker: wi::vector<std::pair<size_t, Microsoft::WRL::ComPtr<ID3D12PipelineState>>>
}

GraphicsDevice_DX12 *-- CommandList_DX12

struct PipelineState_DX12 {
    +resource: ComPtr<ID3D12PipelineState>
}

struct GraphicsDeviceChild {
    +internal_state: std::shared_ptr<void>
}

struct Shader

GraphicsDeviceChild <|-- Shader

struct PipelineState

GraphicsDeviceChild <|-- PipelineState

Shader *-- PipelineState_DX12
PipelineState *-- PipelineState_DX12
@enduml
```