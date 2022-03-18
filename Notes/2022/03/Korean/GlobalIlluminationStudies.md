# 전역 조명 공부 노트 (2022.03.15)
[Home](../README.md)

이 노트는 Real-Time Rendering 책 등을 읽고 한국어로 정리한 책입니다.

# Real-Time Rendering

## 물리 기반 셰이딩

### 빛의 물리

결국 물리 기반 셰이딩이라는 것은 빛과 물질의 상호작용을 의미함.

물리광학에 의하면 빛이라는 것은 전자기적 횡파, 즉 전파하는 방향에 수직으로 전자기장이 진동하는 파임. 이때 전기장과 자기장은 서로 또 수직이며, 둘 간의 길이의 비는 고정되어있음. 이 비율이 곧 위상 속도임.

<p><a href="https://commons.wikimedia.org/wiki/File:Electromagneticwave3D.gif#/media/File:Electromagneticwave3D.gif"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Electromagneticwave3D.gif" alt="Electromagneticwave3D.gif"></a><br>By <a href="//commons.wikimedia.org/w/index.php?title=User:Lookang&amp;amp;action=edit&amp;amp;redlink=1" class="new" title="User:Lookang (page does not exist)">Lookang</a> many thanks to <a rel="nofollow" class="external text" href="http://www.phy.ntnu.edu.tw/ntnujava/index.php">Fu-Kwun Hwang</a> and <a rel="nofollow" class="external text" href="http://www.compadre.org/osp/items/detail.cfm?ID=7305">author of Easy Java Simulation = Francisco Esquembre</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=16874302">Link</a></p>

위의 그림에서 볼 수 있듯 가장 단순한 빛은 완벽한 사인 함수임. 이러한 파동은 하나의 *파장wavelength*을 가지며, 그리스 문자로 <i>&lambda;</i>로 표현함. 우리가 인지하는 빛의 색은 이 파장과 매우 밀접한 관련이 있음. 그렇기에 파장이 하나인 빛을 *단색광monochromatic light*이라 부름. 그러나 실무에서 다루는 대부분의 광파는 *다색성polychromatic*을 띠기에 여러 파장을 가짐.

위와 같은 빛을 *직선 편광linearly polarized light*이라 부름. 즉, 공간에 고정된 한 점에서 전기장과 자기장이 선을 따라서 앞 뒤로 움직인다는 뜻임. 여기서는 

## 전역 조명

결국 렌더링을 해서 구하려는 것은 광휘radiance임. 지금까지는 *반사 방정식reflectance equation*으로 구했음:

![ReflectanceEquation](/Images/GlobalIllumination/ReflectanceEquation.svg)

![ReflectanceEquationImage](/Images/GlobalIllumination/ReflectanceEquationImage.png)

---

Latex:

반사 방정식:

```
L_{o}\left ( \textbf{\textrm{p}}, \textbf{\textrm{v}} \right ) = \int_{\textbf{\textrm{I}}\in \Omega}{f\left ( \textbf{\textrm{l}}, \textbf{\textrm{v}} \right )L_{i}\left ( \textbf{\textrm{p}}, \textbf{\textrm{l}} \right )\left ( \textbf{\textrm{n}} \cdot \textbf{\textrm{l}} \right )^+}d\textbf{\textrm{l}}
```