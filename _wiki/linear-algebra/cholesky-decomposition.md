---
title: Cholesky decomposition
subject: Linear Algebra
interactive_examples: true
description: Understand how geodetic network adjustment led to Cholesky factorization, how its purpose developed, and how to compute it.
last_modified_at: 2026-10-16
---

## Definition

For a real **[symmetric positive-definite]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }})** (SPD) matrix $A\in\mathbb{R}^{n\times n}$, the **Cholesky decomposition**, or **Cholesky factorization**, is

$$
A=LL^T,
$$

where $L$ is lower triangular with strictly positive diagonal entries. This factor exists and is unique. Equivalently, $A=R^TR$ with $R=L^T$ upper triangular. SPD means

$$
A^T=A,\qquad x^TAx>0\quad\text{for every }x\ne0.
$$

See van de Geijn's [definition and existence theorem](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). For complex Hermitian positive-definite matrices, the form is $A=LL^{\ast}$, where $L^{\ast}$ is the conjugate transpose. [LAPACK's ZPOTRF documentation](https://www.netlib.org/lapack/complex16/zpotrf.f) gives the complex convention.

This is a structured [matrix decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}). Unlike the unit lower triangular factor in [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}), the Cholesky factor generally has diagonal entries other than $1$.

## Intuition: positive energy becomes ordinary squared length

The question behind Cholesky is: **can we rewrite a positive quadratic expression as a sum of squares, computing one square at a time?** We will do that for a small example, then collect the coefficients into a matrix. That construction will give us the factor $L$.

A **[quadratic form]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }})** is the scalar $q(x)=x^TAx$. Think of it as an energy or penalty assigned to a displacement $x$. For the real symmetric matrix <span class="math-inline" markdown="0">\(A=\begin{pmatrix}4&2\\2&3\end{pmatrix}\)</span>,

$$
q(x)=4x_1^2+4x_1x_2+3x_2^2.
$$

### What a cross term means

A **cross term** multiplies two different variables together. Here it is $4x_1x_2$. In contrast, $4x_1^2$ involves only $x_1$, and $3x_2^2$ involves only $x_2$.

The cross term describes an interaction: its contribution depends on both variables and their relative signs. Compare two inputs:

$$
q(1,1)=4+4+3=11,\qquad q(1,-1)=4-4+3=3.
$$

The squared terms have the same values in both cases. Only the cross term changes sign. This is what it means to say that the expression *couples* the coordinates: their joint contribution cannot be described using only separate squares of $x_1$ and $x_2$.

You can also see where the coefficient comes from in the matrix product. The two off-diagonal entries contribute $2x_1x_2$ and $2x_2x_1$, which add to $4x_1x_2$. The [quadratic form page]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }}) explains this correspondence between matrix entries and terms.

### What completing the square means

**Completing the square** means rewriting a quadratic expression using a squared quantity, while keeping its value unchanged. Start with

$$
(x+t)^2=x^2+2tx+t^2.
$$

For example, to rewrite $x^2+6x$, choose $t=3$ so that $2tx=6x$. The square supplies an extra $9$, so subtract it:

$$
x^2+6x=x^2+6x+9-9=(x+3)^2-9.
$$

Adding and subtracting the same amount preserves the expression. See [OpenStax's explanation of completing the square](https://openstax.org/books/college-algebra-2e/pages/2-5-quadratic-equations).

For our two-variable example, notice that

$$
(2x_1+x_2)^2=4x_1^2+4x_1x_2+x_2^2.
$$

This square accounts for the first two terms and **one of the three copies of $x_2^2$**. Two copies remain, giving

$$
q(x)=(2x_1+x_2)^2+2x_2^2=(2x_1+x_2)^2+(\sqrt2x_2)^2.
$$

The expression is now a sum of squares of combinations of the original variables.

### Why completing squares in order creates a triangular matrix

The important choice is to **finish with one variable before moving to the next**. We first collect every term containing $x_1$ into the square $(2x_1+x_2)^2$. Subtracting that square from the original expression leaves

$$
q(x)-(2x_1+x_2)^2=2x_2^2.
$$

There is no $x_1$ left in this remainder. Consequently, the next square, $(\sqrt2x_2)^2$, has an $x_1$ coefficient of zero. The coefficient rows of the two squares therefore have the pattern

$$
\begin{bmatrix}
\text{coefficient of }x_1&\text{coefficient of }x_2\\
0&\text{coefficient of }x_2
\end{bmatrix}.
$$

With three variables, the same procedure first absorbs all terms containing $x_1$, leaving a quadratic expression in $x_2,x_3$. Completing the next square absorbs all terms containing $x_2$ from that remainder, leaving only a multiple of $x_3^2$. The resulting combinations have the form

$$
y_1=r_{11}x_1+r_{12}x_2+r_{13}x_3,\qquad
y_2=r_{22}x_2+r_{23}x_3,\qquad
y_3=r_{33}x_3.
$$

Here $r_{ij}$ denotes the coefficient of $x_j$ in the $i$th combination. Each later combination omits the variables already absorbed into earlier squares. Those missing coefficients are precisely the zeros below the diagonal of an **upper triangular** coefficient matrix. Transposing it gives the lower triangular factor $L$.

Thus triangularity comes from completing squares **in variable order**. An arbitrary sum-of-squares representation need not have this pattern. Positive definiteness ensures that each successive remainder supplies a positive coefficient for the next square; the proof below explains why this process can continue.

### How Cholesky records these combinations

Define two new quantities:

$$
y_1=2x_1+x_2,\qquad y_2=\sqrt2x_2.
$$

Then $q(x)=y_1^2+y_2^2$, the ordinary squared length of the vector $y$. For instance, $x=(1,1)^T$ gives $y=(3,\sqrt2)^T$, so the same value $11$ becomes $3^2+(\sqrt2)^2$.

Collect the coefficients of these two combinations into a matrix, which we will call $R$:

$$
\begin{bmatrix}y_1\\y_2\end{bmatrix}
=\underbrace{\begin{bmatrix}2&1\\0&\sqrt2\end{bmatrix}}_{R}
\begin{bmatrix}x_1\\x_2\end{bmatrix}.
$$

The entries are the coefficients in the two equations for $y$. The zero below the diagonal records the step we just took: after absorbing all $x_1$ terms into the first square, the second square uses only $x_2$. This is the upper triangular pattern described above.

Now multiply its transpose by itself:

$$
R^TR=
\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}
\begin{bmatrix}2&1\\0&\sqrt2\end{bmatrix}
=\begin{bmatrix}4&2\\2&3\end{bmatrix}=A.
$$

**We have performed the factorization by completing the square.** To use the lower triangular convention in the definition, name the transpose $L=R^T$:

$$
L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix},\qquad A=LL^T.
$$

This is where $L$ comes from: its columns contain the coefficients of the squares we just constructed. Cholesky carries out this idea systematically for an SPD matrix, choosing positive diagonal coefficients. The general algorithm below makes that sequential construction precise; see [the FLAME definition and algorithm](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

This gives an order for recovering the original variables. First recover $x_2$ from the second equation, then substitute it into the first:

$$
x_2=\frac{y_2}{\sqrt2},\qquad x_1=\frac{y_1-x_2}{2}.
$$

The pair $(y_1,y_2)$ is another way to describe the same input, so we call it a new set of **coordinates**. Calculating $y$ from $x$ is a **coordinate transformation**. The word *triangular* describes the matrix and its dependency pattern; it does not describe a special kind of coordinate or a triangular shape.

In matrix notation, the sum of squares is

$$
x^TAx=\lVert L^Tx\rVert_2^2.
$$

Here $L^Tx=y$, and the squared-norm notation on the right means $y_1^2+y_2^2$. Since we can recover $x$ from $y$, a nonzero $x$ cannot give $y=(0,0)^T$. At least one square is therefore positive. This explains the SPD condition in this example; see [Higham's discussion of positive-definite quadratic forms](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/).

This also connects the factorization to the contour plots below. In the original $x$ coordinates, $q(x)=4$ is an ellipse. After applying $y=L^Tx$, the same condition becomes $y_1^2+y_2^2=4$, a circle of radius $2$. The factor supplies the change of coordinates that turns the elliptical energy levels into ordinary circles. The contour shape motivates this goal; completing the square tells us how to achieve it.

### Positivity concerns directions rather than individual entries

Positive definite does **not** mean that every entry of the matrix is positive. For example, <span class="math-inline" markdown="0">\(\begin{pmatrix}2&-1\\-1&2\end{pmatrix}\)</span> gives

$$
x^TAx=(x_1-x_2)^2+x_1^2+x_2^2>0\qquad(x\ne0).
$$

Conversely, <span class="math-inline" markdown="0">\(\begin{pmatrix}1&2\\2&1\end{pmatrix}\)</span> has positive entries but gives $x^TAx=-2$ for $x=(1,-1)^T$. The condition concerns every direction, not the signs of individual entries.

{% include image.html src="/assets/images/wiki/cholesky-energy.svg" alt="Three contour plots compare positive definite energy with nested ellipses, semidefinite energy with a flat vertical direction, and indefinite energy with positive and negative contours." caption="Read this as a map of input vectors x = (x₁, x₂): every point on a curve labelled q(x) = 4 has energy xᵀAx = 4, not coordinate 4. All three panels use blue solid curves at q(x) = 1, 2, 4. The SPD curves are closed ellipses around the minimum at the origin. For q(x) = x₁², each level is a pair of vertical lines: q(x) = 4 means x₁ = ±2, regardless of x₂. The indefinite panel adds orange dashed curves at q(x) = −1, −2, −4; gray lines mark q(x) = 0." %}

The semidefinite example has a direction that costs no energy. The indefinite example has a direction with negative energy, so it cannot equal a squared Euclidean length for all $x$. These geometric differences correspond to zero or invalid square-root pivots in the usual algorithm.

### Another way to read the factor we constructed

We already found $L$ from the completed squares. We can now read its entries in another way to understand the computation. Matrix multiplication takes a row of $L$ and a column of $L^T$, which is a row of $L$ turned sideways. Thus each entry of $LL^T$ is a **dot product** of two rows of $L$ (multiply corresponding coordinates and add). Calling those rows $r_1,\ldots,r_n$, we have $a_{ij}=r_i\cdot r_j$. In our example,

$$
r_1=(2,0),\qquad r_2=(1,\sqrt2).
$$

Their squared lengths are $4$ and $3$, and their dot product is $2$. These are precisely the two diagonal entries and the off-diagonal entry of $A$. Triangularity lets us construct these vectors one coordinate at a time: give the first row its length, match the next row's dot product with it, then choose the remaining coordinate to supply the remaining squared length. This is the Gram-matrix interpretation of $LL^T$; see [the FLAME definition and algorithm](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

### The connection to orthogonalization

If $B=QR$ is a reduced [QR factorization]({{ '/wiki/linear-algebra/qr-factorization/' | relative_url }}) with independent columns and positive diagonal $R$, then

$$
B^TB=R^TQ^TQR=R^TR.
$$

Thus $R^T$ is the lower Cholesky factor of the Gram matrix $B^TB$. [Gram–Schmidt]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/' | relative_url }}) constructs $Q$ by removing overlapping components and records their coefficients in $R$. This identity links the factorizations in exact arithmetic; the [QR accuracy discussion]({{ '/wiki/linear-algebra/qr-factorization/#the-connection-to-cholesky-and-the-accuracy-trap' | relative_url }}) explains why forming the Gram matrix first can lose information through rounding.

### A triangular square root has a specific meaning

$A=LL^T$ resembles $a=\sqrt a\sqrt a$, but generally $L^2\ne A$. The transpose matters. In our example, the upper-right entry of $L^2$ is zero, while $a_{12}=2$. A symmetric matrix square root satisfying $S^2=A$ is a different factorization. Cholesky chooses a triangular factor because it supports sequential computation and solves.

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

### Each diagonal entry supplies what is still missing

For a two-by-two matrix, write

$$
A=\begin{bmatrix}a&b\\b&c\end{bmatrix},\qquad
L=\begin{bmatrix}\ell_{11}&0\\\ell_{21}&\ell_{22}\end{bmatrix}.
$$

Matching $LL^T$ to $A$ yields three requirements:

$$
\ell_{11}^2=a,\qquad \ell_{11}\ell_{21}=b,\qquad
\ell_{21}^2+\ell_{22}^2=c.
$$

First choose $\ell_{11}=\sqrt a$. Next choose $\ell_{21}=b/\sqrt a$ to match the shared component. Finally choose $\ell_{22}=\sqrt{c-b^2/a}$ to supply the squared length that the first coordinate has not supplied.

For $a=4$, $b=2$, $c=3$, the second row needs total squared length $3$. Its first coordinate is $1$, already contributing $1$. The remaining coordinate must contribute $2$, so it is $\sqrt2$. This makes the subtraction inside the recurrence concrete: subtract the contribution already accounted for, then take the square root of what remains.

The same remainder appears when completing the square:

$$
ax_1^2+2bx_1x_2+cx_2^2
=a\left(x_1+\frac ba x_2\right)^2+\left(c-\frac{b^2}{a}\right)x_2^2.
$$

For $a>0$, a positive remainder means the second direction still has positive energy. A zero remainder leaves a flat direction. A negative remainder gives a negative-energy direction. In higher dimensions, the [Schur complement]({{ '/wiki/linear-algebra/schur-complement/' | relative_url }}) is the matrix version of this remainder.

### Why the square roots are positive

Partition an SPD matrix as

$$
A=\begin{bmatrix}\alpha&c^T\\c&B\end{bmatrix}.
$$

Here $\alpha>0$. For nonzero $z$, set $x=(-c^Tz/\alpha,z)^T$. Then

$$
0<x^TAx=z^T\left(B-\frac{cc^T}{\alpha}\right)z.
$$

Thus the [Schur complement]({{ '/wiki/linear-algebra/schur-complement/' | relative_url }}) $B-cc^T/\alpha$ is SPD. Inductively factor it as $KK^T$, and obtain

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

## A second example: shared and independent variation

Let $z_1,z_2$ be independent random variables with mean zero and variance one, and set

$$
u_1=2z_1,\qquad u_2=z_1+\sqrt2z_2.
$$

Then $\operatorname{Var}(u_1)=4$, $\operatorname{Var}(u_2)=1+2=3$, and $\operatorname{Cov}(u_1,u_2)=2$. Both outputs share $z_1$, which produces covariance. The independent $z_2$ supplies the remaining variance of the second output. In matrix notation, $u=Lz$ and $\operatorname{Cov}(u)=LL^T=A$. See [Stata's covariance-transformation explanation](https://www.stata.com/support/faqs/statistics/multivariate-normal-observations/).

{% include image.html src="/assets/images/wiki/cholesky-covariance.svg" alt="A unit circle in input coordinates is mapped by L to a tilted ellipse in output coordinates; two marked input directions map to the two columns of L." caption="L maps the unit circle to an ellipse. This illustrates the geometry of covariance generation, rather than a random sample. Its boundary satisfies uᵀA⁻¹u = 1; the earlier energy contours satisfy xᵀAx = constant." %}

Reading the same factor in different ways gives different intuitions: $L^T$ removes the coupling from a quadratic energy, while $L$ introduces a desired covariance into independent inputs. The algebraic identity is the same, but the direction of the transformation and the problem being solved differ.

### What a nearly zero remainder tells us

For

$$
A_\varepsilon=\begin{bmatrix}1&1\\1&1+\varepsilon\end{bmatrix},\qquad
L=\begin{bmatrix}1&0\\1&\sqrt\varepsilon\end{bmatrix},
$$

positive $\varepsilon$ gives an SPD matrix. At $\varepsilon=0$, the two rows represent the same underlying direction and the matrix is singular. For small positive $\varepsilon$, the second independent contribution is tiny: the system is close to losing a direction. A triangular solve divides by $\sqrt\varepsilon$, explaining why small changes can matter greatly. This example illustrates the distinction between existence and numerical sensitivity discussed below.

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

## History

### The original problem was adjusting a measured network

André-Louis Cholesky was a French artillery officer working in the army's geographic service. When the French triangulation network was being revised, officers needed ways to adjust the measured network with greater speed, convenience, and precision. Benoît's account of Cholesky's work identifies this practical problem as the setting for his least-squares calculation procedure. See [Benoît's account, translated by Richard W. Cottle](https://netlib.org/na-digest-html/90/v90n07.html#5).

What does *adjusting a network* mean? Consider a simplified surveying example in a flat plane. Three measured triangle angles might add up to $180^\circ+\varepsilon$, although the geometric condition requires $180^\circ$. Corrections $v_1,v_2,v_3$ must satisfy

$$
v_1+v_2+v_3=-\varepsilon.
$$

There are infinitely many possible corrections. If the observations have equal weight, minimizing $v_1^2+v_2^2+v_3^2$ gives $v_1=v_2=v_3=-\varepsilon/3$. A network has many conditions sharing the same observations, so the corrections must be calculated together. This example illustrates the adjustment problem; an actual geodetic model also accounts for the Earth's curvature and the geometry of the network.

The original question was therefore: **how can we calculate small corrections that make a whole measured network consistent, with a procedure people can carry out reliably?** Least squares specifies the desired corrections. Cholesky's contribution concerns the numerical work needed to obtain them.

### Why this produced normal equations

The title of Benoît's 1924 paper refers to *fewer equations than unknowns*. This describes the condition equations for observation corrections, rather than the overdetermined regression problem commonly used to introduce least squares today. [De Falguerolles, §5.2](https://www.numdam.org/item/JSFS_2019__160_2_83_0.pdf#page=7), explains this formulation.

In modern notation, let $v\in\mathbb R^m$ contain corrections and let $C\in\mathbb R^{p\times m}$ contain $p<m$ independent linearized conditions. For equal observation weights, solve

$$
\min_v\frac12 v^Tv\qquad\text{subject to }Cv=d.
$$

Introduce Lagrange multipliers $\lambda\in\mathbb R^p$:

$$
\mathcal L(v,\lambda)=\frac12v^Tv-\lambda^T(Cv-d).
$$

Stationarity and the constraints give

$$
v=C^T\lambda,\qquad CC^T\lambda=d.
$$

Thus an underdetermined correction problem becomes a square system for the multipliers. Its coefficient matrix $N=CC^T$ is symmetric. Full row rank makes it positive definite, since

$$
z^TNz=\lVert C^Tz\rVert_2^2>0\qquad(z\ne0).
$$

For positive observation weights collected in a diagonal matrix $W$, minimizing $\frac12v^TWv$ instead gives $N=CW^{-1}C^T$ and $v=W^{-1}C^T\lambda$. This follows from the same stationarity calculation.

In regression, the familiar route is instead

$$
\min_x\lVert Bx-b\rVert_2^2
\quad\Longrightarrow\quad B^TBx=B^Tb.
$$

Both routes produce a Gram matrix, positive definite under the appropriate rank assumption. The historical distinction is what the unknowns represent: observation corrections and their multipliers in network adjustment, or fitted parameters in regression. See [de Falguerolles, §§5.1–5.2](https://www.numdam.org/item/JSFS_2019__160_2_83_0.pdf#page=6).

### The 1910 method organized the solve into two stages

Cholesky's surviving manuscript is dated **2 December 1910**, establishing that the method existed by then. The exact invention date is unknown. See [Brezinski (2005), p. 217](https://www.numdam.org/item/RHM_2005__11_2_205_0.pdf#page=13).

The following uses modern notation for the construction described in [Brezinski (2006), pp. 283–286](https://doi.org/10.1007/s11075-006-9059-x). Instead of solving $N\lambda=d$ directly, find a lower triangular $L$ such that

$$
N=LL^T.
$$

Introduce an intermediate vector $y=L^T\lambda$. The calculation becomes

$$
Ly=d,\qquad L^T\lambda=y.
$$

The first equation gives $y_1$, then $y_2$, and so on. The second gives $\lambda_p$, then $\lambda_{p-1}$, and so on. Matching entries of $N$ and $LL^T$ supplies the square-root recurrences given earlier in this article. The factorization organizes a coupled system into successive scalar calculations.

Cholesky also described the calculation layout, use of a Dactyle mechanical calculator, and checks for mistakes. These details mattered because the work was performed by people, including soldiers with limited mathematical training. His discussion already included finite-precision errors; concern for numerical reliability was present before electronic computers. See [Brezinski (2006), pp. 285–286](https://doi.org/10.1007/s11075-006-9059-x).

### Publication in 1924 and wider adoption after 1944

Cholesky died in 1918. Commandant Benoît published the method in **1924**, six years later. The publication date differs from the manuscript date. See [Cottle's translation and publication note](https://netlib.org/na-digest-html/90/v90n07.html#5).

Henry Jensen's **1944** comparison of methods for normal equations reached John Todd, who used it in his **1946** course at King's College London. Leslie Fox brought the method to the National Physical Laboratory. Work by Fox, Huskey, Wilkinson, and Turing in **1948** developed its numerical analysis, followed by dissemination through textbooks. See [Brezinski (2005), pp. 216–217](https://www.numdam.org/item/RHM_2005__11_2_205_0.pdf#page=12). This connects with the postwar accuracy questions discussed in the [LU history]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }}).

### The scope broadened and the accuracy question became more precise

Cholesky's manuscript already considers general square systems. Its construction, written in modern notation for nonsingular $B$, is

$$
Bx=b,\qquad x=B^T\lambda
\quad\Longrightarrow\quad BB^T\lambda=b.
$$

Solve the symmetric system for $\lambda$, then recover $x$. See [Cholesky's manuscript, systems I–III, pp. 221–223](https://www.numdam.org/item/RHM_2005__11_2_205_0.pdf#page=17).

Modern numerical analysis distinguishes algebraic equivalence from computational accuracy. For nonsingular square $B$,

$$
\kappa_2(BB^T)=\kappa_2(B^TB)=\kappa_2(B)^2.
$$

Forming normal equations can therefore make the computation much more sensitive to rounding. A stable Cholesky solve of the resulting matrix does not undo this effect. QR or SVD can avoid forming the Gram matrix when that loss of accuracy matters. See [ALAFF, §4.2.5](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html) and [LAPACK's least-squares methods](https://www.netlib.org/lapack/lug/node27.html).

The accuracy question also became more explicit: can a computed solution be interpreted as the exact solution of a nearby problem, and how does conditioning turn that perturbation into solution error? [LAPACK's backward-error discussion](https://www.netlib.org/lapack/lug/node81.html) expresses these as separate quantities. This refines the original aim of reliable calculation rather than replacing it.

Electronic computing added another implementation problem: moving data through memory efficiently. [LAPACK](https://www.netlib.org/lapack/) reorganizes algorithms into blocks so that much of the work uses matrix-matrix operations. The identity $A=LL^T$ remains the same, while the arrangement of the computation changes with the machine.

### The factor became useful beyond solving equations

A modern Cholesky factor can also represent a covariance structure. Suppose $\Sigma=LL^T$ is a positive-definite covariance matrix and $z$ has independent standard normal components. Then

$$
u=\mu+Lz,\qquad
\operatorname{Cov}(u)=LIL^T=\Sigma.
$$

Here the factor generates correlated observations rather than solving for unknowns. [Stata's explanation of multivariate-normal simulation](https://www.stata.com/support/faqs/statistics/multivariate-normal-observations/) gives this construction. It demonstrates how the same triangular factor acquired additional uses without changing its mathematical definition.

The historical thread is thus a continuing problem of usable computation: first, obtain least-squares corrections for measured networks; then, establish precise accuracy guarantees and efficient implementations; and, in additional applications, use the factor itself as a representation of a positive-definite matrix.

## Interactive example: vary the remaining energy

The experiment uses symmetric <span class="math-inline" markdown="0">\(A=\begin{pmatrix}a&b\\b&c\end{pmatrix}\)</span>. Predict the sign of $c-b^2/a$ before changing the shared coefficient $b$. When the factorization fails, find a direction with zero or negative energy. A failure here is a consequence of the chosen matrix, rather than a reason to take the square root of a negative number. The calculations follow the [Cholesky recurrences in the FLAME notes](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

{% include wiki-lab.html kind="cholesky" title="Explore Cholesky pivots and quadratic energy" plot_description="Sampled quadratic energy with positive and negative regions, an SPD unit-energy contour, and a chosen direction." %}

## Practice problems

Try each problem before opening its hint or solution. The first two build hand-calculation fluency, the next two ask you to interpret or choose an approach, the next two develop logical reasoning, and the final two connect the concept to practical work. These are original exercises; the references support the mathematical concepts they use.

### 1. Hand calculation: factor and solve

Find $L$ with positive diagonal, solve $Ax=b$, and compute $\det A$ for

$$
A=\begin{bmatrix}9&3\\3&5\end{bmatrix},\qquad b=\begin{bmatrix}12\\8\end{bmatrix}.
$$

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

First match the top-left square, then the off-diagonal product, then the remaining squared length.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

$l_{11}=3$, $l_{21}=1$, and $l_{22}=\sqrt{5-1}=2$, so <span class="math-inline" markdown="0">\(L=\begin{pmatrix}3&0\\1&2\end{pmatrix}\)</span>. Forward substitution gives $y=(4,2)^T$; backward substitution gives $x=(1,1)^T$. The determinant is $(3\cdot2)^2=36$.

</details>
</div>

### 2. Hand calculation: construct three rows

Compute the Cholesky factor and determinant of

$$
A=\begin{bmatrix}4&2&2\\2&5&3\\2&3&6\end{bmatrix}.
$$

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

The first column is $(2,1,1)^T$. Each later diagonal supplies the squared length not already supplied.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

The second diagonal is $\sqrt{5-1}=2$. Then $l_{32}=(3-1\cdot1)/2=1$ and $l_{33}=\sqrt{6-1-1}=2$:

$$
L=\begin{bmatrix}2&0&0\\1&2&0\\1&1&2\end{bmatrix}.
$$

Multiplying $LL^T$ recovers $A$. Its determinant is $(2\cdot2\cdot2)^2=64$.

</details>
</div>

### 3. Thinking: diagnose the failed square root

Compare <span class="math-inline" markdown="0">\(A_1=\begin{pmatrix}1&2\\2&5\end{pmatrix}\)</span> and <span class="math-inline" markdown="0">\(A_2=\begin{pmatrix}1&2\\2&3\end{pmatrix}\)</span>. Which admits positive-diagonal Cholesky? For the other, exhibit a negative-energy direction.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Compute the remainder $c-b^2/a$, and try $x=(-b/a,1)^T$.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

For $A_1$, the remainder is $5-4=1$, so <span class="math-inline" markdown="0">\(L=\begin{pmatrix}1&0\\2&1\end{pmatrix}\)</span>. For $A_2$, it is $3-4=-1$. Taking $x=(-2,1)^T$ gives $x^TA_2x=-1$, so $A_2$ is indefinite and cannot equal $LL^T$ with real $L$.

</details>
</div>

### 4. Thinking: interpret correlation near one

For the covariance matrix <span class="math-inline" markdown="0">\(A_\rho=\begin{pmatrix}1&\rho\\\rho&1\end{pmatrix}\)</span> with $0\le\rho<1$, find $L$. Interpret its second diagonal when $\rho=0.9$ and as $\rho\to1$.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Write the second output as a shared component plus an independent component.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

<span class="math-inline" markdown="0">\(L=\begin{pmatrix}1&0\\\rho&\sqrt{1-\rho^2}\end{pmatrix}\)</span>. At $\rho=0.9$, the independent contribution has coefficient $\sqrt{0.19}\approx0.43589$. As $\rho\to1$, it tends to zero: the outputs become identical in the limiting construction. At $\rho=1$, the covariance matrix is singular, so the positive-diagonal theorem no longer applies.

</details>
</div>

### 5. Logic: prove positivity and examine uniqueness

If $L$ is an invertible real lower triangular matrix, prove $LL^T$ is SPD. Why does the uniqueness theorem require a positive diagonal?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Use $x^TLL^Tx=\lVert L^Tx
Vert^2$, then try replacing $L$ with $-L$.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

$LL^T$ is symmetric. For nonzero $x$, invertibility implies $L^Tx\ne0$, so its squared norm is positive. Without fixing signs, $(-L)(-L)^T=LL^T$ gives another lower triangular factor. Requiring positive diagonal selects one factor. Existence and full uniqueness under that condition are the theorem stated earlier.

</details>
</div>

### 6. Logic: identify the factor of a leading block

If $A=LL^T$ is an SPD Cholesky factorization, show that the upper-left $k\times k$ block of $L$ is the Cholesky factor of the upper-left $k\times k$ block of $A$.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Partition L into blocks and use its zero upper-right block.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

Write

$$
L=\begin{bmatrix}L_{11}&0\\L_{21}&L_{22}\end{bmatrix}.
$$

The upper-left block of $LL^T$ is $L_{11}L_{11}^T$. $L_{11}$ is lower triangular with positive diagonal, so it is the normalized Cholesky factor of $A_{11}$. This also explains why the computation proceeds through leading blocks.

</details>
</div>

### 7. Applied: generate correlated sensor errors

Two sensors need zero-mean errors with covariance <span class="math-inline" markdown="0">\(\Sigma=\begin{pmatrix}4&1\\1&1\end{pmatrix}\)</span>. Construct the errors from independent zero-mean, unit-variance variables $z_1,z_2$. Verify the two variances, covariance, and correlation.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Find L and use $u=Lz$. Independence removes the cross terms involving both z variables.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

Use <span class="math-inline" markdown="0">\(L=\begin{pmatrix}2&0\\1/2&\sqrt3/2\end{pmatrix}\)</span>, so $u_1=2z_1$ and $u_2=z_1/2+\sqrt3z_2/2$. The variances are $4$ and $1/4+3/4=1$; covariance is $2\cdot1/2=1$. Correlation is $1/(2\cdot1)=1/2$. Gaussian z variables additionally give a jointly Gaussian output, but these covariance calculations need only the stated moments and independence.

</details>
</div>

### 8. Applied: minimize a quadratic penalty

An optimization step minimizes

$$
f(x)=\frac12x^TAx-b^Tx,\qquad
A=\begin{bmatrix}2&-1\\-1&2\end{bmatrix},\qquad b=\begin{bmatrix}1\\0\end{bmatrix}.
$$

Derive the system for its minimizer and solve it with Cholesky. Why is the stationary point the unique minimum?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Differentiate the quadratic, and use positive definiteness to interpret the curvature.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

$\nabla f(x)=Ax-b$, so solve $Ax=b$. Here

$$
L=\begin{bmatrix}\sqrt2&0\\-1/\sqrt2&\sqrt{3/2}\end{bmatrix}.
$$

$Ly=b$ gives $y_1=1/\sqrt2$, $y_2=1/\sqrt6$. Then $L^Tx=y$ gives $x_2=1/3$ and $x_1=2/3$. For any nonzero displacement $h$ from this stationary point, the change in the objective is $\frac12h^TAh>0$. Hence this is the unique minimum.

</details>
</div>

## Further learning

- [FLAME: Notes on Cholesky Factorization](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html): study the full proof, algorithm, operation count, and accompanying exercises.
- [Higham: What Is a Symmetric Positive Definite Matrix?](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/): connect energy, eigenvalues, and positivity conditions.
- [ALAFF: why normal equations can lose accuracy](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html): understand why a stable factorization is only one part of a reliable least-squares computation.
- [Stata: multivariate-normal simulation](https://www.stata.com/support/faqs/statistics/multivariate-normal-observations/): connect exercise 7 to a complete covariance-generation example.

## Related pages

- [QR factorization]({{ '/wiki/linear-algebra/qr-factorization/' | relative_url }})
- [Gram–Schmidt orthogonalization]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/' | relative_url }})

- [Quadratic form]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }})

- [Symmetric positive definite matrix]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }})

- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})
- [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }})

## References

1. van de Geijn, R. A. (2011). [*Notes on Cholesky Factorization*](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html). University of Texas at Austin. Definition, proof, algorithm, and operation count.
2. Higham, N. J. (2020, August 11). [*What Is a Cholesky Factorization?*](https://nhigham.com/2020/08/11/what-is-a-cholesky-factorization/). Determinant identity, numerical stability, and semidefinite extensions.
3. Anderson, E., et al. (1999). *LAPACK Users' Guide*, third edition. SIAM. [Linear Equations](https://www.netlib.org/lapack/lug/node38.html). Real and complex factorizations and triangular solves.
4. LAPACK (2011). [ZPOTRF](https://www.netlib.org/lapack/complex16/zpotrf.f) and [DPOTRS](https://www.netlib.org/lapack/double/dpotrs.f), version 3.3.1. Complex Cholesky factorization and solves using an existing factor.
5. Cholesky, A.-L. (1910, December 2). *Sur la résolution numérique des systèmes d'équations linéaires*. Manuscript reproduced in [Brezinski (2005), §4, pp. 221–229](https://www.numdam.org/item/RHM_2005__11_2_205_0.pdf#page=17).
6. Benoît, Commandant (1924). *Note sur une méthode de résolution des équations normales provenant de l'application de la méthode des moindres carrés à un système d'équations linéaires en nombre inférieur à celui des inconnues (Procédé du Commandant Cholesky)*. Bulletin géodésique, 2, 67–77. [DOI](https://doi.org/10.1007/BF03031308). Publication history described in Brezinski (2005).
7. Benoît, Commandant. Account of Cholesky's life and geodetic work, [translated by R. W. Cottle in 1975 and circulated in NA Digest, February 18, 1990](https://netlib.org/na-digest-html/90/v90n07.html#5).
8. Brezinski, C. (2005). [*La méthode de Cholesky*](https://www.numdam.org/articles/10.24033/rhm.30/). Revue d'histoire des mathématiques, 11(2), 205–238. [Full text](https://www.numdam.org/item/RHM_2005__11_2_205_0.pdf). Historical investigation and reproduction of the original manuscript.
9. Brezinski, C. (2006). [*The life and work of André Cholesky*](https://doi.org/10.1007/s11075-006-9059-x). Numerical Algorithms, 43, 279–288. [Author-uploaded full text](https://www.researchgate.net/publication/226930424_The_life_and_work_of_Andre_Cholesky).
10. de Falguerolles, A. (2019). [*Cholesky and the Cholesky decomposition: a commemoration by an applied statistician*](https://www.numdam.org/item/JSFS_2019__160_2_83_0.pdf). Journal de la Société Française de Statistique, 160(2), 83–96. Sections 5.1–5.2 distinguish fitting and compensation.
11. van de Geijn, R. A., and Myers, M. *Advanced Linear Algebra: Foundations to Frontiers*. [§4.2.5, Why using the Method of Normal Equations could be bad](https://www.cs.utexas.edu/~flame/laff/alaff/LLS-Why-Normal-Equations-Bad.html).
12. Anderson, E., et al. (1999). *LAPACK Users' Guide*. [Linear Least Squares Problems](https://www.netlib.org/lapack/lug/node27.html) and [Further Details: Error Bounds for Linear Equation Solving](https://www.netlib.org/lapack/lug/node81.html). See also the [LAPACK project description](https://www.netlib.org/lapack/) for blocked computation.
13. StataCorp. [*Stata 6: Simulating multivariate normal observations*](https://www.stata.com/support/faqs/statistics/multivariate-normal-observations/). Cholesky factors as covariance transformations.

14. Higham, N. J. (2020, July 21). [*What Is a Symmetric Positive Definite Matrix?*](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/). Quadratic-form interpretation and positivity conditions.
15. OpenStax. [*College Algebra 2e*, §2.5, Quadratic Equations](https://openstax.org/books/college-algebra-2e/pages/2-5-quadratic-equations), subsection Completing the Square. Algebraic background for rewriting a quadratic using a squared expression.
