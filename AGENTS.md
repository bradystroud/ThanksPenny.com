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
├── components/
│   └── ChatBot.tsx                 # Floating chat widget
└── international-womens-day/
    └── page.tsx                    # IWD celebration page
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
- No backend/API - purely static frontend
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
