import { fileToImage, makeCanvas, drawCover, drawContain, canvasToBlob } from './core';

export const fileToImageLocal = fileToImage;

export interface ResizeOptions {
  width: number;
  height: number;
  /** "cover" fills and crops, "contain" fits within and pads. */
  fit?: 'cover' | 'contain' | 'stretch';
  /** background color when fitting "contain" (default transparent). */
  background?: string;
  type?: string;
  quality?: number;
}

export async function resizeImage(file: File, opts: ResizeOptions): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(opts.width, opts.height);
  const ctx = canvas.getContext('2d')!;
  if (opts.background && opts.fit === 'contain') {
    ctx.fillStyle = opts.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (opts.fit === 'cover') {
    drawCover(ctx, img, img.width, img.height, canvas.width, canvas.height);
  } else if (opts.fit === 'contain') {
    drawContain(ctx, img, img.width, img.height, canvas.width, canvas.height);
  } else {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  return canvasToBlob(canvas, { type: opts.type ?? 'image/png', quality: opts.quality ?? 0.92 });
}

export function pxToPhysical(px: number, dpi: number, unit: 'in' | 'cm' | 'mm') {
  const inches = px / dpi;
  if (unit === 'in') return inches;
  if (unit === 'cm') return inches * 2.54;
  return inches * 25.4;
}

export function physicalToPx(val: number, unit: 'in' | 'cm' | 'mm', dpi: number) {
  const inches = unit === 'in' ? val : unit === 'cm' ? val / 2.54 : val / 25.4;
  return Math.round(inches * dpi);
}
