---
layout: post
title:  지형에 일관된 식물상과 동물상 저작하기 소스 코드 분석
date:   2022-04-23 00:00:00 +0000
categories: simulation
lang: "ko"
---

[소스 코드 링크](https://github.com/pecormiernocca/authoring-consistent-landscapes)

# 파일 구성

실행 시
1. `conditions.py`
2. `flora.py`
3. `fauna.py`

순으로 실행이 됨.

우선 R<sub>0</sub>을 `conditions.py`에서 처리하고, 이후 R<sub>1</sub>을 `flora.py`, R<sub>2</sub>를 `fauna.py`에서 처리할 듯.

# `conditions.py`

간단하게 코드 진행만 봤을 땐,

1. `dem_filled.tif` 파일을 불러옴
2. 물 데이터 생성
3. 12 개월치의 일조량 데이터 생성
4. 온도 데이터 생성

## 물 데이터

DEM 데이터를 바탕으로 물 데이터를 생성함.

1. DEM 데이터 `dem` 행렬에 대해 `drain.compute(dem, source)`을 호출함
    1. `flux.flux(dem, source)` 호출함
        1. 열의 개수가 `dem`의 원소의 개수이고, 행이 4개인 이웃 정수형 행렬 `neighbors` 생성.
            * 0번째 행은 같은 행 혹은 같은 노드 내에서 낮은 이웃
            * 1번째 행은 같은 행 혹은 같은 노드 내에서 그 다음으로 낮은 이웃
            * 2번째 행은 같은 열 혹은 같은 노드 내에서 낮은 이웃
            * 3번째 행은 같은 열 혹은 같은 노드 내에서 그 다음으로 낮은 이웃
        2. 열의 개수가 `dem`의 원소의 개수인 정수형 열벡터 `parse` 생성
        3. `flow.compute_neighbors_grad(dem, neighbors, parse)` 호출

## 월별 일조량 데이터

## 온도 데이터

![Temperature](/assets/images/AuthoringConsistentLandscapesWithFloraAndFauna/Temperature.png)

온도는 단순히 -(dem / 100) 으로 처리함.

# `flora.py`

1. 일조량, 온도, 물, 토양 데이터를 받아옴
    * 온도 데이터는 불러온 후 온도 offset(기본 0) 만큼 더해줌
    * 물 데이터는 자연 로그로 받아오고, 그 후 offset(기본 0) 만큼 더해줌.
    * 토양 데이터는 `geology.load(soil_file_path, colors)`로 불러옴
        1. `soil_file_path`로부터 `rgb_data` 가져옴
        2. 위의 데이터를 정수로 간단화: ![SoilDataToInt](/assets/images/AuthoringConsistentLandscapesWithFloraAndFauna/SoilDataToInt.png)
            * 즉, 32비트 정수를 8비트로 구분하여, 00000000<span style="background-color:rgb(255,0,0)">00000000</span><span style="background-color:rgb(0,255,0)">00000000</span><span style="background-color:rgb(0,0,255)">00000000</span> 와 같이 나누겠다는 의미.
        3. 결론적으로 `geol`라는 행렬/이미지는 각 픽셀별로 해당하는 soil의 index를 갖고 있을 것
2. 데이터로 RAG<sub>0</sub> 구축
    1. 월별 온도. `ecosys.convert(온도 + 월별 평균 온도, 일교차(저점), 일교차(고점))
        * 온도를 [1 - 10] 스케일로 수정
        * ![ConvertedTemperature](/assets/images/AuthoringConsistentLandscapesWithFloraAndFauna/ConvertedTemperature.png)
    2. 월별 배수량
    3. 월별 일조량
    * 월별 배수량, 일조량도 위의 식으로 동일하게 처리.
        * ![ConvertedDrainage](/assets/images/AuthoringConsistentLandscapesWithFloraAndFauna/ConvertedDrainage.png)
        * ![ConvertedIllumination](/assets/images/AuthoringConsistentLandscapesWithFloraAndFauna/ConvertedIllumination.png)
    * `conditions` = { 월별 일조량, 월별 온도, 월별 배수량 }
3. 식물 간 경쟁 처리 `ecosys.plant_compet(plants, conditions, geol)`
    * 식물별 데이터:
        * `illum`: 일조량
        * `temp`: 온도
        * `moisture`: 지상 습도
        * 위의 데이터는 각각 (최소, 최대, 경쟁)의 값을 갖고 있음.
        * `geology`: 각 색깔별로 생존 가능성을 의미 (1이면 생존, 0이면 생존 불가)
    1. 각 식물마다 
        1. 밀도 계산
            1. 
        2. 데이터(일조량, 온도, 배수량 등) `gpi` 데이터에 기록
4. 결과 `tif` 파일로 저장

# `fauna.py`

1. 초식동물, 육식동물의 인구 설정
2. 자원 데이터 받아옴
3. 물 데이터 체인화
4. 식생의 밀도 맵 계산
5. 접근성 맵 계산
6. 물 체인 단순화 및 노드화
    1. 물을 마실 수 있는 지역(픽셀) 구하기
    2. 해당 픽셀의 최근접 타원 계산
    3. 각 영역별로 타원 저장
7. 영역 별 노드 저장
8. 동물 밀도 맵 계산
9. 트레일 가중치 계산
10. 자원 간 경로 계산
11. 경로 to 트레일
12. 일상 계획 계산
