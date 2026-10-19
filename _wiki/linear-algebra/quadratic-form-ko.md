---
title: 이차형식
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-quadratic-form
description: xᵀAx의 계수와 교차항을 읽고 대칭 부분, 완전제곱 및 양의 정부호성과 연결합니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 1a0d1b2f875a34c0f327c15157aac1afe4a7a523d17c06794d9bd35b770720c7
interactive_examples: true
---

## 정의
{: id="definition"}

이차형식은 좌표의 제곱과 두 좌표의 곱으로 좌표 목록을 수 하나로 바꾼다. $q(x_1,x_2)=2x_1^2+4x_1x_2+3x_2^2$는 $(1,2)$에 22를 준다. 아래 행렬 표기는 이 계수들을 간결하게 보관한다.

### 먼저 읽을 표기
{: id="notation-to-read-first"}

**벡터** $x\in\mathbb R^n$은 실수 $n$개의 열이며 원소 $x_1,\ldots,x_n$이 **좌표**이다. **스칼라**는 22 같은 하나의 수이다. $A\in\mathbb R^{n\times n}$은 $n$행 $n$열 배열이고 $a_{ij}$는 $i$행 $j$열이다. **주대각선**은 왼쪽 위에서 오른쪽 아래로 이어진다.

**전치** $A^T$는 행과 열을 바꾸므로 $x^T$는 열을 행으로 만든다. 예를 들어

$$
x=\begin{bmatrix}1\\2\end{bmatrix},\qquad
x^T=\begin{bmatrix}1&2\end{bmatrix}.
$$

**내적**은 대응 좌표를 곱해 더한다. $(1,2)^T\cdot(3,4)^T=1\cdot3+2\cdot4=11$이다. **항등행렬** $I$는 대각 1, 나머지 0이어서 $Ix=x$이다. [행렬 분해 개요]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})와 [OpenStax의 행렬 표기](https://openstax.org/books/college-algebra-2e/pages/7-5-matrices-and-matrix-operations)를 참고하자.

### 정식 정의
{: id="formal-definition"}

실수 **이차형식**은 벡터를 받아 실수 하나를 내는 다음 형태의 함수 $q:\mathbb R^n\to\mathbb R$이다.

$$
q(x)=x^TAx=\sum_{i=1}^n\sum_{j=1}^n a_{ij}x_ix_j,
$$

$A\in\mathbb R^{n\times n}$은 고정이고 $x\in\mathbb R^n$은 열벡터이다. 두 합 기호는 모든 인덱스 쌍 $i,j$에 대해 $a_{ij}x_ix_j$를 더한다는 뜻이다. 각 항에는 정확히 두 좌표 인수가 있으며 $x_1^2$는 $x_1x_1$이다. $5x_1$ 같은 **일차항**이나 7 같은 **상수항**은 없다. 모든 좌표를 $t$배 하면 항이 $t^2$배가 되는 **2차 동차**이다. $2x_1^2+3x_2^2$는 두 좌표를 두 배로 하면 네 배가 된다. [MIT 노트 §5.2](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=3).

차원을 보면 스칼라인 이유가 드러난다.

$$
\underbrace{x^T}_{1\times n}\,
\underbrace{A}_{n\times n}\,
\underbrace{x}_{n\times1}
\quad\longrightarrow\quad 1\times1.
$$

$Ax$부터 계산한 뒤 $x$와 내적하면 $q(x)=x\cdot(Ax)$이다. 행렬은 벡터를 다른 벡터로 보내고 이차형식은 수를 부여한다. **유클리드 노름** $\lVert x\rVert_2=\sqrt{x_1^2+\cdots+x_n^2}$은 보통 길이로 $(3,4)^T$의 길이는 5, 제곱은 25이다. [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }})을 참고하자. $A=I$이면 $x^Tx=\lVert x\rVert_2^2$이다. 일반 행렬은 입력 비용인 **벌점**과 좌표 상호작용을 나타낸다. “에너지”는 비용의 해석이며 물리 에너지일 필요는 없다.

아래 예제·유도·연습은 이 개념을 설명하려고 직접 구성했다.

## 행렬 읽기와 구성
{: id="reading-and-constructing-the-matrix"}

**주대각선**은 왼쪽 위에서 오른쪽 아래이며 **비대각**은 나머지 위치이다. 전치와 같으면 **대칭**이어서 대각을 사이에 둔 원소가 같다. 아래 두 비대각은 모두 $b$이다. 이 $2\times2$ 행렬에서

$$
A=\begin{bmatrix}a&b\\b&c\end{bmatrix},\qquad
q(x)=ax_1^2+2bx_1x_2+cx_2^2.
$$

**교차항**은 $4x_1x_2$처럼 다른 좌표를 곱한 항이고 **계수**는 곱해진 수 4이다. $(x_1+x_2)^2=x_1^2+2x_1x_2+x_2^2$의 혼합곱은 괄호의 다른 두 부분을 곱해 생긴다. $x^TAx$에는 $a_{12}x_1x_2$, $a_{21}x_2x_1$로 두 번 나온다. 따라서 $3x_1^2+4x_1x_2+2x_2^2$를 대칭행렬로 쓰려면 각 비대각에 **교차항 계수의 절반**을 넣는다.

$$
A=\begin{bmatrix}3&2\\2&2\end{bmatrix}.
$$

$x=(1,-1)^T$에서 두 방식으로 계산하면

$$
Ax=\begin{bmatrix}1\\0\end{bmatrix},\qquad
x^T(Ax)=1,
$$

$$
3(1)^2+4(1)(-1)+2(-1)^2=1.
$$

세 변수에도 같은 규칙으로

$$
2x_1^2+3x_2^2+x_3^2+6x_1x_2-4x_1x_3
=x^T\begin{bmatrix}2&3&-2\\3&3&0\\-2&0&1\end{bmatrix}x.
$$

상호작용이 없으면 비대각 원소가 0이다. 대응 대각도 0이어야 하는 것은 아니다.

## 대칭 부분만 중요한 이유
{: id="why-only-the-symmetric-part-matters"}

**반대칭행렬**은 $K^T=-K$로 대각 반대편에서 부호가 바뀌고 대각은 0이다. 예를 들어

$$
K=\begin{bmatrix}0&2\\-2&0\end{bmatrix},\qquad
x^TKx=2x_1x_2-2x_2x_1=0.
$$

반대 기여가 상쇄된다. 모든 실수 정사각행렬은 대칭 부분 $S$와 반대칭 부분 $K$로 나눌 수 있다.

$$
S=\frac{A+A^T}{2},\qquad K=\frac{A-A^T}{2},\qquad A=S+K.
$$

$K^T=-K$이고 스칼라는 자신의 전치와 같으므로

$$
x^TKx=(x^TKx)^T=x^TK^Tx=-x^TKx.
$$

따라서 $x^TKx=0$이고

$$
\boxed{x^TAx=x^TSx.}
$$

대칭 대표만 고려해도 이차형식을 잃지 않음을 증명했다. [MIT 연습 84와 정리 86](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=3). **기저**는 모든 벡터를 유일하게 조립할 구성요소들이며 어느 것도 나머지의 배수 합으로 만들 수 없는 **독립**이다. 보통 기저 $e_1=(1,0)^T$, $e_2=(0,1)^T$는 $x=x_1e_1+x_2e_2$를 준다. $e_i$는 $i$번째 1, 나머지 0이다. 선택한 좌표에서 대칭 대표는 유일하지만 반대칭행렬을 더해도 형식은 같다.

예를 들어

$$
A=\begin{bmatrix}2&5\\-1&3\end{bmatrix},\qquad
S=\begin{bmatrix}2&2\\2&3\end{bmatrix}
$$

는 모두 $2x_1^2+4x_1x_2+3x_2^2$를 준다. **고유벡터** $v\ne0$는 $Sv=\lambda v$이며 배수 $\lambda$가 **고윳값**이다. 대각 2,3이고 나머지 0인 $\operatorname{diag}(2,3)$은 $e_1$을 $2e_1$로 보내므로 고윳값은 2이다. [개요의 예제]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})를 참고하자. 부호·기하는 $S$의 고윳값으로 연구한다. 비대칭 $A$의 양의 고윳값만으로 부족하다. <span class="math-inline" markdown="0">\(A=\begin{bmatrix}1&4\\0&1\end{bmatrix}\)</span>의 고윳값은 1뿐이지만 $q(1,-1)=-2$이다.

## 기하: 방향, 크기와 등위선
{: id="geometry-direction-scale-and-level-curves"}

모든 실수 스칼라 $t$에 대해

$$
q(tx)=t^2q(x),\qquad q(-x)=q(x).
$$

변위를 두 배로 하면 값은 네 배, 방향을 반대로 해도 값은 같다. **선형** 함수는 $q(tx)=tq(x)$와 $q(x+z)=q(x)+q(z)$를 만족해야 한다. 이차형식은 보통 어긴다. $q(x)=x_1^2$이면 $q(2e_1)=4$지만 $2q(e_1)=2$이다.

두 벡터의 내적이 0이면 **직교**, 즉 수직이다. **단위벡터**는 길이 1이다. 수직 단위 열을 갖는 정사각행렬 $Q$는 **직교**로 $Q^TQ=I$와 동치이며 길이를 보존하며 회전·반사한다. **대각행렬**은 주대각선 밖이 0이다.

**스펙트럴 정리**에 의해 실수 대칭행렬에는 수직 단위 고유벡터 기저가 있다. 이를 $Q$의 열, 고윳값을 $\Lambda$의 대각에 두면 $A=Q\Lambda Q^T$이며 $Q$는 직교이다. $y=Q^Tx$라 두면

$$
q(x)=y^T\Lambda y=\sum_i\lambda_i y_i^2.
$$

고유벡터 좌표는 교차항을 없앤다. [MIT 대각화 논증](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=4). $Q$가 길이를 보존하므로 $\lambda_i$는 **주방향**인 단위 고유벡터 방향의 벌점이다. 거리 $t$만큼 움직이면 $q(tv_i)=\lambda_it^2$이다. 기울기 변화율 $2\lambda_i$는 이 일변수 포물선의 **2차 도함수**이다. 여기서 **곡률**은 이 뜻이며 아래 미분 절에서 표기를 설명한다.

구체적으로 <span class="math-inline" markdown="0">\(A=\begin{bmatrix}2&1\\1&2\end{bmatrix}\)</span>의 단위 고유벡터 $(1,1)^T/\sqrt2$, $(1,-1)^T/\sqrt2$의 고윳값은 3,1이다. 따라서

$$
y_1=\frac{x_1+x_2}{\sqrt2},\qquad
y_2=\frac{x_1-x_2}{\sqrt2},\qquad
q(x)=3y_1^2+y_2^2.
$$

**등위선(contour)**은 같은 값의 입력들을 잇는다. $q(x)=1$은 곡선의 모든 점에서 값이 1이라는 뜻이다. $3y_1^2+y_2^2=1$은 원을 늘린 **타원**이다. **반축**은 중심에서 주방향의 가장자리까지 거리로 $y_2=0$에서 $|y_1|=1/\sqrt3$, $y_1=0$에서 $|y_2|=1$이다. 양의 고윳값이 클수록 같은 값의 등위선은 그 방향으로 좁다.

그림은 부호 용어도 예고한다. **양의 정부호**는 모든 0이 아닌 입력에서 양수, **양의 준정부호**는 음수가 아님, **부정부호**는 양의 방향과 음의 방향이 공존함이다. $x_1^2+x_2^2$, $x_1^2$, $x_1^2-x_2^2$가 각각의 예이다.

{% include image.html src="/assets/images/wiki/cholesky-energy-ko.svg" alt="같은 값 곡선이 양의 정부호의 타원, 양의 준정부호의 평행선과 부정부호의 쌍곡선을 비교한다." caption="각 곡선은 함수값 q(x)=xᵀAx가 같은 입력 x=(x₁,x₂)를 잇는다. q=4는 곡선 전체의 함수값 4이며 축 좌표가 아니다. 모든 패널의 파란 실선은 1,2,4이다. 타원은 양의 정부호 최소점을 둘러싸고 수직선 쌍은 x₁²가 x₂에 불변임을 보인다(q=4는 x₁=±2). 부정부호의 주황 점선은 −1,−2,−4이고 회색 직선은 0이다." %}

그림은 위치에 따른 높이 그래프가 아니라 입력 평면의 지도이다. 값을 높이로 그리면 $x_1^2+x_2^2$는 모든 방향으로 오르는 **그릇**, $x_1^2$는 $x_2$ 방향에 불변인 **골**, $x_1^2-x_2^2$는 한 축에서 오르고 다른 축에서 내려가는 **안장**이다. **평평한 방향**은 움직여도 값이 바뀌지 않는 방향이며 골에서는 $(0,1)^T$의 임의 배수를 더해도 같다.

## 정부호성: 가능한 부호
{: id="definiteness-what-signs-are-possible"}

원래 $A$가 비대칭이면 대칭 대표 $S$를 쓴다. **SPD**는 대칭 양의 정부호, **PSD**는 양의 준정부호이다. “비음수”는 0을 포함하고 “양수”는 제외한다.

| 유형 | 조건 | $S$의 고윳값 | 예제 |
| --- | --- | --- | --- |
| 양의 정부호 | 모든 $x\ne0$에서 $q(x)>0$ | 모두 양수 | $x_1^2+2x_2^2$ |
| 양의 준정부호 | 모든 $x$에서 $q(x)\ge0$ | 모두 비음수 | $x_1^2$ |
| 음의 정부호 | 모든 $x\ne0$에서 $q(x)<0$ | 모두 음수 | $-x_1^2-2x_2^2$ |
| 음의 준정부호 | 모든 $x$에서 $q(x)\le0$ | 모두 비양수 | $-x_1^2$ |
| 부정부호 | 양수·음수 값을 모두 취함 | 두 부호 공존 | $x_1^2-x_2^2$ |

음의 정부호는 모든 0이 아닌 입력에서 엄격히 음수이며 음의 준정부호는 0을 허용하되 양수는 없다. 위 대각합으로 판정하며 [MIT 정리 86](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=4)과 비교하자. 비엄격 정의에서는 정부호도 준정부호이다. “준정부호지만 정부호는 아님”은 0이 아닌 영값 방향이 있다는 뜻이다. 영형식은 양·음의 준정부호 모두이다.

**양의 대각만으로 모든 방향의 양수를 증명하지 못한다.** <span class="math-inline" markdown="0">\(A=\begin{bmatrix}1&2\\2&1\end{bmatrix}\)</span>는 두 축에서는 양수지만 $q(1,-1)=-2$이다. 반대로 음의 비대각이 양의 정부호를 막는 것도 아니다.

$$
2x_1^2-2x_1x_2+2x_2^2=(x_1-x_2)^2+x_1^2+x_2^2.
$$

**영공간**은 $Av=0$인 벡터 집합이다. $\operatorname{diag}(1,0)$은 $(0,1)^T$를 0으로 보낸다. 0이 아닌 벡터의 영값이 꼭 평평한 방향은 아니다. 부정부호 $x_1^2-x_2^2$에서 $q(1,1)=0$이지만 $A(1,1)^T\ne0$이다. 다만 대칭 PSD에서는 $q(x)=0$이 양의 고윳값 좌표들을 모두 0으로 강제해 $Ax=0$이다.

## 완전제곱과 Cholesky
{: id="completing-the-square-and-cholesky"}

**완전제곱 만들기**는 제곱항·교차항을 제곱 괄호로 모으고 나머지를 기록한다. $(t+1)^2$가 $t^2+2t+1$을 주므로 $t^2+2t+3=(t+1)^2+2$이다. 두 좌표에서는 $(x_1+x_2)^2$가 $2x_1x_2$를 준다. 자세한 단계는 [Cholesky 설명]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})을 참고하자.

$a>0$에서 직접 전개하면

$$
ax_1^2+2bx_1x_2+cx_2^2
=a\left(x_1+\frac ba x_2\right)^2+
\left(c-\frac{b^2}{a}\right)x_2^2.
$$

<span class="math-inline" markdown="0">\(A=\begin{bmatrix}4&2\\2&3\end{bmatrix}\)</span>에서는

$$
q(x)=(2x_1+x_2)^2+(\sqrt2x_2)^2.
$$

이 합은 $x=0$ 외에 엄격히 양수이다. $y_1=2x_1+x_2$, $y_2=\sqrt2x_2$라 두면 $q(x)=y_1^2+y_2^2$이다. 이 좌표변환은 다음 $y=L^Tx$이다.

$$
L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix},\qquad
A=LL^T,\qquad q(x)=\lVert L^Tx\rVert_2^2.
$$

$L$은 대각 위가 0인 **하삼각**이다. 전치는 상삼각이며 $y_2$는 $x_2$만, $y_1$은 두 좌표 모두를 쓴다. 이런 한 방향 의존성이 “삼각”의 뜻이다.

[Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})는 [대칭 양의 정부호 행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})의 삼각 제곱합을 구성한다. 존재성은 [Higham](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/)을 참고하자. 남은 계수 $c-b^2/a$는 한 수의 [Schur 보완행렬]({{ '/wiki/linear-algebra/schur-complement-ko/' | relative_url }})이며 $x_2$를 고정하고 $x_1$을 조정한 뒤의 최솟값을 정한다. [Gallier, §2](https://www.cis.upenn.edu/~jean/schur-comp.pdf#page=3)는 한 좌표씩 대신 여러 행·열을 묶는 **블록** 버전을 전개한다.

직교 고유벡터 변환은 길이를 보존하며 주방향을 드러낸다. 삼각 Cholesky 변환은 좌표의 척도를 바꾸고 혼합해 벌점을 보통 길이 제곱으로 만든다. 목적이 다른 두 유용한 [행렬 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})이다.

## 미분과 최적화
{: id="derivatives-and-optimization"}

**최적화**는 함수가 최대·최소가 되도록 입력을 고른다. 최소화할 함수가 **목적함수**이며 **전역 최소값**은 다른 모든 입력의 함수값 이하이다.

**도함수**는 기울기를 측정한다. **편미분**은 다른 좌표를 고정하고 하나를 바꾼다. **기울기** $\nabla q$는 이를 벡터로 모으고 **Hessian** $\nabla^2q$는 기울기 변화를 나타내는 2차 편미분 행렬이다. 예를 들어

$$
q(x)=2x_1^2+3x_2^2,\qquad
\nabla q(x)=\begin{bmatrix}4x_1\\6x_2\end{bmatrix},\qquad
\nabla^2q(x)=\begin{bmatrix}4&0\\0&6\end{bmatrix}.
$$

비대각 0은 $x_2$ 변경이 $x_1$의 기울기에, 또는 반대에 영향을 주지 않음을 뜻한다. [OpenStax의 편미분과 고계미분](https://openstax.org/books/calculus-volume-3/pages/4-3-partial-derivatives).

작은 입력 변화를 $h$라 하자. **1차 변화**는 $h$의 크기에 비례하는 부분이며 이차항은 더 빠르게 작아진다. $(1+h)^2-1=2h+h^2$의 1차 부분은 $2h$이다. 이차형식의 $q(x+h)$를 전개하면

$$
q(x+h)-q(x)=h^TAx+x^TAh+h^TAh
=h^T(A+A^T)x+h^TAh.
$$

$h$의 이차항에는 1차 기여가 없으므로

$$
\nabla q(x)=(A+A^T)x,\qquad \nabla^2q(x)=A+A^T.
$$

대칭 $A$에서는 $2Ax,2A$로 줄어든다. 목적함수에 흔히 쓰는 $1/2$가 이 2를 상쇄한다.

$$
f(x)=\frac12x^TAx-r^Tx+d,\qquad
\nabla f(x)=Ax-r,\qquad \nabla^2f(x)=A.
$$

$r$은 고정 벡터, $d$는 고정 스칼라이다. $f$는 이차함수이고 이차 부분이 이차형식, $-r^Tx$는 일차, $d$는 상수이다. **정지점**은 모든 좌표 기울기가 0인 입력이다. $t^2-4t$의 기울기는 $2t-4$여서 $t=2$가 정지점이다. SPD이면 정지점 $x_\star$는 $Ax_\star=r$을 푼다. 대입하고 전개하면

$$
f(x)-f(x_\star)=\frac12(x-x_\star)^TA(x-x_\star)>0
\quad(x\ne x_\star),
$$

유일한 전역 최소점임이 증명된다. 부정부호 이차함수의 정지점은 최소점이 아닐 수 있다. [볼록성의 기울기·곡률]({{ '/wiki/optimization/convexity-ko/' | relative_url }}#slopes-and-curvature-links-to-quadratic-forms)은 대칭 PSD Hessian이 볼록 이차함수를 주는 이유, SPD의 강화와 볼록성만으로 최소 달성을 보장하지 못하는 이유를 설명한다.

**최소제곱**은 예측 $Bx$와 측정 $b$의 차이인 **잔차** $b-Bx$의 제곱합을 최소화하는 매개변수 $x$를 고른다. 제곱 길이가 총 제곱오차이다. 수 $t$를 $1,2,6$에 맞추면 $(1-t)^2+(2-t)^2+(6-t)^2$를 최소화하고 최선은 $t=3$이다. 일반적으로

$$
\lVert Bx-b\rVert_2^2=x^TB^TBx-2b^TBx+b^Tb.
$$

이차형식은 $x^TB^TBx=\lVert Bx\rVert_2^2$로 비음수이다. 어느 열도 다른 열의 조합이 아니면 **선형독립**이다. $(1,0)^T,(0,1)^T$는 독립이지만 $(1,0)^T,(2,0)^T$는 아니다. $B$의 열이 독립이면 양의 정부호이며 아니면 일부 매개변수 변화의 비용이 0이다. [Higham의 Gram 논증](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/), [LU의 정규방정식 유도]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }}).

## 대화형 예제: 결합 바꾸기
{: id="interactive-example-change-the-coupling"}

여기서 **결합**은 교차항 계수 $b$의 상호작용이다. 아래 탐색기는 <span class="math-inline" markdown="0">\(A=\begin{bmatrix}a&b\\b&c\end{bmatrix}\)</span>와 선택한 벡터의 $q(x)$를 표시한다. $a=4,c=3,x=(1,-1)^T$를 유지하고 슬라이더를 움직이기 전에 $q(x)=7-2b$를 예측하자. 평평한·부정부호 사전설정의 영·음의 방향도 비교하자.

{% include wiki-lab-ko.html kind="cholesky" title="이차형식과 방향 탐구" plot_description="표본 이차값, 양의 정부호 입력의 단위값 타원과 선택한 입력 벡터." %}

색은 고정 입력 범위의 부호와 상대 크기를 보인다. 선택한 한 벡터의 영값만으로 전체 형식을 분류할 수 없다. JavaScript가 없으면 위 완전제곱을 보자. $b=2$는 양의 정부호, $b=\sqrt{12}$는 평평한 방향, $b=4$는 부정부호이다. 경계는 모든 방향에 관한 것이며 $q(1,-1)$은 여전히 양수일 수 있다.

## 연습문제
{: id="practice-problems"}

직접 만든 네 문제는 손계산·해석·논리·응용을 다룬다. 힌트와 풀이를 펼치기 전에 시도하자.

### 1. 손계산: 구성과 평가
{: id="1-hand-calculation-build-and-evaluate"}

$q(x)=5x_1^2-6x_1x_2+2x_2^2$의 대칭행렬을 구하고 행렬 곱과 좌표 대입으로 $q(1,2)$를 평가하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

계수 −6을 두 비대각에 반씩 나눈다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

<span class="math-inline" markdown="0">\(A=\begin{bmatrix}5&-3\\-3&2\end{bmatrix}\)</span>이고 $x=(1,2)^T$에서 $Ax=(-1,1)^T$이다. 따라서 $x^TAx=-1+2=1$이며 대입도 $5-12+8=1$이다.

</details>
</div>

### 2. 해석: 영값과 평평한 방향 구별하기
{: id="2-interpretation-distinguish-zero-value-from-a-flat-direction"}

$q_1(x)=(x_1+x_2)^2$, $q_2(x)=x_1^2-x_2^2$는 모두 $v=(1,-1)^T$에서 0이다. 어느 것이 PSD, 부정부호인가? $Av=0$도 성립하는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

좌표축을 시험한 뒤 각 표현 행렬을 v에 곱한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

<span class="math-inline" markdown="0">\(A_1=\begin{bmatrix}1&1\\1&1\end{bmatrix}\)</span>은 제곱이라 PSD이며 $A_1v=0$이므로 $v$의 배수를 더해도 $q_1$은 같다. $A_2=\operatorname{diag}(1,-1)$은 두 축이 반대 부호라 부정부호이다. $A_2v=(1,1)^T\ne0$이므로 영값은 영공간이 아닌 상쇄에서 나온다.

</details>
</div>

### 3. 논리: 형식으로 대칭행렬 복원하기
{: id="3-logic-recover-a-symmetric-matrix-from-its-form"}

대칭행렬 $S,T$가 모든 $x$에서 $x^TSx=x^TTx$를 만족하면 $S=T$임을 증명하라. 대칭이 없으면 왜 실패하는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

D=S−T라 두고 좌표벡터 eᵢ와 합 eᵢ+eⱼ를 시험한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$e_i^TDe_i=d_{ii}=0$이다. $i\ne j$이면

$$
(e_i+e_j)^TD(e_i+e_j)=d_{ii}+2d_{ij}+d_{jj}=0.
$$

따라서 $d_{ij}=0$으로 모든 원소가 0이다. 대칭이 없으면 0이 아닌 반대칭 $K$가 모든 $x$에서 $x^TKx=0$을 만족해 영행렬과 같은 형식을 준다.

</details>
</div>

### 4. 응용: 결합된 벌점 최소화하기
{: id="4-application-minimize-a-coupled-penalty"}

<span class="math-inline" markdown="0">\(A=\begin{bmatrix}4&2\\2&3\end{bmatrix}\)</span>, $r=(6,5)^T$에서 $f(x)=\frac12x^TAx-r^Tx$를 최소화하라. 최소점을 구하고 전역임을 증명하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

Ax=r을 풀고 이차형식의 완전제곱으로 최소성을 보인다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$4x_1+2x_2=6$, $2x_1+3x_2=5$로 $x_\star=(1,1)^T$이고 $f(x_\star)=11/2-11=-11/2$이다. $h=x-x_\star$라 두면

$$
f(x)-f(x_\star)=\frac12\left((2h_1+h_2)^2+2h_2^2\right).
$$

$h\ne0$에서 양수이므로 최소점은 유일하고 전역이다.

</details>
</div>

## 더 공부할 자료
{: id="further-learning"}

- [MIT 14.102, §5.2: Quadratic Forms](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=3): 다항식에서 고윳값 부호 판정으로 나아간다. 정리 86의 음의 준정부호 표시식은 $\lambda_i\le0$이며 딸린 설명에는 부호 오타가 있다.
- [Higham: What Is a Symmetric Positive Definite Matrix?](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/): 양의 이차값을 Gram 행렬과 Cholesky 인수에 연결한다.
- [Gallier: The Schur Complement and Symmetric Positive Semidefinite (and Definite) Matrices](https://www.cis.upenn.edu/~jean/schur-comp.pdf): 스칼라 완전제곱을 결합된 변수 블록으로 확장한다.

## 관련 문서
{: id="related-pages"}

- [대칭 양의 정부호 행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})
- [Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})
- [Schur 보완행렬]({{ '/wiki/linear-algebra/schur-complement-ko/' | relative_url }})
- [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})
- [LU 분해]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. Barczi, N. (2004). *14.102: Math for Economists, Lecture Notes, September 23*. MIT, [§5.2, Quadratic Forms](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=3).
2. Higham, N. J. (2020). [What Is a Symmetric Positive Definite Matrix?](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/).
3. Gallier, J. (2019). [The Schur Complement and Symmetric Positive Semidefinite (and Definite) Matrices](https://www.cis.upenn.edu/~jean/schur-comp.pdf). University of Pennsylvania.

4. OpenStax. *College Algebra 2e*. [Matrices and Matrix Operations](https://openstax.org/books/college-algebra-2e/pages/7-5-matrices-and-matrix-operations). 행렬 차원과 곱셈.
5. OpenStax. *Calculus Volume 3*. [Partial Derivatives](https://openstax.org/books/calculus-volume-3/pages/4-3-partial-derivatives). 각 좌표 방향 기울기와 고계미분.
