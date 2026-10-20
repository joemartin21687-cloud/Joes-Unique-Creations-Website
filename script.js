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


// A direct text option on service pages as well as the homepage.
if (!document.querySelector('a[href^="sms:"]')) {
  const textLink = document.createElement('a');
  textLink.href = 'sms:+16103680865';
  textLink.className = 'floating-call-btn';
  textLink.dataset.contactPlacement = 'floating';
  textLink.textContent = 'Text Joe for a Quote';
  textLink.setAttribute('aria-label', "Text Joe's Unique Creations for a quote");
  const callLink = document.querySelector('.floating-call-btn');
  if (callLink) callLink.replaceWith(textLink);
  else document.body.appendChild(textLink);
}
