/* =============================================
   UTILITÁRIOS — WhatsApp
   Monta links wa.me com mensagem pré-preenchida
   ============================================= */

import { SITE } from '../config/site.js';

/**
 * Gera o link do WhatsApp para contato sobre um imóvel específico
 * @param {object} imovel - dados do imóvel
 * @param {string} numeroWpp - número do WhatsApp (padrão: do site)
 */
export function linkWhatsappImovel(imovel, numeroWpp = SITE.whatsapp) {
  const titulo   = imovel?.titulo   ?? 'imóvel';
  const codigo   = imovel?.codigo   ?? imovel?.id ?? '';
  const cidade   = imovel?.cidade   ?? '';
  const valor    = imovel?.valor    ?? null;

  const precoTexto = valor
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(valor)
    : 'valor a consultar';

  const urlImovel = imovel?.id
    ? `${window.location.origin}/imoveis/${imovel.id}`
    : '';

  const mensagem = [
    `Olá! Tenho interesse no imóvel *${titulo}*`,
    cidade ? `em *${cidade}*` : '',
    `por *${precoTexto}*`,
    codigo ? `(Cód: ${codigo})` : '',
    urlImovel ? `\n🔗 ${urlImovel}` : '',
    `\nPoderia me dar mais informações?`,
  ]
    .filter(Boolean)
    .join(' ');

  return `https://wa.me/${numeroWpp}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Gera o link do WhatsApp genérico (sem imóvel específico)
 * @param {string} numeroWpp
 */
export function linkWhatsappGeral(numeroWpp = SITE.whatsapp) {
  const mensagem = 'Olá! Gostaria de informações sobre imóveis disponíveis.';
  return `https://wa.me/${numeroWpp}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Gera o link do Instagram
 * @param {string} usuario
 */
export function linkInstagram(usuario = SITE.instagram) {
  return `https://www.instagram.com/${usuario}`;
}

/**
 * Gera o link de e-mail
 * @param {string} email
 * @param {object} imovel
 */
export function linkEmail(email = SITE.email, imovel = null) {
  const assunto = imovel
    ? `Interesse no imóvel: ${imovel.titulo}`
    : 'Interesse em imóveis';
  return `mailto:${email}?subject=${encodeURIComponent(assunto)}`;
}
