'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
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
          {t('error.notFoundTitle')}
        </h1>

        <p className="mb-8 max-w-md text-gray-400">
          {t('error.notFoundDescription')}
        </p>

        <Link
          href="/"
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
            <path d="M19 12H5m7-7-7 7 7 7" />
          </svg>
          {t('error.goHome')}
        </Link>
      </div>
    </main>
  );
}