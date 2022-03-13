# 광선 추적법 기초 (2022.03.13)
[Home](../README.md)

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