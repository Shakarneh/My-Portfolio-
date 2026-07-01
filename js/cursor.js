/* ============================================================
   cursor.js — drafting-table crosshair cursor.
   The dot and the two hairlines are pinned to the pointer
   exactly each frame; the ring eases toward it with linear
   interpolation (factor 0.15) for a ~0.15s trailing delay.
   A mono readout beside the pointer reports live X/Y like a
   CAD status bar. Hover scaling/glow is CSS via a class;
   mousedown shrinks dot + ring for a click feel.
   Fine pointers only — skips touch and reduced-motion.
   ============================================================ */

const INTERACTIVE =
  'a, button, [role="button"], input, .card, .project-card, .contact-card, .skill-card, .tag, .lang-btn, .theme-toggle';
const RING_EASE = 0.15; // ringX += (mouseX - ringX) * 0.15
const COORD_OFFSET = 18; // readout distance from the pointer

export function initCursor() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduced) return; // CSS keeps every piece hidden

  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  // crosshair + readout are optional decorations — missing nodes are fine
  const lineX = document.getElementById("cursor-line-x");
  const lineY = document.getElementById("cursor-line-y");
  const coords = document.getElementById("cursor-coords");

  const root = document.documentElement;
  root.classList.add("has-cursor");

  let mouseX = innerWidth / 2;
  let mouseY = innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let hovering = false;
  let pressed = false;
  let lastCoordText = "";

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

    // dot + crosshair track the pointer exactly
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)${press}`;
    if (lineX) lineX.style.transform = `translateY(${mouseY}px)`;
    if (lineY) lineY.style.transform = `translateX(${mouseX}px)`;

    // ring trails behind with ease-out lerp
    ringX += (mouseX - ringX) * RING_EASE;
    ringY += (mouseY - ringY) * RING_EASE;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)${press}`;

    // live coordinate readout, flipped near the viewport edges
    if (coords) {
      const x = Math.round(mouseX);
      const y = Math.round(mouseY);
      const text = `X:${x} Y:${y}`;
      if (text !== lastCoordText) {
        coords.textContent = text;
        lastCoordText = text;
      }
      const flipX = mouseX > innerWidth - 110;
      const flipY = mouseY > innerHeight - 40;
      const ox = flipX ? -COORD_OFFSET : COORD_OFFSET;
      const oy = flipY ? -COORD_OFFSET : COORD_OFFSET;
      coords.style.transform =
        `translate(${mouseX + ox}px, ${mouseY + oy}px)` +
        `${flipX ? " translateX(-100%)" : ""}${flipY ? " translateY(-100%)" : ""}`;
    }

    requestAnimationFrame(loop);
  }
  loop();

  // fade out when the pointer leaves the window
  const pieces = [dot, ring, lineX, lineY, coords].filter(Boolean);
  document.addEventListener("mouseleave", () => {
    pieces.forEach((el) => (el.style.opacity = "0"));
  });
  document.addEventListener("mouseenter", () => {
    pieces.forEach((el) => (el.style.opacity = ""));
  });
}
