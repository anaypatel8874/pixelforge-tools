'use client';

import { useState } from 'react';
import { SingleTool } from '@/components/tool/SingleTool';
import { Field } from '@/components/tool/ToolLayout';
import { padImageToSize } from '@/lib/image/compress';
import { getTool } from '@/lib/tools';

export function IncreaseSizeKb() {
  const tool = getTool('increase-size-kb')!;
  const [targetKb, setTargetKb] = useState(100);
  return (
    <SingleTool
      tool={tool}
      downloadSuffix={`min${targetKb}kb`}
      downloadExt="jpg"
      controls={() => (
        <>
          <Field label={`Target (KB): ${targetKb}`}>
            <input type="number" className="input" min={1} value={targetKb} onChange={(e) => setTargetKb(Math.max(1, Number(e.target.value)))} />
          </Field>
          <p className="text-xs text-[rgb(var(--fg-muted))]">
            Adds a neutral metadata segment to nudge the file above the target. <strong>Visual quality is unchanged.</strong>
          </p>
        </>
      )}
      run={async (file, ctx) => {
        const target = targetKb * 1024;
        if (file.size >= target) {
          ctx.setOutput(await file.arrayBuffer().then((b) => new Blob([b], { type: file.type })));
          return;
        }
        const { blob } = await padImageToSize(file, target);
        ctx.setOutput(blob);
      }}
    />
  );
}