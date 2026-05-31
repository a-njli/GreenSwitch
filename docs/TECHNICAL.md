# GreenSwitch — Technical Documentation

Complete reference for what the project is, how it works, every technology used, and why.

**Repo:** [github.com/a-njli/GreenSwitch](https://github.com/a-njli/GreenSwitch)

---

## 1. Project overview

### What is GreenSwitch?

GreenSwitch is a **full-stack web application** that helps people replace disposable everyday products with eco-friendly alternatives. Users can search by plain language, browse a product catalog, calculate carbon impact, compare options side-by-side, save favorites, and click through to shop on real e-commerce sites (Amazon, Target, EarthHero, etc.).

### Problem it solves

Many people want to live more sustainably but don't know:
- Which disposable items hurt the environment most
- What reusable alternatives exist
- How much carbon they could save
- Where to actually buy greener products

GreenSwitch answers all four in one simple interface.

### Architecture (high level)

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (User)                                              │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND — Next.js 15 (port 3000)                          │
│  React components, Tailwind CSS, localStorage favorites      │
│  Calls backend via fetch() → /api/v1/*                       │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND — FastAPI (port 8000)                              │
│  REST API, business logic, product catalog                   │
│  Optional: Google Gemini for one-line eco tips               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  DATA — In-memory Python catalog (catalog.py)               │
│  8 disposable products + 8 eco alternatives + shop links     │
└─────────────────────────────────────────────────────────────┘
```

**Production deployment:**
- Frontend → **Vercel** (free)
- Backend → **Render** (free, Docker)
- Source → **GitHub**

---

## 2. Tech stack — complete breakdown

### Frontend

| Technology | Version | Where used | Why we use it |
|------------|---------|------------|---------------|
| **Next.js** | 15 | `frontend/app/`, `frontend/components/` | React framework with routing, fast dev, easy deploy on Vercel |
| **React** | 19 | All `.tsx` components | UI building blocks, state (`useState`), effects (`useEffect`) |
| **TypeScript** | 5.7 | Entire frontend | Type safety — catches bugs before runtime; interfaces in `lib/api.ts` |
| **Tailwind CSS** | 3.4 | `globals.css`, all components | Utility-first styling — fast, responsive, consistent design |
| **Recharts** | 2.15 | `SimpleStats.tsx` | Simple bar chart for category stats (optional UI) |
| **localStorage** | Browser API | `lib/favorites.ts` | Save favorites without a database or login |

### Backend

| Technology | Version | Where used | Why we use it |
|------------|---------|------------|---------------|
| **Python** | 3.12+ | All backend code | Readable, great for APIs and data logic |
| **FastAPI** | 0.115 | `main.py`, `routes.py` | Modern async REST API, auto OpenAPI docs at `/docs` |
| **Uvicorn** | 0.34 | Runs the server | ASGI server that serves FastAPI |
| **Pydantic** | 2.10 | `schemas.py` | Validates request/response JSON automatically |
| **pydantic-settings** | 2.7 | `config.py` | Loads `.env` into typed settings |
| **google-generativeai** | 0.8 | `ai_service.py` | Optional Gemini API for eco tips (one call) |

### DevOps & tools

| Technology | Where used | Why |
|------------|------------|-----|
| **Git / GitHub** | Version control | Portfolio, collaboration, deploy hooks |
| **Docker** | `backend/Dockerfile` | Same environment locally and on Render |
| **Render** | Backend hosting | Free tier, Docker support |
| **Vercel** | Frontend hosting | Free tier, built for Next.js |
| **npm** | `frontend/package.json` | Frontend dependency management |
| **pip** | `backend/requirements.txt` | Backend dependency management |

### What we deliberately did NOT use (and why)

| Not used | Why |
|----------|-----|
| Database (PostgreSQL, MongoDB) | Catalog is small and static — Python file is enough for a portfolio project |
| Redis | No caching needed at this scale |
| Authentication | No user accounts — favorites use localStorage |
| Complex AI (RAG, vector DB, agents) | Keyword search is explainable; one Gemini call for tips is optional and simple |

---

## 3. Project structure (every important file)

```
GreenSwitch/
├── frontend/                          # Next.js app (what users see)
│   ├── app/
│   │   ├── page.tsx                   # Main page — tabs, hero, layout
│   │   ├── layout.tsx                 # HTML shell, page title/metadata
│   │   └── globals.css                # Tailwind + custom styles
│   ├── components/
│   │   ├── SwapFinder.tsx             # Search input + submit
│   │   ├── SwapResults.tsx            # Recommendations + shop links + tips
│   │   ├── ProductBrowser.tsx         # Browse by category
│   │   ├── CarbonCalculator.tsx       # Impact slider + results
│   │   ├── ComparePanel.tsx           # Side-by-side compare
│   │   ├── FavoritesBar.tsx           # Saved items bar
│   │   ├── ShopLinks.tsx              # Amazon/Target/etc. link buttons
│   │   └── SimpleStats.tsx            # Session search stats
│   ├── lib/
│   │   ├── api.ts                     # All backend fetch() calls + TypeScript types
│   │   └── favorites.ts               # localStorage hook
│   ├── next.config.ts                 # API proxy rewrites for local dev
│   └── package.json                   # Frontend dependencies
│
├── backend/                           # FastAPI app (API + logic)
│   ├── app/
│   │   ├── main.py                    # App entry, CORS, health check
│   │   ├── api/routes.py              # All HTTP endpoints
│   │   ├── models/schemas.py          # Pydantic data models
│   │   ├── data/catalog.py            # Product + shop link data
│   │   ├── core/config.py             # Environment variables
│   │   └── services/
│   │       ├── search_service.py      # Keyword matching + swaps
│   │       ├── carbon_service.py      # Carbon math
│   │       ├── stats_service.py       # In-memory session stats
│   │       └── ai_service.py          # Optional Gemini tips
│   ├── Dockerfile                     # Container for Render
│   └── requirements.txt               # Python dependencies
│
├── docs/                              # Documentation
├── DEPLOY.md                          # Vercel + Render guide
├── GITHUB_PUSH.md                     # GitHub setup
└── .env.example                       # Environment template (no secrets)
```

---

## 4. Features — detailed breakdown

### Feature 1: Find a swap (keyword search)

**User flow:**
1. User types e.g. "plastic water bottles"
2. Clicks "Show me alternatives"
3. Sees up to 3 recommendations with carbon saved, price diff, shop links

**Frontend files:** `SwapFinder.tsx` → calls `fetchSwap()` in `api.ts` → `SwapResults.tsx`

**Backend flow:**
```
POST /api/v1/swap  { "query": "plastic water bottles" }
    → routes.py → swap_products()
    → search_service.find_swaps()
        → _tokenize(query)           # split into words, remove stop words
        → _score_product()           # score each disposable product
        → pick best eco alternative
        → build SwapRecommendation[]
    → JSON response
```

**Scoring algorithm** (`search_service.py`):
- Tokenize query: `"plastic water bottles"` → `{plastic, water, bottles}`
- Remove stop words: `the`, `i`, `use`, `daily`, etc.
- For each product, build searchable text from: name + description + materials + keywords
- **Exact token match:** +20 points per matching word
- **Partial match:** +10 if query word appears inside product word
- Cap score at 100 → shown as "match %"
- Return top 3 by score

**Interview answer:** *"I implemented keyword matching with tokenization and scoring — no ML needed. Each product has keywords like 'water', 'bottle', 'gym'. User query tokens are matched against product metadata and ranked by score."*

---

### Feature 2: Explore (browse by category)

**User flow:** User picks category tab (Kitchen, Personal care, etc.) → sees disposable products with their eco swap and shop links.

**Frontend:** `ProductBrowser.tsx`  
**Backend:** `GET /api/v1/products?category=kitchen` → `list_by_category()`

**Data:** 5 categories — `kitchen`, `bathroom`, `cleaning`, `personal_care`, `office`

---

### Feature 3: Your impact (carbon calculator)

**User flow:** Pick a product → slide "how often per month" → see yearly CO₂ and potential savings.

**Frontend:** `CarbonCalculator.tsx`  
**Backend:** `POST /api/v1/carbon/calculate`

**Math** (`carbon_service.py`):
```
monthly_carbon = product.carbon_footprint_kg × uses_per_month
yearly_carbon  = monthly_carbon × 12
yearly_savings = (disposable_monthly - eco_monthly) × 12
trees_equiv    = yearly_savings / 21   # ~21 kg CO2 absorbed per tree per year
```

**Example:** Plastic bottles (12.5 kg/pack) × 30/month = 375 kg/month → 4500 kg/year.

---

### Feature 4: Compare (side-by-side)

**User flow:** Select disposable + eco alternative → see carbon, price, green score difference.

**Frontend:** `ComparePanel.tsx`  
**Backend:** `POST /api/v1/compare` → `compare_products()`

Returns: carbon saved per use, cost difference, optional payback estimate.

---

### Feature 5: Favorites (save for later)

**User flow:** Click "Save for later" on a recommendation → appears in top bar with Shop button.

**Storage:** Browser `localStorage` key `greenswitch_favorites`  
**File:** `frontend/lib/favorites.ts` — custom React hook `useFavorites()`

**Why localStorage:** No login needed; data stays on user's device; simple to implement.

---

### Feature 6: Shop links

**Data:** Each eco alternative in `catalog.py` has `shop_links: [{ store, url }, ...]`

**Stores:** Amazon, Target, EarthHero, Package Free, Etsy (search URLs)

**Frontend:** `ShopLinks.tsx` — renders styled buttons, opens in new tab (`target="_blank"`)

---

### Feature 7: Green living tips (optional AI)

**User flow:** Click "Get a green living tip" on a result.

**Backend:** `POST /api/v1/ai/tip` → `ai_service.py` → single Gemini API call  
**Model:** `gemini-2.5-flash` (configurable in `config.py`)  
**Requires:** `GEMINI_API_KEY` in `.env` — works without it (shows fallback message)

**Interview answer:** *"AI is optional — one prompt to Gemini for a friendly 2-sentence tip. The core app works entirely without AI using keyword search."*

---

### Feature 8: Session stats

**Backend:** `stats_service.py` — in-memory lists/counters (resets when server restarts)  
**Tracks:** recent searches, carbon calculated totals  
**Frontend:** `SimpleStats.tsx` — shows after user searches

---

## 5. API reference

Base URL local: `http://localhost:8000`  
Base URL production: your Render URL

| Method | Endpoint | Request body | Response |
|--------|----------|--------------|----------|
| GET | `/health` | — | `{ status, environment, ai_enabled, timestamp }` |
| GET | `/api/v1/products?category=kitchen` | — | `{ disposable[], eco_alternatives[], categories[] }` |
| POST | `/api/v1/swap` | `{ "query": "..." }` | `{ query, recommendations[], total_potential_carbon_saved_kg }` |
| POST | `/api/v1/carbon/calculate` | `{ "product_id": "disp-001", "uses_per_month": 30 }` | CarbonCalculateResponse |
| POST | `/api/v1/compare` | `{ "disposable_id", "eco_id" }` | CompareResponse |
| GET | `/api/v1/stats` | — | StatsSummary |
| POST | `/api/v1/ai/tip` | `{ "product_name": "..." }` | `{ tip, ai_enabled }` |

**Interactive docs:** `http://localhost:8000/docs` (Swagger UI — try every endpoint)

---

## 6. Data model

### Product (disposable)
```python
id, name, category, is_disposable, carbon_footprint_kg, price_usd,
description, materials[], keywords[]
```

### EcoAlternative
```python
id, replaces_product_id, name, carbon_footprint_kg, price_usd,
description, sustainability_score (0-100), materials[], why_better,
keywords[], shop_links[{ store, url }]
```

### Relationships
- Each eco alternative **replaces** one disposable (`replaces_product_id`)
- 8 disposable ↔ 8 eco (1:1 mapping in catalog)

---

## 7. Request flow diagrams

### Swap search (most important flow)

```
User types "plastic bottles"
        │
        ▼
SwapFinder.tsx  ──fetch POST /api/v1/swap──►  routes.py
        │                                              │
        │                                              ▼
        │                                    search_service.find_swaps()
        │                                              │
        │                                    tokenize → score → rank
        │                                              │
        ◄──────── JSON SwapResponse ───────────────────┘
        │
        ▼
SwapResults.tsx  (shows cards + ShopLinks + save button)
```

### Local dev proxy (why no CORS issues locally)

```
Browser → localhost:3000/api/v1/swap
              │
              ▼ (Next.js rewrite in next.config.ts)
         localhost:8000/api/v1/swap
```

Production: browser calls Vercel → Vercel rewrites to Render URL via `NEXT_PUBLIC_API_URL`.

---

## 8. Environment variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `GEMINI_API_KEY` | backend `.env` | Optional AI tips |
| `GEMINI_MODEL` | backend (default `gemini-2.5-flash`) | Which Gemini model |
| `CORS_ORIGINS` | backend `.env` | Allowed frontend URLs (comma-separated) |
| `ENVIRONMENT` | backend | `development` or `production` |
| `NEXT_PUBLIC_API_URL` | frontend Vercel | Render backend URL in production |

**Never commit `.env`** — only `.env.example`.

---

## 9. Security notes (for interviews)

- API keys in environment variables, not in code
- CORS restricts which frontends can call the API
- Shop links use `rel="noopener noreferrer"` on external links
- No user passwords or PII stored
- Pydantic validates all API input (rejects bad JSON)

---

## 10. How to extend the project

| Idea | Difficulty | What to learn |
|------|------------|---------------|
| Add more products | Easy | Edit `catalog.py` |
| User login + cloud favorites | Medium | Auth (Firebase, Clerk), database |
| PostgreSQL instead of catalog file | Medium | SQLAlchemy, migrations |
| Real product prices via API | Hard | External APIs, caching |
| Mobile app | Hard | React Native or Flutter |

---

## 11. Deployment architecture

```
GitHub (a-njli/GreenSwitch)
    │
    ├──► Vercel ──► greenswitch.vercel.app (Next.js)
    │         NEXT_PUBLIC_API_URL ──────────────┐
    │                                            │
    └──► Render ──► greenswitch-api.onrender.com (FastAPI Docker)
              CORS_ORIGINS = Vercel URL ◄───────┘
              GEMINI_API_KEY (optional)
```

See **DEPLOY.md** for step-by-step setup.

---

*Last updated for GreenSwitch v2 — full-stack sustainability app.*
