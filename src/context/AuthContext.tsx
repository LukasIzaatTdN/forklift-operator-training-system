import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, UserRole } from '../types';

// Users database (in production, this would be a backend)
const USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'admin',
    password: 'admin3025',
    user: {
      id: 'admin-1',
      name: 'Administrador',
      email: 'admin',
      role: 'admin',
    },
  },
  {
    email: 'operador',
    password: 'operador123',
    user: {
      id: 'operador-1',
      name: 'João Operador',
      email: 'operador',
      role: 'operador',
    },
  },
];

const AUTH_STORAGE_KEY = 'empilhapro_auth';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const found = USERS.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'E-mail ou senha incorretos. Tente novamente.' };
    }
    setUser(found.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found.user));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper to get available users for the login page display
export function getAvailableUsers(): { role: UserRole; email: string; name: string; hint: string }[] {
  return [
    { role: 'admin', email: 'admin', name: 'Administrador', hint: 'Senha: admin3025' },
    { role: 'operador', email: 'operador', name: 'Operador', hint: 'Senha: operador123' },
  ];
}

export function getRegisteredUsers(): User[] {
  return USERS.map((entry) => entry.user);
}
