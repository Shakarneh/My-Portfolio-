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

function observeAll() {
  const obs = ensureObserver();
  document.querySelectorAll(".reveal:not(.visible)").forEach((node) => {
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
