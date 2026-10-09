/* =============================================
   PÁGINA — Sobre o corretor
   ============================================= */

import React, { useEffect, useState } from 'react';
import Botao from '../components/ui/Botao.jsx';
import { CORRETORES, SITE } from '../config/site.js';
import { linkWhatsappGeral, linkInstagram, linkEmail } from '../utils/whatsapp.js';

const DIFERENCIAIS = [
  { icone: '🤝', titulo: 'Atendimento direto',   texto: 'Você fala com o próprio corretor, do primeiro contato até a entrega das chaves.' },
  { icone: '📍', titulo: 'Conhece o DF',         texto: 'Atuação em Brasília, Taguatinga, Águas Claras e demais regiões do Distrito Federal.' },
  { icone: '🏡', titulo: 'Todos os tipos',       texto: 'Casas, apartamentos, lotes, imóveis rurais e lojas, para venda e aluguel.' },
  { icone: '📄', titulo: 'Segurança na negociação', texto: 'Acompanhamento de toda a documentação e do financiamento, quando houver.' },
];

export default function Sobre() {
  useEffect(() => {
    document.title = `Sobre os corretores | ${SITE.nome}`;
  }, []);

  return (
    <main className="pagina">
      <div className="pagina__conteudo">
        <h1 className="pagina__titulo">Conheça nossos <span>corretores</span></h1>
        <p className="pagina__subtitulo">
          Equipe dedicada com ampla experiência no mercado imobiliário de Brasília e regiões do DF.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginTop: '32px' }}>
          {CORRETORES.map((corretor) => (
            <section key={corretor.id} className="sobre" style={{ border: '1px solid rgba(217,169,63,0.15)', borderRadius: '24px', padding: '36px' }}>
              {corretor.foto ? (
                <img
                  className="sobre__foto"
                  src={corretor.foto}
                  alt={corretor.nome}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="sobre__foto"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#111', color: '#D9A93F', fontSize: '6rem', fontWeight: 700,
                  }}
                >
                  {corretor.nome.charAt(0)}
                </div>
              )}

              <div>
                <span className="badge badge--dourado">{corretor.creci}</span>
                <h2 style={{
                  fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  color: '#fff', margin: '14px 0 12px',
                }}>
                  {corretor.nome}
                </h2>
                <p style={{ color: '#c8c8c8', lineHeight: 1.8, marginBottom: '12px' }}>{corretor.bio}</p>
                <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '28px' }}>{SITE.descricao}</p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Botao
                    variante="primario"
                    href={linkWhatsappGeral(corretor.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    icone="💬"
                    id={`sobre-whatsapp-${corretor.id}`}
                  >
                    Chamar no WhatsApp
                  </Botao>
                  {corretor.instagram && (
                    <Botao
                      variante="secundario"
                      href={linkInstagram(corretor.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`sobre-instagram-${corretor.id}`}
                    >
                      Instagram
                    </Botao>
                  )}
                  {corretor.email && (
                    <Botao
                      variante="secundario"
                      href={linkEmail(corretor.email)}
                      id={`sobre-email-${corretor.id}`}
                    >
                      E-mail
                    </Botao>
                  )}
                  {corretor.dfImoveis && (
                    <Botao
                      variante="secundario"
                      href={corretor.dfImoveis}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`sobre-dfimoveis-${corretor.id}`}
                    >
                      Perfil no DF Imóveis
                    </Botao>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <section style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px', marginTop: '64px',
        }}>
          {DIFERENCIAIS.map(d => (
            <div key={d.titulo} className="caixa">
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{d.icone}</div>
              <h3 className="caixa__titulo" style={{ marginBottom: '8px' }}>{d.titulo}</h3>
              <p style={{ color: '#888', fontSize: '0.9375rem', lineHeight: 1.7 }}>{d.texto}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
