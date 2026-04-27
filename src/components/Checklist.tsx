import { useEffect, useMemo, useRef, useState } from 'react';
import { checklistItems } from '../data/checklist';
import { useTrainingProgress } from '../context/TrainingProgressContext';

type CheckStatus = 'ok' | 'nok' | 'na' | null;
type ChecklistFilter = 'todos' | 'pendentes' | 'nok' | 'criticos';
type Shift = 'A' | 'B' | 'C' | '';
type CheckState = Record<string, CheckStatus>;
type NotesState = Record<string, string>;

interface SavedChecklist {
  date: string;
  checks: CheckState;
  notes: NotesState;
  operatorName: string;
  equipmentId: string;
  shift: Shift;
  completed: boolean;
}

const STORAGE_KEY = 'empilhapro_checklist_preoperacional_v2';
const STATUS_LABEL: Record<Exclude<CheckStatus, null>, string> = {
  ok: 'Conforme',
  nok: 'Não Conforme',
  na: 'N/A',
};

export default function Checklist() {
  const { markChecklistCompleted } = useTrainingProgress();
  const [checks, setChecks] = useState<CheckState>({});
  const [notes, setNotes] = useState<NotesState>({});
  const [operatorName, setOperatorName] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [shift, setShift] = useState<Shift>('');
  const [filter, setFilter] = useState<ChecklistFilter>('todos');
  const [completed, setCompleted] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      hydrated.current = true;
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Partial<SavedChecklist>;
      const today = new Date().toDateString();
      if (parsed.date !== today) {
        hydrated.current = true;
        return;
      }

      setChecks(parsed.checks || {});
      setNotes(parsed.notes || {});
      setOperatorName(parsed.operatorName || '');
      setEquipmentId(parsed.equipmentId || '');
      setShift((parsed.shift || '') as Shift);
      setCompleted(Boolean(parsed.completed));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      hydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const data: SavedChecklist = {
      date: new Date().toDateString(),
      checks,
      notes,
      operatorName,
      equipmentId,
      shift,
      completed,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [checks, notes, operatorName, equipmentId, shift, completed]);

  const handleCheck = (id: string, status: Exclude<CheckStatus, null>) => {
    const newChecks = { ...checks, [id]: status };
    setChecks(newChecks);

    const allChecked = checklistItems.every((item) => Boolean(newChecks[item.id]));
    if (allChecked && !completed) {
      setCompleted(true);
      markChecklistCompleted();
      return;
    }

    if (!allChecked) setCompleted(false);
  };

  const handleNote = (id: string, value: string) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const resetChecklist = () => {
    setChecks({});
    setNotes({});
    setOperatorName('');
    setEquipmentId('');
    setShift('');
    setFilter('todos');
    setCompleted(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const totalItems = checklistItems.length;
  const checkedItems = Object.values(checks).filter(Boolean).length;
  const okItems = Object.values(checks).filter((v) => v === 'ok').length;
  const nokItems = Object.values(checks).filter((v) => v === 'nok').length;
  const naItems = Object.values(checks).filter((v) => v === 'na').length;
  const criticalNoks = checklistItems.filter(
    (item) => item.critical && checks[item.id] === 'nok'
  );
  const allChecked = checkedItems === totalItems;
  const inspectionReady = operatorName.trim().length > 2 && equipmentId.trim().length > 1;
  const canConclude = allChecked && inspectionReady;
  const operationalStatus: 'apto' | 'nao-apto' | 'pendente' = !canConclude
    ? 'pendente'
    : nokItems > 0
      ? 'nao-apto'
      : 'apto';

  const progress = Math.round((checkedItems / totalItems) * 100);

  const categories = useMemo(
    () => [...new Set(checklistItems.map((item) => item.category))],
    []
  );

  const filteredItems = useMemo(() => {
    if (filter === 'todos') return checklistItems;
    if (filter === 'pendentes') return checklistItems.filter((item) => !checks[item.id]);
    if (filter === 'nok') return checklistItems.filter((item) => checks[item.id] === 'nok');
    return checklistItems.filter((item) => item.critical);
  }, [checks, filter]);

  const visibleByCategory = categories
    .map((category) => ({
      category,
      items: filteredItems.filter((item) => item.category === category),
    }))
    .filter((entry) => entry.items.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Checklist Pré-Operacional NR-11
        </h1>
        <p className="text-gray-500">
          Inspeção técnica obrigatória por turno. Registre conformidade, não conformidade e
          observações para rastreabilidade operacional.
        </p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Operador Responsável
            </label>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              placeholder="Nome completo"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Identificação do Equipamento
            </label>
            <input
              type="text"
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
              placeholder="Ex.: EMP-07 / Série"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Turno
            </label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value as Shift)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition-all bg-white"
            >
              <option value="">Selecione</option>
              <option value="A">Turno A</option>
              <option value="B">Turno B</option>
              <option value="C">Turno C</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Data da inspeção:{' '}
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2 gap-3">
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
            <span className="w-3 h-3 rounded-full bg-slate-500 inline-block"></span> N/A: {naItems}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span> Pendentes:{' '}
            {totalItems - checkedItems}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ['todos', 'Todos'],
            ['pendentes', 'Pendentes'],
            ['nok', 'Somente NOK'],
            ['criticos', 'Itens Críticos'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id as ChecklistFilter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                filter === id
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
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

      {completed && (
        <div
          className={`rounded-xl p-5 text-center shadow-sm ${
            operationalStatus === 'nao-apto'
              ? 'bg-red-50 border border-red-200'
              : 'bg-green-50 border border-green-200'
          }`}
        >
          {operationalStatus === 'nao-apto' ? (
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
              <span className="text-4xl block mb-2">🟢</span>
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

      <div className="space-y-6">
        {visibleByCategory.map(({ category, items }) => {
          return (
            <div key={category}>
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                {category}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {items.filter((item) => Boolean(checks[item.id])).length}/{items.length}
                </span>
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
                    <div className="flex items-start gap-3 p-3 md:p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            {item.id}
                          </span>
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

                        {(checks[item.id] === 'nok' || notes[item.id]) && (
                          <textarea
                            value={notes[item.id] || ''}
                            onChange={(e) => handleNote(item.id, e.target.value)}
                            placeholder="Descreva a não conformidade ou observação técnica..."
                            rows={2}
                            className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none resize-none"
                          />
                        )}

                        {checks[item.id] && (
                          <div className="mt-2 text-xs font-medium text-gray-500">
                            Status: {STATUS_LABEL[checks[item.id] as Exclude<CheckStatus, null>]}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0 pt-0.5">
                        <button
                          onClick={() => handleCheck(item.id, 'ok')}
                          className={`w-10 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            checks[item.id] === 'ok'
                              ? 'bg-green-500 text-white shadow-md shadow-green-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                          }`}
                        >
                          OK
                        </button>
                        <button
                          onClick={() => handleCheck(item.id, 'nok')}
                          className={`w-10 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            checks[item.id] === 'nok'
                              ? 'bg-red-500 text-white shadow-md shadow-red-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                          }`}
                        >
                          NOK
                        </button>
                        <button
                          onClick={() => handleCheck(item.id, 'na')}
                          className={`w-10 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            checks[item.id] === 'na'
                              ? 'bg-slate-500 text-white shadow-md shadow-slate-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-slate-100 hover:text-slate-600'
                          }`}
                        >
                          N/A
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

      <div
        className={`rounded-xl p-4 text-sm border ${
          operationalStatus === 'apto'
            ? 'bg-green-50 border-green-200 text-green-800'
            : operationalStatus === 'nao-apto'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}
      >
        <p className="font-bold mb-1">Laudo Operacional</p>
        {operationalStatus === 'pendente' && (
          <p>
            Checklist em andamento. Para concluir, preencha todos os itens e informe operador e
            equipamento.
          </p>
        )}
        {operationalStatus === 'apto' && (
          <p>
            Inspeção concluída sem não conformidades. Equipamento liberado para operação no turno
            atual.
          </p>
        )}
        {operationalStatus === 'nao-apto' && (
          <p>
            Há não conformidades registradas. Bloqueie a operação e encaminhe imediatamente para
            avaliação da manutenção/supervisão.
          </p>
        )}
      </div>
    </div>
  );
}
