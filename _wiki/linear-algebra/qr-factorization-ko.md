---
title: QR 분해
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-qr-factorization
description: 정규직교 방향과 상삼각 계수로 행렬을 분해하고 관측값의 최소제곱 적합을 계산합니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 8e0911ebe85e47bd52a3e13684029a52047a3ca7206dadeebb98a3a0032c6c83
interactive_examples: true
orthogonal_examples: true
---

## 원래 문제: 불완전한 관측들이 미지수를 공유한다
{: id="the-original-problem-imperfect-observations-share-unknowns"}

Legendre는 1805년 최소제곱법 부록에서 알려진 계수는 달라도 미지량은 공유하는 관측 방정식을 다룬다. 보통 모두 정확히 성립하지 않아 오차 제곱합의 최소화를 제안한다. [Smith의 원문 번역 576–577쪽](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608)을 참고하자. 본문의 역사적 적합 문제를 제공하며 Legendre가 QR을 도입했다는 주장은 아니다.

**원래 기호 문제의 현대적 행렬 재유도.** 미지 매개변수 $n$개에 대한 관측식 $m$개를 $Ax\approx b$로 모은다. 실수 $A\in\mathbb R^{m\times n}$은 알려진 계수, $x\in\mathbb R^n$은 매개변수, $b\in\mathbb R^m$은 관측이다. **잔차** $r=b-Ax$는 어긋남을 모은다. 같은 관측 가중치에서 푸는 문제는

$$
\min_x\lVert b-Ax\rVert_2^2.
$$

Legendre는 $E=a+bx+cy+fz+\cdots$로 오차를 쓴다. 본문은 알려진 상수항을 반대편으로 옮기므로 잔차 부호는 반대지만 제곱은 같다. 기호 모델에 수치 관측표는 없다. 아래 수치는 교육용 재구성으로 표시하며 Legendre의 측정 자료가 아니다.

[LU 문서]({{ '/wiki/linear-algebra/lu-decomposition-ko/#solving-normal-equations' | relative_url }})는 **정규방정식** $A^TAx=A^Tb$를 전개한다. 최선의 적합을 특징짓지만 $A^TA$ 형성은 수치 민감도를 악화시킬 수 있다. 다른 경로는 먼저 수직인 모델 방향으로 바꾼다. [Gram–Schmidt]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/' | relative_url }})가 방향을 만들고 QR이 행렬 곱으로 기록한다.

## 방향들에서 인수 만들기
{: id="build-the-factors-from-the-directions"}

먼저 $m\ge n$이고 $A$의 열 $a_1,\ldots,a_n$이 독립, 즉 어느 것도 나머지의 선형결합이 아니라고 하자. Gram–Schmidt는 수직 단위벡터 $q_i$와 다음 계수를 만든다.

$$
a_j=\sum_{i=1}^{j}r_{ij}q_i.
$$

$j$번째 입력은 처음 $j$개 새 방향만 쓴다. $q_i$를 $Q$의 열에, 계수를 $R$에 넣으면

$$
A=QR,\qquad Q^TQ=I_n,
\qquad
R=\begin{bmatrix}
r_{11}&r_{12}&\cdots&r_{1n}\\
0&r_{22}&\cdots&r_{2n}\\
\vdots&\ddots&\ddots&\vdots\\
0&\cdots&0&r_{nn}
\end{bmatrix}.
$$

$I_n$은 대각이 1, 나머지가 0인 항등행렬이다. $R$은 대각 아래가 0인 **상삼각**이다. $Q$가 $m\times n$, $R$이 $n\times n$인 **축소 QR 분해**이다. [LAPACK 정의](https://www.netlib.org/lapack/lug/node40.html), [ALAFF의 열별 구성](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html).

### 각 인수의 역할
{: id="what-each-factor-does"}

$R$은 매개변수 좌표를 정규직교 모델 방향의 좌표로 바꾸고 $Q$는 관측 공간에 놓는다. $Q^TQ=I_n$이므로

$$
\lVert Qy\rVert_2^2=y^TQ^TQy=y^Ty=\lVert y\rVert_2^2.
$$

$Q$는 $\mathbb R^n$에서 들어온 벡터의 길이를 보존한다. 직사각형 $Q$에서 $Q^T$가 모든 $\mathbb R^m$ 벡터 길이를 보존한다는 뜻은 아니다. 수직 잔차 성분을 버리기 때문이다. 예를 들어 $Q=(1,0)^T$는 $Q^TQ=1$이지만 $Q^T(0,1)^T=0$이다.

### 공유 계산 예제: Gram–Schmidt 기록이 QR이 된다
{: id="shared-worked-example-the-gramschmidt-record-becomes-qr"}

**보충용으로 만든 예제.** [Gram–Schmidt의 벡터 계산]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/#worked-vectors-keep-the-new-part-then-normalize' | relative_url }})을 이어가자.

$$
A=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix},\qquad
Q=\begin{bmatrix}
1/\sqrt3&-1/\sqrt2\\
1/\sqrt3&0\\
1/\sqrt3&1/\sqrt2
\end{bmatrix},\qquad
R=\begin{bmatrix}\sqrt3&\sqrt3\\0&\sqrt2\end{bmatrix}.
$$

첫 열은 $\sqrt3q_1$, 둘째는 $\sqrt3q_1+\sqrt2q_2=(0,1,2)^T$이다. 곱으로 $A=QR$, 내적으로 $Q^TQ=I_2$를 확인한다.

$A$의 열은 무차원 표본 위치 $t=0,1,2$에서 직선 $c+dt$를 표현한다. 겹침이 절편 $c$와 기울기 $d$를 결합한다. 정규직교 열은 대신 상수 성분과 중심화한 추세를 나타낸다.

## 최소제곱 풀이 유도하기
{: id="derive-the-least-squares-solve"}

$y=Q^Tb$라 두고 관측을 열공간 성분과 수직 잔차로 나누자.

$$
b=Qy+b_\perp,
\qquad b_\perp=b-QQ^Tb,
\qquad Q^Tb_\perp=0.
$$

**열공간**은 가능한 모든 예측 $Ax$를 포함하며 직교투영은 $QQ^Tb$이다. 임의의 매개변수 벡터 $x$에 대해

$$
b-Ax=Q(y-Rx)+b_\perp.
$$

두 항이 수직이므로 길이 제곱이 더해진다.

$$
\lVert b-Ax\rVert_2^2
=\lVert y-Rx\rVert_2^2+\lVert b_\perp\rVert_2^2.
$$

둘째 항은 이 모델에서 피할 수 없다. 독립인 열 때문에 $R$이 비특이이므로 다음을 풀어 첫 항을 0으로 만들 수 있다.

$$
Rx=Q^Tb.
$$

마지막 행에서 마지막 미지수를 구하고 위로 올라가는 **후진대입**으로 삼각계를 푼다. 이 풀이만을 위해 $R^{-1}$을 만들지 않는다. [LAPACK QR 최소제곱법](https://www.netlib.org/lapack/lug/node40.html)의 축소형 유도이다.

### 적합 계산과 원래 방정식 확인
{: id="calculate-the-fit-and-check-the-original-equations"}

만든 관측 $b=(1,2,2)^T$는 $t=0,1,2$에서 정확히 직선 위에 있지 않다. 먼저 계산하면

$$
Q^Tb=\begin{bmatrix}5/\sqrt3\\1/\sqrt2\end{bmatrix}.
$$

절편·기울기를 $x=(c,d)^T$로 쓰고 후진대입하면

$$
\sqrt2\,d=1/\sqrt2\quad\Longrightarrow\quad d=\frac12,
$$

$$
\sqrt3\,c+\sqrt3\,d=5/\sqrt3
\quad\Longrightarrow\quad c=\frac53-\frac12=\frac76.
$$

예측과 잔차는

$$
Ax=\begin{bmatrix}7/6\\5/3\\13/6\end{bmatrix},
\qquad r=b-Ax=\frac16\begin{bmatrix}-1\\2\\-1\end{bmatrix},
\qquad \lVert r\rVert_2^2=\frac16.
$$

두 모델 방향을 확인하면

$$
\begin{bmatrix}1&1&1\\0&1&2\end{bmatrix}r
=\begin{bmatrix}0\\0\end{bmatrix}.
$$

잔차는 허용되는 모든 예측 변화에 수직이다. 최소제곱 해는 $Ax=b$를 만족할 필요가 없으며 남는 오차를 모델 공간에 수직으로 만든다.

## 완전 QR은 남은 방향도 보관한다
{: id="full-qr-keeps-the-leftover-directions-too"}

$Q_\perp$를 더해 $Q$의 $n$개 열을 $\mathbb R^m$ 전체의 정규직교 기저로 완성하면

$$
\widetilde Q=[\,Q\;Q_\perp\,]\in\mathbb R^{m\times m},
\qquad A=\widetilde Q\begin{bmatrix}R\\0\end{bmatrix}.
$$

이것이 **완전 QR**이다. 0 블록은 $(m-n)$행 $n$열이다. 이제 $\widetilde Q$는 정사각 직교행렬로 $\widetilde Q^T\widetilde Q=I_m$, $\widetilde Q\widetilde Q^T=I_m$이 모두 성립한다. 완전 좌표에서

$$
\widetilde Q^Tb=\begin{bmatrix}Q^Tb\\Q_\perp^Tb\end{bmatrix}.
$$

위 좌표는 적합을 정하고 아래는 잔차를 나타낸다. 예제에서 $q_3=(1,-2,1)^T/\sqrt6$를 고르면 $q_3^Tb=-1/\sqrt6$이고 $r=q_3(-1/\sqrt6)$의 길이 제곱은 $1/6$이다. 차원과 잔차 해석은 [LAPACK의 완전형·축소형](https://www.netlib.org/lapack/lug/node40.html)을 따른다.

## 존재성, 유일성과 종속 열
{: id="existence-uniqueness-and-dependent-columns"}

$m\ge n$이면 종속 열이 있어도 QR은 존재한다. 열이 독립이면 Gram–Schmidt가 양의 $r_{jj}$인 축소 QR을 만든다. 나머지가 0이면 추가 수직 단위 방향을 선택할 수 있고 $R$ 대각에 0이 생길 수 있다. 매 나머지로 나누는 기초 알고리즘은 이 경우를 처리하도록 수정하지 않으면 멈춘다.

열이 모두 독립이면 $r_{jj}>0$ 관례가 축소 인수를 유일하게 만든다. $Q_1R_1=Q_2R_2$라 하자. 열공간이 같으므로 직교 $S=Q_1^TQ_2$에 대해 $Q_2=Q_1S$이다. $S=R_1R_2^{-1}$이므로 상삼각이기도 하다. 상삼각 직교행렬은 대각이 $\pm1$인 대각행렬이며 두 $R_i$의 대각이 양수이면 $S=I$이다. 이는 정확 산술 증명이다. 완전 QR의 추가 열은 일반적으로 유일하지 않다.

부호 관례가 없으면 $Q$의 열과 대응하는 $R$의 행 부호를 함께 바꿔도 곱이 같다. 따라서 소프트웨어 출력이 달라도 둘 다 옳을 수 있다. $m<n$에서는 완전 $Q$가 $m\times m$, 오른쪽 인수가 대각 아래 0인 **상사다리꼴** $m\times n$이다. [LAPACK의 직사각형 경우](https://www.netlib.org/lapack/lug/node40.html).

## QR 계산: 하나의 분해에 여러 알고리즘이 있다
{: id="computing-qr-a-factorization-has-several-algorithms"}

Gram–Schmidt는 열을 구성하며 인수를 설명한다. 다른 방법은 행렬 전체를 바꿔 0을 만든다. 다음은 실수 공식이며 복소행렬에서는 켤레전치와 유니터리 인수를 쓴다.

### Householder 반사: 열 꼬리를 함께 제거하기
{: id="householder-reflections-remove-a-column-tail-together"}

**초평면**은 주변 공간보다 차원이 하나 작은 평평한 부분공간으로 2차원에서는 원점을 지나는 직선, 3차원에서는 평면이다. [Householder 반사]({{ '/wiki/linear-algebra/householder-reflection-ko/' | relative_url }})는 초평면의 수직 성분을 뒤집고 안쪽 성분은 그대로 둔다. 전용 문서는 기하 유도, 투영과의 차이와 수치 구성을 설명한다. $v\ne0$에서

$$
H=I-2\frac{vv^T}{v^Tv}
$$

는 $H^T=H$, $H^TH=I$를 만족한다. 0이 아닌 열 구간 $z$를 첫 좌표축으로 보내려면

$$
\alpha=-\operatorname{sign}(z_1)\lVert z\rVert_2,
\qquad v=z-\alpha e_1,
$$

여기서 $e_1=(1,0,\ldots,0)^T$이고 이 구성에서 $\operatorname{sign}(0)=1$이다. 그러면 $Hz=\alpha e_1$이다. 부호 선택은 $v$의 첫 원소에서 거의 같은 수를 빼는 것을 피한다. 영구간에는 반사가 필요 없다.

**만든 두 좌표 계산.** $z=(3,4)^T$에서 $\alpha=-5$, $v=(8,4)^T$로 두면

$$
H=\begin{bmatrix}-3/5&-4/5\\-4/5&3/5\end{bmatrix},
\qquad Hz=(-5,0)^T.
$$

행렬에는 첫 반사를 전체 행, 둘째는 2행 이후 등에 적용해 만든 0을 보존한다. $H_k\cdots H_1A=[R;0]$이면 $\widetilde Q=H_1\cdots H_k$이다. 전치를 취해서 순서가 반대이다. LAPACK은 반사 벡터와 계수를 저장해 조밀 $Q$를 만들지 않고 $Q,Q^T$를 적용한다. [반사 표현](https://www.netlib.org/lapack/lug/node128.html), [블록 QR](https://www.netlib.org/lapack/lug/node69.html).

### Givens 회전: 선택한 원소 하나 제거하기
{: id="givens-rotations-remove-one-selected-entry"}

**평면 회전**은 두 좌표만 바꾸고 나머지는 둔다. $(a,b)$에서 $\rho=\sqrt{a^2+b^2}>0$, $\gamma=a/\rho$, $\sigma=b/\rho$로 두면

$$
\begin{bmatrix}\gamma&\sigma\\-\sigma&\gamma\end{bmatrix}
\begin{bmatrix}a\\b\end{bmatrix}
=\begin{bmatrix}\rho\\0\end{bmatrix}.
$$

$(3,4)$의 계수는 $3/5,4/5$이다. 둘 다 0이면 항등 회전을 쓴다. 여기서는 $\rho>0$이지만 라이브러리의 부호 관례는 다를 수 있다. 견고한 구현은 $a^2+b^2$의 넘침·언더플로를 피하려고 척도를 조정한다. 선택한 회전은 국소적 0 만들기와 분해 갱신에 유용하다. [LAPACK DLARTG 명세](https://www.netlib.org/lapack/explore-html/da/dd3/group__lartg_ga86f8f877eaea0386cdc2c3c175d9ea88.html).

### 구성법 고르기
{: id="choosing-the-construction"}

| 방법 | 구성 아이디어 | 수치적·실용적 고려 |
| --- | --- | --- |
| 고전적 Gram–Schmidt | 원래 열에 대해 측정 | 단일 순회에서 직교성이 크게 손실될 수 있음 |
| 수정 Gram–Schmidt | 갱신된 나머지에 대해 측정 | 기저벡터 추가에 유용하며 재직교화가 필요할 수 있음 |
| Householder QR | 각 열 꼬리를 축으로 반사 | 표준 조밀 QR로 압축·블록 저장 지원 |
| Givens QR | 두 행을 회전해 선택한 원소 제거 | 선택한 행 쌍만 바꿀 때 유용 |

[Gram–Schmidt 반올림 예제]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/#classical-and-modified-gramschmidt-in-finite-precision' | relative_url }}), [LAPACK 반사 구현](https://www.netlib.org/lapack/lug/node69.html), [DLARTG](https://www.netlib.org/lapack/explore-html/da/dd3/group__lartg_ga86f8f877eaea0386cdc2c3c175d9ea88.html)를 참고하자. 항등식 $A=QR$만으로 특정 구현의 수치 신뢰성을 보장하지 않는다.

## Cholesky와의 연결과 정확도 함정
{: id="the-connection-to-cholesky-and-the-accuracy-trap"}

정확 산술에서 축소 QR은

$$
A^TA=R^TQ^TQR=R^TR.
$$

열이 모두 독립이고 $R$ 대각이 양수이면 $R^T$가 $A^TA$의 하삼각 [Cholesky 인수]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})이다. 예제 행렬에서는

$$
A^TA=\begin{bmatrix}3&3\\3&5\end{bmatrix}
=\begin{bmatrix}\sqrt3&0\\\sqrt3&\sqrt2\end{bmatrix}
\begin{bmatrix}\sqrt3&\sqrt3\\0&\sqrt2\end{bmatrix}.
$$

이 대수 관계가 유한 정밀도에서 알고리즘을 서로 바꿔 써도 된다는 뜻은 아니다. **스펙트럴 조건수** $\kappa_2(A)=\sigma_{\max}(A)/\sigma_{\min}(A)$는 열이 독립인 행렬의 최대·최소 늘어남 비율이다. Gram 행렬은 다음을 만족한다.

$$
\kappa_2(A^TA)=\kappa_2(A)^2.
$$

늘어남과 조건수는 [행렬 노름]({{ '/wiki/linear-algebra/matrix-norm-ko/' | relative_url }}), 이 항등식은 [ALAFF, §4.2.5](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html)를 참고하자. Householder QR은 조건수가 제곱된 행렬의 명시적 형성을 피하지만 원자료의 민감도를 없애거나 모든 나쁜 조건의 최소제곱 문제에서 작은 매개변수 오차를 보장하지 않는다.

**만든 반례.** 다음을 보자.

$$
A=\begin{bmatrix}1&1\\0&\delta\end{bmatrix},
\qquad A^TA=\begin{bmatrix}1&1\\1&1+\delta^2\end{bmatrix},\qquad\delta>0.
$$

열은 독립이다. $1+\delta^2$를 1로 저장하도록 반올림하면 저장된 $A$에는 0이 아닌 $\delta$가 남아도 Gram 행렬은 특이해진다. 직접 QR은 그 원소를 삼각 인수에 유지한다. 문턱값은 산술에 따라 달라지며 요점은 Gram 행렬을 만들며 잃는 정보이다.

### 계수가 불확실할 때 열 피벗팅
{: id="column-pivoting-when-rank-is-uncertain"}

**순열행렬** $P$는 좌표를 재배열한다. 열 피벗 QR은 독립 방향을 드러내도록 열 순서를 골라 $AP=QR$을 계산한다. $R$의 작은 뒤 블록은 선택한 척도·허용오차에서 유효 수치 계수를 시사한다. LAPACK 피벗 분해 루틴 자체가 계수를 결정하지는 않는다. [계수에 민감한 QR 설명](https://www.netlib.org/lapack/lug/node42.html).

열이 종속이어도 최선의 예측은 유일하지만 여러 매개변수 벡터가 이를 만들 수 있다. 기본 피벗 QR 해가 최소 유클리드 길이의 매개변수는 아닐 수 있다. 최소 노름 해가 필요하면 적절한 완전 직교분해나 SVD를 쓴다. [LAPACK 완전 직교분해](https://www.netlib.org/lapack/lug/node43.html).

### QR 분해와 QR 고윳값 알고리즘
{: id="factorization-versus-the-qr-eigenvalue-algorithm"}

한 QR 분해는 한 행렬의 인수를 만든다. 고윳값을 위한 **QR 알고리즘**은 $A_k=Q_kR_k$를 반복 분해하고 $A_{k+1}=R_kQ_k=Q_k^TA_kQ_k$를 만든다. 이는 기저변환이므로 $v\ne0$에서 $Av=\lambda v$인 수 **고윳값** $\lambda$를 보존한다. 실용 구현은 추가 구조와 이동을 쓴다. Francis의 [1961년 논문](https://doi.org/10.1093/comjnl/4.3.265)은 이 반복 변환에 관한 것으로 모든 QR 분해·직교화 방법의 기원으로 취급하면 안 된다.

## 대화형 예제: 적합과 잔차 분리하기
{: id="interactive-example-separate-the-fit-from-the-residual"}

{% include orthogonal-lab-ko.html kind="qr" title="정규직교 좌표에서 직선 적합하기" source_url="https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608" source_label="Smith 번역 576–577쪽의 Legendre 기호 관측 문제" plot_description="무차원 위치 0,1,2에서 세 관측, 적합 직선과 수직 잔차 선분을 표시한다." %}

이는 위의 만든 행렬·관측을 사용한 원래 기호 적합 문제의 **현대적 교육용 재구성**이다. 위치 $0,1,2$와 같은 가중치는 고정되며 $b$의 변경은 단위 없는 가상 관측이다. 실습은 $Q^Tb$, 삼각계 풀이, 예측, 잔차와 $A^Tr$을 표시한다. 가운데 관측을 바꾸어 적합과 남는 차이의 변화를 보자. 정확히 직선 위인 관측이면 잔차가 사라진다. 기준을 복원하면 $(1,2,2)^T$로 돌아간다.

위 계산이 JavaScript 없는 기준이다. 실습은 고정 설계행렬의 알려진 정규직교 기저를 사용하며 QR 최소제곱을 설명하는 도구이지 범용 수치 해법이 아니다.

## 연습문제
{: id="practice-problems"}

문제와 수치는 직접 만든 교육용 예제이다.

### 1. 손계산: 인수 재사용하기
{: id="1-hand-calculation-reuse-the-factors"}

예제 $A,Q,R$로 새 관측 $b=(2,2,5)^T$를 적합하여 절편, 기울기와 잔차를 구하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>힌트 보기</summary>

$Q^Tb=(9/\sqrt3,3/\sqrt2)^T$이다. 둘째 행부터 푼다.

</details>
<details markdown="1"><summary>풀이 보기</summary>

$d=3/2$, $c=3-3/2=3/2$이다. 예측은 $(3/2,3,9/2)^T$, 잔차는 $r=(1/2,-1,1/2)^T$이고 길이 제곱은 $3/2$이다. 성분 합과 $0r_1+r_2+2r_3$이 0이어서 $A^Tr=0$을 확인한다. 행렬 인수를 다시 계산할 필요가 없었다.

</details>
</div>

### 2. 해석: 직사각 전치
{: id="2-interpretation-a-rectangular-transpose"}

축소 $Q\in\mathbb R^{5\times2}$에서 $QQ^T=I_5$인가? $QQ^Tb$는 무엇인가?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>힌트 보기</summary>

5차원 공간에 독립 방향이 두 개뿐이다.

</details>
<details markdown="1"><summary>풀이 보기</summary>

아니다. $Q^TQ=I_2$이고 $QQ^T$는 2차원 열공간으로 투영한다. 계수는 2로 $I_5$의 계수 5와 다르다. $QQ^Tb$는 모델 공간에서 가장 가까운 예측이며 $b-QQ^Tb$는 그에 수직이다.

</details>
</div>

### 3. 논리: 부호와 유일성
{: id="3-logic-signs-and-uniqueness"}

독립 열의 $A=QR$에서 $D$가 대각 $\pm1$인 행렬이라 하자. $A=(QD)(DR)$도 QR임을 보이고 양의 대각 관례가 이 자유도를 없애는 이유를 설명하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>힌트 보기</summary>

$D^2=I$, $D^T=D$를 쓴다.

</details>
<details markdown="1"><summary>풀이 보기</summary>

$(QD)(DR)=QD^2R=QR=A$이고 $(QD)^T(QD)=DI D=I$이다. $R$의 행에 부호를 곱해도 삼각성은 유지된다. 두 버전 모두 0이 아닌 양의 대각이어야 한다면 $D$의 모든 부호가 $+1$이다. 위 삼각·직교 논증과 함께 축소 QR의 유일성을 준다.

</details>
</div>

### 4. 전략: 인수와 계산법 구별하기
{: id="4-strategy-distinguish-the-factor-from-its-computation"}

동료가 $A^TA$를 만들어 Cholesky 분해한 뒤 $Q$를 풀어 QR을 얻자고 한다. $A$의 열은 거의 종속이다. 왜 정확 항등식만으로 이 선택을 정당화할 수 없는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>힌트 보기</summary>

어느 단계에서 이미 정보가 손실될 수 있는지 찾는다.

</details>
<details markdown="1"><summary>풀이 보기</summary>

$A^TA$ 형성은 스펙트럴 조건수를 제곱하고 Cholesky 전에 반올림으로 작은 구별 정보를 잃을 수 있다. $\delta$ 반례에서는 저장된 Gram 행렬이 특이해진다. 저장 행렬을 신뢰성 있게 분해해도 잃은 정보를 복원할 수 없다. Householder QR은 그 형성을 피하지만 조건수와 잔차 확인은 여전히 중요하다.

</details>
</div>

### 5. 실용적 응용: 서로 다른 관측 가중치
{: id="5-practical-application-unequal-observation-weights"}

세 관측에 양의 가중치 $w_1,w_2,w_3$가 있다. QR로 $\sum_iw_i(b_i-(Ax)_i)^2$를 어떻게 최소화하는가? 고정 무가중 실습 인수를 그대로 재사용할 수 있는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>힌트 보기</summary>

가중치 제곱근을 행렬과 관측의 행에 흡수한다.

</details>
<details markdown="1"><summary>풀이 보기</summary>

$S=\operatorname{diag}(\sqrt{w_1},\sqrt{w_2},\sqrt{w_3})$라 두고 $SA=Q_wR_w$를 분해해 $R_wx=Q_w^TSb$를 푼다. 가중 목적은 $\lVert Sb-SAx\rVert_2^2$이다. 양의 가중치는 독립성을 보존하지만 변경하면 분해 대상 행렬이 바뀌므로 실습의 무가중 인수는 일반적으로 그대로 적용할 수 없다. 이는 목적함수의 유도이며 실습 제어기 기능을 주장하지 않는다.

</details>
</div>

## 더 공부할 자료
{: id="further-learning"}

- [Legendre의 원래 관측 모델 번역](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608): 불일치 측정식과 최소제곱을 연결한다. 다음 쪽에 제곱오차 목적이 있다.
- [LAPACK: QR factorization](https://www.netlib.org/lapack/lug/node40.html): 축소·완전 모양을 비교하고 삼각 최소제곱 풀이를 소프트웨어 루틴과 연결한다.
- [LAPACK: representation of orthogonal matrices](https://www.netlib.org/lapack/lug/node128.html): 전체 행렬을 저장하지 않고 직교 인수를 적용하는 방법을 익힌다.
- [ALAFF: 정규방정식의 정확도 손실](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html): 조건수 제곱 항등식을 유도한다.

## 관련 문서
{: id="related-pages"}

- [Householder 반사]({{ '/wiki/linear-algebra/householder-reflection-ko/' | relative_url }})

- [Gram–Schmidt 직교화]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization-ko/' | relative_url }})
- [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})
- [LU 분해]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})
- [Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})
- [행렬 노름]({{ '/wiki/linear-algebra/matrix-norm-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. Legendre, A.-M. (1805). *Sur la méthode des moindres quarrés*, *Nouvelles méthodes pour la détermination des orbites des comètes*의 부록, 72–75쪽. H. A. Ruger·H. M. Walker 번역, D. E. Smith, *A Source Book in Mathematics*, [576–577쪽](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608). 원래 기호 모델이 현대 유도의 동기이며 직선 적합 수치는 만든 값이다.
2. Anderson, E., 외 (1999). *LAPACK Users' Guide*, [QR 분해](https://www.netlib.org/lapack/lug/node40.html), [열 피벗 QR](https://www.netlib.org/lapack/lug/node42.html), [완전 직교분해](https://www.netlib.org/lapack/lug/node43.html).
3. Anderson, E., 외 (1999). *LAPACK Users' Guide*, [직교·유니터리 행렬 표현](https://www.netlib.org/lapack/lug/node128.html), [블록 QR](https://www.netlib.org/lapack/lug/node69.html).
4. van de Geijn, R. A., Myers, M. *Advanced Linear Algebra: Foundations to Frontiers*, [고전적 Gram–Schmidt](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html), [§4.2.5 정규방정식 조건수](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html).
5. LAPACK. [DLARTG 명세](https://www.netlib.org/lapack/explore-html/da/dd3/group__lartg_ga86f8f877eaea0386cdc2c3c175d9ea88.html). 평면 회전과 계산 보호장치.
6. Francis, J. G. F. (1961). [The QR Transformation: A Unitary Analogue to the LR Transformation—Part 1](https://doi.org/10.1093/comjnl/4.3.265). The Computer Journal, 4(3), 265–271. 단일 분해와 구별되는 반복 고윳값 변환을 다룬다.
