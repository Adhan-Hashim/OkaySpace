import React, { useState } from 'react';
import api from '../api';

const Letters = () => {
    const [sendContent, setSendContent] = useState('');
    const [sending, setSending] = useState(false);
    const [readLetter, setReadLetter] = useState(null);
    const [reading, setReading] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!sendContent.trim()) return;
        setSending(true); setSendSuccess(false);
        try {
            await api.post('/letters', { content: sendContent });
            setSendSuccess(true); setSendContent('');
            setTimeout(() => setSendSuccess(false), 3000);
        } catch { alert('Failed to send letter.'); }
        finally { setSending(false); }
    };

    const fetchRandomLetter = async () => {
        setReading(true);
        try {
            const res = await api.get('/letters/random');
            setReadLetter(res.data);
        } catch (err) {
            if (err.response?.status === 404) alert('No letters yet. Be the first to write one!');
            else alert('Failed to fetch letter.');
        } finally { setReading(false); }
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1.5rem 4rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Kindness Letters</h1>
                    <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                        Send an anonymous message of support to a stranger, or read one left for you.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
                    {/* Write */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>✉️ Write to a stranger</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>Sent anonymously to someone who might need it.</p>
                        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <textarea rows={7} value={sendContent} onChange={e => setSendContent(e.target.value)}
                                placeholder="Dear stranger, I want you to know..." required
                                className="input-field" style={{ resize: 'vertical', lineHeight: 1.7 }} />
                            <button type="submit" className="btn-primary" disabled={sending || !sendContent.trim()}
                                style={{ opacity: !sendContent.trim() ? 0.5 : 1 }}>
                                {sending ? 'Sending...' : 'Send Letter'}
                            </button>
                            {sendSuccess && <p style={{ textAlign: 'center', color: '#10b981', fontSize: '0.875rem', fontWeight: 500 }}>
                                ✓ Sent! You made someone's day brighter 💚
                            </p>}
                        </form>
                    </div>

                    {/* Read */}
                    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>💌 Read a letter</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>An anonymous message from the community.</p>

                        {!readLetter ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', minHeight: '180px' }}>
                                <div style={{ fontSize: '3rem' }}>💌</div>
                                <button onClick={fetchRandomLetter} className="btn-primary" disabled={reading}>
                                    {reading ? 'Opening...' : 'Open a Letter'}
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontStyle: 'italic' }}>From a stranger:</p>
                                <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-sub)', whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>
                                    "{readLetter.content}"
                                </p>
                                <button onClick={() => setReadLetter(null)} className="btn-secondary" style={{ fontSize: '0.875rem' }}>
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Letters;
