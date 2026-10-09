/* =============================================
   PÁGINA ADMIN — Editar imóvel
   ============================================= */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormImovel from '../../components/admin/FormImovel.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Botao from '../../components/ui/Botao.jsx';
import { buscarImovel, atualizarImovel } from '../../services/imoveisService.js';

export default function EditarImovel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imovel,     setImovel]     = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState('');
  const [salvando,   setSalvando]   = useState(false);

  useEffect(() => {
    document.title = 'Editar imóvel';
    let ativo = true;
    (async () => {
      try {
        const dados = await buscarImovel(id);
        if (ativo) setImovel(dados);
      } catch (e) {
        console.error('EditarImovel:', e);
        if (ativo) setErro('Não foi possível carregar o imóvel.');
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => { ativo = false; };
  }, [id]);

  const salvar = async (dados) => {
    setSalvando(true);
    try {
      await atualizarImovel(id, dados);
      navigate('/admin');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <main className="pagina"><Loader texto="Carregando imóvel..." /></main>;
  }

  if (erro || !imovel) {
    return (
      <main className="pagina">
        <div className="pagina__conteudo" style={{ textAlign: 'center', padding: '60px 0' }}>
          <h1 className="pagina__titulo">Imóvel não encontrado</h1>
          <p className="pagina__subtitulo" style={{ margin: '0 auto 24px' }}>
            {erro || 'Este imóvel não existe mais.'}
          </p>
          <Botao variante="primario" href="/admin">Voltar ao painel</Botao>
        </div>
      </main>
    );
  }

  return (
    <main className="pagina">
      <div className="pagina__conteudo" style={{ maxWidth: '900px' }}>
        <h1 className="pagina__titulo" style={{ marginBottom: '28px' }}>Editar <span>imóvel</span></h1>
        <FormImovel
          inicial={imovel}
          pastaFotos={id}
          onSalvar={salvar}
          salvando={salvando}
          rotuloBotao="Salvar alterações"
        />
      </div>
    </main>
  );
}
