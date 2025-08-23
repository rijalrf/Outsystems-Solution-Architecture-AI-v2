import React, { useState, useEffect, useCallback } from 'react';
import type { BPTProcess } from '../types';
import { BPTNode } from './BPTNode';

interface BPTFlowchartProps {
  process: BPTProcess;
}

type Positions = { [key: number]: { x: number; y: number } };
type Dimensions = { [key: number]: { width: number; height: number } };

export const BPTFlowchart: React.FC<BPTFlowchartProps> = ({ process }) => {
    const [positions, setPositions] = useState<Positions>({});
    const [dimensions, setDimensions] = useState<Dimensions>({});

    useEffect(() => {
        const initialPositions: Positions = {};
        process.steps.forEach((_, index) => {
            initialPositions[index] = { x: 150, y: 50 + index * 150 };
        });
        setPositions(initialPositions);
    }, [process.steps]);

    const handlePositionChange = useCallback((index: number, pos: { x: number; y: number }) => {
        setPositions(prev => ({...prev, [index]: pos}));
    }, []);

    const handleDimensionsChange = useCallback((index: number, dim: { width: number; height: number }) => {
        setDimensions(prev => ({...prev, [index]: dim}));
    }, []);

    const getConnectorPoints = (fromIndex: number, toIndex: number) => {
        const fromPos = positions[fromIndex];
        const toPos = positions[toIndex];
        const fromDim = dimensions[fromIndex] || { width: 256, height: 60 };
        const toDim = dimensions[toIndex] || { width: 256, height: 60 };
  
        if (!fromPos || !toPos) return null;
  
        const p1 = { 
          x: fromPos.x + fromDim.width / 2,
          y: fromPos.y + fromDim.height,
        };
  
        const p2 = { 
          x: toPos.x + toDim.width / 2,
          y: toPos.y
        };
        
        return { p1, p2 };
    };

    return (
        <div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                <span className="font-semibold">Trigger:</span> {process.trigger}
            </p>
            <div className="mt-4">
                <span className="font-semibold text-sm text-slate-600 dark:text-slate-300">Steps:</span>
                <div 
                    className="relative w-full h-[32rem] rounded-lg mt-2 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-auto dark:[--grid-color:#475569] [--grid-color:#cbd5e1]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--grid-color) 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                    }}
                >
                    <div className="relative w-[400%] h-[400%]">
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <defs>
                                <marker id="bptArrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" className="fill-slate-500 dark:fill-slate-400" />
                                </marker>
                            </defs>
                            {process.steps.slice(0, -1).map((_, index) => {
                                const points = getConnectorPoints(index, index + 1);
                                if (!points) return null;
                                return (
                                    <line 
                                        key={index}
                                        x1={points.p1.x} y1={points.p1.y}
                                        x2={points.p2.x} y2={points.p2.y}
                                        className="stroke-slate-500 dark:stroke-slate-400"
                                        strokeWidth="2"
                                        markerEnd="url(#bptArrowhead)"
                                    />
                                )
                            })}
                        </svg>
                        {process.steps.map((step, index) => (
                            positions[index] && <BPTNode
                                key={index}
                                step={step}
                                index={index}
                                position={positions[index]}
                                onPositionChange={handlePositionChange}
                                onDimensionsChange={handleDimensionsChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
