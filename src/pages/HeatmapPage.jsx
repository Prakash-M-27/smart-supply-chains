import { useState } from 'react';
import Heatmap from '../components/Heatmap';
import { heatmapZones, suppliers } from '../data/mockData';

const FILTERS = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];
const riskColor = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };
const riskBg    = { HIGH: 'bg-red-500/15 border-red-500/30 text-red-400', MEDIUM: 'bg-amber-500/15 border-amber-500/30 text-amber-400', LOW: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' };

export default function HeatmapPage() {
  const [filter, setFilter] = useState('ALL');

  const counts = {
    HIGH:   heatmapZones.filter(z => z.risk === 'HIGH').length,
    MEDIUM: heatmapZones.filter(z => z.risk === 'MEDIUM').length,
    LOW:    heatmapZones.filter(z => z.risk === 'LOW').length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Global Risk Heatmap</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time logistics risk intelligence across India</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="blink text-red-400 text-sm">●</span>
          <span className="text-xs text-red-400 font-bold">{counts.HIGH} HIGH RISK ZONES ACTIVE</span>
        </div>
      </div>

      {/* Risk summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {(['HIGH','MEDIUM','LOW']).map(r => (
          <div key={r} className={`glass border p-4 ${riskBg[r]}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{counts[r]}</div>
                <div className="text-xs font-semibold mt-0.5">{r} RISK ZONES</div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${riskColor[r]}20`, boxShadow: `0 0 16px ${riskColor[r]}40` }}>
                <div className="w-4 h-4 rounded-full" style={{ background: riskColor[r] }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map + sidebar */}
      <div className="grid grid-cols-3 gap-5">
        {/* Map */}
        <div className="col-span-2 glass border border-white/5 p-4" style={{ minHeight: 480 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-white">India Logistics Risk Map</div>
            <div className="flex items-center gap-2">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all
                    ${filter === f
                      ? f === 'HIGH' ? 'bg-red-500/20 border-red-500/40 text-red-400'
                      : f === 'MEDIUM' ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : f === 'LOW' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <Heatmap filter={filter} />

          {/* Legend */}
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-white/5">
            {[['HIGH','#ef4444','Critical Zone'],['MEDIUM','#f59e0b','Moderate Risk'],['LOW','#10b981','Safe Zone']].map(([r,c,l]) => (
              <div key={r} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }}></div>
                <span className="text-[10px] text-slate-400">{l}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 ml-4">
              <div className="w-2 h-2 rounded-full bg-cyan-400 blink"></div>
              <span className="text-[10px] text-slate-400">Live Shipment</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Zone list */}
          <div className="glass border border-white/5 p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Risk Zone Details</div>
            <div className="space-y-2">
              {heatmapZones
                .filter(z => filter === 'ALL' || z.risk === filter)
                .map(z => (
                  <div key={z.id} className="flex items-center gap-3 bg-white/3 rounded-lg px-3 py-2 border border-white/5">
                    <div className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: riskColor[z.risk], boxShadow: `0 0 6px ${riskColor[z.risk]}` }}></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{z.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{z.reason}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${riskBg[z.risk]}`}>{z.risk}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Supplier risk */}
          <div className="glass border border-white/5 p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Supplier Risk Scores</div>
            <div className="space-y-2.5">
              {suppliers.map(s => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-300 truncate">{s.name}</span>
                    <span className={`text-[11px] font-bold ${s.score >= 85 ? 'text-emerald-400' : s.score >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                      {s.score}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${s.score}%`,
                        background: s.score >= 85 ? '#10b981' : s.score >= 70 ? '#f59e0b' : '#ef4444',
                        boxShadow: `0 0 6px ${s.score >= 85 ? '#10b981' : s.score >= 70 ? '#f59e0b' : '#ef4444'}`,
                      }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
