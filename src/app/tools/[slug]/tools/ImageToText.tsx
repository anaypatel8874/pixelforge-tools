'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Copy, Download, Wand2 } from 'lucide-react';

declare global {
  interface Window {
    Tesseract?: any;
  }
}

export function ImageToText() {
  const tool = getTool('image-to-text')!;
  const { push } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState('eng');

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      // Dynamic import so the heavy lib only loads when the user actually runs OCR.
      const mod: any = await import('tesseract.js');
      const Tesseract = mod.default || mod;
      const { data } = await Tesseract.recognize(file, lang, {
        logger: () => undefined,
      });
      setText(data.text || '');
      push('success', 'OCR complete.');
    } catch (e) {
      push('error', e instanceof Error ? e.message : 'OCR failed.');
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name?.replace(/\.[^.]+$/, '') ?? 'extracted') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    push('success', 'Copied to clipboard.');
  };

  return (
    <ToolLayout
      tool={tool}
      privacyNotice="client"
      onReset={() => {
        setFile(null);
        setText('');
      }}
      dirty={!!text}
      processing={busy}
    >
      {!file && <ImageUploader onError={(m) => push('error', m)} onFile={(f) => setFile(f[0])} />}
      {file && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <ImagePreview src={URL.createObjectURL(file)} alt={file.name} loading={busy} />
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={run} disabled={busy}>
                <Wand2 className="h-4 w-4" /> Extract Text
              </button>
              <button className="btn-secondary" onClick={copy} disabled={!text}>
                <Copy className="h-4 w-4" /> Copy
              </button>
              <button className="btn-secondary" onClick={download} disabled={!text}>
                <Download className="h-4 w-4" /> Download .txt
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Controls>
              <Field label="Language">
                <select className="input" value={lang} onChange={(e) => setLang(e.target.value)}>
                  <option value="eng">English</option>
                  <option value="hin">Hindi</option>
                  <option value="eng+hin">English + Hindi</option>
                </select>
              </Field>
            </Controls>
            <textarea
              readOnly
              value={text}
              className="input min-h-[280px] resize-y whitespace-pre-wrap font-mono text-xs"
              placeholder="Recognized text will appear here."
            />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}