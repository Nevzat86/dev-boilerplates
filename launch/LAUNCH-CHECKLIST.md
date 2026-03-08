# Launch Checklist — Dev Boilerplates Bundle

> Nothing gets published until the product is buyable AND desirable.
> A listing without visuals and proof is worse than no listing.

---

## Phase 0: Validate Before Anything (15 min)

- [ ] **Competitor check**: Search Gumroad for "chrome extension boilerplate", "wordpress plugin starter". What are they charging? What do their listings look like?
- [ ] **Set launch price**: $29 single / $49 bundle. Build reviews and social proof first. Raise price after 20+ sales.
- [ ] **Free hook**: Consider a stripped-down version on GitHub to drive traffic to the paid version

## Phase 1: Make It Buyable (30 min)

### ZIP Files
- [ ] Run `create-zips.ps1` (already done, ZIPs exist)
- [ ] Upload `chrome-extension-mv3-boilerplate.zip` to Chrome Extension product Content tab
- [ ] Upload `wp-plugin-react-admin-boilerplate.zip` to WP Plugin product Content tab
- [ ] Upload `dev-boilerplates-bundle.zip` to Bundle + Video product Content tab
- [ ] Test purchase in Gumroad test mode
- [ ] Download purchased ZIP, unpack, run `pnpm install && pnpm build` — verify it works

### Pricing Update
- [ ] Chrome Extension: $79 -> $29 (launch price)
- [ ] WP Plugin: $79 -> $29 (launch price)
- [ ] Bundle: $149 -> $49 (launch price)
- [ ] Bundle + Video: $199 -> $69 (launch price)
- [ ] Add "Launch price — goes up after first 50 sales" to each description

## Phase 2: Make It Desirable (45 min)

### Cover Images (Canva — free, 10 min each)
- [ ] Chrome Extension cover (1280x720): Code editor screenshot + "Chrome Extension MV3 Starter" text overlay
- [ ] WP Plugin cover (1280x720): React admin panel screenshot + "WordPress Plugin + React Admin" text overlay
- [ ] Bundle cover (1280x720): Both side by side + "Ship in Days, Not Weeks" headline
- [ ] Upload covers to each product's Product tab

### Thumbnails (600x600, square crop of covers)
- [ ] Chrome Extension thumbnail
- [ ] WP Plugin thumbnail
- [ ] Bundle thumbnail

### Screenshots (3-5 per product)
For Chrome Extension:
- [ ] Folder structure in VS Code
- [ ] Popup UI running in Chrome
- [ ] Side Panel open
- [ ] Terminal showing successful `pnpm build`
- [ ] Options page

For WP Plugin:
- [ ] Folder structure in VS Code
- [ ] React admin Dashboard page in WordPress
- [ ] Items CRUD page with pagination
- [ ] Settings page
- [ ] Terminal showing successful build

### Demo Video (optional but high-impact)
- [ ] Screen record "0 to running extension in 3 minutes" using the boilerplate
- [ ] Screen record "0 to WP plugin with admin panel in 3 minutes"
- [ ] Upload to Loom or YouTube, add links to product pages

## Phase 3: Drive Traffic (launch day, 30 min)

> Do NOT launch without Phase 1 + 2 complete.

### Content Marketing
- [ ] **Dev.to article**: "I built the Chrome Extension and WP Plugin boilerplates I wished existed"
  - Show architecture decisions, not just features
  - Include screenshots
  - Link to Gumroad at the end, not the beginning
  - Tags: #webdev #typescript #chrome #wordpress
- [ ] **Reddit r/webdev**: Share as value-first post, not a sales pitch
- [ ] **Reddit r/SideProject**: Launch story angle
- [ ] **Twitter/X**: Thread showing the boilerplate in action (GIF/video)
- [ ] **Indie Hackers**: Product listing

### Optional Amplifiers
- [ ] Product Hunt launch (schedule for a Tuesday/Wednesday)
- [ ] Discord: Chrome Extension dev community, WordPress dev community
- [ ] GitHub: Create a free "lite" version repo that links to the paid full version

## Phase 4: Validate and Iterate (week 1-2)

- [ ] Reply to ALL comments on every platform
- [ ] Track which channel drives actual sales (Gumroad analytics)
- [ ] Ask first 5 buyers for a review (offer next product free in exchange)
- [ ] If 0 sales after 2 weeks of traffic: the product needs repositioning, not more marketing

---

## Current Status

| Step | Status |
|------|--------|
| Gumroad listings created | Done (but no visuals, no ZIPs uploaded) |
| ZIP files generated | Done (3 ZIPs in project root) |
| Cover images | NOT DONE |
| Thumbnails | NOT DONE |
| Screenshots | NOT DONE |
| ZIP uploads | NOT DONE |
| Pricing adjusted | NOT DONE (still at $79/$149/$199) |
| Test purchase | NOT DONE |
| Content marketing | NOT DONE |
| Demo video | NOT DONE |

## Phase 5: Feedback Loops (10 min)

### Gumroad Email Workflow (DONE - saved as draft)
- [x] Welcome email (0 hours): Getting started instructions
- [x] Review request email (7 days): Ask for rating
- [ ] Publish workflow (requires $100 in total Gumroad earnings first)

### Sale Notifications via Discord (5 min)
1. Create a Discord server (or use existing one)
2. Create a channel called #sales
3. Go to Channel Settings > Integrations > Webhooks > New Webhook
4. Copy the webhook URL
5. Go to https://gumroad.com/settings/advanced
6. Paste the webhook URL into the "Ping endpoint" field
7. Click "Send test ping to URL" to verify
8. Click "Update settings"

Your seller_id: `QD-FXrd_6RWpieBX2USr9Q==`

> Note: Gumroad Ping sends raw POST data, not Discord-formatted JSON.
> For proper Discord formatting, use a free Zapier/Make.com zap:
> Trigger: Webhook (paste Gumroad ping URL) -> Action: Discord message.
> Or use a simple Cloudflare Worker to transform the payload (free tier).

### License Keys
- [ ] Enable "Generate a unique license key per sale" on each product's Product tab (under Settings)

---

**Next action**: Create cover images in Canva, take screenshots, upload ZIPs, adjust pricing. THEN launch.
