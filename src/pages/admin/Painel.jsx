/* =============================================
   PÁGINA ADMIN — Painel (lista de imóveis)
   ============================================= */

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabelaAdminImoveis from '../../components/admin/TabelaAdminImoveis.jsx';
import Botao from '../../components/ui/Botao.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { listarImoveis, atualizarImovel, excluirImovel } from '../../services/imoveisService.js';
import { removerFoto } from '../../services/storageService.js';
import { logout, usuarioAtual } from '../../services/authService.js';

export default function Painel() {
  const navigate = useNavigate();
  const [imoveis,    setImoveis]    = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setImoveis(await listarImoveis());
    } catch (e) {
      console.error('Painel:', e);
      setErro('Não foi possível carregar os imóveis.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Painel do corretor';
    carregar();
  }, [carregar]);

  const alterarCampo = async (imovel, campo, valor) => {
    // atualiza na tela na hora e desfaz se o servidor recusar
    setImoveis(lista => lista.map(i => (i.id === imovel.id ? { ...i, [campo]: valor } : i)));
    try {
      await atualizarImovel(imovel.id, { [campo]: valor });
    } catch (e) {
      console.error('Painel alterarCampo:', e);
      setImoveis(lista => lista.map(i => (i.id === imovel.id ? { ...i, [campo]: imovel[campo] } : i)));
      setErro('Não foi possível salvar a alteração.');
    }
  };

  const excluir = async (imovel) => {
    if (!window.confirm(`Excluir "${imovel.titulo}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await excluirImovel(imovel.id);
      // remove as fotos do Storage (se uma falhar, o imóvel já foi excluído)
      await Promise.allSettled((imovel.fotos ?? []).map(f => removerFoto(f?.caminho)));
      setImoveis(lista => lista.filter(i => i.id !== imovel.id));
    } catch (e) {
      console.error('Painel excluir:', e);
      setErro('Não foi possível excluir o imóvel.');
    }
  };

  const sair = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const disponiveis = imoveis.filter(i => (i.status ?? 'disponivel') === 'disponivel').length;

  return (
    <main className="pagina">
      <div className="pagina__conteudo">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 className="pagina__titulo">Painel do <span>corretor</span></h1>
            <p className="pagina__subtitulo">
              {usuarioAtual()?.email} · {imoveis.length} {imoveis.length === 1 ? 'imóvel' : 'imóveis'}
              {imoveis.length > 0 && <> ({disponiveis} disponíveis)</>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Botao variante="primario" href="/admin/novo" icone="＋" id="painel-novo">Novo imóvel</Botao>
            <Botao variante="secundario" onClick={sair} id="painel-sair">Sair</Botao>
          </div>
        </div>

        {erro && <div className="aviso aviso--erro" role="alert" style={{ marginTop: '20px' }}>{erro}</div>}

        <div style={{ marginTop: '32px' }}>
          {carregando
            ? <Loader texto="Carregando imóveis..." />
            : <TabelaAdminImoveis imoveis={imoveis} onExcluir={excluir} onAlterarCampo={alterarCampo} />}
        </div>
      </div>
    </main>
  );
}
