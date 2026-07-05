'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        alert('Identifiants incorrects');
        return;
      }

      console.log('Login success:', data);
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-card border border-white/6 rounded-2xl p-8 shadow-card">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green/10 border border-green/30 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#22C55E" strokeWidth="2" />
                <path
                  d="M16 6L18.5 13H26L20 17.5L22.5 25L16 20.5L9.5 25L12 17.5L6 13H13.5L16 6Z"
                  fill="#22C55E"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Vicking Solar Workspace</h1>
            <p className="text-sm text-gray-400 mt-1">Votre partenaire en énergie solaire durable</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Identifiant Administrateur
              </label>
              <input
                type="email"
                placeholder="ex: admin@vickingsolar.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-accent-red">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-accent-red">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Connexion Sécurisée
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-500">
            <Lock className="h-3.5 w-3.5" />
            <span>Protection SaaS Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
