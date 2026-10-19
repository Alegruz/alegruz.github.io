---
title: 쌍대성
subject: Optimization
lang: ko
translation_key: wiki-optimization-duality
description: 실행가능한 생산계획의 값과 모든 계획에 대한 상한을 맞추어 최적성을 증명합니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 8743ea6ae09c87f298adcd948b25b0187082dbce359b0fb0c1731d3de599e5c9
interactive_examples: true
---

## Kantorovich의 생산 문제: 최선임을 어떻게 아는가?
{: id="kantorovichs-production-problem-how-can-we-know-a-plan-is-best"}

실행가능 생산계획은 공장이 무엇을 **할 수 있는지** 증명하지만 더 나은 배분의 부재는 증명하지 않는다. **최적화 쌍대성**은 관련 최적화 문제의 실행가능해로 원래 목적의 상·하한을 인증한다. 원래 문제는 **원문제(primal)**, 한계값 문제는 **쌍대(dual)**이다. LP에서는 [MIT 쌍대성 노트](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html)를 보자.

[선형계획법]({{ '/wiki/optimization/linear-programming-ko/' | relative_url }})은 기계 배분 예제를 유도·해결한다. 여기서는 출판 생산율을 유지하며 **답을 인증할 가중치를 어떻게 고르는가?**를 묻는다. 뒤에서 [Farkas 보조정리]({{ '/wiki/optimization/farkas-lemma-ko/' | relative_url }})로 실행가능하고 유한 최적값인 LP에 증명서가 존재하는 이유를 설명한다.

Kantorovich의 1939년 책은 완제품마다 부품 I·II 하나씩이 필요한 설명용 금속가공 문제로 시작한다. 실제 관측이 아닌 예제 1·표 1의 자료이다. [영문 번역 369–370쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=4).

| 기계군 | 가용 기계·일 | 기계·일당 부품 I | 기계·일당 부품 II |
| --- | --- | --- | --- |
| 밀링 | 3 | 10 | 20 |
| 터릿 | 3 | 20 | 30 |
| 자동 터릿 | 1 | 30 | 80 |

대수는 현대적 재유도이다. 시간은 분할 가능하고 생산율은 일정·가산이며 가용시간을 모두 쓰고 준비비용은 없다. 부품 합계를 정확히 맞춘다. 분수는 일일 생산율이지 정수 일정은 아니다. 표 2는 전문화 합계 86을 보고하지만 표 1의 정확 연속 계산은 $260/3$이다.

부품 I의 기계·일을 $m,t,a$라 두면 나머지는 부품 II 시간이므로

$$
P=10m+20t+30a,\qquad Q=230-20m-30t-80a,
$$

$$
0\le m,t\le3,\qquad 0\le a\le1,\qquad P=Q=z.
$$

원문제는 $z$를 최대화한다. $(m,t,a)=(8/3,3,0)$에서

$$
P=10(8/3)+60=260/3,\qquad Q=230-20(8/3)-90=260/3.
$$

최적값이 **적어도** $260/3$임을 보인다. 등호에는 모든 실행가능 배분에 적용되는 상한이 필요하다.

### 계획 탐색 대신 부품에 값 매기기
{: id="price-the-parts-instead-of-searching-over-plans"}

부품 I에 $\theta$, II에 $1-\theta$를 주고 우선 $0\le\theta\le1$이라 하자. 출력 일치에서

$$
z=\theta P+(1-\theta)Q.
$$

이는 시장가격이 아닌 증명서 계수이다. 밀링 기계·일의 가중 출력은 $10\theta$ 또는 $20(1-\theta)$, 시간을 나누면 둘의 평균이므로 큰 값 이하이다. 각 군에 적용하면

$$
\begin{aligned}
z\le U(\theta)
={}&3\max\lbrace 10\theta,20(1-\theta)\rbrace \\
&+3\max\lbrace 20\theta,30(1-\theta)\rbrace \\
&+\max\lbrace 30\theta,80(1-\theta)\rbrace .
\end{aligned}
$$

3,3,1은 가용 기계·일이고 $U$는 하루 세트 수이다. **어느 가중치도 상한을 주며 쌍대 최적화는 가장 작은 상한을 찾는다.** 원문 부록 I의 해결 승수와 연결되지만 한 매개변수 계산은 상한 역할의 현대적 표현이다. [부록 I §§1–3](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=26).

$\theta=1/2$의 최대 가중 생산율은 $10,15,40$이므로 $U=115$이다. 유효하지만 달성 $86.67$과 상한 115 사이가 남아 결론 내리지 못한다.

밀링이 선호 부품을 바꾸는 지점은

$$
10\theta=20(1-\theta)\quad\Longrightarrow\quad\theta=2/3.
$$

그 가중치에서

$$
U(2/3)=3(20/3)+3(40/3)+80/3=260/3.
$$

계획과 상한이 만났다. 모든 다른 계획과 비교하지 않고 최적성을 증명했다.

### 상한이 조여지는 모습
{: id="see-the-bound-tighten"}

터릿·자동은 $\theta=3/5,8/11$에서 전환한다. 구간마다 더 큰 생산율을 대입해 정확한 조각식을 얻는다.

$$
U(\theta)=
\begin{cases}
230(1-\theta),&0\le\theta\le3/5,\\
140-80\theta,&3/5\le\theta\le2/3,\\
80+10\theta,&2/3\le\theta\le8/11,\\
120\theta,&8/11\le\theta\le1.
\end{cases}
$$

$2/3$까지 감소하고 이후 증가해 그 값이 이 상한족을 최소화한다. 꺾임은 한 기계군에서 두 부품이 동등해지는 곳이다.

{% include image.html src="/assets/images/wiki/optimization-duality-bound-ko.svg" alt="U(theta)는 theta=0의 230에서 2/3의 260/3으로 내려가고 1의 120으로 오른다. 달성 출력 수평선에는 2/3에서만 닿는다." caption="가로축은 정규화 부품 I 가중치, 세로축은 하루 세트 수이다. 곡선은 모든 실행가능 계획의 상한, 수평선은 검증된 (8/3,3,0)의 출력이며 세로 차이는 이 계획의 증명서 간극이다." %}

{% include wiki-lab-ko.html kind="duality" title="생산 증명서의 가중치 선택" source_url="https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=4" source_label="Kantorovich 예제 1·표 1, 369–370쪽" plot_description="부품 I 가중치의 생산 상한과 달성 출력 260/3 비교." %}

0,$1/2$,$2/3$,1을 시도하자. 원래 용량·생산율은 고정이고 가중치 변경은 새 역사 자료가 아닌 가상 증명서 실험이다. 출판 기준 복원은 고정 자료와 유도한 $2/3$으로 돌아간다. 키보드로 입력하거나 두 단추를 사용할 수 있다. JavaScript 없이도 위 조각식·그림·계산이 남는다.

### 가중치족만이 아닌 전체 쌍대 복원
{: id="recover-the-full-dual-rather-than-only-a-family-of-weights"}

기계군 $j$의 부품 $k$ 시간 $h_{jk}\ge0$, 용량 $N_j$, 생산율 $r_{jk}$라 하면 역사 모델은

$$
h_{j1}+h_{j2}=N_j,\qquad \sum_j r_{jk}h_{jk}=z\quad(k=1,2).
$$

$\lambda_1+\lambda_2=1$과 $w_j\ge r_{jk}\lambda_k$를 쓰면

$$
z=\sum_{j,k}\lambda_k r_{jk}h_{jk}
\le\sum_{j,k}w_jh_{jk}=\sum_jN_jw_j.
$$

전체 쌍대는 이 부등식·정규화 아래 $\sum_jN_jw_j$를 최소화한다. 원 제약이 등식이라 $\lambda_k,w_j$의 부호는 비제한이다. 고정 $\lambda=(\theta,1-\theta)$에서 $w_j$ 최소화는 $U$의 최댓값들을 고른다. 실습의 $\theta\in[0,1]$은 전체 허용 가중치의 일부지만 일치 증명서를 포함해 전체 쌍의 최적성을 이미 증명한다. [역사 모델의 전체 쌍대]({{ '/wiki/optimization/linear-programming-ko/' | relative_url }}#write-the-dual-of-the-historical-model-itself).

## 상한을 보존하는 부등식에서 LP 쌍대 구성
{: id="construct-an-lp-dual-by-deciding-which-inequalities-preserve-a-bound"}

자원 모델을 보자.

$$
\begin{aligned}
\text{최대화}\quad &c^Tx\\
\text{제약}\quad &Ax\le b,\quad x\ge0.
\end{aligned}
$$

$x\in\mathbb R^n$은 활동량, $A\in\mathbb R^{r\times n}$은 자원 소비, $b\in\mathbb R^r$는 용량, $c\in\mathbb R^n$은 활동당 이익이다. 전치 $A^T$는 행·열을 바꿔 $(A^Ty)_j$가 활동 $j$의 가중 투입 요구이다.

자원 부등식에 곱해도 방향이 유지되게 $y\ge0$을 고른다. $A^Ty\ge c$도 만족하면 모든 원 실행가능 $x$에

$$
c^Tx\le x^TA^Ty=y^TAx\le y^Tb.
$$

첫 부등식은 $x\ge0$, 마지막은 $y\ge0$을 쓴다. 이 형태의 최소 상한은

$$
\begin{aligned}
\text{최소화}\quad &b^Ty\\
\text{제약}\quad &A^Ty\ge c,\quad y\ge0.
\end{aligned}
$$

이 부등식이 **약한 쌍대성**이며 전치·승수 부호·최적화 방향 반전을 함께 설명한다. [MIT의 Duality와 Rules for Taking Duals](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html).

### 부호 규칙은 상한의 결과이다
{: id="sign-rules-are-consequences-of-the-bound"}

**최대화 원문제·최소화 쌍대**의 대응은

| 원문제 특성 | 대응 쌍대 조건 |
| --- | --- |
| 행 $a_i^Tx\le b_i$ | $y_i\ge0$ |
| 행 $a_i^Tx\ge b_i$ | $y_i\le0$ |
| 행 $a_i^Tx=b_i$ | 비제한 $y_i$ |
| 변수 $x_j\ge0$ | $(A^Ty)_j\ge c_j$ |
| 변수 $x_j\le0$ | $(A^Ty)_j\le c_j$ |
| 비제한 변수 $x_j$ | $(A^Ty)_j=c_j$ |

등식은 어느 부호로도 곱할 수 있다. 비제한 활동은 $x_j$의 양쪽 부호에서도 상한이 유지되어야 하므로 정확 계수 일치가 필요하다. $c^Tx\le b^Ty$ 관례이며 원문제를 최소화하면 규칙도 바뀐다. 역사적 완전 가동과 자원 상한 모델의 다른 승수 부호는 모순이 아니다.

직접 만든 부호 예제로 $x_1+x_2=3,x_1\ge0$, 비제한 $x_2$에서 $x_1+2x_2$를 최대화하자. 쌍대는 $x_1$의 $y\ge1$, $x_2$의 $y=2$ 아래 $3y$ 최소화이다. $y=2$가 $(0,3)$에서 달성되는 6을 인증한다. 등식 승수를 일반적으로 비음수로 강제하면 유효 증명서를 버리고 $x_2$의 쌍대 등식을 생략하면 무효 증명서를 허용한다.

## LP 상한이 만나는 이유: Farkas를 통한 증명
{: id="why-lp-bounds-can-meet-a-proof-through-farkas-lemma"}

**LP 강한 쌍대성:** 자원 원문제가 실행가능하고 최적값이 유한하면 원·쌍대 모두 같은 값을 달성한다. 약한 쌍대성만으로 존재·달성·등가가 증명되지는 않는다. [MIT 설명](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html). 다음은 [Farkas 문서]({{ '/wiki/optimization/farkas-lemma-ko/' | relative_url }})의 닫힌 원뿔·양자택일로 전개한 증명이다.

### 먼저 최선의 원문제 값 달성을 보이기
{: id="first-establish-that-the-best-primal-value-is-attained"}

유한하다고 가정한 $v=\sup\{c^Tx:Ax\le b,x\ge0\}$를 보자. **상한(supremum)**은 최소 상계로 일반적으로 달성되지 않을 수 있다. 다음 집합을 도입한다.

$$
K=\left\lbrace \begin{bmatrix}Ax+s\\c^Tx-t\end{bmatrix}:x\ge0,\ s\ge0,\ t\ge0\right\rbrace .
$$

$s$는 미사용 용량, $t$는 이익에서 빼는 비음수량이다. 열 $(A_j,c_j)$, 벡터 $(e_i,0)$, $(0,-1)$의 유한생성 원뿔이다. $e_i$는 $i$번째 1, 나머지 0이다. 유한생성 원뿔은 수렴 수열의 극한을 포함하는 **닫힌 집합**이다. [Bertsekas 정리 (a), PDF 105쪽](https://www.mit.edu/~dimitrib/Convex_Slides.pdf#page=105).

$c^Tx^{(k)}\to v$인 실행가능 수열을 고르자. $s=b-Ax^{(k)},t=0$으로 $(b,c^Tx^{(k)})\in K$이다. 닫힘으로 $(b,v)\in K$여서 어떤 비음수 $x,s,t$가

$$
Ax+s=b,\qquad c^Tx-t=v.
$$

첫 식은 실행가능성을, 둘째는 $c^Tx\ge v$를 준다. 이미 $v$가 상한이므로 $c^Tx=v,t=0$이다. 근사 수열의 점들이 무한대로 달아나도 원문제 달성이 증명된다.

### 같은 값을 달성하는 쌍대 증명서 보이기
{: id="then-establish-that-a-dual-certificate-attains-the-same-value"}

비제한 $x$에 $Ax\le b,-x\le0$를 합쳐 $Gx\le h$라 쓰면

$$
G=\begin{bmatrix}A\\-I\end{bmatrix},\qquad h=\begin{bmatrix}b\\0\end{bmatrix}.
$$

**비어 있지 않은** 이 시스템의 모든 유효 상한 $c^Tx\le v$에 $G^T\mu=c,h^T\mu\le v$인 $\mu\ge0$가 있다고 주장한다. 등식형 Farkas로 증명하기 위해

$$
\begin{bmatrix}G^T&0\\h^T&1\end{bmatrix}
\begin{bmatrix}\mu\\\rho\end{bmatrix}
=\begin{bmatrix}c\\v\end{bmatrix},\qquad \mu\ge0,\quad\rho\ge0.
$$

해가 없다면 Farkas는 다음 $(u,\alpha)$를 준다.

$$
Gu+\alpha h\ge0,\qquad\alpha\ge0,\qquad c^Tu+\alpha v<0.
$$

$\alpha>0$이면 $x=-u/\alpha$가 $Gx\le h,c^Tx>v$여서 모순이다. $\alpha=0$이면 실행가능 $x_0$에서 $x_0-\tau u$는 모든 $\tau\ge0$에 실행가능하지만 $c^Tu<0$라 목적이 $+\infty$로 가서 모순이다. 따라서 $\mu,\rho$가 있다. [등식 대안]({{ '/wiki/optimization/farkas-lemma-ko/' | relative_url }}#equality-form-can-nonnegative-activities-produce-a-target)을 쓰며 [Farina L6.1](https://www.mit.edu/~gfarina/2025/67220s25_L06_farkas/L06.pdf#page=3)은 부등식 대안이다.

$A,-I$의 행에 따라 $\mu=(y,s)$로 나누면

$$
A^Ty-s=c,\quad y,s\ge0,\quad b^Ty+\rho=v.
$$

따라서 $y$는 쌍대 실행가능하고 $b^Ty\le v$이다. 달성 원 최적점에 약한 쌍대성을 적용하면 $v\le b^Ty$여서 둘이 같아 $b^Ty=v$이다.

Farkas는 상한 계수, 유한원뿔 닫힘은 원문제 달성을 준다. 더 나은 모든 목표를 배제하는 것만으로 최적값 달성까지 설명할 수 없어 둘 다 중요하다.

## 상보적 느슨성: 증명서의 모든 손실 찾기
{: id="complementary-slackness-locate-every-possible-loss-in-the-certificate"}

자원 쌍의 실행가능 $x,y$에서 상한에서 이익을 빼면

$$
b^Ty-c^Tx=y^T(b-Ax)+x^T(A^Ty-c).
$$

왼쪽은 **이 실행가능 쌍의 쌍대 간극**이다. 오른쪽 각 항이 비음수여서 간극 0의 정확 조건은

$$
y_i\bigl(b_i-(Ax)_i\bigr)=0\quad\text{모든 }i,
$$

$$
x_j\bigl((A^Ty)_j-c_j\bigr)=0\quad\text{모든 }j.
$$

**상보적 느슨성**은 양의 자원가격이면 전량 사용, 양의 활동이면 투입가격과 이익 일치를 요구한다. 원·쌍대 실행가능성과 함께 이 LP의 최적쌍을 특징짓는다. [MIT Complementary Slackness](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html).

역사적 완전 가동 모델의 같은 뺄셈은 조금 다르다.

$$
\sum_jN_jw_j-z=\sum_{j,k}h_{jk}\bigl(w_j-r_{jk}\lambda_k\bigr).
$$

$\lambda=(2/3,1/3)$에서 밀링 두 생산율은 $w_M=20/3$으로 같아 시간을 나눌 수 있다. 터릿 II는 I보다, 자동 I는 II보다 가중 출력이 엄격히 작다. 인증 등호는 열등 활동 시간을 0으로 강제한다. 밀링 분할은 부품 총량 일치로 정해진다.

제약이 딱 맞아도 가격이 양수일 필요는 없다. 보충 LP $\max x_1$, $0\le x_1,x_2\le1$의 $(1,1)$은 두 상한을 묶지만 최적 자원가격은 $(1,0)$이다.

## 가중 선형 제약에서 Lagrangian으로
{: id="from-weighted-linear-constraints-to-a-lagrangian"}

기계 증명은 제약에 가중해 상한을 만들었다. 목적·제약이 비선형이어도 같은 구성이 된다. 이제 표준 **최소화** 관례를 써 쌍대 증명서는 **하한**이다.

일반 문제를 다음처럼 쓰자.

$$
p^{\star}=\inf_{x\in X}\lbrace f_0(x):f_i(x)\le0\ (i=1,\ldots,r),\ h_j(x)=0\ (j=1,\ldots,q)\rbrace .
$$

$X$는 $\mathbb R^n$, 비음수 벡터, 이진 선택 등 명시적으로 유지할 정의역이다. $f_i$는 부호 있는 제약 위반으로 $f_i(x)\le0$이면 만족이다. **Lagrangian**은 이를 목적에 넣는다.

$$
L(x,\lambda,\nu)=f_0(x)+\sum_i\lambda_i f_i(x)+\sum_j\nu_jh_j(x),\qquad\lambda\ge0.
$$

$\lambda_i,\nu_j$는 **Lagrange 승수**로 등식 승수 $\nu_j$는 비제한이다. **쌍대함수**는

$$
g(\lambda,\nu)=\inf_{x\in X}L(x,\lambda,\nu).
$$

$L$에 흡수한 제약은 안쪽 최소화에서 제거하지만 $X$의 제한은 남긴다. 모든 원 실행가능 $x$에

$$
g(\lambda,\nu)\le L(x,\lambda,\nu)\le f_0(x).
$$

둘째 부등식은 $\lambda_if_i(x)\le0,h_j(x)=0$에서 나온다. **Lagrange 쌍대문제**는 $\lambda\ge0$, 비제한 $\nu$에서 $g$를 최대화한다. 상한 $d^\star\le p^\star$이다. 안쪽 하한은 $-\infty$일 수도 있어 그런 승수는 유용한 유한 하한을 주지 않는다. 정의·구성은 [Boyd·Vandenberghe 5.2–5.3·5.10](https://web.stanford.edu/class/ee364a/lectures/duality.pdf#page=4)을 따른다.

$g$가 승수에 대해 **오목**인 이유도 보인다. 유한값 둘의 선분 이상에 놓인다. 고정 $x$의 $L$은 승수에 대해 아핀이고 하한을 취하면

$$
g(\eta z_1+(1-\eta)z_2)\ge\eta g(z_1)+(1-\eta)g(z_2),\qquad0\le\eta\le1,
$$

$z$는 승수들을 모은다. 원래 함수의 볼록성은 필요하지 않으며 최선 쌍대 하한과 원값의 일치도 보장하지 않는다.

### 부호표를 외우지 않고 자원 LP 복원하기
{: id="recover-the-resource-lp-without-memorizing-a-sign-table"}

이익을 부호 반전해 $-c^Tx$를 최소화하고 $X=\{x:x\ge0\}$를 유지하며 $Ax-b\le0$을 쌍대화하면

$$
L(x,y)=-c^Tx+y^T(Ax-b)=-b^Ty+(A^Ty-c)^Tx.
$$

$x$의 계수 중 음수가 있으면 그 비음수 좌표를 무한대로 보내 $g(y)=-\infty$이다. 아니면 $x=0$에서 최소여서

$$
g(y)=\begin{cases}-b^Ty,&A^Ty\ge c,\\-\infty,&\text{그 밖의 경우}.
\end{cases}
$$

$-b^Ty$ 최대화와 $b^Ty$ 최소화는 같은 승수이다. $A^Ty\ge c$는 안쪽 최소값이 유한할 조건에서 나오며 목적 부호는 원이익을 처음 반전했기 때문이다.

## 비선형 한계값은 언제 만나는가?
{: id="when-do-nonlinear-bounds-meet"}

**볼록함수**는 선분 값이 끝점 평균 이하이다. 볼록 최적화는 $X,f_0,f_i$가 볼록이고 $h_j$는 아핀이다. [볼록성]({{ '/wiki/optimization/convexity-ko/' | relative_url }})에서 정의·국소→전역 증명·미분 판정을 다룬다. 볼록성만으로 존재·승수의 모든 보장을 주지는 않는다.

충분조건인 **Slater 조건**은 $X=\mathbb R^n$이고 함수가 모든 곳에 유한할 때 모든 부등식에 $f_i(\bar x)<0$, 등식에 $h_j(\bar x)=0$인 점의 존재이다. 원값이 유한하면 $d^\star=p^\star$와 쌍대 최적값 달성을 보장하지만 원 달성 자체는 보장하지 않는다. 일반 정의역은 상대적 내부를 쓴다. [슬라이드 5.13](https://web.stanford.edu/class/ee364a/lectures/duality.pdf#page=15).

### 보충 볼록 예제: 두 해 유도하기
{: id="supplementary-convex-example-derive-both-solutions"}

역사 자료가 아닌 만든 교육 예제이다.

$$
\text{최소화 }(x-2)^2\quad\text{제약: }x\le1,\qquad x\in\mathbb R.
$$

비제약 최소점 2는 금지된다. $x\le1$에서 2에 가장 가까운 $x^\star=1$이 $p^\star=1$을 준다. 엄격 실행가능점 0으로 Slater를 확인한다.

Lagrangian을 만들고 완전제곱을 하면

$$
\begin{aligned}
L(x,\lambda)&=(x-2)^2+\lambda(x-1)\\
&=(x-2+\lambda/2)^2+\lambda-\lambda^2/4.
\end{aligned}
$$

고정 $\lambda\ge0$의 안쪽 최소점은 $x=2-\lambda/2$이며 $x\le1$을 위반해도 된다. 따라서

$$
g(\lambda)=\lambda-\lambda^2/4=1-(\lambda-2)^2/4.
$$

쌍대 최댓값 1은 $\lambda^\star=2$에서 달성된다. 원·쌍대가 만나며 그 승수의 안쪽 최소점도 실행가능 $x=1$이다.

### KKT 조건이 일치점을 설명한다
{: id="kkt-conditions-explain-the-matching-point"}

미분가능 함수와 $X=\mathbb R^n$에서 **Karush–Kuhn–Tucker(KKT)**는 실행가능·상보적 느슨성·정지성을 결합한다.

$$
\begin{aligned}
&f_i(x^{\star})\le0,\qquad h_j(x^{\star})=0,\\
&\lambda_i^{\star}\ge0,\qquad\lambda_i^{\star}f_i(x^{\star})=0,\\
&\nabla f_0(x^{\star})+\sum_i\lambda_i^{\star}\nabla f_i(x^{\star})
+\sum_j\nu_j^{\star}\nabla h_j(x^{\star})=0.
\end{aligned}
$$

$\nabla f$는 1차 미분을 모으며 정지성은 모든 방향의 Lagrangian 1차 미분이 0임이다. 볼록 문제에서 충분조건인 이유는 정지성이 볼록 $L$을 최소화하고 상보성이 그 값과 원목적을 같게 하기 때문이다. Slater 아래 달성 원최적점에는 KKT 승수가 있다. 비볼록에서는 정지성만으로 $L$의 전역 최소가 아니다. [PDF 22–23쪽](https://web.stanford.edu/class/ee364a/lectures/duality.pdf#page=22).

예제의 정지성은 $2(x-2)+\lambda=0$, 상보성은 $\lambda(x-1)=0$이다. $\lambda=0$은 불가능한 $x=2$를 강제하므로 $x=1,\lambda=2$로 직접 계산과 일치한다.

### 양의 간극: 이진 결정이 달성하지 못하는 하한
{: id="a-positive-gap-binary-decisions-leave-a-bound-unattained-by-any-plan"}

둘째 보충 예제를 보자.

$$
\text{최소화 }-x\quad\text{제약: }x\le1/2,\qquad x\in\lbrace 0,1\rbrace .
$$

실행가능점은 0뿐이라 $p^\star=0$이다. 안쪽에 이진 정의역을 남기고 부등식을 쌍대화하면

$$
g(\lambda)=\min\lbrace -\lambda/2,-1+\lambda/2\rbrace ,\qquad\lambda\ge0.
$$

두 아핀식은 $\lambda=1$, $g=-1/2$에서 만난다. 이전에는 둘째가 작고 증가, 이후에는 첫째가 작고 감소한다. 따라서 $d^\star=-1/2$, **최적 쌍대 간극**은 $p^\star-d^\star=1/2$이다.

$0\le x\le1$은 선택을 추가하는 연속 완화이다. $x=1/2$에서 $-1/2$를 달성하지만 실행가능 이진 계획은 못 한다. 이 쌍대 구성의 한계를 직접 확인했다. 모든 비볼록 문제에 양의 간극이 있거나 다른 정식화도 같은 쌍대를 가진다는 주장은 아니다.

## 승수는 요구 완화의 가치를 측정한다
{: id="multipliers-measure-the-value-of-relaxing-a-requirement"}

최대화 자원 LP에서 $V(b)$를 용량 $b$의 최적 이익이라 하자. $y^\star$가 최적이면 $b$만 바뀌어도 쌍대 실행가능하므로

$$
V(b+\Delta b)\le(b+\Delta b)^Ty^{\star}=V(b)+(y^{\star})^T\Delta b.
$$

이는 무조건적 예측이 아닌 상한이며 달성 계획이 있어야 등호이다. [역사 기계 민감도 계산]({{ '/wiki/optimization/linear-programming-ko/' | relative_url }}#what-the-historical-multipliers-say-about-extra-machinery)은 자동시간 가격 $80/3$의 달성 범위를 구한다. $\delta$일 추가에 $m=8/3+(8/3)\delta\le3$이 필요해 기존 전문화는 $\delta=1/8$까지만 된다.

최소화에서 $f_i(x)\le0$을 $f_i(x)\le u_i$로 완화하면 하한은 $g(\lambda,\nu)-\lambda^Tu$이다. 강한 쌍대성과 달성 쌍대 최적점에서

$$
p(u)\ge p(0)-(\lambda^{\star})^Tu.
$$

가치함수가 0에서 미분가능하면 도함수는 $-\lambda^\star$이다. [5.23–5.25](https://web.stanford.edu/class/ee364a/lectures/duality.pdf#page=25). 볼록 이차 예제의 새 제약은 $x\le1+u$이고 $u\le1$에서 최적값 $(1-u)^2$, $u\ge1$에서 0이다. 0의 도함수 $-2$는 $\lambda^\star=2$와 맞는다. 하한 $1-2u$는 접선이지만 정확 값에는 제약이 비활성화할 때까지 $u^2$도 있다.

## 연습문제
{: id="practice-problems"}

직접 만든 문제·풀이이다. 첫 둘은 Kantorovich 생산율, 나머지는 보충 모델이다.

### 1. 손계산: 최적이 아닌 증명서 확인
{: id="1-hand-calculation-check-a-nonoptimal-certificate"}

역사 모델에서 $\theta=3/5$의 세 $w_j$, 상한과 검증 계획 대비 간극을 구하라. 어느 군의 부품들이 동등한가?

<details markdown="1">
<summary>힌트</summary>

각 행의 두 가중 생산율에서 큰 값을 고른 뒤 가용 기계·일을 곱한다.

</details>

<details markdown="1">
<summary>풀이</summary>

밀링은 6·8, 터릿은 12·12, 자동은 18·32로 $w=(8,12,32)$, $U=3(8)+3(12)+32=92$이다. 간극은 $92-260/3=16/3$세트/일이다. 터릿만 동률이다. 동률은 이 증명서와 혼합이 양립함이지 증명서 최적성은 아니다.

</details>

### 2. 해석: 실행가능 쌍대로 생산계획을 복원하는가?
{: id="2-interpretation-does-a-feasible-dual-recover-a-production-plan"}

계획자가 $\theta=1$을 골라 각 군에 가중 생산율이 큰 부품을 만들라 한다. 원래 일치 문제를 푸는가? 무엇을 실제 증명하는가?

<details markdown="1">
<summary>힌트</summary>

부품 합계를 비교하고 $U$ 안의 최대화는 일치 요구를 없앴음을 기억하자.

</details>

<details markdown="1">
<summary>풀이</summary>

모두 I를 만들어 $P=120,Q=0$으로 $P=Q$에 실패한다. $U(1)=120$은 여전히 유효 상한이지만 완화값을 달성하는 독립 기계 선택은 원 실행가능 계획이 아니다. 최적 가중치의 밀링 동률에서는 분할로 합계를 맞출 수 있다.

</details>

### 3. 논리: 쌍대 최적점 없이 강한 쌍대성이 가능한가?
{: id="3-logical-reasoning-can-strong-duality-hold-without-a-dual-optimizer"}

$x\in\mathbb R$, $x^2\le0$의 $\min x$에서 원값·쌍대함수를 구하라. Slater, 유한 최적 승수나 KKT 쌍은 있는가?

<details markdown="1">
<summary>힌트</summary>

$\lambda>0$에서는 $x+\lambda x^2$를 완전제곱하고 $\lambda=0$은 따로 다룬다.

</details>

<details markdown="1">
<summary>풀이</summary>

0만 실행가능해 $p^\star=0$이다. $\lambda>0$에서

$$
x+\lambda x^2=\lambda\left(x+\frac1{2\lambda}\right)^2-\frac1{4\lambda},
$$

$g(\lambda)=-1/(4\lambda)$이고 $g(0)=-\infty$이다. $\lambda\to\infty$의 상한은 0이지만 유한 승수로 달성하지 않는다. 즉 쌍대 달성 없이 $d^\star=p^\star=0$이다. $x^2<0$ 불가능으로 Slater는 실패하며 유일 실행가능점의 정지식 $1+2\lambda(0)=0$도 불가능하다. Slater 실패는 양의 간극을 증명하지 않고 충분 보장을 없앨 뿐이다.

</details>

### 4. 응용: 자원 요구에 값 매기기
{: id="4-practical-application-value-a-resource-requirement"}

분할 가능한 활동 $a,b\ge0$의 서비스는 $2a+b$, 이차 노력은 $a^2+b^2$이다. $q>0$ 이상 서비스에 필요한 노력을 최소화하라. 쌍대와 최적 배분을 구하고 수요 증가의 한계 노력으로 승수를 해석하라.

<details markdown="1">
<summary>힌트</summary>

$q-2a-b\le0$으로 쓰고 정의역 $a,b\ge0$를 유지한다. 고정 $\lambda\ge0$에 $a^2+b^2+\lambda(q-2a-b)$를 최소화한다.

</details>

<details markdown="1">
<summary>풀이</summary>

안쪽 최소점은 비음수 $a=\lambda,b=\lambda/2$이다. 대입하면 $g=q\lambda-5\lambda^2/4$로 최대는 $\lambda^\star=2q/5$, $a^\star=2q/5,b^\star=q/5$이다. 정확히 $q$를 공급하고 비용 $q^2/5$가 쌍대값과 같다. 수요로 미분하면 $2q/5=\lambda^\star$이다. 수요 증가는 요구 강화여서 양의 한계비용이다. $q=5$에서는 배분 $(2,1)$, 비용 5, 서비스 추가 단위당 한계 노력 2이다.

</details>

## 참고문헌과 추가 학습
{: id="references-and-further-learning"}

- [Kantorovich, Mathematical Methods of Organizing and Planning Production (1939; 영문 1960)](https://resistir.info/livros/kantorovich_mathematical_methods.pdf): 예제 1·표 1, 369–370쪽의 출판 설명용 자료와 부록 I의 해결 승수. 정확 분수·상한 곡선은 현대 재유도이다.
- [MIT 6.854, LP Duality](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html): 가중 제약의 목적 한계값, 변수 부호와 쌍대 조건, 상보성 인증을 익힌다.
- [Gabriele Farina, MIT 6.7220/15.084 강의 6, Separation as a proof system (2025), §L6.2](https://www.mit.edu/~gfarina/2025/67220s25_L06_farkas/L06.pdf#page=3): 선형 실행가능성과 모순 증명서의 대안을 공부한다.
- [Bertsekas, Convex Analysis and Optimization, Farkas–Minkowski–Weyl, PDF 105쪽](https://www.mit.edu/~dimitrib/Convex_Slides.pdf#page=105): LP 달성에 쓰인 유한원뿔 닫힘.
- [Boyd·Vandenberghe, Convex Optimization 5장, Parth Nobel과 개정](https://web.stanford.edu/class/ee364a/lectures/duality.pdf): Lagrangian에서 쌍대함수·Slater·KKT·민감도로 나아간다. 표시된 경우 인쇄 슬라이드 번호를 쓰며 PDF 앵커는 앞쪽 페이지를 반영한다.
- [선형계획법]({{ '/wiki/optimization/linear-programming-ko/' | relative_url }}): 모델 구성·기하·심플렉스 교환과 전체 기계 용량 계산으로 돌아간다.
- [Farkas 보조정리]({{ '/wiki/optimization/farkas-lemma-ko/' | relative_url }}): 모순 증명서와 강한 쌍대성 뒤의 원뿔 기하를 계산한다.
