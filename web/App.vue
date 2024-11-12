<template>
  <div id="app">
    <canvas id="webgpu-canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.initWebGPU();
  },
  methods: {
    async initWebGPU() {
      if (!navigator.gpu) {
        throw new Error('WebGPU is not supported by your browser.');
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error('Failed to get GPU adapter.');
      }

      const device = await adapter.requestDevice();
      const canvas = this.$el.querySelector('#webgpu-canvas');
      const context = canvas.getContext('webgpu');

      const swapChainFormat = 'bgra8unorm';
      context.configure({
        device,
        format: swapChainFormat,
      });

      const pipeline = await this.createPipeline(device, swapChainFormat);
      this.render(device, context, pipeline);
    },
    async createPipeline(device, swapChainFormat) {
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
    },
    render(device, context, pipeline) {
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
  }
};
</script>

<style>
#webgpu-canvas {
  width: 100%;
  height: 100%;
}
</style>
