import { useMemo, useState } from 'react';
import { trainingTracks } from '../data/tracks';
import { useAuth } from '../context/AuthContext';
import { useTrainingProgress } from '../context/TrainingProgressContext';
import { getCertificateStatusLabel, getCertificateValidUntil, isCertificateExpired, printCertificateAsPdf } from '../utils/certificates';

export default function LearningTracks() {
  const { user } = useAuth();
  const { progress, getTrackStatus, issueCertificate } = useTrainingProgress();
  const [feedback, setFeedback] = useState('');

  const availableTracks = useMemo(() => {
    if (!user) return [];
    return trainingTracks.filter((track) => track.targetRoles.includes(user.role));
  }, [user]);

  const handleIssueCertificate = async (trackId: string) => {
    const track = availableTracks.find((item) => item.id === trackId);
    if (!track) return;

    const cert = await issueCertificate(track);
    if (cert) {
      setFeedback(`Certificado emitido com sucesso para a trilha "${track.title}".`);
      return;
    }

    const status = getTrackStatus(track);
    const pendencias: string[] = [];
    if (!status.modulesDone) pendencias.push(`módulos (${status.modulesCompleted}/${status.modulesTotal})`);
    if (!status.quizDone) pendencias.push(`quiz (${status.bestQuizScore}% de ${track.quizMinScore}%)`);
    if (!status.checklistDone) pendencias.push('checklist');

    if (status.certified) {
      setFeedback('Esta trilha já possui certificado válido emitido.');
      return;
    }

    if (pendencias.length > 0) {
      setFeedback(`Ainda faltam requisitos para certificar: ${pendencias.join(', ')}.`);
      return;
    }

    setFeedback('Não foi possível emitir o certificado agora. Verifique conexão/permissões e tente novamente.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">🎯 Trilhas de Treinamento</h1>
        <p className="text-indigo-100 text-sm md:text-base max-w-2xl">
          Conclua os módulos obrigatórios, atinja a nota mínima no quiz e finalize o checklist para emitir
          seu certificado.
        </p>
      </div>

      {feedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {availableTracks.map((track) => {
          const status = getTrackStatus(track);

          return (
            <div key={track.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{track.title}</h2>
              <p className="text-sm text-gray-500 mt-1 mb-4">{track.description}</p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progresso da trilha</span>
                    <span className="font-semibold text-indigo-700">{status.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${status.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="flex items-center justify-between">
                    <span>Módulos obrigatórios</span>
                    <span className={status.modulesDone ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                      {status.modulesCompleted}/{status.modulesTotal}
                    </span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Nota mínima no quiz</span>
                    <span className={status.quizDone ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                      {status.bestQuizScore}% / {track.quizMinScore}%
                    </span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Checklist diário</span>
                    <span className={status.checklistDone ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                      {status.checklistDone ? 'Concluído' : 'Pendente'}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => void handleIssueCertificate(track.id)}
                disabled={status.certified || !status.modulesDone || !status.quizDone || !status.checklistDone}
                className="mt-5 w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700"
              >
                {status.certified ? '✅ Certificado já emitido' : '📄 Emitir certificado'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Certificados Emitidos</h2>
        {progress && progress.certificates.length > 0 ? (
          <div className="space-y-2">
            {progress.certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-green-50 border border-green-200 rounded-xl p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-green-900">{cert.trackTitle}</p>
                  <p className="text-xs text-green-700">
                    Emitido em {new Date(cert.issuedAt).toLocaleDateString('pt-BR')} com nota final {cert.finalScore}%.
                    {' '}Válido até {new Date(getCertificateValidUntil(cert)).toLocaleDateString('pt-BR')}.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full bg-white font-medium w-fit border ${
                    isCertificateExpired(cert)
                      ? 'border-red-300 text-red-700'
                      : 'border-green-300 text-green-800'
                  }`}>
                    {getCertificateStatusLabel(cert)}
                  </span>
                  {user && (
                    <button
                      onClick={() => printCertificateAsPdf({ certificate: cert, operatorName: user.name, operatorRole: user.role })}
                      className="text-xs px-2 py-1 rounded-full bg-white border border-blue-200 text-blue-700 font-medium hover:bg-blue-50 transition-colors"
                    >
                      PDF
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhum certificado emitido até o momento.</p>
        )}
      </div>
    </div>
  );
}
