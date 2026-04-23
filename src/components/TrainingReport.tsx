import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrainingProgress } from '../context/TrainingProgressContext';
import { trainingModules } from '../data/modules';
import {
  getCertificateStatusLabel,
  getCertificateValidUntil,
  isCertificateExpired,
  printCertificateAsPdf,
} from '../utils/certificates';

export default function TrainingReport() {
  const { user } = useAuth();
  const { progress } = useTrainingProgress();

  const bestQuizScore = useMemo(
    () =>
      progress?.quizAttempts.reduce(
        (best, attempt) => (attempt.percentage > best ? attempt.percentage : best),
        0
      ) || 0,
    [progress]
  );

  if (!user || !progress) {
    return <p className="text-sm text-gray-500">Não foi possível carregar seu relatório.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">📈 Meu Relatório de Treinamento</h1>
        <p className="text-gray-500">Acompanhe sua evolução, tentativas de quiz e certificados.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Operador" value={user.name} emoji="👤" />
        <StatCard
          title="Módulos"
          value={`${progress.completedModuleIds.length}/${trainingModules.length}`}
          emoji="📚"
        />
        <StatCard title="Melhor quiz" value={`${bestQuizScore}%`} emoji="🧠" />
        <StatCard title="Tentativas" value={`${progress.quizAttempts.length}`} emoji="📝" />
        <StatCard title="Checklists" value={`${progress.checklistCompletions}`} emoji="✅" />
        <StatCard title="Certificados" value={`${progress.certificates.length}`} emoji="📄" />
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Últimas Tentativas de Quiz</h2>
        {progress.quizAttempts.length > 0 ? (
          <div className="space-y-2">
            {progress.quizAttempts.slice(0, 5).map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm">
                <span className="text-gray-700">{new Date(attempt.completedAt).toLocaleString('pt-BR')}</span>
                <span className={`font-semibold ${attempt.passed ? 'text-green-700' : 'text-amber-700'}`}>
                  {attempt.score}/{attempt.totalQuestions} ({attempt.percentage}%)
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Sem tentativas registradas.</p>
        )}
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Certificados</h2>
        {progress.certificates.length > 0 ? (
          <div className="space-y-2">
            {progress.certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-green-900">{cert.trackTitle}</p>
                  <p className="text-green-700">
                    Emitido em {new Date(cert.issuedAt).toLocaleDateString('pt-BR')} | Válido até{' '}
                    {new Date(getCertificateValidUntil(cert)).toLocaleDateString('pt-BR')} | Nota final: {cert.finalScore}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full bg-white font-medium border ${
                      isCertificateExpired(cert)
                        ? 'border-red-300 text-red-700'
                        : 'border-green-300 text-green-700'
                    }`}
                  >
                    {getCertificateStatusLabel(cert)}
                  </span>
                  <button
                    onClick={() =>
                      printCertificateAsPdf({
                        certificate: cert,
                        operatorName: user.name,
                        operatorRole: user.role,
                      })
                    }
                    className="text-xs px-2 py-1 rounded-full bg-white border border-blue-200 text-blue-700 font-medium hover:bg-blue-50 transition-colors"
                  >
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhum certificado emitido.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, emoji }: { title: string; value: string; emoji: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="text-base font-bold text-gray-900 truncate">{value}</div>
      <div className="text-xs text-gray-500">{title}</div>
    </div>
  );
}
