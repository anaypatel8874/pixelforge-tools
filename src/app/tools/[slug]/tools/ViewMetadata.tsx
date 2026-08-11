'use client';

import { useEffect, useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { fileToImage } from '@/lib/image/core';
import { readExif, type RawMetadata } from '@/lib/image/metadata';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { formatBytes } from '@/lib/utils';

export function ViewMetadata() {
  const tool = getTool('view-metadata')!;
  const { push } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<RawMetadata | null>(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      try {
        const img = await fileToImage(file);
        const m = await readExif(file);
        m.dimensions = { width: img.width, height: img.height };
        setMeta(m);
      } catch (e) {
        push('error', e instanceof Error ? e.message : 'Could not read EXIF.');
      }
    })();
  }, [file, push]);

  return (
    <ToolLayout tool={tool} privacyNotice="client">
      {!file && (
        <ImageUploader onError={(m) => push('error', m)} onFile={(f) => setFile(f[0])} />
      )}
      {file && meta && (
        <div className="card p-4">
          <h3 className="font-semibold">File</h3>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
            <Row label="Name" value={meta.file.name} />
            <Row label="Size" value={formatBytes(meta.file.size)} />
            <Row label="Type" value={meta.file.type || '—'} />
            {meta.dimensions && (
              <Row label="Dimensions" value={`${meta.dimensions.width}×${meta.dimensions.height}px`} />
            )}
          </dl>
          {meta.exif && (
            <>
              <h3 className="mt-6 font-semibold">EXIF</h3>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(meta.exif).map(([k, v]) => (
                  <Row key={k} label={k} value={String(v)} />
                ))}
              </dl>
            </>
          )}
          {!meta.exif && (
            <p className="mt-4 text-sm text-[rgb(var(--fg-muted))]">
              No EXIF metadata found. The image may have been re-encoded or never had EXIF.
            </p>
          )}
        </div>
      )}
    </ToolLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-[rgb(var(--fg-muted))]">{label}</dt>
      <dd className="break-all">{value}</dd>
    </>
  );
}
