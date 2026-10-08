/* =============================================
   COMPONENTE — CaracteristicasLista
   Lista de características com ícones
   ============================================= */

import React from 'react';
import { CARACTERISTICAS } from '../../config/opcoes.js';

export default function CaracteristicasLista({ caracteristicas = [] }) {
  if (!caracteristicas || caracteristicas.length === 0) return null;

  // Filtra apenas as que o imóvel possui
  const lista = CARACTERISTICAS.filter(c => caracteristicas.includes(c.valor));

  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap:                 '10px',
    }}>
      {lista.map(c => (
        <div
          key={c.valor}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '8px',
            padding:    '10px 14px',
            background: 'rgba(217,169,63,0.04)',
            border:     '1px solid rgba(217,169,63,0.1)',
            borderRadius:'10px',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>{c.icone}</span>
          <span style={{ fontSize: '0.8125rem', color: '#c8c8c8', fontWeight: '500' }}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
