/* =============================================
   COMPONENTE — Footer
   Rodapé completo com links e redes sociais
   ============================================= */

import React from 'react';
import { Link } from 'react-router-dom';
import { SITE, CORRETORES } from '../../config/site.js';
import { linkWhatsappGeral, linkInstagram, linkEmail } from '../../utils/whatsapp.js';

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer style={{
      background:   '#000000',
      borderTop:    '1px solid rgba(217,169,63,0.12)',
      padding:      '64px 24px 32px',
      marginTop:    'auto',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Grid Superior ── */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap:                 '48px',
          marginBottom:        '48px',
        }}>

          {/* Coluna 1 — Marca */}
          <div>
            <Link to="/">
              <img src="/img/logo.png" alt={SITE.nome}
                style={{ height: '50px', marginBottom: '16px' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </Link>
            <p style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.8, maxWidth: '260px' }}>
              {SITE.descricao}
            </p>
            {/* Redes sociais */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a href={linkInstagram()} target="_blank" rel="noopener noreferrer"
                id="footer-instagram"
                title="Instagram"
                style={socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href={linkWhatsappGeral()} target="_blank" rel="noopener noreferrer"
                id="footer-whatsapp"
                title="WhatsApp"
                style={socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a href={linkEmail()} id="footer-email" title="E-mail" style={socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Coluna 2 — Links rápidos */}
          <div>
            <h4 style={tituloCol}>Navegação</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/',        t: 'Início' },
                { to: '/imoveis', t: 'Catálogo de Imóveis' },
                { to: '/sobre',   t: 'Corretor' },
                { to: '/contato', t: 'Contato' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} style={linkEstilo}>{l.t}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — Tipos de imóvel */}
          <div>
            <h4 style={tituloCol}>Tipos de Imóvel</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['casa',        '🏠 Casas'],
                ['apartamento', '🏢 Apartamentos'],
                ['lote',        '📐 Lotes e Terrenos'],
                ['rural',       '🌿 Rural / Chácara'],
                ['loja',        '🏪 Lojas Comerciais'],
              ].map(([tipo, label]) => (
                <li key={tipo}>
                  <Link to={`/imoveis?tipo=${tipo}`} style={linkEstilo}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4 — Corretor */}
          <div>
            <h4 style={tituloCol}>Corretor</h4>
            {CORRETORES.map(c => (
              <div key={c.id} style={{ marginBottom: '16px' }}>
                <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.9rem' }}>{c.nome}</p>
                <p style={{ color: '#D9A93F', fontSize: '0.78rem', marginBottom: '4px' }}>{c.creci}</p>
                <a href={c.dfImoveis} target="_blank" rel="noopener noreferrer"
                  style={{ ...linkEstilo, fontSize: '0.8rem' }}>
                  Ver perfil no DF Imóveis →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── Linha divisória ── */}
        <div style={{ height: '1px', background: 'rgba(217,169,63,0.1)', marginBottom: '24px' }} />

        {/* ── Rodapé inferior ── */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            '12px',
        }}>
          <p style={{ fontSize: '0.8125rem', color: '#555' }}>
            © {ano} {SITE.nome}. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#555' }}>
            <em style={{ color: '#D9A93F' }}>{SITE.slogan}</em>
          </p>
        </div>
      </div>
    </footer>
  );
}

const socialIcon = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  width:          '40px',
  height:         '40px',
  borderRadius:   '10px',
  background:     'rgba(217,169,63,0.08)',
  border:         '1px solid rgba(217,169,63,0.15)',
  color:          '#D9A93F',
  transition:     'all 0.2s ease',
  textDecoration: 'none',
};

const tituloCol = {
  fontSize:      '0.75rem',
  fontWeight:    '700',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color:         '#D9A93F',
  marginBottom:  '16px',
};

const linkEstilo = {
  color:          '#888',
  fontSize:       '0.875rem',
  textDecoration: 'none',
  transition:     'color 0.2s ease',
};
