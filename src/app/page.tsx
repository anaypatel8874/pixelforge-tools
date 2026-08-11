import Link from 'next/link';
import { ALL_TOOLS, CATEGORIES, TOOLS } from '@/lib/tools';
import { CategoryCard } from '@/components/site/CategoryCard';
import { ToolCard } from '@/components/site/ToolCard';
import { Hero } from '@/components/site/Hero';
import { JsonLd } from '@/components/site/JsonLd';

export default function Home() {
  const popular = ALL_TOOLS.filter((t) => t.popular).slice(0, 8);
  return (
    <div>
      <JsonLd />
      <Hero />

      {/* Popular tools */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Popular Tools</h2>
          <Link href="/tools" className="text-sm text-brand-600 hover:underline">
            View all {TOOLS.length} tools →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {popular.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Categories</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>
    </div>
  );
}