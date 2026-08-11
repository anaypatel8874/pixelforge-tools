import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_TOOLS, getTool, TOOLS } from '@/lib/tools';
import { ToolClient } from './ToolClient';

export function generateStaticParams() {
  return ALL_TOOLS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug);
  if (!tool) return { title: 'Tool not found' };
  return {
    title: tool.title,
    description: tool.longDescription || tool.shortDescription,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title: tool.title, description: tool.shortDescription },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const related = TOOLS.filter(
    (t) => t.category === tool.category && t.slug !== tool.slug
  )
    .slice(0, 4)
    .map((t) => ({ slug: t.slug, title: t.title }));

  return <ToolClient tool={tool} related={related} />;
}