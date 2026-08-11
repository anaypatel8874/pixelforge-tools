'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { roundedCornerCrop } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function RoundedCornerCrop() {
  const tool = getTool('rounded-corner-crop')!;
  const [radius, setRadius] = useState(40);
  const [bg, setBg] = useState('transparent');
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="rounded"
      controls={() => (
        <>
          <Field label={`Corner radius: ${radius}px`}>
            <input type="range" min={0} max={300} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label="Background">
            <select className="input" value={bg} onChange={(e) => setBg(e.target.value)}>
              <option value="transparent">Transparent (PNG)</option>
              <option value="#ffffff">White</option>
              <option value="#000000">Black</option>
              <option value="#0EA5E9">Sky</option>
            </select>
          </Field>
        </>
      )}
      run={async (file, ctx) => {
        const blob = await roundedCornerCrop(file, radius, bg === 'transparent' ? 'rgba(0,0,0,0)' : bg);
        ctx.setOutput(blob);
      }}
    />
  );
}
