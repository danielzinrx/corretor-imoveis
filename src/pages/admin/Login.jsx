/* =============================================
   PÁGINA ADMIN — Login do corretor
   ============================================= */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Botao from '../../components/ui/Botao.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { login, observarAuth } from '../../services/authService.js';

function traduzirErro(codigo) {
  switch (codigo) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'E-mail ou senha incorretos.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
    case 'auth/network-request-failed':
      return 'Sem conexão com a internet.';
    default:
      return 'Não foi possível entrar. Tente novamente.';
  }
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const destino  = location.state?.de ?? '/admin';

  const [email,  setEmail]  = useState('');
  const [senha,  setSenha]  = useState('');
  const [erro,   setErro]   = useState('');
  const [enviando, setEnviando] = useState(false);
  const [logado, setLogado] = useState(null); // null = verificando

  useEffect(() => {
    document.title = 'Área do corretor';
    return observarAuth(user => setLogado(!!user));
  }, []);

  const entrar = async (e) => {
    e.preventDefault();
    setErro('');
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha.');
      return;
    }
    setEnviando(true);
    try {
      await login(email.trim(), senha);
      navigate(destino, { replace: true });
    } catch (err) {
      setErro(traduzirErro(err.code));
    } finally {
      setEnviando(false);
    }
  };

  if (logado === null) {
    return <div className="pagina-carregando"><Loader /></div>;
  }
  if (logado) return <Navigate to="/admin" replace />;

  return (
    <main className="pagina" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form
        className="caixa"
        onSubmit={entrar}
        noValidate
        style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '18px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <img src="/img/logo.png" alt="" width="64" height="64" style={{ margin: '0 auto 12px', borderRadius: '12px' }} />
          <h1 className="pagina__titulo" style={{ fontSize: '1.5rem' }}>Área do <span>corretor</span></h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>Entre para cadastrar e editar imóveis.</p>
        </div>

        <div className="campo">
          <label className="campo__rotulo" htmlFor="login-email">E-mail</label>
          <input
            id="login-email" className="campo__input" type="email" autoComplete="username"
            value={email} onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="campo">
          <label className="campo__rotulo" htmlFor="login-senha">Senha</label>
          <input
            id="login-senha" className="campo__input" type="password" autoComplete="current-password"
            value={senha} onChange={e => setSenha(e.target.value)}
          />
        </div>

        {erro && <div className="aviso aviso--erro" role="alert">{erro}</div>}

        <Botao type="submit" variante="primario" disabled={enviando} id="login-entrar">
          {enviando ? 'Entrando...' : 'Entrar'}
        </Botao>
      </form>
    </main>
  );
}
