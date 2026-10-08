/* =============================================
   HOOK — useImoveis
   Busca e gerencia imóveis do Firestore
   ============================================= */

import { useState, useEffect, useCallback } from 'react';
import { listarImoveis, imoveisDestaque } from '../services/imoveisService.js';

/**
 * Hook para listar imóveis com filtros e estados de carregamento
 * @param {object} filtrosIniciais
 */
export function useImoveis(filtrosIniciais = {}) {
  const [imoveis,    setImoveis]    = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState(null);
  const [filtros,    setFiltros]    = useState(filtrosIniciais);

  const buscar = useCallback(async (f = filtros) => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarImoveis(f);
      setImoveis(dados);
    } catch (e) {
      console.error('useImoveis:', e);
      setErro('Não foi possível carregar os imóveis. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    buscar();
  }, [filtros]);

  const atualizarFiltros = useCallback((novosFiltros) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros(filtrosIniciais);
  }, [filtrosIniciais]);

  return { imoveis, carregando, erro, filtros, atualizarFiltros, limparFiltros, recarregar: buscar };
}

/**
 * Hook para buscar imóveis em destaque (para a Home)
 */
export function useImoveisDestaque(qtd = 6) {
  const [imoveis,    setImoveis]    = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState(null);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const dados = await imoveisDestaque(qtd);
        if (ativo) setImoveis(dados);
      } catch (e) {
        if (ativo) setErro('Erro ao carregar destaques.');
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => { ativo = false; };
  }, [qtd]);

  return { imoveis, carregando, erro };
}
