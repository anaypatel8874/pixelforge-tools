import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, readyToolsByCategory } from '@/lib/tools';
import { ToolCard } from '@/components/site/ToolCard';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) return { title: 'Category not found' };
  return { title: `${cat.title} Tools`, description: cat.description };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) notFound();
  const tools = readyToolsByCategory(cat.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{cat.title}</h1>
      <p className="mt-1 max-w-2xl text-[rgb(var(--fg-muted))]">{cat.description}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
      {tools.length === 0 && (
        <div className="card mt-8 p-8 text-center text-sm text-[rgb(var(--fg-muted))]">
          Tools for this category are coming soon.{' '}
          <Link href="/tools" className="text-brand-600 underline">Browse all tools</Link>.
        </div>
      )}
    </div>
  );
}
