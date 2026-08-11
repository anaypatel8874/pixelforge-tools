import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/lib/types';
import { ToolIcon } from './IconRegistry';
import { cn } from '@/lib/utils';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className={cn(
          'absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl',
          category.accent
        )}
      />
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-fuchsia-500/20 text-brand-600 dark:text-brand-300">
          <ToolIcon name={category.icon} className="h-5 w-5" />
        </div>
        <h3 className="mt-3 text-sm font-semibold">{category.title}</h3>
        <p className="mt-1 text-xs text-[rgb(var(--fg-muted))]">{category.description}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs text-brand-600 transition group-hover:translate-x-0.5">
          Explore <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
