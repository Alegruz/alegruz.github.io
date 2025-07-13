#pragma once

#include <cassert>
#include <climits>
#include <cmath>
#include <cstdint>
#include <optional>
#include <utility>

#include "common.h"

namespace raytracing
{
	struct float3;

	constexpr float dot(const float3& a, const float3& b) noexcept;
	constexpr float3 cross(const float3& a, const float3& b) noexcept;

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
		[[nodiscard]] RT_FORCE_INLINE constexpr float dot(const float3& other) const noexcept { return raytracing::dot(*this, other); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 cross(const float3& other) const noexcept { return raytracing::cross(*this, other); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float length() const noexcept { return std::sqrt(X * X + Y * Y + Z * Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float3 normalize() const noexcept { const float len = length(); return float3(X / len, Y / len, Z / len); }
	};

	RT_FORCE_INLINE constexpr float dot(const float3& a, const float3& b) noexcept
	{
		return a.X * b.X + a.Y * b.Y + a.Z * b.Z;
	}

	RT_FORCE_INLINE constexpr float3 cross(const float3& a, const float3& b) noexcept
	{
		return float3(a.Y * b.Z - a.Z * b.Y, a.Z * b.X - a.X * b.Z, a.X * b.Y - a.Y * b.X);
	}

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
		RT_FORCE_INLINE constexpr Triangle(const float3& vertex0, const float3& vertex1, const float3& vertex2) noexcept : Vertices{vertex0, vertex1, vertex2} {}
		RT_FORCE_INLINE constexpr Triangle(const Triangle& other) noexcept = default;
		RT_FORCE_INLINE constexpr Triangle(Triangle&& other) noexcept = default;
		RT_FORCE_INLINE ~Triangle() noexcept = default;
		RT_FORCE_INLINE constexpr Triangle& operator=(const Triangle& other) noexcept = default;
		RT_FORCE_INLINE constexpr Triangle& operator=(Triangle&& other) noexcept = default;
	};

	class IntersectionChecker final
	{
	public:
		// Function to check if a ray intersects with a triangle
		RT_FORCE_INLINE constexpr static std::optional<float3> Intersects(const ParametricLine& ray, const Triangle& triangle, float& intersectionDistance)
		{
			return Intersection<IntersectionAlgorithm::MoellerTrumbore>(ray, triangle, intersectionDistance);
		}
	
	private:
		enum class IntersectionAlgorithm
		{
			MoellerTrumbore,
			// Add other algorithms as needed
		};

		template<IntersectionAlgorithm Algorithm>
		RT_FORCE_INLINE constexpr static std::optional<float3> Intersection(const ParametricLine& ray, const Triangle& triangle, float& intersectionDistance)
		{
			if constexpr (Algorithm == IntersectionAlgorithm::MoellerTrumbore)
			{
				return MoellerTrumbore(ray, triangle, intersectionDistance);
			}
			else
			{
				static_assert(false, "Unknown intersection algorithm");
			}

			return std::nullopt; // Placeholder for the actual implementation
		}

		static constexpr std::optional<float3> MoellerTrumbore(const ParametricLine &ray, const Triangle &triangle, float &intersectionDistance);
	};

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
}