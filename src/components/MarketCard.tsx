import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { categoryLabel, statusLabel } from '@/lib/labels';
import type { MarketWithPrices } from '@/types/market';
export function MarketCard({ market }: { market: MarketWithPrices }) {
  return <Link href={`/markets/${market.slug}`} className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition hover:border-emerald-300/40 hover:bg-emerald-300/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300">
    <div className="mb-5 flex items-center justify-between gap-3 text-xs"><span className="rounded-full bg-white/5 px-3 py-1.5 text-zinc-400">{categoryLabel(market.category)}</span>{market.status !== 'open' && <span className="text-zinc-400">{statusLabel(market.status)}</span>}<ArrowUpRight className="h-4 w-4 text-zinc-500 transition group-hover:text-emerald-300" /></div>
    <h3 className="mb-7 text-lg font-semibold leading-snug tracking-tight group-hover:text-emerald-200">{market.question}</h3>
    <div className="mt-auto"><div className="grid grid-cols-2 gap-3">{market.outcomes.map((outcome, i) => <div key={outcome.id} className={`rounded-xl px-4 py-3 ${i === 0 ? 'bg-emerald-300/10 text-emerald-300' : 'bg-white/5 text-zinc-300'}`}><span className="text-xs">{outcome.label}</span><p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{Math.round(market.probabilities[outcome.id] * 100)}<span className="ml-0.5 text-sm font-normal opacity-70">%</span></p></div>)}</div><p className="mt-5 border-t border-white/[0.06] pt-4 text-xs text-zinc-500">Închidere: {new Intl.DateTimeFormat('ro-RO', { dateStyle: 'medium', timeZone: 'Europe/Bucharest' }).format(new Date(market.closeAt))}</p></div>
  </Link>;
}
