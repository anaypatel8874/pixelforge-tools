export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>
        PixelForge Tools is designed to minimize data collection and never permanently
        store your images.
      </p>
      <h2>Client-side processing (default)</h2>
      <p>
        For most tools, your image is decoded and processed entirely in your browser
        using the Canvas API. Files are never uploaded.
      </p>
      <h2>Server-side processing</h2>
      <p>
        A small set of tools explicitly state that they need a server step (for example,
        certain conversion or AI features when an external provider is configured). In those
        cases:
      </p>
      <ul>
        <li>Files are processed in temporary memory only.</li>
        <li>We never write uploaded images to permanent storage.</li>
        <li>Validated for MIME type, extension, and size before processing.</li>
        <li>Requests are rate-limited to prevent abuse.</li>
      </ul>
      <h2>Cookies & analytics</h2>
      <p>
        We do not run analytics or tracking by default. If a deployment enables
        <code> NEXT_PUBLIC_ANALYTICS_ENABLED</code>, the user is informed in the UI.
      </p>
      <h2>Contact</h2>
      <p>Privacy questions? See the <a href="/contact">contact page</a>.</p>
    </div>
  );
}
