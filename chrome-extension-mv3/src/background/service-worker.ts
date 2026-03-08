import { initMessageRouter, onMessage } from '@/lib/messaging';

// Initialize message router
initMessageRouter();

// --- Message Handlers ---

onMessage('GET_TAB_INFO', async (_msg, sender) => {
  if (sender.tab) {
    return { title: sender.tab.title, url: sender.tab.url };
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ? { title: tab.title, url: tab.url } : null;
});

onMessage('OPEN_SIDE_PANEL', async (_msg, sender) => {
  if (sender.tab?.windowId) {
    await chrome.sidePanel.open({ windowId: sender.tab.windowId });
  }
  return { ok: true };
});

// --- Extension Lifecycle ---

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({ installDate: Date.now() });
  }

  // Enable side panel
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
});

// --- Context Menu (example) ---

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus?.create({
    id: 'myextension-action',
    title: 'My Extension: Do Something',
    contexts: ['selection'],
  });
});

chrome.contextMenus?.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'myextension-action' && tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'CONTEXT_MENU_ACTION',
      payload: { text: info.selectionText },
    });
  }
});

// --- Alarms (periodic tasks) ---

chrome.alarms.create('periodic-task', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'periodic-task') {
    // Perform periodic task (sync data, check updates, etc.)
  }
});
