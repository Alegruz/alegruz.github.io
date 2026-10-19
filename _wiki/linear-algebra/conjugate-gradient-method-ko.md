---
title: 켤레기울기법
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-conjugate-gradient-method
translation_status: complete
translation_source_sha256: 411ad7d52aae34120f87d8f7d3e5692f02d0b50fe43db76c862c5f778b1ec795
interactive_examples: true
cg_examples: true
description: Hestenes와 Stiefel의 원문 연립방정식에서 켤레기울기법을 유도하고, 네 번의 반복 계산과 잔차, 에너지 오차, 전처리를 살펴봅니다.
last_modified_at: 2026-10-19
---

## 계수를 바꾸지 않고 큰 연립방정식 풀기

초기 기계 계산의 과제 중 하나는 적은 저장 공간으로 많은 연립일차방정식을 풀면서, 계수가 0인 것과 같은 유용한 구조를 유지하는 것이었습니다. Hestenes와 Stiefel은 1952년 논문에서 원래 행렬을 반복해서 사용하고 근삿값을 개선하는 방법을 명시적으로 추구했습니다. 서론에서는 이 요구를 경계값 문제를 근사하는 차분방정식과 연결합니다. [원문 1절, 409쪽](https://math.nist.gov/mcsd/Reports/2002/hestenes-steifel-52.pdf#page=1)을 참고하세요.

**켤레기울기법(conjugate gradient method, CG)**은 추정값, 잔차, 탐색 방향을 갱신하면서 $Ax=b$를 풉니다. 표준 선형 CG에는 실수 {% include wiki-related-link.html path="linear-algebra/symmetric-positive-definite-matrix" label="대칭 양의 정부호 행렬" %}, 즉 SPD 행렬이 필요합니다.

$$
A^T=A,\qquad v^TAv>0\quad\text{모든 }v\ne0.
$$

이 조건은 이차 에너지가 엄격 볼록하고, 0이 아닌 모든 탐색 방향에서 곡률이 양수가 되게 합니다. 복소수 연립방정식에서는 에르미트 양의 정부호 행렬과 켤레전치를 사용합니다. [SciPy의 CG 조건](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.linalg.cg.html)을 참고하세요.

{% include wiki-related-link.html path="linear-algebra/cholesky-decomposition" label="촐레스키 분해" %}는 $A$를 분해해서 같은 종류의 연립방정식을 풉니다. CG에는 대신 $v\mapsto Av$ 연산이 필요합니다. 이 차이는 $A$가 {% include wiki-related-link.html path="linear-algebra/sparse-matrices-and-storage-formats" label="희소 행렬" %}이거나 행렬을 명시적으로 만들지 않고 곱을 계산할 수 있을 때 유용합니다. 먼저 원문에 실린 수치 문제에서 갱신식을 유도한 뒤 일반적인 방법을 설명하겠습니다.

## 원문에 실린 네 방정식 예제

**원문에 발표된 설명용 수치이며 물리적 단위는 없습니다.** Hestenes와 Stiefel의 [19절 예제 1과 표 1, 433쪽](https://math.nist.gov/mcsd/Reports/2002/hestenes-steifel-52.pdf#page=25)은 다음을 사용합니다.

$$
A=\begin{bmatrix}
1&2&-1&1\\
2&5&0&2\\
-1&0&6&0\\
1&2&0&3
\end{bmatrix},\qquad
b=\begin{bmatrix}0\\2\\-1\\1\end{bmatrix},\qquad
x_0=\begin{bmatrix}1\\0\\0\\0\end{bmatrix}.
$$

원문은 우변을 $k$, 갱신 계수를 $a_i,b_i$, 해를 $h$로 씁니다. 여기서는 각각 $b,\alpha_i,\beta_i,x_\star$로 바꿉니다. 행렬, 초기 추정값, 우변은 그대로입니다. 아래 계산은 이 예제를 현대 표기로 다시 유도한 정확한 산술 계산이며, 실제 응용에서 측정한 자료가 아닙니다.

먼저 조건을 확인합시다. 행렬은 대칭이며, 다음의 직접 계산으로 양의 정부호임을 증명할 수 있습니다.

$$
v^TAv=(v_1+2v_2-v_3+v_4)^2
       +(v_2+2v_3)^2+(v_3+v_4)^2+v_4^2.
$$

제곱을 전개하면 $A$가 복원됩니다. 합이 0이라면 마지막 제곱에서 $v_4=0$, 세 번째에서 $v_3=0$, 두 번째에서 $v_2=0$, 첫 번째에서 $v_1=0$을 얻습니다. 따라서 0이 아닌 모든 벡터의 에너지는 양수입니다. 이것이 촐레스키 분해의 바탕인 제곱합 논리입니다.

### 잔차는 방정식이 아직 맞지 않는 정도를 나타냅니다

**잔차(residual)**는 $r_k=b-Ax_k$입니다. 각 성분은 해당 방정식의 불일치를 나타냅니다. 초기 추정값에서는

$$
Ax_0=(1,2,-1,1)^T,\qquad r_0=(-1,0,0,0)^T.
$$

처음에는 첫 방정식만 맞지 않습니다. 그렇다고 다른 미지수가 이미 정확하다는 뜻은 **아닙니다**. 한 좌표를 바꾸면 여러 방정식이 바뀔 수 있습니다. 실제로 최종 해는 $x_\star=(-65,24,-11,6)^T$입니다.

어떤 보정을 할지 결정하기 위해 방정식을 최소화 문제로 바꿉시다.

$$
f(x)=\frac12x^TAx-b^Tx.
$$

대칭성으로부터 $\nabla f(x)=Ax-b=-r$입니다. **기울기(gradient)**는 좌표별 변화율을 모은 벡터이며, 그 음의 방향은 보통의 유클리드 거리에서 국소적으로 가장 빠르게 감소하는 방향입니다. SPD 조건은 이 {% include wiki-related-link.html path="linear-algebra/quadratic-form" label="이차함수" %}를 {% include wiki-related-link.html path="optimization/convexity" label="엄격 볼록" %}하게 하므로, 정상점 $Ax=b$가 유일한 최솟점입니다. 이러한 이차함수 해석은 [Shewchuk의 3–4절](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf)에서 설명합니다.

### 직선 위의 최소화로 첫 단계를 유도하기

$p_0=r_0$로 시작합니다. 일반적인 방향 $p\ne0$을 따라가면

$$
f(x+\alpha p)=f(x)-\alpha p^Tr+\frac{\alpha^2}{2}p^TAp.
$$

이 한 변수 이차함수를 미분하고 도함수를 0으로 놓으면

$$
\alpha=\frac{p^Tr}{p^TAp}.
$$

첫 단계에서는 $p_0=r_0$이므로

$$
Ap_0=(-1,-2,1,-1)^T,\quad
\alpha_0=\frac{r_0^Tr_0}{p_0^TAp_0}=1.
$$

따라서

$$
x_1=x_0+p_0=0,\qquad
r_1=r_0-Ap_0=(0,2,-1,1)^T.
$$

첫 불일치는 사라졌지만 다른 세 개가 생겼습니다. 잔차 노름은 $1$에서 $\sqrt6$으로 커졌습니다. 이 단계를 잘못되었다고 판단하기 전에 무엇이 개선되는지 이해해야 합니다.

## 앞서 한 일을 되돌리지 않으며 에너지 개선하기

$e_k=x_k-x_\star$를 **해의 오차(solution error)**라고 합시다. 잔차와 오차는 서로 다른 벡터입니다.

$$
r_k=-Ae_k.
$$

$Ax_\star=b$를 이용해 전개하고 항을 소거하면

$$
f(x)-f(x_\star)=\frac12(x-x_\star)^TA(x-x_\star)
=\frac12\lVert x-x_\star\rVert_A^2.
$$

여기서 $\lVert v\rVert_A=\sqrt{v^TAv}$는 **에너지 노름(energy norm)**으로, 행렬의 곡률을 반영하여 길이를 측정합니다. 이것은 {% include wiki-related-link.html path="linear-algebra/vector-norm" label="벡터 노름" %}이며, 방향별 가중치가 유클리드 노름 $\lVert v\rVert_2=\sqrt{\sum_i v_i^2}$와 다릅니다. [Stanford CG 강의 슬라이드 6–8](https://web.stanford.edu/class/ee364b/lectures/conj_grad_slides.pdf#page=7)을 참고하세요.

### 켤레 방향은 에너지 기하에서 수직입니다

$p_0$를 따라 이동한 뒤 직선 위에서 최소화하면 새 기울기는 $p_0$와 직교합니다. 나중에 $p_1$을 따라 이동할 때도 이 조건을 유지하려면

$$
p_0^T\nabla f(x_1+\alpha p_1)
=p_0^T\nabla f(x_1)+\alpha p_0^TAp_1=0.
$$

첫 항은 이미 0이므로 다음 방향은 $p_0^TAp_1=0$을 만족해야 합니다. 이 관계를 만족하는 방향을 **A 켤레(A conjugate)**라고 합니다. 보통의 내적에서는 수직일 필요가 없습니다. 이는 {% include wiki-related-link.html path="linear-algebra/gram-schmidt-orthogonalization" label="그람–슈미트의 직교성" %}에 가중치를 준 형태입니다. [Shewchuk의 7절](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf)을 참고하세요.

$p_1=r_1+\beta_0p_0$로 구성합시다. 켤레 조건에 의해

$$
\beta_0=-\frac{r_1^TAp_0}{p_0^TAp_0}.
$$

이 예제에서 $r_1^TAp_0=-6$, $p_0^TAp_0=1$이므로

$$
\beta_0=6,\qquad p_1=(-6,2,-1,1)^T,\qquad Ap_1=(0,0,0,1)^T.
$$

특히 $p_0^TAp_1=0$이지만 $p_0^Tp_1=6\ne0$입니다. 보통의 수직성을 검사하면 잘못된 기준을 적용하게 됩니다.

### 원문 계산 마무리하기

$p_1^Tr_1=6$, $p_1^TAp_1=1$이므로 다음 보폭은 $\alpha_1=6$입니다.

$$
x_2=(-36,12,-6,6)^T,\qquad r_2=(0,2,-1,-5)^T.
$$

이제 $\beta_1=\lVert r_2\rVert_2^2/\lVert r_1\rVert_2^2=30/6=5$이므로

$$
p_2=(-30,12,-6,0)^T,\quad Ap_2=(0,0,-6,-6)^T,\quad
\alpha_2=\frac{30}{36}=\frac56.
$$

따라서 $x_3=(-61,22,-11,6)^T$, $r_3=(0,2,4,0)^T$입니다. 마지막으로

$$
\beta_2=\frac{20}{30}=\frac23,\quad
p_3=(-20,10,0,0)^T,\quad Ap_3=(0,10,20,0)^T,\quad
\alpha_3=\frac{20}{100}=\frac15.
$$

그러므로 $x_4=(-65,24,-11,6)^T$입니다. 직접 검산하면

$$
Ax_4=\begin{bmatrix}-65+48+11+6\\-130+120+12\\65-66\\-65+48+18\end{bmatrix}
=\begin{bmatrix}0\\2\\-1\\1\end{bmatrix}=b.
$$

이 추정값과 계수는 [433쪽 표 1](https://math.nist.gov/mcsd/Reports/2002/hestenes-steifel-52.pdf#page=25)을 재현합니다. 아래 노름 열은 그 벡터들로부터 직접 정확하게 계산한 값입니다.

| 단계 $k$ | 추정값 $x_k^T$ | $\lVert r_k\rVert_2^2$ | $\lVert e_k\rVert_A^2$ |
| --- | --- | --- | --- |
| 0 | $(1,0,0,0)$ | 1 | 66 |
| 1 | $(0,0,0,0)$ | 6 | 65 |
| 2 | $(-36,12,-6,6)$ | 30 | 29 |
| 3 | $(-61,22,-11,6)$ | 20 | 4 |
| 4 | $(-65,24,-11,6)$ | 0 | 0 |

처음에는 잔차가 커지지만 에너지 오차는 매번 감소합니다. 첫 두 잔차는 $(-1,0,0,0)^T(0,2,-1,1)=0$으로 직교합니다. 직교성은 방향을 제한하는 조건이지 길이를 제한하는 조건이 아닙니다.

{% include cg-lab-ko.html %}

실험은 원문의 행렬, 우변, 초기 추정값에서 시작합니다. 두 곡선을 비교하세요. 잔차는 방정식의 불일치를, 에너지 오차는 최솟점까지의 거리를 측정합니다. 단계를 차례로 선택하여 표와 비교하세요. 최급강하법, 야코비 PCG, 초기 좌표 변경은 표 1에 실린 추가 결과가 아니라 **현대적인 가상 실험**입니다. JavaScript가 없어도 위의 유도와 표를 읽을 수 있습니다.

## 켤레 방향에서 짧은 CG 점화식으로

SPD 행렬과 정확한 산술에서 보통의 선형 CG 갱신식은 다음과 같습니다.

$$
\begin{aligned}
r_0&=b-Ax_0,& p_0&=r_0,\\
\alpha_k&=\frac{r_k^Tr_k}{p_k^TAp_k},&
x_{k+1}&=x_k+\alpha_kp_k,\\
r_{k+1}&=r_k-\alpha_kAp_k,&
\beta_k&=\frac{r_{k+1}^Tr_{k+1}}{r_k^Tr_k},\\
p_{k+1}&=r_{k+1}+\beta_kp_k.
\end{aligned}
$$

잔차가 0이라면 다음 비율을 계산하기 전에 멈춥니다. 이는 [Netlib의 CG 템플릿](https://www.netlib.org/linalg/html_templates/node20.html)에서 전처리를 사용하지 않는 형태입니다.

직선 탐색의 분자가 왜 $r_k^Tr_k$가 될까요? 정확한 CG의 잔차는 이전 탐색 방향들과 직교합니다. $p_k=r_k+\beta_{k-1}p_{k-1}$이므로 $p_k^Tr_k=r_k^Tr_k$입니다.

켤레 조건의 식은 왜 잔차 제곱 노름의 비가 될까요? 잔차 갱신식으로부터 $Ap_k=(r_k-r_{k+1})/\alpha_k$입니다. $r_{k+1}^Tr_k=0$이므로

$$
-\frac{r_{k+1}^TAp_k}{p_k^TAp_k}
=\frac{r_{k+1}^Tr_{k+1}}{\alpha_k p_k^TAp_k}
=\frac{r_{k+1}^Tr_{k+1}}{r_k^Tr_k}.
$$

이 결합된 점화식은 새 방향을 **모든** 이전 방향과 켤레가 되게 하고, 새 잔차를 이전 잔차들과 직교하게 합니다. 이는 정확한 산술에서 성립하는 성질이지, 매 부동소수점 단계 뒤에 별도로 가정해야 하는 조건이 아닙니다. [Netlib의 이론 설명](https://www.netlib.org/linalg/html_templates/node21.html)은 이 짧은 점화식과 최소화 성질을 설명합니다.

### 가능한 보정들이 이루는 공간

**생성공간(span)**은 주어진 벡터들의 모든 선형결합으로 이루어집니다. $k$번 반복한 CG의 탐색 공간은

$$
x_0+\mathcal K_k(A,r_0),\qquad
\mathcal K_k(A,r_0)=\operatorname{span}\{r_0,Ar_0,\ldots,A^{k-1}r_0\}.
$$

이 공간을 **크릴로프 부분공간(Krylov subspace)**이라고 합니다. 이 식은 가능한 보정을 설명할 뿐, 구현에서 행렬의 거듭제곱을 저장하라는 뜻이 아닙니다. CG는 몇 개의 작업 벡터만으로 이 아핀 공간에서 $\lVert x-x_\star\rVert_A$를 최소화합니다. 0이 아닌 켤레 방향들은 선형독립이므로 $\mathbb R^n$에 최대 $n$개만 존재할 수 있습니다. 따라서 정확한 CG는 최대 $n$번 안에 끝나며 더 일찍 끝날 수도 있습니다. [Stanford 슬라이드 9–10과 24](https://web.stanford.edu/class/ee364b/lectures/conj_grad_slides.pdf#page=10)를 참고하세요.

## 수렴이 미지수의 개수에만 달려 있지 않은 이유

**고유벡터(eigenvector)**는 $Av=\lambda v$를 만족합니다. 이 방향에서 $A$는 **고윳값(eigenvalue)** $\lambda$만큼의 스칼라 곱으로 작용합니다. SPD 행렬의 모든 고윳값은 양수입니다. 그 비율

$$
\kappa_2(A)=\frac{\lambda_{\max}(A)}{\lambda_{\min}(A)}
$$

은 스펙트럼 조건수입니다. {% include wiki-related-link.html path="linear-algebra/matrix-norm" label="행렬 노름과 민감도" %}도 참고하세요. 표준적인 상계는 다음과 같습니다.

$$
\frac{\lVert e_k\rVert_A}{\lVert e_0\rVert_A}
\le2\left(\frac{\sqrt\kappa-1}{\sqrt\kappa+1}\right)^k,
\qquad \kappa=\kappa_2(A),\quad e_0\ne0.
$$

이는 에너지 오차의 최악 경우 상계이며 각 단계의 잔차를 예측하는 식이 아닙니다. 고윳값들이 군집을 이루면 훨씬 빠르게 수렴할 수 있습니다. [Netlib의 수렴 설명](https://www.netlib.org/linalg/html_templates/node22.html)을 참고하세요.

고윳값이 등장하는 이유는 전체 수렴 증명 없이도 볼 수 있습니다. 각 보정은 $A$의 거듭제곱으로 구성되므로 $e_k=q_k(A)e_0$이며, $q_k$는 차수가 최대 $k$이고 $q_k(0)=1$인 다항식입니다. 고유벡터 방향의 오차에는 $q_k(\lambda)$가 곱해집니다. CG는 실제로 존재하는 스펙트럼에서 오차를 줄이는 보정을 선택합니다. 조건수 상계는 양 끝 고윳값 사이의 전체 구간을 제어하므로, 몇 개의 군집만 중요할 때는 비관적일 수 있습니다. [Stanford의 스펙트럼 유도, 슬라이드 12–16](https://web.stanford.edu/class/ee364b/lectures/conj_grad_slides.pdf#page=13)을 참고하세요.

### 계산 비용과 유한 정밀도

각 반복에는 행렬-벡터 곱 한 번, 상수 개수의 내적, 벡터 갱신이 필요합니다. 희소 행렬에 $s$개 항목을 저장한다면 반복당 비용은 $O(s+n)$, 추가 작업 공간은 $O(n)$입니다. 밀집 행렬의 곱은 $O(n^2)$입니다. 전처리에는 별도의 구성 및 적용 비용이 듭니다. [Shewchuk의 10절](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf)을 참고하세요.

부동소수점 산술에서는 반올림 때문에 정확한 직교성과 켤레성이 약해집니다. 따라서 수학적인 $n$단계 결과를 실용적인 반복 횟수 제한으로 삼을 수 없습니다. 또한 점화식으로 갱신한 $r$은 실제 잔차 $b-Ax$와 달라질 수 있습니다. 답을 받아들이기 전에 실제 잔차를 다시 계산하세요. 현재 추정값에서 재시작하면 일관성을 회복할 수 있지만, 누적된 방향들은 버리게 됩니다. [Shewchuk의 8절과 11절](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf)을 참고하세요.

$b\ne0$일 때 항등식 $e=-A^{-1}r$로부터 직접 다음을 유도할 수 있습니다.

$$
\frac{\lVert e\rVert_2}{\lVert x_\star\rVert_2}
\le\kappa_2(A)\frac{\lVert r\rVert_2}{\lVert b\rVert_2}.
$$

실제로 $\lVert e\rVert_2\le\lVert A^{-1}\rVert_2\lVert r\rVert_2$이고 $\lVert b\rVert_2\le\lVert A\rVert_2\lVert x_\star\rVert_2$입니다. 작은 상대 잔차가 작은 상대 오차를 보장하는 정도는 조건수에 의해 제한됩니다.

## 전처리는 기하를 바꿉니다

계산량을 줄이려면 $Pz=r$을 싸게 풀 수 있는 고정된 SPD 행렬 $P$를 선택합니다. 이 절에서는 $P$가 $A$를 근사하고 실제 적용하는 연산은 $P^{-1}$입니다. 동등한 대칭 연립방정식은 다음과 같습니다.

$$
\widetilde A=P^{-1/2}AP^{-1/2},\quad
\widetilde b=P^{-1/2}b,\quad x=P^{-1/2}y.
$$

여기서 $P^{1/2}$는 SPD 제곱근입니다. 이 변환은 기하를 설명하기 위한 것이며, 구현에서 제곱근을 만들 필요는 없습니다. 목표는 $\widetilde A$의 스펙트럼을 더 유리하게 만드는 것입니다. $P^{-1}A$는 보통 유클리드 내적에서 대칭이 아니지만, **전처리 켤레기울기법(preconditioned CG, PCG)**은 적절한 기하를 유지합니다. [PETSc의 동등한 PCG 해석](https://petsc.org/release/manualpages/KSP/KSPCG/)을 참고하세요.

$z_k=P^{-1}r_k$를 적용하고 $p_0=z_0$로 시작한 뒤 스칼라 갱신식을 다음으로 바꿉니다.

$$
\alpha_k=\frac{r_k^Tz_k}{p_k^TAp_k},\qquad
\beta_k=\frac{r_{k+1}^Tz_{k+1}}{r_k^Tz_k},\qquad
p_{k+1}=z_{k+1}+\beta_kp_k.
$$

$x$와 $r$ 갱신은 그대로입니다. $P=I$이면 CG가 됩니다. **야코비 전처리(Jacobi preconditioning)**는 $P=\operatorname{diag}(A)$로 두므로, 역을 적용할 때 각 잔차 성분을 해당 대각 원소로 나눕니다. 원문 예제에서는 $z=(r_1,r_2/5,r_3/6,r_4/3)^T$입니다. 여기서 아래첨자는 좌표를 뜻합니다. 이는 [Netlib의 전처리 공식](https://www.netlib.org/templates/templates.html)을 적용한 것이며, 원문 예제가 PCG를 사용했다는 주장이 아닙니다.

전처리의 성능은 구성 비용을 포함한 전체 풀이 시간과 메모리로 판단하세요. 예를 들어 $P=A$이면 변환된 연산자는 항등행렬이지만, $P$로 푸는 일 자체가 원래 문제입니다. 일반적인 비대칭 전처리나 반복마다 바뀌는 전처리는 이 표준 PCG 점화식의 조건을 만족하지 않습니다.

## 라이브러리 사용과 결과 확인

다음의 현대적인 Python 예제는 원문 연립방정식을 야코비 PCG로 풉니다. SciPy의 인수 `M`은 $A^{-1}$의 근사를 나타내므로 여기서의 $P^{-1}$을 적용합니다. 종료 조건은 $\lVert b-Ax\rVert_2\le\max(\texttt{atol},\texttt{rtol}\lVert b\rVert_2)$이며, `info == 0`은 성공을 뜻합니다. [공식 API 문서](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.linalg.cg.html)를 참고하세요.

```python
import numpy as np
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import LinearOperator, cg

A = csr_matrix([[1., 2., -1., 1.],
                [2., 5.,  0., 2.],
                [-1., 0., 6., 0.],
                [1., 2.,  0., 3.]])
b = np.array([0., 2., -1., 1.])
x0 = np.array([1., 0., 0., 0.])
inverse_diagonal = 1.0 / A.diagonal()
M = LinearOperator(A.shape,
                   matvec=lambda r: inverse_diagonal * r,
                   dtype=float)
rtol, atol = 1e-10, 1e-12
x, info = cg(A, b, x0=x0, M=M, rtol=rtol, atol=atol, maxiter=100)
residual = np.linalg.norm(b - A @ x)
target = max(atol, rtol * np.linalg.norm(b))
if info != 0 or not np.isfinite(residual) or residual > target:
    raise RuntimeError(f"CG incomplete: info={info}, residual={residual}")
print(x)  # 약 [-65., 24., -11., 6.]
```

절대 허용오차는 $b=0$이거나 매우 작을 때 유용합니다. 풀기 전에 행렬의 조건을 확인하세요. 이 함수는 일반적인 SPD 증명서를 제공하지 않습니다.

## 흔한 오해와 반례

다음 반례는 설명을 위해 별도로 만든 보충 예제입니다.

- **대칭이면 충분하다.** $A=\operatorname{diag}(1,-1)$, $r_0=p_0=(1,1)^T$이면 $p_0^TAp_0=0$입니다. $A$는 대칭이고 가역이지만 CG의 나눗셈이 실패합니다. 양의 정부호 조건은 이러한 영 곡률 방향을 막습니다.
- **대각 원소가 양수이면 충분하다.** 행이 $(1,2)$와 $(2,1)$인 대칭행렬은 대각 원소가 양수이지만 $(1,-1)A(1,-1)^T=-2$입니다. 전체 이차형식을 검사해야 합니다.
- **잔차는 매번 줄어야 한다.** 위의 원문 예제 자체가 반례입니다. 잔차 제곱은 $1,6,30$으로 시작하지만 에너지 오차는 줄어듭니다.
- **CG는 탐색 공간에서 보통의 잔차 노름을 최소화한다.** CG가 정의상 최소화하는 것은 에너지 오차입니다. 두 노름은 서로 다른 양을 측정합니다.
- **모든 최소제곱 문제를 CG에 바로 넣을 수 있다.** 직사각 행렬 $B$의 정규방정식은 $B^TBx=B^Td$입니다. 이 행렬은 $B$의 열들이 독립일 때만 SPD이며, $\kappa_2(B^TB)=\kappa_2(B)^2$입니다. 조건수가 중요하다면 {% include wiki-related-link.html path="linear-algebra/qr-factorization" label="QR 분해" %} 또는 전용 최소제곱 풀이법을 고려하세요. [Shewchuk의 13절](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf)을 참고하세요.
- **비선형 CG에도 같은 유한 단계 보장이 있다.** 비선형 CG는 일반 목적함수에 기울기와 직선 탐색을 적용합니다. 위의 정확한 이차함수 항등식은 더 이상 적용되지 않습니다. [Shewchuk의 14절](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf)을 참고하세요.

## 연습 문제

직접 만든 연습 문제이며, 처음 두 문제는 원문의 수치를 다시 사용합니다. 먼저 풀어 본 뒤 힌트와 풀이를 펼쳐 보세요.

### 1. 손계산: 두 번째 방향 확인하기

$r_1=(0,2,-1,1)^T$, $p_0=(-1,0,0,0)^T$에서 $\beta_0$, $p_1$, $\alpha_1$을 구하세요. $p_0$와 $p_1$의 보통의 직교성과 A 켤레성을 각각 확인하세요.

<details markdown="1">
<summary>힌트</summary>

$\lVert r_0\rVert_2^2=1$을 이용하고, 보폭을 계산하기 전에 $Ap_1$부터 구하세요.

</details>

<details markdown="1">
<summary>풀이</summary>

$\beta_0=6/1=6$이므로 $p_1=(-6,2,-1,1)^T$, $Ap_1=(0,0,0,1)^T$입니다. 따라서 $p_1^TAp_1=1$, $\alpha_1=6$입니다. $p_0^Tp_1=6$이지만 $p_0^TAp_1=0$입니다. 두 방향은 켤레이며 유클리드 직교는 아닙니다.

</details>

### 2. 해석: 첫 단계는 상황을 악화시켰을까요?

모니터가 원문 기준 예제에서 잔차 노름이 $1$에서 $\sqrt6$으로 증가했다고 보고했습니다. 발산이라고 판단해야 할까요? 에너지 오차 표로 목적함수의 변화를 계산하세요. 실제 계산에서는 무엇을 관찰하겠습니까?

<details markdown="1">
<summary>힌트</summary>

목적함수의 최솟값과의 차이는 에너지 오차 제곱의 절반입니다. 한 번 증가하는 것과 허용오차에 지속적으로 도달하지 못하는 것은 다른 증거입니다.

</details>

<details markdown="1">
<summary>풀이</summary>

아닙니다. 목적함수 차이는 $66/2=33$에서 $65/2=32.5$로 $0.5$만큼 감소합니다. 정확한 예제는 네 단계에 수렴합니다. 실제 풀이에서는 정확한 해를 모르므로 에너지 오차를 직접 계산할 수 없습니다. 실제 잔차를 응용에 맞는 허용오차와 비교하고, 반복 횟수와 여러 단계에 걸친 진행 상황을 관찰하세요. 잔차 한 번의 증가를 발산 증명으로 취급하기보다 지속적인 정체나 계산 중단 원인을 조사하세요.

</details>

### 3. 논리: 방향이 최대 n개인 이유

SPD 행렬 $A$에 대해 $p_0,\ldots,p_{m-1}$이 0이 아니고 서로 A 켤레라고 합시다. 이 벡터들이 선형독립임을 증명하세요. 단지 양의 준정부호인 행렬에서는 왜 이 논리가 실패할까요?

<details markdown="1">
<summary>힌트</summary>

가정한 종속 관계 $\sum_i c_ip_i=0$에 왼쪽에서 $p_j^TA$를 곱하세요.

</details>

<details markdown="1">
<summary>풀이</summary>

교차항이 모두 사라져 $c_jp_j^TAp_j=0$이 남습니다. SPD이므로 $p_j^TAp_j>0$, 따라서 모든 $j$에 대해 $c_j=0$입니다. 그러므로 $m\le n$입니다. 양의 준정부호 행렬에서는 0이 아닌 영공간 벡터의 에너지가 0일 수 있어 마지막 나눗셈을 할 수 없습니다. 특별히 적합한 특이 문제도 풀 수는 있지만, 이 증명과 표준적인 보장은 SPD를 요구합니다.

</details>

### 4. 실용: 대각 전처리

별도로 만든 보충 예제 $A=\operatorname{diag}(1,100)$, $b=(1,100)^T$, $x_0=0$에 대해 전처리 없는 CG의 첫 단계를 계산하세요. 이어서 PCG에 $P=A$를 쓰고 한 단계면 충분한 이유를 설명하세요. 모든 행렬에서 이 전략이 유용할까요?

<details markdown="1">
<summary>힌트</summary>

전처리가 없으면 $p_0=r_0=b$입니다. 이 대각행렬 $P$를 사용하면 $z_0=P^{-1}r_0=(1,1)^T$입니다.

</details>

<details markdown="1">
<summary>풀이</summary>

전처리가 없을 때 $r_0^Tr_0=10001$, $p_0^TAp_0=1000001$이므로 $\alpha_0=10001/1000001$, $x_1=\alpha_0(1,100)^T$입니다. 이는 해 $(1,1)^T$가 아닙니다. PCG에서는 $p_0=z_0=(1,1)^T$, $r_0^Tz_0=101$, $p_0^TAp_0=101$입니다. 따라서 $\alpha_0=1$, $x_1=(1,1)^T$입니다. 여기서는 $A$가 대각행렬이라 $P^{-1}$ 적용이 저렴합니다. 일반적인 결합 행렬에서는 $P=A$로 푸는 일이 원래의 어려운 문제입니다. 효과적인 전처리는 적용 비용과 반복 횟수 절감 사이의 균형을 잡습니다.

</details>

## 참고문헌과 추가 학습

- [Magnus R. Hestenes와 Eduard Stiefel, *Methods of Conjugate Gradients for Solving Linear Systems* (1952)](https://math.nist.gov/mcsd/Reports/2002/hestenes-steifel-52.pdf). 1절 409쪽은 기계 계산의 요구사항을 설명합니다. 19절 예제 1과 표 1, 433쪽은 본문의 주요 수치와 정확한 반복값의 출처입니다. 켤레 방향을 원래의 계산 과제와 연결하여 읽어 보세요. 회고적 역사가 아니라 최초 발표 논문입니다.
- [Jonathan Richard Shewchuk, *An Introduction to the Conjugate Gradient Method Without the Agonizing Pain* (1994)](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf). 3–8절은 이차함수 기하와 점화식을, 10–12절은 비용·종료·전처리를, 13–14절은 정규방정식과 비선형 CG의 차이를 설명합니다. 직관과 추가적인 기하 계산에 유용합니다.
- [*Templates for the Solution of Linear Systems*의 CG 알고리즘](https://www.netlib.org/linalg/html_templates/node20.html), [이론](https://www.netlib.org/linalg/html_templates/node21.html), [수렴](https://www.netlib.org/linalg/html_templates/node22.html). 구현의 가정과 에너지 오차 상계를 확인하는 데 유용합니다. [전체 책](https://www.netlib.org/templates/templates.html)은 전처리 선택을 다룹니다.
- [Stanford EE364b, *Conjugate Gradient Method* 강의](https://web.stanford.edu/class/ee364b/lectures/conj_grad_slides.pdf). 슬라이드 6–10은 오차·잔차·크릴로프 공간을, 12–16은 스펙트럼을, 24는 0이 아닌 초기 추정값을 다룹니다. 고윳값 군집이 유리한 이유를 이해하는 데 유용합니다.
- [SciPy, `scipy.sparse.linalg.cg`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.linalg.cg.html). 구현할 때 인수의 관례, 역전처리 연산, 반환 상태, 허용오차를 확인하세요.
- [PETSc, `KSPCG`](https://petsc.org/release/manualpages/KSP/KSPCG/). 동등한 전처리 해석을 설명하며 병렬 CG 변형으로 연결됩니다. 분산 풀이에서 통신 비용이 중요할 때 유용합니다.
