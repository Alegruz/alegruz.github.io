---
layout: post
title:  Study Notes on Performance-Aware Programming
date:   2025-07-22 19:00:00 +0900
categories: graphics
lang: "en"
---

<div id="instruction-decoding-on-the-8086" style="text-align: center; margin: 20px 0;">
  <p>Instruction Decoding on the 8086</p>
  <input type="file" id="fileInput" accept=".bin" style="margin: 10px;">
  <textarea id="stringInput" placeholder="Or paste hex string here" rows="3" style="width: 80%; margin: 10px;"></textarea>
  <button id="decodeBtn">Decode</button>
  <pre id="output" style="margin-top: 20px; background: #f5f5f5; padding: 10px; text-align: left;"></pre>
</div>
<script src="{{ '/assets/codes/performance_aware_programming/main.js' | relative_url }}"></script>
<script>
let ModuleReady = null;
performanceAwareProgramming({
  locateFile: (p) => p.endsWith('.wasm')
    ? '{{ "/assets/codes/performance_aware_programming/main.wasm" | relative_url }}'
    : p
}).then(Module => {
  ModuleReady = Module;
  document.getElementById('decodeBtn').disabled = false;
}).catch(err => {
  console.error("Failed to initialize WebAssembly module", err);
});

document.getElementById('decodeBtn').addEventListener('click', async () => {
  const output = document.getElementById('output');
  output.textContent = '';
  if (!ModuleReady) {
    output.textContent = 'Module not loaded.';
    return;
  }
  let inputData = null;
  const file = document.getElementById('fileInput').files[0];
  if (file) {
    inputData = await file.arrayBuffer();
  } else {
    const str = document.getElementById('stringInput').value.trim();
    if (str) {
      // Convert hex string to Uint8Array
      const hex = str.replace(/[^0-9a-fA-F]/g, '');
      if (hex.length % 2 !== 0) {
        output.textContent = 'Invalid hex string.';
        return;
      }
      inputData = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer;
    }
  }
  if (!inputData) {
    output.textContent = 'Please provide a file or input string.';
    return;
  }
  ModuleReady._initialize();
  // Allocate memory in WASM and call decode
  const len = inputData.byteLength;
  const ptr = ModuleReady._malloc(len);
  ModuleReady.HEAPU8.set(new Uint8Array(inputData), ptr);
  const resultPtr = ModuleReady._decode(ptr, len);
  const resultStr = ModuleReady.UTF8ToString(resultPtr);
  output.textContent = resultStr;
  ModuleReady._free(ptr);
  // If decode allocates memory for result, free it here if needed
});
</script>