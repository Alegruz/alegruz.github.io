# 시공간 저장소 재표집을 통한 빠른 볼륨 렌더링 (2022.10.24)
[Home](/README.md)

* [Daqi Lin](https://dqlin.xyz/), University of Utah.
* [Chris Wyman](https://cwyman.org/), NVIDIA
* [Cem Yuksel](http://www.cemyuksel.com/), University of Utah.

# 초록

볼륨 렌더링의 문제:
* 복잡하고 동적인 광원에서 렌더링하기 빡셈
* 실시간이면 더 빡셈

해결방법:
* [ReSTIR](/Notes/2022/10/Korean/SpatiotemporalReservoirResamplingForRealTimeRayTracingWithDynamicDirectLighting.md) 적용해보기

픽셀 당 단일 경로를 처리하는데도 좋은 수렴 성능을 보임. 이를 위해서 시공간 재표집을 통해 완전 중요도 표집을 근사하여 선택한 표본의 확률을 제대로 추정해줌. 여기서 핵심은 비용이 싸면서 편향된 기법을 통해 후보 경로에 따른 산란을 근사하는게 최종적으로 shading할 때 편향성을 추가하지는 않는다는 점임. 이를 통해 전달 평가 기법을 합칠 수 있게 됨: 재사용은 여러 번 처리할 수 있도록 값싼 근사를 사용하면서, 최종 shading 때는 편향되지 않은 기법을 사용하는 것임.

이를 통해 노이즈가 적고 고화질 볼륨을 사용하더라도 interactive rate을 보장하는, 볼륨 emission과 같은 동적인 광원이 있는 interactive한 볼륨 경로 추적을 제공함.

여기에 디노이징까지 걸어도 이 방법을 쓰면 볼륨의 세세한 디테일을 살려줌.

# 1. 도입

요즘 영화, 게임, 시뮬레이션과 같은 가상 장면에서 연기, 불, 구름 같은 participating 매질 렌더링하는거 상당히 중요함. 이거 제대로 렌더링해야 현실감과 그 분위기를 줄 수 있음. 근데 이거 실시간으로 하는게 좀 빡셈. 심지어 래스터 파이프라인도 이거 따로 처리해줘야했음. 요즘 광선 추적법 뜨는데, 볼륨 렌더링도 광선 추적법으로 가능해야 일관되게 렌더링이 가능할 것임.

이 논문에서는 다중 산란과 볼륨 emission도 처리하는 효과적인 경로 표집법을 통한 실시간 볼륨 렌더링을 제시함. 이를 위해 [RIS](/Notes/2022/10/Korean/ImportanceResamplingForGlobalIllumination.md)와 [ReSTIR](/Notes/2022/10/Korean/SpatiotemporalReservoirResamplingForRealTimeRayTracingWithDynamicDirectLighting.md)를 경로 공간으로 일반화함. 이러면 피적분함수에 좀 더 가깝게 근사하는 중요도 표집이 가능함: 즉, 경로에 대해서 적분하는 것임. 또한 비용과 메모리 부담을 줄이는 최적화도 제시함.

Contributions:
* RIS, ReSTIR를 복잡한 경로 적분으로의 일반화
* 볼륨 경로 적분을 위한 효율적인 중요도 표집 추정량
  * 다중 산란 및 볼륨광 emission 포함
* 시간 reprojection과 강력한 시간 재사용을 위한 실용적인 속도 재표집 방법
* 최적화한 경로 공간 전달 추정량
  * 최종 경로 결과가 아닌 중요도 표집에만 영향 주어 결과에 편향을 주지 않으면서도 효과적인 편향된 추정량을 사용할 수 있게 해줌.

이 논문에서 제시하는 렌더러는 interactive하게 돌음. 편향되지 않은 렌더링(정적 볼륨 + 동적 광원)도 할 수 있긴 한데, 약간의 편향성이 가능하다면 표본 분산을 줄이고 좀 더 동적인 부분을 처리할 수 있음.

