export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getPortfolio } from '@/lib/demoStore';

export async function GET(_request: Request, { params }: { params: { address: string } }) {
  try {
    return NextResponse.json(getPortfolio(params.address));
  } catch (error) {
    return NextResponse.json({ error: error instanceof SyntaxError ? 'Formatul cererii este invalid.' : error instanceof TypeError ? 'Datele cererii sunt invalide.' : error instanceof Error ? error.message : 'Contul demonstrativ este invalid' }, { status: 400 });
  }
}
