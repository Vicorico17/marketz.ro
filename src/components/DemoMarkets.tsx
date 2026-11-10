'use client';
import { useEffect, useState } from 'react';
import { categoryLabel } from '@/lib/labels';
import { MarketCard } from '@/components/MarketCard';
import type { MarketWithPrices } from '@/types/market';
export function DemoMarkets() {
  const [markets, setMarkets] = useState<MarketWithPrices[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [archive, setArchive] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    fetch('/api/markets', { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then((data) => { if (controller.signal.aborted) return; setMarkets(data.markets); setState('ready'); })
      .catch(() => { if (!controller.signal.aborted) setState('error'); });
    return () => controller.abort();
  }, [attempt]);
  if (state === 'loading') return <p role="status" className="py-6 text-zinc-400">Se încarcă exemplele…</p>;
  if (state === 'error') return <div role="alert" className="py-6 text-zinc-400">Exemplele nu sunt disponibile. <button onClick={() => setAttempt((n) => n + 1)} className="text-emerald-300 underline">Reîncearcă</button></div>;
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = markets.filter((market) => (archive || market.status === 'open') && (category === 'all' || market.category === category) && normalize(`${market.question} ${market.description} ${market.tags.join(' ')}`).includes(normalize(search.trim())));
  const categories = Array.from(new Set(markets.map((market) => market.category)));
  return <div>
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <input aria-label="Caută o predicție despre România" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Caută: inflație, metrou, fotbal…" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:min-w-72" />
      <label className="flex items-center gap-2 text-sm text-zinc-400"><input type="checkbox" checked={archive} onChange={(e) => setArchive(e.target.checked)} className="accent-emerald-400" />Include arhiva</label>
    </div>
    <div className="mb-5 flex flex-wrap gap-2"><button aria-pressed={category === 'all'} onClick={() => setCategory('all')} className={`rounded-full border px-4 py-2 text-sm ${category === 'all' ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-zinc-700 text-zinc-300'}`}>Toate</button>{categories.map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-sm ${category === item ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-zinc-700 text-zinc-300'}`}>{categoryLabel(item)}</button>)}</div>
    <p aria-live="polite" className="mb-5 text-xs text-zinc-500">{filtered.length} întrebări · Procente ilustrative</p>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((market) => <MarketCard key={market.id} market={market} />)}</div>
    {!filtered.length && <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center text-zinc-400">Nu am găsit întrebări. <button className="text-emerald-300 underline" onClick={() => { setSearch(''); setCategory('all'); setArchive(true); }}>Resetează filtrele</button></div>}
  </div>;
}
