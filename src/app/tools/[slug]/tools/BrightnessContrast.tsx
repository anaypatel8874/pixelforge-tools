'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { adjust } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function BrightnessContrast() {
  const tool = getTool('brightness-contrast')!;
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="adjusted"
      controls={() => (
        <>
          <Field label={`Brightness: ${(b * 100).toFixed(0)}%`}>
            <input type="range" min={-0.5} max={0.5} step={0.05} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`Contrast: ${(c * 100).toFixed(0)}%`}>
            <input type="range" min={-0.5} max={0.5} step={0.05} value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full" />
          </Field>
        </>
      )}
      run={async (file, ctx) => {
        const blob = await adjust(file, { brightness: b, contrast: c });
        ctx.setOutput(blob);
      }}
    />
  );
}