'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { convertImage } from '@/lib/image/convert';
import { downloadAsZip, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Wand2, Download } from 'lucide-react';

export function JpgToPng() {
  const tool = getTool('jpg-to-png')!;
  const { push } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [output, setOutput] = useState<{ blob: Blob; name: string }[]>([]);

  const handle = async () => {
    if (!files.length) return;
    try {
      const out: { blob: Blob; name: string }[] = [];
      for (const f of files) {
        const blob = await convertImage(f, { type: 'image/png' });
        out.push({ blob, name: suggestFilename(f.name, 'png', 'png') });
      }
      setOutput(out);
      push('success', `Converted ${out.length} image${out.length > 1 ? 's' : ''}.`);
    } catch (e) {
      push('error', e instanceof Error ? e.message : 'Failed.');
    }
  };

  return (
    <ToolLayout
      tool={tool}
      privacyNotice="client"
      onReset={() => {
        setFiles([]);
        setOutput([]);
      }}
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
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={handle}>
                <Wand2 className="h-4 w-4" /> Convert to PNG
              </button>
              <button
                className="btn-secondary"
                disabled={!output.length}
                onClick={async () => {
                  if (output.length === 1) {
                    const { downloadBlob } = await import('@/lib/download');
                    downloadBlob(output[0].blob, output[0].name);
                  } else {
                    await downloadAsZip(output, 'converted.zip');
                  }
                }}
              >
                <Download className="h-4 w-4" /> Download {output.length > 1 ? 'ZIP' : ''}
              </button>
            </div>
          </div>
          <Controls>
            <p className="text-sm text-[rgb(var(--fg-muted))]">Outputs as PNG with optional transparency.</p>
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}