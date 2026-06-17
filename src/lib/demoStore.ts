import {
  addPrices,
  createOutcomeId,
  probabilitiesFor,
  quantitiesFromProbabilities,
  quoteBuy,
  roundMoney,
  roundShares,
  slugify,
} from '@/lib/marketMath';
import { createMockChainRef, mockTxHash, nextMockBlock } from '@/lib/mockChain';
import type {
  CreateMarketInput,
  Market,
  MarketCategory,
  MarketSnapshot,
  MarketStatus,
  MarketWithPrices,
  PlaceTradeInput,
  Position,
  ResolveMarketInput,
  Trade,
  TradeQuote,
  WalletAccount,
} from '@/types/market';

const STARTING_BALANCE = 1000;
const OUTCOME_COLORS = ['#22c55e', '#ef4444', '#38bdf8', '#f59e0b', '#a855f7'];

interface DemoState {
  markets: Market[];
  wallets: WalletAccount[];
  trades: Trade[];
  positions: Position[];
}

declare global {
  // eslint-disable-next-line no-var
  var __marketzDemoState: DemoState | undefined;
}

function now() {
  return new Date().toISOString();
}

function futureDate(month: number, day: number, hour = 20) {
  return new Date(Date.UTC(2026, month - 1, day, hour, 0, 0)).toISOString();
}

function makeMarket(input: CreateMarketInput & { id: string; slug?: string; volume?: number; tradeCount?: number }) {
  const createdAt = now();
  const outcomes = input.outcomes.map((label, index) => ({
    id: createOutcomeId(label, index),
    label,
    color: OUTCOME_COLORS[index % OUTCOME_COLORS.length],
  }));
  const liquidity = input.liquidity || 140;

  return {
    id: input.id,
    slug: input.slug || `${slugify(input.question)}-${input.id}`,
    question: input.question,
    description: input.description,
    category: input.category,
    tags: input.tags || [],
    outcomes,
    closeAt: input.closeAt,
    resolutionSource: input.resolutionSource,
    status: 'open' as MarketStatus,
    liquidity,
    quantities: quantitiesFromProbabilities(outcomes, input.startingProbabilities || [], liquidity),
    volume: input.volume || 0,
    tradeCount: input.tradeCount || 0,
    participantCount: 0,
    createdAt,
    updatedAt: createdAt,
    chain: createMockChainRef(),
  };
}

function seedMarkets() {
  return [
    makeMarket({
      id: 'mkt-ron-eur-2026',
      slug: 'eur-ron-peste-5-15-la-final-de-2026',
      question: 'Va fi cursul EUR/RON peste 5.15 la BNR pe 31 decembrie 2026?',
      description:
        'Piața se rezolvă pe baza cursului oficial BNR publicat pentru 31 decembrie 2026. Dacă BNR nu publică în acea zi, se folosește ultima zi lucrătoare disponibilă înainte de dată.',
      category: 'economie',
      tags: ['BNR', 'EUR/RON', 'macro'],
      outcomes: ['Da', 'Nu'],
      closeAt: futureDate(12, 30, 22),
      resolutionSource: 'Cursul oficial BNR EUR/RON.',
      liquidity: 180,
      startingProbabilities: [0.42, 0.58],
      volume: 13240,
      tradeCount: 184,
    }),
    makeMarket({
      id: 'mkt-inflatie-2026',
      slug: 'inflatia-romaniei-peste-5-in-decembrie-2026',
      question: 'Va depăși inflația anuală a României 5% în decembrie 2026?',
      description:
        'Se folosește rata anuală IPC publicată de INS pentru luna decembrie 2026. Piața se rezolvă "Da" dacă valoarea este strict peste 5.0%.',
      category: 'economie',
      tags: ['INS', 'inflație'],
      outcomes: ['Da', 'Nu'],
      closeAt: futureDate(12, 31, 20),
      resolutionSource: 'Comunicatul INS privind IPC decembrie 2026.',
      liquidity: 160,
      startingProbabilities: [0.36, 0.64],
      volume: 8750,
      tradeCount: 121,
    }),
    makeMarket({
      id: 'mkt-superliga-2027',
      slug: 'fcsb-primul-loc-la-finalul-sezonului-regular-2026-2027',
      question: 'Va termina FCSB pe primul loc sezonul regular SuperLiga 2026-2027?',
      description:
        'Rezolvarea se face după clasamentul oficial LPF de la finalul sezonului regular, înainte de play-off/play-out.',
      category: 'sport',
      tags: ['SuperLiga', 'fotbal'],
      outcomes: ['Da', 'Nu'],
      closeAt: futureDate(9, 1, 18),
      resolutionSource: 'Clasamentul oficial LPF.',
      liquidity: 130,
      startingProbabilities: [0.31, 0.69],
      volume: 6620,
      tradeCount: 94,
    }),
    makeMarket({
      id: 'mkt-bucuresti-metro-2026',
      slug: 'bucuresti-deschide-o-statie-noua-de-metrou-pana-la-final-de-2026',
      question: 'Va fi deschisă publicului cel puțin o stație nouă de metrou în București până la final de 2026?',
      description:
        'Contează doar stațiile noi deschise pentru circulație publică regulată, nu teste, recepții tehnice sau evenimente de presă.',
      category: 'locale',
      tags: ['București', 'transport'],
      outcomes: ['Da', 'Nu'],
      closeAt: futureDate(12, 31, 18),
      resolutionSource: 'Comunicate Metrorex și verificare publică a operării comerciale.',
      liquidity: 125,
      startingProbabilities: [0.47, 0.53],
      volume: 5125,
      tradeCount: 73,
    }),
    makeMarket({
      id: 'mkt-alegeri-locale-bucuresti',
      slug: 'bucuresti-va-avea-primar-general-nou-inainte-de-decembrie-2026',
      question: 'Va avea Bucureștiul un primar general nou înainte de 1 decembrie 2026?',
      description:
        'Piața se rezolvă "Da" dacă o altă persoană decât titularul funcției la crearea pieței depune jurământul sau exercită mandatul ca primar general înainte de termen.',
      category: 'politica',
      tags: ['București', 'administrație'],
      outcomes: ['Da', 'Nu'],
      closeAt: futureDate(11, 30, 20),
      resolutionSource: 'Hotărâri oficiale, comunicate PMB și rezultate electorale validate.',
      liquidity: 150,
      startingProbabilities: [0.54, 0.46],
      volume: 14990,
      tradeCount: 205,
    }),
    makeMarket({
      id: 'mkt-eurovision-romania',
      slug: 'romania-anunta-participarea-la-eurovision-2027-pana-in-octombrie-2026',
      question: 'Va anunța România participarea la Eurovision 2027 până la 31 octombrie 2026?',
      description:
        'Piața se rezolvă pe baza unui anunț public al TVR, EBU sau al organizatorilor competiției.',
      category: 'cultura',
      tags: ['TVR', 'Eurovision'],
      outcomes: ['Da', 'Nu'],
      closeAt: futureDate(10, 31, 20),
      resolutionSource: 'Anunț oficial TVR/EBU.',
      liquidity: 100,
      startingProbabilities: [0.28, 0.72],
      volume: 2980,
      tradeCount: 49,
    }),
  ];
}

function getState() {
  if (!global.__marketzDemoState) {
    global.__marketzDemoState = {
      markets: seedMarkets(),
      wallets: [],
      trades: [],
      positions: [],
    };
  }

  return global.__marketzDemoState;
}

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

function publicMarket(market: Market): MarketWithPrices {
  return addPrices({
    ...market,
    participantCount: getParticipants(market.id).length,
  });
}

function getParticipants(marketId: string) {
  const state = getState();
  return Array.from(new Set(state.trades.filter((trade) => trade.marketId === marketId).map((trade) => trade.walletAddress)));
}

function findMarket(slugOrId: string) {
  const state = getState();
  return state.markets.find((market) => market.slug === slugOrId || market.id === slugOrId);
}

export function getSnapshot(): MarketSnapshot {
  const state = getState();
  const markets = state.markets.map(publicMarket).sort((a, b) => {
    const statusOrder = { open: 0, draft: 1, closed: 2, resolved: 3, voided: 4 };
    return statusOrder[a.status] - statusOrder[b.status] || b.volume - a.volume;
  });

  return {
    markets,
    totalVolume: roundMoney(markets.reduce((sum, market) => sum + market.volume, 0)),
    openMarkets: markets.filter((market) => market.status === 'open').length,
    totalTrades: markets.reduce((sum, market) => sum + market.tradeCount, 0),
  };
}

export function getMarket(slugOrId: string) {
  const market = findMarket(slugOrId);
  if (!market) {
    return null;
  }

  const state = getState();
  return {
    market: publicMarket(market),
    recentTrades: state.trades
      .filter((trade) => trade.marketId === market.id)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 20),
  };
}

export function createMarket(input: CreateMarketInput) {
  const state = getState();
  const id = `mkt-${Date.now().toString(36)}`;
  const market = makeMarket({
    ...input,
    id,
    slug: `${slugify(input.question)}-${id}`,
  });

  state.markets.unshift(market);
  return publicMarket(market);
}

export function updateMarket(slugOrId: string, updates: Partial<Pick<Market, 'status' | 'closeAt' | 'description' | 'resolutionSource'>>) {
  const market = findMarket(slugOrId);
  if (!market) {
    throw new Error('Market not found');
  }

  Object.assign(market, updates, { updatedAt: now(), chain: { ...market.chain, lastTxHash: mockTxHash() } });
  return publicMarket(market);
}

export function resolveMarket(slugOrId: string, input: ResolveMarketInput) {
  const state = getState();
  const market = findMarket(slugOrId);
  if (!market) {
    throw new Error('Market not found');
  }
  if (!market.outcomes.some((outcome) => outcome.id === input.outcomeId)) {
    throw new Error('Outcome not found');
  }
  if (market.status === 'resolved') {
    throw new Error('Market is already resolved');
  }

  market.status = 'resolved';
  market.resolvedOutcomeId = input.outcomeId;
  market.resolverNotes = input.notes;
  market.resolvedAt = now();
  market.updatedAt = market.resolvedAt;
  market.chain = { ...market.chain, lastTxHash: mockTxHash() };

  state.positions
    .filter((position) => position.marketId === market.id && position.outcomeId === input.outcomeId)
    .forEach((position) => {
      const wallet = state.wallets.find((account) => account.address === position.walletAddress);
      if (wallet) {
        wallet.balance = roundMoney(wallet.balance + position.shares);
        wallet.lastSeenAt = now();
      }
    });

  return publicMarket(market);
}

export function getOrCreateWallet(address: string) {
  const state = getState();
  const normalized = normalizeAddress(address);
  let wallet = state.wallets.find((account) => account.address === normalized);

  if (!wallet) {
    wallet = {
      address: normalized,
      displayName: `${normalized.slice(0, 6)}...${normalized.slice(-4)}`,
      balance: STARTING_BALANCE,
      startingBalance: STARTING_BALANCE,
      joinedAt: now(),
      lastSeenAt: now(),
    };
    state.wallets.push(wallet);
  } else {
    wallet.lastSeenAt = now();
  }

  return wallet;
}

export function faucetWallet(address: string, amount = 250) {
  const wallet = getOrCreateWallet(address);
  wallet.balance = roundMoney(wallet.balance + Math.min(Math.max(amount, 1), 1000));
  wallet.lastSeenAt = now();
  return wallet;
}

export function getQuote(slugOrId: string, outcomeId: string, amount: number): TradeQuote {
  const market = findMarket(slugOrId);
  if (!market) {
    throw new Error('Market not found');
  }
  return quoteBuy(market, outcomeId, amount);
}

export function placeTrade(input: PlaceTradeInput) {
  const state = getState();
  const market = findMarket(input.marketSlug);
  if (!market) {
    throw new Error('Market not found');
  }
  if (market.status !== 'open') {
    throw new Error('Market is not open');
  }
  if (Date.parse(market.closeAt) <= Date.now()) {
    market.status = 'closed';
    throw new Error('Market is closed');
  }

  const wallet = getOrCreateWallet(input.walletAddress);
  if (wallet.balance < input.amount) {
    throw new Error('Insufficient demo balance');
  }

  const outcome = market.outcomes.find((candidate) => candidate.id === input.outcomeId);
  if (!outcome) {
    throw new Error('Outcome not found');
  }

  const quote = quoteBuy(market, input.outcomeId, input.amount);
  const createdAt = now();
  const txHash = mockTxHash();
  const blockNumber = nextMockBlock();

  market.quantities[input.outcomeId] = roundShares((market.quantities[input.outcomeId] || 0) + quote.shares);
  market.volume = roundMoney(market.volume + quote.amount);
  market.tradeCount += 1;
  market.updatedAt = createdAt;
  market.chain = { ...market.chain, lastTxHash: txHash };
  wallet.balance = roundMoney(wallet.balance - quote.amount);
  wallet.lastSeenAt = createdAt;

  const trade: Trade = {
    id: `trd-${Date.now().toString(36)}-${state.trades.length + 1}`,
    marketId: market.id,
    marketSlug: market.slug,
    walletAddress: wallet.address,
    outcomeId: input.outcomeId,
    outcomeLabel: outcome.label,
    amount: quote.amount,
    shares: quote.shares,
    averagePrice: quote.averagePrice,
    probabilityBefore: quote.probabilityBefore,
    probabilityAfter: quote.probabilityAfter,
    txHash,
    blockNumber,
    createdAt,
  };
  state.trades.push(trade);

  const positionId = `${wallet.address}:${market.id}:${input.outcomeId}`;
  const existing = state.positions.find((position) => position.id === positionId);
  if (existing) {
    existing.shares = roundShares(existing.shares + quote.shares);
    existing.costBasis = roundMoney(existing.costBasis + quote.amount);
    existing.averagePrice = roundMoney(existing.costBasis / existing.shares);
    existing.updatedAt = createdAt;
  } else {
    state.positions.push({
      id: positionId,
      marketId: market.id,
      marketSlug: market.slug,
      marketQuestion: market.question,
      walletAddress: wallet.address,
      outcomeId: input.outcomeId,
      outcomeLabel: outcome.label,
      shares: quote.shares,
      costBasis: quote.amount,
      averagePrice: quote.averagePrice,
      currentProbability: quote.probabilityAfter,
      markValue: 0,
      payoutIfCorrect: quote.shares,
      unrealizedPnl: 0,
      isResolved: false,
      isWinner: false,
      updatedAt: createdAt,
    });
  }

  return {
    trade,
    wallet,
    market: publicMarket(market),
    position: getPortfolio(wallet.address).positions.find((position) => position.id === positionId),
  };
}

export function getPortfolio(address: string) {
  const state = getState();
  const wallet = getOrCreateWallet(address);
  const positions = state.positions
    .filter((position) => position.walletAddress === wallet.address)
    .map((position) => {
      const market = findMarket(position.marketId);
      if (!market) {
        return position;
      }
      const probability = probabilitiesFor(market.outcomes, market.quantities, market.liquidity)[position.outcomeId] || 0;
      const isResolved = market.status === 'resolved';
      const isWinner = market.resolvedOutcomeId === position.outcomeId;
      const markValue = isResolved ? (isWinner ? position.shares : 0) : position.shares * probability;

      return {
        ...position,
        marketSlug: market.slug,
        marketQuestion: market.question,
        currentProbability: probability,
        markValue: roundMoney(markValue),
        payoutIfCorrect: roundMoney(position.shares),
        unrealizedPnl: roundMoney(markValue - position.costBasis),
        isResolved,
        isWinner,
      };
    })
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  return {
    wallet,
    positions,
    trades: state.trades
      .filter((trade) => trade.walletAddress === wallet.address)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 50),
  };
}
