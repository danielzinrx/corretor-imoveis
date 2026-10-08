/* =============================================
   COMPONENTE — CardImovel
   Card do imóvel no catálogo
   ============================================= */

import React from 'react';
import { Link } from 'react-router-dom';
import { formatarMoeda, formatarArea, truncar } from '../../utils/formatadores.js';
import { TIPOS_IMOVEL } from '../../config/opcoes.js';
import { linkWhatsappImovel } from '../../utils/whatsapp.js';
import { SITE } from '../../config/site.js';

function badgeStatus(status) {
  const mapa = {
    disponivel: { bg: 'rgba(34,197,94,0.15)',  cor: '#4ade80', texto: 'Disponível' },
    vendido:    { bg: 'rgba(239,68,68,0.15)',   cor: '#f87171', texto: 'Vendido'    },
    reservado:  { bg: 'rgba(234,179,8,0.15)',   cor: '#facc15', texto: 'Reservado'  },
  };
  return mapa[status] ?? mapa.disponivel;
}

export default function CardImovel({ imovel }) {
  const fotoUrl = imovel.fotos?.[0]?.url || imovel.fotos?.[0] || null;
  const tipo    = TIPOS_IMOVEL.find(t => t.valor === imovel.tipo);
  const bs      = badgeStatus(imovel.status);

  return (
    <article style={{
      position:     'relative',
      background:   '#111111',
      border:       '1px solid rgba(217,169,63,0.1)',
      borderRadius: '16px',
      overflow:     'hidden',
      transition:   'all 0.35s ease',
      display:      'flex',
      flexDirection:'column',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform   = 'translateY(-6px)';
      e.currentTarget.style.borderColor = 'rgba(217,169,63,0.35)';
      e.currentTarget.style.boxShadow   = '0 20px 60px rgba(0,0,0,0.5)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform   = '';
      e.currentTarget.style.borderColor = 'rgba(217,169,63,0.1)';
      e.currentTarget.style.boxShadow   = '';
    }}
    >
      {/* ── Imagem ── */}
      <Link to={`/imoveis/${imovel.id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ paddingBottom: '65%', position: 'relative', background: '#1a1a1a' }}>
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={imovel.titulo}
              loading="lazy"
              style={{
                position:   'absolute',
                inset:      0,
                width:      '100%',
                height:     '100%',
                objectFit:  'cover',
                transition: 'transform 0.5s ease',
              }}
              onMouseEnter={e => { e.target.style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { e.target.style.transform = ''; }}
            />
          ) : (
            <div style={{
              position:       'absolute',
              inset:          0,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '8px',
              color:          '#333',
            }}>
              <span style={{ fontSize: '2.5rem' }}>{tipo?.icone ?? '🏠'}</span>
              <span style={{ fontSize: '0.75rem' }}>Sem foto</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)',
          }} />
        </div>

        {/* Badges sobre a imagem */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          display:  'flex', gap: '6px', flexWrap: 'wrap',
        }}>
          {tipo && (
            <span style={{
              padding:      '4px 10px',
              borderRadius: '9999px',
              fontSize:     '0.7rem',
              fontWeight:   '700',
              background:   'rgba(0,0,0,0.75)',
              color:        '#FFD65A',
              backdropFilter: 'blur(8px)',
              border:       '1px solid rgba(217,169,63,0.3)',
              letterSpacing:'0.04em',
              textTransform:'uppercase',
            }}>
              {tipo.icone} {tipo.label}
            </span>
          )}
          <span style={{
            padding:      '4px 10px',
            borderRadius: '9999px',
            fontSize:     '0.7rem',
            fontWeight:   '700',
            background:   bs.bg,
            color:        bs.cor,
            backdropFilter: 'blur(8px)',
            letterSpacing:'0.04em',
            textTransform:'uppercase',
          }}>
            {bs.texto}
          </span>
        </div>

        {imovel.destaque && (
          <div style={{
            position:   'absolute',
            top:        '12px',
            right:      '12px',
            padding:    '4px 10px',
            borderRadius:'9999px',
            fontSize:   '0.7rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #B07A1E, #FFD65A)',
            color:      '#000',
            letterSpacing:'0.04em',
            textTransform:'uppercase',
          }}>
            ⭐ Destaque
          </div>
        )}
      </Link>

      {/* ── Conteúdo ── */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>

        {/* Preço */}
        <div>
          <div style={{
            fontSize:   'clamp(1.25rem, 2.5vw, 1.5rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #D9A93F, #FFD65A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}>
            {formatarMoeda(imovel.valor)}
          </div>
          {imovel.finalidade === 'aluguel' && (
            <span style={{ fontSize: '0.75rem', color: '#888' }}>/mês</span>
          )}
        </div>

        {/* Título */}
        <Link to={`/imoveis/${imovel.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize:   '1rem',
            fontWeight: '600',
            color:      '#ffffff',
            lineHeight: '1.4',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#D9A93F'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#fff'; }}
          >
            {imovel.titulo}
          </h3>
        </Link>

        {/* Localização */}
        {imovel.bairro && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ fontSize: '0.8125rem', color: '#888' }}>
              {imovel.bairro}
            </span>
          </div>
        )}

        {/* Stats */}
        <div style={{
          display:       'flex',
          gap:           '12px',
          flexWrap:      'wrap',
          paddingTop:    '12px',
          borderTop:     '1px solid rgba(255,255,255,0.06)',
        }}>
          {imovel.quartos > 0 && (
            <Stat icone="🛏" valor={`${imovel.quartos} ${imovel.quartos === 1 ? 'quarto' : 'quartos'}`} />
          )}
          {imovel.suites > 0 && (
            <Stat icone="🚿" valor={`${imovel.suites} ${imovel.suites === 1 ? 'suíte' : 'suítes'}`} />
          )}
          {imovel.vagas > 0 && (
            <Stat icone="🚗" valor={`${imovel.vagas} ${imovel.vagas === 1 ? 'vaga' : 'vagas'}`} />
          )}
          {imovel.areaUtil && (
            <Stat icone="📐" valor={formatarArea(imovel.areaUtil)} />
          )}
        </div>

        {/* Botão WhatsApp */}
        <a
          href={linkWhatsappImovel(imovel, SITE.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          id={`card-wpp-${imovel.id}`}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '8px',
            padding:        '11px',
            borderRadius:   '10px',
            background:     'rgba(37,211,102,0.08)',
            border:         '1px solid rgba(37,211,102,0.2)',
            color:          '#4ade80',
            fontSize:       '0.875rem',
            fontWeight:     '600',
            textDecoration: 'none',
            transition:     'all 0.2s ease',
            marginTop:      'auto',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(37,211,102,0.15)';
            e.currentTarget.style.borderColor= 'rgba(37,211,102,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(37,211,102,0.08)';
            e.currentTarget.style.borderColor= 'rgba(37,211,102,0.2)';
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Tenho interesse
        </a>
      </div>
    </article>
  );
}

function Stat({ icone, valor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '0.875rem' }}>{icone}</span>
      <span style={{ fontSize: '0.8125rem', color: '#c8c8c8', fontWeight: '500' }}>{valor}</span>
    </div>
  );
}
