import { Package, AlertTriangle, RefreshCw, Leaf, Star, Activity, Bell, Zap } from 'lucide-react';

const cards = (k) => [
  { label: 'Total Shipments',       value: k.totalShipments.toLocaleString(), icon: Package,       color: 'cyan',    sub: '+12 today'         },
  { label: 'Delayed Shipments',     value: k.delayed,                         icon: AlertTriangle, color: 'red',     sub: '3.7% of total'     },
  { label: 'AI Auto-Rerouted',      value: k.autoRerouted,                    icon: RefreshCw,     color: 'emerald', sub: 'Last 24 hours'     },
  { label: 'Carbon Saved',          value: k.carbonSaved,                     icon: Leaf,          color: 'green',   sub: 'CO₂ equivalent'    },
  { label: 'Supplier Risk Score',   value: `${k.supplierRisk}/100`,           icon: Star,          color: 'amber',   sub: 'Moderate risk'     },
  { label: 'Operational Score',     value: `${k.operationalScore}%`,          icon: Activity,      color: 'blue',    sub: '+5% vs yesterday'  },
  { label: 'Active Alerts',         value: k.activeAlerts,                    icon: Bell,          color: 'orange',  sub: '2 critical'        },
  { label: 'Predicted Risk Events', value: k.predictedRiskEvents,             icon: Zap,           color: 'purple',  sub: 'Next 12 hours'     },
];

const colorMap = {
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/15',   border: 'border-cyan-500/20'   },
  red:    { text: 'text-red-400',    bg: 'bg-red-500/15',    border: 'border-red-500/20'    },
  emerald:{ text: 'text-emerald-400',bg: 'bg-emerald-500/15',border: 'border-emerald-500/20'},
  green:  { text: 'text-green-400',  bg: 'bg-green-500/15',  border: 'border-green-500/20'  },
  amber:  { text: 'text-amber-400',  bg: 'bg-amber-500/15',  border: 'border-amber-500/20'  },
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/15',   border: 'border-blue-500/20'   },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/20' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/20' },
};

export default function KPISection({ kpis }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards(kpis).map(({ label, value, icon: Icon, color, sub }) => {
        const c = colorMap[color];
        return (
          <div key={label} className={`glass p-4 border ${c.border} hover:scale-[1.02] transition-transform`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
                <Icon size={17} className={c.text} />
              </div>
              <span className={`text-[10px] font-semibold ${c.text} uppercase tracking-wider`}>{color === 'red' && value > 0 ? '▲' : '●'}</span>
            </div>
            <div className={`text-2xl font-bold ${c.text} mb-0.5`}>{value}</div>
            <div className="text-xs text-slate-400 font-medium">{label}</div>
            <div className="text-[10px] text-slate-600 mt-1">{sub}</div>
          </div>
        );
      })}
    </div>
  );
}
