import React, { useState } from 'react';
import api from '../api';
import { Phone, AlertTriangle, ShieldAlert, HeartPulse } from 'lucide-react';

const LINES = [
    { name: 'VANDREVALA_SUPPORT', desc: 'CRITICAL_EMOTIONAL_COUNSELING // 24_7', phone: '+91-9999-666-555', tel: '+919999666555', icon: <HeartPulse size={18} />, color: 'var(--accent-magenta)' },
    { name: 'KIRAN_NEURAL_HELPLINE', desc: 'PSYCHOLOGICAL_CRISIS_MANAGEMENT // TOLL_FREE', phone: '1800-599-0019', tel: '18005990019', icon: <ShieldAlert size={18} />, color: 'var(--accent-magenta)' },
    { name: 'ENTITY_CHILDLINE', desc: 'MINORS_EMERGENCY_SERVICES // DIRECT_RESPONSE', phone: '1098', tel: '1098', icon: <Phone size={18} />, color: 'var(--accent-magenta)' },
];

const Emergency = () => {
    const [triageSituation, setTriageSituation] = useState('');
    const [triageAdvice, setTriageAdvice] = useState('');
    const [triaging, setTriaging] = useState(false);

    const runTriage = async (e) => {
        e.preventDefault();
        if (!triageSituation.trim()) return;
        setTriaging(true);
        try {
            const res = await api.post('/ai/triage', { situation: triageSituation });
            setTriageAdvice(res.data.advice);
        } catch (err) { console.error('Triage failed', err); }
        finally { setTriaging(false); }
    };
    return (
        <div style={{ background: 'var(--bg-deep)', minHeight: '100vh', padding: '10rem 10% 4rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{
                    padding: '3rem',
                    marginBottom: '4rem',
                    border: '1px solid var(--accent-magenta)',
                    background: 'rgba(255, 0, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'var(--accent-magenta)', opacity: 0.3 }} />
                    <AlertTriangle size={32} color="var(--accent-magenta)" style={{ flexShrink: 0 }} />
                    <div>
                        <p className="text-technical" style={{ fontWeight: 700, color: 'var(--accent-magenta)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>IMMEDIATE_THREAT_DETECTED?</p>
                        <p style={{ color: 'var(--accent-magenta)', fontSize: '0.85rem', lineHeight: 1.8, opacity: 0.8, fontFamily: 'var(--font-mono)' }}>
                            If you are in a neural or physical crisis, stabilize via local emergency protocols immediately. Dial 112 [INDIA_REGION]. Support is persistent.
                        </p>
                    </div>
                </div>

                <div style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-line)' }}>
                    <p className="text-technical" style={{ marginBottom: '1rem' }}>EMERGENCY_PROTOCOLS // ACCESSIBLE</p>
                    <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}>URGENT_RESPONSE</h1>
                </div>

                {/* AI Triage Module */}
                <div style={{ marginBottom: '6rem', padding: '3rem', border: '2px solid var(--accent-magenta)', background: 'rgba(255, 0, 255, 0.05)' }}>
                    <p className="text-technical" style={{ color: 'var(--accent-magenta)', marginBottom: '1.5rem' }}>URGENT_TRIAGE_CORE // AI_STABILIZATION</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>Describe your current state for immediate grounding instructions.</p>

                    <form onSubmit={runTriage} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <textarea
                            value={triageSituation}
                            onChange={e => setTriageSituation(e.target.value)}
                            placeholder="INPUT_SITUATION_FOR_STABILIZATION..."
                            style={{
                                width: '100%',
                                height: '100px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid var(--accent-magenta)',
                                padding: '1.5rem',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.9rem',
                                outline: 'none',
                                resize: 'none'
                            }}
                        />
                        <button type="submit" className="btn-mindjoin" disabled={triaging || !triageSituation.trim()} style={{ background: 'var(--accent-magenta)', border: 'none', color: '#fff' }}>
                            {triaging ? 'CALCULATING_STABILIZATION...' : '[ INITIALIZE_TRIAGE ]'}
                        </button>
                    </form>

                    {triageAdvice && (
                        <div style={{ marginTop: '2.5rem', padding: '2rem', background: '#000', border: '1px solid var(--accent-magenta)' }}>
                            <p className="text-technical" style={{ color: 'var(--accent-magenta)', marginBottom: '1rem', fontSize: '0.6rem' }}>STABILIZATION_PROTOCOL_OUTPUT:</p>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', lineHeight: 1.8, color: '#fff' }}>
                                {triageAdvice}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2px', background: 'var(--border-line)', border: '1px solid var(--border-line)' }}>
                    {LINES.map((line, idx) => (
                        <div key={idx} style={{ padding: '3rem', background: 'var(--bg-deep)', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ width: '40px', height: '40px', border: '1px solid var(--border-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: line.color }}>
                                    {line.icon}
                                </div>
                                <h3 className="text-technical" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{line.name}</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.8, marginBottom: '2.5rem', fontFamily: 'var(--font-mono)', height: '3rem' }}>{line.desc}</p>
                            <a href={`tel:${line.tel}`} className="btn-mindjoin" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                                background: 'transparent',
                                border: '1px solid var(--border-line)',
                                color: line.color,
                                width: '100%'
                            }}>
                                <Phone size={14} /> [ CONNECT: {line.phone} ]
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Emergency;
