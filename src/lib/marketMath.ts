import type { Market, MarketOutcome, MarketWithPrices, TradeQuote } from '@/types/market';

const MIN_SPEND = 1;
const MAX_SPEND = 5000;
const MIN_SHARES = 0.0001;
const MAX_SELL_SHARES = 1_000_000;

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function roundShares(value: number) {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

export function toPercent(value: number) {
  return Math.round(value * 1000) / 10;
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function createOutcomeId(label: string, index: number) {
  const slug = slugify(label);
  return slug || `outcome-${index + 1}`;
}

export function quantitiesFromProbabilities(outcomes: MarketOutcome[], probabilities: number[], liquidity: number) {
  const normalized = normalizeProbabilities(probabilities, outcomes.length);
  return outcomes.reduce<Record<string, number>>((acc, outcome, index) => {
    acc[outcome.id] = liquidity * Math.log(Math.max(normalized[index], 0.0001));
    return acc;
  }, {});
}

export function liquidityRiskFor(probabilities: number[], liquidity: number) {
  const cleaned = probabilities.filter((probability) => Number.isFinite(probability) && probability > 0);
  const lowestProbability = Math.max(Math.min(...(cleaned.length > 0 ? cleaned : [1])), 0.0001);
  return roundMoney(liquidity * Math.log(1 / lowestProbability));
}

export function normalizeProbabilities(probabilities: number[] | undefined, count: number) {
  if (!probabilities || probabilities.length !== count) {
    return Array.from({ length: count }, () => 1 / count);
  }

  const cleaned = probabilities.map((value) => (Number.isFinite(value) && value > 0 ? value : 0));
  const total = cleaned.reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    return Array.from({ length: count }, () => 1 / count);
  }

  return cleaned.map((value) => value / total);
}

export function probabilitiesFor(outcomes: MarketOutcome[], quantities: Record<string, number>, liquidity: number) {
  const scores = outcomes.map((outcome) => (quantities[outcome.id] || 0) / liquidity);
  const maxScore = Math.max(...scores);
  const exps = scores.map((score) => Math.exp(score - maxScore));
  const sum = exps.reduce((total, value) => total + value, 0);

  return outcomes.reduce<Record<string, number>>((acc, outcome, index) => {
    acc[outcome.id] = exps[index] / sum;
    return acc;
  }, {});
}

export function addPrices(market: Market): MarketWithPrices {
  return {
    ...market,
    probabilities: probabilitiesFor(market.outcomes, market.quantities, market.liquidity),
  };
}

function lmsrCost(outcomes: MarketOutcome[], quantities: Record<string, number>, liquidity: number) {
  const scores = outcomes.map((outcome) => (quantities[outcome.id] || 0) / liquidity);
  const maxScore = Math.max(...scores);
  const sum = scores.reduce((total, score) => total + Math.exp(score - maxScore), 0);
  return liquidity * (Math.log(sum) + maxScore);
}

export function costToBuyShares(market: Market, outcomeId: string, shares: number) {
  const nextQuantities = {
    ...market.quantities,
    [outcomeId]: (market.quantities[outcomeId] || 0) + shares,
  };

  return lmsrCost(market.outcomes, nextQuantities, market.liquidity) - lmsrCost(market.outcomes, market.quantities, market.liquidity);
}

export function proceedsFromSellingShares(market: Market, outcomeId: string, shares: number) {
  const nextQuantities = {
    ...market.quantities,
    [outcomeId]: (market.quantities[outcomeId] || 0) - shares,
  };

  return lmsrCost(market.outcomes, market.quantities, market.liquidity) - lmsrCost(market.outcomes, nextQuantities, market.liquidity);
}

export function quoteBuy(market: Market, outcomeId: string, amount: number): TradeQuote {
  if (!market.outcomes.some((outcome) => outcome.id === outcomeId)) {
    throw new Error('Rezultatul nu a fost găsit');
  }

  if (!Number.isFinite(amount) || amount < MIN_SPEND || amount > MAX_SPEND) {
    throw new Error(`Suma tranzacției trebuie să fie între ${MIN_SPEND} și ${MAX_SPEND}`);
  }

  amount = roundMoney(amount);
  const probabilitiesBefore = probabilitiesFor(market.outcomes, market.quantities, market.liquidity);
  let low = 0;
  let high = Math.max(amount / Math.max(probabilitiesBefore[outcomeId], 0.01), 1);

  while (costToBuyShares(market, outcomeId, high) < amount) {
    high *= 2;
    if (high > 1_000_000) {
      throw new Error('Suma tranzacției este prea mare pentru această piață');
    }
  }

  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    const cost = costToBuyShares(market, outcomeId, mid);
    if (cost > amount) {
      high = mid;
    } else {
      low = mid;
    }
  }

  const shares = roundShares((low + high) / 2);
  const nextQuantities = {
    ...market.quantities,
    [outcomeId]: (market.quantities[outcomeId] || 0) + shares,
  };
  const probabilitiesAfter = probabilitiesFor(market.outcomes, nextQuantities, market.liquidity);

  return {
    side: 'buy',
    outcomeId,
    amount: roundMoney(amount),
    shares,
    averagePrice: roundMoney(amount / shares),
    probabilityBefore: probabilitiesBefore[outcomeId],
    probabilityAfter: probabilitiesAfter[outcomeId],
    priceImpact: probabilitiesAfter[outcomeId] - probabilitiesBefore[outcomeId],
  };
}

export function quoteSell(market: Market, outcomeId: string, shares: number): TradeQuote {
  if (!market.outcomes.some((outcome) => outcome.id === outcomeId)) {
    throw new Error('Rezultatul nu a fost găsit');
  }

  if (!Number.isFinite(shares) || shares < MIN_SHARES || shares > MAX_SELL_SHARES) {
    throw new Error(`Numărul de unități trebuie să fie între ${MIN_SHARES} și ${MAX_SELL_SHARES}`);
  }

  const probabilitiesBefore = probabilitiesFor(market.outcomes, market.quantities, market.liquidity);
  shares = roundShares(shares);
  const amount = proceedsFromSellingShares(market, outcomeId, shares);
  const nextQuantities = {
    ...market.quantities,
    [outcomeId]: (market.quantities[outcomeId] || 0) - shares,
  };
  const probabilitiesAfter = probabilitiesFor(market.outcomes, nextQuantities, market.liquidity);

  return {
    side: 'sell',
    outcomeId,
    amount: roundMoney(amount),
    shares: roundShares(shares),
    averagePrice: roundMoney(amount / shares),
    probabilityBefore: probabilitiesBefore[outcomeId],
    probabilityAfter: probabilitiesAfter[outcomeId],
    priceImpact: probabilitiesAfter[outcomeId] - probabilitiesBefore[outcomeId],
  };
}
