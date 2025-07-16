---
layout: post
title:  Study Notes on Raytracing Implementations
date:   2025-07-13 17:01:00 +0900
categories: graphics
lang: "en"
---

Raytracing is basically computing intersections of parametric lines from the camera with the scene geometry, and then evaluating the lighting at those intersection points. This doesn't require any special hardware, just a lot of computation. However, the naive approach of checking every pixel against every triangle in the scene is too slow for real-time applications. There are several techniques to speed this up, such as bounding volume hierarchies (BVH), spatial partitioning, and acceleration structures. In this post, I will go through several ways to implement raytracing, focusing on the most common ones used in real-time graphics.

The following are the methods I will cover:

1. CPU implementation
2. GPU implementation
   1. Vulkan raytracing
   2. DirectX raytracing
   3. CUDA raytracing

This post is not about the theory of raytracing, but rather about practical implementations.

## Raytracing Basics and CPU Implementation

The basic idea of raytracing is to cast rays from the camera into the scene and check for intersections with the geometry. Thus, we meed to define a ray first:

```cpp
struct ParametricLine final
{
public:
  float3 Origin;  // The starting point of the ray
  float3 Direction; // The direction of the ray, should be normalized

public:
  ParametricLine() = delete;
  inline constexpr ParametricLine(const float3& origin, const float3& direction) noexcept : Origin(origin), Direction(direction.normalize()) {}
  inline constexpr ParametricLine(const ParametricLine& other) noexcept : Origin(other.Origin), Direction(other.Direction) {}
  inline constexpr ParametricLine(ParametricLine&& other) noexcept : Origin(std::move(other.Origin)), Direction(std::move(other.Direction)) {}
  inline constexpr ~ParametricLine() noexcept = default;
  inline constexpr ParametricLine& operator=(const ParametricLine& other) noexcept { if (this != &other) { Origin = other.Origin; Direction = other.Direction; } return *this; }
  inline constexpr ParametricLine& operator=(ParametricLine&& other) noexcept { if (this != &other) { Origin = std::move(other.Origin); Direction = std::move(other.Direction); } return *this; }
};

using Ray = ParametricLine;
```

Refer to the appendix for the implementations of helper classes/structs/functions that are not shown above(such as `float3`).

Now we have to define a triangle mesh:

```cpp
struct Triangle final
{
public:
  static constexpr uint32_t VERTICES_COUNT = 3;

public:
  float3 Vertices[VERTICES_COUNT];

public:
  Triangle() = delete;
  inline constexpr Triangle(const float3& vertex0, const float3& vertex1, const float3& vertex2) noexcept: Vertices{vertex0, vertex1, vertex2} {}
  inline constexpr Triangle(const Triangle& other) noexcept = default;
  inline constexpr Triangle(Triangle&& other) noexcept = default;
  inline constexpr ~Triangle() noexcept = default;
  inline constexpr Triangle& operator=(const Triangle& other) noexcept = default;
  inline constexpr Triangle& operator=(Triangle&& other) noexcept = default;
};
```

Now that we have our basic two ingredients, we need to implement an intersection test function. Usually, the Möller–Trumbore algorithm is used for this purpose, which is efficient and straightforward for triangle-ray intersection tests. Here's a simple implementation:

```cpp
constexpr std::optional<float3> IntersectionChecker::MoellerTrumbore(const ParametricLine& ray, const Triangle& triangle, float& intersectionDistance)
{
  const float3 edge0 = triangle.Vertices[1] - triangle.Vertices[0];
  const float3 edge1 = triangle.Vertices[2] - triangle.Vertices[0];
  const float3 rayCrossEdge1 = cross(ray.Direction, edge1);
  const float determinant0 = dot(edge0, rayCrossEdge1);
  if(determinant0 > -std::numeric_limits<float>::epsilon() && determinant0 < std::numeric_limits<float>::epsilon())
  {
    return std::nullopt; // Placeholder for the actual implementation
  }

  const float inverseDeterminant0 = 1.0f / determinant0;
  const float3 s = ray.Origin - triangle.Vertices[0];
  const float u = dot(s, rayCrossEdge1) * inverseDeterminant0;
  if((u < 0.0f && std::abs(u) > std::numeric_limits<float>::epsilon()) || (u > 1.0f && std::abs(u - 1.0f) > std::numeric_limits<float>::epsilon()))
  {
    return std::nullopt;
  }

  const float3 rayCrossEdge0 = cross(ray.Direction, edge0);
  const float v = dot(ray.Direction, rayCrossEdge0) * inverseDeterminant0;
  if((v < 0.0f && std::abs(v) > std::numeric_limits<float>::epsilon()) || (u + v > 1.0f && std::abs(u + v - 1.0f) > std::numeric_limits<float>::epsilon()))
  {
    return std::nullopt;
  }

  intersectionDistance = dot(edge1, rayCrossEdge0) * inverseDeterminant0;
  if(intersectionDistance > std::numeric_limits<float>::epsilon())
  {
    return ray.Origin + ray.Direction * intersectionDistance;
  }

  return std::nullopt; // No intersection found
}
```

<div id="raytracing-cpu-demo-only-intersection" style="text-align: center; margin: 20px 0;">
  <canvas id="wasm-canvas-only-intersection" width="720" height="720" style="border:1px solid #aaa;"></canvas>
  <p>Raytracing CPU Demo - Only Intersection</p>
</div>
<script src="{{ '/assets/codes/raytracing/main.js' | relative_url }}"></script>
<script>
createRaytracerModule({
  locateFile: (p) => p.endsWith('.wasm')
    ? '{{ "/assets/codes/raytracing/main.wasm" | relative_url }}'
    : p
}).then(Module => {
  const container = document.getElementById("raytracing-cpu-demo-only-intersection");
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const width = 720, height = 720, channels = 4;
  const imageData = ctx.createImageData(width, height);
  const label = container.querySelector("p");

  const info = document.createElement("p");
  info.style.fontSize = "0.9em";
  info.style.color = "#666";
  info.style.margin = "4px 0 0 0";
  label.insertAdjacentElement("afterend", info);

  Module._initialize(width, height);
  const bufPtr = Module._get_display_buffer();
  const render = Module.cwrap("render_frame", null, ["number", "number"]);

  if (!bufPtr || !Module.HEAPU8) {
    console.error("WASM buffer not allocated.");
    return;
  }

  const bufferView = new Uint8Array(Module.HEAPU8.buffer, bufPtr, width * height * channels);
  let frame = 0;
  let visible = false;
  let running = false;

  async function renderLoop() {
    if (!visible) {
      running = false;
      return;
    }

    const t0 = performance.now();

    await new Promise(r => setTimeout(r, 0)); // yield before heavy work

    render(frame++, 0);
    imageData.data.set(bufferView);
    ctx.putImageData(imageData, 0, 0);

    const t1 = performance.now();
    info.textContent = `Frame ${frame} rendered in ${(t1 - t0).toFixed(2)} ms`;

    // Schedule next frame without blocking UI
    setTimeout(renderLoop, 0);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        renderLoop();
      }
    }
  }, {
    root: null,
    threshold: 0.1
  });

  observer.observe(container);
}).catch(err => {
  console.error("Failed to initialize WebAssembly module", err);
});
</script>

I think the scene is a bit dull. This is because the ray is tracing through the center of the pixel everytime. Pixels are in fact rectangles that cover the screen, which means that the ray that goes through the pixel doesn't intersect with everything that the pixel covers. In other words, we need to approximate the pixel area by sampling a random point inside the pixel rectangle. This is usually done by generating a random number in the range [0, 1) and multiplying it by the pixel width and height to get a random offset within the pixel rectangle. Here's how we can modify our raytracing function to include this:


<div id="raytracing-cpu-demo-only-intersection-with-jitter" style="text-align: center; margin: 20px 0;">
  <canvas id="wasm-canvas-only-intersection-with-jitter" width="720" height="720" style="border:1px solid #aaa;"></canvas>
  <p>Raytracing CPU Demo - Only Intersection with Jitter</p>
</div>
<script src="{{ '/assets/codes/raytracing/main.js' | relative_url }}"></script>
<script>
createRaytracerModule({
  locateFile: (p) => p.endsWith('.wasm')
    ? '{{ "/assets/codes/raytracing/main.wasm" | relative_url }}'
    : p
}).then(Module => {
  const container = document.getElementById("raytracing-cpu-demo-only-intersection-with-jitter");
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const width = 720, height = 720, channels = 4;
  const imageData = ctx.createImageData(width, height);
  const label = container.querySelector("p");

  const info = document.createElement("p");
  info.style.fontSize = "0.9em";
  info.style.color = "#666";
  info.style.margin = "4px 0 0 0";
  label.insertAdjacentElement("afterend", info);

  Module._initialize(width, height);
  const bufPtr = Module._get_display_buffer();
  const render = Module.cwrap("render_frame", null, ["number", "number"]);

  if (!bufPtr || !Module.HEAPU8) {
    console.error("WASM buffer not allocated.");
    return;
  }

  const bufferView = new Uint8Array(Module.HEAPU8.buffer, bufPtr, width * height * channels);
  let frame = 0;
  let visible = false;
  let running = false;

  async function renderLoop() {
    if (!visible) {
      running = false;
      return;
    }

    const t0 = performance.now();

    await new Promise(r => setTimeout(r, 0)); // yield before heavy work

    render(frame++, 1);
    imageData.data.set(bufferView);
    ctx.putImageData(imageData, 0, 0);

    const t1 = performance.now();
    info.textContent = `Frame ${frame} rendered in ${(t1 - t0).toFixed(2)} ms`;

    // Schedule next frame without blocking UI
    setTimeout(renderLoop, 0);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        renderLoop();
      }
    }
  }, {
    root: null,
    threshold: 0.1
  });

  observer.observe(container);
}).catch(err => {
  console.error("Failed to initialize WebAssembly module", err);
});
</script>

The next step is to evaluate the lighting at the intersection point. The Cornell box has a rectangular area light source on the ceiling. What we can do is to cast another ray from the intersection point towards the light source and check if it intersects with any geometry in the scene. If it does, we can assume that the intersection point is in shadow and thus doesn't receive any light from the light source. We will simply return a black color in this case.

<div id="raytracing-cpu-demo-only-intersection-with-jitter-with-shadow-ray" style="text-align: center; margin: 20px 0;">
  <canvas id="wasm-canvas-only-intersection-with-jitter-with-shadow-ray" width="720" height="720" style="border:1px solid #aaa;"></canvas>
  <p>Raytracing CPU Demo - Shadow Ray</p>
</div>
<script src="{{ '/assets/codes/raytracing/main.js' | relative_url }}"></script>
<script>
createRaytracerModule({
  locateFile: (p) => p.endsWith('.wasm')
    ? '{{ "/assets/codes/raytracing/main.wasm" | relative_url }}'
    : p
}).then(Module => {
  const container = document.getElementById("raytracing-cpu-demo-only-intersection-with-jitter-with-shadow-ray");
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const width = 720, height = 720, channels = 4;
  const imageData = ctx.createImageData(width, height);
  const label = container.querySelector("p");

  const info = document.createElement("p");
  info.style.fontSize = "0.9em";
  info.style.color = "#666";
  info.style.margin = "4px 0 0 0";
  label.insertAdjacentElement("afterend", info);

  Module._initialize(width, height);
  const bufPtr = Module._get_display_buffer();
  const render = Module.cwrap("render_frame", null, ["number", "number"]);

  if (!bufPtr || !Module.HEAPU8) {
    console.error("WASM buffer not allocated.");
    return;
  }

  const bufferView = new Uint8Array(Module.HEAPU8.buffer, bufPtr, width * height * channels);
  let frame = 0;
  let visible = false;
  let running = false;

  async function renderLoop() {
    if (!visible) {
      running = false;
      return;
    }

    const t0 = performance.now();

    await new Promise(r => setTimeout(r, 0)); // yield before heavy work

    render(frame++, 3);
    imageData.data.set(bufferView);
    ctx.putImageData(imageData, 0, 0);

    const t1 = performance.now();
    info.textContent = `Frame ${frame} rendered in ${(t1 - t0).toFixed(2)} ms`;

    // Schedule next frame without blocking UI
    setTimeout(renderLoop, 0);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        renderLoop();
      }
    }
  }, {
    root: null,
    threshold: 0.1
  });

  observer.observe(container);
}).catch(err => {
  console.error("Failed to initialize WebAssembly module", err);
});
</script>

Now, let's add the lighting evaluation. We will only evaluate direct illumination from the light source, and we will assume that the materials are perfectly diffuse (Lambertian reflectance). This means that the light intensity is proportional to the cosine of the angle between the surface normal and the light direction. We will also assume that the light source is a white light with a constant intensity.

<div id="raytracing-cpu-demo-direct-diffuse" style="text-align: center; margin: 20px 0;">
  <canvas id="wasm-canvas-direct-diffuse" width="720" height="720" style="border:1px solid #aaa;"></canvas>
  <p>Raytracing CPU Demo - Direct Diffuse Lighting</p>
</div>
<script src="{{ '/assets/codes/raytracing/main.js' | relative_url }}"></script>
<script>
createRaytracerModule({
  locateFile: (p) => p.endsWith('.wasm')
    ? '{{ "/assets/codes/raytracing/main.wasm" | relative_url }}'
    : p
}).then(Module => {
  const container = document.getElementById("raytracing-cpu-demo-direct-diffuse");
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const width = 720, height = 720, channels = 4;
  const imageData = ctx.createImageData(width, height);
  const label = container.querySelector("p");

  const info = document.createElement("p");
  info.style.fontSize = "0.9em";
  info.style.color = "#666";
  info.style.margin = "4px 0 0 0";
  label.insertAdjacentElement("afterend", info);

  Module._initialize(width, height);
  const bufPtr = Module._get_display_buffer();
  const render = Module.cwrap("render_frame", null, ["number", "number"]);

  if (!bufPtr || !Module.HEAPU8) {
    console.error("WASM buffer not allocated.");
    return;
  }

  const bufferView = new Uint8Array(Module.HEAPU8.buffer, bufPtr, width * height * channels);
  let frame = 0;
  let visible = false;
  let running = false;

  async function renderLoop() {
    if (!visible) {
      running = false;
      return;
    }

    const t0 = performance.now();

    await new Promise(r => setTimeout(r, 0)); // yield before heavy work

    render(frame++, 1+2+4); // 1 for jitter, 2 for shadow ray, 4 for diffuse
    imageData.data.set(bufferView);
    ctx.putImageData(imageData, 0, 0);

    const t1 = performance.now();
    info.textContent = `Frame ${frame} rendered in ${(t1 - t0).toFixed(2)} ms`;

    // Schedule next frame without blocking UI
    setTimeout(renderLoop, 0);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        renderLoop();
      }
    }
  }, {
    root: null,
    threshold: 0.1
  });

  observer.observe(container);
}).catch(err => {
  console.error("Failed to initialize WebAssembly module", err);
});
</script>

Now, let's improve the scene by considering the indirect illumination. This means that we will also consider the light that is reflected from the walls and the floor. We can do this by casting additional rays from the intersection point towards the walls and the floor, and checking if they intersect with any geometry in the scene. If they do, we can assume that the intersection point receives some indirect light from those surfaces.


<div id="raytracing-cpu-demo-indirect-diffuse" style="text-align: center; margin: 20px 0;">
  <canvas id="wasm-canvas-indirect-diffuse" width="720" height="720" style="border:1px solid #aaa;"></canvas>
  <p>Raytracing CPU Demo - Indirect Diffuse Lighting (1 bounce)</p>
</div>
<script src="{{ '/assets/codes/raytracing/main.js' | relative_url }}"></script>
<script>
createRaytracerModule({
  locateFile: (p) => p.endsWith('.wasm')
    ? '{{ "/assets/codes/raytracing/main.wasm" | relative_url }}'
    : p
}).then(Module => {
  const container = document.getElementById("raytracing-cpu-demo-indirect-diffuse");
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const width = 720, height = 720, channels = 4;
  const imageData = ctx.createImageData(width, height);
  const label = container.querySelector("p");

  const info = document.createElement("p");
  info.style.fontSize = "0.9em";
  info.style.color = "#666";
  info.style.margin = "4px 0 0 0";
  label.insertAdjacentElement("afterend", info);

  Module._initialize(width, height);
  const bufPtr = Module._get_display_buffer();
  const render = Module.cwrap("render_frame", null, ["number", "number"]);

  if (!bufPtr || !Module.HEAPU8) {
    console.error("WASM buffer not allocated.");
    return;
  }

  const bufferView = new Uint8Array(Module.HEAPU8.buffer, bufPtr, width * height * channels);
  let frame = 0;
  let visible = false;
  let running = false;

  async function renderLoop() {
    if (!visible) {
      running = false;
      return;
    }

    const t0 = performance.now();

    await new Promise(r => setTimeout(r, 0)); // yield before heavy work

    render(frame++, 1+2+4+8); // 1 for jitter, 2 for shadow ray, 4 for diffuse, 8 for indirect
    imageData.data.set(bufferView);
    ctx.putImageData(imageData, 0, 0);

    const t1 = performance.now();
    info.textContent = `Frame ${frame} rendered in ${(t1 - t0).toFixed(2)} ms`;

    // Schedule next frame without blocking UI
    setTimeout(renderLoop, 0);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        renderLoop();
      }
    }
  }, {
    root: null,
    threshold: 0.1
  });

  observer.observe(container);
}).catch(err => {
  console.error("Failed to initialize WebAssembly module", err);
});
</script>

The image is very noisy. Let's try to denoise the image by using a simple cross bilateral filter. This filter will smooth the image while preserving the edges. The idea is to average the colors of the pixels in a neighborhood around each pixel, weighted by both spatial distance and color similarity. Here's how we can implement this:

<div id="raytracing-cpu-demo-indirect-diffuse-denoised" style="text-align: center; margin: 20px 0;">
  <canvas id="wasm-canvas-indirect-diffuse-denoised" width="720" height="720" style="border:1px solid #aaa;"></canvas>
  <p>Raytracing CPU Demo - Indirect Diffuse Lighting (1 bounce)</p>
</div>
<script src="{{ '/assets/codes/raytracing/main.js' | relative_url }}"></script>
<script>
createRaytracerModule({
  locateFile: (p) => p.endsWith('.wasm')
    ? '{{ "/assets/codes/raytracing/main.wasm" | relative_url }}'
    : p
}).then(Module => {
  const container = document.getElementById("raytracing-cpu-demo-indirect-diffuse-denoised");
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const width = 720, height = 720, channels = 4;
  const imageData = ctx.createImageData(width, height);
  const label = container.querySelector("p");

  const info = document.createElement("p");
  info.style.fontSize = "0.9em";
  info.style.color = "#666";
  info.style.margin = "4px 0 0 0";
  label.insertAdjacentElement("afterend", info);

  Module._initialize(width, height);
  const bufPtr = Module._get_display_buffer();
  const render = Module.cwrap("render_frame", null, ["number", "number"]);

  if (!bufPtr || !Module.HEAPU8) {
    console.error("WASM buffer not allocated.");
    return;
  }

  const bufferView = new Uint8Array(Module.HEAPU8.buffer, bufPtr, width * height * channels);
  let frame = 0;
  let visible = false;
  let running = false;

  async function renderLoop() {
    if (!visible) {
      running = false;
      return;
    }

    const t0 = performance.now();

    await new Promise(r => setTimeout(r, 0)); // yield before heavy work

    render(frame++, 1+2+4+8+16); // 1 for jitter, 2 for shadow ray, 4 for diffuse, 8 for indirect, 16 for denoising
    imageData.data.set(bufferView);
    ctx.putImageData(imageData, 0, 0);

    const t1 = performance.now();
    info.textContent = `Frame ${frame} rendered in ${(t1 - t0).toFixed(2)} ms`;

    // Schedule next frame without blocking UI
    setTimeout(renderLoop, 0);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        renderLoop();
      }
    }
  }, {
    root: null,
    threshold: 0.1
  });

  observer.observe(container);
}).catch(err => {
  console.error("Failed to initialize WebAssembly module", err);
});
</script>

## Raytracing on GPU

By now, it is clear that raytracing is a very computationally intensive task, especially when we want to achieve high quality images with multiple bounces and denoising. This is where the GPU comes in handy. GPUs are designed to handle parallel computations, which makes them ideal for raytracing.

<div id="raytracing-gpu-demo-simple" style="text-align: center; margin: 20px 0;">
  <canvas id="wasm-canvas-gpu-demo-simple" width="720" height="720" style="border:1px solid #aaa;"></canvas>
  <p>Raytracing GPU Demo - Simple Intersection</p>
</div>
<script>
(async () => {
  const container = document.getElementById("raytracing-gpu-demo-simple");
  const canvas = container.querySelector("canvas");
  const label = container.querySelector("p");

  // WebGPU setup
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device: device,
    format: format,
    alphaMode: "opaque"
  });

  // Camera buffer
  const cameraData = new Float32Array([
    278.0, 273.0, -800.0, // Camera position
    0.0, 0.0, 1.0,       // Camera forward + padding
    -1.0, 0.0, 0.0,       // Camera right + padding
    0.0, 1.0, 0.0,        // Camera up + padding
    0.035,                // Focal length
    0.025,                // Width
    0.025,                // Height
    0.0,                   // Padding
    0.0, 0.0, 0.0, 1.0    // Padding
  ]);
  const cameraBuffer = device.createBuffer({
    size: cameraData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  });
  device.queue.writeBuffer(cameraBuffer, 0, cameraData);

  // Scene buffer
  const triangleData = new Float32Array([

    // Floor
      // triangle vertices
      0.0, 0.0, 0.0,
      559.2, 0.0, 552.8,
      559.2, 0.0, 0.0,
      // Triangle normal and emissive factor
      0.0, 1.0, 0.0, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      0.0, 0.0, 0.0,
      0.0, 0.0, 552.8,
      559.2, 0.0, 552.8,
      // Triangle normal and emissive factor
      0.0, 1.0, 0.0, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
    // Light source
      // Triangle vertices
      343.0, 548.8 - Number.EPSILON - Number.EPSILON, 227.0,
      343.0, 548.8 - Number.EPSILON - Number.EPSILON, 332.0,
      213.0, 548.8 - Number.EPSILON - Number.EPSILON, 332.0,
      // Triangle normal and emissive factor
      0.0, -1.0, 0.0, 1.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      213.0, 548.8 - Number.EPSILON - Number.EPSILON, 227.0,
      343.0, 548.8 - Number.EPSILON - Number.EPSILON, 227.0,
      213.0, 548.8 - Number.EPSILON - Number.EPSILON, 332.0,
      // Triangle normal and emissive factor
      0.0, -1.0, 0.0, 1.0,
      // Triangle color
      1.0, 1.0, 1.0,
    // Ceiling
      // Triangle vertices
      556.0, 548.8, 0.0,
      556.0, 548.8, 559.2,
      0.0, 548.8, 559.2,
      // Triangle normal and emissive factor
      0.0, -1.0, 0.0, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      0.0, 548.8, 0.0,
      556.0, 548.8, 0.0,
      0.0, 548.8, 559.2,
      // Triangle normal and emissive factor
      0.0, -1.0, 0.0, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
    // Back wall
      // Triangle vertices
      549.6, 0.0, 559.2,
      549.6, 548.8, 559.2,
      0.0, 548.8, 559.2,
      // Triangle normal and emissive factor
      0.0, 0.0, -1.0, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      0.0, 0.0, 559.2,
      549.6, 0.0, 559.2,
      0.0, 548.8, 559.2,
      // Triangle normal and emissive factor
      0.0, 0.0, -1.0, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
    // Right wall
      // Triangle vertices
      0.0, 0.0, 559.2,
      0.0, 0.0, 0.0,
      0.0, 548.8, 0.0,
      // Triangle normal and emissive factor
      1.0, 0.0, 0.0, 0.0,
      // Triangle color
      0.0, 1.0, 0.0,
      // Triangle vertices
      0.0, 0.0, 559.2,
      0.0, 548.8, 0.0,
      0.0, 548.8, 559.2,
      // Triangle normal and emissive factor
      1.0, 0.0, 0.0, 0.0,
      // Triangle color
      0.0, 1.0, 0.0,
    // Left wall
      // Triangle vertices
      552.8, 0.0, 0.0,
      549.6, 0.0, 559.2,
      556.0, 548.8, 559.2,
      // Triangle normal and emissive factor
      -0.999915719, 0.0116608692, -0.00572199980, 0.0,
      // Triangle color
      1.0, 0.0, 0.0,
      // Triangle vertices
      556.0, 548.8, 0.0,
      552.8, 0.0, 0.0,
      556.0, 548.8, 559.2,
      // Triangle normal and emissive factor
      -0.999983013, 0.00583082717, 0.00000000, 0.0,
      // Triangle color
      1.0, 0.0, 0.0,
    // Short Block
      // Triangle vertices
      130.0, 165.0, 65.0,
      82.0, 165.0, 225.0,
      240.0, 165.0, 272.0,
      // Triangle normal and emissive factor
      0.0, 1.0, 0.0, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      290.0, 165.0, 114.0,
      130.0, 165.0, 65.0,
      240.0, 165.0, 272.0,
      // Triangle normal and emissive factor
      0.0, 1.0, 0.0, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      290.0, 0.0, 114.0,
      290.0, 165.0, 114.0,
      240.0, 165.0, 272.0,
      // Triangle normal and emissive factor
      0.953400135, -0.00000000, 0.301708907, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      240.0, 0.0, 272.0,
      290.0, 0.0, 114.0,
      240.0, 165.0, 272.0,
      // Triangle normal and emissive factor
      0.953400135, -0.00000000, 0.301708907, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      130.0, 0.0, 65.0,
      130.0, 165.0, 65.0,
      290.0, 165.0, 114.0,
      // Triangle normal and emissive factor
      0.292825788, 0.00000000, -0.956165850, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      290.0, 0.0, 114.0,
      130.0, 0.0, 65.0,
      290.0, 165.0, 114.0,
      // Triangle normal and emissive factor
      0.292825788, 0.00000000, -0.956165850, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      82.0, 0.0, 225.0,
      82.0, 165.0, 225.0,
      130.0, 165.0, 65.0,
      // Triangle normal and emissive factor
      -0.957826257, 0.00000000, -0.287347883, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      130.0, 0.0, 65.0,
      82.0, 0.0, 225.0,
      130.0, 165.0, 65.0,
      // Triangle normal and emissive factor
      -0.957826257, 0.00000000, -0.287347883, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      240.0, 0.0, 272.0,
      240.0, 165.0, 272.0,
      82.0, 165.0, 225.0,
      // Triangle normal and emissive factor
      -0.285120904, 0.00000000, 0.958491504, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      82.0, 0.0, 225.0,
      240.0, 0.0, 272.0,
      82.0, 165.0, 225.0,
      // Triangle normal and emissive factor
      -0.285120904, 0.00000000, 0.958491504, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
    // Tall Block
      // Triangle vertices
      423.0, 330.0, 247.0,
      265.0, 330.0, 296.0,
      314.0, 330.0, 456.0,
      // Triangle normal and emissive factor
      0.0, 1.0, 0.0, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      472.0, 330.0, 406.0,
      423.0, 330.0, 247.0,
      314.0, 330.0, 456.0,
      // Triangle normal and emissive factor
      0.0, 1.0, 0.0, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      423.0, 0.0, 247.0,
      423.0, 330.0, 247.0,
      472.0, 330.0, 406.0,
      // Triangle normal and emissive factor
      0.955648959, 0.00000000, -0.294508159, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      472.0, 0.0, 406.0,
      423.0, 0.0, 247.0,
      472.0, 330.0, 406.0,
      // Triangle normal and emissive factor
      0.955648959, 0.00000000, -0.294508159, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      472.0, 0.0, 406.0,
      472.0, 330.0, 406.0,
      314.0, 330.0, 456.0,
      // Triangle normal and emissive factor
      0.301708907, -0.00000000, 0.953400135, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      314.0, 0.0, 456.0,
      472.0, 0.0, 406.0,
      314.0, 330.0, 456.0,
      // Triangle normal and emissive factor
      0.301708907, -0.00000000, 0.953400135, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      314.0, 0.0, 456.0,
      314.0, 330.0, 456.0,
      265.0, 330.0, 296.0,
      // Triangle normal and emissive factor
      -0.956165850, 0.00000000, 0.292825788, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      265.0, 0.0, 296.0,
      314.0, 0.0, 456.0,
      265.0, 330.0, 296.0,
      // Triangle normal and emissive factor
      -0.956165850, 0.00000000, 0.292825788, 0.0,
      // Triangle color 
      1.0, 1.0, 1.0,
      // Triangle vertices
      265.0, 0.0, 296.0,
      265.0, 330.0, 296.0,
      423.0, 330.0, 247.0,
      // Triangle normal and emissive factor
      -0.296209067, 0.00000000, -0.955123127, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
      // Triangle vertices
      423.0, 0.0, 247.0,
      265.0, 0.0, 296.0,
      423.0, 330.0, 247.0,
      // Triangle normal and emissive factor
      -0.296209067, 0.00000000, -0.955123127, 0.0,
      // Triangle color
      1.0, 1.0, 1.0,
  ]);
  const sceneBuffer = device.createBuffer({
    size: triangleData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  });
  device.queue.writeBuffer(sceneBuffer, 0, triangleData);

  // Output texture
  const rayOutput = device.createTexture({
    size: [canvas.width, canvas.height],
    format: "rgba8unorm",
    usage: GPUTextureUsage.RENDER_ATTACHMENT |
          GPUTextureUsage.STORAGE_BINDING |       // if used in compute write
          GPUTextureUsage.TEXTURE_BINDING |       // ✅ required for sampling
          GPUTextureUsage.COPY_SRC
  });

  // Compute shader
  const computeModule = device.createShaderModule({
    code: await fetch('{{ "/assets/codes/raytracing/raytracer.wgsl" | relative_url }}').then(res => res.text())
  });
  const computePipeline = device.createComputePipeline({
    layout: "auto",
    compute: {
      module: computeModule,
      entryPoint: "main"
    }
  });
  const computeBindGroup = device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: cameraBuffer } },
      { binding: 1, resource: { buffer: sceneBuffer } },
      { binding: 2, resource: rayOutput.createView() }
    ]
  });

  // Display pipeline
  const sampler = device.createSampler({
    magFilter: "linear",
    minFilter: "linear"
  });
  const displayModule = device.createShaderModule({
    code: await fetch('{{ "/assets/codes/raytracing/display.wgsl" | relative_url }}').then(res => res.text())
  });
  const renderPipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: displayModule,
      entryPoint: "vs_main"
    },
    fragment: {
      module: displayModule,
      entryPoint: "fs_main",
      targets: [{ format: format }]
    },
    primitive: { topology: "triangle-list" }
  });
  const renderBindGroup = device.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: sampler },
      { binding: 1, resource: rayOutput.createView() }
    ]
  });

  // Info label
  const info = document.createElement("p");
  info.style.fontSize = "0.9em";
  info.style.color = "#666";
  info.style.margin = "4px 0 0 0";
  label.insertAdjacentElement("afterend", info);

  let frameCount = 0;
  let visible = false;
  let running = false;

  function renderFrame() {
    const commandEncoder = device.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(computePipeline);
    computePass.setBindGroup(0, computeBindGroup);
    computePass.dispatchWorkgroups(
      Math.ceil(canvas.width / 8),
      Math.ceil(canvas.height / 8)
    );
    computePass.end();

    const textureView = context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: textureView,
        loadOp: "clear",
        storeOp: "store",
        clearValue: { r: 0, g: 0, b: 0, a: 1 }
      }]
    });
    renderPass.setPipeline(renderPipeline);
    renderPass.setBindGroup(0, renderBindGroup);
    renderPass.draw(6, 1, 0, 0);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
  }

  async function renderLoop() {
    if (!visible) {
      running = false;
      return;
    }
    const t0 = performance.now();
    await new Promise(r => setTimeout(r, 0));
    renderFrame();
    const t1 = performance.now();
    info.textContent = `Frame ${frameCount++} rendered in ${(t1 - t0).toFixed(2)} ms`;
    setTimeout(renderLoop, 0);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        renderLoop();
      }
    }
  }, {
    root: null,
    threshold: 0.1
  });
  observer.observe(container);
})();
</script>