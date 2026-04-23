import { TrainingTrack } from '../types';

export const trainingTracks: TrainingTrack[] = [
  {
    id: 'trilha-iniciante',
    title: 'Trilha Operador Iniciante',
    description: 'Base obrigatória para iniciar a operação com segurança.',
    targetRoles: ['operador', 'operator'],
    moduleIds: ['operacao-basica', 'seguranca'],
    quizMinScore: 70,
    checklistRequired: true,
  },
  {
    id: 'trilha-reciclagem',
    title: 'Trilha de Reciclagem',
    description: 'Revisão completa para reforçar normas e boas práticas.',
    targetRoles: ['operador', 'operator', 'admin'],
    moduleIds: ['operacao-basica', 'seguranca', 'manutencao', 'manuseio-cargas'],
    quizMinScore: 80,
    checklistRequired: true,
  },
];
