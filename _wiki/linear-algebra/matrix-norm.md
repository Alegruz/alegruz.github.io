---
title: Matrix norms
subject: Linear Algebra
interactive_examples: true
description: Measure matrix amplification with induced norms, distinguish spectral and Frobenius norms, and bound errors in linear systems.
last_modified_at: 2026-10-13
---

## Rounding errors: how much can a matrix change a result?

A computed solution may satisfy its equations closely and still miss the true solution. Turing's 1948 *Rounding-off Errors in Matrix Processes* studies the accuracy of linear solves and matrix inversion under rounding; its [original abstract](https://academic.oup.com/qjmam/article-abstract/1/1/287/1883483) identifies that problem. This motivates measuring both matrix error and its possible amplification. We use modern norm notation below, not Turing's original notation or a claim of priority for every definition on this page. The abstract does not supply a numerical system; the primary numerical example here is the later published LAPACK example, with all entries preserved.

Read [vector norms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }}) first. A matrix $A$ is an array whose product $Ax$ combines input coordinates to form an output. If $Ax=b$, the **residual** $r=b-A\hat x$ measures how far a candidate solution $\hat x$ misses the equations. The **solution error** $e=x-\hat x$ instead measures how far it misses the answer. Subtracting the equations gives $Ae=r$. When $A$ is invertible, $e=A^{-1}r$: reversing the matrix may enlarge a small residual. An inverse is a matrix that undoes a transformation; for example, $\operatorname{diag}(2,1)$ means a diagonal matrix with diagonal entries $2$ and $1$ and zeros elsewhere, and its inverse halves the first coordinate.

### Published worked data: LAPACK's matrix approximation

**Published illustrative data, modern recalculation.** The first matrix example following Table 4.2 and the vector-error example in the 1999 [LAPACK Users' Guide, “How to Measure Errors”](https://www.netlib.org/lapack/lug/node75.html) gives

$$
A=\begin{bmatrix}1&2&3\\4&5&6\\7&8&10\end{bmatrix},\qquad
\hat A=\begin{bmatrix}0.44&2.36&3.04\\3.09&5.87&6.66\\7.36&7.77&9.07\end{bmatrix}.
$$

These are the guide's illustrative numbers, not physical measurements; it specifies no units. Keep the final reference entry $10$, not $9$. The discrepancy is

$$
E=\hat A-A=\begin{bmatrix}-0.56&0.36&0.04\\-0.91&0.87&0.66\\0.36&-0.23&-0.93\end{bmatrix}.
$$

Work from entries to whole-array summaries:

1. Absolute row sums are $0.96$, $2.44$, and $1.52$. Their maximum is $2.44$, the induced infinity norm.
2. Absolute column sums are $1.83$, $1.46$, and $1.63$. Their maximum is $1.83$, the induced $1$-norm.
3. Adding all nine squared entries gives $3.5128$. Its square root is $1.8742465\ldots$, the Frobenius norm.

The row rule has a transformation interpretation. Choose a vector whose signs reinforce the largest row, $z=(-1,1,1)^T$. Then

$$
Ez=(0.96,2.44,-1.52)^T.
$$

The largest input magnitude is $1$ and the largest output magnitude is $2.44$. The matrix discrepancy can therefore turn a coordinate-bounded input into an output error this large. The derivation below proves no input of maximum size $1$ can do worse.

For relative matrix error, the maximum absolute reference row sum is $25$, giving $2.44/25=0.0976$. The approximate matrix's maximum row sum is $24.2$, giving $2.44/24.2\approx0.100826$. The guide prints both denominator conventions (rounded to $0.0976$ and $0.1008$). They are different ratios, not a discrepancy in the arithmetic.

### Primary interactive example: restore the published matrix

{% include wiki-lab.html kind="matrix-error" title="Recalculate LAPACK's published matrix errors" source_url="https://www.netlib.org/lapack/lug/node75.html" source_label="LAPACK, first matrix example after Table 4.2" plot_description="Bars show the absolute error sums of the three matrix rows, with their values labeled." %}

The reference matrix stays fixed; edits change only the approximation and are hypothetical. Restore the published baseline to replay the calculation above. The bars are absolute row sums, not individual entries or singular values. The primary baseline remains readable in the worked example without JavaScript.

## Generalize: entry size and amplification

A matrix is both an array of numbers and a transformation $x\mapsto Ax$. The Frobenius norm combines entry magnitudes; an induced norm measures maximum vector amplification. The published example shows why these are different questions before we give the general definitions.

## Definition and convention

A norm on matrices satisfies $\lVert A\rVert\ge0$ with equality exactly at $A=0$, $\lVert\alpha A\rVert=|\alpha|\lVert A\rVert$, and $\lVert A+B\rVert\le\lVert A\rVert+\lVert B\rVert$. These are the [vector norm axioms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }}) applied to arrays. Here $A,B\in\mathbb R^{m\times n}$ means real arrays with $m$ rows and $n$ columns; $a_{ij}$ means the entry in row $i$, column $j$. Arrays need the same shape when added. A product $AB$ requires the number of columns of $A$ to equal the number of rows of $B$.

Some texts additionally require a **matrix norm** to be **submultiplicative**:

$$
\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert
$$

for compatible dimensions. This page distinguishes the norm axioms from this extra property. See [Higham's definition and terminology](https://nhigham.com/2021/10/12/what-is-a-matrix-norm/).

## Induced norms: worst-case amplification

Using the same vector $p$-norm for input and output, define

$$
\lVert A\rVert_p=\max_{x\ne0}\frac{\lVert Ax\rVert_p}{\lVert x\rVert_p}
=\max_{\lVert x\rVert_p=1}\lVert Ax\rVert_p.
$$

The input has $n$ coordinates and the output has $m$. The two expressions agree because a nonzero input can be divided by its size. These norms are also called **operator** or **subordinate** norms. Their formulas are

| Norm | Formula | Interpretation |
| --- | --- | --- |
| Induced $1$ | $\max_j\sum_i|a_{ij}|$ | Largest absolute column sum |
| Induced $\infty$ | $\max_i\sum_j|a_{ij}|$ | Largest absolute row sum |
| Induced $2$ (spectral) | $\sigma_{\max}(A)=\sqrt{\lambda_{\max}(A^TA)}$ | Largest Euclidean stretch |

A **singular value** is a stretch factor in perpendicular input and output directions; for example, $\operatorname{diag}(3,1)$ has singular values $3$ and $1$. An **eigenvalue** $\lambda$ satisfies $Mv=\lambda v$ for some nonzero vector $v$, so that direction keeps its orientation up to scaling. Here $\sigma_{\max}$ is the largest singular value and $\lambda_{\max}$ the largest eigenvalue of $A^TA$. The transpose $A^T$ exchanges rows and columns. This matrix is symmetric and **positive semidefinite** (PSD), meaning $v^TA^TAv=\lVert Av\rVert_2^2\ge0$. See [matrix decompositions]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}) and [positive-definite and semidefinite matrices]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }}). For complex input, replace $A^T$ by the **conjugate transpose** $A^*$, which transposes the array and changes the sign of every imaginary part. See [Higham's induced-norm formulas](https://nhigham.com/2021/10/12/what-is-a-matrix-norm/).

### Why columns for the 1-norm and rows for infinity?

The following proofs are modern derivations from the cited definitions. Two-dimensional geometry examples and practice data are supplementary invented illustrations.

Write $Ax=\sum_jx_j a_j$, where $a_j$ is column $j$. Then

$$
\lVert Ax\rVert_1\le\sum_j|x_j|\lVert a_j\rVert_1
\le\left(\max_j\lVert a_j\rVert_1\right)\lVert x\rVert_1.
$$

The **coordinate basis vector** $e_j$ has $1$ in position $j$ and $0$ elsewhere; for example, $e_2=(0,1)^T$ in two dimensions. Choose $x=e_j$ for a largest column to attain the bound. For the infinity norm, each output coordinate satisfies

$$
|(Ax)_i|\le\sum_j|a_{ij}||x_j|
\le\left(\sum_j|a_{ij}|\right)\lVert x\rVert_\infty.
$$

Choose a row with largest sum and give each input coordinate the sign of that row's coefficient, choosing $1$ at zero coefficients. This produces an input of infinity norm $1$ that attains the bound. Absolute values prevent cancellation from hiding the worst case.

## Frobenius norm: size of the whole array

The **Frobenius norm** treats all entries as one long vector:

$$
\lVert A\rVert_F=\sqrt{\sum_{i,j}|a_{ij}|^2}.
$$

It is submultiplicative, but for square matrices of size $n>1$ it is not induced by a vector norm: $\lVert I_n\rVert_F=\sqrt n$, while every induced norm gives $\lVert I_n\rVert=1$. See [Higham's Frobenius-norm discussion](https://nhigham.com/2021/10/12/what-is-a-matrix-norm/).

The identity changes no vector's length, yet has $n$ nonzero entries. This explains why total entry magnitude and maximum amplification are different questions.

## Supplementary worked example: compute all four norms

This smaller matrix is an invented teaching example, separate from the published three-by-three data. Let

$$
A=\begin{bmatrix}1&2\\0&2\end{bmatrix}.
$$

1. The absolute column sums are $1$ and $4$, so $\lVert A\rVert_1=4$.
2. The absolute row sums are $3$ and $2$, so $\lVert A\rVert_\infty=3$.
3. The entry squares sum to $1+4+0+4=9$, so $\lVert A\rVert_F=3$.
4. For the spectral norm, form

$$
A^TA=\begin{bmatrix}1&2\\2&8\end{bmatrix}.
$$

To find an eigenvalue, require $A^TA-\lambda I$ to map some nonzero vector to zero (a **null vector**). Its **determinant**, a scalar that is zero exactly when a square matrix is not invertible, must then vanish. The determinant of <span class="math-inline" markdown="0">\(\begin{pmatrix}u&v\\w&z\end{pmatrix}\)</span> is $uz-vw$, so here

$$
\det(A^TA-\lambda I)=(1-\lambda)(8-\lambda)-4=\lambda^2-9\lambda+4.
$$

This expression is the **characteristic polynomial**. Solving it with the quadratic formula gives the two eigenvalues. Thus

$$
\lambda_\pm=\frac{9\pm\sqrt{65}}2,\qquad
\lVert A\rVert_2=\sqrt{\frac{9+\sqrt{65}}2}\approx2.92081.
$$

The $1$-norm is attained at $x=(0,1)^T$, whose output is $(2,2)^T$. The infinity norm is attained at $x=(1,1)^T$, whose output is $(3,2)^T$. For the spectral norm, an eigenvector of $A^TA$ for $\lambda_+$ is $(2,\lambda_+-1)^T$; normalize it in the Euclidean norm to get a maximizing input. Different measuring rules can select different worst-case directions.

## Geometry: a unit circle becomes an ellipse

The [SVD]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}) writes $A=U\Sigma V^T$. An **orthogonal** square matrix $Q$ satisfies $Q^TQ=I$, where $I$ is the identity matrix ($Ix=x$); it rotates or reflects without changing Euclidean length. Orthogonal factors preserve Euclidean length, while $\Sigma$ scales perpendicular coordinates. The largest scale gives the spectral norm.

For $A=\operatorname{diag}(3,1)$, the unit circle becomes an ellipse with semiaxes $3$ and $1$. The spectral norm is $3$; the Frobenius norm is $\sqrt{10}$, combining both scales.

{% include image.html src="/assets/images/wiki/svd-stretch.svg" alt="A unit circle becomes an ellipse with semiaxes three and one, or collapses to a segment when the second scale is zero." caption="The longest output radius gives the spectral norm. Both transformed shapes have longest radius three, despite having different Frobenius norms: square root of ten for diag(3, 1), and three for diag(3, 0)." %}

### Supplementary interactive example: explore directions and matrices

{% include wiki-lab.html kind="matrix-norm" title="Explore worst-case matrix stretch" plot_description="The Euclidean unit circle, its image under a two by two matrix, and a selected unit input and its output." %}

The default two-by-two matrix is invented, and edits are hypothetical. The restore button returns to that teaching baseline. Start with this supplementary worked-example matrix. Rotate the input direction and compare its amplification with the computed spectral norm. Try a diagonal matrix, the identity, the zero matrix, and `[[0,5],[0,0]]`. A sampled direction supplies a lower bound, while the exact two-by-two formula computes the maximum. Controls support keyboard input; the static examples above remain useful without JavaScript.

## Error bounds and composition

From the induced-norm definition,

$$
\lVert A\delta x\rVert_p\le\lVert A\rVert_p\lVert\delta x\rVert_p.
$$

If the matrix itself changes by $E$, then the output change at a fixed input is $Ex$ and is bounded by $\lVert E\rVert_p\lVert x\rVert_p$. Apply the same inequality twice to get

$$
\lVert ABx\rVert_p\le\lVert A\rVert_p\lVert Bx\rVert_p
\le\lVert A\rVert_p\lVert B\rVert_p\lVert x\rVert_p.
$$

Taking the maximum over unit inputs proves submultiplicativity. This explains why norms help bound a sequence of transformations without computing every possible input.

### Return to the rounding-error problem: residual versus solution error

For invertible square $A$, let $Ax=b$, let $\hat x$ be an approximation, and define residual $r=b-A\hat x$. Then

$$
x-\hat x=A^{-1}r,\qquad
\lVert x-\hat x\rVert_p\le\lVert A^{-1}\rVert_p\lVert r\rVert_p.
$$

Since $\lVert b\rVert_p\le\lVert A\rVert_p\lVert x\rVert_p$, for nonzero $b$ this yields

$$
\frac{\lVert x-\hat x\rVert_p}{\lVert x\rVert_p}
\le\kappa_p(A)\frac{\lVert r\rVert_p}{\lVert b\rVert_p},\qquad
\kappa_p(A)=\lVert A\rVert_p\lVert A^{-1}\rVert_p.
$$

The **condition number** is the product of the largest forward and inverse amplification factors. It converts a relative residual bound into a relative solution-error bound. [LAPACK's error-measure guide](https://www.netlib.org/lapack/lug/node75.html) defines conditioning in these norms. In Euclidean geometry, $\kappa_2(A)=\sigma_{\max}/\sigma_{\min}$: reversing a very small stretch magnifies errors. For an [SPD matrix]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }}), these singular values equal its positive eigenvalues.

For the published LAPACK reference matrix, an exact modern recalculation gives

$$
A^{-1}=\frac13\begin{bmatrix}-2&-4&3\\-2&11&-6\\3&-6&3\end{bmatrix}.
$$

Its absolute row sums are $3$, $19/3$, and $4$, so $\kappa_\infty(A)=25\cdot19/3=475/3\approx158.333$, matching the guide's rounded $158.33$. This measures worst-case sensitivity; it does not assert that every residual is amplified by the full factor. The input matrix in the primary lab remains fixed because its published approximation measures entry error, not an actual elimination run. We do not invent a historical right-hand side or solver trajectory for it.

As a **supplementary invented example**, for $A=\operatorname{diag}(1,0.001)$, $b=(1,0)^T$, and $\hat x=(1,1)^T$, the exact solution is $(1,0)^T$. The residual has Euclidean size $0.001$, but the solution error has size $1$. Here $\kappa_2(A)=1000$, and the bound is attained.

## Common misconceptions and counterexamples

**Matrix 1-norm is not the sum of all absolute entries.** In the supplementary two-by-two example, that sum is $5$ but the induced $1$-norm is $4$. Likewise the induced infinity norm is a row sum, not the largest entry.

**Eigenvalue magnitude is not generally Euclidean stretch.** For <span class="math-inline" markdown="0">\(N=\begin{bmatrix}0&5\\0&0\end{bmatrix}\)</span>, both eigenvalues are zero, yet $N(0,1)^T=(5,0)^T$ and $\lVert N\rVert_2=5$. Singular values capture this stretch. For real symmetric matrices, orthogonal diagonalization does give $\lVert A\rVert_2=\max_i|\lambda_i|$.

**A norm on entries need not be submultiplicative.** Let $J$ be the two-by-two all-ones matrix. Its largest absolute entry is $1$, but every entry of $J^2$ is $2$. Thus the entrywise maximum is a norm on the array but fails the product bound with constant $1$.

**A software default may select Frobenius size.** In [NumPy's documented conventions](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html), `np.linalg.norm(A)` for a two-dimensional matrix uses Frobenius size; `np.linalg.norm(A, ord=2)` uses the spectral norm. State both the array shape and the requested norm.

## Practice problems

These are supplementary original exercises with invented data, not computations reported in the historical sources.

### 1. Hand calculation: a rectangular matrix

Find the induced $1$, induced infinity, and Frobenius norms of <span class="math-inline" markdown="0">\(B=\begin{bmatrix}1&-2&0\\3&0&4\end{bmatrix}\)</span>. Give an input attaining its $1$-norm.

<details markdown="1">
<summary>Hint</summary>

List column sums, row sums, and entry squares separately.

</details>
<details markdown="1">
<summary>Worked solution</summary>

Column sums are $4,2,4$, giving $\lVert B\rVert_1=4$. Row sums are $3,7$, giving $\lVert B\rVert_\infty=7$. The squares sum to $1+4+9+16=30$, so $\lVert B\rVert_F=\sqrt{30}$. Either $e_1$ or $e_3$ is a unit $1$-norm input with output $1$-norm $4$.

</details>

### 2. Interpretation: choose the relevant norm

A matrix approximation has error $E$. You want (a) total squared entry error and (b) the largest output error over Euclidean unit inputs. Which quantities answer these questions? Can they coincide?

<details markdown="1">
<summary>Hint</summary>

Compare the array viewpoint with the transformation viewpoint.

</details>
<details markdown="1">
<summary>Worked solution</summary>

(a) is $\lVert E\rVert_F^2$; (b) is $\lVert E\rVert_2$. These are different objectives. For $E=\operatorname{diag}(1,0)$ both values happen to be $1$; for $E=I_2$ they are $2$ and $1$. Numerical coincidence does not make the definitions interchangeable.

</details>

### 3. Abstract reasoning: why induced identity size is one

Prove that every induced norm gives $\lVert I_n\rVert=1$. Deduce $\kappa(A)\ge1$ for invertible $A$ using the product bound.

<details markdown="1">
<summary>Hint</summary>

Evaluate the amplification ratio, then use $AA^{-1}=I_n$.

</details>
<details markdown="1">
<summary>Worked solution</summary>

For every nonzero $x$, $\lVert I_nx\rVert/\lVert x\rVert=1$, so the maximum is $1$. Submultiplicativity yields $1=\lVert AA^{-1}\rVert\le\lVert A\rVert\lVert A^{-1}\rVert=\kappa(A)$.

</details>

### 4. Application: propagate bounded input error

For the supplementary two-by-two matrix $A$, each input coordinate error is at most $0.01$ in magnitude. Bound the largest output coordinate error and exhibit an input error attaining the bound.

<details markdown="1">
<summary>Hint</summary>

Use the infinity norm and choose signs that reinforce the largest row.

</details>
<details markdown="1">
<summary>Worked solution</summary>

$\lVert\delta x\rVert_\infty\le0.01$ and $\lVert A\rVert_\infty=3$, so $\lVert A\delta x\rVert_\infty\le0.03$. Taking $\delta x=(0.01,0.01)^T$ produces $(0.03,0.02)^T$, attaining the bound. This is a worst-case guarantee, not an assumption about random errors.

</details>

## Further learning

- [Turing’s 1948 paper, original abstract](https://academic.oup.com/qjmam/article-abstract/1/1/287/1883483): read the stated rounding-error problem. The modern residual derivation here is not a transcription of the paper’s full analysis.
- [Higham: What Is a Matrix Norm?](https://nhigham.com/2021/10/12/what-is-a-matrix-norm/): continue to mixed input/output norms and relationships between matrix norms.
- [LAPACK: How to Measure Errors](https://www.netlib.org/lapack/lug/node75.html): see norms and condition numbers in numerical error reporting.
- [NumPy: `numpy.linalg.norm`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html): distinguish vector, matrix, and entrywise calculations in software.

## Related pages

- [Vector norms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }})
- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})
- [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }})
- [Symmetric positive definite matrix]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }})

## References

1. Higham, N. J. (2021, October 12). [*What Is a Matrix Norm?*](https://nhigham.com/2021/10/12/what-is-a-matrix-norm/). Matrix norm axioms, induced norms, and Frobenius norms.
2. Anderson, E., et al. (1999). *LAPACK Users' Guide*, third edition. [*How to Measure Errors*](https://www.netlib.org/lapack/lug/node75.html). Norm-based error and condition numbers.
3. NumPy developers. [*numpy.linalg.norm*](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html). Matrix-norm formulas and software defaults.

4. Turing, A. M. (1948). [*Rounding-off Errors in Matrix Processes*](https://academic.oup.com/qjmam/article-abstract/1/1/287/1883483), *The Quarterly Journal of Mechanics and Applied Mathematics*, 1, 287–308. DOI: 10.1093/qjmam/1.1.287. Original abstract verified for the motivating problem; numerical examples and specific formulas from the full article are not asserted here.
