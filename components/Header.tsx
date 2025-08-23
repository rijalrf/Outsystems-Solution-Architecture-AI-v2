

import React from 'react';

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    onDocsClick: () => void;
    onApiKeyClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, onDocsClick, onApiKeyClick }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 mr-3">
                 <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor" aria-hidden="true">
                    <text x="12" y="17" fontSize="18" fontWeight="bold" textAnchor="middle">O</text>
                </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
            OutSystems Solution Architecture <span className="text-red-500 font-semibold">AI</span>
            </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDocsClick}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-colors"
            aria-label="Documentation"
            title="Documentation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </button>
           <button
            onClick={onApiKeyClick}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-colors"
            aria-label="Manage API Key"
            title="Manage API Key"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};