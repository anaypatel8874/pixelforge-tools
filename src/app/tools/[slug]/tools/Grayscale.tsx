'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { grayscale } from '@/lib/image/filters';
import { getTool } from '@/lib/tools';

export function Grayscale() {
  const tool = getTool('grayscale')!;
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="gray"
      controls={() => <p className="text-sm text-[rgb(var(--fg-muted))]">Drops all color information and keeps only luminance.</p>}
      run={async (file, ctx) => {
        const blob = await grayscale(file);
        ctx.setOutput(blob);
      }}
    />
  );
}