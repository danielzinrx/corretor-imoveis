/* =============================================
   SERVICES — Autenticação dos Corretores
   ============================================= */

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase.js';

/**
 * Login com e-mail e senha
 */
export async function login(email, senha) {
  const credencial = await signInWithEmailAndPassword(auth, email, senha);
  return credencial.user;
}

/**
 * Logout
 */
export async function logout() {
  await signOut(auth);
}

/**
 * Observa mudanças no estado de autenticação
 * @param {function} callback - recebe o user ou null
 * @returns {function} unsubscribe
 */
export function observarAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Retorna o usuário atual (ou null)
 */
export function usuarioAtual() {
  return auth.currentUser;
}
