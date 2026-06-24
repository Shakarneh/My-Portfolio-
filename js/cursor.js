/* ============================================================
   cursor.js — two-part cursor.
   The dot is pinned to the pointer exactly each frame; the ring
   eases toward it with linear interpolation (factor 0.15) for a
   ~0.15s trailing delay. Hover scaling/glow is handled in CSS via
   a class; mousedown shrinks both for a click feel.
   Fine pointers only — skips touch and reduced-motion.
   ============================================================ */

const INTERACTIVE =
  'a, button, [role="button"], input, .card, .project-card, .contact-card, .skill-card, .tag, .lang-btn, .theme-toggle';
const RING_EASE = 0.15; // ringX += (mouseX - ringX) * 0.15

export function initCursor() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduced) return; // CSS keeps both elements hidden

  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  const root = document.documentElement;
  root.classList.add("has-cursor");

  let mouseX = innerWidth / 2;
  let mouseY = innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let hovering = false;
  let pressed = false;

  document.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const isInteractive = !!(e.target.closest && e.target.closest(INTERACTIVE));
      if (isInteractive !== hovering) {
        hovering = isInteractive;
        root.classList.toggle("cursor-hover", isInteractive);
      }
    },
    { passive: true }
  );

  // shrink slightly on press for a tactile click feel
  document.addEventListener("mousedown", () => { pressed = true; }, { passive: true });
  document.addEventListener("mouseup", () => { pressed = false; }, { passive: true });

  function loop() {
    const press = pressed ? " scale(0.85)" : "";

    // dot tracks the pointer exactly
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)${press}`;

    // ring trails behind with ease-out lerp
    ringX += (mouseX - ringX) * RING_EASE;
    ringY += (mouseY - ringY) * RING_EASE;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)${press}`;

    requestAnimationFrame(loop);
  }
  loop();

  // fade out when the pointer leaves the window
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "";
    ring.style.opacity = "";
  });
}
