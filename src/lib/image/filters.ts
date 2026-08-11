import { fileToImage, makeCanvas, canvasToBlob } from './core';

export async function rotateImage(file: File, angle: number): Promise<Blob> {
  const img = await fileToImage(file);
  const rad = (angle * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const w = Math.round(img.width * cos + img.height * sin);
  const h = Math.round(img.width * sin + img.height * cos);
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.translate(w / 2, h / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function flipImage(file: File, direction: 'horizontal' | 'vertical'): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  if (direction === 'horizontal') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
  }
  ctx.drawImage(img, 0, 0);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function grayscale(file: File): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.data.length; i += 4) {
    const r = data.data[i];
    const g = data.data[i + 1];
    const b = data.data[i + 2];
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    data.data[i] = data.data[i + 1] = data.data[i + 2] = y;
  }
  ctx.putImageData(data, 0, 0);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function invert(file: File): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.data.length; i += 4) {
    data.data[i] = 255 - data.data[i];
    data.data[i + 1] = 255 - data.data[i + 1];
    data.data[i + 2] = 255 - data.data[i + 2];
  }
  ctx.putImageData(data, 0, 0);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function blurImage(file: File, radius: number): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(img, 0, 0);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function pixelateImage(file: File, blockSize: number): Promise<Blob> {
  const img = await fileToImage(file);
  const block = Math.max(2, Math.floor(blockSize));
  // Downscale to block-resolution, then upscale with imageSmoothingEnabled=false.
  const tmp = makeCanvas(
    Math.max(1, Math.round(img.width / block)),
    Math.max(1, Math.round(img.height / block))
  );
  const tctx = tmp.getContext('2d')!;
  tctx.imageSmoothingEnabled = true;
  tctx.drawImage(img, 0, 0, tmp.width, tmp.height);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, 0, 0, canvas.width, canvas.height);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function addBorder(
  file: File,
  px: number,
  color: string
): Promise<Blob> {
  const img = await fileToImage(file);
  const w = img.width + px * 2;
  const h = img.height + px * 2;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, px, px);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function vignette(file: File, intensity: number): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const grad = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    Math.min(canvas.width, canvas.height) * 0.3,
    canvas.width / 2,
    canvas.height / 2,
    Math.max(canvas.width, canvas.height) * 0.7
  );
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, `rgba(0,0,0,${intensity})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export interface AdjustOptions {
  brightness: number; // -1..1
  contrast: number;   // -1..1
  saturation: number; // -1..1
  hue: number;        // -180..180
  temperature: number; // -1..1
  noise: number;      // 0..1
  sharpen: number;     // 0..1
}

export async function adjust(file: File, o: Partial<AdjustOptions>): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  const brightness = o.brightness ?? 0;
  const contrast = o.contrast ?? 0;
  const saturation = o.saturation ?? 0;
  const hue = o.hue ?? 0;
  const temp = o.temperature ?? 0;
  const filters = [
    `brightness(${1 + brightness})`,
    `contrast(${1 + contrast})`,
    `saturate(${1 + saturation})`,
    `hue-rotate(${hue}deg)`,
  ].join(' ');
  ctx.filter = filters;
  ctx.drawImage(img, 0, 0);

  // Temperature (warm/cool) is best applied after canvas because filter chains
  // don't expose a temperature primitive across browsers.
  if (temp !== 0) {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const rDelta = temp * 30;
    const bDelta = -temp * 30;
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] = Math.max(0, Math.min(255, data.data[i] + rDelta));
      data.data[i + 2] = Math.max(0, Math.min(255, data.data[i + 2] + bDelta));
    }
    ctx.putImageData(data, 0, 0);
  }

  // Sharpen via small convolution.
  if ((o.sharpen ?? 0) > 0) {
    convolve(canvas, [
      0, -1, 0,
      -1, 5 + (o.sharpen ?? 0), -1,
      0, -1, 0,
    ]);
  }

  // Noise (additive).
  if ((o.noise ?? 0) > 0) {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const amp = (o.noise ?? 0) * 60;
    for (let i = 0; i < data.data.length; i += 4) {
      const n = (Math.random() - 0.5) * amp;
      data.data[i] = Math.max(0, Math.min(255, data.data[i] + n));
      data.data[i + 1] = Math.max(0, Math.min(255, data.data[i + 1] + n));
      data.data[i + 2] = Math.max(0, Math.min(255, data.data[i + 2] + n));
    }
    ctx.putImageData(data, 0, 0);
  }
  return canvasToBlob(canvas, { type: 'image/png' });
}

function convolve(canvas: HTMLCanvasElement, weights: number[]) {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;
  const src = ctx.getImageData(0, 0, w, h);
  const out = ctx.createImageData(w, h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let v = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * w + (x + kx)) * 4 + c;
            v += src.data[idx] * weights[(ky + 1) * 3 + (kx + 1)];
          }
        }
        out.data[(y * w + x) * 4 + c] = Math.max(0, Math.min(255, v));
      }
      out.data[(y * w + x) * 4 + 3] = src.data[(y * w + x) * 4 + 3];
    }
  }
  ctx.putImageData(out, 0, 0);
}

export async function enhance(file: File): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  // Brightness + contrast + saturation + slight sharpen — the classic "auto enhance".
  ctx.filter = 'brightness(1.05) contrast(1.1) saturate(1.1)';
  ctx.drawImage(img, 0, 0);
  convolve(canvas, [0, -1, 0, -1, 5.4, -1, 0, -1, 0]);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function denoise(file: File, strength: number): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  // A small uniform blur is a usable, dependency-free denoise approximation.
  ctx.filter = `blur(${strength}px)`;
  ctx.drawImage(img, 0, 0);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function addText(
  file: File,
  opts: {
    text: string;
    font: string;
    size: number;
    color: string;
    background: string;
    stroke?: string;
    strokeWidth?: number;
    shadow?: boolean;
    rotation: number;
    opacity: number;
    x: number; // 0..1 of width
    y: number; // 0..1 of height
  }
): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  ctx.save();
  ctx.globalAlpha = opts.opacity;
  ctx.font = `${opts.size}px ${opts.font}`;
  const metrics = ctx.measureText(opts.text);
  const w = metrics.width;
  const h = opts.size;
  const cx = canvas.width * opts.x;
  const cy = canvas.height * opts.y;
  ctx.translate(cx, cy);
  ctx.rotate((opts.rotation * Math.PI) / 180);
  if (opts.background) {
    ctx.fillStyle = opts.background;
    ctx.fillRect(-w / 2 - 8, -h / 2 - 4, w + 16, h + 8);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (opts.shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }
  if (opts.stroke && opts.strokeWidth) {
    ctx.lineWidth = opts.strokeWidth;
    ctx.strokeStyle = opts.stroke;
    ctx.strokeText(opts.text, 0, 0);
  }
  ctx.fillStyle = opts.color;
  ctx.fillText(opts.text, 0, 0);
  ctx.restore();
  return canvasToBlob(canvas, { type: 'image/png' });
}

export interface WatermarkOptions {
  text: string;
  fontSize: number;
  color: string;
  rotation: number;
  opacity: number;
  density: number; // 1..6 — how many repetitions across the image
}

export async function watermarkImage(file: File, opts: WatermarkOptions): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  ctx.save();
  ctx.globalAlpha = opts.opacity;
  ctx.fillStyle = opts.color;
  ctx.font = `bold ${opts.fontSize}px Inter, system-ui, sans-serif`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((opts.rotation * Math.PI) / 180);
  const step = Math.max(80, Math.min(canvas.width, canvas.height) / opts.density);
  const xCount = Math.ceil(canvas.width / step) + 2;
  const yCount = Math.ceil(canvas.height / step) + 2;
  for (let i = -xCount; i <= xCount; i++) {
    for (let j = -yCount; j <= yCount; j++) {
      ctx.fillText(opts.text, i * step, j * step);
    }
  }
  ctx.restore();
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function circleCrop(file: File, background: string): Promise<Blob> {
  const img = await fileToImage(file);
  const size = Math.min(img.width, img.height);
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, (size - img.width) / 2, (size - img.height) / 2);
  ctx.restore();
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function roundedCornerCrop(
  file: File,
  radius: number,
  background: string
): Promise<Blob> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const r = Math.min(radius, Math.min(canvas.width, canvas.height) / 2);
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(canvas.width - r, 0);
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
  ctx.lineTo(canvas.width, canvas.height - r);
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
  ctx.lineTo(r, canvas.height);
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, 0, 0);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function squareCrop(file: File, background: string): Promise<Blob> {
  const img = await fileToImage(file);
  const size = Math.min(img.width, img.height);
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, (size - img.width) / 2, (size - img.height) / 2);
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function aspectRatioCrop(
  file: File,
  ratioW: number,
  ratioH: number,
  background: string
): Promise<Blob> {
  const img = await fileToImage(file);
  const target = ratioW / ratioH;
  const src = img.width / img.height;
  let cropW = img.width;
  let cropH = img.height;
  if (src > target) {
    cropW = img.height * target;
  } else {
    cropH = img.width / target;
  }
  const canvas = makeCanvas(Math.round(cropW), Math.round(cropH));
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    (img.width - cropW) / 2,
    (img.height - cropH) / 2,
    cropW,
    cropH,
    0,
    0,
    canvas.width,
    canvas.height
  );
  return canvasToBlob(canvas, { type: 'image/png' });
}

export async function colorPalette(file: File, count = 5): Promise<string[]> {
  const img = await fileToImage(file);
  const canvas = makeCanvas(64, 64);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, 64, 64);
  const data = ctx.getImageData(0, 0, 64, 64).data;
  const buckets: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 4) {
    // Aggregate to 5-bit per channel to group near-identical colors.
    const key = `${data[i] >> 3}-${data[i + 1] >> 3}-${data[i + 2] >> 3}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }
  const entries = Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, count);
  return entries.map(([k]) => {
    const [r, g, b] = k.split('-').map((n) => parseInt(n, 10) << 3);
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
  });
}

export async function getDominantColors(file: File): Promise<string[]> {
  return colorPalette(file, 8);
}
