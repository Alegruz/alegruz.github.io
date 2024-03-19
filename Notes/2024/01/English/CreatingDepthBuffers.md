# Creating Depth Buffers in Direct3D 12 and Vulkan (27 JAN 2024)
[Home](/README.md)

# 1. Overview

![Direct3D 11 Pipeline Stages](https://learn.microsoft.com/en-us/windows/win32/direct3d11/images/d3d11-pipeline-stages.jpg)
<br><sup><a href="#ref01">[1]</a></sup>

**Depth buffers** are used in computer to store the closest depth to the camera. The depth buffers are written in the *pixel/fragment shader stage* if the depth buffer is bound to the shader, and has a depth-write-enable state. The *output merger stage* then uses this buffer to perform depth testing to figure which pixel/fragment should be written to the final render target.

The rendering process requires CPU to prepare certain objects to be used in the GPU. In this article, the object would be the depth buffer. We should also provide GPU with instructional hints on how to utilize the buffer too. There are numerous ways to using the depth buffer including that a pipeline might not even use a depth buffer. All these information must be constructed from the host(CPU), and this preparation stage is required to fully optimize the use of the GPU's rendering pipeline.

In short, one must prepare some data in the system memory, which would include the depth buffer, and a list of commands to be executed by the device(GPU). The data would be transferred(copied) from the host to the device via the PCIe bus. Transferring the data needed for rendering before execution ensures the GPU to be running independently from the system memory. List of commands likewise are submitted to the GPU where it translates the commands and executes them.<sup><a href="#ref02">[2]</a></sup>

GPU has various ways of executions. We might use *general-purpose* commands to execute the GPU using CUDA or compute shaders. We can also use the RT cores for hardware-accelerated ray tracing using the *ray tracing pipeline*. However, the most prevalent use of the GPU would be the *rendering pipeline* or the *graphics pipeline*. In this article, we are only discussing the stages relevant to the depth buffer which I have already mentioned in the first paragraph: *pixel shader stage*, and the *output merger stage*.

![LogicalRenderPipelineToHardware](/Images/AMD/LogicalRenderPipelineToHardware.JPG)
<br><sup><a href="#ref02">[2]</a></sup>

Before discussing any further, you must understand the fact that the render pipelines are merely a logical abstraction of the actual render pipelines implemented by the vendors(NVIDIA, AMD, etc.). The article might contain some of those implementation-defined details, but the main bedrock is the logical render pipeline which is more than enough to understand the whole process. In AMD's RNDA architecture, the pixel shader stage corresponds to the *dual compute unit* which simply executes the shader program with the input provided from the *shader processor input* stage. The output merger stage corresponds to the *color backend / depth backend* stage where the frame buffer is written.<sup><a href="#ref02">[2]</a></sup>

During rasterization, each primitive is converted into pixels, while interpolating per-vertex values across each primitive<sup><a href="#ref03">[3]</a></sup>. This obviously includes the z value&mdash;the depth&mdash;of the vertices. For the details regarding interpolating depths, the article <a href="#ref04">[4]</a></sup> by Fabien Giesen on the graphics pipeline written in 2011 really helps.

During the pixel shader stage, a pixel shader can output the depth into a buffer<sup><a href="#ref01">[1]</a></sup>.

During the output merger stage, if current pipeline has depth testing enabled and the depth buffer is provided, pixels/fragments are discarded based on the result of the depth function when given two inputs: the pixel/fragment's depth value, and the value of the depth buffer corresponding to the pixel/fragment's coordinate.

However, there actually is an early-z stage in the hardware hidden from the logical pipeline. This stage is helpful because the main bottleneck of rendering pipelines are often the pixel shader stage. Discarding pixels before running the pixel shader stage thus helps the overall performance of the execution. Early Z testing is a common stage for mobile GPU's such as ARM's Mali GPU<sup><a href="#ref05">[5]</a></sup>. Early Z and Late Z stages are controllable in Vulkan. It can be configured by the `VkPipelineStageFlagBits` used in synchronizations<sup><a href="#ref06">[6]</a><a href="#ref07">[7]</a></sup>.

# 2. Creating a Depth Buffer

## 2.1. Direct3D 12

### 2.1.1. Heap

In Direct3D, creating a buffer requires the resource to be places in a *heap*. A heap is an abstraction of contiguous memory allocation, used to manage physical memory<sup><a href="#ref08">[8]</a></sup>. The actual objects allocated in this heap are the `ID3D12Resource` objects.

```cpp
// Rendering to 1080p Render Target
// 32-bit floating-point depth values
void CreateHeap( ID3D12Device& device )
{
    static constexpr const size_t WIDTH = 1920;
    static constexpr const size_t HEIGHT = 1080;
    static constexpr const size_t DEPTH_SIZE = sizeof(float);
    static constexpr const size_t DEPTH_BUFFER_SIZE_IN_BYTES = WIDTH * HEIGHT * DEPTH_SIZE;

    // To avoid wasting memory, applications should pass SizeInBytes values which are multiples of the effective Alignment
    // Alignment value for a default heap is 64 KB.
    static constexpr const size_t ALIGNMENT = 65536;

    D3D12_HEAP_PROPERTIES heapProperties =
    {
        // Depth buffer requires read/write access in the GPU only
        .Type = D312_HEAP_TYPE_DEFAULT;
        .CPUPageProperty = D3D12_CPU_PAGE_PROPERTY_UNKNOWN;
        .MemoryPoolPreference = ;
        .CreationNodeMask = ;
        .VisibleNodeMask = ;
    };

    D3D12_HEAP_DESC heapDesc =
    {
        .SizeInBytes = Align(DEPTH_BUFFER_SIZE_IN_BYTES, ALIGNMENT);
        .Properties = ;
        .Alignment = ;
        .Flags = ;
    };
    HRESULT hr = device.CreateHeap();
}
```

# References

<ol>
<li id="ref01"><a href="https://learn.microsoft.com/en-us/windows/win32/direct3d11/pixel-shader-stage">Pixel Shader Stage. Microsoft Documentation.</a></li>
<li id="ref02"><a href="https://gpuopen.com/videos/graphics-pipeline/">All the Pipelines &mdash; Journey through the GPU. GIC 2020. AMD. Lou Kramer.</a></li>
<li id="ref03"><a href="https://learn.microsoft.com/en-us/windows/win32/direct3d11/d3d10-graphics-programming-guide-rasterizer-stage">Rasterization Stage. Microsoft Documentation.</a></li>
<li id="ref04"><a href="https://fgiesen.wordpress.com/2011/07/09/a-trip-through-the-graphics-pipeline-2011-index/">A trip through the Graphics Pipeline 2011. Fabien Giesen Blog.</a></li>
<li id="ref05"><a href="https://youtu.be/K6XmuVaACDY?si=qgrHMRDloKlctniX">Arm Mali GPU Training Series Ep 1.2 : The rendering pipeline. Arm Software Developers YouTube Channel.</a></li>
<li id="ref06"><a href="https://youtu.be/ENOh4KLGJxY?si=7OTqwHl7iP_167VX">Pipelines and Stages | "Inside Graphics, Compute, Ray Tracing Pipes" | Vulkan Lecture Series, Ep. 5. Computer Graphics at TU Wien YouTube Channel.</a></li>
<li id="ref07"><a href="https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VkPipelineStageFlagBits.html">VkPipelineStageFlagBits(3) Manual Page. Vulkan Documentation.</a></li>
<li id="ref08"><a href="https://learn.microsoft.com/en-us/windows/win32/api/d3d12/nn-d3d12-id3d12heap">ID3D12Heap interface (d3d12.h). Microsoft Documentation.</a></li>
</ol>