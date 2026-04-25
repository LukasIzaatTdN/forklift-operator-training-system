export const BRAND = {
  name: 'Tropa do Garfo',
  shortName: 'EmpilhaPro',
  subtitle: 'Sistema de Aperfeiçoamento para Operadores',
  markText: 'TG',
  logoExternalUrl: (import.meta.env.VITE_BRAND_LOGO_URL || '').trim() || null,
  logoInternalPath: (import.meta.env.VITE_BRAND_LOGO_INTERNAL_PATH || '').trim() || null,
  logoUrl:
    (import.meta.env.VITE_BRAND_LOGO_URL || '').trim() ||
    (import.meta.env.VITE_BRAND_LOGO_INTERNAL_PATH || '').trim() ||
    null,
};
