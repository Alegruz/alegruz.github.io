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

## Table of Contents

{: .no_toc}

* TOC
{:toc}

## What is it? (briefly)

Monte Carlo integration is a technique for numerical integration using random numbers.<sup><a href="#footnote_1">[1]</a></sup> For example, we can use this method to estimate the area of a circle. We all know that the area of a circle is given by the formula A = &pi; r<sup>2</sup>. However, if we want to estimate this area without using the formula, we can use Monte Carlo integration. First, think of a square that contains a circle of radius 1. Put the square and the circle on a coordinate system, as shown below:

![Circle and Square](https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/MonteCarloIntegrationCircle.svg/720px-MonteCarloIntegrationCircle.svg.png?20230918195346)

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

## Where and when is it used?

Common question in rendering is to solve the rendering equation, which is an integral equation. Monte Carlo integration is often used in computer graphics to solve this equation, especially in global illumination algorithms. It allows us to estimate the contribution of light from various sources in a scene, taking into account complex interactions between light and surfaces.

$$L(x, \omega_o) = L_e(x, \omega_o) + \int_{\Omega} f_r(x, \omega_i, \omega_o) L_i(x, \omega_i) d\omega_i$$

## Why is it used?

Let's rephrase the question: why not use other numerical integration methods? The answer is that Monte Carlo integration is particularly effective for high-dimensional integrals, where traditional methods like trapezoidal or Simpson's rule become impractical due to the curse of dimensionality. In such cases, Monte Carlo integration can provide a more efficient and scalable solution.

## What is it? (thoroughly)

Our ideal goal is to compute the radiance L at a point x in a direction &omega;<sub>o</sub> using the rendering equation.

$$L(x, \omega_o) = L_e(x, \omega_o) + \int_{\Omega} f_r(x, \omega_i, \omega_o) L_i(x, \omega_i) d\omega_i$$

where:

* L<sub>e</sub>(x, &omega;<sub>o</sub>) is the emitted radiance from point x in direction &omega;<sub>o</sub>,
* f<sub>r</sub>(x, &omega;<sub>i</sub>, &omega;<sub>o</sub>) is the bidirectional reflectance distribution function (BRDF) at point x for incoming direction &omega;<sub>i</sub> and outgoing direction &omega;<sub>o</sub>,
* L<sub>i</sub>(x, &omega;<sub>i</sub>) is the incoming radiance at point x from direction &omega;<sub>i</sub>,
* &Omega; is the hemisphere of directions above the surface at point x.

Among these terms, the emission term L<sub>e</sub>(x, &omega;<sub>o</sub>) is usually straightforward to compute, as it is often a constant value for a given surface. The BRDF term f<sub>r</sub>(x, &omega;<sub>i</sub>, &omega;<sub>o</sub>) is also typically known for a given material. However, the incoming radiance L<sub>i</sub>(x, &omega;<sub>i</sub>) is often complex and difficult to compute directly, especially in scenes with multiple light sources and complex geometry. Even though we can compute the integral over the hemisphere, it is often impractical to do so analytically due to the complexity of the scene and the interactions between light and surfaces. Ultimately, theoretically, it is impossible to compute the integral analytically, so we need to use numerical methods to estimate it.

### Numerical Integration

For a given function f(x) defined over an interval [a, b], numerical integration methods approximate the integral of f over that interval. The integral can be expressed as:

$$I(f) = \int_{a}^{b} f(x) dx$$

Any explicit formula that can approximate I(f) is called a *numerical integration formula* or *quadrature formula*.

For example, let's say that there exists an approximation function f<sub>n</sub>(x) where n is a non-negative integer. We instead compute the integral of f<sub>n</sub>(x) over the interval [a, b]:

$$I_n(f) = \int_{a}^{b} f_n(x) dx$$

We can compute the *quadrature error* as follows:

$$E_n(f) = I(f) - I_n(f) = \int_{a}^{b} f(x) dx - \int_{a}^{b} f_n(x) dx$$

Where E stands for *error*. The goal of numerical integration is to minimize this error E<sub>n</sub>(f).

If function f is continuous in the interval [a, b], or f &in; C<sup>0</sup>([a, b])<sup><a href="#footnote_2">[2]</a></sup>, according to the triangle inequality<sup><a href="#footnote_3">[3]</a></sup>, we can bound the error as follows:

$$|E_n(f)| = |I(f) - I_n(f)| = |\int_{a}^{b} f(x) dx - \int_{a}^{b} f_n(x) dx| \leq \int_{a}^{b} |f(x) - f_n(x)| dx$$

Using the fact that an integral of a function that is continuous in the interval [a, b] is bounded by the area of the rectangle with height equal to the maximum value of the function and width equal to the length of the interval, we can further bound the error. We call the norm with this maximum height the uniform norm, denoted as \|\|f - f<sub>n</sub>\|\|<sub>∞</sub> in our case. Thus, we can write:

$$\int_{a}^{b} |f(x) - f_n(x)| dx \leq ||f - f_n||_{\infty} \cdot (b - a)$$

Thus our final inequality for the error becomes:

$$|E_n(f)| \leq \int_{a}^{b} |f(x) - f_n(x)| dx \leq ||f - f_n||_{\infty} \cdot (b - a)$$

Therefore, if we can bound the uniform norm \|\|f - f<sub>n</sub>\|\|<sub>∞</sub>, we can bound the error of our numerical integration formula. For example, let's say that our uniform norm is bounded by a constant &epsilon;, then we can write:

$$||f - f_n||_{\infty} < \epsilon$$

$$|E_n(f)| \leq \epsilon \cdot (b - a)$$

Now, the problem is to come up with an easily integrable function f<sub>n</sub>(x) that approximates the original function f(x) well enough. One example is to use a polynomial approximation, or:

$$f_n \in \mathbb{P}_n$$

We can 

where P<sub>n</sub>([a, b]) is the space of polynomials of degree at most n defined over the interval [a, b]. In this case, we can use polynomial interpolation to find a polynomial that approximates f(x) well enough.

One way is to use the interpolating Lagrange polynomial. The Lagrange interpolating polynomial is the unique polynomial of lowest degree that interpolates a given set of data<sup><a href="#footnote_4">[4]</a></sup>.

<div id="lagrange-interpolating-polynomial-demo" style="text-align: center; margin: 20px 0;">
  <canvas id="lagrange-interpolating-polynomial-canvas" width="400" height="400" style="border: 1px solid #ccc; margin: 10px;"></canvas>
  <br>
  <button id="add-point" style="padding: 10px 20px; margin: 5px; background-color: #007cba; color: white; border: none; border-radius: 5px; cursor: pointer;">Add Point</button>
  <button id="reset-points" style="padding: 10px 20px; margin: 5px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Reset</button>
  <div style="margin: 10px; font-family: monospace;">
    <p>Number of Points: <span id="num-points">0</span></p>
  </div>
</div>

<script>
(function () {
  const canvas = document.getElementById("lagrange-interpolating-polynomial-canvas");
  const ctx = canvas.getContext("2d");
  const addPointBtn = document.getElementById("add-point");
  const resetBtn = document.getElementById("reset-points");
  const numPointsDisplay = document.getElementById("num-points");

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const XMIN = -10, XMAX = 10;
  const YMIN = -10, YMAX = 10;

  let points = [];

  function worldToCanvas(x, y) {
    const cx = ((x - XMIN) / (XMAX - XMIN)) * WIDTH;
    const cy = HEIGHT - ((y - YMIN) / (YMAX - YMIN)) * HEIGHT;
    return [cx, cy];
  }

  function canvasToWorld(cx, cy) {
    const x = XMIN + (cx / WIDTH) * (XMAX - XMIN);
    const y = YMAX - (cy / HEIGHT) * (YMAX - YMIN);
    return [x, y];
  }

  function drawAxes() {
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;

    // X-axis
    const [x0, y0] = worldToCanvas(XMIN, 0);
    const [x1, y1] = worldToCanvas(XMAX, 0);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Y-axis
    const [x2, y2] = worldToCanvas(0, YMIN);
    const [x3, y3] = worldToCanvas(0, YMAX);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.stroke();
  }

  function lagrangeBasis(x, i) {
    const xi = points[i][0];
    let result = 1;
    for (let j = 0; j < points.length; j++) {
      if (j !== i) {
        const xj = points[j][0];
        result *= (x - xj) / (xi - xj);
      }
    }
    return result;
  }

  function lagrangeInterpolatingPolynomial(x) {
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
      sum += points[i][1] * lagrangeBasis(x, i);
    }
    return sum;
  }

  function drawPolynomial() {
    ctx.beginPath();
    ctx.strokeStyle = "#007cba";
    ctx.lineWidth = 2;

    let first = true;
    for (let px = 0; px <= WIDTH; px++) {
      const x = XMIN + (px / WIDTH) * (XMAX - XMIN);
      const y = lagrangeInterpolatingPolynomial(x);
      const [cx, cy] = worldToCanvas(x, y);

      if (first) {
        ctx.moveTo(cx, cy);
        first = false;
      } else {
        ctx.lineTo(cx, cy);
      }
    }

    ctx.stroke();
  }

  function drawPoints() {
    for (const [x, y] of points) {
      const [cx, cy] = worldToCanvas(x, y);
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#dc3545";
      ctx.fill();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawAxes();
    drawPoints();
    if (points.length > 1) {
      drawPolynomial();
    }
  }

  function addRandomPoint() {
    const x = parseFloat((Math.random() * 20 - 10).toFixed(2));
    const y = parseFloat((Math.random() * 20 - 10).toFixed(2));
    points.push([x, y]);
    numPointsDisplay.textContent = points.length;
    draw();
  }

  function reset() {
    points = [];
    numPointsDisplay.textContent = "0";
    draw();
  }

  addPointBtn.addEventListener("click", addRandomPoint);
  resetBtn.addEventListener("click", reset);

  draw();
})();
</script>

What we have to do is to sample n points from the function f(x) and use these points to construct the Lagrange interpolating polynomial. The Lagrange polynomial is defined as:

$$f_n = \Pi_n f$$

If Lagrange interpolating polynomial is a polynomial, then what are the basis of the polynomial? The basis of the polynomial is given by the Lagrange basis polynomials, which are defined as:

$$L_i(x) = \prod_{j=0, j \neq i}^{n} \frac{x - x_j}{x_i - x_j}$$

where x<sub>i</sub> are the sample points. The Lagrange polynomial can then be expressed as:

$$L_n(x) = \sum_{i=0}^{n} f(x_i) L_i(x)$$

where L<sub>i</sub>(x) are the Lagrange basis polynomials.

Now let's define the approximation function f<sub>n</sub>(x) as the Lagrange polynomial:

$$f_n(x) = L_n(x) = \sum_{i=0}^{n} f(x_i) L_i(x)$$

The final integral can then be approximated as:

$$I_n(f) = \int_{a}^{b} f_n(x) dx = \int_{a}^{b} \sum_{i=0}^{n} f(x_i) L_i(x) dx$$

The f(x<sub>i</sub>) are constant values, so we can take them out of the integral:

$$I_n(f) = \sum_{i=0}^{n} f(x_i) \int_{a}^{b} L_i(x) dx$$

We can generalize this by defining the integrand as a coefficient &alpha;<sub>i</sub>:

$$I_n(f) = \sum_{i=0}^{n} \alpha_i f(x_i)$$

where &alpha;<sub>i</sub> = &int;<sub>a</sub><sup>b</sup> L<sub>i</sub>(x) dx.

This can be viewed as a weighted sum of the function values at the sample points, where the sample points are called **nodes** and the **weights** are called **coefficients**.

#### Multidimensional Numerical Integration

The function we want to integrate is defined over a multidimensional space, such as a sphere or a hemisphere. Especially, when the number of dimensions exceed two, we often use Monte Carlo integration to estimate the integral. Unlike other analytical methods, Monte Carlo integration's quadrature nodes or coefficients are statistically chosen according to the values attained by random variables having a known probability distribution.

The basic idea is to consider the integral as the expected value of a function over a probability distribution. We call this as a **statistic mean value**.

Now that we have multidimensional space, we can define the integral as:

$$I(f) = \int_{\Omega} f(\textbf{x}) d\textbf{x}$$

where &Omega; is the domain of integration, which can be a sphere, hemisphere, or any other multidimensional space. Thus,

$$\Omega \in \mathbb{R}^n$$

where n is the number of dimensions.

We can rewrite the original integral from the domain of integration &Omega; to the entire space &Ropf;<sup>n</sup> by using a characteristic function &chi;<sub>&Omega;</sub>(x):

$$\chi_{\Omega}(\textbf{x}) = \begin{cases} 1 & \text{if } \textbf{x} \in \Omega \\ 0 & \text{otherwise} \end{cases}$$

Thus, we can rewrite the integral as:

$$I(f) = \int_{\mathbb{R}^n} f(\textbf{x}) \chi_{\Omega}(\textbf{x}) d\textbf{x}$$

Now is the time for a little trick. Multiply the volume of the domain of integration &Omega; to the integral with its inverse:

$$I(f) = \frac{|\Omega|}{|\Omega|} \int_{\mathbb{R}^n} f(\textbf{x}) \chi_{\Omega}(\textbf{x})  d\textbf{x}$$

Move the inverse volume of the domain of integration &Omega; into the integral:

$$I(f) = {|\Omega|}\int_{\mathbb{R}^n} f(\textbf{x}) \frac{\chi_{\Omega}(\textbf{x})}{|\Omega|} d\textbf{x}$$

We can see that the term &chi;<sub>&Omega;</sub>(**x**) / \|&Omega;\| is a probability density function (PDF) defined over the domain of integration &Omega;. Wait, doesn't this look like an expected value? Yes, it does! We can rewrite the integral as an expected value of the function f over the PDF defined by the characteristic function &chi;<sub>&Omega;</sub>(x):

$$I(f) = |\Omega| \mathbb{E}_{\chi_{\Omega}}[f(\textbf{x})] = |\Omega| \int_{\mathbb{R}^n} f(\textbf{x}) p(\textbf{x}) d\textbf{x} = |\Omega| \mu(f)$$

where 

$$p(\textbf{x}) = \frac{\chi_{\Omega}(\textbf{x})}{|\Omega|}$$

is the PDF defined over the domain of integration &Omega;, and &mu;(f) is the expected value of the function f over the PDF p.

where &Omega; is the volume of the domain of integration &Omega;. This is equivalent to multiplying the integral by 1, so it does not change the value of the integral.

I think this is a good place to review probabilities and random variables, as they are the key concepts in Monte Carlo integration.

### Probability and Random Variables

#### Random Variables

A random variable is a mathematical formalization of a quantity or object which depends on random events<sup><a href="#footnote_5">[5]</a></sup>. We all know that this kind of formal definition is not very useful, so let's try to understand it better.

For example, let's say that we have three fair coins. A fair coin is a coin that has an equal probability of landing on heads or tails. In this case, the random event is the outcome of flipping the coins. Based on this event, we can define a random variable X that represents the number of heads that appear when we flip the three coins. The possible values of X are 0, 1, 2, or 3, depending on how many heads appear. You can define a random variable for any quantity that depends on a random event, such as the number of tails, the sum of the values of the coins, or even the color of the coins if they are colored.

<div style="text-align: center; margin: 20px 0;">
  <h2>🪙 Flip 3 Coins — Discrete Random Variable Tracker</h2>
  <button id="flip-button" style="padding: 10px 20px; margin: 5px;">Flip Coins</button>
  <button id="reset-button" style="padding: 10px 20px; margin: 5px; background-color: #dc3545; color: white;">Reset</button>

  <div id="result" style="font-size: 1.5em; margin-top: 15px;"></div>
  <div id="numeric" style="margin: 10px; font-family: monospace;"></div>

  <canvas id="pmfChart" width="500" height="300" style="margin-top: 20px;"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
(function () {
  const resultDiv = document.getElementById("result");
  const numericDiv = document.getElementById("numeric");
  const frequenciesDiv = document.getElementById("frequencies");
  const flipBtn = document.getElementById("flip-button");
  const resetBtn = document.getElementById("reset-button");

  // Auto Flip Button
  const autoBtn = document.createElement("button");
  autoBtn.textContent = "Auto Flip 100 Times";
  autoBtn.style.padding = "10px 20px";
  autoBtn.style.margin = "5px";
  autoBtn.style.backgroundColor = "#ffc107";
  autoBtn.style.border = "none";
  autoBtn.style.borderRadius = "5px";
  autoBtn.style.cursor = "pointer";
  flipBtn.insertAdjacentElement("afterend", autoBtn);

  const counts = [0, 0, 0, 0]; // index = number of heads
  let totalFlips = 0;

  const theoretical = [1/8, 3/8, 3/8, 1/8];

  const chart = new Chart(document.getElementById('pmfChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['0 Heads', '1 Head', '2 Heads', '3 Heads'],
      datasets: [
        {
          label: 'Observed Frequency',
          data: counts,
          backgroundColor: '#007bff'
        },
        {
          label: 'Theoretical Probability',
          data: theoretical,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          type: 'bar'
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 1
        }
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  });

  function flipCoin() {
    return Math.random() < 0.5 ? 'H' : 'T';
  }

  function runTrial() {
    const outcome = [flipCoin(), flipCoin(), flipCoin()].join('');
    const numHeads = outcome.split('').filter(c => c === 'H').length;

    counts[numHeads]++;
    totalFlips++;

    resultDiv.textContent = `Outcome: ${outcome}`;
    numericDiv.textContent = `Heads = ${numHeads}, Tails = ${3 - numHeads}, Total Trials = ${totalFlips}`;
  }

  function updateFrequencies() {
    let html = '';
    for (let i = 0; i < counts.length; i++) {
      const count = counts[i];
      const pct = totalFlips > 0 ? (count / totalFlips * 100).toFixed(1) : "0.0";
      html += `${i} Head${i !== 1 ? 's' : ''}: ${count} (${pct}%)<br>`;
    }
    frequenciesDiv.innerHTML = html;
  }

  function updateChart() {
    if (totalFlips === 0) {
      chart.data.datasets[0].data = [0, 0, 0, 0];
    } else {
      chart.data.datasets[0].data = counts.map(c => c / totalFlips);
    }
    chart.update();
    updateFrequencies();
  }

  flipBtn.addEventListener("click", () => {
    runTrial();
    updateChart();
  });

  resetBtn.addEventListener("click", () => {
    // Reset raw data
    for (let i = 0; i < counts.length; i++) counts[i] = 0;
    totalFlips = 0;

    // Clear text
    resultDiv.textContent = '';
    numericDiv.textContent = '';
    frequenciesDiv.innerHTML = '';

    // 🚨 Break the reference: overwrite with a fresh array copy
    chart.data.datasets[0].data = [0, 0, 0, 0].slice(); 
    chart.update();
  });

  autoBtn.addEventListener("click", () => {
    for (let i = 0; i < 100; i++) {
      runTrial();
    }
    updateChart();
  });
})();
</script>

Let's get back to our initial example. Let's first list the possible outcomes of flipping three fair coins:

| Outcome | Number of Heads (X) |
|---------|---------------------|
| HHH     | 3                   |
| HHT     | 2                   |
| HTH     | 2                   |
| THH     | 2                   |
| HTT     | 1                   |
| THT     | 1                   |
| TTH     | 1                   |
| TTT     | 0                   |

Now let's also add a column for the probability of each outcome. Since the coins are fair, each outcome has an equal probability of occurring. There are 2<sup>3</sup> = 8 possible outcomes, so the probability of each outcome is 1/8.

| Outcome | Number of Heads (X) | Probability |
|---------|---------------------|-------------|
| HHH     | 3                   | 1/8         |
| HHT     | 2                   | 1/8         |
| HTH     | 2                   | 1/8         |
| THH     | 2                   | 1/8         |
| HTT     | 1                   | 1/8         |
| THT     | 1                   | 1/8         |
| TTH     | 1                   | 1/8         |
| TTT     | 0                   | 1/8         |

But remember that we are interested in the random variable X, which represents the number of heads, not the outcomes themselves. So let's summarize the probabilities of each value of X:

| Number of Heads (X) | Outcomes | Probability |
|---------------------|----------|-------------|
| 0                   | TTT      | 1/8         |
| 1                   | HTT, THT, TTH | 3/8         |
| 2                   | HHT, HTH, THH | 3/8         |
| 3                   | HHH      | 1/8         |

If we ask "what is the probability of getting exactly 2 heads when flipping three fair coins?", we can see that there are 3 outcomes that result in 2 heads, and the total number of outcomes is 8. Therefore, the probability of getting exactly 2 heads is:

$$P(X = 2) = \frac{3}{8}$$

We all remember that a probability of a random event is the number of occurences of that event divided by the total number of possible outcomes. Thus, if we add up the probabilities of all possible values of X, we should get 1:

$$P(X = 0) + P(X = 1) + P(X = 2) + P(X = 3) = 1$$

Or more generally:

$$\sum_{x \in X} P(X = x) = 1$$

where X is the set of all possible values of the random variable X.

In probability, we define a **probability distribution** as a function that assigns a probability to each possible value of a random variable. In our case, we can define the probability distribution of the random variable X as:

$$P(X = x) = \begin{cases}
\frac{1}{8} & \text{if } x = 0 \\
\frac{3}{8} & \text{if } x = 1 \\
\frac{3}{8} & \text{if } x = 2 \\
\frac{1}{8} & \text{if } x = 3 \\
0 & \text{otherwise}
\end{cases}$$

In plain English, this means that the probability of getting 0 heads is 1/8, the probability of getting 1 head is 3/8, the probability of getting 2 heads is 3/8, and the probability of getting 3 heads is 1/8. The probability of getting any other value is 0.

There is one more function that we often use, which is the **cumulative distribution function (CDF)**. The CDF of a random variable X is a function that gives the probability that X is less than or equal to a certain value x:

$$F_X(x) = P(X \leq x) = \sum_{k \leq x} P(X = k)$$

In plain English, this means that the CDF gives us the probability that the random variable X is less than or equal to x. For example, if we want to know the probability of getting at most 2 heads when flipping three fair coins, we can use the CDF:

$$F_X(2) = P(X \leq 2) = P(X = 0) + P(X = 1) + P(X = 2) = \frac{1}{8} + \frac{3}{8} + \frac{3}{8} = \frac{7}{8}$$

#### Discrete Random Variables

The examples above are for discrete random variables, which take on a finite or countably infinite set of values. In this case, we define the probability mass function (PMF) as the function that gives the probability of each value of the random variable. The PMF is defined as:

$$p(a) = P(X = a)$$

For every value a in the range of the random variable X, PMF is non-negative, but if the given value is not in the range of the random variable, then PMF is 0:

$$p(a) = \begin{cases}
p_x & \text{if } a \in X \\
0 & \text{otherwise}
\end{cases}$$

And since the sum of all probabilities must equal 1, we can write:

$$\sum_{a \in X} p(a) = 1$$

#### Expected Value

The term expected value is actually self explanatory. For example, what is the expected value of the random variable X if we flip three fair coins? In real life, everyone would give different answers, or refuse to answer because you can't expect the future. However, the term expectation means, what value is most likely to be the safest bet. For example, if we flip three fair coins, which random variable X has the highest probability of occurring? We can see that the most likely value is 1 or 2 heads, as they have the highest probabilities of 3/8. So we can say that maybe the expected value of X is around one or two heads. But how do we compute the expected value mathematically?

We can think of this as a weighted average of all possible values of the random variable, where the weights are the probabilities of each value. By weighing each value by its probability, the final result would tend to be closer to the values with higher probabilities. The expected value of a discrete random variable X is defined as:

$$\mathbb{E}[X] = \sum_{x \in X} x \cdot p(x)$$

Before we discuss further, let's see some characteristics about expected values:

$$\mathbb{E}[g(X)] = \sum_{x \in X} g(x) \cdot p(x)$$

where g(X) is a function of the random variable X. This means that we can compute the expected value of any function of the random variable by applying the function to each value of the random variable and multiplying it by the probability of that value.

$$\mathbb{E}[aX + c] = a\mathbb{E}[X] + c$$

#### Variance

A variance is a measure of how much the values of a random variable vary from the expected value. For example, say that there exist a society where the top 1% of the population has a net worth of $1 billion, while the rest of the population has a net worth of $10,000. The expected value of the net worth in this society would be heavily skewed towards the $1 billion value, even though most people have a net worth of $10,000. This means that the variance is very high, as the values are very spread out from the expected value. Without variance, people who don't know the distribution of the net worth in this society would think that the expected value is a good representation of the net worth of the average person, which is not true.

Now, how can we represent this gap between the expected value and the actual values of the random variable? Well, I think we've just defined it. What does the term "gap between the expected value and the actual values" mean? It sounds like a distance, right?

$$\text{Distance} = |X - \mathbb{E}[X]|$$

If there are n possible values of the random variable X, then we would have n distances. What would be a good way to summarize these distances? Let's say that we have squared distances, which would be:

$$\text{Squared Distance} = (X - \mathbb{E}[X])^2$$

The variance of a discrete random variable X is defined as the expected value of the squared distance from the expected value:

$$\text{Var}(X) = \mathbb{E}[(X - \mathbb{E}[X])^2] = \sum_{x \in X} (x - \mathbb{E}[X])^2 \cdot p(x)$$

This could be rephrased as:

$$\text{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$$

Humans are not very good at dealing with squared distances, so we often take the square root of the variance to get the standard deviation:

$$\text{Standard Deviation}(X) = \sqrt{\text{Var}(X)}$$

#### Continuous Random Variables

The fun of math is in generalization. We can generalize the concept of random variables to continuous random variables, which take on an uncountably infinite set of values.

It is easy understanding the discrete random variables because a lot of real-world phenomena can be modeled as discrete events, such as flipping coins, rolling dice, or counting the number of occurrences of an event. So people have hard time understanding continuous random variables, as they are not as intuitive. However, many real-world phenomena can be modeled as continuous events.

For example, let's say that we are measuring how good an archer is at hitting a target. The random event is where the arrow lands on the target. The random variable X is the distance from the center of the target to where the arrow lands. For the purpose of the explanation, let's say that the target is infinitely big. The possible values of X are all non-negative real numbers, as the distance can be any positive value. In this case, we can define a continuous random variable X that represents the distance from the center of the target to where the arrow lands. If an archer is very good, the probability of hitting the center of the target is very high, and the probability of hitting farther away from the center is very low.

Unlike our first example of discrete random variables, we cannot list all possible values of a continuous random variable, as there are infinitely many of them. How can we then tell a probability of a continuous random variable? For example, we can say that a good archer has a high chance of hitting the target within a distance of 1 cm from the center, but if the question is about a specific distance, such as 1.5 cm, we cannot say that the probability of hitting exactly 1.5 cm is high or low, as there are infinitely many possible distances that the arrow can land on. But one thing is certain, the probability of hitting the target itself is 1, as the archer will always hit the target, even if it is very far away from the center. This could be mathematically expressed as:

$$P(X \in U) = \int_{0}^{\infty} p(x) \, dx = 1$$

where U is our universe of discourse, the set of all possible distances from the center of the target, and p(x) is the probability density function (PDF) of the continuous random variable X.

We can also say that given a domain of integration [a, b], the probability of hitting the target within that distance is:

$$P(a \leq X \leq b) = \int_{a}^{b} p(x) \, dx$$

where p(x) is the probability density function (PDF) of the continuous random variable X. The PDF is a function that gives the probability density at each point in the range of the random variable. The PDF is non-negative and integrates to 1 over the entire range of the random variable.

Unlike discrete random variables, we cannot call p(x) a probability mass function (PMF), as it does not give the probability of each value of the random variable. Instead, we call it a probability density function (PDF), as it gives the probability density at each point in the range of the random variable:

$$p(x) = \begin{cases}
p_x & \text{if } x \in X \\
0 & \text{otherwise}
\end{cases}$$

Now let's define the probability of continuous random variables. If given a random variable X each is a real number, then the probability of X being in a set A is defined as:

$$P(X \in A) = \int_{A} p(x) \, dx$$

if there exists a probability density function p(x) such that:

$$\int_{\mathbb{R}} p(x) \, dx = 1$$

and is non-negative for all x in the range of the random variable X.

The cumulative distribution function (CDF) of a continuous random variable X is defined as:

$$F_X(x) = P(X \leq x) = \int_{-\infty}^{x} p(t) \, dt$$

This means that a PDF is the derivative of the CDF:

$$p(x) = \frac{d}{dx} F_X(x)$$

##### Expected Value of Continuous Random Variables

The definition of expected value for continuous random variables is no different from the definition for discrete random variables. We just can't sum over the values of the random variable, as there are infinitely many of them. Instead, we integrate over the range of the random variable:

$$E[X] = \int_{-\infty}^{\infty} x p(x) \, dx$$

The following are some properties of expected values of continuous random variables:

$$E[g(X)] = \int_{-\infty}^{\infty} g(x) p(x) \, dx$$

where g(X) is a function of the random variable X. This means that we can compute the expected value of any function of the random variable by applying the function to each value of the random variable and multiplying it by the probability density function.

$$E[Y] = \int_{0}^{\infty} P(Y > y) \, dy$$

where Y is a non-negative continuous random variable. This means that we can compute the expected value of a continuous random variable by integrating the probability that the random variable is greater than a certain value.

#### Uniform Random Variable

The easiest continuous random variable to understand is the uniform random variable. A uniform random variable is a random variable that has a constant probability density function over a certain range. For example, if we have a uniform random variable X in the interval (0, 1), then the PDF of X is:

$$p(x) = \begin{cases}
1 & \text{if } 0 < x < 1 \\
0 & \text{otherwise}
\end{cases}$$

Thus the probability of X being in the interval [a, b] is:

$$P(a \leq X \leq b) = \int_{a}^{b} p(x) \, dx = b - a$$

If we generalize this to a uniform random variable X in the interval (a, b), then the PDF of X is:

$$p(x) = \begin{cases}
\frac{1}{b - a} & \text{if } a < x < b \\
0 & \text{otherwise}
\end{cases}$$

![Uniform Random Variable](https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Uniform_Distribution_PDF_SVG.svg/1920px-Uniform_Distribution_PDF_SVG.svg.png)

By <a href="//commons.wikimedia.org/wiki/User:IkamusumeFan" title="User:IkamusumeFan">IkamusumeFan</a> - This <a href="https://en.wikipedia.org/wiki/drawing" class="extiw" title="w:drawing">drawing</a> was created with <a href="https://en.wikipedia.org/wiki/LibreOffice_Draw" class="extiw" title="w:LibreOffice Draw">LibreOffice Draw</a>., <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=27378699">Link</a>

And its cumulative distribution function (CDF) is:

$$F_X(x) = \begin{cases}
0 & \text{if } x \leq a \\
\frac{x - a}{b - a} & \text{if } a < x < b \\
1 & \text{if } x \geq b
\end{cases}$$

![Uniform Random Variable CDF](https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Uniform_cdf.svg/1920px-Uniform_cdf.svg.png)

By <a href="//commons.wikimedia.org/wiki/User:IkamusumeFan" title="User:IkamusumeFan">IkamusumeFan</a> - This <a href="https://en.wikipedia.org/wiki/drawing" class="extiw" title="w:drawing">drawing</a> was created with <a href="https://en.wikipedia.org/wiki/LibreOffice_Draw" class="extiw" title="w:LibreOffice Draw">LibreOffice Draw</a>., <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=27378784">Link</a>

### Monte Carlo Integration

Now that we have a good understanding of probabilities and random variables, we can finally discuss Monte Carlo integration.

Let's define a multidimensional random variable **X** &in; &Ropf;<sup>n</sup>, which is a vector of n random variables. We also call this a **random vector**. Given a random event &zeta;, the random vector **X** is defined as:

$$\mathbf{X} = (X_1(\zeta), X_2(\zeta), \ldots, X_n(\zeta))$$

where each component X<sub>i</sub> is a random variable. The CDF of the random vector **X** is defined as:

$$F_{\mathbf{X}}(\mathbf{x}) = P(\mathbf{X} \leq \mathbf{x}) = \int_{-\infty}^{x_1} \int_{-\infty}^{x_2} \ldots \int_{-\infty}^{x_n} p(\mathbf{t}) \, dt_1 \, dt_2 \ldots dt_n$$

where p(**t**) is the joint probability density function (PDF) of the random vector **X**.

Computing an expected value of a function f(**X**) of a random vector **X** is no different from computing the expected value of a single random variable. We just need to integrate over the joint PDF of the random vector **X**:

$$\mathbb{E}[f(\mathbf{X})] = \int_{\mathbb{R}^n} f(\mathbf{x}) p(\mathbf{x}) \, d\mathbf{x}$$

where p(**x**) is the joint probability density function (PDF) of the random vector **X**.

Numerically computing the expected value of a function f(**X**) of a random vector **X** is done by sampling the random vector **X** from its joint PDF p(**x**) and computing the average of the function values:

$$\mathbb{E}[f(\mathbf{X})] \approx \frac{1}{N} \sum_{i=1}^{N} f(\mathbf{x}_i)$$

where **x**<sub>i</sub> is a sample from the joint PDF p(**x**) and N is the number of samples.

This is our numerical computation of the expected value:

$$I_N(f) = \frac{1}{N} \sum_{i=1}^{N} f(\mathbf{x}_i)$$

Based on the strong law of large numbers, as N approaches infinity, the expected value of the function f(**X**) converges to the true expected value:

$$\lim_{N \to \infty} I_N(f) = \mathbb{E}[f(\mathbf{X})]$$

The first step to numerical compute the expected value of a function f(**X**) of a random vector **X** is to sample the random vector **X**. Usually this is produced by random number generators (RNGs) that generate pseudo-random numbers.

This would be the quadrature error:

$$E_N(f) = \mathbb{E}[f(\mathbf{X})] - I_N(f)$$

If we consider I<sub>N</sub>(f) as a function of N, we can compute the *variance* of the estimator I<sub>N</sub>(f):

$$\text{Var}(I_N(f)) = \mathbb{E}[I_N(f)^2] - \mathbb{E}[I_N(f)]^2$$

and its *standard deviation*:

$$\text{Standard Deviation}(I_N(f)) = \sqrt{\text{Var}(I_N(f))} = \sqrt{\mathbb{E}[I_N(f)^2] - \mathbb{E}[I_N(f)]^2}$$

By the characteristics of the expected value, we can compute the variance of the estimator I<sub>N</sub>(f) as:

$$
\begin{align*}
\text{Var}(I_N(f)) &= \mathbb{E}[I_N(f)^2] - \mathbb{E}[I_N(f)]^2 \\
&= \mathbb{E}\left[\left(I_N(f) - \mathbb{E}[I_N(f)]\right)^2\right] \\
&= \mathbb{E}\left[\left(\frac{1}{N} \sum_{i=1}^N f(\mathbf{x}_i) - \mathbb{E}[f(\mathbf{X})]\right)^2\right] \\
&= \frac{1}{N^2} \mathbb{E}\left[\left(\sum_{i=1}^N (f(\mathbf{x}_i) - \mathbb{E}[f(\mathbf{X})])\right)^2\right] \\
&= \frac{1}{N^2} \sum_{i=1}^N \mathbb{E}\left[(f(\mathbf{x}_i) - \mathbb{E}[f(\mathbf{X})])^2\right] + \frac{1}{N^2} \sum_{i \neq j} \mathbb{E}\left[(f(\mathbf{x}_i) - \mathbb{E}[f(\mathbf{X})])(f(\mathbf{x}_j) - \mathbb{E}[f(\mathbf{X})])\right] \\
&= \frac{1}{N^2} \cdot N \cdot \text{Var}(f(\mathbf{X})) + \frac{1}{N^2} \cdot N(N-1) \cdot 0 \\
&= \frac{1}{N} \text{Var}(f(\mathbf{X}))
\end{align*}
$$

Same goes to the standard deviation of the estimator I<sub>N</sub>(f):

$$
\text{Standard Deviation}(I_N(f)) = \sqrt{\text{Var}(I_N(f))} = \sqrt{\frac{1}{N} \text{Var}(f(\mathbf{X}))}
$$

We often note the standard deviation by the symbol &sigma;, so we can write:

$$\sigma(I_N(f)) = \frac{\sigma(f)}{\sqrt{N}}$$

Thus if N diverges to infinity, the standard deviation of the estimator I<sub>N</sub>(f) converges to 0:

$$\lim_{N \to \infty} \sigma(I_N(f)) = 0$$

The convergence rate does not depend on the dimension of approximation N, but rather on the *regularity* of the function f. This is the reason why Monte Carlo integration unlike quadrature methods does not yield better results for functions that are smooth or have low variation.

<div style="text-align:center; font-family:sans-serif; margin-top: 20px;">
  <h2>🎲 Monte Carlo Integration of a Random Function</h2>
  <button id="generate-button" style="padding: 10px 20px; margin: 10px;">Generate Random Function</button>
  <button id="add-sample-button" style="padding: 10px 20px; margin: 10px;">Add Sample</button>
  <button id="reset-button" style="padding: 10px 20px; margin: 10px;">Reset</button>
  <div id="function-display" style="font-size: 1.2em; margin-bottom: 10px;"></div>
  <canvas id="function-chart" width="600" height="300" style="border:1px solid #ccc;"></canvas>
  <p id="result" style="margin-top: 10px;"></p>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
(function() {
  const canvas = document.getElementById("function-chart");
  const ctx = canvas.getContext("2d");
  const resultP = document.getElementById("result");
  const functionDisplay = document.getElementById("function-display");
  const generateButton = document.getElementById("generate-button");
  const addSampleButton = document.getElementById("add-sample-button");
  const resetButton = document.getElementById("reset-button");

  const a = -1, b = 1;
  let selected = null;
  const samples = [];

  const functionPool = [
    {
      fn: x => Math.sin(x),
      str: "f(x) = sin(x)",
      integral: (a, b) => -Math.cos(b) + Math.cos(a)
    },
    {
      fn: x => x * x,
      str: "f(x) = x²",
      integral: (a, b) => (1 / 3) * (b ** 3 - a ** 3)
    },
    {
      fn: x => Math.exp(-x),
      str: "f(x) = e^{-x}",
      integral: (a, b) => -Math.exp(-b) + Math.exp(-a)
    },
    {
      fn: x => Math.abs(x),
      str: "f(x) = |x|",
      integral: (a, b) => {
        if (a >= 0) return 0.5 * (b ** 2 - a ** 2);
        if (b <= 0) return -0.5 * (b ** 2 - a ** 2);
        return 0.5 * (b ** 2 + a ** 2);
      }
    }
  ];

  function drawFunction(fn, a, b) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;
    const step = (b - a) / w;
    const values = [];
    for (let i = 0; i < w; i++) {
      const x = a + i * step;
      values.push({ x, y: fn(x) });
    }
    const yVals = values.map(p => p.y);
    const yMin = Math.min(...yVals);
    const yMax = Math.max(...yVals);

    // Draw true function curve
    ctx.beginPath();
    ctx.moveTo(0, h * (1 - (values[0].y - yMin) / (yMax - yMin)));
    for (let i = 1; i < values.length; i++) {
      const px = i;
      const py = h * (1 - (values[i].y - yMin) / (yMax - yMin));
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill exact integral area
    ctx.fillStyle = 'rgba(0, 123, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let i = 0; i < values.length; i++) {
      const px = i;
      const py = h * (1 - (values[i].y - yMin) / (yMax - yMin));
      ctx.lineTo(px, py);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Fill MC estimated area
    if (samples.length > 0) {
      const avg = samples.reduce((sum, s) => sum + s.y, 0) / samples.length;
      const avgY = h * (1 - (avg - yMin) / (yMax - yMin));
      ctx.fillStyle = 'rgba(40, 167, 69, 0.2)';
      ctx.fillRect(0, avgY, w, h - avgY);
    }

    // Draw samples with vertical line contribution
    for (const sample of samples) {
      const px = ((sample.x - a) / (b - a)) * w;
      const py = h * (1 - (sample.y - yMin) / (yMax - yMin));
      const baseY = h * (1 - (0 - yMin) / (yMax - yMin));

      // Draw vertical line for f(x) * p(x)
      ctx.beginPath();
      ctx.moveTo(px, baseY);
      ctx.lineTo(px, py);
      ctx.strokeStyle = 'rgba(255, 99, 132, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw point
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    }
  }

  function updateEstimate() {
    if (samples.length === 0 || !selected) return;
    const avg = samples.reduce((sum, s) => sum + s.y, 0) / samples.length;
    const approx = (b - a) * avg;
    const exact = selected.integral(a, b);
    resultP.innerHTML = `Samples: <b>${samples.length}</b><br>Approx: <b>${approx.toFixed(6)}</b>, Exact: <b>${exact.toFixed(6)}</b>, Error: <b>${(approx - exact).toFixed(6)}</b>`;
  }

  generateButton.addEventListener("click", () => {
    selected = functionPool[Math.floor(Math.random() * functionPool.length)];
    samples.length = 0;
    functionDisplay.textContent = selected.str;
    drawFunction(selected.fn, a, b);
    resultP.innerHTML = "Click 'Add Sample' to start approximating.";
  });

  addSampleButton.addEventListener("click", () => {
    if (!selected) return;
    const x = a + (b - a) * Math.random();
    const y = selected.fn(x);
    samples.push({ x, y });
    drawFunction(selected.fn, a, b);
    updateEstimate();
  });

  resetButton.addEventListener("click", () => {
    samples.length = 0;
    resultP.innerHTML = "Reset. Click 'Add Sample' to begin again.";
    if (selected) drawFunction(selected.fn, a, b);
  });
})();
</script>

Computer Graphics: Principles and Practice

1.  Probability and Monte Carlo Integration
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

## How is it used?

<div class="footnote">
  <p id="footnote_1">1. <a href="https://en.wikipedia.org/wiki/Monte_Carlo_integration">Wikipedia</a></p>
  <p id="footnote_2">2. <a href="https://en.wikipedia.org/wiki/Function_space">Wikipedia</a></p>
  <p id="footnote_3">3. <a href="https://en.wikipedia.org/wiki/Triangle_inequality">Wikipedia</a></p>
  <p id="footnote_4">4. <a href="https://en.wikipedia.org/wiki/Lagrange_polynomial">Wikipedia</a></p>
  <p id="footnote_5">5. <a href="https://en.wikipedia.org/wiki/Random_variable">Wikipedia</a></p>
</div>
