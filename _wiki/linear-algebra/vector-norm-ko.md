---
title: 벡터 노름
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-vector-norm
description: 1, 2, 무한대 노름으로 벡터와 오차의 크기를 비교하고 측정 기준의 의미를 익힙니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 8308043b2c2ba5b794e82c1c6ca7e6b17e0096cdc81945be5dbe2756ad9464a5
interactive_examples: true
---

## 관측 오차를 하나의 수로 나타내는 이유
{: id="observation-errors-why-one-number-is-needed"}

Legendre는 1805년 최소제곱법 부록에서 보통 동시에 모두 만족시킬 수 없는 관측 방정식으로부터 미지량을 정하는 문제를 묻는다. 원래 기호 모델은 $E=a+bx+cy+fz+\cdots$이다. 계수는 알려져 있고 방정식들은 미지수를 공유하며 $E$는 방정식에 남은 차이인 **오차**이다. 그는 오차 제곱합을 최소화한다. Smith의 *A Source Book in Mathematics*에 실린 원문 번역 [576쪽](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608), [577쪽](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/609)을 참고하자. 이는 유클리드 오차 측정의 동기이며 Legendre가 현대 노름 공리를 도입했다는 주장은 아니다.

### 원래 문제에서 크기 측정법 유도하기
{: id="derive-the-size-measure-from-the-original-problem"}

**벡터**는 순서 있는 좌표 목록이다. 여기서는 열로 쓰며 위첨자 $T$는 가로 목록을 열로 전치한다. $\mathbb R^n$은 실수 좌표가 $n$개인 벡터의 공간이고 $\lvert x_i\rvert$는 좌표 $i$의 절댓값이다.

**원래 기호 문제의 현대적 재유도.** Legendre는 같은 양의 반복 측정과 한 점의 위치도 다룬다([578–579쪽](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/611)). 측정값을 $a_1,\ldots,a_n$, 제안한 공통값을 $t$라 쓰면 오차는 $e_i(t)=a_i-t$이다. 관측은 같은 양의 실숫값으로 단위와 가중치가 같다. Legendre의 무가중 목적함수는

$$
S(t)=\sum_{i=1}^n(a_i-t)^2.
$$

산술평균을 $\bar a=(a_1+\cdots+a_n)/n$이라 하자. $\sum_i(a_i-\bar a)=0$이므로 제곱을 전개하면

$$
\begin{aligned}
S(t)&=\sum_i\bigl[(a_i-\bar a)+(\bar a-t)\bigr]^2\\
&=\sum_i(a_i-\bar a)^2+n(t-\bar a)^2.
\end{aligned}
$$

둘째 항은 음이 아니며 $t=\bar a$일 때만 0이다. 미분 없이 평균이 목적함수를 최소화함을 증명했다. $e=(e_1,\ldots,e_n)^T$는 모든 차이를 모은 벡터이며 $\sqrt{S(t)}$가 그 유클리드 길이이다. 제곱근은 음이 아닌 수의 순서를 보존하므로 $S$와 $\sqrt S$를 최소화하는 $t$는 같다.

위치 측정에서 Legendre는 보통 공간 거리의 좌표 차이 제곱합을 쓴다. 현대 표기로 각 거리는 $\lVert u-v\rVert_2$이다. 번역본에서 기호 문제는 확인되지만 뒤의 자오선 응용과 수치 자료는 생략되어 있다. 빠진 관측을 복원하지 않는다. 아래 계산은 대신 후대에 출판된 계산 오차 예제의 값을 보존하며 물리적 단위는 지정되지 않는다.

### 출판된 계산 자료: LAPACK의 오차 벡터
{: id="published-worked-data-lapacks-error-vector"}

**출판된 설명용 자료의 현대적 재계산.** 1999년 [LAPACK Users' Guide의 “How to Measure Errors”](https://www.netlib.org/lapack/lug/node75.html) 표 4.2 다음 첫 벡터 예제는 다음과 같다.

$$
x=(1,100,9)^T,\qquad \hat x=(1.1,99,11)^T.
$$

$x$는 기준 벡터이고 모자는 근삿값을 뜻한다. 좌표별로 빼면

$$
e=\hat x-x=(0.1,-1,2)^T.
$$

세 가지 요약은 서로 다른 질문에 답한다.

$$
\begin{aligned}
\text{총 절대오차}&=0.1+1+2=3.1,\\
\text{유클리드 오차}&=\sqrt{0.1^2+(-1)^2+2^2}=\sqrt{5.01}\approx2.23830,\\
\text{최대 좌표 오차}&=\max(0.1,1,2)=2.
\end{aligned}
$$

부호는 좌표가 빗나간 방향을 나타내며 크기를 상쇄하지 않는다. 상대 오차는 차이를 기준 크기와 비교한다. 최대 오차를 최대 기준 좌표로 나누면 $2/100=0.02$, 총 절댓값 오차를 기준 절댓값 합으로 나누면 $3.1/110\approx0.0281818$이다.

**분모 관례가 중요하다.** LAPACK은 근사 벡터를 분모로 쓴 비율 $2/99\approx0.0202020$, $3.1/111.1\approx0.0279028$도 보고한다. 안내서의 반올림값 $0.0202$, $0.0279$는 이 값들이며 $x$를 분모로 쓴 비율이 아니다. 실습은 두 관례를 모두 보인다. 전체 상대 오차는 작은 좌표의 큰 오차를 숨길 수 있다. 전체 최대 노름 비율은 $2\%$지만 셋째 좌표는 $2/9\approx22.2\%$ 빗나간다.

### 주요 대화형 예제: 출판된 오차 자료 재현하기
{: id="primary-interactive-example-replay-the-published-error-data"}

{% include wiki-lab-ko.html kind="vector-error" title="LAPACK의 출판된 벡터 오차 재계산" source_url="https://www.netlib.org/lapack/lug/node75.html" source_label="LAPACK, 표 4.2 다음 첫 벡터 예제" plot_description="막대는 세 좌표의 절댓값 오차와 각각의 값을 나타낸다." %}

기준 벡터는 고정된다. 세 근사 좌표를 바꾸고 어떤 오차 요약이 달라질지 예측한 뒤 출판 기준값으로 복원하자. 모든 수정은 가상 실험이며 기본값은 안내서의 설명용 수치로 측정 관측이 아니다. 위 계산은 JavaScript 없이 읽는 기준 계산이다.

## 일반화: 노름 공리
{: id="generalize-the-norm-axioms"}

벡터에는 여러 좌표가 있지만 노름은 크기에 음이 아닌 수 하나를 부여한다. 관측 문제는 유클리드 길이를 제안하고 계산 예제는 총크기와 최대 크기도 유용함을 보인다. 다음 공리는 크기 조정과 덧셈에서 일관된 측정 규칙을 지정한다.

$x,y\in\mathbb R^n$에 대해 노름은 다음을 만족하는 함수 $\lVert\cdot\rVert:\mathbb R^n\to\mathbb R$이다.

1. **양의 정부호성:** $\lVert x\rVert\ge0$이고 등호는 정확히 $x=0$일 때 성립한다.
2. **절대 동차성:** 모든 실수 스칼라, 즉 곱하는 수 $\alpha$에 대해 $\lVert\alpha x\rVert=\lvert\alpha\rvert\lVert x\rVert$이다.
3. **삼각부등식:** $\lVert x+y\rVert\le\lVert x\rVert+\lVert y\rVert$이다.

복소수 절댓값을 쓰면 $\mathbb C$에서도 같은 공리가 적용된다. [Higham의 정의](https://nhigham.com/2021/09/22/what-is-a-vector-norm/)를 참고하자. 동차성은 벡터를 두 배로 하면 크기도 두 배라는 뜻이고 삼각부등식은 두 변위를 합친 비용이 각각 이동한 비용의 합보다 크지 않다는 뜻이다.

노름은 $d(x,y)=\lVert x-y\rVert$로 거리를 유도한다. 이는 개별 크기가 아니라 두 벡터의 차이를 측정한다.

## 대표적인 노름
{: id="common-norms"}

$x=(x_1,\ldots,x_n)^T$, $1\le p<\infty$에 대해

$$
\lVert x\rVert_p=\left(\sum_{i=1}^n|x_i|^p\right)^{1/p},\qquad
\lVert x\rVert_\infty=\max_i|x_i|.
$$

| 노름 | 공식 | 강조하는 크기 |
| --- | --- | --- |
| $1$ (Manhattan) | $\sum_i\lvert x_i\rvert$ | 절댓값 총합 |
| $2$ (Euclidean) | $\sqrt{\sum_i\lvert x_i\rvert^2}$ | 보통의 기하학적 길이 |
| $\infty$ (최대) | $\max_i\lvert x_i\rvert$ | 가장 큰 개별 크기 |

표준 $p$-노름들이며 무한대 노름은 $p\to\infty$에서의 극한이다. [Higham](https://nhigham.com/2021/09/22/what-is-a-vector-norm/), [LAPACK의 노름 표](https://www.netlib.org/lapack/lug/node75.html)를 참고하자.

### 보충 계산 예제: 한 벡터에 대한 세 질문
{: id="supplementary-worked-example-one-vector-three-questions"}

이 2차원 예제, 기하 그림과 연습문제는 보충용으로 구성한 설명이다. Legendre의 관측이나 LAPACK의 출판 자료가 아니다.

$x=(3,-4)^T$이면

$$
\lVert x\rVert_1=3+4=7,\quad
\lVert x\rVert_2=\sqrt{9+16}=5,\quad
\lVert x\rVert_\infty=4.
$$

음수 부호는 방향을 나타내며 크기를 상쇄하지 않는다. 가로와 세로 도로로 이동하면 7단위, 직선으로 가면 5단위이며 최대 좌표 변위는 4이다.

선택한 노름에서 정규화하려면 **0이 아닌** 벡터를 그 노름으로 나눈다. $x/5=(0.6,-0.8)^T$의 유클리드 노름은 1이지만 1-노름은 $1.4$이다. “단위벡터”에는 어떤 노름인지 지정이 필요하다. 영벡터는 정규화할 수 없다.

## 기하: 단위 공의 모양이 달라진다
{: id="geometry-the-unit-ball-changes-shape"}

**단위 공**은 $\lVert x\rVert\le1$인 벡터를 포함하며 경계는 $\lVert x\rVert=1$이다. 실수 2차원에서는

- $\lvert x_1\rvert+\lvert x_2\rvert\le1$이 마름모이다.
- $x_1^2+x_2^2\le1$이 원판이다.
- $\max(\lvert x_1\rvert,\lvert x_2\rvert)\le1$이 좌표축과 평행한 정사각형이다.

{% include image.html src="/assets/images/wiki/vector-norm-balls-ko.svg" alt="같은 좌표축에서 1-노름의 단위 마름모가 2-노름의 원 안에, 원이 무한대 노름의 정사각형 안에 놓인다." caption="각 경계는 서로 다른 노름에서 크기 1을 뜻한다. 마름모, 원과 정사각형은 좌표축의 단위벡터에서 만난다. 정사각형 꼭짓점 (1,1)은 다른 두 단위 공 밖에 있다." %}

$(1,1)^T$의 세 크기는 $2,\sqrt2,1$이다. 무한대 노름 상한은 여러 좌표가 동시에 커지는 것을 허용하지만 1-노름 상한은 좌표들이 공유하는 총예산을 준다.

### 보충 대화형 예제: 벡터와 측정 규칙 바꾸기
{: id="supplementary-interactive-example-change-the-vector-and-the-measuring-rule"}

{% include wiki-lab-ko.html kind="vector-norm" title="벡터 크기와 단위 공 비교" plot_description="선택한 노름의 단위 경계와 입력 벡터를 같은 좌표 눈금으로 표시한다." %}

기본값 $(3,-4)$는 설명용으로 만든 값이다. 복원 단추는 그 값으로 돌아가며 수정은 가상의 변경이다. $(1,1)$, $(3,-4)$, $(0,0)$의 크기를 예측하자. 노름을 바꾸면 정규화한 점이 새 경계로 옮겨 간다. 선은 입력 벡터, 경계는 선택한 크기의 정의를 나타낸다. 입력과 선택기는 키보드로 조작할 수 있다. JavaScript 없이도 위 계산과 정적 그림으로 같은 비교를 할 수 있다.

## 전부 다시 계산하지 않고 노름 비교하기
{: id="comparing-norms-without-recalculating-everything"}

$M=\max_i\lvert x_i\rvert$라 하자. 제곱합에는 $M^2$인 항이 하나 있고 모든 항은 $M^2$ 이하이므로

$$
\lVert x\rVert_\infty\le\lVert x\rVert_2\le\sqrt n\lVert x\rVert_\infty.
$$

또 $(\sum_i\lvert x_i\rvert)^2$를 전개하면 $\sum_i\lvert x_i\rvert^2$에 음이 아닌 교차항이 더해진다. **Cauchy–Schwarz 부등식** $\lvert\sum_i u_iv_i\rvert\le\sqrt{\sum_i u_i^2}\sqrt{\sum_i v_i^2}$는 좌표 곱 합의 절댓값을 두 유클리드 길이의 곱으로 제한한다. 예를 들어 $u=(1,1)$, $v=(3,4)$이면 $7\le\sqrt2\cdot5$이다. [ALAFF, 정리 1.2.3.3](https://www.cs.utexas.edu/~flame/laff/alaff/chapter01-vector-2-norm.html)을 참고하자. $(\lvert x_i\rvert)$와 $(1,\ldots,1)$에 적용하면

$$
\lVert x\rVert_2\le\lVert x\rVert_1\le\sqrt n\lVert x\rVert_2.
$$

상수는 중요하다. $x=(1,\ldots,1)^T$의 크기는 $n,\sqrt n,1$이다. 고정된 유한 차원에서는 이 상한들로 세 노름의 수렴이 동치지만 수치 문턱값은 다르다. 좌표가 100개인 오차에서 $\lVert e\rVert_\infty\le0.01$이면 $\lVert e\rVert_2\le0.1$이며 $\lVert e\rVert_2\le0.01$이라고 추론할 수 없다.

## 오차 측정법 선택하기
{: id="choosing-an-error-measure"}

계산 벡터 $\hat x$의 **절대 오차**는 $\lVert\hat x-x\rVert$이고 $x\ne0$일 때 **상대 오차**는 $\lVert\hat x-x\rVert/\lVert x\rVert$이다. [LAPACK의 정의](https://www.netlib.org/lapack/lug/node75.html)를 참고하고 허용오차와 노름을 함께 지정하자.

$e=(0.1,-0.1,0.1,-0.1)^T$의 최대 오차는 $0.1$, 유클리드 오차는 $0.2$, 절댓값 합은 $0.4$이다. 좌표별 허용오차에는 무한대 노름, 총 제곱오차 목적에는 $\lVert e\rVert_2^2$가 자연스럽다. 단위나 규모가 다른 좌표를 합칠 때는 의도적으로 척도를 조정하자. 미터와 초는 같은 배열에 있다는 이유로 공통 의미를 갖지 않는다.

## 흔한 오해와 반례
{: id="common-misconceptions-and-counterexamples"}

**유클리드 길이의 제곱은 노름이 아니다.** $x=(1,0)^T$이면 $\lVert2x\rVert_2^2=4$지만 동차성은 $2\lVert x\rVert_2^2=2$를 요구한다. 유용한 목적함수이지만 이차적으로 변한다.

**“0-노름”은 노름이 아니다.** 0이 아닌 좌표 수를 흔히 $\lVert x\rVert_0$로 쓴다. $(1,0)^T$를 두 배로 해도 개수는 1이어서 동차성을 어긴다. NumPy도 이런 양을 지원하지만 [수학적인 노름과 명시적으로 구별한다](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html).

**$p$ 공식에는 $p\ge1$이 필요하다.** $p=1/2$, $x=(1,0)^T$, $y=(0,1)^T$이면 각각의 크기는 1이지만 $x+y$는 4가 되어 삼각부등식을 어긴다.

**모든 노름이 회전에 불변인 것은 아니다.** $(1,0)^T$를 $45^\circ$ 회전하면 $(1/\sqrt2,1/\sqrt2)^T$이다. 유클리드 크기는 1 그대로지만 1-노름은 $\sqrt2$가 된다. 좌표에 기반한 오차 규칙은 선택한 축에 의존한다.

## 연습문제
{: id="practice-problems"}

### 1. 손계산: 크기 계산과 정규화
{: id="1-hand-calculation-compute-and-normalize"}

$x=(-2,1,2)^T$의 1, 2, 무한대 노름을 구하고 유클리드 노름으로 정규화하라.

<details markdown="1">
<summary>힌트</summary>

더하기 전에 절댓값을 구하고 제곱근을 취하기 전에 제곱한다.

</details>
<details markdown="1">
<summary>풀이</summary>

크기는 $5$, $\sqrt{4+1+4}=3$, $2$이다. 정규화한 벡터는 $(-2/3,1/3,2/3)^T$이고 그 유클리드 노름의 제곱은 $4/9+1/9+4/9=1$이다.

</details>

### 2. 해석: 집중된 오차와 분산된 오차
{: id="2-interpretation-concentrated-or-spread-out-error"}

$e=(4,0,0,0)^T$, $f=(1,1,1,1)^T$를 비교하라. 어느 쪽의 절댓값 오차 합과 최대 오차가 작은가? 허용오차 선택에 무엇을 알려 주는가?

<details markdown="1">
<summary>힌트</summary>

같은 총예산이 한 좌표에 집중될 수도 있다.

</details>
<details markdown="1">
<summary>풀이</summary>

두 1-노름은 모두 4지만 무한대 노름은 4와 1이다. 유클리드 노름은 4와 2이다. 총오차 규칙은 둘을 동등하게 보지만 최대 오차 규칙은 집중된 오차에 더 큰 벌점을 준다. 응용에서 실패의 의미에 맞게 규칙을 고르자.

</details>

### 3. 추상적 추론: 가중 크기
{: id="3-abstract-reasoning-a-weighted-size"}

양의 가중치 $w_i$에 대해 $N(x)=\sum_iw_i\lvert x_i\rvert$가 노름임을 증명하라. 가중치 하나가 0이면 무엇이 깨지는가?

<details markdown="1">
<summary>힌트</summary>

좌표마다 스칼라 삼각부등식을 쓰고 좌표 기저벡터를 시험한다.

</details>
<details markdown="1">
<summary>풀이</summary>

모든 항이 음이 아니며 합이 0이려면 모든 좌표가 0이어야 한다. 크기 조정은 $N(\alpha x)=\lvert\alpha\rvert N(x)$를 준다. 마지막으로

$$
\sum_iw_i\lvert x_i+y_i\rvert\le\sum_iw_i(\lvert x_i\rvert+\lvert y_i\rvert)=N(x)+N(y).
$$

$w_k=0$이면 0이 아닌 기저벡터 $e_k$의 크기가 0이어서 양의 정부호성을 어긴다.

</details>

### 4. 응용: 변위 추정 검증하기
{: id="4-application-validate-a-displacement-estimate"}

정확한 변위는 $x=(3,4)^T$미터, 추정은 $\hat x=(3.03,3.96)^T$미터이다. 절대 및 상대 유클리드 오차를 구하라. 최대 좌표 오차 허용치 $0.035$미터를 통과하는가?

<details markdown="1">
<summary>힌트</summary>

먼저 뺀다. 차이는 3–4–5 삼각형을 축소한 것이다.

</details>
<details markdown="1">
<summary>풀이</summary>

차이는 $(0.03,-0.04)^T$로 유클리드 노름은 $0.05$미터이다. $\lVert x\rVert_2=5$미터이므로 상대 오차는 $0.01$, 즉 $1\%$이다. 최대 좌표 오차는 $0.04$미터여서 주어진 허용치를 넘는다.

</details>

## 더 공부할 자료
{: id="further-learning"}

- [Legendre의 부록 번역, 576–579쪽](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608): 원래 관측 오차 문제와 평균·위치의 유도를 따라간다. 도입부는 후대 편집 맥락이고 번역된 부록이 원래 논증이다.
- [Higham: What Is a Vector Norm?](https://nhigham.com/2021/09/22/what-is-a-vector-norm/): 공리에서 쌍대 노름과 내적 상한으로 나아간다.
- [LAPACK: How to Measure Errors](https://www.netlib.org/lapack/lug/node75.html): 노름을 절대 오차, 상대 오차와 조건수에 연결한다.
- [NumPy: numpy.linalg.norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html): 배열 모양, `ord`, `axis`가 계산할 수학량을 어떻게 정하는지 본다.

## 관련 문서
{: id="related-pages"}

- [행렬 노름]({{ '/wiki/linear-algebra/matrix-norm-ko/' | relative_url }})
- [대칭 양의 정부호 행렬]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }})
- [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. Higham, N. J. (2021년 9월 22일). [What Is a Vector Norm?](https://nhigham.com/2021/09/22/what-is-a-vector-norm/). 노름 공리와 $p$-노름 계열.
2. Anderson, E., 외 (1999). *LAPACK Users' Guide*, 제3판. [How to Measure Errors](https://www.netlib.org/lapack/lug/node75.html). 표준 노름과 절대·상대 오차.
3. NumPy 개발진. [numpy.linalg.norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html). 소프트웨어 관례와 노름 공리를 만족하지 않는 양.

4. Legendre, A.-M. (1805). “Sur la méthode des moindres quarrés,” *Nouvelles méthodes pour la détermination des orbites des comètes*, 72–75쪽. H. A. Ruger와 H. M. Walker의 영문 번역, Smith, D. E. (1929), *A Source Book in Mathematics*, [576–579쪽](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608). 원래 기호 오차 모델과 반복 측정 문제이며 발췌문은 뒤의 자오선 수치를 생략한다.
5. van de Geijn, R. A., Myers, M. D. [Advanced Linear Algebra: Foundations to Frontiers, The vector 2-norm (Euclidean length), 정리 1.2.3.3](https://www.cs.utexas.edu/~flame/laff/alaff/chapter01-vector-2-norm.html). 노름 비교에 쓴 Cauchy–Schwarz 부등식.
