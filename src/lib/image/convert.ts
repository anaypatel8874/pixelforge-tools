/**
 * Format conversion + metadata stripping.
 *
 * Most conversions are free — browsers let us re-encode a canvas with any
 * supported MIME type. Unsupported formats (HEIC) require a decoder.
 */

import { fileToImage, makeCanvas, canvasToBlob } from './core';

export interface ConvertOptions {
  type: string;
  quality?: number;
}

export async function convertImage(file: File, opts: ConvertOptions): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  // For PNG → JPG, we need a fill background because JPG has no alpha.
  if (opts.type === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);
  return canvasToBlob(canvas, { type: opts.type, quality: opts.quality ?? 0.92 });
}

export async function pngToIco(files: File[]): Promise<Blob> {
  // Build a minimal ICO with multiple PNG-encoded sizes.
  const sizes = [16, 32, 48, 64, 128, 256];
  const images: { size: number; blob: Blob }[] = [];
  for (const f of files) {
    const img = await fileToImage(f);
    for (const sz of sizes) {
      if (img.width < sz || img.height < sz) continue;
      const canvas = makeCanvas(sz, sz);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, sz, sz);
      const blob = await canvasToBlob(canvas, { type: 'image/png' });
      images.push({ size: sz, blob });
    }
    if (images.length) break;
  }
  if (!images.length) {
    throw new Error('Image is too small to produce any ICO size.');
  }

  const buffers: Uint8Array[] = [];
  for (const { size, blob } of images) {
    const buf = new Uint8Array(await blob.arrayBuffer());
    buffers.push(buf);
  }

  // ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes × n) + image data.
  const headerSize = 6 + 16 * buffers.length;
  let total = headerSize;
  for (const b of buffers) total += b.length;
  const out = new Uint8Array(total);
  const dv = new DataView(out.buffer);
  dv.setUint16(0, 0, true);          // reserved
  dv.setUint16(2, 1, true);          // type 1 = ICO
  dv.setUint16(4, buffers.length, true);

  let offset = headerSize;
  buffers.forEach((b, i) => {
    const sz = images[i].size === 256 ? 0 : images[i].size;
    out[6 + i * 16 + 0] = sz; // width
    out[6 + i * 16 + 1] = sz; // height
    out[6 + i * 16 + 2] = 0;  // colors
    out[6 + i * 16 + 3] = 0;  // reserved
    dv.setUint16(6 + i * 16 + 4, 1, true);  // planes
    dv.setUint16(6 + i * 16 + 6, 32, true); // bitdepth
    dv.setUint32(6 + i * 16 + 8, b.length, true);
    dv.setUint32(6 + i * 16 + 12, offset, true);
    out.set(b, offset);
    offset += b.length;
  });
  return new Blob([out], { type: 'image/x-icon' });
}

/**
 * Strip metadata by re-encoding the image. This is the only universal way to
 * drop EXIF / GPS / XMP without a decoding library.
 */
export async function stripMetadata(file: File): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  return canvasToBlob(canvas, { type, quality: 0.95 });
}
