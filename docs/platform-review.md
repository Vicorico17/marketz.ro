# Platform review

## Product and architecture

Next.js 14 App Router, React, TypeScript and Tailwind. Demo markets live in a process-global in-memory store. LMSR pricing supplies quotes and execution; generated browser addresses identify balances. There is no wallet signature, money movement, blockchain settlement or production ledger. MongoDB, Cloudinary and thirdweb are present in the repository but are not required for the main demo flow.

The intended product is now a Romanian civic campaign about competition, transparent costs and proportionate taxation. The homepage prioritizes the petition and research. A searchable catalogue of 24 real-world Romanian questions illustrates the concept; detailed technical trading dashboards have been removed. The existing admin route remains available for development but is not promoted in the public navigation.

## Corrections implemented

- Expired markets close on read and cannot quote or trade.
- Partial admin updates retain fields omitted from a PATCH request.
- Resolved/voided markets cannot reopen or settle twice.
- Settlement burns paid positions and records realized PnL, avoiding double-counted portfolio value.
- Voiding returns the remaining cost basis once, a documented demo convention.
- Resolution rules cannot change after trading starts.
- Validation rejects malformed addresses, categories, outcomes, nonfinite amounts and invalid lifecycle transitions.
- Production admin requires an explicit configured key; development retains the documented demo key.
- Mutable API routes are dynamic, avoiding build-time snapshots.
- Wallet and portfolio failures have visible error states; invalid API input returns 400.
- Quote display clears when inputs change; submission needs a valid quote, open market and adequate demo balance.
- Removed misleading suggestion that splitting an LMSR trade eliminates cumulative price impact.
- Added Romanian campaign, cited research, educational guide and export/print controls. No fabricated endorsements or signatures.

## Deliberate limits

The demo is not a production financial application. Anyone who knows a demo address can act as it; state is not durable or shared across instances, and quote execution has no guaranteed-price protocol. No real-money capability has been added. Existing framework/dependency versions were retained; an upgrade and security audit should be a separate bounded change before public deployment. Petition collection needs a real organizer, data policy, durable storage, operational configuration and abuse controls.

## Verification

Run `npm test`, `npm run typecheck`, and `npm run build`. Tests exercise accounting invariants, lifecycle validation, quote pricing and production admin rejection. Browser visual verification is separately reported in the task handoff.
