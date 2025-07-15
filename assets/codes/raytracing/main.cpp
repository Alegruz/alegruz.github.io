#define _CRT_SECURE_NO_WARNINGS
#include "common.h"
#include <algorithm>
#include <iostream>
#if !defined(RT_EMSCRIPTEN)
#include <thread>
#endif  // NOT defined(RT_EMSCRIPTEN)
#include <vector>

#if defined(RT_EMSCRIPTEN)
#include <emscripten/emscripten.h>
#endif  // defined(RT_EMSCRIPTEN)

// Emscripten/Clang: suppress sign conversion warnings if needed
#if defined(RT_EMSCRIPTEN)
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wsign-conversion"
#pragma clang diagnostic ignored "-Wimplicit-int-conversion"
#pragma clang diagnostic ignored "-Wmissing-field-initializers"
#endif  // defined(RT_EMSCRIPTEN)
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"
#if defined(RT_EMSCRIPTEN)
#pragma clang diagnostic pop
#endif  // defined(RT_EMSCRIPTEN)

#include "math.h"

using namespace raytracing;

// math
template<ArithmeticType T, T MIN, T MAX>
uint32_t RandomNumberGenerator<T, MIN, MAX>::smGeneratorSeed(static_cast<uint32_t>(std::chrono::high_resolution_clock::now().time_since_epoch().count()));
template<ArithmeticType T, T MIN, T MAX>
std::mt19937 RandomNumberGenerator<T, MIN, MAX>::smGenerator(smGeneratorSeed);
template<ArithmeticType T, T MIN, T MAX>
std::uniform_real_distribution<T> RandomNumberGenerator<T, MIN, MAX>::smDistribution(MIN, MAX);

static constexpr uint32_t CHANNELS_COUNT = 4; // RGBA

enum class eTextureMemoryLayout
{
    RowMajor,
    ColumnMajor,
};

static constexpr eTextureMemoryLayout DEFAULT_MEMORY_LAYOUT = eTextureMemoryLayout::RowMajor;

template<typename T, eTextureMemoryLayout MEMORY_LAYOUT = DEFAULT_MEMORY_LAYOUT>
class Texture2D
{
public:
    RT_FORCE_INLINE constexpr Texture2D(const uint32_t width, const uint32_t height) : mWidth(width), mHeight(height), mData(width * height) {}
    RT_FORCE_INLINE constexpr Texture2D(const Texture2D& other) noexcept : mWidth(other.mWidth), mHeight(other.mHeight), mData(other.mData) {}
    RT_FORCE_INLINE constexpr Texture2D(Texture2D&& other) noexcept : mWidth(std::move(other.mWidth)), mHeight(std::move(other.mHeight)), mData(std::move(other.mData)) {}
    RT_FORCE_INLINE ~Texture2D() noexcept = default;
    RT_FORCE_INLINE constexpr Texture2D& operator=(const Texture2D& other) noexcept
    {
        if (this != &other)
        {
            mWidth = other.mWidth;
            mHeight = other.mHeight;
            mData = other.mData;
        }
        return *this;
    }
    RT_FORCE_INLINE constexpr Texture2D& operator=(Texture2D&& other) noexcept
    {
        if (this != &other)
        {
            mWidth = std::move(other.mWidth);
            mHeight = std::move(other.mHeight);
            mData = std::move(other.mData);
        }
        return *this;
    }

    RT_FORCE_INLINE constexpr uint32_t GetWidth() const noexcept { return mWidth; }
    RT_FORCE_INLINE constexpr uint32_t GetHeight() const noexcept { return mHeight; }
    RT_FORCE_INLINE constexpr T& GetPixel(uint32_t x, uint32_t y) noexcept
    {
        if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::RowMajor)
        {
            return mData[y * mWidth + x];
        }
        else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
        {
            return mData[x * mHeight + y];
        }
        else
        {
            static_assert(false, "Unsupported memory layout");
        }
    }
    RT_FORCE_INLINE constexpr const T& GetPixel(uint32_t x, uint32_t y) const noexcept
    {
        if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::RowMajor)
        {
            return mData[y * mWidth + x];
        }
        else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
        {
            return mData[x * mHeight + y];
        }
        else
        {
            static_assert(false, "Unsupported memory layout");
        }
    }
    RT_FORCE_INLINE constexpr T* GetData() noexcept { return mData.data(); }
    RT_FORCE_INLINE constexpr const T* GetData() const noexcept { return mData.data(); }

    RT_FORCE_INLINE constexpr void SetResolution(const uint32_t width, const uint32_t height) noexcept
    {
        mWidth = std::max(width, 1u);
        mHeight = std::max(height, 1u);
        mData.resize(mWidth * mHeight);
    }

    RT_FORCE_INLINE constexpr void Clear(const T& clearValue = T{}) noexcept
    {
        std::fill(mData.begin(), mData.end(), clearValue);
    }
private:
    uint32_t mWidth;
    uint32_t mHeight;
    std::vector<T> mData;
};

template<typename T, eTextureMemoryLayout MEMORY_LAYOUT = DEFAULT_MEMORY_LAYOUT>
class Texture3D final
{ 
public:
    RT_FORCE_INLINE constexpr Texture3D(const uint32_t width, const uint32_t height, const uint32_t depth)
        : mWidth(width), mHeight(height), mDepth(depth), mData(width * height * depth) {}
    RT_FORCE_INLINE constexpr Texture3D(const Texture3D& other) noexcept = default;
    RT_FORCE_INLINE constexpr Texture3D(Texture3D&& other) noexcept = default;
    RT_FORCE_INLINE ~Texture3D() noexcept = default;

    RT_FORCE_INLINE constexpr Texture3D& operator=(const Texture3D& other) noexcept = default;
    RT_FORCE_INLINE constexpr Texture3D& operator=(Texture3D&& other) noexcept = default;

    RT_FORCE_INLINE constexpr uint32_t GetWidth() const noexcept { return mWidth; }
    RT_FORCE_INLINE constexpr uint32_t GetHeight() const noexcept { return mHeight; }
    RT_FORCE_INLINE constexpr uint32_t GetDepth() const noexcept { return mDepth; }
    RT_FORCE_INLINE constexpr T& GetPixel(uint32_t x, uint32_t y, uint32_t z) noexcept
    {
        if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::RowMajor)
        {
            return mData[z * mWidth * mHeight + y * mWidth + x];
        }
        else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
        {
            return mData[x * mHeight * mDepth + y * mDepth + z];
        }
        else
        {
            static_assert(false, "Unsupported memory layout");
        }
    }
    RT_FORCE_INLINE constexpr const T& GetPixel(uint32_t x, uint32_t y, uint32_t z) const noexcept
    {
        if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::RowMajor)
        {
            return mData[z * mWidth * mHeight + y * mWidth + x];
        }
        else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
        {
            return mData[x * mHeight * mDepth + y * mDepth + z];
        }
        else
        {
            static_assert(false, "Unsupported memory layout");
        }
    }
    RT_FORCE_INLINE constexpr const T* GetData() const noexcept { return mData.data(); }
    RT_FORCE_INLINE constexpr void SetResolution(const uint32_t width, const uint32_t height, const uint32_t depth) noexcept
    {
        mWidth = std::max(width, 1u);
        mHeight = std::max(height, 1u);
        mDepth = std::max(depth, 1u);
        mData.resize(mWidth * mHeight * mDepth);
    }
    RT_FORCE_INLINE constexpr void Clear(const T& clearValue = T{}) noexcept
    {
        std::fill(mData.begin(), mData.end(), clearValue);
    }
private:
    uint32_t mWidth;
    uint32_t mHeight;
    uint32_t mDepth;
    std::vector<T> mData;
};

namespace raytracing
{
    using Color = Vector<float, CHANNELS_COUNT>;
    using Color8Bit = Vector<uint8_t, CHANNELS_COUNT>;
}

static constexpr raytracing::Color COLOR_WHITE = {1.0f, 1.0f, 1.0f, 1.0f};
static constexpr raytracing::Color COLOR_BLACK = {0.0f, 0.0f, 0.0f, 1.0f};
static constexpr raytracing::Color COLOR_RED = {1.0f, 0.0f, 0.0f, 1.0f};
static constexpr raytracing::Color COLOR_GREEN = {0.0f, 1.0f, 0.0f, 1.0f};

enum class eMaterial : uint8_t
{
    SimpleDiffuse,
};

struct Geometry final
{
    std::string Name;
    std::vector<Triangle> Triangles;
    Color Color = COLOR_WHITE;
    bool IsEmissive = false;
    eMaterial Material = eMaterial::SimpleDiffuse;
};

static Texture2D<Color>* sPixels = nullptr;
static Texture2D<Color8Bit>* s8BitColors = nullptr;
static Texture2D<Ray>* sRays = nullptr;
static std::vector<Geometry> sGeometries;
static std::vector<Geometry*> sLightGeometries;

struct Camera
{
    float3 Position;
    float3 Direction;
    float3 UpDirection;
    float FocalLength;
    float Width;
    float Height;
};

static constexpr Camera CAMERA = 
{
    .Position = {278.0f, 273.0f, -800.0f},
    .Direction = {0.0f, 0.0f, 1.0f},
    .UpDirection = {0.0f, 1.0f, 0.0f},
    .FocalLength = 0.035f,
    .Width = 0.025f,
    .Height = 0.025f
};

namespace cornell_box
{
    static Geometry FLOOR =
    {
        .Name = "Floor",
        .Triangles =
        {
            Triangle(float3(0.0f, 0.0f, 0.0f), float3(559.2f, 0.0f, 552.8f), float3(559.2f, 0.0f, 0.0f)),
            Triangle(float3(0.0f, 0.0f, 0.0f), float3(0.0f, 0.0f, 552.8f), float3(559.2f, 0.0f, 552.8f))
        },
        .Color = COLOR_WHITE,
    };
    static Geometry LIGHT =
    {
        .Name = "Light",
        .Triangles =
        {
            Triangle(
                float3(343.0f, 548.8f - std::numeric_limits<float>::epsilon() - std::numeric_limits<float>::epsilon(), 227.0f)
                , float3(343.0f, 548.8f - std::numeric_limits<float>::epsilon() - std::numeric_limits<float>::epsilon(), 332.0f)
                , float3(213.0f, 548.8f - std::numeric_limits<float>::epsilon() - std::numeric_limits<float>::epsilon(), 332.0f)),
            Triangle(
                float3(213.0f, 548.8f - std::numeric_limits<float>::epsilon() - std::numeric_limits<float>::epsilon(), 227.0f)
                , float3(343.0f, 548.8f - std::numeric_limits<float>::epsilon() - std::numeric_limits<float>::epsilon(), 227.0f)
                , float3(213.0f, 548.8f - std::numeric_limits<float>::epsilon() - std::numeric_limits<float>::epsilon(), 332.0f))
        },
        .Color = COLOR_WHITE,
        .IsEmissive = true
    };
    static Geometry CEILING =
    {
        .Name = "Ceiling",
        .Triangles =
        {
            Triangle(float3(556.0f, 548.8f, 0.0f), float3(556.0f, 548.8f, 559.2f), float3(0.0f, 548.8f, 559.2f)),
            Triangle(float3(0.0f, 548.8f, 0.0f), float3(556.0f, 548.8f, 0.0f), float3(0.0f, 548.8f, 559.2f))
        },
        .Color = COLOR_WHITE
    };
    // Back wall
    static Geometry BACK_WALL =
    {
        .Name = "Back Wall",
        .Triangles =
        {
            Triangle(float3(549.6f, 0.0f, 559.2f), float3(0.0f, 0.0f, 559.2f), float3(0.0f, 548.8f, 559.2f)),
            Triangle(float3(549.6f, 0.0f, 559.2f), float3(0.0f, 548.8f, 559.2f), float3(556.0f, 548.8f, 559.2f))
        },
        .Color = COLOR_WHITE
    };
    static Geometry RIGHT_WALL =
    {
        .Name = "Right Wall",
        .Triangles =
        {
            Triangle(float3(0.0f, 0.0f, 559.2f), float3(0.0f, 0.0f, 0.0f), float3(0.0f, 548.8f, 0.0f)),
            Triangle(float3(0.0f, 0.0f, 559.2f), float3(0.0f, 548.8f, 0.0f), float3(0.0f, 548.8f, 559.2f))
        },
        .Color = COLOR_GREEN
    };
    static Geometry LEFT_WALL =
    {
        .Name = "Left Wall",
        .Triangles =
        {
            Triangle(float3(552.8f, 0.0f, 0.0f), float3(549.6f, 0.0f, 559.2f), float3(556.0f, 548.8f, 559.2f)),
            Triangle(float3(556.0f, 548.8f, 0.0f), float3(552.8f, 0.0f, 0.0f), float3(556.0f, 548.8f, 559.2f))
        },
        .Color = COLOR_RED
    };
    static Geometry SHORT_BLOCK =
    {
        .Name = "Short Block",
        .Triangles =
        {
            Triangle(float3(130.0f, 165.0f, 65.0f), float3(82.0f, 165.0f, 225.0f), float3(240.0f, 165.0f, 272.0f)),
            Triangle(float3(290.0f, 165.0f, 114.0f), float3(130.0f, 165.0f, 65.0f), float3(240.0f, 165.0f, 272.0f)),
            Triangle(float3(290.0f, 0.0f, 114.0f), float3(290.0f, 165.0f, 114.0f), float3(240.0f, 165.0f, 272.0f)),
            Triangle(float3(240.0f, 0.0f, 272.0f), float3(290.0f, 0.0f, 114.0f), float3(240.0f, 165.0f, 272.0f)),
            Triangle(float3(130.0f, 0.0f, 65.0f), float3(130.0f, 165.0f, 65.0f), float3(290.0f, 165.0f, 114.0f)),
            Triangle(float3(290.0f, 0.0f, 114.0f), float3(130.0f, 0.0f, 65.0f), float3(290.0f, 165.0f, 114.0f)),
            Triangle(float3(82.0f, 0.0f, 225.0f), float3(82.0f, 165.0f, 225.0f), float3(130.0f, 165.0f, 65.0f)),
            Triangle(float3(130.0f, 0.0f, 65.0f), float3(82.0f, 0.0f, 225.0f), float3(130.0f, 165.0f, 65.0f)),
            Triangle(float3(240.0f, 0.0f, 272.0f), float3(240.0f, 165.0f, 272.0f), float3(82.0f, 165.0f, 225.0f)),
            Triangle(float3(82.0f, 0.0f, 225.0f), float3(240.0f, 0.0f, 272.0f), float3(82.0f, 165.0f, 225.0f))
        },
        .Color = COLOR_WHITE
    };
    static Geometry TALL_BLOCK =
    {
        .Name = "Tall Block",
        .Triangles =
        {
            // Top
            Triangle(float3(423.0f, 330.0f, 247.0f), float3(265.0f, 330.0f, 296.0f), float3(314.0f, 330.0f, 456.0f)),
            Triangle(float3(472.0f, 330.0f, 406.0f), float3(423.0f, 330.0f, 247.0f), float3(314.0f, 330.0f, 456.0f)),
            // Front
            Triangle(float3(423.0f, 0.0f, 247.0f), float3(423.0f, 330.0f, 247.0f), float3(472.0f, 330.0f, 406.0f)),
            Triangle(float3(472.0f, 0.0f, 406.0f), float3(423.0f, 0.0f, 247.0f), float3(472.0f, 330.0f, 406.0f)),
            // Right
            Triangle(float3(472.0f, 0.0f, 406.0f), float3(472.0f, 330.0f, 406.0f), float3(314.0f, 330.0f, 456.0f)),
            Triangle(float3(314.0f, 0.0f, 456.0f), float3(472.0f, 0.0f, 406.0f), float3(314.0f, 330.0f, 456.0f)),
            // Back
            Triangle(float3(314.0f, 0.0f, 456.0f), float3(314.0f, 330.0f, 456.0f), float3(265.0f, 330.0f, 296.0f)),
            Triangle(float3(265.0f, 0.0f, 296.0f), float3(314.0f, 0.0f, 456.0f), float3(265.0f, 330.0f, 296.0f)),
            // Left
            Triangle(float3(265.0f, 0.0f, 296.0f), float3(265.0f, 330.0f, 296.0f), float3(423.0f, 330.0f, 247.0f)),
            Triangle(float3(423.0f, 0.0f, 247.0f), float3(265.0f, 0.0f, 296.0f), float3(423.0f, 330.0f, 247.0f))
        },
        .Color = COLOR_WHITE
    };
};

enum class ePixelProcessingMode : uint8_t
{
    Initialize,
    Clear,
    Render,
    Denoise,
};

enum class eDenoiser : uint8_t
{
    BilateralFilter,
    Count,
    Default = BilateralFilter,
};

enum class eRaytracingMode : uint8_t
{
    None = 0b0,
    Jitter = 0b1,
    Shadow = Jitter << 1,
    Lambertian = Shadow << 1,
    IndirectIllumination = Lambertian << 1,
    Denoise = IndirectIllumination << 1,
    JitterAndShadow = Jitter | Shadow,
    DirectDiffuse = JitterAndShadow | Lambertian,
    IndirectDiffuse = DirectDiffuse | IndirectIllumination,
    Count,
};

RT_FORCE_INLINE constexpr eRaytracingMode operator|(eRaytracingMode lhs, eRaytracingMode rhs) noexcept
{
    return static_cast<eRaytracingMode>(static_cast<uint32_t>(lhs) | static_cast<uint32_t>(rhs));
}

RT_FORCE_INLINE constexpr eRaytracingMode operator&(eRaytracingMode lhs, eRaytracingMode rhs) noexcept
{
    return static_cast<eRaytracingMode>(static_cast<uint32_t>(lhs) & static_cast<uint32_t>(rhs));
}

struct RenderContext
{
    uint32_t FrameIndex;
    eRaytracingMode Mode;
    uint32_t Width;
    uint32_t Height;
    const float3& CameraForward;
    const float3 CameraRight;
    const float3 CameraUp;
    uint32_t TraceDepth;
    uint32_t MaxTraceDepth;
    uint32_t NumSamples;
    eDenoiser Denoiser = eDenoiser::Default;
};

struct HitResult final
{
    const Geometry* GeometryOrNull = nullptr;
    const Triangle* TriangleOrNull = nullptr;
    float3 IntersectionPoint;
    float IntersectionDistance = std::numeric_limits<float>::max();
};

Color traceRay(HitResult& outHitResult, const Ray& ray, const std::vector<Geometry>& geometries, RenderContext& context);

HitResult getClosestHitGeometry(const Ray& ray, const std::vector<Geometry>& geometries)
{
    HitResult hitResult;
    
    for (const Geometry& geometry : geometries)
    {
        for (const Triangle& triangle : geometry.Triangles)
        {
            float intersectionDistance = 0.0f;
            std::optional<float3> intersectionPoint = IntersectionChecker::Intersects(ray, triangle, intersectionDistance);
            if (intersectionPoint.has_value() && intersectionDistance < hitResult.IntersectionDistance)
            {
                hitResult.IntersectionDistance = intersectionDistance;
                hitResult.GeometryOrNull = &geometry;
                hitResult.TriangleOrNull = &triangle;
                hitResult.IntersectionPoint = intersectionPoint.value();
            }
        }
    }

    return hitResult;
}

Color onClosestHit([[maybe_unused]] const Ray& ray, const HitResult& hitResult, RenderContext& context)
{
    // Handle the closest hit event
    // For example, you could store the hit information or update the pixel color
    Color color = COLOR_BLACK; // Default color
    if(hitResult.GeometryOrNull)
    {
        if(hitResult.GeometryOrNull->IsEmissive)
        {
            // If the geometry is emissive, we can consider it lit
            color = hitResult.GeometryOrNull->Color; // Use the emissive color
        }
        else
        {
            Color intensity = COLOR_BLACK;
            if((context.Mode & eRaytracingMode::Shadow) != eRaytracingMode::None)
            {
                for(const Geometry* lightGeometry : sLightGeometries)
                {
                    // Check if the hit point is in shadow
                    Ray shadowRay;
                    shadowRay.Origin = hitResult.IntersectionPoint;
                    float3 randomBarycentric;
                    randomBarycentric.X = UniformRandomGenerator::GetRandomNumber();
                    randomBarycentric.Y = UniformRandomGenerator::GetRandomNumber() * (1.0f - randomBarycentric.X);
                    randomBarycentric.Z = 1.0f - (randomBarycentric.X + randomBarycentric.Y);

                    const uint32_t triangleIndex = static_cast<uint32_t>(UniformRandomGenerator::GetRandomNumber() * (static_cast<float>(lightGeometry->Triangles.size() - 1)));
                    const float3 pointOnLightTriangle = lightGeometry->Triangles[triangleIndex].GetPointByBarycentricCoordinates(randomBarycentric);
                    shadowRay.Direction = (pointOnLightTriangle - hitResult.IntersectionPoint).normalize();
                    shadowRay.Origin += shadowRay.Direction * 0.1f; // Offset to avoid self-intersection

                    HitResult shadowHitResult = getClosestHitGeometry(shadowRay, sGeometries);
                    if(shadowHitResult.GeometryOrNull && shadowHitResult.GeometryOrNull == lightGeometry)
                    {
                        Color lightColor = lightGeometry->Color;
                        // If the shadow ray hits an emissive geometry, we can consider it lit
                        if((context.Mode & eRaytracingMode::Lambertian) != eRaytracingMode::None)
                        {
                            if(hitResult.GeometryOrNull->Material == eMaterial::SimpleDiffuse)
                            {
                                // Calculate Lambertian reflectance
                                const float lambertian = std::max(0.0f, dot(shadowRay.Direction, hitResult.TriangleOrNull->Normal));
                                lightColor *= lambertian; // Add light color
                            }
                        }
                        intensity += lightColor; // Add light color
                    }
                }
            }
            else
            {
                intensity = COLOR_WHITE;
            }

            if((context.Mode & eRaytracingMode::IndirectIllumination) != eRaytracingMode::None)
            {
                Ray indirectRay;
                indirectRay.Origin = hitResult.IntersectionPoint;
                // Generate a random direction for indirect illumination
                // Generate a random direction in the hemisphere oriented by the surface normal
                float3 normal = hitResult.TriangleOrNull->Normal;
                const float u1 = UniformRandomGenerator::GetRandomNumber();
                const float u2 = UniformRandomGenerator::GetRandomNumber();
                const float r = sqrtf(u1);
                const float theta = 2.0f * static_cast<float>(std::numbers::pi) * u2;
                const float x = r * cosf(theta);
                const float y = r * sinf(theta);
                const float z = sqrtf(1.0f - u1);

                // Create an orthonormal basis (n, t, b)
                const float3 n = normal.normalize();
                const float3 t = (fabs(n.X) > 0.1f ? float3(0,1,0) : float3(1,0,0)).cross(n).normalize();
                const float3 b = n.cross(t);

                const float3 randomDirection = (t * x) + (b * y) + (n * z);
                indirectRay.Direction = randomDirection.normalize();
                indirectRay.Origin += indirectRay.Direction * 0.1f; // Offset to avoid self-intersection

                HitResult indirectHitResult;
                Color indirectColor = traceRay(indirectHitResult, indirectRay, sGeometries, context);
                // If the shadow ray hits an emissive geometry, we can consider it lit
                if (indirectHitResult.GeometryOrNull)
                {
                    if ((context.Mode & eRaytracingMode::Lambertian) != eRaytracingMode::None)
                    {
                        if (hitResult.GeometryOrNull->Material == eMaterial::SimpleDiffuse)
                        {
                            // Calculate Lambertian reflectance
                            const float lambertian = std::max(0.0f, dot(indirectRay.Direction, hitResult.TriangleOrNull->Normal));
                            indirectColor *= lambertian; // Add light color
                        }
                    }
                    intensity += indirectColor; // Add indirect illumination color
                }
            }

            color = intensity * hitResult.GeometryOrNull->Color; // Use the geometry color
        }
    }

    return color;
}

Color onMiss([[maybe_unused]] const Ray& ray)
{
    // Handle the miss event
    // For example, you could return a background color
    return COLOR_WHITE; // Background color
}

Color traceRay(HitResult& outHitResult, const Ray& ray, const std::vector<Geometry>& geometries, RenderContext& context)
{
    ++context.TraceDepth;

    if (context.MaxTraceDepth < context.TraceDepth)
    {
        return COLOR_BLACK;
    }

    outHitResult = getClosestHitGeometry(ray, geometries);
    if(outHitResult.GeometryOrNull)
    {
        Color color = onClosestHit(ray, outHitResult, context);
        return color;
    }
    return onMiss(ray);
}

namespace bilateral_filter
{
    RT_FORCE_INLINE float gaussianKernel(const float distance, const float sigma)
    {
        return expf(-(distance * distance) / (2.0f * sigma * sigma));
    }
}

template<ePixelProcessingMode MODE>
void processPixel(const uint32_t x, const uint32_t y, RenderContext& context)
{
    context.TraceDepth = 0;

    Color& color = sPixels->GetPixel(x, y);
    if constexpr (MODE == ePixelProcessingMode::Initialize)
    {        
        sRays->GetPixel(x, y).Origin = CAMERA.Position;
        const float2 pixelSize = {
			CAMERA.Width / static_cast<float>(context.Width),
			CAMERA.Height / static_cast<float>(context.Height)
		};
		const float3 focalLeftBottom = CAMERA.Position + (context.CameraForward * CAMERA.FocalLength) -
			(context.CameraRight * CAMERA.Width / 2.0f) -
			(context.CameraUp * CAMERA.Height / 2.0f);

        const float3 focalRightTop = CAMERA.Position + (context.CameraForward * CAMERA.FocalLength) +
            (context.CameraRight * CAMERA.Width / 2.0f) +
            (context.CameraUp * CAMERA.Height / 2.0f);

        const float3 pixelPosition = lerp(
            focalLeftBottom,
            focalRightTop,
            float3((static_cast<float>(x) + 0.5f) / static_cast<float>(context.Width), (static_cast<float>(y) + 0.5f) / static_cast<float>(context.Height), 0.5f)
        );

        sRays->GetPixel(x, y).Direction = (pixelPosition - CAMERA.Position).normalize();
    }
    else if constexpr (MODE == ePixelProcessingMode::Clear)
    {
        color.X = 0.0f; // Red
        color.Y = 0.0f; // Green
        color.Z = 0.0f; // Blue
        if constexpr (CHANNELS_COUNT == 4)
        {
            color.W = 1.0f; // Alpha
        }
    }
    else if constexpr (MODE == ePixelProcessingMode::Render)
    {
        Ray& ray = sRays->GetPixel(x, y);

        std::vector<float2> jitters(context.NumSamples);
        for (uint32_t sampleIndex = 0; sampleIndex < context.NumSamples; ++sampleIndex)
        {
            if ((context.Mode & eRaytracingMode::Jitter) != eRaytracingMode::None)
            {
                const float2 pixelSize = {
                    CAMERA.Width / static_cast<float>(context.Width),
                    CAMERA.Height / static_cast<float>(context.Height)
                };
                const float3 focalLeftBottom = CAMERA.Position + (context.CameraForward * CAMERA.FocalLength) -
                    (context.CameraRight * CAMERA.Width / 2.0f) -
                    (context.CameraUp * CAMERA.Height / 2.0f);

                const float3 focalRightTop = CAMERA.Position + (context.CameraForward * CAMERA.FocalLength) +
                    (context.CameraRight * CAMERA.Width / 2.0f) +
                    (context.CameraUp * CAMERA.Height / 2.0f);

                jitters[sampleIndex] = {
                    UniformRandomGenerator::GetRandomNumber(),
                    UniformRandomGenerator::GetRandomNumber()
                };

                for(uint32_t jitterIndex = 0; jitterIndex < context.NumSamples; ++jitterIndex)
                {
                    if(jitterIndex == sampleIndex)
                    {
                        continue;
                    }

                    if(jitters[sampleIndex].X == jitters[jitterIndex].X &&
                       jitters[sampleIndex].Y == jitters[jitterIndex].Y)
                    {
                        jitters[sampleIndex] = {
                            UniformRandomGenerator::GetRandomNumber(),
                            UniformRandomGenerator::GetRandomNumber()
                        };
                        jitterIndex = 0; // Restart the loop to check against all other jitters
                    }
                }

                const float3 pixelPosition = lerp(
                    focalLeftBottom,
                    focalRightTop,
                    float3((static_cast<float>(x) + jitters[sampleIndex].X) / static_cast<float>(context.Width), (static_cast<float>(y) + jitters[sampleIndex].Y) / static_cast<float>(context.Height), 0.5f)
                );

                ray.Direction = (pixelPosition - CAMERA.Position).normalize();
            }

            HitResult hitResult;
            color += traceRay(hitResult, ray, sGeometries, context);
        }
        // color /= static_cast<float>(context.NumSamples);
    }
    else if constexpr (MODE == ePixelProcessingMode::Denoise)
    {
        if (context.Denoiser == eDenoiser::BilateralFilter)
        {
            static constexpr uint32_t BILATERAL_FILTER_RADIUS = 4;
            static constexpr float BILATERAL_FILTER_RANGE_SIGMA = 0.05f;
            static constexpr float BILATERAL_FILTER_SPATIAL_SIGMA = static_cast<float>(BILATERAL_FILTER_RADIUS) * 0.5f;

            Color denoisedColor = COLOR_BLACK;
            float totalWeight = 0.0f;
            for(uint32_t filterY = 0; filterY < BILATERAL_FILTER_RADIUS * 2 + 1; ++filterY)
            {
                for (uint32_t filterX = 0; filterX < BILATERAL_FILTER_RADIUS * 2 + 1; ++filterX)
                {
                    const int32_t offsetX = static_cast<int32_t>(filterX) - static_cast<int32_t>(BILATERAL_FILTER_RADIUS);
                    const int32_t offsetY = static_cast<int32_t>(filterY) - static_cast<int32_t>(BILATERAL_FILTER_RADIUS);

                    const uint32_t neighborX = std::clamp(static_cast<int32_t>(x) + offsetX, 0, static_cast<int32_t>(sPixels->GetWidth() - 1));
                    const uint32_t neighborY = std::clamp(static_cast<int32_t>(y) + offsetY, 0, static_cast<int32_t>(sPixels->GetHeight() - 1));

                    Color& neighborColor = sPixels->GetPixel(neighborX, neighborY);
                    const float colorDifference = (neighborColor - color).length();
                    const float pixelDistance = distance(float3(static_cast<float>(neighborX), static_cast<float>(neighborY), 0.0f), float3(static_cast<float>(x), static_cast<float>(y), 0.0f));
                    const float rangeKernel = bilateral_filter::gaussianKernel(colorDifference, BILATERAL_FILTER_RANGE_SIGMA);
                    const float spatialKernel = bilateral_filter::gaussianKernel(pixelDistance, BILATERAL_FILTER_SPATIAL_SIGMA);
                    const float weight = rangeKernel * spatialKernel;
                    denoisedColor += neighborColor * weight;
                    totalWeight += weight;
                }
            }

            if (totalWeight > 0.0f)
            {
                denoisedColor /= totalWeight;
                color = denoisedColor;
            }
        }
    }
    else
    {
        static_assert(false, "Unsupported pixel processing mode");
    }
    
    Color8Bit& color8Bit = s8BitColors->GetPixel(x, s8BitColors->GetHeight() - 1 - y);
    color8Bit.X = static_cast<uint8_t>(color.X * 255.0f);
    color8Bit.Y = static_cast<uint8_t>(color.Y * 255.0f);
    color8Bit.Z = static_cast<uint8_t>(color.Z * 255.0f);
    if constexpr (CHANNELS_COUNT == 4)
    {
        color8Bit.W = static_cast<uint8_t>(color.W * 255.0f);
    }
}

template<ePixelProcessingMode MODE, eTextureMemoryLayout MEMORY_LAYOUT>
void traversePixels(const uint32_t frameIndex, const eRaytracingMode mode);

#if defined(RT_EMSCRIPTEN)
extern "C" EMSCRIPTEN_KEEPALIVE
#endif  // defined(RT_EMSCRIPTEN)
void initialize(const uint32_t width, const uint32_t height)
{
    if (sPixels == nullptr)
    {
        sPixels = new Texture2D<Color>(width, height);
    }
    else
    {
        sPixels->SetResolution(width, height);
    }

    if (s8BitColors == nullptr)
    {
        s8BitColors = new Texture2D<Color8Bit>(width, height);
    }
    else
    {
        s8BitColors->SetResolution(width, height);
    }

    if (sRays == nullptr)
    {
        sRays = new Texture2D<Ray>(width, height);
    }
    else
    {
        sRays->SetResolution(width, height);
    }

    traversePixels<ePixelProcessingMode::Initialize, DEFAULT_MEMORY_LAYOUT>(0, eRaytracingMode::None);
    
    // Initialize geometries only once
    sGeometries.push_back(cornell_box::FLOOR);
    sGeometries.push_back(cornell_box::LIGHT);
    sGeometries.push_back(cornell_box::CEILING);
    sGeometries.push_back(cornell_box::BACK_WALL);
    sGeometries.push_back(cornell_box::RIGHT_WALL);
    sGeometries.push_back(cornell_box::LEFT_WALL);
    sGeometries.push_back(cornell_box::SHORT_BLOCK);
    sGeometries.push_back(cornell_box::TALL_BLOCK);

    sLightGeometries.reserve(sGeometries.size());
    for (Geometry& geometry : sGeometries)
    {
        for(Triangle& triangle : geometry.Triangles)
        {
            triangle.CalculateNormal();
        }

        if (geometry.IsEmissive)
        {
            sLightGeometries.push_back(&geometry);
        }
    }
}

template<ePixelProcessingMode MODE, eTextureMemoryLayout MEMORY_LAYOUT>
void traversePixelsInner(const uint32_t frameIndex, const eRaytracingMode mode, const uint32_t minX, const uint32_t maxX, const uint32_t minY, const uint32_t maxY)
{
    RenderContext context =
    {
        .FrameIndex = frameIndex,
        .Mode = mode,
        .Width = sPixels->GetWidth(),
        .Height = sPixels->GetHeight(),
        .CameraForward = CAMERA.Direction,
        .CameraRight = cross(CAMERA.Direction, CAMERA.UpDirection).normalize(),
        .CameraUp = cross(cross(CAMERA.Direction, CAMERA.UpDirection), CAMERA.Direction).normalize(),
        .TraceDepth = 0,
        .MaxTraceDepth = (mode & eRaytracingMode::IndirectIllumination) != eRaytracingMode::None ? 2u : 1u,
        .NumSamples = 1,
    };

    if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::RowMajor)
    {
        for (uint32_t y = minY; y <= maxY; ++y)
        {
            for (uint32_t x = minX; x <= maxX; ++x)
            {
                processPixel<MODE>(x, y, context);
            }
        }
    }
    else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
    {
        for (uint32_t x = minX; x <= maxX; ++x)
        {
            for (uint32_t y = minY; y <= maxY; ++y)
            {
                processPixel<MODE>(x, y, context);
            }
        }
    }
}

template<ePixelProcessingMode MODE, eTextureMemoryLayout MEMORY_LAYOUT>
void traversePixels(const uint32_t frameIndex, const eRaytracingMode mode)
{
#if defined(RT_EMSCRIPTEN)
    traversePixelsInner<MODE, MEMORY_LAYOUT>(
        frameIndex,
        mode,
        0,
        sPixels->GetWidth() - 1,
        0,
        sPixels->GetHeight() - 1
    );
#else   // NOT defined(RT_EMSCRIPTEN)
    static constexpr uint32_t THREADS_WIDTH = 4;
    static constexpr uint32_t THREADS_HEIGHT = 4;

    std::vector<std::thread> threads;
    threads.reserve(THREADS_WIDTH * THREADS_HEIGHT);

    for (uint32_t y = 0; y < THREADS_HEIGHT; ++y)
    {
        for (uint32_t x = 0; x < THREADS_WIDTH; ++x)
        {
            threads.push_back(std::thread(
                traversePixelsInner<MODE, MEMORY_LAYOUT>,
                frameIndex,
                mode,
                x * (sPixels->GetWidth() / THREADS_WIDTH),
                std::min((x + 1) * (sPixels->GetWidth() / THREADS_WIDTH) - 1, sPixels->GetWidth() - 1),
                y * (sPixels->GetHeight() / THREADS_HEIGHT),
                std::min((y + 1) * (sPixels->GetHeight() / THREADS_HEIGHT) - 1, sPixels->GetHeight() - 1)
            ));
        }
    }
    
    uint32_t joinCount = 0;
    while (joinCount < threads.size())
    {
        for (auto& thread : threads)
        {
            if (thread.joinable())
            {
                thread.join();
                ++joinCount;
            }
        }
    }
#endif  // NOT defined(RT_EMSCRIPTEN)
}

#if defined(RT_EMSCRIPTEN)
extern "C" EMSCRIPTEN_KEEPALIVE
#endif  // defined(RT_EMSCRIPTEN)
void render_frame([[maybe_unused]] const uint32_t frameIndex, const uint32_t modeIndex)
{
    assert(sPixels != nullptr && "Display buffer is not initialized");
    if (sPixels == nullptr)
    {
        std::cerr << "Display buffer is not initialized!" << std::endl;
        return;
    }
    assert(sRays != nullptr && "Rays buffer is not initialized");
    if (sRays == nullptr)
    {
        std::cerr << "Rays buffer is not initialized!" << std::endl;
        return;
    }
    assert(s8BitColors != nullptr && "8-bit colors buffer is not initialized");
    if (s8BitColors == nullptr)
    {
        std::cerr << "8-bit colors buffer is not initialized!" << std::endl;
        return;
    }
    const eRaytracingMode mode = static_cast<const eRaytracingMode>(modeIndex);

    // Clear the pixel buffer
    traversePixels<ePixelProcessingMode::Clear, DEFAULT_MEMORY_LAYOUT>(frameIndex, mode);
    traversePixels<ePixelProcessingMode::Render, DEFAULT_MEMORY_LAYOUT>(frameIndex, mode);
    traversePixels<ePixelProcessingMode::Denoise, DEFAULT_MEMORY_LAYOUT>(frameIndex, mode);
}


#if defined(RT_EMSCRIPTEN)
extern "C" EMSCRIPTEN_KEEPALIVE
#endif  // defined(RT_EMSCRIPTEN)
uint8_t* get_display_buffer()
{
    assert(s8BitColors != nullptr && "Display buffer is not initialized");
    if (s8BitColors == nullptr)
    {
        std::cerr << "Display buffer is not initialized!" << std::endl;
        return nullptr;
    }
    return reinterpret_cast<uint8_t*>(s8BitColors->GetData());
}

#if !defined(RT_EMSCRIPTEN)
int main()
{
    initialize(720, 720); // Initialize with a default resolution
    get_display_buffer(); // Call to ensure the display buffer is ready

    uint32_t frameIndex = 0;
    // while(true)
    {
        render_frame(frameIndex, static_cast<uint32_t>(eRaytracingMode::IndirectDiffuse | eRaytracingMode::Denoise));
        ++frameIndex;
    }

    stbi_write_png
    (
        "example_cpu.png",
        static_cast<int>(s8BitColors->GetWidth()),
        static_cast<int>(s8BitColors->GetHeight()),
        static_cast<int>(CHANNELS_COUNT),
        s8BitColors->GetData(),
        static_cast<int>(s8BitColors->GetWidth() * static_cast<int>(CHANNELS_COUNT))
    );

    return 0;
}
#endif  // NOT defined(RT_EMSCRIPTEN)