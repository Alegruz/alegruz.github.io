---
title: Symmetric positive definite matrix
subject: Linear Algebra
interactive_examples: true
description: Recognize positive energy in every direction through quadratic forms, eigenvalues, Cholesky factors, and worked examples.
last_modified_at: 2026-10-12
---

## Definition

A real square matrix $A\in\mathbb R^{n\times n}$ is **symmetric positive definite** (**SPD**) when

$$
A^T=A,\qquad x^TAx>0\quad\text{for every nonzero }x\in\mathbb R^n.
$$

Here $A^T$ is the transpose, $x$ is a column vector, and $x^TAx$ is a scalar called a **[quadratic form]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }})**. Both symmetry and strict positivity are required. See [van de Geijn's definition](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

SPD matrices describe an energy that increases in every direction away from zero. This structure supports unique solutions to linear systems and [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}), a specialized [matrix decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}).

## Intuition: every direction costs energy

For a symmetric two-by-two matrix,

$$
A=\begin{bmatrix}a&b\\b&c\end{bmatrix},\qquad
q(x)=x^TAx=ax_1^2+2bx_1x_2+cx_2^2.
$$

The diagonal entries penalize individual coordinates; $b$ couples them. Testing $x=(1,0)^T$ and $x=(0,1)^T$ checks only the coordinate axes. A coupled direction can still have zero or negative energy.

Scaling a direction gives $q(tx)=t^2q(x)$. For SPD input, moving farther along any nonzero direction increases the energy. The origin is the unique minimum.

{% include image.html src="/assets/images/wiki/cholesky-energy.svg" alt="Quadratic-energy contours: closed ellipses for positive definite energy, parallel lines for a semidefinite flat direction, and hyperbolas for indefinite energy." caption="Read each curve as a set of vectors with the same energy. SPD energy has closed elliptical contours; semidefinite energy can have a flat direction; indefinite energy takes both positive and negative values." %}

The figure compares the three possibilities. A symmetric matrix is **positive semidefinite** (PSD) if $q(x)\ge0$ for all $x$, allowing zero energy in nonzero directions. It is **indefinite** if some directions have positive energy and others have negative energy. See [Higham's definition and semidefinite comparison](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/).

## Worked example: prove positivity without checking infinitely many vectors

The following calculations and exercises are original illustrative examples.

Take

$$
A=\begin{bmatrix}3&1\\1&2\end{bmatrix}.
$$

First, matching off-diagonal entries establish symmetry. Next, expand and complete the square:

$$
\begin{aligned}
x^TAx&=3x_1^2+2x_1x_2+2x_2^2\\
&=3\left(x_1+\frac{x_2}{3}\right)^2+\frac53x_2^2.
\end{aligned}
$$

Each summand is nonnegative. For the sum to vanish, the second term forces $x_2=0$, then the first forces $x_1=0$. Thus every nonzero vector has strictly positive energy.

For $x=(1,-1)^T$, the energy is $3-2+2=3$. This one calculation illustrates the result; the completed-square argument proves it for every direction.

### A practical two-by-two test

For $a>0$, the same algebra gives

$$
q(x)=a\left(x_1+\frac ba x_2\right)^2+
\left(c-\frac{b^2}{a}\right)x_2^2.
$$

Therefore a symmetric two-by-two matrix is SPD exactly when

$$
a>0,\qquad ac-b^2>0.
$$

Necessity follows by testing $(1,0)^T$ and $(-b/a,1)^T$; sufficiency follows from the two strictly positive coefficients in the completed square. In the worked example, $a=3$ and $ac-b^2=5$.

## Equivalent ways to recognize SPD matrices

For a **real symmetric** matrix, the following tests are equivalent:

| Test | What to check |
| --- | --- |
| Quadratic form | $x^TAx>0$ for every nonzero $x$ |
| Eigenvalues | Every eigenvalue is strictly positive |
| Sylvester's criterion | Every leading principal minor is strictly positive |
| Cholesky factor | $A=LL^T$ with $L$ lower triangular and positive diagonal |

A leading principal minor is the determinant of the upper-left $k\times k$ block, for $k=1,\ldots,n$. See [Higham's equivalent conditions](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/) and [van de Geijn's Cholesky theorem](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). These statements assume symmetry; eigenvalue positivity alone does not establish SPD for a general matrix.

### Why eigenvalues explain the geometry

Write the symmetric eigendecomposition as $A=Q\Lambda Q^T$, with orthogonal $Q$ and diagonal $\Lambda$. Put $y=Q^Tx$. Then

$$
x^TAx=y^T\Lambda y=\sum_{i=1}^n\lambda_i y_i^2.
$$

If every $\lambda_i>0$, this sum is positive for nonzero $y$. Conversely, an eigenvector $v_i$ satisfies $v_i^TAv_i=\lambda_i\lVert v_i\rVert_2^2$, so SPD forces $\lambda_i>0$. This derives the eigenvalue test above.

In eigenvector coordinates, the contour $q(x)=1$ has semiaxis lengths $1/\sqrt{\lambda_i}$. A small eigenvalue means a long axis and a direction with weak resistance. For our worked example,

$$
\lambda_\pm=\frac{5\pm\sqrt5}{2}>0.
$$

### Why a Cholesky factor is a certificate

For $A=LL^T$ with invertible $L$,

$$
x^TAx=\lVert L^Tx\rVert_2^2>0\qquad(x\ne0).
$$

Our example has

$$
L=\begin{bmatrix}\sqrt3&0\\1/\sqrt3&\sqrt{5/3}\end{bmatrix}.
$$

Multiplying $LL^T$ gives diagonal entries $3$ and $1/3+5/3=2$, and off-diagonal entries $1$. See the [Cholesky page]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) for the construction and triangular solves.

## Counterexamples to common shortcuts

**Positive entries do not imply SPD.** The symmetric matrix

$$
\begin{bmatrix}1&3\\3&1\end{bmatrix}
$$

has positive entries, but $q((1,-1)^T)=-4$.

**Negative off-diagonal entries are allowed.** For

$$
A=\begin{bmatrix}3&-1\\-1&3\end{bmatrix},\qquad
q(x)=2x_1^2+2x_2^2+(x_1-x_2)^2,
$$

the energy is strictly positive for every nonzero vector.

**A positive determinant is insufficient.** The matrix $-I_2$ has determinant $1$, but $q(x)=-\lVert x\rVert_2^2$. Sylvester's criterion also checks the first leading minor, which is $-1$.

**A positive diagonal is insufficient.** The positive-entry counterexample has positive diagonal entries but negative energy along $(1,-1)^T$.

**Strict positivity of the quadratic form does not imply symmetry.** Let

$$
B=\begin{bmatrix}1&2\\-2&1\end{bmatrix}.
$$

Then $x^TBx=x_1^2+x_2^2>0$ for nonzero $x$, but $B^T\ne B$. The skew-symmetric terms cancel in the quadratic form. This is why the definition explicitly includes symmetry.

## Where SPD matrices come from

### Independent columns and least squares

For a real rectangular matrix $B$,

$$
A=B^TB,\qquad x^TAx=\lVert Bx\rVert_2^2.
$$

This is always symmetric PSD. It is SPD exactly when $B$ has linearly independent columns: then $Bx=0$ forces $x=0$. See [van de Geijn's Gram-matrix exercise](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). This explains the rank condition on the normal equations discussed in [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}).

For example,

$$
B=\begin{bmatrix}1&0\\0&1\\1&1\end{bmatrix},\qquad
B^TB=\begin{bmatrix}2&1\\1&2\end{bmatrix}.
$$

Its first two rows already force any vector in the nullspace to vanish. If both columns instead equal $(1,0,1)^T$, the Gram matrix becomes

$$
\begin{bmatrix}2&2\\2&2\end{bmatrix},
$$

and $(1,-1)^T$ has zero energy. Dependence creates a flat direction.

### Quadratic minimization

Consider $f(x)=\frac12x^TAx-r^Tx$ with symmetric $A$. Its gradient is $Ax-r$. If $A$ is SPD, it is invertible: $Ax=0$ would imply $x^TAx=0$, hence $x=0$.

Let $x_*$ solve $Ax_*=r$. Expanding around this point yields

$$
f(x_*+h)-f(x_*)=\frac12h^TAh.
$$

The difference is strictly positive for nonzero $h$, proving that $x_*$ is the unique global minimum. For the worked-example matrix and $r=(4,3)^T$, $x_*=(1,1)^T$ and $f(x_*)=-7/2$. SPD turns stationarity into a unique optimum.

### Adding a positive penalty

If $C$ is symmetric PSD and $\alpha>0$, then

$$
x^T(C+\alpha I)x=x^TCx+\alpha\lVert x\rVert_2^2>0\quad(x\ne0).
$$

Thus $C+\alpha I$ is SPD even when $C$ has a flat direction. This derivation explains why a positive squared-length penalty removes the nullspace of a least-squares quadratic.

## Numerical recognition

In software, establish symmetry and then attempt Cholesky. [LAPACK's DPOTRF](https://www.netlib.org/lapack/double/dpotrf.f) reports successful factorization with `INFO = 0` and a failed positive-definiteness test with `INFO > 0`. It reads only the selected triangle, so success does not independently verify that both stored triangles agree.

An SPD matrix can be close to singular. For $A_\varepsilon=\operatorname{diag}(1,\varepsilon)$ with $\varepsilon>0$, the second equation in $A_\varepsilon x=r$ gives $x_2=r_2/\varepsilon$. A change $\delta$ in $r_2$ changes $x_2$ by $\delta/\varepsilon$. Strict positivity guarantees a unique solution, but a very small positive eigenvalue can make it sensitive. Floating-point Cholesky can break down for nearly singular input; see [Higham's numerical discussion](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/).

## Interactive example: change the coupling

Use the existing quadratic-energy lab below for $A=\begin{bmatrix}a&b\\b&c\end{bmatrix}$. It shows energy signs, the unit-energy contour when SPD, and a Cholesky certificate. With $a=4$ and $c=3$, predict the transition at $|b|=\sqrt{12}$. Increase $b$ through that boundary, then try the displayed zero or negative energy direction.

{% include wiki-lab.html kind="cholesky" title="Explore positive definiteness in every direction" plot_description="Quadratic energy signs, an elliptical unit-energy contour for SPD matrices, and the selected vector direction." %}

The controls accept keyboard input. A single positive-energy vector does not prove SPD; compare its energy with the lab's whole-matrix test. Without JavaScript, the completed-square examples above provide the same criterion and explain its boundary.

## Practice problems

### 1. Hand calculation: find the allowable coupling

For which real $t$ is $A=\begin{bmatrix}2&t\\t&8\end{bmatrix}$ SPD?

<details markdown="1">
<summary>Hint</summary>

Use $a>0$ and $ac-b^2>0$.

</details>
<details markdown="1">
<summary>Worked solution</summary>

The first condition holds. The determinant is $16-t^2$, so SPD holds exactly for $-4<t<4$. At $t=4$, $q(x)=2(x_1+2x_2)^2$ vanishes along $(-2,1)^T$. At $t=-4$, it vanishes along $(2,1)^T$. Beyond either boundary, the determinant is negative and the completed-square remainder is negative.

</details>

### 2. Interpretation: what does a positive sample establish?

For $A=\begin{bmatrix}1&3\\3&1\end{bmatrix}$, you measure positive energy along both coordinate axes and $(1,1)^T$. Can you conclude SPD? Choose a decisive next test.

<details markdown="1">
<summary>Hint</summary>

Try opposite signs in the coordinates.

</details>
<details markdown="1">
<summary>Worked solution</summary>

No. The three sampled energies are $1$, $1$, and $8$. But $(1,-1)^T$ gives energy $-4$, disproving SPD. A single nonpositive nonzero direction refutes the definition; finitely many positive samples generally cannot prove it.

</details>

### 3. Abstract reasoning: change coordinates

Suppose $A$ is SPD and $S$ is an invertible real square matrix. Prove $S^TAS$ is SPD. What can fail if $S$ is singular?

<details markdown="1">
<summary>Hint</summary>

Compare $x^TS^TASx$ with the energy of $Sx$.

</details>
<details markdown="1">
<summary>Worked solution</summary>

Symmetry follows from $(S^TAS)^T=S^TA^TS=S^TAS$. For nonzero $x$, invertibility gives $Sx\ne0$, so $(Sx)^TA(Sx)>0$. If $S$ is singular, some nonzero $x$ satisfies $Sx=0$, giving zero energy. The result is then PSD, but not SPD.

</details>

### 4. Application: remove ambiguity in a fit

A least-squares model has identical columns and Gram matrix $C=\begin{bmatrix}2&2\\2&2\end{bmatrix}$. Why are its parameters ambiguous? Does adding $\frac\alpha2\lVert x\rVert_2^2$ to the objective remove the ambiguity for $\alpha>0$?

<details markdown="1">
<summary>Hint</summary>

Find a null vector of $C$, then examine $C+\alpha I$.

</details>
<details markdown="1">
<summary>Worked solution</summary>

The vector $(1,-1)^T$ changes the two coefficients oppositely without changing the model's fitted output. The original quadratic therefore has a flat direction. The penalized Hessian is $C+\alpha I$, and its energy is $2(x_1+x_2)^2+\alpha(x_1^2+x_2^2)>0$ for nonzero $x$. The penalized quadratic has a unique minimizer. Its optimum may differ from an unpenalized fit because the objective has changed.

</details>

## Further learning

- [Higham: What Is a Symmetric Positive Definite Matrix?](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/): compare eigenvalue and principal-minor tests and continue to block matrices.
- [van de Geijn: Notes on Cholesky Factorization](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html): follow a constructive proof and algorithm for the triangular factor.
- [LAPACK: DPOTRF](https://www.netlib.org/lapack/double/dpotrf.f): understand triangle storage and failure reporting in a numerical implementation.

## Related pages

- [Vector norms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }})
- [Matrix norms]({{ '/wiki/linear-algebra/matrix-norm/' | relative_url }})
- [Quadratic form]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }})

- [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }})
- [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }})
- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})

## References

1. van de Geijn, R. A. (2011). [*Notes on Cholesky Factorization*](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). University of Texas at Austin. SPD definition, Gram matrices, and the Cholesky theorem.
2. Higham, N. J. (2020, July 21). [*What Is a Symmetric Positive Definite Matrix?*](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/). Equivalent positivity criteria and semidefinite comparison.
3. LAPACK. [*DPOTRF routine documentation*](https://www.netlib.org/lapack/double/dpotrf.f). Symmetric triangle storage and Cholesky success or failure.
4. Higham, N. J. (2020, August 11). [*What Is a Cholesky Factorization?*](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/). Floating-point behavior near singularity.
