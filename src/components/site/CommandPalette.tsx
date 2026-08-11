'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Wrench, ArrowRight } from 'lucide-react';
import { ALL_TOOLS, searchTools } from '@/lib/tools';

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const router = useRouter();
  const results = useMemo(() => searchTools(q).slice(0, 12), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const go = (slug: string) => {
    onClose();
    router.push(`/tools/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[rgb(var(--border))] px-4">
          <Search className="h-4 w-4 text-[rgb(var(--fg-muted))]" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 100+ image tools…"
            className="flex-1 bg-transparent py-3 text-sm outline-none"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-[rgb(var(--fg-muted))]">
              {q.length === 0 ? 'Type to search.' : 'No tools match that query.'}
            </div>
          )}
          {results.map((t) => (
            <button
              key={t.slug}
              onClick={() => go(t.slug)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-[rgb(var(--bg-alt))]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/20 to-fuchsia-500/20 text-brand-700 dark:text-brand-300">
                <Wrench className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{t.title}</div>
                <div className="truncate text-xs text-[rgb(var(--fg-muted))]">{t.shortDescription}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-[rgb(var(--fg-muted))]" />
            </button>
          ))}
        </div>
        <div className="border-t border-[rgb(var(--border))] px-4 py-2 text-[11px] text-[rgb(var(--fg-muted))]">
          {ALL_TOOLS.length} tools available · Press Esc to close
        </div>
      </div>
    </div>
  );
}
