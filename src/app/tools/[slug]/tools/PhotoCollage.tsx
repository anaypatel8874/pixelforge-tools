'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { makeCollage } from '@/lib/image/join';
import { downloadBlob, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Wand2, Download } from 'lucide-react';

export function PhotoCollage() {
  const tool = getTool('photo-collage')!;
  const { push } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [layout, setLayout] = useState<'grid-2' | 'grid-3' | 'grid-4' | 'grid-6'>('grid-4');
  const [spacing, setSpacing] = useState(8);
  const [bg, setBg] = useState('#ffffff');
  const [radius, setRadius] = useState(20);
  const [output, setOutput] = useState<Blob | null>(null);

  const handle = async () => {
    if (!files.length) return;
    try {
      const blob = await makeCollage(files, { layout, spacing, background: bg, cornerRadius: radius });
      setOutput(blob);
      push('success', 'Collage ready.');
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
        <ImageUploader multiple onError={(m) => push('error', m)} onFile={setFiles} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {files.map((f, i) => <ImagePreview key={i} src={URL.createObjectURL(f)} />)}
            </div>
            {output && <ImagePreview src={URL.createObjectURL(output)} />}
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={handle}>
                <Wand2 className="h-4 w-4" /> Build Collage
              </button>
              <button
                className="btn-secondary"
                disabled={!output}
                onClick={() => output && downloadBlob(output, suggestFilename('collage', 'grid', 'png'))}
              >
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
          </div>
          <Controls>
            <Field label="Layout">
              <select className="input" value={layout} onChange={(e) => setLayout(e.target.value as any)}>
                <option value="grid-2">2 columns</option>
                <option value="grid-3">3 columns</option>
                <option value="grid-4">2 × 2 (4 photos)</option>
                <option value="grid-6">3 × 2 (6 photos)</option>
              </select>
            </Field>
            <Field label={`Spacing: ${spacing}px`}>
              <input type="range" min={0} max={80} value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label="Background">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-full rounded-lg border border-[rgb(var(--border))]" />
            </Field>
            <Field label={`Corner radius: ${radius}px`}>
              <input type="range" min={0} max={300} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" />
            </Field>
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}