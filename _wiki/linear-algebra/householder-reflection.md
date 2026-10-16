---
title: Householder reflection
subject: Linear Algebra
interactive_examples: true
orthogonal_examples: true
description: Derive a reflection that zeros a column tail, understand its geometry and stable sign choice, and connect compact reflectors to QR and eigenvalue algorithms.
last_modified_at: 2026-10-16
---

## The original problem: make a matrix triangular without distorting lengths

Householder's 1958 paper starts with a computational problem at Oak Ridge: a method using plane rotations triangularizes a nonsymmetric matrix before inversion, but requires many operations. He proposes transformations that remove a whole column tail at once. The motivation is to keep the length-preserving character of the rotations while reducing the work. See the [original paper, p. 339](https://web.stanford.edu/class/cme324/classics/householder.pdf#page=1).

**Original symbolic problem, modern real-arithmetic re-derivation.** Given a square matrix $A$, construct an orthogonal matrix $W$ so that $WA=R$ is upper triangular: every entry below its diagonal is zero. Orthogonal means $W^TW=I$, where $T$ denotes transpose and $I$ the identity matrix. Consequently, multiplying a vector by $W$ preserves its Euclidean length. This page restricts the derivation to real vectors; the original paper also treats complex arithmetic. It supplies no numerical matrix example, so the numerical calculations and controls below are supplementary invented examples.

The first task is to turn the first column into a multiple of $e_1=(1,0,\ldots,0)^T$. Later tasks repeat that operation on shorter column segments. Householder's construction on [p. 340](https://web.stanford.edu/class/cme324/classics/householder.pdf#page=2) motivates the question: can a single mirror send a vector to an axis?

## Derive the mirror from perpendicular components

A **hyperplane through the origin** is a subspace with one fewer dimension than the surrounding space: a line in two dimensions or a plane in three. A **normal vector** points perpendicular to it. Choose a unit normal $u$, so $u^Tu=1$. The dot product $u^Tx$ measures the signed component of $x$ along $u$; see the [projection explanation in Gram–Schmidt]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/#a-projection-is-the-part-already-explained' | relative_url }}).

Split $x$ into its normal and in-plane components:

$$
x_\perp=u(u^Tx),\qquad x_\parallel=x-u(u^Tx),\qquad u^Tx_\parallel=0.
$$

Reflection keeps $x_\parallel$ and reverses $x_\perp$. Therefore

$$
Hx=x_\parallel-x_\perp=x-2u(u^Tx),
\qquad H=I-2uu^T.
$$

For any nonzero normal $v$, normalize it as $u=v/\lVert v\rVert_2$, giving

$$
H=I-2\frac{vv^T}{v^Tv}.
$$

This is a **Householder reflection**, also called a **Householder reflector** or **Householder transformation**. The mirror is the set of vectors perpendicular to $v$; it is not the line along $v$. See [ALAFF, §3.3.2, Definition 3.3.2.2](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html).

### Why it preserves lengths and undoes itself

The matrix $uu^T$ is symmetric, so $H^T=H$. Also,

$$
H^2=(I-2uu^T)^2
=I-4uu^T+4u(u^Tu)u^T=I.
$$

Thus $H^{-1}=H$ and $H^TH=I$: reflecting twice restores the input, and

$$
\lVert Hx\rVert_2^2=x^TH^THx=x^Tx=\lVert x\rVert_2^2.
$$

The normal reverses, $Hu=-u$, while every vector in the mirror stays fixed. In a basis consisting of $u$ and perpendicular directions, the diagonal entries are $-1,1,\ldots,1$. Hence $\det H=-1$: one reflection reverses orientation. These calculations verify the properties listed in [ALAFF's reflector discussion](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html).

**A projection is different.** The orthogonal projection onto the mirror is $P=I-uu^T$. It discards the normal component instead of reversing it: $Pu=0$, whereas $Hu=-u$. A nonzero normal component can shorten under projection; reflection preserves its length. In particular, a reflector does not turn a nonzero vector into zero.

## Construct a reflection that zeros a column tail

**Modern derivation of the real vector step.** Suppose $x\ne0$ and the desired target is $y=\alpha e_1$, where $\alpha^2=\lVert x\rVert_2^2$. Equal lengths are necessary because a reflection preserves length. If $x\ne y$, choose the normal

$$
v=x-y=x-\alpha e_1.
$$

Why this choice? The difference between a point and its mirror image is perpendicular to the mirror. Algebra confirms it:

$$
v^Tx=\lVert x\rVert_2^2-\alpha x_1,
$$

$$
v^Tv=\lVert x\rVert_2^2-2\alpha x_1+\alpha^2
=2(\lVert x\rVert_2^2-\alpha x_1)=2v^Tx.
$$

Substitution now gives $Hx=x-v=y$. One transformation zeros all coordinates except the first. This specializes the vector construction in [Householder, p. 340](https://web.stanford.edu/class/cme324/classics/householder.pdf#page=2); the following sign convention follows [ALAFF's numerical discussion](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html).

### The sign is a numerical choice

Either sign of $\alpha$ can work in exact arithmetic when $v\ne0$. For computation, choose

$$
\alpha=-\operatorname{sign}(x_1)\lVert x\rVert_2,
\qquad v=x-\alpha e_1,
\qquad \operatorname{sign}(0)=1\text{ here}.
$$

Then $\lvert v_1\rvert=\lvert x_1\rvert+\lVert x\rVert_2$. This avoids **cancellation**, the loss of relative accuracy when subtracting nearly equal rounded numbers.

**Supplementary invented counterexample.** For $x=(1,10^{-10})^T$, its exact length is slightly greater than $1$, but a floating-point calculation can round it to $1$. Choosing the positive target then computes $v=(0,10^{-10})^T$, whose reflector merely flips the second coordinate: it leaves a tail of size $10^{-10}$. The negative target instead gives $v\approx(2,10^{-10})^T$, retaining the small tilt needed to remove the tail.

If $x=0$, skip the operation. If the tail is already zero, the formula above can flip the leading sign, but zeroing requires no change; LAPACK's real [DLARFG routine](https://netlib.org/lapack/explore-html/d8/d0d/group__larfg_gadc154fac2a92ae4c7405169a9d1f5ae9.html) chooses the identity in this case. The identity is a useful no-op in an algorithm, although it is not a reflection with determinant $-1$. Robust implementations also scale norm calculations to handle very large or very small values; the sign choice alone does not prevent overflow or underflow.

### Calculate the reflector and read its geometry

**Supplementary invented example, shared with the QR page.** Let $x=(3,4)^T$. Its length is $5$, so $\alpha=-5$, $v=(8,4)^T$, and $v^Tv=80$. Then

$$
H=I-\frac{2}{80}\begin{bmatrix}64&32\\32&16\end{bmatrix}
=\begin{bmatrix}-3/5&-4/5\\-4/5&3/5\end{bmatrix}.
$$

Multiply to verify the result:

$$
Hx=\begin{bmatrix}(-9-16)/5\\(-12+12)/5\end{bmatrix}
=\begin{bmatrix}-5\\0\end{bmatrix}.
$$

The normal can equally be $(2,1)^T$: scaling a nonzero normal leaves $vv^T/(v^Tv)$ unchanged. The mirror is the line $2z_1+z_2=0$. The midpoint between $x$ and $Hx$ is $(-1,2)^T$, which lies on this line. The perpendicular component is $(4,2)^T$; subtracting it once reaches the mirror, and subtracting it twice reaches the reflected point.

{% include image.html src="/assets/images/wiki/householder-reflection.svg" alt="On equal coordinate scales, the mirror line 2z1 plus z2 equals zero bisects the segment from x at (3,4) to Hx at (-5,0), at midpoint (-1,2). The segment is perpendicular to the mirror." caption="Invented example: the dashed segment crosses the mirror at its midpoint. Both vectors from the origin have length 5. The mirror normal points along (2,1)." %}

## Interactive example: move the mirror, then aim at the axis

This **supplementary invented geometry experiment** starts with the calculation above. Change the input vector or the mirror normal, and predict which component will reverse. Use **Aim input at the first axis** to construct the stable-sign reflector from your input. A zero vector reflects to itself, but has no nonzero direction to aim; a zero normal cannot define a mirror. Restoring the baseline returns to $x=(3,4)^T$, normal $(2,1)^T$.

{% include orthogonal-lab.html kind="householder" title="Reflect a vector across a line" source_url="https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html" source_label="ALAFF's reflector geometry" plot_description="Equal-scale coordinate plot of the input, reflected vector, mirror line, and midpoint." %}

## Apply the reflection without building a dense matrix

With a unit normal $u$, first compute the scalar $s=u^Tx$, then update $x\leftarrow x-2us$. Each pass visits the vector's coordinates once: applying a reflector in $d$ dimensions takes $O(d)$ arithmetic operations and stores $O(d)$ numbers. A dense $d\times d$ matrix would need $O(d^2)$ storage. For a matrix $B$ with $p$ columns, the same algebra gives

$$
HB=B-2u(u^TB),
$$

which costs $O(dp)$ by a dot product and vector update per column. These operation counts follow directly from the displayed calculation; no dense $H$ is necessary.

LAPACK uses $H=I-\tau ww^T$, storing a vector with leading entry $w_1=1$ and a scalar $\tau$. Here $w$ is a rescaled normal, not necessarily a unit vector. For our example, $w=(1,1/2)^T$ and $\tau=8/5$ reproduce $H$. See its [reflector representation](https://www.netlib.org/lapack/lug/node128.html). Several reflectors can be grouped as $H_1\cdots H_b=I-VTV^T$, where columns of $V$ store normals and $T$ is a small upper triangular matrix; [LAPACK's blocked QR discussion](https://www.netlib.org/lapack/lug/node69.html) explains this organization.

## From one mirror to QR and other reductions

At column $j$, reflect only rows $j$ onward. In full coordinates this is an embedded reflector with an identity block on the first $j-1$ coordinates, so it leaves earlier zeros intact. If

$$
H_k\cdots H_2H_1A=\begin{bmatrix}R\\0\end{bmatrix},
$$

then multiplying back gives

$$
A=Q\begin{bmatrix}R\\0\end{bmatrix},\qquad Q=H_1H_2\cdots H_k.
$$

The order reverses because each reflector equals its own transpose. Applying $Q^T$ to a vector executes $H_1$ first; applying $Q$ executes $H_k$ first. The [QR page]({{ '/wiki/linear-algebra/qr-factorization/#householder-reflections-remove-a-column-tail-together' | relative_url }}) develops the factorization and least-squares solve. LAPACK can [apply these products without explicitly forming $Q$](https://www.netlib.org/lapack/lug/node128.html).

**Supplementary invented two-column calculation.** The same reflector gives

$$
A=\begin{bmatrix}3&1\\4&2\end{bmatrix},\qquad
HA=R=\begin{bmatrix}-5&-11/5\\0&2/5\end{bmatrix},\qquad A=HR.
$$

This is QR with $Q=H$. The negative first diagonal entry of $R$ is allowed. Positive diagonal conventions can be enforced by matching sign changes in $Q$ and $R$.

Reflectors also prepare eigenvalue and singular-value problems for later algorithms. A **similarity transformation** $Q^TAQ$ uses the same orthogonal change of coordinates on both sides and preserves eigenvalues. Reflectors reduce a symmetric matrix to **tridiagonal** form (only the diagonal and its two neighbors can be nonzero), or a general square matrix to **upper Hessenberg** form (zeros below the first subdiagonal). Separate left and right transformations reduce a rectangular matrix to **bidiagonal** form (only a diagonal and one neighboring diagonal), as a step toward SVD. See [LAPACK's reductions](https://www.netlib.org/lapack/lug/node70.html). Left multiplication $HA$ by itself generally does **not** preserve eigenvalues: $A=I$ already provides a counterexample.

### What length preservation does and does not guarantee

Exact orthogonality prevents the transformations themselves from stretching errors in the Euclidean norm. It does not imply exact floating-point arithmetic or fix sensitivity already present in the data. The [QR accuracy discussion]({{ '/wiki/linear-algebra/qr-factorization/#the-connection-to-cholesky-and-the-accuracy-trap' | relative_url }}) explains why avoiding normal equations helps and why conditioning still matters.

The real formulas above also need care in complex arithmetic. Replacing transpose by conjugate transpose gives a Hermitian reflector $I-2uu^\ast$ for a complex unit vector. LAPACK's more general complex elementary transformations use $I-\tau ww^\ast$ with possibly complex $\tau$; they are unitary but need not be Hermitian or self-inverse. See the [complex representation convention](https://www.netlib.org/lapack/lug/node128.html).

## Practice problems

These are original exercises using the definitions and constructions above. Try each before revealing its hint or solution.

### 1. Hand calculation: identify the mirror

Take $v=(1,1)^T$. Compute $H$ and $H(2,0)^T$. Which line stays fixed?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Use $v^Tv=2$ and solve $v^Tz=0$ for the mirror.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

The matrix is <span class="math-inline" markdown="0">\(H=\begin{pmatrix}0&-1\\-1&0\end{pmatrix}\)</span>, so $(2,0)^T$ maps to $(0,-2)^T$. The mirror is $z_1+z_2=0$, the line $z_2=-z_1$. The normal line $z_2=z_1$ reverses instead of staying fixed.

</details>
</div>

### 2. Hand calculation: zero two entries together

Construct the stable-sign reflector for $x=(0,3,4)^T$, and verify its action without forming a $3\times3$ matrix.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Our convention gives $\operatorname{sign}(0)=1$. Compute $v^Tx$ and $v^Tv$.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

The target and normal are

$$
y=(-5,0,0)^T,\qquad v=(5,3,4)^T.
$$

Since $v^Tx=25$ and $v^Tv=50$,

$$
Hx=x-2v(25/50)=x-v=(-5,0,0)^T.
$$

Both tail entries vanish in one reflection.

</details>
</div>

### 3. Strategy: choose the target sign

For $x=(-5,10^{-8})^T$, should the stable construction aim toward $+\lVert x\rVert_2e_1$ or $-\lVert x\rVert_2e_1$? Explain which subtraction causes trouble with the other choice.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Compare the magnitudes of the two possible first entries of $v$.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

Choose the positive target: $\alpha\approx5$ gives $v_1=-5-\alpha\approx-10$. Choosing $\alpha\approx-5$ would subtract nearly equal negative quantities, making $v_1$ tiny and sensitive to rounding. The stable target sign depends on the input; it is not always negative.

</details>
</div>

### 4. Logic: can one reflection reach any target?

For real vectors $x\ne y$ of equal length, prove that $v=x-y$ gives $Hx=y$. What changes if $x=y$ or the lengths differ?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Expand $v^Tv$ and compare it with $2v^Tx$.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

Equal lengths give $v^Tv=2(\lVert x\rVert_2^2-y^Tx)=2v^Tx$, so $Hx=x-v=y$. If $x=y$, this normal is zero and the formula is undefined; the identity already performs the mapping. If the lengths differ, no orthogonal reflection can map one to the other.

</details>
</div>

### 5. Logic: a product need not be a reflection

Reflect first across the horizontal axis and then across the line $z_2=z_1$. Find the product. Is it self-inverse?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

The first transformation negates coordinate two; the second swaps the coordinates. Apply them in that order.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

The product sends $(a,b)^T$ to $(-b,a)^T$: a $90^\circ$ counterclockwise rotation. Applying it twice gives $(-a,-b)^T$, so its square is $-I$, not $I$. Products of reflectors remain orthogonal, but need not be symmetric, self-inverse, or single reflections. This explains why the order in $Q$ matters.

</details>
</div>

### 6. Applied: transform the right-hand side too

For the two-column example above, solve $Ax=b$ with $b=(5,8)^T$ by applying $H$ and then solving $Rx=Hb$. Verify the result in the original system.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Compute $Hb$ using the displayed $2\times2$ reflector, then solve the last row first.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

Here $Hb=(-47/5,4/5)^T$. The second row gives $(2/5)x_2=4/5$, hence $x_2=2$. The first gives $-5x_1-(11/5)2=-47/5$, hence $x_1=1$. Checking, $A(1,2)^T=(5,8)^T$. Transforming $A$ without also transforming $b$ would change the system.

</details>
</div>

## Further learning

- [Householder's original paper](https://web.stanford.edu/class/cme324/classics/householder.pdf): pp. 339–340 supply the triangularization problem and vector construction; p. 341 connects the rectangular case to least squares. Its complex notation and sign choices differ from this real-arithmetic derivation.
- [ALAFF: Householder transformation](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html): study the mirror geometry and cancellation explanation alongside the derivation here.
- [LAPACK: DLARFG](https://netlib.org/lapack/explore-html/d8/d0d/group__larfg_gadc154fac2a92ae4c7405169a9d1f5ae9.html): inspect how a library represents a reflector, handles a zero tail, and rescales small inputs.

## Related pages

- [QR factorization]({{ '/wiki/linear-algebra/qr-factorization/' | relative_url }})
- [Gram–Schmidt orthogonalization]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/' | relative_url }})
- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})
- [Vector norms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }})
- [Matrix norms]({{ '/wiki/linear-algebra/matrix-norm/' | relative_url }})

## References

1. Householder, A. S. (1958). *Unitary Triangularization of a Nonsymmetric Matrix*. Journal of the ACM, 5(4), 339–342. [DOI](https://doi.org/10.1145/320941.320947); [original paper hosted by Stanford](https://web.stanford.edu/class/cme324/classics/householder.pdf).
2. van de Geijn, R. A., and Myers, M. *Advanced Linear Algebra: Foundations to Frontiers*. [§3.3.2, Householder transformation](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-householder-transformation.html).
3. LAPACK. [DLARFG: generate a real elementary reflector](https://netlib.org/lapack/explore-html/d8/d0d/group__larfg_gadc154fac2a92ae4c7405169a9d1f5ae9.html). Routine specification and source.
4. Anderson, E., et al. (1999). *LAPACK Users' Guide*, third edition. [Representation of Orthogonal or Unitary Matrices](https://www.netlib.org/lapack/lug/node128.html), [blocked QR](https://www.netlib.org/lapack/lug/node69.html), and [reductions for eigenvalue and SVD problems](https://www.netlib.org/lapack/lug/node70.html).
