#!/usr/bin/env bash
# Compile raytracer to WebAssembly using Emscripten.
#
# Set EMSDK_PATH to your Emscripten SDK directory (the folder containing
# the `emsdk` script). If not set, the script assumes it is located in
# `../../externals/emsdk` relative to this file.

EMSDK_PATH="${EMSDK_PATH:-../../externals/emsdk}"

"$EMSDK_PATH/emsdk" activate latest
source "$EMSDK_PATH/emsdk_env.sh"

emcc main.cpp -o main.js -std=c++20 -Wall -Wextra -Werror -Wpedantic -Wconversion -Wshadow -s WASM=1 \
    -g \
    -s EXPORTED_FUNCTIONS="['_initialize', '_decode', '_malloc', '_free']" \
    -s EXPORTED_RUNTIME_METHODS="['cwrap', 'getValue', 'HEAPU8', 'UTF8ToString']" \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="performanceAwareProgramming"  \
    -s ALLOW_MEMORY_GROWTH=1
