'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { resizeImage } from '@/lib/image/resize';
import { circleCrop } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function WhatsappDp() {
  const tool = getTool('whatsapp-dp')!;
  const [circle, setCircle] = useState(true);
  return (
    <SingleTool
      tool={tool}
      downloadSuffix="wa-dp"
      downloadExt="jpg"
      controls={() => (
        <Field label="Shape">
          <div className="flex gap-2">
            <button
              type="button"
              className={`btn-secondary flex-1 ${circle ? 'border-brand-500 text-brand-600' : ''}`}
              onClick={() => setCircle(true)}
            >
              Circle
            </button>
            <button
              type="button"
              className={`btn-secondary flex-1 ${!circle ? 'border-brand-500 text-brand-600' : ''}`}
              onClick={() => setCircle(false)}
            >
              Square
            </button>
          </div>
        </Field>
      )}
      run={async (file, ctx) => {
        if (circle) {
          const blob = await circleCrop(file, 'rgba(0,0,0,0)');
          ctx.setOutput(blob);
        } else {
          const blob = await resizeImage(file, {
            width: 500, height: 500, fit: 'cover', background: '#ffffff',
            type: 'image/jpeg', quality: 0.95,
          });
          ctx.setOutput(blob);
        }
      }}
    />
  );
}