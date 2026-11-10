export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { faucetWallet } from '@/lib/demoStore';

export async function POST(request: Request, { params }: { params: { address: string } }) {
  try {
    const body = await request.json();
    return NextResponse.json({ wallet: faucetWallet(params.address, body.amount === undefined ? 250 : Number(body.amount)) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof SyntaxError ? 'Formatul cererii este invalid.' : error instanceof TypeError ? 'Datele cererii sunt invalide.' : error instanceof Error ? error.message : 'Cererea de credite demonstrative este invalidă' }, { status: 400 });
  }
}
