---
title: Matrix factorization and decomposition
subject: Linear Algebra
description: Represent matrices as products of structured factors, and choose between LU, Cholesky, QR, and other decompositions.
last_modified_at: 2026-10-12
---

## Definition

A **matrix factorization**, also called a **matrix decomposition**, expresses a matrix as a product of matrices with useful structure. For example,

$$
A = BC
$$

where $A \in \mathbb{R}^{m\times n}$, $B \in \mathbb{R}^{m\times r}$, and $C \in \mathbb{R}^{r\times n}$. The intermediate dimension $r$ makes the product compatible. A decomposition may have more than two factors.

The structure of the factors is what makes the representation useful. Triangular factors simplify linear solves; orthogonal factors preserve Euclidean lengths; diagonal factors expose independent scalings. Numerical linear algebra uses these structures to solve systems, least-squares problems, and eigenvalue problems. [LAPACK's guide to linear equations](https://www.netlib.org/lapack/lug/node38.html) and [orthogonal factorizations](https://www.netlib.org/lapack/lug/node39.html) describe these uses.

Without additional conditions, a product representation need not be unique. For any invertible $S \in \mathbb{R}^{r\times r}$,

$$
BC = (BS)(S^{-1}C).
$$

Conditions such as a unit diagonal or positive diagonal entries remove some of this freedom.

## Common decompositions

The table uses real matrices. A square matrix $Q$ is **orthogonal** when $Q^TQ=I$. In complex arithmetic, the corresponding notion is **unitary**, and the conjugate transpose $Q^*$ replaces $Q^T$.

| Decomposition | Form | Conditions and factor structure | Typical use |
| --- | --- | --- | --- |
| [LU]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}) | $PA=LU$ | For general nonsingular square matrices; $P$ permutes rows, $L$ is unit lower triangular, and $U$ is upper triangular | Linear systems |
| [Cholesky]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) | $A=LL^T$ | Symmetric positive-definite $A$; $L$ is lower triangular with positive diagonal | Linear systems with positive-definite coefficients |
| QR | $A=QR$ | For $m\ge n$, the reduced form has $Q\in\mathbb{R}^{m\times n}$ with $Q^TQ=I$ and upper triangular $R\in\mathbb{R}^{n\times n}$ | Least squares with full column rank |
| Singular value decomposition (SVD) | $A=U\Sigma V^T$ | Any $m\times n$ matrix; full $U$ and $V$ are orthogonal, and $\Sigma$ is rectangular diagonal with nonnegative entries | Singular values and rank analysis |
| Symmetric eigendecomposition | $A=Q\Lambda Q^T$ | Real symmetric $A$; $Q$ is orthogonal, and $\Lambda$ is real diagonal | Eigenvalues and eigenvectors |

For the factor structures, see LAPACK's [LU routine](https://www.netlib.org/lapack/double/dgetrf.f), [Cholesky routine](https://www.netlib.org/lapack/double/dpotrf.f), and Users' Guide sections on [QR](https://www.netlib.org/lapack/lug/node40.html), [SVD](https://www.netlib.org/lapack/lug/node32.html), and [symmetric eigendecomposition](https://www.netlib.org/lapack/lug/node89.html). LAPACK writes pivoted LU as $A=PLU$; its permutation matrix is the inverse of the one in $PA=LU$.

## Why factor before solving?

Suppose $A$ is nonsingular and we want to solve

$$
Ax=b.
$$

With pivoted LU, this becomes $LUx=Pb$. Introduce $y=Ux$, then solve

$$
Ly=Pb,\qquad Ux=y.
$$

Forward substitution solves the lower triangular system, and backward substitution solves the upper triangular system. If another right-hand side arrives, the factors can be reused. LAPACK separates [factorization and solve routines](https://www.netlib.org/lapack/lug/node38.html) for this reason.

## Worked example

Consider

$$
A=\begin{bmatrix}4&2\\2&3\end{bmatrix}.
$$

It has both an LU decomposition and a Cholesky decomposition:

$$
A=
\begin{bmatrix}1&0\\\tfrac12&1\end{bmatrix}
\begin{bmatrix}4&2\\0&2\end{bmatrix}
=
\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}
\begin{bmatrix}2&1\\0&\sqrt2\end{bmatrix}.
$$

Multiplying either pair recovers $A$. The LU factor has unit diagonal in its lower factor. The Cholesky upper factor is the transpose of its lower factor. These are different structured representations of the same matrix.

## Choosing a decomposition

For a general nonsingular square system, use pivoted LU. If the coefficient matrix is symmetric positive definite, Cholesky exploits that structure. For an overdetermined system with full column rank, QR solves the least-squares problem. If rank is uncertain, column-pivoted QR or SVD can help identify an effective numerical rank. See LAPACK's [linear-system factorizations](https://www.netlib.org/lapack/lug/node38.html) and [rank-sensitive least-squares discussion](https://www.netlib.org/lapack/lug/node42.html).

## Related pages

- [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }})
- [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }})

## References

1. Anderson, E., et al. (1999). *LAPACK Users' Guide*, third edition. SIAM. [Linear Equations](https://www.netlib.org/lapack/lug/node38.html).
2. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [Orthogonal Factorizations and Linear Least Squares Problems](https://www.netlib.org/lapack/lug/node39.html) and [QR Factorization](https://www.netlib.org/lapack/lug/node40.html).
3. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [QR Factorization with Column Pivoting](https://www.netlib.org/lapack/lug/node42.html).
4. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [Singular Value Decomposition](https://www.netlib.org/lapack/lug/node32.html).
5. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [Error Bounds for the Symmetric Eigenproblem](https://www.netlib.org/lapack/lug/node89.html), opening definition of the eigendecomposition.
6. LAPACK (2011). [DGETRF](https://www.netlib.org/lapack/double/dgetrf.f) and [DPOTRF](https://www.netlib.org/lapack/double/dpotrf.f), version 3.3.1. Routine documentation for LU and Cholesky factors.
