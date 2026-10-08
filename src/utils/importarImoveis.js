/* =============================================
   SCRIPT — Importar imóveis iniciais para o Firestore
   Execute uma vez: node src/utils/importarImoveis.js
   (precisa do .env preenchido)
   ============================================= */

import { initializeApp }   from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { createRequire }   from 'module';

const require = createRequire(import.meta.url);

// Carrega as variáveis de ambiente manualmente
import { config } from 'dotenv';
config({ path: '.env' });

const firebaseConfig = {
  apiKey:            process.env.VITE_FIREBASE_API_KEY,
  authDomain:        process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// Importa os dados do JSON
const { default: imoveis } = await import('../data/imoveis-iniciais.json', {
  assert: { type: 'json' },
});

async function importar() {
  const ref = collection(db, 'imoveis');
  let sucesso = 0;
  let erro    = 0;

  for (const imovel of imoveis) {
    try {
      const dados = {
        ...imovel,
        dataCadastro: Timestamp.now(),
        destaque:     imovel.destaque ?? false,
        fotos:        imovel.fotos   ?? [],
        status:       imovel.status  ?? 'disponivel',
      };
      const doc = await addDoc(ref, dados);
      console.log(`✅ [${sucesso + 1}] ${imovel.titulo} → ID: ${doc.id}`);
      sucesso++;
    } catch (e) {
      console.error(`❌ Erro em "${imovel.titulo}":`, e.message);
      erro++;
    }
  }

  console.log(`\n📊 Resultado: ${sucesso} importados, ${erro} com erro.`);
  process.exit(0);
}

importar();
