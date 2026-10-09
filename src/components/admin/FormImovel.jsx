/* =============================================
   COMPONENTE — FormImovel
   Formulário de cadastro/edição de imóvel
   ============================================= */

import React, { useMemo, useState } from 'react';
import Botao from '../ui/Botao.jsx';
import Seletor from '../ui/Seletor.jsx';
import UploadFotos from './UploadFotos.jsx';
import {
  TIPOS_IMOVEL, FINALIDADES, STATUS_IMOVEL, CIDADES_DF, CARACTERISTICAS,
} from '../../config/opcoes.js';
import { CORRETORES } from '../../config/site.js';

const VAZIO = {
  titulo: '', descricao: '',
  tipo: '', finalidade: 'venda', status: 'disponivel', destaque: false,
  valor: '', cidade: '', bairro: '', endereco: '', lat: '', lng: '',
  areaUtil: '', areaTotal: '', quartos: '', suites: '', banheiros: '', vagas: '',
  caracteristicas: [], fotos: [],
  corretorId: CORRETORES[0].id,
};

const CAMPOS_NUMERICOS = ['valor', 'lat', 'lng', 'areaUtil', 'areaTotal', 'quartos', 'suites', 'banheiros', 'vagas'];

function paraFormulario(imovel) {
  const base = { ...VAZIO, ...imovel };
  CAMPOS_NUMERICOS.forEach(c => { base[c] = imovel?.[c] ?? ''; });
  return base;
}

function paraDados(form) {
  const dados = { ...form };
  CAMPOS_NUMERICOS.forEach(c => {
    // aceita vírgula decimal (ex.: -15,83)
    const texto = String(form[c]).trim().replace(',', '.');
    dados[c] = texto === '' || Number.isNaN(Number(texto)) ? null : Number(texto);
  });
  dados.titulo    = form.titulo.trim();
  dados.descricao = form.descricao.trim();
  dados.bairro    = form.bairro.trim();
  dados.endereco  = form.endereco.trim();
  delete dados.id;
  delete dados.dataCadastro;
  delete dados.dataAtualizacao;
  return dados;
}

/**
 * @param {object}   inicial   - imóvel existente (edição) ou undefined (novo)
 * @param {string}   pastaFotos - id da pasta de fotos no Storage
 * @param {function} onSalvar  - async (dados) => void
 * @param {boolean}  salvando
 * @param {string}   rotuloBotao
 */
export default function FormImovel({ inicial, pastaFotos, onSalvar, salvando = false, rotuloBotao = 'Salvar imóvel' }) {
  const [form, setForm] = useState(() => paraFormulario(inicial));
  const [erro, setErro] = useState('');

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));
  const input = (campo) => ({
    value: form[campo] ?? '',
    onChange: e => set(campo, e.target.value),
  });

  const toggleCaracteristica = (valor) => {
    setForm(f => ({
      ...f,
      caracteristicas: f.caracteristicas.includes(valor)
        ? f.caracteristicas.filter(c => c !== valor)
        : [...f.caracteristicas, valor],
    }));
  };

  const mapaLink = useMemo(() => {
    const lat = String(form.lat).replace(',', '.');
    const lng = String(form.lng).replace(',', '.');
    return lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : null;
  }, [form.lat, form.lng]);

  const enviar = async (e) => {
    e.preventDefault();
    setErro('');

    if (!form.titulo.trim())  return setErro('Informe o título do imóvel.');
    if (!form.tipo)           return setErro('Escolha o tipo do imóvel.');
    if (!form.cidade)         return setErro('Escolha a cidade/região.');
    if (!String(form.valor).trim() || Number(String(form.valor).replace(',', '.')) <= 0) {
      return setErro('Informe o valor do imóvel (apenas números).');
    }

    try {
      await onSalvar(paraDados(form));
    } catch (err) {
      console.error('FormImovel:', err);
      setErro('Não foi possível salvar. Verifique sua conexão e se você está logado.');
    }
  };

  return (
    <form onSubmit={enviar} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Informações principais ── */}
      <section className="caixa">
        <h2 className="caixa__titulo">Informações principais</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="form-titulo">Título</label>
            <input id="form-titulo" className="campo__input" placeholder="Ex.: Casa 3 quartos — Taguatinga Sul" {...input('titulo')} />
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="form-descricao">Descrição</label>
            <textarea id="form-descricao" className="campo__textarea" placeholder="Conte os detalhes do imóvel..." {...input('descricao')} />
          </div>

          <div className="grade-form">
            <Seletor id="form-tipo" label="Tipo" valor={form.tipo} onChange={v => set('tipo', v)} opcoes={TIPOS_IMOVEL} placeholder="Selecione" />
            <Seletor id="form-finalidade" label="Finalidade" valor={form.finalidade} onChange={v => set('finalidade', v || 'venda')} opcoes={FINALIDADES} placeholder="Venda" />
            <Seletor id="form-status" label="Status" valor={form.status} onChange={v => set('status', v || 'disponivel')} opcoes={STATUS_IMOVEL} placeholder="Disponível" />
            <div className="campo">
              <label className="campo__rotulo" htmlFor="form-corretor">Corretor responsável</label>
              <select
                id="form-corretor"
                className="campo__input"
                value={form.corretorId || CORRETORES[0].id}
                onChange={e => set('corretorId', e.target.value)}
              >
                {CORRETORES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.creci})
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label className="campo__rotulo" htmlFor="form-valor">Valor (R$)</label>
              <input id="form-valor" className="campo__input" inputMode="numeric" placeholder="580000" {...input('valor')} />
              <span className="campo__ajuda">Só números, sem pontos. Para aluguel, o valor mensal.</span>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c8c8c8', cursor: 'pointer' }}>
            <input
              type="checkbox"
              id="form-destaque"
              checked={!!form.destaque}
              onChange={e => set('destaque', e.target.checked)}
              style={{ accentColor: '#D9A93F', width: '18px', height: '18px' }}
            />
            Mostrar em destaque na página inicial
          </label>
        </div>
      </section>

      {/* ── Localização ── */}
      <section className="caixa">
        <h2 className="caixa__titulo">Localização</h2>
        <div className="grade-form grade-form--larga">
          <Seletor id="form-cidade" label="Cidade / região" valor={form.cidade} onChange={v => set('cidade', v)} opcoes={CIDADES_DF} placeholder="Selecione" />
          <div className="campo">
            <label className="campo__rotulo" htmlFor="form-bairro">Bairro</label>
            <input id="form-bairro" className="campo__input" {...input('bairro')} />
          </div>
          <div className="campo" style={{ gridColumn: '1 / -1' }}>
            <label className="campo__rotulo" htmlFor="form-endereco">Endereço</label>
            <input id="form-endereco" className="campo__input" placeholder="QSB 3 Conjunto 2 — Taguatinga Sul" {...input('endereco')} />
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="form-lat">Latitude</label>
            <input id="form-lat" className="campo__input" inputMode="decimal" placeholder="-15.8399" {...input('lat')} />
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="form-lng">Longitude</label>
            <input id="form-lng" className="campo__input" inputMode="decimal" placeholder="-48.0526" {...input('lng')} />
          </div>
        </div>
        <p className="campo__ajuda" style={{ marginTop: '10px' }}>
          Dica: no Google Maps, clique com o botão direito no local do imóvel e clique nos números para copiar latitude e longitude.
          {mapaLink && <> <a href={mapaLink} target="_blank" rel="noopener noreferrer" style={{ color: '#D9A93F' }}>Conferir no mapa →</a></>}
        </p>
      </section>

      {/* ── Medidas ── */}
      <section className="caixa">
        <h2 className="caixa__titulo">Medidas e cômodos</h2>
        <div className="grade-form">
          {[
            ['areaUtil',  'Área útil (m²)'],
            ['areaTotal', 'Área total (m²)'],
            ['quartos',   'Quartos'],
            ['suites',    'Suítes'],
            ['banheiros', 'Banheiros'],
            ['vagas',     'Vagas de garagem'],
          ].map(([campo, rotulo]) => (
            <div className="campo" key={campo}>
              <label className="campo__rotulo" htmlFor={`form-${campo}`}>{rotulo}</label>
              <input id={`form-${campo}`} className="campo__input" inputMode="numeric" {...input(campo)} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Características ── */}
      <section className="caixa">
        <h2 className="caixa__titulo">Características</h2>
        <div className="chips">
          {CARACTERISTICAS.map(c => {
            const ativo = form.caracteristicas.includes(c.valor);
            return (
              <button
                key={c.valor}
                type="button"
                className={`chip ${ativo ? 'chip--ativo' : ''}`}
                aria-pressed={ativo}
                onClick={() => toggleCaracteristica(c.valor)}
              >
                {c.icone} {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Fotos ── */}
      <section className="caixa">
        <h2 className="caixa__titulo">Fotos</h2>
        <UploadFotos pasta={pastaFotos} fotos={form.fotos} onChange={fotos => set('fotos', fotos)} />
      </section>

      {erro && <div className="aviso aviso--erro" role="alert">{erro}</div>}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Botao type="submit" variante="primario" disabled={salvando} id="form-salvar">
          {salvando ? 'Salvando...' : rotuloBotao}
        </Botao>
        <Botao variante="secundario" href="/admin" id="form-cancelar">Cancelar</Botao>
      </div>
    </form>
  );
}
