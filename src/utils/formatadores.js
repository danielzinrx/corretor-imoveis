/* =============================================
   UTILITÁRIOS — Formatadores
   ============================================= */

/**
 * Formata um número como moeda brasileira (R$)
 * @param {number} valor
 * @param {boolean} abreviado - se true, usa K/M para valores grandes
 */
export function formatarMoeda(valor, abreviado = false) {
  if (!valor && valor !== 0) return 'Consulte';

  if (abreviado) {
    if (valor >= 1_000_000) {
      return `R$ ${(valor / 1_000_000).toFixed(valor % 1_000_000 === 0 ? 0 : 1)} Mi`;
    }
    if (valor >= 1_000) {
      return `R$ ${(valor / 1_000).toFixed(valor % 1_000 === 0 ? 0 : 0)} Mil`;
    }
  }

  return new Intl.NumberFormat('pt-BR', {
    style:    'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

/**
 * Formata uma área em m²
 * @param {number} area
 */
export function formatarArea(area) {
  if (!area && area !== 0) return '—';
  return `${new Intl.NumberFormat('pt-BR').format(area)} m²`;
}

/**
 * Formata uma data do Firestore (Timestamp ou Date ou string ISO)
 * @param {*} data
 */
export function formatarData(data) {
  if (!data) return '—';
  let d;
  if (data?.toDate) {
    d = data.toDate();
  } else if (data instanceof Date) {
    d = data;
  } else {
    d = new Date(data);
  }
  return new Intl.DateTimeFormat('pt-BR', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
  }).format(d);
}

/**
 * Retorna a label de um tipo de imóvel a partir do valor
 * @param {string} tipo
 * @param {Array}  tipos - lista de TIPOS_IMOVEL
 */
export function labelTipo(tipo, tipos) {
  return tipos?.find(t => t.valor === tipo)?.label ?? tipo;
}

/**
 * Retorna a label de uma cidade a partir do valor
 */
export function labelCidade(cidade, cidades) {
  return cidades?.find(c => c.valor === cidade)?.label ?? cidade;
}

/**
 * Trunca um texto no número de caracteres informado
 */
export function truncar(texto, max = 120) {
  if (!texto) return '';
  return texto.length <= max ? texto : texto.slice(0, max).trimEnd() + '…';
}

/**
 * Converte valor de filtro de área/preço para número
 */
export function toNum(val) {
  return val === '' || val === null || val === undefined ? null : Number(val);
}
