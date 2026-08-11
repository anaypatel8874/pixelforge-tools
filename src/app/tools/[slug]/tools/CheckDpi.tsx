'use client';

import { useEffect, useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { fileToImage } from '@/lib/image/core';
import { readExif, detectDpi } from '@/lib/image/metadata';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { formatBytes } from '@/lib/utils';

export function CheckDpi() {
  const tool = getTool('check-dpi')!;
  const { push } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<{ width: number; height: number; dpi: number | null } | null>(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      try {
        const img = await fileToImage(file);
        const dpi = await detectDpi(file);
        setInfo({ width: img.width, height: img.height, dpi });
      } catch (e) {
        push('error', e instanceof Error ? e.message : 'Failed.');
      }
    })();
  }, [file, push]);

  return (
    <ToolLayout tool={tool} privacyNotice="client">
      {!file && <ImageUploader onError={(m) => push('error', m)} onFile={(f) => setFile(f[0])} />}
      {file && info && (
        <div className="card p-4">
          <h3 className="font-semibold">{file.name}</h3>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
            <dt className="text-[rgb(var(--fg-muted))]">File size</dt>
            <dd>{formatBytes(file.size)}</dd>
            <dt className="text-[rgb(var(--fg-muted))]">Pixel dimensions</dt>
            <dd>{info.width}×{info.height}px</dd>
            <dt className="text-[rgb(var(--fg-muted))]">DPI (from EXIF)</dt>
            <dd>{info.dpi ?? 'No DPI tag — defaults to 96 in most software.'}</dd>
            <dt className="text-[rgb(var(--fg-muted))]">Print at 300 DPI</dt>
            <dd>
              {(info.width / 300).toFixed(2)}&times;{(info.height / 300).toFixed(2)} inches
            </dd>
          </dl>
        </div>
      )}
    </ToolLayout>
  );
}
