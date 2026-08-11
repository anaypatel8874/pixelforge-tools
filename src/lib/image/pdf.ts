/**
 * Build a PDF from images using jsPDF.
 *
 * jsPDF supports JPEG / PNG natively; we re-encode PNG (with alpha) as JPEG
 * before insert and only let PNG flow through when transparency is required.
 */
import { jsPDF } from 'jspdf';
import { fileToImage, makeCanvas, canvasToBlob } from './core';

export type PageSize = 'a4' | 'letter' | 'original';
export type Orientation = 'portrait' | 'landscape';

export interface PdfOptions {
  pageSize: PageSize;
  orientation: Orientation;
  margin: number; // mm
  quality: number;
  fit: 'cover' | 'contain';
}

export async function imagesToPdf(files: File[], opts: PdfOptions): Promise<Blob> {
  if (!files.length) throw new Error('Please add at least one image.');

  const first = await fileToImage(files[0]);
  const pageDims = computePage(first.width, first.height, opts);

  const pdf = new jsPDF({
    orientation: opts.orientation,
    unit: 'mm',
    format: opts.pageSize === 'letter' ? 'letter' : opts.pageSize === 'a4' ? 'a4' : [pageDims.wMm, pageDims.hMm],
  });

  for (let i = 0; i < files.length; i++) {
    const img = await fileToImage(files[i]);
    const jpgBlob = await canvasToBlob(renderForPdf(img, pageDims, opts), {
      type: 'image/jpeg',
      quality: opts.quality,
    });
    const dataUrl = await blobToDataUrl(jpgBlob);
    if (i > 0) pdf.addPage();
    pdf.addImage(
      dataUrl,
      'JPEG',
      opts.margin,
      opts.margin,
      pageDims.contentW,
      pageDims.contentH
    );
  }
  return pdf.output('blob');
}

function renderForPdf(
  img: HTMLImageElement,
  dims: { contentW: number; contentH: number; wMm: number; hMm: number },
  opts: PdfOptions
): HTMLCanvasElement {
  const canvas = makeCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  // jsPDF inserts JPEGs. We re-fit here at canvas-time so the printed image
  // matches the requested fit.
  const targetPxW = Math.round((dims.contentW / 25.4) * 200);
  const targetPxH = Math.round((dims.contentH / 25.4) * 200);
  const target = makeCanvas(targetPxW, targetPxH);
  const tctx = target.getContext('2d')!;
  tctx.fillStyle = '#ffffff';
  tctx.fillRect(0, 0, target.width, target.height);
  if (opts.fit === 'cover') {
    const sR = Math.max(target.width / img.width, target.height / img.height);
    const dw = img.width * sR;
    const dh = img.height * sR;
    tctx.drawImage(img, (target.width - dw) / 2, (target.height - dh) / 2, dw, dh);
  } else {
    const sR = Math.min(target.width / img.width, target.height / img.height);
    const dw = img.width * sR;
    const dh = img.height * sR;
    tctx.drawImage(img, (target.width - dw) / 2, (target.height - dh) / 2, dw, dh);
  }
  return target;
}

function computePage(
  srcW: number,
  srcH: number,
  opts: PdfOptions
): { wMm: number; hMm: number; contentW: number; contentH: number } {
  let wMm: number, hMm: number;
  if (opts.pageSize === 'a4') {
    wMm = 210;
    hMm = 297;
  } else if (opts.pageSize === 'letter') {
    wMm = 215.9;
    hMm = 279.4;
  } else {
    const aspect = srcW / srcH;
    if (aspect > 1) {
      hMm = 200;
      wMm = hMm * aspect;
    } else {
      wMm = 200;
      hMm = wMm / aspect;
    }
  }
  if (opts.orientation === 'landscape') [wMm, hMm] = [hMm, wMm];
  return {
    wMm,
    hMm,
    contentW: Math.max(20, wMm - opts.margin * 2),
    contentH: Math.max(20, hMm - opts.margin * 2),
  };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read blob.'));
    reader.readAsDataURL(blob);
  });
}
