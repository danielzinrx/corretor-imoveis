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
  const corretor = CORRETORES[0];
  const [form, setForm] = useState({ nome: '', telefone: '', mensagem: '' });
  const [erro, setErro] = useState('');

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
    const texto = [
      `Olá, Edilson! Meu nome é ${form.nome.trim()}.`,
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
    { icone: '✉️', rotulo: 'E-mail',    texto: corretor.email,                      href: linkEmail(corretor.email) },
    { icone: '📸', rotulo: 'Instagram', texto: `@${corretor.instagram}`,             href: linkInstagram(corretor.instagram), externo: true },
    { icone: '🏠', rotulo: 'DF Imóveis', texto: 'Ver anúncios no portal',            href: corretor.dfImoveis, externo: true },
  ];

  return (
    <main className="pagina">
      <div className="pagina__conteudo">
        <h1 className="pagina__titulo">Fale com o <span>corretor</span></h1>
        <p className="pagina__subtitulo">
          Quer comprar, vender ou alugar? Mande uma mensagem e receba atendimento direto, sem intermediários.
        </p>

        <div className="contato">
          {/* ── Canais ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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

          {/* ── Formulário ── */}
          <form className="caixa" onSubmit={enviar} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 className="caixa__titulo" style={{ marginBottom: 0 }}>Envie uma mensagem</h2>

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
              <textarea id="contato-mensagem" className="campo__textarea" value={form.mensagem} onChange={atualizar('mensagem')} placeholder="Conte o que você procura: tipo de imóvel, região, valor..." />
            </div>

            {erro && <div className="aviso aviso--erro" role="alert">{erro}</div>}

            <Botao type="submit" variante="primario" icone="💬" id="contato-enviar">
              Enviar pelo WhatsApp
            </Botao>
            <span className="campo__ajuda">Ao enviar, o WhatsApp abre com a mensagem pronta.</span>
          </form>
        </div>
      </div>
    </main>
  );
}
