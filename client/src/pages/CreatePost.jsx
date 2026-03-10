import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setLoading(true);
        try {
            await api.post('/posts', { content, anonymous: isAnonymous });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    };

    return (
        <div style={{ background: 'var(--bg-deep)', minHeight: '100vh', padding: '10rem 10% 4rem' }}>
            <div style={{ width: '100%', maxWidth: '800px' }}>
                <button onClick={() => navigate('/dashboard')} className="text-technical" style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.7rem',
                    marginBottom: '3rem', padding: 0
                }}>
                    [ RETURN_TO_COLLECTIVE ]
                </button>

                <div style={{ border: '1px solid var(--border-line)', padding: '4rem' }}>
                    <p className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '1.5rem' }}>THOUGHT_TRANSMISSION // INITIALIZE</p>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>BROADCAST_MOD</h1>
                    <p className="text-technical" style={{ marginBottom: '4rem', opacity: 0.5 }}>Your neural signature will be processed according to selected protocols.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <div>
                            <label className="text-technical" style={{ display: 'block', fontSize: '0.6rem', marginBottom: '1.5rem' }}>THOUGHT_STREAM_INPUT</label>
                            <textarea rows={10} value={content} onChange={e => setContent(e.target.value)}
                                placeholder="ENTER_CONTENT..." required
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid var(--border-line)',
                                    padding: '2rem',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '1rem',
                                    lineHeight: 1.8,
                                    outline: 'none',
                                    resize: 'none'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--border-active)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-line)'}
                            />
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', userSelect: 'none' }}>
                            <div style={{
                                width: '18px',
                                height: '18px',
                                border: '1px solid var(--border-line)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isAnonymous ? 'var(--accent-teal)' : 'transparent'
                            }}>
                                <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)}
                                    style={{ display: 'none' }} />
                                {isAnonymous && <div style={{ width: '8px', height: '8px', background: '#000' }} />}
                            </div>
                            <span className="text-technical" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                                ENABLE_ANONYMOUS_ENCRYPTION_LAYER
                            </span>
                        </label>

                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
                            <button type="submit" className="btn-mindjoin" disabled={loading || !content.trim()}
                                style={{ flex: 1, background: 'var(--accent-teal)', color: '#000' }}>
                                {loading ? 'TRANSMITTING...' : '[ INITIALIZE_BROADCAST ]'}
                            </button>
                            <button type="button" onClick={() => navigate('/dashboard')} className="btn-mindjoin" style={{ background: 'transparent', border: '1px solid var(--border-line)', color: 'var(--text-muted)' }}>
                                [ ABORT ]
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
