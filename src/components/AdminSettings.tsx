interface AdminSettingsProps {
  onNavigateToVideoAulas: () => void;
}

export default function AdminSettings({ onNavigateToVideoAulas }: AdminSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500">Ajustes administrativos do sistema.</p>
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
