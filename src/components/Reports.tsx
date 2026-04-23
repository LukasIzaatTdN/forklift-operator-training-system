import { useEffect, useMemo, useState } from 'react';
import { listTickets, listUsers, TicketItem, AdminUserItem } from '../lib/adminData';

interface DayPoint {
  label: string;
  count: number;
}

function getLastDays(days: number): string[] {
  const labels: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
  }
  return labels;
}

function groupByDay(timestamps: number[], days = 7): DayPoint[] {
  const labels = getLastDays(days);
  const map = new Map(labels.map((label) => [label, 0]));

  timestamps.forEach((ts) => {
    const label = new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (map.has(label)) {
      map.set(label, (map.get(label) || 0) + 1);
    }
  });

  return labels.map((label) => ({ label, count: map.get(label) || 0 }));
}

export default function Reports() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [ticketData, userData] = await Promise.all([listTickets(300), listUsers()]);
        setTickets(ticketData);
        setUsers(userData.filter((u) => !u.deleted));
      } catch (err) {
        setError((err as Error).message || 'Falha ao carregar relatórios.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const ticketsByDay = useMemo(() => groupByDay(tickets.map((t) => t.createdAtMs), 7), [tickets]);
  const usersByDay = useMemo(() => groupByDay(users.map((u) => u.createdAtMs), 7), [users]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500">Acompanhamento de chamados e criação de usuários por período.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="Chamados por dia (7 dias)" data={ticketsByDay} loading={loading} color="bg-indigo-500" />
        <ChartCard title="Usuários criados por dia (7 dias)" data={usersByDay} loading={loading} color="bg-emerald-500" />
      </div>
    </div>
  );
}

function ChartCard({
  title,
  data,
  loading,
  color,
}: {
  title: string;
  data: DayPoint[];
  loading: boolean;
  color: string;
}) {
  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {data.map((point) => (
            <div key={point.label} className="flex items-center gap-3">
              <span className="w-12 text-xs text-gray-500">{point.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className={`${color} h-3 rounded-full`} style={{ width: `${(point.count / max) * 100}%` }} />
              </div>
              <span className="w-6 text-right text-xs font-semibold text-gray-700">{point.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
