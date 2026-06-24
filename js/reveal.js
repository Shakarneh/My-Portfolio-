/* ============================================================
   reveal.js — fade/slide elements in as they enter the viewport.
   Re-scans the DOM on language change (cards are re-rendered).
   ============================================================ */

let observer = null;

function ensureObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // reveal once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  return observer;
}

const STAGGER = 0.1; // seconds between consecutive siblings
const MAX_STEPS = 8; // cap so long grids don't lag far behind

function observeAll() {
  const obs = ensureObserver();
  document.querySelectorAll(".reveal:not(.visible)").forEach((node) => {
    // Stagger: delay each element by its position among reveal siblings,
    // so cards/items in a grid cascade in 0.1s apart.
    if (!node.dataset.staggered) {
      const parent = node.parentElement;
      if (parent) {
        const sibs = Array.from(parent.children).filter((c) =>
          c.classList.contains("reveal")
        );
        const idx = sibs.indexOf(node);
        if (sibs.length > 1 && idx > 0) {
          node.style.transitionDelay = Math.min(idx, MAX_STEPS) * STAGGER + "s";
        }
      }
      node.dataset.staggered = "1";
    }
    obs.observe(node);
  });
}

export function initReveal() {
  // Fallback: if IntersectionObserver is missing, just show everything.
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((n) => n.classList.add("visible"));
    return;
  }

  observeAll();

  // newly rendered elements (after a language switch) need re-observing
  document.addEventListener("languagechange", () => {
    // wait a frame so the new DOM exists
    requestAnimationFrame(observeAll);
  });
}
