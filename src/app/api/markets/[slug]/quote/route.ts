import { NextResponse } from 'next/server';
import { getQuote } from '@/lib/demoStore';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json();
    const side = body.side === 'sell' ? 'sell' : 'buy';
    const amount = side === 'sell' ? Number(body.shares) : Number(body.amount);
    const quote = getQuote(params.slug, String(body.outcomeId), amount, side);
    return NextResponse.json({ quote });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to quote trade' },
      { status: 400 },
    );
  }
}
