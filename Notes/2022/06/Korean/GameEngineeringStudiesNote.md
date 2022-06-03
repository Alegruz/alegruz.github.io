# 게임공학 공부 노트 (2022.06.03)

[Home](../../../../README.md)

## 1. Inverse Kinematics 입문

### 개요

FK: 연속된 관절과, 각 관절에 대한 각도가 주어졌을 때, 관절의 끝지점의 위치를 결정하는 문제.

연속된 관절들을 kinematics chain이라 부름. 어깨가 움직이면 팔꿈치가 움직이듯, chain처럼 움직인다는 것임.

FK의 문제는, kinematics chain의 마지막 뼈 끝부분의 위치를 모른다는 것. 반대로 IK는 그 위치를 안다는 것임.

결국 IK는 어떤 kinematics chain이 주어지고, 목표 위치 target이 주어졌을 때, 마지막 뼈 끝부분, 즉 end effector의 위치를 target으로 보내는 문제를 해결하는 문제임. 당연히 이 방법에는 해가 없을 수도, 해가 하나만 있을 수도, 여러 가지 해가 있을 수도 있음. 해가 여러 개면, 여러 다양한 방법~~꼼수~~으로 구하면 됨.

### IK 문제 푸는 법

두 가지 방법이 있음: 해석학적 방법, 수치적 방법.

* 해석학적 방법
    * 직접 해결할 수 있는 방정식이 존재함.
    * 문제 풀이가 빠르고, 가장 선호하는 방법임.
    * 연결고리가 얼마 없는 경우에는 거의 안 쓺.
* 수치적 방법
    * 해는 아니고, 거의 해에 가까운 답을 찾는 방법.
    * 주로 사용하는 방법:
        * 여러 번 반복하여 해에 점근하는 방법.
        * 더 작은 문제들로 나누어 푸는 방법.
    * 해석학적 방법보다는 비쌈.
    * 대표적인 방법:
        * Cyclic Coordinate Decent (CCD)
            * 각 연결고리를 독립적으로 바라봄.
            * 잎 노드(end effector)에서부터 차례대로 부모로 올라가는데, 이때 end effector과 target 간의 오류를 최소화하려고 함.
            * 적당히 괜찮은 결과가 나올 때까지 몇 번만 처리하면 됨.
            * 해가 좀 비현실적일 수도 있음.
                * 잎 노드부터 보니까 막 손목이 엄청 과도하게 꺾여있거나 그럴 수도 있음.
        * Jacobian Matrix
            * 전체 IK chain에 대해 처리함
            * 행렬의 각 열이 곧 각 연결고리가 회전할 때 end effector가 어떻게 변하느냐(선형 근사)에 대한 것임.
            * 정답 구하는 게 느린데, CCD보다는 일반적으로 더 괜찮은 결과가 나옴.

### Grassman 대수

Exterior product 혹은 wedge product.

R<sup>3</sup>의 두 벡터의 wedge product의 결과는 벡터가 아닌, bivector라는 새로운 존재임. 

<p><a href="https://commons.wikimedia.org/wiki/File:Cross_product_parallelogram.svg#/media/File:Cross_product_parallelogram.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Cross_product_parallelogram.svg/1200px-Cross_product_parallelogram.svg.png" alt="Cross product parallelogram.svg"></a><br>By <a href="//commons.wikimedia.org/w/index.php?title=User:Acdx&amp;amp;action=edit&amp;amp;redlink=1" class="new" title="User:Acdx (page does not exist)">User:Acdx</a> - Self-made, based on <a href="//commons.wikimedia.org/wiki/File:Cross_parallelogram.png" title="File:Cross parallelogram.png">Image:Cross_parallelogram.png</a>, Public Domain, <a href="https://commons.wikimedia.org/w/index.php?curid=4436475">Link</a></p>

Cross product를 할 때 보통 두 벡터 **a**와 **b**가 평행사변형을 만드는데, 이게 곧 **a**와 **b**의 wedge product의 결과로 나온 bivector라고 생각하면 됨. 벡터와 bivector의 wedge product는 trivector가 생김.

이렇듯 스칼라, 벡터, bivector, trivector과 wedge 연산자에 대한 대수를 R<sup>3</sup>에 대한 그라스만 대수라 부름.

[그라스만 대수 참고](http://www.terathon.com/gdc12_lengyel.pdf)

### Wedge Product

**a**와 **b**의 wedge product는 **a** ∧ **b**로 표현. "a wedge b"라고 읽음.

* s ∧ t = t ∧ s = st
* s ∧ **v** = **v** ∧ s = s**v**
* **v** ∧ **v** = 0

교환 법칙이 반대로 됨.

* **a** ∧ **b** = -**b** ∧ **a**

### Bivector

* 두 벡터가 기저를 이루는 2D 영역을 의미함.

<p><a href="https://commons.wikimedia.org/wiki/File:Wedge_product.JPG#/media/File:Wedge_product.JPG"><img src="https://upload.wikimedia.org/wikipedia/commons/9/92/Wedge_product.JPG" alt="Wedge product.JPG"></a><br>By <a href="//commons.wikimedia.org/wiki/User:Brews_ohare" title="User:Brews ohare">Brews ohare</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=8808180">Link</a></p>

위의 그림에서처럼 **a** ∧ **b**인지, **b** ∧ **a**인지에 따라 방향이 달라짐.

Bivector을 삼차원 벡터로 표기할 수 있음.

세 개의 기저 벡터 **e**<sub>1</sub>, **e**<sub>2</sub>, **e**<sub>3</sub>가 있을 때, 어떤 삼차원에서의 벡터 **a** = a<sub>1</sub>**e**<sub>1</sub> + a<sub>2</sub>**e**<sub>2</sub> + a<sub>3</sub>**e**<sub>3</sub>

이때

**a** ∧ **b** = (a<sub>1</sub>b<sub>2</sub> - a<sub>3</sub>b<sub>2</sub>)(**e**<sub>2</sub> ∧ **e**<sub>3</sub>) + (a<sub>3</sub>b<sub>1</sub> - a<sub>1</sub>b<sub>3</sub>)(**e**<sub>3</sub> ∧ **e**<sub>1</sub>) + (a<sub>1</sub>b<sub>2</sub> - a<sub>2</sub>b<sub>1</sub>)(**e**<sub>1</sub> ∧ **e**<sub>2</sub>)

즉, wedge product의 결과로 세 bivector 기저 **e**<sub>2</sub> ∧ **e**<sub>3</sub>, **e**<sub>3</sub> ∧ **e**<sub>1</sub>, **e**<sub>1</sub> ∧ **e**<sub>2</sub>가 생김. 이걸 기저 bivector라 부름.

앞으로:

**e**<sub>12</sub> = **e**<sub>1</sub> ∧ **e**<sub>2</sub>
**e**<sub>23</sub> = **e**<sub>2</sub> ∧ **e**<sub>3</sub>
**e**<sub>31</sub> = **e**<sub>3</sub> ∧ **e**<sub>1</sub>
**e**<sub>123</sub> = **e**<sub>1</sub> ∧ **e**<sub>2</sub> ∧ **e**<sub>3</sub>

![3dBivector](https://wikimedia.org/api/rest_v1/media/math/render/svg/b5ebbcc52e866e2b117ba960d89a40f529f5539d)

결합 법칙 안 됨.

Trivector:

![Trivector](https://i.stack.imgur.com/UNRIn.png)

**a** ∧ **b** ∧ **c** = (a<sub>1</sub>b<sub>2</sub>c<sub>3</sub> + a<sub>2</sub>b<sub>3</sub>c<sub>1</sub> + a<sub>3</sub>b<sub>1</sub>c<sub>2</sub> - a<sub>1</sub>b<sub>3</sub>c<sub>2</sub> - a<sub>2</sub>b<sub>1</sub>c<sub>3</sub> - a<sub>3</sub>b<sub>2</sub>c<sub>1</sub>)(**e**<sub>1</sub> ∧ **e**<sub>2</sub> ∧ **e**<sub>3</sub>)

크기는 det([**a** **b** **c**]).

기저가 하나 밖에 없으니 마치 스칼라 같다고 해서 유사스칼라pseudoscalar라고 부름.

### 사원수. 쿼터니언.

3D 그래픽스에서 회전을 표현할 때 사용하는 수. 

쿼터니언의 장점:
* 저장 공간 적음
* 쿼터니언 합치는데 필요한 산술 연산 횟수가 더 적음
* 부드러운 애니메이션을 만드는데 더 보간이 잘 됨.

#### 사원수학

사원수 집합은 사차원 벡터 공간이고, 이 집합에 속한 원소 **q** = < w, x, y, z > = w + x*i* + y*j* + z*k*.

보통 **q** = s + **v**라 표현하는데, 여기서 s는 **q**의 w 성분, 즉 스칼라 성분을 의미하고, **v**는 x, y, z 성분을 의미하는 벡터 성분을 의미.

*i*, *j*, *k*는 허수 개념의 확장.

* *i*<sup>2</sup> = *j*<sup>2</sup> = *k*<sup>2</sup> = -1
* *ij* = -*ji* = *k*
* *jk* = -*kj* = *i*
* *ki* = -*ik* = *j*

교환 법칙 X. 그래서 올바른 순서로 곱해야함.

**q**<sub>1</sub>**q**<sub>2</sub> = (w<sub>1</sub>w<sub>2</sub> - x<sub>1</sub>x<sub>2</sub> - y<sub>1</sub>y<sub>2</sub> - z<sub>1</sub>z<sub>2</sub>) + (w<sub>1</sub>x<sub>2</sub> + x<sub>1</sub>w<sub>2</sub> + y<sub>1</sub>z<sub>2</sub> - z<sub>1</sub>y<sub>2</sub>)*i* + (w<sub>1</sub>y<sub>2</sub> - x<sub>1</sub>z<sub>2</sub> + y<sub>1</sub>w<sub>2</sub> + z<sub>1</sub>x<sub>2</sub>)*j* + (w<sub>1</sub>z<sub>2</sub> + x<sub>1</sub>y<sub>2</sub> - y<sub>1</sub>x<sub>2</sub> + z<sub>1</sub>w<sub>2</sub>)*k*

즉,

**q**<sub>1</sub>**q**<sub>2</sub> = s<sub>1</sub>s<sub>2</sub> - **v**<sub>1</sub>·**v**<sub>2</sub> + s<sub>1</sub>**v**<sub>2</sub> + s<sub>2</sub>**v**<sub>1</sub> + **v**<sub>1</sub>×**v**<sub>2</sub>임.

이때 둘 다 스칼라 성분이 0이면,

**q**<sub>1</sub>**q**<sub>2</sub> = -**v**<sub>1</sub>·**v**<sub>2</sub> + **v**<sub>1</sub>×**v**<sub>2</sub> = -**q**<sub>1</sub>·**q**<sub>2</sub> + **q**<sub>1</sub>×**q**<sub>2</sub>임.

#### 사원수로 회전하기

삼차원에서의 회전은 어떤 삼차원 공간 R<sup>3</sup>을 다시 자기 자신에 매핑하는 어떤 함수 φ라 생각하면 됨. φ가 회전이 되려면, 길이, 각도, 왼손/오른손 기준을 유지해야함.

\|\|φ(**P**)\|\| = \|\|**P**\|\|를 만족하면 길이는 보존됨.

φ(**P**<sub>1</sub>)·φ(**P**<sub>2</sub>) = **P**<sub>1</sub>·**P**<sub>2</sub>를 만족하면 각도도 보존됨.

φ(**P**<sub>1</sub>)×φ(**P**<sub>2</sub>) = φ(**P**<sub>1</sub>×**P**<sub>2</sub>)를 만족하면 손 기준도 보존됨.

이때 **P**가 스칼라 성분이 0인 사원수라고 가정하면 **P**<sub>1</sub>**P**<sub>2</sub> =  -**P**<sub>1</sub>·**P**<sub>2</sub> + **P**<sub>1</sub>×**P**<sub>2</sub>이니까, 결국 마지막 두 조건은 φ(**P**<sub>1</sub>)φ(**P**<sub>2</sub>) = **P**<sub>1</sub>**P**<sub>2</sub>로 표현 가능함.

이때 위의 방정식 φ(**P**<sub>1</sub>)φ(**P**<sub>2</sub>) = **P**<sub>1</sub>**P**<sub>2</sub>을 만족하는 함수 φ를 homomorphism이라 부름.

이때 이 함수는

φ<sub>**q**</sub>(**P**) = **qPq**<sup>-1</sup>의 형태를 띰.

이 식은 위의 모든 조건을 만족함. 이때 사원수 **q**는 축 **A**에 대하여 θ 만큼의 회전으로 대응해줘야함. 일단 여기서는 간단하게 문제를 보기 위해 **q** = s + **v**를 단위 사원수라고 가정함.

**qPq**<sup>-1</sup> = s<sup>2</sup>**P** + 2s**v**×**P** + (**v**·**P**)**v** - **v**×**P**×**v** = (s<sup>2</sup> - **v**<sup>2</sup>)**P** + 2s**v**×**P** + 2(**v**·**P**)**v**.

여기서 **v** = t**A**라고 가정. **A**는 단위 벡터.

**qPq**<sup>-1</sup> = (s<sup>2</sup> - **v**<sup>2</sup>)**P** + 2st**A**×**P** + 2t<sup>2</sup>(**A**·**P**)**A**.

임의의 축 **A**에 대해 벡터 **P**를 회전시키는 식:

**P**<sup>'</sup> = **P**cosθ + (**A**×**P**)sinθ + **A**(**A**·**P**)(1 - cosθ).

이 식과 위의 **qPq**<sup>-1</sup>를 비교해서 보면:

s<sup>2</sup> - t<sup>2</sup> = cosθ
2st = sinθ
2t<sup>2</sup> = 1 - cosθ

즉, t = sin(θ/2), s = cos(θ/2).

결국 단위 사원수 **q** = cos(θ/2) + **A**sin(θ/2)임.

이제 이걸 변환 행렬로 만들어주면

![p](https://wikimedia.org/api/rest_v1/media/math/render/svg/affdafb019a4f12ae1005e17f1b9b851abe7f55a)

![q](https://wikimedia.org/api/rest_v1/media/math/render/svg/84b90709066516db4e270bcdec2f3b96190f8f6f)

![prp](https://wikimedia.org/api/rest_v1/media/math/render/svg/a25ac497760c16d1445a3b157ea723ec2ff70e88)

![QuaternionRotationMatrix](https://wikimedia.org/api/rest_v1/media/math/render/svg/e7f45da9aa0beec9f7b83351ccbfaedf98e6bee0)

### 기하곱

**ab** = **a** · **b** + **a** ∧ **b**

즉, **ab**는 스칼라 성분과 bivector 성분 둘을 갖고 있음. bivector 자체는 **a**와 **b**가 이루는 모양에 대한 정보는 없음. 하지만 **a** · **b**에 있는 코사인 정보 덕에 기하곱을 통해 **a**와 **b**가 이루는 각을 알 수 있게 됨. 즉, **G** = **ab**는 단순 bivector를 확실하게 우리가 생각할 수 있는 평행사면형으로 만들어주는 것임. 물론 그 평행사변형을 구성하는 벡터의 크기나 순서는 **G**만 봐선 알 수 없지만, **b** 하나만 구해도 **a**를 구할 수 있음.

기하곱에서의 역원:

**v**<sup>-1</sup> = **v** / v<sup>2</sup>

이걸로 벡터 나눗셈을 구할 수 있음:

**a** / **b** = **ab**<sup>-1</sup>

이러면 반드시 **a** = **cb**가 될 것임. 이때 **c**는 어떤 벡터임.

이러면 **a** = (**a**/**b**)**b** = (**ab**/b<sup>2</sup>)**b** = ((**a** · **b**) / b<sup>2</sup>)**b** + ((**a** ∧ **b**) / b<sup>2</sup>)**b**

여기서 첫번째 성분은 **a**를 **b**에 사영하는 식과 같으므로 두번째 성분은 rejection의 역할을 해야 함.

<p><a href="https://commons.wikimedia.org/wiki/File:Projection_and_rejection.png#/media/File:Projection_and_rejection.png"><img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Projection_and_rejection.png" alt="Projection and rejection.png"></a><br>By <a href="//commons.wikimedia.org/w/index.php?title=User:Paolo.dL&amp;amp;action=edit&amp;amp;redlink=1" class="new" title="User:Paolo.dL (page does not exist)">Paolo.dL</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=19033807">Link</a></p>

> **a**를 **b**에 사영한 것이 **a**<sub>1</sub>, **a**에서 **b**로 reject한 것이 **a**<sub>2</sub>

즉, **a**<sub>||<b>b</b></sub> = (**a** · **b**) / **b**, **a**<sub>⊥<b>b</b></sub> = (**a** ∧ **b**) / **b**.

**G**/**b**의 결과는 결국 **G** = **ab**를 만족하는 **b**와 함께 정확한 크기와 각도를 갖는 **a** 벡터임.

만약 **G** = **av**일 때 **G** / **v**는 **a**인데, **G** / **a**는?

**G** / **a** = **v'**라고 가정하면, **v'a** = **G**임.

이때, **av** = **v'a**이므로, **v'** = **ava**<sup>-1</sup>임.

즉, **v'** = ((**a** · **v**) / **a**) + ((**a** ∧ **v**) / **a**) = ((**v** · **a**) / **a**) - ((**v** ∧ **a**) / **a**) = **v**<sub>||<b>a</b></sub> - **v**<sub>⊥<b>a</b></sub>가 됨.

이 식은 결국 **a** 벡터에 대한 반사와 같음. 결국 **a**에 대해 180도 회전한 식이 됨.

![VectorDivision](/Images\GameEngineering\VectorDivision.png)

이때 **v'**를 또다른 벡터 **b**에 대해서도 회전을 해주면 **v''**를 구할 수 있음.

![Rotor](/Images\GameEngineering\Rotor.png)

위와 같은 그림이 되는 것임. 결국 **v''** = **bv'b**<sup>-1</sup> = **bava**<sup>-1</sup>**b**<sup>-1</sup>이 됨. 이때 **R** = **ab**로 두면 **v''** = **RvR**<sup>-1</sup>이 됨.

여기서 **R**의 bivector는 위의 그림에서처럼 **a**와 **b**가 만드는 평면에 속함.

결론적으로 **v**는 **a** × **b** 벡터에 대해서 2θ 만큼 회전을 한 것임.

이때 **R** = **ba**를 rotor라고 부름. 여기서 2θ라는 각도는 **a**에서 **b** 방향, 즉 bivector **b** ∧ **a**의 방향과 평행함. 그래서 보통 **R** = **a** · **b** - **a** ∧ **b**.

3차원에서 **a** ∧ **b**는 **a** × **b**라는 회전축의 complement라고 생각할 수 있음. 여기서 complement라는 것은, x축의 complement는 y축과 z축의 bivector인 것. 이때 표기를 

![Complement](/Images\GameEngineering\Complement.png)

와 같이 표기함

즉, **a**와 **b**가 단위 벡터라면, **R** = cosθ - (sinθ) **n**<sup>-</sup>

여기서 **n**은 **a** × **b**와 같은 방향을 가리키는 단위 벡터임. 이건 2θ만큼 회전하는 것이니, θ만큼 회전하려면:

**R** = cos(θ/2) - (sin(θ/2)) **n**<sup>-</sup>
