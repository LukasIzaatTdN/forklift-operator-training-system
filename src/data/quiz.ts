import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Qual a altura correta dos garfos durante o transporte de cargas?',
    options: [
      'O mais alto possível para evitar obstáculos',
      '15 a 20 cm do chão',
      'Renteados ao chão',
      '50 cm do chão'
    ],
    correctAnswer: 1,
    explanation: 'Os garfos devem estar entre 15 e 20 cm do chão durante o transporte. Mais alto compromete a estabilidade, mais baixo pode bater em irregularidades.'
  },
  {
    id: 2,
    question: 'Em caso de tombamento da empilhadeira, o que o operador deve fazer?',
    options: [
      'Pular para fora rapidamente',
      'Ficar na cabine, segurar o volante e inclinar-se para o lado oposto',
      'Tentar saltar para o lado',
      'Gritar por ajuda e esperar'
    ],
    correctAnswer: 1,
    explanation: 'Nunca tente pular! A estrutura de proteção (ROPS) foi projetada para protegê-lo. Fique na cabine, segure firme o volante e incline-se para o lado oposto ao tombamento.'
  },
  {
    id: 3,
    question: 'Qual a NR que regulamenta o transporte e movimentação de materiais?',
    options: [
      'NR-6',
      'NR-10',
      'NR-11',
      'NR-12'
    ],
    correctAnswer: 2,
    explanation: 'A NR-11 estabelece os requisitos de segurança para operações de transporte, movimentação, armazenagem e manuseio de materiais.'
  },
  {
    id: 4,
    question: 'Ao subir uma rampa com carga, a carga deve ficar:',
    options: [
      'Voltada para trás (descendo a rampa)',
      'Voltada para cima (subindo a rampa)',
      'Lateral à rampa',
      'Não importa a posição'
    ],
    correctAnswer: 1,
    explanation: 'Ao subir rampas, a carga deve estar voltada para cima (à frente). Ao descer, a empilhadeira deve dar ré com a carga voltada para cima. Isso mantém a estabilidade.'
  },
  {
    id: 5,
    question: 'Qual é o formato que representa a estabilidade da empilhadeira?',
    options: [
      'Quadrado de estabilidade',
      'Círculo de estabilidade',
      'Triângulo de estabilidade',
      'Retângulo de estabilidade'
    ],
    correctAnswer: 2,
    explanation: 'O triângulo de estabilidade é formado pelos dois pontos das rodas dianteiras e o ponto central do eixo traseiro (eixo oscilante). O centro de gravidade deve permanecer dentro desse triângulo.'
  },
  {
    id: 6,
    question: 'O operador pode recusar-se a operar em condições inseguras?',
    options: [
      'Não, deve obedecer o supervisor',
      'Sim, é um direito do trabalhador',
      'Apenas se houver risco de morte',
      'Depende da empresa'
    ],
    correctAnswer: 1,
    explanation: 'O trabalhador tem o direito de recusar-se a operar em condições inseguras sem sofrer retaliação. A segurança é prioridade e está prevista nas normas regulamentadoras.'
  },
  {
    id: 7,
    question: 'O uso de celular durante a operação da empilhadeira é:',
    options: [
      'Permitido em trajetos curtos',
      'Permitido se usar viva-voz',
      'Proibido',
      'Permitido apenas para ligar ao supervisor'
    ],
    correctAnswer: 2,
    explanation: 'O uso de celular durante a operação é PROIBIDO. A atenção deve ser total à operação e ao ambiente ao redor.'
  },
  {
    id: 8,
    question: 'Em piso molhado, qual a recomendação de velocidade?',
    options: [
      'Manter a velocidade normal',
      'Reduzir em pelo menos 50%',
      'Acelerar para passar rápido',
      'Parar a operação completamente'
    ],
    correctAnswer: 1,
    explanation: 'Em piso molhado, reduza a velocidade em pelo menos 50%, evite frenagens bruscas e aumente a distância de segurança.'
  },
  {
    id: 9,
    question: 'Ao transportar carga em rampa descendente, o operador deve:',
    options: [
      'Descer de frente com a carga à frente',
      'Descer de ré com a carga voltada para cima',
      'Descer em zigue-zague',
      'Descer com os garfos elevados'
    ],
    correctAnswer: 1,
    explanation: 'Ao descer uma rampa, a empilhadeira deve dar ré com a carga voltada para cima (para o topo da rampa). Isso evita que a carga deslize e mantém a estabilidade.'
  },
  {
    id: 10,
    question: 'Quantas vezes por turno deve ser feita a inspeção pré-operacional?',
    options: [
      'Uma vez por semana',
      'Uma vez ao dia',
      'Antes de cada turno de trabalho',
      'Apenas quando o supervisor solicitar'
    ],
    correctAnswer: 2,
    explanation: 'A inspeção pré-operacional deve ser realizada ANTES de cada turno de trabalho. É obrigatória e deve ser registrada em checklist.'
  },
  {
    id: 11,
    question: 'O que fazer ao identificar um vazamento na empilhadeira?',
    options: [
      'Continuar operando até o fim do turno',
      'Colocar um recipiente embaixo e continuar',
      'Parar a operação e comunicar ao supervisor',
      'Tentar consertar sozinho'
    ],
    correctAnswer: 2,
    explanation: 'Ao identificar qualquer anomalia como vazamentos, pare a operação imediatamente e comunique ao supervisor. Não tente consertar se não for qualificado.'
  },
  {
    id: 12,
    question: 'Qual a velocidade máxima recomendada em áreas internas de armazém?',
    options: [
      '20 km/h',
      '15 km/h',
      '10 km/h',
      '5 km/h'
    ],
    correctAnswer: 2,
    explanation: 'A velocidade máxima em áreas internas geralmente é de 10 km/h, mas pode variar conforme a empresa. Respeite sempre a sinalização do local.'
  },
  {
    id: 13,
    question: 'Ao empilhar, quando o operador deve inclinar o mastro para frente?',
    options: [
      'Ao se aproximar da prateleira',
      'Quando a carga ultrapassa a altura desejada',
      'Ao retirar a carga do palete',
      'Durante todo o transporte'
    ],
    correctAnswer: 1,
    explanation: 'Ao empilhar, eleve a carga até ultrapassar a altura do nível desejado, então incline o mastro para frente e abaixe suavemente sobre a prateleira.'
  },
  {
    id: 14,
    question: 'Qual tipo de água deve ser usada nas baterias das empilhadeiras elétricas?',
    options: [
      'Água da torneira',
      'Água mineral',
      'Água destilada',
      'Qualquer tipo de água'
    ],
    correctAnswer: 2,
    explanation: 'Use APENAS água destilada nas baterias. Água da torneira ou mineral contém minerais que danificam as placas das baterias.'
  },
  {
    id: 15,
    question: 'O que significa o termo "centro de carga" em empilhadeiras?',
    options: [
      'O local onde a empilhadeira é estacionada',
      'O ponto de equilíbrio da carga sobre os garfos',
      'A central de comando do armazém',
      'O centro geométrico da empilhadeira'
    ],
    correctAnswer: 1,
    explanation: 'O centro de carga é o ponto de equilíbrio da carga sobre os garfos. Ele influencia diretamente na estabilidade e na capacidade efetiva da empilhadeira.'
  }
];
