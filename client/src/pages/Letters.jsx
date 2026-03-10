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
        } catch { console.error('Failed to send letter.'); }
        finally { setSending(false); }
    };

    const fetchRandomLetter = async () => {
        setReading(true);
        try {
            const res = await api.get('/letters/random');
            setReadLetter(res.data);
        } catch (err) {
            console.error('Failed to fetch letter.');
        } finally { setReading(false); }
    };

    return (
        <div style={{ background: 'var(--bg-deep)', minHeight: '100vh', padding: '10rem 10% 4rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-line)' }}>
                    <p className="text-technical" style={{ marginBottom: '1rem' }}>NEURAL_EXCHANGE // ASYNC</p>
                    <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}>KINDNESS_LETTERS</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
                    {/* Write */}
                    <div style={{ border: '1px solid var(--border-line)', padding: '3rem' }}>
                        <p className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '1.5rem' }}>OUTGOING_TRANSMISSION</p>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>ENCODE_SUPPORT</h2>
                        <p className="text-technical" style={{ fontSize: '0.7rem', marginBottom: '2.5rem', opacity: 0.5 }}>Broadcast an anonymous packet of positivity to the network.</p>

                        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <textarea rows={8} value={sendContent} onChange={e => setSendContent(e.target.value)}
                                placeholder="DEAR_STRANGER, I_OPERATE_ON_THE_ASSUMPTION_THAT_YOU..." required
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid var(--border-line)',
                                    padding: '1.5rem',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.7,
                                    outline: 'none',
                                    resize: 'none'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--accent-teal)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-line)'}
                            />
                            <button type="submit" className="btn-mindjoin" disabled={sending || !sendContent.trim()}
                                style={{ background: 'var(--accent-teal)', color: '#000' }}>
                                {sending ? 'TRANSMITTING...' : '[ BROADCAST_LETTER ]'}
                            </button>
                            {sendSuccess && <p className="text-technical" style={{ textAlign: 'center', color: 'var(--accent-teal)', fontSize: '0.7rem' }}>
                                ✓ PACKET_DELIVERED // NETWORK_STABILIZED
                            </p> || <div style={{ height: '1rem' }} />}
                        </form>
                    </div>

                    {/* Read */}
                    <div style={{ border: '1px solid var(--border-line)', padding: '3rem', display: 'flex', flexDirection: 'column' }}>
                        <p className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '1.5rem' }}>INCOMING_PACKET</p>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>DECODE_SYMPATHY</h2>
                        <p className="text-technical" style={{ fontSize: '0.7rem', marginBottom: '2.5rem', opacity: 0.5 }}>Retrieve a randomly assigned kindness module from the archive.</p>

                        {!readLetter ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', border: '1px dashed var(--border-line)', padding: '3rem' }}>
                                <div style={{ fontSize: '2rem', opacity: 0.3 }}>✉️</div>
                                <button onClick={fetchRandomLetter} className="btn-mindjoin" disabled={reading} style={{ width: '100%' }}>
                                    {reading ? 'DECRYPTING...' : '[ INITIALIZE_RECEPTION ]'}
                                </button>
                            </div>
                        ) : (
                            <div style={{ flex: 1 }}>
                                <div className="text-technical" style={{ fontSize: '0.5rem', color: 'var(--accent-teal)', marginBottom: '1rem' }}>SENDER_IDENT: ANONYMOUS_ENTITY</div>
                                <div style={{
                                    fontSize: '1rem',
                                    lineHeight: 1.8,
                                    color: 'var(--text-secondary)',
                                    padding: '2rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--border-line)',
                                    fontFamily: 'var(--font-mono)',
                                    minHeight: '200px'
                                }}>
                                    "{readLetter.content}"
                                </div>
                                <button onClick={() => setReadLetter(null)} className="btn-mindjoin" style={{ marginTop: '2rem', width: '100%', border: '1px solid var(--border-line)', background: 'transparent' }}>
                                    [ TERMINATE_MESSAGE ]
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
