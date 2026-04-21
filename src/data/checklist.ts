import { ChecklistItem } from '../types';

export const checklistItems: ChecklistItem[] = [
  // Sistema de freios
  { id: 'c1', category: 'Freios', item: 'Freio de estacionamento funcionando corretamente', critical: true },
  { id: 'c2', category: 'Freios', item: 'Freio de serviço com resposta adequada', critical: true },
  { id: 'c3', category: 'Freios', item: 'Nível do fluido de freio adequado', critical: true },

  // Direção
  { id: 'c4', category: 'Direção', item: 'Direção respondendo corretamente (sem folgas)', critical: true },
  { id: 'c5', category: 'Direção', item: 'Volante sem trepidações ou ruídos anormais', critical: false },

  // Pneus
  { id: 'c6', category: 'Pneus', item: 'Pneus sem desgaste excessivo, cortes ou danos', critical: true },
  { id: 'c7', category: 'Pneus', item: 'Pressão dos pneus adequada (se pneumáticos)', critical: false },
  { id: 'c8', category: 'Pneus', item: 'Sem objetos estranhos cravados nos pneus', critical: false },

  // Sistema hidráulico
  { id: 'c9', category: 'Hidráulico', item: 'Nível de óleo hidráulico adequado', critical: true },
  { id: 'c10', category: 'Hidráulico', item: 'Sem vazamentos visíveis no sistema hidráulico', critical: true },
  { id: 'c11', category: 'Hidráulico', item: 'Corrente do mastro lubrificada e sem folgas excessivas', critical: true },
  { id: 'c12', category: 'Hidráulico', item: 'Elevação e inclinação funcionando suavemente', critical: true },

  // Garfos
  { id: 'c13', category: 'Garfos', item: 'Garfos sem trincas, empenamentos ou desgaste excessivo', critical: true },
  { id: 'c14', category: 'Garfos', item: 'Trava dos garfos funcionando corretamente', critical: true },
  { id: 'c15', category: 'Garfos', item: 'Trinco do encosto de carga intacto', critical: true },

  // Elétrico e iluminação
  { id: 'c16', category: 'Elétrico/Iluminação', item: 'Faróis dianteiros funcionando', critical: false },
  { id: 'c17', category: 'Elétrico/Iluminação', item: 'Luzes traseiras e lanternas funcionando', critical: false },
  { id: 'c18', category: 'Elétrico/Iluminação', item: 'Luzes de advertência (giroflex) funcionando', critical: true },
  { id: 'c19', category: 'Elétrico/Iluminação', item: 'Buzina funcionando', critical: true },
  { id: 'c20', category: 'Elétrico/Iluminação', item: 'Alarme de ré funcionando', critical: true },
  { id: 'c21', category: 'Elétrico/Iluminação', item: 'Indicadores do painel funcionando', critical: false },

  // Motor/Bateria
  { id: 'c22', category: 'Motor/Bateria', item: 'Nível de combustível/bateria adequado', critical: true },
  { id: 'c23', category: 'Motor/Bateria', item: 'Sem ruídos anormais no motor', critical: true },
  { id: 'c24', category: 'Motor/Bateria', item: 'Sem vazamentos de óleo ou combustível', critical: true },
  { id: 'c25', category: 'Motor/Bateria', item: 'Nível de líquido de arrefecimento adequado', critical: true },

  // Segurança
  { id: 'c26', category: 'Segurança', item: 'Cinto de segurança em bom estado e funcionando', critical: true },
  { id: 'c27', category: 'Segurança', item: 'Espelhos retrovisores limpos e ajustados', critical: false },
  { id: 'c28', category: 'Segurança', item: 'Extintor de incêndio presente e dentro da validade', critical: true },
  { id: 'c29', category: 'Segurança', item: 'Estrutura de proteção (ROPS) sem danos', critical: true },

  // Geral
  { id: 'c30', category: 'Geral', item: 'Placa de capacidade visível e legível', critical: true },
  { id: 'c31', category: 'Geral', item: 'Área de operação livre de obstáculos', critical: false },
  { id: 'c32', category: 'Geral', item: 'Assento do operador em boas condições', critical: false }
];
