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
  const corretor = CORRETORES[0];
  const [fotoOk, setFotoOk] = useState(true);

  useEffect(() => {
    document.title = `Sobre o corretor | ${SITE.nome}`;
  }, []);

  return (
    <main className="pagina">
      <div className="pagina__conteudo">
        <h1 className="pagina__titulo">Conheça o <span>corretor</span></h1>

        <section className="sobre">
          {fotoOk ? (
            <img
              className="sobre__foto"
              src={corretor.foto}
              alt={corretor.nome}
              onError={() => setFotoOk(false)}
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
              <Botao variante="primario" href={linkWhatsappGeral(corretor.whatsapp)} target="_blank" rel="noopener noreferrer" icone="💬" id="sobre-whatsapp">
                Chamar no WhatsApp
              </Botao>
              <Botao variante="secundario" href={linkInstagram(corretor.instagram)} target="_blank" rel="noopener noreferrer" id="sobre-instagram">
                Instagram
              </Botao>
              <Botao variante="secundario" href={linkEmail(corretor.email)} id="sobre-email">
                E-mail
              </Botao>
              <Botao variante="secundario" href={corretor.dfImoveis} target="_blank" rel="noopener noreferrer" id="sobre-dfimoveis">
                Perfil no DF Imóveis
              </Botao>
            </div>
          </div>
        </section>

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
