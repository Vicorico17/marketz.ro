'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ProbabilityBar } from '@/components/ProbabilityBar';
import { categoryLabel, statusLabel } from '@/lib/labels';
import type { MarketCategory, MarketSnapshot, MarketStatus, MarketWithPrices } from '@/types/market';

const ADMIN_KEY_STORAGE = 'marketz_mock_admin_key';
const categories: MarketCategory[] = ['politica', 'economie', 'sport', 'locale', 'cultura', 'tech', 'meteo'];
const statuses: MarketStatus[] = ['draft', 'open', 'closed', 'voided'];

interface FormState {
  question: string;
  description: string;
  category: MarketCategory;
  tags: string;
  outcomes: string;
  probabilities: string;
  closeAt: string;
  resolutionSource: string;
  liquidity: string;
}

const initialForm: FormState = {
  question: '',
  description: '',
  category: 'politica',
  tags: '',
  outcomes: 'Da\nNu',
  probabilities: '50\n50',
  closeAt: '',
  resolutionSource: '',
  liquidity: '140',
};

function tomorrowLocalInput() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  date.setHours(20, 0, 0, 0);
  return date.toISOString().slice(0, 16);
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [form, setForm] = useState<FormState>({ ...initialForm, closeAt: tomorrowLocalInput() });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resolveOutcome, setResolveOutcome] = useState<Record<string, string>>({});
  const [resolveNotes, setResolveNotes] = useState<Record<string, string>>({});

  const markets = useMemo(() => snapshot?.markets || [], [snapshot]);
  const riskPreview = useMemo(() => {
    const outcomes = form.outcomes
      .split('\n')
      .map((outcome) => outcome.trim())
      .filter(Boolean);
    const rawProbabilities = form.probabilities
      .split('\n')
      .map((value) => Number(value.trim()) / 100)
      .filter((value) => Number.isFinite(value) && value > 0);
    const liquidity = Number(form.liquidity) || 140;
    const probabilities = rawProbabilities.length === outcomes.length
      ? rawProbabilities
      : Array.from({ length: Math.max(outcomes.length, 1) }, () => 1 / Math.max(outcomes.length, 1));
    const total = probabilities.reduce((sum, value) => sum + value, 0) || 1;
    const normalized = probabilities.map((value) => value / total);
    const lowestProbability = Math.max(Math.min(...normalized), 0.0001);

    return {
      liquidity,
      outcomeCount: outcomes.length,
      estimatedRisk: Math.round(liquidity * Math.log(1 / lowestProbability) * 100) / 100,
      recommendedMaxTrade: Math.round(Math.max(5, liquidity * 0.25) * 100) / 100,
      isSkewed: lowestProbability < 0.2,
    };
  }, [form.liquidity, form.outcomes, form.probabilities]);

  const loadMarkets = async () => {
    const response = await fetch('/api/markets');
    const data = await response.json();
    setSnapshot(data);
  };

  useEffect(() => {
    setAdminKey(localStorage.getItem(ADMIN_KEY_STORAGE) || '');
    void loadMarkets();
  }, []);

  const saveKey = (nextKey: string) => {
    setAdminKey(nextKey);
    localStorage.setItem(ADMIN_KEY_STORAGE, nextKey);
  };

  const createMarket = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const outcomes = form.outcomes
      .split('\n')
      .map((outcome) => outcome.trim())
      .filter(Boolean);
    const startingProbabilities = form.probabilities
      .split('\n')
      .map((value) => Number(value.trim()) / 100)
      .filter((value) => Number.isFinite(value) && value > 0);

    try {
      const response = await fetch('/api/markets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          question: form.question,
          description: form.description,
          category: form.category,
          tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
          outcomes,
          closeAt: new Date(form.closeAt).toISOString(),
          resolutionSource: form.resolutionSource,
          liquidity: Number(form.liquidity) || 140,
          startingProbabilities,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Crearea pieței a eșuat');
      }
      setMessage('Piața a fost creată.');
      setForm({ ...initialForm, closeAt: tomorrowLocalInput() });
      await loadMarkets();
    } catch (createError) {
      setError(createError instanceof TypeError ? "Conexiunea a eșuat. Încearcă din nou." : createError instanceof Error ? createError.message : 'Crearea pieței a eșuat');
    }
  };

  const updateStatus = async (market: MarketWithPrices, status: MarketStatus) => {
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/markets/${market.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Actualizarea a eșuat');
      }
      setMessage(`Stare actualizată: ${statusLabel(status)}.`);
      await loadMarkets();
    } catch (updateError) {
      setError(updateError instanceof TypeError ? "Conexiunea a eșuat. Încearcă din nou." : updateError instanceof Error ? updateError.message : 'Actualizarea a eșuat');
    }
  };

  const resolveMarket = async (market: MarketWithPrices) => {
    setError(null);
    setMessage(null);

    try {
      const outcomeId = resolveOutcome[market.id] || market.outcomes[0]?.id;
      const response = await fetch(`/api/markets/${market.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          action: 'resolve',
          outcomeId,
          notes: resolveNotes[market.id] || 'Rezolvat din panoul de administrare demonstrativ.',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Rezolvarea pieței a eșuat');
      }
      setMessage('Piața a fost rezolvată, iar plata demonstrativă a fost creditată.');
      await loadMarkets();
    } catch (resolveError) {
      setError(resolveError instanceof TypeError ? "Conexiunea a eșuat. Încearcă din nou." : resolveError instanceof Error ? resolveError.message : 'Rezolvarea pieței a eșuat');
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <header className="border-b border-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Înapoi la piețe
          </Link>
          <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Panou de administrare demonstrativ
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <section className="space-y-5">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <label className="mb-2 block text-sm font-medium text-zinc-300">Cheie de administrator</label>
            <input
              value={adminKey}
              onChange={(event) => saveKey(event.target.value)}
              placeholder="marketz-admin"
              className="h-11 w-full rounded-md border border-zinc-700 bg-black px-3 text-white outline-none focus:border-emerald-400"
            />
            <p className="mt-3 text-xs leading-5 text-zinc-500">
              Cheia implicită pentru dezvoltare este <span className="font-mono text-zinc-300">marketz-admin</span>. Nu este autentificare de producție.
            </p>
          </div>

          <form onSubmit={createMarket} className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <h1 className="mb-5 text-xl font-bold text-white">Creează piață</h1>
            <div className="space-y-4">
              <Field label="Întrebare">
                <input
                  value={form.question}
                  onChange={(event) => setForm({ ...form, question: event.target.value })}
                  required
                  className="h-11 w-full rounded-md border border-zinc-700 bg-black px-3 text-white outline-none focus:border-emerald-400"
                />
              </Field>
              <Field label="Descriere">
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  required
                  rows={4}
                  className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Categorie">
                  <select
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value as MarketCategory })}
                    className="h-11 w-full rounded-md border border-zinc-700 bg-black px-3 text-white outline-none focus:border-emerald-400"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {categoryLabel(item)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Lichiditate">
                  <input
                    value={form.liquidity}
                    onChange={(event) => setForm({ ...form, liquidity: event.target.value })}
                    type="number"
                    min={20}
                    className="h-11 w-full rounded-md border border-zinc-700 bg-black px-3 text-white outline-none focus:border-emerald-400"
                  />
                </Field>
              </div>
              <Field label="Etichete">
                <input
                  value={form.tags}
                  onChange={(event) => setForm({ ...form, tags: event.target.value })}
                  placeholder="BNR, macro, București"
                  className="h-11 w-full rounded-md border border-zinc-700 bg-black px-3 text-white outline-none focus:border-emerald-400"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rezultate posibile">
                  <textarea
                    value={form.outcomes}
                    onChange={(event) => setForm({ ...form, outcomes: event.target.value })}
                    required
                    rows={3}
                    className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white outline-none focus:border-emerald-400"
                  />
                </Field>
                <Field label="Probabilități %">
                  <textarea
                    value={form.probabilities}
                    onChange={(event) => setForm({ ...form, probabilities: event.target.value })}
                    rows={3}
                    className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white outline-none focus:border-emerald-400"
                  />
                </Field>
              </div>
              <div className="rounded-md border border-zinc-800 bg-black p-4 text-sm">
                <div className="mb-3 font-semibold text-white">Estimarea lichidității</div>
                <div className="grid gap-2 text-zinc-400 sm:grid-cols-2">
                  <div className="flex justify-between gap-3">
                    <span>Rezultate posibile</span>
                    <span className="font-medium text-white">{riskPreview.outcomeCount}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Lichiditate b</span>
                    <span className="font-medium text-white">{riskPreview.liquidity.toLocaleString('ro-RO')}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Risc estimat al furnizorului de lichiditate</span>
                    <span className="font-medium text-white">{riskPreview.estimatedRisk.toLocaleString('ro-RO')} mRON</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Tranzacție maximă recomandată</span>
                    <span className="font-medium text-white">{riskPreview.recommendedMaxTrade.toLocaleString('ro-RO')} mRON</span>
                  </div>
                </div>
                {riskPreview.isSkewed && (
                  <div className="mt-3 rounded-md border border-amber-400/30 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
                    Probabilitățile sunt foarte dezechilibrate. Rezultatul cu preț mic poate produce o pierdere mare furnizorului de lichiditate dacă este declarat câștigător.
                  </div>
                )}
              </div>
              <Field label="Închidere">
                <input
                  value={form.closeAt}
                  onChange={(event) => setForm({ ...form, closeAt: event.target.value })}
                  type="datetime-local"
                  required
                  className="h-11 w-full rounded-md border border-zinc-700 bg-black px-3 text-white outline-none focus:border-emerald-400"
                />
              </Field>
              <Field label="Sursă de rezolvare">
                <textarea
                  value={form.resolutionSource}
                  onChange={(event) => setForm({ ...form, resolutionSource: event.target.value })}
                  required
                  rows={3}
                  className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </Field>
              <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition hover:bg-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Creează piață
              </button>
            </div>
          </form>

          {message && <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</div>}
          {error && <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
        </section>

        <section className="min-w-0">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-white">Administrarea piețelor</h2>
            <p className="mt-1 text-sm text-zinc-500">Gestionează starea și decontarea demonstrativă.</p>
          </div>
          <div className="space-y-4">
            {markets.map((market) => (
              <div key={market.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300">{categoryLabel(market.category)}</span>
                      <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                        {statusLabel(market.status)}
                      </span>
                    </div>
                    <Link href={`/markets/${market.slug}`} className="text-lg font-semibold text-white hover:text-emerald-200">
                      {market.question}
                    </Link>
                    <div className="mt-1 text-sm text-zinc-500">
                      {market.volume.toLocaleString('ro-RO')} mRON · {market.tradeCount} tranzacții · {market.liquidityRisk.toLocaleString('ro-RO')} mRON risc de lichiditate
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => void updateStatus(market, status)}
                        className="h-9 rounded-md border border-zinc-800 px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-900"
                      >
                        {statusLabel(status)}
                      </button>
                    ))}
                  </div>
                </div>

                <ProbabilityBar outcomes={market.outcomes} probabilities={market.probabilities} compact />

                {market.status !== 'resolved' ? (
                  <div className="mt-4 grid gap-3 border-t border-zinc-800 pt-4 lg:grid-cols-[180px_1fr_auto]">
                    <select
                      value={resolveOutcome[market.id] || market.outcomes[0]?.id}
                      onChange={(event) => setResolveOutcome({ ...resolveOutcome, [market.id]: event.target.value })}
                      className="h-10 rounded-md border border-zinc-700 bg-black px-3 text-sm text-white outline-none focus:border-emerald-400"
                    >
                      {market.outcomes.map((outcome) => (
                        <option key={outcome.id} value={outcome.id}>
                          {outcome.label}
                        </option>
                      ))}
                    </select>
                    <input
                      value={resolveNotes[market.id] || ''}
                      onChange={(event) => setResolveNotes({ ...resolveNotes, [market.id]: event.target.value })}
                      placeholder="Justificarea rezolvării"
                      className="h-10 rounded-md border border-zinc-700 bg-black px-3 text-sm text-white outline-none focus:border-emerald-400"
                    />
                    <button
                      onClick={() => void resolveMarket(market)}
                      className="h-10 rounded-md bg-amber-400 px-4 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
                    >
                      Rezolvă
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                    Rezolvat: {market.outcomes.find((outcome) => outcome.id === market.resolvedOutcomeId)?.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      {children}
    </label>
  );
}
