/* ============================================================
   main.js — entry point.
   Initializes every module. i18n runs first because it renders
   the dynamic content (skills / projects / timeline) that the
   reveal and skill-bar observers need to attach to.
   ============================================================ */

import { initTheme } from "./theme.js";
import { initI18n } from "./i18n.js";
import { initNavbar } from "./navbar.js";
import { initCursor } from "./cursor.js";
import { initTypewriter } from "./typewriter.js";
import { initReveal } from "./reveal.js";
import { initSkills } from "./skills.js";
import { initParallax } from "./parallax.js";
import { initScrollProgress } from "./scroll-progress.js";

async function boot() {
  // Theme can apply immediately (no DOM rendering needed).
  initTheme();

  // i18n loads content.json and renders dynamic sections.
  let roles = [];
  try {
    const result = await initI18n();
    roles = result.roles;
  } catch (err) {
    console.error("Failed to load content:", err);
  }

  // Modules that depend on the now-rendered DOM.
  initNavbar();
  initCursor();
  initTypewriter(roles);
  initReveal();
  initSkills();
  initParallax();
  initScrollProgress();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
