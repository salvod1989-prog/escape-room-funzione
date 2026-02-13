
import React from 'react';
import { Position, NPC, Dimension } from '../types';

interface MapProps {
  playerPos: Position;
  dimension: Dimension;
  npcs: NPC[];
  onNPCInteract: (npc: NPC) => void;
  onMove: (x: number, y: number) => void;
}

const Map: React.FC<MapProps> = ({ playerPos, dimension, npcs, onNPCInteract, onMove }) => {
  const isUpsideDown = dimension === 'UPSIDE_DOWN';

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    onMove(Math.round(cursorpt.x / 10), Math.round(cursorpt.y / 10));
  };

  return (
    <div className={`relative w-full aspect-square bg-[#080808] rounded-2xl overflow-hidden shadow-2xl border-4 transition-all duration-1000 ${isUpsideDown ? 'border-red-600 shadow-[inset_0_0_150px_rgba(255,0,0,0.3)]' : 'border-slate-700'}`}>
      <svg 
        viewBox="0 0 1000 1000" 
        className="w-full h-full cursor-crosshair select-none"
        onClick={handleMapClick}
      >
        <defs>
          <radialGradient id="centralHub" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={isUpsideDown ? "#300" : "#1a1a2e"} stopOpacity="1" />
            <stop offset="100%" stopColor="#080808" stopOpacity="1" />
          </radialGradient>
          
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isUpsideDown ? "#500" : "#1f2937"} strokeWidth="1"/>
          </pattern>
          
          <filter id="npcGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Base Map Layers */}
        <rect width="1000" height="1000" fill="url(#centralHub)" />
        <rect width="1000" height="1000" fill="url(#grid)" opacity="0.5" />

        {/* Target Zone - Highlight Center */}
        <circle cx="500" cy="500" r="280" fill="none" stroke={isUpsideDown ? "#ff000033" : "#4ade8022"} strokeWidth="2" strokeDasharray="15,10" />
        <circle cx="500" cy="500" r="100" fill="none" stroke={isUpsideDown ? "#ff000055" : "#4ade8033"} strokeWidth="1" />
        
        {/* Radar Lines */}
        <line x1="220" y1="500" x2="780" y2="500" stroke={isUpsideDown ? "#ff000011" : "#ffffff08"} strokeWidth="1" />
        <line x1="500" y1="220" x2="500" y2="780" stroke={isUpsideDown ? "#ff000011" : "#ffffff08"} strokeWidth="1" />

        {/* Area Labels (Fixed Decorative) */}
        <g opacity="0.3" className="retro-font uppercase select-none pointer-events-none" fill={isUpsideDown ? "#ff4444" : "#94a3b8"} fontSize="12">
           <text x="500" y="240" textAnchor="middle">Scuola Nord</text>
           <text x="500" y="770" textAnchor="middle">Laboratorio Sud</text>
           <text x="240" y="500" textAnchor="middle" transform="rotate(-90, 240, 500)">Centro Comm.</text>
           <text x="760" y="500" textAnchor="middle" transform="rotate(90, 760, 500)">Bosco Ovest</text>
        </g>

        {/* NPCs - Rendered on top of everything but player */}
        {npcs.map(npc => (
          <g 
            key={npc.id} 
            transform={`translate(${npc.position.x * 10}, ${npc.position.y * 10})`}
            className="cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              onNPCInteract(npc);
            }}
          >
            {/* Outer Ring Animation */}
            <circle r="55" fill="none" stroke={isUpsideDown ? "#ff4444" : "#fbbf24"} strokeWidth="2" opacity="0.6">
               <animate attributeName="r" from="50" to="65" dur="2.5s" repeatCount="indefinite" />
               <animate attributeName="opacity" from="0.6" to="0" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* Main NPC Icon Container */}
            <circle 
              r="48" 
              fill="black" 
              stroke={isUpsideDown ? "#ff0000" : "#fbbf24"} 
              strokeWidth="4" 
              className="group-hover:stroke-white transition-all shadow-2xl" 
              filter="url(#npcGlow)" 
            />
            
            <image 
              href={npc.avatar} 
              x="-40" y="-40" width="80" height="80" 
              clipPath="circle(40px at center)"
              className="group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Tag Nome con sfondo semitrasparente per leggibilità */}
            <rect x="-50" y="58" width="100" height="26" rx="6" fill="#000000cc" stroke={isUpsideDown ? "#ff0000" : "#fbbf24"} strokeWidth="1" />
            <text 
              y="76" 
              textAnchor="middle" 
              fill="white" 
              fontSize="13" 
              className="retro-font font-bold uppercase pointer-events-none tracking-tighter"
            >
              {npc.name.split(' ')[0]}
            </text>
          </g>
        ))}

        {/* Player Cursor - Focal point of interaction */}
        <g transform={`translate(${playerPos.x * 10}, ${playerPos.y * 10})`} className="pointer-events-none transition-all duration-300 ease-out">
          <circle r="25" fill="none" stroke={isUpsideDown ? "#ef4444" : "#3b82f6"} strokeWidth="4" className="animate-pulse" />
          <circle r="5" fill="white" />
          <path d="M -15 0 L 15 0 M 0 -15 L 0 15" stroke="white" strokeWidth="2" opacity="0.8" />
          <text y="50" textAnchor="middle" fill="white" className="retro-font text-[12px] uppercase tracking-widest drop-shadow-lg">Operatore</text>
        </g>
      </svg>

      {/* Center of Map Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white/10 rounded-full pointer-events-none" />
    </div>
  );
};

export default Map;
