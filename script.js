/* ═══════════════════════════════════════════
   PORTFOLIO SCRIPT — susHOvan
═══════════════════════════════════════════ */

/* ── PAGE LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 700);
});

/* ── NAV: auto-hide on scroll DOWN (desktop only), show on scroll UP ── */
const nav = document.getElementById('nav');
const btt = document.getElementById('btt');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  const isDesktop = window.innerWidth > 768;

  if (nav) {
    // Solid background after 60px
    nav.classList.toggle('solid', current > 60);

    // Auto-hide only on desktop
    if (isDesktop) {
      if (current > lastScrollY && current > 120) {
        // Scrolling DOWN — hide nav
        nav.classList.add('nav-hidden');
      } else {
        // Scrolling UP or near top — show nav
        nav.classList.remove('nav-hidden');
      }
    } else {
      // Mobile: always visible
      nav.classList.remove('nav-hidden');
    }
  }

  if (btt) btt.classList.toggle('vis', current > 500);
  lastScrollY = current <= 0 ? 0 : current;
  onScroll();
}, { passive: true });

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('navHam');
const mobileOverlay = document.getElementById('navMobile');

if (hamburger && mobileOverlay) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
  });
  mobileOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── SCROLL STORY ENGINE ── */
function progress(el) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const total = el.offsetHeight - window.innerHeight;
  return Math.max(0, Math.min(1, -r.top / total));
}

function setIn(id, on) {
  const el = document.getElementById(id);
  if (!el) return;
  on ? el.classList.add('in') : el.classList.remove('in');
}

function setInEl(el, on) {
  if (!el) return;
  on ? el.classList.add('in') : el.classList.remove('in');
}

const idCh = document.getElementById('ch-identity');
const skCh = document.getElementById('ch-skills');
const prCh = document.getElementById('ch-projects');
const ctCh = document.getElementById('ch-contact');

function isMobile() { return window.innerWidth <= 768; }

function onScroll() {
  if (isMobile()) {
    // On mobile force all content visible immediately
    ['w1','w2','w3','subRev','statsRev','ct-text','ct-right'].forEach(id => setIn(id, true));
    document.querySelectorAll('.main-page-card').forEach(el => setInEl(el, true));
    return;
  }

  if (idCh) {
    const p = progress(idCh);
    setIn('w1',      p > .05);
    setIn('w2',      p > .18);
    setIn('w3',      p > .33);
    setIn('subRev',  p > .48);
    setIn('statsRev',p > .62);
  }

  if (skCh) {
    const p = progress(skCh);
    document.querySelectorAll('.skill-item').forEach((el, i) => setInEl(el, p > 0.1 + i * 0.13));
  }

  if (prCh) {
    const p = progress(prCh);
    document.querySelectorAll('.main-page-card').forEach((el, i) => setInEl(el, p > 0.05 + i * 0.1));
  }

  if (ctCh) {
    const p = progress(ctCh);
    setIn('ct-text', p > .1);
    setIn('ct-right',p > .25);
  }
}

onScroll();

/* ── IntersectionObserver for featured cards (index.html) ── */
document.querySelectorAll('.main-page-card').forEach(el => {
  new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? el.classList.add('in') : el.classList.remove('in'));
  }, { threshold: 0.05 }).observe(el);
});

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const t = document.querySelector(href);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ════════════════════════
   GALLERY SLIDESHOW
════════════════════════ */
(function initGallery() {
  const slides    = document.querySelectorAll('.gallery-slide');
  const counter   = document.querySelector('.slideshow-counter');
  const progFill  = document.querySelector('.slide-progress-fill');
  const prevBtn   = document.querySelector('.slide-arrow-btn.prev');
  const nextBtn   = document.querySelector('.slide-arrow-btn.next');
  const tapLeft   = document.querySelector('.slide-tap-left');
  const tapRight  = document.querySelector('.slide-tap-right');

  if (!slides.length) return;

  let cur = 0, busy = false;
  const total = slides.length;

  function updateUI() {
    if (counter)  counter.textContent = `${cur + 1} / ${total}`;
    if (progFill) progFill.style.width = `${((cur + 1) / total) * 100}%`;
  }

  function goTo(next, dir) {
    if (busy || next === cur) return;
    busy = true;
    const from = slides[cur];
    const to   = slides[next];
    to.className = 'gallery-slide ' + (dir === 'next' ? 'enter-right' : 'enter-left');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      from.className = 'gallery-slide ' + (dir === 'next' ? 'exit-left' : 'exit-right');
      to.className   = 'gallery-slide active';
      cur = next;
      updateUI();
      setTimeout(() => {
        slides.forEach((s, i) => { if (i !== cur) s.className = 'gallery-slide'; });
        busy = false;
      }, 700);
    }));
  }

  const goNext = () => goTo((cur + 1) % total, 'next');
  const goPrev = () => goTo((cur - 1 + total) % total, 'prev');

  if (nextBtn)  nextBtn.addEventListener('click', goNext);
  if (prevBtn)  prevBtn.addEventListener('click', goPrev);
  if (tapRight) tapRight.addEventListener('click', goNext);
  if (tapLeft)  tapLeft.addEventListener('click', goPrev);

  // Swipe
  let tx = 0, ty = 0;
  const track = document.querySelector('.gallery-slide-track');
  if (track) {
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const dx = tx - e.changedTouches[0].clientX;
      const dy = Math.abs(ty - e.changedTouches[0].clientY);
      if (Math.abs(dx) > 40 && Math.abs(dx) > dy) dx > 0 ? goNext() : goPrev();
    }, { passive: true });
  }

  // Init
  slides[0].className = 'gallery-slide active';
  slides.forEach((s, i) => { if (i !== 0) s.className = 'gallery-slide'; });
  updateUI();
})();

/* ════════════════════════
   PROJECT CAROUSEL
════════════════════════ */
(function initCarousel() {
  const cards     = document.querySelectorAll('.carousel-card');
  const counter   = document.querySelector('.carousel-counter');
  const dotsWrap  = document.querySelector('.carousel-dots');
  const autoFill  = document.querySelector('.carousel-auto-fill');

  if (!cards.length) return;

  let cur = 0, busy = false;
  const total    = cards.length;
  const DELAY    = 3000;
  let autoTimer  = null;

  // Build dots
  if (dotsWrap) {
    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Project ${i + 1}`);
      d.addEventListener('click', () => { if (i !== cur) { resetAuto(); goTo(i, i > cur ? 'next' : 'prev'); } });
      dotsWrap.appendChild(d);
    });
  }

  function dots() { return dotsWrap ? dotsWrap.querySelectorAll('.carousel-dot') : []; }

  function updateUI() {
    if (counter) counter.textContent = `${cur + 1} / ${total}`;
    dots().forEach((d, i) => d.classList.toggle('active', i === cur));
  }

  function goTo(next, dir) {
    if (busy || next === cur) return;
    busy = true;
    const from = cards[cur];
    const to   = cards[next];
    to.className = 'carousel-card ' + (dir === 'next' ? 'enter-right' : 'enter-left');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      from.className = 'carousel-card ' + (dir === 'next' ? 'exit-left' : 'exit-right');
      to.className   = 'carousel-card active';
      cur = next;
      updateUI();
      setTimeout(() => {
        cards.forEach((c, i) => { if (i !== cur) c.className = 'carousel-card'; });
        busy = false;
      }, 750);
    }));
  }

  const goNext = () => goTo((cur + 1) % total, 'next');
  const goPrev = () => goTo((cur - 1 + total) % total, 'prev');

  // Auto-scroll with progress bar
  function startFill() {
    if (!autoFill) return;
    autoFill.style.transition = 'none';
    autoFill.style.width = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      autoFill.style.transition = `width ${DELAY}ms linear`;
      autoFill.style.width = '100%';
    }));
  }

  function startAuto() {
    startFill();
    autoTimer = setTimeout(() => { goNext(); startAuto(); }, DELAY);
  }

  function resetAuto() {
    clearTimeout(autoTimer);
    startAuto();
  }

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { resetAuto(); goNext(); }
    if (e.key === 'ArrowLeft')  { resetAuto(); goPrev(); }
  });

  // Swipe
  let tx = 0, ty = 0;
  const container = document.querySelector('.carousel-container');
  if (container) {
    container.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    container.addEventListener('touchend',   e => {
      const dx = tx - e.changedTouches[0].clientX;
      const dy = Math.abs(ty - e.changedTouches[0].clientY);
      if (Math.abs(dx) > 40 && Math.abs(dx) > dy) { resetAuto(); dx > 0 ? goNext() : goPrev(); }
    }, { passive: true });
  }

  // Init
  cards[0].className = 'carousel-card active';
  cards.forEach((c, i) => { if (i !== 0) c.className = 'carousel-card'; });
  updateUI();
  startAuto();
})();
