export const metadata = { title: 'About PixelForge Tools' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose dark:prose-invert">
      <h1>About PixelForge Tools</h1>
      <p>
        PixelForge Tools is a free, privacy-first image utility platform. We
        built it because image tooling on the web is full of opaque uploads,
        aggressive ads, and broken downloads. Every tool we ship is meant to be
        fast, transparent, and put you back in control of your files.
      </p>
      <h2>How we build</h2>
      <ul>
        <li>Client-side wherever possible — your image stays on your device.</li>
        <li>For server steps, files live in memory only and are dropped after use.</li>
        <li>Pluggable architecture: an AI provider can be wired in via env vars, but every tool also has a local fallback.</li>
      </ul>
      <h2>Contact</h2>
      <p>
        Questions or feature requests? See the <a href="/contact">contact page</a>.
      </p>
    </div>
  );
}
