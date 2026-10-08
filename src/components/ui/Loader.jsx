/* =============================================
   COMPONENTE — Loader
   Indicador de carregamento animado
   ============================================= */

import React from 'react';

export default function Loader({ texto = 'Carregando...', tamanho = 'md' }) {
  const tamanhos = { sm: 24, md: 40, lg: 56 };
  const px = tamanhos[tamanho] ?? 40;

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '16px',
      padding:        '40px',
    }}>
      {/* Anel dourado girando */}
      <div style={{
        width:        `${px}px`,
        height:       `${px}px`,
        border:       `3px solid rgba(217,169,63,0.15)`,
        borderTop:    `3px solid #D9A93F`,
        borderRadius: '50%',
        animation:    'rotacionar 0.8s linear infinite',
      }} />
      {texto && (
        <span style={{
          fontSize:    '0.875rem',
          color:       '#888888',
          letterSpacing: '0.04em',
        }}>
          {texto}
        </span>
      )}
    </div>
  );
}
