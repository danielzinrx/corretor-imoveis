/* =============================================
   PÁGINA — Imóveis (catálogo com filtros)
   ============================================= */

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filtros from '../components/imoveis/Filtros.jsx';
import ListaImoveis from '../components/imoveis/ListaImoveis.jsx';
import Botao from '../components/ui/Botao.jsx';
import { useFiltros } from '../hooks/useFiltros.js';
import { useImoveis } from '../hooks/useImoveis.js';
import { SITE } from '../config/site.js';

export default function Imoveis() {
  const [params] = useSearchParams();
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const {
    filtros, setFiltro, toggleCaracteristica,
    limpar, aplicarFiltrosLocais, qtdFiltrosAtivos,
  } = useFiltros();

  /* Busca tudo ordenado por data; os filtros rodam no navegador
     (evita criar índices no Firestore para cada combinação) */
  const { imoveis, carregando, erro } = useImoveis();

  /* Aplica os filtros que vêm na URL (ex.: /imoveis?tipo=casa) */
  useEffect(() => {
    ['tipo', 'cidade', 'finalidade'].forEach(campo => {
      const valor = params.get(campo);
      if (valor) setFiltro(campo, valor);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    document.title = `Imóveis à venda e para alugar | ${SITE.nome}`;
  }, []);

  const filtrados = useMemo(
    () => aplicarFiltrosLocais(imoveis),
    [aplicarFiltrosLocais, imoveis],
  );

  return (
    <main className="pagina">
      <div className="pagina__conteudo">
        <h1 className="pagina__titulo">Nossos <span>Imóveis</span></h1>
        <p className="pagina__subtitulo">
          Casas, apartamentos, lotes, imóveis rurais e lojas no Distrito Federal e região.
          Use os filtros para encontrar o que combina com você.
        </p>

        <div className="catalogo__botao-filtros" style={{ marginTop: '24px' }}>
          <Botao
            variante="secundario"
            tamanho="sm"
            icone="⚙️"
            id="catalogo-abrir-filtros"
            onClick={() => setFiltrosAbertos(v => !v)}
          >
            {filtrosAbertos ? 'Esconder filtros' : `Filtros${qtdFiltrosAtivos ? ` (${qtdFiltrosAtivos})` : ''}`}
          </Botao>
        </div>

        <div className="catalogo">
          <div className={`catalogo__filtros ${filtrosAbertos ? 'catalogo__filtros--aberto' : ''}`}>
            <Filtros
              filtros={filtros}
              setFiltro={setFiltro}
              toggleCaracteristica={toggleCaracteristica}
              limpar={limpar}
              qtdFiltrosAtivos={qtdFiltrosAtivos}
            />
          </div>

          <ListaImoveis imoveis={filtrados} carregando={carregando} erro={erro} />
        </div>
      </div>
    </main>
  );
}
