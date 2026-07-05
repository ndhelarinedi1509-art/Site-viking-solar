'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminContentPage() {
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
    toast.success('Contenu Hero sauvegardé');
  };

  const handleSaveContact = () => {
    console.log('Saving contact:', contact);
    toast.success('Informations de contact sauvegardées');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Gestion du Contenu</h1>

      <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-white">Contenu Accueil (Hero)</h2>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Badge</label>
          <input
            value={hero.badge}
            onChange={(e) => setHero({ ...hero, badge: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Titre</label>
          <input
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Sous-titre</label>
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
          Sauvegarder
        </button>
      </div>

      <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-white">Informations de Contact (Global)</h2>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Téléphone</label>
          <input
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Email</label>
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
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
