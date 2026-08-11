import { fileToImage, makeCanvas, canvasToBlob } from './core';

export interface CompressOptions {
  /** Target quality 0..1. */
  quality: number;
  /** Output mime type. */
  type?: string;
  /** Max width to clamp to (optional). */
  maxWidth?: number;
  /** Max height to clamp to (optional). */
  maxHeight?: number;
}

export async function compressImage(file: File, opts: CompressOptions): Promise<Blob> {
  const img = await fileToImage(file);
  let { width, height } = img;
  if (opts.maxWidth && width > opts.maxWidth) {
    height = Math.round((height * opts.maxWidth) / width);
    width = opts.maxWidth;
  }
  if (opts.maxHeight && height > opts.maxHeight) {
    width = Math.round((width * opts.maxHeight) / height);
    height = opts.maxHeight;
  }
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);
  return canvasToBlob(canvas, { type: opts.type ?? 'image/jpeg', quality: opts.quality });
}

/**
 * Compress (with optional downscaling) so the encoded result is <= `targetBytes`.
 * Strategy: try quality 0.85 → 0.7 → 0.5 → 0.3; if still too big, downscale by 0.9 each loop.
 * Returns the smallest blob we ever produced.
 */
export async function compressToTarget(
  file: File,
  targetBytes: number,
  opts: Partial<CompressOptions> = {}
): Promise<{ blob: Blob; quality: number; width: number; height: number }> {
  const img = await fileToImage(file);
  const qualities = [0.92, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.18, 0.12];
  let scale = 1;
  let best: { blob: Blob; quality: number; width: number; height: number } | null = null;

  for (let pass = 0; pass < 8; pass++) {
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    for (const q of qualities) {
      const canvas = makeCanvas(w, h);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      const blob = await canvasToBlob(canvas, {
        type: opts.type ?? 'image/jpeg',
        quality: q,
      });
      if (!best || blob.size < best.blob.size) {
        best = { blob, quality: q, width: w, height: h };
      }
      if (blob.size <= targetBytes) {
        return { blob, quality: q, width: w, height: h };
      }
    }
    scale *= 0.85;
    if (w < 32 || h < 32) break;
  }
  return best!;
}

/**
 * Increase file size by adding metadata padding while preserving image quality.
 * We don't falsely claim to improve visual quality — only the byte count grows.
 */
export async function padImageToSize(
  file: File,
  targetBytes: number
): Promise<{ blob: Blob; added: number }> {
  const original = await file.arrayBuffer();
  if (original.byteLength >= targetBytes) {
    return { blob: file, added: 0 };
  }
  const needed = targetBytes - original.byteLength;
  // APP1 segment with a benign comment. 0xFFE1 + 2-byte length + payload.
  const header = new Uint8Array([0xff, 0xe1]);
  const payload = new TextEncoder().encode(
    'PixelForge padding segment. This metadata only increases file size — visual quality is unchanged.'
  );
  const lengthBytes = new Uint8Array(2);
  new DataView(lengthBytes.buffer).setUint16(0, payload.length + 2, false);
  const pad = new Uint8Array(needed - payload.length - 4);
  for (let i = 0; i < pad.length; i++) pad[i] = 0x20;
  // Insert just after the SOI marker (FF D8).
  const out = new Uint8Array(2 + original.byteLength + 4 + payload.length + pad.length);
  out.set(new Uint8Array(original.slice(0, 2)), 0);
  out.set(new Uint8Array(original.slice(2)), 2);
  out.set(header, 2 + original.byteLength - 2);
  out.set(lengthBytes, 2 + original.byteLength - 2 + 2);
  out.set(payload, 2 + original.byteLength - 2 + 4);
  out.set(pad, 2 + original.byteLength - 2 + 4 + payload.length);
  return {
    blob: new Blob([out], { type: file.type || 'image/jpeg' }),
    added: out.byteLength - original.byteLength,
  };
}
