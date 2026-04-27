import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, ShieldCheck, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email,  setEmail]  = useState('');
  const [busy,   setBusy]   = useState(false);
  const [sent,   setSent]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your email address.'); return; }
    setBusy(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
      toast.success('Reset email sent! Check your inbox.');
    } catch {
      toast.error('Failed to send reset email. Check the address and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0B1120' }}>
      <div className="scanline" />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', boxShadow: '0 0 20px rgba(6,182,212,0.2)' }}>
            <ShieldCheck size={20} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">SupplyShield AI</div>
            <div className="text-[10px] text-cyan-400 tracking-widest uppercase">Password Recovery</div>
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

          {!sent ? (
            <>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                <Mail size={22} className="text-cyan-400" />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">Forgot Password?</h2>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                No worries. Enter your registered email and we'll send you a secure reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1.5">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail size={14} className="absolute left-3.5 text-slate-500 pointer-events-none" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com" required
                      className="w-full pl-10 pr-4 py-3 text-sm text-white rounded-xl outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.6)'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                </div>

                <button type="submit" disabled={busy}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                    font-bold text-sm text-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', boxShadow: '0 0 24px rgba(6,182,212,0.3)' }}>
                  {busy
                    ? <><RefreshCw size={14} className="animate-spin" />Sending...</>
                    : <><Mail size={14} />Send Reset Link</>
                  }
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Email Sent!</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                A password reset link has been sent to
              </p>
              <p className="text-sm font-semibold text-cyan-400 mb-6">{email}</p>
              <p className="text-[11px] text-slate-600 mb-6">
                Check your inbox and spam folder. The link expires in 1 hour.
              </p>
              <button onClick={() => { setSent(false); setEmail(''); }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Didn't receive it? Try again
              </button>
            </div>
          )}
        </div>

        <Link to="/login"
          className="flex items-center justify-center gap-2 mt-5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft size={12} />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
