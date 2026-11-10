import Link from 'next/link';
import { ArrowRight, Scale, Eye, Users } from 'lucide-react';
import { getPetitionConfig } from '@/lib/petitionConfig';
import { DemoMarkets } from '@/components/DemoMarkets';
export const dynamic = 'force-dynamic';
export default function Home() {
  const collecting = getPetitionConfig().enabled;
  return <main>
    <section className="border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Predicții despre România · Inițiativă civică</div>
        <h1 className="max-w-5xl text-balance text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">Ce urmează<br /><span className="text-emerald-300">pentru România?</span></h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">Economie, politică, infrastructură, sport și cultură. Explorează întrebări reale cu un simulator simplu și susține un cadru distinct pentru piețele de predicții: concurență, costuri transparente și reguli proporționale.</p>
        <div className="mt-9 flex flex-wrap gap-3"><a href="#demo" className="inline-flex items-center gap-3 rounded-md bg-emerald-400 px-6 py-3.5 font-semibold text-black hover:bg-emerald-300">Explorează predicțiile <ArrowRight className="h-4 w-4" /></a><Link href="/petitie#sustinere" className="rounded-md border border-zinc-700 px-6 py-3.5 font-medium hover:bg-zinc-900">Susține petiția</Link></div>
        <p className="mt-5 text-xs text-zinc-500">{collecting ? 'Nume, email și acord. Fără cont, CNP sau confirmare prin email.' : 'Proiect pentru consultare. Formularul de susținere se pregătește pentru lansare.'}</p>
      </div>
    </section>
    <section id="demo" className="border-t border-zinc-800 bg-zinc-950/50"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">Evenimente reale · Tranzacții simulate</p><h2 className="text-2xl font-bold">Predicții despre România</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Întrebări verificabile, surse de rezoluție și credite gratuite. Procentele de pornire sunt ilustrative; nu există bani reali sau premii.</p></div><Link href="/cum-functioneaza" className="text-sm text-emerald-300 underline">Explicația pe scurt →</Link></div><DemoMarkets /></div></section>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold">Trei principii pentru reguli mai bune</h2>
      <div className="mt-7 grid gap-4 md:grid-cols-3">{[
        { icon: Users, title: 'Concurență deschisă', text: 'Evaluarea barierelor de intrare și spațiu pentru alternative eficiente, inclusiv modele fără comision de tranzacționare.' },
        { icon: Eye, title: 'Costuri la vedere', text: 'Comisioane, marje în cote și condiții explicate înainte de participare. Zero comision nu înseamnă automat zero cost total.' },
        { icon: Scale, title: 'Fiscalitate proporțională', text: 'Analiza separată a taxelor operatorilor și ale participanților, în funcție de mecanismul economic și de riscuri.' },
      ].map(({ icon: Icon, title, text }) => <article key={title} className="rounded-xl border border-zinc-800 bg-zinc-950 p-6"><Icon className="mb-5 h-5 w-5 text-emerald-300" /><h3 className="text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p></article>)}</div>
    </section>
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"><div className="rounded-xl border border-zinc-800 p-6 sm:p-8"><h2 className="text-2xl font-bold">Ce poate schimba o petiție?</h2><p className="mt-4 max-w-3xl leading-7 text-zinc-400">Poate cere o consultare publică și poate construi sprijin pentru un proiect al Guvernului sau al parlamentarilor. Semnăturile nu modifică automat legea. În România, schimbările fiscale nu pot urma procedura inițiativei legislative cetățenești.</p><Link href="/cercetare" className="mt-5 inline-block text-sm font-semibold text-emerald-300">Traseul legal și sursele oficiale →</Link></div></section>

  </main>;
}
