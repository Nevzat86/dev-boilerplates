import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { ApiKeyInput } from '@/components/ApiKeyInput';

export function SidePanel() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    storage.get<string>('apiKey').then((key) => {
      if (key) setApiKey(key);
    });
  }, []);

  const handleApiKeySave = async (key: string) => {
    setApiKey(key);
    await storage.set('apiKey', key);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="px-4 py-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-900">Side Panel</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-2">API Key (BYOK)</h2>
          <ApiKeyInput value={apiKey} onSave={handleApiKeySave} />
        </section>

        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Status</h2>
          <p className="text-sm text-gray-500">
            {apiKey ? '✓ API key configured' : '○ No API key set'}
          </p>
        </section>
      </main>
    </div>
  );
}
