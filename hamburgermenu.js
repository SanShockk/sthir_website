(function(){
const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('mobileMenu');

function closeMenu() {
    menu.classList.remove('active');
    document.body.classList.remove('no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('active');
    document.body.classList.toggle('no-scroll', open);
    toggle.setAttribute('aria-expanded', String(open));
});

// Close on any link click
menu.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) closeMenu();
});

// Close on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});
})();
