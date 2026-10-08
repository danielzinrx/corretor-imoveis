/* =============================================
   COMPONENTE — ListaImoveis
   Grade de cards com estado vazio/carregando
   ============================================= */

import React from 'react';
import CardImovel from './CardImovel.jsx';
import Loader from '../ui/Loader.jsx';

export default function ListaImoveis({ imoveis, carregando, erro }) {
  if (carregando) return <Loader texto="Buscando imóveis..." />;

  if (erro) return (
    <div style={{
      textAlign: 'center', padding: '60px 20px',
      background: 'rgba(239,68,68,0.05)',
      border: '1px solid rgba(239,68,68,0.15)',
      borderRadius: '12px',
    }}>
      <p style={{ color: '#f87171', fontSize: '1rem' }}>{erro}</p>
    </div>
  );

  if (imoveis.length === 0) return (
    <div style={{
      textAlign:    'center',
      padding:      '80px 20px',
      background:   'rgba(255,255,255,0.01)',
      border:       '1px solid rgba(217,169,63,0.08)',
      borderRadius: '16px',
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🏡</div>
      <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>
        Nenhum imóvel encontrado
      </h3>
      <p style={{ color: '#888', fontSize: '0.9375rem' }}>
        Tente ajustar os filtros para ver mais resultados.
      </p>
    </div>
  );

  return (
    <div>
      <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '20px' }}>
        <span style={{ color: '#D9A93F', fontWeight: '700' }}>{imoveis.length}</span>{' '}
        {imoveis.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
      </p>
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap:                 '24px',
      }}>
        {imoveis.map((im, idx) => (
          <div key={im.id} style={{ animation: `fadeIn 0.4s ease ${idx * 0.06}s both` }}>
            <CardImovel imovel={im} />
          </div>
        ))}
      </div>
    </div>
  );
}
