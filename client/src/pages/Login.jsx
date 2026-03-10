import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            background: 'var(--bg-deep)',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '4rem 3rem',
                border: '1px solid var(--border-line)',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                position: 'relative'
            }}>
                <span className="text-technical" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', fontSize: '0.6rem' }}>
                    SECURE_TERMINAL_01
                </span>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', letterSpacing: '0.2em' }}>IDENTITY_SYNC</h1>
                    <p className="text-technical">Access your neural workspace</p>
                </div>

                {error && (
                    <div style={{
                        padding: '1rem', marginBottom: '2rem',
                        border: '1px solid var(--accent-magenta)',
                        background: 'rgba(255, 0, 255, 0.05)',
                        display: 'flex', alignItems: 'center', gap: '0.8rem',
                    }}>
                        <AlertCircle size={16} color="var(--accent-magenta)" />
                        <span style={{ color: 'var(--accent-magenta)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{error.toUpperCase()}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <label className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '0.75rem', display: 'block' }}>USER_EMAIL</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={14} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                name="email" type="email" value={formData.email} onChange={handleChange}
                                placeholder="ENTER_EMAIL" required
                                style={{
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: '1px solid var(--border-line)',
                                    padding: '0.75rem 0 0.75rem 2rem',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '0.75rem', display: 'block' }}>USER_KEY</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={14} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                name="password" type={showPassword ? 'text' : 'password'}
                                value={formData.password} onChange={handleChange}
                                placeholder="••••••••" required
                                style={{
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: '1px solid var(--border-line)',
                                    padding: '0.75rem 2.5rem 0.75rem 2rem',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-mindjoin" style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'SYNCHRONIZING...' : 'AUTHORIZE_ACCESS'}
                    </button>
                </form>

                <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid var(--border-line)', paddingTop: '2rem' }}>
                    <p className="text-technical" style={{ fontSize: '0.7rem' }}>
                        No identity found?{' '}
                        <Link to="/signup" style={{ color: 'var(--accent-teal)', textDecoration: 'none' }}>[ INITIALIZE_NEW ]</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
