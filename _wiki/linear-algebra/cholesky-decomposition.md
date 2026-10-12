---
title: Cholesky decomposition
subject: Linear Algebra
description: Understand how geodetic network adjustment led to Cholesky factorization, how its purpose developed, and how to compute it.
last_modified_at: 2026-10-12
---

## Definition

For a real **symmetric positive-definite** (SPD) matrix $A\in\mathbb{R}^{n\times n}$, the **Cholesky decomposition**, or **Cholesky factorization**, is

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

A **quadratic form** is the scalar $q(x)=x^TAx$. Think of it as an energy or penalty assigned to a displacement $x$. For the real symmetric matrix <span class="math-inline" markdown="0">\(A=\begin{pmatrix}4&2\\2&3\end{pmatrix}\)</span>,

$$
q(x)=4x_1^2+4x_1x_2+3x_2^2.
$$

The cross term couples the coordinates. Completing the square gives

$$
q(x)=(2x_1+x_2)^2+(\sqrt2x_2)^2=\lVert L^Tx\rVert_2^2.
$$

Cholesky finds the triangular coordinate transformation that makes this mixed quadratic expression a sum of squares. If $L$ is invertible, a nonzero $x$ cannot become the zero vector under $L^T$, so the squared length is strictly positive. That explains the SPD condition. See [Higham's discussion of positive-definite quadratic forms](https://nhigham.com/2020/07/21/what-is-a-symmetric-positive-definite-matrix/).

Positive definite does **not** mean that every entry of the matrix is positive. For example, <span class="math-inline" markdown="0">\(\begin{pmatrix}2&-1\\-1&2\end{pmatrix}\)</span> gives

$$
x^TAx=(x_1-x_2)^2+x_1^2+x_2^2>0\qquad(x\ne0).
$$

Conversely, <span class="math-inline" markdown="0">\(\begin{pmatrix}1&2\\2&1\end{pmatrix}\)</span> has positive entries but gives $x^TAx=-2$ for $x=(1,-1)^T$. The condition concerns every direction, not the signs of individual entries.

{% include image.html src="/assets/images/wiki/cholesky-energy.svg" alt="Three contour plots compare positive definite energy with nested ellipses, semidefinite energy with a flat vertical direction, and indefinite energy with positive and negative contours." caption="Contours of xᵀAx: the SPD example rises in every direction; the semidefinite example x₁² is flat along x₂; the indefinite example x₁² − x₂² takes both signs. Equal-energy contours of the SPD matrix form closed ellipses." %}

The semidefinite example has a direction that costs no energy. The indefinite example has a direction with negative energy, so it cannot equal a squared Euclidean length for all $x$. These geometric differences correspond to zero or invalid square-root pivots in the usual algorithm.

### The factor is a table of dot products

Write the rows of $L$ as $r_1,\ldots,r_n$. Then $a_{ij}=r_i\cdot r_j$. In the two-variable example,

$$
r_1=(2,0),\qquad r_2=(1,\sqrt2).
$$

Their squared lengths are $4$ and $3$, and their dot product is $2$. These are precisely the two diagonal entries and the off-diagonal entry of $A$. Triangularity lets us construct these vectors one coordinate at a time: give the first row its length, match the next row's dot product with it, then choose the remaining coordinate to supply the remaining squared length. This is the Gram-matrix interpretation of $LL^T$; see [the FLAME definition and algorithm](https://www.cs.utexas.edu/~flame/Notes/NotesOnChol.html).

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

For $a>0$, a positive remainder means the second direction still has positive energy. A zero remainder leaves a flat direction. A negative remainder gives a negative-energy direction. In higher dimensions, the Schur complement is the matrix version of this remainder.

### Why the square roots are positive

Partition an SPD matrix as

$$
A=\begin{bmatrix}\alpha&c^T\\c&B\end{bmatrix}.
$$

Here $\alpha>0$. For nonzero $z$, set $x=(-c^Tz/\alpha,z)^T$. Then

$$
0<x^TAx=z^T\left(B-\frac{cc^T}{\alpha}\right)z.
$$

Thus the Schur complement $B-cc^T/\alpha$ is SPD. Inductively factor it as $KK^T$, and obtain

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

## Related pages

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
