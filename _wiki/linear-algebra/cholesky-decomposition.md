---
title: Cholesky decomposition
subject: Linear Algebra
description: Factor a symmetric positive-definite matrix into a triangular factor and its transpose, with a derivation and worked example.
last_modified_at: 2026-10-12
---

## Definition

For a real **symmetric positive-definite** (SPD) matrix $A\in\mathbb{R}^{n\times n}$, the **Cholesky decomposition**, or **Cholesky factorization**, is

$$
A=LL^T,
$$

where $L$ is lower triangular with strictly positive diagonal entries. This factor exists and is unique. Equivalently, $A=R^TR$ with $R=L^T$ upper triangular. SPD means

$$
A^T=A,\qquad x^TAx>0\quad\text{for every }x\ne0.
$$

See van de Geijn's [definition and existence theorem](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). For complex Hermitian positive-definite matrices, the form is $A=LL^{\ast}$, where $L^{\ast}$ is the conjugate transpose. [LAPACK's ZPOTRF documentation](https://www.netlib.org/lapack/complex16/zpotrf.f) gives the complex convention.

This is a structured [matrix decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}). Unlike the unit lower triangular factor in [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}), the Cholesky factor generally has diagonal entries other than $1$.

## Deriving the algorithm

Equating entries in $A=LL^T$ gives

$$
a_{ij}=\sum_{k=1}^{\min(i,j)}l_{ik}l_{jk}.
$$

Compute columns in order, for $j=1,\ldots,n$:

$$
l_{jj}=\sqrt{a_{jj}-\sum_{k=1}^{j-1}l_{jk}^2},
$$

then, for $i=j+1,\ldots,n$,

$$
l_{ij}=\frac{a_{ij}-\sum_{k=1}^{j-1}l_{ik}l_{jk}}{l_{jj}}.
$$

Empty sums are zero. Entries above the diagonal remain zero. These recurrences are the lower triangular counterpart of the [elementwise Cholesky algorithm](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/) presented by Higham.

### Why the square roots are positive

Partition an SPD matrix as

$$
A=\begin{bmatrix}\alpha&c^T\\c&B\end{bmatrix}.
$$

Here $\alpha>0$. For nonzero $z$, set $x=(-c^Tz/\alpha,z)^T$. Then

$$
0<x^TAx=z^T\left(B-\frac{cc^T}{\alpha}\right)z.
$$

Thus the Schur complement $B-cc^T/\alpha$ is SPD. Inductively factor it as $KK^T$, and obtain

$$
L=\begin{bmatrix}\sqrt\alpha&0\\c/\sqrt\alpha&K\end{bmatrix}.
$$

The positive square root and each successive column are uniquely determined. This gives an inductive existence and uniqueness proof; see the [FLAME notes](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html) for a full treatment.

## Worked example

Let

$$
A=\begin{bmatrix}4&2\\2&3\end{bmatrix}.
$$

It is SPD because, for $x\ne0$,

$$
x^TAx=4\left(x_1+\frac{x_2}{2}\right)^2+2x_2^2>0.
$$

The recurrences give

$$
l_{11}=2,\qquad l_{21}=1,\qquad l_{22}=\sqrt{3-1}=\sqrt2.
$$

Therefore

$$
L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix},\qquad
LL^T=\begin{bmatrix}4&2\\2&3\end{bmatrix}=A.
$$

To solve $Ax=b$ for $b=(6,5)^T$, first solve $Ly=b$:

$$
y_1=3,\qquad y_2=\sqrt2.
$$

Then solve $L^Tx=y$ to obtain $x_2=1$ and $x_1=1$. Direct substitution confirms $A(1,1)^T=b$.

## Applications and computational cost

For an SPD linear system, solve $Ly=b$ by forward substitution, then $L^Tx=y$ by backward substitution. Reuse $L$ for additional right-hand sides. [LAPACK's DPOTRS routine](https://www.netlib.org/lapack/double/dpotrs.f) implements this factor-and-solve workflow.

The determinant follows from the product:

$$
\det A=(\det L)^2=\prod_{i=1}^{n}l_{ii}^2,\qquad
\log\det A=2\sum_{i=1}^{n}\log l_{ii}.
$$

See Higham's [determinant identity](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/); the logarithmic formula follows by taking logs of positive diagonal entries.

Conventional dense Cholesky costs $\frac13 n^3+O(n^2)$ floating-point operations, counting multiplication and addition separately, and two triangular solves cost $O(n^2)$ per right-hand side. The cubic leading term is half that of conventional dense LU. Only one triangular factor needs storage. See the [cost discussion in the FLAME notes](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

## Numerical behavior and limitations

For SPD input, standard Cholesky needs no pivoting and has small backward error: the computed factor $\widehat L$ satisfies $A+\Delta A=\widehat L\widehat L^T$ for a small perturbation $\Delta A$. An ill-conditioned system can still have a large solution error. In floating-point arithmetic, a nearly singular SPD matrix may cause a nonpositive computed pivot. [Higham](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/) discusses stability and breakdown.

Symmetry alone is insufficient. An indefinite matrix does not have the positive-diagonal Cholesky factor defined above. Positive-semidefinite matrices can have triangular square-root factors with zero diagonal entries, but uniqueness and the standard algorithm's divisions no longer follow. See [Higham's semidefinite discussion](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/). For symmetric indefinite systems, [LAPACK](https://www.netlib.org/lapack/lug/node38.html) uses pivoted factorizations with block diagonal $D$ instead.

## Related pages

- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})
- [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }})

## References

1. van de Geijn, R. A. (2011). [*Notes on Cholesky Factorization*](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). University of Texas at Austin. Definition, proof, algorithm, and operation count.
2. Higham, N. J. (2020, August 11). [*What Is a Cholesky Factorization?*](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/). Determinant identity, numerical stability, and semidefinite extensions.
3. Anderson, E., et al. (1999). *LAPACK Users' Guide*, third edition. SIAM. [Linear Equations](https://www.netlib.org/lapack/lug/node38.html). Real and complex factorizations and triangular solves.
4. LAPACK (2011). [ZPOTRF](https://www.netlib.org/lapack/complex16/zpotrf.f) and [DPOTRS](https://www.netlib.org/lapack/double/dpotrs.f), version 3.3.1. Complex Cholesky factorization and solves using an existing factor.
