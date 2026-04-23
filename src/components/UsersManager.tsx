import { useEffect, useState } from 'react';
import { listUsers, softDeleteUser, updateUserRole, AdminUserItem } from '../lib/adminData';
import { useAuth } from '../context/AuthContext';

export default function UsersManager() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await listUsers();
      setUsers(items.filter((entry) => !entry.deleted));
    } catch (err) {
      setError((err as Error).message || 'Falha ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleRoleChange = async (target: AdminUserItem) => {
    const nextRole = target.role === 'admin' ? 'operator' : 'admin';
    try {
      await updateUserRole(target.id, nextRole);
      await loadUsers();
    } catch (err) {
      setError((err as Error).message || 'Falha ao alterar função.');
    }
  };

  const handleDelete = async (target: AdminUserItem) => {
    if (!confirm(`Deseja remover o usuário ${target.name}?`)) return;

    try {
      await softDeleteUser(target.id);
      await loadUsers();
    } catch (err) {
      setError((err as Error).message || 'Falha ao remover usuário.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
        <p className="text-sm text-gray-500">
          Gerencie perfis de acesso no Firestore (roles e status no app).
        </p>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
          Esta tela não cria contas no Firebase Authentication. Contas de login são criadas apenas em
          "Criar Conta" com token.
        </p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-4 text-sm text-gray-500">Carregando usuários...</p>
        ) : users.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {users.map((entry) => {
              const isSelf = entry.id === user?.id;
              return (
                <div key={entry.id} className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{entry.name}</p>
                    <p className="text-xs text-gray-500">{entry.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Criado em {entry.createdAtMs ? new Date(entry.createdAtMs).toLocaleString('pt-BR') : '—'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      entry.role === 'admin' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'
                    }`}>
                      {entry.role}
                    </span>
                    <button
                      onClick={() => void handleRoleChange(entry)}
                      disabled={isSelf}
                      className="text-xs px-3 py-1.5 rounded border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
                    >
                      {entry.role === 'admin' ? 'Tornar operator' : 'Tornar admin'}
                    </button>
                    <button
                      onClick={() => void handleDelete(entry)}
                      disabled={isSelf}
                      className="text-xs px-3 py-1.5 rounded border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="p-4 text-sm text-gray-500">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}
