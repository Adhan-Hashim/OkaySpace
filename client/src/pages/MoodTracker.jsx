import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const MOODS = [
    { label: 'Amazing', emoji: '🤩', value: 'Awesome', color: '#10b981', bg: '#ecfdf5' },
    { label: 'Happy', emoji: '😊', value: 'Happy', color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Neutral', emoji: '😐', value: 'Neutral', color: '#6b7280', bg: '#f9fafb' },
    { label: 'Anxious', emoji: '😰', value: 'Anxious', color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Sad', emoji: '😔', value: 'Sad', color: '#ef4444', bg: '#fef2f2' },
];

const MoodTracker = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1.5rem 4rem' }}>
            <div className="container" style={{ maxWidth: '700px' }}>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Mood Tracker</h1>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem', marginBottom: '2rem' }}>Log how you're feeling today</p>

                {/* Mood Selector */}
                <div className="card" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>How are you feeling right now?</h2>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {MOODS.map(m => (
                            <button key={m.value} onClick={() => handleMoodSelect(m.value)} disabled={loading} style={{
                                flex: '1 1 120px', padding: '1.1rem 0.75rem',
                                background: m.bg, border: `1.5px solid ${m.color}40`,
                                borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                                transition: 'all 0.18s ease', fontFamily: 'var(--font-body)', opacity: loading ? 0.6 : 1,
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 14px ${m.color}25`; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = `${m.color}40`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <span style={{ fontSize: '2rem' }}>{m.emoji}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: m.color }}>{m.label}</span>
                            </button>
                        ))}
                    </div>
                    {submitted && (
                        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 500 }}>
                            ✓ Mood logged!
                        </p>
                    )}
                </div>

                {/* History */}
                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Recent History</h2>
                    {history.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>No entries yet. Log your first mood above!</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {history.slice(0, 10).map(entry => {
                                const moodObj = MOODS.find(m => m.value === entry.mood) || MOODS[2];
                                return (
                                    <div key={entry._id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '0.7rem 1rem', background: moodObj.bg,
                                        border: `1px solid ${moodObj.color}30`, borderRadius: '10px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <span style={{ fontSize: '1.3rem' }}>{moodObj.emoji}</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: moodObj.color }}>{moodObj.label}</span>
                                        </div>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                            {new Date(entry.date || entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;
