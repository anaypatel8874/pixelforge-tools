'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { flipImage } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function FlipImage() {
  const tool = getTool('flip-image')!;
  const [dir, setDir] = useState<'horizontal' | 'vertical'>('horizontal');
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="flipped"
      controls={() => (
        <Field label="Direction">
          <div className="flex gap-2">
            <button
              className={`btn-secondary flex-1 ${dir === 'horizontal' ? 'border-brand-500 text-brand-600' : ''}`}
              onClick={() => setDir('horizontal')}
              type="button"
            >
              Horizontal
            </button>
            <button
              className={`btn-secondary flex-1 ${dir === 'vertical' ? 'border-brand-500 text-brand-600' : ''}`}
              onClick={() => setDir('vertical')}
              type="button"
            >
              Vertical
            </button>
          </div>
        </Field>
      )}
      run={async (file, ctx) => {
        const blob = await flipImage(file, dir);
        ctx.setOutput(blob);
      }}
    />
  );
}
