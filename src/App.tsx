import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TrainingModules from './components/TrainingModules';
import DailyTips from './components/DailyTips';
import Quiz from './components/Quiz';
import Checklist from './components/Checklist';
import VideoAulas from './components/VideoAulas';
import LearningTracks from './components/LearningTracks';
import TrainingReport from './components/TrainingReport';
import { TrainingProgressProvider } from './context/TrainingProgressContext';

type Page =
  | 'dashboard'
  | 'tracks'
  | 'modules'
  | 'tips'
  | 'quiz'
  | 'checklist'
  | 'videoaulas'
  | 'report';

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
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
      case 'report':
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
    report: 'Relatório de Treinamento',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Bar */}
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
              <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                <span className="text-sm">🚜</span>
                <span className="text-xs font-medium text-amber-700">EmpilhaPro</span>
              </div>
              {/* User Badge */}
              {user && (
                <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  isAdmin
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-red-500' : 'bg-green-500'}`} />
                  {isAdmin ? 'Admin' : 'Operador'}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {renderPage()}
        </main>
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
