
import React from 'react';
import type { AnalysisResult } from '../types';

interface SidebarProps {
    result: AnalysisResult | null;
}

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <li>
        <a href={href} className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-400 transition-colors">
            {children}
        </a>
    </li>
)

export const Sidebar: React.FC<SidebarProps> = ({ result }) => {
    const hasAsyncProcesses = result?.asynchronousProcesses && 
    ((result.asynchronousProcesses.timers && result.asynchronousProcesses.timers.length > 0) || 
     (result.asynchronousProcesses.bptProcesses && result.asynchronousProcesses.bptProcesses.length > 0));

    const entitiesCount = result?.entities?.length || 0;
    const staticEntitiesCount = result?.staticEntities?.length || 0;
    const endpointsCount = result?.endpoints?.length || 0;
    const pagesCount = result?.pages?.length || 0;
    const totalAo = entitiesCount + staticEntitiesCount + endpointsCount + pagesCount;

    return (
        <aside className="sticky top-0 h-screen w-64 bg-slate-100/50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 p-4 hidden lg:block">
            {result && totalAo > 0 && (
                <div className="px-4 py-2 mb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Estimate AO</span>
                        <span className="font-bold text-red-500 text-base">{totalAo}</span>
                    </div>
                </div>
            )}
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-4">Analysis Sections</h3>
            <nav>
                <ul className="space-y-1">
                   {result ? (
                        <>
                            {result.businessSummary && <NavLink href="#business-summary">Business Summary</NavLink>}
                            {totalAo > 0 && <NavLink href="#ao-estimate">AO Estimate</NavLink>}
                            {result.architecture && <NavLink href="#architecture">Architecture Canvas</NavLink>}
                            {entitiesCount > 0 && <NavLink href="#erd-diagram">ERD Diagram</NavLink>}
                            {entitiesCount > 0 && <NavLink href="#entities">Entities ({entitiesCount})</NavLink>}
                            {staticEntitiesCount > 0 && <NavLink href="#static-entities">Static Entities ({staticEntitiesCount})</NavLink>}
                            {hasAsyncProcesses && <NavLink href="#asynchronous-processes">Asynchronous Processes</NavLink>}
                            {result.thirdPartyRecommendations?.length > 0 && <NavLink href="#third-party-recommendations">Third-Party Recommendations</NavLink>}
                            {endpointsCount > 0 && <NavLink href="#api-endpoints">API Endpoints ({endpointsCount})</NavLink>}
                            {result.roles?.length > 0 && <NavLink href="#roles">Roles & Permissions</NavLink>}
                            {pagesCount > 0 && <NavLink href="#pages">Pages ({pagesCount})</NavLink>}
                            {result.siteProperties?.length > 0 && <NavLink href="#site-properties">Site Properties</NavLink>}
                        </>
                   ) : (
                        <li className="px-4 py-2 text-sm text-slate-400 dark:text-slate-500 italic">
                            Results will appear here.
                        </li>
                   )}
                </ul>
            </nav>
        </aside>
    );
};
