import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function readRequiredEnv(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

function getPrivateKey() {
  const raw = String(process.env.FIREBASE_PRIVATE_KEY || '').trim();
  if (!raw) {
    throw new Error('Variável de ambiente obrigatória ausente: FIREBASE_PRIVATE_KEY');
  }
  return raw.replace(/\\n/g, '\n');
}

function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = readRequiredEnv('FIREBASE_PROJECT_ID');
  const clientEmail = readRequiredEnv('FIREBASE_CLIENT_EMAIL');
  const privateKey = getPrivateKey();

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    projectId,
  });
}

export function getDb() {
  return getFirestore(getFirebaseApp());
}
