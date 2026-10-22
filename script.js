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

(function(){
  if(document.querySelector('.same-day-sitewide-banner'))return;
  const banner=document.createElement('aside');
  banner.className='same-day-sitewide-banner';
  banner.setAttribute('aria-label','Same-day custom T-shirt printing');
  banner.innerHTML='<div class="same-day-banner-inner"><span class="same-day-banner-kicker">⚡ NEED SHIRTS TODAY?</span><strong>SAME-DAY CUSTOM T-SHIRT PRINTING</strong><span class="same-day-banner-terms">🔥 12 CUSTOM T-SHIRTS — $200  |  12 CUSTOM HOODIES — $450  • Same-day shirts: order by 10 AM; stock and approved artwork required</span><a class="same-day-banner-cta" href="https://form.jotform.com/262671738814062">ORDER NOW →</a></div>';
  const header=document.querySelector('.site-header')||document.querySelector('header');
  if(header)header.insertAdjacentElement('afterend',banner);else document.body.prepend(banner);
  const footer=document.querySelector('footer');
  if(footer&&!document.querySelector('.same-day-footer-link')){
    const note=document.createElement('p');note.className='same-day-footer-link';
    note.innerHTML='🔥 <strong>12 custom T-shirts for $200 • 12 custom hoodies for $450</strong> | Same-day custom T-shirt printing in Glenside, PA — Up to 12 shirts ordered by 10 AM may qualify. <a href="/rush-same-day-custom-t-shirts-glenside-pa.html">Details</a> · <a href="https://form.jotform.com/262671738814062">Order now</a>';
    footer.prepend(note);
  }
})();

// Keep the primary same-day service discoverable from every page.
(function(){
  const nav=document.querySelector('.nav-links');
  if(!nav || nav.querySelector('.sitewide-seo-nav-link')) return;
  const a=document.createElement('a');
  a.href='/rush-same-day-custom-t-shirts-glenside-pa.html';
  a.className='sitewide-seo-nav-link';
  a.textContent='Same-Day Shirts';
  const first=nav.querySelector('a');
  if(first)first.insertAdjacentElement('beforebegin',a);else nav.appendChild(a);
})();
