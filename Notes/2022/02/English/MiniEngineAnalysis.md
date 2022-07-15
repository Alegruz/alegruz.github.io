# MiniEngine Analysis (19 FEB 2022)
[Home](/README.md)

# 01 Introduction

This analysis is based on Microsoft's DirectX 12 based simple rendering engine, [MiniEngine](https://github.com/microsoft/DirectX-Graphics-Samples/tree/master/MiniEngine). We will analyse the architecture, components, features of the engine. The goal of this analysis is to provide an introductory learning material for this engine.

# 02 Solution Structure

The solution **ModelViewer** is composed of three projects, namely **Core** project, **Model** project, and the **ModelViewer** project. The **ModelViewer** project serves as the entry point, a sample to the engine.

* ModelViewer
    * Source Files
        * MovelViewer
* Model
    * Shaders
        * Vertex Shaders
            * Default
            * Depth Only
            * Depth Viewer
            * Model Viewer
            * Skybox
        * Compute Shaders
            * Fill Light Grid
        * Pixel Shaders
            * Cutout Depth
            * Default
            * Depth Viewer
            * Model Viewer
            * Skybox
        * Common
        * Light Grid
        * Lighting
    * Source Files
        * Animation
        * BuildH3D
        * Constant Buffers
        * glTF (GL Transmission Format)
        * Index Optimize Post Transform
        * Light Manager
        * Mesh Convert
        * Model
        * Model Convert
        * ModelH3D
        * Model Loader
        * Particle Effects
        * Renderer
        * Sponza Renderer
        * Texture Convert
* Core
    * Shaders
        * Vertex Shaders
            * Particle
            * Performance Graph Background
            * Performance Graph
            * Screen Quad Common / Present
            * Text
        * Compute Shaders
            * Adapt Exposure
            * AO Blur and Upsample
            * AO Prepare Depth Buffers
            * AO Render
            * Apply Bloom
            * Average Luma
            * Bicubic Upsample
            * Bitonic 32/64 Inner/Outer/Pre Sort
            * Bitonic Indirect Arguments
            * Bloom Extract and Downsample HDR / LDR
            * Blur
            * Bound Neighborhood
            * Camera Motion Blur Pre Pass
            * Camera Velocity
            * Copy Back Post Buffer
            * Debug Draw Histogram
            * Debug Luminance HDR / LDR
            * Debug SSAO
            * Depth of Field Combine
            * Depth of Field Blue/Green/Red
            * Depth of Field Median Filter
            * Depth of Field Pass
            * Depth of Field Pre Filter
            * Depth of Field Tile Pass
            * Downsample Bloom All
            * Downsample Bloom
            * Extract Luma
            * FXAA Pass
            * FXAA Resolve Work Queue
            * Generate Histogram
            * Generate Mips
            * Lanczos
            * Linearize Depth
            * Motion Blur Pre/Final Pass
            * Particle Bin Culling
            * Particle Depth Bounds
            * Particle Dispatch Indirect Arguments
            * Particle Final Dispatch Indirect Arguments
            * Particle Large Bin Culling
            * Particle Pre Sort
            * Particle Sort Indirect Arguments
            * Particle Spawn
            * Particle Tile Culling
            * Particle Tile Render
            * Particle Update
            * Resolve TAA
            * Temporal Blend
            * Tone Map
            * Upsample and Blur
        * Pixel Shaders
            * Bicubic Horizontal Upsample
            * Bicubic Upsample Gamma
            * Bicubic Upsample
            * Bicubic Vertical Upsampler
            * Bilinear Upsample
            * Blend UI HDR
            * Buffer Copy
            * Composite HDR / SDR
            * Downsample Depth
            * Lanczos Horizontal / Vertical
            * Magnify Pixel
            * Motion Blur Final Pass
            * Particle
            * Performance Graph
            * Present HDR / SDR
            * Scale and Composite HDR / SDR
            * Shader Utility
            * Sharpening Upsample
            * Sharpen TAA
            * Text Antialias
            * Text Shadow
        * Bicubic Filter Functions
        * Bitonic Sort Common
        * Color Space Utility
        * Common Root Signature
        * Depth of Field Common
        * Depth of Field Root Signature
        * FXAA Root Signature
        * Lanczos Functions
        * Motion Blur Root Signature
        * Particle Root Signature
        * Particle Update Common
        * Particle Utility
        * Performance Graph Root Signature
        * Pixel Packing
        * Post Effects Root Signature
        * Present Root Signature
        * SSAO Root Signature
        * Text Root Signature
    * Source Files
        * Bitonic Sort
        * Bounding Box / Plane / Sphere
        * Buddy Allocator
        * Buffer Manager
        * Camera
        * Camera Controller
        * Color
        * Color Buffer
        * Command Allocator Pool
        * Command Context
        * Command Line Argument
        * Command List Manager
        * Command Signature
        * DDS Texture Loader
        * Depth Buffer
        * Depth of Field
        * Descriptor Heap
        * Display
        * Dynamic Descriptor Heap
        * Engine Profiling
        * Engine Tuning
        * Esram Allocator
        * File Utility
        * Frustum
        * FXAA
        * Game Core
        * Game Input
        * GPU Buffer
        * GPU Resource
        * GPU Time Manager
        * Graphics Common
        * Graphics Core
        * Graph Renderer
        * Hash
        * Image Scaling
        * Input
        * Linear Allocator
        * Matrix3, Matrix4
        * Motion Blur
        * Particle Effect
        * Particle Effect Manager
        * Particle Effect Porperties
        * Particle Emission Properties
        * Particle Shader Structures
        * Pipeline State
        * Pixel Buffer
        * Post Effects
        * Quaternion
        * Random
        * Readback Buffer
        * Root Signature
        * Sampler Manager
        * Scalar
        * Shadow Buffer
        * Shadow Camera
        * SSAO
        * System Time
        * Temporal Effects
        * Text Renderer
        * Texture
        * Texture Manager
        * Transform
        * Upload Buffer
        * Utility
        * Vector
        * Vector Math

# 03 Simple DirectX 12 Overview

According to [Microsoft's Direct3D 12's code flow for a simple app](https://docs.microsoft.com/en-us/windows/win32/direct3d12/creating-a-basic-direct3d-12-component), the outermost loop of a D3D12 program follows a very standard graphic process:

* [Initialize](#0301-initialize)
* Repeat
  * Update
  * Render
* Destroy

## 03.01 Initialize

* 01 Initialize the pipeline
  * 01.01 Enable the debug layer
  * 01.02 Create the device
  * 01.03 Create the command queue
  * 01.04 Create the swap chain
  * 01.05 Create a render target view (RTV) descriptor heap
    * **descriptor heap** can be thought of as an array of **descriptors**
    * each descriptor fully describes an object to the GPU
  * 01.06 Create frame resources (a render target view for each frame)
  * 01.07 Create a command allocator
    * **command allocator** manages the underlying storage for **command lists and bundles**
* 02 Initialize the assets
  * 02.01 Create an empty root signature
    * graphics **root signature** defines what resources are bound to the graphics pipeline
  * 02.02 Compile the shaders
  * 02.03 Create the vertex input layout
  * 02.04 Create a pipeline state object description, then create the object
    * **pipeline state object** maintains the state of all currently set shaders as well as certain fixed function state objects (such as the *input assembler*, *tesselator*, *rasterizer*, and *output merger*)
  * 02.05 Create the command list
  * 02.06 Close the command list
  * 02.07 Create and load the vertex buffers
  * 02.08 Create the vertex buffer views
  * 02.09 Create a fence
    * **fence** is used to synchronize the CPU with the GPU
  * 02.10 Create an event handle
  * Wait for the GPU to finish
    * check on the fence!

# 04 Execution Order

First, we have to define a child class of `GameCore::IGameApp` declared in `GameCore.h`. Afterwards, by using the `CREATE_APPLICATION( app_class )` macro function and passing our custom `GameCore::IGameApp` class as the `app_class`, MiniEngine automatically calls the `GameCore::RunApplication( IGameApp& app, const wchar_t* className, HINSTANCE hInst, int nCmdShow )`. Thus the first call stack would be:

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`

## 04.01 `GameCore::RunApplication`

Application first verifies CPU support via `bool XMVerifyCPUSupport()` function in `DirectXMathMisc.inl`. It basically checks whether the user's processor and its instruction set provides support that DirectXMath requires. If the CPU does not support certain features, then the function returns `false`, quitting the application.

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `XMVerifyCPUSupport` in `DirectXMathMisc.inl`

Then we initialize the Windows Runtime with `RO_INIT_MULTITHREADED` flag.

Next, we create and register a window class, then create a window. The basic size of the window is 1080p.

Then we initialize the `app` passed into `RunApplication` function by calling the `void InitializeApplication( IGameApp& app )` function in `GameCore.cpp`.

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`

### 04.01.01 `GameCore::InitializeApplication`

First, we check the command line arguments passed, and initialize them using `CommandLineArgs::Initialize( int argc, wchar_t** argv )` in `CommandLineArg.h`. This will save the command line options and their value into the argument map.

Second, we initialize the graphics system via `Graphics::Initialize( bool RequireDXRSupport )` in `GraphicsCore.h`. Using `bool IGameApp::RequiresRaytracingSupport()` function, we pass the boolean value into the `RequireDXRSupport` parameter.

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`

#### 04.01.01.01 `Graphics::Initialize`

As mentioned in [section 03.01](#0301-initialize), we must 01 initialize the pipeline.

In order to initialize a pipeline, we need to first 01.01 enable the debug layer with calls to:
* [`D3D12GetDebugInterface`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-d3d12getdebuginterface)
* [`ID3D12Debug::EnableDebugLayer`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12sdklayers/nf-d3d12sdklayers-id3d12debug-enabledebuglayer)

```cpp
Microsoft::WRL::ComPtr<ID3D12Debug> debugInterface;
if (SUCCEEDED(D3D12GetDebugInterface(IID_PPV_ARGS(&debugInterface))))
{
    debugInterface->EnableDebugLayer();

    if (bUseGPUBasedValidation)
    {
        Microsoft::WRL::ComPtr<ID3D12Debug1> debugInterface1;
        if (SUCCEEDED((debugInterface->QueryInterface(IID_PPV_ARGS(&debugInterface1)))))
        {
            debugInterface1->SetEnableGPUBasedValidation(TRUE);
        }
    }
}
```

Then, 01.02 create the device:
* [`CreateDXGIFactory1`](https://docs.microsoft.com/en-us/windows/win32/api/dxgi/nf-dxgi-createdxgifactory1)
  * * [`CreateDXGIFactory2`](https://docs.microsoft.com/en-us/windows/win32/api/dxgi1_3/nf-dxgi1_3-createdxgifactory2)
* [`D3D12CreateDevice`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-d3d12createdevice)

First, we obtain the DXGI factory.

We check whether the driver is harware, warp, or software, etc. Based on this, create the D3D12 device.

```cpp
// Obtain the DXGI factory
Microsoft::WRL::ComPtr<IDXGIFactory6> dxgiFactory;
ASSERT_SUCCEEDED(CreateDXGIFactory2(dxgiFactoryFlags, MY_IID_PPV_ARGS(&dxgiFactory)));

// Create the D3D graphics device
Microsoft::WRL::ComPtr<IDXGIAdapter1> pAdapter;

...

if (!bUseWarpDriver)
{
    SIZE_T MaxSize = 0;

    for (uint32_t Idx = 0; DXGI_ERROR_NOT_FOUND != dxgiFactory->EnumAdapters1(Idx, &pAdapter); ++Idx)
    {
        DXGI_ADAPTER_DESC1 desc;
        pAdapter->GetDesc1(&desc);

        // Is a software adapter?
        ...

        // Is this the desired vendor desired?
        ...

        // Can create a D3D12 device?
        if (FAILED(D3D12CreateDevice(pAdapter.Get(), D3D_FEATURE_LEVEL_11_0, IID_PPV_ARGS(&pDevice))))
            continue;

        // Does support DXR if required?
        ...

        // By default, search for the adapter with the most memory because that's usually the dGPU.
        ...

        MaxSize = desc.DedicatedVideoMemory;

        if (g_Device != nullptr)
            g_Device->Release();

        g_Device = pDevice.Detach();

        Utility::Printf(L"Selected GPU:  %s (%u MB)\n", desc.Description, desc.DedicatedVideoMemory >> 20);
    }

    ...

    if (g_Device == nullptr)
    {
        ...
        ASSERT_SUCCEEDED(dxgiFactory->EnumWarpAdapter(IID_PPV_ARGS(&pAdapter)));
        ASSERT_SUCCEEDED(D3D12CreateDevice(pAdapter.Get(), D3D_FEATURE_LEVEL_11_0, IID_PPV_ARGS(&pDevice)));
        g_Device = pDevice.Detach();
    }
}
```

Then, we check whether the hardware supports typed UAV(Unordered Access View) load of `R11G11B10_FLOAT`.

We create a command list manager by `void CommandListManager::Create( ID3D12Device* pDevice )` in `CommandListManager.h`:

```cpp
g_CommandManager.Create(g_Device);
```

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `CommandListManager::Create` in `CommandListManager.h`

##### 04.01.01.01.01 `CommandListManager::Create`

This function creates three command queues:
1. graphics queue
2. compute queue
3. copy queue.

01.03 Fill out a command queue description, then create the command queue:
* [`D3D12_COMMAND_QUEUE_DESC`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/ns-d3d12-d3d12_command_queue_desc)
* [`ID3D12Device::CreateCommandQueue`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-createcommandqueue)

Creating command queue requires calling `void CommandQueue::Create( ID3D12Device* pDevice )` in `CommandListManager.h`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `CommandListManager::Create` in `CommandListManager.h`
                    * `CommandQueue::Create` in `CommandListManager.h`

###### 04.01.01.01.01.01 `CommandQueue::Create`

01.03 Fill out a command queue description, then create the command queue:
* [`D3D12_COMMAND_QUEUE_DESC`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/ns-d3d12-d3d12_command_queue_desc)
* [`ID3D12Device::CreateCommandQueue`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-createcommandqueue)

This function create a command queue:

```cpp
D3D12_COMMAND_QUEUE_DESC QueueDesc = {};
QueueDesc.Type = m_Type;
QueueDesc.NodeMask = 1;
pDevice->CreateCommandQueue(&QueueDesc, MY_IID_PPV_ARGS(&m_CommandQueue));
```

Then, the function creates a fence, then sets the fence value.

02.09 Create and initialize the fence:
* [`ID3D12Device::CreateFence`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-createfence)

```cpp
ASSERT_SUCCEEDED(pDevice->CreateFence(0, D3D12_FENCE_FLAG_NONE, IID_PPV_ARGS(&m_pFence)));
m_pFence->Signal((uint64_t)m_Type << 56);
```

`ID3D12CommandQueue::Signal(pFence, Value)` method basically updates a fence to a specified value.

* 02.10 Create an event handle to use for frame synchronization:

```cpp
m_FenceEventHandle = CreateEvent(nullptr, false, false, nullptr);
```

Then, create an allocator pool by calling `void CommandAllocatorPool::Create( ID3D12Device* pDevice )` in `CommandAllocatorPool.h`.

Based on this process, create a graphics queue, compute queue, and a copy queue.

#### 04.01.01.02 `Graphics::Initialize`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`

After creating the command manager, initialize the common states by calling `void Graphics::InitializeCommonState()` in `GraphicsCommon.h`. 

##### 04.01.01.02.01 `Graphics::InitializeCommonState()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `Graphics::InitializeCommonState()` in `GraphicsCommon.h`. 

This function basically sets the commonly used data such as samplers, default textures, rasterizer states, depth states descriptions, alpha blend.

When creating the samplers, we call the `SamplerDesc::CreateDescriptor()` which calls the `AllocateDescriptor(Type, Count)` function that allocates a descriptor by the given arguments by calling `DescriptorAllocator::Allocate(Count)`. This function then request for a new heap by calling `DescriptorAllocator::RequestNewHeap(Type)` which ultimately creates a descriptor heap:

* [`D3D12_DESCRIPTOR_HEAP_DESC`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/ns-d3d12-d3d12_descriptor_heap_desc)
* [`ID3D12Device::CreateDescriptorHeap`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-createdescriptorheap)
* [`ID3D12Device::GetDescriptorHandleIncrementSize`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-getdescriptorhandleincrementsize)

```cpp
// DescriptorAllocator::RequestNewHeap
D3D12_DESCRIPTOR_HEAP_DESC Desc;
Desc.Type = Type;
Desc.NumDescriptors = sm_NumDescriptorsPerHeap;
Desc.Flags = D3D12_DESCRIPTOR_HEAP_FLAG_NONE;
Desc.NodeMask = 1;

Microsoft::WRL::ComPtr<ID3D12DescriptorHeap> pHeap;
ASSERT_SUCCEEDED(Graphics::g_Device->CreateDescriptorHeap(&Desc, MY_IID_PPV_ARGS(&pHeap)));

// DescriptorAllocator::Allocate
m_CurrentHeap = RequestNewHeap(m_Type);
m_DescriptorSize = Graphics::g_Device->GetDescriptorHandleIncrementSize(m_Type);
```

When creating the textures by calling the `Texture::Create2D(RowPitchBytes, Width, Height, Format, InitialData)`, this function first 02.07 creates a buffer:
* [`ID3D12Device::CreateCommittedResource(pHeapProperties, HeapFlags, pDesc, InitialResourceState, pOptimizedClearValue, riidResource, ppvResource)`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-createcommittedresource)

```cpp
m_UsageState = D3D12_RESOURCE_STATE_COPY_DEST;

D3D12_RESOURCE_DESC texDesc = {};
texDesc.Dimension = D3D12_RESOURCE_DIMENSION_TEXTURE2D;
texDesc.Width = Width;
texDesc.Height = (UINT)Height;
texDesc.DepthOrArraySize = 1;
texDesc.MipLevels = 1;
texDesc.Format = Format;
texDesc.SampleDesc.Count = 1;
texDesc.SampleDesc.Quality = 0;
texDesc.Layout = D3D12_TEXTURE_LAYOUT_UNKNOWN;
texDesc.Flags = D3D12_RESOURCE_FLAG_NONE;

D3D12_HEAP_PROPERTIES HeapProps;
HeapProps.Type = D3D12_HEAP_TYPE_DEFAULT;
HeapProps.CPUPageProperty = D3D12_CPU_PAGE_PROPERTY_UNKNOWN;
HeapProps.MemoryPoolPreference = D3D12_MEMORY_POOL_UNKNOWN;
HeapProps.CreationNodeMask = 1;
HeapProps.VisibleNodeMask = 1;

ASSERT_SUCCEEDED(g_Device->CreateCommittedResource(&HeapProps, D3D12_HEAP_FLAG_NONE, &texDesc,
    m_UsageState, nullptr, IID_PPV_ARGS(m_pResource.ReleaseAndGetAddressOf())));
```

Then initialize the buffer by calling `CommandContext::InitializeTexture(Dest, NumSubResources, SubData)`.

When initializing, copy data to the intermediate upload heap and then schedule a copy from the upload heap to the default heap. 

1. `ID3D12Resource::Map(Subresource, pReadRange, ppData)` method is invoked to bind a CPU pointer to the resource.
2. Some form of memory operations are performed (`memcpy`, etc.)
3. `ID3D12Resource::Unmap(Subresource, pWrittenRange)` method is invoked to invalidate the CPU pointer

The GPU virtual address of a buffer resource can be acquired by `ID3D12Resource::GetGPUVirtualAddress()`. This data is used to initialize the vertex buffer view when mapped to a vertex buffer.

`CommandContext::InitializeTexture(Dest, NumSubResources, SubData)` allocates and creates a command context 

A command context consists of a command list manager, command lists, command allocators, RSs, PSOs, descriptor heaps, etc.

When creating a command context, one must initialize the context by 02.05 creating new command list:
* [`ID3D12Device::CreateCommandList`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-createcommandlist)

Call `CommandListManager::CreateNewCommandList(Type, List, Allocator)` to allocate / create a command list.

However, in order to allocate a command list, one must have a allocator. If there is no allocator, then one must 01.07 create a command allocator:
* [`ID3D12Device::CreateCommandAllocator`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-createcommandallocator)

According to the command list type, request an allocator by calling `CommandQueue::RequestAllocator()`, which calls the `CommandAllocatorPool::RequestAllocator(CompletedFenceValue)` function:

```cpp
// CommandAllocatorPool::RequestAllocator(CompletedFenceValue)
ASSERT_SUCCEEDED(m_Device->CreateCommandAllocator(m_cCommandListType, IID_PPV_ARGS(&pAllocator)));
```

Now finally, we can 02.05 create the command list:
* [`ID3D12Device::CreateCommandList`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-createcommandlist)

```cpp
ASSERT_SUCCEEDED( m_Device->CreateCommandList(1, Type, *Allocator, nullptr, IID_PPV_ARGS(List)) );
```

The command lists are created in the recording state, but when the texture initialization is executed(`CommandContext::Finish(WaitForCompletion)` >> `CommandQueue::ExecuteCommandList(List)`), there is nothing to record yet. The main loop expects it to be closed. 02.06 Close the command list:
* [`ID3D12GraphicsCommandList::Close`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-close)

```cpp
// CommandQueue::ExecuteCommandList
ASSERT_SUCCEEDED(((ID3D12GraphicsCommandList*)List)->Close());
```

Afterwards, kickoff the command list by calling `ID3D12CommandQueue::ExecuteCommandList(NumCommandLists, ppComandLists)`.

Then signal the next fence value with the GPU:

```cpp
m_CommandQueue->Signal(m_pFence, m_NextFenceValue);
```

Once the execution is completed, in order to synchronize the CPU with the GPU, wait for the fence.

The function then initializes bitonic sorting by calling `void BitonicSort::Initialize()` in `BitonicSort.h`.

###### 04.01.01.02.01.01 `BitsonicSort::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `Graphics::InitializeCommonState()` in `GraphicsCommon.h`. 
                    * `BitsonicSort::Initialize()` in `BitsonicSort.h`

Bitonic sort is a highly parallel sorting algorithm well-suited to the GPU. This It has a complexity of O( N*(log N)^2 ), which is inferior to most traditional sorting algorithms, but because GPUs have so many threads, and because each thread can be utilized, the algorithm can fully load the GPU, taking advantage of its high ALU and bandwidth capabilities.

Another reason why sorting on the GPU is useful is when the GPU is creating work on its own timeline and needs to sort the work without CPU intervention. One example in MiniEngine is with GPU simulated particle systems. Before rendering the particles, it is beneficial to sort the particles and render them either front-to-back or back-to-front.

In order to use bitonic sort, 

02.01 Create an empty root signature, using the available helper structure:
* [`CD3DX12_ROOT_SIGNATURE_DESC`](https://docs.microsoft.com/en-us/windows/win32/direct3d12/cd3dx12-root-signature-desc)
* [`D3D12SerializeRootSignature`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-d3d12serializerootsignature)
* [`ID3D12Device::CreateRootSignature`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-createrootsignature)

In MiniEngine, a `RootSignature` class instance has two arrays each consisting of root parameters and static sampler descriptions. Once user sets the size of these array using `RootSignature::Reset(NumRootParams, NumStaticSamplers)`, user must initialize each root parameters. Afterwards, finalize the root signature by creating the root signature:

```cpp
ComPtr<ID3DBlob> pOutBlob, pErrorBlob;

ASSERT_SUCCEEDED( D3D12SerializeRootSignature(&RootDesc, D3D_ROOT_SIGNATURE_VERSION_1,
    pOutBlob.GetAddressOf(), pErrorBlob.GetAddressOf()));

ASSERT_SUCCEEDED( g_Device->CreateRootSignature(1, pOutBlob->GetBufferPointer(), pOutBlob->GetBufferSize(),
    IID_PPV_ARGS(&m_Signature)) );
```

Bitsonic then creates PSOs for the compute shaders used by `BitsonitSort`.

In Direct3D 12, required pipeline state is attached to a command list via a [pipeline state object](https://docs.microsoft.com/en-us/windows/win32/direct3d12/managing-graphics-pipeline-state-in-direct3d-12) (PSO). PSO can be stored in a variable and reuse it as many times as needed.

02.04 Fill out pipeline state description, using the helper structures available, then create the graphics pipeline state:
* [`D3D12_GRAPHICS_PIPELINE_STATE_DESC`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/ns-d3d12-d3d12_graphics_pipeline_state_desc)
* [`CD3DX12_RASTERIZER_DESC`](https://docs.microsoft.com/en-us/windows/win32/direct3d12/cd3dx12-rasterizer-desc)
* [`CD3DX12_BLEND_DESC`](https://docs.microsoft.com/en-us/windows/win32/direct3d12/cd3dx12-blend-desc)
* [`ID3D12Device::CreateGraphicsPipelineState`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-creategraphicspipelinestate)

In MiniEngine, PSO creation is simply done by creating a `PSO` instance such as an instance of `ComputePSO`, initializing and finalizing it.

* `BitsonicSort.cpp`
  
```cpp
#define CreatePSO( ObjName, ShaderByteCode ) \
    ObjName.SetRootSignature(s_RootSignature); \
    ObjName.SetComputeShader(ShaderByteCode, sizeof(ShaderByteCode) ); \
    ObjName.Finalize();

    CreatePSO(s_BitonicIndirectArgsCS, g_pBitonicIndirectArgsCS);
    CreatePSO(s_Bitonic32PreSortCS,    g_pBitonic32PreSortCS);
    CreatePSO(s_Bitonic32InnerSortCS,  g_pBitonic32InnerSortCS);
    CreatePSO(s_Bitonic32OuterSortCS,  g_pBitonic32OuterSortCS);
    CreatePSO(s_Bitonic64PreSortCS,    g_pBitonic64PreSortCS);
    CreatePSO(s_Bitonic64InnerSortCS,  g_pBitonic64InnerSortCS);
    CreatePSO(s_Bitonic64OuterSortCS,  g_pBitonic64OuterSortCS);

#undef CreatePSO
```

MiniEngine extensively uses precompiled shader headers files, thus these 02.02 shaders are all compiled.

ex)

```c
const unsigned char g_pPresentHDRPS[] = {
  0x44, 0x58, 0x42, 0x43, 0xd9, 0x83, 0x63, 0x5c, 0xa1, 0x90, 0x9f, 0xab,
  0x3e, 0x44, 0xc9, 0xa5, 0xfc, 0x63, 0x43, 0xf7, 0x01, 0x00, 0x00, 0x00,
  0x17, 0x41, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x48, 0x00, 0x00, 0x00,
  ...
}
```

* `PipelineState.h`

```cpp
class ComputePSO : public PSO
{
    friend class CommandContext;

public:
    ComputePSO(const wchar_t* Name = L"Unnamed Compute PSO");

    void SetComputeShader( const void* Binary, size_t Size ) { m_PSODesc.CS = CD3DX12_SHADER_BYTECODE(const_cast<void*>(Binary), Size); }
    void SetComputeShader( const D3D12_SHADER_BYTECODE& Binary ) { m_PSODesc.CS = Binary; }

    void Finalize();

private:

    D3D12_COMPUTE_PIPELINE_STATE_DESC m_PSODesc;
};
```

* `PipelineState.cpp`, `ComputePSO::Finalize()`

```cpp
ASSERT_SUCCEEDED( g_Device->CreateComputePipelineState(&m_PSODesc, IID_PPV_ARGS(&m_PSO)) );
```

##### 04.01.01.02.02 `Graphics::InitializeCommonState()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `Graphics::InitializeCommonState()` in `GraphicsCommon.h`. 

Afterwards, create common root signatures.
* 4 dword constants in register 0
* SRV descriptor range in register 0
* UAV descriptor range in register 0
* A constant buffer in register 1
* Three static samplers

Then create the PSOs containining compute shaders for mip map generations, and a graphics PSO containing vertex / pixel shaders for depth downsampling.

#### 04.01.01.03 `Graphics::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`

Now that we've initialized the common states, we have to initialize the `Display` class instance where DirectX resources must be initialized.

##### 04.01.01.03.01 `Display::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `Display::Initialize` in `GraphicsCore.h`


First, we have to 01.04 fill out a swap chain description, then create the swap chain:
* [`DXGI_SWAP_CHAIN_DESC`](https://docs.microsoft.com/en-us/windows/win32/api/dxgi/ns-dxgi-dxgi_swap_chain_desc)
* [`IDXGIFactory::CreateSwapChain`](https://docs.microsoft.com/en-us/windows/win32/api/dxgi/nf-dxgi-idxgifactory-createswapchain)
* [`IDXGISwapChain3::GetCurrentBackBufferIndex`](https://docs.microsoft.com/en-us/windows/win32/api/dxgi1_4/nf-dxgi1_4-idxgiswapchain3-getcurrentbackbufferindex)

```cpp
DXGI_SWAP_CHAIN_DESC1 swapChainDesc = {};
swapChainDesc.Width = g_DisplayWidth;
swapChainDesc.Height = g_DisplayHeight;
swapChainDesc.Format = SwapChainFormat;
swapChainDesc.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
swapChainDesc.BufferCount = SWAP_CHAIN_BUFFER_COUNT;
swapChainDesc.SampleDesc.Count = 1;
swapChainDesc.SampleDesc.Quality = 0;
swapChainDesc.Scaling = DXGI_SCALING_NONE;
swapChainDesc.SwapEffect = DXGI_SWAP_EFFECT_FLIP_DISCARD;
swapChainDesc.AlphaMode = DXGI_ALPHA_MODE_IGNORE;
swapChainDesc.Flags = DXGI_SWAP_CHAIN_FLAG_ALLOW_MODE_SWITCH;

DXGI_SWAP_CHAIN_FULLSCREEN_DESC fsSwapChainDesc = {};
fsSwapChainDesc.Windowed = TRUE;

ASSERT_SUCCEEDED(dxgiFactory->CreateSwapChainForHwnd(
    g_CommandManager.GetCommandQueue(),
    GameCore::g_hWnd,
    &swapChainDesc,
    &fsSwapChainDesc,
    nullptr,
    &s_SwapChain1));
```

For each buffer, create the associated resources by calling `ColorBuffer::CreateFromSwapChain(Name, BaseResource)`. In order to use the buffer as an RTV, we must first 01.05 Fill out a heap description, then create a descriptor heap.

01.06 Create the frame resources, the render target view (RTV):
* [`CD3DX12_CPU_DESCRIPTOR_HANDLE`](https://docs.microsoft.com/en-us/windows/win32/direct3d12/cd3dx12-cpu-descriptor-handle)
* [`GetCPUDescriptorHandleForHeapStart`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12descriptorheap-getcpudescriptorhandleforheapstart)
* [`IDXGISwapChain::GetBuffer`](https://docs.microsoft.com/en-us/windows/win32/api/dxgi/nf-dxgi-idxgiswapchain-getbuffer)
* [`ID3D12Device::CreateRenderTargetView`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12device-createrendertargetview)

```cpp
// Display::Initialize
for (uint32_t i = 0; i < SWAP_CHAIN_BUFFER_COUNT; ++i)
{
    ComPtr<ID3D12Resource> DisplayPlane;
    ASSERT_SUCCEEDED(s_SwapChain1->GetBuffer(i, IID_PPV_ARGS(&DisplayPlane)));
    g_DisplayPlane[i].CreateFromSwapChain(L"Primary SwapChain Buffer", DisplayPlane.Detach());
}

// DescriptorAllocator::Allocate
...
m_CurrentHandle = m_CurrentHeap->GetCPUDescriptorHandleForHeapStart();
...

// ColorBuffer::CreateFromSwapChain
...
m_RTVHandle = Graphics::AllocateDescriptor(D3D12_DESCRIPTOR_HEAP_TYPE_RTV);
Graphics::g_Device->CreateRenderTargetView(m_pResource.Get(), nullptr, m_RTVHandle);
```

Then create a present RS and the PSOs:

* GraphicsPSOs using both VS, PS
  * `BlendUIPSO`
  * `BlendUIHDRPSO`
* PS only
  * `PresentSDRPS`
  * `CompositeSDRPS`
  * `ScaleAndCompositeSDRPS`
  * `CompositeHDRPS`
  * `ScaleAndCompositeHDRPS`
  * `MagnifyPixelsPS`

Then create the buffers according to the native resolution:
* Main color buffer
* Normals buffer
* Motion vectors
* Post effects
* HDR images
    * Opaque geometries
        * Shading
            * SSAO
            * Shadow map
        * DoF
        * Temporal color
        * Motion blur
* Post processing
    * Luminance
    * Histogram
    * Bloom and Tone mapping
    * Antialiasing
* GenerateMipMaps() test

Next, we create a pre display buffer (pixel buffer), and based on its format, initialize the shaders related to image scaling:
* "Bilinear" / "Bicubic (Horizontal / Vertical)" / "Sharpening" / "Lanczos (Horizontal / Vertical)" (Upsampling)

##### 04.01.01.03.02 `GpuTimeManager::Initialize(MaxNumTimers)`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `GpuTimeManager::Initialize` in `GpuTimeManager.h`

Initialize the GPU Time Manager.

##### 04.01.01.03.03 `TemporalEffects::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `TemporalEffects::Initialize` in `TemporalEffects.h`

Initializes PSOs for compute shaders for temporal blending, bound neighborhood, sharpen TAA, resolve TAA, etc.

##### 04.01.01.03.04 `PostEffects::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `PostEffects::Initialize` in `PostEffects.h`

Initializes RS and PSOs for tone mapping, tone mapping HDR, blooms, luminance debugging (HDR, LDR), histograms generation and drawing, adapt exposures, luma, copy back post buffers, etc.

Also initializes exposure buffer, FXAA, motion blur, DoF.

##### 04.01.01.03.05 `SSAO::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `SSAO::Initialize` in `SSAO.h`

Initializes the RSs and PSOs for screen-space ambient occlusion.

##### 04.01.01.03.06 `TextRenderer::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `TextRenderer::Initialize` in `TextRenderer.h`

Initializes the RSs and PSOs, and 02.03 creates the vertex input layout for text rendering:
* [`D3D12_INPUT_ELEMENT_DESC`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/ns-d3d12-d3d12_input_element_desc)

```cpp
// The glyph vertex description.  One vertex will correspond to a single character.
D3D12_INPUT_ELEMENT_DESC vertElem[] =
{
    { "POSITION", 0, DXGI_FORMAT_R32G32_FLOAT     , 0, 0, D3D12_INPUT_CLASSIFICATION_PER_INSTANCE_DATA, 1 },
    { "TEXCOORD", 0, DXGI_FORMAT_R16G16B16A16_UINT, 0, 8, D3D12_INPUT_CLASSIFICATION_PER_INSTANCE_DATA, 1 }
};
```

##### 04.01.01.03.07 `GraphRenderer::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `GraphRenderer::Initialize` in `GraphRenderer.h`

Initializes RSs and PSOs regarding performance graphs used for profiling.

##### 04.01.01.03.08 `ParticleEffectManager::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `ParticleEffectManager::Initialize` in `ParticleEffectManager.h`

Initializes RSs and PSOs regarding particle effects such as spawning, updating, culling, rendering, etc.

#### 04.01.01.04 `SystemTime::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `SystemTime::Initialize` in `SystemTime.h`

Initializes CPU tick.

#### 04.01.01.05 `GameInput::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `GameInput::Initialize` in `GameInput.h`

Initializes input devices such as keyboard and mouse.

#### 04.01.01.06 `EngineTuning::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `EngineTuning::Initialize` in `EngineTuning.h`

Sets up paths and variables.

#### 04.01.01.07 `ModelViewer::Startup()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `ModelViewer::Startup` in `ModelViewer.cpp`

Initialize renderer, load IBL textures, load models, set camera.


##### 04.01.01.07.01 `Renderer::Initialize()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `ModelViewer::Startup` in `ModelViewer.cpp`
                * `Renderer::Initialize` in `Renderer.h`

Initializes RSs, common vertex input layouts, depth only PSOs, shadow PSOs, default PSOs, skybox PSOs, texture manager, descriptors for textures and samplers, lighting resources.

Root signature contains:

* Parameters
    1. (Inline Descriptor) VS. Mesh Constant Buffer : `b0`
       * `MeshConstants`
          * World Matrix
          * World IT (object normal to world normal)
    2. (Inline Descriptor) PS. Material Constant Buffer : `b0`
       * `MaterialConstants`
           * Base color factor
           * Emissive factor
           * Normal texture scale
           * Metallic roughness factor
           * Flags  
    1. (Descriptor Range) PS. Material SRVs (x10) : `t0`
       1. `baseColorTexture`
       2. `metallicRoughnessTexture`
       3. `occlusionTexture`
       4. `emissiveTexture`
       5. `normalTexture`
    2. (Descriptor Range) PS. Material Samplers (x10) : `s0`
       1. `baseColorSampler`
       2. `metallicRoughnessSampler`
       3. `occlusionSampler`
       4. `emissiveSampler`
       5. `normalSampler`
    3. (Descriptor Range) PS. Common SRVs (x10) : `t10`
       1. `radianceIBLTexture`
       2. `irradianceIBLTexture`
       3. `texSSAO`
       4. `texSunShadow`
    4. (Inline Descriptor) Common Constant Buffer : `b1`
       * `GlobalConstants`
          *  View, Projection Matrix
          *  Sun Shadow Matrix
          *  Viewer Position
          *  Sun Direction
          *  Sun Intensity
          *  IBL Range
          *  IBL Bias
    5. (Inline Descriptor) VS. Skinning Matrix : `t20`
* Samplers
    * PS. Default Sampler : `s10`
    * PS. Sampler Shadow : `s11`
    * PS. Cube Map Sampler : `s12`

PSO:
* Depth PSOs (Depth Buffer):
    * Depth Only PSO
    * Cutout Depth PSO
    * Skin Depth Only PSO
* Shadow PSOs (Shadow Buffer):
    * Depth Only PSO
    * Cutout Depth PSO
    * Skin Depth Only PSO
* Default PSO
* Skybox PSO

##### 04.01.01.07.02 `ModelViewer::LoadIBLTextures()`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `ModelViewer::Startup` in `ModelViewer.cpp`
                * `ModelViewer::LoadIBLTextures` in `ModelViewer.cpp`

IBL: Image-Based Lighting

---

Lighting Root Signature

* Parameters
    1. (Inline Descriptor) : `b0`
       * `CSConstants`
           * Viewport Width, Height: `uint`
           * InvTileDim: `float`
           * RcpZMagic: `float`
           * TileCountX: `uint`
           * View, Projection Matrix: `float4x4`
    2. (Descriptor Range) SRVs (x2) : `t0`
       1. Light Buffer: `StructuredBuffer<LightData>`
       2. Depth Texture: `Texture2D<float>`
    3. (Descriptor Range) UAVs (x2) : `u0`
       1. Light Grid: `RWByteAddressBuffer`
       2. Light Grid Bit Mask: `RWByteAddressBuffer`

ComputePSO:
* Fill Light Grid

---

SSAO Root Signature

* Parameters
    1. (Constant) 4 `DWORD`s : `b0`
       * `CB0`
           * ZMagic / InvSourceDimension
    2. (Inline Descriptor) Constant Buffer : `b1`
       * `CB1` 
           * InvThickness Table     /   Inv Low Resolution
           * Sample Weight Table    /   Inv High Resolution
           * InvSlice Dimension     /   Noise Filter Strength
           * Reject Fadeoff         /   Step Size
           * Rcp Accentuation       /   Blur Tolerance
           * Upsample Tolerance
    3. (Descriptor Range) UAVs (x5) : `u0`
       1. LinearZ   /   DS4x        /   Occlusion   /   AoResult
       2. DS2x      /   DS8x
       3. DS2xAtlas /   DS8xAtlas
       4. DS4x      /   DS16x
       5. DS4xAtlas /   DS16xAtlas
    4. (Descriptor Range) SRVs (x5) : `t0`
       1. Depth /   LoResDB
       2. HiResDB
       3. LoResA01
    5. (Inline Descriptor) SRV : `t5`
* Samplers
    1. Linear Clamp : `s0`
    2. Linear Border : `s1`

---

Model Root Signature

* Parameters
    1. (Inline Descriptor) VS. Mesh Constant Buffer : `b0`
       * `VSConstants`
          * Model To Projection
          * Model To Shadow
          * Viewer Position
    2. (Inline Descriptor) PS. Material Constant Buffer : `b0`
       * `PSConstants`
           * Sun Direction
           * Sun Color
           * Ambient Color
           * Shadow Texel Size
           * Inv Tile Dim
           * Tile Count
           * First Light Index
           * Frame Index Mod2 
    3. (Descriptor Range) PS. Material SRVs (x10) : `t0`
       1. `texDiffuse`
       2. `texSpecular`
       3. `texEmissive`
       4. `texNormal`
       5. `texLightmap`
       6. `texReflection`
    4. (Descriptor Range) PS. Material Samplers (x10) : `s0`
       1. `baseColorSampler`
       2. `metallicRoughnessSampler`
       3. `occlusionSampler`
       4. `emissiveSampler`
       5. `normalSampler`
    5. (Descriptor Range) PS. Common SRVs (x10) : `t10`
       1. `radianceIBLTexture`
       2. `irradianceIBLTexture`
       3. `texSSAO`
       4. `texSunShadow` / `texShadow`
       5. `lightBuffer`
       6. `lightShadowArrayTex`
       7. `lightGrid`
       8. `lightGridBitMask`
       9. ...
       10. ...
    6. (Inline Descriptor) Common Constant Buffer : `b1`
       * `StartVertex`
          * material index
    7. (Inline Descriptor) VS. Skinning Matrix : `t20`
* Samplers
    * PS. Default Sampler : `s10`
    * PS. Sampler Shadow : `s11`
    * PS. Cube Map Sampler : `s12`



### 04.01.02 `GameCore::UpdateApplication`

MiniEngine uses the class `CommandContext` to wrap the functionalities of `ID3D12GraphicsCommandList`. The resulting class resembles Direct3D 11's immediate context.

#### 04.01.02.01 `ModelViewer::RenderScene`

According the Microsoft's render flow:

* 01 Populate the command list
    * 01.01 Reset the command list allocator
        * Re-use the memory that is associated with the command allocator
        * [`ID3D12CommandAllocator::Reset`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12commandallocator-reset)
    * 01.02 Reset the command list
        * [`ID3D12GraphicsCommandList::Reset`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-reset)
    * 01.03 Set the graphics root signature
        * Sets the graphics root signature to use for the current command list
        * [`ID3D12GraphicsCommandList::SetGraphicsRootSignature`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-setgraphicsrootsignature)
    * 01.04 Set the viewport and scissor rectangles
        * [`ID3D12GraphicsCommandList::RSSetViewports`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-rssetviewports)
        * [`ID3D12GraphicsCommandList::RSSetScissorRects`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-rssetscissorrects)
    * 01.05 Set a resource barrier, indicating the back buffer is to be used as a render target
        * Resource barriers are used to manage resource transitions
        * [`ID3D12GraphicsCommandList::ResourceBarrier`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-resourcebarrier)
        * [`ID3D12DescriptorHeap::GetCPUDescriptorHandleForHeapStart`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12descriptorheap-getcpudescriptorhandleforheapstart)
        * [`D3D12GraphicsCommandList::OMSetRenderTargets`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-omsetrendertargets)
    * 01.06 Record commands into the command list
        * [`ID3D12GraphicsCommandList::ClearRenderTargetView`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-clearrendertargetview)
        * [`ID3D12GraphicsCommandList::IASetPrimitiveTopology`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-iasetprimitivetopology)
        * [`ID3D12GraphicsCommandList::IASetVertexBuffers`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-iasetvertexbuffers)
        * [`ID3D12GraphicsCommandList::DrawInstanced`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-drawinstanced)
    * 01.07 Indicate the back buffer will be used to present after the command list has executed
        * Another call to set a resource barrier
        * [`ID3D12GraphicsCommandList::ResourceBarrier`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-resourcebarrier)
    * 01.08 Close the command list to further recording
        * [`ID3D12GraphicsCommandList::Close`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-close)
* 02 Execute the command list
    * [`ID3D12CommandQueue::ExecuteCommandLists`](https://docs.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12commandqueue-executecommandlists)
* 03 Present the frame
    * [`IDXGISwapChain1::Present1`](https://docs.microsoft.com/en-us/windows/win32/api/dxgi1_2/nf-dxgi1_2-idxgiswapchain1-present1)
* 04 Wait for the GPU to finish
    * Keep updating and checking the fence

1. Shadow PSO, Cutout Shadow PSO -> Shadow Buffer `m_LightShadowTempBuffer`
   * `m_LightShadowTempBuffer` is copied to `m_LightShadowArray`
   * `m_LightShadowArray`'s state is now PS resource
2. Z Pre Pass
   1.  Opaque
       * Depth PSO -> Depth Buffer `g_SceneDepthBuffer`
   2.  Cutout
       * Cutout Depth PSO -> Depth Buffer `g_SceneDepthBuffer`
3. SSAO
   1. SSAO Generation
    `g_SceneDepthBuffer`, `g_SSAOFullScreen`
4. Diffuse Pass
    * Fill Light Grid
        * SRVs: `m_LightBuffer`, `LinearDepth`
        * UAVs: `m_LightGrid`, `m_LightGridBitMask`
    * Main Render
        * `g_SceneColorBuffer`, `g_SceneNormalBuffer` to Render State
        * Clear Color Buffer
5. Shadow Map
6. Diffuse Pass
    * `g_SSAOFullScreen` to PS resource state
    * 
7. 