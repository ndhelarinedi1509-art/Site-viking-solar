'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  forgotPassword: (emailOrPhone: string) => Promise<{ success: boolean; code?: string }>;
  verifyResetCode: (emailOrPhone: string, code: string) => Promise<boolean>;
  resetPassword: (emailOrPhone: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'viking-auth-user';

const MOCK_USERS_KEY = 'viking-mock-users';

function getStoredUsers(): Record<string, { name: string; email: string; phone: string; password: string }> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '{}');
  } catch { return {}; }
}

function saveUser(data: { name: string; email: string; phone: string; password: string }) {
  const users = getStoredUsers();
  users[data.email] = data;
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const login = useCallback(async (emailOrPhone: string, password: string) => {
    const users = getStoredUsers();
    const found = Object.values(users).find(
      (u) => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password,
    );
    if (!found) return false;
    const authUser: AuthUser = { id: Date.now().toString(36) + Math.random().toString(36).slice(2), name: found.name, email: found.email, phone: found.phone };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    const users = getStoredUsers();
    if (users[email]) return false;
    saveUser({ name, email, phone, password });
    const authUser: AuthUser = { id: Date.now().toString(36) + Math.random().toString(36).slice(2), name, email, phone };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (emailOrPhone: string) => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const resetData = { code, expiresAt: Date.now() + 10 * 60 * 1000 };
    if (typeof window !== 'undefined') {
      const codes = JSON.parse(localStorage.getItem('viking-reset-codes') || '{}');
      codes[emailOrPhone] = resetData;
      localStorage.setItem('viking-reset-codes', JSON.stringify(codes));
    }
    return { success: true, code };
  }, []);

  const verifyResetCode = useCallback(async (emailOrPhone: string, code: string) => {
    if (typeof window === 'undefined') return false;
    const codes = JSON.parse(localStorage.getItem('viking-reset-codes') || '{}');
    const data = codes[emailOrPhone];
    if (!data || data.code !== code || Date.now() > data.expiresAt) return false;
    return true;
  }, []);

  const resetPassword = useCallback(async (emailOrPhone: string, newPassword: string) => {
    const users = getStoredUsers();
    const found = Object.values(users).find((u) => u.email === emailOrPhone || u.phone === emailOrPhone);
    if (!found) return false;
    found.password = newPassword;
    if (found.email) users[found.email] = found;
    if (typeof window !== 'undefined') {
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
      localStorage.removeItem('viking-reset-codes');
    }
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, forgotPassword, verifyResetCode, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
