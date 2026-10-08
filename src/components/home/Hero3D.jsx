/* =============================================
   COMPONENTE — Hero3D
   Seção principal com efeito parallax 3D
   ============================================= */

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/hero3d.css';
import { SITE, CORRETORES } from '../../config/site.js';
import { linkWhatsappGeral } from '../../utils/whatsapp.js';
import Botao from '../ui/Botao.jsx';

export default function Hero3D() {
  const imgRef = useRef(null);

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

  return (
    <section className="hero" aria-label="Apresentação">

      {/* ── Cena 3D com foto ── */}
      <div className="hero__cena">
        <div className="hero__imagem-wrap" ref={imgRef}>
          <img
            className="hero__imagem"
            src="/img/hero-casa.jpg"
            alt="Casa de alto padrão"
            loading="eager"
          />
        </div>
        <div className="hero__overlay" />
        <div className="hero__overlay-dourado" />
      </div>

      {/* ── Partículas decorativas ── */}
      <div className="hero__particula hero__particula--1" />
      <div className="hero__particula hero__particula--2" />

      {/* ── Conteúdo ── */}
      <div className="hero__conteudo">

        {/* Badge */}
        <div className="hero__badge">
          <span className="hero__badge-ponto" />
          Corretor Credenciado · CRECI-DF
        </div>

        {/* Título */}
        <h1 className="hero__titulo">
          Encontre o imóvel
          <span className="hero__titulo-destaque">dos seus sonhos</span>
        </h1>

        {/* Frase motivacional */}
        <p className="hero__frase">
          <em>"{SITE.slogan}"</em>
          <br />
          <span style={{ fontSize: '0.9em', color: '#666', fontStyle: 'normal', marginTop: '6px', display: 'block' }}>
            Especialistas no mercado imobiliário do Distrito Federal
          </span>
        </p>

        {/* Botões */}
        <div className="hero__botoes">
          <Botao
            variante="primario"
            tamanho="lg"
            href="/imoveis"
            icone="🏠"
            id="hero-ver-imoveis"
          >
            Ver Imóveis
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
