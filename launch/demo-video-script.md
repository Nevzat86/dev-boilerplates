# Demo Video Scripts

## Video 1: Chrome Extension MV3 Boilerplate (2-3 min)

### Intro (15 sec)
"I'm going to show you how to go from zero to a working Chrome extension in under 60 seconds with this boilerplate. It includes React, TypeScript, Tailwind, OAuth, payments, and everything you need to ship."

### Setup (30 sec)
- Show terminal: `git clone`, `pnpm install`, `pnpm dev`
- Open Chrome, go to chrome://extensions, Developer mode, Load unpacked → dist/
- Click extension icon → popup appears
- "That's it. Working extension with React and Tailwind."

### Feature Tour (60 sec)
- **Popup**: Click the button, show storage counter incrementing, show tab info
- **Side Panel**: Open it, show the BYOK API key input, save a key
- **Options Page**: Show settings form — toggle, dropdown, API key, save
- **Content Script**: Navigate to a website, show the injected Shadow DOM widget (uncomment first)
- "All four UI surfaces are included — popup, side panel, options, and content script injection."

### Code Tour (45 sec)
- Open `src/lib/storage.ts`: "Type-safe storage wrapper. Get, set, listen for changes."
- Open `src/lib/messaging.ts`: "Type-safe message passing. Register handlers in the service worker, call from anywhere."
- Open `src/lib/oauth.ts`: "OAuth2 for any provider — Google, GitHub, Discord."
- Open `src/lib/license.ts`: "Gumroad license validation built in. Gate your premium features."
- Open `src/lib/api.ts`: "BYOK API client. Users bring their own key, you don't need a backend."

### Outro (15 sec)
"Every pattern you need to ship a Chrome extension. React, TypeScript, auth, payments, messaging, storage — all wired up and building in one second. Link in the description."

---

## Video 2: WordPress Plugin + React Admin (2-3 min)

### Intro (15 sec)
"Here's a WordPress plugin boilerplate with a full React admin panel. Not Gutenberg blocks — a proper dashboard, settings page, and CRUD interface using WordPress's own component library."

### Setup (30 sec)
- Show terminal: `pnpm install`, `pnpm build`
- Show copying to wp-content/plugins/
- Activate in WordPress admin
- Click "My Plugin" in sidebar → Dashboard appears
- "Built with @wordpress/components so it looks native."

### Feature Tour (60 sec)
- **Dashboard tab**: Stats cards (total items, API status, version), getting started guide
- **Items tab**: Create an item (title + content), show it in the table, delete it, show pagination
- **Settings tab**: API key field, toggle, number input, theme dropdown, save → "Saved!" notice
- "Full CRUD, settings management, and a dashboard — all talking to the REST API."

### Code Tour (45 sec)
- Open `my-plugin.php`: "Clean entry point. Autoloads classes, registers hooks."
- Open `class-rest-api.php`: "REST endpoints with permission callbacks and sanitization on every param."
- Open `class-settings.php`: "Settings framework — defaults, type-based sanitization, whitelisted keys only."
- Open `src/admin/api.js`: "Frontend API client using @wordpress/api-fetch. Nonces handled automatically."
- Open `src/admin/pages/Settings.js`: "All @wordpress/components — TextControl, ToggleControl, Notice. Looks like core WordPress."

### Outro (15 sec)
"Security baked in — nonces, capability checks, sanitization, escaping. Ready for WordPress.org submission. Link in the description."
