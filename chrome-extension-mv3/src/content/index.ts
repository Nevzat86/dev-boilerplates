/**
 * Content script — runs in the context of web pages.
 *
 * MV3 rules:
 * - No access to chrome.storage.session
 * - Communicate with service worker via chrome.runtime.sendMessage
 * - DOM access is full but isolated (content script world)
 */

// Uncomment to enable UI widget injection:
// import { injectUI } from './ui';

// Listen for messages from the service worker
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case 'EXTRACT_DATA': {
      const data = extractPageData();
      sendResponse(data);
      break;
    }
    case 'CONTEXT_MENU_ACTION': {
      handleContextMenuAction(message.payload?.text);
      sendResponse({ ok: true });
      break;
    }
    default:
      sendResponse({ error: 'Unknown message type' });
  }
  return true;
});

/** Extract structured data from the current page */
function extractPageData() {
  return {
    title: document.title,
    url: window.location.href,
    description: document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? '',
    h1: document.querySelector('h1')?.textContent ?? '',
  };
}

/** Handle context menu action */
function handleContextMenuAction(selectedText: string | undefined) {
  if (!selectedText) return;
  // Example: highlight selected text or show a tooltip
}

// Optional: inject a UI widget into the page
// Uncomment the line below to enable:
// injectUI();

export {};
