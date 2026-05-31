# Push GreenSwitch to GitHub

This is a **new project** — it will **not** replace your existing [EcoSwap](https://github.com/a-njli/EcoSwap) repo.

## Step 1 — Create a new repo on GitHub

1. Go to [github.com/new](https://github.com/new) while logged in as **a-njli**
2. Repository name: **`GreenSwitch`**
3. Description: *Find greener everyday products — swaps, shop links, carbon calculator*
4. Public → **Create repository** (do **not** add README — we already have one)

## Step 2 — Push from your Mac Terminal

```bash
cd /Users/anjali.tiwari/Personal/EcoSwap

git remote set-url origin https://github.com/a-njli/GreenSwitch.git

git push -u origin main
```

Sign in as **a-njli** if prompted. No `--force` needed — this is a brand-new repo.

## Step 3 — Verify

Open **https://github.com/a-njli/GreenSwitch** — your code should be there.

## Deploy (free)

Follow **[DEPLOY.md](DEPLOY.md)** — use service names like `greenswitch-api` on Render and `greenswitch.vercel.app` on Vercel.

## SSH alternative

```bash
git remote set-url origin git@github.com:a-njli/GreenSwitch.git
git push -u origin main
```
