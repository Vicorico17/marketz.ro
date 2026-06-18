'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ExternalLink, TrendingUp } from 'lucide-react';
import { toPercent } from '@/lib/marketMath';
import type { Position, Trade, WalletAccount } from '@/types/market';

interface PortfolioPanelProps {
  address: string | null;
  refreshKey?: number;
}

interface PortfolioData {
  wallet: WalletAccount;
  positions: Position[];
  trades: Trade[];
}

export function PortfolioPanel({ address, refreshKey }: PortfolioPanelProps) {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    if (!address) {
      setData(null);
      return;
    }

    let isMounted = true;
    fetch(`/api/wallets/${address}/portfolio`)
      .then((response) => response.json())
      .then((nextData) => {
        if (isMounted) {
          setData(nextData);
        }
      })
      .catch(() => {
        if (isMounted) {
          setData(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [address, refreshKey]);

  if (!address) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-400">
        Conectează un wallet mock pentru portofoliu, poziții și istoric.
      </div>
    );
  }

  if (!data) {
    return <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-400">Se încarcă portofoliul...</div>;
  }

  const markValue = data.positions.reduce((sum, position) => sum + position.markValue, 0);
  const costBasis = data.positions.reduce((sum, position) => sum + position.costBasis, 0);
  const realizedPnl = data.positions.reduce((sum, position) => sum + (position.realizedPnl || 0), 0);
  const activePositions = data.positions.filter((position) => position.shares > 0);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Portofoliu</div>
          <div className="mt-1 text-2xl font-bold text-white">{markValue.toLocaleString('ro-RO')} mRON</div>
        </div>
        <div className="grid gap-2 text-right">
          <div className="rounded-lg border border-zinc-800 bg-black px-3 py-2">
            <div className="text-xs text-zinc-500">PnL nerealizat</div>
            <div className={markValue - costBasis >= 0 ? 'font-semibold text-emerald-300' : 'font-semibold text-red-300'}>
              {(markValue - costBasis).toLocaleString('ro-RO')} mRON
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-black px-3 py-2">
            <div className="text-xs text-zinc-500">PnL realizat</div>
            <div className={realizedPnl >= 0 ? 'font-semibold text-emerald-300' : 'font-semibold text-red-300'}>
              {realizedPnl.toLocaleString('ro-RO')} mRON
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {activePositions.slice(0, 5).map((position) => (
          <Link
            href={`/markets/${position.marketSlug}`}
            key={position.id}
            className="block rounded-md border border-zinc-800 bg-black p-3 transition hover:border-zinc-700"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">{position.outcomeLabel}</div>
                <div className="line-clamp-1 text-xs text-zinc-500">{position.marketQuestion}</div>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-zinc-600" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400">
              <span>{position.shares.toLocaleString('ro-RO')} shares</span>
              <span>{toPercent(position.currentProbability)}%</span>
              <span className={position.unrealizedPnl >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                {position.unrealizedPnl.toLocaleString('ro-RO')}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {activePositions.length === 0 && (
        <div className="rounded-md border border-dashed border-zinc-800 p-5 text-center text-sm text-zinc-500">
          Nu ai poziții încă.
        </div>
      )}

      <div className="mt-5 border-t border-zinc-800 pt-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-300">
          <TrendingUp className="h-4 w-4 text-emerald-300" />
          Ultimele trade-uri
        </div>
        <div className="space-y-2">
          {data.trades.slice(0, 4).map((trade) => (
            <div key={trade.id} className="flex items-center justify-between gap-3 text-xs text-zinc-500">
              <span className="truncate">
                {trade.side === 'sell' ? 'Vândut' : 'Cumpărat'} · {trade.outcomeLabel}
              </span>
              <span className="shrink-0 text-zinc-300">{trade.amount.toLocaleString('ro-RO')} mRON</span>
            </div>
          ))}
          {data.trades.length === 0 && <div className="text-xs text-zinc-500">Fără trade-uri.</div>}
        </div>
      </div>
    </div>
  );
}
