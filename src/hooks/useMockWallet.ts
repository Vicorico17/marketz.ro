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

  const loadWallet = useCallback(async (nextAddress: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/wallets/${nextAddress}`);
      const data = await response.json();
      setWallet(data.wallet);
      setAddress(data.wallet.address);
      localStorage.setItem(WALLET_KEY, data.wallet.address);
      return data.wallet as WalletAccount;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connect = useCallback(async () => {
    const nextAddress = localStorage.getItem(WALLET_KEY) || randomAddress();
    return loadWallet(nextAddress);
  }, [loadWallet]);

  const disconnect = useCallback(() => {
    localStorage.removeItem(WALLET_KEY);
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
    try {
      const response = await fetch(`/api/wallets/${address}/faucet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 250 }),
      });
      const data = await response.json();
      setWallet(data.wallet);
      return data.wallet as WalletAccount;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    const saved = localStorage.getItem(WALLET_KEY);
    if (saved) {
      void loadWallet(saved);
    }
  }, [loadWallet]);

  return {
    address,
    wallet,
    isLoading,
    connect,
    disconnect,
    refresh,
    faucet,
  };
}
