'use client';

import { I18nextProvider as Provider } from 'react-i18next';
import i18n from '@/lib/i18n/config';
import { useEffect, useState } from 'react';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('viking-lang');
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return <Provider i18n={i18n}>{children}</Provider>;
}
