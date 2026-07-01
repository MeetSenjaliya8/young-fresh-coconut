# Young Fresh Coconut — go-live checklist

What I changed and what's still on you before this is production-ready.

## ✅ Done in this pass
- **Converted the site to plain static HTML.** The pages are now
  `index.html`, `about.html`, `products.html` — no JavaScript runtime, no
  React, no `support.js`/`image-slot.js`. Everything the pages need (fonts,
  styles, hover/focus effects, nav, carousel, FAQ, modal, form) is inline.
  - `<helmet>` moved into `<head>`, the `<x-dc>` wrapper removed.
  - `style-hover`/`style-focus` attributes → real CSS `:hover`/`:focus` rules.
  - `onClick="{{ handler }}"` bindings → plain inline handlers + one `<script>`.
  - The old `.dc.html` files and `support-2.js`, `image-slot.js` are now
    **obsolete** and safe to delete.
- Removed the broken Cloudflare `email-decode.min.js` script from all pages.
- Added SEO to every page: `<title>`, meta description, Open Graph/Twitter tags,
  `<link rel="canonical">`, favicon, `theme-color`, and `lang="en"`.
- Added `favicon.svg`, `robots.txt`, `sitemap.xml`.
- Switched all internal links to clean URLs (`/`, `/about`, `/products`).
- Added `netlify.toml` and `vercel.json` (clean-URL rewrites + security headers).
- Wired the contact form to POST to a Google Apps Script (see below).

## ⚠️ You must do these before it's production-ready

### 1. Add the real images
Every photo is a styled **placeholder** (`<div class="yc-imgslot">…</div>`
showing a caption like "Diamond Cut Coconut"). Replace each one with a real
image, e.g.:

```html
<img src="/images/diamond-cut.jpg" alt="Diamond cut coconut"
     style="display:block;width:100%;height:100%;object-fit:cover;">
```

Search the three `.html` files for `yc-imgslot` to find all 14 slots.

### 2. Set up the contact form (email + Google Sheet)
1. Open `google-apps-script/Code.gs`, set `SHEET_ID` and `NOTIFY_EMAIL`.
2. At script.google.com, paste it, then Deploy ▸ New deployment ▸ Web app
   (Execute as: Me · Who has access: Anyone). Copy the `/exec` URL.
3. In `index.html`, replace `FORM_ENDPOINT`'s
   `REPLACE_WITH_DEPLOYMENT_ID` value with that URL.
4. **Delete the `google-apps-script/` folder before deploying** so it isn't
   publicly downloadable.

### 3. Replace placeholders
- `YOURDOMAIN.com` → your real domain, in: all 3 HTML `<head>`s (canonical +
  og:url), `robots.txt`, `sitemap.xml`, and the `mailto:hello@YOURDOMAIN.com`
  contact links (4 of them — the old site had a placeholder `test@coconut.com`
  hidden behind Cloudflare email obfuscation, now replaced with real links).
- Add a real `og-image.jpg` (~1200×630) at the repo root for social sharing.

### 4. Verify contact details
The nav phone (`+91 96 345 23546` / `tel:+919634523546`) and the WhatsApp
number (`+919653638494`) **differ**. Fix whichever is wrong.

## Deploy
Keep only the config for your host (delete the other):
- **Netlify:** drag-and-drop the folder, or connect the repo. `netlify.toml` handles the rest.
- **Vercel:** import the folder/repo. `vercel.json` handles the rest.

## Nice-to-have (not blocking)
- Add analytics (e.g. Plausible/GA4).
- Add `alt` text to images and labels to form fields for accessibility.
- SEO is now solid: the full page content is in the static HTML, so crawlers
  see everything without running JavaScript (no prerender step needed).
