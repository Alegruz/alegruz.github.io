# 그리드 기반 저장소로 다중 조명 렌더링하기 (2022.10.23)
[Home](/README.md)

* [Jakub Bokšanský](https://github.com/boksajak), NVIDIA.
* [Paula Jukarainen](https://developer.nvidia.com/blog/author/pjukarainen/), NVIDIA.
* [Chris Wyman](https://cwyman.org/), NVIDIA

# 초록

문제:
* 광원이 많은 장면을 효율적으로 렌더링하기
* NEE 같은 방법으로 수많은 광원풀에서 shade를 할 광원을 뽑는 건 쉬운 일이 아님
* 표집은 효율적이어야 하고, shade에 유의미한 조명을 뽑아야 하고, 노이즈가 적으면서도 편향성이 적어야 함

보통 이를 위해 광원풀을 표집을 하기 쉽도록 사전처리를 해서 좋은 자료 구조에 넣어줌. 근데 이게 구현/구축/갱신하기가 복잡함.

여기서는 *ReGIR*이라는 새로운 표집 알고리듬 제시함. 간단한 균등 그리드 구조와 ReSTIR를 바탕으로 함.

# 1. 도입

실시간 광선 추적의 장점
* 이미지 퀄리티 스고이
* 정확한 그림자/간접광/반사광

여기에 디노이저를 추가해주면 라이트 매핑 없이도 훌륭한 품질로 렌더링 가능함. 심지어 동적인 장면도 가능함.

근데 이게 광원이 많아지면 그림자 처리할 때 노이즈가 발생하게 됨

그럼 도대체 shading을 할 때 어떤 광원을 골라야 제일 노이즈가 덜 나옴?

