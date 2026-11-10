export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getMarket, resolveMarket, updateMarket } from '@/lib/demoStore';
import type { MarketStatus, ResolveMarketInput } from '@/types/market';

function isAdmin(request: Request) {
  const expected = process.env.ADMIN_MOCK_KEY || (process.env.NODE_ENV === 'development' ? 'marketz-admin' : '');
  return Boolean(expected) && request.headers.get('x-admin-key') === expected;
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const market = getMarket(params.slug);
  if (!market) {
    return NextResponse.json({ error: 'Piața nu a fost găsită' }, { status: 404 });
  }

  return NextResponse.json(market);
}

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Cheia de administrator este invalidă' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (body.action === 'resolve') {
      const market = resolveMarket(params.slug, body as ResolveMarketInput);
      return NextResponse.json({ market });
    }

    const allowedStatuses: MarketStatus[] = ['draft', 'open', 'closed', 'voided'];
    if (body.status !== undefined && !allowedStatuses.includes(body.status)) throw new Error('Stare invalidă');
    const status = allowedStatuses.includes(body.status) ? body.status : undefined;
    const market = updateMarket(params.slug, {
      status,
      closeAt: body.closeAt,
      description: body.description,
      resolutionSource: body.resolutionSource,
    });

    return NextResponse.json({ market });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof SyntaxError ? 'Formatul cererii este invalid.' : error instanceof TypeError ? 'Datele cererii sunt invalide.' : error instanceof Error ? error.message : 'Actualizarea pieței a eșuat' },
      { status: 400 },
    );
  }
}
