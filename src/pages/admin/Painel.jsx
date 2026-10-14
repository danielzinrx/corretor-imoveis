/* =============================================
   PÁGINA ADMIN — Painel (lista de imóveis)
   ============================================= */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabelaAdminImoveis from '../../components/admin/TabelaAdminImoveis.jsx';
import FiltrosAdmin from '../../components/admin/FiltrosAdmin.jsx';
import Botao from '../../components/ui/Botao.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { listarImoveis, atualizarImovel, excluirImovel } from '../../services/imoveisService.js';
import { removerFoto } from '../../services/storageService.js';
import { logout, usuarioAtual } from '../../services/authService.js';

const FILTROS_PADRAO = {
  busca: '',
  status: 'todos',
  tipo: 'todos',
  finalidade: 'todos',
  cidade: 'todos',
  destaque: 'todos',
  ordenar: 'recentes',
};

export default function Painel() {
  const navigate = useNavigate();
  const [imoveis,    setImoveis]    = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState('');
  const [filtros,    setFiltros]    = useState(FILTROS_PADRAO);

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
    document.title = 'Painel do corretor | Gestão de Imóveis';
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

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleLimparFiltros = () => {
    setFiltros(FILTROS_PADRAO);
  };

  // Métricas para os KPI Cards
  const metricas = useMemo(() => {
    const total = imoveis.length;
    const disponiveis = imoveis.filter(i => (i.status ?? 'disponivel') === 'disponivel').length;
    const vendidos = imoveis.filter(i => i.status === 'vendido').length;
    const reservados = imoveis.filter(i => i.status === 'reservado').length;
    const destaques = imoveis.filter(i => !!i.destaque).length;
    const valorTotal = imoveis.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

    return { total, disponiveis, vendidos, reservados, destaques, valorTotal };
  }, [imoveis]);

  // Lista de cidades disponíveis nos imóveis
  const cidadesDisponiveis = useMemo(() => {
    const set = new Set();
    imoveis.forEach(i => {
      if (i.cidade) set.add(i.cidade);
    });
    return Array.from(set);
  }, [imoveis]);

  // Filtragem e ordenação local
  const imoveisFiltrados = useMemo(() => {
    let lista = [...imoveis];

    // Busca textual
    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase().trim();
      lista = lista.filter(im => {
        const tit = (im.titulo || '').toLowerCase();
        const desc = (im.descricao || '').toLowerCase();
        const bai = (im.bairro || '').toLowerCase();
        const end = (im.endereco || '').toLowerCase();
        const dfId = (im.dfImoveisId || '').toLowerCase();
        const id = (im.id || '').toLowerCase();
        return (
          tit.includes(q) ||
          bai.includes(q) ||
          end.includes(q) ||
          dfId.includes(q) ||
          id.includes(q) ||
          desc.includes(q)
        );
      });
    }

    // Status
    if (filtros.status !== 'todos') {
      lista = lista.filter(im => (im.status ?? 'disponivel') === filtros.status);
    }

    // Tipo
    if (filtros.tipo !== 'todos') {
      lista = lista.filter(im => im.tipo === filtros.tipo);
    }

    // Finalidade
    if (filtros.finalidade !== 'todos') {
      lista = lista.filter(im => im.finalidade === filtros.finalidade);
    }

    // Cidade
    if (filtros.cidade !== 'todos') {
      lista = lista.filter(im => im.cidade === filtros.cidade);
    }

    // Destaque
    if (filtros.destaque === 'sim') {
      lista = lista.filter(im => !!im.destaque);
    } else if (filtros.destaque === 'nao') {
      lista = lista.filter(im => !im.destaque);
    }

    // Ordenação
    const getSegundos = d =>
      d?.dataCadastro?.seconds ??
      (d?.dataCadastro ? new Date(d.dataCadastro).getTime() / 1000 : 0);

    switch (filtros.ordenar) {
      case 'antigos':
        lista.sort((a, b) => getSegundos(a) - getSegundos(b));
        break;
      case 'maior-preco':
        lista.sort((a, b) => (Number(b.valor) || 0) - (Number(a.valor) || 0));
        break;
      case 'menor-preco':
        lista.sort((a, b) => (Number(a.valor) || 0) - (Number(b.valor) || 0));
        break;
      case 'az':
        lista.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
        break;
      case 'za':
        lista.sort((a, b) => (b.titulo || '').localeCompare(a.titulo || ''));
        break;
      case 'recentes':
      default:
        lista.sort((a, b) => getSegundos(b) - getSegundos(a));
        break;
    }

    return lista;
  }, [imoveis, filtros]);

  const valorTotalFiltrado = useMemo(() => {
    return imoveisFiltrados.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  }, [imoveisFiltrados]);

  return (
    <main className="pagina">
      <div className="pagina__conteudo">
        {/* Cabeçalho do Painel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <div>
            <h1 className="pagina__titulo">Painel do <span>corretor</span></h1>
            <p className="pagina__subtitulo">
              {usuarioAtual()?.email} · Gestão inteligente e controle completo do catálogo de imóveis
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Botao variante="primario" href="/admin/novo" icone="＋" id="painel-novo">Novo imóvel</Botao>
            <Botao variante="secundario" onClick={sair} id="painel-sair">Sair</Botao>
          </div>
        </div>

        {erro && <div className="aviso aviso--erro" role="alert" style={{ marginBottom: '20px' }}>{erro}</div>}

        {carregando ? (
          <Loader texto="Carregando imóveis..." />
        ) : (
          <>
            {/* Seção de Métricas e Filtros */}
            <FiltrosAdmin
              filtros={filtros}
              onFiltroChange={handleFiltroChange}
              onLimparFiltros={handleLimparFiltros}
              metricas={metricas}
              cidadesDisponiveis={cidadesDisponiveis}
              totalFiltrados={imoveisFiltrados.length}
              totalImoveis={imoveis.length}
              valorTotalFiltrado={valorTotalFiltrado}
            />

            {/* Tabela de Imóveis */}
            <TabelaAdminImoveis
              imoveis={imoveisFiltrados}
              totalOriginal={imoveis.length}
              onLimparFiltros={handleLimparFiltros}
              onExcluir={excluir}
              onAlterarCampo={alterarCampo}
            />
          </>
        )}
      </div>
    </main>
  );
}
