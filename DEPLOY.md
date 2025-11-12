# Deploy to GitHub Pages - Step by Step Guide

## Option 1: Using GitHub Website (Easiest)

### Step 1: Create GitHub Repository
1. Go to https://github.com and sign in (or create an account)
2. Click the "+" icon in the top right → "New repository"
3. Name it (e.g., "pong-game")
4. Make it **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Push Your Code
After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under "Source", select **"main"** branch
5. Select **"/ (root)"** folder
6. Click **Save**
7. Wait 1-2 minutes for deployment

### Step 4: Access Your Game
Your game will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

---

## Option 2: Using GitHub CLI (Faster)

If you have GitHub CLI installed, you can use:

```bash
gh repo create pong-game --public --source=. --remote=origin --push
gh repo view --web
```

Then enable Pages in Settings → Pages → select "main" branch.

---

## Troubleshooting

- **404 Error**: Wait a few minutes after enabling Pages, it takes time to deploy
- **Repository not found**: Make sure the repository name matches exactly
- **Authentication error**: You may need to set up a Personal Access Token or SSH key

