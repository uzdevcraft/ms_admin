import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../api';
import { AUTH_TOKEN_KEY } from '../api/axios';
import type { AuthSession } from '../types';

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then(setSession)
      .catch(() => {
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem('magic_store_auth_session');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const data = await authApi.login(username, password);
    setSession(data);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, isLoading, login, logout }),
    [session, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
