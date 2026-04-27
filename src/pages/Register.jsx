import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  User, Mail, Lock, Phone, Building2, Briefcase,
  Eye, EyeOff, ShieldCheck, RefreshCw, CheckCircle, IdCard,
} from 'lucide-react';

const ROLES = [
  { value: 'admin',     label: 'Admin',                  desc: 'Full platform access'         },
  { value: 'manager',   label: 'Logistics Manager',       desc: 'Operations & route management' },
  { value: 'ops',       label: 'Operations Manager',      desc: 'Warehouse & fleet oversight'   },
  { value: 'analyst',   label: 'Supply Chain Analyst',    desc: 'Risk & predictive dashboards'  },
  { value: 'warehouse', label: 'Warehouse Manager',       desc: 'Inventory & dispatch control'  },
];

const DEPARTMENTS = [
  'Supply Chain', 'Logistics', 'Operations', 'Procurement',
  'Warehouse', 'IT & Systems', 'Finance', 'Executive',
];

function strengthScore(pw) {
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#10b981'];

function Field({ label, type = 'text', value, onChange, placeholder, icon: Icon, right, required = true }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 font-medium mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative flex items-center">
        {Icon && <Icon size={14} className="absolute left-3.5 text-slate-500 pointer-events-none" />}
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          className="w-full py-2.5 text-sm text-white rounded-xl outline-none transition-all"
          style={{
            paddingLeft: Icon ? '2.5rem' : '0.875rem',
            paddingRight: right ? '2.5rem' : '0.875rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onFocus={e  => e.target.style.borderColor = 'rgba(6,182,212,0.6)'}
          onBlur={e   => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        {right && <div className="absolute right-3">{right}</div>}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, icon: Icon }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 font-medium mb-1.5">
        {label}<span className="text-red-400 ml-0.5">*</span>
      </label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />}
        <select value={value} onChange={onChange} required
          className="w-full py-2.5 pr-3 text-sm text-white rounded-xl outline-none appearance-none transition-all"
          style={{
            paddingLeft: Icon ? '2.5rem' : '0.875rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.6)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
          <option value="" style={{ background: '#111827' }}>Select...</option>
          {options.map(o => (
            <option key={o.value || o} value={o.value || o} style={{ background: '#111827' }}>
              {o.label || o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    phoneNumber: '', companyName: '', department: '', role: '',
    employeeId: '',
  });
  const [showPw,    setShowPw]    = useState(false);
  const [showCpw,   setShowCpw]   = useState(false);
  const [terms,     setTerms]     = useState(false);
  const [busy,      setBusy]      = useState(false);
  const [step,      setStep]      = useState(1); // 1 = personal, 2 = org, 3 = role

  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const pwStrength = strengthScore(form.password);

  function validateStep1() {
    if (!form.fullName.trim())  { toast.error('Full name is required.');       return false; }
    if (!form.email.trim())     { toast.error('Email is required.');           return false; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters.'); return false; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match.'); return false; }
    return true;
  }
  function validateStep2() {
    if (!form.companyName.trim()) { toast.error('Company name is required.'); return false; }
    if (!form.department)         { toast.error('Department is required.');   return false; }
    return true;
  }
  function validateStep3() {
    if (!form.role)  { toast.error('Please select a role.');          return false; }
    if (!terms)      { toast.error('Please accept the terms first.'); return false; }
    return true;
  }

  function nextStep() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep3()) return;
    setBusy(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to SupplyShield AI.');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const steps = ['Personal Info', 'Organization', 'Role & Access'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0B1120' }}>
      <div className="scanline" />

      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', boxShadow: '0 0 20px rgba(6,182,212,0.2)' }}>
            <ShieldCheck size={20} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">SupplyShield AI</div>
            <div className="text-[10px] text-cyan-400 tracking-widest uppercase">Create Account</div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                  style={{
                    background: step > i + 1 ? '#10b981' : step === i + 1 ? '#06b6d4' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${step > i + 1 ? '#10b981' : step === i + 1 ? '#06b6d4' : 'rgba(255,255,255,0.1)'}`,
                    color: step >= i + 1 ? '#000' : '#64748b',
                  }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block ${step === i + 1 ? 'text-cyan-400' : 'text-slate-600'}`}>{s}</span>
              </div>
              {i < 2 && <div className="w-8 h-px" style={{ background: step > i + 1 ? '#10b981' : 'rgba(255,255,255,0.08)' }} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}>

          <h2 className="text-lg font-bold text-white mb-1">{steps[step - 1]}</h2>
          <p className="text-xs text-slate-500 mb-5">Step {step} of 3 — {
            step === 1 ? 'Enter your personal details' :
            step === 2 ? 'Tell us about your organization' :
            'Select your role and accept terms'
          }</p>

          <form onSubmit={handleSubmit}>
            {/* ── STEP 1: Personal ── */}
            {step === 1 && (
              <div className="space-y-4">
                <Field label="Full Name"     value={form.fullName}     onChange={set('fullName')}     placeholder="John Smith"          icon={User}  />
                <Field label="Email Address" value={form.email}        onChange={set('email')}        placeholder="john@company.com"    icon={Mail} type="email" />
                <Field label="Phone Number"  value={form.phoneNumber}  onChange={set('phoneNumber')}  placeholder="+91 98765 43210"     icon={Phone} required={false} />

                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1.5">
                    Password<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={14} className="absolute left-3.5 text-slate-500 pointer-events-none" />
                    <input type={showPw ? 'text' : 'password'} value={form.password}
                      onChange={set('password')} placeholder="Min. 8 characters" required
                      className="w-full pl-10 pr-10 py-2.5 text-sm text-white rounded-xl outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.6)'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 text-slate-500 hover:text-slate-300">
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all"
                            style={{ background: i <= pwStrength ? strengthColor[pwStrength] : 'rgba(255,255,255,0.07)' }} />
                        ))}
                      </div>
                      <span className="text-[10px]" style={{ color: strengthColor[pwStrength] }}>
                        {strengthLabel[pwStrength]}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1.5">
                    Confirm Password<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={14} className="absolute left-3.5 text-slate-500 pointer-events-none" />
                    <input type={showCpw ? 'text' : 'password'} value={form.confirmPassword}
                      onChange={set('confirmPassword')} placeholder="Re-enter password" required
                      className="w-full pl-10 pr-10 py-2.5 text-sm text-white rounded-xl outline-none"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: `1px solid ${form.confirmPassword
                          ? form.password === form.confirmPassword ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'
                          : 'rgba(255,255,255,0.1)'}`,
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.6)'}
                      onBlur={e  => {
                        e.target.style.borderColor = form.confirmPassword
                          ? form.password === form.confirmPassword ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'
                          : 'rgba(255,255,255,0.1)';
                      }} />
                    <button type="button" onClick={() => setShowCpw(v => !v)}
                      className="absolute right-3 text-slate-500 hover:text-slate-300">
                      {showCpw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-[10px] text-red-400 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 2: Organization ── */}
            {step === 2 && (
              <div className="space-y-4">
                <Field label="Company Name" value={form.companyName} onChange={set('companyName')} placeholder="Acme Logistics Ltd." icon={Building2} />
                <SelectField label="Department" value={form.department} onChange={set('department')} options={DEPARTMENTS} icon={Briefcase} />
                <Field label="Employee ID" value={form.employeeId} onChange={set('employeeId')} placeholder="EMP-001 (optional)" icon={IdCard} required={false} />
              </div>
            )}

            {/* ── STEP 3: Role ── */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-2">
                    Select Role<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="space-y-2">
                    {ROLES.map(r => (
                      <button key={r.value} type="button"
                        onClick={() => setForm(f => ({ ...f, role: r.value }))}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                        style={{
                          background: form.role === r.value ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${form.role === r.value ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                          style={{ borderColor: form.role === r.value ? '#06b6d4' : 'rgba(255,255,255,0.2)' }}>
                          {form.role === r.value && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${form.role === r.value ? 'text-cyan-400' : 'text-white'}`}>{r.label}</div>
                          <div className="text-[10px] text-slate-500">{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <button type="button" onClick={() => setTerms(v => !v)}
                  className="flex items-start gap-3 w-full text-left">
                  <div className="w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: terms ? '#06b6d4' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${terms ? '#06b6d4' : 'rgba(255,255,255,0.15)'}`,
                    }}>
                    {terms && <CheckCircle size={10} className="text-black" />}
                  </div>
                  <span className="text-xs text-slate-400 leading-relaxed">
                    I agree to the <span className="text-cyan-400">Terms of Service</span> and{' '}
                    <span className="text-cyan-400">Privacy Policy</span> of SupplyShield AI
                  </span>
                </button>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-400 transition-all hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-black transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
                  Continue →
                </button>
              ) : (
                <button type="submit" disabled={busy}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-black transition-all hover:scale-[1.02] disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
                  {busy
                    ? <><RefreshCw size={14} className="animate-spin" />Creating Account...</>
                    : <><ShieldCheck size={14} />Create Account</>
                  }
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
