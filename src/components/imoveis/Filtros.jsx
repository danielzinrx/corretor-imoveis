/* =============================================
   COMPONENTE — Filtros
   Painel de filtros do catálogo de imóveis
   ============================================= */

import React, { useState } from 'react';
import { TIPOS_IMOVEL, CIDADES_DF, FINALIDADES, CARACTERISTICAS, OPCOES_NUMERO, ORDENACOES } from '../../config/opcoes.js';
import Seletor from '../ui/Seletor.jsx';

export default function Filtros({ filtros, setFiltro, toggleCaracteristica, limpar, qtdFiltrosAtivos }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <aside style={{
      background:   '#111111',
      border:       '1px solid rgba(217,169,63,0.12)',
      borderRadius: '16px',
      padding:      '24px',
      display:      'flex',
      flexDirection:'column',
      gap:          '20px',
    }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A93F" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Filtros</h3>
          {qtdFiltrosAtivos > 0 && (
            <span style={{
              background:   'linear-gradient(135deg, #B07A1E, #FFD65A)',
              color:        '#000',
              borderRadius: '9999px',
              padding:      '1px 8px',
              fontSize:     '0.75rem',
              fontWeight:   '700',
            }}>
              {qtdFiltrosAtivos}
            </span>
          )}
        </div>
        {qtdFiltrosAtivos > 0 && (
          <button
            onClick={limpar}
            id="filtros-limpar"
            style={{
              fontSize:   '0.8125rem',
              color:      '#f87171',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              fontWeight: '500',
            }}
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Busca texto */}
      <div style={{ position: 'relative' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          id="filtros-busca"
          type="text"
          placeholder="Buscar por título, bairro..."
          value={filtros.busca}
          onChange={e => setFiltro('busca', e.target.value)}
          style={{
            width:        '100%',
            padding:      '10px 14px 10px 36px',
            background:   'rgba(255,255,255,0.04)',
            border:       '1px solid rgba(217,169,63,0.15)',
            borderRadius: '8px',
            color:        '#fff',
            fontSize:     '0.9rem',
            outline:      'none',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(217,169,63,0.5)'; }}
          onBlur={e  => { e.target.style.borderColor = 'rgba(217,169,63,0.15)'; }}
        />
      </div>

      {/* Ordenação */}
      <Seletor
        id="filtros-ordenar"
        label="Ordenar por"
        valor={filtros.ordenar}
        onChange={v => setFiltro('ordenar', v)}
        opcoes={ORDENACOES}
        placeholder="Mais Recentes"
      />

      {/* Tipo */}
      <Seletor
        id="filtros-tipo"
        label="Tipo de Imóvel"
        valor={filtros.tipo}
        onChange={v => setFiltro('tipo', v)}
        opcoes={TIPOS_IMOVEL}
        placeholder="Todos os tipos"
      />

      {/* Finalidade */}
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#D9A93F', marginBottom: '8px' }}>
          Finalidade
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ valor: '', label: 'Todos' }, ...FINALIDADES].map(f => (
            <button
              key={f.valor}
              id={`filtros-finalidade-${f.valor || 'todos'}`}
              onClick={() => setFiltro('finalidade', f.valor)}
              style={{
                flex:         1,
                padding:      '8px',
                borderRadius: '8px',
                fontSize:     '0.8125rem',
                fontWeight:   '600',
                cursor:       'pointer',
                border:       filtros.finalidade === f.valor ? '1px solid #D9A93F' : '1px solid rgba(255,255,255,0.08)',
                background:   filtros.finalidade === f.valor ? 'rgba(217,169,63,0.12)' : 'rgba(255,255,255,0.03)',
                color:        filtros.finalidade === f.valor ? '#FFD65A' : '#888',
                transition:   'all 0.2s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cidade / Região */}
      <Seletor
        id="filtros-cidade"
        label="Cidade / Região"
        valor={filtros.cidade}
        onChange={v => setFiltro('cidade', v)}
        opcoes={CIDADES_DF}
        placeholder="Todas as regiões"
      />

      {/* Quartos / Suítes / Vagas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        <Seletor id="filtros-quartos" label="Quartos" valor={filtros.quartos} onChange={v => setFiltro('quartos', v)} opcoes={OPCOES_NUMERO.slice(1)} placeholder="Qualquer" />
        <Seletor id="filtros-suites"  label="Suítes"  valor={filtros.suites}  onChange={v => setFiltro('suites',  v)} opcoes={OPCOES_NUMERO.slice(1)} placeholder="Qualquer" />
        <Seletor id="filtros-vagas"   label="Vagas"   valor={filtros.vagas}   onChange={v => setFiltro('vagas',   v)} opcoes={OPCOES_NUMERO.slice(1)} placeholder="Qualquer" />
      </div>

      {/* Faixa de valor */}
      <div>
        <p style={labelStyle}>Faixa de Valor</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input id="filtros-valor-min" type="number" placeholder="Mínimo (R$)"
            value={filtros.valorMin} onChange={e => setFiltro('valorMin', e.target.value)}
            style={inputStyle} onFocus={e => { e.target.style.borderColor = 'rgba(217,169,63,0.5)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(217,169,63,0.15)'; }}
          />
          <input id="filtros-valor-max" type="number" placeholder="Máximo (R$)"
            value={filtros.valorMax} onChange={e => setFiltro('valorMax', e.target.value)}
            style={inputStyle} onFocus={e => { e.target.style.borderColor = 'rgba(217,169,63,0.5)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(217,169,63,0.15)'; }}
          />
        </div>
      </div>

      {/* Faixa de área */}
      <div>
        <p style={labelStyle}>Área Útil (m²)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input id="filtros-area-min" type="number" placeholder="Mínimo"
            value={filtros.areaMin} onChange={e => setFiltro('areaMin', e.target.value)}
            style={inputStyle} onFocus={e => { e.target.style.borderColor = 'rgba(217,169,63,0.5)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(217,169,63,0.15)'; }}
          />
          <input id="filtros-area-max" type="number" placeholder="Máximo"
            value={filtros.areaMax} onChange={e => setFiltro('areaMax', e.target.value)}
            style={inputStyle} onFocus={e => { e.target.style.borderColor = 'rgba(217,169,63,0.5)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(217,169,63,0.15)'; }}
          />
        </div>
      </div>

      {/* Características */}
      <div>
        <button
          onClick={() => setExpandido(a => !a)}
          style={{
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width:      '100%',
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            padding:    0,
          }}
        >
          <p style={{ ...labelStyle, marginBottom: 0 }}>
            Características
            {filtros.caracteristicas.length > 0 && (
              <span style={{ color: '#FFD65A', marginLeft: '6px' }}>({filtros.caracteristicas.length})</span>
            )}
          </p>
          <span style={{ color: '#D9A93F', fontSize: '0.75rem' }}>{expandido ? '▲' : '▼'}</span>
        </button>

        {expandido && (
          <div style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 '8px',
            marginTop:           '12px',
            maxHeight:           '280px',
            overflowY:           'auto',
            paddingRight:        '4px',
          }}>
            {CARACTERISTICAS.map(c => {
              const ativo = filtros.caracteristicas.includes(c.valor);
              return (
                <button
                  key={c.valor}
                  id={`filtros-carac-${c.valor}`}
                  onClick={() => toggleCaracteristica(c.valor)}
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        '6px',
                    padding:    '7px 10px',
                    borderRadius:'8px',
                    fontSize:   '0.75rem',
                    fontWeight: '500',
                    cursor:     'pointer',
                    border:     ativo ? '1px solid rgba(217,169,63,0.5)' : '1px solid rgba(255,255,255,0.06)',
                    background: ativo ? 'rgba(217,169,63,0.1)' : 'rgba(255,255,255,0.02)',
                    color:      ativo ? '#FFD65A' : '#888',
                    transition: 'all 0.2s ease',
                    textAlign:  'left',
                  }}
                >
                  <span>{c.icone}</span>
                  <span style={{ lineHeight: '1.2' }}>{c.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

const labelStyle = {
  fontSize:      '0.75rem',
  fontWeight:    '600',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color:         '#D9A93F',
  marginBottom:  '8px',
  display:       'block',
};

const inputStyle = {
  width:        '100%',
  padding:      '10px 12px',
  background:   'rgba(255,255,255,0.04)',
  border:       '1px solid rgba(217,169,63,0.15)',
  borderRadius: '8px',
  color:        '#fff',
  fontSize:     '0.875rem',
  outline:      'none',
};
