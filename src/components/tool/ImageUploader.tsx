'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload, ImagePlus, X } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';

const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,image/bmp';
const MAX_DEFAULT = 50 * 1024 * 1024; // 50 MB

export function ImageUploader({
  onFile,
  maxBytes = MAX_DEFAULT,
  multiple = false,
  hint,
  onError,
}: {
  onFile: (files: File[]) => void;
  maxBytes?: number;
  multiple?: boolean;
  hint?: string;
  onError?: (message: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  const handle = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const valid: File[] = [];
    for (const f of list) {
      if (!/^image\//.test(f.type) && !/\.(png|jpe?g|webp|gif|bmp|heic|heif|ico)$/i.test(f.name)) {
        onError?.(`Unsupported file type: ${f.name}`);
        continue;
      }
      if (f.size > maxBytes) {
        onError?.(`${f.name} is too large (max ${formatBytes(maxBytes)}).`);
        continue;
      }
      valid.push(f);
    }
    if (valid.length) {
      onFile(multiple ? valid : [valid[0]]);
      const names = valid.map((v) => v.name);
      setRecent((r) => [...names, ...r].slice(0, 3));
    }
  };

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = Array.from(e.clipboardData.items);
      const files: File[] = [];
      for (const it of items) {
        if (it.kind === 'file') {
          const f = it.getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length) handle({ ...({ length: files.length, item: (i: number) => files[i] } as any) } as FileList);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        'card relative flex flex-col items-center justify-center gap-3 p-8 text-center transition',
        hover && 'ring-2 ring-brand-500/50 border-brand-300/50'
      )}
      onDragEnter={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        handle(e.dataTransfer.files);
      }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-fuchsia-500/20 text-brand-600 dark:text-brand-300">
        <Upload className="h-7 w-7" />
      </div>
      <div>
        <p className="text-base font-medium">
          Drop an image{multiple ? 's' : ''} here, paste, or
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="ml-1 text-brand-600 underline-offset-2 hover:underline"
          >
            browse
          </button>
        </p>
        <p className="mt-1 text-xs text-[rgb(var(--fg-muted))]">
          {hint || 'JPG, PNG, WEBP, GIF up to 50 MB. Server-side tools clearly say so.'}
        </p>
      </div>
      <input
        ref={ref}
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
      {recent.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-[rgb(var(--fg-muted))]">
          <ImagePlus className="h-3.5 w-3.5" />
          {recent.map((n, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-[rgb(var(--bg-alt))] px-2 py-0.5">
              {n}
              <button
                onClick={() => setRecent((r) => r.filter((_, idx) => idx !== i))}
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
