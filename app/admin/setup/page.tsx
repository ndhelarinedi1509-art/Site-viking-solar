'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const setupSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('admin.setup.name')),
    email: z.string().email(t('formErrors.emailInvalid')),
    password: z.string().min(8, t('formErrors.password')),
    confirmPassword: z.string(),
  }).refine((d) => d.password === d.confirmPassword, {
    message: t('admin.setup.passwordMismatch'),
    path: ['confirmPassword'],
  });

type SetupValues = z.infer<ReturnType<typeof setupSchema>>;

export default function AdminSetupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SetupValues>({
    resolver: zodResolver(setupSchema(t)),
  });

  useEffect(() => {
    fetch('/api/admin/auth/setup')
      .then((r) => r.json())
      .then((d) => {
        setSetupRequired(d.setupRequired);
        if (!d.setupRequired) router.replace('/admin/login');
      })
      .catch(() => setError(t('error.description')))
      .finally(() => setLoading(false));
  }, [router, t]);

  const onSubmit = async (data: SetupValues) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || t('error.description'));
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/admin'), 1500);
    } catch {
      setError(t('error.description'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-green animate-spin" />
      </div>
    );
  }

  if (setupRequired === false) return null;

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-card border border-white/6 rounded-2xl p-8 shadow-card">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 overflow-hidden bg-white/10 border border-white/10">
              <img src="/logo.webp" alt="Vicking Solar" className="h-full w-full object-contain" />
            </div>
            {success ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-green" />
                </div>
                <h1 className="text-xl font-bold text-white">{t('admin.setup.success')}</h1>
                <p className="text-sm text-gray-400 text-center">{t('admin.setup.redirecting')}</p>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white">{t('admin.setup.title')}</h1>
                <p className="text-sm text-gray-400 mt-1 text-center">
                  {t('admin.setup.description')}<br />
                  {t('admin.setup.warning')}
                </p>
              </>
            )}
          </div>

          {error && <p className="text-xs text-accent-red mb-4 text-center">{error}</p>}

          {!success && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">{t('admin.setup.name')}</label>
                <input type="text" placeholder={t('admin.setup.namePlaceholder')}
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                  {...register('name')} />
                {errors.name && <p className="text-xs text-accent-red">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">{t('admin.login.email')}</label>
                <input type="email" placeholder={t('admin.setup.emailPlaceholder')}
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                  {...register('email')} />
                {errors.email && <p className="text-xs text-accent-red">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">{t('admin.login.password')}</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder={t('admin.users.passwordPlaceholder')}
                    className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                    {...register('password')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-accent-red">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">{t('admin.setup.confirmPassword')}</label>
                <input type="password" placeholder={t('admin.setup.confirmPlaceholder')}
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                  {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-xs text-accent-red">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={submitting}
                className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('admin.setup.submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
