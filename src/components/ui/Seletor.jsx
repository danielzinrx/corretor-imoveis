/* =============================================
   COMPONENTE — Seletor
   Select estilizado no tema dourado/preto
   ============================================= */

import React from 'react';

/**
 * @param {string}   id
 * @param {string}   label
 * @param {string}   valor
 * @param {function} onChange
 * @param {Array}    opcoes  - [{valor, label}]
 * @param {string}   placeholder
 */
export default function Seletor({ id, label, valor, onChange, opcoes = [], placeholder = 'Selecione' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize:      '0.75rem',
            fontWeight:    '600',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color:         '#D9A93F',
          }}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={valor}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance:      'none',
          WebkitAppearance:'none',
          background:      'rgba(255,255,255,0.04)',
          border:          '1px solid rgba(217,169,63,0.2)',
          borderRadius:    '8px',
          color:           valor ? '#ffffff' : '#888888',
          fontSize:        '0.9375rem',
          padding:         '10px 36px 10px 14px',
          cursor:          'pointer',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23D9A93F' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat:   'no-repeat',
          backgroundPosition: 'right 12px center',
          width:              '100%',
          transition:         'border-color 0.2s ease',
          outline:            'none',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(217,169,63,0.6)'; }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(217,169,63,0.2)'; }}
      >
        <option value="">{placeholder}</option>
        {opcoes.map(op => (
          <option key={op.valor} value={op.valor} style={{ background: '#111111', color: '#ffffff' }}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}
