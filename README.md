# PixelForge Tools

> Every Image Tool You Need — Fast, Free & Private.

PixelForge Tools is a production-ready image utility platform that runs almost entirely in your browser. Resize, compress, convert, crop, edit, OCR, and combine images — and download them — without ever uploading them to a server.

## Features

- **150+ tools** across 16 categories (basic editing, effects, AI, resize, government presets, social media, format converters, image-to-PDF, compression, DPI, signature, GIF, metadata, collage, advanced color & light).
- **Privacy-first**: client-side processing wherever possible. Tools that do need a server are clearly flagged and never persist files.
- **Pluggable AI**: an `aiProvider` abstraction lets you plug in OpenAI / Replicate later. Today every AI tool has a working algorithm-based fallback.
- **Batch processing**: every tool that supports multiple images gives you a multi-file dropzone, individual or ZIP download.
- **Exact-size compression**: an iterative JPEG/WebP quality + dimension optimizer hits targets like 50 KB / 100 KB / 200 KB / 500 KB.
- **OCR** via Tesseract.js (English, Hindi, English + Hindi), with a clear path to swap in a server OCR.
- **PDF export** via jsPDF with page size, margin, orientation, and quality controls.
- **Tool-specific UX**: before/after slider, reset, dirty-state guard, histogram-free preview, toast notifications, drag-and-drop, paste-to-upload.
- **Dark mode** with system preference.
- **SEO**: per-tool dynamic routes, sitemap, robots, JSON-LD, Open Graph, canonical.
- **Accessibility**: focus rings, ARIA labels, keyboard navigation, color contrast.
- **Mobile-first** responsive UI with horizontal category scroller and a sticky action bar.

## Tech stack

- **Next.js 14** (App Router)
- **React 18**, **TypeScript** (strict)
- **Tailwind CSS**
- **Lucide icons**
- **jsPDF** for PDF generation
- **JSZip** + **file-saver** for ZIP downloads
- **Tesseract.js** for OCR
- **Canvas API** for image processing
- Web Workers, offscreen `Canvas` where appropriate

## Getting started

```bash
# 1. Install
npm install

# 2. (Optional) Configure providers
cp .env.example .env.local
# Edit .env.local — leave empty to use local algorithm fallback.

# 3. Run the dev server
npm run dev

# 4. Production build
npm run build
npm run start
```

## Environment variables

| Variable                      | Purpose                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `OPENAI_API_KEY`              | Optional. When set, AI tools can route to OpenAI's image variations API. |
| `AI_PROVIDER`                 | `openai` (or leave empty for local fallback).                            |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Off by default. Set `true` to opt in.                                  |
| `NEXT_PUBLIC_SITE_URL`        | Used for canonical URLs and sitemap.                                     |
| `MAX_UPLOAD_BYTES`            | Hard cap for any server-side endpoint. Default 20 MB.                    |
| `RATE_LIMIT_PER_MINUTE`       | Basic rate limit on API routes.                                          |

## Project structure

```
src/
├── app/                    # Next.js app router
│   ├── tools/[slug]/       # Dynamic tool pages
│   ├── categories/[category]/
│   ├── about/              # About, privacy, terms, contact, FAQ
│   ├── sitemap.ts          # Generated sitemap.xml
│   └── robots.ts           # Generated robots.txt
├── components/
│   ├── site/               # Header, Footer, Hero, ThemeProvider, etc.
│   ├── tool/               # Reusable tool UI: ImageUploader, BeforeAfterSlider, etc.
│   └── ui/                 # Toaster, generic primitives
└── lib/
    ├── image/              # Core image processing (resize, compress, pdf, ai, etc.)
    ├── tools.ts            # Tool registry (single source of truth)
    ├── types.ts            # Type definitions
    ├── utils.ts            # cn(), formatBytes(), etc.
    └── download.ts         # Blob / ZIP utilities
```

## Security & privacy

- **MIME + extension verification** for every upload.
- **File-size limits** (default 20 MB) and easy configuration.
- **Rate limiting** on API routes.
- **No permanent storage** — server-side tools flush in-memory data immediately.
- **Object URLs revoked** on unmount to prevent memory leaks.
- **No tracking** by default. Analytics is opt-in via env var.

## Adding a new tool

1. Add an entry to `src/lib/tools.ts` (slug, title, category, status, etc.).
2. Create a component in `src/app/tools/[slug]/tools/MyTool.tsx` using `SingleTool` for a single image or `useProcessing` + `Controls` for batch.
3. Register the slug in the `REGISTRY` object in `src/app/tools/[slug]/ToolClient.tsx`.
4. Implement the image-processing logic in `src/lib/image/…` (or use existing helpers).

## Roadmap

- HEIC decoder using `heic2any` (already installed).
- Web Workers for heavy filters.
- User accounts for saved presets (no auth required for core tools).
- Admin dashboard with feature flags.

## License

MIT — use freely, attribution appreciated.
