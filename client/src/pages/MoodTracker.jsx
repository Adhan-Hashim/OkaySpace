import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const MOODS = [
    { label: 'PROSPEROUS', emoji: '🤩', color: 'var(--success)', value: 'Awesome' },
    { label: 'STABLE', emoji: '😊', color: '#3b82f6', value: 'Happy' },
    { label: 'NEUTRAL', emoji: '😐', color: 'var(--text-muted)', value: 'Neutral' },
    { label: 'VOLATILE', emoji: '😰', color: 'var(--secondary)', value: 'Anxious' },
    { label: 'DEFICIT', emoji: '😔', color: 'var(--danger)', value: 'Sad' },
];

const MoodTracker = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchHistory();
    }, [user, navigate]);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/mood');
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMoodSelect = async (mood) => {
        setLoading(true);
        try {
            await api.post('/mood', { mood });
            fetchHistory();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '4vw', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ padding: '3rem', border: '4px solid var(--text-main)', background: 'white', marginBottom: '4rem', boxShadow: '12px 12px 0px var(--accent)' }}>
                <h2 className="heading-lg" style={{ fontSize: '3rem', marginBottom: '1rem' }}>EMOTIONAL DEPOSIT</h2>
                <p style={{ fontFamily: 'var(--font-accent)', textTransform: 'uppercase', marginBottom: '2.5rem', fontSize: '1.25rem' }}>LOG YOUR CURRENT MENTAL STATE.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    {MOODS.map(m => (
                        <button
                            key={m.value}
                            onClick={() => handleMoodSelect(m.value)}
                            disabled={loading}
                            className="btn-brutalist"
                            style={{
                                flexDirection: 'column',
                                padding: '2rem 1rem',
                                background: 'transparent',
                                color: 'var(--text-main)',
                                border: `2px solid var(--text-main)`,
                                boxShadow: 'none'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = m.color; e.currentTarget.style.color = 'white'; e.currentTarget.style.boxShadow = `4px 4px 0px var(--text-main)`; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{m.emoji}</div>
                            <div style={{ fontSize: '1rem', letterSpacing: '1px' }}>{m.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: '3rem', border: '4px solid var(--text-main)', background: 'var(--text-main)', color: 'var(--bg-color)' }}>
                <h3 className="heading-lg" style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--secondary-bg)', paddingBottom: '1rem' }}>TRANSACTION LOG</h3>

                {history.length === 0 ? (
                    <p style={{ fontFamily: 'var(--font-accent)', fontSize: '1.25rem' }}>NO DEPOSITS RECORED.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {history.map(entry => {
                            const moodObj = MOODS.find(m => m.value === entry.mood) || MOODS[2];
                            return (
                                <div key={entry._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--bg-color)', color: 'var(--text-main)', border: '2px solid var(--secondary-bg)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{ fontSize: '2rem' }}>{moodObj.emoji}</span>
                                        <span style={{ fontFamily: 'var(--font-accent)', fontSize: '1.25rem', fontWeight: 'bold' }}>{moodObj.label}</span>
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-accent)' }}>
                                        {new Date(entry.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodTracker;
