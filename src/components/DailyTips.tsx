import { useState } from 'react';
import { dailyTips } from '../data/tips';

type CategoryFilter = 'todas' | 'seguranca' | 'operacao' | 'manutencao' | 'ergonomia';

const categoryEmojis: Record<string, string> = {
  seguranca: '🛡️',
  operacao: '⚙️',
  manutencao: '🔧',
  ergonomia: '🪑',
};

const categoryLabels: Record<string, string> = {
  todas: 'Todas',
  seguranca: 'Segurança',
  operacao: 'Operação',
  manutencao: 'Manutenção',
  ergonomia: 'Ergonomia',
};

const categoryColors: Record<string, string> = {
  seguranca: 'bg-red-100 text-red-700 border-red-200',
  operacao: 'bg-blue-100 text-blue-700 border-blue-200',
  manutencao: 'bg-amber-100 text-amber-700 border-amber-200',
  ergonomia: 'bg-green-100 text-green-700 border-green-200',
};

export default function DailyTips() {
  const [filter, setFilter] = useState<CategoryFilter>('todas');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredTips =
    filter === 'todas'
      ? dailyTips
      : dailyTips.filter((tip) => tip.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          💡 Dicas Diárias
        </h1>
        <p className="text-gray-500">
          Dicas práticas para melhorar sua operação e manter a segurança no dia a dia.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(categoryLabels) as CategoryFilter[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {categoryEmojis[cat] || '📋'} {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Tips */}
      <div className="space-y-3">
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedId(expandedId === tip.id ? null : tip.id)
              }
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-3xl shrink-0">{tip.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[tip.category]}`}
                  >
                    {categoryEmojis[tip.category]} {categoryLabels[tip.category]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{tip.title}</h3>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                  expandedId === tip.id ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedId === tip.id && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-600 leading-relaxed">{tip.content}</p>
              </div>
            )}
          </div>
        ))}

        {filteredTips.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <span className="text-5xl block mb-3">📭</span>
            <p className="text-lg font-medium">Nenhuma dica nesta categoria</p>
          </div>
        )}
      </div>
    </div>
  );
}
