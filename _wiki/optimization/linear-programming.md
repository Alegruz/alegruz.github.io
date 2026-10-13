---
title: Linear programming
subject: Optimization
interactive_examples: true
description: Model resource allocation with linear constraints, solve a two-variable example, and understand simplex, duality, and shadow prices.
last_modified_at: 2026-10-12
---

## What problem does linear programming solve?

Suppose a workshop makes two products using the same limited stock and machine time. Making more of one leaves less capacity for the other. **Linear programming (LP)** chooses quantities that maximize profit or minimize cost while satisfying all the restrictions. “Programming” here means planning the decisions.

The important modeling question is whether contributions add and scale proportionally. If one batch uses two machine hours, three batches must use six; if two products are made together, their resource requirements must add. Setup costs, volume discounts, and interactions may require a different model. Fractional quantities must also make sense: half a tonne is natural, whereas half an employee usually is not.

## Definition and notation

A linear program optimizes a linear objective subject to linear equalities and inequalities. More precisely, affine expressions (linear expressions plus constants) are allowed. A general form is

$$
\begin{aligned}
\text{minimize}\quad &c^Tx+d\\
\text{subject to}\quad &Gx\le h,\\
&Ex=f.
\end{aligned}
$$

Here $x\in\mathbb R^n$ contains the **decision variables**, the quantities we choose. The fixed vector $c$ gives their costs, and $c^Tx=\sum_{j=1}^n c_jx_j$ multiplies each quantity by its cost and adds. The constant $d$ changes the reported value but not which $x$ is best. Matrices $G\in\mathbb R^{m\times n}$ and $E\in\mathbb R^{p\times n}$ store constraint coefficients; $h\in\mathbb R^m$ and $f\in\mathbb R^p$ store their limits. Inequalities are componentwise: every row must hold. Maximizing $c^Tx$ is equivalent to minimizing $-c^Tx$. See [Boyd and Vandenberghe, §4.3](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf#page=160).

A **feasible** point satisfies every constraint. The **feasible region** is the set of those points. An **optimal solution** is a feasible point with the best objective value; the point and its value are different objects. For matrix notation prerequisites, see the [matrix-decomposition overview]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}).

The worked examples, diagrams, derivations, and exercises below are original illustrations.

## History

The subject grew from a practical difficulty: many individually reasonable decisions compete for the same limited resources. Its development connects three questions we will keep returning to: how to express a plan, how to find a better one, and how to know that no better one exists.

### Production planning made the tradeoffs explicit

In 1939, Leonid Kantorovich published *Mathematical Methods of Organizing and Planning Production*. A problem from the Plywood Trust led him to study how work should be distributed among machines. He recognized a common mathematical structure in problems involving machinery, raw materials, waste, and transport. The English translation appeared in *Management Science* in 1960. See [Kantorovich's introduction and first production example](https://resistir.info/livros/kantorovich_mathematical_methods.pdf#page=2) and the [publication record](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.6.4.366).

The motivation is easy to miss if we start with a matrix. A machine that produces more parts per hour might be especially valuable for one particular part. Assigning every machine to whichever task it does fastest can leave a shortage of another part needed for a finished product. The mathematical problem is to coordinate the whole production plan. Our two-product workshop below uses a smaller version of this shared-resource idea.

### Military planning turned it into a general computational problem

During World War II, George B. Dantzig worked on statistical control and planning for the U.S. Army Air Forces. Plans covered procurement, supply, deployment, and training, and much of the calculation was done by hand. After the war, he was asked to help mechanize that process. In his oral history, he dates the LP model to June 1947 and the simplex method to August 1947. See [Dantzig's account, “During the Second World War” and “Just After the War”](https://www.informs.org/Explore/History-of-O.R.-Excellence/Oral-Histories/George-Dantzig).

A military **program** meant a plan or schedule. Dantzig later recalled that Tjalling Koopmans suggested shortening “programming in a linear structure” to “linear programming” in 1948. His account also describes replacing planning ground rules with an explicit objective. See [Dantzig (2002), pp. 43 and 46](https://pubsonline.informs.org/doi/pdf/10.1287/opre.50.1.42.17798#page=2).

This explains why the definition has two separate parts. Constraints describe what a plan can do; the objective states what makes one admissible plan preferable to another. Knowing the resource balances alone does not choose the plan.

### Simplex supplied a way to improve the plan

A model still needs a workable solution method. In *Origins of the Simplex Method*, Dantzig recalled initially rejecting the idea of walking along the edges of the feasible polyhedron, the shape cut out by the linear constraints: he expected it to be inefficient. Working instead with the geometry of the matrix columns led him to an algorithm he expected to be useful. He then recognized its equivalence to the vertex-to-vertex procedure he had first rejected. See [Dantzig's account, opening and concluding discussion](https://archive.computerhistory.org/resources/access/text/2024/06/102739347-05-0002-acc.pdf#page=169).

The two viewpoints are still useful. A row of the workshop matrix describes a resource restriction; a column describes what one product consumes. The polygon picture below shows feasible corners. The basis calculation later explains how exchanging a column changes the production mix while keeping the resource equations satisfied. This gives the geometric picture an executable sequence of calculations.

### Duality connected an optimal plan to resource values

Dantzig recalled meeting John von Neumann on October 3, 1947. Von Neumann recognized a connection between the LP model and his work on **game theory**, which studies decisions whose outcomes depend on other participants' choices, and outlined ideas including duality. Dantzig also described the subsequent work of Albert Tucker, Harold Kuhn, David Gale, and others at Princeton on these connections. See [Dantzig (2002), p. 44](https://pubsonline.informs.org/doi/pdf/10.1287/opre.50.1.42.17798#page=3).

For the workshop, the connection becomes concrete: a production plan earns profit, while a set of resource prices places an upper bound on the profit any plan could earn. If the earned profit reaches that bound, the plan is proved optimal. The duality section derives those prices and shows why a resource's value depends on what it makes possible.

### The framework was consolidated, then its algorithmic limits were tested

Dantzig's *Linear Programming and Extensions* appeared in 1963 as RAND report R-366-PR. It brought together formulations, simplex, duality, and applications including transportation and games. See [RAND's publication record and downloadable chapters](https://www.rand.org/pubs/reports/R366.html).

As LP grew, practical success raised another question: could an algorithm guarantee a manageable running time for every input? A **polynomial-time** guarantee bounds the work by a fixed polynomial in the input size, including the bits used to encode the coefficients. Khachiyan established such a guarantee in 1979 with the ellipsoid method. In 1984, Narendra Karmarkar presented another polynomial-time algorithm based on transformations and movement through the interior. His paper explains the distinction between simplex's practical performance and its worst-case behavior, and compares the new method with the ellipsoid approach. See [Karmarkar (1984), introduction and §1](https://www.stat.uchicago.edu/~lekheng/courses/302/classics/karmarkar.pdf).

This development explains why the algorithms section distinguishes a useful method from a worst-case guarantee. It also explains why finding an optimal vertex does not require visiting vertices at every intermediate step: interior methods can approach the optimum through the feasible region.

With that background, we can follow the same progression on a small example: formulate the plan, improve it, and certify its value.

## Worked example: two products, two shared resources

Let $x_1$ and $x_2$ be divisible batches of products A and B. Assume every batch can be sold at the stated profit.

| Per batch | Product A | Product B | Available |
| --- | --- | --- | --- |
| Machine hours | 1 | 1 | 4 |
| Material units | 2 | 1 | 5 |
| Profit units | 3 | 2 | — |

### Step 1: translate the table

$$
\begin{aligned}
\text{maximize}\quad &z=3x_1+2x_2\\
\text{subject to}\quad &x_1+x_2\le4,\\
&2x_1+x_2\le5,\\
&x_1,x_2\ge0.
\end{aligned}
$$

The first constraint measures hours, the second measures material, and nonnegativity excludes negative production. Check units within each row: the hour coefficients multiply batches to produce hours. Coefficients and capacities are assumed known and fixed during the plan.

This is $\max c^Tx$ subject to $Ax\le b$, $x\ge0$, with

$$
A=\begin{bmatrix}1&1\\2&1\end{bmatrix},\qquad
b=\begin{bmatrix}4\\5\end{bmatrix},\qquad
c=\begin{bmatrix}3\\2\end{bmatrix}.
$$

### Step 2: find the feasible corners

The axes and the two resource boundary lines enclose a polygon. On the horizontal axis $x_2=0$, the tighter upper bound is $x_1\le5/2$. On the vertical axis $x_1=0$, it is $x_2\le4$. Where the two resource lines intersect,

$$
x_1+x_2=4,\qquad2x_1+x_2=5
\quad\Longrightarrow\quad x_1=1,\quad x_2=3.
$$

Thus the four corners are $(0,0)$, $(5/2,0)$, $(1,3)$, and $(0,4)$.

{% include image.html src="/assets/images/wiki/linear-programming-region.svg" alt="Feasible polygon with corners (0,0), (2.5,0), (1,3), and (0,4). The machine boundary is x1+x2=4, the material boundary is 2x1+x2=5, and the objective line 3x1+2x2=9 touches the polygon at (1,3)." caption="Horizontal position is product A; vertical position is product B. Blue shading satisfies both resource limits and nonnegativity. The dashed orange line is the best attainable profit level, 9." %}

### Step 3: evaluate and check

| Corner | $3x_1+2x_2$ |
| --- | --- |
| $(0,0)$ | $0$ |
| $(5/2,0)$ | $15/2=7.5$ |
| $(1,3)$ | $9$ |
| $(0,4)$ | $8$ |

The best plan is $x^{\star}=(1,3)^T$, with $z^{\star}=9$. It uses $1+3=4$ hours and $2+3=5$ material units, exactly the capacities. Greedily making only the higher-profit product A gives $7.5$, so per-batch profit alone does not determine the best mix.

## Geometry: why corners help

An inequality such as $x_1+x_2\le4$ describes one side of a line, a **half-plane**. In more dimensions it is a half-space. Intersecting finitely many such sets and equality boundaries gives a **polyhedron**. It is **convex**: the entire line segment between any two feasible points remains feasible. For example, the midpoint of $(0,4)$ and $(1,3)$ is $(1/2,7/2)$, which satisfies both resource constraints.

A **vertex**, or extreme point, cannot be expressed as a nontrivial weighted average of two distinct feasible points. In this example vertices are the polygon's corners. Every feasible point is a weighted average of these corners; the linear objective has the same weighted-average property. Therefore no point inside this polygon can beat all its corners.

More generally, for the form $Ax=b$, $x\ge0$, a feasible LP with a finite optimum has an optimal vertex. This needs care for unrestricted formulations: minimizing $x_1$ over the line $x_1=0$, $x_2\in\mathbb R$ has optimal points but no vertices. See [MIT's LP algorithm notes](https://courses.csail.mit.edu/6.854/20/Notes/n14-LP_algorithms.html).

For a nonzero objective vector, **level lines** contain points with the same objective value. Here $3x_1+2x_2=k$ is $x_2=k/2-(3/2)x_1$. Slide this line toward larger $k$ until it last touches the region. It touches at $(1,3)$ when $k=9$. Changing profits rotates the level lines and can change which corner wins.

### Interactive example: change the profits

{% include wiki-lab.html kind="linear-programming" title="Which production mix wins?" plot_description="The fixed production polygon and all corners maximizing the selected profit coefficients." %}

The constraints stay fixed. Change the two profit coefficients using the labeled number inputs; arrow keys work too. Try $(c_1,c_2)=(3,2)$, $(1,1)$, $(2,1)$, and $(0,0)$. The latter three reveal an optimal edge, another optimal edge, and a constant objective. The display lists all optimal corners and explains when their connecting segment, or the entire region, is optimal. Negative profits and empty inputs are handled too. The static figure and corner table remain useful without JavaScript.

## Possible outcomes and misconceptions

| Outcome | Example | Reason |
| --- | --- | --- |
| Unique optimum | The production example | Only $(1,3)$ achieves $9$. |
| Multiple optima | Maximize $x_1+x_2$ with the same constraints | Every point from $(0,4)$ to $(1,3)$ achieves $4$. |
| Infeasible | Require $x_1\ge2$ and $x_1\le1$ | No point satisfies both. |
| Unbounded objective | Maximize $x_1$ subject only to $x_1\ge0$ | Profit can grow without limit. |

**An unbounded region need not give an unbounded objective.** Minimize $x_1$ subject to $x_1\ge0$: the region extends forever, but the minimum is $0$.

**The optimum need not be unique or integral.** Maximize $x_1$ subject to $2x_1\le5$ and $x_1\ge0$: the LP optimum is $2.5$. Requiring $x_1$ to be an integer changes the optimum to $2$ and makes this an integer program. Simply rounding a continuous solution is unreliable: rounding $2.5$ upward violates the constraint.

**Linearity concerns the expressions, not the number of variables.** $3x_1+2x_2$ is linear; $x_1x_2$ and $x_1^2$ are not. A squared-error objective leads to a quadratic problem; see [quadratic forms]({{ '/wiki/linear-algebra/quadratic-form/' | relative_url }}).

## Equivalent forms and slack variables

A **slack variable** measures unused capacity. Write the workshop inequalities as

$$
x_1+x_2+s_1=4,\qquad2x_1+x_2+s_2=5,\qquad
x_1,x_2,s_1,s_2\ge0.
$$

For the feasible plan $(0,2)$, the slacks are $s_1=2$ hours and $s_2=3$ material units. At $(1,3)$ both are zero; those constraints are **binding**, meaning equality holds.

One common **standard form** is $\min c^Tx$ subject to $Ax=b$, $x\ge0$. Conventions vary, so always state the form. A $\ge$ inequality becomes an equality by subtracting a nonnegative surplus variable. A variable allowed to have either sign can be replaced by $x_j=u_j-v_j$ with $u_j,v_j\ge0$. These transformations preserve the original decisions and objective through the stated substitutions. See [Boyd and Vandenberghe, §4.3](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf#page=161).

## How algorithms solve larger problems

### Simplex: improve a basis

In equality standard form, assume $A$ has $m$ independent rows. A **basis** selects $m$ independent columns: none is a linear combination of the others, so the selected square system has a unique solution. Set the remaining, **nonbasic**, variables to zero and solve $A_Bx_B=b$ for the **basic** variables. If $x_B\ge0$, this is a basic feasible solution. A simplex **pivot** swaps an entering column for a leaving column to improve the objective while preserving feasibility. A **Phase I** auxiliary LP minimizes temporary artificial variables measuring constraint violations. A zero minimum provides a feasible starting point; a positive minimum proves infeasibility. See [Goemans on Phase I, §2.5](https://ocw.mit.edu/courses/18-310-principles-of-discrete-applied-mathematics-fall-2013/11d00f8f0f460a5e59b5e97322a218a9_MIT18_310F13_Ch8.pdf#page=15) and [MIT's basis and simplex notes, §§2–3](https://ocw.mit.edu/courses/6-854j-advanced-algorithms-fall-2008/302900e3a66f2a3b9c9f31bf91cd31fe_lec10.pdf#page=5).

In our example, start at $x_1=x_2=0$, $s_1=4$, $s_2=5$. The slack columns form the initial basis.

1. Increase $x_1$ with $x_2=0$. The slacks become $s_1=4-x_1$ and $s_2=5-2x_1$. Material runs out first at $x_1=5/2$; $x_1$ enters and $s_2$ leaves the basis.
2. Rewrite the equations using $x_2$ and $s_2$ as nonbasic variables:

   $$
   x_1=\frac52-\frac12x_2-\frac12s_2,\qquad
   s_1=\frac32-\frac12x_2+\frac12s_2.
   $$

   Substituting into profit gives $z=15/2+x_2/2-3s_2/2$. Increasing $x_2$ now improves profit by $1/2$ per batch after accounting for displaced A production.
3. Keep $s_2=0$ and increase $x_2$ until $s_1$ reaches zero at $x_2=3$. This yields $(x_1,x_2)=(1,3)$.
4. In the new basis,

   $$
   x_1=1+s_1-s_2,\qquad x_2=3-2s_1+s_2,\qquad
   z=9-s_1-s_2.
   $$

   Since $s_1,s_2\ge0$, no feasible plan can exceed $9$.

The coefficients of the nonbasic variables in the rewritten objective are **reduced costs**: they measure improvement after adjusting the basic variables. A zero basic variable makes a basis **degenerate**; pivots can then leave the point unchanged. Suitable pivot rules prevent cycling. Some simplex rules take exponentially many pivots on worst-case examples. Polynomial-time LP algorithms exist, including ellipsoid and interior-point methods; for rational data, complexity counts the bits encoding the coefficients as well as dimensions. See [MIT's algorithm notes](https://courses.csail.mit.edu/6.854/20/Notes/n14-LP_algorithms.html).

### A practical solver example

SciPy's `linprog` minimizes, so negate the profits. Its HiGHS interface supports simplex and interior-point methods. Check solver status before reading a candidate solution. See the [official `linprog` documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linprog.html).

```python
from scipy.optimize import linprog

result = linprog(
    c=[-3, -2],
    A_ub=[[1, 1], [2, 1]],
    b_ub=[4, 5],
    bounds=[(0, None), (0, None)],
    method="highs",
)
if not result.success:
    raise RuntimeError(result.message)

print(result.x)      # [1. 3.]
print(-result.fun)   # 9.0
print(result.slack)  # [0. 0.]
```

Floating-point output should be checked against the original constraints with an appropriate tolerance and scale. A tiny residual is different from exact feasibility. If a model is infeasible, inspect conflicting requirements; if unbounded, inspect missing limits rather than adding an arbitrary cap.

## Duality: certify the best possible value

For the specific primal form used in our example, the **dual** is

$$
\begin{array}{lll}
\text{Primal:}&\max c^Tx&Ax\le b,\ x\ge0,\\
\text{Dual:}&\min b^Ty&A^Ty\ge c,\ y\ge0.
\end{array}
$$

The vector $y$ assigns a nonnegative price to each resource. The dual requires the priced inputs for every product to cover its profit. **Weak duality** says every dual feasible value bounds every primal feasible value:

$$
c^Tx\le (A^Ty)^Tx=y^TAx\le y^Tb.
$$

Nonnegativity of $x$ justifies the first inequality and nonnegativity of $y$ the last. **Strong duality** says that if the primal is feasible with a finite optimal value, both problems attain that value. See [MIT's duality notes](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html). Dual signs depend on the primal form: for a maximization primal, an equality row has an unrestricted dual variable, and an unrestricted primal variable has an equality dual constraint. See [Goemans, §4.2](https://ocw.mit.edu/courses/18-310-principles-of-discrete-applied-mathematics-fall-2013/11d00f8f0f460a5e59b5e97322a218a9_MIT18_310F13_Ch8.pdf#page=22).

### Worked certificate for the workshop

Here the dual is

$$
\begin{aligned}
\text{minimize}\quad &4y_1+5y_2\\
\text{subject to}\quad &y_1+2y_2\ge3,\\
&y_1+y_2\ge2,\\
&y_1,y_2\ge0.
\end{aligned}
$$

Choose $y_1=y_2=1$. Product A's inputs are valued at $1+2=3$ and B's at $1+1=2$, meeting the dual constraints. The total capacity is valued at $4+5=9$. Equivalently, add the two resource inequalities:

$$
(x_1+x_2)+(2x_1+x_2)\le4+5
\quad\Longrightarrow\quad3x_1+2x_2\le9.
$$

Our feasible plan earns $9$, and this bound proves that no plan earns more. This certificate is easier to verify than rerunning an optimization algorithm.

### Complementary slackness

For feasible $x,y$ in the displayed primal–dual pair, optimality is equivalent to

$$
y_i\bigl(b_i-(Ax)_i\bigr)=0\quad\text{for every resource }i,
$$

$$
x_j\bigl((A^Ty)_j-c_j\bigr)=0\quad\text{for every product }j.
$$

These are the **complementary slackness** conditions; see [Goemans, §4.3](https://ocw.mit.edu/courses/18-310-principles-of-discrete-applied-mathematics-fall-2013/11d00f8f0f460a5e59b5e97322a218a9_MIT18_310F13_Ch8.pdf#page=23). In our workshop, a resource with unused capacity must have zero optimal price; a produced product must have input value exactly equal to its profit. The converse implications need not hold: a binding resource can have price zero. For example, with objective $x_1+x_2$, the workshop plan $(1,3)$ is optimal and both resources bind, yet optimal dual prices $(1,0)$ assign material a zero price.

To see the conditions algebraically, split the **duality gap**, the difference between the upper bound and earned profit:

$$
b^Ty-c^Tx=y^T(b-Ax)+x^T(A^Ty-c).
$$

Every summand is nonnegative. The gap is zero exactly when all the displayed products vanish.

## Shadow prices: how much is more capacity worth?

For the workshop, the optimal resource prices $(1,1)$ suggest that an additional machine hour or material unit is worth one profit unit locally. Verify this rather than extrapolating indefinitely.

Increase machine capacity to $4+\delta$, leaving material at $5$. If both resource constraints remain binding, subtraction gives

$$
x_1=1-\delta,\qquad x_2=3+2\delta,\qquad z=9+\delta.
$$

For $-3/2\le\delta\le1$, these quantities are nonnegative. The same dual prices give an upper bound $9+\delta$, so this plan is optimal throughout that interval. Beyond $\delta=1$, A would become negative. In fact B alone can use all five material units: $(0,5)$ earns $10$, and further machine capacity adds no profit. A **shadow price** is this local value of relaxing a constraint; the active mix and its price can change.

## Practice problems

Attempt each problem before opening its hint or solution. These exercises use original data.

### 1. Hand calculation: a new objective

Keep the workshop constraints, but maximize $4x_1+x_2$. Find the optimum and the unused capacity.

<details markdown="1">
<summary>Hint</summary>

Evaluate the objective at the four corners; then substitute the best point into the resource rows.

</details>

<details markdown="1">
<summary>Worked solution</summary>

The values at $(0,0)$, $(5/2,0)$, $(1,3)$, and $(0,4)$ are $0$, $10$, $7$, and $4$. The unique optimum is $(5/2,0)$, earning $10$. Machine slack is $4-5/2=3/2$ hours; material slack is $5-2(5/2)=0$.

</details>

### 2. Interpretation: which capacity should you buy?

Under the original profits, one extra machine hour costs $1.2$ profit units and one extra material unit costs $0.8$. You may buy either one or neither. Which choice increases net profit?

<details markdown="1">
<summary>Hint</summary>

Compute the best production plan after each change, then subtract the purchase cost.

</details>

<details markdown="1">
<summary>Worked solution</summary>

With capacities $(5,5)$, $(0,5)$ earns $10$, for a gain of $1-1.2=-0.2$ after cost. With capacities $(4,6)$, solving the binding equations gives $(2,2)$, which also earns $10$. The prices $(1,1)$ certify both upper bounds of $10$. Buying material gives $1-0.8=0.2$ net gain, so choose material. Buying neither leaves net profit at $9$.

</details>

### 3. Logical reasoning: can an interior point win?

Let $x$ be strictly inside a full-dimensional feasible region, meaning a small ball around it is feasible. Can it maximize $c^Tx$ when $c\ne0$? What changes if $c=0$?

<details markdown="1">
<summary>Hint</summary>

Consider moving a small distance in direction $c$.

</details>

<details markdown="1">
<summary>Worked solution</summary>

For sufficiently small $\epsilon>0$, $x+\epsilon c$ remains feasible. Its objective is $c^Tx+\epsilon c^Tc$, strictly larger since $c^Tc=\sum_jc_j^2>0$. Thus such an interior point cannot maximize a nonconstant objective. If $c=0$, every feasible point is optimal. The full-dimensional assumption matters: a point inside a line segment relative to that line can be optimal when the objective is constant along the line.

</details>

### 4. Practical application: a minimum-cost blend

A blend needs at least $6$ units of an ingredient. Each kilogram of feed A provides $2$ units and costs $3$; each kilogram of feed B provides $1$ unit and costs $2$. At most $2$ kilograms of A are available. Formulate and solve an LP, assuming divisible quantities and no other requirements.

<details markdown="1">
<summary>Hint</summary>

Use a lower-bound inequality for ingredient demand and an upper bound for A supply. A provides ingredient more cheaply per unit.

</details>

<details markdown="1">
<summary>Worked solution</summary>

Let $a,b$ be kilograms of the feeds. Minimize $3a+2b$ subject to $2a+b\ge6$, $0\le a\le2$, and $b\ge0$. Positive costs make over-supplying ingredient unnecessary here. On $2a+b=6$, cost is $3a+2(6-2a)=12-a$, minimized at $a=2$, $b=2$, costing $10$. For a certificate valid even with over-supply,

$$
3a+2b=2(2a+b)-a\ge12-2=10.
$$

</details>

## References and further learning

- [L. V. Kantorovich, *Mathematical Methods of Organizing and Planning Production* (1939; English translation, 1960)](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.6.4.366), [full text](https://resistir.info/livros/kantorovich_mathematical_methods.pdf): the production-planning motivation and original numerical examples.
- [George B. Dantzig, INFORMS oral history, interviewed by Irv Lustig](https://www.informs.org/Explore/History-of-O.R.-Excellence/Oral-Histories/George-Dantzig): firsthand recollections of military planning and early computation.
- [George B. Dantzig, *Linear Programming* (2002), *Operations Research* 50(1), 42–47](https://pubsonline.informs.org/doi/pdf/10.1287/opre.50.1.42.17798): the origins of the terminology and the connection to von Neumann and duality. This is a retrospective account.
- [George B. Dantzig, *Origins of the Simplex Method*](https://archive.computerhistory.org/resources/access/text/2024/06/102739347-05-0002-acc.pdf#page=169): his account of the different geometric viewpoints behind simplex, in an archival collection.
- [N. Karmarkar, *A New Polynomial-Time Algorithm for Linear Programming* (1984), *Combinatorica* 4, 373–395](https://www.stat.uchicago.edu/~lekheng/courses/302/classics/karmarkar.pdf): the original paper on the interior approach and its complexity guarantee.

- [Boyd and Vandenberghe, *Convex Optimization*, §4.3](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf#page=160): general LP notation, standard-form conversions, and connections to convex optimization.
- [Michel Goemans, MIT 18.310 linear programming notes](https://ocw.mit.edu/courses/18-310-principles-of-discrete-applied-mathematics-fall-2013/11d00f8f0f460a5e59b5e97322a218a9_MIT18_310F13_Ch8.pdf): modeling examples, basic feasible solutions, and the primal–dual rules in §§4.2–4.3.
- [MIT 6.854, Lecture 10](https://ocw.mit.edu/courses/6-854j-advanced-algorithms-fall-2008/302900e3a66f2a3b9c9f31bf91cd31fe_lec10.pdf#page=5): polyhedra, bases, and the geometric foundation of simplex.
- [MIT 6.854, algorithms for solving LPs](https://courses.csail.mit.edu/6.854/20/Notes/n14-LP_algorithms.html): the algebra of simplex pivots, reduced costs, and complexity limits.
- [MIT 6.854, LP duality](https://courses.csail.mit.edu/6.854/16/Notes/n12-duality.html): bounds, optimality certificates, and strong duality.
- [SciPy `linprog` documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linprog.html): solver input conventions, return status, slacks, and HiGHS options.
- [George B. Dantzig, *Linear Programming and Extensions*, RAND R-366-PR (1963)](https://www.rand.org/pubs/reports/R366.html): historical textbook with downloadable chapters on formulations, simplex, duality, and applications.
