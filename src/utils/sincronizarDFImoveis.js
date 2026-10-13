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

function decodificarHtml(str) {
  if (!str) return '';
  return str
    .replace(/&#(\d+);/g, (_, code) => {
      try { return String.fromCodePoint(Number(code)); } catch { return ''; }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
      try { return String.fromCodePoint(parseInt(code, 16)); } catch { return ''; }
    })
    .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í').replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú')
    .replace(/&atilde;/gi, 'ã').replace(/&otilde;/gi, 'õ').replace(/&ccedil;/gi, 'ç')
    .replace(/&Aacute;/g, 'Á').replace(/&Eacute;/g, 'É').replace(/&Iacute;/g, 'Í').replace(/&Oacute;/g, 'Ó').replace(/&Uacute;/g, 'Ú')
    .replace(/&Atilde;/g, 'Ã').replace(/&Otilde;/g, 'Õ').replace(/&Ccedil;/g, 'Ç')
    .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&sup2;/gi, '²');
}

function normalizarTexto(txt) {
  return decodificarHtml(txt || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SIGLAS = new Set([
  'DF', 'GO', 'BR', 'QN', 'QSB', 'CLN', 'QSD', 'CLS', 'CSB', 'CNC', 'SCS', 'QNA',
  'QNH', 'SMPW', 'SHA', 'RUV', 'BPM', 'PMDF', 'CRECI', 'W3', 'SHIS', 'SHIN', 'EQN',
  'EQS', 'SQN', 'SQS', 'SRES', 'QE', 'QI', 'QL', 'SMU', 'SIA', 'SCIA', 'SOF',
  'SAAN', 'SGAN', 'SGAS', 'CRU', 'CA', 'QNJ', 'QNM', 'QNN', 'QNO', 'SHVP',
  'EPTG', 'EPNB', 'EPPR', 'EPTT', 'ED', 'RES', 'KM', 'BL', 'LT', 'CJ'
]);

const PREPOSICOES = new Set([
  'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos',
  'e', 'a', 'o', 'as', 'os', 'com', 'por', 'para'
]);

function capitalizarInteligente(txt) {
  if (!txt) return '';
  let s = normalizarTexto(txt)
    .replace(/chacar[áa]/gi, 'Chácara')
    .replace(/sitio/gi, 'Sítio')
    .replace(/itau/gi, 'Itaú')
    .replace(/[!]{2,}/g, '')
    .replace(/[?]{2,}/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return s.split(' ').map((palavra, idx) => {
    const match = palavra.match(/^([(\[{]*)([\p{L}\p{N}]+)([)\]},.:;!?-]*)$/u);
    if (!match) return palavra;
    const [, pref, core, suf] = match;
    const coreUpper = core.toUpperCase();
    const coreLower = core.toLowerCase();

    if (SIGLAS.has(coreUpper) || (/^[A-Z0-9]{2,5}$/.test(coreUpper) && /\d/.test(coreUpper))) {
      return pref + coreUpper + suf;
    }
    if (/^(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i.test(coreUpper)) {
      return pref + coreUpper + suf;
    }
    if (idx > 0 && PREPOSICOES.has(coreLower)) {
      return pref + coreLower + suf;
    }
    const cap = core.charAt(0).toUpperCase() + core.slice(1).toLowerCase();
    return pref + cap + suf;
  }).join(' ').replace(/\s+-\s+$/, '').trim();
}

function limparDescricao(desc) {
  if (!desc) return '';
  let txt = normalizarTexto(desc);

  // Limpar termos de mascaramento do DF Imóveis e erros ortográficos comuns
  txt = txt
    .replace(/61\.\s*Ligue\s+Agora/gi, '(61) 98556-9820')
    .replace(/Ligue\s+Agora\s*\d*/gi, '')
    .replace(/\bprop[ií]cia para laser\b/gi, 'propícia para lazer')
    .replace(/\bpara laser\b/gi, 'para lazer')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();

  return txt;
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
  let rawTitulo = h1Match ? normalizarTexto(h1Match[1]) : '';
  if (!rawTitulo) {
    const ogTitle = html.match(/<meta property="og:title" content="([^"]*)"/i);
    rawTitulo = ogTitle ? ogTitle[1].replace(/ - DFimoveis\.com/i, '') : 'Imóvel';
  }
  const titulo = capitalizarInteligente(rawTitulo);

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

  let rawDesc = '';
  const descMatch = html.match(/<div class=["']assined-imv[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (descMatch) {
    rawDesc = descMatch[1];
  } else {
    const ogDesc = html.match(/<meta property="og:description" content="([^"]*)"/i);
    rawDesc = ogDesc ? ogDesc[1] : '';
  }
  const descricao = limparDescricao(rawDesc);

  let areaUtil = 0;
  const areaMatch = html.match(/itemprop=["']floorSize["'][^>]*>([\s\S]*?)<\/[a-z0-9]+>/i);
  if (areaMatch) {
    const rawText = areaMatch[1].toLowerCase();
    const isHectare = /ha\b|hectare/i.test(rawText);
    const isAlqueire = /alqueire/i.test(rawText);
    const rawVal = rawText.replace(/[^\d,.]/g, '').replace(',', '.');
    let val = parseFloat(rawVal) || 0;
    if (isHectare) {
      val = val * 10000;
    } else if (isAlqueire) {
      val = val * 48400;
    }
    areaUtil = Math.round(val);
  }

  // Se a área for muito pequena (< 50) e for rural ou lote, procurar na descrição
  if (areaUtil < 50 && (tipo === 'rural' || tipo === 'lote')) {
    const descHectare = descricao.match(/(\d+(?:[.,]\d+)?)\s*(?:ha|hectares?)/i);
    if (descHectare) {
      const val = parseFloat(descHectare[1].replace(',', '.'));
      if (val > 0) areaUtil = Math.round(val * 10000);
    } else {
      const descM2 = descricao.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²)/i);
      if (descM2) {
        const val = parseFloat(descM2[1].replace(',', '.'));
        if (val > 0) areaUtil = Math.round(val);
      }
    }
  }

  let areaTotal = areaUtil;
  const loteMatch = descricao.match(/lote\s*(?:de\s*)?(\d+)\s*(?:m2|m²|m\b)/i)
                 || descricao.match(/terreno\s*(?:de\s*)?(\d+)\s*(?:m2|m²|m\b)/i);
  if (loteMatch) {
    const loteVal = parseInt(loteMatch[1], 10);
    if (loteVal > 0) areaTotal = loteVal;
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
  const partesEnd = enderecoRaw.split('-').map(s => capitalizarInteligente(s)).filter(Boolean);
  const removerAcentos = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const partesUnicas = partesEnd.filter((p, i, arr) => arr.findIndex(x => removerAcentos(x) === removerAcentos(p)) === i);

  const bairro = partesUnicas[0] || 'Distrito Federal';
  const cidade = detectarCidade(`${url} ${enderecoRaw} ${titulo}`);
  const endereco = partesUnicas.join(' - ') || `${bairro}, Brasília – DF`;

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
    endereco,
    areaUtil,
    areaTotal,
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
