'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { adjust } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function Saturation() {
  const tool = getTool('saturation')!;
  const [s, setS] = useState(0);
  const [h, setH] = useState(0);
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="saturated"
      controls={() => (
        <>
          <Field label={`Saturation: ${(s * 100).toFixed(0)}%`}>
            <input type="range" min={-1} max={1} step={0.05} value={s} onChange={(e) => setS(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`Hue: ${h}°`}>
            <input type="range" min={-180} max={180} value={h} onChange={(e) => setH(Number(e.target.value))} className="w-full" />
          </Field>
        </>
      )}
      run={async (file, ctx) => {
        const blob = await adjust(file, { saturation: s, hue: h });
        ctx.setOutput(blob);
      }}
    />
  );
}