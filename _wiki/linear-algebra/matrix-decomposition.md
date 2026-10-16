---
title: Matrix factorization and decomposition
subject: Linear Algebra
interactive_examples: true
description: Represent matrices as products of structured factors, and choose between LU, Cholesky, QR, and other decompositions.
last_modified_at: 2026-10-16
---

## Definition

A **matrix factorization**, also called a **matrix decomposition**, expresses a matrix as a product of matrices with useful structure. For example,

$$
A = BC
$$

The notation $A\in\mathbb R^{m\times n}$ means that $A$ has $m$ rows, $n$ columns, and real-number entries. Its entry $a_{ij}$ is in row $i$, column $j$. In $A=BC$, $B$ has size $m\times r$ and $C$ has size $r\times n$: the matching $r$ lets us multiply them. For example, a $2\times3$ matrix times a $3\times2$ matrix produces a $2\times2$ matrix. A decomposition may have more than two factors. See [OpenStax's matrix operations](https://openstax.org/books/college-algebra-2e/pages/7-5-matrices-and-matrix-operations).

### Reading the factor shapes

The **main diagonal** runs from the top-left entry to the bottom-right. A **diagonal matrix** has zeros everywhere else. A **lower triangular matrix** has zeros above this diagonal; an **upper triangular matrix** has zeros below it. For example,

$$
D=\begin{bmatrix}2&0\\0&3\end{bmatrix},\qquad
L=\begin{bmatrix}1&0\\4&1\end{bmatrix},\qquad
U=\begin{bmatrix}2&5\\0&3\end{bmatrix}.
$$

Here $L$ is **unit lower triangular**: its diagonal entries are all $1$. The notation $\operatorname{diag}(2,3)$ is shorthand for $D$. For a rectangular diagonal matrix, only entries with equal row and column indices may be nonzero. The zero patterns explain the triangular factors in [LAPACK's linear-system factorizations](https://www.netlib.org/lapack/lug/node38.html).

### Transpose, identity, and undoing a transformation

The **transpose** $A^T$ exchanges rows and columns. For example,

$$
\begin{bmatrix}1&2\\3&4\end{bmatrix}^T
=\begin{bmatrix}1&3\\2&4\end{bmatrix}.
$$

A vector is a list of coordinates, usually written as a column; $(3,4)^T$ turns a horizontal list into a column. The **identity matrix** $I$ has diagonal entries $1$ and other entries $0$, so $Ix=x$.

An **inverse** $A^{-1}$ undoes a square matrix's action: $A^{-1}A=AA^{-1}=I$. A matrix with an inverse is **invertible**, or **nonsingular**. For example, $\operatorname{diag}(2,3)$ is undone by $\operatorname{diag}(1/2,1/3)$. A **singular** matrix has no inverse: $\operatorname{diag}(2,0)$ loses the second coordinate, so we cannot recover it. See [OpenStax's identity and inverse matrices](https://openstax.org/books/college-algebra-2e/pages/7-7-solving-systems-with-inverses).

### Length-preserving factors

The **dot product** multiplies matching coordinates and adds: $(1,2)^T\!\cdot(3,4)^T=1\cdot3+2\cdot4=11$. Two nonzero vectors are **perpendicular**, or **orthogonal**, when their dot product is zero. For example, $(1,1)^T$ and $(1,-1)^T$ have dot product $0$.

The **Euclidean length**, written $\lVert x\rVert_2$, is $\sqrt{x_1^2+\cdots+x_n^2}$; $(3,4)^T$ has length $5$. A **unit vector** has length $1$. Dividing a nonzero vector by its length is called **normalizing** it; $(3/5,4/5)^T$ is the normalized version of $(3,4)^T$. See [vector norms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }}) for more examples.

A square matrix $Q$ is **orthogonal** if $Q^TQ=I$: its columns are perpendicular unit vectors, and it preserves lengths. For example, $Q=\operatorname{diag}(1,-1)$ reflects $(3,4)^T$ to $(3,-4)^T$, still of length $5$. See [LAPACK's orthogonal factors](https://www.netlib.org/lapack/lug/node39.html).

A **linear system** $Ax=b$ asks which input $x$ produces the given output $b$. The structure of the factors is what makes the representation useful. Triangular factors simplify solving such systems; orthogonal factors preserve Euclidean lengths; diagonal factors expose independent scalings. These structures also help fit imperfect measurements and find directions that a matrix only stretches; both ideas are explained below. [LAPACK's guide to linear equations](https://www.netlib.org/lapack/lug/node38.html) and [orthogonal factorizations](https://www.netlib.org/lapack/lug/node39.html) describe these uses.

Without additional conditions, a product representation need not be unique. For any invertible $S \in \mathbb{R}^{r\times r}$,

$$
BC = (BS)(S^{-1}C).
$$

Conditions such as a unit diagonal or positive diagonal entries remove some of this freedom. Such a convention is also called a **normalization** of the factors: for example, requiring the diagonal of $L$ to be $1$ fixes how much scaling can be moved between $L$ and $U$.

## Intuition: one operation becomes a sequence

A matrix tells us how to transform a vector. The vectors $e_1=(1,0)^T$ and $e_2=(0,1)^T$ are building blocks: every two-coordinate vector is $x=x_1e_1+x_2e_2$. They form the **coordinate basis**. The columns of a matrix are where it sends these building blocks: if $A$ has columns $a_1$ and $a_2$, then $Ax=x_1a_1+x_2a_2$. A factorization $A=BC$ describes the same transformation in stages:

$$
x\ \xrightarrow{\ C\ }\ y=Cx\ \xrightarrow{\ B\ }\ BCx=Ax.
$$

**The rightmost factor acts first.** The factors are not pieces to add together; they are operations to compose. For example, let

$$
C=\begin{bmatrix}2&0\\0&1\end{bmatrix},\qquad
B=\begin{bmatrix}1&1\\0&1\end{bmatrix}.
$$

$C$ doubles the horizontal coordinate. $B$ changes $(x_1,x_2)^T$ into $(x_1+x_2,x_2)^T$: higher points move farther sideways, while their height stays fixed. This sliding transformation is a **shear**. For $x=(0,1)^T$, stretching and then shearing gives $BCx=(1,1)^T$. Reversing the order gives $CBx=(2,1)^T$. The operations have the same ingredients but different results.

{% include image.html src="/assets/images/wiki/matrix-factor-stages.svg" alt="Three coordinate plots show a unit square, its image under U, and its final image under L U, with the same coordinate scale in all three panels." caption="For A = [[4, 2], [2, 3]], first apply U = [[4, 2], [0, 2]], then L = [[1, 0], [1/2, 1]]. The two stages produce the same parallelogram as applying A directly." %}

The factors can be simpler to work with even though their product has many nonzero entries (a **dense matrix**). A diagonal matrix scales coordinates independently. An orthogonal matrix rotates or reflects without changing lengths. A triangular matrix mixes coordinates in a one-way dependency pattern, making its equations solvable in sequence. See [LAPACK's discussion of orthogonal factors](https://www.netlib.org/lapack/lug/node39.html).

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

### Terms for the conditions and uses

A **linear combination** of vectors means multiplying each by a number and adding the results, as in $2a_1-3a_2$. The **column space**, written $\operatorname{Col}(A)$, is all combinations of $A$'s columns: all outputs $Ax$ that the matrix can produce. Columns are **linearly independent** if none can be built from the others. The **rank** is the largest number of independent columns; **full column rank** means every column contributes an independent direction. For example,

$$
\begin{bmatrix}1&2\\0&0\end{bmatrix}
\quad\text{has rank }1,\qquad
\begin{bmatrix}1&0\\0&1\end{bmatrix}
\quad\text{has rank }2.
$$

In the first matrix, the second column is twice the first, so every output lies on the horizontal axis. **Rank deficient** means the rank is smaller than $\min(m,n)$. See [MIT's explanation of column space and rank](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-1-the-column-space-of-a-contains-all-vectors-ax/).

**Least squares** chooses $x$ to make the sum of squared discrepancies as small as possible. The **residual** $r=b-Ax$ is the vector of those discrepancies. For example, fitting one constant $x$ to measurements $1,2,6$ minimizes $(1-x)^2+(2-x)^2+(6-x)^2$; the best value is $x=3$, with residual $(-2,-1,3)^T$. This is **overdetermined**: three equations for one unknown. See [LAPACK's least-squares formulation](https://www.netlib.org/lapack/lug/node39.html).

A matrix is **symmetric** when $A=A^T$. It is **positive definite** when the expression $x^TAx$ is positive for every nonzero $x$. For $A=\operatorname{diag}(2,3)$, that expression is $2x_1^2+3x_2^2$, which is positive unless both coordinates vanish. We abbreviate **symmetric positive definite** as **SPD**. The [quadratic-form page]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }}) explains expressions like $x^TAx$, and the [SPD page]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }}) develops the positivity condition.

An **eigenvector** is a nonzero vector $v$ for which $Av=\lambda v$; the number $\lambda$ is its **eigenvalue**. For $A=\operatorname{diag}(2,3)$, $e_1$ is an eigenvector with eigenvalue $2$: its direction stays on the same line and its length doubles. A negative eigenvalue reverses direction. See [LAPACK's symmetric eigenproblem](https://www.netlib.org/lapack/lug/node89.html).

The table uses real matrices. For complex numbers, **conjugation** changes $a+bi$ to $a-bi$ (where $i^2=-1$). The **conjugate transpose** $Q^{\ast}$ transposes and conjugates entries. A **unitary** matrix satisfies $Q^{\ast}Q=I$, the complex counterpart of an orthogonal matrix. For example, the one-entry matrix with entry $i$ is unitary because $(-i)i=1$. See [LAPACK's real and complex definitions](https://www.netlib.org/lapack/lug/node39.html).

**Elimination** removes an unknown from later equations by subtracting multiples of earlier equations. The coefficient we divide by to choose a multiple is a **pivot**. Reordering rows to choose a usable pivot is **row pivoting**: for example, if the first equation has coefficient zero for the first unknown, exchange it with an equation whose coefficient is nonzero. The [LU page]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}) demonstrates this with matrices.

| Decomposition | Form | Conditions and factor structure | Typical use |
| --- | --- | --- | --- |
| [LU]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}) | $PA=LU$ | For general nonsingular square matrices; $P$ reorders rows, $L$ is unit lower triangular, and $U$ is upper triangular | Linear systems |
| [Cholesky]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) | $A=LL^T$ | [Symmetric positive-definite]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }}) $A$; $L$ is lower triangular with positive diagonal | Linear systems with positive-definite coefficients |
| [QR]({{ '/wiki/linear-algebra/qr-factorization/' | relative_url }}) | $A=QR$ | For $m\ge n$, the reduced form (keeping only $n$ columns of $Q$) has $Q\in\mathbb{R}^{m\times n}$ with $Q^TQ=I$ and upper triangular $R\in\mathbb{R}^{n\times n}$ | Least squares with full column rank |
| Singular value decomposition (SVD) | $A=U\Sigma V^T$ | Any $m\times n$ matrix; full $U$ and $V$ are orthogonal, and $\Sigma$ is rectangular diagonal with nonnegative entries | Stretch factors (singular values, explained below) and rank analysis |
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

**Forward substitution** solves the lower triangular system from the first row down, as in the earlier three-row example. **Backward substitution** solves an upper triangular system from the last row up. A **permutation matrix** $P$ is an identity matrix with its rows reordered: multiplying by $P$ performs that same reordering on $A$ or $b$. If another right-hand side arrives, the factors can be reused. LAPACK separates [factorization and solve routines](https://www.netlib.org/lapack/lug/node38.html) for this reason.

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

For symmetric positive-definite (SPD) $A=LL^T$,

$$
x^TAx=\lVert L^Tx\rVert_2^2.
$$

A **quadratic form** is an expression such as $x^TAx$ made of squared coordinates and products of pairs of coordinates. A product mixing different coordinates, such as $4x_1x_2$, is a **cross term**. Compare $(2x_1+x_2)^2=4x_1^2+4x_1x_2+x_2^2$: the cross term appears when we multiply the two different parts of the bracket.

**Completing the square** rewrites an expression by collecting such terms into a squared bracket and accounting for what remains. For our example,

$$
4x_1^2+4x_1x_2+3x_2^2
=(2x_1+x_2)^2+2x_2^2
=(2x_1+x_2)^2+(\sqrt2x_2)^2.
$$

Define new coordinates $y_1=2x_1+x_2$ and $y_2=\sqrt2x_2$. The expression is now $y_1^2+y_2^2$, an ordinary squared length. Here $y=L^Tx$: the matrix $L^T$ is upper triangular because $y_2$ needs only $x_2$, whereas $y_1$ can use both old coordinates. This is the concrete meaning of a **triangular change of coordinates**. The [Cholesky page]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) walks through cross terms and completing the square before connecting them to the factorization; the [quadratic-form page]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }}) develops the expression $x^TAx$ itself.

### QR separates direction from coordinate mixing

[Gram–Schmidt orthogonalization]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/' | relative_url }}) constructs perpendicular unit directions by subtracting earlier projections. Recording the reconstruction coefficients produces [QR factorization]({{ '/wiki/linear-algebra/qr-factorization/' | relative_url }}), whose dedicated page develops least squares and alternative algorithms.

Columns of $Q$ form perpendicular unit directions. Columns of $R$ say how to combine those directions to recover the columns of $A$. For instance,

$$
\begin{bmatrix}1&1\\1&-1\end{bmatrix}
=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}
\begin{bmatrix}\sqrt2&0\\0&\sqrt2\end{bmatrix}.
$$

The columns already point in perpendicular directions; $Q$ normalizes them, and $R$ restores their lengths. For columns that are not perpendicular, the entries away from the diagonal (the **off-diagonal entries**) of $R$ also record components along earlier directions. See [LAPACK's QR definition](https://www.netlib.org/lapack/lug/node40.html).

As a small least-squares example, fit one constant $x$ to measurements $(1,2,6)^T$. The **design matrix** stores the coefficients that turn model parameters into predicted measurements. Here it is $B=(1,1,1)^T$, because $Bx=(x,x,x)^T$. Reduced QR gives $q=B/\sqrt3$ and $r=\sqrt3$, so $rx=q^Tb$ gives $x=3$. The residual $b-Bx=(-2,-1,3)^T$ is perpendicular to $q$: its entries sum to zero. The fit captures the component in the model's direction and leaves the perpendicular component as residual.

### SVD finds input and output directions for stretching

In $A=U\Sigma V^T$, $V^T$ expresses the input in perpendicular directions, $\Sigma$ scales those coordinates, and $U$ places them in output directions. For a square matrix, the orthogonal stages may rotate or reflect; the nonnegative diagonal entries of $\Sigma$ give the stretch factors. These stretch factors are the **singular values** $\sigma_i$. If $v_i$ is column $i$ of $V$ and $u_i$ is column $i$ of $U$, then $Av_i=\sigma_i u_i$: one input unit direction becomes an output unit direction multiplied by its stretch factor. See [LAPACK's SVD definition](https://www.netlib.org/lapack/lug/node32.html).

For $A=\operatorname{diag}(3,1)$, a unit circle becomes an ellipse with horizontal half-width $3$ and vertical half-height $1$. If the second diagonal entry is instead zero, the circle collapses onto a line segment: an entire input direction is lost. This illustrates why zero singular values indicate rank loss. Small singular values mean that corresponding input changes produce small output changes, which become strongly amplified when a solve tries to reverse them.

{% include image.html src="/assets/images/wiki/svd-stretch.svg" alt="A unit circle, an ellipse produced by scaling its coordinates by three and one, and a line segment produced by scaling by three and zero." caption="An explicit diagonal example of singular values: (3, 1) stretches two directions; (3, 0) destroys one. Corresponding marked points retain their labels in each panel." %}

### Symmetric eigendecomposition finds directions that keep their orientation

An eigenvector is a nonzero vector whose image is a scalar multiple of itself. For

$$
A=\begin{bmatrix}3&1\\1&3\end{bmatrix},\qquad
A\begin{bmatrix}1\\1\end{bmatrix}=4\begin{bmatrix}1\\1\end{bmatrix},\qquad
A\begin{bmatrix}1\\-1\end{bmatrix}=2\begin{bmatrix}1\\-1\end{bmatrix}.
$$

The two diagonal directions are stretched by $4$ and $2$. Normalize them to form $Q$, and the matrix becomes $Q\operatorname{diag}(4,2)Q^T$. The same directions are used for input and output. That differs from SVD, whose input and output directions can be different, even for square matrices. Symmetric matrices have an **orthogonal eigenbasis**: perpendicular eigenvectors that can be combined to build every vector; see [LAPACK's symmetric eigendecomposition](https://www.netlib.org/lapack/lug/node89.html). Negative eigenvalues reverse a direction, while singular values remain nonnegative.

## Choosing a decomposition

For a general nonsingular square system, use pivoted LU. If the coefficient matrix is [symmetric positive definite]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }}), Cholesky exploits that structure. For an overdetermined system with full column rank, QR solves the least-squares problem. If rank is uncertain, QR with column reordering or SVD can help assess how many directions are distinguishable at the available accuracy. See LAPACK's [linear-system factorizations](https://www.netlib.org/lapack/lug/node38.html) and [rank-sensitive least-squares discussion](https://www.netlib.org/lapack/lug/node42.html).

An **effective numerical rank** counts the directions whose stretch is large enough to matter at the chosen accuracy. For example, $\operatorname{diag}(3,10^{-12})$ has exact rank $2$, but treating stretches below $10^{-10}$ as negligible gives numerical rank $1$. The threshold depends on the scale and accuracy of the data, rather than being universal. **Column-pivoted QR** reorders columns during factorization to help reveal independent directions. See [LAPACK's rank-sensitive QR](https://www.netlib.org/lapack/lug/node42.html) and [matrix norms]({{ '/wiki/linear-algebra/matrix-norm/' | relative_url }}) for measuring matrix size and approximation error.

## Interactive example: change the order

Before moving a slider, predict where the vector and the corners of the unit square will go. The experiment uses $C=\operatorname{diag}(s,1)$ and <span class="math-inline" markdown="0">\(B=\begin{pmatrix}1&k\\0&1\end{pmatrix}\)</span>. Start with $s=2$, $k=1$, then reverse the order. Explain the difference using the intermediate vector, rather than only comparing final numbers.

{% include wiki-lab.html kind="composition" title="Compose a scale and a shear" plot_description="Input square, first-stage square, and final square, with dots tracking a chosen vector." %}

## Practice problems

Try each problem before opening its hint or solution. The first two build hand-calculation fluency, the next two ask you to interpret or choose an approach, the next two develop logical reasoning, and the final two connect the concept to practical work. These are original exercises; the references support the mathematical concepts they use.

### 1. Hand calculation: compose two factors

Let

$$
B=\begin{bmatrix}1&1\\0&1\end{bmatrix},\quad C=\begin{bmatrix}2&0\\0&3\end{bmatrix},\quad x=\begin{bmatrix}1\\2\end{bmatrix}.
$$

Compute $Cx$, $BCx$, and $CBx$. Are the last two vectors equal?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Apply the rightmost matrix first. Compare the two intermediate vectors.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

$Cx=(2,6)^T$, so $BCx=(8,6)^T$. Conversely, $Bx=(3,2)^T$, so $CBx=(6,6)^T$. Scaling and shearing do not **commute** in this example: changing their order changes the result.

</details>
</div>

### 2. Hand calculation: verify a factorization

Verify

$$
\begin{bmatrix}2&1\\0&3\end{bmatrix}
=\begin{bmatrix}1&1\\0&1\end{bmatrix}\begin{bmatrix}2&-2\\0&3\end{bmatrix}.
$$

Then apply the product to $(1,1)^T$, using the factors rather than the original matrix.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Check all four product entries, then track the intermediate vector.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

The product entries are $2$, $-2+3=1$, $0$, and $3$. The right factor sends $(1,1)^T$ to $(0,3)^T$; the left factor sends that to $(3,3)^T$. Direct multiplication by the original matrix gives the same answer.

</details>
</div>

### 3. Thinking: select the structure you need

Choose a useful starting decomposition for each task, and explain your choice: (a) solve a nonsingular SPD system; (b) fit three parameters to 100 observations with a full-column-rank design matrix; (c) identify a direction that a matrix nearly destroys.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Ask whether you need a triangular solve, perpendicular model directions, or stretch factors.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

(a) Cholesky exploits the SPD structure. (b) QR supplies an orthonormal model basis and a triangular least-squares solve without forming normal equations. (c) SVD identifies directions with small singular values. These choices follow the task and assumptions; several decompositions may exist for the same matrix.

</details>
</div>

### 4. Thinking: a small stretch can cause a large inverse response

Let $A=\operatorname{diag}(5,0.01)$. An output perturbation of size $0.001$ affects either the first or second coordinate. What change in the corresponding input coordinate is needed to account for it?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Reverse each stretch by dividing by its scale factor.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

The first coordinate changes by $0.001/5=0.0002$. The second changes by $0.001/0.01=0.1$, which is 500 times larger. A weakly transmitted direction is difficult to recover accurately from perturbed output.

</details>
</div>

### 5. Logic: why the intermediate dimension bounds rank

Suppose $A=BC$ with $B\in\mathbb R^{m\times r}$ and $C\in\mathbb R^{r\times n}$. Prove $\operatorname{rank}(A)\le r$. What does this imply if $A$ has rank greater than $r$?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Every column of the product is a linear combination of columns of B.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

For every vector $x$, $Ax=B(Cx)$ lies in the column space of $B$. Thus $\operatorname{Col}(A)\subseteq\operatorname{Col}(B)$ and $\operatorname{rank}(A)\le\operatorname{rank}(B)\le r$. An exact factorization through only $r$ intermediate coordinates is impossible when $\operatorname{rank}(A)>r$.

</details>
</div>

### 6. Logic: why factors need normalization

If $A=BC$ and $\alpha\ne0$, show that $A=(\alpha B)(\alpha^{-1}C)$. Does this prove every structured decomposition is nonunique?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Distinguish an unrestricted product from a product whose factors have extra conditions.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

A **scalar** is a single number, here $\alpha$. Multiplying one factor by $\alpha$ and the other by $1/\alpha$ cancels the scaling and gives the same product. It proves nonuniqueness for unrestricted nonzero factors. It does not preserve every normalization: multiplying a unit lower triangular factor by $\alpha\ne1$ destroys its unit diagonal, for example. Uniqueness theorems concern factors satisfying all the stated conditions.

</details>
</div>

### 7. Applied: combine repeated measurements

A sensor reports $2$, $3$, and $7$ for one constant quantity. With equal observation weights, use reduced QR for $B=(1,1,1)^T$ to find the least-squares estimate. What are the residuals?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Use $q=B/\sqrt3$, $r=\sqrt3$, and solve $rx=q^Tb$.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

$q^Tb=12/\sqrt3$, so $x=4$. The residuals are $(-2,-1,3)^T$. Their sum is zero, so the residual is perpendicular to the model column. Equal weighting makes this estimate the arithmetic mean; different weights would change the objective.

</details>
</div>

### 8. Applied: undo a graphics transformation

A graphics pipeline first scales horizontal coordinates by $2$, then applies horizontal shear $k=1/2$. A point $(1,2)^T$ is transformed. Find its output and the order of operations needed to recover the input.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

A forward sequence is undone in reverse order.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

Scaling gives $(2,2)^T$; shearing gives $(3,2)^T$. To undo the pipeline, first subtract half the vertical coordinate from the horizontal coordinate, giving $(2,2)^T$, then divide the horizontal coordinate by $2$. Algebraically, $(BC)^{-1}=C^{-1}B^{-1}$, whose rightmost factor undoes $B$ first.

</details>
</div>

## Further learning

- [LAPACK: orthogonal factorizations](https://www.netlib.org/lapack/lug/node39.html): connect length-preserving transformations to least squares.
- [LAPACK: QR](https://www.netlib.org/lapack/lug/node40.html) and [SVD](https://www.netlib.org/lapack/lug/node32.html): compare the factor dimensions and the different directions they reveal.
- [LU]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}) and [Cholesky]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}): continue with elimination records, positive energy, and their dedicated practice sets.

## Related pages

- [QR factorization]({{ '/wiki/linear-algebra/qr-factorization/' | relative_url }})
- [Gram–Schmidt orthogonalization]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/' | relative_url }})

- [Vector norms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }})
- [Matrix norms]({{ '/wiki/linear-algebra/matrix-norm/' | relative_url }})
- [Quadratic form]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }})

- [Symmetric positive definite matrix]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }})

- [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }})
- [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }})

## References

1. Anderson, E., et al. (1999). *LAPACK Users' Guide*, third edition. SIAM. [Linear Equations](https://www.netlib.org/lapack/lug/node38.html).
2. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [Orthogonal Factorizations and Linear Least Squares Problems](https://www.netlib.org/lapack/lug/node39.html) and [QR Factorization](https://www.netlib.org/lapack/lug/node40.html).
3. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [QR Factorization with Column Pivoting](https://www.netlib.org/lapack/lug/node42.html).
4. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [Singular Value Decomposition](https://www.netlib.org/lapack/lug/node32.html).
5. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [Error Bounds for the Symmetric Eigenproblem](https://www.netlib.org/lapack/lug/node89.html), opening definition of the eigendecomposition.
6. LAPACK (2011). [DGETRF](https://www.netlib.org/lapack/double/dgetrf.f) and [DPOTRF](https://www.netlib.org/lapack/double/dpotrf.f), version 3.3.1. Routine documentation for LU and Cholesky factors.

7. OpenStax. *College Algebra 2e*. [Matrices and Matrix Operations](https://openstax.org/books/college-algebra-2e/pages/7-5-matrices-and-matrix-operations) and [Solving Systems with Inverses](https://openstax.org/books/college-algebra-2e/pages/7-7-solving-systems-with-inverses).
8. Strang, G. (2018). MIT OpenCourseWare, *18.065*. [The Column Space of A Contains All Vectors Ax](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-1-the-column-space-of-a-contains-all-vectors-ax/).
