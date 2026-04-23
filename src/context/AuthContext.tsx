import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Auth,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User, AuthContextType, UserRole } from '../types';
import { firebaseAuth, firestoreDb, hasFirebaseConfig } from '../lib/firebase';
import { consumeCreationToken, createCreationToken } from '../lib/creationTokens';
import { ensureUserProfile } from '../lib/adminData';

// Local users database (fallback if Firebase is not configured)
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

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((value: string) => value.trim().toLowerCase())
  .filter(Boolean);

const authMode: 'firebase' | 'local' = hasFirebaseConfig && firebaseAuth ? 'firebase' : 'local';

const AuthContext = createContext<AuthContextType | null>(null);

function mapFirebaseError(code?: string): string {
  if (!code) return 'Falha na autenticação. Verifique suas credenciais.';

  const mapper: Record<string, string> = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/email-already-in-use': 'Este e-mail já está em uso.',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
    'auth/network-request-failed': 'Falha de rede. Verifique sua conexão.',
  };

  return mapper[code] || 'Falha na autenticação. Verifique suas credenciais.';
}

async function resolveFirebaseAppUser(firebaseUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): Promise<User | null> {
  if (!firestoreDb) return null;

  const uid = firebaseUser.uid;
  const email = firebaseUser.email || '';
  const preferredRole: UserRole = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'operator';
  const defaultName = firebaseUser.displayName || (email ? email.split('@')[0] : 'Operador');

  const userDocRef = doc(firestoreDb, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // Primeiro login: tenta criar com role desejada.
    // Se for admin por allowlist e as regras bloquearem, faz fallback para operator.
    try {
      await ensureUserProfile({
        uid,
        email,
        name: defaultName,
        role: preferredRole,
      });
    } catch (error) {
      if (preferredRole !== 'admin') {
        throw error;
      }

      await ensureUserProfile({
        uid,
        email,
        name: defaultName,
        role: 'operator',
      });
    }

    return {
      id: uid,
      email,
      name: defaultName,
      role: preferredRole === 'admin' ? 'operator' : preferredRole,
    };
  }

  const data = userDocSnap.data() as {
    role?: string;
    name?: string;
    email?: string;
    deleted?: boolean;
  };

  if (data.deleted) {
    return null;
  }

  const roleFromDoc = data.role === 'admin' ? 'admin' : 'operator';
  const role: UserRole = roleFromDoc;

  return {
    id: uid,
    email: data.email || email,
    name: data.name || defaultName,
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (authMode === 'firebase' && firebaseAuth) {
      const auth: Auth = firebaseAuth;

      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          return;
        }

        void (async () => {
          try {
            const appUser = await resolveFirebaseAppUser(firebaseUser);
            if (!appUser) {
              await signOut(auth);
              setUser(null);
              localStorage.removeItem(AUTH_STORAGE_KEY);
              return;
            }

            setUser(appUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(appUser));
          } catch {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        })();
      });

      return unsubscribe;
    }

    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    return () => {};
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (authMode === 'firebase' && firebaseAuth) {
      try {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        return { success: true };
      } catch (error) {
        const code = (error as { code?: string }).code;
        return { success: false, error: mapFirebaseError(code) };
      }
    }

    const found = USERS.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'E-mail ou senha incorretos. Tente novamente.' };
    }

    setUser(found.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found.user));
    return { success: true };
  };

  const registerWithToken = async (
    name: string,
    email: string,
    password: string,
    creationToken: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (authMode !== 'firebase' || !firebaseAuth) {
      return { success: false, error: 'Cadastro com token disponível apenas no modo Firebase.' };
    }

    if (!creationToken.trim()) {
      return { success: false, error: 'Informe o token de criação.' };
    }

    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const displayName = name.trim() || email.split('@')[0] || 'Operador';

      await updateProfile(credential.user, { displayName });

      try {
        await consumeCreationToken(creationToken, credential.user.uid, credential.user.email || email);

        await ensureUserProfile({
          uid: credential.user.uid,
          name: displayName,
          email,
          role: 'operator',
        });

        return { success: true };
      } catch (tokenError) {
        await deleteUser(credential.user);
        return { success: false, error: (tokenError as Error).message || 'Token inválido.' };
      }
    } catch (error) {
      const code = (error as { code?: string }).code;
      return { success: false, error: mapFirebaseError(code) };
    }
  };

  const generateCreationToken = async (
    validHours = 24
  ): Promise<{ success: boolean; token?: string; error?: string }> => {
    if (authMode !== 'firebase' || !firebaseAuth || !firebaseAuth.currentUser) {
      return { success: false, error: 'Faça login via Firebase para gerar token.' };
    }

    if (user?.role !== 'admin') {
      return { success: false, error: 'Apenas administradores podem gerar token.' };
    }

    try {
      const currentEmail = firebaseAuth.currentUser.email || user.email || '';
      const token = await createCreationToken(firebaseAuth.currentUser.uid, currentEmail, validHours);
      return { success: true, token };
    } catch (error) {
      return { success: false, error: (error as Error).message || 'Falha ao gerar token.' };
    }
  };

  const logout = async () => {
    if (authMode === 'firebase' && firebaseAuth) {
      await signOut(firebaseAuth);
      return;
    }

    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        registerWithToken,
        generateCreationToken,
        logout,
        isAuthenticated,
        isAdmin,
        authMode,
      }}
    >
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
