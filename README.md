# Mohammed Shakarneh — Portfolio

A modern, trilingual (English / Russian / Arabic) single-page developer portfolio.
Vanilla HTML, CSS & JavaScript — no frameworks, no build step.

## Features
- 🌗 Dark / light theme (saved in `localStorage`, follows OS preference)
- 🌍 EN / RU / AR language switcher with full **RTL** support for Arabic
- ✨ Custom cursor, scroll progress bar, typewriter, reveal-on-scroll, parallax blobs, animated skill bars, glassmorphism cards
- ♿ Accessible: skip link, ARIA labels, keyboard nav, focus styles, `prefers-reduced-motion`
- 📱 Mobile-first responsive design
- 🔍 SEO meta tags + Open Graph

## Project structure
```
index.html            ← markup with data-i18n hooks
css/styles.css        ← @imports all the modular CSS files
js/main.js            ← ES-module entry point (imports every module)
data/content.json     ← all text in 3 languages
assets/favicon.svg    ← "MS" favicon
```

## Local preview
The site uses ES modules + `fetch()`, so it must be served over **HTTP**
(opening `index.html` directly with `file://` will not load the content).

```bash
# from the project folder, pick one:
python -m http.server 8000
# or
npx serve
```
Then open <http://localhost:8000>.

## Deploy to GitHub Pages
1. Push these files to a repository (e.g. `Shakarneh.github.io` or any repo).
2. In **Settings → Pages**, set the source to the `main` branch, root folder.
3. The site goes live at your GitHub Pages URL. All paths are relative, so no extra config is needed.

## Editing content
All visible text lives in `data/content.json` under `en` / `ru` / `ar`.
Project links, icons and years (language-independent) live in `PROJECT_META`
inside `js/i18n.js`.
