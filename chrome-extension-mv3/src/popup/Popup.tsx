import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { sendMessage } from '@/lib/messaging';

export function Popup() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    storage.get<number>('clickCount').then((val) => {
      if (val !== undefined) setCount(val);
    });
  }, []);

  const handleClick = async () => {
    const newCount = count + 1;
    setCount(newCount);
    await storage.set('clickCount', newCount);

    const response = await sendMessage<{ title?: string }>({ type: 'GET_TAB_INFO' });
    setStatus(response?.title ?? 'No tab info');
  };

  const openSidePanel = () => {
    sendMessage({ type: 'OPEN_SIDE_PANEL' });
  };

  return (
    <div className="w-80 p-4 bg-white">
      <h1 className="text-lg font-bold text-gray-900 mb-2">
        My Extension
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Clicks: <span className="font-mono font-bold">{count}</span>
      </p>
      {status && (
        <p className="text-xs text-gray-500 mb-3 truncate">
          Tab: {status}
        </p>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleClick}
          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Click Me
        </button>
        <button
          onClick={openSidePanel}
          className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Side Panel
        </button>
      </div>
      <button
        onClick={() => chrome.runtime.openOptionsPage()}
        className="mt-2 w-full px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        Settings
      </button>
    </div>
  );
}
