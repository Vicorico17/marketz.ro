export type MarketStatus = 'draft' | 'open' | 'closed' | 'resolved' | 'voided';

export type MarketCategory =
  | 'politica'
  | 'economie'
  | 'sport'
  | 'locale'
  | 'cultura'
  | 'tech'
  | 'meteo';

export interface MarketOutcome {
  id: string;
  label: string;
  color: string;
}

export interface MockChainRef {
  network: string;
  contractAddress: string;
  conditionId: string;
  blockCreated: number;
  lastTxHash?: string;
}

export interface Market {
  id: string;
  slug: string;
  question: string;
  description: string;
  category: MarketCategory;
  tags: string[];
  outcomes: MarketOutcome[];
  closeAt: string;
  resolutionSource: string;
  status: MarketStatus;
  liquidity: number;
  quantities: Record<string, number>;
  volume: number;
  tradeCount: number;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedOutcomeId?: string;
  resolverNotes?: string;
  chain: MockChainRef;
}

export interface MarketWithPrices extends Market {
  probabilities: Record<string, number>;
}

export interface WalletAccount {
  address: string;
  displayName: string;
  balance: number;
  startingBalance: number;
  joinedAt: string;
  lastSeenAt: string;
}

export interface Position {
  id: string;
  marketId: string;
  marketSlug: string;
  marketQuestion: string;
  walletAddress: string;
  outcomeId: string;
  outcomeLabel: string;
  shares: number;
  costBasis: number;
  averagePrice: number;
  currentProbability: number;
  markValue: number;
  payoutIfCorrect: number;
  unrealizedPnl: number;
  isResolved: boolean;
  isWinner: boolean;
  updatedAt: string;
}

export interface Trade {
  id: string;
  marketId: string;
  marketSlug: string;
  walletAddress: string;
  outcomeId: string;
  outcomeLabel: string;
  amount: number;
  shares: number;
  averagePrice: number;
  probabilityBefore: number;
  probabilityAfter: number;
  txHash: string;
  blockNumber: number;
  createdAt: string;
}

export interface TradeQuote {
  outcomeId: string;
  amount: number;
  shares: number;
  averagePrice: number;
  probabilityBefore: number;
  probabilityAfter: number;
}

export interface CreateMarketInput {
  question: string;
  description: string;
  category: MarketCategory;
  tags?: string[];
  outcomes: string[];
  closeAt: string;
  resolutionSource: string;
  liquidity?: number;
  startingProbabilities?: number[];
}

export interface PlaceTradeInput {
  marketSlug: string;
  walletAddress: string;
  outcomeId: string;
  amount: number;
}

export interface ResolveMarketInput {
  outcomeId: string;
  notes: string;
}

export interface MarketSnapshot {
  markets: MarketWithPrices[];
  totalVolume: number;
  openMarkets: number;
  totalTrades: number;
}
