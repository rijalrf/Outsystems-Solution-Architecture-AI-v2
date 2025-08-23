
import React from 'react';

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface TooltipProps {
  content: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  return (
    <div className="relative group flex items-center">
      <InfoIcon />
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-max max-w-xs 
                     bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 
                     p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 
                     opacity-0 group-hover:opacity-100 invisible group-hover:visible 
                     transition-opacity duration-300 z-40">
        {content}
        {/* Arrow pointing left */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-white dark:bg-slate-800 border-l border-b border-slate-200 dark:border-slate-700 transform rotate-45"></div>
      </div>
    </div>
  );
};
