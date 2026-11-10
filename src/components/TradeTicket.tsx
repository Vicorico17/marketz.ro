'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Loader2, ReceiptText } from 'lucide-react';
import { toPercent } from '@/lib/marketMath';
import type { MarketWithPrices, Position, TradeQuote, TradeSide, WalletAccount } from '@/types/market';

interface TradeTicketProps {
  market: MarketWithPrices;
  wallet: WalletAccount | null;
  refreshKey?: number;
  onConnect: () => Promise<WalletAccount | null>;
  onTradeComplete: () => void;
}

interface PortfolioData {
  positions: Position[];
}

function signedPercentPoint(value: number) {
  const percent = toPercent(value);
  return `${percent > 0 ? '+' : ''}${percent} pp`;
}

export function TradeTicket({ market, wallet, refreshKey, onConnect, onTradeComplete }: TradeTicketProps) {
  const [side, setSide] = useState<TradeSide>('buy');
  const [outcomeId, setOutcomeId] = useState(market.outcomes[0]?.id || '');
  const [amount, setAmount] = useState(25);
  const [shares, setShares] = useState(1);
  const [quote, setQuote] = useState<TradeQuote | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<string | null>(null);

  const selectedOutcome = useMemo(
    () => market.outcomes.find((outcome) => outcome.id === outcomeId),
    [market.outcomes, outcomeId],
  );

  const selectedPosition = useMemo(() => {
    return portfolio?.positions.find(
      (position) => position.marketSlug === market.slug && position.outcomeId === outcomeId && position.shares > 0,
    );
  }, [market.slug, outcomeId, portfolio?.positions]);

  const ownedShares = selectedPosition?.shares || 0;
  const tradeValue = side === 'sell' ? shares : amount;

  useEffect(() => {
    if (!wallet) {
      setPortfolio(null);
      return;
    }

    let isMounted = true;
    fetch(`/api/wallets/${wallet.address}/portfolio`)
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setPortfolio(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPortfolio(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [wallet, refreshKey]);

  useEffect(() => {
    if (side === 'sell' && ownedShares > 0 && (shares <= 0 || shares > ownedShares)) {
      setShares(Math.min(ownedShares, Math.max(1, ownedShares)));
    }
  }, [ownedShares, shares, side]);

  useEffect(() => {
    let isMounted = true;
    setError(null);
    setQuote(null);

    if (market.status !== 'open' || (side === 'sell' && (!wallet || ownedShares <= 0 || shares > ownedShares))) {
      setQuote(null);
      return () => {
        isMounted = false;
      };
    }

    fetch(`/api/markets/${market.slug}/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ side, outcomeId, amount, shares }),
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
  }, [amount, market.slug, market.status, market.updatedAt, outcomeId, ownedShares, shares, side, wallet]);

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
          side,
          walletAddress: activeWallet.address,
          outcomeId,
          amount,
          shares,
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

  const hasHighImpact = quote ? Math.abs(quote.priceImpact) >= 0.1 : false;
  const disabled =
    market.status !== 'open' ||
    isSubmitting ||
    !quote ||
    Date.parse(market.closeAt) <= Date.now() ||
    Boolean(side === 'buy' && wallet && amount > wallet.balance) ||
    !Number.isFinite(tradeValue) ||
    tradeValue <= 0 ||
    Boolean(side === 'sell' && wallet && (ownedShares <= 0 || shares > ownedShares));

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
      <div className="mb-5 flex items-center gap-2">
        <ReceiptText className="h-5 w-5 text-emerald-300" />
        <h2 className="text-lg font-semibold text-white">Tranzacție demo</h2>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-md border border-zinc-800 bg-black p-1">
        {(['buy', 'sell'] as TradeSide[]).map((nextSide) => (
          <button
            key={nextSide}
            onClick={() => {
              setSide(nextSide);
              setError(null);
              setSuccessTx(null);
            }}
            className={`h-9 rounded-[5px] text-sm font-semibold transition ${
              side === nextSide ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {nextSide === 'buy' ? 'Cumpără' : 'Vinde'}
          </button>
        ))}
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
            <div className="mt-1 flex items-center justify-between gap-2 text-xs text-zinc-400">
              <span>{toPercent(market.probabilities[outcome.id] || 0)}%</span>
              {side === 'sell' && (
                <span>
                  {portfolio?.positions.find((position) => position.marketSlug === market.slug && position.outcomeId === outcome.id && position.shares > 0)?.shares.toLocaleString('ro-RO') || 0}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <label htmlFor="trade-amount" className="mb-2 block text-sm font-medium text-zinc-300">
        {side === 'buy' ? 'Sumă demo' : 'Unități de vândut'}
      </label>
      <div className="flex items-center gap-2">
        <input
          id="trade-amount"
          type="number"
          min={side === 'buy' ? 1 : 0}
          max={side === 'buy' ? 5000 : ownedShares}
          step={side === 'buy' ? 1 : 0.0001}
          value={side === 'buy' ? amount : shares}
          onChange={(event) => (side === 'buy' ? setAmount(Number(event.target.value)) : setShares(Number(event.target.value)))}
          className="h-11 min-w-0 flex-1 rounded-md border border-zinc-700 bg-black px-3 text-white outline-none focus:border-emerald-400"
        />
        <span className="shrink-0 text-sm text-zinc-400">{side === 'buy' ? 'mRON' : 'unități'}</span>
      </div>
      {side === 'buy' ? (
        <input
          aria-label="Sumă demo rapidă"
          type="range"
          min={1}
          max={500}
          value={Math.min(amount, 500)}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="mt-4 w-full accent-emerald-400"
        />
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-500">
          <span>Disponibil: {ownedShares.toLocaleString('ro-RO')} unități</span>
          <button
            onClick={() => setShares(ownedShares)}
            disabled={ownedShares <= 0}
            className="rounded-md border border-zinc-800 px-2 py-1 font-semibold text-zinc-300 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Max
          </button>
        </div>
      )}

      <div className="my-5 rounded-md border border-zinc-800 bg-black p-4 text-sm">
        <div className="mb-2 flex justify-between gap-3 text-zinc-400">
          <span>Rezultat</span>
          <span className="font-medium text-white">{selectedOutcome?.label}</span>
        </div>
        <div className="mb-2 flex justify-between gap-3 text-zinc-400">
          <span>{side === 'buy' ? 'Unități estimate' : 'Încasezi estimat'}</span>
          <span className="font-medium text-white">
            {quote ? (side === 'buy' ? quote.shares.toLocaleString('ro-RO') : `${quote.amount.toLocaleString('ro-RO')} mRON`) : '-'}
          </span>
        </div>
        <div className="mb-2 flex justify-between gap-3 text-zinc-400">
          <span>Preț mediu</span>
          <span className="font-medium text-white">{quote ? `${quote.averagePrice.toLocaleString('ro-RO')} mRON` : '-'}</span>
        </div>
        <div className="mb-2 flex justify-between gap-3 text-zinc-400">
          <span>Impact preț</span>
          <span className={quote && Math.abs(quote.priceImpact) >= 0.1 ? 'font-medium text-amber-200' : 'font-medium text-white'}>
            {quote ? signedPercentPoint(quote.priceImpact) : '-'}
          </span>
        </div>
        <div className="flex justify-between gap-3 text-zinc-400">
          <span>Probabilitate după</span>
          <span className="font-medium text-white">{quote ? `${toPercent(quote.probabilityAfter)}%` : '-'}</span>
        </div>
      </div>

      {side === 'sell' && wallet && ownedShares <= 0 && (
        <div className="mb-4 rounded-md border border-zinc-800 bg-black p-3 text-sm text-zinc-400">
          Nu ai unități pentru rezultatul selectat.
        </div>
      )}
      {hasHighImpact && (
        <div className="mb-4 rounded-md border border-amber-400/40 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
          Această tranzacție modifică mult probabilitatea. Reducerea sumei reduce impactul; împărțirea aceleiași sume în mai multe ordine nu elimină impactul cumulat.
        </div>
      )}
      {error && <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
      {successTx && (
        <div className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-200">
          Tranzacție demo înregistrată.
        </div>
      )}

      <button
        onClick={() => void placeTrade()}
        disabled={disabled}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {wallet ? (side === 'buy' ? 'Cumpără unități' : 'Vinde unități') : `Conectează și ${side === 'buy' ? 'cumpără' : 'vinde'}`}
      </button>
    </div>
  );
}
