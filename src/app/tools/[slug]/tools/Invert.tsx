'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { invert } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function Invert() {
  const tool = getTool('invert-image')!;
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="inverted"
      controls={() => <p className="text-sm text-[rgb(var(--fg-muted))]">Inverts every pixel: 0→255, 255→0. Useful for negatives.</p>}
      run={async (file, ctx) => {
        const blob = await invert(file);
        ctx.setOutput(blob);
      }}
    />
  );
}