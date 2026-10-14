# NB Brokerage & Supply Services — website

B2B website for **NB Brokerage & Supply Services** (by Salma Al-Tawil): building-material supply from Egypt to African markets.
The site is a lead-generation "digital sales office" — no cart or prices; every call to action leads to a quote request.

## Stack

- **Next.js 15** (App Router, static generation) + **TypeScript**
- **Tailwind CSS v4** — design tokens in `src/app/globals.css`
- **next-intl** — English, French, Arabic (RTL) at `/en`, `/fr`, `/ar`
- **Supabase** — stores quote requests (+ uploaded spec files)
- **Resend** — emails each quote request to the sales team
- Self-hosted fonts via Fontsource (Archivo, Inter, IBM Plex Mono, IBM Plex Sans Arabic)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional for local dev
npm run dev                  # http://localhost:3000 → redirects to /en
```

Without Supabase/Resend keys the quote form still works in development: submissions are logged to the server console.
In production, at least one of Supabase or Resend must be configured, otherwise the API returns `503`.

## Pages

| Route | Content |
| --- | --- |
| `/[locale]` | Home — hero carousel, products explorer, why us, Africa export map, process, about + founder, contact / quote form |
| `/[locale]/products` | All material categories |
| `/[locale]/products/[slug]` | Product detail (cement, sand, marble, clinker, silica-sand) |
| `POST /api/quote` | Quote submission (validation, honeypot, rate limit, Supabase insert, file upload, email) |

## Content & translations

- All copy lives in `messages/en.json`. Product details are under `products.items.<slug>.detail`.
- French and Arabic are generated from English + overrides: edit `scripts/tr_fr.py` / `scripts/tr_ar.py`, then run
  `python3 scripts/build_messages.py`. (Or edit `messages/fr.json` / `ar.json` directly if you stop using the script.)
- Bracketed text like `[Year]` or `[sales@company.com]` is placeholder content still to be confirmed with the client.
- French/Arabic translations are machine-drafted — have a native speaker review before launch.

## Supabase setup

1. Create a Supabase project for this client.
2. Run `supabase/migrations/20261014000000_quote_requests.sql` (SQL editor or `supabase db push`).
   It creates `public.quote_requests` (RLS on, no public policies) and a private `quote-files` storage bucket.
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server-only).

## Email setup (Resend)

Set `RESEND_API_KEY`, `SALES_EMAIL` (comma-separated for several) and `QUOTE_FROM_EMAIL` from a verified domain.

## Deploy

Vercel works out of the box: import the repo, add the env vars from `.env.example`, deploy.
