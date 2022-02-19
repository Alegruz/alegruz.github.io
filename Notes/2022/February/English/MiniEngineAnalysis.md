# MiniEngine Analysis (19 FEB 2022)
[Home](/README.md)

# Introduction

This analysis is based on Microsoft's DirectX 12 based simple rendering engine, [MiniEngine](https://github.com/microsoft/DirectX-Graphics-Samples/tree/master/MiniEngine). We will analyse the architecture, components, features of the engine. The goal of this analysis is to provide an introductory learning material for this engine.

# Solution Structure

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

# Execution Order

First, we have to define a child class of `GameCore::IGameApp` declared in `GameCore.h`. Afterwards, by using the `CREATE_APPLICATION( app_class )` macro function and passing our custom `GameCore::IGameApp` class as the `app_class`, MiniEngine automatically calls the `GameCore::RunApplication( IGameApp& app, const wchar_t* className, HINSTANCE hInst, int nCmdShow )`. Thus the first call stack would be:

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`

## `GameCore::RunApplication`

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

### `GameCore::InitializeApplication`

First, we check the command line arguments passed, and initialize them using `CommandLineArgs::Initialize( int argc, wchar_t** argv )` in `CommandLineArg.h`. This will save the command line options and their value into the argument map.

Second, we initialize the graphics system via `Graphics::Initialize( bool RequireDXRSupport )` in `GraphicsCore.h`. Using `bool IGameApp::RequiresRaytracingSupport()` function, we pass the boolean value into the `RequireDXRSupport` parameter.

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`

#### `Graphics::Initialize`

First, we obtain the DXGI factory.

We check whether the driver is harware, warp, or software, etc. Based on this, create the D3D12 device.

Then, we check whether the hardware supports typed UAV(Unordered Access View) load of `R11G11B10_FLOAT`.

Then, we create a command list manager by `void CommandListManager::Create( ID3D12Device* pDevice )` in `CommandListManager.h`.

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `CommandListManager::Create` in `CommandListManager.h`

##### `CommandListManager::Create`

This function creates three command queues:
1. graphics queue
2. compute queue
3. copy queue.

Creating command queue requires calling `void CommandQueue::Create( ID3D12Device* pDevice )` in `CommandListManager.h`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`
                * `CommandListManager::Create` in `CommandListManager.h`
                    * `CommandQueue::Create` in `CommandListManager.h`

###### `CommandQueue::Create`

This function create a command queue and a fence, then sets the fence value.

Then, create an event and assign it as the fence event handle.

Then, create an allocator pool by calling `void CommandAllocatorPool::Create( ID3D12Device* pDevice )` in `CommandAllocatorPool.h`.

#### `Graphics::Initialize`

* `wWinMain` in `GameCore.h`
    * `GameCore::RunApplication` in `GameCore.h`
        * `GameCore::InitializeApplication` in `GameCore.cpp`
            * `Graphics::Initialize` in `GraphicsCore.h`

After creating the command manager, initialize the common states by calling `void Graphics::InitializeCommonState()` in `GraphicsCommon.h`. This function basically sets the commonly used data usch as sampler states, pixels/texels, textures, rasterizer states, depth states, alpha blend. The function then intializes bitonic sorting by calling `void BitonicSort::Initialize()` in `BitonicSort.h` which creates a GPU buffer of dispatch arguments, .