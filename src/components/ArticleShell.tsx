import Link from 'next/link';
import type { ReactNode } from 'react';
export function ArticleShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
    <Link href="/" className="text-sm text-zinc-400 hover:text-emerald-300">← Înapoi la platformă</Link>
    <p className="mb-4 mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">{eyebrow}</p>
    <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
    <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">{intro}</p>
    <div className="mt-12 space-y-8">{children}</div>
  </main>;
}
