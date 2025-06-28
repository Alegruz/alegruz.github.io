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

# What is it?

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

<div class="footnote">
  <p id="footnote1">1. <a href="https://en.wikipedia.org/wiki/Monte_Carlo_integration">Wikipedia</a></p>
</div>