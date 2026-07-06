'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function AdminContentPage() {
  const { t } = useTranslation();
  const [hero, setHero] = useState({
    badge: 'Énergie Solaire',
    title: "L'énergie du soleil au service de votre confort",
    subtitle: "Solutions solaires professionnelles à Kinshasa, RDC",
  });

  const [contact, setContact] = useState({
    phone: '+243 81 234 5678',
    email: 'info@vickingsolar.com',
  });

  const handleSaveHero = () => {
    console.log('Saving hero:', hero);
    toast.success(t('admin.projectsPage.saved'));
  };

  const handleSaveContact = () => {
    console.log('Saving contact:', contact);
    toast.success(t('admin.projectsPage.saved'));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">{t('admin.content.management')}</h1>

      <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-white">{t('admin.content.heroContent')}</h2>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">{t('admin.content.badge')}</label>
          <input
            value={hero.badge}
            onChange={(e) => setHero({ ...hero, badge: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">{t('admin.content.title')}</label>
          <input
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">{t('admin.content.subtitle')}</label>
          <input
            value={hero.subtitle}
            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>

        <button
          onClick={handleSaveHero}
          className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {t('admin.content.save')}
        </button>
      </div>

      <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-white">{t('admin.content.contactInfo')}</h2>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">{t('admin.content.phone')}</label>
          <input
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">{t('admin.content.email')}</label>
          <input
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>

        <button
          onClick={handleSaveContact}
          className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {t('admin.content.save')}
        </button>
      </div>
    </div>
  );
}
