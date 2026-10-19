---
title: 선형계획법
subject: Optimization
lang: ko
translation_key: wiki-optimization-linear-programming
description: Kantorovich의 출판된 생산율에서 결정변수, 선형 제약과 최적성 상한을 유도합니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 36e56410dfb4055c9d4c9034d588701004d8a3ed67cc17f3a7029d7fc609ac7b
interactive_examples: true
---

## Kantorovich의 문제: 완전한 부품 세트 최대화
{: id="kantorovichs-problem-maximize-complete-sets-of-parts"}

**선형계획법(LP)**은 선형 제한을 만족하며 선형 목적을 최적화할 수량·활동량을 고른다. 생산계획이라는 기원이 목적과 제한의 차이를 구체적으로 보여 준다.

Kantorovich의 1939년 책은 Plywood Trust의 문제에서 나왔다. 첫 예제는 금속가공 기계로 같은 배분 문제를 설명한다. 예제 1·표 1의 생산율이며 완제품은 두 부품 하나씩이 필요하다. 원문은 설명용임을 명시한다. [영문 번역 369–370쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=4).

| 기계군 | 기계 수 | 기계·일당 부품 I | 기계·일당 부품 II |
| --- | --- | --- | --- |
| 밀링 기계 | 3 | 10 | 20 |
| 터릿 선반 | 3 | 20 | 30 |
| 자동 터릿 선반 | 1 | 30 | 80 |

아래는 출판 생산율의 현대적 재유도이다. 작업시간을 나눌 수 있게 하며 정확한 분수 생산율을 유지한다. 일일 생산율은 정수일 필요 없고 개수에는 별도 반올림·일정 해석이 필요하다. [표 2, 371쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=6)은 군별 균형 77, 전문화 86이라는 정수 합계를 싣는다. 아래 정확 연속 계산은 $77.82,86.67$이다. 표 2의 정수를 정확한 분수시간 식으로 보지 않고 표 1 생산율을 쓴다.

### 작업시간에서 결정변수 유도
{: id="derive-the-decision-variables-from-working-time"}

밀링·터릿·자동의 부품 I 시간을 $m,t,a$ 기계·일이라 하자. 한 기계·일은 기계 한 대의 하루 작업이다. $m=2$는 가용 밀링 3일 중 2일을 I에 쓴다는 뜻이다. 모든 기계가 종일 일하면 II의 시간은 $3-m,3-t,1-a$이다.

한 군의 같은 기계 셋은 배분을 여러 방식으로 나눌 수 있다. $m$은 고정 배정 기계 수가 아닌 총시간이다. 생산율 일정·출력 가산·전환시간과 준비비용 없음을 가정한다. 시간은 음수이거나 가용량보다 클 수 없다.

$$
0\le m\le3,\qquad0\le t\le3,\qquad0\le a\le1.
$$

배분시간에 생산율을 곱하면 두 부품의 일일 수량은

$$
P=10m+20t+30a,
$$

$$
Q=20(3-m)+30(3-t)+80(1-a).
$$

각 기계의 가장 빠른 부품만 만들면 II만 230개로 완제품은 없다. 목적은 맞지 않는 부품 총합이 아닌 세트 수이다.

공통 출력을 $z$라 두어 $P=Q=z$를 요구하면

$$
\begin{aligned}
\text{최대화}\quad &z\\
\text{제약}\quad &10m+20t+30a=z,\\
&20(3-m)+30(3-t)+80(1-a)=z,\\
&0\le m,t\le3,\quad0\le a\le1,\quad z\ge0.
\end{aligned}
$$

등식은 부품 일치, 상한은 작업시간, 목적은 최대 일치 출력이다. [원문 일반 문제 A, 371–372쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=6)의 완전 가동·동일 출력 제약이다. 유휴시간·잉여 부품을 허용하는 모델은 다른 제약으로 표현해야 한다.

### 균형 계획도 생산용량을 낭비할 수 있다
{: id="a-balanced-plan-can-still-waste-productive-capacity"}

각 군이 두 부품을 똑같이 만들게 할 수 있다. 밀링은 $10m=20(3-m)$에서 $m=2$이다. 마찬가지로

$$
20t=30(3-t)\ \Longrightarrow\ t=\frac95,
$$

$$
30a=80(1-a)\ \Longrightarrow\ a=\frac8{11}.
$$

이 계획의 출력은

$$
z=20+36+\frac{240}{11}
=\frac{856}{11}\approx77.82.
$$

**실행가능**은 모든 제약 만족, **최적**은 그중 가장 좋은 목적이다. 각 군이 균형이므로 실행가능하지만 공장은 합계만 맞으면 된다. 같은 기계로 전문화하여 더 많은 세트를 만들 여지가 있다.

### 균형식을 소거해 상충관계 보기
{: id="eliminate-the-balance-equation-to-see-the-tradeoff"}

$P=Q$를 전개하면

$$
30m+50t+110a=230.
$$

$m$을 풀어 $z=P$에 넣으면

$$
m=\frac{230-50t-110a}{30},
$$

$$
z=\frac{230}{3}+\frac{10}{3}t-\frac{20}{3}a.
$$

새 목적은 **다른 군이 균형을 회복한 뒤** 한 군 변화가 총출력에 주는 효과이다. 터릿 I시간 증가는 유리하고 자동 I시간 증가는 불리하다. 원래 I생산율 20·30만으로 보이지 않던 상충이다.

$t\le3,a\ge0$이므로 목적의 상한은

$$
z\le\frac{230}{3}+\frac{10}{3}(3)=\frac{260}{3}.
$$

$t=3,a=0$이면 균형식에서 $m=8/3$으로 제한 안이다. 출력을 확인하면

$$
P=10\left(\frac83\right)+20(3)=\frac{260}{3},
$$

$$
Q=20\left(3-\frac83\right)+80=\frac{260}{3}.
$$

실행가능 계획이 상한에 도달해 최적 일일율은 $260/3\approx86.67$세트이다. 터릿은 I, 자동은 II, 밀링은 남은 균형을 공급한다. 실제 역사 예제의 생산율에서 답을 유도했으며 같은 문제의 교환 절차와 독립 최적성 증명서를 다음에 유도한다.

{% include image.html src="/assets/images/wiki/linear-programming-machines-ko.svg" alt="최적 배분에서 밀링 3기계·일의 8/9와 터릿 3일 전체는 I, 자동 1일은 II이다. 각 부품 합계는 260/3이다." caption="막대는 출력이 아니라 각 군의 가용시간이다. 파랑은 I, 주황은 II를 만든다. 다른 생산율이 다른 시간 비율을 같은 두 총량으로 바꾼다." %}

## 정의와 표기: 역사적 모델 일반화
{: id="definition-and-notation-generalizing-the-historical-models"}

작업시간·부품 균형·뒤의 배정 활동은 다음 일반 모델에 들어간다.

선형계획은 선형 등식·부등식 아래 선형 목적을 최적화한다. 정확히는 선형식에 상수를 더한 아핀식도 허용한다. 일반형은

$$
\begin{aligned}
\text{최소화}\quad &c^Tx+d\\
\text{제약}\quad &Gx\le h,\\
&Ex=f.
\end{aligned}
$$

$x\in\mathbb R^n$은 선택하는 **결정변수**, 고정 $c$는 비용으로 $c^Tx=\sum_{j=1}^nc_jx_j$는 수량×비용의 합이다. 상수 $d$는 보고값만 바꾸고 최선 $x$는 바꾸지 않는다. $n$은 변수 수, $m$은 부등식 행 수, $p$는 등식 행 수로 여기서 $m$은 밀링 시간이 아닌 차원이다. $G\in\mathbb R^{m\times n},E\in\mathbb R^{p\times n}$은 계수, $h\in\mathbb R^m,f\in\mathbb R^p$는 한계이다. 모든 행이 성립하는 성분별 부등식이며 $c^Tx$ 최대화는 $-c^Tx$ 최소화와 같다. [Boyd·Vandenberghe §4.3](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf#page=160).

**실행가능점**은 모든 제약을 만족하고 **실행가능영역**은 그 집합이다. **최적해**는 가장 좋은 목적값의 실행가능점으로 점과 값은 다르다. 기초 표기는 [행렬 분해 개요]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})를 보자.

역사 자료·문제는 사용하는 곳에 인용한다. 별도 귀속이 없으면 대수 유도·설명 예제는 직접 구성했다.

### 모서리를 걷기 전에 역사적 실행가능영역 읽기
{: id="read-the-historical-feasible-region-before-walking-along-its-edges"}

$m$을 소거하면 좌표 $t,a$가 남고 하·상한은

$$
140\le50t+110a\le230,\qquad
0\le t\le3,\quad0\le a\le1.
$$

선형 부등식은 직선 한쪽의 **반평면**을 고른다. 교집합은 다각형, 고차원에서는 **다면체**이다. **꼭짓점**은 서로 다른 실행가능점 둘의 평균으로 쓸 수 없다. 선형 제약이 가중평균에 보존되어 모든 두 계획 사이 선분이 남으므로 **볼록**이다. [볼록성]({{ '/wiki/optimization/convexity-ko/' | relative_url }}#calculate-a-mixture-before-generalizing)은 같은 기계의 혼합을 계산하고 집합·목적함수의 볼록성을 구별한다.

{% include image.html src="/assets/images/wiki/linear-programming-machine-pivots-ko.svg" alt="터릿 t·자동 a의 실행가능 다각형에 꼭짓점 다섯 개가 있다. 개선 교환 두 번으로 (12/5,1)에서 (3,8/11), 최적 (3,0)으로 간다. 밀링은 균형식으로 복원한다." caption="두 축은 I 생산 기계·일이다. 음영은 시간·균형 제한이고 주황 경로는 아래 두 교환으로 마지막 점이 z=230/3+10t/3−20a/3을 최대화한다. 각 점의 m은 균형식이 정한다." %}

## Dantzig의 문제: 열거하기에 너무 많은 계획
{: id="dantzigs-problem-a-plan-with-too-many-alternatives-to-enumerate"}

Dantzig의 전시 업무는 조달·보급·배치·훈련이었다. 전후 손으로 하던 계획의 기계화를 요청받았다. 구술사는 LP 모델을 1947년 6월, 심플렉스를 8월로 기록한다. [당사자 기록](https://www.informs.org/Explore/History-of-O.R.-Excellence/Oral-Histories/George-Dantzig).

후대 역사에서는 **70명을 70개 일자리에 배정**하고 사람 $i$가 일 $j$를 하면 $v_{ij}$의 편익인 예제로 장애를 설명한다. 완전 배정은 $70!>10^{100}$개이다. [Dantzig 2002, 43쪽](https://pubsonline.informs.org/doi/pdf/10.1287/opre.50.1.42.17798#page=2). 회고의 예제이지 재현한 군사 데이터가 아니다.

### 가능한 활동마다 변수 유도
{: id="derive-one-variable-for-each-possible-activity"}

$x_{ij}=1$은 사람 $i$의 일 $j$ 배정, 0은 비배정이다. 사람마다 일 하나, 일마다 사람 하나이면

$$
\sum_{j=1}^{70}x_{ij}=1\quad(i=1,\ldots,70),
$$

$$
\sum_{i=1}^{70}x_{ij}=1\quad(j=1,\ldots,70).
$$

활동변수 4900개와 명시 균형식 140개지만 두 식군 합이 모두 70이어서 한 식은 중복이다. 계획 편익은

$$
\text{최대화}\quad\sum_{i=1}^{70}\sum_{j=1}^{70}v_{ij}x_{ij}.
$$

실제 배정은 이진변수를 요구한다. 이를 $x_{ij}\ge0$로 바꾸면 균형·목적을 유지한 연속 **LP 완화**이다. 두 사람 예제에서는 네 원소가 모두 $1/2$일 수 있어 실제 배정이 아닌 분수 배분이다. 정수성은 추가 질문이지 임의 LP의 정의가 아니다.

### 배정 완화가 정수 배정을 줄 수 있는 이유
{: id="why-this-assignment-relaxation-can-still-return-a-whole-assignment"}

이 특정 1인·1일 균형에서는 LP 영역의 모든 꼭짓점이 0–1 배정이다. 따라서 선형 편익마다 정수 최적점이 있지만 동률 최적에는 분수점도 있다. [Goemans 정리 1.6](https://math.mit.edu/~goemans/18433S15/matching-notes.pdf#page=8).

$0<x_{ij}<1$인 사람·일을 잇자. 그런 연결이 하나면 적어도 둘이다. 분수 하나만으로 정수 행·열 합 1을 채울 수 없기 때문이다. 유한망에서 연결을 따라가면 순환이 생기며 사람·일이 번갈아 길이는 짝수이다. 교대 원소에 작은 $\epsilon$을 더하고 나머지에서 빼며 반대 부호의 계획도 만든다. 둘 다 행·열 합과 비음수를 유지하고 평균이 원래 계획이므로 분수 계획은 꼭짓점이 아니다.

두 사람의 모두 $1/2$인 행렬은 두 정수 배정의 평균이다.

$$
\begin{bmatrix}1&0\\0&1\end{bmatrix},\qquad
\begin{bmatrix}0&1\\1&0\end{bmatrix}.
$$

선형성으로 편익도 평균이므로 적어도 한 정수 배정은 그 이상이다. $70!$ 열거 없이 배정 모델을 푸는 특수 구조의 이유이지 모든 LP에 정수 꼭짓점이 있다는 뜻은 아니다.

기계 변수는 작업시간, 여기서는 사람·일의 짝이다. 같은 행·열 구성이 복잡한 계획을 선형 균형으로 바꾼다. 이 구조를 이용하면 완전 배정 열거가 필요 없다.

군사 **프로그램**은 계획·일정을 뜻했다. Dantzig는 1948년 Koopmans가 “linear programming”을 제안했고 계획 규칙을 명시 목적함수로 바꿨다고 회고한다. [2002, 43·46쪽](https://pubsonline.informs.org/doi/pdf/10.1287/opre.50.1.42.17798#page=2). 군별 균형은 허용 계획이지만 최대 완제품은 아니라는 앞 예제가 중요성을 보인다.

## 심플렉스: 역사적 기계를 개선 교환으로 바꾸기
{: id="simplex-turn-the-historical-machine-problem-into-improving-exchanges"}

Dantzig는 처음에 실행가능 모서리 걷기를 비효율적이라 거부했으나 행렬 열을 조사해 알고리즘을 찾고 나중에 같은 모서리 걷기임을 알았다고 회고한다. [Origins of the Simplex Method](https://archive.computerhistory.org/resources/access/text/2024/06/102739347-05-0002-acc.pdf#page=169).

Kantorovich 생산율에 현대 심플렉스 관점을 적용한다. 본문의 재유도이지 그가 후대 Dantzig 알고리즘을 썼다는 주장은 아니다. 균형·목적은

$$
30m+50t+110a=230,\qquad z=10m+20t+30a.
$$

### 실행가능 꼭짓점에서 시작
{: id="start-at-a-feasible-corner"}

밀링 I를 하한 $m=0$, 자동 I를 상한 $a=1$로 두면 균형의 나머지 시간은

$$
t=\frac{230-110}{50}=\frac{12}{5},\qquad z=78.
$$

균형을 둔 뒤 변수 경계 둘이 점을 정하므로 꼭짓점이다. 각 부품을 78개 만든다.

### 자동 시간을 터릿 시간과 교환
{: id="exchange-automatic-time-for-turret-time"}

$m=0$을 유지하며 $a$를 줄이면 일치 출력을 위해

$$
t=\frac{23}{5}-\frac{11}{5}a,\qquad z=92-14a.
$$

$a$ 1단위 감소마다 $t$는 $11/5$ 증가하고 출력은 14 늘어난다. 터릿 상한 너머로는 못 가며 $t=3$이면

$$
a=\frac8{11},\qquad z=\frac{900}{11}\approx81.82.
$$

한계 경계가 교환 정지점을 정한다.

### 자동 시간을 밀링 시간과 교환
{: id="exchange-automatic-time-for-milling-time"}

$t=3$을 유지하고 $a$를 계속 줄이면

$$
m=\frac83-\frac{11}{3}a,\qquad
z=\frac{260}{3}-\frac{20}{3}a.
$$

이번에는 $a$ 단위 감소마다 $20/3$ 개선된다. $a=0$에서 밀링 $8/3<3$여서 자동 하한이 먼저 닿는다. 앞 최적점에 도달한다.

$$
(m,t,a)=\left(\frac83,3,0\right),\qquad z=\frac{260}{3}.
$$

두 교환은 실행가능 모서리를 따라 등호로 **활성화**된 경계에서 멈췄다. 다른 활성 변수를 바꿔 균형을 유지하므로 목적계수가 바뀐다. 보상 변경 후 개선을 재는 것이 **감소비용(reduced cost)**의 역할이다.

### 기저 피벗으로 교환 일반화
{: id="generalize-the-exchange-as-a-basis-pivot"}

등식 표준형 $Ax=b,x\ge0$에서 $A$의 행 $r$개가 독립이라 하자. **기저**는 독립 열 $r$개를 골라 유일해인 정사각계를 만든다. 비기저를 0으로 두고 $A_Bx_B=b$를 풀어 비음수면 기저 실행가능해이다. **피벗**은 열 하나를 교환하며 실행가능 한계가 나갈 변수를 정한다. II의 비음수 나머지 $s_m,s_t,s_a$를 도입하면

$$
m+s_m=3,\qquad t+s_t=3,\qquad a+s_a=1.
$$

**여유변수**는 상한과 수량의 차이이다. 여기서는 I에 쓰지 않은 시간이 II를 만들어 유휴가 아니다. 균형식과 함께 등식 표준형이다. 시작 기저는 $t,s_m,s_t,a$, 비기저는 $m=s_a=0$이다. 첫 교환은 $s_a$를 넣어 $s_t=0$, 둘째는 $m$을 넣어 $a=0$으로 만든다. [MIT 기저·심플렉스](https://ocw.mit.edu/courses/6-854j-advanced-algorithms-fall-2008/302900e3a66f2a3b9c9f31bf91cd31fe_lec10.pdf#page=5).

**1단계(Phase I)** 보조 LP는 제약 위반의 인공변수를 최소화해 시작점을 찾는다. 최소 0이면 실행가능해, 양수면 불가능 증명이다. [Goemans §2.5](https://ocw.mit.edu/courses/18-310-principles-of-discrete-applied-mathematics-fall-2013/11d00f8f0f460a5e59b5e97322a218a9_MIT18_310F13_Ch8.pdf#page=15). 기저변수 0은 **퇴화**로 피벗 후 점이 같을 수 있다. 적절한 규칙이 순환을 막는다. [MIT 알고리즘](https://courses.csail.mit.edu/6.854/20/Notes/n14-LP_algorithms.html).

### 실행가능 계획이 없음을 인증하기
{: id="certify-that-no-feasible-plan-exists"}

**Farkas 보조정리**는 불가능성을 직접 증명한다. 비제한 $x$의 $Ax\le b$에 변수 경계도 행으로 포함하면, 실행가능점 또는 $A^Ty=0,b^Ty<0$인 비음수 가중치 중 정확히 하나가 있다. 가중합은 $0\le b^Ty<0$으로 모순이다. [Farina L6.1](https://www.mit.edu/~gfarina/2025/67220s25_L06_farkas/L06.pdf#page=3).

각 부품 90개 이상이라는 가상 목표는 불가능하다. 두 출력 요구·일부 시간 경계를 가중하면 $0\le260-3(90)=-10$이다. [Farkas 문서]({{ '/wiki/optimization/farkas-lemma-ko/' | relative_url }})는 가중치·기하 분리·쌍대 상한 연결을 유도한다.

## Kantorovich의 해결 승수: 기계계획의 최적성 증명
{: id="kantorovichs-resolving-multipliers-prove-the-machine-plan-is-optimal"}

I생산율이 더 높은 자동 대신 왜 터릿에 I를 맡기는가? **해결 승수**는 기계의 다른 용도 사이 가중 출력을 비교한다. 원문 부록 I의 방법·최적 논증을 보자. [§§1–3](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=26).

혼합 밀링에서 직접 가중치를 만들 수 있다. 유도한 분할을 인증하려면 두 용도의 가중 출력이 같게 비음수 가중치를 고른다.

$$
10\lambda_1=20\lambda_2.
$$

합을 1로 정규화하면 $\lambda_1=2/3,\lambda_2=1/3$이다. 시장가격이 아닌 상대 부품 가치이다.

| 기계군 | 가중 I생산율 | 가중 II생산율 | 더 큰 가중 출력 |
| --- | --- | --- | --- |
| 밀링 | $10(2/3)=20/3$ | $20(1/3)=20/3$ | 동률: 분할 가능 |
| 터릿 | $20(2/3)=40/3$ | $30(1/3)=10$ | I |
| 자동 | $30(2/3)=20$ | $80(1/3)=80/3$ | II |

터릿·자동 전문화 뒤 밀링을 분할하면 배분이 복원된다. 더 중요하게 모든 균형 계획에 상한을 준다.

$P=Q=z$, 가중치 합 1이므로

$$
z=\frac23P+\frac13Q.
$$

각 기계 하루의 가중 출력은 두 생산율 중 큰 값 이하이다. 가용량 3·3·1에서

$$
z\le3\left(\frac{20}{3}\right)
+3\left(\frac{40}{3}\right)
+\frac{80}{3}
=\frac{260}{3}.
$$

배분이 상한을 달성해 다른 계획이 더 만들 수 없다는 증명서이다. 엄격히 작은 가중 생산율에 시간을 쓰면 간극이 생기고 동률에서 혼합이 가능하다. 아래 상보성 조건의 원리이다.

## 쌍대성: 역사 증명서에서 일반 상한으로
{: id="duality-from-the-historical-certificate-to-a-general-bound"}

생산 모델의 최적성 증명서로 쌍대성을 전개한다. 부호 규칙·Farkas 강한 쌍대성 증명·Lagrangian·KKT는 [쌍대성]({{ '/wiki/optimization/duality-ko/' | relative_url }})으로 이어가자.

Dantzig는 1947년 10월 3일 von Neumann을 만나 LP와 다른 참여자의 선택에 결과가 달린 게임이론의 연결·쌍대성을 들었다고 회고한다. [2002, 44쪽](https://pubsonline.informs.org/doi/pdf/10.1287/opre.50.1.42.17798#page=3). 기계 증명서에서 하나는 활동, 다른 하나는 모든 활동의 달성값을 제한하는 가중치를 고르는 최적화로 읽을 수 있다.

### 역사 모델 자체의 쌍대 쓰기
{: id="write-the-dual-of-the-historical-model-itself"}

표 1의 용량 $N_j$, 생산율 $r_{j1},r_{j2}$에 시간 $h_{j1},h_{j2}$라 하자. 완전 가동은 $h_{j1}+h_{j2}=N_j$, 두 부품 합계는 $z$이다. 합이 1인 부품 가중치 $\lambda_1,\lambda_2$와 용량 가치 $w_j$로 모든 배분을 제한하려면

$$
w_j\ge r_{j1}\lambda_1,\qquad
w_j\ge r_{j2}\lambda_2.
$$

완전 가동 등식을 쓰면

$$
z=\sum_j\sum_{k=1}^2\lambda_k r_{jk}h_{jk}
\le\sum_j w_jN_j.
$$

그 상한을 최소화하는 쌍대는

$$
\begin{aligned}
\text{최소화}\quad&3w_M+3w_T+w_A\\
\text{제약}\quad&\lambda_1+\lambda_2=1,\\
&w_M\ge10\lambda_1,\quad w_M\ge20\lambda_2,\\
&w_T\ge20\lambda_1,\quad w_T\ge30\lambda_2,\\
&w_A\ge30\lambda_1,\quad w_A\ge80\lambda_2.
\end{aligned}
$$

$M,T,A$는 밀링·터릿·자동, $\lambda_k$는 부품 균형 가중치이다. 원문제 균형·완전 가동이 등식이라 승수 부호는 비제한이다. 출력 등식·비음수 시간이 이미 $z\ge0$을 함의해 $z$도 비제한으로 취급할 수 있다. 양의 선택 $\lambda=(2/3,1/3)$, $w=(20/3,40/3,80/3)$은 쌍대 실행가능하며 $260/3$을 달성한다. 부품 가중치와 시간 가치는 관련되지만 다른 양이다.

### 자원 상한 부등식으로 일반화
{: id="generalize-to-inequality-resource-limits"}

**원문제**는 원래 최적화, **쌍대**는 제약의 최선 한계값 탐색이다. 부호는 원표현에 달린다. 역사 등식 대신 자원 상한의 흔한 생산 원·쌍대는

$$
\begin{array}{lll}
\text{원문제:}&\max c^Tx&Ax\le b,\ x\ge0,\\
\text{쌍대문제:}&\min b^Ty&A^Ty\ge c,\ y\ge0.
\end{array}
$$

$A$는 자원별 행·활동별 열, $b$는 용량, $c$는 이익, $y$는 자원별 비음수 가격이다. 각 제품 투입가격이 이익을 덮어야 한다. **약한 쌍대성**은 모든 쌍대 실행가능값이 모든 원 실행가능값의 상한임이다.

$$
c^Tx\le (A^Ty)^Tx=y^TAx\le y^Tb.
$$

$x\ge0$이 첫, $y\ge0$이 마지막 부등식을 정당화한다. **강한 쌍대성**은 실행가능하고 유한한 원최적값을 두 문제 모두 달성함이다. [MIT](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html). 최대화 원의 등식 행은 비제한 쌍대변수, 비제한 원변수는 쌍대 등식이다. [Goemans §4.2](https://ocw.mit.edu/courses/18-310-principles-of-discrete-applied-mathematics-fall-2013/11d00f8f0f460a5e59b5e97322a218a9_MIT18_310F13_Ch8.pdf#page=22).

### 상보적 느슨성
{: id="complementary-slackness"}

표시한 쌍의 실행가능 $x,y$는 다음일 때 정확히 최적이다.

$$
y_i\bigl(b_i-(Ax)_i\bigr)=0\quad\text{각 자원 }i,
$$

$$
x_j\bigl((A^Ty)_j-c_j\bigr)=0\quad\text{각 제품 }j.
$$

**상보적 느슨성** 조건이다. [Goemans §4.3](https://ocw.mit.edu/courses/18-310-principles-of-discrete-applied-mathematics-fall-2013/11d00f8f0f460a5e59b5e97322a218a9_MIT18_310F13_Ch8.pdf#page=23). 미사용 자원은 최적 가격 0, 생산 제품은 투입 가치=이익이다. 역은 필요 없다. $\max x_1$, $0\le x_1,x_2\le1$의 $(1,1)$은 둘 다 묶지만 가격 $(1,0)$은 둘째 한계를 0으로 평가한다.

대수적으로 상한−이익인 **쌍대 간극**을 나누면

$$
b^Ty-c^Tx=y^T(b-Ax)+x^T(A^Ty-c).
$$

모든 항이 비음수이므로 표시한 모든 곱이 0일 때 정확히 간극이 0이다.

## 추가 기계에 대해 역사 승수가 말하는 것
{: id="what-the-historical-multipliers-say-about-extra-machinery"}

가중 생산율은 가용시간도 평가한다. 최적 근처 추가 기계·일의 잠재 일치 출력은

| 추가 기계·일 | 추가 세트 출력 상한 |
| --- | --- |
| 밀링 | $20/3$ |
| 터릿 | $40/3$ |
| 자동 | $80/3$ |

국소적으로 달성되면 용량 완화에 따른 최적 출력 변화인 **그림자가격**이다. 원기계 식으로 의미를 확인하자.

밀링·터릿 3일씩을 유지하며 자동 $\delta$일을 더하자. 같은 전문화가 최적이면 터릿 I, 자동 II, 밀링은

$$
10m+60=20(3-m)+80(1+\delta).
$$

풀면

$$
m=\frac83+\frac83\delta,\qquad
z=\frac{260}{3}+\frac{80}{3}\delta.
$$

$0\le\delta\le1/8$에서 $m\le3$으로 실행가능하며 같은 승수가 상한을 인증해 실제 $80\delta/3$세트가 늘어난다. 그 너머 공식은 가용 밀링을 초과하므로 생산 부품을 바꿔야 하고 같은 그림자가격 외삽은 정당하지 않다.

더 빠른 기계의 가치는 다른 기계가 맞는 부품을 공급할 수 있는지에 달린다는 용량 의사결정이 된다.

### 대화형 예제: 교환 재현과 용량 변경
{: id="interactive-example-replay-the-exchanges-and-change-capacity"}

{% include wiki-lab-ko.html kind="kantorovich" title="Kantorovich의 출판 기계 자료 탐구" source_url="https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=4" source_label="Kantorovich 예제 1·표 1, 369쪽" plot_description="역사 기계의 실행가능영역, 현재·최적 배분과 각 군의 시간 비율." %}

원자료 기준은 [예제 1·표 1, 369쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=4)의 개수·생산율과 대당 하루이다. [문제 A, 371–372쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=6)의 완전 가동·일치 출력을 유지한다. 연속 재유도는 분수 생산율이며 원문 표 2는 정수 출력을 보고한다. **출판 기준 복원·재현**은 용량 $(3,3,1)$과 교환 시작점으로 돌아간다.

**다음 교환**으로 $78\to900/11\to260/3$을 따르자. 채운 점은 현재, 주황 고리는 최적 계획이다. 두 부품 합계와 남은 개선량을 비교하자.

이후 용량·시나리오를 바꾸자. 교환은 위 현대 재유도이며 역사 계산 복원이 아니다. 출판 생산율은 고정이고 변경 용량은 가상 실험이다. 새 최적 계획이 즉시 표시된다. 자동 $1.125$일인 전문화 경계 후 2일을 시험하면 밀링·터릿은 I 전담, 자동은 분할한다. 터릿 0 또는 전부 0도 시험하자. 선분·점으로 붕괴한 영역도 처리한다. 출판 기준으로 복원하면 교환을 재현한다. 0–10과 최소 양수 한계는 UI 선택이지 역사 기계 한계가 아니다.

용량은 0–10의 분할 기계·일이고 신뢰할 수치 비교를 위해 양수는 $10^{-6}$ 이상이다. 입력·선택·단추는 키보드를 지원한다. JavaScript 없이도 위 배분·교환 둘·그림·용량 경계 유도를 읽는다.


## 두 변수 실습: 기하와 목적 변경
{: id="two-variable-lab-see-the-geometry-and-change-the-objective"}

역사 기계는 시간 변수 셋과 균형식이었다. 아래 직접 만든 작업장 모델은 같은 선형 구조를 쉽게 보는 2좌표 그림이다. 자료는 실습용으로 만들었다. 위 유도가 역사 예제이고 아래는 접근하기 쉬운 시각화이다.

$x_1,x_2$는 A·B 제품의 분할 배치 수이며 모두 명시 이익에 팔린다고 가정한다.

| 배치당 | A 제품 | B 제품 | 가용량 |
| --- | --- | --- | --- |
| 기계 시간 | 1 | 1 | 4 |
| 재료 단위 | 2 | 1 | 5 |
| 이익 단위 | 3 | 2 | — |

### 자원 한계는 가능한 일을 정한다
{: id="resource-limits-describe-what-we-can-do"}

제어 수량 $x_1,x_2$에서 시작하면 표의 제한은

$$
x_1+x_2\le4,\qquad2x_1+x_2\le5,\qquad x_1,x_2\ge0.
$$

$(0,0),(0,2),(1,3)$은 모두 제한 안이다. 제약만으로 여러 계획이 생기지만 무엇을 고를지는 정하지 않는다.

### 이익 목적 선택
{: id="choose-a-profit-objective"}

“고이익 제품 우선”은 전략 선택이다. 평가에는 총이익이라는 목표가 필요하다. A는 배치당 3, B는 2여서 $z=3x_1+2x_2$이다. 제약과 합치면

$$
\begin{aligned}
\text{최대화}\quad &z=3x_1+2x_2\\
\text{제약}\quad &x_1+x_2\le4,\\
&2x_1+x_2\le5,\\
&x_1,x_2\ge0.
\end{aligned}
$$

첫 제약은 시간, 둘째는 재료, 비음수는 음의 생산을 제외한다. 행별 단위를 확인하자. 시간 계수×배치는 시간이 된다. 계수·용량은 알려져 있고 계획 중 고정이라 가정한다.

다음의 $\max c^Tx$, $Ax\le b,x\ge0$이다.

$$
A=\begin{bmatrix}1&1\\2&1\end{bmatrix},\qquad
b=\begin{bmatrix}4\\5\end{bmatrix},\qquad
c=\begin{bmatrix}3\\2\end{bmatrix}.
$$

$A$의 각 행은 자원 제한, 열은 활동 투입으로 A는 $(1,2)^T$, B는 $(1,1)^T$이다. 역사 교환과 같은 행·열 구성이다.

### 보충 모델의 기하
{: id="geometry-of-this-supplementary-model"}

$x_1+x_2\le4$는 직선 한쪽인 **반평면**, 고차원에서는 반공간이다. 유한 개와 등식 경계의 교집합은 **다면체**이며 두 실행가능점의 전체 선분이 남는 **볼록**이다. $(0,4),(1,3)$의 중점 $(1/2,7/2)$도 두 자원 제약을 만족한다.

**꼭짓점·극점**은 다른 실행가능점 둘의 비자명 가중평균이 아니다. 여기서는 모서리이다. 모든 점은 꼭짓점 가중평균이고 선형 목적도 평균이므로 다각형 내부의 어떤 점도 모든 꼭짓점을 이길 수 없다.

일반적으로 $Ax=b,x\ge0$의 실행가능 유한 최적 LP에는 최적 꼭짓점이 있다. 비제한 정식화는 주의해야 한다. $x_1=0,x_2\in\mathbb R$ 직선의 $x_1$ 최소화는 최적점은 있지만 꼭짓점이 없다. [MIT LP 알고리즘](https://courses.csail.mit.edu/6.854/20/Notes/n14-LP_algorithms.html).

목적 벡터가 0이 아니면 **등위선**은 같은 목적값의 점들이다. $3x_1+2x_2=k$는 $x_2=k/2-(3/2)x_1$이다. $k$를 늘려 마지막 접촉을 찾으면 $k=9$의 $(1,3)$이다. 이익 변경은 선을 회전시켜 승리 꼭짓점을 바꿀 수 있다.

### 실행가능 꼭짓점 찾기
{: id="find-the-feasible-corners"}

좌표축·두 자원 경계가 다각형을 둘러싼다. $x_2=0$의 더 강한 상한은 $x_1\le5/2$, $x_1=0$에서는 $x_2\le4$이다. 두 경계의 교점은

$$
x_1+x_2=4,\qquad2x_1+x_2=5
\quad\Longrightarrow\quad x_1=1,\quad x_2=3.
$$

네 꼭짓점은 $(0,0),(5/2,0),(1,3),(0,4)$이다.

{% include image.html src="/assets/images/wiki/linear-programming-region-ko.svg" alt="꼭짓점 (0,0),(2.5,0),(1,3),(0,4)의 실행가능 다각형. 기계 경계 x1+x2=4, 재료 경계 2x1+x2=5, 목적선 3x1+2x2=9가 (1,3)에 닿는다." caption="가로는 A, 세로는 B이다. 파란 영역은 두 자원·비음수 제약을 지키고 주황 점선은 최대 이익 수준 9이다." %}

### 꼭짓점 평가와 계획 확인
{: id="evaluate-the-corners-and-check-the-plan"}

| 꼭짓점 | $3x_1+2x_2$ |
| --- | --- |
| $(0,0)$ | $0$ |
| $(5/2,0)$ | $15/2=7.5$ |
| $(1,3)$ | $9$ |
| $(0,4)$ | $8$ |

최선은 $x^\star=(1,3)^T,z^\star=9$로 시간 $1+3=4$, 재료 $2+3=5$를 정확히 쓴다. 고이익 A만 탐욕적으로 만들면 $7.5$여서 배치 이익만으로 최선 혼합은 정해지지 않는다.

### 보충 대화형 예제: 만든 이익 변경
{: id="supplementary-interactive-example-change-invented-profits"}

{% include wiki-lab-ko.html kind="linear-programming" title="만든 자료의 보충 실습: 어느 혼합이 이기는가?" source_url="https://ocw.mit.edu/courses/18-310-principles-of-discrete-applied-mathematics-fall-2013/11d00f8f0f460a5e59b5e97322a218a9_MIT18_310F13_Ch8.pdf#page=1" source_label="Goemans의 LP 모델링 §1.1" plot_description="고정 생산 다각형과 선택 이익계수를 최대화하는 모든 꼭짓점." %}

위 역사 실습의 보충이다. 용량·이익은 만든 수치이며 [Goemans §1.1](https://ocw.mit.edu/courses/18-310-principles-of-discrete-applied-mathematics-fall-2013/11d00f8f0f460a5e59b5e97322a218a9_MIT18_310F13_Ch8.pdf#page=1)은 정식화 방법이지 수치의 출처가 아니다. **교육 예제 (3,2) 복원**으로 기본 이익에 돌아가며 모든 수정은 가상 교육 시나리오이다.

제약은 고정이다. 이름 붙은 수 입력과 화살표로 이익을 바꾸자. $(3,2),(1,1),(2,1),(0,0)$ 중 뒤 셋은 각각 최적 모서리 둘과 상수 목적을 드러낸다. 모든 최적 꼭짓점과 연결 선분·전체 영역이 최적인 때를 보인다. 음의 이익·빈 입력도 처리한다. JavaScript 없이도 그림·표가 유용하다.

### 가능한 결과와 오해
{: id="possible-outcomes-and-misconceptions"}

| 결과 | 예제 | 이유 |
| --- | --- | --- |
| 유일 최적점 | 생산 예제 | $(1,3)$만 9 달성 |
| 다중 최적점 | 같은 제약의 $x_1+x_2$ 최대화 | $(0,4)$~$(1,3)$ 모두 4 달성 |
| 실행불가능 | $x_1\ge2,x_1\le1$ | 동시 만족점 없음 |
| 목적 비유계 | $x_1\ge0$만의 $x_1$ 최대화 | 이익이 무한히 증가 |

**비유계 영역도 목적은 유계일 수 있다.** $x_1\ge0$의 최소화는 영역이 무한해도 최소 0이다.

**최적점은 유일·정수일 필요 없다.** $2x_1\le5,x_1\ge0$의 $x_1$ 최대는 $2.5$이다. 정수를 요구하면 2로 바뀌며 정수계획이다. 연속해를 단순 반올림하는 것은 불안정하며 위로 반올림하면 제약 위반이다.

**선형성은 변수 수가 아닌 식의 성질이다.** $3x_1+2x_2$는 선형, $x_1x_2,x_1^2$는 아니다. 제곱오차는 이차문제이며 [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})을 보자.

### 동치형과 여유변수
{: id="equivalent-forms-and-slack-variables"}

**여유변수**는 미사용 용량이다. 작업장 부등식을 쓰면

$$
x_1+x_2+s_1=4,\qquad2x_1+x_2+s_2=5,\qquad
x_1,x_2,s_1,s_2\ge0.
$$

$(0,2)$의 여유는 $s_1=2$시간,$s_2=3$재료이며 $(1,3)$에서는 둘 다 0인 **활성** 제약, 즉 등호이다.

흔한 **표준형**은 $\min c^Tx$, $Ax=b,x\ge0$이지만 관례가 달라 명시해야 한다. $\ge$는 비음수 잉여변수를 빼 등식으로, 비제한 변수는 $x_j=u_j-v_j$($u_j,v_j\ge0$)로 바꾼다. 치환을 통해 원결정·목적이 보존된다. [§4.3](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf#page=161).

### 같은 상한으로 실습 최적점 확인
{: id="verify-the-lab-optimum-with-the-same-bounding-idea"}

비음수 시간 가격 $y_1$, 재료 가격 $y_2$를 두고 투입가치가 이익을 덮게 A는 $y_1+2y_2\ge3$, B는 $y_1+y_2\ge2$를 요구한다. 총재고 가치 $4y_1+5y_2$의 가장 작은 정당한 상한을 찾는 **쌍대** LP이며 생산은 **원문제**이다. 작업장 쌍대는

$$
\begin{aligned}
\text{최소화}\quad &4y_1+5y_2\\
\text{제약}\quad &y_1+2y_2\ge3,\\
&y_1+y_2\ge2,\\
&y_1,y_2\ge0.
\end{aligned}
$$

$y_1=y_2=1$이면 A 투입은 $1+2=3$, B는 $1+1=2$로 제약을 만족하고 총가치는 $4+5=9$이다. 두 자원식을 더해도

$$
(x_1+x_2)+(2x_1+x_2)\le4+5
\quad\Longrightarrow\quad3x_1+2x_2\le9.
$$

계획의 이익 9와 상한이 같아 더 벌 수 없음을 보인다. 최적화 알고리즘을 다시 돌리는 것보다 검증하기 쉽다.

## 심플렉스에서 내부 방법과 소프트웨어로
{: id="from-simplex-to-interior-methods-and-software"}

모델·피벗·가격 증명서는 일반 틀의 일부가 되었다. 1963년 RAND R-366-PR인 Dantzig의 *Linear Programming and Extensions*는 정식화·심플렉스·쌍대성·수송·게임을 모았다. [RAND 기록·내려받는 장들](https://www.rand.org/pubs/reports/R366.html).

실용 성공은 최악 시간 증가 질문을 낳았다. **다항시간**은 계수 비트까지 포함한 입력 크기의 고정 다항식으로 작업을 제한한다. Khachiyan은 1979년 보장을 얻었고 Karmarkar의 1984년 논문은 다른 내부 접근을 주었다. [Karmarkar 서론](https://www.stat.uchicago.edu/~lekheng/courses/302/classics/karmarkar.pdf).

### Karmarkar의 정규화 문제: 현재점을 중심으로 이동
{: id="karmarkars-normalized-problem-move-the-current-point-to-the-center"}

논문의 변환 LP 형태는

$$
\text{최소화 }c^Tx,\qquad
Ax=0,\quad\sum_{i=1}^n x_i=1,\quad x\ge0.
$$

비음수 좌표 합 1은 고차원 삼각형인 **단체(simplex)**로 심플렉스 알고리즘과 구별된다. 현재 실행가능 $u$의 모든 $u_i>0$이면 사영 좌표변환은

$$
y_i=\frac{x_i/u_i}{\sum_j x_j/u_j}.
$$

$x=u$의 분자가 모두 1이라 $y_i=1/n$으로 중심이 된다. 중심 이동·실행가능성을 확인할 보충 시험계는

$$
A=\begin{bmatrix}2&-3&0\end{bmatrix},\qquad c=(0,0,1)^T,
$$

$$
u=(1/2,1/3,1/6)^T.
$$

Karmarkar 원문 자료가 아닌 만든 설명 계수이다. $Au=2(1/2)-3(1/3)=0$, 합은 1, 비용 $1/6$이며 $u$를 $(1/3,1/3,1/3)^T$로 보낸다.

$D$를 대각 $u_i$로 두면 역변환은

$$
x=\frac{Dy}{\sum_j u_jy_j}.
$$

$Ax=0$에 대입하면 분모가 양수여서 변환 균형도 선형이다.

$$
ADy=0.
$$

시험계는 $AD=(1,-1,0)$으로 중심이 $y_1-y_2=0$을 만족한다. 중심 역변환은 $u$이다. 원시험 최소점 $(3/5,2/5,0)^T$는 균형·정규화와 비음수 목적 $x_3=0$을 만족한다. 시작·변환 균형·역변환·목표를 확인했지만 전체 알고리즘 실행을 주장하지 않는다.

좌표 합 1의 정규식·오른쪽 항 0의 동차식은 재중심화 후 선형 균형을 보존하는 구체적 이유가 있다. 알고리즘은 변환된 실행가능 공간의 공 안에서 제어된 걸음을 하고 돌아온다. 진행을 재는 잠재함수 분석도 필요해 재중심화만으로 완전 해법은 아니다. [1984 §§1.1–1.5](https://www.stat.uchicago.edu/~lekheng/courses/302/classics/karmarkar.pdf#page=2).

일부 심플렉스 규칙은 최악 예제에서 지수적 피벗을 쓴다. 타원체·내부점 같은 다항 LP 알고리즘이 있으며 유리 자료는 차원과 계수 비트를 함께 센다. [MIT 알고리즘](https://courses.csail.mit.edu/6.854/20/Notes/n14-LP_algorithms.html).

### 소프트웨어로 보충 작업장 풀기
{: id="solve-the-supplementary-workshop-plan-with-software"}

SciPy `linprog`는 최소화하므로 이익 부호를 바꾼다. HiGHS는 심플렉스·내부점을 지원한다. 후보를 읽기 전에 상태를 확인한다. [공식 문서](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linprog.html).

```python
from scipy.optimize import linprog

result = linprog(
    c=[-3, -2],
    A_ub=[[1, 1], [2, 1]],
    b_ub=[4, 5],
    bounds=[(0, None), (0, None)],
    method="highs",
)
if not result.success:
    raise RuntimeError(result.message)

print(result.x)      # [1. 3.]
print(-result.fun)   # 9.0
print(result.slack)  # [0. 0.]
```

부동소수점 출력은 적절한 척도·허용오차로 원제약에서 확인한다. 작은 잔차는 정확 실행가능성과 다르다. 불가능하면 충돌 요구를, 비유계면 임의 상한 추가 대신 빠진 한계를 살핀다.

## 연습문제
{: id="practice-problems"}

힌트·풀이 전에 시도하자. 1·2번은 출판 생산율의 새 질문이고 나머지는 직접 만든 설명이다.

### 1. 손계산: 첫 기계 교환 확인
{: id="1-hand-calculation-check-the-first-machine-exchange"}

$m=0,t=12/5,a=1$에서 $m=0$을 유지하며 $a=9/10$로 줄인다. 새 $t$, 두 출력과 증가량을 구하라.

<details markdown="1">
<summary>힌트</summary>

$50t+110a=230$을 쓰고 $P,Q$를 따로 계산한다.

</details>

<details markdown="1">
<summary>풀이</summary>

$t=(230-99)/50=131/50=2.62<3$이다. 그러면

$$
P=20(131/50)+30(9/10)=397/5=79.4,
$$

$$
Q=60+30(3-131/50)+80(1-9/10)=79.4.
$$

증가량은 $79.4-78=1.4$로 감소 목적의 $14(1/10)$과 같다.

</details>

### 2. 해석: 추가 자동시간의 그림자가격 경계
{: id="2-interpretation-when-does-extra-automatic-time-stop-following-its-shadow-price"}

자동 $1/4$일 추가에 현재 가격으로 $(80/3)(1/4)=20/3$세트 증가를 예상한다. 같은 전문화로 달성 가능한가?

<details markdown="1">
<summary>힌트</summary>

필요 밀링 시간을 가용 3일과 비교한다.

</details>

<details markdown="1">
<summary>풀이</summary>

$m=8/3+(8/3)(1/4)=10/3>3$으로 불가능하다. 이 증가에서 기존 가격은 $\delta=1/8$까지만 적용된다. 이후 자동 일부가 I로 바뀌어야 한다. 제안 증가는 옛 증명서의 상한이지 달성 증가가 아니다.

</details>

### 3. 논리: 내부점이 이길 수 있는가?
{: id="3-logical-reasoning-can-an-interior-point-win"}

작은 공 전체가 실행가능한 완전차원 영역의 엄격 내부점 $x$가 $c\ne0$의 $c^Tx$를 최대화할 수 있는가? $c=0$이면?

<details markdown="1">
<summary>힌트</summary>

$c$ 방향으로 작게 움직인다.

</details>

<details markdown="1">
<summary>풀이</summary>

충분히 작은 $\epsilon>0$의 $x+\epsilon c$는 실행가능하며 목적은 $c^Tx+\epsilon c^Tc$로 $c^Tc=\sum_jc_j^2>0$라 더 크다. 비상수 목적을 최대화할 수 없다. $c=0$이면 모두 최적이다. 완전차원이 중요하다. 선분의 상대 내부는 목적이 그 직선에서 상수이면 최적일 수 있다.

</details>

### 4. 응용: 최소비용 혼합
{: id="4-practical-application-a-minimum-cost-blend"}

성분 6단위 이상이 필요하다. 사료 A는 kg당 2단위·비용3, B는 1단위·비용2이며 A는 최대2kg이다. 분할 가능하고 다른 조건은 없다고 하여 LP를 세우고 풀라.

<details markdown="1">
<summary>힌트</summary>

수요는 하한, A공급은 상한이다. 성분 단위당 A가 싸다.

</details>

<details markdown="1">
<summary>풀이</summary>

kg변수 $a,b$에서 $2a+b\ge6,0\le a\le2,b\ge0$ 아래 $3a+2b$를 최소화한다. 양의 비용이라 과공급은 불필요하다. $2a+b=6$의 비용은 $12-a$여서 $a=2,b=2$, 비용10이다. 과공급에도 유효한 증명서는

$$
3a+2b=2(2a+b)-a\ge12-2=10.
$$

</details>

## 참고문헌과 추가 학습
{: id="references-and-further-learning"}

- [Kantorovich, Mathematical Methods of Organizing and Planning Production (1939; 영문1960)](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.6.4.366), [전문](https://resistir.info/livros/kantorovich_mathematical_methods.pdf): 생산계획 동기·원래 수치.
- [George Dantzig, Irv Lustig 인터뷰 구술사](https://www.informs.org/Explore/History-of-O.R.-Excellence/Oral-Histories/George-Dantzig): 군사계획·초기 계산의 당사자 회고.
- [Dantzig, Linear Programming (2002), Operations Research 50(1), 42–47](https://pubsonline.informs.org/doi/pdf/10.1287/opre.50.1.42.17798): 용어 기원과 von Neumann·쌍대성 연결의 회고.
- [Dantzig, Origins of the Simplex Method](https://archive.computerhistory.org/resources/access/text/2024/06/102739347-05-0002-acc.pdf#page=169): 기록 모음의 심플렉스 기하 관점 설명.
- [Karmarkar, A New Polynomial-Time Algorithm for Linear Programming (1984), Combinatorica 4, 373–395](https://www.stat.uchicago.edu/~lekheng/courses/302/classics/karmarkar.pdf): 내부 접근·복잡도 보장의 원논문.
- [Boyd·Vandenberghe, Convex Optimization §4.3](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf#page=160): 표기·표준형 변환·볼록 최적화 연결.
- [Goemans, Lecture notes on bipartite matching 정리1.6](https://math.mit.edu/~goemans/18433S15/matching-notes.pdf#page=8): 배정 LP 정수 꼭짓점과 매칭 알고리즘.
- [Goemans MIT 18.310 LP 자료](https://ocw.mit.edu/courses/18-310-principles-of-discrete-applied-mathematics-fall-2013/11d00f8f0f460a5e59b5e97322a218a9_MIT18_310F13_Ch8.pdf): 모델·기저 실행가능해·§§4.2–4.3 원쌍대 규칙.
- [MIT 6.854 강의10](https://ocw.mit.edu/courses/6-854j-advanced-algorithms-fall-2008/302900e3a66f2a3b9c9f31bf91cd31fe_lec10.pdf#page=5): 다면체·기저·심플렉스 기하.
- [MIT LP 알고리즘](https://courses.csail.mit.edu/6.854/20/Notes/n14-LP_algorithms.html): 피벗 대수·감소비용·복잡도 한계.
- [MIT LP 쌍대성](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html): 한계값·증명서·강한 쌍대성.
- [SciPy linprog](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linprog.html): 입력 관례·상태·여유·HiGHS 선택.
- [Dantzig, Linear Programming and Extensions, RAND R-366-PR (1963)](https://www.rand.org/pubs/reports/R366.html): 정식화·심플렉스·쌍대성·응용을 내려받는 역사 교재.
