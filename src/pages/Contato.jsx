/* =============================================
   PÁGINA — Contato
   O formulário monta uma mensagem e abre o WhatsApp
   (não precisa de servidor).
   ============================================= */

import React, { useEffect, useState } from 'react';
import Botao from '../components/ui/Botao.jsx';
import { SITE, CORRETORES } from '../config/site.js';
import { linkInstagram, linkEmail } from '../utils/whatsapp.js';

function formatarTelefone(numero) {
  // 5561985569820 -> (61) 98556-9820
  const n = numero.replace(/^55/, '');
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

export default function Contato() {
  const [corretorId, setCorretorId] = useState(CORRETORES[0].id);
  const [form, setForm] = useState({ nome: '', telefone: '', mensagem: '' });
  const [erro, setErro] = useState('');

  const corretor = CORRETORES.find(c => c.id === corretorId) || CORRETORES[0];

  useEffect(() => {
    document.title = `Contato | ${SITE.nome}`;
  }, []);

  const atualizar = (campo) => (e) => setForm(f => ({ ...f, [campo]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.mensagem.trim()) {
      setErro('Preencha seu nome e a mensagem.');
      return;
    }
    setErro('');
    const primeiroNome = corretor.nome.split(' ')[0];
    const texto = [
      `Olá, ${primeiroNome}! Meu nome é ${form.nome.trim()}.`,
      form.telefone.trim() ? `Meu telefone: ${form.telefone.trim()}.` : '',
      '',
      form.mensagem.trim(),
    ].filter((l, i) => l !== '' || i === 2).join('\n');

    window.open(
      `https://wa.me/${corretor.whatsapp}?text=${encodeURIComponent(texto)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const canais = [
    { icone: '💬', rotulo: 'WhatsApp',  texto: formatarTelefone(corretor.whatsapp), href: `https://wa.me/${corretor.whatsapp}`, externo: true },
    ...(corretor.email ? [{ icone: '✉️', rotulo: 'E-mail', texto: corretor.email, href: linkEmail(corretor.email) }] : []),
    ...(corretor.instagram ? [{ icone: '📸', rotulo: 'Instagram', texto: `@${corretor.instagram}`, href: linkInstagram(corretor.instagram), externo: true }] : []),
    ...(corretor.dfImoveis ? [{ icone: '🏠', rotulo: 'DF Imóveis', texto: 'Ver anúncios no portal', href: corretor.dfImoveis, externo: true }] : []),
  ];

  return (
    <main className="pagina">
      <div className="pagina__conteudo">
        <h1 className="pagina__titulo">Fale com os <span>corretores</span></h1>
        <p className="pagina__subtitulo">
          Escolha com quem deseja falar e receba atendimento direto pelo WhatsApp, sem intermediários.
        </p>

        {/* ── Seletor de Corretor ── */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap:                 '16px',
          maxWidth:            '680px',
          margin:              '24px 0 36px',
        }}>
          {CORRETORES.map(c => {
            const ativo = c.id === corretorId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCorretorId(c.id)}
                style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '16px',
                  padding:       '16px 20px',
                  borderRadius:  '16px',
                  background:    ativo ? 'rgba(217,169,63,0.12)' : 'rgba(255,255,255,0.02)',
                  border:        `2px solid ${ativo ? '#D9A93F' : 'rgba(217,169,63,0.15)'}`,
                  color:         '#fff',
                  cursor:        'pointer',
                  textAlign:     'left',
                  transition:    'all 0.25s ease',
                  boxShadow:     ativo ? '0 8px 24px rgba(217,169,63,0.15)' : 'none',
                }}
              >
                <img
                  src={c.foto}
                  alt={c.nome}
                  style={{
                    width:        '56px',
                    height:       '56px',
                    borderRadius: '50%',
                    objectFit:    'cover',
                    border:       `2px solid ${ativo ? '#D9A93F' : 'transparent'}`,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: '700', fontSize: '1rem', color: ativo ? '#FFD65A' : '#fff' }}>
                    {c.nome}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.8125rem', color: '#D9A93F' }}>
                    {c.creci}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>
                    📱 {formatarTelefone(c.whatsapp)}
                  </span>
                </div>
                {ativo && (
                  <span style={{
                    width:          '24px',
                    height:         '24px',
                    borderRadius:   '50%',
                    background:     '#D9A93F',
                    color:          '#000',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    fontSize:       '0.875rem',
                    fontWeight:     '900',
                  }}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="contato">
          {/* ── Canais do Corretor Escolhido ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.125rem', color: '#fff', marginBottom: '4px' }}>
              Canais diretos de <span style={{ color: '#D9A93F' }}>{corretor.nome.split(' ')[0]}</span>
            </h3>

            {canais.map(c => (
              <a
                key={c.rotulo}
                href={c.href}
                {...(c.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                id={`contato-canal-${c.rotulo.toLowerCase().replace(/\s/g, '-')}`}
                className="caixa"
                style={{ display: 'flex', alignItems: 'center', gap: '16px', transition: 'border-color 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(217,169,63,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ''; }}
              >
                <span style={{ fontSize: '1.75rem' }}>{c.icone}</span>
                <span>
                  <strong style={{ display: 'block', color: '#fff' }}>{c.rotulo}</strong>
                  <span style={{ color: '#888', fontSize: '0.9375rem', wordBreak: 'break-all' }}>{c.texto}</span>
                </span>
              </a>
            ))}
          </div>

          {/* ── Formulário para o Corretor Selecionado ── */}
          <form className="caixa" onSubmit={enviar} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 className="caixa__titulo" style={{ marginBottom: 0 }}>
              Enviar mensagem para <span style={{ color: '#D9A93F' }}>{corretor.nome}</span>
            </h2>

            <div className="campo">
              <label className="campo__rotulo" htmlFor="contato-nome">Seu nome</label>
              <input id="contato-nome" className="campo__input" value={form.nome} onChange={atualizar('nome')} autoComplete="name" />
            </div>
            <div className="campo">
              <label className="campo__rotulo" htmlFor="contato-telefone">Telefone (opcional)</label>
              <input id="contato-telefone" className="campo__input" value={form.telefone} onChange={atualizar('telefone')} inputMode="tel" autoComplete="tel" />
            </div>
            <div className="campo">
              <label className="campo__rotulo" htmlFor="contato-mensagem">Mensagem</label>
              <textarea id="contato-mensagem" className="campo__textarea" value={form.mensagem} onChange={atualizar('mensagem')} placeholder={`Olá ${corretor.nome.split(' ')[0]}, tenho interesse em saber mais sobre os imóveis...`} />
            </div>

            {erro && <div className="aviso aviso--erro" role="alert">{erro}</div>}

            <Botao type="submit" variante="primario" icone="💬" id="contato-enviar">
              Enviar para {corretor.nome.split(' ')[0]} no WhatsApp
            </Botao>
            <span className="campo__ajuda">Ao enviar, o WhatsApp abre direto com {corretor.nome.split(' ')[0]} e sua mensagem pronta.</span>
          </form>
        </div>
      </div>
    </main>
  );
}
