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

/* ── Buscar por ID ── */
export async function buscarImovel(id) {
  const ref  = doc(db, COL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/* ── Imóveis em destaque ── */
export async function imoveisDestaque(qtd = 6) {
  const ref = collection(db, COL);
  const q   = query(ref,
    where('destaque', '==', true),
    where('status',   '==', 'disponivel'),
    orderBy('dataCadastro', 'desc'),
    limit(qtd),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
