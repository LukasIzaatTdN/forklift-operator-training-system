import { useEffect, useState } from 'react';
import AppLogo from './AppLogo';
import { saveBrandingConfig, subscribeBrandingConfig, type BrandingConfig } from '../lib/branding';

interface AdminSettingsProps {
  onNavigateToVideoAulas: () => void;
}

export default function AdminSettings({ onNavigateToVideoAulas }: AdminSettingsProps) {
  const [logoExternalUrl, setLogoExternalUrl] = useState('');
  const [logoInternalPath, setLogoInternalPath] = useState('');
  const [loadingBranding, setLoadingBranding] = useState(true);
  const [savingBranding, setSavingBranding] = useState(false);
  const [brandingMessage, setBrandingMessage] = useState('');
  const [brandingError, setBrandingError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeBrandingConfig(
      (config: BrandingConfig) => {
        setLogoExternalUrl(config.logoExternalUrl || '');
        setLogoInternalPath(config.logoInternalPath || '');
        setLoadingBranding(false);
      },
      () => {
        setBrandingError('Não foi possível carregar a configuração de logo.');
        setLoadingBranding(false);
      }
    );

    return unsubscribe;
  }, []);

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandingError('');
    setBrandingMessage('');
    setSavingBranding(true);

    try {
      await saveBrandingConfig({
        logoExternalUrl: logoExternalUrl.trim() || null,
        logoInternalPath: logoInternalPath.trim() || null,
      });
      setBrandingMessage('Logo atualizada com sucesso. A mudança já sincronizou para os usuários online.');
    } catch {
      setBrandingError('Falha ao salvar logo. Verifique permissões de admin e tente novamente.');
    } finally {
      setSavingBranding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500">Ajustes administrativos do sistema.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Branding e Logo</h2>
        <p className="text-sm text-gray-600 mb-4">
          Defina uma logo externa (URL) ou interna (arquivo em <code>/public</code>). As alterações sincronizam em
          tempo real para todo o sistema.
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Se os campos ficarem vazios, o sistema tenta localizar automaticamente em:
          <code> /logo.png</code>, <code>/logo.svg</code>, <code>/assets/logo.png</code> e <code>/images/logo.png</code>.
        </p>

        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-800 mb-2">Pré-visualização atual</p>
          <AppLogo
            size="md"
            tone="dark"
            logoSrc={logoExternalUrl.trim() || logoInternalPath.trim() || null}
            subtitle="A visualização usa a ordem: externa -> interna -> padrão"
          />
        </div>

        <form className="space-y-3" onSubmit={(e) => void handleSaveBranding(e)}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Logo Externa (URL)</label>
            <input
              type="text"
              value={logoExternalUrl}
              onChange={(e) => setLogoExternalUrl(e.target.value)}
              placeholder="https://cdn.seudominio.com/logo.png"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={loadingBranding || savingBranding}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Logo Interna (caminho em /public)</label>
            <input
              type="text"
              value={logoInternalPath}
              onChange={(e) => setLogoInternalPath(e.target.value)}
              placeholder="/logo.png"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={loadingBranding || savingBranding}
            />
          </div>

          {brandingError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {brandingError}
            </div>
          )}
          {brandingMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {brandingMessage}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loadingBranding || savingBranding}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              <span>💾</span>
              {savingBranding ? 'Salvando...' : 'Salvar Logo'}
            </button>

            <button
              type="button"
              onClick={() => {
                setLogoExternalUrl('');
                setLogoInternalPath('');
                setBrandingMessage('');
                setBrandingError('');
              }}
              disabled={loadingBranding || savingBranding}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Limpar campos
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Segurança</h2>
        <p className="text-sm text-gray-600">
          Para regras finais de acesso admin/operator, mantenha validações também nas regras do Firestore e não
          apenas no frontend.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Conteúdo de Videoaulas</h2>
        <p className="text-sm text-gray-600 mb-4">
          Gerencie o módulo de videoaulas para adicionar ou remover vídeos do treinamento.
        </p>
        <button
          onClick={onNavigateToVideoAulas}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          <span>🎬</span>
          Gerenciar Videoaulas
        </button>
      </div>
    </div>
  );
}
