'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
export default function WithdrawPage() {
  const [token, setToken] = useState(''), [message, setMessage] = useState(''), [error, setError] = useState('');
  const [busy, setBusy] = useState(false); const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return; loaded.current = true;
    setToken(new URLSearchParams(window.location.hash.slice(1)).get('token') || '');
    window.history.replaceState(null, '', window.location.pathname);
  }, []);
  async function withdraw() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/petition/withdraw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setMessage(data.message); setToken('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Conexiunea a eșuat.'); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto max-w-xl px-4 py-20"><p className="text-sm text-emerald-300">MARKETZ · PETIȚIE</p><h1 className="mt-5 text-3xl font-bold">Retrage susținerea și șterge datele</h1><p className="mt-5 leading-7 text-zinc-400">Apasă pentru a șterge înregistrarea asociată linkului. Dacă datele au fost deja transmise unei autorități, contactează organizatorul pentru informații despre destinatari.</p><Link href="/confidentialitate" className="mt-4 inline-block text-emerald-300 underline">Informarea privind datele personale</Link>{message ? <p role="status" className="mt-6 text-emerald-300">{message}</p> : <><button onClick={() => void withdraw()} disabled={busy || !/^[a-f0-9]{64}$/.test(token)} className="mt-6 block rounded-lg bg-emerald-400 px-6 py-3 font-bold text-black disabled:opacity-40">{busy ? 'Se procesează…' : 'Șterge datele mele'}</button>{!token && <p className="mt-4 text-sm text-zinc-400">Deschide linkul complet din email. Dacă ai reîncărcat pagina, redeschide acel link.</p>}</>}{error && <p role="alert" className="mt-4 text-red-300">{error}</p>}</main>;
}
