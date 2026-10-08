/* =============================================
   OPÇÕES / LISTAS FIXAS DO SISTEMA
   Tipos, cidades, características, etc.
   ============================================= */

/* ── Tipos de Imóvel ── */
export const TIPOS_IMOVEL = [
  { valor: 'casa',          label: 'Casa',              icone: '🏠' },
  { valor: 'apartamento',   label: 'Apartamento',       icone: '🏢' },
  { valor: 'lote',          label: 'Lote / Terreno / Área', icone: '📐' },
  { valor: 'rural',         label: 'Rural / Chácara',   icone: '🌿' },
  { valor: 'loja',          label: 'Loja / Comercial',  icone: '🏪' },
];

/* ── Finalidade ── */
export const FINALIDADES = [
  { valor: 'venda',   label: 'Venda' },
  { valor: 'aluguel', label: 'Aluguel' },
];

/* ── Status ── */
export const STATUS_IMOVEL = [
  { valor: 'disponivel', label: 'Disponível' },
  { valor: 'vendido',    label: 'Vendido' },
  { valor: 'reservado',  label: 'Reservado' },
];

/* ── Cidades / Regiões do DF ── */
export const CIDADES_DF = [
  { valor: 'asa-sul',       label: 'Brasília – Asa Sul' },
  { valor: 'asa-norte',     label: 'Brasília – Asa Norte' },
  { valor: 'lago-sul',      label: 'Brasília – Lago Sul' },
  { valor: 'lago-norte',    label: 'Brasília – Lago Norte' },
  { valor: 'noroeste',      label: 'Brasília – Noroeste' },
  { valor: 'sudoeste',      label: 'Brasília – Sudoeste' },
  { valor: 'octogonal',     label: 'Brasília – Octogonal' },
  { valor: 'cruzeiro',      label: 'Cruzeiro' },
  { valor: 'taguatinga',    label: 'Taguatinga' },
  { valor: 'aguas-claras',  label: 'Águas Claras' },
  { valor: 'ceilandia',     label: 'Ceilândia' },
  { valor: 'samambaia',     label: 'Samambaia' },
  { valor: 'guara',         label: 'Guará' },
  { valor: 'gama',          label: 'Gama' },
  { valor: 'sobradinho',    label: 'Sobradinho' },
  { valor: 'planaltina',    label: 'Planaltina' },
  { valor: 'park-way',      label: 'Park Way' },
  { valor: 'jardim-botanico',label: 'Jardim Botânico' },
  { valor: 'sao-sebastiao', label: 'São Sebastião' },
  { valor: 'vicente-pires', label: 'Vicente Pires' },
  { valor: 'arniqueiras',   label: 'Arniqueiras' },
  { valor: 'riacho-fundo',  label: 'Riacho Fundo' },
  { valor: 'recanto-emas',  label: 'Recanto das Emas' },
  { valor: 'santa-maria',   label: 'Santa Maria' },
  { valor: 'nucleo-bandeirante', label: 'Núcleo Bandeirante' },
  { valor: 'candangolandia', label: 'Candangolândia' },
  { valor: 'paranoa',       label: 'Paranoá' },
  { valor: 'itapoa',        label: 'Itapoã' },
  { valor: 'brazlandia',    label: 'Brazlândia' },
  { valor: 'outro',         label: 'Outro Local (fora do DF)' },
];

/* ── Características / Diferenciais ── */
export const CARACTERISTICAS = [
  { valor: 'piscina',             label: 'Piscina',                icone: '🏊' },
  { valor: 'churrasqueira',       label: 'Churrasqueira',          icone: '🔥' },
  { valor: 'ar-condicionado',     label: 'Ar-Condicionado',        icone: '❄️' },
  { valor: 'area-gourmet',        label: 'Área Gourmet',           icone: '🍽️' },
  { valor: 'armarios-embutidos',  label: 'Armários Embutidos',     icone: '🚪' },
  { valor: 'varanda',             label: 'Varanda / Sacada',       icone: '🌅' },
  { valor: 'elevador',            label: 'Elevador',               icone: '🛗' },
  { valor: 'portaria',            label: 'Portaria 24h',           icone: '🏛️' },
  { valor: 'academia',            label: 'Academia',               icone: '💪' },
  { valor: 'playground',          label: 'Playground',             icone: '🎠' },
  { valor: 'salao-festas',        label: 'Salão de Festas',        icone: '🎉' },
  { valor: 'quadra',              label: 'Quadra Esportiva',       icone: '⚽' },
  { valor: 'sauna',               label: 'Sauna',                  icone: '🧖' },
  { valor: 'despensa',            label: 'Despensa / Lavanderia',  icone: '🧺' },
  { valor: 'escritorio',          label: 'Escritório / Home Office',icone: '💼' },
  { valor: 'jardim',              label: 'Jardim / Quintal',       icone: '🌳' },
  { valor: 'seguranca',           label: 'Sistema de Segurança',   icone: '🔒' },
  { valor: 'energia-solar',       label: 'Energia Solar',          icone: '☀️' },
  { valor: 'aceita-financiamento',label: 'Aceita Financiamento',   icone: '🏦' },
  { valor: 'aceita-permuta',      label: 'Aceita Permuta',         icone: '🔄' },
  { valor: 'mobiliado',           label: 'Mobiliado',              icone: '🛋️' },
  { valor: 'semi-mobiliado',      label: 'Semi-Mobiliado',         icone: '🪑' },
  { valor: 'pet-friendly',        label: 'Pet Friendly',           icone: '🐾' },
  { valor: 'acessibilidade',      label: 'Acessibilidade',         icone: '♿' },
];

/* ── Opções de quartos / suítes / garagem ── */
export const OPCOES_NUMERO = [
  { valor: '',  label: 'Qualquer' },
  { valor: '1', label: '1+' },
  { valor: '2', label: '2+' },
  { valor: '3', label: '3+' },
  { valor: '4', label: '4+' },
  { valor: '5', label: '5+' },
];

/* ── Ordenação ── */
export const ORDENACOES = [
  { valor: 'recentes',    label: 'Mais Recentes' },
  { valor: 'menor-preco', label: 'Menor Preço' },
  { valor: 'maior-preco', label: 'Maior Preço' },
  { valor: 'menor-area',  label: 'Menor Área' },
  { valor: 'maior-area',  label: 'Maior Área' },
];

/* ── Faixas de valor (para slider / select) ── */
export const VALOR_MIN = 0;
export const VALOR_MAX = 10_000_000;
export const AREA_MIN  = 0;
export const AREA_MAX  = 5_000;
