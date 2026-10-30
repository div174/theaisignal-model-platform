# OneAtlas — AI Model Discovery, Comparison & Playground Platform

> **TheAISignal Internship — Task 1: Combined Assessment**  
> Integrated solution combining the **Model Comparison & Cost Estimator** assessment and the **AI Model Playground** assignment into one production-grade full-stack platform.

Inspired by **OpenRouter**, **OneAtlas**, and **Models.dev**, this platform delivers a unified developer experience to explore, compare technical specifications and token costs, and interactively test frontier AI models in real time.

---

## 🚀 Live Demo & Repository

- **Repository**: [github.com/theaisignal-internship/theaisignal-model-platform](https://github.com)
- **Live Deployment**: Ready for 1-click deployment on [Vercel](https://vercel.com)

---

## ✨ Features Overview

### 1. Model Discovery (`/models`)
- **Comprehensive Catalog**: Browse models with lab badges, architecture descriptions, context window limits, and token pricing.
- **Search & Filters**: Search models by name, ID, provider, or keyword; filter by AI Lab (OpenAI, Anthropic, DeepSeek, Meta, Google, Mistral, Qwen) and capabilities (Reasoning, Tool calling, Vision, Structured JSON, Open weights).
- **Dual View Modes**: Switch seamlessly between a high-density **Table View** (inspired by the OneAtlas UI) and a modern **Cards Grid View**.
- **Sorting**: Order catalog by maximum context window, lowest price, intelligence benchmarks, or alphabetical name.
- **Quick Comparison**: Add up to 4 models directly into the comparison tray or launch in the playground.

### 2. Side-by-Side Model Comparison (`/compare`)
- **Multi-Model Selector (`components/model-selector.tsx`)**:
  - Searchable combobox supporting 2 to 4 models concurrently.
  - Model chips with lab logos and quick remove (`✕`) controls.
  - Enforces the 4-model limit with user feedback and displays a clean empty state when fewer than 2 models are selected.
- **Comparison Matrix Grid (`components/comparison-table.tsx`)**:
  - **Model Header**: Name, AI Lab badge (`components/brand-logo.tsx`), release date, and quick remove button.
  - **Context Window**: Nicely formatted tokens (e.g., `128K`, `1M`, `1.05M`).
  - **Modalities**: Input modalities (`text`, `image`, `audio`, `pdf`) with clear icons and output modalities.
  - **Token Pricing**: Prompt and completion pricing per 1M tokens with automatic **emerald badges** highlighting the lowest input and output rates.
  - **Benchmark Scores**: Visual progress indicators for Intelligence, Coding, and Agentic scores.
  - **Active Providers**: Hosting provider chips (`OpenRouter`, `Azure`, `AWS Bedrock`, `GCP Vertex`, `Together`, `Groq`).
  - **Mobile Responsive**: Horizontal swipe/scroll on mobile with sticky column headers.

### 3. Interactive Monthly Cost Estimator (`components/cost-calculator.tsx`)
- **Default Workload**: `5,000,000` prompt tokens and `1,000,000` completion tokens per month.
- **Sliders & Number Inputs**: Live sliders and numerical inputs for prompt and completion volume.
- **Quick Workload Presets**: One-click toggles for `MVP (1M / 200K)`, `Standard (5M / 1M)`, and `RAG / Agents (25M / 5M)`.
- **Dynamic Formula**:
  $$\text{Monthly Cost} = \left(\frac{\text{Input Tokens}}{1{,}000{,}000} \times \text{Input Price}\right) + \left(\frac{\text{Output Tokens}}{1{,}000{,}000} \times \text{Output Price}\right)$$
- **Winning Column Badge**: Displays **"Lowest Bill / Best Value"** badge and dynamically calculates exact monthly savings vs. the next best model (e.g. *"Saves \$38/mo vs next best"*).
- **Zero Lag & Memoization**: Recalculates dynamically with `useMemo`, sanitizing negative inputs and safely handling missing rates.

### 4. Deep Linking & URL State Synchronization
- **URL Parameter Reflection**: Comparisons are encoded as `/compare?models=openai/gpt-6.1-terra,deepseek/deepseek-v4.1-flash-uncensored`.
- **Zero Full-Page Reloads**: Updates browser URL via `window.history.replaceState` and React transitions (`useTransition`).
- **Incognito & Refresh Resilience**: Restores selected models on page refresh or when opened in a new private tab.
- **Graceful Error Handling**: Automatically skips malformed or unknown model IDs without crashing the application.
- **One-Click Share Button**: Copies the exact comparison URL to clipboard with instant feedback toast.

### 5. Interactive AI Playground (`/playground`)
- **Direct Model Selection**: Select any AI model from the unified dataset.
- **Real AI Generation**: Connects to the server-side `/api/chat` route and executes live completions via OpenRouter.
- **Chat Interface (`components/chat-interface.tsx`)**:
  - Separate user and assistant bubbles.
  - Auto-scrolling, character counter, and starter prompt suggestions.
  - Keyboard shortcuts (`Enter` to send, `Shift+Enter` for newline).
  - Copy response to clipboard with confirmation indicator.
  - Shows request duration (latency in seconds) and token usage counters.
  - Loading animation with animated spinner.
  - Clear conversation button.
- **Secure Server-Side API**: Keeps `OPENROUTER_API_KEY` exclusively on the server. If the API key is not configured, provides a clear setup error without faking responses.

### 6. Usage History & Database Persistence (`/history`)
- **Prisma ORM**: Persists prompt, response, model ID, human-readable model name, input tokens, output tokens, total tokens, duration, and timestamps.
- **Search & Filter**: Filter past queries by model or full-text search across prompts and responses.
- **Inspection Modal**: View complete prompt, full generated AI markdown response, and token breakdown.
- **Management**: Delete individual logs or clear all history.

### 7. OneAtlas Dark & Light Theme System
- **Dark Mode**: Precision styling with `slate-950` (`#06090e`), `zinc-900` surfaces, and `emerald-400` accents matching the OneAtlas visual specification.
- **Light Mode**: Matching high-contrast clean theme with `slate-50` background, crisp white cards, and `emerald-600` accents.
- **Zero Hydration Flash**: Synchronized with `useSyncExternalStore` and an inline blocking script in `<head>` to prevent theme flashing on initial load.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Turbopack, Server & Client Components, Route Handlers |
| **Language** | TypeScript 5 (Strict) | Zero `any`, strongly typed shared interfaces in `lib/types.ts` |
| **UI & Styling** | React 19, Tailwind CSS v4 | OneAtlas dark theme, custom variants, responsive layouts |
| **Icons** | Lucide React | Clean, consistent icons across all widgets and cards |
| **Database** | Prisma ORM 6.19 | SQLite for development, PostgreSQL-ready for production |
| **AI Integration** | OpenRouter API | OpenAI-compatible server-side completions with error recovery |
| **Deployment** | Vercel | Seamless edge deployment with automated Prisma client generation |

---

## 📁 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Server-side OpenRouter AI completion & DB logging
│   │   └── history/
│   │       └── route.ts          # DB query & delete endpoints for RequestHistory
│   ├── compare/
│   │   └── page.tsx              # Model comparison, URL state sync & Cost Calculator
│   ├── history/
│   │   └── page.tsx              # Request history page
│   ├── models/
│   │   └── page.tsx              # Model discovery catalog (Table & Cards views)
│   ├── playground/
│   │   └── page.tsx              # Interactive AI chat sandbox
│   ├── globals.css               # Tailwind v4 theme, custom dark variant, base styling
│   ├── layout.tsx                # Root layout with ThemeProvider, Navbar, and Footer
│   └── page.tsx                  # OneAtlas dashboard, metrics widgets & model preview
├── components/
│   ├── brand-logo.tsx            # Multi-provider SVG logos (OpenAI, Anthropic, DeepSeek, etc.)
│   ├── chat-interface.tsx        # Interactive chat sandbox with starter prompts & latency
│   ├── comparison-table.tsx      # Side-by-side specs, benchmarks & lowest-price highlights
│   ├── cost-calculator.tsx       # Real-time token cost estimator with Best Value savings badge
│   ├── history-list.tsx          # History table, search filter, and detail inspection modal
│   ├── model-card.tsx            # Model card for catalog grid
│   ├── model-selector.tsx        # Searchable multi-model combobox (2–4 models)
│   ├── navbar.tsx                # Responsive navigation with theme toggle & mobile drawer
│   └── theme-toggle.tsx          # Sun/Moon theme switcher
├── lib/
│   ├── ai-provider.ts            # Secure OpenRouter client with timeouts & error handling
│   ├── data.ts                   # Centralized model dataset, helper formatters
│   ├── db.ts                     # Prisma client singleton instance
│   ├── theme-provider.tsx        # Theme context with useSyncExternalStore
│   └── types.ts                  # 100% strict TypeScript types & interfaces
├── prisma/
│   ├── schema.prisma             # RequestHistory database schema
│   └── dev.db                    # Local SQLite database (git-ignored)
├── .env.example                  # Environment variable blueprint
├── package.json                  # Dependencies & build scripts
├── README.md                     # Architecture & technical documentation
└── SETUP.md                      # Local development & design strategy guide
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```bash
# Database connection (SQLite for local development, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# OpenRouter API Key for live AI playground completions
# Obtain at https://openrouter.ai/keys
OPENROUTER_API_KEY="your-openrouter-api-key-here"

# Optional OpenRouter attribution headers
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENROUTER_SITE_NAME="OneAtlas AI Model Platform"
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+` or `v11+`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/theaisignal-model-platform.git
cd theaisignal-model-platform

# Install dependencies
npm install

# Initialize local SQLite database
npx prisma db push

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In **Environment Variables**, add:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key.
   - `DATABASE_URL`: A persistent PostgreSQL database URL (e.g., from [Neon](https://neon.tech), [Supabase](https://supabase.com), or Vercel Postgres).
4. For PostgreSQL deployments, update `datasource db` in `prisma/schema.prisma` from `provider = "sqlite"` to `provider = "postgresql"` and run `npx prisma db push`.
5. Click **Deploy**. Vercel will run `postinstall: "prisma generate"` and `next build` automatically.

---

## 🧠 Technical Decisions & Interview Guide

### 1. State Management & URL Synchronization
- **URL as Single Source of Truth**: For `/compare`, the selected model IDs are synchronized with URL query params (`?models=...`). This guarantees that shared links, page refreshes, and browser bookmarks all restore the exact comparison matrix.
- **Zero Full-Page Reloads**: Used `window.history.replaceState` coupled with React 19's `useTransition` to update the URL cleanly without triggering full-page navigations.
- **Client/Server Boundary**: Heavy data manipulation and formula calculations are kept in memoized Client Components (`useMemo`), while pages take advantage of App Router pre-rendering and `<Suspense>` wrappers.

### 2. Math & Formula Correctness in the Cost Estimator
- Cost calculation uses the exact specified formula:
  $$\text{Total} = \left(\frac{\text{Input Tokens}}{1{,}000{,}000} \times \text{Input Rate}\right) + \left(\frac{\text{Output Tokens}}{1{,}000{,}000} \times \text{Output Rate}\right)$$
- The **"Lowest Bill / Best Value"** badge compares total monthly bills (not just the input token rate) and computes savings by subtracting the winning model's bill from the runner-up model's bill.

### 3. Resilience & Error Handling
- Invalid or unknown model IDs passed via query parameters are gracefully filtered out without throwing runtime errors.
- If `OPENROUTER_API_KEY` is missing, the backend returns a descriptive `502` error indicating the missing variable and setup instructions, rather than silently fabricating mock answers.
- Database writes are wrapped in safe try/catch blocks so an intermittent database issue will never block the user from seeing their AI response.

---

## 📄 License

MIT License. Developed for TheAISignal Internship Assessment.
