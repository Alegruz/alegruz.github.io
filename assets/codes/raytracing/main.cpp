#define _CRT_SECURE_NO_WARNINGS
#include "common.h"
#include <algorithm>
#include <iostream>
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
static constexpr raytracing::Color COLOR_RED = {1.0f, 0.0f, 0.0f, 1.0f};
static constexpr raytracing::Color COLOR_GREEN = {0.0f, 1.0f, 0.0f, 1.0f};

struct Geometry final
{
    std::vector<Triangle> Triangles;
    Color Color = COLOR_WHITE;
    bool IsEmissive = false;
};

static Texture2D<Color>* sPixels = nullptr;
static Texture2D<Color8Bit>* s8BitColors = nullptr;
static Texture2D<Ray>* sRays = nullptr;
static std::vector<Geometry> sGeometries;

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
        .Triangles =
        {
            Triangle(float3(0.0f, 0.0f, 0.0f), float3(559.2f, 0.0f, 0.0f), float3(559.2f, 0.0f, 552.8f)),
            Triangle(float3(0.0f, 0.0f, 0.0f), float3(559.2f, 0.0f, 552.8f), float3(0.0f, 0.0f, 552.8f))
        },
        .Color = COLOR_WHITE,
    };
    static Geometry LIGHT =
    {
        .Triangles =
        {
            Triangle(float3(343.0f, 548.8f, 227.0f), float3(343.0f, 548.8f, 332.0f), float3(213.0f, 548.8f, 332.0f)),
            Triangle(float3(213.0f, 548.8f, 227.0f), float3(343.0f, 548.8f, 227.0f), float3(213.0f, 548.8f, 332.0f))
        },
        .Color = COLOR_WHITE,
        .IsEmissive = true
    };
    static Geometry CEILING =
    {
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
        .Triangles =
        {
            Triangle(float3(549.6f, 0.0f, 559.2f), float3(0.0f, 0.0f, 559.2f), float3(0.0f, 548.8f, 559.2f)),
            Triangle(float3(549.6f, 0.0f, 559.2f), float3(0.0f, 548.8f, 559.2f), float3(556.0f, 548.8f, 559.2f))
        },
        .Color = COLOR_WHITE
    };
    static Geometry RIGHT_WALL =
    {
        .Triangles =
        {
            Triangle(float3(0.0f, 0.0f, 559.2f), float3(0.0f, 0.0f, 0.0f), float3(0.0f, 548.8f, 0.0f)),
            Triangle(float3(0.0f, 0.0f, 559.2f), float3(0.0f, 548.8f, 0.0f), float3(0.0f, 548.8f, 559.2f))
        },
        .Color = COLOR_GREEN
    };
    static Geometry LEFT_WALL =
    {
        .Triangles =
        {
            Triangle(float3(552.8f, 0.0f, 0.0f), float3(549.6f, 0.0f, 559.2f), float3(556.0f, 548.8f, 559.2f)),
            Triangle(float3(556.0f, 548.8f, 0.0f), float3(552.8f, 0.0f, 0.0f), float3(556.0f, 548.8f, 559.2f))
        },
        .Color = COLOR_RED
    };
    static Geometry SHORT_BLOCK =
    {
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

enum class ePixelProcessingMode
{
    Initialize,
    Clear,
    Render,
};

enum class eRaytracingMode
{
    OnlyIntersection,
    OnlyIntersectionWithJitter,
    Count,
};

struct RenderContext
{
    uint32_t FrameIndex;
    eRaytracingMode Mode;
    uint32_t Width;
    uint32_t Height;
    const float3& CameraForward;
    const float3 CameraRight;
    const float3 CameraUp;
};

template<ePixelProcessingMode MODE>
void processPixel(const uint32_t x, const uint32_t y, [[maybe_unused]] const RenderContext& context)
{
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

        if (context.Mode == eRaytracingMode::OnlyIntersectionWithJitter)
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

            const float2 jitter = {
                UniformRandomGenerator::GetRandomNumber(),
                UniformRandomGenerator::GetRandomNumber()
            };

            const float3 pixelPosition = lerp(
                focalLeftBottom,
                focalRightTop,
                float3((static_cast<float>(x) + jitter.X) / static_cast<float>(context.Width), (static_cast<float>(y) + jitter.Y) / static_cast<float>(context.Height), 0.5f)
            );

            ray.Direction = (pixelPosition - CAMERA.Position).normalize();
        }

        // Here you would typically perform ray tracing logic, such as checking for intersections with geometry
        // For now, we will just print the ray origin and direction

        for(const Geometry& geometry : sGeometries)
        {
            for (const Triangle& triangle : geometry.Triangles)
            {
                float intersectionDistance = 0.0f;
                std::optional<float3> intersectionPoint = IntersectionChecker::Intersects(ray, triangle, intersectionDistance);
                if (intersectionPoint.has_value())
                {
                    // If an intersection is found, set the color based on the geometry
                    color.X = geometry.Color.X;
                    color.Y = geometry.Color.Y;
                    color.Z = geometry.Color.Z;
                    if constexpr (CHANNELS_COUNT == 4)
                    {
                        color.W = geometry.Color.W;
                    }
                    goto triangles_traversal_end; // Exit the loop early if an intersection is found
                }
            }
        }
        triangles_traversal_end:
        ;
    }
    else
    {
        static_assert(false, "Unsupported pixel processing mode");
    }
    
    Color8Bit& color8Bit = s8BitColors->GetPixel(x, y);
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

    traversePixels<ePixelProcessingMode::Initialize, DEFAULT_MEMORY_LAYOUT>(0, eRaytracingMode::OnlyIntersection);
}

template<ePixelProcessingMode MODE, eTextureMemoryLayout MEMORY_LAYOUT>
void traversePixels(const uint32_t frameIndex, const eRaytracingMode mode)
{
    const RenderContext context =
    {
        .FrameIndex = frameIndex,
        .Mode = mode,
        .Width = sPixels->GetWidth(),
        .Height = sPixels->GetHeight(),
        .CameraForward = CAMERA.Direction,
        .CameraRight = cross(CAMERA.Direction, CAMERA.UpDirection).normalize(),
        .CameraUp = cross(cross(CAMERA.Direction, CAMERA.UpDirection), CAMERA.Direction).normalize()
    };
    
    if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::RowMajor)
    {
        for (uint32_t y = 0; y < sPixels->GetHeight(); ++y)
        {
            for (uint32_t x = 0; x < sPixels->GetWidth(); ++x)
            {
                processPixel<MODE>(x, y, context);
            }
        }
    }
    else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
    {
        for (uint32_t x = 0; x < sPixels->GetWidth(); ++x)
        {
            for (uint32_t y = 0; y < sPixels->GetHeight(); ++y)
            {
                processPixel<MODE>(x, y, context);
            }
        }
    }
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
    assert(mode < eRaytracingMode::Count && "Invalid raytracing mode");
    if (mode >= eRaytracingMode::Count)
    {
        std::cerr << "Invalid raytracing mode" << std::endl;
        return;
    }

    if(sGeometries.empty() == true)
    {
        // Initialize geometries only once
        sGeometries.push_back(cornell_box::FLOOR);
        sGeometries.push_back(cornell_box::LIGHT);
        sGeometries.push_back(cornell_box::CEILING);
        sGeometries.push_back(cornell_box::BACK_WALL);
        sGeometries.push_back(cornell_box::RIGHT_WALL);
        sGeometries.push_back(cornell_box::LEFT_WALL);
        sGeometries.push_back(cornell_box::SHORT_BLOCK);
        sGeometries.push_back(cornell_box::TALL_BLOCK);
    }

    // Clear the pixel buffer
    traversePixels<ePixelProcessingMode::Clear, DEFAULT_MEMORY_LAYOUT>(frameIndex, mode);
    traversePixels<ePixelProcessingMode::Render, DEFAULT_MEMORY_LAYOUT>(frameIndex, mode);
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
    initialize(1280, 720); // Initialize with a default resolution
    get_display_buffer(); // Call to ensure the display buffer is ready

    uint32_t frameIndex = 0;
    // while(true)
    {
        render_frame(frameIndex, static_cast<uint32_t>(eRaytracingMode::OnlyIntersection));
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