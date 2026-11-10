export const petitionVersion = '2026-11-10-v2';
export const privacyVersion = '2026-11-10-v1';
export function validateSignature(body: unknown) {
  if (!body || typeof body !== 'object') throw new Error('Date invalide.');
  const data = body as Record<string, unknown>;
  if (data.website) throw new Error('Cererea nu poate fi procesată.');
  if (data.consent !== true || data.version !== petitionVersion) throw new Error('Citește petiția și confirmă acordul pentru versiunea curentă.');
  const name = typeof data.name === 'string' ? data.name.trim().replace(/\s+/g, ' ') : '';
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (name.length < 3 || name.length > 120 || /[<>\r\n\x00-\x1f]/.test(name)) throw new Error('Introdu numele și prenumele (3–120 caractere).');
  if (email.length > 254 || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) throw new Error('Introdu o adresă de email validă.');
  return { name, email };
}
