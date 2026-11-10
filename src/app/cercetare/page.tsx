import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleShell } from '@/components/ArticleShell';
import { researchDate, sources } from '@/lib/campaign';
export const metadata: Metadata = { title: 'Cercetare: România, UE și petiția' };
const findings = [
  { title: 'UE: nu există o interdicție unică pentru întreaga Europă', text: 'Regimurile jocurilor de noroc diferă între state. O autorizație într-o țară nu trebuie presupusă valabilă automat în România. Concluzia privind un produs depinde de jurisdicție și de mecanismul său.', source: sources.eu },
  { title: 'România: eticheta „predicții” nu este o exceptare', text: 'OUG 77/2009 prevede licențierea și include pariurile în contrapartidă, inclusiv la distanță. Încadrarea unui model LMSR cu bani reali necesită analiză specifică; nu este automat identic cu o bursă care potrivește ordine între jucători.', source: sources.gambling },
  { title: 'Exemplu european: Țările de Jos', text: 'La 17 februarie 2026, Ksa a anunțat o măsură împotriva Polymarket pentru ofertă neautorizată. Autoritatea precizează și că unele pariuri oferite nu sunt permise nici titularilor de licențe. Exemplul nu reprezintă o regulă comună tuturor statelor UE.', source: sources.netherlands },
  { title: 'Monopolul de stat nu dovedește un monopol privat', text: 'Legea română folosește noțiunea de monopol de stat și permite autorizarea operatorilor. Nu am stabilit că firmele private de pariuri formează un monopol sau cartel. Petiția cere evaluarea barierelor și a practicilor concrete.', source: sources.gambling },
  { title: 'Taxarea operatorului și a participantului sunt diferite', text: 'Pentru participant, documentul ANAF din 2025 descrie reținerea la transferul din contul online: 4% până la 10.000 lei; 400 lei + 20% din excedent până la 66.750 lei; 11.750 lei + 40% peste acest prag. Acesta nu este un calcul al taxelor operatorului și nici o opinie fiscală pentru orice contract de predicție.', source: sources.tax },
  { title: 'O petiție este posibilă. Schimbarea fiscală cere un inițiator competent.', text: 'Art. 51 protejează petiționarea. Art. 74 alin. (2) exclude problemele fiscale din inițiativa legislativă cetățenească. Calea propusă este susținerea publică a unui proiect inițiat de Guvern, deputați sau senatori.', source: sources.constitution },
];
export default function ResearchPage() {
  return <ArticleShell eyebrow={`Dosar de cercetare · ${researchDate}`} title="Ce spune legea. Ce putem cere să se schimbe." intro="Separăm textele verificate de interpretări și de propunerile noastre. Acest dosar pregătește o dezbatere publică; nu reprezintă o autorizare de funcționare.">
    <div className="grid gap-4 sm:grid-cols-2">{findings.map((f) => <article key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-950 p-6"><h2 className="text-xl font-semibold">{f.title}</h2><p className="mt-4 text-sm leading-7 text-zinc-400">{f.text}</p><a href={f.source.url} className="mt-4 inline-block text-sm text-emerald-300 underline">{f.source.title} ↗</a></article>)}</div>
    <section className="rounded-xl border border-zinc-800 p-6">
      <h2 className="text-2xl font-bold">Ce poate produce demersul</h2>
      <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Solicitările și autoritățile competente</caption><thead><tr className="border-b border-zinc-700"><th className="p-3">Solicitare</th><th className="p-3">Cale posibilă</th></tr></thead><tbody className="text-zinc-400">
        <tr className="border-b border-zinc-800"><td className="p-3">Clarificarea încadrării și autorizării</td><td className="p-3">Punct de vedere ONJN; ASF dacă produsul ridică probleme de instrumente financiare. Un răspuns nu înlocuiește o licență.</td></tr>
        <tr className="border-b border-zinc-800"><td className="p-3">Taxe și bază de impozitare diferite</td><td className="p-3">Analiză a Ministerului Finanțelor și modificări legislative inițiate de autoritățile competente.</td></tr>
        <tr className="border-b border-zinc-800"><td className="p-3">Costuri opace sau practici anticoncurențiale</td><td className="p-3">Sesizări documentate către ANPC / Consiliul Concurenței, în limitele competențelor lor.</td></tr>
        <tr><td className="p-3">Dovada sprijinului public</td><td className="p-3">Petiție înregistrată, răspunsuri urmărite public, consultare și susținători parlamentari. Nicio garanție de adoptare.</td></tr>
      </tbody></table></div>
      <p className="mt-5 text-sm leading-7 text-zinc-400">OG 27/2002 prevede, în general, un răspuns în 30 de zile de la înregistrare și permite prelungiri în condițiile legii. Obligația de răspuns nu este o obligație de a accepta propunerea. <a href={sources.petitions.url} className="text-emerald-300 underline">Procedura petițiilor ↗</a></p>
    </section>
    <section className="rounded-xl border border-zinc-800 p-6"><h2 className="text-2xl font-bold">Un punct concret pentru reformă: costul de intrare</h2><p className="mt-4 leading-7 text-zinc-400">În forma consultată, anexa OUG 77/2009 prevede pentru clasa 1 la distanță o licență de 300.000 euro/an și o autorizație de 30% din venitul relevant, minimum 480.000 euro/an. Nu este lista completă a obligațiilor. Art. 1¹ distinge deja venitul din comisioane pentru mecanismele relevante.</p><p className="mt-3 leading-7 text-zinc-400">Propunerea noastră: evaluarea proporționalității pragurilor fixe/minime pentru modele cu venit redus din comisioane. Aceste costuri justifică o întrebare despre concurență, fără să dovedească singure un monopol privat.</p><a href={sources.gambling.url} className="mt-4 inline-block text-sm text-emerald-300 underline">OUG 77/2009, anexa, punctul I.J și II.J ↗</a></section>
    <section className="rounded-xl border border-amber-300/30 p-6">
      <h2 className="text-xl font-semibold">Ce rămâne de verificat</h2>
      <p className="mt-4 leading-7 text-zinc-400">Au fost consultate forma OUG 77/2009 din 25 februarie 2026 și forma Legii 141/2025 din 31 august 2026. Documentul ANAF explică baremul introdus în 2025. Încadrarea unui produs concret și toate obligațiile sale fiscale necesită analiză separată. Lista neagră ONJN nu a putut fi consultată; nu afirmăm aici statutul curent al unui domeniu în România.</p>
      <p className="mt-3 leading-7 text-zinc-400">Înainte de depunere: reverificarea legislației la data depunerii, analiza juridică a modelului concret, măsurarea costurilor reale și a concentrării pieței, identificarea organizatorului și definirea regulilor privind datele susținătorilor.</p>
    </section>
    <Link href="/petitie" className="inline-block rounded-md bg-emerald-400 px-5 py-3 font-semibold text-black">Citește proiectul petiției →</Link>
  </ArticleShell>;
}
