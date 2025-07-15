#pragma once

#include <cassert>
#include <chrono>
#include <climits>
#include <cmath>
#include <cstdint>
#include <concepts>
#include <optional>
#include <random> // Required for random number generation
#include <utility>

#include "common.h"

namespace raytracing
{
	template<typename T>
	concept ArithmeticType = std::is_arithmetic_v<T>;

	template<ArithmeticType T, size_t N>
	struct Vector {};

	template<ArithmeticType T>
	using Vector2 = Vector<T, 2>;
	
	template<ArithmeticType T>
	using Vector3 = Vector<T, 3>;
	
	template<ArithmeticType T>
	using Vector4 = Vector<T, 4>;

	template<ArithmeticType T>
	constexpr T lerp(const T& a, const T& b, const float value) noexcept
	{
		return a + (b - a) * value;
	}

	template<ArithmeticType T>
	constexpr float dot(const Vector2<T>& a, const Vector2<T>& b) noexcept;
	template<ArithmeticType T>
	constexpr Vector2<T> cross(const Vector2<T>& a, const Vector2<T>& b) noexcept;
	template<ArithmeticType T>
	constexpr Vector2<T> lerp(const Vector2<T>& a, const Vector2<T>& b, const float value) noexcept;
	template<ArithmeticType T>
	constexpr Vector2<T> lerp(const Vector2<T>& a, const Vector2<T>& b, const Vector2<float>& values) noexcept;
	template<ArithmeticType T>
	constexpr float dot(const Vector3<T>& a, const Vector3<T>& b) noexcept;
	template<ArithmeticType T>
	constexpr Vector3<T> cross(const Vector3<T>& a, const Vector3<T>& b) noexcept;
	template<ArithmeticType T>
	constexpr Vector3<T> lerp(const Vector3<T>& a, const Vector3<T>& b, const float value) noexcept;
	template<ArithmeticType T>
	constexpr Vector3<T> lerp(const Vector3<T>& a, const Vector3<T>& b, const Vector3<float>& values) noexcept;
	template<ArithmeticType T>
	constexpr float dot(const Vector4<T>& a, const Vector4<T>& b) noexcept;
	template<ArithmeticType T>
	constexpr Vector4<T> cross(const Vector4<T>& a, const Vector4<T>& b) noexcept;
	template<ArithmeticType T>
	constexpr Vector4<T> lerp(const Vector4<T>& a, const Vector4<T>& b, const float value) noexcept;
	template<ArithmeticType T>
	constexpr Vector4<T> lerp(const Vector4<T>& a, const Vector4<T>& b, const Vector4<float>& values) noexcept;

	template<ArithmeticType T, T MIN, T MAX>
	class RandomNumberGenerator
	{
	public:
		static T GetRandomNumber()
		{
			return smDistribution(smGenerator);
		}

	private:
		static uint32_t smGeneratorSeed;
    	static std::mt19937 smGenerator;
		static std::uniform_real_distribution<T> smDistribution;
	};

	using UniformRandomGenerator = RandomNumberGenerator<float, 0.0f, 1.0f>;

	template<ArithmeticType T>
	struct Vector<T, 2> final
	{
	public:
		T X;
		T Y;

	public:
		RT_FORCE_INLINE constexpr Vector<T, 2>() noexcept : Vector<T, 2>(0) {}
		RT_FORCE_INLINE constexpr Vector<T, 2>(const T value) noexcept : Vector<T, 2>(value, value) {}
		RT_FORCE_INLINE constexpr Vector<T, 2>(const T x, const T y) noexcept : X(x), Y(y) {}
		RT_FORCE_INLINE constexpr Vector<T, 2>(const Vector<T, 2>& other) noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 2>(Vector<T, 2>&& other) noexcept = default;
		RT_FORCE_INLINE ~Vector<T, 2>() noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 2>& operator=(const Vector<T, 2>& other) noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 2>& operator=(Vector<T, 2>&& other) noexcept = default;
		RT_FORCE_INLINE constexpr Vector<T, 2>& operator=(const T value) noexcept { X = value; Y = value; return *this; }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 2> operator+(const Vector<T, 2>& other) const noexcept { return Vector<T, 2>(X + other.X, Y + other.Y); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 2> operator-(const Vector<T, 2>& other) const noexcept { return Vector<T, 2>(X - other.X, Y - other.Y); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 2> operator*(const float scalar) const noexcept { return Vector<T, 2>(X * scalar, Y * scalar); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 2> operator/(const float scalar) const noexcept { assert(scalar != 0.0f); return Vector<T, 2>(X / scalar, Y / scalar); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 2> operator-() const noexcept { return Vector<T, 2>(-X, -Y); }
		RT_FORCE_INLINE constexpr Vector<T, 2>& operator+=(const Vector<T, 2>& other) noexcept { X += other.X; Y += other.Y; return *this; }
		RT_FORCE_INLINE constexpr Vector<T, 2>& operator-=(const Vector<T, 2>& other) noexcept { X -= other.X; Y -= other.Y; return *this; }
		RT_FORCE_INLINE constexpr Vector<T, 2>& operator*=(const float scalar) noexcept { X *= scalar; Y *= scalar; return *this; }
		RT_FORCE_INLINE constexpr Vector<T, 2>& operator/=(const float scalar) noexcept { X /= scalar; Y /= scalar; return *this; }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 2> operator*(const Vector<T, 2>& other) const noexcept { return Vector<T, 2>(X * other.X, Y * other.Y); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 2> operator/(const Vector<T, 2>& other) const noexcept { return Vector<T, 2>(X / other.X, Y / other.Y); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float dot(const Vector<T, 2>& other) const noexcept { return raytracing::dot(*this, other); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 2> cross(const Vector<T, 2>& other) const noexcept { return raytracing::cross(*this, other); }
		[[nodiscard]] RT_FORCE_INLINE constexpr float length() const noexcept { return std::sqrt(X * X + Y * Y); }
		[[nodiscard]] RT_FORCE_INLINE constexpr Vector<T, 2> normalize() const noexcept { const float len = length(); return Vector<T, 2>(X / len, Y / len); }
	};

	using float2 = Vector2<float>;

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
		RT_FORCE_INLINE constexpr Vector<T, 3>& operator*=(const Vector<T, 3>& other) noexcept { X *= other.X; Y *= other.Y; Z *= other.Z; return *this; }
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
		RT_FORCE_INLINE constexpr Vector<T, 4>& operator*=(const Vector<T, 4>& other) noexcept { X *= other.X; Y *= other.Y; Z *= other.Z; W *= other.W; return *this; }
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
	RT_FORCE_INLINE constexpr float dot(const Vector2<T>& a, const Vector2<T>& b) noexcept
	{
		return a.X * b.X + a.Y * b.Y;
	}

	template<ArithmeticType T>
	RT_FORCE_INLINE constexpr Vector2<T> cross(const Vector2<T>& a, const Vector2<T>& b) noexcept
	{
		return Vector2<T>(a.X * b.Y - a.Y * b.X, 0.0f); // Cross product in 2D results in a vector with Z component only
	}

	template<ArithmeticType T>
	RT_FORCE_INLINE constexpr Vector2<T> lerp(const Vector2<T>& a, const Vector2<T>& b, const float value) noexcept
	{
		return Vector2<T>(a.X + (b.X - a.X) * value, a.Y + (b.Y - a.Y) * value);
	}

	template<ArithmeticType T>
	RT_FORCE_INLINE constexpr Vector2<T> lerp(const Vector2<T>& a, const Vector2<T>& b, const Vector2<float>& values) noexcept
	{
		return Vector2<T>(a.X + (b.X - a.X) * values.X, a.Y + (b.Y - a.Y) * values.Y);
	}

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
	RT_FORCE_INLINE constexpr Vector3<T> lerp(const Vector3<T>& a, const Vector3<T>& b, const float value) noexcept
	{
		return Vector3<T>(a.X + (b.X - a.X) * value, a.Y + (b.Y - a.Y) * value, a.Z + (b.Z - a.Z) * value);
	}

	template<ArithmeticType T>
	RT_FORCE_INLINE constexpr Vector3<T> lerp(const Vector3<T>& a, const Vector3<T>& b, const Vector3<float>& values) noexcept
	{
		return Vector3<T>(a.X + (b.X - a.X) * values.X, a.Y + (b.Y - a.Y) * values.Y, a.Z + (b.Z - a.Z) * values.Z);
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

	template<ArithmeticType T>
	RT_FORCE_INLINE constexpr Vector4<T> lerp(const Vector4<T>& a, const Vector4<T>& b, const float value) noexcept
	{
		return Vector4<T>(
			a.X + (b.X - a.X) * value,
			a.Y + (b.Y - a.Y) * value,
			a.Z + (b.Z - a.Z) * value,
			a.W + (b.W - a.W) * value
		);
	}

	template<ArithmeticType T>
	RT_FORCE_INLINE constexpr Vector4<T> lerp(const Vector4<T>& a, const Vector4<T>& b, const Vector4<float>& values) noexcept
	{
		return Vector4<T>(
			a.X + (b.X - a.X) * values.X,
			a.Y + (b.Y - a.Y) * values.Y,
			a.Z + (b.Z - a.Z) * values.Z,
			a.W + (b.W - a.W) * values.W
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
		enum class eVertexOrder : uint8_t
		{
			Clockwise,
			CounterClockwise,
		};

	public:
		static constexpr uint32_t VERTICES_COUNT = 3;

	public:
		float3 Vertices[VERTICES_COUNT];
		eVertexOrder VertexOrder = eVertexOrder::Clockwise; // Default vertex order

	public:
		RT_FORCE_INLINE constexpr Triangle() noexcept : Vertices{float3(0.0f), float3(0.0f), float3(0.0f)} {}
		RT_FORCE_INLINE constexpr Triangle(const float3& vertex0, const float3& vertex1, const float3& vertex2) noexcept : Vertices{vertex0, vertex1, vertex2} {}
		RT_FORCE_INLINE constexpr Triangle(const Triangle& other) noexcept = default;
		RT_FORCE_INLINE constexpr Triangle(Triangle&& other) noexcept = default;
		RT_FORCE_INLINE ~Triangle() noexcept = default;
		RT_FORCE_INLINE constexpr Triangle& operator=(const Triangle& other) noexcept = default;
		RT_FORCE_INLINE constexpr Triangle& operator=(Triangle&& other) noexcept = default;

		RT_FORCE_INLINE constexpr float3 GetPointByBarycentricCoordinates(const float3& barycentricCoordinates) const noexcept
		{
			assert(barycentricCoordinates.X >= 0.0f && barycentricCoordinates.Y >= 0.0f && barycentricCoordinates.Z >= 0.0f);
			assert(barycentricCoordinates.X + barycentricCoordinates.Y + barycentricCoordinates.Z == 1.0f);
			return Vertices[0] * barycentricCoordinates.X + Vertices[1] * barycentricCoordinates.Y + Vertices[2] * barycentricCoordinates.Z;
		}
		RT_FORCE_INLINE constexpr float3 GetBarycentricCoordinates(const float3& point) const noexcept
		{
			const float3 edge0 = Vertices[1] - Vertices[0];
			const float3 edge1 = Vertices[2] - Vertices[0];
			const float3 v0 = point - Vertices[0];
			const float d00 = dot(edge0, edge0);
			const float d01 = dot(edge0, edge1);
			const float d11 = dot(edge1, edge1);
			const float d20 = dot(v0, edge0);
			const float d21 = dot(v0, edge1);
			const float denom = d00 * d11 - d01 * d01;

			if (denom == 0.0f) { return { 0.0f, 0.0f, 0.0f }; } // Degenerate triangle

			const float invDenom = 1.0f / denom;
			const float u = (d11 * d20 - d01 * d21) * invDenom;
			const float v = (d00 * d21 - d01 * d20) * invDenom;
			return { u, v, 1.0f - u - v };
		}
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
		}

		static constexpr std::optional<float3> MoellerTrumbore(const ParametricLine &ray, const Triangle &triangle, float &intersectionDistance);
	};

	constexpr std::optional<float3> IntersectionChecker::MoellerTrumbore(const ParametricLine& ray, const Triangle& triangle, float& intersectionDistance)
	{
		uint32_t vertexIndex0 = 0;
		uint32_t vertexIndex1 = 1;
		uint32_t vertexIndex2 = 2;
		if (triangle.VertexOrder == Triangle::eVertexOrder::CounterClockwise)
		{
			vertexIndex0 = 0;
			vertexIndex1 = 1;
			vertexIndex2 = 2;
		}
		else
		{
			assert(triangle.VertexOrder == Triangle::eVertexOrder::Clockwise);
			vertexIndex0 = 0;
			vertexIndex2 = 1;
			vertexIndex1 = 2;
		}

		const float3 edge0 = triangle.Vertices[vertexIndex1] - triangle.Vertices[vertexIndex0];
		const float3 edge1 = triangle.Vertices[vertexIndex2] - triangle.Vertices[vertexIndex0];
		const float3 rayCrossEdge1 = cross(ray.Direction, edge1);
		const float determinant = dot(edge0, rayCrossEdge1);
		if(determinant > -std::numeric_limits<float>::epsilon() && determinant < std::numeric_limits<float>::epsilon())
		{
			return std::nullopt; // Placeholder for the actual implementation
		}

		const float inverseDeterminant = 1.0f / determinant;
		const float3 s = ray.Origin - triangle.Vertices[vertexIndex0];
		const float u = dot(s, rayCrossEdge1) * inverseDeterminant;
		if((u < 0.0f && std::abs(u) > std::numeric_limits<float>::epsilon()) || (u > 1.0f && std::abs(u - 1.0f) > std::numeric_limits<float>::epsilon()))
		{
			return std::nullopt;
		}

		const float3 sCrossEdge0 = cross(s, edge0);
		const float v = dot(ray.Direction, sCrossEdge0) * inverseDeterminant;
		if((v < 0.0f && std::abs(v) > std::numeric_limits<float>::epsilon()) || (u + v > 1.0f && std::abs(u + v - 1.0f) > std::numeric_limits<float>::epsilon()))
		{
			return std::nullopt;
		}

		intersectionDistance = dot(edge1, sCrossEdge0) * inverseDeterminant;
		if(intersectionDistance > std::numeric_limits<float>::epsilon())
		{
			return ray.Origin + ray.Direction * intersectionDistance;
		}

		return std::nullopt; // No intersection found
	}
}