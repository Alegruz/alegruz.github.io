# Understanding Queues (2024.05.10)
[Home](/)

- [Understanding Queues (2024.05.10)](#understanding-queues-20240510)
- [Overview](#overview)
- [Reference](#reference)

# Overview

**A queue, or a device queue, is an abstraction mechanism that describes properties of command processing on devices.**<a href="#vk_essentials_1">[vk_essentials_1]</a> Before discussing further, we must define some of the terminologies. The hardware in the context of this topic is a GPU, which is the term “device” will refer to. A command is an instruction that the device can process. The equivalent in the Graphics API that describes these are shown in the following table:

|Term|Description|Direct3D 12|Vulkan|
|---|---|---|---|
|Physical Device|GPU|`IDXGIAdapter`|`VkPhysicalDevice`|
|Device|Logical connection to physical device which allows access to the Graphics API.|`ID3D12Device`|`VkDevice`|
|Command|Command buffer to be processed by the physical device.|`ID3D12GraphicsCommandList`|`VkCommandBuffer`|

An application submits commands to a queue. The submitted commands start in order but can proceed independently after that and complete out of order. How a queue is mapped to the underlying hardware is implementation-defined. Some implementations will have multiple hardware queues and submitting work to multiple queue​s will proceed independently and concurrently. Some implementations will do scheduling at a kernel driver level before submitting work to the hardware. There is no current way for the Graphics API’s to expose the exact details how each a queue is mapped.<a href="#vk_guide_queues">[vk_guide_queues]</a>

A device exposes one or more queues which may process work asynchronously to one another. Queues each may have different functionalities which is mapped differently across the Graphics API:<a href="#vk_doc_fundamentals">[vk_doc_fundamentals]</a>

Direct3D categorizes queues by their types: direct, compute, and copy. In general, direct queues accept any kind of command, compute queues accept compute and copy commands, and copy queues accept only copy commands.<a href="#msdn_command_lists">[msdn_command_lists]</a> Simply put, Direct3D categorizes queues by combining the types of command buffers, or command lists in Direct3D’s nomenclature. Command lists has following types: direct, bundle, compute, copy, video decode, video process, and video encode.<a href="#msdn_command_list_type">[msdn_command_list_type]</a> Direct command list is a general type which is a command list that GPU can execute. Vulkan is similar to Direct3D but rather than using predefined types lik direct, compute, and copy, Vulkan uses combinations of bits. Just like Direct3D’s command list types, Vulkan’s queue types consists graphics, compute, video decode, video encode, protected memory management, sparse memory management, and transfer.<a href="#vk_doc_fundamentals">[vk_doc_fundamentals]</a>

# Reference

<ol>
    <li id="vk_guide_queues">The Khronos Group. 2022. Vulkan-guide/chapters/queues.adoc at main · KhronosGroup/Vulkan-Guide. GitHub. <a href="https://github.com/KhronosGroup/Vulkan-Guide/blob/main/chapters/queues.adoc#queues">https://github.com/KhronosGroup/Vulkan-Guide/blob/main/chapters/queues.adoc#queues</a>.</li>
    <li id="msdn_command_lists">Stevewhims, v-alje, Demonese, DCtheGeek, mijacobs, and msatranjr. 2021. Executing and synchronizing command lists - win32 apps. Win32 apps | Microsoft Learn. <a href="https://learn.microsoft.com/en-us/windows/win32/direct3d12/executing-and-synchronizing-command-lists#initializing-a-command-queue">https://learn.microsoft.com/en-us/windows/win32/direct3d12/executing-and-synchronizing-command-lists#initializing-a-command-queue</a>. </li>
    <li id="msdn_command_list_type">Stevewhims. 2024. D3D12_COMMAND_LIST_TYPE (d3d12.h) - win32 apps. D3D12_COMMAND_LIST_TYPE (d3d12.h) - Win32 apps | Microsoft Learn. <a href="https://learn.microsoft.com/en-us/windows/win32/api/d3d12/ne-d3d12-d3d12_command_list_type">https://learn.microsoft.com/en-us/windows/win32/api/d3d12/ne-d3d12-d3d12_command_list_type</a>.</li>
    <li id="vk_essentials_1">Unterguggenberger, J. 2021. Vulkan Essentials: “first steps as Vulkan developer”: Vulkan Lecture series, episode 1: ECG 2021. YouTube. <a href="https://youtu.be/tLwbj9qys18?si=KBkXpb0UY6wYnR_f">https://youtu.be/tLwbj9qys18?si=KBkXpb0UY6wYnR_f</a>.</li>
    <li id="vk_doc_fundamentals">Vulkan Documentation. 2024. Fundamentals. Fundamentals :: Vulkan Documentation Project. <a href="https://docs.vulkan.org/spec/latest/chapters/fundamentals.html#fundamentals-execmodel">https://docs.vulkan.org/spec/latest/chapters/fundamentals.html#fundamentals-execmodel</a>.</li>
</ol>