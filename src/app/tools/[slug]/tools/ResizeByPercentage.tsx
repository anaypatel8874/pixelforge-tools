'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { fileToImage, makeCanvas, canvasToBlob } from '@/lib/image/core';
import { getTool } from '@/lib/tools';

export function ResizeByPercentage() {
  const tool = getTool('resize-by-percentage')!;
  const [pct, setPct] = useState(50);
  const [quality, setQuality] = useState(0.92);
  return (
    <SingleTool
      tool={tool}
      downloadSuffix={`${pct}pct`}
      downloadExt="jpg"
      controls={() => (
        <>
          <Field label={`Scale: ${pct}%`}>
            <input type="range" min={5} max={400} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`Quality: ${(quality * 100).toFixed(0)}%`}>
            <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
          </Field>
        </>
      )}
      run={async (file, runner) => {
        const img = await fileToImage(file);
        const w = Math.max(1, Math.round((img.width * pct) / 100));
        const h = Math.max(1, Math.round((img.height * pct) / 100));
        const canvas = makeCanvas(w, h);
        const c = canvas.getContext('2d')!;
        c.drawImage(img, 0, 0, w, h);
        const blob = await canvasToBlob(canvas, { type: 'image/jpeg', quality });
        runner.setOutput(blob);
      }}
    />
  );
}