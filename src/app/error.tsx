'use client';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-[rgb(var(--fg-muted))]">
        {error?.message ?? 'Unknown error.'}
      </p>
      <button onClick={() => reset()} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}
