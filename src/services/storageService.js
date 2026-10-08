/* =============================================
   SERVICES — Storage (Upload de Fotos)
   ============================================= */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../config/firebase.js';

/**
 * Faz upload de um arquivo de foto para o Firebase Storage
 * @param {File}   arquivo
 * @param {string} imovelId
 * @param {function} onProgresso - callback(percent)
 * @returns {Promise<string>} URL pública da foto
 */
export function uploadFoto(arquivo, imovelId, onProgresso = null) {
  return new Promise((resolve, reject) => {
    const nomeArquivo = `${Date.now()}_${arquivo.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const caminho     = `imoveis/${imovelId}/${nomeArquivo}`;
    const storageRef  = ref(storage, caminho);
    const uploadTask  = uploadBytesResumable(storageRef, arquivo);

    uploadTask.on(
      'state_changed',
      snapshot => {
        if (onProgresso) {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgresso(pct);
        }
      },
      reject,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, caminho });
      },
    );
  });
}

/**
 * Remove uma foto do Storage pelo caminho
 * @param {string} caminho
 */
export async function removerFoto(caminho) {
  if (!caminho) return;
  try {
    const storageRef = ref(storage, caminho);
    await deleteObject(storageRef);
  } catch (e) {
    // Ignora se o arquivo já não existir
    if (e.code !== 'storage/object-not-found') throw e;
  }
}
