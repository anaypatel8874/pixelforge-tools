'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function YoutubeThumbnail() {
  const tool = getTool('youtube-thumbnail')!;
  return (
    <SingleTool
      tool={tool}
      downloadSuffix="yt-thumb"
      downloadExt="jpg"
      controls={() => <p className="text-sm text-[rgb(var(--fg-muted))]">1280×720 px — the recommended YouTube thumbnail size.</p>}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: 1280, height: 720, fit: 'cover', background: '#000000',
          type: 'image/jpeg', quality: 0.95,
        });
        ctx.setOutput(blob);
      }}
    />
  );
}