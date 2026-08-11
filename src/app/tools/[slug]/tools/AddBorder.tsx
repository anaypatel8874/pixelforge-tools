'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { addBorder } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function AddBorder() {
  const tool = getTool('add-border')!;
  const [px, setPx] = useState(20);
  const [color, setColor] = useState('#ffffff');
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="border"
      controls={() => (
        <>
          <Field label={`Border width: ${px}px`}>
            <input type="range" min={1} max={300} value={px} onChange={(e) => setPx(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label="Color">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-[rgb(var(--border))]" />
          </Field>
        </>
      )}
      run={async (file, ctx) => {
        const blob = await addBorder(file, px, color);
        ctx.setOutput(blob);
      }}
    />
  );
}