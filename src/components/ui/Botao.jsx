/* =============================================
   COMPONENTE — Botao
   Botão reutilizável com variantes
   ============================================= */

import React from 'react';

const estilos = {
  base: {
    display:        'inline-flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '8px',
    padding:        '12px 28px',
    borderRadius:   '9999px',
    fontFamily:     'inherit',
    fontSize:       '0.9375rem',
    fontWeight:     '600',
    letterSpacing:  '0.02em',
    cursor:         'pointer',
    border:         'none',
    transition:     'all 0.3s ease',
    textDecoration: 'none',
    whiteSpace:     'nowrap',
  },
};

/**
 * @param {'primario'|'secundario'|'ghost'|'perigo'} variante
 * @param {'sm'|'md'|'lg'} tamanho
 */
export default function Botao({
  children,
  variante = 'primario',
  tamanho  = 'md',
  icone,
  onClick,
  href,
  target,
  rel,
  type = 'button',
  disabled = false,
  style = {},
  ...rest
}) {
  const varianteEstilos = {
    primario: {
      background:  'linear-gradient(135deg, #B07A1E 0%, #FFD65A 50%, #B07A1E 100%)',
      backgroundSize: '200% auto',
      color:       '#000000',
      boxShadow:   '0 4px 20px rgba(217,169,63,0.35)',
    },
    secundario: {
      background:  'transparent',
      color:       '#FFD65A',
      border:      '1.5px solid rgba(217,169,63,0.5)',
    },
    ghost: {
      background:  'rgba(255,255,255,0.04)',
      color:       '#ffffff',
      border:      '1px solid rgba(255,255,255,0.1)',
    },
    perigo: {
      background:  'rgba(239,68,68,0.15)',
      color:       '#f87171',
      border:      '1px solid rgba(239,68,68,0.3)',
    },
  };

  const tamanhoEstilos = {
    sm: { padding: '8px 18px', fontSize: '0.8125rem' },
    md: { padding: '12px 28px', fontSize: '0.9375rem' },
    lg: { padding: '16px 40px', fontSize: '1.0625rem' },
  };

  const estilo = {
    ...estilos.base,
    ...varianteEstilos[variante],
    ...tamanhoEstilos[tamanho],
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    ...style,
  };

  const handleMouseEnter = (e) => {
    if (disabled) return;
    if (variante === 'primario') {
      e.currentTarget.style.backgroundPosition = 'right center';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(217,169,63,0.5)';
    } else {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = '#FFD65A';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(217,169,63,0.2)';
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.backgroundPosition = '';
    e.currentTarget.style.boxShadow = variante === 'primario' ? '0 4px 20px rgba(217,169,63,0.35)' : '';
    e.currentTarget.style.borderColor = '';
  };

  const props = {
    style:        estilo,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick,
    disabled,
    ...rest,
  };

  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...props}>
        {icone && <span>{icone}</span>}
        {children}
      </a>
    );
  }

  return (
    <button type={type} {...props}>
      {icone && <span>{icone}</span>}
      {children}
    </button>
  );
}
