---
title: Quadratic form
subject: Linear Algebra
interactive_examples: true
description: Read xᵀAx as a scalar quadratic expression, understand its geometry, and connect its curvature to matrix factorizations and optimization.
last_modified_at: 2026-10-16
lang: en
translation_key: wiki-linear-algebra-quadratic-form
---

## Definition

A quadratic form turns a list of coordinates into one number using squares and products of pairs of coordinates. For example, $q(x_1,x_2)=2x_1^2+4x_1x_2+3x_2^2$ assigns the value $22$ to $(x_1,x_2)=(1,2)$. The matrix notation below stores the coefficients of such an expression compactly.

### Notation to read first

A **vector** $x\in\mathbb R^n$ is a column of $n$ real numbers; its entries $x_1,\ldots,x_n$ are its **coordinates**. A **scalar** is a single number, such as $22$. A matrix $A\in\mathbb R^{n\times n}$ is an array with $n$ rows and $n$ columns; $a_{ij}$ is its entry in row $i$, column $j$. The **main diagonal** runs from the top-left entry to the bottom-right.

The **transpose** $A^T$ exchanges rows and columns. Thus $x^T$ turns a column into a row. For example,

$$
x=\begin{bmatrix}1\\2\end{bmatrix},\qquad
x^T=\begin{bmatrix}1&2\end{bmatrix}.
$$

The **dot product** multiplies matching coordinates and adds: $(1,2)^T\cdot(3,4)^T=1\cdot3+2\cdot4=11$. The **identity matrix** $I$ has diagonal entries $1$ and other entries $0$, so $Ix=x$. See the [matrix-decomposition overview]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}) for these operations and [OpenStax's matrix notation](https://openstax.org/books/college-algebra-2e/pages/7-5-matrices-and-matrix-operations) for a basic introduction.

### Formal definition

A real **quadratic form** is a function $q:\mathbb R^n\to\mathbb R$ (a vector goes in, one real number comes out) of the form

$$
q(x)=x^TAx=\sum_{i=1}^n\sum_{j=1}^n a_{ij}x_ix_j,
$$

where $A\in\mathbb R^{n\times n}$ is fixed and $x\in\mathbb R^n$ is a column vector. The two summation signs mean “add $a_{ij}x_ix_j$ for every pair of indices $i,j$.” Every term has exactly two coordinate factors: $x_1^2$ counts as $x_1x_1$. There is no term like $5x_1$ (a **linear term**) or $7$ (a **constant term**). This is called **homogeneous of degree two**: scaling every coordinate by $t$ scales every term by $t^2$. For example, $2x_1^2+3x_2^2$ becomes four times as large when both coordinates double. See [MIT's notes, §5.2](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=3).

The dimensions explain why the result is a scalar:

$$
\underbrace{x^T}_{1\times n}\,
\underbrace{A}_{n\times n}\,
\underbrace{x}_{n\times1}
\quad\longrightarrow\quad 1\times1.
$$

Compute $Ax$ first, then take its dot product with $x$: $q(x)=x\cdot(Ax)$. The matrix maps a vector to another vector; the quadratic form assigns that vector a number. The **Euclidean norm** $\lVert x\rVert_2$ is the ordinary length $\sqrt{x_1^2+\cdots+x_n^2}$; $(3,4)^T$ has length $5$ and squared length $25$. See [vector norms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }}). When $A=I$, the quadratic form is this squared length $x^Tx=\lVert x\rVert_2^2$. More general matrices describe **penalties**, numbers measuring the cost of an input, and interactions between coordinates. Calling this value “energy” is an interpretation of that cost; the number need not represent physical energy.

The examples, derivations, and exercises below are original illustrations of these concepts.

## Reading and constructing the matrix

The **main diagonal** runs from top left to bottom right; **off-diagonal** entries are the remaining positions. A matrix is **symmetric** if it equals its transpose, so entries reflected across the diagonal match. For example, the two off-diagonal entries below are both $b$. For such a two-by-two matrix,

$$
A=\begin{bmatrix}a&b\\b&c\end{bmatrix},\qquad
q(x)=ax_1^2+2bx_1x_2+cx_2^2.
$$

A **cross term** multiplies different coordinates, such as $4x_1x_2$; its **coefficient** is the number $4$ multiplying that product. Compare $(x_1+x_2)^2=x_1^2+2x_1x_2+x_2^2$: the mixed product comes from multiplying the two different parts of the bracket. In $x^TAx$, the cross term occurs twice in the matrix product: once from $a_{12}x_1x_2$ and once from $a_{21}x_2x_1$. Therefore, to represent $3x_1^2+4x_1x_2+2x_2^2$ with a symmetric matrix, put **half the cross-term coefficient** in each off-diagonal position:

$$
A=\begin{bmatrix}3&2\\2&2\end{bmatrix}.
$$

For $x=(1,-1)^T$, compute it both ways:

$$
Ax=\begin{bmatrix}1\\0\end{bmatrix},\qquad
x^T(Ax)=1,
$$

$$
3(1)^2+4(1)(-1)+2(-1)^2=1.
$$

For three variables, the same rule gives

$$
2x_1^2+3x_2^2+x_3^2+6x_1x_2-4x_1x_3
=x^T\begin{bmatrix}2&3&-2\\3&3&0\\-2&0&1\end{bmatrix}x.
$$

An absent interaction means a zero off-diagonal entry; it does not require the corresponding diagonal entry to vanish.

## Why only the symmetric part matters

A **skew-symmetric** matrix satisfies $K^T=-K$: reflecting an entry across the diagonal reverses its sign, and the diagonal entries are zero. For example,

$$
K=\begin{bmatrix}0&2\\-2&0\end{bmatrix},\qquad
x^TKx=2x_1x_2-2x_2x_1=0.
$$

Those opposite contributions cancel. Any real square matrix can be split into a symmetric part $S$ and a skew-symmetric part $K$:

$$
S=\frac{A+A^T}{2},\qquad K=\frac{A-A^T}{2},\qquad A=S+K.
$$

Because $K^T=-K$ and a scalar equals its transpose,

$$
x^TKx=(x^TKx)^T=x^TK^Tx=-x^TKx.
$$

Thus $x^TKx=0$ and

$$
\boxed{x^TAx=x^TSx.}
$$

This proves why restricting to symmetric representatives loses no quadratic forms; see [MIT's Exercise 84 and Theorem 86](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=3). A **basis** is a choice of building blocks from which every vector can be assembled uniquely. The blocks are **independent**: none can be built by scaling and adding the others. For example, the usual basis vectors $e_1=(1,0)^T$ and $e_2=(0,1)^T$ give $x=x_1e_1+x_2e_2$. Here $e_i$ means the vector with $1$ in position $i$ and $0$ elsewhere. The symmetric representative is unique for that coordinate choice, although adding any skew-symmetric matrix leaves the form unchanged.

For example,

$$
A=\begin{bmatrix}2&5\\-1&3\end{bmatrix},\qquad
S=\begin{bmatrix}2&2\\2&3\end{bmatrix}
$$

both produce $2x_1^2+4x_1x_2+3x_2^2$. An **eigenvector** is a nonzero vector $v$ for which $Sv=\lambda v$: the matrix sends it to a multiple of itself. That multiplier $\lambda$ is its **eigenvalue**. For example, $\operatorname{diag}(2,3)$ means a matrix with $2,3$ on its main diagonal and zeros elsewhere; it sends $e_1$ to $2e_1$. Thus $e_1$ has eigenvalue $2$. See the [overview's eigenvector examples]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}). To study the signs or geometry of our form, use the eigenvalues of $S$. Positive eigenvalues of a nonsymmetric $A$ alone do not suffice: <span class="math-inline" markdown="0">\(A=\begin{bmatrix}1&4\\0&1\end{bmatrix}\)</span> has only eigenvalue $1$, but $q(1,-1)=-2$.

## Geometry: direction, scale, and level curves

For any real scalar $t$,

$$
q(tx)=t^2q(x),\qquad q(-x)=q(x).
$$

Doubling a displacement multiplies its value by four. Reversing its direction leaves the value unchanged. A **linear** function would satisfy both $q(tx)=tq(x)$ and $q(x+z)=q(x)+q(z)$. Quadratic forms generally fail these rules: for $q(x)=x_1^2$, $q(2e_1)=4$, whereas $2q(e_1)=2$.

Two vectors are **orthogonal**, or perpendicular, when their dot product is zero. A **unit vector** has length $1$. A square matrix $Q$ is **orthogonal** when its columns are perpendicular unit vectors; equivalently, $Q^TQ=I$. It rotates or reflects coordinates while preserving lengths. A **diagonal matrix** has zeros away from its main diagonal.

The **spectral theorem** says that a real symmetric matrix has a basis of perpendicular unit eigenvectors. Storing these vectors as the columns of $Q$ and their eigenvalues on the diagonal of $\Lambda$ gives $A=Q\Lambda Q^T$, where the columns of the orthogonal matrix $Q$ are unit eigenvectors and $\Lambda$ contains eigenvalues. Setting $y=Q^Tx$ gives

$$
q(x)=y^T\Lambda y=\sum_i\lambda_i y_i^2.
$$

The eigenvector coordinates remove cross terms. See [MIT's diagonalization argument](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=4). Since $Q$ preserves lengths, each $\lambda_i$ measures the penalty along a unit eigenvector direction, also called a **principal direction**. Moving distance $t$ along it gives $q(tv_i)=\lambda_i t^2$. Its slope changes at rate $2\lambda_i$; this rate of change of slope is the **second derivative** of the one-variable parabola. This is what **curvature** means here; the derivatives section below explains the notation.

For a concrete change of axes, let <span class="math-inline" markdown="0">\(A=\begin{bmatrix}2&1\\1&2\end{bmatrix}\)</span>. Its unit eigenvectors are $(1,1)^T/\sqrt2$ and $(1,-1)^T/\sqrt2$, with eigenvalues $3$ and $1$. Hence

$$
y_1=\frac{x_1+x_2}{\sqrt2},\qquad
y_2=\frac{x_1-x_2}{\sqrt2},\qquad
q(x)=3y_1^2+y_2^2.
$$

A **level curve**, also called a **contour**, joins inputs with the same value: $q(x)=1$ means value $1$ at every point of that curve. Here $3y_1^2+y_2^2=1$ is an **ellipse**, a stretched circle. Its **semiaxes** are the distances from its center to its edge along its principal directions: setting $y_2=0$ gives $\lvert y_1\rvert=1/\sqrt3$, and setting $y_1=0$ gives $\lvert y_2\rvert=1$. A larger positive eigenvalue makes the same-value contour narrower in that direction.

The figure also previews the sign vocabulary: **positive definite** means positive for every nonzero input, **positive semidefinite** means never negative, and **indefinite** means positive in some directions and negative in others. For example, $x_1^2+x_2^2$, $x_1^2$, and $x_1^2-x_2^2$ have these three behaviors, respectively.

{% include image.html src="/assets/images/wiki/cholesky-energy.svg" alt="Equal-value curves compare positive definite quadratic energy with ellipses, positive semidefinite energy with parallel lines, and indefinite energy with hyperbolas." caption="Each curve connects input vectors x = (x₁, x₂) with the same function value q(x) = xᵀAx. A label q(x) = 4 means the function equals 4 everywhere on that curve; it is not an axis coordinate. Blue solid curves use the same levels 1, 2, 4 in every panel. Ellipses surround the positive definite minimum; vertical pairs of lines show that x₁² is unchanged along x₂ (q(x) = 4 occurs at x₁ = ±2). Orange dashed hyperbolas in the indefinite panel have values −1, −2, −4, and gray lines have value zero." %}

Read the figure as a map in the input plane, rather than a graph of height against position. If we instead draw the value as height, $x_1^2+x_2^2$ makes a **bowl** rising in every direction, $x_1^2$ makes a **trough** unchanged along $x_2$, and $x_1^2-x_2^2$ makes a **saddle** rising along one axis and falling along the other. A **flat direction** is one along which moving does not change the value; for this trough, adding any multiple of $(0,1)^T$ changes nothing.

## Definiteness: what signs are possible?

Use the symmetric representative $S$ if the original $A$ is nonsymmetric. The abbreviations **SPD** and **PSD** mean symmetric positive definite and positive semidefinite, respectively. “Nonnegative” includes zero, whereas “positive” excludes it.

| Type | Condition | Eigenvalues of $S$ | Example |
| --- | --- | --- | --- |
| Positive definite | $q(x)>0$ for all $x\ne0$ | All positive | $x_1^2+2x_2^2$ |
| Positive semidefinite | $q(x)\ge0$ for all $x$ | All nonnegative | $x_1^2$ |
| Negative definite | $q(x)<0$ for all $x\ne0$ | All negative | $-x_1^2-2x_2^2$ |
| Negative semidefinite | $q(x)\le0$ for all $x$ | All nonpositive | $-x_1^2$ |
| Indefinite | Takes both positive and negative values | Both signs occur | $x_1^2-x_2^2$ |

A negative definite form is strictly negative at every nonzero input; negative semidefinite allows zero but never positive values. These sign tests follow from the diagonal sum above; compare [MIT's Theorem 86](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=4). Definite forms are also semidefinite under the non-strict definitions; “semidefinite but not definite” specifically allows a nonzero zero-value direction. The zero form is both positive and negative semidefinite.

**Positive diagonal entries do not prove positivity in every direction.** For <span class="math-inline" markdown="0">\(A=\begin{bmatrix}1&2\\2&1\end{bmatrix}\)</span>, both coordinate axes give positive values, but $q(1,-1)=-2$. Conversely, negative off-diagonal entries need not prevent positive definiteness:

$$
2x_1^2-2x_1x_2+2x_2^2=(x_1-x_2)^2+x_1^2+x_2^2.
$$

The **nullspace** is the set of vectors sent to zero by a matrix: $Av=0$. For example, $\operatorname{diag}(1,0)$ sends $(0,1)^T$ to zero. A zero value at a nonzero vector need not mean a flat direction. For the indefinite form $x_1^2-x_2^2$, $q(1,1)=0$ even though $A(1,1)^T\ne0$. For a positive semidefinite symmetric matrix, however, $q(x)=0$ forces all positive-eigenvalue coordinates to vanish, so $Ax=0$.

## Completing the square and Cholesky

**Completing the square** collects a square term and a cross term into a squared bracket, then keeps track of the remainder. For example, $t^2+2t+3=(t+1)^2+2$, because $(t+1)^2$ already supplies $t^2+2t+1$. In two coordinates, $(x_1+x_2)^2$ supplies the cross term $2x_1x_2$. See the [Cholesky page's square-completion explanation]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) for more steps.

For $a>0$, direct expansion verifies

$$
ax_1^2+2bx_1x_2+cx_2^2
=a\left(x_1+\frac ba x_2\right)^2+
\left(c-\frac{b^2}{a}\right)x_2^2.
$$

For <span class="math-inline" markdown="0">\(A=\begin{bmatrix}4&2\\2&3\end{bmatrix}\)</span>, this becomes

$$
q(x)=(2x_1+x_2)^2+(\sqrt2x_2)^2.
$$

This sum is strictly positive unless $x=0$. Set $y_1=2x_1+x_2$ and $y_2=\sqrt2x_2$; then $q(x)=y_1^2+y_2^2$. This change of coordinates is $y=L^Tx$, with

$$
L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix},\qquad
A=LL^T,\qquad q(x)=\lVert L^Tx\rVert_2^2.
$$

The factor $L$ is **lower triangular**, meaning its entries above the diagonal are zero. Its transpose is upper triangular: $y_2$ uses only $x_2$, whereas $y_1$ can use both old coordinates. That one-way dependence is what “triangular” means here.

[Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) constructs such triangular sums of squares for [symmetric positive-definite matrices]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }}). Its existence for SPD matrices is described by [Higham](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/). The remaining coefficient $c-b^2/a$ is a one-number [Schur complement]({{ '/wiki/linear-algebra/schur-complement/' | relative_url }}); for fixed $x_2$, it determines the minimum after allowing $x_1$ to adjust. [Gallier, §2](https://www.cis.upenn.edu/~jean/schur-comp.pdf#page=3), develops the **block** version, grouping several rows and columns together rather than treating one coordinate at a time.

An orthogonal eigenvector transformation preserves lengths and reveals principal directions. The triangular Cholesky transformation instead rescales and mixes coordinates to make the penalty an ordinary squared length. These are two useful [matrix decompositions]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}) with different purposes.

## Derivatives and optimization

**Optimization** means choosing inputs to make a function as small or large as possible. The function we try to minimize is the **objective**. A **global minimum** is no larger than the function's value at any other input.

A **derivative** measures slope. For several coordinates, a **partial derivative** changes one coordinate while holding the others fixed. The **gradient** $\nabla q$ collects these slopes into a vector. The **Hessian** $\nabla^2q$ is the matrix of second partial derivatives, describing how the slopes change. For example,

$$
q(x)=2x_1^2+3x_2^2,\qquad
\nabla q(x)=\begin{bmatrix}4x_1\\6x_2\end{bmatrix},\qquad
\nabla^2q(x)=\begin{bmatrix}4&0\\0&6\end{bmatrix}.
$$

The zero off-diagonal entries say that changing $x_2$ does not affect the slope in $x_1$, or vice versa. See [OpenStax's partial and higher derivatives](https://openstax.org/books/calculus-volume-3/pages/4-3-partial-derivatives).

Let $h$ be a small change in the input. **First-order change** means the part proportional to the size of $h$; quadratic terms shrink faster as $h$ shrinks. For example, $(1+h)^2-1=2h+h^2$, whose first-order part is $2h$. For a quadratic form, expand $q(x+h)$ to see the first-order change:

$$
q(x+h)-q(x)=h^TAx+x^TAh+h^TAh
=h^T(A+A^T)x+h^TAh.
$$

The term quadratic in $h$ has no first-order contribution, so

$$
\nabla q(x)=(A+A^T)x,\qquad \nabla^2q(x)=A+A^T.
$$

For symmetric $A$, these reduce to $2Ax$ and $2A$. The common factor $1/2$ in an objective cancels that $2$:

$$
f(x)=\frac12x^TAx-r^Tx+d,\qquad
\nabla f(x)=Ax-r,\qquad \nabla^2f(x)=A.
$$

Here $r$ is a fixed vector and $d$ a fixed scalar. $f$ is a quadratic function; its quadratic part is the form, while $-r^Tx$ is linear and $d$ is constant. A **stationary point** is an input where the gradient is zero: all coordinate slopes vanish. For example, $t^2-4t$ has slope $2t-4$, so $t=2$ is stationary. If $A$ is SPD, its stationary point $x_\star$ solves $Ax_\star=r$. Substituting this equation and expanding gives

$$
f(x)-f(x_\star)=\frac12(x-x_\star)^TA(x-x_\star)>0
\quad(x\ne x_\star),
$$

which proves it is the unique global minimum. A stationary point of an indefinite quadratic need not minimize it. [Convexity: slopes and curvature]({{ '/wiki/optimization/convexity/' | relative_url }}#slopes-and-curvature-links-to-quadratic-forms) explains why a symmetric PSD Hessian gives a convex quadratic, how SPD strengthens this result, and why convexity alone does not guarantee an attained minimum.

**Least squares** chooses parameters $x$ to minimize the sum of squared differences between predictions $Bx$ and measurements $b$. Those differences form the **residual** $b-Bx$. Its squared length is the total squared error. For example, fitting one number $t$ to measurements $1,2,6$ minimizes $(1-t)^2+(2-t)^2+(6-t)^2$, with best fit $t=3$. In general,

$$
\lVert Bx-b\rVert_2^2=x^TB^TBx-2b^TBx+b^Tb.
$$

Its quadratic form is $x^TB^TBx=\lVert Bx\rVert_2^2$, so it is nonnegative. Columns are **linearly independent** when none is a combination of the others. For example, $(1,0)^T$ and $(0,1)^T$ are independent, but $(1,0)^T$ and $(2,0)^T$ are not. Independent columns of $B$ make this form positive definite; otherwise some parameter changes cost nothing. See [Higham's Gram-matrix argument](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/) and the [LU page's normal-equation derivation]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}).

## Interactive example: change the coupling

The **coupling** here is the interaction recorded by the cross-term coefficient $b$. The energy explorer below uses <span class="math-inline" markdown="0">\(A=\begin{bmatrix}a&b\\b&c\end{bmatrix}\)</span> and reports $q(x)$ for your chosen vector. Keep $a=4$, $c=3$, and $x=(1,-1)^T$: predict $q(x)=7-2b$ before moving the coupling slider. Then compare the flat and indefinite presets and their displayed zero or negative directions.

{% include wiki-lab.html kind="cholesky" title="Explore a quadratic form and its directions" plot_description="Sampled quadratic values, a unit-value ellipse for positive definite input, and a chosen input vector." %}

The colors show signs and relative magnitudes on a fixed input range. A zero value at your selected vector alone does not classify the entire form. Without JavaScript, use the completed-square example above: $b=2$ gives positive definiteness, $b=\sqrt{12}$ gives a flat direction, and $b=4$ gives an indefinite form. These boundaries concern all directions, even while $q(1,-1)$ may remain positive.

## Practice problems

These four original exercises cover hand calculation, interpretation, logical reasoning, and application. Attempt each before revealing the hint or solution.

### 1. Hand calculation: build and evaluate

Find the symmetric matrix for $q(x)=5x_1^2-6x_1x_2+2x_2^2$ and evaluate $q(1,2)$ by both matrix multiplication and substitution into the coordinate expression.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Split the coefficient −6 equally between the two off-diagonal entries.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

<span class="math-inline" markdown="0">\(A=\begin{bmatrix}5&-3\\-3&2\end{bmatrix}\)</span> and $Ax=(-1,1)^T$ at $x=(1,2)^T$. Thus $x^TAx=-1+2=1$. Substitution also gives $5-12+8=1$.

</details>
</div>

### 2. Interpretation: distinguish zero value from a flat direction

Compare $q_1(x)=(x_1+x_2)^2$ and $q_2(x)=x_1^2-x_2^2$. Both vanish at $v=(1,-1)^T$. Which is positive semidefinite? Which is indefinite? Does either satisfy $Av=0$?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Try the coordinate axes, then multiply each representing matrix by v.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

<span class="math-inline" markdown="0">\(A_1=\begin{bmatrix}1&1\\1&1\end{bmatrix}\)</span> is PSD because $q_1$ is a square, and $A_1v=0$: adding any multiple of $v$ leaves $q_1$ unchanged. $A_2=\operatorname{diag}(1,-1)$ is indefinite because the two axes give opposite signs. Here $A_2v=(1,1)^T\ne0$; the zero value comes from cancellation, not a nullspace direction.

</details>
</div>

### 3. Logic: recover a symmetric matrix from its form

Suppose symmetric matrices $S,T$ satisfy $x^TSx=x^TTx$ for every $x$. Prove $S=T$. Why does the conclusion fail without symmetry?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Set D = S − T. Test coordinate vectors eᵢ and their sums eᵢ + eⱼ.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

$e_i^TDe_i=d_{ii}=0$. For $i\ne j$,

$$
(e_i+e_j)^TD(e_i+e_j)=d_{ii}+2d_{ij}+d_{jj}=0.
$$

Thus $d_{ij}=0$. Every entry of $D$ vanishes. Without symmetry, any nonzero skew-symmetric $K$ satisfies $x^TKx=0$ for all $x$, giving the same form as the zero matrix.

</details>
</div>

### 4. Application: minimize a coupled penalty

For <span class="math-inline" markdown="0">\(A=\begin{bmatrix}4&2\\2&3\end{bmatrix}\)</span> and $r=(6,5)^T$, minimize $f(x)=\frac12x^TAx-r^Tx$. Find the minimizer and prove it is global.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Solve Ax = r, then use the completed-square expression for the quadratic form to justify minimality.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

$4x_1+2x_2=6$ and $2x_1+3x_2=5$ give $x_\star=(1,1)^T$, with $f(x_\star)=11/2-11=-11/2$. Writing $h=x-x_\star$ yields

$$
f(x)-f(x_\star)=\frac12\left((2h_1+h_2)^2+2h_2^2\right).
$$

It is positive for every nonzero $h$, so the minimizer is unique and global.

</details>
</div>

## Further learning

- [MIT 14.102, §5.2: Quadratic Forms](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=3): follow the transition from polynomial expressions to eigenvalue sign tests. The displayed negative-semidefinite inequality in Theorem 86 is $\lambda_i\le0$; its accompanying prose contains a sign typo.
- [Higham: What Is a Symmetric Positive Definite Matrix?](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/): connect positive quadratic values with Gram matrices and Cholesky factors.
- [Gallier: The Schur Complement and Symmetric Positive Semidefinite (and Definite) Matrices](https://www.cis.upenn.edu/~jean/schur-comp.pdf): extend scalar square completion to coupled blocks of variables.

## Related pages

- [Symmetric positive definite matrix]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }})
- [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }})
- [Schur complement]({{ '/wiki/linear-algebra/schur-complement/' | relative_url }})
- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})
- [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }})

## References

1. Barczi, N. (2004). *14.102: Math for Economists, Lecture Notes, September 23*. MIT, [§5.2, Quadratic Forms](https://web.mit.edu/14.102/www/notes/lecturenotes0923.pdf#page=3).
2. Higham, N. J. (2020). [What Is a Symmetric Positive Definite Matrix?](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/).
3. Gallier, J. (2019). [The Schur Complement and Symmetric Positive Semidefinite (and Definite) Matrices](https://www.cis.upenn.edu/~jean/schur-comp.pdf). University of Pennsylvania.

4. OpenStax. *College Algebra 2e*. [Matrices and Matrix Operations](https://openstax.org/books/college-algebra-2e/pages/7-5-matrices-and-matrix-operations). Matrix dimensions and multiplication.
5. OpenStax. *Calculus Volume 3*. [Partial Derivatives](https://openstax.org/books/calculus-volume-3/pages/4-3-partial-derivatives). Slopes in separate coordinate directions and higher derivatives.
