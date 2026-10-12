---
title: LU decomposition
subject: Linear Algebra
description: Factor a matrix into lower and upper triangular matrices to solve linear systems efficiently.
last_modified_at: 2026-10-12
---

## Definition

Let $A \in \mathbb{R}^{n \times n}, n \in \mathbb{N}$. An $LU$ decomposition or factorization is a representation

$$
A = LU
$$

where $L$ is the lower triangular and $U$ is upper triangular.

For a nonsingular matrix, if every leading principal minor is nonzero,

$$
\det(A_{1:k,1:k}) \not ={0},\qquad k = 1, 2, \cdots, n
$$

the unit-lower-triangular $LU$ decomposition/factorization exists and is unique. Here, unit lower triangular means that every diagonal entry of $L$ is $1$.

If row exchanges are required, we instead use

$$
PA = LU
$$

where $P$ is a permutation matrix.

The applications below assume that $A$ is nonsingular and admits the unpivoted factorization $A = LU$.

## Usages

### 1. Solving linear systems

Let's say we have a linear system

$$
Ax = b
$$

to solve. If we perform $LU$ decomposition, we get:

$$
Ax = LUx = b
$$

If we write:

$$
Ux = y
$$

then the linear system could be rewritten into:

$$
Ax = LUx = L(Ux) = Ly = b
$$

And using forward substitution, it is very trivial to solve $Ly = b$, and backward substitution gives the solution to $Ux = y$.

Because this is a systematic approach of solving linear systems, we are interested in computers, not humans. Naturally, the question becomes: "What is the computational cost of solving linear system using $LU$ decomposition?"

For conventional dense $LU$ factorization, the floating-point operation count is $\frac{2}{3}n^3 + O(n^2)$ flops, counting each multiplication and addition separately. Thus $\frac{2}{3}n^3$ is the leading term, rather than an exact count. Forward and backward substitution together cost $O(n^2)$ per right-hand side. Once $L$ and $U$ have been computed, they can be reused to solve systems with the same $A$ and different right-hand sides without repeating the factorization.

### 2. Computing determinants

$$
\det A = \det L \cdot \det U
$$

### 3. Matrix inversion

Inversion is basically solving

$$
AX = I
$$

This will give us $n$ linear systems, and we can apply $LU$ decomposition to find the columns of $X$, which is $A^{-1}$.

## History

### Introduction of $A = g'h$

$LU$ decomposition is relatively modern concept compared to other crucial matrix operations such as Gaussian elimination where it's name hints its history. The first appearance of decomposing a matrix into two triangular matrices in a journal is from a paper in 1938 by Polish mathematician and professor of astronomy at Jagiellonian University at Kraków, Poland, Tadeusz Banachiewicz, known as "[Méthode de résolution numérique des équations linéaires, du calcul des déterminants et des inverses, et de réduction des formes quadratiques]()", translated as "Method for the Numerical Solution of Linear Equations, Calculation of Determinants and Inverses, and Reduction of Quadratic Forms".

The reason why he introduced this is to make numerical calculations simpler and less error-prone, especially in his field: astronomy and geodesy. As an astronomer, Banachiewicz realised that astronomers often had to solve linear systems arising from orbital calculations, observation data, and least-squares estimations. At the time, there were no LLMs, super fast calculator apps, nor Casio calculators. What they had were mechanical calculators.

To solve this problem, Banachiewicz came up with "Cracovian Algebra" which is about organizing matrix calculations, where the centre of its idea was about organizing matrix calculations column-wise which was more convenient for mechanical calculators to work on.

While working on his algebra, he discovered that often times, when we perform Gaussian eliminations, we often get two different information: the resulting matrix of the elimination, and the multipliers used for the elimination. For example,

$$
A = \begin{bmatrix}
2 & 1\\
4 & 3
\end{bmatrix}
$$

If we perform eliminations, we get:

$$
U = \begin{bmatrix}
2 & 1\\
0 & 1
\end{bmatrix}
$$

by multipling the first row by $2$, and subtracting it two the second row. We could actually store that information in a separate matrix:

$$
L = \begin{bmatrix}
1 & 0\\
2 & 1
\end{bmatrix}
$$

obtaining

$$
A = LU
$$

In his paper, he states that:

> § 1. Considérons le système de $n$ équations linéaires à $n$ inconnues
>
> $$
> \begin{aligned}
> A_{11}x_1 + A_{21}x_2 + \ldots + A_{n1}x_n + A_{n+1,1} &= 0 \\
> A_{12}x_1 + A_{22}x_2 + \ldots + A_{n2}x_n + A_{n+1,2} &= 0 \\
> &\vdots \\
> A_{1n}x_1 + A_{2n}x_2 + \ldots + A_{nn}x_n + A_{n+1,n} &= 0
> \end{aligned}
> \qquad (1.1)
> $$
>
> ayant une solution unique.
>
> En posant
>
> $$
> \mathrm{X} = 1\{x_1\ \ x_2\ \ldots\ x_n\ \ 1\} \qquad (1.\mathrm{A})
> $$
>
> $$
> \mathrm{A}' =
> \begin{vmatrix}
> A_{11} & A_{21} & \ldots & A_{n1} & A_{n+1,1} \\
> A_{12} & A_{22} & \ldots & A_{n2} & A_{n+1,2} \\
> \vdots & \vdots & & \vdots & \vdots \\
> A_{1n} & A_{2n} & \ldots & A_{nn} & A_{n+1,n}
> \end{vmatrix}
> \qquad (1.\mathrm{B})
> $$
>
> nous écrirons le système (1.1), comme d'ordinaire,
>
> $$
> \mathrm{X}\cdot 1\mathrm{A}' = 0 \qquad (1.1\text{-bis})
> $$
>
> Supposons maintenant $\mathrm{A}'$ décomposé en un produit de deux cracoviens $\mathrm{g}'$ et $\mathrm{h}$ tels que
>
> $$
> \mathrm{g}' =
> \begin{vmatrix}
> 1 & g_{21} & g_{31} & \ldots & g_{n1} & g_{n+1,1} \\
> 0 & 1 & g_{32} & \ldots & g_{n2} & g_{n+1,2} \\
> 0 & 0 & 1 & \ldots & g_{n3} & g_{n+1,3} \\
> \vdots & \vdots & \vdots & & \vdots & \vdots \\
> 0 & 0 & 0 & \ldots & 1 & g_{n+1,n}
> \end{vmatrix}
> \qquad
> \mathrm{h} =
> \begin{vmatrix}
> h_{11} & h_{21} & h_{31} & \ldots & h_{n1} \\
> 0 & h_{22} & h_{32} & \ldots & h_{n2} \\
> 0 & 0 & h_{33} & \ldots & h_{n3} \\
> \vdots & \vdots & \vdots & & \vdots \\
> 0 & 0 & 0 & \ldots & h_{nn}
> \end{vmatrix}
> \qquad (1.\mathrm{C})
> $$
>
> que nous appellerons facteurs canoniques de $\mathrm{A}'$. On suppose les équations (1.1) disposés de façon que $h_{ii} \neq 0$ ($i = 1, 2, \ldots n$); ceci est toujours possible, car dans le cas contraire le déterminant du système (1.1) serait égal à zéro.
>
> Avec
>
> $$
> \mathrm{A}' = \mathrm{g}'\cdot\mathrm{h} \qquad (1.2)
> $$
>
> l'équation (1.1-bis) donne
>
> $$
> \mathrm{X}\cdot 1(\mathrm{g}'\cdot\mathrm{h}) = \mathrm{X}\cdot(\mathrm{h}\cdot\mathrm{g}') = \mathrm{X}\cdot 1\mathrm{g}'\cdot\mathrm{h} = 0, \qquad (1.1\text{-ter})
> $$
> 

Now if we translate this original text to English using LLMs, we get:

> § 1. Consider the system of $n$ linear equations in $n$ unknowns
>
> $$
> \begin{aligned}
> A_{11}x_1 + A_{21}x_2 + \ldots + A_{n1}x_n + A_{n+1,1} &= 0 \\
> A_{12}x_1 + A_{22}x_2 + \ldots + A_{n2}x_n + A_{n+1,2} &= 0 \\
> &\vdots \\
> A_{1n}x_1 + A_{2n}x_2 + \ldots + A_{nn}x_n + A_{n+1,n} &= 0
> \end{aligned}
> \qquad (1.1)
> $$
>
> having a unique solution.
>
> Setting
>
> $$
> \mathrm{X} = 1\{x_1\ \ x_2\ \ldots\ x_n\ \ 1\} \qquad (1.\mathrm{A})
> $$
>
> $$
> \mathrm{A}' =
> \begin{vmatrix}
> A_{11} & A_{21} & \ldots & A_{n1} & A_{n+1,1} \\
> A_{12} & A_{22} & \ldots & A_{n2} & A_{n+1,2} \\
> \vdots & \vdots & & \vdots & \vdots \\
> A_{1n} & A_{2n} & \ldots & A_{nn} & A_{n+1,n}
> \end{vmatrix}
> \qquad (1.\mathrm{B})
> $$
>
> we shall write the system (1.1), as usual,
>
> $$
> \mathrm{X}\cdot 1\mathrm{A}' = 0 \qquad (1.1\text{-bis})
> $$
>
> Suppose now that $\mathrm{A}'$ is decomposed into a product of two cracovians $\mathrm{g}'$ and $\mathrm{h}$ such that
>
> $$
> \mathrm{g}' =
> \begin{vmatrix}
> 1 & g_{21} & g_{31} & \ldots & g_{n1} & g_{n+1,1} \\
> 0 & 1 & g_{32} & \ldots & g_{n2} & g_{n+1,2} \\
> 0 & 0 & 1 & \ldots & g_{n3} & g_{n+1,3} \\
> \vdots & \vdots & \vdots & & \vdots & \vdots \\
> 0 & 0 & 0 & \ldots & 1 & g_{n+1,n}
> \end{vmatrix}
> \qquad
> \mathrm{h} =
> \begin{vmatrix}
> h_{11} & h_{21} & h_{31} & \ldots & h_{n1} \\
> 0 & h_{22} & h_{32} & \ldots & h_{n2} \\
> 0 & 0 & h_{33} & \ldots & h_{n3} \\
> \vdots & \vdots & \vdots & & \vdots \\
> 0 & 0 & 0 & \ldots & h_{nn}
> \end{vmatrix}
> \qquad (1.\mathrm{C})
> $$
>
> which we shall call the canonical factors of $\mathrm{A}'$. The equations (1.1) are assumed arranged so that $h_{ii} \neq 0$ ($i = 1, 2, \ldots n$); this is always possible, for otherwise the determinant of the system (1.1) would be equal to zero.
>
> With
>
> $$
> \mathrm{A}' = \mathrm{g}'\cdot\mathrm{h} \qquad (1.2)
> $$
>
> equation (1.1-bis) gives
>
> $$
> \mathrm{X}\cdot 1(\mathrm{g}'\cdot\mathrm{h}) = \mathrm{X}\cdot(\mathrm{h}\cdot\mathrm{g}') = \mathrm{X}\cdot 1\mathrm{g}'\cdot\mathrm{h} = 0, \qquad (1.1\text{-ter})
> $$

#### Reading the original notation

In the displayed formulas, $\mathrm{A}'$ and $\mathrm{g}'$ are augmented arrays: each has an extra column for the constant terms. Their primes should not be read as modern transpose symbols. Banachiewicz instead uses the prefix $1$ for the transposing cracovian, whose displayed array is an identity matrix. The first index in his entries denotes the column, and the second denotes the row; for example, $A_{21}$ is in the first row and second column. These conventions can be seen in §1, equations (1.A)–(1.C), of the [original paper, pp. 393–394](https://www.oa.uj.edu.pl/pbl/books/T_Banachiewicz_1938_Bull.Acad.Pol.Ser.A.No.10-12_p.393-404.pdf).

The dot also has a special meaning. To distinguish it from ordinary matrix multiplication, write the cracovian product as $R \circ S$. If $R$ and $S$ denote the arrays as displayed, then

$$
R \circ S = S^T R, \qquad
(R \circ S)_{ij} = \sum_k S_{ki}R_{kj}.
$$

Each output entry is a dot product of a column of $S$ with a column of $R$, so the operands must have the same number of rows. Consequently,

$$
R \circ I = R, \qquad I \circ R = R^T.
$$

This explains why the original prefix $1$ transposes an array even though ordinary left multiplication by an identity matrix would leave it unchanged. Cracovian multiplication is generally nonassociative; a sequence of products is evaluated from left to right. These product and transposition rules are also given in [Kociński, §3, definitions 3.1–3.3 and 3.5](https://arxiv.org/pdf/1509.08740).

#### Translating the equations into modern matrix algebra

Let $C$ denote the coefficient matrix as displayed in (1.B), and let $c$ be its final column. In modern notation,

$$
C_{ij} = A_{ji}, \qquad c_i = A_{n+1,i}, \qquad
\mathcal A = [\,C\mid c\,], \qquad
\widehat x = \begin{bmatrix}x\\1\end{bmatrix}.
$$

The original $\mathrm X = 1\{x_1\ \cdots\ x_n\ 1\}$ is the column $\widehat x$. Thus $\mathrm X\cdot 1\mathrm A' = 0$ translates to

$$
\widehat x \circ \mathcal A^T
= \mathcal A\widehat x
= Cx + c = 0.
$$

This is the usual system $Cx = b$ with $c = -b$: the appended column contains the negative of the modern right-hand side.

Next, let $\mathcal G = [\,G\mid q\,]$ and $H$ denote the displayed arrays $\mathrm g'$ and $\mathrm h$. Here $G$ is unit upper triangular and $H$ is upper triangular with nonzero diagonal entries. Equation (1.2) translates to

$$
\mathcal A = \mathcal G \circ H = H^T\mathcal G,
\qquad C = H^TG, \qquad c = H^Tq.
$$

The dimensions now agree: $H^T$ is $n\times n$ and $\mathcal G$ is $n\times(n+1)$. The coefficient matrix is a product of a lower triangular matrix $H^T$ and a unit upper triangular matrix $G$.

The manipulation in (1.1-ter) has the same meaning as the ordinary matrix identity

$$
\mathcal A\widehat x = H^T(\mathcal G\widehat x) = 0.
$$

Since $H^T$ is invertible, this gives $\mathcal G\widehat x = Gx + q = 0$, corresponding to the original equation (1.3). Equivalently, set $y = -q$, solve $H^Ty = b$ by forward substitution, and then solve $Gx = y$ by backward substitution.

To obtain the unit-lower-triangular convention used earlier in this article, define

$$
D = \operatorname{diag}(h_{11},\ldots,h_{nn}), \qquad
L = H^TD^{-1}, \qquad U = DG.
$$

Then $L$ has diagonal entries $1$, $U$ is upper triangular, and $LU = H^TG = C$. For the earlier example,

$$
H = \begin{bmatrix}2&4\\0&1\end{bmatrix}, \qquad
G = \begin{bmatrix}1&\tfrac12\\0&1\end{bmatrix}, \qquad
D = \begin{bmatrix}2&0\\0&1\end{bmatrix},
$$

which gives exactly $L = \begin{bmatrix}1&0\\2&1\end{bmatrix}$ and $U = \begin{bmatrix}2&1\\0&1\end{bmatrix}$. Banachiewicz's factorization therefore becomes modern $LU$ after translating the product and choosing the diagonal normalization.

The claim here is that by using this calculation based on his algebra, we have less mathematical quantities, not number of operations, than the traditional elimination process.

> D'autre part la commodité de la forme cracovienne des équations (2.3) et (2.4) facilite beaucoup les calculs.

which translates into

> On the other hand, the convenience of the Cracovian form of equations (2.3) and (2.4) greatly facilitates the calculations.

At that time, the speed of calculations wasn't the main issue, but the intermediate quantities that arises from the calculations.

### Solving normal equations

A normal equation is a system of linear equations that arises when we try to find the best approximate solution to a system that cannot be solved exactly.

This was important for astronomers, surveyors, and geodesists, because they had to estimate unknown quantities from measurements containing errors.

For example, imagine you are an astronomer, and you are trying to estimate a position of a star. You measure its $x$ position three times, and you get:

$$
\begin{aligned}
    x = 2.0\\
    x = 2.2\\
    x = 1.9
\end{aligned}
$$

So what should be the position of that star? Average them?

The approach astronomers took was to choose the value $x$ that minimizes the total squared measurement error:

$$
\min_x [(x - 2.0)^2 + (x - 2.2)^2 + (x - 1.9)^2]
$$

This problem is now basically finding the minimum point of the quadratic equation. Thus we differentiate the inner equation, and find its root.

$$
2(x - 2.0) + 2(x - 2.2) + 2(x - 1.9) = 0
$$

and we get

$$
\begin{aligned}
    3x &= 6.1 \\
    x &= \frac{6.1}{3} \approx 2.0333
\end{aligned}
$$

As we can see, the good property of finding the least squared error is that we differentiate the quadratic equation, and obtain a linear system. This was the reason why solving linear systems were very important.

Now if we generalise this problem, let $A \in \mathbb R^{m\times n}$, $b \in \mathbb R^m$, and $x \in \mathbb R^n$. The least-squares problem becomes:

$$
\min_x \lVert Ax - b \rVert_2^2
$$

where $b - Ax$ is often called the residual vector $r$.

The squared 2-norm gives:

$$
\begin{aligned}
F(x) &= (Ax - b)^T(Ax - b) \\
&= x^TA^TAx - 2b^TAx + b^Tb
\end{aligned}
$$

And the differentiation with respect to $x$ gives:

$$
\nabla F(x) = 2A^TAx -2A^Tb
$$

and the root is given when we solve

$$
\nabla F(x) = 0
$$

thus

$$
\begin{aligned}
    2A^TAx - 2A^Tb &= 0\\
    2A^TAx &= 2A^Tb \\
    \therefore A^TAx &= A^Tb
\end{aligned}
$$

which is called the normal equation.

The normal equations characterize least-squares minimizers because $F$ is a convex quadratic. If $A$ has full column rank, then $A^TA$ is positive definite and the minimizer $x$ is unique. If $A$ is rank deficient, $A^TA$ is singular and positive semidefinite, and the minimizing $x$ is not unique, although the fitted vector $Ax$ is unique.

The reason this is called a normal equation is because if we rearrange the equation, we get:

$$
A^T(b - Ax) = 0
$$

where we can use the residual vector $r$:

$$
A^Tr = 0
$$

which means that residual $r$ is perpendicular to every column of $A$, and geometrically, $Ax$ is an orthogonal projection to $b$ onto the column space of $A$, thus making $r$ as a normal vector.

This is where the 1944 paper "[An Attempt at a Systematic Classification of Some Methods for the Solution of Normal Equations]()" by Danish geodesist Henry Jensen comes in. This paper was to bridge the mathematical relationship between the conventional Gaussian elimination, Banachiewicz's Cracovian method, and Cholesky's method.

Basically, Gaussian elimination was

$$
E_k\cdots E_2E_1A = U
$$

Banachiewicz's method was

$$
A = g'h
$$

and Cholesky's method was

$$
A = LL^T
$$

for a special kind of matrix, the symmetric positive-definite matrix $A$.

Here, basically $L = (E_k\cdots E_2E_1)^{-1}$.

The reason he used triangular factorization was to show the close relationship between these methods.

The next paper actually tackles solving numerical equations. This is another 1944 paper "[A Matrix Presentation of Least Squares and Correlation Theory with Matrix Justification of Improved Methods of Solution]()" by an American statistician and an associate professor of mathematics at the University of Michigan, Paul S. Dwyer.

Statistics also deal with measured data, so often times, they had to deal with normal equations. Dwyer's question was to find the systematic process of solving normal equations in matrix algebra.

He first showed that Doolittle algorithm, an algorithm used to solve linear systems using Gaussian elimination systematically, can be represented as a product of two matrices:

$$
A = S'T
$$

where $A$ is actually the coefficient matrix, or the Gram matrix of normal equation, which we originally wrote as $A^TA$. Here, $S'$ is the lower triangular, and $T$ is the upper triangular.

He continues to show useful properties of this factorization:

> **7. A more general theory––solution of matrix equations by factorization.**
> &hellip;
> The key formula in this development is $A - S'T = 0$ and all subsequent formulas stem from this. Hence if $A$ can be factored into any matrices, $S'$ and $T$, not necessarily triangular, the results of section 6 follow.
> &hellip;

In this normal-equation setting, the coefficient matrix is a Gram matrix $A = B^TB$. Such a matrix is always symmetric positive semidefinite, since $z^TAz = \lVert Bz\rVert_2^2 \geq 0$. It is positive definite only if $B$ has full column rank. Thus the nonsingular normal-equation case gives an SPD matrix; the Gram-matrix form alone does not guarantee positive definiteness.

### Numerical introduction

In 1947, there comes a new paper called "[Numerical Inverting of Matrices of High Order]()", written by the famous Hungarian-American polymath and a professor at the Institute of Advanced Study(IAS) at Princeton, NJ, John von Neumann, and an American mathematican and Associate Project Director of the Electronic Computer Project at IAS, Herman Heide Goldstine.

IAS at the time was designing a computer called the "IAS Machine" that would replace and outperform ENIAC. As computers are being utilised in the mathematics world, it has become important to guarantee numerical stability of solving linear systems in computers.

However, the operands computers operate are fundamentally discrete values, thus when dealing with non-integer real numbers, rounding error is inevitable. In 1943, an American mathematician and a professor at Columbia University, Harold Hotelling, published a paper "[Some New Methods in Matrix Calculation]()" where he derived the upper bound of rounding errors of Doolittle method in computers, suggesting that "The rapidity with which this(the upper bound) increases with $p$ is a caution against relying on the results of the Doolittle method or other similar elimination methods with any moderate numbers of decimal places when the number of equations and unknowns is at all large". Thus it has become important to prove that computers are stable enough to produce reliable linear system solutions.

So what they wanted to do was to obtain a rigorous error estimate for inverting large matrices. We had to convince the users of the computers of the credibility of its computations.

These are the excerpts:

> **CHAPTER IV. THE ELIMINATION METHOD**
>
> **4.1. Statement of the conventional elimination method.** 
> &hellip;
> The elimination method is usually viewed as one for equation-solving and not for matrix-inverting, but this actually amounts to the same thing: Given a nonsingular matrix $A = (a_{ij})$ ($i, j = 1, \ldots, n$) and the corresponding equation system
>
> $$
> (4.1) \qquad \sum_{j=1}^{n} a_{ij} x_j = y_i \qquad (i = 1, \ldots, n),
> $$
>
> &hellip;
>
> Given the system of $n$ equations (4.1) with the $n$ unknowns $x_1, \ldots, x_n$, the solution by elimination proceeds in the following, familiar way:
>
> Assume that the $k-1$ first unknowns $x_1, \ldots, x_{k-1}$ ($k = 1, \ldots, n-1$) have already been eliminated, and that, for the remaining $n-k+1$ unknowns $x_k, \ldots, x_n$, $n-k+1$ equations have been derived:
>
> $$
> (4.4) \qquad \sum_{j=k}^{n} a_{ij}^{(k)} x_j = y_i^{(k)} \qquad (i = k, \ldots, n).
> $$
>
> Then the elimination of the next unknown, $x_k$, is effected by subtracting the $a_{ik}^{(k)}/a_{kk}^{(k)}$-fold of equation number $k$ from equation number $i$ ($i = k+1, \ldots, n$). This gives a new set of equations
>
> $$
> (4.5) \qquad \sum_{j=k+1}^{n} a_{ij}^{(k+1)} x_j = y_i^{(k+1)} \qquad (i = k+1, \ldots, n),
> $$
>
> where
>
> $$
> (4.6) \qquad a_{ij}^{(k+1)} = a_{ij}^{(k)} - a_{ik}^{(k)} a_{kj}^{(k)} / a_{kk}^{(k)} \qquad (i, j = k+1, \ldots, n),
> $$
>
> $$
> (4.7) \qquad y_i^{(k+1)} = y_i^{(k)} - (a_{ik}^{(k)} / a_{kk}^{(k)}) y_k^{(k)} \qquad (i = k+1, \ldots, n).
> $$
>
> The transition from (4.4) to (4.5) is clearly an inductive step from $k$ to $k+1$. This induction begins, of course, with the original equations (4.1), that is, we have
>
> $$
> (4.8) \qquad a_{ij}^{(1)} = a_{ij} \qquad (i, j = 1, \ldots, n),
> $$
>
> $$
> (4.9) \qquad y_i^{(1)} = y_i \qquad (i = 1, \ldots, n).
> $$
>
> The induction produces (4.4) successively for $k = 1, \ldots, n$, that is, it produces
>
> $$
> (4.10) \qquad a_{ij}^{(k)} \qquad (k = 1, \ldots, n;\ i, j = k, \ldots, n),
> $$
>
> $$
> (4.11) \qquad y_i^{(k)} \qquad (k = 1, \ldots, n;\ i = k, \ldots, n).
> $$
>
> After all $n$ systems (4.4) have been derived, the first equation of each system is selected, and these are combined to a new system of $n$ equations with the $n$ original unknowns $x_1, \ldots, x_n$:
>
> $$
> (4.12) \qquad \sum_{j=k}^{n} a_{kj}^{(k)} x_j = y_k^{(k)} \qquad (k = 1, \ldots, n).
> $$
>
> These are now solved by a backward induction over $k = n, \ldots, 1$:
>
> $$
> (4.13) \qquad x_k = \frac{1}{a_{kk}^{(k)}} y_k^{(k)} - \sum_{j=k+1}^{n} \frac{a_{kj}^{(k)}}{a_{kk}^{(k)}} x_j.
> $$
>
> &hellip;
>
> **4.3. Statement of the elimination method in terms of factoring $A$ into semi-diagonal factors $C$, $B'$.** We return now to the procedure of §4.1, without positioning for size, for the balance of this chapter.
>
> Summing (4.7) over $k = 1, \ldots, i-1$, and remembering (4.9), gives
>
> $$
> (4.15) \qquad y_i = y_i^{(i)} + \sum_{k=1}^{i-1} \frac{a_{ik}^{(k)}}{a_{kk}^{(k)}} y_k^{(k)}.
> $$
>
> We have $\xi = (x_i)$, $\eta = (y_i)$, let us introduce in addition $\zeta = (y_i^{(i)})$. Then (4.12) and (4.15) express two very simple matrix relations between $\xi$ and $\zeta$ and between $\eta$ and $\zeta$. If we define
>
> $$
> B' = (b'_{ij}) \qquad (i, j = 1, \ldots, n)
> $$
>
> $$
> (4.16) \qquad \text{with}\quad b'_{ij} = \begin{cases} a_{ij}^{(i)} & \text{for } i \leq j \\ 0 & \text{for } i > j \end{cases}
> $$
>
> $$
> C = (c_{ij}) \qquad (i, j = 1, \ldots, n)
> $$
>
> $$
> (4.17) \qquad \text{with}\quad c_{ij} = \begin{cases} a_{ij}^{(i)} / a_{jj}^{(j)} & \text{for } i \geq j \\ \text{[hence} & \\ 1 & \text{for } i = j\text{]} \\ 0 & \text{for } i < j \end{cases}
> $$
>
> then (4.12), (4.15) become
>
> $$
> (4.18) \qquad B'\xi = \zeta,
> $$
>
> $$
> (4.19) \qquad C\zeta = \eta.
> $$
>
> Since these are identities with respect to the original variables $x_1, \ldots, x_n$, that is, with respect to $\xi$, therefore comparison of (4.18), (4.19) with (4.1') gives
>
> $$
> (4.20) \qquad A = CB'.
> $$
>
> From (4.20)
>
> $$
> (4.21) \qquad A^{-1} = B'^{-1} C^{-1},
> $$
>
> and (4.16), (4.17) show that $B'$, $C$ are semi-diagonal (upper and lower, that is, in <span class="math-inline" markdown="0">\(\mathcal{C}_{+}\)</span> and <span class="math-inline" markdown="0">\(\mathcal{C}_{-}\)</span> respectively). Furthermore, (4.7), (4.13), which represent the conventional way of expressing the elimination method, are clearly the inductive processes that invert (4.15), (4.12), that is, (4.19), (4.18), that is, they invert the matrices $C$, $B'$. $C$, $B'$ are semi-diagonal, and renewed inspection of (4.7), (4.13) shows at once that these are indeed the inductive processes that are required to invert semi-diagonal matrices. (In this connection cf. the remark at the end of §3.4, and the explicit expressions (4.29), (4.30).)
>
> We may therefore interpret the elimination method as one which bases the inverting of an arbitrary matrix $A$ on the combination of two tricks: First, it decomposes $A$ into a product of two semi-diagonal matrices $C$, $B'$, according to (4.20), and consequently the inverse of $A$ obtains immediately from those of $C$, $B'$, according to (4.21).$^{27}$ Second, using the semi-diagonality of $C$, $B'$, it forms their inverses by a simple, explicit, inductive process.
>
> ---
>
> $^{25}$ Or at least one which has the same order of magnitude as the maximum in question. We propose, however, to disregard this possible relaxation of the requirement. We shall postulate that <span class="math-inline" markdown="0">\(\lvert a_{kk}^{(k)}\rvert\)</span> be strictly equal to <span class="math-inline" markdown="0">\(\mathrm{Max}_{i,j=k,\ldots,n}\lvert a_{ij}^{(k)}\rvert\)</span>.
>
> $^{26}$ Positioning for size, as described above, occurs only for $k = 1, \ldots, n-1$. For $k = n$, however, $a_{kk}^{(k)}$ is the only $a_{ij}^{(k)}$, hence the assertion is trivial.

The quoted expression (4.17) is retained as transcribed. In the elimination notation used above, the multiplier for row $i$ at stage $j$ is $a_{ij}^{(j)}/a_{jj}^{(j)}$ for $i>j$, with $c_{ii}=1$ and $c_{ij}=0$ for $i<j$. This follows directly from (4.15); the superscript $(i)$ in the quoted numerator should therefore not be used as the modern multiplier formula.

In their paper, they are not using the usual $LU$ notation, but they clearly now define the decomposition where $C$ is the lower triangular, and the $B'$ being the upper triangular.

The reason of doing this is to analyse the numerical accuracy of matrix computations.

Their algebraic factorization applies beyond the SPD matrices arising from nonsingular normal equations. For a nonsingular square matrix $A$, unpivoted elimination requires every leading principal minor to be nonzero. These minors are the determinants of the upper-left $k\times k$ submatrices:

$$
\Delta_k = \det (A_{1:k, 1:k})
$$

Writing $\Delta_0=1$, the pivots satisfy $u_{kk}=\Delta_k/\Delta_{k-1}$ when the preceding elimination steps are defined. Nonzero leading principal minors therefore ensure nonzero pivots throughout elimination. For a nonsingular $A$, a zero leading principal minor prevents an unpivoted $LU$ factorization. The nonsingularity assumption matters: a singular matrix such as $\operatorname{diag}(1,0)$ already has triangular factors despite its zero determinant.

Their purpose was to estimate rounding errors in large matrix computations. The algebraic factorization is the modern $LU$ decomposition with different notation, but the error analysis has a narrower scope: their rigorous analysis of inversion by elimination treats symmetric positive-definite matrices. It does not establish an unconditional stability guarantee for elimination on arbitrary nonsingular matrices.

### The $L$ and $U$ notation

The first appearance of the term $L$ and $U$ comes from Alan Turing's 1948 paper "[Rounding-off Errors in Matrix Processes]()".

Turing doesn't explicitly use the $A = LU$ notation. Rather, he used $A = LDU$ notation, where $L$ is the lower triangle, $D$ is the diagonal elements, and $U$ is the upper triangle.

This is his *Theorem of Triangular Resolution*:

> **Theorem of Triangular Resolution**
> If the principal minors of the matrix $A$ are non-singular, then there is a unique unit lower triangular matrix $L$, a unique diagonal matrix $D$, with non-zero diagonal elements, and a unique unit upper triangular matrix $U$ such that $A = LDU$. Similarly, there are unique $L'$, $D'$, $U'$ such that $A = U'D'L'$.

In this paper, Turing studies rounding errors in elimination and related factorizations for general matrices, extending the discussion beyond the SPD case. The resulting bounds depend on quantities arising during the computation; the factorization theorem alone is not a stability guarantee.

When he discusses the stability of this factorization, he introduces the concept of *condition numbers*.

> **8. Ill-conditioned matrices and equations**
>
> &hellip;
>
> Consider the equations
>
> $$
> \left.
> \begin{aligned}
> 1\cdot4x + 0\cdot9y &= 2\cdot7 \\
> -0\cdot8x + 1\cdot7y &= -1\cdot2
> \end{aligned}
> \right\}
> \qquad (8.1)
> $$
>
> and form from them another set by adding one-hundredth of the first to the second, to give a new equation replacing the first
>
> $$
> \left.
> \begin{aligned}
> -0\cdot786x + 1\cdot709y &= -1\cdot173 \\
> -0\cdot800x + 1\cdot700y &= -1\cdot200
> \end{aligned}
> \right\}
> \qquad (8.2)
> $$
>
> The set of equations (8.2) is fully equivalent to (8.1), but clearly if we attempt to solve (8.2) by numerical methods involving rounding-off errors we are almost certain to get much less accuracy than if we worked with equations (8.1). We should describe the equations (8.2) as an *ill-conditioned* set, or, at any rate, as ill-conditioned compared with (8.1). It is characteristic of ill-conditioned sets of equations that small percentage errors in the coefficients given may lead to large percentage errors in the solution. If we are required to solve the equations $A\mathbf{x} = \mathbf{b}$, but the coefficients used are those of $A - S$ instead of those of $A$, $S$ being a small matrix, then, to first order in $S$, the solution obtained will be $\mathbf{x}_0 + A^{-1}S\mathbf{x}_0$, where $\mathbf{x}_0$ is the correct solution. We may average the effect of this over a random population of matrices $S$, and over the coefficients in the solution and matrix, and we shall find the
>
> $$
> \frac{\text{R.M.S. error of coefficients of solution}}{\text{R.M.S. coefficient of solution}} = \frac{1}{n}\, N(A)N(A^{-1})\, \frac{\text{R.M.S. error of coefficients of } A}{\text{R.M.S. coefficient of } A}.
> $$
>
> This equation suggests that we might take either $N(A)N(A^{-1})$ or $\frac{1}{n} N(A)N(A^{-1})$ as a measure of the degree of ill-conditioning in a matrix. We will adopt the latter and call $\frac{1}{n} N(A)N(A^{-1})$ the *$N$-condition number* of $A$.
>
> We will also use $n M(A) M(A^{-1})$ as another measure of ill-conditioning and call it the *$M$-condition number* of $A$. There is substantial agreement between the two measures, though the $M$-number tends to be the larger, especially with diagonal or nearly diagonal matrices.
>
> &hellip;

Turing uses condition numbers to describe how sensitive a system's solution is to perturbations in its coefficients. His paper also derives rounding-error bounds for matrix algorithms, including elimination; it is therefore more than an introduction to conditioning.

The later 1961 paper "[Error Analysis of Direct Methods of Matrix Inversion](https://doi.org/10.1145/321075.321076)" by James Hardy Wilkinson, a mathematician at the National Physical Laboratory (NPL), develops error bounds that make the role of element growth and pivot selection explicit. Element growth measures how large intermediate entries become relative to the entries of the original matrix. Large growth can amplify rounding errors. Wilkinson's analysis relates the computed result to an exact computation on slightly perturbed data, an approach known as backward error analysis.

This distinguishes two questions. **Conditioning** is a property of the mathematical problem: how much can its solution change when its inputs change slightly? **Numerical stability** is a property of an algorithm: can its computed solution be interpreted as the exact solution of a nearby problem? Even a small backward error can lead to a large error in the solution of an ill-conditioned system.

Consequently, the existence of $A=LU$ does not by itself guarantee numerical stability. Unpivoted elimination can suffer large element growth even when every leading principal minor is nonzero. Pivoting strategies help control growth, but their error guarantees depend on the strategy and the resulting growth. The historical development should therefore be understood as increasingly precise error analysis under stated conditions, rather than an unconditional proof that every $LU$ computation is stable.

## Related pages

- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})
- [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }})

## References

1. Banachiewicz, T. (1938). Méthode de résolution numérique des équations linéaires, du calcul des déterminants et des inverses, et de réduction des formes quadratiques. Bulletin International de l'Académie Polonaise des Sciences et des Lettres. Classe des Sciences Mathématiques et Naturelles. Série A: Sciences Mathématiques, 393–401.
2. Jensen, H. (1944). An attempt at a systematic classification of some methods for the solution of normal equations (Meddelelse No. 18). Geodætisk Institut.
3. Dwyer, Paul S. “A Matrix Presentation of Least Squares and Correlation Theory with Matrix Justification of Improved Methods of Solution.” The Annals of Mathematical Statistics, vol. 15, no. 1, 1944, pp. 82–89. JSTOR, http://www.jstor.org/stable/2236214. Accessed 10 Oct. 2026.
4. John von Neumann and Herman H. Goldstine, Bulletin of the American Mathematical Society, 53 (1947), pp. 1021–1099.
5. Harold Hotelling "Some New Methods in Matrix Calculation," The Annals of Mathematical Statistics, Ann. Math. Statist. 14(1), 1-34, (March, 1943)
6. A. M. TURING, ROUNDING-OFF ERRORS IN MATRIX PROCESSES, The Quarterly Journal of Mechanics and Applied Mathematics, Volume 1, Issue 1, 1948, Pages 287–308, https://doi.org/10.1093/qjmam/1.1.287
7. J. H. Wilkinson. 1961. Error Analysis of Direct Methods of Matrix Inversion. J. ACM 8, 3 (July 1961), 281–330. https://doi.org/10.1145/321075.321076
