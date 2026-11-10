import type { Metadata } from 'next';
import { DemoMarkets } from '@/components/DemoMarkets';
export const metadata: Metadata = { title: 'Exemplu de piață de predicții despre România' };
export default function ExamplePage() {
  return <main className="campaign-surface min-h-screen"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <header className="mb-10"><p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">Exemplu de piață de predicții</p><h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Ce urmează pentru România?</h1><p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">De la economie și politică la sport și cultură. Explorează întrebările, compară rezultatele posibile și descoperă cum funcționează o piață de predicții.</p></header>
    <DemoMarkets />
  </div></main>;
}
