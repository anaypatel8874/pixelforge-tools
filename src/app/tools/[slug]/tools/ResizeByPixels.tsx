'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function ResizeByPixels() {
  const tool = getTool('resize-by-pixels')!;
  const [w, setW] = useState(1024);
  const [h, setH] = useState(1024);
  const [lock, setLock] = useState(true);
  const [fit, setFit] = useState<'cover' | 'contain' | 'stretch'>('cover');
  const [bg, setBg] = useState('#ffffff');
  const [quality, setQuality] = useState(0.92);
  const [type, setType] = useState('image/jpeg');
  return (
    <SingleTool
      tool={tool}
      downloadSuffix={`${w}x${h}`}
      downloadExt={type === 'image/png' ? 'png' : 'jpg'}
      controls={() => (
        <>
          <Field label="Width (px)">
            <input type="number" className="input" value={w} onChange={(e) => {
              const v = Math.max(1, Number(e.target.value));
              setW(v);
              if (lock) setH(Math.round((v * h) / w));
            }} />
          </Field>
          <Field label="Height (px)">
            <input type="number" className="input" value={h} onChange={(e) => {
              const v = Math.max(1, Number(e.target.value));
              setH(v);
              if (lock) setW(Math.round((v * w) / h));
            }} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} />
            Lock aspect ratio
          </label>
          <Field label="Fit">
            <select className="input" value={fit} onChange={(e) => setFit(e.target.value as any)}>
              <option value="cover">Cover (fill, crop excess)</option>
              <option value="contain">Contain (fit inside, pad)</option>
              <option value="stretch">Stretch</option>
            </select>
          </Field>
          {fit === 'contain' && (
            <Field label="Pad color">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-full rounded-lg border border-[rgb(var(--border))]" />
            </Field>
          )}
          <Field label="Output">
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="image/jpeg">JPG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
            </select>
          </Field>
          {type !== 'image/png' && (
            <Field label={`Quality: ${(quality * 100).toFixed(0)}%`}>
              <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
            </Field>
          )}
        </>
      )}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: w,
          height: h,
          fit,
          background: bg,
          type,
          quality,
        });
        ctx.setOutput(blob);
      }}
    />
  );
}