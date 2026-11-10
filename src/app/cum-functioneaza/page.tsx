import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleShell } from '@/components/ArticleShell';
import { MarginExplainer } from '@/components/MarginExplainer';
import { sources } from '@/lib/campaign';
export const metadata: Metadata = { title: 'Cum funcționează predicțiile și costurile' };
export default function LearnPage() {
  return <ArticleShell eyebrow="Ghid pentru primul pas" title="O întrebare. Mai multe rezultate. Un preț care se schimbă." intro="Marketz îți permite să explorezi mecanismul unei piețe de predicții cu credite gratuite. Nu ai nevoie de criptomonede sau de un portofel real.">
    <div className="grid gap-4 sm:grid-cols-3">{[
      ['01', 'Creează un cont demo', 'Primești 1.000 mRON virtuali. Butonul de credite adaugă încă 250. Soldul nu poate fi cumpărat, transferat sau retras ca bani.'],
      ['02', 'Testează o estimare', 'Alege rezultatul și suma. Verifică unitățile estimate, prețul mediu și impactul. O unitate câștigătoare este decontată cu 1 mRON demo.'],
      ['03', 'Urmărește rezultatul', 'Poți vinde înainte de închidere. Administratorul stabilește rezultatul și justificarea. La rezolvare, creditarea este automată; rezultatele greșite nu primesc plată.'],
    ].map(([n, title, text]) => <article key={n} className="rounded-xl border border-zinc-800 p-6"><span className="font-mono text-emerald-300">{n}</span><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p></article>)}</div>
    <section className="rounded-xl border border-zinc-800 p-6"><h2 className="text-2xl font-bold">Cum citești 60%</h2><p className="mt-4 leading-7 text-zinc-400">Un preț marginal de 0,60 mRON este afișat ca 60%. Nu garantează că evenimentul are o probabilitate reală de 60%. Suma plătită pentru un ordin mai mare depinde de toate prețurile traversate de ordin.</p><p className="mt-3 leading-7 text-zinc-400">Simulatorul folosește LMSR, un mecanism automat de stabilire a prețurilor. Nu potrivește ordine între două persoane. Lichiditatea este simulată, iar procentele inițiale, volumele și numărul inițial de tranzacții sunt demonstrative.</p></section>
    <MarginExplainer />
    <p className="text-sm text-zinc-400">Context pentru noțiunea de overround: <a href={sources.margin.url} className="text-emerald-300 underline">raportul CMA, anexe și glosar ↗</a></p>
    <section className="rounded-xl border border-zinc-800 p-6"><h2 className="text-2xl font-bold">Costuri și limite ale demo-ului</h2><ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-zinc-400"><li>Comision explicit: 0. Impactul asupra prețului poate fi semnificativ.</li><li>mRON nu este RON, token sau instrument financiar. Nu există premii cu valoare reală.</li><li>Adresa generată identifică o sesiune demo; nu dovedește identitatea și nu este o autentificare sigură.</li><li>Datele sunt păstrate în memoria serverului și se pot reseta. Un deployment cu mai multe instanțe nu are un registru comun.</li><li>La anulare, simulatorul returnează costul de achiziție rămas al pozițiilor deschise. Tranzacțiile deja închise nu sunt anulate.</li><li>Hash-urile și blocurile sunt simulări. Rezoluția este administrativă, fără verificare independentă on-chain.</li></ul></section>
    <Link href="/" className="inline-block rounded-md bg-emerald-400 px-5 py-3 font-semibold text-black">Încearcă simulatorul →</Link>
  </ArticleShell>;
}
