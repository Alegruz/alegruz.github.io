---
layout: post
title:  Study Notes on Monte Carlo Integration
date:   2025-06-28 20:55:00 +0900
categories: graphics
lang: "en"
---

When learning new concepts, I often ask the following questions to keep myself focused:

* What is it? (briefly and thoroughly)
* Where and when is it used?
* Why is it used?
* How is it used?

The topic of the post is **Monte Carlo Integration**.

# What is it? (briefly)

Monte Carlo integration is a technique for numerical integration using random numbers.<sup><a href="#footnote1">1</a></sup> For example, we can use this method to estimate the area of a circle. We all know that the area of a circle is given by the formula \(A = \pi r^2\). However, if we want to estimate this area without using the formula, we can use Monte Carlo integration. First, think of a square that contains a circle of radius 1. Put the square and the circle on a coordinate system, as shown below:

By <a href="//commons.wikimedia.org/wiki/User:Yoderj" title="User:Yoderj">Yoderj</a>, <a href="//commons.wikimedia.org/wiki/User:Mysid" title="User:Mysid">Mysid</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="http://creativecommons.org/publicdomain/zero/1.0/deed.en" title="Creative Commons Zero, Public Domain Dedication">CC0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=35608043">Link</a>

Now, we can randomly generate points within the square and count how many of them fall inside the circle. The ratio of the number of points inside the circle to the total number of points will give us an estimate of the area of the circle. Specifically, if \(N\) is the total number of points and \(M\) is the number of points inside the circle, then the area \(A\) can be estimated as:

$$A \approx \frac{M}{N} \times 4$$

Let's try an interactive example:

<div id="monte-carlo-demo" style="text-align: center; margin: 20px 0;">
  <canvas id="monte-carlo-canvas" width="400" height="400" style="border: 1px solid #ccc; margin: 10px;"></canvas>
  <br>
  <button id="start-simulation" style="padding: 10px 20px; margin: 5px; background-color: #007cba; color: white; border: none; border-radius: 5px; cursor: pointer;">Start Simulation</button>
  <button id="reset-simulation" style="padding: 10px 20px; margin: 5px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Reset</button>
  <br>
  <div id="monte-carlo-stats" style="margin: 10px; font-family: monospace;">
    <p>Points inside circle: <span id="points-inside">0</span></p>
    <p>Total points: <span id="total-points">0</span></p>
    <p>Estimated π: <span id="estimated-pi">0</span></p>
    <p>Actual π: 3.14159...</p>
  </div>
</div>

<script>
(function() {
  const canvas = document.getElementById('monte-carlo-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('start-simulation');
  const resetBtn = document.getElementById('reset-simulation');
  
  let pointsInside = 0;
  let totalPoints = 0;
  let animationId = null;
  let isRunning = false;
  
  const radius = 180;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  function drawCircleAndSquare() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw square
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#007cba';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  function addRandomPoint() {
    // Generate random point in square
    const x = (Math.random() - 0.5) * 2 * radius + centerX;
    const y = (Math.random() - 0.5) * 2 * radius + centerY;
    
    // Check if point is inside circle
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const isInside = distance <= radius;
    
    if (isInside) {
      pointsInside++;
      ctx.fillStyle = '#28a745'; // Green for inside
    } else {
      ctx.fillStyle = '#dc3545'; // Red for outside
    }
    
    totalPoints++;
    
    // Draw point
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Update statistics
    updateStats();
  }
  
  function updateStats() {
    document.getElementById('points-inside').textContent = pointsInside;
    document.getElementById('total-points').textContent = totalPoints;
    
    if (totalPoints > 0) {
      const estimatedPi = (pointsInside / totalPoints) * 4;
      document.getElementById('estimated-pi').textContent = estimatedPi.toFixed(6);
    }
  }
  
  function animate() {
    if (isRunning && totalPoints < 2000) {
      addRandomPoint();
      animationId = setTimeout(animate, 50); // Add point every 50ms
    } else if (totalPoints >= 2000) {
      isRunning = false;
      startBtn.textContent = 'Start Simulation';
    }
  }
  
  function startSimulation() {
    if (!isRunning) {
      isRunning = true;
      startBtn.textContent = 'Stop Simulation';
      animate();
    } else {
      isRunning = false;
      startBtn.textContent = 'Start Simulation';
      if (animationId) {
        clearTimeout(animationId);
      }
    }
  }
  
  function resetSimulation() {
    isRunning = false;
    if (animationId) {
      clearTimeout(animationId);
    }
    pointsInside = 0;
    totalPoints = 0;
    startBtn.textContent = 'Start Simulation';
    drawCircleAndSquare();
    updateStats();
  }
  
  // Event listeners
  startBtn.addEventListener('click', startSimulation);
  resetBtn.addEventListener('click', resetSimulation);
  
  // Initialize
  drawCircleAndSquare();
  updateStats();
})();
</script>

As you can see, the estimated value of &pi; approaches the actual value as we increase the number of points. This is a simple example of how Monte Carlo integration works.

Basically, Monte Carlo integration uses random sampling to estimate the value of an integral. It is particularly useful for high-dimensional integrals or when the function to be integrated is complex or difficult to evaluate analytically.

# Where and when is it used?

Common question in rendering is to solve the rendering equation, which is an integral equation. Monte Carlo integration is often used in computer graphics to solve this equation, especially in global illumination algorithms. It allows us to estimate the contribution of light from various sources in a scene, taking into account complex interactions between light and surfaces.

$$L(x, \omega_o) = L_e(x, \omega_o) + \int_{\Omega} f_r(x, \omega_i, \omega_o) L_i(x, \omega_i) d\omega_i$$

# Why is it used?

Let's rephrase the question: why not use other numerical integration methods? The answer is that Monte Carlo integration is particularly effective for high-dimensional integrals, where traditional methods like trapezoidal or Simpson's rule become impractical due to the curse of dimensionality. In such cases, Monte Carlo integration can provide a more efficient and scalable solution.

# What is it? (thoroughly)

Computer Graphics: Principles and Practice

30. Probability and Monte Carlo Integration
30.2. Numerical Integration
30.3 Random Variables and Randomized Algorithms
30.3.1. Discrete Probability and Its Relationship to Programs
30.3.2. Expected Value
30.3.3. Properties of Expected Value, and Related Terms
30.3.4. Continuum Probability
30.3.5 Probability Density Functions
30.3.6. Application to the Sphere
30.3.7. A Simple Example
30.3.8. Application to Scattering
30.4. Continuum Probability, Continued
30.5. Importance Sampling and Integration
30.6. Mixed Probabilities
30.7. Discussion and Further Reading
30.8. Exercises

Advnced Global Illumination, 2nd Edition

3. Monte Carlo Methods
3.1. Brief History
3.2. Why Are Monte Carlo Techniques Useful?
3.3. Review of Probability Theory
3.3.1. Discrete Random Variables
3.3.2. Continuous Random Variables
3.3.3. Conditional and Marginal Probabilities
3.4. Monte Carlo Integration
3.4.1. Weighted Sum of Random Variables
3.4.2. Estimator
3.4.3. Bias
3.4.4. Accuracy
3.4.5. Estimating the Variance
3.4.6. Deterministic Quadrature versus Monte Carlo
3.4.7. Multidimensional Monte Carlo Integration
3.4.8. Summary of Monte Carlo
3.5. Sampling Random Variables
3.5.1. Inverse Cumulative Distribution Function
3.5.2. Rejection Sampling
3.5.3. Look-Up Table
3.6. Variance Reduction
3.6.1. Importance Sampling
3.6.2. Stratified Sampling
3.6.3. N-Rooks or Latin Hypercube Algorithm
3.6.4. Combining Stratified Sampling and Importance Sampling
3.6.5. Combining Estimators of Different Distributions
3.6.6. Control Variates
3.6.7. Quasi-Monte Carlo
3.7. Summary
3.8. Exercises

Advanced Global Illumination, SIGGRAPH

Monte Carlo Integration
1. Terms and definitions
2. Basic Monte Carlo Integration
3. Importance Sampling
4. Stratified Sampling
5. When to use Monte Carlo Integration?
6. Fredholm Equation and Monte Carlo Integration
6.1. Fredholm equations of the second kind
6.2. Relationship with global illumination
6.3. Recursive Monte Carlo solutions

Physically Based Rendering, 4th Edition

2. Monte Carlo Integration
2.1. Monte Carlo: Basics
2.1.1. Background and Probability Review
2.1.2. Expected Values
2.1.3. The Monte Carlo Estimator
2.1.4. Error in Monte Carlo Estimators
2.2. Improving Efficiency
2.2.1. Stratified Sampling
2.2.2. Importance Sampling
2.2.3. Multiple Importance Sampling
2.2.4. Russian Roulette
2.2.5. Splitting
2.3. Sampling Using the Inversion Method
2.3.1. Discrete Case
2.3.2. Continuous Case
2.4. Transforming between Distributions
2.4.1. Transformation in Multiple Dimensions
2.4.2. Sampling with Multidimensional Transformations

Mathematical Statistics and Data Analysis, 3rd Edition

5. Limit Theorems
5.1. Introduction
5.2. The Law of Large Numbers
Example A: Monte Carlo Integration

Fundamentals of Computer Graphics, 5th Edition

Principles of Digital Image Synthesis

7. Monte Carlo Integration
7.1. Introduction
7.2. Basic Monte Carlo Ideas
7.3. Confidence
7.4. Blind Monte Carlo
7.4.1. Crude Monte Carlo
7.4.2. Rejection Monte Carlo
7.4.3. Blind Stratified Sampling
7.4.4. Quasi Monte Carlo
7.4.5. Weighted Monte Carlo
7.4.6. Multidimensional Weighted Monte Carlo
7.5. Informed Monte Carlo
7.5.1. Informed Stratified Sampling
7.5.2. Importance Sampling
7.5.3. Control Variates
7.5.4. Antithetic Variates
7.6. Adaptive Sampling
7.7. Other Approaches
7.8. Summary
7.9. Further Reading
7.10. Exercises

Algebra and Trigonometry, 4th Edition

14. Counting and Probability
Focus on Modeling: The Monte Carlo Method

State of the Art in Monte Carlo Global Illumination: SIGGRAPH 2004

# How is it used?

<div class="footnote">
  <p id="footnote1">1. <a href="https://en.wikipedia.org/wiki/Monte_Carlo_integration">Wikipedia</a></p>
</div>