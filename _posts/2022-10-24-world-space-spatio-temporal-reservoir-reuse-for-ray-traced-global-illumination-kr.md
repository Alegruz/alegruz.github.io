---
layout: post
title:  광선 추적 전역 조명을 위한 세계 공간 시공간 저장소 재사용
date:   2022-10-24 00:00:00 +0000
categories: graphics
lang: "ko"
---

* [Guillaume Boissé](https://github.com/gboisse), AMD.

# 초록

문제:
* 복잡한 광원으로 가득한 장면에서 실시간으로 경로 추적 전역 조명을 렌더링하기

저장소 기반 재표집 방법이 노이즈를 줄여주면서도 픽셀 당 그림자 광선 몇 개 밖에 안 써도 됨. 근데 현재 이미지 공간 기반으로 저장소를 사용하는 방법들은 효율적으로 간접광을 처리하기 위해 위해 더 많이 튕길 때의 경우까지 확장하지 않음.

여기서는 세계 공간에서 ReSTIR를 적용하여 카메라 경로에 있는 임의의 정점에서 효율적으로 빛을 표집하게 해줌. 여기에서는 GPU에서 구현한 해시 그리드를 통해 경로 정점의 저장소를 이 그리드의 한 셀로 캐싱을 해줌. 이를 통해 확률적으로 시공간적으로 이웃 저장소를 잘 재사용할 수 있게 해줌.

# 1. 도입

[ReSTIR](/_posts/2022-10-16-spatiotemporal-reservoir-resampling-for-real-time-ray-tracing-with-dynamic-direct-lighting-kr.md) 잘 됨. 여기에 RTXDI에 의해 좀 더 최적화가 되어 게임 같은 실시간 어플리케이션에서도 적용할 수 있음.

[ReSTIR GI](/_posts/2022-10-20-restir-gi-path-resampling-for-real-time-path-tracing-revisited-kr.md)는 이 방법을 전역 조명으로 확장함. 근데 이건 ReSTIR가 직접광에 대해서 해주는 것만큼이나 이차적인 정점에 대한 조명 분포를 잘 표집해주지 않음. 이거만 해주면 노이즈를 더 줄여줄 텐데.

빠른 경로 공간 필터링 방법[Binder et al. 2018]의 경우 공간 해싱을 통해서 그리드 룩업 한 방에 세계 공간에서 이웃 경로 정점을 효율적으로 찾을 수 있게 해줌.

여기에 [Jarzynski and Olano 2020]에선 GPU에서 도는 여러 해시 함수의 성능을 측정했음.

이 논문에선 [Binder et al. 2018]의 경로 공간 필터링 방법과 ReSTIR를 섞어서 2차적인 경로 정점을 저장소에서 재사용할 수 있도록 해줌.

# 2. 배경 지식

ReSTIR는 직접광만 처리. 픽셀마다 M 개의 표본 x<sub>i</sub>를 간단한 분포 p로부터 우선 뽑음. 여기서 좀 더 고퀄리티의 분포 ![TargetPdf](/Images/ReStirGi/TargetPdf.png)에 따라 한 번 더 표집, 즉 재표집을 하는 것임. 보통 이때 ![TargetPdf](/Images/ReStirGi/TargetPdf.png)는 실제 셰이딩에 사용할 조명 함수 f와 최대한 비슷하게 해줌. 이때 가시성까지 고려해주면 비용이 비싸니까 가시성만 없는, 즉 그림자 없는 조명이라 부르는 것으로 ![TargetPdf](/Images/ReStirGi/TargetPdf.png)를 설정함. 이를 통해 픽셀마다 초기 저장소를 구축할 수 있음.

이 저장소들을 시공간적으로 합쳐주어 이웃 픽셀 간의 상관관계를 효율적으로 사용할 수 있게 해줌.

# 3. 월드 공간 저장소 캐싱

경로 정점 재사용을 확장하기 위해 월드 공간에서 효율적으로 이웃 정점을 찾을 수 있도록 해줌. 경로 공간 필터링을 통해 해시 그리드를 사용하여 cell 내의 radiance 표본의 평균 값을 사용하는 식으로 필터링을 해줌. 이러면 GPU에 적합하므로 저장소 캐시로 쓸 수 있음. 헌데 저장소 재사용을 할 땐 정점의 이웃에 있는 여러 저장소를 섞어주어 여러 후보 표본을 구하여 노이즈를 줄여줘야함.

이를 위해 자료 구조를 적응형으로 만들어서 해시 그리드의 각 cell마다 저장소의 list를 저장하도록 함. 이러면 월드 공간에서 경로 이웃들 간의 저장소를 효율적으로 공유할 수 있게 되어 성능 부담도 적으면서도 많은 스트림 표본을 얻을 수 있게 됨. GPU에서 이 자료구조를 효율적으로 구축하기 위해선 해당 프로세스를 아래 알고리듬에서 보여주듯이 여러 단계로 나누었음:

```
foreach Vertex v ∈ Paths do
    Reservoir r ← RIS(v)
    Paths[v] ← r    // 초기 저장소 저장
    cell_index ← FindOrInsertCell(v)    // 5절 참고
    index_in_cell ← atom_inc(cell_counters[cell_index])
    append_buffer.Append(<v, cell_index, index_in_cell>)

index_buffer ← ParallelPrefixSum(cell_counters)

foreach triplet ∈ append_buffer do
    base_offset ← index_buffer[triplet[1]]
    scatter_offset ← base_offset + triplet[2]
    cell_storage[scatter_offset] ← triplet[0]
```

*셀 카운터 증가*<br>
각 경로 정점 v마다 해시 그리드의 `cell_index`를 처리해주고 셀 내의 저장소의 개수를 원자적으로 증가 시켜줘야함. 추가적으로 원자 연산의 결과를 저장함. 이 값은 셀 storage 내에서 저장소를 scatter할 인덱스인 index_in_cell임. 모든 필요한 정보인 `<v, cell_index, index_in_cell>`를 `append_buffer`에 저장해줌.

*병렬 prefix 합*<br>
셀 카운터에 병렬 prefix 합 연산을 적용하고 그 결과를 `index_buffer`에 저장하여 각 셀의 base offset을 저장함.