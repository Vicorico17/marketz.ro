# Marketz.ro

Romanian civic campaign for competition, transparent costs and proportionate prediction-market regulation, built with Next.js. The homepage centers the petition and sourced research, with a small educational demo. The current version is a mock on-chain product: wallets, balances, trades, tx hashes, condition IDs, blocks, market maker pricing, and settlement are simulated. No real blockchain, deposits, withdrawals, or real money are used.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main Flows

- `/` introduces the campaign and the full Romania-focused catalogue.
- `/petitie` contains the Romanian petition draft, copy/download and print controls. The name/email form is implemented; live collection remains configuration-gated.
- `/cercetare` explains the legal route, sources and verification limits.
- `/cum-functioneaza` explains probabilities, pricing margins and demo limitations.
- `/markets/[slug]` shows market details, LMSR probabilities, buy/sell trade ticket, LP risk metrics, recent trades, and mock chain metadata.
- `/admin` creates markets, changes status, and resolves markets.

In development only, the default mock admin key is:

```bash
marketz-admin
```

Production has no default key and requires explicit configuration:

```bash
ADMIN_MOCK_KEY=your-key
```

## Mock Market Mechanics

- Users connect a generated browser wallet address.
- Each wallet starts with `1000 mRON` demo balance.
- Faucet adds more demo credits.
- Buying and selling an outcome uses an LMSR market maker.
- Each market exposes an estimated LP risk budget based on its liquidity and starting probabilities.
- Trades create mock tx hashes and mock block numbers.
- Resolved winning positions receive `1 mRON` per share.

## Environment

Copy `.env.example` if you need local env values:

```bash
cp .env.example .env.local
```

MongoDB and Cloudinary are currently optional. The prototype uses an in-memory demo store so the app works immediately in development.

## Research and validation

See [legal research](docs/research-romania-petition.md) and [platform review](docs/platform-review.md).

```bash
npm test
npm run typecheck
npm run build
```

This is an in-memory demo, not a production ledger. Void markets refund remaining position cost basis; settled positions are removed from open exposure. The petition includes a two-field signing form and MongoDB storage and Resend thank-you email flow. Live collection stays off until contact, privacy details and service credentials are configured. No petition has been submitted and no real-money service is authorized by this repository.

For database and email setup, see [petition operations](docs/petition-operations.md). Signing takes one step; there is no email confirmation requirement.
