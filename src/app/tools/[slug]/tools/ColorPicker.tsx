'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Copy } from 'lucide-react';

export function ColorPicker() {
  const tool = getTool('image-color-picker')!;
  const { push } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [color, setColor] = useState<{ hex: string; rgb: string; x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const canvas = document.createElement('canvas');
    const w = imgRef.current.naturalWidth;
    const h = imgRef.current.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imgRef.current, 0, 0, w, h);
    const px = ctx.getImageData(Math.round(x * w), Math.round(y * h), 1, 1).data;
    const hex = `#${[px[0], px[1], px[2]].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
    setColor({
      hex,
      rgb: `rgb(${px[0]}, ${px[1]}, ${px[2]})`,
      x: Math.round(x * w),
      y: Math.round(y * h),
    });
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => push('success', `Copied ${text}`));
  };

  return (
    <ToolLayout
      tool={tool}
      privacyNotice="client"
      onReset={() => {
        setFile(null);
        setColor(null);
      }}
    >
      {!file && <ImageUploader onError={(m) => push('error', m)} onFile={(f) => setFile(f[0])} />}
      {file && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div
            className="card overflow-hidden p-0"
            onClick={onClick}
            style={{ cursor: 'crosshair' }}
          >
            <img ref={imgRef} src={URL.createObjectURL(file)} alt={file.name} className="w-full" />
          </div>
          <Controls>
            <p className="text-sm text-[rgb(var(--fg-muted))]">
              Click anywhere on the image to pick a color.
            </p>
            {color && (
              <>
                <div
                  className="h-16 w-full rounded-xl border border-[rgb(var(--border))]"
                  style={{ background: color.hex }}
                />
                <Field label="HEX">
                  <button onClick={() => copy(color.hex)} className="input flex items-center justify-between text-left">
                    <span>{color.hex}</span>
                    <Copy className="h-4 w-4" />
                  </button>
                </Field>
                <Field label="RGB">
                  <button onClick={() => copy(color.rgb)} className="input flex items-center justify-between text-left">
                    <span>{color.rgb}</span>
                    <Copy className="h-4 w-4" />
                  </button>
                </Field>
                <Field label="Pixel position">
                  <input className="input" readOnly value={`${color.x}, ${color.y}`} />
                </Field>
              </>
            )}
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}
