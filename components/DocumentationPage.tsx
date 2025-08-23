import React from 'react';

interface DocsSectionProps {
    title: string;
    children: React.ReactNode;
}

const DocsSection: React.FC<DocsSectionProps> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-red-500 pb-2 mb-4">{title}</h2>
        <div className="space-y-3 text-slate-600 dark:text-slate-300">
            {children}
        </div>
    </div>
);

const FeatureItem: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
     <li className="ml-4">
        <strong className="text-slate-700 dark:text-slate-200">{title}:</strong> {children}
    </li>
);

export const DocumentationPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <main className="flex-grow p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={onBack}
                    className="mb-6 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to App
                </button>
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-8">Documentation</h1>

                <DocsSection title="Overview">
                    <p>This is a web-based tool designed to accelerate the application design and architecture phase for OutSystems developers. By uploading a multi-page PDF exported from a design tool like Figma, this application uses the Google Gemini API to analyze the visual and textual content and generate a comprehensive solution architecture blueprint.</p>
                </DocsSection>

                <DocsSection title="How to Use">
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">1. Exporting from Figma</h3>
                    <p>For the best analysis results, you must export your design from Figma as a single, multi-page PDF file.</p>
                    <ol className="list-decimal list-inside space-y-1 mt-2">
                        <li>In Figma, select all the frames you want to include in the analysis.</li>
                        <li>Go to the main menu: File &gt; Export frames to PDF...</li>
                        <li>This will generate a single PDF file where each frame is a separate page.</li>
                        <li>Save this consolidated PDF file to your computer.</li>
                    </ol>
                     <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-2">2. Setting Up Your API Key</h3>
                    <p>The application requires a Google Gemini API key to function. When you first open the application, a pop-up will appear asking for your API key. Paste your key into the input field and click "Save". The key will be stored in your browser's local storage for future visits. You can update your key at any time by clicking the key icon in the header.</p>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-2">3. Analyzing Your Design</h3>
                    <ol className="list-decimal list-inside space-y-1 mt-2">
                        <li>Click the "Choose PDF File" button and select the PDF you exported from Figma.</li>
                        <li>Click the "Analyze Now" button.</li>
                        <li>Wait for the analysis to complete. The full architecture blueprint will be displayed.</li>
                    </ol>
                </DocsSection>
                
                <DocsSection title="Features & Analysis Sections">
                    <p>The AI generates a detailed report broken down into the following sections:</p>
                    <ul className="list-disc space-y-2 mt-2">
                        <FeatureItem title="Business Summary">A high-level summary of the application's purpose.</FeatureItem>
                        <FeatureItem title="Architecture Canvas">Categorizes modules into the OutSystems 3-Layer Canvas (End-User, Core, Foundation).</FeatureItem>
                        <FeatureItem title="ERD Diagram">An interactive, visual diagram of your data model.</FeatureItem>
                        <FeatureItem title="Entities">A detailed table view of all data entities and their attributes.</FeatureItem>
                        <FeatureItem title="Static Entities">Lookup data or enumerations, like order statuses or user types.</FeatureItem>
                        <FeatureItem title="Asynchronous Processes">Recommendations for background processes (Timers and BPT) if needed.</FeatureItem>
                        <FeatureItem title="Third-Party Recommendations">Suggestions for external services like payment gateways or cloud storage.</FeatureItem>
                        <FeatureItem title="API Endpoints">A list of proposed REST API endpoints for your application.</FeatureItem>
                        <FeatureItem title="Roles & Permissions">User roles for managing permissions.</FeatureItem>
                        <FeatureItem title="Pages">A list of all identified screens or pages.</FeatureItem>
                        <FeatureItem title="Site Properties">Global, configurable variables for your application.</FeatureItem>
                        <FeatureItem title="Exporting">The entire report can be exported as a professionally formatted PDF, and the ERD can be exported as a PNG.</FeatureItem>
                    </ul>
                </DocsSection>
            </div>
        </main>
    )
};
