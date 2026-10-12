---
title: Schur complement
subject: Linear Algebra
description: Eliminate a block of variables and understand the remaining matrix through linear systems, quadratic energy, and Cholesky factorization.
last_modified_at: 2026-10-12
---

## Definition

Partition a square matrix into blocks:

$$
M=\begin{bmatrix}A&B\\C&D\end{bmatrix},\qquad
A\in\mathbb R^{p\times p},\quad B\in\mathbb R^{p\times q},\quad
C\in\mathbb R^{q\times p},\quad D\in\mathbb R^{q\times q}.
$$

If $A$ is invertible, its **Schur complement in $M$** is the $q\times q$ matrix

$$
S=D-CA^{-1}B.
$$

If instead $D$ is invertible, its complement is $A-BD^{-1}C$. Always specify which block is being eliminated: these complements generally have different sizes and values. See [Gallier, §1](https://www.cis.upenn.edu/~jean/schur-comp.pdf#page=1) for the definition and block elimination formulas.

The complement answers a concrete question: **what equation remains for one group of variables after solving for the other group?** It is the block version of the remainder created by Gaussian elimination in [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}). For symmetric positive-definite matrices, it also explains the positive remainders in [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}).

## Intuition: remove a dependency, keep its effect

Suppose two groups of unknowns, $x\in\mathbb R^p$ and $y\in\mathbb R^q$, satisfy

$$
Ax+By=u,\qquad Cx+Dy=v.
$$

The first equation gives $x=A^{-1}(u-By)$. Substitute into the second:

$$
C A^{-1}u-C A^{-1}By+Dy=v,
$$

so the reduced system is

$$
Sy=v-CA^{-1}u.
$$

Read $CA^{-1}B$ from right to left: $B$ couples $y$ into the first equation, $A^{-1}$ determines the response of $x$, and $C$ carries that response into the second equation. Subtracting this feedback leaves the effective coefficient for $y$. The right-hand side must change too. This derivation follows the elimination described in [Gallier, §1](https://www.cis.upenn.edu/~jean/schur-comp.pdf#page=1).

| Stage | Equation | What it accomplishes |
| --- | --- | --- |
| Coupled problem | $Ax+By=u$, $Cx+Dy=v$ | Both groups depend on one another |
| Eliminate $x$ | $x=A^{-1}(u-By)$ | Express the first group using the second |
| Reduced problem | $(D-CA^{-1}B)y=v-CA^{-1}u$ | Solve only for the retained group |
| Recover $x$ | $Ax=u-By$ | Reconstruct the eliminated variables |

Read down the table as a solve workflow. Eliminating variables preserves their effect; simply deleting the first block row and column would incorrectly leave $Dy=v$.

## Worked example: solve and recover

This and the following examples are original calculations. Let

$$
\begin{bmatrix}4&2\\2&3\end{bmatrix}
\begin{bmatrix}x\\y\end{bmatrix}
=\begin{bmatrix}6\\5\end{bmatrix}.
$$

Here $A=4$, $B=C=2$, and $D=3$.

1. Solve the first equation symbolically: $x=(6-2y)/4$.
2. Compute the complement: $S=3-2(1/4)2=2$.
3. Reduce the right-hand side: $5-2(1/4)6=2$.
4. Solve $2y=2$, giving $y=1$.
5. Recover $x=(6-2)/4=1$.

Substitution verifies both original equations: $4+2=6$ and $2+3=5$. Keeping the unmodified right-hand side would have given the wrong result $y=5/2$.

### A complement can itself be a matrix

Take a scalar first block and a two-dimensional retained block:

$$
M=\begin{bmatrix}2&2&0\\2&5&1\\0&1&3\end{bmatrix},\qquad
A=2,\quad B=\begin{bmatrix}2&0\end{bmatrix},\quad C=B^T.
$$

The coupling correction and reduced matrix are

$$
CA^{-1}B=\begin{bmatrix}2&0\\0&0\end{bmatrix},\qquad
S=\begin{bmatrix}5&1\\1&3\end{bmatrix}
-\begin{bmatrix}2&0\\0&0\end{bmatrix}
=\begin{bmatrix}3&1\\1&3\end{bmatrix}.
$$

The third variable has no direct coupling to the eliminated first variable, so its diagonal entry is unchanged. The retained variables still couple through the off-diagonal entries $1$.

## Quadratic energy and positive definiteness

Assume now that $M$ is real symmetric, so $C=B^T$, and that $A$ is positive definite. Completing the square gives

$$
\begin{bmatrix}x\\y\end{bmatrix}^T
M\begin{bmatrix}x\\y\end{bmatrix}
=(x+A^{-1}By)^T A(x+A^{-1}By)+y^TSy.
$$

For fixed $y$, the first term is minimized at $x=-A^{-1}By$. The remaining energy is exactly $y^TSy$. Thus $S$ describes the energy after the eliminated variables have adjusted as freely as possible. The square completion is a direct expansion of the formula above.

Consequently, for symmetric $M$ with $A$ positive definite,

$$
M\text{ is positive definite}\quad\Longleftrightarrow\quad
S\text{ is positive definite}.
$$

The analogous equivalence holds for positive semidefiniteness while $A$ remains positive definite. See [Gallier, Proposition 2.2](https://www.cis.upenn.edu/~jean/schur-comp.pdf#page=4). The assumption on $A$ matters: a negative-energy direction inside the first block cannot be repaired by a positive complement.

For the two-variable example,

$$
4x^2+4xy+3y^2=4(x+y/2)^2+2y^2.
$$

At fixed $y=1$, the energy splits as follows:

| $x$ | First-block energy $4(x+1/2)^2$ | Remaining energy $2$ | Total |
| --- | --- | --- | --- |
| $-3/2$ | $4$ | $2$ | $6$ |
| $-1$ | $1$ | $2$ | $3$ |
| $-1/2$ | $0$ | $2$ | $2$ |
| $0$ | $1$ | $2$ | $3$ |
| $1/2$ | $4$ | $2$ | $6$ |

The table traces a parabola with minimum $2$ at $x=-1/2$. The complement is the minimum energy coefficient, not the original coefficient $3$ of $y^2$.

For <span class="math-inline" markdown="0">\(M=\begin{bmatrix}\alpha&c^T\\c&D\end{bmatrix}\)</span>, the complement is $D-cc^T/\alpha$. This is precisely the smaller matrix that [Cholesky factorization]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) factors after constructing its first column.

## Block factorization and determinants

Direct block multiplication verifies

$$
M=
\begin{bmatrix}I&0\\CA^{-1}&I\end{bmatrix}
\begin{bmatrix}A&B\\0&S\end{bmatrix}.
$$

This is a block [matrix factorization]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}). The first factor has determinant $1$, and the second is block triangular, hence

$$
\det M=\det A\,\det S.
$$

Since $A$ is invertible, $M$ is invertible exactly when $S$ is invertible. These identities also follow from [Boyd and Vandenberghe, Appendix A.5.5](https://stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf). In the scalar example, $\det M=4\cdot2=8$, agreeing with $4\cdot3-2\cdot2=8$.

## Computing it in practice

The notation $A^{-1}B$ specifies a mathematical operation; a numerical implementation can solve $AZ=B$ and form $S=D-CZ$. Similarly, solve $Aw=u$ to form the reduced right-hand side $v-Cw$. Reuse a factorization of $A$ for these solves and for recovery. See [Boyd and Vandenberghe, §C.4](https://stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf) for this block elimination workflow.

It is useful when a model naturally separates internal variables from variables of interest. In the energy interpretation, internal variables relax first and $S$ gives the remaining stiffness. The complement may become dense even if the original blocks are sparse: elimination can introduce couplings between variables that previously interacted only through the removed group.

## Common misconceptions and boundary cases

- **Invertible whole matrix means any block can be eliminated.** The invertible matrix <span class="math-inline" markdown="0">\(\begin{bmatrix}0&1\\1&0\end{bmatrix}\)</span> has a singular first block. The ordinary complement of that block is undefined. Reorder variables or choose another valid partition.
- **An invertible eliminated block guarantees an invertible complement.** For <span class="math-inline" markdown="0">\(\begin{bmatrix}1&1\\1&1\end{bmatrix}\)</span>, $A=1$ but $S=0$; the whole matrix is singular.
- **A positive complement guarantees positive definiteness.** For $\operatorname{diag}(-1,2)$, $S=2$ but the first coordinate has negative energy. Both the symmetry and first-block positivity assumptions are necessary for the energy criterion.
- **A singular block can always be handled by replacing its inverse with a pseudoinverse.** Generalized complements require additional conditions. [Gallier, §4](https://www.cis.upenn.edu/~jean/schur-comp.pdf) develops the range conditions needed for positive-semidefinite tests; the ordinary formulas above assume invertibility.

## Practice problems

These exercises and solutions are original. Attempt each before revealing the explanation.

### 1. Hand calculation

For <span class="math-inline" markdown="0">\(M=\begin{bmatrix}3&1\\1&2\end{bmatrix}\)</span> and right-hand side $(7,5)^T$, eliminate the first variable, solve the reduced equation, and recover the first variable.

<details markdown="1">
<summary>Hint and worked solution</summary>

**Hint:** Modify both the coefficient and the right-hand side.

$S=2-1/3=5/3$ and the reduced right-hand side is $5-7/3=8/3$. Therefore $y=8/5$ and $x=(7-8/5)/3=9/5$. Checking gives $3(9/5)+8/5=7$ and $9/5+2(8/5)=5$.

</details>

### 2. Interpretation and strategy

In $q(x,y)=4x^2+4xy+3y^2$, why is setting $x=0$ different from eliminating $x$ by minimizing the energy? Find both coefficients of $y^2$.

<details markdown="1">
<summary>Hint and worked solution</summary>

**Hint:** Fixing a variable prevents its response; minimizing permits it to adjust.

Setting $x=0$ leaves $3y^2$. Minimizing over $x$ gives $x=-y/2$ and leaves $2y^2$. The smaller coefficient accounts for relaxation through the first variable.

</details>

### 3. Abstract reasoning

Suppose $A$ is invertible and $Sz=0$ for nonzero $z$. Construct a nonzero vector in the null space of $M$.

<details markdown="1">
<summary>Hint and worked solution</summary>

**Hint:** Choose the first block of the vector to cancel the top equation.

Use $w=(-A^{-1}Bz,z)^T$. The top block of $Mw$ is $0$, and the bottom is $(D-CA^{-1}B)z=Sz=0$. Since $z\ne0$, $w\ne0$, proving singularity without computing a determinant.

</details>

### 4. Practical application

A simplified stiffness model has internal displacement $x$ and boundary displacement $y$, with energy $q=2x^2+4xy+5y^2$. Find the effective boundary stiffness after the internal displacement relaxes. Is the full model positive definite?

<details markdown="1">
<summary>Hint and worked solution</summary>

**Hint:** The cross term is $2Bxy$, so $B=2$.

Here $A=2$, $D=5$, and $S=5-2(1/2)2=3$. Completing the square gives $q=2(x+y)^2+3y^2$. Relaxation sets $x=-y$, leaving $3y^2$; the effective coefficient is $3$. Both $A$ and $S$ are positive, so the full symmetric matrix is positive definite.

</details>

## References

- Jean Gallier, [*The Schur Complement and Symmetric Positive Semidefinite (and Definite) Matrices*](https://www.cis.upenn.edu/~jean/schur-comp.pdf). Sections 1–2 explain block elimination and positivity; §4 treats singular blocks and pseudoinverses. Useful for following the proofs beyond the scalar examples.
- Stephen Boyd and Lieven Vandenberghe, [*Convex Optimization*](https://stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf). Appendix A.5.5 collects complement identities and positive-definiteness criteria; §C.4 shows how to organize block linear solves. Useful for connecting the algebra to computational optimization.
