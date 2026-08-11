'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { enhance } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function Enhance() {
  const tool = getTool('enhance')!;
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="enhanced"
      controls={() => (
        <div className="text-sm text-[rgb(var(--fg-muted))]">
          <p>
            Applies an algorithm-based enhancer: brightness, contrast, saturation
            and a mild sharpen. To use a heavier AI model, set
            <code className="ml-1 rounded bg-[rgb(var(--bg-alt))] px-1">OPENAI_API_KEY</code>
            and connect your provider (provider abstraction lives in <code>lib/ai</code>).
          </p>
        </div>
      )}
      run={async (file, ctx) => {
        const blob = await enhance(file);
        ctx.setOutput(blob);
      }}
    />
  );
}