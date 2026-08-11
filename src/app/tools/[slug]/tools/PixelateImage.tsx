'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { pixelateImage } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function PixelateImage() {
  const tool = getTool('pixelate-image')!;
  const [block, setBlock] = useState(12);
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="pixel"
      controls={() => (
        <Field label={`Block size: ${block}px`}>
          <input
            type="range"
            min={2}
            max={64}
            value={block}
            onChange={(e) => setBlock(Number(e.target.value))}
            className="w-full"
          />
        </Field>
      )}
      run={async (file, ctx) => {
        const blob = await pixelateImage(file, block);
        ctx.setOutput(blob);
      }}
    />
  );
}