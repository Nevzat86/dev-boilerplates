import { useState } from 'react';

interface ApiKeyInputProps {
  value: string;
  onSave: (key: string) => void;
  placeholder?: string;
  label?: string;
}

export function ApiKeyInput({
  value,
  onSave,
  placeholder = 'sk-...',
  label = 'API Key',
}: ApiKeyInputProps) {
  const [input, setInput] = useState(value);
  const [visible, setVisible] = useState(false);
  const isDirty = input !== value;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={visible ? 'text' : 'password'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        </div>
        {isDirty && (
          <button
            onClick={() => onSave(input)}
            className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            Save
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400">
        Your key is stored locally and never sent to our servers.
      </p>
    </div>
  );
}
