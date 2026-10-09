import React, { useState, useEffect, useRef } from 'react';
import { linkWhatsappGeral } from '../../utils/whatsapp.js';
import { CORRETORES } from '../../config/site.js';

export default function BotaoWhatsappFlutuante() {
  const [visivel, setVisivel] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const containerRef = useRef(null);

  // Aparece após scroll
  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickFora = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position:       'fixed',
        bottom:         '28px',
        right:          '24px',
        zIndex:         300,
        opacity:        visivel ? 1 : 0,
        transform:      visivel ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)',
        pointerEvents:  visivel ? 'auto' : 'none',
        transition:     'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* ── Menu de seleção de corretor ── */}
      {menuAberto && (
        <div style={{
          position:     'absolute',
          bottom:       '70px',
          right:        '0',
          width:        '260px',
          background:   '#161616',
          border:       '1px solid rgba(217,169,63,0.3)',
          borderRadius: '18px',
          padding:      '14px',
          boxShadow:    '0 16px 40px rgba(0,0,0,0.7)',
          display:      'flex',
          flexDirection:'column',
          gap:          '10px',
          animation:    'aparecerFade 0.25s ease',
        }}>
          <p style={{
            fontSize:     '0.75rem',
            color:        '#888',
            fontWeight:   '600',
            textTransform:'uppercase',
            letterSpacing:'0.5px',
            margin:       '0 0 4px 4px',
          }}>
            Falar no WhatsApp com:
          </p>

          {CORRETORES.map(c => (
            <a
              key={c.id}
              href={linkWhatsappGeral(c.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuAberto(false)}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '12px',
                padding:        '10px 12px',
                borderRadius:   '12px',
                background:     'rgba(255,255,255,0.03)',
                border:         '1px solid rgba(255,255,255,0.06)',
                color:          '#fff',
                textDecoration: 'none',
                transition:     'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(37,211,102,0.12)';
                e.currentTarget.style.borderColor = 'rgba(37,211,102,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <img
                src={c.foto}
                alt={c.nome}
                style={{
                  width:        '38px',
                  height:       '38px',
                  borderRadius: '50%',
                  objectFit:    'cover',
                  border:       '2px solid #25D366',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontWeight: '700', fontSize: '0.875rem' }}>
                  {c.nome.split(' ')[0]}
                </span>
                <span style={{ display: 'block', fontSize: '0.6875rem', color: '#D9A93F' }}>
                  {c.creci}
                </span>
              </div>
              <span style={{ color: '#25D366', fontSize: '1rem' }}>💬</span>
            </a>
          ))}
        </div>
      )}

      {/* ── Botão Flutuante ── */}
      <button
        type="button"
        onClick={() => setMenuAberto(aberto => !aberto)}
        id="whatsapp-flutuante"
        title="Fale com os corretores no WhatsApp"
        aria-label="Fale conosco pelo WhatsApp"
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          '56px',
          height:         '56px',
          borderRadius:   '50%',
          background:     'linear-gradient(135deg, #25D366, #128C7E)',
          color:          '#fff',
          boxShadow:      '0 4px 24px rgba(37, 211, 102, 0.45)',
          transition:     'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          border:         'none',
          cursor:         'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.12) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 211, 102, 0.55)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(37, 211, 102, 0.45)';
        }}
      >
        {/* Pulse ring */}
        <span style={{
          position:     'absolute',
          inset:        '-4px',
          borderRadius: '50%',
          border:       '2px solid rgba(37,211,102,0.4)',
          animation:    'pulsoDourado 2s ease-in-out infinite',
        }} />

        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>
    </div>
  );
}

