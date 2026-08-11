'use client';

import Link from 'next/link';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { ToolIcon } from './IconRegistry';
import { cn } from '@/lib/utils';

export function ToolCard({ tool, compact }: { tool: Tool; compact?: boolean }) {
  const isReady = tool.status === 'ready';
  const href = isReady ? `/tools/${tool.slug}` : `/tools/${tool.slug}?preview=1`;
  return (
    <Link
      href={href}
      className={cn(
        'card group relative flex h-full flex-col p-4 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md',
        !isReady && 'opacity-90'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-fuchsia-500/20 text-brand-600 dark:text-brand-300">
          <ToolIcon name={tool.icon} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{tool.title}</h3>
            {tool.popular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300">
                <BadgeCheck className="h-3 w-3" />
                Popular
              </span>
            )}
          </div>
          {!compact && (
            <p className="mt-0.5 line-clamp-2 text-xs text-[rgb(var(--fg-muted))]">
              {tool.shortDescription}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-[rgb(var(--fg-muted))]">{isReady ? 'Ready' : 'Coming soon'}</span>
        <span className="inline-flex items-center gap-1 text-brand-600 opacity-0 transition group-hover:opacity-100">
          Open <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
