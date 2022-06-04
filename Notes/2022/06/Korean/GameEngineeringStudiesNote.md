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

## 2. IK의 수치적 해법

### 각속도

아래 그림에서처럼 질량이 m인 어떤 한 입자를 단위 벡터 **A**에 길이가 r인 줄로 연결했다고 가정.

![AngularVelocityFigure](/Images\GameEngineering\AngularVelocityFigure.png)

이때 오른손 좌표계라고 할 때(**X** × **Y** = **A**) θ(t)가 입자를 매단 줄을 **XY** 평면에 사영한 벡터가 시간 t 때 반시계 방향으로 **X** 축과 이루는 각도라고 가정. 이때 이 입자의 *각속도*는 각도의 변화량이며, 보통 ω로 표기함:

![AngularVelocityEquation](/Images\GameEngineering\AngularVelocityEquation.png)

각속도는 보통 회전축 **A**에 평행하면서 크기가 \|ω(t)\|인 벡터로 표기함. 즉 각속도 벡터 **ω***(t)는 다음과 같음:

![AngularVelocityVectorEquation](/Images\GameEngineering\AngularVelocityVectorEquation.png)

회전하는 이 입자가 공간에서 이동하는 속력 v(t)는 이 입자의 각속도와 이 입자와 회전축 간의 길이 간의 곱으로 구할 수 있음:

v(t) = \|ω(t) r\|

여기서 방향 정보를 추가한다고 가정. 벡터 함수 **r**(t)이 회전축을 기준으로 한 상대 위치라고 가정할 때, 선형 속도 벡터 **v**(t)는 다음과 같음:

**v**(t) = **ω**(t) × **r**(t)

![LinearVelocityFigure](/Images\GameEngineering\LinearVelocityFigure.png)

이때 선형 속도는 각속도와 직각을 이룸.

<p><a href="https://commons.wikimedia.org/wiki/File:Angular_velocity1.svg#/media/File:Angular_velocity1.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Angular_velocity1.svg/1200px-Angular_velocity1.svg.png" alt="Angular velocity1.svg"></a><br>By <a href="//commons.wikimedia.org/wiki/User:Krishnavedala" title="User:Krishnavedala">Krishnavedala</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="http://creativecommons.org/publicdomain/zero/1.0/deed.en" title="Creative Commons Zero, Public Domain Dedication">CC0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=18123063">Link</a></p>

만약 이 입자가 선형 속도 **v**만큼 이동할 때의 각속도는 결국 **v**의 수직 성분 **v**<sub>⊥</sub>에 대해서 구할 수 있음. v(t) = ω(t) r 이므로 

v<sub>⊥</sub> = ω(t) × r<br>
ω(t) = v<sub>⊥</sub> / r<br>
ω(t) = (v sin(θ)) / r

이건 2D에서의 얘기이므로, 벡터로 확장하면,

![AngularVelocityVectorEquation](/Images\GameEngineering\AngularVelocityVectorEquation.png)

이므로,

**ω**(t) = ω(t) **A** = ((\|**v**\| sin(θ)) / r) **A**<br>
**ω**(t) = ((r \|**v**\| sin(θ **A**)) / (r r))<br>
**ω**(t) = ((**r** × **v**) / r<sup>2</sup>)

**a** × **b** = \|**a**\|\|**b**\|sin(θ)**n**이기 때문 ^_^

### 야코비 방법

해석학적인 방법으로 IK를 해결하기엔 요즘 애니메이션들은 좀 복잡한 편임. 이 경우엔 매 프레임마다 지속적으로 목표 지점까지 다다르도록 각 관절의 각도를 변화시켜주는 것임. 여러 방법이 있지만 가장 대중적인 방법이 바로 *야코비Jacobian* 방법임. 야코비 방법은 야코비 행렬을 사용하는 방법으로, 이 행렬은 편미분으로 구성된 행렬을 의미함.

수학적으로 보자면, 만약 임의의 여섯 가지 함수가 존재하고, 여섯 가지의 서로 독립적인 변수들 x<sub>i</sub>가 있을 때, 그 결과인 y<sub>i</sub> = f<sub>i</sub>(x<sub>i</sub>)이 있을 것임.

이때 각 결과값의 변화량을 각 입력값의 변화량으로 표현할 수 있음:

![DifferentialsOfYi](/Images\GameEngineering\DifferentialsOfYi.png)

위의 식을 벡터에 대해서 표현할 수 있음:

![VectorDifferentialsOfY](/Images\GameEngineering\VectorDifferentialsOfY.png)

이때 이 X에 대한 F의 편미분으로 구성된 행렬을 야코비라 부르며, 현재 x<sub>i</sub> 값들에 대한 함수라고 보면 됨. 마치 X의 속도를 정의역으로, Y의 속도를 치역으로 갖는 함수라고 생각하면 됨:

![JacobianMapping](/Images\GameEngineering\JacobianMapping.png)

어떤 시점에서 야코비는 결국 x<sub>i</sub>에 대한 함수임. 그 다음 시점에서는 **X**가 바뀌기에 야코비로 그 변환을 표현해줄 수 있음. 즉, x<sub>i</sub>는 각 관절의 값이 되며, y<sub>i</sub>는 end effector의 위치와 orientation이 됨.

![EndEffectorY](/Images\GameEngineering\EndEffectorY.png)

이런 식으로 표현할 수도 있는 것임.

IK의 경우 야코비는 곧 관절의 각속도 ![AngularVelocity](/Images\GameEngineering\AngularVelocity.png)를 end effector의 위치와 orientation ![EndEffectorPositionOrientation](/Images\GameEngineering\EndEffectorPositionOrientation.png)이 됨. 즉,

![JacobianEndEffector](/Images\GameEngineering\JacobianEndEffector.png)

여기서 **V**는 선형 및 회전 속도로 구성된 벡터이므로, end effector의 희망 변화량을 의미하게 됨. 이 희망 변화량은 현재 위치/orientation과 목표 간의 차이에 기반하여 구하게 될 것임.

![VelocityVector](/Images\GameEngineering\VelocityVector.png)

![AngularVelocity](/Images\GameEngineering\AngularVelocity.png)는 각 관절의 속도, 혹은 각 관절의 변화량을 의미함. 이게 결국 구해야하는 값임:

![AngularVelocitiesVector](/Images\GameEngineering\AngularVelocitiesVector.png)

야코비 행렬 J는 결국 뒤의 둘 사이의 관계를 의미하며, 현재 pose에 대한 함수임. 이 행렬은 다음과 같이 생겼을 것임:

![JacobianMatrix](/Images\GameEngineering\JacobianMatrix.png)

야코비 행렬의 각 항은 결국 특정 관절이 특정 end effector에게 주는 변화량을 의미함. 예를 들어 팔꿈치 관절이라면 end effector에 대한 회전 변화량 ω은 그저 해당 관절에서의 회전축에 대한 속도를 의미할 뿐임. 회전 관절의 경우 end effector의 선형 변화량은 곧 관절의 회전축과, 해당 관절에서 end effector까지를 잇는 벡터의 외적과 같음. 회전 관절에서의 회전은 곧 즉각적으로 end effector의 선형 움직임이 됨.

목표 각속도 및 선형 속도는 현재 end effector의 설정 값과 목표 설정 값 간의 차를 바탕으로 구하는 것임. end effector의 각속도와 선형 속도를 각 관절의 회전으로 구하는 방법:

![AngularLinearVelocities](/Images\GameEngineering\AngularLinearVelocities.png)

여기서 문제는 end effector의 목표 속도를 가장 잘 맞추는 일차 결합을 구하는 것임. 야코비는 이 문제를 행렬의 형태로 처리하려는 것임.

참고로 이때 야코비 행렬을 만들 때, 각 관절의 좌표계가 동일해야한다는 것임.

예를 들어 검지처럼 한 방향으로만 회전이 가능한 관절이 세 개인 경우, 

![PlanarThreeJointManipulator](/Images\GameEngineering\PlanarThreeJointManipulator.png)

end effector인 E를 목표 G로 옮겨야 함. 각 관절의 회전축은 현재 그림과 수직임. 각 관절마다의 회전을 적용한 결과 벡터 g<sub>i</sub>는 각 관절의 회전축와 각 관절에서 end effector까지를 가리키는 벡터 **V**<sub>i</sub>의 외적으로 구할 수 있으며, 이것이 야코비 행렬의 열을 결정하게 됨. 이때 g<sub>i</sub>의 크기는 관절과 end effector 간의 거리를 의미하는 함수가 됨.

![ChangesInPosition](/Images\GameEngineering\ChangesInPosition.png)

end effector에 가할 목표 변화량은 end effector의 현재 위치와 목표 위치 간의 차임 (선형 변화량. 선형 속도):

![DesiredChange](/Images\GameEngineering\DesiredChange.png)

이제 목표 변화량을 값으로 표현한 벡터를 야코비 행렬 곱하기 관절 변화량으로 두면 됨:

![JacobianEndEffector](/Images\GameEngineering\JacobianEndEffector.png)

선형 속도: Z<sub>i</sub> × (E - J<sub>i</sub>)

![JointAngleChangesJacobian](/Images\GameEngineering\JointAngleChangesJacobian.png)

### 야코비 역행렬

야코비를 이제 구했으면 

![JointAngleVelocities](/Images\GameEngineering\JointAngleVelocities.png)

이 식을 해결해야함. 만약 J가 사각행렬이라면 역행렬 J<sup>-1</sub>을 구해서 end effector의 속도가 주어졌을 때 각 관절의 각속도를 구할 수 있음. 

![JacobianInverse](/Images\GameEngineering\JacobianInverse.png)

근데 만약 역행렬이 존재하지 않는다면 현재 system은 주어진 관절 각도에 대해 singular 상태라고 함. 특이성은 관절의 속도의 일차 결합이 희망 end effector 속도를 낼 수 없을 때 발생함. 예를 들어 완전히 손가락을 쭉 편 상태에서, target 위치가 손가락 끝마디나 중간마디 중간 어딘가에 있을 때에 특이성이 발생함. 이 경우 각 관절 각도의 변화량 g는 언제나 목표 방향과 수직일 것임. 그러므로 어떻게 결합을 하든 목표 방향 벡터를 만들 수가 없음. 근데 이건 우리가 시각적으로 보이니까 특이성이 발생하는 걸 알지, 이게 언제나 그렇게 판단할 수는 없는 것임.

![SingularConfiguation](/Images\GameEngineering\SingularConfiguation.png)

이게 단순히 특이성이 아니라고 해서 문제가 없는 건 아님. 만약 위의 예시에서 약간은 수직이 아니라고 해도, 저 g들 갖고 desired motion vector 만들려면 값이 엄청 커짐. 이러면 특이성 근처의 상황에서는 막 확 확 바뀌게 됨. 이건 좀 더 그럴 듯한 값으로 좀 clamping을 해줘야 함. 그렇게 해도 수치적 오류에 의해 예측하기 어려운 움직임을 낼 수도 있음.

특이성의 문제를 줄이려면 manipulator가 반복적이면 됨. 즉, 만족할 제한사항보다 더 많은 DOF가 있으면 됨. 이러면 야코비가 사각 행렬이 아니고, IK 문제에 대해 여러 가지, 무한한 해가 존재할 수도 있음. 야코비 행렬이 사각 행렬이 아니므로 전통적인 역행렬이 존재하지 않음. 하지만 만약 J의 열들이 일차 독립적이라면(즉, J가 full column rank를 갖는다면) (J<sup>T</sup>J)<sup>-1</sup>이 존재하므로, *유사역원pseudoinverse* J<sup>+</sub>로 J<sup>+</sub> 사용. 이게 가능한 이유가, 어떤 행렬을 자신의 전치행렬과 곱하면 그 결과는 무조건 사각행렬이기 때문에 역행렬이 존재할 수도 있음:

![PseudoInverse](/Images\GameEngineering\PseudoInverse.png)

J의 행들은 일차 독립적이므로 JJ<sup>T</sup>은 invertible이며, 유사역행렬은 J<sup>+</sup> = J<sup>T</sup>(JJ<sup>T</sup>)<sup>-1</sup>이 됨. 유사역행렬은 end effector의 목표 속도를 필요한 관절의 각도 변화량으로 매핑해주는 함수임. 이를 통해 역행렬을 대체하면 됨:

![PseudoInverseMapping](/Images\GameEngineering\PseudoInverseMapping.png)

이제 위의 식에서 약간의 수정을 해준 다음, LU 분해를 통해 β에 대한 아래 방정식을 풀 수 있게 됨:

![LUDecomposedPseudoInverse](/Images\GameEngineering\LUDecomposedPseudoInverse.png)

이걸 이제 아래 식으로 수정해서 ![AngularVelocity](/Images\GameEngineering\AngularVelocity.png)를 구할 수 있음:

![SubstitutedVelocities](/Images\GameEngineering\SubstitutedVelocities.png)
