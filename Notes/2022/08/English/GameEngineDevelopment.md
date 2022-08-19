# Game Engine Development (2022.08.16)
[Home](/README.md)

# Focus

1. Renderer
2. Core System
3. Resources
4. Collsions & Physics
5. Profiling & Debugging
6. Audio
7. Animation
8. AI

# Engine Structure Definition

* Hardware: PC
* OS: Windows 10+
* 3rd Party SDKs
  * DirectX

# Resources

* **Game Coding Complete, 4th Ed. Chapter 10: 3D Engine. 2012**.
* Cross-Platform Game Programming. Chapter 2: Top Ten Tips. Resource Creation Path. 2005.

## Hardware

* Cross-Platform Game Programming. Chapter 4: The CPU. 2005.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 17: Using Graphics Hardware. 2021**.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 38: Modern Graphics Hardware. 2013.
* **Real-Time Rendering, 4th Ed. Chapter 23: Graphics Hardware. 2018**

## OS

Windows 10

* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 2: The Windows Programming Model. 2003.
* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 3: Advanced Windows Programming. 2003.
* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 4: Windows GDI, Controls, and Last-Minute Gift Ideas. 2003.
* **Game Coding Complete, 4th Ed. Chapter 11: Special Considerations for Developing Windows Games. 2012**.
* Game Programming Gems 2. Chapter 1.12: Linear Programming Model for Windows-based Games. 2001.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 10: Project Setup and Window Initialization. 2014.
* Introduction to 3D Game Programming with DirectX 12. Appendix A: Introduction to Windows Programming. 2016.
* Tricks of the 3D Game Programming Gurus. Chapter 2: A Crash Course in Windows and DirectX. 2003.

## 3rd Party SDKs

* Game Engine Gems 1. Chapter 1: What to Look for When Evaluating Middleware for Integration. 2010.

### DirectX

DirectX 12
* Introduction to 3D Game Programming with DirectX 12. Chapter 4: Direct3D Initialization. 2016.

DirectX 11
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 1: Introducting DirectX. 2014.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 11: Direct3D Initialization. 2014.
* Practical Rendering and Computation with Direct3D 11. 2011.

DirectX 9
* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 5: DirectX Fundamentals and the Dreaded COM. 2003.
* Tricks of the 3D Game Programming Gurus. Chapter 2: A Crash Course in Windows and DirectX. 2003.

## Platform Independence Layer

### Platform Detection

### Primitive Data Types

* Game Programming Gems 3. Chapter 1.9: Floating-Point Exception Handling. 2002.

### Collections and Iterators

* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 11: Algorithms, Data Structures, Memory Management, and Multithreading. 2003.
* Game Programming Golden Rules. Chapter 2: Orders of Complexity. 2004.
* Game Programming Golden Rules. Chapter 3: Hashes and Hash Functions. 2004.
* Game Programming Gems 1. Chapter 1.10: Simple, Fast Bit Arrays. 2000.
* Game Programming Gems 4. Chapter 1.6: A Generic Tree Container in C++. 2004.
* Game Programming Gems 4. Chapter 1.9: Address-Space Managed Dynamic Arrays for Windows and the Xbox. 2004.
* Game Programming Gems 5. Chapter 1.14: An Effective Cache-Oblivious Implementations of the ABT Tree. 2005.
* Game Programming Gems 6. Chapter 1.1: Lock-Free Algorithms. 2006.
* **Game Engine Architecture, 3rd Ed. Chapter 6: Engine Support Systems. 2018**.
* 3D Game Engine Architecture. Chapter 2.1: The Low-Level System. 2004.
* Game Engine Gems 1. Chapter 24: Key-Value Dictionary. 2010.
* Game Engine Gems 2. Chapter 28: A Cache-Aware Hybrid Sorter. 2011.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 12: Data Structure for Graphics. 2021**.

### File System

* Cross-Platform Game Programming. Chapter 5: Storage. 2005.
* **Game Engine Architecture, 3rd Ed. Chapter 7: Resources and the File System. 2018**.
* 3D Game Engine Architecture. Chapter 2.1: The Low-Level System. 2004.

### Networking

### Hi-Res Timer

* Game Programming Gems 4. Chapter 1.3: The Clock: Keeping Your Finger on the Pulse of the Game. 2004.
* **Game Engine Architecture, 3rd Ed. Chapter 8: The Game Loop and Real-Time Simulation. 2018**.
* 3D Game Engine Architecture. Chapter 2.1: The Low-Level System. 2004.

### Threading Library

* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 11: Algorithms, Data Structures, Memory Management, and Multithreading. 2003.
* Game Programming Gems 6. Chapter 1.2: Utilizing Multicore Processors with OpenMP. 2006.
* Game Programming Gems 7. Chapter 1.4: Design and Implementation of a Multi-Platform Threading Engine. 2008.
* Game Programming Gems 7. Chapter 1.9: Multithread Job and Dependency System. 2008.
* Game Programming Gems 8. Chapter 4.3: Efficient and Scalable Multi-Core Programming. 2010.
* Game Programming Gems 8. Chapter 4.13: Creating a Multi-Threaded Actor-Based Architecture Using Intel® Threading Building Blocks. 2010.
* **Game Engine Architecture, 3rd Ed. Chapter 4: Parallelism and Concurrent Programming. 2018**.
* Game Engine Gems 1. Chapter 22: Holistic Task Parallelism for Common Game Architecture Patterns. 2010.
* Game Engine Gems 2. Chapter 29: Thread Communication Techniques. 2011.
* Game Engine Gems 2. Chapter 30: A Cross-Platform Multithreading Framework. 2011.
* Game Engine Gems 2. Chapter 31: Producer-Consumer Queues. 2011.

## Core Systems

### Module Start-Up and Shut-Down

* **Game Coding Complete, 4th Ed. Chapter 7: Initialization and the Main Loop. 2012**.
* **Game Engine Architecture, 3rd Ed. Chapter 6: Engine Support Systems. 2018**.
* 3D Game Engine Design, 2nd Ed. Chapter 14: Object-Oriented Infrastructure. 2007.

### Assertions

* Game Programming Gems 1. Chapter 1.12: Squeezing More Out of Assert. 2000.

### Unit Testing

* Game Programming Gems 6. Chapter 1.7: Using CppUnit To Implement Unit Testing. 2006.

### Memory Allocation

* Cross-Platform Game Programming. Chapter 3: Memory. 2005.
* Game Programming Gems 1. Chapter 1.7: Resource and Memory Management. 2000.
* Game Programming Gems 1. Chapter 1.9: Frame-Based Memory Allocation. 2000.
* Game Programming Gems 2. Chapter 1.10: A Drop-in Debug Memory Manager. 2001.
* Game Programming Gems 3. Chapter 1.6: Custom STL Allocators. 2002.
* Game Programming Gems 4. Chapter 1.5: Fight Memory Fragmentation with Templated Freelists. 2004.
* Game Programming Gems 5. Chapter 1.7: Generic Pager. 2005.
* Game Programming Gems 5. Chapter 1.11: Improving Freelists with Policy Based Design. 2005.
* Game Programming Gems 7. Chapter 1.2: High Performance Heap Allocator. 2008.
* Game Programming Gems 8. Chapter 4.4: Game Optimization through the Lens of Memory and Data Access. 2010.
* Game Programming Gems 8. Chapter 4.5: Stack Allocation. 2010.
* **Game Engine Architecture, 3rd Ed. Chapter 6: Engine Support Systems. 2018**.
* 3D Game Engine Architecture. Chapter 2.1: The Low-Level System. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 7: Memory Management. 2007.
* Game Engine Gems 1. Chapter 11: A GPU-Managed Memory Pool. 2010.
* Game Engine Gems 2. Chapter 26: A Highly Optimized Portable Memory Manager. 2011.
* Game Engine Gems 2. Chapter 27: Simple Remote Heaps. 2011.
* The Garbage Collection Handbook. 2016.

### Math Library

* **Game Programming Algorithms and Techniques. Chapter 3: Linear Algebra for Games. 2013**.
* Game Programming Gems 1. Chapter 1.2: Fast Math Using Template Metaprogramming. 2000.
* Game Programming Gems 1. Chapter 2: Mathematics. 2000.
* Game Programming Gems 2. Chapter 2: Mathematics. 2001.
* Game Programming Gems 3. Chapter 2: Mathematics. 2002.
* Game Programming Gems 4. Chapter 1.10: Critically Damped Ease-In/Ease-Out Smoothing. 2004.
* Game Programming Gems 4. Chapter 2: Mathematics. 2004.
* Game Programming Gems 5. Chapter 2: Mathematics. 2005.
* Game Programming Gems 6. Chapter 2: Mathematics and Physics. 2006.
* Game Programming Gems 7. Chapter 2: Mathematics and Physics. 2008.
* **Game Engine Architecture, 3rd Ed. Chapter 5: 3D Math for Games. 2018**.
* 3D Game Engine Architecture. Chapter 2.2: The Mathematics System. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 2.1: The Foundation. 2007.
* 3D Game Engine Design, 2nd Ed. Chapter 2.2: Transformations. 2007.
* 3D Game Engine Design, 2nd Ed. Chapter 15: Mathematical Topics. 2007.
* Game Engine Gems 1. Chapter 27: Fast Trigonometric Operations Using Cordic Methods. 2010.
* Hacker's Delight. 2012.
* Vector Game Math Processors. 2002.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 2: A 3D/Math Primer. 2014.
* Introduction to 3D Game Programming with DirectX 12. Part 1: Mathematical Prerequisites. 2016.
* Introduction to 3D Game Programming with DirectX 12. Chapter 22: Quaternions. 2016.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 2: Miscellaneous Math. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 6: Linear Algebra. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 7: Transformation Matrices. 2021**.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 7: Essential Mathematics and the Geometry of 2-Space and 3-Space. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 8: A Simple Way to Describe Shape in 2D and 3D. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 10: Transformations in Two Dimensions. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 11: Transformations in Three Dimensions. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 12: A 2D and 3D Transformation Library for Graphics. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 14: Standard Approximations and Representations. 2013.
* Tricks of the 3D Game Programming Gurus. Chapter 3: 3D Game Programming with a Virtual Computer. 2003.
* Tricks of the 3D Game Programming Gurus. Chapter 4: It's a Math, Math, Math World-Trigonometry, Vectors, Matrices, and Quaternions. 2003.
* Tricks of the 3D Game Programming Gurus. Chapter 5: Building a Math Engine. 2003.
* **Real-Time Rendering, 4th Ed. Chapter 4: Transforms. 2018**.
* Graphics Programming Methods. Chapter 2.3: A Fast All-Integer Ellipse Discretization Algorithm. 2003.
* Graphics Programming Methods. Chapter 2.4: A Fast and Simple All-Integer Parametric Line. 2003.
* GPU Pro 1. Part 1: Mathematics. 2010.
* Graphics Gems. Part 8: Numerical and Programming Techniques. 1990.
* Graphics Gems. Part 9: Matrix Techniques. 1990.
* Graphics Gems. Part 10: Modeling and Transformations. 1990.
* Graphics Gems II. Part VII: Matrix Techniques. 1991.
* Graphics Gems II. Part VIII: Numerical and Programming Techniques. 1991.
* Graphics Gems III. Part II: Numerical and Programming Techniques. 1994.
* Graphics Gems III. Part III: Modeling and Transformations. 1994.
* Graphics Gems IV. Part III: Transformations. 1994.
* Graphics Gems V. Part I: Algebra and Arithmetic. 1995.
* Graphics Gems V. Part III: Modeling and Transformations. 1995.

### Strings and Hashed String Ids

* Game Programming Gems 6. Chapter 1.6: Closest-String Matching Algorithm. 2006.
* **Game Engine Architecture, 3rd Ed. Chapter 6: Engine Support Systems. 2018**.
* Game Engine Gems 3. Chapter 14: Compile-Time String Hashing in C++. 2016.

### Debug Printing and Logging

* Game Programming Gems 3. Chapter 1.15: Lightweight, Policy-Based Logging. 2002.
* Game Programming Gems 4. Chapter 1.2: An HTML-Based Logging and Debugging System. 2004.
* Game Programming Gems 5. Chapter 1.12: A Real-time Remote Debug Message Logger. 2005.
* Game Programming Gems 8. Chapter 4.7: A More Informative Error Log Generation. 2010.

### Localization Services

* Game Programming Gems 3. Chapter 1.21: Developing Games for a World Market. 2002.

### Movie Player

### Parsers (CSV, JSON, etc.)

* Game Programming Gems 2. Chapter 1.17: A Flexible Text Parsing System. 2001.
* Game Programming Gems 3. Chapter 1.11: Using Lex and Yacc To Parse Custom Data Files. 2002.
* Game Programming Gems 4. Chapter 1.13: Using XML without Sacrificing Speed. 2004.
* Game Programming Gems 5. Chapter 1.2: Parsing Text Data in Games. 2005.
* Game Development Tools. Chapter 12: Pragmatic XML Use in Tools. 2011.
* Game Development Tools. Chapter 20: YAML for C++: Applied Data-Driven Design. 2011.

### Profiling / Stats Gathering

* Game Programming Gems 1. Chapter 1.13: Stats: Real-Time Statistics and In-Game Debugging. 2000.

### Engine Config

* **Game Engine Architecture, 3rd Ed. Chapter 6: Engine Support Systems. 2018**.

### Random Number Generator

* Game Programming Gems 2. Chapter 1.19: Genuine Random Number Generation. 2001.

### Curves & Surfaces Library

* Game Programming Gems 3. Chapter 4.13: Curvature Simulation Using Normal Maps. 2002.
* 3D Game Engine Architecture. Chapter 4.3: Curves and Surfaces. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 15: Mathematical Topics. 2007.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 15: Curves. 2021**.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 22: Splines and Subdivision Curves. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 23: Splines and Subdivision Surfaces. 2013.
* **Real-Time Rendering, 4th Ed. Chapter 17: Curves and Curved Surfaces. 2018**.
* Graphics Gems. Part 11: Curves and Surfaces. 1990.
* Graphics Gems II. Part IX: Curves and Surfaces. 1991.
* Graphics Gems IV. Part IV: Curves and Surfaces. 1994.
* Graphics Gems V. Part IV: Curves and Surfaces. 1995.

### RTTI / Reflection & Serialization

* Game Programming Gems 2. Chapter 1.6: Dynamic Type Information. 2001.
* Game Programming Gems 4. Chapter 1.12: Using Custom RTTI Properties to Stream and Edit Objects. 2004.
* Game Programming Gems 5. Chapter 1.4: Using Templates for Reflection in C++. 2005.
* 3D Game Engine Architecture. Chapter 2.3: The Object System. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 14: Object-Oriented Infrastructure. 2007.
* Game Engine Gems 3. Chapter 15: Static Reflection in C++ Using Tuples. 2016.

### Object Handles / Unique Ids

* Game Programming Gems 3. Chapter 1.5: Handle-Based Smart Pointers. 2002.
* 3D Game Engine Architecture. Chapter 2.3: The Object System. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 14: Object-Oriented Infrastructure. 2007.

### Asynchronous File I/O

* Game Development Tools. Chapter 7: Robust File I/O. 2011.

## Resources (Game Assets)

* **Game Coding Complete, 4th Ed. Chapter 8: Loading and Caching Game Resources. 2012**.
* Game Programming Golden Rules. Chapter 5: The Resource Pipeline. 2004.
* Game Programming Golden Rules. Chapter 6: Processing Assets. 2004.
* Game Programming Golden Rules. Chapter 8: Saving Game State. 2004.
* Game Programming Gems 1. Chapter 1.7: Resource and Memory Management. 2000.
* Game Programming Gems 1. Chapter 1.8: Fast Data Load Trick. 2000.
* Game Programming Gems 2. Chapter 1.15: File Management Using Resource Files. 2001.
* Game Programming Gems 3. Chapter 1.7: Save Me Now!. 2002.
* Game Programming Gems 4. Chapter 5.13: Motion Capture Data Compression. 2004.
* Game Programming Gems 5. Chapter 1.13: A Transparent Class Saving and Loading Trick. 2005.
* Game Programming Gems 6. Chapter 1.9: Faster File Loading with Access-Based File Reordering. 2006.
* Game Programming Gems 6. Chapter 1.10: Stay in the Game: Asset Hotloading for Fast Iteration. 2006.
* Game Engine Gems 1. Chapter 2: Game Asset Pipeline. 2010.
* Game Engine Gems 2. Chapter 20: Pointer Patching Assets. 2011.
* Game Engine Gems 2. Chapter 21: Data-Driven Sound Pack Loading and Organization. 2011.
* Game Engine Gems 3. Chapter 1: The Open Game Engine Exchange Format. 2016.
* Game Development Tools. Chapter 3: Workflow Improvement via Automatic Asset Tracking. 2011.
* Game Development Tools. Chapter 5: Persistence Management of Asset Metadata and Tags. 2011.
* Game Development Tools. Chapter 9: A COLLADA Toolbox. 2011.
* Game Development Tools. Chapter 10: Shape-Preserving Terrain Decimation and Associated Tools. 2011.
* ShaderX3. Chapter 6.1: An Extensive Direct3D Resource Management System. 2004.

### Resource Manager

* Game Programming Gems 1. Chapter 1.6: A Generic Handle-Based Resource Manager. 2000.
* **Game Engine Architecture, 3rd Ed. Chapter 7: Resources and the File System. 2018**.

### 3D Model Resource

* Game Programming Gems 2. Chapter 1.21: 3ds max Skin Exporter and Animation Toolkit. 2001.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 15: Models. 2014.

### Texture Resource

### Material Resource

* Real-Time 3D Rendering with DirectX and HLSL. Chapter 16: Materials. 2014.

### Font Resource

### Skeleton Resource

* Game Programming Gems 2. Chapter 1.21: 3ds max Skin Exporter and Animation Toolkit. 2001.

### Collision Resource

### Physics Parameters

### Game World/Map

* Game Engine Gems 1. Chapter 3: Volumetric Representation of Virtual Environments. 2010.

## Low-Level Renderer

* **Game Coding Complete, 4th Ed. Chapter 6: 2D Stuff Every Game Programmer Should Know. 2012**.
* **Game Coding Complete, 4th Ed. Chapter 9: 3D Graphics all Game Programmer Must Master. 2012**.
* **Game Programming Algorithms and Techniques. Chapter 2: 2D Graphics. 2013**.
* **Game Programming Algorithms and Techniques. Chapter 4: 3D Graphics. 2013**.
* Cross-Platform Game Programming. Chapter 9: The Graphics Engine. 2005.
* Game Programming Gems 3. Chapter 4.12: 3D Tricks for Isometric Engines. 2002.
* Game Programming Gems 8. Chapter 1.3: Multi-Resolution Deferred Shading. 2010.
* **Game Engine Architecture, 3rd Ed. Chapter 11: The Rendering Engine. 2018**.
* 3D Game Engine Architecture. Chapter 3.4: Render State. 2004.
* 3D Game Engine Architecture. Chapter 3.5: Renderers and Cameras. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 2.5: Rasterizing. 2007.
* 3D Game Engine Design, 2nd Ed. Chapter 3: Renderers. 2007.
* Game Engine Gems 1. Chapter 9: A Multithreaded 3D Renderer. 2010.
* Game Engine Gems 1. Chapter 10: Camera-Centric Engine Design for Multithreaded Rendering. 2010.
* Game Engine Gems 2. Chapter 7: A Spatial and Temporal Coherence Framework for Real-Time Graphics. 2011.
* Game Engine Gems 2. Chapter 14: 2D Magic. 2011.
* Game Engine Gems 2. Chapter 17: Placeholders beyond Static Art Replacement. 2011.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 22: Additional Topics in Modern Rendering. 2014.
* Introduction to 3D Game Programming with DirectX 12. Chapter 5: The Rendering Pipeline. 2016.
* Introduction to 3D Game Programming with DirectX 12. Chapter 6: Drawing in Direct3D. 2016.
* Introduction to 3D Game Programming with DirectX 12. Chapter 7: Drawing in Direct3D Part II. 2016.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 3: Raster Images. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 4: Ray Tracing. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 9: The Graphics Pipeline. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 10: Signal Processing. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 13: Sampling. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 18: Color. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 19: Visual Perception. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 20: Tone Reproduction. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 22: Computer Graphics in Games. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 23: Visualization. 2021**.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 5: An Introduction to Human Visual Perception. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 15: Ray Casing and Rasterization. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 28: Color. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 30: Probability and Monte Carlo Integration. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 31: Computing Solutions to the Rendering Equation: Theoretical Approaches. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 32: Rendering in Practice. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 33: Visibility Determination. 2013.
* Digital Image Processing, 4th Ed. Chapter 2: Digital Image Fundamentals. 2018.
* Principles of Digital Image Synthesis. Part I: The Human Visual System and Color. 1995.
* Principles of Digital Image Synthesis. Part II: Signal Processing. 1995.
* Principles of Digital Image Synthesis. Chapter 20: Rendering and Images. 1995.
* Tricks of the 3D Game Programming Gurus. Chapter 3: 3D Game Programming with a Virtual Computer. 2003.
* Tricks of the 3D Game Programming Gurus. Chapter 6: Introduction to 3D Graphics. 2003.
* Tricks of the 3D Game Programming Gurus. Chapter 7: Rendering Wireframe Worlds in 3D. 2003.
* Tricks of the 3D Game Programming Gurus. Part III: Basic 3D Rendering. 2003.
* **Real-Time Rendering, 4th Ed. Chapter 2: The Graphics Rendering Pipeline. 2018**.
* **Real-Time Rendering, 4th Ed. Chapter 3: The Graphics Processing Unit. 2018**.
* **Real-Time Rendering, 4th Ed. Chapter 18: Pipeline Optimization. 2018**.
* **Real-Time Rendering, 4th Ed. Chapter 20: Efficient Shading. 2018**
* ShaderX2. Section II: Rendering Techniques. 2003.
* ShaderX3. Section I: Introduction and Geometry Manipulation Tricks. 2004.
* ShaderX3. Section II: Rendering Techniques. 2004.
* ShaderX3. Chapter 6.3: Effect Parameters Manipulation Framework. 2004.
* ShaderX4. Section II: Rendering Techniques. 2006.
* ShaderX4. Chapter 5.1: Tips and Tricks for D3DX Effects Based Renderer. 2006.
* ShaderX5. Section II: Rendering Techniques. 2006.
* ShaderX6. Section II: Rendering Techniques. 2008.
* ShaderX7. Section II: Rendering Techniques. 2009.
* ShaderX7. Chapter 8.1: Cross-Platform Rendering Thread: Design and Implementation. 2009.
* ShaderX7. Chapter 9.4: Packing Arbitrary Bit Fields into 16-Bit Floating-Point Render Targets in DirectX 10. 2009.
* GPU Gems. Chapter 37: A Toolkit for Computation on GPUs. 2004.
* GPU Gems 3. Part III: Rendering. 2007.
* GPU Pro 1. Part III: Rendering Techniques. 2010.
* GPU Pro 2. Part II: Rendering. 2011.
* GPU Pro 3. Part II: Rendering. 2012.
* GPU Pro 4. Part II: Rendering. 2013.
* GPU Pro 5. Part I: Rendering. 2014.
* GPU Pro 6. Part II: Rendering. 2015.
* GPU Pro 7. Part III: Rendering. 2016.
* GPU Zen. Part III: Rendering. 2017.
* GPU Zen 2. Part I: Rendering. 2017.
* Graphics Gems. Part 2: 2D Rendering. 1990.
* Graphics Gems. Part 4: Frame Buffer Techniques. 1990.
* Graphics Gems. Part 6: 3D Rendering. 1990.
* Graphics Gems II. Part III: Frame Buffer Techniques. 1991.
* Graphics Gems III. Part VII: Rendering. 1994.
* Graphics Gems IV. Part VII: Frame Buffer Techniques. 1994.

### Graphics Device Interface

* 3D Game Engine Design, 2nd Ed. Chapter 2.7: Issues of Software, Hardware, and APIs. 2007.
* 3D Game Engine Design, 2nd Ed. Chapter 2.8: API Conventions. 2007.
* Game Engine Gems 2. Chapter 5: Delaying OpenGL Calls. 2011.
* Game Engine Gems 2. Chapter 6: A Framework for GLSL Engine Uniforms. 2011.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 16: Survey of Real-Time 3D Graphics Platforms. 2013.
* ShaderX6. Chapter 9.2: AMD DirectX® 10 Performance Tools and Techniques. 2008.

### Primitive Submission

* Game Programming Gems 1. Chapter 4: Polygonal Techniques. 2000.
* Game Programming Gems 2. Chapter 4: Geometry Management. 2001.
* Game Programming Gems 3. Chapter 4.1: T-Junction Elimination and Retriangulation. 2002.
* Game Programming Gems 3. Chapter 4.2: Fast Heightfield Normal Calculation. 2002.
* Game Programming Gems 3. Chapter 4.3: Fast Patch Normals. 2002.
* Game Programming Gems 3. Chapter 4.5: Triangle Strip Creation, Optimization, and Rendering. 2002.
* 3D Game Engine Architecture. Chapter 3.2: Geometric State. 2004.
* 3D Game Engine Architecture. Chapter 3.3: Geometric Types. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 2.6: Vertex Attributes. 2007.
* Game Engine Gems 1. Chapter 13: Mesh Partitioning for Fun and Profit. 2010.
* Game Engine Gems 3. Chapter 6: Buffer-Free Generation of Triangle Strip Cube Vertices. 2016.
* Game Development Tools. Chapter 8: Real-Time Constructive Solid Geometry. 2011.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 21: Implicit Modeling. 2021**.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 9: Functions on Meshes. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 24: Implicit Representations of Shape. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 25: Meshes. 2013.
* **Real-Time Rendering, 4th Ed. Chapter 16: Polygonal Techniques. 2018**.
* Graphics Programming Methods. Chapter 2.1: Automatic Parameterizations on the Cube. 2003.
* Graphics Programming Methods. Chapter 2.5: An Easy-to-Code Smoothing Algorithm for 3D Reconstructed Surfaces. 2003.
* Graphics Programming Methods. Chapter 2.6: Higher-Order Surfaces Using Curved Point-Normal (PN) Triangles. 2003.
* Graphics Programming Methods. Chapter 3.8: Fast Setup for Bilinear and Biquadratic Interpolation over Triangles. 2003.
* Graphics Programming Methods. Chapter 3.15: An Optimized Dynamic Surface Caching Algorithm. 2003.
* ShaderX2. Section I: Geometry Manipulation Tricks. 2003.
* ShaderX3. Section I: Introduction and Geometry Manipulation Tricks. 2004.
* ShaderX4. Section I: Geometry Manipulation. 2006.
* ShaderX4. Chapter 6.1: Real-time damage deformation methods. 2006.
* ShaderX5. Section I: Geometry Manipulation. 2006.
* ShaderX5. Chapter 9.7: Storing and Accessing Topology on the GPU: A Case Study on Mass-Spring Systems. 2006.
* ShaderX6. Section I: Geometry Manipulation. 2008.
* ShaderX7. Section I: Geometry Manipulation. 2009.
* GPU Gems 2. Part I: Geometry Complexity. 2005.
* GPU Gems 3. Part I: Geometry. 2007.
* GPU Pro 1. Part II: Geometry Manipulation. 2010.
* GPU Pro 2. Part I: Geometry Manipulation. 2011.
* GPU Pro 3. Part I: Geometry Manipulation. 2012.
* GPU Pro 4. Part I: Geometry Manipulation. 2013.
* GPU Pro 6. Part I: Geometry Manipulation. 2015.
* GPU Pro 7. Part I: Geometry Manipulation. 2016.
* GPU Zen. Part I: Geometry Manipulation. 2017.
* Graphics Gems. Part 1: 2D Geometry. 1990.
* Graphics Gems. Part 5: 3D Geometry. 1990.
* Graphics Gems II. Part I: 2D Geometry and Algorithms. 1991.
* Graphics Gems II. Part IV: 3D Geometry and Algorithms. 1991.
* Graphics Gems III. Part IV: 2D Geometry and Algorithms. 1994.
* Graphics Gems III. Part V: 3D Geometry and Algorithms. 1994.
* Graphics Gems IV. Part I: Polygons and Polyhedra. 1994.
* Graphics Gems IV. Part II: Geometry. 1994.
* Graphics Gems V. Part II: Computational Geometry. 1995.
* Texturing and Modeling. 2002.
* Polygon Mesh Processing. 2010.
* Isosurfaces. 2013.

### Viewports & Virtual Screens

### Texture and Surface Management

* Game Programming Gems 2. Chapter 5.8: Operations for Hardware-Accelerated Procedural Texture Animation. 2001.
* Game Programming Gems 3. Chapter 4.16: Procedural Texturing. 2002.
* Game Programming Gems 3. Chapter 4.17: Unique Textures. 2002.
* Game Programming Gems 7. Chapter 5.4: High-Performance Subdivision Surfaces. 2008.
* Game Engine Gems 3. Chapter 9: A Fast and High-Quality Texture Atlasing Algorithm. 2016.
* Game Development Tools. Chapter 16: Vector Displacement in the Sculpting Workflow. 2011.
* Game Development Tools. Chapter 18: Efficient Texture Creation with Genetica. 2011.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 5: Texture Mapping. 2014.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 9: Normal Mapping and Displacement Mapping. 2014.
* Introduction to 3D Game Programming with DirectX 12. Chapter 9: Texturing. 2016.
* Introduction to 3D Game Programming with DirectX 12. Chapter 19: Normal Mapping. 2016.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 11: Texture Mapping. 2021**.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 20: Textures and Texture Mapping. 2013.
* Tricks of the 3D Game Programming Gurus. Chapter 12: Advanced Texturing Techniques. 2003.
* **Real-Time Rendering, 4th Ed. Chapter 6: Texturing. 2018**.
* Graphics Programming Methods. Chapter 2.2: Filling Texture Holes Using the Euclidean Distance Map. 2003.
* ShaderX1. Part 4: Using 3D Textures with Shaders. 1996.
* ShaderX5. Chapter 9.3: Real-time Cellular Texturing. 2006.
* Texturing and Modeling. 2002.

### Materials & Shaders

* Game Programming Gems 2. Chapter 5.1: Cartoon Rendering: Real-time Silhouette Edge Detection and Rendering. 2001.
* Game Programming Gems 2. Chapter 5.2: Cartoon Rendering Using Texture Mapping and Programmable Vertex Shaders. 2001.
* Game Programming Gems 3. Chapter 4.10: A Programmable Vertex Shader Compiler. 2002.
* Game Programming Gems 3. Chapter 4.18: Textures as Lookup Tables for Per-Pixel Lighting Computations. 2002.
* Game Programming Gems 3. Chapter 4.19: Renering with Handcrafted Shading Models. 2002.
* Game Programming Gems 4. Chapter 5.7: Real-Time Halftoning: Fast and Simple Stylized Shading. 2004.
* Game Programming Gems 4. Chapter 5.8: Techniques to Apply Team Colors to 3D Models. 2004.
* Game Programming Gems 5. Chapter 5.10: Recombinant Shaders. 2005.
* Game Programming Gems 7. Chapter 5.3: An Alternative Model for Shading of Diffuse Light for Rough Materials. 2008.
* Game Programming Gems 8. Chapter 1.7: Overlapped Execution on Programmable Graphics Hardware. 2010.
* Game Programming Gems 8. Chapter 1.8: Techniques for Effective Vertex and Fragment Shading on the SPUs. 2010.
* Game Programming Gems 8. Chapter 7.1: Using Heterogeneous Parallel Architectures with OpenCL. 2010.
* Game Engine Gems 1. Chapter 16: Rendering Physically-Based Skyboxes. 2010.
* Game Engine Gems 2. Chapter 8: Implementing a Fast DDOF Solver. 2011.
* Game Engine Gems 3. Chapter 8: Variable Precision Pixel Shading for Improved Power Efficiency. 2016.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 4: Hello, Shaders!. 2014.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 16: Materials. 2014.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 21: Geometry and Tessellation Shaders. 2014.
* Introduction to 3D Game Programming with DirectX 12. Chapter 12: The Geometry Shader. 2016.
* Introduction to 3D Game Programming with DirectX 12. Chapter 13: The Compute Shader. 2016.
* Introduction to 3D Game Programming with DirectX 12. Chapter 14: The Tessellation Stages. 2016.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 5: Surface Shading. 2021**.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 14: Physics-Based Rendering. 2021**.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 27: Materials and Scattering. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 33: Shaders. 2013.
* Principles of Digital Image Synthesis. Chapter 14: Materials. 1995.
* Principles of Digital Image Synthesis. Chapter 15: Shading. 1995.
* **Real-Time Rendering, 4th Ed. Chapter 5: Shading Basics. 2018**.
* **Real-Time Rendering, 4th Ed. Chapter 9: Physically Based Shading. 2018**.
* **Physically Based Rendering, 3rd Ed. 2016**.
* Graphics Programming Methods. Chapter 3.1: A Modified Phong-Blinn Light Model for Shadowed Areas. 2003.
* ShaderX1. Part 1: Introduction to Shader Programming. 1996.
* ShaderX1. Part 2: Vertex Shader Tricks. 1996.
* ShaderX1. Part 3: Pixel Shader Tricks. 1996.
* ShaderX2. Section III: Software Shaders and Shader Programming Tips. 2003.
* ShaderX2. Chapter 6.1: Shader Abstraction. 2003.
* ShaderX2. Chapter 6.3: Shaders under Control (Codecreatures Engine). 2003.
* ShaderX2. Chapter 6.4: Shader Integration in the Gamebryo Graphics Engine. 2003.
* ShaderX2. Chapter 6.5: Vertex Shader Compiler. 2003.
* ShaderX2. Chapter 6.6: Shader Disassembler. 2003.
* ShaderX3. Section III: Software Shaders and Shader Programming Tips. 2004.
* ShaderX3. Chapter 6.2: Integrating Shaders into the Vision Rendering Engine. 2004.
* ShaderX3. Chapter 6.4: Shader Visualization Systems for the Art Pipeline. 2004.
* ShaderX4. Chapter 5.3: Case Study: Designing a Shader-Subsystem for a Next-Gen Graphics Engine. 2006.
* ShaderX5. Chapter 8.2: Transparent Shader Data Binding. 2006.
* ShaderX5. Chapter 8.3: Designing Plug-in Shaders with HLSL. 2006.
* ShaderX5. Chapter 8.4: Shader System Integration: Nebula2 and 3ds Max. 2006.
* ShaderX6. Chapter 8.1: A Flexible Material System in Design. 2008.
* ShaderX7. Chapter 8.3: Automatic Load-Balancing Shader Framework. 2009.
* GPU Gems. Part III: Materials. 2004.
* GPU Gems 2. Part II: Shading, Lighting, and Shadows. 2005.
* GPU Pro 5. Part II: Lighting and Shading. 2014.
* Graphics Gems IV. Part VI: Shading. 1994.

### Static & Dynamic Lighting

* Game Programming Gems 6. Chapter 5.7: Fast Per-Pixel Lighting with Many Lights. 2006.
* Game Engine Gems 1. Chapter 15: Physically-Based Outdoor Scene Lighting. 2010.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 6: Lighting Models. 2014.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 7: Additional Lighting Models. 2014.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 17: Lights. 2014.
* Introduction to 3D Game Programming with DirectX 12. Chapter 8: Lighting. 2016.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 26: Light. 2013.
* Principles of Digital Image Synthesis. Chapter 11: Light. 1995.
* Principles of Digital Image Synthesis. Chapter 16: Integral Equations. 1995.
* Principles of Digital Image Synthesis. Chapter 17: The Radiance Equation. 1995.
* Principles of Digital Image Synthesis. Chapter 18: Radiosity. 1995.
* Principles of Digital Image Synthesis. Chapter 19: Ray Tracing. 1995.
* Tricks of the 3D Game Programming Gurus. Chapter 14: Shadows, Lighting, and Secrets of the id. 2003.
* **Real-Time Rendering, 4th Ed. Chapter 8: Light and Color. 2018**.
* **Real-Time Rendering, 4th Ed. Chapter 10: Local Illumination. 2018**.
* **Real-Time Rendering, 4th Ed. Chapter 11: Global Illumination. 2018**.
* **Real-Time Rendering, 4th Ed. Chapter 26: Real-Time Ray Tracing. 2018**
* Ray Tracing from the Ground Up. 2007.
* Graphics Programming Methods. Chapter 3.2: Stochastic Iteration for Nondiffuse Global Illumination. 2003.
* Graphics Programming Methods. Chapter 3.3: Metropolis Sampling in Random Walk Global Illumination Algorithms. 2003.
* Graphics Programming Methods. Chapter 3.4: Metropolis Density Estimation. 2003.
* Graphics Programming Methods. Chapter 3.5: Rendering with Adaptive Integration. 2003.
* Graphics Programming Methods. Chapter 3.11: Real-Time Light-Atmosphere Interactions for Outdoor Scenes. 2003.
* Advanced Global Illumination, 2nd Ed. 2006.
* ShaderX4. Chapter 6.2: Ray Tracing Effects without Tracing Rays. 2006.
* ShaderX4. Chapter 6.3: Implementing Ray-Tracing on the GPU. 2006.
* ShaderX5. Section VI: Global Illumination Effects. 2006.
* ShaderX6. Section VI: Global Illumination Effects. 2008.
* GPU Gems. Chapter 8: Simulating Diffraction. 2004.
* GPU Gems. Part II: Lighting and Shadows. 2004.
* GPU Gems 2. Part II: Shading, Lighting, and Shadows. 2005.
* GPU Gems 3. Part II: Light and Shadows. 2007.
* GPU Pro 1. Part IV: Global Illumination. 2010.
* GPU Pro 2. Part III: Global Illumination Effects. 2011.
* GPU Pro 3. Part III: Global Illumination Effects. 2012.
* GPU Pro 5. Part II: Lighting and Shading. 2014.
* GPU Pro 6. Part III: Lighting. 2015.
* GPU Pro 7. Part II: Lighting. 2016.
* GPU Zen. Part II: Lighting. 2017.
* GPU Zen 2. Part V: Real-Time Ray Tracing. 2017.
* Graphics Gems. Part 7: Ray Tracing. 1990.
* Graphics Gems II. Part V: Ray Tracing. 1991.
* Graphics Gems II. Part VI: Radiosity. 1991.
* Graphics Gems III. Part VI: Ray Tracing and Radiosity. 1994.
* Graphics Gems IV. Part V: Ray Tracing. 1994.
* Graphics Gems V. Part V: Ray Tracing and Radiosity. 1995.

### Cameras

* **Game Programming Algorithms and Techniques. Chapter 8: Cameras. 2013**.
* 3D Game Engine Architecture. Chapter 3.5: Renderers and Cameras. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 2.3: Cameras. 2007.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 13: Cameras. 2014.
* Introduction to 3D Game Programming with DirectX 12. Chapter 15: Building a First Person Camera and Dynamic Indexing. 2016.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 8: Viewing. 2021**.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 13: Camera Specifications and Transformations. 2013.
* ShaderX5. Chapter 9.5: A GPU Panorama Viewer for Generic Camera Models. 2006.
* Real-Time Cameras. 2009.

### Text & Fonts

* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 14: The Text Generation. 2003.
* Game Programming Gems 8. Chapter 1.1: Fast Font Rendering with Instancing. 2010.

## Profiling & Debugging

* **Game Coding Complete, 4th Ed. Chapter 12: Debugging Your Game. 2012**.
* Cross-Platform Game Programming. Chapter 2: Top Ten Tips. Debugging and Profiling. 2005.
* Cross-Platform Game Programming. Chapter 6: Debugging. 2005.
* Game Programming Golden Rules. Chapter 9: Optimization. 2004
* Game Programming Gems 1. Chapter 1.13: Stats: Real-Time Statistics and In-Game Debugging. 2000.
* Game Programming Gems 1. Chapter 1.14: Real-Time Profiling. 2000.
* Game Programming Gems 2. Chapter 1.11: A Built-in Game Profiling Module. 2001.
* Game Programming Gems 2. Chapter 1.18: A Generic Tweaker. 2001.
* Game Programming Gems 3. Chapter 1.17: Real-Time Hierarchical Profiling. 2002.
* Game Programming Gems 4. Chapter 1.1: The Science of Debugging Game. 2004.
* Game Programming Gems 7. Chapter 1.10: Advanced Debugging Techniques. 2008.
* **Game Engine Architecture, 3rd Ed. Chapter 10: Tools for Debugging and Development. 2018**.
* Game Engine Gems 2. Chapter 16: Game Tuning Infrastructure. 2011.
* Game Development Tools. Chapter 11: In-Game Audio Debugging Tools. 2011.
* Game Development Tools. Chapter 21: GPU Debugging and Profiling with NVIDIA Parallel Nsight. 2011.
* ShaderX5. Chapter 9.9: Print Shader for Debugging Pixel Shaders. 2006.

### Debug Drawing (Lines etc.)

### Recording & Playback

* Game Programming Gems 2. Chapter 1.16: Game Input Recording and Playback. 2001.

### Memory & Performance Stats

* Game Programming Gems 1. Chapter 1.13: Stats: Real-Time Statistics and In-Game Debugging. 2000.
* Game Programming Gems 2. Chapter 1.10: A Drop-in Debug Memory Manager. 2001.
* Game Programming Gems 8. Chapter 4.6: Design and Implementation of an In-Game Memory Profiler. 2010.

### In-Game Menus or Console

* Tricks of the 3D Game Programming Gurus. Chapter 3: 3D Game Programming with a Virtual Computer. 2003.

## Collision & Physics

* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 13: Playing God: Basic Physics Modeling. 2003.
* **Game Coding Complete, 4th Ed. Chapter 10: 3D Engine. 2012**.
* **Game Programming Algorithms and Techniques. Chapter 7: Physics. 2013**.
* Game Programming Gems 4. Chapter 3: Physics. 2004.
* Game Programming Gems 5. Chapter 3: Physics. 2005.
* Game Programming Gems 6. Chapter 2: Mathematics and Physics. 2006.
* Game Programming Gems 7. Chapter 2: Mathematics and Physics. 2008.
* Game Programming Gems 8. Chapter 2: Physics and Animation. 2010.
* **Game Engine Architecture, 3rd Ed. Chapter 13: Collision and Rigid Body Dynamics. 2018**.
* 3D Game Engine Architecture. Chapter 6: Collision Detection. 2004.
* 3D Game Engine Architecture. Chapter 7: Physics. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 12: Collision Detection. 2007.
* 3D Game Engine Design, 2nd Ed. Chapter 13: Physics. 2007.
* Game Engine Gems 1. Chapter 14: Moments of Inertia for Common Shapes. 2010.
* Game Engine Gems 2. Chapter 1: Fast Computation of Tight-Fitting Oriented Bounding Boxes. 2011.
* Game Engine Gems 2. Chapter 22: GPGPU Cloth Simulation Using GLSL, OpenCL, and CUDA. 2011.
* Game Engine Gems 3. Chapter 11: Volumetric Hierarchical Approximate Convex Decomposition. 2016.
* Game Engine Gems 3. Chapter 12: Simulating Soft Bodies Using Strained Based Dynamics. 2016.
* Tricks of the 3D Game Programming Gurus. Chapter 15: 3D Character Animation, Motion, and Collision Detection. 2003.
* **Real-Time Rendering, 4th Ed. Chapter 22: Intersection Test Methods. 2018**
* **Real-Time Rendering, 4th Ed. Chapter 25: Collision Detection. 2018**
* Graphics Programming Methods. Chapter 1.5: Collision Detection of Deformable Volumetric Meshes. 2003.
* ShaderX5. Chapter 9.4: Collision Detection Shader Using Cube-Maps. 2006.
* ShaderX6. Chapter 9.4: n-Body Simulations on the GPU. 2008.
* GPU Gems 3. Part V: Physics Simulation. 2007.
* The Nature of Code. 2012.
* Physics for Game Programmers. 2003.
* Physics for Game Developers, 2nd Ed. 2013.
* Physics Modeling for Game Programmers. 2004.
* Foundations of Physically Based Modeling and Animation
* Game Physics Pearls. 2010.
* Collision Detection in Interactive 3D Environments. 2003.
* Game Physics Engine Development, 2nd Ed. 2010.
* Real-Time Collision Detection. 2004.
* Game Physics, 2nd Ed. 2010.

### Forces & Constraints

### Ray/Shape Casting (Queries)

* Introduction to 3D Game Programming with DirectX 12. Chapter 17: Picking. 2016.

### Rigid Bodies

* Game Programming Gems 8. Chapter 7.2: PhysX GPU Rigid Bodies in Batman: Arkham Asylum. 2010.
* Game Engine Gems 2. Chapter 23: A Jitter-Tolerant Rigid Body Sleep Condition. 2011.

### Phantoms

### Shapes/Collidables

### Physics/Collision World

## Human Interface Devices (HID)

* Computer Graphics Principles and Practice, 3rd Ed. Chapter 21: Interaction Techniques. 2013.

### Game-Specific Interface

### Physical Device I/O

* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 9: Uplinking with DirectInput and Force Feedback. 2003.
* **Game Coding Complete, 4th Ed. Chapter 5: User Interface Programming and Input Devices. 2012**.
* **Game Programming Algorithms and Techniques. Chapter 5: Input. 2013**.
* Cross-Platform Game Programming. Chapter 5: Storage. 2005.
* Cross-Platform Game Programming. Chapter 7: System I/O. 2005.
* Game Programming Gems 3. Chapter 1.13: Real-Time Input and UI in 3D Games. 2002.
* **Game Engine Architecture, 3rd Ed. Chapter 9: Human Interface Devices. 2018**.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 12: Supporting Systems. 2014.
* Tricks of the 3D Game Programming Gurus. Chapter 3: 3D Game Programming with a Virtual Computer. 2003.

## Scene Graph / Culling Optimizations

* **Game Coding Complete, 4th Ed. Chapter 10: 3D Engine. 2012**.
* Game Programming Gems 5. Chapter 1.6: Improved Frustum Culling. 2005.
* Game Programming Gems 6. Chapter 5.3: Enhanced Object Culling with (Almost) Oriented Bounding Boxes. 2006.
* Game Programming Gems 8. Chapter 1.4: View Frustum Culling of Catmull-Clark Patches in DirectX 11. 2010.
* **Game Engine Architecture, 3rd Ed. Chapter 11: The Rendering Engine. 2018**.
* 3D Game Engine Design, 2nd Ed. Chapter 5: Scene Graphs. 2007.
* 3D Game Engine Design, 2nd Ed. Chapter 6: Scene Graph Compilers. 2007.
* Introduction to 3D Game Programming with DirectX 12. Chapter 16: Instancing and Frustum Culling. 2016.
* ShaderX7. Chapter 8.5: Designing a Renderer for Multiple Lights: The Light Pre-Pass Renderer. 2009.
* ShaderX7. Chapter 8.6: Light Pre-Pass Renderer: Using the CIE Luv Color Space. 2009.
* GPU Gems. Part V: Performance and Practicalities. 2004.

### Spatial Hash (BSP Tree, kd-Tree, &hellip;)

* Game Programming Gems 5. Chapter 1.5: Sphere Trees for Speedy BSPs. 2005.
* Game Programming Gems 5. Chapter 1.9: CSG Construction Using BSP Trees. 2005.
* Game Programming Gems 6. Chapter 5.2: Space Partitioning Using an Adaptive Binary Tree. 2006.
* Game Programming Gems 6. Chapter 1.5: BSP Techniques. 2006.
* 3D Game Engine Architecture. Chapter 4.2: Sorting. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 2.4: Culling and Clipping. 2007.
* 3D Game Engine Design, 2nd Ed. Chapter 9: Spatial Sorting. 2007.
* Game Engine Gems 2. Chapter 4: Screen-Space Classification for Efficient Deferred Shading. 2011.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 37: Spatial Data Structures. 2013.
* Tricks of the 3D Game Programming Gurus. Chapter 13: Spatial Partitioning and Visibility Algorithms. 2003.
* **Real-Time Rendering, 4th Ed. Chapter 19: Acceleration Algorithms. 2018**.
* Graphics Programming Methods. Chapter 2.10: k-D Tree Face Portals with Solid Geometry. 2003.
* Graphics Programming Methods. Chapter 3.9: An Effective Implementation of the k-D Tree. 2003.

### Occlusion & PVS

* Game Programming Gems 3. Chapter 4.4: Fast and Simple Occlusion Culling. 2002.
* Game Programming Gems 4. Chapter 5.15: Terrain Occlusion Culling with Horizons. 2004.
* Graphics Programming Methods. Chapter 2.8: Visible Terrain Grid Determination Using the Frustum. 2003.
* Graphics Programming Methods. Chapter 3.6: Illumination-Based Occlusion Culling. 2003.
* ShaderX7. Chapter 8.4: Game-Engine-Friendly Occlusion Culling. 2009.

### LoD System

* 3D Game Engine Architecture. Chapter 4.1: Level of Detail. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 10: Level of Detail. 2007.

## Visual Effects

* Game Programming Gems 1. Chapter 5: Pixel Effects. 2000.
* Game Programming Gems 2. Chapter 5.3: Dynamic Per-Pixel Lighting Techniques. 2001.
* Game Programming Gems 2. Chapter 5.4: Generating Procedural Clouds Using 3D Hardware. 2001.
* Game Programming Gems 2. Chapter 5.5: Texture Masking for Faster Lens Flare. 2001.
* Game Programming Gems 2. Chapter 5.7: Impostors: Adding Clutter. 2001.
* Game Programming Gems 3. Chapter 4.11: Billboard Beams. 2002.
* Game Programming Gems 4. Chapter 5.9: Fast Sepia Tone Conversion. 2004.
* Game Programming Gems 4. Chapter 5.10: Dynamic Gamma Using Sampled Scene Luminance. 2004.
* Game Programming Gems 5. Chapter 5.1: Realistic Cloud Rendering on Modern GPUs. 2005.
* Game Programming Gems 5. Chapter 5.2: Let it Snow, Let if Snow, Let it Snow (and Rain). 2005.
* Game Programming Gems 5. Chapter 5.3: Widgets: Rendering Fast and Persistent Foliage. 2005.
* Game Programming Gems 5. Chapter 5.4: 2.5D Dimensional Impostors for Realistic Trees and Forests. 2005.
* Game Programming Gems 5. Chapter 5.7: A Simple Method for Rendering Gemstones. 2005.
* Game Programming Gems 6. Chapter 5.9: Practical Sky Rendering for Games. 2006.
* Game Programming Gems 6. Chapter 1.2: Computer Vision in Games Using the OpenCV Library. 2006.
* Game Programming Gems 7. Chapter 5.5: Animating Impostors Using Radial Basis Functions Textures. 2008.
* Game Programming Gems 7. Chapter 5.6: Clipmapping on SM1.1 and Higher. 2008.
* Game Programming Gems 7. Chapter 5.9: Art-Based Rendering with Graftal Imposters. 2008.
* Game Programming Gems 8. Chapter 1.2: Principles and Practice of Screen Space Ambient Occlusion. 2010.
* Game Programming Gems 8. Chapter 1.5: Ambient Occlusion Using DirectX Compute Shader. 2010.
* Game Programming Gems 8. Chapter 1.6: Eye-View Pixel Anti-Aliasing for Irregular Shadow Mapping. 2010.
* **Game Engine Architecture, 3rd Ed. Chapter 11: The Rendering Engine. 2018**.
* 3D Game Engine Architecture. Chapter 5: Advanced Rendering Topics. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 4: Special Effects Using Shaders. 2007.
* Game Engine Gems 1. Chapter 7: World's Best Palettizer. 2010.
* Game Engine Gems 1. Chapter 18: Fast Screen-Space Ambient Occlusion and Indirect Lighting. 2010.
* Game Engine Gems 2. Chapter 2: Modeling, Lighting, and Rendering Techniques for Volumetric Clouds. 2011.
* Game Engine Gems 2. Chapter 3: Simulation of Night-Vision and Infrared Sensors. 2011.
* Game Engine Gems 3. Chapter 3: Fog with a Linear Density Function. 2016.
* Game Engine Gems 3. Chapter 4: Vegetation Management in Leadwerks Game Engine 4. 2016.
* Game Engine Gems 3. Chapter 5: Smooth Horizon Mapping. 2016.
* Introduction to 3D Game Programming with DirectX 12. Chapter 10: Blending. 2016.
* Introduction to 3D Game Programming with DirectX 12. Chapter 11: Stenciling. 2016.
* Introduction to 3D Game Programming with DirectX 12. Chapter 21: Ambient Occlusion. 2016.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 17: Image Representation and Manipulation. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 18: Images and Signal Processing. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 19: Enlarging and Shrinking Images. 2013.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 34: Expressive Rendering. 2013.
* Digital Image Processing, 4th Ed. Chapter 3: Intensity Transformations and Spatial Filtering. 2018.
* Digital Image Processing, 4th Ed. Chapter 4: Filtering in the Frequency Domain. 2018.
* Digital Image Processing, 4th Ed. Chapter 5: Image Restoration and Reconstruction. 2018.
* Digital Image Processing, 4th Ed. Chapter 6: Color Image Processing. 2018.
* Digital Image Processing, 4th Ed. Chapter 7: Wavelet and Other Image Transforms. 2018.
* Digital Image Processing, 4th Ed. Chapter 8: Image Compression and Watermarking. 2018.
* Digital Image Processing, 4th Ed. Chapter 9: Morphological Image Processing. 2018.
* Digital Image Processing, 4th Ed. Chapter 10: Image Segmentation. 2018.
* Digital Image Processing, 4th Ed. Chapter 11: Feature Extraction. 2018.
* Digital Image Processing, 4th Ed. Chapter 12: Image Pattern Classification. 2018.
* **Real-Time Rendering, 4th Ed. Chapter 12: Image-Space Effects. 2018**.
* **Real-Time Rendering, 4th Ed. Chapter 13: Beyond Polygons. 2018**.
* **Real-Time Rendering, 4th Ed. Chapter 14: Volumetric and Translucency Rendering. 2018**.
* **Real-Time Rendering, 4th Ed. Chapter 15: Non-Photorealistic Rendering. 2018**.
* Real-Time Volume Graphics. 2006.
* Graphics Programming Methods. Chapter 2.9: Real-Time Generation and Rendering of 3D Planets. 2003.
* Graphics Programming Methods. Chapter 3.7: Antialiasing for Bump Maps and a Fast Normalization Trick. 2003.
* Graphics Programming Methods. Chapter 3.13: Quantization of True-Color Images with Opacity Information. 2003.
* Production Volume Rendering. 2012.
* ShaderX2. Section IV: Image Space. 2003.
* ShaderX3. Section IV: Image Space. 2004.
* ShaderX3. Chapter 6.5: Drawing a Crowd. 2004.
* ShaderX3. Section VIII: Environmental Effects. 2004.
* ShaderX4. Section III: Image Space. 2006.
* ShaderX4. Section VII: Environmental Effects. 2006.
* ShaderX5. Section III: Image Space. 2006.
* ShaderX5. Section V: Environmental Effects. 2006.
* ShaderX5. Chapter 9.1: Large Crowds of Autonomous Animated Characters Using Fragment Shaders and Level of Detail. 2006.
* ShaderX5. Chapter 9.2: Interactive Image Segmentation Based on GPU Cellular Automata. 2006.
* ShaderX5. Chapter 9.8: Implementing High-Quality PRNG on GPUs. 2006.
* ShaderX6. Section III: Image Space. 2008.
* ShaderX6. Section V: Environmental Effects. 2008.
* ShaderX6. Chapter 9.1: An Interactive Tour of Voronoi Diagrams on the GPU. 2008.
* ShaderX7. Section III: Image Space. 2009.
* ShaderX7. Section V: Environmental Effects. 2009.
* ShaderX7. Chapter 9.3: A Volume Shader for Quantum Voronoi Diagrams Inside the 3D Bloch Ball. 2009.
* ShaderX7. Chapter 9.5: Interactive Image Morphing Using Thin-Plate Spline. 2009.
* GPU Gems. Chapter 3: Skin in the "Dawn" Demo. 2004.
* GPU Gems. Chapter 5: Implementing Improved Perlin Noise. 2004.
* GPU Gems. Chapter 7: Rendering Countless Blades of Waving Grass. 2004.
* GPU Gems. Part IV: Image Processing. 2004.
* GPU Gems. Chapter 39: Volume Rendering Techniques. 2004.
* GPU Gems. Chapter 41: Real-Time Stereograms. 2004.
* GPU Gems. Chapter 42: Deformers. 2004.
* GPU Gems 2. Part III: High-Quality Rendering. 2005.
* GPU Gems 2. Part IV: General-Purpose Computation on GPUs: A Primer. 2005.
* GPU Gems 2. Part VI: Image-Oriented Computing. 2005.
* GPU Gems 2. Part VII: Simulation and Numerical Algorithms. 2005.
* GPU Gems 3. Part III: Rendering. 2007.
* GPU Gems 3. Part IV: Image Effects. 2007.
* GPU Gems 3. Part VI: GPU Computing. 2007.
* GPU Pro 1. Part III: Rendering Techniques. 2010.
* GPU Pro 1. Part V: Image Space. 2010.
* GPU Pro 1. Part VIII: 3D Engine Design. 2010.
* GPU Pro 1. Part IX: Game Postmortems. 2010.
* GPU Pro 1. Part X: Beyond Pixels and Triangles. 2010.
* GPU Pro 2. Part II: Rendering. 2011.
* GPU Pro 2. Part VI: 3D Engine Design. 2011.
* GPU Pro 2. Part VII: GPGPU. 2011.
* GPU Pro 3. Part II: Rendering. 2012.
* GPU Pro 3. Part V: 3D Engine Design. 2012.
* GPU Pro 3. Part VI: GPGPU. 2012.
* GPU Pro 4. Part II: Rendering. 2013.
* GPU Pro 4. Part III: Image Space. 2013.
* GPU Pro 4. Part V: Game Engine Design. 2013.
* GPU Pro 4. Part VI: GPGPU. 2013.
* GPU Pro 5. Part I: Rendering. 2014.
* GPU Pro 5. Part III: Image Space. 2014.
* GPU Pro 5. Part V: 3D Engine Design. 2014.
* GPU Pro 5. Part VI: Compute. 2014.
* GPU Pro 6. Part II: Rendering. 2015.
* GPU Pro 6. Part VI: Compute. 2015.
* GPU Pro 6. Part VII: 3D Engine Design. 2015.
* GPU Pro 7. Part III: Rendering. 2016.
* GPU Pro 7. Part V: 3D Engine Design. 2016.
* GPU Pro 7. Part VI: Compute. 2016.
* GPU Zen. Part III: Rendering. 2017.
* GPU Zen. Part IV: Screen Space. 2017.
* GPU Zen. Part VI: Compute. 2017.
* GPU Zen 2. Part I: Rendering. 2017.
* GPU Zen 2. Part II: Environmental Effects. 2017.
* GPU Zen 2. Part IV: 3D Engine Design. 2017.
* Graphics Gems. Part 2: 2D Rendering. 1990.
* Graphics Gems. Part 3: Image Processing. 1990.
* Graphics Gems. Part 6: 3D Rendering. 1990.
* Graphics Gems II. Part II: Image Processing. 1991.
* Graphics Gems III. Part I: Image Processing. 1994.
* Graphics Gems III. Part VII: Rendering. 1994.
* Graphics Gems IV. Part VIII: Image Processing. 1994.
* Graphics Gems IV. Part IX: Graphic Design. 1994.
* Graphics Gems IV. Part X: Utilities. 1994.
* Graphics Gems V. Part VI: Halftoning and Image Processing. 1995.
* Graphics Gems V. Part VII: Utilities. 1995.
* Non-Photorealistic Rendering. 2001.
* Non-Photorealistic Computer Graphics. 2002.
* 3D Engine Design for Virtual Globes. 2011.

### Light Mapping & Dynamic Shadows

* Game Programming Gems 2. Chapter 5.6: Practical Priority Buffer Shadows. 2001.
* Game Programming Gems 3. Chapter 4.6: Computing Optimized Shadow Volumes for Complex Data Sets. 2002.
* Game Programming Gems 4. Chapter 5.2: GPU Shadow Volume Construction for Nonclosed Meshes. 2004.
* Game Programming Gems 4. Chapter 5.3: Perspective Shadow Maps. 2004.
* Game Programming Gems 4. Chapter 5.4: Combined Depth and ID-Based Shadow Buffers. 2004.
* Game Programming Gems 4. Chapter 5.5: Carving Static Shadows into Geometry. 2004.
* Game Programming Gems 4. Chapter 5.6: Adjusting Real-Time Lighting for Shadow Volumes and Optimized Meshes. 2004.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 19: Shadow Mapping. 2014.
* Introduction to 3D Game Programming with DirectX 12. Chapter 20: Shadow Mapping. 2016.
* Tricks of the 3D Game Programming Gurus. Chapter 14: Shadows, Lighting, and Secrets of the id. 2003.
* **Real-Time Rendering, 4th Ed. Chapter 7: Shadows. 2018**.
* Real-Time Shadows. 2011.
* Graphics Programming Methods. Chapter 3.12: True Volumetric Shadows. 2003.
* ShaderX2. Section V: Shadows. 2003.
* ShaderX3. Section V: Shadows. 2004.
* ShaderX4. Section IV: Shadows. 2006.
* ShaderX5. Section IV: Shadows. 2006.
* ShaderX6. Section IV: Shadows. 2008.
* ShaderX7. Section IV: Shadows. 2009.
* GPU Gems. Part II: Lighting and Shadows. 2004.
* GPU Gems 2. Part II: Shading, Lighting, and Shadows. 2005.
* GPU Gems 3. Part II: Light and Shadows. 2007.
* GPU Pro 1. Part VII: Shadows. 2010.
* GPU Pro 2. Part IV: Shadows. 2011.
* GPU Pro 3. Part IV: Shadows. 2012.
* GPU Pro 4. Part IV: Shadows. 2013.
* GPU Pro 6. Part IV: Shadows. 2015.
* GPU Zen 2. Part III: Shadows. 2017.

### HDR Lighting

* Game Programming Gems 6. Chapter 5.10: High Dynamic Range Rendering Using OpenGL Frame Buffer Objects. 2006.
* ShaderX6. Chapter 8.3: Efficient HDR Texture Compression. 2008.

### PRT Lighting, Subsurface Scatter

* Computer Graphics Principles and Practice, 3rd Ed. Chapter 29: Light Transport. 2013.
* Principles of Digital Image Synthesis. Chapter 12: Energy Transport. 1995.
* Principles of Digital Image Synthesis. Chapter 13: Radiometry. 1995.

### Particle & Decal Systems

* Game Programming Gems 5. Chapter 5.6: Powerful Explosion Effects Using Billboard Particles. 2005.
* Game Programming Gems 7. Chapter 5.1: Advanced Particle Decomposition. 2008.
* Game Programming Gems 7. Chapter 5.7: An Advanced Decal System. 2008.
* Game Programming Gems 8. Chapter 7.3: Fast GPU Fluid Simulation in PhysX. 2010.
* Game Engine Gems 1. Chapter 20: A Deferred Decal Rendering Technique. 2010.
* Game Engine Gems 3. Chapter 7: Edge-Preserving Smoothing Filter for Particle Based Rendering. 2016.
* Graphics Programming Methods. Chapter 1.1: Simulating and Rendering Particle Systems. 2003.
* ShaderX7. Chapter 9.1: Sliced Grid: A Memory and Computationally Efficient Data Structure for Particle-Based Simulation on the GPU. 2009.
* GPU Gems. Chapter 6: Fire in the "Vulcan" Demo. 2004.

### Post Effects

* Game Programming Gems 4. Chapter 5.11: Heat and Haze Post-Processing Effects. 2004.
* Game Programming Gems 5. Chapter 5.5: Gridless Controllable Fire. 2005.
* Game Programming Gems 5. Chapter 5.8: Volumetric Post-Processing. 2005.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 18: Post-Processing. 2014.
* ShaderX2. Chapter 6.2: Post-Process Fun with Effects Buffers. 2003.
* ShaderX4. Chapter 5.2: Post-Processing Effects using DXSAS. 2006.
* ShaderX5. Chapter 8.1: Postprocessing Effects in Design. 2006.

### Environment Mapping

* Game Programming Gems 3. Chapter 4.15: Cube Map Lighting Techniques. 2002.
* Game Engine Gems 1. Chapter 17: Motion Blur and the Velocity-Depth-Gradient Buffer. 2010.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 8: Gleaming the Cube. 2014.
* Introduction to 3D Game Programming with DirectX 12. Chapter 18: Cube Mapping. 2016.

## Skeletal Animation

* Game Programming Gems 3. Chapter 4.7: Subdivision Surfaces for Character Animation. 2002.
* Game Programming Gems 3. Chapter 4.8: Improved Deformation of Bones. 2002.
* Game Programming Gems 4. Chapter 5.12: Hardware Skinning with Quaternions. 2004.
* Game Programming Gems 6. Chapter 5.1: Synthesis of Realistic Idle Motion for Interactive Characters. 2006.
* Game Programming Gems 6. Chapter 5.4: Skin Splitting for Optimal Rendering. 2006.
* Game Programming Gems 7. Chapter 5.2: Reducing Cumulative Errors in Skeletal Animations. 2008.
* Game Programming Gems 7. Chapter 5.10: Cheap Talk: Dynamic Real-Time Lipsync. 2008.
* Game Programming Gems 8. Chapter 2: Physics and Animation. 2010.
* **Game Engine Architecture, 3rd Ed. Chapter 12: Animation Systems. 2018**.
* 3D Game Engine Architecture. Chapter 4.5: Controllers and Animation. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 8: Controller-Based Animation. 2007.
* Game Engine Gems 3. Chapter 10: Rotatinoal Joint Limits in Quaternion Space. 2016.
* Real-Time 3D Rendering with DirectX and HLSL. Chapter 20: Skeletal Animation. 2014.
* Introduction to 3D Game Programming with DirectX 12. Chapter 23: Character Animation. 2016.
* **Fundamentals of Computer Graphics, 5th Ed. Chapter 16: Computer Animation. 2021**.
* Computer Graphics Principles and Practice, 3rd Ed. Chapter 35: Motion. 2013.
* Tricks of the 3D Game Programming Gurus. Chapter 15: 3D Character Animation, Motion, and Collision Detection. 2003.
* Graphics Programming Methods. Chapter 1.2: Real-Time Animation of Trees. 2003.
* Graphics Programming Methods. Chapter 1.4: Scripted Bodies and Spline-Driven Animation. 2003.
* Graphics Programming Methods. Chapter 1.6: Building an Advanced Facial Expression System. 2003.
* Graphics Programming Methods. Chapter 1.7: Inverse Dynamic Displacement Constraints in Real-Time Cloth and Soft-Body Models. 2003.
* GPU Gems. Chapter 4: Animation in the "Dawn" Demo. 2004.
* Character Animation with Direct3D. 2011.
* Real-time 3D Character Animation with Visual C++. 2001.
* The Nature of Code. 2012.
* Computer Animation, 3rd Ed. 2012.
* Physics Based Animation. 2005.

### Animation Decompression

### LERP and Additive Blending

### Animation Playback

### Sub-skeletal Animation

### Animation State Tree & Layers

### Inverse Kinematics (IK)

* Graphics Programming Methods. Chapter 1.8: Resolution of the Inverse Kinematics of an Articulated Structure Using the Jacobian Pseudo-Inverse. 2003.
* Game Inverse Kinematics. 2013.

### Game-Specific Post-Processing

### Hierarchical Object Attachment

* Game Engine Gems 1. Chapter 19: Real-Time Character Dismemberment. 2010.
* Graphics Programming Methods. Chapter 1.3: Real-time Multiresolution Dynamics of Deeply Hierarchical Bodies. 2003.

## Online Multiplayer

* **Game Programming Algorithms and Techniques. Chapter 12: Networked Games. 2013**.
* Cross-Platform Game Programming. Chapter 10: Network Programming. 2005.
* Game Programming Gems 1. Chapter 1.11: A Network Protocol for Online Games. 2000.
* Game Programming Gems 3. Chapter 5: Network and Multiplayer. 2002.
* Game Programming Gems 4. Chapter 6: Network and Multiplayer. 2004.
* Game Programming Gems 5. Chapter 6: Networking and Multi-player. 2005.
* Game Programming Gems 6. Chapter 7: Network and Multiplayer. 2006.
* Game Programming Gems 7. Chapter 6: Networking and Multiplayer. 2008.
* Game Programming Gems 8. Chapter 5: Networking and Multiplayer. 2010.
* Game Engine Gems 2. Chapter 18: Believable Dead Reckoning for Networked Games. 2011.
* Game Engine Gems 3. Chapter 17: Shared Network Arrays as an Abstraction of Network Code from Game Code Logic. 2016.
* **Multiplayer Game Programming. 2015**.
* Massively Multiplayer Game Development. 2003.
* Massively Multiplayer Game Development 2. 2005.
* Programming with POSIX Threads. 1997.
* Advanced Programming in the UNIX Environment, 3rd Ed. 2013.
* Linux System Programming, 2nd Ed. 2013.
* TCP/IP Illustrated Vol 1, 2nd Ed. 2011.
* TCP/IP Illustrated Vol 2. 1995.
* TCP/IP Illustrated Vol 3. 1996.
* UNIX Network Programming Vol 1, 3rd Ed. 2003.
* Unix Network Programming Vol 2, 2nd Ed. 1998.
* Understanding Linux Network Internals. 2006.

### Game State Replication

### Object Authority Policy

### Match-Making & Game Management

## Audio

* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 10: Sounding Off with DirectSound and DirectMusic. 2003.
* **Game Programming Algorithms and Techniques. Chapter 6: Sound. 2013**.
* Cross-Platform Game Programming. Chapter 8: The Audio System. 2005.
* Game Programming Gems 2. Chapter 6: Audio Programming. 2001.
* Game Programming Gems 3. Chapter 6: Audio Programming. 2002.
* Game Programming Gems 4. Chapter 7: Audio. 2004.
* Game Programming Gems 5. Chapter 7: Audio. 2005.
* Game Programming Gems 6. Chapter 6: Audio. 2006.
* Game Programming Gems 7. Chapter 4: Audio. 2008.
* Game Programming Gems 8. Chapter 6: Audio. 2010.
* **Game Engine Architecture, 3rd Ed. Chapter 14: Audio. 2018**.
* Game Engine Gems 1. Chapter 5: Environment Sound Culling. 2010.
* Tricks of the 3D Game Programming Gurus. Chapter 3: 3D Game Programming with a Virtual Computer. 2003.
* ShaderX6. Chapter 9.3: Real0Time Audio Processing on the GPU. 2008.
* GPU Gems. Chapter 40: Applying Real-Time Shading to 3D Ultrasound Visualization. 2004.
* Game Audio Programming. 2016.
* Game Audio Programming 2. 2018.
* Game Audio Programming 3. 2020.
* Getting Started with C++ Audio Programming for Game Development. 2013.

### DSP/Effects

### 3D Audio Model

### Audio Playback/Management

## Front End

* **Game Programming Algorithms and Techniques. Chapter 10: User Interfaces. 2013**.
* Game Programming Gems 4. Chapter 5.1: Poster Quality Screenshots. 2004.
* Game Programming Gems 8. Chapter 4.10: A Flexible User Interface Layout System for Divergent Environments. 2010.

### Heads-Up Display (HUD)

* Game Programming Gems 5. Chapter 1.1: Context-Sensitive HUDs for Editors. 2005.

### Full-Motion Video (FMV)

### In-Game Cinematics (IGC)

### In-Game GUI

* Game Programming Gems 3. Chapter 1.13: Real-Time Input and UI in 3D Games. 2002.
* Game Engine Gems 1. Chapter 6: A GUI Framework and Presentation Layer. 2010.
* ShaderX7. Chapter 8.2: Advanced GUI System for Games. 2009.

### In-Game Menus

* Game Programming Gems 3. Chapter 1.14: Natural Selection: The Evolution of Pie Menus. 2002.
* Game Programming Gems 5. Chapter 1.17: Choose Your Path - A Menu System. 2005.

### Wrappers / Attract Mode

## Gameplay Foundations

* **Game Engine Architecture, 3rd Ed. Chapter 15: Introduction to Gameplay Systems. 2018**.
* **Game Engine Architecture, 3rd Ed. Chapter 16: Runtime Gameplay Foundation Systems. 2018**.

### Static World Elements

### Dynamic Game Object Model

* Game Programming Gems 2. Chapter 1.8: A Game Entity Factory. 2001.
* Game Programming Gems 3. Chapter 1.2: An Object-Composition Game Framework. 2002.
* Game Programming Gems 4. Chapter 1.8: A System for Managing Game Entities. 2004.
* Game Programming Gems 4. Chapter 1.11: A Flexible, On-the-Fly Object Manager. 2004.
* Game Programming Gems 5. Chapter 1.3: Component Based Object Management. 2005.
* Game Programming Gems 5. Chapter 1.16: A Generic Component Library. 2005.
* Game Programming Gems 6. Chapter 1.4: Geographic Grid Registration of Game Objects. 2006.
* Game Engine Gems 1. Chapter 21: Multithreaded Object Models. 2010.

### Real-Time Agent-Based Simulation

### Event/Messaging System

* Game Programming Gems 3. Chapter 1.1: Scheduling Game Events. 2002.
* Game Engine Gems 1. Chapter 25: A Basic Scheduler. 2010.
* Game Engine Gems 1. Chapter 28: Inter-Process Communication Based on Your Own RPC Subsystem. 2010.

### World Loading/Streaming

* Game Development Tools. Chapter 2: Game Streaming" A Planned Approach. 2011.

### Scripting System

* **Game Programming Algorithms and Techniques. Chapter 11: Scripting Languages and Data Formats. 2013**.
* Game Programming Golden Rules. Chapter 4: Scripting. 2004.
* Game Programming Gems 5. Chapter 1.10: Building Lua into Games. 2005.
* Game Programming Gems 6. Chapter 4: Scripting and Data-Driven Systems. 2006.
* Game Programming Gems 7. Chapter 7: Scripting and Data-Driven Systems. 2008.
* Game Programming Gems 8. Chapter 4.9: Domain-Specific Languages in Game Engines. 2010.
* Game Scripting Mastery. 2002.
* Language Implementation Patterns. 2009.
* The Garbage Collection Handbook. 2016.

### High-Level Game Flow System/FSM

* Game Programming Golden Rules. Chapter 7: Finite State Machines. 2004.
* Game Programming Gems 5. Chapter 1.8: Large-Scale Stack-Based State Machines. 2005.
* Game Programming Gems 5. Chapter 1.15: Visual Design of State Machines. 2005.

## Game-Specific Subsystems

* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 15: Putting It All Together: You Got Game!. 2003.
* Game Programming Gems 5. Chapter 5.9: Procedural Level Generation. 2005.
* Game Programming Gems 7. Chapter 1.5: For Bees and Gamers: How to Handle Hexagonal Tiles. 2008.
* Game Programming Gems 7. Chapter 1.6: A Sketch-Based Interface to Real-Time Strategy Games Based on a Cellular Automaton. 2008.
* Game Programming Gems 8. Chapter 4.11: Road Creation for Projectable Terrain Meshes. 2010.
* 3D Game Engine Architecture. Chapter 8: Applications. 2004.

### Game-Specific Rendering

* Game Programming Gems 6. Chapter 5.8: Rendering Road Signs Sharply. 2006.

#### Terrain Rendering

* Game Programming Gems 3. Chapter 4.14: Methods for Dynamic, Photorealistic Terrain Lighting. 2002.
* Game Programming Gems 6. Chapter 5.5: GPU Terrain Rendering. 2006.
* Game Programming Gems 7. Chapter 5.8: Mapping Large Textures for Outdoor Terrain Rendering. 2008.
* 3D Game Engine Architecture. Chapter 4.4: Terrain. 2004.
* 3D Game Engine Design, 2nd Ed. Chapter 11: Terrain. 2007.
* Graphics Programming Methods. Chapter 2.8: Building a Flexible Terrain Engine for the Future. 2003.
* Graphics Programming Methods. Chapter 3.10: Pixel Shader Optimizations for Terrain Rendering. 2003.

#### Water Simulation & Rendering

* Game Programming Gems 6. Chapter 5.6: Interactive Fluid Dynamics and Rendering on the GPU. 2006.
* Game Programming Gems 8. Chapter 7.3: Fast GPU Fluid Simulation in PhysX. 2010.
* Game Engine Gems 1. Chapter 12: Precomputed 3D Velocity Field for Simulating Fluid Dynamics. 2010.
* Game Engine Gems 3. Chapter 2: Realistic Blending of Skies, Water, and Terrain. 2016.
* ShaderX5. Chapter 9.6: Explicit Early-Z Culling for Efficient Fluid Flow Simulation. 2006.
* GPU Gems. Chapter 1: Effective Water Simulatinon from Physical Models. 2004.
* GPU Gems. Chapter 2: Rendering Water Caustics. 2004.
* GPU Gems. Chapter 38: Fast Fluid Dynamics Simulation on the GPU. 2004.

### Player Mechanics

#### State Machine & Animation

#### Camera-Relative Controls (HID)

#### Collision Manifold

* Game Programming Gems 4. Chapter 5.14: Fast Collision Detection for 3D Bones-Based Articulated Characters. 2004.

#### Movement

* Game Programming Gems 3. Chapter 4.9: A Framework for Realistic Character Locomotion. 2002.
* Game Engine Gems 2. Chapter 19: An Egocentric Motion Management System. 2011.
* Game Engine Gems 3. Chapter 21: A Control System for Enhancing Entity Behavior. 2016.
* Game Engine Gems 3. Chapter 22: A Control System Based Approach to Entity Behavior. 2016.

### Game Cameras

#### Fixed Cameras

#### Scripted/Animated Cameras

#### Player-Follow Camera

#### Debug Fly-Through Camera

### AI

* Tricks of the Windows Game Programming Gurus, 2nd Ed. Chapter 12: Making Silicon Think with Artificial Intelligence. 2003.
* **Game Programming Algorithms and Techniques. Chapter 9: Artificial Intelligence. 2013**.
* Game Programming Gems 1. Chapter 3: Artificial Intelligence. 2000.
* Game Programming Gems 2. Chapter 3: Artificial Intelligence. 2001.
* Game Programming Gems 3. Chapter 3: Artificial Intelligence. 2002.
* Game Programming Gems 4. Chapter 3: Artificial Intelligence. 2004.
* Game Programming Gems 5. Chapter 3: Artificial Intelligence. 2005.
* Game Programming Gems 6. Chapter 3: Artificial Intelligence. 2006.
* Game Programming Gems 7. Chapter 3: AI. 2008.
* Game Programming Gems 8. Chapter 3: AI. 2010.
* Game Engine Gems 3. Chapter 20: Beyond Smart Objects: Behavior-Oriented Programming for NPCs in Large Open Worlds. 2016.
* **Artificial Intelligence for Games, 2nd Ed. 2009**.
* AI for Game Developers. 2004.
* Programming Game AI By Example. 2004.
* **Artificial Intelligence Modern Approach, 4th Ed. 2021**.
* Behavioral Mathematics for Game AI. 2009.
* AI Game Programming Wisdom. 2002.
* AI Game Programming Wisdom 2. 2003.
* AI Game Programming Wisdom 3. 2006.
* AI Game Programming Wisdom 4. 2008.
* Game AI Pro. 2013.
* Game AI Pro 2. 2015.
* Game AI Pro 3. 2017.

#### Goals & Decision-Making

#### Actions (Engine Interface)

#### Sight Traces & Perception

* Game Engine Gems 3. Chapter 18: Vision Based Local Collision Avoidance. 2016.

#### Path Finding (A*)

* Game Programming Gems 7. Chapter 1.7: Foot Navigation Techinque for First-Person Shooting Games. 2008.
* Game Engine Gems 1. Chapter 4: High-Level Pathfinding. 2010.
* ShaderX4. Chapter 6.4: GPU powered path-finding using precomputed Navigation Mesh approach. 2006.

### Weapons

### Power-Ups

### Vehicles

### Puzzles

## Etc.

### Optimizations

* Game Programming Gems 2. Chapter 1.1: Optimizations for C++ Games. 2001.
* Game Programming Gems 2. Chapter 1.20: Using Bloom Filters to Improve Computational Performance. 2001.
* Game Programming Gems 7. Chapter 1.1: Efficient Cache Replacement Using the Age and Cost Metrics. 2008.
* Game Programming Gems 8. Chapter 4.1: Fast-IsA. 2010.
* Game Engine Gems 2. Chapter 15: High Performance Programming with Data-Oriented Design. 2011.
* Game Engine Gems 3. Chapter 16: Portable SIMD Programs Using ISPC. 2016.
* Video Game Optimization. 2010.
* Hacker's Delight. 2012.
* Vector Game Math Processors. 2002.
* Game Development Tools. Chapter 17: Optimizing a Task-Based Game Engine. 2011.
* Game Development Tools. Chapter 19: Reducing Video Game Creation Effort with Eberos GML2D. 2011.
* Tricks of the 3D Game Programming Gurus. Chapter 16: Optimization Techniques. 2003.

### C/C++

* Game Programming Golden Rules. Chapter 1: Embracing C++. 2004.
* Game Programming Gems 1. Chapter 1.4: Using the STL in Game Programming. 2000.
* Game Programming Gems 2. Chapter 1.2: Inline Functions Versus Macros. 2001.
* Game Programming Gems 2. Chapter 1.4: Exporting C++ Classes from DLLs. 2001.
* Game Programming Gems 2. Chapter 1.9: Adding Deprecation Facilities to C++. 2001
* Game Programming Gems 3. Chapter 1.3: Finding Redeeming Value in C-Style Macros. 2002.
* Game Programming Gems 4. Chapter 1.7: The Beauty of Weak References and Null Objects. 2004.
* **Game Engine Architecture, 3rd Ed. Chapter 3: Fundamentals of Software Engineering for Games. 2018**.
* Game Engine Gems 2. Chapter 24: Bit Hacks for Games. 2011.
* Game Engine Gems 2. Chapter 25: Introspection for C++ Game Engines. 2011.
* Game Engine Gems 3. Chapter 13: Generic, Lightweight, and Fast Delegates in C++. 2016.

### Assembly

* Game Programming Gems 2. Chapter 1.13: Stack Winding. 2001.
* Game Programming Gems 2. Chapter 1.14: Self-Modifying Code. 2001.
* Modern X86 Assembly Language Programming, 2nd Ed. 2014.

### OOP

* Game Programming Gems 1. Chapter 1.1: Object-Oriented Programming and Design Techniques. 2000.
* Game Programming Gems 2. Chapter 1.3: Programming with Abstract Interfaces. 2001.
* Game Programming Gems 2. Chapter 1.7: A Property Class for Generic C++ Member Access. 2001.
* Game Development Tools. Chapter 14: Object-Oriented Data. 2011.

### Project

* Game Programming Gems 2. Chapter 1.5: Protect Yourself from DLL Hell and Missing OS Functions. 2001.
* Game Programming Gems 4. Chapter 1.4: Designing and Maintaining Large Cross-Platform Libraries. 2004.
* Game Development Tools. Chapter 1: Taming the Beast: Managing Complexity in Game Build Pipelines. 2011.
* Game Development Tools. Chapter 4: Continuous Integration for Games. 2011.

### Designs / Patterns

* Game Programming Patterns. 2014.
* Game Programming Gems 1. Chapter 1.0: The Magic of Data-Driven Design. 2000.
* Game Programming Gems 1. Chapter 1.3: An Automated Singleton Utility. 2000.
* Game Programming Gems 1. Chapter 1.5: A Generic Function-Binding Interface. 2000.
* Game Programming Gems 3. Chapter 1.4: Platform-Independent, Function-Binding Code Generator. 2002.
* Game Programming Gems 3. Chapter 1.8: Autolists Design Pattern. 2002.
* Game Programming Gems 3. Chapter 1.10: Programming a Game Design-Compliant Engine Using UML. 2002.
* Game Programming Gems 3. Chapter 1.16: Journaling Services. 2002.
* Game Programming Gems 7. Chapter 1.8: Deferred Function Call Invocation System. 2008.
* Game Programming Gems 8. Chapter 4.2: Registered Variable. 2010.
* Game Engine Gems 1. Chapter 23: Dynamic Code Execution Hierarchies. 2010.
* Game Engine Gems 1. Chapter 26: The Game State Observer Pattern. 2010.
* Game Development Tools. Chapter 13: Low Coupling Command System. 2011.
* Graphics Programming Methods. Chapter 2.11: A Framework for Rapid 3D Level Design Using MAXScript™ Code Generation. 2003.

### Software Engineering

* **Game Coding Complete, 4th Ed. Part IV: Professional Game Production. 2012**.
* Cross-Platform Game Programming. Chapter 11: The Bits We Forget About. 2005.
* **Game Engine Architecture, 3rd Ed. Chapter 3: Fundamentals of Software Engineering for Games. 2018**.

### Security

* Game Programming Gems 6. Chapter 1.8: Fingerprinting Pre-Release Builds To Deter and Detect Piracy. 2006.

### QA

* Game Programming Gems 8. Chapter 4.8: Code Coverage for QA. 2010.

### Tool

* Game Development Tools. Chapter 6: Real-Time Tool Communication. 2011.
* Game Development Tools. Chapter 22: FBX Games Development Tools. 2011.
* Designing the User Experience of Game Development Tools. 2015.
* ShaderX3. Section VII: Tools. 2004.
* ShaderX4. Section VIII: Tools. 2006.
* ShaderX6. Chapter 8.2: 3D Engine Tools with C++CLI. 2008.

### Version Control

* Game Development Tools. Chapter 15: Improving Remote Perforce Usage. 2011.