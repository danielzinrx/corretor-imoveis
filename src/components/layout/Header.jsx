/* =============================================
   COMPONENTE — Header
   Navegação principal com logo e links
   ============================================= */

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SITE } from '../../config/site.js';
import { linkWhatsappGeral } from '../../utils/whatsapp.js';

export default function Header() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuAberto,  setMenuAberto]  = useState(false);
  const location = useLocation();

  // Fecha o menu ao navegar
  useEffect(() => { setMenuAberto(false); }, [location]);

  // Sombra ao scrollar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/',        label: 'Início' },
    { to: '/imoveis', label: 'Imóveis' },
    { to: '/sobre',   label: 'Corretores' },
    { to: '/contato', label: 'Contato' },
  ];

  return (
    <header style={{
      position:        'fixed',
      top:             0,
      left:            0,
      right:           0,
      zIndex:          200,
      height:          'var(--header-altura, 72px)',
      display:         'flex',
      alignItems:      'center',
      padding:         '0 24px',
      transition:      'all 0.3s ease',
      background:      scrolled ? 'rgba(0,0,0,0.95)' : 'transparent',
      backdropFilter:  scrolled ? 'blur(16px)' : 'none',
      borderBottom:    scrolled ? '1px solid rgba(217,169,63,0.1)' : 'none',
      boxShadow:       scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
    }}>
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        width:          '100%',
        maxWidth:       '1280px',
        margin:         '0 auto',
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img
            src="/img/logo.png"
            alt={SITE.nome}
            style={{ height: '44px', width: 'auto' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <span style={{
            fontSize:   '1.125rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #B07A1E, #FFD65A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}>
            {SITE.nome}
          </span>
        </Link>

        {/* ── Nav Desktop ── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          className="nav-desktop"
        >
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              style={({ isActive }) => ({
                padding:       '8px 16px',
                borderRadius:  '9999px',
                fontSize:      '0.9375rem',
                fontWeight:    '500',
                textDecoration:'none',
                transition:    'all 0.2s ease',
                color:         isActive ? '#FFD65A' : '#c8c8c8',
                background:    isActive ? 'rgba(217,169,63,0.1)' : 'transparent',
                border:        isActive ? '1px solid rgba(217,169,63,0.2)' : '1px solid transparent',
              })}
            >
              {l.label}
            </NavLink>
          ))}

          {/* Botão WhatsApp */}
          <a
            href={linkWhatsappGeral()}
            target="_blank"
            rel="noopener noreferrer"
            id="header-whatsapp-btn"
            style={{
              marginLeft:     '12px',
              display:        'flex',
              alignItems:     'center',
              gap:            '8px',
              padding:        '10px 20px',
              borderRadius:   '9999px',
              background:     'linear-gradient(135deg, #B07A1E, #FFD65A)',
              color:          '#000000',
              fontWeight:     '600',
              fontSize:       '0.875rem',
              textDecoration: 'none',
              transition:     'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform  = 'translateY(-2px)';
              e.currentTarget.style.boxShadow  = '0 8px 24px rgba(217,169,63,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform  = '';
              e.currentTarget.style.boxShadow  = '';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>
        </nav>

        {/* ── Botão hamburguer mobile ── */}
        <button
          id="header-menu-btn"
          onClick={() => setMenuAberto(a => !a)}
          aria-label="Abrir menu"
          style={{
            display:     'none',
            background:  'rgba(217,169,63,0.1)',
            border:      '1px solid rgba(217,169,63,0.2)',
            borderRadius:'8px',
            padding:     '10px',
            cursor:      'pointer',
            color:       '#FFD65A',
          }}
        >
          {menuAberto
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          }
        </button>
      </div>

      {/* ── Menu Mobile ── */}
      {menuAberto && (
        <div style={{
          position:  'absolute',
          top:       '72px',
          left:      0,
          right:     0,
          background:'rgba(0,0,0,0.97)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(217,169,63,0.1)',
          padding:   '16px 24px',
          display:   'flex',
          flexDirection: 'column',
          gap:       '4px',
        }}>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              style={({ isActive }) => ({
                padding:       '12px 16px',
                borderRadius:  '8px',
                fontSize:      '1rem',
                fontWeight:    '500',
                textDecoration:'none',
                color:         isActive ? '#FFD65A' : '#c8c8c8',
                background:    isActive ? 'rgba(217,169,63,0.1)' : 'transparent',
              })}
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={linkWhatsappGeral()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop:      '8px',
              padding:        '12px 16px',
              borderRadius:   '9999px',
              background:     'linear-gradient(135deg, #B07A1E, #FFD65A)',
              color:          '#000',
              fontWeight:     '700',
              textDecoration: 'none',
              textAlign:      'center',
            }}
          >
            💬 Fale no WhatsApp
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          #header-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
