# ReSTIR 논문 정리 (2022.10.16)
[Home](/README.md)

* [Benedikt Bitterli](https://benedikt-bitterli.me/), Dartmouth College
* [Chris Wyman](https://cwyman.org/), NVIDIA
* [Matt Pharr](https://pharr.org/matt/), NVIDIA
* [Peter Shirley](https://www.petershirley.com/), NVIDIA
* [Aaron Lefohn](https://research.nvidia.com/person/aaron-lefohn), NVIDIA
* [Wojciech Jarosz](https://cs.dartmouth.edu/wjarosz/), Dartmouth College

# 초록

문제: 수백만 개의 동적인 광원으로부터의 직접광을 [몬테 카를로 적분법](/Notes/2022/10/Korean/MonteCarloIntegration.md)을 활용하여 효율적으로 렌더링하기<br>
해결: ReSTIR 알고리듬
* interactive rate
* 고퀄리티
* 복잡한 자료구조 X

후보 빛 샘플 집합으로부터 다시 표집, 즉 재표집resample을 반복적으로 수행하고, 추가적으로 시공간적 재표집을 통해 근처 샘플들로부터 추가적인 정보를 활용해줌.

위의 방법을 활용하는 무편향 몬테 카를로 추정량을 제시함. GPU에서 돌아가도록 구현하였으며, 340만 개의 동적인 광원 삼각형들이 있는 복잡한 장면을 픽셀 당 최대 8 개의 광선을 활용하여 렌더링하는데에 프레임 당 50ms 이하의 성능을 보임.

# 1. 도입

몬테 카를로 경로 추적법이 요즘 오프라인 렌더링에 널리 사용 중이고, 실시간에서도 RTX의 등장 덕에 슬슬 사용하려고 함. 어차피 오프라인 렌더링할 때도 광원이 많을 때 직접광 처리하는 법은 매우 어려움.

근데 여기다가 실시간을 보장하겠다? 그럼 장면이 동적일테니 렌더러는 사전에 장면이 어떻게 변할지 모를 것임. 게다가 현재로서는 실시간성을 보정하면서 광선을 쏘기엔 픽셀당 겨우 몇 개 밖에 못 쏨.

그러니까 사람들이 디노이징 기술을 연구하기 시작하고, 상당한 결과를 보였음. 근데 애초에 처음부터 디노이저에 표본이 적은 이미지, 즉 노이즈가 심한 이미지를 주면 디노이저도 제대로 처리하기가 힘듦. 즉, 샘플링을 첨부터 잘 해야 디노이저도 잘 될 것이라는 뜻임.

우리가 제시한 방법은 완전히 동적이고, 여러 광원을 갖는 장면에서 단일 튕김 직접광을 표집하는 실시간 광선 추적법임. 이 방법은 우선 [재표집된 중요도 표집(RIS)](/Notes/2022/10/Korean/ImportanceResamplingForGlobalIllumination.md)에 기반함. 여기에다가 원하는 표본들만 저장할 "저장소"라는 고정된 자료구조와 이에 대한 알고리듬을 활용하여 안정적인 실시간 성능을 보장함.

여기서 저장소라는 것은 고정된 크기의 배열을 의미함. 이때 이 저장소를 활용할 때 시공간적 이웃들의 저장소 통계를 재사용해서 확률적으로, 점진적으로, 계층적으로 픽셀의 직접광 표집 PDF를 개선함. 요즘 실시간 디노이저들이 시공간 이웃들의 *픽셀 색pixel color*을 재사용하는 것에 반해 이 논문에서 말하는 재사용이란 렌더러 내부에서 사용하는 *표집 확률sampling probabilities*을 의미함. 그렇기에 무편향한 것임.

# 2. 이론적 배경

어떤 점 y에서 직접광에 의해 방향 ![DirectionOmega](/Images/ReStir/DirectionOmega.png)로 반사된 radiance L은 모든 광원 표면 A에 대한 적분으로 구할 수 있다:

![ReflectedRadianceL](/Images/ReStir/ReflectedRadianceL.png)

&rho;: BSDF<br>
L<sub>e</sub>: 광원 radiance<br>
V: x와 y 사이의 상호 가시성<br>
G: 기하항. 역제곱 거리와 코사인항

보는 방향 ![DirectionOmega](/Images/ReStir/DirectionOmega.png)와 shading할 점 y를 편의성을 위해 빼놓고 넓이의 변화량을 dx로 표기하면 다음과 같이 L을 간단하게 표현할 수 있음:

![SimplifiedReflectedRadianceL](/Images/ReStir/SimplifiedReflectedRadianceL.png)

![IntegrandF](/Images/ReStir/IntegrandF.png)

여기에 *중요도 표집Importance Sampling*(IS)를 적용하면 다음과 같아짐:

![ImportanceSampling](/Images/ReStir/ImportanceSampling.png)

여기에 *다중 중요도 표집Multiple Importance Sampling*(MIS)를 적용할 경우 다음과 같아짐:

![MultipleImportanceSampling](/Images/ReStir/MultipleImportanceSampling.png)

여기서 w<sub>s</sub> 함수는 가중치 함수로, 주로 균형 휴리스틱 함수 ![BalanceHeuristic](/Images/MonteCarloIntegration/BalanceHeuristic.png) 사용함.

## 2.1. RIS

MIS 대신 사용할 수 있는 방법에는 몇몇 항의 곱에 *근사하게* 비례하는 표본을 뽑는 방법이 있음. 즉, RIS를 사용하는 것임.

예를 들어, 우리가 구해야하는 target PDF ![TargetPdf](/Images/RestirForGameGi/ResampledImportanceSamplingDesiredPdf.png)에서 표집을 하려고 보니, 실질적으로 그게 불가능하다면, 이 PDF에 근사할 수 있도록 source PDF p를 구하는 것임.

즉, 적당히 최적인 PDF p에서 z 개의 표본을 우선 뽑는다. 이 z 개의 표본을 갖는 집합에서 확률 p(z | **x**)에 따라 한 표본을 또다시 뽑는 것이다. 이때의 표본 집합의 모든 z 개의 표본은 각각 가중치를 갖는데, 이 가중치에 비례하여 확률을 부여한다. 이때 한 표본을 뽑을 때, target PDF에 근사하게 표본을 뽑아야 하므로 가중치에 target PDF의 정보를 추가한다:

![ResampledImportanceSamplingCandidateProbability](/Images/RestirForGameGi/ResampledImportanceSamplingCandidateProbability.png)

![ResampledImportanceSamplingCandidateWeight](/Images/RestirForGameGi/ResampledImportanceSamplingCandidateWeight.png)

이런 방법을 사용하여 최종적으로 샘플 y ≡ x<sub>z</sub>를 뽑게 된다.

이때 단일 표본 RIS 추정량은 다음과 같다:

![SingleSampleRisEstimator](/Images/ReStir/SingleSampleRisEstimator.png)

즉, 추정량은 마치 y가 p가 아니라 ![TargetPdf](/Images/RestirForGameGi/ResampledImportanceSamplingDesiredPdf.png)에서 온 것으로 착각하게 되고, 괄호 안의 항을 통해 실제로는 ![TargetPdf](/Images/RestirForGameGi/ResampledImportanceSamplingDesiredPdf.png)를 근사하고 있음을 알 수 있다.

RIS를 여러 표본에 대해 반복하고 평균을 내게 되면 N개 표본 RIS 추정량을 얻을 수 있다:

![NSampleRisEstimator](/Images/ReStir/NSampleRisEstimator.png)

이 논문에서는 단일 표본을 가정하고 진행한다.

일반적으로 각 픽셀 q는 고유한 피적분함수 f<sub>q</sub>와 이에 대응하는 target PDF ![TargetPdfForPixelQ](/Images/ReStir/TargetPdfForPixelQ.png)를 가질 것이다.

RIS 알고리듬은 다음과 같다:


> ### 알고리듬 1: RIS
> 입력: M, q: 픽셀 q에 대해 생성할 후보 표본의 수 M(M ≥ 1)
> 출력: 표본 y와 RIS 가중치의 합 ![SumOfRisWeights](/Images/ReStir/SumOfRisWeights.png)
> 

```
 1  // 후보군 x = {x_1, ..., x_M} 생성
 2  x ← 0
 3  w ← 0
 4  w_sum ← 0
 5  for i ← 1 to M do
 6      generate x[i] ~ p
 7      x ← x ∪ {x[i]}
 8      w[i] ← phat_q(x[i]) / p(x[i])
 9      w_sum ← w_sum + w[i]
10      w ← w ∪ {w[i]}
11  // 후보군 x에서 y 선택
12  w로부터 정규화된 CDF C 계산
13  C를 활용하여 w_z에 비례하여 무작위로 인덱스 z ∈ [0, M) 뽑기
14  y ← x[z]
15  return y, w_sum
```

**RIS와 MIS 섞기**

위에서는 source PDF p가 하나라고 가정했지만, MIS에서 그랬듯, 여러 이미 잘 되는 표집 기술들이 존재함. 어차피 ![TargetPdf](/Images/RestirForGameGi/ResampledImportanceSamplingDesiredPdf.png)가 양수일 때 p가 양수이기만 하면 M → ∞일 수록 y의 분포는 ![TargetPdf](/Images/RestirForGameGi/ResampledImportanceSamplingDesiredPdf.png)에 점근하지만, source PDF p의 생김새는 y의 PDF가 얼마나 잘 되느냐와 ![TargetPdf](/Images/RestirForGameGi/ResampledImportanceSamplingDesiredPdf.png)에 얼마나 빠르게 수렴하느냐를 결정하기도 함. 실제로 target PDF ![TargetPdf](/Images/RestirForGameGi/ResampledImportanceSamplingDesiredPdf.png)가 두 함수의 곱(예를 들면 lighting × BSDF)이라고 하면, y의 PDF가 얼마나 잘 되느냐는 source PDF가 어떤 함수(lighting? 아니면 BSDF?)에서 왔느냐에 따라 다르다.

다행히도 RIS 내부적으로 MIS를 사용하여 분산 줄이기를 해줄 수 있다. MIS를 통해 후보군 명단을 뽑은 다음, 여기서 구한 MIS(혼합) PDF를 source PDF로 사용하여 남은 RIS를 처리해주면 된다.

근데 MIS의 복잡도는 사용하는 기술의 개수에 따라 제곱에 비례하여 증가한다.

여기서는 후보의 개수를 늘리는 방법으로 시공간 재사용을 해준다. 이때 시간적으로나 공간적으로나 각각 다른 source PDF와 피적분함수 영역을 사용한다.

## 2.2. 가중치 저장소 표집

가중치 저장소 표집Weighted reservoir sampling (WRS)이란 어떤 연속된, 지속적으로 들어오는 데이터 스트림stream {x<sub>1</sub>, &hellip; x<sub>M</sub>}에 대해서 N 개의 원소를 무작위로 표집하는 알고리듬의 한 종류이다. RIS에서처럼 각 원소에는 가중치 w(x<sub>i</sub>)가 있으며, 이 가중치에 따른 확률로 x<sub>i</sub>를 선택하게 된다:

![WrsWeightsProbability](/Images/ReStir/WrsWeightsProbability.png)

저장소 표집은 원소마다 딱 한 번만 처리하며, 메모리엔 오로지 N 개의 원소만 있을 수 있다. 스트림의 크기 M은 사전에 몰라도 된다.

보통 저장소 표집 알고리듬은 원소 x<sub>i</sub>가 출력 집합에 여러 번 등장할 수 있는지 여부로 분류하곤 한다. 즉, 표본을 고를 때, 대체할 표본이 *있*냐 *없*냐를 보는 것이다. 몬테 카를로의 경우 x<sub>i</sub>를 독립적으로 고를 것이기 때문에 대체할 표본이 *있*는 WRS를 다룰 것이다.

저장소 표집은 입력 스트림의 원소를 들어온 순서대로 처리하며, N 개의 표본을 저장할 수 있는 *저장소reservoir*에 표본을 저장한다. 스트림의 어느 시점에서나 저장소 표집은, 저장소의 표본들이 목표하는 분포(현재까지 처리한 모든 원소에 대해서)로부터 뽑히도록하는 불변량을 유지한다. 스트림이 끝나면 저장소를 반환한다. 이 논문에서는 N = 1, 즉 저장소에 표본이 딱 하나 밖에 없는 경우만 다루도록 한다.

스트림에 새 원소가 들어오면, 불변량을 유지하기 위해 저장소를 갱신해줘야 한다. 즉, m 개의 표본을 처리한 이후에 표본 x<sub>i</sub>가 ![WrsWeightsProbability](/Images/ReStir/WrsWeightsProbability.png)의 확률로 저장소에 등장한다는 것이다. 갱신 규칙에 의해 ![ReservoirReplacementProbability](/Images/ReStir/ReservoirReplacementProbability.png)의 확률로 저장소에 있는 x<sub>i</sub>를 다음 표본 x<sub>m + 1</sub>으로 교체한다. 이를 통해 x<sub>m + 1</sub>가 원하는 빈도에 따라 저장소에 등장할 수 있도록 해준다. 즉, 임의의 이전 표본 x<sub>i</sub>가 저장소에 있을 확률은 다음과 같다:

![XiRemainingInReservoirProbability](/Images/ReStir/XiRemainingInReservoirProbability.png)

이를 통해 불변량이 유지된다.

> ### 알고리듬 2: WRS

```
 1  class Reservoir
 2      y ← 0       // 출력 표본
 3      w_sum ← 0   // 가중치합
 4      M ← 0       // 지금까지 처리한 표본의 수
 5      function update(x_i, w_i)
 6          w_sum ← w_sum + w_i
 7          M ← M + 1
 8          if rand() < (w_i / w_sum) then
 9              y ← x_i
10  function reservoirSampling(S)
11      Reservoir r
12      for i ← 1 to M do
13          r.update(S[i], weight(S[i]))
14      return r
```

# Latex

DirectionOmega
```
\vec{\omega}
```

ReflectedRadianceL
```
L{\left(y, \omega \right )} = \int_{A}{\rho{\left(y, \vec{yx} \leftrightarrow \vec{\omega} \right )}L_{e}{\left(x \rightarrow y \right )}G{\left(x \leftrightarrow y \right )}V{\left(x \leftrightarrow y \right )}\textrm{d}A_{x}}
```

SimplifiedReflectedRadianceL
```
L = \int_{A}{f{\left(x \right )}\textrm{d}x}
```

IntegrandF
```
f{\left(x \right )} \equiv \rho{\left(x \right )}L_{e}{\left(x \right )}G{\left(x \right )}V{\left(x \right )}
```

ImportanceSampling
```
\left \langle L \right \rangle^{N}_{\textrm{is}} = \frac{1}{N}\sum^{N}_{i=1}{\frac{f{\left(x_{i} \right )}}{p{\left(x_{i} \right )}}} \approx L
```

MultipleImportanceSampling
```
\left \langle L \right \rangle^{M, N}_{\textrm{mis}} = \sum^{M}_{s=1}{\frac{1}{N_{s}}\sum^{N_{s}}_{i=1}{w_{s}{\left(x_{i} \right )}\frac{f{\left(x_{i} \right )}}{p_{s}{\left(x_{i} \right )}}}}
```

SingleSampleRisEstimator
```
\left \langle L \right \rangle^{M, 1}_{\textrm{ris}} = \frac{f{\left(y \right )}}{\hat{p}{\left(y \right )}} \cdot \left(\frac{1}{M} \sum^{M}_{j=1}{\textrm{w}{\left(x_{j} \right )}} \right )
```

NSampleRisEstimator
```
\left \langle L \right \rangle^{M, N}_{\textrm{ris}} = \frac{1}{N} \sum^{N}_{i=1} \left( \frac{f{\left(y_{i} \right )}}{\hat{p}{\left(y_{i} \right )}} \cdot \left(\frac{1}{M} \sum^{M}_{j=1}{\textrm{w}{\left(x_{ij} \right )}} \right ) \right)
```

TargetPdfForPixelQ
```
\hat{p}_{q}
```

SumOfRisWeights
```
\sum^{M}_{i=1}{\textrm{w}{\left(x_{i} \right )}}
```

WrsWeightsProbability
```
P_{i} = \frac{\textrm{w}{\left(x_{i} \right )}}{\sum^{M}_{j=1}{\textrm{w}{\left(x_{j} \right )}}}
```

ReservoirReplacementProbability
```
\frac{\textrm{w}{\left(x_{m + i} \right )}}{\sum^{m + 1}_{j=1}{\textrm{w}{\left(x_{j} \right )}}}
```

XiRemainingInReservoirProbability
```
\frac{\textrm{w}{\left(x_{i} \right )}}{\sum^{m}_{j=1}{\textrm{w}{\left(x_{j} \right )}}}\left(1 -  \frac{\textrm{w}{\left(x_{m + i} \right )}}{\sum^{m + 1}_{j=1}{\textrm{w}{\left(x_{j} \right )}}}\right ) = \frac{\textrm{w}{\left(x_{i} \right )}}{\sum^{m + 1}_{j=1}{\textrm{w}{\left(x_{j} \right )}}}
```