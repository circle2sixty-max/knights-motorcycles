# Knights Motorcycles Action Windows Implementation — 2026-05-26

## Scope implemented locally

Implemented the owner feedback relayed by Yuan for the Render review site codebase.

Project path:

```text
/Users/yuantao/Documents/codex/Knightsmotorcycles
```

## New customer-facing windows

### 1. Appointment viewing window

Route:

```text
/#/book-viewing
```

Adds a dedicated appointment viewing page with:

- Bike of interest
- Preferred date
- Preferred time window
- Viewing purpose
- Standard contact details
- Consent checkbox
- Mailto enquiry generation

### 2. Deposit / reservation window

Route:

```text
/#/reserve
```

Adds a dedicated deposit/reservation enquiry page with:

- Bike to reserve
- Proposed deposit
- Viewing/collection timing
- Payment route
- Clear disclaimer that the website does not collect live payments yet
- Mailto enquiry generation

### 3. Sell / part-exchange / collection window

Existing route upgraded:

```text
/#/sell-your-bike
```

Now explicitly covers:

- Vehicle check / valuation
- Registration
- Make/model
- Mileage
- Service history
- Outstanding finance
- Cash purchase / part exchange / collection

### 4. Finance enquiry window

Existing route upgraded:

```text
/#/finance
```

Now positioned as lender-ready placeholder functionality:

- Finance interest form
- Bike of interest
- Deposit available
- Monthly budget
- Preferred term
- Disclaimer: no live finance application until lender/FCA wording is approved

## Homepage / navigation changes

- Added `Book Viewing` to navigation.
- Added homepage “Customer action windows” section with four cards:
  - Book a viewing
  - Reserve with deposit
  - Sell / part exchange
  - Finance enquiry
- Bike detail pages now show direct buttons:
  - Book viewing
  - Reserve

## Admin/CMS changes

Admin page copy editor now exposes JSON editors for:

- `Action windows JSON`
- `Appointment page JSON`
- `Deposit page JSON`
- `Finance page JSON`
- `Sell / PX page JSON`
- `Lead form subjects JSON`

Company details editor already supports:

- company name
- brand
- email
- mailto link auto-update when email changes

## Compatibility fix

Added merge/backfill protection so older CMS/local draft JSON does not hide newly added modules:

- App: `mergeNavItems`, `mergeServiceCards`, `mergeSiteContent`
- Admin: `mergeDraftContent`

This ensures old CMS data can still receive new default routes/cards/modules.

## Tests / verification

Added:

```text
tests/feature-content-check.mjs
```

Verification passed:

```bash
node tests/feature-content-check.mjs
npm run lint
npm run build
git diff --check
```

Local preview verified:

```text
http://127.0.0.1:4174/#/book-viewing
http://127.0.0.1:4174/#/reserve
http://127.0.0.1:4174/#/sell-your-bike
http://127.0.0.1:4174/#/finance
http://127.0.0.1:4174/#/admin
```

## Not done yet

- Did not push to GitHub.
- Did not deploy to Render.
- Company name not changed yet because exact screenshot text was not available in this session.
- Email not changed yet; Yuan said he will provide the new website email later.
- No real payment gateway, CRM, or finance lender API is connected yet.

## Launch caution

Before public/Render deployment:

1. Confirm exact company name from owner screenshot.
2. Confirm new website email.
3. Confirm finance wording/provider status.
4. Confirm whether deposit should remain enquiry-only or become a payment feature.
5. Push/deploy only after Yuan explicitly confirms.
