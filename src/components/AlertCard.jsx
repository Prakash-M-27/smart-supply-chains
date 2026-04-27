const severityStyle = {
  CRITICAL: { dot: 'bg-red-500',    text: 'text-red-400',    badge: 'bg-red-500/20 text-red-400 border-red-500/30'    },
  HIGH:     { dot: 'bg-orange-500', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  MEDIUM:   { dot: 'bg-amber-500',  text: 'text-amber-400',  badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30'  },
  LOW:      { dot: 'bg-blue-500',   text: 'text-blue-400',   badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30'    },
};

const typeIcon = { CYCLONE: '🌀', TRAFFIC: '🚦', STRIKE: '✊', WEATHER: '🌫️', CUSTOMS: '📋', FUEL: '⛽' };

export default function AlertCard({ alert, compact = false }) {
  const s = severityStyle[alert.severity] || severityStyle.LOW;
  return (
    <div className={`glass p-3 border border-white/5 hover:border-white/10 transition-all ${alert.severity === 'CRITICAL' ? 'glow-red' : ''}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">{typeIcon[alert.type] || '⚠️'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.badge}`}>
              {alert.severity === 'CRITICAL' && <span className="blink inline-block mr-1">●</span>}
              {alert.severity}
            </span>
            <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">{alert.message}</p>
          {!compact && (
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[10px] text-slate-500">Route:</span>
              <span className="text-[10px] text-cyan-400 font-medium">{alert.route}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
