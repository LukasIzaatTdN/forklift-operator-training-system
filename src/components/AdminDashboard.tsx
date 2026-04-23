import { useEffect, useState } from 'react';
import { getDashboardStats, listTickets, DashboardStats, TicketItem } from '../lib/adminData';
import { listActiveCreationTokens } from '../lib/creationTokens';

const emptyStats: DashboardStats = {
  totalUsers: 0,
  totalOperators: 0,
  totalAdmins: 0,
  totalTickets: 0,
  activeTokens: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const activeTokens = await listActiveCreationTokens(200);
        const [statsData, ticketsData] = await Promise.all([
          getDashboardStats(activeTokens.length),
          listTickets(8),
        ]);

        setStats(statsData);
        setTickets(ticketsData);
      } catch (err) {
        setError((err as Error).message || 'Falha ao carregar dashboard admin.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <p className="text-slate-300 text-sm mt-1">Visão completa de usuários, tokens e atividade do sistema.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card title="Total de usuários" value={stats.totalUsers} icon="👥" loading={loading} />
        <Card title="Operadores" value={stats.totalOperators} icon="🦺" loading={loading} />
        <Card title="Administradores" value={stats.totalAdmins} icon="🛡️" loading={loading} />
        <Card title="Total de chamados" value={stats.totalTickets} icon="📋" loading={loading} />
        <Card title="Tokens ativos" value={stats.activeTokens} icon="🎟️" loading={loading} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Chamados Recentes</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Carregando...</p>
        ) : tickets.length > 0 ? (
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ticket.title}</p>
                  <p className="text-xs text-gray-500">
                    {ticket.createdByEmail} • {new Date(ticket.createdAtMs).toLocaleString('pt-BR')}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhum chamado registrado.</p>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, icon, loading }: { title: string; value: number; icon: string; loading: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{loading ? '...' : value}</div>
      <div className="text-xs text-gray-500">{title}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: TicketItem['status'] }) {
  const styles: Record<TicketItem['status'], string> = {
    aberto: 'bg-amber-100 text-amber-700 border-amber-200',
    em_andamento: 'bg-blue-100 text-blue-700 border-blue-200',
    finalizado: 'bg-green-100 text-green-700 border-green-200',
  };

  const labels: Record<TicketItem['status'], string> = {
    aberto: 'Aberto',
    em_andamento: 'Em andamento',
    finalizado: 'Finalizado',
  };

  return <span className={`text-xs px-2 py-1 rounded-full border font-medium ${styles[status]}`}>{labels[status]}</span>;
}
