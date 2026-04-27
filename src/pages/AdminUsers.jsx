import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Users, CheckCircle, XCircle, Clock, Search,
  RefreshCw, Shield, Filter, ChevronDown,
} from 'lucide-react';

const STATUS_STYLE = {
  pending:  { text: 'text-amber-400',  bg: 'bg-amber-500/15',  border: 'border-amber-500/25',  label: '⏳ Pending'  },
  approved: { text: 'text-emerald-400',bg: 'bg-emerald-500/15',border: 'border-emerald-500/25',label: '✅ Approved' },
  rejected: { text: 'text-red-400',    bg: 'bg-red-500/15',    border: 'border-red-500/25',    label: '🚫 Rejected' },
};

const ROLE_OPTIONS = ['admin','manager','ops','analyst','warehouse'];

function StatCard({ icon: Icon, value, label, color, bg, border }) {
  return (
    <div className="glass p-4 border" style={{ borderColor: border }}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg }}>
          <Icon size={17} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

export default function AdminUsers() {
  const { user: adminUser } = useAuth();
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');   // all | pending | approved | rejected
  const [search,   setSearch]   = useState('');
  const [busy,     setBusy]     = useState({});       // { uid: true } while processing
  const [rejectModal, setRejectModal] = useState(null); // uid being rejected
  const [rejectReason, setRejectReason] = useState('');
  const [roleEdit, setRoleEdit] = useState({});       // { uid: newRole }

  async function fetchUsers() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function approve(uid) {
    setBusy(b => ({ ...b, [uid]: true }));
    try {
      const newRole = roleEdit[uid];
      const update  = {
        status:     'approved',
        approvedBy: adminUser.email,
        approvedAt: serverTimestamp(),
      };
      if (newRole) update.role = newRole;
      await updateDoc(doc(db, 'users', uid), update);
      setUsers(u => u.map(x => x.id === uid ? { ...x, status: 'approved', ...(newRole ? { role: newRole } : {}) } : x));
      toast.success('User approved successfully.');
    } catch {
      toast.error('Failed to approve user.');
    } finally {
      setBusy(b => ({ ...b, [uid]: false }));
    }
  }

  async function reject(uid) {
    if (!rejectReason.trim()) { toast.error('Please enter a rejection reason.'); return; }
    setBusy(b => ({ ...b, [uid]: true }));
    try {
      await updateDoc(doc(db, 'users', uid), {
        status:          'rejected',
        rejectedAt:      serverTimestamp(),
        rejectionReason: rejectReason.trim(),
      });
      setUsers(u => u.map(x => x.id === uid ? { ...x, status: 'rejected', rejectionReason: rejectReason } : x));
      toast.success('User rejected.');
      setRejectModal(null);
      setRejectReason('');
    } catch {
      toast.error('Failed to reject user.');
    } finally {
      setBusy(b => ({ ...b, [uid]: false }));
    }
  }

  async function updateRole(uid, newRole) {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      setUsers(u => u.map(x => x.id === uid ? { ...x, role: newRole } : x));
      toast.success('Role updated.');
    } catch {
      toast.error('Failed to update role.');
    }
  }

  const filtered = users.filter(u => {
    const matchStatus = filter === 'all' || u.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.companyName?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all:      users.length,
    pending:  users.filter(u => u.status === 'pending').length,
    approved: users.filter(u => u.status === 'approved').length,
    rejected: users.filter(u => u.status === 'rejected').length,
  };

  function fmtDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">User Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Review, approve and manage platform access</p>
        </div>
        <button onClick={fetchUsers} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-cyan-400 transition-all hover:bg-cyan-500/10"
          style={{ border: '1px solid rgba(6,182,212,0.2)' }}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users}       value={counts.all}      label="Total Users"      color="#06b6d4" bg="rgba(6,182,212,0.1)"   border="rgba(6,182,212,0.15)"   />
        <StatCard icon={Clock}       value={counts.pending}  label="Pending Approval" color="#f59e0b" bg="rgba(245,158,11,0.1)"  border="rgba(245,158,11,0.15)"  />
        <StatCard icon={CheckCircle} value={counts.approved} label="Approved Users"   color="#10b981" bg="rgba(16,185,129,0.1)"  border="rgba(16,185,129,0.15)"  />
        <StatCard icon={XCircle}     value={counts.rejected} label="Rejected"         color="#ef4444" bg="rgba(239,68,68,0.1)"   border="rgba(239,68,68,0.15)"   />
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {['all','pending','approved','rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={{
                background: filter === f ? 'rgba(6,182,212,0.15)' : 'transparent',
                color: filter === f ? '#06b6d4' : '#64748b',
                border: filter === f ? '1px solid rgba(6,182,212,0.25)' : '1px solid transparent',
              }}>
              {f} {counts[f] > 0 && <span className="ml-1 opacity-70">({counts[f]})</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={13} className="text-slate-500 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or company..."
            className="flex-1 bg-transparent text-sm text-white outline-none"
            style={{ color: '#fff' }} />
        </div>
      </div>

      {/* Table */}
      <div className="glass border border-white/5 overflow-hidden">
        {/* Table header */}
        <div className="grid gap-3 px-4 py-3 border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-wider font-semibold"
          style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 140px' }}>
          <span>User</span>
          <span>Company / Dept</span>
          <span>Role</span>
          <span>Status</span>
          <span>Registered</span>
          <span>Last Login</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
              <span className="text-xs text-slate-500">Loading users...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-sm text-slate-400">No users found</div>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(u => {
              const st = STATUS_STYLE[u.status] || STATUS_STYLE.pending;
              const isBusy = busy[u.id];
              return (
                <div key={u.id} className="grid gap-3 px-4 py-3.5 items-center hover:bg-white/2 transition-colors"
                  style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 140px' }}>

                  {/* User */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}>
                      {(u.fullName || u.email || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{u.fullName || '—'}</div>
                      <div className="text-[10px] text-slate-500 truncate">{u.email}</div>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="min-w-0">
                    <div className="text-xs text-slate-300 truncate">{u.companyName || '—'}</div>
                    <div className="text-[10px] text-slate-500 truncate">{u.department || '—'}</div>
                  </div>

                  {/* Role — editable for approved users */}
                  <div>
                    {u.status === 'pending' ? (
                      <div className="relative">
                        <select
                          value={roleEdit[u.id] || u.role || 'analyst'}
                          onChange={e => setRoleEdit(r => ({ ...r, [u.id]: e.target.value }))}
                          className="text-[10px] font-semibold text-cyan-400 bg-transparent outline-none appearance-none pr-3 capitalize cursor-pointer"
                          style={{ border: 'none' }}>
                          {ROLE_OPTIONS.map(r => (
                            <option key={r} value={r} style={{ background: '#111827' }}>{r}</option>
                          ))}
                        </select>
                        <ChevronDown size={9} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>
                    ) : (
                      <select
                        value={u.role || 'analyst'}
                        onChange={e => updateRole(u.id, e.target.value)}
                        className="text-[10px] font-semibold text-cyan-400 bg-transparent outline-none appearance-none capitalize cursor-pointer"
                        style={{ border: 'none' }}>
                        {ROLE_OPTIONS.map(r => (
                          <option key={r} value={r} style={{ background: '#111827' }}>{r}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                      {st.label}
                    </span>
                  </div>

                  {/* Registered */}
                  <div className="text-[10px] text-slate-500">{fmtDate(u.createdAt)}</div>

                  {/* Last login */}
                  <div className="text-[10px] text-slate-500">{fmtDate(u.lastLogin)}</div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {u.status === 'pending' && (
                      <>
                        <button onClick={() => approve(u.id)} disabled={isBusy}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold
                            text-emerald-400 transition-all hover:scale-105 disabled:opacity-50"
                          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                          {isBusy ? <RefreshCw size={10} className="animate-spin" /> : <CheckCircle size={10} />}
                          Approve
                        </button>
                        <button onClick={() => { setRejectModal(u.id); setRejectReason(''); }} disabled={isBusy}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold
                            text-red-400 transition-all hover:scale-105 disabled:opacity-50"
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                          <XCircle size={10} />
                          Reject
                        </button>
                      </>
                    )}
                    {u.status === 'approved' && (
                      <button onClick={() => { setRejectModal(u.id); setRejectReason(''); }} disabled={isBusy}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold
                          text-red-400 transition-all hover:scale-105 disabled:opacity-50"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <XCircle size={10} />
                        Revoke
                      </button>
                    )}
                    {u.status === 'rejected' && (
                      <button onClick={() => approve(u.id)} disabled={isBusy}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold
                          text-cyan-400 transition-all hover:scale-105 disabled:opacity-50"
                        style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                        {isBusy ? <RefreshCw size={10} className="animate-spin" /> : <CheckCircle size={10} />}
                        Re-approve
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: '#111827', border: '1px solid rgba(239,68,68,0.25)', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <XCircle size={18} className="text-red-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Reject / Revoke Access</div>
                <div className="text-[10px] text-slate-500">Provide a reason for the user</div>
              </div>
            </div>

            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete information, unauthorized role request..."
              rows={3}
              className="w-full text-sm text-white rounded-xl p-3 outline-none resize-none mb-4"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(239,68,68,0.5)'}
              onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />

            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Cancel
              </button>
              <button onClick={() => reject(rejectModal)} disabled={busy[rejectModal]}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.4)' }}>
                {busy[rejectModal] ? <RefreshCw size={13} className="animate-spin" /> : <XCircle size={13} />}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
