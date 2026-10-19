---
title: 볼록성
subject: Optimization
lang: ko
translation_key: wiki-optimization-convexity
description: 생산계획의 혼합으로 볼록집합을 이해하고 볼록함수의 현 부등식과 구별합니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: dab3772a6239245aeaed105c78d209a02e0002a895f18a25018001bff53e38a3
interactive_examples: true
---

## 생산계획 섞기: 무엇이 여전히 가능한가?
{: id="mixing-production-plans-what-remains-possible"}

공장 용량과 부품 균형을 모두 지키는 두 계획을 절반씩 실행해도 조건이 유지될까? **집합의 볼록성**은 모든 혼합이 집합 안에 남는다는 조건이다. **함수의 볼록성**은 혼합 입력의 값이 양 끝 값의 대응 평균 이하라는 별도 요구이다. [Boyd·Vandenberghe의 집합 정의 2.3](https://web.stanford.edu/class/ee364a/lectures/sets.pdf#page=5), [함수 정의 3.1](https://web.stanford.edu/class/ee364a/lectures/functions.pdf#page=4).

[선형계획법]({{ '/wiki/optimization/linear-programming-ko/' | relative_url }})에서 푼 Kantorovich의 출판 생산 문제로 시작한다. 역사적 최적화 문제에 볼록성을 적용하며 볼록성의 기원이라는 주장은 아니다. 계산·증명은 현대적 재유도이고 만든 보충 예제는 별도로 표시한다.

### 출판 생산율과 분할 가능한 시간 모델
{: id="the-published-rates-and-the-divisible-time-model"}

Kantorovich의 1939년 책은 부품 I·II 하나씩의 완제품을 최대화하는 시간 배분을 묻는다. 예제 1·표 1의 생산율은 실제 공장 관측이 아닌 설명용이라고 명시된다. [영문 번역 369–370쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=4).

| 기계군 | 가용 기계·일 | 기계·일당 부품 I | 기계·일당 부품 II |
| --- | --- | --- | --- |
| 밀링 | 3 | 10 | 20 |
| 터릿 선반 | 3 | 20 | 30 |
| 자동 터릿 선반 | 1 | 30 | 80 |

**기계·일**은 한 기계가 하루 일하는 양이다. 세 군의 부품 I 시간을 $m,t,a$라 두면 나머지 $3-m,3-t,1-a$는 부품 II에 쓴다. 시간은 분할 가능하고 모두 쓰며 생산율은 일정·가산이고 준비비용은 없다. 합계는

$$
P=10m+20t+30a,\qquad Q=230-20m-30t-80a.
$$

$0\le m,t\le3$, $0\le a\le1$과 $P=Q$를 요구한다. [원문 문제 A, 371–372쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=6)의 완전 가동·일치 출력 가정이다. 분수 출력은 일일 생산율이지 정수 개수 일정 자체는 아니다.

원문은 군별 균형과 전문화를 비교한다. 표 1에서 유도한 정확한 배분은

$$
x^{\mathrm S}=\left(2,\frac95,\frac8{11}\right),\qquad
x^{\mathrm O}=\left(\frac83,3,0\right).
$$

벡터는 좌표 목록 $x=(m,t,a)$이다. 대입하면 일치 출력은

$$
z_{\mathrm S}=20+36+\frac{240}{11}=\frac{856}{11},\qquad
z_{\mathrm O}=\frac{80}{3}+60=\frac{260}{3}.
$$

S는 군별 균형, O는 최적이다. [LP 문서에서 최적성을 증명한다]({{ '/wiki/optimization/linear-programming-ko/' | relative_url }}#eliminate-the-balance-equation-to-see-the-tradeoff). 분수는 출판 생산율의 현대적 계산이며 [표 2, 371쪽](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=6)의 정수 합계 77·86을 정확한 분수시간 식으로 취급하지 않는다.

### 일반화 전에 혼합 계산하기
{: id="calculate-a-mixture-before-generalizing"}

최적 계획에 $\theta$, 군별 균형에 $1-\theta$를 주고 $0\le\theta\le1$이라 하면

$$
x_\theta=(1-\theta)x^{\mathrm S}+\theta x^{\mathrm O}.
$$

가중치는 작업시간 비율로 합이 1이며 음수가 아니다. $\theta=1/2$에서 각 좌표를 평균하면

$$
x_{1/2}=\left(\frac73,\frac{12}{5},\frac4{11}\right).
$$

세 시간 제한이 모두 유지된다. 두 출력을 직접 확인하면

$$
P=\frac{70}{3}+48+\frac{120}{11}=\frac{2714}{33},
$$

$$
Q=230-\frac{140}{3}-72-\frac{320}{11}=\frac{2714}{33}.
$$

하루 약 $82.24$세트이며 $(z_\mathrm S+z_\mathrm O)/2$와 같다. 중점은 S를 개선하지만 O에 미치지 않는 유효 계획이다.

$[0,1]$의 **모든** $\theta$에서 가능하다. 0과 용량 사이 두 수의 가중평균도 그 범위이다. 양 끝에서 균형식 $30m+50t+110a=230$이므로 혼합에서도 $(1-\theta)230+\theta230=230$이다. 생산량도 평균된다.

$$
z_\theta=(1-\theta)\frac{856}{11}+\theta\frac{260}{3}.
$$

{% include image.html src="/assets/images/wiki/convexity-machine-segment-ko.svg" alt="터릿 시간 t·자동 시간 a의 실행가능 다각형이 S=(9/5,8/11), O=(3,0)와 중점 M=(12/5,4/11)을 잇는 선분 전체를 포함한다." caption="출판 생산율의 현대적 연속 재유도이다. 두 축은 부품 I 기계·일이고 음영은 실행가능 계획, 주황 선분은 S·O 혼합이다. m=(230−50t−110a)/30으로 밀링 시간을 복원한다. 입력 배분 그림이며 생산 높이 그래프가 아니다." %}

{% include wiki-lab-ko.html kind="convexity-mixture" title="Kantorovich의 출판 기계 예제에서 두 계획 섞기" source_url="https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=4" source_label="Kantorovich, 예제 1·표 1, 369–370쪽" plot_description="실행가능 기계 배분 다각형과 군별 균형·최적 계획 사이를 움직이는 점." %}

가중치 0, $1/2$, 1을 시험하자. 점은 선분을 움직이고 출력은 세 시간, 두 부품 합계와 양 끝 출력의 평균을 보인다. 생산율·용량·가정은 고정된다. 가중치 변경은 역사적 관측이 아닌 가상 시분할 실험이다. 복원은 출판 자료와 본문의 중점 혼합으로 돌아가며 JavaScript 없이도 정확 중점 계산·그림은 유용하다.

## 볼록집합: 모든 선분이 안에 남는다
{: id="convex-sets-every-segment-stays-inside"}

$C\subseteq\mathbb R^n$이 **볼록**이라는 것은

$$
x,y\in C,\quad0\le\theta\le1
\quad\Longrightarrow\quad(1-\theta)x+\theta y\in C.
$$

$\in$는 속함, $\mathbb R^n$은 실수 좌표 $n$개 목록의 공간이다. $(1-\theta)x+\theta y$는 $x,y$ 사이 **선분**을 이룬다. 모든 쌍과 허용 가중치에 성립해야 한다. 성공 선분 하나는 예시지만 실패 하나는 볼록성을 반증한다. [슬라이드 2.3](https://web.stanford.edu/class/ee364a/lectures/sets.pdf#page=5).

**볼록결합** $\sum_i\theta_ix_i$는 $\theta_i\ge0$, $\sum_i\theta_i=1$이다. 반복 혼합으로 볼록집합은 그 점들의 모든 유한 볼록결합을 포함한다. **볼록껍질**은 그런 결합의 집합이다. [슬라이드 2.4](https://web.stanford.edu/class/ee364a/lectures/sets.pdf#page=6).

### 선형 제약과 교집합이 작동하는 이유
{: id="why-linear-constraints-and-intersections-work"}

**아핀**은 선형식과 상수의 합 $g(x)=b^Tx+d$이며 $b^Tx=\sum_i b_ix_i$는 내적이다. 가중평균을 보존한다.

$$
g((1-\theta)x+\theta y)=(1-\theta)g(x)+\theta g(y).
$$

양 끝 값이 상한 이하이면 평균도 이하이고 두 값이 요구값이면 평균도 같다. 따라서 선형 부등식은 볼록 **반공간**, 등식은 볼록 아핀 집합을 정의한다. 이 제약들의 유한 교집합이 **다면체**이다. [슬라이드 2.6·2.9](https://web.stanford.edu/class/ee364a/lectures/sets.pdf#page=8).

더 일반적으로 볼록집합들의 교집합은 볼록이다. 각 집합 안에 남는 선분은 교집합에도 남는다. 기계 모델의 동시 용량·균형 제약도 이 증명에 해당한다. 합집합은 다르다. 만든 보충 집합 $[-2,-1]\cup[1,2]$는 $-1,1$을 포함하지만 중점 0은 없다. [교집합 규칙 2.12](https://web.stanford.edu/class/ee364a/lectures/sets.pdf#page=15).

채운 원판은 볼록하지만 원주만은 아니다. 반대 경계점의 중점인 중심이 없기 때문이다. 한 점과 공집합도 위반 쌍이 없어 볼록하다. 곡선 경계·비어 있지 않은 내부·무한한 점을 요구하지 않는다.

### 원뿔과 분리
{: id="cones-and-separation"}

**볼록원뿔**은 $\alpha,\beta\ge0$인 모든 $\alpha x+\beta y$를 포함하며 계수 합이 1일 필요는 없다. 고정 생산 열에 비음수 활동량을 적용하면 예가 된다. 혼합에 총규모 변경을 허용한 확장이다. [슬라이드 2.5](https://web.stanford.edu/class/ee364a/lectures/sets.pdf#page=7).

[Farkas 보조정리]({{ '/wiki/optimization/farkas-lemma-ko/' | relative_url }}#geometry-a-cone-and-a-separating-line)는 목표가 유한생성 원뿔에 속하는지 묻는다. 아니라면 선형 측정이 모든 달성 출력에서 목표를 분리한다. 해당 문서는 최근접점 구성에 필요한 닫힘 가정까지 증명한다.

## 볼록함수: 혼합과 혼합값 비교하기
{: id="convex-functions-compare-a-mixture-with-a-mixed-value"}

실행가능성만으로 입력 혼합 시 비선형 비용 변화를 알 수 없다. 보충 예제로 강도 $u$의 비용을 $f(u)=u^2$로 정하고 0과 2의 같은 가중치를 비교하면

$$
f\!\left(\frac{0+2}{2}\right)=1,
\qquad\frac{f(0)+f(2)}2=2.
$$

이 모델은 평균 강도로 일정하게 운전하는 비용이 양극단을 절반씩 쓰는 것보다 작다. 왼쪽은 **평균 입력**을 평가하고 오른쪽은 **두 비용**을 평균한다. 다른 연산이며 이 비선형 비용은 Kantorovich 자료가 아닌 교육용 선택이다.

### 현 부등식
{: id="the-chord-inequality"}

볼록 정의역 $C$의 $f:C\to\mathbb R$가 **볼록**이라는 것은

$$
f((1-\theta)x+\theta y)
\le(1-\theta)f(x)+\theta f(y)
\quad(x,y\in C,\ 0\le\theta\le1).
$$

**정의역**은 허용 입력 집합이고 **현**은 그래프 점 $(x,f(x)),(y,f(y))$의 직선 선분이다. 혼합 입력에서 그래프는 현 이하이다. 부등호가 반대이면 **오목**, 즉 $-f$가 볼록이다. 아핀함수는 등호여서 볼록·오목 모두이다. [슬라이드 3.1](https://web.stanford.edu/class/ee364a/lectures/functions.pdf#page=4).

$f(u)=u^2$에서 오른쪽에서 왼쪽을 빼 전개하면

$$
\begin{aligned}
&(1-\theta)x^2+\theta y^2-((1-\theta)x+\theta y)^2\\
&\qquad=\theta(1-\theta)(x-y)^2\ge0.
\end{aligned}
$$

이 직접 계산은 모든 실수 끝점에 증명한다. 끝점 가중치 또는 $x=y$에서 등호이다. $-u^2$는 차이 부호가 반대여서 오목이고 서로 다른 끝점·$0<\theta<1$에서 볼록 부등식을 어긴다.

{% include image.html src="/assets/images/wiki/convexity-chords-ko.svg" alt="u²에서 (0,0)·(2,4)의 현은 그래프 위로 u=1에서 높이 2 대 1이다. −u²의 현은 아래로 −2 대 −1이다." caption="만든 보충 예제. 파랑은 그래프, 주황 점선은 양 끝의 현이다. 세로 간격은 같은 입력 u=1의 두 높이를 비교한다. 볼록은 현 아래, 오목은 위에 놓인다." %}

{% include wiki-lab-ko.html kind="convexity-chord" title="혼합 입력의 비용과 평균 비용 비교" plot_description="함수 그래프, 양 끝 현과 선택한 혼합 입력의 두 높이." %}

끝점·가중치를 바꿔 $u^2$, 절댓값 $|u|$, $-u^2$를 비교하자. 끝점이 같으면 현은 한 점이고 가중치 0·1은 등호이다. 절댓값은 0에 모서리가 있지만 부등식은 성립한다. 보충용 예제이며 제어기는 특정 현을 시험하고 위 대수는 제곱의 모든 끝점 주장을 증명한다.

### 더 많은 입력 평균: Jensen 부등식
{: id="averaging-more-inputs-jensens-inequality"}

두 점 정의를 반복하면 **Jensen 부등식**의 유한 가중 형태를 얻는다.

$$
f\!\left(\sum_i\theta_i x_i\right)\le\sum_i\theta_i f(x_i),
\qquad\theta_i\ge0,\quad\sum_i\theta_i=1.
$$

가중평균의 함수와 함수값의 가중평균을 비교한다. [슬라이드 3.13](https://web.stanford.edu/class/ee364a/lectures/functions.pdf#page=16). 같은 가중치의 보충 입력 $0,1,2$와 제곱함수에서는 $1\le5/3$이다. **최선의** 끝점보다 혼합이 낫다는 뜻은 아니다. 앞 예제는 $f(0)=0<f(1)=1$이다.

## 함수 부등식을 볼록 실행가능집합으로 바꾸기
{: id="turning-function-inequalities-into-convex-feasible-sets"}

**하위수준집합**은 값이 문턱 이하인 $C_\alpha=\{x\in C:f(x)\le\alpha\}$이다. $f$가 볼록이고 $x,y\in C_\alpha$이면

$$
f((1-\theta)x+\theta y)
\le(1-\theta)\alpha+\theta\alpha=\alpha.
$$

따라서 하위수준집합은 볼록이다. $u^2\le4$는 $[-2,2]$지만 등식 $u^2=4$는 중점이 없는 $\{-2,2\}$이다. 표준 볼록 정식화가 볼록 부등식·아핀 등식을 쓰는 이유이다. [3.12](https://web.stanford.edu/class/ee364a/lectures/functions.pdf#page=15), [최적화 형태 4.7](https://web.stanford.edu/class/ee364a/lectures/problems.pdf#page=10).

**에피그래프(epigraph)**는 그래프와 그 위의 모든 점이다.

$$
\operatorname{epi}f=\{(x,s):x\in C,\ s\ge f(x)\}.
$$

$s$는 높이 좌표이다. 볼록함수의 에피그래프는 볼록이다. 허용 높이 둘을 섞으면 혼합 함수값 이상의 높이가 된다. 반대로 높이 $f(x),f(y)$의 에피그래프 볼록성에서 현 부등식을 얻는다. [3.12](https://web.stanford.edu/class/ee364a/lectures/functions.pdf#page=15). 함수·집합을 직접 연결하지만 그래프 자체가 볼록집합일 필요는 없다.

## 국소 최소점이 전역이 되는 이유
{: id="why-local-minima-become-global"}

볼록집합 $C$에서 볼록함수 $f$를 최소화하자. **국소 최소점** $x_\star$는 충분히 가까운 모든 실행가능점 이상으로 좋고 **전역 최소점**은 $C$의 모든 점 이상으로 좋다.

더 좋은 실행가능점 $y$, $f(y)<f(x_\star)$가 있다고 가정하자. $0<\theta<1$의 $x_\theta=(1-\theta)x_\star+\theta y$는 집합 볼록성으로 실행가능하며 함수 볼록성으로

$$
f(x_\theta)\le(1-\theta)f(x_\star)+\theta f(y)<f(x_\star).
$$

$\theta$를 임의로 작게 하면 더 좋은 $x_\theta$가 $x_\star$에 한없이 가까워져 국소 최소성과 모순이다. **모든 국소 최소점은 전역이다.** 집합 볼록성은 선분의 실행가능성을, 함수 볼록성은 목적값을 제어한다. [Boyd·Vandenberghe 4.9](https://web.stanford.edu/class/ee364a/lectures/problems.pdf#page=12)의 확장 유도이다.

생산 모델의 아핀 출력 최대화는 그 음수인 볼록함수 최소화와 같다. 일반적으로 볼록집합의 오목함수 최대화도 목적 부호를 바꿔 같은 보장을 얻는다. 임의의 볼록함수 최대화에는 적용되지 않는다.

### 엄격한 볼록성은 최소점이 많아야 하나임을 준다
{: id="strict-convexity-gives-at-most-one-minimizer"}

서로 다른 $x,y$와 $0<\theta<1$에서 현 부등식이 엄격하면 **엄격한 볼록성**이다. [3.1](https://web.stanford.edu/class/ee364a/lectures/functions.pdf#page=4). 서로 다른 최적점 둘이면 중점이 더 작아 모순이므로 볼록 실행가능집합의 최소점은 **많아야 하나**이다.

존재는 별개이다. $u>0$의 보충 함수 $1/u$는 $f''=2/u^3>0$이지만 0에 접근만 하며 달성하지 않는다. 엄격히 볼록해도 최소점이 없다. 열린 $(0,1)$의 $u^2$도 제외된 끝점에서 최선 하한에 접근한다. “엄격히 볼록”을 “유일해가 존재”로 읽으면 안 된다. [미달성 예제 4.4](https://web.stanford.edu/class/ee364a/lectures/problems.pdf#page=7).

## 기울기와 곡률: 이차형식 연결
{: id="slopes-and-curvature-links-to-quadratic-forms"}

미분가능 함수의 **기울기** $\nabla f(x)$는 좌표 기울기를 모으며 변위와 내적하면 접선 근사이다. 열린 볼록 정의역에서 볼록성은 다음 전역 접선 하한과 동치이다.

$$
f(y)\ge f(x)+\nabla f(x)^T(y-x)\qquad\text{모든 }x,y.
$$

[슬라이드 3.8](https://web.stanford.edu/class/ee364a/lectures/functions.pdf#page=11). 제곱함수의 $u=1$ 접선은 $1+2(u-1)=2u-1$, 차이는 $(u-1)^2\ge0$이다. 현은 끝점 사이에서 위로, 접선은 아래로 볼록 그래프를 제한한다.

$\nabla f(x_\star)=0$이면 하한으로 전역 최소이다. 제약 경계에서는 기울기가 0일 필요 없다. $u\ge1$의 $u^2$ 최소점은 1이며 도함수는 2이다. 볼록 실행가능집합의 열린 볼록 근방에 정의된 미분가능 볼록함수의 올바른 제약 판정은

$$
\nabla f(x_\star)^T(y-x_\star)\ge0\qquad\text{모든 가능한 }y.
$$

모든 실행가능 방향의 1차 변화가 비음수이다. 경계 예제는 $2(y-1)\ge0$이다. [4.10](https://web.stanford.edu/class/ee364a/lectures/problems.pdf#page=13). [쌍대성]({{ '/wiki/optimization/duality-ko/' | relative_url }}#kkt-conditions-explain-the-matching-point)은 승수로 제약 정지성을 쓴다.

### Hessian은 모든 방향을 시험한다
{: id="the-hessian-tests-every-direction"}

**Hessian** $\nabla^2f(x)$는 2차 편미분 행렬이다. 열린 볼록 정의역에서 2회 연속 미분가능하면

$$
f\text{는 볼록}\quad\Longleftrightarrow\quad
v^T\nabla^2 f(x)v\ge0\quad\text{모든 }x,v.
$$

행렬 조건은 **양의 준정부호성(PSD)**이다. 직선 $g(s)=f(x+sv)$에서 $g''(s)=v^T\nabla^2f(x+sv)v$로 모든 위치·방향의 위쪽 곡률을 시험한다. 모든 곳의 양의 정부호는 엄격한 볼록성에 충분하지만 필요는 없다. $u^4$는 0에서 2차 미분이 0이어도 엄격히 볼록하다. [3.9–3.10](https://web.stanford.edu/class/ee364a/lectures/functions.pdf#page=12). 도함수 $4u^3$가 엄격히 증가해 비자명한 현은 내부점 뒤의 평균 기울기가 앞보다 엄격히 크다.

대칭 $A$, 고정 $r$의 [이차함수]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }}#derivatives-and-optimization)

$$
f(x)=\frac12x^TAx-r^Tx+d
$$

는 기울기 $Ax-r$, Hessian $A$이다. PSD는 볼록성을, [SPD]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix-ko/' | relative_url }}#quadratic-minimization)는 엄격한 볼록성과 가역성을 주어 비제약 최소점은 $Ax=r$의 유일해이다. PSD만으로 존재하지 않을 수 있다. $A=\operatorname{diag}(1,0)$, $r=(0,1)^T$이면 $x_1^2/2-x_2$는 $x_2$가 커지며 무한히 감소한다. $r=0$이면 모든 $(0,x_2)$가 최소점이다.

[최소제곱]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }}#solving-normal-equations)의 $f(x)=\lVert Bx-b\rVert_2^2$에서 $Bx$는 예측, $b$는 측정이다. Hessian $2B^TB$는 $v^T(2B^TB)v=2\lVert Bv\rVert_2^2\ge0$이므로 열이 종속이어도 볼록하다. 독립 열이면 양의 정부호로 유일 적합이다. [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }}#derivatives-and-optimization)에서 미분·정규방정식을 전개한다.

## 흔한 실수와 유용한 반례
{: id="common-mistakes-and-useful-counterexamples"}

보충용으로 만든 예제와 추론이다.

- **중점 하나 확인은 증명이 아니다.** 한 쌍·가중치의 시험일 뿐 볼록성은 모두를 양화한다. 위 제곱 간격 항등식이 $u^2$의 증명을 준다.
- **볼록 정의역의 모든 함수가 볼록하지는 않다.** $-u^2$는 $\mathbb R$에서 볼록하지 않다. 반대로 볼록 목적도 비볼록 실행가능집합을 고치지 못한다. $\{-1,2\}$의 $u^2$는 고립된 국소 최소점이 둘이며 $-1$만 전역이다.
- **볼록이 엄격한 굽음·매끄러움을 뜻하지 않는다.** 아핀함수는 볼록이고 $|u|$는 모서리가 있어도 볼록하다. 양의 반직선에서는 $|u|=u$여서 엄격히 볼록하지 않다.
- **좌표 곡률의 양수만으로 부족하다.** $x_1^2+4x_1x_2+x_2^2$는 Hessian 대각이 2지만 $(s,-s)$에서 $-2s^2$이다. [이차형식 반례]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }}#definiteness-what-signs-are-possible)처럼 전체 Hessian의 모든 방향을 확인한다.
- **한 양의 Hessian으로 전역 볼록성이 증명되지 않는다.** $u^4-u^2$는 $u=1$에서 2차 미분 양수, 0에서 음수이다. 판정은 정의역 전체에 적용한다.
- **볼록성만으로 쌍대성·존재가 정해지지 않는다.** [쌍대성 문서]({{ '/wiki/optimization/duality-ko/' | relative_url }}#when-do-nonlinear-bounds-meet)는 강한 쌍대성·달성·Slater 같은 제약 자격조건을 구별한다.

## 연습문제
{: id="practice-problems"}

직접 만든 문제이다. 힌트·풀이 전에 시도하자.

### 1. 손계산: 최적 계획의 1/4
{: id="1-hand-calculation-a-quarter-of-the-optimal-plan"}

출판 기계 자료로 $x_{1/4}=(3/4)x^\mathrm S+(1/4)x^\mathrm O$를 구하고 반올림 없이 균형·출력을 확인하라.

<details markdown="1">
<summary>힌트</summary>

좌표별 평균을 구한다. 출력도 $856/11$, $260/3$의 같은 가중평균이다.

</details>

<details markdown="1">
<summary>풀이</summary>

시간은 $m=13/6,t=21/10,a=6/11$로 각각 용량을 지킨다. 균형은 $30m+50t+110a=65+105+60=230$이다. 부품 I 출력은

$$
P=\frac{65}{3}+42+\frac{180}{11}=\frac{2641}{33}.
$$

부품 II는 $Q=230-130/3-63-480/11=2641/33$이다. 끝점 평균도 $(3/4)(856/11)+(1/4)(260/3)=2641/33$으로 하루 약 $80.03$세트이다. 재유도한 계획의 가상 혼합이지 역사적 출처의 인쇄값이 아니다.

</details>

### 2. 해석: 혼합과 하루 전체 배정
{: id="2-interpretation-mixing-and-whole-day-assignments"}

가상의 새 정책이 각 기계를 하루 내내 한 부품에만 쓰게 한다. 허용 일일 배정 둘의 모든 볼록혼합도 허용 배정인가? 무작위로 둘 중 하나를 고르면 달라지는가?

<details markdown="1">
<summary>힌트</summary>

자동 기계만 보자. 부품 I 시간은 0 또는 1 기계·일이어야 한다.

</details>

<details markdown="1">
<summary>풀이</summary>

아니다. 0과 1의 중점 $1/2$는 이 정책에서 금지되어 부품 균형 전에도 배정 집합은 비볼록이다. 무작위 선택의 분수 **기대** 배분과 매일 실현되는 정수 배정은 다르다. 기대값으로 분수 계획의 일일 실행가능성이 증명되지 않는다. 여러 날의 평균은 저장·출력 조건이 허용하면 의미가 있지만 추가 가정이다. 원래 분할시간 모델은 하루 분할을 허용해 혼합이 직접 가능하다.

</details>

### 3. 논리: 최소점 집합의 모양
{: id="3-logical-reasoning-what-can-the-set-of-minimizers-look-like"}

볼록 실행가능집합 위 볼록함수의 최소점 집합이 볼록임을 증명하라. 반드시 점이 있는가? 엄격히 볼록하면 무엇이 달라지는가?

<details markdown="1">
<summary>힌트</summary>

같은 최선 값을 달성한 두 점의 혼합에 볼록성은 위쪽 상한, 최적성은 아래쪽 하한을 준다.

</details>

<details markdown="1">
<summary>풀이</summary>

$x,y$가 최솟값 $p$를 달성하면 실행가능 혼합은 $(1-\theta)p+\theta p=p$ 이하이고 최솟값보다 작을 수 없어 $p$이다. 최소점 집합은 볼록이다. $u>0$의 $1/u$처럼 하한 0을 달성하지 않아 비어 있을 수도 있다. 엄격히 볼록하면 서로 다른 최소점이 불가능해 공집합 또는 한 점이다. 볼록성은 존재를 주지 않고 해집합 모양을 설명한다.

</details>

### 4. 실용적 응용: 제약 최소제곱 적합
{: id="4-practical-application-a-constrained-least-squares-fit"}

보충용 모델이 비음수 기여 $x_1,x_2$로 측정 총합 3을 예측한다. $x_1,x_2\ge0$에서 $(x_1+x_2-3)^2$를 최소화하라. 볼록 문제인가? 모든 최소점을 찾고 $\alpha>0$의 벌점 $\alpha(x_1^2+x_2^2)$를 더하면 어떻게 되는가?

<details markdown="1">
<summary>힌트</summary>

비벌점 목적은 합에만 의존한다. 벌점에서는 대칭으로 같은 기여를 예상하고 기울기·Hessian으로 확인한다.

</details>

<details markdown="1">
<summary>풀이</summary>

비음수 사분면은 볼록이고 목적의 Hessian은

$$
2\begin{bmatrix}1&1\\1&1\end{bmatrix},
$$

이차형식 $2(v_1+v_2)^2\ge0$을 갖는다. $x_1+x_2=3$인 모든 비음수 쌍의 목적값은 0이므로 최소점은 $(0,3)$부터 $(3,0)$의 선분이다.

벌점은 Hessian에 항등행렬의 $2\alpha I$를 더한다. 이차형식은 $v\ne0$에서 $2(v_1+v_2)^2+2\alpha(v_1^2+v_2^2)>0$이다. 정지식은 $x_1+x_2-3+\alpha x_1=0$과 $x_2$의 대응식이다. 빼면 $x_1=x_2$, 각각 $3/(2+\alpha)>0$이다. 이 실행가능 정지점이 유일한 전역 최소점이다. 목적이 바뀌어 적합 합계는 $6/(2+\alpha)<3$이므로 유일성에는 적합 변화도 따른다.

</details>

## 참고문헌과 추가 학습
{: id="references-and-further-learning"}

- [L. V. Kantorovich, Mathematical Methods of Organizing and Planning Production, 1939년 저작의 1960년 영문 번역](https://resistir.info/livros/kantorovich_mathematical_methods.pdf). 예제 1·표 1의 369–370쪽은 생산율, 표 2의 371쪽은 정수 출력, 문제 A의 371–372쪽은 분할시간·완전 가동·일치 출력을 제공한다. 생산계획을 혼합 가능한 활동들의 집합으로 이해하는 데 유용하다.
- [Stephen Boyd·Lieven Vandenberghe, Convex Optimization 2장 슬라이드, Parth Nobel과 개정](https://web.stanford.edu/class/ee364a/lectures/sets.pdf). 2.3–2.5는 집합·껍질·원뿔, 2.6–2.12는 제약·다면체·교집합을 연결한다. 볼록 실행가능영역 판정 연습에 유용하다.
- [3장 슬라이드](https://web.stanford.edu/class/ee364a/lectures/functions.pdf). 3.1,3.8–3.13은 현·미분 판정·에피그래프·Jensen을 설명한다. 뒤에서는 모든 미분을 전개하지 않는 볼록성 증명 규칙을 다룬다.
- [4장 슬라이드](https://web.stanford.edu/class/ee364a/lectures/problems.pdf). 4.4,4.7–4.11은 미달성·볼록 정식화·국소/전역·제약 최적성을 구별한다. 최적화 주장을 정당화하는 가정을 확인하기 좋다.
- [저자들의 책·강의 자료](https://web.stanford.edu/~boyd/cvxbook/). 무료 교재의 2–4장은 긴 증명과 연습을 준다. 상한·승수는 [쌍대성]({{ '/wiki/optimization/duality-ko/' | relative_url }}), 행렬 곡률은 [이차형식]({{ '/wiki/linear-algebra/quadratic-form-ko/' | relative_url }})으로 이어가자.
