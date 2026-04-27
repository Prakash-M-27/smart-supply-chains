import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Mail, Lock, ShieldCheck,
  Zap, ArrowRight, RefreshCw, UserPlus,
} from 'lucide-react';

// ── Animated SVG supply chain background (left panel) ──
function SupplyChainAnim() {
  return (
    <svg width="100%" height="260" viewBox="0 0 400 260" className="opacity-60">
      {/* Grid */}
      {[0,1,2,3,4,5].map(i => (
        <line key={`h${i}`} x1="0" y1={i*50} x2="400" y2={i*50} stroke="rgba(6,182,212,0.06)" strokeWidth="1"/>
      ))}
      {[0,1,2,3,4,5,6,7].map(i => (
        <line key={`v${i}`} x1={i*60} y1="0" x2={i*60} y2="260" stroke="rgba(6,182,212,0.06)" strokeWidth="1"/>
      ))}

      {/* Route lines */}
      <path d="M40,200 L120,130 L200,160 L300,80 L370,110"
        fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" strokeDasharray="6 3"/>
      <path d="M40,200 L100,170 L200,160 L280,190 L370,110"
        fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5" strokeDasharray="4 4"/>

      {/* Nodes */}
      {[[40,200,'🏭'],[120,130,'🔄'],[200,160,'⚓'],[300,80,'🏢'],[370,110,'📦']].map(([x,y,icon],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="16" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.3)" strokeWidth="1"/>
          <text x={x} y={y+5} textAnchor="middle" fontSize="12">{icon}</text>
        </g>
      ))}

      {/* Moving truck dot on route 1 */}
      <circle r="4" fill="#06b6d4" style={{ filter: 'drop-shadow(0 0 6px #06b6d4)' }}>
        <animateMotion dur="5s" repeatCount="indefinite"
          path="M40,200 L120,130 L200,160 L300,80 L370,110"/>
      </circle>
      {/* Moving truck dot on route 2 */}
      <circle r="3" fill="#10b981" style={{ filter: 'drop-shadow(0 0 5px #10b981)' }}>
        <animateMotion dur="7s" repeatCount="indefinite"
          path="M370,110 L280,190 L200,160 L100,170 L40,200"/>
      </circle>
    </svg>
  );
}

// ── Floating stat badge ──
function StatBadge({ icon, value, label, color }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
      style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <span className="text-lg">{icon}</span>
      <div>
        <div className={`text-sm font-bold ${color}`}>{value}</div>
        <div className="text-[10px] text-slate-500">{label}</div>
      </div>
    </div>
  );
}

// ── Input field ──
function Field({ label, type, value, onChange, placeholder, icon: Icon, right }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 font-medium mb-1.5">{label}</label>
      <div className="relative flex items-center">
        <Icon size={15} className="absolute left-3.5 text-slate-500 pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-10 py-3 text-sm text-white rounded-xl outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.6)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        {right && <div className="absolute right-3">{right}</div>}
      </div>
    </div>
  );
}

export default function Login() {
  const { user, login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [mode,     setMode]     = useState('login');   // 'login' | 'reset'
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy,     setBusy]     = useState(false);

  // Already logged in → redirect
  if (user) return <Navigate to="/" replace />;

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields.'); return; }
    setBusy(true);
    try {
      await login(email, password, remember);
      toast.success('Welcome back to SupplyShield AI!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google!');
      navigate('/');
    } catch (err) {
      toast.error('Google sign-in failed. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    if (!email) { toast.error('Enter your email address first.'); return; }
    setBusy(true);
    try {
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox.');
      setMode('login');
    } catch {
      toast.error('Failed to send reset email. Check the address.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0B1120' }}>
      {/* Scanline */}
      <div className="scanline" />

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', boxShadow: '0 0 20px rgba(6,182,212,0.2)' }}>
            <ShieldCheck size={22} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-wide">SupplyShield AI</div>
            <div className="text-[10px] text-cyan-400 tracking-widest uppercase">Control Tower Platform</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div>
            <div className="text-[11px] text-cyan-400 font-semibold tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 blink"></span>
              AI-Powered Logistics Intelligence
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-2">
              Predict.<br />
              <span className="text-cyan-400">Prevent.</span><br />
              Optimize.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The world's most advanced supply chain control tower. Detect disruptions before they happen and reroute in real time.
            </p>
          </div>

          {/* Animated map */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-4 pt-3 pb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 blink"></span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Live Network — India Logistics</span>
            </div>
            <SupplyChainAnim />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatBadge icon="📦" value="1,284"  label="Active Shipments" color="text-cyan-400"    />
            <StatBadge icon="🛡️" value="96.3%"  label="SLA Maintained"  color="text-emerald-400" />
            <StatBadge icon="🌿" value="18.4t"  label="CO₂ Saved"       color="text-green-400"   />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[10px] text-slate-600">
          © 2025 SupplyShield AI · Enterprise Edition · v2.1.0
        </div>
      </div>

      {/* ── RIGHT PANEL — Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
              <ShieldCheck size={18} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">SupplyShield AI</div>
              <div className="text-[10px] text-cyan-400 tracking-widest">CONTROL TOWER</div>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}>

            {mode === 'login' ? (
              <>
                <div className="mb-7">
                  <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
                  <p className="text-xs text-slate-500">Sign in to your SupplyShield AI account</p>
                </div>

                {/* Google sign-in */}
                <button onClick={handleGoogle} disabled={busy}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl mb-5
                    text-sm font-medium text-white transition-all hover:scale-[1.02] active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 5.1C9.8 39.8 16.4 44 24 44z"/>
                    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  <span className="text-[11px] text-slate-600">or sign in with email</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <Field
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@supplychield.ai"
                    icon={Mail}
                  />

                  <Field
                    label="Password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    icon={Lock}
                    right={
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="text-slate-500 hover:text-slate-300 transition-colors">
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div onClick={() => setRemember(v => !v)}
                        className="w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer"
                        style={{
                          background: remember ? '#06b6d4' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${remember ? '#06b6d4' : 'rgba(255,255,255,0.15)'}`,
                        }}>
                        {remember && <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>}
                      </div>
                      <span className="text-xs text-slate-400">Remember me</span>
                    </label>
                    <button type="button" onClick={() => setMode('reset')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={busy}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                      font-bold text-sm text-black transition-all mt-2
                      hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: busy ? '#0e7490' : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                      boxShadow: '0 0 24px rgba(6,182,212,0.35)',
                    }}>
                    {busy ? (
                      <><RefreshCw size={15} className="animate-spin" />Authenticating...</>
                    ) : (
                      <><Zap size={15} />Sign In to Control Tower<ArrowRight size={15} /></>
                    )}
                  </button>
                </form>

                {/* Role hint */}
                <div className="mt-6 p-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.1)' }}>
                  <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">Role-Based Access</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: 'Admin',    color: 'text-red-400',    desc: 'Full Access'   },
                      { role: 'Manager',  color: 'text-amber-400',  desc: 'Operations'    },
                      { role: 'Analyst',  color: 'text-cyan-400',   desc: 'Risk Dashboard'},
                    ].map(r => (
                      <div key={r.role} className="text-center">
                        <div className={`text-[11px] font-bold ${r.color}`}>{r.role}</div>
                        <div className="text-[9px] text-slate-600">{r.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider + Create Account */}
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  <span className="text-[11px] text-slate-500">New to SupplyShield?</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                </div>

                <Link to="/register"
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl
                    text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
                  style={{
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    color: '#10b981',
                    boxShadow: '0 0 16px rgba(16,185,129,0.1)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.18)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(16,185,129,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)';  e.currentTarget.style.boxShadow = '0 0 16px rgba(16,185,129,0.1)'; }}>
                  <UserPlus size={16} />
                  Create New Account
                </Link>
              </>
            ) : (
              /* ── FORGOT PASSWORD MODE ── */
              <>
                <button onClick={() => setMode('login')}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-6">
                  ← Back to sign in
                </button>

                <div className="mb-7">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    <Mail size={22} className="text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Reset Password</h2>
                  <p className="text-xs text-slate-500">Enter your email and we'll send a reset link.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                  <Field
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    icon={Mail}
                  />
                  <button type="submit" disabled={busy}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                      font-bold text-sm text-black transition-all
                      hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                      boxShadow: '0 0 24px rgba(6,182,212,0.3)',
                    }}>
                    {busy
                      ? <><RefreshCw size={15} className="animate-spin" />Sending...</>
                      : <><Mail size={15} />Send Reset Link</>
                    }
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Bottom note */}
          <p className="text-center text-[11px] text-slate-600 mt-4">
            Secured by Firebase Authentication · 256-bit encryption
          </p>
        </div>
      </div>
    </div>
  );
}
