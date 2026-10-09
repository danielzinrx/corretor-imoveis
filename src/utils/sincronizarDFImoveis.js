/* =============================================
   SCRIPT — Sincronizar Imóveis e Fotos do DF Imóveis
   Uso: node src/utils/sincronizarDFImoveis.js

   1. Raspa os anúncios e todas as fotos em alta resolução do perfil do corretor.
   2. Atualiza os arquivos locais de backup em JSON.
   3. Limpa os imóveis de teste e salva os 38 imóveis reais no Firestore!
   ============================================= */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, Timestamp,
} from 'firebase/firestore';
import { writeFileSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
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
  console.error('❌ Defina ADMIN_EMAIL e ADMIN_SENHA no .env');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function fetchHtml(url) {
  const cmd = `curl -s -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" "${url}"`;
  return execSync(cmd, { maxBuffer: 10 * 1024 * 1024 }).toString();
}

function normalizarTexto(txt) {
  return (txt || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#201;/g, 'É')
    .replace(/&#237;/g, 'í')
    .replace(/&#227;/g, 'ã')
    .replace(/&#243;/g, 'ó')
    .replace(/&#195;/g, 'Ã')
    .replace(/&#178;/g, '²')
    .replace(/\s+/g, ' ')
    .trim();
}

const REGIOES = [
  { slug: 'aguas-claras', regex: /aguas[- ]claras|águas[- ]claras/i },
  { slug: 'taguatinga', regex: /taguatinga/i },
  { slug: 'vicente-pires', regex: /vicente[- ]pires/i },
  { slug: 'arniqueiras', regex: /arniqueira/i },
  { slug: 'riacho-fundo', regex: /riacho[- ]fundo/i },
  { slug: 'park-way', regex: /park[- ]way/i },
  { slug: 'asa-sul', regex: /asa[- ]sul/i },
  { slug: 'asa-norte', regex: /asa[- ]norte/i },
  { slug: 'lago-sul', regex: /lago[- ]sul/i },
  { slug: 'lago-norte', regex: /lago[- ]norte/i },
  { slug: 'samambaia', regex: /samambaia/i },
  { slug: 'ceilandia', regex: /ceilandia|ceilândia/i },
  { slug: 'sobradinho', regex: /sobradinho/i },
  { slug: 'planaltina', regex: /planaltina/i },
  { slug: 'guara', regex: /guará|guara/i },
  { slug: 'gama', regex: /gama/i },
  { slug: 'santa-maria', regex: /santa[- ]maria/i },
  { slug: 'sao-sebastiao', regex: /são[- ]sebastião|sao[- ]sebastiao/i },
  { slug: 'recanto-emas', regex: /recanto[- ]das[- ]emas/i },
  { slug: 'candangolandia', regex: /candangolândia|candangolandia/i },
  { slug: 'nucleo-bandeirante', regex: /núcleo[- ]bandeirante|nucleo[- ]bandeirante/i },
];

function detectarCidade(texto) {
  for (const r of REGIOES) {
    if (r.regex.test(texto)) return r.slug;
  }
  return 'outro';
}

function parseImovel(html, url) {
  const idMatch = url.match(/-(\d+)$/);
  const dfId = idMatch ? idMatch[1] : '';

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/itemprop=["']name["'][^>]*>([\s\S]*?)<\/[a-z0-9]+>/i);
  let titulo = h1Match ? normalizarTexto(h1Match[1]) : '';
  if (!titulo) {
    const ogTitle = html.match(/<meta property="og:title" content="([^"]*)"/i);
    titulo = ogTitle ? ogTitle[1].replace(/ - DFimoveis\.com/i, '') : 'Imóvel';
  }

  let valor = 0;
  const precoMatch = html.match(/itemprop=["']price["'][^>]*content=["']([^"']+)["']/i) 
                  || html.match(/itemprop=["']price["'][^>]*>([\s\S]*?)<\/[a-z0-9]+>/i);
  if (precoMatch) {
    const valStr = precoMatch[1].split(',')[0].replace(/[^\d]/g, '');
    valor = parseInt(valStr, 10) || 0;
  }

  let tipo = 'casa';
  const urlLower = url.toLowerCase();
  const titLower = titulo.toLowerCase();
  if (urlLower.includes('apartamento') || titLower.includes('apartamento')) tipo = 'apartamento';
  else if (urlLower.includes('lote') || urlLower.includes('terreno') || titLower.includes('lote') || titLower.includes('terreno')) tipo = 'lote';
  else if (urlLower.includes('rural') || urlLower.includes('chacara') || titLower.includes('rural') || titLower.includes('chácara')) tipo = 'rural';
  else if (urlLower.includes('loja') || urlLower.includes('comercial') || titLower.includes('loja') || titLower.includes('sala')) tipo = 'loja';
  else if (urlLower.includes('casa') || titLower.includes('casa') || titLower.includes('sobrado')) tipo = 'casa';

  const finalidade = urlLower.includes('-aluguel-') ? 'aluguel' : 'venda';

  let areaUtil = 0;
  const areaMatch = html.match(/itemprop=["']floorSize["'][^>]*>([\s\S]*?)<\/[a-z0-9]+>/i);
  if (areaMatch) {
    const rawArea = areaMatch[1].replace(/[^\d,]/g, '').replace(',', '.');
    areaUtil = Math.round(parseFloat(rawArea) || 0);
  }

  let quartos = 0;
  const quartosMatch = html.match(/(\d+)\s*quarto/i);
  if (quartosMatch) quartos = parseInt(quartosMatch[1], 10);

  let suites = 0;
  const suitesMatch = html.match(/(\d+)\s*su[ií]te/i);
  if (suitesMatch) suites = parseInt(suitesMatch[1], 10);

  let banheiros = 0;
  const banheirosMatch = html.match(/(\d+)\s*banheiro/i);
  if (banheirosMatch) banheiros = parseInt(banheirosMatch[1], 10);

  let vagas = 0;
  const vagasMatch = html.match(/(\d+)\s*vaga/i);
  if (vagasMatch) vagas = parseInt(vagasMatch[1], 10);

  const endMatch = html.match(/itemprop=["']address["'][^>]*>([\s\S]*?)<\/[a-z0-9]+>/i);
  const enderecoRaw = endMatch ? normalizarTexto(endMatch[1]) : '';
  const partesEnd = enderecoRaw.split('-').map(s => s.trim()).filter(Boolean);
  const bairro = partesEnd[0] || 'Distrito Federal';
  const cidade = detectarCidade(`${url} ${enderecoRaw} ${titulo}`);

  let descricao = '';
  const descMatch = html.match(/<div class=["']assined-imv[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (descMatch) {
    descricao = normalizarTexto(descMatch[1]);
  } else {
    const ogDesc = html.match(/<meta property="og:description" content="([^"]*)"/i);
    descricao = ogDesc ? ogDesc[1] : '';
  }

  const caracs = [];
  const descLow = (descricao + ' ' + titulo).toLowerCase();
  if (descLow.includes('piscina')) caracs.push('piscina');
  if (descLow.includes('churrasqueira')) caracs.push('churrasqueira');
  if (descLow.includes('ar-condicionado') || descLow.includes('ar condicionado')) caracs.push('ar-condicionado');
  if (descLow.includes('area gourmet') || descLow.includes('área gourmet')) caracs.push('area-gourmet');
  if (descLow.includes('armario') || descLow.includes('armário')) caracs.push('armarios-embutidos');
  if (descLow.includes('varanda') || descLow.includes('sacada')) caracs.push('varanda');
  if (descLow.includes('elevador')) caracs.push('elevador');
  if (descLow.includes('academia')) caracs.push('academia');
  if (descLow.includes('portaria')) caracs.push('portaria');
  if (descLow.includes('energia solar') || descLow.includes('painel solar')) caracs.push('energia-solar');
  if (descLow.includes('financiamento') || descLow.includes('aceita financiamento')) caracs.push('aceita-financiamento');

  const photoRegex = /https:\/\/img\.dfimoveis\.com\.br\/fotos\/\d+\/[a-zA-Z0-9_\.]+/gi;
  const fotosSet = new Set();
  let photoM;
  while ((photoM = photoRegex.exec(html)) !== null) {
    fotosSet.add(photoM[0]);
  }
  const fotos = Array.from(fotosSet);

  return {
    titulo,
    descricao,
    tipo,
    finalidade,
    valor,
    status: 'disponivel',
    destaque: false,
    cidade,
    bairro,
    endereco: enderecoRaw || `${bairro}, Brasília – DF`,
    areaUtil,
    areaTotal: areaUtil,
    quartos,
    suites,
    banheiros,
    vagas,
    caracteristicas: caracs,
    fotos,
    corretorId: 'corretor-1',
    dfImoveisId: dfId,
    linkDFImoveis: url,
  };
}

async function sincronizar() {
  console.log('🔍 [1/3] Varrendo perfil no DF Imóveis para coletar anúncios...');
  const propertyUrls = new Set();

  for (let page = 1; page <= 5; page++) {
    const pageUrl = page === 1 
      ? 'https://www.dfimoveis.com.br/anunciante/edilson-carlos--3183'
      : `https://www.dfimoveis.com.br/anunciante/edilson-carlos--3183?pagina=${page}`;
    
    const html = fetchHtml(pageUrl);
    const regex = /href=["'](\/imovel\/[^"']+)["']/gi;
    let m;
    let countThisPage = 0;
    while ((m = regex.exec(html)) !== null) {
      const fullUrl = `https://www.dfimoveis.com.br${m[1].split('?')[0]}`;
      if (!propertyUrls.has(fullUrl)) {
        propertyUrls.add(fullUrl);
        countThisPage++;
      }
    }
    if (countThisPage === 0) break;
  }

  const urls = Array.from(propertyUrls);
  console.log(`✅ ${urls.length} anúncios encontrados no DF Imóveis.\n`);

  console.log('📥 [2/3] Extraindo dados completos e fotos de cada imóvel...');
  const imoveisExtraidos = [];
  let totalFotos = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const html = fetchHtml(url);
      const dados = parseImovel(html, url);
      imoveisExtraidos.push(dados);
      totalFotos += dados.fotos.length;
      console.log(`[${i + 1}/${urls.length}] 📸 "${dados.titulo.slice(0, 32)}" — ${dados.fotos.length} fotos`);
    } catch (err) {
      console.error(`[${i + 1}/${urls.length}] ❌ Erro em ${url}:`, err.message);
    }
  }

  // Marcar primeiros 6 como destaque
  for (let i = 0; i < Math.min(6, imoveisExtraidos.length); i++) {
    imoveisExtraidos[i].destaque = true;
  }

  // Salvar cópia local em JSON
  writeFileSync(
    new URL('../data/imoveis-dfimoveis.json', import.meta.url),
    JSON.stringify(imoveisExtraidos, null, 2),
    'utf-8'
  );
  writeFileSync(
    new URL('../data/imoveis-iniciais.json', import.meta.url),
    JSON.stringify(imoveisExtraidos, null, 2),
    'utf-8'
  );

  console.log(`\n💾 Arquivos JSON locais atualizados com ${imoveisExtraidos.length} imóveis e ${totalFotos} fotos.`);

  console.log('\n🔐 [3/3] Conectando ao Firebase para sincronizar o catálogo...');
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_SENHA);
  console.log(`✅ Logado com sucesso como ${ADMIN_EMAIL}`);

  const colRef = collection(db, 'imoveis');
  const snapshots = await getDocs(colRef);

  // Limpa imóveis anteriores (para substituir pelos reais com fotos)
  console.log(`🗑️ Removendo ${snapshots.size} registros antigos do Firestore...`);
  for (const docSnap of snapshots.docs) {
    await deleteDoc(doc(db, 'imoveis', docSnap.id));
  }

  console.log('⬆️ Enviando os 38 imóveis reais com todas as fotos para o Firestore...');
  const agora = Timestamp.now();
  let enviados = 0;

  for (const im of imoveisExtraidos) {
    await addDoc(colRef, {
      ...im,
      dataCadastro: agora,
      dataAtualizacao: agora,
    });
    enviados++;
    process.stdout.write(`\r🚀 Enviados: ${enviados}/${imoveisExtraidos.length}`);
  }

  console.log(`\n\n🎉 SUCESSO! Todos os ${enviados} imóveis e ${totalFotos} fotos estão salvos e visíveis no site!`);
  process.exit(0);
}

sincronizar().catch(err => {
  console.error('\n❌ Erro na sincronização:', err);
  process.exit(1);
});
