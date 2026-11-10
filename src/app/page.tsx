import { PetitionResearch } from '@/components/PetitionResearch';
import type { Metadata } from 'next';
import { ArrowUpRight, Landmark, Scale, ScanEye, Sparkles } from 'lucide-react';
import { SignatureForm } from '@/components/SignatureForm';
import { getPetitionConfig } from '@/lib/petitionConfig';
import { demands, petitionIntro, petitionTitle, petitionText, researchDate, sources } from '@/lib/campaign';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Semnează pentru un cadru distinct al piețelor de predicții' };
export default function PetitionPage() {
  const config = getPetitionConfig();
  const paragraphs = petitionText.split('\n\n');
  return <main className="campaign-surface">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 max-w-4xl sm:mb-14">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3.5 py-2 text-xs font-medium text-emerald-200"><Sparkles className="h-3.5 w-3.5" /> O inițiativă Marketz.ro</p>
        <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl">O piață liberă.<br /><span className="text-emerald-300">Un cadru distinct.</span></h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">Cerem recunoașterea piețelor de predicții ca o categorie distinctă de pariurile convenționale, cu fiscalitate proporțională și costuri la vedere.</p>
      </header>
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-12">
        <aside className="order-first lg:sticky lg:top-6 lg:order-last"><SignatureForm enabled={config.enabled} organizer={config.organizer} /></aside>
        <div className="min-w-0 space-y-10">
          <section aria-label="Ce susții prin semnare" className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Landmark, title: 'Reguli distincte', text: 'O categorie legală adaptată mecanismului pieței.' },
              { icon: Scale, title: 'Taxe proporționale', text: 'Un regim fiscal justificat prin costuri și riscuri.' },
              { icon: ScanEye, title: 'Costuri transparente', text: 'Concurență și alegeri informate pentru participanți.' },
            ].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"><Icon className="mb-4 h-5 w-5 text-emerald-300" /><h2 className="text-sm font-semibold text-zinc-100">{title}</h2><p className="mt-2 text-xs leading-6 text-zinc-400">{text}</p></div>)}
          </section>
          <article id="textul-petitiei" className="scroll-mt-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950/80">
            <div className="border-b border-white/[0.07] px-6 py-5 sm:px-8"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-semibold text-emerald-300">Textul integral al petiției</h2><span className="text-xs text-zinc-500">Versiunea 2 · {researchDate}</span></div></div>
            <div className="px-6 py-8 sm:px-8">
              <h3 className="text-2xl font-semibold leading-snug tracking-tight">{petitionTitle}</h3>
              <p className="mt-5 border-l-2 border-emerald-300/40 pl-4 text-sm leading-7 text-zinc-400">{paragraphs[2]}</p>
              <p className="mt-6 text-base leading-8 text-zinc-300">{petitionIntro}</p>
              <div className="mt-8 divide-y divide-white/[0.07]">{demands.map((d, i) => <section key={d.title} className="py-7 first:pt-0"><div className="mb-3 flex items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-300/10 font-mono text-xs text-emerald-300">{String(i + 1).padStart(2, '0')}</span><h4 className="text-lg font-semibold leading-7 tracking-tight">{d.title}</h4></div><p className="text-sm leading-8 text-zinc-400">{d.text}</p></section>)}</div>
              <div className="mt-2 space-y-4 border-t border-white/[0.07] pt-6 text-sm leading-7 text-zinc-400"><p>{paragraphs[paragraphs.length - 3]}</p><p>{paragraphs[paragraphs.length - 2]}</p></div>
              <div className="mt-8 border-t border-white/[0.07] pt-6"><h4 className="text-sm font-semibold">Sursele petiției</h4><ul className="mt-4 space-y-3">{Object.values(sources).map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-2 text-xs leading-6 text-zinc-400 transition hover:text-emerald-300">{source.title}<ArrowUpRight className="mt-1 h-3 w-3 shrink-0" /></a></li>)}</ul></div>
            </div>
          </article>
          <section aria-labelledby="context-costuri" className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-emerald-300/[0.06] to-transparent p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-widest text-emerald-300">De ce cerem o schimbare</p><h2 id="context-costuri" className="mt-3 text-2xl font-semibold tracking-tight">Costul de intrare contează.</h2>
            <div className="my-6 grid gap-5 sm:grid-cols-2"><div><p className="text-3xl font-semibold tracking-tight">300.000 €<span className="ml-1 text-sm font-normal text-zinc-500">/ an</span></p><p className="mt-2 text-xs text-zinc-400">Licență online, clasa 1</p></div><div><p className="text-3xl font-semibold tracking-tight">30%<span className="ml-2 text-sm font-normal text-zinc-500">din venitul relevant</span></p><p className="mt-2 text-xs text-zinc-400">Autorizație: minimum 480.000 € / an</p></div></div>
            <p className="text-sm leading-7 text-zinc-400">Acestea sunt prevederile din forma OUG 77/2009 consultată la 25 februarie 2026, nu toate obligațiile unui operator. Art. 1¹ distinge deja venitul din comisioane pentru mecanismele relevante. Cerem evaluarea pragurilor fixe și minime pentru alternative eficiente, inclusiv modele cu comision de tranzacționare zero.</p>
            <a href={sources.gambling.url} className="mt-4 inline-block text-xs text-emerald-300 underline decoration-emerald-300/30 underline-offset-4">OUG 77/2009 — anexa I.J și II.J</a>
          </section>
          <section className="px-1"><h2 className="text-xl font-semibold tracking-tight">Ce se întâmplă după semnare?</h2><p className="mt-4 text-sm leading-8 text-zinc-400">Strângem sprijin pentru o petiție către autorități, o consultare publică și un proiect asumat de Guvern sau parlamentari. Art. 74 alin. (2) din Constituție exclude problemele fiscale din inițiativa legislativă cetățenească: numărul de semnături nu modifică automat legea.</p><p className="mt-4 text-sm leading-8 text-zinc-400">Solicitarea unui cadru distinct este o propunere de reformă, nu descrierea unei exceptări existente. În România, legea include deja pariurile în contrapartidă. Nu am demonstrat un monopol privat și nu presupunem că toate piețele de predicții sunt exceptate de la reglementare.</p></section>
          <PetitionResearch />
        </div>
      </div>
    </div>
  </main>;
}
