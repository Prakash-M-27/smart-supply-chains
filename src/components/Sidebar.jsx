import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Route, GitBranch, Map, ShieldCheck, LogOut, User, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/',           icon: LayoutDashboard, label: 'Control Tower',   roles: null          },
  { to: '/risk',       icon: AlertTriangle,   label: 'Predictive Risk', roles: null          },
  { to: '/reroute',    icon: Route,           label: 'Auto Reroute',    roles: null          },
  { to: '/twin',       icon: GitBranch,       label: 'Digital Twin',    roles: null          },
  { to: '/heatmap',    icon: Map,             label: 'Risk Heatmap',    roles: null          },
  { to: '/admin/users',icon: Users,           label: 'User Management', roles: ['admin']     },
];

const roleColor = {
  admin:   'text-red-400',
  manager: 'text-amber-400',
  analyst: 'text-cyan-400',
};

const roleBadge = {
  admin:   'bg-red-500/15 border-red-500/25 text-red-400',
  manager: 'bg-amber-500/15 border-amber-500/25 text-amber-400',
  analyst: 'bg-cyan-500/15 border-cyan-500/25 text-cyan-400',
};

export default function Sidebar() {
  const { user, role, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-50"
      style={{ background: 'rgba(11,17,32,0.97)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center glow-cyan">
          <ShieldCheck size={20} className="text-cyan-400" />
        </div>
        <div>
          <div className="text-sm font-bold text-white tracking-wide">SupplyShield</div>
          <div className="text-[10px] text-cyan-400 tracking-widest uppercase">AI Platform</div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 blink"></span>
        <span className="text-[11px] text-emerald-400 font-medium">LIVE MONITORING</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.filter(l => !l.roles || l.roles.includes(role)).map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               ${isActive
                 ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                 : 'text-slate-400 hover:text-white hover:bg-white/5'}`
            }>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* System status */}
      <div className="px-5 py-3 border-t border-white/5">
        <div className="text-[10px] text-slate-500 mb-1">SYSTEM STATUS</div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Prediction Engine</span>
          <span className="text-[11px] text-emerald-400 font-semibold">ACTIVE</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-slate-400">Data Streams</span>
          <span className="text-[11px] text-cyan-400 font-semibold">14 / 14</span>
        </div>
      </div>

      {/* User info + logout */}
      {user && (
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              {user.photoURL
                ? <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                : <User size={15} className="text-cyan-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {user.displayName || user.email?.split('@')[0] || 'User'}
              </div>
              <div className={`text-[10px] font-bold capitalize ${roleColor[role] || 'text-slate-400'}`}>
                {role || 'analyst'}
              </div>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border capitalize ${roleBadge[role] || roleBadge.analyst}`}>
              {role || 'analyst'}
            </span>
          </div>

          <button onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs
              font-medium text-slate-400 hover:text-red-400 transition-all
              hover:bg-red-500/10 border border-white/5 hover:border-red-500/20">
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
