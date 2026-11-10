'use client';
import { useState } from 'react';
export function MarginExplainer() {
  const [yes, setYes] = useState('1.90');
  const [no, setNo] = useState('1.90');
  const a = Number(yes), b = Number(no);
  const valid = Number.isFinite(a) && Number.isFinite(b) && a > 1 && b > 1;
  const total = valid ? (1 / a + 1 / b) * 100 : 0;
  return <section className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-6 sm:p-8">
    <p className="text-xs uppercase tracking-widest text-emerald-300">Exemplu educațional · cote ipotetice</p>
    <h2 className="mt-3 text-2xl font-bold">„Fără comision” poate include o marjă în cote.</h2>
    <p className="mt-4 text-sm leading-7 text-zinc-400">Pentru două rezultate exhaustive și incompatibile, probabilitățile implicite sunt 1 / cotă. Suma lor peste 100% se numește overround. Modifică valorile ca să vezi diferența.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="text-sm">Cota pentru Da<input type="number" min="1.01" step="0.01" value={yes} onChange={(e) => setYes(e.target.value)} className="mt-2 block w-full rounded-md border border-zinc-700 bg-black p-3" /></label>
      <label className="text-sm">Cota pentru Nu<input type="number" min="1.01" step="0.01" value={no} onChange={(e) => setNo(e.target.value)} className="mt-2 block w-full rounded-md border border-zinc-700 bg-black p-3" /></label>
    </div>
    <div aria-live="polite" className="mt-6 rounded-lg bg-black p-5">{valid ? <><p className="text-3xl font-bold text-emerald-300">{(total - 100).toLocaleString('ro-RO', { maximumFractionDigits: 2 })}% overround</p><p className="mt-2 text-sm text-zinc-400">Suma probabilităților implicite: {total.toLocaleString('ro-RO', { maximumFractionDigits: 2 })}%.</p></> : <p>Introdu două cote finite, fiecare mai mare decât 1.</p>}</div>
    <p className="mt-4 text-xs leading-6 text-zinc-400">Overround-ul nu este profitul realizat al operatorului și nici pierderea sigură a unui participant. Nu reprezintă o comparație măsurată între firme. Un preț de predicție poate avea, la rândul său, spread și impact de piață.</p>
  </section>;
}
