import { fileToImage, makeCanvas, canvasToBlob } from './core';

export interface JoinOptions {
  direction: 'horizontal' | 'vertical';
  spacing: number;
  background: string;
  fit: 'cover' | 'contain';
}

export async function joinImages(files: File[], opts: JoinOptions): Promise<Blob> {
  if (!files.length) throw new Error('Please add at least one image.');
  const imgs = await Promise.all(files.map(fileToImage));
  const maxW = Math.max(...imgs.map((i) => i.width));
  const maxH = Math.max(...imgs.map((i) => i.height));
  const totalW = imgs.reduce((s, i) => s + i.width, 0) + opts.spacing * (imgs.length - 1);
  const totalH = imgs.reduce((s, i) => s + i.height, 0) + opts.spacing * (imgs.length - 1);

  const w = opts.direction === 'horizontal' ? totalW : maxW;
  const h = opts.direction === 'vertical' ? totalH : maxH;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = opts.background;
  ctx.fillRect(0, 0, w, h);

  let offset = 0;
  for (const img of imgs) {
    if (opts.direction === 'horizontal') {
      const y = (maxH - img.height) / 2;
      ctx.drawImage(img, offset, y);
      offset += img.width + opts.spacing;
    } else {
      const x = (maxW - img.width) / 2;
      ctx.drawImage(img, x, offset);
      offset += img.height + opts.spacing;
    }
  }
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function mergePhotoSignature(
  photo: File,
  signature: File,
  options: {
    photoWidth: number; // px
    photoHeight: number; // px
    signatureWidth: number; // px
    signatureHeight: number; // px
    placement: 'bottom-right' | 'bottom-left' | 'bottom-center';
    margin: number;
  }
): Promise<Blob> {
  const p = await fileToImage(photo);
  const s = await fileToImage(signature);
  const canvas = makeCanvas(options.photoWidth, options.photoHeight);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(p, 0, 0, canvas.width, canvas.height);
  const sigW = Math.min(options.signatureWidth, canvas.width - options.margin * 2);
  const sigH = (sigW / s.width) * s.height;
  let x = options.margin;
  if (options.placement === 'bottom-right') x = canvas.width - sigW - options.margin;
  if (options.placement === 'bottom-center') x = (canvas.width - sigW) / 2;
  const y = canvas.height - sigH - options.margin;
  ctx.drawImage(s, x, y, sigW, sigH);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export interface CollageOptions {
  layout: 'grid-2' | 'grid-3' | 'grid-4' | 'grid-6';
  spacing: number;
  background: string;
  cornerRadius: number;
}

export async function makeCollage(files: File[], opts: CollageOptions): Promise<Blob> {
  const cols = opts.layout === 'grid-2' ? 2 : opts.layout === 'grid-3' ? 3 : opts.layout === 'grid-4' ? 2 : 3;
  const rows = Math.ceil(6 / cols);
  const cell = 600;
  const w = cols * cell + (cols - 1) * opts.spacing;
  const h = rows * cell + (rows - 1) * opts.spacing;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = opts.background;
  ctx.fillRect(0, 0, w, h);

  const imgs = await Promise.all(files.slice(0, cols * rows).map(fileToImage));
  for (let i = 0; i < imgs.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * (cell + opts.spacing);
    const y = row * (cell + opts.spacing);
    if (opts.cornerRadius > 0) {
      ctx.save();
      const r = Math.min(opts.cornerRadius, cell / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + cell, y, x + cell, y + cell, r);
      ctx.arcTo(x + cell, y + cell, x, y + cell, r);
      ctx.arcTo(x, y + cell, x, y, r);
      ctx.arcTo(x, y, x + cell, y, r);
      ctx.closePath();
      ctx.clip();
    }
    const sR = Math.max(cell / imgs[i].width, cell / imgs[i].height);
    const dw = imgs[i].width * sR;
    const dh = imgs[i].height * sR;
    ctx.drawImage(imgs[i], x + (cell - dw) / 2, y + (cell - dh) / 2, dw, dh);
    if (opts.cornerRadius > 0) ctx.restore();
  }
  return canvasToBlob(canvas, { type: 'image/png' });
}
