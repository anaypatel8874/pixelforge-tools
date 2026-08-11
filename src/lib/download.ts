import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export function downloadBlob(blob: Blob, filename: string) {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function downloadAsZip(
  files: { blob: Blob; filename?: string; name?: string }[],
  zipName: string
) {
  const zip = new JSZip();
  for (const f of files) {
    const fn = f.filename ?? f.name ?? `file-${Math.random().toString(36).slice(2, 8)}`;
    zip.file(fn, f.blob);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, zipName);
}

export function suggestFilename(name: string, suffix: string, ext: string) {
  const base = (name.replace(/\.[^.]+$/, '') || 'image')
    .replace(/[^a-z0-9_\-]+/gi, '_')
    .slice(0, 40);
  return `${base}_${suffix}.${ext.replace(/^\./, '')}`;
}
