'use client';

import { useState } from 'react';
import { Save, Shield, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    logoUrl: '/favicon.svg',
    primaryColor: '#22C55E',
    seoTitle: 'Viking Solar | Énergie solaire durable à Kinshasa RDC',
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    toast.success('Configuration sauvegardée');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Configuration</h1>

      <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-white">Configuration Système</h2>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">URL du Logo</label>
          <input
            value={settings.logoUrl}
            onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
            placeholder="/favicon.svg"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Couleur Principale</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              className="h-10 w-14 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              value={settings.primaryColor}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Titre SEO</label>
          <input
            value={settings.seoTitle}
            onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Sauvegarder
        </button>
      </div>

      <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-white">Sécurité & Sauvegardes</h2>

        <div className="flex items-center gap-3">
          <button className="h-10 px-5 rounded-xl border border-green/30 text-green text-sm font-semibold hover:bg-green/10 hover:border-green/50 transition-all duration-300 active:scale-[0.98] flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Gérer les Rôles
          </button>
          <button className="h-10 px-5 rounded-xl border border-accent-blue/30 text-accent-blue text-sm font-semibold hover:bg-accent-blue/10 hover:border-accent-blue/50 transition-all duration-300 active:scale-[0.98] flex items-center gap-2">
            <Database className="h-4 w-4" />
            Créer un Backup
          </button>
        </div>
      </div>
    </div>
  );
}
