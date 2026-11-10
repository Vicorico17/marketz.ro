import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Marketz.ro — Petiție pentru piețele de predicții", template: "%s | Marketz.ro" },
  description: "Susține un cadru distinct pentru piețele de predicții în România: concurență, costuri transparente și fiscalitate proporțională.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        <a href="#page-content" className="skip-link">Sari la conținut</a>
        <nav aria-label="Navigație principală" className="border-b border-zinc-800 bg-zinc-950">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm sm:px-6">
            <Link href="/" className="font-bold text-emerald-300">MARKETZ</Link>
            <div className="ml-auto flex items-center gap-5 sm:gap-8"><Link href="/" className="py-2 font-medium text-zinc-200 transition hover:text-emerald-300">Petiția</Link><Link href="/exemplu" className="py-2 font-medium text-zinc-400 transition hover:text-emerald-300">Exemplul</Link></div>
          </div>
        </nav>
        <div id="page-content" tabIndex={-1}>{children}</div>
        <footer className="border-t border-zinc-800 px-4 py-8 text-sm text-zinc-400">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4">
            <p>Marketz.ro · O piață liberă. Un cadru distinct.</p>
            <Link href="/confidentialitate" className="hover:text-emerald-300">Date personale</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
