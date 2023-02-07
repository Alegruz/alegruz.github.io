# 3D 게임 엔진 설계 (2023.01.24)
[Home](/README.md)

# 1. 개요

게임 엔진의 설계에 대한 공부 노트. 2007년에 출판된 David Eberly의 3D Game Engine Design 2판(이하 3DGED2)의 한국어 + 최신화 버전이라고 생각하면됨. 본래 책에서는 OpenGL로 모든 것을 처리했으나 이 공부 노트에서는 전부 Direct3D 12와 Vulkan으로 작성하기로 함.

독자가 이미 알고 있어야 하는 것들:
* C/C++
* 컴퓨터 그래픽스
* 자료구조 / 알고리듬
* 약간의 Direct3D 12와 Vulkan
* 운영체제
* 등등...

## 1.1. 그래픽스 하드웨어와 게임의 진화

3DGED2는 2007년에 나왔는데, 당시에는 Xbox 360나 PS3와 같은 7세대 콘솔 게임기가 나오던 시기였음. 현재 2023년 기준으로는 CPU는 멀티 프로세싱이 대세이며, GPU는 RTX의 등장 이후 실시간 레이트레이싱이 가능해졌고, Tensor 코어로 인공지능이 대중화 되었음. 콘솔 시장을 보자면 마소의 Xbox Series X와 S, 소니의 PS5, 그리고 닌텐도의 휴대용 Nintendo Switch 등이 존재함. 그리고 한 가지 중요한 차이점은 바로 모바일 시장의 폭발임.

## 1.2. 소프트웨어의 진화

옛날에 게임 엔진이면 사실상 그냥 렌더링 엔진이었음. 하지만 2007년 때도 그랬지만 단순 그래픽스 뿐만 아니라 물리, 인공지능, 네트워킹, 스크립팅 등등 다 들어감. 이 책에서는 렌더링 쪽을 집중적으로 다룸.

2판에서는 씬 그래프 관리 시스템 등을 중심으로 다루고, 셰이더 시스템도 들어갔음.

이 한국어 판에서는 이 책을 진행하면서 GitHub에 올라간 여러 소스들을 보면서 공부를 할 것임.

## 1.3. 책 요약

크게 여섯 가지 파트로 나뉨:

1. 그래픽스.
   1. 2장에서 렌더링 시스템, 즉 변환, 카메라 모델, 컬링, 클리핑, 래스터화, 그래픽스 API 등등을 다룸.
   2. 3장에서 실제 렌더러 구현, 설계와 셰이더 시스템을 다룸.
2. 씬 그래프 관리.
   1. 4장에서 데이터를 씬 그래프로 구조화하는 핵심을 다룸.
   2. 5, 6, 7장에서 씬 그래프 관리 시스템의 노드와 하위 시스템에 대한 세부적인 설계 내용을 다룸.
3. 충돌 검출 및 물리.
   1. 8, 9장에서 3D에서의 물리와 일반적인 충돌 검출을 다룸.
4. 수학
   1. 10장에서 17장까지는 엔진에서 사용하는 여러 수학적 개념들을 다룸.
5. 소프트웨어 공학
   1. 18장에서 기본적인 개체지향설계 및 구현을 다룸.
   2. 19장에서 메모리 관리를 다룸.
6. 셰이더 특수 효과
   1. 20장에서 셰이더 샘플들을 여러 가지 소개함.

# 2. 그래픽 시스템

각 절 소개:

1절 좌표계와 2절 변환은 렌더링 엔진 뿐만 아니라 물리나 사운드에서도 사용하는 개념들임.

3절부터 6절까지는 2D 화면에 3D 객체를 그리는 방법을 배움. 이 노트에서는 Direct3D 12와 Vulkan을 사용함.

7절에서 렌더링 엔진을 설계하고 구현할 때의 논의점을 다룸.

8절에서 Direct3D 12, Vulkan에서 사용하는 벡터/행렬 규칙에 대해 다룸.

## 2.1. 기초

**튜플**: 보통 좌표 표현할 때 (x, y, z)라고 표현하잖음? 이게 3-튜플임. 2차원 좌표면 2-튜플이고. 우리가 학교에서 배운 좌표계 있잖음? 데카르트가 천장에 매달린 파리 보면서 생각해냈다던 그거. 그거를 **데카르트 좌표계Cartesian coordinate system**라 부르고, 이게 워낙 널리 쓰이다 보니 **표준 좌표계standard coordinate system**라고도 부름.

<p><a href="https://commons.wikimedia.org/wiki/File:Cartesian-coordinate-system.svg#/media/File:Cartesian-coordinate-system.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Cartesian-coordinate-system.svg/1200px-Cartesian-coordinate-system.svg.png" alt="Cartesian-coordinate-system.svg"></a><br>By <a href="//commons.wikimedia.org/wiki/User:Kbolino" title="User:Kbolino">K. Bolino</a> - Made by K. Bolino (<a href="//commons.wikimedia.org/wiki/User:Kbolino" title="User:Kbolino">Kbolino</a>), based upon earlier versions., Public Domain, <a href="https://commons.wikimedia.org/w/index.php?curid=869195">Link</a></p>

여기서 좌표계를 먼저 다루는 이유는, 그래픽스에서는 여러 가지 중요한 좌표계가 등장하기 때문임. 이때 이 좌표계를 **공간space**이라 부를 건데, 우리가 다룰 중요한 공간들은 **데카르트 공간Cartesian space**(우리가 다룰 나머지 모든 것들의 기반임), **모델 공간model space**(혹은 **객체 공간object space**), **월드 공간world space**, **뷰 공간view space**(혹은 **카메라 공간camera space** 또는 **시야 공간eye space**), **클립 공간clip space**(혹은 **사영 공간projection space** 또는 **동차 공간homogeneous space**), 그리고 **창 공간window space**.

<p><a href="https://commons.wikimedia.org/wiki/File:Coord_system_CA_0.svg#/media/File:Coord_system_CA_0.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Coord_system_CA_0.svg" alt="Coord system CA 0.svg" height="600" width="620"></a><br>By <a href="//commons.wikimedia.org/wiki/User:Jorge_Stolfi" title="User:Jorge Stolfi">Jorge Stolfi</a> - <span class="int-own-work" lang="en">Own work</span>, Public Domain, <a href="https://commons.wikimedia.org/w/index.php?curid=6692547">Link</a></p>

위의 그림에서 보면 알겠지만 보통 3차원 데카르트 좌표계에서는 우리가 z를 상하, y를 좌우, x를 전후로 표현을 해줬음. 근데 이게 꼭 z가 상하라는 법은 없잖음? 그래서 보면 x가 좌우, y가 상하, z가 전후인 좌표계로 사용하는 그래픽스 API나 툴들이 있음.

### 2.1.1. 좌표계

좌표를 튜플 말고 앞으로 벡터로 표현하는게 편함. 예를 들어 좌표 (x, y, z)를 **P**로 표현하는 것임. 정면을 바라보는 방향은 **D**로 쓰고, 윗 방향은 **U**, 오른쪽은 **R**이라고 표현할 것임. 일반적으로 방향 벡터는 단위 벡터로 쓺. 이제 이걸로 좌표계를 정의할 수 있음:

**좌표계coordinate system**라는 것은 선형 대수를 들었으면 좀 더 편하게 이해가 되겠지만, 간단하게 설명하자면 뭔가 x, y, z 축이 존재하고, 이 세 개의 축이 겹치는 **원점origin point** **E**이 존재한다고 보면 됨. 이때 이걸 좀 더 그래픽스적인 관점으로 보면 **정면 방향view direction** **D**, **윗 방향up direction**, **오른쪽 방향right direction** 세 가지가 곧 세 축이 되고, **E**가 원점인 거라고 볼 수 있음. 선형 대수를 배웠다면 이 세 벡터는 서로 일차 독립이고, 이들의 선형 결합으로 이루어진 벡터가 곧 실제 데카르트 좌표계에서의 좌표임을 알 수 있음. 즉, 이 좌표계는 { **E**; **D**, **U**, **R** }로 표현하고, 이 좌표계의 한 점 **X**가 이 좌표계에서의 좌표가 (d, u, r)이라면 실제 데카르트 좌표계에서는 **X** = **E** + d**D** + u**U** + r**R**인 것임.

위에서 일차 독립이라는 얘기를 했는데, 이게 무슨 소리냐면, 임의의 두 벡터 **x** **y**가 있을 때, 0이 아닌 실수 a, b에 의하여 a**x** + b**y** = 0인 a, b가 존재하지 않으면 둘은 일차 독립이라고 할 수 있음. 

그림으로 보자면

<p><a href="https://commons.wikimedia.org/wiki/File:Vec-indep.png#/media/File:Vec-indep.png"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Vec-indep.png/1200px-Vec-indep.png" alt="Vec-indep.png"></a><br>By <a href="//commons.wikimedia.org/w/index.php?title=User:Schnelliboy&amp;amp;action=edit&amp;amp;redlink=1" class="new" title="User:Schnelliboy (page does not exist)">Schnelliboy</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/4.0" title="Creative Commons Attribution-Share Alike 4.0">CC BY-SA 4.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=38609973">Link</a></p>

위의 그림은 서로 일차 독립임. 각 축이 서로 겹칠 수가 없으니까.

<p><a href="https://commons.wikimedia.org/wiki/File:Vec-dep.png#/media/File:Vec-dep.png"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Vec-dep.png/1200px-Vec-dep.png" alt="Vec-dep.png"></a><br>By <a href="//commons.wikimedia.org/w/index.php?title=User:Schnelliboy&amp;amp;action=edit&amp;amp;redlink=1" class="new" title="User:Schnelliboy (page does not exist)">Schnelliboy</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/4.0" title="Creative Commons Attribution-Share Alike 4.0">CC BY-SA 4.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=38609972">Link</a></p>

근데 위의 그림은 일차 종속임. 각 축이 서로 겹칠 수 있으니까.

일단 그렇다 치고, 만약 우리는 편의를 위해서 축을 담당하는 각 방향 벡터들의 단위 벡터고 서로 수직이라고 가정을 한다면, 좌표계 { **E**; **D**, **U**, **R** }가 존재하고, 한 점 **X**가 주어졌을 때 이 점의 이 좌표계에서의 좌표 { d, u, r }의 값을 구할 수 있음:

d = **D** &cdot; (**X** - **E**)<br>
u = **U** &cdot; (**X** - **E**)<br>
r = **R** &cdot; (**X** - **E**)

참고로 이렇게 가정할 경우, 정면 방향 벡터와 윗 방향 벡터의 외적을 통해 오른쪽 방향 벡터를 구할 수 있음. 이걸 참고로 **오른손 좌표계right-handed system**이라고 부름. ㅇㅇ 맞음. **왼손 좌표계left-handed system**도 존재함. 이건 참고로 그래픽스 API마다 쓰는게 다름. 어떤 API는 정면,윗,오른쪽인 반면, 어떤 API는 정면,윗,왼쪽임.

### 2.1.2. 손잡이와 외적

![leftrght](https://learn.microsoft.com/en-us/windows/win32/direct3d9/images/leftrght.png)<br>
[출처: Microsoft](https://learn.microsoft.com/en-us/windows/win32/direct3d9/coordinate-systems)

일단 기본적으로 y 축이 상하, x 축이 좌우라고 가정하자. 이때 양의 y가 상, 양의 x가 오른쪽인 셈. z 축의 경우 양의 z가 오른손 좌표계에서는 앞으로, 즉 안으로 들어가는 셈이고, 왼손 좌표계에서는 뒤로, 즉 밖으로 나가는 셈임.

보통 이게 일반적인 좌표계인데, 아티스트들이 사용하는 프로그램의 경우 z가 상하고 x가 좌우, y가 앞뒤인 경우도 있긴 함.

어쨋든 중요한 건 x가 좌우든 y가 좌우든 그건 별로 중요하지 않고, 오른손 좌표계냐 왼손 좌표계냐도 결국엔 나중에 연산을 할 때 벡터나 성분의 순서를 어떻게 배치하냐가 달라지니까 중요한 거임. 예를 들어 오른손 좌표계에서 **AB**를 했다면, 왼손 좌표계에서는 반대로 **BA**를 해야함.

어차피 오른손이든 왼손이든 결국 근본은 데카르트 좌표계 위에 올라간다는 뜻이고, 데카르트 좌표계는 x, y, z 축은 있어도 얘네가 상하냐 좌우냐 그런 구분은 없음. 그런건 다 사람이 정해놓고 보는 것임.

위의 그림에서처럼 z의 방향이 바뀌는 것으로 대충 손잡이가 바뀌는 걸로 이해하면 편하긴 함. { **E**; **D**, **U**, **R** }가 오른손 좌표계였다면, 그림에서처럼 { **E**; **R**, **U**, **D** }였다면 왼손 좌표계가 되겠지.

위에서 앞위 외적을 통해서 오른쪽을 구했잖음? 사실 이게 좌표계의 **대수적 해석법algebraic interpretation**임. 즉, 오른손 좌표계의 { **E**; **D**, **U**, **R** }의 대수적 해석법은 **R** = **D** × **U**임. 반대로 왼손 좌표계 { **E**; **R**, **U**, **D** }의 대수적 해석법은 **D** × **U** = -**R**임.

이걸 좀 더 일반화해서 보자면, 각 기저(축)가 단위 벡터이고 서로 수직인 벡터 **U**<sub>i</sub>로 이루어졌고, 원점이 **P**인 좌표계 { **P** : **U**<sub>0</sub>, **U**<sub>1</sub>, **U**<sub>2</sub>}가 있을 때,

**U**<sub>0</sub> × **U**<sub>1</sub> = **U**<sub>2</sub>이면 오른손 좌표계, **U**<sub>0</sub> × **U**<sub>1</sub> = -**U**<sub>2</sub>이면 왼손 좌표계임.

마찬가지로 만약 좌표계를 형성하는 방향 벡터를 어떤 한 행렬의 열로 두었다고 가정하면: Q = [**U**<sub>0</sub>, **U**<sub>1</sub>, **U**<sub>2</sub>]로 둘 수 있음. 이러면 Q는 직교 행렬이고, 만약 오른손 좌표계였다면 det(Q) = 1이고, 왼손 좌표계였다면 det(Q) = -1임.

참고로 어떤 손잡이 좌표계를 쓰든 두 벡터의 외적은 같은 결과를 냄.

DirectX에서 사용하는 DirectXMath의 경우를 직접 보면 우선:

```cpp
using namespace DirectX;

XMVECTOR a = <tuple (x0, y0, z0)>;
XMVECTOR b = <tuple (x1, y1, z1)>;
XMVECTOR c = XMVector3Cross(a, b);  // c = (y0z1 - z0y1, z0x1 - x0z1, x0y1 - y0x1)
```
Vulkan:

```cpp
glm::vec3 a(x0, y0, z0);
glm::vec3 b(x1, y1, z1);
glm::vec3 c = cross(a, b); // c = (y0z1 - z0y1, z0x1 - x0z1, x0y1 - y0x1)
```

### 2.1.3. 점과 벡터

보통 점과 벡터는 같은 것으로 간주하는 경우가 있는데, **아핀 대수학affine algebra**에서는 둘은 엄연히 다른 개념임. 세 점 P, Q, R과 한 벡터 **V**가 존재한다고 할 때, 아핀 대수학의 공리는 다음과 같음:

1. 두 점의 차는 벡터임, **V** = P - Q
2. 점과 벡터의 합은 점임, Q = P + **V**
3. (P - Q) + (Q - R) = (P - R). 간단히 P, Q, R이 이루는 삼각형을 생각하면 됨. 즉 삼각형의 각 모서리가 방향이 있다고 생각하면, 이 방향을 따라가면 결국 제자리로 돌아오니깐 0 벡터가 생김.
4. ∑<sub>i=1</sub><sup>n</sup>c<sub>i</sub> = 1이면 P = ∑<sub>i=1</sub><sup>n</sup>c<sub>i</sub>P<sub>i</sub>는 점임
5. ∑<sub>i=1</sub><sup>n</sup>d<sub>i</sub> = 0이면 **V** = ∑<sub>i=1</sub><sup>n</sup>d<sub>i</sub>P<sub>i</sub>는 벡터임

아핀 대수에서 점은 (x, y, z, 1)로 표기하고 벡터는 (x, y, z, 0)으로 표기함. 이걸 바탕으로 각 공리를 보면:

1. (x0, y0, z0, 1) - (x1, y1, z1, 1) = (x0 - x1, y0 - y1, z0 - z1, 0)이므로 벡터임
2. (x0, y0, z0, 1) + (x1, y1, z1, 0) = (x0 + x1, y0 + y1, z0 + z1, 1)이므로 점임
3. ((x0, y0, z0, 1) - (x1, y1, z1, 1)) + ((x1, y1, z1, 1) - (x2, y2, z2, 1)) = (x0 - x1, y0 - y1, z0 - z1, 0) + (x1 - x2, y1 - y2, z1 - z2, 0) = (x0 - x2, y0 - y2, z0 - z2, 0) = ((x0, y0, z0, 1) - (x2, y2, z2, 1))
4. ∑<sub>i=1</sub><sup>n</sup>c<sub>i</sub>P<sub>i</sub> = (∑<sub>i=1</sub><sup>n</sup>c<sub>i</sub>x<sub>i</sub>, ∑<sub>i=1</sub><sup>n</sup>c<sub>i</sub>y<sub>i</sub>, ∑<sub>i=1</sub><sup>n</sup>c<sub>i</sub>z<sub>i</sub>, ∑<sub>i=1</sub><sup>n</sup>c<sub>i</sub>) = (∑<sub>i=1</sub><sup>n</sup>c<sub>i</sub>x<sub>i</sub>, ∑<sub>i=1</sub><sup>n</sup>c<sub>i</sub>y<sub>i</sub>, ∑<sub>i=1</sub><sup>n</sup>c<sub>i</sub>z<sub>i</sub>, 1)이므로 점임
5. ∑<sub>i=1</sub><sup>n</sup>d<sub>i</sub>P<sub>i</sub> = (∑<sub>i=1</sub><sup>n</sup>d<sub>i</sub>x<sub>i</sub>, ∑<sub>i=1</sub><sup>n</sup>d<sub>i</sub>y<sub>i</sub>, ∑<sub>i=1</sub><sup>n</sup>d<sub>i</sub>z<sub>i</sub>, ∑<sub>i=1</sub><sup>n</sup>d<sub>i</sub>) = (∑<sub>i=1</sub><sup>n</sup>d<sub>i</sub>x<sub>i</sub>, ∑<sub>i=1</sub><sup>n</sup>d<sub>i</sub>y<sub>i</sub>, ∑<sub>i=1</sub><sup>n</sup>d<sub>i</sub>z<sub>i</sub>, 0)이므로 벡터임

이걸 직접 구현한다고 하면:

```cpp
class Vector
{
public:
   // constructors
   // destructor
   constexpr Vector operator+(const Vector& v) const noexcept; // U + V
   constexpr Vector operator-(const Vector& v) const noexcept; // U - V
   constexpr Vector operator*(float c) const noexcept;                           // V * c
   friend constexpr Vector operator*(float c, const Vector& v) const noexcept;   // c * V
private:
   float m_Tuple[4]; // m_Tuple[3] == 0
};

class Point
{
public:
   // constructors
   // destructor
   constexpr Point operator+(const Vector& v) const noexcept; // P + V
   constexpr Point operator-(const Vector& v) const noexcept; // P - V
   constexpr Vector operator-(const Point& v) const noexcept; // P - Q
   static constexpr Point AffineCSum(size_t count, float c[], Point q[]) noexcept;
   static constexpr Vector AffineDSum(size_t count, float d[], Vector q[]) noexcept;
private:
   float m_Tuple[4]; // m_Tuple[3] == 0
};
```

## 2.2. 변환

### 2.2.1. 선형 변환

#### 회전

#### 반사

#### 확대 축소

#### 시어링

### 2.2.2. 아핀 변환

### 2.2.3. 사영 변환

#### 선에 정사영

#### 평면에 정사영

#### 평면에 사투영

#### 평면에 원근 투영

### 2.2.4. 원근 투영의 속성

#### 선에 선 투영

#### 삼각형에 삼각형 투영

#### 원뿔에 원뿔 투영

### 2.2.5. 동차점과 동차행렬

## 2.3. 카메라

### 2.3.1. 원근 카메라 모델

### 2.3.2. 모델 / 객체 공간

### 2.3.3. 월드 공간

### 2.3.4. 뷰, 카메라, 시야 공간

### 2.3.5. 클립, 투영, 동차 공간

### 2.3.6. 창 공간

### 2.3.7. 정리

## 2.4. 컬링과 클리핑

### 2.4.1. 오브젝트 컬링

### 2.4.2. 후면 컬링

### 2.4.3. 뷰 프러스텀 클리핑

#### 평면별 클리핑

#### 교차 다각형 클리핑

## 2.5. 래스터화

### 2.5.1. 선분

### 2.5.2. 원

### 2.5.3. 타원

#### 타원 만들기

#### 축 정렬 타원

#### 일반 타원

### 2.5.4. 삼각형

## 2.6. 정점 속성

### 2.6.1. 색

### 2.6.2. 빛과 머테리얼

#### 빛

#### 머테리얼

#### 라이팅과 셰이딩

##### 주변광

##### 난반사광

##### 정반사광

##### 스포트라이트 감쇠

##### 라이팅 방정식

### 2.6.3. 텍스처

#### 좌표 모드

#### 필터링 모드

#### 밉매핑

#### 다중 텍스처

### 2.6.4. 투명도, 불투명도, 블렌딩

### 2.6.5. 안개

### 2.6.6. 기타 등등

### 2.6.7. 래스터화 속성

## 2.7. 소프트웨어, 하드웨어, API 관련

그래픽스를 직접 소프트웨어로 다 구현할 수도 있겠지만, 그래픽스 관련 연산을 하드웨어 수준에서 해주는 하드웨어들이 있음.

### 2.7.1. 일반적인 논의사항

요즘은 래스터화 같은 작업을 소프트웨어에서 하는 것보다 그래픽스를 담당하는 하드웨어에서 직접 처리하는게 훨씬 빠름. 물론 최근에 언리얼 엔진 5 등에서 소프트웨어 래스터기 등을 선보이면서 소프트웨어로 래스터화를 하는 부분이 다시 등장하는 부분들도 있지만 기본적으로 GPU에 내장된 래스터화 기능이 매우 빠르기 때문에 GPU 없는 그래픽스는 사실상 생각하기 어려울 정도임. 게다가 레이트레이싱을 거의 실시간으로 하겠다? 그러면 무조건 레이트레이싱을 가속화하는 하드웨어 기능이 들어간 (NVIDIA의 경우 RTX) GPU가 필수임.

여튼 이런 GPU를 사용하면서 그래픽스를 쓴다면 사실상 Direct3D나 Vulkan, Metal과 같은 그래픽스 API가 필수적임. 어떤 API를 선택할지는 상황에 따라 다름. Vulkan의 경우 가장 많은 플랫폼을 지원하기 때문에 포팅하기엔 좋음. Direct3D의 경우에는 윈도우즈나 Xbox 쪽에서만 사용할 수 있음. Metal의 경우에는 MacOS와 iOS에서만 사용할 수 있음. 사실상 윈도우즈와 Xbox에서는 Direct3D, MacOS와 iOS에서는 Metal, 그외의 환경, 즉 리눅스나 안드로이드, PS5, Nintendo Switch의 경우엔 Vulkan을 사용함. 물론 아직까지 특히 안드로이드에서는 OpenGL이 사용되는 부분들도 있으나 사실상 서서히 Vulkan 쪽이 많아지는 추세.

CPU의 경우는 SIMD(단일 명령 다중 데이터single instruction, multiple data)처럼 병렬성을 지원하는 CPU가 대부분이고, 멀티 스레딩이 매우 중요해진 시점이기에 이를 잘 활용할 줄 알아야 함. 당연하겠지만 지원할 플랫폼 별로 어떤 instruction set을 지원하는지에 따라서도 또 달라질 것임. x64인지, arm64인지 등등을 잘 파악해야함. 그리고 이 플랫폼에 따라 어떤 compiler를 사용할지도 달라질텐데, 이거에 따라서 또 달라짐.

렌더러를 만들 때 마지막으로 고려해야할 사항은 캐시 일관성임. 아무리 좋은 알고리듬을 써도 결국 캐시 히트율이 낮아지면 성능이 나빠짐. 이런거 해결하려면 Intel의 VTune 같은 프로파일러로 어떤 문제가 발생하는지를 봐야함. GPU의 경우는 Direct3D 12를 쓴다면 PIX, 아니면 멀티 플랫폼이 되는 RenderDoc 같은 거 쓰면 됨.

### 2.7.2. 이식성 vs 성능

플랫폼마다 환경이 다름. 어떤 환경에서는 `long`이 4 바이트인데 어떤 환경에서는 8 바이트일 수 있음. 어떤 GPU는 16 바이트 float 연산만 지원할 수도 있음. 만약 여러 플랫폼을 지원하겠다고 한다면, 그 순간 멀티 플랫폼의 늪에 빠지는 것임. 결국 나오는게 이식성 vs 성능 문제가 나옴.

결국 이걸 개발할 때 중요한 건 사용 가능한 **시간과 자원**임. 이거에 따라서 정하면 됨. 만약 직접 전부 구현한다면 시간 문제가 발생할 것임. 이걸 좀 줄이려고 여기 저기서 미들웨어를 사올 수도 있지만, 얘네들도 멀티 플랫폼이 아닐 수도 있음. 심지어 만약 버그라도 발생하면 걔네들이 고쳐줄 때까지 기다려야 됨.

## 2.8. API 규칙

Direct3D나 Vulkan이나 서로 API 규칙이 달라서 좀 귀찮음. 그래서 이 책에서도 어떤 방식으로 쓸지에 대해서도 좀 통일을 해야함.

### 2.8.1. 행렬 표현 및 저장

어떤 한 4-튜플이 주어지면, 이걸 열벡터든 행벡터든 하나로 규칙화하고 표현해야함.

![714d84d8ff8ed716a4b5bf5f623c6a612c2cfc59](https://wikimedia.org/api/rest_v1/media/math/render/svg/714d84d8ff8ed716a4b5bf5f623c6a612c2cfc59)

위와 같이 열벡터로 하게 되면 행렬도

![6222e9f1577287b35d8c10bdb1a8018dcb46a934](https://wikimedia.org/api/rest_v1/media/math/render/svg/6222e9f1577287b35d8c10bdb1a8018dcb46a934)

위의 순서로, 즉 행 우선 순서로 하면 됨.

만약 행벡터로 한다면 행렬도 순서를 바꿔야함. 행렬은 그러면 열 우선 순서가 됨.

열벡터로 할 때 벡터에 행렬을 곱한다면 **p** = **M** **v**의 식으로 곱하면 됨.

행벡터로 할 때 벡터에 행렬을 곱한다면 **p** = **v** **M**의 식으로 곱하면 됨.

Direct3D의 경우, 벡터를 왼쪽에 두고(행벡터), 행렬은 행 우선 순서임.

Vulkan의 경우 `glm`을 사용할테니, 벡터를 오른쪽에 두고(열벡터), 행렬은 열 우선 순서임.

### 2.8.2. 행렬 구성

만약 벡터 **v**에 행렬 **A** **B** 순서대로 변환을 준다고 한다면, `glm`의 경우 **p** = **BA v** 순으로 해주면 됨. DirectXMath의 경우 **p** = **v AB**로 하면 됨.

### 2.8.3. 뷰 행렬

### 2.8.4. 투영 행렬

### 2.8.5. 창 손잡이

### 2.8.6. 회전

### 2.8.7. 그래픽스 API를 활용한 빠른 연산

# 3. 렌더러

이제 그래픽스 시스템의 기초를 배웠으니 실제로 삼각형 같은 기하 원시객체를 그려보자.

원래 책에서는 그래픽스 API를 통해 하드웨어 렌더링도 다루지만, 소프트웨어 렌더러도 다루었었음. 이 책에서는 그런 내용은 싹 다 제외함.

## 3.1. 소프트웨어 렌더링

제외

## 3.2. 하드웨어 렌더링

사실상 요즘 시대에서 렌더링을 한다는 건 Vulkan이나 Direct3D를 통해 그래픽스 하드웨어를 사용하겠다는 뜻임.

과거에는 근데 Direct3D 11이나 OpenGL에서는 좀 로우레벨한 부분은 API가 내부적으로 알아서 잘 해줬는데, 요즘 Direct3D 12나 Vulkan에서는 메모리라든가 다 직접 처리해야하는 부분도 있어서 좀 조심해야함.

여튼 결국 실제 렌더링은 그래픽스 API에서 처리해줄테니 실제 엔진은 거의 **자원 관리 시스템resource management system**이나 다름 없음. 여기서 말하는 자원은 정점 버퍼(정점 위치와 속성들 저장하는 버퍼)나 인덱스 버퍼(메시 위상의 인덱스를 저장하는 버퍼), 셰이더들, 텍스처들 등등이 있음. 이렇게 자원들이 있으니 이 자원들을 clear해줘야할테고, 카메라, 조명, 객체에 대한 변환, 전역 렌더링 상태 등을 다 관리해줘야할 것임.

## 3.3. 추상 렌더링 API

여기서 실제 렌더러 기반 클래스인 `BaseRenderer`를 구현해볼 것임. 이 클래스는 그릴 객체에 대한 자원 관리를 해줄 것임.

### 3.3.1. 생성 및 소멸

```cpp
class BaseRenderer
{
public:
   enum class eGraphicsApiType
   {
      VULKAN,
      D3D12,
      METAL,
      COUNT,
   };

public:
   BaseRenderer() = delete;
   virtual ~Renderer() noexcept;

   // getters for format type, depth type, stencil type, buffering type, multisampling type, width and height

   virtual;

protected:
   explicit BaseRenderer(
      FrameBuffer::eFormatType format,
      FrameBuffer::eDepthType depth,
      FrameBuffer::eStencilType stencil,
      FrameBuffer::eBufferingType buffering,
      FrameBuffer::eMultisamplingType multisampling,
      uint32_t uWidth,
      uint32_t uHeight
   ) noexcept;
};
```