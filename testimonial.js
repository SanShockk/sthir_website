(function () {
  const track    = document.getElementById('testimonial-track');
  const viewport = document.getElementById('testimonial-viewport');
  const prev     = document.getElementById('prevBtn');
  const next     = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('testimonial-dots');
  const cards    = Array.from(track.children);

  // how many cards are visible per view (keep in sync with CSS breakpoints)
  function getPerView() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  let perView = getPerView();
  let page = 0; // page index (0..pages-1)
  let pages = Math.max(1, Math.ceil(cards.length / perView));

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.type = 'button';
      if (i === page) d.classList.add('active');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function measure() {
    // width of a single card (already calculated by flex-basis in CSS)
    const card = cards[0];
    if (!card) return { cardW: 0, gap: 0 };
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.gap || styles.columnGap || 0);
    const cardW = card.getBoundingClientRect().width;
    return { cardW, gap };
  }

  function applyTransform() {
    const { cardW, gap } = measure();
    const offset = page * perView * (cardW + gap);
    track.style.transform = `translateX(${-offset}px)`;
    // update dots active state
    dotsWrap.querySelectorAll('button').forEach((b, i) => {
      b.classList.toggle('active', i === page);
    });
  }

  function goTo(p) {
    page = (p + pages) % pages; // wrap safely
    applyTransform();
  }

  function nextPage() { goTo(page + 1); }
  function prevPage() { goTo(page - 1); }

  // autoplay (pause on hover)
  let timer = setInterval(nextPage, 4000);
  viewport.addEventListener('mouseenter', () => clearInterval(timer));
  viewport.addEventListener('mouseleave', () => (timer = setInterval(nextPage, 4000)));

  // controls
  next.addEventListener('click', nextPage);
  prev.addEventListener('click', prevPage);

  // handle resize: recompute pages and perView
  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      perView = getPerView();
      pages = Math.max(1, Math.ceil(cards.length / perView));
      page = Math.min(page, pages - 1);
      buildDots();
      applyTransform();
    }, 150);
  });

  // init
  buildDots();
  applyTransform();
})();
