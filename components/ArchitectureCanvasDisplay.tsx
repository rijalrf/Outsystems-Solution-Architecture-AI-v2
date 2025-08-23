
import React from 'react';
import type { Architecture } from '../types';

interface ArchitectureCanvasDisplayProps {
  architecture: Architecture;
}

const layerColors: { [key: string]: string } = {
    "End-User": "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-500/50 text-blue-800 dark:text-blue-300",
    "Core": "bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-500/50 text-orange-800 dark:text-orange-300",
    "Foundation": "bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-500/50 text-green-800 dark:text-green-300",
    "Library": "bg-slate-100 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-300",
};

export const ArchitectureCanvasDisplay: React.FC<ArchitectureCanvasDisplayProps> = ({ architecture }) => {
    // Ensure a consistent order for display
    const layerOrder = ["End-User", "Core", "Foundation"];
    const sortedLayers = architecture.layers
        .filter(layer => layerOrder.includes(layer.name))
        .sort((a, b) => layerOrder.indexOf(a.name) - layerOrder.indexOf(b.name));

    return (
        <div className="flex flex-col gap-4">
            {sortedLayers.map(layer => (
                <div key={layer.name} className={`p-4 rounded-lg border ${layerColors[layer.name] || layerColors['Library']}`}>
                    <h4 className="font-bold text-lg mb-1">{layer.name}</h4>
                    <p className="text-sm italic opacity-80 mb-3">{layer.description}</p>
                    {layer.modules.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {layer.modules.map(module => (
                                <div key={module} className="text-sm bg-white/50 dark:bg-black/20 px-2 py-1.5 rounded-md text-center break-words font-mono">
                                    {module}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm italic opacity-60">No modules identified for this layer.</p>
                    )}
                </div>
            ))}
        </div>
    );
};