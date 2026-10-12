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

## Intuition: one operation becomes a sequence

A matrix tells us how to transform a vector. Its columns are the images of the coordinate basis vectors: if $A$ has columns $a_1$ and $a_2$, then $Ax=x_1a_1+x_2a_2$. A factorization $A=BC$ describes the same transformation in stages:

$$
x\ \xrightarrow{\ C\ }\ y=Cx\ \xrightarrow{\ B\ }\ BCx=Ax.
$$

**The rightmost factor acts first.** The factors are not pieces to add together; they are operations to compose. For example, let

$$
C=\begin{bmatrix}2&0\\0&1\end{bmatrix},\qquad
B=\begin{bmatrix}1&1\\0&1\end{bmatrix}.
$$

$C$ stretches the horizontal coordinate, while $B$ shears horizontally. For $x=(0,1)^T$, stretching and then shearing gives $BCx=(1,1)^T$. Reversing the order gives $CBx=(2,1)^T$. The operations have the same ingredients but different results.

{% include image.html src="/assets/images/wiki/matrix-factor-stages.svg" alt="Three coordinate plots show a unit square, its image under U, and its final image under L U, with the same coordinate scale in all three panels." caption="For A = [[4, 2], [2, 3]], first apply U = [[4, 2], [0, 2]], then L = [[1, 0], [1/2, 1]]. The two stages produce the same parallelogram as applying A directly." %}

The factors can be simpler to work with even though their product is a dense matrix. A diagonal matrix scales coordinates independently. An orthogonal matrix rotates or reflects without changing lengths. A triangular matrix mixes coordinates in a one-way dependency pattern, making its equations solvable in sequence. See [LAPACK's discussion of orthogonal factors](https://www.netlib.org/lapack/lug/node39.html).

### Why zeros in a factor matter

Compare the lower triangular system

$$
\begin{bmatrix}2&0&0\\1&3&0\\4&-1&2\end{bmatrix}
\begin{bmatrix}y_1\\y_2\\y_3\end{bmatrix}
=\begin{bmatrix}2\\7\\6\end{bmatrix}.
$$

The first row determines $y_1=1$. Substituting it into the second gives $y_2=2$. With those two known, the third gives $y_3=2$. There is no need to solve all three unknowns simultaneously. The zero entries encode the dependency order: $y_1\to y_2\to y_3$. Upper triangular systems reverse that order.

Factorization does not make the original problem disappear. It performs the coupled work once, then stores a representation whose later uses are simpler.

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

## What the different decompositions reveal

### LU exposes an elimination procedure

Elimination removes an unknown from later equations. $U$ stores the simplified equations; $L$ stores the multipliers needed to reconstruct the original ones. The same matrix can therefore be read as either an original coupled system or a record of how to solve it. The [LU page]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}) works through that record explicitly.

### Cholesky exposes a sum of squares

For SPD $A=LL^T$,

$$
x^TAx=\lVert L^Tx\rVert_2^2.
$$

The quadratic expression on the left may mix coordinates. The right side writes it as ordinary squared length after a triangular change of coordinates. For the example <span class="math-inline" markdown="0">\(A=\begin{pmatrix}4&2\\2&3\end{pmatrix}\)</span>,

$$
4x_1^2+4x_1x_2+3x_2^2=(2x_1+x_2)^2+(\sqrt2x_2)^2.
$$

This is completing the square in matrix form. The [Cholesky page]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) explains why the positivity condition makes it possible.

### QR separates direction from coordinate mixing

Columns of $Q$ form perpendicular unit directions. Columns of $R$ say how to combine those directions to recover the columns of $A$. For instance,

$$
\begin{bmatrix}1&1\\1&-1\end{bmatrix}
=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}
\begin{bmatrix}\sqrt2&0\\0&\sqrt2\end{bmatrix}.
$$

The columns already point in perpendicular directions; $Q$ normalizes them, and $R$ restores their lengths. For columns that are not perpendicular, the off-diagonal entries of $R$ also record components along earlier directions. See [LAPACK's QR definition](https://www.netlib.org/lapack/lug/node40.html).

As a small least-squares example, fit one constant $x$ to measurements $(1,2,6)^T$. The design matrix is $B=(1,1,1)^T$. Reduced QR gives $q=B/\sqrt3$ and $r=\sqrt3$, so $rx=q^Tb$ gives $x=3$. The residual $b-Bx=(-2,-1,3)^T$ is perpendicular to $q$: its entries sum to zero. The fit captures the component in the model's direction and leaves the perpendicular component as residual.

### SVD finds input and output directions for stretching

In $A=U\Sigma V^T$, $V^T$ expresses the input in perpendicular directions, $\Sigma$ scales those coordinates, and $U$ places them in output directions. For a square matrix, the orthogonal stages may rotate or reflect; the nonnegative diagonal entries of $\Sigma$ give the stretch factors. The relation $Av_i=\sigma_i u_i$ makes this interpretation precise. See [LAPACK's SVD definition](https://www.netlib.org/lapack/lug/node32.html).

For $A=\operatorname{diag}(3,1)$, a unit circle becomes an ellipse with semiaxes $3$ and $1$. If the second diagonal entry is instead zero, the circle collapses onto a line segment: an entire input direction is lost. This illustrates why zero singular values indicate rank loss. Small singular values mean that corresponding input changes produce small output changes, which become strongly amplified when a solve tries to reverse them.

{% include image.html src="/assets/images/wiki/svd-stretch.svg" alt="A unit circle, an ellipse produced by scaling its coordinates by three and one, and a line segment produced by scaling by three and zero." caption="An explicit diagonal example of singular values: (3, 1) stretches two directions; (3, 0) destroys one. Corresponding marked points retain their labels in each panel." %}

### Symmetric eigendecomposition finds directions that keep their orientation

An eigenvector is a nonzero vector whose image is a scalar multiple of itself. For

$$
A=\begin{bmatrix}3&1\\1&3\end{bmatrix},\qquad
A\begin{bmatrix}1\\1\end{bmatrix}=4\begin{bmatrix}1\\1\end{bmatrix},\qquad
A\begin{bmatrix}1\\-1\end{bmatrix}=2\begin{bmatrix}1\\-1\end{bmatrix}.
$$

The two diagonal directions are stretched by $4$ and $2$. Normalize them to form $Q$, and the matrix becomes $Q\operatorname{diag}(4,2)Q^T$. The same directions are used for input and output. That differs from SVD, whose input and output directions can be different, even for square matrices. Symmetric matrices have an orthogonal eigenbasis; see [LAPACK's symmetric eigendecomposition](https://www.netlib.org/lapack/lug/node89.html). Negative eigenvalues reverse a direction, while singular values remain nonnegative.

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
