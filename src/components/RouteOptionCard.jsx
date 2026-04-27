const colorMap = {
  cyan:    { border: 'border-cyan-500/40',    text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    glow: 'glow-cyan'  },
  emerald: { border: 'border-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'glow-green' },
  green:   { border: 'border-green-500/40',   text: 'text-green-400',   bg: 'bg-green-500/10',   glow: 'glow-green' },
  blue:    { border: 'border-blue-500/40',    text: 'text-blue-400',    bg: 'bg-blue-500/10',    glow: ''           },
};

export default function RouteOptionCard({ route, selected, onSelect }) {
  const c = colorMap[route.color] || colorMap.cyan;
  return (
    <div
      onClick={() => onSelect(route.id)}
      className={`route-card glass p-4 border cursor-pointer
        ${selected ? `${c.border} ${c.glow}` : 'border-white/5 hover:border-white/15'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{route.icon}</span>
          <span className={`text-sm font-bold ${selected ? c.text : 'text-white'}`}>{route.label}</span>
        </div>
        {selected && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
            SELECTED
          </span>
        )}
      </div>

      <div className="text-[11px] text-slate-500 mb-3 truncate">via {route.via}</div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className={`text-sm font-bold ${c.text}`}>{route.eta}</div>
          <div className="text-[10px] text-slate-500">ETA</div>
          <div className="text-[10px] text-emerald-400">{route.etaSaved}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-white">{route.cost}</div>
          <div className="text-[10px] text-slate-500">Cost</div>
          <div className={`text-[10px] ${route.costDelta.startsWith('−') ? 'text-emerald-400' : 'text-red-400'}`}>{route.costDelta}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-white">{route.co2}</div>
          <div className="text-[10px] text-slate-500">CO₂</div>
          <div className={`text-[10px] ${route.co2Delta.startsWith('−') ? 'text-emerald-400' : 'text-red-400'}`}>{route.co2Delta}</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-slate-500">Reliability</span>
          <span className={c.text}>{route.reliability}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${c.bg} border-r-2 ${c.border}`}
            style={{ width: `${route.reliability}%`, transition: 'width 1s ease' }} />
        </div>
      </div>
    </div>
  );
}
