---
title: Schur 보완행렬
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-schur-complement
description: 블록 변수를 제거한 뒤 남는 계수와 오른쪽 항을 유도하고 에너지의 의미를 익힙니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 8bd096d61e9eb32a6dacf71168e64cc85ed3b3e16a0cc9d72da0ef4d49d2abec
---

## 정의
{: id="definition"}

정사각행렬을 다음처럼 블록으로 나누자.

$$
M=\begin{bmatrix}A&B\\C&D\end{bmatrix},\qquad
A\in\mathbb R^{p\times p},\quad B\in\mathbb R^{p\times q},\quad
C\in\mathbb R^{q\times p},\quad D\in\mathbb R^{q\times q}.
$$

$A$가 가역이면 **$M$에서 $A$의 Schur 보완행렬(Schur complement)**은 다음 $q\times q$ 행렬이다.

$$
S=D-CA^{-1}B.
$$

대신 $D$가 가역이면 그 보완행렬은 $A-BD^{-1}C$이다. 어느 블록을 제거하는지 항상 명시하자. 두 보완행렬은 일반적으로 크기와 값이 다르다. 정의와 블록 소거 공식은 [Gallier, §1](https://www.cis.upenn.edu/~jean/schur-comp.pdf#page=1)을 참고하자.

보완행렬은 **한 변수군을 먼저 풀어 제거하면 다른 변수군에는 어떤 방정식이 남는가?**에 답한다. [LU 분해]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})의 Gauss 소거에서 생기는 나머지를 블록으로 확장한 것이다. 대칭 양의 정부호 행렬에서는 [Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})의 양의 나머지도 설명한다.

## 직관: 의존성은 제거하고 그 영향은 보존하기
{: id="intuition-remove-a-dependency-keep-its-effect"}

두 미지수군 $x\in\mathbb R^p$, $y\in\mathbb R^q$가 다음을 만족한다고 하자.

$$
Ax+By=u,\qquad Cx+Dy=v.
$$

첫 식에서 $x=A^{-1}(u-By)$를 얻는다. 이를 둘째 식에 대입하면

$$
C A^{-1}u-C A^{-1}By+Dy=v,
$$

이므로 축소한 시스템은 다음과 같다.

$$
Sy=v-CA^{-1}u.
$$

$CA^{-1}B$를 오른쪽부터 읽자. $B$는 $y$를 첫 방정식에 결합하고, $A^{-1}$은 $x$의 반응을 정하며, $C$는 그 반응을 둘째 방정식에 전달한다. 이 되먹임을 빼면 $y$의 유효 계수가 남는다. 오른쪽 항도 바꿔야 한다. 이 유도는 [Gallier, §1](https://www.cis.upenn.edu/~jean/schur-comp.pdf#page=1)의 소거를 따른다.

| 단계 | 방정식 | 역할 |
| --- | --- | --- |
| 결합된 문제 | $Ax+By=u$, $Cx+Dy=v$ | 두 변수군이 서로 의존한다 |
| $x$ 제거 | $x=A^{-1}(u-By)$ | 첫 변수군을 둘째 변수군으로 표현한다 |
| 축소 문제 | $(D-CA^{-1}B)y=v-CA^{-1}u$ | 남겨 둔 변수군만 푼다 |
| $x$ 복원 | $Ax=u-By$ | 제거한 변수를 복원한다 |

표를 위에서 아래로 읽으면 풀이 순서가 된다. 변수 소거는 그 영향을 보존한다. 첫 블록 행과 열을 단순히 삭제하면 잘못된 식 $Dy=v$가 남는다.

## 계산 예제: 풀고 복원하기
{: id="worked-example-solve-and-recover"}

이 예제와 다음 예제는 직접 구성한 계산이다. 다음을 보자.

$$
\begin{bmatrix}4&2\\2&3\end{bmatrix}
\begin{bmatrix}x\\y\end{bmatrix}
=\begin{bmatrix}6\\5\end{bmatrix}.
$$

여기서 $A=4$, $B=C=2$, $D=3$이다.

1. 첫 식을 기호적으로 풀면 $x=(6-2y)/4$이다.
2. 보완행렬은 $S=3-2(1/4)2=2$이다.
3. 축소한 오른쪽 항은 $5-2(1/4)6=2$이다.
4. $2y=2$를 풀면 $y=1$이다.
5. $x=(6-2)/4=1$로 복원한다.

대입하면 원래 두 식 $4+2=6$, $2+3=5$가 모두 확인된다. 오른쪽 항을 바꾸지 않았다면 잘못된 결과 $y=5/2$를 얻었을 것이다.

### 보완행렬 자체가 행렬일 수도 있다
{: id="a-complement-can-itself-be-a-matrix"}

첫 블록은 스칼라이고 남겨 둔 블록은 2차원인 경우를 보자.

$$
M=\begin{bmatrix}2&2&0\\2&5&1\\0&1&3\end{bmatrix},\qquad
A=2,\quad B=\begin{bmatrix}2&0\end{bmatrix},\quad C=B^T.
$$

결합에 대한 보정과 축소 행렬은 다음과 같다.

$$
CA^{-1}B=\begin{bmatrix}2&0\\0&0\end{bmatrix},\qquad
S=\begin{bmatrix}5&1\\1&3\end{bmatrix}
-\begin{bmatrix}2&0\\0&0\end{bmatrix}
=\begin{bmatrix}3&1\\1&3\end{bmatrix}.
$$

셋째 변수는 제거한 첫 변수와 직접 결합하지 않으므로 대각 원소가 그대로이다. 남긴 변수들은 비대각 원소 1을 통해 여전히 결합한다.

## 이차 에너지와 양의 정부호성
{: id="quadratic-energy-and-positive-definiteness"}

아래 에너지는 합친 벡터 $(x,y)^T$의 [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})이다. 이제 $M$이 실수 대칭행렬이어서 $C=B^T$이고 $A$는 양의 정부호라고 하자. 완전제곱을 만들면

$$
\begin{bmatrix}x\\y\end{bmatrix}^T
M\begin{bmatrix}x\\y\end{bmatrix}
=(x+A^{-1}By)^T A(x+A^{-1}By)+y^TSy.
$$

고정한 $y$에서 첫 항은 $x=-A^{-1}By$일 때 최소가 된다. 남은 에너지는 정확히 $y^TSy$이다. 따라서 $S$는 제거한 변수들이 최대한 자유롭게 조정된 뒤의 에너지를 나타낸다. 위 공식을 직접 전개하면 이 완전제곱을 확인할 수 있다.

따라서 $A$가 양의 정부호인 대칭행렬 $M$에 대해

$$
M\text{는 양의 정부호}\quad\Longleftrightarrow\quad
S\text{는 양의 정부호}.
$$

$A$를 양의 정부호로 유지하면 양의 준정부호성에도 같은 동치가 성립한다. [Gallier, 명제 2.2](https://www.cis.upenn.edu/~jean/schur-comp.pdf#page=4)를 참고하자. $A$의 가정이 중요하다. 첫 블록의 음의 에너지 방향은 양의 보완행렬로 고칠 수 없다.

두 변수 예제에서는

$$
4x^2+4xy+3y^2=4(x+y/2)^2+2y^2.
$$

$y=1$을 고정하면 에너지는 다음처럼 나뉜다.

| $x$ | 첫 블록 에너지 $4(x+1/2)^2$ | 남은 에너지 $2$ | 합계 |
| --- | --- | --- | --- |
| $-3/2$ | $4$ | $2$ | $6$ |
| $-1$ | $1$ | $2$ | $3$ |
| $-1/2$ | $0$ | $2$ | $2$ |
| $0$ | $1$ | $2$ | $3$ |
| $1/2$ | $4$ | $2$ | $6$ |

표는 $x=-1/2$에서 최솟값 2인 포물선을 따른다. 보완행렬은 최소 에너지의 계수이며 원래 $y^2$의 계수 3과는 다르다.

<span class="math-inline" markdown="0">\(M=\begin{bmatrix}\alpha&c^T\\c&D\end{bmatrix}\)</span>이면 보완행렬은 $D-cc^T/\alpha$이다. 이는 [Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})에서 첫 열을 만든 다음 분해하는 작은 행렬과 정확히 같다.

## 블록 분해와 행렬식
{: id="block-factorization-and-determinants"}

블록을 직접 곱하면 다음을 확인할 수 있다.

$$
M=
\begin{bmatrix}I&0\\CA^{-1}&I\end{bmatrix}
\begin{bmatrix}A&B\\0&S\end{bmatrix}.
$$

이는 블록 [행렬 인수분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})이다. 첫 인수의 행렬식은 1이고 둘째는 블록 삼각행렬이므로

$$
\det M=\det A\,\det S.
$$

$A$가 가역이므로 $M$은 정확히 $S$가 가역일 때 가역이다. 이 항등식들은 [Boyd와 Vandenberghe, 부록 A.5.5](https://stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf)에서도 얻을 수 있다. 스칼라 예제에서는 $\det M=4\cdot2=8$로, $4\cdot3-2\cdot2=8$과 일치한다.

## 실제 계산 방법
{: id="computing-it-in-practice"}

$A^{-1}B$는 수학적 연산을 나타낸다. 수치 구현에서는 $AZ=B$를 풀고 $S=D-CZ$를 만들 수 있다. 마찬가지로 $Aw=u$를 풀면 축소한 오른쪽 항은 $v-Cw$이다. 이 풀이들과 복원 과정에 $A$의 인수분해를 재사용하자. 블록 소거의 계산 순서는 [Boyd와 Vandenberghe, §C.4](https://stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf)를 참고하자.

모델이 내부 변수와 관심 변수를 자연스럽게 나눌 때 유용하다. 에너지 관점에서는 내부 변수가 먼저 이완하고 $S$가 남은 강성을 나타낸다. 원래 블록이 희소해도 보완행렬은 조밀해질 수 있다. 제거한 변수군을 통해서만 상호작용하던 변수들 사이에 소거가 새 결합을 만들기 때문이다.

## 흔한 오해와 경계 사례
{: id="common-misconceptions-and-boundary-cases"}

- **전체 행렬이 가역이면 어느 블록이든 제거할 수 있다.** 가역행렬 <span class="math-inline" markdown="0">\(\begin{bmatrix}0&1\\1&0\end{bmatrix}\)</span>의 첫 블록은 특이하다. 그 블록의 보통 보완행렬은 정의되지 않는다. 변수를 재배열하거나 다른 유효한 분할을 택해야 한다.
- **제거한 블록이 가역이면 보완행렬도 가역이다.** <span class="math-inline" markdown="0">\(\begin{bmatrix}1&1\\1&1\end{bmatrix}\)</span>에서는 $A=1$이지만 $S=0$이고 전체 행렬은 특이하다.
- **보완행렬이 양수이면 전체도 양의 정부호이다.** $\operatorname{diag}(-1,2)$에서는 $S=2$이지만 첫 좌표의 에너지가 음수이다. 에너지 판정에는 대칭성과 첫 블록의 양의 정부호성이 모두 필요하다.
- **특이 블록의 역행렬을 유사역행렬로 바꾸면 항상 처리할 수 있다.** 일반화된 보완행렬에는 추가 조건이 필요하다. [Gallier, §4](https://www.cis.upenn.edu/~jean/schur-comp.pdf)는 양의 준정부호 판정에 필요한 치역 조건을 다룬다. 위 보통 공식은 가역성을 가정한다.

## 연습문제
{: id="practice-problems"}

다음 문제와 풀이는 직접 구성했다. 설명을 펼치기 전에 먼저 시도하자.

### 1. 손계산
{: id="1-hand-calculation"}

<span class="math-inline" markdown="0">\(M=\begin{bmatrix}3&1\\1&2\end{bmatrix}\)</span>, 오른쪽 항 $(7,5)^T$에서 첫 변수를 제거하고 축소 방정식을 푼 뒤 첫 변수를 복원하라.

<details markdown="1">
<summary>힌트와 풀이</summary>

**힌트:** 계수와 오른쪽 항을 모두 바꾼다.

$S=2-1/3=5/3$이고 축소한 오른쪽 항은 $5-7/3=8/3$이다. 따라서 $y=8/5$, $x=(7-8/5)/3=9/5$이다. 확인하면 $3(9/5)+8/5=7$, $9/5+2(8/5)=5$이다.

</details>

### 2. 해석과 전략
{: id="2-interpretation-and-strategy"}

$q(x,y)=4x^2+4xy+3y^2$에서 $x=0$으로 두는 것과 에너지를 최소화하여 $x$를 제거하는 것은 왜 다른가? 각각 $y^2$의 계수를 구하라.

<details markdown="1">
<summary>힌트와 풀이</summary>

**힌트:** 변수를 고정하면 반응을 막지만 최소화하면 조정을 허용한다.

$x=0$이면 $3y^2$가 남는다. $x$에 대해 최소화하면 $x=-y/2$가 되어 $2y^2$가 남는다. 더 작은 계수는 첫 변수를 통한 이완을 반영한다.

</details>

### 3. 추상적 추론
{: id="3-abstract-reasoning"}

$A$가 가역이고 0이 아닌 $z$에 대해 $Sz=0$이라고 하자. $M$의 영공간에 속하는 0이 아닌 벡터를 구성하라.

<details markdown="1">
<summary>힌트와 풀이</summary>

**힌트:** 위쪽 방정식을 상쇄하도록 벡터의 첫 블록을 고른다.

$w=(-A^{-1}Bz,z)^T$를 쓰자. $Mw$의 위 블록은 0이고 아래는 $(D-CA^{-1}B)z=Sz=0$이다. $z\ne0$이므로 $w\ne0$이다. 행렬식을 계산하지 않고 특이성을 증명했다.

</details>

### 4. 실용적 응용
{: id="4-practical-application"}

내부 변위 $x$, 경계 변위 $y$인 단순화된 강성 모델의 에너지가 $q=2x^2+4xy+5y^2$이다. 내부 변위가 이완한 뒤의 유효 경계 강성을 구하라. 전체 모델은 양의 정부호인가?

<details markdown="1">
<summary>힌트와 풀이</summary>

**힌트:** 교차항은 $2Bxy$이므로 $B=2$이다.

$A=2$, $D=5$, $S=5-2(1/2)2=3$이다. 완전제곱을 만들면 $q=2(x+y)^2+3y^2$이다. 이완하면 $x=-y$가 되어 $3y^2$가 남으므로 유효 계수는 3이다. $A$와 $S$가 모두 양수이므로 전체 대칭행렬은 양의 정부호이다.

</details>

## 관련 문서
{: id="related-pages"}

- [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})

## 참고문헌
{: id="references"}

- Jean Gallier, [*The Schur Complement and Symmetric Positive Semidefinite (and Definite) Matrices*](https://www.cis.upenn.edu/~jean/schur-comp.pdf). 1–2절은 블록 소거와 양의 성질, §4는 특이 블록과 유사역행렬을 설명한다. 스칼라 예제를 넘어 증명을 따라가기에 유용하다.
- Stephen Boyd와 Lieven Vandenberghe, [*Convex Optimization*](https://stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf). 부록 A.5.5는 보완행렬 항등식과 양의 정부호 판정법을 모으고 §C.4는 블록 선형계 풀이의 구성을 보인다. 대수와 계산 최적화의 연결을 익히기에 유용하다.
