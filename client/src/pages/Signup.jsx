import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '8vw 4vw', display: 'flex', justifyContent: 'center', minHeight: 'calc(100vh - var(--nav-height))' }}>
            <div className="auth-box" style={{ width: '100%', maxWidth: '500px', transform: 'rotate(1deg)' }}>
                <h2 className="heading-lg text-hollow-accent" style={{ fontSize: '4rem', marginBottom: '0.5rem', lineHeight: '1' }}>BECOME.</h2>
                <p style={{ fontFamily: 'var(--font-accent)', textTransform: 'uppercase', marginBottom: '2rem', borderBottom: '4px solid var(--text-main)', paddingBottom: '1rem', fontSize: '1.5rem', color: 'var(--text-main)' }}>
                    NEW CLIENT REGISTRATION
                </p>

                {error && <div style={{ background: 'var(--danger)', color: 'white', padding: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--font-accent)' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontFamily: 'var(--font-accent)', fontWeight: 'bold', marginBottom: '0.5rem' }}>ALIAS IDENTIFIER</label>
                        <input
                            type="text"
                            className="input-brutalist"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="E.G. ASSET_492"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontFamily: 'var(--font-accent)', fontWeight: 'bold', marginBottom: '0.5rem' }}>SECURE EMAIL POST</label>
                        <input
                            type="email"
                            className="input-brutalist"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="CLIENT@VAULT.ORG"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontFamily: 'var(--font-accent)', fontWeight: 'bold', marginBottom: '0.5rem' }}>ENCRYPTION KEY</label>
                        <input
                            type="password"
                            className="input-brutalist"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-brutalist" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'REGISTERING...' : <><UserPlus size={20} /> CREATE LEDGER</>}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontFamily: 'var(--font-accent)' }}>
                    <p>EXISTING CLIENT? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '2px solid var(--accent)' }}>AUTHENTICATE</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
