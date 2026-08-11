import type { MetadataRoute } from 'next';
import { ALL_TOOLS, CATEGORIES } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const now = new Date();
  const staticRoutes = ['/', '/tools', '/about', '/privacy', '/terms', '/contact', '/faq'];
  return [
    ...staticRoutes.map((p) => ({ url: `${base}${p}`, lastModified: now })),
    ...CATEGORIES.map((c) => ({ url: `${base}/categories/${c.slug}`, lastModified: now })),
    ...ALL_TOOLS.map((t) => ({ url: `${base}/tools/${t.slug}`, lastModified: now })),
  ];
}
