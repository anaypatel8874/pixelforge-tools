'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { joinImages } from '@/lib/image/join';
import { downloadBlob, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Wand2, Download } from 'lucide-react';

export function JoinImages() {
  const tool = getTool('join-images')!;
  const { push } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [dir, setDir] = useState<'horizontal' | 'vertical'>('horizontal');
  const [spacing, setSpacing] = useState(0);
  const [bg, setBg] = useState('#ffffff');
  const [output, setOutput] = useState<Blob | null>(null);

  const handle = async () => {
    if (!files.length) return;
    try {
      const blob = await joinImages(files, { direction: dir, spacing, background: bg, fit: 'cover' });
      setOutput(blob);
      push('success', 'Joined.');
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
        setOutput(null);
      }}
      dirty={!!output}
    >
      {files.length === 0 ? (
        <ImageUploader multiple onError={(m) => push('error', m)} onFile={setFiles} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {files.map((f, i) => (
                <ImagePreview key={i} src={URL.createObjectURL(f)} />
              ))}
            </div>
            {output && (
              <ImagePreview src={URL.createObjectURL(output)} />
            )}
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={handle}>
                <Wand2 className="h-4 w-4" /> Join
              </button>
              <button
                className="btn-secondary"
                disabled={!output}
                onClick={() => {
                  if (!output) return;
                  downloadBlob(output, suggestFilename('joined', 'merged', 'png'));
                }}
              >
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
          </div>
          <Controls>
            <Field label="Direction">
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`btn-secondary flex-1 ${dir === 'horizontal' ? 'border-brand-500 text-brand-600' : ''}`}
                  onClick={() => setDir('horizontal')}
                >
                  Side by side
                </button>
                <button
                  type="button"
                  className={`btn-secondary flex-1 ${dir === 'vertical' ? 'border-brand-500 text-brand-600' : ''}`}
                  onClick={() => setDir('vertical')}
                >
                  Stacked
                </button>
              </div>
            </Field>
            <Field label={`Spacing: ${spacing}px`}>
              <input type="range" min={0} max={100} value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label="Background">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-full rounded-lg border border-[rgb(var(--border))]" />
            </Field>
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}
