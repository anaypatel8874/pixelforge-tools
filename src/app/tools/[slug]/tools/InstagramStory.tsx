'use client';

import { SingleTool } from '@/components/tool/SingleTool';
import { resizeImage } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function InstagramStory() {
  const tool = getTool('instagram-story')!;
  return (
    <SingleTool
      tool={tool}
      downloadSuffix="ig-story"
      downloadExt="jpg"
      controls={() => <p className="text-sm text-[rgb(var(--fg-muted))]">1080×1920 px — Instagram Reels / Story format.</p>}
      run={async (file, ctx) => {
        const blob = await resizeImage(file, {
          width: 1080, height: 1920, fit: 'cover', background: '#000000',
          type: 'image/jpeg', quality: 0.95,
        });
        ctx.setOutput(blob);
      }}
    />
  );
}