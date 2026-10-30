# Local Setup & Technical Architecture Guide (SETUP.md)

This document provides setup instructions and an in-depth explanation of the **State Management Strategy** and **Responsive Design Strategy** for the **OneAtlas AI Model Platform**.

---

## 1. Quickstart Guide (Running Locally)

### Prerequisites
- **Node.js**: v20.x or v24.x
- **npm**: v10.x or v11.x
- **Git**

### Step-by-Step Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/theaisignal-model-platform.git
   cd theaisignal-model-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and optionally provide your OpenRouter API key:
   ```env
   DATABASE_URL="file:./dev.db"
   OPENROUTER_API_KEY="sk-or-v1-..."
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   OPENROUTER_SITE_NAME="OneAtlas AI Model Platform"
   ```
   *(Note: The platform runs fully locally without an API key; however, live AI responses in `/playground` require a valid OpenRouter key).*

4. **Initialize Local Database**:
   Push the Prisma schema to create the local SQLite `dev.db` database:
   ```bash
   npx prisma db push
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Run Verification Commands**:
   ```bash
   # Lint check
   npm run lint

   # Production build verification
   npm run build
   ```

---

## 2. State Management Strategy

The application adopts a **hybrid state management strategy** designed for high responsiveness, zero hydration flicker, and deep linkability:

### A. URL Query Parameters as Single Source of Truth (`/compare`)
- **Deep Linking**: The model comparison view state is encoded directly into URL query parameters (e.g. `/compare?models=openai/gpt-6.1-terra,deepseek/deepseek-v4.1-flash-uncensored`).
- **Zero Full-Page Reloads**: Whenever a user adds or removes a model, `window.history.replaceState` coupled with React 19's `useTransition` updates the browser URL immediately without unmounting components or triggering full-page network requests.
- **Malformed ID Resilience**: A dedicated parsing function (`parseModelIdsFromParams`) validates every model ID from the query string against the centralized catalog in `lib/data.ts`. Invalid or unknown IDs are discarded without throwing exceptions or crashing the UI.

### B. Reactive External Store for Theme Synchronization (`ThemeProvider`)
- Instead of using synchronous `setState` within a mount effect (which causes cascading re-renders and hydration mismatch warnings in React 19), the platform uses React 19's official `useSyncExternalStore` hook.
- It subscribes to browser `storage` events and reads from `localStorage` synchronously.
- An inline blocking script in the `<head>` of `app/layout.tsx` checks the theme and injects the `.dark` class before the first paint, guaranteeing zero theme flash.

### C. Memoized Real-Time Calculations (`CostCalculator`)
- High-frequency slider inputs (0 to 50M tokens) can trigger hundreds of calculations per second.
- We utilize `useMemo` for the mathematical formula:
  $$\text{Monthly Cost} = \left(\frac{\text{Input Tokens}}{1{,}000{,}000} \times \text{Input Price}\right) + \left(\frac{\text{Output Tokens}}{1{,}000{,}000} \times \text{Output Price}\right)$$
- The calculation dynamically ranks total bills across all compared models, flags the lowest monthly bill, and calculates the exact dollar difference against the second-lowest option (*"Saves \$X/mo vs next best"*).

### D. Server-Side Data Flow & Audit Logging
- Server Route Handler `app/api/chat/route.ts` acts as a secure reverse proxy:
  1. Validates payload structure and rejects empty prompts.
  2. Protects `OPENROUTER_API_KEY` from ever reaching the client bundle.
  3. Executes the inference request with an `AbortController` timeout (45s).
  4. Stores the prompt, response, model metadata, latency, and token metrics into the Prisma database (`RequestHistory`).
  5. The History UI (`/history`) queries `/api/history` with optional full-text search and model filtering.

---

## 3. Responsive Design Strategy

The application was built following a **mobile-first, content-preserving responsive design strategy**:

### A. OneAtlas Design System Aesthetics
- **Dark Palette**: `slate-950` (`#06090e`) background, `zinc-900` elevated surfaces, `zinc-800` borders, and `emerald-400` accents.
- **Light Palette**: `slate-50` background, clean white cards, `slate-200` subtle borders, and `emerald-600` accents.
- **Modern Typography**: Clear font hierarchy with monospace styling for technical metrics, token counts, and currency.

### B. Responsive Comparison Matrix (`components/comparison-table.tsx`)
- **Desktop**: Renders full side-by-side columns (up to 4 models) with spacious typography and progress benchmark bars.
- **Tablet & Mobile**:
  - The comparison matrix enables horizontal swipe/scroll (`overflow-x-auto`) with a minimum width of `700px`.
  - The row label column uses `sticky left-0 z-10` with matching background colors, ensuring the metric being viewed (Context, Modalities, Price, Benchmarks, Providers) remains visible at all times during horizontal scrolling.
  - Cell widths are constrained (`min-w-[200px]`, `max-w-[280px]`) so layouts never break or truncate unexpectedly.

### C. Responsive Cost Estimator (`components/cost-calculator.tsx`)
- Sliders and number inputs transition from a side-by-side 2-column grid on desktop to a stacked 1-column layout on mobile.
- Token amount slider thumbs and touch hit targets are sized for smooth touch interaction on mobile devices.
- Workload preset chips wrap cleanly without horizontal overflow.

### D. Navigation & Mobile Drawer (`components/navbar.tsx`)
- On screens narrower than `768px` (`md:`), desktop navigation links collapse into an accessible slide-down drawer with large tap targets.
- The `ThemeToggle` and search badge remain directly accessible in the top header on all screen sizes.

---

## 4. Production Deployment to Vercel

1. Push code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete AI model discovery, comparison, cost estimator and playground platform"
   git push origin main
   ```
2. Import repository in the [Vercel Dashboard](https://vercel.com/new).
3. Set environment variables:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key.
   - `DATABASE_URL`: Your production database URL (e.g. Neon PostgreSQL, Supabase, or Vercel Postgres).
4. For PostgreSQL on Vercel, change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`.
5. Deploy! Vercel runs `npm run postinstall` (generating Prisma client) and `npm run build` automatically.

