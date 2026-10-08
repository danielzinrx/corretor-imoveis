/* =============================================
   COMPONENTE — ImoveisDestaque
   Grid de imóveis em destaque na Home
   ============================================= */

import React from 'react';
import { Link } from 'react-router-dom';
import { useImoveisDestaque } from '../../hooks/useImoveis.js';
import CardImovel from '../imoveis/CardImovel.jsx';
import Loader from '../ui/Loader.jsx';

export default function ImoveisDestaque() {
  const { imoveis, carregando, erro } = useImoveisDestaque(6);

  return (
    <section style={{ padding: '80px 24px', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
          <div>
            <div style={{
              width: '40px', height: '3px',
              background: 'linear-gradient(135deg, #B07A1E, #FFD65A)',
              borderRadius: '9999px', marginBottom: '16px',
            }} />
            <h2 style={{
              fontFamily:  '"Playfair Display", serif',
              fontSize:    'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight:  '700',
              color:       '#fff',
              marginBottom:'8px',
            }}>
              Imóveis em <span style={{
                background: 'linear-gradient(135deg, #B07A1E, #FFD65A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>Destaque</span>
            </h2>
            <p style={{ color: '#888', fontSize: '0.9375rem' }}>
              Seleção especial das melhores oportunidades disponíveis
            </p>
          </div>
          <Link
            to="/imoveis"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '6px',
              padding:        '10px 20px',
              borderRadius:   '9999px',
              border:         '1px solid rgba(217,169,63,0.3)',
              color:          '#D9A93F',
              fontSize:       '0.875rem',
              fontWeight:     '600',
              textDecoration: 'none',
              transition:     'all 0.2s ease',
              whiteSpace:     'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background   = 'rgba(217,169,63,0.08)';
              e.currentTarget.style.borderColor  = '#D9A93F';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background   = 'transparent';
              e.currentTarget.style.borderColor  = 'rgba(217,169,63,0.3)';
            }}
          >
            Ver todos →
          </Link>
        </div>

        {/* Conteúdo */}
        {carregando ? (
          <Loader texto="Carregando imóveis..." />
        ) : erro ? (
          <p style={{ color: '#f87171', textAlign: 'center', padding: '40px' }}>{erro}</p>
        ) : imoveis.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
            Nenhum imóvel em destaque no momento.
          </p>
        ) : (
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap:                 '24px',
          }}>
            {imoveis.map((im, idx) => (
              <div key={im.id} style={{ animation: `fadeIn 0.5s ease ${idx * 0.08}s both` }}>
                <CardImovel imovel={im} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
