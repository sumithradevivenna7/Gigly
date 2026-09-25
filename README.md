# Gigly — Full-Stack Freelance Marketplace

Gigly is a modern, proposal-based freelance marketplace platform modeled after Upwork's hiring mechanics. It connects high-growth companies and clients with top software engineers, designers, and tech specialists. 

Unlike fixed-catalog gig platforms, Gigly focuses on custom scope posts, tailored technical proposals, milestone-based contracts, and **Stripe Connect escrow-style security**.

---

## Key Highlights & Core Features

- **Upwork-Style Proposal Hiring Model**: Clients post detailed technical requirements, budget constraints, and deadlines; freelancers evaluate specifications and submit customized bids with cover letters, estimated milestones, and pricing.
- **Dynamic Dual-Perspective Architecture (Role Switcher)**: Users can sign up as a **Client**, **Freelancer**, or **Both**. A persistent role switcher allows users with dual roles to seamlessly toggle between client and freelancer modes in a single click.
- **Job Discovery & Multi-Filter Search**: Search across job titles, descriptions, and categories (Web Development, Backend & APIs, Design & Creative, DevOps, AI & Machine Learning). Filter by skill tags (`Next.js`, `TypeScript`, `Prisma`, `Stripe API`), budget type (`Fixed-Price` vs. `Hourly`), and budget ranges.
- **Client Job Wizard**: Multi-step project creation form with interactive skill tagging, budget parameters, and delivery timelines.
- **Contract & Stripe Escrow Pipeline**: When a client accepts a winning proposal, a contract is generated with funds locked in `HELD_IN_ESCROW`. Once the freelancer completes deliverables, the client inspects milestones and approves the release of funds.
- **NextAuth Authentication**: Secure credentials-based authentication with `bcryptjs` password hashing and role-encoded JWT session tokens.
- **Production-Ready PostgreSQL Schema**: Fully normalized database schema managed via Prisma ORM spanning 9 models and status enums (`User`, `Skill`, `UserSkill`, `Job`, `Proposal`, `Contract`, `Message`, `Review`, `Notification`).

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Next.js 14 (App Router)](https://nextjs.org/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism UI & Emerald Brand Design System |
| **Backend** | Next.js API Route Handlers (REST) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (Credentials Provider, JWT Sessions) |
| **Payments & Escrow**| [Stripe Connect](https://stripe.com/connect) (Escrow Hold & Release workflow) |
| **Real-Time** | [Socket.io](https://socket.io/) (Messaging & Instant Notifications) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## Project Structure

```
Gigly/
├── prisma/
│   ├── schema.prisma             # Comprehensive database schema (9 models + status enums)
│   ├── seed.js                   # Seeder script for demo accounts, jobs, and proposals
│   └── migrations/
│       └── 20260925_init/        # Initial PostgreSQL DDL migration
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/             # [...nextauth], register, switch-role
│   │   │   ├── jobs/             # List, create, details, proposals
│   │   │   ├── proposals/        # Accept proposal & fund escrow
│   │   │   └── contracts/        # Contract listing & escrow payout release
│   │   ├── auth/
│   │   │   ├── login/            # Login with 1-click demo accounts
│   │   │   └── signup/           # Multi-role signup (Client, Freelancer, Both)
│   │   ├── jobs/
│   │   │   ├── page.tsx          # Browsing with live filtering & search
│   │   │   ├── create/page.tsx   # Client project posting wizard
│   │   │   └── [id]/page.tsx     # Job detail, proposal submission & review
│   │   ├── contracts/
│   │   │   ├── page.tsx          # Active contracts & escrow balances
│   │   │   └── [id]/page.tsx     # Milestone verification & escrow release
│   │   ├── dashboard/            # Dynamic workspace adapting to active role
│   │   ├── globals.css           # Design tokens, gradients, and custom scrollbars
│   │   ├── layout.tsx            # Root layout with Providers, Navbar & Footer
│   │   └── page.tsx              # Landing page
│   │
│   ├── components/
│   │   ├── Navbar.tsx            # Sticky navigation with RoleSwitcher & notifications
│   │   ├── Footer.tsx            # Trust badges & footer links
│   │   ├── Providers.tsx         # NextAuth SessionProvider & RoleContext
│   │   ├── RoleSwitcher.tsx      # Dual-role toggle pill component
│   │   ├── JobCard.tsx           # Reusable job card with client scorecard
│   │   └── ProposalCard.tsx      # Proposal card with bid breakdown & accept CTA
│   │
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── auth.ts               # NextAuth credential options
│   │   ├── utils.ts              # Styling & currency formatting helpers
│   │   └── mock-data.ts          # Seed & in-memory fallback store
│   │
│   └── types/
│       └── index.ts              # TypeScript interfaces mirroring Prisma models
│
├── .env.example                  # Environment configuration template
├── package.json                  # Scripts and dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript compiler options
```

---

## Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.18.0 or newer (tested on v20+ / v24)
- **npm** or **pnpm**
- **PostgreSQL**: Local instance, Docker container, or hosted database (Neon / Supabase)

### 2. Clone and Install

```bash
git clone https://github.com/sumithradevivenna7/Gigly.git
cd Gigly
npm install
```

### 3. Environment Variables Setup
Copy the template environment file:

```bash
cp .env.example .env
```

Configure your `.env` values:
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gigly_db?schema=public"

# NextAuth Secret & URL
NEXTAUTH_SECRET="your_secure_random_string_min_32_characters"
NEXTAUTH_URL="http://localhost:3000"

# Stripe Connect (Test Mode)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Real-time WebSockets
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
```

### 4. Database Initialization & Seeding

```bash
# Generate the Prisma Client
npx prisma generate

# Push the schema to your database (or run migrations)
npx prisma db push

# Seed the database with sample skills, users, jobs, and proposals
node prisma/seed.js
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts for Evaluation

You can use the 1-click login buttons on the [Login Page](http://localhost:3000/auth/login) or sign in manually with password `password123`:

| Role | Name | Email | Purpose |
|---|---|---|---|
| **Client** | Sarah Jenkins | `client@gigly.com` | Post jobs, review proposals, fund escrow |
| **Freelancer** | Alex Rivera | `freelancer@gigly.com` | Browse open jobs, submit proposals, track earnings |
| **Dual Role** | Elena Rostova | `both@gigly.com` | Test the **Role Switcher** between Client and Freelancer |

---

## Deployment Guide (Frontend & Backend)

### Option 1: Deploying to Vercel (Recommended for Next.js)

1. **Database Setup (Backend)**:
   - Create a free serverless PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
   - Copy the connection string (with pooled connection mode enabled).

2. **Deploy on Vercel**:
   - Push your code to GitHub.
   - Import the repository in [Vercel](https://vercel.com/new).
   - Set the build command to:
     ```bash
     prisma generate && next build
     ```
   - Add the Environment Variables:
     - `DATABASE_URL`: Your hosted PostgreSQL connection URL
     - `NEXTAUTH_SECRET`: A secure 32+ character random string
     - `NEXTAUTH_URL`: Your Vercel production domain (`https://your-gigly-app.vercel.app`)
     - `STRIPE_SECRET_KEY` & `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe test keys
   - Click **Deploy**.

3. **Run Production Migrations**:
   Once deployed, run migrations against your production database:
   ```bash
   npx prisma migrate deploy
   ```

---

### Option 2: Full-Stack Docker / Self-Hosted Deployment (Railway / Render / VPS)

You can containerize the application for any cloud provider:

```dockerfile
# Production Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
```

---

## License

This project is licensed under the MIT License.
