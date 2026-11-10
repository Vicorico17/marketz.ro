'use client';

import { useCallback, useEffect, useState } from 'react';
import type { WalletAccount } from '@/types/market';

const WALLET_KEY = 'marketz_mock_wallet';

function randomAddress() {
  const bytes = new Uint8Array(20);
  window.crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function useMockWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<WalletAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async (nextAddress: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/wallets/${nextAddress}`);
      const data = await response.json();
      if (!response.ok || !data.wallet) throw new Error(data.error || 'Contul demo nu este disponibil');
      setWallet(data.wallet);
      setAddress(data.wallet.address);
      try { localStorage.setItem(WALLET_KEY, data.wallet.address); } catch { /* Use this session only. */ }
      return data.wallet as WalletAccount;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Conexiunea a eșuat');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connect = useCallback(async () => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(WALLET_KEY); } catch { /* Session still works without storage. */ }
    const nextAddress = saved && /^0x[0-9a-fA-F]{40}$/.test(saved) ? saved : randomAddress();
    return loadWallet(nextAddress);
  }, [loadWallet]);

  const disconnect = useCallback(() => {
    try { localStorage.removeItem(WALLET_KEY); } catch { /* Storage may be disabled. */ }
    setAddress(null);
    setWallet(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!address) {
      return null;
    }
    return loadWallet(address);
  }, [address, loadWallet]);

  const faucet = useCallback(async () => {
    if (!address) {
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/wallets/${address}/faucet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 250 }),
      });
      const data = await response.json();
      if (!response.ok || !data.wallet) throw new Error(data.error || 'Contul demo nu este disponibil');
      setWallet(data.wallet);
      return data.wallet as WalletAccount;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Conexiunea a eșuat');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(WALLET_KEY); } catch { return; }
    if (saved && /^0x[0-9a-fA-F]{40}$/.test(saved)) {
      void loadWallet(saved);
    }
  }, [loadWallet]);

  return {
    address,
    wallet,
    isLoading,
    error,
    connect,
    disconnect,
    refresh,
    faucet,
  };
}
