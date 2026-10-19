---
title: 희소행렬과 저장 형식
subject: Linear Algebra
lang: ko
translation_key: wiki-linear-algebra-sparse-matrices-and-storage-formats
description: NIST의 출판 예제로 COO, CSR, CSC의 좌표와 포인터 배열을 읽고 변환합니다.
last_modified_at: 2026-10-19
translation_status: complete
translation_source_sha256: 1d2d10711200b9962bb0bc774ed80e7fc838cd186a62e71b4562a183d8d4ca99
interactive_examples: true
---

## 문제: 대부분 0인 계수 저장하기
{: id="the-problem-storing-coefficients-that-are-mostly-zero"}

선형계 $Ax=b$의 각 행은 미지수들이 한 방정식에 주는 기여이다. 큰 시스템에는 0인 계수가 많아 모든 0을 저장하면 방정식에 기여하지 않는 메모리를 쓴다. [Templates for the Solution of Linear Systems의 저장 형식 개관](https://www.netlib.org/linalg/html_templates/node90.html)은 유용한 계수와 위치 복원에 충분한 정보만 남기는 문제에서 시작한다.

다른 문제는 프로그램 간 계수 교환이다. [NIST Matrix Market](https://math.nist.gov/MatrixMarket/)은 수치 알고리즘 비교용 시험행렬을 제공하며 아래 출판 예제는 교환 형식 문서에서 온다. 이 자료는 계산·교환 문제를 설명하지만 COO·CSR·CSC의 최초 발명자를 입증하지 않는다. 기준은 **출판된 형식 설명**으로 응용 측정이나 원래 물리계의 복원이 아니며 단위는 없다.

표기와 곱셈은 [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})를 참고하자. $A\in\mathbb R^{m\times n}$은 실수 $m$행 $n$열이며 0부터 번호를 매겨 $a_{ij}$는 $i$행 $j$열이다.

## 출판된 계산 자료: 교환할 행렬
{: id="published-worked-data-a-matrix-to-exchange"}

[NIST Matrix Market Exchange Formats](https://math.nist.gov/MatrixMarket/formats.html)의 실수 일반 $5\times5$ 예제는

$$
A=\begin{bmatrix}
1&0&0&6&0\\
0&10.5&0&0&0\\
0&0&0.015&0&0\\
0&250.5&0&-280&33.32\\
0&0&0&0&12
\end{bmatrix}.
$$

모든 원소를 보존한다. 원래 좌표 파일은 **1부터 시작**하며 본문 배열은 각 행·열 번호에서 1을 뺀다. 뒤의 배열 변환과 곱은 현대적 계산 유도이다.

25개 위치 중 8개가 0이 아니므로 **밀도**는 $8/25=0.32$, 0의 비율은 $17/25=0.68$이다. 이 작은 행렬은 형식을 추적하기 편리하며 대규모 성능의 입증은 아니다.

### 희소하다는 뜻
{: id="what-does-sparse-mean"}

**희소행렬**은 0이 충분히 많아 0이 아닌 구조의 표현·처리가 유용한 행렬이다. 보편적 밀도 문턱은 없고 인덱스 크기·차원·연산에 달린다. **조밀 표현**은 모든 위치를 저장한다. COO·CSR·CSC에서 저장되지 않은 위치는 0이다. [SciPy 소개](https://docs.scipy.org/doc/scipy/tutorial/sparse.html).

**희소 패턴**은 0이 아닌 위치를 나타낸다. 기존 위치 값 변경과 새 위치 삽입은 다른 저장 작업이다. 수학적 비영 원소 수와 저장 원소 수 $s$도 구별하자. 명시적 0이나 중복 좌표를 저장할 수 있다. 기준에서는 둘 다 8이다. SciPy의 [nnz](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.coo_array.html)는 명시적 0도 포함한 저장 개수이다.

## COO: 값마다 좌표 붙이기
{: id="coo-attach-coordinates-to-every-value"}

**좌표 형식(COO)**은 나란한 배열 `row`, `col`, `data`를 저장한다. 번호 $k$는 `(row[k], col[k])`에 `data[k]`를 기여한다. 좌표는 정렬될 필요가 없다. [SciPy COO](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.coo_array.html)의 삼중항 표현이다.

NIST 파일 원소 순서를 유지하고 좌표를 0부터 세면

```text
shape = (5, 5)
row   = [0,   1,     2, 0,     3,    3,     3,  4]
col   = [0,   1,     2, 3,     1,    3,     4,  4]
data  = [1, 10.5, 0.015, 6, 250.5, -280, 33.32, 12]
```

세로로 읽자. 슬롯 $k=4$는 $a_{3,1}=250.5$이다. $k=3$은 다시 행 0으로 돌아오므로 같은 행의 원소가 인접할 필요는 없다. 0에서 시작해 각 좌표에 삼중항의 값을 더하면 행렬을 복원한다.

`shape`를 항상 보관하자. 최대 저장 인덱스로는 뒤의 빈 행·열을 알 수 없고 완전히 빈 좌표 목록은 어느 차원도 알려 주지 않는다.

### 조립과 중복 좌표
{: id="assembly-and-repeated-coordinates"}

**조립(assembly)**은 기여들을 한 행렬에 모은다. 모델의 다른 부분이 같은 계수에 기여할 수 있다. 가산 관례에서 만든 보충 삼중항 `(1,2,3)`, `(1,2,4)`는 덮어쓰지 않고 $a_{1,2}=7$로 합친다. SciPy의 COO→CSR/CSC는 중복을 합하며 문서는 유한요소 조립과 명시적으로 연결한다. 다른 표현을 가져올 때 확인할 라이브러리 관례이지 모든 인터페이스가 같다고 가정할 근거는 아니다. [SciPy COO 설명](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.coo_array.html).

COO는 삼중항 수집에 편리하다. 인덱싱되지 않은 목록에서 특정 행을 찾으려면 행 좌표들을 조사해야 하며 슬롯마다 두 좌표를 기록하는 공간도 든다. 기준 원소를 행별로 묶어 다른 표현을 유도하자.

## CSR: 반복 행 번호를 경계로 바꾸기
{: id="csr-replace-repeated-row-numbers-with-boundaries"}

**압축 희소 행(CSR)**은 `data`, 열 번호 `indices`, 행 경계 `indptr`를 저장하며 CRS라고도 한다. 한 행의 원소는 연속 구간이다. [Netlib CRS 정의](https://www.netlib.org/linalg/html_templates/node91.html).

기준 삼중항을 행, 이어서 열 순서로 정렬하면

| 행 $i$ | 열 번호 | 값 | 원소 수 |
| --- | --- | --- | --- |
| 0 | 0, 3 | 1, 6 | 2 |
| 1 | 1 | 10.5 | 1 |
| 2 | 2 | 0.015 | 1 |
| 3 | 1, 3, 4 | 250.5, −280, 33.32 | 3 |
| 4 | 4 | 12 | 1 |

개수는 `[2,1,1,3,1]`이다. 0에서 누적하면 $0,2,3,4,7,8$로 행 경계를 얻는다.

```text
shape   = (5, 5)
indptr  = [0, 2, 3, 4, 7, 8]
indices = [0, 3,    1,     2,     1,    3,     4,  4]
data    = [1, 6, 10.5, 0.015, 250.5, -280, 33.32, 12]
```

행 $i$의 슬롯은 `indptr[i]`를 **포함**하고 `indptr[i+1]`은 **제외**하는 `[indptr[i], indptr[i+1])`이다. 열은 `indices[k]`이다. 행 3의 슬롯 $4,5,6$은 $(3,1,250.5)$, $(3,3,-280)$, $(3,4,33.32)$를 복원한다. 마지막 포인터 8은 끝이지 아홉 번째 계수가 아니다. [SciPy CSR 생성자](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html)의 구간 관례이다.

### 빈 행과 유효성
{: id="empty-rows-and-validity"}

빈 행도 두 경계가 있으며 값이 같다. 모양을 유지하며 행 3의 원소를 제거하는 **가상 변경**에서는 개수가 `[2,1,1,0,1]`이 되어 `indptr=[0,2,3,4,4,5]`이다. 반복 4는 오류가 아닌 빈 구간이다.

빈 여유 공간 없이 0부터 세는 본문 표현에서는 다음을 확인한다.

- `data`, `indices` 길이는 $s$, `indptr` 길이는 $m+1$이다.
- `indptr[0]=0`, `indptr[m]=s`이고 포인터는 감소하지 않는다.
- 열 번호는 모두 0부터 $n-1$까지의 정수이다.

슬롯을 행 구간으로 나누면 이 조건들이 나온다. **정규 CSR**은 추가로 각 행의 열 번호가 정렬되고 중복이 없어야 한다. [SciPy 정규 형식](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html)과 같다. 행별 묶음만으로 둘 다 보장되지는 않는다.

## CSC: 같은 생각으로 열 압축하기
{: id="csc-compress-columns-with-the-same-idea"}

**압축 희소 열(CSC)**은 열별로 묶고 행 번호를 저장하며 CCS라고도 한다. CSR에서 행·열 역할을 바꾼다. [Netlib CCS 정의](https://www.netlib.org/linalg/html_templates/node92.html).

기준 열들의 원소 수는 $1,2,1,2,2$로 누적합은 $0,1,3,4,6,8$이다.

```text
shape   = (5, 5)
indptr  = [0, 1, 3, 4, 6, 8]
indices = [0,    1,     3,     2, 0,    3,     3,  4]
data    = [1, 10.5, 250.5, 0.015, 6, -280, 33.32, 12]
```

열 $j$는 `[indptr[j], indptr[j+1])`이다. 열 1은 슬롯 1,2에서 행 1,3의 값 $10.5,250.5$를 쓴다. 여기서 `indices`는 **행**, CSR에서는 **열**이다. [SciPy CSC 생성자](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_array.html).

유효성은 $m,n$을 바꿔 포인터가 $n+1$개이고 행 번호가 $[0,m)$이다. 정규 CSC는 열 안의 행 번호를 정렬하고 중복을 없앤다. 빈 열은 CSR의 빈 행처럼 인접 포인터가 같다. [SciPy CSC 설명](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_array.html).

### 전치와 형식 변환의 차이
{: id="transposition-versus-format-conversion"}

**전치** $A^T$는 행·열 좌표를 바꾼다. 따라서 $m\times n$ 행렬의 CSR 배열은 $n\times m$ 전치의 CSC로 해석할 수 있다. 행 묶음이 열 묶음, 열 번호가 행 번호가 된다. 정의에서 직접 나오며 [Netlib CCS](https://www.netlib.org/linalg/html_templates/node92.html)도 설명한다.

이 해석은 $A$가 아닌 $A^T$이다. **같은 $A$**의 CSR을 CSC로 바꾸려면 재배열해야 한다. 기준 CSR의 `data=[1,6,…]`과 CSC의 `[1,10.5,…]`이 차이를 보인다.

## 출판된 기준 탐구
{: id="explore-the-published-baseline"}

{% include sparse-storage-lab-ko.html %}

형식과 추적할 행·열을 고르자. 작은 `k` 표시는 크기가 아닌 `data`의 위치이다. COO는 출판 순서, CSR·CSC는 정렬된 내부 번호를 쓴다. 제거 시나리오는 가상 실험으로 $5\times5$ 모양을 유지하고 0은 명시적으로 저장하지 않는다. 기준을 복원하면 출판 원소로 돌아간다. JavaScript 없이도 위 배열을 읽을 수 있다.

## 계산: 같은 곱, 다른 순회
{: id="computation-the-same-product-different-traversal"}

아래 곱·연산 수는 출처의 시간이 아니라 **배열 정의의 현대적 유도**이다. 보충 입력 $x=(1,1,1,1,1)^T$에서는 각 출력이 행 합이다.

$$
Ax=\begin{bmatrix}
1+6\\10.5\\0.015\\250.5-280+33.32\\12
\end{bmatrix}
=\begin{bmatrix}7\\10.5\\0.015\\3.82\\12\end{bmatrix}.
$$

### CSR은 출력 하나씩 모은다
{: id="csr-gathers-one-output-at-a-time"}

$y_i=\sum_ja_{ij}x_j$에서 행 $i$는 출력 하나를 정한다. 구간은 방문할 항들을 정확히 알려 준다.

```text
for i = 0, ..., m-1:
    y[i] = 0
    for k = indptr[i], ..., indptr[i+1]-1:
        y[i] += data[k] * x[indices[k]]
```

행 3은 $250.5x_1-280x_3+33.32x_4$를 계산한다. 빈 구간 출력은 0이다. 슬롯을 한 번씩 방문하고 $m$행을 초기화해 $O(m+s)$ 작업이다. $O(\cdot)$는 고정 상수를 무시한 증가율이다. 정렬 안 된 번호와 가산 중복도 이 반복문에서 대수적 곱을 주므로 먼저 정규화할 필요는 없다.

### CSC는 각 열의 기여를 흩어 더한다
{: id="csc-scatters-each-columns-contribution"}

$a_j$가 열 $j$일 때 동치식 $Ax=\sum_jx_ja_j$는 각 열을 $x_j$배해 출력에 더하라고 말한다.

```text
y[0:m]을 0으로 초기화한다
for j = 0, ..., n-1:
    for k = indptr[j], ..., indptr[j+1]-1:
        y[indices[k]] += data[k] * x[j]
```

열 1은 $y_1$에 $10.5x_1$, $y_3$에 $250.5x_1$을 더한다. 이 반복문은 $s$슬롯, $n$열 방문과 $m$출력 초기화로 $O(m+n+s)$이다. $A^Tx$에는 CSC 열 구간이 각 출력 내적을 계산한다. 가산 COO의 `y[row[k]] += data[k] * x[col[k]]`도 초기화와 함께 $O(m+s)$에 $Ax$를 구한다. 점근 수가 비슷해도 형식은 접근·구성을 바꾼다.

CSR의 병렬 행 계산은 서로 다른 출력에 쓴다. CSC 병렬 열은 같은 출력을 갱신할 수 있어 누적 조정이 필요하다. 반복문에서 나온 관찰이지 보편적 속도 순위가 아니다. 하드웨어·행 길이·구현도 중요하다.

## 변환: 세고 예약하고 배치하기
{: id="conversion-count-reserve-and-place"}

유효한 COO 삼중항 $s$개를 행 안 정렬 없이 CSR로 묶으려면

1. 길이 $m$ 배열에 행별 삼중항 수를 센다.
2. 누적합으로 `indptr`를 만든다.
3. 행 시작 경계를 임시 `next` 배열에 복사한다.
4. `(i,j,v)`마다 `next[i]` 슬롯에 `j,v`를 넣고 `next[i]`를 증가시킨다.

각 입력 슬롯은 한 번 배치된다. 개수·누적합의 총작업은 $O(m+s)$, 출력 외 임시 기록은 $O(m)$이다. 명시한 알고리즘의 유도이지 모든 라이브러리 변환의 약속이 아니다. 정렬·중복 합산은 추가 단계이다. 삼중항을 `(row,column)` 비교정렬하면 정규 행 순서까지 $O(s\log s+m)$이며 같은 좌표를 합하고 필요하면 결과 0을 제거한다. CSC는 열 개수와 $n$에 대한 대응 상한을 쓴다. 원래 모양을 계속 유지한다.

## 저장 비용과 형식 선택
{: id="storage-cost-and-choosing-a-format"}

값당 $b_v$바이트, 인덱스·포인터당 $b_i$바이트라 하자. 원소 개수에서 다음 **페이로드 추정**을 얻는다. 객체 헤더·정렬 여백·여유 용량·모양 메타데이터·변환 작업공간은 제외한다.

| 표현 | 값 슬롯 | 정수 슬롯 | 페이로드 바이트 |
| --- | --- | --- | --- |
| 조밀 | $mn$ | 0 | $mn b_v$ |
| COO | $s$ | $2s$ | $s(b_v+2b_i)$ |
| CSR | $s$ | $s+m+1$ | $s(b_v+b_i)+(m+1)b_i$ |
| CSC | $s$ | $s+n+1$ | $s(b_v+b_i)+(n+1)b_i$ |

출판 기준에서 값 8바이트, 정수 4바이트를 가정하면 조밀은 $25\cdot8=200$, COO는 $8\cdot16=128$, 압축 형식은 각각 $8\cdot12+6\cdot4=120$바이트이다. 실제 할당 측정이 아닌 설명용 계산이다.

이 조밀 모델보다 CSR 페이로드가 작은 정확한 조건은

$$
s(b_v+b_i)+(m+1)b_i<mn b_v.
$$

**보충용 가상 조밀 $2\times2$ 행렬**은 같은 너비에 $s=4$로 조밀 32바이트, CSR $4\cdot12+3\cdot4=60$바이트이다. 희소 저장이 더 비쌀 수 있다. 매우 긴 행렬에 원소가 적으면 CSR 행 포인터 비용이 크다. COO에는 차원 크기의 배열이 없고 CSC의 포인터 수가 더 적을 수 있다.

| 작업 | 유용한 출발 형식 | 이유 |
| --- | --- | --- |
| 임의 순서의 기여 수집 | COO | 각 원소가 두 좌표를 가짐 |
| 행 반복 순회·추출 | CSR | 경계로 연속 구간 찾기 |
| 열 반복 순회·추출 | CSC | 경계로 연속 구간 찾기 |
| 반복 $Ax$ | CSR을 흔히 검토 | 한 행이 출력 하나 계산 |
| 빈번한 임의 삽입 | 구성 중 DOK·LIL 검토 | 압축 구간 이동과 포인터 수정이 필요할 수 있음 |

행·열 접근과 압축 구조 변경 비용은 [SciPy CSR](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html), [CSC](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_array.html)에 있다. DOK는 좌표를 키로 한 사전, LIL은 행별 목록을 저장한다. [형식 개관](https://docs.scipy.org/doc/scipy/tutorial/sparse.html)에서 블록·대각 형식도 보자. 해법에 넘길 때 기대 형식을 고르고 반복 작업에서는 변환 비용도 계산한다.

## 오해와 경계 사례
{: id="misconceptions-and-edge-cases"}

- **“압축하면 값의 정밀도가 떨어진다.”** CSR·CSC는 묶어서 위치 정보를 압축한다. 형식 자체는 값을 양자화하지 않으며 숫자 자료형이 정밀도를 정한다.
- **“저장한 값은 모두 0이 아니다.”** 명시적 0도 슬롯을 쓴다. 같은 좌표의 만든 기여 $+3,-3$도 상쇄될 수 있다. 중복 합산과 저장 0 제거는 다른 연산이다. [SciPy의 암묵적 0·중복 설명](https://docs.scipy.org/doc/scipy/tutorial/sparse.html).
- **“모든 연산은 희소성을 유지한다.”** 모든 위치에 0이 아닌 상수를 더하면 0이던 곳도 비영이 된다. 분해 중 새 비영 위치인 **채움(fill-in)**도 생길 수 있다. [Schur 보완행렬의 결합 예제]({{ '/wiki/linear-algebra/schur-complement-ko/' | relative_url }}).
- **“빈 행렬에는 메타데이터가 필요 없다.”** 영 $m\times n$ 행렬의 COO 삼중항은 비어 있지만 CSR은 $m+1$, CSC는 $n+1$개의 0 포인터를 가지며 모두 모양을 유지한다. 구간 정의에서 나온다.

## 연습문제
{: id="practice-problems"}

문제는 직접 만든 교육용 연습이다. 1·4번은 출판 기준을, 나머지 수치는 보충용 예제를 쓴다.

### 1. 손계산: 열 복원하기
{: id="1-hand-calculation-recover-a-column"}

기준 CSC에서 열 3을 복원하고 $x_3=2$일 때 그 열의 기여를 구하라.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

`indptr`의 3·4번 경계를 읽는다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

경계는 4와 6이므로 슬롯 4·5를 쓴다. 행 0·3에 값 6·−280이다. 열은 $(6,0,0,-280,0)^T$, 두 배 기여는 $(12,0,0,-560,0)^T$이다. 전체 곱에는 다른 열의 기여도 있다.

</details>
</div>

### 2. 손계산: 빈 차원 보존하기
{: id="2-hand-calculation-preserve-empty-dimensions"}

$B$를 CSR·CSC로 표현하라.

$$
B=\begin{bmatrix}0&5&0&0\\0&0&0&0\\2&0&0&0\end{bmatrix}.
$$

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

빈 것까지 세 행·네 열을 모두 센다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

두 표현 모두 `shape=(3,4)`이다. CSR은 `data=[5,2]`, `indices=[1,0]`, `indptr=[0,1,1,2]`이다. CSC는 `data=[2,5]`, `indices=[2,0]`, `indptr=[0,1,2,2,2]`이다. 같은 CSR 경계는 빈 가운데 행, 같은 CSC 경계는 끝 두 빈 열이다.

</details>
</div>

### 3. 전략: 구성 흐름 고르기
{: id="3-strategy-choose-a-construction-workflow"}

프로그램이 임의 순서로 중복도 있는 기여를 모은 뒤 반복해 $Ax$를 구한다. 어떤 저장 흐름을 시도하고 무엇을 측정하겠는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

원소 수집과 반복 순회를 구별한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

전체 모양과 COO 삼중항을 모아 의도한 중복 규칙을 적용하고 행 기반 곱의 CSR로 바꾼다. 0을 지우면 응용 의미가 없는지 확인한다. 구성·변환 시간, 페이로드·임시 메모리와 반복 곱 시간을 측정한다. 변환은 전체 작업량으로 정당화해야 하며 곱 한 번으로는 비용을 회수하지 못할 수 있다.

</details>
</div>

### 4. 논리: 전치 해석 증명하기
{: id="4-logic-prove-the-transpose-interpretation"}

기준 CSR 배열을 CSC로 해석하면 왜 $A^T$인가? 왜 같은 $A$의 CSC는 아닌가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

각 해석에서 값 6의 좌표를 추적한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

CSR 행 구간 $i$의 내부 번호 $j$는 $a_{ij}$이다. CSC에서는 같은 구간이 열 $i$, 행 $j$이므로 $(A^T)_{ji}=a_{ij}$이다. 모양도 $(n,m)$이어야 한다. 6은 $(0,3)$에서 $(3,0)$으로 가지만 $a_{3,0}=0$이므로 정사각 모양이 같아도 원래 행렬의 CSC가 아니다.

</details>
</div>

### 5. 논리: 저장과 계수 구별하기
{: id="5-logic-distinguish-storage-from-coefficients"}

모양 $(2,3)$의 가산 COO 삼중항이 `(0,1,3)`, `(0,1,-3)`, `(1,2,0)`이다. 중복 합산·명시적 0 제거 전후의 저장 수와 수학적 비영 개수는?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

행렬을 복원한 뒤 비영 계수를 센다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

처음은 저장 3개지만 영행렬이다. 중복을 합하고 0을 유지하면 저장 0 두 개가 남고 이를 제거하면 저장도 0개이다. 언제나 수학적 비영 개수는 0, 모양은 $(2,3)$이다.

</details>
</div>

### 6. 응용: 메모리 예산 추정
{: id="6-application-estimate-a-memory-budget"}

$1000\times1000$ 행렬에 중복·명시적 0 없이 저장 원소 5000개가 있다. 값 8바이트·번호 4바이트에서 조밀·COO·CSR 페이로드를 추정하라. 어느 표현이 가장 빠른지도 알 수 있는가?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>힌트 보기</summary>

CSR 포인터 1001개를 포함하고 바이트와 시간을 구별한다.

</details>
<details markdown="1">
<summary>풀이 보기</summary>

조밀은 $10^6\cdot8=8{,}000{,}000$, COO는 $5000\cdot16=80{,}000$, CSR은 $5000\cdot12+1001\cdot4=64{,}004$바이트이다. 메타데이터·임시 할당은 제외한다. 가정 아래의 공간 절약을 보일 뿐 시간은 연산·구현에 달려 측정해야 한다.

</details>
</div>

## 더 공부할 자료
{: id="further-learning"}

- [NIST: Matrix Market file formats](https://math.nist.gov/MatrixMarket/formats.html): 삼중항과 교환 파일, 1부터 시작하는 번호와 본문 배열을 비교한다.
- [Netlib: 희소 저장 개관](https://www.netlib.org/linalg/html_templates/node90.html): 블록·대각 등 구조가 다른 형식을 유도하는 이유를 살핀다.
- [SciPy: 희소 배열 안내](https://docs.scipy.org/doc/scipy/tutorial/sparse.html): 구성·변환과 저장·암묵적 0의 차이를 연습한다.

## 관련 문서
{: id="related-pages"}

- [행렬 인수분해와 분해]({{ '/wiki/linear-algebra/matrix-decomposition-ko/' | relative_url }})
- [LU 분해]({{ '/wiki/linear-algebra/lu-decomposition-ko/' | relative_url }})
- [Cholesky 분해]({{ '/wiki/linear-algebra/cholesky-decomposition-ko/' | relative_url }})
- [Schur 보완행렬]({{ '/wiki/linear-algebra/schur-complement-ko/' | relative_url }})
- [선형계획법]({{ '/wiki/optimization/linear-programming-ko/' | relative_url }})

## 참고문헌
{: id="references"}

1. NIST. [Matrix Market](https://math.nist.gov/MatrixMarket/). 수치 선형대수 알고리즘 비교용 시험 자료라는 저장소의 목적.
2. NIST. [Matrix Market: Text File Formats](https://math.nist.gov/MatrixMarket/formats.html)의 실수 일반 $5\times5$ 예제. 기준 계수 8개와 파일의 1부터 세는 관례의 출처.
3. Barrett, R., 외. *Templates for the Solution of Linear Systems: Building Blocks for Iterative Methods*. Netlib 온라인판: [저장 개관](https://www.netlib.org/linalg/html_templates/node90.html), [압축 행](https://www.netlib.org/linalg/html_templates/node91.html), [압축 열](https://www.netlib.org/linalg/html_templates/node92.html).
4. SciPy. [coo_array](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.coo_array.html). 좌표 저장, 중복 처리와 저장 개수.
5. SciPy. [csr_array](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html). 행 구간, 정규 형식과 접근 절충.
6. SciPy. [csc_array](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_array.html). 열 구간, 정규 형식과 접근 절충.
7. SciPy. [Sparse Arrays tutorial](https://docs.scipy.org/doc/scipy/tutorial/sparse.html). 형식 선택과 명시적·암묵적 0.
