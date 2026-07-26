/* ============================================================
   i18n.js — English / Russian / Arabic

   Markup contract:
     [data-i18n="section.key"]        → textContent
     [data-i18n-html="section.key"]   → innerHTML (copy containing <em>/<b>/<br>)
     [data-i18n-attr="aria-label"]    → sets that attribute instead

   Arabic flips <html dir> to rtl; the stylesheet handles the rest.
   Choice is remembered in localStorage.
   ============================================================ */

const STORAGE_KEY = 'portfolio-lang';
const SUPPORTED = ['en', 'ru', 'ar'];
const RTL = ['ar'];

let dict = null;   // full content.json
let lang = 'en';

const pick = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

function apply(d) {
  document.querySelectorAll('[data-i18n]').forEach(node => {
    const v = pick(d, node.dataset.i18n);
    if (typeof v !== 'string') return;
    const attr = node.dataset.i18nAttr;
    if (attr) node.setAttribute(attr, v);
    else node.textContent = v;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(node => {
    const v = pick(d, node.dataset.i18nHtml);
    if (typeof v === 'string') node.innerHTML = v;
  });

  if (d.meta?.title) document.title = d.meta.title;
}

export function setLanguage(next) {
  if (!SUPPORTED.includes(next)) next = 'en';
  lang = next;

  const html = document.documentElement;
  html.setAttribute('lang', next);
  html.setAttribute('dir', RTL.includes(next) ? 'rtl' : 'ltr');

  apply(dict[next]);

  document.querySelectorAll('[data-lang]').forEach(btn =>
    btn.setAttribute('aria-current', btn.dataset.lang === next ? 'true' : 'false')
  );

  try { localStorage.setItem(STORAGE_KEY, next); } catch { /* private mode */ }
  document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: next } }));
}

export function currentLanguage() { return lang; }

export async function initI18n() {
  const res = await fetch('data/content.json');
  dict = await res.json();

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* ignore */ }
  const browser = (navigator.language || 'en').slice(0, 2);
  const initial = SUPPORTED.includes(saved) ? saved
                : SUPPORTED.includes(browser) ? browser
                : 'en';

  setLanguage(initial);

  document.querySelectorAll('[data-lang]').forEach(btn =>
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang))
  );

  return initial;
}
