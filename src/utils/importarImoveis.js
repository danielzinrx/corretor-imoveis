/* =============================================
   SCRIPT — Importar imóveis iniciais para o Firestore
   Uso (uma vez só):  node src/utils/importarImoveis.js

   Precisa no .env (temporário, pode apagar depois):
     VITE_FIREBASE_* (as de sempre)
     ADMIN_EMAIL=email do usuário criado em Authentication
     ADMIN_SENHA=senha desse usuário
   (sem o prefixo VITE_, então NÃO vai para o site publicado)
   ============================================= */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore, collection, addDoc, getDocs, query, limit, Timestamp,
} from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { config } from 'dotenv';

config({ path: '.env' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const { ADMIN_EMAIL, ADMIN_SENHA } = process.env;

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Preencha as chaves VITE_FIREBASE_* no .env');
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_SENHA) {
  console.error('❌ Defina ADMIN_EMAIL e ADMIN_SENHA no .env (usuário criado no Firebase Authentication)');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const imoveis = JSON.parse(
  readFileSync(new URL('../data/imoveis-iniciais.json', import.meta.url), 'utf-8'),
);

async function importar() {
  // As regras só deixam o admin gravar, então entramos como ele
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_SENHA);
  console.log(`🔐 Logado como ${ADMIN_EMAIL}`);

  const ref = collection(db, 'imoveis');

  // Trava anti-duplicação: se já tem imóvel, não importa de novo
  const existente = await getDocs(query(ref, limit(1)));
  if (!existente.empty) {
    console.log('⚠️  A coleção "imoveis" já tem documentos. Nada foi importado.');
    process.exit(0);
  }

  let sucesso = 0;
  let erro = 0;

  for (const imovel of imoveis) {
    try {
      const agora = Timestamp.now();
      const docRef = await addDoc(ref, {
        ...imovel,
        destaque: imovel.destaque ?? false,
        fotos: imovel.fotos ?? [],
        status: imovel.status ?? 'disponivel',
        dataCadastro: agora,
        dataAtualizacao: agora,
      });
      console.log(`✅ [${sucesso + 1}] ${imovel.titulo} → ${docRef.id}`);
      sucesso++;
    } catch (e) {
      console.error(`❌ "${imovel.titulo}": ${e.code ?? e.message}`);
      erro++;
    }
  }

  console.log(`\n📊 ${sucesso} importados, ${erro} com erro.`);
  process.exit(erro ? 1 : 0);
}

importar().catch(e => {
  console.error('❌ Falha:', e.code ?? e.message);
  process.exit(1);
});