/* Activate with the measurement ID from Joe's own GA4 web data stream. */
(() => {
  const measurementId = 'G-MT00JVC99W';
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  const pageLocation = campaignLocation();
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: pageLocation,
    page_referrer: cleanReferrer(document.referrer)
  });
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: pageLocation,
    page_referrer: cleanReferrer(document.referrer)
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);

  function cleanReferrer(value) {
    try { const url = new URL(value); return url.origin + url.pathname; }
    catch { return ''; }
  }

  // Preserve campaign attribution without forwarding arbitrary query fields.
  function campaignLocation() {
    const page = new URL(location.origin + location.pathname);
    const query = new URLSearchParams(location.search);
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id']) {
      const value = query.get(key);
      if (value && /^[a-zA-Z0-9_.~-]{1,100}$/.test(value)) page.searchParams.set(key, value);
    }
    return page.href;
  }

  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href, location.href); } catch { return; }
    let action;
    if (url.protocol === 'sms:') action = 'click_to_text';
    else if (url.protocol === 'tel:') action = 'click_to_call';
    else if (url.hostname === 'form.jotform.com' && url.pathname === '/262881102440045') action = 'price_inquiry_start';
    else if (url.protocol === 'mailto:') action = 'email_click';
    else if (url.hostname === 'g.page' && url.pathname.endsWith('/review')) action = 'review_click';
    else if (url.origin === location.origin && /\/(custom-christmas-gifts|holiday-gift-pricing|personalized-christmas-ornaments|personalized-photo-christmas-gifts|business-teacher-christmas-gifts)\.html$/.test(url.pathname)) action = 'gift_browse';
    else if (url.hostname === 'form.jotform.com' && url.pathname === '/262671738814062') {
      action = 'order_start';
      try { sessionStorage.setItem('joe_order_started', String(Date.now())); } catch {}
    }
    if (action) gtag('event', action, {
      page_path: location.pathname,
      event_category: 'contact',
      contact_placement: link.dataset.contactPlacement || (link.closest('header') ? 'navigation' : link.closest('footer') ? 'footer' : link.classList.contains('floating-call-btn') ? 'floating' : 'page'),
      transport_type: 'beacon'
    });
  });

  // Count a confirmation only after this browser started an order.
  // The form redirects here after a successful submission.
  if (location.pathname === '/thank-you.html') {
    try {
      const started = Number(sessionStorage.getItem('joe_order_started'));
      if (started && Date.now() - started < 86400000) {
        gtag('event', 'generate_lead', { lead_source: 'order_request', page_path: '/thank-you.html' });
        sessionStorage.removeItem('joe_order_started');
      }
    } catch {}
  }
})();
