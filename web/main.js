/**
 * This file contains the main JavaScript code for the application.
 * It initializes the WebGPU context, sets up the rendering pipeline, and handles the main rendering loop.
 * Additionally, it sets up a simple HTTP server using Deno and initializes a Vue.js app.
 */

import { mat4, vec3 } from 'gl-matrix';
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

/**
 * Initializes the WebGPU context and sets up the rendering pipeline.
 * @returns {Promise<{ device: GPUDevice, context: GPUCanvasContext, swapChainFormat: string }>}
 */
async function initWebGPU() {
    if (!navigator.gpu) {
        throw new Error('WebGPU is not supported by your browser.');
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error('Failed to get GPU adapter.');
    }

    const device = await adapter.requestDevice();
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('webgpu');

    const swapChainFormat = 'bgra8unorm';
    context.configure({
        device,
        format: swapChainFormat,
    });

    return { device, context, swapChainFormat };
}

/**
 * Creates a render pipeline for the WebGPU context.
 * @param {GPUDevice} device - The GPU device.
 * @param {string} swapChainFormat - The format of the swap chain.
 * @returns {Promise<GPURenderPipeline>}
 */
async function createPipeline(device, swapChainFormat) {
    const shaderModule = device.createShaderModule({
        code: `
        @vertex
        fn vs_main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {
            var pos = array<vec2<f32>, 3>(
                vec2<f32>(0.0, 0.5),
                vec2<f32>(-0.5, -0.5),
                vec2<f32>(0.5, -0.5)
            );
            return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
        }

        @fragment
        fn fs_main() -> @location(0) vec4<f32> {
            return vec4<f32>(1.0, 0.0, 0.0, 1.0);
        }
        `,
    });

    const pipeline = device.createRenderPipeline({
        vertex: {
            module: shaderModule,
            entryPoint: 'vs_main',
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fs_main',
            targets: [
                {
                    format: swapChainFormat,
                },
            ],
        },
        primitive: {
            topology: 'triangle-list',
        },
    });

    return pipeline;
}

/**
 * Renders a triangle on the canvas using the WebGPU context.
 * @param {GPUDevice} device - The GPU device.
 * @param {GPUCanvasContext} context - The WebGPU canvas context.
 * @param {GPURenderPipeline} pipeline - The render pipeline.
 */
async function render(device, context, pipeline) {
    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();
    const renderPassDescriptor = {
        colorAttachments: [
            {
                view: textureView,
                loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                storeOp: 'store',
            },
        ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.draw(3, 1, 0, 0);
    passEncoder.endPass();

    device.queue.submit([commandEncoder.finish()]);
}

/**
 * The main function that initializes WebGPU, creates the pipeline, and starts the rendering loop.
 */
async function main() {
    const { device, context, swapChainFormat } = await initWebGPU();
    const pipeline = await createPipeline(device, swapChainFormat);

    function frame() {
        render(device, context, pipeline);
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

// Initialize the main function
main();

// Set up a simple HTTP server using Deno
serve((req) => {
    const body = new TextEncoder().encode("Hello from Deno!");
    return new Response(body, { status: 200 });
});

// Initialize a Vue.js app
new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    },
    mounted() {
        main();
    }
});
