import { NextResponse } from 'next/server';
import { petitionGate, readPetitionBody } from '@/lib/petitionApi';
import { validateSignature } from '@/lib/petitionValidation';
import { requestSignature } from '@/lib/petitionStore';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const blocked = petitionGate(request); if (blocked) return blocked;
  let input;
  try { input = validateSignature(await readPetitionBody(request)); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Date invalide.' }, { status: 400 }); }
  try {
    await requestSignature(input.name, input.email);
    return NextResponse.json({ message: 'Mulțumim! Cererea ta de susținere a fost primită. Nu trebuie să confirmi emailul. Fiecare adresă este înregistrată o singură dată pentru această versiune; trimitem un email de mulțumire la o înregistrare nouă.' }, { status: 200 });
  } catch (error) {
    const limited = error instanceof Error && error.message === 'RATE_LIMIT';
    return NextResponse.json({ error: limited ? 'Prea multe cereri. Încearcă din nou peste un minut.' : 'Nu am putut finaliza cererea. Încearcă din nou mai târziu.' }, { status: limited ? 429 : 503 });
  }
}
