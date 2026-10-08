/* =============================================
   PÁGINA — Home
   ============================================= */

import React from 'react';
import Hero3D          from '../components/home/Hero3D.jsx';
import FraseMotivacao  from '../components/home/FraseMotivacao.jsx';
import CategoriasRapidas from '../components/home/CategoriasRapidas.jsx';
import ImoveisDestaque from '../components/home/ImoveisDestaque.jsx';
import { CORRETORES }  from '../config/site.js';
import CardCorretor    from '../components/home/CardCorretor.jsx';

export default function Home() {
  return (
    <main>
      {/* 1. Hero com efeito 3D */}
      <Hero3D />

      {/* 2. Frase motivacional */}
      <FraseMotivacao />

      {/* 3. Categorias rápidas */}
      <CategoriasRapidas />

      {/* 4. Imóveis em destaque */}
      <ImoveisDestaque />

      {/* 5. Seção dos corretores */}
      <section style={{
        padding:    '80px 24px',
        background: '#000000',
        borderTop:  '1px solid rgba(217,169,63,0.08)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
              color:       '#fff',
              marginBottom:'12px',
            }}>
              Nossa <span style={{
                background: 'linear-gradient(135deg, #B07A1E, #FFD65A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>Equipe</span>
            </h2>
            <p style={{ color: '#888', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              Profissionais credenciados e experientes no mercado imobiliário do Distrito Federal
            </p>
          </div>

          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap:                 '24px',
            maxWidth:            '800px',
            margin:              '0 auto',
          }}>
            {CORRETORES.map(c => (
              <CardCorretor key={c.id} corretor={c} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Final */}
      <section style={{
        padding:    '80px 24px',
        background: '#0a0a0a',
        textAlign:  'center',
        borderTop:  '1px solid rgba(217,169,63,0.08)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily:  '"Playfair Display", serif',
            fontSize:    'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight:  '700',
            color:       '#fff',
            marginBottom:'16px',
          }}>
            Pronto para encontrar o imóvel <span style={{
              background: 'linear-gradient(135deg, #B07A1E, #FFD65A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>ideal?</span>
          </h2>
          <p style={{ color: '#888', fontSize: '1.0625rem', marginBottom: '36px', lineHeight: '1.7' }}>
            Entre em contato agora mesmo e deixe nossos especialistas te guiarem até a melhor escolha.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/imoveis"
              id="cta-ver-imoveis"
              style={{
                padding:        '14px 32px',
                borderRadius:   '9999px',
                background:     'linear-gradient(135deg, #B07A1E, #FFD65A)',
                color:          '#000',
                fontWeight:     '700',
                fontSize:       '1rem',
                textDecoration: 'none',
                transition:     'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform  = 'translateY(-2px)';
                e.currentTarget.style.boxShadow  = '0 8px 30px rgba(217,169,63,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform  = '';
                e.currentTarget.style.boxShadow  = '';
              }}
            >
              🏠 Ver Imóveis
            </a>
            <a
              href="/contato"
              id="cta-contato"
              style={{
                padding:        '14px 32px',
                borderRadius:   '9999px',
                background:     'transparent',
                color:          '#D9A93F',
                border:         '1.5px solid rgba(217,169,63,0.4)',
                fontWeight:     '600',
                fontSize:       '1rem',
                textDecoration: 'none',
                transition:     'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background   = 'rgba(217,169,63,0.08)';
                e.currentTarget.style.borderColor  = '#D9A93F';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background   = 'transparent';
                e.currentTarget.style.borderColor  = 'rgba(217,169,63,0.4)';
              }}
            >
              📞 Falar Conosco
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
