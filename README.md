# Mohammed Shakarneh — Portfolio

🔗 **Live:** [my-portfolio.mohammedshak055.workers.dev)

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

index.html            ← markup with data-i18n hooks

css/styles.css        ← @imports all the modular CSS files

js/main.js            ← ES-module entry point (imports every module)

data/content.json     ← all text in 3 languages

assets/favicon.svg    ← "MS" favicon


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

## Deployment
Hosted on **Cloudflare Workers** — auto-deploys on every push to `main`.

## Editing content
All visible text lives in `data/content.json` under `en` / `ru` / `ar`.
Project links, icons and years (language-independent) live in `PROJECT_META`
inside `js/i18n.js`.
