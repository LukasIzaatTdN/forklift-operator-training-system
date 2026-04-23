export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500">Ajustes administrativos do sistema.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Segurança</h2>
        <p className="text-sm text-gray-600">
          Para regras finais de acesso admin/operator, mantenha validações também nas regras do Firestore e não
          apenas no frontend.
        </p>
      </div>
    </div>
  );
}
