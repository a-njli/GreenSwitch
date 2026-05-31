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

### Important — correct Render settings

If Docker build fails, **double-check these exactly**:

| Setting | Value |
|---------|-------|
| **Root Directory** | *(leave blank — repo root)* |
| **Runtime** | **Docker** |
| **Dockerfile Path** | `backend/Dockerfile` |
| **Docker Build Context Directory** | `backend` |

**Common mistake:** Setting Root Directory to `backend` **and** Dockerfile Path to `backend/Dockerfile` — that breaks the build. Use one or the other:
- **Option A (recommended):** Root blank + Dockerfile `backend/Dockerfile` + Context `backend`
- **Option B:** Root `backend` + Dockerfile `Dockerfile` + Context `.`

Also fix GitHub access if you see *"we don't have access to your repo"*:
1. Render Dashboard → **Account Settings** → **GitHub** → configure access
2. Ensure **GreenSwitch** repo is allowed
3. Retry deploy

---

1. Go to [render.com](https://render.com) → sign up (GitHub login works).
2. Click **New +** → **Web Service**.
3. Connect your **GreenSwitch** GitHub repo.
4. Use the settings table above.
5. Plan: **Free**
6. **Environment variables** (Environment tab):

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
| Build failed / Exited status 1 | Check Dockerfile path + context (see Step 2 table). Push latest code. Use **Manual Deploy → Clear build cache & deploy** |
| "Don't have access to your repo" | Render → GitHub settings → grant access to **GreenSwitch** |
| Build OK but service crashes | App must use `$PORT` — fixed in latest Dockerfile |
| Health check failed | Open `/health` — ensure service is running |
| "Failed to fetch" on live site | Check `NEXT_PUBLIC_API_URL` on Vercel matches Render URL |
| CORS error in browser | Add your exact Vercel URL to `CORS_ORIGINS` on Render |
| API slow first load | Normal on Render free tier (cold start) |
| AI tips don't work | Add `GEMINI_API_KEY` on Render — optional feature |

### Option B — Native Python (no Docker)

If Docker keeps failing, create a new Web Service with:

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Runtime | **Python 3** |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

Same environment variables as above.

---

## Optional: deploy with Docker locally

```bash
docker compose up --build
```

API at http://localhost:8000 — run frontend separately with `npm run dev` in `frontend/`.
