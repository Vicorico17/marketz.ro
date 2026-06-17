import { NextResponse } from 'next/server';
import { getOrCreateWallet } from '@/lib/demoStore';

export async function GET(_request: Request, { params }: { params: { address: string } }) {
  return NextResponse.json({ wallet: getOrCreateWallet(params.address) });
}
