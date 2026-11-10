import Link from 'next/link';
export default function NotFound() {
  return <main className="mx-auto max-w-xl px-4 py-24 text-center"><p className="text-sm text-emerald-300">404</p><h1 className="mt-4 text-3xl font-bold">Pagina nu a fost găsită</h1><p className="mt-4 text-zinc-400">Adresa poate fi greșită sau pagina nu mai este disponibilă.</p><Link href="/" className="mt-8 inline-block rounded-lg bg-emerald-400 px-6 py-3 font-semibold text-black">Înapoi la pagina principală</Link></main>;
}
