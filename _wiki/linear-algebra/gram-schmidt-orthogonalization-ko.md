---
title: Gram–Schmidt 직교화
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-gram-schmidt-orthogonalization
description: 겹치는 투영 성분을 제거하여 생성공간을 보존하는 정규직교 방향을 만듭니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 47e3f4cc24f26d2cf9702c207a8834bac280de946227ac177bad006faa71bdb6
interactive_examples: true
orthogonal_examples: true
---

## 원래 문제: 함수를 유용한 방향으로 전개하기
{: id="the-original-problem-expand-a-function-in-useful-directions"}

Schmidt의 1907년 논문은 미리 정한 다른 함수족으로 함수를 표현하는 문제를 묻는다. 거듭제곱, 삼각함수 등은 구성요소가 되지만 기여가 겹칠 수 있다. §3에서는 구간의 선형독립 연속 실함수들을 정규화된 상호 직교 함수들로 바꾼다. 각주는 본질적으로 같은 공식을 Gram에게 돌린다. [원문 437쪽의 문제, 442–443쪽의 구성](https://gdz.sub.uni-goettingen.de/download/pdf/PPN235181684_0063/LOG_0045.pdf#page=6)을 참고하자. 원래부터 행렬 인수분해로 제시된 알고리즘이 아니라 함수 근사 문제이다.

**선형결합**은 각 구성요소에 수를 곱해 더한다. **생성공간(span)**은 그런 모든 결합의 집합이다. 어느 원소도 다른 것들로 만들 수 없으면 **선형독립**이다. 직교 대체는 표현 가능한 근사를 유지하면서 계수를 쉽게 구하게 해야 한다.

### 원래 기호 구성을 현대 표기로 쓰기
{: id="the-original-symbolic-construction-in-modern-notation"}

**Schmidt의 기호 문제를 현대적으로 다시 유도하기.** $a<b$인 $[a,b]$ 위에서 $f_1,\ldots,f_n$을 독립인 연속 실함수라 하자. 겹침을 측정하는 **내적**과 관련 길이를 다음으로 정의한다.

$$
\langle f,g\rangle=\int_a^b f(t)g(t)\,dt,
\qquad \lVert f\rVert=\sqrt{\langle f,f\rangle}.
$$

내적이 0이면 **직교**, 서로 직교하고 각각 길이가 1이면 **정규직교**이다. 연속성과 독립성은 아래 0이 아닌 나머지 함수의 제곱 적분이 양수임을 보장한다. 이는 [Schmidt, §3, 442–443쪽](https://gdz.sub.uni-goettingen.de/download/pdf/PPN235181684_0063/LOG_0045.pdf#page=11)의 설정이며 원문의 $\varphi_j,\psi_j$ 대신 $f_j,q_j$를 쓴다.

$q_1=f_1/\lVert f_1\rVert$로 시작한다. $f_2$에서 $q_1$ 방향 부분을 제거하려면

$$
u_2=f_2-\langle q_1,f_2\rangle q_1.
$$

왜 이 계수인가? $q_1$과 내적하면

$$
\langle q_1,u_2\rangle
=\langle q_1,f_2\rangle-\langle q_1,f_2\rangle\underbrace{\langle q_1,q_1\rangle}_{1}=0.
$$

이제 $q_2=u_2/\lVert u_2\rVert$로 정규화한다. 뒤의 각 함수에서도 앞의 모든 정규직교 성분을 제거한다.

$$
u_j=f_j-\sum_{i=1}^{j-1}\langle q_i,f_j\rangle q_i,
\qquad q_j=\frac{u_j}{\lVert u_j\rVert}.
$$

이것이 **정규화를 포함한 Gram–Schmidt 직교화**이다. 직교화만 하면 수직인 $u_j$를 얻고 정규화는 길이까지 1로 만든다.

### 근사에 도움이 되는 이유
{: id="why-this-helps-approximation"}

정규직교족 $q_1,\ldots,q_n$으로 목표 $g$를 $\sum_i c_iq_i$로 근사하자. 제곱오차를 전개하고 $i\ne j$에서 $\langle q_i,q_j\rangle=0$을 쓰면

$$
\left\lVert g-\sum_i c_iq_i\right\rVert^2
=\lVert g\rVert^2-\sum_i\langle q_i,g\rangle^2
+\sum_i\bigl(c_i-\langle q_i,g\rangle\bigr)^2.
$$

각 계수를 독립적으로 $c_i=\langle q_i,g\rangle$로 고를 수 있다. 원래 구성요소의 겹침이 계수 계산에서 사라졌다. 이 유한차원 유도는 원래 전개 문제에서 직교성의 역할을 설명하며 무한 전개의 수렴을 증명하지는 않는다. Schmidt는 그 추가 문제를 따로 다룬다.

### 구체적인 함수 계산
{: id="a-concrete-function-calculation"}

**Schmidt의 수치 자료가 아닌 보충용 특수화.** $[a,b]=[0,1]$, $f_1(t)=1$, $f_2(t)=t$로 고르면

$$
\lVert f_1\rVert^2=\int_0^1 1\,dt=1,
\quad q_1=1,
\quad \langle q_1,f_2\rangle=\int_0^1t\,dt=\frac12.
$$

따라서 $u_2(t)=t-\frac12$이며 길이의 제곱은

$$
\int_0^1\left(t-\frac12\right)^2dt
=\frac13-\frac12+\frac14=\frac1{12},
\qquad q_2(t)=\sqrt{12}\left(t-\frac12\right).
$$

$q_2$의 적분은 0, 제곱의 적분은 1이다. 평균을 빼 상수 성분을 제거했다. 두 새 함수는 여전히 모든 직선 $\alpha+\beta t=(\alpha+\beta/2)q_1+(\beta/\sqrt{12})q_2$를 표현한다.

원래 §3은 이 계산의 관측표가 아닌 일반 함수와 공식을 제공한다. 선택한 구간과 함수는 교육용 특수화이며 복원한 역사적 측정이 아니다.

## 함수에서 좌표벡터로
{: id="from-functions-to-coordinate-vectors"}

$\mathbb R^m$의 벡터에서는 적분을 **내적**으로 바꾼다.

$$
x^Ty=\sum_{k=1}^m x_ky_k,
\qquad \lVert x\rVert_2=\sqrt{x^Tx}.
$$

위첨자 $T$는 열을 행으로 전치한다. 예를 들어 $(1,2)^T$의 길이 제곱은 5이다. 길이는 [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }}), 행렬 표기는 [행렬 분해 개요]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})를 참고하자. 벡터 구성과 단계별 생성공간 성질은 [ALAFF, §3.2.1](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html)에서 전개한다.

### 투영은 이미 설명된 부분이다
{: id="a-projection-is-the-part-already-explained"}

단위벡터 $q$에 대해 $(q^Ta)q$는 $a$를 그 직선에 내린 **직교투영**, 즉 직선 위의 가장 가까운 벡터이다. 실제로

$$
\lVert a-cq\rVert_2^2
=\lVert a\rVert_2^2-(q^Ta)^2+(c-q^Ta)^2,
$$

이므로 최선의 계수는 $c=q^Ta$이다. 정규화되지 않은 $v\ne0$의 계수는 $(v^Ta)/(v^Tv)$이다. 분모를 빠뜨리는 것은 흔한 실수이다.

### 벡터 계산: 새 부분을 남긴 뒤 정규화하기
{: id="worked-vectors-keep-the-new-part-then-normalize"}

**QR 문서와 공유하는 보충용 예제.** 다음을 보자.

$$
a_1=\begin{bmatrix}1\\1\\1\end{bmatrix},
\qquad a_2=\begin{bmatrix}0\\1\\2\end{bmatrix}.
$$

첫 열의 길이가 $\sqrt3$이므로

$$
q_1=\frac1{\sqrt3}\begin{bmatrix}1\\1\\1\end{bmatrix}.
$$

둘째 열의 이 방향 계수는

$$
r_{12}=q_1^Ta_2=\frac{0+1+2}{\sqrt3}=\sqrt3.
$$

투영을 빼고 나머지 길이를 구하면

$$
u_2=a_2-r_{12}q_1
=\begin{bmatrix}0\\1\\2\end{bmatrix}-\begin{bmatrix}1\\1\\1\end{bmatrix}
=\begin{bmatrix}-1\\0\\1\end{bmatrix},
\qquad r_{22}=\lVert u_2\rVert_2=\sqrt2.
$$

따라서 $q_2=(-1,0,1)^T/\sqrt2$이다. 직접 확인하면

$$
q_1^Tq_2=\frac{-1+0+1}{\sqrt6}=0,
\qquad q_1^Tq_1=q_2^Tq_2=1.
$$

입력을 복원하는 방법도 기록했다.

$$
a_1=\sqrt3\,q_1,
\qquad a_2=\sqrt3\,q_1+\sqrt2\,q_2.
$$

이 계수들이 [QR 분해]({{ '/wiki/linear-algebra/qr-factorization-ko/' | relative_url }})의 삼각 인수가 된다.

## 알고리즘이 작동하는 이유와 멈추는 경우
{: id="why-the-algorithm-works-and-when-it-stops"}

독립인 $a_1,\ldots,a_n\in\mathbb R^m$에 대해 고전적 Gram–Schmidt는 다음을 계산한다.

$$
r_{ij}=q_i^Ta_j\quad(i<j),\qquad
u_j=a_j-\sum_{i<j}r_{ij}q_i,\qquad
r_{jj}=\lVert u_j\rVert_2,\qquad q_j=u_j/r_{jj}.
$$

앞의 임의의 $q_k$에 대해 정규직교성으로 한 항 외에는 모두 사라진다.

$$
q_k^Tu_j=q_k^Ta_j-\sum_{i<j}(q_i^Ta_j)q_k^Tq_i=0.
$$

또한 새 $q_j$는 $a_j$와 앞의 방향들로 만들고 복원식은 새 방향들로 $a_j$를 표현한다. 따라서 매 $j$에서

$$
\operatorname{span}(a_1,\ldots,a_j)
=\operatorname{span}(q_1,\ldots,q_j).
$$

최종 생성공간만 유지하는 것보다 강한 성질이며 출력의 순서 의존성을 설명한다. [ALAFF의 단계별 생성공간 유도](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html).

### 나머지가 0이면 새 방향이 없다
{: id="zero-remainder-means-no-new-direction"}

$a_2=2a_1$이면 첫 투영을 뺀 나머지는 0이고 단위벡터 $0/\lVert0\rVert$는 없다. 정확 산술에서는 종속성을 검출하며 첫 벡터가 0이면 즉시 실패한다. 종속 입력을 건너뛰면 생성공간의 기저를 얻지만 벡터 수가 줄어든다. 영나머지가 행렬에 QR 분해가 없다는 뜻은 아니다. 추가 방향으로 정규직교족을 완성할 수 있다. [QR 문서]({{ '/wiki/linear-algebra/qr-factorization-ko/#existence-uniqueness-and-dependent-columns' | relative_url }})에서 구별한다.

### 입력 정규화만으로는 부족하다
{: id="normalizing-the-inputs-is-insufficient"}

$(1,0)^T$, $(1,1)^T/\sqrt2$는 모두 길이가 1이지만 내적은 $1/\sqrt2$이다. 길이 정규화는 겹침을 제거하지 않는다. 반대로 수직인 벡터도 단위 길이일 필요는 없다.

### 순서를 바꾸면 방향도 바뀐다
{: id="order-changes-the-directions"}

계산 예제에서 $a_2$부터 처리하면 첫 방향은 $(1,1,1)^T/\sqrt3$이 아닌 $q_1=(0,1,2)^T/\sqrt5$이다. 두 순서는 같은 최종 평면을 표현하지만 첫 직선은 다르다. 순서 관례 없이 유일하게 선호할 축을 찾는 방법은 아니다.

## 유한 정밀도에서 고전적·수정 Gram–Schmidt
{: id="classical-and-modified-gramschmidt-in-finite-precision"}

정확 공식은 내적과 뺄셈이 정확하다고 가정하지만 컴퓨터는 반올림한다. 열이 앞의 열들로 거의 설명되면 나머지는 그것을 만드는 뺄셈의 수들보다 훨씬 작을 수 있다. 이 **상쇄**는 반올림 오차의 상대적 중요성을 키운다.

**고전적 Gram–Schmidt(CGS)**는 원래 열 $a_j$에서 모든 계수를 측정한다. **수정 Gram–Schmidt(MGS)**는 점차 갱신되는 나머지에서 측정한다.

```text
for j = 1, ..., n:
    v = a_j
    for i = 1, ..., j-1:
        r_ij = dot(q_i, v)
        v = v - r_ij * q_i
    r_jj = norm(v)
    if r_jj == 0: 종속임을 알리고 중단한다
    q_j = v / r_jj
```

CGS에서는 `dot(q_i, v)`를 `dot(q_i, a_j)`로 바꾼다. 앞의 뺄셈이 $q_i$에 수직이라 정확 산술에서는 같지만 반올림 후에는 크게 다를 수 있다. [Persson의 MIT 자료 3–5번 슬라이드](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/be0cdadd9de56ff8d20d9a0c6d6d9206_MIT18_335JS19_lec9_reading.pdf#page=1).

### 출판된 예제: 작아 보이는 차이가 중요하다
{: id="published-example-an-apparently-tiny-change-matters"}

**출판된 설명용 행렬족의 현대적 재계산.** Persson의 6–7번 슬라이드는 다음을 쓴다.

$$
a_1=(1,\varepsilon,0,0)^T,\quad
 a_2=(1,0,\varepsilon,0)^T,\quad
 a_3=(1,0,0,\varepsilon)^T,
$$

$\varepsilon$은 작은 양수이고 $1+\varepsilon^2\approx1$로 단순화한다. 이 명시된 반올림 모델에서 두 방법은 $q_2\approx(0,-1,1,0)^T/\sqrt2$를 얻는다. CGS는 이어 $q_3\approx(0,-1,0,1)^T/\sqrt2$를 주어 $q_2$와 내적이 $1/2$이다. MGS는 갱신된 나머지로 $q_3\approx(0,-1,-1,2)^T/\sqrt6$를 얻어 내적이 0이다. 출처의 단순 반올림 모델에 따른 결과이며 정확 산술 결과나 모든 기계·$\varepsilon$에 대한 예측이 아니다. [원래 슬라이드 6–7](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/be0cdadd9de56ff8d20d9a0c6d6d9206_MIT18_335JS19_lec9_reading.pdf#page=1).

MGS는 대체로 단일 CGS 순회보다 신뢰할 만하지만 거의 종속인 입력에서는 직교성을 잃을 수 있다. **재직교화**는 기존 기저에 대한 투영 제거를 반복한다. 조밀 QR에는 [Householder 반사]({{ '/wiki/linear-algebra/householder-reflection-ko/' | relative_url }})도 있다. [MIT 수치해석 설명](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/pages/week-4/)이 이런 대안을 소개한다. 작은 나머지에는 척도를 반영한 정책이 필요하며 고정 절대 상수 검사는 보편적인 계수 판정법이 아니다.

Gram–Schmidt는 앞 방향으로의 투영을 빼 기저를 만든다. Householder QR은 길이를 보존하는 반사로 좌표를 바꾸며 각 단계에서 열 꼬리를 통째로 0으로 만든다. 둘 다 QR을 주지만 중간 연산은 다르다. [반사 유도]({{ '/wiki/linear-algebra/householder-reflection-ko/#construct-a-reflection-that-zeros-a-column-tail' | relative_url }})는 거울 선택을, [QR 비교]({{ '/wiki/linear-algebra/qr-factorization-ko/#choosing-the-construction' | relative_url }})는 방법들의 차이를 보인다. [LAPACK의 Householder 구성](https://www.netlib.org/lapack/lug/node69.html)도 참고하자.

## 대화형 예제: 방향이 사라지는 모습 보기
{: id="interactive-example-watch-a-direction-disappear"}

{% include orthogonal-lab-ko.html kind="gram-schmidt" title="평균을 뺀 뒤 새 방향 측정하기" source_url="https://gdz.sub.uni-goettingen.de/download/pdf/PPN235181684_0063/LOG_0045.pdf#page=11" source_label="Schmidt, §3, 442–443쪽" plot_description="표본 위치 0,1,2에서 둘째 열, 상수 투영과 평균 0인 나머지를 표시한다." %}

실습은 원래 기호 직교화 문제를 **현대적인 유한 벡터로 재구성**한 것이다. 무차원 기준 $a_1=(1,1,1)^T$, $a_2=(0,1,2)^T$는 만든 값이며 원래 관측이라고 주장하지 않는다. $a_2$의 세 원소를 바꾸면 평균이 상수 투영의 계수가 되는 것을 볼 수 있다. 가로축은 표본 위치, 세로축은 성분값이며 3차원 벡터 자체의 그림이 아니다. 위 벡터 계산으로 JavaScript 없이 기준을 볼 수 있다.

세 원소를 모두 같게 한 뒤 거의 같게 해 보자. 첫 경우 정확히 종속이고 둘째는 작은 독립 성분을 주어 정규화 방향이 변경에 민감할 수 있다. 교육용 기준을 복원하면 계산 예제로 돌아간다.

## 연습문제
{: id="practice-problems"}

문제와 수치는 직접 만든 교육용 예제이다.

### 1. 손계산: 두 방향
{: id="1-hand-calculation-two-directions"}

$a_1=(1,1,0)^T$, $a_2=(1,0,1)^T$에 Gram–Schmidt를 적용하여 투영, 나머지와 정규화 벡터를 구하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>힌트 보기</summary>

$q_1$부터 구하자. $a_2$와 내적은 $1/\sqrt2$이다.

</details>
<details markdown="1"><summary>풀이 보기</summary>

$q_1=(1,1,0)^T/\sqrt2$이다. 투영 $(1/2,1/2,0)^T$를 빼면 $u_2=(1/2,-1/2,1)^T$이며 길이 제곱은 $3/2$이다. 따라서 $q_2=(1,-1,2)^T/\sqrt6$이다. 내적은 0이고 두 길이는 1이다.

</details>
</div>

### 2. 손계산: 함수도 벡터이다
{: id="2-hand-calculation-functions-are-vectors-too"}

$[-1,1]$의 $1,t,t^2$에 적분 내적을 써 셋째 정규화 전 직교함수를 구하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>힌트 보기</summary>

대칭 구간에서 홀수 거듭제곱의 적분은 0이다. $t^2$의 상수 부분을 제거한다.

</details>
<details markdown="1"><summary>풀이 보기</summary>

$q_1=1/\sqrt2$, $q_2=\sqrt{3/2}\,t$이다. 계수 $\langle q_1,t^2\rangle=2/(3\sqrt2)$는 상수 투영 $1/3$을 주고 $\langle q_2,t^2\rangle=0$이다. 따라서 $u_3=t^2-1/3$이다. 길이 제곱은 $2/5-4/9+2/9=8/45$이므로 정규화하면 $q_3=\sqrt{45/8}(t^2-1/3)$이다.

</details>
</div>

### 3. 해석: 사라진 열
{: id="3-interpretation-a-vanished-column"}

독립인 $a_1,a_2$ 다음에 $a_3=3a_1-a_2$를 넣었다. 셋째 나머지가 0이면 앞 두 방향이 틀렸다는 뜻인가?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>힌트 보기</summary>

$a_3$를 더하기 전후의 생성공간을 비교한다.

</details>
<details markdown="1"><summary>풀이 보기</summary>

아니다. 셋째 입력은 이미 기존 평면에 있어 평면으로의 투영이 자신이다. 나머지는 0이고 생성공간 차원은 여전히 2이다. 앞 두 방향을 유지하고 종속임을 보고하되 영벡터를 정규화하지 않는다.

</details>
</div>

### 4. 논리: 새 방향이 살아남는 이유
{: id="4-logic-prove-that-the-new-direction-survives"}

처음 $j$개 입력이 독립이면 $u_j\ne0$임을 증명하라. 왜 정확 산술이 필요한가?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>힌트 보기</summary>

$u_j=0$이면 복원식과 앞 생성공간의 같음을 쓴다.

</details>
<details markdown="1"><summary>풀이 보기</summary>

$u_j=0$이면 $a_j=\sum_{i<j}(q_i^Ta_j)q_i$이다. 앞의 $q_i$는 모두 $a_1,\ldots,a_{j-1}$의 생성공간 안이므로 독립성과 모순이다. 부동소수점에서 0이나 작은 계산 나머지는 반올림·척도·자료 불확실성도 반영한다. 정확 증명은 보편적 수치 문턱값을 제공하지 않는다.

</details>
</div>

### 5. 실용적 응용: 신호에서 오프셋 제거하기
{: id="5-practical-application-remove-an-offset-from-a-signal"}

무차원 신호 $s=(2,5,8)^T$에서 $(1,1,1)^T$ 방향 성분을 제거하고 나머지를 정규화하라. 정규화는 어떤 정보를 버리는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>힌트 보기</summary>

상수 투영은 표본 평균을 세 번 반복한 것이다.

</details>
<details markdown="1"><summary>풀이 보기</summary>

평균은 5, 투영은 $(5,5,5)^T$, 나머지는 $(-3,0,3)^T$이다. 길이는 $3\sqrt2$, 정규화하면 $(-1,0,1)^T/\sqrt2$이다. 상수 제거는 오프셋을, 정규화는 추가로 진폭을 버린다. 복원이 중요하면 평균과 길이를 보관한다.

</details>
</div>

## 더 공부할 자료
{: id="further-learning"}

- [Schmidt 원문 §3, 442–443쪽](https://gdz.sub.uni-goettingen.de/download/pdf/PPN235181684_0063/LOG_0045.pdf#page=11): 현대 벡터 점화식과 원래 적분식·종속성 논증을 비교한다.
- [ALAFF: Classical Gram–Schmidt](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html): 단계별 생성공간 불변성을 행렬 표현으로 연결한다.
- [Persson의 MIT 자료](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/resources/mit18_335js19_lec9_reading/): 두 알고리즘을 비교하고 반올림 예제를 계산한다.

## 관련 문서
{: id="related-pages"}

- [Householder 반사]({{ '/wiki/linear-algebra/householder-reflection-ko/' | relative_url }})

- [QR 분해]({{ '/wiki/linear-algebra/qr-factorization-ko/' | relative_url }})
- [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }})
- [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})
- [Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. Schmidt, E. (1907). *Zur Theorie der linearen und nichtlinearen Integralgleichungen. I. Teil: Entwicklung willkürlicher Funktionen nach Systemen vorgeschriebener*. Mathematische Annalen, 63, 433–476. [원문 스캔](https://gdz.sub.uni-goettingen.de/download/pdf/PPN235181684_0063/LOG_0045.pdf). 437쪽과 442–443쪽이 본문의 문제와 구성이다. 내려받는 PDF에는 도서관 표지가 있어 인쇄 442쪽은 PDF 11쪽이다.
2. van de Geijn, R. A., Myers, M. *Advanced Linear Algebra: Foundations to Frontiers*, [§3.2.1, Classical Gram–Schmidt](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html).
3. Persson, P.-O. (2006). *Gram–Schmidt Orthogonalization*, MIT 18.335J/6.337J, 2006년 9월 21일 강의자료, [2019년 봄 강의에서 배포](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/resources/mit18_335js19_lec9_reading/). 3–7번 슬라이드가 CGS와 MGS를 비교한다.
4. Johnson, S. G. (2019). MIT OpenCourseWare, *Introduction to Numerical Methods*, [4주차](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/pages/week-4/). 수치 직교성과 대안 구성.
5. Anderson, E., 외 (1999). *LAPACK Users' Guide*. [QR Factorization: Householder and blocked constructions](https://www.netlib.org/lapack/lug/node69.html).
