/* =============================================
   SERVICES — Imóveis (Firestore CRUD)
   ============================================= */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

const COL = 'imoveis';

/* ── Listar todos (com filtros opcionais) ── */
export async function listarImoveis(filtros = {}) {
  const ref = collection(db, COL);
  const constraints = [];

  if (filtros.tipo)      constraints.push(where('tipo',      '==', filtros.tipo));
  if (filtros.finalidade)constraints.push(where('finalidade','==', filtros.finalidade));
  if (filtros.status)    constraints.push(where('status',    '==', filtros.status));
  if (filtros.cidade)    constraints.push(where('cidade',    '==', filtros.cidade));

  // Ordenação
  const ordem = filtros.ordenar ?? 'recentes';
  if (ordem === 'menor-preco') constraints.push(orderBy('valor',        'asc'));
  else if (ordem === 'maior-preco') constraints.push(orderBy('valor',   'desc'));
  else if (ordem === 'menor-area')  constraints.push(orderBy('areaUtil','asc'));
  else if (ordem === 'maior-area')  constraints.push(orderBy('areaUtil','desc'));
  else                              constraints.push(orderBy('dataCadastro', 'desc'));

  if (filtros.limite) constraints.push(limit(filtros.limite));

  const q   = query(ref, ...constraints);
  const snap = await getDocs(q);

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ── Buscar imóvel prioritário da Hero (Sobrado QN 5 Conjunto 19) ── */
export async function buscarImovelPrioritario() {
  const ref = collection(db, COL);

  // 1. Tentar pelo dfImoveisId do Sobrado Prioritário (1085123)
  try {
    const q1 = query(ref, where('dfImoveisId', '==', '1085123'), limit(1));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      const d = snap1.docs[0];
      return { id: d.id, ...d.data() };
    }
  } catch (e) {
    console.warn('buscarImovelPrioritario por dfImoveisId falhou:', e);
  }

  // 2. Tentar pelo ID fixo atual caso exista
  try {
    const snapDoc = await getDoc(doc(db, COL, '0zmg51cZX08qnLUPMIaI'));
    if (snapDoc.exists()) {
      return { id: snapDoc.id, ...snapDoc.data() };
    }
  } catch (e) {
    // silencioso
  }

  // 3. Fallback: procurar pelo título que contenha QN 5 Conjunto 19
  try {
    const snapAll = await getDocs(collection(db, COL));
    for (const d of snapAll.docs) {
      const data = d.data();
      if (data.titulo && data.titulo.toLowerCase().includes('qn 5 conjunto 19')) {
        return { id: d.id, ...data };
      }
    }
  } catch (e) {
    console.warn('buscarImovelPrioritario por título falhou:', e);
  }

  return null;
}

/* ── Buscar por ID ── */
export async function buscarImovel(id) {
  if (!id) return null;

  // 1. Busca direta pelo ID do documento
  try {
    const ref  = doc(db, COL, id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn('buscarImovel: erro na busca direta por ID:', err);
  }

  // 2. Fallback caso seja o ID antigo/legado do sobrado do Hero
  if (id === 'aUZ9RhkpifK4Fwj11Wnh') {
    const prioritario = await buscarImovelPrioritario();
    if (prioritario) return prioritario;
  }

  // 3. Fallback: tentar buscar por dfImoveisId (caso a rota use o código do DF Imóveis)
  try {
    const refCol = collection(db, COL);
    const q = query(refCol, where('dfImoveisId', '==', id), limit(1));
    const snapQ = await getDocs(q);
    if (!snapQ.empty) {
      const d = snapQ.docs[0];
      return { id: d.id, ...d.data() };
    }
  } catch (err) {
    console.warn('buscarImovel: fallback dfImoveisId falhou:', err);
  }

  return null;
}

/* ── Imóveis em destaque ──
   Filtra só por "destaque" no Firestore e o resto no navegador,
   assim não precisa criar índice composto. */
export async function imoveisDestaque(qtd = 6) {
  const ref  = collection(db, COL);
  const snap = await getDocs(query(ref, where('destaque', '==', true)));

  const segundos = d => d?.dataCadastro?.seconds ?? 0;

  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(i => (i.status ?? 'disponivel') === 'disponivel')
    .sort((a, b) => segundos(b) - segundos(a))
    .slice(0, qtd);
}

/* ── Criar imóvel ── */
export async function criarImovel(dados) {
  const ref = collection(db, COL);
  const doc_ = await addDoc(ref, {
    ...dados,
    dataCadastro:    Timestamp.now(),
    dataAtualizacao: Timestamp.now(),
    status:          dados.status ?? 'disponivel',
    fotos:           dados.fotos  ?? [],
  });
  return doc_.id;
}

/* ── Atualizar imóvel ── */
export async function atualizarImovel(id, dados) {
  const ref = doc(db, COL, id);
  await updateDoc(ref, {
    ...dados,
    dataAtualizacao: Timestamp.now(),
  });
}

/* ── Excluir imóvel ── */
export async function excluirImovel(id) {
  const ref = doc(db, COL, id);
  await deleteDoc(ref);
}
