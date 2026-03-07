import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
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
            if (err.response && err.response.status === 400) {
                alert(err.response.data.message);
            } else {
                alert('FAILED TO RECORD DEPOSIT.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '8vw 4vw', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '800px', background: 'white', border: '4px solid var(--text-main)', padding: '4rem', boxShadow: '16px 16px 0px var(--accent)' }}>

                <h2 className="heading-lg" style={{ fontSize: '3rem', marginBottom: '1rem' }}>EMOTIONAL DEPOSIT</h2>
                <p style={{ fontFamily: 'var(--font-accent)', fontSize: '1.25rem', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '2px solid var(--text-main)' }}>
                    RECORD YOUR THOUGHTS IN THE LEDGER.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontFamily: 'var(--font-accent)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.25rem' }}>TRANSMISSION DATA</label>
                        <textarea
                            className="input-brutalist"
                            rows="6"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="ENTER RAW EMOTIONAL DATA HERE..."
                            required
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="checkbox"
                            id="anonymous"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            style={{ width: '24px', height: '24px', accentColor: 'var(--text-main)' }}
                        />
                        <label htmlFor="anonymous" style={{ fontFamily: 'var(--font-accent)', fontSize: '1.25rem', cursor: 'pointer' }}>
                            ENCRYPT IDENTITY (POST ANONYMOUSLY)
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <button type="submit" className="btn-brutalist" style={{ flex: 1 }} disabled={loading || !content.trim()}>
                            {loading ? 'PROCESSING...' : 'COMMIT TO LEDGER'}
                        </button>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn-brutalist" style={{ background: 'transparent', color: 'var(--text-main)' }}>
                            CANCEL
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default CreatePost;
