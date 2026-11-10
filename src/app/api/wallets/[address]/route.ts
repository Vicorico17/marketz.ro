export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getOrCreateWallet } from '@/lib/demoStore';

export async function GET(_request: Request, { params }: { params: { address: string } }) {
  try {
    return NextResponse.json({ wallet: getOrCreateWallet(params.address) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid wallet' }, { status: 400 });
  }
}
