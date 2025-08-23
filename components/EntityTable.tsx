import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Entity } from '../types';

interface EntityTableProps {
  entity: Entity;
  position: { x: number; y: number };
  onPositionChange: (name: string, position: {x: number; y: number}) => void;
  onDimensionsChange: (name: string, dimensions: {width: number; height: number}) => void;
}

export const EntityTable: React.FC<EntityTableProps> = ({ entity, position, onPositionChange, onDimensionsChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableRef.current) {
        onDimensionsChange(entity.name, {
            width: tableRef.current.offsetWidth,
            height: tableRef.current.offsetHeight
        });
    }
  }, [entity.attributes.length, entity.name, onDimensionsChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only drag with left mouse button
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: position.x,
      elementY: position.y,
    };
    e.currentTarget.style.cursor = 'grabbing';
    e.currentTarget.style.zIndex = '10';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    onPositionChange(entity.name, {
      x: dragStartRef.current.elementX + dx,
      y: dragStartRef.current.elementY + dy,
    });
  }, [isDragging, entity.name, onPositionChange]);

  const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      if (tableRef.current) {
        tableRef.current.style.cursor = 'grab';
        tableRef.current.style.zIndex = '1';
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

  return (
    <div
      ref={tableRef}
      className="absolute bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-300 dark:border-slate-600 w-64 select-none entity-table-export"
      style={{ top: `${position.y}px`, left: `${position.x}px`, cursor: 'grab' }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-slate-700 dark:bg-slate-900 text-white font-bold p-2 rounded-t-lg">
        {entity.name}
      </div>
      <div className="p-1">
        <p className="text-xs text-slate-500 dark:text-slate-400 italic px-1 pb-1 border-b border-slate-200 dark:border-slate-700">{entity.description}</p>
        <ul className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          {entity.attributes.map((attr, i) => (
            <li key={i} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded flex justify-between">
              <span>{attr.name}</span>
              <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">{attr.dataType}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};