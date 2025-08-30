// interest.js — always open banner on page load
(function () {
    const banner  = document.getElementById('interest-banner');
    const trigger = document.getElementById('interest-trigger'); // ⭐ button
    if (!banner || !trigger) return;
  
    function showBanner() {
      banner.classList.add('show');
      trigger.style.display = 'none';
    }
  
    function minimizeToStar() {
      banner.classList.remove('show');
      trigger.style.display = 'flex';
    }
  
    // Always open when the page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  
    // Close (→ show ⭐)
    banner.querySelector('.interest-close')?.addEventListener('click', minimizeToStar);
  
    // Click ⭐ (→ reopen)
    trigger.addEventListener('click', showBanner);
  })();
  