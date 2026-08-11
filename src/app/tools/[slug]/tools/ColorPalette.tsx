'use client';

import { useEffect, useState } from 'react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { ImagePreview } from '@/components/tool/ImagePreview';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { colorPalette } from '@/lib/image/filters';
import { useToast } from '@/components/ui/Toaster';
import { getTool } from '@/lib/tools';
import { Copy } from 'lucide-react';

export function ColorPalette() {
  const tool = getTool('color-palette')!;
  const { push } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    if (!file) return;
    (async () => {
      try {
        setColors(await colorPalette(file, 8));
      } catch (e) {
        push('error', e instanceof Error ? e.message : 'Failed.');
      }
    })();
  }, [file, push]);

  return (
    <ToolLayout tool={tool} privacyNotice="client" onReset={() => setFile(null)}>
      {!file && <ImageUploader onError={(m) => push('error', m)} onFile={(f) => setFile(f[0])} />}
      {file && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ImagePreview src={URL.createObjectURL(file)} />
          <div className="card p-4">
            <p className="text-sm text-[rgb(var(--fg-muted))]">
              Dominant colors. Click a swatch to copy its HEX.
            </p>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    navigator.clipboard?.writeText(c);
                    push('success', `Copied ${c}`);
                  }}
                  className="group"
                  aria-label={`Copy ${c}`}
                >
                  <div className="aspect-square w-full rounded-lg border border-[rgb(var(--border))]" style={{ background: c }} />
                  <p className="mt-1 text-xs">{c}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}