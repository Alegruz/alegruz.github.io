# 게임 그래픽스 프로그래밍 (2023.03.09)
[Home](/)

경희대학교 소프트웨어융합학과의 3학년 과목 게임 그래픽 프로그래밍의 온라인 사이트입니다.

# 1. 개요

## 1.1. 대상자

* C++ 프로그래밍이 가능한 학생 (객체지향프로그래밍 교과목 수강자)
* 자료구조에 대한 지식이 있는 학생 (자료구조 교과목 수강자)
* 컴퓨터 하드웨어와 운영체제에 대한 지식이 있는 학생 (컴퓨터구조/운영체제 교과목 수강자)
* 선형대수 지식이 있는 학생 (선형대수 교과목 수강자)
* 미분적분학 지식이 있는 학생 (미분적분학 교과목 수강자)

### 간단하게 판단하는 방법

다음 중 질문 중 하나라도 정답을 맞출 수 없다면, 매우 힘든 과목이 될 것임.

1. C++

```cpp
void SetValues(int* pA, int* pB)
{
    *pA = 5;
    *pB = 3;
}

void SetValues(int* pA, int* pB)
{
    *pA = 10;
    *pB = nullptr;
}

int main(void)
{
    int nA = 1;
    int nB = 0;

    // 1: nA, nB의 값은?

    SetValues(&nA, &nB);

    // 2: nA, nB의 값은?

    SetValues(&nA, &nB);

    // 3: nA, nB의 값은?

    int* pA = &nA;
    int* pB = &nB;

    SetValues(pA, pB);

    // 4: pA, pB가 각각 가리키는 값은?

    return 0;
}
```

2. 자료구조

* 배열이란 무엇인가?
* 트리란 무엇인가?
* 해시맵이란 무엇인가?

3. 컴퓨터 구조 / 운영체제

* CPU란 무엇인가?
* GPU란 무엇인가?
* 메모리 계층 구조를 설명하시오 (각 메모리의 성능 등을 중심으로)

4. 수학

* 내적이란?
* 외적이란?
* 선형변환이란?
* 다변수 미분 적분이란?

## 1.2. 목적

1. 컴퓨터 그래픽스라는 방대한 분야 중에서도 게임 그래픽스에 유의미한 실시간 그래픽스 분야에 대한 이론적 이해
2. 그래픽스 API를 활용한 실시간 그래픽스에 대한 실무적 이해 (DirectX 12, Vulkan, Metal 등)

이 수업을 수강한 학생은 DirectX 12와 같은 modern Graphics API를 통한 간단한 렌더러 개발을 할 수 있음.

**주의사항**

* 이 강의에서 말하는 이론이란 연구에서의 이론이 아닌, 실무에서의 이론을 의미합니다!!
    * 즉, 실시간이 아닌 기술이거나, 실무에서 사용하지 않는 연구에서의 이론은 다루지 않으며, 동일한 내용이더라도 실무에 입각하여 이론을 가르칩니다.
* 기본적으로 렌더러는 어느 정도의 상호작용이 필요하기에 UI 프로그래밍 또한 다루고 있음!!
* 권장하는 환경:
    * OS: Windows 10 이상
    * CPU: Intel 옥타코어 이상
    * GPU: NVIDIA RTX 그래픽 카드
    * RAM: 16 GB 이상
    * IDE: Visual Studio 2022
    * Graphics API: DirectX 12
* 만약 Vulkan을 사용하여 리눅스/안드로이드 개발을 하려고 하거나, MacOS를 사용하는 학생의 경우에는 조교진의 지원을 받기가 어려울 수도 있습니다.

## 1.3. 수업 진행 방식

매주 두 번의 강의가 있으며, 하루는 이론 수업, 나머지 하루는 실습 수업을 진행합니다.

이론 수업에서는 주어진 PDF 자료를 바탕으로 수업을 진행하며, 수업 자료는 **전부 영어로 되어있으니** 참고 바랍니다.

이론 수업의 평가는 **기말고사로만 진행**하며, 문제는 전부 **영어로 출제**가 됩니다.

실습 수업에서는 수업에서 제공하는 기본적인 렌더러를 바탕으로 조교가 수업을 진행합니다. 이 수업은 그래픽스 API에 대한 세부적인 내용은 최대한 피하려고 하나, 대부분의 modern 그래픽스 API에서 공통적으로 제공하는 개념들은 실습에서 가르치도록 합니다.

**매주 실습 과제**가 있으나, 수업 시간에 배운 내용 그대로 제출하기에 실습 시간에는 실습을 잘 따라오시면 됩니다.

이 수업에서는 1인 이상이서 프로젝트를 진행하게 됩니다. 프로젝트의 주제나 내용은 실시간 그래픽스라는 큰 틀에서 자유롭게 정하여 진행합니다. 주제를 정하기 어려운 학생들을 위하여 추천 주제들을 제공하오니, 참고하시면 됩니다. 당연히 인원 수는 평가할 때 고려합니다.

프로젝트의 의의는

1. 실제 그래픽스 기술을 하나 정하여 개발을 함
2. GPU 프로그래밍에 익숙해짐
3. C++ 프로그래밍에 익숙해짐

입니다. 그러므로 프로젝트가 잘 안 되어 실패하더라도, 의의와 평가 기준을 바탕으로 평가를 할 것이오니 큰 걱정 마시고 하고 싶은 주제를 고르시는 것을 추천합니다.

프로젝트의 경우 몇 가지 규칙이 있습니다:

1. 반드시 **실시간**이어야 할 것
2. **상호작용**이 가능해야 할 것 (실습 시간에 다룹니다)
3. 재미 요소보다는 기술적 요소에 집중할 것 (화려한 모델을 사용하는 것보다는 기술에 좀 더 집중)
4. 수업에서 다룬 주제 하나를 선택하여 발전시킬 것 (수업에서는 간단한 개념을 공부하기에, 이보다 발전된 기술은 금방 찾아서 구현할 수 있음)

프로젝트 평가 기준입니다:

1. 성능 
2. 품질
3. 실무성
4. 독창성

네 가지를 전부 종합적으로 평가하기 때문에 가령 실패했다 하더라도 다른 평가 기준에서 좋은 점수를 받아 전체적으로 좋은 점수를 받을 수 있습니다. 단, 최종 발표는 반드시 **실행이 가능한 데모**인 상태여야 합니다. 본인의 게임의 테크 데모를 실제로 공개한다는 생각으로 가장 멋있게 보여주세요.

프로젝트로 추천하는 몇 가지 주제입니다:

1. Shading
   1. Anti-Aliasing
   2. Transparency, Alpha, Blending
2. Shadow Mapping
   1. PCF
   2. PCSS
   3. FSM
   4. IZB
3. Direct Illumination
   1. Area Light
   2. Irradiance Environment Mapping
4. Indirect Illumination
   1. Ambient Occlusion
      1. SSAO
   2. VPL
   3. Voxel Cone Tracing
   4. SSR
5. Volumetric Rendering
6. Acceleration Algorithms
   1. Culling
   2. Level of Detail
   3. Terrain Rendering
7. Efficient Shading
   1. Deferred Rendering
   2. Clustered Rendering
   3. Decal Rendering
   4. Tiled Shading
   5. Clustered Shading
   6. Deferred Texturing
8. VR/AR Rendering
9. Water Rendering
10. Physically Based Rendering
   1.  Microfacet Rendering
   2.  Global Illumination
       1.  ReSTIR
       2.  DDGI
       3.  Surfelization
11. Computer Animation
    1.  IK
    2.  Fluid Animation
12. Engine Stuffs!
    1.  Cross-Platform Renderer (수업 제공 렌더러를 사용하지 않을 경우)
    2.  Bindless Rendering Pipeline
    3.  Render Graphs
13. Game
    1.  Voxel Games (Minecraft!)
    2.  Simple FPS

## 강의 목록

|주차|이론|내용|실습|내용|
|----|----|---|---|----|
|1|Introduction to Game Graphics|그래픽스의 개념, 의의와 역사|Introduction to Win32|Win32 데스크탑 프로그래밍의 개념|
|2|Introduction to Rendering Pipelines: Rasterization and Ray Tracing|렌더링의 개요|Introduction to Modern Graphics API|DirectX 12, Vulkan, Metal 등의 모던 그래픽스 API의 개념|
|3|Geometry of Graphics|메쉬, 좌표계, 벡터, 행렬 등|Buffers|버퍼의 개념|
|4|The Graphics Pipeline: Vertex Processing|아핀변환|Vertex Shading|정점 셰이딩|
|5|The Graphics Pipeline: Fragment Processing|퐁 셰이딩|Pixel Shading|픽셀 셰이딩|
|6|Texturing|텍스처 매핑(bump mapping 등)|SRVs|텍스처 적용법|
|7|Shading Basics (for fun!)|툰 셰이딩 등|Shading Basics|Gooch Shading, Cel Shading 등|
|8|Shadows|그림자|UAVs and Render Passes|렌더 패스의 개념|
|9|Introduction to Physically Based Rendering|빛, 색, BRDF|Material System|머테리얼 시스템|
|10|Direct Illumination|직접광|CBVs|리소스 관리|
|11|Indirect Illumination|간접광|Baking|베이킹|
|12|Introduction to Path Tracing|몬테 카를로 적분법|DirectX Raytracing|DXR 실습|
|13|Light Transport|샘플링|DirectX Raytracing|DXR 실습|
|14|Final Project Check|최종 프로젝트 점검|

1. Linear Algebra
   * Cross Product
   * Dot Product
   * Transformation Matrix
   * Orthonormal Bases
   * Intersection Calculations
2. RenderDoc / PIX, etc.
3. Graphics Pipeline
4. Graphics API
5. Dependency to a Minimum
   * Only `glfw` or image loaders, etc.
6. Beginner's Project
   1. Blinn-Phong Shading
   2. Bare-bones Minecraft Renderer
   3. Directional Lights, Point Lights, and Spotlights
   4. Heightmap Rendering
7. More Projects
   1. Reflection Rendering using Cubemaps
   2. Shadow Rendering with Shadow Maps
   3. View Frustum Culling
   4. Particle Systems
   5. Cloth Simulation

1. Shadertoy (for instant feedback)
   * Pixel shaders
   * UV coordinates
   * Texturing
2. Game Engine
   * Unity
3. bgfx
4. Custom Graphics Engine

1. Software Rasterization and Raytracing
2. Math
   * Dot Product
   * Cross Product
   * Spherical Coordinates
   * Transformation Matrix (4x4)
   * Rotation Matrix, Scaling Matrix, Translation Matrix, Homogeneous Coordinates, Quaternions
   * Orthonormal Basis Matrix
   * Intersection Calculations
   * Column-major Order / Row-major Order
   * Camera Modeling
3. First Triangle
4. Beginner's Project
   * Make a sphere mesh using spherical coordinates, and render it
   * Simple diffuse/specular shading
   * Directional lights, point lights, spot lights
   * Heightmap rendering
   * Simple parser for a simple mesh format, import it into your program and render it
       * Try and import and render meshes with textures
   * Implement a simple minecraft renderer
   * Reflections with cubemaps
   * Shadow rendering with shadow maps
   * View frustum culling
   * Particle system rendering
   * Gamma correction
   * Normal mapping
   * Instanced rendering
   * Animate meshes with mesh skinning
5. Advanced Project
   * Various post-processing effects
       * Bloom (Gaussian blur)
       * SSAO
       * FXAA
   * Deferred shading


1. What do Graphics Programmers do
2. What is GPU
3. Tools?
4. Graphics API?
5. Rasterization and Raytracing?

1. C++
2. Surface Geometry
3. A Model of Light
4. The Rendering Equation
5. Version Control Basics
6. A Camera Model
7. Ray Casting
8. Direct Illumination
9. Materials
10. Rendering Algorithms
11. Numerical Caculus
12. Path Tracing
13. Ray Marching
14. Parallel Architecture
15. The Eye

1. Math
   * Vectors and Scalars
   * Dot Products
   * Scalars Multiplying with Vectors
   * Matrices
2. Graphics API
3. Memory
4. Buffers
5. Optimization

1. HLSL
2. Render to Texture
3. Texturing
4. Lighting
5. Blinn-Phong
6. Fresnel Factor
7. Rim Lighting
8. Cel Shading
9. Normal Mapping
10. Deferred Rendering
11. Fog
12. Blur
13. Bloom
14. SSAO
15. Motion Blur
16. Chromatic Aberration
17. Screen Space Reflection
18. Screen Space Refraction
19. Foam
20. Flow Mapping
21. Outlining
22. Depth of Field
23. Posterization
24. Pixelization
25. Sharpen
26. Dilation
27. Film Grain
28. Lookup Table (LUT)
29. Gamma Correction