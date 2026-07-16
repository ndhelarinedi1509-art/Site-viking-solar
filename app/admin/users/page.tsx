'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Loader2, Plus, UserPlus, ShieldCheck, Shield, Trash2, Eye, EyeOff, Check, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
}

const createSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('admin.users.name')),
    email: z.string().email(t('formErrors.emailInvalid')),
    password: z.string().min(8, t('formErrors.password')),
  });

type CreateValues = z.infer<ReturnType<typeof createSchema>>;

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateValues>({
    resolver: zodResolver(createSchema(t)),
  });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.status === 403) { setError(t('admin.users.accessDenied')); setLoading(false); return; }
      const json = await res.json();
      setUsers(json.data ?? []);
    } catch {
      setError(t('admin.users.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const onCreate = async (data: CreateValues) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) setError(t('admin.users.emailExists'));
        else setError(err.error || t('error.description'));
        return;
      }
      toast.success(t('admin.users.createSuccess'));
      reset();
      setShowCreate(false);
      fetchUsers();
    } catch {
      setError(t('error.description'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (user: AdminUser) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !user.isActive }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || t('admin.users.updateError'));
        return;
      }
      toast.success(user.isActive ? t('admin.users.userDisabled') : t('admin.users.userEnabled'));
      fetchUsers();
    } catch {
      toast.error(t('admin.users.updateError'));
    }
  };

  const updateName = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || t('admin.users.updateError'));
        return;
      }
      toast.success(t('admin.users.nameUpdated'));
      setEditId(null);
      fetchUsers();
    } catch {
      toast.error(t('admin.users.updateError'));
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || t('admin.users.deleteError'));
        return;
      }
      toast.success(t('admin.users.userDeleted'));
      setDeleteConfirm(null);
      fetchUsers();
    } catch {
      toast.error(t('admin.users.deleteError'));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-green animate-spin" /></div>;
  }

  if (error && users.length === 0) {
    return <div className="flex items-center justify-center h-64"><p className="text-accent-red text-sm">{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('admin.users.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('admin.users.description')}</p>
        </div>
        <button onClick={() => { setShowCreate(!showCreate); setError(''); reset(); }}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark hover:shadow-glow transition-all">
          <UserPlus className="h-4 w-4" />
          {t('admin.users.create')}
        </button>
      </div>

      {showCreate && (
        <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-white mb-4">{t('admin.users.newUser')}</h2>
          {error && <p className="text-xs text-accent-red mb-3">{error}</p>}
          <form onSubmit={handleSubmit(onCreate)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">{t('admin.users.name')}</label>
              <input type="text" placeholder={t('admin.users.namePlaceholder')}
                className="w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                {...register('name')} />
              {errors.name && <p className="text-xs text-accent-red">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">{t('admin.login.email')}</label>
              <input type="email" placeholder={t('admin.users.emailPlaceholder')}
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
            <div className="flex items-end gap-2">
              <button type="submit" disabled={submitting}
                className="h-10 px-6 rounded-xl bg-green text-white font-semibold text-sm hover:bg-green-dark transition-all disabled:opacity-50 flex items-center gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> {t('admin.users.create')}</>}
              </button>
              <button type="button" onClick={() => setShowCreate(false)}
                className="h-10 px-4 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">
                {t('admin.users.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-bg-card border border-white/6 rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.users.name')}</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.login.email')}</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.users.status')}</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.users.created')}</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.users.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4">
                    {editId === user.id ? (
                      <div className="flex items-center gap-2">
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                          className="rounded-lg border border-white/10 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 w-40" />
                        <button onClick={() => updateName(user.id)} className="text-green hover:text-green-dark"><Check className="h-4 w-4" /></button>
                        <button onClick={() => setEditId(null)} className="text-gray-500 hover:text-white"><X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-gray-300">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                            user.role === 'super_admin' ? 'text-green/70' : 'text-accent-blue/70'
                          }`}>
                            {user.role === 'super_admin' ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                            {user.role === 'super_admin' ? t('admin.users.superAdmin') : t('admin.users.admin')}
                          </span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      user.isActive ? 'bg-green/10 text-green' : 'bg-accent-red/10 text-accent-red'
                    }`}>
                      {user.isActive ? t('admin.users.active') : t('admin.users.disabled')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== 'super_admin' && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditId(user.id); setEditName(user.name); }}
                          className="h-8 px-3 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white hover:border-green/30 transition-colors">
                          {t('admin.users.rename')}
                        </button>
                        <button onClick={() => toggleActive(user)}
                          className={`h-8 px-3 rounded-lg border text-xs transition-colors ${
                            user.isActive
                              ? 'border-accent-orange/30 text-accent-orange hover:bg-accent-orange/10'
                              : 'border-green/30 text-green hover:bg-green/10'
                          }`}>
                          {user.isActive ? t('admin.users.disable') : t('admin.users.enable')}
                        </button>
                        {deleteConfirm === user.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => deleteUser(user.id)}
                              className="h-8 px-3 rounded-lg bg-accent-red/20 text-accent-red text-xs font-semibold hover:bg-accent-red/30 transition-colors flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> {t('admin.users.confirm')}
                            </button>
                            <button onClick={() => setDeleteConfirm(null)}
                              className="h-8 px-2 rounded-lg text-gray-500 hover:text-white text-xs transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(user.id)}
                            className="h-8 w-8 rounded-lg border border-white/10 text-gray-500 hover:text-accent-red hover:border-accent-red/30 transition-colors flex items-center justify-center">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">{t('admin.users.noUsers')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
