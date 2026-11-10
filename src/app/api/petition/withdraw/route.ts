import { NextResponse } from 'next/server';
import { petitionGate, readPetitionBody } from '@/lib/petitionApi';
import { withdrawSignature } from '@/lib/petitionStore';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const blocked = petitionGate(request, true); if (blocked) return blocked;
  let token: unknown;
  try { token = (await readPetitionBody(request)).token; } catch { return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 }); }
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Link invalid.' }, { status: 400 });
  try {
    const success = await withdrawSignature(token);
    return NextResponse.json(success ? { message: 'Susținerea și datele asociate au fost șterse.' } : { error: 'Link invalid, expirat sau deja folosit.' }, { status: success ? 200 : 400 });
  } catch { return NextResponse.json({ error: 'Serviciul nu este disponibil. Încearcă din nou.' }, { status: 503 }); }
}
