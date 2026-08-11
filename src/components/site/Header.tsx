'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Image as ImageIcon,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Sparkles,
  Wrench,
  FileText,
  Film,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useCommandPalette } from './CommandPaletteProvider';
import { CATEGORIES, searchTools } from '@/lib/tools';
import { cn } from '@/lib/utils';

export function Header() {
  const path = usePathname();
  const router = useRouter();
  const { resolved, setTheme, theme } = useTheme();
  const { open } = useCommandPalette();
  const [openMenu, setOpenMenu] = useState(false);
  const [openCats, setOpenCats] = useState(false);
  const [q, setQ] = useState('');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const hits = searchTools(q);
    if (hits.length === 1) {
      router.push(`/tools/${hits[0].slug}`);
    } else if (hits.length > 1) {
      router.push(`/tools?q=${encodeURIComponent(q)}`);
    } else {
      router.push(`/tools?q=${encodeURIComponent(q)}`);
    }
    setQ('');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            PixelForge
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          <NavLink href="/tools" icon={<Wrench className="h-4 w-4" />} label="Image Tools" active={path === '/tools'} />
          <NavLink href="/categories/pdf" icon={<FileText className="h-4 w-4" />} label="PDF Tools" active={path.startsWith('/categories/pdf')} />
          <NavLink href="/categories/gif" icon={<Film className="h-4 w-4" />} label="GIF Tools" active={path.startsWith('/categories/gif')} />
          <NavLink href="/categories/ai" icon={<Sparkles className="h-4 w-4" />} label="AI Tools" active={path.startsWith('/categories/ai')} />
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden flex-1 max-w-md md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--fg-muted))]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={open}
              placeholder="Search image tools…"
              className="input pl-9"
              aria-label="Search tools"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <div className="relative">
            <button
              className="btn-ghost hidden md:inline-flex"
              onClick={() => setOpenCats((v) => !v)}
              aria-expanded={openCats}
            >
              Categories <ChevronDown className="h-4 w-4" />
            </button>
            {openCats && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-2 shadow-xl"
                onMouseLeave={() => setOpenCats(false)}
              >
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-[rgb(var(--bg-alt))]"
                    onClick={() => setOpenCats(false)}
                  >
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-[rgb(var(--fg-muted))]">{c.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            className="btn-ghost"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
          >
            {resolved === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link href="/login" className="btn-secondary hidden md:inline-flex">
            Login
          </Link>

          <button
            className="btn-ghost md:hidden"
            aria-label="Open menu"
            onClick={() => setOpenMenu(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {openMenu && (
        <div className="fixed inset-0 z-50 bg-[rgb(var(--bg))] md:hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--border))]">
            <span className="font-semibold">Menu</span>
            <button onClick={() => setOpenMenu(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search image tools…"
              className="input"
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="rounded-xl border border-[rgb(var(--border))] p-3"
                  onClick={() => setOpenMenu(false)}
                >
                  <div className="text-sm font-medium">{c.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'btn-ghost gap-1',
        active && 'bg-[rgb(var(--bg-alt))] text-[rgb(var(--fg))]'
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
