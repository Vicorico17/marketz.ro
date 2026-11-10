export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createMarket, getSnapshot } from '@/lib/demoStore';
import type { CreateMarketInput } from '@/types/market';

function isAdmin(request: Request) {
  const expected = process.env.ADMIN_MOCK_KEY || (process.env.NODE_ENV === 'development' ? 'marketz-admin' : '');
  return Boolean(expected) && request.headers.get('x-admin-key') === expected;
}

export async function GET() {
  return NextResponse.json(getSnapshot());
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Cheia de administrator este invalidă' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreateMarketInput;
    const market = createMarket(body);
    return NextResponse.json({ market }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof SyntaxError ? 'Formatul cererii este invalid.' : error instanceof TypeError ? 'Datele cererii sunt invalide.' : error instanceof Error ? error.message : 'Crearea pieței a eșuat' },
      { status: 400 },
    );
  }
}
