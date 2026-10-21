---
title: Carathéodory’s Theorem
subject: Optimization
interactive_examples: true
description: Compress a convex combination to at most d + 1 points, starting from Carathéodory’s Fourier-coefficient problem and a constructive weight-elimination proof.
last_modified_at: 2026-10-20
lang: en
translation_key: wiki-optimization-caratheodory-theorem
---

## The problem: how many points does an average need?
{: id="the-problem"}

A mixture may involve hundreds of points even when its average has only two coordinates. **Carathéodory’s theorem** says that the same average can then be made from at most three of those points, with new nonnegative weights. In $\mathbb R^d$, the bound is $d+1$. This page concerns the **convex hull theorem**; other theorems named after Carathéodory address different questions. For the modern statement, see [Bertsekas, *Convex Optimization Theory*, §1.2, Proposition 1.2.1](https://web.mit.edu/dimitrib/www/Convex_Theory_Short_View.pdf#page=31).

A **convex combination** is a finite weighted average: the weights are nonnegative and add to one. The **convex hull** $\operatorname{conv}(S)$ is the set of all such averages of points in $S$. Review [Convexity]({{ '/wiki/optimization/convexity/' | relative_url }}) for why line segments and mixtures belong together.

## Fourier coefficients become a geometric problem
{: id="fourier-coefficients"}

Carathéodory’s 1911 paper studies which coefficients can occur in positive harmonic functions on a disc. A **harmonic function** satisfies Laplace’s equation; here it is enough to think of a smooth field constrained by its boundary behavior. His normalization and coefficient curve are

$$
U(r,\theta)=\frac12+\sum_{k=1}^{\infty}r^k(a_k\cos k\theta+b_k\sin k\theta),
\qquad 0\le r<1,
$$

$$
c_n(\phi)=(\cos\phi,\sin\phi,\ldots,\cos n\phi,\sin n\phi)\in\mathbb R^{2n}.
$$

The question becomes one about the convex hull of this curve. The original introduction gives this setup; §I.9 derives a bound of dimension plus one using centers of mass. We checked these passages through [Nicholas J. Williams’ English translation, introduction and §I.9 (original pp. 193–195, 200–201)](https://nchlswllms.github.io/translations/cc1911.pdf#page=1); [the publisher’s record](https://link.springer.com/article/10.1007/BF03014795) verifies the publication. The development below uses modern notation and calculations, rather than reproducing the historical proof. The source supplies a symbolic problem, not a numerical dataset; our chosen numerical weights are explicitly supplementary.

Why do averages appear? Consider the following modern construction. For each angle $\phi$, define a positive function using the geometric-series identity:

$$
P_\phi(r,\theta)=\frac{1-r^2}{2(1-2r\cos(\theta-\phi)+r^2)}
=\frac12+\sum_{k=1}^{\infty}r^k\cos\bigl(k(\theta-\phi)\bigr).
$$

The denominator is positive when $r<1$. Expanding $\cos(k\theta-k\phi)$ gives coefficients $a_k=\cos k\phi$ and $b_k=\sin k\phi$. Mixing these functions with weights $\lambda_i\ge0$, $\sum_i\lambda_i=1$, preserves positivity and the constant $1/2$. Its first $2n$ coefficients are

$$
q=(a_1,b_1,\ldots,a_n,b_n)=\sum_{i=1}^{m}\lambda_i c_n(\phi_i).
$$

Thus the geometric question is concrete: **can we preserve these coefficients using fewer component functions?** The general theorem will give at most $2n+1$ angles for any such finite mixture. It preserves the first $2n$ coefficients, not necessarily the entire function: higher coefficients may change. We use the historical coefficient curve, without claiming this general bound is the strongest bound for that special curve.

### Work out the first coefficient pair
{: id="first-coefficient-pair"}

For $n=1$, the curve is the unit circle. Write a desired coefficient pair as $q=\rho(\cos\alpha,\sin\alpha)$ with $0\le\rho\le1$. Direct calculation gives

$$
q=\frac{1+\rho}{2}c_1(\alpha)+\frac{1-\rho}{2}c_1(\alpha+\pi).
$$

The weights sum to one; opposite circle points subtract to give radius $\rho$. At $\rho=0$ they are equal; at $\rho=1$ the second weight vanishes. This original derivation constructs a positive function for every pair in the closed unit disc using at most two angles. The general planar bound of three is sufficient but need not be attained. **Access to the whole circle matters:** if only a finite list of angles is allowed, those two angles may be unavailable.

Also, a pair in this disc does not make the truncated expression $1/2+r(a_1\cos\theta+b_1\sin\theta)$ positive by itself. For $(a_1,b_1)=(1,0)$ it is negative at $r=3/4$, $\theta=\pi$. The positive function constructed above retains its higher terms.

## Remove one weight without moving the point
{: id="remove-one-weight"}

Here is a **supplementary invented numerical example** on the historical $n=1$ curve. Restrict the available angles to $0,\pi/2,\pi,3\pi/2$, giving

$$
A=(1,0),\quad B=(0,1),\quad C=(-1,0),\quad D=(0,-1).
$$

Start with the chosen weights

$$
\lambda=(3/8,3/8,1/8,1/8),\qquad
q=\tfrac38A+\tfrac38B+\tfrac18C+\tfrac18D=(1/4,1/4).
$$

The opposite pairs have the same midpoint, so $A-B+C-D=0$. The coefficients $(1,-1,1,-1)$ also sum to zero. Subtract $t$ times this relation from the weights:

$$
\lambda(t)=(3/8-t,\ 3/8+t,\ 1/8-t,\ 1/8+t).
$$

The weight sum and $q$ remain unchanged. To keep every weight nonnegative while increasing $t$ from zero, stop at the first weight that reaches zero:

$$
t_* =\min(3/8,1/8)=1/8,\qquad
\lambda(t_*)=(1/4,1/2,0,1/4).
$$

Check both coordinates: $q_x=1/4$ and $q_y=1/2-1/4=1/4$. Four supporting points have become three. Continuing beyond $t_*$ would make the weight of $C$ negative and cease to be a convex combination.

{% include image.html src="/assets/images/wiki/caratheodory-reduction.svg" alt="Two identical coordinate plots show the four circle points A, B, C, D and the fixed target q at (1/4,1/4). Initially all four points have positive weights. After reduction C has zero weight and the triangle ABD contains q." caption="Supplementary chosen weights on the original coefficient curve. The orange target stays at (1/4, 1/4); the blue region changes from the four-point diamond to triangle ABD. An outlined point has zero weight. Both panels use the same axes." %}

### Explore the weight transfer
{: id="explore-weight-transfer"}

{% include wiki-lab.html kind="caratheodory" title="Reduce the mixture while preserving its average" plot_description="Four fixed circle points and their weighted average during an affine weight transfer." %}

The circle and four angles stay fixed. The input masses are normalized to weights; they have no physical units. The slider moves from the input weights to the first zero weight along $(1,-1,1,-1)$. Changing masses creates hypothetical examples; **Restore illustrative weights** returns to $(3,3,1,1)$ and zero progress. Try equal masses: two weights disappear together. Try a zero mass: the input already uses at most three points. An all-zero input has no weighted average and is rejected. The calculations and static figure above remain available without JavaScript.

## The theorem and its constructive proof
{: id="theorem-and-proof"}

Let $S\subseteq\mathbb R^d$ be nonempty and $q\in\operatorname{conv}(S)$. Then there are $p_1,\ldots,p_r\in S$ and weights such that

$$
q=\sum_{i=1}^{r}\lambda_i p_i,\qquad
\lambda_i\ge0,\qquad \sum_{i=1}^{r}\lambda_i=1,\qquad r\le d+1.
$$

The set $S$ may be infinite, nonconvex, or nonclosed. Membership in its convex hull already supplies a **finite** combination. The statement and the related cone version appear in [Bertsekas, Proposition 1.2.1 and its proof, pp. 20–22](https://web.mit.edu/dimitrib/www/Convex_Theory_Short_View.pdf#page=30). Here is an expanded weight-elimination argument.

### Find an affine dependence
{: id="affine-dependence"}

Start from any finite representation and discard zero weights. Suppose $m>d+1$ positive weights remain. Attach a final coordinate of one to each point:

$$
\widetilde p_i=\begin{pmatrix}p_i\\1\end{pmatrix}\in\mathbb R^{d+1}.
$$

There are more columns than coordinates, so these columns are linearly dependent. A nonzero vector $\alpha$ therefore satisfies

$$
\sum_{i=1}^{m}\alpha_i p_i=0,\qquad \sum_{i=1}^{m}\alpha_i=0.
$$

This is an **affine dependence**: moving the weights in this direction preserves both the represented point and the weight sum. Because $\alpha$ is nonzero and sums to zero, it has both positive and negative entries. The extra coordinate is what distinguishes an affine dependence from an arbitrary linear relation among the original points.

### Move to the first zero weight
{: id="first-zero-weight"}

Set

$$
t_* =\min_{\alpha_i>0}\frac{\lambda_i}{\alpha_i},\qquad
\lambda'_i=\lambda_i-t_*\alpha_i.
$$

For $\alpha_i>0$, the minimum prevents a negative new weight; for $\alpha_i\le0$, the weight cannot decrease. At least one weight becomes zero. Moreover,

$$
\sum_i\lambda'_i=\sum_i\lambda_i-t_*\sum_i\alpha_i=1,
\qquad
\sum_i\lambda'_i p_i=q-t_*\sum_i\alpha_i p_i=q.
$$

Delete zero weights and repeat. Each step removes at least one point, so a representation initially using $m$ points needs at most $m-d-1$ steps when $m>d+1$. Once at most $d+1$ remain, the theorem is proved. One may continue if those remaining points are still affinely dependent; an affinely independent support is a **simplex** (a point, segment, triangle, tetrahedron, and their higher-dimensional counterparts).

For a numerical implementation, find a null vector of the matrix whose columns are $\widetilde p_i$, for example using [QR factorization]({{ '/wiki/linear-algebra/qr-factorization/' | relative_url }}). Near dependence needs a rank tolerance; check nonnegativity, the weight sum, and the residual $\|\sum_i\lambda_i p_i-q\|$ after reduction. The proof gives exact identities; floating-point arithmetic gives approximate checks.

## What the bound does and does not mean
{: id="meaning-and-limits"}

### Affine dimension is the relevant dimension
{: id="affine-dimension"}

The **affine hull** is the smallest translated linear subspace containing $S$. If its dimension is $k<d$, use coordinates within that subspace: the same proof gives $k+1$ points. A set on a line in $\mathbb R^{100}$ therefore needs at most two. The circle, despite having one angle parameter, has a two-dimensional affine hull; the theorem’s general bound there is three. Its two-point formula above is a special improvement, not a calculation of affine dimension.

### The bound can be necessary
{: id="sharpness"}

For the supplementary example $S=\{0,e_1,\ldots,e_d\}$, where $e_j$ has coordinate one in position $j$ and zero elsewhere, take

$$
q=\frac{1}{d+1}(e_1+\cdots+e_d).
$$

Each coordinate forces the weight of its $e_j$ to be $1/(d+1)$; the sum-to-one condition forces the same weight on $0$. Every one of these $d+1$ points is needed. Thus no smaller bound works for all sets in $\mathbb R^d$.

### Existence does not imply uniqueness or an arbitrary choice
{: id="nonuniqueness"}

For $S=\{A,B,C,D\}$ above, the origin is both $(A+C)/2$ and $(B+D)/2$. Conversely, the chosen $q=(1/4,1/4)$ is outside triangle $ACD$, whose points have second coordinate at most zero. The theorem promises a suitable subset, not that every subset of size three will work. Inside one fixed affinely independent simplex, the weights are unique; choosing the simplex need not be.

### Convex hull and closed convex hull differ
{: id="closed-hull"}

Let $S=\{1,1/2,1/3,\ldots\}\subset\mathbb R$. Every finite convex combination is strictly positive, although these points approach zero. Hence $0$ is in the **closed convex hull**, which also contains limits, but not in $\operatorname{conv}(S)$. The theorem supplies no finite representation for it. This is an original counterexample illustrating why the exact membership assumption matters.

## Applications: preserve measurements with a smaller mixture
{: id="applications"}

Suppose item $i$ has a feature vector $v_i\in\mathbb R^k$, and a finite probability distribution gives weights $w_i\ge0$ summing to one. Its expected features are $\mu=\sum_iw_iv_i$. Applying the theorem to the feature vectors yields a distribution on at most $k+1$ of the original items with **exactly the same expected features**. This is a direct corollary, not a statement that the two distributions agree in every respect.

For example, preserving $E[X]$ and $E[X^2]$ uses $v_i=(x_i,x_i^2)$, so at most three original values suffice. Preserving only $E[X]$ needs at most two but may change variance. If a cost must also remain unchanged, add it as another feature and reassess the dimension. Similarly, a time-sharing schedule can preserve a vector of average outputs with fewer operating modes, provided outputs mix linearly and there are no additional switching constraints.

The cone version replaces convex weights by nonnegative coefficients without the sum-to-one condition. In $\mathbb R^d$, a nonzero point in a generated cone needs at most $d$ generators, because ordinary linear dependence is enough. See [Bertsekas, Proposition 1.2.1(a)](https://web.mit.edu/dimitrib/www/Convex_Theory_Short_View.pdf#page=30), and [Farkas’ Lemma]({{ '/wiki/optimization/farkas-lemma/' | relative_url }}) for how nonnegative combinations describe attainable targets. The additional normalization equation explains the convex bound’s extra point.

## Practice
{: id="practice"}

These exercises and solutions are original teaching examples.

### 1. Hand calculation: a weight vanishes
{: id="exercise-calculation"}

For $A,B,C,D$ above, use weights $(2/5,3/10,1/5,1/10)$. Reduce them along $(1,-1,1,-1)$. Find the stopping time and verify the average before and after.

<details markdown="1">
<summary>Hint</summary>

Only the weights of $A$ and $C$ decrease. Compare them before subtracting anything.
</details>
<details markdown="1">
<summary>Worked solution</summary>

$$
t_* =\min(2/5,1/5)=1/5,\qquad
\lambda'=(1/5,1/2,0,3/10).
$$

Initially $q=(2/5-1/5,3/10-1/10)=(1/5,1/5)$. Afterwards $q=(1/5,1/2-3/10)=(1/5,1/5)$. The weights remain nonnegative and sum to one.
</details>

### 2. Interpretation: points in a plane
{: id="exercise-interpretation"}

A collection of points in $\mathbb R^3$ lies in the plane $z=5$. What bound applies? Does the theorem guarantee a unique representation or require an algorithm to return exactly that many points?

<details markdown="1">
<summary>Hint</summary>

Subtract $(0,0,5)$ and count the independent coordinates.
</details>
<details markdown="1">
<summary>Worked solution</summary>

At most three points suffice because the affine dimension is at most two. A collinear collection improves this to two; a single distinct point needs one. The representation need not be unique, and fewer points are allowed. Three are necessary for an interior point when the available set is exactly the three vertices of a nondegenerate triangle in that plane.
</details>

### 3. Logical reasoning: why add the last coordinate?
{: id="exercise-reasoning"}

Let $p_1=1$, $p_2=2$, with weights $(1/2,1/2)$. The relation $2p_1-p_2=0$ is a linear dependence. Why does subtracting $t(2,-1)$ fail to give the proof’s weight transfer for $t>0$?

<details markdown="1">
<summary>Hint</summary>

Compute the new weight sum as well as the represented number.
</details>
<details markdown="1">
<summary>Worked solution</summary>

The new coefficients $(1/2-2t,1/2+t)$ still represent $3/2$, but their sum is $1-t$, not one. For $0<t\le1/4$ they are nonnegative but are not convex weights. Normalizing them changes the represented value to $(3/2)/(1-t)$. The lifted vectors $(1,1)$ and $(2,1)$ are independent, so no nonzero affine dependence exists to remove a point from this representation.
</details>

### 4. Application: preserve two moments
{: id="exercise-application"}

A uniform distribution on $\{0,1,2,3\}$ has mean $3/2$ and second moment $7/2$. Find a distribution supported on $\{0,1,3\}$ that preserves both. What happens to its third moment?

<details markdown="1">
<summary>Hint</summary>

For weights $u,v,w$, solve $u+v+w=1$, $v+3w=3/2$, $v+9w=7/2$.
</details>
<details markdown="1">
<summary>Worked solution</summary>

Subtracting the moment equations gives $6w=2$, so $w=1/3$, $v=1/2$, and $u=1/6$. These weights are nonnegative. The third moments differ:

$$
E_{\mathrm{original}}[X^3]=\frac{0+1+8+27}{4}=9,
\qquad E_{\mathrm{reduced}}[X^3]=\frac12+27\cdot\frac13=\frac{19}{2}.
$$

The preserved feature vector was $(X,X^2)$; no constraint preserved $X^3$. Both distributions have variance $7/2-(3/2)^2=5/4$.
</details>

## References
{: id="references"}

- C. Carathéodory, *Über den Variabilitätsbereich der Fourier’schen Konstanten von positiven harmonischen Funktionen*, **32** (1911), 193–217. [Publisher record and DOI](https://link.springer.com/article/10.1007/BF03014795). The original coefficient problem motivates the geometric formulation.
- [English translation by Nicholas J. Williams](https://nchlswllms.github.io/translations/cc1911.pdf). Read the introduction for the coefficient curve and §I.9 for the original center-of-mass argument. The PDF marks original page numbers; these differ from the PDF viewer’s page numbers.
- Dimitri P. Bertsekas, [*Convex Optimization Theory*, §1.2, pp. 19–22](https://web.mit.edu/dimitrib/www/Convex_Theory_Short_View.pdf#page=29). Supplies modern convex/affine hull definitions and convex and conic versions of the theorem, with proofs.
- [Convexity]({{ '/wiki/optimization/convexity/' | relative_url }}), [Farkas’ Lemma]({{ '/wiki/optimization/farkas-lemma/' | relative_url }}), and [Linear programming]({{ '/wiki/optimization/linear-programming/' | relative_url }}). Continue from convex mixtures to feasibility certificates and optimization over linear constraints.
