/* =============================================
   COMPONENTE — TabelaAdminImoveis
   Lista de imóveis no painel com ações rápidas e badges
   ============================================= */

import React from 'react';
import { Link } from 'react-router-dom';
import { formatarMoeda, formatarData, labelTipo, labelCidade } from '../../utils/formatadores.js';
import { TIPOS_IMOVEL, CIDADES_DF, STATUS_IMOVEL, FINALIDADES } from '../../config/opcoes.js';

/**
 * @param {Array}    imoveis
 * @param {number}   totalOriginal
 * @param {function} onLimparFiltros
 * @param {function} onExcluir        - (imovel) => void
 * @param {function} onAlterarCampo   - (imovel, campo, valor) => void
 */
export default function TabelaAdminImoveis({
  imoveis,
  totalOriginal = 0,
  onLimparFiltros,
  onExcluir,
  onAlterarCampo,
}) {
  if (imoveis.length === 0) {
    if (totalOriginal > 0) {
      return (
        <div className="caixa" style={{ textAlign: 'center', padding: '56px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ color: '#fff', marginBottom: '6px' }}>Nenhum imóvel encontrado</h3>
          <p style={{ color: '#888', marginBottom: '20px' }}>
            Nenhum dos {totalOriginal} imóveis corresponde aos filtros ou à busca selecionada.
          </p>
          {onLimparFiltros && (
            <button
              type="button"
              className="chip chip--ativo"
              onClick={onLimparFiltros}
              style={{ margin: '0 auto', padding: '10px 24px', cursor: 'pointer' }}
            >
              🧹 Limpar Filtros e Ver Todos ({totalOriginal})
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="caixa" style={{ textAlign: 'center', padding: '56px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏡</div>
        <h3 style={{ color: '#fff', marginBottom: '6px' }}>Nenhum imóvel cadastrado ainda</h3>
        <p style={{ color: '#888' }}>Clique em "Novo imóvel" para cadastrar o primeiro.</p>
      </div>
    );
  }

  return (
    <div className="admin-tabela-wrap">
      <table className="admin-tabela">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Imóvel & Detalhes</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Destaque</th>
            <th>Data Cadastro</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {imoveis.map(im => {
            const capa = im.fotos?.[0]?.url || im.fotos?.[0] || null;
            const finalidade = FINALIDADES.find(f => f.valor === im.finalidade)?.label ?? 'Venda';
            const statusAtual = im.status ?? 'disponivel';

            return (
              <tr key={im.id}>
                <td>
                  <Link to={`/imoveis/${im.id}`} target="_blank" title="Abrir imóvel em nova aba">
                    {capa ? (
                      <img className="admin-miniatura" src={capa} alt="" loading="lazy" />
                    ) : (
                      <div className="admin-miniatura" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        📷
                      </div>
                    )}
                  </Link>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <Link
                        to={`/imoveis/${im.id}`}
                        target="_blank"
                        style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}
                        className="admin-titulo-link"
                      >
                        {im.titulo}
                      </Link>
                      {im.dfImoveisId && (
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(217,169,63,0.12)',
                            color: '#FFD65A',
                            border: '1px solid rgba(217,169,63,0.25)',
                            fontFamily: 'monospace',
                          }}
                          title="Código no DF Imóveis"
                        >
                          DF #{im.dfImoveisId}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                      <span style={{ color: '#aaa' }}>{labelTipo(im.tipo, TIPOS_IMOVEL)}</span>
                      <span style={{ color: '#555' }}>•</span>
                      <span style={{ color: '#aaa' }}>{labelCidade(im.cidade, CIDADES_DF)}</span>
                      {im.bairro && (
                        <>
                          <span style={{ color: '#555' }}>•</span>
                          <span style={{ color: '#888' }}>{im.bairro}</span>
                        </>
                      )}
                      <span style={{ color: '#555' }}>•</span>
                      <span
                        style={{
                          color: im.finalidade === 'aluguel' ? '#60a5fa' : '#4ade80',
                          fontWeight: 500,
                        }}
                      >
                        {finalidade}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ color: '#FFD65A', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatarMoeda(im.valor)}
                  {im.finalidade === 'aluguel' && im.valor ? (
                    <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 400 }}> /mês</span>
                  ) : null}
                </td>
                <td>
                  <select
                    value={statusAtual}
                    aria-label={`Status de ${im.titulo}`}
                    onChange={e => onAlterarCampo(im, 'status', e.target.value)}
                    style={{
                      background:
                        statusAtual === 'disponivel'
                          ? 'rgba(34,197,94,0.1)'
                          : statusAtual === 'reservado'
                          ? 'rgba(234,179,8,0.1)'
                          : 'rgba(239,68,68,0.1)',
                      color:
                        statusAtual === 'disponivel'
                          ? '#4ade80'
                          : statusAtual === 'reservado'
                          ? '#facc15'
                          : '#f87171',
                      border:
                        statusAtual === 'disponivel'
                          ? '1px solid rgba(34,197,94,0.35)'
                          : statusAtual === 'reservado'
                          ? '1px solid rgba(234,179,8,0.35)'
                          : '1px solid rgba(239,68,68,0.35)',
                      borderRadius: '8px',
                      padding: '6px 8px',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {STATUS_IMOVEL.map(s => (
                      <option key={s.valor} value={s.valor} style={{ background: '#1a1a1a', color: '#fff' }}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className={`chip ${im.destaque ? 'chip--ativo' : ''}`}
                    aria-pressed={!!im.destaque}
                    onClick={() => onAlterarCampo(im, 'destaque', !im.destaque)}
                    title={im.destaque ? 'Clique para remover do destaque' : 'Clique para destacar na Home'}
                  >
                    {im.destaque ? '★ Sim' : '☆ Não'}
                  </button>
                </td>
                <td style={{ whiteSpace: 'nowrap', fontSize: '0.8125rem', color: '#999' }}>
                  {formatarData(im.dataCadastro)}
                </td>
                <td>
                  <div className="admin-acoes" style={{ justifyContent: 'flex-end' }}>
                    <Link className="btn-mini" to={`/imoveis/${im.id}`} target="_blank" title="Visualizar página pública">
                      👁️ Ver
                    </Link>
                    <Link className="btn-mini" to={`/admin/editar/${im.id}`} title="Editar imóvel">
                      ✏️ Editar
                    </Link>
                    <button
                      type="button"
                      className="btn-mini btn-mini--perigo"
                      onClick={() => onExcluir(im)}
                      title="Excluir imóvel"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
