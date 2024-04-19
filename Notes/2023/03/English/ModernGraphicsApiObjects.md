# Modern Graphics API Objects (30 MAR 2023)
[Home](/)

# Direct3D 12

## Instance: `IDXGIFactory`

```cpp
ComPtr<IDXGIFactory4> pFactory;
ThrowIfFailed(CreateDXGIFactory1(IID_PPV_ARGS(pFactory.ReleaseAndGetAddressOf())));
```

## Physical Device: `IDXGIAdapter`

`IDXGIFactory` enumerates `IDXGIAdapter`

```cpp
UINT uAdapterIdx;
DXGI_GPU_PREFERENCE activeGpuPreference = DXGI_GPU_PREFERENCE_HIGH_PERFORMANCE;
ComPtr<IDXGIAdapter1> pAdapter1;
...
m_pFactory->EnumAdapterByGpuPreference(uAdapterIdx
                                        , activeGpuPreference
                                        , IID_PPV_ARGS(pAdapter1.ReleaseAndGetAddressOf()));
```

## Device: `ID3D12Device`

`IDXGIAdapter` creates `ID3D12Device`

```cpp
ComPtr<ID3D12Device> pDevice;
ThrowIfFailed(D3D12CreateDevice(pAdapter1.Get(), D3D_FEATURE_LEVEL_11_0, IID_PPV_ARGS(pDevice.ReleaseAndGetAddressOf())));
```

## Queue: `ID3D12CommandQueue`

`ID3D12Device` creates `ID3D12CommandQueue`

```cpp
D3D12_COMMAND_QUEUE_DESC queueDesc;
ComPtr<ID3D12CommandQueue> pCommandQueue;
...
ThrowIfFailed(pDevice->CreateCommandQueue(&queueDesc, IID_PPV_ARGS(pCommandQueue.ReleaseAndGetAddressOf())));
```

## Swap Chain: `IDXGISwapChain`

`IDXGIFactory` creates `IDXGISwapChain`

```cpp
DXGI_SWAP_CHAIN_DESC swapChainDesc;
ComPtr<IDXGISwapChain> pSwapChain;
...
ThrowIfFailed(pFactory->CreateSwapChain(pCommandQueue.Get()        // Swap chain needs the queue so that it can force a flush on it.
                                        , &swapChainDesc
                                        , &pSwapChain));
```

## Command Pool: `ID3D12CommandAllocator`

`ID3D12Device` creates `ID3D12CommandAllocator`

```cpp
ComPtr<ID3D12CommandAllocator> pCommandAllocator;
ThrowIfFailed(pDevice->CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT, IID_PPV_ARGS(&pCommandAllocator)));
```

# Vulkan

## Instance: `VkInstance`

1 per system.

```cpp
VkInstanceCreateInfo createInfo;
VkAllocationCallbacks* pCallback;
VkInstance instance;
...
vkCreateInstance(&createInfo, pCallback, &instance);
```

## Physical Device: `VkPhysicalDevice`

`VkInstance` enumerates `VkPhysicalDevice`

N per instance.

```cpp
uint32_t uNumPhysicalDevices = 0;
std::vector<VkPhysicalDevice> vPhysicalDevices;
vkEnumeratePhysicalDevices(instance, &uNumPhysicalDevices, nullptr);
vPhysicalDevices.resize(uNumPhysicalDevices);
vkEnumeratePhysicalDevices(instance, &uNumPhysicalDevices, vPhysicalDevices.data());
```

## Device: `VkDevice`

`VkDevice` is created from either a single `VkPhysicalDevice`, or from multiple `VkPhysicalDevice`s that shares a physical device group.

1 per physical device. (logically)

```cpp
VkPhysicalDevice physicalDevice;
VkDeviceCreateInfo createInfo;
VkAllocationCallbacks* pCallbacks;
VkDevice device;
...
vkCreateDevice(physicalDevice, &createInfo, pCallbacks, &device);
```

## Queue: `VkQueue`

`VkDevice` creates `VkQueue`

What queues can be created is retrieved from `VkPhysicalDevice`

N per queue family. Queue family is N per physical device.

```cpp
uint32_t uQueueFamilyIdx;
uint32_t uQueueIdx;
VkQueue queue;
...
vkGetDeviceQueue(device, uQueueFamilyIdx, uQueueIdx, &queue);
```

## Command Pool: `VkCommandPool`

`VkDevice` creates `VkCommandPool`

```cpp
VkCommandPoolCreateInfo createInfo;
VkAllocationCallbacks* pAllocator;
VkCommandPool commandPool;
...
vkCreateCommandPoo(device, &createInfo, pAllocator, &commandPool);
```

## Command Buffer: `VkCommandBuffer`

`VkDevice` creates `VkCommandBuffer`

N per device.

```cpp
VkCommandBufferAllocateInfo allocateInfo;
std::vector<VkCommandBuffer> vCommandBuffers(uNumCommandBuffers);
...
vkAllocateCommandBuffers(device, &allocateInfo, vCommandBuffers.data());
```

## Fence: `VkFence`

`VkDevice` creates `VkFence`

```cpp
VkFenceCreateInfo createInfo;
VkAllocationCallbacks* pCallbacks;
VkFence fence;
...
vkCreateFence(device, &createInfo, pCallbacks, &fence);
```

## Semaphore: `VkSemaphore`

`VkDevice` creates `VkSemaphore`

```cpp
VkSemaphoreCreateInfo createInfo;
VkAllocationCallbacks* pCallbacks;
VkSemaphore semaphore;
...
vkCreateSemaphore(device, &createInfo, pCallbacks, &semaphore);
```

## Surface: `VkSurfaceKHR`

`VkInstance` creates `VkSurfaceKHR`

N per instance.

```cpp
VkWin32SurfaceCreateInfoKHR createInfo;
VkAllocationCallbacks* pCallbacks;
VkSurfaceKHR surface;
...
vkCreateWin32SurfaceKHR(instance, &createInfo, pCallbacks, &surface);
```

## Swap Chain: `VkSwapChainKHR`

`VkDevice` creates `VkSwapChainKHR`

N per device.

```cpp
VkSwapchainCreateInfoKHR createInfo;
VkAllocationCallbacks* pCallbacks;
VkSwapchainKHR swapChain;
...
vkCreateSwapChainKHR(device, &createInfo, pCallbacks, &swapChain);
```