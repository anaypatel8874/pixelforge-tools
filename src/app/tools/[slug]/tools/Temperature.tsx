'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { adjust } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function Temperature() {
  const tool = getTool('temperature')!;
  const [t, setT] = useState(0);
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="temp"
      controls={() => (
        <Field label={`Temperature: ${t > 0 ? 'Warm' : t < 0 ? 'Cool' : 'Neutral'} (${t})`}>
          <input type="range" min={-1} max={1} step={0.05} value={t} onChange={(e) => setT(Number(e.target.value))} className="w-full" />
        </Field>
      )}
      run={async (file, ctx) => {
        const blob = await adjust(file, { temperature: t });
        ctx.setOutput(blob);
      }}
    />
  );
}