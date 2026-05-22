'use client';

export default function Error({reset}: {error: Error; reset: () => void}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-8 shadow-card">
      <h2 className="text-xl font-semibold text-ink">Something needs another pass</h2>
      <p className="mt-2 text-sm text-muted">The app shell loaded, but this view hit a runtime error.</p>
      <button
        className="mt-5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-button transition hover:bg-brand-hover"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
