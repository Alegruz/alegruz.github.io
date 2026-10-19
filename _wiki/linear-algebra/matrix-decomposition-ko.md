---
title: 행렬 인수분해와 분해
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-matrix-decomposition
description: 행렬을 구조가 있는 인수의 곱으로 나타내고 LU, Cholesky, QR과 SVD의 용도를 비교합니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: e131b9dd8d06eb638e4472c3e9b0bacc6d521528f8be200b93e7fcad4de8e53e
interactive_examples: true
---

## 정의
{: id="definition"}

**행렬 인수분해(matrix factorization)** 또는 **행렬 분해(matrix decomposition)**는 행렬을 유용한 구조를 가진 행렬들의 곱으로 나타낸다. 예를 들어

$$
A = BC
$$

$A\in\mathbb R^{m\times n}$은 실수 원소의 $m$행 $n$열 행렬이며 $a_{ij}$는 $i$행 $j$열이다. $A=BC$에서 $B$는 $m\times r$, $C$는 $r\times n$으로 안쪽 차원 $r$이 맞아야 곱한다. $2\times3$과 $3\times2$의 곱은 $2\times2$이다. 인수가 둘보다 많을 수도 있다. [OpenStax 행렬 연산](https://openstax.org/books/college-algebra-2e/pages/7-5-matrices-and-matrix-operations).

### 인수 모양 읽기
{: id="reading-the-factor-shapes"}

**주대각선**은 왼쪽 위에서 오른쪽 아래이다. **대각행렬**은 나머지가 0, **하삼각행렬**은 대각 위가 0, **상삼각행렬**은 대각 아래가 0이다. 예를 들어

$$
D=\begin{bmatrix}2&0\\0&3\end{bmatrix},\qquad
L=\begin{bmatrix}1&0\\4&1\end{bmatrix},\qquad
U=\begin{bmatrix}2&5\\0&3\end{bmatrix}.
$$

$L$은 대각이 모두 1인 **단위 하삼각**이다. $\operatorname{diag}(2,3)$은 $D$의 약기이다. 직사각 대각행렬에서도 행·열 번호가 같은 원소만 0이 아닐 수 있다. 이 0 패턴은 [LAPACK 선형계 분해](https://www.netlib.org/lapack/lug/node38.html)의 삼각 인수를 설명한다.

### 전치, 항등과 변환 되돌리기
{: id="transpose-identity-and-undoing-a-transformation"}

**전치** $A^T$는 행과 열을 바꾼다. 예를 들어

$$
\begin{bmatrix}1&2\\3&4\end{bmatrix}^T
=\begin{bmatrix}1&3\\2&4\end{bmatrix}.
$$

벡터는 보통 열로 쓰는 좌표 목록이며 $(3,4)^T$는 가로 목록을 열로 바꾼다. **항등행렬** $I$는 대각 1, 나머지 0이므로 $Ix=x$이다.

**역행렬** $A^{-1}$은 $A^{-1}A=AA^{-1}=I$로 정사각행렬의 작용을 되돌린다. 역행렬이 있으면 **가역**, **비특이**이다. $\operatorname{diag}(2,3)$은 $\operatorname{diag}(1/2,1/3)$로 되돌린다. **특이행렬**에는 역행렬이 없다. $\operatorname{diag}(2,0)$은 둘째 좌표를 잃어 복원할 수 없다. [OpenStax의 항등·역행렬](https://openstax.org/books/college-algebra-2e/pages/7-7-solving-systems-with-inverses).

### 길이를 보존하는 인수
{: id="length-preserving-factors"}

**내적**은 대응 좌표를 곱해 더한다. $(1,2)^T\!\cdot(3,4)^T=1\cdot3+2\cdot4=11$이다. 0이 아닌 두 벡터의 내적이 0이면 **수직**, **직교**이다. $(1,1)^T,(1,-1)^T$가 그 예이다.

**유클리드 길이** $\lVert x\rVert_2=\sqrt{x_1^2+\cdots+x_n^2}$에서 $(3,4)^T$는 길이 5이다. **단위벡터**는 길이 1이고 0이 아닌 벡터를 길이로 나누는 것이 **정규화**이다. $(3/5,4/5)^T$가 정규화 결과이다. [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }}).

$Q^TQ=I$인 정사각행렬은 **직교**로 열들이 수직 단위벡터이며 길이를 보존한다. $Q=\operatorname{diag}(1,-1)$은 $(3,4)^T$를 길이가 여전히 5인 $(3,-4)^T$로 반사한다. [LAPACK 직교 인수](https://www.netlib.org/lapack/lug/node39.html).

**선형계** $Ax=b$는 주어진 $b$를 만드는 입력 $x$를 묻는다. 인수의 구조가 표현을 유용하게 만든다. 삼각 인수는 풀이를 단순화하고 직교 인수는 길이를 보존하며 대각 인수는 독립적 크기 조정을 드러낸다. 불완전한 측정 적합과 행렬이 늘이기만 하는 방향 찾기에도 도움이 된다. 아래에서 설명하며 [LAPACK 선형계](https://www.netlib.org/lapack/lug/node38.html), [직교분해](https://www.netlib.org/lapack/lug/node39.html)에도 있다.

추가 조건이 없으면 곱 표현은 유일하지 않다. 임의의 가역 $S\in\mathbb R^{r\times r}$에 대해

$$
BC = (BS)(S^{-1}C).
$$

단위 대각·양의 대각 조건은 이 자유도의 일부를 없앤다. 이런 관례도 인수의 **정규화**라 한다. $L$ 대각을 1로 강제하면 $L,U$ 사이에 옮길 수 있는 배율이 고정된다.

## 직관: 한 연산을 연속 단계로 바꾸기
{: id="intuition-one-operation-becomes-a-sequence"}

행렬은 벡터 변환을 나타낸다. $e_1=(1,0)^T$, $e_2=(0,1)^T$는 모든 2좌표 벡터를 $x=x_1e_1+x_2e_2$로 만드는 **좌표 기저**이다. 행렬 열은 구성요소를 보낼 곳으로, 열이 $a_1,a_2$이면 $Ax=x_1a_1+x_2a_2$이다. $A=BC$는 같은 변환을 단계로 쓴다.

$$
x\ \xrightarrow{\ C\ }\ y=Cx\ \xrightarrow{\ B\ }\ BCx=Ax.
$$

**가장 오른쪽 인수가 먼저 작용한다.** 인수는 더할 조각이 아니라 합성할 연산이다. 예를 들어

$$
C=\begin{bmatrix}2&0\\0&1\end{bmatrix},\qquad
B=\begin{bmatrix}1&1\\0&1\end{bmatrix}.
$$

$C$는 가로 좌표를 두 배로 한다. $B$는 $(x_1,x_2)^T$를 $(x_1+x_2,x_2)^T$로 보내 높이는 유지하며 높은 점을 더 옆으로 민다. 이 미끄러짐이 **전단(shear)**이다. $x=(0,1)^T$에서 확대 후 전단은 $BCx=(1,1)^T$, 반대 순서는 $CBx=(2,1)^T$이다. 같은 연산들이지만 결과는 다르다.

{% include image.html src="/assets/images/wiki/matrix-factor-stages-ko.svg" alt="같은 좌표 눈금의 세 그림이 단위 정사각형, U의 상, LU의 최종 상을 보인다." caption="A=[[4,2],[2,3]]에서 먼저 U=[[4,2],[0,2]], 이어 L=[[1,0],[1/2,1]]을 적용한다. 두 단계는 A를 직접 적용한 것과 같은 평행사변형을 만든다." %}

곱에는 비영 원소가 많은 **조밀행렬**이어도 인수는 다루기 쉬울 수 있다. 대각행렬은 좌표를 독립적으로 확대하고 직교행렬은 길이를 유지하며 회전·반사한다. 삼각행렬은 한 방향 의존성으로 좌표를 혼합해 순차 풀이가 가능하다. [LAPACK 직교 인수](https://www.netlib.org/lapack/lug/node39.html).

### 인수의 0이 중요한 이유
{: id="why-zeros-in-a-factor-matter"}

다음 하삼각계를 보자.

$$
\begin{bmatrix}2&0&0\\1&3&0\\4&-1&2\end{bmatrix}
\begin{bmatrix}y_1\\y_2\\y_3\end{bmatrix}
=\begin{bmatrix}2\\7\\6\end{bmatrix}.
$$

첫 행이 $y_1=1$, 둘째에 대입하면 $y_2=2$, 두 값을 셋째에 쓰면 $y_3=2$이다. 세 미지수를 동시에 풀 필요가 없다. 0이 $y_1\to y_2\to y_3$ 의존 순서를 기록하며 상삼각은 반대 순서이다.

분해가 원래 문제를 없애지는 않는다. 결합된 계산을 한 번 하고 이후 사용이 쉬운 표현을 보관한다.

## 대표적인 분해
{: id="common-decompositions"}

### 조건과 용도의 용어
{: id="terms-for-the-conditions-and-uses"}

벡터의 **선형결합**은 $2a_1-3a_2$처럼 수를 곱해 더한다. **열공간** $\operatorname{Col}(A)$는 열의 모든 결합, 즉 가능한 모든 출력 $Ax$이다. 어느 열도 나머지로 만들 수 없으면 **선형독립**이다. **계수(rank)**는 독립 열의 최대 수, **완전 열계수**는 모든 열이 독립 방향을 기여함이다. 예를 들어

$$
\begin{bmatrix}1&2\\0&0\end{bmatrix}
\quad\text{의 계수는 }1,\qquad
\begin{bmatrix}1&0\\0&1\end{bmatrix}
\quad\text{의 계수는 }2.
$$

첫 행렬의 둘째 열은 첫 열의 두 배여서 출력은 가로축 위에 있다. **계수 부족**은 계수가 $\min(m,n)$보다 작다는 뜻이다. [MIT 열공간·계수 설명](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-1-the-column-space-of-a-contains-all-vectors-ax/).

**최소제곱**은 차이 제곱합이 최소인 $x$를 고르고 **잔차** $r=b-Ax$는 그 차이 벡터이다. 상수 $x$를 측정 $1,2,6$에 맞추면 $(1-x)^2+(2-x)^2+(6-x)^2$를 최소화하여 $x=3$, 잔차 $(-2,-1,3)^T$이다. 미지수 하나에 방정식 셋인 **과결정**이다. [LAPACK의 정식화](https://www.netlib.org/lapack/lug/node39.html).

$A=A^T$이면 **대칭**, 모든 $x\ne0$에 $x^TAx>0$이면 **양의 정부호**이다. $\operatorname{diag}(2,3)$의 $2x_1^2+3x_2^2$는 두 좌표가 모두 0일 때 외에 양수이다. **대칭 양의 정부호**를 **SPD**라 줄인다. [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})은 $x^TAx$, [SPD 문서]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})는 양수 조건을 전개한다.

**고유벡터**는 $Av=\lambda v$인 $v\ne0$이고 수 $\lambda$가 **고윳값**이다. $\operatorname{diag}(2,3)$에서 $e_1$은 고윳값 2로 같은 직선에 남으며 길이가 두 배이다. 음의 고윳값은 방향을 뒤집는다. [LAPACK 대칭 고유문제](https://www.netlib.org/lapack/lug/node89.html).

표는 실수행렬을 쓴다. 복소 **켤레**는 $a+bi$를 $a-bi$로 바꾼다($i^2=-1$). **켤레전치** $Q^\ast$는 전치와 원소 켤레를 취한다. $Q^\ast Q=I$인 **유니터리**는 직교의 복소 대응이다. 원소가 $i$ 하나인 행렬도 $(-i)i=1$이므로 유니터리이다. [LAPACK 실수·복소 정의](https://www.netlib.org/lapack/lug/node39.html).

**소거**는 앞 방정식의 배수를 뒤 식에서 빼 미지수를 없앤다. 배수를 고르며 나누는 계수가 **피벗**이다. 쓸 수 있는 피벗을 위해 행을 바꾸는 것이 **행 피벗팅**이다. 첫 미지수 계수가 0이면 비영 계수인 식과 교환한다. [LU 문서]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})가 행렬로 보인다.

| 분해 | 형태 | 조건과 인수 구조 | 대표 용도 |
| --- | --- | --- | --- |
| [LU]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }}) | $PA=LU$ | 일반 비특이 정사각행렬. $P$는 행 재배열, $L$은 단위 하삼각, $U$는 상삼각 | 선형계 |
| [Cholesky]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }}) | $A=LL^T$ | [대칭 양의 정부호]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }}) $A$, 양의 대각 하삼각 $L$ | 양의 정부호 계수 선형계 |
| [QR]({{ '/wiki/linear-algebra/qr-factorization-ko/' | relative_url }}) | $A=QR$ | $m\ge n$의 축소형은 $Q$의 열 $n$개만 보관. $Q\in\mathbb R^{m\times n}$, $Q^TQ=I$, 상삼각 $R\in\mathbb R^{n\times n}$ | 독립 열의 최소제곱 |
| 특잇값 분해(SVD) | $A=U\Sigma V^T$ | 임의 $m\times n$. 완전 $U,V$는 직교, $\Sigma$는 비음수 직사각 대각 | 늘어남 계수인 특잇값과 계수 분석 |
| 대칭 고유분해 | $A=Q\Lambda Q^T$ | 실수 대칭 $A$, 직교 $Q$, 실수 대각 $\Lambda$ | 고윳값·고유벡터 |

인수 구조는 LAPACK의 [LU](https://www.netlib.org/lapack/double/dgetrf.f), [Cholesky](https://www.netlib.org/lapack/double/dpotrf.f), 안내서의 [QR](https://www.netlib.org/lapack/lug/node40.html), [SVD](https://www.netlib.org/lapack/lug/node32.html), [대칭 고유분해](https://www.netlib.org/lapack/lug/node89.html)를 참고하자. LAPACK은 피벗 LU를 $A=PLU$로 쓰며 그 순열은 $PA=LU$ 순열의 역이다.

## 왜 풀기 전에 분해하는가?
{: id="why-factor-before-solving"}

$A$가 비특이이고 다음을 풀려 한다고 하자.

$$
Ax=b.
$$

피벗 LU에서는 $LUx=Pb$이다. $y=Ux$를 도입해

$$
Ly=Pb,\qquad Ux=y.
$$

**전진대입**은 앞의 세 행 예제처럼 하삼각을 첫 행부터 내려가며 풀고 **후진대입**은 상삼각을 마지막부터 올라간다. **순열행렬** $P$는 항등행렬의 행을 바꾼 것으로 $A,b$에 같은 재배열을 한다. 새 오른쪽 항에도 인수를 재사용할 수 있어 LAPACK이 [분해·풀이 루틴](https://www.netlib.org/lapack/lug/node38.html)을 나눈다.

## 계산 예제
{: id="worked-example"}

다음을 보자.

$$
A=\begin{bmatrix}4&2\\2&3\end{bmatrix}.
$$

LU와 Cholesky 분해를 모두 가진다.

$$
A=
\begin{bmatrix}1&0\\\tfrac12&1\end{bmatrix}
\begin{bmatrix}4&2\\0&2\end{bmatrix}
=
\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}
\begin{bmatrix}2&1\\0&\sqrt2\end{bmatrix}.
$$

어느 쌍을 곱해도 $A$이다. LU의 하삼각은 단위 대각이고 Cholesky의 상삼각은 하삼각의 전치이다. 같은 행렬의 다른 구조 표현이다.

## 각 분해가 드러내는 것
{: id="what-the-different-decompositions-reveal"}

### LU는 소거 절차를 드러낸다
{: id="lu-exposes-an-elimination-procedure"}

소거는 뒤 식에서 미지수를 없앤다. $U$는 단순화된 식, $L$은 원래 식 복원에 필요한 배수를 저장한다. 같은 행렬을 결합된 원래 시스템 또는 풀이 기록으로 읽을 수 있다. [LU 문서]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})에서 기록을 계산한다.

### Cholesky는 제곱합을 드러낸다
{: id="cholesky-exposes-a-sum-of-squares"}

SPD $A=LL^T$에서는

$$
x^TAx=\lVert L^Tx\rVert_2^2.
$$

**이차형식**은 $x^TAx$처럼 좌표 제곱과 두 좌표 곱으로 된 식이다. $4x_1x_2$처럼 다른 좌표를 섞는 곱은 **교차항**이다. $(2x_1+x_2)^2=4x_1^2+4x_1x_2+x_2^2$에서 다른 두 부분의 곱이 교차항을 준다.

**완전제곱 만들기**는 이런 항을 제곱 괄호에 모으고 나머지를 계산한다. 예제에서는

$$
4x_1^2+4x_1x_2+3x_2^2
=(2x_1+x_2)^2+2x_2^2
=(2x_1+x_2)^2+(\sqrt2x_2)^2.
$$

$y_1=2x_1+x_2$, $y_2=\sqrt2x_2$로 두면 보통 길이 제곱 $y_1^2+y_2^2$이다. $y=L^Tx$에서 $L^T$가 상삼각인 것은 $y_2$는 $x_2$만, $y_1$은 두 좌표 모두를 쓸 수 있기 때문이다. **삼각 좌표변환**의 구체적인 뜻이다. [Cholesky 문서]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})는 교차항·완전제곱에서 분해로, [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})은 $x^TAx$ 자체로 나아간다.

### QR은 방향과 좌표 혼합을 분리한다
{: id="qr-separates-direction-from-coordinate-mixing"}

[Gram–Schmidt 직교화]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/' | relative_url }})는 앞 투영을 빼 수직 단위 방향을 만든다. 복원 계수를 기록하면 [QR 분해]({{ '/wiki/linear-algebra/qr-factorization-ko/' | relative_url }})이며 해당 문서는 최소제곱과 다른 알고리즘을 전개한다.

[Householder 반사]({{ '/wiki/linear-algebra/householder-reflection-ko/' | relative_url }})는 길이 보존 거울로 대각 아래를 차례로 지워 $R$을 남기며 반사들의 역순 곱이 $Q$이다. 분해 $A=QR$와 계산 알고리즘의 차이를 보인다. [LAPACK Householder QR](https://www.netlib.org/lapack/lug/node69.html).

$Q$의 열은 수직 단위 방향, $R$의 열은 이를 결합해 $A$의 열을 복원하는 방법이다. 예를 들어

$$
\begin{bmatrix}1&1\\1&-1\end{bmatrix}
=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}
\begin{bmatrix}\sqrt2&0\\0&\sqrt2\end{bmatrix}.
$$

이미 수직인 열들을 $Q$가 정규화하고 $R$이 길이를 되돌린다. 수직이 아니면 $R$의 **비대각** 원소는 앞 방향 성분도 기록한다. [LAPACK QR 정의](https://www.netlib.org/lapack/lug/node40.html).

작은 최소제곱 예제로 상수 $x$를 $(1,2,6)^T$에 맞추자. **설계행렬**은 모델 매개변수를 예측 측정으로 바꾸는 계수이며 여기서는 $Bx=(x,x,x)^T$인 $B=(1,1,1)^T$이다. 축소 QR은 $q=B/\sqrt3$, $r=\sqrt3$이므로 $rx=q^Tb$에서 $x=3$이다. 잔차 $b-Bx=(-2,-1,3)^T$의 합은 0으로 $q$와 수직이다. 적합은 모델 방향 성분을 포착하고 수직 성분을 잔차로 남긴다.

### SVD는 늘어남의 입력·출력 방향을 찾는다
{: id="svd-finds-input-and-output-directions-for-stretching"}

$A=U\Sigma V^T$에서 $V^T$는 입력을 수직 방향에 표현하고 $\Sigma$는 그 좌표를 확대하며 $U$는 출력 방향에 놓는다. 정사각행렬의 직교 단계는 회전·반사하고 $\Sigma$의 비음수 대각이 **특잇값** $\sigma_i$인 배율이다. $V,U$의 $i$열이 $v_i,u_i$이면 $Av_i=\sigma_i u_i$로 입력 단위 방향이 배율을 곱한 출력 방향이 된다. [LAPACK SVD 정의](https://www.netlib.org/lapack/lug/node32.html).

$\operatorname{diag}(3,1)$은 단위원을 가로 반폭 3, 세로 반높이 1인 타원으로 보낸다. 둘째 대각이 0이면 원이 선분으로 붕괴해 한 입력 방향 전체를 잃는다. 영특잇값이 계수 손실인 이유이다. 작은 특잇값은 입력 변화의 출력 효과가 작아 풀이가 이를 되돌릴 때 크게 증폭됨을 뜻한다.

{% include image.html src="/assets/images/wiki/svd-stretch-ko.svg" alt="단위원, 좌표를 3과 1배 한 타원과 3과 0배 한 선분." caption="특잇값의 대각 예제: (3,1)은 두 방향을 늘리고 (3,0)은 하나를 없앤다. 대응하는 표시점은 각 패널에서 같은 이름을 유지한다." %}

### 대칭 고유분해는 같은 직선을 유지하는 방향을 찾는다
{: id="symmetric-eigendecomposition-finds-directions-that-keep-their-orientation"}

고유벡터는 상이 자신의 스칼라배인 0이 아닌 벡터이다. 다음에서는

$$
A=\begin{bmatrix}3&1\\1&3\end{bmatrix},\qquad
A\begin{bmatrix}1\\1\end{bmatrix}=4\begin{bmatrix}1\\1\end{bmatrix},\qquad
A\begin{bmatrix}1\\-1\end{bmatrix}=2\begin{bmatrix}1\\-1\end{bmatrix}.
$$

두 대각 방향은 4배·2배가 된다. 정규화해 $Q$를 만들면 행렬은 $Q\operatorname{diag}(4,2)Q^T$이다. 입력·출력 방향이 같아 정사각행렬에서도 둘이 다를 수 있는 SVD와 구별된다. 대칭행렬에는 모든 벡터를 만드는 수직 고유벡터의 **직교 고유기저**가 있다. [LAPACK 대칭 고유분해](https://www.netlib.org/lapack/lug/node89.html). 음의 고윳값은 방향을 뒤집지만 특잇값은 비음수이다.

## 분해 선택하기
{: id="choosing-a-decomposition"}

일반 비특이 정사각계에는 피벗 LU, [SPD]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})에는 구조를 활용하는 Cholesky, 독립 열의 과결정 최소제곱에는 QR을 쓴다. 계수가 불확실하면 열 재배열 QR이나 SVD로 주어진 정확도에서 구별 가능한 방향 수를 평가할 수 있다. [LAPACK 선형계 분해](https://www.netlib.org/lapack/lug/node38.html), [계수에 민감한 최소제곱](https://www.netlib.org/lapack/lug/node42.html).

**유효 수치 계수**는 선택한 정확도에서 중요할 만큼 늘어나는 방향 수이다. $\operatorname{diag}(3,10^{-12})$의 정확 계수는 2지만 $10^{-10}$보다 작은 배율을 무시하면 수치 계수는 1이다. 문턱은 보편 상수가 아닌 자료 척도·정확도에 달린다. **열 피벗 QR**은 열을 재배열해 독립 방향을 드러낸다. [LAPACK](https://www.netlib.org/lapack/lug/node42.html)과 크기·근사오차 측정의 [행렬 노름]({{ '/wiki/linear-algebra/matrix-norm-ko/' | relative_url }})을 참고하자.

## 대화형 예제: 순서 바꾸기
{: id="interactive-example-change-the-order"}

슬라이더 전에 벡터와 단위 정사각형 꼭짓점이 어디로 갈지 예측하자. $C=\operatorname{diag}(s,1)$, <span class="math-inline" markdown="0">\(B=\begin{pmatrix}1&k\\0&1\end{pmatrix}\)</span>을 쓴다. $s=2,k=1$에서 시작해 순서를 바꾸고 최종 수뿐 아니라 중간 벡터로 차이를 설명하자.

{% include wiki-lab-ko.html kind="composition" title="확대와 전단 합성" plot_description="입력·첫 단계·최종 정사각형과 선택 벡터를 추적하는 점들." %}

## 연습문제
{: id="practice-problems"}

힌트·풀이 전에 시도하자. 첫 두 문제는 손계산, 다음 둘은 해석·방법 선택, 다음 둘은 논리, 마지막 둘은 실무 연결이다. 직접 만든 연습이며 참고문헌은 사용한 수학 개념을 뒷받침한다.

### 1. 손계산: 두 인수 합성하기
{: id="1-hand-calculation-compose-two-factors"}

다음을 보자.

$$
B=\begin{bmatrix}1&1\\0&1\end{bmatrix},\quad C=\begin{bmatrix}2&0\\0&3\end{bmatrix},\quad x=\begin{bmatrix}1\\2\end{bmatrix}.
$$

$Cx,BCx,CBx$를 구하라. 마지막 두 벡터는 같은가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

오른쪽부터 적용하고 두 중간 벡터를 비교한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$Cx=(2,6)^T$로 $BCx=(8,6)^T$이다. 반대로 $Bx=(3,2)^T$로 $CBx=(6,6)^T$이다. 확대·전단은 이 예제에서 **교환**되지 않아 순서가 결과를 바꾼다.

</details>
</div>

### 2. 손계산: 분해 확인하기
{: id="2-hand-calculation-verify-a-factorization"}

다음을 확인하라.

$$
\begin{bmatrix}2&1\\0&3\end{bmatrix}
=\begin{bmatrix}1&1\\0&1\end{bmatrix}\begin{bmatrix}2&-2\\0&3\end{bmatrix}.
$$

원래 행렬 대신 인수들로 곱을 $(1,1)^T$에 적용하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

곱의 네 원소를 확인하고 중간 벡터를 추적한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

곱 원소는 2, $-2+3=1$, 0, 3이다. 오른쪽 인수는 $(1,1)^T$를 $(0,3)^T$로, 왼쪽은 이를 $(3,3)^T$로 보낸다. 원래 행렬을 직접 곱해도 같다.

</details>
</div>

### 3. 사고: 필요한 구조 선택하기
{: id="3-thinking-select-the-structure-you-need"}

각 작업의 출발 분해와 이유를 고르라. (a) 비특이 SPD 계 풀이 (b) 독립 열 설계행렬로 관측 100개에 매개변수 3개 적합 (c) 행렬이 거의 없애는 방향 찾기.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

삼각계, 수직 모델 방향, 늘어남 배율 중 무엇이 필요한지 묻는다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

(a) Cholesky는 SPD 구조를 활용한다. (b) QR은 정규방정식 없이 정규직교 모델 기저와 삼각 최소제곱 풀이를 준다. (c) SVD는 작은 특잇값 방향을 찾는다. 작업·가정에 따른 선택이며 같은 행렬에 여러 분해가 있을 수 있다.

</details>
</div>

### 4. 사고: 작은 늘어남과 큰 역반응
{: id="4-thinking-a-small-stretch-can-cause-a-large-inverse-response"}

$A=\operatorname{diag}(5,0.01)$에서 크기 $0.001$의 출력 교란이 첫 또는 둘째 좌표에 생긴다. 이를 설명할 입력 좌표 변화는 얼마인가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

각 배율로 나누어 늘어남을 되돌린다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

첫 좌표는 $0.001/5=0.0002$, 둘째는 $0.001/0.01=0.1$로 500배 크다. 약하게 전달되는 방향은 교란된 출력에서 정확히 복원하기 어렵다.

</details>
</div>

### 5. 논리: 중간 차원이 계수를 제한하는 이유
{: id="5-logic-why-the-intermediate-dimension-bounds-rank"}

$A=BC$, $B\in\mathbb R^{m\times r}$, $C\in\mathbb R^{r\times n}$에서 $\operatorname{rank}(A)\le r$임을 증명하라. $A$ 계수가 $r$보다 크면 무엇을 뜻하는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

곱의 모든 열은 B 열의 선형결합이다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

모든 $x$에서 $Ax=B(Cx)$는 $B$ 열공간에 속한다. 따라서 $\operatorname{Col}(A)\subseteq\operatorname{Col}(B)$, $\operatorname{rank}(A)\le\operatorname{rank}(B)\le r$이다. $A$의 계수가 $r$보다 크면 중간 좌표 $r$개만 지나는 정확한 분해는 불가능하다.

</details>
</div>

### 6. 논리: 인수 정규화가 필요한 이유
{: id="6-logic-why-factors-need-normalization"}

$A=BC$, $\alpha\ne0$이면 $A=(\alpha B)(\alpha^{-1}C)$임을 보이라. 모든 구조적 분해가 비유일함을 증명하는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

제한 없는 곱과 인수에 추가 조건이 있는 곱을 구별한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

**스칼라**는 하나의 수로 여기서는 $\alpha$이다. 한 인수에 $\alpha$, 다른 인수에 $1/\alpha$를 곱하면 배율이 상쇄된다. 제한 없는 비영 인수의 비유일성은 보이지만 모든 정규화를 유지하지는 않는다. 단위 하삼각에 $\alpha\ne1$을 곱하면 단위 대각이 사라진다. 유일성 정리는 모든 명시 조건을 만족하는 인수에 관한 것이다.

</details>
</div>

### 7. 응용: 반복 측정 결합하기
{: id="7-applied-combine-repeated-measurements"}

센서가 한 상수량에 2,3,7을 보고한다. 같은 가중치에서 $B=(1,1,1)^T$의 축소 QR로 최소제곱 추정과 잔차를 구하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

$q=B/\sqrt3$, $r=\sqrt3$로 $rx=q^Tb$를 푼다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$q^Tb=12/\sqrt3$이므로 $x=4$, 잔차는 $(-2,-1,3)^T$이다. 합이 0이라 모델 열과 수직이다. 같은 가중치는 산술평균을 주며 다른 가중치는 목적함수를 바꾼다.

</details>
</div>

### 8. 응용: 그래픽스 변환 되돌리기
{: id="8-applied-undo-a-graphics-transformation"}

그래픽스 파이프라인이 가로를 2배 하고 가로 전단 $k=1/2$를 적용한다. $(1,2)^T$의 출력과 입력 복원 순서를 구하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

정방향 순서는 역순으로 되돌린다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

확대하면 $(2,2)^T$, 전단하면 $(3,2)^T$이다. 먼저 가로에서 세로 절반을 빼 $(2,2)^T$로 만들고 가로를 2로 나눈다. 대수적으로 $(BC)^{-1}=C^{-1}B^{-1}$이며 오른쪽 인수가 $B$부터 되돌린다.

</details>
</div>

## 더 공부할 자료
{: id="further-learning"}

- [LAPACK 직교분해](https://www.netlib.org/lapack/lug/node39.html): 길이 보존 변환을 최소제곱에 연결한다.
- [LAPACK QR](https://www.netlib.org/lapack/lug/node40.html), [SVD](https://www.netlib.org/lapack/lug/node32.html): 인수 차원과 드러나는 방향을 비교한다.
- [LU]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }}), [Cholesky]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }}): 소거 기록·양의 에너지와 전용 연습으로 이어간다.

## 관련 문서
{: id="related-pages"}

- [Householder 반사]({{ '/wiki/linear-algebra/householder-reflection-ko/' | relative_url }})

- [QR 분해]({{ '/wiki/linear-algebra/qr-factorization-ko/' | relative_url }})
- [Gram–Schmidt 직교화]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/' | relative_url }})

- [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }})
- [행렬 노름]({{ '/wiki/linear-algebra/matrix-norm-ko/' | relative_url }})
- [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})

- [대칭 양의 정부호 행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})

- [LU 분해]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})
- [Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. Anderson, E., 외 (1999). *LAPACK Users' Guide*, 제3판. SIAM. [Linear Equations](https://www.netlib.org/lapack/lug/node38.html).
2. Anderson, E., 외 (1999). *LAPACK Users' Guide*. [Orthogonal Factorizations and Linear Least Squares Problems](https://www.netlib.org/lapack/lug/node39.html), [QR Factorization](https://www.netlib.org/lapack/lug/node40.html).
3. Anderson, E., 외 (1999). *LAPACK Users' Guide*. [QR Factorization with Column Pivoting](https://www.netlib.org/lapack/lug/node42.html).
4. Anderson, E., 외 (1999). *LAPACK Users' Guide*. [Singular Value Decomposition](https://www.netlib.org/lapack/lug/node32.html).
5. Anderson, E., 외 (1999). *LAPACK Users' Guide*. [Error Bounds for the Symmetric Eigenproblem](https://www.netlib.org/lapack/lug/node89.html), 고유분해의 도입 정의.
6. LAPACK (2011). [DGETRF](https://www.netlib.org/lapack/double/dgetrf.f), [DPOTRF](https://www.netlib.org/lapack/double/dpotrf.f), 버전 3.3.1. LU·Cholesky 인수의 루틴 명세.

7. OpenStax. *College Algebra 2e*. [Matrices and Matrix Operations](https://openstax.org/books/college-algebra-2e/pages/7-5-matrices-and-matrix-operations), [Solving Systems with Inverses](https://openstax.org/books/college-algebra-2e/pages/7-7-solving-systems-with-inverses).
8. Strang, G. (2018). MIT OpenCourseWare, *18.065*. [The Column Space of A Contains All Vectors Ax](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-1-the-column-space-of-a-contains-all-vectors-ax/).
9. Anderson, E., 외 (1999). *LAPACK Users' Guide*. [QR Factorization: Householder and blocked constructions](https://www.netlib.org/lapack/lug/node69.html).
