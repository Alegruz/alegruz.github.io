# 3D 게임 엔진 아키텍처 (Vulkan) (2023.01.24)
[Home](/README.md)

# 1. 개요

게임 엔진의 아키텍처에 대한 공부 노트. 2005년에 출판된 David Eberly의 3D Game Engine Architecture의 한국어 + 최신화 버전이라고 생각하면됨. 본래 책에서는 OpenGL로 모든 것을 처리했으나 이 공부 노트에서는 전부 Direct3D 12와 Vulkan으로 작성하기로 함.

독자가 이미 알고 있어야 하는 것들:
* C/C++
* 컴퓨터 그래픽스
* 자료구조 / 알고리듬
* 약간의 Direct3D 12와 Vulkan
* 운영체제
* 등등...

## 1.1. 삼각형 그리기

그래픽스의 헬로 월드 == 삼각형 그리기.

