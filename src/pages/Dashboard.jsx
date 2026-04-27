import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import KPISection from '../components/KPISection';
import AlertCard from '../components/AlertCard';
import { kpis, alerts, shipments, operationalTrend } from '../data/mockData';
import { CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

const statusStyle = {
  CRITICAL: { text: 'text-red-400',    bg: 'bg-red-500/15',    label: '🔴 CRITICAL' },
  DELAYED:  { text: 'text-orange-400', bg: 'bg-orange-500/15', label: '🟠 DELAYED'  },
  REROUTED: { text: 'text-cyan-400',   bg: 'bg-cyan-500/15',   label: '🔵 REROUTED' },
  ON_TIME:  { text: 'text-emerald-400',bg: 'bg-emerald-500/15',label: '🟢 ON TIME'  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-white/10 p-2 text-xs">
      <div className="text-slate-400 mb-1">{label}</div>
      <div className="text-cyan-400">Score: {payload[0]?.value}</div>
    </div>
  );
};

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Executive Control Tower</h1>
          <p className="text-xs text-slate-500 mt-0.5">AI-Powered Supply Chain Intelligence — Live View</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass border border-white/5 px-4 py-2 text-right">
            <div className="text-xs text-slate-500">SYSTEM TIME</div>
            <div className="text-sm font-mono text-cyan-400">{time.toLocaleTimeString()}</div>
          </div>
          <div className="glass border border-emerald-500/20 px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 blink"></span>
            <span className="text-xs text-emerald-400 font-semibold">ALL SYSTEMS LIVE</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <KPISection kpis={kpis} />

      {/* Middle row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Operational trend */}
        <div className="col-span-2 glass border border-white/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-white">Operational Score Trend</div>
              <div className="text-xs text-slate-500">7-day performance index</div>
            </div>
            <span className="text-2xl font-bold text-cyan-400">87%</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={operationalTrend}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2}
                fill="url(#scoreGrad)" dot={{ fill: '#06b6d4', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Recommendation */}
        <div className="glass border border-cyan-500/20 p-4 glow-cyan">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-400">AI RECOMMENDATION</div>
              <div className="text-[10px] text-slate-500">Confidence: 94%</div>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { icon: '🌀', text: 'Reroute SHP-101 via NH-48 to avoid cyclone impact on Chennai Port', priority: 'URGENT' },
              { icon: '🚦', text: 'Delay SHP-102 departure by 2h to bypass Nagpur congestion window', priority: 'HIGH' },
              { icon: '⚓', text: 'Switch SHP-103 to Nhava Sheva alternate berth — JNPT strike ongoing', priority: 'HIGH' },
            ].map((r, i) => (
              <div key={i} className="bg-white/3 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-start gap-2">
                  <span className="text-sm">{r.icon}</span>
                  <div>
                    <span className={`text-[9px] font-bold mr-1 ${r.priority === 'URGENT' ? 'text-red-400' : 'text-orange-400'}`}>
                      [{r.priority}]
                    </span>
                    <span className="text-[10px] text-slate-300 leading-relaxed">{r.text}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Active Alerts */}
        <div className="glass border border-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-400" />
              <span className="text-sm font-semibold text-white">Active Disruption Alerts</span>
            </div>
            <span className="text-[10px] text-red-400 font-bold blink">● LIVE</span>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 4).map(a => <AlertCard key={a.id} alert={a} compact />)}
          </div>
        </div>

        {/* Shipment Status */}
        <div className="glass border border-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-cyan-400" />
              <span className="text-sm font-semibold text-white">Top Shipments</span>
            </div>
            <span className="text-[10px] text-slate-500">Sorted by risk</span>
          </div>
          <div className="space-y-2">
            {shipments.map(s => {
              const st = statusStyle[s.status];
              return (
                <div key={s.id} className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs font-bold text-white">{s.id}</div>
                      <div className="text-[10px] text-slate-500">{s.from} → {s.to}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">ETA {s.eta}</div>
                      <div className="text-[10px] text-slate-600">{s.truck}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Risk: {s.risk}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Auto-reroute summary */}
      <div className="glass border border-emerald-500/20 p-4">
        <div className="flex items-center gap-3 mb-3">
          <RefreshCw size={15} className="text-emerald-400" />
          <span className="text-sm font-semibold text-white">Auto-Reroute Summary — Last 24 Hours</span>
          <span className="ml-auto text-xs text-emerald-400 font-bold">23 Shipments Optimized</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Avg Delay Prevented', value: '4.2 hrs', icon: '⏱️' },
            { label: 'Cost Savings',         value: '₹3.8L',  icon: '💰' },
            { label: 'CO₂ Reduced',          value: '18.4t',  icon: '🌿' },
            { label: 'SLA Maintained',        value: '96.3%',  icon: '✅' },
          ].map(item => (
            <div key={item.label} className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3 text-center">
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-lg font-bold text-emerald-400">{item.value}</div>
              <div className="text-[10px] text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
