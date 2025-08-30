// AOS
AOS.init({ duration: 900, once: true });

// --- Navbar sticky scroll effect ---
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// --- Mobile Nav Toggle ---
// If you have a mobile menu element on this page, wire it here
const navToggle = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu"); 
if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", mobileMenu.classList.contains("active"));
  });

  // Smooth scroll close behavior (for in-page anchors on this page)
  document.querySelectorAll('.mobile-menu a, .nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        e.preventDefault();
        document.querySelector(hash)?.scrollIntoView({behavior: "smooth"});
        mobileMenu.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// --- Floating labels for contact form ---
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
  input.addEventListener('blur', function() {
    if (this.value !== '') {
      this.classList.add('filled');
    } else {
      this.classList.remove('filled');
    }
  });
});

// --- cal.com Popup ---
(function() {
  const BOOKING_URL = "https://cal.com/sthireducation/";

  const openers = [
    document.getElementById('book-call-link'),
    document.getElementById('open-booking'),
    document.getElementById('open-booking-2'),
  ].filter(Boolean);

  openers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal(BOOKING_URL);
    });
  });

  function openBookingModal(url) {
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'booking-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Book a 30-minute call');

    // Modal
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.tabIndex = -1;

    // Header
    const header = document.createElement('div');
    header.className = 'booking-header';

    const title = document.createElement('div');
    title.className = 'booking-title';
    title.textContent = 'Book a 30-min Call';

    const actions = document.createElement('div');
    actions.className = 'booking-actions';

    const openNewTab = document.createElement('a');
    openNewTab.className = 'booking-btn';
    openNewTab.href = url;
    openNewTab.target = '_blank';
    openNewTab.rel = 'noopener';
    openNewTab.textContent = 'Open in new tab';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'booking-close';
    closeBtn.setAttribute('aria-label', 'Close booking modal');
    closeBtn.innerHTML = '✕';

    actions.appendChild(openNewTab);
    actions.appendChild(closeBtn);

    header.appendChild(title);
    header.appendChild(actions);

    // Iframe (lazy load w/ src)
    const iframe = document.createElement('iframe');
    iframe.className = 'booking-iframe';
    iframe.src = url;
    iframe.title = 'Cal.com scheduling';

    // Compose
    modal.appendChild(header);
    modal.appendChild(iframe);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Lock scroll & focus
    const prevActive = document.activeElement;
    document.body.classList.add('no-scroll');
    setTimeout(() => modal.focus(), 0);

    // Close handlers
    function close() {
      document.body.classList.remove('no-scroll');
      overlay.remove();
      if (prevActive && typeof prevActive.focus === 'function') prevActive.focus();
      document.removeEventListener('keydown', onKeydown);
    }

    function onKeydown(ev) {
      if (ev.key === 'Escape') close();
      if (ev.key === 'Tab') trapFocus(ev, modal);
    }

    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', onKeydown);

    // Focus trap
    function trapFocus(e, container) {
      const focusables = container.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus(); e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus(); e.preventDefault();
      }
    }
  }
})();
