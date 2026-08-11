'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function InstagramPost() {
  const tool = getTool('instagram-post')!;
  return (
    <SingleTool
      tool={tool}
      downloadSuffix="ig-post"
      downloadExt="jpg"
      controls={() => <p className="text-sm text-[rgb(var(--fg-muted))]">1080×1080 px square — the standard Instagram post format.</p>}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: 1080, height: 1080, fit: 'cover', background: '#ffffff',
          type: 'image/jpeg', quality: 0.95,
        });
        ctx.setOutput(blob);
      }}
    />
  );
}