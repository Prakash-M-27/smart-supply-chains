import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Clock, Mail, LogOut, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function PendingApproval({ rejected = false }) {
  const { user, profile, logout } = useAuth();
  const [checking, setChecking] = useState(false);

  async function handleRefresh() {
    setChecking(true);
    // Force reload — onAuthStateChanged will re-fetch profile
    window.location.reload();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0B1120' }}>
      <div className="scanline" />

      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', boxShadow: '0 0 20px rgba(6,182,212,0.2)' }}>
            <ShieldCheck size={22} className="text-cyan-400" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-white">SupplyShield AI</div>
            <div className="text-[10px] text-cyan-400 tracking-widest uppercase">Control Tower</div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${rejected ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
            backdropFilter: 'blur(24px)',
            boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 40px ${rejected ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)'}`,
          }}>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: rejected ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
              border: `1px solid ${rejected ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
            }}>
            {rejected
              ? <span className="text-3xl">🚫</span>
              : <Clock size={30} className="text-amber-400" />
            }
          </div>

          <h2 className={`text-xl font-bold mb-2 ${rejected ? 'text-red-400' : 'text-amber-400'}`}>
            {rejected ? 'Access Denied' : 'Pending Approval'}
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            {rejected
              ? `Your registration request has been rejected. ${profile?.rejectionReason ? `Reason: "${profile.rejectionReason}"` : 'Please contact your administrator for more information.'}`
              : 'Your account has been created successfully. An administrator needs to review and approve your access before you can use the platform.'
            }
          </p>

          {/* User info */}
          {user && (
            <div className="rounded-xl p-4 mb-6 text-left"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Account Details</div>
              <div className="space-y-2">
                {[
                  { label: 'Name',       value: profile?.fullName || user.displayName || '—' },
                  { label: 'Email',      value: user.email },
                  { label: 'Role',       value: profile?.role || '—' },
                  { label: 'Company',    value: profile?.companyName || '—' },
                  { label: 'Status',     value: rejected ? 'Rejected' : 'Pending Review', highlight: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <span className={`text-xs font-medium capitalize ${
                      item.highlight
                        ? rejected ? 'text-red-400' : 'text-amber-400'
                        : 'text-white'
                    }`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps (only for pending) */}
          {!rejected && (
            <div className="space-y-2 mb-6">
              {[
                { icon: '✅', label: 'Account Created',        done: true  },
                { icon: '📧', label: 'Email Verification Sent', done: true  },
                { icon: '⏳', label: 'Admin Review',            done: false },
                { icon: '🚀', label: 'Platform Access Granted', done: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ background: s.done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)' }}>
                  <span className="text-base">{s.icon}</span>
                  <span className={`text-xs ${s.done ? 'text-emerald-400' : 'text-slate-500'}`}>{s.label}</span>
                  {s.done && <span className="ml-auto text-[10px] text-emerald-400 font-bold">DONE</span>}
                </div>
              ))}
            </div>
          )}

          {/* Contact info */}
          <div className="flex items-center gap-2 justify-center mb-6 text-xs text-slate-500">
            <Mail size={12} />
            <span>Contact <span className="text-cyan-400">admin@supplychield.ai</span> for urgent access</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!rejected && (
              <button onClick={handleRefresh} disabled={checking}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4' }}>
                <RefreshCw size={13} className={checking ? 'animate-spin' : ''} />
                Check Status
              </button>
            )}
            <button onClick={logout}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium
                text-slate-400 hover:text-red-400 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 mt-4">
          SupplyShield AI · Enterprise Access Control
        </p>
      </div>
    </div>
  );
}
