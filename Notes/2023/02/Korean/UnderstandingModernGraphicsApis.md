# 요즘 Graphics API 이해하기 (2023.02.20)
[Home](/README.md)

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

### Instance란?

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

**`pNext`**는 이 구조체의 확장이 있다면, 걔가 어디 있냐는 걸 물어보는 건데, 여기서는 확장까지 다룰 생각이 없으니 `nullptr`를 주면 된다.

**`flags`**는 [`VkInstanceCreateFlags`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkInstanceCreateFlags)의 조합으로, 이 instance 개체의 성격을 정해줄 수 있다. 근데 여기서 설정할 수 있는 flag는 아래 코드에 있는 [`VkInstanceCreateFlagBits::VK_INSTANCE_CREATE_ENUMERATE_PORTABILITY_BIT_KHR`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#VkInstanceCreateFlagBits) 딱 하나 밖에 없다. 근데 여기선 알 필요 없고, 그냥 0 주면 된다.

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

정말로 말 그대로 어플리케이션 이름이 뭐고, 버전이 뭐고, 엔진이 있다면 엔진 이름이 뭐고, 버전이 뭐고, Vulkan API 버전이 몇이고 등을 전달할 수 있다.

**`enabledLayerCount`**라는 변수를 이해하려면 Vulkan의 계층이라는 개념을 먼저 이해해야 한다. Vulkan에서 계층이라는 것은 기존 Vulkan 시스템을 확장할 수 있는 추가적인 성분, 게임으로 치면 DLC와 같은 존재라고 생각하면 된다. 계층은 이미 존재하는 Vulkan의 함수를 자기 입맛대로 바꿀 수도 있다. 가장 대표적으로 자주 사용하게 될 계층은 바로 디버깅용 계층이다.

초보자들 입장에서는 어떤 계층을 내가 사용할 수 있는지, 혹은 사용할지 매우 어려울 수 있다. 만약 궁금하다면 [`vkEnumerateInstanceLayerProperties`](https://registry.khronos.org/vulkan/specs/1.3/html/vkspec.html#vkEnumerateInstanceLayerProperties) 함수를 통해 직접 어떤 계층들을 사용할 수 있는지를 확인해볼 수 있다:


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

**`enabledExtensionCount`**는 활성화할 확장이 몇 개인지라는 뜻인데, 확장이라는 건 현재 공식 스펙에는 없지만, 추가적으로 기능이 필요할 때 사용할 수 있는 것이다. 즉, Vulkan 내부적으로 뭔가 추가적인 함수나 클래스 같은 게 필요하고, 해당 기능을 갖는 확장이 존재한다면, 그걸 instance를 생성할 때 넣어주면 사용이 가능하다는 것이다.

확장도 마찬가지로 현재 어떤 확장을 쓸 수 있고 없는지를 판단해야 한다. 확장은 크게 instance용 확장과 장치용 확장으로 나뉜다. 간단히 말하자면 instance용 확장은 `VkInstance`에 대한 확장이라는 뜻이고, 장치용 확장은 `VkDevice`에 대한 확장이라는 뜻이다. 여기서 장치라는 것은 GPU 장치를 의미한다. 만약 우리가 현재 instance 혹은 Vulkan을 사용할 장치에서 사용 가능한 확장이 무엇이 있을지 확인하고 싶다면, 계층에서 해줬던 것과 비슷하게 [`vkEnumerateInstanceExtensionProperties`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkEnumerateInstanceExtensionProperties) 혹은 [`vkEnumerateDeviceExtensionProperties`](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkEnumerateDeviceExtensionProperties) 함수를 통해 알아보면 된다.

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
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_external_fence_capabilities
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_external_memory_capabilities
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_external_semaphore_capabilities
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_get_display_properties2
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_get_physical_device_properties2
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_get_surface_capabilities2
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_surface
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_surface_protected_capabilities
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_KHR_win32_surface
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_EXT_debug_report
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_EXT_debug_utils
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_EXT_swapchain_colorspace
// Prometheus\Engine\Rendering\RendererVulkan.cpp/createInstance line: 243 :	extension name: VK_NV_external_memory_capabilities

// device/properties
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 302 : Device[0] NVIDIA GeForce GTX 1050 Ti
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [0] VK_KHR_16bit_storage
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [1] VK_KHR_8bit_storage
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [2] VK_KHR_bind_memory2
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [3] VK_KHR_buffer_device_address
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [4] VK_KHR_copy_commands2
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [5] VK_KHR_create_renderpass2
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [6] VK_KHR_dedicated_allocation
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [7] VK_KHR_depth_stencil_resolve
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [8] VK_KHR_descriptor_update_template
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [9] VK_KHR_device_group
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [10] VK_KHR_draw_indirect_count
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [11] VK_KHR_driver_properties
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [12] VK_KHR_external_fence
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [13] VK_KHR_external_fence_win32
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [14] VK_KHR_external_memory
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [15] VK_KHR_external_memory_win32
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [16] VK_KHR_external_semaphore
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [17] VK_KHR_external_semaphore_win32
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [18] VK_KHR_get_memory_requirements2
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [19] VK_KHR_image_format_list
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [20] VK_KHR_imageless_framebuffer
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [21] VK_KHR_maintenance1
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [22] VK_KHR_maintenance2
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [23] VK_KHR_maintenance3
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [24] VK_KHR_multiview
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [25] VK_KHR_pipeline_executable_properties
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [26] VK_KHR_push_descriptor
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [27] VK_KHR_relaxed_block_layout
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [28] VK_KHR_sampler_mirror_clamp_to_edge
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [29] VK_KHR_sampler_ycbcr_conversion
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [30] VK_KHR_separate_depth_stencil_layouts
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [31] VK_KHR_shader_atomic_int64
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [32] VK_KHR_shader_clock
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [33] VK_KHR_shader_draw_parameters
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [34] VK_KHR_shader_float16_int8
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [35] VK_KHR_shader_float_controls
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [36] VK_KHR_shader_non_semantic_info
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [37] VK_KHR_shader_subgroup_extended_types
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [38] VK_KHR_shader_terminate_invocation
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [39] VK_KHR_spirv_1_4
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [40] VK_KHR_storage_buffer_storage_class
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [41] VK_KHR_swapchain
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [42] VK_KHR_swapchain_mutable_format
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [43] VK_KHR_synchronization2
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [44] VK_KHR_timeline_semaphore
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [45] VK_KHR_uniform_buffer_standard_layout
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [46] VK_KHR_variable_pointers
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [47] VK_KHR_vulkan_memory_model
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [48] VK_KHR_win32_keyed_mutex
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [49] VK_KHR_workgroup_memory_explicit_layout
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [50] VK_KHR_zero_initialize_workgroup_memory
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [51] VK_EXT_4444_formats
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [52] VK_EXT_blend_operation_advanced
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [53] VK_EXT_buffer_device_address
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [54] VK_EXT_calibrated_timestamps
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [55] VK_EXT_color_write_enable
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [56] VK_EXT_conditional_rendering
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [57] VK_EXT_conservative_rasterization
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [58] VK_EXT_custom_border_color
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [59] VK_EXT_depth_clip_enable
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [60] VK_EXT_depth_range_unrestricted
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [61] VK_EXT_descriptor_indexing
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [62] VK_EXT_discard_rectangles
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [63] VK_EXT_extended_dynamic_state
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [64] VK_EXT_extended_dynamic_state2
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [65] VK_EXT_external_memory_host
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [66] VK_EXT_fragment_shader_interlock
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [67] VK_EXT_full_screen_exclusive
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [68] VK_EXT_hdr_metadata
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [69] VK_EXT_host_query_reset
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [70] VK_EXT_image_robustness
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [71] VK_EXT_index_type_uint8
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [72] VK_EXT_inline_uniform_block
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [73] VK_EXT_line_rasterization
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [74] VK_EXT_memory_budget
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [75] VK_EXT_memory_priority
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [76] VK_EXT_pci_bus_info
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [77] VK_EXT_pipeline_creation_cache_control
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [78] VK_EXT_pipeline_creation_feedback
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [79] VK_EXT_post_depth_coverage
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [80] VK_EXT_private_data
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [81] VK_EXT_provoking_vertex
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [82] VK_EXT_queue_family_foreign
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [83] VK_EXT_robustness2
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [84] VK_EXT_sample_locations
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [85] VK_EXT_sampler_filter_minmax
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [86] VK_EXT_scalar_block_layout
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [87] VK_EXT_separate_stencil_usage
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [88] VK_EXT_shader_atomic_float
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [89] VK_EXT_shader_demote_to_helper_invocation
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [90] VK_EXT_shader_image_atomic_int64
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [91] VK_EXT_shader_subgroup_ballot
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [92] VK_EXT_shader_subgroup_vote
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [93] VK_EXT_shader_viewport_index_layer
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [94] VK_EXT_subgroup_size_control
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [95] VK_EXT_texel_buffer_alignment
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [96] VK_EXT_tooling_info
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [97] VK_EXT_transform_feedback
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [98] VK_EXT_vertex_attribute_divisor
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [99] VK_EXT_vertex_input_dynamic_state
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [100] VK_EXT_ycbcr_image_arrays
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [101] VK_NV_acquire_winrt_display
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [102] VK_NV_clip_space_w_scaling
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [103] VK_NV_coverage_reduction_mode
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [104] VK_NV_dedicated_allocation
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [105] VK_NV_dedicated_allocation_image_aliasing
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [106] VK_NV_device_diagnostic_checkpoints
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [107] VK_NV_device_diagnostics_config
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [108] VK_NV_device_generated_commands
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [109] VK_NV_external_memory
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [110] VK_NV_external_memory_win32
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [111] VK_NV_fill_rectangle
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [112] VK_NV_fragment_coverage_to_color
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [113] VK_NV_framebuffer_mixed_samples
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [114] VK_NV_geometry_shader_passthrough
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [115] VK_NV_inherited_viewport_scissor
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [116] VK_NV_sample_mask_override_coverage
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [117] VK_NV_shader_sm_builtins
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [118] VK_NV_shader_subgroup_partitioned
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [119] VK_NV_viewport_array2
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [120] VK_NV_viewport_swizzle
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [121] VK_NV_win32_keyed_mutex
// Prometheus\Engine\Rendering\RendererVulkan.cpp / selectPhysicalDevice line : 310 : [122] VK_NVX_multiview_per_view_attributes
```

**ppEnabledExtensionNames**는 그래서 어떤 확장을 실제로 사용할 것인지를 정해주는 문자열의 배열이다. 위의 예시에서처럼 사용할 확장의 이름을 넣어주어 활성화해주는 것이다.

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

이름을 봐서 알겠지만 결국 콜백이라는 것은 콜백 함수가 필요하다. 일단 여기까지 왔으니 한 번 해보도록 하자. 여긴 엄청 중요하진 않으니 간단하게 설명하고 넘어가도록 하자.

* [vkCreateDebugReportCallbackEXT](https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#vkCreateDebugReportCallbackEXT)
* 

```cpp
// Provided by VK_EXT_debug_report
VkResult vkCreateDebugReportCallbackEXT(
    VkInstance                                  instance,
    const VkDebugReportCallbackCreateInfoEXT*   pCreateInfo,
    const VkAllocationCallbacks*                pAllocator,
    VkDebugReportCallbackEXT*                   pCallback
    );

VkResult vr = VK_SUCCESS;
VkInstance instance;
...
VkDebugReportCallbackCreateInfoEXT debugReportCallbackCreateInfo =
{
    .sType = VK_STRUCTURE_TYPE_DEBUG_REPORT_CALLBACK_CREATE_INFO_EXT,
    .pNext = nullptr,
    .flags 
    .pfnCallback
    .pUserData = nullptr
};
vr = vkCreateDebugReportCallbackEXT(instance, );
```