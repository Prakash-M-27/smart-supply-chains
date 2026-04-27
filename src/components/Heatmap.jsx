import { useState } from 'react';
import { heatmapZones } from '../data/mockData';

const riskColor = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };
const riskGlow  = { HIGH: 'drop-shadow(0 0 10px #ef4444)', MEDIUM: 'drop-shadow(0 0 8px #f59e0b)', LOW: 'drop-shadow(0 0 6px #10b981)' };

// Animated shipment dots
const SHIPS = [
  { id: 1, x: 18, y: 62, tx: 72, ty: 78, color: '#ef4444' },
  { id: 2, x: 38, y: 18, tx: 55, ty: 65, color: '#f59e0b' },
  { id: 3, x: 78, y: 38, tx: 72, ty: 78, color: '#06b6d4' },
  { id: 4, x: 24, y: 60, tx: 52, ty: 82, color: '#10b981' },
];

export default function Heatmap({ filter }) {
  const [hovered, setHovered] = useState(null);

  const filtered = filter === 'ALL'
    ? heatmapZones
    : heatmapZones.filter(z => z.risk === filter);

  return (
    <div className="relative w-full h-full" style={{ minHeight: 420 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', inset: 0 }}>

        {/* India outline (simplified polygon) */}
        <polygon
          points="28,10 45,8 62,12 72,20 78,32 80,45 75,58 70,68 65,78 58,85 50,90 42,88 35,82 28,72 22,60 18,48 20,35 24,22"
          fill="rgba(6,182,212,0.04)" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />

        {/* Grid lines */}
        {[20,40,60,80].map(v => (
          <g key={v}>
            <line x1={v} y1="5" x2={v} y2="95" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
            <line x1="5" y1={v} x2="95" y2={v} stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
          </g>
        ))}

        {/* Risk zones */}
        {filtered.map(z => (
          <g key={z.id} onMouseEnter={() => setHovered(z)} onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}>
            <circle cx={z.x} cy={z.y} r="7" fill={riskColor[z.risk]} opacity="0.12" />
            <circle cx={z.x} cy={z.y} r="4" fill={riskColor[z.risk]} opacity="0.25" />
            <circle cx={z.x} cy={z.y} r="2.5" fill={riskColor[z.risk]}
              style={{ filter: riskGlow[z.risk] }} />
          </g>
        ))}

        {/* Shipment dots */}
        {SHIPS.map(s => (
          <g key={s.id}>
            <circle cx={s.x} cy={s.y} r="1.5" fill={s.color}
              style={{ filter: `drop-shadow(0 0 3px ${s.color})` }}>
              <animateMotion dur={`${6 + s.id}s`} repeatCount="indefinite"
                path={`M0,0 L${s.tx - s.x},${s.ty - s.y}`} />
            </circle>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute glass border border-white/10 p-3 rounded-xl text-xs pointer-events-none z-20"
          style={{ left: `${hovered.x}%`, top: `${hovered.y - 12}%`, transform: 'translate(-50%,-100%)' }}>
          <div className="font-bold text-white mb-1">{hovered.name}</div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: riskColor[hovered.risk] }}></span>
            <span style={{ color: riskColor[hovered.risk] }}>{hovered.risk} RISK</span>
          </div>
          <div className="text-slate-400 mt-1">{hovered.reason}</div>
        </div>
      )}
    </div>
  );
}
