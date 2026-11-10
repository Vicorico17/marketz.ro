'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-3xl font-bold">Pagina nu a putut fi încărcată</h1><p className="mt-4 text-zinc-400">A apărut o problemă temporară. Încearcă din nou.</p><button onClick={reset} className="mt-8 rounded-lg bg-emerald-400 px-6 py-3 font-semibold text-black">Reîncearcă</button></main>;
}
