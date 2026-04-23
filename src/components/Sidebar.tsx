import { useAuth } from '../context/AuthContext';
import { User } from '../types';

export type OperatorPage =
  | 'dashboard'
  | 'tracks'
  | 'modules'
  | 'tips'
  | 'quiz'
  | 'checklist'
  | 'videoaulas'
  | 'training-report';

export type AdminPage =
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-tokens'
  | 'admin-tickets'
  | 'admin-reports'
  | 'admin-settings';

export type Page = OperatorPage | AdminPage;

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const operatorMenuItems: { id: OperatorPage; label: string; icon: string; color: string }[] = [
  { id: 'dashboard', label: 'Painel Geral', icon: '📊', color: 'hover:bg-indigo-50' },
  { id: 'tracks', label: 'Trilhas e Certificação', icon: '🎯', color: 'hover:bg-sky-50' },
  { id: 'modules', label: 'Módulos de Treinamento', icon: '📚', color: 'hover:bg-blue-50' },
  { id: 'videoaulas', label: 'Videoaulas', icon: '🎬', color: 'hover:bg-violet-50' },
  { id: 'tips', label: 'Dicas Diárias', icon: '💡', color: 'hover:bg-amber-50' },
  { id: 'quiz', label: 'Quiz de Conhecimento', icon: '🧠', color: 'hover:bg-green-50' },
  { id: 'checklist', label: 'Checklist Pré-Operacional', icon: '✅', color: 'hover:bg-red-50' },
  { id: 'training-report', label: 'Meu Relatório', icon: '📈', color: 'hover:bg-teal-50' },
];

const adminMenuItems: { id: AdminPage; label: string; icon: string; color: string }[] = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: '📊', color: 'hover:bg-indigo-50' },
  { id: 'admin-users', label: 'Usuários', icon: '👥', color: 'hover:bg-blue-50' },
  { id: 'admin-tokens', label: 'Tokens', icon: '🎟️', color: 'hover:bg-purple-50' },
  { id: 'admin-tickets', label: 'Chamados', icon: '📋', color: 'hover:bg-amber-50' },
  { id: 'admin-reports', label: 'Relatórios', icon: '📈', color: 'hover:bg-emerald-50' },
  { id: 'admin-settings', label: 'Configurações', icon: '⚙️', color: 'hover:bg-slate-50' },
];

export default function Sidebar({ currentPage, onNavigate, isOpen, onClose, user }: SidebarProps) {
  const { logout, isAdmin } = useAuth();

  const avatarInitials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const menuItems = isAdmin ? adminMenuItems : operatorMenuItems;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed top-0 left-0 h-full z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 bg-gradient-to-r from-yellow-500 to-amber-500">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🚜</div>
              <div>
                <h1 className="text-lg font-bold text-white">EmpilhaPro</h1>
                <p className="text-xs text-yellow-100">{isAdmin ? 'Painel Administrativo' : 'Treinamento Operacional'}</p>
              </div>
            </div>
          </div>

          {user && (
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ${
                    isAdmin
                      ? 'bg-gradient-to-br from-red-500 to-orange-500'
                      : 'bg-gradient-to-br from-green-500 to-emerald-500'
                  }`}
                >
                  {avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      isAdmin
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-green-50 text-green-700 border border-green-100'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-red-500' : 'bg-green-500'}`} />
                    {isAdmin ? 'Administrador' : 'Operador'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Menu Principal</p>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-200'
                        : `text-gray-600 ${item.color} hover:text-gray-900`
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 space-y-3 border-t border-gray-100">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-800 mb-1">⚠️ Lembrete</p>
              <p className="text-xs text-amber-700">
                {isAdmin
                  ? 'Perfis e permissões devem sempre ser validados também no Firestore.'
                  : 'Segurança em primeiro lugar. Sempre siga os protocolos!'}
              </p>
            </div>

            <button
              onClick={() => void logout()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sair do Sistema
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
