# Encourt - Webflow Custom Code

Custom JavaScript for the Encourt website, designed to be linked from Webflow via GitHub.

## Setup

### 1. GitHub

1. Create a new repository (e.g. `webflow-encourt` or `encourt`).
2. Push this folder to the repo (e.g. `main` branch).
3. Your raw script URL will be:
   ```
   https://raw.githubusercontent.com/[your-username]/[your-repo]/main/encourt.js
   ```
   Replace `[your-username]` and `[your-repo]` with your GitHub username and repo name. Use `master` instead of `main` if that’s your default branch.

### 2. Webflow

1. Open the Encourt site in Webflow.
2. Go to **Project Settings** → **Custom Code**.
3. In **Head Code** or **Footer Code**, add:
   ```html
   <script src="https://raw.githubusercontent.com/[your-username]/[your-repo]/main/encourt.js"></script>
   ```
4. Publish the site so the script loads on your published pages.

## File structure

```
encourt.js    # Single JS file – edit this in Cursor, push to GitHub
README.md     # This file
```

## Workflow

- Edit `encourt.js` in Cursor.
- Commit and push to GitHub.
- Webflow loads the script from the raw URL, so updates go live after you push and republish (or on next publish).

## Adding features

1. Add logic in `encourt.js` (e.g. new functions).
2. Call them from `initEncourt()`.
3. If you need libraries (e.g. GSAP), add their CDN URLs to `loadDependencies()` and load them before calling your code in `init()`.

## Browser support

- Modern browsers (ES6+).
- Works with Webflow’s published sites.
