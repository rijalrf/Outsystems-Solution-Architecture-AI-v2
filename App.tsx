
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { analyzePdfForOutsystems } from './services/geminiService';
import type { AnalysisResult } from './types';
import { Welcome } from './components/Welcome';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Sidebar } from './components/Sidebar';
import { Tooltip } from './components/Tooltip';
import { DocumentationPage } from './components/DocumentationPage';
import { sampleAnalysisResult } from './data/sampleData';

type View = 'app' | 'docs';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('app');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
        return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzePdfForOutsystems(file);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  const handleLoadSampleData = () => {
    setError(null);
    setFile(null);
    setIsLoading(false);
    setAnalysisResult(sampleAnalysisResult);
    // Scroll to results smoothly
    setTimeout(() => {
        document.getElementById('analysis-results-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const tooltipContent = (
    <div className="text-left">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">How to Use</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">For the best analysis results, please export your design from Figma as a single, multi-page PDF file.</p>
        <ol className="list-decimal list-inside text-xs space-y-1 text-slate-500 dark:text-slate-400">
            <li>In Figma, select all the frames you want to include in the analysis.</li>
            <li>Go to the main menu: <span className="font-semibold text-slate-700 dark:text-slate-200">File &gt; Export frames to PDF...</span></li>
            <li>This will generate a single PDF file with each frame as a separate page.</li>
            <li>Upload that consolidated PDF file below.</li>
        </ol>
    </div>
);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 font-sans transition-colors duration-300">
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        onDocsClick={() => setView('docs')}
      />
      
      {view === 'docs' ? (
        <DocumentationPage onBack={() => setView('app')} />
      ) : (
        <div className="flex">
          <Sidebar result={analysisResult} />
          <main className="flex-grow p-4 md:p-8">
              <div className="max-w-4xl mx-auto">
                  <div className="mt-8 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Upload Figma PDF</h2>
                          <Tooltip content={tooltipContent} />
                        </div>
                        <button
                          onClick={handleLoadSampleData}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          title="Load sample data for development"
                        >
                          Load Sample Data
                        </button>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mb-6">Select a PDF file exported from Figma to begin the analysis.</p>
                      <FileUploader 
                        onFileSelect={handleFileSelect} 
                        onAnalyze={handleAnalyze} 
                        isLoading={isLoading}
                      />
                  </div>

                  {error && <ErrorDisplay message={error} />}

                  {isLoading && <Loader />}
                  
                  {!isLoading && !analysisResult && !error && <Welcome />}
                  
                  {analysisResult && <div id="analysis-results-container"><ResultsDisplay result={analysisResult} /></div>}
              </div>
          </main>
        </div>
      )}
      <footer className="text-center p-4 text-slate-400 dark:text-slate-500 text-sm bg-slate-50 dark:bg-slate-900">
        <p>Powered by Gemini API | Designed for OutSystems Developers</p>
        <p className="text-xs text-slate-400/80 dark:text-slate-500/80 mt-1">AI can make mistakes. Please review the results carefully.</p>
      </footer>
    </div>
  );
};

export default App;
