'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { imagesToPdf, type PageSize, type Orientation } from '@/lib/image/pdf';
import { downloadBlob, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Wand2, Download, GripVertical } from 'lucide-react';

export function ImagesToPdf() {
  const tool = getTool('images-to-pdf')!;
  const { push } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [margin, setMargin] = useState(10);
  const [quality, setQuality] = useState(0.85);
  const [fit, setFit] = useState<'cover' | 'contain'>('contain');
  const [output, setOutput] = useState<Blob | null>(null);

  const move = (i: number, dir: -1 | 1) => {
    const next = [...files];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setFiles(next);
  };

  const handle = async () => {
    if (!files.length) return;
    try {
      const blob = await imagesToPdf(files, { pageSize, orientation, margin, quality, fit });
      setOutput(blob);
      push('success', `PDF ready (${files.length} page${files.length > 1 ? 's' : ''}).`);
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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {files.map((f, i) => (
                <div key={i} className="relative">
                  <ImagePreview src={URL.createObjectURL(f)} alt={f.name} />
                  <div className="absolute left-1 top-1 flex gap-1 rounded-md bg-black/60 px-1 py-0.5 text-[10px] text-white">
                    <button onClick={() => move(i, -1)} aria-label="Move up">↑</button>
                    <button onClick={() => move(i, 1)} aria-label="Move down">↓</button>
                  </div>
                  <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={handle}>
                <Wand2 className="h-4 w-4" /> Build PDF
              </button>
              <button
                className="btn-secondary"
                disabled={!output}
                onClick={() => output && downloadBlob(output, suggestFilename('images', 'pdf', 'pdf'))}
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>
          <Controls>
            <Field label="Page size">
              <select className="input" value={pageSize} onChange={(e) => setPageSize(e.target.value as any)}>
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="original">Original image size</option>
              </select>
            </Field>
            <Field label="Orientation">
              <select className="input" value={orientation} onChange={(e) => setOrientation(e.target.value as any)}>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </Field>
            <Field label={`Margin: ${margin} mm`}>
              <input type="range" min={0} max={30} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label={`Quality: ${(quality * 100).toFixed(0)}%`}>
              <input type="range" min={0.3} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label="Fit">
              <select className="input" value={fit} onChange={(e) => setFit(e.target.value as any)}>
                <option value="contain">Contain (fit inside, pad white)</option>
                <option value="cover">Cover (fill, crop excess)</option>
              </select>
            </Field>
            <p className="text-xs text-[rgb(var(--fg-muted))]">Reorder pages with the ↑ ↓ buttons.</p>
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}