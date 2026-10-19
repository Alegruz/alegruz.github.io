---
title: 대칭 양의 정부호 행렬
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-symmetric-positive-definite-matrix
description: 모든 방향의 양의 에너지를 완전제곱, 고윳값과 Cholesky 인수로 확인합니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: e41d9364d137de9c87eb7354ffadcbf8f77fb3abcfabb42dc66b8e90b0e5b250
interactive_examples: true
---

## 정의
{: id="definition"}

“대칭 양의 정부호”는 행렬이 대각선을 사이에 두고 대칭이며 관련 좌표 제곱식이 모든 0이 아닌 입력에서 양수라는 뜻이다. 정식 조건 전에 표기를 읽자.

- **벡터** $x\in\mathbb R^n$은 좌표라 부르는 실수 $n$개를 모은 열이다. **스칼라**는 하나의 수이다.
- **정사각행렬** $A\in\mathbb R^{n\times n}$은 $n$행 $n$열이다. **주대각선**은 왼쪽 위에서 오른쪽 아래로 이어지며 **비대각** 원소는 그 밖의 위치이다.
- **전치** $A^T$는 행과 열을 바꾼다. $A^T=A$이면 **대칭**이다. 예를 들어 행이 $(3,1),(1,2)$인 행렬은 두 비대각 원소가 같아 대칭이다.
- $x^TAx$는 수 하나이다. 먼저 $Ax$를 계산하고 $x$와 대응 좌표를 곱해 더하는 **내적**을 구한다. 대각이 2,3이고 나머지가 0인 $A=\operatorname{diag}(2,3)$에서는 $2x_1^2+3x_2^2$이다.

이 식은 좌표의 제곱과 두 좌표의 곱을 결합한 **이차형식**이다. 계수 규칙은 [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }}), 기본 연산은 [행렬 분해 개요]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})를 읽자.

실수 정사각행렬 $A\in\mathbb R^{n\times n}$이 **대칭 양의 정부호(SPD)**라는 것은

$$
A^T=A,\qquad x^TAx>0\quad\text{모든 0이 아닌 }x\in\mathbb R^n.
$$

**0이 아닌** 것은 적어도 한 좌표가 0이 아니라는 뜻이지 모든 좌표가 양수라는 뜻은 아니다. **엄격한 양수**는 0 이상이 아니라 0보다 큼을 뜻한다. 예를 들어 $2x_1^2+3x_2^2$는 $(0,-1)^T$를 포함한 모든 0이 아닌 입력에서 양수이다. 대칭성과 엄격한 양수가 모두 필요하다. [van de Geijn의 정의](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

SPD 행렬은 0에서 벗어나는 모든 방향으로 증가하는 에너지를 나타낸다. **선형계** $Ax=b$는 주어진 출력 $b$를 만드는 미지 좌표 $x$를 묻는다. SPD는 모든 $b$에 유일한 해를 보장하며 특수한 [행렬 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})인 [Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})도 지원한다.

## 직관: 모든 방향에 에너지 비용이 든다
{: id="intuition-every-direction-costs-energy"}

대칭 $2\times2$ 행렬에서

$$
A=\begin{bmatrix}a&b\\b&c\end{bmatrix},\qquad
q(x)=x^TAx=ax_1^2+2bx_1x_2+cx_2^2.
$$

대각 원소는 개별 좌표에 벌점을 준다. $2bx_1x_2$는 서로 다른 좌표를 곱하는 **교차항**이며 $b$는 상호작용을 기록한 **결합 계수**이다. $b>0$이면 같은 부호 좌표에서 양수, 반대 부호에서 음수이다. 따라서 효과는 길이만이 아닌 방향에 의존한다. $(1,0)^T,(0,1)^T$만 시험하면 좌표축만 확인하므로 결합된 방향에는 0이나 음의 에너지가 남을 수 있다.

방향의 크기를 바꾸면 $q(tx)=t^2q(x)$이다. SPD에서 0이 아닌 방향으로 멀어지면 에너지가 증가한다. **원점**은 모든 좌표가 0인 벡터이며 다른 모든 입력보다 값이 작은 $q$의 유일한 최소점이다.

대칭행렬이 모든 $x$에서 $q(x)\ge0$이면 **양의 준정부호(PSD)**로 0이 아닌 방향의 에너지 0을 허용한다. $q(x)=x_1^2$는 $x_2$ 변경에 비용이 없는 **평평한 방향**이 있다. **부정부호**는 양의 방향과 음의 방향이 모두 있다는 뜻이다. $x_1^2-x_2^2$는 $(1,0)^T$에서 양수, $(0,1)^T$에서 음수이다. [Higham의 비교](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/).

**등위선(contour)**은 함수값이 같은 입력들을 잇는다. 예를 들어 $x_1^2+x_2^2=4$는 모든 점의 에너지가 4인 반지름 2의 원이다. 그림은 늘어난 원인 타원, 평평한 방향의 직선 쌍, 0이 아닌 $k$에 대해 $x_1^2-x_2^2=k$의 열린 두 가지인 쌍곡선을 비교한다.

{% include image.html src="/assets/images/wiki/cholesky-energy-ko.svg" alt="양의 정부호 에너지는 닫힌 타원, 준정부호의 평평한 방향은 평행선, 부정부호는 쌍곡선인 등위선을 만든다." caption="각 곡선은 같은 에너지 q(x)=xᵀAx인 입력 집합이다. q(x)=4는 좌표 4가 아니라 곡선 전체의 에너지 4이다. 모든 패널의 파란 실선은 양의 값 1,2,4이다. SPD는 원점의 최소값을 둘러싼 타원, 준정부호 x₁²는 수직선 쌍으로 q=4는 모든 x₂에서 x₁=±2이다. 부정부호의 주황 점선은 −1,−2,−4, 회색 직선은 q=0이다." %}



## 계산 예제: 무한히 많은 벡터를 시험하지 않고 양수 증명하기
{: id="worked-example-prove-positivity-without-checking-infinitely-many-vectors"}

다음 계산과 연습은 직접 만든 설명용 예제이다.

다음을 보자.

$$
A=\begin{bmatrix}3&1\\1&2\end{bmatrix}.
$$

비대각 원소가 같아 대칭이다. **완전제곱 만들기**는 제곱항과 교차항을 제곱 괄호와 나머지로 바꾼다. 예를 들어 $(t+1)^2=t^2+2t+1$이므로 $t^2+2t+3=(t+1)^2+2$이다. 두 좌표 규칙은 [이차형식의 완전제곱]({{ '/wiki/linear-algebra/quadratic-form-ko/#completing-the-square-and-cholesky' | relative_url }})을 참고하자. 여기서는

$$
\begin{aligned}
x^TAx&=3x_1^2+2x_1x_2+2x_2^2\\
&=3\left(x_1+\frac{x_2}{3}\right)^2+\frac53x_2^2.
\end{aligned}
$$

더해지는 각 항인 **가항**은 0 이상이다. 합이 0이려면 둘째 항이 $x_2=0$을, 첫 항이 $x_1=0$을 강제한다. 따라서 모든 0이 아닌 벡터는 엄격히 양의 에너지를 갖는다.

$x=(1,-1)^T$의 에너지는 $3-2+2=3$이다. 이 한 계산은 결과를 예시하고 완전제곱 논증은 모든 방향에 대해 증명한다.

### 실용적인 2×2 판정
{: id="a-practical-two-by-two-test"}

$a>0$에서 같은 대수는

$$
q(x)=a\left(x_1+\frac ba x_2\right)^2+
\left(c-\frac{b^2}{a}\right)x_2^2.
$$

따라서 대칭 $2\times2$ 행렬은 정확히 다음일 때 SPD이다.

$$
a>0,\qquad ac-b^2>0.
$$

필요성은 $(1,0)^T$, $(-b/a,1)^T$를 시험하고 충분성은 완전제곱의 두 엄격히 양의 계수에서 나온다. 예제에서는 $a=3$, $ac-b^2=5$이다.

## SPD를 알아보는 동치 판정법
{: id="equivalent-ways-to-recognize-spd-matrices"}

판정에 쓰는 용어는 다음과 같다.

- **고유벡터**는 $Av=\lambda v$인 $v\ne0$이며 배수 $\lambda$가 **고윳값**이다. $A=\operatorname{diag}(2,3)$에서 $(1,0)^T$는 고윳값 2인 고유벡터이다. [개요의 설명]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }}).
- **행렬식**은 정사각행렬에 대응하는 수이다. 원소가 $a,b,b,c$인 2차원 행렬의 행렬식은 $ac-b^2$이다. **선도 주행렬식**은 왼쪽 위 정사각 블록의 행렬식이다. 예제의 첫 것은 3, 둘째는 $3\cdot2-1^2=5$이다. [LU의 행렬식과 초기 블록]({{ '/wiki/linear-algebra/lu-decomposition-ko/#when-the-factorization-exists' | relative_url }}).
- **하삼각행렬**은 주대각선 위가 0이다. **Cholesky 인수**는 $A=LL^T$이고 대각이 양수인 이런 $L$이다. $A=\operatorname{diag}(4,9)$이면 $L=\operatorname{diag}(2,3)$이다. 구성은 [Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})를 참고하자.

모든 선도 주행렬식이 양수인 판정은 **Sylvester 판정법**이다. **실수 대칭행렬**에서는 다음이 **동치**여서 하나를 만족하면 모두 만족한다.

| 판정 | 확인할 내용 |
| --- | --- |
| 이차형식 | 모든 $x\ne0$에서 $x^TAx>0$ |
| 고윳값 | 모든 고윳값이 엄격히 양수 |
| Sylvester 판정법 | 모든 선도 주행렬식이 엄격히 양수 |
| Cholesky 인수 | $A=LL^T$, $L$은 양의 대각 하삼각행렬 |

$n\times n$에서는 크기 $1,2,\ldots,n$인 블록을 확인한다. [Higham의 동치 조건](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/), [van de Geijn의 정리](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html)를 참고하자. 모두 대칭을 가정하며 일반 행렬은 양의 고윳값만으로 SPD가 되지 않는다.

### 고윳값이 기하를 설명하는 이유
{: id="why-eigenvalues-explain-the-geometry"}

**단위벡터**는 길이가 1이다. **유클리드 노름** $\lVert v\rVert_2=\sqrt{v_1^2+\cdots+v_n^2}$이 길이를 재므로 $(3,4)^T$는 길이 5, $(3/5,4/5)^T$는 단위벡터이다. 내적 0인 두 벡터는 **직교**, 즉 수직이다. **직교행렬** $Q$는 수직 단위 열들을 가지고 $Q^TQ=I$이며 길이를 보존한다. 항등행렬 $I$는 대각 1, 나머지 0이다. [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }}), [개요의 직교 인수]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }}).

스펙트럴 정리에 의해 실수 대칭행렬에는 모든 좌표 방향을 생성하는 정규직교 고유벡터들이 있다. **대칭 고유분해** $A=Q\Lambda Q^T$에서 $Q$는 직교, $\Lambda$는 비대각이 0인 **대각행렬**이며 대각이 고윳값 $\lambda_i$이다. $y=Q^Tx$는 고유벡터 방향에서 잰 좌표이다. 그러면

$$
x^TAx=y^T\Lambda y=\sum_{i=1}^n\lambda_i y_i^2.
$$

모든 $\lambda_i>0$이면 $y\ne0$에서 합이 양수이다. 반대로 고유벡터는 $v_i^TAv_i=\lambda_i\lVert v_i\rVert_2^2$를 만족하므로 SPD가 $\lambda_i>0$을 강제한다. 위 고윳값 판정을 유도했다.

고유벡터 좌표에서 $q(x)=1$인 타원의 중심부터 각 고유벡터 방향의 가장자리까지 거리, 즉 **반축 길이**는 $1/\sqrt{\lambda_i}$이다. 작은 고윳값은 긴 축과 약한 저항 방향을 뜻한다. 예제에서는

$$
\lambda_\pm=\frac{5\pm\sqrt5}{2}>0.
$$

### Cholesky 인수가 증명서인 이유
{: id="why-a-cholesky-factor-is-a-certificate"}

**증명서**는 주장을 확인할 수 있는 증거이며 여기서 $L$은 제곱합으로 양수를 증명한다. **가역행렬**에는 작용을 되돌리는 역행렬이 있다. 예를 들어 $\operatorname{diag}(2,3)$은 $\operatorname{diag}(1/2,1/3)$로 되돌린다. 가역행렬은 0이 아닌 벡터를 0으로 보내지 않는다. 대각이 0이 아닌 삼각행렬은 가역이다. [개요의 역행렬]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }}).

$L$이 가역인 $A=LL^T$에서는

$$
x^TAx=\lVert L^Tx\rVert_2^2>0\qquad(x\ne0).
$$

예제의 인수는

$$
L=\begin{bmatrix}\sqrt3&0\\1/\sqrt3&\sqrt{5/3}\end{bmatrix}.
$$

$LL^T$를 곱하면 대각은 3과 $1/3+5/3=2$, 비대각은 1이다. 구성과 삼각계 풀이는 [Cholesky 문서]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})를 참고하자.

## 흔한 지름길의 반례
{: id="counterexamples-to-common-shortcuts"}

**원소가 양수여도 SPD는 아니다.** 다음 대칭행렬은

$$
\begin{bmatrix}1&3\\3&1\end{bmatrix}
$$

원소가 양수지만 $q((1,-1)^T)=-4$이다.

**음의 비대각도 허용된다.** 다음에서는

$$
A=\begin{bmatrix}3&-1\\-1&3\end{bmatrix},\qquad
q(x)=2x_1^2+2x_2^2+(x_1-x_2)^2,
$$

0이 아닌 모든 벡터의 에너지가 엄격히 양수이다.

**양의 행렬식만으로 부족하다.** $-I_2$의 행렬식은 1이지만 $q(x)=-\lVert x\rVert_2^2$이다. Sylvester 판정은 값이 $-1$인 첫 선도 주행렬식도 확인한다.

**양의 대각만으로 부족하다.** 양의 원소 반례는 대각도 양수지만 $(1,-1)^T$의 에너지는 음수이다.

**이차형식의 엄격한 양수가 대칭을 뜻하지 않는다.** 다음을 보자.

$$
B=\begin{bmatrix}1&2\\-2&1\end{bmatrix}.
$$

$x\ne0$에서 $x^TBx=x_1^2+x_2^2>0$이지만 $B^T\ne B$이다. 비대각 부분은 전치가 자신의 음수인 **반대칭**으로 $2x_1x_2$와 $-2x_2x_1$이 상쇄된다. 정의가 대칭을 명시하는 이유이다.

## SPD 행렬은 어디에서 생기는가?
{: id="where-spd-matrices-come-from"}

### 독립인 열과 최소제곱
{: id="independent-columns-and-least-squares"}

**최소제곱**은 차이 제곱합 $\lVert Bx-b\rVert_2^2$를 최소화해 예측 $Bx$를 측정 $b$에 맞춘다. 예를 들어 상수 $t$를 $1,2,6$에 맞추면 $(t-1)^2+(t-2)^2+(t-6)^2$의 최선 값은 $t=3$이다.

어느 열도 나머지의 수배 합으로 만들 수 없으면 **선형독립**이다. 독립 방향의 수가 **계수(rank)**이다. $(1,0)^T,(0,1)^T$는 독립이며 동일한 열은 종속이어서 다른 매개변수가 같은 예측을 만들 수 있다. [개요의 계수·최소제곱 예제]({{ '/wiki/linear-algebra/matrix-decomposition-ko/#terms-for-the-conditions-and-uses' | relative_url }}).

실수 직사각행렬 $B$에서

$$
A=B^TB,\qquad x^TAx=\lVert Bx\rVert_2^2.
$$

$B^TB$는 각 원소가 $B$의 두 열의 내적인 **Gram 행렬**이다. 대각은 열 길이 제곱이며 항상 대칭 PSD이다. $Bx=0$이 $x=0$을 강제하는 독립 열일 때 정확히 SPD이다. [van de Geijn의 연습](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html)을 참고하자. 이는 최소제곱 적합을 특징짓는 **정규방정식** $B^TBx=B^Tb$의 계수 조건을 설명한다. [LU 문서]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})에서 다룬다.

예를 들어

$$
B=\begin{bmatrix}1&0\\0&1\\1&1\end{bmatrix},\qquad
B^TB=\begin{bmatrix}2&1\\1&2\end{bmatrix}.
$$

**영공간**은 $Bx=0$인 벡터, 즉 모든 예측을 그대로 두는 매개변수 변화이다. 이 예제는 첫 행이 $x_1=0$, 둘째가 $x_2=0$을 강제하므로 영공간이 0뿐이다. 두 열이 모두 $(1,0,1)^T$이면 Gram 행렬은

$$
\begin{bmatrix}2&2\\2&2\end{bmatrix},
$$

이고 $(1,-1)^T$의 에너지가 0이다. 종속성은 평평한 방향을 만든다.

### 이차 최소화
{: id="quadratic-minimization"}

**최소화**는 **목적함수**를 가장 작게 하는 입력을 고른다. **기울기**는 다른 좌표를 고정하고 하나를 바꾸는 편미분들을 벡터로 모은다. **Hessian**은 기울기 변화인 2차 편미분의 행렬이다. $x_1^2+3x_2^2$는 기울기 $(2x_1,6x_2)^T$, Hessian $\operatorname{diag}(2,6)$이다. 단계별 유도는 [이차형식의 미분과 최적화]({{ '/wiki/linear-algebra/quadratic-form-ko/#derivatives-and-optimization' | relative_url }})를 참고하자.

대칭 $A$, 고정 벡터 $r$에서 $f(x)=\frac12x^TAx-r^Tx$를 보자. 기울기는 $Ax-r$, Hessian은 $A$이다. 기울기 0인 **정지점**은 $Ax=r$을 푼다. SPD이면 가역이다. $Ax=0$이면 $x^TAx=0$이어서 $x=0$이기 때문이다.

$Ax_\ast=r$의 해 $x_\ast$에 좌표 변화 $h$를 더해 전개하면

$$
f(x_{\ast}+h)-f(x_{\ast})=\frac12h^TAh.
$$

$h\ne0$에서 차이가 엄격히 양수이므로 $x_\ast$는 다른 모든 입력보다 값이 작은 **유일한 전역 최소점**이다. 예제 행렬과 $r=(4,3)^T$에서는 $x_\ast=(1,1)^T$, $f(x_\ast)=-7/2$이다. SPD가 정지성을 유일 최적으로 바꾼다. [볼록성의 Hessian 방향 판정]({{ '/wiki/optimization/convexity-ko/' | relative_url }}#the-hessian-tests-every-direction)은 이를 볼록성·엄격한 볼록성·최소점 존재의 차이에 놓는다.

### 양의 벌점 더하기
{: id="adding-a-positive-penalty"}

$C$가 대칭 PSD이고 $\alpha>0$이면

$$
x^T(C+\alpha I)x=x^TCx+\alpha\lVert x\rVert_2^2>0\quad(x\ne0).
$$

따라서 $C$에 평평한 방향이 있어도 $C+\alpha I$는 SPD이다. 양의 길이 제곱 벌점이 최소제곱 이차식의 영공간을 제거하는 이유이다.

## 수치적으로 알아보기
{: id="numerical-recognition"}

소프트웨어에서는 대칭을 확인한 뒤 Cholesky를 시도한다. [LAPACK DPOTRF](https://www.netlib.org/lapack/double/dpotrf.f)는 성공 시 `INFO = 0`, 양의 정부호 판정 실패 시 `INFO > 0`을 보고한다. 선택한 삼각부, 즉 대각 포함 위쪽이나 아래쪽만 읽으므로 성공해도 저장된 양쪽 삼각부가 같은지 따로 검증한 것은 아니다.

역행렬이 없는 정사각행렬은 **특이**하다. $\operatorname{diag}(1,0)$은 둘째 좌표를 잃는다. SPD는 가역이지만 특이행렬에 가까울 수 있다. $A_\varepsilon=\operatorname{diag}(1,\varepsilon)$, $\varepsilon>0$이면 $A_\varepsilon x=r$의 둘째 식은 $x_2=r_2/\varepsilon$이다. $r_2$의 변화 $\delta$가 $x_2$를 $\delta/\varepsilon$ 바꾼다. 엄격한 양수는 유일해를 보장하지만 작은 양의 고윳값은 민감도를 키운다. **부동소수점 산술**은 유한 정밀도로 수를 저장해 반올림하며 $1/3$을 $0.3333$으로 쓰면 작은 오차가 생긴다. 거의 특이하면 이 오차가 알고리즘에 필요한 작은 양수를 압도해 Cholesky가 실패할 수 있다. [Higham의 수치 설명](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/).

## 대화형 예제: 결합 바꾸기
{: id="interactive-example-change-the-coupling"}

아래 기존 이차 에너지 실습은 <span class="math-inline" markdown="0">\(A=\begin{bmatrix}a&b\\b&c\end{bmatrix}\)</span>에서 에너지 부호, SPD의 단위 에너지 등위선과 Cholesky 증명서를 보인다. $a=4,c=3$에서 $\lvert b\rvert=\sqrt{12}$의 전이를 예측하자. 절댓값은 부호를 무시해 $\lvert-2\rvert=2$이다. $b$를 경계 너머로 늘리고 표시된 영·음의 에너지 방향을 시험하자.

{% include wiki-lab-ko.html kind="cholesky" title="모든 방향의 양의 정부호성 탐구" plot_description="이차 에너지 부호, SPD의 타원형 단위 에너지 등위선과 선택한 벡터 방향." %}

제어기는 키보드를 받는다. 한 양의 에너지 벡터로 SPD가 증명되지 않으므로 전체 행렬 판정과 비교하자. JavaScript 없이도 위 완전제곱 예제가 같은 판정과 경계를 설명한다.

## 연습문제
{: id="practice-problems"}

### 1. 손계산: 허용 결합 구하기
{: id="1-hand-calculation-find-the-allowable-coupling"}

어떤 실수 $t$에서 <span class="math-inline" markdown="0">\(A=\begin{bmatrix}2&t\\t&8\end{bmatrix}\)</span>가 SPD인가?

<details markdown="1">
<summary>힌트</summary>

$a>0$, $ac-b^2>0$을 쓴다.

</details>
<details markdown="1">
<summary>풀이</summary>

첫 조건은 성립하고 행렬식은 $16-t^2$이므로 정확히 $-4<t<4$이다. $t=4$이면 $q(x)=2(x_1+2x_2)^2$가 $(-2,1)^T$에서 0이고 $t=-4$이면 $(2,1)^T$에서 0이다. 경계 밖에서는 행렬식과 완전제곱 나머지가 음수이다.

</details>

### 2. 해석: 양의 표본이 무엇을 보이는가?
{: id="2-interpretation-what-does-a-positive-sample-establish"}

<span class="math-inline" markdown="0">\(A=\begin{bmatrix}1&3\\3&1\end{bmatrix}\)</span>에서 두 좌표축과 $(1,1)^T$의 에너지가 양수이다. SPD라 결론 내릴 수 있는가? 결정적인 다음 시험을 고르라.

<details markdown="1">
<summary>힌트</summary>

좌표 부호를 반대로 해 본다.

</details>
<details markdown="1">
<summary>풀이</summary>

아니다. 세 표본 에너지는 1,1,8이지만 $(1,-1)^T$에서는 $-4$로 반증된다. 0이 아닌 방향 하나의 0 이하 값은 정의를 반증하지만 유한한 양의 표본으로는 일반적으로 증명할 수 없다.

</details>

### 3. 추상적 추론: 좌표 바꾸기
{: id="3-abstract-reasoning-change-coordinates"}

$A$가 SPD이고 $S$가 가역 실수 정사각행렬이면 $S^TAS$도 SPD임을 증명하라. $S$가 특이면 무엇이 깨지는가?

<details markdown="1">
<summary>힌트</summary>

$x^TS^TASx$를 $Sx$의 에너지와 비교한다.

</details>
<details markdown="1">
<summary>풀이</summary>

$(S^TAS)^T=S^TA^TS=S^TAS$라 대칭이다. $x\ne0$이면 가역성으로 $Sx\ne0$여서 $(Sx)^TA(Sx)>0$이다. $S$가 특이면 어떤 $x\ne0$에서 $Sx=0$으로 에너지가 0이다. 결과는 PSD지만 SPD는 아니다.

</details>

### 4. 응용: 적합의 모호성 없애기
{: id="4-application-remove-ambiguity-in-a-fit"}

동일한 열을 가진 최소제곱 모델의 Gram 행렬이 <span class="math-inline" markdown="0">\(C=\begin{bmatrix}2&2\\2&2\end{bmatrix}\)</span>이다. 매개변수가 모호한 이유는 무엇인가? $\alpha>0$에서 목적에 $\frac\alpha2\lVert x\rVert_2^2$를 더하면 모호성이 사라지는가?

<details markdown="1">
<summary>힌트</summary>

$C$의 영공간 벡터를 찾고 $C+\alpha I$를 본다.

</details>
<details markdown="1">
<summary>풀이</summary>

$(1,-1)^T$는 적합 출력을 그대로 두며 두 계수를 반대로 바꾼다. 원래 이차식에는 평평한 방향이 있다. 벌점 Hessian은 $C+\alpha I$이며 에너지는 $2(x_1+x_2)^2+\alpha(x_1^2+x_2^2)>0$이다($x\ne0$). 따라서 유일 최소점이 있다. 목적이 바뀌었으므로 비벌점 적합과 최적점은 다를 수 있다.

</details>

## 더 공부할 자료
{: id="further-learning"}

- [Higham: What Is a Symmetric Positive Definite Matrix?](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/): 고윳값·주행렬식 판정을 비교하고 블록 행렬로 나아간다.
- [van de Geijn: Notes on Cholesky Factorization](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html): 삼각 인수의 구성적 증명과 알고리즘을 따라간다.
- [LAPACK: DPOTRF](https://www.netlib.org/lapack/double/dpotrf.f): 삼각 저장과 수치 구현의 실패 보고를 익힌다.

## 관련 문서
{: id="related-pages"}

- [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }})
- [행렬 노름]({{ '/wiki/linear-algebra/matrix-norm-ko/' | relative_url }})
- [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})

- [Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})
- [LU 분해]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})
- [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. van de Geijn, R. A. (2011). [Notes on Cholesky Factorization](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). University of Texas at Austin. SPD 정의, Gram 행렬과 Cholesky 정리.
2. Higham, N. J. (2020년 7월 21일). [What Is a Symmetric Positive Definite Matrix?](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/). 동치 양수 판정과 준정부호 비교.
3. LAPACK. [DPOTRF 명세](https://www.netlib.org/lapack/double/dpotrf.f). 대칭 삼각 저장과 분해 성공·실패.
4. Higham, N. J. (2020년 8월 11일). [What Is a Cholesky Factorization?](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/). 특이성 근처의 부동소수점 동작.
