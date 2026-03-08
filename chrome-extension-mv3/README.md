# Chrome Extension MV3 Boilerplate

Production-ready Chrome Extension starter with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**. Built for shipping fast.

## What's Included

| Feature | Details |
|---------|---------|
| **React Pages** | Popup, Side Panel, Options — all with hot reload |
| **Service Worker** | Message routing, alarms, context menus, lifecycle hooks |
| **Content Script** | DOM extraction, Shadow DOM widget injection, isolated styles |
| **Storage API** | Type-safe wrapper with change listeners (`local`, `sync`, `session`) |
| **Message Passing** | Type-safe messaging between all extension contexts |
| **OAuth2** | Google OAuth (chrome.identity) + Generic OAuth2 (GitHub, Discord, etc.) |
| **BYOK Pattern** | API client with Bring-Your-Own-Key — no backend needed |
| **License/Payment** | Gumroad license validation + ExtensionPay support |
| **Tailwind CSS** | Utility-first styling with PostCSS + Autoprefixer |
| **i18n Ready** | `_locales` structure for Chrome Web Store internationalization |

## Quick Start

```bash
# Clone and install
git clone <your-repo>
cd chrome-extension-mv3
pnpm install

# Development (watch mode with hot reload)
pnpm dev

# Production build
pnpm build
```

### Load in Chrome

1. Run `pnpm dev`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → select the `dist/` folder
5. The extension auto-reloads on file changes

## Project Structure

```
src/
├── background/
│   └── service-worker.ts     # Service worker with message handlers
├── popup/
│   ├── index.html            # Popup entry
│   ├── main.tsx              # React mount
│   └── Popup.tsx             # Popup component
├── sidepanel/
│   ├── index.html            # Side panel entry
│   ├── main.tsx              # React mount
│   └── SidePanel.tsx         # Side panel component
├── options/
│   ├── index.html            # Options entry
│   ├── main.tsx              # React mount
│   └── Options.tsx           # Settings page
├── content/
│   ├── index.ts              # Content script (runs on web pages)
│   └── ui.ts                 # Shadow DOM widget injection
├── components/
│   └── ApiKeyInput.tsx       # Reusable BYOK input component
├── lib/
│   ├── storage.ts            # Type-safe chrome.storage wrapper
│   ├── messaging.ts          # Message passing between contexts
│   ├── oauth.ts              # OAuth2 (Google + generic providers)
│   ├── license.ts            # License key validation (Gumroad)
│   ├── api.ts                # BYOK API client helper
│   └── index.ts              # Barrel export
├── manifest.ts               # Manifest V3 config (type-safe)
├── styles.css                # Tailwind entry
└── vite-env.d.ts
```

## Customization Guide

### 1. Update Extension Info

Edit `src/manifest.ts`:
- Change permissions (only request what you need)
- Update `content_scripts.matches` to target specific sites
- Add/remove `host_permissions`

Edit `public/_locales/en/messages.json`:
- Change extension name and description

### 2. Add a New Message Type

```typescript
// In service worker:
onMessage('MY_ACTION', async (msg) => {
  const result = await doSomething(msg.payload);
  return result;
});

// From popup/sidepanel:
const result = await sendMessage({ type: 'MY_ACTION', payload: data });
```

### 3. Use the BYOK API Client

```typescript
import { createApiClient } from '@/lib/api';
import { storage } from '@/lib/storage';

const claude = createApiClient({
  baseUrl: 'https://api.anthropic.com',
  getApiKey: () => storage.get<string>('apiKey'),
  headers: { 'anthropic-version': '2023-06-01' },
});

const response = await claude.post('/v1/messages', {
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

### 4. Gate Features Behind a License

```typescript
import { license } from '@/lib/license';

// Check if pro user
if (!await license.isPro()) {
  showUpgradePrompt();
  return;
}

// Validate a Gumroad license key
const valid = await license.activate('XXXX-XXXX-XXXX');
```

### 5. Inject UI into Web Pages

Uncomment the `injectUI()` call in `src/content/index.ts`. The widget uses Shadow DOM for complete style isolation from the host page.

### 6. Add OAuth2 Login

```typescript
import { genericOAuth } from '@/lib/oauth';

// GitHub OAuth example:
const token = await genericOAuth.authenticate({
  authUrl: 'https://github.com/login/oauth/authorize',
  clientId: 'your-client-id',
  scopes: ['read:user'],
  tokenUrl: 'https://github.com/login/oauth/access_token',
  clientSecret: 'your-secret',
});
```

## Publishing to Chrome Web Store

1. Run `pnpm build`
2. Zip the `dist/` folder
3. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. Pay the one-time $5 developer fee
5. Fill in store listing details
6. Submit for review (typically 1-3 business days)

### Monetization Options

- **Gumroad License Keys**: Built-in validation in `src/lib/license.ts`
- **ExtensionPay**: Drop-in Stripe payments — [extensionpay.com](https://extensionpay.com)
- **Freemium**: Use `license.isPro()` to gate premium features

## Tech Stack

- **React 18** — UI components
- **TypeScript** — Strict mode
- **Vite** + **@crxjs/vite-plugin** — Fast builds with HMR
- **Tailwind CSS 3** — Utility-first styling
- **pnpm** — Fast, disk-efficient package manager

## License

MIT — use this boilerplate for any project, commercial or personal.
