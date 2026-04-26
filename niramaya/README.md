# 🚨 Niramaya — AI-Powered Emergency Response System

> "Every second is someone's life."

Built for Google Hackathon | React + Vite | Google Maps API

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Add your Google Maps API key and Gemini API key to .env

# 3. Start dev server
npm run dev
```

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx       # Hero landing page
│   ├── SOSPage.jsx           # One-tap SOS with AI triage flow
│   ├── PatientDashboard.jsx  # Patient's live tracking view
│   ├── HospitalDashboard.jsx # Hospital incoming case + bed management
│   └── AmbulanceDashboard.jsx # Driver view with route + handoff
├── components/
│   └── Navbar.jsx            # Fixed top navigation
└── index.css                 # Design system (CSS variables, animations)
```

---

## 🔑 API Keys Needed

| Key | Where to get |
|-----|-------------|
| `VITE_GOOGLE_MAPS_API_KEY` | [Google Cloud Console](https://console.cloud.google.com) → Maps JavaScript API |
| `VITE_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) |

---

## 🎯 Demo Flow (for judges)

1. **Landing Page** → explain the problem
2. **SOS Page** → type a symptom, hit SOS, watch the 3-stage dispatch flow
3. **Hospital Dashboard** → show incoming cases, accept a patient
4. **Ambulance Dashboard** → show the driver view, mark arrival, complete handoff

Total demo time: ~2 minutes

---

## 🔧 Next Steps to Add

- [ ] Real Google Maps embed in `AmbulanceDashboard.jsx`
- [ ] Gemini API call in `SOSPage.jsx` (replace mock triage)
- [ ] WebSocket for live ambulance location updates
- [ ] Firebase Auth for role-based login (patient / hospital / driver)
- [ ] Supabase/Firestore for real bed availability sync
