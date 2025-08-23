import React, { useState } from 'react';

interface ApiKeyModalProps {
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onSave, currentKey }) => {
  const [key, setKey] = useState(currentKey || '');

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  const hasKeyOnLoad = !!currentKey;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Enter Your Google Gemini API Key</h2>
          {hasKeyOnLoad && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            To use this application, you need to provide your own Google Gemini API key. You can get your key from{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 hover:underline">Google AI Studio</a>.
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Paste your API key here"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};
