import { NextResponse } from 'next/server';
import { getPortfolio } from '@/lib/demoStore';

export async function GET(_request: Request, { params }: { params: { address: string } }) {
  return NextResponse.json(getPortfolio(params.address));
}
