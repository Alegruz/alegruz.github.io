# Primitive Topology Survey (2024.06.18)

[Home](/)

# Primitive Topology

## Godot Engine

```cpp
// rendering_device_common.h
enum RenderPrimitive {
    RENDER_PRIMITIVE_POINTS,
    RENDER_PRIMITIVE_LINES,
    RENDER_PRIMITIVE_LINES_WITH_ADJACENCY,
    RENDER_PRIMITIVE_LINESTRIPS,
    RENDER_PRIMITIVE_LINESTRIPS_WITH_ADJACENCY,
    RENDER_PRIMITIVE_TRIANGLES,
    RENDER_PRIMITIVE_TRIANGLES_WITH_ADJACENCY,
    RENDER_PRIMITIVE_TRIANGLE_STRIPS,
    RENDER_PRIMITIVE_TRIANGLE_STRIPS_WITH_AJACENCY,
    RENDER_PRIMITIVE_TRIANGLE_STRIPS_WITH_RESTART_INDEX,
    RENDER_PRIMITIVE_TESSELATION_PATCH,
    RENDER_PRIMITIVE_MAX
};
```

### Godot Engine - D3D12

```cpp
// rendering_device_driver_d3d12.cpp
static const D3D12_PRIMITIVE_TOPOLOGY_TYPE RD_PRIMITIVE_TO_D3D12_TOPOLOGY_TYPE[RDD::RENDER_PRIMITIVE_MAX] = {
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_POINT,
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_LINE,
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_LINE,
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_LINE,
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_LINE,
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,
	D3D12_PRIMITIVE_TOPOLOGY_TYPE_PATCH,
};

static const D3D12_PRIMITIVE_TOPOLOGY RD_PRIMITIVE_TO_D3D12_TOPOLOGY[RDD::RENDER_PRIMITIVE_MAX] = {
	D3D_PRIMITIVE_TOPOLOGY_POINTLIST,
	D3D_PRIMITIVE_TOPOLOGY_LINELIST,
	D3D_PRIMITIVE_TOPOLOGY_LINELIST_ADJ,
	D3D_PRIMITIVE_TOPOLOGY_LINESTRIP,
	D3D_PRIMITIVE_TOPOLOGY_LINESTRIP_ADJ,
	D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST,
	D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST_ADJ,
	D3D_PRIMITIVE_TOPOLOGY_TRIANGLESTRIP,
	D3D_PRIMITIVE_TOPOLOGY_TRIANGLESTRIP_ADJ,
	D3D_PRIMITIVE_TOPOLOGY_TRIANGLESTRIP,
	D3D_PRIMITIVE_TOPOLOGY_1_CONTROL_POINT_PATCHLIST,
};

RDD::PipelineID RenderingDeviceDriverD3D12::render_pipeline_create(
		ShaderID p_shader,
		VertexFormatID p_vertex_format,
		RenderPrimitive p_render_primitive,
		PipelineRasterizationState p_rasterization_state,
		PipelineMultisampleState p_multisample_state,
		PipelineDepthStencilState p_depth_stencil_state,
		PipelineColorBlendState p_blend_state,
		VectorView<int32_t> p_color_attachments,
		BitField<PipelineDynamicStateFlags> p_dynamic_state,
		RenderPassID p_render_pass,
		uint32_t p_render_subpass,
		VectorView<PipelineSpecializationConstant> p_specialization_constants) {
    ...
	pipeline_desc.PrimitiveTopologyType = RD_PRIMITIVE_TO_D3D12_TOPOLOGY_TYPE[p_render_primitive];
    if (p_render_primitive == RENDER_PRIMITIVE_TESSELATION_PATCH) {
		// Is there any way to get the true point count limit?
		ERR_FAIL_COND_V(p_rasterization_state.patch_control_points < 1 || p_rasterization_state.patch_control_points > 32, PipelineID());
		pso_extra_info.dyn_params.primitive_topology = (D3D12_PRIMITIVE_TOPOLOGY)((int)D3D_PRIMITIVE_TOPOLOGY_1_CONTROL_POINT_PATCHLIST + p_rasterization_state.patch_control_points);
	} else {
		pso_extra_info.dyn_params.primitive_topology = RD_PRIMITIVE_TO_D3D12_TOPOLOGY[p_render_primitive];
	}
    ...
}

void RenderingDeviceDriverD3D12::command_bind_render_pipeline(CommandBufferID p_cmd_buffer, PipelineID p_pipeline) {
    ...
	ID3D12PipelineState *pso = (ID3D12PipelineState *)p_pipeline.id;
    ...
	const RenderPipelineExtraInfo &pso_extra_info = render_psos_extra_info[pso];
    ...
	cmd_buf_info->cmd_list->IASetPrimitiveTopology(pso_extra_info.dyn_params.primitive_topology);
    ...
}

// rendering_device_driver_d3d12.h
class RenderingDeviceDriverD3D12 : public RenderingDeviceDriver {
    ...
private:
	struct RenderPipelineExtraInfo {
		struct {
			D3D12_PRIMITIVE_TOPOLOGY primitive_topology = {};
			Color blend_constant;
			float depth_bounds_min = 0.0f;
			float depth_bounds_max = 0.0f;
			uint32_t stencil_reference = 0;
		} dyn_params;

		const VertexFormatInfo *vf_info = nullptr;
	};
	HashMap<ID3D12PipelineState *, RenderPipelineExtraInfo> render_psos_extra_info;
    ...
};
```

### Godot Engine - Vulkan

```cpp
// rendering_device_driver_vulkan.cpp
static const VkPrimitiveTopology RD_TO_VK_PRIMITIVE[RDD::RENDER_PRIMITIVE_MAX] = {
	VK_PRIMITIVE_TOPOLOGY_POINT_LIST,
	VK_PRIMITIVE_TOPOLOGY_LINE_LIST,
	VK_PRIMITIVE_TOPOLOGY_LINE_LIST_WITH_ADJACENCY,
	VK_PRIMITIVE_TOPOLOGY_LINE_STRIP,
	VK_PRIMITIVE_TOPOLOGY_LINE_STRIP_WITH_ADJACENCY,
	VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST,
	VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST_WITH_ADJACENCY,
	VK_PRIMITIVE_TOPOLOGY_TRIANGLE_STRIP,
	VK_PRIMITIVE_TOPOLOGY_TRIANGLE_STRIP_WITH_ADJACENCY,
	VK_PRIMITIVE_TOPOLOGY_TRIANGLE_STRIP,
	VK_PRIMITIVE_TOPOLOGY_PATCH_LIST,
};

RDD::PipelineID RenderingDeviceDriverVulkan::render_pipeline_create(
		ShaderID p_shader,
		VertexFormatID p_vertex_format,
		RenderPrimitive p_render_primitive,
		PipelineRasterizationState p_rasterization_state,
		PipelineMultisampleState p_multisample_state,
		PipelineDepthStencilState p_depth_stencil_state,
		PipelineColorBlendState p_blend_state,
		VectorView<int32_t> p_color_attachments,
		BitField<PipelineDynamicStateFlags> p_dynamic_state,
		RenderPassID p_render_pass,
		uint32_t p_render_subpass,
		VectorView<PipelineSpecializationConstant> p_specialization_constants) {
    ...
    // Input assembly.
	VkPipelineInputAssemblyStateCreateInfo input_assembly_create_info = {};
	input_assembly_create_info.sType = VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO;
	input_assembly_create_info.topology = RD_TO_VK_PRIMITIVE[p_render_primitive];
	input_assembly_create_info.primitiveRestartEnable = (p_render_primitive == RENDER_PRIMITIVE_TRIANGLE_STRIPS_WITH_RESTART_INDEX);
    ...
}
```

## The Forge

```cpp
// IGraphics.h
typedef enum PrimitiveTopology
{
    PRIMITIVE_TOPO_POINT_LIST = 0,
    PRIMITIVE_TOPO_LINE_LIST,
    PRIMITIVE_TOPO_LINE_STRIP,
    PRIMITIVE_TOPO_TRI_LIST,
    PRIMITIVE_TOPO_TRI_STRIP,
    PRIMITIVE_TOPO_PATCH_LIST,
    PRIMITIVE_TOPO_COUNT,
} PrimitiveTopology;

typedef struct GraphicsPipelineDesc
{
    ...
    PrimitiveTopology mPrimitiveTopo;
    ...
} GraphicsPipelineDesc;
```

### The Forge - D3D12

```cpp
// Direct3D12.cpp
D3D12_PRIMITIVE_TOPOLOGY_TYPE util_to_dx12_primitive_topology_type(PrimitiveTopology topology);

D3D12_PRIMITIVE_TOPOLOGY_TYPE util_to_dx12_primitive_topology_type(PrimitiveTopology topology)
{
    switch (topology)
    {
    case PRIMITIVE_TOPO_POINT_LIST:
        return D3D12_PRIMITIVE_TOPOLOGY_TYPE_POINT;
    case PRIMITIVE_TOPO_LINE_LIST:
    case PRIMITIVE_TOPO_LINE_STRIP:
        return D3D12_PRIMITIVE_TOPOLOGY_TYPE_LINE;
    case PRIMITIVE_TOPO_TRI_LIST:
    case PRIMITIVE_TOPO_TRI_STRIP:
        return D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE;
    case PRIMITIVE_TOPO_PATCH_LIST:
        return D3D12_PRIMITIVE_TOPOLOGY_TYPE_PATCH;
    default:
        return D3D12_PRIMITIVE_TOPOLOGY_TYPE_UNDEFINED;
    }
    return D3D12_PRIMITIVE_TOPOLOGY_TYPE_UNDEFINED;
}

/************************************************************************/
// Pipeline State Functions
/************************************************************************/
void addGraphicsPipeline(Renderer* pRenderer, const PipelineDesc* pMainDesc, Pipeline** ppPipeline)
{
    ...
    const GraphicsPipelineDesc* pDesc = &pMainDesc->mGraphicsDesc;
    ...
    pipeline_state_desc.PrimitiveTopologyType = util_to_dx12_primitive_topology_type(pDesc->mPrimitiveTopo);
    ...
#ifndef DISABLE_PIPELINE_LIBRARY
    if (psoCache)
    {
        ...
        psoRenderHash = tf_mem_hash<uint8_t>((uint8_t*)&pipeline_state_desc.PrimitiveTopologyType, sizeof(D3D12_PRIMITIVE_TOPOLOGY_TYPE),
                                             psoRenderHash);
        ...
    }
#endif
    ...
    D3D_PRIMITIVE_TOPOLOGY topology = D3D_PRIMITIVE_TOPOLOGY_UNDEFINED;
    switch (pDesc->mPrimitiveTopo)
    {
    case PRIMITIVE_TOPO_POINT_LIST:
        topology = D3D_PRIMITIVE_TOPOLOGY_POINTLIST;
        break;
    case PRIMITIVE_TOPO_LINE_LIST:
        topology = D3D_PRIMITIVE_TOPOLOGY_LINELIST;
        break;
    case PRIMITIVE_TOPO_LINE_STRIP:
        topology = D3D_PRIMITIVE_TOPOLOGY_LINESTRIP;
        break;
    case PRIMITIVE_TOPO_TRI_LIST:
        topology = D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST;
        break;
    case PRIMITIVE_TOPO_TRI_STRIP:
        topology = D3D_PRIMITIVE_TOPOLOGY_TRIANGLESTRIP;
        break;
    case PRIMITIVE_TOPO_PATCH_LIST:
    {
        const PipelineReflection* pReflection = pDesc->pShaderProgram->pReflection;
        uint32_t                  controlPoint = pReflection->mStageReflections[pReflection->mHullStageIndex].mNumControlPoint;
        topology = (D3D_PRIMITIVE_TOPOLOGY)(D3D_PRIMITIVE_TOPOLOGY_1_CONTROL_POINT_PATCHLIST + (controlPoint - 1));
    }
    break;

    default:
        break;
    }
    ...
}

void d3d12_cmdBindPipeline(Cmd* pCmd, Pipeline* pPipeline)
{
    ...
    if (pPipeline->mDx.mType == PIPELINE_TYPE_GRAPHICS)
    {
        ...
        pCmd->mDx.pCmdList->IASetPrimitiveTopology(pPipeline->mDx.mPrimitiveTopology);
        ...
    }
    ...
}
```

### The Forge - Vulkan

```cpp
/************************************************************************/
// Pipeline State Functions
/************************************************************************/
static void addGraphicsPipeline(Renderer* pRenderer, const PipelineDesc* pMainDesc, Pipeline** ppPipeline)
{
    ...
    const GraphicsPipelineDesc* pDesc = &pMainDesc->mGraphicsDesc;
    ...
    // Pipeline
    {
        ...
        VkPrimitiveTopology topology = VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST;
        switch (pDesc->mPrimitiveTopo)
        {
        case PRIMITIVE_TOPO_POINT_LIST:
            topology = VK_PRIMITIVE_TOPOLOGY_POINT_LIST;
            break;
        case PRIMITIVE_TOPO_LINE_LIST:
            topology = VK_PRIMITIVE_TOPOLOGY_LINE_LIST;
            break;
        case PRIMITIVE_TOPO_LINE_STRIP:
            topology = VK_PRIMITIVE_TOPOLOGY_LINE_STRIP;
            break;
        case PRIMITIVE_TOPO_TRI_STRIP:
            topology = VK_PRIMITIVE_TOPOLOGY_TRIANGLE_STRIP;
            break;
        case PRIMITIVE_TOPO_PATCH_LIST:
            topology = VK_PRIMITIVE_TOPOLOGY_PATCH_LIST;
            break;
        case PRIMITIVE_TOPO_TRI_LIST:
            topology = VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST;
            break;
        default:
            ASSERT(false && "Primitive Topo not supported!");
            break;
        }
        DECLARE_ZERO(VkPipelineInputAssemblyStateCreateInfo, ia);
        ia.sType = VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO;
        ia.pNext = NULL;
        ia.flags = 0;
        ia.topology = topology;
        ia.primitiveRestartEnable = VK_FALSE;
        ...
    }
    ...
}
```

### The Forge - Metal

```cpp
// MetalRenderer.mm
void addGraphicsPipelineImpl(Renderer* pRenderer, const char* pName, const GraphicsPipelineDesc* pDesc, Pipeline** ppPipeline)
{
    ...
    Pipeline* pPipeline = (Pipeline*)tf_calloc_memalign(1, alignof(Pipeline), sizeof(Pipeline));
    ...
    // create metal pipeline descriptor
    MTLRenderPipelineDescriptor* renderPipelineDesc = [[MTLRenderPipelineDescriptor alloc] init];
    ...
    // available on ios 12.0 and required for render_target_array_index semantics
    //  add pipeline settings to descriptor
    switch (pDesc->mPrimitiveTopo)
    {
    case PRIMITIVE_TOPO_POINT_LIST:
        renderPipelineDesc.inputPrimitiveTopology = MTLPrimitiveTopologyClassPoint;
        break;
    case PRIMITIVE_TOPO_LINE_LIST:
        renderPipelineDesc.inputPrimitiveTopology = MTLPrimitiveTopologyClassLine;
        break;
    case PRIMITIVE_TOPO_LINE_STRIP:
        renderPipelineDesc.inputPrimitiveTopology = MTLPrimitiveTopologyClassLine;
        break;
    case PRIMITIVE_TOPO_TRI_LIST:
        renderPipelineDesc.inputPrimitiveTopology = MTLPrimitiveTopologyClassTriangle;
        break;
    case PRIMITIVE_TOPO_TRI_STRIP:
        renderPipelineDesc.inputPrimitiveTopology = MTLPrimitiveTopologyClassTriangle;
        break;
    default:
        renderPipelineDesc.inputPrimitiveTopology = MTLPrimitiveTopologyClassTriangle;
        break;
    }
    ...
    switch (pDesc->mPrimitiveTopo)
    {
    case PRIMITIVE_TOPO_POINT_LIST:
        pPipeline->mPrimitiveType = (uint32_t)MTLPrimitiveTypePoint;
        break;
    case PRIMITIVE_TOPO_LINE_LIST:
        pPipeline->mPrimitiveType = (uint32_t)MTLPrimitiveTypeLine;
        break;
    case PRIMITIVE_TOPO_LINE_STRIP:
        pPipeline->mPrimitiveType = (uint32_t)MTLPrimitiveTypeLineStrip;
        break;
    case PRIMITIVE_TOPO_TRI_LIST:
        pPipeline->mPrimitiveType = (uint32_t)MTLPrimitiveTypeTriangle;
        break;
    case PRIMITIVE_TOPO_TRI_STRIP:
        pPipeline->mPrimitiveType = (uint32_t)MTLPrimitiveTypeTriangleStrip;
        break;
    default:
        pPipeline->mPrimitiveType = (uint32_t)MTLPrimitiveTypeTriangle;
        break;
    }
    ...
}
```

## O3DE

```cpp
// InputStreamLayout.h
namespace AZ::RHI
{
    //! Describes the primitive topology of an input assembly stream.
    enum class PrimitiveTopology : uint32_t
    {
        Undefined = 0,
        PointList,
        LineList,
        LineListAdj,
        LineStrip,
        LineStripAdj,
        TriangleList,
        TriangleListAdj,
        TriangleStrip,
        TriangleStripAdj,
        PatchList
    };
    ...
}
```

### O3DE - D3D12

```cpp
// Conversion.h
namespace AZ
{
    namespace DX12
    {
        class Image;
        class Buffer;

        D3D12_PRIMITIVE_TOPOLOGY_TYPE ConvertToTopologyType(RHI::PrimitiveTopology type);
        ...
    }
    ...
}

// Conversion.cpp
namespace AZ
{
    namespace DX12
    {
        ...
        D3D12_PRIMITIVE_TOPOLOGY_TYPE ConvertToTopologyType(RHI::PrimitiveTopology topology)
        {
            switch(topology)
            {
            case RHI::PrimitiveTopology::PointList:
                return D3D12_PRIMITIVE_TOPOLOGY_TYPE_POINT;
            case RHI::PrimitiveTopology::LineList:
            case RHI::PrimitiveTopology::LineStrip:
            case RHI::PrimitiveTopology::LineStripAdj:
                return D3D12_PRIMITIVE_TOPOLOGY_TYPE_LINE;
            case RHI::PrimitiveTopology::TriangleList:
            case RHI::PrimitiveTopology::TriangleListAdj:
            case RHI::PrimitiveTopology::TriangleStrip:
            case RHI::PrimitiveTopology::TriangleStripAdj:
                return D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE;
            case RHI::PrimitiveTopology::PatchList:
                return D3D12_PRIMITIVE_TOPOLOGY_TYPE_PATCH;
            case RHI::PrimitiveTopology::Undefined:
            default:
                return D3D12_PRIMITIVE_TOPOLOGY_TYPE_UNDEFINED;
            }
        }
        ...
    }
    ...
}

// PipelineState.cpp
namespace AZ
{
    namespace DX12
    {
        ...
        RHI::ResultCode PipelineState::InitInternal(
            RHI::Device& deviceBase,
            const RHI::PipelineStateDescriptorForDraw& descriptor,
            RHI::PipelineLibrary* pipelineLibraryBase)
        {
            ...
            pipelineStateDesc.PrimitiveTopologyType = ConvertToTopologyType(descriptor.m_inputStreamLayout.GetTopology());
            ...
        }
        ...
    }
    ...
}

// CommandList.cpp
namespace AZ
{
    namespace DX12
    {
        ...
        void CommandList::SetTopology(RHI::PrimitiveTopology topology)
        {
            if (m_state.m_topology != topology)
            {
                GetCommandList()->IASetPrimitiveTopology(ConvertTopology(topology));
                m_state.m_topology = topology;
            }
        }
        ...
    }
    ...
}
```

### O3DE - Vulkan

```cpp
// Conversion.h
namespace AZ
{
    namespace Vulkan
    {
        ...
        VkPrimitiveTopology ConvertTopology(RHI::PrimitiveTopology topology);
        ...
    }
    ...
}

// Conversion.cpp
namespace AZ
{
    namespace Vulkan
    {
        ...
        VkPrimitiveTopology ConvertTopology(RHI::PrimitiveTopology topology)
        {
            switch (topology)
            {
            case RHI::PrimitiveTopology::PointList:
                return VK_PRIMITIVE_TOPOLOGY_POINT_LIST;
            case RHI::PrimitiveTopology::LineList:
                return VK_PRIMITIVE_TOPOLOGY_LINE_LIST;
            case RHI::PrimitiveTopology::LineListAdj:
                return VK_PRIMITIVE_TOPOLOGY_LINE_LIST_WITH_ADJACENCY;
            case RHI::PrimitiveTopology::LineStrip:
                return VK_PRIMITIVE_TOPOLOGY_LINE_STRIP;
            case RHI::PrimitiveTopology::LineStripAdj:
                return VK_PRIMITIVE_TOPOLOGY_LINE_STRIP_WITH_ADJACENCY;
            case RHI::PrimitiveTopology::TriangleList:
                return VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST;
            case RHI::PrimitiveTopology::TriangleListAdj:
                return VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST_WITH_ADJACENCY;
            case RHI::PrimitiveTopology::TriangleStrip:
                return VK_PRIMITIVE_TOPOLOGY_TRIANGLE_STRIP;
            case RHI::PrimitiveTopology::TriangleStripAdj:
                return VK_PRIMITIVE_TOPOLOGY_TRIANGLE_STRIP_WITH_ADJACENCY;
            default:
                AZ_Assert(false, "Unknown primitive topology.");
            }
            return VK_PRIMITIVE_TOPOLOGY_POINT_LIST;
        }
        ...
    }
    ...
}

// GraphicsPipeline.cpp
namespace AZ
{
    namespace Vulkan
    {
        ...
        RHI::ResultCode GraphicsPipeline::BuildNativePipeline(const Descriptor& descriptor, const PipelineLayout& pipelineLayout)
        {
            ...
            const auto& drawDescriptor = static_cast<const RHI::PipelineStateDescriptorForDraw&>(*descriptor.m_pipelineDescritor);
            ...
            BuildPipelineInputAssemblyStateInfo(drawDescriptor.m_inputStreamLayout.GetTopology());
            ...
        }
        ...
        void GraphicsPipeline::BuildPipelineInputAssemblyStateInfo(RHI::PrimitiveTopology topology)
        {
            VkPipelineInputAssemblyStateCreateInfo& info = m_pipelineInputAssemblyStateCreateInfo;
            info = {};
            info.sType = VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO;
            info.pNext = nullptr;
            info.flags = 0;
            info.topology = ConvertTopology(topology);
            info.primitiveRestartEnable = VK_FALSE;
        }
        ...
    }
    ...
}
```

### O3DE - Metal

```cpp
// Conversion.h
namespace AZ
{
    namespace Metal
    {
        ...
        MTLPrimitiveType ConvertPrimitiveTopology(RHI::PrimitiveTopology primTopology);
        ...
    }
    ...
}

// Conversion.cpp
namespace AZ
{
    namespace Metal
    {
        ...
        MTLPrimitiveType ConvertPrimitiveTopology(RHI::PrimitiveTopology primTopology)
        {
            switch (primTopology)
            {
                case RHI::PrimitiveTopology::PointList:
                    return  MTLPrimitiveTypePoint;
                case RHI::PrimitiveTopology::LineList:
                    return MTLPrimitiveTypeLine;
                case RHI::PrimitiveTopology::LineStrip:
                    return  MTLPrimitiveTypeLineStrip;
                case RHI::PrimitiveTopology::TriangleList:
                    return MTLPrimitiveTypeTriangle;
                case RHI::PrimitiveTopology::TriangleStrip:
                    return  MTLPrimitiveTypeTriangleStrip;
                default:
                    AZ_Assert(false, "Invalid primitive topology");
                break;
            }
            return MTLPrimitiveTypePoint;
        }
        ...
    }
    ...
}

// PipelineState.cpp
namespace AZ
{
    namespace Metal
    {
        ...
        RHI::ResultCode PipelineState::InitInternal(RHI::Device& deviceBase,
                                                    const RHI::PipelineStateDescriptorForDraw& descriptor,
                                                    RHI::PipelineLibrary* pipelineLibraryBase)
        {
            ...
            //Save the primitive topology
            m_primitiveTopology = ConvertPrimitiveTopology(descriptor.m_inputStreamLayout.GetTopology());
            ...
        }
        ...
    }
    ...
}
```

## Unreal

```cpp
// RHIDefinition.h
enum class EPrimitiveTopologyType : uint8
{
	Triangle,
	Patch,
	Line,
	Point,
	//Quad,

	Num,
	NumBits = 2,
};
static_assert((uint32)EPrimitiveTopologyType::Num <= (1 << (uint32)EPrimitiveTopologyType::NumBits), "EPrimitiveTopologyType::Num will not fit on EPrimitiveTopologyType::NumBits");
```

### Unreal - D3D12

```cpp
// D3D12Util.h
FORCEINLINE_DEBUGGABLE D3D12_PRIMITIVE_TOPOLOGY_TYPE TranslatePrimitiveTopologyType(EPrimitiveTopologyType TopologyType)
{
	switch (TopologyType)
	{
	case EPrimitiveTopologyType::Triangle:	return D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE;
	case EPrimitiveTopologyType::Patch:		return D3D12_PRIMITIVE_TOPOLOGY_TYPE_PATCH;
	case EPrimitiveTopologyType::Line:		return D3D12_PRIMITIVE_TOPOLOGY_TYPE_LINE;
	case EPrimitiveTopologyType::Point:		return D3D12_PRIMITIVE_TOPOLOGY_TYPE_POINT;
	default:
		ensure(0);
		return D3D12_PRIMITIVE_TOPOLOGY_TYPE_UNDEFINED;
	}
}

FORCEINLINE_DEBUGGABLE D3D_PRIMITIVE_TOPOLOGY TranslatePrimitiveType(EPrimitiveType PrimitiveType)
{
	switch (PrimitiveType)
	{
	case PT_TriangleList:				return D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST;
	case PT_TriangleStrip:				return D3D11_PRIMITIVE_TOPOLOGY_TRIANGLESTRIP;
	case PT_LineList:					return D3D_PRIMITIVE_TOPOLOGY_LINELIST;
	case PT_PointList:					return D3D_PRIMITIVE_TOPOLOGY_POINTLIST;
	#if defined(D3D12RHI_PRIMITIVE_TOPOLOGY_RECTLIST)
		case PT_RectList:				return D3D12RHI_PRIMITIVE_TOPOLOGY_RECTLIST;
	#endif

	default:
		ensure(0);
		return D3D_PRIMITIVE_TOPOLOGY_UNDEFINED;
	}
}

FORCEINLINE_DEBUGGABLE D3D12_PRIMITIVE_TOPOLOGY_TYPE D3D12PrimitiveTypeToTopologyType(D3D_PRIMITIVE_TOPOLOGY PrimitiveType)
{
	switch (PrimitiveType)
	{
	case D3D_PRIMITIVE_TOPOLOGY_POINTLIST:
		return D3D12_PRIMITIVE_TOPOLOGY_TYPE_POINT;

	case D3D_PRIMITIVE_TOPOLOGY_LINELIST:
	case D3D_PRIMITIVE_TOPOLOGY_LINESTRIP:
	case D3D_PRIMITIVE_TOPOLOGY_LINELIST_ADJ:
	case D3D_PRIMITIVE_TOPOLOGY_LINESTRIP_ADJ:
		return D3D12_PRIMITIVE_TOPOLOGY_TYPE_LINE;

	case D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST:
	case D3D_PRIMITIVE_TOPOLOGY_TRIANGLESTRIP:
	case D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST_ADJ:
	case D3D_PRIMITIVE_TOPOLOGY_TRIANGLESTRIP_ADJ:
		return D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE;

	#if defined(D3D12RHI_PRIMITIVE_TOPOLOGY_RECTLIST)
		case D3D12RHI_PRIMITIVE_TOPOLOGY_RECTLIST:
			return D3D12RHI_PRIMITIVE_TOPOLOGY_TYPE_RECT;
	#endif

	case D3D_PRIMITIVE_TOPOLOGY_UNDEFINED:
		return D3D12_PRIMITIVE_TOPOLOGY_TYPE_UNDEFINED;

	default:
		return D3D12_PRIMITIVE_TOPOLOGY_TYPE_PATCH;
	}
}

// D3D12PipelineState.cpp
static FD3D12LowLevelGraphicsPipelineStateDesc GetLowLevelGraphicsPipelineStateDesc(const FGraphicsPipelineStateInitializer& Initializer, const FD3D12RootSignature* RootSignature)
{
    ...
	Desc.Desc.PrimitiveTopologyType = D3D12PrimitiveTypeToTopologyType(TranslatePrimitiveType(Initializer.PrimitiveType));
    ...
}

// D3D12StateCache.cpp
void FD3D12StateCache::ApplyState(ED3D12PipelineType PipelineType)
{
    ...
	if (PipelineType == ED3D12PipelineType::Graphics)
	{
        ...
		if (bNeedSetPrimitiveTopology)
		{
			bNeedSetPrimitiveTopology = false;
			CmdContext.GraphicsCommandList()->IASetPrimitiveTopology(PipelineState.Graphics.CurrentPrimitiveTopology);
		}
        ...
    }
    ...
}
...
void FD3D12StateCache::SetGraphicsPipelineState(FD3D12GraphicsPipelineState* GraphicsPipelineState)
{
    ...
	if (bForceSet || CurrentGraphicsPipelineState != GraphicsPipelineState)
	{
        ...
		EPrimitiveType PrimitiveType = GraphicsPipelineState->PipelineStateInitializer.PrimitiveType;
		if (PipelineState.Graphics.CurrentPrimitiveType != PrimitiveType)
		{
			PipelineState.Graphics.CurrentPrimitiveType = PrimitiveType;
			PipelineState.Graphics.CurrentPrimitiveTopology = GetD3D12PrimitiveType(PrimitiveType);
			bNeedSetPrimitiveTopology = true;

			static_assert(PT_Num == 6, "This computation needs to be updated, matching that of GetVertexCountForPrimitiveCount()");
			PipelineState.Graphics.PrimitiveTypeFactor = (PrimitiveType == PT_TriangleList) ? 3 : (PrimitiveType == PT_LineList) ? 2 : (PrimitiveType == PT_RectList) ? 3 : 1;
			PipelineState.Graphics.PrimitiveTypeOffset = (PrimitiveType == PT_TriangleStrip) ? 2 : 0;
		}
        ...
    }
    ...
}

// D3D12StateCachePrivate.cpp
static inline D3D_PRIMITIVE_TOPOLOGY GetD3D12PrimitiveType(uint32 PrimitiveType)
{
	static const uint8 D3D12PrimitiveType[] =
	{
		D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST,               // PT_TriangleList
		D3D_PRIMITIVE_TOPOLOGY_TRIANGLESTRIP,              // PT_TriangleStrip
		D3D_PRIMITIVE_TOPOLOGY_LINELIST,                   // PT_LineList
		0,                                                 // PT_QuadList
		D3D_PRIMITIVE_TOPOLOGY_POINTLIST,                  // PT_PointList
#if defined(D3D12RHI_PRIMITIVE_TOPOLOGY_RECTLIST)          // PT_RectList
		D3D_PRIMITIVE_TOPOLOGY_RECTLIST,
#else
		0,
#endif
	};
	static_assert(UE_ARRAY_COUNT(D3D12PrimitiveType) == PT_Num, "Primitive lookup table is wrong size");

	D3D_PRIMITIVE_TOPOLOGY D3DType = (D3D_PRIMITIVE_TOPOLOGY) D3D12PrimitiveType[PrimitiveType];
	checkf(D3DType, TEXT("Unknown primitive type: %u"), PrimitiveType);
	return D3DType;
}
```

### Unreal - Vulkan

```cpp
// VulkanPipeline.cpp
bool FVulkanPipelineStateCacheManager::CreateGfxPipelineFromEntry(FVulkanRHIGraphicsPipelineState* PSO, FVulkanShader* Shaders[ShaderStage::NumStages], bool bPrecompile)
{
    ...
	FGfxPipelineDesc* GfxEntry = &PSO->Desc;
    ...
	VkPipelineInputAssemblyStateCreateInfo InputAssembly;
	ZeroVulkanStruct(InputAssembly, VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO);
	InputAssembly.topology = (VkPrimitiveTopology)GfxEntry->Topology;
    ...
}

static inline VkPrimitiveTopology UEToVulkanTopologyType(const FVulkanDevice* InDevice, EPrimitiveType PrimitiveType, uint16& OutControlPoints)
{
	OutControlPoints = 0;
	switch (PrimitiveType)
	{
	case PT_PointList:
		return VK_PRIMITIVE_TOPOLOGY_POINT_LIST;
	case PT_LineList:
		return VK_PRIMITIVE_TOPOLOGY_LINE_LIST;
	case PT_TriangleList:
		return VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST;
	case PT_TriangleStrip:
		return VK_PRIMITIVE_TOPOLOGY_TRIANGLE_STRIP;
	default:
		checkf(false, TEXT("Unsupported EPrimitiveType %d"), (uint32)PrimitiveType);
		break;
	}

	return VK_PRIMITIVE_TOPOLOGY_MAX_ENUM;
}

void FVulkanPipelineStateCacheManager::CreateGfxEntry(const FGraphicsPipelineStateInitializer& PSOInitializer, FVulkanDescriptorSetsLayoutInfo& DescriptorSetLayoutInfo, FGfxPipelineDesc* Desc)
{
    ...
	OutGfxEntry->Topology = (uint32)UEToVulkanTopologyType(Device, PSOInitializer.PrimitiveType, OutGfxEntry->ControlPoints);
    ...
}
```