---
title: Cholesky 분해
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-cholesky-decomposition
description: 측량망의 보정 문제에서 출발해 양의 이차형식을 삼각 인수와 제곱합으로 나타냅니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: fb2e1ded4fbb1dfbf293a02cb58b13b0b603fd2c18e3e74252cabf96378c7d53
interactive_examples: true
---

## 정의
{: id="definition"}

실수 **[대칭 양의 정부호]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})**(SPD) $A\in\mathbb R^{n\times n}$의 **Cholesky 분해**는

$$
A=LL^T,
$$

$L$이 엄격히 양의 대각을 갖는 하삼각인 표현이다. 존재하고 유일하다. 상삼각 $R=L^T$의 $A=R^TR$와 동치이다. SPD란

$$
A^T=A,\qquad x^TAx>0\quad\text{모든 }x\ne0.
$$

[van de Geijn의 정의·존재 정리](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html)를 참고하자. 복소 Hermitian 양의 정부호에서는 켤레전치 $L^\ast$를 써 $A=LL^\ast$이다. [LAPACK ZPOTRF](https://www.netlib.org/lapack/complex16/zpotrf.f)가 복소 관례를 준다.

구조적인 [행렬 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})이다. [LU]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})의 단위 하삼각과 달리 대각은 일반적으로 1이 아니다.

## 직관: 양의 에너지가 보통 길이 제곱이 된다
{: id="intuition-positive-energy-becomes-ordinary-squared-length"}

핵심 질문은 **양의 이차식을 제곱 하나씩 계산하며 제곱합으로 바꿀 수 있는가?**이다. 작은 예제에서 계산한 계수를 행렬로 모아 $L$을 얻자.

**[이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})**은 스칼라 $q(x)=x^TAx$이다. 변위 $x$의 에너지·벌점으로 생각하자. 실수 대칭 <span class="math-inline" markdown="0">\(A=\begin{pmatrix}4&2\\2&3\end{pmatrix}\)</span>에서는

$$
q(x)=4x_1^2+4x_1x_2+3x_2^2.
$$

### 교차항의 의미
{: id="what-a-cross-term-means"}

**교차항**은 다른 두 변수를 곱하며 여기서는 $4x_1x_2$이다. $4x_1^2$는 $x_1$만, $3x_2^2$는 $x_2$만 포함한다.

교차항의 기여는 두 변수와 상대 부호에 달린 상호작용이다. 두 입력을 비교하면

$$
q(1,1)=4+4+3=11,\qquad q(1,-1)=4-4+3=3.
$$

제곱항은 같고 교차항만 부호가 바뀐다. 좌표를 *결합한다*는 것은 공동 기여를 개별 제곱만으로 설명할 수 없다는 뜻이다.

행렬 곱에서 두 비대각은 $2x_1x_2$, $2x_2x_1$을 주어 $4x_1x_2$가 된다. [이차형식 문서]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})가 원소·항의 대응을 설명한다.

### 완전제곱 만들기의 의미
{: id="what-completing-the-square-means"}

**완전제곱 만들기**는 값을 유지하며 제곱으로 이차식을 다시 쓰는 것이다. 다음에서 시작하자.

$$
(x+t)^2=x^2+2tx+t^2.
$$

$x^2+6x$에서는 $2tx=6x$가 되게 $t=3$을 고른다. 제곱이 9를 더 주므로 빼면

$$
x^2+6x=x^2+6x+9-9=(x+3)^2-9.
$$

같은 양을 더하고 빼면 식이 보존된다. [OpenStax 설명](https://openstax.org/books/college-algebra-2e/pages/2-5-quadratic-equations).

두 변수 예제에서는

$$
(2x_1+x_2)^2=4x_1^2+4x_1x_2+x_2^2.
$$

이 제곱은 처음 두 항과 **$x_2^2$ 세 개 중 하나**를 사용한다. 두 개가 남아

$$
q(x)=(2x_1+x_2)^2+2x_2^2=(2x_1+x_2)^2+(\sqrt2x_2)^2.
$$

원래 변수들의 결합을 제곱한 합이 되었다.

### 순서대로 완전제곱을 만들면 삼각행렬이 되는 이유
{: id="why-completing-squares-in-order-creates-a-triangular-matrix"}

핵심 선택은 **한 변수를 마치고 다음으로 넘어가는 것**이다. $x_1$이 든 모든 항을 $(2x_1+x_2)^2$에 모아 원래 식에서 빼면

$$
q(x)-(2x_1+x_2)^2=2x_2^2.
$$

나머지에는 $x_1$이 없다. 다음 제곱 $(\sqrt2x_2)^2$의 $x_1$ 계수는 0이므로 두 제곱의 계수 행 패턴은

$$
\begin{bmatrix}
\text{다음 항의 계수: }x_1&\text{다음 항의 계수: }x_2\\
0&\text{다음 항의 계수: }x_2
\end{bmatrix}.
$$

세 변수에서는 $x_1$ 항을 먼저 흡수하여 $x_2,x_3$만 남기고 다음 제곱이 $x_2$ 항을 흡수해 $x_3^2$의 배수만 남긴다. 결과 결합은

$$
y_1=r_{11}x_1+r_{12}x_2+r_{13}x_3,\qquad
y_2=r_{22}x_2+r_{23}x_3,\qquad
y_3=r_{33}x_3.
$$

$r_{ij}$는 $i$번째 결합의 $x_j$ 계수이다. 뒤 결합은 앞 제곱에 흡수한 변수를 생략한다. 빠진 계수가 **상삼각** 계수행렬 대각 아래의 0이며 전치하면 하삼각 $L$이다.

따라서 삼각성은 **변수 순서대로** 완전제곱을 만들기 때문에 나온다. 임의의 제곱합은 이 패턴이 아닐 수 있다. 양의 정부호는 매 나머지가 다음 제곱의 양의 계수를 주게 한다. 아래 증명에서 계속 진행 가능한 이유를 보인다.

### Cholesky가 결합을 기록하는 방법
{: id="how-cholesky-records-these-combinations"}

새 양 둘을 정의하자.

$$
y_1=2x_1+x_2,\qquad y_2=\sqrt2x_2.
$$

$q(x)=y_1^2+y_2^2$는 벡터 $y$의 보통 길이 제곱이다. $x=(1,1)^T$이면 $y=(3,\sqrt2)^T$로 같은 11이 $3^2+(\sqrt2)^2$가 된다.

두 결합의 계수를 $R$이라는 행렬로 모으자.

$$
\begin{bmatrix}y_1\\y_2\end{bmatrix}
=\underbrace{\begin{bmatrix}2&1\\0&\sqrt2\end{bmatrix}}_{R}
\begin{bmatrix}x_1\\x_2\end{bmatrix}.
$$

원소는 두 $y$ 방정식의 계수이다. 대각 아래 0은 모든 $x_1$ 항을 첫 제곱에 흡수한 뒤 둘째에는 $x_2$만 썼음을 기록한다. 앞의 상삼각 패턴이다.

전치와 자신을 곱하면

$$
R^TR=
\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}
\begin{bmatrix}2&1\\0&\sqrt2\end{bmatrix}
=\begin{bmatrix}4&2\\2&3\end{bmatrix}=A.
$$

**완전제곱으로 인수분해를 수행했다.** 정의의 하삼각 관례에는 전치를 $L=R^T$라 부르면

$$
L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix},\qquad A=LL^T.
$$

$L$의 열은 방금 만든 제곱들의 계수이다. Cholesky는 양의 대각을 택해 SPD에 이 생각을 체계적으로 수행한다. 아래 알고리즘이 순차 구성을 정확하게 만든다. [FLAME 정의·알고리즘](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

원변수 복원 순서도 얻는다. 둘째 식에서 $x_2$를 구하고 첫째에 넣으면

$$
x_2=\frac{y_2}{\sqrt2},\qquad x_1=\frac{y_1-x_2}{2}.
$$

$(y_1,y_2)$는 같은 입력을 표현하는 다른 **좌표**이다. $x$에서 $y$ 계산이 **좌표변환**이다. *삼각*은 특별한 좌표나 도형이 아닌 행렬과 의존 패턴을 뜻한다.

행렬 표기로 제곱합은

$$
x^TAx=\lVert L^Tx\rVert_2^2.
$$

$L^Tx=y$이고 오른쪽 제곱 노름은 $y_1^2+y_2^2$이다. $y$에서 $x$를 복원하므로 $x\ne0$이면 $y\ne0$이고 제곱 중 적어도 하나가 양수이다. 예제의 SPD 조건을 설명한다. [Higham의 이차형식 설명](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/).

등위선과도 연결된다. 원래 $x$에서 $q=4$는 타원이지만 $y=L^Tx$ 후 $y_1^2+y_2^2=4$인 반지름 2의 원이다. 인수는 타원 에너지 수준을 보통 원으로 바꾸는 좌표변환을 준다. 등위선 모양이 목표를, 완전제곱이 방법을 알려 준다.

### 양수는 개별 원소가 아니라 방향의 성질이다
{: id="positivity-concerns-directions-rather-than-individual-entries"}

양의 정부호가 모든 원소 양수를 뜻하지 않는다. <span class="math-inline" markdown="0">\(\begin{pmatrix}2&-1\\-1&2\end{pmatrix}\)</span>는

$$
x^TAx=(x_1-x_2)^2+x_1^2+x_2^2>0\qquad(x\ne0).
$$

반대로 <span class="math-inline" markdown="0">\(\begin{pmatrix}1&2\\2&1\end{pmatrix}\)</span>는 양의 원소지만 $x=(1,-1)^T$에서 $x^TAx=-2$이다. 조건은 원소 부호가 아닌 모든 방향에 관한 것이다.

{% include image.html src="/assets/images/wiki/cholesky-energy-ko.svg" alt="세 등위선 그림이 양의 정부호의 중첩 타원, 준정부호의 평평한 수직 방향과 부정부호의 양·음 곡선을 비교한다." caption="입력 x=(x₁,x₂)의 지도이다. q=4 곡선의 모든 점은 좌표가 아닌 에너지가 4이다. 세 패널의 파란 실선은 q=1,2,4이다. SPD는 원점의 최소값을 둘러싼 타원, q=x₁²는 x₂와 무관한 수직선 쌍으로 q=4는 x₁=±2이다. 부정부호의 주황 점선은 −1,−2,−4, 회색은 0이다." %}

준정부호에는 에너지 비용이 없는 방향이 있다. 부정부호에는 음의 방향이 있어 모든 $x$에서 길이 제곱일 수 없다. 기하 차이는 보통 알고리즘의 0·유효하지 않은 제곱근 피벗에 대응한다.

### 구성한 인수를 읽는 또 다른 방법
{: id="another-way-to-read-the-factor-we-constructed"}

완전제곱에서 찾은 $L$을 다른 방식으로 읽자. $L$의 행과 $L^T$의 열, 즉 옆으로 돌린 $L$의 행을 곱하므로 $LL^T$의 각 원소는 대응 좌표를 곱해 더한 두 행의 **내적**이다. 행을 $r_1,\ldots,r_n$이라 하면 $a_{ij}=r_i\cdot r_j$이다. 예제에서는

$$
r_1=(2,0),\qquad r_2=(1,\sqrt2).
$$

길이 제곱 4·3과 내적 2가 정확히 $A$의 대각·비대각이다. 삼각성은 첫 행 길이를 주고 다음 행과 내적을 맞춘 뒤 나머지 길이를 채우는 좌표를 선택하게 한다. $LL^T$의 Gram 해석이다. [FLAME](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

### 직교화와의 연결
{: id="the-connection-to-orthogonalization"}

독립 열과 양의 대각 $R$인 축소 [QR]({{ '/wiki/linear-algebra/qr-factorization-ko/' | relative_url }}) $B=QR$이면

$$
B^TB=R^TQ^TQR=R^TR.
$$

$R^T$가 Gram 행렬 $B^TB$의 하삼각 Cholesky 인수이다. [Gram–Schmidt]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/' | relative_url }})는 겹치는 성분을 제거해 $Q$를 만들며 계수를 $R$에 기록한다. 정확 산술의 연결이며 [QR 정확도 설명]({{ '/wiki/linear-algebra/qr-factorization-ko/#the-connection-to-cholesky-and-the-accuracy-trap' | relative_url }})에서 Gram을 먼저 만들 때 반올림 정보 손실을 다룬다.

### 삼각 제곱근의 정확한 의미
{: id="a-triangular-square-root-has-a-specific-meaning"}

$A=LL^T$는 $a=\sqrt a\sqrt a$와 비슷하지만 일반적으로 $L^2\ne A$로 전치가 중요하다. 예제의 $L^2$는 오른쪽 위가 0이지만 $a_{12}=2$이다. $S^2=A$인 대칭 제곱근은 다른 분해이다. Cholesky는 순차 계산·풀이를 위해 삼각 인수를 고른다.

## 알고리즘 유도
{: id="deriving-the-algorithm"}

$A=LL^T$의 원소를 맞추면

$$
a_{ij}=\sum_{k=1}^{\min(i,j)}l_{ik}l_{jk}.
$$

$j=1,\ldots,n$ 순서로 열을 계산한다.

$$
l_{jj}=\sqrt{a_{jj}-\sum_{k=1}^{j-1}l_{jk}^2},
$$

이어 $i=j+1,\ldots,n$에서

$$
l_{ij}=\frac{a_{ij}-\sum_{k=1}^{j-1}l_{ik}l_{jk}}{l_{jj}}.
$$

빈 합은 0이고 대각 위는 0으로 남는다. [Higham의 원소별 알고리즘](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/)의 하삼각 대응이다.

### 각 대각은 아직 빠진 부분을 채운다
{: id="each-diagonal-entry-supplies-what-is-still-missing"}

$2\times2$에서는

$$
A=\begin{bmatrix}a&b\\b&c\end{bmatrix},\qquad
L=\begin{bmatrix}\ell_{11}&0\\\ell_{21}&\ell_{22}\end{bmatrix}.
$$

$LL^T$와 $A$를 맞추면 세 요구가 생긴다.

$$
\ell_{11}^2=a,\qquad \ell_{11}\ell_{21}=b,\qquad
\ell_{21}^2+\ell_{22}^2=c.
$$

먼저 $\ell_{11}=\sqrt a$, 공유 성분을 맞추는 $\ell_{21}=b/\sqrt a$, 첫 좌표가 채우지 못한 제곱 길이의 $\ell_{22}=\sqrt{c-b^2/a}$를 고른다.

$a=4,b=2,c=3$에서 둘째 행은 길이 제곱 3이 필요하다. 첫 좌표 1이 이미 1을 기여하므로 남은 좌표는 2를 기여하는 $\sqrt2$이다. 점화식의 뺄셈은 이미 계산한 기여를 빼고 남은 것에 제곱근을 취하는 뜻이다.

완전제곱에도 같은 나머지가 나온다.

$$
ax_1^2+2bx_1x_2+cx_2^2
=a\left(x_1+\frac ba x_2\right)^2+\left(c-\frac{b^2}{a}\right)x_2^2.
$$

$a>0$에서 양의 나머지는 둘째 방향의 양의 에너지, 0은 평평한 방향, 음수는 음의 방향이다. 고차원의 행렬 버전이 [Schur 보완행렬]({{ '/wiki/linear-algebra/schur-complement-ko/' | relative_url }})이다.

### 제곱근이 양수인 이유
{: id="why-the-square-roots-are-positive"}

SPD를 블록으로 나누자.

$$
A=\begin{bmatrix}\alpha&c^T\\c&B\end{bmatrix}.
$$

$\alpha>0$이다. $z\ne0$에 $x=(-c^Tz/\alpha,z)^T$라 두면

$$
0<x^TAx=z^T\left(B-\frac{cc^T}{\alpha}\right)z.
$$

따라서 [Schur 보완행렬]({{ '/wiki/linear-algebra/schur-complement-ko/' | relative_url }}) $B-cc^T/\alpha$도 SPD이다. 귀납적으로 $KK^T$로 분해하면

$$
L=\begin{bmatrix}\sqrt\alpha&0\\c/\sqrt\alpha&K\end{bmatrix}.
$$

양의 제곱근과 매 열은 유일하게 결정된다. 귀납적 존재·유일성 증명이며 전체 논의는 [FLAME](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html)을 참고하자.

## 계산 예제
{: id="worked-example"}

다음을 보자.

$$
A=\begin{bmatrix}4&2\\2&3\end{bmatrix}.
$$

$x\ne0$에서 다음이므로 SPD이다.

$$
x^TAx=4\left(x_1+\frac{x_2}{2}\right)^2+2x_2^2>0.
$$

점화식은

$$
l_{11}=2,\qquad l_{21}=1,\qquad l_{22}=\sqrt{3-1}=\sqrt2.
$$

따라서

$$
L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix},\qquad
LL^T=\begin{bmatrix}4&2\\2&3\end{bmatrix}=A.
$$

$b=(6,5)^T$의 $Ax=b$에는 먼저 $Ly=b$를 푼다.

$$
y_1=3,\qquad y_2=\sqrt2.
$$

$L^Tx=y$에서 $x_2=1,x_1=1$이다. $A(1,1)^T=b$로 확인한다.

## 둘째 예제: 공유 변동과 독립 변동
{: id="a-second-example-shared-and-independent-variation"}

$z_1,z_2$는 평균 0·분산 1의 독립 확률변수라 하고

$$
u_1=2z_1,\qquad u_2=z_1+\sqrt2z_2.
$$

그러면 $\operatorname{Var}(u_1)=4$, $\operatorname{Var}(u_2)=1+2=3$, $\operatorname{Cov}(u_1,u_2)=2$이다. 공유 $z_1$이 공분산을, 독립 $z_2$가 둘째 출력의 남은 분산을 준다. 행렬로 $u=Lz$, $\operatorname{Cov}(u)=LL^T=A$이다. [Stata 공분산 변환](https://www.stata.com/support/faqs/statistics/multivariate-normal-observations/).

{% include image.html src="/assets/images/wiki/cholesky-covariance-ko.svg" alt="입력 좌표 단위원이 L에 의해 기울어진 출력 타원으로 가고 표시한 두 입력 방향이 L의 두 열로 간다." caption="L이 단위원을 타원으로 보낸다. 무작위 표본이 아니라 공분산 생성의 기하이다. 경계는 uᵀA⁻¹u=1이고 앞의 에너지 등위선은 xᵀAx=상수이다." %}

같은 인수를 달리 읽으면 다른 직관을 얻는다. $L^T$는 이차 에너지의 결합을 제거하고 $L$은 독립 입력에 원하는 공분산을 도입한다. 대수 항등식은 같지만 변환 방향·문제가 다르다.

### 거의 0인 나머지가 말하는 것
{: id="what-a-nearly-zero-remainder-tells-us"}

다음에서는

$$
A_\varepsilon=\begin{bmatrix}1&1\\1&1+\varepsilon\end{bmatrix},\qquad
L=\begin{bmatrix}1&0\\1&\sqrt\varepsilon\end{bmatrix},
$$

$\varepsilon>0$이면 SPD이다. 0에서는 두 행이 같은 근원 방향으로 특이하다. 작은 양수에서는 둘째 독립 기여가 작아 한 방향 손실에 가깝다. 삼각계에서 $\sqrt\varepsilon$로 나누므로 작은 변화가 크게 작용한다. 아래 존재·수치 민감도 차이의 예이다.

## 응용과 계산 비용
{: id="applications-and-computational-cost"}

SPD 선형계는 전진대입 $Ly=b$, 후진대입 $L^Tx=y$로 푼다. 추가 오른쪽 항에 $L$을 재사용한다. [LAPACK DPOTRS](https://www.netlib.org/lapack/double/dpotrs.f)가 이 흐름을 구현한다.

행렬식은 곱에서 나온다.

$$
\det A=(\det L)^2=\prod_{i=1}^{n}l_{ii}^2,\qquad
\log\det A=2\sum_{i=1}^{n}\log l_{ii}.
$$

[Higham의 항등식](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/)을 참고하자. 로그식은 양의 대각에 로그를 취해 얻는다.

곱·합을 따로 세는 보통 조밀 Cholesky는 $n^3/3+O(n^2)$ 부동소수점 연산이고 오른쪽 항당 두 삼각계는 $O(n^2)$이다. 3차 선도항은 보통 조밀 LU의 절반이며 삼각 인수 하나만 저장한다. [FLAME 비용](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

## 수치 동작과 한계
{: id="numerical-behavior-and-limitations"}

SPD의 표준 Cholesky는 피벗팅 없이 작은 후방오차를 갖는다. 계산 인수 $\widehat L$은 작은 $\Delta A$에 $A+\Delta A=\widehat L\widehat L^T$이다. 나쁜 조건의 계는 해 오차가 여전히 클 수 있다. 거의 특이한 SPD는 부동소수점에서 비양수 계산 피벗을 만들 수 있다. [Higham의 안정성·실패](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/).

대칭만으로 부족하다. 부정부호에는 정의한 양의 대각 인수가 없다. PSD는 대각 0인 삼각 제곱근이 가능해도 유일성·표준 나눗셈이 따르지 않는다. [Higham의 준정부호 설명](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/). 대칭 부정부호에는 [LAPACK](https://www.netlib.org/lapack/lug/node38.html)이 블록 대각 $D$의 피벗 분해를 쓴다.

## 역사
{: id="history"}

### 원래 문제는 측정망의 조정이었다
{: id="the-original-problem-was-adjusting-a-measured-network"}

프랑스 포병 장교 André-Louis Cholesky는 육군 지리기관에서 일했다. 프랑스 삼각측량망 개정에는 더 빠르고 편리하며 정밀한 조정법이 필요했다. Benoît는 이를 최소제곱 계산법의 배경으로 기록한다. [Richard W. Cottle의 번역](https://netlib.org/na-digest-html/90/v90n07.html#5).

*망의 조정*이란 무엇인가? 평면의 단순화한 측량 예제에서 측정 삼각형 각 합은 $180^\circ+\varepsilon$이지만 기하 조건은 $180^\circ$이다. 보정 $v_1,v_2,v_3$는

$$
v_1+v_2+v_3=-\varepsilon.
$$

가능 보정은 무한하다. 같은 가중치에서 제곱합을 최소화하면 $v_1=v_2=v_3=-\varepsilon/3$이다. 망은 같은 관측을 공유하는 여러 조건이 있어 함께 계산해야 한다. 설명용 예제이며 실제 측지모델은 지구 곡률·망 기하도 반영한다.

원래 질문은 **사람이 신뢰성 있게 수행하는 절차로 측정망 전체를 일관되게 하는 작은 보정을 어떻게 계산하는가?**이다. 최소제곱은 원하는 보정을 정하고 Cholesky의 기여는 얻는 데 필요한 수치 계산이다.

### 정규방정식이 생긴 이유
{: id="why-this-produced-normal-equations"}

Benoît의 1924년 제목에서 *미지수보다 식이 적다*는 것은 오늘날 흔한 과결정 회귀가 아닌 관측 보정의 조건방정식이다. [de Falguerolles §5.2](https://www.numdam.org/item/JSFS_2019__160_2_83_0.pdf#page=7)가 설명한다.

현대 표기에서 $v\in\mathbb R^m$은 보정, $C\in\mathbb R^{p\times m}$은 $p<m$의 독립 선형화 조건이다. 같은 가중치에서는

$$
\min_v\frac12 v^Tv\qquad\text{제약: }Cv=d.
$$

Lagrange 승수 $\lambda\in\mathbb R^p$를 도입하면

$$
\mathcal L(v,\lambda)=\frac12v^Tv-\lambda^T(Cv-d).
$$

정지성·제약은

$$
v=C^T\lambda,\qquad CC^T\lambda=d.
$$

미결정 보정 문제가 승수의 정사각계가 된다. $N=CC^T$는 대칭이며 행이 모두 독립이면 다음으로 양의 정부호이다.

$$
z^TNz=\lVert C^Tz\rVert_2^2>0\qquad(z\ne0).
$$

양의 관측 가중치를 대각 $W$에 모아 $v^TWv/2$를 최소화하면 같은 정지 계산으로 $N=CW^{-1}C^T$, $v=W^{-1}C^T\lambda$이다.

회귀의 익숙한 경로는 대신

$$
\min_x\lVert Bx-b\rVert_2^2
\quad\Longrightarrow\quad B^TBx=B^Tb.
$$

둘 다 적절한 계수 가정 아래 양의 정부호 Gram 행렬을 만든다. 역사적 차이는 미지수 의미이다. 망 조정에서는 관측 보정·승수, 회귀에서는 적합 매개변수이다. [§§5.1–5.2](https://www.numdam.org/item/JSFS_2019__160_2_83_0.pdf#page=6).

### 1910년 방법은 풀이를 두 단계로 구성했다
{: id="the-1910-method-organized-the-solve-into-two-stages"}

남은 원고 날짜는 **1910년 12월 2일**로 그때까지 존재했음을 보인다. 정확 발명일은 모른다. [Brezinski 2005, 217쪽](https://www.numdam.org/item/RHM_2005__11_2_205_0.pdf#page=13).

[Brezinski 2006, 283–286쪽](https://doi.org/10.1007/s11075-006-9059-x)의 구성을 현대 표기로 쓰면 $N\lambda=d$를 직접 풀지 않고 다음 하삼각 $L$을 찾는다.

$$
N=LL^T.
$$

중간 벡터 $y=L^T\lambda$를 도입하면

$$
Ly=d,\qquad L^T\lambda=y.
$$

첫 식은 $y_1,y_2$ 순서, 둘째는 $\lambda_p,\lambda_{p-1}$ 순서로 푼다. $N,LL^T$의 원소를 맞추면 앞의 제곱근 점화식이다. 결합계가 순차 스칼라 계산으로 구성된다.

Cholesky는 계산 배치, Dactyle 기계식 계산기와 오류 확인도 기술했다. 수학 훈련이 적은 군인을 포함한 사람이 작업해 중요했다. 유한 정밀도 오류도 이미 논의하여 전자계산기 전부터 수치 신뢰성을 고려했다. [Brezinski 2006, 285–286쪽](https://doi.org/10.1007/s11075-006-9059-x).

### 1924년 출판과 1944년 이후 보급
{: id="publication-in-1924-and-wider-adoption-after-1944"}

1918년 사망 후 6년 뒤 **1924년** Benoît가 방법을 출판했다. 원고일과 출판일을 구별하자. [Cottle 번역·출판 기록](https://netlib.org/na-digest-html/90/v90n07.html#5).

Henry Jensen의 **1944년** 정규방정식 비교가 John Todd에게 전해져 King's College London의 **1946년** 강의에 쓰였다. Leslie Fox가 NPL에 가져갔다. Fox·Huskey·Wilkinson·Turing의 **1948년** 연구가 수치해석을 발전시키고 교재로 보급되었다. [Brezinski 2005, 216–217쪽](https://www.numdam.org/item/RHM_2005__11_2_205_0.pdf#page=12). [LU 역사]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})의 전후 정확도 문제와 연결된다.

### 범위 확대와 정확도 질문의 정밀화
{: id="the-scope-broadened-and-the-accuracy-question-became-more-precise"}

원고는 일반 정사각계도 고려한다. 비특이 $B$의 현대 표기 구성은

$$
Bx=b,\qquad x=B^T\lambda
\quad\Longrightarrow\quad BB^T\lambda=b.
$$

대칭계를 풀어 $\lambda$를 얻고 $x$를 복원한다. [원고 시스템 I–III, 221–223쪽](https://www.numdam.org/item/RHM_2005__11_2_205_0.pdf#page=17).

현대 수치해석은 대수 동치와 계산 정확도를 구별한다. 비특이 정사각 $B$에서

$$
\kappa_2(BB^T)=\kappa_2(B^TB)=\kappa_2(B)^2.
$$

정규방정식 형성은 반올림 민감도를 크게 키울 수 있고 결과 행렬의 안정적 Cholesky도 되돌리지 못한다. 중요하면 QR·SVD로 Gram 형성을 피할 수 있다. [ALAFF §4.2.5](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html), [LAPACK 최소제곱](https://www.netlib.org/lapack/lug/node27.html).

계산해를 가까운 문제의 정확해로 해석할 수 있는지와 조건수가 교란을 해 오차로 바꾸는지를 묻게 되었다. [LAPACK 후방오차](https://www.netlib.org/lapack/lug/node81.html)는 별도 양으로 표현한다. 원래 신뢰성 목표를 대체하지 않고 정밀화한다.

전자계산은 효율적인 메모리 데이터 이동 문제도 추가했다. [LAPACK](https://www.netlib.org/lapack/)은 많은 작업을 행렬 곱으로 하도록 블록화한다. $A=LL^T$는 같지만 기계에 따라 계산 배치가 바뀐다.

### 인수가 방정식 풀이 밖에서도 유용해졌다
{: id="the-factor-became-useful-beyond-solving-equations"}

현대 인수는 공분산 구조도 표현한다. 양의 정부호 공분산 $\Sigma=LL^T$, 독립 표준정규 성분 $z$이면

$$
u=\mu+Lz,\qquad
\operatorname{Cov}(u)=LIL^T=\Sigma.
$$

여기서 인수는 미지수 풀이 대신 상관 관측을 생성한다. [Stata 다변량 정규 모의실험](https://www.stata.com/support/faqs/statistics/multivariate-normal-observations/). 정의를 바꾸지 않고 삼각 인수의 용도가 늘어난 예이다.

역사의 흐름은 쓸 수 있는 계산이라는 지속적 문제이다. 측정망의 최소제곱 보정에서 정밀 정확도 보장·효율 구현으로, 다른 응용에서는 양의 정부호 행렬 자체의 표현으로 이어진다.

## 대화형 예제: 남은 에너지 바꾸기
{: id="interactive-example-vary-the-remaining-energy"}

대칭 <span class="math-inline" markdown="0">\(A=\begin{pmatrix}a&b\\b&c\end{pmatrix}\)</span>에서 $b$를 바꾸기 전 $c-b^2/a$의 부호를 예측하자. 실패하면 0·음의 에너지 방향을 찾아라. 실패는 선택 행렬의 결과이지 음수 제곱근을 취할 이유가 아니다. [FLAME 점화식](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html)을 따른다.

{% include wiki-lab-ko.html kind="cholesky" title="Cholesky 피벗과 이차 에너지 탐구" plot_description="양·음 표본 에너지 영역, SPD 단위 에너지 등위선과 선택 방향." %}

## 연습문제
{: id="practice-problems"}

힌트·풀이 전에 시도하자. 첫 둘은 손계산, 다음 둘은 해석·접근, 다음 둘은 논리, 마지막 둘은 실무이다. 직접 만든 문제이며 참고문헌은 수학 개념의 근거이다.

### 1. 손계산: 분해와 풀이
{: id="1-hand-calculation-factor-and-solve"}

다음의 양의 대각 $L$, $Ax=b$ 해와 $\det A$를 구하라.

$$
A=\begin{bmatrix}9&3\\3&5\end{bmatrix},\qquad b=\begin{bmatrix}12\\8\end{bmatrix}.
$$

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

왼쪽 위 제곱, 비대각 곱, 남은 제곱 길이 순으로 맞춘다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$l_{11}=3,l_{21}=1,l_{22}=\sqrt{5-1}=2$이므로 <span class="math-inline" markdown="0">\(L=\begin{pmatrix}3&0\\1&2\end{pmatrix}\)</span>이다. 전진대입 $y=(4,2)^T$, 후진대입 $x=(1,1)^T$, 행렬식 $(3\cdot2)^2=36$이다.

</details>
</div>

### 2. 손계산: 세 행 구성
{: id="2-hand-calculation-construct-three-rows"}

다음 Cholesky 인수와 행렬식을 구하라.

$$
A=\begin{bmatrix}4&2&2\\2&5&3\\2&3&6\end{bmatrix}.
$$

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

첫 열은 $(2,1,1)^T$이다. 다음 대각은 아직 채우지 못한 제곱 길이를 준다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

둘째 대각은 $\sqrt{5-1}=2$, $l_{32}=(3-1\cdot1)/2=1$, $l_{33}=\sqrt{6-1-1}=2$이다.

$$
L=\begin{bmatrix}2&0&0\\1&2&0\\1&1&2\end{bmatrix}.
$$

$LL^T$가 $A$를 복원하고 행렬식은 $(2\cdot2\cdot2)^2=64$이다.

</details>
</div>

### 3. 사고: 실패한 제곱근 진단
{: id="3-thinking-diagnose-the-failed-square-root"}

<span class="math-inline" markdown="0">\(A_1=\begin{pmatrix}1&2\\2&5\end{pmatrix}\)</span>와 <span class="math-inline" markdown="0">\(A_2=\begin{pmatrix}1&2\\2&3\end{pmatrix}\)</span> 중 어느 것이 양의 대각 Cholesky를 갖는가? 다른 것의 음의 방향을 제시하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

$c-b^2/a$를 구하고 $x=(-b/a,1)^T$를 시험한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$A_1$은 나머지가 $5-4=1$로 <span class="math-inline" markdown="0">\(L=\begin{pmatrix}1&0\\2&1\end{pmatrix}\)</span>이다. $A_2$는 $3-4=-1$이고 $x=(-2,1)^T$에서 $x^TA_2x=-1$이므로 부정부호로 실수 $LL^T$일 수 없다.

</details>
</div>

### 4. 사고: 1에 가까운 상관 해석
{: id="4-thinking-interpret-correlation-near-one"}

$0\le\rho<1$의 공분산 <span class="math-inline" markdown="0">\(A_\rho=\begin{pmatrix}1&\rho\\\rho&1\end{pmatrix}\)</span>의 $L$과 $\rho=0.9$, $\rho\to1$에서 둘째 대각을 해석하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

둘째 출력을 공유 성분과 독립 성분으로 쓴다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

<span class="math-inline" markdown="0">\(L=\begin{pmatrix}1&0\\\rho&\sqrt{1-\rho^2}\end{pmatrix}\)</span>이다. $0.9$의 독립 계수는 $\sqrt{0.19}\approx0.43589$이며 1로 가면 0으로 가서 두 출력이 같아진다. $\rho=1$의 공분산은 특이하여 양의 대각 정리가 적용되지 않는다.

</details>
</div>

### 5. 논리: 양수 증명과 유일성 검토
{: id="5-logic-prove-positivity-and-examine-uniqueness"}

가역 실수 하삼각 $L$이면 $LL^T$가 SPD임을 증명하라. 유일성에 왜 양의 대각이 필요한가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

$x^TLL^Tx=\lVert L^Tx\rVert_2^2$를 쓰고
$L$을 $-L$로 바꿔 본다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$LL^T$는 대칭이며 $x\ne0$이면 가역성으로 $L^Tx\ne0$라 제곱 노름이 양수이다. 부호를 정하지 않으면 $(-L)(-L)^T=LL^T$도 하삼각 인수이다. 양의 대각으로 하나를 고른다. 그 조건의 존재·전체 유일성은 앞 정리이다.

</details>
</div>

### 6. 논리: 선도 블록의 인수
{: id="6-logic-identify-the-factor-of-a-leading-block"}

SPD Cholesky $A=LL^T$에서 $L$의 왼쪽 위 $k\times k$ 블록이 $A$의 대응 블록의 Cholesky 인수임을 보이라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

L을 블록으로 나누고 오른쪽 위 영블록을 쓴다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

다음처럼 쓰면

$$
L=\begin{bmatrix}L_{11}&0\\L_{21}&L_{22}\end{bmatrix}.
$$

$LL^T$의 왼쪽 위는 $L_{11}L_{11}^T$이다. $L_{11}$은 양의 대각 하삼각이므로 $A_{11}$의 정규화 Cholesky 인수이다. 선도 블록 순서로 계산하는 이유도 설명한다.

</details>
</div>

### 7. 응용: 상관 센서 오차 생성
{: id="7-applied-generate-correlated-sensor-errors"}

두 센서에 평균 0, 공분산 <span class="math-inline" markdown="0">\(\Sigma=\begin{pmatrix}4&1\\1&1\end{pmatrix}\)</span>인 오차가 필요하다. 독립 평균 0·분산 1의 $z_1,z_2$에서 구성하고 분산·공분산·상관을 검증하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

L을 구해 $u=Lz$로 두자. 독립성으로 두 z의 교차항이 없어진다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

<span class="math-inline" markdown="0">\(L=\begin{pmatrix}2&0\\1/2&\sqrt3/2\end{pmatrix}\)</span>이면 $u_1=2z_1$, $u_2=z_1/2+\sqrt3z_2/2$이다. 분산은 4와 $1/4+3/4=1$, 공분산 $2\cdot1/2=1$, 상관 $1/(2\cdot1)=1/2$이다. z가 정규이면 출력도 결합정규이지만 이 공분산 계산에는 주어진 적률·독립성만 필요하다.

</details>
</div>

### 8. 응용: 이차 벌점 최소화
{: id="8-applied-minimize-a-quadratic-penalty"}

최적화 단계가 다음을 최소화한다.

$$
f(x)=\frac12x^TAx-b^Tx,\qquad
A=\begin{bmatrix}2&-1\\-1&2\end{bmatrix},\qquad b=\begin{bmatrix}1\\0\end{bmatrix}.
$$

최소점의 선형계를 유도하고 Cholesky로 풀라. 정지점이 왜 유일 최소점인가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

미분하고 양의 정부호로 곡률을 해석한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$\nabla f=Ax-b$여서 $Ax=b$를 푼다. 여기서는

$$
L=\begin{bmatrix}\sqrt2&0\\-1/\sqrt2&\sqrt{3/2}\end{bmatrix}.
$$

$Ly=b$는 $y_1=1/\sqrt2,y_2=1/\sqrt6$이고 $L^Tx=y$는 $x_2=1/3,x_1=2/3$이다. 정지점에서 0이 아닌 변위 $h$의 목적 변화는 $h^TAh/2>0$이므로 유일 최소점이다.

</details>
</div>

## 더 공부할 자료
{: id="further-learning"}

- [FLAME: Notes on Cholesky Factorization](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html): 전체 증명·알고리즘·연산 수·연습을 공부한다.
- [Higham: What Is a Symmetric Positive Definite Matrix?](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/): 에너지·고윳값·양수 조건을 연결한다.
- [ALAFF: 정규방정식의 정확도 손실](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html): 안정 분해가 신뢰할 최소제곱 계산의 일부인 이유를 익힌다.
- [Stata 다변량 정규 모의실험](https://www.stata.com/support/faqs/statistics/multivariate-normal-observations/): 문제 7을 전체 공분산 생성 예제에 연결한다.

## 관련 문서
{: id="related-pages"}

- [QR 분해]({{ '/wiki/linear-algebra/qr-factorization-ko/' | relative_url }})
- [Gram–Schmidt 직교화]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/' | relative_url }})

- [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})

- [대칭 양의 정부호 행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})

- [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})
- [LU 분해]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. van de Geijn, R. A. (2011). [Notes on Cholesky Factorization](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). University of Texas at Austin. 정의·증명·알고리즘·연산 수.
2. Higham, N. J. (2020년 8월 11일). [What Is a Cholesky Factorization?](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/). 행렬식·안정성·준정부호 확장.
3. Anderson, E., 외 (1999). *LAPACK Users' Guide*, 제3판. SIAM. [Linear Equations](https://www.netlib.org/lapack/lug/node38.html). 실수·복소 분해와 삼각계.
4. LAPACK (2011). [ZPOTRF](https://www.netlib.org/lapack/complex16/zpotrf.f), [DPOTRS](https://www.netlib.org/lapack/double/dpotrs.f), 3.3.1. 복소 Cholesky와 기존 인수 풀이.
5. Cholesky, A.-L. (1910년 12월 2일). *Sur la résolution numérique des systèmes d'équations linéaires*. [Brezinski 2005, §4, 221–229쪽](https://www.numdam.org/item/RHM_2005__11_2_205_0.pdf#page=17)의 원고 재현.
6. Benoît, Commandant (1924). *Note sur une méthode de résolution des équations normales provenant de l'application de la méthode des moindres carrés à un système d'équations linéaires en nombre inférieur à celui des inconnues (Procédé du Commandant Cholesky)*. Bulletin géodésique, 2, 67–77. [DOI](https://doi.org/10.1007/BF03031308). 출판 역사는 Brezinski 2005 참조.
7. Benoît, Commandant. Cholesky의 생애·측지 작업 기록, [R. W. Cottle이 1975년 번역, 1990년 2월 18일 NA Digest 배포](https://netlib.org/na-digest-html/90/v90n07.html#5).
8. Brezinski, C. (2005). [La méthode de Cholesky](https://www.numdam.org/articles/10.24033/rhm.30/). Revue d'histoire des mathématiques, 11(2), 205–238. [전문](https://www.numdam.org/item/RHM_2005__11_2_205_0.pdf). 역사 조사와 원고 재현.
9. Brezinski, C. (2006). [The life and work of André Cholesky](https://doi.org/10.1007/s11075-006-9059-x). Numerical Algorithms, 43, 279–288. [저자 업로드 전문](https://www.researchgate.net/publication/226930424_The_life_and_work_of_Andre_Cholesky).
10. de Falguerolles, A. (2019). [Cholesky and the Cholesky decomposition: a commemoration by an applied statistician](https://www.numdam.org/item/JSFS_2019__160_2_83_0.pdf). Journal de la Société Française de Statistique, 160(2), 83–96. §§5.1–5.2의 적합·보정 구별.
11. van de Geijn, R. A., Myers, M. *Advanced Linear Algebra: Foundations to Frontiers*. [§4.2.5 Why using the Method of Normal Equations could be bad](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html).
12. Anderson, E., 외 (1999). *LAPACK Users' Guide*. [Linear Least Squares Problems](https://www.netlib.org/lapack/lug/node27.html), [Error Bounds for Linear Equation Solving](https://www.netlib.org/lapack/lug/node81.html). 블록 계산은 [프로젝트 설명](https://www.netlib.org/lapack/)도 참조.
13. StataCorp. [Stata 6: Simulating multivariate normal observations](https://www.stata.com/support/faqs/statistics/multivariate-normal-observations/). 공분산 변환으로서 Cholesky.

14. Higham, N. J. (2020년 7월 21일). [What Is a Symmetric Positive Definite Matrix?](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/). 이차형식·양수 조건.
15. OpenStax. [College Algebra 2e §2.5 Quadratic Equations](https://openstax.org/books/college-algebra-2e/pages/2-5-quadratic-equations)의 Completing the Square. 제곱식으로 이차식을 바꾸는 대수 기초.
