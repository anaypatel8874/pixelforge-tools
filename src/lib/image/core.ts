/**
 * Lightweight image-processing utilities.
 *
 * Most of these work fully offline on the main thread for typical sizes.
 * For heavier operations we delegate to Web Workers via `lib/image/workers.ts`.
 *
 * Every function returns a `Blob` plus a structured `ProcessResult` so the
 * UI can show "saved X KB / Y%" without re-measuring.
 */

import { uid } from '../utils';

export interface ImageBuffer {
  /** OffscreenCanvas / HTMLCanvasElement-like */
  canvas: HTMLCanvasElement | OffscreenCanvas;
  width: number;
  height: number;
}

export async function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode image. The file may be corrupt or in an unsupported format.'));
    };
    img.src = url;
  });
}

export function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.floor(w));
  c.height = Math.max(1, Math.floor(h));
  return c;
}

export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  imgW: number,
  imgH: number,
  dstW: number,
  dstH: number
) {
  const sR = Math.max(dstW / imgW, dstH / imgH);
  const dw = imgW * sR;
  const dh = imgH * sR;
  const dx = (dstW - dw) / 2;
  const dy = (dstH - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

export function drawContain(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  imgW: number,
  imgH: number,
  dstW: number,
  dstH: number
) {
  const sR = Math.min(dstW / imgW, dstH / imgH);
  const dw = imgW * sR;
  const dh = imgH * sR;
  const dx = (dstW - dw) / 2;
  const dy = (dstH - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

export interface ExportOptions {
  type?: string;
  quality?: number;
  filename?: string;
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  options: ExportOptions = {}
): Promise<Blob> {
  const { type = 'image/png', quality = 0.92 } = options;
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Browser could not encode the image as ${type}.`));
        } else {
          resolve(blob);
        }
      },
      type,
      quality
    );
  });
}

export function suggestFilename(name: string, suffix: string, ext: string): string {
  const base = name.replace(/\.[^.]+$/, '') || 'image';
  const cleaned = base.replace(/[^a-z0-9_\-]+/gi, '_').slice(0, 40);
  return `${cleaned}_${suffix}.${ext.replace(/^\./, '')}`;
}

export async function snapshotResult(
  canvas: HTMLCanvasElement,
  filename: string
) {
  const blob = await canvasToBlob(canvas, { type: 'image/png', quality: 0.92 });
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    size: blob.size,
    filename,
    mime: 'image/png',
  };
}

export async function exportAs(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
  filename: string
) {
  const blob = await canvasToBlob(canvas, { type, quality });
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    size: blob.size,
    filename,
    mime: type,
  };
}

export { uid };
