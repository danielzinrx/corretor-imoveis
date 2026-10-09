/* =============================================
   COMPONENTE — BotoesContato
   WhatsApp + Instagram + E-mail + DF Imóveis
   ============================================= */

import React, { useState } from 'react';
import { SITE, CORRETORES } from '../../config/site.js';
import { linkWhatsappImovel, linkInstagram, linkEmail } from '../../utils/whatsapp.js';

export default function BotoesContato({ imovel }) {
  const [corretorAtivoId, setCorretorAtivoId] = useState(
    imovel?.corretorId && CORRETORES.some(c => c.id === imovel.corretorId)
      ? imovel.corretorId
      : CORRETORES[0].id
  );

  const corretor = CORRETORES.find(c => c.id === corretorAtivoId) ?? CORRETORES[0];
  const numero   = corretor?.whatsapp ?? SITE.whatsapp;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Seletor de Corretor Responsável */}
      <div>
        <span style={{ fontSize: '0.8125rem', color: '#888', display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Escolha o corretor para atendimento:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {CORRETORES.map(c => {
            const ativo = c.id === corretorAtivoId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCorretorAtivoId(c.id)}
                style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '8px',
                  padding:       '8px 10px',
                  borderRadius:  '10px',
                  background:    ativo ? 'rgba(217,169,63,0.15)' : 'rgba(255,255,255,0.03)',
                  border:        `1.5px solid ${ativo ? '#D9A93F' : 'rgba(255,255,255,0.1)'}`,
                  color:         ativo ? '#FFD65A' : '#ccc',
                  cursor:        'pointer',
                  textAlign:     'left',
                  transition:    'all 0.2s ease',
                  fontSize:      '0.8125rem',
                }}
              >
                <img
                  src={c.foto}
                  alt={c.nome}
                  style={{
                    width:        '32px',
                    height:       '32px',
                    borderRadius: '50%',
                    objectFit:    'cover',
                    flexShrink:   0,
                  }}
                />
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <span style={{ display: 'block', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {c.nome.split(' ')[0]}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.6875rem', color: '#D9A93F' }}>
                    {c.creci}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* WhatsApp — destaque */}
      <a
        href={linkWhatsappImovel(imovel, numero)}
        target="_blank"
        rel="noopener noreferrer"
        id="contato-whatsapp"
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '10px',
          padding:        '14px 20px',
          borderRadius:   '12px',
          background:     'linear-gradient(135deg, #25D366, #128C7E)',
          color:          '#fff',
          fontWeight:     '700',
          fontSize:       '1rem',
          textDecoration: 'none',
          boxShadow:      '0 4px 20px rgba(37,211,102,0.3)',
          transition:     'all 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform  = 'translateY(-2px)';
          e.currentTarget.style.boxShadow  = '0 8px 30px rgba(37,211,102,0.45)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform  = '';
          e.currentTarget.style.boxShadow  = '0 4px 20px rgba(37,211,102,0.3)';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        Falar com {corretor.nome.split(' ')[0]} no WhatsApp
      </a>

      {/* Grid botões secundários */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <a
          href={linkEmail(corretor?.email ?? SITE.email, imovel)}
          id="contato-email"
          style={btnSecundario}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
          </svg>
          E-mail
        </a>
        <a
          href={linkInstagram(corretor?.instagram ?? SITE.instagram)}
          target="_blank"
          rel="noopener noreferrer"
          id="contato-instagram"
          style={btnSecundario}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
          Instagram
        </a>
      </div>

      {/* Link DF Imóveis */}
      {corretor?.dfImoveis && (
        <a
          href={corretor.dfImoveis}
          target="_blank"
          rel="noopener noreferrer"
          id="contato-dfimoveis"
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '8px',
            padding:        '11px',
            borderRadius:   '10px',
            background:     'rgba(255,255,255,0.03)',
            border:         '1px solid rgba(255,255,255,0.08)',
            color:          '#888',
            fontSize:       '0.875rem',
            fontWeight:     '500',
            textDecoration: 'none',
            transition:     'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color       = '#c8c8c8';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color       = '#888';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          🏢 Ver perfil no DF Imóveis
        </a>
      )}

      {/* Corretor responsável */}
      {corretor && (
        <div style={{
          padding:      '12px',
          background:   'rgba(217,169,63,0.04)',
          border:       '1px solid rgba(217,169,63,0.1)',
          borderRadius: '10px',
          marginTop:    '4px',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Corretor responsável</p>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff' }}>{corretor.nome}</p>
          <p style={{ fontSize: '0.75rem', color: '#D9A93F' }}>{corretor.creci}</p>
        </div>
      )}
    </div>
  );
}

const btnSecundario = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  gap:            '7px',
  padding:        '11px',
  borderRadius:   '10px',
  background:     'rgba(217,169,63,0.06)',
  border:         '1px solid rgba(217,169,63,0.18)',
  color:          '#D9A93F',
  fontSize:       '0.875rem',
  fontWeight:     '600',
  textDecoration: 'none',
  transition:     'all 0.2s ease',
};
