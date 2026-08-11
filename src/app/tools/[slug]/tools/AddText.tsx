'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { addText } from '@/lib/image/filters';
import { downloadBlob, downloadAsZip, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Wand2, Download } from 'lucide-react';

const FONTS = ['Inter, system-ui, sans-serif', 'Georgia, serif', 'Courier New, monospace', 'Impact, sans-serif'];

export function AddText() {
  const tool = getTool('add-text')!;
  const { push } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('PixelForge');
  const [font, setFont] = useState(FONTS[0]);
  const [size, setSize] = useState(48);
  const [color, setColor] = useState('#ffffff');
  const [stroke, setStroke] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [shadow, setShadow] = useState(true);
  const [bg, setBg] = useState('rgba(0,0,0,0)');
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [x, setX] = useState(0.5);
  const [y, setY] = useState(0.85);
  const [output, setOutput] = useState<{ blob: Blob; name: string }[]>([]);

  const handle = async () => {
    if (!files.length) return;
    try {
      const out: { blob: Blob; name: string }[] = [];
      for (const f of files) {
        const blob = await addText(f, {
          text,
          font,
          size,
          color,
          background: bg,
          stroke: strokeWidth > 0 ? stroke : undefined,
          strokeWidth,
          shadow,
          rotation,
          opacity,
          x,
          y,
        });
        out.push({ blob, name: suggestFilename(f.name, 'text', 'png') });
      }
      setOutput(out);
      push('success', `Rendered ${out.length} image${out.length > 1 ? 's' : ''}.`);
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {files.map((f, i) => (
                <ImagePreview key={i} src={URL.createObjectURL(f)} />
              ))}
            </div>
            {output[0] && (
              <ImagePreview src={URL.createObjectURL(output[0].blob)} />
            )}
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={handle}>
                <Wand2 className="h-4 w-4" /> Render
              </button>
              <button
                className="btn-secondary"
                disabled={!output.length}
                onClick={async () => {
                  if (output.length === 1) {
                    downloadBlob(output[0].blob, output[0].name);
                  } else {
                    await downloadAsZip(output, 'text-overlay.zip');
                  }
                }}
              >
                <Download className="h-4 w-4" /> Download {output.length > 1 ? 'ZIP' : ''}
              </button>
            </div>
          </div>
          <Controls>
            <Field label="Text">
              <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
            </Field>
            <Field label="Font">
              <select className="input" value={font} onChange={(e) => setFont(e.target.value)}>
                {FONTS.map((f) => (
                  <option key={f} value={f}>{f.split(',')[0]}</option>
                ))}
              </select>
            </Field>
            <Field label={`Size: ${size}px`}>
              <input type="range" min={8} max={300} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label="Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-[rgb(var(--border))]" />
            </Field>
            <Field label={`Stroke: ${strokeWidth}px`}>
              <input type="range" min={0} max={10} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label="Stroke color">
              <input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-[rgb(var(--border))]" />
            </Field>
            <Field label={`Rotation: ${rotation}°`}>
              <input type="range" min={-180} max={180} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label={`Opacity: ${(opacity * 100).toFixed(0)}%`}>
              <input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label={`Position X: ${(x * 100).toFixed(0)}%`}>
              <input type="range" min={0} max={1} step={0.05} value={x} onChange={(e) => setX(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label={`Position Y: ${(y * 100).toFixed(0)}%`}>
              <input type="range" min={0} max={1} step={0.05} value={y} onChange={(e) => setY(Number(e.target.value))} className="w-full" />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} />
              Drop shadow
            </label>
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}