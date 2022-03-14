# 광선 추적법 기초 (2022.03.13)
[Home](../README.md)

이 노트는 NVIDIA에서 제공한 광선 추적법 입문 시리즈인 [Ray Tracing Essentials](https://www.youtube.com/playlist?list=PL5B692fm6--sgm8Uiava0IIvUojjFOCSR)를 한국어로 정리/요약한 노트입니다. 광선 추적법을 공부하시는 분들을 위해 남깁니다.

웬만하면 컴퓨터 그래픽스 입문 강의는 들은 학생들이 들어볼 것을 권합니다.

## 1부: 광선 추적법 기초

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

### 고전적인 광선 추적법

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

### 쿡 확률적 (분포) 광선 추적법

충돌한 표면이 거울이 아닐 수도 있다. 즉, 반사 광선이나 그림자 광선이 하나가 아니라 여러 개가 나올 수 있다.

![StochasticRayTracing](/Images/RayTracingEssentials/StochasticRayTracing.jpeg)

예시를 들어보자. 여기서는 태양이 점광이 아니라, 영역광이다. 그림자에서 보이듯이 여러 방향으로 광선을 쏘는 것이다.

### 카지야식 산란 상호반사

유명한 "렌더링 방정식"이 나온 논문.

지금까지는 거울이나 적당히 광택이 있는 물체들에 대해서만 나루었지만, 시멘트처럼 그런 특성이 없는 물체에 대해서는 광선이 모든 방향으로 반사가 될 것이다.

![KajiyaStyleDiffuseInterreflection](/Images/RayTracingEssentials/KajiyaStyleDiffuseInterreflection.jpeg)

위의 그림에서처럼, 한 픽셀 내부에서 여러 지점에서 시작하여 다양한 방향으로 광선이 반사된다. 이 광선이 하늘로 가버릴 수도, 광원과 충돌할 수도, 다른 물체와 충돌하여 그림자가 질 수도, 땅과 충돌할 수도 있는 것이다. 결과적으로 얻은 픽셀에서는 이 값들을 적당히 antialiasing하듯이 샘플링해서 최종 색을 구하면 되는 것이다. 이걸 여러 광선에 대해서 하다보면 상당히 현실적인 결과를 얻을 것이다.

이런 것처럼 한 광선이 출발해서 반사되고, 또다시 반사되는 식으로 경로를 추적하는 것을 *경로 추적path tracing*이라 부른다.

## 2부: 래스터화 vs 광선 추적법

래스터화 루프:

* 각 물체마다
    * 각 픽셀마다 (누구 픽셀이 더 가깝나?)

광선 추적법 루프:

* 각 픽셀마다
    * 각 물체마다 (누가 제일 가깝지?)

### 래스터화

![Rasterization0](/Images/RayTracingEssentials/Rasterization0.jpeg)

위처럼 화면에 세 개의 삼각형이 있다고 가정하자.

![Rasterization1](/Images/RayTracingEssentials/Rasterization1.jpeg)

첫번째로 빨간색 삼각형을 래스터화하면 위와 같이 픽셀에 색을 할당해줄 수 있다.

![Rasterization2](/Images/RayTracingEssentials/Rasterization2.jpeg)

두번째로 초록색 삼각형을 래스터화하면 위와 같이 픽셀에 색을 할당해줄 수 있다. 초록색 삼각형은 빨간색 삼각형보다 앞에 있으니 겹치는 픽셀의 경우 빨간색 위에 초록색이 덧씌워졌다.

![Rasterization3](/Images/RayTracingEssentials/Rasterization3.jpeg)

세번째로 파란색 삼각형을 래스터화하면 위와 같이 픽셀에 색을 할당해줄 수 있다. 파란색 삼각형은 빨간색 삼각형과 초록색 삼각형보다 뒤에 있으니 겹치는 픽셀의 경우 파란색이 무시된다.

이런 식으로 래스터화는 단순히 삼각형을 픽셀에 색을 할당하는 것뿐만 아니라 깊이 정보를 반영하여 작성해준다.

### 광선 추적법

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

### 래스터화와 광선 추적법 비교

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