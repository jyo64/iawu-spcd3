import { canvasEl } from "./globals";

let device: GPUDevice;

export async function initCanvasWebGPU() {
  if (!navigator.gpu) {
    throw new Error("WebGPU not supported.");
  }
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("GPU adapter unavailable.");
  }
  device = await adapter.requestDevice();
}

export function redrawWebGPULines(dataset: any[], parcoords: any) {
  if (!device) throw new Error("GPU device is not initialized. Call initCanvasWebGPU first.");

  const context = canvasEl.getContext("webgpu");
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
    }],
  });
  pass.end();

  device.queue.submit([encoder.finish()]);
}
