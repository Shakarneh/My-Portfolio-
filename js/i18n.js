/* ============================================================
   i18n.js — language switching (EN / RU / AR) + dynamic
   rendering of skills, projects and timeline from content.json.

   - Static text uses [data-i18n="section.key"].
   - [data-i18n-attr="content"] sets an attribute instead of textContent.
   - Project metadata (icons / links / year) is language-independent,
     so it lives here as a constant rather than in content.json.
   ============================================================ */

const STORAGE_KEY = "portfolio-lang";
const SUPPORTED = ["en", "ru", "ar"];
const RTL_LANGS = ["ar"];

let data = null; // full content.json
let lang = "en"; // active language

/* ---- Language-independent project metadata (order matches content.json) ---- */
const PROJECT_META = [
  {
    icon: "fa-solid fa-note-sticky",
    year: "2025–Present",
    featured: true,
    tech: ["Python", "PyWebView", "SQLite", "Quill.js", "HTML/CSS/JS", "Inno Setup"],
    github: "https://github.com/Shakarneh/My-Notes",
    demo: "",
  },
  {
    icon: "fa-solid fa-robot",
    year: "2026",
    featured: false,
    tech: ["PHP", "MySQL", "JavaScript", "CSS", "HTML"],
    github: "https://github.com/Shakarneh/AI-Website---Artificial-Intelligence",
    demo: "https://shak-artificial-intelligence.infinityfreeapp.com",
  },
  {
    icon: "fa-solid fa-utensils",
    year: "2025–Present",
    featured: false,
    tech: ["HTML", "CSS", "JavaScript", "PHP"],
    github: "https://github.com/Shakarneh/berezka-restaurant",
    demo: "https://shakarneh.github.io/berezka-restaurant/",
  },
  {
    icon: "fa-solid fa-chart-bar",
    year: "2026",
    featured: false,
    tech: ["Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter"],
    github: "https://github.com/Shakarneh/covid-analysis",
    demo: "",
  },
  {
    icon: "fa-solid fa-database",
    year: "2026",
    featured: false,
    tech: ["MySQL", "MariaDB", "SQL", "phpMyAdmin"],
    github: "https://github.com/Shakarneh/online-store-analytics",
    demo: "",
  },
  {
    icon: "fa-solid fa-cart-shopping",
    year: "2026",
    featured: false,
    tech: ["Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter"],
    github: "https://github.com/Shakarneh/supermarket-sales-analysis",
    demo: "",
  },
  {
    icon: "fa-solid fa-code",
    year: "2024–2025",
    featured: false,
    tech: ["Java", "log4j2", "MySQL", "JDBC", "SAX/DOM XML", "RegEx"],
    github: "https://github.com/Shakarneh/java-university-labs",
    demo: "",
  },
];

/* ---- Helpers ---- */
function pick(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ---- Apply static translations ---- */
function applyStatic(dict) {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = pick(dict, node.getAttribute("data-i18n"));
    if (value == null || typeof value !== "string") return;
    const attr = node.getAttribute("data-i18n-attr");
    if (attr) node.setAttribute(attr, value);
    else node.textContent = value;
  });
  // document title + lang/dir handled in setLanguage
  if (dict.meta && dict.meta.title) document.title = dict.meta.title;
}

/* ---- Render skills ---- */
function renderSkills(dict) {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;
  grid.innerHTML = "";
  dict.skills.items.forEach((s, i) => {
    const wrap = el("div", "skill reveal");
    wrap.dataset.delay = String((i % 5) + 1);
    wrap.innerHTML = `
      <div class="skill-head">
        <span class="skill-name">${escapeHtml(s.name)}</span>
        <span class="skill-pct">${s.level}%</span>
      </div>
      <div class="skill-track">
        <span class="skill-fill" data-level="${s.level}"></span>
      </div>`;
    grid.appendChild(wrap);
  });
}

/* ---- Render projects ---- */
function renderProjects(dict) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const labels = dict.projects;

  dict.projects.items.forEach((p, i) => {
    const meta = PROJECT_META[i] || {};
    const card = el("article", "project-card reveal");
    if (meta.featured) card.classList.add("featured");

    const tags = (meta.tech || [])
      .map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`)
      .join("");

    const highlight = p.highlight
      ? `<p class="project-highlight"><i class="fa-solid fa-star"></i><span>${escapeHtml(
          p.highlight
        )}</span></p>`
      : "";

    const featuredBadge = meta.featured
      ? `<span class="badge"><i class="fa-solid fa-star"></i>${escapeHtml(
          labels.featured_badge
        )}</span>`
      : `<span class="project-year">${escapeHtml(meta.year || "")}</span>`;

    const demoBtn = meta.demo
      ? `<a class="btn btn-primary btn-sm" href="${meta.demo}" target="_blank" rel="noopener">
           <i class="fa-solid fa-arrow-up-right-from-square"></i>${escapeHtml(labels.btn_demo)}
         </a>`
      : "";

    card.innerHTML = `
      <div class="project-top">
        <span class="project-icon"><i class="${meta.icon || "fa-solid fa-folder"}"></i></span>
        ${featuredBadge}
      </div>
      <h3 class="project-title">${escapeHtml(p.title)}</h3>
      ${meta.featured ? `<span class="project-year">${escapeHtml(meta.year || "")}</span>` : ""}
      <p class="project-desc">${escapeHtml(p.description)}</p>
      ${highlight}
      <div class="project-tags">${tags}</div>
      <div class="project-actions">
        <a class="btn btn-ghost btn-sm" href="${meta.github}" target="_blank" rel="noopener">
          <i class="fa-brands fa-github"></i>${escapeHtml(labels.btn_code)}
        </a>
        ${demoBtn}
      </div>`;
    grid.appendChild(card);
  });
}

/* ---- Render timeline ---- */
function renderTimeline(dict) {
  const list = document.getElementById("timeline");
  if (!list) return;
  list.innerHTML = "";
  dict.journey.items.forEach((item) => {
    const li = el("li", "timeline-item reveal");
    li.innerHTML = `
      <span class="timeline-period">${escapeHtml(item.period)}</span>
      <h3 class="timeline-role">${escapeHtml(item.role)}</h3>
      ${item.place ? `<p class="timeline-place">${escapeHtml(item.place)}</p>` : ""}
      <p class="timeline-text">${escapeHtml(item.text)}</p>`;
    list.appendChild(li);
  });
}

/* ---- Switch language ---- */
function setLanguage(next, { rerender = true } = {}) {
  if (!SUPPORTED.includes(next)) next = "en";
  lang = next;
  const dict = data[next];
  const isRtl = RTL_LANGS.includes(next);

  // <html> attributes
  const html = document.documentElement;
  html.setAttribute("lang", next);
  html.setAttribute("dir", isRtl ? "rtl" : "ltr");

  applyStatic(dict);
  if (rerender) {
    renderSkills(dict);
    renderProjects(dict);
    renderTimeline(dict);
  }

  // active state on buttons
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === next);
  });

  localStorage.setItem(STORAGE_KEY, next);

  // notify other modules (typewriter, reveal, skills) to re-init
  document.dispatchEvent(
    new CustomEvent("languagechange", { detail: { lang: next, roles: dict.hero.roles } })
  );
}

/* ---- Public init ---- */
export async function initI18n() {
  const res = await fetch("data/content.json");
  data = await res.json();

  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = SUPPORTED.includes(saved) ? saved : "en";

  setLanguage(initial);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });

  // expose current roles for the typewriter's first run
  return { roles: data[initial].hero.roles, lang: initial };
}
