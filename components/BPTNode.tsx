import React, { useState, useEffect, useRef, useCallback } from 'react';

interface BPTNodeProps {
  step: string;
  index: number;
  position: { x: number; y: number };
  onPositionChange: (index: number, position: {x: number; y: number}) => void;
  onDimensionsChange: (index: number, dimensions: {width: number; height: number}) => void;
}

const getStepShape = (step: string, index: number) => {
    const lowerStep = step.toLowerCase();
    
    if (index === 0) {
        return { 
            shape: 'terminator', 
            className: 'rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 p-3 h-16 flex items-center justify-center',
            style: {}
        };
    }
    
    if (lowerStep.includes('if') || lowerStep.includes('approve') || lowerStep.includes('reject') || lowerStep.includes('decision') || lowerStep.includes('check') || lowerStep.includes('?')) {
        return {
            shape: 'decision',
            className: 'flex items-center justify-center bg-sky-100 dark:bg-sky-900/50 border border-sky-300 dark:border-sky-500/50 text-sky-800 dark:text-sky-300 h-24',
            style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }
        };
    }

    if (lowerStep.includes('wait') || lowerStep.includes('pause')) {
        return {
            shape: 'wait',
            className: 'rounded-lg bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300 p-3 h-16 flex items-center justify-center',
            style: {}
        };
    }
    
    return {
        shape: 'process',
        className: 'rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 p-3 h-16 flex items-center justify-center',
        style: {}
    };
};

export const BPTNode: React.FC<BPTNodeProps> = ({ step, index, position, onPositionChange, onDimensionsChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nodeRef.current) {
        onDimensionsChange(index, {
            width: nodeRef.current.offsetWidth,
            height: nodeRef.current.offsetHeight
        });
    }
  }, [step, index, onDimensionsChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: position.x,
      elementY: position.y,
    };
    e.currentTarget.style.cursor = 'grabbing';
    e.currentTarget.style.zIndex = '20';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    onPositionChange(index, {
      x: dragStartRef.current.elementX + dx,
      y: dragStartRef.current.elementY + dy,
    });
  }, [isDragging, index, onPositionChange]);

  const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      if (nodeRef.current) {
        nodeRef.current.style.cursor = 'grab';
        nodeRef.current.style.zIndex = '10';
      }
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  const { shape, className, style } = getStepShape(step, index);

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none z-10 w-64 text-center text-sm text-slate-700 dark:text-slate-200 shadow-sm ${className}`}
      style={{ top: `${position.y}px`, left: `${position.x}px`, cursor: 'grab', ...style }}
      onMouseDown={handleMouseDown}
    >
       {shape === 'decision' ? <span className="max-w-[70%] inline-block">{step}</span> : step}
    </div>
  );
};
