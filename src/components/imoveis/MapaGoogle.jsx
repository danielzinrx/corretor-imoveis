/* =============================================
   COMPONENTE — MapaGoogle
   Localização completa com mapa embed, botões
   para Google Maps e Waze, e link para DF Imóveis
   ============================================= */

import React, { useState } from 'react';
import { CIDADES_DF } from '../../config/opcoes.js';
import { labelCidade } from '../../utils/formatadores.js';

/**
 * Constrói o termo de busca exato no estilo do DF Imóveis:
 *  "QN 5 Conjunto 19, Riacho Fundo, Brasília DF"
 */
function buildSearchTerm({ endereco, bairro, cidade, titulo }) {
  // Se o endereço já é igual ao bairro (comportamento do sincronizador), prefere o título
  const end = endereco && endereco !== bairro ? endereco : null;
  const bai = bairro || null;
  const cid = cidade ? labelCidade(cidade, CIDADES_DF) : null;
  const partes = [end, bai, cid, 'Brasília DF'].filter(Boolean);

  // Remove duplicatas mantendo a ordem
  const unicas = partes.filter((p, i, arr) => arr.indexOf(p) === i);
  if (unicas.length > 0) return unicas.join(', ');
  return titulo || 'Brasília, DF';
}

export default function MapaGoogle({ lat, lng, endereco, bairro, cidade, titulo, dfImoveisId, linkDFImoveis }) {
  const [iframeErro, setIframeErro] = useState(false);

  const temCoords = lat && lng &&
    !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng)) &&
    Number(lat) !== 0 && Number(lng) !== 0;

  const termoTexto = buildSearchTerm({ endereco, bairro, cidade, titulo });

  /* ── Links de Navegação ── */
  const linkGoogleMaps = temCoords
    ? `https://www.google.com/maps?q=${lat},${lng}&z=16`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(termoTexto)}`;

  const linkGoogleNav = temCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(termoTexto)}&travelmode=driving`;

  const linkWaze = temCoords
    ? `https://waze.com/ul?ll=${lat},${lng}&navigate=yes&zoom=17`
    : `https://waze.com/ul?q=${encodeURIComponent(termoTexto)}&navigate=yes`;

  /* ── Embed do Mapa ── */
  const iframeSrc = temCoords
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=pt-BR`
    : `https://maps.google.com/maps?q=${encodeURIComponent(termoTexto)}&z=15&output=embed&hl=pt-BR`;

  /* ── Texto de exibição do endereço ── */
  const enderecoExibicao = (() => {
    const partes = [];
    if (endereco && endereco !== bairro) partes.push(endereco);
    if (bairro) partes.push(bairro);
    if (cidade) partes.push(labelCidade(cidade, CIDADES_DF));
    if (partes.length === 0) return 'Distrito Federal';
    return partes.join(' — ');
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Card de Endereço e Ações ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        {/* Bloco de Endereço Detalhado */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: '1', minWidth: '220px' }}>
          <div style={{
            flexShrink: 0,
            width: '40px',
            height: '40px',
            background: 'rgba(217,169,63,0.12)',
            border: '1px solid rgba(217,169,63,0.25)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
          }}>
            📍
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <strong style={{ color: '#fff', fontSize: '0.9375rem', lineHeight: 1.4 }}>
              {enderecoExibicao}
            </strong>
            {cidade && (
              <span style={{ fontSize: '0.8125rem', color: '#888' }}>
                {labelCidade(cidade, CIDADES_DF)} · Distrito Federal
              </span>
            )}
            {temCoords && (
              <span style={{ fontSize: '0.75rem', color: '#555', fontFamily: 'monospace', marginTop: '2px' }}>
                {Number(lat).toFixed(6)}, {Number(lng).toFixed(6)}
              </span>
            )}
            {!temCoords && (
              <span style={{ fontSize: '0.75rem', color: '#555', fontStyle: 'italic', marginTop: '2px' }}>
                Localização por endereço (sem coordenadas exatas)
              </span>
            )}
          </div>
        </div>

        {/* Botões de Navegação */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>

          {/* Botão Google Maps — Ver Localização */}
          <a
            href={linkGoogleMaps}
            target="_blank"
            rel="noopener noreferrer"
            id="mapa-abrir-google-maps"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #1a73e8, #0d5ecc)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(26,115,232,0.3)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,115,232,0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(26,115,232,0.3)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Google Maps
          </a>

          {/* Botão Waze — Navegar */}
          <a
            href={linkWaze}
            target="_blank"
            rel="noopener noreferrer"
            id="mapa-abrir-waze"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #09c7f3, #00a5e0)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(9,199,243,0.3)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(9,199,243,0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(9,199,243,0.3)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M16 2C8.268 2 2 8.268 2 16c0 4.136 1.645 7.884 4.32 10.63l-.62 3.732 3.608-1.204C10.96 29.69 13.42 30 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.2c-2.44 0-4.73-.7-6.668-1.9l-.47-.29-2.14.714.626-2.234-.318-.49A11.173 11.173 0 014.8 16C4.8 9.81 9.81 4.8 16 4.8S27.2 9.81 27.2 16 22.19 27.2 16 27.2zm6.47-8.376c-.35-.18-2.088-1.03-2.41-1.146-.322-.114-.558-.172-.79.174-.236.348-.91 1.146-1.116 1.382-.208.23-.412.26-.762.084-.35-.174-1.476-.544-2.81-1.73-1.04-.925-1.74-2.066-1.944-2.416-.204-.35-.022-.54.154-.714.158-.156.35-.408.525-.61.174-.204.232-.348.348-.58.114-.232.058-.436-.028-.612-.088-.174-.79-1.906-1.086-2.612-.286-.686-.576-.594-.79-.604-.206-.01-.436-.012-.67-.012-.232 0-.61.088-.932.436-.32.348-1.222 1.194-1.222 2.91 0 1.72 1.25 3.38 1.422 3.61.174.232 2.46 3.754 5.962 5.264.834.36 1.484.574 1.99.736.836.264 1.598.226 2.2.138.67-.1 2.06-.843 2.352-1.658.288-.816.288-1.514.204-1.66-.088-.148-.32-.232-.67-.41z"/>
            </svg>
            Ir pelo Waze
          </a>

          {/* Botão Traçar Rota (Google Maps) */}
          <a
            href={linkGoogleNav}
            target="_blank"
            rel="noopener noreferrer"
            id="mapa-tracar-rota"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '9px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#ccc',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = '#ccc';
            }}
          >
            🧭 Traçar Rota
          </a>

        </div>
      </div>

      {/* ── Iframe do Mapa ── */}
      {!iframeErro ? (
        <div style={{
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid rgba(217,169,63,0.15)',
          height: '320px',
          position: 'relative',
          background: '#0a0a0a',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <iframe
            title={`Mapa: ${titulo || enderecoExibicao}`}
            src={iframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => setIframeErro(true)}
          />
        </div>
      ) : (
        /* Fallback quando o iframe bloqueia */
        <a
          href={linkGoogleMaps}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            height: '200px',
            borderRadius: '14px',
            background: 'rgba(217,169,63,0.06)',
            border: '1px dashed rgba(217,169,63,0.3)',
            color: '#D9A93F',
            textDecoration: 'none',
            fontSize: '0.9375rem',
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: '2rem' }}>🗺️</span>
          Clique aqui para ver no Google Maps →
        </a>
      )}

      {/* ── Rodapé com links extras ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ fontSize: '0.75rem', color: '#555' }}>
          Termo de busca: <em style={{ color: '#666' }}>{termoTexto}</em>
        </span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {linkDFImoveis && (
            <a
              href={linkDFImoveis}
              target="_blank"
              rel="noopener noreferrer"
              id="mapa-ver-dfimoveis"
              style={{
                fontSize: '0.75rem',
                color: '#D9A93F',
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Ver anúncio no DF Imóveis →
            </a>
          )}
        </div>
      </div>

    </div>
  );
}
