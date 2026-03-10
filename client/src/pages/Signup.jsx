import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const PARTICLE_FORMS = [
    'BLUE_CUBE // MALE',
    'PINK_ORB // FEMALE',
    'GREEN_DUST // NEUTRAL',
    'GOLDEN_STAR // CUSTOM',
];

const Signup = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', particleForm: PARTICLE_FORMS[0] });
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
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Initialization failed.');
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
                position: 'relative',
                marginTop: '4rem',
                marginBottom: '4rem'
            }}>
                <span className="text-technical" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '0.6rem' }}>
                    NEW_ENTITY_REGS_01
                </span>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', letterSpacing: '0.2em' }}>ENTITY_INITIALIZE</h1>
                    <p className="text-technical">Begin your neural trajectory</p>
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
                        <label className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '0.75rem', display: 'block' }}>ENTITY_NAME</label>
                        <div style={{ position: 'relative' }}>
                            <User size={14} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                name="name" type="text" value={formData.name} onChange={handleChange}
                                placeholder="ENTER_NAME" required
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
                        <label className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '0.75rem', display: 'block' }}>ENTITY_EMAIL</label>
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
                        <label className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '0.75rem', display: 'block' }}>PARTICLE_FORM</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                name="particleForm"
                                value={formData.particleForm}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: '1px solid var(--border-line)',
                                    padding: '0.75rem 0.5rem 0.75rem 0',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                    appearance: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {PARTICLE_FORMS.map(f => (
                                    <option key={f} value={f} style={{ background: '#111' }}>{f}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '0.75rem', display: 'block' }}>SECURE_KEY</label>
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
                        {loading ? 'INITIALIZING...' : 'ACTIVATE_INTERFACE'}
                    </button>
                </form>

                <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid var(--border-line)', paddingTop: '2rem' }}>
                    <p className="text-technical" style={{ fontSize: '0.7rem' }}>
                        Already synced?{' '}
                        <Link to="/login" style={{ color: 'var(--accent-teal)', textDecoration: 'none' }}>[ RESUME_SESSION ]</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
