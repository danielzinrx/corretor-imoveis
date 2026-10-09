/* =============================================
   COMPONENTE — TabelaAdminImoveis
   Lista de imóveis no painel com ações rápidas
   ============================================= */

import React from 'react';
import { Link } from 'react-router-dom';
import { formatarMoeda, formatarData, labelTipo, labelCidade } from '../../utils/formatadores.js';
import { TIPOS_IMOVEL, CIDADES_DF, STATUS_IMOVEL } from '../../config/opcoes.js';

/**
 * @param {Array}    imoveis
 * @param {function} onExcluir        - (imovel) => void
 * @param {function} onAlterarCampo   - (imovel, campo, valor) => void
 */
export default function TabelaAdminImoveis({ imoveis, onExcluir, onAlterarCampo }) {
  if (imoveis.length === 0) {
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
            <th>Imóvel</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Destaque</th>
            <th>Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {imoveis.map(im => {
            const capa = im.fotos?.[0]?.url || im.fotos?.[0] || null;
            return (
              <tr key={im.id}>
                <td>
                  {capa
                    ? <img className="admin-miniatura" src={capa} alt="" loading="lazy" />
                    : <div className="admin-miniatura" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</div>}
                </td>
                <td>
                  <strong style={{ color: '#fff', display: 'block' }}>{im.titulo}</strong>
                  <span style={{ color: '#888', fontSize: '0.8125rem' }}>
                    {labelTipo(im.tipo, TIPOS_IMOVEL)} · {labelCidade(im.cidade, CIDADES_DF)}
                  </span>
                </td>
                <td style={{ color: '#FFD65A', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatarMoeda(im.valor)}
                </td>
                <td>
                  <select
                    value={im.status ?? 'disponivel'}
                    aria-label={`Status de ${im.titulo}`}
                    onChange={e => onAlterarCampo(im, 'status', e.target.value)}
                    style={{
                      background: '#1a1a1a', color: '#fff', border: '1px solid rgba(217,169,63,0.25)',
                      borderRadius: '8px', padding: '6px 8px', fontSize: '0.8125rem',
                    }}
                  >
                    {STATUS_IMOVEL.map(s => <option key={s.valor} value={s.valor}>{s.label}</option>)}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className={`chip ${im.destaque ? 'chip--ativo' : ''}`}
                    aria-pressed={!!im.destaque}
                    onClick={() => onAlterarCampo(im, 'destaque', !im.destaque)}
                  >
                    {im.destaque ? '★ Sim' : '☆ Não'}
                  </button>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatarData(im.dataCadastro)}</td>
                <td>
                  <div className="admin-acoes">
                    <Link className="btn-mini" to={`/imoveis/${im.id}`} target="_blank">Ver</Link>
                    <Link className="btn-mini" to={`/admin/editar/${im.id}`}>Editar</Link>
                    <button type="button" className="btn-mini btn-mini--perigo" onClick={() => onExcluir(im)}>
                      Excluir
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
