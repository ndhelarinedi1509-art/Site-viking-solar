'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const setupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SetupValues = z.infer<typeof setupSchema>;

export default function AdminSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SetupValues>({
    resolver: zodResolver(setupSchema),
  });

  useEffect(() => {
    fetch('/api/admin/auth/setup')
      .then((r) => r.json())
      .then((d) => {
        setSetupRequired(d.setupRequired);
        if (!d.setupRequired) {
          router.replace('/admin/login');
        }
      })
      .catch(() => setError('Failed to check setup status'))
      .finally(() => setLoading(false));
  }, [router]);

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
        setError(err.error || 'Setup failed');
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/admin'), 1500);
    } catch {
      setError('An error occurred');
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

  if (setupRequired === false) {
    return null;
  }

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
                <h1 className="text-xl font-bold text-white">Super Admin Created</h1>
                <p className="text-sm text-gray-400 text-center">Redirecting to dashboard...</p>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white">Initial Setup</h1>
                <p className="text-sm text-gray-400 mt-1 text-center">
                  Create your Super Admin account to get started.<br />
                  This form will be disabled after the first registration.
                </p>
              </>
            )}
          </div>

          {error && <p className="text-xs text-accent-red mb-4 text-center">{error}</p>}

          {!success && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Full Name</label>
                <input type="text" placeholder="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                  {...register('name')} />
                {errors.name && <p className="text-xs text-accent-red">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input type="email" placeholder="admin@vickingsolar.com"
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                  {...register('email')} />
                {errors.email && <p className="text-xs text-accent-red">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters"
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
                <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                <input type="password" placeholder="Re-enter password"
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                  {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-xs text-accent-red">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={submitting}
                className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Super Admin Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
