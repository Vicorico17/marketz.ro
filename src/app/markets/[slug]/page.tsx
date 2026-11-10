'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PortfolioPanel } from '@/components/PortfolioPanel';
import { ProbabilityBar } from '@/components/ProbabilityBar';
import { TradeTicket } from '@/components/TradeTicket';
import { WalletPanel } from '@/components/WalletPanel';
import { useMockWallet } from '@/hooks/useMockWallet';
import { categoryLabel, statusLabel } from '@/lib/labels';
import { toPercent } from '@/lib/marketMath';
import type { MarketWithPrices, Trade } from '@/types/market';

interface MarketResponse {
  market: MarketWithPrices;
  recentTrades: Trade[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ro-RO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatMoney(value: number) {
  return `${value.toLocaleString('ro-RO')} mRON`;
}

export default function MarketDetailPage() {
  const params = useParams<{ slug: string }>();
  const [data, setData] = useState<MarketResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioRefresh, setPortfolioRefresh] = useState(0);
  const walletState = useMockWallet();

  const loadMarket = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/markets/${params.slug}`);
      const nextData = await response.json();
      setData(response.ok ? nextData : null);
    } catch {
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    void loadMarket();
  }, [loadMarket]);

  const handleTradeComplete = () => {
    void walletState.refresh();
    void loadMarket();
    setPortfolioRefresh((value) => value + 1);
  };

  if (isLoading) {
    return <main className="min-h-screen bg-black p-8 text-zinc-400">Se încarcă piața...</main>;
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-black p-8">
        <Link href="/" className="text-sm font-semibold text-emerald-300">
          Înapoi la piețe
        </Link>
        <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-950 p-8 text-zinc-400">Piața nu este disponibilă. Verifică adresa sau conexiunea.</div>
      </main>
    );
  }

  const { market, recentTrades } = data;
  const sourceUrl = market.resolutionSource.match(/https:\/\/[^\s]+/)?.[0];

  return (
    <main className="min-h-screen bg-black">
      <header className="border-b border-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Înapoi la piețe
          </Link>
          <WalletPanel walletState={walletState} compact />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-zinc-700 px-2 py-1 text-xs font-medium text-zinc-300">{categoryLabel(market.category)}</span>
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
              {statusLabel(market.status)}
            </span>
            {market.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-500">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">{market.question}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-400">{market.description}</p>

          <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Probabilități curente</h2>
                <p className="mt-1 text-sm text-zinc-500">Prețuri simulate. Nu sunt prognoze validate.</p>
              </div>

            </div>
            <ProbabilityBar outcomes={market.outcomes} probabilities={market.probabilities} />
          </div>

          <p className="mt-6 text-sm text-zinc-400">Închidere: {formatDate(market.closeAt)} · Exemplu cu credite gratuite, fără premii reale.</p>

          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="mb-2 text-lg font-semibold text-white">Regula de rezolvare</h2>
            <p className="break-words text-sm leading-6 text-zinc-400">{market.resolutionSource}</p>
            {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-emerald-300 underline">Deschide sursa de rezoluție ↗</a>}
            {market.status === 'resolved' && (
              <div className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                Rezolvat: {market.outcomes.find((outcome) => outcome.id === market.resolvedOutcomeId)?.label} · {market.resolverNotes}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Tranzacții demo recente</h2>
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="grid gap-2 rounded-md border border-zinc-800 bg-black p-3 text-sm text-zinc-400 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${trade.side === 'sell' ? 'bg-red-500/10 text-red-200' : 'bg-emerald-500/10 text-emerald-200'}`}>
                        {trade.side === 'sell' ? 'Vânzare' : 'Cumpărare'}
                      </span>
                      <div className="truncate font-medium text-white">{trade.outcomeLabel}</div>
                    </div>

                  </div>
                  <div>{formatMoney(trade.amount)}</div>
                  <div>{toPercent(trade.probabilityBefore)}% → {toPercent(trade.probabilityAfter)}%</div>
                </div>
              ))}
              {recentTrades.length === 0 && <div className="text-sm text-zinc-500">Încă nu există tranzacții în această sesiune demo.</div>}
            </div>
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <TradeTicket
            market={market}
            wallet={walletState.wallet}
            refreshKey={portfolioRefresh}
            onConnect={walletState.connect}
            onTradeComplete={handleTradeComplete}
          />
          <details className="rounded-lg border border-zinc-800 p-4"><summary className="cursor-pointer text-sm text-zinc-300">Portofoliul meu demo</summary><div className="mt-4"><PortfolioPanel address={walletState.address} refreshKey={portfolioRefresh} /></div></details>
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-xs leading-5 text-amber-100">
            Creditele mRON sunt simulate și nu au valoare monetară. Nu există depozite, retrageri sau premii reale.
          </div>
        </aside>
      </div>
    </main>
  );
}
