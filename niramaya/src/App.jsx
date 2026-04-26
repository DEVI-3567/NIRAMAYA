import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PatientDashboard from './pages/PatientDashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import AmbulanceDashboard from './pages/AmbulanceDashboard'
import SOSPage from './pages/SOSPage'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sos" element={<SOSPage />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/hospital" element={<HospitalDashboard />} />
        <Route path="/ambulance" element={<AmbulanceDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
