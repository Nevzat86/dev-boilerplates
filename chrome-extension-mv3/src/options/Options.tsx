import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { ApiKeyInput } from '@/components/ApiKeyInput';

interface Settings {
  apiKey: string;
  enableNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

const defaultSettings: Settings = {
  apiKey: '',
  enableNotifications: true,
  theme: 'system',
};

export function Options() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.get<Settings>('settings').then((s) => {
      if (s) setSettings(s);
    });
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    await storage.set('settings', settings);
    if (settings.apiKey) {
      await storage.set('apiKey', settings.apiKey);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Extension Settings</h1>

      <div className="space-y-6">
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">API Configuration</h2>
          <ApiKeyInput
            value={settings.apiKey}
            onSave={(key) => updateSetting('apiKey', key)}
          />
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Enable Notifications</span>
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Theme</span>
              <select
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value as Settings['theme'])}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
        </section>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
