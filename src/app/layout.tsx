import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { Toaster, ToastProvider } from '@/components/ui/Toaster';
import { ThemeProvider } from '@/components/site/ThemeProvider';
import { CommandPaletteProvider } from '@/components/site/CommandPaletteProvider';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'PixelForge Tools — Every Image Tool You Need',
    template: '%s · PixelForge Tools',
  },
  description:
    'PixelForge Tools: a fast, free, privacy-first image toolkit. Resize, compress, convert, crop, and edit images directly in your browser.',
  applicationName: 'PixelForge Tools',
  keywords: ['image tools', 'compress', 'resize', 'convert', 'pdf', 'crop', 'passport photo'],
  openGraph: {
    title: 'PixelForge Tools — Every Image Tool You Need',
    description:
      'Compress, resize, convert, and edit images instantly. 100% free, runs in your browser.',
    type: 'website',
    url: '/',
  },
  twitter: { card: 'summary_large_image', title: 'PixelForge Tools' },
  icons: { icon: '/favicon.ico' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0e16' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <ToastProvider>
            <CommandPaletteProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </CommandPaletteProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
