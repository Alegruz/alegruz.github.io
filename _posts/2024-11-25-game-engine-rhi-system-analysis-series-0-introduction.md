---
layout: post
title:  "Game Engine RHI System Analysis Series 0: Introduction"
date:   2024-11-25 00:00:00 +0000
categories: graphics english
---

- [Game Engine RHI System Analysis Series 0: Introduction (2024.11.25)](#game-engine-rhi-system-analysis-series-0-introduction-20241125)
- [Overview](#overview)

# Overview

This is a series of analysis on different game engines with publicly available source codes like Godot, Unreal. The goal of this series is to analyze and survey how different game engines are using the Graphics API. The analysis will give an insight to the readers on how to structure their renderes / RHI system for a specific API, or for cross-platform.

The following list is the game engines / renderers that this analysis will be discussing:

* Anki 3D Engine [Blog](https://anki3d.org/) [GitHub](https://github.com/godlikepanos/anki-3d-engine)
* **BGFX [Docs](https://bkaradzic.github.io/bgfx/overview.html) [GitHub](https://github.com/bkaradzic/bgfx)**
* **AMD Capsaicin Framework [Page](https://gpuopen.com/capsaicin/) [GitHub](https://github.com/GPUOpen-LibrariesAndSDKs/Capsaicin)**
* **Diligent Engine [Blog](https://diligentgraphics.com/diligent-engine/) [GitHub](https://github.com/DiligentGraphics/DiligentEngine)**
* DirectX-Graphics-Samples [GitHub](https://github.com/microsoft/DirectX-Graphics-Samples)
* **Falcor [Page](https://developer.nvidia.com/falcor) [GitHub](https://github.com/NVIDIAGameWorks/Falcor)**
* **Filament [Page](https://google.github.io/filament/) [GitHub](https://github.com/google/filament)**
* Flax Engine [Page](https://flaxengine.com/) [GitHub](https://github.com/FlaxEngine/FlaxEngine)
* **Godot Engine [Page](https://godotengine.org/) [GitHub](https://github.com/godotengine/godot)**
* Granite [Blog](https://themaister.net/blog/) [GitHub](https://github.com/Themaister/Granite)
* **IGL [GitHub](https://github.com/facebook/igl)**
* LLGL [GitHub](https://github.com/LukasBanana/LLGL)
* **Native SDK [Page](https://docs.imgtec.com/sdk-documentation/html/introduction.html) [GitHub](https://github.com/powervr-graphics/Native_SDK)**
* **O3DE [Page](https://o3de.org/) [GitHub](https://github.com/o3de/o3de)**
* **OGRE-Next [Page](https://ogrecave.github.io/ogre-next/api/latest/) [GitHub](https://github.com/OGRECave/ogre-next)**
* Spartan Engine [Blog](https://panoskarabelas.com/) [GitHub](https://github.com/PanosK92/SpartanEngine)
* **The Forge [Page](https://theforge.dev/) [GitHub](https://github.com/ConfettiFX/The-Forge)**
* Torque [Page](https://torque3d.org/) [GitHub](https://github.com/TorqueGameEngines/Torque3D)
* **Unreal Engine [Page](https://www.unrealengine.com/en-US) [GitHub](https://github.com/EpicGames/UnrealEngine)**
* Wicked Engine [Page](https://wickedengine.net/) [GitHub](https://github.com/turanszkij/WickedEngine)

Based on these engines, I will be analysing their RHI systems, rendering systems, and etc.