'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Loader2, ReceiptText } from 'lucide-react';
import { toPercent } from '@/lib/marketMath';
import type { MarketWithPrices, TradeQuote, WalletAccount } from '@/types/market';

interface TradeTicketProps {
  market: MarketWithPrices;
  wallet: WalletAccount | null;
  onConnect: () => Promise<WalletAccount | null>;
  onTradeComplete: () => void;
}

export function TradeTicket({ market, wallet, onConnect, onTradeComplete }: TradeTicketProps) {
  const [outcomeId, setOutcomeId] = useState(market.outcomes[0]?.id || '');
  const [amount, setAmount] = useState(25);
  const [quote, setQuote] = useState<TradeQuote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<string | null>(null);

  const selectedOutcome = useMemo(
    () => market.outcomes.find((outcome) => outcome.id === outcomeId),
    [market.outcomes, outcomeId],
  );

  useEffect(() => {
    let isMounted = true;
    setError(null);
    fetch(`/api/markets/${market.slug}/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcomeId, amount }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) {
          return;
        }
        if (data.error) {
          setQuote(null);
          setError(data.error);
          return;
        }
        setQuote(data.quote);
      })
      .catch(() => {
        if (isMounted) {
          setQuote(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [amount, market.slug, outcomeId]);

  const placeTrade = async () => {
    setError(null);
    setSuccessTx(null);
    setIsSubmitting(true);

    try {
      let activeWallet = wallet;
      if (!activeWallet) {
        activeWallet = await onConnect();
      }
      if (!activeWallet) {
        throw new Error('Wallet mock neconectat');
      }

      const response = await fetch(`/api/markets/${market.slug}/trade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: activeWallet.address,
          outcomeId,
          amount,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Trade eșuat');
      }

      setSuccessTx(data.trade.txHash);
      onTradeComplete();
    } catch (tradeError) {
      setError(tradeError instanceof Error ? tradeError.message : 'Trade eșuat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = market.status !== 'open' || isSubmitting;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
      <div className="mb-5 flex items-center gap-2">
        <ReceiptText className="h-5 w-5 text-emerald-300" />
        <h2 className="text-lg font-semibold text-white">Trade ticket</h2>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2">
        {market.outcomes.map((outcome) => (
          <button
            key={outcome.id}
            onClick={() => setOutcomeId(outcome.id)}
            className={`rounded-md border p-3 text-left transition ${
              outcome.id === outcomeId
                ? 'border-emerald-400 bg-emerald-400/10'
                : 'border-zinc-800 bg-black hover:border-zinc-700'
            }`}
          >
            <div className="text-sm font-semibold text-white">{outcome.label}</div>
            <div className="mt-1 text-xs text-zinc-400">{toPercent(market.probabilities[outcome.id] || 0)}%</div>
          </button>
        ))}
      </div>

      <label className="mb-2 block text-sm font-medium text-zinc-300">Sumă demo</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={5000}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="h-11 min-w-0 flex-1 rounded-md border border-zinc-700 bg-black px-3 text-white outline-none focus:border-emerald-400"
        />
        <span className="shrink-0 text-sm text-zinc-400">mRON</span>
      </div>
      <input
        type="range"
        min={1}
        max={500}
        value={Math.min(amount, 500)}
        onChange={(event) => setAmount(Number(event.target.value))}
        className="mt-4 w-full accent-emerald-400"
      />

      <div className="my-5 rounded-md border border-zinc-800 bg-black p-4 text-sm">
        <div className="mb-2 flex justify-between gap-3 text-zinc-400">
          <span>Outcome</span>
          <span className="font-medium text-white">{selectedOutcome?.label}</span>
        </div>
        <div className="mb-2 flex justify-between gap-3 text-zinc-400">
          <span>Shares estimate</span>
          <span className="font-medium text-white">{quote ? quote.shares.toLocaleString('ro-RO') : '-'}</span>
        </div>
        <div className="mb-2 flex justify-between gap-3 text-zinc-400">
          <span>Preț mediu</span>
          <span className="font-medium text-white">{quote ? `${quote.averagePrice.toLocaleString('ro-RO')} mRON` : '-'}</span>
        </div>
        <div className="flex justify-between gap-3 text-zinc-400">
          <span>Probabilitate după</span>
          <span className="font-medium text-white">{quote ? `${toPercent(quote.probabilityAfter)}%` : '-'}</span>
        </div>
      </div>

      {error && <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
      {successTx && (
        <div className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-200">
          Tx mock: <span className="font-mono">{successTx.slice(0, 18)}...</span>
        </div>
      )}

      <button
        onClick={() => void placeTrade()}
        disabled={disabled}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {wallet ? 'Cumpără shares' : 'Conectează și cumpără'}
      </button>
    </div>
  );
}
