
import React from 'react';
import type { Architecture, ArchitectureLayer, Module as ModuleType } from '../types';

interface ArchitectureCanvasDisplayProps {
  architecture: Architecture;
}

const layerColors: { [key: string]: string } = {
    "End-User": "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-500/50 text-blue-800 dark:text-blue-300",
    "Core": "bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-500/50 text-orange-800 dark:text-orange-300",
    "Foundation": "bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-500/50 text-green-800 dark:text-green-300",
};

const Module: React.FC<{ moduleName: string; description: string }> = ({ moduleName, description }) => {
    return (
        <div className="relative group text-sm bg-white/50 dark:bg-black/20 px-2 py-1.5 rounded-md text-center break-words font-mono cursor-help">
            {moduleName}
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs 
                            bg-slate-800 text-slate-100 
                            p-3 rounded-lg shadow-lg 
                            opacity-0 group-hover:opacity-100 invisible group-hover:visible 
                            transition-opacity duration-300 z-40 text-left text-xs font-sans normal-case pointer-events-none">
                <p>{description}</p>
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 transform rotate-45"></div>
            </div>
        </div>
    );
};

export const ArchitectureCanvasDisplay: React.FC<ArchitectureCanvasDisplayProps> = ({ architecture }) => {
    // Ensure a consistent order and filter for only the 3 main layers
    const layerOrder = ["End-User", "Core", "Foundation"];
    const layers: { [key: string]: ArchitectureLayer } = {};

    // Initialize layers to ensure they are always present, even if empty
    layerOrder.forEach(name => {
        layers[name] = architecture.layers.find(l => l.name === name) || {
            name,
            description: `The ${name} layer contains modules related to...`, // Default description
            modules: []
        };
    });

    return (
        <div className="flex flex-col gap-4">
            {layerOrder.map(layerName => {
                const layer = layers[layerName];
                return (
                    <div key={layer.name} className={`p-4 rounded-lg border ${layerColors[layer.name]}`}>
                        <h4 className="font-bold text-lg mb-1">{layer.name}</h4>
                        <p className="text-sm opacity-80 mb-4">{layer.description}</p>
                        {layer.modules.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {layer.modules.map((module: ModuleType) => (
                                    <Module key={module.name} moduleName={module.name} description={module.description} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic opacity-60">No modules identified for this layer.</p>
                        )}
                    </div>
                )
            })}
        </div>
    );
};