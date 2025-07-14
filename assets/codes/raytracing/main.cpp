#include <algorithm>
#include <iostream>
#include <vector>

#include <emscripten/emscripten.h>

#include "math.h"

using namespace raytracing;

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
    RT_FORCE_INLINE constexpr Texture2D(const uint32_t width, const uint32_t height) : mWidth(width), mHeight(height), mData(width * height * CHANNELS_COUNT) {}
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
            return mData[(y * mWidth + x) * CHANNELS_COUNT];
        }
        else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
        {
            return mData[(x * mHeight + y) * CHANNELS_COUNT];
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
            return mData[(y * mWidth + x) * CHANNELS_COUNT];
        }
        else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
        {
            return mData[(x * mHeight + y) * CHANNELS_COUNT];
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
        mData.resize(mWidth * mHeight * CHANNELS_COUNT);
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
        : mWidth(width), mHeight(height), mDepth(depth), mData(width * height * depth * CHANNELS_COUNT) {}
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
            return mData[(z * mWidth * mHeight + y * mWidth + x) * CHANNELS_COUNT];
        }
        else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
        {
            return mData[(x * mHeight * mDepth + y * mDepth + z) * CHANNELS_COUNT];
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
            return mData[(z * mWidth * mHeight + y * mWidth + x) * CHANNELS_COUNT];
        }
        else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
        {
            return mData[(x * mHeight * mDepth + y * mDepth + z) * CHANNELS_COUNT];
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
        mData.resize(mWidth * mHeight * mDepth * CHANNELS_COUNT);
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

using Color = float4;
using Color8Bit = Vector4<uint8_t>;

static Texture2D<Color>* sPixels = nullptr;
static Texture2D<Color8Bit>* s8BitColors = nullptr;
static Texture2D<Ray>* sRays = nullptr;

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

template<eTextureMemoryLayout MEMORY_LAYOUT = DEFAULT_MEMORY_LAYOUT>
void initialize(Texture2D<Ray, MEMORY_LAYOUT>& rays)
{
    const uint32_t width = rays.GetWidth();
    const uint32_t height = rays.GetHeight();

    const float3& cameraForward = CAMERA.Direction.normalize();
    const float3 cameraRight = cameraForward.cross(CAMERA.UpDirection).normalize();
    const float3 cameraUp = cameraForward.cross(cameraRight).normalize();

    if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::RowMajor)
    {
        for (uint32_t y = 0; y < height; ++y)
        {
            for (uint32_t x = 0; x < width; ++x)
            {
                rays.GetPixel(x, y)->Origin = CAMERA.Position;
                const float3 pixelPosition = CAMERA.Position + 
                    (cameraRight * ((x - width / 2.0f) * CAMERA.Width / width)) +
                    (cameraUp * ((y - height / 2.0f) * CAMERA.Height / height)) +
                    (cameraForward * CAMERA.FocalLength);
                rays.GetPixel(x, y)->Direction = pixelPosition - CAMERA.Position;
            }
        }
    }
    else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
    {
        for (uint32_t x = 0; x < width; ++x)
        {
            for (uint32_t y = 0; y < height; ++y)
            {
                rays.GetPixel(x, y)->Origin = CAMERA.Position;
                const float3 pixelPosition = CAMERA.Position + 
                    (cameraRight * ((x - width / 2.0f) * CAMERA.Width / width)) +
                    (cameraUp * ((y - height / 2.0f) * CAMERA.Height / height)) +
                    (cameraForward * CAMERA.FocalLength);
                rays.GetPixel(x, y)->Direction = pixelPosition - CAMERA.Position;
            }
        }
    }
}

struct Geometry
{
    std::array<Triangle, 2> Triangles;
    Color Color;
};

static constexpr Color COLOR_WHITE = {1.0f, 1.0f, 1.0f, 1.0f};
[[maybe_unused]] static constexpr Geometry FLOOR = {
    .Triangles = {
        Triangle({0.0f, 0.0f, 0.0f}, {559.2f, 0.0f, 0.0f}, {559.2f, 0.0f, 552.8f}),
        Triangle({0.0f, 0.0f, 0.0f}, {559.2f, 0.0f, 552.8f}, {0.0f, 0.0f, 552.8f})
    },
    .Color = COLOR_WHITE,
};

enum class ePixelProcessingMode
{
    Clear,
    Render,
};

template<ePixelProcessingMode MODE>
void processPixel(const uint32_t x, const uint32_t y)
{
    Color& color = sPixels->GetPixel(x, y);
    if constexpr (MODE == ePixelProcessingMode::Clear)
    {
        color.X = 0.0f; // Red
        color.Y = 0.0f; // Green
        color.Z = 0.0f; // Blue
        color.W = 1.0f; // Alpha
    }
    else if constexpr (MODE == ePixelProcessingMode::Render)
    {
        [[maybe_unused]] Ray& ray = sRays->GetPixel(x, y);
        // Here you would typically perform ray tracing logic, such as checking for intersections with geometry
        // For now, we will just print the ray origin and direction
        
        color.X = 0.0f; // Red
        color.Y = 0.0f; // Green
        color.Z = 0.0f; // Blue
        color.W = 1.0f; // Alpha
    }
    else
    {
        static_assert(false, "Unsupported pixel processing mode");
    }
    
    Color8Bit& color8Bit = s8BitColors->GetPixel(x, y);
    color8Bit.X = static_cast<uint8_t>(color.X * 255.0f);
    color8Bit.Y = static_cast<uint8_t>(color.Y * 255.0f);
    color8Bit.Z = static_cast<uint8_t>(color.Z * 255.0f);
    color8Bit.W = static_cast<uint8_t>(color.W * 255.0f);
}

template<ePixelProcessingMode MODE, eTextureMemoryLayout MEMORY_LAYOUT = DEFAULT_MEMORY_LAYOUT>
void traversePixels();

void clear_display_buffers()
{
    
}

extern "C" EMSCRIPTEN_KEEPALIVE
void set_resolution(const uint32_t width, const uint32_t height)
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
}

template<ePixelProcessingMode MODE, eTextureMemoryLayout MEMORY_LAYOUT>
void traversePixels()
{
    if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::RowMajor)
    {
        for (uint32_t y = 0; y < sPixels->GetHeight(); ++y)
        {
            for (uint32_t x = 0; x < sPixels->GetWidth(); ++x)
            {
                processPixel<MODE>(x, y);
            }
        }
    }
    else if constexpr (MEMORY_LAYOUT == eTextureMemoryLayout::ColumnMajor)
    {
        for (uint32_t x = 0; x < sPixels->GetWidth(); ++x)
        {
            for (uint32_t y = 0; y < sPixels->GetHeight(); ++y)
            {
                processPixel<MODE>(x, y);
            }
        }
    }
}

extern "C" EMSCRIPTEN_KEEPALIVE
void render_frame([[maybe_unused]] const uint32_t frameIndex)
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

    // Clear the pixel buffer
    traversePixels<ePixelProcessingMode::Clear, DEFAULT_MEMORY_LAYOUT>();
    traversePixels<ePixelProcessingMode::Render, DEFAULT_MEMORY_LAYOUT>();
}

extern "C" EMSCRIPTEN_KEEPALIVE
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