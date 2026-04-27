import { useState, useRef, useEffect } from 'react';
import RouteMap from '../components/RouteMap';
import RouteOptionCard from '../components/RouteOptionCard';
import { computeRoutes, CITIES } from '../services/routeEngine';
import { CheckCircle, Zap, MapPin, ArrowRight, Search, X } from 'lucide-react';

function CityInput({ label, value, onChange, placeholder, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync query when value changes externally
  useEffect(() => { setQuery(value); }, [value]);

  const filtered = CITIES.filter(c =>
    c.toLowerCase().includes(query.toLowerCase()) && c !== query
  ).slice(0, 8);

  const select = (city) => { onChange(city); setQuery(city); setOpen(false); };
  const clear   = ()     => { onChange('');  setQuery('');   setOpen(false); };

  return (
    <div className="relative flex-1" ref={ref}>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">{label}</div>
      <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all
        ${open ? 'border-cyan-500/60' : 'border-white/15 hover:border-white/30'}`}
        style={{ background: '#0f1929', border: `1px solid ${open ? 'rgba(6,182,212,0.6)' : 'rgba(255,255,255,0.12)'}` }}>
        <Icon size={14} className="text-cyan-400 shrink-0" />
        <input
          className="flex-1 bg-transparent text-sm text-white outline-none"
          style={{ color: '#fff', caretColor: '#06b6d4' }}
          placeholder={placeholder}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); onChange(''); }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button onClick={clear} className="text-slate-600 hover:text-slate-400 transition-colors">
            <X size={13} />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[999] rounded-xl overflow-hidden shadow-2xl"
          style={{ background: '#111827', border: '1px solid rgba(6,182,212,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}>
          {filtered.map(city => (
            <button key={city} onClick={() => select(city)}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:text-cyan-400
                transition-colors flex items-center gap-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <MapPin size={11} className="text-cyan-600 shrink-0" />
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const disruptionIcon  = { CYCLONE: '🌀', STRIKE: '✊', WEATHER: '🌫️', TRAFFIC: '🚦' };
const disruptionColor = { CYCLONE: 'border-red-500/30 glow-red', STRIKE: 'border-orange-500/30 glow-amber', WEATHER: 'border-amber-500/30', TRAFFIC: 'border-yellow-500/30' };

export default function RouteOptimization() {
  const [from, setFrom]         = useState('');
  const [to, setTo]             = useState('');
  const [result, setResult]     = useState(null);
  const [selected, setSelected] = useState('D');
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!from || !to || from === to) return;
    const data = computeRoutes(from, to);
    setResult(data);
    setSelected('D');
    setConfirmed(false);
    setSearched(true);
  };

  const handleSwap = () => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
    setResult(null);
    setConfirmed(false);
    setSearched(false);
  };

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => { setConfirming(false); setConfirmed(true); }, 1800);
  };

  const selectedRoute = result?.routes.find(r => r.id === selected);
  const canSearch = from && to && from !== to;

  return (
    <div className="space-y-5" style={{ position: 'relative' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Auto Reroute Engine</h1>
          <p className="text-xs text-slate-500 mt-0.5">Enter your route — AI detects disruptions and suggests optimal alternatives</p>
        </div>
        <div className="glass border border-cyan-500/20 px-4 py-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 blink"></span>
          <span className="text-xs text-cyan-400 font-bold">ROUTE ENGINE ACTIVE</span>
        </div>
      </div>

      {/* ── MANUAL INPUT FORM ── */}
      <div className="glass border border-cyan-500/20 p-5 glow-cyan" style={{ overflow: 'visible' }}>
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Search size={12} />
          Enter Shipment Route
        </div>

        <div className="flex items-end gap-3">
          <CityInput
            label="Source City"
            value={from}
            onChange={setFrom}
            placeholder="e.g. Mumbai"
            icon={MapPin}
          />

          {/* Swap button */}
          <button onClick={handleSwap}
            className="mb-0.5 w-9 h-9 shrink-0 rounded-xl bg-white/5 border border-white/10
              hover:bg-cyan-500/15 hover:border-cyan-500/30 transition-all flex items-center justify-center
              text-slate-400 hover:text-cyan-400">
            ⇄
          </button>

          <CityInput
            label="Destination City"
            value={to}
            onChange={setTo}
            placeholder="e.g. Chennai"
            icon={MapPin}
          />

          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className="mb-0.5 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400
              disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed
              text-black font-bold px-6 py-2.5 rounded-xl transition-all text-sm
              shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 shrink-0">
            <Zap size={15} />
            Analyze Route
          </button>
        </div>

        {/* Quick picks */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-slate-600">Quick:</span>
          {[
            ['Mumbai', 'Chennai'],
            ['Delhi', 'Hyderabad'],
            ['Kolkata', 'Bangalore'],
            ['JNPT', 'Pune'],
            ['Ahmedabad', 'Delhi'],
          ].map(([f, t]) => (
            <button key={f + t}
              onClick={() => { setFrom(f); setTo(t); setResult(null); setConfirmed(false); setSearched(false); }}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/8
                text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/8 transition-all">
              {f} → {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS ── */}
      {searched && !result && (
        <div className="glass border border-white/5 p-8 text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-sm text-slate-400">Please select valid cities from the dropdown list.</div>
        </div>
      )}

      {result && (
        <>
          {/* Disruption banner — only if disruption detected */}
          {result.disruption && (
            <div className={`glass border p-4 flex items-center gap-4 ${disruptionColor[result.disruption.type] || 'border-red-500/30 glow-red'}`}>
              <span className="text-2xl">{disruptionIcon[result.disruption.type] || '⚠️'}</span>
              <div className="flex-1">
                <div className="text-sm font-bold text-red-400">
                  {result.disruption.label} — {to} Disruption Detected
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Direct route impacted. Estimated delay: +{result.disruption.delay} hours.
                  AI has generated {result.routes.length} alternate route options below.
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-500">Distance</div>
                <div className="text-sm font-bold text-white">{result.distKm.toLocaleString()} km</div>
                <div className="text-xs text-slate-500 mt-1">Disrupted ETA</div>
                <div className="text-sm font-bold text-red-400">{result.originalETA}</div>
              </div>
            </div>
          )}

          {/* No disruption — clean route info */}
          {!result.disruption && (
            <div className="glass border border-emerald-500/20 p-4 flex items-center gap-4">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <div className="text-sm font-bold text-emerald-400">Route Clear — No Active Disruptions</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {from} → {to} · {result.distKm.toLocaleString()} km · Baseline ETA: {result.originalETA}
                </div>
              </div>
              <div className="text-xs text-slate-500">Select your preferred optimization strategy below</div>
            </div>
          )}

          {/* Route label */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 glass border border-white/5 px-4 py-2 rounded-xl">
              <MapPin size={13} className="text-cyan-400" />
              <span className="text-sm font-bold text-white">{from}</span>
              <ArrowRight size={13} className="text-slate-500" />
              <MapPin size={13} className="text-red-400" />
              <span className="text-sm font-bold text-white">{to}</span>
            </div>
            <span className="text-xs text-slate-500">{result.distKm.toLocaleString()} km road distance</span>
          </div>

          {/* Map + route options */}
          <div className="grid grid-cols-5 gap-5">
            <div className="col-span-3">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Live Route Visualization</div>
              <RouteMap from={from} to={to} selectedRoute={selected} />
              <div className="flex items-center gap-6 mt-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-red-500" style={{ boxShadow: '0 0 6px #ef4444' }}></div>
                  <span className="text-[10px] text-slate-400">Disrupted / Direct Route</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-emerald-400" style={{ boxShadow: '0 0 6px #10b981' }}></div>
                  <span className="text-[10px] text-slate-400">Recommended Alternate</span>
                </div>
              </div>
            </div>

            <div className="col-span-2 space-y-3">
              <div className="text-xs text-slate-500 uppercase tracking-wider">Select Optimization Strategy</div>
              {result.routes.map(r => (
                <RouteOptionCard key={r.id} route={r} selected={selected === r.id} onSelect={setSelected} />
              ))}
            </div>
          </div>

          {/* Confirm bar */}
          {selectedRoute && (
            <div className={`glass border p-5 ${confirmed ? 'border-emerald-500/40 glow-green' : 'border-cyan-500/30 glow-cyan'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">SELECTED OPTIMIZATION — {from} → {to}</div>
                  <div className="text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                    <span>{selectedRoute.icon}</span>
                    {selectedRoute.label}
                    <span className="text-sm text-slate-400 font-normal">via {selectedRoute.via}</span>
                  </div>
                  <div className="flex items-center gap-6 mt-2 flex-wrap">
                    <div><span className="text-xs text-slate-500">ETA: </span><span className="text-sm font-bold text-cyan-400">{selectedRoute.eta}</span></div>
                    <div><span className="text-xs text-slate-500">Cost: </span><span className="text-sm font-bold text-white">{selectedRoute.cost}</span></div>
                    <div><span className="text-xs text-slate-500">CO₂: </span><span className="text-sm font-bold text-emerald-400">{selectedRoute.co2}</span></div>
                    <div><span className="text-xs text-slate-500">Reliability: </span><span className="text-sm font-bold text-white">{selectedRoute.reliability}%</span></div>
                  </div>
                </div>

                {confirmed ? (
                  <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl px-6 py-3 shrink-0">
                    <CheckCircle size={22} className="text-emerald-400" />
                    <div>
                      <div className="text-sm font-bold text-emerald-400">Route Confirmed!</div>
                      <div className="text-[10px] text-slate-400">Driver notified — ETA updated</div>
                    </div>
                  </div>
                ) : (
                  <button onClick={handleConfirm} disabled={confirming}
                    className="flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700
                      text-black font-bold px-8 py-4 rounded-2xl transition-all text-sm shrink-0
                      shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 hover:scale-105 active:scale-95">
                    {confirming ? (
                      <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>Optimizing...</>
                    ) : (
                      <><Zap size={18} />Confirm Auto Optimization</>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Carbon callout */}
          {selectedRoute?.id === 'C' && (
            <div className="glass border border-green-500/25 p-3 flex items-center gap-3">
              <span className="text-xl">🌿</span>
              <span className="text-sm text-slate-300">
                <strong className="text-green-400">Sustainability Win: </strong>
                This route saves <strong className="text-green-400">{selectedRoute.co2Delta}</strong> CO₂ compared to the direct path.
              </span>
            </div>
          )}
        </>
      )}

      {/* Empty state — only show when no input at all */}
      {!searched && !from && !to && (
        <div className="glass border border-white/5 p-12 text-center">
          <div className="text-4xl mb-3 float">🛣️</div>
          <div className="text-base font-semibold text-slate-300 mb-1">Ready to Analyze Any Route</div>
          <div className="text-xs text-slate-500">Enter a source and destination city above to detect disruptions and get AI-optimized route alternatives.</div>
          <div className="flex items-center justify-center gap-6 mt-6">
            {['Weather Risk', 'Traffic Congestion', 'Port Strikes', 'Customs Delays'].map(f => (
              <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60"></span>{f}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
