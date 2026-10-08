/* =============================================
   CONFIGURAÇÕES DO SITE — Dados dos Corretores
   Edite aqui: nome, CRECI, WhatsApp, redes sociais
   ============================================= */

export const SITE = {
  nome: 'Edilson & Parceiros Imóveis',
  slogan: 'Cada chave entregue é um sonho que ganha endereço.',
  sloganAlt: 'Mais que vender imóveis, a gente abre portas para a vida que você merece.',
  descricao: 'Especialistas no mercado imobiliário do Distrito Federal com anos de experiência, atendimento personalizado e compromisso com a realização dos seus sonhos.',

  /* ── Redes sociais e contato ── */
  whatsapp: '5561985569820',      // 55 + DDD + número (sem espaços ou traços)
  instagram: 'ecarlossantos43',     // apenas o @ sem o arroba
  email: 'ecarlossantos43@gmail.com',
  linkDFImoveis: 'https://www.dfimoveis.com.br/anunciante/edilson-carlos--3183',  // link do perfil no DF Imóveis

  /* ── SEO ── */
  urlBase: 'https://ecarlossantos43.netlify.app',
};

export const CORRETORES = [
  {
    id: 'corretor-1',
    nome: 'Edilson Carlos dos Santos',
    creci: 'CRECI-DF 6037',
    foto: '/img/corretor-1.jpg',    // coloque a foto em public/img/
    whatsapp: '5561985569820',
    instagram: 'edilsonimoveis',
    email: 'edilson@edilsonimoveis.com.br',
    bio: 'Corretor experiente com atuação em todo o Distrito Federal. Especialista em imóveis residenciais e comerciais.',
    dfImoveis: 'https://www.dfimoveis.com.br/corretor/edilson',
  },
  {
    id: 'corretor-2',
    nome: 'Nome do Parceiro',          // ← substitua pelo nome real
    creci: 'CRECI-DF XXXXX',            // ← substitua pelo CRECI real
    foto: '/img/corretor-2.jpg',
    whatsapp: '5561888888888',
    instagram: 'parceiroimoveis',
    email: 'parceiro@edilsonimoveis.com.br',
    bio: 'Especialista em imóveis de alto padrão e investimentos no DF.',
    dfImoveis: 'https://www.dfimoveis.com.br/corretor/parceiro',
  },
];
