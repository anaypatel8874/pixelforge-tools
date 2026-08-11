'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { denoise } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function Denoise() {
  const tool = getTool('denoise')!;
  const [strength, setStrength] = useState(1.5);
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="denoised"
      controls={() => (
        <Field label={`Strength: ${strength.toFixed(1)}`}>
          <input type="range" min={0} max={6} step={0.1} value={strength} onChange={(e) => setStrength(Number(e.target.value))} className="w-full" />
        </Field>
      )}
      run={async (file, ctx) => {
        const blob = await denoise(file, strength);
        ctx.setOutput(blob);
      }}
    />
  );
}