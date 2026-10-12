---
title: Vector norms
subject: Linear Algebra
interactive_examples: true
description: Measure vector size with the 1, 2, and infinity norms, compare their geometry, and choose a meaningful error measure.
last_modified_at: 2026-10-12
---

## What problem does a norm solve?

A vector has several coordinates, but we often need one number answering “how large is it?” For a displacement, that number might be ordinary length. For a collection of errors, it might be the largest error or the total absolute error. A **norm** makes such a size measurement precise. Its choice determines what “small” means in a calculation.

## Definition

For vectors $x,y\in\mathbb R^n$, a norm is a function $\lVert\cdot\rVert:\mathbb R^n\to\mathbb R$ satisfying:

1. **Positive definiteness:** $\lVert x\rVert\ge0$, with equality exactly when $x=0$.
2. **Absolute homogeneity:** $\lVert\alpha x\rVert=|\alpha|\lVert x\rVert$ for every real scalar $\alpha$.
3. **Triangle inequality:** $\lVert x+y\rVert\le\lVert x\rVert+\lVert y\rVert$.

The same axioms apply over $\mathbb C$, using the complex modulus. See [Higham's vector-norm definition](https://nhigham.com/2021/09/22/what-is-a-vector-norm/). Homogeneity says doubling a vector doubles its size; the triangle inequality says combining two displacements cannot cost more than taking them separately.

A norm induces distance by $d(x,y)=\lVert x-y\rVert$. This measures the difference between two vectors rather than their individual sizes.

## Common norms

For $x=(x_1,\ldots,x_n)^T$ and $1\le p<\infty$,

$$
\lVert x\rVert_p=\left(\sum_{i=1}^n|x_i|^p\right)^{1/p},\qquad
\lVert x\rVert_\infty=\max_i|x_i|.
$$

| Norm | Formula | What it emphasizes |
| --- | --- | --- |
| $1$ (Manhattan) | $\sum_i|x_i|$ | Total absolute magnitude |
| $2$ (Euclidean) | $\sqrt{\sum_i|x_i|^2}$ | Ordinary geometric length |
| $\infty$ (maximum) | $\max_i|x_i|$ | Largest individual magnitude |

These are the standard $p$-norms; the infinity norm is their limit as $p\to\infty$. See [Higham](https://nhigham.com/2021/09/22/what-is-a-vector-norm/) and [LAPACK's norm table](https://www.netlib.org/lapack/lug/node75.html).

### Worked example: one vector, three questions

The examples, derivations, diagrams, and exercises on this page are original illustrations.

For $x=(3,-4)^T$:

$$
\lVert x\rVert_1=3+4=7,\quad
\lVert x\rVert_2=\sqrt{9+16}=5,\quad
\lVert x\rVert_\infty=4.
$$

The negative sign describes direction; it does not cancel size. Traveling along horizontal and vertical streets costs $7$ units, traveling straight costs $5$, and the largest coordinate displacement is $4$.

To normalize in a chosen norm, divide a **nonzero** vector by its norm. Here $x/5=(0.6,-0.8)^T$ has Euclidean norm $1$, but its $1$-norm is $1.4$. “Unit vector” needs a specified norm. The zero vector cannot be normalized.

## Geometry: the unit ball changes shape

The **unit ball** contains vectors with $\lVert x\rVert\le1$; its boundary has $\lVert x\rVert=1$. In two real dimensions:

- $|x_1|+|x_2|\le1$ is a diamond.
- $x_1^2+x_2^2\le1$ is a circular disk.
- $\max(|x_1|,|x_2|)\le1$ is an axis-aligned square.

{% include image.html src="/assets/images/wiki/vector-norm-balls.svg" alt="On identical coordinate axes, the 1-norm unit diamond lies inside the 2-norm unit circle, which lies inside the infinity-norm unit square." caption="Each boundary measures size one in a different norm. The diamond, circle, and square all meet at the coordinate-axis unit vectors. The square corner (1, 1) lies outside the other two balls." %}

For $(1,1)^T$, the three sizes are $2$, $\sqrt2$, and $1$. Thus a bound on the infinity norm allows several coordinates to be large at once. A bound on the $1$-norm instead gives coordinates a shared total budget.

### Interactive example: change the vector and the measuring rule

{% include wiki-lab.html kind="vector-norm" title="Compare vector size and unit balls" plot_description="The selected norm's unit boundary and the input vector, using the same coordinate scale." %}

Predict the sizes at $(1,1)$, $(3,-4)$, and $(0,0)$. Change the selected norm and watch the normalized point move to the new boundary. The line marks the input vector, while the boundary records the selected definition of size. Inputs and the selector work with a keyboard. Without JavaScript, the calculations and static figure above show the same comparison.

## Comparing norms without recalculating everything

Let $M=\max_i|x_i|$. One term contributes $M^2$ to the sum of squares, and every term is at most $M^2$, so

$$
\lVert x\rVert_\infty\le\lVert x\rVert_2\le\sqrt n\lVert x\rVert_\infty.
$$

Also, expanding $(\sum_i|x_i|)^2$ adds nonnegative cross terms to $\sum_i|x_i|^2$, while Cauchy–Schwarz applied to $(|x_i|)$ and $(1,\ldots,1)$ gives

$$
\lVert x\rVert_2\le\lVert x\rVert_1\le\sqrt n\lVert x\rVert_2.
$$

The constants matter: $x=(1,\ldots,1)^T$ has sizes $n$, $\sqrt n$, and $1$. In fixed finite dimension these bounds make convergence in any of these three norms equivalent, but numerical thresholds differ. If $\lVert e\rVert_\infty\le0.01$ for $100$ error coordinates, then $\lVert e\rVert_2\le0.1$; one cannot infer $\lVert e\rVert_2\le0.01$.

## Choosing an error measure

For a computed vector $\hat x$, **absolute error** is $\lVert\hat x-x\rVert$ and **relative error** is $\lVert\hat x-x\rVert/\lVert x\rVert$ when $x\ne0$. See [LAPACK's error-measure definitions](https://www.netlib.org/lapack/lug/node75.html). Specify the norm with the tolerance.

For errors $e=(0.1,-0.1,0.1,-0.1)^T$, the maximum error is $0.1$, the Euclidean error is $0.2$, and the total absolute error is $0.4$. A per-coordinate tolerance naturally uses the infinity norm; a total squared-error objective uses $\lVert e\rVert_2^2$. If coordinates mix units or have different scales, rescale them deliberately before combining them. A meter and a second do not acquire a shared meaning simply by appearing in the same array.

## Common misconceptions and counterexamples

**Squared Euclidean length is not a norm.** For $x=(1,0)^T$, $\lVert2x\rVert_2^2=4$, whereas homogeneity would require $2\lVert x\rVert_2^2=2$. It is a useful objective, but it scales quadratically.

**The “zero norm” is not a norm.** Counting nonzero coordinates is often denoted $\lVert x\rVert_0$. Scaling $(1,0)^T$ by $2$ leaves the count at $1$, violating homogeneity. NumPy also supports such quantities while [explicitly distinguishing them from mathematical norms](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html).

**The $p$ formula needs $p\ge1$.** At $p=1/2$, take $x=(1,0)^T$ and $y=(0,1)^T$. The formula gives sizes $1$ and $1$, but size $4$ for $x+y$, violating the triangle inequality.

**Not every norm is rotation invariant.** A $45^\circ$ rotation takes $(1,0)^T$ to $(1/\sqrt2,1/\sqrt2)^T$. Euclidean size stays $1$; the $1$-norm becomes $\sqrt2$. Coordinate-based error rules depend on the axes chosen.

## Practice problems

### 1. Hand calculation: compute and normalize

Find the $1$, $2$, and infinity norms of $x=(-2,1,2)^T$, then normalize it in the Euclidean norm.

<details markdown="1">
<summary>Hint</summary>

Take absolute values before summing; square before taking the square root.

</details>
<details markdown="1">
<summary>Worked solution</summary>

The sizes are $5$, $\sqrt{4+1+4}=3$, and $2$. The normalized vector is $(-2/3,1/3,2/3)^T$; its squared Euclidean norm is $4/9+1/9+4/9=1$.

</details>

### 2. Interpretation: concentrated or spread-out error?

Compare $e=(4,0,0,0)^T$ and $f=(1,1,1,1)^T$. Which has smaller total absolute error? Which has smaller maximum error? What does this tell you about selecting a tolerance?

<details markdown="1">
<summary>Hint</summary>

The same total budget can be concentrated in one coordinate.

</details>
<details markdown="1">
<summary>Worked solution</summary>

Both $1$-norms are $4$, but the infinity norms are $4$ and $1$. Their Euclidean norms are $4$ and $2$. A total-error rule treats them equally, whereas a maximum-error rule penalizes the concentrated error more strongly. Choose the rule from what a failure means in the application.

</details>

### 3. Abstract reasoning: a weighted size

For positive weights $w_i$, prove $N(x)=\sum_i w_i|x_i|$ is a norm. What fails if one weight is zero?

<details markdown="1">
<summary>Hint</summary>

Use the scalar triangle inequality in each coordinate and test a coordinate basis vector.

</details>
<details markdown="1">
<summary>Worked solution</summary>

All terms are nonnegative, and their sum can vanish only when every coordinate is zero. Scaling gives $N(\alpha x)=|\alpha|N(x)$. Finally, $\sum_iw_i|x_i+y_i|\le\sum_iw_i(|x_i|+|y_i|)=N(x)+N(y)$. If $w_k=0$, the nonzero basis vector $e_k$ has size zero, so positive definiteness fails.

</details>

### 4. Application: validate a displacement estimate

An exact displacement is $x=(3,4)^T$ meters and an estimate is $\hat x=(3.03,3.96)^T$ meters. Find the absolute and relative Euclidean errors. Does a maximum coordinate-error tolerance of $0.035$ meters pass?

<details markdown="1">
<summary>Hint</summary>

Subtract first. The difference is a scaled $3$–$4$–$5$ triangle.

</details>
<details markdown="1">
<summary>Worked solution</summary>

The difference is $(0.03,-0.04)^T$, with Euclidean norm $0.05$ meters. Since $\lVert x\rVert_2=5$ meters, relative error is $0.01$, or $1\%$. The maximum coordinate error is $0.04$ meters, so the stated tolerance fails.

</details>

## Further learning

- [Higham: What Is a Vector Norm?](https://nhigham.com/2021/09/22/what-is-a-vector-norm/): continue from the norm axioms to dual norms and bounds on inner products.
- [LAPACK: How to Measure Errors](https://www.netlib.org/lapack/lug/node75.html): connect norms to absolute error, relative error, and conditioning.
- [NumPy: `numpy.linalg.norm`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html): see how array shape, `ord`, and `axis` select the mathematical quantity being computed.

## Related pages

- [Matrix norms]({{ '/wiki/linear-algebra/matrix-norm/' | relative_url }})
- [Symmetric positive definite matrix]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }})
- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})

## References

1. Higham, N. J. (2021, September 22). [*What Is a Vector Norm?*](https://nhigham.com/2021/09/22/what-is-a-vector-norm/). Norm axioms and the $p$-norm family.
2. Anderson, E., et al. (1999). *LAPACK Users' Guide*, third edition. [*How to Measure Errors*](https://www.netlib.org/lapack/lug/node75.html). Standard norms and absolute and relative error.
3. NumPy developers. [*numpy.linalg.norm*](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html). Software conventions and quantities that do not satisfy the norm axioms.
