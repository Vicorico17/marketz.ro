import { NextResponse } from 'next/server';
import { getPetitionConfig } from './petitionConfig';
export function petitionGate(request: Request, management = false) {
  const config = getPetitionConfig();
  if (!(management ? Boolean(config.origin && process.env.MONGODB_URI) : config.enabled)) return NextResponse.json({ error: 'Colectarea nu este încă deschisă. Nicio susținere nu a fost înregistrată.' }, { status: 503 });
  if (request.headers.get('origin') !== config.origin) return NextResponse.json({ error: 'Originea cererii nu este acceptată.' }, { status: 403 });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return NextResponse.json({ error: 'Format invalid.' }, { status: 415 });
  return null;
}
export async function readPetitionBody(request: Request) {
  // Enforce bytes while streaming, even if Content-Length is absent or dishonest.
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Cerere goală.');
  const chunks: Uint8Array[] = []; let length = 0;
  try {
    while (true) { const { done, value } = await reader.read(); if (done) break; length += value.byteLength; if (length > 4096) { await reader.cancel(); throw new Error('Cererea este prea mare.'); } chunks.push(value); }
  } finally { reader.releaseLock(); }
  const data = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(data));
}
