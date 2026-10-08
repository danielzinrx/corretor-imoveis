/* =============================================
   HOOK — useFiltros
   Estado e lógica de filtragem do catálogo
   ============================================= */

import { useState, useCallback, useMemo } from 'react';
import { TIPOS_IMOVEL, CIDADES_DF, CARACTERISTICAS } from '../config/opcoes.js';

const FILTROS_PADRAO = {
  tipo:            '',
  finalidade:      '',
  cidade:          '',
  quartos:         '',
  suites:          '',
  vagas:           '',
  valorMin:        '',
  valorMax:        '',
  areaMin:         '',
  areaMax:         '',
  caracteristicas: [],   // array de strings
  ordenar:         'recentes',
  busca:           '',
};

export function useFiltros() {
  const [filtros, setFiltros] = useState(FILTROS_PADRAO);

  /* Atualiza um campo */
  const setFiltro = useCallback((campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  }, []);

  /* Toggle de uma característica */
  const toggleCaracteristica = useCallback((valor) => {
    setFiltros(prev => {
      const lista = prev.caracteristicas;
      return {
        ...prev,
        caracteristicas: lista.includes(valor)
          ? lista.filter(c => c !== valor)
          : [...lista, valor],
      };
    });
  }, []);

  /* Limpar tudo */
  const limpar = useCallback(() => {
    setFiltros(FILTROS_PADRAO);
  }, []);

  /* Filtragem client-side (usada quando não há índice no Firestore) */
  const aplicarFiltrosLocais = useCallback((imoveis) => {
    let lista = [...imoveis];

    if (filtros.tipo)       lista = lista.filter(i => i.tipo === filtros.tipo);
    if (filtros.finalidade) lista = lista.filter(i => i.finalidade === filtros.finalidade);
    if (filtros.cidade)     lista = lista.filter(i => i.cidade === filtros.cidade);

    if (filtros.quartos)    lista = lista.filter(i => (i.quartos ?? 0)  >= Number(filtros.quartos));
    if (filtros.suites)     lista = lista.filter(i => (i.suites  ?? 0)  >= Number(filtros.suites));
    if (filtros.vagas)      lista = lista.filter(i => (i.vagas   ?? 0)  >= Number(filtros.vagas));

    if (filtros.valorMin)   lista = lista.filter(i => (i.valor ?? 0)    >= Number(filtros.valorMin));
    if (filtros.valorMax)   lista = lista.filter(i => (i.valor ?? 0)    <= Number(filtros.valorMax));
    if (filtros.areaMin)    lista = lista.filter(i => (i.areaUtil ?? 0) >= Number(filtros.areaMin));
    if (filtros.areaMax)    lista = lista.filter(i => (i.areaUtil ?? 0) <= Number(filtros.areaMax));

    if (filtros.caracteristicas.length > 0) {
      lista = lista.filter(i =>
        filtros.caracteristicas.every(c => (i.caracteristicas ?? []).includes(c))
      );
    }

    if (filtros.busca.trim()) {
      const termo = filtros.busca.toLowerCase();
      lista = lista.filter(i =>
        (i.titulo ?? '').toLowerCase().includes(termo) ||
        (i.descricao ?? '').toLowerCase().includes(termo) ||
        (i.bairro ?? '').toLowerCase().includes(termo)
      );
    }

    // Ordenação
    switch (filtros.ordenar) {
      case 'menor-preco': lista.sort((a, b) => (a.valor ?? 0) - (b.valor ?? 0));        break;
      case 'maior-preco': lista.sort((a, b) => (b.valor ?? 0) - (a.valor ?? 0));        break;
      case 'menor-area':  lista.sort((a, b) => (a.areaUtil ?? 0) - (b.areaUtil ?? 0));  break;
      case 'maior-area':  lista.sort((a, b) => (b.areaUtil ?? 0) - (a.areaUtil ?? 0));  break;
      default:            /* recentes: mantém a ordem do Firestore */
    }

    return lista;
  }, [filtros]);

  /* Conta filtros ativos */
  const qtdFiltrosAtivos = useMemo(() => {
    let n = 0;
    if (filtros.tipo)            n++;
    if (filtros.finalidade)      n++;
    if (filtros.cidade)          n++;
    if (filtros.quartos)         n++;
    if (filtros.suites)          n++;
    if (filtros.vagas)           n++;
    if (filtros.valorMin)        n++;
    if (filtros.valorMax)        n++;
    if (filtros.areaMin)         n++;
    if (filtros.areaMax)         n++;
    n += filtros.caracteristicas.length;
    return n;
  }, [filtros]);

  return {
    filtros,
    setFiltro,
    toggleCaracteristica,
    limpar,
    aplicarFiltrosLocais,
    qtdFiltrosAtivos,
  };
}
