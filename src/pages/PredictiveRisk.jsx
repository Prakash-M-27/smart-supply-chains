import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import RiskGauge from '../components/RiskGauge';
import AlertCard from '../components/AlertCard';
import { etaForecast, riskFactors, alerts } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-white/10 p-2 text-xs space-y-1">
      <div className="text-slate-400">{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: +{p.value}h delay</div>
      ))}
    </div>
  );
};

export default function PredictiveRisk() {
  const [confidence, setConfidence] = useState(78);
  useEffect(() => {
    const id = setInterval(() => setConfidence(v => {
      const delta = (Math.random() - 0.5) * 4;
      return Math.min(95, Math.max(65, Math.round(v + delta)));
    }), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Predictive Risk Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">AI disruption forecasting — next 14 hours</p>
        </div>
        <div className="glass border border-red-500/30 px-4 py-2 flex items-center gap-2 glow-red">
          <span className="blink text-red-400 text-sm">●</span>
          <span className="text-xs text-red-400 font-bold">CRITICAL DISRUPTION DETECTED</span>
        </div>
      </div>

      {/* Top row: gauge + ETA chart */}
      <div className="grid grid-cols-3 gap-5">
        {/* Confidence gauge */}
        <div className="glass border border-white/5 p-5 flex flex-col items-center justify-center">
          <div className="text-xs text-slate-500 mb-3 uppercase tracking-widest">Preemptive Confidence</div>
          <RiskGauge value={confidence} label="Disruption Probability" size={200} />
          <div className="mt-4 text-center">
            <div className="text-xs text-slate-400">Primary Trigger</div>
            <div className="text-sm font-bold text-red-400 mt-1">🌀 Cyclone Michaung</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Chennai Port — ETA Impact: +8h</div>
          </div>
        </div>

        {/* ETA Forecast chart */}
        <div className="col-span-2 glass border border-white/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-white">ETA Deviation Forecast</div>
              <div className="text-xs text-slate-500">Predicted vs baseline delay (hours)</div>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-600 inline-block"></span>Baseline</span>
              <span className="flex items-center gap-1.5 text-red-400"><span className="w-3 h-0.5 bg-red-400 inline-block"></span>AI Predicted</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={etaForecast}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={4} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 2" label={{ value: 'Critical', fill: '#ef4444', fontSize: 9 }} />
              <Line type="monotone" dataKey="baseline" stroke="#475569" strokeWidth={1.5} dot={false} name="Baseline" />
              <Line type="monotone" dataKey="predicted" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 3 }}
                name="Predicted" style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk factor cards */}
      <div>
        <div className="text-sm font-semibold text-white mb-3">Risk Factor Breakdown</div>
        <div className="grid grid-cols-3 gap-4">
          {riskFactors.map(rf => (
            <div key={rf.label} className="glass border border-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300 font-medium">{rf.label}</span>
                <span className="text-sm font-bold" style={{ color: rf.color }}>{rf.value}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${rf.value}%`, background: rf.color, boxShadow: `0 0 8px ${rf.color}` }} />
              </div>
              <div className="text-[10px] text-slate-600 mt-1.5">
                {rf.value >= 75 ? '⚠️ Critical threshold exceeded' : rf.value >= 50 ? '⚡ Elevated — monitor closely' : '✓ Within acceptable range'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: bottleneck timeline + alerts */}
      <div className="grid grid-cols-2 gap-5">
        {/* Bottleneck timeline */}
        <div className="glass border border-white/5 p-4">
          <div className="text-sm font-semibold text-white mb-3">Predicted Bottleneck Timeline</div>
          <div className="space-y-3">
            {[
              { time: '12:00', event: 'Cyclone landfall near Chennai coast', severity: 'CRITICAL', delay: '+8h' },
              { time: '13:30', event: 'Port operations suspended — Chennai', severity: 'CRITICAL', delay: '+6h' },
              { time: '15:00', event: 'NH-44 flooding risk — Nellore stretch', severity: 'HIGH',     delay: '+3h' },
              { time: '17:00', event: 'Warehouse capacity breach — Hyderabad', severity: 'MEDIUM',   delay: '+1.5h' },
              { time: '20:00', event: 'Alternate routes stabilize', severity: 'LOW',      delay: '−2h' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="text-[10px] text-slate-500 font-mono w-12 shrink-0 pt-0.5">{item.time}</div>
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                  item.severity === 'CRITICAL' ? 'bg-red-500' :
                  item.severity === 'HIGH' ? 'bg-orange-500' :
                  item.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <div className="flex-1">
                  <div className="text-xs text-slate-300">{item.event}</div>
                </div>
                <div className={`text-[10px] font-bold shrink-0 ${item.delay.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>
                  {item.delay}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active alerts */}
        <div className="glass border border-white/5 p-4">
          <div className="text-sm font-semibold text-white mb-3">Live Disruption Alerts</div>
          <div className="space-y-2">
            {alerts.map(a => <AlertCard key={a.id} alert={a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
