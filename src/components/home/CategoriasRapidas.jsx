/* =============================================
   COMPONENTE — CategoriasRapidas
   Atalhos para tipos de imóvel na Home
   ============================================= */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TIPOS_IMOVEL } from '../../config/opcoes.js';

export default function CategoriasRapidas() {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '80px 24px', background: '#000000' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{
            width: '40px', height: '3px',
            background: 'linear-gradient(135deg, #B07A1E, #FFD65A)',
            borderRadius: '9999px', margin: '0 auto 16px',
          }} />
          <h2 style={{
            fontFamily:  '"Playfair Display", serif',
            fontSize:    'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight:  '700',
            color:       '#ffffff',
            marginBottom:'12px',
          }}>
            O que você está <span style={{
              background: 'linear-gradient(135deg, #B07A1E, #FFD65A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>procurando?</span>
          </h2>
          <p style={{ color: '#888', fontSize: '1rem' }}>
            Escolha uma categoria e veja todos os imóveis disponíveis
          </p>
        </div>

        {/* Grid de categorias */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap:                 '16px',
        }}>
          {TIPOS_IMOVEL.map((tipo, idx) => (
            <button
              key={tipo.valor}
              id={`categoria-${tipo.valor}`}
              onClick={() => navigate(`/imoveis?tipo=${tipo.valor}`)}
              style={{
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                gap:            '12px',
                padding:        '32px 16px',
                background:     'rgba(255,255,255,0.02)',
                border:         '1px solid rgba(217,169,63,0.12)',
                borderRadius:   '16px',
                cursor:         'pointer',
                transition:     'all 0.3s ease',
                animation:      `fadeIn 0.5s ease ${idx * 0.1}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background   = 'rgba(217,169,63,0.06)';
                e.currentTarget.style.borderColor  = 'rgba(217,169,63,0.4)';
                e.currentTarget.style.transform    = 'translateY(-4px)';
                e.currentTarget.style.boxShadow    = '0 12px 40px rgba(217,169,63,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background   = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor  = 'rgba(217,169,63,0.12)';
                e.currentTarget.style.transform    = '';
                e.currentTarget.style.boxShadow    = '';
              }}
            >
              <span style={{ fontSize: '2.25rem' }}>{tipo.icone}</span>
              <span style={{
                fontSize:   '0.9375rem',
                fontWeight: '600',
                color:      '#ffffff',
                textAlign:  'center',
                lineHeight: '1.3',
              }}>
                {tipo.label}
              </span>
              <span style={{
                fontSize:      '0.75rem',
                color:         '#D9A93F',
                fontWeight:    '500',
                letterSpacing: '0.04em',
              }}>
                Ver imóveis →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
