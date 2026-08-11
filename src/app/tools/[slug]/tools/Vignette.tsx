'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { vignette } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function Vignette() {
  const tool = getTool('vignette')!;
  const [intensity, setIntensity] = useState(0.7);
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="vignette"
      controls={() => (
        <Field label={`Intensity: ${(intensity * 100).toFixed(0)}%`}>
          <input type="range" min={0} max={1} step={0.05} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full" />
        </Field>
      )}
      run={async (file, ctx) => {
        const blob = await vignette(file, intensity);
        ctx.setOutput(blob);
      }}
    />
  );
}