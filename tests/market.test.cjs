require('./register.cjs');
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const store = require('../src/lib/demoStore.ts');
const math = require('../src/lib/marketMath.ts');
const address = '0x' + 'a'.repeat(40);
const other = '0x' + 'b'.repeat(40);
const input = () => ({ question: 'Va avea loc evenimentul de test?', description: 'O descriere suficient de lungă pentru un eveniment de test.', category: 'tech', outcomes: ['Da', 'Nu'], closeAt: new Date(Date.now() + 86400000).toISOString(), resolutionSource: 'Sursa oficială publicată pentru test.', liquidity: 140 });
const buy = (market, wallet = address, amount = 25) => store.placeTrade({ marketSlug: market.slug, walletAddress: wallet, outcomeId: 'da', amount, side: 'buy' });
beforeEach(() => { global.__marketzDemoState = undefined; });
test('LMSR probabilities sum to one and buying raises the selected price', () => {
  const m = store.createMarket(input()); const q = store.getQuote(m.slug, 'da', 25);
  assert.ok(q.probabilityAfter > q.probabilityBefore);
  assert.ok(Math.abs(Object.values(m.probabilities).reduce((a,b) => a+b) - 1) < 1e-12);
  assert.ok(Math.abs(math.costToBuyShares(m, 'da', q.shares) - 25) < 0.001);
});
test('buy/sell round trip conserves demo balance within rounding', () => {
  const m = store.createMarket(input()); const result = buy(m);
  store.placeTrade({ marketSlug: m.slug, walletAddress: address, outcomeId: 'da', amount: 0, shares: result.trade.shares, side: 'sell' });
  assert.ok(Math.abs(store.getOrCreateWallet(address).balance - 1000) <= 0.01);
  assert.equal(store.getPortfolio(address).positions[0].shares, 0);
});
test('partial update preserves required fields', () => {
  const m = store.createMarket(input());
  const updated = store.updateMarket(m.slug, { status: 'closed', closeAt: undefined, description: undefined, resolutionSource: undefined });
  assert.equal(updated.closeAt, m.closeAt); assert.equal(updated.description, m.description);
  assert.equal(updated.resolutionSource, m.resolutionSource);
});
test('expired markets close on read and reject quotes and trades', () => {
  const m = store.createMarket(input()); store.updateMarket(m.slug, { closeAt: '2020-01-01T00:00:00Z' });
  assert.equal(store.getMarket(m.slug).market.status, 'closed');
  assert.throws(() => store.getQuote(m.slug, 'da', 25)); assert.throws(() => buy(m));
});
test('settlement pays winners once and removes settled portfolio exposure', () => {
  const m = store.createMarket(input()); const result = buy(m);
  store.placeTrade({ marketSlug: m.slug, walletAddress: other, outcomeId: 'nu', amount: 25 });
  store.resolveMarket(m.slug, { outcomeId: 'da', notes: 'Rezultat documentat pentru test.' });
  const p = store.getPortfolio(address).positions[0];
  assert.equal(store.getOrCreateWallet(address).balance, math.roundMoney(975 + result.trade.shares));
  assert.equal(p.shares, 0); assert.equal(p.markValue, 0); assert.equal(p.unrealizedPnl, 0);
  assert.equal(p.realizedPnl, math.roundMoney(result.trade.shares - 25));
  assert.equal(store.getPortfolio(other).positions[0].realizedPnl, -25);
  assert.throws(() => store.resolveMarket(m.slug, { outcomeId: 'da', notes: 'Rezultat documentat pentru test.' }));
  assert.throws(() => store.updateMarket(m.slug, { status: 'open' }));
});
test('void refunds remaining cost basis once and cannot be reopened', () => {
  const m = store.createMarket(input()); buy(m);
  store.updateMarket(m.slug, { status: 'voided' });
  assert.equal(store.getOrCreateWallet(address).balance, 1000);
  assert.equal(store.getPortfolio(address).positions[0].shares, 0);
  assert.throws(() => store.updateMarket(m.slug, { status: 'open' }));
  assert.throws(() => store.resolveMarket(m.slug, { outcomeId: 'da', notes: 'Rezultat documentat pentru test.' }));
});
test('resolution rules cannot be rewritten after trading', () => {
  const m = store.createMarket(input()); buy(m);
  assert.throws(() => store.updateMarket(m.slug, { resolutionSource: 'O altă sursă' }));
  assert.throws(() => store.updateMarket(m.slug, { status: 'draft' }));
  assert.equal(store.getMarket(m.slug).market.resolutionSource, m.resolutionSource);
});
test('rejects invalid addresses, nonfinite faucet amounts and malformed markets', () => {
  assert.throws(() => store.getOrCreateWallet('undefined'));
  for (const amount of [NaN, Infinity, -1, 0, 1001]) assert.throws(() => store.faucetWallet(address, amount));
  for (const patch of [{ category: 'bad' }, { outcomes: ['Da', 'Dá'] }, { outcomes: ['', 'Nu'] }, { startingProbabilities: [0, 1] }, { closeAt: 'invalid' }, { liquidity: NaN }]) assert.throws(() => store.createMarket({ ...input(), ...patch }));
});
test('overspending and overselling leave balances unchanged', () => {
  const m = store.createMarket(input());
  assert.throws(() => buy(m, address, 1001));
  assert.throws(() => store.placeTrade({ marketSlug: m.slug, walletAddress: address, outcomeId: 'da', amount: 0, shares: 1, side: 'sell' }));
  assert.equal(store.getOrCreateWallet(address).balance, 1000);
  assert.equal(store.getMarket(m.slug).market.tradeCount, 0);
});
test('invalid lifecycle state and missing resolution evidence are rejected', () => {
  const m = store.createMarket(input());
  assert.throws(() => store.updateMarket(m.slug, { status: 'resolved' }));
  assert.throws(() => store.updateMarket(m.slug, { closeAt: null }));
  assert.throws(() => store.resolveMarket(m.slug, { outcomeId: 'da', notes: '' }));
  assert.equal(store.getMarket(m.slug).market.status, 'open');
});
test('production admin has no default-key fallback', async () => {
  const route = require('../src/app/api/markets/route.ts');
  const oldEnv = process.env.NODE_ENV, oldKey = process.env.ADMIN_MOCK_KEY;
  process.env.NODE_ENV = 'production'; delete process.env.ADMIN_MOCK_KEY;
  try {
    const response = await route.POST(new Request('http://localhost/api/markets', { method: 'POST', headers: { 'x-admin-key': 'marketz-admin' }, body: JSON.stringify(input()) }));
    assert.equal(response.status, 401);
  } finally {
    if (oldEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = oldEnv;
    if (oldKey === undefined) delete process.env.ADMIN_MOCK_KEY; else process.env.ADMIN_MOCK_KEY = oldKey;
  }
});
test('Romania catalogue covers every category and seeds no fake trading activity', () => {
  const snapshot = store.getSnapshot();
  assert.equal(snapshot.markets.length, 24);
  assert.equal(new Set(snapshot.markets.map(m => m.slug)).size, 24);
  assert.equal(new Set(snapshot.markets.map(m => m.category)).size, 7);
  assert.equal(snapshot.totalTrades, 0); assert.equal(snapshot.totalVolume, 0);
});
test('rapidly created markets have distinct identifiers', () => {
  const a = store.createMarket(input()), b = store.createMarket(input());
  assert.notEqual(a.id, b.id); assert.notEqual(a.slug, b.slug);
});
