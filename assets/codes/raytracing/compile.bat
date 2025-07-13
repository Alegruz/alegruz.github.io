@echo off
REM === Activate Emscripten SDK (only needed once) ===
call ..\..\externals\emsdk\emsdk.bat activate latest --permanent

echo ========================
echo = Compiling main.cpp... =
echo ========================

emcc main.cpp -o main.js -std=c++20 -O2 -Wall -Wextra -Werror -Wpedantic -Wconversion -Wshadow -s WASM=1    ^
    -s EXPORTED_FUNCTIONS="['_render_frame', '_get_display_buffer', '_set_resolution']" ^
    -s EXPORTED_RUNTIME_METHODS="['cwrap', 'getValue']" ^
    -s MODULARIZE=1 ^
    -s EXPORT_NAME="createRaytracerModule"  ^
    -s ALLOW_MEMORY_GROWTH=1

echo Done.
pause