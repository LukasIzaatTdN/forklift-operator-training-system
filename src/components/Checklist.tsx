import { useState, useEffect } from 'react';
import { checklistItems } from '../data/checklist';
import { useTrainingProgress } from '../context/TrainingProgressContext';

interface CheckState {
  [key: string]: 'ok' | 'nok' | null;
}

export default function Checklist() {
  const { markChecklistCompleted } = useTrainingProgress();
  const [checks, setChecks] = useState<CheckState>({});
  const [operatorName, setOperatorName] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('empilhapro-checklist');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Only restore if it's from today
      const today = new Date().toDateString();
      if (parsed.date === today) {
        setChecks(parsed.checks || {});
        setOperatorName(parsed.operatorName || '');
        setCompleted(parsed.completed || false);
      }
    }
  }, []);

  const saveChecklist = (newChecks: CheckState, newName: string, newCompleted: boolean) => {
    const data = {
      date: new Date().toDateString(),
      checks: newChecks,
      operatorName: newName,
      completed: newCompleted,
    };
    localStorage.setItem('empilhapro-checklist', JSON.stringify(data));
  };

  const handleCheck = (id: string, status: 'ok' | 'nok') => {
    const newChecks = { ...checks, [id]: status };
    setChecks(newChecks);

    const allChecked = checklistItems.every((item) => newChecks[item.id] !== null);
    if (allChecked) {
      setCompleted(true);
      saveChecklist(newChecks, operatorName, true);
      if (!completed) {
        markChecklistCompleted();
      }
    }
  };

  const resetChecklist = () => {
    setChecks({});
    setOperatorName('');
    setCompleted(false);
    localStorage.removeItem('empilhapro-checklist');
  };

  const totalItems = checklistItems.length;
  const checkedItems = Object.values(checks).filter((v) => v !== null).length;
  const okItems = Object.values(checks).filter((v) => v === 'ok').length;
  const nokItems = Object.values(checks).filter((v) => v === 'nok').length;
  const criticalNoks = checklistItems.filter(
    (item) => item.critical && checks[item.id] === 'nok'
  );

  const progress = Math.round((checkedItems / totalItems) * 100);

  // Group items by category
  const categories = [...new Set(checklistItems.map((item) => item.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          ✅ Checklist Pré-Operacional
        </h1>
        <p className="text-gray-500">
          Inspeção obrigatória antes de cada turno de trabalho. Preencha todos os itens.
        </p>
      </div>

      {/* Operator Info */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Nome do Operador
            </label>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => {
                setOperatorName(e.target.value);
                saveChecklist(checks, e.target.value, completed);
              }}
              placeholder="Digite seu nome..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              📅 {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progresso: {checkedItems}/{totalItems} itens
          </span>
          <span className="text-sm font-bold text-amber-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-amber-400 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> OK: {okItems}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> NOK: {nokItems}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span> Pendentes:{' '}
            {totalItems - checkedItems}
          </span>
        </div>

        {criticalNoks.length > 0 && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-bold text-red-700">🚨 Itens Críticos com Problema:</p>
            <ul className="text-xs text-red-600 mt-1 space-y-0.5">
              {criticalNoks.map((item) => (
                <li key={item.id}>• {item.item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Status Buttons */}
      {completed && (
        <div
          className={`rounded-xl p-5 text-center shadow-sm ${
            nokItems > 0
              ? 'bg-red-50 border border-red-200'
              : 'bg-green-50 border border-green-200'
          }`}
        >
          {nokItems > 0 ? (
            <div>
              <span className="text-4xl block mb-2">🚫</span>
              <h3 className="text-lg font-bold text-red-800 mb-1">
                Equipamento NÃO APTO para operação
              </h3>
              <p className="text-sm text-red-600">
                Existem {nokItems} item(ns) com problema. Comunique ao supervisor antes de operar.
                {criticalNoks.length > 0 && (
                  <span className="font-bold">
                    {' '}
                    Há {criticalNoks.length} problema(s) crítico(s)!
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div>
              <span className="text-4xl block mb-2">✅</span>
              <h3 className="text-lg font-bold text-green-800 mb-1">
                Equipamento APTO para operação
              </h3>
              <p className="text-sm text-green-600">
                Todos os itens foram verificados e estão em conformidade. Boa operação!
              </p>
            </div>
          )}
          <button
            onClick={resetChecklist}
            className="mt-3 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            🔄 Novo Checklist
          </button>
        </div>
      )}

      {/* Checklist Items by Category */}
      <div className="space-y-6">
        {categories.map((category) => {
          const items = checklistItems.filter((item) => item.category === category);
          return (
            <div key={category}>
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                {category}
              </h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl border transition-all ${
                      checks[item.id] === 'ok'
                        ? 'border-green-200 bg-green-50/50'
                        : checks[item.id] === 'nok'
                          ? 'border-red-200 bg-red-50/50'
                          : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 p-3 md:p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {item.critical && (
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                              CRÍTICO
                            </span>
                          )}
                          <p
                            className={`text-sm ${
                              checks[item.id] === null
                                ? 'text-gray-700'
                                : checks[item.id] === 'ok'
                                  ? 'text-green-800'
                                  : 'text-red-800'
                            }`}
                          >
                            {item.item}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleCheck(item.id, 'ok')}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                            checks[item.id] === 'ok'
                              ? 'bg-green-500 text-white shadow-md shadow-green-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                          }`}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleCheck(item.id, 'nok')}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                            checks[item.id] === 'nok'
                              ? 'bg-red-500 text-white shadow-md shadow-red-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                          }`}
                        >
                          ✗
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-bold mb-1">📌 Importante:</p>
        <p>
          Este checklist é obrigatório e deve ser realizado antes de cada turno. Em caso de itens
          marcados como NÃO conforme (✗), especialmente os itens críticos, NÃO opere o equipamento
          e comunique imediatamente ao supervisor.
        </p>
      </div>
    </div>
  );
}
