# GreenSwitch — Sustainable Product Swap App

A beginner-friendly full-stack app that helps users find eco-friendly alternatives to disposable products, calculate carbon impact, and compare options side-by-side.

**Stack:** Next.js 15 + FastAPI + Tailwind CSS + optional Gemini AI tips

## Features

| Feature | What it does |
|---------|--------------|
| **Find swap** | Keyword search matches your query to products in the catalog |
| **Browse** | Filter 8 disposable products by category (kitchen, office, etc.) |
| **Carbon calculator** | Estimate monthly/yearly CO₂ based on how often you use a product |
| **Compare** | Side-by-side disposable vs eco alternative with savings |
| **Favorites** | Save swaps to browser localStorage |
| **AI tips** | Optional one-line Gemini tip (if API key is set) |

## Quick start

### Prerequisites
- Python 3.12+
- Node.js 20+

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### Optional: AI tips
Add your Gemini key to `.env`:
```
GEMINI_API_KEY=your_key_here
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/products` | Product catalog |
| POST | `/api/v1/swap` | Find eco swaps by keyword |
| POST | `/api/v1/carbon/calculate` | Carbon impact calculator |
| POST | `/api/v1/compare` | Compare two products |
| GET | `/api/v1/stats` | Session stats |
| POST | `/api/v1/ai/tip` | Optional AI eco tip |

## Deploy for free

See **[DEPLOY.md](DEPLOY.md)** — Vercel (frontend) + Render (backend), $0/month.

## Resume & learning

- **[docs/RESUME.md](docs/RESUME.md)** — resume bullets and interview pitch
- **[docs/LEARNING_PATH.md](docs/LEARNING_PATH.md)** — 6-week study plan

## Project structure

```
GreenSwitch/
├── backend/app/
│   ├── api/routes.py          # REST endpoints
│   ├── data/catalog.py        # Product data
│   ├── services/
│   │   ├── search_service.py  # Keyword matching
│   │   ├── carbon_service.py  # Carbon calculator
│   │   ├── stats_service.py   # In-memory stats
│   │   └── ai_service.py      # Optional Gemini tips
│   └── models/schemas.py
└── frontend/
    ├── app/page.tsx           # Tabbed UI
    └── components/            # SwapFinder, Calculator, etc.
```

## Interview pitch

> "GreenSwitch is a full-stack sustainability app I built with Next.js and FastAPI. Users search for disposable products using keyword matching, browse a product catalog by category, calculate their carbon footprint, and compare eco alternatives. Favorites are saved in localStorage. I optionally integrated Gemini for personalized eco tips — one simple API call, not a complex AI pipeline."

## What I learned

- Building REST APIs with FastAPI and Pydantic validation
- React state management and tabbed UI with Next.js
- Keyword search algorithms (tokenization + scoring)
- Carbon footprint math and data visualization with Recharts
- localStorage for client-side persistence
- Optional third-party API integration (Gemini)
