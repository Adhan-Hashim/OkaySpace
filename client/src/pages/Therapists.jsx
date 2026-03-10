import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, X, Cpu } from 'lucide-react';

const Therapists = () => {
    const [therapists, setTherapists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [matching, setMatching] = useState(false);
    const [matchResult, setMatchResult] = useState('');
    const [matchNeeds, setMatchNeeds] = useState('');

    useEffect(() => {
        (async () => {
            try { const res = await api.get('/therapists'); setTherapists(res.data); }
            catch { console.error('Failed to load therapists'); }
            finally { setLoading(false); }
        })();
    }, []);

    const runAIMatching = async (e) => {
        e.preventDefault();
        if (!matchNeeds.trim() || !therapists.length) return;
        setMatching(true);
        try {
            const res = await api.post('/ai/match-therapist', {
                needs: matchNeeds,
                therapists: therapists
            });
            setMatchResult(res.data.recommendation);
        } catch { console.error('Matching failed'); }
        finally { setMatching(false); }
    };

    const handleBook = async (e, therapistId) => {
        e.preventDefault();
        if (!selectedTime) return;
        try {
            await api.post('/therapists/book', { therapistId, timeSlot: selectedTime });
            setSuccessMsg('BOOKING_CONFIRMED // SPECIALIST_ASSIGNED');
            setBooking(null); setSelectedTime('');
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch { console.error('Failed to book'); }
    };

    return (
        <div style={{ background: 'var(--bg-deep)', minHeight: '100vh', padding: '10rem 10% 4rem' }}>
            <div className="container">
                <div style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-line)' }}>
                    <p className="text-technical" style={{ marginBottom: '1rem' }}>專業能力 // SPECIALISTS</p>
                    <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}>NEURAL_CONSULTANTS</h1>
                </div>

                {/* AI Matching Hub */}
                <div style={{ marginBottom: '6rem', padding: '3rem', border: '1px solid var(--border-line)', background: 'rgba(255,255,255,0.01)' }}>
                    <p className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '1.5rem', color: 'var(--accent-teal)' }}>NEURAL_MATCHING_PROTOCOL // V1.0</p>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>IDENTIFY_OPTIMAL_SPECIALIST</h2>

                    <form onSubmit={runAIMatching} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <input
                            type="text"
                            value={matchNeeds}
                            onChange={e => setMatchNeeds(e.target.value)}
                            placeholder="DESCRIBE_SITUATION_FOR_MATCHING..."
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid var(--border-line)',
                                padding: '1.25rem 2rem',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        />
                        <button type="submit" className="btn-mindjoin" disabled={matching || !matchNeeds.trim()}>
                            {matching ? 'LOGGING_NEURAL_DATA...' : '[ INITIALIZE_MATCH ]'}
                        </button>
                    </form>

                    {matchResult && (
                        <div style={{ padding: '2rem', background: 'rgba(0, 255, 255, 0.05)', borderLeft: '2px solid var(--accent-teal)' }}>
                            <p className="text-technical" style={{ fontSize: '0.55rem', color: 'var(--accent-teal)', marginBottom: '1rem' }}>RECOMMENDATION_ENGINE_OUTPUT:</p>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                {matchResult}
                            </p>
                        </div>
                    )}
                </div>

                {successMsg && (
                    <div style={{ padding: '1.5rem', marginBottom: '3rem', border: '1px solid var(--accent-teal)', background: 'rgba(0, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Cpu size={18} color="var(--accent-teal)" />
                        <span className="text-technical" style={{ color: 'var(--accent-teal)', fontSize: '0.8rem' }}>{successMsg}</span>
                    </div>
                )}

                {loading ? (
                    <div style={{ padding: '8rem 0', textAlign: 'center' }}>
                        <div className="text-technical" style={{ fontSize: '0.75rem', opacity: 0.5, animation: 'pulse 1.5s infinite' }}>LOCATING_SPECIALISTS...</div>
                    </div>
                ) : therapists.length === 0 ? (
                    <div style={{ border: '1px solid var(--border-line)', padding: '6rem', textAlign: 'center' }}>
                        <p className="text-technical" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>NO_SPECIALISTS_AVAILABLE_IN_THIS_SECTOR</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2px', background: 'var(--border-line)', border: '1px solid var(--border-line)' }}>
                        {therapists.map(t => (
                            <div key={t._id} style={{ padding: '3rem', background: 'var(--bg-deep)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ width: '56px', height: '56px', border: '1px solid var(--border-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--accent-teal)', background: 'rgba(255,255,255,0.02)' }}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-technical" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t.name}</h3>
                                        <span className="text-technical" style={{ fontSize: '0.55rem', opacity: 0.5 }}>IDENT // {t.specialization.toUpperCase()}</span>
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.8, marginBottom: '2.5rem', fontFamily: 'var(--font-mono)', height: '4rem', overflow: 'hidden' }}>{t.bio}</p>

                                {booking === t._id ? (
                                    <form onSubmit={e => handleBook(e, t._id)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', border: '1px solid var(--accent-teal)', background: 'rgba(0, 255, 255, 0.02)' }}>
                                        <label className="text-technical" style={{ fontSize: '0.55rem', opacity: 0.6 }}>SELECT_SLOT</label>
                                        <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} required
                                            style={{
                                                background: 'none',
                                                border: '1px solid var(--border-line)',
                                                padding: '0.75rem',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '0.8rem',
                                                outline: 'none',
                                                width: '100%'
                                            }}>
                                            <option value="" style={{ background: '#000' }}>[ SELECT_TIME ]</option>
                                            {t.availability?.map(slot => <option key={slot} value={slot} style={{ background: '#000' }}>{slot}</option>)}
                                        </select>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button type="submit" className="btn-mindjoin" style={{ flex: 1, background: 'var(--accent-teal)', color: '#000', padding: '0.75rem' }}>[ CONFIRM ]</button>
                                            <button type="button" className="btn-mindjoin" style={{ padding: '0.75rem', border: '1px solid var(--border-line)', background: 'transparent' }} onClick={() => { setBooking(null); setSelectedTime(''); }}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button onClick={() => setBooking(t._id)} className="btn-mindjoin" style={{ width: '100%' }}>
                                        <Calendar size={14} style={{ marginRight: '0.75rem' }} /> [ SYNC_SESSION ]
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Therapists;
