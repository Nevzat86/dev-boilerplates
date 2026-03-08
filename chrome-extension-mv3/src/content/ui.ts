/**
 * Inject a Shadow DOM widget into the host page.
 * Uses Shadow DOM to isolate styles from the host page.
 */
export function injectUI() {
  if (document.getElementById('myext-root')) return;

  const host = document.createElement('div');
  host.id = 'myext-root';
  const shadow = host.attachShadow({ mode: 'closed' });

  shadow.innerHTML = `
    <style>
      .myext-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 2147483647;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        color: #111827;
        max-width: 320px;
      }
      .myext-widget button {
        margin-top: 8px;
        padding: 6px 12px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
      }
      .myext-widget button:hover {
        background: #1d4ed8;
      }
    </style>
    <div class="myext-widget">
      <p>My Extension Widget</p>
      <button id="myext-action">Do Something</button>
    </div>
  `;

  const btn = shadow.getElementById('myext-action');
  btn?.addEventListener('click', async () => {
    const response = await chrome.runtime.sendMessage({ type: 'GET_TAB_INFO' });
    btn.textContent = response?.title ?? 'Done';
  });

  document.body.appendChild(host);
}
