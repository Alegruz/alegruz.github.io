#include <iostream>

#include <emscripten/emscripten.h>

#include "math.h"

static constexpr uint32_t MAX_WIDTH = 1920;
static constexpr uint32_t MAX_HEIGHT = 1080;
static constexpr uint32_t CHANNELS_COUNT = 4; // RGBA
static constexpr uint32_t NUM_COLORS = 256;
static uint32_t sWidth = 1280;
static uint32_t sHeight = 720;
static uint8_t sPixels[MAX_WIDTH * MAX_HEIGHT * CHANNELS_COUNT];

void clear_display_buffer();

extern "C" EMSCRIPTEN_KEEPALIVE
void set_resolution(const uint32_t width, const uint32_t height)
{
    sWidth = std::clamp(width, 1u, MAX_WIDTH);
    sHeight = std::clamp(height, 1u, MAX_HEIGHT);
}

void clear_display_buffer()
{
    std::memset(sPixels, 0, sWidth * sHeight * CHANNELS_COUNT);
}

extern "C" EMSCRIPTEN_KEEPALIVE
void render_frame(const uint32_t frameIndex)
{
    // Clear the pixel buffer
    clear_display_buffer();

    // Example rendering logic (fill with a solid color)
    for (uint32_t y = 0; y < sHeight; ++y)
    {
        for(uint32_t x = 0; x < sWidth; ++x)
        {
            uint32_t index = (y * sWidth + x) * CHANNELS_COUNT;
            sPixels[index] = NUM_COLORS - 1 - (frameIndex % (NUM_COLORS - 1));     // Red
            sPixels[index + 1] = 0;   // Green
            sPixels[index + 2] = 0;   // Blue
            sPixels[index + 3] = (NUM_COLORS - 1); // Alpha
        }
    }
}

extern "C" EMSCRIPTEN_KEEPALIVE
uint8_t* get_display_buffer()
{
    return sPixels;
}