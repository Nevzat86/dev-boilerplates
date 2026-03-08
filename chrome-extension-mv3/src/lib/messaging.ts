/**
 * Type-safe message passing between popup, sidepanel, options, content scripts
 * and the service worker.
 *
 * Usage:
 *   // Send from popup/sidepanel/options → service worker:
 *   const response = await sendMessage({ type: 'GET_TAB_INFO' });
 *
 *   // Send from service worker → content script:
 *   const response = await sendTabMessage(tabId, { type: 'EXTRACT_DATA' });
 *
 *   // Listen in service worker:
 *   onMessage('GET_TAB_INFO', async (msg, sender) => {
 *     return { title: sender.tab?.title };
 *   });
 */

export interface Message {
  type: string;
  payload?: unknown;
}

export type MessageHandler<T = unknown> = (
  message: Message,
  sender: chrome.runtime.MessageSender,
) => Promise<T> | T;

const handlers = new Map<string, MessageHandler>();

/** Send message from UI (popup/sidepanel/options) to service worker */
export async function sendMessage<T = unknown>(message: Message): Promise<T> {
  return chrome.runtime.sendMessage(message);
}

/** Send message from service worker to a specific tab's content script */
export async function sendTabMessage<T = unknown>(
  tabId: number,
  message: Message,
): Promise<T> {
  return chrome.tabs.sendMessage(tabId, message);
}

/** Register a message handler (typically in the service worker) */
export function onMessage<T = unknown>(type: string, handler: MessageHandler<T>): void {
  handlers.set(type, handler as MessageHandler);
}

/** Initialize the message listener. Call once in the service worker. */
export function initMessageRouter(): void {
  chrome.runtime.onMessage.addListener(
    (message: Message, sender, sendResponse) => {
      const handler = handlers.get(message.type);
      if (!handler) return false;

      Promise.resolve(handler(message, sender))
        .then(sendResponse)
        .catch((err) => {
          sendResponse({ error: err instanceof Error ? err.message : String(err) });
        });

      return true; // keep channel open for async response
    },
  );
}
