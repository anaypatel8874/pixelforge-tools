import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="text-5xl font-bold gradient-text">404</div>
      <h1 className="mt-2 text-xl font-semibold">Tool not found</h1>
      <p className="mt-2 text-sm text-[rgb(var(--fg-muted))]">
        The page you're looking for may have been moved or doesn't exist yet.
      </p>
      <Link href="/tools" className="btn-primary mt-6">Browse all tools</Link>
    </div>
  );
}
