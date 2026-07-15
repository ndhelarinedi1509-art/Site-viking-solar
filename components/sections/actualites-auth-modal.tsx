'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { X, Loader2, ArrowLeft, Check, Mail, KeyRound, Lock } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

type ForgotStep = 'request' | 'verify' | 'reset' | 'done';

export function ActualitesAuthModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const { login, register, forgotPassword, verifyResetCode, resetPassword } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Forgot password fields
  const [resetContact, setResetContact] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const ok = await login(loginEmail, loginPassword);
    setLoading(false);
    if (ok) { onClose(); setLoginEmail(''); setLoginPassword(''); }
    else setError(t('admin.login.error'));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regName || !regEmail || !regPhone || !regPassword) {
      setError(t('formErrors.name')); return;
    }
    setLoading(true);
    const ok = await register(regName, regEmail, regPhone, regPassword);
    setLoading(false);
    if (ok) { onClose(); setRegName(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); }
    else setError(t('contact.form.error'));
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetContact) { setError(t('actualites.auth.emailRequired')); return; }
    setError(''); setLoading(true);
    const result = await forgotPassword(resetContact);
    setLoading(false);
    if (result.success) {
      setGeneratedCode(result.code ?? '');
      setForgotStep('verify');
    } else {
      setError(t('actualites.auth.emailNotFound'));
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode) { setError(t('actualites.auth.codeRequired')); return; }
    setError(''); setLoading(true);
    const ok = await verifyResetCode(resetContact, resetCode);
    setLoading(false);
    if (ok) setForgotStep('reset');
    else setError(t('actualites.auth.invalidCode'));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setError(t('actualites.auth.passwordMinLength')); return;
    }
    setError(''); setLoading(true);
    const ok = await resetPassword(resetContact, newPassword);
    setLoading(false);
    if (ok) setForgotStep('done');
    else setError(t('actualites.auth.emailNotFound'));
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setForgotOpen(false);
      setForgotStep('request');
      setError('');
      setResetContact('');
      setResetCode('');
      setNewPassword('');
      setGeneratedCode('');
    }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="w-full max-w-md rounded-2xl border border-white/6 bg-bg-card p-8 shadow-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {forgotOpen && forgotStep !== 'done' && (
              <button onClick={() => { setForgotOpen(false); setForgotStep('request'); setError(''); }}
                className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h2 className="text-xl font-bold text-white">
              {forgotOpen
                ? t('actualites.auth.forgotPassword')
                : tab === 'login' ? t('actualites.auth.login') : t('actualites.auth.register')}
            </h2>
          </div>
          <button onClick={handleClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && <p className="text-xs text-accent-red mb-4 text-center">{error}</p>}

        {/* ── Forgot Password Flow ── */}
        {forgotOpen ? (
          <>
            {forgotStep === 'request' && (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-green/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-green" />
                  </div>
                  <p className="text-sm text-gray-400 text-center">{t('actualites.auth.forgotDescription')}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">{t('actualites.auth.emailOrPhone')}</label>
                  <input type="text" value={resetContact} onChange={(e) => setResetContact(e.target.value)}
                    placeholder={t('actualites.auth.emailPlaceholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('actualites.auth.sendCode')}
                </button>
              </form>
            )}

            {forgotStep === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-accent-blue/10 flex items-center justify-center">
                    <KeyRound className="h-6 w-6 text-accent-blue" />
                  </div>
                  <p className="text-sm text-gray-400 text-center">
                    {t('actualites.auth.codeSentTo')} <strong className="text-white">{resetContact}</strong>
                  </p>
                  {generatedCode && (
                    <p className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg">
                      {t('actualites.auth.yourCode')}: <span className="font-mono font-bold text-green tracking-wider">{generatedCode}</span>
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">{t('actualites.auth.resetCode')}</label>
                  <input type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                    placeholder="ABC123" maxLength={6}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors text-center tracking-[0.3em] font-mono" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('actualites.auth.verifyCode')}
                </button>
              </form>
            )}

            {forgotStep === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-accent-orange/10 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-accent-orange" />
                  </div>
                  <p className="text-sm text-gray-400 text-center">{t('actualites.auth.newPasswordDescription')}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">{t('admin.login.password')}</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('actualites.auth.resetPasswordBtn')}
                </button>
              </form>
            )}

            {forgotStep === 'done' && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green" />
                </div>
                <p className="text-lg font-bold text-white">{t('actualites.auth.passwordResetSuccess')}</p>
                <p className="text-sm text-gray-400 text-center">{t('actualites.auth.passwordResetDescription')}</p>
                <button onClick={() => { setForgotOpen(false); setForgotStep('request'); setTab('login'); setError(''); }}
                  className="mt-2 h-11 px-6 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all">
                  {t('actualites.auth.login')}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* ── Tabs ── */}
            <div className="flex rounded-xl border border-white/6 p-1 mb-6">
              <button onClick={() => { setTab('login'); setError(''); }}
                className={cn('flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-300', tab === 'login' ? 'bg-green text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]' : 'text-gray-400 hover:text-white')}>
                {t('actualites.auth.login')}
              </button>
              <button onClick={() => { setTab('register'); setError(''); }}
                className={cn('flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-300', tab === 'register' ? 'bg-green text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]' : 'text-gray-400 hover:text-white')}>
                {t('actualites.auth.register')}
              </button>
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">{t('actualites.auth.emailOrPhone')}</label>
                  <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={t('actualites.auth.emailPlaceholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-300">{t('admin.login.password')}</label>
                    <button type="button" onClick={() => { setForgotOpen(true); setError(''); setResetContact(loginEmail); }}
                      className="text-xs font-medium text-green hover:text-green-dark transition-colors">
                      {t('actualites.auth.forgotPassword')}
                    </button>
                  </div>
                  <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('actualites.auth.login')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">{t('contact.form.name')}</label>
                  <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                    placeholder={t('contact.form.namePlaceholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">{t('contact.form.email')}</label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={t('contact.form.emailPlaceholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">{t('contact.form.phone')}</label>
                  <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                    placeholder={t('contact.form.phonePlaceholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">{t('admin.login.password')}</label>
                  <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('actualites.auth.register')}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
