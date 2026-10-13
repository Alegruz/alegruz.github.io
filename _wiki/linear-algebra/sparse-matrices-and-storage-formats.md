---
title: Sparse matrices and storage formats
subject: Linear Algebra
interactive_examples: true
description: Represent sparse matrices with COO, CSR, and CSC, read their pointer arrays, and choose a format for assembly or computation.
last_modified_at: 2026-10-13
---

## The problem: storing coefficients that are mostly zero

In a linear system $Ax=b$, each row of $A$ records how the unknowns contribute to one equation. Large systems can have many coefficients equal to zero. Storing every zero uses memory without contributing to the equations. The storage discussion in [*Templates for the Solution of Linear Systems*, “Survey of Sparse Matrix Storage Formats”](https://www.netlib.org/linalg/html_templates/node90.html) starts from this difficulty: retain the useful coefficients and enough information to recover their positions.

A second problem is exchanging those coefficients between programs. [NIST's Matrix Market](https://math.nist.gov/MatrixMarket/) provides test matrices for comparing numerical algorithms. Its exchange-format documentation supplies the published example used below. These sources document computational and exchange problems; they do not establish who first invented COO, CSR, or CSC. The numerical baseline is a **published format illustration**, not measured application data or a reconstruction of an original physical system. No physical units are specified.

For matrix notation and multiplication, see [matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }}). Here $A\in\mathbb R^{m\times n}$ means a real matrix with $m$ rows and $n$ columns. We number rows and columns from zero: $a_{ij}$ is the entry at row $i$, column $j$.

## Published worked data: a matrix to exchange

The real, general $5\times5$ example in [NIST's “Matrix Market Exchange Formats” section](https://math.nist.gov/MatrixMarket/formats.html) is

$$
A=\begin{bmatrix}
1&0&0&6&0\\
0&10.5&0&0&0\\
0&0&0.015&0&0\\
0&250.5&0&-280&33.32\\
0&0&0&0&12
\end{bmatrix}.
$$

All entries are preserved. The source's coordinate file uses **one-based** indices; our arrays subtract one from each row and column index. Subsequent array conversions and products are modern worked derivations.

There are 25 positions, of which eight are nonzero. Its **density** is the nonzero fraction, $8/25=0.32$; its zero fraction is $17/25=0.68$. The small matrix is convenient for tracing a format, rather than a demonstration of large-scale performance.

### What does sparse mean?

A **sparse matrix** has enough zeros that representing or processing its nonzero structure can be useful. There is no universal density threshold: index sizes, dimensions, and operations matter. A **dense representation** stores every position. In COO, CSR, and CSC, positions without a stored entry represent zero. See [SciPy's sparse-array introduction](https://docs.scipy.org/doc/scipy/tutorial/sparse.html).

The **sparsity pattern** describes which positions are nonzero. Changing a number at an existing position and inserting a new position are different storage tasks. Also distinguish the mathematical number of nonzeros from the number of stored entries, $s$: software can retain explicit zeros or repeated coordinates. In this baseline both counts equal eight. SciPy's [`nnz` attribute](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.coo_array.html) counts stored entries, including explicit zeros.

## COO: attach coordinates to every value

**Coordinate format (COO)** stores three parallel arrays: `row`, `col`, and `data`. Entry number $k$ contributes `data[k]` at `(row[k], col[k])`. Coordinates need not arrive in sorted order. This is the triplet representation described by [SciPy's COO documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.coo_array.html).

Keeping NIST's file entry order, but using zero-based coordinates, gives:

```text
shape = (5, 5)
row   = [0,   1,     2, 0,     3,    3,     3,  4]
col   = [0,   1,     2, 3,     1,    3,     4,  4]
data  = [1, 10.5, 0.015, 6, 250.5, -280, 33.32, 12]
```

Read vertically: slot $k=4$ means $a_{3,1}=250.5$. Slot $k=3$ returns to row 0; COO does not require all entries of a row to be adjacent. To reconstruct the matrix, start with zeros and add each triplet's value at its coordinate.

Always retain `shape`. The largest stored indices cannot reveal trailing empty rows or columns; an entirely empty coordinate list cannot reveal either dimension.

### Assembly and repeated coordinates

**Assembly** combines contributions into one matrix. Separate pieces of a model can contribute to the same coefficient. Under an additive convention, supplementary invented triplets `(1, 2, 3)` and `(1, 2, 4)` combine to $a_{1,2}=7$, rather than one overwriting the other. SciPy's COO conversion to CSR/CSC sums duplicate coordinates; its documentation explicitly connects this to finite-element assembly. This is a library convention to check when importing other representations, not permission to assume every interface handles duplicates identically. [SciPy COO notes](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.coo_array.html)

COO is convenient while collecting triplets. Finding one particular row in an unindexed COO list requires examining its row coordinates; recording both coordinates for every slot also costs space. We can derive a different representation by grouping the baseline's entries by row.

## CSR: replace repeated row numbers with boundaries

**Compressed Sparse Row (CSR)** stores `data`, column indices `indices`, and row boundaries `indptr`. It is also called compressed row storage (CRS). Entries of a row occupy one contiguous segment. See [Netlib's CRS definition](https://www.netlib.org/linalg/html_templates/node91.html).

First order the baseline's triplets by row, then by column:

| Row $i$ | Column indices | Values | Number of entries |
| --- | --- | --- | --- |
| 0 | 0, 3 | 1, 6 | 2 |
| 1 | 1 | 10.5 | 1 |
| 2 | 2 | 0.015 | 1 |
| 3 | 1, 3, 4 | 250.5, −280, 33.32 | 3 |
| 4 | 4 | 12 | 1 |

The counts are `[2, 1, 1, 3, 1]`. Start at zero and successively add them: $0,2,3,4,7,8$. These cumulative counts give the row boundaries:

```text
shape   = (5, 5)
indptr  = [0, 2, 3, 4, 7, 8]
indices = [0, 3,    1,     2,     1,    3,     4,  4]
data    = [1, 6, 10.5, 0.015, 250.5, -280, 33.32, 12]
```

For row $i$, slots run from `indptr[i]` **inclusive** to `indptr[i+1]` **exclusive**, often written `[indptr[i], indptr[i+1])`. Each slot's column is `indices[k]`. Row 3 occupies slots $4,5,6$: these recover $(3,1,250.5)$, $(3,3,-280)$, and $(3,4,33.32)$. The final pointer 8 marks the end; it is not a ninth stored coefficient. [SciPy's CSR array constructor](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html) uses this slice convention.

### Empty rows and validity

An empty row still has two boundaries; they are equal. In a **hypothetical modification** that removes row 3's entries while keeping the shape, the counts become `[2, 1, 1, 0, 1]`, so `indptr = [0, 2, 3, 4, 4, 5]`. The repeated 4 encodes an empty segment, not an error.

For the tightly packed, zero-based representation used here, check:

- `data` and `indices` both have length $s$; `indptr` has length $m+1$.
- `indptr[0] = 0`, `indptr[m] = s`, and pointers never decrease.
- Every column index is an integer from $0$ through $n-1$.

These conditions follow from partitioning the slots into row segments. **Canonical CSR** additionally has sorted column indices within each row and no duplicate coordinates, matching [SciPy's canonical-format definition](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html). Grouping by row alone does not guarantee either property.

## CSC: compress columns with the same idea

**Compressed Sparse Column (CSC)** groups by column and stores row indices. It is also called compressed column storage (CCS). The roles of rows and columns are exchanged relative to CSR. [Netlib's CCS definition](https://www.netlib.org/linalg/html_templates/node92.html)

For our baseline, the columns contain respectively $1,2,1,2,2$ entries. Cumulative counts give $0,1,3,4,6,8$:

```text
shape   = (5, 5)
indptr  = [0, 1, 3, 4, 6, 8]
indices = [0,    1,     3,     2, 0,    3,     3,  4]
data    = [1, 10.5, 250.5, 0.015, 6, -280, 33.32, 12]
```

Column $j$ occupies `[indptr[j], indptr[j+1])`. Thus column 1 uses slots 1 and 2: row indices 1 and 3 carry values 10.5 and 250.5. Notice that `indices` means **rows** here and **columns** in CSR. [SciPy's CSC constructor](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_array.html) documents these roles.

The validity checks exchange $m$ and $n$: there are $n+1$ pointers and row indices must lie in $[0,m)$. Canonical CSC sorts row indices within each column and removes duplicate coordinates. An empty column has equal adjacent pointers, just as an empty row does in CSR. [SciPy CSC notes](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_array.html)

### Transposition versus format conversion

The **transpose** $A^T$ exchanges row and column coordinates. Consequently, CSR arrays for an $m\times n$ matrix can be interpreted as CSC arrays for its $n\times m$ transpose: row groups become column groups, and column indices become row indices. This follows directly from the definitions; Netlib describes the same relationship in its [CCS discussion](https://www.netlib.org/linalg/html_templates/node92.html).

That interpretation represents $A^T$, not $A$. To convert CSR of $A$ to CSC of **the same $A$**, regroup the entries. Our baseline makes the distinction visible: CSR starts `data = [1, 6, …]`, whereas CSC starts `[1, 10.5, …]`.

## Explore the published baseline

{% include sparse-storage-lab.html %}

Choose a format and a row or column to trace. The small `k` labels identify positions in `data`, not coefficient magnitudes. COO keeps the published entry order; CSR and CSC use sorted inner indices. The removal scenarios are hypothetical experiments, retain the $5\times5$ shape, and omit zeros rather than explicitly storing them. Restore the baseline to return to the published entries. The arrays above remain available without JavaScript.

## Computation: the same product, different traversal

The following products and operation counts are **modern derivations from the array definitions**, not timings from the sources. For a supplementary input $x=(1,1,1,1,1)^T$, each output is a row sum:

$$
Ax=\begin{bmatrix}
1+6\\10.5\\0.015\\250.5-280+33.32\\12
\end{bmatrix}
=\begin{bmatrix}7\\10.5\\0.015\\3.82\\12\end{bmatrix}.
$$

### CSR gathers one output at a time

In $y_i=\sum_j a_{ij}x_j$, row $i$ determines one output. Its segment tells us exactly which terms to visit:

```text
for i = 0, ..., m-1:
    y[i] = 0
    for k = indptr[i], ..., indptr[i+1]-1:
        y[i] += data[k] * x[indices[k]]
```

For row 3 this evaluates $250.5x_1-280x_3+33.32x_4$. An empty segment leaves its output zero. Each stored slot is visited once, with $m$ row initializations: $O(m+s)$ work. Here $O(\cdot)$ describes how the work grows, ignoring fixed constants. Unsorted indices and additive duplicates still give the algebraic product with this loop; they need not be canonical first.

### CSC scatters each column's contribution

The equivalent identity $Ax=\sum_j x_j a_j$, where $a_j$ denotes column $j$, says to scale each column by $x_j$ and add it to the output:

```text
initialize y[0:m] to zero
for j = 0, ..., n-1:
    for k = indptr[j], ..., indptr[j+1]-1:
        y[indices[k]] += data[k] * x[j]
```

Column 1 adds $10.5x_1$ to $y_1$ and $250.5x_1$ to $y_3$. This visits $s$ slots, $n$ columns, and initializes $m$ outputs: $O(m+n+s)$ work for this particular loop. For $A^Tx$, the CSC column segments instead compute individual output dot products. An additive COO loop, `y[row[k]] += data[k] * x[col[k]]`, also computes $Ax$ in $O(m+s)$ work after initialization. Formats affect access and organization even when asymptotic counts look similar.

Parallel CSR row computations write distinct output entries. Parallel CSC columns may update the same output and need coordinated accumulation. These observations follow from the loops; they do not establish a universal speed ranking. Machine behavior, row lengths, and implementation still matter.

## Conversion: count, reserve, and place

To group $s$ valid COO triplets into CSR without sorting within rows:

1. Count triplets per row in an array of length $m$.
2. Form cumulative counts to create `indptr`.
3. Copy each row's starting boundary to a temporary `next` array.
4. For each `(i, j, v)`, put `j` and `v` at slot `next[i]`, then advance `next[i]`.

Every input slot is placed once. The counts and cumulative sums take $O(m+s)$ work in total, with $O(m)$ temporary bookkeeping beyond the output. This is a derivation for the stated algorithm, **not** a promise about every library conversion. Sorting and combining duplicates require additional steps. Applying comparison sorting to $s$ triplets by `(row, column)` first gives an $O(s\log s+m)$ route to canonical row ordering; sum equal coordinates, and optionally remove resulting zeros. CSC uses column counts and the analogous $n$-dependent bounds. Preserve the original shape throughout.

## Storage cost and choosing a format

Let each value occupy $b_v$ bytes and each index or pointer occupy $b_i$ bytes. Counting array entries gives these **payload estimates**, excluding object headers, alignment, spare capacity, shape metadata, and conversion workspaces:

| Representation | Value slots | Integer slots | Payload bytes |
| --- | --- | --- | --- |
| Dense | $mn$ | 0 | $mn b_v$ |
| COO | $s$ | $2s$ | $s(b_v+2b_i)$ |
| CSR | $s$ | $s+m+1$ | $s(b_v+b_i)+(m+1)b_i$ |
| CSC | $s$ | $s+n+1$ | $s(b_v+b_i)+(n+1)b_i$ |

For the published baseline, assume eight-byte values and four-byte integers. Dense uses $25\cdot8=200$ bytes, COO $8\cdot16=128$, and either compressed format $8\cdot12+6\cdot4=120$. These are illustrative arithmetic, not measured allocations.

CSR saves payload space relative to this dense model exactly when

$$
s(b_v+b_i)+(m+1)b_i<mn b_v.
$$

For a **supplementary hypothetical dense $2\times2$ matrix**, $s=4$ with the same widths: dense takes 32 bytes and CSR takes $4\cdot12+3\cdot4=60$. Sparse storage can cost more. Likewise, a very tall matrix with few entries can pay heavily for CSR's row pointers; COO avoids that dimension-sized array, and CSC may have fewer pointers.

| Task | Useful starting choice | Reason |
| --- | --- | --- |
| Collect contributions arriving in arbitrary order | COO | Each entry carries both coordinates |
| Traverse or extract rows repeatedly | CSR | Row boundaries locate contiguous segments |
| Traverse or extract columns repeatedly | CSC | Column boundaries locate contiguous segments |
| Repeated $Ax$ products | CSR is a common starting point | Each row computes one output |
| Frequent arbitrary insertions | Consider DOK or LIL during construction | Compressed segments may need shifting and pointer changes |

The row/column access tradeoffs and cost of changing compressed structure are documented in [SciPy CSR notes](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html) and [CSC notes](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_array.html). DOK stores a dictionary keyed by coordinates; LIL stores lists per row. See [SciPy's format overview](https://docs.scipy.org/doc/scipy/tutorial/sparse.html) for these and block or diagonal formats. Choose a solver's expected format when handing data to it, and account for conversion if operations repeat.

## Misconceptions and edge cases

- **“Compressed means values lose precision.”** CSR and CSC compress position information by grouping entries. The format itself does not quantize values; the chosen numeric type controls their precision.
- **“Every stored value is nonzero.”** An explicit zero occupies a slot. Invented duplicate contributions $+3$ and $-3$ at the same coordinate can also cancel. Summing duplicates and removing stored zeros are separate operations. [SciPy's discussion of implicit zeros and duplicates](https://docs.scipy.org/doc/scipy/tutorial/sparse.html)
- **“Every operation stays sparse.”** Adding a nonzero constant to every position makes formerly zero positions nonzero. Factorization can also introduce **fill-in**, new nonzero positions during elimination; see the coupling example in [Schur complement]({{ '/wiki/linear-algebra/schur-complement/' | relative_url }}).
- **“An empty matrix needs no metadata.”** For an all-zero $m\times n$ matrix, COO has empty triplet arrays; CSR has $m+1$ zero pointers and CSC $n+1$. All still retain the shape. These follow from the segment definitions.

## Practice problems

The following exercises are original teaching exercises. Problems 1 and 4 use the published baseline; other numerical data are supplementary invented examples.

### 1. Hand calculation: recover a column

Use the baseline CSC arrays to recover column 3, and compute that column's contribution when $x_3=2$.

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Read the two boundaries at positions 3 and 4 of `indptr`.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

The boundaries are 4 and 6, so use slots 4 and 5. Their row indices are 0 and 3, and their values are 6 and −280. Column 3 is $(6,0,0,-280,0)^T$. Multiplying it by 2 contributes $(12,0,0,-560,0)^T$; other columns still contribute to the complete product.

</details>
</div>

### 2. Hand calculation: preserve empty dimensions

Encode $B$ in CSR and CSC:

$$
B=\begin{bmatrix}0&5&0&0\\0&0&0&0\\2&0&0&0\end{bmatrix}.
$$

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Count all three rows or all four columns, including empty ones.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

Both representations retain `shape = (3, 4)`. CSR has `data = [5, 2]`, `indices = [1, 0]`, `indptr = [0, 1, 1, 2]`. CSC has `data = [2, 5]`, `indices = [2, 0]`, `indptr = [0, 1, 2, 2, 2]`. Equal CSR boundaries encode the empty middle row; equal CSC boundaries encode the final two empty columns.

</details>
</div>

### 3. Strategy: choose a construction workflow

A program collects contributions in arbitrary order, sometimes repeating coordinates, then repeatedly evaluates $Ax$. What storage workflow would you try, and what would you measure?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Separate collecting entries from repeatedly traversing them.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

Collect COO triplets with the full shape. Apply the intended duplicate rule, then convert to CSR for row-based products. If zeros are removed, verify that explicit zeros carry no application meaning. Measure construction and conversion time, payload and temporary memory, and repeated product time. A conversion is justified by the complete workload; one product alone might not repay its cost.

</details>
</div>

### 4. Logic: prove the transpose interpretation

Explain why baseline CSR arrays represent $A^T$ when reinterpreted as CSC. Why do those arrays fail to represent the same $A$ in CSC?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Track the coordinate of the value 6 in each interpretation.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

A slot in CSR row segment $i$ with inner index $j$ represents $a_{ij}$. In CSC the same segment is column $i$, with row index $j$, so it represents $(A^T)_{ji}=a_{ij}$. The shape must become $(n,m)$. Here 6 moves from $(0,3)$ to $(3,0)$. Since $a_{3,0}=0$, that reinterpreted array is not CSC of the original matrix, even though its square shape remains unchanged.

</details>
</div>

### 5. Logic: distinguish storage from coefficients

An additive COO representation of shape $(2,3)$ has triplets `(0,1,3)`, `(0,1,-3)`, and `(1,2,0)`. How many stored entries and mathematical nonzeros are there before and after summing duplicates and removing explicit zeros?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Reconstruct the matrix before counting its nonzero coefficients.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

Initially there are three stored entries, but the represented matrix is all zero. Combining the repeated coordinate leaves two stored zero entries if zeros are retained. Removing explicit zeros leaves no stored entries. At every stage the mathematical nonzero count is zero, and the shape remains $(2,3)$.

</details>
</div>

### 6. Application: estimate a memory budget

A $1000\times1000$ matrix has 5000 stored entries, no duplicates, and no explicit zeros. Estimate dense, COO, and CSR payload sizes with eight-byte values and four-byte indices. Does this establish which representation computes fastest?

<div class="wiki-exercise" markdown="1">
<details markdown="1">
<summary>Reveal a hint</summary>

Include all 1001 CSR pointers and keep bytes separate from timings.

</details>
<details markdown="1">
<summary>Reveal the worked solution</summary>

Dense: $10^6\cdot8=8{,}000{,}000$ bytes. COO: $5000\cdot16=80{,}000$ bytes. CSR: $5000\cdot12+1001\cdot4=64{,}004$ bytes. These exclude metadata and temporary allocations. They show payload savings under the assumptions; timing depends on the operation and implementation and must be measured.

</details>
</div>

## Further learning

- [NIST: Matrix Market file formats](https://math.nist.gov/MatrixMarket/formats.html): connect coordinate triplets to an exchange file, and compare its one-based indices with the arrays here.
- [Netlib: sparse matrix storage survey](https://www.netlib.org/linalg/html_templates/node90.html): explore how block, diagonal, and other structure can motivate additional formats.
- [SciPy: sparse arrays tutorial](https://docs.scipy.org/doc/scipy/tutorial/sparse.html): practice construction, conversion, and the distinction between stored and implicit zeros.

## Related pages

- [Matrix factorization and decomposition]({{ '/wiki/linear-algebra/matrix-decomposition/' | relative_url }})
- [LU decomposition]({{ '/wiki/linear-algebra/lu-decomposition/' | relative_url }})
- [Cholesky decomposition]({{ '/wiki/linear-algebra/cholesky-decomposition/' | relative_url }})
- [Schur complement]({{ '/wiki/linear-algebra/schur-complement/' | relative_url }})
- [Linear programming]({{ '/wiki/optimization/linear-programming/' | relative_url }})

## References

1. NIST. [Matrix Market](https://math.nist.gov/MatrixMarket/). The repository's purpose: test data for comparing numerical linear algebra algorithms.
2. NIST. [Matrix Market: Text File Formats](https://math.nist.gov/MatrixMarket/formats.html), “Matrix Market Exchange Formats,” real general $5\times5$ example. Source of the eight baseline coefficients and the file's one-based convention.
3. Barrett, R., et al. *Templates for the Solution of Linear Systems: Building Blocks for Iterative Methods*. Netlib online edition: [storage survey](https://www.netlib.org/linalg/html_templates/node90.html), [compressed row storage](https://www.netlib.org/linalg/html_templates/node91.html), and [compressed column storage](https://www.netlib.org/linalg/html_templates/node92.html).
4. SciPy documentation. [`coo_array`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.coo_array.html). Coordinate storage, duplicate handling, and stored-entry counts.
5. SciPy documentation. [`csr_array`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html). Row segments, canonical form, and access tradeoffs.
6. SciPy documentation. [`csc_array`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_array.html). Column segments, canonical form, and access tradeoffs.
7. SciPy documentation. [Sparse Arrays tutorial](https://docs.scipy.org/doc/scipy/tutorial/sparse.html). Format choices and explicit versus implicit zeros.
