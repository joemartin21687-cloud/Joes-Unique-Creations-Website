const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
  navLinks?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}

menuBtn?.addEventListener('click', () => {
  const open = navLinks?.classList.toggle('open') ?? false;
  menuBtn.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    menuBtn?.focus();
  }
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
