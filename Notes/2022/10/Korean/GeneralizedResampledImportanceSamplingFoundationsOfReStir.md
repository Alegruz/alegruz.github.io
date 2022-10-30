# 일반 재표집 중요도 표집: ReSTIR의 근간 (2022.10.22)
[Home](/README.md)

* [Daqi Lin](https://dqlin.xyz/), University of Utah.
* [Markus Kettunen](https://research.nvidia.com/person/markus-kettunen), NVIDIA.
* [Benedikt Bitterli](https://benedikt-bitterli.me/), NVIDIA.
* [Jacop Pantaleoni](https://www.linkedin.com/in/jpantaleoni/), NVIDIA.
* [Cem Yuksel](http://www.cemyuksel.com/), University of Utah.
* [Chris Wyman](https://cwyman.org/), NVIDIA

# 초록

장면들이 너무 복잡해지니깐 실시간으로 광선 추적 / 경로 표집할 때 적은 표본으로 최고의 퀄리티를 뽑아야하는 기술이 더욱 중요해짐... 최근엔 *재표집resampling* 기반의 [RIS](/Notes/2022/10/Korean/ImportanceResamplingForGlobalIllumination.md)로 최대한 뭔가를 해보려고 했는데, 그 중 하나가 시공간으로 복잡한 광전달을 픽셀 당 겨우 몇 개의 표본으로 표집하려는 거였음([ReSTIR](/Notes/2022/10/Korean/SpatiotemporalReservoirResamplingForRealTimeRayTracingWithDynamicDirectLighting.md)). 근데 이게 여러 가정을 하는데, 대표적인게 표본 독립성임. 근데 표본을 재사용하면 *상관관계가 발생*함. 그러니까 ReSTIR식 반복은 RIS가 이론적으로 제공하는 수렴 보장성을 잃게됨.

그렇기에 이론을 확장한 일반 재표집 중요도 표집(GRIS)을 소개함. 이를 통해 상관관계가 있는, PDF도 모르고 여러 영역에서 나온 표본들에 대해 RIS를 적용할 수 있도록 해줌. 이를 통해 이론적인 배경을 탄탄하게 해서 ReSTIR 기반 표집에서 분산의 유계와 수렴 조건을 제시함. 또한 좀 더 실용적인 알고리듬 설계와 복잡한 shift 매핑을 통해 고급진 픽셀 간 재사용을 가능케 해줌.

여기선 복잡한 장면에서 interactive하게 돌아가는 ReSTIR PT라는 경로 추적 표집기를 소개함. 이 표집기는 다중 튕김 난/정반사 빛을 표집하면서도 픽셀 당 딱 하나의 경로만을 사용함.

# 1. 도입

요즘 렌더링의 핵심은 [몬테 카를로 알고리듬](/Notes/2022/10/Korean/MonteCarloIntegration.md)임. 요즘 RTX 덕분에 실시간에 쓸 수 있음. 근데 게임에서 쓰기엔 비용이 좀 빡셈. *최대* 픽셀 당 경로 하나 정도?

결국 표본이 적단 소리인데, 이때 분산을 줄이려고 쓴 방법이 중요도 표집임. 근데 빛이 복잡해지면 좋은 표본을 뽑기가 좀 빡세, 아니 사실상 불가능해짐.

그래서 RIS에 기반한 여러 알고리듬들이 나온 것임. 대충 후보를 뽑아 놓고, 얘네들 중에서 다시 또 뽑아서(재표집) 이상적인 분포에 다가가겠다는 소리임. 이상적으로는 충분히 재사용을 하면 "완벽한" 중요도 분포로 수렴을 할 것임. 이걸 저장소 기반으로 시공간 중요도 재표집을 한 ReSTIR 알고리듬을 [직접광](/Notes/2022/10/Korean/SpatiotemporalReservoirResamplingForRealTimeRayTracingWithDynamicDirectLighting.md), [전역 조명](/Notes/2022/10/Korean/ReStirGiPathResamplingForRealTimePathTracingRevisited.md), 부피 산란 등에 적용했음. ReSTIR는 스트리밍 알고리듬으로 GPU의 평행성을 사용해서 오류를 줄임.

근데 이런 확률 분포의 수렴을 제대로 다룬 적이 없음. 원본 ReSTIR 논문에선 이 확률 분포가 *무편향적*이라는 건 보이긴 했는데 모든 상황에서 수렴한다는 점을 증명하지는 않았음.

사실상 제일 핵심은 ReSTIR가 엄청 중요한 부분을 무시한다는 점임: RIS는 *독립 항등 분포independent and identically distributed*(i.i.d.) 표본을 가정함. 이때 이 표본들은 주로 하나의 source 분포에서 나옴. 재사용을 하게 되면 이 독립성을 위반하게 되고, 하나의 분포에서 나왔다는 점을 무시함. 이러면 수렴이 느려지거나 오히려 벗어나게 됨. 기존 연구에서는 경험적으로 봐씅ㄹ 때 충분히 상관관계가 작으면 수렴에 영향을 주지 않는다고는 했지만, 그래서 상관관계를 줄이는 노력(예를 들어 재사용할 공간 이웃을 확률적으로 뽑기 등)이 실제로 얼마나 수렴을 부장하는지에 대한 부분은 명확하지 않음. 복잡한 광원을 재표집할 땐 이론적 이해 없이는 충분히 상관관계를 줄이는게 불가능할 수도 있음.

이 논문에서는 *일반 재표집된 중요도 표집generalized resampled importance sampling* (GRIS)이라는 i.i.d. 가정을 처리하면서 ReSTIR와 같이 복잡한 표집기에서의 수렴을 이해하고, 설계하고, 논의하는데 도움이 되는 새로운 이론적 토대를 소개함. GRIS를 통해 서로 다른 영역에서 왔을 수도 있어 하나의 적분으로 추정할 수 있도록 매핑한, 상관관계가 있는 후보 표본을 합쳐서 재표집할 수 있게 해줌.

RIS나 ReSTIR는 GRIS의 한 특수한 경우임.

Contributions:
* Shift 매핑을 통해 다른 픽셀의 경로에 대한 RIS 도출
* 무편향성과 수렴에 대한 조건 제시
* 수렴 제한사항을 만족하면서 분산을 최소화하는 MIS 가중치 도출
* 기존 ReSTIR 설계의 여러 선택들(M-캐핑 등)이 수렴을 보장하는데 얼마나 *핵심*인지를 알려줌.
* 제대로 shift 매핑을 하면 시공간적으로 경로 재사용할 때 노이즈를 제어할 수 있음을 보임
* BSDF 로브에 특정되도록 연결하여 성능과 퀄리티를 높인 shift 매핑 설계
* GRIS 이론을 통해 경로를 재사용할 수 있는 ReSTIR PT 도출

특히 함수 f를 적분할 때 수렴을 보장하려면 반드시:
* 표본 재사용 때 올바른 MIS 가중치를 사용해야 함
* f/![TargetFunction](/Images/ReStirGi/TargetFunction.png)이 엄청 커지지 않도록 하는 target 함수 ![TargetFunction](/Images/ReStirGi/TargetFunction.png)를 선택해야 함
* 표본의 재표집 가중치 w<sub>i</sub>이 Var[∑w<sub>i</sub>] → 0이 되도록 제어함
* f의 영역에 충분히 많은 표본 수가 있도록 보장함
  * 특히, 충분한 "표준canonical" 표본이 있도록 함
* 시간 재사용할 때 합리적인 M-캡을 통해 프레임 간의 상관관계에 제한을 두어야 함

새로운 이론과 shift 매핑을 통해 표본을 좀 더 효율적으로 재사용하여 더 강력하면서 무편향적인 광전달 알고리듬을 만들어 복잡한 조명 환경을 처리하면서도 효율적인 GPU 병렬화와 실시간에 적합하도록 함.

## 1.1. 논문 로드맵

* 2절: GRIS의 핵심 배경(+상당히 유사한 재표집/표집 재사용 알고리듬)을 다룸.
* 3절: RIS 이론의 연구 현황 리뷰 및 확장 필요성을 다룸.
* 4절: 다중 입력 영역 &Omega;<sub>i</sub>를 목표 영역 &Omega;로, 마치 기울기 영역 렌더링에서처럼 shift 맵 T<sub>i</sub>: &Omega;<sub>i</sub> → &Omega;를 활용하여 재표집해주어 RIS를 일반화해줌. 영역 &Omega;에서 임의의 함수 f가 GRIS로 무편향하게 적분하는 조건을 제시하고, 출력 표본 분포가 특정 목표 재표집 PDF ![TargetResamplingPdf](/Images/Gris/TargetResamplingPdf.png)
* 5절: 적분 오류가 곧 RIS 정규화 facor의 분산과 직접적으로 유관함을 보임. 이 분산이 사라지면 GRIS는 0 분산 적분이 됨. 이건 현재, *표준canonical* 픽셀(이웃 뿐만 아니라)로부터 추가적인 표본을 받고, 강력한 재표집 MIS 가중치를 통해 도달할 수 있음.
* 6절: ReSTIR가 GRIS 수렴 제한사항을 만족하도록하면, 이게 비마르코프 연쇄가 되어 픽셀 당 단일 표본일 때 평생 경로 공간을 탐색하게 됨. 정적인 장면에서는 *프레임을 평균하면 수렴하고, 실시간 사용은 각 프레임의 연쇄의 단일 상태를 주게 됨. averaging frames converges, and real-time usage gives a single state of the chain each frame.*
* 7절: 픽셀 간 경로 재사용을 위한 shift 매핑을 설계하고, 효율성을 개선하기 위한 몇 가지 새로운 shift 수정사항을 제시함.
* 8절: ReSTIR PT 구현을 다룸.
* 9절: 결과 및 실험 검증을 보임.

# 2. 배경

요즘 그래픽스 연구의 핵심은 표집, 중요도 표집, 표본 재사용임.

표 1: 표기법 정리

|변수|내용|
|----|----|
|x, y|함수의 일반적인 입력|
|![PathX](/Images/Gris/PathX.png), **x**<sub>i</sub>|경로와 경로 위의 한 점|
|&Omega;<sub>i</sub>|표본이 그려진 영역|
|&Omega;|함수 f의 적분 영역|
|X<sub>i</sub>|RIS의 입력 표본. 보통 수열임 (X<sub>i</sub>)<sub>i=1</sub><sup>M</sup>|
|Y|RIS로 선택한 표본 Y. (가장 단순한 경우 Y = X<sub>s</sub>, 일반적인 경우 Y = T<sub>s</sub>(X<sub>s</sub>))
|M, N|RIS의 입력 표본 수와 출력 표본 수|
|p<sub>X</sub>(·)|어떤 위치의 확률 변수 X의 확률 밀도|
|p(·)|확률 변수가 명확한 경우에서 위를 간단하게 표기한 것|
|![UnnormalizedTargetDistributionP](/Images/Gris/UnnormalizedTargetDistributionP.png)|정규화하지 않은 *목표* 분포 (*목표*: Y ∝ ![TargetFunction](/Images/ReStirGi/TargetFunction.png)가 되도록 하기)|
|![NormalizedTargetPdfP](/Images/Gris/NormalizedTargetPdfP.png)|정규화 목표 PDF (즉, ![TargetResamplingPdf](/Images/Gris/TargetResamplingPdf.png) = ![TargetFunction](/Images/ReStirGi/TargetFunction.png) / \|\|![TargetFunction](/Images/ReStirGi/TargetFunction.png)\|\|)|
|f(·)|적분할 함수 (예시. path contribution 함수)|
|g<sub>i</sub>(·)|&Omega;의 영역에서 f를 적분할 때 X<sub>i</sub> ∈ &Omega;<sub>i</sub>가 기여하는 정도를 의미하는 contribution function|
|W<sub>i</sub>|*무편향 contribution 가중치*; PDF의 역수를 추정함|
|w<sub>i</sub>|*재표집 가중치*; RIS는 w<sub>i</sub>/∑w<sub>j</sub>에 따라 한 X<sub>i</sub>를 선택함|
|c<sub>i</sub>|*contribution MIS 가중치*; 기존 연구들의 MIS 가중치|
|m<sub>i</sub>|이 논문의 새로운 *재표집 MIS 가중치*|
|T<sub>i</sub>(·)|shift 매핑; 표본을 영역 &Omega;<sub>i</sub>에서 &Omega;으로 매핑해줌|
|![JacobianOfShiftMappingTi](/Images/Gris/JacobianOfShiftMappingTi.png)|매핑 T<sub>i</sub>의 야코비 행렬식|
|![PHatFromI](/Images/Gris/PHatFromI.png)|"i에서 온 ![TargetFunction](/Images/ReStirGi/TargetFunction.png)". ![TargetFunction](/Images/ReStirGi/TargetFunction.png)가 &Omega;<sub>i</sub>로의 shift 맵을 포함하도록 일반화함|
|C|수렴 증명할 때 유계로 쓰일 여러 상수들|
|R, \|R\|| 표준canonical 표본과 그 숫자|

# 2.1. 재표집 알고리듬

이 논문은 *sampling importance resampling*(SIR)에 기반한 재표집 방법을 일반화함. SIR은 독립항등표본의 한 집합 (X<sub>i</sub>)<sub>i=1</sub><sup>M</sup>에서 재표집 가중치 w<sub>i</sub> = ![TargetFunction](/Images/ReStirGi/TargetFunction.png)(X<sub>i</sub>)/p(X<sub>i</sub>)에 비례하여 한 번 더 표집을 한, 좀 더 잘 분포된 표본 (Y<sub>i</sub>)<sub>i=1</sub><sup>N</sup>을 얻는 과정임. 이때 ![TargetFunction](/Images/ReStirGi/TargetFunction.png)(x)은 원하는 (아마 정규화되있지 않은) 목표 분포임. M이 커질 수록 표본 Y<sub>i</sub>의 분포는 ![TargetResamplingPdf](/Images/Gris/TargetResamplingPdf.png) = ![TargetFunction](/Images/ReStirGi/TargetFunction.png) / \|\|![TargetFunction](/Images/ReStirGi/TargetFunction.png)\|\|에 수렴함.

**[*RIS*](/Notes/2022/10/Korean/ImportanceResamplingForGlobalIllumination.md)<br>**
몬테 카를로 방법에서 SIR을 썻을 때 좀 더 제대로 정규화를 해주는 방법을 제시함.

**저장소 표집RS**<br>
단일 패스 스트림에서 입력 집합 (X<sub>i</sub>)<sub>i=1</sub><sup>M</sup>가 들어왔을 때 무작위로 한 표본을 뽑음. *저장소*는 선택한 표본, 현재 스트림의 길이 M, 가중치 w<sub>i</sub>의 총합을 저장함. 새롭게 스트림에 X<sub>i</sub>가 들어오면, 선택한 표본을 확률 w<sub>i</sub> / ∑<sub>j≤i</sub>w<sub>j</sub>에 따라 교체함.

[**ReSTIR**](/Notes/2022/10/Korean/SpatiotemporalReservoirResamplingForRealTimeRayTracingWithDynamicDirectLighting.md)<br>
연쇄된 저장소 재표집으로 픽셀과 프레임 간의 표본을 공유함.

**Shift 매핑**<br>
ReSTIR이나 RIS도 마찬가지지만, 경로의 표본은 반드시 같은(공유된) 영역에서 와야 함. 그렇기에 서로 다른 영역에서 적분하는 경우를 처리해야함. 이 경우 서로 다른 영역에서의 경로를 매핑해줘야하는 shift 매핑 방법으로 해결함.

# 3. RIS 리뷰

|RIS 알고리듬|Talbot et al. 2005<br>항등 분포 표본|Talbot 2005<br>서로 다르게 분포된 표본|GRIS<br>상관관계 & 서로 다른 source 영역|
|---|---|---|---|
|(1) M 개의 후보 표본 (X<sub>1</sub>, &hellip;, X<sub>M</sub>) 생성|같은 영역에서 표집: 같은 PDF p, X<sub>i</sub> ∈ &Omega;|같은 영역에서의 표본: 다른 PDF p, X<sub>i</sub> ∈ &Omega;|임의의 영역에서의 표본: 다루기 힘든intractable PDF p<sub>i</sub>도 ㄱㅊ, X<sub>i</sub> ∈ &Omega;<sub>i</sub>|
|(2) *무편향 contribution 가중치* W<sub>i</sub> 구하기|W<sub>i</sub> = 1/p(X<sub>i</sub>)|W<sub>i</sub> = 1/p<sub>i</sub>(X<sub>i</sub>)|W<sub>i</sub>는 반드시 1/p<sub>i</sub>(X<sub>i</sub>)를 무편향적이게 추정해야함|
|(3) *재표집 가중치* w<sub>i</sub> 구하기|![TalbotEtAlResamplingWeightWi](/Images/Gris/TalbotEtAlResamplingWeightWi.png)|![TalbotResamplingWeightWi](/Images/Gris/TalbotResamplingWeightWi.png)|![ResamplingWeightWi](/Images/Gris/ResamplingWeightWi.png)|
|(4) w<sub>i</sub>에 비례하여 s를 선택하여 영역 &Omega;에 있는 출력 Y 선택|단순히 Y = X<sub>s</sub>|단순히 Y = X<sub>s</sub>|&Omega;<sub>i</sub>에서 &Omega;로 매핑된 출력 표본 Y = T<sub>s</sub>(X<sub>s</sub>)|

## 3.1. 항등 분포 표본

기본적인 RIS에서는 어떤 영역 &Omega;로부터 이미 알고 있는 PDF p에서 뽑은 연속된 표본 (X<sub>i</sub>)<sub>i=1</sub><sup>M</sup>이 독립항등분포(i.i.d.)를 이루는 경우를 입력으로 받음. 어쨋든 목표는 이 연속된 표본에서 어떤 확률에 따라 Y를 뽑는데, 이 확률이 이루는 분포, 즉 PDF p<sub>Y</sub>가 영역 &Omega;에서 f를 적분할 때 좀 더 나은 중요도 표집기가 되도록 해주는 것임.

좀 더 구체적으로 설명하자면, 음수가 아닌 목표 함수 ![TargetFunction](/Images/ReStirGi/TargetFunction.png)를 정의하고, Y를 뽑을 때, 입력 표본의 개수 M이 증가할 수록 구해진 PDF p<sub>Y</sub>가 정규화된 ![TargetFunction](/Images/ReStirGi/TargetFunction.png)를 좀 더 잘 근사하도록 해주는 것임. 즉, p<sub>Y</sub>가 ![TargetResamplingPdf](/Images/Gris/TargetResamplingPdf.png) = ![TargetFunction](/Images/ReStirGi/TargetFunction.png) / \|\|![TargetFunction](/Images/ReStirGi/TargetFunction.png)\|\|를 근사하는 것임.

알고리듬적으로 보자면 입력 표본 X<sub>i</sub>에서 한 표본 Y = X<sub>s</sub>를 확률 Pr[s=i] = w<sub>i</sub>/∑<sub>j=1</sub><sup>M</sup>w<sub>j</sub>에 따라서 뽑는 것임. 이때 w<sub>i</sub>는 재표집 가중치임. 이전 연구에서는 w<sub>i</sub>를 ![TargetFunction](/Images/ReStirGi/TargetFunction.png)(X<sub>i</sub>)/p(X<sub>i</sub>)로 두었었음.

# Latex

TalbotResamplingWeightWi

```
w_{i} = m_{i}{\left(X_{i} \right )}\hat{p}{\left(X_{i} \right )}W_{i}
```

ResamplingWeightWi

```
w_{i} = m_{i}{\left(T_{i}{\left(X_{i} \right )} \right )}\hat{p}{\left(T_{i}{\left(X_{i} \right )} \right )}W_{i}\left | \frac{\delta{T_{i}}}{\delta{X_{i}}} \right |
```