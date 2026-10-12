import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AUTH_TOKEN_STORAGE_KEY } from '@/shared/constants/storage';
import { UNAUTHORIZED_EVENT } from '@/shared/constants/events';
import { authService } from '../services/authService';
import type { AuthUser } from '../types';
import { AuthContext, type AuthContextValue, type AuthStatus } from './AuthContext';


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('checking');

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  // 1. Al montar la app: si hay token guardado, validarlo contra /auth/me.
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    authService
      .me()
      .then((response) => {
        setUser(response.data);
        setStatus('authenticated');
      })
      .catch(() => {
        // Token vencido, revocado o corrupto: no asumimos que sigue siendo válido.
        logout();
      });
  }, [logout]);

  // 2. Si cualquier petición del apiClient recibe 401, cerrar sesión.
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.accessToken);
    setUser(response.user);
    setStatus('authenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, isAuthenticated: status === 'authenticated', login, logout }),
    [user, status, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
