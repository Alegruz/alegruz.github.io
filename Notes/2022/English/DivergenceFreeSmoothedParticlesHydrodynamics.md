# Divergence-Free Smoothed Particles Hydrodynamics (DFPSH) (06 JAN 2022)
[Home](/README.md)

## Simulation

```
1   function PerformSimulation
2       for all particles i do              // initialize neighborhoods
3           find neighborhoods Ni(0)
4       for all particles i do              // initialize ρi and αi
5           compute densities ρi(0)
6           compute factors αi(0)
7       while (t < tmax) do                 // start simulation loop
8           for all particles i do
9               compute non-pressure forces Fadvi(t)
10          adapt time step size Δt accordint to CFL condition
11          for all particles i do          // predict velocities v*i
12              v*i = vi + ΔtFadvi/mi
13          CorrectDensityError(α, v*)      // fulfill ρ* - ρ0 = 0
14          for all particles i do          // update positions
15              xi(t + Δt) = xi(t) + Δtv*i
16          for all particles i do          // update neighborhoods
17              find neighborhoods Ni(t + Δt)
18          for all particles i do          // update ρi and αi
19              compute densities ρi(t + Δt)
20              compute factors αi(t + Δt)
21          CorrectDivergenceError(α, v*)   // fulfill Dρ/Dt = 0
22          for all particles i do          // update velocities
23              vi(t + Δt) = v*i
```

### Initializing Neighborhoods

Original paper performs compact hashing, but my current SPH simulation uses grid hashing.

### Initializing ρ<sub>i</sub> and α<sub>i</sub>

α<sub>i</sub> is a common factor of both solvers which is required to correct the density error and the divergence error, respectively. Since this factor solely depends on the current positions, it is precomputed before executing the solvers which reduces the computational effort of both solvers significantly.

![FactorEquation](/Images/Dfsph/FactorEquation.gif)