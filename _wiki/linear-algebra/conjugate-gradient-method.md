---
title: Conjugate gradient method
subject: Linear Algebra
lang: en
translation_key: wiki-linear-algebra-conjugate-gradient-method
interactive_examples: true
cg_examples: true
description: Derive conjugate gradients from Hestenes and Stiefel's published system, follow its four steps, and explore residuals, energy error, and preconditioning.
last_modified_at: 2026-10-19
---

## Solving large systems without changing their coefficients

An early machine-computation problem was to solve many simultaneous linear equations using little storage, while retaining useful structure such as zero coefficients. In their 1952 paper, Hestenes and Stiefel explicitly sought a method that repeatedly uses the original matrix and improves an approximate solution. Their introduction connects this requirement to difference equations approximating boundary-value problems. See [the original paper, section 1, p. 409](https://math.nist.gov/mcsd/Reports/2002/hestenes-steifel-52.pdf#page=1).

The **conjugate gradient method**, abbreviated **CG**, solves $Ax=b$ by updating an estimate, a residual, and a search direction. Standard linear CG requires a real [symmetric positive-definite matrix]({{ '/wiki/linear-algebra/symmetric-positive-definite-matrix/' | relative_url }}), or SPD matrix:

$$
A^T=A,\qquad v^TAv>0\quad\text{for every }v\ne0.
$$

These assumptions make the quadratic energy strictly convex and every nonzero search direction have positive curvature. For complex systems, use a Hermitian positive-definite matrix and conjugate transposes. See [SciPy's CG requirements](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.linalg.cg.html).

[Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }}) solves the same class of systems by factoring $A$. CG instead needs the operation $v\mapsto Av$. That distinction becomes useful when $A$ is [sparse]({{ '/wiki/linear-algebra/sparse-matrices-and-storage-formats/' | relative_url }}) or the product can be computed without assembling a matrix. We will derive the updates from a published numerical problem before describing the general method.

## The original four-equation illustration

**Original published illustrative data, without physical units.** Hestenes and Stiefel's [section 19, Example 1 and Table 1, p. 433](https://math.nist.gov/mcsd/Reports/2002/hestenes-steifel-52.pdf#page=25), use

$$
A=\begin{bmatrix}
1&2&-1&1\\
2&5&0&2\\
-1&0&6&0\\
1&2&0&3
\end{bmatrix},\qquad
b=\begin{bmatrix}0\\2\\-1\\1\end{bmatrix},\qquad
x_0=\begin{bmatrix}1\\0\\0\\0\end{bmatrix}.
$$

The source writes $k$ for the right-hand side, $a_i,b_i$ for update coefficients, and $h$ for the solution. Here we rename them $b,\alpha_i,\beta_i,x_\star$. The matrix, initial estimate, and right-hand side are unchanged. Calculations below are modern exact-arithmetic re-derivations of that example, not observations from an application.

First check the assumptions. The matrix is symmetric, and the following original calculation certifies positive definiteness:

$$
v^TAv=(v_1+2v_2-v_3+v_4)^2
       +(v_2+2v_3)^2+(v_3+v_4)^2+v_4^2.
$$

Expand the squares to recover $A$. If the sum is zero, the last square gives $v_4=0$, the third gives $v_3=0$, the second gives $v_2=0$, and the first gives $v_1=0$. Thus every nonzero vector has positive energy. This is the sum-of-squares reasoning behind Cholesky.

### The residual tells us what the equations still miss

The **residual** is the vector $r_k=b-Ax_k$. Its coordinates are the discrepancies in the individual equations. For the initial estimate,

$$
Ax_0=(1,2,-1,1)^T,\qquad r_0=(-1,0,0,0)^T.
$$

Only the first equation is wrong initially. That does **not** mean the other unknowns are already correct: changing one coordinate can disturb several equations. Indeed, the final solution will be $x_\star=(-65,24,-11,6)^T$.

To choose a correction, turn the equations into a minimization problem. Define

$$
f(x)=\frac12x^TAx-b^Tx.
$$

Symmetry gives $\nabla f(x)=Ax-b=-r$. A **gradient** collects the coordinate slopes; its negative points in the direction of fastest local decrease in ordinary Euclidean distance. SPD makes this [quadratic function]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }}) [strictly convex]({{ '/wiki/optimization/convexity/' | relative_url }}), so its stationary point $Ax=b$ is its unique minimum. This quadratic interpretation is developed in [Shewchuk, sections 3–4](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf).

### Derive the first step by minimizing along a line

Start with $p_0=r_0$. Along a general direction $p\ne0$,

$$
f(x+\alpha p)=f(x)-\alpha p^Tr+\frac{\alpha^2}{2}p^TAp.
$$

Differentiate this one-variable quadratic and set its derivative to zero:

$$
\alpha=\frac{p^Tr}{p^TAp}.
$$

At the first step, $p_0=r_0$, so

$$
Ap_0=(-1,-2,1,-1)^T,\quad
\alpha_0=\frac{r_0^Tr_0}{p_0^TAp_0}=1.
$$

Therefore

$$
x_1=x_0+p_0=0,\qquad
r_1=r_0-Ap_0=(0,2,-1,1)^T.
$$

The first discrepancy disappeared, but three others appeared. The residual norm grew from $1$ to $\sqrt6$. We need to understand what “improvement” means before rejecting the step.

## Improving energy without undoing previous work

Let $e_k=x_k-x_\star$ be the **solution error**. Residual and error are different vectors:

$$
r_k=-Ae_k.
$$

Since $Ax_\star=b$, expansion and cancellation give

$$
f(x)-f(x_\star)=\frac12(x-x_\star)^TA(x-x_\star)
=\frac12\lVert x-x_\star\rVert_A^2.
$$

Here $\lVert v\rVert_A=\sqrt{v^TAv}$ is the **energy norm**: it measures length using the matrix's curvature. It is a [vector norm]({{ '/wiki/linear-algebra/vector-norm/' | relative_url }}), with different directional weights from the Euclidean norm $\lVert v\rVert_2=\sqrt{\sum_i v_i^2}$. See [Stanford's CG lecture, slides 6–8](https://web.stanford.edu/class/ee364b/lectures/conj_grad_slides.pdf#page=7).

### Conjugate directions are perpendicular in the energy geometry

After moving along $p_0$, line minimization makes the new gradient orthogonal to $p_0$. To preserve that condition during a later move along $p_1$, require

$$
p_0^T\nabla f(x_1+\alpha p_1)
=p_0^T\nabla f(x_1)+\alpha p_0^TAp_1=0.
$$

The first term is already zero. Thus the next direction should satisfy $p_0^TAp_1=0$. Directions with this property are **A conjugate**. They need not be perpendicular in the ordinary dot product. This is a weighted version of the [orthogonality used in Gram–Schmidt]({{ '/wiki/linear-algebra/gram-schmidt-orthogonalization/' | relative_url }}); see [Shewchuk, section 7](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf).

Construct $p_1=r_1+\beta_0p_0$. Conjugacy requires

$$
\beta_0=-\frac{r_1^TAp_0}{p_0^TAp_0}.
$$

In our example, $r_1^TAp_0=-6$ and $p_0^TAp_0=1$. Hence

$$
\beta_0=6,\qquad p_1=(-6,2,-1,1)^T,\qquad Ap_1=(0,0,0,1)^T.
$$

In particular, $p_0^TAp_1=0$, while $p_0^Tp_1=6\ne0$. Ordinary perpendicularity would be the wrong test.

### Finish the published calculation

Since $p_1^Tr_1=6$ and $p_1^TAp_1=1$, the next step length is $\alpha_1=6$:

$$
x_2=(-36,12,-6,6)^T,\qquad r_2=(0,2,-1,-5)^T.
$$

Now $\beta_1=\lVert r_2\rVert_2^2/\lVert r_1\rVert_2^2=30/6=5$, giving

$$
p_2=(-30,12,-6,0)^T,\quad Ap_2=(0,0,-6,-6)^T,\quad
\alpha_2=\frac{30}{36}=\frac56.
$$

This yields $x_3=(-61,22,-11,6)^T$ and $r_3=(0,2,4,0)^T$. Finally,

$$
\beta_2=\frac{20}{30}=\frac23,\quad
p_3=(-20,10,0,0)^T,\quad Ap_3=(0,10,20,0)^T,\quad
\alpha_3=\frac{20}{100}=\frac15.
$$

Thus $x_4=(-65,24,-11,6)^T$. Verify it directly:

$$
Ax_4=\begin{bmatrix}-65+48+11+6\\-130+120+12\\65-66\\-65+48+18\end{bmatrix}
=\begin{bmatrix}0\\2\\-1\\1\end{bmatrix}=b.
$$

The iterates and coefficients reproduce [Table 1, p. 433](https://math.nist.gov/mcsd/Reports/2002/hestenes-steifel-52.pdf#page=25). The norm columns below are our exact calculations from those vectors:

| Step $k$ | Estimate $x_k^T$ | $\lVert r_k\rVert_2^2$ | $\lVert e_k\rVert_A^2$ |
| --- | --- | --- | --- |
| 0 | $(1,0,0,0)$ | 1 | 66 |
| 1 | $(0,0,0,0)$ | 6 | 65 |
| 2 | $(-36,12,-6,6)$ | 30 | 29 |
| 3 | $(-61,22,-11,6)$ | 20 | 4 |
| 4 | $(-65,24,-11,6)$ | 0 | 0 |

Energy error decreases at every step, even while the residual initially grows. The first two residuals are orthogonal: $(-1,0,0,0)^T(0,2,-1,1)=0$. Orthogonality constrains directions, not their lengths.

{% include cg-lab.html %}

The lab starts with the source's matrix, right-hand side, and initial estimate. Compare the two curves: residual measures equation mismatch, while energy error measures distance to the minimum. Select successive steps to match the table. Steepest descent, Jacobi PCG, or a changed starting coordinate are **modern hypothetical experiments**, not additional results printed in Table 1. The worked derivation and table remain readable without JavaScript.

## From conjugate directions to the short CG recurrence

For an SPD matrix and exact arithmetic, the usual linear CG updates are

$$
\begin{aligned}
r_0&=b-Ax_0,& p_0&=r_0,\\
\alpha_k&=\frac{r_k^Tr_k}{p_k^TAp_k},&
x_{k+1}&=x_k+\alpha_kp_k,\\
r_{k+1}&=r_k-\alpha_kAp_k,&
\beta_k&=\frac{r_{k+1}^Tr_{k+1}}{r_k^Tr_k},\\
p_{k+1}&=r_{k+1}+\beta_kp_k.
\end{aligned}
$$

Stop if the residual is zero before forming another quotient. These are the unpreconditioned form of [Netlib's CG template](https://www.netlib.org/linalg/html_templates/node20.html).

Why does the line-search numerator become $r_k^Tr_k$? Exact CG residuals are orthogonal to previous search directions. Since $p_k=r_k+\beta_{k-1}p_{k-1}$, we have $p_k^Tr_k=r_k^Tr_k$.

Why does the conjugacy formula become a ratio of squared residuals? The residual update gives $Ap_k=(r_k-r_{k+1})/\alpha_k$. Since $r_{k+1}^Tr_k=0$,

$$
-\frac{r_{k+1}^TAp_k}{p_k^TAp_k}
=\frac{r_{k+1}^Tr_{k+1}}{\alpha_k p_k^TAp_k}
=\frac{r_{k+1}^Tr_{k+1}}{r_k^Tr_k}.
$$

The coupled recurrences actually make each new direction conjugate to **all** previous directions, and each new residual orthogonal to previous residuals. These are exact-arithmetic properties, not independent assumptions to test after every floating-point step. [Netlib's theory discussion](https://www.netlib.org/linalg/html_templates/node21.html) explains the short recurrence and its minimization property.

### The growing space of possible corrections

A **span** consists of all linear combinations of listed vectors. After $k$ steps, CG searches

$$
x_0+\mathcal K_k(A,r_0),\qquad
\mathcal K_k(A,r_0)=\operatorname{span}\{r_0,Ar_0,\ldots,A^{k-1}r_0\}.
$$

This is a **Krylov subspace**. The formula describes which corrections are available; it does not tell an implementation to store matrix powers. CG minimizes $\lVert x-x_\star\rVert_A$ over this affine space using a few working vectors. Nonzero conjugate directions are linearly independent, so there can be at most $n$ of them in $\mathbb R^n$. Hence exact CG terminates in at most $n$ steps, and sometimes earlier. See [Stanford, slides 9–10 and 24](https://web.stanford.edu/class/ee364b/lectures/conj_grad_slides.pdf#page=10).

## Why convergence depends on more than the number of unknowns

An **eigenvector** satisfies $Av=\lambda v$: along this direction, $A$ acts as scalar multiplication by its **eigenvalue** $\lambda$. All SPD eigenvalues are positive. Their ratio

$$
\kappa_2(A)=\frac{\lambda_{\max}(A)}{\lambda_{\min}(A)}
$$

is the spectral condition number; compare [matrix norms and sensitivity]({{ '/wiki/linear-algebra/matrix-norm/' | relative_url }}). A standard bound is

$$
\frac{\lVert e_k\rVert_A}{\lVert e_0\rVert_A}
\le2\left(\frac{\sqrt\kappa-1}{\sqrt\kappa+1}\right)^k,
\qquad \kappa=\kappa_2(A),\quad e_0\ne0.
$$

This is a worst-case energy-error bound, not a prediction of the residual at each step. Eigenvalue clustering can make convergence substantially faster. See [Netlib's convergence discussion](https://www.netlib.org/linalg/html_templates/node22.html).

The reason eigenvalues enter is visible without a full convergence proof. Each correction is built from powers of $A$, so $e_k=q_k(A)e_0$ for a polynomial of degree at most $k$ with $q_k(0)=1$. In an eigenvector direction, the remaining error is multiplied by $q_k(\lambda)$. CG chooses corrections that suppress the error on the spectrum actually present. The condition-number bound controls the entire interval between the extreme eigenvalues, which can be pessimistic when only a few clusters matter. See [Stanford's spectral derivation, slides 12–16](https://web.stanford.edu/class/ee364b/lectures/conj_grad_slides.pdf#page=13).

### Cost and finite precision

An iteration uses one matrix-vector product, a constant number of dot products, and vector updates. If $s$ entries are stored in a sparse matrix, the cost is $O(s+n)$ per iteration, with $O(n)$ extra working storage. A dense product costs $O(n^2)$. Preconditioning adds its own setup and application costs. See [Shewchuk, section 10](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf).

In floating-point arithmetic, rounding erodes exact orthogonality and conjugacy. The mathematical $n$-step result is therefore not a practical iteration limit. Also, recursively updated $r$ can differ from the true residual $b-Ax$. Recompute the latter before accepting the answer. Restarting from the current estimate can restore consistency, but discards the accumulated directions. See [Shewchuk, sections 8 and 11](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf).

For $b\ne0$, the original identity $e=-A^{-1}r$ yields

$$
\frac{\lVert e\rVert_2}{\lVert x_\star\rVert_2}
\le\kappa_2(A)\frac{\lVert r\rVert_2}{\lVert b\rVert_2}.
$$

Indeed, $\lVert e\rVert_2\le\lVert A^{-1}\rVert_2\lVert r\rVert_2$ and $\lVert b\rVert_2\le\lVert A\rVert_2\lVert x_\star\rVert_2$. A small relative residual guarantees a small relative error only to the extent allowed by conditioning.

## Preconditioning changes the geometry

To reduce the work, choose a fixed SPD matrix $P$ for which solving $Pz=r$ is cheap. In this section $P$ approximates $A$, and the action we apply is $P^{-1}$. The equivalent symmetric system is

$$
\widetilde A=P^{-1/2}AP^{-1/2},\quad
\widetilde b=P^{-1/2}b,\quad x=P^{-1/2}y.
$$

Here $P^{1/2}$ is the SPD square root; the transformation explains the geometry without requiring an implementation to form it. The aim is a more favorable spectrum for $\widetilde A$. Although $P^{-1}A$ is generally not symmetric in the Euclidean inner product, **preconditioned CG**, or **PCG**, preserves the appropriate geometry. See [PETSc's equivalent interpretations of PCG](https://petsc.org/release/manualpages/KSP/KSPCG/).

Apply $z_k=P^{-1}r_k$, initialize $p_0=z_0$, and replace the scalar formulas by

$$
\alpha_k=\frac{r_k^Tz_k}{p_k^TAp_k},\qquad
\beta_k=\frac{r_{k+1}^Tz_{k+1}}{r_k^Tz_k},\qquad
p_{k+1}=z_{k+1}+\beta_kp_k.
$$

The $x$ and $r$ updates stay the same. Setting $P=I$ recovers CG. **Jacobi preconditioning** takes $P=\operatorname{diag}(A)$, so applying its inverse divides each residual coordinate by the corresponding diagonal. For the published example this is $z=(r_1,r_2/5,r_3/6,r_4/3)^T$, where the subscripts here label coordinates. These are applications of [Netlib's preconditioning formulation](https://www.netlib.org/templates/templates.html), not claims that the original example used PCG.

Judge a preconditioner by total solve time and memory, including setup. For example, $P=A$ makes the transformed operator the identity, but solving with $P$ would already be the original problem. A general nonsymmetric or changing preconditioner does not satisfy the assumptions of this standard PCG recurrence.

## Using a library and checking the result

The following modern Python example uses the published system and Jacobi PCG. SciPy's argument `M` represents an approximation to $A^{-1}$, so it applies $P^{-1}$ in our notation. Its stopping rule is $\lVert b-Ax\rVert_2\le\max(\texttt{atol},\texttt{rtol}\lVert b\rVert_2)$; `info == 0` indicates success. See [the official API](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.linalg.cg.html).

```python
import numpy as np
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import LinearOperator, cg

A = csr_matrix([[1., 2., -1., 1.],
                [2., 5.,  0., 2.],
                [-1., 0., 6., 0.],
                [1., 2.,  0., 3.]])
b = np.array([0., 2., -1., 1.])
x0 = np.array([1., 0., 0., 0.])
inverse_diagonal = 1.0 / A.diagonal()
M = LinearOperator(A.shape,
                   matvec=lambda r: inverse_diagonal * r,
                   dtype=float)
rtol, atol = 1e-10, 1e-12
x, info = cg(A, b, x0=x0, M=M, rtol=rtol, atol=atol, maxiter=100)
residual = np.linalg.norm(b - A @ x)
target = max(atol, rtol * np.linalg.norm(b))
if info != 0 or not np.isfinite(residual) or residual > target:
    raise RuntimeError(f"CG incomplete: info={info}, residual={residual}")
print(x)  # approximately [-65., 24., -11., 6.]
```

The absolute tolerance is useful when $b=0$ or very small. Check matrix assumptions before solving; the function does not supply a general SPD certificate.

## Common misconceptions and counterexamples

These counterexamples are supplementary invented teaching examples.

- **Symmetry is enough.** For $A=\operatorname{diag}(1,-1)$ and $r_0=p_0=(1,1)^T$, $p_0^TAp_0=0$. The CG quotient fails even though $A$ is symmetric and invertible. Positive definiteness prevents this zero-curvature direction.
- **A positive diagonal is enough.** The symmetric matrix with rows $(1,2)$ and $(2,1)$ has positive diagonal entries, but $(1,-1)A(1,-1)^T=-2$. Check the full quadratic form.
- **Every residual must shrink.** The published example above is already a counterexample. Its squared residuals begin $1,6,30$, while energy error decreases.
- **CG minimizes the ordinary residual norm over its search space.** Its defining minimization is energy error. The two norms measure different quantities.
- **Every least-squares problem can be passed directly to CG.** For a rectangular matrix $B$, normal equations use $B^TBx=B^Td$. This matrix is SPD only when $B$ has independent columns, and $\kappa_2(B^TB)=\kappa_2(B)^2$. Consider [QR factorization]({{ '/wiki/linear-algebra/qr-factorization/' | relative_url }}) or a dedicated least-squares solver when conditioning matters. See [Shewchuk, section 13](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf).
- **Nonlinear CG has the same finite-step guarantee.** It uses gradients and a line search for a general objective; the exact quadratic identities above no longer apply. See [Shewchuk, section 14](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf).

## Practice problems

These are original exercises; the first two reuse the published numerical data. Try each before revealing the hint and worked solution.

### 1. Hand calculation: check the second direction

From $r_1=(0,2,-1,1)^T$ and $p_0=(-1,0,0,0)^T$, compute $\beta_0$, $p_1$, and $\alpha_1$. Check both ordinary orthogonality and A conjugacy between $p_0$ and $p_1$.

<details markdown="1">
<summary>Hint</summary>

Use $\lVert r_0\rVert_2^2=1$ and calculate $Ap_1$ before forming the step length.

</details>

<details markdown="1">
<summary>Worked solution</summary>

$\beta_0=6/1=6$, so $p_1=(-6,2,-1,1)^T$ and $Ap_1=(0,0,0,1)^T$. Hence $p_1^TAp_1=1$ and $\alpha_1=6$. While $p_0^Tp_1=6$, $p_0^TAp_1=0$. The directions are conjugate, not Euclidean orthogonal.

</details>

### 2. Interpretation: did the first step make things worse?

A monitor reports a rise in residual norm from $1$ to $\sqrt6$ on the published baseline. Should it declare divergence? Compute the change in the objective using the energy-error table. What would you monitor in practice?

<details markdown="1">
<summary>Hint</summary>

The objective gap is half the squared energy error. A single increase and sustained failure to reach a tolerance are different evidence.

</details>

<details markdown="1">
<summary>Worked solution</summary>

No. The objective gap decreases from $66/2=33$ to $65/2=32.5$, a decrease of $0.5$. The exact example converges in four steps. In a real solve the unknown solution prevents directly computing its energy error; monitor the true residual against an application-based tolerance, iteration count, and progress over several steps. Investigate persistent stagnation or breakdown rather than treating one residual increase as a proof of divergence.

</details>

### 3. Logical reasoning: why can there be only n directions?

Let $p_0,\ldots,p_{m-1}$ be nonzero, mutually A conjugate vectors for SPD $A$. Prove that they are linearly independent. Why does the argument fail for a merely positive-semidefinite matrix?

<details markdown="1">
<summary>Hint</summary>

Multiply a proposed dependence $\sum_i c_ip_i=0$ by $p_j^TA$.

</details>

<details markdown="1">
<summary>Worked solution</summary>

All cross terms vanish, leaving $c_jp_j^TAp_j=0$. SPD makes $p_j^TAp_j>0$, hence $c_j=0$ for every $j$. Thus $m\le n$. For a positive-semidefinite matrix, a nonzero null vector has zero energy, so this last division is unavailable. Special compatible singular problems may still be solvable, but this proof and the standard guarantees require SPD.

</details>

### 4. Practical application: a diagonal preconditioner

For the supplementary invented system $A=\operatorname{diag}(1,100)$, $b=(1,100)^T$, and $x_0=0$, calculate the first unpreconditioned CG step. Then use $P=A$ in PCG and explain why one step suffices. Is this a useful strategy for every matrix?

<details markdown="1">
<summary>Hint</summary>

Without preconditioning, $p_0=r_0=b$. With this diagonal $P$, $z_0=P^{-1}r_0=(1,1)^T$.

</details>

<details markdown="1">
<summary>Worked solution</summary>

Unpreconditioned CG gives $r_0^Tr_0=10001$ and $p_0^TAp_0=1000001$, so $\alpha_0=10001/1000001$ and $x_1=\alpha_0(1,100)^T$, which is not the solution $(1,1)^T$. In PCG, $p_0=z_0=(1,1)^T$, $r_0^Tz_0=101$, and $p_0^TAp_0=101$. Thus $\alpha_0=1$ and $x_1=(1,1)^T$. Applying $P^{-1}$ is cheap here because $A$ is diagonal. For a general coupled matrix, solving with $P=A$ is the original hard problem; an effective preconditioner balances solve cost against iteration savings.

</details>

## References and further learning

- [Magnus R. Hestenes and Eduard Stiefel, *Methods of Conjugate Gradients for Solving Linear Systems* (1952)](https://math.nist.gov/mcsd/Reports/2002/hestenes-steifel-52.pdf). Section 1, p. 409, states the machine-computation requirements. Section 19, Example 1 and Table 1, p. 433, supplies our primary numerical data and exact iterates. Read it to connect conjugate directions with the original computational problem; this is the original publication, rather than a retrospective history.
- [Jonathan Richard Shewchuk, *An Introduction to the Conjugate Gradient Method Without the Agonizing Pain* (1994)](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf). Sections 3–8 develop quadratic geometry and the recurrence; 10–12 discuss cost, stopping, and preconditioning; 13–14 distinguish normal equations and nonlinear CG. Useful for intuition and further worked geometry.
- [*Templates for the Solution of Linear Systems*, CG algorithm](https://www.netlib.org/linalg/html_templates/node20.html), [theory](https://www.netlib.org/linalg/html_templates/node21.html), and [convergence](https://www.netlib.org/linalg/html_templates/node22.html). Useful for checking implementation assumptions and the energy-error bound. The [full book](https://www.netlib.org/templates/templates.html) develops preconditioner choices.
- [Stanford EE364b, *Conjugate Gradient Method* lecture](https://web.stanford.edu/class/ee364b/lectures/conj_grad_slides.pdf). Slides 6–10 explain error, residuals, and Krylov spaces; 12–16 explain the spectrum; 24 treats nonzero initial guesses. Useful for seeing why clustered eigenvalues help.
- [SciPy, `scipy.sparse.linalg.cg`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.linalg.cg.html). Check parameter conventions, inverse-preconditioner actions, return status, and tolerances when implementing a solve.
- [PETSc, `KSPCG`](https://petsc.org/release/manualpages/KSP/KSPCG/). Explains equivalent preconditioning formulations and links to parallel CG variants. Useful when communication costs matter in distributed solves.
