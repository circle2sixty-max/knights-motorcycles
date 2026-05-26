# Knights Motorcycles Owner Feedback — 2026-05-26

Source: Yuan relayed feedback from the motorcycle dealer owner in Feishu.
Recorded: 2026-05-26 03:55 BST

## Current site context

- Original domain: `https://www.knights-motorcycles.co.uk/`
- Render review public site: `https://knights-motorcycles.onrender.com/`
- Render review admin/CMS: `https://knights-motorcycles.onrender.com/#/admin`
- Current project path: `/Users/yuantao/Documents/codex/Knightsmotorcycles`

## Owner requested changes

1. Company name
   - Owner wants the company name changed to the exact name shown in the screenshot he sent to Yuan.
   - Exact text is not yet confirmed in this note because Hermes has not extracted the screenshot text in this session.
   - Action needed: confirm exact company name from screenshot or Yuan before changing site copy/logo/footer/legal copy.

2. Website email
   - Owner wants website email updated.
   - Yuan will provide the new email later.
   - Current visible email in site content: `sales@knightsmotorcycles.uk`.
   - Action needed after Yuan provides email: update company details, footer, contact page, mailto links, any finance/enquiry mailto templates.

3. Appointment viewing window
   - Add a customer-facing “book/appointment viewing” window or section.
   - Purpose: let buyers request a viewing appointment for a specific motorcycle or general showroom visit.
   - Suggested fields: name, phone/email, bike of interest, preferred date/time, message.

4. Deposit window
   - Add a “deposit” window/section.
   - Purpose: allow buyers to understand/reserve a bike with a deposit.
   - Needs wording approval before live payment integration.
   - Suggested initial implementation: enquiry/reservation CTA, not real payment collection until payment provider and policy are confirmed.

5. PX / vehicle check / sell-bike window
   - Yuan described this as “批查和收车窗口”; likely means part-exchange/vehicle valuation/sell-your-bike intake.
   - Existing route `#/sell-your-bike` exists and should be reviewed/upgraded into a clearer intake window.
   - Suggested fields: registration, make/model, mileage, condition, service history, outstanding finance, photos, contact details.

6. Finance window
   - Build the finance/payment window now as a placeholder-ready feature.
   - Owner will contact finance companies that provide motor dealer lending/finance services and later supply details.
   - Until provider is confirmed, finance page should be informational and enquiry-based only.
   - Legal/compliance note: finance wording must be approved; avoid presenting live credit applications or lender promises before FCA/finance partner status is confirmed.

## Implementation safety notes

- Do not change production domain/Fasthosts files without explicit Yuan confirmation.
- Render review site can be used for previewing changes.
- Current admin on Render can log in with temporary review password documented in `cms-and-fasthosts-deployment-2026-05-24.md`; do not use that password for production.
- Before publishing to Render, run `npm run build` and visually check public routes plus `#/admin`.
