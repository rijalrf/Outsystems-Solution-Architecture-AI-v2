
import React, { useRef, useState } from 'react';
import type { AnalysisResult, ConsumedRestApi, Role, Page, StaticEntity, SiteProperty, ThirdPartyServiceRecommendation, Timer, BPTProcess, ServiceAction } from '../types';
import { ERDCanvas } from './ERDCanvas';
import { EntitiesList } from './EntitiesList';
import { ArchitectureCanvasDisplay } from './ArchitectureCanvasDisplay';
import { ERDControls, ERDCanvasHandle } from './ERDControls';
import { generatePdfReport } from '../utils/pdfExporter';

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const AoEstimateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-6m-3 3h.01M9 17h6A2 2 0 0017 15V9A2 2 0 0015 7H9A2 2 0 007 9v6a2 2 0 002 2z" /></svg>
);
const ArchitectureIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
);
const DiagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);
const TableIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);
const StaticEntityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>
);
const ApiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.173-5.91" /></svg>
);
const PageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
);
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const ServiceActionIcon = SettingsIcon; // Reuse settings icon for service actions
const ThirdPartyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
);
const AsyncIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const ResultCard: React.FC<{ id: string; title: string; icon: React.ReactNode; children: React.ReactNode; controls?: React.ReactNode }> = ({ id, title, icon, children, controls }) => (
    <div id={id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8 scroll-mt-24">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
                {icon}
                <h3 className="ml-3 text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            </div>
            {controls && <div>{controls}</div>}
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const SectionItem: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 ${className}`}>
        <h4 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
        {children}
    </div>
);

const CodeBlock: React.FC<{ title: string; code: string }> = ({ title, code }) => {
    let formattedCode = code;
    try {
        if (code && (code.trim().startsWith('{') || code.trim().startsWith('['))) {
             formattedCode = JSON.stringify(JSON.parse(code), null, 2);
        }
    } catch (e) {
      // Not valid JSON, display as is
    }

    const highlightJson = (jsonStr: string) => {
        if (!jsonStr) return '';
        // This is a simplified syntax highlighter
        return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'text-emerald-600 dark:text-emerald-400'; // number
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-sky-800 dark:text-sky-300'; // key
                } else {
                    cls = 'text-red-700 dark:text-red-400'; // string
                }
            } else if (/true|false/.test(match)) {
                cls = 'text-fuchsia-700 dark:text-fuchsia-400'; // boolean
            } else if (/null/.test(match)) {
                cls = 'text-slate-500 dark:text-slate-400'; // null
            }
            return `<span class="${cls}">${match}</span>`;
        });
    };

    const highlightedHtml = highlightJson(formattedCode);

    return (
        <div>
            <span className="font-semibold text-sm">{title}:</span>
            <pre className="mt-1 p-3 bg-slate-100 dark:bg-slate-900/70 rounded-md text-xs text-slate-800 dark:text-slate-200 overflow-x-auto">
                <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
            </pre>
        </div>
    );
}

export const ResultsDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const erdCanvasRef = useRef<ERDCanvasHandle>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const entitiesCount = result.entities?.length || 0;
  const staticEntitiesCount = result.staticEntities?.length || 0;
  const consumedRestApisCount = result.consumedRestApis?.length || 0;
  const pagesCount = result.pages?.length || 0;
  const totalAo = entitiesCount + staticEntitiesCount + pagesCount + consumedRestApisCount;

  const handleExportPdf = async () => {
    if (!result) return;
    
    setIsExportingPdf(true);
    try {
        const erdElement = document.getElementById('erd-export-container');
        await generatePdfReport(result, erdElement);
    } catch (e) {
        console.error("Failed to generate PDF report:", e);
    } finally {
        setIsExportingPdf(false);
    }
  };

  const hasAsyncProcesses = result.asynchronousProcesses && 
    ((result.asynchronousProcesses.timers && result.asynchronousProcesses.timers.length > 0) || 
     (result.asynchronousProcesses.bptProcesses && result.asynchronousProcesses.bptProcesses.length > 0));

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Analysis Results</h2>
        <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 flex items-center justify-center gap-2 w-36 disabled:bg-red-400 disabled:cursor-not-allowed"
        >
            {isExportingPdf ? (
                <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Exporting...</span>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Export to PDF</span>
                </>
            )}
        </button>
      </div>

      <div id="pdf-content">
        {result.businessSummary && (
            <ResultCard id="business-summary" title="Business Summary" icon={<BriefcaseIcon />}>
                <p className="text-slate-600 dark:text-slate-300">{result.businessSummary}</p>
            </ResultCard>
        )}

        {totalAo > 0 && (
            <ResultCard id="ao-estimate" title="Estimate AO" icon={<AoEstimateIcon />}>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">Total Estimated Application Objects</h4>
                    <p className="text-3xl font-extrabold text-red-500">{totalAo}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Entities</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{entitiesCount}</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Static Entities</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{staticEntitiesCount}</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Consumed REST</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{consumedRestApisCount}</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pages</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{pagesCount}</p>
                    </div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 text-center">This is an estimate based on the identified components. See OutSystems documentation for official AO counting rules.</p>
            </ResultCard>
        )}

        {result.architecture && (
            <ResultCard id="architecture" title="Architecture Canvas" icon={<ArchitectureIcon />}>
                <ArchitectureCanvasDisplay architecture={result.architecture} />
            </ResultCard>
        )}

        {entitiesCount > 0 && (
            <ResultCard 
                id="erd-diagram" 
                title="ERD Diagram" 
                icon={<DiagramIcon />}
                controls={<ERDControls canvasRef={erdCanvasRef} />}
            >
                <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2 mb-4">Click and drag tables to organize the diagram. Use controls to zoom and enter fullscreen.</p>
                <ERDCanvas ref={erdCanvasRef} entities={result.entities} relationships={result.relationships} />
            </ResultCard>
        )}
        
        {entitiesCount > 0 && (
            <ResultCard id="entities" title={`Entities (${entitiesCount})`} icon={<TableIcon />}>
            <EntitiesList entities={result.entities} />
            </ResultCard>
        )}

        {staticEntitiesCount > 0 && (
            <ResultCard id="static-entities" title={`Static Entities (${staticEntitiesCount})`} icon={<StaticEntityIcon />}>
                {result.staticEntities.map((entity: StaticEntity, index: number) => (
                    <SectionItem key={index} title={entity.name}>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1 mb-3">{entity.description}</p>
                        {entity.records?.length > 0 && entity.attributes?.length > 0 && (
                            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-600">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-100 dark:bg-slate-700">
                                        <tr>
                                            {entity.attributes.map(attr => (
                                                <th key={attr.name} className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">{attr.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entity.records.map((record, i) => (
                                            <tr key={i} className="border-t border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800">
                                                {entity.attributes.map(attr => (
                                                    <td key={`${attr.name}-${i}`} className="px-4 py-2 text-slate-700 dark:text-slate-300">
                                                        {String(record[attr.name] ?? '')}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </SectionItem>
                ))}
            </ResultCard>
            )}

        {hasAsyncProcesses && (
            <ResultCard id="asynchronous-processes" title="Asynchronous Processes" icon={<AsyncIcon />}>
                {result.asynchronousProcesses?.timers && result.asynchronousProcesses.timers.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Timers</h4>
                        {result.asynchronousProcesses.timers.map((timer: Timer, index: number) => (
                            <SectionItem key={index} title={timer.name}>
                                <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1 mb-2">{timer.description}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    <span className="font-semibold">Schedule:</span> {timer.schedule}
                                </p>
                            </SectionItem>
                        ))}
                    </div>
                )}
                {result.asynchronousProcesses?.bptProcesses && result.asynchronousProcesses.bptProcesses.length > 0 && (
                     <div className="mt-4">
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">BPT Processes</h4>
                        {result.asynchronousProcesses.bptProcesses.map((process: BPTProcess, index: number) => (
                            <SectionItem key={index} title={process.name}>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                    <span className="font-semibold">Trigger:</span> {process.trigger}
                                </p>
                                <div className="mt-2">
                                    <span className="font-semibold text-sm text-slate-600 dark:text-slate-300">Steps:</span>
                                    <ol className="list-decimal list-inside mt-1 text-sm text-slate-500 dark:text-slate-400 space-y-1">
                                        {process.steps.map((step, stepIndex) => (
                                            <li key={stepIndex}>{step}</li>
                                        ))}
                                    </ol>
                                </div>
                            </SectionItem>
                        ))}
                    </div>
                )}
            </ResultCard>
        )}

        {result.thirdPartyRecommendations && result.thirdPartyRecommendations.length > 0 && (
            <ResultCard id="third-party-recommendations" title="Third-Party Recommendations" icon={<ThirdPartyIcon />}>
                {result.thirdPartyRecommendations.map((rec, index) => (
                    <SectionItem key={index} title={rec.serviceName}>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1 mb-2">
                            <strong>Use Case:</strong> {rec.useCase}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{rec.recommendation}</p>
                    </SectionItem>
                ))}
            </ResultCard>
        )}

        {result.serviceActions && result.serviceActions.length > 0 && (
            <ResultCard id="service-actions" title="Service Actions" icon={<ServiceActionIcon />}>
                {result.serviceActions.map((action: ServiceAction, index: number) => (
                    <SectionItem key={index} title={action.name}>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1 mb-2">{action.description}</p>
                        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                            {action.inputs.length > 0 && (
                                <div>
                                    <span className="font-semibold">Inputs:</span>
                                    <ul className="list-disc list-inside ml-4">
                                        {action.inputs.map((param, i) => <li key={i}>{param}</li>)}
                                    </ul>
                                </div>
                            )}
                            {action.outputs.length > 0 && (
                                <div>
                                    <span className="font-semibold">Outputs:</span>
                                    <ul className="list-disc list-inside ml-4">
                                        {action.outputs.map((param, i) => <li key={i}>{param}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </SectionItem>
                ))}
            </ResultCard>
        )}

        {consumedRestApisCount > 0 && (
            <ResultCard id="consumed-rest-apis" title={`Consumed REST APIs (${consumedRestApisCount})`} icon={<ApiIcon />}>
                {result.consumedRestApis.map((api: ConsumedRestApi, index: number) => (
                    <SectionItem key={index} title={api.name}>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1 mb-2">{api.description}</p>
                        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                            <p><span className="font-semibold">Method:</span> <span className="font-mono bg-slate-200 dark:bg-slate-600 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded">{api.method}</span></p>
                            <p><span className="font-semibold">Path:</span> <span className="font-mono">{api.path}</span></p>
                            {api.parameters.length > 0 && (
                                <div>
                                    <span className="font-semibold">Parameters:</span>
                                    <ul className="list-disc list-inside ml-4">
                                        {api.parameters.map((param, i) => <li key={i}>{param}</li>)}
                                    </ul>
                                </div>
                            )}
                            {api.requestExample && <CodeBlock title="Request Example" code={api.requestExample} />}
                            {api.responseExample && <CodeBlock title="Response Example" code={api.responseExample} />}
                        </div>
                    </SectionItem>
                ))}
            </ResultCard>
        )}


        {result.roles?.length > 0 && (
            <ResultCard id="roles" title="Roles & Permissions" icon={<UserIcon />}>
                {result.roles.map((role: Role, index: number) => (
                    <SectionItem key={index} title={role.name}>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1">{role.description}</p>
                    </SectionItem>
                ))}
            </ResultCard>
        )}

        {pagesCount > 0 && (
            <ResultCard id="pages" title={`Pages (${pagesCount})`} icon={<PageIcon />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.pages.map((page: Page, index: number) => (
                        <SectionItem key={index} title={page.name} className="flex flex-col">
                            <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1 mb-2 flex-grow">{page.description}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-semibold">Primary Role:</span> {page.role}</p>
                        </SectionItem>
                    ))}
                </div>
            </ResultCard>
        )}

        {result.siteProperties?.length > 0 && (
            <ResultCard id="site-properties" title="Site Properties" icon={<SettingsIcon />}>
                {result.siteProperties.map((prop: SiteProperty, index: number) => (
                    <SectionItem key={index} title={prop.name}>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1 mb-2">{prop.description}</p>
                        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <p><span className="font-semibold">Data Type:</span> {prop.dataType}</p>
                            <p><span className="font-semibold">Default Value:</span> <span className="font-mono bg-slate-200 dark:bg-slate-600 px-1 py-0.5 rounded">{prop.defaultValue}</span></p>
                        </div>
                    </SectionItem>
                ))}
            </ResultCard>
        )}
      </div>
    </div>
  );
};