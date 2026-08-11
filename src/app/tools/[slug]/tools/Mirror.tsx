'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { flipImage } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function Mirror() {
  const tool = getTool('mirror')!;
  const [dir, setDir] = useState<'horizontal' | 'vertical'>('horizontal');
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="mirror"
      controls={() => (
        <Field label="Direction">
          <div className="flex gap-2">
            <button
              type="button"
              className={`btn-secondary flex-1 ${dir === 'horizontal' ? 'border-brand-500 text-brand-600' : ''}`}
              onClick={() => setDir('horizontal')}
            >
              Horizontal
            </button>
            <button
              type="button"
              className={`btn-secondary flex-1 ${dir === 'vertical' ? 'border-brand-500 text-brand-600' : ''}`}
              onClick={() => setDir('vertical')}
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