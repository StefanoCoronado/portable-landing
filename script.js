// Crowned Studio — interacciones de landing (vanilla JS, sin dependencias)

document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
  initScrollReveal();
  initSmoothAnchors();
  initCopyButtons();
  initScenes();
});

// ---- Acordeón FAQ ----
function initAccordion(){
  const triggers = document.querySelectorAll('.acc-trigger');

  triggers.forEach((trigger) => {
    const panel = trigger.nextElementSibling;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      triggers.forEach((other) => {
        if (other !== trigger){
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? null : `${panel.scrollHeight}px`;
    });
  });
}

// ---- Fade-up al hacer scroll ----
function initScrollReveal(){
  const targets = document.querySelectorAll('.sec, .cta-final');
  targets.forEach((el) => el.classList.add('fade-up'));

  if (!('IntersectionObserver' in window)){
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => observer.observe(el));
}

// ---- Copiar bloques de código ----
function initCopyButtons(){
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    const targetId = btn.getAttribute('data-copy-target');
    const target = document.getElementById(targetId);
    if (!target) return;

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(target.textContent);
      } catch (err) {
        const range = document.createRange();
        range.selectNode(target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
      }

      const original = btn.textContent;
      btn.textContent = 'Copiado ✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1800);
    });
  });
}

// ---- Scroll suave para anclas internas ----
function initSmoothAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ---- Kit Crowned v3: escenas animadas al entrar en pantalla ----
function initScenes(){
  const els = document.querySelectorAll('.scene,[data-reveal-on]');
  const arm = (el) => el.classList.contains('scene') ? (el.classList.remove('pre'), el.classList.add('go')) : el.classList.add('reveal-on');
  if (!('IntersectionObserver' in window)) { els.forEach(arm); return; }
  els.forEach((el) => { if (el.classList.contains('scene')) el.classList.add('pre'); });
  const io = new IntersectionObserver((en) => {
    en.forEach((e) => { if (e.isIntersecting) { arm(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.25 });
  els.forEach((el) => io.observe(el));
}

// Linterna del fondo: ilumina el dot grid cerca del cursor
if (matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const root = document.documentElement; let raf = 0, x = 0, y = 0;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; if (raf) return; raf = requestAnimationFrame(() => { root.style.setProperty('--mx', x + 'px'); root.style.setProperty('--my', y + 'px'); raf = 0; }); }, { passive: true });
  document.addEventListener('pointerleave', () => { root.style.removeProperty('--mx'); root.style.removeProperty('--my'); });
}
// pestañas
document.querySelectorAll('[data-tabs]').forEach(function (w) {
  var bs = w.querySelectorAll('[role=tab]'), ps = w.querySelectorAll('.tab-p');
  bs.forEach(function (b, i) { b.addEventListener('click', function () {
    bs.forEach(function (x, j) { x.setAttribute('aria-selected', j === i ? 'true' : 'false'); ps[j].hidden = j !== i; });
  }); });
});
