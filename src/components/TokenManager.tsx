import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listCreationTokens, removeCreationToken, CreationTokenItem } from '../lib/creationTokens';

export default function TokenManager() {
  const { generateCreationToken } = useAuth();
  const [tokens, setTokens] = useState<CreationTokenItem[]>([]);
  const [hours, setHours] = useState(24);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadTokens = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await listCreationTokens(50);
      setTokens(list);
    } catch (err) {
      setError((err as Error).message || 'Falha ao carregar tokens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTokens();
  }, []);

  const handleGenerate = async () => {
    setFeedback('');
    const result = await generateCreationToken(hours);
    if (!result.success) {
      setError(result.error || 'Falha ao gerar token.');
      return;
    }

    setFeedback(`Token gerado: ${result.token}`);
    await loadTokens();
  };

  const handleRemove = async (token: string) => {
    try {
      await removeCreationToken(token);
      await loadTokens();
    } catch (err) {
      setError((err as Error).message || 'Falha ao remover token.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Tokens</h1>
        <p className="text-sm text-gray-500">Tokens de convite para criação de novas contas operator.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row md:items-end gap-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Validade (horas)</label>
          <input
            type="number"
            value={hours}
            min={1}
            max={168}
            onChange={(e) => setHours(Number(e.target.value || 24))}
            className="w-32 px-3 py-2 rounded-lg border border-gray-200"
          />
        </div>
        <button onClick={() => void handleGenerate()} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
          Gerar Token
        </button>
        <button onClick={() => void loadTokens()} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200">
          Atualizar
        </button>
      </div>

      {feedback && <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl p-4 text-sm break-all">{feedback}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-4 text-sm text-gray-500">Carregando tokens...</p>
        ) : tokens.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {tokens.map((item) => {
              const expired = item.expiresAt < Date.now();
              const status = item.used ? 'usado' : expired ? 'expirado' : 'disponível';

              return (
                <div key={item.token} className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.token}</p>
                    <p className="text-xs text-gray-500">
                      Criado por {item.createdByEmail || 'admin'} • {new Date(item.createdAt).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500">Expira em {new Date(item.expiresAt).toLocaleString('pt-BR')}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      status === 'disponível'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : status === 'usado'
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                      {status}
                    </span>
                    <button
                      onClick={() => void handleRemove(item.token)}
                      className="text-xs px-3 py-1 rounded border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="p-4 text-sm text-gray-500">Nenhum token criado.</p>
        )}
      </div>
    </div>
  );
}
