@echo off
REM Compile raytracer to WebAssembly using Emscripten.
REM
REM Set EMSDK_PATH to the folder containing emsdk.bat before running this script.
REM If not defined, it defaults to ..\..\externals\emsdk relative to this file.

if "%EMSDK_PATH%"=="" set "EMSDK_PATH=..\..\externals\emsdk"

call "%EMSDK_PATH%\emsdk.bat" activate latest --permanent
call "%EMSDK_PATH%\emsdk_env.bat"

echo ========================
echo = Compiling main.cpp... =
echo ========================

emcc main.cpp -o main.js -std=c++20 -Wall -Wextra -Werror -Wpedantic -Wconversion -Wshadow -s WASM=1 ^
    -g ^
    -s EXPORTED_FUNCTIONS="['_initialize', '_decode', '_malloc', '_free']" ^
    -s EXPORTED_RUNTIME_METHODS="['cwrap', 'getValue', 'HEAPU8', 'UTF8ToString']" ^
    -s MODULARIZE=1 ^
    -s EXPORT_NAME="performanceAwareProgramming"  ^
    -s ALLOW_MEMORY_GROWTH=1

echo Done.
pause
