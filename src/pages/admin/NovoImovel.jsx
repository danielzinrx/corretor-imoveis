/* =============================================
   PÁGINA ADMIN — Novo imóvel
   ============================================= */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormImovel from '../../components/admin/FormImovel.jsx';
import { criarImovel } from '../../services/imoveisService.js';

export default function NovoImovel() {
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState(false);

  // As fotos são enviadas antes de o imóvel existir; esta pasta temporária
  // agrupa todas elas no Storage.
  const pasta = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()),
  );

  useEffect(() => { document.title = 'Novo imóvel'; }, []);

  const salvar = async (dados) => {
    setSalvando(true);
    try {
      await criarImovel(dados);
      navigate('/admin');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <main className="pagina">
      <div className="pagina__conteudo" style={{ maxWidth: '900px' }}>
        <h1 className="pagina__titulo" style={{ marginBottom: '28px' }}>Novo <span>imóvel</span></h1>
        <FormImovel
          pastaFotos={pasta.current}
          onSalvar={salvar}
          salvando={salvando}
          rotuloBotao="Cadastrar imóvel"
        />
      </div>
    </main>
  );
}
