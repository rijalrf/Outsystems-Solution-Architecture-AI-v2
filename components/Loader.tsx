import React, { useState, useEffect } from 'react';

export const Loader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const messages = [
        'Analyzing design structure...',
        'Identifying key screens and components...',
        'Designing data entities and relationships...',
        'Constructing architecture canvas...',
        'Aligning with OutSystems best practices...',
    ];
    
    setMessage(messages[0]);

    const progressInterval = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= 99) {
          clearInterval(progressInterval);
          return 99; // Stop just before 100 to feel more authentic
        }
        const newProgress = oldProgress + 1;
        const messageIndex = Math.min(Math.floor(newProgress / (100 / messages.length)), messages.length - 1);
        setMessage(messages[messageIndex]);
        return newProgress;
      });
    }, 80); // Simulate an 8-second process

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center my-12">
        <div className="w-full max-w-md bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-4">
            <div 
            className="bg-red-500 h-2.5 rounded-full transition-all duration-300 ease-linear" 
            style={{ width: `${progress}%` }}
            ></div>
        </div>
        <p className="mt-2 text-slate-600 dark:text-slate-300 font-semibold">{message || 'Starting analysis...'}</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">This may take a moment.</p>
    </div>
  );
};
