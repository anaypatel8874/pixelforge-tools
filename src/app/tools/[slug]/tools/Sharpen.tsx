'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { adjust } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function Sharpen() {
  const tool = getTool('sharpen')!;
  const [amount, setAmount] = useState(0.5);
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="sharpened"
      controls={() => (
        <Field label={`Sharpen amount: ${amount.toFixed(2)}`}>
          <input type="range" min={0} max={1} step={0.05} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full" />
        </Field>
      )}
      run={async (file, ctx) => {
        const blob = await adjust(file, { sharpen: amount });
        ctx.setOutput(blob);
      }}
    />
  );
}