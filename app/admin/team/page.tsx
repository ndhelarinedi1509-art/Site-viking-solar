'use client';

import { Plus, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminTeamPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('admin.teamPage.management')}</h1>
        <button
          className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('admin.teamPage.addMember')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <button className="h-[220px] bg-bg-card border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-green hover:border-green/30 transition-all duration-300">
          <Upload className="h-10 w-10" />
          <span className="text-sm font-medium">{t('admin.teamPage.uploadPhoto')}</span>
        </button>
      </div>
    </div>
  );
}
