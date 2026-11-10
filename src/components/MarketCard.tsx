import Link from 'next/link';
import { categoryLabel, statusLabel } from '@/lib/labels';
import { ProbabilityBar } from '@/components/ProbabilityBar';
import type { MarketWithPrices } from '@/types/market';
export function MarketCard({ market }: { market: MarketWithPrices }) {
  return <Link href={`/markets/${market.slug}`} className="group flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-emerald-400/60">
    <div className="mb-4 flex justify-between gap-3 text-xs"><span className="text-zinc-400">{categoryLabel(market.category)}</span><span className="text-emerald-300">{market.status === 'open' ? 'Demo' : statusLabel(market.status)}</span></div>
    <h3 className="mb-6 text-lg font-semibold leading-snug group-hover:text-emerald-200">{market.question}</h3>
    <div className="mt-auto"><ProbabilityBar outcomes={market.outcomes} probabilities={market.probabilities} compact /><p className="mt-4 text-xs text-zinc-500">Închidere: {new Intl.DateTimeFormat('ro-RO', { dateStyle: 'medium', timeZone: 'Europe/Bucharest' }).format(new Date(market.closeAt))}</p><p className="mt-3 text-xs text-zinc-500">Explorează exemplul · Fără bani reali →</p></div>
  </Link>;
}
