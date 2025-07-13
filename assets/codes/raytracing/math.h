#pragma once

#include <cassert>
#include <cmath>
#include <cstdint>
#include <utility>

#include "common.h"

namespace raytracing
{
	struct float3 final
	{
	public:
		float X;
		float Y;
		float Z;

	public:
		RT_FORCE_INLINE constexpr float3() noexcept : float3(0.0f) {}
		RT_FORCE_INLINE constexpr float3(const float value) noexcept : float3(value, value, value) {}
		RT_FORCE_INLINE constexpr float3(const float x, const float y, const float z) noexcept : X(x), Y(y), Z(z) {}
		RT_FORCE_INLINE constexpr float3(const float3& other) noexcept = default;
		RT_FORCE_INLINE constexpr float3(float3&& other) noexcept = default;
		RT_FORCE_INLINE ~float3() noexcept = default;
		RT_FORCE_INLINE constexpr float3& operator=(const float3& other) noexcept = default;
		RT_FORCE_INLINE constexpr float3& operator=(float3&& other) noexcept = default;
		RT_FORCE_INLINE constexpr float3& operator=(const float value) noexcept { X = value; Y = value; Z = value; return *this; }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 operator+(const float3& other) const noexcept { return float3(X + other.X, Y + other.Y, Z + other.Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 operator-(const float3& other) const noexcept { return float3(X - other.X, Y - other.Y, Z - other.Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 operator*(const float scalar) const noexcept { return float3(X * scalar, Y * scalar, Z * scalar); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 operator/(const float scalar) const noexcept { assert(scalar != 0.0f); return float3(X / scalar, Y / scalar, Z / scalar); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 operator-() const noexcept { return float3(-X, -Y, -Z); }
		RT_FORCE_INLINE constexpr float3& operator+=(const float3& other) noexcept { X += other.X; Y += other.Y; Z += other.Z; return *this; }
		RT_FORCE_INLINE constexpr float3& operator-=(const float3& other) noexcept { X -= other.X; Y -= other.Y; Z -= other.Z; return *this; }
		RT_FORCE_INLINE constexpr float3& operator*=(const float scalar) noexcept { X *= scalar; Y *= scalar; Z *= scalar; return *this; }
		RT_FORCE_INLINE constexpr float3& operator/=(const float scalar) noexcept { X /= scalar; Y /= scalar; Z /= scalar; return *this; }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 operator*(const float3& other) const noexcept { return float3(X * other.X, Y * other.Y, Z * other.Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 operator/(const float3& other) const noexcept { return float3(X / other.X, Y / other.Y, Z / other.Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float dot(const float3& other) const noexcept { return X * other.X + Y * other.Y + Z * other.Z; }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 cross(const float3& other) const noexcept { return float3( Y * other.Z - Z * other.Y, Z * other.X - X * other.Z, X * other.Y - Y * other.X); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float length() const noexcept { return std::sqrt(X * X + Y * Y + Z * Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 normalize() const noexcept { const float len = length(); return float3(X / len, Y / len, Z / len); }
	};

	struct ParametricLine final
	{
	public:
		float3 Origin;	  // The starting point of the ray
		float3 Direction; // The direction of the ray, should be normalized

	public:
		ParametricLine() = delete;
		RT_FORCE_INLINE constexpr ParametricLine(const float3& origin, const float3& direction) noexcept : Origin(origin), Direction(direction.normalize()) {}
		RT_FORCE_INLINE constexpr ParametricLine(const ParametricLine& other) noexcept : Origin(other.Origin), Direction(other.Direction) {}
		RT_FORCE_INLINE constexpr ParametricLine(ParametricLine&& other) noexcept : Origin(std::move(other.Origin)), Direction(std::move(other.Direction)) {}
		RT_FORCE_INLINE ~ParametricLine() noexcept = default;
		RT_FORCE_INLINE constexpr ParametricLine& operator=(const ParametricLine& other) noexcept
		{
			if (this != &other)
			{
				Origin = other.Origin;
				Direction = other.Direction;
			}
			return *this;
		}
		RT_FORCE_INLINE constexpr ParametricLine& operator=(ParametricLine&& other) noexcept
		{
			if (this != &other)
			{
				Origin = std::move(other.Origin);
				Direction = std::move(other.Direction);
			}
			return *this;
		}
	};

	using Ray = ParametricLine;

	struct Triangle final
	{
	public:
		static constexpr uint32_t VERTICES_COUNT = 3;

	public:
		float3 Vertices[VERTICES_COUNT];

	public:
		Triangle() = delete;
		inline constexpr Triangle(const float3& vertex0, const float3& vertex1, const float3& vertex2) noexcept : Vertices{vertex0, vertex1, vertex2} {}
		inline constexpr Triangle(const Triangle& other) noexcept = default;
		inline constexpr Triangle(Triangle&& other) noexcept = default;
		inline ~Triangle() noexcept = default;
		inline constexpr Triangle& operator=(const Triangle& other) noexcept = default;
		inline constexpr Triangle& operator=(Triangle&& other) noexcept = default;
	};
}