# Marketz.ro

Romania-focused prediction market prototype built with Next.js. The current version is a mock on-chain product: wallets, balances, trades, tx hashes, condition IDs, blocks, market maker pricing, and settlement are simulated. No real blockchain, deposits, withdrawals, or real money are used.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main Flows

- `/` lists active Romanian markets, filters, search, portfolio, and mock wallet controls.
- `/markets/[slug]` shows market details, LMSR probabilities, trade ticket, recent trades, and mock chain metadata.
- `/admin` creates markets, changes status, and resolves markets.

The default mock admin key is:

```bash
marketz-admin
```

Override it with:

```bash
ADMIN_MOCK_KEY=your-key
```

## Mock Market Mechanics

- Users connect a generated browser wallet address.
- Each wallet starts with `1000 mRON` demo balance.
- Faucet adds more demo credits.
- Buying an outcome uses an LMSR market maker.
- Trades create mock tx hashes and mock block numbers.
- Resolved winning positions receive `1 mRON` per share.

## Environment

Copy `.env.example` if you need local env values:

```bash
cp .env.example .env.local
```

MongoDB and Cloudinary are currently optional. The prototype uses an in-memory demo store so the app works immediately in development.
