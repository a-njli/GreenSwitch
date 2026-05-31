# GreenSwitch — Complete Study Guide

Everything you need to **understand**, **explain**, and **defend** this project in interviews and conversations.

**Read first:** [TECHNICAL.md](./TECHNICAL.md) — full architecture and code map  
**Practice:** Run the app locally while reading each section

---

## Part 1 — 30-second pitch (memorize this)

> "GreenSwitch is a full-stack sustainability web app I built. Users describe disposable products they use — like plastic bottles or coffee cups — and the app recommends eco-friendly alternatives with carbon savings, prices, and shop links to Amazon, Target, and green stores. It has a carbon calculator, product browser, side-by-side compare, and saved favorites. I built the frontend with Next.js and React, the backend with FastAPI and Python, and deployed it free on Vercel and Render. I optionally added Google Gemini for friendly eco tips — one simple API call."

---

## Part 2 — Explain every feature (user + technical)

### 🔍 Find a swap

| Question | Answer |
|----------|--------|
| **What does the user see?** | Search box, example chips, results with match %, carbon saved, shop buttons |
| **What happens on submit?** | Frontend POSTs query to `/api/v1/swap`, backend scores products, returns top 3 |
| **How does matching work?** | Keyword tokenization — query words matched against product name, description, materials, keywords |
| **Key files** | `SwapFinder.tsx`, `SwapResults.tsx`, `search_service.py` |
| **Demo query** | "plastic water bottles" → stainless steel bottle, ~10 kg CO₂ saved |

### 🛍️ Explore (browse)

| Question | Answer |
|----------|--------|
| **What does the user see?** | Category tabs, cards showing disposable product + greener swap + shop links |
| **What happens?** | GET `/api/v1/products?category=kitchen` filters catalog |
| **Key files** | `ProductBrowser.tsx`, `catalog.py`, `routes.py` |

### 🌍 Your impact (calculator)

| Question | Answer |
|----------|--------|
| **What does the user see?** | Product dropdown, monthly usage slider, yearly CO₂ + savings + "trees" equivalent |
| **Formula** | `yearly = carbon_per_unit × uses_per_month × 12` |
| **Key files** | `CarbonCalculator.tsx`, `carbon_service.py` |

### ⚖️ Compare

| Question | Answer |
|----------|--------|
| **What does the user see?** | Two columns — current vs eco — with carbon, price, green score |
| **What happens?** | POST `/api/v1/compare` with two product IDs |
| **Key files** | `ComparePanel.tsx`, `compare_products()` in `search_service.py` |

### ☆ Favorites

| Question | Answer |
|----------|--------|
| **Where stored?** | Browser `localStorage` — key `greenswitch_favorites` |
| **Why not database?** | No login needed; simpler; good for portfolio scope |
| **Key files** | `favorites.ts`, `FavoritesBar.tsx`, `SwapResults.tsx` |

### 🛒 Shop links

| Question | Answer |
|----------|--------|
| **Where do links come from?** | Hardcoded in `catalog.py` per eco product — Amazon, Target, eco stores |
| **Why search URLs?** | Real links without managing affiliate/product APIs |
| **Key file** | `ShopLinks.tsx`, `catalog.py` → `shop_links[]` |

### 💬 Green living tips (optional)

| Question | Answer |
|----------|--------|
| **Requires AI?** | No — app works fully without it |
| **What AI does** | One Gemini call → 2-sentence friendly tip |
| **Key file** | `ai_service.py` |

---

## Part 3 — Tech stack Q&A (why each choice)

### "Why Next.js?"
- React framework with file-based routing, fast refresh, easy Vercel deploy
- Used for: pages, components, client-side state
- File: `frontend/app/page.tsx`

### "Why FastAPI?"
- Python REST API with automatic validation (Pydantic) and docs at `/docs`
- Faster to build than Flask for typed APIs
- File: `backend/app/main.py`

### "Why not a database?"
- Only 16 products — static catalog in a Python file is enough
- No user accounts — localStorage for favorites
- Easier to explain in interviews at junior level
- **If they push:** "At scale I'd add PostgreSQL for products and user data"

### "Why TypeScript on frontend?"
- Catches type errors at build time
- `lib/api.ts` defines interfaces matching backend JSON

### "Why Tailwind CSS?"
- Utility classes — style in JSX without separate CSS files
- Responsive design with `md:`, `lg:` prefixes

### "Why keyword search instead of AI?"
- Explainable, fast, no API cost, no hallucinations
- AI only for optional tips — honest scope for learning project

### "Why Vercel + Render?"
- Both free tiers, GitHub integration, industry-standard for Next.js + Python APIs

### "What is CORS?"
- Browser security — backend must allow your frontend URL in `CORS_ORIGINS`
- Without it: "Failed to fetch" in production

### "What is Pydantic?"
- Validates JSON automatically — wrong types return 422 error
- File: `schemas.py`

---

## Part 4 — Code walkthrough (study in this order)

| Day | Read this file | Learn |
|-----|----------------|-------|
| 1 | `frontend/app/page.tsx` | Tab UI, component composition |
| 1 | `frontend/lib/api.ts` | How frontend talks to backend |
| 2 | `backend/app/api/routes.py` | Every API endpoint |
| 2 | `backend/app/models/schemas.py` | Data shapes |
| 3 | `backend/app/services/search_service.py` | **Most important** — search algorithm |
| 3 | `backend/app/data/catalog.py` | Product data structure |
| 4 | `backend/app/services/carbon_service.py` | Calculator math |
| 4 | `frontend/lib/favorites.ts` | localStorage hook |
| 5 | `backend/app/main.py` | CORS, app setup |
| 5 | `frontend/next.config.ts` | API proxy for local dev |
| 6 | `backend/app/services/ai_service.py` | Optional Gemini |
| 6 | Open `localhost:8000/docs` | Test every endpoint manually |

---

## Part 5 — Interview questions & model answers

### General

**Q: Tell me about GreenSwitch.**  
→ Use the 30-second pitch (Part 1).

**Q: What was the hardest part?**  
→ "Connecting frontend to backend and handling CORS in production. Locally I used Next.js rewrites to proxy API calls. On Vercel I set NEXT_PUBLIC_API_URL to Render and configured CORS on the backend."

**Q: What would you improve?**  
→ "Add a real database, user accounts, more products, and maybe price scraping. Maybe mobile-responsive PWA."

**Q: Did you work alone?**  
→ "Yes, full-stack — I built frontend, backend, data, and deployment."

### Frontend

**Q: How does state work in React here?**  
→ "`useState` in page.tsx for active tab and search results. Child components receive props or call callbacks like `onResult`. Favorites use a custom hook with `useState` + `useEffect` syncing to localStorage."

**Q: What is a React hook?**  
→ "Reusable logic — `useFavorites()` wraps localStorage read/write so any component can save items."

**Q: What happens when user clicks Find swaps?**  
→ "SwapFinder calls `fetchSwap()` → POST to `/api/v1/swap` → sets result state → SwapResults re-renders with recommendations."

### Backend

**Q: Walk me through a swap request.**  
→ "POST `/api/v1/swap` → routes.py validates body → find_swaps() tokenizes query → scores each disposable product → picks best eco alt → returns JSON with recommendations and carbon saved."

**Q: How do you validate input?**  
→ "Pydantic models — empty query returns 400 from routes.py; invalid product_id in carbon calc returns 404."

**Q: Where is business logic vs routes?**  
→ "Routes are thin — one line calling a service. Logic lives in `services/` folder."

### Deployment

**Q: How is it deployed?**  
→ "GitHub → Vercel hosts Next.js frontend, Render hosts FastAPI in Docker. Env vars connect them."

**Q: What env variables matter?**  
→ "`NEXT_PUBLIC_API_URL` on Vercel, `CORS_ORIGINS` and optional `GEMINI_API_KEY` on Render."

---

## Part 6 — Free learning resources

### Must-read (official docs)

| Topic | Resource |
|-------|----------|
| React basics | [react.dev/learn](https://react.dev/learn) |
| Next.js | [nextjs.org/learn](https://nextjs.org/learn) |
| TypeScript | [typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| FastAPI | [fastapi.tiangolo.com/tutorial](https://fastapi.tiangolo.com/tutorial/) |
| Tailwind | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| Python | [docs.python.org/3/tutorial](https://docs.python.org/3/tutorial/) |
| Git | [learngitbranching.js.org](https://learngitbranching.js.org/) |
| HTTP/REST | [developer.mozilla.org/en-US/docs/Web/HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) |

### Video (YouTube search terms)

- "Next.js 15 tutorial for beginners"
- "FastAPI crash course"
- "React useState useEffect explained"
- "What is REST API"
- "Tailwind CSS tutorial"
- "Deploy Next.js to Vercel"
- "CORS explained simply"

### Free courses

| Platform | Course |
|----------|--------|
| [freeCodeCamp](https://www.freecodecamp.org) | Responsive Web Design, JavaScript |
| [Scrimba](https://scrimba.com) | React course (free tier) |
| [Google](https://developers.google.com/edu/python) | Python class (if new to Python) |

### Practice while learning

1. Change one product name in `catalog.py` → see it in UI
2. Add a new example chip in `SwapFinder.tsx`
3. Call `/api/v1/swap` in `/docs` with different queries
4. Break CORS on purpose → fix it → understand why it matters
5. Add a 9th product with shop links

---

## Part 7 — Glossary (know every word)

| Term | Plain English |
|------|---------------|
| **Frontend** | What runs in the browser — UI users click |
| **Backend** | Server that processes requests and returns data |
| **API** | URLs the frontend calls, e.g. `/api/v1/swap` |
| **REST** | Style of API using GET/POST and JSON |
| **JSON** | Text format for data: `{ "name": "bottle" }` |
| **Component** | Reusable UI piece in React |
| **Props** | Data passed from parent to child component |
| **State** | Data that changes and updates the UI |
| **Hook** | React function like `useState`, `useEffect` |
| **fetch** | JavaScript function to call APIs |
| **async/await** | Wait for API response without freezing UI |
| **Tokenize** | Split text into individual words |
| **CORS** | Browser rule — server must allow your frontend domain |
| **Environment variable** | Secret/config outside code (API keys, URLs) |
| **Docker** | Package app so it runs same everywhere |
| **Deploy** | Put app on internet for others to use |
| **localStorage** | Browser storage that persists after refresh |
| **Pydantic** | Python library that validates data types |
| **Uvicorn** | Server program that runs FastAPI |

---

## Part 8 — Weekly study plan (6 weeks)

| Week | Focus | Goal |
|------|-------|------|
| **1** | Run app, click every feature | Explain app to a friend in 2 min |
| **2** | React + Next.js (Part 6 resources) | Understand `page.tsx` and components |
| **3** | FastAPI + Python services | Trace swap request end-to-end |
| **4** | search_service.py + catalog.py | Explain scoring algorithm on whiteboard |
| **5** | Deploy (DEPLOY.md) + CORS | Live demo URL on resume |
| **6** | Mock interviews (Part 5 Q&A) | Answer 10 questions without notes |

---

## Part 9 — Resume & portfolio checklist

- [ ] GitHub repo public: [github.com/a-njli/GreenSwitch](https://github.com/a-njli/GreenSwitch)
- [ ] README looks good on GitHub
- [ ] Deployed live URL (Vercel + Render)
- [ ] 2–3 resume bullets from [RESUME.md](./RESUME.md)
- [ ] Can demo: search → results → shop link → save favorite
- [ ] Can explain tech stack without reading notes

---

## Part 10 — Quick reference card (print this)

```
GREENSWITCH CHEAT SHEET
───────────────────────
Stack:     Next.js + React + TS + Tailwind | FastAPI + Python
Data:      catalog.py (16 products, shop links)
Search:    Tokenize → score → top 3 (search_service.py)
Favorites: localStorage (favorites.ts)
AI:        Optional Gemini tip (ai_service.py)
Deploy:    Vercel (frontend) + Render (backend)
Key API:   POST /api/v1/swap
Docs:      localhost:8000/docs

FILES TO KNOW COLD:
  page.tsx, api.ts, routes.py, search_service.py, catalog.py
```

---

You've built something real. Read the code, run it, break it, fix it — that's how you own every interview question.

**Next:** [TECHNICAL.md](./TECHNICAL.md) · [LEARNING_PATH.md](./LEARNING_PATH.md) · [RESUME.md](./RESUME.md) · [DEPLOY.md](../DEPLOY.md)
