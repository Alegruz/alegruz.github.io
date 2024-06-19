# Vertex Input Layout Survey (2024.06.18)

[Home](/)

# Vertex Input Layout

## Graphics API

### D3D12

```cpp
typedef struct D3D12_INPUT_LAYOUT_DESC {
  const D3D12_INPUT_ELEMENT_DESC *pInputElementDescs;
  UINT                           NumElements;
} D3D12_INPUT_LAYOUT_DESC;

typedef struct D3D12_GRAPHICS_PIPELINE_STATE_DESC {
  ...
  D3D12_INPUT_LAYOUT_DESC            InputLayout;
  ...
} D3D12_GRAPHICS_PIPELINE_STATE_DESC;
```

### Vulkan

```cpp
// Provided by VK_VERSION_1_0
typedef struct VkPipelineVertexInputStateCreateInfo {
    VkStructureType                             sType;
    const void*                                 pNext;
    VkPipelineVertexInputStateCreateFlags       flags;
    uint32_t                                    vertexBindingDescriptionCount;
    const VkVertexInputBindingDescription*      pVertexBindingDescriptions;
    uint32_t                                    vertexAttributeDescriptionCount;
    const VkVertexInputAttributeDescription*    pVertexAttributeDescriptions;
} VkPipelineVertexInputStateCreateInfo;

// Provided by VK_VERSION_1_0
typedef struct VkGraphicsPipelineCreateInfo {
    ...
    const VkPipelineVertexInputStateCreateInfo*      pVertexInputState;
    ...
} VkGraphicsPipelineCreateInfo;
```

## Godot Engine

### Godot Engine - D3D12

```cpp
// rendering_device_driver_d3d12.h
class RenderingDeviceDriverD3D12 : public RenderingDeviceDriver {
    ...
	struct VertexFormatInfo {
		TightLocalVector<D3D12_INPUT_ELEMENT_DESC> input_elem_descs;
		TightLocalVector<UINT> vertex_buffer_strides;
	};
    ...
}

// rendering_device_driver_d3d12.cpp
/**********************/
/**** VERTEX ARRAY ****/
/**********************/

RDD::VertexFormatID RenderingDeviceDriverD3D12::vertex_format_create(VectorView<VertexAttribute> p_vertex_attribs) {
	VertexFormatInfo *vf_info = VersatileResource::allocate<VertexFormatInfo>(resources_allocator);

	vf_info->input_elem_descs.resize(p_vertex_attribs.size());
	vf_info->vertex_buffer_strides.resize(p_vertex_attribs.size());
	for (uint32_t i = 0; i < p_vertex_attribs.size(); i++) {
		vf_info->input_elem_descs[i] = {};
		vf_info->input_elem_descs[i].SemanticName = "TEXCOORD";
		vf_info->input_elem_descs[i].SemanticIndex = p_vertex_attribs[i].location;
		vf_info->input_elem_descs[i].Format = RD_TO_D3D12_FORMAT[p_vertex_attribs[i].format].general_format;
		vf_info->input_elem_descs[i].InputSlot = i; // TODO: Can the same slot be used if data comes from the same buffer (regardless format)?
		vf_info->input_elem_descs[i].AlignedByteOffset = p_vertex_attribs[i].offset;
		if (p_vertex_attribs[i].frequency == VERTEX_FREQUENCY_INSTANCE) {
			vf_info->input_elem_descs[i].InputSlotClass = D3D12_INPUT_CLASSIFICATION_PER_INSTANCE_DATA;
			vf_info->input_elem_descs[i].InstanceDataStepRate = 1;
		} else {
			vf_info->input_elem_descs[i].InputSlotClass = D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA;
			vf_info->input_elem_descs[i].InstanceDataStepRate = 0;
		}

		vf_info->vertex_buffer_strides[i] = p_vertex_attribs[i].stride;
	}

	return VertexFormatID(vf_info);
}

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
	// Vertex.
	if (p_vertex_format) {
		const VertexFormatInfo *vf_info = (const VertexFormatInfo *)p_vertex_format.id;
		(&pipeline_desc.InputLayout)->pInputElementDescs = vf_info->input_elem_descs.ptr();
		(&pipeline_desc.InputLayout)->NumElements = vf_info->input_elem_descs.size();
		pso_extra_info.vf_info = vf_info;
	}
    ...
}
```

### Godot Engine - Vulkan

```cpp
// rendering_device_driver_vulkan.h
class RenderingDeviceDriverVulkan : public RenderingDeviceDriver {
    ...
	/**********************/
	/**** VERTEX ARRAY ****/
	/**********************/
private:
	struct VertexFormatInfo {
		TightLocalVector<VkVertexInputBindingDescription> vk_bindings;
		TightLocalVector<VkVertexInputAttributeDescription> vk_attributes;
		VkPipelineVertexInputStateCreateInfo vk_create_info = {};
	};
    ...
}

// rendering_device_driver_vulkan.cpp
/**********************/
/**** VERTEX ARRAY ****/
/**********************/

RDD::VertexFormatID RenderingDeviceDriverVulkan::vertex_format_create(VectorView<VertexAttribute> p_vertex_attribs) {
	// Pre-bookkeep.
	VertexFormatInfo *vf_info = VersatileResource::allocate<VertexFormatInfo>(resources_allocator);

	vf_info->vk_bindings.resize(p_vertex_attribs.size());
	vf_info->vk_attributes.resize(p_vertex_attribs.size());
	for (uint32_t i = 0; i < p_vertex_attribs.size(); i++) {
		vf_info->vk_bindings[i] = {};
		vf_info->vk_bindings[i].binding = i;
		vf_info->vk_bindings[i].stride = p_vertex_attribs[i].stride;
		vf_info->vk_bindings[i].inputRate = p_vertex_attribs[i].frequency == VERTEX_FREQUENCY_INSTANCE ? VK_VERTEX_INPUT_RATE_INSTANCE : VK_VERTEX_INPUT_RATE_VERTEX;
		vf_info->vk_attributes[i] = {};
		vf_info->vk_attributes[i].binding = i;
		vf_info->vk_attributes[i].location = p_vertex_attribs[i].location;
		vf_info->vk_attributes[i].format = RD_TO_VK_FORMAT[p_vertex_attribs[i].format];
		vf_info->vk_attributes[i].offset = p_vertex_attribs[i].offset;
	}

	vf_info->vk_create_info = {};
	vf_info->vk_create_info.sType = VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO;
	vf_info->vk_create_info.vertexBindingDescriptionCount = vf_info->vk_bindings.size();
	vf_info->vk_create_info.pVertexBindingDescriptions = vf_info->vk_bindings.ptr();
	vf_info->vk_create_info.vertexAttributeDescriptionCount = vf_info->vk_attributes.size();
	vf_info->vk_create_info.pVertexAttributeDescriptions = vf_info->vk_attributes.ptr();

	return VertexFormatID(vf_info);
}
...
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
	// Vertex.
	const VkPipelineVertexInputStateCreateInfo *vertex_input_state_create_info = nullptr;
	if (p_vertex_format.id) {
		const VertexFormatInfo *vf_info = (const VertexFormatInfo *)p_vertex_format.id;
		vertex_input_state_create_info = &vf_info->vk_create_info;
	} else {
		VkPipelineVertexInputStateCreateInfo *null_vertex_input_state = ALLOCA_SINGLE(VkPipelineVertexInputStateCreateInfo);
		*null_vertex_input_state = {};
		null_vertex_input_state->sType = VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO;
		vertex_input_state_create_info = null_vertex_input_state;
	}
    ...
	pipeline_create_info.pVertexInputState = vertex_input_state_create_info;
    ...
}
```

## The Forge

```cpp
// IGraphics.h
typedef enum ShaderSemantic
{
    SEMANTIC_UNDEFINED = 0,
    SEMANTIC_POSITION,
    SEMANTIC_NORMAL,
    SEMANTIC_COLOR,
    SEMANTIC_TANGENT,
    SEMANTIC_BITANGENT,
    SEMANTIC_JOINTS,
    SEMANTIC_WEIGHTS,
    SEMANTIC_CUSTOM,
    SEMANTIC_TEXCOORD0,
    SEMANTIC_TEXCOORD1,
    SEMANTIC_TEXCOORD2,
    SEMANTIC_TEXCOORD3,
    SEMANTIC_TEXCOORD4,
    SEMANTIC_TEXCOORD5,
    SEMANTIC_TEXCOORD6,
    SEMANTIC_TEXCOORD7,
    SEMANTIC_TEXCOORD8,
    SEMANTIC_TEXCOORD9,
    MAX_SEMANTICS
} ShaderSemantic;
...
typedef struct VertexAttrib
{
    ShaderSemantic  mSemantic;
    uint32_t        mSemanticNameLength;
    char            mSemanticName[MAX_SEMANTIC_NAME_LENGTH];
    TinyImageFormat mFormat;
    uint32_t        mBinding;
    uint32_t        mLocation;
    uint32_t        mOffset;
} VertexAttrib;
```

### The Forge - D3D12

```cpp
// Direct3D12.cpp
/************************************************************************/
// Pipeline State Functions
/************************************************************************/
void addGraphicsPipeline(Renderer* pRenderer, const PipelineDesc* pMainDesc, Pipeline** ppPipeline)
{
    ...
    uint32_t input_elementCount = 0;
    DECLARE_ZERO(D3D12_INPUT_ELEMENT_DESC, input_elements[MAX_VERTEX_ATTRIBS]);

    DECLARE_ZERO(char, semantic_names[MAX_VERTEX_ATTRIBS][MAX_SEMANTIC_NAME_LENGTH]);
    // Make sure there's attributes
    if (pVertexLayout != NULL)
    {
        ASSERT(pVertexLayout->mAttribCount && pVertexLayout->mBindingCount);

        for (uint32_t attrib_index = 0; attrib_index < pVertexLayout->mAttribCount; ++attrib_index)
        {
            const VertexAttrib* attrib = &(pVertexLayout->mAttribs[attrib_index]);

            ASSERT(SEMANTIC_UNDEFINED != attrib->mSemantic);
            ASSERT(attrib->mBinding < pVertexLayout->mBindingCount);

            if (attrib->mSemanticNameLength > 0)
            {
                uint32_t name_length = min((uint32_t)MAX_SEMANTIC_NAME_LENGTH, attrib->mSemanticNameLength);
                strncpy_s(semantic_names[attrib_index], attrib->mSemanticName, name_length);
            }
            else
            {
                switch (attrib->mSemantic)
                {
                case SEMANTIC_POSITION:
                    strcpy_s(semantic_names[attrib_index], "POSITION");
                    break;
                case SEMANTIC_NORMAL:
                    strcpy_s(semantic_names[attrib_index], "NORMAL");
                    break;
                case SEMANTIC_COLOR:
                    strcpy_s(semantic_names[attrib_index], "COLOR");
                    break;
                case SEMANTIC_TANGENT:
                    strcpy_s(semantic_names[attrib_index], "TANGENT");
                    break;
                case SEMANTIC_BITANGENT:
                    strcpy_s(semantic_names[attrib_index], "BITANGENT");
                    break;
                case SEMANTIC_JOINTS:
                    strcpy_s(semantic_names[attrib_index], "JOINTS");
                    break;
                case SEMANTIC_WEIGHTS:
                    strcpy_s(semantic_names[attrib_index], "WEIGHTS");
                    break;
                case SEMANTIC_CUSTOM:
                    strcpy_s(semantic_names[attrib_index], "CUSTOM");
                    break;
                case SEMANTIC_TEXCOORD0:
                case SEMANTIC_TEXCOORD1:
                case SEMANTIC_TEXCOORD2:
                case SEMANTIC_TEXCOORD3:
                case SEMANTIC_TEXCOORD4:
                case SEMANTIC_TEXCOORD5:
                case SEMANTIC_TEXCOORD6:
                case SEMANTIC_TEXCOORD7:
                case SEMANTIC_TEXCOORD8:
                case SEMANTIC_TEXCOORD9:
                    strcpy_s(semantic_names[attrib_index], "TEXCOORD");
                    break;
                default:
                    ASSERT(false);
                    break;
                }
            }

            UINT semantic_index = 0;
            switch (attrib->mSemantic)
            {
            case SEMANTIC_TEXCOORD0:
                semantic_index = 0;
                break;
            case SEMANTIC_TEXCOORD1:
                semantic_index = 1;
                break;
            case SEMANTIC_TEXCOORD2:
                semantic_index = 2;
                break;
            case SEMANTIC_TEXCOORD3:
                semantic_index = 3;
                break;
            case SEMANTIC_TEXCOORD4:
                semantic_index = 4;
                break;
            case SEMANTIC_TEXCOORD5:
                semantic_index = 5;
                break;
            case SEMANTIC_TEXCOORD6:
                semantic_index = 6;
                break;
            case SEMANTIC_TEXCOORD7:
                semantic_index = 7;
                break;
            case SEMANTIC_TEXCOORD8:
                semantic_index = 8;
                break;
            case SEMANTIC_TEXCOORD9:
                semantic_index = 9;
                break;
            default:
                break;
            }

            input_elements[input_elementCount].SemanticName = semantic_names[attrib_index];
            input_elements[input_elementCount].SemanticIndex = semantic_index;

            input_elements[input_elementCount].Format = (DXGI_FORMAT)TinyImageFormat_ToDXGI_FORMAT(attrib->mFormat);
            input_elements[input_elementCount].InputSlot = attrib->mBinding;
            input_elements[input_elementCount].AlignedByteOffset = attrib->mOffset;
            if (pVertexLayout->mBindings[attrib->mBinding].mRate == VERTEX_BINDING_RATE_INSTANCE)
            {
                input_elements[input_elementCount].InputSlotClass = D3D12_INPUT_CLASSIFICATION_PER_INSTANCE_DATA;
                input_elements[input_elementCount].InstanceDataStepRate = 1;
            }
            else
            {
                input_elements[input_elementCount].InputSlotClass = D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA;
                input_elements[input_elementCount].InstanceDataStepRate = 0;
            }

#ifndef DISABLE_PIPELINE_LIBRARY
            if (psoCache)
            {
                psoRenderHash = tf_mem_hash<uint8_t>((uint8_t*)&attrib->mSemantic, sizeof(ShaderSemantic), psoRenderHash);
                psoRenderHash = tf_mem_hash<uint8_t>((uint8_t*)&attrib->mFormat, sizeof(TinyImageFormat), psoRenderHash);
                psoRenderHash = tf_mem_hash<uint8_t>((uint8_t*)&attrib->mBinding, sizeof(uint32_t), psoRenderHash);
                psoRenderHash = tf_mem_hash<uint8_t>((uint8_t*)&attrib->mLocation, sizeof(uint32_t), psoRenderHash);
                psoRenderHash = tf_mem_hash<uint8_t>((uint8_t*)&attrib->mOffset, sizeof(uint32_t), psoRenderHash);
                psoRenderHash = tf_mem_hash<uint8_t>((uint8_t*)&pVertexLayout->mBindings[attrib->mBinding].mRate, sizeof(VertexBindingRate),
                                                     psoRenderHash);
            }
#endif

            ++input_elementCount;
        }
    }

    DECLARE_ZERO(D3D12_INPUT_LAYOUT_DESC, input_layout_desc);
    input_layout_desc.pInputElementDescs = input_elementCount ? input_elements : NULL;
    input_layout_desc.NumElements = input_elementCount;
    ...
}
```

### The Forge - Vulkan

```cpp
// Vulkan.cpp
/************************************************************************/
// Pipeline State Functions
/************************************************************************/
static void addGraphicsPipeline(Renderer* pRenderer, const PipelineDesc* pMainDesc, Pipeline** ppPipeline)
{
    ...
    // Pipeline
    {
        ...
        VkVertexInputBindingDescription   inputBindings[MAX_VERTEX_BINDINGS] = { { 0 } };
        VkVertexInputAttributeDescription inputAttributes[MAX_VERTEX_ATTRIBS] = { { 0 } };

        DECLARE_ZERO(VkPipelineVertexInputStateCreateInfo, vi);
        vi.sType = VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO;
        vi.pNext = NULL;
        vi.flags = 0;
        vi.pVertexBindingDescriptions = inputBindings;
        vi.pVertexAttributeDescriptions = inputAttributes;

        // Make sure there's attributes
        if (pVertexLayout != NULL)
        {
            // Ignore everything that's beyond max_vertex_attribs
            uint32_t attribCount = pVertexLayout->mAttribCount > MAX_VERTEX_ATTRIBS ? MAX_VERTEX_ATTRIBS : pVertexLayout->mAttribCount;
            uint32_t bindingCount = pVertexLayout->mBindingCount > MAX_VERTEX_BINDINGS ? MAX_VERTEX_BINDINGS : pVertexLayout->mBindingCount;

            ASSERT(attribCount && bindingCount);

            // Bindings
            for (uint32_t b = 0; b < bindingCount; ++b)
            {
                const VertexBinding*             vertexBinding = &pVertexLayout->mBindings[b];
                VkVertexInputBindingDescription* inputBinding = &inputBindings[b];

                // init binding
                inputBinding->binding = b;
                if (vertexBinding->mRate == VERTEX_BINDING_RATE_INSTANCE)
                {
                    inputBinding->inputRate = VK_VERTEX_INPUT_RATE_INSTANCE;
                }
                else
                {
                    inputBinding->inputRate = VK_VERTEX_INPUT_RATE_VERTEX;
                }

                inputBinding->stride = vertexBinding->mStride;
            }

            // Attributes
            for (uint32_t i = 0; i < attribCount; ++i)
            {
                const VertexAttrib*  attrib = &pVertexLayout->mAttribs[i];
                const VertexBinding* vertexBinding = &pVertexLayout->mBindings[attrib->mBinding];
                inputAttributes[i].location = attrib->mLocation;
                inputAttributes[i].binding = attrib->mBinding;
                inputAttributes[i].format = (VkFormat)TinyImageFormat_ToVkFormat(attrib->mFormat);
                inputAttributes[i].offset = attrib->mOffset;

                // update binding stride if necessary
                if (!vertexBinding->mStride)
                {
                    // guessing stride using attribute offset in case there are several attributes at the same binding
                    VkVertexInputBindingDescription* inputBinding = &inputBindings[attrib->mBinding];
                    inputBinding->stride = max(attrib->mOffset + TinyImageFormat_BitSizeOfBlock(attrib->mFormat) / 8, inputBinding->stride);
                }
            }

            vi.vertexBindingDescriptionCount = pVertexLayout->mBindingCount;
            vi.vertexAttributeDescriptionCount = pVertexLayout->mAttribCount;
        }
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
    // create metal pipeline descriptor
    MTLRenderPipelineDescriptor* renderPipelineDesc = [[MTLRenderPipelineDescriptor alloc] init];
    ...
    // add vertex layout to descriptor
    if (pDesc->pVertexLayout)
    {
        // setup vertex bindings
        for (uint32_t b = 0; b < pDesc->pVertexLayout->mBindingCount; ++b)
        {
            const VertexBinding* binding = pDesc->pVertexLayout->mBindings + b;
            // #NOTE: Buffer index starts at 30 and decrements based on binding
            // Example: If attrib->mBinding is 3, bufferIndex will be 27
            const uint32_t       bufferIndex = VERTEX_BINDING_OFFSET - b;

            renderPipelineDesc.vertexDescriptor.layouts[bufferIndex].stride = binding->mStride;
            renderPipelineDesc.vertexDescriptor.layouts[bufferIndex].stepRate = 1;

            if (pDesc->pShaderProgram->mTessellation)
            {
                renderPipelineDesc.vertexDescriptor.layouts[bufferIndex].stepFunction = MTLVertexStepFunctionPerPatchControlPoint;
            }
            else if (VERTEX_BINDING_RATE_INSTANCE == binding->mRate)
            {
                renderPipelineDesc.vertexDescriptor.layouts[bufferIndex].stepFunction = MTLVertexStepFunctionPerInstance;
            }
            else
            {
                renderPipelineDesc.vertexDescriptor.layouts[bufferIndex].stepFunction = MTLVertexStepFunctionPerVertex;
            }
        }

        // setup vertex attributes
        for (uint32_t i = 0; i < pDesc->pVertexLayout->mAttribCount; ++i)
        {
            const VertexAttrib*  attrib = pDesc->pVertexLayout->mAttribs + i;
            const VertexBinding* binding = &pDesc->pVertexLayout->mBindings[attrib->mBinding];
            const uint32_t       bufferIndex = VERTEX_BINDING_OFFSET - attrib->mBinding;

            renderPipelineDesc.vertexDescriptor.attributes[attrib->mLocation].offset = attrib->mOffset;
            renderPipelineDesc.vertexDescriptor.attributes[attrib->mLocation].bufferIndex = bufferIndex;
            renderPipelineDesc.vertexDescriptor.attributes[attrib->mLocation].format = util_to_mtl_vertex_format(attrib->mFormat);

            // update binding stride if necessary
            if (!binding->mStride)
            {
                // guessing stride using attribute offset in case there are several attributes at the same binding
                const uint32_t currentStride = (uint32_t)renderPipelineDesc.vertexDescriptor.layouts[bufferIndex].stride;
                renderPipelineDesc.vertexDescriptor.layouts[bufferIndex].stride =
                    max(attrib->mOffset + TinyImageFormat_BitSizeOfBlock(attrib->mFormat) / 8, currentStride);
            }
        }
    }
    ...
}
```

## O3DE

### O3DE - D3D12

```cpp
// Conversions.h
namespace AZ
{
    namespace DX12
    {
        ...
        AZStd::vector<D3D12_INPUT_ELEMENT_DESC> ConvertInputElements(const RHI::InputStreamLayout& layout);
        ...
    }
    ...
}

// Conversions.cpp
namespace AZ
{
    namespace DX12
    {
        ...
        AZStd::vector<D3D12_INPUT_ELEMENT_DESC> ConvertInputElements(const RHI::InputStreamLayout& layout)
        {
            AZStd::vector<D3D12_INPUT_ELEMENT_DESC> result;
            result.reserve(layout.GetStreamChannels().size());

            for (size_t i = 0; i < layout.GetStreamChannels().size(); ++i)
            {
                const RHI::StreamChannelDescriptor& channel = layout.GetStreamChannels()[i];
                const RHI::StreamBufferDescriptor& buffer = layout.GetStreamBuffers()[channel.m_bufferIndex];

                result.emplace_back();

                D3D12_INPUT_ELEMENT_DESC& desc = result.back();
                desc.SemanticName = channel.m_semantic.m_name.GetCStr();
                desc.SemanticIndex = channel.m_semantic.m_index;
                desc.AlignedByteOffset = channel.m_byteOffset;
                desc.InputSlot = channel.m_bufferIndex;
                desc.InputSlotClass = (buffer.m_stepFunction == RHI::StreamStepFunction::PerVertex) ? D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA : D3D12_INPUT_CLASSIFICATION_PER_INSTANCE_DATA;
                desc.InstanceDataStepRate = (buffer.m_stepFunction != RHI::StreamStepFunction::PerVertex) ? buffer.m_stepRate : 0;
                desc.Format = ConvertFormat(channel.m_format);
            }

            return result;
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
            AZStd::vector<D3D12_INPUT_ELEMENT_DESC> inputElements = ConvertInputElements(descriptor.m_inputStreamLayout);
            pipelineStateDesc.InputLayout.NumElements = uint32_t(inputElements.size());
            pipelineStateDesc.InputLayout.pInputElementDescs = inputElements.data();
            pipelineStateDesc.PrimitiveTopologyType = ConvertToTopologyType(descriptor.m_inputStreamLayout.GetTopology());
            ...
        }
        ...
    }
    ...
}
```

### O3DE - Vulkan

```cpp
// GraphicsPipeline.h
namespace AZ
{
    namespace Vulkan
    {
        ...
        class GraphicsPipeline final
            : public Pipeline
        {
            ...
            VkPipelineVertexInputStateCreateInfo m_pipelineVertexInputStateCreateInfo{};
            ...
        };
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
        void GraphicsPipeline::BuildPipelineVertexInputStateCreateInfo(const RHI::InputStreamLayout& inputStreamLayout)
        {
            const auto& streamChannels = inputStreamLayout.GetStreamChannels();
            m_vertexInputAttributeDescriptions.resize(streamChannels.size());
            for (uint32_t index = 0; index < streamChannels.size(); ++index)
            {
                FillVertexInputAttributeDescription(inputStreamLayout, index, m_vertexInputAttributeDescriptions[index]);
            }

            const auto& streamBuffers = inputStreamLayout.GetStreamBuffers();
            m_vertexInputBindingDescriptions.resize(streamBuffers.size());
            for (uint32_t index = 0; index < streamBuffers.size(); ++index)
            {
                FillVertexInputBindingDescription(inputStreamLayout, index, m_vertexInputBindingDescriptions[index]);
            }

            VkPipelineVertexInputStateCreateInfo& createInfo = m_pipelineVertexInputStateCreateInfo;
            createInfo.sType = VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO;
            createInfo.pNext = nullptr;
            createInfo.flags = 0;
            createInfo.vertexBindingDescriptionCount = static_cast<uint32_t>(m_vertexInputBindingDescriptions.size());
            createInfo.pVertexBindingDescriptions = m_vertexInputBindingDescriptions.empty() ? nullptr : m_vertexInputBindingDescriptions.data();
            createInfo.vertexAttributeDescriptionCount = static_cast<uint32_t>(m_vertexInputAttributeDescriptions.size());
            createInfo.pVertexAttributeDescriptions = m_vertexInputAttributeDescriptions.empty() ? nullptr : m_vertexInputAttributeDescriptions.data();
        }
        ...
    }
    ...
}
```

### O3DE - Metal

```cpp
// Conversions.h
namespace AZ
{
    namespace Metal
    {
        ...
        MTLVertexFormat ConvertVertexFormat(RHI::Format format);
        ...
        void ConvertInputElements(const RHI::InputStreamLayout& layout, MTLVertexDescriptor * vertDesc);
        ...
    }
    ...
}

// Conversions.cpp
namespace AZ
{
    namespace Metal
    {
        ...
        MTLVertexFormat ConvertVertexFormat(RHI::Format format)
        {
            switch (format)
            {
                case RHI::Format::R32G32B32A32_FLOAT:
                    return MTLVertexFormatFloat4;
                case RHI::Format::R32G32B32A32_UINT:
                    return MTLVertexFormatUInt4;
                case RHI::Format::R32G32B32A32_SINT:
                    return MTLVertexFormatInt4;
                case RHI::Format::R32G32B32_FLOAT:
                    return MTLVertexFormatFloat3;
                case RHI::Format::R32G32B32_UINT:
                    return MTLVertexFormatUInt3;
                case RHI::Format::R32G32B32_SINT:
                    return MTLVertexFormatInt3;
                case RHI::Format::R16G16B16A16_FLOAT:
                    return MTLVertexFormatHalf4;
                case RHI::Format::R16G16B16A16_UNORM:
                    return MTLVertexFormatUShort4Normalized;
                case RHI::Format::R16G16B16A16_UINT:
                    return MTLVertexFormatUShort4;
                case RHI::Format::R16G16B16A16_SNORM:
                    return MTLVertexFormatShort4Normalized;
                case RHI::Format::R16G16B16A16_SINT:
                    return MTLVertexFormatShort4;
                case RHI::Format::R32G32_FLOAT:
                    return MTLVertexFormatFloat2;
                case RHI::Format::R32G32_UINT:
                    return MTLVertexFormatUInt2;
                case RHI::Format::R32G32_SINT:
                    return MTLVertexFormatInt2;
                case RHI::Format::R10G10B10A2_UNORM:
                    return MTLVertexFormatUInt1010102Normalized;
                case RHI::Format::R8G8B8A8_UNORM:
                    return MTLVertexFormatUChar4Normalized;
                case RHI::Format::R8G8B8A8_UNORM_SRGB:
                    return MTLVertexFormatUChar4Normalized;
                case RHI::Format::R8G8B8A8_UINT:
                    return MTLVertexFormatUChar4;
                case RHI::Format::R8G8B8A8_SNORM:
                    return MTLVertexFormatChar4Normalized;
                case RHI::Format::R8G8B8A8_SINT:
                    return MTLVertexFormatChar4;
                case RHI::Format::R16G16_FLOAT:
                    return MTLVertexFormatHalf2;
                case RHI::Format::R16G16_UNORM:
                    return MTLVertexFormatUShort2Normalized;
                case RHI::Format::R16G16_UINT:
                    return MTLVertexFormatUShort2;
                case RHI::Format::R16G16_SNORM:
                    return MTLVertexFormatShort2Normalized;
                case RHI::Format::R16G16_SINT:
                    return MTLVertexFormatShort2;
                case RHI::Format::R32_FLOAT:
                    return MTLVertexFormatFloat;
                case RHI::Format::R32_UINT:
                    return MTLVertexFormatUInt;
                case RHI::Format::R32_SINT:
                    return MTLVertexFormatInt;
                case RHI::Format::D24_UNORM_S8_UINT:
                    return MTLVertexFormatUInt;
                case RHI::Format::R8G8_UNORM:
                    return MTLVertexFormatUChar2Normalized;
                case RHI::Format::R8G8_UINT:
                    return MTLVertexFormatUChar2;
                case RHI::Format::R8G8_SNORM:
                    return MTLVertexFormatChar2Normalized;
                case RHI::Format::R8G8_SINT:
                    return MTLVertexFormatChar2;
                case RHI::Format::R16_FLOAT:
                    return MTLVertexFormatHalf;
                case RHI::Format::R16_UNORM:
                    return MTLVertexFormatUShortNormalized;
                case RHI::Format::R16_UINT:
                    return MTLVertexFormatUShort;
                case RHI::Format::R16_SNORM:
                    return MTLVertexFormatShortNormalized;
                case RHI::Format::R16_SINT:
                    return MTLVertexFormatShort;
                case RHI::Format::R8_UNORM:
                    return MTLVertexFormatUCharNormalized;
                case RHI::Format::R8_UINT:
                    return MTLVertexFormatUChar;
                case RHI::Format::R8_SNORM:
                    return MTLVertexFormatCharNormalized;
                case RHI::Format::R8_SINT:
                    return MTLVertexFormatChar;
                case RHI::Format::A8_UNORM:
                    return MTLVertexFormatUCharNormalized;
                case RHI::Format::B8G8R8A8_UNORM:
                    return MTLVertexFormatUChar4Normalized;
                case RHI::Format::B8G8R8X8_UNORM:
                    return MTLVertexFormatUChar4Normalized;
                case RHI::Format::B8G8R8A8_UNORM_SRGB:
                    return MTLVertexFormatUChar4Normalized;
                default:
                    AZ_Assert(false, "unhandled conversion in ConvertVertexFormat");
                    return MTLVertexFormatInvalid;
            }
        }
        ...
        MTLVertexStepFunction ConvertStepFunction(RHI::StreamStepFunction stepFunction)
        {
            static const MTLVertexStepFunction table[] =
            {
                MTLVertexStepFunctionConstant,
                MTLVertexStepFunctionPerVertex,
                MTLVertexStepFunctionPerInstance,
                MTLVertexStepFunctionPerPatch,
                MTLVertexStepFunctionPerPatchControlPoint
            };
            return table[static_cast<uint32_t>(stepFunction)];
        }
        
        void ConvertInputElements(const RHI::InputStreamLayout& layout, MTLVertexDescriptor* vertDesc)
        {
            uint32_t channelIdx = 0;
            for (const RHI::StreamChannelDescriptor& streamChannel : layout.GetStreamChannels())
            {
                AZ_Assert(streamChannel.m_bufferIndex < METAL_MAX_ENTRIES_BUFFER_ARG_TABLE, "Can not exceed the max slots allowed");
                uint32_t remappedBufferIdx = (METAL_MAX_ENTRIES_BUFFER_ARG_TABLE - 1) - streamChannel.m_bufferIndex;

                vertDesc.attributes[channelIdx].offset = streamChannel.m_byteOffset;
                vertDesc.attributes[channelIdx].format = ConvertVertexFormat(streamChannel.m_format);
                vertDesc.attributes[channelIdx].bufferIndex = remappedBufferIdx;
                channelIdx++;
            }

            uint32_t bufferIdx = 0;
            for (const RHI::StreamBufferDescriptor& streamBuffer : layout.GetStreamBuffers())
            {
                AZ_Assert(bufferIdx < METAL_MAX_ENTRIES_BUFFER_ARG_TABLE, "Can not exceed the max slots allowed");
                uint32_t remappedBufferIdx = (METAL_MAX_ENTRIES_BUFFER_ARG_TABLE - 1) - bufferIdx;

                vertDesc.layouts[remappedBufferIdx].stepFunction = ConvertStepFunction(streamBuffer.m_stepFunction);
                vertDesc.layouts[remappedBufferIdx].stepRate = streamBuffer.m_stepRate;
                vertDesc.layouts[remappedBufferIdx].stride = streamBuffer.m_byteStride;
                bufferIdx++;
            }
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
            MTLVertexDescriptor* vertexDescriptor = [[MTLVertexDescriptor alloc] init];
            ConvertInputElements(descriptor.m_inputStreamLayout, vertexDescriptor);
            m_renderPipelineDesc.vertexDescriptor = vertexDescriptor;
            [vertexDescriptor release];
            vertexDescriptor = nil;
            ...
        }
        ...
    }
    ...
}
```

## Unreal

```cpp
// RHIDefinitions.h
enum EVertexElementType
{
	VET_None,
	VET_Float1,
	VET_Float2,
	VET_Float3,
	VET_Float4,
	VET_PackedNormal,	// FPackedNormal
	VET_UByte4,
	VET_UByte4N,
	VET_Color,
	VET_Short2,
	VET_Short4,
	VET_Short2N,		// 16 bit word normalized to (value/32767.0,value/32767.0,0,0,1)
	VET_Half2,			// 16 bit float using 1 bit sign, 5 bit exponent, 10 bit mantissa 
	VET_Half4,
	VET_Short4N,		// 4 X 16 bit word, normalized 
	VET_UShort2,
	VET_UShort4,
	VET_UShort2N,		// 16 bit word normalized to (value/65535.0,value/65535.0,0,0,1)
	VET_UShort4N,		// 4 X 16 bit word unsigned, normalized 
	VET_URGB10A2N,		// 10 bit r, g, b and 2 bit a normalized to (value/1023.0f, value/1023.0f, value/1023.0f, value/3.0f)
	VET_UInt,
	VET_MAX,

	VET_NumBits = 5,
};
static_assert(VET_MAX <= (1 << VET_NumBits), "VET_MAX will not fit on VET_NumBits");

// RHI.h
struct FVertexElement
{
	uint8 StreamIndex;
	uint8 Offset;
	TEnumAsByte<EVertexElementType> Type;
	uint8 AttributeIndex;
	uint16 Stride;
    ...
};
```

### Unreal - D3D12

```cpp
// D3D12Shader.h
/** Convenience typedef: preallocated array of D3D12 input element descriptions. */
typedef TArray<D3D12_INPUT_ELEMENT_DESC, TFixedAllocator<MaxVertexElementCount> > FD3D12VertexElements;

/** This represents a vertex declaration that hasn't been combined with a specific shader to create a bound shader. */
class FD3D12VertexDeclaration : public FRHIVertexDeclaration
{
public:
	/** Elements of the vertex declaration. */
	FD3D12VertexElements VertexElements;
	...
};

// D3D12PipelineState.cpp
static FD3D12LowLevelGraphicsPipelineStateDesc GetLowLevelGraphicsPipelineStateDesc(const FGraphicsPipelineStateInitializer& Initializer, const FD3D12RootSignature* RootSignature)
{
    ...
	if (FD3D12VertexDeclaration* InputLayout = (FD3D12VertexDeclaration*) Initializer.BoundShaderState.VertexDeclarationRHI)
	{
		Desc.Desc.InputLayout.NumElements        = InputLayout->VertexElements.Num();
		Desc.Desc.InputLayout.pInputElementDescs = InputLayout->VertexElements.GetData();
		Desc.InputLayoutHash = InputLayout->HashNoStrides; // Vertex stream stride does not affect the D3D12 PSO
	}
    ...
}

// D3D12VertexDeclaration.cpp
/**
 * Key used to look up vertex declarations in the cache.
 */
struct FD3D12VertexDeclarationKey
{
	/** Vertex elements in the declaration. */
	FD3D12VertexElements VertexElements;
    ...
	/** Initialization constructor. */
	explicit FD3D12VertexDeclarationKey(const FVertexDeclarationElementList& InElements)
	{
		uint16 UsedStreamsMask = 0;
		FMemory::Memzero(StreamStrides);

		for (int32 ElementIndex = 0; ElementIndex < InElements.Num(); ElementIndex++)
		{
			const FVertexElement& Element = InElements[ElementIndex];
			D3D12_INPUT_ELEMENT_DESC D3DElement = { 0 };
			D3DElement.InputSlot = Element.StreamIndex;
			D3DElement.AlignedByteOffset = Element.Offset;
			switch (Element.Type)
			{
			case VET_Float1:		D3DElement.Format = DXGI_FORMAT_R32_FLOAT; break;
			case VET_Float2:		D3DElement.Format = DXGI_FORMAT_R32G32_FLOAT; break;
			case VET_Float3:		D3DElement.Format = DXGI_FORMAT_R32G32B32_FLOAT; break;
			case VET_Float4:		D3DElement.Format = DXGI_FORMAT_R32G32B32A32_FLOAT; break;
			case VET_PackedNormal:	D3DElement.Format = DXGI_FORMAT_R8G8B8A8_SNORM; break; //TODO: uint32 doesn't work because D3D12  squishes it to 0 in the IA-VS conversion
			case VET_UByte4:		D3DElement.Format = DXGI_FORMAT_R8G8B8A8_UINT; break; //TODO: SINT, blendindices
			case VET_UByte4N:		D3DElement.Format = DXGI_FORMAT_R8G8B8A8_UNORM; break;
			case VET_Color:			D3DElement.Format = DXGI_FORMAT_B8G8R8A8_UNORM; break;
			case VET_Short2:		D3DElement.Format = DXGI_FORMAT_R16G16_SINT; break;
			case VET_Short4:		D3DElement.Format = DXGI_FORMAT_R16G16B16A16_SINT; break;
			case VET_Short2N:		D3DElement.Format = DXGI_FORMAT_R16G16_SNORM; break;
			case VET_Half2:			D3DElement.Format = DXGI_FORMAT_R16G16_FLOAT; break;
			case VET_Half4:			D3DElement.Format = DXGI_FORMAT_R16G16B16A16_FLOAT; break;
			case VET_Short4N:		D3DElement.Format = DXGI_FORMAT_R16G16B16A16_SNORM; break;
			case VET_UShort2:		D3DElement.Format = DXGI_FORMAT_R16G16_UINT; break;
			case VET_UShort4:		D3DElement.Format = DXGI_FORMAT_R16G16B16A16_UINT; break;
			case VET_UShort2N:		D3DElement.Format = DXGI_FORMAT_R16G16_UNORM; break;
			case VET_UShort4N:		D3DElement.Format = DXGI_FORMAT_R16G16B16A16_UNORM; break;
			case VET_URGB10A2N:		D3DElement.Format = DXGI_FORMAT_R10G10B10A2_UNORM; break;
			case VET_UInt:			D3DElement.Format = DXGI_FORMAT_R32_UINT; break;
			default: UE_LOG(LogD3D12RHI, Fatal, TEXT("Unknown RHI vertex element type %u"), (uint8)InElements[ElementIndex].Type);
			};

			// We don't assign D3DElement.SemanticName here, because it's a constant string and we don't want to hash pointers. For best debugging experience,
			// we want to get a consistent hash value across sessions. Therefore it's assigned below, after hashing.
			D3DElement.SemanticIndex = Element.AttributeIndex;
			D3DElement.InputSlotClass = Element.bUseInstanceIndex ? D3D12_INPUT_CLASSIFICATION_PER_INSTANCE_DATA : D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA;

			// This is a divisor to apply to the instance index used to read from this stream.
			D3DElement.InstanceDataStepRate = Element.bUseInstanceIndex ? 1 : 0;

			if ((UsedStreamsMask & 1 << Element.StreamIndex) != 0)
			{
				ensure(StreamStrides[Element.StreamIndex] == Element.Stride);
			}
			else
			{
				UsedStreamsMask = UsedStreamsMask | (1 << Element.StreamIndex);
				StreamStrides[Element.StreamIndex] = Element.Stride;
			}

			VertexElements.Add(D3DElement);
		}

		...
	}
}
...
FVertexDeclarationRHIRef FD3D12DynamicRHI::RHICreateVertexDeclaration(const FVertexDeclarationElementList& Elements)
{
	// Construct a key from the elements.
	FD3D12VertexDeclarationKey Key(Elements);

	// Check for a cached vertex declaration. Add to the cache if it doesn't exist.
	FVertexDeclarationRHIRef* VertexDeclarationRefPtr = GVertexDeclarationCache.FindOrAdd(Key);

	// The cached declaration must match the input declaration!
	check(VertexDeclarationRefPtr);
	check(IsValidRef(*VertexDeclarationRefPtr));
	FD3D12VertexDeclaration* D3D12VertexDeclaration = (FD3D12VertexDeclaration*)VertexDeclarationRefPtr->GetReference();
	checkSlow(D3D12VertexDeclaration->VertexElements == Key.VertexElements);

	return *VertexDeclarationRefPtr;
}
```

### Unreal - Vulkan

```cpp
// VulkanResources.h
class FVulkanVertexInputStateInfo
{
    ...
protected:
	VkPipelineVertexInputStateCreateInfo Info;
    ...
}

// VulkanVertexDeclaration.cpp
void FVulkanVertexInputStateInfo::Generate(FVulkanVertexDeclaration* VertexDeclaration, uint32 VertexHeaderInOutAttributeMask)
{
	// GenerateVertexInputState is expected to be called only once!
	check(Info.sType == 0);

	// Generate vertex attribute Layout
	const FVertexDeclarationElementList& VertexInput = VertexDeclaration->Elements;

	// Generate Bindings
	for (const FVertexElement& Element : VertexInput)
	{
		if ((1<<Element.AttributeIndex) & VertexHeaderInOutAttributeMask)
		{
			check(Element.StreamIndex < MaxVertexElementCount);

			VkVertexInputBindingDescription& CurrBinding = Bindings[Element.StreamIndex];
			if ((BindingsMask & (1 << Element.StreamIndex)) != 0)
			{
				// If exists, validate.
				// Info must be the same
				check(CurrBinding.binding == Element.StreamIndex);
				check(CurrBinding.inputRate == Element.bUseInstanceIndex ? VK_VERTEX_INPUT_RATE_INSTANCE : VK_VERTEX_INPUT_RATE_VERTEX);
				check(CurrBinding.stride == Element.Stride);
			}
			else
			{
				// Zeroed outside
				check(CurrBinding.binding == 0 && CurrBinding.inputRate == 0 && CurrBinding.stride == 0);
				CurrBinding.binding = Element.StreamIndex;
				CurrBinding.inputRate = Element.bUseInstanceIndex ? VK_VERTEX_INPUT_RATE_INSTANCE : VK_VERTEX_INPUT_RATE_VERTEX;
				CurrBinding.stride = Element.Stride;

				// Add mask flag and increment number of bindings
				BindingsMask |= 1 << Element.StreamIndex;
			}
		}
	}

	// Remove gaps between bindings
	BindingsNum = 0;
	BindingToStream.Reset();
	StreamToBinding.Reset();
	for (int32 i=0; i<UE_ARRAY_COUNT(Bindings); i++)
	{
		if (!((1<<i) & BindingsMask))
		{
			continue;
		}

		BindingToStream.Add(BindingsNum, i);
		StreamToBinding.Add(i, BindingsNum);
		VkVertexInputBindingDescription& CurrBinding = Bindings[BindingsNum];
		CurrBinding = Bindings[i];
		CurrBinding.binding = BindingsNum;
		BindingsNum++;
	}

	// Clean originally placed bindings
	FMemory::Memset(Bindings + BindingsNum, 0, sizeof(Bindings[0]) * (UE_ARRAY_COUNT(Bindings)-BindingsNum));

	// Attributes are expected to be uninitialized/empty
	check(AttributesNum == 0);
	for (const FVertexElement& CurrElement : VertexInput)
	{
		// Mask-out unused vertex input
		if ((!((1<<CurrElement.AttributeIndex) & VertexHeaderInOutAttributeMask))
			||	!StreamToBinding.Contains(CurrElement.StreamIndex))
		{
			continue;
		}

		VkVertexInputAttributeDescription& CurrAttribute = Attributes[AttributesNum++]; // Zeroed at the begin of the function
		check(CurrAttribute.location == 0 && CurrAttribute.binding == 0 && CurrAttribute.format == 0 && CurrAttribute.offset == 0);

		CurrAttribute.binding = StreamToBinding.FindChecked(CurrElement.StreamIndex);
		CurrAttribute.location = CurrElement.AttributeIndex;
		CurrAttribute.format = UEToVkBufferFormat(CurrElement.Type);
		CurrAttribute.offset = CurrElement.Offset;
	}

	// Vertex Input
	Info.sType = VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO;

	// Its possible to have no vertex buffers
	if (BindingsNum == 0)
	{
		check(Hash == 0);
		return;
	}

	Info.vertexBindingDescriptionCount = BindingsNum;
	Info.pVertexBindingDescriptions = Bindings;

	check(AttributesNum > 0);
	Info.vertexAttributeDescriptionCount = AttributesNum;
	Info.pVertexAttributeDescriptions = Attributes;

	Hash = FCrc::MemCrc32(Bindings, BindingsNum * sizeof(Bindings[0]));
	check(AttributesNum > 0);
	Hash = FCrc::MemCrc32(Attributes, AttributesNum * sizeof(Attributes[0]), Hash);
}

// VulkanPipeline.cpp
bool FVulkanPipelineStateCacheManager::CreateGfxPipelineFromEntry(FVulkanRHIGraphicsPipelineState* PSO, FVulkanShader* Shaders[ShaderStage::NumStages], bool bPrecompile)
{
    ...
	// Vertex Input. The structure is mandatory even without vertex attributes.
	VkPipelineVertexInputStateCreateInfo VBInfo;
	ZeroVulkanStruct(VBInfo, VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO);
	TArray<VkVertexInputBindingDescription, TInlineAllocator<32>> VBBindings;
	for (const FGfxPipelineDesc::FVertexBinding& SourceBinding : GfxEntry->VertexBindings)
	{
		VkVertexInputBindingDescription* Binding = new(VBBindings) VkVertexInputBindingDescription;
		SourceBinding.WriteInto(*Binding);
	}
	VBInfo.vertexBindingDescriptionCount = VBBindings.Num();
	VBInfo.pVertexBindingDescriptions = VBBindings.GetData();
	TArray<VkVertexInputAttributeDescription, TInlineAllocator<32>> VBAttributes;
	for (const FGfxPipelineDesc::FVertexAttribute& SourceAttr : GfxEntry->VertexAttributes)
	{
		VkVertexInputAttributeDescription* Attr = new(VBAttributes) VkVertexInputAttributeDescription;
		SourceAttr.WriteInto(*Attr);
	}
	VBInfo.vertexAttributeDescriptionCount = VBAttributes.Num();
	VBInfo.pVertexAttributeDescriptions = VBAttributes.GetData();
	PipelineInfo.pVertexInputState = &VBInfo;
    ...
}
...
void FVulkanPipelineStateCacheManager::CreateGfxEntry(const FGraphicsPipelineStateInitializer& PSOInitializer, FVulkanDescriptorSetsLayoutInfo& DescriptorSetLayoutInfo, FGfxPipelineDesc* Desc)
{
	FGfxPipelineDesc* OutGfxEntry = Desc;
    ...
	{
		const VkPipelineVertexInputStateCreateInfo& VBInfo = VertexInputState.GetInfo();
		OutGfxEntry->VertexBindings.AddUninitialized(VBInfo.vertexBindingDescriptionCount);
		for (uint32 Index = 0; Index < VBInfo.vertexBindingDescriptionCount; ++Index)
		{
			OutGfxEntry->VertexBindings[Index].ReadFrom(VBInfo.pVertexBindingDescriptions[Index]);
		}

		OutGfxEntry->VertexAttributes.AddUninitialized(VBInfo.vertexAttributeDescriptionCount);
		for (uint32 Index = 0; Index < VBInfo.vertexAttributeDescriptionCount; ++Index)
		{
			OutGfxEntry->VertexAttributes[Index].ReadFrom(VBInfo.pVertexAttributeDescriptions[Index]);
		}
	}
    ...
}

// VulkanAndroidPlatform.cpp
void PipelineToBinary(FVulkanDevice* Device, const VkGraphicsPipelineCreateInfo* PipelineInfo, FGfxPipelineDesc* GfxEntry, const FVulkanRenderTargetLayout* RTLayout, TArray<char>& MemoryStream)
{
    ...
	if (pipelineCreateInfo.bHasVkPipelineVertexInputStateCreateInfo)
	{
		const VkPipelineVertexInputStateCreateInfo* VertexInputState = PipelineInfo->pVertexInputState;
		check(VertexInputState->pNext == nullptr);

		VkPipelineVertexInputStateCreateInfo CopyVertexInputState;
		FMemory::Memzero(CopyVertexInputState);

		CopyVertexInputState.sType = VertexInputState->sType;
		CopyVertexInputState.flags = VertexInputState->flags;
		CopyVertexInputState.vertexBindingDescriptionCount = VertexInputState->vertexBindingDescriptionCount;
		CopyVertexInputState.vertexAttributeDescriptionCount = VertexInputState->vertexAttributeDescriptionCount;

		COPY_TO_BUFFER(MemoryStream, &CopyVertexInputState, sizeof(VkPipelineVertexInputStateCreateInfo));
		
		if(VertexInputState->vertexBindingDescriptionCount > 0)
		{
			uint32_t Length = sizeof(VkVertexInputBindingDescription) * VertexInputState->vertexBindingDescriptionCount;
			COPY_TO_BUFFER(MemoryStream, VertexInputState->pVertexBindingDescriptions, Length);
		}

		if(VertexInputState->vertexAttributeDescriptionCount > 0)
		{
			uint32_t Length = sizeof(VkVertexInputAttributeDescription) * VertexInputState->vertexAttributeDescriptionCount;
			COPY_TO_BUFFER(MemoryStream, VertexInputState->pVertexAttributeDescriptions, Length);
		}
	}
    ...
}
```

### Unreal - Metal

```cpp
// MetalVertexDeclaration.h
/**
 * This represents a vertex declaration that hasn't been combined with a
 * specific shader to create a bound shader.
 */
class FMetalVertexDeclaration : public FRHIVertexDeclaration
{
public:
	...
	/** Cached element info array (offset, stream index, etc) */
	FVertexDeclarationElementList Elements;
	...
};

// MetalDynamicRHI.h/** The interface which is implemented by the dynamically bound RHI. */
class FMetalDynamicRHI : public FDynamicRHI
{
    ...
	virtual FVertexDeclarationRHIRef RHICreateVertexDeclaration(const FVertexDeclarationElementList& Elements) final override;
    ...
}

// MetalDynamicRHI.cpp
FVertexDeclarationRHIRef FMetalDynamicRHI::RHICreateVertexDeclaration(const FVertexDeclarationElementList& Elements)
{
	@autoreleasepool {
		uint32 Key = FCrc::MemCrc32(Elements.GetData(), Elements.Num() * sizeof(FVertexElement));

		// look up an existing declaration
		FVertexDeclarationRHIRef* VertexDeclarationRefPtr = VertexDeclarationCache.Find(Key);
		if (VertexDeclarationRefPtr == NULL)
		{
			// create and add to the cache if it doesn't exist.
			VertexDeclarationRefPtr = &VertexDeclarationCache.Add(Key, new FMetalVertexDeclaration(Elements));
		}

		return *VertexDeclarationRefPtr;
	} // autoreleasepool
}
```