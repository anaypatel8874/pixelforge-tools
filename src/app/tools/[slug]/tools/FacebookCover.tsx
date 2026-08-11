'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function FacebookCover() {
  const tool = getTool('facebook-cover')!;
  return (
    <SingleTool
      tool={tool}
      downloadSuffix="fb-cover"
      downloadExt="jpg"
      controls={() => <p className="text-sm text-[rgb(var(--fg-muted))]">1640×859 px — Facebook cover photo.</p>}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: 1640, height: 859, fit: 'cover', background: '#ffffff',
          type: 'image/jpeg', quality: 0.95,
        });
        ctx.setOutput(blob);
      }}
    />
  );
}