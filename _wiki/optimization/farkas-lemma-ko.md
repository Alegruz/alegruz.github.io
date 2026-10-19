---
title: Farkas 보조정리
subject: Optimization
lang: ko
translation_key: wiki-optimization-farkas-lemma
description: 선형 부등식들을 비음수 가중합하여 불가능한 생산 목표의 모순 증명서를 만듭니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: ba497b89698a32373449eeacdc5e1be79cb3e91d5ad4efc11193e6118c20a2da
interactive_examples: true
---

## 문제: 부등식을 만족시킬 수 없음을 증명하기
{: id="the-problem-prove-that-inequalities-cannot-be-satisfied"}

실행가능점은 좌표를 대입해 모든 제약을 확인함으로써 해의 존재를 증명한다. 점을 못 찾았다고 부재가 증명되지는 않는다. **Farkas 보조정리**는 제약들의 가중결합에서 모순을 만드는 증거를 준다. 이 가중치는 직접 검증할 수 있는 **실행불가능성 증명서**이다. [Farina 강의 6, §L6.2](https://www.mit.edu/~gfarina/2025/67220s25_L06_farkas/L06.pdf#page=3).

Farkas의 1902년 *Theorie der einfachen Ungleichungen*(단순 부등식 이론)의 [검증한 출판 기록](https://geodesic.mathdoc.fr/item/JRAM_1902__124_149129/)은 124권 1–27쪽이다. 영문판 작성 시 연결된 기록에서 원문 전문에 접근할 수 없어 수치 예제나 특정 응용을 그 논문에 돌리지 않는다. 현대적 질문은 **선형 부등식에서 무엇을 추론하고 불가능한 요구를 어떻게 드러내는가?**이다.

주요 계산은 [선형계획법]({{ '/wiki/optimization/linear-programming-ko/' | relative_url }})의 Kantorovich 1939년 생산 자료이다. 후대 응용이지 Farkas 원래 수치 작업의 복원이 아니다. 일반 정리 전에 증명서를 유도한다.

## 출판 기계 자료와 가상 목표
{: id="published-machine-data-hypothetical-production-target"}

Kantorovich 예제 1은 부품 I·II 하나씩인 완제품을 최대화하는 시간 배분을 묻는다. 표 1의 생산율은 실제 공장 관측이 아닌 설명용이라고 명시된다. [영문 번역 369–370쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=4).

| 기계군 | 가용 기계·일 | 기계·일당 부품 I | 기계·일당 부품 II |
| --- | --- | --- | --- |
| 밀링 | 3 | 10 | 20 |
| 터릿 | 3 | 20 | 30 |
| 자동 터릿 | 1 | 30 | 80 |

계산은 현대적 재유도이다. 시간은 분할 가능하고 생산율은 일정·가산이며 준비비용은 없다. 분수 출력은 일일 생산율이지 정수 일정은 아니다. 출판 용량·생산율을 유지하고 하루 $q$세트라는 **가상 목표**를 도입한다. 기계 시간은 모두 쓰되 잉여 부품은 허용한다. LP의 정확 출력 일치와 다르지만 아래 실행가능 증거는 두 출력이 같다.

각 군의 부품 I 시간을 $m,t,a$라 두면 나머지 $3-m,3-t,1-a$는 부품 II 시간이다. 따라서

$$
P=10m+20t+30a,\qquad
Q=230-20m-30t-80a.
$$

적어도 $q$세트를 얻으려면 $P\ge q,Q\ge q$가 필요하다. 모두 상한 부등식으로 쓰면

$$
\begin{aligned}
-10m-20t-30a&\le-q, &\quad &(1)\\
20m+30t+80a&\le230-q, &&(2)\\
m&\le3, &&(3)\\
t&\le3, &&(4)\\
a&\le1, &&(5)\\
-m&\le0, &&(6)\\
-t&\le0, &&(7)\\
-a&\le0. &&(8)
\end{aligned}
$$

### 목표를 모순으로 바꾸기
{: id="turn-the-target-into-a-contradiction"}

행 (1),(2),(4),(8)에 $2,1,10,20$, 나머지에 0을 곱한다. 비음수 가중치는 부등호 방향을 보존한다. 왼쪽을 더하면

$$
2(-10m-20t-30a)+(20m+30t+80a)+10t+20(-a)=0.
$$

오른쪽을 더하면

$$
2(-q)+(230-q)+10(3)+20(0)=260-3q.
$$

따라서 모든 실행가능 계획은 다음을 만족해야 한다.

$$
0\le260-3q.
$$

가상 목표 $q=90$이면 불가능한 $0\le-10$이다. 증명서는 행 가중치 벡터

$$
y=(2,1,0,10,0,0,0,20)^T.
$$

모든 결정변수가 상쇄되어 음의 나머지만 확인하면 된다. 일정을 전수 탐색할 필요가 없다. 0인 가중치는 이 증명에 불필요한 행도 알려 주지만 다른 문제에서도 무관하다고 주장하지는 않는다.

$q=260/3$에서는 $0\le0$으로 모순이 아니다. 실제로

$$
(m,t,a)=\left(\frac83,3,0\right)
\quad\Longrightarrow\quad
P=Q=\frac{260}{3}.
$$

배분은 모든 시간 제한과 $0\le q\le260/3$인 목표를 만족하며 가중 모순은 더 큰 모든 목표를 배제한다. 정확 경계는 표 1의 연속 계산이지 Kantorovich가 이 분수를 인쇄했다는 주장이 아니다.

### 목표와 증명서 탐구
{: id="explore-the-target-and-its-certificate"}

{% include wiki-lab-ko.html kind="farkas" title="출판 기계 자료로 생산 목표 시험" source_url="https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=4" source_label="Kantorovich, 예제 1·표 1, 369쪽" plot_description="목표 출력과 달성 가능한 일일 생산율 260/3을 비교한다." %}

막대는 기계·일이 아닌 **하루당 완제품 세트**이다. 생산율·용량은 고정이고 목표 변경은 행렬·가중치를 유지하며 오른쪽 항 $b$를 바꾸는 가상 실험이다. JavaScript가 없어도 위 $q=90$과 정확 경계 계산을 읽을 수 있다.

## 일반 명제: 양자택일 정리
{: id="general-statement-a-theorem-of-alternatives"}

$A\in\mathbb R^{r\times n}$의 각 행은 제약, $b\in\mathbb R^r$는 상한이고 $x\in\mathbb R^n$은 양·음 어느 부호도 가능한 **비제한** 벡터이다. 벡터 부등식은 성분별이다.

다음 중 정확히 하나가 성립한다.

1. $Ax\le b$인 $x$가 존재한다.
2. $y\ge0$, $A^Ty=0$, $b^Ty<0$인 $y\in\mathbb R^r$가 존재한다.

Farkas 보조정리의 부등식 형태이다. [Farina 정리 L6.1](https://www.mit.edu/~gfarina/2025/67220s25_L06_farkas/L06.pdf#page=3). 전치 $A^T$는 행·열을 바꾸고 $A^Ty$는 가중합 뒤 남은 계수이다. 스칼라 $b^Ty=\sum_i b_iy_i$는 결합한 오른쪽 항이다.

둘 다 성립할 수 없는 이유는 비음수 가중치가

$$
0=(A^Ty)^Tx=y^TAx\le y^Tb<0.
$$

중요한 존재 주장은 역방향이다. **실행불가능한 모든 유한 비엄격 선형 부등식계에 그런 가중치가 있다.** 특정 후보의 실패는 아무것도 증명하지 않으며 다른 증명서가 필요할 수 있다.

기계 예제의 $x=(m,t,a)^T$는 실제 상·하한이 행에 명시되어 정리 표기에서는 비제한이다. 하한 행을 빼고 암묵적으로 $x\ge0$이라 생각하면 설정이 바뀐다.

## 등식 형태: 비음수 활동이 목표를 만드는가?
{: id="equality-form-can-nonnegative-activities-produce-a-target"}

다른 흔한 형태는 $A\in\mathbb R^{r\times n},b\in\mathbb R^r$에서 정확히 다음 하나이다.

1. 어떤 $x\ge0$에 대해 $Ax=b$이다.
2. 어떤 비제한 $y\in\mathbb R^r$에 대해 $A^Ty\ge0$, $b^Ty<0$이다.

[Goemans 강의 3, 정리 1](https://ocw.mit.edu/courses/6-854j-advanced-algorithms-fall-2008/b23096080e3d2142c3c8337bdcd9d3c7_lect9_19.pdf#page=2). $y$는 비음수일 필요 없다. 둘 다이면 $b^Ty=x^TA^Ty\ge0$이 $b^Ty<0$과 모순이다.

부호 조건은 무엇이 제한되었는지에 달린다.

| 풀 시스템 | 증명서 조건 | 모순 |
| --- | --- | --- |
| $Ax\le b$, 비제한 $x$ | $y\ge0$, $A^Ty=0$ | $0\le b^Ty<0$ |
| $Ax=b$, $x\ge0$ | 비제한 $y$, $A^Ty\ge0$ | $0\le x^TA^Ty=b^Ty<0$ |

상한에 남은 비음수량인 **여유변수** $s$로 $Ax+s=b$, $s\ge0$를 쓰자. 비제한 변수는 $x=u-v$, $u,v\ge0$로 표현한다. 등식 형태는

$$
\begin{bmatrix}A&-A&I\end{bmatrix}
\begin{bmatrix}u\\v\\s\end{bmatrix}=b,
\qquad u,v,s\ge0.
$$

증명서는 $A^Ty\ge0$, $-A^Ty\ge0$, $y\ge0$를 요구한다. 앞 두 조건은 $A^Ty=0$을 강제해 부등식 형태를 복원한다. 위 두 명제로 직접 유도한 대수 계산이다.

## 기하: 원뿔과 분리 직선
{: id="geometry-a-cone-and-a-separating-line"}

$A$의 열을 $a_1,\ldots,a_n$이라 쓰면 등식 형태는 다음이 가능한지 묻는다.

$$
b=x_1a_1+\cdots+x_na_n,\qquad x_j\ge0.
$$

모든 합은 **원뿔** $K$를 이룬다. 비음수 배수도 안에 남으며 두 합의 가중평균도 그런 합이어서 **볼록**이다. 볼록·비음수 결합 차이는 [볼록성의 원뿔·분리]({{ '/wiki/optimization/convexity-ko/' | relative_url }}#cones-and-separation)를 참고하자. $b$가 밖이면 증명서의 선형 측정 $z\mapsto y^Tz$는 원뿔에서 비음수, $b$에서 음수이다.

경계 $y^Tz=0$은 2차원 직선, 고차원 **초평면**으로 목표를 모든 달성 합에서 분리한다. 아래 투영 증명은 [Goemans 강의 3, §1](https://ocw.mit.edu/courses/6-854j-advanced-algorithms-fall-2008/b23096080e3d2142c3c8337bdcd9d3c7_lect9_19.pdf#page=2)을 따른다.

보충용으로 만든 예제로

$$
A=\begin{bmatrix}1&1\\0&1\end{bmatrix},\qquad
b=\begin{bmatrix}0\\1\end{bmatrix}.
$$

달성 벡터 $z=(x_1+x_2,x_2)^T$는 $z_1\ge z_2\ge0$이다. 목표는 $z_1\ge z_2$를 어긴다. $y=(1,-1)^T$로 고르면

$$
A^Ty=(1,0)^T\ge0,\qquad b^Ty=-1<0.
$$

{% include image.html src="/assets/images/wiki/farkas-lemma-cone-ko.svg" alt="양의 가로축과 z2=z1 사이 원뿔은 z1−z2의 비음수 쪽에 있다. 목표 b=(0,1)은 대각 위 바깥이고 최근접 원뿔점 p=(1/2,1/2)이다." caption="만든 보충 예제. 파란 영역은 달성 원뿔 z₁≥z₂≥0이며 대각 점선은 yᵀz=z₁−z₂=0이다. 목표 b는 음수 쪽, p는 최근접 달성점이다." %}

### 바깥점에 항상 증명서가 있는 이유
{: id="why-an-outside-point-always-has-a-certificate"}

유한 개 열의 생성 원뿔은 수렴 수열의 극한을 포함하여 닫혀 있고 이는 최근접점 존재에 필요하다. 각 비음수 표현을 독립 열 부분집합으로 줄여 확인할 수 있다. 종속이면 표현을 바꾸지 않고 한 계수가 0이 될 때까지 조정한다. 부분집합 수가 유한해 부분수열에서는 한 독립 집합이 고정되고 계수들이 비음수 극한으로 수렴한다. 유한원뿔 논증의 직접 확장이다. [Bertsekas의 Farkas–Minkowski–Weyl 정리 (a)](https://www.mit.edu/~dimitrib/Convex_Slides.pdf).

$b\notin K$라 하자. [유클리드 노름]({{ '/wiki/linear-algebra/vector-norm-ko/' | relative_url }})의 최근접점을 $p$라 하고 $y=p-b\ne0$라 두자. 임의 $z\in K$에서 $p+\tau(z-p)$, $0\le\tau\le1$은 $K$ 안에 남는다. 제곱거리는 $\tau=0$에서 최소이므로 오른쪽 미분은 비음수이다.

$$
\left.\frac{d}{d\tau}\|p+\tau(z-p)-b\|_2^2\right|_{\tau=0}
=2(p-b)^T(z-p)\ge0.
$$

따라서 $y^T(z-p)\ge0$이다. 원뿔의 $0,2p$를 대입하면 $y^Tp\le0$, $y^Tp\ge0$으로 $y^Tp=0$이다. 따라서

$$
y^Tz\ge0\quad(z\in K),\qquad
y^Tb=y^T(p-y)=-\|y\|_2^2<0.
$$

각 열이 $K$ 안이므로 $A^Ty\ge0$이다. 첫 대안이 실패하면 둘째가 성립함을 증명했다. 그림의 $p=(1/2,1/2)^T$는 $p-b=(1/2,-1/2)^T$를 주고 두 배 하면 앞의 간단한 증명서이다. 모든 양의 배수도 증명서이다.

## 실행불가능성에서 LP 상한으로
{: id="from-infeasibility-to-lp-bounds"}

비제한 $x$의 실행가능 $Ax\le b$에서 $A^Ty=c$인 비음수 가중치는 선형 목적의 상한을 증명한다.

$$
c^Tx=y^TAx\le y^Tb.
$$

모순 증명서·쌍대 상한의 연결이다. 같은 가중제약 계산에서 남는 계수 벡터만 다르다. [MIT LP 쌍대성](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html).

직접 유도로 이 실행가능계가 $c^Tx\le d$도 함의한다고 하자. 엄격 반대 $c^Tx>d$는 위 비엄격 형태 밖이다. 대신 다음 열들에 등식 형태를 적용한다.

$$
B=\begin{bmatrix}A^T&0\\b^T&1\end{bmatrix},\qquad
h=\begin{bmatrix}c\\d\end{bmatrix}.
$$

$A^Ty=c$, $b^Ty+s=d$인 $y,s\ge0$가 없다면 정리는 다음 $(u,\alpha)$를 준다.

$$
Au+\alpha b\ge0,\quad\alpha\ge0,\quad c^Tu+\alpha d<0.
$$

$\alpha>0$이면 $x=-u/\alpha$가 $Ax\le b$를 만족하지만 $c^Tx>d$이다. $\alpha=0$이면 실행가능 $x_0$에서 $x_0-tu$는 $t\ge0$에 실행가능하고 $c^Tu<0$라 목적이 무한히 증가한다. 둘 다 상한과 모순이므로 가중치가 있다. **실행가능성은 중요하다.** 빈 시스템은 모든 부등식을 공허하게 함의한다.

원문제 $x\ge0$에서는 보통 쌍대 상한 조건이 등식 대신 $A^Ty\ge c$이다. [선형계획법]({{ '/wiki/optimization/linear-programming-ko/' | relative_url }})은 원·쌍대와 최적성 증명서를 전개한다. Farkas는 바탕의 양자택일을 주며 강한 쌍대성에는 최적값·달성 논증도 필요하다. [쌍대성]({{ '/wiki/optimization/duality-ko/' | relative_url }}#why-lp-bounds-can-meet-a-proof-through-farkas-lemma)은 위 상한 논증과 유한원뿔 닫힘으로 증명을 마치고 비선형으로 확장한다.

## 조건과 흔한 실수
{: id="conditions-and-common-mistakes"}

아래는 역사 자료가 아닌 만든 보충 반례·추론이다.

- **엄격히 음의 나머지를 유지한다.** $x\le1,-x\le-1$에 $(1,1)$을 주면 $0\le0$이다. $x=1$이 해이므로 $b^Ty<0$를 $\le0$로 바꾸면 거짓 증명서이다.
- **상한 부등식에 음의 가중치를 허용하지 않는다.** $x\le1,x\le2$에 $(1,-1)$을 주면 계수는 상쇄되고 $b^Ty=-1$이지만 $x=0$이 해이다. 둘째에 $-1$을 곱하면 부등호가 뒤집히므로 두 상한처럼 더하면 안 된다.
- **실패한 후보는 실행가능 증거가 아니다.** $x\le0,-x\le-1$에서 $(1,0)$은 상쇄에 실패하지만 $(1,1)$은 성공한다. 정리는 존재를 보장하지 임의 시도의 성공을 보장하지 않는다.
- **실수·정수 실행가능성은 다르다.** $x=1/2$는 실수 해지만 정수 해는 없다. 실수변수 정리는 정수 제약만의 장애에 이런 증명서를 줄 수 없다.
- **전체 모델·산술을 확인한다.** 부동소수점 잔차가 거의 0인 것은 정확 상쇄가 아니다. 원래 계수·부호와 비교하자. 본문의 분수로 증명서를 대수적으로 확인할 수 있다.

## 연습: 증명서 구성과 해석
{: id="practice-construct-and-interpret-certificates"}

직접 만든 문제이다. 힌트·풀이 전에 시도하자.

### 1. 손계산: 두 변수 상쇄
{: id="1-hand-calculation-cancel-two-variables"}

비제한 $u,v$에서 $u+v\le1,-u\le-1,-v\le-1$이 동시 성립하지 않음을 보이라. $A,b,y$와 모든 조건을 확인하라.

<details markdown="1">
<summary>힌트</summary>

세 행에 같은 가중치를 준다.

</details>

<details markdown="1">
<summary>풀이</summary>

$A=\begin{bmatrix}1&1\\-1&0\\0&-1\end{bmatrix}$, $b=(1,-1,-1)^T$, $y=(1,1,1)^T$이다. $y\ge0$, $A^Ty=(0,0)^T$, $b^Ty=-1$이며 합은 $0\le-1$이다.

</details>

### 2. 해석: 증명서가 작동하지 않는 때
{: id="2-interpretation-when-a-certificate-stops-working"}

기계 문제의 $q=80$에서 표시된 증명서는 무엇을 말하는가? 비음수 나머지가 실행가능성을 증명하는가? 별도 증거를 제시하라.

<details markdown="1">
<summary>힌트</summary>

모순 실패와 실제 배분을 구별한다.

</details>

<details markdown="1">
<summary>풀이</summary>

나머지 $260-3(80)=20$이라 이 가중치는 모순을 주지 않으며 이것만으로 실행가능하지는 않다. $(8/3,3,0)$이 시간 제한을 지키며 두 부품을 각각 $260/3\ge80$ 생산하므로 실행가능성을 증명한다.

</details>

### 3. 논리: 부재를 해로 바꾸기
{: id="3-logical-reasoning-turn-nonexistence-into-a-solution"}

$Ax=b,x\ge0$에서 $A^Ty\ge0$인 모든 $y$가 $b^Ty\ge0$도 만족한다. 무엇이 따르며 왜 존재 주장이 필요한가?

<details markdown="1">
<summary>힌트</summary>

배제된 대안이 무엇인지 묻는다.

</details>

<details markdown="1">
<summary>풀이</summary>

실행불가능 증명서가 없으므로 비음수 해가 존재해야 한다. 두 대안의 양립 불가만으로는 부족하다. 그것은 이미 해가 있을 때 증명서만 배제한다. 정리는 한 대안이 항상 존재함도 보장한다.

</details>

### 4. 응용: 불가능한 재료 혼합
{: id="4-application-an-impossible-ingredient-blend"}

가상 혼합이 두 사료 $u,v\ge0$킬로그램을 쓴다. 성분은 $2u+v$단위이며 $u\le2,v\le1$, 수요 $2u+v\ge6$이다. 비음수 행까지 포함한 상한형 증명서를 주라. 수요가 5이면?

<details markdown="1">
<summary>힌트</summary>

가용량 상한을 가중해 성분 계수를 재현한다.

</details>

<details markdown="1">
<summary>풀이</summary>

행을 $u\le2,v\le1,-2u-v\le-6,-u\le0,-v\le0$으로 둔다. $y=(2,1,1,0,0)^T$는 비음수로 두 변수를 없애 $0\le4+1-6=-1$을 준다. 수요 5에서는 나머지가 0이고 $(2,1)$이 정확히 만족한다. 일부 행을 무시해도 전체 시스템의 증명서일 수 있다.

</details>

## 참고문헌과 추가 학습
{: id="references-and-further-learning"}

- [Julius Farkas, Theorie der einfachen Ungleichungen (1902) 서지](https://geodesic.mathdoc.fr/item/JRAM_1902__124_149129/): 제목·저자·권·1–27쪽을 확인했다. [출판사·DOI](https://doi.org/10.1515/crll.1902.124.1). 기록은 역사 수치 예제를 검증하지 않으며 작성 시 전문을 이용할 수 없었다.
- [Kantorovich, Mathematical Methods of Organizing and Planning Production, 예제 1·표 1, 369–370쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=4): 출판 생산율·문제의 출처이다. 90세트 목표와 증명서는 현대 계산이다.
- [Gabriele Farina, MIT Nonlinear Optimization 강의 6 (2025), §L6.2](https://www.mit.edu/~gfarina/2025/67220s25_L06_farkas/L06.pdf#page=3): 부등식 증명서와 분리의 쉬운 설명.
- [Michel Goemans, MIT Advanced Algorithms 강의 3 (2001년 9월 19일), §§1–2](https://ocw.mit.edu/courses/6-854j-advanced-algorithms-fall-2008/b23096080e3d2142c3c8337bdcd9d3c7_lect9_19.pdf#page=2): 등식·부등식 형태, 투영 증명과 LP 쌍대성의 다음 단계. 기록에는 표지가 추가되지만 강의 날짜는 2001년이다.
- [Dimitri Bertsekas, Convex Analysis and Optimization 슬라이드](https://www.mit.edu/~dimitrib/Convex_Slides.pdf): Farkas–Minkowski–Weyl 부분에서 유한원뿔 닫힘과 기하 형태를 읽는다.
- [MIT 6.854 LP 쌍대성](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html): 불가능 증명서에서 목적 상한·강한 쌍대성으로 나아간다.
