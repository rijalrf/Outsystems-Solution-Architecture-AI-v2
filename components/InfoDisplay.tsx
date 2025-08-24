import React from 'react';

interface InfoDisplayProps {
  message: string;
}

export const InfoDisplay: React.FC<InfoDisplayProps> = ({ message }) => {
  return (
    <div className="my-6 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-500/30 text-sky-800 dark:text-sky-300 rounded-lg flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0 text-sky-600 dark:text-sky-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <div>
        <h4 className="font-bold">Information</h4>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};
