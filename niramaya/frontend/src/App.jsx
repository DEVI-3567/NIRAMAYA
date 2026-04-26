import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Landing from './pages/Landing'
import AuthPage from './pages/auth/AuthPage'
import PatientDashboard from './pages/patient/PatientDashboard'
import HospitalDashboard from './pages/hospital/HospitalDashboard'
import GovernmentDashboard from './pages/government/GovernmentDashboard'
import SOSPage from './pages/SOSPage'
import TrackingPage from './pages/TrackingPage'
import TriagePage from './pages/TriagePage'

import './index.css'

// Guard: redirect to login if not authenticated for that role
function RoleRoute({ children, role }) {
  const { user, isLoggedIn } = useAuth()
  if (!isLoggedIn || user?.role !== role) return <Navigate to={`/login/${role}`} replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login/:role" element={<AuthPage />} />

      {/* Public access to emergency features */}
      <Route path="/sos" element={<SOSPage />} />
      <Route path="/triage" element={<TriagePage />} />
      <Route path="/track/:sosId" element={<TrackingPage />} />

      {/* Patient */}
      <Route path="/patient/dashboard" element={<RoleRoute role="patient"><PatientDashboard /></RoleRoute>} />

      {/* Hospital */}
      <Route path="/hospital/dashboard" element={<RoleRoute role="hospital"><HospitalDashboard /></RoleRoute>} />
      <Route path="/hospital/triage" element={<RoleRoute role="hospital"><TriagePage /></RoleRoute>} />

      {/* Government */}
      <Route path="/government/dashboard" element={<RoleRoute role="government"><GovernmentDashboard /></RoleRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
