import { mat4, vec3 } from 'gl-matrix';
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

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

async function main() {
    const { device, context, swapChainFormat } = await initWebGPU();
    const pipeline = await createPipeline(device, swapChainFormat);

    function frame() {
        render(device, context, pipeline);
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

main();

serve((req) => {
    const body = new TextEncoder().encode("Hello from Deno!");
    return new Response(body, { status: 200 });
});

new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    },
    mounted() {
        main();
    }
});
