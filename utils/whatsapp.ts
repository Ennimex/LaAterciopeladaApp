// Único punto de la app que arma enlaces de WhatsApp. El número sale de la
// configuración del sitio (redesSociales.whatsapp), en cualquier formato.
const LADA_MEXICO = '52';

export const numeroWhatsApp = (config: any): string | null => {
  const crudo = String(config?.redesSociales?.whatsapp || '').trim();
  if (!crudo) return null;
  const sinQuery = crudo.split('?')[0];
  const trasWaMe = sinQuery.includes('wa.me/') ? sinQuery.split('wa.me/')[1] : sinQuery;
  const digitos = trasWaMe.replace(/\D/g, '');
  if (digitos.length === 10) return LADA_MEXICO + digitos;
  if (digitos.length >= 11 && digitos.length <= 15) return digitos;
  return null;
};

export const urlWhatsApp = (config: any, texto = ''): string | null => {
  const numero = numeroWhatsApp(config);
  if (!numero) return null;
  const base = `https://wa.me/${numero}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
};
