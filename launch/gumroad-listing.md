# Gumroad Product Listing

## Product Name
Dev Boilerplates Bundle — Chrome Extension MV3 + WordPress Plugin React Admin

## Tagline
Ship your next Chrome extension or WordPress plugin in days, not weeks.

## Short Description (for Gumroad card)
Two production-ready boilerplates: Chrome Extension MV3 (React + TypeScript + Vite + Tailwind) and WordPress Plugin with React Admin Panel (@wordpress/scripts + @wordpress/components). Both build out of the box.

---

## Full Description (Gumroad product page)

### Stop building the same boilerplate every time.

You know the drill. New project idea. Excited to build. Then you spend 2 weeks on:
- Auth flows
- Settings pages
- Message passing
- Build configuration
- Payment integration
- API scaffolding

**What if you could skip all that and start building your actual product on day one?**

---

### What's Inside

#### Chrome Extension MV3 Boilerplate
Everything you need to ship a modern Chrome extension:

- **React 18 + TypeScript + Tailwind CSS** — Popup, Side Panel, and Options pages
- **Service Worker** — Message routing, alarms, context menus, lifecycle hooks
- **Content Scripts** — DOM extraction + Shadow DOM widget injection (isolated styles)
- **Type-safe Storage API** — Wrapper for chrome.storage (local, sync, session) with change listeners
- **Type-safe Messaging** — Between popup, sidepanel, options, content scripts, and background
- **OAuth2 Authentication** — Google OAuth via chrome.identity + Generic OAuth2 (GitHub, Discord, any provider)
- **BYOK API Client** — Bring-Your-Own-Key pattern for Claude, OpenAI, etc. No backend needed
- **License Validation** — Built-in Gumroad license key verification
- **Vite Build** — Fast builds, hot reload in dev mode, production-ready output
- **i18n Ready** — _locales structure for Chrome Web Store internationalization

#### WordPress Plugin + React Admin Boilerplate
A complete plugin starter with a modern admin panel:

- **React Admin Panel** — Dashboard, Items (CRUD with pagination), Settings — all using @wordpress/components
- **REST API** — Full CRUD endpoints with nonce verification and capability checks
- **Settings Framework** — Type-safe get/update with sanitization and whitelisted keys
- **Custom Post Type** — Scaffold with REST support, managed via the React admin
- **Security Built-in** — ABSPATH guards, nonces, capability checks, sanitize_text_field, wp_kses_post, esc_html
- **@wordpress/scripts** — Same build toolchain WordPress core uses
- **i18n Ready** — All strings wrapped in __() for translation
- **API Client** — @wordpress/api-fetch with automatic nonce handling

---

### Who Is This For?

- **Solo developers** building Chrome extensions or WordPress plugins
- **Indie hackers** who want to ship fast without cutting corners on security
- **Agency developers** who need a consistent starting point for client projects
- **Anyone tired** of copy-pasting boilerplate code from old projects

### What You Get

- Full source code for both boilerplates (MIT / GPL-2.0)
- Detailed README with customization guide for each
- Both build out of the box — `pnpm install && pnpm build`
- Lifetime updates (new features, dependency bumps, security patches)

---

### Tech Stack

| Chrome Extension | WordPress Plugin |
|-----------------|-----------------|
| React 18 | React 18 (via @wordpress/element) |
| TypeScript (strict) | @wordpress/scripts |
| Vite 6 | @wordpress/components |
| Tailwind CSS 3 | @wordpress/api-fetch |
| pnpm | pnpm |

---

### Pricing

| Tier | Price | What's Included |
|------|-------|----------------|
| **Chrome MV3 Only** | $79 | Chrome Extension boilerplate + README + lifetime updates |
| **WP Plugin Only** | $79 | WordPress Plugin boilerplate + README + lifetime updates |
| **Bundle (Both)** | $149 | Both boilerplates + lifetime updates |
| **Bundle + Video** | $199 | Both boilerplates + 2 video walkthroughs + lifetime updates |

---

### FAQ

**Can I use this for commercial projects?**
Yes. Chrome Extension is MIT licensed. WordPress Plugin is GPL-2.0 (required for WP.org). Use them for any project — client work, SaaS, products.

**Do I need a backend?**
No. The Chrome Extension includes a BYOK (Bring Your Own Key) pattern — users provide their own API keys. No backend proxy needed. The WordPress Plugin uses WordPress itself as the backend.

**How do I get updates?**
You'll receive an email when updates are available. Re-download from Gumroad anytime.

**What if it doesn't work?**
Both boilerplates build and run out of the box. If you have issues, email me and I'll help. Full refund within 30 days if you're not satisfied.

---

### Built by AdeaIT
I build and sell WordPress plugins, Shopify apps, and Chrome extensions. These boilerplates are the exact foundations I use for my own products.

[adeait.gumroad.com](https://adeait.gumroad.com)
