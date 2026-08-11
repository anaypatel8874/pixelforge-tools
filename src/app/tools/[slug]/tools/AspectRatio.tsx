'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { aspectRatioCrop } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

const PRESETS: { label: string; w: number; h: number }[] = [
  { label: '1:1', w: 1, h: 1 },
  { label: '4:3', w: 4, h: 3 },
  { label: '3:2', w: 3, h: 2 },
  { label: '16:9', w: 16, h: 9 },
  { label: '9:16', w: 9, h: 16 },
  { label: '2:3', w: 2, h: 3 },
];

export function AspectRatio() {
  const tool = getTool('aspect-ratio')!;
  const [preset, setPreset] = useState(PRESETS[0]);
  const [bg, setBg] = useState('#ffffff');
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="aspect"
      controls={() => (
        <>
          <Field label="Aspect ratio">
            <div className="flex flex-wrap gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPreset(p)}
                  className={`chip ${preset.label === p.label ? 'border-brand-500 text-brand-600' : ''}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Background">
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-9 w-full cursor-pointer rounded-lg border border-[rgb(var(--border))]"
            />
          </Field>
        </>
      )}
      run={async (file, ctx) => {
        const blob = await aspectRatioCrop(file, preset.w, preset.h, bg);
        ctx.setOutput(blob);
      }}
    />
  );
}
