/* =============================================
   PÁGINA — Detalhe do imóvel
   ============================================= */

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GaleriaFotos from '../components/imoveis/GaleriaFotos.jsx';
import CaracteristicasLista from '../components/imoveis/CaracteristicasLista.jsx';
import MapaGoogle from '../components/imoveis/MapaGoogle.jsx';
import BotoesContato from '../components/imoveis/BotoesContato.jsx';
import Loader from '../components/ui/Loader.jsx';
import Botao from '../components/ui/Botao.jsx';
import { buscarImovel } from '../services/imoveisService.js';
import { formatarMoeda, formatarArea, labelTipo, labelCidade } from '../utils/formatadores.js';
import { TIPOS_IMOVEL, CIDADES_DF, FINALIDADES, STATUS_IMOVEL } from '../config/opcoes.js';
import { SITE } from '../config/site.js';

function Ficha({ valor, rotulo }) {
  if (valor === undefined || valor === null || valor === '' || valor === 0) return null;
  return (
    <div className="ficha">
      <span className="ficha__valor">{valor}</span>
      <span className="ficha__rotulo">{rotulo}</span>
    </div>
  );
}

export default function DetalheImovel() {
  const { id } = useParams();
  const [imovel,     setImovel]     = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState(null);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    (async () => {
      try {
        const dados = await buscarImovel(id);
        if (ativo) setImovel(dados);
      } catch (e) {
        console.error('DetalheImovel:', e);
        if (ativo) setErro('Não foi possível carregar este imóvel. Tente novamente.');
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => { ativo = false; };
  }, [id]);

  useEffect(() => {
    document.title = imovel
      ? `${imovel.titulo} | ${SITE.nome}`
      : `Imóvel | ${SITE.nome}`;
  }, [imovel]);

  if (carregando) {
    return <main className="pagina"><Loader texto="Carregando imóvel..." /></main>;
  }

  if (erro || !imovel) {
    return (
      <main className="pagina">
        <div className="pagina__conteudo" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🏚️</div>
          <h1 className="pagina__titulo">Imóvel não encontrado</h1>
          <p className="pagina__subtitulo" style={{ margin: '0 auto 28px' }}>
            {erro ?? 'Este imóvel pode ter sido vendido ou removido do catálogo.'}
          </p>
          <Botao variante="primario" href="/imoveis">Ver outros imóveis</Botao>
        </div>
      </main>
    );
  }

  const finalidade = FINALIDADES.find(f => f.valor === imovel.finalidade)?.label;
  const status     = STATUS_IMOVEL.find(s => s.valor === imovel.status)?.label;
  const local      = [imovel.bairro, labelCidade(imovel.cidade, CIDADES_DF)].filter(Boolean).join(' · ');

  return (
    <main className="pagina">
      <div className="pagina__conteudo">
        <Link to="/imoveis" style={{ color: '#D9A93F', fontSize: '0.875rem', fontWeight: 500 }}>
          ← Voltar para os imóveis
        </Link>

        <div className="detalhe">
          {/* ── Coluna principal ── */}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <GaleriaFotos fotos={imovel.fotos} titulo={imovel.titulo} />

            <div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span className="badge badge--dourado">{labelTipo(imovel.tipo, TIPOS_IMOVEL)}</span>
                {finalidade && <span className="badge badge--dourado">{finalidade}</span>}
                {status && imovel.status !== 'disponivel' && (
                  <span className="badge badge--dourado">{status}</span>
                )}
              </div>
              <h1 className="pagina__titulo" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
                {imovel.titulo}
              </h1>
              {local && <p style={{ color: '#888' }}>📍 {local}</p>}
            </div>

            <div className="fichas">
              <Ficha valor={imovel.quartos}   rotulo="Quartos" />
              <Ficha valor={imovel.suites}    rotulo="Suítes" />
              <Ficha valor={imovel.banheiros} rotulo="Banheiros" />
              <Ficha valor={imovel.vagas}     rotulo="Vagas" />
              <Ficha valor={imovel.areaUtil  ? formatarArea(imovel.areaUtil)  : null} rotulo="Área útil" />
              <Ficha valor={imovel.areaTotal ? formatarArea(imovel.areaTotal) : null} rotulo="Área total" />
            </div>

            {imovel.descricao && (
              <div className="caixa">
                <h2 className="caixa__titulo">Sobre o imóvel</h2>
                <p style={{ color: '#c8c8c8', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {imovel.descricao}
                </p>
              </div>
            )}

            {imovel.caracteristicas?.length > 0 && (
              <div className="caixa">
                <h2 className="caixa__titulo">Características</h2>
                <CaracteristicasLista caracteristicas={imovel.caracteristicas} />
              </div>
            )}

            {imovel.lat && imovel.lng && (
              <div className="caixa">
                <h2 className="caixa__titulo">Localização</h2>
                <MapaGoogle
                  lat={imovel.lat}
                  lng={imovel.lng}
                  endereco={imovel.endereco}
                  titulo={imovel.titulo}
                />
              </div>
            )}
          </div>

          {/* ── Coluna lateral ── */}
          <aside className="detalhe__lateral">
            <div className="caixa">
              <span style={{ color: '#888', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {imovel.finalidade === 'aluguel' ? 'Aluguel' : 'Valor'}
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FFD65A', margin: '4px 0 20px' }}>
                {formatarMoeda(imovel.valor)}
                {imovel.finalidade === 'aluguel' && imovel.valor ? (
                  <span style={{ fontSize: '1rem', color: '#888', fontWeight: 500 }}> /mês</span>
                ) : null}
              </div>
              <BotoesContato imovel={imovel} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
