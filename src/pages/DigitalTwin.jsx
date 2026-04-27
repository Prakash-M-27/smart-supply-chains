import { useState } from 'react';
import SimulationPanel from '../components/SimulationPanel';
import { simulationScenarios } from '../data/mockData';
import { Play, RotateCcw, Zap } from 'lucide-react';

export default function DigitalTwin() {
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const scenario = simulationScenarios.find(s => s.id === selected);

  const runSim = () => {
    setRunning(true);
    setDone(false);
    setTimeout(() => { setRunning(false); setDone(true); }, 3000);
  };

  const reset = () => { setRunning(false); setDone(false); setSelected(null); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Digital Twin Simulation</h1>
          <p className="text-xs text-slate-500 mt-0.5">Simulate disruptions before they happen — predict ripple effects</p>
        </div>
        <div className="glass border border-purple-500/30 px-4 py-2 flex items-center gap-2">
          <span className="text-purple-400 text-sm">◈</span>
          <span className="text-xs text-purple-400 font-bold">TWIN ENGINE READY</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Scenario selector */}
        <div className="glass border border-white/5 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">What-If Scenarios</div>
          <div className="space-y-2">
            {simulationScenarios.map(s => (
              <button key={s.id} onClick={() => { setSelected(s.id); setDone(false); setRunning(false); }}
                className={`w-full text-left p-3 rounded-xl border transition-all
                  ${selected === s.id
                    ? 'border-purple-500/40 bg-purple-500/10 text-white'
                    : 'border-white/5 bg-white/2 text-slate-400 hover:border-white/15 hover:text-white'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-xs font-semibold">{s.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-4 space-y-2">
            <button onClick={runSim} disabled={!selected || running}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500
                disabled:bg-purple-900 disabled:text-purple-700 text-white font-bold py-3 rounded-xl
                transition-all text-sm shadow-lg shadow-purple-500/20">
              {running ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Simulating...</>
              ) : (
                <><Play size={15} />Run Simulation</>
              )}
            </button>
            <button onClick={reset}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10
                text-slate-400 hover:text-white font-medium py-2.5 rounded-xl transition-all text-xs">
              <RotateCcw size={13} />Reset
            </button>
          </div>
        </div>

        {/* Twin visualization */}
        <div className="col-span-2 glass border border-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-white">Logistics Network Twin</div>
            {running && <span className="text-xs text-purple-400 blink font-bold">● SIMULATING RIPPLE EFFECTS...</span>}
            {done && <span className="text-xs text-emerald-400 font-bold">✓ SIMULATION COMPLETE</span>}
          </div>
          <SimulationPanel scenario={scenario} running={running || done} />
        </div>
      </div>

      {/* Impact metrics */}
      {(running || done) && scenario && (
        <div className={`glass border p-5 transition-all ${done ? 'border-red-500/30 glow-red' : 'border-purple-500/20'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-red-400" />
            <span className="text-sm font-bold text-white">Simulation Impact Analysis — {scenario.label}</span>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Delay Impact',          value: `+${scenario.delayHours}h`,    color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
              { label: 'Cost Increase',          value: scenario.costIncrease,         color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
              { label: 'Affected Shipments',     value: scenario.affectedShipments,    color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
              { label: 'Recovery Time',          value: `${Math.round(scenario.delayHours * 0.6)}h`, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
            ].map(m => (
              <div key={m.label} className={`${m.bg} border ${m.border} rounded-xl p-3 text-center`}>
                <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-[10px] text-slate-500 mt-1">{m.label}</div>
              </div>
            ))}
          </div>

          {done && (
            <div className="space-y-2">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">AI Mitigation Recommendations</div>
              {[
                { icon: '🔄', text: `Activate backup route via Bangalore hub — reduces delay by ${Math.round(scenario.delayHours * 0.4)}h`, action: 'AUTO-APPLY' },
                { icon: '🏭', text: `Redistribute ${Math.round(scenario.affectedShipments * 0.3)} shipments to Hyderabad warehouse`, action: 'REVIEW' },
                { icon: '📞', text: `Alert ${scenario.affectedShipments} downstream customers of revised ETAs`, action: 'NOTIFY' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/3 rounded-lg px-3 py-2.5 border border-white/5">
                  <span className="text-base">{r.icon}</span>
                  <span className="text-xs text-slate-300 flex-1">{r.text}</span>
                  <button className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all
                    ${r.action === 'AUTO-APPLY'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>
                    {r.action}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blockchain proof */}
      <div className="glass border border-white/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🔗</span>
          <span className="text-sm font-semibold text-white">Blockchain-Lite Proof of Delivery</span>
          <span className="ml-auto text-[10px] text-cyan-400 font-bold">IMMUTABLE LEDGER</span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {[
            { step: 'Dispatch', hash: '0xa3f2...b91c', time: '08:00', done: true  },
            { step: 'Checkpoint 1', hash: '0xd7e1...4a2f', time: '10:30', done: true  },
            { step: 'Checkpoint 2', hash: '0xb5c8...7d3e', time: '13:00', done: false },
            { step: 'Delivery', hash: '0x—', time: 'Pending', done: false },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className={`glass border rounded-xl p-3 text-center min-w-[110px]
                ${b.done ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5'}`}>
                <div className={`text-[10px] font-bold mb-1 ${b.done ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {b.done ? '✓' : '○'} {b.step}
                </div>
                <div className="text-[9px] font-mono text-slate-600">{b.hash}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{b.time}</div>
              </div>
              {i < 3 && <div className={`w-6 h-0.5 shrink-0 ${b.done ? 'bg-emerald-500/40' : 'bg-white/10'}`}></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
