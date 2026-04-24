import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
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
import { createCreationToken } from '../lib/creationTokens';
import { ensureUserProfile } from '../lib/adminData';
import { consumeSignupToken, validateSignupToken } from '../lib/paymentApi';

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
    'auth/invalid-credential':
      'E-mail ou senha incorretos (ou a conta não existe no Firebase Authentication).',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/email-already-in-use': 'Este e-mail já está em uso.',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
    'auth/network-request-failed': 'Falha de rede. Verifique sua conexão.',
    'auth/operation-not-allowed': 'Login por e-mail/senha não está habilitado no Firebase Authentication.',
    'auth/user-disabled': 'Este usuário foi desativado no Firebase Authentication.',
    'permission-denied': 'Permissão negada no Firestore. Verifique regras e índices.',
  };

  return mapper[code] || 'Falha na autenticação. Verifique suas credenciais.';
}

function buildFallbackOperatorUser(firebaseUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): User {
  const email = firebaseUser.email || '';
  const name = firebaseUser.displayName || (email ? email.split('@')[0] : 'Operador');

  return {
    id: firebaseUser.uid,
    email,
    name,
    role: 'operator',
  };
}

async function resolveFirebaseAppUser(firebaseUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): Promise<User | null> {
  if (!firestoreDb) return buildFallbackOperatorUser(firebaseUser);

  const uid = firebaseUser.uid;
  const email = firebaseUser.email || '';
  const preferredRole: UserRole = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'operator';
  const defaultName = firebaseUser.displayName || (email ? email.split('@')[0] : 'Operador');

  const userDocRef = doc(firestoreDb, 'users', uid);
  let userDocSnap;
  try {
    userDocSnap = await getDoc(userDocRef);
  } catch {
    return buildFallbackOperatorUser(firebaseUser);
  }

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
        return buildFallbackOperatorUser(firebaseUser);
      }

      try {
        await ensureUserProfile({
          uid,
          email,
          name: defaultName,
          role: 'operator',
        });
      } catch {
        return buildFallbackOperatorUser(firebaseUser);
      }
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
  const isRegisteringWithTokenRef = useRef(false);

  useEffect(() => {
    if (authMode === 'firebase' && firebaseAuth) {
      const auth: Auth = firebaseAuth;

      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          return;
        }

        if (isRegisteringWithTokenRef.current) {
          // Durante cadastro com token, o fluxo manual controla criação de perfil e sessão.
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
            const fallbackUser = buildFallbackOperatorUser(firebaseUser);
            setUser(fallbackUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fallbackUser));
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
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (!normalizedEmail || !normalizedPassword) {
          return { success: false, error: 'Informe e-mail e senha.' };
        }

        await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, normalizedPassword);
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

    isRegisteringWithTokenRef.current = true;

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();
      const normalizedName = name.trim();
      const normalizedToken = creationToken.trim().toUpperCase();

      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        normalizedEmail,
        normalizedPassword
      );
      const displayName = normalizedName || normalizedEmail.split('@')[0] || 'Operador';

      await updateProfile(credential.user, { displayName });

      try {
        const validation = await validateSignupToken(normalizedToken, normalizedEmail);
        if (!validation.success) {
          throw new Error(validation.error || 'Token inválido.');
        }

        const consumeResult = await consumeSignupToken(
          normalizedToken,
          credential.user.uid,
          credential.user.email || normalizedEmail
        );
        if (!consumeResult.success) {
          throw new Error(consumeResult.error || 'Falha ao consumir token.');
        }

        await ensureUserProfile({
          uid: credential.user.uid,
          name: displayName,
          email: normalizedEmail,
          role: 'operator',
        });

        const appUser = await resolveFirebaseAppUser({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
        });

        if (!appUser) {
          await signOut(firebaseAuth);
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          return { success: false, error: 'Falha ao finalizar cadastro. Tente novamente.' };
        }

        setUser(appUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(appUser));
        return { success: true };
      } catch (tokenError) {
        await deleteUser(credential.user);
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return { success: false, error: (tokenError as Error).message || 'Token inválido.' };
      }
    } catch (error) {
      const code = (error as { code?: string }).code;
      return { success: false, error: mapFirebaseError(code) };
    } finally {
      isRegisteringWithTokenRef.current = false;
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
