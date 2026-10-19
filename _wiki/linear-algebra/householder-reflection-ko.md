---
title: Householder 반사
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-householder-reflection
description: 수직 성분을 뒤집는 거울을 유도하고 안정적인 부호 선택으로 열의 꼬리를 제거합니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 3aeb985b0e948c342dbc10a442c2bceca12c61b8a00e50f3d462c8bf57c95a96
interactive_examples: true
orthogonal_examples: true
---

## 원래 문제: 길이를 왜곡하지 않고 행렬 삼각화하기
{: id="the-original-problem-make-a-matrix-triangular-without-distorting-lengths"}

Householder의 1958년 논문은 Oak Ridge의 계산 문제에서 출발한다. 평면 회전으로 역행렬 계산 전에 비대칭행렬을 삼각화할 수 있지만 연산이 많이 필요했다. 그는 열의 꼬리 전체를 한 번에 없애는 변환을 제안한다. 회전의 길이 보존 성질을 유지하면서 계산량을 줄이려는 동기이다. [원문 339쪽](https://web.stanford.edu/class/cme324/classics/householder.pdf#page=1).

**원래 기호 문제의 현대적 실수 산술 재유도.** 정사각행렬 $A$가 주어졌을 때 $WA=R$이 상삼각, 즉 대각 아래 모든 원소가 0이 되도록 직교행렬 $W$를 구성한다. 직교란 $W^TW=I$이며 $T$는 전치, $I$는 항등행렬이다. 따라서 $W$를 곱해도 벡터의 유클리드 길이는 보존된다. 이 문서는 실수 벡터에 한정하지만 원문은 복소 산술도 다룬다. 원문에 수치 행렬 예제가 없으므로 아래 계산과 제어기는 보충용으로 만든 예제이다.

첫 과제는 첫 열을 $e_1=(1,0,\ldots,0)^T$의 배수로 바꾸는 것이다. 뒤에는 더 짧은 열 구간에 반복한다. Householder의 [340쪽 구성](https://web.stanford.edu/class/cme324/classics/householder.pdf#page=2)은 하나의 거울로 벡터를 축에 보낼 수 있는지 묻게 한다.

## 수직 성분에서 거울 유도하기
{: id="derive-the-mirror-from-perpendicular-components"}

**원점을 지나는 초평면**은 주변 공간보다 차원이 하나 작은 부분공간으로 2차원에서는 직선, 3차원에서는 평면이다. **법선벡터**는 그에 수직이다. 단위 법선 $u$를 골라 $u^Tu=1$로 두자. 내적 $u^Tx$는 $u$ 방향의 부호 있는 성분이다. [Gram–Schmidt의 투영 설명]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/#a-projection-is-the-part-already-explained' | relative_url }})을 참고하자.

$x$를 법선 성분과 평면 안 성분으로 나누면

$$
x_\perp=u(u^Tx),\qquad x_\parallel=x-u(u^Tx),\qquad u^Tx_\parallel=0.
$$

반사는 $x_\parallel$을 유지하고 $x_\perp$를 뒤집으므로

$$
Hx=x_\parallel-x_\perp=x-2u(u^Tx),
\qquad H=I-2uu^T.
$$

0이 아닌 임의의 법선 $v$를 $u=v/\lVert v\rVert_2$로 정규화하면

$$
H=I-2\frac{vv^T}{v^Tv}.
$$

이것이 **Householder 반사(reflection)**이며 **반사행렬(reflector)** 또는 **Householder 변환**이라고도 한다. 거울은 $v$ 방향 직선이 아니라 $v$에 수직인 벡터의 집합이다. [ALAFF, §3.3.2, 정의 3.3.2.2](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html).

### 길이를 보존하고 자기 자신을 되돌리는 이유
{: id="why-it-preserves-lengths-and-undoes-itself"}

$uu^T$가 대칭이므로 $H^T=H$이다. 또한

$$
H^2=(I-2uu^T)^2
=I-4uu^T+4u(u^Tu)u^T=I.
$$

따라서 $H^{-1}=H$, $H^TH=I$이다. 두 번 반사하면 입력이 복원되고

$$
\lVert Hx\rVert_2^2=x^TH^THx=x^Tx=\lVert x\rVert_2^2.
$$

법선은 $Hu=-u$로 뒤집히지만 거울 안의 벡터는 모두 고정된다. $u$와 수직 방향들로 만든 기저에서는 대각이 $-1,1,\ldots,1$이다. 따라서 $\det H=-1$로 한 반사는 배향을 뒤집는다. 이 계산으로 [ALAFF의 반사 성질](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html)을 확인했다.

**투영은 다르다.** 거울로의 직교투영 $P=I-uu^T$는 법선 성분을 뒤집지 않고 버린다. $Pu=0$인 반면 $Hu=-u$이다. 0이 아닌 법선 성분은 투영에서 짧아질 수 있으나 반사는 길이를 보존한다. 특히 반사행렬은 0이 아닌 벡터를 0으로 만들지 않는다.

## 열의 꼬리를 없애는 반사 구성하기
{: id="construct-a-reflection-that-zeros-a-column-tail"}

**실수 벡터 단계의 현대적 유도.** $x\ne0$, 목표 $y=\alpha e_1$, $\alpha^2=\lVert x\rVert_2^2$라 하자. 반사는 길이를 보존하므로 같은 길이가 필요하다. $x\ne y$이면 법선을 다음처럼 고른다.

$$
v=x-y=x-\alpha e_1.
$$

왜 이 선택인가? 한 점과 거울상의 차이는 거울에 수직이다. 대수로도 확인된다.

$$
v^Tx=\lVert x\rVert_2^2-\alpha x_1,
$$

$$
v^Tv=\lVert x\rVert_2^2-2\alpha x_1+\alpha^2
=2(\lVert x\rVert_2^2-\alpha x_1)=2v^Tx.
$$

대입하면 $Hx=x-v=y$이다. 한 변환으로 첫 좌표 외의 모든 좌표를 0으로 만든다. [Householder, 340쪽](https://web.stanford.edu/class/cme324/classics/householder.pdf#page=2)의 벡터 구성을 특수화한 것이며 다음 부호 관례는 [ALAFF의 수치 설명](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html)을 따른다.

### 부호는 수치적 선택이다
{: id="the-sign-is-a-numerical-choice"}

$v\ne0$이면 정확 산술에서는 $\alpha$의 어느 부호도 가능하다. 계산에서는 다음을 고른다.

$$
\alpha=-\operatorname{sign}(x_1)\lVert x\rVert_2,
\qquad v=x-\alpha e_1,
\qquad \operatorname{sign}(0)=1\text{ (이 예제)}.
$$

그러면 $\lvert v_1\rvert=\lvert x_1\rvert+\lVert x\rVert_2$이다. 거의 같은 반올림된 수를 뺄 때 상대 정확도가 손실되는 **상쇄(cancellation)**를 피한다.

**보충용으로 만든 반례.** $x=(1,10^{-10})^T$의 정확한 길이는 1보다 조금 크지만 부동소수점에서는 1로 반올림될 수 있다. 양의 목표를 고르면 $v=(0,10^{-10})^T$를 계산하여 둘째 좌표만 뒤집고 크기 $10^{-10}$의 꼬리를 남긴다. 음의 목표는 $v\approx(2,10^{-10})^T$를 주어 꼬리 제거에 필요한 작은 기울기를 유지한다.

$x=0$이면 건너뛴다. 꼬리가 이미 0이면 위 공식이 선두 부호를 바꿀 수 있지만 0을 만들기 위한 변경은 필요 없다. LAPACK의 실수 [DLARFG](https://netlib.org/lapack/explore-html/d8/d0d/group__larfg_gadc154fac2a92ae4c7405169a9d1f5ae9.html)는 이때 항등행렬을 고른다. 항등행렬은 알고리즘에서 유용한 무연산이지만 행렬식 $-1$인 반사는 아니다. 견고한 구현은 큰 값과 작은 값에 맞춰 노름 계산도 재조정한다. 부호 선택만으로 넘침·언더플로를 막지는 못한다.

### 반사행렬을 계산하고 기하 읽기
{: id="calculate-the-reflector-and-read-its-geometry"}

**QR 문서와 공유하는 보충용 예제.** $x=(3,4)^T$의 길이는 5이므로 $\alpha=-5$, $v=(8,4)^T$, $v^Tv=80$이다. 따라서

$$
H=I-\frac{2}{80}\begin{bmatrix}64&32\\32&16\end{bmatrix}
=\begin{bmatrix}-3/5&-4/5\\-4/5&3/5\end{bmatrix}.
$$

곱하여 결과를 확인하면

$$
Hx=\begin{bmatrix}(-9-16)/5\\(-12+12)/5\end{bmatrix}
=\begin{bmatrix}-5\\0\end{bmatrix}.
$$

법선을 $(2,1)^T$로 골라도 같다. 0이 아닌 법선을 확대해도 $vv^T/(v^Tv)$는 변하지 않는다. 거울은 $2z_1+z_2=0$이고 $x,Hx$의 중점 $(-1,2)^T$는 그 위에 있다. 수직 성분은 $(4,2)^T$이므로 한 번 빼면 거울, 두 번 빼면 반사점에 도달한다.

{% include image.html src="/assets/images/wiki/householder-reflection-ko.svg" alt="같은 좌표 눈금에서 거울 직선 2z1+z2=0이 x=(3,4)와 Hx=(-5,0)의 선분을 중점 (-1,2)에서 수직 이등분한다." caption="만든 예제: 점선은 중점에서 거울을 가로지른다. 원점에서 두 벡터의 길이는 모두 5이고 법선은 (2,1) 방향이다." %}

## 대화형 예제: 거울을 움직인 뒤 축을 겨냥하기
{: id="interactive-example-move-the-mirror-then-aim-at-the-axis"}

이 **보충용 기하 실험**은 위 계산에서 시작한다. 입력이나 법선을 바꾸며 어느 성분이 뒤집힐지 예측하자. **입력을 첫 축으로 보내기**는 안정 부호 반사를 구성한다. 영벡터는 자신으로 반사되지만 겨냥할 0이 아닌 방향이 없고 영법선은 거울을 정의할 수 없다. 기준 복원은 $x=(3,4)^T$, 법선 $(2,1)^T$로 돌아간다.

{% include orthogonal-lab-ko.html kind="householder" title="직선을 기준으로 벡터 반사하기" source_url="https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html" source_label="ALAFF의 반사 기하" plot_description="같은 눈금으로 입력, 반사 벡터, 거울 직선과 중점을 표시한 좌표 그림." %}

## 조밀행렬 없이 반사 적용하기
{: id="apply-the-reflection-without-building-a-dense-matrix"}

단위 법선 $u$에서 스칼라 $s=u^Tx$를 계산한 뒤 $x\leftarrow x-2us$로 갱신한다. 각 순회는 좌표를 한 번씩 방문하므로 $d$차원 반사 적용은 $O(d)$ 연산과 $O(d)$ 저장을 쓴다. 조밀 $d\times d$ 행렬은 $O(d^2)$ 저장이 필요하다. 열이 $p$개인 $B$에는 같은 대수로

$$
HB=B-2u(u^TB),
$$

열마다 내적과 벡터 갱신을 하므로 비용은 $O(dp)$이다. 이 연산 수는 표시한 계산에서 직접 나오며 조밀 $H$는 필요 없다.

LAPACK은 $H=I-\tau ww^T$에서 선두 $w_1=1$인 벡터와 스칼라 $\tau$를 저장한다. $w$는 크기를 조정한 법선이며 꼭 단위벡터는 아니다. 예제의 $w=(1,1/2)^T$, $\tau=8/5$가 $H$를 재현한다. [반사 표현](https://www.netlib.org/lapack/lug/node128.html)을 참고하자. 여러 반사는 $H_1\cdots H_b=I-VTV^T$로 묶을 수 있다. $V$의 열은 법선, $T$는 작은 상삼각행렬이다. [LAPACK의 블록 QR](https://www.netlib.org/lapack/lug/node69.html)이 이를 설명한다.

## 하나의 거울에서 QR과 다른 축소로
{: id="from-one-mirror-to-qr-and-other-reductions"}

열 $j$에서는 행 $j$ 이후만 반사한다. 전체 좌표에서는 앞 $j-1$개 좌표에 항등 블록을 둔 반사여서 이전의 0을 보존한다. 다음이 성립하면

$$
H_k\cdots H_2H_1A=\begin{bmatrix}R\\0\end{bmatrix},
$$

다시 곱하여 다음을 얻는다.

$$
A=Q\begin{bmatrix}R\\0\end{bmatrix},\qquad Q=H_1H_2\cdots H_k.
$$

각 반사가 자신의 전치와 같아 순서가 뒤집힌다. $Q^T$를 적용할 때는 $H_1$부터, $Q$는 $H_k$부터 실행한다. [QR 문서]({{ '/wiki/linear-algebra/qr-factorization-ko/#householder-reflections-remove-a-column-tail-together' | relative_url }})에서 분해와 최소제곱 풀이를 전개한다. LAPACK은 [$Q$를 명시적으로 만들지 않고 곱을 적용한다](https://www.netlib.org/lapack/lug/node128.html).

**보충용 두 열 계산.** 같은 반사로

$$
A=\begin{bmatrix}3&1\\4&2\end{bmatrix},\qquad
HA=R=\begin{bmatrix}-5&-11/5\\0&2/5\end{bmatrix},\qquad A=HR.
$$

이는 $Q=H$인 QR이다. $R$의 첫 대각이 음수여도 된다. 양의 대각 관례는 $Q,R$에서 대응하는 부호를 함께 바꿔 강제할 수 있다.

반사는 고유문제·특잇값 문제를 후속 알고리즘에 맞게 준비한다. **닮음변환** $Q^TAQ$는 양쪽에서 같은 직교 좌표변환을 써 고윳값을 보존한다. 대칭행렬은 대각과 이웃 두 대각만 남는 **삼중대각**, 일반 정사각행렬은 첫 하위 대각 아래가 0인 **상 Hessenberg** 형태로 줄인다. 직사각행렬은 별도의 좌우 변환으로 대각과 이웃 하나만 남는 **이중대각**으로 줄여 SVD를 준비한다. [LAPACK의 축소](https://www.netlib.org/lapack/lug/node70.html)를 참고하자. 왼쪽 곱 $HA$만으로는 일반적으로 고윳값을 보존하지 않는다. $A=I$가 이미 반례이다.

### 길이 보존의 보장과 한계
{: id="what-length-preservation-does-and-does-not-guarantee"}

정확한 직교성은 변환 자체가 유클리드 오차를 늘리는 것을 막는다. 부동소수점 산술이 정확하거나 자료의 기존 민감도가 사라진다는 뜻은 아니다. [QR의 정확도 설명]({{ '/wiki/linear-algebra/qr-factorization-ko/#the-connection-to-cholesky-and-the-accuracy-trap' | relative_url }})에서 정규방정식을 피하는 이유와 조건수의 중요성을 다룬다.

실수 공식은 복소 산술에서도 주의해야 한다. 복소 단위벡터에 전치 대신 켤레전치를 쓰면 Hermitian 반사 $I-2uu^\ast$를 얻는다. LAPACK의 더 일반적인 복소 기본변환은 복소수일 수 있는 $\tau$로 $I-\tau ww^\ast$를 쓴다. 유니터리이지만 Hermitian이거나 자기역일 필요는 없다. [복소 표현 관례](https://www.netlib.org/lapack/lug/node128.html).

## 연습문제
{: id="practice-problems"}

위 정의와 구성으로 직접 만든 문제들이다. 힌트나 풀이를 펼치기 전에 시도하자.

### 1. 손계산: 거울 찾기
{: id="1-hand-calculation-identify-the-mirror"}

$v=(1,1)^T$에서 $H,H(2,0)^T$를 구하라. 어떤 직선이 고정되는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

$v^Tv=2$를 쓰고 거울은 $v^Tz=0$을 푼다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

행렬은 <span class="math-inline" markdown="0">\(H=\begin{pmatrix}0&-1\\-1&0\end{pmatrix}\)</span>이므로 $(2,0)^T$는 $(0,-2)^T$로 간다. 거울은 $z_1+z_2=0$, 즉 $z_2=-z_1$이다. 법선 직선 $z_2=z_1$은 고정되지 않고 뒤집힌다.

</details>
</div>

### 2. 손계산: 두 원소를 함께 0으로 만들기
{: id="2-hand-calculation-zero-two-entries-together"}

$x=(0,3,4)^T$의 안정 부호 반사를 구성하고 $3\times3$ 행렬 없이 작용을 확인하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

관례는 $\operatorname{sign}(0)=1$이다. $v^Tx,v^Tv$를 계산한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

목표와 법선은

$$
y=(-5,0,0)^T,\qquad v=(5,3,4)^T.
$$

$v^Tx=25$, $v^Tv=50$이므로

$$
Hx=x-2v(25/50)=x-v=(-5,0,0)^T.
$$

한 반사에서 두 꼬리 원소가 모두 사라진다.

</details>
</div>

### 3. 전략: 목표 부호 고르기
{: id="3-strategy-choose-the-target-sign"}

$x=(-5,10^{-8})^T$에서는 $+\lVert x\rVert_2e_1$, $-\lVert x\rVert_2e_1$ 중 어느 쪽이 안정적인가? 다른 선택에서 어떤 뺄셈이 문제인지 설명하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

$v$의 두 가능한 첫 원소 크기를 비교한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

양의 목표를 고른다. $\alpha\approx5$이면 $v_1=-5-\alpha\approx-10$이다. $\alpha\approx-5$는 거의 같은 음수를 빼므로 $v_1$이 작아 반올림에 민감하다. 안정적인 목표 부호는 입력에 따라 달라지며 항상 음수는 아니다.

</details>
</div>

### 4. 논리: 한 반사로 어떤 목표든 도달할 수 있는가?
{: id="4-logic-can-one-reflection-reach-any-target"}

길이가 같은 실수 벡터 $x\ne y$에서 $v=x-y$가 $Hx=y$를 줌을 증명하라. $x=y$이거나 길이가 다르면 무엇이 바뀌는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

$v^Tv$를 전개하여 $2v^Tx$와 비교한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

길이가 같아 $v^Tv=2(\lVert x\rVert_2^2-y^Tx)=2v^Tx$이므로 $Hx=x-v=y$이다. $x=y$이면 법선이 0으로 공식이 정의되지 않지만 항등변환이 이미 사상을 수행한다. 길이가 다르면 어떤 직교 반사도 한쪽을 다른 쪽으로 보낼 수 없다.

</details>
</div>

### 5. 논리: 반사의 곱이 반사일 필요는 없다
{: id="5-logic-a-product-need-not-be-a-reflection"}

가로축에 먼저 반사하고 $z_2=z_1$에 반사하라. 곱을 구하고 자기역인지 판별하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

첫 변환은 둘째 좌표의 부호를 바꾸고 둘째는 좌표를 교환한다. 그 순서로 적용한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

곱은 $(a,b)^T$를 $(-b,a)^T$로 보내는 $90^\circ$ 반시계 회전이다. 두 번 적용하면 $(-a,-b)^T$여서 제곱은 $I$가 아니라 $-I$이다. 반사의 곱은 직교이지만 대칭·자기역·단일 반사일 필요는 없다. $Q$에서 순서가 중요한 이유이다.

</details>
</div>

### 6. 응용: 오른쪽 항도 변환하기
{: id="6-applied-transform-the-right-hand-side-too"}

위 두 열 예제에서 $b=(5,8)^T$인 $Ax=b$를 $H$ 적용 후 $Rx=Hb$를 풀어 구하고 원래 식에서 확인하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

표시한 $2\times2$ 반사로 $Hb$를 계산하고 마지막 행부터 푼다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

$Hb=(-47/5,4/5)^T$이다. 둘째 행에서 $(2/5)x_2=4/5$로 $x_2=2$, 첫째 행에서 $-5x_1-(11/5)2=-47/5$로 $x_1=1$이다. $A(1,2)^T=(5,8)^T$로 확인한다. $b$를 그대로 두고 $A$만 변환하면 시스템이 바뀐다.

</details>
</div>

## 더 공부할 자료
{: id="further-learning"}

- [Householder 원문](https://web.stanford.edu/class/cme324/classics/householder.pdf): 339–340쪽의 삼각화 문제와 벡터 구성, 341쪽의 직사각형과 최소제곱 연결을 읽는다. 복소 표기와 부호 선택은 이 실수 유도와 다르다.
- [ALAFF: Householder transformation](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html): 본문 유도와 함께 거울 기하와 상쇄를 공부한다.
- [LAPACK: DLARFG](https://netlib.org/lapack/explore-html/d8/d0d/group__larfg_gadc154fac2a92ae4c7405169a9d1f5ae9.html): 라이브러리의 반사 표현, 영꼬리 처리와 작은 입력 재조정을 살핀다.

## 관련 문서
{: id="related-pages"}

- [QR 분해]({{ '/wiki/linear-algebra/qr-factorization-ko/' | relative_url }})
- [Gram–Schmidt 직교화]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/' | relative_url }})
- [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})
- [벡터 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }})
- [행렬 노름]({{ '/wiki/linear-algebra/matrix-norm-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. Householder, A. S. (1958). *Unitary Triangularization of a Nonsymmetric Matrix*. Journal of the ACM, 5(4), 339–342. [DOI](https://doi.org/10.1145/320941.320947); [Stanford 제공 원문](https://web.stanford.edu/class/cme324/classics/householder.pdf).
2. van de Geijn, R. A., Myers, M. *Advanced Linear Algebra: Foundations to Frontiers*. [§3.3.2, Householder transformation](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html).
3. LAPACK. [DLARFG: generate a real elementary reflector](https://netlib.org/lapack/explore-html/d8/d0d/group__larfg_gadc154fac2a92ae4c7405169a9d1f5ae9.html). 루틴 명세와 소스.
4. Anderson, E., 외 (1999). *LAPACK Users' Guide*, 제3판. [Representation of Orthogonal or Unitary Matrices](https://www.netlib.org/lapack/lug/node128.html), [블록 QR](https://www.netlib.org/lapack/lug/node69.html), [고유·SVD 문제 축소](https://www.netlib.org/lapack/lug/node70.html).
