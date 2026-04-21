import { useState, useEffect } from 'react';
import { dailyTips } from '../data/tips';
import { quizQuestions } from '../data/quiz';
import { trainingModules } from '../data/modules';
import { defaultVideos } from '../data/videos';

const STORAGE_KEY = 'empilhapro_videos';

interface DashboardProps {
  onNavigate: (page: 'tracks' | 'modules' | 'tips' | 'quiz' | 'checklist' | 'videoaulas' | 'report') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [tipOfDay, setTipOfDay] = useState(0);
  const [totalVideos, setTotalVideos] = useState(defaultVideos.length);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    setTipOfDay(dayOfYear % dailyTips.length);

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTotalVideos(parsed.length);
      } catch {
        setTotalVideos(defaultVideos.length);
      }
    }
  }, []);

  const currentTip = dailyTips[tipOfDay];

  const categoryEmojis: Record<string, string> = {
    seguranca: '🛡️',
    operacao: '⚙️',
    manutencao: '🔧',
    ergonomia: '🪑',
  };

  const categoryLabels: Record<string, string> = {
    seguranca: 'Segurança',
    operacao: 'Operação',
    manutencao: 'Manutenção',
    ergonomia: 'Ergonomia',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          👋 Bem-vindo ao EmpilhaPro!
        </h1>
        <p className="text-yellow-100 text-sm md:text-base max-w-xl">
          Seu sistema completo de aperfeiçoamento e dicas para operadores de empilhadeira.
          Continue aprendendo e se aperfeiçoando todos os dias!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-2xl font-bold text-gray-900">{trainingModules.length}</div>
          <div className="text-xs text-gray-500">Módulos de Treinamento</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">🎬</div>
          <div className="text-2xl font-bold text-gray-900">{totalVideos}</div>
          <div className="text-xs text-gray-500">Videoaulas</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">💡</div>
          <div className="text-2xl font-bold text-gray-900">{dailyTips.length}</div>
          <div className="text-xs text-gray-500">Dicas Disponíveis</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">🧠</div>
          <div className="text-2xl font-bold text-gray-900">{quizQuestions.length}</div>
          <div className="text-xs text-gray-500">Perguntas no Quiz</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 col-span-2 md:col-span-1">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-gray-900">32</div>
          <div className="text-xs text-gray-500">Itens de Checklist</div>
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⭐</span>
          <h2 className="text-lg font-bold text-indigo-900">Dica do Dia</h2>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">{currentTip.emoji}</span>
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 mb-1">
                {categoryEmojis[currentTip.category]} {categoryLabels[currentTip.category]}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">{currentTip.title}</h3>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{currentTip.content}</p>
        </div>
        <button
          onClick={() => onNavigate('tips')}
          className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Ver todas as dicas →
        </button>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('tracks')}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-left group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-1">Trilhas e Certificação</h3>
            <p className="text-xs text-gray-500">Acompanhe critérios de conclusão e emita certificados</p>
          </button>

          <button
            onClick={() => onNavigate('modules')}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-left group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📚</div>
            <h3 className="font-semibold text-gray-900 mb-1">Módulos de Treinamento</h3>
            <p className="text-xs text-gray-500">{trainingModules.length} módulos com conteúdo detalhado</p>
          </button>

          <button
            onClick={() => onNavigate('videoaulas')}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-200 transition-all text-left group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎬</div>
            <h3 className="font-semibold text-gray-900 mb-1">Videoaulas Práticas</h3>
            <p className="text-xs text-gray-500">{totalVideos} videoaulas sobre operação de empilhadeira</p>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all text-left group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🧠</div>
            <h3 className="font-semibold text-gray-900 mb-1">Quiz de Conhecimento</h3>
            <p className="text-xs text-gray-500">Teste seus conhecimentos com {quizQuestions.length} perguntas</p>
          </button>

          <button
            onClick={() => onNavigate('checklist')}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all text-left group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">✅</div>
            <h3 className="font-semibold text-gray-900 mb-1">Checklist Pré-Operacional</h3>
            <p className="text-xs text-gray-500">32 itens para inspeção diária completa</p>
          </button>

          <button
            onClick={() => onNavigate('report')}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all text-left group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📈</div>
            <h3 className="font-semibold text-gray-900 mb-1">Relatório de Treinamento</h3>
            <p className="text-xs text-gray-500">Visualize progresso, tentativas e certificados</p>
          </button>
        </div>
      </div>

      {/* Modules Preview */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Módulos de Treinamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {trainingModules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-2xl shrink-0`}>
                {mod.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{mod.title}</h3>
                <p className="text-xs text-gray-500">{mod.lessons.length} lições</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
        <h2 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
          <span>🚨</span> Números de Emergência
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-600">192</div>
            <div className="text-xs text-gray-600">SAMU</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-600">193</div>
            <div className="text-xs text-gray-600">Bombeiros</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-600">190</div>
            <div className="text-xs text-gray-600">Polícia</div>
          </div>
        </div>
      </div>
    </div>
  );
}
