import { QuizQuestion } from '../types';

interface QuizRecommendation {
  moduleId: string;
  moduleTitle: string;
  lessonTitle: string;
  reason: string;
}

const recommendationMap: Record<number, QuizRecommendation> = {
  1: { moduleId: 'operacao-basica', moduleTitle: 'Operação Básica', lessonTitle: 'Movimentos Fundamentais', reason: 'Reforce a altura de transporte dos garfos.' },
  2: { moduleId: 'seguranca', moduleTitle: 'Segurança Operacional', lessonTitle: 'Prevenção de Acidentes', reason: 'Revise conduta correta em tombamento.' },
  3: { moduleId: 'normas-nr11', moduleTitle: 'Normas Regulamentadoras (NR-11)', lessonTitle: 'NR-11', reason: 'Fortaleça base normativa e legal.' },
  4: { moduleId: 'operacao-basica', moduleTitle: 'Operação Básica', lessonTitle: 'Movimentos Fundamentais', reason: 'Revise condução em rampas com carga.' },
  5: { moduleId: 'manuseio-cargas', moduleTitle: 'Manuseio de Cargas', lessonTitle: 'Estabilidade e Centro de Gravidade', reason: 'Revisar triângulo de estabilidade.' },
  6: { moduleId: 'normas-nr11', moduleTitle: 'Normas Regulamentadoras (NR-11)', lessonTitle: 'Direitos e Deveres', reason: 'Reforçar direitos e deveres do operador.' },
  7: { moduleId: 'direcao-defensiva', moduleTitle: 'Direção Defensiva', lessonTitle: 'Princípios da Direção Defensiva', reason: 'Revisar foco e comportamento seguro.' },
  8: { moduleId: 'direcao-defensiva', moduleTitle: 'Direção Defensiva', lessonTitle: 'Condições Adversas', reason: 'Treinar operação em piso molhado.' },
  9: { moduleId: 'operacao-basica', moduleTitle: 'Operação Básica', lessonTitle: 'Movimentos Fundamentais', reason: 'Reforçar descida de rampa com carga.' },
  10: { moduleId: 'manutencao', moduleTitle: 'Manutenção Preventiva', lessonTitle: 'Inspeção Pré-Operacional', reason: 'Consolidar rotina de inspeção por turno.' },
  11: { moduleId: 'manutencao', moduleTitle: 'Manutenção Preventiva', lessonTitle: 'Inspeção Pré-Operacional', reason: 'Reforçar protocolo para anomalias e vazamentos.' },
  12: { moduleId: 'normas-nr11', moduleTitle: 'Normas Regulamentadoras (NR-11)', lessonTitle: 'Sinalização e Áreas de Operação', reason: 'Revisar limites de velocidade interna.' },
  13: { moduleId: 'manuseio-cargas', moduleTitle: 'Manuseio de Cargas', lessonTitle: 'Técnicas de Empilhamento', reason: 'Praticar sequência correta de empilhamento.' },
  14: { moduleId: 'manutencao', moduleTitle: 'Manutenção Preventiva', lessonTitle: 'Cuidados com Bateria e Combustível', reason: 'Revisar cuidados com baterias elétricas.' },
  15: { moduleId: 'manuseio-cargas', moduleTitle: 'Manuseio de Cargas', lessonTitle: 'Estabilidade e Centro de Gravidade', reason: 'Reforçar conceito de centro de carga.' },
};

export function getQuizReviewRecommendations(wrongQuestions: QuizQuestion[]): QuizRecommendation[] {
  const unique = new Map<string, QuizRecommendation>();

  for (const question of wrongQuestions) {
    const rec = recommendationMap[question.id];
    if (!rec) continue;
    const key = `${rec.moduleId}-${rec.lessonTitle}`;
    if (!unique.has(key)) {
      unique.set(key, rec);
    }
  }

  return Array.from(unique.values());
}
