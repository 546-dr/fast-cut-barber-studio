export function sanitizeWhatsAppNumber(phone: string): string {
  if (!phone) return '51927168320';

  const digitsOnly = phone.replace(/\D/g, '');

  return digitsOnly || '51927168320';
}

export function buildWhatsAppLink(
  phone: string,
  message?: string
): string {
  const cleanNumber = sanitizeWhatsAppNumber(phone);

  if (!message || !message.trim()) {
    return `https://wa.me/${cleanNumber}`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message.trim())}`;
}