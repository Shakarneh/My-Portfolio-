/* ============================================================
   skills.js — animate skill bars from 0% to their target width
   when the skills section scrolls into view.
   ============================================================ */

let observer = null;

function ensureObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fill = entry.target;
        const level = Number(fill.dataset.level) || 0;
        // next frame so the 0 → level transition actually animates
        requestAnimationFrame(() => {
          fill.style.width = level + "%";
        });
        observer.unobserve(fill);
      });
    },
    { threshold: 0.4 }
  );
  return observer;
}

function observeFills() {
  const obs = ensureObserver();
  document.querySelectorAll(".skill-fill").forEach((fill) => {
    fill.style.width = "0%";
    obs.observe(fill);
  });
}

export function initSkills() {
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".skill-fill")
      .forEach((f) => (f.style.width = (f.dataset.level || 0) + "%"));
    return;
  }

  observeFills();

  // skill bars are re-rendered on language change
  document.addEventListener("languagechange", () => {
    requestAnimationFrame(observeFills);
  });
}
