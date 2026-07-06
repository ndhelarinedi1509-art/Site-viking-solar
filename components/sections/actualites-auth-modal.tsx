'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { X, Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ActualitesAuthModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(loginEmail, loginPassword);
    setLoading(false);
    if (ok) { onClose(); setLoginEmail(''); setLoginPassword(''); }
    else setError(t('admin.login.error'));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regName || !regEmail || !regPhone || !regPassword) {
      setError(t('formErrors.name'));
      return;
    }
    setLoading(true);
    const ok = await register(regName, regEmail, regPhone, regPassword);
    setLoading(false);
    if (ok) { onClose(); setRegName(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); }
    else setError(t('contact.form.error'));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-white/6 bg-bg-card p-8 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {tab === 'login' ? t('actualites.auth.login') : t('actualites.auth.register')}
          </h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl border border-white/6 p-1 mb-6">
          <button onClick={() => { setTab('login'); setError(''); }} className={cn('flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-300', tab === 'login' ? 'bg-green text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]' : 'text-gray-400 hover:text-white')}>
            {t('actualites.auth.login')}
          </button>
          <button onClick={() => { setTab('register'); setError(''); }} className={cn('flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-300', tab === 'register' ? 'bg-green text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]' : 'text-gray-400 hover:text-white')}>
            {t('actualites.auth.register')}
          </button>
        </div>

        {error && <p className="text-xs text-accent-red mb-4 text-center">{error}</p>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">{t('actualites.auth.emailOrPhone')}</label>
              <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder={t('actualites.auth.emailPlaceholder')} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">{t('admin.login.password')}</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
            </div>
            <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('actualites.auth.login')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">{t('contact.form.name')}</label>
              <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder={t('contact.form.namePlaceholder')} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">{t('contact.form.email')}</label>
              <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder={t('contact.form.emailPlaceholder')} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">{t('contact.form.phone')}</label>
              <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder={t('contact.form.phonePlaceholder')} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">{t('admin.login.password')}</label>
              <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
            </div>
            <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('actualites.auth.register')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
