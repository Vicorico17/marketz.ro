import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Marketz.ro — Predicții și reguli transparente", template: "%s | Marketz.ro" },
  description: "Explorează piețe de predicții cu credite demo și propunerea pentru concurență, costuri transparente și fiscalitate proporțională în România.",
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
            <Link href="/#demo">Predicții România</Link>
            <Link href="/cum-functioneaza">Cum funcționează</Link>
            <Link href="/cercetare">Cercetare & legislație</Link>
            <Link href="/petitie">Petiția</Link>
            <span className="text-xs text-zinc-400 sm:ml-auto">DEMO · 0 bani reali</span>
          </div>
        </nav>
        <div id="page-content" tabIndex={-1}>{children}</div>
        <footer className="border-t border-zinc-800 px-4 py-8 text-sm text-zinc-400">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4">
            <p className="max-w-xl">Marketz este un prototip educațional. Creditele sunt gratuite, fără valoare monetară. Datele demo se pot reseta la repornirea serverului.</p>
            <div className="flex flex-wrap gap-5"><Link href="/petitie">Propunerea civică</Link><Link href="/cercetare">Surse & limite</Link><Link href="/confidentialitate">Date personale</Link></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
