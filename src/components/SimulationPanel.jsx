import { useState } from 'react';
import { simulationScenarios } from '../data/mockData';

const NODES = [
  { id: 'mumbai',    x: 120, y: 200, label: 'Mumbai WH',   type: 'warehouse' },
  { id: 'nagpur',    x: 260, y: 170, label: 'Nagpur Hub',  type: 'hub'       },
  { id: 'hyderabad', x: 290, y: 270, label: 'Hyderabad',   type: 'hub'       },
  { id: 'chennai',   x: 400, y: 320, label: 'Chennai Port',type: 'port'      },
  { id: 'bangalore', x: 310, y: 340, label: 'Bangalore',   type: 'hub'       },
  { id: 'delhi',     x: 220, y: 70,  label: 'Delhi WH',    type: 'warehouse' },
  { id: 'pune',      x: 140, y: 250, label: 'Pune WH',     type: 'warehouse' },
];

const EDGES = [
  ['mumbai','nagpur'],['nagpur','hyderabad'],['hyderabad','chennai'],
  ['hyderabad','bangalore'],['bangalore','chennai'],['delhi','nagpur'],
  ['mumbai','pune'],['pune','bangalore'],
];

const typeIcon = { warehouse: '🏭', hub: '🔄', port: '⚓' };
const typeColor = { warehouse: '#06b6d4', hub: '#a855f7', port: '#f97316' };

export default function SimulationPanel({ scenario, running }) {
  const affectedNodes = scenario
    ? scenario.id === 's1' || scenario.id === 's2' ? ['chennai', 'hyderabad']
    : scenario.id === 's3' ? ['mumbai', 'pune', 'delhi']
    : scenario.id === 's4' ? ['nagpur']
    : ['mumbai', 'nagpur']
    : [];

  const affectedEdges = scenario
    ? EDGES.filter(([a, b]) => affectedNodes.includes(a) || affectedNodes.includes(b))
    : [];

  return (
    <div className="relative w-full" style={{ height: 420 }}>
      <svg width="100%" height="100%" viewBox="0 0 520 420" preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="520" y2={i * 40} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="420" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        ))}

        {/* Edges */}
        {EDGES.map(([a, b], i) => {
          const n1 = NODES.find(n => n.id === a);
          const n2 = NODES.find(n => n.id === b);
          const isAffected = affectedEdges.some(([ea, eb]) => ea === a && eb === b);
          return (
            <line key={i} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
              stroke={isAffected && running ? '#ef4444' : 'rgba(255,255,255,0.08)'}
              strokeWidth={isAffected && running ? '2' : '1.5'}
              strokeDasharray={isAffected && running ? '5 3' : 'none'}
              style={isAffected && running ? { filter: 'drop-shadow(0 0 4px #ef4444)' } : {}} />
          );
        })}

        {/* Nodes */}
        {NODES.map(n => {
          const isAffected = affectedNodes.includes(n.id) && running;
          const color = isAffected ? '#ef4444' : typeColor[n.type];
          return (
            <g key={n.id}>
              {isAffected && (
                <>
                  <circle cx={n.x} cy={n.y} r="22" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="0.5" className="ripple-ring" />
                  <circle cx={n.x} cy={n.y} r="16" fill="rgba(239,68,68,0.1)" />
                </>
              )}
              <circle cx={n.x} cy={n.y} r="12" fill={`${color}22`} stroke={color} strokeWidth="1.5"
                style={{ filter: `drop-shadow(0 0 ${isAffected ? 10 : 5}px ${color})` }} />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10">{typeIcon[n.type]}</text>
              <text x={n.x} y={n.y + 24} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">{n.label}</text>
            </g>
          );
        })}

        {/* Ripple from affected area */}
        {running && scenario && affectedNodes.map(id => {
          const n = NODES.find(x => x.id === id);
          if (!n) return null;
          return (
            <circle key={id + 'r'} cx={n.x} cy={n.y} r="30" fill="none"
              stroke="rgba(239,68,68,0.3)" strokeWidth="1" className="ripple-ring" />
          );
        })}
      </svg>
    </div>
  );
}
