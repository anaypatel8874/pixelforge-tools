export const metadata = { title: 'FAQ' };

const FAQ = [
  { q: 'Are the tools really free?', a: 'Yes. Every PixelForge tool is free to use without an account.' },
  { q: 'Do my images get uploaded?', a: 'For most tools, no — your image is processed locally in the browser. Tools that need a server are clearly marked.' },
  { q: 'Which formats are supported?', a: 'JPG, PNG, WEBP, and (where applicable) GIF. HEIC requires an extra decoder; the PNG / ICO path is currently the closest.' },
  { q: 'Can I batch-process?', a: 'Tools that support multiple images show a multi-file dropzone. Outputs can be downloaded individually or as a ZIP.' },
  { q: 'Where is my data stored?', a: 'Nowhere. Closing the tab discards everything.' },
  { q: 'Do you use AI?', a: 'Some tools use algorithm-based fallbacks today; when you set the relevant env var, an AI provider can be wired in. We tell you which mode is active.' },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h1>
      <div className="mt-6 grid gap-3">
        {FAQ.map((f) => (
          <details key={f.q} className="card p-4">
            <summary className="cursor-pointer text-sm font-medium">{f.q}</summary>
            <p className="mt-2 text-sm text-[rgb(var(--fg-muted))]">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
