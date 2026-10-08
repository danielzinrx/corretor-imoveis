/* =============================================
   COMPONENTE — GaleriaFotos
   Carrossel de fotos com lightbox
   ============================================= */

import React, { useState } from 'react';

export default function GaleriaFotos({ fotos = [], titulo = '' }) {
  const [atual,     setAtual]     = useState(0);
  const [lightbox,  setLightbox]  = useState(false);

  // Normaliza: aceita [{url}, url (string)]
  const imgs = fotos.map(f => (typeof f === 'string' ? f : f?.url)).filter(Boolean);

  if (imgs.length === 0) return (
    <div style={{
      height:         '360px',
      background:     '#111',
      borderRadius:   '16px',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '12px',
      color:          '#333',
      border:         '1px solid rgba(217,169,63,0.08)',
    }}>
      <span style={{ fontSize: '3rem' }}>📷</span>
      <span style={{ fontSize: '0.9rem' }}>Sem fotos disponíveis</span>
    </div>
  );

  const anterior = () => setAtual(a => (a - 1 + imgs.length) % imgs.length);
  const proximo  = () => setAtual(a => (a + 1) % imgs.length);

  const handleKey = (e) => {
    if (e.key === 'ArrowLeft')  anterior();
    if (e.key === 'ArrowRight') proximo();
    if (e.key === 'Escape')     setLightbox(false);
  };

  return (
    <>
      {/* ── Carrossel principal ── */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative', userSelect: 'none' }}>
        {/* Imagem principal */}
        <div
          style={{ position: 'relative', paddingBottom: '62%', background: '#111', cursor: 'zoom-in' }}
          onClick={() => setLightbox(true)}
        >
          <img
            src={imgs[atual]}
            alt={`${titulo} — foto ${atual + 1}`}
            loading="lazy"
            style={{
              position:   'absolute',
              inset:      0,
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              transition: 'opacity 0.3s ease',
            }}
          />
          {/* Overlay hover */}
          <div style={{
            position:       'absolute',
            inset:          0,
            background:     'rgba(0,0,0,0)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            transition:     'background 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
            </svg>
          </div>

          {/* Contador */}
          <div style={{
            position:     'absolute',
            bottom:       '12px',
            right:        '12px',
            padding:      '4px 10px',
            background:   'rgba(0,0,0,0.7)',
            borderRadius: '9999px',
            fontSize:     '0.75rem',
            color:        '#fff',
            backdropFilter: 'blur(4px)',
          }}>
            {atual + 1} / {imgs.length}
          </div>
        </div>

        {/* Botões anterior / próximo */}
        {imgs.length > 1 && (
          <>
            <NavBtn lado="left"  onClick={anterior} />
            <NavBtn lado="right" onClick={proximo}  />
          </>
        )}
      </div>

      {/* ── Miniaturas ── */}
      {imgs.length > 1 && (
        <div style={{
          display:        'flex',
          gap:            '8px',
          overflowX:      'auto',
          paddingBottom:  '4px',
          marginTop:      '12px',
        }}>
          {imgs.map((src, i) => (
            <button
              key={i}
              onClick={() => setAtual(i)}
              style={{
                flexShrink:   0,
                width:        '72px',
                height:       '54px',
                borderRadius: '8px',
                overflow:     'hidden',
                border:       i === atual ? '2px solid #D9A93F' : '2px solid transparent',
                padding:      0,
                cursor:       'pointer',
                transition:   'border-color 0.2s ease',
                background:   '#111',
              }}
            >
              <img src={src} alt={`miniatura ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galeria ampliada"
          tabIndex={0}
          onKeyDown={handleKey}
          onClick={() => setLightbox(false)}
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         400,
            background:     'rgba(0,0,0,0.95)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '20px',
          }}
          ref={el => el?.focus()}
        >
          <img
            src={imgs[atual]}
            alt={`${titulo} — foto ${atual + 1}`}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth:  '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
            }}
          />
          <button
            onClick={() => setLightbox(false)}
            style={{
              position:       'absolute',
              top:            '20px',
              right:          '20px',
              background:     'rgba(255,255,255,0.1)',
              border:         'none',
              borderRadius:   '50%',
              width:          '44px',
              height:         '44px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         'pointer',
              color:          '#fff',
              fontSize:       '20px',
            }}
          >×</button>
          {imgs.length > 1 && (
            <>
              <NavBtn lado="left"  onClick={e => { e.stopPropagation(); anterior(); }} lightbox />
              <NavBtn lado="right" onClick={e => { e.stopPropagation(); proximo();  }} lightbox />
            </>
          )}
        </div>
      )}
    </>
  );
}

function NavBtn({ lado, onClick, lightbox = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        position:       'absolute',
        top:            '50%',
        [lado]:         lightbox ? '20px' : '12px',
        transform:      'translateY(-50%)',
        background:     'rgba(0,0,0,0.65)',
        border:         '1px solid rgba(255,255,255,0.1)',
        borderRadius:   '50%',
        width:          '40px',
        height:         '40px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        cursor:         'pointer',
        color:          '#fff',
        transition:     'all 0.2s ease',
        backdropFilter: 'blur(4px)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(217,169,63,0.5)';
        e.currentTarget.style.borderColor = '#D9A93F';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(0,0,0,0.65)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      }}
    >
      {lado === 'left'
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      }
    </button>
  );
}
