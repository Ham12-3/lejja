# Claude Code Prompts - Lejja Master Implementation Plan

These are the exact prompts I fed to [Claude Code](https://claude.ai/claude-code) to build Lejja from a blueprint into a functional AI-powered accounting platform. Run them in order or pick the phase you need.

---

## Phase 1: The "Real Data" Migration

_Removes all hardcoded mock data and connects PostgreSQL._

**Prompt:**

> "Act as a Senior Fullstack Engineer. Our goal is to move Lejja from mock data to a production database-first architecture.
>
> 1. **Purge Mocks:** Identify and delete all hardcoded arrays for ClientBooks, Transactions, and Anomalies in the frontend components.
> 2. **Dynamic Routing:** Create a dynamic route at `src/app/dashboard/clients/[id]/page.tsx` that fetches a specific ClientBook and its related Transactions/Anomalies using Prisma.
> 3. **Global Search:** Refactor the Search component to execute a Prisma `findMany` query against the database instead of filtering a local list.
> 4. **Live Pricing:** Update the Billing page to count the actual number of `ClientBook` records in the DB and calculate the Stripe total ($200 base + $25 per book over 8) in real-time.
> 5. **Navigation:** Ensure every 'Details' or 'View' button in the UI correctly links to the new dynamic `[id]` paths."

---

## Phase 2: The AI Forensic Engine

_Upgrades anomaly detection from simple math rules to Anthropic-powered reasoning._

**Prompt:**

> "We are upgrading our anomaly detection to be AI-driven.
>
> 1. **AI Integration:** Modify `src/lib/anomaly-detector/scan.ts` to fetch transaction history and send it to the Anthropic SDK (`claude-sonnet-4-6`).
> 2. **The Prompt:** Instruct the AI to act as a forensic auditor searching for complex patterns like split-purchase structuring, unusual vendor velocity, or duplicate entries with slight description variations.
> 3. **Structured Logic:** The AI must return a JSON object with `severity`, `confidence`, and a detailed `reasoning` string explaining the flag.
> 4. **Database Write:** Save these flags to the `AnomalyFlag` table, ensuring the `createdBy` field is strictly set to 'ai-anomalies' for our audit trail."

---

## Phase 3: Dynamic Ingestion (CSV & Codat)

_Allows users to add their own data instead of using test files._

**Prompt:**

> "Build the dynamic ingestion engine for Lejja.
>
> 1. **Client Addition:** Create a 'New Client' dialog that allows users to input a client name and industry.
> 2. **CSV Upload:** Implement a file upload handler using `papaparse`. It must map `date`, `description`, `amount`, and `type` from a CSV directly into our Prisma `Transaction` table.
> 3. **Codat Link:** Connect the `createCompany` flow in `/lib/codat` so users can link a real QuickBooks or Xero account.
> 4. **Validation:** Use Zod to ensure no duplicate transactions are created during the upload/sync process by checking the `reference` field."

---

## Phase 4: The 2026 Interactive Landing Page

_Builds the high-end marketing site with a premium tech aesthetic._

**Prompt:**

> "Build the Lejja landing page at `src/app/(marketing)/page.tsx` with a premium 2026 tech aesthetic.
>
> 1. **Global Theme:** Force a global high-contrast dark mode using `#121212` for backgrounds and our brand 'Trust Green' for all primary buttons and accents.
> 2. **Hero Code Editor:** Build a mock VS Code window component that types out real Lejja SDK code (e.g., `await lejja.categorize(tx)`) and shows a 'running mode' terminal below it that prints success logs.
> 3. **Sticky Scroll Section:** Create a two-column feature showcase. The left side ("GenAI will execute...") must be `sticky` and stay pinned while the right side scrolls.
> 4. **Pop-up Reveal:** As the user scrolls, the three feature cards on the right should 'pop' into view (opacity and scale transition) one by one using a simple CSS `sticky` and `intersection-observer` approach."

---

## Phase 5: Generating the Stress Test

_Generates fake business data to test the AI system._

**Prompt:**

> "Write a Python script `generate_lejja_data.py` that creates a 1,000-row business CSV.
>
> 1. Include 20 pairs of duplicate transactions.
> 2. Include 10 transactions over $10,000 that are perfectly round numbers.
> 3. Ensure 15% of transactions occur on weekends.
> 4. Create 'noisy' descriptions like 'Amazon \*TX92' vs 'Amazon.com' to test the AI's deduplication and categorization logic."

---

## Recommended Order

1. **Phase 1 + Phase 3 first** - Makes the app real with actual data flowing
2. **Phase 2 next** - Turns on the AI forensic engine once data is in the database
3. **Phase 4** - Build the marketing site
4. **Phase 5** - Generate stress test data to push the AI

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **AI:** Anthropic Claude SDK
- **Payments:** Stripe
- **Accounting Sync:** Codat API
- **Styling:** Tailwind CSS v4 + Framer Motion
- **UI:** Radix UI + shadcn components

---

Built with Claude Code by [Your Name]
