'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { compressToTarget } from '@/lib/image/compress';
import { downloadAsZip, downloadBlob, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Wand2, Download } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export function CompressToTarget({ target, suffix }: { target: number; suffix?: string }) {
  const tool = getTool(
    suffix === '50kb' ? 'compress-to-50kb' : suffix === '100kb' ? 'compress-to-100kb' : suffix === '200kb' ? 'compress-to-200kb' : 'compress-to-500kb'
  )!;
  const { push } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [output, setOutput] = useState<{ blob: Blob; name: string; quality: number }[]>([]);

  const handle = async () => {
    if (!files.length) return;
    try {
      const out: { blob: Blob; name: string; quality: number }[] = [];
      for (const f of files) {
        const result = await compressToTarget(f, target);
        out.push({
          blob: result.blob,
          quality: result.quality,
          name: suggestFilename(f.name, `le${target}`, 'jpg'),
        });
      }
      setOutput(out);
      push('success', `All images ≤ ${formatBytes(target)}.`);
    } catch (e) {
      push('error', e instanceof Error ? e.message : 'Failed.');
    }
  };

  return (
    <ToolLayout
      tool={tool}
      privacyNotice="client"
      onReset={() => { setFiles([]); setOutput([]); }}
      dirty={output.length > 0}
    >
      {files.length === 0 ? (
        <ImageUploader multiple onError={(m) => push('error', m)} onFile={setFiles} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {files.map((f, i) => <ImagePreview key={i} src={URL.createObjectURL(f)} />)}
            </div>
            {output[0] && <ImagePreview src={URL.createObjectURL(output[0].blob)} />}
            <p className="text-xs text-[rgb(var(--fg-muted))]">
              Target: ≤ {formatBytes(target)} per image. Final image quality auto-selected to keep the file as small as possible.
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={handle}>
                <Wand2 className="h-4 w-4" /> Compress to target
              </button>
              <button
                className="btn-secondary"
                disabled={!output.length}
                onClick={async () => {
                  if (output.length === 1) downloadBlob(output[0].blob, output[0].name);
                  else await downloadAsZip(output, `compressed-${target}.zip`);
                }}
              >
                <Download className="h-4 w-4" /> Download {output.length > 1 ? 'ZIP' : ''}
              </button>
            </div>
          </div>
          <Controls>
            <p className="text-sm text-[rgb(var(--fg-muted))]">
              Algorithm: tries JPEG quality 0.92 → 0.12, then downscales dimensions by 0.85 each loop, until the file fits the target.
            </p>
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}