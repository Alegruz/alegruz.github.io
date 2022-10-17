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

즉, 적당히 최적인 PDF p에서 z 개의 표본을 우선 뽑는다. 이 z 개의 표본을 갖는 집합에서 확률 p(z \| **x**)에 따라 한 표본을 또다시 뽑는 것이다. 이때의 표본 집합의 모든 z 개의 표본은 각각 가중치를 갖는데, 이 가중치에 비례하여 확률을 부여한다. 이때 한 표본을 뽑을 때, target PDF에 근사하게 표본을 뽑아야 하므로 가중치에 target PDF의 정보를 추가한다:

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

<blockquote>
  <h3 id="알고리듬-1-ris">알고리듬 1: RIS</h3>
  <p>입력: M, q: 픽셀 q에 대해 생성할 후보 표본의 수 M(M ≥ 1)
출력: 표본 y와 RIS 가중치의 합 <img src="/Images/ReStir/SumOfRisWeights.png" alt="SumOfRisWeights"></p>
<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code> 1  // 후보군 x = {x_1, ..., x_M} 생성
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
</code></pre></div></div>
</blockquote>

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

<blockquote>
  <h3 id="알고리듬-2-wrs">알고리듬 2: WRS</h3>
  <div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code> 1  class Reservoir
 2      y ← 0       // 출력 표본
 3      w_sum ← 0   // 가중치합
 4      M ← 0       // 지금까지 처리한 표본의 수
 5      function update(x_i, w_i)
 6          w_sum ← w_sum + w_i
 7          M ← M + 1
 8          if rand() &lt; (w_i / w_sum) then
 9              y ← x_i
10  function reservoirSampling(S)
11      Reservoir r
12      for i ← 1 to M do
13          r.update(S[i], weight(S[i]))
14      return r
</code></pre></div></div>
</blockquote>

# 3. 시공간 재사용과 함께 RIS 스트리밍하기

RIS와 WRS가 ReSTIR 알고리듬의 기본임. 이 둘을 바탕으로 알고리듬과 자료구조를 간단하게 유지하면서도 스트리밍을 통해 무작위로 후보를 처리할 수 있게 해줌. 이를 통해 WRS의 속성에 의해 *시공간 재표집spatiotemporal resampling*을 통해 이웃 픽셀과 이전 프레임의 후보를 효율적으로 재사용하고 합칠 수 있는 방법을 소개함.

다만, 너무 순진하게 이웃 픽셀의 표본들이 서로 다른 BRDF에서 왔다는 점과 표면의 orientation이 서로 다르다는 점을 고려 안 하고 시공간 재표집을 하게되면 편향성이 생길 것임. 이러면 기하적으로 불연속적인 구간에서 에너지 손실이 발생하게 됨.

## 3.1. 저장소 표집으로 RIS 스트리밍하기

WRS 알고리듬을 RIS에 적용해서 스트리밍 알고리듬으로 바꾸는 건 쉬움. 그냥 저장소를 연속적으로 생성된 후보 x<sub>i</sub>와 이에 대응하는 가중치에 따라 갱신해주면 됨.

> ### 알고리듬 3: WRS를 활용한 RIS 스트리밍

```
 1  foreach 픽셀 q ∈ Image do
 2      Image[q] ← shadePixel(RIS(q), q)
 3  function RIS(q)
 4      Reservoir r
 5      for i ← 1 to M do
 6          generate x_i ~ p
 7          r.update(x_i, phat_q(x_i) / p(x_i))
 8      r.W = (1 / (phat_q(r.y))) * ((1 / r.M) * r.w_sum) // 단일 표본 RIS 추정량
 9      return r
10  function shadePixel(Reservoir r, q)
11      return f_q(r.y) * r.W
```

우선 광원의 표면에서 균등하게 표본을 생성한 다음, 그림자가 져있지 않은 경로의 contribution ![TargetDistribution](/Images/ReStir/TargetDistribution.png)를 target 분포로 삼아 살아남은 N 개의 RIS 표본에 대해서 그림자 광선만을 추적해줌. M의 개수에 따라 얼마나 잘 렌더링이 되는지를 확인해본 결과, M이 증가할 수록 RIS가 제일 렌더링이 잘 됨. 위의 알고리듬은 공간 복잡도 자체는 상수지만, 시간 복잡도 자체는 O(M)임.

## 3.2. 시공간 재사용

위에서 언급한 방법은 각 픽셀 q에서 독립적으로 후보를 생성하고, 이를 target PDF ![TargetPdfForPixelQ](/Images/ReStir/TargetPdfForPixelQ.png)에 따라 재표집을 해준 것임. 참고로, 이웃의 픽셀 간에는 상당한 상관관계가 존재함. 예를 들어 그림자가 지지 않은 조명(![TargetDistribution](/Images/ReStir/TargetDistribution.png))을 사용할 경우, 공간적으로 보면 당연히 근처 픽셀들의 geometry 항이나 BSDF 항은 비슷하지 않겠음? 이 상관관계를 처리하는 가장 순진한 방법은 픽셀마다 후보군과 가중치를 생성하고, 두번째 단계에서 자기 픽셀과 이웃의 픽셀을 합쳐서 *재사용reuse*을 해주는 것임. 가중치 연산은 첫번째 단계에서 처리가 될테니까 이웃 후보군을 재사용하는게 같은 수의 후보군을 새롭게 생성하는 것보다 더 효율적임.

근데 이건 실제로 불가능함. 재사용할 후보마다 *저장*을 해야되니까. 이걸 피할 수 있는 방법으로는 저장소 표집의 중요한 속성을 활용하면 됨. 즉, 입력 스트림에 접근할 필요도 없이 여러 저장소를 합칠 수 있다는 점임.

저장소는 보통 현재 선택한 표본 y와 현재까지 처리한 표본들의 가중치의 합 w<sub>sum</sub>이라는 상태를 가짐. 두 저장소를 합치려면 각 저장소의 y를 마치 w<sub>sum</sub>의 가중치를 갖는 새 표본으로 간주하고 이걸 새 저장소의 입력으로 넣어주면 됨. 수학적으로 보면 두 저장소의 입력 스트림을 합쳐서 저장소 표집을 해준 거랑 똑같음. 시간 복잡도도 *상수*인데다가, 그 어느 스트림에도 후보를 저장해줄 필요도 없음. 그냥 처리할 저장소의 현재 상태만 갖다 쓰면 됨.

> ### 알고리듬 4: 여러 저장소 스트림 합치기
> 입력: 합칠 저장소 r<sub>i</sub>
> 출력: r<sub>1</sub>, &hellip;, r<sub>k</sub>의 입력 스트림을 이어 붙인 것과 같은 합쳐진 저장소
> 

```
1   function combineReservoirs(q, r_1, r_2, ..., r_k)
2       Reservoir s
3       foreach r ∈ {r_1, ..., r_k} do
4           s.update(r.y, phat_q(r.y) * r.W * r.M)
5       s.M ← r_1.M + r_2.M + ... + r_k.M
6       s.W = (1 / (phat_q(s.y))) * ((1 / (s.M)) * s.w_sum) // 단일 표본 RIS 추정량
7       return s
```

보면 알겠지만 O(k)의 시간 복잡도를 가짐. 이웃 픽셀 q'의 표본이 서로 다른 target 분포 ![NeighboringPixelTargetPdf](/Images/ReStir/NeighboringPixelTargetPdf.png)를 갖고 있다는 점을 잊으면 안 됨. 그러므로 표본을 ![NeighboringTargetPdfFactor](/Images/ReStir/NeighboringTargetPdfFactor.png)로 다시 작성해주어 현재 픽셀에 비해 이웃 쪽이 over/undersample 되었는지 여부를 처리해주어야 함. 결론적으로 얻게 된 식은 ![ResultingTerm](/Images/ReStir/ResultingTerm.png) 인데, 알고리듬 3에서의 이미 구한 값으로 치환해주면 ![ResultTermSuccinct](/Images/ReStir/ResultTermSuccinct.png)로 표현해줄 수 있음.

**공간 재표집Spatial Reuse**

우선 알고리듬 3의 `RIS(q)` 함수를 통해 모든 픽셀 q마다 M 개의 후보를 생성해주어 프레임 버퍼에 각 저장소를 저장해줌. 두번째 단계로는 각 픽셀이 k 개의 이웃 픽셀을 선택하고, 이웃 픽셀들의 저장소와 자기 저장소를 알고리듬 4를 이용해서 합쳐줌. 각 픽셀마다 시간 복잡도는 O(k + M)이지만, 결국 k · M 개의 후보를 얻게 됨. 게다가 이전 재사용 단계의 결과를 입력으로 활용해서 공간 재사용을 *반복*해줄 수도 있음. 즉, n 번 반복을 하게되면 O(nk + M)의 복잡도를 갖겠지만, 픽셀 당 k<sup>n</sup>M 개의 후보를 얻을 수 있음.

**시간 재표집Temporal Reuse**

실시간이면 당연히 프레임이 존재할 것. 그럼 직전 프레임에서 후보를 뽑아서 재사용해줄 수도 있음. 프레임을 렌더링한 다음에 각 픽셀의 최종 저장소를 다음 프레임에서 재사용할 수 있게 저장해두고, 이제 렌더링할 다음 프레임에서는 단순히 직전 프레임 뿐만 아니라 지금까지 렌더링한 *모든* 직전 프레임의 저장소에서의 후보를 뽑아서 쓸 수 있어 이미지 퀄리티가 훨씬 좋아짐.

**가시성 재사용Visibility Reuse**

솔직히 후보의 개수는 무한대로 늘어날 순 있지만, 그럼에도 아예 노이즈가 없을 순 없음. M이 무한대로 가면서 표본의 분포가 target PDF ![TargetPdf](/Images/RestirForGameGi/ResampledImportanceSamplingDesiredPdf.png)에 점근은 하겠지만, 애초에 ![TargetPdf](/Images/RestirForGameGi/ResampledImportanceSamplingDesiredPdf.png) 자체가 피적분함수 f를 완벽하게 표집하는게 아님. 실무에선 보통 ![TargetPdf](/Images/RestirForGameGi/ResampledImportanceSamplingDesiredPdf.png)를 그림자가 지지 않은 경로의 contribution으로 설정되기 때문에 M이 커질 수록 가시성에 의해 발생하는 노이즈가 생기게 됨. 특히 큰 장면에서는 더욱 그럴 것임. 이걸 해결하기 위해선 *가시성 재사용*을 진행함. 시공간 재사용하기 전에 우선 각 픽셀의 저장소의 표본 y의 가시성을 확인함. 만약 y가 가려져 있다면 해당 저장소는 버림. 즉, 가려져 있는 표본들은 이웃을 확인하지 않음. 만약 지역적으로 가시성이 일관된 상태라면, 공간 재사용을 한 최종 표본은 가려지지 않은 상태일 것임.

> ### 알고리듬 5: 시공간 재사용을 적용한 RIS 알고리듬
> 입력: 직전 프레임의 저장소를 갖는 이미지 크기 버퍼
> 출력: 현재 프레임의 저장소


```
 1  function reservoirReuse(prevFrameReservoirs)
 2    reservoirs ← new Array[ImageSize]
 3    // 초기 후보군 생성
 4    foreach 픽셀 q ∈ Image do
 5      reservoirs[q] ← RIS(q)  // 알고리듬 3
 6    // 초기 후보들의 가시성 확인
 7    foreach 픽셀 q ∈ Image do
 8      if shadowed(reservoirs[q].y) then
 9        reservoirs[q].W ← 0
10    // 시간 재사용
11    foreach 픽셀 q ∈ Image do
12      q' ← pickTemporalNeighbor(q)
13    reservoirs[q] ← combineReservoirs(q, reservoirs[q], prevFrameReservoirs[q'])  // 알고리듬 4
14    // 공간 재사용
15    for iteration i ← 1 to n do
16      foreach 픽셀 q ∈ Image do
17        Q ← pickSpatialNeighbors(q)
18        R ← {reservoirs[q'] | q' ∈ Q}
19        reservoirs[q] ← combineReservoirs(q.reservoirs[q], R)
20    // 픽셀 색 연산
21    foreach 픽셀 q ∈ Image do
22      Image[q] ← shadePixel(reservoirs[q], q) // 알고리듬 3
23    return reservoirs
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

TargetDistribution
```
\hat{p}{\left(x \right )} = \rho{\left(x \right )}L_e{\left(x \right )}G{\left(x \right )}
```

NeighboringPixelTargetPdf
```
\hat{p}_{q'}
```

NeighboringTargetPdfFactor
```
\frac{\hat{p}_{q}{\left(r.y \right )}}{\hat{p}_{q'}{\left(r.y\right)}}
```

ResultingTerm
```
\frac{\hat{p}_{q}{\left(r.y \right )}}{\hat{p}_{q'}{\left(r.y\right)}} \cdot r.\textrm{w}_{\textrm{sum}}
```

ResultTermSuccinct
```
\hat{p}_{q}{\left(r.y \right )} \cdot r.W \cdot r.M
```