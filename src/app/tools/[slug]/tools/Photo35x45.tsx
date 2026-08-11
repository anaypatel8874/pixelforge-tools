'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function Photo35x45() {
  const tool = getTool('photo-35x45')!;
  return (
    <SingleTool
      tool={tool}
      downloadSuffix="35x45"
      downloadExt="jpg"
      controls={() => (
        <p className="text-sm text-[rgb(var(--fg-muted))]">
          Crops / fits to 35×45 mm at 300 DPI (≈ 413×531 px). Always verify the latest requirements on the official portal.
        </p>
      )}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: Math.round((35 / 25.4) * 300),
          height: Math.round((45 / 25.4) * 300),
          fit: 'cover',
          background: '#ffffff',
          type: 'image/jpeg',
          quality: 0.95,
        });
        ctx.setOutput(blob);
      }}
    />
  );
}
