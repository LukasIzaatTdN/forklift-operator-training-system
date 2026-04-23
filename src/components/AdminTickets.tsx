import { useEffect, useState } from 'react';
import { listTickets, updateTicketStatus, TicketItem } from '../lib/adminData';

export default function AdminTickets() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await listTickets(50);
      setTickets(items);
    } catch (err) {
      setError((err as Error).message || 'Falha ao carregar chamados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTickets();
  }, []);

  const handleStatusChange = async (
    ticket: TicketItem,
    status: 'aberto' | 'em_andamento' | 'finalizado'
  ) => {
    try {
      await updateTicketStatus(ticket.id, status);
      await loadTickets();
    } catch (err) {
      setError((err as Error).message || 'Falha ao atualizar status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chamados / Atividade</h1>
        <p className="text-sm text-gray-500">Acompanhe e atualize o status dos chamados.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-4 text-sm text-gray-500">Carregando chamados...</p>
        ) : tickets.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ticket.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{ticket.description || 'Sem descrição'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {ticket.createdByEmail} • {new Date(ticket.createdAtMs).toLocaleString('pt-BR')}
                  </p>
                </div>

                <select
                  value={ticket.status}
                  onChange={(e) => void handleStatusChange(ticket, e.target.value as TicketItem['status'])}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-sm text-gray-500">Nenhum chamado encontrado.</p>
        )}
      </div>
    </div>
  );
}
