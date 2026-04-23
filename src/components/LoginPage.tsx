import { useState } from 'react';
import { useAuth, getAvailableUsers } from '../context/AuthContext';

type AuthTab = 'login' | 'register';

export default function LoginPage() {
  const { login, registerWithToken, authMode } = useAuth();
  const [tab, setTab] = useState<AuthTab>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerToken, setRegisterToken] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Erro ao fazer login.');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRegisterSuccess('');
    setLoading(true);

    const result = await registerWithToken(registerName, registerEmail, registerPassword, registerToken);
    if (!result.success) {
      setError(result.error || 'Falha ao criar conta.');
      setLoading(false);
      return;
    }

    setRegisterSuccess('Conta criada com sucesso. Você já está autenticado no sistema.');
    setLoading(false);
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');

    const result = await login(userEmail, userPassword);
    if (!result.success) {
      setError(result.error || 'Erro ao fazer login.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl shadow-xl shadow-amber-500/30 mb-4">
            <span className="text-4xl">🚜</span>
          </div>
          <h1 className="text-3xl font-bold text-white">EmpilhaPro</h1>
          <p className="text-slate-400 text-sm mt-1">Sistema de Aperfeiçoamento para Operadores</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4">
            <h2 className="text-lg font-bold text-white">🔐 Acesso ao Sistema</h2>
            <p className="text-amber-100 text-xs mt-0.5">
              {tab === 'login' ? 'Faça login para acessar o painel' : 'Cadastro protegido por token de criação'}
            </p>
          </div>

          {authMode === 'firebase' && (
            <div className="px-6 pt-4">
              <div className="grid grid-cols-2 gap-2 bg-slate-900/20 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setError('');
                  }}
                  className={`text-sm rounded-lg px-3 py-2 transition-colors ${
                    tab === 'login' ? 'bg-white text-slate-900 font-semibold' : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setError('');
                  }}
                  className={`text-sm rounded-lg px-3 py-2 transition-colors ${
                    tab === 'register' ? 'bg-white text-slate-900 font-semibold' : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  Criar Conta
                </button>
              </div>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-red-400 text-sm mt-0.5">⚠️</span>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Usuário</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl text-sm hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar no Sistema'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-300">
                  {error}
                </div>
              )}
              {registerSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-sm text-green-300">
                  {registerSuccess}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Nome</label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Nome do operador"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="operador@empresa.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Senha</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Token de Criação</label>
                <input
                  type="text"
                  value={registerToken}
                  onChange={(e) => setRegisterToken(e.target.value.toUpperCase())}
                  placeholder="EMP-XXXX-XXXX"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !registerName || !registerEmail || !registerPassword || !registerToken}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-xl text-sm hover:from-indigo-600 hover:to-blue-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Criando conta...' : 'Criar conta com token'}
              </button>
            </form>
          )}
        </div>

        {authMode === 'local' ? (
          <div className="mt-6">
            <p className="text-center text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">
              Acesso Rápido (Demonstração)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {getAvailableUsers().map((u) => (
                <button
                  key={u.email}
                  onClick={() => quickLogin(u.email, u.role === 'admin' ? 'admin3025' : 'operador123')}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${u.role === 'admin' ? 'bg-red-400' : 'bg-green-400'}`} />
                    <span className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {u.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{u.hint}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-blue-500/10 border border-blue-400/20 rounded-xl p-4">
            <p className="text-sm text-blue-200 font-medium">Autenticação Firebase ativa.</p>
            <p className="text-xs text-blue-100/80 mt-1">
              Novas contas só podem ser criadas com token gerado por administrador.
            </p>
          </div>
        )}

        <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">📋 Permissões por Perfil</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="mt-1 text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full font-medium">Admin</span>
              <p className="text-xs text-slate-400">Acesso completo e geração de token de cadastro</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full font-medium">Operador</span>
              <p className="text-xs text-slate-400">Acesso aos conteúdos, quizzes e progresso pessoal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
