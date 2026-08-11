'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { compressImage } from '@/lib/image/compress';
import { downloadAsZip, downloadBlob, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Wand2, Download } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export function ImageCompressor() {
  const tool = getTool('image-compressor')!;
  const { push } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [type, setType] = useState('image/jpeg');
  const [maxWidth, setMaxWidth] = useState(0);
  const [output, setOutput] = useState<{ blob: Blob; name: string }[]>([]);

  const handle = async () => {
    if (!files.length) return;
    try {
      const out: { blob: Blob; name: string }[] = [];
      for (const f of files) {
        const blob = await compressImage(f, {
          quality,
          type,
          maxWidth: maxWidth > 0 ? maxWidth : undefined,
        });
        out.push({ blob, name: suggestFilename(f.name, 'compressed', type === 'image/png' ? 'png' : 'jpg') });
      }
      setOutput(out);
      push('success', `Compressed ${out.length} image${out.length > 1 ? 's' : ''}.`);
    } catch (e) {
      push('error', e instanceof Error ? e.message : 'Failed.');
    }
  };

  const totalBefore = files.reduce((s, f) => s + f.size, 0);
  const totalAfter = output.reduce((s, o) => s + o.blob.size, 0);
  const saved = totalBefore - totalAfter;

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
            {output[0] && <ImagePreview src={URL.createObjectURL(output[0].blob)} alt="compressed" />}
            <p className="text-xs text-[rgb(var(--fg-muted))]">
              Total: {formatBytes(totalBefore)} → {formatBytes(totalAfter)}{' '}
              {saved > 0 && <span className="text-emerald-600">({(saved / totalBefore * 100).toFixed(0)}% saved)</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={handle}>
                <Wand2 className="h-4 w-4" /> Compress
              </button>
              <button
                className="btn-secondary"
                disabled={!output.length}
                onClick={async () => {
                  if (output.length === 1) downloadBlob(output[0].blob, output[0].name);
                  else await downloadAsZip(output, 'compressed.zip');
                }}
              >
                <Download className="h-4 w-4" /> Download {output.length > 1 ? 'ZIP' : ''}
              </button>
            </div>
          </div>
          <Controls>
            <Field label={`Quality: ${(quality * 100).toFixed(0)}%`}>
              <input type="range" min={0.05} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label="Output">
              <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WEBP</option>
                <option value="image/png">PNG (lossless)</option>
              </select>
            </Field>
            <Field label="Max width (0 = no resize)" hint="Optional: shrink dimensions to compress further">
              <input type="number" className="input" value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value) || 0)} />
            </Field>
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}