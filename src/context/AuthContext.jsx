import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  signInWithPopup, sendPasswordResetEmail,
  signOut, setPersistence, createUserWithEmailAndPassword,
  updateProfile,
  browserLocalPersistence, browserSessionPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const MAX_ATTEMPTS = 5;
const LOCK_MS      = 15 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [role,    setRole]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) return snap.data();
    } catch { /* offline */ }
    return null;
  }

  async function trackLogin(uid) {
    try {
      const ref  = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      await updateDoc(ref, {
        lastLogin:  serverTimestamp(),
        loginCount: (snap.data()?.loginCount || 0) + 1,
      });
    } catch { /* ignore */ }
  }

  async function ensureUserDoc(firebaseUser) {
    const ref  = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid:         firebaseUser.uid,
        email:       firebaseUser.email,
        fullName:    firebaseUser.displayName || '',
        role:        'analyst',
        companyName: '',
        department:  '',
        phoneNumber: '',
        createdAt:   serverTimestamp(),
        lastLogin:   serverTimestamp(),
        loginCount:  1,
      });
    }
  }

  // Register — creates auth account + Firestore profile, immediate access
  async function register(formData) {
    const { email, password, fullName, role, department, companyName, phoneNumber, employeeId } = formData;
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: fullName });
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid:         cred.user.uid,
      email:       cred.user.email,
      fullName,
      role:        role || 'analyst',
      department:  department  || '',
      companyName: companyName || '',
      phoneNumber: phoneNumber || '',
      employeeId:  employeeId  || '',
      createdAt:   serverTimestamp(),
      lastLogin:   serverTimestamp(),
      loginCount:  1,
    });
    return cred.user;
  }

  // Lock helpers
  function checkLock() {
    const until = localStorage.getItem('ss_locked_until');
    if (until && Date.now() < parseInt(until)) {
      const mins = Math.ceil((parseInt(until) - Date.now()) / 60000);
      throw new Error(`Account locked. Try again in ${mins} minute(s).`);
    }
  }
  function recordFail() {
    const key      = 'ss_failed';
    const attempts = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, attempts);
    if (attempts >= MAX_ATTEMPTS) {
      localStorage.setItem('ss_locked_until', Date.now() + LOCK_MS);
      localStorage.removeItem(key);
      throw new Error('Too many failed attempts. Account locked for 15 minutes.');
    }
    return MAX_ATTEMPTS - attempts;
  }
  function clearFail() {
    localStorage.removeItem('ss_failed');
    localStorage.removeItem('ss_locked_until');
  }

  async function login(email, password, remember = true) {
    checkLock();
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      clearFail();
      await trackLogin(cred.user.uid);
      return cred.user;
    } catch (err) {
      const remaining = recordFail();
      throw new Error(parseError(err.code, remaining));
    }
  }

  async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    await ensureUserDoc(cred.user);
    await trackLogin(cred.user.uid);
    clearFail();
    return cred.user;
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setProfile(null);
    toast.success('Signed out successfully');
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const prof = await fetchProfile(u.uid);
        setUser(u);
        setRole(prof?.role || 'analyst');
        setProfile(prof);
      } else {
        setUser(null);
        setRole(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, profile, loading, login, loginWithGoogle, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

function parseError(code, remaining) {
  const map = {
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         `Incorrect password. ${remaining} attempt(s) left.`,
    'auth/invalid-credential':     `Invalid credentials. ${remaining} attempt(s) left.`,
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/user-disabled':          'This account has been disabled.',
    'auth/email-already-in-use':   'An account with this email already exists.',
    'auth/too-many-requests':      'Too many requests. Please wait and try again.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[code] || 'Authentication failed. Please try again.';
}
