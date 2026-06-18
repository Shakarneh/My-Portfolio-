/* ============================================================
   parallax.js — shift hero blobs on scroll for depth.
   Uses [data-parallax="<factor>"] and a rAF-throttled handler.
   Disabled when the user prefers reduced motion.
   ============================================================ */

export function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const items = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!items.length) return;

  let ticking = false;

  function update() {
    const y = window.scrollY;
    items.forEach((item) => {
      const factor = parseFloat(item.dataset.parallax) || 0.2;
      item.style.transform = `translate3d(0, ${y * factor}px, 0)`;
    });
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );

  update();
}
