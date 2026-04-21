import { TrainingModule } from '../types';

export const trainingModules: TrainingModule[] = [
  {
    id: 'operacao-basica',
    title: 'Operação Básica',
    icon: '🏗️',
    description: 'Fundamentos da operação de empilhadeira, controles e movimentos essenciais.',
    color: 'from-blue-500 to-blue-600',
    lessons: [
      {
        id: 'ob-1',
        title: 'Conhecendo a Empilhadeira',
        content: [
          'A empilhadeira é um equipamento essencial em armazéns e centros de distribuição, projetada para elevar, transportar e empilhar cargas.',
          'Os principais tipos incluem: empilhadeira elétrica, empilhadeira a gás (GLP), empilhadeira a diesel e empilhadeira patolada.',
          'Cada tipo possui características específicas de operação e manutenção que devem ser conhecidas pelo operador.',
          'A capacidade de carga varia conforme o modelo — nunca exceda o limite indicado na placa de identificação do equipamento.',
          'O centro de carga é o ponto de equilíbrio da carga e influencia diretamente na estabilidade da empilhadeira.'
        ],
        highlights: [
          'Sempre verifique a placa de capacidade antes de operar',
          'Conheça o tipo de empilhadeira que irá operar',
          'Respeite o limite de carga especificado pelo fabricante'
        ],
        warnings: [
          'Nunca opere uma empilhadeira sem ter recebido treinamento adequado e certificação'
        ]
      },
      {
        id: 'ob-2',
        title: 'Controles e Instrumentos',
        content: [
          'O painel de instrumentos indica informações vitais: nível de combustível/bateria, temperatura, horímetro e alertas de falhas.',
          'Os principais comandos incluem: volante/direção, pedais (acelerador, freio, embreagem), alavanca de câmbio e alavancas hidráulicas.',
          'As alavancas hidráulicas controlam: elevação da lança, inclinação do mastro, deslocamento lateral (quando equipado) e garfos auxiliares.',
          'Os espelhos retrovisores e luzes de advertência devem estar sempre funcionando corretamente.',
          'Antes de dar partida, verifique se o freio de estacionamento está acionado e a alavanca de câmbio em ponto morto.'
        ],
        highlights: [
          'Familiarize-se com todos os controles antes de iniciar a operação',
          'Verifique todos os instrumentos do painel diariamente',
          'Mantenha os espelhos retrovisores limpos e ajustados'
        ]
      },
      {
        id: 'ob-3',
        title: 'Movimentos Fundamentais',
        content: [
          'Antes de movimentar a empilhadeira, eleve os garfos a 15-20 cm do chão — nunca transporte com os garfos elevados.',
          'Incline o mastro levemente para trás ao transportar cargas para maior estabilidade.',
          'Mantenha velocidade reduzida, especialmente em curvas, pisos irregulares ou áreas com pedestres.',
          'Ao fazer curvas, reduza a velocidade antes de entrar na curva — nunca freie bruscamente durante a curva.',
          'Mantenha distância segura de pelo menos 3 metros de distância de outros veículos e pedestres.',
          'Em rampas, sempre transporte a carga voltada para cima: suba com a carga à frente e desça com a carga voltada para a rampa.'
        ],
        highlights: [
          'Garfos a 15-20 cm do chão durante o transporte',
          'Mastro inclinado para trás ao transportar cargas',
          'Carga sempre voltada para cima em rampas',
          'Distância mínima de 3 metros de outros veículos'
        ],
        warnings: [
          'Nunca desça uma rampa com a carga à frente — risco de tombamento!',
          'Nunca transporte cargas com os garfos elevados'
        ]
      }
    ]
  },
  {
    id: 'seguranca',
    title: 'Segurança Operacional',
    icon: '🛡️',
    description: 'Protocolos de segurança, EPIs, procedimentos de emergência e prevenção de acidentes.',
    color: 'from-red-500 to-red-600',
    lessons: [
      {
        id: 'seg-1',
        title: 'EPIs e Equipamentos de Proteção',
        content: [
          'Os EPIs obrigatórios para operação de empilhadeira incluem: capacete de segurança, calçado de segurança com biqueira de aço, colete refletivo e luvas de proteção.',
          'O cinto de segurança é obrigatório e pode ser a diferença entre a vida e a morte em caso de tombamento.',
          'Protetores auriculares são necessários em ambientes com nível de ruído elevado.',
          'Óculos de proteção devem ser usados ao manusear produtos que possam gerar respingos ou partículas.',
          'Todos os EPIs devem estar em bom estado de conservação e serem substituídos quando danificados.',
          'A empresa deve fornecer os EPIs gratuitamente e fiscalizar o uso correto.'
        ],
        highlights: [
          'Capacete, calçado de segurança, colete refletivo e luvas são obrigatórios',
          'O cinto de segurança é NÃO NEGOCIÁVEL — use sempre!',
          'Verifique o estado dos EPIs antes de cada turno'
        ],
        warnings: [
          'Nunca opere a empilhadeira sem cinto de segurança',
          'EPIs danificados devem ser imediatamente substituídos'
        ]
      },
      {
        id: 'seg-2',
        title: 'Prevenção de Acidentes',
        content: [
          'Antes de iniciar a operação, faça uma inspeção visual da área: identifique obstáculos, pisos irregulares, áreas molhadas e pedestres.',
          'Sinalize áreas de carga e descarga com cones, fitas ou barreiras físicas.',
          'Use a buzina ao passar por cruzamentos, saídas de corredores e áreas com visibilidade reduzida.',
          'Mantenha sempre contato visual com pedestres na área de operação.',
          'Nunca permita pessoas debaixo dos garfos elevados — essa é uma das principais causas de acidentes fatais.',
          'Em caso de tombamento, NUNTA tente pular para fora. Fique dentro da cabine, segure firme o volante e incline-se para o lado oposto do tombamento.'
        ],
        highlights: [
          'Use a buzina em cruzamentos e áreas de visibilidade reduzida',
          'NUNCA permita pessoas debaixo dos garfos elevados',
          'Faça contato visual com pedestres na área de operação'
        ],
        warnings: [
          'Em caso de tombamento: NÃO pule! Fique na cabine, segure o volante e incline-se para o lado oposto',
          'Nunca transporte pessoas nos garfos ou na empilhadeira'
        ]
      },
      {
        id: 'seg-3',
        title: 'Procedimentos de Emergência',
        content: [
          'Em caso de acidente, desligue imediatamente a empilhadeira, acione o freio de estacionamento e isole a área.',
          'Preste os primeiros socorros se capacitado e acione imediatamente a equipe de segurança do trabalho e o SAMU (192).',
          'Em caso de incêndio, use o extintor adequado (geralmente PQS ou CO₂) e acione o alarme de incêndio.',
          'Em caso de vazamento de produtos perigosos, siga a Ficha de Informações de Segurança de Produtos Químicos (FISPQ).',
          'Conheça a localização de todos os extintores, saídas de emergência e pontos de encontro da sua área.',
          'Participe de todos os simulados de emergência e conheça os procedimentos da sua empresa.'
        ],
        highlights: [
          'Conheça os números de emergência: SAMU (192), Bombeiros (193)',
          'Saiba a localização dos extintores e saídas de emergência',
          'Em emergências com produtos químicos, consulte a FISPQ'
        ]
      }
    ]
  },
  {
    id: 'manutencao',
    title: 'Manutenção Preventiva',
    icon: '🔧',
    description: 'Inspeções diárias, cuidados com bateria/combustível e manutenção preventiva do equipamento.',
    color: 'from-amber-500 to-amber-600',
    lessons: [
      {
        id: 'man-1',
        title: 'Inspeção Diária Pré-Operacional',
        content: [
          'A inspeção pré-operacional é obrigatória e deve ser realizada ANTES de cada turno de trabalho.',
          'Verifique os pneus: desgaste, cortes, pressão (pneumáticos) e presença de objetos estranhos.',
          'Confira o nível de óleo hidráulico, óleo do motor (se aplicável), líquido de arrefecimento e fluido de freio.',
          'Teste todos os sistemas: freios, direção, buzina, luzes, alarme de ré, indicadores do painel e cintos de segurança.',
          'Inspecione os garfos: trincas, empenamentos, desgaste excessivo e travamento adequado.',
          'Verifique se há vazamentos de óleo, combustível ou fluido hidráulico sob a empilhadeira.',
          'Registre todas as inspeções no checklist diário e comunique qualquer anomalia ao supervisor.'
        ],
        highlights: [
          'Inspeção pré-operacional é OBRIGATÓRIA antes de cada turno',
          'Verifique pneus, fluidos, freios, luzes e garfos',
          'Registre tudo no checklist e comunique anomalias'
        ],
        warnings: [
          'NÃO opere a empilhadeira se identificar falhas graves — reporte imediatamente'
        ]
      },
      {
        id: 'man-2',
        title: 'Cuidados com Bateria e Combustível',
        content: [
          'Empilhadeiras elétricas: verifique o nível da água das baterias semanalmente e mantenha os terminais limpos e protegidos.',
          'A recarga deve ser feita em área ventilada, afastada de fontes de ignição e com equipamentos de proteção individual.',
          'Nunca desconecte a bateria com a empilhadeira ligada — isso pode danificar o sistema elétrico.',
          'Empilhadeiras a GLP: verifique o nível do botijão, conexões e mangueiras regularmente.',
          'Troque o botijão de GLP em área aberta e ventilada, longe de fontes de calor ou faíscas.',
          'Empilhadeiras a diesel: mantenha o tanque abastecido, use apenas combustível de qualidade e drene o separador de água regularmente.'
        ],
        highlights: [
          'Recarga de baterias apenas em áreas ventiladas',
          'Verifique o nível de água das baterias semanalmente',
          'Troca de botijão GLP apenas em áreas abertas e ventiladas'
        ],
        warnings: [
          'Nunca fume próximo à área de recarga ou abastecimento',
          'Nunca desconecte a bateria com o equipamento ligado'
        ]
      },
      {
        id: 'man-3',
        title: 'Manutenção Programada',
        content: [
          'Siga rigorosamente o plano de manutenção preventiva do fabricante, respeitando os intervalos de horas trabalhadas.',
          'A lubrificação dos pontos de graxa deve ser feita conforme especificação do fabricante.',
          'A substituição de filtros (óleo, ar, combustível, hidráulico) deve seguir o cronograma estabelecido.',
          'Mantenha um histórico de manutenções para acompanhamento e rastreabilidade.',
          'Qualquer alteração no comportamento do equipamento (ruídos, vibrações, perda de potência) deve ser comunicada imediatamente.',
          'Somente pessoal qualificado e autorizado pode realizar manutenções corretivas no equipamento.'
        ],
        highlights: [
          'Siga o plano de manutenção do fabricante',
          'Mantenha histórico de todas as manutenções',
          'Comunique qualquer alteração no comportamento do equipamento'
        ]
      }
    ]
  },
  {
    id: 'manuseio-cargas',
    title: 'Manuseio de Cargas',
    icon: '📦',
    description: 'Técnicas de empilhamento, estabilidade de cargas, paletes e cargas especiais.',
    color: 'from-green-500 to-green-600',
    lessons: [
      {
        id: 'mc-1',
        title: 'Estabilidade e Centro de Gravidade',
        content: [
          'O triângulo de estabilidade é formado pelos dois pontos das rodas dianteiras e o ponto central do eixo traseiro.',
          'O centro de carga combinado (equipamento + carga) deve permanecer dentro do triângulo de estabilidade.',
          'Quanto mais alta a carga, menor a estabilidade — reduza a velocidade e evite movimentos bruscos.',
          'O peso da carga nunca deve exceder a capacidade nominal indicada na placa da empilhadeira.',
          'A distância do centro de carga afeta a capacidade: quanto mais distante, menor a capacidade efetiva.',
          'Cargas longas, largas ou irregulares exigem cuidados especiais e podem requerer acessórios adequados.'
        ],
        highlights: [
          'Entenda o triângulo de estabilidade da empilhadeira',
          'Carga mais alta = menos estabilidade',
          'Nunca exceda a capacidade nominal do equipamento'
        ],
        warnings: [
          'Atenção: a capacidade diminui quando o centro de carga está mais afastado dos garfos'
        ]
      },
      {
        id: 'mc-2',
        title: 'Técnicas de Empilhamento',
        content: [
          'Aproxime-se do palete de frente, centralizado e em velocidade reduzida.',
          'Ajuste a abertura dos garfos para se adequar ao palete — os garfos devem ficar o mais afastados possível entre si.',
          'Insira os garfos completamente no palete antes de elevar a carga.',
          'Eleve a carga suavemente, verificando se está estável e equilibrada.',
          'Ao empilhar, aproxime-se lentamente, eleve até ultrapassar a altura do nível desejado, incline o mastro para frente e abaixe suavemente.',
          'Verifique se a prateleira ou estrutura suporta o peso da carga antes de depositá-la.',
          'Ao retirar cargas de prateleiras altas, eleve os garfos primeiro, depois recue lentamente.'
        ],
        highlights: [
          'Centralize os garfos no palete antes de elevar',
          'Insira os garfos COMPLETAMENTE no palete',
          'Verifique a capacidade da prateleira antes de empilhar',
          'Movimentos suaves e controlados em todas as operações'
        ]
      },
      {
        id: 'mc-3',
        title: 'Cargas Especiais e Irregulares',
        content: [
          'Bobinas de papel/aço: utilize acessório apropriado (grampos para bobinas) e nunca transporte sem o acessório adequado.',
          'Tambores e cilindros: use o acessório específico e transporte na posição vertical com inclinação para trás.',
          'Cargas longas (tubos, barras): utilize extensão de garfos e transporte com a carga voltada para trás em rampas.',
          'Cargas frágeis: reduza a velocidade, evite frenagens bruscas e use amortecedores quando necessário.',
          'Cargas perigosas (produtos químicos): siga as normas de manuseio e transporte de produtos perigosos.',
          'Para qualquer carga fora do padrão, consulte o supervisor antes de operar.'
        ],
        highlights: [
          'Use sempre o acessório adequado para cada tipo de carga',
          'Cargas longas exigem extensões de garfos',
          'Consulte o supervisor para cargas fora do padrão'
        ],
        warnings: [
          'Nunca improvise acessórios ou adaptações nos garfos'
        ]
      }
    ]
  },
  {
    id: 'normas-nr11',
    title: 'Normas Regulamentadoras (NR-11)',
    icon: '📋',
    description: 'Legislação, NR-11, direitos e deveres do operador e responsabilidades legais.',
    color: 'from-purple-500 to-purple-600',
    lessons: [
      {
        id: 'nr-1',
        title: 'NR-11 — Transporte, Movimentação, Armazenagem e Manuseio de Materiais',
        content: [
          'A NR-11 estabelece os requisitos de segurança para operações de movimentação de materiais em estabelecimentos industriais.',
          'Os equipamentos de transporte mecanizado devem ser operados por trabalhadores qualificados e treinados.',
          'A capacidade dos equipamentos não pode ser excedida e devem possuir indicação visível do peso máximo.',
          'Os pisos dos locais de trabalho devem ser resistentes, regulares e antiderrapantes.',
          'Os corredores de circulação devem ter largura mínima adequada e serem sinalizados.',
          'Empilhadeiras devem possuir proteção contra queda de objetos (guarda-corpo) quando houver risco.'
        ],
        highlights: [
          'Apenas operadores qualificados podem operar empilhadeiras',
          'A capacidade máxima deve estar visível no equipamento',
          'Corredores devem ser sinalizados e ter largura adequada'
        ]
      },
      {
        id: 'nr-2',
        title: 'Direitos e Deveres do Operador',
        content: [
          'DIREITO: receber treinamento adequado e gratuito antes de operar o equipamento.',
          'DIREITO: recusar-se a operar em condições inseguras sem sofrer retaliação.',
          'DIREITO: receber EPIs adequados e em bom estado de conservação.',
          'DEVER: realizar a inspeção pré-operacional antes de cada turno.',
          'DEVER: utilizar todos os EPIs fornecidos corretamente.',
          'DEVER: comunicar imediatamente qualquer defeito ou condição insegura ao supervisor.',
          'DEVER: respeitar as normas de segurança e sinalização do local.',
          'DEVER: portar o certificado de qualificação de operador durante a operação.'
        ],
        highlights: [
          'Você tem o direito de recusar operação em condições inseguras',
          'Porte sempre seu certificado de qualificação',
          'Comunique imediatamente qualquer condição insegura'
        ],
        warnings: [
          'Operar sem qualificação é infração grave para o empregador e para o operador'
        ]
      },
      {
        id: 'nr-3',
        title: 'Sinalização e Áreas de Operação',
        content: [
          'Áreas de circulação de empilhadeiras devem ser sinalizadas com faixas no piso e placas indicativas.',
          'Pedestres devem utilizar faixas de travessia demarcadas e passarelas quando disponíveis.',
          'Espelhos convexos devem ser instalados em cruzamentos e pontos cegos dos corredores.',
          'A velocidade máxima em áreas internas geralmente é de 10 km/h — respeite os limites do local.',
          'Áreas de carga e descarga devem ser exclusivas e sinalizadas.',
          'Proibida a circulação de empilhadeiras em áreas não autorizadas ou sem piso adequado.'
        ],
        highlights: [
          'Respeite a sinalização do local — faixas, placas e espelhos',
          'Velocidade máxima interna: geralmente 10 km/h',
          'Áreas de carga/descarga são exclusivas para equipamentos'
        ]
      }
    ]
  },
  {
    id: 'direcao-defensiva',
    title: 'Direção Defensiva',
    icon: '🚗',
    description: 'Técnicas de direção defensiva aplicadas à operação de empilhadeiras.',
    color: 'from-teal-500 to-teal-600',
    lessons: [
      {
        id: 'dd-1',
        title: 'Princípios da Direção Defensiva',
        content: [
          'Direção defensiva na empilhadeira significa antecipar situações de risco e agir preventivamente.',
          'Mantenha sempre atenção total — o uso de celular durante a operação é PROIBIDO.',
          'Observe constantemente o ambiente: pedestres, outros equipamentos, obstáculos e condições do piso.',
          'Nunca opere sob influência de álcool, drogas ou medicamentos que causem sonolência.',
          'Descanse adequadamente entre os turnos — a fadiga é uma das principais causas de acidentes.',
          'Ajuste os espelhos retrovisores antes de iniciar a operação e verifique-os constantemente.'
        ],
        highlights: [
          'Celular durante a operação é PROIBIDO',
          'Nunca opere sob influência de álcool ou drogas',
          'Mantenha atenção total ao ambiente o tempo todo'
        ],
        warnings: [
          'A fadiga compromete seus reflexos — descanse adequadamente'
        ]
      },
      {
        id: 'dd-2',
        title: 'Condições Adversas',
        content: [
          'Piso molhado: reduza a velocidade em pelo menos 50%, evite frenagens bruscas e aumente a distância de segurança.',
          'Piso irregular: reduza a velocidade e evite transportar cargas elevadas em superfícies desniveladas.',
          'Visibilidade reduzida (poeira, fumaça, pouca luz): use faróis, buzine com frequência e reduza a velocidade.',
          'Áreas congestionadas: opere em velocidade mínima, use sinais sonoros e mantenha distância segura.',
          'Operação noturna: verifique o funcionamento de todos os faróis e luzes de advertência.',
          'Em áreas externas com chuva, redobre a atenção e evite operações desnecessárias.'
        ],
        highlights: [
          'Piso molhado: reduza a velocidade em 50%',
          'Visibilidade reduzida: use faróis e buzine com frequência',
          'Verifique faróis e luzes antes de operar no período noturno'
        ]
      },
      {
        id: 'dd-3',
        title: 'Marcha à Ré e Manobras',
        content: [
          'Sempre olhe na direção em que está se movimentando — ao dar ré, vire o corpo e olhe diretamente para trás.',
          'Antes de dar ré, verifique se não há obstáculos, pedestres ou outros equipamentos atrás de você.',
          'Use o alarme de ré (se equipado) e buzine antes de iniciar a marcha à ré.',
          'Evite dar ré em rampas — se necessário, desça a carga e manobre com segurança.',
          'Em corredores estreitos, desça os garfos ao nível de transporte e proceda com extrema cautela.',
          'Sempre que possível, prefira manobras de frente — a marcha à ré deve ser evitada quando possível.'
        ],
        highlights: [
          'Ao dar ré, OLHE diretamente para trás',
          'Verifique a área antes de dar ré',
          'Prefira manobras de frente sempre que possível',
          'Use o alarme de ré e buzine antes de manobrar'
        ],
        warnings: [
          'Evite dar ré em rampas — risco de tombamento'
        ]
      }
    ]
  }
];
