# Joe's Unique Creations Website

Official website for Joe's Unique Creations, a custom apparel and printing business in Glenside, Pennsylvania.

**Canonical website:** https://joesuniquecreationspa.com/

## Core files
- `index.html` — homepage and quote form
- `styles.css` — site styling and responsive design
- `script.js` — navigation and quote-form logic
- `robots.txt` — search-engine crawling instructions
- `sitemap.xml` — XML sitemap for the current website

## Current features
- Local SEO focused on Glenside and nearby Montgomery County communities
- Dedicated custom T-shirt, DTF printing, DTF transfer, business, bulk, school/team, memorial and rush-printing pages
- Dedicated local landing pages for nearby communities
- Canonical URLs on the current joesuniquecreationspa.com domain
- LocalBusiness/Service structured data
- Real customer-work gallery
- Quote form with artwork upload
- Dropbox option for artwork files over 10 MB
- Google review call-to-action

## Order form and analytics
Buy Now buttons open https://form.jotform.com/262671738814062. The form collects order details without payment; Joe confirms the total and sends a secure Stripe payment link. After submission, the form redirects to /thank-you.html.

analytics.js records order starts, call/text clicks, and a generate_lead event on the confirmation page when the same browser previously opened the order form. GA4 account-side key-event settings and live reporting must be verified separately. A form-start click is not a completed order or payment.

## SEO notes
The current official/canonical domain is **joesuniquecreationspa.com**. The former joesuc.com domain is no longer the canonical website and should not be used in new metadata, sitemap entries, internal links, or documentation.
