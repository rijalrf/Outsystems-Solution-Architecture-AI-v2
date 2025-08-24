import React, { useState, useEffect } from 'react';

export const Loader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [mainMessage, setMainMessage] = useState('');
  const [subMessage, setSubMessage] = useState('');

  useEffect(() => {
    const mainMessages = [
      { progress: 0, text: 'Warming up the AI model...' },
      { progress: 10, text: 'Parsing the PDF document...' },
      { progress: 25, text: 'Analyzing visual layout and design hierarchy...' },
      { progress: 40, text: 'Inferring data entities from forms and lists...' },
      { progress: 55, text: 'Mapping relationships to build the ERD...' },
      { progress: 70, text: 'Deconstructing the app into OutSystems layers...' },
      { progress: 85, text: 'Identifying service actions and API needs...' },
      { progress: 95, text: 'Finalizing the architecture blueprint...' },
    ];
    
    const subMessages = [
        'This is where the magic happens.',
        'Good designs make for great apps.',
        'The AI is thinking hard...',
        'Just a few more moments.',
        'Compiling the final report.',
        'Brewing some digital coffee for the AI.',
        'Untangling the design threads.',
    ];

    setMainMessage(mainMessages[0].text);
    setSubMessage(subMessages[0]);

    // Update sub-message every 2.5 seconds
    let subMessageIndex = 0;
    const subMessageInterval = setInterval(() => {
        subMessageIndex = (subMessageIndex + 1) % subMessages.length;
        setSubMessage(subMessages[subMessageIndex]);
    }, 2500);

    // Update main progress and message
    const progressInterval = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= 99) {
          clearInterval(progressInterval);
          clearInterval(subMessageInterval);
          setMainMessage("Almost there, preparing results...");
          setSubMessage("Done!");
          return 99;
        }
        
        const newProgress = oldProgress + 1;

        const relevantMessage = mainMessages.slice().reverse().find(m => newProgress >= m.progress);
        if (relevantMessage) {
          setMainMessage(relevantMessage.text);
        }

        return newProgress;
      });
    }, 120); // Simulate a 12-second process

    return () => {
      clearInterval(progressInterval);
      clearInterval(subMessageInterval);
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
        <p className="mt-2 text-slate-600 dark:text-slate-300 font-semibold">{mainMessage || 'Starting analysis...'}</p>
        {/* Set a fixed height for the sub-message to prevent layout shift */}
        <p className="text-sm text-slate-400 dark:text-slate-500 h-5 mt-1">{subMessage}</p> 
    </div>
  );
};
