# Petition storage and launch

The app uses the already-installed MongoDB driver. No database has been provisioned or connected by this change, and no real mail has been sent. Market demo data and petition records are separate: petition records never use the in-memory market store.

## Data stored

`petition_signatures`: name, normalized email, email hash, petition version, privacy version, consent timestamp, submitted status, an explicit emailVerified=false marker, hashed random withdrawal token, receipt delivery status and expiration. A unique compound index on email hash and petition version prevents duplicates. MongoDB TTL expires submissions after 180 days. Withdrawal tokens are random 256-bit values. Neither email possession nor civil identity is verified. No CNP, home address, marketing opt-in or public name listing.

`petition_limits`: aggregate minute counter with TTL, no visitor IP. Requests are limited to 20/minute globally; a duplicate submission never sends another receipt or changes the saved name. Add hosting-level abuse controls appropriate to expected traffic before public promotion. The global mail limit is deliberately small and can be exhausted by abuse; it is not a replacement for perimeter protection.

## Configure

1. Create/use a managed MongoDB database with a least-privilege application user and TLS. Put its URI (including a database name) in server-only `MONGODB_URI`. Do not commit it. Configure backups, access permissions and retention.
2. Configure a verified Resend sending domain, `RESEND_API_KEY`, and `PETITION_FROM_EMAIL`. The app sends only a thank-you receipt with a withdrawal link, never marketing.
3. Set `PETITION_ORIGIN` to the exact public HTTPS origin, with no trailing slash/path. Same-origin POST requests are enforced.
4. Set `PETITION_ORGANIZER` (default Marketz.ro) and `PETITION_CONTACT_EMAIL`. Complete `/confidentialitate` with legal controller identity, actual hosting/database providers, locations, transfer safeguards and backup/log retention. The current text is a draft.
5. Once the notice is complete, set `PETITION_PRIVACY_READY=true`; set `PETITION_ENABLED=true` to open collection. Until then the UI is disabled and signing returns 503, without a database write.
6. Test with a consenting address you control: sign once, verify immediate storage, receive the thank-you email, retry to verify duplicates, use withdrawal link, and verify deletion. Inspect MongoDB with authorized admin tooling. Neither secret tokens nor supporter data should enter application logs.

Withdrawal requires an explicit button press, avoiding mutations from email-scanner GET requests. Tokens are in URL fragments, removed after reading, and submitted in JSON bodies. Withdrawal remains available when new collection is paused, provided the origin and database stay configured.

The API has no public listing/export of names or emails. For delivery to authorities, the organizer must use authenticated database access, export only submitted/unexpired records, clearly identifying them as unverified declarations, for the relevant version, and disclose the intended recipients. Verify the authority's submission requirements; campaign support is not a qualified electronic signature.

## Verification limits

Unit/service tests cover validation, consent, size limits, inactive collection, origin checks, one-step storage, withdrawal replay, duplicate handling, expiration and deletion. Service tests substitute MongoDB and mail transport; a real provider integration test remains required once credentials are supplied. Automated TTL deletion timing, email delivery and hosting-level protections are not proven by the mocks.

Email delivery failures are recorded as `receiptStatus=failed`; storage remains successful. There is no background retry worker in this version. Operators can monitor failed/pending receipts and handle contact requests without treating email delivery as a signing requirement. Support counts, if added later, must not be described as identity-verified people.
