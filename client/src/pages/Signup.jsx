import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const PARTICLE_FORMS = [
    'Blue Cubes (Male)',
    'Pink Orbs (Female)',
    'Green Dust (Neutral)',
    'Golden Stars (Custom)',
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
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all fields'); setLoading(false); return;
        }
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Sign up failed. Please try again.');
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
            background: 'var(--bg)',
        }}>
            <div className="card fade-in-up" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--green)', marginBottom: '0.4rem' }}>Join Us</h1>
                    <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>Start your healing journey</p>
                </div>

                {error && (
                    <div style={{
                        padding: '0.75rem 1rem', marginBottom: '1.25rem',
                        background: '#fef2f2', border: '1px solid #fecaca',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem',
                    }}>
                        <AlertCircle size={16} color="#ef4444" />
                        <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {/* Full Name */}
                    <div>
                        <label className="input-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
                            <input
                                name="name" type="text" value={formData.name} onChange={handleChange}
                                placeholder="Your name" required className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="input-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
                            <input
                                name="email" type="email" value={formData.email} onChange={handleChange}
                                placeholder="you@example.com" required className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    {/* Particle Form */}
                    <div>
                        <label className="input-label">Particle Form</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                name="particleForm"
                                value={formData.particleForm}
                                onChange={handleChange}
                                className="input-field"
                                style={{ appearance: 'none', cursor: 'pointer', paddingRight: '2rem' }}
                            >
                                {PARTICLE_FORMS.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                            {/* Dropdown arrow */}
                            <svg style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                                <polyline points="6,9 12,15 18,9" />
                            </svg>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
                            <input
                                name="password" type={showPassword ? 'text' : 'password'}
                                value={formData.password} onChange={handleChange}
                                placeholder="••••••••" required className="input-field"
                                style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex', alignItems: 'center' }}>
                                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem' }}>
                        {loading ? <><div className="spinner" />Creating account...</> : <><span>⊕</span> Create Account</>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-sub)', fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--green)', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
