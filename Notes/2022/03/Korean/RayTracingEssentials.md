# 광선 추적법 기초 (2022.03.13)
[Home](../README.md)

이 노트는 NVIDIA에서 제공한 광선 추적법 입문 시리즈인 [Ray Tracing Essentials](https://www.youtube.com/playlist?list=PL5B692fm6--sgm8Uiava0IIvUojjFOCSR)를 한국어로 정리/요약한 노트입니다. 광선 추적법을 공부하시는 분들을 위해 남깁니다.

웬만하면 컴퓨터 그래픽스 입문 강의는 들은 학생들이 들어볼 것을 권합니다.

# 1부: 광선 추적법 기초

![Ray](/Images/RayTracingEssentials/Ray.jpeg)

**광선Ray**이란 어떠한 원점origin과 방향direction을 갖는 것이다.

![RayCasting](/Images/RayTracingEssentials/RayCasting.jpeg)

**광선 투사법Ray Casting**이란 이러한 광선을 정해진 방향으로 쏘아 어떤 물체와 충돌하게 만드는 것이다.

![RayCastingBetweenTwoPoints](/Images/RayTracingEssentials/RayCastingBetweenTwoPoints.jpeg)

광선 투사법은 두 점에 대해서도 사용해주어 두 점 사이에 무언가가 가로막고 있는지 확인해줄 수 있다.

![RayCastingBetweenTwoSurfaces](/Images/RayTracingEssentials/RayCastingBetweenTwoSurfaces.jpeg)

이 방법을 사용하는 대표적인 예시는 A에서부터 빛이 나간다고 할 때, 중간에 무언가가 막고 있어 B 표면에 그림자가 졌는지, 아니면 제대로 빛이 전달되는지 여부 등을 확인해줄 수 있다.

<p><a href="https://commons.wikimedia.org/wiki/File:Ray_trace_diagram.svg#/media/File:Ray_trace_diagram.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ray_trace_diagram.svg/1200px-Ray_trace_diagram.svg.png" alt="Ray trace diagram.svg"></a><br>By <a href="//commons.wikimedia.org/wiki/User:Henrik" title="User:Henrik">Henrik</a> - <span class="int-own-work" lang="en">Own work&</span>, <a href="https://creativecommons.org/licenses/by-sa/4.0" title="Creative Commons Attribution-Share Alike 4.0">CC BY-SA 4.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=3869326">Link</a></p>

광선 투사법을 사용해서 이미지를 생성해줄 수도 있다. 카메라 앞에 모니터를 두었다고 가정했을 때, 모니터의 각 픽셀마다 카메라에서 광선이 쏘아진다고 하자. 이때 모니터에서 출력할 3D 공간에서 어떤 한 물체와 충돌을 하게 될 것이다. 이 충돌 지점에서 빛으로 또다른 광선을 투사시켜 그림자가 져있는지, 아닌지를 확인하는 방식으로 색을 계산할 수 있다. 이것이 바로 **광선 추적법Ray Tracing**이다.

## 고전적인 광선 추적법

![ClassicalRayTracing](/Images/RayTracingEssentials/ClassicalRayTracing.jpeg)

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

![StochasticRayTracing](/Images/RayTracingEssentials/StochasticRayTracing.jpeg)

예시를 들어보자. 여기서는 태양이 점광이 아니라, 영역광이다. 그림자에서 보이듯이 여러 방향으로 광선을 쏘는 것이다.

## 카지야식 산란 상호반사

유명한 "렌더링 방정식"이 나온 논문.

지금까지는 거울이나 적당히 광택이 있는 물체들에 대해서만 나루었지만, 시멘트처럼 그런 특성이 없는 물체에 대해서는 광선이 모든 방향으로 반사가 될 것이다.

![KajiyaStyleDiffuseInterreflection](/Images/RayTracingEssentials/KajiyaStyleDiffuseInterreflection.jpeg)

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

![Rasterization0](/Images/RayTracingEssentials/Rasterization0.jpeg)

위처럼 화면에 세 개의 삼각형이 있다고 가정하자.

![Rasterization1](/Images/RayTracingEssentials/Rasterization1.jpeg)

첫번째로 빨간색 삼각형을 래스터화하면 위와 같이 픽셀에 색을 할당해줄 수 있다.

![Rasterization2](/Images/RayTracingEssentials/Rasterization2.jpeg)

두번째로 초록색 삼각형을 래스터화하면 위와 같이 픽셀에 색을 할당해줄 수 있다. 초록색 삼각형은 빨간색 삼각형보다 앞에 있으니 겹치는 픽셀의 경우 빨간색 위에 초록색이 덧씌워졌다.

![Rasterization3](/Images/RayTracingEssentials/Rasterization3.jpeg)

세번째로 파란색 삼각형을 래스터화하면 위와 같이 픽셀에 색을 할당해줄 수 있다. 파란색 삼각형은 빨간색 삼각형과 초록색 삼각형보다 뒤에 있으니 겹치는 픽셀의 경우 파란색이 무시된다.

이런 식으로 래스터화는 단순히 삼각형을 픽셀에 색을 할당하는 것뿐만 아니라 깊이 정보를 반영하여 작성해준다.

## 광선 추적법

![RayTracing](/Images/RayTracingEssentials/RayTracing.gif)

광선 추적법의 경우엔 반대로, 픽셀에서 광선을 쏴서 첫번째로 충돌하는 삼각형의 색을 그대로 출력해준다.

이 방법의 경우, 한 장면에 여러 물체가 있다면 어디에 물체가 충돌을 하는지 판별을 해주는 것이 매우 힘들 수 있다. 주먹구구식 알고리듬의 경우 다음과 같이 작성할 것이기 때문이다:

* 각 픽셀(광선)마다
    * 장면 안의 각 물체마다
        * 충돌했는가? 판정

알고리듬을 공부했거나 "시간 복잡도"라는 개념을 아는 독자라면 곧바로 이해하겠지만, 총 O(N<sup>2</sup>), 픽셀마다는 O(N)의 시간 복잡도를 갖는, 매우 비싼 연산이다. 이를 해결하기 위해 도입한 개념이 바로 **경계 부피 계층Bounding Box Hierarchy**이다. BVH로 줄여 부르기도 합니다.

![BoundingVolumeHierarchy](/Images/RayTracingEssentials/BoundingVolumeHierarchy.jpeg)

위의 그림처럼 가장 효율적인 자료구조가 무엇이느냐에 대한 승자로 BVH가 등장했다. 전체 장면을 좀 더 작은 원, 그리고 더 작은 원으로 나누기 시작해서, 결국엔 각 물체로 세분화된다. 이를 자료구조적으로 표현하면 트리다.

이렇게되면 광선이 어떠한 대집합에 충돌하면 그 내부 소집합으로 또다시 들어가서 어느 소집합과 충돌했는지 반복적으로 내려가 결국엔 어떤 물체와 충돌했는지를 판별할 수 있을 것이다. 결국 트리 구조의 잎노드까지 탐색하며 내려가는 과정을 의미하므로, 일반적으로 픽셀 당 시간 복잡도가 O(log N)이라고 볼 수 있다. 즉, 위에서 말한 O(N)보다는 빠르다는 것이다.

![BoundingBox](/Images/RayTracingEssentials/BoundingBox.jpeg)

실제 광선 추적법의 경우 위의 사진과 같이 경계 박스를 사용한다. 결국 박스를 계속 타고 내려가서 결과적으로 어떤 삼각형과 교차하는지, 충돌하는지를 확인한다.

![FakeNews](/Images/RayTracingEssentials/FakeNews.png)

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

![RasterizationAndRayTracing](/Images/RayTracingEssentials/RasterizationAndRayTracing.jpeg)

# 3부: 광선 추적법 하드웨어

광선 추적법은 당연하게도 매우 병렬적인 연산을 요구한다. 각 픽셀마다 색을 연산할 것이고, 이 픽셀은 서로 독립적이므로 병렬적으로 연산할 것이다.

## 1987: AT&T 픽셀 기계

![At&tPixelMachine](/Images/RayTracingEssentials/At&tPixelMachine.jpeg)

첫 광선 추적법 전용 기계로, SIGGRAPH에 소개되었다. 위의 512×512 픽셀 크기의 사진에 7,381 개의 구와 평면을 30초만에 렌더링할 수 있었으며, 그 다음 해인 1988년에는 16초만에 렌더링할 수 있었다. 물론 매우 비쌌으며, 사실상 역사의 각주를 차지할 뿐이긴 하다.

단순히 첫 광선 추적법을 렌더링할 뿐만 아니라, 실제 실시간 광선 추적법을 제공해주기도 했다. 마우스로 공을 움직이는 방식 등이다.

## 무어의 법칙의 종말

![MooresLaw](https://dl.acm.org/cms/attachment/f9a4ecff-6e06-4ce8-8d62-eac45b52e602/f1.jpg)

NVIDIA, 구글 등지에서는 이미 무어의 법칙이 끝남음을 주장하고 있다. 이제는 좀 더 특화된 하드웨어를 설계하는 추세이다.

![PascalAndTuring](/Images/RayTracingEssentials/PascalAndTuring.jpeg)

전통적인 GPU(파스칼 포함)에서는 래스터화를 위한 특화된 작업을 했다면, 튜링부터는 인공지능과 광선 추적법을 위한 특화된 작업을 해주는 코어가 추가되었다. 이 코어가 각각 텐서 코어와 RT 코어이다.

## RT 코어

![BVH](/Images/RayTracingEssentials/BVH.jpeg)

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

![GpuMemory](/Images/RayTracingEssentials/GpuMemory.jpeg)

과거에는 몇 MB 수준이었으나, 이제는 512 GB 수준이나 발전했다. 영화의 경우 복잡한 장면에서는 약 50 GB 혹은 그보다 조금 더 정도 사용한다. 이처럼 광선 추적법을 사용하려면 모든, 혹은 거의 대부분의 데이터가 있어야 한다. 필요할 땐 데이터 교환도 해야할테고. 결국 광선 추적법에 필요한 정보를 저장하는 것이 중요하다.

![MetroExodusOneFrame](/Images/RayTracingEssentials/MetroExodusOneFrame.jpeg)

기존 아키텍처에서 광선 추적법을 했을 때 걸린 시간, 현재 아키텍처에서 RT 코어를 사용하지 않고 광선 추적법을 했을 때의 걸린 시간, RT 코어를 사용했을 때 걸린 시간 등을 보여주는 사진이다.

![BattlefieldV](/Images/RayTracingEssentials/BattlefieldV.jpeg)

광선 추적법에 특화된 하드웨어가 중요할 뿐만 아니라, 해당 하드웨어, 소프트웨어를 앞으로 튜닝해가면 더욱 더 빨라지기 시작할 것이다.

![NVIDIARealTimeRayTracing](/Images/RayTracingEssentials/NVIDIARealTimeRayTracing.jpeg)

NVIDIA는 마이크로소프트의 DXR 발표에 맞추어 4 개의 수냉식 볼타 GPU(파스칼 구조)를 사용해서 위의 스타워즈 장면을 언리얼 엔진을 통해 실시간으로 렌더링했으나, 이는 몇 개월 뒤 튜링 구조가 나오자 오직 한 GPU만으로도 가능하게 되었다. 과거 AT&T 픽셀 기계에서 했던 512×512 화면에서 약 8,000 개의 구를 30 fps에 출력했던 시절에서, 이제는 튜링 GPU로는 8,000,000 개의 구를 60 fps에 문제 없이 출력할 수 있다.

# 4부: 광선 추적법 파이프라인

## 래스터화와 광선추적법

래스터화와 광선 추적법은 둘 다 병렬성을 띤다.

![RasterizationAndRayTracingPipeline](/Images/RayTracingEssentials/RasterizationAndRayTracingPipeline.jpeg)

래스터화의 경우 매우 단순하다. 화면에 삼각형을 그려주려면 그냥 정점 쉐이딩, 픽셀 쉐이딩해주기만 하면 된다.

광선 추적법도 유사하다. 우선 광선을 쏘고, 환경을 종단하고, 최종적으로 쉐이딩을 해준다. 여기서 다른 점이라면 중간에 그림자 광선, 반사 광선처럼 추가적인 광선을 더 쏴줘서 재귀를 해줄 수 있다는 것이다.

![RTXRayTracingPipeline](/Images/RayTracingEssentials/RTXRayTracingPipeline.jpeg)

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

![ShadersComplicated](/Images/RayTracingEssentials/ShadersComplicated.jpeg)

위의 셰이더를 총합하면 위와 같이 복잡하게 되어있는데, 이걸 단순화해줄 수 있다.

![ShadersSimplified](/Images/RayTracingEssentials/ShadersSimplified.jpeg)

우선 `TraceRay()`로 광선을 생성한다. 

생성한 광선은 가속화 단계를 거치는데, 이 단계에서는 BVH를 따라 충돌했을 수도 있는 부분을 찾아낸다. 여기에 교차 셰이더를 적용해서 충돌을 했는지를 판별한다. 만약 최근접 충돌이라면 해당 정보를 저장한다. 만약 추가적으로 임의 충돌 셰이더를 파이프라인에 제공했다면, 충돌한 지점이 투명한 곳이어서 광선이 충돌하지 않고 계속 직진해야하는지 등의 여부를 판단해준다.

결국 가속화 단계는 끝이 날텐데, 그러면 충돌을 했든, 충돌을 하지 못했든 두 가지로 결과가 나올 것이다.

![AnyHitShader](/Images/RayTracingEssentials/AnyHitShader.jpeg)

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