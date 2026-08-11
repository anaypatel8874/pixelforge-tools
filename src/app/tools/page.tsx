'use client';

import { useMemo, useState } from 'react';
import { ALL_TOOLS, CATEGORIES, TOOLS } from '@/lib/tools';
import { ToolCard } from '@/components/site/ToolCard';
import { Search, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ToolsPage() {
  const sp = useSearchParams();
  const initialQ = sp.get('q') ?? '';
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState<string | 'all'>('all');
  const [showReady, setShowReady] = useState(true);

  const results = useMemo(() => {
    let list = ALL_TOOLS;
    if (q) {
      const needle = q.toLowerCase().trim();
      list = list.filter((t) =>
        [
          t.title,
          t.shortDescription,
          t.longDescription,
          t.slug,
          t.category,
          ...(t.keywords || []),
        ]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      );
    }
    if (cat !== 'all') list = list.filter((t) => t.category === cat);
    if (showReady) list = list.filter((t) => t.status === 'ready');
    return list;
  }, [q, cat, showReady]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Image Tools Directory</h1>
          <p className="text-sm text-[rgb(var(--fg-muted))]">
            {TOOLS.length} ready tools · {ALL_TOOLS.length - TOOLS.length} coming soon
          </p>
        </div>
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--fg-muted))]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try “50 kb”, “passport”, “signature”…"
            className="input pl-9"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCat('all')}
          className={`chip ${cat === 'all' ? 'border-brand-500 text-brand-600' : ''}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={`chip ${cat === c.slug ? 'border-brand-500 text-brand-600' : ''}`}
          >
            {c.title}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-xs text-[rgb(var(--fg-muted))]">
          <input
            type="checkbox"
            checked={showReady}
            onChange={(e) => setShowReady(e.target.checked)}
            className="rounded"
          />
          Ready only
        </label>
      </div>

      {results.length === 0 ? (
        <div className="card p-8 text-center text-sm text-[rgb(var(--fg-muted))]">
          No tools match that query yet — try “resize”, “compress”, “OCR”, or pick a category.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-200">
        <ShieldCheck className="h-4 w-4" />
        <p>Every tool runs in your browser. Uploaded images stay on your device.</p>
      </div>
    </div>
  );
}