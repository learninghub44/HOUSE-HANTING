# 🏠 House Hunt Kisii

> Find, list, and manage rental properties in Kisii, Kenya — with AI-assisted listings and recommendations built in.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Cloudflare](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

House Hunt Kisii is a rental property marketplace connecting tenants and landlords in Kisii County, Kenya. Landlords list properties (with AI-assisted description generation), tenants search and filter listings, and both sides get a role-specific dashboard. KYC verification and mobile-money payments are planned as the next layer of trust and monetization.

---

## ✨ Features

- 🔍 **Property search** with filters (location, price, type) via a dedicated search page and search bar component
- 🤖 **AI listing generator** — landlords describe a property in plain language and Groq-powered AI drafts a polished listing
- 🎯 **AI recommendations** — surfaces relevant properties to tenants based on their activity
- 🧑‍🤝‍🧑 **Dual dashboards** — separate, purpose-built dashboard views for **tenants** and **landlords**
- 💬 **Inquiry system** — in-app modal for tenants to contact landlords directly
- 🔔 **Notification center** for account and listing activity
- 🔐 **Authentication flows** — login, register, forgot/reset password
- 🪪 **KYC verification page** — scaffolded for Didit integration
- 📄 **Legal pages** — Terms of Service and Privacy Policy included out of the box
- ⚡ **Edge-deployed** on Cloudflare Pages via OpenNext for fast global load times

---

## 🧱 Tech Stack

| Layer            | Technology                                                   |
|------------------|---------------------------------------------------------------|
| Framework        | [Next.js 15](https://nextjs.org/) (App Router)                |
| Language         | [TypeScript 5](https://www.typescriptlang.org/)                |
| UI               | [React 19](https://react.dev/) + [Radix UI](https://www.radix-ui.com/) primitives |
| Styling          | [Tailwind CSS 3](https://tailwindcss.com/) + `tailwind-merge` + `class-variance-authority` |
| Forms            | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation |
| Animation        | [Framer Motion](https://www.framer.com/motion/)                |
| AI               | [Groq SDK](https://console.groq.com/docs) (listing generation & assistant) |
| Icons            | [Lucide React](https://lucide.dev/)                            |
| Deployment       | [Cloudflare Pages](https://pages.cloudflare.com/) via [OpenNext](https://opennext.js.org/) + [Wrangler](https://developers.cloudflare.com/workers/wrangler/) |
| Planned          | Supabase (data/auth), Didit (KYC), PayHero (mobile money payments) |

---

## 📁 Project Structure

```
HOUSE-HANTING/
├── app/
│   ├── admin/                  # Admin area
│   ├── api/
│   │   ├── ai-assistant/       # AI chat/assistant endpoint
│   │   └── generate-description/  # AI listing description generator
│   ├── dashboard/
│   │   ├── landlord/           # Landlord dashboard
│   │   └── tenant/             # Tenant dashboard
│   ├── kyc/                    # KYC verification flow
│   ├── login/ · register/      # Auth pages
│   ├── forgot-password/ · reset-password/
│   ├── property/[id]/          # Property detail page
│   ├── search/                 # Property search page
│   ├── terms/ · privacy/       # Legal pages
├── components/
│   ├── ui/                     # Base UI primitives (button, card, input, badge)
│   ├── ai-listing-generator.tsx
│   ├── ai-recommendations.tsx
│   ├── property-card.tsx
│   ├── search-bar.tsx
│   ├── auth-form.tsx
│   ├── dashboard-shell.tsx
│   ├── inquiry-modal.tsx
│   ├── notification-center.tsx
│   └── nav.tsx · footer.tsx
├── lib/
│   ├── data.ts                 # Data layer / seed data
│   ├── site-config.ts          # Site-wide config
│   └── utils.ts
├── scripts/
│   └── cf-postbuild.mjs        # Cloudflare post-build step
├── wrangler.jsonc               # Cloudflare Workers/Pages config
├── open-next.config.ts          # OpenNext adapter config
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.18+ (20+ recommended)
- npm (bundled with Node)
- A [Groq API key](https://console.groq.com/) for AI features

### Installation

```bash
# Clone the repo
git clone https://github.com/learninghub44/HOUSE-HANTING.git
cd HOUSE-HANTING

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# then fill in GROQ_API_KEY at minimum
```

### Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command            | Description                                              |
|---------------------|-----------------------------------------------------------|
| `npm run build`     | Production build (standard Next.js)                      |
| `npm run start`      | Start the production build locally                        |
| `npm run lint`       | Run ESLint                                                 |
| `npm run build:cf`   | Build for Cloudflare via OpenNext                         |
| `npm run preview`    | Build for Cloudflare and preview with Wrangler locally     |
| `npm run deploy`     | Build and deploy to Cloudflare Pages                       |

---

## 🔐 Environment Variables

See [`.env.example`](./.env.example) for the full list. Currently required:

| Variable                | Required | Purpose                                      |
|--------------------------|----------|-----------------------------------------------|
| `GROQ_API_KEY`            | ✅ Yes   | Powers the AI listing generator & assistant   |
| `NEXT_PUBLIC_SITE_URL`    | ✅ Yes   | Used in metadata, sitemap, and robots.txt     |

Planned (commented out until wired):

| Variable                                | Purpose                        |
|-------------------------------------------|---------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Backend data & auth (Supabase) |
| `DIDIT_API_KEY` / `_WORKFLOW_ID` / `_WEBHOOK_SECRET` / `_CALLBACK_URL` | KYC verification (Didit)       |
| `PAYHERO_API_KEY` / `_CHANNEL_ID` / `_WEBHOOK_SECRET`                  | Mobile money payments (PayHero) |

---

## ☁️ Deployment

This project deploys to **Cloudflare Pages** using the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare):

```bash
npm run deploy
```

This runs an OpenNext build, a Cloudflare-specific post-build step (`scripts/cf-postbuild.mjs`), then deploys the `.open-next/assets` output via `wrangler pages deploy`.

Configuration lives in [`wrangler.jsonc`](./wrangler.jsonc) and [`open-next.config.ts`](./open-next.config.ts).

---

## 🗺️ Roadmap

- [ ] Wire Supabase for persistent data storage and authentication
- [ ] Integrate Didit for KYC identity verification
- [ ] Integrate PayHero for M-Pesa/mobile money payments
- [ ] Landlord payout & subscription tiers
- [ ] Image upload & gallery support for listings
- [ ] SMS/WhatsApp notifications for inquiries

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

## 📬 Contact

Maintained by [learninghub44](https://github.com/learninghub44). For bugs or feature requests, please [open an issue](https://github.com/learninghub44/HOUSE-HANTING/issues).
