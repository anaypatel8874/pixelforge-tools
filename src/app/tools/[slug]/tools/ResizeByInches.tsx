'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { resizeImage, physicalToPx } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function ResizeByInches() {
  const tool = getTool('resize-by-inches')!;
  const [w, setW] = useState(4);
  const [h, setH] = useState(6);
  const [dpi, setDpi] = useState(300);
  const [fit, setFit] = useState<'cover' | 'contain'>('cover');
  const [bg, setBg] = useState('#ffffff');
  const [quality, setQuality] = useState(0.92);
  return (
    <SingleTool
      tool={tool}
      downloadSuffix={`${w}x${h}in`}
      downloadExt="jpg"
      controls={() => (
        <>
          <Field label="Width (in)">
            <input type="number" className="input" value={w} onChange={(e) => setW(Number(e.target.value) || 0)} />
          </Field>
          <Field label="Height (in)">
            <input type="number" className="input" value={h} onChange={(e) => setH(Number(e.target.value) || 0)} />
          </Field>
          <Field label={`DPI: ${dpi}`}>
            <input type="range" min={72} max={600} step={1} value={dpi} onChange={(e) => setDpi(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label="Fit">
            <select className="input" value={fit} onChange={(e) => setFit(e.target.value as any)}>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </Field>
          {fit === 'contain' && (
            <Field label="Pad color">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-full rounded-lg border border-[rgb(var(--border))]" />
            </Field>
          )}
          <Field label={`Quality: ${(quality * 100).toFixed(0)}%`}>
            <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
          </Field>
          <p className="text-xs text-[rgb(var(--fg-muted))]">
            Output: {physicalToPx(w, 'in', dpi)}×{physicalToPx(h, 'in', dpi)} px
          </p>
        </>
      )}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: physicalToPx(w, 'in', dpi),
          height: physicalToPx(h, 'in', dpi),
          fit,
          background: bg,
          type: 'image/jpeg',
          quality,
        });
        ctx.setOutput(blob);
      }}
    />
  );
}
