#include <iostream>

#include <emscripten/emscripten.h>

#include "math.h"

static uint32_t sWidth = 1280;
static uint32_t sHeight = 720;
static uint8_t* sPixels = nullptr;

void clear_display_buffer();
void initialize_display_buffer();

extern "C" EMSCRIPTEN_KEEPALIVE
void set_resolution(const uint32_t width, const uint32_t height)
{
    sWidth = width;
    sHeight = height;

    if(sPixels != nullptr)
    {
        delete[] sPixels;
        sPixels = nullptr;
    }

    initialize_display_buffer();
}

void clear_display_buffer()
{
    if(sPixels != nullptr)
    {
        std::memset(sPixels, 0, sWidth * sHeight * 4);
    }
}

void initialize_display_buffer()
{
    if(sPixels == nullptr)
    {
        sPixels = new uint8_t[sWidth * sHeight * 4];
    }
}

extern "C" EMSCRIPTEN_KEEPALIVE
void render_frame()
{
    initialize_display_buffer();

    // Clear the pixel buffer
    clear_display_buffer();

    // Example rendering logic (fill with a solid color)
    for (uint32_t y = 0; y < sHeight; ++y)
    {
        for(uint32_t x = 0; x < sWidth; ++x)
        {
            uint32_t index = (y * sWidth + x) * 4;
            sPixels[index] = 255;     // Red
            sPixels[index + 1] = 0;   // Green
            sPixels[index + 2] = 0;   // Blue
            sPixels[index + 3] = 255; // Alpha
        }
    }
}

extern "C" EMSCRIPTEN_KEEPALIVE
uint8_t* get_display_buffer()
{
    initialize_display_buffer();
    return sPixels;
}