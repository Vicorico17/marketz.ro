import { NextResponse } from 'next/server';
import { placeTrade } from '@/lib/demoStore';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json();
    const result = placeTrade({
      marketSlug: params.slug,
      walletAddress: String(body.walletAddress),
      outcomeId: String(body.outcomeId),
      amount: Number(body.amount),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to place trade' },
      { status: 400 },
    );
  }
}
