import React, { useState, useEffect } from 'react';
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
        setSending(true);
        setSendSuccess(false);
        try {
            await api.post('/letters', { content: sendContent });
            setSendSuccess(true);
            setSendContent('');
            setTimeout(() => setSendSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Failed to send letter.");
        } finally {
            setSending(false);
        }
    };

    const fetchRandomLetter = async () => {
        setReading(true);
        try {
            const res = await api.get('/letters/random');
            setReadLetter(res.data);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                alert("No letters available right now. Be the first to write one!");
            } else {
                alert("Failed to fetch letter.");
            }
        } finally {
            setReading(false);
        }
    };

    return (
        <div style={{ padding: '8vw 4vw', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-color)', transition: 'background-color 0.3s' }}>
            <div style={{ maxWidth: '800px', width: '100%', marginBottom: '4rem', textAlign: 'center' }}>
                <h1 className="heading-lg" style={{ color: 'var(--text-main)' }}>Kindness Letters.</h1>
                <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-body)', marginTop: '1rem' }}>
                    Send an anonymous message of support to a stranger, or read one left for you.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px' }}>

                {/* Send Letter Block */}
                <div style={{ background: 'var(--secondary-bg)', padding: '3rem', borderRadius: '8px', border: '1px solid var(--text-main)', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-accent)', marginBottom: '1.5rem' }}>Write to a stranger.</h2>
                    <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <textarea
                            className="input-durable"
                            rows="8"
                            value={sendContent}
                            onChange={(e) => setSendContent(e.target.value)}
                            placeholder="Dear stranger, I want you to know..."
                            required
                            style={{ flex: 1, resize: 'vertical', marginBottom: '1.5rem', fontFamily: 'var(--font-body)', fontSize: '1.1rem', padding: '1.5rem' }}
                        />
                        <button type="submit" className="btn-durable" disabled={sending || !sendContent.trim()} style={{ width: '100%' }}>
                            {sending ? 'Sending...' : 'Send Letter'}
                        </button>
                        {sendSuccess && <p style={{ color: 'var(--success)', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold' }}>Sent! You made someone's day.</p>}
                    </form>
                </div>

                {/* Read Letter Block */}
                <div style={{ background: 'var(--accent)', color: 'var(--secondary-bg)', padding: '3rem', borderRadius: '8px', border: '1px solid var(--text-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                    {!readLetter ? (
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-accent)', marginBottom: '1.5rem' }}>Need a kind word?</h2>
                            <button onClick={fetchRandomLetter} className="btn-durable" disabled={reading} style={{ background: 'var(--secondary-bg)', color: 'var(--text-main)', borderColor: 'var(--secondary-bg)' }}>
                                {reading ? 'Opening envelope...' : 'Open a Letter'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-accent)', marginBottom: '2rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>From a stranger:</h2>
                            <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-body)', lineHeight: 1.6, flex: 1, whiteSpace: 'pre-wrap' }}>
                                "{readLetter.content}"
                            </p>
                            <button onClick={() => setReadLetter(null)} className="btn-durable" style={{ background: 'transparent', color: 'var(--secondary-bg)', borderColor: 'var(--secondary-bg)', marginTop: '2rem' }}>
                                Close Letter
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Letters;
