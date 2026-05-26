# Business Leads / Admin Handling — 2026-05-26

Recorded: 2026-05-26 12:32 BST

## Requirement

Yuan clarified that the new customer-facing action windows must not stop at page copy or mailto links. Every public business module needs a matching admin-side handling module so the dealership can query and process submitted information.

Required data flow:

```text
Public form submission → server API → persistent leads store → admin business inbox → status / notes / archive handling
```

## Implemented scope

### Public forms

The shared `LeadForm` in `src/App.jsx` now submits enquiries to `/api/leads.php` before falling back to email.

Covered lead types:

- `appointment` / `viewing` — book-viewing and showroom appointment requests.
- `deposit` — deposit / reservation enquiries. Still enquiry-only; no payment is collected.
- `valuation` — sell-my-bike, part-exchange, collection and valuation requests.
- `finance` — finance interest enquiries. Still enquiry-only until lender/FCA wording is confirmed.

User-facing behaviour:

- Success message: enquiry is saved and a reference is shown.
- Failure path: the customer is offered an email fallback and can still call the dealership.
- Each lead includes `sourcePath` so staff can see which page generated it.

### Render server API

`server/render-server.mjs` now stores leads separately from CMS page content.

Data path:

```text
${CMS_DATA_DIR}/cms-data/leads.json
```

If `CMS_DATA_DIR` is not configured, local/default path is:

```text
.render-data/cms-data/leads.json
```

Endpoint:

```text
/api/leads.php
```

API behaviour:

- `POST /api/leads.php`
  - Public endpoint for creating a lead.
  - Sanitises lead type, customer details, custom fields, message and consent.
  - Rejects honeypot submissions and applies a basic per-IP in-memory rate limit.
  - Returns a lead reference and only minimal lead metadata; it does not echo full customer PII.
- `GET /api/leads.php`
  - Admin-only endpoint.
  - Requires an authenticated admin session.
  - Returns saved leads for the business inbox.
- `PATCH /api/leads.php?id=<leadId>`
  - Admin-only endpoint.
  - Updates `status` and `adminNotes`.
  - Appends a processing entry to `history`.

Production safety gates:

- `NODE_ENV=production` now requires `CMS_ADMIN_PASSWORD`; there is no source-code fallback admin password.
- `NODE_ENV=production` now requires `CMS_DATA_DIR`; Render must point this to a persistent disk/volume before public lead capture is used.
- Lead create/update operations are serialised through a queue so concurrent JSON read-modify-write requests do not overwrite each other.
- JSON writes use unique temporary file names before atomic rename.
- Admin sessions have a server-side expiry and the cookie has `Max-Age`.

Allowed statuses:

- `new`
- `contacted`
- `booked`
- `reserved`
- `valuation-sent`
- `finance-follow-up`
- `closed`
- `archived`

### Admin business module

`src/AdminPage.jsx` now has a `Business` tab separate from CMS copy editing.

Admin modules match the public windows:

1. `Appointments`
   - Lead types: `appointment`, `viewing`.
2. `Deposits / reservations`
   - Lead type: `deposit`.
3. `Valuations / PX`
   - Lead type: `valuation`.
4. `Finance enquiries`
   - Lead type: `finance`.

Admin staff can:

- View total/open/new/archived lead counts.
- Refresh leads.
- See customer name, phone, email, preferred contact, source page, message and submitted fields.
- Change status.
- Add/update admin notes.
- Save processing updates back to the server.

## Verification completed

Automated checks:

```bash
node tests/business-leads-api-check.mjs
# business-leads-api-check passed

node tests/business-leads-check.mjs
# business-leads-check passed

node tests/feature-content-check.mjs
# feature-content-check passed

npm run lint
# exit 0

npm run build
# vite build completed successfully

git diff --check
# exit 0
```

`tests/business-leads-api-check.mjs` is a runtime regression test that starts the real Render server on temporary data. It verifies production fail-fast configuration, public lead creation, admin-only list/update access, validation errors, malformed JSON handling, and minimal public responses.

API smoke test with temporary local data and temporary local admin password:

- Public lead creation returned a lead reference.
- Unauthenticated `GET /api/leads.php` returned `401`.
- Authenticated admin `GET /api/leads.php` returned the test lead.
- Authenticated `PATCH /api/leads.php` updated status and admin notes.

Browser E2E test with fictional data:

- Opened `/#/book-viewing` on a clean local Render server port.
- Submitted a fictional appointment enquiry.
- Saw `Enquiry received` and a generated reference.
- Logged into `/#/admin` using a temporary local test password.
- Opened the `Business` tab.
- Confirmed the lead appeared under `Appointments`.
- Updated status to `booked` and added admin notes.
- Confirmed the admin API persisted the update.

## Limitations / follow-up

- The current persistence layer is JSON-file based. Writes are queued, but Render production must still use either a persistent disk with `CMS_DATA_DIR` set or a database before relying on this for real customer data.
- `CMS_ADMIN_PASSWORD` must be supplied as a strong Render environment variable; there is no production fallback password.
- No automatic email notification is implemented yet. Staff must check the admin inbox unless SMTP/SendGrid/etc. is added later.
- Deposit/reservation remains enquiry-only. Do not add real payment collection until payment provider, terms, refund/cancellation policy and security requirements are confirmed.
- Finance remains enquiry-only. Do not add a real finance application until lender details, FCA/credit broker wording and approved customer journey are confirmed.
- Fasthosts PHP deployment currently still needs a matching `api/leads.php` endpoint if the same business inbox is required outside Render.
- Real customer PII must not be copied into long-term memory or public reports.

## Files changed

- `server/render-server.mjs`
- `src/cmsApi.js`
- `src/App.jsx`
- `src/AdminPage.jsx`
- `tests/business-leads-check.mjs`
- `tests/business-leads-api-check.mjs`
