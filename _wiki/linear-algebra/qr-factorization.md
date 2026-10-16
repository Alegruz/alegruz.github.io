---
title: QR factorization
subject: Linear Algebra
interactive_examples: true
orthogonal_examples: true
description: Store orthogonalization as A = QR, solve least squares through a triangular system, and compare Gram–Schmidt, Householder reflections, and Givens rotations.
last_modified_at: 2026-10-16
---

## The original problem: imperfect observations share unknowns

In his 1805 appendix on least squares, Legendre considers observation equations whose known coefficients vary while the unknown quantities remain shared. Usually the equations cannot all hold exactly. He proposes minimizing the sum of squared errors. See the translated original, [Smith, pp. 576–577](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608). This supplies the historical fitting problem used here; it is not a claim that Legendre introduced QR.

**Original symbolic problem, modern matrix re-derivation.** Collect $m$ observation equations for $n$ unknown parameters into $Ax\approx b$. The real matrix $A\in\mathbb R^{m\times n}$ stores the known coefficients, $x\in\mathbb R^n$ the parameters, and $b\in\mathbb R^m$ the observations. The **residual** $r=b-Ax$ contains the discrepancies. For equal observation weights, solve

$$
\min_x\lVert b-Ax\rVert_2^2.
$$

Legendre writes an error as $E=a+bx+cy+fz+\cdots$. Our matrix notation moves his known constant term to the other side; our residual has the opposite sign, which leaves its square unchanged. The symbolic model specifies no numerical observation table here. The numerical example below is a labeled teaching reconstruction, not Legendre's measured data.

The [LU page]({{ '/wiki/linear-algebra/lu-decomposition/#solving-normal-equations' | relative_url }}) develops the **normal equations** $A^TAx=A^Tb$. They characterize the best fit, but forming $A^TA$ can worsen numerical sensitivity. A second route first changes to perpendicular model directions. [Gram–Schmidt]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/' | relative_url }}) constructs these directions; QR records them as a matrix product.

## Build the factors from the directions

Assume initially that $m\ge n$ and that the columns $a_1,\ldots,a_n$ of $A$ are independent: none is a linear combination of the others. Gram–Schmidt produces mutually perpendicular unit vectors $q_i$ and coefficients satisfying

$$
a_j=\sum_{i=1}^{j}r_{ij}q_i.
$$

The $j$th input uses only the first $j$ new directions. Put the $q_i$ into columns of $Q$, and their coefficients into $R$:

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

Here $I_n$ is the identity matrix, with ones on the diagonal and zeros elsewhere. $R$ is **upper triangular**: entries below the diagonal vanish. This is the **reduced QR factorization**, with $Q$ of size $m\times n$ and $R$ of size $n\times n$. See [LAPACK's definition](https://www.netlib.org/lapack/lug/node40.html) and [ALAFF's column-by-column construction](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html).

### What each factor does

$R$ converts parameter coordinates into coordinates along the orthonormal model directions. $Q$ places those coordinates in observation space. Because $Q^TQ=I_n$,

$$
\lVert Qy\rVert_2^2=y^TQ^TQy=y^Ty=\lVert y\rVert_2^2.
$$

Thus $Q$ preserves lengths of vectors entering from $\mathbb R^n$. For rectangular $Q$, this does **not** say that $Q^T$ preserves every vector in $\mathbb R^m$: perpendicular residual components are discarded. For example, $Q=(1,0)^T$ has $Q^TQ=1$, but $Q^T(0,1)^T=0$.

### Shared worked example: the Gram–Schmidt record becomes QR

**Supplementary invented example.** Continue the [Gram–Schmidt worked vectors]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/#worked-vectors-keep-the-new-part-then-normalize' | relative_url }}):

$$
A=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix},\qquad
Q=\begin{bmatrix}
1/\sqrt3&-1/\sqrt2\\
1/\sqrt3&0\\
1/\sqrt3&1/\sqrt2
\end{bmatrix},\qquad
R=\begin{bmatrix}\sqrt3&\sqrt3\\0&\sqrt2\end{bmatrix}.
$$

The first column is $\sqrt3q_1$. The second is $\sqrt3q_1+\sqrt2q_2=(0,1,2)^T$. Multiplying verifies $A=QR$, while taking dot products verifies $Q^TQ=I_2$.

The columns of $A$ express a straight-line model $c+dt$ at dimensionless sample positions $t=0,1,2$. Their overlap couples the intercept $c$ and slope $d$. The orthonormal columns instead describe a constant component and a centered trend.

## Derive the least-squares solve

Let $y=Q^Tb$ and split the observations into a component in the column space and a perpendicular residual:

$$
b=Qy+b_\perp,
\qquad b_\perp=b-QQ^Tb,
\qquad Q^Tb_\perp=0.
$$

The **column space** contains all possible predictions $Ax$. Its orthogonal projection is $QQ^Tb$. For any parameter vector $x$,

$$
b-Ax=Q(y-Rx)+b_\perp.
$$

The two terms are perpendicular, so their squared lengths add:

$$
\lVert b-Ax\rVert_2^2
=\lVert y-Rx\rVert_2^2+\lVert b_\perp\rVert_2^2.
$$

The second term is unavoidable with this model. Independent columns make $R$ nonsingular, so the first term can be made zero by solving

$$
Rx=Q^Tb.
$$

Solve the triangular system by **back substitution**: use its last row for the last unknown, then work upward. Do not form $R^{-1}$ merely to perform this solve. This is the reduced-form derivation of [LAPACK's QR least-squares method](https://www.netlib.org/lapack/lug/node40.html).

### Calculate the fit and check the original equations

Use the invented observations $b=(1,2,2)^T$. They do not lie exactly on a line at $t=0,1,2$. First compute

$$
Q^Tb=\begin{bmatrix}5/\sqrt3\\1/\sqrt2\end{bmatrix}.
$$

Writing $x=(c,d)^T$ for intercept and slope, back substitution gives

$$
\sqrt2\,d=1/\sqrt2\quad\Longrightarrow\quad d=\frac12,
$$

$$
\sqrt3\,c+\sqrt3\,d=5/\sqrt3
\quad\Longrightarrow\quad c=\frac53-\frac12=\frac76.
$$

The resulting predictions and residual are

$$
Ax=\begin{bmatrix}7/6\\5/3\\13/6\end{bmatrix},
\qquad r=b-Ax=\frac16\begin{bmatrix}-1\\2\\-1\end{bmatrix},
\qquad \lVert r\rVert_2^2=\frac16.
$$

Check both model directions:

$$
\begin{bmatrix}1&1&1\\0&1&2\end{bmatrix}r
=\begin{bmatrix}0\\0\end{bmatrix}.
$$

The residual is perpendicular to every allowable change in prediction. A least-squares solution need not satisfy $Ax=b$; it makes the remaining error perpendicular to the model space.

## Full QR keeps the leftover directions too

Complete the $n$ columns of $Q$ to an orthonormal basis of all $\mathbb R^m$ by adding $Q_\perp$. Then

$$
\widetilde Q=[\,Q\;Q_\perp\,]\in\mathbb R^{m\times m},
\qquad A=\widetilde Q\begin{bmatrix}R\\0\end{bmatrix}.
$$

This is **full QR**. The $0$ block has $m-n$ rows and $n$ columns. Now $\widetilde Q$ is square and orthogonal: both $\widetilde Q^T\widetilde Q=I_m$ and $\widetilde Q\widetilde Q^T=I_m$ hold. In these full coordinates,

$$
\widetilde Q^Tb=\begin{bmatrix}Q^Tb\\Q_\perp^Tb\end{bmatrix}.
$$

The upper coordinates determine the fit; the lower ones describe the residual. In the worked example, choose $q_3=(1,-2,1)^T/\sqrt6$. Then $q_3^Tb=-1/\sqrt6$, so $r=q_3(-1/\sqrt6)$ and its squared length is $1/6$. The dimensions and residual interpretation follow [LAPACK's full and reduced forms](https://www.netlib.org/lapack/lug/node40.html).

## Existence, uniqueness, and dependent columns

For $m\ge n$, QR exists even when some columns are dependent. With independent columns, Gram–Schmidt constructs a reduced QR with positive $r_{jj}$. With dependent columns, select additional perpendicular unit directions when a remainder is zero; $R$ can then have zero diagonal entries. The elementary Gram–Schmidt algorithm that divides by every remainder stops unless modified to handle that case.

For full column rank, the convention $r_{jj}>0$ makes the reduced factors unique. To see why, suppose $Q_1R_1=Q_2R_2$. The factors share the same column space, so $Q_2=Q_1S$ with orthogonal $S=Q_1^TQ_2$. Then $S=R_1R_2^{-1}$ is also upper triangular. An upper triangular orthogonal matrix is diagonal with entries $\pm1$; positive diagonals in both $R_i$ force $S=I$. This is an exact-arithmetic proof. The extra columns in full QR are generally not unique.

Without the sign convention, changing a column's sign in $Q$ and its corresponding row's sign in $R$ preserves their product. Different software outputs can therefore both be correct. For $m<n$, full $Q$ is $m\times m$ and the factor on the right is $m\times n$, **upper trapezoidal**, with zeros below its diagonal. See [LAPACK's rectangular cases](https://www.netlib.org/lapack/lug/node40.html).

## Computing QR: a factorization has several algorithms

Gram–Schmidt explains the factors by constructing columns. Other methods transform the whole matrix while creating zeros. The following are real-arithmetic formulas; complex matrices use conjugate transposes and unitary factors.

### Householder reflections: remove a column tail together

A **hyperplane** is a flat subspace with one fewer dimension than the surrounding space: a line through the origin in two dimensions, or a plane through the origin in three. A **reflection** reverses the component perpendicular to that hyperplane and leaves components within it unchanged. For nonzero $v$,

$$
H=I-2\frac{vv^T}{v^Tv}
$$

satisfies $H^T=H$ and $H^TH=I$. To map a nonzero column segment $z$ to the first coordinate axis, let

$$
\alpha=-\operatorname{sign}(z_1)\lVert z\rVert_2,
\qquad v=z-\alpha e_1,
$$

where $e_1=(1,0,\ldots,0)^T$ and $\operatorname{sign}(0)=1$ for this construction. Then $Hz=\alpha e_1$. The sign choice avoids subtracting nearly equal leading quantities in $v$. A zero segment needs no reflection.

**Invented two-coordinate calculation.** For $z=(3,4)^T$, take $\alpha=-5$ and $v=(8,4)^T$:

$$
H=\begin{bmatrix}-3/5&-4/5\\-4/5&3/5\end{bmatrix},
\qquad Hz=(-5,0)^T.
$$

For a matrix, apply the first reflector to all rows, the second only to rows $2$ onward, and so on, preserving zeros already created. If $H_k\cdots H_1A=[R;0]$, then $\widetilde Q=H_1\cdots H_k$. The opposite order comes from taking the transpose. LAPACK stores reflector vectors and coefficients so it can apply $Q$ or $Q^T$ without explicitly forming a dense $Q$. See [its reflector representation](https://www.netlib.org/lapack/lug/node128.html) and [blocked QR algorithm](https://www.netlib.org/lapack/lug/node69.html).

### Givens rotations: remove one selected entry

A **plane rotation** changes two coordinates and leaves all other coordinates alone. For a pair $(a,b)$, let $\rho=\sqrt{a^2+b^2}>0$, $\gamma=a/\rho$, and $\sigma=b/\rho$. Then

$$
\begin{bmatrix}\gamma&\sigma\\-\sigma&\gamma\end{bmatrix}
\begin{bmatrix}a\\b\end{bmatrix}
=\begin{bmatrix}\rho\\0\end{bmatrix}.
$$

For $(3,4)$ the coefficients are $3/5$ and $4/5$. If both entries are zero, use the identity rotation. Here $\rho$ is positive; library routines may choose a different sign convention. Robust software scales the calculation to avoid overflow or underflow in $a^2+b^2$. Applying selected rotations can be useful for local zeroing and updating a factorization. See [LAPACK's DLARTG specification](https://www.netlib.org/lapack/explore-html/da/dd3/group__lartg_ga86f8f877eaea0386cdc2c3c175d9ea88.html).

### Choosing the construction

| Method | Organizing idea | Numerical or practical consideration |
| --- | --- | --- |
| Classical Gram–Schmidt | Measure against each original column | A single pass can lose orthogonality badly |
| Modified Gram–Schmidt | Measure against the updated remainder | Useful for adding basis vectors; reorthogonalization may be needed |
| Householder QR | Reflect successive column tails to an axis | Standard dense QR construction; supports compact and blocked storage |
| Givens QR | Rotate two rows to zero a selected entry | Useful when transformations should affect selected row pairs |

See the [Gram–Schmidt rounding example]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/#classical-and-modified-gramschmidt-in-finite-precision' | relative_url }}), [LAPACK's reflector implementation](https://www.netlib.org/lapack/lug/node69.html), and [DLARTG](https://www.netlib.org/lapack/explore-html/da/dd3/group__lartg_ga86f8f877eaea0386cdc2c3c175d9ea88.html). The identity $A=QR$ alone does not guarantee that a particular implementation is numerically reliable.

## The connection to Cholesky, and the accuracy trap

In exact arithmetic, reduced QR gives

$$
A^TA=R^TQ^TQR=R^TR.
$$

With full column rank and positive diagonal $R$, this makes $R^T$ the lower [Cholesky factor]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) of $A^TA$. For our worked matrix,

$$
A^TA=\begin{bmatrix}3&3\\3&5\end{bmatrix}
=\begin{bmatrix}\sqrt3&0\\\sqrt3&\sqrt2\end{bmatrix}
\begin{bmatrix}\sqrt3&\sqrt3\\0&\sqrt2\end{bmatrix}.
$$

This algebraic relationship does not make the algorithms interchangeable in finite precision. The **spectral condition number** $\kappa_2(A)=\sigma_{\max}(A)/\sigma_{\min}(A)$ measures the ratio between the largest and smallest stretches of a full-column-rank matrix. Its Gram matrix satisfies

$$
\kappa_2(A^TA)=\kappa_2(A)^2.
$$

See [matrix norms]({{ '/wiki/linear-algebra/matrix-norm/' | relative_url }}) for stretch and conditioning, and [ALAFF, §4.2.5](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html) for this identity. Householder QR avoids explicitly forming this squared-condition matrix. It does not remove sensitivity inherent in the original data or guarantee small parameter errors for every ill-conditioned least-squares problem.

**Invented counterexample.** Take

$$
A=\begin{bmatrix}1&1\\0&\delta\end{bmatrix},
\qquad A^TA=\begin{bmatrix}1&1\\1&1+\delta^2\end{bmatrix},\qquad\delta>0.
$$

The columns are independent. If rounding stores $1+\delta^2$ as $1$, the stored Gram matrix becomes singular even though the stored $A$ still contains a nonzero $\delta$. Direct QR keeps that entry in the triangular factor. The threshold depends on the arithmetic; the lesson is about information lost while forming the Gram matrix.

### Column pivoting when rank is uncertain

A **permutation matrix** $P$ reorders coordinates. Column-pivoted QR computes $AP=QR$, choosing column order to help expose independent directions. A small trailing block of $R$ suggests an effective numerical rank at a chosen scale and tolerance. LAPACK's pivoted factorization routines themselves do not decide the rank. See [LAPACK's rank-sensitive QR discussion](https://www.netlib.org/lapack/lug/node42.html).

If columns are dependent, the best prediction remains unique, but multiple parameter vectors can produce it. A basic pivoted-QR solution need not be the parameter vector of smallest Euclidean length. Use an appropriate complete orthogonal factorization or SVD when a minimum-norm solution is required; see [LAPACK's complete orthogonal factorization](https://www.netlib.org/lapack/lug/node43.html).

### Factorization versus the QR eigenvalue algorithm

A single QR factorization produces factors of one matrix. The **QR algorithm** for eigenvalues repeatedly factors a square matrix $A_k=Q_kR_k$ and forms $A_{k+1}=R_kQ_k=Q_k^TA_kQ_k$. This is a change of basis, preserving **eigenvalues**: numbers $\lambda$ for which $Av=\lambda v$ with some nonzero vector $v$. Practical versions use additional structure and shifts. Francis's [1961 paper](https://doi.org/10.1093/comjnl/4.3.265) concerns that iterative transformation; it should not be treated as the origin of every QR factorization or orthogonalization method.

## Interactive example: separate the fit from the residual

{% include orthogonal-lab.html kind="qr" title="Fit a line in orthonormal coordinates" source_url="https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608" source_label="Legendre's symbolic observation problem, translated in Smith, pp. 576–577" plot_description="Plot three observations, the fitted line, and vertical residual segments at dimensionless sample positions 0, 1, and 2." %}

This is a **modern teaching reconstruction** of the original symbolic fitting problem, with the invented matrix and observations used above. The sample positions $0,1,2$ and equal weights stay fixed; edits to $b$ are hypothetical observations with no physical units. The lab displays $Q^Tb$, the triangular solve, predictions, the residual, and $A^Tr$. Change the middle observation to see both the fit and the leftover discrepancy change. Choose observations exactly on a line to make the residual vanish. Restore the labeled baseline to return to $(1,2,2)^T$.

The calculation above is the no-JavaScript baseline. The lab uses the known orthonormal basis of this fixed design matrix; it is an explanation of QR least squares, not a general-purpose numerical solver.

## Practice problems

These exercises and numerical values are original teaching examples.

### 1. Hand calculation: reuse the factors

Using the worked $A,Q,R$, fit the new observations $b=(2,2,5)^T$. Find the intercept, slope, and residual.

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>Reveal a hint</summary>

$Q^Tb=(9/\sqrt3,3/\sqrt2)^T$. Solve the second row first.

</details>
<details markdown="1"><summary>Reveal the worked solution</summary>

$d=3/2$ and $c=3-3/2=3/2$. The predictions are $(3/2,3,9/2)^T$, so $r=(1/2,-1,1/2)^T$ with squared length $3/2$. Its entries sum to zero, and $0r_1+r_2+2r_3=0$, checking $A^Tr=0$. The matrix factors did not need recomputing.

</details>
</div>

### 2. Interpretation: a rectangular transpose

For reduced $Q\in\mathbb R^{5\times2}$, is $QQ^T=I_5$? What does $QQ^Tb$ represent?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>Reveal a hint</summary>

Only two independent directions are available in a five-dimensional space.

</details>
<details markdown="1"><summary>Reveal the worked solution</summary>

No. $Q^TQ=I_2$, while $QQ^T$ projects onto the two-dimensional column space. It has rank $2$, whereas $I_5$ has rank $5$. $QQ^Tb$ is the closest prediction in that model space; $b-QQ^Tb$ is perpendicular to it.

</details>
</div>

### 3. Logic: signs and uniqueness

Let $A=QR$ with independent columns and let $D$ be diagonal with entries $\pm1$. Show that $A=(QD)(DR)$ is also a QR factorization. How does a positive diagonal convention remove this freedom?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>Reveal a hint</summary>

Use $D^2=I$ and $D^T=D$.

</details>
<details markdown="1"><summary>Reveal the worked solution</summary>

$(QD)(DR)=QD^2R=QR=A$, and $(QD)^T(QD)=DI D=I$. Multiplying rows of $R$ by signs preserves triangularity. If both versions must have positive nonzero diagonal entries, every sign in $D$ must be $+1$. Together with the triangular-orthogonal argument above, this gives uniqueness of reduced QR.

</details>
</div>

### 4. Strategy: distinguish the factor from its computation

A colleague proposes obtaining QR by forming $A^TA$, factoring it by Cholesky, and solving for $Q$. The columns of $A$ are nearly dependent. Why is the exact identity insufficient to justify this choice?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>Reveal a hint</summary>

Identify the stage at which information may already be lost.

</details>
<details markdown="1"><summary>Reveal the worked solution</summary>

Forming $A^TA$ squares the spectral condition number and can lose small distinguishing information through rounding before Cholesky starts. The $\delta$ counterexample shows the stored Gram matrix can even become singular. A reliable factorization of that stored matrix cannot recover lost information. Householder QR avoids forming it; conditioning and residual checks still matter.

</details>
</div>

### 5. Practical application: unequal observation weights

Suppose the three observations have positive weights $w_1,w_2,w_3$. How can QR minimize $\sum_i w_i(b_i-(Ax)_i)^2$? Can the fixed unweighted lab factors be reused unchanged?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>Reveal a hint</summary>

Absorb the square roots of the weights into rows of the matrix and observations.

</details>
<details markdown="1"><summary>Reveal the worked solution</summary>

Let $S=\operatorname{diag}(\sqrt{w_1},\sqrt{w_2},\sqrt{w_3})$. Factor $SA=Q_wR_w$ and solve $R_wx=Q_w^TSb$. The weighted objective equals $\lVert Sb-SAx\rVert_2^2$. Positive weights preserve independence, but changing the weights changes the matrix being factored, so the lab's unweighted factors do not in general apply unchanged. This is a derivation from the objective, not a claim about the lab's controls.

</details>
</div>

## Further learning

- [Legendre's original observation model in translation](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608): connect least squares to inconsistent measurement equations; the next page states the squared-error objective.
- [LAPACK: QR factorization](https://www.netlib.org/lapack/lug/node40.html): compare reduced and full shapes and follow the triangular least-squares solve into software routines.
- [LAPACK: representation of orthogonal matrices](https://www.netlib.org/lapack/lug/node128.html): understand how software applies an orthogonal factor without storing its full matrix.
- [ALAFF: why normal equations can lose accuracy](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html): derive the squared-condition-number identity.

## Related pages

- [Gram–Schmidt orthogonalization]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/' | relative_url }})
- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})
- [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }})
- [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }})
- [Matrix norms]({{ '/wiki/linear-algebra/matrix-norm/' | relative_url }})

## References

1. Legendre, A.-M. (1805). *Sur la méthode des moindres quarrés*, appendix to *Nouvelles méthodes pour la détermination des orbites des comètes*, pp. 72–75. Translation by H. A. Ruger and H. M. Walker in D. E. Smith, *A Source Book in Mathematics*, [pp. 576–577](https://en.wikisource.org/wiki/Page:A_Source_Book_in_Mathematics_(Smith).pdf/608). The original symbolic model motivates our modern derivation; the line-fitting numbers are invented.
2. Anderson, E., et al. (1999). *LAPACK Users' Guide*, [QR factorization](https://www.netlib.org/lapack/lug/node40.html), [column-pivoted QR](https://www.netlib.org/lapack/lug/node42.html), and [complete orthogonal factorization](https://www.netlib.org/lapack/lug/node43.html).
3. Anderson, E., et al. (1999). *LAPACK Users' Guide*, [representation of orthogonal or unitary matrices](https://www.netlib.org/lapack/lug/node128.html) and [blocked QR](https://www.netlib.org/lapack/lug/node69.html).
4. van de Geijn, R. A., and Myers, M. *Advanced Linear Algebra: Foundations to Frontiers*, [classical Gram–Schmidt](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html) and [§4.2.5, normal-equation conditioning](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html).
5. LAPACK. [DLARTG routine specification](https://www.netlib.org/lapack/explore-html/da/dd3/group__lartg_ga86f8f877eaea0386cdc2c3c175d9ea88.html). Plane rotations and safeguards for their calculation.
6. Francis, J. G. F. (1961). [The QR Transformation: A Unitary Analogue to the LR Transformation—Part 1](https://doi.org/10.1093/comjnl/4.3.265). The Computer Journal, 4(3), 265–271. This concerns the iterative eigenvalue transformation, distinguished here from a single factorization.
