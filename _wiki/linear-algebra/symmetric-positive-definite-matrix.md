---
title: Symmetric positive definite matrix
subject: Linear Algebra
interactive_examples: true
description: Recognize positive energy in every direction through quadratic forms, eigenvalues, Cholesky factors, and worked examples.
last_modified_at: 2026-10-16
---

## Definition

The condition “symmetric positive definite” says that a matrix is mirrored across its diagonal and that its associated squared-coordinate expression is positive for every nonzero input. Before writing the condition formally, read the notation:

- A **vector** $x\in\mathbb R^n$ is a column of $n$ real numbers, called its coordinates. A **scalar** is a single number.
- A **square matrix** $A\in\mathbb R^{n\times n}$ has $n$ rows and $n$ columns. Its **main diagonal** runs from top left to bottom right; **off-diagonal** entries occupy the other positions.
- The **transpose** $A^T$ exchanges rows and columns. A matrix is **symmetric** when $A^T=A$. For example, a two-by-two matrix with rows $(3,1)$ and $(1,2)$ is symmetric because its two off-diagonal entries match.
- The product $x^TAx$ returns one number. Compute $Ax$, then multiply matching coordinates of $x$ and $Ax$ and add: this is their **dot product**. For $A=\operatorname{diag}(2,3)$, meaning entries $2,3$ on the main diagonal and zeros elsewhere, the result is $2x_1^2+3x_2^2$.

This last expression is a **quadratic form**: it combines squares and products of pairs of coordinates. Read [quadratic forms]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }}) for the coefficient rules, or the [matrix-decomposition overview]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}) for basic matrix operations.

A real square matrix $A\in\mathbb R^{n\times n}$ is **symmetric positive definite** (**SPD**) when

$$
A^T=A,\qquad x^TAx>0\quad\text{for every nonzero }x\in\mathbb R^n.
$$

Here **nonzero** means at least one coordinate is not zero; it does not require all coordinates to be positive. **Strictly positive** means greater than zero, not merely greater than or equal to zero. For example, $2x_1^2+3x_2^2$ is positive for every nonzero input, including $(0,-1)^T$. Both symmetry and strict positivity are required. See [van de Geijn's definition](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

SPD matrices describe an energy that increases in every direction away from zero. A **linear system** $Ax=b$ asks which unknown coordinates $x$ produce a given output $b$. SPD structure guarantees a unique solution for every $b$. It also supports [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}), a specialized [matrix decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}).

## Intuition: every direction costs energy

For a symmetric two-by-two matrix,

$$
A=\begin{bmatrix}a&b\\b&c\end{bmatrix},\qquad
q(x)=x^TAx=ax_1^2+2bx_1x_2+cx_2^2.
$$

The diagonal entries penalize individual coordinates. The term $2bx_1x_2$ multiplies different coordinates, so it is a **cross term**; $b$ is their **coupling coefficient**, recording how they interact. For example, when $b>0$, equal-sign coordinates make this term positive and opposite-sign coordinates make it negative. Its effect therefore depends on the direction of $x$, rather than just its length. Testing $x=(1,0)^T$ and $x=(0,1)^T$ checks only the coordinate axes. A coupled direction can still have zero or negative energy.

Scaling a direction gives $q(tx)=t^2q(x)$. For SPD input, moving farther along any nonzero direction increases the energy. The **origin** is the vector with every coordinate zero. It is the unique minimum of $q$: every other input has a larger value.

A symmetric matrix is **positive semidefinite** (**PSD**) if $q(x)\ge0$ for all $x$, allowing zero energy in nonzero directions. For example, $q(x)=x_1^2$ has a **flat direction**: changing $x_2$ costs nothing. **Indefinite** means some directions have positive energy and others negative energy; $x_1^2-x_2^2$ is positive at $(1,0)^T$ and negative at $(0,1)^T$. See [Higham's semidefinite comparison](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/).

A **level curve**, or **contour**, connects inputs with the same function value. For example, $x_1^2+x_2^2=4$ is a circle of radius $2$: every point on it has energy $4$. The figure compares ellipses (stretched circles), flat-direction pairs of lines, and hyperbolas (the two open branches of $x_1^2-x_2^2=k$ for nonzero $k$).

{% include image.html src="/assets/images/wiki/cholesky-energy.svg" alt="Quadratic-energy contours: closed ellipses for positive definite energy, parallel lines for a semidefinite flat direction, and hyperbolas for indefinite energy." caption="Read each curve as a set of input vectors with equal energy q(x) = xᵀAx: q(x) = 4 means energy 4 at every point on the curve, not coordinate 4. Every panel uses blue solid curves at the same positive levels 1, 2, 4. SPD energy forms closed ellipses around its minimum at the origin. Semidefinite energy x₁² forms vertical pairs of lines; q(x) = 4 lies at x₁ = ±2 for any x₂. Indefinite energy has positive and negative hyperbolas: orange dashed curves show −1, −2, −4, while gray lines show q(x) = 0." %}



## Worked example: prove positivity without checking infinitely many vectors

The following calculations and exercises are original illustrative examples.

Take

$$
A=\begin{bmatrix}3&1\\1&2\end{bmatrix}.
$$

First, matching off-diagonal entries establish symmetry. **Completing the square** rewrites a square term and a cross term as a squared bracket plus a remainder. For example, $t^2+2t+3=(t+1)^2+2$, because expanding the bracket gives $t^2+2t+1$. See [quadratic forms: completing the square]({{ '/wiki/linear-algebra/quadratic-form/#completing-the-square-and-cholesky' | relative_url }}) for the two-coordinate rule. Here it gives:

$$
\begin{aligned}
x^TAx&=3x_1^2+2x_1x_2+2x_2^2\\
&=3\left(x_1+\frac{x_2}{3}\right)^2+\frac53x_2^2.
\end{aligned}
$$

Each added term (a **summand**) is nonnegative, meaning greater than or equal to zero. For the sum to vanish, the second term forces $x_2=0$, then the first forces $x_1=0$. Thus every nonzero vector has strictly positive energy.

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

Here are the terms used in the tests:

- An **eigenvector** is a nonzero vector $v$ satisfying $Av=\lambda v$; its **eigenvalue** $\lambda$ is the multiplier. For $A=\operatorname{diag}(2,3)$, $(1,0)^T$ is an eigenvector with eigenvalue $2$. See the [overview's eigenvector explanation]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}).
- A **determinant** is a number associated with a square matrix. In two dimensions, the determinant of our matrix with entries $a,b,b,c$ is $ac-b^2$. A **leading principal minor** is the determinant of an upper-left square block. For our worked example, the first minor is $3$ and the second is $3\cdot2-1^2=5$. See [LU's determinants and initial blocks]({{ '/wiki/linear-algebra/lu-decomposition/#when-the-factorization-exists' | relative_url }}) for more context.
- A **lower triangular** matrix has zeros above the main diagonal. A **Cholesky factor** is such a matrix $L$ satisfying $A=LL^T$, with positive diagonal entries. For example, $A=\operatorname{diag}(4,9)$ has $L=\operatorname{diag}(2,3)$. See [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) for how to construct it.

The all-positive-minors test is called **Sylvester's criterion**. For a **real symmetric** matrix, the following tests are **equivalent**: passing any one guarantees the others.

| Test | What to check |
| --- | --- |
| Quadratic form | $x^TAx>0$ for every nonzero $x$ |
| Eigenvalues | Every eigenvalue is strictly positive |
| Sylvester's criterion | Every leading principal minor is strictly positive |
| Cholesky factor | $A=LL^T$ with $L$ lower triangular and positive diagonal |

For an $n\times n$ matrix, the minor test checks the blocks of sizes $1,2,\ldots,n$. See [Higham's equivalent conditions](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/) and [van de Geijn's Cholesky theorem](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). These statements assume symmetry; eigenvalue positivity alone does not establish SPD for a general matrix.

### Why eigenvalues explain the geometry

A **unit vector** has length $1$. The **Euclidean norm** $\lVert v\rVert_2=\sqrt{v_1^2+\cdots+v_n^2}$ measures length; for example, $(3,4)^T$ has length $5$, and $(3/5,4/5)^T$ is a unit vector. Two vectors are **orthogonal**, or perpendicular, if their dot product is zero. An **orthogonal matrix** $Q$ has perpendicular unit columns, satisfies $Q^TQ=I$, and preserves lengths. Here $I$ is the identity matrix, whose diagonal entries are $1$ and all other entries $0$. See [vector norms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }}) and [orthogonal factors in the overview]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}).

The spectral theorem says that a real symmetric matrix has such a set of eigenvectors spanning all coordinate directions. Its **symmetric eigendecomposition** stores them as $A=Q\Lambda Q^T$, with orthogonal $Q$ and **diagonal** $\Lambda$ (zeros off the diagonal). Its diagonal entries are the eigenvalues $\lambda_i$. Put $y=Q^Tx$: these are the coordinates measured along those eigenvector directions. Then

$$
x^TAx=y^T\Lambda y=\sum_{i=1}^n\lambda_i y_i^2.
$$

If every $\lambda_i>0$, this sum is positive for nonzero $y$. Conversely, an eigenvector $v_i$ satisfies $v_i^TAv_i=\lambda_i\lVert v_i\rVert_2^2$, so SPD forces $\lambda_i>0$. This derives the eigenvalue test above.

In eigenvector coordinates, the contour $q(x)=1$ has **semiaxis lengths**, meaning the distances from the ellipse's center to its edge along its eigenvector directions, of $1/\sqrt{\lambda_i}$. A small eigenvalue means a long axis and a direction with weak resistance. For our worked example,

$$
\lambda_\pm=\frac{5\pm\sqrt5}{2}>0.
$$

### Why a Cholesky factor is a certificate

A **certificate** is a checkable witness for a claim: here the factor $L$ proves positivity through a sum of squares. A matrix is **invertible** if it has an inverse that undoes its action. For example, $\operatorname{diag}(2,3)$ is undone by $\operatorname{diag}(1/2,1/3)$; an invertible matrix cannot send a nonzero vector to zero. A triangular matrix with nonzero diagonal entries is invertible. See [inverse matrices in the overview]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}).

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

Then $x^TBx=x_1^2+x_2^2>0$ for nonzero $x$, but $B^T\ne B$. The off-diagonal part is **skew-symmetric**, meaning its transpose is its negative: $2x_1x_2$ and $-2x_2x_1$ cancel in the quadratic form. This is why the definition explicitly includes symmetry.

## Where SPD matrices come from

### Independent columns and least squares

**Least squares** fits predictions $Bx$ to measurements $b$ by minimizing the sum of squared discrepancies, $\lVert Bx-b\rVert_2^2$. For example, fitting one constant $t$ to $1,2,6$ minimizes $(t-1)^2+(t-2)^2+(t-6)^2$; its best value is $3$.

Columns are **linearly independent** if none can be made by multiplying the others by numbers and adding. Their number of independent directions is the **rank**. For instance, $(1,0)^T$ and $(0,1)^T$ are independent; identical columns are dependent, so different parameters can produce the same prediction. See the [overview's rank and least-squares examples]({{ '/wiki/linear-algebra/matrix-decomposition/#terms-for-the-conditions-and-uses' | relative_url }}).

For a real rectangular matrix $B$,

$$
A=B^TB,\qquad x^TAx=\lVert Bx\rVert_2^2.
$$

The matrix $B^TB$ is a **Gram matrix**: each entry is the dot product of a pair of columns of $B$. Its diagonal entries are their squared lengths. This matrix is always symmetric PSD. It is SPD exactly when $B$ has linearly independent columns: then $Bx=0$ forces $x=0$. See [van de Geijn's Gram-matrix exercise](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). This explains the rank condition on the **normal equations**, the linear system $B^TBx=B^Tb$ characterizing least-squares fits, discussed in [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}).

For example,

$$
B=\begin{bmatrix}1&0\\0&1\\1&1\end{bmatrix},\qquad
B^TB=\begin{bmatrix}2&1\\1&2\end{bmatrix}.
$$

The **nullspace** is the set of vectors $x$ satisfying $Bx=0$, meaning parameter changes that leave every prediction unchanged. For this example, the first row forces $x_1=0$ and the second forces $x_2=0$, so the nullspace contains only zero. If both columns instead equal $(1,0,1)^T$, the Gram matrix becomes

$$
\begin{bmatrix}2&2\\2&2\end{bmatrix},
$$

and $(1,-1)^T$ has zero energy. Dependence creates a flat direction.

### Quadratic minimization

**Minimization** chooses inputs to make an **objective function** as small as possible. A **gradient** collects its coordinate slopes into a vector; each slope is a partial derivative, changing one coordinate while holding the others fixed. A **Hessian** collects second partial derivatives into a matrix, measuring how the slopes change. For example, $x_1^2+3x_2^2$ has gradient $(2x_1,6x_2)^T$ and Hessian $\operatorname{diag}(2,6)$. See [quadratic forms: derivatives and optimization]({{ '/wiki/linear-algebra/quadratic-form/#derivatives-and-optimization' | relative_url }}) for a step-by-step derivation.

Consider $f(x)=\frac12x^TAx-r^Tx$ with symmetric $A$. Here $r$ is a fixed vector. Its gradient is $Ax-r$, and its Hessian is $A$. A **stationary point** has zero gradient, so in this example it solves $Ax=r$. If $A$ is SPD, it is invertible: $Ax=0$ would imply $x^TAx=0$, hence $x=0$.

Let $x_{\ast}$ solve $Ax_{\ast}=r$, and let $h$ be a change in its coordinates. Expanding around this point yields

$$
f(x_{\ast}+h)-f(x_{\ast})=\frac12h^TAh.
$$

The difference is strictly positive for nonzero $h$, proving that $x_{\ast}$ is the **unique global minimum**: it has a smaller value than every other input. For the worked-example matrix and $r=(4,3)^T$, $x_{\ast}=(1,1)^T$ and $f(x_{\ast})=-7/2$. SPD turns stationarity into a unique optimum. [Convexity: the Hessian tests every direction]({{ '/wiki/optimization/convexity/' | relative_url }}#the-hessian-tests-every-direction) places this quadratic result in the broader distinction between convexity, strict convexity, and existence of a minimizer.

### Adding a positive penalty

If $C$ is symmetric PSD and $\alpha>0$, then

$$
x^T(C+\alpha I)x=x^TCx+\alpha\lVert x\rVert_2^2>0\quad(x\ne0).
$$

Thus $C+\alpha I$ is SPD even when $C$ has a flat direction. This derivation explains why a positive squared-length penalty removes the nullspace of a least-squares quadratic.

## Numerical recognition

In software, establish symmetry and then attempt Cholesky. [LAPACK's DPOTRF](https://www.netlib.org/lapack/double/dpotrf.f) reports successful factorization with `INFO = 0` and a failed positive-definiteness test with `INFO > 0`. It reads only the selected triangle (the entries on and above the diagonal, or on and below it), so success does not independently verify that both stored triangles agree.

A square matrix is **singular** when it has no inverse: for example, $\operatorname{diag}(1,0)$ loses the second coordinate. An SPD matrix is invertible, but can be close to such a singular matrix. For $A_\varepsilon=\operatorname{diag}(1,\varepsilon)$ with $\varepsilon>0$, the second equation in $A_\varepsilon x=r$ gives $x_2=r_2/\varepsilon$. A change $\delta$ in $r_2$ changes $x_2$ by $\delta/\varepsilon$. Strict positivity guarantees a unique solution, but a very small positive eigenvalue can make it sensitive. **Floating-point arithmetic** stores numbers with limited precision, so results may be rounded; for example, representing $1/3$ as $0.3333$ introduces a small error. For nearly singular input, these errors can overwhelm a tiny positive quantity needed by the algorithm. Floating-point Cholesky can break down for nearly singular input; see [Higham's numerical discussion](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/).

## Interactive example: change the coupling

Use the existing quadratic-energy lab below for <span class="math-inline" markdown="0">\(A=\begin{bmatrix}a&b\\b&c\end{bmatrix}\)</span>. It shows energy signs, the unit-energy contour when SPD, and a Cholesky certificate. With $a=4$ and $c=3$, predict the transition at $\lvert b\rvert=\sqrt{12}$. The absolute value $\lvert b\rvert$ ignores the sign of $b$; for example, $\lvert-2\rvert=2$. Increase $b$ through that boundary, then try the displayed zero or negative energy direction.

{% include wiki-lab.html kind="cholesky" title="Explore positive definiteness in every direction" plot_description="Quadratic energy signs, an elliptical unit-energy contour for SPD matrices, and the selected vector direction." %}

The controls accept keyboard input. A single positive-energy vector does not prove SPD; compare its energy with the lab's whole-matrix test. Without JavaScript, the completed-square examples above provide the same criterion and explain its boundary.

## Practice problems

### 1. Hand calculation: find the allowable coupling

For which real $t$ is <span class="math-inline" markdown="0">\(A=\begin{bmatrix}2&t\\t&8\end{bmatrix}\)</span> SPD?

<details markdown="1">
<summary>Hint</summary>

Use $a>0$ and $ac-b^2>0$.

</details>
<details markdown="1">
<summary>Worked solution</summary>

The first condition holds. The determinant is $16-t^2$, so SPD holds exactly for $-4<t<4$. At $t=4$, $q(x)=2(x_1+2x_2)^2$ vanishes along $(-2,1)^T$. At $t=-4$, it vanishes along $(2,1)^T$. Beyond either boundary, the determinant is negative and the completed-square remainder is negative.

</details>

### 2. Interpretation: what does a positive sample establish?

For <span class="math-inline" markdown="0">\(A=\begin{bmatrix}1&3\\3&1\end{bmatrix}\)</span>, you measure positive energy along both coordinate axes and $(1,1)^T$. Can you conclude SPD? Choose a decisive next test.

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

A least-squares model has identical columns and Gram matrix <span class="math-inline" markdown="0">\(C=\begin{bmatrix}2&2\\2&2\end{bmatrix}\)</span>. Why are its parameters ambiguous? Does adding $\frac\alpha2\lVert x\rVert_2^2$ to the objective remove the ambiguity for $\alpha>0$?

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
