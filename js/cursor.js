/* ============================================================
   cursor.js — magnetic-dot cursor.
   A single dot eases toward the pointer. When hovering an
   interactive element it grows into a ring (CSS) and is gently
   pulled toward that element's centre — the "magnetic" feel.
   Only runs for fine pointers (skips touch devices).
   ============================================================ */

const INTERACTIVE = "a, button, .project-card, .contact-card, .tag, input, textarea";
const PULL = 0.32; // how strongly the dot is drawn to an element's centre
const EASE = 0.2; // follow smoothing (higher = snappier)

export function initCursor() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!fine) return; // CSS keeps the dot hidden on touch

  const dot = document.getElementById("cursor-dot");
  if (!dot) return;

  document.documentElement.classList.add("has-cursor");

  let mouseX = innerWidth / 2;
  let mouseY = innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;
  let magnetEl = null;

  document.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const el = e.target.closest(INTERACTIVE);
      if (el !== magnetEl) {
        magnetEl = el;
        document.documentElement.classList.toggle("cursor-hover", !!el);
      }
    },
    { passive: true }
  );

  function loop() {
    let targetX = mouseX;
    let targetY = mouseY;

    // pull toward the hovered element's centre
    if (magnetEl) {
      if (!magnetEl.isConnected) {
        // element was removed (e.g. language re-render)
        magnetEl = null;
        document.documentElement.classList.remove("cursor-hover");
      } else {
        const r = magnetEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        targetX = mouseX + (cx - mouseX) * PULL;
        targetY = mouseY + (cy - mouseY) * PULL;
      }
    }

    curX += (targetX - curX) * EASE;
    curY += (targetY - curY) * EASE;
    dot.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  // fade out when the pointer leaves the window
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "";
  });
}
