'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, PenLine, ShieldCheck } from 'lucide-react';
import { petitionVersion } from '@/lib/petitionValidation';
export function SignatureForm({ enabled, organizer, signatureCount }: { enabled: boolean; organizer: string; signatureCount: number | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || !enabled) return;
    const data = new FormData(event.currentTarget);
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/petition/sign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), email: data.get('email'), consent: data.get('consent') === 'on', website: data.get('website'), version: petitionVersion }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Cererea nu a putut fi trimisă.');
      setMessage(result.message); setSent(true); router.refresh();
    } catch (cause) { setError(cause instanceof TypeError ? "Conexiunea a eșuat. Încearcă din nou." : cause instanceof Error ? cause.message : 'Verifică conexiunea și încearcă din nou.'); }
    finally { setBusy(false); }
  }
  return <section id="sustinere" className="scroll-mt-6 rounded-3xl border border-emerald-300/20 bg-[#111a17] p-6 shadow-[0_24px_90px_-35px_rgba(52,211,153,0.22)] sm:p-7">
    <div aria-live="polite" className="mb-6 border-b border-emerald-300/10 pb-5">{signatureCount === null ? <p className="text-xs leading-6 text-zinc-400">Numărul susținerilor este momentan indisponibil.</p> : <><p className="text-4xl font-semibold tabular-nums tracking-tight text-emerald-300">{new Intl.NumberFormat('ro-RO').format(signatureCount)}</p><p className="mt-1 text-sm text-zinc-400">{signatureCount === 1 ? 'susținere înregistrată' : 'susțineri înregistrate'}</p><p className="mt-2 text-[11px] leading-5 text-zinc-500">Pentru această versiune a petiției. Identități declarate, neverificate.</p></>}</div>
    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10"><PenLine className="h-5 w-5 text-emerald-300" /></div><p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">Vocea ta contează</p>
    <h2 className="mt-3 text-2xl font-semibold tracking-tight">Semnează pentru schimbare.</h2>
    <p className="mt-3 text-sm leading-7 text-zinc-400">Numele tău. O voce în plus pentru reguli mai bune. Textul integral este pe această pagină.</p>
    {!enabled && <p role="status" className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-6 text-zinc-400">Semnarea se deschide în curând. Formularul este momentan inactiv; datele nu sunt colectate.</p>}
    {sent ? <div role="status" className="mt-6 rounded-lg border border-emerald-400/30 p-5"><Check className="mb-3 h-8 w-8 text-emerald-300" /><h3 className="text-xl font-semibold">Mulțumim pentru susținere!</h3><p className="mt-3 leading-7 text-zinc-300">{message}</p><p className="mt-3 text-sm text-zinc-400">Nu este nevoie să apeși un link în email. Dacă mesajul de mulțumire întârzie, susținerea salvată rămâne înregistrată.</p><a href="#textul-petitiei" className="mt-4 inline-block text-sm text-emerald-300 underline">Citește petiția</a></div> : <form onSubmit={submit} className="mt-6 max-w-2xl">
      <fieldset disabled={!enabled || busy} className="space-y-5 disabled:opacity-60">
        <legend className="sr-only">Date pentru susținerea petiției</legend>
        <div className="grid gap-4">
          <label className="block text-sm font-medium" htmlFor="support-name">Nume și prenume<input id="support-name" name="name" autoComplete="name" required minLength={3} maxLength={120} placeholder="Numele tău complet" className="mt-2 block h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base transition placeholder:text-zinc-600 focus:border-emerald-300/60 focus:outline-none focus:ring-4 focus:ring-emerald-300/5" /></label>
          <label className="block text-sm font-medium" htmlFor="support-email">Email<input id="support-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="tu@exemplu.ro" className="mt-2 block h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base transition placeholder:text-zinc-600 focus:border-emerald-300/60 focus:outline-none focus:ring-4 focus:ring-emerald-300/5" /></label>
        </div>
        <div hidden aria-hidden="true"><label>Site web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="flex items-start gap-3 text-xs leading-6 text-zinc-400"><input name="consent" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-emerald-400" /><span>Am citit și susțin <a href="#textul-petitiei" className="text-emerald-300 underline underline-offset-2">petiția de pe această pagină</a>. Îmi dau acordul explicit ca {organizer} să prelucreze numele, emailul și opinia exprimată prin susținere pentru această campanie și să transmită numele meu autorităților destinatare, conform <Link href="/confidentialitate" className="text-emerald-300 underline">informării privind datele personale</Link>. Pot retrage acordul oricând.</span></label>
        <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-bold text-emerald-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed">{busy ? 'Se trimite…' : 'Semnează petiția'}<ArrowRight className="h-4 w-4" /></button>
      </fieldset>
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    </form>}
    <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-400"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Datele tale nu apar public</div>
    <p className="mt-4 text-[11px] leading-5 text-zinc-500">Emailul este folosit pentru mesajul de mulțumire și retragere, nu pentru marketing. Numele și emailul nu apar public. Aceasta este susținere civică, nu semnătură electronică calificată sau inițiativă legislativă cetățenească. Adresa de email și identitatea declarată nu sunt verificate.</p>
  </section>;
}
