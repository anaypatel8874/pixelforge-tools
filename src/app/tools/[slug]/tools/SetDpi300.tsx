'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { resizeImage, fileToImageLocal } from '@/lib/image/resize';
import { getTool } from '@/lib/tools';

export function SetDpi300() {
  const tool = getTool('set-dpi-300')!;
  const [dpi, setDpi] = useState(300);
  return (
    <SingleTool
      tool={tool}
      downloadSuffix={`dpi${dpi}`}
      downloadExt="jpg"
      controls={() => (
        <Field label={`DPI: ${dpi}`} hint="DPI is informational; visual quality depends on pixel dimensions, not DPI.">
          <input type="range" min={72} max={600} step={1} value={dpi} onChange={(e) => setDpi(Number(e.target.value))} className="w-full" />
        </Field>
      )}
      run={async (file, ctx) => {
        const img = await fileToImageLocal(file);
        const blob = await resizeImage(file, {
          width: img.width,
          height: img.height,
          fit: 'stretch',
          type: 'image/jpeg',
          quality: 0.95,
        });
        const tagged = await tagJpegWithDpi(blob, dpi);
        ctx.setOutput(tagged);
      }}
    />
  );
}

async function tagJpegWithDpi(blob: Blob, dpi: number): Promise<Blob> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  if (!(buf[0] === 0xff && buf[1] === 0xd8)) return blob;
  const dpiBuf = new Uint8Array(18);
  dpiBuf[0] = 0xff; dpiBuf[1] = 0xe0;
  dpiBuf[2] = 0x00; dpiBuf[3] = 0x10;
  const jfif = 'JFIF\0';
  for (let i = 0; i < jfif.length; i++) dpiBuf[4 + i] = jfif.charCodeAt(i);
  dpiBuf[9] = 0x01; dpiBuf[10] = 0x01; dpiBuf[11] = 0x01;
  dpiBuf[12] = (dpi >> 8) & 0xff; dpiBuf[13] = dpi & 0xff;
  dpiBuf[14] = (dpi >> 8) & 0xff; dpiBuf[15] = dpi & 0xff;
  dpiBuf[16] = 0; dpiBuf[17] = 0;
  const merged = new Uint8Array(buf.length + dpiBuf.length);
  merged.set(buf.slice(0, 2), 0);
  merged.set(dpiBuf, 2);
  merged.set(buf.slice(2), 2 + dpiBuf.length);
  return new Blob([merged], { type: 'image/jpeg' });
}
