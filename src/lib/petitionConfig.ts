export function getPetitionConfig() {
  const organizer = process.env.PETITION_ORGANIZER?.trim() || 'Marketz.ro';
  const contact = process.env.PETITION_CONTACT_EMAIL?.trim() || '';
  const origin = process.env.PETITION_ORIGIN?.replace(/\/$/, '') || '';
  let validOrigin = false;
  try { const url = new URL(origin); validOrigin = url.protocol === 'https:' && url.origin === origin; } catch { /* Not configured. */ }
  return {
    organizer, contact, origin,
    enabled: process.env.PETITION_ENABLED === 'true' && process.env.PETITION_PRIVACY_READY === 'true' && Boolean(organizer && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && validOrigin && process.env.MONGODB_URI && process.env.RESEND_API_KEY && process.env.PETITION_FROM_EMAIL),
  };
}
