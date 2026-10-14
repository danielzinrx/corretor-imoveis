/* =============================================
   COMPONENTE — FiltrosAdmin
   Barra de busca, abas de status, seletores e métricas
   para controle dos imóveis no painel do corretor
   ============================================= */

import React from 'react';
import { TIPOS_IMOVEL, FINALIDADES, STATUS_IMOVEL, CIDADES_DF } from '../../config/opcoes.js';
import { formatarMoeda, labelCidade, labelTipo } from '../../utils/formatadores.js';

export default function FiltrosAdmin({
  filtros,
  onFiltroChange,
  onLimparFiltros,
  metricas,
  cidadesDisponiveis = [],
  totalFiltrados = 0,
  totalImoveis = 0,
  valorTotalFiltrado = 0,
}) {
  const temFiltroAtivo =
    filtros.busca.trim() !== '' ||
    filtros.status !== 'todos' ||
    filtros.tipo !== 'todos' ||
    filtros.finalidade !== 'todos' ||
    filtros.cidade !== 'todos' ||
    filtros.destaque !== 'todos' ||
    filtros.ordenar !== 'recentes';

  // Opções de cidades baseadas nos imóveis existentes
  const opcoesCidades = cidadesDisponiveis.map(slug => ({
    valor: slug,
    label: labelCidade(slug, CIDADES_DF),
  })).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="admin-controles-secao">

      {/* ── 1. CARDS DE MÉTRICAS / KPIS COM CLIQUE RÁPIDO ── */}
      <div className="admin-kpis-grid">
        {/* Card: Total */}
        <div
          className={`admin-kpi-card ${filtros.status === 'todos' && filtros.destaque === 'todos' ? 'admin-kpi-card--ativo' : ''}`}
          onClick={() => {
            onFiltroChange('status', 'todos');
            onFiltroChange('destaque', 'todos');
          }}
          title="Clique para ver todos os imóveis"
        >
          <div className="admin-kpi-card__topo">
            <span className="admin-kpi-card__icone">🏢</span>
            <span className="admin-kpi-card__rotulo">Total em Catálogo</span>
          </div>
          <div className="admin-kpi-card__valor">{metricas.total}</div>
          <span className="admin-kpi-card__sub">{metricas.total === 1 ? 'imóvel cadastrado' : 'imóveis cadastrados'}</span>
        </div>

        {/* Card: Disponíveis */}
        <div
          className={`admin-kpi-card ${filtros.status === 'disponivel' && filtros.destaque === 'todos' ? 'admin-kpi-card--ativo' : ''}`}
          onClick={() => {
            onFiltroChange('status', 'disponivel');
            onFiltroChange('destaque', 'todos');
          }}
          title="Clique para filtrar apenas disponíveis"
        >
          <div className="admin-kpi-card__topo">
            <span className="admin-kpi-card__icone" style={{ color: '#4ade80' }}>🟢</span>
            <span className="admin-kpi-card__rotulo">Disponíveis</span>
          </div>
          <div className="admin-kpi-card__valor" style={{ color: '#4ade80' }}>{metricas.disponiveis}</div>
          <span className="admin-kpi-card__sub">prontos para negociação</span>
        </div>

        {/* Card: Em Destaque */}
        <div
          className={`admin-kpi-card ${filtros.destaque === 'sim' ? 'admin-kpi-card--ativo' : ''}`}
          onClick={() => {
            onFiltroChange('destaque', filtros.destaque === 'sim' ? 'todos' : 'sim');
          }}
          title="Clique para filtrar apenas destaques da Home"
        >
          <div className="admin-kpi-card__topo">
            <span className="admin-kpi-card__icone" style={{ color: '#FFD65A' }}>★</span>
            <span className="admin-kpi-card__rotulo">Em Destaque</span>
          </div>
          <div className="admin-kpi-card__valor" style={{ color: '#FFD65A' }}>{metricas.destaques}</div>
          <span className="admin-kpi-card__sub">na página principal</span>
        </div>

        {/* Card: Reservados / Vendidos */}
        <div
          className={`admin-kpi-card ${(filtros.status === 'reservado' || filtros.status === 'vendido') ? 'admin-kpi-card--ativo' : ''}`}
          onClick={() => {
            onFiltroChange('status', filtros.status === 'reservado' ? 'vendido' : 'reservado');
            onFiltroChange('destaque', 'todos');
          }}
          title="Clique para alternar entre reservados e vendidos"
        >
          <div className="admin-kpi-card__topo">
            <span className="admin-kpi-card__icone">🤝</span>
            <span className="admin-kpi-card__rotulo">Negociados</span>
          </div>
          <div className="admin-kpi-card__valor" style={{ color: '#facc15' }}>
            {metricas.reservados + metricas.vendidos}
          </div>
          <span className="admin-kpi-card__sub">
            {metricas.reservados} res. · {metricas.vendidos} vend.
          </span>
        </div>

        {/* Card: Valor em Carteira */}
        <div className="admin-kpi-card admin-kpi-card--destaque" title="Valor somado de todos os imóveis cadastrados">
          <div className="admin-kpi-card__topo">
            <span className="admin-kpi-card__icone">💰</span>
            <span className="admin-kpi-card__rotulo">Carteira Total</span>
          </div>
          <div className="admin-kpi-card__valor admin-kpi-card__valor--moeda">
            {formatarMoeda(metricas.valorTotal)}
          </div>
          <span className="admin-kpi-card__sub">soma do valor dos imóveis</span>
        </div>
      </div>

      {/* ── 2. PAINEL DE FILTROS E BUSCA ── */}
      <div className="admin-filtros-box">

        {/* Linha superior: Busca e Abas Rápidas */}
        <div className="admin-filtros-topo">
          {/* Campo de Busca Textual */}
          <div className="admin-busca-wrapper">
            <span className="admin-busca-icone">🔍</span>
            <input
              type="text"
              className="admin-busca-input"
              placeholder="Buscar por título, bairro, código DF Imóveis ou ID..."
              value={filtros.busca}
              onChange={e => onFiltroChange('busca', e.target.value)}
              id="admin-filtro-busca"
            />
            {filtros.busca && (
              <button
                type="button"
                className="admin-busca-limpar"
                onClick={() => onFiltroChange('busca', '')}
                title="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          {/* Abas Rápidas de Status */}
          <div className="admin-status-tabs" role="tablist" aria-label="Filtrar por status">
            <button
              type="button"
              className={`admin-status-tab ${filtros.status === 'todos' ? 'admin-status-tab--ativo' : ''}`}
              onClick={() => onFiltroChange('status', 'todos')}
            >
              Todos <span className="admin-tab-cont">{metricas.total}</span>
            </button>
            <button
              type="button"
              className={`admin-status-tab ${filtros.status === 'disponivel' ? 'admin-status-tab--ativo' : ''}`}
              onClick={() => onFiltroChange('status', 'disponivel')}
            >
              Disponíveis <span className="admin-tab-cont admin-tab-cont--verde">{metricas.disponiveis}</span>
            </button>
            <button
              type="button"
              className={`admin-status-tab ${filtros.status === 'reservado' ? 'admin-status-tab--ativo' : ''}`}
              onClick={() => onFiltroChange('status', 'reservado')}
            >
              Reservados <span className="admin-tab-cont admin-tab-cont--amarelo">{metricas.reservados}</span>
            </button>
            <button
              type="button"
              className={`admin-status-tab ${filtros.status === 'vendido' ? 'admin-status-tab--ativo' : ''}`}
              onClick={() => onFiltroChange('status', 'vendido')}
            >
              Vendidos <span className="admin-tab-cont admin-tab-cont--vermelho">{metricas.vendidos}</span>
            </button>
          </div>
        </div>

        {/* Linha de Seletores (Dropdowns) */}
        <div className="admin-filtros-grid">
          {/* Seletor: Tipo */}
          <div className="admin-seletor-grupo">
            <label htmlFor="admin-filtro-tipo" className="admin-seletor-label">Tipo de Imóvel</label>
            <select
              id="admin-filtro-tipo"
              className="admin-seletor-campo"
              value={filtros.tipo}
              onChange={e => onFiltroChange('tipo', e.target.value)}
            >
              <option value="todos">Todos os tipos</option>
              {TIPOS_IMOVEL.map(t => (
                <option key={t.valor} value={t.valor}>{t.icone} {t.label}</option>
              ))}
            </select>
          </div>

          {/* Seletor: Finalidade */}
          <div className="admin-seletor-grupo">
            <label htmlFor="admin-filtro-finalidade" className="admin-seletor-label">Finalidade</label>
            <select
              id="admin-filtro-finalidade"
              className="admin-seletor-campo"
              value={filtros.finalidade}
              onChange={e => onFiltroChange('finalidade', e.target.value)}
            >
              <option value="todos">Venda & Aluguel</option>
              {FINALIDADES.map(f => (
                <option key={f.valor} value={f.valor}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Seletor: Região / Cidade */}
          <div className="admin-seletor-grupo">
            <label htmlFor="admin-filtro-cidade" className="admin-seletor-label">Cidade / Região</label>
            <select
              id="admin-filtro-cidade"
              className="admin-seletor-campo"
              value={filtros.cidade}
              onChange={e => onFiltroChange('cidade', e.target.value)}
            >
              <option value="todos">Todas as regiões ({opcoesCidades.length})</option>
              {opcoesCidades.map(c => (
                <option key={c.valor} value={c.valor}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Seletor: Destaque */}
          <div className="admin-seletor-grupo">
            <label htmlFor="admin-filtro-destaque" className="admin-seletor-label">Destaque na Home</label>
            <select
              id="admin-filtro-destaque"
              className="admin-seletor-campo"
              value={filtros.destaque}
              onChange={e => onFiltroChange('destaque', e.target.value)}
            >
              <option value="todos">Todos (Destaques e Normais)</option>
              <option value="sim">★ Apenas Destaques</option>
              <option value="nao">☆ Não destacadas</option>
            </select>
          </div>

          {/* Seletor: Ordenação */}
          <div className="admin-seletor-grupo">
            <label htmlFor="admin-filtro-ordenar" className="admin-seletor-label">Ordenar Por</label>
            <select
              id="admin-filtro-ordenar"
              className="admin-seletor-campo"
              value={filtros.ordenar}
              onChange={e => onFiltroChange('ordenar', e.target.value)}
            >
              <option value="recentes">Mais recentes</option>
              <option value="antigos">Mais antigos</option>
              <option value="maior-preco">Maior valor</option>
              <option value="menor-preco">Menor valor</option>
              <option value="az">Título (A - Z)</option>
              <option value="za">Título (Z - A)</option>
            </select>
          </div>
        </div>

        {/* ── 3. RESUMO DE RESULTADOS E TAGS ATIVAS ── */}
        <div className="admin-filtros-rodape">
          <div className="admin-filtros-contagem">
            Mostrando <strong>{totalFiltrados}</strong> de <strong>{totalImoveis}</strong> {totalImoveis === 1 ? 'imóvel' : 'imóveis'}
            {totalFiltrados > 0 && totalFiltrados !== totalImoveis && (
              <span className="admin-filtros-soma">
                · Subtotal em tela: <strong style={{ color: '#FFD65A' }}>{formatarMoeda(valorTotalFiltrado)}</strong>
              </span>
            )}
          </div>

          {/* Chips de Filtros Ativos */}
          <div className="admin-filtros-chips">
            {filtros.busca && (
              <button
                type="button"
                className="admin-filtro-tag"
                onClick={() => onFiltroChange('busca', '')}
                title="Remover filtro de busca"
              >
                Busca: "{filtros.busca}" ✕
              </button>
            )}
            {filtros.status !== 'todos' && (
              <button
                type="button"
                className="admin-filtro-tag"
                onClick={() => onFiltroChange('status', 'todos')}
                title="Remover filtro de status"
              >
                Status: {STATUS_IMOVEL.find(s => s.valor === filtros.status)?.label ?? filtros.status} ✕
              </button>
            )}
            {filtros.tipo !== 'todos' && (
              <button
                type="button"
                className="admin-filtro-tag"
                onClick={() => onFiltroChange('tipo', 'todos')}
                title="Remover filtro de tipo"
              >
                Tipo: {labelTipo(filtros.tipo, TIPOS_IMOVEL)} ✕
              </button>
            )}
            {filtros.finalidade !== 'todos' && (
              <button
                type="button"
                className="admin-filtro-tag"
                onClick={() => onFiltroChange('finalidade', 'todos')}
                title="Remover filtro de finalidade"
              >
                Finalidade: {FINALIDADES.find(f => f.valor === filtros.finalidade)?.label ?? filtros.finalidade} ✕
              </button>
            )}
            {filtros.cidade !== 'todos' && (
              <button
                type="button"
                className="admin-filtro-tag"
                onClick={() => onFiltroChange('cidade', 'todos')}
                title="Remover filtro de cidade"
              >
                Região: {labelCidade(filtros.cidade, CIDADES_DF)} ✕
              </button>
            )}
            {filtros.destaque !== 'todos' && (
              <button
                type="button"
                className="admin-filtro-tag"
                onClick={() => onFiltroChange('destaque', 'todos')}
                title="Remover filtro de destaque"
              >
                {filtros.destaque === 'sim' ? '★ Apenas Destaques' : 'Sem destaque'} ✕
              </button>
            )}

            {temFiltroAtivo && (
              <button
                type="button"
                className="admin-limpar-btn"
                onClick={onLimparFiltros}
                id="admin-btn-limpar-filtros"
              >
                🧹 Limpar Filtros
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
