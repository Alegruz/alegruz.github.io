#pragma once

#include <cassert>
#include <climits>
#include <cmath>
#include <cstdint>
#include <concepts>
#include <optional>
#include <utility>

#include "common.h"

namespace raytracing
{
	template<typename T>
	concept ArithmeticType = std::is_arithmetic_v<T>;

	template<ArithmeticType T, size_t N>
	struct Vector {};
	
	template<ArithmeticType T>
	using Vector3 = Vector<T, 3>;
	
	template<ArithmeticType T>
	using Vector4 = Vector<T, 4>;

	template<ArithmeticType T>
	constexpr float dot(const Vector3<T>& a, const Vector3<T>& b) noexcept;
	template<ArithmeticType T>
	constexpr Vector3<T> cross(const Vector3<T>& a, const Vector3<T>& b) noexcept;
	template<ArithmeticType T>
	constexpr float dot(const Vector4<T>& a, const Vector4<T>& b) noexcept;
	template<ArithmeticType T>
	constexpr Vector4<T> cross(const Vector4<T>& a, const Vector4<T>& b) noexcept;

	template<ArithmeticType T>
	struct Vector<T, 3> final
	{
	public:
		T X;
		T Y;
		T Z;

	public:
		RT_FORCE_INLINE constexpr Vector<T, 3>() noexcept : Vector<T, 3>(0) {}
		RT_FORCE_INLINE constexpr Vector<T, 3>(const T value) noexcept : Vector<T, 3>(value, value, value) {}
		RT_FORCE_INLINE constexpr Vector<T, 3>(const T x, const T y, const T z) noexcept : X(x), Y(y), Z(z) {}
		RT_FORCE_INLINE constexpr Vector<T, 3>(const Vector<T, 3>& other) noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 3>(Vector<T, 3>&& other) noexcept = default;
		RT_FORCE_INLINE ~Vector<T, 3>() noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 3>& operator=(const Vector<T, 3>& other) noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 3>& operator=(Vector<T, 3>&& other) noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 3>& operator=(const T value) noexcept { X = value; Y = value; Z = value; return *this; }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 3> operator+(const Vector<T, 3>& other) const noexcept { return Vector<T, 3>(X + other.X, Y + other.Y, Z + other.Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 3> operator-(const Vector<T, 3>& other) const noexcept { return Vector<T, 3>(X - other.X, Y - other.Y, Z - other.Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 3> operator*(const float scalar) const noexcept { return Vector<T, 3>(X * scalar, Y * scalar, Z * scalar); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 3> operator/(const float scalar) const noexcept { assert(scalar != 0.0f); return Vector<T, 3>(X / scalar, Y / scalar, Z / scalar); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 3> operator-() const noexcept { return Vector<T, 3>(-X, -Y, -Z); }
		RT_FORCE_INLINE constexpr Vector<T, 3>& operator+=(const Vector<T, 3>& other) noexcept { X += other.X; Y += other.Y; Z += other.Z; return *this; }
		RT_FORCE_INLINE constexpr Vector<T, 3>& operator-=(const Vector<T, 3>& other) noexcept { X -= other.X; Y -= other.Y; Z -= other.Z; return *this; }
		RT_FORCE_INLINE constexpr Vector<T, 3>& operator*=(const float scalar) noexcept { X *= scalar; Y *= scalar; Z *= scalar; return *this; }
		RT_FORCE_INLINE constexpr Vector<T, 3>& operator/=(const float scalar) noexcept { X /= scalar; Y /= scalar; Z /= scalar; return *this; }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 3> operator*(const Vector<T, 3>& other) const noexcept { return Vector<T, 3>(X * other.X, Y * other.Y, Z * other.Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 3> operator/(const Vector<T, 3>& other) const noexcept { return Vector<T, 3>(X / other.X, Y / other.Y, Z / other.Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float dot(const Vector<T, 3>& other) const noexcept { return raytracing::dot(*this, other); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 3> cross(const Vector<T, 3>& other) const noexcept { return raytracing::cross(*this, other); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float length() const noexcept { return std::sqrt(X * X + Y * Y + Z * Z); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 3> normalize() const noexcept { const float len = length(); return Vector<T, 3>(X / len, Y / len, Z / len); }
	};

	using float3 = Vector3<float>;

	template<ArithmeticType T>
	struct Vector<T, 4> final
	{
	public:
		T X;
		T Y;
		T Z;
		T W;

	public:
		RT_FORCE_INLINE constexpr Vector<T, 4>() noexcept : Vector<T, 4>(0) {}
		RT_FORCE_INLINE constexpr Vector<T, 4>(const T value) noexcept : Vector<T, 4>(value, value, value, value) {}
		RT_FORCE_INLINE constexpr Vector<T, 4>(const T x, const T y, const T z, const T w) noexcept : X(x), Y(y), Z(z), W(w) {}
		RT_FORCE_INLINE constexpr Vector<T, 4>(const Vector<T, 4>& other) noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 4>(Vector<T, 4>&& other) noexcept = default;
		RT_FORCE_INLINE ~Vector<T, 4>() noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 4>& operator=(const Vector<T, 4>& other) noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 4>& operator=(Vector<T, 4>&& other) noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 4>& operator=(const T value) noexcept { X = value; Y = value; Z = value; W = value; return *this; }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 4> operator+(const Vector<T, 4>& other) const noexcept { return Vector<T, 4>(X + other.X, Y + other.Y, Z + other.Z, W + other.W); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 4> operator-(const Vector<T, 4>& other) const noexcept { return Vector<T, 4>(X - other.X, Y - other.Y, Z - other.Z, W - other.W); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 4> operator*(const T scalar) const noexcept { return Vector<T, 4>(X * scalar, Y * scalar, Z * scalar, W * scalar); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 4> operator/(const T scalar) const noexcept { assert(scalar != 0); return Vector<T, 4>(X / scalar, Y / scalar, Z / scalar, W / scalar); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 4> operator-() const noexcept { return Vector<T, 4>(-X, -Y, -Z, -W); }
		RT_FORCE_INLINE constexpr Vector<T, 4>& operator+=(const Vector<T, 4>& other) noexcept { X += other.X; Y += other.Y; Z += other.Z; W += other.W; return *this; }
		RT_FORCE_INLINE constexpr Vector<T, 4>& operator-=(const Vector<T, 4>& other) noexcept { X -= other.X; Y -= other.Y; Z -= other.Z; W -= other.W; return *this; }
		RT_FORCE_INLINE constexpr Vector<T, 4>& operator*=(const T scalar) noexcept { X *= scalar; Y *= scalar; Z *= scalar; W *= scalar; return *this; }
		RT_FORCE_INLINE constexpr Vector<T, 4>& operator/=(const T scalar) noexcept { X /= scalar; Y /= scalar; Z /= scalar; W /= scalar; return *this; }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 4> operator*(const Vector<T, 4>& other) const noexcept { return Vector<T, 4>(X * other.X, Y * other.Y, Z * other.Z, W * other.W); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 4> operator/(const Vector<T, 4>& other) const noexcept { return Vector<T, 4>(X / other.X, Y / other.Y, Z / other.Z, W / other.W); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float dot(const Vector<T, 4>& other) const noexcept { return raytracing::dot(*this, other); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 4> cross(const Vector<T, 4>& other) const noexcept { return raytracing::cross(*this, other); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float length() const noexcept { return std::sqrt(X * X + Y * Y + Z * Z + W * W); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 4> normalize() const noexcept { const float len = length(); return Vector<T, 4>(X / len, Y / len, Z / len, W / len); }
	};

	using float4 = Vector4<float>;

	template<ArithmeticType T>
	RT_FORCE_INLINE constexpr float dot(const Vector3<T>& a, const Vector3<T>& b) noexcept
	{
		return a.X * b.X + a.Y * b.Y + a.Z * b.Z;
	}

	template<ArithmeticType T>
	RT_FORCE_INLINE constexpr Vector3<T> cross(const Vector3<T>& a, const Vector3<T>& b) noexcept
	{
		return Vector3<T>(a.Y * b.Z - a.Z * b.Y, a.Z * b.X - a.X * b.Z, a.X * b.Y - a.Y * b.X);
	}

	template<ArithmeticType T>
	RT_FORCE_INLINE constexpr float dot(const Vector4<T>& a, const Vector4<T>& b) noexcept
	{
		return a.X * b.X + a.Y * b.Y + a.Z * b.Z + a.W * b.W;
	}

	template<ArithmeticType T>
	RT_FORCE_INLINE constexpr Vector4<T> cross(const Vector4<T>& a, const Vector4<T>& b) noexcept
	{
		return Vector4<T>(
			a.Y * b.Z - a.Z * b.Y,
			a.Z * b.X - a.X * b.Z,
			a.X * b.Y - a.Y * b.X,
			0.0f // W component is set to 0 for cross product
		);
	}

	struct ParametricLine final
	{
	public:
		float3 Origin;	  // The starting point of the ray
		float3 Direction; // The direction of the ray, should be normalized

	public:
		RT_FORCE_INLINE constexpr ParametricLine() noexcept : Origin(0.0f), Direction(1.0f, 0.0f, 0.0f) {}
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