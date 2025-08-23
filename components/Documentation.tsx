import React from 'react';

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const Documentation: React.FC = () => {
    return (
        <div className="bg-sky-50 dark:bg-sky-900/20 p-5 rounded-xl border border-sky-200 dark:border-sky-500/30 mb-8">
            <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                    <InfoIcon />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-sky-800 dark:text-sky-200">How to Use</h3>
                    <p className="text-sm text-sky-700 dark:text-sky-300 mt-1 mb-3">
                        For the best analysis results, please export your design from Figma as a single, multi-page PDF file.
                    </p>
                    <ol className="list-decimal list-inside text-sm space-y-1 text-sky-600 dark:text-sky-400">
                        <li>In Figma, select all the frames you want to include in the analysis.</li>
                        <li>Go to the main menu: <span className="font-semibold">File &gt; Export frames to PDF...</span></li>
                        <li>This will generate a single PDF file with each frame as a separate page.</li>
                        <li>Upload that consolidated PDF file below.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};
