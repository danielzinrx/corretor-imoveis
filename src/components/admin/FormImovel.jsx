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
import MapaGoogle from '../imoveis/MapaGoogle.jsx';

const VAZIO = {
  titulo: '', descricao: '',
  tipo: '', finalidade: 'venda', status: 'disponivel', destaque: false,
  valor: '', cidade: '', bairro: '', endereco: '', enderecoCompleto: '', lat: '', lng: '',
  areaUtil: '', areaTotal: '', quartos: '', suites: '', banheiros: '', vagas: '',
  caracteristicas: [], fotos: [],
  corretorId: CORRETORES[0].id,
  dfImoveisId: '', linkDFImoveis: '',
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

  const colarLinkOuCoords = (texto) => {
    if (!texto) return;
    const coordsMatch = texto.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (coordsMatch) {
      set('lat', coordsMatch[1]);
      set('lng', coordsMatch[2]);
      return;
    }
    const atMatch = texto.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      set('lat', atMatch[1]);
      set('lng', atMatch[2]);
      return;
    }
  };

  const mapaLink = useMemo(() => {
    const lat = String(form.lat).replace(',', '.');
    const lng = String(form.lng).replace(',', '.');
    return lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : (form.endereco ? `https://www.google.com/maps?q=${encodeURIComponent(form.endereco)}` : null);
  }, [form.lat, form.lng, form.endereco]);

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grade-form grade-form--larga">
            <Seletor id="form-cidade" label="Cidade / região" valor={form.cidade} onChange={v => set('cidade', v)} opcoes={CIDADES_DF} placeholder="Selecione" />
            <div className="campo">
              <label className="campo__rotulo" htmlFor="form-bairro">Bairro / Quadra</label>
              <input id="form-bairro" className="campo__input" placeholder="Ex.: Riacho Fundo, QN 5" {...input('bairro')} />
            </div>
          </div>

          <div className="campo">
            <label className="campo__rotulo" htmlFor="form-endereco">Endereço Completo</label>
            <input
              id="form-endereco"
              className="campo__input"
              placeholder="Ex.: QN 5 Conjunto 19, Riacho Fundo I, Brasília - DF"
              {...input('endereco')}
            />
            <span className="campo__ajuda">
              Digite como no anuncio do DF Imóveis: Quadra + Conjunto + Cidade + Estado.
              Isso garante que o mapa encontre o local correto.
            </span>
          </div>

          {/* Código DF Imóveis + Link do anúncio */}
          <div className="grade-form">
            <div className="campo">
              <label className="campo__rotulo" htmlFor="form-df-id">Cód. DF Imóveis</label>
              <input id="form-df-id" className="campo__input" placeholder="Ex.: 1085123" {...input('dfImoveisId')} />
              <span className="campo__ajuda">Número ao final da URL do anúncio no site DF Imóveis.</span>
            </div>
            <div className="campo">
              <label className="campo__rotulo" htmlFor="form-df-link">Link do Anúncio (DF Imóveis)</label>
              <input
                id="form-df-link"
                className="campo__input"
                placeholder="https://www.dfimoveis.com.br/imovel/..."
                {...input('linkDFImoveis')}
              />
              {form.linkDFImoveis && (
                <a href={form.linkDFImoveis} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#D9A93F', marginTop: '4px', display: 'inline-block' }}>
                  Abrir anúncio →
                </a>
              )}
            </div>
          </div>

          {/* Lat / Lng */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#D9A93F' }}>
                Coordenadas GPS (Opcional, mas mais preciso)
              </span>
              {form.lat && form.lng ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`https://www.google.com/maps?q=${String(form.lat).replace(',','.')},${String(form.lng).replace(',','.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: '#1a73e8', background: 'rgba(26,115,232,0.12)', border: '1px solid rgba(26,115,232,0.3)', borderRadius: '6px', padding: '4px 10px', textDecoration: 'none', fontWeight: 600 }}
                  >
                    🗺️ Ver no Maps
                  </a>
                  <a
                    href={`https://waze.com/ul?ll=${String(form.lat).replace(',','.')},${String(form.lng).replace(',','.')}&navigate=yes`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: '#09c7f3', background: 'rgba(9,199,243,0.1)', border: '1px solid rgba(9,199,243,0.3)', borderRadius: '6px', padding: '4px 10px', textDecoration: 'none', fontWeight: 600 }}
                  >
                    🗣️ Waze
                  </a>
                </div>
              ) : null}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="campo">
                <label className="campo__rotulo" htmlFor="form-lat">Latitude</label>
                <input id="form-lat" className="campo__input" inputMode="decimal" placeholder="-15.8399" {...input('lat')} />
              </div>
              <div className="campo">
                <label className="campo__rotulo" htmlFor="form-lng">Longitude</label>
                <input id="form-lng" className="campo__input" inputMode="decimal" placeholder="-48.0526" {...input('lng')} />
              </div>
            </div>

            {/* Cole o link do Google Maps para extrair coords automaticamente */}
            <div className="campo">
              <label className="campo__rotulo" htmlFor="form-link-maps">Colar Link / Coords do Google Maps</label>
              <input
                id="form-link-maps"
                className="campo__input"
                placeholder="Cole aqui o link do Google Maps ou as coordenadas (-15.8399,-48.0526)"
                onPaste={e => {
                  const texto = e.clipboardData.getData('text');
                  colarLinkOuCoords(texto);
                }}
                onChange={e => colarLinkOuCoords(e.target.value)}
              />
              <span className="campo__ajuda">
                No Google Maps: clique com botão direito no local → clique nos números para copiar as coordenadas.
                Ou copie o link completo da página e cole aqui — as coordenadas serão extraídas automaticamente.
              </span>
            </div>
          </div>

          {/* Preview do Mapa */}
          {(form.lat || form.lng || form.endereco || form.bairro || form.cidade) && (
            <div style={{ marginTop: '4px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#D9A93F', marginBottom: '10px' }}>
                Pré-visualização do Mapa
              </div>
              <MapaGoogle
                lat={form.lat}
                lng={form.lng}
                endereco={form.endereco}
                bairro={form.bairro}
                cidade={form.cidade}
                titulo={form.titulo}
                dfImoveisId={form.dfImoveisId}
                linkDFImoveis={form.linkDFImoveis}
              />
            </div>
          )}
        </div>
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
