'use client';

import { Copy, LogOut, Plus, Wallet } from 'lucide-react';
import { shortAddress, useMockWallet } from '@/hooks/useMockWallet';

interface WalletPanelProps {
  walletState: ReturnType<typeof useMockWallet>;
  compact?: boolean;
}

export function WalletPanel({ walletState, compact }: WalletPanelProps) {
  const { address, wallet, connect, disconnect, faucet, isLoading, error } = walletState;

  if (!address || !wallet) {
    return (
      <div><button
        onClick={() => void connect()}
        disabled={isLoading}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Wallet className="h-4 w-4" />
        Încearcă un cont demo
      </button>{error && <p role="alert" className="mt-2 max-w-xs text-sm text-red-300">{error}</p>}</div>
    );
  }

  return (
    <div className={compact ? 'rounded-lg border border-zinc-800 bg-zinc-950 p-3' : 'rounded-lg border border-zinc-800 bg-zinc-950 p-4'}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Cont demo</div>
          <div className="mt-1 flex min-w-0 items-center gap-2 font-mono text-sm text-white">
            <span className="truncate">{shortAddress(address)}</span>
            <button
              onClick={() => void navigator.clipboard?.writeText(address).catch(() => {})}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-zinc-800 text-zinc-400 hover:text-white"
              title="Copiază adresa"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500">Balanță</div>
          <div className="text-lg font-bold text-amber-200">{wallet.balance.toLocaleString('ro-RO')} mRON</div>
        </div>
      </div>

      {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => void faucet()}
          disabled={isLoading}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-amber-400/40 bg-amber-400/10 px-3 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/20 disabled:opacity-60"
        >
          <Plus className="h-3.5 w-3.5" />
          +250 credite demo
        </button>
        <button
          onClick={disconnect}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-800 px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-900"
        >
          <LogOut className="h-3.5 w-3.5" />
          Ieși
        </button>
      </div>
    </div>
  );
}
