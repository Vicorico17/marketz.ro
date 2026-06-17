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
        throw new Error(data.error || 'Market creation failed');
      }
      setMessage('Piața a fost creată.');
      setForm({ ...initialForm, closeAt: tomorrowLocalInput() });
      await loadMarkets();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Market creation failed');
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
        throw new Error(data.error || 'Update failed');
      }
      setMessage(`Status actualizat: ${statusLabel(status)}.`);
      await loadMarkets();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Update failed');
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
          notes: resolveNotes[market.id] || 'Rezolvat din consola mock.',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Resolution failed');
      }
      setMessage('Piața a fost rezolvată și payout-ul mock a fost creditat.');
      await loadMarkets();
    } catch (resolveError) {
      setError(resolveError instanceof Error ? resolveError.message : 'Resolution failed');
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
            Mock admin console
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <section className="space-y-5">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <label className="mb-2 block text-sm font-medium text-zinc-300">Admin mock key</label>
            <input
              value={adminKey}
              onChange={(event) => saveKey(event.target.value)}
              placeholder="marketz-admin"
              className="h-11 w-full rounded-md border border-zinc-700 bg-black px-3 text-white outline-none focus:border-emerald-400"
            />
            <p className="mt-3 text-xs leading-5 text-zinc-500">
              Cheia default pentru development este <span className="font-mono text-zinc-300">marketz-admin</span>. Nu este autentificare de producție.
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
              <Field label="Tag-uri">
                <input
                  value={form.tags}
                  onChange={(event) => setForm({ ...form, tags: event.target.value })}
                  placeholder="BNR, macro, București"
                  className="h-11 w-full rounded-md border border-zinc-700 bg-black px-3 text-white outline-none focus:border-emerald-400"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Outcome-uri">
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
            <h2 className="text-2xl font-bold text-white">Market ops</h2>
            <p className="mt-1 text-sm text-zinc-500">Controlează statusul și settlement-ul mock.</p>
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
                    <div className="mt-1 text-sm text-zinc-500">{market.volume.toLocaleString('ro-RO')} mRON · {market.tradeCount} trade-uri</div>
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
                      placeholder="Note settlement"
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
