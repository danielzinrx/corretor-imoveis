/* =============================================
   COMPONENTE — Hero3D
   Seção principal com efeito parallax 3D
   ============================================= */

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/hero3d.css';
import { SITE, CORRETORES } from '../../config/site.js';
import { linkWhatsappGeral } from '../../utils/whatsapp.js';
import { buscarImovelPrioritario } from '../../services/imoveisService.js';
import Botao from '../ui/Botao.jsx';

const ID_PRIORITARIO_PADRAO = '0zmg51cZX08qnLUPMIaI';

export default function Hero3D() {
  const imgRef = useRef(null);
  const [imovelId, setImovelId] = useState(ID_PRIORITARIO_PADRAO);

  // Efeito parallax suave com mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imgRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth  - 0.5) * 6;
      const y = (e.clientY / innerHeight - 0.5) * 4;
      imgRef.current.style.transform = `rotateX(${4 - y}deg) rotateY(${x}deg) scale(1.08)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Busca dinâmica do ID do imóvel prioritário (evita quebrar se sincronizar ou recriar)
  useEffect(() => {
    let ativo = true;
    buscarImovelPrioritario().then((imovel) => {
      if (ativo && imovel?.id) {
        setImovelId(imovel.id);
      }
    });
    return () => { ativo = false; };
  }, []);

  const linkPrioritario = `/imoveis/${imovelId}`;

  return (
    <section className="hero" aria-label="Apresentação">

      {/* ── Cena 3D com foto real do imóvel prioritário ── */}
      <div className="hero__cena">
        <Link
          to={linkPrioritario}
          className="hero__imagem-wrap"
          ref={imgRef}
          title="Ver informações sobre este sobrado no Riacho Fundo I"
          style={{ display: 'block', cursor: 'pointer' }}
        >
          <img
            className="hero__imagem"
            src="/img/hero-casa.jpg"
            alt="Sobrado QN 5 Conjunto 19 — Riacho Fundo I"
            loading="eager"
          />
        </Link>
        <div className="hero__overlay" style={{ pointerEvents: 'none' }} />
        <div className="hero__overlay-dourado" style={{ pointerEvents: 'none' }} />
      </div>

      {/* ── Partículas decorativas ── */}
      <div className="hero__particula hero__particula--1" />
      <div className="hero__particula hero__particula--2" />

      {/* ── Conteúdo ── */}
      <div className="hero__conteudo">

        {/* Badge — Destaque Prioritário */}
        <Link
          to={linkPrioritario}
          className="hero__badge"
          style={{
            textDecoration: 'none',
            cursor:         'pointer',
            background:     'rgba(34,197,94,0.12)',
            borderColor:    'rgba(34,197,94,0.35)',
            color:          '#4ade80',
            maxWidth:       'fit-content',
            marginBottom:   '8px',
          }}
          title="Ver este sobrado no Riacho Fundo I"
        >
          <span className="hero__badge-ponto" style={{ background: '#22c55e' }} />
          🔥 Oportunidade Prioritária: Sobrado QN 5 Conjunto 19 · Riacho Fundo I (BAIXOU O VALOR!) →
        </Link>

        {/* Título */}
        <h1 className="hero__titulo">
          Encontre o imóvel
          <span className="hero__titulo-destaque">dos seus sonhos</span>
        </h1>

        {/* Frase motivacional */}
        <p className="hero__frase">
          <em>"{SITE.slogan}"</em>
          <br />
          <span style={{ fontSize: '0.95em', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.8)', fontStyle: 'normal', marginTop: '6px', display: 'block' }}>
            Atendimento personalizado no mercado imobiliário do Distrito Federal
          </span>
        </p>

        {/* Botões */}
        <div className="hero__botoes">
          <Botao
            variante="primario"
            tamanho="lg"
            href={linkPrioritario}
            icone="⚡"
            id="hero-ver-prioritario"
          >
            Ver Sobrado
          </Botao>
          <Botao
            variante="secundario"
            tamanho="lg"
            href="/imoveis"
            icone="🏠"
            id="hero-ver-imoveis"
          >
            Ver Todos os Imóveis
          </Botao>
          <Botao
            variante="secundario"
            tamanho="lg"
            href={linkWhatsappGeral()}
            target="_blank"
            rel="noopener noreferrer"
            icone="💬"
            id="hero-whatsapp"
          >
            Falar no WhatsApp
          </Botao>
        </div>

        {/* Corretores */}
        <div className="hero__corretores">
          {CORRETORES.map((corretor, idx) => (
            <React.Fragment key={corretor.id}>
              {idx > 0 && <div className="hero__corretor-divider" />}
              <div className="hero__corretor">
                {corretor.foto ? (
                  <img
                    src={corretor.foto}
                    alt={corretor.nome}
                    className="hero__corretor-avatar"
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="hero__corretor-avatar-placeholder"
                  style={{ display: corretor.foto ? 'none' : 'flex' }}
                >
                  {corretor.nome.charAt(0)}
                </div>
                <div className="hero__corretor-info">
                  <span className="hero__corretor-nome">{corretor.nome.split(' ')[0]}</span>
                  <span className="hero__corretor-creci">{corretor.creci}</span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-texto">Explorar</span>
        <div className="hero__scroll-linha" />
      </div>
    </section>
  );
}
