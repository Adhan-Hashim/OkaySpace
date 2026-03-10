import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

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
            alert(err.response?.data?.message || 'Failed to create post.');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '620px' }}>
                <button onClick={() => navigate('/dashboard')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.875rem',
                    marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                    fontFamily: 'var(--font-body)', padding: 0,
                    transition: 'color 0.15s',
                }}
                    onMouseEnter={e => e.currentTarget.style.color = '#1a1a1a'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    ← Back
                </button>
                <div className="card" style={{ padding: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Share Something</h1>
                    <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Write what's on your mind — your community is listening.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div>
                            <label className="input-label">Your Post</label>
                            <textarea rows={8} value={content} onChange={e => setContent(e.target.value)}
                                placeholder="What's on your mind? Share your thoughts and feelings..." required
                                className="input-field" style={{ resize: 'vertical', lineHeight: 1.7 }} />
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                            <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)}
                                style={{ width: '16px', height: '16px', accentColor: 'var(--green)', cursor: 'pointer' }} />
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                                Post anonymously (your name won't be shown)
                            </span>
                        </label>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button type="submit" className="btn-primary" disabled={loading || !content.trim()}
                                style={{ flex: 1, opacity: !content.trim() ? 0.5 : 1 }}>
                                {loading ? <><div className="spinner" />Posting...</> : 'Post to Community'}
                            </button>
                            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
