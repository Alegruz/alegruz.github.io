# 간단한 퐁 셰이딩 수식 (2022.04.21)
[Home](../README.md)

# 퐁 셰이딩

![NumberOfLights](/Images/Phong/NumberOfLights.png)

![Figure](/Images/Phong/Figure.png)

참고: 빛의 방향이라고 해서 광원이 빛을 보내는 방향이라고 생각할 수 있으나, 그래픽스 계에서는 반대로 사용함;; 이건 **v**도 마찬가지

![CShaded](/Images/Phong/CShaded.png)

![CDiffuse](/Images/Phong/CDiffuse.png)

![CSpecular](/Images/Phong/CSpecular.png)

![CAmbient](/Images/Phong/CAmbient.png)

< ><sup>+</sup>은 대충 음수면 0으로 clamp하라는 뜻임. `max(lambertian, 0.0f)`를 사용하는 방법도 있음.

프로그래머가 직접 정해야하는 값들:
* sh: 얼마나 반짝반짝 맨들 맨들한가?
* **a**: 각 RGB 별로 ambience를 얼마나 줄 것인가 (보통 0.0 ~ 0.2 등... 직접 실험해보는 것을 추천)

프로그래머가 입력으로 줘야하는 값들:
* N: 빛의 개수. 셰이더 내에 매크로로 대충 정의해두고 어플리케이션과 값 맞춰서 써주면 됨. 대충 일단 퐁 구현할 때는 괜?찮을 듯.
* **n**: 보통 vertex attribute으로 vertex buffer에 position이랑 같이 있음.
* **c**<sub>light</sub>: constant buffer / uniform 변수로 광원의 색을 알려줘야함. 하얀색 광원만 있는 건 아니니까.

프로그래머가 구해야하는 값들:
* **l**: 아마 Constant buffer / uniform 변수로 점 광원의 월드 공간에서의 위치를 따로 줬을 텐데, 그 값을 `lightPosition`이라고 칩시다. 여기에 지금 처리해야할 표면 위의 점의 월드 공간에서의 위치를 정점 셰이더에서 픽셀 / 프래그먼트 셰이더로 넘겨 줬을 것임. 이걸 `worldPosition`이라 치면, **l**은 `lightPosition - worldPosition`임. ㅇㅇ 방향이 반대임 ㅋㅋ
* **r**: `reflect` 함수로 구하면 됨. 참고로 여기선 **l**이 아니라 -**l**값을 사용해야 제대로 된 반사 방향을 얻을 수 있음 ^_^.
* **v**: **l**이랑 마찬가지로 아마 카메라의 월드 공간에서의 좌표를 constant buffer / uniform 변수로 받았을 텐데, 이걸 `cameraPosition` 변수라 치면, **v** = `cameraPosition - worldPosition`임. ㅇㅇ 방향 반대임.
* **c**<sub>surface</sub>: 결국 텍스처에서 샘플링해서 구하면 됨.


```
N = \textrm{number of lights}
\textbf{c}_{\textrm{shaded}} = \textbf{c}_{\textrm{diffuse}} + \textbf{c}_{\textrm{specular}} + \textbf{c}_{\textrm{ambient}}
\textbf{c}_{\textrm{diffuse}} = \textbf{c}_{\textrm{surface}} \sum_{i}^{N}{\left \langle {\textbf{n}}\cdot{\textbf{l}} \right \rangle^+ \textbf{c}_{\textrm{light}_i}}
\textbf{c}_{\textrm{specular}} = \textbf{c}_{\textrm{surface}} \sum_{i}^{N}{\left \langle {\textbf{r}_i}\cdot{\textbf{v}} \right \rangle^{\textrm{sh}} \textbf{c}_{\textrm{light}_i} }
\textbf{c}_{\textrm{ambient}} = \textbf{c}_{\textrm{surface}} \sum_{i}^{N}{\textbf{c}_{\textrm{light}_i} \textbf{a}_i}
```