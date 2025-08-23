
import React, { useState, useRef } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, onAnalyze, isLoading }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="application/pdf"
            disabled={isLoading}
          />
          <button
            onClick={handleButtonClick}
            disabled={isLoading}
            className="w-full sm:w-auto flex-shrink-0 px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Choose PDF File
          </button>
          {fileName && <span className="text-slate-500 dark:text-slate-400 text-sm truncate">{fileName}</span>}
          <div className="flex-grow"></div>
          <button
            onClick={onAnalyze}
            disabled={!fileName || isLoading}
            className="w-full sm:w-auto flex-shrink-0 px-6 py-3 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105 disabled:bg-red-400 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Now'}
          </button>
        </div>
    </div>
  );
};
