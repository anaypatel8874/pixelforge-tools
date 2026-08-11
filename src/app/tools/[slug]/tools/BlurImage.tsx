'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { blurImage } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function BlurImage() {
  const tool = getTool('blur-image')!;
  const [radius, setRadius] = useState(8);
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="blur"
      controls={() => (
        <Field label={`Blur radius: ${radius}px`}>
          <input
            type="range"
            min={0}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full"
          />
        </Field>
      )}
      run={async (file, ctx) => {
        const blob = await blurImage(file, radius);
        ctx.setOutput(blob);
      }}
    />
  );
}