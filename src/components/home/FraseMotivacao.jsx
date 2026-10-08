/* =============================================
   COMPONENTE — FraseMotivacao
   Banner com frase inspiracional
   ============================================= */

import React from 'react';
import { SITE } from '../../config/site.js';

export default function FraseMotivacao() {
  return (
    <section style={{
      padding:    '64px 24px',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 100%)',
      borderTop:    '1px solid rgba(217,169,63,0.08)',
      borderBottom: '1px solid rgba(217,169,63,0.08)',
      textAlign:  'center',
      position:   'relative',
      overflow:   'hidden',
    }}>
      {/* Decoração de fundo */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(217,169,63,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        {/* Aspas decorativas */}
        <div style={{
          fontSize:   '80px',
          lineHeight: '0.7',
          background: 'linear-gradient(135deg, #B07A1E, #FFD65A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          backgroundClip:       'text',
          marginBottom:         '16px',
          fontFamily:           '"Playfair Display", serif',
        }}>
          "
        </div>

        <blockquote style={{
          fontFamily:  '"Playfair Display", serif',
          fontSize:    'clamp(1.25rem, 3vw, 2rem)',
          fontStyle:   'italic',
          fontWeight:  '600',
          lineHeight:  '1.5',
          color:       '#ffffff',
          marginBottom:'24px',
        }}>
          {SITE.slogan}
        </blockquote>

        <div style={{
          width:        '40px',
          height:       '2px',
          background:   'linear-gradient(135deg, #B07A1E, #FFD65A)',
          margin:       '0 auto 16px',
          borderRadius: '9999px',
        }} />

        <p style={{
          fontSize:      '0.875rem',
          color:         '#D9A93F',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight:    '600',
        }}>
          {SITE.nome}
        </p>
      </div>
    </section>
  );
}
