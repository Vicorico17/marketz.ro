'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Coins, Search, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';
import { MarketCard } from '@/components/MarketCard';
import { PortfolioPanel } from '@/components/PortfolioPanel';
import { WalletPanel } from '@/components/WalletPanel';
import { useMockWallet } from '@/hooks/useMockWallet';
import { categoryLabel } from '@/lib/labels';
import type { MarketCategory, MarketSnapshot } from '@/types/market';

const categories: Array<'all' | MarketCategory> = ['all', 'politica', 'economie', 'sport', 'locale', 'cultura', 'tech', 'meteo'];

export default function Home() {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | MarketCategory>('all');
  const [isLoading, setIsLoading] = useState(true);
  const walletState = useMockWallet();

  const loadMarkets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/markets');
      const data = await response.json();
      setSnapshot(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadMarkets();
  }, []);

  const filteredMarkets = useMemo(() => {
    const markets = snapshot?.markets || [];
    const normalizedSearch = search.trim().toLowerCase();

    return markets.filter((market) => {
      const matchesCategory = category === 'all' || market.category === category;
      const matchesSearch =
        !normalizedSearch ||
        market.question.toLowerCase().includes(normalizedSearch) ||
        market.description.toLowerCase().includes(normalizedSearch) ||
        market.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));
      return matchesCategory && matchesSearch;
    });
  }, [category, search, snapshot]);

  return (
    <main className="min-h-screen bg-black">
      <header className="border-b border-zinc-900 bg-black/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Marketz.ro" width={44} height={44} className="rounded-md" priority />
            <div>
              <div className="text-xl font-bold tracking-tight text-white">Marketz.ro</div>
              <div className="text-xs text-zinc-500">Romania-focused prediction markets</div>
            </div>
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-800 px-4 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin mock
            </Link>
            <WalletPanel walletState={walletState} compact />
          </div>
        </div>
      </header>

      <section className="border-b border-zinc-900">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              Mock on-chain MVP
            </div>
            <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Piețe de predicții pentru România, cu trading mock și settlement transparent.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">
              Cumpără shares pe rezultate, urmărește probabilități în timp real și testează fluxul de wallet fără bani reali sau blockchain real.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <BarChart3 className="h-4 w-4 text-emerald-300" />
                  Volum demo
                </div>
                <div className="mt-2 text-2xl font-bold text-white">{snapshot?.totalVolume.toLocaleString('ro-RO') || '0'} mRON</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Coins className="h-4 w-4 text-amber-300" />
                  Risc LP demo
                </div>
                <div className="mt-2 text-2xl font-bold text-white">{snapshot?.totalLiquidityRisk.toLocaleString('ro-RO') || '0'} mRON</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <WalletCards className="h-4 w-4 text-sky-300" />
                  Piețe deschise
                </div>
                <div className="mt-2 text-2xl font-bold text-white">{snapshot?.openMarkets || 0}</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <ShieldCheck className="h-4 w-4 text-sky-300" />
                  Trade-uri mock
                </div>
                <div className="mt-2 text-2xl font-bold text-white">{snapshot?.totalTrades || 0}</div>
              </div>
            </div>
          </div>
          <PortfolioPanel address={walletState.address} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Piețe active</h2>
            <p className="mt-1 text-sm text-zinc-500">Probabilități calculate cu un market maker LMSR mock.</p>
          </div>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Caută piață"
                className="h-11 w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 text-sm text-white outline-none focus:border-emerald-400 sm:w-72"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`h-9 shrink-0 rounded-md border px-3 text-sm font-medium transition ${
                category === item
                  ? 'border-emerald-400 bg-emerald-400 text-zinc-950'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {item === 'all' ? 'Toate' : categoryLabel(item)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-400">Se încarcă piețele...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}

        {!isLoading && filteredMarkets.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-800 p-8 text-center text-zinc-500">Nu există piețe pentru filtrul curent.</div>
        )}
      </section>
    </main>
  );
}
