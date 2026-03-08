# WordPress Plugin + React Admin Boilerplate

Production-ready WordPress plugin starter with a **React-powered admin panel** using `@wordpress/scripts` and `@wordpress/components`. No custom UI library — 100% WordPress-native.

## What's Included

| Feature | Details |
|---------|---------|
| **React Admin Panel** | Dashboard, Items list, Settings — all using `@wordpress/components` |
| **REST API** | Full CRUD endpoints with nonce verification and capability checks |
| **Settings Framework** | Type-safe settings with sanitization, defaults, and REST API |
| **Custom Post Type** | Scaffold with REST support, managed entirely via React admin |
| **Security** | ABSPATH guards, nonces, capability checks, input sanitization, output escaping |
| **Build System** | `@wordpress/scripts` — same toolchain WordPress core uses |
| **i18n Ready** | All strings wrapped in `__()` for translation |
| **API Client** | `@wordpress/api-fetch` with automatic nonce handling |

## Quick Start

```bash
# Install dependencies
cd wp-plugin-react-admin
pnpm install

# Development (watch mode)
pnpm start

# Production build
pnpm build
```

### Install in WordPress

1. Run `pnpm build`
2. Copy (or symlink) the entire `wp-plugin-react-admin/` folder to `wp-content/plugins/`
3. Activate "My Plugin" in WordPress admin
4. Go to the "My Plugin" menu item

## Project Structure

```
wp-plugin-react-admin/
├── my-plugin.php                  # Main plugin file (entry point)
├── package.json                   # Node dependencies + build scripts
├── src/
│   ├── admin/
│   │   ├── index.js               # React entry point
│   │   ├── App.js                 # Tab-based admin shell
│   │   ├── api.js                 # REST API client
│   │   ├── style.css              # Admin styles
│   │   └── pages/
│   │       ├── Dashboard.js       # Overview with stats cards
│   │       ├── Items.js           # CRUD list with pagination
│   │       └── Settings.js        # Settings form with all field types
│   ├── includes/
│   │   ├── class-plugin.php       # Plugin bootstrap + lifecycle
│   │   ├── class-admin.php        # Admin menu + asset enqueuing
│   │   ├── class-settings.php     # Settings API (get/update/sanitize)
│   │   ├── class-rest-api.php     # REST API endpoints
│   │   └── class-cpt.php         # Custom post type registration
│   ├── assets/                    # Static assets (images, etc.)
│   └── public/                    # Public-facing assets
└── build/                         # Compiled assets (generated)
```

## Customization Guide

### 1. Rename the Plugin

Search and replace these strings:

| Find | Replace with |
|------|-------------|
| `My Plugin` | Your Plugin Name |
| `my-plugin` | your-plugin-slug |
| `my_plugin` | your_plugin_prefix |
| `MyPlugin` | YourPlugin |
| `MYPLUGIN` | YOURPLUGIN |
| `myplugin` | yourplugin |

### 2. Add a New Settings Field

1. Add the default in `class-settings.php` → `get_defaults()`
2. Add sanitization in `class-settings.php` → `sanitize_value()`
3. Add the REST API arg in `class-rest-api.php` → `get_settings_args()`
4. Add the UI control in `src/admin/pages/Settings.js`

### 3. Add a New REST Endpoint

```php
// In class-rest-api.php → register_routes():
register_rest_route( self::NAMESPACE, '/my-endpoint', array(
    'methods'             => 'POST',
    'callback'            => array( $this, 'my_callback' ),
    'permission_callback' => array( $this, 'admin_permission_check' ),
    'args'                => array(
        'param' => array(
            'required'          => true,
            'type'              => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ),
    ),
) );
```

### 4. Add a New Admin Page/Tab

1. Add a tab in `src/admin/App.js` → `tabs` array
2. Create a new component in `src/admin/pages/MyPage.js`
3. Add the case in the `TabPanel` switch

### 5. Add a New Custom Post Type

1. Duplicate `class-cpt.php`
2. Change the `POST_TYPE` constant and labels
3. Require the new file in `my-plugin.php`
4. Add REST endpoints in `class-rest-api.php`

## Security Checklist

- [x] `ABSPATH` check on every PHP file
- [x] Nonce verification via `wp_rest` nonce (automatic with `@wordpress/api-fetch`)
- [x] Capability checks (`manage_options`) on all admin endpoints
- [x] Input sanitization (`sanitize_text_field`, `sanitize_email`, `wp_kses_post`, `absint`)
- [x] Output escaping (`esc_html`, `esc_url`, `esc_url_raw`)
- [x] Whitelisted settings keys (only known keys accepted)
- [x] Prepared SQL queries (when using custom tables)
- [x] No direct file access

## Available WordPress Components

The admin panel uses `@wordpress/components` which includes:

- `TextControl`, `TextareaControl`, `SelectControl` — Form inputs
- `ToggleControl`, `CheckboxControl`, `RadioControl` — Boolean inputs
- `Button`, `ButtonGroup` — Actions
- `Card`, `CardBody`, `CardHeader` — Layout
- `Notice` — Feedback messages
- `Spinner` — Loading states
- `TabPanel` — Navigation
- `Modal`, `DropdownMenu`, `Popover` — Overlays

See the full list: [WordPress Components Storybook](https://wordpress.github.io/gutenberg/?path=/docs/docs-introduction--page)

## Tech Stack

- **PHP 7.4+** — Plugin backend
- **React 18** — Admin UI (via `@wordpress/element`)
- **@wordpress/scripts** — Build toolchain
- **@wordpress/components** — Native WP UI components
- **@wordpress/api-fetch** — REST API client with nonce handling

## License

GPL-2.0-or-later — required for WordPress.org distribution.
