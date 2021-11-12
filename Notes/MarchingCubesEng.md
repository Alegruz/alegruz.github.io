# Marching Cube Study Note (12 NOV 2021)

books read:
* [Computer Graphics Principles Practice](https://en.wikipedia.org/wiki/Computer_Graphics:_Principles_and_Practice)
* [Real-Time Rendering](https://www.realtimerendering.com/)

## What is Marching Cube?

### Explicit Surface and Implicit Surface<sup>[1](#footnote_1)</sup>

There are two types of surfaces to understand beforehand. The **Explicit Surface** and the **[Implicit Surface](https://en.wikipedia.org/wiki/Implicit_surface)**. Explicit surface is a surface that has every vertices, indices described. Thus all the vertices and indices information that we feed to OpenGL or DirectX is an explicit surface. In the other hand, implicit surface is where functions in form of F(x, y, z) = 0 is used. x + 2y - 3z + 1 = 0 is an equation of a plane in 3d space. In order to render this plane, however, we ultimately need an explicit representation of the function.

### Conversion to Polyhedral Meshes<sup>[2](#footnote_2)</sup>

In order to convert implicit surface into explicit surface, we must understand the process by images rather than words. First of all, imagine that a space is separated by an invisible uniform grids. For all the vertices of a grid, we can use their coordinate vector and use that as an argument to the implicit surface. If the result is equal to zero, that means that the vertex is *exactly on* the surface, if it is greater than zero, then the vertex is *farther away* from the surface, if it is less than zero, then the vertex is *inside* the surface. For example, if there is at least one vertex that is inside the surface, then at least some kind of mesh is intersecting with the grid. This is the fundamental concept of Marching Cubes.

![525px-MarchingCubes](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/MarchingCubes.svg/525px-MarchingCubes.svg.png)

The above image shows all possibilities in a sample grid. We will discuss each case one by one. To explain the concept in a simple manner, the grid will be considered to be a 1 × 1 × 1 grid, and name the vertices by coordinates, ((0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0), (0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)). We are considering the meshes to be triangular.

1. All the vertices are farther away from the surface, thus no mesh would be inside the grid.
2. Only one vertex (1, 0, 0) is the only vertex inside the surface, thus the mesh will pass through all the edges that contains (1, 0, 0)
3. Two adjacent vertices are inside the surface, thus the meshes will pass through the edges that contains those two vertices except the one that contains both of them.
4. Two non-adjacent vertices are inside the surface. Meshes will pass through the edges that contains those two vertices.
5. Three adjacent vertices are inside the surface. Meshes will pass through the edges that contains those three vertices except the ones that contains two of them ((0, 0, 0) - (0, 1, 0) and (0, 1, 0) - (1, 1, 0)).
6. ...

In order to explain the basic concept, we have not considered the case where a vertex exactly produces 0 with the implicit representation, and places the vertex that mesh passes through to be at the center of the edge. Also, there are cases where there are multiple possibilities to intersect a grid in a given situtation (the 14th case shows two that result in isocurves with no self-intersections).

After this process is over, we have produced a topologically valid isocurve configuration. The next step is to find the correct location on each grid edge and move the midpoint intersection to the correct location.

There are some properties we can gain from the isosurface:
* Each isocurve vertex can be named after the two grid vertices. If an isocurve vertex is between (1, 0, 0) and (1, 1, 0), then we can name the isocurve as (1, 0, 1, 1) by combining the x and y components (1, 0) and (1, 1).
* Each grid can be process one at a time. For each square, we:
    * Find the isocurve vertices.
    * If the vertex is a newly found one, then map it to the vertex table with the vertex name. If the table already contains the vertex, then do nothing.
    * For each new vertex, based on the implicit values of each grid vertices, determine the exact location of the vertex.
    * 

---

</div>
<div id="footnote_1">
<p>1. This paragraph is based on the book <a href="https://fluidenginedevelopment.org/">&lt;The Fluid Engine Development></a> by Doyub Kim</p>
</div>
<div id="footnote_2">
<p>2. This paragraph is based on the book <a href="https://en.wikipedia.org/wiki/Computer_Graphics:_Principles_and_Practice">&lt;Computer Graphics Principles Practice></a> by James D. Foley, Andries van Dam, Steven K. Feiner, John Hughes, Morgan McGuire, David F. Sklar, and Kurt Akeley</p>