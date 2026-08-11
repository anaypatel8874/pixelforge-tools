'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { fileToImage, makeCanvas, canvasToBlob } from '@/lib/image/core';
import { downloadBlob, downloadAsZip, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Wand2, Download } from 'lucide-react';

export function AddLogo() {
  const tool = getTool('add-logo')!;
  const { push } = useToast();
  const [photos, setPhotos] = useState<File[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [scale, setScale] = useState(0.2);
  const [opacity, setOpacity] = useState(1);
  const [pos, setPos] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('bottom-right');
  const [margin, setMargin] = useState(20);
  const [output, setOutput] = useState<{ blob: Blob; name: string }[]>([]);

  const handle = async () => {
    if (!logo || !photos.length) return;
    try {
      const logoImg = await fileToImage(logo);
      const out: { blob: Blob; name: string }[] = [];
      for (const f of photos) {
        const img = await fileToImage(f);
        const canvas = makeCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const w = img.width * scale;
        const h = (logoImg.height / logoImg.width) * w;
        let x = margin, y = margin;
        if (pos === 'top-right') x = img.width - w - margin;
        if (pos === 'bottom-left') y = img.height - h - margin;
        if (pos === 'bottom-right') {
          x = img.width - w - margin;
          y = img.height - h - margin;
        }
        ctx.globalAlpha = opacity;
        ctx.drawImage(logoImg, x, y, w, h);
        ctx.globalAlpha = 1;
        const blob = await canvasToBlob(canvas, { type: 'image/png' });
        out.push({ blob, name: suggestFilename(f.name, 'logo', 'png') });
      }
      setOutput(out);
      push('success', `Rendered ${out.length} image${out.length > 1 ? 's' : ''}.`);
    } catch (e) {
      push('error', e instanceof Error ? e.message : 'Failed.');
    }
  };

  return (
    <ToolLayout
      tool={tool}
      privacyNotice="client"
      onReset={() => {
        setPhotos([]);
        setLogo(null);
        setOutput([]);
      }}
      dirty={output.length > 0}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="label mb-2">Photos (one or more)</p>
          {photos.length === 0 ? (
            <ImageUploader multiple onError={(m) => push('error', m)} onFile={setPhotos} />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((f, i) => (
                <ImagePreview key={i} src={URL.createObjectURL(f)} />
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="label mb-2">Logo (PNG with transparency preferred)</p>
          {!logo ? (
            <ImageUploader onError={(m) => push('error', m)} onFile={(f) => setLogo(f[0])} />
          ) : (
            <ImagePreview src={URL.createObjectURL(logo)} />
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-3">
          {output[0] && <ImagePreview src={URL.createObjectURL(output[0].blob)} />}
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={handle} disabled={!logo || !photos.length}>
              <Wand2 className="h-4 w-4" /> Apply Logo
            </button>
            <button
              className="btn-secondary"
              disabled={!output.length}
              onClick={async () => {
                if (output.length === 1) downloadBlob(output[0].blob, output[0].name);
                else await downloadAsZip(output, 'logo-overlay.zip');
              }}
            >
              <Download className="h-4 w-4" /> Download {output.length > 1 ? 'ZIP' : ''}
            </button>
          </div>
        </div>
        <Controls>
          <Field label={`Size: ${(scale * 100).toFixed(0)}% of image width`}>
            <input type="range" min={0.05} max={0.6} step={0.01} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`Opacity: ${(opacity * 100).toFixed(0)}%`}>
            <input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label="Position">
            <select className="input" value={pos} onChange={(e) => setPos(e.target.value as any)}>
              <option value="top-left">Top left</option>
              <option value="top-right">Top right</option>
              <option value="bottom-left">Bottom left</option>
              <option value="bottom-right">Bottom right</option>
            </select>
          </Field>
          <Field label={`Margin: ${margin}px`}>
            <input type="range" min={0} max={200} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full" />
          </Field>
        </Controls>
      </div>
    </ToolLayout>
  );
}