# 광선 추적 전역 조명을 위한 세계 공간 시공간 저장소 재사용 (2022.10.24)
[Home](/README.md)

* [Guillaume Boissé](https://github.com/gboisse), AMD.

# 초록

문제:
* 복잡한 광원으로 가득한 장면에서 실시간으로 경로 추적 전역 조명을 렌더링하기

저장소 기반 재표집 방법이 노이즈를 줄여주면서도 픽셀 당 그림자 광선 몇 개 밖에 안 써도 됨. 근데 현재 이미지 공간 기반으로 저장소를 사용하는 방법들은 효율적으로 간접광을 처리하기 위해 위해 더 많이 튕길 때의 경우까지 확장하지 않음.

여기서는 세계 공간에서 ReSTIR를 적용하여 카메라 경로에 있는 임의의 정점에서 효율적으로 빛을 표집하게 해줌. 여기에서는 GPU에서 구현한 해시 그리드를 통해 경로 정점의 저장소를 이 그리드의 한 셀로 캐싱을 해줌. 이를 통해 확률적으로 시공간적으로 이웃 저장소를 잘 재사용할 수 있게 해줌.

# 1. 도입

[ReSTIR](/Notes/2022/10/Korean/SpatiotemporalReservoirResamplingForRealTimeRayTracingWithDynamicDirectLighting.md) 잘 됨. 여기에 [RTXDI](/Notes/2022/10/Korean/RearchitecturingSpatiotemporalResamplingForProduction.md)에 의해 좀 더 최적화가 되어 게임 같은 실시간 어플리케이션에서도 적용할 수 있음.

[ReSTIR GI](/Notes/2022/10/Korean/ReStirGiPathResamplingForRealTimePathTracingRevisited.md)는 이 방법을 전역 조명으로 확장함. 근데 이건 ReSTIR가 직접광에 대해서 해주는 것만큼이나 이차적인 정점에 대한 조명 분포를 잘 표집해주지 않음. 이거만 해주면 노이즈를 더 줄여줄 텐데.

빠른 경로 공간 필터링 방법[Binder et al. 2018]의 경우 공간 해싱을 통해서 그리드 룩업 한 방에 세계 공간에서 이웃 경로 정점을 효율적으로 찾을 수 있게 해줌.

여기에 [Jarzynski and Olano 2020]에선 GPU에서 도는 여러 해시 함수의 성능을 측정했음.

이 논문에선 [Binder et al. 2018]의 경로 공간 필터링 방법과 ReSTIR를 섞어서 2차적인 경로 정점을 저장소에서 재사용할 수 있도록 해줌.