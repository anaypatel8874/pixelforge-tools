import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/tools';

export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold">PixelForge Tools</span>
          </Link>
          <p className="mt-3 max-w-xs text-[rgb(var(--fg-muted))]">
            Every image tool you need — fast, free, and private.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Tools</h4>
          <ul className="mt-2 space-y-1 text-[rgb(var(--fg-muted))]">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:text-[rgb(var(--fg))]">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">More</h4>
          <ul className="mt-2 space-y-1 text-[rgb(var(--fg-muted))]">
            {CATEGORIES.slice(6).map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:text-[rgb(var(--fg))]">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-2 space-y-1 text-[rgb(var(--fg-muted))]">
            <li><Link href="/about" className="hover:text-[rgb(var(--fg))]">About</Link></li>
            <li><Link href="/privacy" className="hover:text-[rgb(var(--fg))]">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-[rgb(var(--fg))]">Terms</Link></li>
            <li><Link href="/contact" className="hover:text-[rgb(var(--fg))]">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-[rgb(var(--fg))]">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[rgb(var(--border))] py-4 text-center text-xs text-[rgb(var(--fg-muted))]">
        © {new Date().getFullYear()} PixelForge Tools · Built for privacy — your images stay on your device whenever possible.
      </div>
    </footer>
  );
}
