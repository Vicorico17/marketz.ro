# Marketz.ro Liquidity Partner Pitch

Draft date: 2026-06-18

## One-page version

Marketz.ro is a Romania-focused prediction market platform. The core problem in prediction markets is liquidity: if a new market has no buyers and sellers, users cannot trade, prices do not move, and the product feels empty.

Our solution is to launch curated markets with an automated market maker. Instead of waiting for two users to match with each other, each approved market starts with a defined liquidity budget. That liquidity lets users trade immediately, creates visible probabilities, and gives the market a chance to grow from zero volume.

Liquidity partners fund this market depth. In return, they can earn from trading fees, market sponsorship economics, and carefully managed market-maker performance. The opportunity is attractive because liquidity is the scarce input in this business. Platforms with liquidity can attract users; platforms without liquidity usually stall.

This is not guaranteed yield. A liquidity partner is taking bounded market risk. The business has to be designed so the risk is transparent before capital is deployed, the maximum loss per market is capped, and fee revenue has a realistic chance to compensate liquidity partners over a portfolio of markets.

The right first version is not "anyone can create any market." The right first version is a curated liquidity program:

- Admin-approved markets only.
- Clear resolution rules before launch.
- Liquidity budgets set per market.
- Trade-size limits based on liquidity.
- Platform fees shared with liquidity providers.
- Transparent reporting of exposure, fees, volume, and PnL.
- Legal review before real-money launch.

## Why liquidity matters

Prediction markets need two things at the same time:

- A clear question people care about.
- A price that users can actually trade.

An order book needs users on both sides. That is hard at the start because a new market has no natural counterparty. If someone wants to buy "Yes" but nobody is selling "Yes", the trade cannot happen.

An automated market maker solves this cold-start problem. The market quotes a price from day one. Users can buy shares, the price updates, and the market becomes legible even before a large crowd exists.

The tradeoff is simple:

```txt
Order book = less platform risk, but needs existing volume.
AMM = better cold start, but someone funds the risk.
```

That "someone" is the platform, the market creator, a sponsor, or a liquidity partner.

## How the current prototype works

The current Marketz.ro prototype uses an LMSR-style automated market maker. It is still mock/in-memory, not a real-money system.

In this model, each market has a liquidity parameter, usually called `b`. Higher `b` means deeper liquidity:

- Larger trades move the price less.
- Users get a better trading experience.
- The liquidity provider takes more maximum risk.

Lower `b` means thinner liquidity:

- Cheaper to launch markets.
- Prices move aggressively.
- One trader can distort the displayed probability.
- Users may stop trusting the market price.

For a two-outcome market launched at 50% / 50%, the rough worst-case AMM subsidy before fees is:

```txt
b * ln(2)
```

Examples:

| Liquidity `b` | Rough max AMM risk at 50/50 |
| ---: | ---: |
| 50 | 35 |
| 140 | 97 |
| 300 | 208 |
| 1,000 | 693 |
| 5,000 | 3,466 |

For markets that start with uneven probabilities, the risk depends on the winning outcome's starting probability:

```txt
b * ln(1 / starting_probability)
```

That means a market starting at 90% / 10% is riskier if the 10% outcome wins. With `b = 300`, the rough loss cap on the 10% side is:

```txt
300 * ln(10) = 691
```

This is why starting probabilities should not be treated as decoration. They affect the economics of the liquidity provider.

## How liquidity providers can make money

Liquidity providers do not make money just because liquidity exists. They make money if fee revenue, sponsorship revenue, and market-maker performance exceed losses from traders who buy the winning outcome cheaply.

The main earning channels should be:

### 1. Trading fees

Every trade can include a fee, for example 1% to 2% of trade size. A portion of that fee goes to liquidity providers.

Example:

```txt
Market volume: 50,000 RON
Trading fee: 1.5%
Total fee revenue: 750 RON
LP share of fees: 70%
LP fee revenue: 525 RON
```

If the AMM loses 250 RON on settlement, LPs are still positive:

```txt
525 RON fees - 250 RON AMM loss = 275 RON net
```

If the AMM loses 700 RON, LPs are negative:

```txt
525 RON fees - 700 RON AMM loss = -175 RON net
```

So the business depends on volume, fees, risk caps, and market quality.

### 2. Portfolio effect

One market can lose money. A portfolio of well-designed markets can be more stable.

The goal is not to perfectly predict every market. The goal is to run many markets with:

- Clear settlement.
- Reasonable starting odds.
- Controlled liquidity.
- Limited trade size.
- Enough user volume.
- Fee revenue across the portfolio.

If one market loses but nine other markets generate fees and balanced order flow, the liquidity program can still work.

### 3. Sponsored markets

Some markets may be valuable to brands, media pages, communities, or research groups because they create engagement around a topic.

Example sponsors:

- Sports communities.
- Finance newsletters.
- Local news publications.
- Crypto communities.
- Universities or research groups.
- Romanian creator communities.

A sponsor can pay for visibility or fund part of the liquidity. That reduces the risk carried by external liquidity providers.

### 4. Creator-funded liquidity

Later, trusted users or creators can propose a market and fund part of its liquidity. This creates alignment:

- The creator has skin in the game.
- The platform is not funding every market alone.
- External LPs can match creator liquidity only when the market is high quality.

Example:

```txt
Creator liquidity: 500 RON risk budget
Platform match: 500 RON risk budget
External LP pool: 1,000 RON risk budget
Total available risk budget: 2,000 RON
```

### 5. Platform revenue share

Liquidity partners can receive a share of platform revenue from the markets they support.

Example terms for a pilot:

```txt
70% of trading fees to LPs
20% to Marketz.ro
10% to market creator or sponsor
```

These percentages are only examples. The final split should be modeled after expected volume, risk, compliance cost, and operating cost.

## What could go well

### Example A: Good early market

```txt
Question: Will EUR/RON be above 5.15 at the BNR rate on 31 Dec 2026?
Outcomes: Yes / No
Starting probability: 50% / 50%
Liquidity b: 300
Trading fee: 1.5%
Max single trade: 75 RON
Resolution source: Official BNR rate
```

Why this can work:

- The question is clear.
- The source is official.
- The max AMM risk is around 208 RON before fees.
- The trade cap prevents one user from forcing a huge price move.
- If the market does 30,000 RON volume, 1.5% fees create 450 RON gross fee revenue.

Possible outcome:

```txt
Gross fees: 450 RON
LP share at 70%: 315 RON
AMM settlement loss: 120 RON
LP net: +195 RON
```

### Example B: Good sponsored market

```txt
Question: Will FCSB finish first in the regular season?
Sponsor: Sports media page
Sponsor contribution: 1,000 RON
External LP risk budget: 1,000 RON
Trading fee: 2%
```

Why this can work:

- The topic has natural audience demand.
- The sponsor drives traffic.
- The sponsor contribution reduces external LP exposure.
- The platform can show the sponsor on the market page.

Possible outcome:

```txt
Market volume: 80,000 RON
Gross fees at 2%: 1,600 RON
LP share at 60%: 960 RON
External LP settlement loss: 500 RON
External LP net: +460 RON
```

### Example C: Good creator-funded market

```txt
Creator proposes market.
Creator posts 300 RON bond.
Creator funds 300 RON liquidity risk.
Admin approves only after checking resolution rules.
External LPs match with another 700 RON.
```

Why this can work:

- The creator helps source interesting markets.
- The bond discourages spam.
- The creator-funded liquidity proves commitment.
- External LPs are not forced to fund unknown markets alone.

## What could go wrong

### Problem 1: Liquidity too low

```txt
Liquidity b: 50
Single trade: 500 RON
```

The trade is huge relative to liquidity. The probability can jump close to 100%. New users see a distorted price and the market looks manipulated.

Fix:

- Cap single trade size based on liquidity.
- Show price impact before confirmation.
- Add a max probability movement per trade.
- Increase liquidity only after real demand appears.

### Problem 2: Liquidity too high

```txt
Liquidity b: 5,000
Expected volume: 3,000 RON
```

The market feels smooth, but the capital is inefficient. The LP may be reserving thousands of RON of risk for a market that barely trades.

Fix:

- Start with smaller liquidity.
- Increase liquidity after volume appears.
- Allocate liquidity dynamically to markets with demand.
- Do not overfund every new market.

### Problem 3: Bad starting probability

```txt
Starting probability: Yes 90%, No 10%
Liquidity b: 300
Actual fair probability: No 40%
```

Smart traders buy cheap "No" shares. If "No" wins, the LP can lose much more than expected because the market started too confidently.

Fix:

- Use conservative starting probabilities.
- Prefer 50/50 unless there is a strong reason.
- Require admin review for skewed starts.
- Reduce liquidity for uncertain or controversial markets.

### Problem 4: Ambiguous resolution

```txt
Question: Will the government fall this year?
```

This sounds interesting but can be messy. Does resignation count? Does a coalition reshuffle count? What if a prime minister changes but the same parties stay?

Fix:

- Define the exact resolution condition.
- Define the official source.
- Define edge cases before launch.
- Add a dispute window.
- Allow voiding only under strict rules.

### Problem 5: Informed traders

Some markets are vulnerable to people who know more than the market maker.

Examples:

- Local politics with insiders.
- Sports injuries before public announcement.
- Company announcements.
- Creator markets where the creator can influence the outcome.

Fix:

- Avoid markets with obvious insider risk.
- Reduce liquidity on high-adverse-selection markets.
- Add trade limits.
- Monitor suspicious trading.
- Ban creators from trading markets they can influence.

### Problem 6: Regulatory risk

Prediction markets can be treated differently depending on jurisdiction: gambling, financial contracts, crypto-asset services, or something else. If real money or crypto is used, this needs legal review before launch.

The EU has a crypto-asset framework under MiCA, and the European Commission notes that crypto-asset services involve expectations around risk disclosure, market integrity, operational/prudential controls, and AML. Prediction markets may also trigger gambling or betting rules depending on structure and jurisdiction.

Fix:

- Get Romania/EU legal advice before taking real money.
- Decide whether the product is free-to-play, simulated, licensed betting, regulated derivatives, crypto service, or another compliant structure.
- Add KYC/AML if real money or crypto deposits are used.
- Block restricted jurisdictions where required.
- Do not market LP returns as guaranteed yield.

## What Marketz.ro must build before taking LP capital

The current app is a prototype. Before accepting real liquidity-provider money, these pieces are needed:

### Product and engineering

- Persistent database for markets, trades, wallets, positions, fees, and settlements.
- Real ledger with double-entry accounting.
- Deposit and withdrawal flow.
- Segregated LP balances.
- Per-market LP exposure tracking.
- Buy and sell paths, not only buy.
- Fee engine.
- Settlement engine.
- Admin resolution and dispute workflow.
- Real-time LP dashboard.
- Exportable statements for LPs.

### Risk controls

- Maximum liquidity per market.
- Maximum exposure per LP.
- Maximum exposure per category.
- Maximum trade size based on liquidity.
- Maximum price movement per trade.
- Circuit breakers for suspicious trading.
- Conservative default starting probabilities.
- Lower liquidity for controversial or insider-sensitive markets.
- Market void policy.

### Market governance

- Market approval checklist.
- Clear question format.
- Clear outcome set.
- Clear close time.
- Clear resolution source.
- Edge-case rules.
- Conflict-of-interest policy.
- Creator bond or listing fee for user-submitted markets.

### Legal and compliance

- Romania/EU legal classification.
- Terms for traders.
- Terms for liquidity providers.
- Risk disclosures.
- KYC/AML policy if real value is used.
- Tax/accounting review.
- Jurisdiction restrictions.
- Marketing compliance review.

## Suggested pilot program

Do not start by raising a large liquidity pool. Start with a controlled pilot.

Example pilot:

```txt
Pilot size: 10,000 to 50,000 RON equivalent
Markets: 10 to 25 curated markets
Market types: sports, macro, local events, culture
Liquidity per market: small at launch, increased with volume
Trading fee: 1.5% to 2%
LP fee share: 60% to 75%
Max loss per market: disclosed before launch
Reporting: weekly
Duration: 60 to 90 days
```

Pilot objective:

- Prove users trade.
- Prove markets resolve cleanly.
- Measure volume per RON of risk.
- Measure fee revenue versus AMM losses.
- Identify which categories attract volume.
- Build trust with LP reporting.

## How to pitch a liquidity partner

Use this positioning:

> Marketz.ro is building the liquidity layer for Romanian prediction markets. The user demand is not enough by itself; markets need funded depth to work from day one. We are looking for early liquidity partners who want exposure to a new market structure with transparent, capped risk and revenue from trading fees.

Then explain the economics simply:

```txt
You commit capital to a controlled liquidity pool.
We allocate it only to approved markets.
Every market has a known maximum risk budget.
Traders pay fees.
LPs receive most of those fees.
LPs can make money if fees and balanced flow exceed market-maker losses.
Risk is capped per market and reported transparently.
```

Be explicit about risk:

```txt
This is not fixed yield.
You can lose money on markets where traders are correct.
The reason to participate is that risk is capped, diversified, and compensated by fees.
```

## Outreach email draft

Subject: Liquidity partnership for Marketz.ro

Hi [Name],

I am building Marketz.ro, a Romania-focused prediction market platform.

The main bottleneck in prediction markets is liquidity. New markets need enough depth for users to trade immediately; otherwise the product feels empty. We are solving this with curated markets and an automated market maker, where each market has a transparent liquidity budget and capped risk.

I am looking for a small group of early liquidity partners for a controlled pilot. The model is simple:

- You provide liquidity to approved markets.
- Each market has a predefined maximum risk budget.
- Traders pay fees on volume.
- Liquidity partners receive a majority share of those fees.
- Results are reported transparently by market and by portfolio.

This is not guaranteed yield. LPs take market risk, especially when traders correctly buy underpriced outcomes. The opportunity is that liquidity is the scarce input in this category, and early LPs can earn from fee revenue if volume develops and risk is managed well.

I would like to show you the pilot structure, the risk caps, and example market economics. Would you be open to a short call next week?

Best,

[Your name]

## FAQ for liquidity providers

### Is this guaranteed yield?

No. LPs can lose money. Returns come from fees and market-maker performance. The product should present liquidity provision as risk capital, not as guaranteed interest.

### What is my maximum loss?

Each market should have a disclosed risk cap before LP capital is allocated. For a simple 50/50 binary LMSR market, the rough max AMM loss before fees is `b * ln(2)`. If starting probabilities are uneven, risk can be higher on the low-probability side.

### Can I choose which markets I fund?

That should be supported. At minimum, LPs should be able to set exposure by category, market, and maximum allocation.

### How often do I get paid?

For the pilot, monthly fee distribution is simpler. Later, distributions can be automated.

### What happens if a market is voided?

The platform needs a void policy before launch. Usually, user positions are refunded or settled according to predefined rules, and LP exposure is reversed or adjusted. This must be documented before real-money markets.

### Who decides market resolution?

Markets should resolve from predefined official sources. Admins should not improvise resolution after the fact. There should be a dispute window for edge cases.

### Why not use a normal order book?

Order books are efficient when there are many users. Early local markets usually do not have enough natural two-sided liquidity. An AMM is better for cold start, but it needs funded liquidity and risk controls.

## The honest investor message

The strongest pitch is not "this is free money." The strongest pitch is:

```txt
Liquidity is the bottleneck.
We can cap the risk.
We can diversify across markets.
We can charge fees on volume.
We can start small and prove the model.
```

If the pilot shows strong volume per unit of risk, LPs have a reason to increase capital. If it does not, the platform learns cheaply before scaling.

## Sources and regulatory notes

- European Commission, "Crypto-assets", updated 20 May 2026: the EU describes MiCA as a framework for crypto-assets and related services, with expectations around risk disclosure, market integrity, operational/prudential requirements, and AML/CTF obligations for covered crypto-asset service providers. https://finance.ec.europa.eu/digital-finance/crypto-assets_en
- Marketz.ro prototype notes: the current app is mock only. Wallets, balances, trades, tx hashes, condition IDs, market-maker pricing, and settlement are simulated. No real blockchain, deposits, withdrawals, or real money are currently used.

