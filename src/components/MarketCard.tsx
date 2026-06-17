import Link from 'next/link';
import { Activity, CalendarClock, Coins, ShieldCheck } from 'lucide-react';
import { categoryLabel, statusLabel } from '@/lib/labels';
import { toPercent } from '@/lib/marketMath';
import { ProbabilityBar } from '@/components/ProbabilityBar';
import type { MarketWithPrices } from '@/types/market';

interface MarketCardProps {
  market: MarketWithPrices;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function MarketCard({ market }: MarketCardProps) {
  const favoriteOutcome = [...market.outcomes].sort(
    (a, b) => (market.probabilities[b.id] || 0) - (market.probabilities[a.id] || 0),
  )[0];

  return (
    <Link
      href={`/markets/${market.slug}`}
      className="group flex h-full flex-col rounded-lg border border-zinc-800 bg-zinc-950 p-5 transition hover:border-emerald-500/60 hover:bg-zinc-900"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-zinc-700 px-2 py-1 text-xs font-medium text-zinc-300">
              {categoryLabel(market.category)}
            </span>
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
              {statusLabel(market.status)}
            </span>
          </div>
          <h2 className="text-balance text-lg font-semibold leading-snug text-white group-hover:text-emerald-200">
            {market.question}
          </h2>
        </div>
        {favoriteOutcome && (
          <div className="shrink-0 rounded-lg border border-zinc-800 bg-black px-3 py-2 text-right">
            <div className="text-xs text-zinc-500">Top</div>
            <div className="text-xl font-bold text-white">{toPercent(market.probabilities[favoriteOutcome.id] || 0)}%</div>
          </div>
        )}
      </div>

      <p className="mb-5 line-clamp-3 text-sm leading-6 text-zinc-400">{market.description}</p>
      <ProbabilityBar outcomes={market.outcomes} probabilities={market.probabilities} compact />

      <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-300" />
          {market.volume.toLocaleString('ro-RO')} mRON
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-sky-300" />
          {market.tradeCount} trade-uri
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-zinc-500" />
          Închidere: {formatDate(market.closeAt)}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-zinc-500">
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Mockchain
        </span>
        <span className="font-mono">{market.chain.conditionId.slice(0, 10)}...</span>
      </div>
    </Link>
  );
}
