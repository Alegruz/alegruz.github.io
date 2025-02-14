---
layout: page
title: Works
permalink: /works/
---

<!doctype html>

<html>
    <head>
        <meta charset="utf-8">
        <title>WebGPU Life</title>
    </head>
    <body>
        <canvas width="512" height="512"></canvas>
        <script type="module">
            const canvas = document.querySelector("canvas");

            // Your WebGPU code will begin here!
            if (!navigator.gpu) {
                throw new Error("WebGPU not supported on this browser.");
            }
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                throw new Error("No appropriate GPUAdapter found.");
            }
            const device = await adapter.requestDevice();
            const context = canvas.getContext("webgpu");
            const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
            context.configure({
                device: device,
                format: canvasFormat,
            });
            const encoder = device.createCommandEncoder();
            const pass = encoder.beginRenderPass({
                colorAttachments: [{
                    view: context.getCurrentTexture().createView(),
                    loadOp: "clear",
                    storeOp: "store",
                }]
            });
            pass.end();

            const commandBuffer = encoder.finish();
            device.queue.submit([commandBuffer]);
            // Finish the command buffer and immediately submit it.
            device.queue.submit([encoder.finish()]);
        </script>
    </body>
</html>
