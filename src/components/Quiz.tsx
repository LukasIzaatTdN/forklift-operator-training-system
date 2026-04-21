import { useState, useCallback } from 'react';
import { quizQuestions } from '../data/quiz';
import { useTrainingProgress } from '../context/TrainingProgressContext';
import { getQuizReviewRecommendations } from '../data/quizRecommendations';

interface QuizProps {
  onNavigateToModules?: () => void;
}

export default function Quiz({ onNavigateToModules }: QuizProps) {
  const { progress, recordQuizAttempt } = useTrainingProgress();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];

  const handleStart = useCallback(() => {
    setStarted(true);
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setAnswered(false);
  }, []);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (answered) return;
      setSelectedAnswer(answerIndex);
      setAnswered(true);
      setAnswers((prev) => [...prev, answerIndex]);
    },
    [answered]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      const finalScore = answers.filter(
        (ans, i) => ans === quizQuestions[i].correctAnswer
      ).length;
      recordQuizAttempt(finalScore, quizQuestions.length);
      setShowResult(true);
    }
  }, [answers, currentIndex, recordQuizAttempt]);

  const score = answers.filter(
    (ans, i) => ans === quizQuestions[i].correctAnswer
  ).length;

  const percentage = Math.round((score / quizQuestions.length) * 100);
  const wrongQuestions = quizQuestions.filter((q, i) => answers[i] !== q.correctAnswer);
  const reviewRecommendations = getQuizReviewRecommendations(wrongQuestions);

  if (showResult) {
    const getMessage = () => {
      if (percentage >= 90) return { text: 'Excelente! Você é um expert! 🏆', color: 'text-green-600' };
      if (percentage >= 70) return { text: 'Muito bom! Continue assim! 👏', color: 'text-blue-600' };
      if (percentage >= 50) return { text: 'Bom trabalho, mas pode melhorar! 💪', color: 'text-amber-600' };
      return { text: 'Revise os módulos e tente novamente! 📚', color: 'text-red-600' };
    };

    const msg = getMessage();

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-6xl mb-4">
            {percentage >= 70 ? '🎉' : '📖'}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resultado do Quiz</h1>

          {/* Score Circle */}
          <div className="relative w-36 h-36 mx-auto my-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 283} 283`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
              <span className="text-xs text-gray-500">
                {score}/{quizQuestions.length}
              </span>
            </div>
          </div>

          <p className={`text-lg font-semibold ${msg.color} mb-4`}>
            {msg.text}
          </p>

          <button
            onClick={handleStart}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors shadow-md shadow-amber-200"
          >
            🔄 Tentar Novamente
          </button>
        </div>

        {reviewRecommendations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-blue-900 mb-2">📌 Revisão Recomendada</h2>
            <p className="text-sm text-blue-800 mb-3">
              Com base nos erros desta tentativa, revise estes tópicos para subir sua performance:
            </p>
            <div className="space-y-2">
              {reviewRecommendations.map((item) => (
                <div key={`${item.moduleId}-${item.lessonTitle}`} className="bg-white border border-blue-100 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900">{item.moduleTitle}</p>
                  <p className="text-xs text-gray-600">Lição: {item.lessonTitle}</p>
                  <p className="text-xs text-blue-700 mt-1">{item.reason}</p>
                </div>
              ))}
            </div>
            {onNavigateToModules && (
              <button
                onClick={onNavigateToModules}
                className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Ir para Módulos
              </button>
            )}
          </div>
        )}

        {/* Review Answers */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Revisão das Respostas</h2>
          {quizQuestions.map((q, i) => {
            const isCorrect = answers[i] === q.correctAnswer;
            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl p-4 shadow-sm border ${
                  isCorrect ? 'border-green-200' : 'border-red-200'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">{isCorrect ? '✅' : '❌'}</span>
                  <p className="text-sm font-medium text-gray-900">{q.question}</p>
                </div>
                {!isCorrect && (
                  <div className="ml-7 space-y-1 text-xs">
                    <p className="text-red-600">
                      Sua resposta: {q.options[answers[i]]}
                    </p>
                    <p className="text-green-600">
                      Resposta correta: {q.options[q.correctAnswer]}
                    </p>
                    <p className="text-gray-500 mt-1">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 md:p-8 text-white text-center shadow-lg">
          <span className="text-6xl block mb-4">🧠</span>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Quiz de Conhecimento
          </h1>
          <p className="text-green-100 text-sm md:text-base max-w-lg mx-auto">
            Teste seus conhecimentos sobre operação de empilhadeira! São{' '}
            {quizQuestions.length} perguntas sobre segurança, operação, normas e
            manutenção.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{quizQuestions.length}</div>
              <div className="text-xs text-gray-500">Perguntas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-xs text-gray-500">Opções cada</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">70%</div>
              <div className="text-xs text-gray-500">Mínimo p/ aprovação</div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-xl transition-all shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300"
          >
            🚀 Iniciar Quiz
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Histórico de Tentativas</h2>
          {progress && progress.quizAttempts.length > 0 ? (
            <div className="space-y-2">
              {progress.quizAttempts.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm">
                  <span className="text-gray-600">
                    {new Date(attempt.completedAt).toLocaleString('pt-BR')}
                  </span>
                  <span className={`font-semibold ${attempt.passed ? 'text-green-700' : 'text-amber-700'}`}>
                    {attempt.score}/{attempt.totalQuestions} ({attempt.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma tentativa registrada ainda.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Pergunta {currentIndex + 1} de {quizQuestions.length}
          </span>
          <span className="text-sm font-medium text-amber-600">
            {Math.round(((currentIndex) / quizQuestions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
            {currentIndex + 1}
          </span>
          <span className="text-xs text-gray-400">
            {currentIndex < quizQuestions.length - 1
              ? `${quizQuestions.length - currentIndex - 1} restantes`
              : 'Última pergunta!'}
          </span>
        </div>

        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, i) => {
            let optionStyle =
              'bg-gray-50 border-gray-200 hover:border-amber-400 hover:bg-amber-50';

            if (answered) {
              if (i === currentQuestion.correctAnswer) {
                optionStyle = 'bg-green-50 border-green-400 text-green-800';
              } else if (i === selectedAnswer && i !== currentQuestion.correctAnswer) {
                optionStyle = 'bg-red-50 border-red-400 text-red-800';
              } else {
                optionStyle = 'bg-gray-50 border-gray-200 opacity-50';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${optionStyle} ${
                  !answered ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                      answered && i === currentQuestion.correctAnswer
                        ? 'bg-green-500 border-green-500 text-white'
                        : answered && i === selectedAnswer
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {answered && i === currentQuestion.correctAnswer
                      ? '✓'
                      : answered && i === selectedAnswer
                        ? '✗'
                        : String.fromCharCode(65 + i)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div
            className={`mt-4 p-4 rounded-xl text-sm leading-relaxed ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}
          >
            <p className="font-bold mb-1">
              {selectedAnswer === currentQuestion.correctAnswer
                ? '✅ Correto!'
                : '❌ Incorreto'}
            </p>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Next Button */}
        {answered && (
          <button
            onClick={handleNext}
            className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-xl transition-all shadow-md shadow-amber-200"
          >
            {currentIndex < quizQuestions.length - 1 ? 'Próxima Pergunta →' : 'Ver Resultado 🏆'}
          </button>
        )}
      </div>
    </div>
  );
}
