import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { BRAND } from '../config/brand';
import { firestoreDb } from './firebase';

const BRANDING_DOC_PATH = ['app_config', 'branding'] as const;
const BRANDING_STORAGE_KEY = 'empilhapro_branding_config';

export interface BrandingConfig {
  logoExternalUrl: string | null;
  logoInternalPath: string | null;
}

function normalizeUrl(value: unknown): string | null {
  const normalized = String(value || '').trim();
  return normalized || null;
}

function normalizeBranding(input?: Partial<BrandingConfig> | null): BrandingConfig {
  return {
    logoExternalUrl: normalizeUrl(input?.logoExternalUrl),
    logoInternalPath: normalizeUrl(input?.logoInternalPath),
  };
}

function defaultBranding(): BrandingConfig {
  return normalizeBranding({
    logoExternalUrl: BRAND.logoExternalUrl,
    logoInternalPath: BRAND.logoInternalPath,
  });
}

function mergeWithDefault(input?: Partial<BrandingConfig> | null): BrandingConfig {
  const defaults = defaultBranding();
  const normalized = normalizeBranding(input);
  return {
    logoExternalUrl: normalized.logoExternalUrl ?? defaults.logoExternalUrl,
    logoInternalPath: normalized.logoInternalPath ?? defaults.logoInternalPath,
  };
}

function getBrandingRef() {
  if (!firestoreDb) return null;
  return doc(firestoreDb, ...BRANDING_DOC_PATH);
}

function readLocalBranding(): BrandingConfig {
  const defaults = defaultBranding();
  const stored = localStorage.getItem(BRANDING_STORAGE_KEY);
  if (!stored) return defaults;

  try {
    const parsed = JSON.parse(stored) as Partial<BrandingConfig>;
    return mergeWithDefault(parsed);
  } catch {
    return defaults;
  }
}

function persistLocalBranding(config: BrandingConfig): void {
  localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(config));
}

export function subscribeBrandingConfig(
  onChange: (config: BrandingConfig) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const ref = getBrandingRef();
  if (!ref) {
    onChange(readLocalBranding());
    return () => {};
  }

  return onSnapshot(
    ref,
    (snapshot) => {
      const data = snapshot.exists() ? (snapshot.data() as Partial<BrandingConfig>) : null;
      const merged = mergeWithDefault(data);
      persistLocalBranding(merged);
      onChange(merged);
    },
    (error) => {
      onChange(readLocalBranding());
      if (onError) onError(error);
    }
  );
}

export async function saveBrandingConfig(config: BrandingConfig): Promise<void> {
  const normalized = normalizeBranding(config);
  persistLocalBranding(normalized);

  const ref = getBrandingRef();
  if (!ref) return;

  await setDoc(
    ref,
    {
      ...normalized,
      updatedAt: serverTimestamp(),
      updatedAtMs: Date.now(),
    },
    { merge: true }
  );
}
