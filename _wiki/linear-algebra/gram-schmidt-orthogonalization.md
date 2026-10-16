---
title: Gram–Schmidt orthogonalization
subject: Linear Algebra
interactive_examples: true
orthogonal_examples: true
description: Build perpendicular unit directions by removing projections, preserve successive spans, and understand the difference between classical and modified Gram–Schmidt.
last_modified_at: 2026-10-16
---

## The original problem: expand a function in useful directions

Schmidt's 1907 paper asks how to represent functions using a prescribed family of other functions. Powers, trigonometric functions, and other families provide possible building blocks, but their contributions can overlap. His §3 replaces linearly independent continuous real functions on an interval by normalized, mutually orthogonal functions. The footnote credits essentially the same formulas to Gram. See the original [problem on p. 437 and construction on pp. 442–443](https://gdz.sub.uni-goettingen.de/download/pdf/PPN235181684_0063/LOG_0045.pdf#page=6). This is a function-approximation problem, rather than an algorithm originally stated as a matrix factorization.

A **linear combination** multiplies each building block by a number and adds the results. The **span** is the collection of all such combinations. A family is **linearly independent** if no member can be made from the others. An orthogonal replacement should preserve the approximations we can express while making their coefficients easier to find.

### The original symbolic construction in modern notation

**Modern re-derivation of Schmidt's symbolic problem.** Let $f_1,\ldots,f_n$ be independent continuous real functions on $[a,b]$, with $a<b$. Define the **inner product**, a rule measuring overlap, and its associated length by

$$
\langle f,g\rangle=\int_a^b f(t)g(t)\,dt,
\qquad \lVert f\rVert=\sqrt{\langle f,f\rangle}.
$$

Functions are **orthogonal** when their inner product is zero, and **orthonormal** when they are mutually orthogonal and each has length $1$. Continuity and independence ensure that the nonzero remainder functions below have positive squared integrals. This is the setting of [Schmidt, §3, pp. 442–443](https://gdz.sub.uni-goettingen.de/download/pdf/PPN235181684_0063/LOG_0045.pdf#page=11); we use $f_j,q_j$ in place of his $\varphi_j,\psi_j$.

Start with $q_1=f_1/\lVert f_1\rVert$. To remove the part of $f_2$ that points along $q_1$, set

$$
u_2=f_2-\langle q_1,f_2\rangle q_1.
$$

Why this coefficient? Taking its inner product with $q_1$ gives

$$
\langle q_1,u_2\rangle
=\langle q_1,f_2\rangle-\langle q_1,f_2\rangle\underbrace{\langle q_1,q_1\rangle}_{1}=0.
$$

Then normalize: $q_2=u_2/\lVert u_2\rVert$. For every later function, remove all earlier orthonormal components:

$$
u_j=f_j-\sum_{i=1}^{j-1}\langle q_i,f_j\rangle q_i,
\qquad q_j=\frac{u_j}{\lVert u_j\rVert}.
$$

This is **Gram–Schmidt orthogonalization with normalization**. Orthogonalization alone produces perpendicular $u_j$; normalization also makes their lengths $1$.

### Why this helps approximation

For an orthonormal family $q_1,\ldots,q_n$, consider approximating a target function $g$ by $\sum_i c_iq_i$. Expanding the squared error and using $\langle q_i,q_j\rangle=0$ for $i\ne j$ gives

$$
\left\lVert g-\sum_i c_iq_i\right\rVert^2
=\lVert g\rVert^2-\sum_i\langle q_i,g\rangle^2
+\sum_i\bigl(c_i-\langle q_i,g\rangle\bigr)^2.
$$

Each coefficient can now be chosen independently: $c_i=\langle q_i,g\rangle$. The overlap between the original building blocks has disappeared from the coefficient calculation. This finite-dimensional derivation explains the role of orthogonality in the original expansion problem. It does not prove convergence of an infinite expansion; Schmidt treats those additional questions separately.

### A concrete function calculation

**Supplementary invented specialization, not Schmidt's numerical data.** Choose $[a,b]=[0,1]$ and $f_1(t)=1$, $f_2(t)=t$. Then

$$
\lVert f_1\rVert^2=\int_0^1 1\,dt=1,
\quad q_1=1,
\quad \langle q_1,f_2\rangle=\int_0^1t\,dt=\frac12.
$$

Therefore $u_2(t)=t-\frac12$. Its squared length is

$$
\int_0^1\left(t-\frac12\right)^2dt
=\frac13-\frac12+\frac14=\frac1{12},
\qquad q_2(t)=\sqrt{12}\left(t-\frac12\right).
$$

The integral of $q_2$ is zero and its squared integral is $1$. Subtracting the mean removed the constant component. The two new functions still express every straight line: $\alpha+\beta t=(\alpha+\beta/2)q_1+(\beta/\sqrt{12})q_2$.

The original §3 supplies general functions and formulas, rather than an observation table for this calculation. The interval and functions just chosen are a teaching specialization, not recovered historical measurements.

## From functions to coordinate vectors

For vectors in $\mathbb R^m$, replace the integral by the **dot product**

$$
x^Ty=\sum_{k=1}^m x_ky_k,
\qquad \lVert x\rVert_2=\sqrt{x^Tx}.
$$

The superscript $T$ transposes a column into a row. For example, $(1,2)^T$ has squared length $5$. See [vector norms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }}) for length and [the matrix-decomposition overview]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}) for matrix notation. The vector construction and its successive-span property are developed in [ALAFF, §3.2.1](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html).

### A projection is the part already explained

For a unit vector $q$, the vector $(q^Ta)q$ is the **orthogonal projection** of $a$ onto its line: the closest vector on that line. Indeed,

$$
\lVert a-cq\rVert_2^2
=\lVert a\rVert_2^2-(q^Ta)^2+(c-q^Ta)^2,
$$

so the best coefficient is $c=q^Ta$. For a nonzero vector $v$ that is not normalized, the coefficient instead is $(v^Ta)/(v^Tv)$. Omitting this denominator is a common mistake.

### Worked vectors: keep the new part, then normalize

**Supplementary invented example, shared with the QR page.** Let

$$
a_1=\begin{bmatrix}1\\1\\1\end{bmatrix},
\qquad a_2=\begin{bmatrix}0\\1\\2\end{bmatrix}.
$$

The first column has length $\sqrt3$, so

$$
q_1=\frac1{\sqrt3}\begin{bmatrix}1\\1\\1\end{bmatrix}.
$$

The second column's coefficient along this direction is

$$
r_{12}=q_1^Ta_2=\frac{0+1+2}{\sqrt3}=\sqrt3.
$$

Subtract its projection, then measure the remainder:

$$
u_2=a_2-r_{12}q_1
=\begin{bmatrix}0\\1\\2\end{bmatrix}-\begin{bmatrix}1\\1\\1\end{bmatrix}
=\begin{bmatrix}-1\\0\\1\end{bmatrix},
\qquad r_{22}=\lVert u_2\rVert_2=\sqrt2.
$$

Thus $q_2=(-1,0,1)^T/\sqrt2$. Check the result directly:

$$
q_1^Tq_2=\frac{-1+0+1}{\sqrt6}=0,
\qquad q_1^Tq_1=q_2^Tq_2=1.
$$

We have also kept a record of how to reconstruct the input:

$$
a_1=\sqrt3\,q_1,
\qquad a_2=\sqrt3\,q_1+\sqrt2\,q_2.
$$

These coefficients become the triangular factor in [QR factorization]({{ '/wiki/linear-algebra/qr-factorization/' | relative_url }}).

## Why the algorithm works, and when it stops

Given independent $a_1,\ldots,a_n\in\mathbb R^m$, classical Gram–Schmidt computes

$$
r_{ij}=q_i^Ta_j\quad(i<j),\qquad
u_j=a_j-\sum_{i<j}r_{ij}q_i,\qquad
r_{jj}=\lVert u_j\rVert_2,\qquad q_j=u_j/r_{jj}.
$$

For any earlier $q_k$, orthonormality makes all but one term disappear:

$$
q_k^Tu_j=q_k^Ta_j-\sum_{i<j}(q_i^Ta_j)q_k^Tq_i=0.
$$

Moreover, each new $q_j$ is built from $a_j$ and earlier directions, and the reconstruction formula expresses $a_j$ in terms of the new directions. Consequently, for every $j$,

$$
\operatorname{span}(a_1,\ldots,a_j)
=\operatorname{span}(q_1,\ldots,q_j).
$$

This is stronger than preserving only the final span. It explains the order dependence of the output. See [ALAFF's successive-span derivation](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html).

### Zero remainder means no new direction

If $a_2=2a_1$, subtracting its first projection leaves zero. There is no unit vector $0/\lVert0\rVert$. In exact arithmetic this detects dependence; a zero first vector fails immediately. One can skip dependent inputs to obtain a basis for the span, but then the output has fewer vectors. A zero remainder does not mean that a matrix has no QR factorization: an orthonormal family can be completed with additional directions. The [QR page]({{ '/wiki/linear-algebra/qr-factorization/#existence-uniqueness-and-dependent-columns' | relative_url }}) distinguishes these statements.

### Normalizing the inputs is insufficient

The vectors $(1,0)^T$ and $(1,1)^T/\sqrt2$ both have length $1$, but their dot product is $1/\sqrt2$. Length normalization does not remove overlap. Conversely, perpendicular vectors need not have unit length.

### Order changes the directions

In the worked example, processing $a_2$ first would give $q_1=(0,1,2)^T/\sqrt5$, rather than $(1,1,1)^T/\sqrt3$. Both orders describe the same final plane, but the first line differs. Gram–Schmidt is not a procedure for finding a unique preferred set of axes without an ordering convention.

## Classical and modified Gram–Schmidt in finite precision

The exact formulas assume exact dot products and subtraction. Computers round these operations. When a column is almost explained by earlier columns, its remainder can be much smaller than the numbers subtracted to obtain it. This **cancellation** can magnify the relative importance of rounding error.

**Classical Gram–Schmidt (CGS)** measures every coefficient against the original column $a_j$. **Modified Gram–Schmidt (MGS)** measures against the progressively updated remainder:

```text
for j = 1, ..., n:
    v = a_j
    for i = 1, ..., j-1:
        r_ij = dot(q_i, v)
        v = v - r_ij * q_i
    r_jj = norm(v)
    if r_jj is zero: report dependence and stop
    q_j = v / r_jj
```

In CGS, replace `dot(q_i, v)` by `dot(q_i, a_j)`. The two algorithms agree in exact arithmetic because earlier subtractions are orthogonal to $q_i$. They can differ substantially after rounding. See [Persson's MIT notes, slides 3–5](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/be0cdadd9de56ff8d20d9a0c6d6d9206_MIT18_335JS19_lec9_reading.pdf#page=1).

### Published example: an apparently tiny change matters

**Published illustrative family, modern recalculation.** Persson's slides 6–7 use

$$
a_1=(1,\varepsilon,0,0)^T,\quad
 a_2=(1,0,\varepsilon,0)^T,\quad
 a_3=(1,0,0,\varepsilon)^T,
$$

with positive small $\varepsilon$, and simplify using $1+\varepsilon^2\approx1$. Under that stated rounding model, both methods obtain $q_2\approx(0,-1,1,0)^T/\sqrt2$. CGS then gives $q_3\approx(0,-1,0,1)^T/\sqrt2$, whose dot product with $q_2$ is $1/2$. MGS instead uses the updated remainder to get $q_3\approx(0,-1,-1,2)^T/\sqrt6$, whose dot product with $q_2$ is zero. These are consequences of the source's simplified rounding model, not exact-arithmetic results or a prediction for every machine and every $\varepsilon$. See [the original slides 6–7](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/be0cdadd9de56ff8d20d9a0c6d6d9206_MIT18_335JS19_lec9_reading.pdf#page=1).

MGS is generally more reliable than a single CGS pass, but it can still lose orthogonality for nearly dependent inputs. **Reorthogonalization** repeats projection removal against the existing basis. For dense QR, Householder transformations are another approach. MIT's [numerical-methods discussion](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/pages/week-4/) introduces these remedies. A numerical implementation needs a scale-aware policy for tiny remainders; testing against a fixed absolute constant is not a universal rank test.

## Interactive example: watch a direction disappear

{% include orthogonal-lab.html kind="gram-schmidt" title="Subtract the mean, then measure the new direction" source_url="https://gdz.sub.uni-goettingen.de/download/pdf/PPN235181684_0063/LOG_0045.pdf#page=11" source_label="Schmidt, §3, pp. 442–443" plot_description="At sample positions 0, 1, and 2, show the second column, its constant projection, and its mean-zero remainder." %}

The lab is a **modern finite-vector reconstruction** of the original symbolic orthogonalization problem. Its dimensionless baseline $a_1=(1,1,1)^T$, $a_2=(0,1,2)^T$ is invented; no original observation data are claimed. Edit the three entries of $a_2$ and watch its mean become the coefficient of the constant projection. The plot uses sample position horizontally and component value vertically; it is not a picture of the three-dimensional vectors themselves. The worked vectors above provide the baseline without JavaScript.

Try making all three entries equal, then making them almost equal. The first produces exact dependence; the second gives a small independent component whose normalized direction can be sensitive to changes. Restore the labeled teaching baseline to return to the worked calculation.

## Practice problems

These exercises and their numerical values are original teaching examples.

### 1. Hand calculation: two directions

Apply Gram–Schmidt to $a_1=(1,1,0)^T$ and $a_2=(1,0,1)^T$. Give the projection, remainder, and normalized vectors.

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>Reveal a hint</summary>

First find $q_1$; its dot product with $a_2$ is $1/\sqrt2$.

</details>
<details markdown="1"><summary>Reveal the worked solution</summary>

$q_1=(1,1,0)^T/\sqrt2$. The projection is $(1/2,1/2,0)^T$, so $u_2=(1/2,-1/2,1)^T$ has squared length $3/2$. Hence $q_2=(1,-1,2)^T/\sqrt6$. Their dot product is zero and both lengths are $1$.

</details>
</div>

### 2. Hand calculation: functions are vectors too

Starting with $1,t,t^2$ on $[-1,1]$, using the integral inner product, find the third unnormalized orthogonal function.

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>Reveal a hint</summary>

Odd powers integrate to zero on this symmetric interval. Remove the constant part of $t^2$.

</details>
<details markdown="1"><summary>Reveal the worked solution</summary>

$q_1=1/\sqrt2$ and $q_2=\sqrt{3/2}\,t$. The coefficient $\langle q_1,t^2\rangle=2/(3\sqrt2)$ produces the constant projection $1/3$, while $\langle q_2,t^2\rangle=0$. Thus $u_3=t^2-1/3$. Its squared length is $2/5-4/9+2/9=8/45$, giving $q_3=\sqrt{45/8}(t^2-1/3)$ if normalization is desired.

</details>
</div>

### 3. Interpretation: a vanished column

After processing independent $a_1,a_2$, the next input is $a_3=3a_1-a_2$. Does a zero third remainder show that the first two directions were wrong?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>Reveal a hint</summary>

Compare the span before and after adding $a_3$.

</details>
<details markdown="1"><summary>Reveal the worked solution</summary>

No. The third input is already in the existing plane, so its projection onto that plane is itself. The remainder is zero and the span still has dimension $2$. Keep the first two directions and report dependence; do not normalize the zero vector.

</details>
</div>

### 4. Logic: prove that the new direction survives

Assuming the first $j$ inputs are independent, prove that $u_j\ne0$. Why does this argument need exact arithmetic?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>Reveal a hint</summary>

If $u_j=0$, use the reconstruction formula and the equality of earlier spans.

</details>
<details markdown="1"><summary>Reveal the worked solution</summary>

$u_j=0$ implies $a_j=\sum_{i<j}(q_i^Ta_j)q_i$. Each earlier $q_i$ lies in the span of $a_1,\ldots,a_{j-1}$, contradicting independence. In floating-point arithmetic, a computed zero or tiny remainder also reflects rounding, scaling, and data uncertainty. The exact proof does not supply a universal numerical threshold.

</details>
</div>

### 5. Practical application: remove an offset from a signal

A dimensionless signal is $s=(2,5,8)^T$. Remove its component along $(1,1,1)^T$, and normalize the remaining signal. What information does normalization discard?

<div class="wiki-exercise" markdown="1">
<details markdown="1"><summary>Reveal a hint</summary>

The constant projection is the sample mean repeated three times.

</details>
<details markdown="1"><summary>Reveal the worked solution</summary>

The mean is $5$, so the projection is $(5,5,5)^T$ and the remainder is $(-3,0,3)^T$. Its length is $3\sqrt2$ and its normalized form is $(-1,0,1)^T/\sqrt2$. Removing the constant discards the offset; normalizing additionally discards the amplitude. Retain the mean and length if reconstruction matters.

</details>
</div>

## Further learning

- [Schmidt's original paper, §3, pp. 442–443](https://gdz.sub.uni-goettingen.de/download/pdf/PPN235181684_0063/LOG_0045.pdf#page=11): compare the modern vector recurrence with the original integral formulas and the dependence argument.
- [ALAFF: Classical Gram–Schmidt](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html): follow the successive-span invariant into a matrix representation.
- [Persson's MIT notes](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/resources/mit18_335js19_lec9_reading/): compare the two algorithms and work through their rounding example.

## Related pages

- [QR factorization]({{ '/wiki/linear-algebra/qr-factorization/' | relative_url }})
- [Vector norms]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }})
- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})
- [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }})

## References

1. Schmidt, E. (1907). *Zur Theorie der linearen und nichtlinearen Integralgleichungen. I. Teil: Entwicklung willkürlicher Funktionen nach Systemen vorgeschriebener*. Mathematische Annalen, 63, 433–476. [Original digitization](https://gdz.sub.uni-goettingen.de/download/pdf/PPN235181684_0063/LOG_0045.pdf); pp. 437 and 442–443 are the problem and construction used here. The downloadable PDF includes a library cover, so printed p. 442 is PDF page 11.
2. van de Geijn, R. A., and Myers, M. *Advanced Linear Algebra: Foundations to Frontiers*, [§3.2.1, Classical Gram–Schmidt](https://www.cs.utexas.edu/~flame/laff/alaff/chapter03-classical-gram-schmidt.html).
3. Persson, P.-O. (2006). *Gram–Schmidt Orthogonalization*, MIT 18.335J/6.337J, lecture slides dated September 21, 2006, [distributed with the Spring 2019 course](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/resources/mit18_335js19_lec9_reading/). Slides 3–7 compare CGS and MGS.
4. Johnson, S. G. (2019). MIT OpenCourseWare, *Introduction to Numerical Methods*, [Week 4](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/pages/week-4/). Numerical orthogonality and alternative constructions.
