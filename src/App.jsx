import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

import Login             from './pages/Login';
import Register          from './pages/Register';
import ForgotPassword    from './pages/ForgotPassword';
import Dashboard         from './pages/Dashboard';
import PredictiveRisk    from './pages/PredictiveRisk';
import RouteOptimization from './pages/RouteOptimization';
import DigitalTwin       from './pages/DigitalTwin';
import HeatmapPage       from './pages/HeatmapPage';
import AdminUsers        from './pages/AdminUsers';

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}

const toastStyle = {
  duration: 4000,
  style: {
    background: '#111827',
    color: '#f1f5f9',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '13px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  success: { iconTheme: { primary: '#10b981', secondary: '#000' } },
  error:   { iconTheme: { primary: '#ef4444', secondary: '#000' } },
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="scanline" />
        <Toaster position="top-right" toastOptions={toastStyle} />

        <Routes>
          {/* Public */}
          <Route path="/login"           element={<Login />}          />
          <Route path="/register"        element={<Register />}       />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected — all logged-in users */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/risk" element={
            <ProtectedRoute>
              <AppLayout><PredictiveRisk /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/reroute" element={
            <ProtectedRoute>
              <AppLayout><RouteOptimization /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/twin" element={
            <ProtectedRoute>
              <AppLayout><DigitalTwin /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/heatmap" element={
            <ProtectedRoute>
              <AppLayout><HeatmapPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppLayout><AdminUsers /></AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
