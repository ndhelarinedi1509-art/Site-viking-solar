'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Loader2, ArrowLeft, Mail, Check, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t('formErrors.email')).email(t('formErrors.emailInvalid')),
    password: z.string().min(1, t('formErrors.password')),
  });

type LoginValues = z.infer<ReturnType<typeof loginSchema>>;

type ForgotStep = 'request' | 'verify' | 'reset' | 'done';

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>('request');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema(t)),
  });

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || t('admin.login.error'));
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError(t('error.description'));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) { setError(t('actualites.auth.emailRequired')); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (data.code) setGeneratedCode(data.code);
      setForgotStep('verify');
    } catch {
      setError(t('error.description'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode) { setError(t('actualites.auth.codeRequired')); return; }
    setError(''); setLoading(true);
    // Simple client-side verification for dev
    if (resetCode === generatedCode) {
      setForgotStep('reset');
    } else {
      setError(t('actualites.auth.invalidCode'));
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setError(t('actualites.auth.passwordMinLength')); return;
    }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode, password: newPassword }),
      });
      if (!res.ok) throw new Error();
      setForgotStep('done');
    } catch {
      setError(t('error.description'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-card border border-white/6 rounded-2xl p-8 shadow-card">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 overflow-hidden bg-white/10 border border-white/10">
              <img src="/logo.webp" alt="Vicking Solar" className="h-full w-full object-contain" />
            </div>
            <h1 className="text-xl font-bold text-white">{t('admin.loginExtra.workspace')}</h1>
            <p className="text-sm text-gray-400 mt-1">{t('admin.loginExtra.tagline')}</p>
          </div>

          {error && <p className="text-xs text-accent-red mb-4 text-center">{error}</p>}

          {/* ── Forgot Password Flow ── */}
          {forgotOpen ? (
            <>
              {forgotStep === 'request' && (
                <form onSubmit={handleRequestCode} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button type="button" onClick={() => { setForgotOpen(false); setForgotStep('request'); setError(''); }}
                      className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-white">{t('admin.loginExtra.forgotPassword')}</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green" />
                    </div>
                    <p className="text-sm text-gray-400 text-center">{t('admin.loginExtra.forgotDescription')}</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-300">{t('admin.loginExtra.adminId')}</label>
                    <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                      placeholder={t('admin.loginExtra.adminPlaceholder')}
                      className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('actualites.auth.sendCode')}
                  </button>
                </form>
              )}

              {forgotStep === 'verify' && (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="flex flex-col items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center">
                      <KeyRound className="h-5 w-5 text-accent-blue" />
                    </div>
                    <p className="text-sm text-gray-400 text-center">
                      {t('actualites.auth.codeSentTo')} <strong className="text-white">{resetEmail}</strong>
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
                      className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors text-center tracking-[0.3em] font-mono" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('actualites.auth.verifyCode')}
                  </button>
                </form>
              )}

              {forgotStep === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="flex flex-col items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-accent-orange/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-accent-orange" />
                    </div>
                    <p className="text-sm text-gray-400 text-center">{t('actualites.auth.newPasswordDescription')}</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-300">{t('admin.login.password')}</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
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
                  <button onClick={() => { setForgotOpen(false); setForgotStep('request'); setError(''); }}
                    className="mt-2 h-11 px-6 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all">
                    {t('actualites.auth.login')}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ── Login Form ── */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">{t('admin.loginExtra.adminId')}</label>
                <input type="email" placeholder={t('admin.loginExtra.adminPlaceholder')}
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                  {...register('email')} />
                {errors.email && <p className="text-xs text-accent-red">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">{t('admin.login.password')}</label>
                  <button type="button" onClick={() => { setForgotOpen(true); setError(''); setResetEmail((document.querySelector('input[type=email]') as HTMLInputElement)?.value || ''); }}
                    className="text-xs font-medium text-green hover:text-green-dark transition-colors">
                    {t('admin.loginExtra.forgotPassword')}
                  </button>
                </div>
                <input type="password" placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                  {...register('password')} />
                {errors.password && <p className="text-xs text-accent-red">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Lock className="h-4 w-4" />{t('admin.loginExtra.secureLogin')}</>
                )}
              </button>
            </form>
          )}

          {!forgotOpen && (
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-500">
              <Lock className="h-3.5 w-3.5" />
              <span>{t('admin.loginExtra.saasProtection')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
