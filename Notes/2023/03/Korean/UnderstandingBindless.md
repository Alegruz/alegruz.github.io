# Bindless 이해하기 (2023.03.22)
[Home](/)

# 1. Bindless란?

계속해서 실시간 그래픽스의 트렌드는 CPU보다 GPU에 많은 일을 시키는 것에 집중되어오고 있다. Direct3D 11와 OpenGL 세대에서 Direct3D 12, Vulkan, Metal 세대로 넘어가는 가장 중요한 철학적 변화가 바로 CPU와 GPU의 비동기적 실행이기 때문이다. 과거에는 CPU 코드에서 `Render()`와 같은 함수를 호출하여 GPU에게 일을 시키면 해당 일이 종료될 때까지 해당 함수가 반환하지 않았다. 즉, GPU가 열심히 일을 하는 동안 CPU는 이걸 평생 기다리고 있어야 했던 것이다. 이것을 방지하기 위해 따로 렌더링은 전용 스레드를 생성하는 식으로 하곤 했다. 이외에도 병렬적으로 렌더링을 할 수 있도록 여려 GPU 명령들을 기록할 수 있도록 render context를 여러 개로 둘 수 있도록 기능을 제공하기도 한다.

Bindless는 이러한 철학을 공유하는 방법으로, bindless를 이해하려면 우선 이를 통해 무엇을 해결, 혹은 개선하려는 지를 파악해보면 된다.

## 1.1. Resource Binding

GPU에 명령을 기록하게 되면 각 명령이 요구하는 매개변수를 입력변수로 넣어주어야 한다. 대표적인 것 중 하나가 shader 쪽의 자원들로, 텍스처라든가, constant buffer와 같은 여러 리소스를 각 pipeline에 대응하는 root signature에 알맞게 binding을 해주어야 한다. 자연스레 이 모든 작업은 CPU에서 이루어져야 한다.

Pipeline의 구조가 단순하고, 자원의 사용도 일원화 되어 있거나 단순한 편이라면 크게 성능에 영향을 주지 않을 수도 있을 것이다. 그러나 AAA 급 게임에서는 얘기가 다르다. AAA 급 게임에서는 GPU를 다방면으로 사용하고 싶어하고, 더 아름다운 렌더링을 위해 다양한 pipeline을 사용하게 된다. 이렇게 되면 그때 그때 필요한 pipeline에 일일이 resource를 binding을 해주어야 한다. 이것을 CPU가 아닌 GPU에게 시키자는 것이 bindless의 요지라고 할 수 있다.

우선 혹시나 까먹은 독자들을 위해 binding의 개념을 짚고 넘어가보자.

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

Texture2D g_texture : register(t0, space0);
SamplerState g_sampler : register(s0, space0);

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

프로그램이라는 것은 `int main()`처럼 실행할 함수, 즉 **진입점entry point**이 존재한다는 것이다. 여기서 우리는 pixel shader만 보도록 하자. 예를 들어 `PSMain`이라는 함수를 entry point로 설정한 pixel shader를 실행하고 싶다고 가정하자. 함수 `PSMain`의 매개변수(`position`, `uv`) 자체는 rendering pipeline에 따라서 래스터기의 출력일 것이다. Vertex shader의 entry point인 `VSMain`의 출력인 `PSInput`의 데이터 구조 그대로 이어지는 것이다. 그렇다면 `g_texture`이나 `g_sampler`와 같이 전역적으로 사용할 수 있는 *근본적인root* 변수들은 어디서 넘어오게 되는 걸까? 당연히 CPU 쪽 클라이언트 코드에서 넘겨줘야 한다.

```cpp
// Create the root signature.
{
    // 쉐이더 코드가 요구하는 입력변수들의 목록, "Root Signature"
    // 함수에서 요구하는 입력변수의 생김새도 function signature라고 하듯이, 동일하게 이해하면 된다.
    D3D12_FEATURE_DATA_ROOT_SIGNATURE featureData = {};

    ...

    // g_texture에 대응하는 변수에 대한 정보, "Descriptor"
    // 동일한 type의 Descriptor들의 연속 집합, "Descriptor Range"
    CD3DX12_DESCRIPTOR_RANGE1 ranges[1];
    ranges[0].Init(D3D12_DESCRIPTOR_RANGE_TYPE_SRV, 1, 0, 0, D3D12_DESCRIPTOR_RANGE_FLAG_DATA_STATIC);

    // 함수 시그니처의 한 매개변수를 parameter라고 하듯, 쉐이더의 root signature의 한 매개변수를 root parameter라 부른다.
    CD3DX12_ROOT_PARAMETER1 rootParameters[1];
    // Root parameter의 타입은 root constant, root descriptor, 혹은 descriptor table이다.
    // Descriptor table은 사실상 descriptor의 배열이라고 생각하면 된다.
    // 실제 descriptor들은 heap에 저장되어 있을 때, 이 heap의 연속된 일부분을 바라보는, 마치 array view와 같은 존재이다. 
    rootParameters[0].InitAsDescriptorTable(1, &ranges[0], D3D12_SHADER_VISIBILITY_PIXEL);

    // Sampler는 특수하게 처리한다.
    // 따로 리소스를 연동해주는 것이 아닌, 일종의 설정값이기 때문이다.
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

Student student(desc);
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
1. `t0`, `space0` 레지스터에 2D texture : SRV
2. `s0`, `space0` 레지스터에 sampler    : Sampler

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

pDevice->CreateShaderResourceView(pTexture.Get(), &srvDesc, srvHandle);
```

#### 1.2.1.1. Descriptor Handle

위의 코드에서 아직 다루지 않은 변수는 바로 `ID3D12Device::CreateShaderResourceView` 함수의 세번째 입력변수, `srvHandle`이다. 보통 우리가 어떤 data를 생성한다고 하면:

```cpp
SomeData* data = new SomeData(dataDesc);
```

위와 같이 생성을 해주면 운영체제에서 알아서 heap에 `sizeof(SomeData)` 크기의 메모리를 찾아 해당 메모리의 시작 주소를 `data` 값으로 준 다음, 동적 할당을 진행하게 된다. 그러나 우리가 현재 생성하려는 정보는 따로 동적 할당을 통해 생성하는 것이 아닌 graphics API를 통해서 할당을 하게 되므로 주어진 API를 사용해야 한다. 이때 Direct3D의 경우 descriptor handle이라는 개념을 통해 포인터를 대체하게 된다. **Descriptor handle**이란 포인터는 아닌데, 포인터처럼 어떤 개체의 고유한 주소를 의미하는 개체이다. 근데 동적 할당과는 다르게 메모리 할당과 생성이 동시에 이러나는 것이 아니라, 우선 먼저 개발자가 저장할 주소를 찾아서 거기에 SRV를 생성해주는 식이다. 그렇다면 우선 handle을 구해야할텐데, 그럼 도대체 어디서 구해야하는걸까? RAM에 직접 할당해놓고 거기를 가리키는 임의의 주소를 사용하면 될까?

### 1.2.2. Descriptor Heap

Descriptor는 descriptor heap이라고 부르는 공간에 저장하게 되어있다. 이 heap은 CPU에서 말하는 heap처럼 운영체제가 프로그램 실행 시 미리 할당을 해두어 프로그래머가 마음 껏 사용할 수 있는 것이 아니다. Descriptor heap은 프로그래머 직접 적절한 API 함수 호출을 통해 생성해주어야 한다. Heap은 크게 CBV, UAV, SRV 전용 heap과 sampler 전용 heap이 있다. 우리의 경우 두 가지 heap이 필요해지는 것이다.

Descriptor heap을 우선 구현해보자:

```cpp
ComPtr<ID3D12Device>    pDevice;
ComPtr<ID3D12DescriptorHeap> pSrvHeap;
...
// Describe and create a shader resource view (SRV) heap for the texture.
D3D12_DESCRIPTOR_HEAP_DESC srvHeapDesc =
{
    // g_Texture는 SRV!!
    .Type = D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV;
    // 필요한 descriptor 중 CBV/SRV/UAV에 해당하는 것은 g_Texture 하나이다.
    .NumDescriptors = 1;
    // 쉐이더에서 이 heap에 저장된 descriptor를 사용하는 지 여부.
    // 반대로 RTV, DSV처럼 쉐이더에서 직접 사용하지 않는 리소스들은 visible이 아니다.
    // Staging 느낌으로 descriptor 시스템을 사용한다면 마찬가지로 visible을 빼주면 된다.
    .Flags = D3D12_DESCRIPTOR_HEAP_FLAG_SHADER_VISIBLE;
};
ThrowIfFailed(pDevice->CreateDescriptorHeap(&srvHeapDesc, IID_PPV_ARGS(&pSrvHeap)));
```

GPU에서 사용할 입력변수를 설명할 descriptor를 담은 descriptor heap을 만들어주었으니, 이제 GPU에서 참고할 수 있도록 해줘야 한다. 즉, GPU 명령을 기록할 때 명령에서 사용할 descriptor heap이 어떤 것이느냐를 설정을 해줘야 한다!!

```cpp
ComPtr<ID3D12GraphicsCommandList> pCommandList;
ComPtr<ID3D12DescriptorHeap> pSrvHeap;
...
ID3D12DescriptorHeap* ppHeaps[] = { pSrvHeap.Get() };
pCommandList->SetDescriptorHeaps( __countof(ppHeaps), ppHeaps );
...
```

이제 다시 원래 질문으로 돌아가보자. 메모리에 해당하는 heap을 만들었으니, 실제 descriptor를 가리킬 포인터에 해당하는 descriptor handle을 만들 차례이다. 실제 프로그램에서 heap에 접근을 pointer로 하듯이, descriptor heap은 descriptor handle로 접근을 한다. 자연스레 descriptor heap 내부를 indexing하는 방법이 필요해진다. 일반 프로그램에서 heap에 4 바이트짜리 `int` 원소 4 개로 이루어진 배열을 할당한다고 해보자. 이때 배열의 첫번째 원소의 주소가 1024 였다면 자연스레 두번째 원소의 주소는 1024 + 원소의 크기 4 바이트인 1028가 된다. Descriptor heap도 마찬가지이다. Descriptor heap의 시작 주소를 `startAddress`라고 한다면, `startAddress` + `descriptorOffset`의 형태로 descriptor handle을 구할 수 있다. 이때 `descriptorOffset`은 구하려는 descriptor의 위치에 따라 값을 조정하면 되는 것이다. 예를 들어 현재 descriptor heap 안에 처음부터 순서대로 CBV 3 개, UAV 2 개가 있었다고 가정해보자. 여기서 우리는 첫번째 UAV를 구한다고 가정해보자. 우선 CPU 코드로 상상해서 구해보자:

```cpp
// sizeof(SRV) == sizeof(UAV) == sizeof(CBV)
void* pDescriptorHeap = malloc( sizeof(SRV) * 5 );

const void* pDescriptorHeapStartHandle = pDescriptorHeap;

const void* pFirstCbvHandle = pDescriptorHeapStartHandle;
const void* pSecondCbvHandle = pDescriptorHeapStartHandle + sizeof(CBV);
const void* pThirdCbvHandle = pDescriptorHeapStartHandle + 2 * sizeof(CBV);
const void* pFirstUavHandle = pDescriptorHeapStartHandle + 3 * sizeof(CBV);
const void* pSecondUavHandle = pDescriptorHeapStartHandle + 4 * sizeof(CBV);
```

위의 코드를 그대로 Direct3D 12로 치환하면 다음과 같다:

```cpp
ComPtr<ID3D12Device>    pDevice;
ComPtr<ID3D12DescriptorHeap> pSrvHeap;
...
D3D12_DESCRIPTOR_HEAP_DESC srvHeapDesc =
{
    .Type = D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV;
    .NumDescriptors = 5;
    .Flags = D3D12_DESCRIPTOR_HEAP_FLAG_SHADER_VISIBLE;
};
ThrowIfFailed(m_device->CreateDescriptorHeap(&srvHeapDesc, IID_PPV_ARGS(&pSrvHeap)));
...
const UINT64 sizeOfDescriptorHandle = static_cast<UINT64>(pDevice->GetDescriptorHandleIncrementSize(srvHeapDesc.Type));
const D3D12_CPU_DESCRIPTOR_HANDLE hDescriptorHeapStartCpuHandle = pSrvHeap->GetCPUDescriptorHandleForHeapStart();

const D3D12_CPU_DESCRIPTOR_HANDLE hFirstCbvCpuHandle   = { .ptr = hDescriptorHeapStartCpuHandle.ptr }
const D3D12_CPU_DESCRIPTOR_HANDLE hSecondCbvCpuHandle  = { .ptr = hDescriptorHeapStartCpuHandle.ptr + 1 * sizeOfDescriptorHandle };
const D3D12_CPU_DESCRIPTOR_HANDLE hThirdCbvCpuHandle   = { .ptr = hDescriptorHeapStartCpuHandle.ptr + 2 * sizeOfDescriptorHandle };
const D3D12_CPU_DESCRIPTOR_HANDLE hFirstUavCpuHandle   = { .ptr = hDescriptorHeapStartCpuHandle.ptr + 3 * sizeOfDescriptorHandle };
const D3D12_CPU_DESCRIPTOR_HANDLE hSecondUavCpuHandle  = { .ptr = hDescriptorHeapStartCpuHandle.ptr + 4 * sizeOfDescriptorHandle };

const D3D12_GPU_DESCRIPTOR_HANDLE hDescriptorHeapStartGpuHandle = pSrvHeap->GetGPUDescriptorHandleForHeapStart();

const D3D12_GPU_DESCRIPTOR_HANDLE hFirstCbvGpuHandle   = { .ptr = hDescriptorHeapStartGpuHandle.ptr }
const D3D12_GPU_DESCRIPTOR_HANDLE hSecondCbvGpuHandle  = { .ptr = hDescriptorHeapStartGpuHandle.ptr + 1 * sizeOfDescriptorHandle };
const D3D12_GPU_DESCRIPTOR_HANDLE hThirdCbvGpuHandle   = { .ptr = hDescriptorHeapStartGpuHandle.ptr + 2 * sizeOfDescriptorHandle };
const D3D12_GPU_DESCRIPTOR_HANDLE hFirstUavGpuHandle   = { .ptr = hDescriptorHeapStartGpuHandle.ptr + 3 * sizeOfDescriptorHandle };
const D3D12_GPU_DESCRIPTOR_HANDLE hSecondUavGpuHandle  = { .ptr = hDescriptorHeapStartGpuHandle.ptr + 4 * sizeOfDescriptorHandle };
```

### 1.2.3. Creating Descriptor

이제 Descriptor가 있으니, 실제 리소스 연동을 해주면 된다. 결국 쉐이더가 접근해야 하는 것은 실제 리소스(텍스처, constant buffer 등)이고, descriptor는 그저 해당 리소스를 접근할 때 필요한 정보를 담고 있을 뿐이다.

#### 1.2.3.1. Shader Resource View (SRV)

```cpp
// create an SRV.
ComPtr<ID3D12Device>    pDevice;
ComPtr<ID3D12DescriptorHeap> pSrvHeap;
ComPtr<ID3D12Resource>  pTexture;
...

D3D12_SHADER_RESOURCE_VIEW_DESC srvDesc =
...

const D3D12_CPU_DESCRIPTOR_HANDLE hSrvHeapStart = pSrvHeap->GetCPUDescriptorHandleForHeapStart();
D3D12_CPU_DESCRIPTOR_HANDLE hTextureDescriptor = hSrvHeapStart; // First texture. g_Texture
pDevice->CreateShaderResourceView(pTexture.Get(), &srvDesc, hTextureDescriptor);
```

위의 함수 호출로 SRV를 저장한 descriptor heap의 첫번째 descriptor가 `pTexture`를 참고할 때 필요한 모든 정보를 들고 있게 된다.

#### 1.2.3.2. Constant Buffer View (CBV)

```cpp
ComPtr<ID3D12Device>    pDevice;
ComPtr<ID3D12DescriptorHeap> pCbvHeap;
ComPtr<ID3D12Resource>  pConstantBuffer;
...
D3D12_CONSTANT_BUFFER_VIEW_DESC cbvDesc = 
{
    .BufferLocation = pConstantBuffer->GetGPUVirtualAddress(),
    .SizeInBytes = (sizeof(ConstantBuffer) + 255) & ~255,    // CB size is required to be 256-byte aligned.
};
const D3D12_CPU_DESCRIPTOR_HANDLE hCbvHeapStart = pCbvHeap->GetCPUDescriptorHandleForHeapStart();
D3D12_CPU_DESCRIPTOR_HANDLE hConstantBufferDescriptor = hCbvHeapStart; // First constant buffer
pDevice->CreateConstantBufferView(&cbvDesc, hConstantBufferDescriptor);
```

View에서 리소스의 주소를 BufferLocation으로 넘겨주어 descriptor와 리소스 간의 연결이 보장된다.

#### 1.2.3.3. Unordered Access View (UAV)

```cpp
ComPtr<ID3D12Device>    pDevice;
ComPtr<ID3D12DescriptorHeap> pCbvHeap;
ComPtr<ID3D12Resource>  pIndirectCommandBuffer;
...
D3D12_UNORDERED_ACCESS_VIEW_DESC uavDesc = 
{
    .Format = DXGI_FORMAT_UNKNOWN,
    .ViewDimension = D3D12_UAV_DIMENSION_BUFFER,
    .Buffer =
    {
        .FirstElement = 0,
        .NumElements = TriangleCount,
        .StructureByteStride = sizeof(IndirectCommand),
        .CounterOffsetInBytes = CommandBufferSizePerFrame,
        .Flags = D3D12_BUFFER_UAV_FLAG_NONE,
    },
};

const D3D12_CPU_DESCRIPTOR_HANDLE hCbvHeapStart = pCbvHeap->GetCPUDescriptorHandleForHeapStart();
D3D12_CPU_DESCRIPTOR_HANDLE hBufferDescriptor = hCbvHeapStart; // First buffer to
pDevice->CreateUnorderedAccessView(            
    pIndirectCommandBuffer.Get(),
    pIndirectCommandBuffer.Get(),
    &uavDesc,
    hBufferDescriptor);
```

위의 함수 호출로 buffer의 descriptor가 `pIndirectCommandBuffer`를 참고할 때 필요한 모든 정보를 들고 있게 된다.

#### 1.2.3.4. Sampler

Sampler는 따로 리소스로 만들어서 연결해주는 것이 아니라 일종의 셋팅 값을 주는 것이다.

[참고 링크](https://learn.microsoft.com/en-us/windows/win32/direct3d12/creating-descriptors#sampler)

### 1.2.4. Root Signature

함수도 signature라는 용어가 있다.

```cpp
ReturnType FunctionName(ParameterType0 parameter0, ParameterType1 parameter1, ...);
```

위와 같이 함수의 signature라는 것은 일종의 함수의 type, 즉 함수를 선언하기 위한 최소 조건이다. 위에서 알 수 있듯이 함수의 signature는 반환형return type과 여러 매개변수parameter로 구성한다. 쉐이더 프로그램도 마찬가지다. 단, 쉐이더는 각 단계별로 signature를 갖지 않고, 한 파이프라인 단위로 signature를 갖는다. 이렇듯 한 파이프라인의 프로그램을 한 함수라고 생각한다면, 이 함수의 시그니처를 root signature라 부른다. 자연스레 해당 함수의 각 매개변수는 root parameter라는 용어로 부른다.

Root parameter는 세 가지 type을 가질 수 있다:

1. Root Constant
2. Root Descriptor
3. Descriptor Table

#### 1.2.4.1. Root Constant

Root constant는 따로 descriptor를 명시적으로 생성하는 것이 아닌, 직접 상수 값을 제공하여 resource binding을 하는 방법이다.

예를 들어:

```cpp
// Pseudo-code for a root signature
void GraphicsPipeline(const uint32 constant);
```

위와 같이 root signature를 구축했다면, 실제 렌더링할 땐

```cpp
// Pseudo-code for GPU execution
uint32 constantValue;
...
GraphicsPipeline(constantValue);
```

실제 코드로 이해해보자:

```cpp
ComPtr<ID3D12Device>    pDevice;
ComPtr<ID3D12RootSignature> pRootSignature;
ComPtr<ID3D12GraphicsCommandList>   pCommandList;
uint32  constantValue;
...
// Root signature creation
CD3DX12_ROOT_PARAMETER1 rootParameters[1] = { };
rootParameters[0].InitAsConstants(/* Number of 32 bit Values */1, /* register index */0, /* register space*/0);

CD3DX12_VERSIONED_ROOT_SIGNATURE_DESC rootSignatureDesc(
    ARRAYSIZE(rootParameters), rootParameters, 0, nullptr,
    D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT
);

ComPtr<ID3DBlob> signature;
ComPtr<ID3DBlob> error;
D3D12SerializeVersionedRootSignature(&rootSignatureDesc, &signature, &error);

pDevice->CreateRootSignature(
    0,
    signature->GetBufferPointer(),
    signature->GetBufferSize(),
    IID_PPV_ARGS(pRootSignature.ReleaseAndGetAddressOf())
);
...
// Rendering
pCommandList->SetGraphicsRootSignature(pRootSignature.Get());
...
pCommandList->SetGraphicsRoot32BitConstant(0, constantValue, 0);
```

이외에도 [`ID3D12GraphicsCommandList::SetGraphicsRoot32BitConstants`](https://learn.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-setgraphicsroot32bitconstants) 함수도 동일한 역할을 한다. 위의 예시에서는 4 바이트 상수 하나를, 이 함수는 4 바이트 상수의 배열을 binding해줄 뿐이다.

#### 1.2.4.2. Root Descriptor

Root descriptor은 직접 descriptor를 binding 해주는 방법이다.

예를 들어:

```cpp
// Pseudo-code for a root signature
void GraphicsPipeline(RootDescriptor* descriptor);
```

위와 같이 root signature를 구축했다면, 실제 렌더링할 땐

```cpp
// Pseudo-code for GPU execution
GpuResource constantBuffer;
DescriptorHeap heap;
...
const RootDescriptor* constantBufferDescriptorHandle = heap.FindResource(constantBuffer);
GraphicsPipeline(constantBufferDescriptorHandle);
```

실제 코드로 이해해보자:

```cpp
ComPtr<ID3D12Device>    pDevice;
ComPtr<ID3D12RootSignature> pRootSignature;
ComPtr<ID3D12GraphicsCommandList>   pCommandList;
ComPtr<ID3D12Resource>  pConstantBuffer;
...
// Root signature creation
CD3DX12_ROOT_PARAMETER1 rootParameters[1] = { };
rootParameters[0].InitAsConstantBufferView(/* register index */0, /* register space*/0);

CD3DX12_VERSIONED_ROOT_SIGNATURE_DESC rootSignatureDesc(
    ARRAYSIZE(rootParameters), rootParameters, 0, nullptr,
    D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT
);

ComPtr<ID3DBlob> signature;
ComPtr<ID3DBlob> error;
D3D12SerializeVersionedRootSignature(&rootSignatureDesc, &signature, &error);

pDevice->CreateRootSignature(
    0,
    signature->GetBufferPointer(),
    signature->GetBufferSize(),
    IID_PPV_ARGS(pRootSignature.ReleaseAndGetAddressOf())
);
...
// Rendering
pCommandList->SetGraphicsRootSignature(pRootSignature.Get());
...
pCommandList->SetGraphicsRootConstantBufferView(0, pConstantBuffer->GetGpuVirtualAddress());
```

당연히 CBV 말고도 [SRV](ID3D12GraphicsCommandList::SetGraphicsRootShaderResourceView), [UAV](https://learn.microsoft.com/en-us/windows/win32/api/d3d12/nf-d3d12-id3d12graphicscommandlist-setgraphicsrootunorderedaccessview)도 가능하다.

#### 1.2.4.3. Descriptor Table

Descriptor table은 일종의 parameter struct와 비슷한 존재이다. binding을 할 descriptor가 워낙 많다보니 이걸 하나의 구조체로 묶어서 parameter로 넘기는 것이다!!

예를 들어:

```cpp
// Pseudo-code for a root signature
void GraphicsPipeline(const DescriptorTable& srvTable, const DescriptorTable& samplerTable,const DescriptorTable& cbvTable );
```

위와 같이 root signature를 구축했다면, 실제 렌더링할 땐

```cpp
// Pseudo-code for GPU execution
using DescriptorHeap = Array<Descriptor>;
using DescriptorRange = ArrayView<Descriptor>;

constexpr const size_t NUM_CBVS = 256;
constexpr const size_t NUM_SRVS = 128;
constexpr const size_t NUM_DESCRIPTORS = NUM_CBVS + NUM_SRVS;
constexpr const size_t NUM_SAMPLERS = 1;
DescriptorHeap heap(NUM_DESCRIPTORS);   // cbv0 cbv1 ... cbv255 srv0 srv1 ... srv127
DescriptorHeap samplerHeap(NUM_SAMPLERS);
...
// SRV
const size_t srvStartIndex = NUM_CBVS;
const size_t numSrvsToBind = NUM_SRVS;
DescriptorRange srvRange(heap, srvStartIndex, numSrvsToBind, eDescriptorType::SRV);
DescriptorTable srvTable(srvRange);

// Sampler
const size_t samplerStartIndex = 0;
const size_t numSamplersToBind = 1;
DescriptorRange samplerRange(samplerHeap, samplerStartIndex, numSamplersToBind, eDescriptorType::Sampler);
DescriptorTable samplerTable(samplerRange);

// CBV
const size_t numCbvsToBind = 1;

for (size_t cbvStartIndex = 0; cbvStartIndex < NUM_CBVS; cbvStartIndex += numCbvsToBind)
{
    DescriptorRange cbvRange(heap, cbvStartIndex, numCbvsToBind, eDescriptorType::CBV);
    DescriptorTable cbvTable(cbvRange);
    
    GraphicsPipeline(srvTable, samplerTable, cbvTable);
}
```

실제 코드로 이해해보자:

```cpp
ComPtr<ID3D12Device>    pDevice;
ComPtr<ID3D12RootSignature> pRootSignature;
ComPtr<ID3D12GraphicsCommandList>   pCommandList;
ComPtr<ID3D12Resource>  pConstantBuffer;
ComPtr<ID3D12DescriptorHeap> pCbvSrvHeap;
ComPtr<ID3D12DescriptorHeap> pSamplerHeap;
...
// Root signature creation
CD3DX12_DESCRIPTOR_RANGE1 ranges[3];
ranges[0].Init(D3D12_DESCRIPTOR_RANGE_TYPE_SRV, NUM_SRVS, 0, 0, D3D12_DESCRIPTOR_RANGE_FLAG_DATA_STATIC);
ranges[1].Init(D3D12_DESCRIPTOR_RANGE_TYPE_SAMPLER, NUM_SAMPLERS, 0);
ranges[2].Init(D3D12_DESCRIPTOR_RANGE_TYPE_CBV, NUM_CBVS, 0, 0, D3D12_DESCRIPTOR_RANGE_FLAG_DATA_STATIC);

CD3DX12_ROOT_PARAMETER1 rootParameters[3];
rootParameters[0].InitAsDescriptorTable(1, &ranges[0], D3D12_SHADER_VISIBILITY_PIXEL);
rootParameters[1].InitAsDescriptorTable(1, &ranges[1], D3D12_SHADER_VISIBILITY_PIXEL);
rootParameters[2].InitAsDescriptorTable(1, &ranges[2], D3D12_SHADER_VISIBILITY_VERTEX);

CD3DX12_VERSIONED_ROOT_SIGNATURE_DESC rootSignatureDesc(
    ARRAYSIZE(rootParameters), rootParameters, 0, nullptr,
    D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT
);

ComPtr<ID3DBlob> signature;
ComPtr<ID3DBlob> error;
D3D12SerializeVersionedRootSignature(&rootSignatureDesc, &signature, &error);

pDevice->CreateRootSignature(
    0,
    signature->GetBufferPointer(),
    signature->GetBufferSize(),
    IID_PPV_ARGS(pRootSignature.ReleaseAndGetAddressOf())
);
...
// Rendering
pCommandList->SetGraphicsRootSignature(pRootSignature.Get());
...
pCommandList->SetGraphicsRootDescriptorTable(0, pCbvSrvHeap->GetGPUDescriptorHandleForHeapStart());
pCommandList->SetGraphicsRootDescriptorTable(1, pSamplerHeap->GetGPUDescriptorHandleForHeapStart());

CD3DX12_GPU_DESCRIPTOR_HANDLE cbvSrvHandle(pCbvSrvHeap->GetGPUDescriptorHandleForHeapStart(), 0, cbvSrvDescriptorSize);
for (size_t i = 0; i < NUM_CBVS; ++i)
{
    pCommandList->SetGraphicsRootDescriptorTable(2, cbvSrvHandle);
    cbvSrvHandle.Offset(cbvSrvDescriptorSize);
        
    pCommandList->DrawIndexedInstanced(numIndices, 1, 0, 0, 0);
}
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
