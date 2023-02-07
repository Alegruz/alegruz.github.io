# Direct3D 12 이해하기 (2023.01.10)
[Home](/README.md)

**※ 이 글은 Direct3D 11로 간단한 3D 렌더러를 만들어 본 이들을 대상으로 작성된 글임.**

윈10에서 3D 게임을 만드려면 결국 Direct3D 12로 만들어야 함. 당연히 요즘 GPU들 다 Direct3D 12 지원하고 있음.

기본적으로 다들 윈10 깔려있고, 프로그래머로서 Visual Studio 깔았으면 Windows 10 SDK도 깔려있을 것임. 여기에 이미 Direct3D 다 같이 나오니까 따로 뭔가를 깔 필요가 없음. 그냥 프로젝트에 `d3d12.h` 추가하고 `d3d12.lib`에 링크만 해주거나, `d3d12.dll`에 엔트리 포인트 직접 찾아주면 됨.

요즘은 또 마소에서 헬퍼 헤더를 잘 만들어서 사실상 필수라고 생각하면 됨. [`d3d12x.h`](https://github.com/microsoft/DirectX-Headers/blob/main/include/directx/d3dx12.h) 받아서 쓰도록.

# 대표적인 차이점

원래 Direct3D 11에서는 device로 만들고, immediate context로 실행한다는 느낌이었음. 근데 Direct3D 12에서부터는 immediate context를 없애버림. 이걸 통해서 멀티 스레딩을 가능케 만들었음. 그리고 Direct3D 11 때는 알아서 렌더링 호출들을 GPU로 그룹 지어서 넣어줬는데, Direct3D 12 때부터는 이걸 다 직접해줘야함. 즉 Direct3D 11 때는 그냥 `Draw` 호출하면 끝이었는데, 이제는 여러 명령들을 직접 자료구조로 그룹 지어서 GPU로 넘겨줘야함. 그리고 `Draw` 호출을 하는 순간 렌더링 끝날 때까지 대기했었는데, 이제는 GPU에 업무를 주고 언제 끝날지 확인하는 업무를 다 직접 해줘야 함.

## Immediate context 삭제

immediate context가 진짜 많은 것들을 원래 해줬었음. 대표적으로:

* GPU subresource 업뎃하기
* RTV 클리어하기
* DSV 클리어하기
* IA에 primitive topology 셋팅해주기
* IA에 VB 셋팅해주기
* IA에 IB 셋팅해주기
* IA에 input layout 셋팅해주기
* VS/PS에 셰이더 셋팅해주기
* VS/PS에 CB 셋팅해주기
* PS에 SRV 셋팅해주기
* PS에 샘플러 셋팅해주기
* RS에 viewport 셋팅해주기
* OM에 RT 셋팅해주기
* Draw/dispatch 하기

근데 이제 이거를 전부 하나의 독립적인 command로 간주하겠다는 것임. 이제 이런 모든 command들은 immediate context가 아닌 command list라는 개체가 호출하게 됨. immediate context랑 기능적으론 거의 같다고 보면 되는데, immediate context랑은 다르게 여러 command list가 동시에 존재하고, 동시에 command를 기록할 수 있어 병렬성을 줄 수 있음.

예를 들어 렌더링을 할 때 RTV, DSV 클리어하고, 그래픽스 파이프라인에 정보들 다 넣어주고, 최종적으로 draw를 하는 command를 전부 기록한 command list가 있는 것임.

## GPU 업무 그룹화

Command list 하위 계층이 또 있음. 좀 더 세분화한 개념으로, 번들bundle이라 부름. 둘을 구분하자면 일단 첫번째 단계 command list를 보통 direct command list라 부름. 번들이 좋은 이유가, 나중에 다시 써먹으려고 소규모의 API command들을 그룹화 해놓고, 여러 번 반복해서 쓰는 것임. 이러면 미리 pre-process 해두고 실제 실행 때는 실행만 하면 되니 훨씬 효율적일 것임.

## GPU 업무 전달

GPU한테 일을 시키려면 우선 업무 목록인 command list를 담당자에게 전달해야 함. 이때 담당자는 Direct3D device에 붙어있는 command queue임. Direct command list는 여러 번 전달해줘도 되긴 하는데, 동시에 두 개를 하는 게 아니라, 하나를 전달했으면 그 놈이 끝나기 전까지는 다음 걸 전달하지 말고 대기해야 함. 0번째 프레임을 렌더링하라 해놓고 아직 화면에 그리지도 않았는데 1번째 프레임 렌더링하라고 하면 안되잖음;; 물론 bundle은 그런 거 없음 ㅋㅋ 근데 번들을 실행해주려고 직접 command queue에 넣어줄 순 없긴 함.

일반적으로는 API 호출 빌드업은 번들로 하긴 함. 그럼 API 호출이랑 번들이랑 묶어서 command list를 최종적으로 만들고, 만약 여러 개의 command list가 있다면, 그걸 해당 한 프레임에 실행해주면 됨.

![gpu-workitems](https://learn.microsoft.com/en-us/windows/win32/direct3d12/images/gpu-workitems.png)

# 초기화

원래 Direct3D 11에서는 초기화를 한다면 보통 다음과 같이 해줌:

1. 드라이버랑 feature level 바탕으로 **device 생성**
2. Device로부터 DXGI factory 생성하여 **swap chain 생성**
3. Swap chain으로부터 back buffer 받아와서 **RTV 생성**
4. DS 텍스처 생성하여 **DSV 생성**
5. 카메라 초기화
6. 렌더할 객체 초기화

Direct3D 12의 경우 좀 달라지는 부분들이 있음.

## Device 생성

우선 device 생성 코드를 먼저 보겠음:

```cpp
UINT uCreateDeviceFlags = D3D11_CREATE_DEVICE_BGRA_SUPPORT;
#ifdef _DEBUG
uCreateDeviceFlags |= D3D11_CREATE_DEVICE_DEBUG;
#endif

D3D_DRIVER_TYPE driverTypes[] =
{
    D3D_DRIVER_TYPE_HARDWARE,
    D3D_DRIVER_TYPE_WARP,
    D3D_DRIVER_TYPE_REFERENCE,
};
UINT numDriverTypes = ARRAYSIZE(driverTypes);

D3D_FEATURE_LEVEL featureLevels[] =
{
    D3D_FEATURE_LEVEL_11_1,
    D3D_FEATURE_LEVEL_11_0,
    D3D_FEATURE_LEVEL_10_1,
    D3D_FEATURE_LEVEL_10_0,
};
UINT numFeatureLevels = ARRAYSIZE(featureLevels);

for (UINT driverTypeIndex = 0; driverTypeIndex < numDriverTypes; driverTypeIndex++)
{
    m_driverType = driverTypes[driverTypeIndex];
    hr = D3D11CreateDevice(nullptr, m_driverType, nullptr, uCreateDeviceFlags, featureLevels, numFeatureLevels,
        D3D11_SDK_VERSION, m_d3dDevice.GetAddressOf(), &m_featureLevel, m_immediateContext.GetAddressOf());

    if (hr == E_INVALIDARG)
    {
        // DirectX 11.0 platforms will not recognize D3D_FEATURE_LEVEL_11_1 so we need to retry without it
        hr = D3D11CreateDevice(nullptr, m_driverType, nullptr, uCreateDeviceFlags, &featureLevels[1], numFeatureLevels - 1,
            D3D11_SDK_VERSION, m_d3dDevice.GetAddressOf(), &m_featureLevel, m_immediateContext.GetAddressOf());
    }

    if (SUCCEEDED(hr))
    {
        break;
    }
}
if (FAILED(hr))
{
    return hr;
}
```

Direct3D 11에서 device 생성 단계를 크게 네 가지 단계로 구분하자면,

1. 플래그 생성 (디버그 용도)
2. 드라이버 타입 결정
3. Feature level 결정
4. 실제 device 생성

이걸 하나 하나 살펴보도록 하자.

### 플래그 생성 (디버그 용도)

Direct3D 11에서는 device를 생성할 때 따로 flag를 주어서 디버깅 상태임을 알려줄 수 있었음. Direct3D 12에서는 아예 디버깅을 위해 따로 디버그 계층라는 놈을 만들었음. 그렇기 때문에 Direct3D 12에서는 device를 만들기 위해선 반드시 디버그 계층부터 활성화해줘야 함.

이걸 통해서 셰이더 링킹 문제, 자원 바인딩 문제, 매개변수 일관성 검증 등등 여러 가지를 할 수 있게 되었음. 개발자 전용 기능이긴 해서 디버그 계층을 쓰려면 윈10에선 Graphics Tools라는 추가 기능을 설정해야 함. 이거 한국어로는 그래픽 도구였던 것 같은데, System >> Apps & features >> Manage optional Features >> Add a feature에 들어가서 그래픽 도구 추가해주면 됨.

어차피 `d3d12.h`에 다 있으니 따로 추가적으로 뭔갈 추가할 필욘 없음.

이걸로 메모리 누수도 잡을 수 있는데, 따로 이름을 부여해서 어떤 놈이 잘못했는지 잘잘못까지 따질 수 있음. 근데 이름을 부여 안 하면 기본적으로 "\<unnamed\>"라고 나오니 `ID3D12Object::SetName` 함수를 사용해서 이름을 부여하도록 하자. 어차피 디버깅 용도로만 쓰는 거니까 잘 macro로 처리하자.

여튼 이걸 사용하면 텍스처 셋팅 안 해놓고 PS에서 텍스처를 읽으려 한다던가, DS 상태 바인딩 안 했으면서 depth를 출력하려고 한다든가, 텍스처 만들려는데 `INVALIDARG`로 오류가 난다든가하는 흔하게 발생하는 오류들 다 잡을 수 있게되는 것임.

만약 셰이더 컴파일할 때 디버깅 정보 blob에 넣어주고 싶으면 매크로 `D3DCOMPILE_DEBUG`를 1로 정의해주면 됨:

```cpp
#define D3DCOMPILE_DEBUG 1
```

여튼 이런걸 GPU 기반 검증(GPU-based validation)이라고 하는데, 줄여서 GBV라고 부르겠음.

사실상 개발 땐 GBV를 항상 해놓는 게 좋긴 한데, 당연하겠지만 성능을 좀 먹기 때문에 좀 적은 데이터에 대해서만 GBV를 켜두거나, 초반에 집중적으로 써서 성능 문제를 최소화하는 게 좋음. 만약 GBV 처리할 컨텐츠가 좀 많으면 그냥 켜두고 하룻밤 자고 오는 게 나음.

#### 디버그 출력

나중에 보겠지만, Direct3D 12에서는 렌더링이라든가, dispatch와 같은 모든 일들을 GPU에게 "해줘"라고 요청하는 방법은 `ExecuteCommandLists`를 호출하는 것임. Command list라고 해서 시킬 일들 싹 적어둔 목록이 있는 것임. 이때 CPU는 말 그대로 "해줘"만 하고 갈 길 가버림. 즉, 비동기적으로 돈다는 뜻임. 나중에 GPU한테 "야 다 했냐?"라고 물어봐줘야함.

여튼 GPU에서 이 일들을 다 끝내고 나면 GBV가 디버그 출력을 생성해줌. 이때 GPU는 자기대로 뭔가 뭔가 일을 했을테니, 이 타임라인에 따른 디버그 출력물들이 생성됨. 이걸 통해서 셰이더에서 오류가 발생했다면 현재 어떤 draw/dispatch 호출에서, 어떤 객체(command list, queue, PSO 등)에서 발생했는지를 알 수 있게 됨.

#### 예시 디버그 메시지

예를 들어 만약 GPU에서 어떤 한 셰이더가 실행 중일 때 "Main Color Buffer"라는 자원에 접근하려고 봤더니만 UAV 상태였다고 해보자. 이에 따른 디버그 메시지는 다음과 같음:

```
D3D12 ERROR: Incompatible resource state: Resource: 0x0000016F61A6EA80:'Main Color Buffer', 
Subresource Index: [0], 
Descriptor heap index: [0], 
Binding Type In Descriptor: SRV, 
Resource State: D3D12_RESOURCE_STATE_UNORDERED_ACCESS(0x8), 
Shader Stage: PIXEL, 
Root Parameter Index: [0], 
Draw Index: [0], 
Shader Code: E:\FileShare\MiniEngine_GitHub_160128\MiniEngine_GitHub\Core\Shaders\SharpeningUpsamplePS.hlsl(37,2-59), 
Asm Instruction Range: [0x138-0x16b], 
Asm Operand Index: [3], 
Command List: 0x0000016F6F75F740:'CommandList', SRV/UAV/CBV Descriptor Heap: 0x0000016F6F76F280:'Unnamed ID3D12DescriptorHeap Object', 
Sampler Descriptor Heap: <not set>, 
Pipeline State: 0x0000016F572C89F0:'Unnamed ID3D12PipelineState Object',  
[ EXECUTION ERROR #942: GPU_BASED_VALIDATION_INCOMPATIBLE_RESOURCE_STATE]
```

#### 디버그 계층 API

디버그 계층을 켜려면 `EnableDebugLayer`를 호출해줘야하고, GBV를 활성화하려면 `SetEnableGPUBasedValidation`을 호출해야함.


```cpp
DWORD dwDebugFactoryFlags = 0;

ComPtr<ID3D12Debug> pDebugController;

if (SUCCEEDED(D3D12GetDebugInterface(IID_PPV_ARGS(pDebugController.GetAddressOf()))))
{
    pDebugController->EnableDebugLayer();
    LOG(log::eVerbosity::Debug, L"D3D12 Debug Layer enabled");
}
else
{
    LOG(log::eVerbosity::Warn, L"Direct3D Debug Device is not available!");
}

ComPtr<IDXGIInfoQueue> pDxgiInfoQueue;
if (SUCCEEDED(DXGIGetDebugInterface1(0, IID_PPV_ARGS(pDxgiInfoQueue.GetAddressOf()))))
{
    dwDebugFactoryFlags = DXGI_CREATE_FACTORY_DEBUG;

    pDxgiInfoQueue->SetBreakOnSeverity(DXGI_DEBUG_ALL, DXGI_INFO_QUEUE_MESSAGE_SEVERITY_ERROR, true);
    pDxgiInfoQueue->SetBreakOnSeverity(DXGI_DEBUG_ALL, DXGI_INFO_QUEUE_MESSAGE_SEVERITY_CORRUPTION, true);
#if _DEBUG
    pDxgiInfoQueue->SetBreakOnSeverity(DXGI_DEBUG_ALL, DXGI_INFO_QUEUE_MESSAGE_SEVERITY_WARNING, true);
#endif
}
```

어차피 Direct3D 12를 사용한다는 건 윈10 이상이라는 소리니까, DXGI 디버깅 인터페이스를 얻으려면 `CreateDXGIFactory2`를 호출해야 함. 이때 따로 `DXGI_CREATE_FACTORY_DEBUG` 플래그를 줘야하기 때문에 `dwDebugFactoryFlags`를 선언해준 것임.

### 드라이버 타입 결정

Direct3D 12에서는 따로 드라이버를 `D3D_DRIVER_TYPE`의 배열로 만들어서 생성하지 않고, DXGI 어댑터만 직접 찾은 다음 device 생성할 때 입력변수로 전달해줘야 함. 즉, DXGI 어댑터를 먼저 만들어야 하므로, DXGI factory가 필요함!!

Direct3D 11에서는 swap chain을 만들기 위해서 factory가 필요했었음. Factory를 얻기 위해서는 우선 device를 통해 DXGI device를 얻고, 다음과 같이 어댑터와 factory를 얻었었음:

```cpp
// Obtain DXGI factory from device (since we used nullptr for pAdapter above)
ComPtr<IDXGIFactory1> dxgiFactory;
{
    ComPtr<IDXGIDevice> dxgiDevice;
    hr = m_d3dDevice.As(&dxgiDevice);
    if (SUCCEEDED(hr))
    {
        ComPtr<IDXGIAdapter> adapter;
        hr = dxgiDevice->GetAdapter(&adapter);
        if (SUCCEEDED(hr))
        {
            hr = adapter->GetParent(IID_PPV_ARGS(&dxgiFactory));
        }
    }
}
if (FAILED(hr))
{
    return hr;
}
```

Direct3D 12의 경우 아까 위에서 만약 DXGI 디버깅 인터페이스를 얻으려고 했다면

```cpp
ComPtr<IDXGIFactory6> pDxgiFactory;
hr = CreateDXGIFactory2(dwDebugFactoryFlags, IID_PPV_ARGS(pDxgiFactory.GetAddressOf()));
```

과 같이 DXGI factory를 얻으면 됨.

그게 아니라면 

```cpp
ComPtr<IDXGIFactory6> pDxgiFactory;
hr = CreateDXGIFactory1(IID_PPV_ARGS(pDxgiFactory.GetAddressOf()));
```

로 간단하게 얻을 수 있음.

일단 기본적으로는 Direct3D 12를 지원하는 DXGI 어댑터를 찾아서 사용해주면 됨:

```cpp
ComPtr<IDXGIAdapter1> pAdapter;
for (UINT uAdapterIdx = 0; 
     DXGI_ERROR_NOT_FOUND != pDxgiFactory->EnumAdapters1(uAdapterIdx, &pAdapter);
     ++uAdapterIdx)
{
    DXGI_ADAPTER_DESC1 desc;
    hr = pAdapter->GetDesc1(&desc);
    if (FAILED(hr))
    {
        continue;
    }

    if (desc.Flags & DXGI_ADAPTER_FLAG_SOFTWARE)
    {
        // Don't select the Basic Render Driver adapter.
        continue;
    }

    // Check to see if the adapter supports Direct3D 12,
    // but don't create the actual device yet.
    if (SUCCEEDED(D3D12CreateDevice(pAdapter.Get(), D3D_FEATURE_LEVEL_11_0, _uuidof(ID3D12Device), nullptr)))
    {
        break;
    }
}
```

아마 adapter 설정을 Direct3D 11에서 이미 해봤다면 WARP(즉 마소 기본 렌더Microsoft Basic Render 어댑터)나 REFERENCE 등이 떠오르실텐데, 보통 게임에서는 사실상 WARP를 잘 안 쓰니까 여기서는 처리해주지 않음.

근데 여기서 한 가지 더 고려해야하는 게 내장 그래픽이랑 외장 그래픽이 혼용된 하이브리드 시스템의 경우에는 `EnumAdapterByGpuPreference`를 통해 외장 그래픽 `DXGI_GPU_PREFERENCE_HIGH_PERFORMANCE`과 내장 그래픽 `DXGI_GPU_PREFERENCE_MINIMUM_POWER` 간의 선호도를 부여해서 DXGI 어댑터를 고를 수도 있음. 이를 위해선 `IDXGIFactory6` 버전의 인터페이스가 필요함.

```cpp
ComPtr<IDXGIAdapter1> pAdapter1;
ComPtr<IDXGIAdapter4> pAdapter;

DXGI_GPU_PREFERENCE activeGpuPreference = DXGI_GPU_PREFERENCE_HIGH_PERFORMANCE;
for (UINT uAdapterIdx = 0; 
     DXGI_ERROR_NOT_FOUND 
        != pDxgiFactory->EnumAdapterByGpuPreference(uAdapterIdx, 
                                                    activeGpuPreference, 
                                                    IID_PPV_ARGS(pAdapter1.ReleaseAndGetAddressOf())); 
     ++uAdapterIdx)
{
    DXGI_ADAPTER_DESC1 desc;
    hr = pAdapter1->GetDesc1(&desc);
    if (FAILED(hr))
    {
        continue;
    }

    if (desc.Flags & DXGI_ADAPTER_FLAG_SOFTWARE)
    {
        // Don't select the Basic Render Driver adapter aka WARP+VGA driver
        continue;
    }

    // Check to see if the adapter supports Direct3D 12
    // but don't create the actual device yet
    if (SUCCEEDED(D3D12CreateDevice(pAdapter1.Get(), D3D_FEATURE_LEVEL_11_0, __uuidof(ID3D12Device), nullptr)))
    {
        hr = pAdapter1.As(&pAdapter);
        if (FAILED(hr))
        {
            LOGHR(log::eVerbosity::Error, hr);
            return hr;
        }
        break;
    }
}
```

이때 참고로 가장 GPU 전용 메모리가 많은 것을 선택하는 코드들도 존재하긴 하지만, 하이브리드 시스템에서는 위의 코드가 좀 더 의도에 맞을 듯함:

```cpp
ComPtr<IDXGIAdapter1> pAdapter1;
ComPtr<IDXGIAdapter4> pAdapter;

SIZE_T maxDedicatedVideoMemory = 0;
for (UINT uAdapterIdx = 0; DXGI_ERROR_NOT_FOUND != pDxgiFactory->EnumAdapters1(uAdapterIdx, &pAdapter1); ++uAdapterIdx)
{
    DXGI_ADAPTER_DESC1 desc;
    hr = pAdapter1->GetDesc1(&desc);
    if (FAILED(hr))
    {
        continue;
    }

    if (desc.Flags & DXGI_ADAPTER_FLAG_SOFTWARE)
    {
        // Don't select the Basic Render Driver adapter aka WARP+VGA driver
        continue;
    }

    // Check to see if the adapter supports Direct3D 12
    // but don't create the actual device yet
    if (SUCCEEDED(D3D12CreateDevice(pAdapter1.Get(), D3D_FEATURE_LEVEL_11_0, __uuidof(ID3D12Device), nullptr))
        && desc.DedicatedVideoMemory > maxDedicatedVideoMemory)
    {
        maxDedicatedVideoMemory = desc.DedicatedVideoMemory;
        hr = pAdapter1.As(&pAdapter);
        if (FAILED(hr))
        {
            LOGHR(log::eVerbosity::Error, hr);
            return hr;
        }
    }
}
```

혹여라도 Direct3D 12를 돌릴 수 있는 하드웨어가 없다면 개발 단계에서는 일단 WARP로 후퇴하는 것도 유용한 방법임:

```cpp
ComPtr<IDXGIAdapter1> pAdapter1;
if (!pAdapter1)
{
    if (FAILED(pDxgiFactory->EnumWarpAdapter(IID_PPV_ARGS(&pAdapter1))))
    {
        pAdapter1.Reset();
    }
}
```

여기까지 왔는데도 문제가 있다면 그냥 Direct3D 11 쓰라는 하늘의 계시임. `IDXGIFactory1` 쓰라는 뜻.

### 실제 device 생성

Direct3D 11에서는 일단 될 것 같은 Feature level 전부 배열로 때려 넣었는데, Direct3D 12에서는 그냥 최소한의 feature level만 제공하면 됨. 어차피 사실상 요즘 시대에서 feature level 11.0 밑은 없다고 보면 되니까 이걸 최소 단계로 설정하고 코드를 짜면 됨.

```cpp
hr = D3D12CreateDevice(pAdapter1.Get(), D3D_FEATURE_LEVEL_11_0, IID_PPV_ARGS(m_pDevice.ReleaseAndGetAddressOf()));
if (FAILED(hr))
{
    LOGHR(log::eVerbosity::Error, hr);
    return hr;
}
#ifdef _DEBUG
m_pDevice->SetName(L"Renderer::m_pDevice");
#endif
```

와! device!

### Feature level 결정

Feature level이 등장한 이유는 워낙 세상에 그래픽 카드가 많다보니까 이걸 좀 처리하기 위함임. 각 비디오 카드마다 GPU가 설치되어있는데, 이 GPU에 따라 마소 DirectX 기능이 어떤 기준까지 구현이 되어있음. 이 기준이 바로 feature level인거임. 예를 들어 만약 11_0 feature level이라고 하면 Direct3D 11까지의 기능이 구현이 되어있다는 뜻임.

그렇기 때문에 device를 생성할 땐 정확하게 어떤 기능까지 지원하는 device를 생성하는지를 정확하게 결정해야 함. 만약 11_0 feature level으로 device를 생성하려고 했는데 실패한다면 하드웨어가 해당 단계를 지원하지 않는 것임.

기본적으로:

* 모든 Direct3D 12 드라이버는 feature level 11_0 이상임
* Device 생성이 가능하다는 것은 GPU가 해당 feature level까지만 딱 지원하거나, 그 이상을 지원할 수도 있다는 것임.
* feature level은 기능을 축적함. 즉 11_1 단계는 11_0의 모든 기능을 지원함.
* feature level은 성능의 측도가 아님. 그냥 기능이 얼마나 더 추가되었냐는 것임. 성능은 하드웨어빨.
* Device 생성할 때 feature level이 결정됨.
* 어떤 기능을 지원하는지 구체적으로 확인하려면 `CheckFeatureSupport`를 활용하면 됨.

실제로 우리가 얻은 device가 최소 단계보다 더 높은 단계를 얻었는지 좀 알아 보고 싶다면 `CheckFeatureSupport` 써주면 됨:

```cpp
// With the DirectX Agility SDK or the Windows SDK for Windows 11, 
// you can also add D3D_FEATURE_LEVEL_12_2 to the array below.
static const D3D_FEATURE_LEVEL FEATURE_LEVELS[] =
{
    D3D_FEATURE_LEVEL_12_1,
    D3D_FEATURE_LEVEL_12_0,
    D3D_FEATURE_LEVEL_11_1,
    D3D_FEATURE_LEVEL_11_0,
};

D3D12_FEATURE_DATA_FEATURE_LEVELS featureLevels =
{
    .NumFeatureLevels = ARRAYSIZE(FEATURE_LEVELS),
    .pFeatureLevelsRequested = FEATURE_LEVELS,
    .MaxSupportedFeatureLevel = D3D_FEATURE_LEVEL_11_0
};

D3D_FEATURE_LEVEL featureLevel = D3D_FEATURE_LEVEL_11_0;
hr = m_pDevice->CheckFeatureSupport(D3D12_FEATURE_FEATURE_LEVELS, &featureLevels, sizeof(featureLevels));
if (SUCCEEDED(hr))
{
    featureLevel = featureLevels.MaxSupportedFeatureLevel;
}
```

참고로 하드웨어의 feature level이랑 API 버전은 다른 것임. 즉, D3D 11.3 API는 존재하는데 11_3 feature level은 없음.

넘버링 시스템:

* Direct3D 버전은 구두점을 사용함; Direct3D 12.0
* 셰이더 모델은 구두점을 사용함; 셰이더 모델 5.1
* Feature level은 언더바를 사용함; feature level 12_0

## Swap Chain 생성

Direct3D 11의 경우 다음과 같이 만들었었음:

```cpp
// Create swap chain
ComPtr<IDXGIFactory2> dxgiFactory2;
hr = dxgiFactory.As(&dxgiFactory2);
if (SUCCEEDED(hr))
{
    // DirectX 11.1 or later
    hr = m_d3dDevice.As(&m_d3dDevice1);
    if (SUCCEEDED(hr))
    {
        m_immediateContext.As(&m_immediateContext1);
    }

    DXGI_SWAP_CHAIN_DESC1 sd =
    {
        .Width = uWidth,
        .Height = uHeight,
        .Format = DXGI_FORMAT_R8G8B8A8_UNORM,
        .SampleDesc = {.Count = 1u, .Quality = 0u },
        .BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT,
        .BufferCount = 1u
    };

    hr = dxgiFactory2->CreateSwapChainForHwnd(m_d3dDevice.Get(), hWnd, &sd, nullptr, nullptr, m_swapChain1.GetAddressOf());
    if (SUCCEEDED(hr))
    {
        hr = m_swapChain1.As(&m_swapChain);
    }
}
else
{
    // DirectX 11.0 systems
    DXGI_SWAP_CHAIN_DESC sd =
    {
        .BufferDesc = {.Width = uWidth, .Height = uHeight, .RefreshRate = {.Numerator = 60, .Denominator = 1 }, .Format = DXGI_FORMAT_R8G8B8A8_UNORM },
        .SampleDesc = {.Count = 1, .Quality = 0 },
        .BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT,
        .BufferCount = 1u,
        .OutputWindow = hWnd,
        .Windowed = TRUE
    };

    hr = dxgiFactory->CreateSwapChain(m_d3dDevice.Get(), &sd, m_swapChain.GetAddressOf());
}
```

Direct3D 12에서도 마찬가지인데, Win32 어플리케이션 기준으로는 `CreateSwapChainForHwnd`로 swap chain을 만드는 것을 권장함.

차이점으로는 Direct3D 12에서는 swap chain을 만드는 함수들의 첫번째 매개변수가 device가 아니라 direct command queue라는 것임. 즉, command queue를 먼저 만들어줘야함.

### Command Queue 생성

Direct3D 11에서는 실제 런타임과 드라이버 간의 동기화를 알아서 잘 처리해줬다면, Direct3D 12에서는 command queue로 이 일을 직접 처리해줘야함. 이때의 장점:

* 더 나은 병렬성 - 백그라운드에서는 비디오 디코딩과 같은 업무 시키고, 포그라운드에서는 또 다른 일 시키는 식으로 여러 큐를 둘 수 있음.
* 비동기 + 우선순위 낮은 GPU 업무 - Command queue 모델을 통해 동시에 우선순위가 낮은 GPU 업무를 해줄 수 있고, 한 GPU 스레드가 동기화하지 않은 다른 스레드의 결과를 블로킹 없이 소비할 수 있도록 해줌.
* 우선순위 높은 compute 업무 - 3D 렌더링 도중에 우선순위가 높은 compute 업무 조금을 해야할 때가 있음.

Command queue는 `ID3D12Device::CreateCommandQueue`로 만드는데, 이때 만들 command queue의 유형을 알려줘야함. Command queue의 유형이라는 것은 이 큐에 집어 넣을 command list의 유형을 의미함. 참고로 번들을 직접 command queue에 넣어줄 순 없고 direct command list에 넣어준 다음에 command queue에 넣어줘야함.

```cpp
D3D12_COMMAND_QUEUE_DESC queueDesc =
{
    .Type = D3D12_COMMAND_LIST_TYPE_DIRECT,
    .Priority = D3D12_COMMAND_QUEUE_PRIORITY_NORMAL,
    .Flags = D3D12_COMMAND_QUEUE_FLAG_NONE,
    .NodeMask = 0,
};

hr = m_pDevice->CreateCommandQueue(&queueDesc, IID_PPV_ARGS(m_pCommandQueue.ReleaseAndGetAddressOf()));
if (FAILED(hr))
{
    LOGHR(log::eVerbosity::Error, hr);
    return hr;
}
```

### Swap Chain 생성

이때 중요한 건 descriptor 만들 때 swap effect를 `DXGI_SWAP_EFFECT_FLIP_SEQUENTIAL`이나 `DXGI_SWAP_EFFECT_FLIP_DISCARD`를 써야 함. Direct3D 12에선 옛날 swap effect를 지원하지 않음.

만약 gamma-correct 렌더링을 위해 표준으로 사용하는 채널당 8 비트 UNORM 포맷을 사용하려면 RT를 sRGB 포맷으로 만들어주곤 함. 근데 Direct3D 12에서 새로 사용하는 flip 모드에선 swap chain을 만들 때 sRGB 포맷으로 백 버퍼를 만들 수가 없음. 이럴 땐 sRGB 포맷 아닌 걸로 하나 일단 만들어놓고 (즉, `DXGI_SWAP_CHAIN_DESC1.Format = DXGI_FORMAT_B8G8R8A8_UNORM`) RTV에선 sRGB를 써주는 것임 (즉, D3D12_RENDER_TARGET_VIEW_DESC.Format = DXGI_FORMAT_B8G8R8A8_UNORM_SRGB).

```cpp
DXGI_SWAP_CHAIN_DESC1 swapChainDesc1 =
{
    .Width = m_uWidth,
    .Height = m_uHeight,
    .Format = DXGI_FORMAT_R8G8B8A8_UNORM,
    .Stereo = FALSE,
    .SampleDesc =
    {
        .Count = 1
    },
    .BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT,
    .BufferCount = NUM_FRAME_BUFFERS,
    .Scaling = DXGI_SCALING_STRETCH,
    .SwapEffect = DXGI_SWAP_EFFECT_FLIP_DISCARD,
    .AlphaMode = DXGI_ALPHA_MODE_UNSPECIFIED,
    .Flags = isTearingSupported() ? DXGI_SWAP_CHAIN_FLAG_ALLOW_TEARING : 0u,
};

DXGI_SWAP_CHAIN_FULLSCREEN_DESC swapChainFullscreenDesc =
{
    .RefreshRate =
    {
        .Numerator = 1,
        .Denominator = 60,
    },
    .ScanlineOrdering = DXGI_MODE_SCANLINE_ORDER_UNSPECIFIED,
    .Scaling = DXGI_MODE_SCALING_UNSPECIFIED,
    .Windowed = TRUE,
};

ComPtr<IDXGISwapChain1> pSwapChain1;
hr = pDxgiFactory->CreateSwapChainForHwnd(m_pCommandQueue.Get(), hWnd, &swapChainDesc1, &swapChainFullscreenDesc, nullptr, pSwapChain1.GetAddressOf());
if (FAILED(hr))
{
    DXGI_SWAP_CHAIN_DESC swapChainDesc =
    {
        .BufferDesc =
        {
            .Width = m_uWidth,
            .Height = m_uHeight,
            .Format = DXGI_FORMAT_R8G8B8A8_UNORM,
        },
        .SampleDesc =
        {
            .Count = 1
        },
        .BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT,
        .BufferCount = NUM_FRAME_BUFFERS,
        .OutputWindow = hWnd,
#if _DEBUG
        .Windowed = FALSE,
#else
        .Windowed = TRUE,
#endif
        .SwapEffect = DXGI_SWAP_EFFECT_FLIP_DISCARD,
        .Flags = isTearingSupported() ? DXGI_SWAP_CHAIN_FLAG_ALLOW_TEARING : 0u
    };
    ComPtr<IDXGISwapChain> pSwapChain;
    hr = pDxgiFactory->CreateSwapChain(m_pCommandQueue.Get(), &swapChainDesc, pSwapChain.GetAddressOf());
    if (FAILED(hr))
    {
        LOGHR(log::eVerbosity::Error, hr);
        return hr;
    }

    hr = pSwapChain.As(&m_pSwapChain);
    if (FAILED(hr))
    {
        LOGHR(log::eVerbosity::Error, hr);
        return hr;
    }
}
else
{
    hr = pSwapChain1.As(&m_pSwapChain);
    if (FAILED(hr))
    {
        LOGHR(log::eVerbosity::Error, hr);
        return hr;
    }
}

m_uCurrentBackBufferIdx = m_pSwapChain->GetCurrentBackBufferIndex();

hr = pDxgiFactory->MakeWindowAssociation(hWnd, DXGI_MWA_NO_ALT_ENTER);
if (FAILED(hr))
{
    LOGHR(log::eVerbosity::Error, hr);
    return hr;
}
```

## Render Target 생성

Direct3D 11에서는 swap chain으로부터 백 버퍼를 받아와 RTV를 만들어 주었고, 간단한 2D 텍스처를 생성해주어 DSV 또한 만들어 주었음:

```cpp
// Create a render target view
ComPtr<ID3D11Texture2D> pBackBuffer;
hr = m_swapChain->GetBuffer(0, IID_PPV_ARGS(&pBackBuffer));
if (FAILED(hr))
{
    return hr;
}

hr = m_d3dDevice->CreateRenderTargetView(pBackBuffer.Get(), nullptr, m_renderTargetView.GetAddressOf());
if (FAILED(hr))
{
    return hr;
}

// Create depth stencil texture
D3D11_TEXTURE2D_DESC descDepth =
{
    .Width = uWidth,
    .Height = uHeight,
    .MipLevels = 1u,
    .ArraySize = 1u,
    .Format = DXGI_FORMAT_D24_UNORM_S8_UINT,
    .SampleDesc = {.Count = 1u, .Quality = 0u },
    .Usage = D3D11_USAGE_DEFAULT,
    .BindFlags = D3D11_BIND_DEPTH_STENCIL,
    .CPUAccessFlags = 0u,
    .MiscFlags = 0u
};
hr = m_d3dDevice->CreateTexture2D(&descDepth, nullptr, m_depthStencil.GetAddressOf());
if (FAILED(hr))
{
    return hr;
}

// Create the depth stencil view
D3D11_DEPTH_STENCIL_VIEW_DESC descDSV =
{
    .Format = descDepth.Format,
    .ViewDimension = D3D11_DSV_DIMENSION_TEXTURE2D,
    .Texture2D = {.MipSlice = 0 }
};
hr = m_d3dDevice->CreateDepthStencilView(m_depthStencil.Get(), &descDSV, m_depthStencilView.GetAddressOf());
if (FAILED(hr))
{
    return hr;
}
```

나중에 렌더링할 땐 위에서 얻은 RTV와 DSV를 RT에 셋팅만 해주면 끝이었음:

```cpp
m_immediateContext->OMSetRenderTargets(1, m_renderTargetView.GetAddressOf(), m_depthStencilView.Get());
```

Direct3D 12에서는 이렇게 단순하게 되지 않음. 이런 셰이더 자원들(텍스처, constant table, 이미지, 버퍼 등등)은 나중에 `VSSetConstantBuffers`나 `PSSetShaderResources` 등으로 단순히 연결하는 방식이 아님. 대신 descriptor라는 중계인을 통해 참조가 되는 방식임. Descriptor란 한 자원에 대한 정보를 갖는 작은 객체라고 생각하면 됨.

어차피 우리가 자원 하나만 사용할리는 없잖음? 그래서 이런 descriptor들이 모인 걸 descriptor table이라 부름. 여기에 필요한 CBV, UAV, SRV, 샘플러 다 갖다 넣는 것임.

나중에 graphics / compute 파이프라인에서는 이 자원들을 descriptor table의 인덱스를 통해 접근하게 됨.

근데 Direct3D 12에서 자료 구조가 있다면 자동으로 뭐다? **직접 메모리 관리를 해줘야 한다!!** Descriptor table은 descriptor heap이라는 곳에 보관해야하는데, 자연스레 하나 이상의 프레임에서 사용할 모든 descriptor들을 포함하게 될 것임. 모든 자원들은 결국 유저 모드 heap에 저장됨.

여기에 또 등장하는 개념이 바로 루트 시그니처. 셰이더 입장에서는 자원이 필요한데, Direct3D 11에서처럼 직접 받는게 아니라 descriptor table을 보고 찾으라고 함. 그러면 일종의 규칙 같은 것이 필요하게 됨. Descriptor table의 몇 번 몇 번 자원이 필요하단 식으로. 이걸 해결하는 것이 루트 시그니처임. 루트 시그니처는 다음 정보를 갖고 있음:

* Descriptor heap 안의 descriptor table에 대한 인덱스. 여기에서 사전 정의된 descriptor table의 레이아웃을 볼 수 있음
* Constant. 사용자가 정의한 constant (루트 상수라 부름)를 귀찮게 따로 descriptor이나 table 쓰지 않고 바로 셰이더에 직접 바인딩할 수 있음.
* 루트 시그니처 자체에 존재하는 draw마다 바뀌는 매우 적은 수의 descriptor들 (CBV들처럼). 이를 통해 굳이 이걸 descriptor heap에 넣지 않고도 쓸 수 있게 해줌.

즉, 루트 시그니처는 draw마다 수정되는 소수의 데이터에 대해 적절하게 성능 최적화를 할 수 있게 해줌.

이러한 바인딩을 통해 메모리 관리, 객체 수명 관리, 상태 추적, 메모리 동기화와 같은 작업과는 분리되게, 독립적이게 해줌. 이러한 바인딩은 애초에 오버헤드가 적고 가장 자주 호출되는 API에 대하여 최적화 되도록 설계됨.

## Command list 생성

Command list는 크게 네 가지 타입이 있음.

1. Direct
2. 번들
3. Compute
4. Copy

텍스처간 복사만 할거면 4번, compute shader도 할거면 3번, 렌더링도 할거면 1번, 번들이면 2번인 셈.

이게 Direct3D 12가 확실히 로우 레벨인게 11이었으면 그냥 생성해줘! 하면 끝인데 Direct3D 12에서는 이런 뭔가 메모리 관련된 건 직접 할당자도 만들어줘야함. Command list도 일단 뭔가를 저장하는 목록이긴 하니까 이 목록을 저장할 할당자가 필요함. 이걸 command allocator라고 부름.

### Command Allocator 생성

`CreateCommandAllocator`로 만들어 줄 수 있음. 위에서 봤듯이 command list는 여러 가지 유형이 있는데, allocator도 이 유형에 따라 구분해줘야함. Direct command list는 direct command allocator에서만 생성해줄 수 있음.

할당자라고 해서 동시에 여러 command list를 갖고 있을 수 있는 건 아니고, 반드시 현재 기록 중인 command list 하나만과 연관될 수 있음. 물론 한 command allocator로 여러 command list 객체를 만들어줄 수는 있음.

할당자가 할당만 해주는 건 당연히 아님. 할당했으면 다시 돌려 받아야지. 이럴 땐 `ID3D12CommandAllocator::Reset` 호출하면 됨. 이렇게 리셋해주면 이제 새로운 command를 위해 command allocator를 재활용할 수 있음. 물론 당연하겠지만 재활용하려면 현재 이 command allocator와 연관된 command list가 GPU에서 실행 중이지 않아야 함. 그리고 얘는 스레드의 영향을 받기에 여러 스레드에서 동시에 같은 allocator를 호출해줄 순 없음.

```cpp
for (UINT uThreadIdx = 0; uThreadIdx < NUM_THREADS; ++uThreadIdx)
{
    for (UINT uBackBufferIdx = 0; uBackBufferIdx < NUM_FRAME_BUFFERS; ++uBackBufferIdx)
    {
        hr = m_pDevice->CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT, IID_PPV_ARGS(m_apCommandAllocators[uBackBufferIdx][uThreadIdx].ReleaseAndGetAddressOf()));
        if (FAILED(hr))
        {
            LOGHR(log::eVerbosity::Error, hr);
            return hr;
        }
#ifdef _DEBUG
        WCHAR szCommandAllocatorName[64] = { L'\0', };
        swprintf_s(szCommandAllocatorName, L"Renderer::m_apCommandAllocators[%u][%u]", uBackBufferIdx, uThreadIdx);

        m_apCommandAllocators[uBackBufferIdx][uThreadIdx]->SetName(szCommandAllocatorName);
#endif
    }
}
```

Command allocator는 크기가 커질 수는 있어도 줄어들지는 않음. 그러므로 이걸로 할당자 풀을 만들거나 재사용을 하여 최대한의 효율을 내는 것이 좋음. 한 순간에 한 목록만 기록 한다는 가정 하에 한 할당자에서 여러 목록을 기록할 수 있음.

간단한 할당자 풀을 만든다고 하면 적당히 command list 개수 * 최대 프레임 latency 개의 할당자를 두는 것임. 좀 더 고급지게 만들면 한 스레드에서 여러 목록을 재사용하는 할당자를 두는 것임. 이때는 기록 중인 목록 수 * 최대 프레임 latency 개의 할당자를 두면 됨.

예를 들어 간단한 풀을 만든다면 기록할 목록이 6개고, 최대 3 개의 프레임을 따로 만들 수 있다면 18-20 개 정도의 할당자를 사용하면 되는 것이고, 좀 더 고급진 풀을 만드는 경우 6개의 목록이 A 스레드에 2개, B 스레드에 2개, C 스레드에 1개, D 스레드에 1개씩 나눠서 처리한다면 12-14개 정도의 할당자를 사용하면 됨.

Fence를 활용하여 어떤 할당자가 재사용 가능한지 알 수 있음.

### Pipeline State 생성

Command list는 명령어의 집합인데, Direct3D 11에서 해보면 알겠지만 대부분의 명령어들은 파이프라인과 유관한 명령들임. VS 단계의 셰이더를 셋팅해준다던가, IA 단계의 VB, IB를 셋팅해준다던가...

Direct3D 12에서는 파이프라인을 객체화해서 pipeline state이라는 존재로 만들어줌. 애초에 파이프라인에서 해야되는 일이 너무 많음. 뭐 GPU에 geometry를 전달할 때 어떻게 입력 데이터를 해석하고 렌더링할지 이거만으로 셋팅들이 엄청 만잖음. 이게 pipeline state라는 이름으로 된 것임.

Direct3D 12에서부터는 이 pipeline state를 객체화한 pipeline state object (이하 PSO)를 활용함. 그래서 그냥 초기화할 때 필요한 PSO 개수만큼 만들어두고, 렌더링할 때 필요한 셋팅에 따라 command list가 `ID3D12GraphicsCommandList::SetPipelineState`를 통해 사용할 PSO를 선택하면 됨.

여튼, command list를 처음으로 만들어 줄 때 초기에 활용할 PSO를 미리 설정해줄 수 있음. 만약 `NULL`로 준다면 기본 상태를 사용함.

PSO를 만드려면 `D3D12_GRAPHICS_PIPELINE_STATE_DESC`를 만들어서 `ID3D12Device::CreateGraphicsPipelineState`로 생성해줄 수 있음.

대표적인 셋팅으로는 다음과 같음:

* 셰이더 바이트 코드
* input 버텍스 포맷
* primitive topology type 설정
  * 참고로 IA에서의 primitive topology type(점 선 삼각형 패치)는 PSO에서 설정하고, primitive adjacency와 순서(line list, line strip, line strip with adjacency data 등)은 command list에서 `ID3D12GraphicsCommandList::IASetPrimitiveTopology`로 설정해줌
* 블렌드 상태, 래스터화 상태, DS 상태
* DS와 RT 포맷 설정, RT 개수
* 멀티 샘플링 매개변수
* 스트리밍 출력 버퍼
* 루트 시그니처

#### RS 생성

여기서 루트 시그니처root signature라는게 새롭게 등장하는데, RS란 어플리케이션의 command list를 셰이더가 요구하는 자원에 연결해주는 설정이라고 보면 됨.

이름에 시그니처가 있듯이 API 함수 시그니처처럼 셰이더에서 필요한 data의 type 정보를 갖고 있음. 이때 type 정보만 갖고 있는 거지 실제로 얼마나 메모리가 필요한지에 대한 건 필요 없음.

루트 매개변수는 RS의 한 원소라고 보면 됨. 실제 실행 중에 이 매개변수에 들어가는 입력변수를 루트 입력변수라고 부름.

이 RS가 있어야 PSO에 설정된 VS/PS에 넣을 data의 시그니처를 알 수 있게 되므로, 빈 RS라도 만들어줘야 PSO를 만들 수 있음.

```cpp
CD3DX12_ROOT_SIGNATURE_DESC rootSignatureDesc;
rootSignatureDesc.Init(0, nullptr, 0, nullptr, D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT);

ComPtr<ID3DBlob> signature;
ComPtr<ID3DBlob> error;
hr = D3D12SerializeRootSignature(&rootSignatureDesc, D3D_ROOT_SIGNATURE_VERSION_1, &signature, &error);
if (FAILED(hr))
{
    LOGHR(log::eVerbosity::Error, hr);
    return hr;
}

hr = m_pDevice->CreateRootSignature(0, signature->GetBufferPointer(), signature->GetBufferSize(), IID_PPV_ARGS(m_pRootSignature.ReleaseAndGetAddressOf()));
if (FAILED(hr))
{
    LOGHR(log::eVerbosity::Error, hr);
    return hr;
}
#ifdef _DEBUG
m_pRootSignature->SetName(L"Renderer::m_pRootSignature");
#endif
```

### PSO 생성

```cpp
// Read the compiled shaders
ComPtr<ID3DBlob> pVertexShader;
ComPtr<ID3DBlob> pPixelShader;

{
    hr = D3DReadFileToBlob((std::filesystem::path(SOLUTION_DIR) / PLATFORM / CONFIGURATION / L"VSSample.cso").c_str(), pVertexShader.GetAddressOf());
    if (FAILED(hr))
    {
        LOGHR(log::eVerbosity::Error, hr);
        return hr;
    }

    hr = D3DReadFileToBlob((std::filesystem::path(SOLUTION_DIR) / PLATFORM / CONFIGURATION / L"PSSample.cso").c_str(), pPixelShader.GetAddressOf());
    if (FAILED(hr))
    {
        LOGHR(log::eVerbosity::Error, hr);
        return hr;
    }
}

// Define the vertex input layout.
D3D12_INPUT_ELEMENT_DESC aInputElementDescs[] =
{
    { "POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 0, D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA, 0 },
    { "COLOR", 0, DXGI_FORMAT_R32G32B32A32_FLOAT, 0, 12, D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA, 0 }
};

// Create a PSO description, then create the object
{
    // Describe and create the graphics pipeline state object (PSO).
    D3D12_GRAPHICS_PIPELINE_STATE_DESC psoDesc =
    {
        .pRootSignature = m_pRootSignature.Get(),
        .VS = CD3DX12_SHADER_BYTECODE(pVertexShader.Get()),
        .PS = CD3DX12_SHADER_BYTECODE(pPixelShader.Get()),
        .BlendState = CD3DX12_BLEND_DESC(D3D12_DEFAULT),
        .SampleMask = UINT_MAX,
        .RasterizerState = CD3DX12_RASTERIZER_DESC(D3D12_DEFAULT),
        .DepthStencilState =
        {
            .DepthEnable = FALSE,
            .StencilEnable = FALSE
        },
        .InputLayout = { aInputElementDescs, ARRAYSIZE(aInputElementDescs) },
        .PrimitiveTopologyType = D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,
        .NumRenderTargets = 1,
        .RTVFormats = { DXGI_FORMAT_R8G8B8A8_UNORM, },
        .SampleDesc =
        {
            .Count = 1,
        },
    };
    hr = m_pDevice->CreateGraphicsPipelineState(&psoDesc, IID_PPV_ARGS(m_pPipelineState.ReleaseAndGetAddressOf()));
    if (FAILED(hr))
    {
        LOGHR(log::eVerbosity::Error, hr);
        return hr;
    }
#ifdef _DEBUG
    m_pPipelineState->SetName(L"Renderer::m_pPipelineState");
#endif
}
```

### Command list 생성

Direct command list나 번들이나 다 `ID3D12Device::CreateCommandList`이나 `ID3D12Device4::CreateCommandList1`로 만들어줌.

후자로는 이미 닫힌 상태의 command list가 생성됨. 원래 전자를 쓰면 command allocator랑 PSO를 주고 나서 바로 close를 해줘야 했는데, 후자는 이걸 줄 필요도 없고 이미 닫혀있는 상태임. 만약 alloator랑 PSO랑 줘놓고 쓰지도 않을거라면 후자가 더 나음.

Command list는 생성될 때 기록 상태로 생성됨.

```cpp
hr = m_pDevice->CreateCommandList(0, D3D12_COMMAND_LIST_TYPE_DIRECT, m_apCommandAllocators[m_uCurrentBackBufferIdx][MAIN_THREAD].Get(), m_pPipelineState.Get(), IID_PPV_ARGS(m_pCommandList.ReleaseAndGetAddressOf()));
if (FAILED(hr))
{
    LOGHR(log::eVerbosity::Error, hr);
    return hr;
}
```

```cpp
hr = m_pDevice->CreateCommandList1(0, D3D12_COMMAND_LIST_TYPE_DIRECT, D3D12_COMMAND_LIST_FLAG_NONE, IID_PPV_ARGS(m_pCommandList.ReleaseAndGetAddressOf()));
if (FAILED(hr))
{
    LOGHR(log::eVerbosity::Error, hr);
    return hr;
}
```

대부분의 D3D12 API는 COM에 따라 참조 카운팅을 사용하지만, `ID3D12GraphicsCommandList`의 모든 API는 전달 받은 객체의 참조를 받지 않음. 즉, 어플리케이션단에서 이미 소멸한 자원을 참조하는 command list는 절대로 실행하지 않도록 보장해줘야함.

대부분의 `ID3D12GraphicsCommandList`의 API들은 오류를 반환하지 않음. Command list 생성 때 발생한 오류는 `ID3D12GraphicsCommandList::Close`를 호출해야 알 수 있음. 유일한 예외는 `DXGI_ERROR_DEVICE_REMOVED` 오류로, 이건 더 뒤에 가서야 알 수 있는 오류임.

번들에 주어진 몇가지 제한사항 덕에 기록 중에 번들을 최대로 활용할 수 있게 됨. 즉, `ExecuteBundle` API가 적은 오버헤드로 동작하게 됨. 번들이 참조하는 모든 PSO는 반드시 같은 RT 포맷, depth 버퍼 포맷, sample description을 가져야 함.

# 렌더링

## Command list 기록

만약 이미 존재하는 command list를 재활용하려면 `ID3D12GraphicsCommandList::Reset`을 통해 command list를 기록 상태로 해줄 수 있음. `ID3D12CommandAllocator::Reset`이랑은 다르게 command list 실행 도중에도 리셋해줄 수 있음. 그렇기 때문에 보통은 command list를 GPU에 넘겼으면, 바로 리셋을 해서 할당받은 메모리를 다른 command list가 사용할 수 있도록 해주는 게 좋음.

일단 기록 상태에 오게 되면 기록할 거 기록하면 됨. 이건 Direct3D 11랑 별 다를 게 없음:

```cpp
// Set the graphics root signature
m_pCommandList->SetGraphicsRootSignature(m_pRootSignature.Get());
// Set the viewport and scissor rectangles
m_pCommandList->RSSetViewports(1, &m_Viewport);
m_pCommandList->RSSetScissorRects(1, &m_ScissorRect);

...

CD3DX12_CPU_DESCRIPTOR_HANDLE rtvHandle(m_pRtvHeap->GetCPUDescriptorHandleForHeapStart(), m_uFrameIndex, m_uRtvDescriptorSize);
m_pCommandList->OMSetRenderTargets(1, &rtvHandle, FALSE, nullptr);

// Record commands into the command list
const float clearColor[] = { 1.0f, 0.2f, 0.4f, 1.0f };
m_pCommandList->ClearRenderTargetView(rtvHandle, clearColor, 0, nullptr);
m_pCommandList->IASetPrimitiveTopology(D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST);
m_pCommandList->IASetVertexBuffers(0, 1, &m_VertexBufferView);
m_pCommandList->DrawInstanced(3, 1, 0, 0);

...
```

기록이 끝나면 command list를 닫아주어 기록 상태를 중단함:

```cpp
// Close the command list to further recording
hr = m_pCommandList->Close();
if (FAILED(hr))
{
    LOGHR(log::eVerbosity::Error, hr);
    return hr;
}
```

Command list는 실행하자 마자 바로 리셋할 수 있으니 간단하게 풀링을 해줄 수 있음. `ID3D12CommandQueue::ExecuteCommandLists` 호출하자마자 바로 풀에 되돌려 놓는 것임.

Command list 기록이 다 끝나면 command queue를 통해 실제 실행을 해줄 수 있게 됨.