/* =============================================
   PÁGINA — 404
   ============================================= */

import React, { useEffect } from 'react';
import Botao from '../components/ui/Botao.jsx';
import { SITE } from '../config/site.js';

export default function NaoEncontrado() {
  useEffect(() => {
    document.title = `Página não encontrada | ${SITE.nome}`;
  }, []);

  return (
    <main className="pagina">
      <div className="pagina__conteudo" style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{
          fontFamily: '"Playfair Display", serif', fontSize: 'clamp(4rem, 12vw, 8rem)',
          fontWeight: 700, lineHeight: 1,
          background: 'linear-gradient(135deg, #B07A1E, #FFD65A)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          404
        </div>
        <h1 className="pagina__titulo" style={{ marginTop: '16px' }}>Página não encontrada</h1>
        <p className="pagina__subtitulo" style={{ margin: '0 auto 32px' }}>
          O endereço que você acessou não existe ou foi movido.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Botao variante="primario" href="/" icone="🏠">Ir para o início</Botao>
          <Botao variante="secundario" href="/imoveis">Ver imóveis</Botao>
        </div>
      </div>
    </main>
  );
}
