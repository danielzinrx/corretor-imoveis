/* =============================================
   COMPONENTE — UploadFotos
   Envia várias fotos para o Firebase Storage.
   A primeira foto da lista é a capa do imóvel.
   ============================================= */

import React, { useRef, useState } from 'react';
import { uploadFoto, removerFoto } from '../../services/storageService.js';

const TAMANHO_MAX_MB = 8;

/**
 * @param {string}   pasta     - id usado na pasta do Storage (imoveis/<pasta>/...)
 * @param {Array}    fotos     - [{ url, caminho }]
 * @param {function} onChange  - recebe a nova lista de fotos
 */
export default function UploadFotos({ pasta, fotos = [], onChange }) {
  const inputRef = useRef(null);
  const [enviando, setEnviando] = useState({}); // { nome: percentual }
  const [erro,     setErro]     = useState('');
  const [arrastando, setArrastando] = useState(false);

  const lista = fotos.map(f => (typeof f === 'string' ? { url: f, caminho: null } : f));

  const enviar = async (arquivos) => {
    setErro('');
    const validos = Array.from(arquivos).filter(a => {
      if (!a.type.startsWith('image/')) { setErro(`"${a.name}" não é uma imagem.`); return false; }
      if (a.size > TAMANHO_MAX_MB * 1024 * 1024) { setErro(`"${a.name}" passa de ${TAMANHO_MAX_MB} MB.`); return false; }
      return true;
    });
    if (validos.length === 0) return;

    const novas = [];
    await Promise.all(validos.map(async (arquivo) => {
      try {
        const foto = await uploadFoto(arquivo, pasta, pct =>
          setEnviando(prev => ({ ...prev, [arquivo.name]: pct })),
        );
        novas.push(foto);
      } catch (e) {
        console.error('UploadFotos:', e);
        setErro(`Falha ao enviar "${arquivo.name}". Verifique sua conexão e as regras do Storage.`);
      } finally {
        setEnviando(prev => {
          const copia = { ...prev };
          delete copia[arquivo.name];
          return copia;
        });
      }
    }));

    if (novas.length > 0) onChange([...lista, ...novas]);
  };

  const remover = async (idx) => {
    const foto = lista[idx];
    try {
      await removerFoto(foto.caminho);
    } catch (e) {
      console.error('removerFoto:', e);
    }
    onChange(lista.filter((_, i) => i !== idx));
  };

  const tornarCapa = (idx) => {
    if (idx === 0) return;
    const copia = [...lista];
    const [foto] = copia.splice(idx, 1);
    copia.unshift(foto);
    onChange(copia);
  };

  const emEnvio = Object.entries(enviando);

  return (
    <div>
      <div
        className={`upload-area ${arrastando ? 'upload-area--ativa' : ''}`}
        role="button"
        tabIndex={0}
        id="upload-fotos-area"
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={e => { e.preventDefault(); setArrastando(true); }}
        onDragLeave={() => setArrastando(false)}
        onDrop={e => { e.preventDefault(); setArrastando(false); enviar(e.dataTransfer.files); }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '6px' }}>📷</div>
        <strong style={{ color: '#fff' }}>Clique ou arraste as fotos aqui</strong>
        <div style={{ fontSize: '0.8125rem', marginTop: '4px' }}>
          JPG, PNG ou WEBP, até {TAMANHO_MAX_MB} MB cada. A primeira foto é a capa.
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={e => { enviar(e.target.files); e.target.value = ''; }}
        />
      </div>

      {erro && <div className="aviso aviso--erro" role="alert" style={{ marginTop: '12px' }}>{erro}</div>}

      {(lista.length > 0 || emEnvio.length > 0) && (
        <div className="upload-grade">
          {lista.map((foto, idx) => (
            <div key={foto.caminho ?? foto.url} className="upload-item">
              <img src={foto.url} alt={`Foto ${idx + 1}`} loading="lazy" />
              {idx === 0 ? (
                <span className="upload-item__capa">Capa</span>
              ) : (
                <button
                  type="button"
                  className="upload-item__capa"
                  style={{ cursor: 'pointer', border: 'none' }}
                  onClick={() => tornarCapa(idx)}
                >
                  Tornar capa
                </button>
              )}
              <button
                type="button"
                className="upload-item__remover"
                aria-label={`Remover foto ${idx + 1}`}
                onClick={() => remover(idx)}
              >
                ×
              </button>
            </div>
          ))}
          {emEnvio.map(([nome, pct]) => (
            <div key={nome} className="upload-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#D9A93F', fontSize: '0.875rem' }}>{pct}%</span>
              <div className="upload-item__barra" style={{ width: `${pct}%` }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
