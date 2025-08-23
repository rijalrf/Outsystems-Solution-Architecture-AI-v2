import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { Entity, Relationship } from '../types';
import { EntityTable } from './EntityTable';
import { ERDCanvasHandle } from './ERDControls';
import html2canvas from 'html2canvas';

interface ERDCanvasProps {
  entities: Entity[];
  relationships: Relationship[];
}

type Positions = { [key: string]: { x: number; y: number } };
type Dimensions = { [key: string]: { width: number; height: number } };

export const ERDCanvas = forwardRef<ERDCanvasHandle, ERDCanvasProps>(({ entities, relationships }, ref) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Positions>({});
  const [dimensions, setDimensions] = useState<Dimensions>({});
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const initialPositions: Positions = {};
    entities.forEach((entity, index) => {
        const x = 50 + (index % 4) * 300;
        const y = 50 + Math.floor(index / 4) * 250;
        initialPositions[entity.name] = { x, y };
    });
    setPositions(initialPositions);
  }, [entities]);
  
  const handlePositionChange = useCallback((name: string, pos: { x: number; y: number }) => {
    setPositions(prev => ({...prev, [name]: pos}));
  }, []);

  const handleDimensionsChange = useCallback((name: string, dim: { width: number; height: number }) => {
    setDimensions(prev => ({...prev, [name]: dim}));
  }, []);

  useImperativeHandle(ref, () => ({
    zoomIn: () => setScale(prev => Math.min(prev * 1.2, 2)),
    zoomOut: () => setScale(prev => Math.max(prev / 1.2, 0.2)),
    reset: () => setScale(1),
    toggleFullscreen: () => {
        const elem = canvasContainerRef.current;
        if (!elem) return;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    },
    exportPng: () => {
        const element = exportRef.current;
        if (!element) return;

        const originalScale = element.style.transform;
        element.style.transform = 'scale(1)';
        
        const tables = element.querySelectorAll<HTMLDivElement>('.entity-table-export');
        let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;

        if (tables.length > 0) {
            tables.forEach(table => {
                const x = parseFloat(table.style.left);
                const y = parseFloat(table.style.top);
                const w = table.offsetWidth;
                const h = table.offsetHeight;
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x + w);
                maxY = Math.max(maxY, y + h);
            });
            
            minX -= 50; minY -= 50; maxX += 50; maxY += 50;
        } else {
            minX = 0; minY = 0; maxX = 1200; maxY = 800;
        }

        const width = maxX - minX;
        const height = maxY - minY;

        html2canvas(element, {
            width: width, height: height,
            x: minX, y: minY,
            scale: 2, backgroundColor: null
        }).then(canvas => {
          const link = document.createElement('a');
          link.download = 'erd-diagram.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          element.style.transform = originalScale;
        });
    }
  }));

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const getConnectorPoints = (from: string, to: string) => {
      const fromPos = positions[from];
      const toPos = positions[to];
      const fromDim = dimensions[from] || { width: 256, height: 150 };
      const toDim = dimensions[to] || { width: 256, height: 150 };

      if (!fromPos || !toPos) return null;

      const fromCx = fromPos.x + fromDim.width / 2;
      const fromCy = fromPos.y + fromDim.height / 2;
      const toCx = toPos.x + toDim.width / 2;
      const toCy = toPos.y + toDim.height / 2;
      
      const dx = toCx - fromCx;
      const dy = toCy - fromCy;

      let p1 = { x: 0, y: 0 };
      let p2 = { x: 0, y: 0 };
      
      if (Math.abs(dx) > Math.abs(dy)) { // Connect to sides
        p1.x = fromCx + (dx > 0 ? fromDim.width / 2 : -fromDim.width / 2);
        p1.y = fromCy;
        p2.x = toCx - (dx > 0 ? toDim.width / 2 : -toDim.width / 2);
        p2.y = toCy;
      } else { // Connect to top/bottom
        p1.x = fromCx;
        p1.y = fromCy + (dy > 0 ? fromDim.height / 2 : -fromDim.height / 2);
        p2.x = toCx;
        p2.y = toCy - (dy > 0 ? toDim.height / 2 : -toDim.height / 2);
      }
      return { p1, p2 };
  };

  return (
    <div 
      ref={canvasContainerRef}
      className="relative w-full h-[32rem] rounded-lg bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-auto dark:[--grid-color:#475569] [--grid-color:#cbd5e1]"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--grid-color) 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }}
    >
        <div 
            ref={exportRef}
            id="erd-export-container"
            className="relative w-[400%] h-[400%]"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" className="fill-slate-500 dark:fill-slate-400" />
                </marker>
              </defs>
              {relationships && relationships.map((rel, index) => {
                  const points = getConnectorPoints(rel.fromEntity, rel.toEntity);
                  if (!points) return null;
                  return (
                      <line 
                          key={index}
                          x1={points.p1.x} y1={points.p1.y}
                          x2={points.p2.x} y2={points.p2.y}
                          className="stroke-slate-500 dark:stroke-slate-400"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                      />
                  )
              })}
            </svg>
            {entities.map((entity) => (
                positions[entity.name] && <EntityTable 
                    key={entity.name} 
                    entity={entity} 
                    position={positions[entity.name]}
                    onPositionChange={handlePositionChange}
                    onDimensionsChange={handleDimensionsChange}
                />
            ))}
        </div>
    </div>
  );
});