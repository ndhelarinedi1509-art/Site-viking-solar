'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
