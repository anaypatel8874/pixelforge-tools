'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { mergePhotoSignature } from '@/lib/image/join';
import { downloadBlob, suggestFilename } from '@/lib/download';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Wand2, Download } from 'lucide-react';

export function MergePhotoSignature() {
  const tool = getTool('merge-photo-signature')!;
  const { push } = useToast();
  const [photo, setPhoto] = useState<File | null>(null);
  const [sig, setSig] = useState<File | null>(null);
  const [output, setOutput] = useState<Blob | null>(null);
  const [width, setWidth] = useState(413);
  const [height, setHeight] = useState(531);
  const [sigW, setSigW] = useState(180);
  const [margin, setMargin] = useState(20);
  const [placement, setPlacement] = useState<'bottom-right' | 'bottom-left' | 'bottom-center'>(
    'bottom-right'
  );

  const handleRun = async () => {
    if (!photo || !sig) return;
    try {
      const blob = await mergePhotoSignature(photo, sig, {
        photoWidth: width,
        photoHeight: height,
        signatureWidth: sigW,
        signatureHeight: 60,
        placement,
        margin,
      });
      setOutput(blob);
      push('success', 'Merged. Use Download to save.');
    } catch (e) {
      push('error', e instanceof Error ? e.message : 'Failed.');
    }
  };

  return (
    <ToolLayout
      tool={tool}
      privacyNotice="client"
      onReset={() => {
        setPhoto(null);
        setSig(null);
        setOutput(null);
      }}
      dirty={!!output}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="label mb-2">Photo</p>
          {!photo ? (
            <ImageUploader onError={(m) => push('error', m)} onFile={(files) => setPhoto(files[0])} />
          ) : (
            <ImagePreview src={URL.createObjectURL(photo)} />
          )}
        </div>
        <div>
          <p className="label mb-2">Signature</p>
          {!sig ? (
            <ImageUploader onError={(m) => push('error', m)} onFile={(files) => setSig(files[0])} />
          ) : (
            <ImagePreview src={URL.createObjectURL(sig)} />
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-3">
          {output && (
            <ImagePreview src={URL.createObjectURL(output)} />
          )}
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={handleRun} disabled={!photo || !sig}>
              <Wand2 className="h-4 w-4" /> Merge
            </button>
            <button
              className="btn-secondary"
              disabled={!output}
              onClick={() => {
                if (!output) return;
                downloadBlob(output, suggestFilename(photo?.name ?? 'photo', 'merged', 'png'));
              }}
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>
        <Controls>
          <Field label={`Photo width: ${width}px`}>
            <input type="range" min={100} max={2000} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`Photo height: ${height}px`}>
            <input type="range" min={100} max={2000} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`Signature width: ${sigW}px`}>
            <input type="range" min={40} max={500} value={sigW} onChange={(e) => setSigW(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`Margin: ${margin}px`}>
            <input type="range" min={0} max={100} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label="Placement">
            <select className="input" value={placement} onChange={(e) => setPlacement(e.target.value as any)}>
              <option value="bottom-right">Bottom right</option>
              <option value="bottom-left">Bottom left</option>
              <option value="bottom-center">Bottom center</option>
            </select>
          </Field>
        </Controls>
      </div>
    </ToolLayout>
  );
}
