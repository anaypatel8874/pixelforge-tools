export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>
        By using PixelForge Tools you agree to use the service for lawful purposes
        only. You retain all rights to your uploaded content.
      </p>
      <h2>No warranty</h2>
      <p>
        The tools are provided "as is" without warranty of any kind. While we test
        common inputs, always verify critical outputs (passport photos, print files,
        application submissions) against the latest official requirements.
      </p>
      <h2>Service availability</h2>
      <p>
        We may pause or remove individual tools while we improve them. The directory
        will always reflect what's currently working.
      </p>
    </div>
  );
}
