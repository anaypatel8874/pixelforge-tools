'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function TwitterPost() {
  const tool = getTool('twitter-post')!;
  return (
    <SingleTool
      tool={tool}
      downloadSuffix="x-post"
      downloadExt="jpg"
      controls={() => <p className="text-sm text-[rgb(var(--fg-muted))]">1600×900 px — X / Twitter post image format (16:9).</p>}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: 1600, height: 900, fit: 'cover', background: '#ffffff',
          type: 'image/jpeg', quality: 0.95,
        });
        ctx.setOutput(blob);
      }}
    />
  );
}