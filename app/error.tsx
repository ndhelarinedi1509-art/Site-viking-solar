'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  const [savedError, setSavedError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('viking-last-error');
      if (raw) setSavedError(raw);
    } catch (e) {
      // ignore
    }
  }, []);

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
          {t('error.title')}
        </h1>

        <p className="mb-8 max-w-md text-gray-400">
          {t('error.description')}
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
          {t('error.retry')}
        </button>

        <div className="mt-6 text-left text-sm text-gray-400">
          <p className="font-semibold text-white">Détails (pour debug)</p>
          <p className="mt-2 break-words">{error?.message || '—'}</p>
          {error?.stack && (
            <details className="mt-2 whitespace-pre-wrap text-xs text-gray-400">
              <summary className="cursor-pointer">Voir la pile</summary>
              <pre className="mt-2 text-xs">{error.stack}</pre>
            </details>
          )}

          {savedError && (
            <details className="mt-2 whitespace-pre-wrap text-xs text-gray-400">
              <summary className="cursor-pointer">Dernière erreur enregistrée (localStorage)</summary>
              <pre className="mt-2 text-xs">{savedError}</pre>
            </details>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={async () => {
                try {
                  const text = `error: ${error?.message}\nstack: ${error?.stack}\nlocal: ${savedError}`;
                  await navigator.clipboard.writeText(text);
                  alert('Erreur copiée dans le presse-papiers');
                } catch (e) {
                  alert('Impossible de copier — voyez la console');
                }
              }}
              className="rounded bg-white/5 px-3 py-1 text-xs"
            >
              Copier l'erreur
            </button>
            <button
              onClick={async () => {
                try {
                  const payload = savedError ? JSON.parse(savedError) : { message: error?.message, stack: error?.stack };
                  await fetch('/api/client-error', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...payload, page: window.location.href }),
                  });
                  alert('Erreur envoyée au serveur (vérifiez les logs Vercel)');
                } catch (e) {
                  alert("Échec de l'envoi : " + String(e));
                }
              }}
              className="rounded bg-white/5 px-3 py-1 text-xs"
            >
              Envoyer au serveur
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}