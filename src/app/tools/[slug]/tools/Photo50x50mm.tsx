'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function Photo50x50mm() {
  const tool = getTool('photo-50x50mm')!;
  return (
    <SingleTool
      tool={tool}
      downloadSuffix="50x50"
      downloadExt="jpg"
      controls={() => (
        <p className="text-sm text-[rgb(var(--fg-muted))]">
          Crops to 50×50 mm at 300 DPI (≈ 591×591 px). Always verify the latest requirements on the official portal.
        </p>
      )}
      run={async (file, ctx) => {
        const px = Math.round((50 / 25.4) * 300);
        const blob = await resizeImage(file, {
          width: px,
          height: px,
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
