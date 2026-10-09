/* =============================================
   COMPONENTE — MapaGoogle
   Mapa interativo com abertura direta no Google Maps
   ============================================= */

import React from 'react';

export default function MapaGoogle({ lat, lng, endereco, bairro, cidade, titulo }) {
  const temCoords = lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));
  const termoTexto = endereco || [bairro, cidade, 'Brasília, DF'].filter(Boolean).join(', ');

  if (!temCoords && !termoTexto) return null;

  // Link para abrir diretamente no app ou site do Google Maps
  const linkMaps = temCoords
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps?q=${encodeURIComponent(termoTexto)}`;

  // URL do embed responsivo
  const iframeSrc = temCoords
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(termoTexto)}&z=15&output=embed`;

  const textoExibicao = endereco || [bairro, cidade].filter(Boolean).join(' · ') || 'Localização no Distrito Federal';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Endereço e Botão */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem' }}>📍</span>
          <div>
            <strong style={{ display: 'block', color: '#fff', fontSize: '0.9375rem' }}>
              {textoExibicao}
            </strong>
            <span style={{ fontSize: '0.8125rem', color: '#888' }}>
              Clique abaixo para abrir a rota no Google Maps
            </span>
          </div>
        </div>

        <a
          href={linkMaps}
          target="_blank"
          rel="noopener noreferrer"
          id="mapa-abrir-externo"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '8px',
            padding:        '10px 18px',
            borderRadius:   '10px',
            background:     'linear-gradient(135deg, #B07A1E, #FFD65A)',
            color:          '#000',
            textDecoration: 'none',
            fontWeight:     '700',
            fontSize:       '0.875rem',
            boxShadow:      '0 4px 16px rgba(217,169,63,0.25)',
            transition:     'all 0.25s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 22px rgba(217,169,63,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(217,169,63,0.25)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Abrir no Google Maps →
        </a>
      </div>

      {/* Frame do Mapa Interativo */}
      <div style={{
        borderRadius:  '16px',
        overflow:      'hidden',
        border:        '1px solid rgba(217,169,63,0.2)',
        height:        '340px',
        position:      'relative',
        background:    '#111',
        boxShadow:     '0 8px 30px rgba(0,0,0,0.5)',
      }}>
        <iframe
          title={`Mapa de localização: ${titulo || textoExibicao}`}
          src={iframeSrc}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

