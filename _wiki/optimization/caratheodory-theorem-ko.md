---
title: 카라테오도리 정리
subject: Optimization
interactive_examples: true
description: 카라테오도리의 푸리에 계수 문제에서 출발하여 가중치를 소거하는 구성적 증명으로 볼록결합을 최대 d + 1개의 점으로 줄입니다.
last_modified_at: 2026-10-20
lang: ko
translation_key: wiki-optimization-caratheodory-theorem
translation_status: complete
translation_source_sha256: 97baed8f5860e0b77cfc2c7723df95daa347a8311b5a75bd8839ef013be4bfcf
---

## 문제: 평균 하나에 몇 개의 점이 필요한가?
{: id="the-problem"}

평균의 좌표가 두 개뿐이어도 혼합에 수백 개의 점을 사용할 수 있다. **카라테오도리 정리(Caratheodory’s theorem)**에 따르면, 그중 최대 세 개의 점에 새로운 음이 아닌 가중치를 주어 같은 평균을 만들 수 있다. $\mathbb R^d$에서 상한은 $d+1$이다. 이 문서는 **볼록껍질 정리**를 다룬다. 카라테오도리의 이름이 붙은 다른 정리들은 별개의 문제에 관한 것이다. 현대적 서술은 [Bertsekas, *Convex Optimization Theory*, §1.2, 명제 1.2.1](https://web.mit.edu/dimitrib/www/Convex_Theory_Short_View.pdf#page=31)을 참고하자.

**볼록결합(convex combination)**은 유한한 가중평균으로, 가중치가 음이 아니고 합이 1이다. **볼록껍질(convex hull)** $\operatorname{conv}(S)$는 $S$의 점들로 만드는 모든 볼록결합의 집합이다. 선분과 혼합의 관계는 [볼록성]({{ '/wiki/optimization/convexity-ko/' | relative_url }})에서 복습할 수 있다.

## 푸리에 계수가 기하학 문제가 되다
{: id="fourier-coefficients"}

카라테오도리의 1911년 논문은 원판에서 양의 값을 가지는 조화함수의 계수가 어떤 값을 가질 수 있는지 연구한다. **조화함수(harmonic function)**는 라플라스 방정식을 만족한다. 여기서는 경계에서의 거동에 제약받는 매끄러운 장으로 생각하면 충분하다. 원문의 정규화와 계수 곡선은 다음과 같다.

$$
U(r,\theta)=\frac12+\sum_{k=1}^{\infty}r^k(a_k\cos k\theta+b_k\sin k\theta),
\qquad 0\le r<1,
$$

$$
c_n(\phi)=(\cos\phi,\sin\phi,\ldots,\cos n\phi,\sin n\phi)\in\mathbb R^{2n}.
$$

이제 문제는 이 곡선의 볼록껍질에 관한 것이 된다. 원문의 서론은 이 설정을 제시하고, §I.9는 질량중심을 이용해 차원에 1을 더한 상한을 유도한다. 해당 내용은 [Nicholas J. Williams의 영문 번역, 서론과 §I.9(원문 193–195, 200–201쪽)](https://nchlswllms.github.io/translations/cc1911.pdf#page=1)으로 확인했으며, [출판사 기록](https://link.springer.com/article/10.1007/BF03014795)에서 출판 정보를 확인했다. 아래 전개는 역사적 증명의 복제가 아니라 현대적 표기와 계산이다. 원문은 수치 자료가 아닌 기호로 표현된 문제를 제시한다. 여기서 선택한 수치 가중치는 보충 예제로 명시한다.

왜 평균이 등장할까? 다음은 현대적으로 구성한 설명이다. 각 각도 $\phi$에 대해 등비급수 항등식으로 양의 함수를 정의하자.

$$
P_\phi(r,\theta)=\frac{1-r^2}{2(1-2r\cos(\theta-\phi)+r^2)}
=\frac12+\sum_{k=1}^{\infty}r^k\cos\bigl(k(\theta-\phi)\bigr).
$$

$r<1$에서 분모는 양수이다. $\cos(k\theta-k\phi)$를 전개하면 계수는 $a_k=\cos k\phi$, $b_k=\sin k\phi$이다. 가중치 $\lambda_i\ge0$, $\sum_i\lambda_i=1$로 이 함수들을 혼합하면 양수성과 상수항 $1/2$이 유지된다. 처음 $2n$개 계수는

$$
q=(a_1,b_1,\ldots,a_n,b_n)=\sum_{i=1}^{m}\lambda_i c_n(\phi_i).
$$

따라서 기하학적 질문은 구체적이다. **더 적은 구성 함수로 이 계수들을 유지할 수 있는가?** 일반 정리에 따르면 이러한 유한 혼합에는 최대 $2n+1$개의 각도가 있으면 충분하다. 보존되는 것은 처음 $2n$개 계수이다. 더 높은 차수의 계수가 바뀔 수 있으므로 함수 전체가 같다는 뜻은 아니다. 원문의 계수 곡선을 사용하지만 이 일반 상한이 그 특별한 곡선에서 최선이라고 주장하지는 않는다.

### 첫 번째 계수 쌍 계산하기
{: id="first-coefficient-pair"}

$n=1$이면 곡선은 단위원이다. 원하는 계수 쌍을 $q=\rho(\cos\alpha,\sin\alpha)$, $0\le\rho\le1$로 쓰자. 직접 계산하면

$$
q=\frac{1+\rho}{2}c_1(\alpha)+\frac{1-\rho}{2}c_1(\alpha+\pi).
$$

가중치 합은 1이며, 원 위의 서로 반대인 점들이 상쇄되어 반지름 $\rho$를 만든다. $\rho=0$에서는 두 가중치가 같고, $\rho=1$에서는 둘째 가중치가 0이다. 이 자체 유도는 닫힌 단위원판의 모든 계수 쌍에 대해 최대 두 각도로 양의 함수를 구성한다. 평면에서의 일반 상한인 세 개는 충분하지만 항상 그만큼 필요하지는 않다. **원 전체를 사용할 수 있다는 점이 중요하다.** 허용된 각도가 유한한 목록뿐이라면 위의 두 각도를 선택하지 못할 수 있다.

또한 원판 안의 계수 쌍이라 해도 잘라낸 식 $1/2+r(a_1\cos\theta+b_1\sin\theta)$ 자체가 양수인 것은 아니다. $(a_1,b_1)=(1,0)$이면 $r=3/4$, $\theta=\pi$에서 음수이다. 위에서 구성한 양의 함수는 더 높은 차수의 항들을 유지한다.

## 점을 움직이지 않고 가중치 하나 없애기
{: id="remove-one-weight"}

다음은 원문의 $n=1$ 곡선 위에서 **직접 만든 보충 수치 예제**이다. 사용 가능한 각도를 $0,\pi/2,\pi,3\pi/2$로 제한하면

$$
A=(1,0),\quad B=(0,1),\quad C=(-1,0),\quad D=(0,-1).
$$

선택한 초기 가중치는

$$
\lambda=(3/8,3/8,1/8,1/8),\qquad
q=\tfrac38A+\tfrac38B+\tfrac18C+\tfrac18D=(1/4,1/4).
$$

서로 반대인 두 점 쌍의 중점이 같으므로 $A-B+C-D=0$이다. 계수 $(1,-1,1,-1)$의 합도 0이다. 가중치에서 이 관계의 $t$배를 빼자.

$$
\lambda(t)=(3/8-t,\ 3/8+t,\ 1/8-t,\ 1/8+t).
$$

가중치 합과 $q$는 바뀌지 않는다. $t$를 0부터 늘리면서 모든 가중치를 음이 아니게 유지하려면 첫 가중치가 0에 도달할 때 멈춘다.

$$
t_* =\min(3/8,1/8)=1/8,\qquad
\lambda(t_*)=(1/4,1/2,0,1/4).
$$

두 좌표를 확인하면 $q_x=1/4$, $q_y=1/2-1/4=1/4$이다. 양의 가중치를 가진 점이 네 개에서 세 개로 줄었다. $t_*$를 넘어가면 $C$의 가중치가 음수가 되어 볼록결합이 아니게 된다.

{% include image.html src="/assets/images/wiki/caratheodory-reduction-ko.svg" alt="동일한 두 좌표 그림에 원 위의 네 점 A, B, C, D와 (1/4,1/4)에 고정된 목표 q가 있다. 처음에는 네 가중치가 모두 양수이다. 축소 후 C의 가중치는 0이고 삼각형 ABD가 q를 포함한다." caption="원문의 계수 곡선 위에 보충용 가중치를 선택했다. 주황 목표는 (1/4, 1/4)에 고정되고 파란 영역은 네 점의 마름모에서 삼각형 ABD로 바뀐다. 테두리만 있는 점은 가중치가 0이다. 두 그림의 축척은 같다." %}

### 가중치 이동 탐색하기
{: id="explore-weight-transfer"}

{% include wiki-lab-ko.html kind="caratheodory" title="평균을 유지하면서 혼합 줄이기" plot_description="고정된 원 위의 네 점과 아핀 가중치 이동 동안의 가중평균." %}

원과 네 각도는 고정된다. 입력 질량은 가중치로 정규화되며 물리적 단위는 없다. 슬라이더는 입력 가중치에서 시작하여 $(1,-1,1,-1)$ 방향으로 첫 가중치가 0이 될 때까지 움직인다. 질량 변경은 가상 예제를 만든다. **보충 예제 가중치 복원**을 누르면 $(3,3,1,1)$과 진행률 0으로 돌아간다. 같은 질량을 시험하면 두 가중치가 동시에 사라진다. 질량 하나를 0으로 두면 이미 최대 세 개의 점만 사용한다. 모든 질량이 0이면 가중평균이 없으므로 거부한다. JavaScript 없이도 위 계산과 정적 그림을 볼 수 있다.

## 정리와 구성적 증명
{: id="theorem-and-proof"}

비어 있지 않은 $S\subseteq\mathbb R^d$와 $q\in\operatorname{conv}(S)$를 생각하자. 그러면 $p_1,\ldots,p_r\in S$와 다음 조건을 만족하는 가중치가 존재한다.

$$
q=\sum_{i=1}^{r}\lambda_i p_i,\qquad
\lambda_i\ge0,\qquad \sum_{i=1}^{r}\lambda_i=1,\qquad r\le d+1.
$$

$S$는 무한집합, 비볼록집합, 닫히지 않은 집합이어도 된다. 볼록껍질에 속한다는 가정 자체가 **유한한** 결합을 제공한다. 정리와 관련된 원뿔 버전은 [Bertsekas, 명제 1.2.1과 증명, 20–22쪽](https://web.mit.edu/dimitrib/www/Convex_Theory_Short_View.pdf#page=30)에 있다. 아래는 가중치 소거 논증을 상세하게 전개한 것이다.

### 아핀 종속 관계 찾기
{: id="affine-dependence"}

유한한 표현 하나에서 시작하여 가중치가 0인 점을 버리자. 양의 가중치가 $m>d+1$개 남았다고 하자. 각 점에 마지막 좌표 1을 붙인다.

$$
\widetilde p_i=\begin{pmatrix}p_i\\1\end{pmatrix}\in\mathbb R^{d+1}.
$$

열 수가 좌표 수보다 많으므로 이 열들은 선형종속이다. 따라서 영벡터가 아닌 $\alpha$가 존재하여

$$
\sum_{i=1}^{m}\alpha_i p_i=0,\qquad \sum_{i=1}^{m}\alpha_i=0.
$$

이것이 **아핀 종속(affine dependence)** 관계이다. 이 방향으로 가중치를 움직이면 표현하는 점과 가중치 합이 모두 유지된다. $\alpha$는 영벡터가 아니면서 합이 0이므로 양수와 음수 성분을 모두 가진다. 덧붙인 좌표는 아핀 종속을 원래 점들 사이의 임의의 선형 관계와 구별해 준다.

### 첫 가중치가 0이 될 때까지 움직이기
{: id="first-zero-weight"}

다음과 같이 정하자.

$$
t_* =\min_{\alpha_i>0}\frac{\lambda_i}{\alpha_i},\qquad
\lambda'_i=\lambda_i-t_*\alpha_i.
$$

$\alpha_i>0$이면 최솟값 선택으로 새 가중치가 음수가 되지 않는다. $\alpha_i\le0$이면 가중치는 줄어들지 않는다. 적어도 한 가중치는 0이 된다. 또한

$$
\sum_i\lambda'_i=\sum_i\lambda_i-t_*\sum_i\alpha_i=1,
\qquad
\sum_i\lambda'_i p_i=q-t_*\sum_i\alpha_i p_i=q.
$$

가중치가 0인 점을 지우고 반복한다. 매 단계에서 적어도 한 점을 제거하므로 처음에 $m>d+1$개의 점을 사용했다면 최대 $m-d-1$단계가 필요하다. 최대 $d+1$개가 남으면 정리가 증명된다. 남은 점들도 아핀 종속이면 더 줄일 수 있다. 아핀 독립인 지지점으로 만드는 도형을 **단체(simplex)**라고 한다. 점, 선분, 삼각형, 사면체와 그 고차원 대응물이다.

수치 구현에서는 열이 $\widetilde p_i$인 행렬의 영공간 벡터를 구하면 된다. 예를 들어 [QR 분해]({{ '/wiki/linear-algebra/qr-factorization-ko/' | relative_url }})를 사용할 수 있다. 거의 종속인 경우에는 계수(rank)를 판단하는 허용오차가 필요하다. 축소 후 비음수성, 가중치 합, 잔차 $\|\sum_i\lambda_i p_i-q\|$를 확인하자. 증명은 정확한 항등식을 주지만 부동소수점 산술에서는 근사적으로 검사한다.

## 상한의 의미와 한계
{: id="meaning-and-limits"}

### 중요한 것은 아핀 차원이다
{: id="affine-dimension"}

**아핀껍질(affine hull)**은 $S$를 포함하는 가장 작은 평행이동된 선형부분공간이다. 그 차원이 $k<d$이면 부분공간 내부의 좌표를 사용하여 같은 증명으로 $k+1$개의 상한을 얻는다. 따라서 $\mathbb R^{100}$의 한 직선 위에 있는 집합에는 최대 두 점이면 충분하다. 원은 각도 매개변수가 하나이지만 아핀껍질은 2차원이다. 따라서 일반 정리의 상한은 세 개이다. 앞의 두 점 공식은 특별한 개선이지 아핀 차원을 계산한 결과가 아니다.

### 상한만큼의 점이 꼭 필요할 수도 있다
{: id="sharpness"}

보충 예제로 $S=\{0,e_1,\ldots,e_d\}$를 생각하자. $e_j$는 $j$번째 좌표만 1이고 나머지는 0인 벡터이다. 다음 점을 택한다.

$$
q=\frac{1}{d+1}(e_1+\cdots+e_d).
$$

각 좌표 때문에 해당 $e_j$의 가중치는 $1/(d+1)$이어야 한다. 가중치 합이 1이어야 하므로 $0$에도 같은 가중치가 필요하다. 따라서 $d+1$개 점이 모두 필요하며, $\mathbb R^d$의 모든 집합에 통하는 더 작은 상한은 없다.

### 존재가 유일성이나 임의의 선택을 뜻하지는 않는다
{: id="nonuniqueness"}

위의 $S=\{A,B,C,D\}$에서 원점은 $(A+C)/2$이면서 $(B+D)/2$이기도 하다. 반면 선택한 $q=(1/4,1/4)$는 삼각형 $ACD$ 밖에 있다. 그 삼각형의 점은 둘째 좌표가 0 이하이기 때문이다. 정리는 적절한 부분집합이 존재한다고 보장할 뿐, 크기가 세 개인 모든 부분집합이 가능하다고 말하지 않는다. 아핀 독립인 하나의 단체를 고정하면 가중치는 유일하지만, 단체의 선택 자체는 유일하지 않을 수 있다.

### 볼록껍질과 닫힌 볼록껍질은 다르다
{: id="closed-hull"}

$S=\{1,1/2,1/3,\ldots\}\subset\mathbb R$라 하자. 점들이 0에 가까워지더라도 모든 유한 볼록결합은 엄격히 양수이다. 따라서 $0$은 극한도 포함하는 **닫힌 볼록껍질(closed convex hull)**에 속하지만 $\operatorname{conv}(S)$에는 속하지 않는다. 정리는 이 점의 유한 표현을 제공하지 않는다. 이 자체 반례는 정확한 소속 가정이 중요한 이유를 보여 준다.

## 응용: 더 작은 혼합으로 측정값 유지하기
{: id="applications"}

항목 $i$의 특성벡터가 $v_i\in\mathbb R^k$이고 유한 확률분포가 합이 1인 가중치 $w_i\ge0$를 준다고 하자. 기대 특성은 $\mu=\sum_iw_iv_i$이다. 특성벡터에 정리를 적용하면 원래 항목 중 최대 $k+1$개만 사용하면서 **기대 특성이 정확히 같은** 분포를 얻는다. 이는 직접적인 따름정리이며, 두 분포가 모든 면에서 같다는 뜻은 아니다.

예를 들어 $E[X]$와 $E[X^2]$를 보존하려면 $v_i=(x_i,x_i^2)$를 사용하므로 원래 값 중 최대 세 개면 충분하다. $E[X]$만 보존하면 최대 두 개면 되지만 분산이 바뀔 수 있다. 비용도 유지해야 한다면 특성을 하나 더 추가하고 차원을 다시 판단해야 한다. 마찬가지로 출력이 선형으로 혼합되고 추가 전환 제약이 없다면, 시분할 일정도 더 적은 가동 모드로 평균 출력벡터를 유지할 수 있다.

원뿔 버전에서는 볼록 가중치 대신 합이 1일 필요가 없는 음이 아닌 계수를 사용한다. $\mathbb R^d$에서 생성된 원뿔의 영벡터가 아닌 점에는 최대 $d$개의 생성벡터면 충분하다. 보통의 선형종속만으로 소거할 수 있기 때문이다. [Bertsekas, 명제 1.2.1(a)](https://web.mit.edu/dimitrib/www/Convex_Theory_Short_View.pdf#page=30)와 음이 아닌 결합으로 도달 가능한 목표를 설명하는 [파르카스 보조정리]({{ '/wiki/optimization/farkas-lemma-ko/' | relative_url }})를 참고하자. 추가 정규화 방정식이 볼록결합 상한에 점 하나가 더 필요한 이유이다.

## 연습문제
{: id="practice"}

아래 문제와 풀이는 직접 만든 학습 예제이다.

### 1. 손계산: 가중치 하나가 사라진다
{: id="exercise-calculation"}

위의 $A,B,C,D$에 가중치 $(2/5,3/10,1/5,1/10)$를 주자. $(1,-1,1,-1)$ 방향으로 줄이고, 멈추는 시간과 축소 전후의 평균을 확인하자.

<details markdown="1">
<summary>힌트</summary>

$A$와 $C$의 가중치만 감소한다. 무엇이든 빼기 전에 둘을 비교하자.
</details>
<details markdown="1">
<summary>풀이</summary>

$$
t_* =\min(2/5,1/5)=1/5,\qquad
\lambda'=(1/5,1/2,0,3/10).
$$

처음에는 $q=(2/5-1/5,3/10-1/10)=(1/5,1/5)$이다. 축소 후에는 $q=(1/5,1/2-3/10)=(1/5,1/5)$이다. 가중치는 여전히 음이 아니고 합은 1이다.
</details>

### 2. 해석: 평면 위의 점들
{: id="exercise-interpretation"}

$\mathbb R^3$의 점들이 평면 $z=5$ 위에 있다. 어떤 상한이 적용되는가? 정리가 유일한 표현을 보장하거나 알고리즘이 정확히 그 개수의 점을 반환하도록 요구하는가?

<details markdown="1">
<summary>힌트</summary>

$(0,0,5)$를 빼고 독립적인 좌표를 세어 보자.
</details>
<details markdown="1">
<summary>풀이</summary>

아핀 차원이 최대 2이므로 최대 세 점이면 충분하다. 한 직선 위의 집합이면 두 점, 서로 다른 점이 하나뿐이면 한 점으로 개선된다. 표현이 유일할 필요는 없고 더 적은 점도 허용된다. 그 평면의 퇴화하지 않은 삼각형 꼭짓점 세 개만 사용 가능한 경우, 내부 점에는 세 개가 필요하다.
</details>

### 3. 논리: 마지막 좌표를 왜 붙이는가?
{: id="exercise-reasoning"}

$p_1=1$, $p_2=2$에 가중치 $(1/2,1/2)$를 주자. 관계 $2p_1-p_2=0$은 선형종속이다. $t>0$에서 $t(2,-1)$를 빼는 것이 증명에 필요한 가중치 이동이 되지 못하는 이유는 무엇인가?

<details markdown="1">
<summary>힌트</summary>

표현되는 수뿐 아니라 새 가중치의 합도 계산하자.
</details>
<details markdown="1">
<summary>풀이</summary>

새 계수 $(1/2-2t,1/2+t)$는 여전히 $3/2$를 표현하지만 합이 1이 아닌 $1-t$이다. $0<t\le1/4$에서는 음이 아니지만 볼록 가중치는 아니다. 정규화하면 표현되는 값이 $(3/2)/(1-t)$로 바뀐다. 좌표를 덧붙인 $(1,1)$과 $(2,1)$은 독립이므로, 이 표현에서 점을 제거하는 영벡터가 아닌 아핀 종속 관계는 없다.
</details>

### 4. 응용: 두 적률 보존하기
{: id="exercise-application"}

$\{0,1,2,3\}$ 위의 균등분포는 평균 $3/2$, 이차 적률 $7/2$를 가진다. 둘을 보존하면서 $\{0,1,3\}$만 사용하는 분포를 구하자. 삼차 적률은 어떻게 되는가?

<details markdown="1">
<summary>힌트</summary>

가중치 $u,v,w$에 대해 $u+v+w=1$, $v+3w=3/2$, $v+9w=7/2$를 풀자.
</details>
<details markdown="1">
<summary>풀이</summary>

두 적률 식을 빼면 $6w=2$이므로 $w=1/3$, $v=1/2$, $u=1/6$이다. 모두 음이 아니다. 삼차 적률은 서로 다르다.

$$
E_{\mathrm{original}}[X^3]=\frac{0+1+8+27}{4}=9,
\qquad E_{\mathrm{reduced}}[X^3]=\frac12+27\cdot\frac13=\frac{19}{2}.
$$

보존한 특성벡터는 $(X,X^2)$이며 $X^3$을 보존하는 제약은 없었다. 두 분포의 분산은 모두 $7/2-(3/2)^2=5/4$이다.
</details>

## 참고 문헌
{: id="references"}

- C. Carathéodory, *Über den Variabilitätsbereich der Fourier’schen Konstanten von positiven harmonischen Funktionen*, **32** (1911), 193–217. [출판사 기록과 DOI](https://link.springer.com/article/10.1007/BF03014795). 원래의 계수 문제가 기하학적 정식화에 동기를 준다.
- [Nicholas J. Williams의 영문 번역](https://nchlswllms.github.io/translations/cc1911.pdf). 계수 곡선은 서론, 원래의 질량중심 논증은 §I.9를 읽자. PDF에 표시된 원문 쪽수는 PDF 뷰어의 페이지 번호와 다르다.
- Dimitri P. Bertsekas, [*Convex Optimization Theory*, §1.2, 19–22쪽](https://web.mit.edu/dimitrib/www/Convex_Theory_Short_View.pdf#page=29). 현대적 볼록껍질·아핀껍질 정의와 정리의 볼록·원뿔 버전 및 증명을 제공한다.
- [볼록성]({{ '/wiki/optimization/convexity-ko/' | relative_url }}), [파르카스 보조정리]({{ '/wiki/optimization/farkas-lemma-ko/' | relative_url }}), [선형계획법]({{ '/wiki/optimization/linear-programming-ko/' | relative_url }}). 볼록 혼합에서 실행불가능성 증명서와 선형 제약 아래의 최적화로 이어지는 자료이다.
