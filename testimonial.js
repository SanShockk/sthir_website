/**
 * Sthir Testimonials Carousel — Infinite, forward-only
 * - Exactly N per view from CSS var --cards-per-view
 * - Moves N at a time, loops seamlessly (no reverse bounce)
 * - Accurate paging by card width + gap (no clipping)
 * - A11y (buttons + dots), keyboard & touch
 * - Autoplay with hover pause; respects reduced motion
 */
(() => {
  const track    = document.getElementById('testimonial-track');
  const viewport = document.getElementById('testimonial-viewport');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('testimonial-dots');

  if (!track || !viewport) return;

  // ----- Helpers -----
  function getPerView() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--cards-per-view')
      .trim();
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : 3;
  }
  function measure() {
    const first = track.querySelector('.testimonial-card');
    if (!first) return { cardW: 0, gap: 0 };
    const cardW = first.getBoundingClientRect().width;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    return { cardW, gap };
  }

  // ----- Setup originals -----
  const originalCards = Array.from(track.children);
  if (originalCards.length === 0) return;
  let perView = getPerView();
  let logicalPages = Math.max(1, Math.ceil(originalCards.length / perView));

  // Clone edges so we can loop seamlessly.
  // We clone `perView` cards from the start & end to both ends.
  function buildClones() {
    // clear any previous clones (in case of responsive rebuild)
    track.innerHTML = '';
    const headClones = originalCards.slice(-perView).map(n => n.cloneNode(true));
    const tailClones = originalCards.slice(0, perView).map(n => n.cloneNode(true));
    headClones.forEach(n => track.appendChild(n));           // prepend set (we'll reposition via translate)
    originalCards.forEach(n => track.appendChild(n.cloneNode(true))); // originals
    tailClones.forEach(n => track.appendChild(n));           // append set
  }
  buildClones();

  // After cloning, our "all cards in DOM" is:
  // [head clones][originals][tail clones]
  // We'll keep an index in "card units" (not pages) that points to the first visible card.
  let currentIndex = perView;  // start at the first real card (after head clones)

  // Reduce motion?
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  // ----- Dots (logical pages only) -----
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < logicalPages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      dot.setAttribute('role', 'tab');
      if (i === logicalPageFromIndex()) dot.classList.add('active');
      dot.addEventListener('click', () => goToLogicalPage(i));
      dotsWrap.appendChild(dot);
    }
  }

  function logicalPageFromIndex() {
    // Translate currentIndex (which includes the head clones offset) back to "which logical page am I on?"
    const firstRealIndex = currentIndex - perView; // 0..(originalCards.length - 1) aligned to perView steps
    const page = Math.floor(firstRealIndex / perView);
    // keep in range 0..logicalPages-1
    return ((page % logicalPages) + logicalPages) % logicalPages;
  }

  function setActiveDot() {
    if (!dotsWrap) return;
    const active = logicalPageFromIndex();
    dotsWrap.querySelectorAll('button').forEach((b, i) => {
      b.classList.toggle('active', i === active);
    });
  }

  // ----- Transform -----
  function applyTransform(animate = true) {
    const { cardW, gap } = measure();
    const step = Math.round(cardW + gap);
    const offset = Math.round(currentIndex * step);
    if (!animate || reduceMotion) {
      const prev = track.style.transition;
      track.style.transition = 'none';
      track.style.transform = `translateX(${-offset}px)`;
      void track.offsetHeight;
      track.style.transition = prev || '';
    } else {
      track.style.transform = `translateX(${-offset}px)`;
    }
    setActiveDot();
  }

  // Seamless jump if we drift into clones
  function normalizeIndexIfNeeded() {
    const totalDomCards = track.children.length;           // head + originals + tail
    const originalsCount = originalCards.length;

    // First real card index in the DOM = perView
    // Last real group starts at perView + (originalsCount - perView)
    const firstReal = perView;
    const lastRealStart = perView + Math.max(0, originalsCount - perView);

    if (currentIndex >= perView + originalsCount) {
      // moved past the appended tail clones → jump back by originalsCount
      currentIndex -= originalsCount;
      applyTransform(false); // jump without animation
    } else if (currentIndex < firstReal) {
      // (if going backwards) moved into head clones → jump forward by originalsCount
      currentIndex += originalsCount;
      applyTransform(false);
    }
  }

  // ----- Navigation -----
  function nextPage() {
    currentIndex += perView;       // always forward
    applyTransform(true);
    // after the transition ends, normalize if we are in clone range
  }

  function prevPage() {
    // keep backward support on button/keys if you want; otherwise comment out:
    currentIndex -= perView;
    applyTransform(true);
  }

  // Transition end → normalize (seamless loop)
  track.addEventListener('transitionend', normalizeIndexIfNeeded);

  // Dots jump to a logical page
  function goToLogicalPage(p) {
    // compute index for the logical page p within the real range
    // (start of originals is at index = perView)
    currentIndex = perView + p * perView;
    applyTransform(true);
  }

  // ----- Autoplay (forward-only) -----
  let timer = null;
  const INTERVAL = 4200;
  function startAutoplay() { if (!reduceMotion) { stopAutoplay(); timer = setInterval(nextPage, INTERVAL); } }
  function stopAutoplay()  { if (timer) clearInterval(timer); timer = null; }

  viewport.addEventListener('mouseenter', stopAutoplay);
  viewport.addEventListener('mouseleave', startAutoplay);

  // ----- Controls / A11y -----
  nextBtn?.addEventListener('click', () => { stopAutoplay(); nextPage(); startAutoplay(); });
  prevBtn?.addEventListener('click', () => { stopAutoplay(); prevPage(); startAutoplay(); });

  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); stopAutoplay(); nextPage(); startAutoplay(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); stopAutoplay(); prevPage(); startAutoplay(); }
  });

  // ----- Resize / Responsiveness -----
  let rAF = 0;
  window.addEventListener('resize', () => {
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      const oldPer = perView;
      perView = getPerView();
      logicalPages = Math.max(1, Math.ceil(originalCards.length / perView));

      // Rebuild clones if perView changed (because we clone perView at each edge)
      if (perView !== oldPer) {
        buildClones();
        currentIndex = perView; // reset to first real
        buildDots();
        applyTransform(false);
        return;
      }

      // Same perView: just re-measure & re-apply
      buildDots();
      applyTransform(false);
    });
  });

  // ----- Init -----
  buildDots();
  // Start centered at first real item (after head clones)
  applyTransform(false);
  startAutoplay();
})();
