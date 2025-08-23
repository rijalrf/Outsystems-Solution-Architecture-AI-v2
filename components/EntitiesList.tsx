import React from 'react';
import type { Entity } from '../types';

interface EntitiesListProps {
  entities: Entity[];
}

export const EntitiesList: React.FC<EntitiesListProps> = ({ entities }) => {
  return (
    <div className="space-y-6">
      {entities.map(entity => (
        <div key={entity.name} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">{entity.name}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1 mb-3">{entity.description}</p>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-600">
                <table className="w-full text-sm">
                    <thead className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        <tr>
                            <th className="px-4 py-2 text-left font-semibold w-2/5">Attribute</th>
                            <th className="px-4 py-2 text-left font-semibold w-2/5">Data Type</th>
                            <th className="px-4 py-2 text-left font-semibold w-1/5">Key</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entity.attributes.map((attr, index) => (
                            <tr key={attr.name} className="border-t border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800">
                                <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-300">{attr.name}</td>
                                <td className="px-4 py-2 font-mono text-red-700 dark:text-red-400">{attr.dataType}</td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-2">
                                      {attr.isPrimaryKey && <span className="text-xs font-bold text-amber-800 bg-amber-200 dark:bg-amber-400/20 dark:text-amber-300 px-2 py-0.5 rounded-full">PK</span>}
                                      {attr.isForeignKey && <span className="text-xs font-bold text-sky-800 bg-sky-200 dark:bg-sky-400/20 dark:text-sky-300 px-2 py-0.5 rounded-full">FK</span>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      ))}
    </div>
  );
};