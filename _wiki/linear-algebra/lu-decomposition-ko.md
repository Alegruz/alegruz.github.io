---
title: LU 분해
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-lu-decomposition
description: 소거 배수를 하삼각 인수에 보관하고 행 교환과 두 삼각계로 선형계를 풉니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 993a8d917d0c45e0dcab0961ee56d251d71fe084039a2c0e58b081da6cf96e71
interactive_examples: true
---

## 정의
{: id="definition"}

LU 분해는 연립일차방정식의 계수를 두 행렬로 나누어 각 행렬의 방정식을 차례로 풀게 한다. $Ax=b$에서 $x$는 미지수를 담은 벡터(수의 열), $b$는 주어진 우변이며 $A$에는 미지수에 곱하는 계수가 들어 있다. $A\in\mathbb R^{n\times n}$은 행과 열이 각각 $n$개이고 성분이 실수인 정사각행렬을 뜻한다.

**주대각선**은 왼쪽 위에서 오른쪽 아래로 이어진다. **하삼각행렬**은 그 위의 성분이 0이고 **상삼각행렬**은 그 아래의 성분이 0이다. **단위 하삼각행렬**은 대각 성분도 모두 $1$이다. LU 분해는 다음과 같다.

$$
A=LU,\qquad
\underbrace{\begin{bmatrix}2&1\\4&3\end{bmatrix}}_{A}
=\underbrace{\begin{bmatrix}1&0\\2&1\end{bmatrix}}_{L}
\underbrace{\begin{bmatrix}2&1\\0&1\end{bmatrix}}_{U}.
$$

$L$과 $U$의 서로 반대쪽 절반이 0임에 주목하자. 아래에서 이 예제를 유도한다. [LAPACK의 LU 정의](https://www.netlib.org/lapack/lug/node38.html)를 참고하자. [행렬 분해 개요]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})에서는 행렬곱, 전치 $A^T$(행과 열을 교환), 그 밖의 기초 표기법을 설명한다.

### 분해가 존재하는 조건
{: id="when-the-factorization-exists"}

**단위행렬** $I$는 대각 성분이 $1$, 나머지가 $0$이어서 $Ix=x$이다. **역행렬** $A^{-1}$은 $A$의 작용을 되돌리며 $A^{-1}A=AA^{-1}=I$를 만족한다. 역행렬이 있는 정사각행렬은 **비특이**, 없는 것은 **특이**하다고 한다. 예를 들어 대각 성분이 $2,0$인 $\operatorname{diag}(2,0)$은 두 번째 좌표를 잃어버리므로 되돌릴 수 없다. [OpenStax의 역행렬 설명](https://openstax.org/books/college-algebra-2e/pages/7-7-solving-systems-with-inverses)을 참고하자.

**행렬식** $\det A$는 정사각행렬에 대응하는 수이며 행렬이 비특이일 때에만 0이 아니다. $2\times2$ 행렬의 경우

$$
\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc.
$$

이 예제의 행렬식은 $2\cdot3-1\cdot4=2$이므로 비특이이다. [OpenStax의 행렬식 예제](https://openstax.org/books/intermediate-algebra-2e/pages/4-6-solve-systems-of-equations-using-determinants)를 참고하자.

**선도 주부분행렬**은 왼쪽 위의 정사각 블록이다. $A_{1:k,1:k}$는 처음 $k$개 행과 열을 택하며 그 행렬식은 **선도 주소행렬식**이다. 이 예제에서 $1\times1$ 블록의 행렬식은 $2$이고 전체 $2\times2$ 블록의 행렬식도 $2$이다. 둘 다 0이 아니다. 행 교환 없이 소거하려면 각 초기 블록을 통과할 수 있어야 하므로 이 조건이 중요하다.

비특이행렬의 모든 선도 주소행렬식이 0이 아니면 단위 하삼각 LU 분해가 존재하며 유일하다. [ALAFF 정리 5.2.3.4](https://www.cs.utexas.edu/~flame/laff/alaff/chapter05-lu-factorization-def.html)를 참고하자.

$$
\det(A_{1:k,1:k})\ne0,\qquad k=1,2,\ldots,n.
$$

행 교환이 필요하면 $PA=LU$를 사용한다. **순열행렬** $P$는 단위행렬의 행 순서를 바꾼 것으로, 곱하면 같은 행 재배열을 수행한다. 예를 들어

$$
\begin{bmatrix}0&1\\1&0\end{bmatrix}
\begin{bmatrix}a&b\\c&d\end{bmatrix}
=\begin{bmatrix}c&d\\a&b\end{bmatrix}.
$$

행을 교환하는 형태는 [ALAFF의 피벗 LU 알고리즘](https://www.cs.utexas.edu/~flame/laff/alaff/chapter05-lu-piv-right-looking.html)에 설명되어 있다. 아래 응용에서는 $A$가 비특이이고 행 교환 없이 $A=LU$로 분해된다고 가정한다. $PA=LU$를 사용한다면 우변 $b$를 $Pb$로 바꾼다.

## 직관: 소거 과정을 기억하기
{: id="intuition-elimination-with-a-memory"}

**가우스 소거법**은 앞 방정식의 배수를 뒤 방정식에서 빼서 미지수를 없앤다. **피벗**은 그 배수를 정할 때 나누는 계수이며 **승수**는 해당 행을 몇 배 빼는지를 뜻한다. 예를 들어 피벗 $2$ 아래의 $4$를 없애려면 피벗 행의 $4/2=2$배를 뺀다. LU는 마지막 행들과 이 승수들을 모두 보관한다. **$U$는 단순해진 방정식이고 $L$은 원래 행을 복원하는 방법을 기억한다.**

예를 들어

$$
A=\begin{bmatrix}2&1\\4&3\end{bmatrix}.
$$

둘째 행에서 첫째 행의 두 배를 뺀다. 새 둘째 행이 $(0,1)$이므로

$$
U=\begin{bmatrix}2&1\\0&1\end{bmatrix},\qquad
L=\begin{bmatrix}1&0\\2&1\end{bmatrix}.
$$

$L$의 $2$는 뺄셈에 사용한 승수를 기억한다. $L$을 곱하면 뺄셈을 되돌린다. 원래 둘째 행은 $U$의 첫째 행 두 배와 둘째 행의 합이다. 따라서 $LU=A$이다. 소거와 복원은 부호가 반대다. 소거에서는 행의 $2$배를 빼지만 저장하는 승수는 $+2$이다.

### 미지수가 세 개인 예제
{: id="a-three-variable-example"}

다음을 살펴보자.

$$
A=\begin{bmatrix}2&1&1\\4&3&3\\8&7&9\end{bmatrix}.
$$

$R_i$는 $i$번째 행이고 $\leftarrow$는 “다음으로 대체”를 뜻한다. 첫 피벗 $2$로 아래 성분을 없앤다. 승수는 $4/2=2$, $8/2=4$이다.

$$
R_2\leftarrow R_2-2R_1,\qquad R_3\leftarrow R_3-4R_1.
$$

남은 행은 $(0,1,1)$과 $(0,3,5)$이다. 새 셋째 행에서 새 둘째 행의 $3$배를 빼면 $(0,0,2)$가 된다. 따라서

$$
U=\begin{bmatrix}2&1&1\\0&1&1\\0&0&2\end{bmatrix},\qquad
L=\begin{bmatrix}1&0&0\\2&1&0\\4&3&1\end{bmatrix}.
$$

{% include image.html src="/assets/images/wiki/lu-elimination-ko.svg" alt="네 개의 이름 붙은 행렬이 원래의 3행 3열 행렬, 첫 피벗 아래에 생긴 0, 최종 상삼각행렬, 하삼각행렬에 저장한 승수를 보여 준다." caption="U에는 0이 쌓이고, 승수 2, 4, 3은 자신이 없앤 성분의 위치에 해당하는 L의 칸에 저장된다." %}

두 번째 승수는 원래 성분 $7$이 아니라 **갱신된** 셋째 행 성분 $3$으로 계산한다. 그러므로 하삼각 인수에 $l_{32}=3$을 저장한다. 기록이 맞는지 확인하려면 원래 셋째 행을 다음처럼 복원한다.

$$
4(2,1,1)+3(0,1,1)+(0,0,2)=(8,7,9).
$$

### 피벗의 의미와 행 교환이 유용한 이유
{: id="what-a-pivot-means-and-why-row-exchanges-help"}

피벗은 아래 성분들을 없애는 데 사용하는 계수이다. 피벗이 0이면 필요한 나눗셈을 할 수 없다. 그렇다고 전체 행렬이 반드시 특이한 것은 아니다.

$$
A=\begin{bmatrix}0&1\\1&1\end{bmatrix},\qquad \det A=-1.
$$

<span class="math-inline" markdown="0">\(P=\begin{pmatrix}0&1\\1&0\end{pmatrix}\)</span>로 행을 교환하면

$$
PA=\begin{bmatrix}1&1\\0&1\end{bmatrix}=IU.
$$

여기서는 $L=I$이며 소거를 진행할 수 있다. 방정식의 순서를 바꾸어도 $b$도 $Pb$로 재배열하면 해는 보존된다.

0이 아닌 피벗도 수치계산에 쓰기에는 너무 작을 수 있다. <span class="math-inline" markdown="0">\(\begin{pmatrix}\varepsilon&1\\1&1\end{pmatrix}\)</span>의 첫 승수는 $1/\varepsilon$이다. $\varepsilon=10^{-4}$이면 승수는 $10^4$이어서 큰 중간값이 생긴다. 실수의 **크기**는 절댓값이다. $-5$와 $5$의 크기는 모두 $5$이다. **부분 피벗팅**은 현재 열에서 아직 처리하지 않은 부분의 절댓값이 가장 큰 성분을 골라 그 행을 피벗 위치로 옮긴다. 이로써 반올림 없는 계산인 **정확 산술**에서는 소거 승수의 절댓값이 $1$ 이하가 된다. 컴퓨터는 유한한 정밀도로 수를 표현하는 **부동소수점 산술**을 사용한다. 예를 들어 $1/3$을 $0.3333$으로 저장하면 **반올림 오차**가 생긴다. 큰 중간값은 이 오차를 증폭할 수 있다. 부분 피벗팅이 모든 중간 성분을 작게 유지한다고 보장하지는 않는다. [ALAFF의 부분 피벗팅 알고리즘](https://www.cs.utexas.edu/~flame/laff/alaff/chapter05-lu-piv-right-looking.html)을 참고하자.

정의에 있는 선도 주소행렬식 조건은 비특이 $A$의 각 초기 블록이 다음 무피벗 단계를 허용한다는 뜻이다. 이 순서가 막히면 행 피벗팅이 다른 순서를 제공한다.

## 용도
{: id="usages"}

### 1. 연립일차방정식 풀기
{: id="1-solving-linear-systems"}

다음 연립일차방정식을 풀어야 한다고 하자.

$$
Ax = b
$$

$LU$ 분해를 수행하면 다음을 얻는다.

$$
Ax = LUx = b
$$

다음과 같이 놓으면

$$
Ux = y
$$

연립방정식을 다음과 같이 다시 쓸 수 있다.

$$
Ax = LUx = L(Ux) = Ly = b
$$

전진 대입은 $Ly=b$를 첫 행부터 아래로 푼다. 후진 대입은 $Ux=y$를 마지막 행부터 위로 푼다. 앞에서 구한 값을 대입하면 매번 새 방정식에는 미지수가 하나만 남는다.

위의 세 변수 예제에서 $b=(4,10,24)^T$로 놓자. 하삼각 연립방정식은

$$
y_1=4,\qquad y_2=10-2y_1=2,\qquad y_3=24-4y_1-3y_2=2.
$$

이어서 상삼각 연립방정식은

$$
x_3=y_3/2=1,\qquad x_2=y_2-x_3=1,\qquad
x_1=(y_1-x_2-x_3)/2=1.
$$

직접 대입하면 $A(1,1,1)^T=b$임을 확인할 수 있다. *전진*과 *후진*이라는 이름은 임의의 관례가 아니라 의존 관계의 방향에서 나온다.

대부분의 계산은 분해 단계에서 이루어진다. 분해를 얻은 뒤에는 다른 우변마다 두 번의 대입만 필요하다. 이 구분은 손계산과 소프트웨어 모두에 중요하다. [LAPACK의 분해와 풀이 절차](https://www.netlib.org/lapack/lug/node38.html)를 참고하자.

**밀집행렬**은 많은 0의 패턴을 활용하지 않고 전체 배열로 저장하고 처리한다. **플롭(flop)**은 덧셈이나 곱셈 같은 부동소수점 산술 연산 한 번이다. $O(n^2)$는 충분히 큰 $n$에 대해 작업량이 $n^2$의 상수배로 제한됨을 뜻한다. 정확한 연산 횟수보다는 증가율을 나타낸다. 곱셈과 덧셈을 각각 세면 통상적인 밀집 $LU$ 분해의 부동소수점 연산 횟수는 $\frac{2}{3}n^3 + O(n^2)$ 플롭이다. 따라서 $\frac{2}{3}n^3$은 정확한 횟수가 아니라 최고차항이다. 전진·후진 대입의 비용은 우변마다 합쳐서 $O(n^2)$이다. $L,U$를 구한 뒤에는 $A$가 같고 우변만 다른 연립방정식에 재사용할 수 있으므로 분해를 반복할 필요가 없다.

### 2. 행렬식 계산
{: id="2-computing-determinants"}

$$
\det A = \det L\cdot\det U=\prod_{i=1}^n u_{ii},
$$

단위 하삼각행렬 $L$의 행렬식은 $1$이고 삼각행렬의 행렬식은 대각 성분의 곱이기 때문이다. 세 변수 예제에서는 $\det A=2\cdot1\cdot2=4$이다. 피벗팅한 $PA=LU$에서는 순열 부호를 포함하여 $\det A=\det(P)\prod_i u_{ii}$이다. 행을 한 번 교환할 때마다 $-1$이 곱해진다.

### 3. 역행렬 계산
{: id="3-matrix-inversion"}

역행렬 계산은 기본적으로 다음 방정식을 푸는 일이다.

$$
AX = I
$$

$I$의 각 열이 서로 다른 우변을 제공하므로 같은 인수로 $n$개 연립방정식을 모두 푼다. 각 해가 $A^{-1}$의 열이 된다. 목표가 해 $x$ 하나라면 두 삼각 연립방정식 풀이만으로 충분하다. 전체 역행렬을 구하면 그 해를 구하는 데 필요하지 않은 계산이 추가된다.

## 역사
{: id="history"}

### $A = g'h$의 등장
{: id="introduction-of-a--gh"}

$LU$ 분해는 이름에서도 역사가 드러나는 가우스 소거법 등 주요 행렬 연산에 비해 비교적 현대적인 개념이다. 행렬을 두 삼각행렬로 분해하는 방법이 학술지에 처음 등장한 것은 폴란드 크라쿠프 야기엘론스키 대학교의 천문학 교수이자 수학자 타데우시 바나히에비치가 1938년에 발표한 논문이다. 제목은 “[Méthode de résolution numérique des équations linéaires, du calcul des déterminants et des inverses, et de réduction des formes quadratiques]()”이며 “연립일차방정식의 수치해법, 행렬식과 역행렬의 계산, 이차형식의 축약 방법”이라는 뜻이다.

그가 이 방법을 도입한 이유는 수치계산을 단순하게 하고 오류를 줄이기 위해서였다. 특히 천문학과 지구의 모양 및 표면의 위치를 측정하는 **측지학**에서 필요했다. 천문학자들은 궤도 계산, 관측 자료, 그리고 예측값과 측정값의 차이 제곱합을 최소화하는 **최소제곱 추정**에서 나온 연립일차방정식을 자주 풀어야 했다. 아래 정규방정식 절에서 이를 계산해 본다. 당시에는 LLM도, 초고속 계산기 앱도, 카시오 계산기도 없었다. 사용 가능한 도구는 기계식 계산기였다.

바나히에비치는 이 문제에 대응하여 “크라코비안 대수”를 고안했다. 행렬 계산을 열 중심으로 정리하는 것이 핵심이었고, 기계식 계산기로 계산하기에 더 편리했다.

그는 이 대수를 연구하면서 가우스 소거에서 흔히 두 종류의 정보가 생긴다는 점에 주목했다. 소거 후의 행렬과 소거에 사용한 승수이다. 예를 들어

$$
A = \begin{bmatrix}
2 & 1\\
4 & 3
\end{bmatrix}
$$

소거하면 다음을 얻는다.

$$
U = \begin{bmatrix}
2 & 1\\
0 & 1
\end{bmatrix}
$$

첫 행을 $2$배하여 둘째 행에서 뺀 결과이다. 이 정보를 별도의 행렬에 저장할 수 있다.

$$
L = \begin{bmatrix}
1 & 0\\
2 & 1
\end{bmatrix}
$$

그러면 다음을 얻는다.

$$
A = LU
$$

논문의 프랑스어 원문은 다음과 같다.

> § 1. Considérons le système de $n$ équations linéaires à $n$ inconnues
>
> $$
> \begin{aligned}
> A_{11}x_1 + A_{21}x_2 + \ldots + A_{n1}x_n + A_{n+1,1} &= 0 \\
> A_{12}x_1 + A_{22}x_2 + \ldots + A_{n2}x_n + A_{n+1,2} &= 0 \\
> &\vdots \\
> A_{1n}x_1 + A_{2n}x_2 + \ldots + A_{nn}x_n + A_{n+1,n} &= 0
> \end{aligned}
> \qquad (1.1)
> $$
>
> ayant une solution unique.
>
> En posant
>
> $$
> \mathrm{X} = 1\{x_1\ \ x_2\ \ldots\ x_n\ \ 1\} \qquad (1.\mathrm{A})
> $$
>
> $$
> \mathrm{A}' =
> \begin{vmatrix}
> A_{11} & A_{21} & \ldots & A_{n1} & A_{n+1,1} \\
> A_{12} & A_{22} & \ldots & A_{n2} & A_{n+1,2} \\
> \vdots & \vdots & & \vdots & \vdots \\
> A_{1n} & A_{2n} & \ldots & A_{nn} & A_{n+1,n}
> \end{vmatrix}
> \qquad (1.\mathrm{B})
> $$
>
> nous écrirons le système (1.1), comme d'ordinaire,
>
> $$
> \mathrm{X}\cdot 1\mathrm{A}' = 0 \qquad (1.1\text{-bis})
> $$
>
> Supposons maintenant $\mathrm{A}'$ décomposé en un produit de deux cracoviens $\mathrm{g}'$ et $\mathrm{h}$ tels que
>
> $$
> \mathrm{g}' =
> \begin{vmatrix}
> 1 & g_{21} & g_{31} & \ldots & g_{n1} & g_{n+1,1} \\
> 0 & 1 & g_{32} & \ldots & g_{n2} & g_{n+1,2} \\
> 0 & 0 & 1 & \ldots & g_{n3} & g_{n+1,3} \\
> \vdots & \vdots & \vdots & & \vdots & \vdots \\
> 0 & 0 & 0 & \ldots & 1 & g_{n+1,n}
> \end{vmatrix}
> \qquad
> \mathrm{h} =
> \begin{vmatrix}
> h_{11} & h_{21} & h_{31} & \ldots & h_{n1} \\
> 0 & h_{22} & h_{32} & \ldots & h_{n2} \\
> 0 & 0 & h_{33} & \ldots & h_{n3} \\
> \vdots & \vdots & \vdots & & \vdots \\
> 0 & 0 & 0 & \ldots & h_{nn}
> \end{vmatrix}
> \qquad (1.\mathrm{C})
> $$
>
> que nous appellerons facteurs canoniques de $\mathrm{A}'$. On suppose les équations (1.1) disposés de façon que $h_{ii} \neq 0$ ($i = 1, 2, \ldots n$); ceci est toujours possible, car dans le cas contraire le déterminant du système (1.1) serait égal à zéro.
>
> Avec
>
> $$
> \mathrm{A}' = \mathrm{g}'\cdot\mathrm{h} \qquad (1.2)
> $$
>
> l'équation (1.1-bis) donne
>
> $$
> \mathrm{X}\cdot 1(\mathrm{g}'\cdot\mathrm{h}) = \mathrm{X}\cdot(\mathrm{h}\cdot\mathrm{g}') = \mathrm{X}\cdot 1\mathrm{g}'\cdot\mathrm{h} = 0, \qquad (1.1\text{-ter})
> $$
>

영어판에서 LLM으로 옮긴 이 원문의 내용을 한국어로 읽으면 다음과 같다.

> § 1. 미지수가 $n$개인 $n$개의 연립일차방정식을 생각하자.
>
> $$
> \begin{aligned}
> A_{11}x_1 + A_{21}x_2 + \ldots + A_{n1}x_n + A_{n+1,1} &= 0 \\
> A_{12}x_1 + A_{22}x_2 + \ldots + A_{n2}x_n + A_{n+1,2} &= 0 \\
> &\vdots \\
> A_{1n}x_1 + A_{2n}x_2 + \ldots + A_{nn}x_n + A_{n+1,n} &= 0
> \end{aligned}
> \qquad (1.1)
> $$
>
> 해는 유일하다고 하자.
>
> 다음과 같이 놓으면
>
> $$
> \mathrm{X} = 1\{x_1\ \ x_2\ \ldots\ x_n\ \ 1\} \qquad (1.\mathrm{A})
> $$
>
> $$
> \mathrm{A}' =
> \begin{vmatrix}
> A_{11} & A_{21} & \ldots & A_{n1} & A_{n+1,1} \\
> A_{12} & A_{22} & \ldots & A_{n2} & A_{n+1,2} \\
> \vdots & \vdots & & \vdots & \vdots \\
> A_{1n} & A_{2n} & \ldots & A_{nn} & A_{n+1,n}
> \end{vmatrix}
> \qquad (1.\mathrm{B})
> $$
>
> 보통과 같이 연립방정식 (1.1)을 다음처럼 쓴다.
>
> $$
> \mathrm{X}\cdot 1\mathrm{A}' = 0 \qquad (1.1\text{-bis})
> $$
>
> 이제 $\mathrm{A}'$가 다음 조건을 만족하는 두 크라코비안 $\mathrm{g}'$, $\mathrm{h}$의 곱으로 분해된다고 가정하자.
>
> $$
> \mathrm{g}' =
> \begin{vmatrix}
> 1 & g_{21} & g_{31} & \ldots & g_{n1} & g_{n+1,1} \\
> 0 & 1 & g_{32} & \ldots & g_{n2} & g_{n+1,2} \\
> 0 & 0 & 1 & \ldots & g_{n3} & g_{n+1,3} \\
> \vdots & \vdots & \vdots & & \vdots & \vdots \\
> 0 & 0 & 0 & \ldots & 1 & g_{n+1,n}
> \end{vmatrix}
> \qquad
> \mathrm{h} =
> \begin{vmatrix}
> h_{11} & h_{21} & h_{31} & \ldots & h_{n1} \\
> 0 & h_{22} & h_{32} & \ldots & h_{n2} \\
> 0 & 0 & h_{33} & \ldots & h_{n3} \\
> \vdots & \vdots & \vdots & & \vdots \\
> 0 & 0 & 0 & \ldots & h_{nn}
> \end{vmatrix}
> \qquad (1.\mathrm{C})
> $$
>
> 이를 $\mathrm{A}'$의 정준 인수라 부르겠다. 방정식 (1.1)은 $h_{ii} \neq 0$ ($i = 1, 2, \ldots n$)이 되도록 배열되었다고 가정한다. 그렇지 않다면 연립방정식 (1.1)의 행렬식이 0이므로 이러한 배열은 항상 가능하다.
>
> 다음과 같이 놓으면
>
> $$
> \mathrm{A}' = \mathrm{g}'\cdot\mathrm{h} \qquad (1.2)
> $$
>
> 방정식 (1.1-bis)에서 다음을 얻는다.
>
> $$
> \mathrm{X}\cdot 1(\mathrm{g}'\cdot\mathrm{h}) = \mathrm{X}\cdot(\mathrm{h}\cdot\mathrm{g}') = \mathrm{X}\cdot 1\mathrm{g}'\cdot\mathrm{h} = 0, \qquad (1.1\text{-ter})
> $$

#### 원문의 표기 읽기
{: id="reading-the-original-notation"}

위 수식에서 $\mathrm{A}'$, $\mathrm{g}'$는 상수항 열 하나가 추가된 확대 배열이다. 여기서 프라임을 현대적인 전치 기호로 읽으면 안 된다. 바나히에비치는 전치 크라코비안에 접두 기호 $1$을 쓰며 그 배열은 단위행렬로 표시된다. 성분의 첫 첨자는 열, 둘째 첨자는 행을 뜻한다. 예를 들어 $A_{21}$은 첫 행 둘째 열에 있다. 이 관례는 [원 논문 393–394쪽](https://www.oa.uj.edu.pl/pbl/books/T_Banachiewicz_1938_Bull.Acad.Pol.Ser.A.No.10-12_p.393-404.pdf)의 §1, 식 (1.A)–(1.C)에서 확인할 수 있다.

점에도 특별한 뜻이 있다. 보통 행렬곱과 구분하여 크라코비안 곱을 $R \circ S$로 쓰자. $R,S$가 표시된 배열이면

$$
R \circ S = S^T R, \qquad
(R \circ S)_{ij} = \sum_k S_{ki}R_{kj}.
$$

**내적**은 대응하는 좌표끼리 곱해서 더한다. $(1,2)^T\!\cdot(3,4)^T=1\cdot3+2\cdot4=11$이다. 위 출력의 각 성분은 $S$의 한 열과 $R$의 한 열의 내적이므로 두 입력 배열(**피연산자**)은 행 수가 같아야 한다. 따라서

$$
R \circ I = R, \qquad I \circ R = R^T.
$$

원문의 접두 $1$이 배열을 전치하는 이유가 여기 있다. 보통 단위행렬을 왼쪽에서 곱하면 배열은 변하지 않는다. 또한 크라코비안 곱은 괄호를 바꾸면 값이 달라질 수 있다. $(R\circ S)\circ T$와 $R\circ(S\circ T)$는 같지 않을 수 있다. 이를 **비결합성**이라 하며 연속된 곱은 왼쪽에서 오른쪽으로 계산한다. 이 곱셈·전치 규칙은 [Kociński §3, 정의 3.1–3.3 및 3.5](https://arxiv.org/pdf/1509.08740)에도 제시되어 있다.

#### 식을 현대 행렬대수로 옮기기
{: id="translating-the-equations-into-modern-matrix-algebra"}

(1.B)에 표시된 계수행렬을 $C$, 마지막 열을 $c$라 하자. 현대 표기로는

$$
C_{ij} = A_{ji}, \qquad c_i = A_{n+1,i}, \qquad
\mathcal A = [\,C\mid c\,], \qquad
\widehat x = \begin{bmatrix}x\\1\end{bmatrix}.
$$

원문의 $\mathrm X = 1\{x_1\ \cdots\ x_n\ 1\}$은 열벡터 $\widehat x$이다. 따라서 $\mathrm X\cdot 1\mathrm A' = 0$은 다음과 같이 옮겨진다.

$$
\widehat x \circ \mathcal A^T
= \mathcal A\widehat x
= Cx + c = 0.
$$

이는 $c = -b$인 통상적인 연립방정식 $Cx = b$이다. 덧붙인 열에는 현대적인 우변의 음수가 들어 있다.

이제 $\mathrm g'$, $\mathrm h$의 표시 배열을 각각 $\mathcal G = [\,G\mid q\,]$, $H$라 하자. $G$는 단위 상삼각행렬이고 $H$는 대각 성분이 0이 아닌 상삼각행렬이다. 식 (1.2)는 다음과 같이 옮겨진다.

$$
\mathcal A = \mathcal G \circ H = H^T\mathcal G,
\qquad C = H^TG, \qquad c = H^Tq.
$$

$H^T$는 $n\times n$, $\mathcal G$는 $n\times(n+1)$이므로 차원이 맞는다. 계수행렬은 하삼각행렬 $H^T$와 단위 상삼각행렬 $G$의 곱이다.

(1.1-ter)의 조작은 다음 보통 행렬 항등식과 같은 뜻이다.

$$
\mathcal A\widehat x = H^T(\mathcal G\widehat x) = 0.
$$

$H^T$가 가역이므로 $\mathcal G\widehat x = Gx + q = 0$을 얻는다. 이는 원문의 식 (1.3)에 대응한다. 동등하게 $y = -q$로 놓고 전진 대입으로 $H^Ty = b$를 푼 다음 후진 대입으로 $Gx = y$를 푼다.

이 글 앞부분의 단위 하삼각 관례를 얻으려면 다음과 같이 정의한다.

$$
D = \operatorname{diag}(h_{11},\ldots,h_{nn}), \qquad
L = H^TD^{-1}, \qquad U = DG.
$$

그러면 $L$의 대각 성분은 $1$, $U$는 상삼각이고 $LU = H^TG = C$이다. 앞의 예제에서는

$$
H = \begin{bmatrix}2&4\\0&1\end{bmatrix}, \qquad
G = \begin{bmatrix}1&\tfrac12\\0&1\end{bmatrix}, \qquad
D = \begin{bmatrix}2&0\\0&1\end{bmatrix},
$$

정확히 <span class="math-inline" markdown="0">\(L = \begin{bmatrix}1&0\\2&1\end{bmatrix}\)</span>와 <span class="math-inline" markdown="0">\(U = \begin{bmatrix}2&1\\0&1\end{bmatrix}\)</span>를 얻는다. 따라서 바나히에비치의 분해는 곱의 의미를 옮기고 대각 정규화를 정하면 현대의 $LU$가 된다.

여기서 주장하는 이점은 전통적인 소거보다 연산 횟수가 적다는 것이 아니라 다루는 수학적 중간량이 적다는 것이다.

> D'autre part la commodité de la forme cracovienne des équations (2.3) et (2.4) facilite beaucoup les calculs.

이를 옮기면

> 한편 식 (2.3)과 (2.4)의 편리한 크라코비안 형태는 계산을 크게 수월하게 한다.

당시의 주요 문제는 계산 속도보다 계산 중에 생기는 중간량이었다.

### 정규방정식 풀기
{: id="solving-normal-equations"}

이 절에서는 최소제곱 적합을 특징짓는 방정식을 유도한다. [QR 분해]({{ '/wiki/linear-algebra/qr-factorization-ko/#derive-the-least-squares-solve' | relative_url }})는 정규직교 좌표와 삼각 연립방정식 풀이로 같은 적합을 얻으며 $A^TA$를 명시적으로 만들지 않는다. [그람–슈미트]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/' | relative_url }})는 그 좌표를 만드는 방법을 설명한다.

**최소제곱법**은 예측과 측정의 차이 제곱합을 최소화하도록 미지수를 정한다. **정규방정식**은 이 최적 적합을 특징짓는 연립일차방정식이며 원래 방정식에 정확한 해가 있든 근사 적합만 가능하든 적용된다. [LAPACK의 최소제곱 정식화](https://www.netlib.org/lapack/lug/node39.html)를 참고하자.

이후 사용할 **선형독립인 열**이란 어느 열도 나머지 열들에 수를 곱해 더하여 만들 수 없다는 뜻이다. **계수(rank)**는 독립인 열의 최대 개수이다. **완전 열계수**이면 모든 열이 독립이다. 예를 들어 $(1,0)^T$, $(0,1)^T$는 독립이지만 $(1,0)^T$, $(2,0)^T$는 그렇지 않다. 열들의 조합은 모형이 만들 수 있는 모든 예측 $Ax$의 집합인 **열공간**을 이룬다. 아래 일반 유도에 앞서 [개요의 계수 예제]({{ '/wiki/linear-algebra/matrix-decomposition-ko/#terms-for-the-conditions-and-uses' | relative_url }})를 참고하자.

측정 오차가 있는 자료에서 미지량을 추정해야 했던 천문학자, 측량사, 측지학자에게 이는 중요했다.

예를 들어 천문학자가 별의 위치를 추정한다고 하자. $x$ 좌표를 세 번 측정하여 다음을 얻었다.

$$
\begin{aligned}
    x = 2.0\\
    x = 2.2\\
    x = 1.9
\end{aligned}
$$

그러면 별의 위치는 얼마로 정해야 할까? 평균을 내면 될까?

천문학자들은 총 측정 오차의 제곱합을 최소화하는 $x$를 선택했다.

$$
\min_x [(x - 2.0)^2 + (x - 2.2)^2 + (x - 1.9)^2]
$$

대괄호 안의 양은 제안한 $x$가 얼마나 나쁜지 수로 나타내는 **목적함수**이다. 그래프가 위로 열린 포물선인 이차함수이다. **도함수**는 기울기를 나타낸다. 바닥에서는 기울기가 0이다. 예를 들어 $(x-2)^2$의 도함수는 $2(x-2)$이고 $x=2$에서 0이다. 세 오차 제곱에 같은 규칙을 적용하면

$$
2(x - 2.0) + 2(x - 2.2) + 2(x - 1.9) = 0
$$

다음을 얻는다.

$$
\begin{aligned}
    3x &= 6.1 \\
    x &= \frac{6.1}{3} \approx 2.0333
\end{aligned}
$$

오차 제곱합을 미분하면 최소화 문제가 일차방정식이 된다. 미지수가 여러 개라면 연립일차방정식이 된다. 이 때문에 연립일차방정식을 푸는 일이 매우 중요했다.

일반적으로 $A\in\mathbb R^{m\times n}$은 측정 $m$개와 미지수 $n$개를 나타내고, $b\in\mathbb R^m$에는 측정값, $x\in\mathbb R^n$에는 미지수를 담는다. **잔차벡터** $r=b-Ax$는 적합 후 남은 차이를 모은 것이다. **2-노름** $\lVert r\rVert_2$는 보통의 길이이므로 $\lVert r\rVert_2^2=r_1^2+\cdots+r_m^2$이다. 예를 들어 $r=(3,4)^T$의 길이는 $5$, 제곱 길이는 $25$이다. 이 표기가 총 제곱오차를 나타내는 이유는 [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }})을 참고하자.

이 표기로 최소제곱 문제는

$$
\min_x \lVert Ax - b \rVert_2^2.
$$

2-노름의 제곱을 전개하면

$$
\begin{aligned}
F(x) &= (Ax - b)^T(Ax - b) \\
&= x^TA^TAx - 2b^TAx + b^Tb
\end{aligned}
$$

행렬이 전치와 같으면 **대칭**이다. **이차형식**은 좌표 제곱과 좌표 쌍의 곱을 결합한 식이다. 예를 들면 $2x_1^2+2x_1x_2+3x_2^2$이다. $x^TA^TAx$는 대칭행렬 $A^TA$의 [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})이다. 그 도함수는 $2A^TAx$이며 일차항과 상수항에서 나머지 항을 얻는다.

미지수가 여러 개이면 각 좌표에 대한 도함수를 모아 **기울기 벡터(gradient)** $\nabla F$를 만든다. 예를 들어 $F(x_1,x_2)=x_1^2+3x_2^2$의 기울기는 $(2x_1,6x_2)^T$이다. 각 성분은 그 좌표만 바꿀 때의 기울기를 나타낸다. 최소제곱 목적함수에서는

$$
\nabla F(x) = 2A^TAx -2A^Tb
$$

기울기의 모든 성분이 0인 점을 **정지점**이라 한다. 이를 찾으려면 다음을 푼다.

$$
\nabla F(x) = 0
$$

따라서

$$
\begin{aligned}
    2A^TAx - 2A^Tb &= 0\\
    2A^TAx &= 2A^Tb \\
    \therefore A^TAx &= A^Tb
\end{aligned}
$$

이를 정규방정식이라 한다.

일차적인 차이들의 제곱합은 **볼록 이차함수**이다. 미지수 공간의 어떤 직선을 따라가도 그래프는 위로 열린 포물선이거나 상수이다. 따라서 정지점은 전역 최솟값을 준다. 예를 들어 $(x_1+x_2-1)^2$는 $x_1+x_2=1$인 모든 쌍에서 최소이므로 어떤 방향에서는 바닥이 평평할 수 있다. 일반적인 국소·전역 최소 관계의 증명과 유일성과의 구분은 [볼록성]({{ '/wiki/optimization/convexity-ko/' | relative_url }}#why-local-minima-become-global)을 참고하자.

대칭행렬 $H$가 모든 0이 아닌 $z$에 대해 $z^THz>0$이면 **양의 정부호**이다. **양의 준정부호**는 $z^THz\ge0$를 요구하며 0이 아닌 $z$에서도 등호를 허용한다. **SPD**는 대칭 양의 정부호를 뜻한다. 여기서는 $H=A^TA$, $z^THz=\lVert Az\rVert_2^2$이다. 완전 열계수이면 0이 아닌 $z$에서 엄격히 양수이므로 최소화하는 $x$가 유일하다. 열들이 종속이면 어떤 0이 아닌 $z$가 $Az=0$을 만족한다. 이를 최소해에 더하면 $x$는 달라지지만 예측 $Ax$는 그대로다. 이때 $A^TA$는 특이한 양의 준정부호행렬이며 $Ax$는 유일해도 $x$는 유일하지 않다. [정부호와 준정부호행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }}) 및 [LAPACK의 최소제곱 조건](https://www.netlib.org/lapack/lug/node39.html)을 참고하자.

정규방정식이라는 이름의 이유는 식을 재배열하면 드러난다.

$$
A^T(b - Ax) = 0
$$

잔차벡터 $r$를 사용하면

$$
A^Tr = 0
$$

**수직**, 즉 **직교**는 내적이 0이라는 뜻이다. $A^Tr$의 각 성분은 $A$의 한 열과 $r$의 내적이다. 따라서 이 식은 잔차가 모형의 모든 방향에 수직임을 말한다. 더 단순한 상수 적합 예로 측정값 $(1,2,6)^T$에서는 $x=3$, $r=(-2,-1,3)^T$이다. 모형의 열 $(1,1,1)^T$와의 내적은 $-2-1+3=0$이다.

**직교투영**은 허용된 열공간 안에서 $b$에 가장 가까운 벡터이며 여기서는 예측값 $Ax$이다. 남은 차이는 그 공간에 수직인 방향을 향한다. 기하학에서 **법선(normal)**은 수직을 뜻한다. 이것이 *정규방정식(normal equations)*이라는 이름의 유래이다. [MIT의 최소제곱과 투영 설명](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/least-squares-determinants-and-eigenvalues/projections-onto-subspaces/)을 참고하자.

여기서 덴마크 측지학자 헨리 옌센의 1944년 논문 “[An Attempt at a Systematic Classification of Some Methods for the Solution of Normal Equations]()”가 등장한다. 이 논문은 기존 가우스 소거법, 바나히에비치의 크라코비안 방법, 촐레스키 방법의 수학적 관계를 연결하려 했다.

행을 빼는 연산 자체도 행렬로 표현할 수 있다. 두 행 예제에서는

$$
E=\begin{bmatrix}1&0\\-2&1\end{bmatrix},\qquad EA=U.
$$

이러한 행렬을 **소거행렬**이라 한다. 행 연산이 여러 개면 적용 순서대로 $E_1,E_2,\ldots,E_k$라 하자. 행 교환 없는 가우스 소거법은

$$
E_k\cdots E_2E_1A = U
$$

바나히에비치의 방법은

$$
A = g'h
$$

촐레스키의 방법은

$$
A = LL^T
$$

특수한 행렬인 [대칭 양의 정부호행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }}) $A$에 적용된다.

행 교환 없는 가우스 소거 분해에서 $L=(E_k\cdots E_2E_1)^{-1}$은 그 행 연산들을 되돌린다. 이 $L$이 촐레스키 공식의 하삼각 인수와 같을 필요는 없다.

삼각 분해를 사용한 이유는 이 방법들의 긴밀한 관계를 보이기 위해서였다.

다음은 수치방정식 풀이를 다룬 또 다른 1944년 논문 “[A Matrix Presentation of Least Squares and Correlation Theory with Matrix Justification of Improved Methods of Solution]()”이다. 저자는 미국 통계학자이자 미시간 대학교 수학 부교수였던 폴 S. 드와이어이다.

통계학 역시 측정 자료를 다루므로 정규방정식을 자주 풀어야 했다. 드와이어의 질문은 행렬대수에서 정규방정식을 체계적으로 푸는 절차를 찾는 것이었다.

그는 먼저 가우스 소거로 연립일차방정식을 체계적으로 푸는 두리틀 알고리즘을 두 행렬의 곱으로 표현할 수 있음을 보였다.

$$
A = S'T
$$

여기서 $A$는 원래 측정행렬이 아니라 정규방정식의 계수행렬이다. 성분이 측정행렬 열들의 쌍별 내적인 **그람행렬**이다. 예를 들어 열 $(1,0)^T$, $(1,1)^T$의 그람행렬은

$$
\begin{bmatrix}1&1\\1&2\end{bmatrix},
$$

제곱 길이가 각각 $1,2$이고 서로의 내적이 $1$이기 때문이다. 기호 중복을 피하여 측정행렬을 $B$로 쓰면 그람행렬은 $B^TB$이다. [이차형식과 그람행렬]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})을 참고하자. 여기서 $S'$는 하삼각행렬, $T$는 상삼각행렬이다.

그는 이어서 이 분해의 유용한 성질을 보인다.

> **7. 더 일반적인 이론—인수분해를 통한 행렬방정식의 풀이.**
> &hellip;
> 이 전개의 핵심 공식은 $A - S'T = 0$이며 이후 모든 공식이 여기서 나온다. 따라서 $A$를 반드시 삼각일 필요는 없는 임의의 행렬 $S'$, $T$로 분해할 수 있다면 6절의 결과들이 따라온다.
> &hellip;

이 정규방정식 상황에서 계수행렬은 그람행렬 $A = B^TB$이다. $z^TAz = \lVert Bz\rVert_2^2 \geq 0$이므로 항상 대칭 양의 준정부호이다. $B$가 완전 열계수일 때에만 양의 정부호이다. 따라서 비특이 정규방정식에서는 SPD 행렬을 얻지만 그람행렬이라는 형태만으로 양의 정부호가 보장되지는 않는다.

### 수치계산의 등장
{: id="numerical-introduction"}

역사적 논의에 앞서 두 오차 원인을 구별하자. **조건성(conditioning)**은 문제 자체의 민감도이다. 예를 들어 $A=\operatorname{diag}(1,0.001)$이면 $b=(1,0)^T$의 해는 $x=(1,0)^T$이지만 $b$의 둘째 성분만 $0.001$로 바꾸면 해는 $(1,1)^T$이 된다. 작은 입력 변화가 훨씬 큰 출력 변화를 만든다. **조건수**는 이 민감도를 측정한다. 정량화 방법은 [행렬 노름]({{ '/wiki/linear-algebra/matrix-norm-ko/' | relative_url }})을 참고하자.

**수치적 안정성**은 반올림 아래에서 알고리즘이 어떻게 동작하는지를 말한다. **후방오차**는 계산한 답이 정확한 해가 되도록 원래 자료를 얼마나 바꿔야 하는지 묻는다. 안정적인 해법은 작은 후방오차를 목표로 하지만 민감한 문제에서는 답의 오차가 여전히 클 수 있다. [LAPACK의 오차 한계](https://www.netlib.org/lapack/lug/node81.html)에서 이 구분을 다룬다.

1947년에는 “[Numerical Inverting of Matrices of High Order]()”가 발표되었다. 저자는 뉴저지 프린스턴 고등연구소(IAS) 교수였던 헝가리계 미국인 학자 존 폰 노이만과, IAS 전자계산기 프로젝트 부책임자였던 미국 수학자 허먼 하이네 골드스타인이다.

당시 IAS는 ENIAC을 대체하고 능가할 “IAS Machine”을 설계하고 있었다. 수학에서 컴퓨터를 사용하기 시작하면서 컴퓨터로 푸는 연립일차방정식의 수치적 안정성을 보장하는 일이 중요해졌다.

컴퓨터는 유한 정밀도로 수를 저장하므로 많은 실수를 정확히 표현할 수 없고 계산에서 반올림 오차가 생긴다. 1943년 미국 수학자이자 컬럼비아 대학교 교수인 해럴드 호텔링은 “[Some New Methods in Matrix Calculation]()”에서 컴퓨터의 두리틀 방법에 대한 반올림 오차 상한을 유도했다. 그는 “이 상한이 $p$에 따라 빠르게 커진다는 사실은 방정식과 미지수의 수가 많을 때 보통 수준의 소수 자릿수로 두리틀 방법이나 유사한 소거법의 결과에 의존하지 말라는 경고”라고 지적했다. 따라서 컴퓨터가 믿을 만한 연립방정식 해를 낼 정도로 안정적인지 증명하는 일이 중요해졌다.

그들의 목표는 큰 행렬의 역행렬 계산에 대한 엄밀한 오차 추정이었다. 컴퓨터 사용자에게 계산 결과를 신뢰할 수 있음을 보여야 했다.

아래 발췌문에서 **반대각(semi-diagonal)**은 당시 삼각행렬을 가리키는 표현이고 “크기에 따라 배치”는 큰 성분을 피벗으로 쓰도록 배열한다는 뜻이다. 논문 제목의 “높은 차수(high order)”는 행과 열이 많은 행렬을 뜻한다.

발췌문을 한국어로 옮기면 다음과 같다.

> **제4장. 소거법**
>
> **4.1. 통상적인 소거법의 서술.**
> &hellip;
> 소거법은 보통 역행렬 계산보다 방정식을 푸는 방법으로 여겨지지만 실제로 둘은 같다. 비특이행렬 $A = (a_{ij})$ ($i, j = 1, \ldots, n$)와 이에 대응하는 연립방정식이 주어졌다고 하자.
>
> $$
> (4.1) \qquad \sum_{j=1}^{n} a_{ij} x_j = y_i \qquad (i = 1, \ldots, n),
> $$
>
> &hellip;
>
> 미지수 $x_1, \ldots, x_n$의 $n$개 방정식 (4.1)을 소거로 푸는 과정은 익숙한 다음 방식으로 진행된다.
>
> 처음 $k-1$개 미지수 $x_1, \ldots, x_{k-1}$ ($k = 1, \ldots, n-1$)가 이미 소거되었고, 남은 $n-k+1$개 미지수 $x_k, \ldots, x_n$에 대해 $n-k+1$개의 방정식을 얻었다고 하자.
>
> $$
> (4.4) \qquad \sum_{j=k}^{n} a_{ij}^{(k)} x_j = y_i^{(k)} \qquad (i = k, \ldots, n).
> $$
>
> 다음 미지수 $x_k$를 소거하려면 $i$번째 방정식에서 $k$번째 방정식의 $a_{ik}^{(k)}/a_{kk}^{(k)}$배를 뺀다($i = k+1, \ldots, n$). 그러면 새로운 방정식들이 나온다.
>
> $$
> (4.5) \qquad \sum_{j=k+1}^{n} a_{ij}^{(k+1)} x_j = y_i^{(k+1)} \qquad (i = k+1, \ldots, n),
> $$
>
> 여기서
>
> $$
> (4.6) \qquad a_{ij}^{(k+1)} = a_{ij}^{(k)} - a_{ik}^{(k)} a_{kj}^{(k)} / a_{kk}^{(k)} \qquad (i, j = k+1, \ldots, n),
> $$
>
> $$
> (4.7) \qquad y_i^{(k+1)} = y_i^{(k)} - (a_{ik}^{(k)} / a_{kk}^{(k)}) y_k^{(k)} \qquad (i = k+1, \ldots, n).
> $$
>
> (4.4)에서 (4.5)로의 이행은 분명 $k$에서 $k+1$로의 귀납 단계이다. 이 귀납은 원래 방정식 (4.1), 즉 다음에서 시작한다.
>
> $$
> (4.8) \qquad a_{ij}^{(1)} = a_{ij} \qquad (i, j = 1, \ldots, n),
> $$
>
> $$
> (4.9) \qquad y_i^{(1)} = y_i \qquad (i = 1, \ldots, n).
> $$
>
> 이 귀납으로 $k = 1, \ldots, n$에 대해 (4.4)를 차례로 얻는다. 즉
>
> $$
> (4.10) \qquad a_{ij}^{(k)} \qquad (k = 1, \ldots, n;\ i, j = k, \ldots, n),
> $$
>
> $$
> (4.11) \qquad y_i^{(k)} \qquad (k = 1, \ldots, n;\ i = k, \ldots, n).
> $$
>
> $n$개 연립방정식 (4.4)를 모두 유도한 뒤 각 연립방정식의 첫 방정식을 골라 원래 미지수 $x_1, \ldots, x_n$에 대한 새 $n$개 방정식으로 모은다.
>
> $$
> (4.12) \qquad \sum_{j=k}^{n} a_{kj}^{(k)} x_j = y_k^{(k)} \qquad (k = 1, \ldots, n).
> $$
>
> 이제 $k = n, \ldots, 1$에 대한 역방향 귀납으로 푼다.
>
> $$
> (4.13) \qquad x_k = \frac{1}{a_{kk}^{(k)}} y_k^{(k)} - \sum_{j=k+1}^{n} \frac{a_{kj}^{(k)}}{a_{kk}^{(k)}} x_j.
> $$
>
> &hellip;
>
> **4.3. $A$를 반대각 인수 $C$, $B'$로 분해하여 소거법을 서술하기.** 이 장의 나머지에서는 크기에 따른 재배열 없이 §4.1의 절차로 돌아간다.
>
> (4.7)을 $k = 1, \ldots, i-1$에 대해 더하고 (4.9)를 떠올리면
>
> $$
> (4.15) \qquad y_i = y_i^{(i)} + \sum_{k=1}^{i-1} \frac{a_{ik}^{(k)}}{a_{kk}^{(k)}} y_k^{(k)}.
> $$
>
> $\xi = (x_i)$, $\eta = (y_i)$가 주어져 있다. 여기에 $\zeta = (y_i^{(i)})$를 도입하자. 그러면 (4.12), (4.15)는 $\xi$와 $\zeta$, $\eta$와 $\zeta$ 사이의 매우 단순한 두 행렬 관계를 나타낸다. 다음과 같이 정의하면
>
> $$
> B' = (b'_{ij}) \qquad (i, j = 1, \ldots, n)
> $$
>
> $$
> (4.16) \qquad \text{여기서}\quad b'_{ij} = \begin{cases} a_{ij}^{(i)} & \text{조건: } i \leq j \\ 0 & \text{조건: } i > j \end{cases}
> $$
>
> $$
> C = (c_{ij}) \qquad (i, j = 1, \ldots, n)
> $$
>
> $$
> (4.17) \qquad \text{여기서}\quad c_{ij} = \begin{cases} a_{ij}^{(i)} / a_{jj}^{(j)} & \text{조건: } i \geq j \\ \text{[따라서} & \\ 1 & \text{조건: } i = j\text{]} \\ 0 & \text{조건: } i < j \end{cases}
> $$
>
> (4.12), (4.15)는 다음과 같이 된다.
>
> $$
> (4.18) \qquad B'\xi = \zeta,
> $$
>
> $$
> (4.19) \qquad C\zeta = \eta.
> $$
>
> 이는 원래 변수 $x_1, \ldots, x_n$, 즉 $\xi$에 대한 항등식이므로 (4.18), (4.19)를 (4.1')과 비교하면
>
> $$
> (4.20) \qquad A = CB'.
> $$
>
> (4.20)으로부터
>
> $$
> (4.21) \qquad A^{-1} = B'^{-1} C^{-1},
> $$
>
> (4.16), (4.17)은 $B'$, $C$가 각각 상·하 반대각, 즉 <span class="math-inline" markdown="0">\(\mathcal{C}_{+}\)</span>와 <span class="math-inline" markdown="0">\(\mathcal{C}_{-}\)</span>에 속함을 보여 준다. 또한 소거법의 통상적 표현인 (4.7), (4.13)은 (4.15), (4.12), 즉 (4.19), (4.18)을 역으로 푸는 귀납 과정이며, 곧 행렬 $C$, $B'$를 역으로 푸는 과정이다. $C$, $B'$는 반대각이고 (4.7), (4.13)을 다시 보면 이것이 실제로 반대각행렬의 역행렬을 구하는 데 필요한 귀납 과정임을 즉시 알 수 있다. (이에 관해서는 §3.4 끝의 주석과 명시적 식 (4.29), (4.30)도 참고하라.)
>
> 따라서 소거법은 임의의 행렬 $A$의 역행렬 계산을 두 요령의 결합에 기초한 것으로 해석할 수 있다. 첫째, (4.20)에 따라 $A$를 두 반대각행렬 $C$, $B'$의 곱으로 분해한다. 그러면 (4.21)에 따라 $A$의 역행렬을 $C$, $B'$의 역행렬에서 바로 얻는다.$^{27}$ 둘째, $C$, $B'$의 반대각성을 이용하여 단순하고 명시적인 귀납 과정으로 그 역행렬을 만든다.
>
> ---
>
> $^{25}$ 또는 적어도 문제의 최댓값과 같은 자릿수 규모인 것을 택할 수도 있다. 그러나 여기서는 이 조건 완화를 고려하지 않겠다. <span class="math-inline" markdown="0">\(\lvert a_{kk}^{(k)}\rvert\)</span>가 <span class="math-inline" markdown="0">\(\mathrm{Max}_{i,j=k,\ldots,n}\lvert a_{ij}^{(k)}\rvert\)</span>와 정확히 같다고 요구한다.
>
> $^{26}$ 위에서 설명한 크기에 따른 배치는 $k = 1, \ldots, n-1$에서만 일어난다. $k = n$이면 $a_{kk}^{(k)}$가 유일한 $a_{ij}^{(k)}$이므로 주장은 자명하다.

인용한 식 (4.17)은 옮겨 적힌 그대로 두었다. 위 소거 표기에서 $j$단계의 $i$행 승수는 $i>j$에 대해 $a_{ij}^{(j)}/a_{jj}^{(j)}$이고 $c_{ii}=1$, $i<j$이면 $c_{ij}=0$이다. 이는 (4.15)에서 직접 나오므로 인용문 분자의 위첨자 $(i)$를 현대 승수 공식으로 사용하면 안 된다.

이 논문은 보통의 $LU$ 표기를 쓰지는 않지만 $C$를 하삼각, $B'$를 상삼각으로 하는 분해를 명확히 정의한다.

그 목적은 행렬 계산의 수치적 정확도를 분석하는 것이다.

이 대수적 분해는 비특이 정규방정식의 SPD 행렬을 넘어 적용된다. 비특이 정사각행렬 $A$에서 무피벗 소거를 하려면 모든 선도 주소행렬식이 0이 아니어야 한다. 이는 왼쪽 위 $k\times k$ 부분행렬의 행렬식들이다.

$$
\Delta_k = \det (A_{1:k, 1:k})
$$

$\Delta_0=1$로 쓰면 앞의 소거 단계들이 정의되어 있을 때 피벗은 $u_{kk}=\Delta_k/\Delta_{k-1}$를 만족한다. 그러므로 선도 주소행렬식들이 0이 아니면 소거 내내 피벗이 0이 아니다. 비특이 $A$에서 선도 주소행렬식 하나가 0이면 무피벗 $LU$ 분해가 불가능하다. 비특이라는 가정은 중요하다. $\operatorname{diag}(1,0)$ 같은 특이행렬은 행렬식이 0이어도 이미 삼각 인수를 갖는다.

목표는 큰 행렬 계산의 반올림 오차를 추정하는 것이었다. 대수적 분해 자체는 표기만 다른 현대의 $LU$ 분해이지만 오차 분석의 범위는 더 좁다. 소거로 역행렬을 구하는 엄밀한 분석은 [대칭 양의 정부호행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})을 다룬다. 임의의 비특이행렬 소거에 대한 무조건적인 안정성 보장은 아니다.

### $L$, $U$ 표기
{: id="the-l-and-u-notation"}

$L$, $U$라는 표기가 처음 등장하는 것은 앨런 튜링의 1948년 논문 “[Rounding-off Errors in Matrix Processes]()”이다.

튜링은 $A = LU$를 명시적으로 쓰지 않았다. 대신 $L$이 하삼각, $D$가 대각 성분, $U$가 상삼각인 $A = LDU$ 표기를 썼다.

**주소행렬식**은 같은 첨자 집합의 행과 열을 선택한다. *선도* 주소행렬식은 처음 첨자 $1,\ldots,k$를 쓴다. 예를 들어 첨자 $2$만 택하면 주소행렬식 $a_{22}$를 얻는데 이는 선도 $1\times1$ 소행렬식 $a_{11}$과 다르다. 아래에서 튜링의 “첫” 주소행렬식은 초기 첨자의 것을 뜻한다.

그의 *삼각 분해 정리*는 다음과 같다.

> **삼각 분해 정리**
> 행렬 $A$의 주소행렬식들이 비특이이면 $A = LDU$를 만족하는 단위 하삼각행렬 $L$, 대각 성분이 0이 아닌 대각행렬 $D$, 단위 상삼각행렬 $U$가 각각 유일하게 존재한다. 마찬가지로 $A = U'D'L'$를 만족하는 $L'$, $D'$, $U'$가 유일하게 존재한다.

이 논문에서 튜링은 일반 행렬의 소거 및 관련 분해에서 반올림 오차를 연구하여 SPD를 넘어 논의를 확장한다. 얻은 한계는 계산 중 생기는 양에 의존한다. 분해 정리만으로 안정성이 보장되지는 않는다.

이 분해의 안정성을 논의하며 그는 *조건수*를 도입한다. 발췌문의 $N(A)$, $M(A)$는 그가 사용한 행렬 크기 척도이고 표시된 $N$·$M$ 조건수에는 당시 관례가 반영되어 있다. [행렬 노름 문서]({{ '/wiki/linear-algebra/matrix-norm-ko/' | relative_url }})는 현대적인 행렬 크기 측정과 역행렬 크기의 결합을 설명한다.

> **8. 악조건 행렬과 방정식**
>
> &hellip;
>
> 다음 방정식들을 생각하자.
>
> $$
> \left.
> \begin{aligned}
> 1\cdot4x + 0\cdot9y &= 2\cdot7 \\
> -0\cdot8x + 1\cdot7y &= -1\cdot2
> \end{aligned}
> \right\}
> \qquad (8.1)
> $$
>
> 첫 방정식의 100분의 1을 둘째에 더한 새 방정식으로 첫 방정식을 대체하여 다음 연립방정식을 만든다.
>
> $$
> \left.
> \begin{aligned}
> -0\cdot786x + 1\cdot709y &= -1\cdot173 \\
> -0\cdot800x + 1\cdot700y &= -1\cdot200
> \end{aligned}
> \right\}
> \qquad (8.2)
> $$
>
> (8.2)는 (8.1)과 완전히 동등하지만 반올림 오차가 있는 수치해법으로 (8.2)를 풀면 (8.1)을 사용할 때보다 정확도가 훨씬 낮아질 가능성이 크다. (8.2)는 *악조건* 연립방정식, 적어도 (8.1)에 비해 악조건인 연립방정식이라 해야 한다. 계수의 작은 백분율 오차가 해의 큰 백분율 오차를 일으킬 수 있다는 것이 악조건 방정식의 특징이다. $A\mathbf{x} = \mathbf{b}$를 풀어야 하는데 $A$ 대신 작은 행렬 $S$에 대해 $A - S$의 계수를 사용한다면 $S$의 일차항까지 구한 해는 $\mathbf{x}_0 + A^{-1}S\mathbf{x}_0$이다. 여기서 $\mathbf{x}_0$는 정확한 해이다. 무작위 행렬 $S$의 집단과 해·행렬의 계수에 대해 효과를 평균하면 다음을 얻는다.
>
> $$
> \frac{\text{해 계수의 RMS 오차}}{\text{해 계수의 RMS 값}} = \frac{1}{n}\, N(A)N(A^{-1})\, \frac{\text{다음 계수의 RMS 오차: } A}{\text{다음 계수의 RMS 값: } A}.
> $$
>
> 이 식은 $N(A)N(A^{-1})$ 또는 $\frac{1}{n} N(A)N(A^{-1})$를 행렬의 악조건 정도 척도로 삼을 수 있음을 시사한다. 후자를 채택하여 $\frac{1}{n} N(A)N(A^{-1})$를 $A$의 *$N$ 조건수*라 부르겠다.
>
> 다른 악조건 척도로 $n M(A) M(A^{-1})$도 사용하며 이를 $A$의 *$M$ 조건수*라 부르겠다. 두 척도는 대체로 일치하지만 특히 대각 또는 거의 대각인 행렬에서는 $M$ 수가 더 큰 경향이 있다.
>
> &hellip;

튜링은 계수의 섭동에 대한 연립방정식 해의 민감도를 조건수로 표현한다. 논문은 소거를 포함한 행렬 알고리즘의 반올림 오차 한계도 유도하므로 조건성의 도입만을 다루는 것은 아니다.

이후 국립물리연구소(NPL)의 수학자 제임스 하디 윌킨슨의 1961년 논문 “[Error Analysis of Direct Methods of Matrix Inversion](https://doi.org/10.1145/321075.321076)”은 성분 성장과 피벗 선택의 역할을 명시하는 오차 한계를 전개한다. 성분 성장은 원래 행렬의 성분에 비해 중간 성분이 얼마나 커지는지 측정한다. 큰 성장은 반올림 오차를 증폭할 수 있다. 윌킨슨의 분석은 계산 결과를 자료가 조금 섭동된 정확한 계산에 연결하며, 이를 후방오차 분석이라 한다.

여기에는 두 질문이 있다. **조건성**은 입력이 조금 바뀔 때 해가 얼마나 변할 수 있는가라는 수학 문제의 성질이다. **수치적 안정성**은 계산한 해를 가까운 문제의 정확한 해로 해석할 수 있는가라는 알고리즘의 성질이다. 악조건 연립방정식에서는 후방오차가 작아도 해의 오차가 클 수 있다.

따라서 $A=LU$의 존재만으로 수치적 안정성이 보장되지 않는다. 모든 선도 주소행렬식이 0이 아니어도 행 교환 없는 소거에서는 중간 성분이 원래 성분보다 훨씬 커지는 **성분 성장**이 일어날 수 있다. 피벗팅은 성장을 제어하지만 오차 보장은 전략과 실제 성장량에 의존한다. 이 역사는 모든 $LU$ 계산이 무조건 안정적이라는 증명보다 명시한 조건 아래에서 오차 분석이 점점 정교해진 과정으로 이해해야 한다.

## 대화형 예제: 소거 따라가기
{: id="interactive-example-follow-an-elimination"}

설정을 고르거나 2행 2열 행렬과 우변을 입력하자. 각 단계를 넘기기 전에 승수를 예상해 보자. 영 피벗 설정에서 먼저 피벗팅을 끄고, 다음에 켜서 시도하자. 이어 작은 피벗 설정의 승수를 비교하자. 이 실험은 [ALAFF](https://www.cs.utexas.edu/~flame/laff/alaff/chapter05-lu-piv-right-looking.html)의 행 피벗팅과 삼각 풀이 단계를 구현한다.

{% include wiki-lab-ko.html kind="lu" title="두 변수 LU 풀이를 단계별로 따라가기" %}

## 연습문제
{: id="practice-problems"}

힌트나 풀이를 열기 전에 각 문제를 풀어 보자. 처음 두 문제는 손계산, 다음 둘은 해석과 방법 선택, 그다음 둘은 논리적 추론, 마지막 둘은 실제 응용을 연습한다. 직접 만든 연습문제이며 참고문헌은 사용한 수학 개념을 뒷받침한다.

### 1. 손계산: 분해하고 풀기
{: id="1-hand-calculation-factor-and-solve"}

다음 $Ax=b$의 단위 하삼각 LU 인수를 구하고 해를 구하라.

$$
A=\begin{bmatrix}3&1\\6&3\end{bmatrix},\qquad b=\begin{bmatrix}4\\9\end{bmatrix}.
$$

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

첫 승수는 6/3이다. 이를 행렬의 행과 우변 모두에 적용하라.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

승수는 $2$이다.

$$
L=\begin{bmatrix}1&0\\2&1\end{bmatrix},\qquad U=\begin{bmatrix}3&1\\0&1\end{bmatrix}.
$$

$Ly=b$에서 $y=(4,1)^T$를 얻는다. $Ux=y$에서 $x_2=1$, $x_1=1$이다. $A(1,1)^T=(4,9)^T$인지 확인하라.

</details>
</div>

### 2. 손계산: 갱신된 승수 기록하기
{: id="2-hand-calculation-keep-the-updated-multipliers"}

아래 행렬을 분해하고 $b=(3,8,7)^T$에 대해 푼 뒤 $U$에서 행렬식을 구하라.

$$
A=\begin{bmatrix}1&2&0\\2&5&1\\1&3&3\end{bmatrix}.
$$

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

첫 열을 소거한 뒤 셋째 행에서 갱신된 둘째 열 성분을 사용하라.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

첫 열의 승수는 $2$, $1$이다. 갱신된 아래 행은 $(0,1,1)$, $(0,1,3)$이므로 다음 승수는 $1$이다.

$$
L=\begin{bmatrix}1&0&0\\2&1&0\\1&1&1\end{bmatrix},\qquad U=\begin{bmatrix}1&2&0\\0&1&1\\0&0&2\end{bmatrix}.
$$

전진 대입으로 $y=(3,2,2)^T$, 후진 대입으로 $x=(1,1,1)^T$를 얻는다. 행렬식은 $1\cdot1\cdot2=2$이다.

</details>
</div>

### 3. 사고: 영 피벗과 특이성은 다르다
{: id="3-thinking-a-zero-pivot-is-not-the-same-as-singularity"}

다음에서

$$
A=\begin{bmatrix}0&2\\1&3\end{bmatrix},\qquad b=\begin{bmatrix}4\\7\end{bmatrix},
$$

무피벗 소거가 멈추는 이유를 설명하고 $P,L,U$를 찾아 연립방정식을 풀어라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

방정식과 그에 대응하는 우변 성분을 함께 교환하라.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

첫 피벗은 0이지만 $\det A=-2\ne0$이다. 다음을 사용하라.

$$
P=\begin{bmatrix}0&1\\1&0\end{bmatrix},\quad L=I,\quad U=\begin{bmatrix}1&3\\0&2\end{bmatrix}.
$$

$Pb=(7,4)^T$이므로 $x_2=2$, $x_1=1$이다. $A$만 교환한 뒤 원래 $b$를 사용하면 다른 연립방정식을 풀게 된다.

</details>
</div>

### 4. 사고: 두 피벗 선택 비교하기
{: id="4-thinking-compare-two-pivot-choices"}

$0<\varepsilon<1$인 <span class="math-inline" markdown="0">\(A=\begin{pmatrix}\varepsilon&1\\1&1\end{pmatrix}\)</span>에서 부분 피벗팅을 쓸 때와 쓰지 않을 때 첫 승수를 구하라. 피벗팅한 승수가 더 바람직한 이유는 무엇인가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

가능한 두 첫 피벗 ε과 1을 비교하라.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

피벗팅하지 않으면 $m=1/\varepsilon$이다. 행 교환 후에는 $m=\varepsilon$, 둘째 피벗은 $1-\varepsilon$이다. 피벗팅한 승수는 $\varepsilon$가 작을 때 행을 매우 큰 수로 확대하는 것을 피한다. 이는 반올림 오차 증폭의 한 원인을 줄이지만 $\varepsilon$가 $1$에 가까워질 때의 본질적인 악조건을 고치지는 않는다.

</details>
</div>

### 5. 논리: 정규화한 LU의 유일성 증명
{: id="5-logic-prove-normalized-lu-uniqueness"}

비특이 $A$에 대해 $A=LU=\widetilde L\widetilde U$이고 두 하삼각 인수가 단위 하삼각, 두 상삼각 인수가 상삼각이라고 하자. 인수들이 같음을 증명하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

하삼각이면서 상삼각인 행렬은 대각행렬이어야 한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

모든 인수는 가역이다. 재배열하면

$$
\widetilde L^{-1}L=\widetilde U U^{-1}.
$$

왼쪽은 단위 하삼각, 오른쪽은 상삼각이다. 따라서 공통값은 대각 성분이 모두 $1$인 대각행렬, 즉 $I$이다. 그러므로 $L=\widetilde L$, $U=\widetilde U$이다.

</details>
</div>

### 6. 논리: 특이행렬에 대한 주장 검토
{: id="6-logic-test-a-claim-about-singular-matrices"}

누군가 “$\det A=0$이면 LU 분해는 존재하지 않는다”라고 말한다. 반례를 들고 특이성이 실제로 어떤 결론을 막는지 설명하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

대각행렬은 이미 삼각행렬이다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$A=\operatorname{diag}(1,0)$, $L=I$, $U=A$로 놓자. $\det A=0$이어도 $A=LU$이다. 특이성은 모든 우변에 대한 유일한 해를 보장하지 못하게 한다. 삼각 인수를 배제하지는 않는다. 정의 근처의 존재·유일성 조건은 명시적으로 비특이행렬에 관한 것이다.

</details>
</div>

### 7. 응용: 분해 재사용
{: id="7-applied-reuse-a-factorization"}

어떤 시뮬레이션에서 <span class="math-inline" markdown="0">\(A=\begin{pmatrix}2&1\\4&3\end{pmatrix}\)</span>인 연립방정식을 반복하여 푼다. 분해 한 번으로 $b^{(1)}=(3,7)^T$, $b^{(2)}=(1,1)^T$의 해를 구하라. 어떤 계산을 공유할 수 있는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

<span class="math-inline" markdown="0">\(L=\begin{pmatrix}1&0\\2&1\end{pmatrix}\)</span>와 <span class="math-inline" markdown="0">\(U=\begin{pmatrix}2&1\\0&1\end{pmatrix}\)</span>를 사용하라.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

첫 우변에서는 $y^{(1)}=(3,1)^T$, $x^{(1)}=(1,1)^T$이다. 둘째에서는 $y^{(2)}=(1,-1)^T$, $x^{(2)}=(1,-1)^T$이다. $L,U$ 계산은 공유하지만 새 $b$마다 두 삼각 풀이를 따로 수행해야 한다. $A$가 바뀌면 보통 기존 인수를 그대로 재사용할 수 없다.

</details>
</div>

### 8. 응용: 해법 검사 해석하기
{: id="8-applied-interpret-a-solver-check"}

<span class="math-inline" markdown="0">\(A=\begin{pmatrix}2&1\\4&3\end{pmatrix}\)</span>, $b=(3,7)^T$, 계산한 $\widehat x=(1.01,0.99)^T$에서 $r=b-A\widehat x$를 구하라. 잔차가 작으면 해의 오차도 항상 작은가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

먼저 원래 방정식을 검사하라. 이어 대각 성분이 매우 작은 행렬을 생각하라.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$A\widehat x=(3.01,7.01)^T$이므로 $r=(-0.01,-0.01)^T$이다. 잔차는 방정식의 불일치를 측정하며 $x$의 오차를 직접 나타내지는 않는다. $A=\operatorname{diag}(1,\varepsilon)$, $b=(1,\varepsilon)^T$, $\widehat x=(1,0)^T$이면 잔차는 $(0,\varepsilon)^T$로 $\varepsilon\to0$에 따라 얼마든지 작아진다. 하지만 정확한 해 $x=(1,1)^T$와의 오차 노름은 $1$이다. 조건성도 고려해야 한다. [LAPACK의 오차 설명](https://www.netlib.org/lapack/lug/node81.html)을 참고하라.

</details>
</div>

## 더 공부할 자료
{: id="further-learning"}

- [ALAFF: LU with partial pivoting](https://www.cs.utexas.edu/~flame/laff/alaff/chapter05-lu-piv-right-looking.html): 두 변수 실험에서 일반 알고리즘과 저장 구조로 나아간다.
- [LAPACK: linear equations](https://www.netlib.org/lapack/lug/node38.html): 소프트웨어가 분해, 풀이, 조건 추정을 나누는 방법을 배운다.
- [LAPACK: backward error and conditioning](https://www.netlib.org/lapack/lug/node81.html): 연습문제 8에서 본 방정식 만족과 정확한 해 복원의 차이를 더 공부한다.

## 관련 문서
{: id="related-pages"}

- [QR 분해]({{ '/wiki/linear-algebra/qr-factorization-ko/' | relative_url }})
- [그람–슈미트 직교화]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/' | relative_url }})

- [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})

- [대칭 양의 정부호행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})

- [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})
- [촐레스키 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. Banachiewicz, T. (1938). Méthode de résolution numérique des équations linéaires, du calcul des déterminants et des inverses, et de réduction des formes quadratiques. Bulletin International de l'Académie Polonaise des Sciences et des Lettres. Classe des Sciences Mathématiques et Naturelles. Série A: Sciences Mathématiques, 393–401.
2. Jensen, H. (1944). An attempt at a systematic classification of some methods for the solution of normal equations (Meddelelse No. 18). Geodætisk Institut.
3. Dwyer, Paul S. “A Matrix Presentation of Least Squares and Correlation Theory with Matrix Justification of Improved Methods of Solution.” The Annals of Mathematical Statistics, vol. 15, no. 1, 1944, pp. 82–89. JSTOR, http://www.jstor.org/stable/2236214. 2026년 10월 10일 열람.
4. John von Neumann and Herman H. Goldstine, Bulletin of the American Mathematical Society, 53 (1947), pp. 1021–1099.
5. Harold Hotelling "Some New Methods in Matrix Calculation," The Annals of Mathematical Statistics, Ann. Math. Statist. 14(1), 1-34, (March, 1943)
6. A. M. TURING, ROUNDING-OFF ERRORS IN MATRIX PROCESSES, The Quarterly Journal of Mechanics and Applied Mathematics, Volume 1, Issue 1, 1948, Pages 287–308, https://doi.org/10.1093/qjmam/1.1.287
7. J. H. Wilkinson. 1961. Error Analysis of Direct Methods of Matrix Inversion. J. ACM 8, 3 (July 1961), 281–330. https://doi.org/10.1145/321075.321076

8. van de Geijn, R. A., and Myers, M. *Advanced Linear Algebra: Foundations to Frontiers*. [Existence of the LU factorization](https://www.cs.utexas.edu/~flame/laff/alaff/chapter05-lu-factorization-def.html) 및 [LU factorization with partial pivoting](https://www.cs.utexas.edu/~flame/laff/alaff/chapter05-lu-piv-right-looking.html).
9. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [Linear Equations](https://www.netlib.org/lapack/lug/node38.html). 삼각 연립방정식 풀이와 분해 재사용.

10. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [Further Details: Error Bounds for Linear Equation Solving](https://www.netlib.org/lapack/lug/node81.html). 잔차, 후방오차, 조건성.

11. OpenStax. *College Algebra 2e*. [Solving Systems with Inverses](https://openstax.org/books/college-algebra-2e/pages/7-7-solving-systems-with-inverses). 단위행렬, 역행렬, 비특이성.
12. OpenStax. *Intermediate Algebra 2e*. [Solve Systems of Equations Using Determinants](https://openstax.org/books/intermediate-algebra-2e/pages/4-6-solve-systems-of-equations-using-determinants). 2행 2열 행렬식 계산.
13. Strang, G. (2011). MIT OpenCourseWare, *18.06SC*. [Projections onto Subspaces](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/least-squares-determinants-and-eigenvalues/projections-onto-subspaces/). 직교투영과 최소제곱법.
