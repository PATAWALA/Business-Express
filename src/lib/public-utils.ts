// src/lib/public-utils.ts

export const WHATSAPP_NUMBER = "243970000000";
export const WHATSAPP_AGENT = "Prince Bockson";

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}