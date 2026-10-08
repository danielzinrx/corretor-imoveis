/* =============================================
   COMPONENTE — MapaGoogle
   Mapa incorporado via iframe (sem API key)
   Para usar a API JS, substitua o iframe pelo
   componente com @vis.gl/react-google-maps
   ============================================= */

import React from 'react';

/**
 * @param {number} lat
 * @param {number} lng
 * @param {string} endereco - texto do endereço para exibição
 * @param {string} titulo   - nome do imóvel
 */
export default function MapaGoogle({ lat, lng, endereco, titulo }) {
  if (!lat || !lng) return null;

  // Link do Google Maps para abertura externa
  const linkMaps = `https://www.google.com/maps?q=${lat},${lng}`;

  // URL do embed (sem key, usa coordenadas)
  const iframeSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9A93F" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{ fontSize: '0.875rem', color: '#c8c8c8' }}>{endereco || 'Ver no mapa'}</span>
        </div>
        <a
          href={linkMaps}
          target="_blank"
          rel="noopener noreferrer"
          id="mapa-abrir-externo"
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '4px',
            fontSize:       '0.8125rem',
            color:          '#D9A93F',
            textDecoration: 'none',
            fontWeight:     '500',
          }}
        >
          Abrir no Maps
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>

      {/* Mapa */}
      <div style={{
        borderRadius:  '12px',
        overflow:      'hidden',
        border:        '1px solid rgba(217,169,63,0.12)',
        height:        '300px',
        position:      'relative',
      }}>
        <iframe
          title={`Localização: ${titulo}`}
          src={iframeSrc}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.7)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
