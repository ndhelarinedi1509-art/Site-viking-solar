'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="flex flex-col items-center text-center">
        {/* Viking Solar Logo SVG */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 32 32"
          fill="none"
          className="mb-8"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="14" stroke="#22C55E" strokeWidth="2.5" />
          <path
            d="M16 6 L18 14 L26 16 L18 18 L16 26 L14 18 L6 16 L14 14 Z"
            fill="#22C55E"
          />
        </svg>

        <h1 className="mb-3 text-4xl font-bold text-white sm:text-5xl">
          Une erreur est survenue
        </h1>

        <p className="mb-8 max-w-md text-gray-400">
          Quelque chose s&apos;est mal passé. Veuillez réessayer.
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-green px-6 py-3 font-semibold text-bg-primary transition-all hover:bg-green-dark hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(34,197,94,0.25)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          Réessayer
        </button>
      </div>
    </main>
  );
}