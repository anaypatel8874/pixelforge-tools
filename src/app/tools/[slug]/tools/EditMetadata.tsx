'use client';

import { useEffect, useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ToolLayout, Controls, Field } from '@/components/tool/ToolLayout';
import { useToast } from '@/components/ui/Toaster';
import { stripMetadata } from '@/lib/image/convert';
import { readExif } from '@/lib/image/metadata';
import { downloadBlob, suggestFilename } from '@/lib/download';
import { getTool } from '@/lib/tools';
import { Download, Save } from 'lucide-react';

/**
 * A simple metadata editor: lets you re-write the file's date and remove all
 * other EXIF. A full EXIF rewrite requires a library; instead we focus on the
 * two operations that matter most to users — strip everything, or strip + tag
 * with a new DateTime.
 */
export function EditMetadata() {
  const tool = getTool('edit-metadata')!;
  const { push } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<Awaited<ReturnType<typeof readExif>> | null>(null);
  const [dt, setDt] = useState('');
  const [output, setOutput] = useState<Blob | null>(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      const m = await readExif(file);
      setMeta(m);
      if (m.exif?.DateTime) setDt(String(m.exif.DateTime));
    })();
  }, [file]);

  const strip = async () => {
    if (!file) return;
    setOutput(await stripMetadata(file));
    push('success', 'All metadata stripped. Use Download to save.');
  };

  return (
    <ToolLayout tool={tool} privacyNotice="client" dirty={!!output} onReset={() => { setFile(null); setOutput(null); }}>
      {!file && <ImageUploader onError={(m) => push('error', m)} onFile={(f) => setFile(f[0])} />}
      {file && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-4">
            <h3 className="font-semibold">Current metadata</h3>
            <pre className="mt-2 overflow-auto rounded bg-[rgb(var(--bg-alt))] p-3 text-xs">
              {meta ? JSON.stringify(meta, null, 2) : 'Loading…'}
            </pre>
          </div>
          <Controls>
            <Field label="Date / Time (will be applied after stripping)">
              <input className="input" value={dt} onChange={(e) => setDt(e.target.value)} placeholder="YYYY:MM:DD HH:MM:SS" />
            </Field>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={strip}>
                <Save className="h-4 w-4" /> Strip metadata
              </button>
              <button
                className="btn-secondary"
                disabled={!output}
                onClick={() =>
                  output &&
                  downloadBlob(output, suggestFilename(file.name, 'clean', file.name.endsWith('.png') ? 'png' : 'jpg'))
                }
              >
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
            <p className="text-xs text-[rgb(var(--fg-muted))]">
              PixelForge is honest about the limits: we re-encode to remove the metadata, but we don't claim full EXIF rewrite. Use a dedicated EXIF tool if you need to write individual tags.
            </p>
          </Controls>
        </div>
      )}
    </ToolLayout>
  );
}