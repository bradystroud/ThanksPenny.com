# AGENTS.md - ThanksPenny.com

## Project Overview

A tribute website for **Penny Walker**, SSW Brisbane Office Manager. The site celebrates Penny with interactive thank-you cards for different occasions.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Styling**: Tailwind CSS 3.4
- **Language**: TypeScript 5 (strict)
- **Package Manager**: Yarn
- **Animations**: canvas-confetti
- **Icons**: lucide-react, react-icons

## Project Structure

```
app/
├── page.tsx                        # Home - main thank you hub
├── layout.tsx                      # Root layout with footer
├── globals.css                     # Tailwind directives + CSS variables
├── api/leaderboard/route.ts        # GET top 10 / POST a score (Neon Postgres)
├── components/
│   └── ChatBot.tsx                 # Floating chat widget
├── international-womens-day/
│   └── page.tsx                    # IWD celebration page
├── birthday/
│   └── page.tsx                    # Birthday card (blow out the candles)
├── whack-a-dev/
│   ├── page.tsx                    # Whack-a-Mole game, office edition
│   └── art.tsx                     # Inline SVG art for the game (desk, bunting, hammer cursor)
├── history-quiz/
│   └── page.tsx                    # History quiz
└── arcade/
    └── page.tsx                    # Snake-style artifact hunt
public/
└── christmas-card/                 # Legacy static HTML card
```

## Development

```bash
yarn dev          # Start dev server (Turbopack)
yarn build        # Production build
yarn lint         # Run ESLint
```

## Key Conventions

- All pages are client components (`"use client"`) for interactivity
- Purple/pink color palette throughout
- Tailwind utility classes for all styling (no CSS modules)
- Custom IWD theme colors defined in `tailwind.config.ts`
- The Christmas card is legacy static HTML served via Next.js rewrites in `next.config.ts`
- Pages are static. The only server code is `app/api/leaderboard` (Whack-a-Dev scores), which reads `DATABASE_URL` (Neon Postgres, project `thankspenny`; table `whack_a_dev_scores`) and `LEADERBOARD_SECRET` (signs round tokens). Set both in `.env.local` for local dev (`vercel env pull`)
- Anti-cheat: `POST /api/leaderboard/start` issues a signed round token; a score is accepted only with a token at least 30s old, each token once (`round_nonce` is UNIQUE), and never above `MAX_SCORE`
- Contributors add messages by editing page files directly and making PRs

## Design Guidelines

- Keep it celebratory, warm, and fun
- Use confetti and animations to create delight
- Purple is the primary brand color; pink for IWD
- Mobile-responsive design required
- Accessible color contrast ratios
- Inter font family

## Adding a New Card

1. Create a new directory under `app/` (e.g., `app/birthday/page.tsx`)
2. Use `"use client"` directive for interactivity
3. Follow existing card patterns for layout and styling
4. Add a navigation link from the home page
5. Include a home button on the new card
