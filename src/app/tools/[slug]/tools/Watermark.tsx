'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { useProcessing } from '@/components/tool/useBlob';
import { useToast } from '@/components/ui/Toaster';
import { watermarkImage } from '@/lib/image/filters';
import { downloadAsZip, suggestFilename } from '@/lib/download';
import { getTool } from '@/lib/tools';
import { Wand2, Download, RotateCcw } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export function Watermark() {
  const tool = getTool('watermark')!;
  const proc = useProcessing();
  const { state } = proc;
  const { push } = useToast();
  const [text, setText] = useState('© PixelForge');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#ffffff');
  const [rotation, setRotation] = useState(-30);
  const [opacity, setOpacity] = useState(0.18);
  const [density, setDensity] = useState(4);

  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ name: string; blob: Blob }[]>([]);
  const [busy, setBusy] = useState(false);

  const handleRun = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const out: { name: string; blob: Blob }[] = [];
      for (const f of files) {
        const blob = await watermarkImage(f, {
          text,
          fontSize,
          color,
          rotation,
          opacity,
          density,
        });
        out.push({ name: suggestFilename(f.name, 'watermark', 'png'), blob });
      }
      setResults(out);
      push('success', `Processed ${out.length} image${out.length > 1 ? 's' : ''}.`);
    } catch (e) {
      push('error', e instanceof Error ? e.message : 'Failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    if (results.length === 1) {
      downloadAsZip([], '');
      const { downloadBlob } = await import('@/lib/download');
      downloadBlob(results[0].blob, results[0].name);
      return;
    }
    await downloadAsZip(results, 'watermarked.zip');
  };

  return (
    <ToolLayout
      tool={tool}
      privacyNotice="client"
      onReset={() => {
        setFiles([]);
        setResults([]);
        proc.reset();
      }}
      dirty={results.length > 0}
      processing={busy}
    >
      {files.length === 0 && (
        <ImageUploader
          multiple
          onError={(m) => push('error', m)}
          onFile={(list) => setFiles(list)}
        />
      )}
      {files.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {files.map((f, i) => (
                <ImagePreview
                  key={i}
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                />
              ))}
            </div>
            <p className="text-xs text-[rgb(var(--fg-muted))]">
              {files.length} image{files.length > 1 ? 's' : ''} ready · {formatBytes(files.reduce((s, f) => s + f.size, 0))}
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={handleRun} disabled={busy}>
                <Wand2 className="h-4 w-4" /> Apply Watermark
              </button>
              <button className="btn-secondary" onClick={handleDownload} disabled={!results.length}>
                <Download className="h-4 w-4" /> Download {results.length > 1 ? 'ZIP' : ''}
              </button>
              <button className="btn-ghost" onClick={() => { setFiles([]); setResults([]); }}>
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Controls>
            <Field label="Watermark text">
              <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
            </Field>
            <Field label={`Font size: ${fontSize}px`}>
              <input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label="Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-full rounded-lg border border-[rgb(var(--border))]" />
            </Field>
            <Field label={`Rotation: ${rotation}°`}>
              <input type="range" min={-90} max={90} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label={`Opacity: ${(opacity * 100).toFixed(0)}%`}>
              <input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label={`Density: ${density}`} hint="Higher = more repetitions">
              <input type="range" min={1} max={8} value={density} onChange={(e) => setDensity(Number(e.target.value))} className="w-full" />
            </Field>
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}
