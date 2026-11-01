const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
  navLinks?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
  menuBtn?.setAttribute('aria-label', 'Open navigation');
}

menuBtn?.addEventListener('click', () => {
  const open = navLinks?.classList.toggle('open') ?? false;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (navLinks?.classList.contains('open')) {
      closeMenu();
      menuBtn?.focus();
    }
  }
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

document.addEventListener('click', event => {
  if (navLinks?.classList.contains('open') && !event.target.closest('.nav')) closeMenu();
});
window.matchMedia('(max-width: 1250px)').addEventListener('change', closeMenu);


// Keep call and text together on every page, including small screens.
document.querySelector('.floating-call-btn')?.remove();
if (!document.querySelector('.contact-quick-actions')) {
  const actions = document.createElement('nav');
  actions.className = 'contact-quick-actions';
  actions.setAttribute('aria-label', 'Contact Joe');
  for (const [protocol, label] of [['tel', 'Call Joe'], ['sms', 'Text Joe']]) {
    const link = document.createElement('a');
    link.href = protocol + ':+16103680865';
    link.textContent = label;
    link.dataset.contactPlacement = 'mobile_contact_bar';
    actions.appendChild(link);
  }
  document.body.appendChild(actions);
}
