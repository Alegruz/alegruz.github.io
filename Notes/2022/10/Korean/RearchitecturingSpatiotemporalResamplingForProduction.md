# 시공간 표집 제품화를 위해 재구조화하기 (2022.10.23)
[Home](/README.md)

* [Chris Wyman](https://cwyman.org/), NVIDIA
* [Alexey Panteleev](https://developer.nvidia.com/blog/author/alexeypanteleev/), NVIDIA.

# 초록

[Bitterli et al.의 최근 논문](/Notes/2022/10/Korean/SpatiotemporalReservoirResamplingForRealTimeRayTracingWithDynamicDirectLighting.md)을 통해 수백만개의 조명으로부터의 동적인 직접광을 렌더링하기 위한 실시간, 다중 조명 알고리듬을 소개했음. 이건 RIS + WRS가 핵심임. 실시간으로 복잡한 조명을 실시간 수준으로 가져 오긴 했는데, 그래도 게임에서 쓰기엔 비쌈. 이 논문에선 알고리듬적으로 몇 가지 개선하고, 제품화를 하여 7배나 그 비용을 줄이고 메모리 일관성을 높여서 광선 비용을 확 줄여서 이미지 품질을 높이고, 품질과 성능을 tradeoff할 수 있는 매개변수들을 제시함.

# 1. 도입

1. 오프라인에서 몬테 카를로 광선/경로 추적으로 렌더링함.
2. RTX 나옴. 이제 실시간으로 몬테 카를로 방법 적용 가능
3. 그럼에도 실시간으로 하기엔 빡셈 (scalability 이슈도 있고)
4. 이걸 제품화하려면 scalability가 있어야 함

ReSTIR 재구조화:

* 편향이 발생하는 원인과 이에 따른 노이즈와의 관계에 대한 이해
  * 단순한 휴리스틱으로 편향성과 노이즈 둘 다 잡을 수 있음
* RIS로 연산의 형태를 *재구성reshape*해서 내부 루프의 비일관적인 메모리 fetch를 밖으로 빼냄
* 매개변수와 퀄리티의 관계를 분석
  * 픽셀 당 최대 광선 개수를 2개에서 5개로 향상
* 프레임 당 전역 배리어 제거
  * 시간 버퍼에서 공간 표본 뽑으면 프레임 내부 종속성 제거 가능
* 표본 재사용과 shading 디커플링
  * 재사용이 버린 표본을 shading하여 주어진 비용만큼 퀄리티 개선할 수 있음
* 가시성 재사용으로 퀄리티와 성능 교환하기
  * 디커플링한 shading에선 픽셀에서 *오로지* 한 두 개 정도의 광선만이 shading에 영향을 줌.
  * 선택적으로 광선을 추적하면 퀄리티는 낮아져도 비용은 줄어듦

여기에 전통적인 최적화 방법 사용
* 자료 구조 압축
* 중간 자료 축소
* 연산 중복 제거
