"""
Video Walkthrough Generator
Generates narrated walkthrough videos from HTML slides + edge-tts + ffmpeg.

Usage: python generate_videos.py [chrome|wp|both]
"""

import asyncio
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

FFMPEG = r"C:\Users\Tex\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"
OUTPUT_DIR = Path(__file__).parent
VOICE = "en-US-GuyNeural"  # Professional male voice
RATE = "-5%"  # Slightly slower for clarity
WIDTH, HEIGHT = 1920, 1080


def slide_html(title: str, content: str, footer: str = "", bg_color: str = "#1a1a2e") -> str:
    """Generate an HTML slide with dark theme code-presentation style."""
    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    width: {WIDTH}px; height: {HEIGHT}px;
    background: {bg_color};
    color: #e0e0e0;
    font-family: 'Inter', sans-serif;
    display: flex; flex-direction: column;
    padding: 60px 80px;
    overflow: hidden;
  }}
  h1 {{
    font-size: 48px; font-weight: 700;
    color: #00d4ff;
    margin-bottom: 40px;
    line-height: 1.2;
  }}
  .content {{
    flex: 1;
    font-size: 24px;
    line-height: 1.8;
  }}
  .content pre {{
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 12px;
    padding: 24px 32px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    line-height: 1.6;
    overflow: hidden;
    margin: 16px 0;
  }}
  .content ul {{ list-style: none; padding: 0; }}
  .content ul li {{
    padding: 8px 0;
    padding-left: 30px;
    position: relative;
  }}
  .content ul li::before {{
    content: "\\2714";
    color: #00d4ff;
    position: absolute;
    left: 0;
    font-size: 20px;
  }}
  .highlight {{ color: #00d4ff; font-weight: 600; }}
  .tag {{
    display: inline-block;
    background: #00d4ff22;
    color: #00d4ff;
    padding: 4px 14px;
    border-radius: 6px;
    font-size: 16px;
    margin: 4px;
    font-weight: 500;
  }}
  .file-tree {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px;
    line-height: 1.8;
    background: #0d1117;
    border-radius: 12px;
    padding: 24px 32px;
    border: 1px solid #30363d;
  }}
  .file-tree .dir {{ color: #79c0ff; }}
  .file-tree .file {{ color: #c9d1d9; }}
  .footer {{
    font-size: 18px;
    color: #888;
    margin-top: 20px;
  }}
  .two-col {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }}
  .col-title {{
    font-size: 28px;
    font-weight: 600;
    color: #00d4ff;
    margin-bottom: 16px;
  }}
</style>
</head><body>
<h1>{title}</h1>
<div class="content">{content}</div>
{f'<div class="footer">{footer}</div>' if footer else ''}
</body></html>"""


# ─── Chrome Extension MV3 Slides ───────────────────────────────────────────

CHROME_SLIDES = [
    {
        "title": "Chrome Extension MV3 Boilerplate",
        "content": """
        <div style="margin-top: 40px;">
            <p style="font-size: 32px; margin-bottom: 30px;">Production-ready starter for modern Chrome extensions</p>
            <div style="margin-top: 20px;">
                <span class="tag">React 18</span>
                <span class="tag">TypeScript</span>
                <span class="tag">Vite 6</span>
                <span class="tag">Tailwind CSS</span>
                <span class="tag">Manifest V3</span>
            </div>
            <ul style="margin-top: 40px; font-size: 28px;">
                <li>Popup, Side Panel, Options pages</li>
                <li>Service Worker with message routing</li>
                <li>Content scripts with Shadow DOM</li>
                <li>OAuth2, BYOK API client, License validation</li>
            </ul>
        </div>""",
        "narration": "Welcome to the Chrome Extension MV3 Boilerplate walkthrough. This is a production-ready starter built with React 18, TypeScript, Vite 6, and Tailwind CSS. It includes everything you need: popup, side panel, and options pages, a service worker with message routing, content scripts with Shadow DOM isolation, OAuth2 authentication, a bring-your-own-key API client, and Gumroad license validation.",
        "duration": 18,
    },
    {
        "title": "Project Structure",
        "content": """
        <div class="file-tree">
<span class="dir">src/</span>
  <span class="dir">background/</span>
    <span class="file">service-worker.ts</span>     <span style="color:#6a9955">← Alarms, context menus, message routing</span>
  <span class="dir">popup/</span>
    <span class="file">Popup.tsx</span>              <span style="color:#6a9955">← Main popup UI component</span>
  <span class="dir">sidepanel/</span>
    <span class="file">SidePanel.tsx</span>           <span style="color:#6a9955">← Side panel UI</span>
  <span class="dir">options/</span>
    <span class="file">Options.tsx</span>             <span style="color:#6a9955">← Full-page options</span>
  <span class="dir">content/</span>
    <span class="file">index.ts</span>               <span style="color:#6a9955">← Content script entry</span>
    <span class="file">ui.ts</span>                  <span style="color:#6a9955">← Shadow DOM widget injection</span>
  <span class="dir">lib/</span>
    <span class="file">storage.ts</span>             <span style="color:#6a9955">← Type-safe chrome.storage wrapper</span>
    <span class="file">messaging.ts</span>           <span style="color:#6a9955">← Message passing utilities</span>
    <span class="file">api.ts</span>                 <span style="color:#6a9955">← BYOK API client</span>
    <span class="file">oauth.ts</span>               <span style="color:#6a9955">← OAuth2 (Google, GitHub, Discord)</span>
    <span class="file">license.ts</span>             <span style="color:#6a9955">← Gumroad license validation</span>
  <span class="dir">components/</span>
    <span class="file">ApiKeyInput.tsx</span>         <span style="color:#6a9955">← Reusable API key component</span>
        </div>""",
        "narration": "Here's the project structure. The source directory is organized by Chrome extension context. The background folder has the service worker with alarms, context menus, and message routing. You get three separate UI entry points: popup, side panel, and options. The content folder handles content script injection with Shadow DOM isolation. And the lib folder contains all the reusable utilities: type-safe storage, message passing, the BYOK API client, OAuth2, and license validation.",
        "duration": 22,
    },
    {
        "title": "Type-Safe Storage Wrapper",
        "content": """<pre><span style="color:#c586c0">import</span> { storage } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'@/lib/storage'</span>;

<span style="color:#6a9955">// Get typed values — no casting needed</span>
<span style="color:#c586c0">const</span> <span style="color:#9cdcfe">apiKey</span> = <span style="color:#c586c0">await</span> storage.<span style="color:#dcdcaa">get</span>&lt;<span style="color:#4ec9b0">string</span>&gt;(<span style="color:#ce9178">'apiKey'</span>);
<span style="color:#c586c0">const</span> <span style="color:#9cdcfe">settings</span> = <span style="color:#c586c0">await</span> storage.<span style="color:#dcdcaa">get</span>&lt;<span style="color:#4ec9b0">UserSettings</span>&gt;(<span style="color:#ce9178">'settings'</span>);

<span style="color:#6a9955">// Set values with type checking</span>
<span style="color:#c586c0">await</span> storage.<span style="color:#dcdcaa">set</span>(<span style="color:#ce9178">'apiKey'</span>, <span style="color:#ce9178">'sk-...'</span>);

<span style="color:#6a9955">// Listen for changes across all contexts</span>
storage.<span style="color:#dcdcaa">onChange</span>&lt;<span style="color:#4ec9b0">string</span>&gt;(<span style="color:#ce9178">'apiKey'</span>, (<span style="color:#9cdcfe">newVal</span>, <span style="color:#9cdcfe">oldVal</span>) => {
  console.<span style="color:#dcdcaa">log</span>(<span style="color:#ce9178">'API key changed'</span>);
});</pre>
        <ul style="margin-top: 20px;">
            <li>Works across popup, service worker, content scripts</li>
            <li>Generic types — no manual casting</li>
            <li>Change listeners for reactive updates</li>
        </ul>""",
        "narration": "The storage wrapper gives you type-safe access to chrome.storage across all extension contexts. Use generics to get typed values without manual casting. Set values with type checking. And listen for changes reactively — when the popup updates a setting, the service worker and content scripts are notified instantly.",
        "duration": 16,
    },
    {
        "title": "BYOK API Client",
        "content": """<pre><span style="color:#c586c0">import</span> { createApiClient } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'@/lib/api'</span>;

<span style="color:#6a9955">// Configure for any API provider</span>
<span style="color:#c586c0">const</span> <span style="color:#9cdcfe">claude</span> = <span style="color:#dcdcaa">createApiClient</span>({
  <span style="color:#9cdcfe">baseUrl</span>: <span style="color:#ce9178">'https://api.anthropic.com'</span>,
  <span style="color:#9cdcfe">getApiKey</span>: () => storage.<span style="color:#dcdcaa">get</span>&lt;<span style="color:#4ec9b0">string</span>&gt;(<span style="color:#ce9178">'apiKey'</span>),
  <span style="color:#9cdcfe">headers</span>: { <span style="color:#ce9178">'anthropic-version'</span>: <span style="color:#ce9178">'2023-06-01'</span> },
});

<span style="color:#6a9955">// Make type-safe API calls</span>
<span style="color:#c586c0">const</span> <span style="color:#9cdcfe">response</span> = <span style="color:#c586c0">await</span> claude.<span style="color:#dcdcaa">post</span>&lt;<span style="color:#4ec9b0">ChatResponse</span>&gt;(
  <span style="color:#ce9178">'/v1/messages'</span>,
  { <span style="color:#9cdcfe">model</span>: <span style="color:#ce9178">'claude-sonnet-4-20250514'</span>, <span style="color:#9cdcfe">messages</span>: [...] }
);</pre>
        <p style="margin-top: 20px; font-size: 22px; color: #aaa;">
            Users provide their own API key — <span class="highlight">no backend needed</span>.
            <br>Works with Claude, OpenAI, Gemini, or any REST API.
        </p>""",
        "narration": "The bring-your-own-key pattern is a game changer. Users provide their own API key, so you don't need a backend or proxy server. The API client is configurable for any provider: Claude, OpenAI, Gemini, or any REST API. It handles key retrieval from storage, custom headers, and type-safe responses automatically.",
        "duration": 16,
    },
    {
        "title": "Shadow DOM Content Scripts",
        "content": """<pre><span style="color:#6a9955">// content/ui.ts — Inject UI without CSS conflicts</span>

<span style="color:#c586c0">export function</span> <span style="color:#dcdcaa">injectWidget</span>() {
  <span style="color:#c586c0">const</span> <span style="color:#9cdcfe">host</span> = document.<span style="color:#dcdcaa">createElement</span>(<span style="color:#ce9178">'div'</span>);
  <span style="color:#c586c0">const</span> <span style="color:#9cdcfe">shadow</span> = host.<span style="color:#dcdcaa">attachShadow</span>({ <span style="color:#9cdcfe">mode</span>: <span style="color:#ce9178">'closed'</span> });

  <span style="color:#6a9955">// Your styles are completely isolated</span>
  shadow.<span style="color:#9cdcfe">innerHTML</span> = <span style="color:#ce9178">`
    &lt;style&gt;
      .widget { /* your CSS here */ }
    &lt;/style&gt;
    &lt;div class="widget"&gt;
      &lt;!-- Your React app mounts here --&gt;
    &lt;/div&gt;
  `</span>;

  document.<span style="color:#9cdcfe">body</span>.<span style="color:#dcdcaa">appendChild</span>(host);
  <span style="color:#c586c0">return</span> shadow.<span style="color:#dcdcaa">querySelector</span>(<span style="color:#ce9178">'.widget'</span>);
}</pre>
        <ul style="margin-top: 20px;">
            <li>Host page CSS cannot affect your widget</li>
            <li>Your CSS cannot break the host page</li>
            <li>Closed shadow root for full encapsulation</li>
        </ul>""",
        "narration": "Content scripts inject UI directly into web pages, which means CSS conflicts are inevitable. The boilerplate uses Shadow DOM to completely isolate your widget. The host page CSS cannot affect your components, and your styles cannot break the host page. It uses a closed shadow root for full encapsulation.",
        "duration": 15,
    },
    {
        "title": "OAuth2 + License Validation",
        "content": """
        <div class="two-col">
            <div>
                <div class="col-title">OAuth2 Authentication</div>
<pre style="font-size: 16px"><span style="color:#c586c0">import</span> { startOAuth } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'@/lib/oauth'</span>;

<span style="color:#6a9955">// Google, GitHub, Discord</span>
<span style="color:#c586c0">const</span> <span style="color:#9cdcfe">token</span> = <span style="color:#c586c0">await</span> <span style="color:#dcdcaa">startOAuth</span>({
  <span style="color:#9cdcfe">provider</span>: <span style="color:#ce9178">'google'</span>,
  <span style="color:#9cdcfe">clientId</span>: <span style="color:#ce9178">'your-id'</span>,
  <span style="color:#9cdcfe">scopes</span>: [<span style="color:#ce9178">'profile'</span>],
});</pre>
            </div>
            <div>
                <div class="col-title">Gumroad License Keys</div>
<pre style="font-size: 16px"><span style="color:#c586c0">import</span> { validateLicense }
  <span style="color:#c586c0">from</span> <span style="color:#ce9178">'@/lib/license'</span>;

<span style="color:#c586c0">const</span> <span style="color:#9cdcfe">result</span> = <span style="color:#c586c0">await</span> <span style="color:#dcdcaa">validateLicense</span>(
  <span style="color:#ce9178">'product-id'</span>,
  <span style="color:#9cdcfe">userKey</span>
);
<span style="color:#6a9955">// { valid, uses, email }</span></pre>
            </div>
        </div>
        <p style="margin-top: 30px; font-size: 22px; color: #aaa;">
            Monetize from day one. OAuth2 for user identity. Gumroad for paid licenses.
        </p>""",
        "narration": "Authentication and monetization are built in. The OAuth2 module supports Google, GitHub, and Discord with a clean configuration API. For monetization, the Gumroad license validation lets you ship a paid extension immediately. Validate license keys, track usage counts, and gate premium features. You can monetize from day one.",
        "duration": 16,
    },
    {
        "title": "Build & Ship",
        "content": """<pre style="font-size: 22px">
<span style="color:#6a9955">$</span> <span style="color:#dcdcaa">pnpm install</span>
<span style="color:#888">Packages: +47</span>
<span style="color:#888">Done in 3.2s</span>

<span style="color:#6a9955">$</span> <span style="color:#dcdcaa">pnpm build</span>
<span style="color:#888">✓ TypeScript check passed</span>
<span style="color:#888">✓ 6 entry points built</span>
<span style="color:#888">✓ Output: dist/</span>
<span style="color:#4ec9b0">Done in 0.8s</span>
</pre>
        <ul style="margin-top: 30px; font-size: 26px;">
            <li>Load <span class="highlight">dist/</span> folder in chrome://extensions</li>
            <li>Hot reload with <span class="highlight">pnpm dev</span></li>
            <li>ZIP the dist folder and publish to Chrome Web Store</li>
        </ul>
        <p style="margin-top: 30px; font-size: 22px; color: #aaa;">
            No @crxjs/vite-plugin dependency — works with any Vite version.
        </p>""",
        "narration": "Building is fast and simple. Run pnpm install, then pnpm build. TypeScript is checked, all six entry points are compiled, and the output lands in the dist folder in under one second. Load the dist folder in Chrome extensions for testing, use pnpm dev for hot reload during development, and zip the dist folder to publish on the Chrome Web Store. No crxjs vite plugin dependency, so it works with any Vite version.",
        "duration": 18,
    },
    {
        "title": "Chrome Extension MV3 Boilerplate",
        "content": """
        <div style="text-align: center; margin-top: 60px;">
            <p style="font-size: 36px; margin-bottom: 40px;">Save 2-3 weeks on your next Chrome extension</p>
            <div style="margin-bottom: 40px;">
                <span class="tag">React 18</span>
                <span class="tag">TypeScript</span>
                <span class="tag">Vite 6</span>
                <span class="tag">Tailwind CSS</span>
            </div>
            <p style="font-size: 28px; color: #00d4ff;">adeait.gumroad.com</p>
            <p style="font-size: 22px; color: #888; margin-top: 20px;">
                Popup &bull; Side Panel &bull; Options &bull; Service Worker &bull; Content Scripts<br>
                OAuth2 &bull; BYOK API Client &bull; License Validation &bull; Shadow DOM
            </p>
        </div>""",
        "narration": "That's the Chrome Extension MV3 Boilerplate. It gives you a complete, production-ready foundation with React, TypeScript, Vite, and Tailwind. Everything you need to build and ship a Chrome extension, from UI to authentication to monetization. Save two to three weeks on your next project. Available at adeait.gumroad.com.",
        "duration": 16,
    },
]


# ─── WordPress Plugin React Admin Slides ────────────────────────────────────

WP_SLIDES = [
    {
        "title": "WordPress Plugin + React Admin",
        "content": """
        <div style="margin-top: 40px;">
            <p style="font-size: 32px; margin-bottom: 30px;">A modern WordPress plugin with a full React admin panel</p>
            <div style="margin-top: 20px;">
                <span class="tag">PHP 7.4+</span>
                <span class="tag">@wordpress/scripts</span>
                <span class="tag">@wordpress/components</span>
                <span class="tag">REST API</span>
                <span class="tag">React</span>
            </div>
            <ul style="margin-top: 40px; font-size: 28px;">
                <li>Dashboard, CRUD Items, Settings pages</li>
                <li>REST API with nonce verification</li>
                <li>Custom Post Type scaffold</li>
                <li>Native WordPress look and feel</li>
            </ul>
        </div>""",
        "narration": "Welcome to the WordPress Plugin React Admin Boilerplate walkthrough. This gives you a modern WordPress plugin with a full React-powered admin panel. It uses the official WordPress scripts and components packages, so everything looks and feels native. You get a dashboard, a full CRUD items page, and a settings page, all backed by a REST API with proper security.",
        "duration": 18,
    },
    {
        "title": "Project Structure",
        "content": """
        <div class="file-tree">
<span class="dir">my-plugin.php</span>              <span style="color:#6a9955">← Main plugin file, constants, hooks</span>
<span class="dir">src/</span>
  <span class="dir">admin/</span>
    <span class="file">index.js</span>               <span style="color:#6a9955">← React entry point</span>
    <span class="file">App.js</span>                 <span style="color:#6a9955">← Tab navigation (Dashboard, Items, Settings)</span>
    <span class="file">api.js</span>                 <span style="color:#6a9955">← wp.apiFetch wrapper</span>
    <span class="dir">pages/</span>
      <span class="file">Dashboard.js</span>         <span style="color:#6a9955">← Overview with stats cards</span>
      <span class="file">Items.js</span>             <span style="color:#6a9955">← Full CRUD list with add/edit/delete</span>
      <span class="file">Settings.js</span>          <span style="color:#6a9955">← Settings form with save/reset</span>
    <span class="file">style.css</span>              <span style="color:#6a9955">← Admin styles</span>
  <span class="dir">includes/</span>
    <span class="file">class-plugin.php</span>       <span style="color:#6a9955">← Plugin initialization</span>
    <span class="file">class-admin.php</span>        <span style="color:#6a9955">← Admin page registration, asset enqueuing</span>
    <span class="file">class-rest-api.php</span>     <span style="color:#6a9955">← REST endpoints with permissions</span>
    <span class="file">class-settings.php</span>     <span style="color:#6a9955">← Settings API with sanitization</span>
    <span class="file">class-cpt.php</span>          <span style="color:#6a9955">← Custom Post Type registration</span>
        </div>""",
        "narration": "The project is cleanly organized. The main plugin file defines constants and hooks. The admin folder contains the React app with tab-based navigation for Dashboard, Items, and Settings. The includes folder has the PHP backend: plugin initialization, admin page registration, REST API endpoints with permission checks, a settings framework with type-based sanitization, and a Custom Post Type scaffold.",
        "duration": 22,
    },
    {
        "title": "Native WordPress Components",
        "content": """<pre><span style="color:#c586c0">import</span> {
  <span style="color:#9cdcfe">Card, CardBody, TextControl,
  ToggleControl, Button, Spinner,
  TabPanel, Notice</span>
} <span style="color:#c586c0">from</span> <span style="color:#ce9178">'@wordpress/components'</span>;

<span style="color:#c586c0">function</span> <span style="color:#dcdcaa">Settings</span>() {
  <span style="color:#c586c0">return</span> (
    &lt;<span style="color:#4ec9b0">Card</span>&gt;
      &lt;<span style="color:#4ec9b0">CardBody</span>&gt;
        &lt;<span style="color:#4ec9b0">TextControl</span>
          <span style="color:#9cdcfe">label</span>=<span style="color:#ce9178">"Site Title"</span>
          <span style="color:#9cdcfe">value</span>={<span style="color:#9cdcfe">title</span>}
          <span style="color:#9cdcfe">onChange</span>={<span style="color:#9cdcfe">setTitle</span>}
        /&gt;
        &lt;<span style="color:#4ec9b0">ToggleControl</span>
          <span style="color:#9cdcfe">label</span>=<span style="color:#ce9178">"Enable Feature"</span>
          <span style="color:#9cdcfe">checked</span>={<span style="color:#9cdcfe">enabled</span>}
          <span style="color:#9cdcfe">onChange</span>={<span style="color:#9cdcfe">setEnabled</span>}
        /&gt;
      &lt;/<span style="color:#4ec9b0">CardBody</span>&gt;
    &lt;/<span style="color:#4ec9b0">Card</span>&gt;
  );
}</pre>
        <p style="margin-top: 16px; font-size: 22px; color: #aaa;">
            Looks exactly like native WordPress admin — users trust it immediately.
        </p>""",
        "narration": "The admin panel uses official WordPress components. Cards, text controls, toggle controls, buttons, spinners, tab panels, and notices — all from the WordPress components package. This means your plugin looks exactly like the native WordPress admin. Users trust it immediately because it matches the interface they already know.",
        "duration": 16,
    },
    {
        "title": "REST API with Security",
        "content": """<pre><span style="color:#c586c0">class</span> <span style="color:#4ec9b0">Rest_API</span> {
  <span style="color:#c586c0">public function</span> <span style="color:#dcdcaa">register_routes</span>() {
    <span style="color:#dcdcaa">register_rest_route</span>( <span style="color:#ce9178">'my-plugin/v1'</span>, <span style="color:#ce9178">'/items'</span>, [
      [
        <span style="color:#ce9178">'methods'</span>  => <span style="color:#ce9178">'GET'</span>,
        <span style="color:#ce9178">'callback'</span> => [ <span style="color:#9cdcfe">$this</span>, <span style="color:#ce9178">'get_items'</span> ],
        <span style="color:#ce9178">'permission_callback'</span> => [ <span style="color:#9cdcfe">$this</span>, <span style="color:#ce9178">'admin_check'</span> ],
      ],
      [
        <span style="color:#ce9178">'methods'</span>  => <span style="color:#ce9178">'POST'</span>,
        <span style="color:#ce9178">'callback'</span> => [ <span style="color:#9cdcfe">$this</span>, <span style="color:#ce9178">'create_item'</span> ],
        <span style="color:#ce9178">'permission_callback'</span> => [ <span style="color:#9cdcfe">$this</span>, <span style="color:#ce9178">'admin_check'</span> ],
      ],
    ]);
  }

  <span style="color:#c586c0">public function</span> <span style="color:#dcdcaa">admin_check</span>() {
    <span style="color:#c586c0">return</span> <span style="color:#dcdcaa">current_user_can</span>( <span style="color:#ce9178">'manage_options'</span> );
  }
}</pre>
        <ul style="margin-top: 16px;">
            <li>Every endpoint has a permission callback</li>
            <li>Nonce verification via @wordpress/api-fetch</li>
            <li>Input sanitized, output escaped</li>
        </ul>""",
        "narration": "Security is built into every layer. Every REST API endpoint has a permission callback that checks user capabilities. Nonce verification is handled automatically through the WordPress API fetch package. All input is sanitized on the server side, and all output is escaped. No shortcuts, no vulnerabilities.",
        "duration": 15,
    },
    {
        "title": "Settings Framework",
        "content": """<pre><span style="color:#c586c0">class</span> <span style="color:#4ec9b0">Settings</span> {
  <span style="color:#c586c0">private</span> <span style="color:#9cdcfe">$schema</span> = [
    <span style="color:#ce9178">'site_title'</span>  => [ <span style="color:#ce9178">'type'</span> => <span style="color:#ce9178">'string'</span>,  <span style="color:#ce9178">'default'</span> => <span style="color:#ce9178">''</span> ],
    <span style="color:#ce9178">'is_enabled'</span>  => [ <span style="color:#ce9178">'type'</span> => <span style="color:#ce9178">'bool'</span>,    <span style="color:#ce9178">'default'</span> => <span style="color:#b5cea8">false</span> ],
    <span style="color:#ce9178">'max_items'</span>   => [ <span style="color:#ce9178">'type'</span> => <span style="color:#ce9178">'int'</span>,     <span style="color:#ce9178">'default'</span> => <span style="color:#b5cea8">10</span> ],
    <span style="color:#ce9178">'admin_email'</span> => [ <span style="color:#ce9178">'type'</span> => <span style="color:#ce9178">'email'</span>,   <span style="color:#ce9178">'default'</span> => <span style="color:#ce9178">''</span> ],
  ];

  <span style="color:#c586c0">public function</span> <span style="color:#dcdcaa">sanitize</span>( <span style="color:#9cdcfe">$input</span> ) {
    <span style="color:#6a9955">// Only whitelisted keys accepted</span>
    <span style="color:#6a9955">// Type-based sanitization applied automatically</span>
    <span style="color:#6a9955">// bool → bool, int → absint, email → sanitize_email</span>
  }
}</pre>
        <ul style="margin-top: 20px;">
            <li>Schema-based: define once, sanitize everywhere</li>
            <li>Unknown keys silently dropped</li>
            <li>Type coercion prevents data corruption</li>
        </ul>""",
        "narration": "The settings framework uses a schema-based approach. Define your settings once with types and defaults, and sanitization is applied automatically. Strings are sanitized as text fields, booleans are cast properly, integers use absint, and emails use sanitize email. Unknown keys are silently dropped, so injection of unexpected data is impossible.",
        "duration": 16,
    },
    {
        "title": "Build & Ship",
        "content": """<pre style="font-size: 22px">
<span style="color:#6a9955">$</span> <span style="color:#dcdcaa">pnpm install</span>
<span style="color:#888">Packages: +285</span>
<span style="color:#888">Done in 5.1s</span>

<span style="color:#6a9955">$</span> <span style="color:#dcdcaa">pnpm build</span>
<span style="color:#888">✓ Compiled admin/index.js → build/index.js</span>
<span style="color:#888">✓ Compiled admin/style.css → build/style-index.css</span>
<span style="color:#4ec9b0">Done in 1.3s</span>
</pre>
        <ul style="margin-top: 30px; font-size: 26px;">
            <li>ZIP the plugin folder → upload to WordPress</li>
            <li>React admin loads on your plugin's menu page</li>
            <li>Hot reload with <span class="highlight">pnpm start</span></li>
        </ul>
        <p style="margin-top: 30px; font-size: 22px; color: #aaa;">
            Uses @wordpress/scripts — the official WordPress build toolchain.
        </p>""",
        "narration": "Building is simple. Run pnpm install, then pnpm build. The official WordPress scripts toolchain compiles your React app and CSS in about one second. Zip the plugin folder, upload to WordPress, and the React admin panel loads on your plugin's menu page. Use pnpm start for hot reload during development.",
        "duration": 15,
    },
    {
        "title": "WordPress Plugin + React Admin",
        "content": """
        <div style="text-align: center; margin-top: 60px;">
            <p style="font-size: 36px; margin-bottom: 40px;">The WordPress plugin boilerplate that doesn't exist yet</p>
            <div style="margin-bottom: 40px;">
                <span class="tag">PHP</span>
                <span class="tag">React</span>
                <span class="tag">@wordpress/components</span>
                <span class="tag">REST API</span>
            </div>
            <p style="font-size: 28px; color: #00d4ff;">adeait.gumroad.com</p>
            <p style="font-size: 22px; color: #888; margin-top: 20px;">
                Dashboard &bull; CRUD Items &bull; Settings &bull; REST API &bull; Custom Post Types<br>
                Nonce verification &bull; Capability checks &bull; Sanitization &bull; Escaping
            </p>
        </div>""",
        "narration": "That's the WordPress Plugin React Admin Boilerplate. There are seventy plus Next JS SaaS starters on the market, but zero premium WordPress plugin boilerplates with a React admin panel. This fills that gap. Dashboard, CRUD, Settings, REST API, Custom Post Types, and all the security patterns baked in. Available at adeait.gumroad.com.",
        "duration": 17,
    },
]


async def generate_tts(text: str, output_path: str) -> float:
    """Generate TTS audio and return duration in seconds."""
    import edge_tts

    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(output_path)

    # Get audio duration via ffprobe
    result = subprocess.run(
        [FFMPEG.replace("ffmpeg.exe", "ffprobe.exe"), "-v", "error",
         "-show_entries", "format=duration", "-of",
         "default=noprint_wrappers=1:nokey=1", output_path],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())


def create_slide_file(slide: dict, index: int, tmp_dir: str) -> str:
    """Create HTML file for a slide and return its path."""
    html = slide_html(slide["title"], slide["content"])
    path = os.path.join(tmp_dir, f"slide_{index:02d}.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    return path


async def generate_video(slides: list, output_name: str):
    """Generate a narrated video from slides."""
    tmp_dir = tempfile.mkdtemp(prefix="video_")
    print(f"\nWorking directory: {tmp_dir}")
    print(f"Generating {len(slides)} slides for: {output_name}")

    # Step 1: Create HTML files and generate TTS audio
    audio_files = []
    html_files = []
    durations = []

    for i, slide in enumerate(slides):
        print(f"  [{i+1}/{len(slides)}] {slide['title']}")

        # Create HTML
        html_path = create_slide_file(slide, i, tmp_dir)
        html_files.append(html_path)

        # Generate TTS
        audio_path = os.path.join(tmp_dir, f"audio_{i:02d}.mp3")
        actual_duration = await generate_tts(slide["narration"], audio_path)
        audio_files.append(audio_path)
        # Use actual audio duration + 1s padding
        durations.append(actual_duration + 1.0)
        print(f"    Audio: {actual_duration:.1f}s")

    # Step 2: Take screenshots using Playwright (headless Chromium via subprocess)
    print("\n  Taking screenshots with Playwright...")
    screenshot_script = os.path.join(tmp_dir, "screenshots.js")
    screenshots = []

    # Build a Node.js script to take all screenshots
    screenshot_cmds = []
    for i, html_path in enumerate(html_files):
        png_path = os.path.join(tmp_dir, f"slide_{i:02d}.png")
        screenshots.append(png_path)
        file_url = "file:///" + html_path.replace("\\", "/")
        screenshot_cmds.append(f"""
    await page.goto('{file_url}');
    await page.waitForTimeout(500);
    await page.screenshot({{ path: '{png_path.replace(chr(92), "/")}', type: 'png' }});
    console.log('  Screenshot {i+1}/{len(html_files)}');""")

    # Find playwright from global npm install
    pw_path = subprocess.run(
        ["node", "-e", "console.log(require.resolve('playwright'))"],
        capture_output=True, text=True,
        env={**os.environ, "NODE_PATH": os.path.join(os.environ.get("APPDATA", ""), "npm", "node_modules")}
    ).stdout.strip().replace("\\", "/")
    pw_dir = "/".join(pw_path.split("/")[:-1])

    script_content = f"""const {{ chromium }} = require('{pw_dir}');
(async () => {{
  const browser = await chromium.launch({{ headless: true }});
  const page = await browser.newPage({{ viewport: {{ width: {WIDTH}, height: {HEIGHT} }} }});
  {"".join(screenshot_cmds)}
  await browser.close();
  console.log('Done');
}})();"""

    with open(screenshot_script, "w") as f:
        f.write(script_content)

    # Use node directly with playwright
    result = subprocess.run(
        ["node", screenshot_script],
        capture_output=True, text=True, cwd=tmp_dir,
        timeout=120, shell=True,
        env={**os.environ, "NODE_PATH": os.path.join(os.environ.get("APPDATA", ""), "npm", "node_modules")}
    )
    if result.returncode != 0:
        print(f"  Screenshot error: {result.stderr}")
        # Fallback: use npx playwright-core
        print("  Trying fallback screenshot method...")
        for i, html_path in enumerate(html_files):
            png_path = os.path.join(tmp_dir, f"slide_{i:02d}.png")
            file_url = "file:///" + html_path.replace("\\", "/")
            fallback_script = f"""const {{ chromium }} = require('playwright');
(async () => {{
  const browser = await chromium.launch({{ headless: true }});
  const page = await browser.newPage({{ viewport: {{ width: {WIDTH}, height: {HEIGHT} }} }});
  await page.goto('{file_url}');
  await page.waitForTimeout(500);
  await page.screenshot({{ path: '{png_path.replace(chr(92), "/")}' }});
  await browser.close();
}})();"""
            fb_script_path = os.path.join(tmp_dir, f"fb_{i}.js")
            with open(fb_script_path, "w") as f:
                f.write(fallback_script)
            subprocess.run(["node", fb_script_path], cwd=tmp_dir, timeout=30, shell=True,
                          env={**os.environ, "NODE_PATH": os.path.join(os.environ.get("APPDATA", ""), "npm", "node_modules")})
    else:
        print(result.stdout)

    # Step 3: Assemble video with ffmpeg
    print("\n  Assembling video with ffmpeg...")

    # Create individual slide videos (image + audio)
    segment_files = []
    for i in range(len(slides)):
        segment = os.path.join(tmp_dir, f"segment_{i:02d}.mp4")
        segment_files.append(segment)
        subprocess.run([
            FFMPEG, "-y",
            "-loop", "1", "-i", screenshots[i],
            "-i", audio_files[i],
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-c:a", "aac", "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-vf", f"scale={WIDTH}:{HEIGHT}",
            "-shortest",
            "-t", str(durations[i]),
            segment
        ], capture_output=True, timeout=60, shell=True)
        print(f"    Segment {i+1}/{len(slides)}")

    # Create concat file
    concat_file = os.path.join(tmp_dir, "concat.txt")
    with open(concat_file, "w") as f:
        for seg in segment_files:
            f.write(f"file '{seg.replace(chr(92), '/')}'\n")

    # Concat all segments
    output_path = str(OUTPUT_DIR / f"{output_name}.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_file,
        "-c:v", "libx264",
        "-c:a", "aac",
        "-movflags", "+faststart",
        output_path
    ], capture_output=True, timeout=120, shell=True)

    print(f"\n  Output: {output_path}")

    # Get final duration
    result = subprocess.run(
        [FFMPEG.replace("ffmpeg.exe", "ffprobe.exe"), "-v", "error",
         "-show_entries", "format=duration", "-of",
         "default=noprint_wrappers=1:nokey=1", output_path],
        capture_output=True, text=True
    )
    if result.stdout.strip():
        print(f"  Duration: {float(result.stdout.strip()):.1f}s")

    return output_path


async def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "both"

    if target in ("chrome", "both"):
        print("=" * 60)
        print("CHROME EXTENSION MV3 WALKTHROUGH")
        print("=" * 60)
        await generate_video(CHROME_SLIDES, "chrome-extension-walkthrough")

    if target in ("wp", "both"):
        print("\n" + "=" * 60)
        print("WORDPRESS PLUGIN REACT ADMIN WALKTHROUGH")
        print("=" * 60)
        await generate_video(WP_SLIDES, "wp-plugin-walkthrough")

    print("\nDone! Videos saved to:", OUTPUT_DIR)


if __name__ == "__main__":
    asyncio.run(main())
