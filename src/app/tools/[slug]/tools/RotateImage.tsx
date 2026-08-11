'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { rotateImage } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function RotateImage() {
  const tool = getTool('rotate-image')!;
  const [angle, setAngle] = useState(90);
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="rotated"
      controls={() => (
        <Field label={`Angle: ${angle}°`}>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full"
          />
          <p className="mt-2 text-xs text-[rgb(var(--fg-muted))]">
            Tip: hit 90° to flip an image taken in the wrong orientation.
          </p>
        </Field>
      )}
      run={async (file, ctx) => {
        const blob = await rotateImage(file, angle);
        ctx.setOutput(blob);
      }}
    />
  );
}
