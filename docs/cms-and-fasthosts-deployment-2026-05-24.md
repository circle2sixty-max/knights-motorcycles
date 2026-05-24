# Knights Motorcycles CMS and Fasthosts Deployment Notes

Date: 2026-05-24

## Current Site Structure

The current website is a React + Vite single-page site using hash routes, so it can run on ordinary static/PHP hosting without server-side route rewrites.

Public routes:

- `#/` splash entry page with video background, logo, opening statement and key metrics.
- `#/home` main commercial homepage with hero, trust badges, featured stock, story imagery, services and call to action.
- `#/bikes` stock listing with search and status filters.
- `#/bikes/:slug` vehicle detail pages with image gallery, price, finance estimate, preparation checklist and dealer notes.
- `#/sell-your-bike` valuation/part-exchange enquiry page.
- `#/finance` representative finance page and enquiry form.
- `#/contact` contact, map, hours and viewing enquiry page.
- `#/about` dealership story, standards and customer services.
- `#/legal/privacy`, `#/legal/cookies`, `#/legal/terms` basic legal pages.
- `#/admin` new protected CMS area.

Current content status:

- 16 original-site vehicle listings are present.
- 14 vehicles are marked available and 2 are marked sold.
- Original site service content has been migrated.
- Enquiry forms still use `mailto:` and should be upgraded later to stored leads/email delivery.

## New CMS Scope

The new CMS adds:

- Admin login screen.
- Stock editor for adding/editing/removing vehicles.
- Vehicle image URL editing and image upload once PHP API is deployed.
- Company details editor for phone, email, address, hours and map link.
- Page copy editor for hero text, homepage copy, story paragraphs, service standards, checklists, finance rows, legal copy and structured modules.
- Full JSON import/export for backup, staging-to-live transfer and emergency restore.

The frontend now tries to load live CMS content from:

```text
/api/content.php
```

If no CMS content exists yet, it falls back to the bundled default content.

## Render Review Deployment

Render now runs the app with the Node server in `server/render-server.mjs`, not only the static `serve` command. This lets the review deployment load and save CMS content through the same frontend API paths:

```text
/api/content.php
/api/login.php
/api/logout.php
/api/upload.php
```

Review links:

```text
https://knights-motorcycles.onrender.com/
https://knights-motorcycles.onrender.com/#/admin
```

Temporary review password:

```text
KnightsDemo2026!
```

This password is for client review only. Before a real launch, replace it in Render with a private `CMS_ADMIN_PASSWORD` environment variable and do not keep the demo password in production.

Render persistence note:

- The review deployment stores CMS edits on the Render server filesystem.
- This is enough for client review and feedback.
- For long-term production on Render, attach a Render Disk or move CMS storage to a database/object storage.
- For the final Fasthosts deployment, the PHP API stores CMS content in `/cms-data/content.json` and uploads in `/uploads/`.

## Fasthosts Deployment

Recommended approach for the existing `knights-motorcycles.co.uk` domain:

1. Build the site locally:

   ```bash
   npm run build
   ```

2. Back up the existing Fasthosts website files before replacing anything.
3. Upload the full contents of `dist/` to the website root for `knights-motorcycles.co.uk`.
4. Copy `deployment/fasthosts-api/api/` into the live website root as `/api/`, then copy `api/config.example.php` to `api/config.php`.
5. Generate an admin password hash:

   ```bash
   php -r 'echo password_hash("strong-password-here", PASSWORD_DEFAULT), PHP_EOL;'
   ```

6. Paste the hash into `api/config.php`.
7. Make these server folders writable by PHP:

   ```text
   /cms-data
   /uploads
   ```

8. Open:

   ```text
   https://knights-motorcycles.co.uk/#/admin
   ```

9. Log in, publish the first CMS save, then check the public site.

## Access Needed From The Owner

Best option:

- Temporary Fasthosts Control Panel access, or a temporary user with permission to manage the website files.

Alternative option:

- FTP/SFTP host.
- FTP/SFTP username.
- FTP/SFTP password.
- Port number.
- Correct website root folder for `knights-motorcycles.co.uk`.
- Confirmation that the plan supports PHP 8.2 or 8.3.
- Permission to make `/cms-data` and `/uploads` writable.

If the domain and hosting are already both inside Fasthosts, DNS usually does not need to change. If the domain points somewhere else, DNS records need to be reviewed before launch.

## Owner Confirmation Checklist

Ask the owner to confirm:

- Is the visual style acceptable for the final live site?
- Should the splash entry page stay, or should visitors land directly on the homepage?
- Are the 16 current vehicle listings correct?
- Which sold bikes should remain visible?
- Are prices, mileage, MOT notes and photos correct?
- Should enquiries stay as email links for launch, or should leads be stored in the CMS?
- What finance wording is legally acceptable?
- Should the site keep the existing `sales@knightsmotorcycles.uk` email?
- Who will receive admin access?
- What exact launch date/time is safe?

## Remaining Pre-Launch Risks

- PHP API syntax has not been executed locally because PHP is not installed on this Mac.
- The admin password must be configured before upload.
- Fasthosts folder permissions must be tested after upload.
- Enquiry forms are still `mailto:` rather than database-backed lead forms.
- Finance wording must be approved before presenting real finance applications.
