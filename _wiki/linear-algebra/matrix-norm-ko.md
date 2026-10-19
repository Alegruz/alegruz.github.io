---
title: 행렬 노름
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-matrix-norm
description: 유도 노름으로 행렬의 최대 증폭을 측정하고 Frobenius 노름 및 선형계 오차와 비교합니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 0362d1d0cd094fff04580ed7fb20e22e5bb503769670767812aea25e59831a45
interactive_examples: true
---

## 반올림 오차: 행렬은 결과를 얼마나 바꿀 수 있는가?
{: id="rounding-errors-how-much-can-a-matrix-change-a-result"}

계산한 해는 방정식을 거의 만족하면서도 참해에서 멀 수 있다. Turing의 1948년 *Rounding-off Errors in Matrix Processes*는 반올림 아래 선형계와 역행렬 계산의 정확도를 연구하며 [원래 초록](https://academic.oup.com/qjmam/article-abstract/1/1/287/1883483)에서 이 문제를 확인할 수 있다. 이는 행렬 오차와 증폭을 함께 측정할 동기이다. 아래는 Turing의 원래 표기가 아닌 현대 노름 표기이며 모든 정의의 우선권을 주장하지 않는다. 초록에는 수치 시스템이 없으므로 주요 수치 예제는 후대 LAPACK 예제의 모든 원소를 보존한다.

먼저 [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }})을 읽자. 행렬 $A$는 $Ax$로 입력 좌표를 결합하여 출력을 만든다. $Ax=b$에서 **잔차** $r=b-A\hat x$는 후보 $\hat x$가 방정식에서 빗나간 정도이고 **해 오차** $e=x-\hat x$는 정답에서 빗나간 정도이다. 식을 빼면 $Ae=r$이고 $A$가 가역이면 $e=A^{-1}r$이다. 역변환은 작은 잔차를 키울 수 있다. 역행렬은 변환을 되돌린다. 예를 들어 $\operatorname{diag}(2,1)$은 대각이 2와 1이고 나머지가 0인 행렬로, 역행렬은 첫 좌표를 절반으로 만든다.

### 출판된 계산 자료: LAPACK의 행렬 근사
{: id="published-worked-data-lapacks-matrix-approximation"}

**출판된 설명용 자료의 현대적 재계산.** 1999년 [LAPACK Users' Guide, “How to Measure Errors”](https://www.netlib.org/lapack/lug/node75.html)의 표 4.2와 벡터 오차 예제 다음 첫 행렬 예제는 다음과 같다.

$$
A=\begin{bmatrix}1&2&3\\4&5&6\\7&8&10\end{bmatrix},\qquad
\hat A=\begin{bmatrix}0.44&2.36&3.04\\3.09&5.87&6.66\\7.36&7.77&9.07\end{bmatrix}.
$$

이는 안내서의 설명용 수치로 물리 측정이 아니며 단위는 없다. 마지막 기준 원소는 9가 아니라 10으로 유지한다. 차이는

$$
E=\hat A-A=\begin{bmatrix}-0.56&0.36&0.04\\-0.91&0.87&0.66\\0.36&-0.23&-0.93\end{bmatrix}.
$$

원소에서 전체 배열의 요약으로 나아가자.

1. 절댓값 행 합은 $0.96,2.44,1.52$이다. 최댓값 $2.44$가 유도 무한대 노름이다.
2. 절댓값 열 합은 $1.83,1.46,1.63$이다. 최댓값 $1.83$이 유도 1-노름이다.
3. 아홉 원소의 제곱합은 $3.5128$이고 제곱근 $1.8742465\ldots$가 Frobenius 노름이다.

행 규칙은 변환으로 해석할 수 있다. 합이 가장 큰 행을 강화하도록 부호를 맞춘 $z=(-1,1,1)^T$를 택하면

$$
Ez=(0.96,2.44,-1.52)^T.
$$

입력의 최대 크기는 1, 출력의 최대 크기는 $2.44$이다. 따라서 행렬의 차이는 좌표별 크기가 제한된 입력에서 이만큼 큰 출력 오차를 만들 수 있다. 아래 유도는 최대 크기 1인 입력 중 이보다 큰 출력을 만드는 것은 없음을 증명한다.

상대 행렬 오차에서 기준 행렬의 최대 절댓값 행 합은 25이므로 $2.44/25=0.0976$이다. 근사 행렬의 최대 행 합은 $24.2$여서 $2.44/24.2\approx0.100826$이다. 안내서는 두 분모 관례를 모두 $0.0976$, $0.1008$로 반올림해 싣는다. 계산이 어긋난 것이 아니라 서로 다른 비율이다.

### 주요 대화형 예제: 출판된 행렬 복원하기
{: id="primary-interactive-example-restore-the-published-matrix"}

{% include wiki-lab-ko.html kind="matrix-error" title="LAPACK의 출판된 행렬 오차 재계산" source_url="https://www.netlib.org/lapack/lug/node75.html" source_label="LAPACK, 표 4.2 다음 첫 행렬 예제" plot_description="막대는 세 행의 절댓값 오차 합과 그 값을 표시한다." %}

기준 행렬은 고정되며 수정은 근삿값만 바꾸는 가상 변경이다. 출판 기준값을 복원해 위 계산을 재현하자. 막대는 개별 원소나 특잇값이 아니라 절댓값 행 합이다. JavaScript 없이도 계산 예제에서 주요 기준값을 읽을 수 있다.

## 일반화: 원소 크기와 증폭
{: id="generalize-entry-size-and-amplification"}

행렬은 숫자 배열이면서 $x\mapsto Ax$ 변환이다. Frobenius 노름은 원소 크기를 결합하고 유도 노름은 벡터의 최대 증폭을 잰다. 일반 정의 전에 출판 예제를 통해 두 질문이 다른 이유를 보았다.

## 정의와 관례
{: id="definition-and-convention"}

행렬의 노름은 $\lVert A\rVert\ge0$이고 등호는 $A=0$일 때뿐이며, $\lVert\alpha A\rVert=\lvert\alpha\rvert\lVert A\rVert$, $\lVert A+B\rVert\le\lVert A\rVert+\lVert B\rVert$를 만족한다. 배열에 [벡터 노름 공리]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }})를 적용한 것이다. $A,B\in\mathbb R^{m\times n}$은 실수 $m$행 $n$열 배열이며 $a_{ij}$는 $i$행 $j$열 원소이다. 덧셈에는 같은 모양이 필요하고 $AB$에는 $A$의 열 수와 $B$의 행 수가 같아야 한다.

일부 교재는 **행렬 노름**에 차원이 맞는 곱에 대한 **준승법성(submultiplicativity)**도 요구한다.

$$
\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert
$$

이 문서는 노름 공리와 이 추가 성질을 구별한다. [Higham의 정의와 용어](https://nhigham.com/2021/10/12/what-is-a-matrix-norm/)를 참고하자.

## 유도 노름: 최악의 증폭
{: id="induced-norms-worst-case-amplification"}

입력과 출력에 같은 벡터 $p$-노름을 사용하여 다음처럼 정의한다.

$$
\lVert A\rVert_p=\max_{x\ne0}\frac{\lVert Ax\rVert_p}{\lVert x\rVert_p}
=\max_{\lVert x\rVert_p=1}\lVert Ax\rVert_p.
$$

입력 좌표는 $n$개, 출력은 $m$개이다. 0이 아닌 입력을 그 크기로 나눌 수 있으므로 두 표현이 같다. **연산자 노름(operator norm)** 또는 **종속 노름(subordinate norm)**이라고도 하며 공식은 다음과 같다.

| 노름 | 공식 | 해석 |
| --- | --- | --- |
| 유도 $1$ | $\max_j\sum_i\lvert a_{ij}\rvert$ | 최대 절댓값 열 합 |
| 유도 $\infty$ | $\max_i\sum_j\lvert a_{ij}\rvert$ | 최대 절댓값 행 합 |
| 유도 $2$ (스펙트럴) | $\sigma_{\max}(A)=\sqrt{\lambda_{\max}(A^TA)}$ | 최대 유클리드 늘어남 |

**특잇값**은 수직인 입력·출력 방향 사이의 늘어남 계수이다. 예를 들어 $\operatorname{diag}(3,1)$의 특잇값은 3과 1이다. **고윳값** $\lambda$는 0이 아닌 벡터 $v$에 대해 $Mv=\lambda v$를 만족하여 그 방향은 크기 조정 외에는 유지된다. $\sigma_{\max}$는 최대 특잇값, $\lambda_{\max}$는 $A^TA$의 최대 고윳값이다. 전치 $A^T$는 행과 열을 바꾼다. $A^TA$는 대칭이며 $v^TA^TAv=\lVert Av\rVert_2^2\ge0$인 **양의 준정부호(PSD)**이다. [행렬 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})와 [양의 정부호·준정부호 행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})을 참고하자. 복소수에서는 전치와 함께 허수부 부호를 바꾸는 **켤레전치** $A^*$로 대체한다. [Higham의 공식](https://nhigham.com/2021/10/12/what-is-a-matrix-norm/).

### 왜 1-노름은 열이고 무한대 노름은 행인가?
{: id="why-columns-for-the-1-norm-and-rows-for-infinity"}

아래 증명은 인용한 정의의 현대적 유도이다. 2차원 기하 예제와 연습 수치는 보충용으로 만들었다.

$a_j$를 $j$번째 열이라 하여 $Ax=\sum_jx_ja_j$로 쓰면

$$
\lVert Ax\rVert_1\le\sum_j|x_j|\lVert a_j\rVert_1
\le\left(\max_j\lVert a_j\rVert_1\right)\lVert x\rVert_1.
$$

**좌표 기저벡터** $e_j$는 $j$번째가 1이고 나머지가 0이다. 예를 들어 2차원에서 $e_2=(0,1)^T$이다. 가장 큰 열에 해당하는 $x=e_j$를 고르면 상한을 달성한다. 무한대 노름에서는 각 출력 좌표에 대해

$$
|(Ax)_i|\le\sum_j|a_{ij}||x_j|
\le\left(\sum_j|a_{ij}|\right)\lVert x\rVert_\infty.
$$

합이 가장 큰 행을 고르고 각 입력 좌표의 부호를 그 행 계수와 맞추되 계수가 0이면 1로 둔다. 무한대 노름이 1인 이 입력이 상한을 달성한다. 절댓값은 상쇄가 최악의 경우를 숨기는 것을 막는다.

## Frobenius 노름: 전체 배열의 크기
{: id="frobenius-norm-size-of-the-whole-array"}

**Frobenius 노름**은 모든 원소를 하나의 긴 벡터처럼 취급한다.

$$
\lVert A\rVert_F=\sqrt{\sum_{i,j}|a_{ij}|^2}.
$$

준승법성을 만족하지만 $n>1$인 정사각행렬에서는 벡터 노름에서 유도되지 않는다. $\lVert I_n\rVert_F=\sqrt n$이지만 모든 유도 노름에서 $\lVert I_n\rVert=1$이기 때문이다. [Higham의 설명](https://nhigham.com/2021/10/12/what-is-a-matrix-norm/).

항등행렬은 어떤 벡터 길이도 바꾸지 않지만 0이 아닌 원소가 $n$개이다. 전체 원소 크기와 최대 증폭이 다른 질문인 이유이다.

## 보충 계산 예제: 네 노름 모두 구하기
{: id="supplementary-worked-example-compute-all-four-norms"}

이 작은 행렬은 출판된 $3\times3$ 자료와 별개로 만든 교육용 예제이다. 다음을 보자.

$$
A=\begin{bmatrix}1&2\\0&2\end{bmatrix}.
$$

1. 절댓값 열 합은 1과 4이므로 $\lVert A\rVert_1=4$이다.
2. 절댓값 행 합은 3과 2이므로 $\lVert A\rVert_\infty=3$이다.
3. 원소 제곱합은 $1+4+0+4=9$여서 $\lVert A\rVert_F=3$이다.
4. 스펙트럴 노름에는 다음을 만든다.

$$
A^TA=\begin{bmatrix}1&2\\2&8\end{bmatrix}.
$$

고윳값을 찾으려면 $A^TA-\lambda I$가 0이 아닌 벡터를 0으로 보내야 한다. 이런 벡터가 **영공간 벡터(null vector)**이다. 정사각행렬이 가역이 아닐 때 정확히 0이 되는 스칼라인 **행렬식**도 0이어야 한다. <span class="math-inline" markdown="0">\(\begin{pmatrix}u&v\\w&z\end{pmatrix}\)</span>의 행렬식은 $uz-vw$이므로 여기서는

$$
\det(A^TA-\lambda I)=(1-\lambda)(8-\lambda)-4=\lambda^2-9\lambda+4.
$$

이 식이 **특성다항식**이다. 근의 공식으로 두 고윳값을 구하면

$$
\lambda_\pm=\frac{9\pm\sqrt{65}}2,\qquad
\lVert A\rVert_2=\sqrt{\frac{9+\sqrt{65}}2}\approx2.92081.
$$

1-노름은 $x=(0,1)^T$에서 달성되며 출력은 $(2,2)^T$이다. 무한대 노름은 $x=(1,1)^T$, 출력 $(3,2)^T$에서 달성된다. 스펙트럴 노름에서는 $A^TA$의 $\lambda_+$에 대한 고유벡터 $(2,\lambda_+-1)^T$를 유클리드 정규화하면 최대 입력을 얻는다. 측정 규칙에 따라 최악의 방향이 달라질 수 있다.

## 기하: 단위원이 타원이 된다
{: id="geometry-a-unit-circle-becomes-an-ellipse"}

[SVD]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})는 $A=U\Sigma V^T$로 쓴다. **직교** 정사각행렬 $Q$는 $Q^TQ=I$를 만족하고 항등행렬 $I$는 $Ix=x$이다. 직교행렬은 유클리드 길이를 바꾸지 않고 회전하거나 반사한다. 직교 인수들은 길이를 보존하고 $\Sigma$는 수직 좌표들의 크기를 바꾼다. 최대 배율이 스펙트럴 노름이다.

$A=\operatorname{diag}(3,1)$이면 단위원은 반축 3과 1인 타원이 된다. 스펙트럴 노름은 3, 두 배율을 결합한 Frobenius 노름은 $\sqrt{10}$이다.

{% include image.html src="/assets/images/wiki/svd-stretch-ko.svg" alt="단위원이 반축 3과 1인 타원이 되거나 둘째 배율이 0이면 선분으로 붕괴한다." caption="출력의 가장 긴 반지름이 스펙트럴 노름이다. 두 결과의 최대 반지름은 모두 3이지만 Frobenius 노름은 diag(3,1)에서 √10, diag(3,0)에서 3으로 다르다." %}

### 보충 대화형 예제: 방향과 행렬 탐구하기
{: id="supplementary-interactive-example-explore-directions-and-matrices"}

{% include wiki-lab-ko.html kind="matrix-norm" title="행렬의 최악 늘어남 탐구" plot_description="유클리드 단위원, 2×2 행렬이 만든 상, 선택한 단위 입력과 그 출력." %}

기본 $2\times2$ 행렬은 만든 값이며 수정은 가상의 변경이다. 복원 단추는 교육용 기준으로 돌아간다. 이 보충 계산 행렬에서 시작해 입력 방향을 회전하고 증폭을 계산된 스펙트럴 노름과 비교하자. 대각행렬, 항등행렬, 영행렬과 `[[0,5],[0,0]]`을 시도하자. 표본 방향은 하한을 주며 정확한 $2\times2$ 공식은 최댓값을 계산한다. 제어기는 키보드를 지원하고 JavaScript 없이도 위 정적 예제를 읽을 수 있다.

## 오차 상한과 합성
{: id="error-bounds-and-composition"}

유도 노름의 정의에서

$$
\lVert A\delta x\rVert_p\le\lVert A\rVert_p\lVert\delta x\rVert_p.
$$

행렬 자체가 $E$만큼 바뀌면 고정 입력의 출력 변화는 $Ex$이고 상한은 $\lVert E\rVert_p\lVert x\rVert_p$이다. 같은 부등식을 두 번 적용하면

$$
\lVert ABx\rVert_p\le\lVert A\rVert_p\lVert Bx\rVert_p
\le\lVert A\rVert_p\lVert B\rVert_p\lVert x\rVert_p.
$$

단위 입력에서 최댓값을 취하면 준승법성이 증명된다. 모든 입력을 계산하지 않고도 변환의 연속에 상한을 주는 이유이다.

### 반올림 문제로 돌아가기: 잔차와 해 오차
{: id="return-to-the-rounding-error-problem-residual-versus-solution-error"}

가역 정사각행렬 $A$에서 $Ax=b$, 근삿값 $\hat x$, 잔차 $r=b-A\hat x$라 하면

$$
x-\hat x=A^{-1}r,\qquad
\lVert x-\hat x\rVert_p\le\lVert A^{-1}\rVert_p\lVert r\rVert_p.
$$

$\lVert b\rVert_p\le\lVert A\rVert_p\lVert x\rVert_p$이므로 $b\ne0$에서

$$
\frac{\lVert x-\hat x\rVert_p}{\lVert x\rVert_p}
\le\kappa_p(A)\frac{\lVert r\rVert_p}{\lVert b\rVert_p},\qquad
\kappa_p(A)=\lVert A\rVert_p\lVert A^{-1}\rVert_p.
$$

**조건수**는 정방향과 역방향 최대 증폭의 곱이다. 상대 잔차 상한을 상대 해 오차 상한으로 바꾼다. [LAPACK 안내서](https://www.netlib.org/lapack/lug/node75.html)가 이 노름에서 조건수를 정의한다. 유클리드 기하에서는 $\kappa_2(A)=\sigma_{\max}/\sigma_{\min}$으로 작은 늘어남을 역전하면 오차가 커진다. [SPD 행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})에서는 특잇값이 양의 고윳값과 같다.

출판된 LAPACK 기준 행렬을 정확하게 현대적으로 재계산하면

$$
A^{-1}=\frac13\begin{bmatrix}-2&-4&3\\-2&11&-6\\3&-6&3\end{bmatrix}.
$$

절댓값 행 합은 $3,19/3,4$이므로 $\kappa_\infty(A)=25\cdot19/3=475/3\approx158.333$으로 안내서의 $158.33$과 맞는다. 이는 최악 민감도이지 모든 잔차가 최대 비율로 증폭된다는 주장이 아니다. 주요 실습의 입력 행렬은 고정된다. 출판된 근사가 실제 소거 실행이 아닌 원소 오차를 측정하기 때문이다. 역사적 오른쪽 항이나 풀이 경로를 만들어 붙이지 않는다.

**보충용으로 만든 예제**에서 $A=\operatorname{diag}(1,0.001)$, $b=(1,0)^T$, $\hat x=(1,1)^T$라 하면 참해는 $(1,0)^T$이다. 잔차의 유클리드 크기는 $0.001$이지만 해 오차는 1이다. $\kappa_2(A)=1000$이고 상한을 달성한다.

## 흔한 오해와 반례
{: id="common-misconceptions-and-counterexamples"}

**행렬 1-노름은 모든 절댓값 원소의 합이 아니다.** 보충 $2\times2$ 예제에서 그 합은 5지만 유도 1-노름은 4이다. 유도 무한대 노름도 최대 원소가 아닌 행 합이다.

**고윳값 크기가 일반적으로 유클리드 늘어남은 아니다.** <span class="math-inline" markdown="0">\(N=\begin{bmatrix}0&5\\0&0\end{bmatrix}\)</span>의 두 고윳값은 0이지만 $N(0,1)^T=(5,0)^T$이고 $\lVert N\rVert_2=5$이다. 특잇값이 이 늘어남을 포착한다. 실수 대칭행렬에서는 직교 대각화로 $\lVert A\rVert_2=\max_i\lvert\lambda_i\rvert$이다.

**원소에 대한 노름이 반드시 준승법적인 것은 아니다.** $J$를 모든 원소가 1인 $2\times2$ 행렬이라 하자. 최대 절댓값 원소는 1이지만 $J^2$의 모든 원소는 2이다. 원소별 최댓값은 배열의 노름이지만 상수 1인 곱 상한은 어긴다.

**소프트웨어 기본값은 Frobenius 크기일 수 있다.** [NumPy 관례](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html)에서 2차원 행렬의 `np.linalg.norm(A)`는 Frobenius 크기, `np.linalg.norm(A, ord=2)`는 스펙트럴 노름이다. 배열 모양과 요청한 노름을 모두 명시하자.

## 연습문제
{: id="practice-problems"}

아래는 만든 자료로 구성한 보충 연습이며 역사적 출처가 보고한 계산이 아니다.

### 1. 손계산: 직사각행렬
{: id="1-hand-calculation-a-rectangular-matrix"}

<span class="math-inline" markdown="0">\(B=\begin{bmatrix}1&-2&0\\3&0&4\end{bmatrix}\)</span>의 유도 1, 무한대, Frobenius 노름을 구하고 1-노름을 달성하는 입력을 제시하라.

<details markdown="1">
<summary>힌트</summary>

열 합, 행 합, 원소 제곱을 따로 나열한다.

</details>
<details markdown="1">
<summary>풀이</summary>

열 합은 $4,2,4$여서 $\lVert B\rVert_1=4$이다. 행 합은 $3,7$여서 $\lVert B\rVert_\infty=7$이다. 제곱합은 $1+4+9+16=30$이므로 $\lVert B\rVert_F=\sqrt{30}$이다. $e_1$ 또는 $e_3$은 입력 1-노름이 1, 출력 1-노름이 4이다.

</details>

### 2. 해석: 필요한 노름 고르기
{: id="2-interpretation-choose-the-relevant-norm"}

행렬 근사의 오차가 $E$이다. (a) 총 원소 제곱오차와 (b) 유클리드 단위 입력에 대한 최대 출력 오차를 원한다. 각각 어떤 양을 구해야 하는가? 값이 같을 수도 있는가?

<details markdown="1">
<summary>힌트</summary>

배열 관점과 변환 관점을 비교한다.

</details>
<details markdown="1">
<summary>풀이</summary>

(a)는 $\lVert E\rVert_F^2$, (b)는 $\lVert E\rVert_2$로 목적이 다르다. $E=\operatorname{diag}(1,0)$에서는 우연히 둘 다 1이지만 $E=I_2$에서는 2와 1이다. 수치적 일치가 정의의 호환성을 뜻하지 않는다.

</details>

### 3. 추상적 추론: 유도 항등 크기가 1인 이유
{: id="3-abstract-reasoning-why-induced-identity-size-is-one"}

모든 유도 노름에서 $\lVert I_n\rVert=1$임을 증명하고 곱 상한으로 가역 $A$에 대해 $\kappa(A)\ge1$임을 유도하라.

<details markdown="1">
<summary>힌트</summary>

증폭 비율을 계산한 뒤 $AA^{-1}=I_n$을 쓴다.

</details>
<details markdown="1">
<summary>풀이</summary>

모든 $x\ne0$에서 $\lVert I_nx\rVert/\lVert x\rVert=1$이므로 최댓값도 1이다. 준승법성으로 $1=\lVert AA^{-1}\rVert\le\lVert A\rVert\lVert A^{-1}\rVert=\kappa(A)$이다.

</details>

### 4. 응용: 제한된 입력 오차 전파하기
{: id="4-application-propagate-bounded-input-error"}

보충 $2\times2$ 행렬 $A$의 각 입력 좌표 오차는 절댓값 $0.01$ 이하이다. 최대 출력 좌표 오차의 상한과 이를 달성하는 입력 오차를 구하라.

<details markdown="1">
<summary>힌트</summary>

무한대 노름을 쓰고 최대 행을 강화하는 부호를 고른다.

</details>
<details markdown="1">
<summary>풀이</summary>

$\lVert\delta x\rVert_\infty\le0.01$, $\lVert A\rVert_\infty=3$이므로 $\lVert A\delta x\rVert_\infty\le0.03$이다. $\delta x=(0.01,0.01)^T$이면 출력은 $(0.03,0.02)^T$로 상한을 달성한다. 이는 무작위 오차 가정이 아닌 최악의 보장이다.

</details>

## 더 공부할 자료
{: id="further-learning"}

- [Turing의 1948년 논문 초록](https://academic.oup.com/qjmam/article-abstract/1/1/287/1883483): 원래 반올림 오차 문제를 읽는다. 본문의 현대 잔차 유도는 원문 전체 분석의 전사가 아니다.
- [Higham: What Is a Matrix Norm?](https://nhigham.com/2021/10/12/what-is-a-matrix-norm/): 입력·출력 혼합 노름과 행렬 노름 사이 관계로 나아간다.
- [LAPACK: How to Measure Errors](https://www.netlib.org/lapack/lug/node75.html): 수치 오차 보고에서 노름과 조건수를 살핀다.
- [NumPy: numpy.linalg.norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html): 소프트웨어의 벡터·행렬·원소별 계산을 구별한다.

## 관련 문서
{: id="related-pages"}

- [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }})
- [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})
- [LU 분해]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})
- [대칭 양의 정부호 행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. Higham, N. J. (2021년 10월 12일). [What Is a Matrix Norm?](https://nhigham.com/2021/10/12/what-is-a-matrix-norm/). 행렬 노름 공리, 유도 노름과 Frobenius 노름.
2. Anderson, E., 외 (1999). *LAPACK Users' Guide*, 제3판. [How to Measure Errors](https://www.netlib.org/lapack/lug/node75.html). 노름 기반 오차와 조건수.
3. NumPy 개발진. [numpy.linalg.norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html). 행렬 노름 공식과 소프트웨어 기본값.

4. Turing, A. M. (1948). [Rounding-off Errors in Matrix Processes](https://academic.oup.com/qjmam/article-abstract/1/1/287/1883483), *The Quarterly Journal of Mechanics and Applied Mathematics*, 1, 287–308. DOI: 10.1093/qjmam/1.1.287. 동기를 확인하기 위해 원래 초록을 검증했으며 본문 전체의 수치 예제나 특정 공식을 여기서 주장하지 않는다.
