'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { adjust } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function Noise() {
  const tool = getTool('noise')!;
  const [amount, setAmount] = useState(0.3);
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="grain"
      controls={() => (
        <Field label={`Grain intensity: ${(amount * 100).toFixed(0)}%`}>
          <input type="range" min={0} max={1} step={0.05} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full" />
        </Field>
      )}
      run={async (file, ctx) => {
        const blob = await adjust(file, { noise: amount });
        ctx.setOutput(blob);
      }}
    />
  );
}