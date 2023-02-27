# 요즘 Graphics API 이해하기 (2023.02.20)
[Home](/)

# 사전지식

* 기초적인 컴퓨터 그래픽스 지식
* 기초적인 CPU/GPU 지식

# 요즘 Graphics API란?

1. Direct3D 12
2. Vulkan
3. Metal

이렇게 세 가지를 보통 칭한다. Microsoft의 Windows와 Xbox에서 사용하는 Direct3D, Apple의 MacOS와 iOS에서 사용하는 Metal, 그리고 그 외의 플랫폼(Linux, Android 등)에서 사용하는 Vulkan까지를 칭한다. 물론 이것 말고도 다른 API들도 존재하지만, 현재로서는 크게 이렇게 세 가지를 다룬다.

그렇다면 기존의 Direct3D 11, OpenGL 등에 비해서 도대체 왜 이번 세대의 그래픽스 API가 다루기가 어렵다고 난리인 걸까? 이를 이해하기 위해서는 이전 세대의 API를 먼저 이해해야 한다.

## 기존 세대 Graphics API

결국 지금 세대나 예전 세대나 핵심은 **어떻게 GPU를 일을 시킬 것이느냐?**이다. 가장 전통적인 방법으로는 바로 Graphics Pipeline이라는 것이 있다.

![d3d11-pipeline-stages](https://learn.microsoft.com/en-us/windows/win32/direct3d11/images/d3d11-pipeline-stages.jpg)

![RenderingPipeline](https://www.khronos.org/opengl/wiki_opengl/images/RenderingPipeline.png)

Direct3D 11이나 OpenGL이나 그림은 다를지라도 내용을 읽어보면 완전 같다는 것을 알 수 있다. 어쨋든 위와 같이 파이프라인이 주어져있을 때, 최종적인 Draw 콜을 하기 위해서는 각 파이프라인 단계에 알맞는 상태를 정해주어야 한다. 즉, 우리는 언제나 Draw 콜을 하기 위해서는 해당 Draw 콜에 알맞는 상태들(shader 뭐 쓸 건지, 텍스처랑 render target은 또 무엇을 쓸 건지 등)을 알고 있어야 하고, 관리해줘야 한다. 그러면 다음과 같이 우리는 코드를 작성할 것이다:

```cpp
// update resources (constant buffers, etc.)

// set vertex / index buffers

// set vertex shader and shader resources

// set rasterizer states

// set pixel shader and resources

// set render targets and depth stencil states

// render
```

위와 같이 작성한 코드는 어쨋든 CPU 단에서 작성한 코드이다. 결론적으로 이 명령어들을 수행할 주체는 GPU다! 그러므로 이 명령어들을 GPU가 이해할 수 있는 명령어로 번역을 해주어야 한다.

근데 여기서 문제가 되는 부분은 바로 실제 이 명령어를 수행하는 함수이다. 호출하는 건 CPU 단이지만, 실제 작업을 하는 것은 GPU다. 즉, 이 함수가 리턴을 하기 전까지 CPU의 프로세스를 점유하고 있는 것이다. 어차피 일하는 건 GPU만 일하는 건데, 굳이 CPU까지 손 붙잡고 있을 필요가 있을까?

이게 이러다 보니 한 프레임에서 CPU가 차지하는 비중이 너무 커지게 된다. 더욱 멋있는 그래픽스를 위해 소비할 GPU 시간이 곧 CPU 시간도 먹게 되어 물리 처리나 인공지능과 같은 다른 멋있는 처리들을 해주지 못하고 있는 것이다. 이러한 부분을 해결하고, 어플리케이션 단에서 좀 더 성능에 직접적으로 관여할 수 있도록 하기 위해 탄생한 것이 바로 요즘 세대의 Graphics API라고 할 수 있다.

이렇게 되면 CPU는 순전히 GPU에서 처리할 일이 무엇인지만 알려주고 나머지는 GPU가 알아서 처리하도록 두고, 자기 할 일을 할 수 있게 된다. 또한 한 프레임 내에서 여러번 draw/dispatch 콜을 해줄 수 있을 것이다. 어차피 호출 후에는 GPU가 알아서 비동기적으로 처리할테니 호출만 하고 CPU는 다른 일 처리하면 되기 때문이다.

## Direct3D 12

## Vulkan

OpenGL의 대체자다! 라고 말하는 사람이 많은데, 그건 아니고, 그냥 조금 더 GPU를 직접적으로 제어할 수 있는 같은 동네(Khronos Group) 친구일 뿐이다.

![what_is_vulkan_compared_to_gl](https://github.com/KhronosGroup/Vulkan-Guide/raw/main/chapters/images/what_is_vulkan_compared_to_gl.png)

위에 그림에서처럼 OpenGL에서는 GPU와 Application 사이에서 많은 일들을 직접 대신해서 해주고 있었는데, Vulkan에서는 그런 일들을 이제는 Application이 직접 해주어야 한다는 의미이다.

Vulkan에 의하면 개발하는 어플리케이션이 CPU가 더 오래 걸리거나, 그래픽스 작업을 병렬화할 수 있거나, 그래픽스 자원 할당을 직접 할 수 있거나, 끊김없는 렌더링에 중점을 두거나, 성능을 최우선 과제로 둔다면, 무조건 Vulkan을 써야한다고 한다.

## Metal

# 작업 중

## Vulkan

이 글에서 Vulkan 공부는 이걸 안드로이드와 리눅스 환경에서 사용하겠다는 가정 하에 진행된다. 그러나 Vulkan을 알아둔다면 이와 비슷한 API를 사용하는 Nintendo Switch(NVN)나 PlayStation 5(GNM, GNMX)와 같은 콘솔에서의 개발도 가능해진다.

### 초기화

Vulkan을 사용하기 위해서는 **반드시** 어플리케이션 단에서 초기화 단계가 선행 되어야 한다. 초기화 단계는 Vulkan 명령어 로딩과 `VkInstance` 개체 생성 두 가지가 있다.

#### 명령어 함수 포인터

모든 Vulkan의 명령어들이 라이브러리로 정적 링킹된 것은 아니기 때문에 가끔은 함수의 이름을 바탕으로 해당 함수의 포인터를 얻어와야할 때가 있다. 이때 사용하는 함수가 [`vkGetInstanceProcAddr`](https://registry.khronos.org/vulkan/specs/1.3/html/vkspec.html#vkGetInstanceProcAddr)이다.

```cpp
// Provided by VK_VERSION_1_0
PFN_vkVoidFunction vkGetInstanceProcAddr(
    VkInstance instance,
    const char* pName
    );
```

지금 받아오려는 게 Vulkan의 전역 함수가 아니라면 `instance`는 반드시 유효해야 한다. 이걸 사용하는 이유는 Vulkan 버전, 확장 등에 따라 이 함수를 통해 함수 포인터를 받아와야만 사용할 수 있는 경우가 있기 때문이다. 또한 이를 통해 결과가 `nullptr`면 해당 Vulkan 버전 혹은 확장이 지원하지 않는다는 뜻이므로, 이를 활용해 버전 체크 등을 해줄 수 있다.

#### Instance

Vulkan에서는 모든 상태를 전역이 아닌 어플리케이션 단위로 저장한다. 어플리케이션 단위로 저장할 상태들은 `VkInstance` 개체에 속해있다. 이 개체를 통해서 Vulkan 라이브러리도 초기화하고 Vulkan 구현부에 정보를 전달해줄 수 있다. 

>당연하겠지만 Vulkan 버전에 따라서 `VkInstance`가 해줄 수 있는 것 또한 다르기 때문에, Vulkan 1.1부터는 맨 처음에 초기화할 때 필요하다면 어느 버전까지 담당할 수 있는지 알려주는 함수 [`vkEnumerateInstanceVersion`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkEnumerateInstanceVersion)을 제공한다:<br>
>```cpp
>// Provided by VK_VERSION_1_1
>VkResult vkEnumerateInstanceVersion(
>    uint32_t*   pApiVersion
>    );
>```
>이 함수를 호출하면 `pApiVersion`에 [버전 넘버Version Number](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#extendingvulkan-coreversions-versionnumbers)의 형태로 현재 버전을 리턴해준다. 버전 넘버는 간단하게 variant/major/minor/patch 순으로 구분되는데, variant는 현재 사용하는 Vulkan의 구현이 무엇인지를 의미하는데, 사실상 0이라고 생각하면 된다. major는 API에 상당한 변화가 있을 때 보통 바뀌는 수준으로, 스펙 자체가 변화하는 수준이라고 보면 된다. minor는 핵심 스펙에 몇 가지 추가 기능이 들어갈 때의 수준이다. patch는 스펙에 따른 버그 수정이나 개선 등의 수준이다. 이러한 네 가지 숫자가 32 비트에 전부 패킹 되어있는 형태로, `VK_API_VERSION_~` 매크로를 사용하면 금방 알 수 있다. 예를 들어 variant를 알고 싶다면 `VK_API_VERSION_VARIANT(*pApiVersion)`으로 사용하는 식이다.

Instance의 역할은 단순히 어떤 상태를 저장할 뿐만 아니라, 드라이버에 접근하는 역할도 갖고 있다. 우리가 3D 그래픽 작업을 사용하기 위해 GPU를 사용할텐데, 그래서 어떤 GPU를 사용할지 여부를 정해줘야 한다. 어쨋든 코드는 CPU에서 돌아가니까 누군가가 대신해서 GPU라는 외부 장치에 접근해서 정보를 갖고 오고, 일을 시켜야한다. 이때 그래픽 드라이버를 사용할텐데, 이 드라이버가 실제 GPU 디바이스와 운영체제마다 다를테니까 CPU 단에서 모든 케이스에 대응하기에는 너무 복잡해진다. 그래서 Vulkan이라는 API가 중간에서 좀 일을 처리해주는 건데, 이 담당자가 바로 `VkInstance`인 것이다.

`VkInstance` 개체를 생성해주려면 `vkCreateInstance` 함수를 호출하면 된다:

```cpp
// Provided by VK_VERSION_1_0
VkResult vkCreateInstance(
    const VkInstanceCreateInfo*                 pCreateInfo,
    const VkAllocationCallbacks*                pAllocator,
    VkInstance*                                 pInstance
    );
```

반환형인 `VkResult`는 말 그대로 이 함수를 호출했을 때의 결과를 의미한다. Win32를 해보았다면 `HRESULT`와 비슷한 것이라고 생각하면 된다. 어떤 값들이 있는지는 `vulkan.h` 헤더 파일에서 직접 확인해볼 수 있다. 가장 일반적으로 많이 사용하는 값은 `VK_SUCCESS`, `VK_ERROR_OUT_OF_HOST_MEMORY` 등이 있다.

이때 세 가지 정보가 필요한데, 중요한 건 생성할 instance에 대한 생성 정보를 담고 있는 [`VkInstanceCreateInfo`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkInstanceCreateInfo) 개체와 실제로 반환할 instance 개체인 `VkInstance` 개체이다. 중간에 `VkAllocationCallbacks`는 당장 중요하지 않다. 그냥 `nullptr`로 넘겨도 된다.

Instance 생성 정보인 `VkInstanceCreateInfo`는 다음과 같다:

```cpp
// Provided by VK_VERSION_1_0
typedef struct VkInstanceCreateInfo {
    VkStructureType             sType;
    const void*                 pNext;
    VkInstanceCreateFlags       flags;
    const VkApplicationInfo*    pApplicationInfo;
    uint32_t                    enabledLayerCount;
    const char* const*          ppEnabledLayerNames;
    uint32_t                    enabledExtensionCount;
    const char* const*          ppEnabledExtensionNames;
} VkInstanceCreateInfo;
```

**`sType`**은 이 구조체의 타입을 얘기하는 건데, 그냥 `VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO`를 주면 된다. 

**`pNext`**는 이 구조체의 확장이 있다면, 걔가 어디 있냐는 걸 물어보는 건데, 여기서는 확장까지 다룰 생각이 없으니 `nullptr`를 주면 된다. 앞으로 Vulkan의 구조체를 볼 때마다 이 `sType`과 `pNext` 멤버 변수를 자주 보게 될 것이다. `pNext`가 확장에 쓰일 수 있는 이유는 Vulkan에서는 기존 스펙을 확장할 때 linked list 형식으로 확장하기 때문이다. `sType`이라는 건 Vulkan loader, 계층과 구현부가 참고하는 값으로, `pNext` 같은 걸 통해서 linked list를 순회할 때, 해당 구조체가 어떤 구조체인지 식별할 때 사용하는 식별자라고 생각하면 된다.

**`flags`**는 [`VkInstanceCreateFlags`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkInstanceCreateFlags)의 조합으로, 이 instance 개체의 성격을 정해줄 수 있다. 근데 여기서 설정할 수 있는 flag는 아래 코드에 있는 [`VkInstanceCreateFlagBits::VK_INSTANCE_CREATE_ENUMERATE_PORTABILITY_BIT_KHR`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkInstanceCreateFlagBits) 딱 하나, 심지어 `VK_KHR_portability_enumeration` 확장을 적용해야 쓸 수 있는 놈 밖에 없다. 근데 여기선 알 필요 없고, 그냥 0 주면 된다.

```cpp
// Provided by VK_VERSION_1_0
typedef enum VkInstanceCreateFlagBits {
  // Provided by VK_KHR_portability_enumeration
    VK_INSTANCE_CREATE_ENUMERATE_PORTABILITY_BIT_KHR = 0x00000001,
} VkInstanceCreateFlagBits;
```

**`pApplicationInfo`**는 말 그대로 어플리케이션에 대한 정보를 주겠다는 거다. [`VkApplicationInfo`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkApplicationInfo)는 아래와 같이 생겼다:

```cpp
// Provided by VK_VERSION_1_0
typedef struct VkApplicationInfo {
    VkStructureType    sType;
    const void*        pNext;
    const char*        pApplicationName;
    uint32_t           applicationVersion;
    const char*        pEngineName;
    uint32_t           engineVersion;
    uint32_t           apiVersion;
} VkApplicationInfo;

VkApplicationInfo applicationInfo =
{
    .sType              = VK_STRUCTURE_TYPE_APPLICATION_INFO,
    .pNext              = nullptr,
    .pApplicationName   = "Understading Modern Graphics APIs",
    .applicationVersion = VK_MAKE_VERSION(1, 0, 0),
    .pEngineName        = "Prometheus",
    .engineVersion      = VK_MAKE_VERSION(1, 0, 0),
    .apiVersion         = VK_API_VERSION_1_0
};
```

정말로 말 그대로 어플리케이션 이름이 뭐고, 버전이 뭐고, 엔진이 있다면 엔진 이름이 뭐고, 버전이 뭐고, Vulkan API 버전이 몇이고 등을 전달할 수 있다. 만약 버전 1.0보다 높은 버전을 사용하려는데, 디바이스가 해당 버전을 지원하지 않는다면 `vkCreateInstance`를 호출하면 `VK_ERROR_INCOMPATIBLE_DRIVER`를 반환하게 된다.

> 물론 1.0 버전에서도 `VK_ERROR_INCOMPATIBLE_DRIVER` 오류가 발생할 수 있기 때문에 `vkCreateInstance` 호출을 해주기 전에 반드시 미리 Vulkan의 버전을 확장해주도록 하자. 만약 위에서 언급했던 함수 포인터를 활용해서 버전을 확인할 수 있다. 만약 `vkGetInstanceProcAddr`에 [`vkEnumerateInstanceVersion`](https://registry.khronos.org/vulkan/specs/1.3/html/vkspec.html#vkEnumerateInstanceVersion)을 넣었을 때 결과가 `nullptr`이라면 1.0 버전이라는 것이고, 그렇지 않다면 `vkEnumerateInstanceVersion` 함수를 통해 실제 버전을 확인해주면 된다. 이 함수는 위에서 이미 다루었었다.
>```cpp
>VkResult vr = VK_SUCCESS;
>UINT uVersion = VK_API_VERSION_1_0;
>PFN_vkVoidFunction pfnVkEnumerateInstanceVersion = vkGetInstanceProcAddr(nullptr, "vkEnumerateInstanceVersion");
>
>if (pfnVkEnumerateInstanceVersion != nullptr)
>{
>    vr = vkEnumerateInstanceVersion(&uVersion);
>    if (vr != VK_SUCCESS)
>    {
>        LOGVR(log::eVerbosity::Error, vr);
>        return vr;
>    }
>}
>1
>LOGF(log::eVerbosity::Debug, L"Vulkan Version: %u.%u.%u", VK_VERSION_MAJOR(uVersion), VK_VERSION_MINOR(uVersion), VK_VERSION_PATCH(uVersion));
>```
> 참고로 만약 `apiVersion`은 1.2버전으로 주긴 했는데, instance가 1.1 버전까지 지원한다고 하자. 이때 instance가 사용할 실제 물리적인 장치가 1.0까지 지원한다면, instance나 장치나 둘 다 1.0까지 사용할 수 있다. 만약 1.1까지 지원한다면 아무런 문제 없이 instance와 장치 둘 다 1.1까지 사용할 수 있다. 만약 장치가 1.2까지 지원이 가능한, 좀 더 최신 장치였다면 장치 자체는 1.2 버전까지 사용할 수 있다.
>
> 만약 `apiVersion`도 1.1 버전이었다면 1.2 버전까지 지원하는 장치는 1.2 버전에 해당하는 기능을 쓸 수 없게 된다.

**`enabledLayerCount`**라는 변수를 이해하려면 Vulkan의 계층이라는 개념을 먼저 이해해야 한다. Vulkan에서 계층이라는 것은 기존 Vulkan 시스템을 확장할 수 있는 추가적인 성분, 게임으로 치면 DLC와 같은 존재라고 생각하면 된다. 계층은 이미 존재하는 Vulkan의 함수를 자기 입맛대로 바꿀 수도 있다. 가장 대표적으로 자주 사용하게 될 계층은 바로 디버깅용 계층이다.

![BasicAppLoader](https://vulkan.lunarg.com/doc/view/1.3.239.0/windows/tutorial/images/BasicAppLoader.png)

위의 그림에서 볼 수 있듯이, 우리가 어플리케이션을 개발할 때, 이 어플리케이션이 사용할 계층과 실제 물리적인 장치를 연결을 해줘야 한다. 이 역할을 수행하는 것을 loader라고 부른다.

![loader_overview](https://github.com/KhronosGroup/Vulkan-Guide/raw/main/chapters/images/loader_overview.png)

만약 만들고 싶다면 [loader 인터페이스](https://github.com/KhronosGroup/Vulkan-Loader/blob/main/docs/LoaderInterfaceArchitecture.md)만 잘 지킨다면 만들 수도 있지만, 당장 Vulkan을 이해하는 과정에서는 크게 중요하지 않다.

Vulkan이라는 건 Direct3D 12와는 다르게 실제 구현부까지를 의미하는 것이 아닌 그냥 일종의 레시피이다. 즉, 헤더 파일까지는 제공하는데, 실제 구현부는 알아서 하라는 것이다. 그렇기 때문에 실제로 Vulkan을 사용하기 위해서는 loader를 연결해주어야 한다. 여기엔 두 가지 방법이 있는데, [컴파일 시에 직접 연결해주는 방법](https://github.com/KhronosGroup/Vulkan-Loader/blob/main/loader/LoaderAndLayerInterface.md#directly-linking-to-the-loader)과 [실행 중에 간접적으로 연결해주는 방법](https://github.com/KhronosGroup/Vulkan-Loader/blob/main/loader/LoaderAndLayerInterface.md#indirectly-linking-to-the-loader)이 있다. 어차피 이 글에서는 [LunarG에서 제공하는 Vulkan SDK](https://vulkan.lunarg.com/sdk/home)를 사용할 것이기 때문에 전자를 선택한다고 보면 된다. 안드로이드의 경우 Vulkan을 지원하는 기종은 이미 운영체제 자체에 [Vulkan loader](https://source.android.com/docs/core/graphics/implement-vulkan#vulkan_loader)를 갖고 있다. 리눅스의 경우에는 위에서 언급한 LunarG의 Vulkan SDK를 사용해서 컴파일 시에 링킹해주면 된다. MacOS나 Windows도 마찬가지인데, 이 글에서는 각자 Metal과 Direct3D 12를 사용한다고 가정할 것이기 때문에 딱히 다루지 않겠다.

다시 계층 얘기로 돌아오도록 하자. 결국 loader는 Vulkan SDK를 쓰면 된다는 건 알겠는데, 그럼 계층은 뭘 쓰면 되는 건지, 아니 애초에 계층이 뭐가 있는지도 우리는 모른다. 사실 초보자들 입장에서는 어떤 계층을 내가 사용할 수 있는지, 혹은 사용할지 매우 어려울 수 있다. 만약 궁금하다면 [`vkEnumerateInstanceLayerProperties`](https://registry.khronos.org/vulkan/specs/1.3/html/vkspec.html#vkEnumerateInstanceLayerProperties) 함수를 통해 직접 어떤 계층들을 사용할 수 있는지를 확인해볼 수 있다:


```cpp
// Provided by VK_VERSION_1_0
VkResult vkEnumerateInstanceLayerProperties(
    uint32_t*                                   pPropertyCount,
    VkLayerProperties*                          pProperties
    );

// example:
// Prometheus\Engine\Rendering\RendererVulkan.cpp/checkValidationLayerSupport line: 68 :	[0] VK_LAYER_NV_optimus
// Prometheus\Engine\Rendering\RendererVulkan.cpp/checkValidationLayerSupport line: 68 :	[1] VK_LAYER_LUNARG_api_dump
// Prometheus\Engine\Rendering\RendererVulkan.cpp/checkValidationLayerSupport line: 68 :	[2] VK_LAYER_LUNARG_gfxreconstruct
// Prometheus\Engine\Rendering\RendererVulkan.cpp/checkValidationLayerSupport line: 68 :	[3] VK_LAYER_KHRONOS_synchronization2
// Prometheus\Engine\Rendering\RendererVulkan.cpp/checkValidationLayerSupport line: 68 :	[4] VK_LAYER_KHRONOS_validation
// Prometheus\Engine\Rendering\RendererVulkan.cpp/checkValidationLayerSupport line: 68 :	[5] VK_LAYER_LUNARG_monitor
// Prometheus\Engine\Rendering\RendererVulkan.cpp/checkValidationLayerSupport line: 68 :	[6] VK_LAYER_LUNARG_screenshot
// Prometheus\Engine\Rendering\RendererVulkan.cpp/checkValidationLayerSupport line: 68 :	[7] VK_LAYER_KHRONOS_profiles
```

이중에서 `VK_LAYER_KHRONOS_validation` 계층이 바로 Khronos 그룹에서 공식으로 배포한 디버깅용 검증 계층이다.

**`ppEnabledLayerNames`**는 실제 활성화할 계층의 이름을 담고 있는 배열을 의미한다. 만약 검증 계층만 사용한다면, 해당 계층만을 원소로 갖는 배열의 포인터를 넘겨주면 될 것이다.

안드로이드의 경우 만약 검증 계층을 넘겨주고 싶다면 [ADB를 통해 처리](https://developer.android.com/ndk/guides/graphics/validation-layer#vl-adb)해주어야 한다. Linux의 경우에는 Vulkan SDK를 통해 계층을 넘겨주면 된다. 이 글에서는 계층이 존재하고, 무엇인지에 대해서는 설명은 하나, 앞으로는 계층에 집중해서 세세하게 논하지는 않을 것이다. 어차피 개발을 할 때 대부분의 사람들이 사용할 계층은 검증 계층이니, 이 부분만은 조금 다룰 것이다.

만약 여러분이 사용하려던 계층이 실제 사용할 수 없다면? 사용하려고 뒤져보니까 없는 계층이라면? 이런 상황에서 `vkCreateInstance`를 호출하여 instance를 생성하려고 하면 `VK_ERROR_LAYER_NOT_PRESENT`라는 값을 반환하게 된다.

**`enabledExtensionCount`**는 활성화할 확장이 몇 개인지라는 뜻인데, 확장이라는 건 현재 공식 스펙에는 없지만, 추가적으로 기능이 필요할 때 사용할 수 있는 것이다. 즉, Vulkan 내부적으로 뭔가 추가적인 함수나 클래스 같은 게 필요하고, 해당 기능을 갖는 확장이 존재한다면, 그걸 instance를 생성할 때 넣어주면 사용이 가능하다는 것이다. 대표적인 확장 중에 하나가 바로 레이 트레이싱 기능을 지원하는 `VK_KHR_accleration_structure`, `VK_KHR_ray_tracing_pipeline` 등의 확장들이다.

확장도 마찬가지로 현재 어떤 확장을 쓸 수 있고 없는지를 판단해야 한다. 확장은 크게 instance용 확장과 장치용 확장으로 나뉜다. 간단히 말하자면 instance용 확장은 `VkInstance`에 대한 확장이라는 뜻이고, 장치용 확장은 `VkDevice`에 대한 확장이라는 뜻이다. 여기서 장치라는 것은 GPU 장치를 의미한다. 만약 우리가 현재 instance 혹은 Vulkan을 사용할 장치에서 사용 가능한 확장이 무엇이 있을지 확인하고 싶다면, 계층에서 해줬던 것과 비슷하게 [`vkEnumerateInstanceExtensionProperties`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkEnumerateInstanceExtensionProperties) 혹은 [`vkEnumerateDeviceExtensionProperties`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkEnumerateDeviceExtensionProperties) 함수를 통해 알아보면 된다.

참고로 쓰지 않을 것이라면 확장은 사용하지 않는 것이 낫다. 단순히 "언젠간 쓰지 않을까?"라는 생각으로 확장을 여러 개 쌓아 두고 전부 활성화하고 있다간 성능을 상당히 좀먹을 것이다.

```cpp
// Provided by VK_VERSION_1_0
VkResult vkEnumerateInstanceExtensionProperties(
    const char*                                 pLayerName,
    uint32_t*                                   pPropertyCount,
    VkExtensionProperties*                      pProperties
    );

// Provided by VK_VERSION_1_0
VkResult vkEnumerateDeviceExtensionProperties(
    VkPhysicalDevice                            physicalDevice,
    const char*                                 pLayerName,
    uint32_t*                                   pPropertyCount,
    VkExtensionProperties*                      pProperties);

// example:
// instance
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_device_group_creation
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_display
...
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_NV_external_memory_capabilities

// device/properties
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 302 : Device[0] NVIDIA GeForce GTX 1050 Ti
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [0] VK_KHR_16bit_storage
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [1] VK_KHR_8bit_storage
...
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [122] VK_NVX_multiview_per_view_attributes
```

**ppEnabledExtensionNames**는 그래서 어떤 확장을 실제로 사용할 것인지를 정해주는 문자열의 배열이다. 위의 예시에서처럼 사용할 확장의 이름을 넣어주어 활성화해주는 것이다.

만약 여러분이 사용하려던 확장이 실제 사용할 수 없다면? 사용하려고 뒤져보니까 없는 확장이라면? 이런 상황에서 `vkCreateInstance`를 호출하여 instance를 생성하려고 하면 `VK_ERROR_EXTENSION_NOT_PRESENT`라는 값을 반환하게 된다.

자 이제 드디어 `vkCreateInstance` 함수의 첫번째 매개변수 `pCreateInfo`에 대해 알아보았다. 두번째 매개변수로는 `VkAllocationCallbacks`라는 개체에 대한 포인터를 받는데, 이건 메모리 할당에 대한 부분이다. Vulkan을 다루게 되면 이제는 단순히 CPU가 사용하는 시스템 메모리 뿐만 아니라 GPU가 사용할 장치 자체의 메모리도 중요해진다. 일단 컴퓨터의 입장에서 보면 CPU가 집 주인, 즉 호스트이기 때문에 RAM과 같이 시스템에서 사용하는 메모리를 호스트 메모리라 부르고 GPU와 같은 외부 장치가 사용하는 메모리를 장치 메모리라 부른다. 만약 우리가 Vulkan으로부터 뭔가 개체를 생성해달라고 요구를 한다면, Vulkan 입장에서는 그래서 이걸 어디에 저장하지?라는 고민에 빠지게 된다. 사용자가 미리 메모리를 잡고 제공할 수도 있겠지만, Vulkan 자체적으로 메모리를 할당하는 것이 유용할 때도 있다. 대표적인 이유가 바로 디버깅 용도이다. 여튼 호스트 메모리에서 할당을 받으려면 할당을 해줄 브로커가 필요하다. 그게 바로 우리가 요구하는 두번째 매개변수의 타입, [`VkAllocationCallbacks`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkAllocationCallbacks)이다.

```cpp
// Provided by VK_VERSION_1_0
typedef struct VkAllocationCallbacks {
    void*                                   pUserData;
    PFN_vkAllocationFunction                pfnAllocation;
    PFN_vkReallocationFunction              pfnReallocation;
    PFN_vkFreeFunction                      pfnFree;
    PFN_vkInternalAllocationNotification    pfnInternalAllocation;
    PFN_vkInternalFreeNotification          pfnInternalFree;
} VkAllocationCallbacks;
```

`pUserData`는 대충 콜백에 전달할 매개변수라고 이해하면 된다. 나머지 `pfnAllocation`은 어플리케이션 단에서 메모리 할당을 담당하는 콜백 함수, `pfnReallocation`은 어플리케이션 단에서 재할당을 담당하는 콜백 함수, `pfnFree`는 어플리케이션 단에서 메모리 해제를 담당하는 콜백 함수, `pfnInternalAllocation`은 구현부 단에서 메모리 할당을 담당하는 콜백 함수, `pfnInternalFree`는 구현부 단에서 메모리 해제를 담당하는 콜백 함수이다.

이번에도 그냥 그렇구나 하고 넘어가면 된다. 지금은 당장 메모리 관리 이런 걸 다루기에는 아직 초짜다. 지금은 그냥 `nullptr`를 넘겨주도록 하자.

마지막 매개변수는 실제 instance 개체를 반환 받을 `VkInstance` 개체다.

이렇듯 (1) 생성에 필요한 정보를 포함한 구조체를 가리키는 포인터, (2) 메모리 할당자를 가리키는 포인터, (3) 생성한 개체를 가리키는 포인터로 이루어진 삼중 매개변수들을 앞으로 자주 만나게 될 것이다. 주로 무언가를 생성할 때 이런 형태를 띤다.

이런 지식을 바탕으로 실제로 인스턴스를 초기화 해보도록 하자:

```cpp
VkResult vr = VK_SUCCESS;

// Application Information
VkApplicationInfo vkAppInfo =
{
    .sType = VK_STRUCTURE_TYPE_APPLICATION_INFO,
    .pNext = nullptr,
    .pApplicationName = "Sample Application",
    .applicationVersion = VK_MAKE_VERSION(1, 0, 0),
    .pEngineName = "Prometheus",
    .engineVersion = VK_MAKE_VERSION(1, 0, 0),
    .apiVersion = VK_API_VERSION_1_2,
};

// Layers

// Get available layers
uint32_t numLayers = 0;
vr = vkEnumerateInstanceLayerProperties(&numLayers, nullptr);
if (vr != VK_SUCCESS)
{
    LOGVR(log::eVerbosity::Warn, vr);
}
std::vector<VkLayerProperties> availableLayerProperties(numLayers);
vr = vkEnumerateInstanceLayerProperties(&numLayers, availableLayerProperties.data());
if (vr != VK_SUCCESS)
{
    LOGVR(log::eVerbosity::Warn, vr);
}
std::unordered_map<std::string, VkLayerProperties> availableLayerPropertiesLookupTable;
for (const VkLayerProperties& layerProperties : availableLayerProperties)
{
    availableLayerPropertiesLookupTable.insert({std::string(layerProperties.layerName), layerProperties});
}

// Find layers needed in the available layers
std::vector<const char*> layerNamesToUse = { ... };
std::vector<const char*> enabledLayerNames;
enabledLayerNames.reserve(layerNamesToUse.size());
for (const char* layerNameToUse : layerNamesToUse)
{
    auto findResult = availableLayerPropertiesLookupTable.find(std::string(layerNameToUse));
    if (findResult != availableLayerPropertiesLookupTable.end())
    {
        enabledLayerNames.push_back(findResult)
    }
}

// Extensions

uint32_t extensionCount = 0;
vr = vkEnumerateInstanceExtensionProperties(nullptr, &extensionCount, nullptr);
if (vr != VK_SUCCESS)
{
    LOGVR(log::eVerbosity::Warn, vr);
}
std::vector<VkExtensionProperties> availableExtensionProperties(extensionCount);
vr = vkEnumerateInstanceExtensionProperties(nullptr, &extensionCount, availableExtensionProperties.data());
if (vr != VK_SUCCESS)
{
    LOGVR(log::eVerbosity::Warn, vr);
}
std::unordered_map<std::string, VkExtensionProperties> availableExtensionPropertiesLookupTable;
for (const VkExtensionProperties& extensionProperty : availableExtensionProperties)
{
    availableExtensionPropertiesLookupTable.insert({std::string(vkExtensionProperty.extensionName), extensionProperty});
}

// Find extensions needed in the available extensions
std::vector<const char*> extensionNamesToUse = { ... };
std::vector<const char*> enabledExtensionNames;
enabledExtensionNames.reserve(extensionNamesToUse.size());
for (const char* extensionNameToUse : extensionNamesToUse)
{
    auto findResult = availableExtensionPropertiesLookupTable.find(std::string(extensionNameToUse));
    if (findResult != availableExtensionPropertiesLookupTable.end())
    {
        enabledExtensionNames.push_back(findResult)
    }
}

// Instance Creation Information
VkInstanceCreateInfo instanceCreateInfo =
{
    .sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO
    .pNext = nullptr,
    .flags = 0x0,
    .pApplicationInfo = &appInfo,
    .enabledLayerCount = enabledLayerNames.size(),
    .ppEnabledLayerNames = enabledLayerNames.data(),
    .enabledExtensionCount = enabledExtensionNames.size(),
    .enabledExtensionCount = enabledExtensionNames.data()
};

VkInstance instance;
vr = vkCreateInstance(&instanceCreateInfo, nullptr, &instance);
if (vr != VK_SUCCESS)
{
    LOGF(log::eVerbosity::Error, L"vkCreateInstance Failed: %s", string_VkResult(vr));
    return vr;
}
```

근데 여기서 한 가지 의문점이 들 수도 있다. Instance를 생성할 때 검증 계층 같은 디버깅 용도의 계층이나 확장들을 추가해주면 instance 생성 이후 단계에서의 개발은 편하겠지만, 만약 instance 자체의 생성과 소멸을 디버깅하고 싶다면 어떻게 해야 할까? 이럴 땐 instance 생성 정보를 넘길 때 추가적인 정보를 넘겨주어야 한다. 그것이 바로 [`VkDebugReportCallbackCreateInfoEXT`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkDebugReportCallbackCreateInfoEXT) 구조체 혹은 [`VkDebugUtilsMessengerCreateInfoEXT`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkDebugUtilsMessengerCreateInfoEXT) 구조체이다. 딱 instance 생성/소멸 때만 유효한 어떤 디버깅용 기능을 주고 싶을 때 이 구조체를 만들어서 `VkInstanceCreateInfo`의 `pNext`에 주면 된다.

```cpp
// Provided by VK_EXT_debug_report
typedef struct VkDebugReportCallbackCreateInfoEXT {
    VkStructureType                 sType;
    const void*                     pNext;
    VkDebugReportFlagsEXT           flags;
    PFN_vkDebugReportCallbackEXT    pfnCallback;
    void*                           pUserData;
} VkDebugReportCallbackCreateInfoEXT;

// Provided by VK_EXT_debug_utils
typedef struct VkDebugUtilsMessengerCreateInfoEXT {
    VkStructureType                         sType;
    const void*                             pNext;
    VkDebugUtilsMessengerCreateFlagsEXT     flags;
    VkDebugUtilsMessageSeverityFlagsEXT     messageSeverity;
    VkDebugUtilsMessageTypeFlagsEXT         messageType;
    PFN_vkDebugUtilsMessengerCallbackEXT    pfnUserCallback;
    void*                                   pUserData;
} VkDebugUtilsMessengerCreateInfoEXT;
```

이름에 `EXT`를 붙은 걸 통해 눈치 챘겠지만, 확장이 필요한 기능들이다. 그렇기에 빡세게는 안 다룰 것이다. 또한 이름을 통해 콜백 함수가 필요하는 걸 눈치 챌 수 있다. 일단은 그냥 그렇구나 하고 넘어가면 된다. 지금 당장은 중요하지 않다. 혹시나 궁금한 분들을 위해 예시로만 남겨두겠다:

```cpp
// Debug callback
VKAPI_ATTR VkBool32 VKAPI_CALL DebugCallback(
    VkDebugUtilsMessageSeverityFlagBitsEXT messageSeverity,
    VkDebugUtilsMessageTypeFlagsEXT messageType,
    const VkDebugUtilsMessengerCallbackDataEXT* pCallbackData,
    void* pUserData
);
...

VkResult vr = VK_SUCCESS;
VkInstance instance;

...

VkDebugUtilsMessengerCreateInfoEXT debugUtilsMessengerCreationInfo =
{
    // must be VK_STRUCTURE_TYPE_DEBUG_UTILS_MESSENGER_CREATE_INFO_EXT
    .sType = VK_STRUCTURE_TYPE_DEBUG_UTILS_MESSENGER_CREATE_INFO_EXT,
    .pNext = nullptr,
    // must be 0
    .flags = 0x0,
    // a bitmask of VkDebugUtilsMessageSeverityFlagBitsEXT specifying which severity of event(s) will cause this callback to be called
    .messageSeverity = VK_DEBUG_UTILS_MESSAGE_SEVERITY_VERBOSE_BIT_EXT | VK_DEBUG_UTILS_MESSAGE_SEVERITY_WARNING_BIT_EXT | VK_DEBUG_UTILS_MESSAGE_SEVERITY_ERROR_BIT_EXT,
    // a bitmask of VkDebugUtilsMessageTypeFlagBitsEXT specifying which type of event(s) will cause this callback to be called
    .messageType = VK_DEBUG_UTILS_MESSAGE_TYPE_GENERAL_BIT_EXT | VK_DEBUG_UTILS_MESSAGE_TYPE_VALIDATION_BIT_EXT | VK_DEBUG_UTILS_MESSAGE_TYPE_PERFORMANCE_BIT_EXT,
    // the application callback function to call
    .pfnUserCallback = DebugCallback,
    // user data to be passed to the callback
    .pUserData = nullptr // Optional
};

...

VkInstanceCreateInfo instanceCreateInfo =
{
    // Type of the structure. must be VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO.
    .sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO,
#ifdef _DEBUG
    // a pointer to a structure extending this structure
    .pNext = &debugUtilsMessengerCreationInfo,
#else
    ...
};

vr = vkCreateInstance(&instanceCreateInfo, nullptr, &instance);

...
```

생성을 했으면 부술 줄도 알아야 한다:

```cpp
// Provided by VK_VERSION_1_0
void vkDestroyInstance(
    VkInstance instance,
    const VkAllocationCallbacks* pAllocator
    );

```

간단하다. 소멸할 instance와 해당 instance를 할당해준 놈을 불러오면 된다. 만약 할당해준 놈이 없으면 `nullptr`를 넣어주는 것이다.

어차피 이 글의 수준에서는 사실상 한 개의 instance만을 다루므로 사실상 전역 context의 역할을 수행한다고 보면 된다.

### Device와 Queue

Instance 다음으로 생성해야 하는 것은 바로 ***Device***와 ***Queue*** 개체이다. Direct3D 11을 알고 있다면, instance는 ID3D11Device, device는 ID3D11ImmediateContext 느낌이라고 이해할 수 있다. 사실상 디버그나 초기화 같은 걸 제외하면 전부 device를 통해서 명령이 이루어지기 때문이다. 여기서 device라는 것은 단순히 실제 컴퓨터에 박혀있는 물리적은 GPU 장치 말고도 개념적인 구분으로서의 논리적 device도 존재한다.

물리 장치라는 건 보통 현재 호스트가 사용할 수 있는 하나의 완전한 Vulkan의 (instance 수준의 기능을 제외한)구현부를 의미한다. 즉, 그래픽 카드라고 보면 된다. 논리 장치라는 것은 그 구현부의 한 instance로, 다른 논리 장치와는 독립적인 자기만의 상태와 자원을 갖는다.

#### 물리 장치

어차피 이제 instance를 생성했으니 loader를 통해 Vulkan을 지원하는 물리 장치가 얼마나 있는지, 각 장치의 능력을 알 수 있다. 물론 어플리케이션에서까지 이걸 알려면 Vulkan API에 물어봐서 파악해야 한다. 이때 이 정보를 Vulkan에선 `VkPhysicalDevice`라는 핸들로 제공한다. 일반적인 게이밍 PC 등에서는 전용 그래픽 카드 하나만 있으니 `VkPhysicalDevice`도 하나만 보일 것이다. 이땐 딱히 어떤 그래픽 카드를 사용할지 고민할 필요가 없지만, 노트북과 같이 내장 그래픽 카드와 외장 그래픽 카드라는 구분이 존재하는 경우에는 좀 달라진다. 이 경우에는 둘 중에 하나를 고르든, 사용자가 고르게 만들든 해서 하나를 선택해야 한다.

![PhysicalDevice](https://vulkan.lunarg.com/doc/view/1.3.239.0/windows/tutorial/images/PhysicalDevices.png)

위의 그림처럼 물리 장치들은 instance에 종속되어 있다. 즉, instance를 소멸하면 자동으로 물리 장치들도 소멸되므로 수명 주기를 고려할 필요가 없다.

일단 시스템에 설치된 물리 장치들이 얼마나 있는지 [`vkEnumeratePhysicalDevices`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkEnumeratePhysicalDevices) 함수를 통해 알아보도록 하자:

```cpp
// Provided by VK_VERSION_1_0
VkResult vkEnumeratePhysicalDevices(
    VkInstance                                  instance,
    uint32_t*                                   pPhysicalDeviceCount,
    VkPhysicalDevice*                           pPhysicalDevices
    );
```

이제 enumerate이라는 표현이 들어간 함수는 대충 어떻게 사용할지 감이 올 것이다.

만약 어떤 개체가 필요할 때, 해당 개체가 얼마나 존재하는지를 알아본다고 한다면:

1. 우선 개체가 몇 개가 있는지 알아보기 위해 개수 매개변수에 정수 하나 주고, 개체 목록 매개변수엔 `nullptr`를 준다
2. API가 현재 개체가 몇 개가 있는지 다 세어 개수를 반환해준다.
3. 어플리케이션이 반환 받은 개수만큼 실제 개체 목록을 만든다.
4. 어플리케이션이 다시 함수를 호출하고, 이번에는 개체 목록을 제대로 포인터로 넘겨준다.

이제는 익숙한 패턴이 될 것이다.

```cpp
VkResult vr = VK_SUCCESS;

uint32_t uDeviceCount = 0;
vr = vkEnumeratePhysicalDevices(m_Instance, &uDeviceCount, nullptr);
if (vr != VK_SUCCESS)
{
    LOGVR(log::eVerbosity::Error, vr);
    if (uDeviceCount == 0)
    {
        LOG(log::eVerbosity::Error, L"failed to find GPUs with Vulkan support!");
    }

    return vr;
}

std::vector<VkPhysicalDevice> devices(uDeviceCount);
vr = vkEnumeratePhysicalDevices(m_Instance, &uDeviceCount, devices.data());
if (vr != VK_SUCCESS)
{
    LOGVR(log::eVerbosity::Error, vr);
    return vr;
}
```

`VkPhysicalDevice`는 그래픽 카드일 수도 있고, SoC 위의 GPU 코어일 수도 있고... 여러 다양한 가능성이 있기 때문에 신중히 보고 골라야 한다. 그렇다면 얻은 이 장치들의 정보를 어떻게 알 수 있을까? 바로 [`vkGetPhysicalDeviceProperties`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkGetPhysicalDeviceProperties) 함수를 통해 `VkPhysicalDeviceProperties` 구조체를 구해야 한다.


```cpp
// Provided by VK_VERSION_1_0
void vkGetPhysicalDeviceProperties(
    VkPhysicalDevice                            physicalDevice,
    VkPhysicalDeviceProperties*                 pProperties
    );

// Provided by VK_VERSION_1_0
typedef struct VkPhysicalDeviceProperties {
    uint32_t                            apiVersion;
    uint32_t                            driverVersion;
    uint32_t                            vendorID;
    uint32_t                            deviceID;
    VkPhysicalDeviceType                deviceType;
    char                                deviceName[VK_MAX_PHYSICAL_DEVICE_NAME_SIZE];
    uint8_t                             pipelineCacheUUID[VK_UUID_SIZE];
    VkPhysicalDeviceLimits              limits;
    VkPhysicalDeviceSparseProperties    sparseProperties;
} VkPhysicalDeviceProperties;

uint32 uAvailableDeviceCount = 0;
for (const VkPhysicalDevice& device : devices)
{
    VkPhysicalDeviceProperties deviceProperties = {};
    vkGetPhysicalDeviceProperties(device, &deviceProperties);

    LOGFA(log::eVerbosity::Debug, "Available physical devices[%u]: %s", uAvailableDeviceCount, deviceProperties.deviceName);
    uAvailableDeviceCount++;
}

// example:
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 525 :	Available physical devices[0]: NVIDIA GeForce RTX 3060 Laptop GPU
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 525 :	Available physical devices[1]: Intel(R) Iris(R) Xe Graphics
```

> 만약 device의 `apiVersion`이 현재 instance의 버전보다 높다면, 해당 버전의 기능을 사용해서는 안된다!!

물리 장치의 각 속성을 간단하게나마 이해해보자:

* `apiVersion`은 물리 장치가 지원하는 Vulkan 버전을 의미한다.
* `driverVersion`은 드라이버의 버전을 의미한다.
* `vendorID`는 물리 장치를 공급한 회사를 의미한다.
* `deviceID`는 실제 회사가 공급한 물리 장치를 의미한다.
* `deviceType`은 [`VkPhysicalDeviceType`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkPhysicalDeviceType) 구조체로, 이 장치가 내장 그래픽 카드인지, 외장 그래픽 카드인지 등의 유형을 의미한다.
* `deviceName`은 해당 장치의 이름을 의미한다.
* `pipelineCacheUUID`는 장치의 UUID를 의미한다.
* `limits`는 [`VkPhysicalDeviceLimits`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkPhysicalDeviceLimits) 구조체로, 물리 장치의 물리적인 [한계](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#limits)를 의미한다.
* `sparseProperties`는 [`VkPhysicalDeviceSparseProperties`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkPhysicalDeviceSparseProperties) 구조체로 물리 장치의 여러 sparse 관련된 속성을 갖고 있다.

예시 결과:
```cpp
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 525:	Available physical devices[0] : NVIDIA GeForce RTX 3060 Laptop GPU
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 526:		API Version : 1.3.224
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 527:		Driver Version : 2214985728
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 528:		Vendor ID : 4318
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 543:		Device Type : Discrete GPU
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 560:		Pipeline Cache UUID : 1060432756
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 525:	Available physical devices[1] : Intel(R) Iris(R) Xe Graphics
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 526:		API Version : 1.2.205
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 527:		Driver Version : 1656415
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 528:		Vendor ID : 32902
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 538:		Device Type : Integrated GPU
// Prometheus\Engine\Rendering\RendererVulkan.cpp/selectPhysicalDevice line: 560:		Pipeline Cache UUID : 1060432756
```

솔직히 그냥 Vulkan을 해보는 데에 의의가 있다면 대충 첫번째로 나오는 물리 장치를 메인으로 사용할 물리 장치로 선택하면 되긴 한다. 근데 좀 더 구체적으로 어떤 물리 장치를 선택할까를 고민하려면 좀 더 세부적인 내용을 파고 들어야 한다.

우리가 물리 장치가 실제로 필요한 이유는 나중에 물리 장치보고 일을 시키려고 하기 때문이다. 우리가 물리 장치에 일을 시키려고 할 때 보면 언제나 시키는 순간에 그 일을 바로 수행할 수는 없을 것이다. 우리의 명령이 "이 닦고, 씻고, 옷 갈아 입기"라고 해보자. 우리가 이 닦으라는 명령을 내리면 물리 장치는 이를 닦을 것이다. 그 다음에 우리가 바로 씻으라고 해봤자 물리 장치 입장에서는 이 닦느라 바쁘니 바로 씻을 수는 없을 것이다. 적어도 이는 다 닦아야지. 이렇듯이 뭔가 명령어를 줄 때는 들어온 순서대로 처리할 수 있기 위해 일종의 큐가 존재한다.

![PhysicalDeviceQueueFamilyProperties.png](https://vulkan.lunarg.com/doc/view/1.3.239.0/windows/tutorial/images/PhysicalDeviceQueueFamilyProperties.png)

Vulkan에서는 큐가 여러 계열로 나뉜다. 이걸 family라고 칭하는데, 이에 대한 정보는 [`VkQueueFamilyProperties`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkQueueFamilyProperties)라는 구조체에 있으며, [vkGetPhysicalDeviceQueueFamilyProperties](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkGetPhysicalDeviceQueueFamilyProperties) 함수를 통해 알아올 수 있다.

![Device2QueueFamilies](https://vulkan.lunarg.com/doc/view/1.3.239.0/windows/tutorial/images/Device2QueueFamilies.png)

위의 예시처럼 하나의 flag만 셋팅된 큐 family를 여러 개 갖는 물리 장치도 존재하지만, 내장 그래픽 카드와 같이 간단한 그래픽 카드의 경우엔 여러 flag가 동시에 셋팅되어 있는 하나의 큐 family만을 갖고 있는 경우도 있다.

![Device1QueueFamilies](https://vulkan.lunarg.com/doc/view/1.3.239.0/windows/tutorial/images/Device1QueueFamilies.png)

```cpp
// Provided by VK_VERSION_1_0
void vkGetPhysicalDeviceQueueFamilyProperties(
    VkPhysicalDevice                            physicalDevice,
    uint32_t*                                   pQueueFamilyPropertyCount,
    VkQueueFamilyProperties*                    pQueueFamilyProperties
    );

// Provided by VK_VERSION_1_0
typedef struct VkQueueFamilyProperties {
    VkQueueFlags    queueFlags;
    uint32_t        queueCount;
    uint32_t        timestampValidBits;
    VkExtent3D      minImageTransferGranularity;
} VkQueueFamilyProperties;
```

일단 우리는 현재로서는 간단하게 렌더링 작업만 수행을 할 것이므로, 해당 명령을 넣어줄 수 있는 큐가 필요하다. 이렇듯 어떤 큐의 유형을 파악하려면 [`queueFlags`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkQueueFlags)에서 원하는 명령을 넣어줄 수 있는지 여부를 비트 체크해주면 된다. 각 비트는 [`VkQueueFlagBits`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkQueueFlagBits)에서 확인할 수 있다. 렌더링의 경우 `VK_QUEUE_GRAPHICS_BIT`를 사용한다.

#### 논리 장치

이제 물리 장치를 구했으니, 이 물리 장치가 작동하는 그래픽 드라이버, 즉 논리 장치를 찾아야 한다. 이것이 바로 [`VkDevice`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkDevice) 개체이다. 이제는 그래픽 카드와 소통할 땐 이 드라이버를 통해서 소통하면 된다. 이제부터는 디버깅이나 초기화와 같은 명령어를 제외하고는 거의 전부 `VkDevice`를 통해서 이루어져야 한다. 논리 장치는 다음 다섯 가지의 일을 한다고 보면 된다:

1. [큐](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#queues)의 생성
2. 여러 [동기화](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#synchronization) 구조체의 생성 및 추적
3. [메모리 할당, 해제, 관리](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#memory), [자원 생성](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#resources)
4. [명령 버퍼](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#commandbuffers)와 명령 버퍼 풀의 생성 및 소멸
5. 그래픽스 상태([파이프라인](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#pipelines), [자원 Descriptor](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#descriptorsets))의 생성, 소멸, 관리.

참고로 여러 물리 장치가 존재할 때 각각의 논리 장치를 구해서 직접 여러 그래픽 카드를 동시에 제어해주고, 서로 데이터도 공유하게 할 수도 있다. 예를 들어 가장 사양이 좋은 메인 그래픽 카드의 논리 장치를 실제 렌더링 작업에 사용을 하고, 나머지 잉여 내장 그래픽 카드의 논리 장치로 물리 계산이라든가의 작업을 시키는 것이다.

물론 반대로 여러 물리 장치가 하나의 논리 장치를 사용할 수도 있다. 단, 이 경우엔 이 물리 장치들은 같은 장치 집합에 속해 있어야 한다. 장치 집합이란 물리 장치 간에 서로의 메모리에 접근할 수 있으며, 이 집합에 속한 모든 물리 장치들에서 실행할 수 있는 명렁 버퍼를 기록할 수 있는 물리 장치의 집합을 의미한다. 물리 장치 집합이 뭐가 있는지를 [`vkEnumeratePhysicalDeviceGroups`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkEnumeratePhysicalDeviceGroups) 함수를 통해 알아 본 다음, [`VkDeviceGroupDeviceCreateInfo`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkDeviceGroupDeviceCreateInfo) 구조체를 통해 이 집합이 사용할 수 있는 논리 장치를 생성해주면 된다.

```cpp
// Provided by VK_VERSION_1_1
VkResult vkEnumeratePhysicalDeviceGroups(
    VkInstance                                  instance,
    uint32_t*                                   pPhysicalDeviceGroupCount,
    VkPhysicalDeviceGroupProperties*            pPhysicalDeviceGroupProperties
    );

// Provided by VK_KHR_device_group_creation
VkResult vkEnumeratePhysicalDeviceGroupsKHR(
    VkInstance                                  instance,
    uint32_t*                                   pPhysicalDeviceGroupCount,
    VkPhysicalDeviceGroupProperties*            pPhysicalDeviceGroupProperties
    );
```

위의 두 함수는 동일한 함수이다.

이제 논리 장치를 [`vkCreateDevice`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkCreateDevice) 함수를 통해 생성해보도록 하자:

```cpp
// Provided by VK_VERSION_1_0
VkResult vkCreateDevice(
    VkPhysicalDevice                            physicalDevice,
    const VkDeviceCreateInfo*                   pCreateInfo,
    const VkAllocationCallbacks*                pAllocator,
    VkDevice*                                   pDevice
    );
```

당연히 첫번째 매개변수 `physicalDevice`는 이 논리 장치가 사용하는 물리 장치를 의미하는 것이고, `pDevice`는 논리 장치를 의미한다. 그렇다면 남은 것은 바로 `pCreateInfo` 매개변수로, [`VkDeviceCreateInfo`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkDeviceCreateInfo) 구조체를 채워서 넣어주어야 한다.

```cpp
// Provided by VK_VERSION_1_0
typedef struct VkDeviceCreateInfo {
    VkStructureType                    sType;
    const void*                        pNext;
    VkDeviceCreateFlags                flags;
    uint32_t                           queueCreateInfoCount;
    const VkDeviceQueueCreateInfo*     pQueueCreateInfos;
    uint32_t                           enabledLayerCount;
    const char* const*                 ppEnabledLayerNames;
    uint32_t                           enabledExtensionCount;
    const char* const*                 ppEnabledExtensionNames;
    const VkPhysicalDeviceFeatures*    pEnabledFeatures;
} VkDeviceCreateInfo;
```

여기서 `sType`은 `VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO`이고, `queueCreateInfoCount`는 이 논리 장치가 사용할 큐의 개수를 의미하고, `pQueueCreateInfos`는 사용할 큐의 생성 정보들을 갖고 있는 [`VkDeviceQueueCreateInfo`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkDeviceQueueCreateInfo) 구조체의 배열을 의미한다. 나머지는 instance 생성할 때랑 같다고 보면 되는데, 계층 관련된 매개변수들은 이제 사용하지 않는다. `pEnabledFeatures`는 사용할 [기능](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#features)들에 대한 여러 불리언 값들을 갖고 있다.

아까 물리 장치가 갖고 있는 큐 중에서 어떤 큐를 사용할지 정했다면, 해당 큐를 `VkDeviceQueueCreateInfo` 구조체를 통해 실제로 생성해주어야 한다. 큐가 실제로 생성이 되어야 명령어를 전달할 수 있기 때문이다. 이 구조체를 논리 장치를 생성할 때 전달해주는 것이다.

```cpp
// Provided by VK_VERSION_1_0
typedef struct VkDeviceQueueCreateInfo {
    VkStructureType             sType;
    const void*                 pNext;
    VkDeviceQueueCreateFlags    flags;
    uint32_t                    queueFamilyIndex;
    uint32_t                    queueCount;
    const float*                pQueuePriorities;
} VkDeviceQueueCreateInfo;
```

실제 생성을 해보자:

```cpp
float queuePriority = 1.0f;

VkDeviceQueueCreateInfo queueCreateInfo =
{
    .sType = VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO,
    .pNext = nullptr,
    .flags = 0x0,
    .queueFamilyIndex = m_uGraphicsQueueIndex,
    .queueCount = 1,
    .pQueuePriorities = &queuePriority,
};

const std::vector<const char*> deviceExtensionsToEnableNames =
{
    VK_KHR_SWAPCHAIN_EXTENSION_NAME
};

uint32 uExtensionPropertiesCount = 0;
vr = vkEnumerateDeviceExtensionProperties(m_PhysicalDevice, nullptr, &uExtensionPropertiesCount, nullptr);
if (vr != VK_SUCCESS)
{
    LOGVR(log::eVerbosity::Error, vr);
    return vr;
}
std::vector<VkExtensionProperties> availableDeviceExtensionPropertiesList(uExtensionPropertiesCount);
vkEnumerateDeviceExtensionProperties(m_PhysicalDevice, nullptr, &uExtensionPropertiesCount, availableDeviceExtensionPropertiesList.data());
if (vr != VK_SUCCESS)
{
    LOGVR(log::eVerbosity::Error, vr);
    return vr;
}
std::unordered_set<std::string> availableDeviceExtensionNamesLookup;
for (const VkExtensionProperties& deviceExtensionProperties : availableDeviceExtensionPropertiesList)
{
    LOGFA(log::eVerbosity::Debug, "Device Extension: %s", deviceExtensionProperties.extensionName);
    availableDeviceExtensionNamesLookup.insert(std::string(deviceExtensionProperties.extensionName));
}

for (const char* const extensionToEnableName : deviceExtensionsToEnableNames)
{
    auto findIt = availableDeviceExtensionNamesLookup.find(std::string(extensionToEnableName));
    if (findIt == availableDeviceExtensionNamesLookup.end())
    {
        LOGFA(log::eVerbosity::Error, "Extension %s not found in available device extensions", extensionToEnableName));
        return VK_ERROR_EXTENSION_NOT_PRESENT;
    }
}

VkPhysicalDeviceFeatures deviceFeatures = { };

VkDeviceCreateInfo createInfo =
{
    .sType = VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO,
    .pNext = nullptr,
    .flags = 0x0,
    .queueCreateInfoCount = 1,
    .pQueueCreateInfos = &queueCreateInfo,
    // deprecated and ignored
    .enabledLayerCount = 0,
    // deprecated and ignored
    .ppEnabledLayerNames = nullptr,
    .enabledExtensionCount = static_cast<uint32>(deviceExtensionsToEnableNames.size()),
    .ppEnabledExtensionNames = deviceExtensionsToEnableNames.data(),
    .pEnabledFeatures = &deviceFeatures,
};

vr = vkCreateDevice(m_PhysicalDevice, &createInfo, nullptr, &m_Device);
if (vr != VK_SUCCESS)
{
    LOGVR(log::eVerbosity::Error, vr);
    return vr;
}
```

나중에 좀 더 Vulkan을 다루다보면 겪겠지만, 가끔 여러 가지 이유로 논리 장치를 우리가 잃어버릴 수도 있다. 정말 말 그대로 어디론가 사라져버리는 것이다. 예를 들어 뭔가를 처리하고 있는데 이게 너무 오래 걸려서 사라져 버리는 경우가 있다. 이 내용은 나중에 좀 더 다루도록 하자.

생성이 있으면 소멸도 있는 법. 논리 장치는 [`vkDestroyDevice`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkDestroyDevice) 함수로 소멸해준다.

```cpp
// Provided by VK_VERSION_1_0
void vkDestroyDevice(
    VkDevice device,
    const VkAllocationCallbacks* pAllocator
    );
```

#### 큐

우리가 위에서 논리 장치를 생성해줄 때 `VkDeviceQueueCreateInfo` 구조체를 통해서 큐도 생성을 해주었었다. 그렇다면 이 큐에 대한 핸들 같은 걸 얻어올 수는 없을까? 당연히 있다. [`VkQueue`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkQueue) 개체가 바로 그러한 핸들이다. 이미 큐를 생성했다면 해당 큐를 사용하는 논리 장치, family 색인과 큐 색인 세 가지만 알면 해당 큐에 대한 핸들을 [`vkGetDeviceQueue`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkGetDeviceQueue) 함수를 통해 얻어올 수 있다:

```cpp
// Provided by VK_VERSION_1_0
void vkGetDeviceQueue(
    VkDevice device,
    uint32_t queueFamilyIndex,
    uint32_t queueIndex,
    VkQueue* pQueue
    );
```

이처럼 계속해서 큐와 관련된 작업을 할 때는 이 큐가 어느 family 소속인지를 계속해서 알아야 한다. 그렇기에 큐 family 색인은 따로 저장해두고 필요할 때마다 꺼내서 쓰도록 하자. 단순히 큐에 대한 핸들을 얻을 때 뿐만 아니라 나중에 [`VkCommandPool`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkCommandPool)이라든가, [`VkImage`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkImage)나 [`VkBuffer`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkBuffer) 등을 생성할 때도 필요하게 될 것이다.

큐를 만들어줄 때 우리는 큐에 우선 순위라는 항목을 넣어 주었었다. 1.0부터 0.0까지의 정규화된 값으로 각 큐에 우선 순위를 부여한다고 보면 된다. 당연하겠지만 우선 순위가 높은 큐에 좀 더 많은 연산 예산을 부여해줄 것이다. 근데 이 우선 순위는 같은 장치 내에서 그렇다는 거지, 서로 다른 장치의 큐 간에는 우선 순위의 차이가 크게 의미가 없다.

나중에 이 큐에 명령어를 전달할 때 [`vkQueueSubmit2`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkQueueSubmit2)나 [`vkQueueSubmit`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkQueueSubmit)과 같은 ***큐 제출queue submission*** 명령어를 통해 전달하게 된다. 큐 제출 명령은 나중에 이 큐가 꽃혀있는 물리 장치가 작업을 할 ***큐 작업queue operations***의 집합으로 이루어 져있다. 여기엔 세마포어와 펜스를 통한 동기화도 포함된다.

제출 명령은 제출할 대상 큐, 0 이상의 작업 배치batch, 완료 시 신호를 보낼 **추가적인, optional한** 펜스가 있다. 각 배치는 세 가지로 나뉜다:

1. 나머지 배치의 실행 이전에 기다릴 0개 이상의 세마포어
   1. 만약 그러한 세마포어가 있다면 [세마포어 대기 연산](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#synchronization-semaphores-waiting)을 정의
2. 실행할 0개 이상의 작업
   1. 만약 그러한 작업이 있다면 해당 작업에 알맞는 ***큐 연산***을 정의
3. 작업이 끝나면 신호를 보낼 0개 이상의 세마포어
   1. 만약 그러한 세마포어가 있다면 [세마포어 신호 연산](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#synchronization-semaphores-signaling)을 정의

큐 제출할 때 펜스가 존재한다면, [펜스 신호 연산](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#synchronization-fences-signaling)이 큐 제출에 의해 정의가 된다.

큐는 `vkCreateDevice`에 의해 생성이 되고, 이에 따라 생성된 논리 장치를 `vkDestroyDevice`로 소멸할 때 같이 소멸된다.