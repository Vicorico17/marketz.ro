'use client';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { petitionVersion } from '@/lib/petitionValidation';
export function SignatureForm({ enabled, organizer }: { enabled: boolean; organizer: string }) {
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || !enabled) return;
    const data = new FormData(event.currentTarget);
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/petition/sign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), email: data.get('email'), consent: data.get('consent') === 'on', website: data.get('website'), version: petitionVersion }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Cererea nu a putut fi trimisă.');
      setMessage(result.message); setSent(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Verifică conexiunea și încearcă din nou.'); }
    finally { setBusy(false); }
  }
  return <section id="sustinere" className="scroll-mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/5 p-6 sm:p-8">
    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Vocea ta contează</p>
    <h2 className="mt-3 text-3xl font-bold">Susține un cadru distinct pentru piețele de predicții.</h2>
    <p className="mt-4 max-w-2xl leading-7 text-zinc-400">Două câmpuri. Un singur pas. Fără cont, CNP, copie de act sau date despre tranzacțiile tale.</p>
    {!enabled && <p role="status" className="mt-5 rounded-lg border border-amber-300/30 bg-amber-300/5 p-4 text-sm leading-6 text-amber-200">Formularul este pregătit, dar colectarea nu este încă deschisă. Organizatorul finalizează datele de contact și activarea serviciului. Nu se trimit și nu se salvează date din acest formular cât timp este inactiv.</p>}
    {sent ? <div role="status" className="mt-6 rounded-lg border border-emerald-400/30 p-5"><h3 className="text-xl font-semibold">Mulțumim pentru susținere!</h3><p className="mt-3 leading-7 text-zinc-300">{message}</p><p className="mt-3 text-sm text-zinc-400">Nu este nevoie să apeși un link în email. Dacă mesajul de mulțumire întârzie, susținerea salvată rămâne înregistrată.</p><button onClick={() => { setSent(false); setMessage(''); }} className="mt-4 text-sm text-emerald-300 underline">Înapoi la petiție</button></div> : <form onSubmit={submit} className="mt-6 max-w-2xl">
      <fieldset disabled={!enabled || busy} className="space-y-5 disabled:opacity-60">
        <legend className="sr-only">Date pentru susținerea petiției</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium" htmlFor="support-name">Nume și prenume<input id="support-name" name="name" autoComplete="name" required minLength={3} maxLength={120} placeholder="Numele tău complet" className="mt-2 block w-full rounded-lg border border-zinc-700 bg-black p-3 text-base" /></label>
          <label className="block text-sm font-medium" htmlFor="support-email">Email<input id="support-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="tu@exemplu.ro" className="mt-2 block w-full rounded-lg border border-zinc-700 bg-black p-3 text-base" /></label>
        </div>
        <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="flex items-start gap-3 text-sm leading-6 text-zinc-300"><input name="consent" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-emerald-400" /><span>Am citit și susțin petiția. Îmi dau acordul explicit ca {organizer} să prelucreze numele, emailul și opinia exprimată prin susținere pentru această campanie și să transmită numele meu autorităților destinatare, conform <Link href="/confidentialitate" className="text-emerald-300 underline">informării privind datele personale</Link>. Pot retrage acordul oricând.</span></label>
        <button type="submit" className="w-full rounded-lg bg-emerald-400 px-6 py-3.5 font-bold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed sm:w-auto">{busy ? 'Se trimite…' : 'Semnează petiția →'}</button>
      </fieldset>
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    </form>}
    <p className="mt-5 max-w-2xl text-xs leading-6 text-zinc-400">Emailul este folosit pentru mesajul de mulțumire și retragere, nu pentru marketing. Numele și emailul nu apar public. Aceasta este susținere civică, nu semnătură electronică calificată sau inițiativă legislativă cetățenească. Adresa de email și identitatea declarată nu sunt verificate.</p>
  </section>;
}
