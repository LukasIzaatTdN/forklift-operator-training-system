import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { firestoreDb } from './firebase';

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  createdAtMs: number;
  deleted?: boolean;
}

export interface TicketItem {
  id: string;
  title: string;
  description: string;
  status: 'aberto' | 'em_andamento' | 'finalizado';
  createdAtMs: number;
  createdByEmail: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOperators: number;
  totalAdmins: number;
  totalTickets: number;
  activeTokens: number;
}

function assertDb() {
  if (!firestoreDb) throw new Error('Firestore não configurado.');
  return firestoreDb;
}

export async function ensureUserProfile(params: {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
}): Promise<void> {
  const db = assertDb();
  await setDoc(
    doc(db, 'users', params.uid),
    {
      uid: params.uid,
      name: params.name,
      email: params.email,
      role: params.role,
      deleted: false,
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserRoleFromProfile(uid: string): Promise<'admin' | 'operator' | null> {
  const db = assertDb();
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data() as { role?: string; deleted?: boolean };
  if (data.deleted) return null;
  return data.role === 'admin' ? 'admin' : 'operator';
}

export async function listUsers(): Promise<AdminUserItem[]> {
  const db = assertDb();
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAtMs', 'desc')));

  return snap.docs.map((item) => {
    const data = item.data() as Partial<AdminUserItem>;
    return {
      id: item.id,
      name: data.name || 'Sem nome',
      email: data.email || '',
      role: data.role === 'admin' ? 'admin' : 'operator',
      createdAtMs: data.createdAtMs || 0,
      deleted: Boolean(data.deleted),
    };
  });
}

export async function updateUserRole(userId: string, role: 'admin' | 'operator'): Promise<void> {
  const db = assertDb();
  await updateDoc(doc(db, 'users', userId), {
    role,
    updatedAt: serverTimestamp(),
  });
}

export async function softDeleteUser(userId: string): Promise<void> {
  const db = assertDb();
  await updateDoc(doc(db, 'users', userId), {
    deleted: true,
    updatedAt: serverTimestamp(),
  });

  // Remove progresso para limpar acesso operacional
  await deleteDoc(doc(db, 'user_progress', userId)).catch(() => {});
}

export async function listTickets(max = 30): Promise<TicketItem[]> {
  const db = assertDb();
  const snap = await getDocs(query(collection(db, 'tickets'), orderBy('createdAtMs', 'desc'), limit(max)));

  return snap.docs.map((item) => {
    const data = item.data() as Partial<TicketItem>;
    return {
      id: item.id,
      title: data.title || 'Chamado sem título',
      description: data.description || '',
      status:
        data.status === 'em_andamento' || data.status === 'finalizado' ? data.status : 'aberto',
      createdAtMs: data.createdAtMs || 0,
      createdByEmail: data.createdByEmail || '—',
    };
  });
}

export async function updateTicketStatus(
  ticketId: string,
  status: 'aberto' | 'em_andamento' | 'finalizado'
): Promise<void> {
  const db = assertDb();
  await updateDoc(doc(db, 'tickets', ticketId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function getDashboardStats(activeTokens: number): Promise<DashboardStats> {
  const db = assertDb();
  const [usersSnap, ticketsSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'tickets')),
  ]);

  const users = usersSnap.docs
    .map((d) => d.data() as Partial<AdminUserItem>)
    .filter((u) => !u.deleted);

  const admins = users.filter((u) => u.role === 'admin').length;
  const operators = users.filter((u) => u.role !== 'admin').length;

  return {
    totalUsers: users.length,
    totalOperators: operators,
    totalAdmins: admins,
    totalTickets: ticketsSnap.size,
    activeTokens,
  };
}
