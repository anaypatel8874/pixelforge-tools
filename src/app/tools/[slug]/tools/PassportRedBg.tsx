'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function PassportRedBg() {
  const tool = getTool('passport-red-bg')!;
  return (
    <SingleTool
      tool={tool}
      downloadSuffix="red-bg"
      downloadExt="jpg"
      controls={() => (
        <p className="text-sm text-[rgb(var(--fg-muted))]">
          Photo cropped to 35×45 mm at 300 DPI with a red background. Always verify the latest requirements on the official portal.
        </p>
      )}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: Math.round((35 / 25.4) * 300),
          height: Math.round((45 / 25.4) * 300),
          fit: 'cover',
          background: '#c0392b',
          type: 'image/jpeg',
          quality: 0.95,
        });
        ctx.setOutput(blob);
      }}
    />
  );
}
