# Bindless 이해하기 (2023.03.22)
[Home](/)

# 1. Bindless란?

계속해서 실시간 그래픽스의 트렌드는 CPU보다 GPU에 많은 일을 시키는 것에 집중되어오고 있다. Direct3D 11와 OpenGL 세대에서 Direct3D 12, Vulkan, Metal 세대로 넘어가는 가장 중요한 철학적 변화가 바로 CPU와 GPU의 비동기적 실행이기 때문이다. 과거에는 CPU 코드에서 `Render()`와 같은 함수를 호출하여 GPU에게 일을 시키면 해당 일이 종료될 때까지 해당 함수가 반환하지 않았다. 즉, GPU가 열심히 일을 하는 동안 CPU는 이걸 평생 기다리고 있어야 했던 것이다. 이것을 방지하기 위해 따로 렌더링은 전용 스레드를 생성하는 식으로 하곤 했다. 이외에도 병렬적으로 렌더링을 할 수 있도록 여려 GPU 명령들을 기록할 수 있도록 render context를 여러 개로 둘 수 있도록 기능을 제공하기도 한다.

Bindless는 이러한 철학을 공유하는 방법으로, bindless를 이해하려면 우선 이를 통해 무엇을 해결, 혹은 개선하려는 지를 파악해보면 된다.

## 1.1. Resource Binding

GPU에 명령을 기록하게 되면 각 명령이 요구하는 매개변수를 입력변수로 넣어주어야 한다. 대표적인 것 중 하나가 shader 쪽의 자원들로, shader resource view라든가, constant buffer view와 같은 여러 리소스를 각 pipeline에 대응하는 root signature에 알맞게 binding을 해주어야 한다. 이 모든 작업은 결국 CPU에서 일어나게 된다.

Pipeline의 구조가 단순하고, 자원의 사용도 일원화 되어 있거나 단순한 편이라면 크게 성능에 영향을 주지 않을 수도 있을 것이다. 그러나 AAA 급 게임에서는 얘기가 다르다. AAA 급 게임에서는 GPU를 다방면으로 사용하고 싶어하고, 더 아름다운 렌더링을 위해 다양한 pipeline을 사용하게 된다. 이렇게 되면 그때 그때 필요한 pipeline에 일일이 resource를 binding을 해주어야 한다. 이것을 CPU가 아닌 GPU에게 시키자는 것이 bindless의 요지라고 할 수 있다.

우선 혹시나 까먹은 독자들을 위해 전통적인 binding 방법에 대해 다시 짚고 넘어가보자.

## 1.2. Descriptor Binding

기본적으로 shader라는 것은 GPU에서 돌아가는 별개의 프로그램이다. 실제로 OpenGL에서는 `glProgram` 등의 자료형으로 표현해주기도 한다. 어떤 shader 파일 `Example`이 주어졌을 때 `Example` 안에는 여러 함수가 있을 것이다. 이 함수 중에서 우리가 특히 실행하고 싶은 함수가 하나 있을 것이다. 이 함수에는 당장 함수의 signature에 따라 넘겨줄 매개변수들도 있겠지만, shader 프로그램 전역적으로도 요구하는 변수들도 있다. 이걸 modern graphics API에선 root signature라고 부른다.

세부적으로 [마소의 샘플에 있는 triangle shader](https://github.com/microsoft/DirectX-Graphics-Samples/blob/master/Samples/Desktop/D3D12HelloWorld/src/HelloTexture/shaders.hlsl)를 예시를 들어 설명하자면:

```hlsl
//*********************************************************
//
// Copyright (c) Microsoft. All rights reserved.
// This code is licensed under the MIT License (MIT).
// THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
// IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
// PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
//
//*********************************************************

struct PSInput
{
    float4 position : SV_POSITION;
    float2 uv : TEXCOORD;
};

Texture2D g_texture : register(t0);
SamplerState g_sampler : register(s0);

PSInput VSMain(float4 position : POSITION, float4 uv : TEXCOORD)
{
    PSInput result;

    result.position = position;
    result.uv = uv;

    return result;
}

float4 PSMain(PSInput input) : SV_TARGET
{
    return g_texture.Sample(g_sampler, input.uv);
}
```

이 shader 프로그램은 단순히 삼각형 위에 텍스처(2D 이미지)를 입혀주는 프로그램이다.

여기서 우리는 entry point를 `PSMain`으로 설정해서 pixel shader를 실행하고 싶다고 가정하자. `PSMain`의 매개변수 자체는 graphics rendering pipeline에 따라서 `VSMain` 함수에서 출력된 값이 그대로 이어져서 `PSMain`의 입력으로 들어갈 것이다. 그렇다면 `g_texture`이나 `g_sampler`와 같은 프로그램에서 전역적으로 사용할 수 있는 근본적인root 변수들은 어떻게 할 것인가?

당연하겠지만 이 shader를 사용할 CPU 측 코드에선 요구하는 root signature를 파악하고, 여기에 대응하는 변수를 생성하여 넘겨줘야 한다:

```cpp
// Create the root signature.
{
    D3D12_FEATURE_DATA_ROOT_SIGNATURE featureData = {};

    ...

    CD3DX12_DESCRIPTOR_RANGE1 ranges[1];
    ranges[0].Init(D3D12_DESCRIPTOR_RANGE_TYPE_SRV, 1, 0, 0, D3D12_DESCRIPTOR_RANGE_FLAG_DATA_STATIC);

    CD3DX12_ROOT_PARAMETER1 rootParameters[1];
    rootParameters[0].InitAsDescriptorTable(1, &ranges[0], D3D12_SHADER_VISIBILITY_PIXEL);

    D3D12_STATIC_SAMPLER_DESC sampler = {};
    ...
    sampler.ShaderVisibility = D3D12_SHADER_VISIBILITY_PIXEL;

    CD3DX12_VERSIONED_ROOT_SIGNATURE_DESC rootSignatureDesc;
    rootSignatureDesc.Init_1_1(_countof(rootParameters), rootParameters, 1, &sampler, D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT);

    ComPtr<ID3DBlob> signature;
    ComPtr<ID3DBlob> error;
    ThrowIfFailed(D3DX12SerializeVersionedRootSignature(&rootSignatureDesc, featureData.HighestVersion, &signature, &error));
    ThrowIfFailed(m_device->CreateRootSignature(0, signature->GetBufferPointer(), signature->GetBufferSize(), IID_PPV_ARGS(&m_rootSignature)));
}
```

위의 코드에서 중요한 용어만 빼보겠다:

* Root signature
* Descriptor

### 1.2.1. Descriptor

Root signature은 위에서 언급했으니 이미 무엇인지 알지만, descriptor라는 것은 무엇일까? 통상적으로 descriptor라는 용어는 어떤 개체를 생성하기 위해 필요한 정보의 집합을 의미한다. 예를 들자면:

```cpp
StudentDesc desc =
{
    .Name           = "홍길동",
    .Id             = 2023123456,
    .DepartmentDesc =
    {
        .Name       = "Engineering",
        .Major      = "Computer Science",
    },
};

Student* student = new Student(desc);
...
```

위와 같이 처리를 해주는 것이다.

그렇다면 shader 프로그램에 뭔가 필요한 정보를 넘기는 과정에서 descriptor는 도대체 무엇을 위한 정보를 의미하는 것일까? 당연하겠지만 root signature로 넘겨줄 변수들에 대한 정보이다. CPU와 GPU는 서로 다른 환경이다보니 서로 데이터를 주고 받을 땐 반드시 이게 어떤 데이터인지에 대한 정보가 필요하다. GPU는 CPU로부터 단순히 이러한 root signature에 대응하는 변수를 달라고 요구를 했을 뿐이고 CPU는 이에 대응하여 변수를 전달할 뿐이다. 즉, 모든 type check, memory size check 등은 CPU 단에서 전부 확인을 해주고 넘겨주어야 한다. 이러한 정보를 우리는 view라고 부르게 된다. 실제 변수는 texture이지만, 이 texture에 대한 추가적인 정보를 view에 저장하겠다는 것이다. 바로 이 view가 곧 descriptor에 대응하는 것이다.

기본적으로 descriptor가 묘사할 수 있는 view는 다음과 같다:
1. Render target view (RTV)
2. Depth stencil view (DSV)
3. Shader resource view (SRV)
4. Unordered access view (UAV)
5. Constant buffer view (CBV)
6. Sampler

위의 shader 프로그램을 보고 판단해보자면 우리가 넘겨줘야하는 정보는 다음과 같다:
1. t0 레지스터에 2D texture : SRV
2. s0 레지스터에 sampler    : Sampler

한 번 직접 descriptor를 이제 생성해보자:

```cpp
// descriptor for SRVs
D3D12_SHADER_RESOURCE_VIEW_DESC srvDesc = 
{
    .Format                     = DXGI_FORMAT_R8G8B8A8_UNORM,
    .ViewDimension              = D3D12_SRV_DIMENSION_TEXTURE2D,
    .Shader4ComponentMapping    = D3D12_DEFAULT_SHADER_4_COMPONENT_MAPPING,
    .Texture2D                  =
    {
        .MipLevels              = 1
    },
}
```

위의 예시에서 볼 수 있듯이 사용할 SRV의 각 원소의 타입(`.Format`)이 무엇인지, 몇 차원의 정보(`.ViewDimension`)인지 등을 볼 수 있다. 위의 예시로 해석해보자면, 우리가 사용할 SRV는 우선 2D 이미지이므로 `.ViewDimension=D3D12_SRV_DIMENSION_TEXTURE2D`, `.Texture2D`를 사용해주었으며, 이미지는 보통 RGBA 8비트 컬러 값을 사용하므로 R8G8B8A8을 넘겨주었다(UNORM은 지금은 넘어가도 된다).

```cpp
// create an SRV.
ComPtr<ID3D12Device>    pDevice;
ComPtr<ID3D12Resource>  pTexture;
...

D3D12_SHADER_RESOURCE_VIEW_DESC srvDesc =
...

d3dDevice->CreateShaderResourceView(pTexture.Get(), &srvDesc, srvHandle);
```

#### 1.2.1.1. Descriptor Handle

여기서 우리가 다루지 않은 변수는 바로 세번째, `srvHandle`이라는 변수이다. 보통 우리가 어떤 자료를 생성한다고 하면:

```cpp
SomeData* data = new SomeData(dataDesc);
```

위와 같이 생성을 해주면 운영체제에서 알아서 heap에 `sizeof(SomeData)` 크기의 메모리를 찾아 해당 메모리의 시작 주소를 `data` 값으로 준 다음, 동적 할당을 진행하게 된다. 그러나 우리가 현재 생성하려는 정보는 따로 동적 할당을 통해 생성하는 것이 아닌 graphics API를 통해서 할당을 하게 되므로 주어진 API를 사용해야 한다. 이때 Direct3D의 경우 descriptor handle이라는 개념을 통해 포인터를 대체하게 된다. **Descriptor handle**이란 포인터는 아닌데, 포인터처럼 어떤 개체의 고유한 주소를 의미하는 개체이다. 근데 동적 할당과는 다르게 메모리 할당과 생성이 동시에 이러나는 것이 아니라, 우선 먼저 개발자가 저장할 주소를 찾아서 거기에 SRV를 생성해주는 식이다. 그렇다면 우선 handle을 구해야할텐데, 그럼 도대체 어떤 메모리의 주소를 구해야하는걸까?

### 1.2.2. Descriptor Heap

Descriptor는 descriptor heap이라고 부르는 공간에 저장하게 된다. 이 heap은 이미 존재해서 거기에 할당하는 것이 아니라 CPU 단에서 생성해주어야 한다. Heap은 크게 CBV, UAV, SRV 전용 heap과 sampler 전용 heap이 있다. 우리의 경우 두 가지 heap이 필요해지는 것이다.

Descriptor heap을 우선 구현해보자:

```cpp
// Describe and create a shader resource view (SRV) heap for the texture.
D3D12_DESCRIPTOR_HEAP_DESC srvHeapDesc = {};
srvHeapDesc.NumDescriptors = 1;
srvHeapDesc.Type = D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV;
srvHeapDesc.Flags = D3D12_DESCRIPTOR_HEAP_FLAG_SHADER_VISIBLE;
ThrowIfFailed(m_device->CreateDescriptorHeap(&srvHeapDesc, IID_PPV_ARGS(&m_srvHeap)));
```


# temp

```cpp
// Graphics API
ComPtr<ID3D12Device>                d3d12Device;
ComPtr<ID3D12GraphicsCommandList>   d3d12GraphicsCommandList;
VkPhysicalDevice                    vkPhysicalDevice;
VkPhysicalDeviceMemoryProperties	vkPhysicalDeviceMemoryProperties;
VkDevice                            vkDevice;
VkCommandBuffer                     vkCommandBuffer;
VkPipeline                          vkPipeline;

/*************************************************************************************************************
 * initialize Graphics API                                                                                   *
 *************************************************************************************************************/

// Vertex Buffer

// Graphics Resources
Vertex aVertices[NUM_VERTICES] = { ... };

// API Resources
    // D3D12
    {
        ComPtr<ID3D12Resource>  d3d12VertexBuffer;

        // 버퍼에 대응하는 GPU 메모리를 먼저 할당해야 함. 이를 위해서 할당한 메모리와 할당할 힙을 생성해야 함.
        const D3D12_HEAP_PROPERTIES d3d12HeapProperties =
        {
            .Type = D3D12_HEAP_TYPE_UPLOAD,                         // 힙 타입임. Vertex buffer를 CPU에서도 수정하여 GPU에 다시 올릴 일이 있을 때
                                                                    // GPU에 다시 upload 해야 한다고 해서 해당 타입을 필요로 함.
            .CPUPageProperty = D3D12_CPU_PAGE_PROPERTY_UNKNOWN,
            .MemoryPoolPreference = D3D12_MEMORY_POOL_UNKNOWN,
            .CreationNodeMask = 1,  // 자원을 생성할 GPU bit. GPU 사실상 하나만 쓰므로 0번째 bit만 1인 값으로 설정함.
            .VisibleNodeMask = 1,   // 자원을 사용할 GPU bit. GPU 사실상 하나만 쓰므로 0번째 bit만 1인 값으로 설정함.
        };
        
        const D3D12_RESOURCE_DESC d3dResourceDesc =
        {
            .Dimension = D3D12_RESOURCE_DIMENSION_BUFFER,   // 단순 선형(배열) 버퍼 == 1차원
            .Alignment = 0,
            .Width = sizeof(aVertices), // 1차원이므로 width의 크기만
            .Height = 1,                // 1차원이므로 height == 1
            .DepthOrArraySize = 1,      // 1차원이므로 depth == 1
            .MipLevels = 1,             // texture 아니므로 mip-map 필요 X
            .Format = DXGI_FORMAT_UNKNOWN,  // texture처럼 사용할 거 아니라서 따로 format 명시 필요 X
            .SampleDesc = 
            {
                .Count = 1,     // texture 아님!
                .Quality = 0,
            },
            .Layout = D3D12_TEXTURE_LAYOUT_ROW_MAJOR,   // 선형 배열! 일차원!
            .Flags = D3D12_RESOURCE_FLAG_NONE,
        };

        d3d12Device->CreateCommittedResource(
            &d3d12HeapProperties,
            D3D12_HEAP_FLAG_NONE,
            &d3dResourceDesc,
            /* InitialResourceState = */ D3D12_RESOURCE_STATE_GENERIC_READ, // D3D12_HEAP_TYPE_UPLOAD의 힙 타입을 사용하는 경우 이 상태로 유지해야 한다.
            /* pOptimizedClearValue = */ nullptr,
            IID_PPV_ARGS(d3d12VertexBuffer.ReleaseAndGetAddressOf())
        );

        // 이제 메모리에 실제 vertex 정보를 올려보자. 그러려면 우선 CPU로 버퍼 메모리를 가져와야 하므로 map을 해줘야 한다.
        uint8* pVertexData = nullptr;
        const D3D12_RANGE d3d12Range =
        {
            .Begin = 0,
            .End = 0,
        };
        d3d12VertexBuffer->Map(0, &d3d12Range, reinterpret_cast<void**>(&pVertexData));

        // 이제 vertex 데이터를 pVertexData에 복사해주면 된다.
        ::memcpy(pVertexData, aVertices, sizeof(aVertices));

        // 복사가 끝났으니 동기화를 해주면 된다.
        d3d12VertexBuffer->Unmap(0, nullptr);

        const D3D12_VERTEX_BUFFER_VIEW d3d12VertexBufferView = 
        {
            .BufferLocation = d3d12VertexBuffer.GetGPUVirtualAddress(),
            .SizeInBytes = sizeof(aVertices),
            .StrideInBytes = sizeof(Vertex),
        };

        d3d12GraphicsCommandList->IASetVertexBuffers(
            /* StartSlot = */ 0, 
            /* NumViews = */ 1, 
            &d3d12VertexBufferView
        );
    }
    // Vulkan
    {
        VkBuffer                vkVertexBuffer;             // 실제 버퍼가 아니라, 버퍼를 가리키는 핸들임.
        VkDeviceMemory          vkVertexBufferDeviceMemory; // 실제 버퍼가 존재할 메모리.

        // 어떤 버퍼인지에 대한 정보
            // 버퍼의 크기 (byte)
            // 버퍼의 용도 (vertex buffer)
        VkBufferCreateInfo vkVertexBufferCreateInfo =
        {
            .sType = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO,
            .pNext = nullptr,
            .flags = 0,
            .size = sizeof(aVertices),
            .usage = VK_BUFFER_USAGE_VERTEX_BUFFER_BIT,
            .sharingMode = VK_SHARING_MODE_EXCLUSIVE,
            .queueFamilyIndexCount = 0,
            .pQueueFamilyIndices = nullptr,
        };

        vkCreateBuffer(
			vkDevice,
			&vkVertexBufferCreateInfo,
			nullptr,
			&vkVertexBuffer
        );

        // 이 시점에서는 버퍼를 가리킬 핸들을 만든거지, 실제 버퍼가 생긴 것은 아님.
        // 실제 버퍼를 만들려면 버퍼가 차지하는 만큼의 메모리를 먼저 할당을 해야 함. (VkDevice 메모리)
        // 할당을 하려면 할당할 버퍼에 적합한 메모리 타입과 힙 타입을 골라야 한다.

        // 우선 버퍼가 어느 정도의 실제 메모리를 차지할 지를 알아내보자
        VkMemoryRequirements vkMemoryRequirements;
        vkGetBufferMemoryRequirements(vkDevice, vkVertexBuffer, &vkMemoryRequirements);
        const uint32 memoryAllocationSize = vkMemoryRequirements.size;
		VkMemoryAllocateInfo vkMemoryAllocateInfo =
		{
			.sType = VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO,
			.pNext = nullptr,
			.allocationSize = memoryAllocationSize,
			.memoryTypeIndex = NPOS,
		};

        // 우리가 필요한 메모리 타입은 무엇일까?
        // 만약 vertex에 대한 정보를 나중에 CPU에서 수정할 일이 생긴다면 해당 데이터를 CPU에서 접근할 수 있도록 해주어야 한다.
        // 대표적인 방법이 바로 mapping으로, GPU에 할당된 데이터를 CPU의 메모리로 매핑해주는 것이다.
        // 이것을 가능하게 해주는 flag가 바로 VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT이다.
        // 이제 CPU와 GPU 둘 다 동일한 메모리에 접근할 수 있게 되므로 캐시 일관성의 문제가 발생할 수 있다.
        // 이것을 보장하도록 해주는 flag가 바로 VK_MEMORY_PROPERTY_HOST_COHERENT_BIT이다.

        // 우리가 원하는 메모리 타입의 속성을 알았으니, 실제로 우리가 사용할 물리적인 디바이스(GPU)에서 해당 속성을 지원하는 메모리 타입이 있는지를 확인해보자.
        const VkMemoryPropertyFlags vkMemoryPropertyFlags = VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT;
		for (uint32 uMemoryTypeIndex = 0; uMemoryTypeIndex < vkPhysicalDeviceMemoryProperties.memoryTypeCount; ++uMemoryTypeIndex)
		{
			if ((vkMemoryRequirements.memoryTypeBits & 1) == 1)
			{
                const VkMemoryType& vkMemoryType = vkPhysicalDeviceMemoryProperties.memoryTypes[uMemoryTypeIndex];
				// 만약 사용 가능한 타입이라면, 우리가 원하는 속성을 지원하는가?
				if ((vkMemoryType.propertyFlags & vkMemoryPropertyFlags) == vkMemoryPropertyFlags)
				{
                    // 해당 메모리 타입을 사용하는 힙이 우리가 할당할 버퍼 정도는 감당할 정도의 크기를 갖는가?
                    if (vkPhysicalDeviceMemoryProperties.memoryHeaps[vkMemoryType.heapIndex].size >= vkMemoryAllocateInfo.allocationSize)
                    {
					    vkMemoryAllocateInfo.memoryTypeIndex = uMemoryTypeIndex;
                        break;
                    }
				}
			}
			vkMemoryRequirements.memoryTypeBits >>= 1;
		}
		
        // 필요한 메모리의 크기, 용도에 맞는 메모리 타입, 충분한 크기의 힙이 주어졌을 때, 이 조건을 만족하는 디바이스 메모리를 할당한다.
        vkAllocateMemory(vkDevice, &vkMemoryAllocateInfo, nullptr, &vkVertexBufferDeviceMemory);

        // 버퍼 핸들과 할당된 메모리를 bind해준다
        vkBindBufferMemory(vkDevice, vkVertexBuffer, vkVertexBufferDeviceMemory, /* memoryOffset = */ 0);
        // 일종의 포인터인 셈인데, 마지막 숫자는 버퍼 핸들이 할당된 메모리의 몇번째 바이트부터 가리킬지를 정해주는 것이다.
        // uint8* vkVertexBuffer = vkVertexBufferDeviceMemory + memoryOffset; 과 같은 셈

        // 이제 메모리에 실제 vertex 정보를 올려보자. 그러려면 우선 CPU로 버퍼 메모리를 가져와야 하므로 map을 해줘야 한다.
        uint8* pVertexData = nullptr;
        vkMapMemory(vkDevice, vkVertexBufferDeviceMemory, /* offset = */ 0, memoryAllocationSize, /* flags = */ 0, reinterpret_cast<void**>(&pVertexData));

        // 이제 vertex 데이터를 pVertexData에 복사해주면 된다.
        ::memcpy(pVertexData, aVertices, sizeof(aVertices));

        // 복사가 끝났으니 동기화를 해주면 된다.
        // 해당 버퍼 메모리가 할당된 힙의 메모리 타입은 캐시 일관성을 제공했기에 동기화가 잘 된다.
        vkUnmapMemory(vkDevice, vkVertexBufferDeviceMemory);

        // 이제 pipeline에 vertex buffer를 bind를 해주면 된다.
        ... // pipeline binding
        VkBuffer aVertexBuffers[] = { vkVertexBuffer };
        VkDeviceSize aOffsets[] = { 0 };

        vkCmdBindVertexBuffers(vkCommandBuffer, /* firstBinding = */ 0, /* bindingCount = */ 1, aVertexBuffers, aOffsets);
        // firstBinding: 이 command에서 처리할 첫번째 vertex input binding index.
        ... // 기타 command recording 등등 및 gpu wait

        // 버퍼 핸들을 없애주고
        vkDestroyBuffer(vkDevice, vkVertexBuffer, nullptr);
        // 버퍼가 가리켰던 메모리를 해제해준다.
        vkFreeMemory(vkDevice, vkVertexBufferDeviceMemory, nullptr);
    }

// Index Buffer
// Vertex Buffer

// Graphics Resources
uint8 aIndices[NUM_INDICES] = { ... };

// API Resources
    // D3D12
    {
        ComPtr<ID3D12Resource>  d3d12IndexBuffer;
		ComPtr<ID3D12Resource>  d3d12IndexBufferUploadHeap;

		// index buffer 생성
		{
			// 버퍼에 대응하는 GPU 메모리를 먼저 할당해야 함. 이를 위해서 할당한 메모리와 할당할 힙을 생성해야 함.
			const D3D12_HEAP_PROPERTIES d3d12HeapProperties =
			{
				.Type = D3D12_HEAP_TYPE_DEFAULT,					// 기본Default 힙 타입은 GPU 전용 힙 타입으로 CPU가 접근할 수 없음.
				.CPUPageProperty = D3D12_CPU_PAGE_PROPERTY_UNKNOWN,
				.MemoryPoolPreference = D3D12_MEMORY_POOL_UNKNOWN,
				.CreationNodeMask = 1,  // 자원을 생성할 GPU bit. GPU 사실상 하나만 쓰므로 0번째 bit만 1인 값으로 설정함.
				.VisibleNodeMask = 1,   // 자원을 사용할 GPU bit. GPU 사실상 하나만 쓰므로 0번째 bit만 1인 값으로 설정함.
			};
			
			const D3D12_RESOURCE_DESC d3dResourceDesc =
			{
				.Dimension = D3D12_RESOURCE_DIMENSION_BUFFER,   // 단순 선형(배열) 버퍼 == 1차원
				.Alignment = 0,
				.Width = sizeof(aIndices),	// 1차원이므로 width의 크기만
				.Height = 1,                // 1차원이므로 height == 1
				.DepthOrArraySize = 1,      // 1차원이므로 depth == 1
				.MipLevels = 1,             // texture 아니므로 mip-map 필요 X
				.Format = DXGI_FORMAT_UNKNOWN,  // texture처럼 사용할 거 아니라서 따로 format 명시 필요 X
				.SampleDesc = 
				{
					.Count = 1,     // texture 아님!
					.Quality = 0,
				},
				.Layout = D3D12_TEXTURE_LAYOUT_ROW_MAJOR,   // 선형 배열! 일차원!
				.Flags = D3D12_RESOURCE_FLAG_NONE,
			};

			d3d12Device->CreateCommittedResource(
				&d3d12HeapProperties,
				D3D12_HEAP_FLAG_NONE,
				&d3dResourceDesc,
				/* InitialResourceState = */ D3D12_RESOURCE_STATE_COPY_DEST,	// GPU에 있는 이 버퍼는 CPU에 있는 index buffer를 복사할 destination이 되는 것이다.
				/* pOptimizedClearValue = */ nullptr,
				IID_PPV_ARGS(d3d12IndexBuffer.ReleaseAndGetAddressOf())
			);
		}

		// index buffer upload heap 생성
		{
			const D3D12_HEAP_PROPERTIES d3d12HeapProperties =
			{
				.Type = D3D12_HEAP_TYPE_UPLOAD,						// upload 힙 타입으로 설정.
				.CPUPageProperty = D3D12_CPU_PAGE_PROPERTY_UNKNOWN,
				.MemoryPoolPreference = D3D12_MEMORY_POOL_UNKNOWN,
				.CreationNodeMask = 1,  // 자원을 생성할 GPU bit. GPU 사실상 하나만 쓰므로 0번째 bit만 1인 값으로 설정함.
				.VisibleNodeMask = 1,   // 자원을 사용할 GPU bit. GPU 사실상 하나만 쓰므로 0번째 bit만 1인 값으로 설정함.
			};
			
			const D3D12_RESOURCE_DESC d3dResourceDesc =
			{
				.Dimension = D3D12_RESOURCE_DIMENSION_BUFFER,   // 단순 선형(배열) 버퍼 == 1차원
				.Alignment = 0,
				.Width = sizeof(aVertices),	// 1차원이므로 width의 크기만
				.Height = 1,                // 1차원이므로 height == 1
				.DepthOrArraySize = 1,      // 1차원이므로 depth == 1
				.MipLevels = 1,             // texture 아니므로 mip-map 필요 X
				.Format = DXGI_FORMAT_UNKNOWN,  // texture처럼 사용할 거 아니라서 따로 format 명시 필요 X
				.SampleDesc = 
				{
					.Count = 1,     // texture 아님!
					.Quality = 0,
				},
				.Layout = D3D12_TEXTURE_LAYOUT_ROW_MAJOR,   // 선형 배열! 일차원!
				.Flags = D3D12_RESOURCE_FLAG_NONE,
			};

			d3d12Device->CreateCommittedResource(
				&d3d12HeapProperties,
				D3D12_HEAP_FLAG_NONE,
				&d3dResourceDesc,
				/* InitialResourceState = */ D3D12_RESOURCE_STATE_GENERIC_READ,
				/* pOptimizedClearValue = */ nullptr,
				IID_PPV_ARGS(d3d12IndexBufferUploadHeap.ReleaseAndGetAddressOf())
			);
		}
    }
    // Vulkan
    {
        VkBuffer                vkIndexBuffer;             // 실제 버퍼가 아니라, 버퍼를 가리키는 핸들임.
        VkDeviceMemory          vkIndexBufferDeviceMemory; // 실제 버퍼가 존재할 메모리.

        // 어떤 버퍼인지에 대한 정보
            // 버퍼의 크기 (byte)
            // 버퍼의 용도 (vertex buffer)
        VkBufferCreateInfo vkVertexBufferCreateInfo =
        {
            .sType = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO,
            .pNext = nullptr,
            .flags = 0,
            .size = sizeof(aVertices),
            .usage = VK_BUFFER_USAGE_VERTEX_BUFFER_BIT,
            .sharingMode = VK_SHARING_MODE_EXCLUSIVE,
            .queueFamilyIndexCount = 0,
            .pQueueFamilyIndices = nullptr,
        };

        vkCreateBuffer(
			vkDevice,
			&vkVertexBufferCreateInfo,
			nullptr,
			&vkVertexBuffer
        );

        // 이 시점에서는 버퍼를 가리킬 핸들을 만든거지, 실제 버퍼가 생긴 것은 아님.
        // 실제 버퍼를 만들려면 버퍼가 차지하는 만큼의 메모리를 먼저 할당을 해야 함. (VkDevice 메모리)
        // 할당을 하려면 할당할 버퍼에 적합한 메모리 타입과 힙 타입을 골라야 한다.

        // 우선 버퍼가 어느 정도의 실제 메모리를 차지할 지를 알아내보자
        VkMemoryRequirements vkMemoryRequirements;
        vkGetBufferMemoryRequirements(vkDevice, vkVertexBuffer, &vkMemoryRequirements);
        const uint32 memoryAllocationSize = vkMemoryRequirements.size;
		VkMemoryAllocateInfo vkMemoryAllocateInfo =
		{
			.sType = VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO,
			.pNext = nullptr,
			.allocationSize = memoryAllocationSize,
			.memoryTypeIndex = NPOS,
		};

        // 우리가 필요한 메모리 타입은 무엇일까?
        // 만약 vertex에 대한 정보를 나중에 CPU에서 수정할 일이 생긴다면 해당 데이터를 CPU에서 접근할 수 있도록 해주어야 한다.
        // 대표적인 방법이 바로 mapping으로, GPU에 할당된 데이터를 CPU의 메모리로 매핑해주는 것이다.
        // 이것을 가능하게 해주는 flag가 바로 VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT이다.
        // 이제 CPU와 GPU 둘 다 동일한 메모리에 접근할 수 있게 되므로 캐시 일관성의 문제가 발생할 수 있다.
        // 이것을 보장하도록 해주는 flag가 바로 VK_MEMORY_PROPERTY_HOST_COHERENT_BIT이다.

        // 우리가 원하는 메모리 타입의 속성을 알았으니, 실제로 우리가 사용할 물리적인 디바이스(GPU)에서 해당 속성을 지원하는 메모리 타입이 있는지를 확인해보자.
        const VkMemoryPropertyFlags vkMemoryPropertyFlags = VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT;
		for (uint32 uMemoryTypeIndex = 0; uMemoryTypeIndex < vkPhysicalDeviceMemoryProperties.memoryTypeCount; ++uMemoryTypeIndex)
		{
			if ((vkMemoryRequirements.memoryTypeBits & 1) == 1)
			{
                const VkMemoryType& vkMemoryType = vkPhysicalDeviceMemoryProperties.memoryTypes[uMemoryTypeIndex];
				// 만약 사용 가능한 타입이라면, 우리가 원하는 속성을 지원하는가?
				if ((vkMemoryType.propertyFlags & vkMemoryPropertyFlags) == vkMemoryPropertyFlags)
				{
                    // 해당 메모리 타입을 사용하는 힙이 우리가 할당할 버퍼 정도는 감당할 정도의 크기를 갖는가?
                    if (vkPhysicalDeviceMemoryProperties.memoryHeaps[vkMemoryType.heapIndex].size >= vkMemoryAllocateInfo.allocationSize)
                    {
					    vkMemoryAllocateInfo.memoryTypeIndex = uMemoryTypeIndex;
                        break;
                    }
				}
			}
			vkMemoryRequirements.memoryTypeBits >>= 1;
		}
		
        // 필요한 메모리의 크기, 용도에 맞는 메모리 타입, 충분한 크기의 힙이 주어졌을 때, 이 조건을 만족하는 디바이스 메모리를 할당한다.
        vkAllocateMemory(vkDevice, &vkMemoryAllocateInfo, nullptr, &vkVertexBufferDeviceMemory);

        // 버퍼 핸들과 할당된 메모리를 bind해준다
        vkBindBufferMemory(vkDevice, vkVertexBuffer, vkVertexBufferDeviceMemory, /* memoryOffset = */ 0);
        // 일종의 포인터인 셈인데, 마지막 숫자는 버퍼 핸들이 할당된 메모리의 몇번째 바이트부터 가리킬지를 정해주는 것이다.
        // uint8* vkVertexBuffer = vkVertexBufferDeviceMemory + memoryOffset; 과 같은 셈

        // 이제 메모리에 실제 vertex 정보를 올려보자. 그러려면 우선 CPU로 버퍼 메모리를 가져와야 하므로 map을 해줘야 한다.
        uint8* pVertexData = nullptr;
        vkMapMemory(vkDevice, vkVertexBufferDeviceMemory, /* offset = */ 0, memoryAllocationSize, /* flags = */ 0, reinterpret_cast<void**>(&pVertexData));

        // 이제 vertex 데이터를 pVertexData에 복사해주면 된다.
        ::memcpy(pVertexData, aVertices, sizeof(aVertices));

        // 복사가 끝났으니 동기화를 해주면 된다.
        // 해당 버퍼 메모리가 할당된 힙의 메모리 타입은 캐시 일관성을 제공했기에 동기화가 잘 된다.
        vkUnmapMemory(vkDevice, vkVertexBufferDeviceMemory);

        // 이제 pipeline에 vertex buffer를 bind를 해주면 된다.
        ... // pipeline binding
        VkBuffer aVertexBuffers[] = { vkVertexBuffer };
        VkDeviceSize aOffsets[] = { 0 };

        vkCmdBindVertexBuffers(vkCommandBuffer, /* firstBinding = */ 0, /* bindingCount = */ 1, aVertexBuffers, aOffsets);
        // firstBinding: 이 command에서 처리할 첫번째 vertex input binding index.
        ... // 기타 command recording 등등 및 gpu wait

        // 버퍼 핸들을 없애주고
        vkDestroyBuffer(vkDevice, vkVertexBuffer, nullptr);
        // 버퍼가 가리켰던 메모리를 해제해준다.
        vkFreeMemory(vkDevice, vkVertexBufferDeviceMemory, nullptr);
    }
```
