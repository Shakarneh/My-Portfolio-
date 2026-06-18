/* ============================================================
   typewriter.js — cycles through the hero roles, typing and
   deleting each one. Re-seeds itself when the language changes.
   ============================================================ */

export function initTypewriter(initialRoles = []) {
  const target = document.getElementById("typewriter");
  if (!target) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let roles = initialRoles.slice();
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let timer = null;

  const TYPE = 90;
  const DELETE = 45;
  const HOLD = 1400;
  const BETWEEN = 350;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function tick() {
    if (!roles.length) return;
    const word = roles[roleIndex % roles.length];

    if (!deleting) {
      charIndex++;
      target.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        timer = setTimeout(tick, HOLD);
        return;
      }
      timer = setTimeout(tick, TYPE);
    } else {
      charIndex--;
      target.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex++;
        timer = setTimeout(tick, BETWEEN);
        return;
      }
      timer = setTimeout(tick, DELETE);
    }
  }

  function start(newRoles) {
    clear();
    roles = newRoles.slice();
    roleIndex = 0;
    charIndex = 0;
    deleting = false;

    if (reduced) {
      // no animation — just show the first role
      target.textContent = roles[0] || "";
      return;
    }
    tick();
  }

  start(roles);

  // restart with the new language's roles
  document.addEventListener("languagechange", (e) => {
    if (e.detail && e.detail.roles) start(e.detail.roles);
  });
}
