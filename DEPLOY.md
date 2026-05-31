# Deploy GreenSwitch for Free

Deploy the **frontend on Vercel** (free) and the **backend on Render** (free). Total cost: **$0**.

```
GitHub repo
    ├── Vercel  →  https://your-app.vercel.app     (Next.js frontend)
    └── Render  →  https://your-api.onrender.com   (FastAPI backend)
```

---

## Step 1 — Push to GitHub

If not done yet, from the project folder:

```bash
git init
git add .
git commit -m "GreenSwitch: sustainable product swap app"
gh repo create GreenSwitch --public --source=. --remote=origin --push
```

Or create a repo manually at [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/GreenSwitch.git
git push -u origin main
```

---

## Step 2 — Deploy backend on Render (free)

1. Go to [render.com](https://render.com) → sign up (GitHub login works).
2. Click **New +** → **Web Service**.
3. Connect your **GreenSwitch** GitHub repo.
4. Settings:
   | Setting | Value |
   |---------|-------|
   | Name | `greenswitch-api` |
   | Root Directory | *(leave blank)* |
   | Runtime | **Docker** |
   | Dockerfile Path | `./backend/Dockerfile` |
   | Docker Context | `./backend` |
   | Plan | **Free** |
5. **Environment variables** (Environment tab):

   | Key | Value |
   |-----|-------|
   | `GEMINI_API_KEY` | your key from [Google AI Studio](https://aistudio.google.com/apikey) *(optional, for green living tips)* |
   | `ENVIRONMENT` | `production` |
   | `CORS_ORIGINS` | `https://YOUR-APP.vercel.app` *(update after Step 3)* |

6. Click **Create Web Service** — wait ~5 min for first deploy.
7. Copy your API URL, e.g. `https://greenswitch-api.onrender.com`
8. Test: open `https://greenswitch-api.onrender.com/health` — should show `"status":"ok"`.

> **Note:** Free Render services sleep after 15 min idle. First request after sleep takes ~30–60 seconds.

---

## Step 3 — Deploy frontend on Vercel (free)

1. Go to [vercel.com](https://vercel.com) → sign up with GitHub.
2. **Add New Project** → import your **GreenSwitch** repo.
3. Settings:
   | Setting | Value |
   |---------|-------|
   | Framework Preset | Next.js |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `.next` |
4. **Environment variables**:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://greenswitch-api.onrender.com` *(your Render URL, no trailing slash)* |

5. Click **Deploy**.
6. Copy your Vercel URL, e.g. `https://greenswitch.vercel.app`

---

## Step 4 — Connect frontend ↔ backend

1. **Render** → your API service → **Environment** → set:
   ```
   CORS_ORIGINS=https://greenswitch.vercel.app
   ```
   *(use your real Vercel URL)*

2. **Vercel** → Project → **Settings → Environment Variables** → confirm `NEXT_PUBLIC_API_URL` points to Render.

3. **Redeploy both** (Render auto-redeploys on env change; Vercel → Deployments → Redeploy).

4. Open your Vercel URL and test a search!

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Failed to fetch" on live site | Check `NEXT_PUBLIC_API_URL` on Vercel matches Render URL |
| CORS error in browser | Add your exact Vercel URL to `CORS_ORIGINS` on Render |
| API slow first load | Normal on Render free tier (cold start) |
| AI tips don't work | Add `GEMINI_API_KEY` on Render — optional feature |

---

## Optional: deploy with Docker locally

```bash
docker compose up --build
```

API at http://localhost:8000 — run frontend separately with `npm run dev` in `frontend/`.
