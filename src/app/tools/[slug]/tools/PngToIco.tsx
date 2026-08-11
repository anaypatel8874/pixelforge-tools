'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { pngToIco } from '@/lib/image/convert';
import { downloadBlob, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Wand2, Download } from 'lucide-react';

export function PngToIco() {
  const tool = getTool('png-to-ico')!;
  const { push } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [output, setOutput] = useState<Blob | null>(null);

  const handle = async () => {
    if (!files.length) return;
    try {
      const blob = await pngToIco(files);
      setOutput(blob);
      push('success', 'ICO generated.');
    } catch (e) {
      push('error', e instanceof Error ? e.message : 'Failed.');
    }
  };

  return (
    <ToolLayout
      tool={tool}
      privacyNotice="client"
      onReset={() => { setFiles([]); setOutput(null); }}
      dirty={!!output}
    >
      {files.length === 0 ? (
        <ImageUploader onError={(m) => push('error', m)} onFile={setFiles} hint="Upload a PNG at least 256×256 for a complete multi-size favicon." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {files.map((f, i) => <ImagePreview key={i} src={URL.createObjectURL(f)} />)}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={handle}>
                <Wand2 className="h-4 w-4" /> Build ICO
              </button>
              <button
                className="btn-secondary"
                disabled={!output}
                onClick={() => output && downloadBlob(output, suggestFilename('favicon', 'ico', 'ico'))}
              >
                <Download className="h-4 w-4" /> Download ICO
              </button>
            </div>
          </div>
          <div className="card p-4 text-sm text-[rgb(var(--fg-muted))]">
            Generates a multi-size favicon (16 / 32 / 48 / 64 / 128 / 256 px).
          </div>
        </div>
      )}
    </ToolLayout>
  );
}