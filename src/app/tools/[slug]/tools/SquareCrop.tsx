'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { squareCrop } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function SquareCrop() {
  const tool = getTool('square-crop')!;
  const [bg, setBg] = useState<string>('transparent');
  const [custom, setCustom] = useState('#ffffff');
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="square"
      controls={() => (
        <>
          <Field label="Background">
            <div className="grid grid-cols-4 gap-2">
              {['transparent', '#ffffff', '#000000', '#0EA5E9'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBg(c)}
                  className={`h-9 rounded-lg border ${bg === c ? 'border-brand-500' : 'border-[rgb(var(--border))]'}`}
                  style={{
                    background:
                      c === 'transparent'
                        ? 'repeating-conic-gradient(#e5e7eb 0% 25%, #fff 25% 50%) 50%/12px 12px'
                        : c,
                  }}
                />
              ))}
            </div>
          </Field>
          {bg === 'transparent' ? null : (
            <Field label="Custom color">
              <input
                type="color"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setBg(e.target.value);
                }}
                className="h-9 w-full cursor-pointer rounded-lg border border-[rgb(var(--border))]"
              />
            </Field>
          )}
        </>
      )}
      run={async (file, ctx) => {
        const blob = await squareCrop(file, bg === 'transparent' ? 'rgba(0,0,0,0)' : bg);
        ctx.setOutput(blob);
      }}
    />
  );
}
