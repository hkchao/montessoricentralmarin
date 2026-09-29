# Montessori School of Central Marin — website

Modern rebuild of [montessoricentralmarin.org](http://www.montessoricentralmarin.org) as a Next.js 16 (App Router) + Tailwind CSS v4 site. All pages are statically prerendered.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start
```

## Where things live

| Path | What |
| --- | --- |
| `src/lib/site.ts` | **All site content in one place**: contact info, hours, nav, events, programs, curriculum, enrichment, gallery, admissions steps, PDF links. Edit copy here. |
| `src/app/` | Routes: `/`, `/about`, `/programs`, `/events`, `/curriculum` (linked, not in main nav), `/admissions`, `/contact`, plus `sitemap.xml`, `robots.txt`, favicon (`icon.jpg`). `/our-school` redirects to `/about`. |
| `src/components/PageHero.tsx` | Shared banner frame: content-hugging height, left-justified type with a matching gradient, focal-point `object-position`, media plane capped at 1600px with navy fill beyond. |
| `src/components/` | Header (sticky, mobile menu), footer, sticky mobile call/map/tour bar, tour request form, event list. |
| `src/app/globals.css` | Brand tokens (navy, sun gold, sage, cream), fonts (Fraunces + Figtree), two motions (hero rise-in, scroll reveal). |
| `public/brand/` | Original school logo, AMS logo, Pacific Sun Best of Marin 2026 badge. |
| `public/images/` | Photos. `hero-children-original.jpg` is the original 775px hero; `hero-children-wide.png` is the AI-extended version used on the home page. `hero-*.png` interior banners are AI-generated Montessori environment images (no people). Classroom gallery JPGs are AI-restored from the school's original photos. |
| `public/docs/` | Calendar, application, enrollment, re-enrollment, and tuition PDFs from the old site. |

## Tour request form

`src/app/contact/actions.ts` is a server action that emails tour requests via [Resend](https://resend.com) (no SDK — plain `fetch`). Set these environment variables (see `.env.example`):

- `RESEND_API_KEY` — required for delivery.
- `CONTACT_TO_EMAIL` — defaults to the school office address.
- `CONTACT_FROM_EMAIL` — a verified sender on your Resend domain.

Without `RESEND_API_KEY` the form shows a friendly "please call or email" message instead of pretending to send.

## Updating content

- **Events**: edit the `events` array in `src/lib/site.ts`.
- **New school year PDFs**: drop files in `public/docs/` and update `docs` in `src/lib/site.ts`.
- **Photos**: replace files in `public/images/` (keep names). Curriculum still uses the ~300px images from the old site.

## Deploying

Standard Next.js — deploys to Vercel with zero config. Point the `montessoricentralmarin.org` domain at the project when ready.
