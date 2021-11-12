# 마칭 큐브 공부 노트 (2021.11.12)

참고한 책들:
* [Computer Graphics Principles Practice](https://en.wikipedia.org/wiki/Computer_Graphics:_Principles_and_Practice)
* [Real-Time Rendering](https://www.realtimerendering.com/)

## 마칭 큐브란?

### 명시적 곡면과 암시적 곡면<sup>[1](#footnote_1)</sup>

우선 **명시적 곡면**과 **[암시적 곡면](https://en.wikipedia.org/wiki/Implicit_surface)**의 차이를 이해해야 한다. 명시적 곡면이란 우리가 OpenGL이나 DirectX에 직접 정점 자료와 색인 자료를 넘겨주듯이 일일이 공간에 이미 정점과 모서리가 주어진 곡면을 의미한다. 암시적 곡면이란 고등학교 기하와 벡터, 혹은 대학교 선형대수나 그래픽스 수업에서 자주 다루었던 F(x, y, z) = 0 형태의 함수를 의미한다. x + 2y - 3z + 1 = 0라는 식이 3차원 평면을 의미함은 그 누구라도 알 수 있다. 이게 우리 눈에는 좀 더 익고 보기 편하더라도, 이걸 결국 정점과 색인 자료로, 즉 명시적으로 표현해서 렌더링을 해줘야한다.

---

<div id="footnote_1">
<p>1. 이 문단은 <a href="https://fluidenginedevelopment.org/">김도엽 저자의 &lt;The Fluid Engine Development></a>를 참고하여 작성함</p>
</div>