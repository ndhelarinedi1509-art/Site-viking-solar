'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleLang = () => {
    const next = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(next);
    localStorage.setItem('viking-lang', next);
    document.documentElement.lang = next;
  };

  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={toggleLang}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[0.7rem] font-bold tracking-wider text-gray-400 transition-all duration-300 hover:border-green/30 hover:bg-green/10 hover:text-green uppercase"
      aria-label="Changer la langue"
    >
      {i18n.language === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}
