import React from 'react';

export const Welcome: React.FC = () => {
    return (
        <div className="text-center my-12 p-8 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-300 dark:text-red-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Ready to Analyze</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Upload your Figma PDF design file and click "Analyze Now" to automatically generate a structured plan for your OutSystems application.
            </p>
        </div>
    );
};