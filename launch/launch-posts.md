# Launch Posts

---

## Twitter/X Post

### Main Tweet
I just shipped two boilerplates I've been using internally for all my Chrome extensions and WordPress plugins.

Chrome Extension MV3:
→ React + TypeScript + Vite + Tailwind
→ OAuth2, BYOK API client, license validation
→ Popup, side panel, options, content scripts

WordPress Plugin + React Admin:
→ @wordpress/components (native WP look)
→ REST API with full CRUD
→ Settings framework, CPT scaffold

Both build in ~1 second and ship production-ready.

$79 each / $149 for the bundle.

[link]

### Reply Thread
1/ The Chrome extension boilerplate includes things I had to learn the hard way:

- Message passing that actually works between all contexts
- Shadow DOM injection so your styles don't break the host page
- Gumroad license key validation for monetization
- BYOK pattern so you don't need a backend

2/ The WordPress plugin boilerplate is the one nobody sells.

There are 70+ Next.js SaaS starters. But try finding a premium WP plugin boilerplate with a React admin panel, REST API, and security patterns baked in.

I couldn't find one. So I built it.

3/ Both include:
- Detailed README with customization guide
- Clean project structure
- pnpm install → pnpm build → done
- Lifetime updates

If you're building Chrome extensions or WordPress plugins, this saves you 2-3 weeks per project.

---

## Reddit r/webdev Post

### Title
I built the Chrome Extension and WordPress Plugin boilerplates I wished existed

### Body
After shipping 6+ Chrome extensions and WordPress plugins, I got tired of rebuilding the same foundation every time. So I packaged my starter code into two production-ready boilerplates.

**Chrome Extension MV3** (React + TypeScript + Vite + Tailwind):
- Popup, Side Panel, Options pages with hot reload
- Service worker with message routing, alarms, context menus
- Content scripts with Shadow DOM widget injection
- Type-safe chrome.storage wrapper with change listeners
- OAuth2 (Google + generic providers like GitHub/Discord)
- BYOK API client (users bring their own API key, no backend needed)
- Gumroad license validation for monetization
- Builds in ~1 second

**WordPress Plugin + React Admin** (PHP + @wordpress/scripts + @wordpress/components):
- Full admin panel: Dashboard, CRUD Items list, Settings
- REST API endpoints with nonce verification + capability checks
- Settings framework with type-based sanitization
- Custom Post Type scaffold
- All security patterns (ABSPATH, nonces, sanitize/escape, whitelisted keys)
- Native WP component look and feel
- Builds in ~1.3 seconds

Both are `pnpm install && pnpm build` and you're running.

I specifically focused on the gaps in the market:
- There are 70+ Next.js SaaS boilerplates, but only 2-3 serious paid Chrome Extension MV3 starters
- There are ZERO premium WordPress Plugin + React Admin boilerplates (existing ones are all free/outdated)

$79 each or $149 for both: [link]

Happy to answer questions about the architecture or Chrome MV3 gotchas.

---

## Reddit r/SideProject Post

### Title
Launched my first digital product: Boilerplate bundle for Chrome Extensions + WordPress Plugins

### Body
After months of building products (WordPress plugins, Chrome extensions, Shopify apps), I realized I was spending the first 2 weeks of every project on the same boilerplate code.

So I packaged it up and put it on Gumroad.

**What it is:** Two starter kits — one for Chrome Extension MV3 (React/TS/Vite/Tailwind) and one for WordPress Plugin with a React admin panel.

**What makes it different:**
- Chrome MV3 market has only 2-3 paid options (ChromeKit, ExtensionKit). Mine includes BYOK pattern, OAuth2, and Gumroad license validation.
- WordPress Plugin + React Admin has zero premium competitors. Every existing boilerplate is free/open-source and uses jQuery-era patterns.

**Pricing:** $79 each / $149 bundle

**What I learned building it:**
1. The hardest part isn't the code — it's the documentation and README
2. @crxjs/vite-plugin breaks with Vite 6 — I switched to a plain Vite config that works with any version
3. WordPress's @wordpress/components library is surprisingly good once you learn it

Would love feedback. What would make you buy (or not buy) a boilerplate?

---

## Dev.to Article

### Title
How I Built Two Developer Boilerplates and Why The Market Gap Surprised Me

### Body

I did deep market research before building anything. Here's what I found:

**Chrome Extension MV3 Boilerplates:**
- 70+ Next.js SaaS starters exist
- Only 2-3 serious paid Chrome Extension MV3 boilerplates (ChromeKit, ExtensionKit)
- Most free ones on GitHub are abandoned or don't include auth/payments

**WordPress Plugin + React Admin Boilerplates:**
- Zero premium options
- wppb.me generates a basic scaffold but no React, no REST API, no modern tooling
- DevinVinson's boilerplate on GitHub hasn't been meaningfully updated

So I built both.

### Chrome Extension MV3 — Key Decisions

**No @crxjs/vite-plugin.** It's great but breaks with Vite 6. Instead, I use a plain Vite config with a custom plugin that copies manifest.json and static assets. Works with any Vite version.

**Type-safe everything.** Storage wrapper returns typed values. Message passing uses generics. No `any` types.

**BYOK pattern over backend proxy.** Most Chrome extensions that use AI let users provide their own API key. This eliminates the need for a backend, reduces costs to zero, and lets you focus on the extension itself.

```typescript
const claude = createApiClient({
  baseUrl: 'https://api.anthropic.com',
  getApiKey: () => storage.get<string>('apiKey'),
  headers: { 'anthropic-version': '2023-06-01' },
});
```

**Shadow DOM for content script UI.** If you inject UI into a webpage, your CSS will clash with the host page. Shadow DOM isolates everything.

### WordPress Plugin + React Admin — Key Decisions

**@wordpress/components, not custom UI.** It looks like native WordPress. Users trust it immediately. And you get TextControl, ToggleControl, TabPanel, Notice, Spinner — all for free.

**@wordpress/api-fetch over raw fetch.** It handles nonces automatically. No manual X-WP-Nonce headers.

**Settings as a whitelist.** Only known keys are accepted. Unknown keys are silently dropped. Type-based sanitization (bool → bool, int → absint, email → sanitize_email).

### What's Next

Both boilerplates are available on Gumroad: [link]

$79 each, $149 for the bundle. MIT license for Chrome Extension, GPL-2.0 for WordPress (required for WP.org).

---

*Built by AdeaIT — I build WordPress plugins, Chrome extensions, and Shopify apps.*
