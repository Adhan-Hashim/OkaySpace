import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const MOODS = [
    { label: 'OPTIMAL', emoji: '🤩', value: 'Awesome', color: 'var(--accent-teal)' },
    { label: 'STABLE', emoji: '😊', value: 'Happy', color: 'var(--accent-teal)' },
    { label: 'NEUTRAL', emoji: '😐', value: 'Neutral', color: 'var(--text-muted)' },
    { label: 'FLUCTUATING', emoji: '😰', value: 'Anxious', color: 'var(--accent-magenta)' },
    { label: 'CRITICAL', emoji: '😔', value: 'Sad', color: 'var(--accent-magenta)' },
];

const MoodTracker = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => { if (!user) { navigate('/login'); return; } fetchHistory(); }, [user, navigate]);

    const fetchHistory = async () => {
        try { const res = await api.get('/mood'); setHistory(res.data); }
        catch (err) { console.error(err); }
    };

    const handleMoodSelect = async (mood) => {
        setLoading(true);
        try {
            await api.post('/mood', { mood });
            setSubmitted(true); fetchHistory();
            setTimeout(() => setSubmitted(false), 3000);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const runAIAnalysis = async () => {
        if (!history.length) return;
        setAnalyzing(true);
        try {
            const moodData = history.slice(0, 10).map(h => ({
                date: new Date(h.date || h.createdAt).toLocaleDateString(),
                mood: h.mood
            }));
            const res = await api.post('/ai/analyze-mood', { moodHistory: moodData });
            setAnalysis(res.data.analysis);
        } catch (err) { console.error('Analysis failed', err); }
        finally { setAnalyzing(false); }
    };

    return (
        <div style={{ background: 'var(--bg-deep)', minHeight: '100vh', padding: '10rem 10% 4rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-line)' }}>
                    <p className="text-technical" style={{ marginBottom: '1rem' }}>BIOMETRIC_DATA // LOG</p>
                    <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}>METRIC_TRACKER</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                    {/* Mood Selector */}
                    <div style={{ border: '1px solid var(--border-line)', padding: '3rem' }}>
                        <p className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '2rem' }}>INITIALIZE_INPUT_PROTOCOL</p>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '2.5rem' }}>CURRENT_STATE_DETECTION</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {MOODS.map(m => (
                                <button key={m.value} onClick={() => handleMoodSelect(m.value)} disabled={loading} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1.25rem 2rem',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid var(--border-line)',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    color: 'var(--text-secondary)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.8rem',
                                    opacity: loading ? 0.6 : 1,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = m.color;
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--border-line)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '1.2rem' }}>{m.emoji}</span>
                                        <span>{m.label}</span>
                                    </div>
                                    <span style={{ fontSize: '0.6rem', opacity: 0.4 }}>[ SELECT ]</span>
                                </button>
                            ))}
                        </div>
                        {submitted && (
                            <p className="text-technical" style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--accent-teal)' }}>
                                ✓ ENTRY_LOGGED_SUCCESSFULLY
                            </p>
                        ) || <div style={{ height: '2rem', marginTop: '2rem' }}></div>}
                    </div>

                    {/* History */}
                    <div style={{ border: '1px solid var(--border-line)', padding: '3rem' }}>
                        <p className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '2rem' }}>DATA_RETRIEVAL // HISTORY</p>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '2.5rem' }}>HISTORICAL_TRAJECTORY</h2>
                        {history.length === 0 ? (
                            <p className="text-technical" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', border: '1px dashed var(--border-line)', padding: '4rem 0' }}>
                                NO_DATA_FIELD_NULL
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {history.slice(0, 10).map(entry => {
                                    const moodObj = MOODS.find(m => m.value === entry.mood) || MOODS[2];
                                    return (
                                        <div key={entry._id} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '1rem 1.5rem',
                                            background: 'rgba(255, 255, 255, 0.01)',
                                            border: '1px solid var(--border-line)',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span style={{ fontSize: '1rem' }}>{moodObj.emoji}</span>
                                                <span className="text-technical" style={{ fontSize: '0.75rem', color: moodObj.color }}>{moodObj.label}</span>
                                            </div>
                                            <span className="text-technical" style={{ fontSize: '0.6rem', opacity: 0.4 }}>
                                                {new Date(entry.date || entry.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {history.length > 0 && (
                            <button onClick={runAIAnalysis} disabled={analyzing} className="btn-mindjoin" style={{ width: '100%', marginTop: '2rem', fontSize: '0.7rem' }}>
                                {analyzing ? 'ANALYZING...' : '[ SIMULATE_ANALYSIS ]'}
                            </button>
                        )}
                    </div>
                </div>

                {/* AI Analysis Result */}
                {analysis && (
                    <div style={{ marginTop: '4rem', padding: '3rem', border: '1px solid var(--accent-teal)', background: 'rgba(0, 255, 255, 0.03)' }}>
                        <p className="text-technical" style={{ color: 'var(--accent-teal)', marginBottom: '1.5rem' }}>ANALYSIS_REPORT // INSIGHT_GENERATED</p>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                            {analysis}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodTracker;
