import { useState, useRef } from 'react'
import { Loader, Zap, ImagePlus, X, Brain, AlertTriangle, Stethoscope, Send } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { triageSymptoms, triageWithImage, chatWithAI } from '../utils/gemini'

export default function TriagePage() {
  const [symptoms, setSymptoms] = useState('')
  const [age, setAge] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('triage')
  const fileRef = useRef(null)
  const chatEndRef = useRef(null)

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      setImage({ base64, mimeType: file.type })
    }
    reader.readAsDataURL(file)
  }

  const analyze = async () => {
    if (!symptoms) return
    setLoading(true); setResult(null)
    try {
      const r = image
        ? await triageWithImage(symptoms, parseInt(age) || 30, image.base64, image.mimeType)
        : await triageSymptoms(symptoms, parseInt(age) || 30)
      setResult(r)
    } catch {
      setResult({ severity: 'HIGH', summary: 'AI unavailable. Manual review required.', golden_hour_risk: true, possible_conditions: [], recommended_action: 'Seek immediate medical help.' })
    }
    finally { setLoading(false) }
  }

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const msg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', text: msg }])
    setChatLoading(true)
    try {
      const response = await chatWithAI(msg, chatMessages)
      setChatMessages(prev => [...prev, { role: 'ai', text: response }])
    } catch {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. If this is urgent, call 108.' }])
    }
    setChatLoading(false)
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const severityColors = { CRITICAL: 'var(--rose)', HIGH: 'var(--amber)', MODERATE: 'var(--sky)', LOW: 'var(--emerald)' }
  const severityBars = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 }

  return (
    <AppLayout title="AI Health Assistant — Gemini Powered">
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Tab Switcher */}
        <div className="fade-up" style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 10, padding: 4, border: '1px solid var(--border)' }}>
          {[{ key: 'triage', label: '🔬 AI Triage', icon: Stethoscope }, { key: 'chat', label: '💬 Health Chat', icon: Brain }].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{
                flex: 1, padding: '0.6rem', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontFamily: 'var(--font)', fontSize: '0.83rem', fontWeight: 600, transition: 'all 0.2s',
                background: activeTab === key ? 'var(--bg-card)' : 'transparent',
                color: activeTab === key ? 'var(--text)' : 'var(--text-muted)',
                boxShadow: activeTab === key ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
              }}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'triage' && (
          <>
            <div className="card fade-up-2">
              <div className="card-header">
                <span className="card-title"><Brain size={12} style={{ display: 'inline', marginRight: 6 }} />AI Triage — Gemini Powered</span>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="status-dot dot-green" /> Live
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label>Describe Symptoms</label>
                  <textarea rows={4} placeholder="e.g. Severe headache for 3 days with blurred vision and nausea. History of hypertension..." value={symptoms} onChange={e => setSymptoms(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: '0 0 120px' }}>
                    <label>Patient Age</label>
                    <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Attach Image (Optional)</label>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                    {imagePreview ? (
                      <div className="image-dropzone has-image" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={imagePreview} alt="Upload" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                        <div style={{ flex: 1, fontSize: '0.8rem', color: 'var(--emerald)' }}>Image attached ✓</div>
                        <button onClick={() => { setImage(null); setImagePreview(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={16} /></button>
                      </div>
                    ) : (
                      <div className="image-dropzone" onClick={() => fileRef.current?.click()}>
                        <ImagePlus size={20} color="var(--text-muted)" style={{ marginBottom: 4 }} />
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Upload wound/condition photo for AI analysis</div>
                      </div>
                    )}
                  </div>
                </div>
                <button className="btn btn-green" onClick={analyze} disabled={loading || !symptoms} style={{ alignSelf: 'flex-start', padding: '0.65rem 1.8rem' }}>
                  {loading ? <><Loader size={14} className="spin" /> Analyzing...</> : <><Zap size={14} /> Analyze with Gemini AI</>}
                </button>
              </div>
            </div>

            {result && (
              <div className="card fade-up" style={{ borderColor: `${severityColors[result.severity]}25` }}>
                <div className="card-header">
                  <span className="card-title">AI Assessment Result</span>
                  <span className={`badge badge-${result.severity?.toLowerCase()}`}>{result.severity}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Severity meter */}
                  <div style={{ display: 'flex', gap: 3, height: 6 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, borderRadius: 3,
                        background: i <= (severityBars[result.severity] || 1) ? severityColors[result.severity] : 'var(--bg-elevated)',
                        transition: 'background 0.3s',
                        opacity: i <= (severityBars[result.severity] || 1) ? 1 : 0.3,
                      }} />
                    ))}
                  </div>

                  <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Clinical Summary</div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.7 }}>{result.summary}</p>
                  </div>

                  {result.recommended_action && (
                    <div style={{ padding: '0.875rem', background: 'var(--emerald-dim)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(52,211,153,0.15)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--emerald)', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recommended Action</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{result.recommended_action}</div>
                    </div>
                  )}

                  {result.first_aid && (
                    <div style={{ padding: '0.875rem', background: 'var(--sky-dim)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(56,189,248,0.15)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--sky)', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase' }}>First Aid</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{result.first_aid}</div>
                    </div>
                  )}

                  {result.possible_conditions?.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Possible Conditions</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {result.possible_conditions.map(c => <span key={c} className="badge badge-moderate">{c}</span>)}
                      </div>
                    </div>
                  )}

                  {result.specialist_needed && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-dim)' }}>Specialist:</strong> {result.specialist_needed}
                    </div>
                  )}

                  {result.golden_hour_risk && (
                    <div style={{ padding: '0.75rem', background: 'var(--rose-dim)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={15} /> GOLDEN HOUR RISK — Immediate dispatch recommended
                    </div>
                  )}

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', padding: '0.5rem 0', borderTop: '1px solid var(--border)' }}>
                    ⚕️ AI-generated assessment · Not a substitute for professional medical advice
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'chat' && (
          <div className="card fade-up-2" style={{ display: 'flex', flexDirection: 'column', height: 520 }}>
            <div className="card-header">
              <span className="card-title"><Brain size={12} style={{ display: 'inline', marginRight: 6 }} />Niramaya AI Health Assistant</span>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>Gemini Powered</span>
            </div>

            <div className="chat-container" style={{ flex: 1 }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <Brain size={36} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                  <div style={{ fontSize: '0.88rem', marginBottom: '0.5rem' }}>Ask me anything about your health</div>
                  <div style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>I can help with symptom analysis, wellness tips, medication questions, and when to seek emergency care.</div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.role}`}>
                  {msg.role === 'ai' && <div style={{ fontSize: '0.68rem', color: 'var(--emerald)', fontWeight: 600, marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>NIRAMAYA AI</div>}
                  {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
              <input placeholder="Describe your concern..." value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                style={{ flex: 1, fontSize: '0.85rem' }}
              />
              <button className="btn btn-green" onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ padding: '0.6rem 1rem' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
