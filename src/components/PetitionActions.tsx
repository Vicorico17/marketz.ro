'use client';
import { useState } from 'react';
import { petitionText } from '@/lib/campaign';
export function PetitionActions() {
  const [message, setMessage] = useState('');
  const download = () => {
    const url = URL.createObjectURL(new Blob([petitionText], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'marketz-petitie-proiect.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Proiectul a fost pregătit pentru descărcare.');
  };
  return <div className="no-print">
    <div className="flex flex-wrap gap-3">
      <button onClick={download} className="rounded-md bg-emerald-400 px-5 py-3 font-semibold text-black">Descarcă proiectul</button>
      <button onClick={async () => { try { await navigator.clipboard.writeText(petitionText); setMessage('Text copiat.'); } catch { setMessage('Copierea nu este disponibilă. Poți descărca proiectul.'); } }} className="rounded-md border border-zinc-700 px-5 py-3">Copiază textul</button>
      <button onClick={() => window.print()} className="rounded-md border border-zinc-700 px-5 py-3">Tipărește / PDF</button>
    </div>
    <p role="status" className="mt-3 text-sm text-emerald-300">{message}</p>
  </div>;
}
