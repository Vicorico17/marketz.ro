import { NextResponse } from 'next/server';
import { faucetWallet } from '@/lib/demoStore';

export async function POST(request: Request, { params }: { params: { address: string } }) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ wallet: faucetWallet(params.address, Number(body.amount) || 250) });
}
