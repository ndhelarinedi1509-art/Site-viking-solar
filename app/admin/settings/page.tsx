'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Globe, Phone, Mail, MapPin, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const json = await res.json();
      const flat: Record<string, string> = {};
      for (const [key, val] of Object.entries(json.data ?? {})) {
        flat[key] = typeof val === 'string' ? val : JSON.stringify(val);
      }
      setSettings(flat);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(settings)) {
        try {
          payload[key] = JSON.parse(val);
        } catch {
          payload[key] = val;
        }
      }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Paramètres sauvegardés');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('admin.settings.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">Configuration globale du site</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="h-10 px-5 rounded-xl bg-green text-bg-primary text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {t('admin.settings.save')}
        </button>
      </div>

      {/* General */}
      <SectionCard icon={Globe} title="Général">
        <SettingField label="Nom du site" value={settings.site_name ?? ''} onChange={(v) => updateSetting('site_name', v)} />
        <SettingField label="Description" value={settings.site_description ?? ''} onChange={(v) => updateSetting('site_description', v)} textarea />
      </SectionCard>

      {/* Contact */}
      <SectionCard icon={Phone} title="Contact">
        <SettingField label="Téléphone" value={settings.contact_phone ?? ''} onChange={(v) => updateSetting('contact_phone', v)} />
        <SettingField label="Email" value={settings.contact_email ?? ''} onChange={(v) => updateSetting('contact_email', v)} />
        <SettingField label="Adresse" value={settings.contact_address ?? ''} onChange={(v) => updateSetting('contact_address', v)} />
      </SectionCard>

      {/* Social */}
      <SectionCard icon={Share2} title="Réseaux sociaux">
        <SettingField label="Facebook" value={settings.social_facebook ?? ''} onChange={(v) => updateSetting('social_facebook', v)} />
        <SettingField label="Instagram" value={settings.social_instagram ?? ''} onChange={(v) => updateSetting('social_instagram', v)} />
        <SettingField label="Twitter / X" value={settings.social_twitter ?? ''} onChange={(v) => updateSetting('social_twitter', v)} />
        <SettingField label="TikTok" value={settings.social_tiktok ?? ''} onChange={(v) => updateSetting('social_tiktok', v)} />
      </SectionCard>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card space-y-4">
      <div className="flex items-center gap-3 pb-2 border-b border-white/6">
        <Icon className="h-5 w-5 text-green" />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SettingField({ label, value, onChange, textarea }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2}
          className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors resize-y" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
      )}
    </div>
  );
}
