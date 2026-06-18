/* ============================================================
   theme.js — dark/light toggle persisted in localStorage.
   Dark is the default (matching <html class="dark">).
   ============================================================ */

const STORAGE_KEY = "portfolio-theme";
const root = document.documentElement;

function apply(theme) {
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  // keep the browser UI colour in sync
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a12" : "#fafafa");
}

function current() {
  return root.classList.contains("light") ? "light" : "dark";
}

export function initTheme() {
  // 1) saved preference  2) OS preference  3) dark default
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersLight =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;
  apply(saved || (prefersLight ? "light" : "dark"));

  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    apply(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
}
