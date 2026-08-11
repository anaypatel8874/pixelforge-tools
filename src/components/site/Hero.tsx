'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Wand2 } from 'lucide-react';
import { ImageUploader } from '@/components/tool/ImageUploader';
import { useToast } from '@/components/ui/Toaster';
import { ALL_TOOLS } from '@/lib/tools';
import { ToolCard } from '@/components/site/ToolCard';
import { useFileToTool } from '@/components/site/useFileToTool';

export function Hero() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const { push } = useToast();
  const onPick = useFileToTool();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return router.push('/tools');
    router.push(`/tools?q=${encodeURIComponent(q)}`);
  };

  const popular = ALL_TOOLS.filter((t) => t.popular && t.status === 'ready').slice(0, 4);

  return (
    <section className="relative overflow-hidden surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="chip mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Processed locally · Nothing uploaded
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            All Your Image Tools <br />
            <span className="gradient-text">in One Place</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[rgb(var(--fg-muted))]">
            Resize, compress, convert, enhance, crop and edit images instantly.
            Free, fast, and your files never leave your device unless absolutely necessary.
          </p>

          <form onSubmit={onSearch} className="mt-6 flex max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--fg-muted))]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search image tools…"
                className="input pl-9"
              />
            </div>
            <button className="btn-primary" type="submit">
              Search
            </button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:max-w-md">
            {popular.map((t) => (
              <ToolCard key={t.slug} tool={t} compact />
            ))}
          </div>
        </div>

        <div>
          <ImageUploader
            hint="Drop an image and we'll suggest the right tool."
            onError={(m) => push('error', m)}
            onFile={(files) => onPick(files[0])}
          />
          <p className="mt-2 text-center text-xs text-[rgb(var(--fg-muted))]">
            By uploading you agree to our <Link className="underline" href="/terms">Terms</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}