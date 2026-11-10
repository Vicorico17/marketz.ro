import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleShell } from '@/components/ArticleShell';
import { SignatureForm } from '@/components/SignatureForm';
import { getPetitionConfig } from '@/lib/petitionConfig';
import { PetitionActions } from '@/components/PetitionActions';
import { demands, petitionIntro, petitionTitle, researchDate, sources } from '@/lib/campaign';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Petiție pentru reguli proporționale' };
export default function PetitionPage() {
  const config = getPetitionConfig();
  return <ArticleShell eyebrow={`Inițiativă civică · Proiect v2 · ${researchDate}`} title={petitionTitle} intro={petitionIntro}>
    <div className="no-print"><a href="#sustinere" className="inline-block rounded-lg bg-emerald-400 px-6 py-3 font-bold text-black">Susține petiția →</a></div>
    <section className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-6 sm:p-8">
      <h2 className="text-xl font-semibold">Pentru un tratament fiscal distinct, bazat pe mecanism și risc.</h2>
      <p className="mt-3 leading-7 text-zinc-300">O platformă care intermediază predicții poate funcționa diferit de o casă de pariuri cu cote fixe. Solicităm evaluarea acestor diferențe și reguli care permit alternative transparente, inclusiv comision de tranzacționare zero. Nu promitem costuri totale zero sau câștiguri garantate.</p>
    </section>
    <section className="rounded-xl border border-zinc-800 p-6"><h2 className="text-xl font-semibold">De ce contează costul de intrare</h2><p className="mt-3 leading-7 text-zinc-400">Regimul online clasa 1 consultat prevede 300.000 euro/an pentru licență și o autorizație de 30% din venitul relevant, minimum 480.000 euro/an. Acestea nu sunt toate obligațiile. Cerem evaluarea unor praguri proporționale pentru piețele de predicții eligibile, inclusiv cele cu comision zero.</p><a href={sources.gambling.url} className="mt-3 inline-block text-sm text-emerald-300 underline">OUG 77/2009, anexa I.J și II.J — forma din 25 februarie 2026 ↗</a></section>
    <section>
      <h2 className="text-2xl font-bold">Ce cerem concret</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-400">Destinatari propuși: Guvernul, Ministerul Finanțelor, ONJN și comisiile parlamentare competente; ANPC și Consiliul Concurenței pentru aspectele din competența lor.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{demands.map((d, i) => <article key={d.title} className="rounded-xl border border-zinc-800 bg-zinc-950 p-6"><span className="font-mono text-sm text-emerald-300">0{i + 1}</span><h3 className="mt-3 text-lg font-semibold">{d.title}</h3><p className="mt-3 text-sm leading-7 text-zinc-400">{d.text}</p></article>)}</div>
    </section>
    <section className="rounded-xl border border-zinc-800 p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Poate petiția să schimbe legea?</h2>
      <p className="mt-4 leading-7 text-zinc-300">Poate cere reforme și poate susține o inițiativă a Guvernului sau a parlamentarilor. Nu schimbă legea prin numărul de semnături. Problemele fiscale sunt excluse din inițiativa legislativă a cetățenilor de art. 74 alin. (2); dreptul de petiționare rămâne disponibil.</p>
      <a href={sources.constitution.url} className="mt-3 inline-block text-sm text-emerald-300 underline">Constituția, art. 51 și 74 →</a>
      <ol className="mt-6 list-decimal space-y-3 pl-5 text-zinc-400"><li>Finalizăm solicitările și identificăm organizatorul.</li><li>Colectăm sprijin printr-un mecanism verificabil, cu informare privind datele personale.</li><li>Depunem petiția și publicăm numerele de înregistrare.</li><li>Solicităm consultare, studiu de impact și un inițiator parlamentar sau guvernamental.</li><li>Urmărim răspunsurile și eventualul proiect legislativ.</li></ol>
    </section>
    <SignatureForm enabled={config.enabled} organizer={config.organizer} />
    <PetitionActions />
    <Link href="/cercetare" className="inline-block text-emerald-300 underline">Vezi cercetarea, sursele și limitele concluziilor →</Link>
  </ArticleShell>;
}
