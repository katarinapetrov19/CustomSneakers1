# GitHub Pages Deployment Guide

## Quick Setup Steps

### Option 1: Using GitHub Desktop (Recommended for beginners)

1. **Download GitHub Desktop**
   - Go to https://desktop.github.com
   - Download and install GitHub Desktop
   - Sign in with your GitHub account

2. **Add Your Repository**
   - Open GitHub Desktop
   - Click "File" → "Add Local Repository"
   - Click "Choose..." and navigate to your `CustomSneakers` folder
   - Click "Add Repository"

3. **Publish to GitHub**
   - Click "Publish repository" button
   - Make sure "Keep this code private" is UNCHECKED (must be public for free GitHub Pages)
   - Click "Publish repository"

4. **Enable GitHub Pages**
   - Go to your repository on GitHub.com
   - Click "Settings" tab
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

5. **Your site will be live at:**
   - `https://[your-username].github.io/CustomSneakers/`

---

### Option 2: Using Command Line (Terminal)

1. **Open Terminal** and navigate to your project folder:
   ```bash
   cd /Users/katarina.petrov/Desktop/Me/CustomSneakers
   ```

2. **Initialize Git repository:**
   ```bash
   git init
   ```

3. **Add all files:**
   ```bash
   git add .
   ```

4. **Commit files:**
   ```bash
   git commit -m "Initial commit - Portfolio website"
   ```

5. **Add your GitHub repository as remote:**
   ```bash
   git remote add origin https://github.com/[your-username]/CustomSneakers.git
   ```
   (Replace `[your-username]` with your actual GitHub username)

6. **Push to GitHub:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

7. **Enable GitHub Pages:**
   - Go to your repository on GitHub.com
   - Click "Settings" → "Pages"
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

---

## After Deployment

- Your site will be available at: `https://[your-username].github.io/CustomSneakers/`
- It may take a few minutes for the site to go live
- Any changes you push to GitHub will automatically update the live site

## Updating Your Site

### Using GitHub Desktop:
1. Make changes to your files
2. In GitHub Desktop, you'll see your changes listed
3. Write a commit message (e.g., "Update gallery images")
4. Click "Commit to main"
5. Click "Push origin" to upload changes

### Using Command Line:
```bash
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

- **404 Error**: Make sure your repository is set to "Public" (not private)
- **Site not loading**: Wait 5-10 minutes after enabling Pages, then check again
- **Images not showing**: Make sure all image paths use relative paths (e.g., `img/photo.jpg`)

