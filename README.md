<p align="center">
  <img src="public/logo.svg" height="128" alt="Sumud Scents">
</p>

<h1 align="center">Sumud Scents</h1>

<p align="center">
  An e-commerce store for premium fragrances, built with Next.js and Stripe.
</p>

## Tech Stack

- **Next.js 16** — App Router, React Server Components, React Compiler
- **Bun** — JavaScript runtime and package manager
- **Commerce Kit SDK** — Headless commerce API
- **Stripe** — Payments and checkout
- **Tailwind CSS v4** — Styling
- **Shadcn UI** — Component library (Radix UI)
- **TypeScript** — Type-safe development
- **Biome** — Linter and formatter

## Getting Started

### Prerequisites

- [Node.js 24+](https://nodejs.org/)
- [Bun 1.0+](https://bun.sh/)
- A `YNS_API_KEY` from [yns.store](https://yns.store/manage/settings/api)

### Setup

```bash
bun install
cp .env.example .env.local   # Add your YNS_API_KEY
bun dev
```

Open [localhost:3000](http://localhost:3000).

## Scripts

```bash
bun dev           # Dev server
bun run build     # Production build
bun start         # Production server
bun run lint      # Lint and auto-fix
```

## Environment Variables

| Variable      | Description                    |
|---------------|--------------------------------|
| `YNS_API_KEY` | API token from the admin panel |

## License

Private.
