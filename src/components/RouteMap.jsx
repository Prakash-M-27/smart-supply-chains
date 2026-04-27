import { useEffect, useState } from 'react';

// SVG canvas positions for each city
const CITY_POS = {
  Mumbai:        { x: 100, y: 230 },
  Delhi:         { x: 230, y:  75 },
  Chennai:       { x: 410, y: 355 },
  Bangalore:     { x: 310, y: 370 },
  Hyderabad:     { x: 295, y: 285 },
  Kolkata:       { x: 460, y: 175 },
  Pune:          { x: 130, y: 270 },
  Ahmedabad:     { x:  90, y: 155 },
  Jaipur:        { x: 185, y: 130 },
  Surat:         { x: 100, y: 195 },
  Nagpur:        { x: 270, y: 210 },
  Lucknow:       { x: 320, y: 130 },
  Bhopal:        { x: 230, y: 195 },
  Indore:        { x: 185, y: 200 },
  Coimbatore:    { x: 310, y: 400 },
  Kochi:         { x: 280, y: 430 },
  Visakhapatnam: { x: 400, y: 265 },
  Bhubaneswar:   { x: 420, y: 220 },
  Patna:         { x: 380, y: 145 },
  Chandigarh:    { x: 215, y:  60 },
  JNPT:          { x:  85, y: 245 },
  Dehradun:      { x: 225, y:  50 },
  Amritsar:      { x: 175, y:  50 },
  Vadodara:      { x: 110, y: 180 },
  Nashik:        { x: 140, y: 215 },
};

const DISRUPTED_CITIES = ['Chennai', 'JNPT'];

function midpoint(p1, p2, offset = 0) {
  return {
    x: (p1.x + p2.x) / 2 + offset,
    y: (p1.y + p2.y) / 2 + offset,
  };
}

export default function RouteMap({ from, to, selectedRoute }) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset(o => (o + 2) % 20), 60);
    return () => clearInterval(id);
  }, []);

  const fromPos = CITY_POS[from];
  const toPos   = CITY_POS[to];
  const hasRoute = fromPos && toPos && from !== to;

  // Alternate route bends slightly differently
  const altMid = hasRoute ? midpoint(fromPos, toPos, 40) : null;

  const isDestDisrupted = DISRUPTED_CITIES.includes(to);

  // All cities to show as background dots
  const allCities = Object.entries(CITY_POS);

  return (
    <div className="glass border border-white/5 rounded-2xl overflow-hidden relative" style={{ height: 340 }}>
      {/* Legend */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-4">
        <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-red-500 inline-block" style={{ boxShadow: '0 0 4px #ef4444' }}></span>
          Disrupted
        </span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-emerald-400 inline-block" style={{ boxShadow: '0 0 4px #10b981' }}></span>
          Alternate
        </span>
      </div>

      {!hasRoute && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-3xl mb-2">🗺️</div>
            <div className="text-sm text-slate-400">Enter source & destination to visualize route</div>
          </div>
        </div>
      )}

      <svg width="100%" height="100%" viewBox="0 0 540 460" preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="540" y2={i * 40} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="460" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        ))}

        {/* Background city dots */}
        {allCities.map(([name, pos]) => {
          const isActive = name === from || name === to;
          if (isActive) return null;
          return (
            <g key={name}>
              <circle cx={pos.x} cy={pos.y} r="2.5" fill="rgba(255,255,255,0.08)" />
              <text x={pos.x} y={pos.y - 6} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7">{name}</text>
            </g>
          );
        })}

        {hasRoute && (
          <>
            {/* Disrupted direct route */}
            <path
              d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
              fill="none" stroke="#ef4444" strokeWidth="2.5"
              strokeDasharray="8 4" strokeDashoffset={-offset}
              style={{ filter: 'drop-shadow(0 0 6px #ef4444)' }}
            />

            {/* Alternate route (curved via midpoint offset) */}
            {selectedRoute && (
              <path
                d={`M${fromPos.x},${fromPos.y} Q${altMid.x},${altMid.y} ${toPos.x},${toPos.y}`}
                fill="none" stroke="#10b981" strokeWidth="2.5"
                strokeDasharray="6 3" strokeDashoffset={offset}
                style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}
              />
            )}

            {/* FROM node */}
            <g>
              <circle cx={fromPos.x} cy={fromPos.y} r="10" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5"
                style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
              <circle cx={fromPos.x} cy={fromPos.y} r="4" fill="#06b6d4" />
              <text x={fromPos.x} y={fromPos.y - 15} textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">{from}</text>
              <text x={fromPos.x} y={fromPos.y + 22} textAnchor="middle" fill="rgba(6,182,212,0.6)" fontSize="8">ORIGIN</text>
            </g>

            {/* TO node */}
            <g>
              {isDestDisrupted && (
                <circle cx={toPos.x} cy={toPos.y} r="22" fill="none" stroke="#ef4444" strokeWidth="1"
                  opacity="0.5" className="ripple-ring" />
              )}
              <circle cx={toPos.x} cy={toPos.y} r="10"
                fill={isDestDisrupted ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}
                stroke={isDestDisrupted ? '#ef4444' : '#10b981'} strokeWidth="1.5"
                style={{ filter: `drop-shadow(0 0 8px ${isDestDisrupted ? '#ef4444' : '#10b981'})` }} />
              <circle cx={toPos.x} cy={toPos.y} r="4" fill={isDestDisrupted ? '#ef4444' : '#10b981'} />
              <text x={toPos.x} y={toPos.y - 15} textAnchor="middle"
                fill={isDestDisrupted ? '#ef4444' : '#10b981'} fontSize="10" fontWeight="bold">{to}</text>
              <text x={toPos.x} y={toPos.y + 22} textAnchor="middle"
                fill={isDestDisrupted ? 'rgba(239,68,68,0.6)' : 'rgba(16,185,129,0.6)'} fontSize="8">
                {isDestDisrupted ? '⚠ DISRUPTED' : 'DESTINATION'}
              </text>
            </g>

            {/* Distance label on route */}
          </>
        )}
      </svg>
    </div>
  );
}
