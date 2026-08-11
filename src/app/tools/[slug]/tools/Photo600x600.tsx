'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function Photo600x600() {
  const tool = getTool('photo-600x600')!;
  return (
    <SingleTool
      tool={tool}
      downloadSuffix="600x600"
      downloadExt="jpg"
      controls={() => (
        <p className="text-sm text-[rgb(var(--fg-muted))]">
          Crops to 600×600 px (US visa style). Always verify the latest requirements on the official portal.
        </p>
      )}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: 600,
          height: 600,
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
