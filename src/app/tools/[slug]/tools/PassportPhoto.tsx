'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function PassportPhoto() {
  const tool = getTool('passport-photo')!;
  const [unit, setUnit] = useState<'mm' | 'in' | 'cm'>('mm');
  const [w, setW] = useState(35);
  const [h, setH] = useState(45);
  const [dpi, setDpi] = useState(300);
  const [bg, setBg] = useState('#ffffff');
  const [fit, setFit] = useState<'cover' | 'contain'>('cover');
  const [quality, setQuality] = useState(0.95);

  const toPx = (val: number) => {
    if (unit === 'mm') return Math.round((val / 25.4) * dpi);
    if (unit === 'cm') return Math.round((val / 2.54) * dpi);
    return Math.round(val * dpi);
  };

  return (
    <SingleTool
      tool={tool}
      downloadSuffix="passport"
      downloadExt="jpg"
      controls={() => (
        <>
          <Field label="Unit">
            <select className="input" value={unit} onChange={(e) => setUnit(e.target.value as any)}>
              <option value="mm">Millimeters</option>
              <option value="cm">Centimeters</option>
              <option value="in">Inches</option>
            </select>
          </Field>
          <Field label={`Width (${unit})`}>
            <input type="number" className="input" value={w} onChange={(e) => setW(Number(e.target.value) || 0)} />
          </Field>
          <Field label={`Height (${unit})`}>
            <input type="number" className="input" value={h} onChange={(e) => setH(Number(e.target.value) || 0)} />
          </Field>
          <Field label={`DPI: ${dpi}`}>
            <input type="range" min={72} max={600} step={1} value={dpi} onChange={(e) => setDpi(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label="Fit">
            <select className="input" value={fit} onChange={(e) => setFit(e.target.value as any)}>
              <option value="cover">Cover (fill, crop excess)</option>
              <option value="contain">Contain (fit inside, pad)</option>
            </select>
          </Field>
          <Field label="Background">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-full rounded-lg border border-[rgb(var(--border))]" />
          </Field>
          <Field label={`Quality: ${(quality * 100).toFixed(0)}%`}>
            <input type="range" min={0.5} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
          </Field>
          <p className="text-xs text-[rgb(var(--fg-muted))]">
            Output: {toPx(w)}×{toPx(h)} px.
            <br />
            Always verify the latest requirements on the official application portal.
          </p>
        </>
      )}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: toPx(w),
          height: toPx(h),
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
