# CohusDex Website

**Economic Intelligence for Africa's Informal Economy**

Public company website for [cohusdex.com](https://cohusdex.com).

---

## Structure

```
cohusdex-website/
├── index.html          # Home — hero, mission, two products
├── faidaza.html        # Faidaza product page (Swahili-first)
├── products.html       # B2B products (Score, Pulse, Atlas, Data)
├── about.html          # Valentine's story, mission, vision
├── contact.html        # Contact form + partner inquiries
├── css/
│   └── style.css       # Shared design system
├── js/
│   └── main.js         # Navigation, form, PWA registration
├── assets/
│   ├── icon-192.png    # PWA icon 192x192
│   ├── icon-512.png    # PWA icon 512x512
│   ├── favicon.png     # Browser favicon
│   ├── og-image.png    # Social sharing preview
│   └── icon.svg        # Source SVG
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline caching)
├── robots.txt          # SEO
└── sitemap.xml         # SEO
```

## Design System

- **Primary:** Orange `#E8722A`
- **Secondary:** Green `#2D6A4F`
- **Background:** Sand `#FEFAE0`
- **Dark:** `#1A1A1A`
- **Fonts:** Inter (body), Nunito (headings)
- **Mobile-first**, under 30KB per page
- **PWA** — installable, offline-cacheable

## Deployment

### GitHub Pages (from a public repo)

1. Create a public repo: `cohusdex/cohusdex-website`
2. Push this directory to the repo root
3. Enable GitHub Pages in repo Settings → Pages → Source: `main` branch, root
4. Set custom domain: `cohusdex.com` (add CNAME record)

### Any Static Host

This is a pure static site. Deploy to Netlify, Vercel, Cloudflare Pages, or any web server.

## APK Hosting

The Faidaza APK download link points to:
```
https://github.com/cohusdex/cohusdex-releases/releases/latest/download/faidaza.apk
```

To set this up:
1. Create a **public** repo: `cohusdex/cohusdex-releases`
2. Upload APK as a GitHub Release asset
3. The link above will always point to the latest release

## Contact Form

The form on `contact.html` currently uses a placeholder Formspree endpoint.
Before going live:

1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. Create a form, get your form ID
3. Update the form `action` attribute:
   ```html
   <form action="https://formspree.io/f/YOUR-FORM-ID" method="POST">
   ```
4. Alternative: Use [getform.io](https://getform.io), [web3forms](https://web3forms.com), or a custom backend

## Security Notes

This website is **public**. The following are intentionally **NOT** included:

- ❌ Source code (repos are private)
- ❌ Architecture diagrams
- ❌ Agent stack / engine details
- ❌ Pricing formulas
- ❌ Detailed data models
- ❌ Proprietary algorithms

What IS included: enough to attract users, partners, and press — without revealing strategic depth.

---

Built for Africa. From Kenya. 🧮
