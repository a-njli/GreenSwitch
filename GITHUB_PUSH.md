# Push to GitHub (a-njli/EcoSwap)

Everything is committed locally. Run these commands **in your Mac Terminal** (where you're logged into GitHub):

```bash
cd /Users/anjali.tiwari/Personal/EcoSwap

# Confirm remote points to your account
git remote set-url origin https://github.com/a-njli/EcoSwap.git

# Push (replaces old EcoSwap repo with this new version)
git push --force origin main
```

If GitHub asks you to sign in, use your **a-njli** account (browser or Personal Access Token).

### If push is rejected without force

Your repo already has old commits. The `--force` flag replaces them with this new project. That's expected.

### After push

Your code will be live at: **https://github.com/a-njli/EcoSwap**

Then deploy free using **[DEPLOY.md](DEPLOY.md)**:
1. **Render** → backend (`backend/Dockerfile`)
2. **Vercel** → frontend (root: `frontend/`)

### SSH alternative (if you use SSH keys)

```bash
git remote set-url origin git@github.com:a-njli/EcoSwap.git
git push --force origin main
```
