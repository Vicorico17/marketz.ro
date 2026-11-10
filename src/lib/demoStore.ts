import { randomUUID } from 'node:crypto';
import { romaniaMarkets } from '@/lib/romaniaMarkets';
import {
  addPrices,
  createOutcomeId,
  liquidityRiskFor,
  normalizeProbabilities,
  probabilitiesFor,
  quantitiesFromProbabilities,
  quoteBuy,
  quoteSell,
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
  TradeSide,
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
  const startingProbabilities = normalizeProbabilities(input.startingProbabilities || [], outcomes.length);

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
    liquidityRisk: liquidityRiskFor(startingProbabilities, liquidity),
    quantities: quantitiesFromProbabilities(outcomes, startingProbabilities, liquidity),
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
    ...romaniaMarkets.map(makeMarket),
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
      closeAt: '2027-01-31T21:59:00.000Z',
      resolutionSource: 'Clasamentul oficial LPF.',
      liquidity: 130,
      startingProbabilities: [0.31, 0.69],
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
    }),
    makeMarket({
      id: 'mkt-alegeri-locale-bucuresti',
      slug: 'bucuresti-va-avea-primar-general-nou-inainte-de-decembrie-2026',
      question: 'Va avea Bucureștiul un primar general nou înainte de 1 decembrie 2026?',
      description:
        'Piața se rezolvă "Da" dacă între 10 noiembrie 2026 și 1 decembrie 2026, ora 00:00 Europe/Bucharest, un primar general nou ales depune jurământul. Nu se includ interimatele sau delegările temporare.',
      category: 'politica',
      tags: ['București', 'administrație'],
      outcomes: ['Da', 'Nu'],
      closeAt: futureDate(11, 30, 20),
      resolutionSource: 'Hotărâri oficiale, comunicate PMB și rezultate electorale validate.',
      liquidity: 150,
      startingProbabilities: [0.54, 0.46],
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
  if (typeof address !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(address.trim())) {
    throw new Error('Adresă demo invalidă');
  }
  return address.trim().toLowerCase();
}

function publicMarket(market: Market): MarketWithPrices {
  if (market.status === 'open' && Date.parse(market.closeAt) <= Date.now()) market.status = 'closed';
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
    totalLiquidityRisk: roundMoney(markets.reduce((sum, market) => sum + market.liquidityRisk, 0)),
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
  validateMarketInput(input);
  const id = `mkt-${randomUUID()}`;
  const market = makeMarket({
    ...input,
    id,
    slug: `${slugify(input.question)}-${id}`,
  });

  state.markets.unshift(market);
  return publicMarket(market);
}

function validateMarketInput(input: CreateMarketInput) {
  if (typeof input.question !== 'string' || input.question.trim().length < 12 || input.question.length > 300) {
    throw new Error('Întrebarea trebuie să aibă între 12 și 300 de caractere');
  }
  if (typeof input.description !== 'string' || input.description.trim().length < 30 || input.description.length > 5000) {
    throw new Error('Descrierea trebuie să aibă între 30 și 5.000 de caractere');
  }
  if (typeof input.resolutionSource !== 'string' || input.resolutionSource.trim().length < 20 || input.resolutionSource.length > 2000) {
    throw new Error('Sursa de rezolvare trebuie să fie precisă și să aibă între 20 și 2.000 de caractere');
  }
  if (!Array.isArray(input.outcomes) || input.outcomes.length < 2 || input.outcomes.length > 5) {
    throw new Error('Piața trebuie să aibă între 2 și 5 rezultate posibile');
  }
  if (!['politica', 'economie', 'sport', 'locale', 'cultura', 'tech', 'meteo'].includes(input.category)) throw new Error('Categorie invalidă');
  if (input.outcomes.some((label) => typeof label !== 'string' || !slugify(label) || label.length > 100)) throw new Error('Rezultat invalid');
  if (input.tags !== undefined && (!Array.isArray(input.tags) || input.tags.length > 12 || input.tags.some((tag) => typeof tag !== 'string' || tag.length > 60))) throw new Error('Etichete invalide');
  if (input.startingProbabilities !== undefined && (!Array.isArray(input.startingProbabilities) || input.startingProbabilities.some((p) => !Number.isFinite(p) || p <= 0))) throw new Error('Probabilitățile trebuie să fie pozitive');
  const uniqueOutcomes = new Set(input.outcomes.map((outcome) => createOutcomeId(outcome, 0)));
  if (uniqueOutcomes.size !== input.outcomes.length) {
    throw new Error('Denumirile rezultatelor trebuie să fie distincte');
  }
  const closeAt = Date.parse(input.closeAt);
  if (!Number.isFinite(closeAt) || closeAt <= Date.now()) {
    throw new Error('Data închiderii trebuie să fie în viitor');
  }
  if (input.liquidity !== undefined && (!Number.isFinite(input.liquidity) || input.liquidity < 20 || input.liquidity > 10_000)) {
    throw new Error('Lichiditatea trebuie să fie între 20 și 10.000');
  }
  if (
    input.startingProbabilities &&
    input.startingProbabilities.length > 0 &&
    input.startingProbabilities.length !== input.outcomes.length
  ) {
    throw new Error('Numărul probabilităților inițiale trebuie să corespundă numărului de rezultate');
  }
}

export function updateMarket(slugOrId: string, updates: Partial<Pick<Market, 'status' | 'closeAt' | 'description' | 'resolutionSource'>>) {
  const market = findMarket(slugOrId);
  if (!market) {
    throw new Error('Piața nu a fost găsită');
  }

  if (market.status === 'resolved' || market.status === 'voided') {
    throw new Error('O piață finalizată nu mai poate fi modificată');
  }
  const clean = Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined));
  if (clean.status !== undefined && !['draft', 'open', 'closed', 'voided'].includes(String(clean.status))) {
    throw new Error('Stare invalidă');
  }
  if (clean.closeAt !== undefined && (typeof clean.closeAt !== 'string' || !Number.isFinite(Date.parse(clean.closeAt)))) {
    throw new Error('Data închiderii este invalidă');
  }
  for (const field of ['description', 'resolutionSource'] as const) {
    if (clean[field] !== undefined && (typeof clean[field] !== 'string' || !String(clean[field]).trim())) {
      throw new Error('Descrierea și sursa nu pot fi goale');
    }
  }
  const positions = getState().positions.filter((position) => position.marketId === market.id);
  if (positions.length && ['closeAt', 'description', 'resolutionSource'].some((field) => clean[field] !== undefined && clean[field] !== market[field as keyof Market])) {
    throw new Error('Regulile nu pot fi modificate după prima tranzacție');
  }
  if (positions.length && clean.status === 'draft') throw new Error('O piață tranzacționată nu poate reveni la ciornă');
  if (clean.status === 'voided') {
    for (const position of positions) {
      const wallet = getState().wallets.find((account) => account.address === position.walletAddress);
      if (wallet) wallet.balance = roundMoney(wallet.balance + position.costBasis);
      position.shares = 0;
      position.costBasis = 0;
      position.averagePrice = 0;
      position.updatedAt = now();
    }
  }
  Object.assign(market, clean, { updatedAt: now(), chain: { ...market.chain, lastTxHash: mockTxHash() } });
  return publicMarket(market);
}

export function resolveMarket(slugOrId: string, input: ResolveMarketInput) {
  const state = getState();
  const market = findMarket(slugOrId);
  if (!market) {
    throw new Error('Piața nu a fost găsită');
  }
  if (!market.outcomes.some((outcome) => outcome.id === input.outcomeId)) {
    throw new Error('Rezultatul nu a fost găsit');
  }
  if (market.status === 'resolved' || market.status === 'voided') {
    throw new Error('Piața este deja finalizată');
  }
  if (typeof input.notes !== 'string' || input.notes.trim().length < 10) {
    throw new Error('Adaugă o justificare a rezultatului (minimum 10 caractere)');
  }

  market.status = 'resolved';
  market.resolvedOutcomeId = input.outcomeId;
  market.resolverNotes = input.notes;
  market.resolvedAt = now();
  market.updatedAt = market.resolvedAt;
  market.chain = { ...market.chain, lastTxHash: mockTxHash() };

  state.positions
    .filter((position) => position.marketId === market.id)
    .forEach((position) => {
      const wallet = state.wallets.find((account) => account.address === position.walletAddress);
      const payout = position.outcomeId === input.outcomeId ? roundMoney(position.shares) : 0;
      if (wallet) {
        wallet.balance = roundMoney(wallet.balance + payout);
        wallet.lastSeenAt = now();
      }
      position.realizedPnl = roundMoney(position.realizedPnl + payout - position.costBasis);
      position.shares = 0;
      position.costBasis = 0;
      position.averagePrice = 0;
      position.updatedAt = now();
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
  if (!Number.isFinite(amount) || amount < 1 || amount > 1000) throw new Error('Suma demo trebuie să fie între 1 și 1000');
  const wallet = getOrCreateWallet(address);
  wallet.balance = roundMoney(wallet.balance + Math.min(Math.max(amount, 1), 1000));
  wallet.lastSeenAt = now();
  return wallet;
}

export function getQuote(slugOrId: string, outcomeId: string, amount: number, side: TradeSide = 'buy'): TradeQuote {
  const market = findMarket(slugOrId);
  if (!market) {
    throw new Error('Piața nu a fost găsită');
  }
  if (publicMarket(market).status !== 'open') throw new Error('Piața este închisă');
  if (side !== 'buy' && side !== 'sell') throw new Error('Tip de tranzacție invalid');
  return side === 'sell' ? quoteSell(market, outcomeId, amount) : quoteBuy(market, outcomeId, amount);
}

export function placeTrade(input: PlaceTradeInput) {
  const state = getState();
  const market = findMarket(input.marketSlug);
  if (!market) {
    throw new Error('Piața nu a fost găsită');
  }
  if (market.status !== 'open') {
    throw new Error('Piața nu este deschisă');
  }
  if (Date.parse(market.closeAt) <= Date.now()) {
    market.status = 'closed';
    throw new Error('Piața este închisă');
  }

  const side = input.side || 'buy';
  if (side !== 'buy' && side !== 'sell') throw new Error('Tip de tranzacție invalid');
  const wallet = getOrCreateWallet(input.walletAddress);
  const outcome = market.outcomes.find((candidate) => candidate.id === input.outcomeId);
  if (!outcome) {
    throw new Error('Rezultatul nu a fost găsit');
  }

  const quote = side === 'sell'
    ? quoteSell(market, input.outcomeId, Number(input.shares))
    : quoteBuy(market, input.outcomeId, input.amount);

  if (side === 'buy' && wallet.balance < quote.amount) {
    throw new Error('Soldul demonstrativ este insuficient');
  }

  const positionId = `${wallet.address}:${market.id}:${input.outcomeId}`;
  const existing = state.positions.find((position) => position.id === positionId);
  if (side === 'sell' && (!existing || existing.shares < quote.shares)) {
    throw new Error('Nu ai suficiente unități pentru vânzare');
  }

  const createdAt = now();
  const txHash = mockTxHash();
  const blockNumber = nextMockBlock();

  market.quantities[input.outcomeId] = roundShares(
    (market.quantities[input.outcomeId] || 0) + (side === 'sell' ? -quote.shares : quote.shares),
  );
  market.volume = roundMoney(market.volume + quote.amount);
  market.tradeCount += 1;
  market.updatedAt = createdAt;
  market.chain = { ...market.chain, lastTxHash: txHash };
  wallet.balance = roundMoney(wallet.balance + (side === 'sell' ? quote.amount : -quote.amount));
  wallet.lastSeenAt = createdAt;

  const trade: Trade = {
    id: `trd-${Date.now().toString(36)}-${state.trades.length + 1}`,
    marketId: market.id,
    marketSlug: market.slug,
    walletAddress: wallet.address,
    side,
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

  if (side === 'buy' && existing) {
    existing.shares = roundShares(existing.shares + quote.shares);
    existing.costBasis = roundMoney(existing.costBasis + quote.amount);
    existing.averagePrice = roundMoney(existing.costBasis / existing.shares);
    existing.updatedAt = createdAt;
  } else if (side === 'buy') {
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
      realizedPnl: 0,
      currentProbability: quote.probabilityAfter,
      markValue: 0,
      payoutIfCorrect: quote.shares,
      unrealizedPnl: 0,
      isResolved: false,
      isWinner: false,
      updatedAt: createdAt,
    });
  } else if (existing) {
    const previousShares = existing.shares;
    const costRemoved = previousShares > 0 ? roundMoney(existing.costBasis * (quote.shares / previousShares)) : 0;
    existing.shares = roundShares(Math.max(previousShares - quote.shares, 0));
    existing.costBasis = existing.shares > 0 ? roundMoney(Math.max(existing.costBasis - costRemoved, 0)) : 0;
    existing.averagePrice = existing.shares > 0 ? roundMoney(existing.costBasis / existing.shares) : 0;
    existing.realizedPnl = roundMoney((existing.realizedPnl || 0) + quote.amount - costRemoved);
    existing.updatedAt = createdAt;
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
        realizedPnl: position.realizedPnl || 0,
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
