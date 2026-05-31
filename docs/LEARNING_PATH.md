# GreenSwitch — Complete Study Guide

> **Full guide:** See **[STUDY_GUIDE.md](./STUDY_GUIDE.md)** for features, interview Q&A, resources, and glossary.  
> **Technical deep-dive:** See **[TECHNICAL.md](./TECHNICAL.md)** for architecture and code map.

Study in this order. Each step builds on the last. **Run the app locally while you learn.**

---

## Week 1 — See it work

1. Run backend + frontend locally (see README).
2. Click through all 4 tabs — know what each feature does.
3. Open `http://localhost:8000/docs` — try API calls manually.

**Goal:** Explain what the app does in 30 seconds.

---

## Week 2 — Frontend basics

| Topic | Where in project | Learn |
|-------|------------------|-------|
| React components | `frontend/components/` | Props, state, `useState`, `useEffect` |
| Pages & routing | `frontend/app/page.tsx` | Next.js App Router basics |
| Styling | `frontend/app/globals.css`, Tailwind | Utility classes, responsive design |
| API calls | `frontend/lib/api.ts` | `fetch`, async/await, JSON |
| localStorage | `frontend/lib/favorites.ts` | Browser storage, hooks |

**Resources:** [React docs](https://react.dev/learn), [Next.js learn](https://nextjs.org/learn)

**Exercise:** Add a new example search chip to `SwapFinder.tsx`.

---

## Week 3 — Backend basics

| Topic | Where in project | Learn |
|-------|------------------|-------|
| REST API | `backend/app/api/routes.py` | GET vs POST, endpoints |
| Data models | `backend/app/models/schemas.py` | Pydantic, validation |
| Business logic | `backend/app/services/` | Separating routes from logic |
| Product data | `backend/app/data/catalog.py` | Static data, relationships |
| Config | `backend/app/core/config.py` | Environment variables, `.env` |

**Resources:** [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/)

**Exercise:** Add a 9th product to the catalog with shop links.

---

## Week 4 — How search works

| Topic | Where | Learn |
|-------|-------|-------|
| Keyword search | `search_service.py` | Tokenization, scoring, ranking |
| Carbon math | `carbon_service.py` | Simple calculations |
| Compare logic | `search_service.py` → `compare_products` | Data lookup |

**Exercise:** Explain aloud: "User types X → backend does Y → returns Z."

---

## Week 5 — Deployment & Git

| Topic | File | Learn |
|-------|------|-------|
| Git workflow | whole repo | commit, push, branches |
| Vercel | DEPLOY.md | Frontend hosting, env vars |
| Render | DEPLOY.md | Backend hosting, Docker |
| CORS | `main.py`, DEPLOY.md | Why browser blocks cross-origin requests |

**Exercise:** Deploy yourself following DEPLOY.md step by step.

---

## Week 6 — Optional AI feature

| Topic | Where | Learn |
|-------|-------|-------|
| Gemini API | `ai_service.py` | One API call, prompts, error handling |
| When to use AI | — | Tips feature only — not required for core app |

**Resources:** [Google AI Studio](https://aistudio.google.com/)

---

## Glossary (know these words)

| Term | Plain English |
|------|---------------|
| **API** | Backend URLs the frontend calls for data |
| **REST** | Standard way to design APIs (GET, POST) |
| **JSON** | Data format `{ "key": "value" }` |
| **Component** | Reusable UI piece in React |
| **State** | Data that changes in the UI (e.g. search text) |
| **Hook** | React function like `useState` |
| **CORS** | Browser security — backend must allow your frontend URL |
| **Deploy** | Put your app on the internet |
| **Env variable** | Secret/config stored outside code (API keys, URLs) |

---

## Practice interview questions

1. What does GreenSwitch do?
2. Why FastAPI? Why Next.js?
3. How does search work without AI?
4. How do shop links get to the user?
5. What happens when you click "Find swaps"?
6. How did you deploy it?
7. What would you add next? *(e.g. user accounts, more products, mobile app)*

---

You've got this. Read the code, change one small thing, run it, repeat.
