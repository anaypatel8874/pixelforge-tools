'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function SignatureResizer() {
  const tool = getTool('signature-resizer')!;
  const [w, setW] = useState(300);
  const [h, setH] = useState(80);
  const [bg, setBg] = useState('#ffffff');
  const [fit, setFit] = useState<'contain' | 'cover'>('contain');
  const [ext, setExt] = useState('png');

  return (
    <SingleTool
      tool={tool}
      downloadSuffix={`${w}x${h}`}
      downloadExt={ext}
      controls={() => (
        <>
          <Field label="Width (px)">
            <input type="number" className="input" value={w} onChange={(e) => setW(Number(e.target.value) || 0)} />
          </Field>
          <Field label="Height (px)">
            <input type="number" className="input" value={h} onChange={(e) => setH(Number(e.target.value) || 0)} />
          </Field>
          <Field label="Background">
            <select className="input" value={bg} onChange={(e) => setBg(e.target.value)}>
              <option value="#ffffff">White</option>
              <option value="rgba(0,0,0,0)">Transparent (PNG)</option>
              <option value="#000000">Black</option>
            </select>
          </Field>
          <Field label="Fit">
            <select className="input" value={fit} onChange={(e) => setFit(e.target.value as any)}>
              <option value="contain">Fit inside (pad)</option>
              <option value="cover">Fill (crop)</option>
            </select>
          </Field>
          <Field label="Output">
            <select className="input" value={ext} onChange={(e) => setExt(e.target.value)}>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
            </select>
          </Field>
        </>
      )}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: w,
          height: h,
          fit,
          background: bg,
          type: ext === 'png' ? 'image/png' : 'image/jpeg',
          quality: 0.95,
        });
        ctx.setOutput(blob);
      }}
    />
  );
}