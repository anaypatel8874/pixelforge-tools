'use client';

import Link from 'next/link';
import { ChevronRight, Download, RotateCcw, AlertCircle, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import type { Tool } from '@/lib/types';
import { useToast } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

export function ToolLayout({
  tool,
  children,
  onReset,
  onDownload,
  downloadLabel,
  dirty,
  processing,
  error,
  privacyNotice = 'client',
  related,
}: {
  tool: Tool;
  children: React.ReactNode;
  onReset?: () => void;
  onDownload?: () => void;
  downloadLabel?: string;
  dirty?: boolean;
  processing?: boolean;
  error?: string;
  privacyNotice?: 'client' | 'server';
  related?: { slug: string; title: string }[];
}) {
  const { push } = useToast();

  useEffect(() => {
    if (error) push('error', error);
  }, [error, push]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-[rgb(var(--fg-muted))]">
        <Link href="/" className="hover:text-[rgb(var(--fg))]">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/tools" className="hover:text-[rgb(var(--fg))]">Tools</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/categories/${tool.category}`} className="hover:text-[rgb(var(--fg))] capitalize">{tool.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[rgb(var(--fg))]">{tool.title}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{tool.title}</h1>
        <p className="mt-2 max-w-3xl text-[rgb(var(--fg-muted))]">{tool.longDescription}</p>
      </header>

      {privacyNotice === 'client' ? (
        <div className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-200">
          <ShieldCheck className="mt-0.5 h-4 w-4" />
          <p>Your images are processed locally. Nothing is uploaded to a server.</p>
        </div>
      ) : (
        <div className="mb-4 flex items-start gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <p>
            This tool needs a server-side step. Files are processed in temporary memory and never stored permanently.
          </p>
        </div>
      )}

      {children}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="btn-secondary"
            disabled={processing}
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        )}
        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            className="btn-primary"
            disabled={processing || !dirty}
          >
            <Download className="h-4 w-4" /> {downloadLabel || 'Download'}
          </button>
        )}
      </div>

      {tool.tips && tool.tips.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Tips</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg-muted))]">
            {tool.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {tool.faq && tool.faq.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">FAQ</h2>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            {tool.faq.map((f, i) => (
              <details key={i} className="card p-4">
                <summary className="cursor-pointer text-sm font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-[rgb(var(--fg-muted))]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {related && related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Related Tools</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/tools/${r.slug}`}
                className="card p-3 hover:border-brand-500"
              >
                <p className="text-sm font-medium">{r.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function Controls({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('card flex flex-col gap-4 p-4', className)}>{children}</div>;
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-[rgb(var(--fg-muted))]">{hint}</span>}
    </label>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--bg-alt))]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 transition-[width]"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
