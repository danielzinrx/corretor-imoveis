/* =============================================
   FIREBASE — Inicialização
   As chaves ficam no .env (nunca commitar!)
   ============================================= */

import { initializeApp } from 'firebase/app';
import { getFirestore }   from 'firebase/firestore';
import { getStorage }     from 'firebase/storage';
import { getAuth }        from 'firebase/auth';

const env = import.meta.env;

/* Sem o .env preenchido o Firebase lança erro na inicialização e a tela fica
   em branco. Usamos valores provisórios só para o site abrir e mostrar a
   mensagem de erro de carregamento até as chaves reais serem configuradas. */
export const firebaseConfigurado = Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID);

if (!firebaseConfigurado) {
  console.warn('Firebase não configurado: copie .env.example para .env e preencha as chaves.');
}

const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY            || 'chave-nao-configurada',
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         env.VITE_FIREBASE_PROJECT_ID         || 'projeto-nao-configurado',
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);

export default app;
