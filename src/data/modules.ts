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
      },
      {
        id: 'ob-4',
        title: 'Noções Técnicas: Tipos e Componentes da Empilhadeira',
        content: [
          'No conteúdo de reciclagem NR-11, as empilhadeiras são classificadas por propulsão (elétrica, combustão e GLP/GNV), equilíbrio (contrabalançada, patolada, retrátil e trilateral) e transmissão (mecânica, hidráulica, hidrostática e elétrica).',
          'Empilhadeiras elétricas têm menor emissão local e são muito usadas em ambientes internos; modelos de combustão exigem atenção extra com ventilação e emissão de gases.',
          'A empilhadeira contrabalançada é versátil para percursos mais longos e rampas moderadas, enquanto modelos retráteis e trilaterais são comuns em corredores mais estreitos.',
          'Componentes críticos incluem: chassi/contrapeso, torre de elevação, garfos, rodas, sistema hidráulico, freios, painel, buzina e sistema de direção.',
          'No motor de combustão, os sistemas de alimentação, lubrificação e arrefecimento precisam de inspeção e manutenção preventiva para evitar falhas e desgaste acelerado.',
          'Conhecer os comandos e símbolos do painel é requisito básico para prevenir uso incorreto e reação tardia a alertas de falha.'
        ],
        highlights: [
          'Entenda o tipo de empilhadeira antes de operar',
          'Conheça os componentes críticos e sua função',
          'Observe painéis/alertas antes e durante a operação'
        ],
        warnings: [
          'Operar equipamento sem domínio técnico dos comandos e limitações aumenta risco de acidente grave'
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
      },
      {
        id: 'seg-4',
        title: 'Zona de Perigo, Pedestres e Isolamento de Corredores',
        content: [
          'Zona de perigo é toda área de deslocamento da empilhadeira e de elevação de carga onde pessoas podem se ferir por queda de material, choque ou tombamento.',
          'Pessoas alheias à operação devem ser retiradas da área antes do início da tarefa, com isolamento por faixas/correntes nos dois lados do corredor quando aplicável.',
          'A buzina e os sinais sonoros devem ser usados preventivamente em cruzamentos, entradas/saídas e aproximação de pedestres.',
          'Se houver pedestre dentro da zona de risco, a operação deve ser interrompida imediatamente até a liberação da área.',
          'O operador é responsável por não obstruir hidrantes, extintores, macas, painéis elétricos, saídas de emergência e rotas de circulação.',
          'A segurança do entorno faz parte da qualidade operacional: proteger pessoas é prioridade acima de produtividade.'
        ],
        highlights: [
          'Isole o corredor antes de iniciar movimentação crítica',
          'Pare a operação ao identificar pedestres na área de risco',
          'Nunca bloqueie rotas e equipamentos de emergência'
        ],
        warnings: [
          'Operar sem isolamento em área com fluxo de pessoas cria risco iminente de acidente'
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
      },
      {
        id: 'man-4',
        title: 'Bateria Tracionária: Recarga, Água e Prevenção de Incêndio',
        content: [
          'A bateria tracionária exige controle de temperatura, limpeza e rotina de recarga conforme manual do fabricante para preservar vida útil e segurança.',
          'Para recarregar: desligue o equipamento, retire a chave, abra o compartimento, verifique danos visíveis, conecte corretamente na estação e siga o procedimento oficial.',
          'Durante manuseio, não coloque objetos sobre a bateria e confirme travas/portas laterais após montagem ou desmontagem.',
          'A inspeção de nível de água deve seguir frequência definida pela empresa/fabricante (ex.: semanal ou quinzenal), usando água deionizada quando necessário.',
          'Outras intervenções técnicas em bateria devem ser feitas por profissional habilitado; operador executa apenas inspeções e rotina autorizada.',
          'Na área de recarga: ambiente ventilado, sem fumaça/chama/faísca e com meios de combate a incêndio disponíveis.'
        ],
        highlights: [
          'Recarga e inspeção sempre com procedimento padronizado',
          'Complete nível apenas com água deionizada (quando indicado)',
          'Use EPI adequado no manuseio da bateria'
        ],
        warnings: [
          'Nunca recarregue bateria em local fechado sem ventilação ou próximo de fonte de ignição'
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
      },
      {
        id: 'mc-4',
        title: 'Retirada e Colocação de Cargas (Passo a Passo)',
        content: [
          'Na retirada da carga: aproxime alinhado, garfos na horizontal, insira completamente, eleve de forma suave, estabilize com inclinação adequada e recue com cuidado.',
          'Após retirar, mantenha a carga a aproximadamente 15-20 cm do piso para transporte, com velocidade reduzida e visão desobstruída.',
          'Na colocação: alinhe com precisão ao porta-paletes, eleve um pouco acima do nível final, avance de forma controlada e desça lentamente até acomodar a carga.',
          'Antes de sair, garanta que os garfos estão livres, recue cuidadosamente e retorne para posição de condução segura.',
          'Evite qualquer rotação com carga elevada em corredor, pois esse comportamento aumenta muito o risco de tombamento.',
          'Observe risco de carga instável, quebra de palete, vazamento hidráulico e desmoronamento da estrutura durante toda a movimentação.'
        ],
        highlights: [
          'Retire e deposite carga com movimentos suaves e controlados',
          'Transporte com carga baixa (15-20 cm)',
          'Nunca faça giro em corredor com carga elevada'
        ],
        warnings: [
          'Movimentação brusca durante retirada/colocação pode derrubar carga e tombar o equipamento'
        ]
      }
    ]
  },
  {
    id: 'normas-nr11',
    title: 'Normas Regulamentadoras (NR-11)',
    icon: '📋',
    description: 'Conteúdo de reciclagem NR-11 com foco em formação de operador, responsabilidades legais e operação segura.',
    color: 'from-purple-500 to-purple-600',
    lessons: [
      {
        id: 'nr-1',
        title: 'Projeto de Formação e Reciclagem do Operador',
        content: [
          'A formação de operador de empilhadeira é estruturada para habilitar, certificar e reciclar profissionais com foco em segurança e produtividade.',
          'No material de reciclagem, o curso está organizado em módulo teórico (8 horas) e módulo prático (8 horas), com certificação condicionada ao desempenho.',
          'Para participar da formação, o operador deve ser aprovado em avaliações prévias como psicossocial, exames complementares e exame clínico ocupacional.',
          'A nota mínima para certificação é 7,0 em cada etapa avaliativa, reforçando o critério de aptidão técnica e comportamental.',
          'Após convocação para vaga, há estágio supervisionado obrigatório com avaliação formal de aptidão antes da atuação autônoma.',
          'A reciclagem periódica mantém o operador atualizado em procedimentos técnicos e de segurança, reduzindo risco operacional.'
        ],
        highlights: [
          'Formação combinando teoria + prática',
          'Nota mínima 7,0 para certificação',
          'Estágio supervisionado é obrigatório',
          'Reciclagem periódica mantém habilitação segura'
        ],
        warnings: [
          'Sem formação e reciclagem adequadas, o risco de acidentes e responsabilizações aumenta significativamente'
        ]
      },
      {
        id: 'nr-2',
        title: 'Responsabilidades Legais do Operador e da Empresa',
        content: [
          'Acidentes com empilhadeira geralmente envolvem falhas de treinamento, falta de experiência, descumprimento de normas e ausência de manutenção.',
          'O operador e o empregador podem responder civil, penal e trabalhistamente em casos de negligência, imprudência ou imperícia.',
          'No âmbito civil, causar dano por ação ou omissão gera dever de reparação, inclusive com responsabilidade do empregador por atos dos empregados.',
          'No âmbito penal, expor pessoas a risco grave ou provocar acidente por inobservância técnica pode gerar detenção ou reclusão.',
          'No âmbito trabalhista, podem ocorrer advertência, suspensão e demissão por justa causa ao empregado, além de multa/embargo/interdição à empresa.',
          'A cultura de segurança exige disciplina operacional diária, respeito às normas e comunicação imediata de desvios.'
        ],
        highlights: [
          'Quem cria o risco responde legalmente por seus atos',
          'Empresa e operador compartilham responsabilidades',
          'Segurança operacional também é obrigação jurídica'
        ],
        warnings: [
          'Operar sem treinamento, sem manutenção e sem seguir procedimento pode gerar acidente grave e responsabilização civil/criminal'
        ]
      },
      {
        id: 'nr-3',
        title: 'Requisitos da NR-11 e Obrigações Operacionais',
        content: [
          'A NR-11 determina que operadores de equipamentos motorizados recebam treinamento específico fornecido pela empresa para habilitação na função.',
          'O operador deve portar identificação visível durante a jornada e manter revalidação periódica conforme exigência médica ocupacional.',
          'Somente pessoas autorizadas e capacitadas podem operar a empilhadeira; é proibido permitir uso por terceiros não habilitados.',
          'É proibido transportar ou elevar pessoas com empilhadeira, salvo equipamentos especificamente projetados e autorizados para essa finalidade.',
          'Defeitos técnicos, danos e condições inseguras devem ser comunicados imediatamente; equipamento sem condição segura deve ser interditado.',
          'Na rotina operacional, devem ser observados limite de carga, estabilidade, inspeção pré-uso, sinalização e regras de circulação interna.'
        ],
        highlights: [
          'Treinamento específico é obrigatório para operar',
          'Identificação e aptidão médica devem estar válidas',
          'Equipamento inseguro deve ser retirado de operação',
          'É proibido transportar pessoas na empilhadeira'
        ],
        warnings: [
          'Ignorar requisito da NR-11 compromete a segurança e pode invalidar a habilitação operacional'
        ]
      },
      {
        id: 'nr-4',
        title: 'NR-11 na Prática: Inspeção, Armazenagem e Ambiente',
        content: [
          'A NR-11 reforça que equipamentos de transporte motorizado devem ter buzina funcional e inspeção permanente, com troca imediata de peças defeituosas.',
          'Em locais fechados sem ventilação adequada, a operação com motor de combustão interna é proibida sem sistema neutralizador apropriado.',
          'Na armazenagem, a carga não pode exceder a capacidade do piso e não deve obstruir portas, saídas de emergência ou equipamentos contra incêndio.',
          'Materiais empilhados devem manter afastamento das estruturas laterais, conforme referência normativa de segurança do local.',
          'A capacidade máxima de trabalho do equipamento deve estar visível, e as condições de uso devem ser verificadas antes de cada turno.',
          'Conformidade normativa não é apenas documentação: ela orienta conduta operacional e previne acidentes graves.'
        ],
        highlights: [
          'Buzina, inspeção e manutenção são exigências normativas',
          'Armazenagem deve respeitar capacidade do piso e rotas de emergência',
          'Em ambiente fechado, controle de emissões é obrigatório'
        ],
        warnings: [
          'Descumprir requisitos de armazenagem e ventilação pode gerar acidente, autuação e interdição'
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
      },
      {
        id: 'dd-4',
        title: 'Aclives, Declives e Condição do Piso',
        content: [
          'Em rampas, a carga deve ser transportada no sentido ascendente, mantendo controle total de velocidade e aderência.',
          'Não é permitido iniciar manobra em diagonal, mudar direção em aclive/declive ou estacionar o equipamento em inclinação.',
          'Quando necessário em emergência, use calços para impedir deslocamento involuntário do equipamento.',
          'Não execute coleta ou descarga de materiais com a máquina posicionada em subida ou descida.',
          'A qualidade do piso impacta diretamente a estabilidade: superfícies irregulares, oleosas ou com resíduos aumentam risco de derrapagem e capotamento.',
          'Operação defensiva em rampa exige velocidade reduzida, planejamento de rota e observação contínua do entorno.'
        ],
        highlights: [
          'Carga sempre no sentido ascendente em rampas',
          'Sem mudança de direção em aclive/declive',
          'Piso ruim exige redução de velocidade e atenção redobrada'
        ],
        warnings: [
          'Rampa com carga elevada ou manobra indevida é cenário clássico de tombamento'
        ]
      }
    ]
  }
];
