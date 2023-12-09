import { makeCanvas, preloadHtmlImage } from '@alxcube/lens';

export async function loadImageFile(file: Blob): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file);
  const img = await preloadHtmlImage(url);
  const canvas = makeCanvas(img.width, img.height, true);
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error("Couldn't get canvas context");
  }
  context.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);
  return canvas;
}
