import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Sidebar, { Page, AdminPage, OperatorPage } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TrainingModules from './components/TrainingModules';
import DailyTips from './components/DailyTips';
import Quiz from './components/Quiz';
import Checklist from './components/Checklist';
import VideoAulas from './components/VideoAulas';
import LearningTracks from './components/LearningTracks';
import TrainingReport from './components/TrainingReport';
import { TrainingProgressProvider } from './context/TrainingProgressContext';
import AdminDashboard from './components/AdminDashboard';
import UsersManager from './components/UsersManager';
import TokenManager from './components/TokenManager';
import Reports from './components/Reports';
import AdminTickets from './components/AdminTickets';
import AdminSettings from './components/AdminSettings';
import AppLogo from './components/AppLogo';
import { BRAND } from './config/brand';

const operatorDefaultPage: OperatorPage = 'dashboard';
const adminDefaultPage: AdminPage = 'admin-dashboard';

const operatorPages = new Set<Page>([
  'dashboard',
  'tracks',
  'modules',
  'tips',
  'quiz',
  'checklist',
  'videoaulas',
  'training-report',
]);

const adminPages = new Set<Page>([
  'admin-dashboard',
  'admin-users',
  'admin-tokens',
  'admin-tickets',
  'admin-reports',
  'admin-settings',
  'admin-videoaulas',
]);

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(isAdmin ? adminDefaultPage : operatorDefaultPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAdmin && !adminPages.has(currentPage)) {
      setCurrentPage(adminDefaultPage);
      return;
    }

    if (!isAdmin && !operatorPages.has(currentPage)) {
      setCurrentPage(operatorDefaultPage);
    }
  }, [currentPage, isAdmin]);

  const renderPage = () => {
    if (isAdmin) {
      switch (currentPage) {
        case 'admin-dashboard':
          return <AdminDashboard />;
        case 'admin-users':
          return <UsersManager />;
        case 'admin-tokens':
          return <TokenManager />;
        case 'admin-tickets':
          return <AdminTickets />;
        case 'admin-reports':
          return <Reports />;
        case 'admin-settings':
          return <AdminSettings onNavigateToVideoAulas={() => setCurrentPage('admin-videoaulas')} />;
        case 'admin-videoaulas':
          return <VideoAulas isAdmin={true} />;
        default:
          return <AdminDashboard />;
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'tracks':
        return <LearningTracks />;
      case 'modules':
        return <TrainingModules />;
      case 'tips':
        return <DailyTips />;
      case 'quiz':
        return <Quiz onNavigateToModules={() => setCurrentPage('modules')} />;
      case 'checklist':
        return <Checklist />;
      case 'videoaulas':
        return <VideoAulas isAdmin={isAdmin} />;
      case 'training-report':
        return <TrainingReport />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  const pageTitles: Record<Page, string> = {
    dashboard: 'Painel Geral',
    tracks: 'Trilhas e Certificação',
    modules: 'Módulos de Treinamento',
    tips: 'Dicas Diárias',
    quiz: 'Quiz de Conhecimento',
    checklist: 'Checklist Pré-Operacional',
    videoaulas: 'Videoaulas Práticas',
    'training-report': 'Meu Relatório',
    'admin-dashboard': 'Dashboard Administrativo',
    'admin-users': 'Gestão de Usuários',
    'admin-tokens': 'Gerenciamento de Tokens',
    'admin-tickets': 'Chamados',
    'admin-reports': 'Relatórios',
    'admin-settings': 'Configurações',
    'admin-videoaulas': 'Gestão de Videoaulas',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-lg font-bold text-gray-900">{pageTitles[currentPage]}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                <AppLogo size="sm" tone="amber" name={BRAND.shortName} />
              </div>
              {user && (
                <div
                  className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                    isAdmin
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-green-50 border-green-200 text-green-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-red-500' : 'bg-green-500'}`} />
                  {isAdmin ? 'Admin' : 'Operator'}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">{renderPage()}</main>
      </div>
    </div>
  );
}

function AppRouter() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainApp /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <TrainingProgressProvider>
        <AppRouter />
      </TrainingProgressProvider>
    </AuthProvider>
  );
}
