import { useMemo, useState } from 'react';
import { trainingModules } from '../data/modules';
import { useTrainingProgress } from '../context/TrainingProgressContext';
import { lessonMicroQuizzes } from '../data/lessonMicroQuizzes';
import { moduleImages } from '../data/moduleImages';

export default function TrainingModules() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [lessonAnswers, setLessonAnswers] = useState<Record<string, number>>({});
  const [lessonResult, setLessonResult] = useState<Record<string, 'correct' | 'wrong'>>({});

  const { progress, markLessonCompleted } = useTrainingProgress();
  const currentModule = trainingModules.find((m) => m.id === selectedModule);
  const completedLessonIds = progress?.completedLessonIds || [];

  const getModuleLessonCount = (moduleId: string) => {
    const module = trainingModules.find((item) => item.id === moduleId);
    if (!module) return { done: 0, total: 0 };

    const done = module.lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
    return { done, total: module.lessons.length };
  };

  const handleMicroQuizAnswer = (moduleId: string, lessonId: string, answerIndex: number) => {
    const quiz = lessonMicroQuizzes[lessonId];
    if (!quiz) return;

    setLessonAnswers((prev) => ({ ...prev, [lessonId]: answerIndex }));

    const isCorrect = answerIndex === quiz.correctAnswer;
    if (isCorrect) {
      const module = trainingModules.find((item) => item.id === moduleId);
      const lessonIds = module ? module.lessons.map((lesson) => lesson.id) : [lessonId];
      markLessonCompleted(moduleId, lessonId, lessonIds);
      setLessonResult((prev) => ({ ...prev, [lessonId]: 'correct' }));
      return;
    }

    setLessonResult((prev) => ({ ...prev, [lessonId]: 'wrong' }));
  };

  const currentModuleProgress = useMemo(() => {
    if (!currentModule) return { done: 0, total: 0, percentage: 0 };
    const done = currentModule.lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
    const total = currentModule.lessons.length;
    return {
      done,
      total,
      percentage: Math.round((done / total) * 100),
    };
  }, [completedLessonIds, currentModule]);

  if (currentModule) {
    const imageMeta = moduleImages[currentModule.id];

    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setSelectedModule(null);
            setExpandedLesson(null);
          }}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Voltar para módulos
        </button>

        <div className={`bg-gradient-to-r ${currentModule.color} rounded-2xl p-6 md:p-8 text-white shadow-lg`}>
          <div className="grid md:grid-cols-[1fr_280px] gap-5 items-center">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">{currentModule.icon}</span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{currentModule.title}</h1>
                  <p className="text-sm opacity-90 mt-1">{currentModule.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                  {currentModuleProgress.done}/{currentModuleProgress.total} lições concluídas
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                  {currentModuleProgress.percentage}% do módulo
                </span>
              </div>
            </div>
            {imageMeta && (
              <img
                src={imageMeta.url}
                alt={imageMeta.alt}
                className="w-full h-44 object-cover rounded-xl border border-white/20 shadow"
                loading="lazy"
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
            <span>Progresso por lição</span>
            <span className="font-semibold text-indigo-700">{currentModuleProgress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all"
              style={{ width: `${currentModuleProgress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Para concluir a lição: leia o conteúdo e acerte o microquiz.
          </p>
        </div>

        <div className="space-y-4">
          {currentModule.lessons.map((lesson, index) => {
            const quiz = lessonMicroQuizzes[lesson.id];
            const done = completedLessonIds.includes(lesson.id);
            const answer = lessonAnswers[lesson.id];
            const result = lessonResult[lesson.id];

            return (
              <div key={lesson.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${currentModule.color} flex items-center justify-center text-white text-sm font-bold`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      {done && (
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                          Concluída
                        </span>
                      )}
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedLesson === lesson.id ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedLesson === lesson.id && (
                  <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                    <ul className="space-y-3">
                      {lesson.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                          <span className="text-amber-500 mt-1 shrink-0">●</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {lesson.highlights && lesson.highlights.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-1">✅ Pontos Importantes</h4>
                        <ul className="space-y-2">
                          {lesson.highlights.map((h, i) => (
                            <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                              <span className="text-green-500 mt-0.5 shrink-0">✔</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {lesson.warnings && lesson.warnings.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <h4 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-1">⚠️ Atenção</h4>
                        <ul className="space-y-2">
                          {lesson.warnings.map((w, i) => (
                            <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                              <span className="text-red-500 mt-0.5 shrink-0">🚨</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {quiz && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                        <h4 className="text-sm font-bold text-indigo-900 mb-2">🧪 Microquiz da Lição</h4>
                        <p className="text-sm text-indigo-800 mb-3">{quiz.question}</p>
                        <div className="space-y-2">
                          {quiz.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              onClick={() => handleMicroQuizAnswer(currentModule.id, lesson.id, optionIndex)}
                              className={`w-full text-left text-sm p-3 rounded-lg border transition-colors ${
                                answer === optionIndex
                                  ? optionIndex === quiz.correctAnswer
                                    ? 'bg-green-50 border-green-300 text-green-800'
                                    : 'bg-red-50 border-red-300 text-red-800'
                                  : 'bg-white border-indigo-100 hover:bg-indigo-100 text-gray-700'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>

                        {result === 'correct' && (
                          <p className="mt-3 text-sm text-green-700 font-medium">
                            ✅ Correto! Lição marcada como concluída. {quiz.explanation}
                          </p>
                        )}
                        {result === 'wrong' && (
                          <p className="mt-3 text-sm text-red-700 font-medium">
                            ❌ Resposta incorreta. Revise os pontos principais e tente novamente.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">📚 Módulos de Treinamento</h1>
        <p className="text-gray-500">Selecione um módulo para acessar o conteúdo completo de treinamento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainingModules.map((mod) => {
          const count = getModuleLessonCount(mod.id);
          const done = count.total > 0 && count.done === count.total;
          const percentage = count.total > 0 ? Math.round((count.done / count.total) * 100) : 0;
          const imageMeta = moduleImages[mod.id];

          return (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod.id)}
              className="bg-white rounded-xl p-0 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all text-left group overflow-hidden"
            >
              {imageMeta && (
                <img src={imageMeta.url} alt={imageMeta.alt} className="w-full h-32 object-cover" loading="lazy" />
              )}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform`}>
                    {mod.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{mod.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {count.done}/{count.total} lições
                      </span>
                      <span className="text-xs text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full font-medium">
                        {percentage}%
                      </span>
                      {done && (
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                          Concluído
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
