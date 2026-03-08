/**
 * Type-safe Chrome Storage API wrapper.
 *
 * Usage:
 *   await storage.get<string>('apiKey');
 *   await storage.set('apiKey', 'sk-...');
 *   storage.onChange('apiKey', (newVal, oldVal) => { ... });
 */

type StorageArea = 'local' | 'sync' | 'session';

function getArea(area: StorageArea): chrome.storage.StorageArea {
  return chrome.storage[area];
}

export const storage = {
  async get<T>(key: string, area: StorageArea = 'local'): Promise<T | undefined> {
    const result = await getArea(area).get(key);
    return result[key] as T | undefined;
  },

  async set<T>(key: string, value: T, area: StorageArea = 'local'): Promise<void> {
    await getArea(area).set({ [key]: value });
  },

  async remove(key: string, area: StorageArea = 'local'): Promise<void> {
    await getArea(area).remove(key);
  },

  async clear(area: StorageArea = 'local'): Promise<void> {
    await getArea(area).clear();
  },

  async getAll(area: StorageArea = 'local'): Promise<Record<string, unknown>> {
    return getArea(area).get(null);
  },

  onChange<T>(
    key: string,
    callback: (newValue: T | undefined, oldValue: T | undefined) => void,
    area: StorageArea = 'local',
  ): () => void {
    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName === area && key in changes) {
        callback(
          changes[key].newValue as T | undefined,
          changes[key].oldValue as T | undefined,
        );
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  },
};
