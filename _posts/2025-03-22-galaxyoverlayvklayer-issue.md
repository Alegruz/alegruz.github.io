---
layout: post
title:  Why Vulkan Warns about GalaxyOverlayVkLayer when Creating an Instance with Zero Layer Enabled?
date:   2025-03-22 13:02:00 +0900
categories: graphics
lang: "en"
---

## Issue

When creating a Vulkan instance with zero enable layers, Vulkan loader warns about GalaxyOverlayVkLayer's name not conforming to naming standard (Policy #LLP_LAYER_3).

## Reason

Implicit layers are loaded by the Vulkan loader without application intervention, based on system-wide configuration. On Windows, implicit layers are registered in the registry under `HKEY_LOCAL_MACHINE\SOFTWARE\Khronos\Vulkan\ImplicitLayers`, where the loader reads manifest files to identify and load them. The loader searches for these files in default directories or paths specified by environment variables like `VK_LAYER_PATH`. Each manifest file contains metadata, including the layer name, type (`GLOBAL` or `INSTANCE`), and whether it is implicit, along with optional enable and disable environment variables.

References:

* [GOG GALAXY Overlay](https://docs.gog.com/gc-overlay/)
* [Brief guide to Vulkan layers](https://renderdoc.org/vulkan-layer-guide.html)
* [Application Interface to Loader](https://github.com/KhronosGroup/Vulkan-Loader/blob/main/docs/LoaderApplicationInterface.md#implicit-vs-explicit-layers)

## Fix?

Added an environment variable to disable `GalaxyOverlayVkLayer`.

```cmake
add_custom_target(DisableVulkanLayers
    COMMAND VK_LOADER_LAYERS_DISABLE=GalaxyOverlayVkLayer* $<TARGET_FILE:MyApp>
    DEPENDS MyApp
)
```

But this is not enough. Vulkan will report the same warning.

## Reason

The Vulkan loader scans all layer manifest files (JSON files) from system directories and registry keys, like `HKEY_LOCAL_MACHINE\SOFTWARE\Khronos\Vulkan\ImplicitLayers`, and checks their names against the standard (e.g., `VK_LAYER_<author>_<name>`). Since "`GalaxyOverlayVkLayer`" doesn't conform, it issues a warning. The `VK_LOADER_LAYERS_DISABLE` environment variable disables the layer for use, but it doesn't stop the initial name check, so the warning persists.

The `VK_LOADER_LAYERS_DISABLE` environment variable is applied after the initial enumeration and name check.

References:

* [Debugging The Vulkan Desktop Loader](https://github.com/KhronosGroup/Vulkan-Loader/blob/main/docs/LoaderDebugging.md#disable-layers)

## Fix

You have to ultimately ignore the message in the debug callbacks.

```cpp
void FilterMessages(bool& bInoutBreak, bool& bInoutPrintMessage, const char* message)
{
    if (bInoutBreak == true || bInoutPrintMessage == true)
    {
        if (strstr(message, "#LLP_LAYER_3") != nullptr)
        {
            if (strstr(message, "GalaxyOverlayVkLayer") != nullptr)
            {
                bInoutPrintMessage = false;
                bInoutBreak = false;
            }
        }
    }
}
```