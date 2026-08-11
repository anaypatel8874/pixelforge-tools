import Link from 'next/link';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="skeleton h-10 w-48 rounded-xl" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-32 rounded-2xl" />
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-[rgb(var(--fg-muted))]">
        Loading… need help? <Link className="text-brand-600 underline" href="/faq">FAQ</Link>
      </p>
    </div>
  );
}
