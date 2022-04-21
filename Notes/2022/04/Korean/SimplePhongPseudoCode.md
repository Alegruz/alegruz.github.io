# 간단한 퐁 셰이딩 수식 (2022.04.21)
[Home](../README.md)

# 퐁 셰이딩

![NumberOfLights](/Images/Phong/NumberOfLights.png)

![Figure](/Images/Phong/Figure.png)
참고: 빛의 방향이라고 해서 광원이 빛을 보내는 방향이라고 생각할 수 있으나, 그래픽스 계에서는 반대로 사용함;;

![CShaded](/Images/Phong/CShaded.png)

![CDiffuse](/Images/Phong/CDiffuse.png)

![CSpecular](/Images/Phong/CSpecular.png)

![CAmbient](/Images/Phong/CAmbient.png)

```
N = \textrm{number of lights}
\textbf{c}_{\textrm{shaded}} = \textbf{c}_{\textrm{diffuse}} + \textbf{c}_{\textrm{specular}} + \textbf{c}_{\textrm{ambient}}
\textbf{c}_{\textrm{diffuse}} = \textbf{c}_{\textrm{surface}} \sum_{i}^{N}{\left \langle {\textbf{n}}\cdot{\textbf{l}} \right \rangle^+ }
\textbf{c}_{\textrm{specular}} = \textbf{c}_{\textrm{surface}} \sum_{i}^{N}{\left \langle {\textbf{r}_i}\cdot{\textbf{v}} \right \rangle^{\textrm{sh}} \textbf{c}_{\textrm{light}_i} }
\textbf{c}_{\textrm{ambient}} = \textbf{c}_{\textrm{surface}} \sum_{i}^{N}{\textbf{c}_{\textrm{light}_i} \textbf{a}_i}
```