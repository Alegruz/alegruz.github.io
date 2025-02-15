---
layout: post
title:  전역 조명 공부 노트
date:   2022-03-13 00:00:00 +0000
categories: graphics
lang: "ko"
---

이 노트는 NVIDIA에서 제공한 광선 추적법 입문 시리즈인 [Ray Tracing Essentials](https://www.youtube.com/playlist?list=PL5B692fm6--sgm8Uiava0IIvUojjFOCSR)를 한국어로 정리/요약한 노트입니다. 광선 추적법을 공부하시는 분들을 위해 남깁니다.

웬만하면 컴퓨터 그래픽스 입문 강의는 들은 학생들이 들어볼 것을 권합니다.

# 1부: 광선 추적법 기초

![Ray](/assets/images/RayTracingEssentials/Ray.jpeg)

**광선Ray**이란 어떠한 원점origin과 방향direction을 갖는 것이다.

![RayCasting](/assets/images/RayTracingEssentials/RayCasting.jpeg)

**광선 투사법Ray Casting**이란 이러한 광선을 정해진 방향으로 쏘아 어떤 물체와 충돌하게 만드는 것이다.

![RayCastingBetweenTwoPoints](/assets/images/RayTracingEssentials/RayCastingBetweenTwoPoints.jpeg)

광선 투사법은 두 점에 대해서도 사용해주어 두 점 사이에 무언가가 가로막고 있는지 확인해줄 수 있다.

![RayCastingBetweenTwoSurfaces](/assets/images/RayTracingEssentials/RayCastingBetweenTwoSurfaces.jpeg)

이 방법을 사용하는 대표적인 예시는 A에서부터 빛이 나간다고 할 때, 중간에 무언가가 막고 있어 B 표면에 그림자가 졌는지, 아니면 제대로 빛이 전달되는지 여부 등을 확인해줄 수 있다.

<p><a href="https://commons.wikimedia.org/wiki/File:Ray_trace_diagram.svg#/media/File:Ray_trace_diagram.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ray_trace_diagram.svg/1200px-Ray_trace_diagram.svg.png" alt="Ray trace diagram.svg"></a><br>By <a href="//commons.wikimedia.org/wiki/User:Henrik" title="User:Henrik">Henrik</a> - <span class="int-own-work" lang="en">Own work&</span>, <a href="https://creativecommons.org/licenses/by-sa/4.0" title="Creative Commons Attribution-Share Alike 4.0">CC BY-SA 4.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=3869326">Link</a></p>

광선 투사법을 사용해서 이미지를 생성해줄 수도 있다. 카메라 앞에 모니터를 두었다고 가정했을 때, 모니터의 각 픽셀마다 카메라에서 광선이 쏘아진다고 하자. 이때 모니터에서 출력할 3D 공간에서 어떤 한 물체와 충돌을 하게 될 것이다. 이 충돌 지점에서 빛으로 또다른 광선을 투사시켜 그림자가 져있는지, 아닌지를 확인하는 방식으로 색을 계산할 수 있다. 이것이 바로 **광선 추적법Ray Tracing**이다.

## 고전적인 광선 추적법

![ClassicalRayTracing](/assets/images/RayTracingEssentials/ClassicalRayTracing.jpeg)

고전적인 광선 추적법을 예시로 이해해보자:

1. 카메라에서 광선을 쐈는데, 유리에 부딪힘
2. 광원에 *그림자 광선shadow ray*을 투사시켜 해당 지점이 빛에 직접 닿는 부분인지 아닌지를 판별함
3. 유리라는 물리적 특성에 따라 굴절 광선과 반사 광선 두 가지를 새롭게 쏨
4. 반사 광선은 잠시 무시하고, 굴절 광선을 보니 또다시 유리와 충돌을 함. 2번과 3번 반복을 함. 이번엔 굴절 광선 무시.
5. 반사 광선이 어떤 매끈하지 않은, 빛이 난반사되는 특징을 갖는(diffuse) 박스와 만남. 2번을 적용해보니 중간에 물체가 있어 그림자가 진 곳임을 알 수 있음.

이 모든 과정을 통해 결과적으로 이 광선이 쏘아진 픽셀에 해당하는 색을 구할 수 있게 된다.

요약해보자.

픽셀마다:
* 눈에서 장면으로 광선을 쏜다
* 충돌 지점, 즉 교차점에서 광원으로 광선을 쏜다: 그림자
* 각 굴절과 반사마다 새 색광선을 쏜다

## 쿡 확률적 (분포) 광선 추적법

충돌한 표면이 거울이 아닐 수도 있다. 즉, 반사 광선이나 그림자 광선이 하나가 아니라 여러 개가 나올 수 있다.

![StochasticRayTracing](/assets/images/RayTracingEssentials/StochasticRayTracing.jpeg)

예시를 들어보자. 여기서는 태양이 점광이 아니라, 영역광이다. 그림자에서 보이듯이 여러 방향으로 광선을 쏘는 것이다.

## 카지야식 산란 상호반사

유명한 "렌더링 방정식"이 나온 논문.

지금까지는 거울이나 적당히 광택이 있는 물체들에 대해서만 나루었지만, 시멘트처럼 그런 특성이 없는 물체에 대해서는 광선이 모든 방향으로 반사가 될 것이다.

![KajiyaStyleDiffuseInterreflection](/assets/images/RayTracingEssentials/KajiyaStyleDiffuseInterreflection.jpeg)

위의 그림에서처럼, 한 픽셀 내부에서 여러 지점에서 시작하여 다양한 방향으로 광선이 반사된다. 이 광선이 하늘로 가버릴 수도, 광원과 충돌할 수도, 다른 물체와 충돌하여 그림자가 질 수도, 땅과 충돌할 수도 있는 것이다. 결과적으로 얻은 픽셀에서는 이 값들을 적당히 antialiasing하듯이 샘플링해서 최종 색을 구하면 되는 것이다. 이걸 여러 광선에 대해서 하다보면 상당히 현실적인 결과를 얻을 것이다.

이런 것처럼 한 광선이 출발해서 반사되고, 또다시 반사되는 식으로 경로를 추적하는 것을 *경로 추적path tracing*이라 부른다.

# 2부: 래스터화 vs 광선 추적법

래스터화 루프:

* 각 물체마다
    * 각 픽셀마다 (누구 픽셀이 더 가깝나?)

광선 추적법 루프:

* 각 픽셀마다
    * 각 물체마다 (누가 제일 가깝지?)

## 래스터화

![Rasterization0](/assets/images/RayTracingEssentials/Rasterization0.jpeg)

위처럼 화면에 세 개의 삼각형이 있다고 가정하자.

![Rasterization1](/assets/images/RayTracingEssentials/Rasterization1.jpeg)

첫번째로 빨간색 삼각형을 래스터화하면 위와 같이 픽셀에 색을 할당해줄 수 있다.

![Rasterization2](/assets/images/RayTracingEssentials/Rasterization2.jpeg)

두번째로 초록색 삼각형을 래스터화하면 위와 같이 픽셀에 색을 할당해줄 수 있다. 초록색 삼각형은 빨간색 삼각형보다 앞에 있으니 겹치는 픽셀의 경우 빨간색 위에 초록색이 덧씌워졌다.

![Rasterization3](/assets/images/RayTracingEssentials/Rasterization3.jpeg)

세번째로 파란색 삼각형을 래스터화하면 위와 같이 픽셀에 색을 할당해줄 수 있다. 파란색 삼각형은 빨간색 삼각형과 초록색 삼각형보다 뒤에 있으니 겹치는 픽셀의 경우 파란색이 무시된다.

이런 식으로 래스터화는 단순히 삼각형을 픽셀에 색을 할당하는 것뿐만 아니라 깊이 정보를 반영하여 작성해준다.

## 광선 추적법

![RayTracing](/assets/images/RayTracingEssentials/RayTracing.gif)

광선 추적법의 경우엔 반대로, 픽셀에서 광선을 쏴서 첫번째로 충돌하는 삼각형의 색을 그대로 출력해준다.

이 방법의 경우, 한 장면에 여러 물체가 있다면 어디에 물체가 충돌을 하는지 판별을 해주는 것이 매우 힘들 수 있다. 주먹구구식 알고리듬의 경우 다음과 같이 작성할 것이기 때문이다:

* 각 픽셀(광선)마다
    * 장면 안의 각 물체마다
        * 충돌했는가? 판정

알고리듬을 공부했거나 "시간 복잡도"라는 개념을 아는 독자라면 곧바로 이해하겠지만, 총 O(N<sup>2</sup>), 픽셀마다는 O(N)의 시간 복잡도를 갖는, 매우 비싼 연산이다. 이를 해결하기 위해 도입한 개념이 바로 **경계 부피 계층Bounding Box Hierarchy**이다. BVH로 줄여 부르기도 합니다.

![BoundingVolumeHierarchy](/assets/images/RayTracingEssentials/BoundingVolumeHierarchy.jpeg)

위의 그림처럼 가장 효율적인 자료구조가 무엇이느냐에 대한 승자로 BVH가 등장했다. 전체 장면을 좀 더 작은 원, 그리고 더 작은 원으로 나누기 시작해서, 결국엔 각 물체로 세분화된다. 이를 자료구조적으로 표현하면 트리다.

이렇게되면 광선이 어떠한 대집합에 충돌하면 그 내부 소집합으로 또다시 들어가서 어느 소집합과 충돌했는지 반복적으로 내려가 결국엔 어떤 물체와 충돌했는지를 판별할 수 있을 것이다. 결국 트리 구조의 잎노드까지 탐색하며 내려가는 과정을 의미하므로, 일반적으로 픽셀 당 시간 복잡도가 O(log N)이라고 볼 수 있다. 즉, 위에서 말한 O(N)보다는 빠르다는 것이다.

![BoundingBox](/assets/images/RayTracingEssentials/BoundingBox.jpeg)

실제 광선 추적법의 경우 위의 사진과 같이 경계 박스를 사용한다. 결국 박스를 계속 타고 내려가서 결과적으로 어떤 삼각형과 교차하는지, 충돌하는지를 확인한다.

![FakeNews](/assets/images/RayTracingEssentials/FakeNews.png)

지금까지 나온 수학적 근거만 보면, 어? 그럼 래스터화보다 광선 추적법이 더 빠르겠네?라고 생각할 수도 있지만, **사실이 아닙니다!**

래스터화에도 여러 다양한 방법을 통해 사실상 O(log N) 수준의 빠르기로 렌더링을 해줄 수 있다.

대표적으로는:
* 계층적 절두체 도태Hierarchical frustum culling(이 방법도 BVH 사용)
* 세밀도 도태와 단순화level-of-detail culling and simplification
* 여러 형태의 어클루전 도태occlusion culling
* 계층적 Z 버퍼

## 래스터화와 광선 추적법 비교

|핵심 개념|래스터화|광선 추적법|
|--------|-------|-----------|
|근본 질문|이 기하학적인 대상이 어떤 픽셀을 차지하는가?|이 광선에 따라 무엇이 보이는가?|
|핵심 작업|이 픽셀이 삼각형 안에 있는지 확인|광선-삼각형 교차 판별|
|스트리밍 방법|삼각형 스트리밍함(삼각형마다 픽셀 판별함)|광선 스트리밍(광선마다 교차 판별함)|
|비효율성|픽셀마다 여러 삼각형을 쉐이딩함(과도하게 그림)|광선마다 여러 번 교차 판별을 해야함|
|가속화 구조|(계층적) Z 버퍼링|경계 부피 계층|
|단점|만들기 힘든 비일관적인 탐색|메모리를 비일관적으로 탐색함|

핵심은 래스터화 vs 광선 추적법이 아니다. 래스터화는 단순히 빛이 하나 있다고 할 때, 그냥 단순히 장면을 바로 동일한 거리로 구분된 픽셀로 픽셀화해서 보고 싶을 땐 매우 효과적이다. 반면에 광선 추적법은 이보다 더 일반적인 방법으로, 임의의 두 점을 통해 그 사이에 무언가가 있는지를 판별해주는 것이다. 각자 장점이 있는 것이다. 래스터화를 통해 전체적인 장면을 그리고, 광선 추적법을 통해 삐까뻔쩍한 효과와 여러 조명 효과를 줄 수도 있다.

![RasterizationAndRayTracing](/assets/images/RayTracingEssentials/RasterizationAndRayTracing.jpeg)

# 3부: 광선 추적법 하드웨어

광선 추적법은 당연하게도 매우 병렬적인 연산을 요구한다. 각 픽셀마다 색을 연산할 것이고, 이 픽셀은 서로 독립적이므로 병렬적으로 연산할 것이다.

## 1987: AT&T 픽셀 기계

![At&tPixelMachine](/assets/images/RayTracingEssentials/At&tPixelMachine.jpeg)

첫 광선 추적법 전용 기계로, SIGGRAPH에 소개되었다. 위의 512×512 픽셀 크기의 사진에 7,381 개의 구와 평면을 30초만에 렌더링할 수 있었으며, 그 다음 해인 1988년에는 16초만에 렌더링할 수 있었다. 물론 매우 비쌌으며, 사실상 역사의 각주를 차지할 뿐이긴 하다.

단순히 첫 광선 추적법을 렌더링할 뿐만 아니라, 실제 실시간 광선 추적법을 제공해주기도 했다. 마우스로 공을 움직이는 방식 등이다.

## 무어의 법칙의 종말

![MooresLaw](https://dl.acm.org/cms/attachment/f9a4ecff-6e06-4ce8-8d62-eac45b52e602/f1.jpg)

NVIDIA, 구글 등지에서는 이미 무어의 법칙이 끝남음을 주장하고 있다. 이제는 좀 더 특화된 하드웨어를 설계하는 추세이다.

![PascalAndTuring](/assets/images/RayTracingEssentials/PascalAndTuring.jpeg)

전통적인 GPU(파스칼 포함)에서는 래스터화를 위한 특화된 작업을 했다면, 튜링부터는 인공지능과 광선 추적법을 위한 특화된 작업을 해주는 코어가 추가되었다. 이 코어가 각각 텐서 코어와 RT 코어이다.

## RT 코어

![BVH](/assets/images/RayTracingEssentials/BVH.jpeg)

RT 코어는 다음 두 가지 근본적인 작업을 한다:
* 광선-경계 부피 계층(BVH) 종단
    * 여러 박스에 광선을 쏘기
    * 박스 내의 삼각형에 광선을 쏘기 
* 광선-삼각형 교차
    * 어떤 박스/삼각형과 교차하는지 확인하기

이때 한 삼각형이 여러 박스에 속해있을 수도 있기 때문에 인스턴싱을 지원한다.

여기에 다른 스트리이밍 다중프로세서, 즉 셰이더 코어가 여러 작업 해준다:
* 다단계 인스턴싱
* 커스텀 교차
* 쉐이딩

## 메모리

![GpuMemory](/assets/images/RayTracingEssentials/GpuMemory.jpeg)

과거에는 몇 MB 수준이었으나, 이제는 512 GB 수준이나 발전했다. 영화의 경우 복잡한 장면에서는 약 50 GB 혹은 그보다 조금 더 정도 사용한다. 이처럼 광선 추적법을 사용하려면 모든, 혹은 거의 대부분의 데이터가 있어야 한다. 필요할 땐 데이터 교환도 해야할테고. 결국 광선 추적법에 필요한 정보를 저장하는 것이 중요하다.

![MetroExodusOneFrame](/assets/images/RayTracingEssentials/MetroExodusOneFrame.jpeg)

기존 아키텍처에서 광선 추적법을 했을 때 걸린 시간, 현재 아키텍처에서 RT 코어를 사용하지 않고 광선 추적법을 했을 때의 걸린 시간, RT 코어를 사용했을 때 걸린 시간 등을 보여주는 사진이다.

![BattlefieldV](/assets/images/RayTracingEssentials/BattlefieldV.jpeg)

광선 추적법에 특화된 하드웨어가 중요할 뿐만 아니라, 해당 하드웨어, 소프트웨어를 앞으로 튜닝해가면 더욱 더 빨라지기 시작할 것이다.

![NVIDIARealTimeRayTracing](/assets/images/RayTracingEssentials/NVIDIARealTimeRayTracing.jpeg)

NVIDIA는 마이크로소프트의 DXR 발표에 맞추어 4 개의 수냉식 볼타 GPU(파스칼 구조)를 사용해서 위의 스타워즈 장면을 언리얼 엔진을 통해 실시간으로 렌더링했으나, 이는 몇 개월 뒤 튜링 구조가 나오자 오직 한 GPU만으로도 가능하게 되었다. 과거 AT&T 픽셀 기계에서 했던 512×512 화면에서 약 8,000 개의 구를 30 fps에 출력했던 시절에서, 이제는 튜링 GPU로는 8,000,000 개의 구를 60 fps에 문제 없이 출력할 수 있다.

# 4부: 광선 추적법 파이프라인

## 래스터화와 광선추적법

래스터화와 광선 추적법은 둘 다 병렬성을 띤다.

![RasterizationAndRayTracingPipeline](/assets/images/RayTracingEssentials/RasterizationAndRayTracingPipeline.jpeg)

래스터화의 경우 매우 단순하다. 화면에 삼각형을 그려주려면 그냥 정점 쉐이딩, 픽셀 쉐이딩해주기만 하면 된다.

광선 추적법도 유사하다. 우선 광선을 쏘고, 환경을 종단하고, 최종적으로 쉐이딩을 해준다. 여기서 다른 점이라면 중간에 그림자 광선, 반사 광선처럼 추가적인 광선을 더 쏴줘서 재귀를 해줄 수 있다는 것이다.

![RTXRayTracingPipeline](/assets/images/RayTracingEssentials/RTXRayTracingPipeline.jpeg)

이때 중간 과정을 NVIDIA RTX에서 처리해준다.

## 광선 추적법 셰이더

DXR과 Vulkan에서는 광선 추적법을 위해 다섯 가지의 새로운 셰이더를 추가했다.

1. 광선 생성 셰이더 ray generation shader
    * 광선을 어떻게 추적하기 시작할 것인가?
    * 일종의 관리자로, 광선을 쏘고, 이 광선을 쭉 따라가서 최종 값이 얼마가 나오는지까지 확인한다.
    * 다른 셰이더를 제어한다!
2. 교차 셰이더 intersection shader
    * 광선이 기하학적인 대상과 어떻게 교차하는가? (무엇이 교차인가?)
    * 기하학적인 대상이 무엇인가에 따라 달라질 것이다.
    * 물체의 모양을 정의한다! (한 유형 당 한 셰이더)
    * 이하 세 가지 셰이더는 한 세트으로 보면 된다.
        * 광선 당 어떤 식으로 행동하는지를 제어한다! (여러 유형에 대해서 한 행동을 적용해줄 수도)
3. 빗나감 셰이더 miss shader
    * 광선이 기하학적인 대상에 맞지 않으면, 즉 빗나갔을 때 어떻게 셰이딩할 것인지?
4. 최근접 충돌 셰이더 closest-hit shader
    * 교차점을 어떻게 셰이딩할 것인지?
    * 물론 단순히 셰이딩이 아니라 추적인 광선을 생성해줄 수도 있을 것이다.
5. 임의 충돌 셰이더 any-hit shader
    * 교차 충돌한 지점마다 한 번 실행한다(투명성 등을 위한 작업)

![ShadersComplicated](/assets/images/RayTracingEssentials/ShadersComplicated.jpeg)

위의 셰이더를 총합하면 위와 같이 복잡하게 되어있는데, 이걸 단순화해줄 수 있다.

![ShadersSimplified](/assets/images/RayTracingEssentials/ShadersSimplified.jpeg)

우선 `TraceRay()`로 광선을 생성한다. 

생성한 광선은 가속화 단계를 거치는데, 이 단계에서는 BVH를 따라 충돌했을 수도 있는 부분을 찾아낸다. 여기에 교차 셰이더를 적용해서 충돌을 했는지를 판별한다. 만약 최근접 충돌이라면 해당 정보를 저장한다. 만약 추가적으로 임의 충돌 셰이더를 파이프라인에 제공했다면, 충돌한 지점이 투명한 곳이어서 광선이 충돌하지 않고 계속 직진해야하는지 등의 여부를 판단해준다.

결국 가속화 단계는 끝이 날텐데, 그러면 충돌을 했든, 충돌을 하지 못했든 두 가지로 결과가 나올 것이다.

![AnyHitShader](/assets/images/RayTracingEssentials/AnyHitShader.jpeg)

임의 충돌 셰이더의 경우 필수가 아닌 선택이며, 주로 투명성을 처리할 때 사용한다. 만약 삼각형 자체에 충돌을 한 것은 맞지만, 해당 부분의 텍스처가 투명했다면 충돌하지 않은 것으로 간주해야한다. 이때 임의 충돌 셰이더를 사용하는 것이다.

## 광선 추적법 기술

* 반사 Reflectino
    * ![Battlefield V](https://cdn.vox-cdn.com/thumbor/PaQUFOzhRiozP_SBAmlZOTClACI=/1400x1050/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/12542925/PdFmShm.jpg)
* 전역 조명 Global Illumination
    * ![Metro Exodus](https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/news/metro-exodus-nvidia-rtx-ray-tracing/metro-exodus-nvidia-rtx-ray-tracing-screenshot-001-on-850px.png)
* 그림자 Shadow
    * ![Shadow of the Tomb Rader](https://gh.cdn.sewest.net/assets/ident/news/shadow-tomb-raider-adds-raytraced-shadows-dlss/en_US/45_RTX_On.jpg?quality=65&width=100%25&height=100%25)

실시간 / 인터랙티브 / 가속 광선 추적법은 이외에도 여러 분야에 사용할 수 있다:

1. 실제 현실과 같은 렌더링
2. 더 빠른 베이킹
    * 오프라인 프로세스임
    * 라이트맵을 좀 더 빠르게 만들기
3. 기타 다른 방법으로 사용(남용)
    * 충돌 탐지
    * 부피 렌더링 등
    * 여러 새로운 연구 분야가 탄생하는 쪽임

# 5부: 광선 추적법 효과

## 그림자

![CornellBox](/assets/images/RayTracingEssentials/CornellBox.jpeg)

왼쪽이 실제 사진, 오른쪽이 광선 추적법으로 렌더링한 사진.

![HardShadows](/assets/images/RayTracingEssentials/HardShadows.jpeg)

우선 영역광 말고, 단순한 점광부터 적용해본다. 이러면 매우 날카로운 그림자가 질 것이다.

![SoftShadows](/assets/images/RayTracingEssentials/SoftShadows.jpeg)

영역광의 경우 조명의 여러 점에 대해서 샘플링을 진행하게 된다. 약간 광선 추적법과 유사한 것이, 한 지점으로 영역광의 여러 영역에서 광선이 쏘아질텐데, 이때 몇 퍼센트 정도가 해당 지점에 영향을 주는지를 통해 그림자의 정도를 구한다. 모든 영역에서 해당 지점에 빛이 가지 못한다면 완전히 어두운 그림자(본영umbra)일 것이고, 위의 그림처럼 일부는 가려져있는데, 또 일부는 빛이 들어온다면 부드러운 그림자(반음영penumbra)일 것이다.

![GlobalIllumination](/assets/images/RayTracingEssentials/GlobalIllumination.jpeg)

이러한 빛은 다만 조명에 의해 직접적으로 닿는 부분을 의미하는 것이다. 현실에서는 빛이 여기 저기에 반사되어 간접적으로 조명 효과를 줄 수도 있다. 이러한 간접광을 보통 *상호반사interreflection*, *간접광indirect lighting*, *색출혈color bleeding*, *전역 조명global illumination*이라 부른다.

위의 예시의 경우, 모든 표면이 산란된 표면이다. 즉 반짝 반짝 광택이 있는 표면이 아니라는 것이다.

![GlossyReflection](/assets/images/RayTracingEssentials/GlossyReflection.jpeg)

광택이 있는 표면의 경우 여러 개의 반사광이 생길 수 있다.

![GlossinessComparison](/assets/images/RayTracingEssentials/GlossinessComparison.jpeg)

광택의 정도는 조절이 가능하다.

![ExampleScene](/assets/images/RayTracingEssentials/ExampleScene.jpeg)

위의 장면에서처럼, 만약 단순히 상호반사광이 없었다면, 이 건물 내부에는 햇빛이 들지 않으니 완전히 어둡게 그려져야 정상이다. 그러나 빛이 여기저기 반사가 되니 좀 더 현실적으로 장면이 보이는 것이다.

## 앰비언트 어클루전

광선 추적법을 통해 물리적인 사실에 기반한 것은 아니지만, 물리적으로 충분히 믿을만한, 납득할만한 효과를 하나 더 줄 수 있다. 바로 앰비언트 어클루전ambient occlusion이다.

![AmbientOcclusionNoLight](/assets/images/RayTracingEssentials/AmbientOcclusionNoLight.jpeg)

위 그림에서는 딱히 광원이 아무것도 없는 상태이다. 이때 모든 지점에서 광선을 쏘아 이 지점이 틈 사이에 있는지, 가려져있는지 등을 확인해줄 수 있다.

![AmbientOcclusion](/assets/images/RayTracingEssentials/AmbientOcclusion.jpeg)

어떤 한 지점에서 어느 거리까지 광선을 쏘았을 때, 이 광선이 중간에 충돌이 일어나고, 이러한 광선이 적당히 있다면, 이 지점은 적당히 어두울 것이라고 가정을 할 수 있을 것이다.

이 방법은 보통 래스터화 기반 게임에서 자주 사용한 기법이지만, 이제는 광선 추적법을 통해서 더 나은 해법을 찾을 수 있게 되었다.

## 심도

![DoFBackgroundBlur](/assets/images/RayTracingEssentials/DoFBackgroundBlur.jpeg)

이뿐만 아니라 광선 추적법을 통해 심도 표현과 블러 효과를 줄 수 있다.

![DoFForgroundBlur](/assets/images/RayTracingEssentials/DoFForgroundBlur.jpeg)

블러는 배경이나 전경에 둘 다 적용해줄 수 있다.

이 기법을 통해 좀 더 시네마틱한 효과를 줄 수 있다.

## 모션 블러

![MotionBlur](/assets/images/RayTracingEssentials/MotionBlur.jpeg)

샘플링을 할 때, 아예 한 픽셀 당 여러 시간에 대응하는 모델의 모습을 주고, 이를 통해 광선 추적법을 적용하면 *모션 블러Motion Blur* 효과를 얻을 수 있다.

## 대기 효과

![AtmosphericEffects](/assets/images/RayTracingEssentials/AtmosphericEffects.jpeg)

대표적인 *대기 효과atmospheric effect*로는 *광선 행진ray marching*이 있다. 광선 행진이란, 어떤 광선이 한 줄기의 빛과 만나면 그 내부를 계속 행진해서 들어가 빛이 안으로 산란되는지, 밖으로 산란되는지 등을 확인해면서 지속적으로 샘플링을 한다. 이를 통해 위의 사진처럼 한 줄기 빛이 들어오는 효과를 찾아볼 수 있다.

## 가성

![Caustics](/assets/images/RayTracingEssentials/Caustics.jpeg)

*가성caustic*이란 물과 관련된 빛의 성질로, 위의 그림처럼 물과 같이 투명한 물질에 빛이 닿아 반사될 때의 모습이다.

![CausticsOnTheGround](/assets/images/RayTracingEssentials/CausticsOnTheGround.jpeg)

위의 사진처럼 바닥 위에 가성이 형성된 모습이다.

![CausticsPBR](/assets/images/RayTracingEssentials/CausticsPBR.jpeg)

# 6부: 렌더링 방정식

렌더링 방정식이라는게 렌더링하는 여러 방정식이라는 뜻이 아니다. 이름 자체가 렌더링 방정식이라는 어떤 한 방정식이 존재한다는 뜻이다.

![TheRenderingEquation](/assets/images/RayTracingEssentials/TheRenderingEquation.gif)

공식만 보고 겁 먹고 공부를 그만두지는 말도록 하자. 그래픽스 전공을 할 사람들이 살면서 이 방정식 하나만 갖고 결국 다 다루기 때문에 겁 먹지 말고 하나 하나 보도록 하자.

## 렌더링 방정식

![TheRenderingEquationExplained](/assets/images/RayTracingEssentials/TheRenderingEquationExplained.jpeg)

* ![TheRenderingEquationX](/assets/images/RayTracingEssentials/TheRenderingEquationX.gif)
    * 장면의 한 점을 의미한다.
* ![TheRenderingEquationOmegaHatSubO](/assets/images/RayTracingEssentials/TheRenderingEquationOmegaHatSubO.gif)
    * 나가는 방향이다. 여기서 O는 Out을 의미한다.
    * 즉, 눈으로 가는 방향이다.
* ![TheRenderingEquationOmegaHatSubI](/assets/images/RayTracingEssentials/TheRenderingEquationOmegaHatSubI.gif)
    * 들어오는 방향이다. 여기서 I는 In을 의미한다.
    * 다른 방향으로 들어오는 빛을 의미한다.
* ![TheRenderingEquationNHat](/assets/images/RayTracingEssentials/TheRenderingEquationNHat.gif)
    * 면 법선을 의미한다.
* ![TheRenderingEquationSSquared](/assets/images/RayTracingEssentials/TheRenderingEquationSSquared.gif)
    * 모든 방향에 대해서 빛을 평가하겠다는 의미이다.

![TheRenderingEquationByElement](/assets/images/RayTracingEssentials/TheRenderingEquationByElement.jpeg)


* ![TheRenderingEquationOutgoingLight](/assets/images/RayTracingEssentials/TheRenderingEquationOutgoingLight.gif)
    * 어떤 점이 있고, 나가는 방향이 있다고 할 때, 관찰자의 눈에는 어떤 빛이 보이냐는 의미.
    * 즉, 어떤 점을 내가 바라보고 있을 때, 거기에 어떤 빛이 오느냐는 의미이다.
* ![TheRenderingEquationEmittedLight](/assets/images/RayTracingEssentials/TheRenderingEquationEmittedLight.gif)
    * 어떤 점과 나가는 방향이 있을 때, 그 점에서 어떤 빛이 발원하고 있는지?
    * 만약 해당 지점이 광원에 속해있다면, 우항은 고려하지 않아도 된다.
* ![TheRenderingEquationIncomingLight](/assets/images/RayTracingEssentials/TheRenderingEquationIncomingLight.gif)
    * 어떤 점이 있고, 어떤 임의의 방향이 있을 때, 그 방향으로 어떤 빛이 오는지를 의미한다.
* ![TheRenderingEquationMaterial](/assets/images/RayTracingEssentials/TheRenderingEquationMaterial.gif)
    * 들어오고 나가는 방향이 있을 때, 어떤 빛이 나가는 방향으로 가는지를 의미한다.
    * 거울의 경우 들어오는 방향과 나가는 방향에 명백한 관계가 존재한다. 기타 다른 물질에도 이에 해당하는 성능을 주면 된다.
* ![TheRenderingEquationLambertian](/assets/images/RayTracingEssentials/TheRenderingEquationLambertian.gif)
    * 이 항은 기하학적인 의미이다.
    * ![LambertsCosineLaw](/assets/images/RayTracingEssentials/LambertsCosineLaw.jpeg)
        * 빛이 표면 바로 위에 있으면, 즉 표면과의 각도가 90도일 때 제일 밝을 것이고, 빛이 갈수록 이동하여 각도가 0도까지 줄어들면 갈수록 빛이 어두워질 것이라는 의미이다.

## 순수 경로 추적

![PurePathTracing](/assets/images/RayTracingEssentials/PurePathTracing.jpeg)

즉, 순수한 경로 추적을 하게 되면, 모든 방향으로의 빛을 전부 더해주어 눈에 쏴주는 것이다.

![PurePathTracingExample](/assets/images/RayTracingEssentials/PurePathTracingExample.jpeg)

위와 같이 되는 것이다. 허나 위의 그림에서 보면 알겠지만, 빛이 어딘가에 부딪히고, 또다시 다른 곳으로 부딪히는 식으로 확장이 된다. 그렇기에 렌더링 방정식은 "재귀적"이다. 즉, 박스에 부딪혔다가 이번엔 원통에 부딪혔다면, 원통에서도 렌더링 방정식을 적용시켜주어야 박스에서 렌더링 방정식을 적용시킬 수 있다.

순수 경로 추적의 단점은 만약 하늘과 같이 매우 넓은 범위의 광원이 없이 점광 하나만 있는 환경이라면, 광선이 해당 빛에 다다르기까지 매우 오래 걸린다는 점이다.

## 중요도 샘플링

중요도 샘플링이란, 어떤 특정 방향 위주로 쏘는게 좀 더 의미있는 값을 얻을 수 있지 않을까?에 대한 질문에 의해 나온 개념이다.

중요도 샘플링을 적용하는 방법 중 하나는 그저 물리적인 요소만 고려하는 것이다. 즉, 재질항 ![TheRenderingEquationMaterial](/assets/images/RayTracingEssentials/TheRenderingEquationMaterial.gif)과 램버트항 ![TheRenderingEquationLambertian](/assets/images/RayTracingEssentials/TheRenderingEquationLambertian.gif)만을 고려하는 것이다. 이때 *양방향 산란 분포함수bidirectional scattering distribution function* 혹은 BSDF를 사용하여, 어떤 방향으로 빛이 들어올 때, 이것이 재질에 어떤 영향을 끼치는지를 고려해줄 수 있다. 예를 들어, 만약 재질이 검다면 나가는 빛이 없을 것이다.

![MirrorGlossyDiffuse](/assets/images/RayTracingEssentials/MirrorGlossyDiffuse.jpeg)

위의 그림처럼 재질의 특성에 따라 반사가 어떤 방향으로 되는지는 달라진다. 하지만 이런 식으로 여러 방향으로 광선을 쏘기 시작하면 연산 부담이 커지게 되므로, 이를 해결해야한다.

## 다중 중요도 샘플링 (MIS)

단순히 재질의 성질, 빛과 면이 이루는 각도 뿐만 아니라, 빛의 방향 또한 고려해서 샘플링을 하겠다는 것이다. 방 안에 중요한 빛이 존재할 것이다. 태양광 등. 즉 무작위로 광선을 쏘는 것이 아닌, 누가 봐도 중요한 지점에도 광선을 쏘겠다는 것이다.

![MultipleImportanceSampling](/assets/images/RayTracingEssentials/MultipleImportanceSampling.jpeg)

위의 사진처럼 광원 쪽으로도 광선을 쏘게 된다.

![MISComparison](/assets/images/RayTracingEssentials/MISComparison.jpeg)

위의 사진에서처럼 MIS의 성능을 보여주고 있다. 중간에 나오는 BRDF는 *양방향 반사 분포함수bidirectional reflectance distribution function*라는 것인데, BSDF와 유사하나, 유리가 아닌 불투명한 면에만 적용하는 함수이다.

# 7부: 광선 추적법에서의 디노이징

![NoiseInRayTracing](/assets/images/RayTracingEssentials/NoiseInRayTracing.jpeg)

광선 추적법을 사용하면 위와 같이 매우 노이즈가 심한 사진을 얻게 된다. 이는 픽셀 당 샘플링의 수를 늘리는 것으로 해결할 수 있긴 하다.

![Denoising](/assets/images/RayTracingEssentials/Denoising.jpeg)

위와 같이 디노이징 기법을 사용하면 충분히 노이즈를 지울 수 있는 장점이 있다. 분산이 샘플 수의 제곱근에 비례해서 줄어들으므로, 샘플을 하나 쓰는 것보다 네 개를 쓰는 것이 두 배나 더 좋을 것이다.

![RayTracingDenoising](/assets/images/RayTracingEssentials/RayTracingDenoising.jpeg)

결과적으로 노이즈가 있는 사진을 우선 얻은 뒤, 이걸 더 나은 사진으로 만들어 주어야 한다.

![Reconstruct](/assets/images/RayTracingEssentials/Reconstruct.jpeg)

이러한 과정을 바로 디노이징이라 부른다.

![DenoisingIdenticalTime](/assets/images/RayTracingEssentials/DenoisingIdenticalTime.jpeg)

이때 디노이징 기법에는 여러가지가 있는데, 보통은 상당히 빠른 속도로 처리가 된다. 디노이징은 간단히 표현하자면, 어떤 특정 영역 근방에 대해서 색 정보와 기타 정보(면 법선, 텍스처의 색 등)를 바탕으로 어떤 필터링 절차를 거쳐 빈 공간에 대한 정보를 채우는 것이다.

![DenoisingShadow](/assets/images/RayTracingEssentials/DenoisingShadow.jpeg)

디노이징을 단순히 최종 화면에 해주면 그림자와 같은 특성이 바닥의 색과 섞여서 결과를 망칠 수 때문에 그림자는 따로 디노이징을 해준다.

디노이징의 문제는, 이게 얘 따로 디노이즈해주고, 저거 따로해주고, 쌓이고 쌓이다보면 상당히 비싼 연산이 된다는 것이다. 즉, 결국 최종 화면에서만 디노이징을 해주어야 한다.

![DenoisingHumanVsNeuralNetwork](/assets/images/RayTracingEssentials/DenoisingHumanVsNeuralNetwork.jpeg)

위의 그림에서 보듯이, 사람이 직접 전통적인 디노이징 기법을 해주고 약간의 수정을 가한 버전과 신경망이 따로 디노이징을 해준 버전을 비교해서 보면, 오히려 신경망을 적용한 사진이 좀 더 나음을 볼 수 있다. 특히 뒤에 진녹색 커튼? 같은 것을 보면 사람이 한 버전은 그냥 직사각형처럼 보이는데, 신경망으로 처리한 사진에서는 그 수직적인 결이 제대로 살아있다.

![DenoisingTraining](/assets/images/RayTracingEssentials/DenoisingTraining.jpeg)

심화학습을 사용하여 디노이징을 해줄 수도 있다. 렌더링된 이미지 여러 개를 바탕으로 훈련시켜 디노이징을 구현하는 것이다.

![NoisyImage](/assets/images/RayTracingEssentials/NoisyImage.jpeg)

위와 같이 픽셀 당 샘플링(spp)이 1인 사진이 주어졌을 때, 디노이징을 적용하면 다음과 같아진다:

![DenoisedImage](/assets/images/RayTracingEssentials/DenoisedImage.jpeg)

상당히 현실적인 이미지가 나왔다.

![GroundTruthImage](/assets/images/RayTracingEssentials/GroundTruthImage.jpeg)

광선 추적법으로 제대로 렌더링한 이미지와 비교해도 상당히 유사함을 알 수 있다.

![LightMappingImage](/assets/images/RayTracingEssentials/LightMappingImage.jpeg)

래스터화에서의 경우 전통적으로 그림자 매핑을 사용하여 광원을 기준으로 렌더링을 해주었다. 그림자가 상당히 날카롭기에 광선 추적법을 사용해 얻은 부드러운 그림자보다는 좀 덜 이쁘다. 자세히 보면 그림자와 물체 사이에 공간이 있어 떠있는듯한 효과를 준다. 이것을 피터팬 효과Peter Panning이라 부른다.

또다른 예시를 보자:

![NoisyGlossyImage](/assets/images/RayTracingEssentials/NoisyGlossyImage.jpeg)

이번엔 광택이 있는 이미지들이다.

![DenoisedGlossyImage](/assets/images/RayTracingEssentials/DenoisedGlossyImage.jpeg)

디노이징 기법만 적용을 해줘도 상당히 훌륭한 사진이 나온다.

![GroundTruthGlossyImage](/assets/images/RayTracingEssentials/GroundTruthGlossyImage.jpeg)

이번엔 디노이징을 준 이미지와 실제 이미지와 약간 차이는 있으나, 그래도 대부분의 사람들에게는 충분히 납득할만한 결과가 나왔다고 볼 수 있다.

![StochasticScreenSpaceReflection](/assets/images/RayTracingEssentials/StochasticScreenSpaceReflection.jpeg)

위의 사진의 경우 보통 래스터화 기법에서 사용하는 방법인데, 여러 문제가 있다. 물론 잘 되는 경우도 있지만, 잘 안되는 경우도 있다.

![NoisyGlobalIllumination](/assets/images/RayTracingEssentials/NoisyGlobalIllumination.jpeg)

이번 예시의 경우 전역 조명을 적용했을 때이다.

![DenoisedGlobalIllumination](/assets/images/RayTracingEssentials/DenoisedGlobalIllumination.jpeg)

마찬가지로 디노이징을 해주자 결과가 상당히 훌륭하게 나온다.

![GroundTruthGlobalIllumination](/assets/images/RayTracingEssentials/GroundTruthGlobalIllumination.jpeg)

물론 실제 사진을 보면 틈 사이가 조금 더 어두운 등 약간의 차이는 있기는 하다. 하지만 디노이징된 영상도 상당히 좋은 것을 볼 수 있다.

![DenoisingGif](/assets/images/RayTracingEssentials/Denoising.gif)

위의 영상의 경우 실시간은 아니고 7 fps 정도의 속도로 렌더링 되었으나, 결과를 보면 상당히 훌륭한 것을 알 수 있다.

![DenoisingAndReference](/assets/images/RayTracingEssentials/DenoisingAndReference.gif)

실제 결과와 비교해봐도 상당히 훌륭한 결과가 나옴을 알 수 있다.

![AreaLightSpecularShadingWithOcclusion](/assets/images/RayTracingEssentials/AreaLightSpecularShadingWithOcclusion.jpeg)

디노이징은 사실상 마법과도 같다. 과소 샘플링 문제와 같은 여러 문제를 해결해주기 때문이다. 사실상 디노이징 기법 덕분에 광선 추적법이 많은 사람들이 생각했던 것보다 훨씬 더 빠르게 대중에게 다가갈 수 있었다고 볼 수 있다.

---

추가 자료:

* [광선 추적법 입문](https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-ray-tracing)
* [디즈니의 경로 추적 영상](https://youtu.be/frLwRLS_ZR0)
* [Cem Yuksel 교수의 컴퓨터 그래픽스 입문 강의 영상](https://www.youtube.com/watch?v=gGKup9tUSrU&list=PLplnkTzzqsZTfYh4UbhLGpI5kGd5oW_Hh&index=20)
* [1주일 만에 광선 추적법 배우기](https://www.realtimerendering.com/raytracing/Ray%20Tracing%20in%20a%20Weekend.pdf)
* [그 다음 주에 광선 추적법 배우기](https://www.realtimerendering.com/raytracing/Ray%20Tracing_%20The%20Next%20Week.pdf)
* [남은 생에 동안 광선 추적법 배우기](https://www.realtimerendering.com/raytracing/Ray%20Tracing_%20the%20Rest%20of%20Your%20Life.pdf)
* [Graphics Codex의 광선 추적법](https://graphicscodex.courses.nvidia.com/app.html)
* [SIGGRAPH 2021 광선 추적법 입문 강의 영상](https://youtube.com/playlist?list=PL1PdIP1lGMJKx7-r8kckk41E8eFBYJH_F)

Latex:

렌더링 방정식:

```
L_{o}\left ( X, \hat{\omega}_{o} \right ) = L_{e}\left ( X, \hat{\omega}_{o} \right ) + \int_{\mathrm{S}^{2}}{L_{i}\left ( X, \hat{\omega}_{i} \right )f_{X}\left ( \hat{\omega}_{i}, \hat{\omega}_{o} \right )\left | \hat{\omega}_{i} \cdot \hat{n} \right |}d\hat{\omega}_{i}
```