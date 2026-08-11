'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { stripMetadata } from '@/lib/image/convert';
import { getTool } from '@/lib/tools';

export function RemoveMetadata() {
  const tool = getTool('remove-metadata')!;
  return (
    <SingleTool
      tool={tool}
      showSlider
      downloadSuffix="clean"
      downloadExt="jpg"
      controls={() => <p className="text-sm text-[rgb(var(--fg-muted))]">
        Re-encodes the image so EXIF, GPS and software metadata are dropped. Output is JPEG by default for size; switch to PNG to keep alpha.
      </p>}
      run={async (file, ctx) => {
        const blob = await stripMetadata(file);
        ctx.setOutput(blob);
      }}
    />
  );
}