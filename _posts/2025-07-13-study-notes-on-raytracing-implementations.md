---
layout: post
title:  Study Notes on Raytracing Implementations
date:   2025-07-13 27:01:00 +0900
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

Now that we have our basic two ingredients, we need to implement an intersection test function:

```cpp
class IntersectionChecker final
{
public:
  static constexpr bool Check(const Ray& ray, const Triangle& triangle) noexcept;
};

constexpr bool IntersectionChecker::Check(const Ray& ray, const Triangle& triangle) noexcept
{
  
}
```

## Appendix

```cpp
struct float3 final
{
public:
  float X;
  float Y;
  float Z;

public:
  inline constexpr float3() noexcept : float3(0.0f) {}
  inline constexpr float3(const float value) noexcept : float3(value, value, value) {}
  inline constexpr float3(const float x, const float y, const float z) noexcept : X(x), Y(y), Z(z) {}
  inline constexpr float3(const float3& other) noexcept = default;
  inline constexpr float3(float3&& other) noexcept = default;
  inline constexpr ~float3() noexcept = default;
  inline constexpr float3& operator=(const float3& other) noexcept = default;
  inline constexpr float3& operator=(float3&& other) noexcept = default;
  inline constexpr float3& operator=(const float x, const float y, const float z) noexcept { X = x; Y = y; Z = z; return *this; }
  inline constexpr float3& operator=(const float value) noexcept { X = value; Y = value; Z = value; return *this; }
  inline constexpr float3 operator+(const float3& other) const noexcept { return float3(X + other.X, Y + other.Y, Z + other.Z); }
  inline constexpr float3 operator-(const float3& other) const noexcept { return float3(X - other.X, Y - other.Y, Z - other.Z); }
  inline constexpr float3 operator*(const float scalar) const noexcept { return float3(X * scalar, Y * scalar, Z * scalar); }
  inline constexpr float3 operator/(const float scalar) const noexcept { return float3(X / scalar, Y / scalar, Z / scalar); }
  inline constexpr float3 operator-() const noexcept { return float3(-X, -Y, -Z); }
  inline constexpr float3& operator+=(const float3& other) noexcept { X += other.X; Y += other.Y; Z += other.Z; return *this; }
  inline constexpr float3& operator-=(const float3& other) noexcept { X -= other.X; Y -= other.Y; Z -= other.Z; return *this; }
  inline constexpr float3& operator*=(const float scalar) noexcept { X *= scalar; Y *= scalar; Z *= scalar; return *this; }
  inline constexpr float3& operator/=(const float scalar) noexcept { X /= scalar; Y /= scalar; Z /= scalar; return *this; }
  inline constexpr float3 operator*(const float3& other) const noexcept { return float3(X * other.X, Y * other.Y, Z * other.Z); }
  inline constexpr float3 operator/(const float3& other) const noexcept { return float3(X / other.X, Y / other.Y, Z / other.Z); }
  inline constexpr float dot(const float3& other) const noexcept { return X * other.X + Y * other.Y + Z * other.Z; }
  inline constexpr float3 cross(const float3& other) const noexcept { return float3( Y * other.Z - Z * other.Y, Z * other.X - X * other.Z, X * other.Y - Y * other.X); }
  inline constexpr float length() const noexcept { return std::sqrt(X * X + Y * Y + Z * Z); }
  inline constexpr float3 normalize() const noexcept { const float len = length(); return float3(X / len, Y / len, Z / len); }
};
```