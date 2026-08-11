export const metadata = { title: 'Login' };

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="text-sm text-[rgb(var(--fg-muted))]">
        Login is optional. The image tools work without an account. This page is
        a stub for future saved presets and history.
      </p>
      <input className="input" placeholder="Email" disabled />
      <input className="input" placeholder="Password" disabled type="password" />
      <button className="btn-primary" disabled>Sign in (coming soon)</button>
    </div>
  );
}
