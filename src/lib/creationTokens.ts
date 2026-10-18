import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { firestoreDb } from './firebase';

export interface CreationTokenItem {
  token: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
  createdByEmail: string;
}

function randomToken(): string {
  const chunk = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EMP-${chunk()}-${chunk()}`;
}

export async function createCreationToken(adminUid: string, adminEmail: string, validHours = 24): Promise<string> {
  if (!firestoreDb) {
    throw new Error('Firestore não configurado.');
  }

  const token = randomToken();
  const expiresAt = Date.now() + validHours * 60 * 60 * 1000;
  const ref = doc(firestoreDb, 'creation_tokens', token);

  await runTransaction(firestoreDb, async (tx) => {
    const current = await tx.get(ref);
    if (current.exists()) {
      throw new Error('Token gerado em conflito. Tente novamente.');
    }

    tx.set(ref, {
      token,
      createdByUid: adminUid,
      createdByEmail: adminEmail,
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(),
      expiresAt,
      used: false,
      usedAt: null,
      usedByUid: null,
      usedByEmail: null,
    });
  });

  return token;
}

export async function listActiveCreationTokens(max = 10): Promise<CreationTokenItem[]> {
  if (!firestoreDb) {
    return [];
  }

  const q = query(
    collection(firestoreDb, 'creation_tokens'),
    where('used', '==', false),
    orderBy('createdAtMs', 'desc'),
    limit(max)
  );

  const snap = await getDocs(q);
  return snap.docs
    .map((item) => {
      const data = item.data() as {
        token?: string;
        createdAtMs?: number;
        expiresAt?: number;
        used?: boolean;
        createdByEmail?: string;
      };

      return {
        token: data.token || item.id,
        createdAt: data.createdAtMs || 0,
        expiresAt: data.expiresAt || 0,
        used: Boolean(data.used),
        createdByEmail: data.createdByEmail || '',
      } satisfies CreationTokenItem;
    })
    .filter((token) => token.expiresAt > Date.now());
}

export async function listCreationTokens(max = 30): Promise<CreationTokenItem[]> {
  if (!firestoreDb) {
    return [];
  }

  const q = query(collection(firestoreDb, 'creation_tokens'), orderBy('createdAtMs', 'desc'), limit(max));
  const snap = await getDocs(q);

  return snap.docs.map((item) => {
    const data = item.data() as {
      token?: string;
      createdAtMs?: number;
      expiresAt?: number;
      used?: boolean;
      createdByEmail?: string;
    };

    return {
      token: data.token || item.id,
      createdAt: data.createdAtMs || 0,
      expiresAt: data.expiresAt || 0,
      used: Boolean(data.used),
      createdByEmail: data.createdByEmail || '',
    };
  });
}

export async function removeCreationToken(token: string): Promise<void> {
  if (!firestoreDb) {
    throw new Error('Firestore não configurado.');
  }

  await deleteDoc(doc(firestoreDb, 'creation_tokens', token));
}
